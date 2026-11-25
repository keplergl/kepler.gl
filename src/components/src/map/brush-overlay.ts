// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {project, WebMercatorViewport} from '@deck.gl/core';
import type {Viewport} from '@deck.gl/core';
import {ScatterplotLayer} from '@deck.gl/layers';
import {KeplerGlobeView} from '@kepler.gl/deckgl-layers';
import type {Brush, MapState} from '@kepler.gl/types';

export function getBrushLayers({
  brush,
  mousePosition,
  mapState
}: {
  brush: Brush;
  mousePosition: [number, number] | null;
  mapState: MapState;
}): ScatterplotLayer[] {
  const {width, height} = mapState;
  if (
    !brush.enabled ||
    !brush.config.showBrush ||
    !Number.isFinite(brush.config.size) ||
    brush.config.size <= 0 ||
    !mousePosition ||
    !mousePosition.every(Number.isFinite) ||
    mousePosition[0] < 0 ||
    mousePosition[0] >= width ||
    mousePosition[1] < 0 ||
    mousePosition[1] >= height
  ) {
    return [];
  }

  const isGlobeMode = Boolean(mapState.globe?.enabled);
  const viewport: Viewport = isGlobeMode
    ? new KeplerGlobeView({resolution: 5}).makeViewport({width, height, viewState: mapState})
    : new WebMercatorViewport(mapState);
  const position = viewport.unproject(mousePosition);
  if (!position.every(Number.isFinite)) return [];
  const {commonUnitsPerMeter} = project.getUniforms({viewport}) as {
    commonUnitsPerMeter: [number, number, number];
  };

  return [
    new ScatterplotLayer({
      id: 'brush-radius',
      data: [position],
      getPosition: point => point,
      // BrushingExtension compares common-space XY distances using this scale.
      // Meter-sized scatterplots apply an additional latitude correction in
      // low-zoom Mercator, which would make the preview exceed the filter.
      getRadius: brush.config.size * 1000 * commonUnitsPerMeter[0],
      radiusUnits: 'common',
      // This minimum keeps a cursor indicator visible when the actual brush is tiny.
      // It does not change the filtering radius.
      radiusMinPixels: 5,
      stroked: true,
      getFillColor: [27, 190, 220, 20],
      getLineColor: [27, 190, 220, 230],
      getLineWidth: 2,
      lineWidthUnits: 'pixels',
      pickable: false,
      parameters: isGlobeMode ? undefined : {depthCompare: 'always', depthWriteEnabled: false}
    })
  ];
}
