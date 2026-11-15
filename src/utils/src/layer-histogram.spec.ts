// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ALL_FIELD_TYPES, SCALE_TYPES} from '@kepler.gl/constants';
import type {Bins, ColorRange, Field} from '@kepler.gl/types';
import GeoJsonLayer from '../../layers/src/geojson-layer/geojson-layer';
import PointLayer from '../../layers/src/point-layer/point-layer';
import {getLayerHistogram, isLayerHistogramSupported} from './layer-histogram';

function setup({
  values = [0, 4, 5, 10],
  scaleType = SCALE_TYPES.quantize,
  domain = [0, 10],
  fieldType = ALL_FIELD_TYPES.real,
  range = {colors: ['#ff0000', '#0000ff']}
}: {
  values?: unknown[];
  scaleType?: keyof typeof SCALE_TYPES;
  domain?: number[] | string[];
  fieldType?: Field['type'];
  range?: ColorRange;
} = {}) {
  const field = {
    name: 'category',
    type: fieldType,
    valueAccessor: ({index}) => values[index]
  } as Field;
  const layer = new PointLayer({id: 'source', dataId: 'data'});
  layer.updateLayerConfig({colorField: field, colorScale: scaleType, colorDomain: domain});
  layer.updateLayerVisConfig({filled: true, colorRange: range});
  const datasets = {data: {fields: [field]}};
  const bins: Bins = {
    data: [{x0: 0, x1: 1, count: values.length, indexes: values.map((_, index) => index)}],
    linked: [{x0: 0, x1: 1, count: 1, indexes: [0]}]
  };
  return {layer, field, datasets, bins, histogram: () => getLayerHistogram(bins, datasets, layer)!};
}

test('uses source quantize boundaries with separate classes for repeated colors', () => {
  const {layer, bins, histogram} = setup({range: {colors: ['#ff0000', '#ff0000']}});
  const originalConfig = JSON.stringify(layer.config);
  const originalBins = JSON.stringify(bins);
  const result = histogram();

  expect(result.bins.data[0].segments).toEqual([
    {name: '0 to 5', color: '#ff0000', count: 2},
    {name: '5 to 10', color: '#ff0000', count: 2}
  ]);
  expect(result.legend).toHaveLength(2);
  expect(result.bins.linked).toBe(bins.linked);
  expect(result.bins.data[0]).toMatchObject(bins.data[0]);
  expect(JSON.stringify(bins)).toBe(originalBins);
  expect(JSON.stringify(layer.config)).toBe(originalConfig);
});

test('uses quantile membership instead of rebuilding equal-width classes', () => {
  const {histogram} = setup({
    values: [0, 1, 2, 100],
    domain: [0, 1, 2, 100],
    scaleType: SCALE_TYPES.quantile
  });
  expect(histogram().bins.data[0].segments).toEqual([
    {name: '0 to 1.5', color: '#ff0000', count: 2},
    {name: '1.5 to 100', color: '#0000ff', count: 2}
  ]);
});

test('applies custom labels only to the first class with a repeated color', () => {
  const {layer, bins, datasets, histogram} = setup({
    range: {colors: ['#ff0000', '#ff0000'], colorLegends: {'#ff0000': 'Low'}}
  });
  const result = histogram();
  expect(result.bins.data[0].segments).toEqual([
    {name: 'Low', color: '#ff0000', count: 2},
    {name: '5 to 10', color: '#ff0000', count: 2}
  ]);
  expect(result.legend).toEqual([
    {name: 'Low', color: '#ff0000'},
    {name: '5 to 10', color: '#ff0000'}
  ]);
  const filteredBins = {data: [{...bins.data[0], count: 2, indexes: [2, 3]}]};
  expect(getLayerHistogram(filteredBins, datasets, layer)?.legend).toEqual([
    {name: '5 to 10', color: '#ff0000'}
  ]);
});

test.each([SCALE_TYPES.jenks, SCALE_TYPES.threshold, SCALE_TYPES.custom])(
  'keeps %s class boundaries, labels, and exact threshold membership',
  scaleType => {
    const {histogram} = setup({
      values: [0, 2, 3, 10],
      domain: [3],
      scaleType,
      range: {
        colors: ['#ff0000', '#0000ff'],
        ...(scaleType === SCALE_TYPES.custom
          ? {
              colorMap: [
                [3, '#ff0000'],
                [null, '#0000ff']
              ] as ColorRange['colorMap']
            }
          : {})
      }
    });
    expect(histogram().bins.data[0].segments).toEqual([
      {name: 'Less than 3', color: '#ff0000', count: 2},
      {name: '3 or more', color: '#0000ff', count: 2}
    ]);
  }
);

test('keeps ordinal domain order and does not merge categories sharing a color', () => {
  const {histogram} = setup({
    values: ['c', 'a', 'b', 'a'],
    fieldType: ALL_FIELD_TYPES.string,
    scaleType: SCALE_TYPES.ordinal,
    domain: ['a', 'b', 'c'],
    range: {colors: ['#ff0000', '#0000ff']}
  });
  expect(histogram().bins.data[0].segments).toEqual([
    {name: 'a', color: '#ff0000', count: 2},
    {name: 'b', color: '#0000ff', count: 1},
    {name: 'c', color: '#ff0000', count: 1}
  ]);
});

