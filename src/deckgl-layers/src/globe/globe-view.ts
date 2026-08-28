// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as DeckCore from '@deck.gl/core';
import {clamp, vec4} from '@math.gl/core';
import {GLOBE_MAX_LATITUDE} from '@kepler.gl/constants';
import {GLOBE_COMMON_RADIUS} from './globe-depth-disk-layer';

// deck.gl exposes GlobeView / GlobeController as experimental, underscore-prefixed
// members. Their named type bindings aren't reliably resolvable through the
// package barrel under this project's module resolution, so we pull them off the
// namespace with a loose type. Runtime behavior is unchanged.
const DeckGlobeView = (DeckCore as any)._GlobeView as any;
const GlobeController = (DeckCore as any)._GlobeController as any;
const DeckGlobeViewport = (DeckCore as any)._GlobeViewport as any;

/**
 * Latitude-based zoom adjustment used by deck.gl's GlobeViewport, replicated
 * here so our custom `_constrainZoom` matches deck.gl's coordinate math.
 * See @deck.gl/core globe-viewport.js `zoomAdjust`.
 */
function zoomAdjust(latitude: number): number {
  return Math.log2(Math.PI * Math.cos((latitude * Math.PI) / 180));
}

/**
 * Returns true if the screen pixel `pos` lies within the visible globe
 * silhouette.
 *
 * GlobeViewport.unproject() clamps the ray–sphere discriminant with
 * Math.max(0, r²−d²), so it always returns a valid lng/lat even for
 * off-globe pixels (snapping to the limb).  We replicate the same ray cast
 * but check the discriminant before the clamp using the standard
 * squared-distance-from-origin-to-ray formula: |P₀ × dir|² / |dir|².
 */
function isPixelOnGlobe(viewport: any, pos: [number, number]): boolean {
  const m: number[] = viewport.pixelUnprojectionMatrix;
  if (!m) return true; // conservative fallback if matrix unavailable

  // Cast a ray through the pixel at the near and far planes.
  const p0 = vec4.transformMat4([], [pos[0], pos[1], -1, 1], m);
  const p1 = vec4.transformMat4([], [pos[0], pos[1], 1, 1], m);
  if (p0[3] === 0 || p1[3] === 0) return true; // degenerate projection

  // Perspective-divide to world space.
  const ax = p0[0] / p0[3], ay = p0[1] / p0[3], az = p0[2] / p0[3];
  const bx = p1[0] / p1[3], by = p1[1] / p1[3], bz = p1[2] / p1[3];

  // Ray direction.
  const dx = bx - ax, dy = by - ay, dz = bz - az;

  // Squared distance from the origin (globe center) to the ray:
  //   d² = |P₀ × dir|² / |dir|²
  const cx = ay * dz - az * dy;
  const cy = az * dx - ax * dz;
  const cz = ax * dy - ay * dx;
  const dSqr = (cx * cx + cy * cy + cz * cz) / (dx * dx + dy * dy + dz * dz);

  return dSqr <= GLOBE_COMMON_RADIUS * GLOBE_COMMON_RADIUS;
}

/**
 * Custom GlobeController that restores zoom-to-cursor behavior.
 *
 * In deck.gl 9.x, the default GlobeController's GlobeState.zoom() ignores the
 * cursor position and always zooms toward the center. This controller patches
 * that behavior by overriding the ControllerState's zoom method to pan the
 * globe under the cursor while zooming, so zoom-to-cursor works the same way it
 * does for the 2D MapController.
 */
