// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

jest.mock('../../examples/custom-layer/src/density-surface', () => {
  const actual = jest.requireActual('../../examples/custom-layer/src/density-surface');
  return {
    ...actual,
    buildSurfaceMesh: jest.fn(() => ({
      positions: new Float32Array([0, 0, 0]),
      colors: new Float32Array([1, 0, 0]),
      indices: new Uint32Array(0),
      vertexCount: 1,
      triangleCount: 0
    }))
  };
});

import ContourKeplerLayer from '../../examples/custom-layer/src/custom-contour-layer';
import {buildSurfaceMesh} from '../../examples/custom-layer/src/density-surface';

const ROWS = [
  [37.8, -122.4, 10],
  [37.8, -122.4, 20],
  [37.9, -122.3, 30]
];

function createLayer(visConfig = {}) {
  const layer = new ContourKeplerLayer({
    id: 'contour-test',
    dataId: 'test',
    columns: {
      lat: {fieldIdx: 0},
      lng: {fieldIdx: 1}
    }
  });
  layer.updateLayerVisConfig({
    cellRadius: 2,
    smoothing: 1,
    elevationScale: 3000,
    opacity: 0.8,
    ...visConfig
  });
  return layer;
}

function formatData(layer) {
  return layer.formatLayerData({
    test: {
      dataContainer: {valueAt: (rowIndex, fieldIdx) => ROWS[rowIndex][fieldIdx]},
      filteredIndex: ROWS.map((_, index) => index),
      getColumnFieldIdx: name => (name === 'elevation' ? 2 : -1)
    }
  });
}

describe('custom contour layer', () => {
  test('contour mode renders a ContourLayer from the raw positions', () => {
    const layer = createLayer({renderMode: 'contour'});
    const data = formatData(layer);
    const [deckLayer] = layer.renderLayer({data});

    expect(data.data).toHaveLength(ROWS.length);
    expect(data.positions).toHaveLength(ROWS.length);
    expect(deckLayer.props.data).toBe(data.data);
    expect(deckLayer.props.cellSize).toBe(2000);
  });

  test('surface mode renders a colored SimpleMeshLayer from the aggregated grid', () => {
    const layer = createLayer({renderMode: 'surface'});
    const data = formatData(layer);
    const [deckLayer] = layer.renderLayer({data});

    expect(deckLayer.props.mesh).toBe(layer._surfaceCache.mesh);
    expect(deckLayer.props.mesh.attributes.positions.size).toBe(3);
    expect(deckLayer.props.mesh.attributes.positions.value).toHaveLength(3);
    expect(deckLayer.props.mesh.attributes.colors.size).toBe(3);
    expect(deckLayer.props.mesh.indices).toHaveLength(0);
    expect(deckLayer.props._instanced).toBe(false);
    expect(deckLayer.props.material).toBe(false);
    expect(deckLayer.props.getColor).toEqual([255, 255, 255, 255]);
  });

  test('surface mode uses a numeric weight column as the per-cell mean', () => {
    const layer = createLayer({renderMode: 'surface', weightColumn: 'elevation', smoothing: 0});
    const data = formatData(layer);
    layer.renderLayer({data});

    // Two points share a cell: (10 + 20) / 2 = 15; the third is alone: 30.
    expect(layer._surfaceCache.gridInfo.maxValue).toBeCloseTo(30, 5);
  });

  test('surface mode passes the color range palette to the mesh builder', () => {
    const colorRange = {colors: ['#000000', '#ffffff']};
    const layer = createLayer({renderMode: 'surface', colorRange});
    const data = formatData(layer);
    layer.renderLayer({data});

    expect(buildSurfaceMesh).toHaveBeenLastCalledWith(expect.anything(), 3000, colorRange.colors);
  });

  test('surface mode reuses the cached grid until its inputs change', () => {
    const layer = createLayer({renderMode: 'surface'});
    const data = formatData(layer);

    layer.renderLayer({data});
    const firstCache = layer._surfaceCache;

    layer.renderLayer({data});
    expect(layer._surfaceCache).toBe(firstCache);

    layer.renderLayer({data: {...data, positions: [...data.positions]}});
    expect(layer._surfaceCache).not.toBe(firstCache);
  });
});
