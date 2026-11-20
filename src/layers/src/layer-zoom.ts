// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {MAX_LATITUDE} from '@math.gl/web-mercator';

export type LayerZoomState = {
  zoom: number;
  zoomOffset?: number;
  latitude?: number;
  globe?: {enabled?: boolean};
};

/** Zoom for visual sizing only; preserve stored zoom for projection and aggregation. */
export function getVisualZoom(mapState: LayerZoomState): number {
  if (!mapState.globe?.enabled) {
    return mapState.zoom;
  }

  // Match GlobeViewport's latitude clamp and undo GlobeController's pan
  // compensation, which changes stored zoom without changing camera distance.
  const latitude = Math.max(-MAX_LATITUDE, Math.min(MAX_LATITUDE, mapState.latitude || 0));
  return mapState.zoom - Math.log2(Math.cos((latitude * Math.PI) / 180));
}
