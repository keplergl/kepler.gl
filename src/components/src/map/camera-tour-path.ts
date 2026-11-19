// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {PathLayer, ScatterplotLayer, TextLayer} from '@deck.gl/layers';
import type {Layer} from '@deck.gl/core';
import type {ScatterplotLayerProps} from '@deck.gl/layers';
import type {CameraTour} from '@kepler.gl/types';
import {evaluateCameraTour, normalizeCameraTour} from '@kepler.gl/utils';

const PATH_SAMPLES_PER_SEGMENT = 20;
const OVERLAY_DEPTH = {depthCompare: 'always', depthWriteEnabled: false} as const;

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
  const path: [number, number][] = [data[0].position];
  const appendPosition = ([longitude, latitude]: [number, number]) => {
    const previousLongitude = path[path.length - 1][0];
    const delta = longitude - previousLongitude;
    // The evaluator uses equivalent wrapped coordinates at authored stops.
    // Keep adjacent vertices in the same world across the antimeridian.
    path.push([
      Math.abs(delta) < 180
        ? longitude
        : previousLongitude + ((((delta + 180) % 360) + 360) % 360) - 180,
      latitude
    ]);
  };
  const passesThrough = (index: number) =>
    index > 0 &&
    index < stops.length - 1 &&
    stops[index].holdDurationMs === 0 &&
    stops[index - 1].travelDurationMs > 0 &&
    stops[index].travelDurationMs > 0;
  for (let index = 0; index < stops.length - 1; index++) {
    const stop = stops[index];
    if (passesThrough(index) || passesThrough(index + 1)) {
      // A leg's endpoint velocities depend only on its immediate neighbors.
      // Keep normalization and timeline scans bounded when rebuilding during drag.
      const segmentTour = {stops: stops.slice(Math.max(0, index - 1), index + 3)};
      const previous = stops[index - 1];
      const elapsed =
        stop.holdDurationMs + (previous ? previous.holdDurationMs + previous.travelDurationMs : 0);
      for (let sample = 1; sample < PATH_SAMPLES_PER_SEGMENT; sample++) {
        const camera = evaluateCameraTour(
          segmentTour,
          elapsed + (stop.travelDurationMs * sample) / PATH_SAMPLES_PER_SEGMENT
        )!;
        appendPosition([camera.longitude, camera.latitude]);
      }
    }
    // Include authored endpoints explicitly, even when the next travel is a cut.
    appendPosition(data[index + 1].position);
  }
  return {data, path: [{path}]};
}

export function getCameraTourPathLayers(
  tour?: CameraTour | null,
  dragHandlers?: Pick<ScatterplotLayerProps, 'onDragStart' | 'onDrag' | 'onDragEnd' | 'onClick'>,
  isGlobeMode = false
): Layer[] {
  if (!tour) return [];
  if (!cache.has(tour)) cache.set(tour, createPathData(tour));
  const cached = cache.get(tour);
  if (!cached) return [];
  const {data, path} = cached;
  // Flat-map editing guides draw over 3D geometry. Keep globe depth testing
  // so stops and lines on the far side stay hidden behind the globe.
  const parameters = isGlobeMode ? undefined : OVERLAY_DEPTH;
  return [
    new PathLayer({
      id: 'camera-tour-path-line',
      data: path,
      getPath: d => d.path,
      getColor: [27, 190, 220, 230],
      widthUnits: 'pixels',
      getWidth: 1.5,
      wrapLongitude: true,
      parameters,
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
      parameters,
      pickable: Boolean(dragHandlers),
      // Handle stop clicks, but let hover reach the map's tooltip lifecycle.
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
      parameters: {...parameters, cull: false},
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
