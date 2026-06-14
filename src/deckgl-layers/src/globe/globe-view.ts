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

        // Project the original lnglat to find where it appears after zoom
        const projected = zoomedViewport.project([startZoomLngLat[0], startZoomLngLat[1]]);

        // Compute pixel offset from cursor position
        const dx = projected[0] - pos[0];
        const dy = projected[1] - pos[1];

        // Use panByPosition to shift the center so the point returns to cursor
        // panByPosition([lng, lat, zoom], targetPixel, sourcePixel)
        // It rotates the center to move a point from sourcePixel to targetPixel
        const centerPixel: [number, number] = [zoomedViewport.width / 2, zoomedViewport.height / 2];
        const shiftedCenterPixel: [number, number] = [centerPixel[0] + dx, centerPixel[1] + dy];
        const newProps = zoomedViewport.panByPosition(
          [viewportProps.longitude, viewportProps.latitude, zoom],
          centerPixel,
          shiftedCenterPixel
        );

        return (this as any)._getUpdatedState({
          zoom: newProps.zoom ?? zoom,
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
