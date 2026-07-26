// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as DeckCore from '@deck.gl/core';
import {clamp} from '@math.gl/core';
import {GLOBE_MAX_LATITUDE} from '@kepler.gl/constants';

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

    // Create patched GlobeState that supports zoom-to-cursor
    this.ControllerState = class PatchedGlobeState extends OriginalGlobeState {
      // Constrain the camera target to a latitude band around the equator so the
      // view can't be centered on the poles. deck.gl's applyConstraints clamps
      // latitude to ~85°, which still lets the camera look straight at a pole.
      applyConstraints(props: any) {
        const result = (super.applyConstraints as any)(props);
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

        if (!startZoomLngLat) {
          // Discrete (wheel) zoom: re-derive the anchor each tick from the current
          // view. For pinch, startZoom/startZoomLngLat are set once by zoomStart and
          // preserved across ticks by _getUpdatedState (which spreads getState()).
          startZoom = (this as any).getViewportProps().zoom;
          startZoomLngLat = (this as any)._unproject(startPos) || (this as any)._unproject(pos);
        }
        if (!startZoomLngLat) {
          return this;
        }

        const currentProps = (this as any).getViewportProps();
        const zoom = (this as any)._constrainZoom(startZoom + Math.log2(scale));

        // Zoom-out (scale < 1): exact cursor anchoring is unstable on a globe (the
        // geo point under an off-center pixel moves non-linearly near the limb and
        // drags the view toward the poles). Instead, gently steer the CENTER toward
        // the geo location under the cursor — the map recenters on the cursor as you
        // zoom out, similar in spirit to zoom-in, but without the pole-ward spin.
        if (scale < 1) {
          const cursorLngLat = startZoomLngLat;
          const cursorValid =
            Array.isArray(cursorLngLat) &&
            Number.isFinite(cursorLngLat[0]) &&
            Number.isFinite(cursorLngLat[1]);
          if (!cursorValid) {
            return (this as any)._getUpdatedState({zoom});
          }

          // Fraction of the way to move the center toward the cursor per tick.
          // Scales with how much we zoomed out this tick so a bigger step moves
          // more. Clamped so a single large tick can't overshoot.
          const RECENTER_STRENGTH = 0.11;
          const t = Math.min(1, (1 - scale) * RECENTER_STRENGTH);

          // Shortest-path longitude interpolation (handle antimeridian wrap).
          let dLng = cursorLngLat[0] - currentProps.longitude;
          if (dLng > 180) dLng -= 360;
          if (dLng < -180) dLng += 360;

          return (this as any)._getUpdatedState({
            zoom,
            longitude: currentProps.longitude + dLng * t,
            latitude: currentProps.latitude + (cursorLngLat[1] - currentProps.latitude) * t
          });
        }

        const zoomedViewport = (this as any).makeViewport({
          ...currentProps,
          zoom
        });

        // Anchor the grabbed geo point back under the cursor:
        //   fromPosition = viewport.unproject(pos)   // geo point now under the cursor
        //   longitude = startZoomLngLat[0] - fromPosition[0] + viewport.longitude
        //   latitude  = startZoomLngLat[1] - fromPosition[1] + viewport.latitude
        const fromPosition = zoomedViewport.unproject(pos);

        // Guard: unproject can return NaN/undefined for a pixel off the sphere
        // silhouette; in that case just apply the new zoom about the center.
        const anchorValid =
          Array.isArray(fromPosition) &&
          Number.isFinite(fromPosition[0]) &&
          Number.isFinite(fromPosition[1]);
        if (!anchorValid) {
          return (this as any)._getUpdatedState({zoom});
        }

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
        return (this as any)._getUpdatedState({
          startPanLngLat: (this as any)._unproject(pos)
        });
      }

      pan({pos, startPos}: {pos: [number, number]; startPos?: [number, number]}) {
        const startPanLngLat =
          (this as any).getState().startPanLngLat || (this as any)._unproject(startPos);
        if (!startPanLngLat) {
          return this;
        }

        const props = (this as any).getViewportProps();
        const viewport = (this as any).makeViewport(props);
        const fromPosition = viewport.unproject(pos);

        // Guard: pixels off the sphere silhouette unproject to NaN/undefined.
        const valid =
          Array.isArray(fromPosition) &&
          Number.isFinite(fromPosition[0]) &&
          Number.isFinite(fromPosition[1]);
        if (!valid) {
          return this;
        }

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
