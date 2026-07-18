// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  _GlobeView as DeckGlobeView,
  _GlobeController as GlobeController
} from '@deck.gl/core';
import {clamp} from '@math.gl/core';
import {GLOBE_MAX_LATITUDE} from '@kepler.gl/constants';

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
 * globe under the cursor while zooming, matching the behavior of deck.gl 8.x
 * and MapController.
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

      // Zoom-to-cursor, ported verbatim from deck.gl 8.9.x MapState.zoom() +
      // GlobeViewport.panByPosition(coords, pixel) — which is what studio-monorepo
      // uses and where zoom-to-cursor tracks the cursor accurately over a whole
      // gesture. deck.gl 9.x regressed this in two ways that we avoid here:
      //   1. Its GlobeState.zoom() ignores the cursor and zooms toward the center.
      //   2. Its GlobeViewport.panByPosition became a lossy, *linearized* 3-arg
      //      rotation (longitude += (0.25/scale)*(startPixel-pixel), re-derives
      //      zoom). Using it per wheel tick accumulates error, so after a long
      //      continuous zoom the point ends up noticeably shifted from what was
      //      originally under the cursor.
      // The 8.9.x recenter below is an *exact absolute* translation: unproject the
      // cursor pixel in the zoomed viewport to get the geo point currently under it,
      // then shift the center by (anchor - thatPoint). No zoom coupling, no
      // rotationSpeed, and it applies to zoom-in and zoom-out symmetrically, so
      // there is no per-tick accumulated drift.
      zoom({pos, startPos, scale}: {pos: [number, number]; startPos?: [number, number]; scale: number}) {
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

        const zoom = (this as any)._constrainZoom(startZoom + Math.log2(scale));
        const zoomedViewport = (this as any).makeViewport({
          ...(this as any).getViewportProps(),
          zoom
        });

        // 8.9.x GlobeViewport.panByPosition(startZoomLngLat, pos):
        //   fromPosition = viewport.unproject(pos)   // geo point now under the cursor
        //   longitude = startZoomLngLat[0] - fromPosition[0] + viewport.longitude
        //   latitude  = startZoomLngLat[1] - fromPosition[1] + viewport.latitude
        const fromPosition = zoomedViewport.unproject(pos);
        return (this as any)._getUpdatedState({
          zoom,
          longitude: startZoomLngLat[0] - fromPosition[0] + zoomedViewport.longitude,
          latitude: startZoomLngLat[1] - fromPosition[1] + zoomedViewport.latitude
        });
      }

      // Clear the persisted pinch anchor at gesture end (matches 8.9.x).
      zoomEnd() {
        return (this as any)._getUpdatedState({
          startZoom: null,
          startZoomLngLat: null
        });
      }
    } as any;
  }
}

/**
 * Custom GlobeView that uses zoom-to-cursor controller behavior.
 */
export class KeplerGlobeView extends DeckGlobeView {
  get ControllerType() {
    return ZoomToCursorGlobeController;
  }
}

KeplerGlobeView.displayName = 'KeplerGlobeView';