class ZoomToCursorGlobeController extends GlobeController {
  constructor(...args: any[]) {
    super(...args);
    const OriginalGlobeState = this.ControllerState;

    // Tracks when the most recent off-globe wheel-zoom tick fired.
    // Stored as a controller-level closure variable rather than in ViewState
    // because deck.gl's Controller never calls zoomEnd() for wheel events —
    // only for pinch/touch — so there is no reliable hook to clear a
    // ViewState-based sentinel after a wheel scroll session ends.
    // A simple timestamp lets us detect when a new scroll burst has started
    // (> BURST_TIMEOUT_MS since the last off-globe tick) so cursor-anchored
    // zoom can resume naturally on the next independent scroll.
    let offGlobeZoomAt: number | null = null;

    // Create patched GlobeState that supports zoom-to-cursor
    this.ControllerState = class PatchedGlobeState extends OriginalGlobeState {
      // Constrain the camera target to a latitude band around the equator so the
      // view can't be centered on the poles. deck.gl's applyConstraints clamps
      // latitude to ~85°, which still lets the camera look straight at a pole.
      applyConstraints(props: any) {
        const result = super.applyConstraints(props);
        const clampedLatitude = clamp(result.latitude, -GLOBE_MAX_LATITUDE, GLOBE_MAX_LATITUDE);
        if (clampedLatitude !== result.latitude) {
          // deck.gl couples zoom to latitude via zoomAdjust; when we further
          // clamp latitude, re-apply the same delta so zoom stays consistent.
          result.zoom += zoomAdjust(clampedLatitude) - zoomAdjust(result.latitude);
          result.latitude = clampedLatitude;
        }
        return result;
      }

      // deck.gl's GlobeState._constrainZoom derives a minimum zoom from `maxBounds`
      // that forces the globe to fill the viewport. That bounds-based minimum
      // (~3 for a typical window) overrides any configured `minZoom`, so the user
      // can never zoom out far enough to see the whole globe small on screen.
      // Override it to honor only the configured minZoom/maxZoom (plus the same
      // latitude adjustment deck.gl uses), ignoring the bounds-based floor.
      _constrainZoom(zoom: number, props?: any) {
        props = props || (this as any).getViewportProps();
        const {latitude, maxZoom} = props;
        let {minZoom} = props;
        if (minZoom === undefined || minZoom === null) {
          minZoom = 0;
        }
        const ZOOM0 = zoomAdjust(0);
        const zoomAdjustment = zoomAdjust(latitude) - ZOOM0;
        return clamp(zoom, minZoom + zoomAdjustment, maxZoom + zoomAdjustment);
      }

      // Exact zoom-to-cursor. deck.gl 9.x's GlobeController does not keep the point
      // under the cursor fixed while zooming, in two ways we work around here:
      //   1. Its GlobeState.zoom() ignores the cursor and zooms toward the center.
      //   2. Its GlobeViewport.panByPosition is a lossy, *linearized* 3-arg
      //      rotation (longitude += (0.25/scale)*(startPixel-pixel), re-derives
      //      zoom). Using it per wheel tick accumulates error, so after a long
      //      continuous zoom the point ends up noticeably shifted from what was
      //      originally under the cursor.
      // The recenter below is an *exact absolute* translation: unproject the
      // cursor pixel in the zoomed viewport to get the geo point currently under it,
      // then shift the center by (anchor - thatPoint). No zoom coupling, no
      // rotationSpeed, and it applies to zoom-in and zoom-out symmetrically, so
      // there is no per-tick accumulated drift.
      zoom({
        pos,
        startPos,
        scale
      }: {
        pos: [number, number];
        startPos?: [number, number];
        scale: number;
      }) {
        let {startZoom, startZoomLngLat} = (this as any).getState();
        const currentProps = (this as any).getViewportProps();

        if (!startZoomLngLat) {
          // Wheel zoom: re-derive anchor each tick (pinch sets it once in zoomStart).
          startZoom = currentProps.zoom;

          // Suppress cursor-anchoring when the cursor is off-globe or when a
          // recent tick was off-globe (within BURST_TIMEOUT_MS).  deck.gl never
          // calls zoomEnd() for wheel events so we track the session with the
          // closure variable `offGlobeZoomAt` rather than ViewState.
          const BURST_TIMEOUT_MS = 200;
          const now = Date.now();
          const anchorViewport = (this as any).makeViewport(currentProps);
          const onGlobe = isPixelOnGlobe(anchorViewport, startPos || pos);

          if (!onGlobe) offGlobeZoomAt = now;

          if (!onGlobe || (offGlobeZoomAt !== null && now - offGlobeZoomAt < BURST_TIMEOUT_MS)) {
            const zoom = (this as any)._constrainZoom(startZoom + Math.log2(scale));
            return (this as any)._getUpdatedState({zoom});
          }

          offGlobeZoomAt = null;
          startZoomLngLat = (this as any)._unproject(startPos) || (this as any)._unproject(pos);
        }

        const zoom = (this as any)._constrainZoom(startZoom + Math.log2(scale));

        if (!startZoomLngLat) {
          return (this as any)._getUpdatedState({zoom});
        }

        // Zoom-out (scale < 1): exact cursor anchoring is unstable near the limb
        // (non-linear geo-to-pixel mapping pulls the view toward the poles).
        // Instead, gently steer the center toward the cursor location per tick.
        if (scale < 1) {
          if (
            !Array.isArray(startZoomLngLat) ||
            !Number.isFinite(startZoomLngLat[0]) ||
            !Number.isFinite(startZoomLngLat[1])
          ) {
            return (this as any)._getUpdatedState({zoom});
          }

          // Per-tick lerp strength scales with zoom-out amount; clamped to avoid overshoot.
          const t = Math.min(1, (1 - scale) * 0.11);

          // Shortest-path longitude interpolation (handles antimeridian wrap).
          let dLng = startZoomLngLat[0] - currentProps.longitude;
          if (dLng > 180) dLng -= 360;
          if (dLng < -180) dLng += 360;

          return (this as any)._getUpdatedState({
            zoom,
            longitude: currentProps.longitude + dLng * t,
            latitude: currentProps.latitude + (startZoomLngLat[1] - currentProps.latitude) * t
          });
        }

        const zoomedViewport = (this as any).makeViewport({
          ...currentProps,
          zoom
        });

        // Zoom-in: exact anchor — unproject the cursor in the post-zoom viewport and
        // shift the center so the grabbed geo point lands back under the cursor.
        // Guard with isPixelOnGlobe: if pos moved off-globe during a fast pinch,
        // fall back to center zoom.
        if (!isPixelOnGlobe(zoomedViewport, pos)) {
          return (this as any)._getUpdatedState({zoom});
        }

        const fromPosition = zoomedViewport.unproject(pos);

        return (this as any)._getUpdatedState({
          zoom,
          longitude: startZoomLngLat[0] - fromPosition[0] + zoomedViewport.longitude,
          latitude: startZoomLngLat[1] - fromPosition[1] + zoomedViewport.latitude
        });
      }

      // Clear the persisted pinch anchor at gesture end.
      zoomEnd() {
        return (this as any)._getUpdatedState({
          startZoom: null,
          startZoomLngLat: null
        });
      }

      // Exact, cursor-anchored pan: the geo point grabbed on mousedown stays
      // locked under the cursor for the whole drag.
      //
      // deck.gl 9.x's GlobeController pans with a *linearized, center-anchored*
      // rotation (GlobeViewport.panByPosition([lng,lat,zoom], pixel, startPixel):
      // longitude += (0.25/scale)*(startPixel-pixel)). Because the anchor is the
      // view CENTER rather than the grabbed point, the first drag frame snaps the
      // center to satisfy the linear approximation, producing the visible "jump to
      // the side/up" at the start of a pan (most noticeable at high zoom), after
      // which incremental deltas track fine. The exact anchor below removes that
      // first-frame snap.
      panStart({pos}: {pos: [number, number]}) {
        const viewport = (this as any).makeViewport((this as any).getViewportProps());
        // If the mousedown pixel is outside the globe silhouette, store `false`
        // as an explicit sentinel so that every subsequent `pan` call for this
        // gesture is a no-op.  We can't rely on `_unproject(pos)` returning
        // undefined here because GlobeViewport.unproject clamps the
        // ray–sphere discriminant to 0 via Math.max(0, …), which means it
        // always returns a valid-looking lng/lat even for off-globe pixels.
        if (!isPixelOnGlobe(viewport, pos)) {
          return (this as any)._getUpdatedState({startPanLngLat: false});
        }
        return (this as any)._getUpdatedState({
          startPanLngLat: (this as any)._unproject(pos)
        });
      }

      pan({pos, startPos}: {pos: [number, number]; startPos?: [number, number]}) {
        const storedStart = (this as any).getState().startPanLngLat;

        const props = (this as any).getViewportProps();
        const viewport = (this as any).makeViewport(props);

        // `false` means the drag started outside the globe. If the cursor has
        // now moved onto the globe, latch the current position as the anchor
        // so rotation begins from the entry point. Otherwise stay frozen.
        if (storedStart === false) {
          if (!isPixelOnGlobe(viewport, pos)) {
            return this;
          }
          // Cursor just entered the globe — establish the anchor and return
          // without moving; the next pan event will apply the first delta.
          return (this as any)._getUpdatedState({
            startPanLngLat: (this as any)._unproject(pos)
          });
        }

        const startPanLngLat = storedStart || (this as any)._unproject(startPos);
        if (!startPanLngLat) {
          return this;
        }

        // Once the cursor leaves the globe silhouette mid-drag, freeze the view.
        // viewport.unproject() snaps off-globe pixels to the nearest limb point
        // (via Math.max(0, …) in its ray–sphere discriminant), so without this
        // guard the globe would keep rotating toward the edge as the cursor moves
        // further outside.
        if (!isPixelOnGlobe(viewport, pos)) {
          return this;
        }

        const fromPosition = viewport.unproject(pos);

        const longitude = startPanLngLat[0] - fromPosition[0] + props.longitude;
        let latitude = startPanLngLat[1] - fromPosition[1] + props.latitude;
        latitude = clamp(latitude, -GLOBE_MAX_LATITUDE, GLOBE_MAX_LATITUDE);

        // deck.gl 9's GlobeViewport scale = 2^(zoom - zoomAdjust(latitude)), so a
        // constant zoom would make the globe grow on screen as the center moves
        // toward the poles. Re-couple zoom to the new latitude (as deck.gl 9's own
        // pan does) to keep the on-screen scale — and thus tile LOD — constant.
        const visualZoom = props.zoom - zoomAdjust(props.latitude);
        const zoom = visualZoom + zoomAdjust(latitude);

        return (this as any)._getUpdatedState({longitude, latitude, zoom});
      }

      panEnd() {
        return (this as any)._getUpdatedState({startPanLngLat: null});
      }
    } as any;
  }
}

