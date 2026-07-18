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

      zoom({pos, startPos, scale}: {pos: [number, number]; startPos?: [number, number]; scale: number}) {
        let {startZoom, startZoomLngLat} = (this as any).getState();

        if (!startZoomLngLat) {
          startZoom = (this as any).getViewportProps().zoom;
          startZoomLngLat = (this as any)._unproject(startPos) || (this as any)._unproject(pos);
        }
        if (!startZoomLngLat) {
          return this;
        }

        const zoom = (this as any)._constrainZoom(startZoom + Math.log2(scale));
        const viewportProps = (this as any).getViewportProps();

        // Only apply zoom-to-cursor when zooming IN (scale > 1). When zooming out
        // the natural behavior is to pull straight back from the current center;
        // recentering toward the cursor on every zoom-out step rotates the globe
        // and, off the equator, causes the center to drift toward the poles.
        if (scale <= 1) {
          return (this as any)._getUpdatedState({zoom});
        }

        // Create viewport at new zoom with current center
        const zoomedViewport = (this as any).makeViewport({...viewportProps, zoom});

        // Compute the new center that keeps `startZoomLngLat` under the cursor `pos`.
        // GlobeViewport.panByPosition rotates the center so that the point currently
        // shown at `startPixel` moves to `pixel`. The geo point under the cursor is
        // currently rendered at its projected pixel, and we want it to stay at `pos`.
        const projected = zoomedViewport.project([startZoomLngLat[0], startZoomLngLat[1]]);
        const newProps = zoomedViewport.panByPosition(
          [viewportProps.longitude, viewportProps.latitude, zoom],
          pos,
          projected
        );

        // Only adopt the recentered longitude/latitude. We intentionally keep the
        // explicitly-computed `zoom` instead of `newProps.zoom`: GlobeViewport.panByPosition
        // re-derives zoom from a latitude-dependent adjustment, and applyConstraints applies
        // the same adjustment again, double-correcting zoom on every wheel tick and causing
        // the view to jump in/out instead of zooming smoothly.
        return (this as any)._getUpdatedState({
          zoom,
          longitude: newProps.longitude,
          latitude: newProps.latitude
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
