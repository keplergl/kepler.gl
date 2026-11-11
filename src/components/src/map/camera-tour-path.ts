// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {PathLayer, ScatterplotLayer, TextLayer} from '@deck.gl/layers';
import type {ScatterplotLayerProps} from '@deck.gl/layers';
import type {CameraTour} from '@kepler.gl/types';
import {normalizeCameraTour} from '@kepler.gl/utils';

// The geometry depends only on the tour, not mouse/pan/playback state. Keep the
// data references stable so deck does not rebuild attributes during navigation.
const cache = new WeakMap<CameraTour, ReturnType<typeof createPathData>>();
function createPathData(tour: CameraTour) {
  const stops = normalizeCameraTour(tour)?.stops || [];
  if (!stops.length) return null;
  const data = stops.map((stop, index) => ({
    id: stop.id,
    position: [stop.camera.longitude, stop.camera.latitude] as [number, number],
    label: `${index + 1}. ${stop.name}`
  }));
  return {data, path: [{path: data.map(stop => stop.position)}]};
}

export function getCameraTourPathLayers(
  tour?: CameraTour | null,
  dragHandlers?: Pick<ScatterplotLayerProps, 'onDragStart' | 'onDrag' | 'onDragEnd' | 'onClick'>
) {
  if (!tour) return [];
  if (!cache.has(tour)) cache.set(tour, createPathData(tour));
  const cached = cache.get(tour);
  if (!cached) return [];
  const {data, path} = cached;
  return [
    new PathLayer({
      id: 'camera-tour-path-line',
      data: path,
      getPath: d => d.path,
      getColor: [27, 190, 220, 230],
      widthUnits: 'pixels',
      getWidth: 1.5,
      wrapLongitude: true,
      pickable: false
    }),
    new ScatterplotLayer({
      id: 'camera-tour-path-stops',
      data,
      getPosition: d => d.position,
      radiusUnits: 'pixels',
      getRadius: 5,
      stroked: true,
      lineWidthUnits: 'pixels',
      getLineWidth: 2,
      getFillColor: [27, 190, 220],
      getLineColor: [255, 255, 255],
      pickable: Boolean(dragHandlers),
      // Stop handles own their interactions, not dataset hover/click selection.
      onHover: dragHandlers ? () => true : undefined,
      onClick: dragHandlers ? () => true : undefined,
      ...dragHandlers
    }),
    new TextLayer({
      id: 'camera-tour-path-labels',
      data,
      getPosition: d => d.position,
      getText: d => d.label,
      characterSet: 'auto',
      // Globe mode enables culling globally, but glyph quads must stay visible.
      parameters: {cull: false},
      getSize: 12,
      getPixelOffset: [10, -12],
      getTextAnchor: 'start',
      getColor: [255, 255, 255],
      background: true,
      getBackgroundColor: [24, 32, 42, 220],
      backgroundPadding: [4, 3],
      fontWeight: 600,
      billboard: true,
      pickable: false
    })
  ];
}
