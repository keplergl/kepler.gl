// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {project, WebMercatorViewport} from '@deck.gl/core';
import type {ScatterplotLayer} from '@deck.gl/layers';
import type {Brush} from '@kepler.gl/types';
import {INITIAL_MAP_STATE} from '@kepler.gl/reducers';
import {getBrushLayers} from './brush-overlay';

const brush: Brush = {
  id: 'brush',
  label: 'interactions.brush',
  enabled: true,
  config: {size: 50, showBrush: true}
};
const mapState = {
  ...INITIAL_MAP_STATE,
  width: 800,
  height: 600,
  longitude: 0,
  latitude: 60,
  zoom: 8
};
const mousePosition: [number, number] = [480, 320];

// Convert the configured layer radius to the geometry ScatterplotLayer draws,
// before the small cursor-indicator minimum. Meter radii receive deck's
// latitude correction in low-zoom Mercator; common radii do not.
function renderedCommonRadius(layer: ScatterplotLayer, viewport: WebMercatorViewport) {
  const {commonUnitsPerMeter} = project.getUniforms({viewport}) as {
    commonUnitsPerMeter: [number, number, number];
  };
  const position = viewport.unproject(mousePosition);
  const radius = Number(layer.props.getRadius);
  return layer.props.radiusUnits === 'common'
    ? radius
    : radius *
        commonUnitsPerMeter[2] *
        (viewport.zoom < 12 ? 1 / Math.cos((position[1] * Math.PI) / 180) : 1);
}

describe('brush overlay', () => {
  test.each([
    {latitude: 0, zoom: 8, pitch: 0, bearing: 0},
    {latitude: 60, zoom: 8, pitch: 0, bearing: 0},
    {latitude: -60, zoom: 8, pitch: 45, bearing: 30},
    {latitude: 0, zoom: 14, pitch: 0, bearing: 0},
    {latitude: 60, zoom: 14, pitch: 45, bearing: 30}
  ])('matches the brush distance at $latitude degrees, zoom $zoom and pitch $pitch', view => {
    const state = {...mapState, ...view};
    const configuredBrush = {...brush, config: {...brush.config, size: view.zoom < 12 ? 50 : 1}};
    const viewport = new WebMercatorViewport(state);
    const [layer] = getBrushLayers({brush: configuredBrush, mousePosition, mapState: state});
    const {commonUnitsPerMeter} = project.getUniforms({viewport}) as {
      commonUnitsPerMeter: [number, number, number];
    };
    const center = viewport.projectPosition(viewport.unproject(mousePosition));
    const radius = renderedCommonRadius(layer, viewport);
    expect(radius * viewport.scale).toBeGreaterThan(layer.props.radiusMinPixels!);

    // Compare points on either side of the visible boundary to the distance
    // used by BrushingExtension, including the original false-positive point.
    for (const fraction of [0.75, 0.99, 1.01]) {
      const point = [center[0] + fraction * radius, center[1]];
      const filterDistance = Math.hypot(
        (point[0] - center[0]) / commonUnitsPerMeter[0],
        (point[1] - center[1]) / commonUnitsPerMeter[1]
      );
      expect(filterDistance <= configuredBrush.config.size * 1000).toBe(fraction < 1);
    }
  });

  test.each([0, -1, NaN, Infinity])('omits an invalid or empty radius: %s', size => {
    expect(
      getBrushLayers({brush: {...brush, config: {...brush.config, size}}, mousePosition, mapState})
    ).toEqual([]);
  });

  test.each([null, [-1, 20], [800, 20], [20, -1], [20, 600], [NaN, 20], [20, Infinity]])(
    'omits missing or out-of-map cursor positions: %j',
    position => {
      expect(
        getBrushLayers({brush, mousePosition: position as [number, number] | null, mapState})
      ).toEqual([]);
    }
  );

  test.each([
    {...brush, enabled: false},
    {...brush, config: {size: 50}},
    {...brush, config: {...brush.config, showBrush: false}}
  ])('omits disabled and legacy brush settings: %j', config => {
    expect(getBrushLayers({brush: config, mousePosition, mapState})).toEqual([]);
  });

  test('keeps a visible cursor indicator for tiny brushes without changing the filter config', () => {
    const [layer] = getBrushLayers({brush, mousePosition, mapState: {...mapState, zoom: 0}});
    expect(layer.props.radiusMinPixels).toBeGreaterThan(Number(layer.props.getLineWidth));
    expect(layer.props.pickable).toBe(false);
    expect(brush.config.size).toBe(50);
  });

  test('preserves globe positioning and depth testing', () => {
    const state = {...mapState, globe: {...mapState.globe!, enabled: true}};
    const [layer] = getBrushLayers({brush, mousePosition: [400, 300], mapState: state});
    const position = (layer.props.data as number[][])[0];
    expect(position[0]).toBeCloseTo(state.longitude);
    expect(position[1]).toBeCloseTo(state.latitude);
    expect(layer.props.parameters?.depthCompare).not.toBe('always');
  });
});
