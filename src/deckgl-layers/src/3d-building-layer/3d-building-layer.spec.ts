// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {SolidPolygonLayer} from '@deck.gl/layers';

import ThreeDBuildingLayer from './3d-building-layer';
import {TileDataItem} from './types';

const color: [number, number, number] = [10, 20, 30];

function makeLayer() {
  return new ThreeDBuildingLayer({
    id: 'test-3d-buildings',
    mapboxApiAccessToken: 'test-token',
    mapboxApiUrl: 'https://example.com',
    threeDBuildingColor: color,
    updateTriggers: {getFillColor: color}
  });
}

describe('ThreeDBuildingLayer', () => {
  test('declares a stable deck.gl component name', () => {
    expect(ThreeDBuildingLayer.layerName).toBe('ThreeDBuildingLayer');
    expect(ThreeDBuildingLayer.componentName).toBe('ThreeDBuildingLayer');
  });

  test('does not create an extruded polygon layer for empty tile content', () => {
    const layer = makeLayer();

    expect(layer.renderSubLayers({data: []} as any)).toBeNull();
    expect(layer.renderSubLayers({data: null} as any)).toBeNull();
    expect(
      layer.renderSubLayers({
        data: [{coordinates: [], properties: {layer: 'building', height: 25}}]
      } as any)
    ).toBeNull();
  });

  test('keeps rendering non-empty building tiles', () => {
    const layer = makeLayer();
    const data: TileDataItem[] = [
      {
        coordinates: [
          [
            [-122.42, 37.77],
            [-122.41, 37.77],
            [-122.41, 37.78],
            [-122.42, 37.77]
          ]
        ],
        properties: {layer: 'building', height: 25}
      }
    ];

    const subLayer = layer.renderSubLayers({data} as any);

    expect(subLayer).toBeInstanceOf(SolidPolygonLayer);
    expect(subLayer?.props.data).toBe(data);
    expect(subLayer?.props.extruded).toBe(true);
    const getElevation = subLayer?.props.getElevation;
    expect(typeof getElevation).toBe('function');
    expect(typeof getElevation === 'function' && getElevation(data[0], {} as any)).toBe(25);
    expect(subLayer?.props.getPolygon(data[0], {} as any)).toBe(data[0].coordinates);
  });
});
