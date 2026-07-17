// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  _GlobeView as DeckGlobeView,
  _GlobeController as GlobeController
} from '@deck.gl/core';

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