/**
 * Custom GlobeView that uses zoom-to-cursor controller behavior.
 */
export class KeplerGlobeView extends DeckGlobeView {
  // Forward constructor props to deck.gl's GlobeView. Declared explicitly because
  // the base class is loosely typed (see DeckGlobeView above), which would
  // otherwise surface a parameterless constructor to callers.
  constructor(props?: any) {
    super(props);
  }

  get ControllerType() {
    return ZoomToCursorGlobeController;
  }

  // deck.gl 9's GlobeView.getViewportType() swaps the viewport class based on zoom:
  //   `return viewState.zoom > 12 ? WebMercatorViewport : GlobeViewport;`
  // Crossing zoom 12 therefore recomputes tile bounds with completely different
  // projection math (globe vs flat mercator). That makes deck's TileLayer/MVTLayer
  // reselect tiles inconsistently across the boundary — mixed LODs (e.g. a z4 tile
  // next to z11), a visible "flicker" at 12, and tiles that get dropped and stick
  // as black/empty quads (most often crossing 12 on the way *out*).
  //
  // Force GlobeViewport at every zoom to eliminate the z=12 viewport swap so tile
  // selection stays consistent. The trade-off is that zoom > 12 now uses float32
  // globe precision (deck's documented "no high-precision rendering > 12" limit)
  // instead of switching to mercator — far preferable to the black quads.
  getViewportType() {
    return DeckGlobeViewport;
  }
}

KeplerGlobeView.displayName = 'KeplerGlobeView';