test('custom ordinal maps share one class per grouped legend entry and retain unknown colors', () => {
  const {histogram} = setup({
    values: ['a', 'b', 'c', 'missing', null],
    fieldType: ALL_FIELD_TYPES.string,
    scaleType: SCALE_TYPES.customOrdinal,
    domain: ['a', 'b', 'c'],
    range: {
      colors: ['#ff0000', '#ff0000'],
      colorMap: [
        [['a', 'b'], '#ff0000'],
        ['c', '#ff0000']
      ]
    }
  });
  expect(histogram().bins.data[0].segments).toEqual([
    {name: 'a, b', color: '#ff0000', count: 2},
    {name: 'c', color: '#ff0000', count: 1},
    {name: 'Unknown', color: 'rgba(0, 0, 0, 0)', count: 1},
    {name: 'No value', color: 'rgba(0, 0, 0, 0)', count: 1}
  ]);
});

test('keeps numeric custom ordinal colors when unused palette slots add null categories', () => {
  const {histogram} = setup({
    values: [2, 10],
    fieldType: ALL_FIELD_TYPES.integer,
    scaleType: SCALE_TYPES.customOrdinal,
    domain: [2, 10],
    range: {colors: ['#ff0000', '#0000ff', '#00ff00', '#ffffff']}
  });
  expect(histogram().bins.data[0].segments).toEqual([
    {name: '2', color: '#ff0000', count: 1},
    {name: '10', color: '#0000ff', count: 1}
  ]);
});

test('matches the layer null color while retaining the scale handling of infinities', () => {
  const {layer, histogram} = setup({values: [null, undefined, NaN, -Infinity, Infinity]});
  const channels = layer.visualChannels;
  const channel = jest.spyOn(layer, 'visualChannels', 'get').mockReturnValue({
    ...channels,
    color: {...channels.color, nullValue: [10, 20, 30, 128]}
  });
  try {
    const result = histogram();
    expect(result.bins.data[0].segments).toEqual([
      {name: '0 to 5', color: '#ff0000', count: 1},
      {name: '5 to 10', color: '#0000ff', count: 1},
      {name: 'No value', color: `rgba(10, 20, 30, ${128 / 255})`, count: 3}
    ]);
    expect(result.bins.data[0].count).toBe(5);
  } finally {
    channel.mockRestore();
  }
});

test('follows source domain, palette, and custom legend changes without changing bin totals', () => {
  const {layer, histogram} = setup();
  expect(histogram().bins.data[0].segments?.map(segment => segment.count)).toEqual([2, 2]);
  layer.updateLayerConfig({colorDomain: [0, 20]});
  layer.updateLayerVisConfig({
    colorRange: {
      colors: ['#00ff00', '#0000ff'],
      colorLegends: {'#00ff00': 'Low', '#0000ff': 'High'}
    }
  });
  expect(histogram().bins.data[0].segments).toEqual([
    {name: 'Low', color: '#00ff00', count: 3},
    {name: 'High', color: '#0000ff', count: 1}
  ]);
});

test('rejects incompatible sources and handles missing fields or empty bins', () => {
  const {layer, datasets, bins} = setup();
  expect(isLayerHistogramSupported(layer, 'data')).toBe(true);
  expect(isLayerHistogramSupported(layer, 'other')).toBe(false);
  layer.updateLayerConfig({isVisible: false});
  expect(isLayerHistogramSupported(layer, 'data')).toBe(true);
  expect(getLayerHistogram(bins, {data: {fields: []}}, layer)).toBeNull();
  expect(getLayerHistogram({}, datasets, layer)).toBeNull();
  expect(getLayerHistogram({data: []}, datasets, layer)).toEqual({bins: {data: []}, legend: []});
  layer.updateLayerVisConfig({filled: false});
  expect(isLayerHistogramSupported(layer, 'data')).toBe(false);
  layer.updateLayerVisConfig({filled: true});
  layer.updateLayerConfig({colorScale: SCALE_TYPES.linear});
  expect(isLayerHistogramSupported(layer, 'data')).toBe(false);
  layer.updateLayerConfig({colorScale: SCALE_TYPES.quantile});
  layer.updateLayerConfig({colorDomain: {z: [0], quantiles: [[0, 5, 10]]} as any});
  expect(isLayerHistogramSupported(layer, 'data')).toBe(false);
  layer.updateLayerConfig({colorDomain: [0, 5, 10], colorField: null});
  expect(isLayerHistogramSupported(layer, 'data')).toBe(false);
});

test('rejects grouped GeoJSON table colors while retaining row-based GeoJSON colors', () => {
  const {field, datasets, bins} = setup();
  const layer = new GeoJsonLayer({id: 'source', dataId: 'data', columnMode: 'table'});
  layer.updateLayerConfig({
    colorField: field,
    colorScale: SCALE_TYPES.quantize,
    colorDomain: [0, 10]
  });
  layer.updateLayerVisConfig({filled: true, colorRange: {colors: ['#ff0000', '#0000ff']}});

  expect(isLayerHistogramSupported(layer, 'data')).toBe(false);
  expect(getLayerHistogram(bins, datasets, layer)).toBeNull();

  layer.updateLayerConfig({columnMode: 'geojson'});
  expect(isLayerHistogramSupported(layer, 'data')).toBe(true);
  expect(getLayerHistogram(bins, datasets, layer)?.bins.data[0].segments).toEqual([
    {name: '0 to 5', color: '#ff0000', count: 2},
    {name: '5 to 10', color: '#0000ff', count: 2}
  ]);
});

test.each(['grid', 'hexagon', 'vectorTile', 'raster', 'trip'])(
  'does not offer a %s source as per-row colors',
  type => {
    const {layer} = setup();
    Object.defineProperty(layer, 'type', {value: type});
    expect(isLayerHistogramSupported(layer, 'data')).toBe(false);
  }
);
