// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {KeplerTable, getGpuFilterProps} from '@kepler.gl/table';
import {processCsvData} from '@kepler.gl/processors';
import ContourLayer from './contour-layer';
import {LayerClasses} from '../index';
import {
  createContourSamples,
  contourConfig
} from '../../../../examples/demo-app/src/data/sample-contour-data';
import {buildContourGrid, generateContours} from './contour-utils';
import SchemaManager from '@kepler.gl/schemas';
import {StateWFiles} from 'test/helpers/mock-state';
import {messages} from '@kepler.gl/localization';
import React from 'react';
import {render} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {IntlProvider} from 'react-intl';
import {theme} from '@kepler.gl/styles';
import {appInjector, MapLegendFactory} from '@kepler.gl/components';

test.each(Object.keys(messages))('resolves contour column labels in locale %s', locale => {
  const layer = new ContourLayer({dataId: 'contour-labels'});
  for (const key of layer.requiredLayerColumns) {
    const id = `columns.${layer.columnLabels[key] || key}`;
    expect(messages[locale][id]).toEqual(expect.any(String));
    expect(messages[locale][id]).not.toBe(id);
  }
});

async function setup(scatteredRows?: number[][]) {
  const rows = Array.from({length: 81}, (_, i) => {
    const x = i % 9;
    const y = Math.floor(i / 9);
    return `${x},${y},${(x - 4) ** 2 + (y - 4) ** 2}`;
  });
  const dataset = new KeplerTable({info: {id: 'contour-test'}, color: [0, 0, 0]});
  const data = processCsvData(`longitude,latitude,value\n${rows.join('\n')}`)!;
  if (scatteredRows) {
    // Small CSV fixtures may infer integer columns; provide the intended numeric schema.
    data.fields = data.fields.map(field => ({...field, type: 'real'}));
    data.rows = scatteredRows;
  }
  await dataset.importData({data});
  dataset.gpuFilter = getGpuFilterProps([], dataset.id, dataset.fields);
  const column = name => ({value: name, fieldIdx: dataset.fields.findIndex(f => f.name === name)});
  const layer = new ContourLayer({
    dataId: dataset.id,
    columns: {lat: column('latitude'), lng: column('longitude'), value: column('value')}
  });
  layer.updateLayerVisConfig({
    customRange: true,
    minimum: 2,
    maximum: 6,
    smoothing: 0,
    levels: 3,
    filled: true,
    stroked: true
  });
  return {dataset, layer, datasets: {[dataset.id]: dataset}};
}

const scatteredSamples = [
  [0, 0, 3],
  [2, 0, 7],
  [0.75, 2, 10.5],
  [1.125, 0.625, 7.125]
];
const pointGeometry = (x: number, y: number) => ({type: 'Point', coordinates: [x, y]});
const polygonGeometry = (x: number, y: number) => ({
  type: 'Polygon',
  // The closing vertex makes the vertex average [x, y], unlike an area centroid.
  coordinates: [
    [
      [x - 1, y - 1],
      [x + 3, y - 1],
      [x - 1, y + 3],
      [x - 1, y - 1]
    ]
  ]
});

function setupGeojson(
  rows: unknown[][] = scatteredSamples.map(([x, y, value]) => [pointGeometry(x, y), value])
) {
  const dataset = new KeplerTable({info: {id: 'contour-geojson'}, color: [0, 0, 0]}).updateSchema({
    fields: [
      {name: 'geometry', type: 'geojson', analyzerType: 'GEOMETRY'},
      {name: 'value', type: 'real'}
    ],
    rows
  });
  const layer = new ContourLayer({
    dataId: dataset.id,
    columnMode: 'geojson',
    columns: {
      geojson: {value: 'geometry', fieldIdx: 0},
      value: {value: 'value', fieldIdx: 1}
    }
  });
  layer.updateLayerVisConfig({
    customRange: true,
    minimum: 4,
    maximum: 8,
    levels: 3,
    smoothing: 0,
    interpolationResolution: 64
  });
  return {layer, dataset, datasets: {[dataset.id]: dataset}};
}

test('registers the layer and renders both passes without recomputing on camera movement', async () => {
  const {layer, dataset, datasets} = await setup();
  expect(LayerClasses.contour).toBe(ContourLayer);
  const data = layer.formatLayerData(datasets);
  expect(data.data).toHaveLength(3);
  const opts = {
    data,
    visible: true,
    idx: 0,
    gpuFilter: dataset.gpuFilter,
    layerCallbacks: {},
    mapState: {zoom: 10}
  };
  const passes = layer.renderLayer(opts);
  expect(passes).toHaveLength(2);
  expect(passes[0].props.data).toBe(data.data);
  expect(passes[1].props.data).toBe(data.data);
  expect(layer.renderLayer({...opts, mapState: {zoom: 15, longitude: 8}})[0].props.data).toBe(
    data.data
  );
  expect(layer.renderLayer({...opts, visible: false})).toEqual([]);
  layer.updateLayerVisConfig({filled: false});
  expect(layer.renderLayer(opts)).toHaveLength(1);
  expect(layer.getHoverData(data.data[0])).toEqual({
    aggregatedData: {value: {value: 6, measure: '≤'}}
  });
});

test('shows the configured contour color in the legend for fills and outlines', async () => {
  const {layer} = await setup();
  const MapLegend = appInjector.get(MapLegendFactory);
  const {container, rerender} = render(React.createElement(MapLegend, {layers: [layer]}), {
    wrapper: ({children}) =>
      React.createElement(ThemeProvider, {
        theme,
        children: React.createElement(IntlProvider, {locale: 'en', messages: messages.en, children})
      })
  });
  const swatches = () => container.querySelectorAll<HTMLElement>('.legend-row-color');
  expect(swatches()).toHaveLength(1);
  expect(swatches()[0].style.backgroundColor).toBe('rgb(36, 218, 211)');

  layer.updateLayerConfig({color: [200, 100, 50]});
  for (const visConfig of [
    {filled: true, stroked: false},
    {filled: false, stroked: true}
  ]) {
    layer.updateLayerVisConfig(visConfig);
    rerender(React.createElement(MapLegend, {layers: [layer]}));
    expect(swatches()).toHaveLength(1);
    expect(swatches()[0].style.backgroundColor).toBe('rgb(200, 100, 50)');
  }

  layer.updateLayerVisConfig({filled: false, stroked: false});
  rerender(React.createElement(MapLegend, {layers: [layer]}));
  expect(swatches()).toHaveLength(0);
});

test('filtered samples become holes and clearing the filter restores them', async () => {
  const {layer, dataset, datasets} = await setup();
  const all = dataset.filteredIndex;
  dataset.filteredIndex = all.filter(index => index !== 40);
  const filtered = layer.formatLayerData(datasets);
  expect(filtered.data.every(f => f.geometry.coordinates[0].length === 2)).toBe(true);
  dataset.filteredIndex = all;
  const restored = layer.formatLayerData(datasets);
  expect(restored.data.every(f => f.geometry.coordinates[0].length === 1)).toBe(true);
});

test('reports invalid settings and recovers after correcting them', async () => {
  const {layer, datasets} = await setup();
  layer.updateLayerVisConfig({minimum: 9, maximum: 3});
  expect(layer.formatLayerData(datasets).data).toEqual([]);
  expect(layer.errorMessage).toMatch(/minimum/);
  layer.updateLayerVisConfig({minimum: 2, maximum: 6});
  expect(layer.formatLayerData(datasets).data).toHaveLength(3);
  expect(layer.errorMessage).toBeNull();
  layer.updateLayerVisConfig({levels: 5});
  expect(layer.formatLayerData(datasets).data.map(f => f.properties.threshold)).toEqual([
    6, 5, 4, 3, 2
  ]);
});

test('applies numeric GPU filters before contouring even at a zero-valued range', async () => {
  const {layer, dataset, datasets} = await setup();
  dataset.gpuFilter = {
    ...dataset.gpuFilter,
    filterValueUpdateTriggers: {test: true},
    filterRange: [[0, 0]],
    filterValueAccessor: () => () => d => [d.index === 40 ? 1 : 0]
  } as any;
  expect(
    layer.formatLayerData(datasets).data.every(f => f.geometry.coordinates[0].length === 2)
  ).toBe(true);
});

test.each(['grid', 'geojson'])(
  'saves and reloads %s contour settings and columns through the map schema',
  async columnMode => {
    const {layer} = columnMode === 'geojson' ? setupGeojson() : await setup();
    layer.updateLayerVisConfig({inputMode: 'points', interpolationResolution: 128});
    const saved = SchemaManager.getConfigToSave({
      ...StateWFiles,
      visState: {...StateWFiles.visState, layers: [layer], layerOrder: [layer.id]}
    });
    const parsed = SchemaManager.parseSavedConfig(saved);
    if (!parsed) throw new Error('Expected the saved contour configuration to parse.');
    const restored = parsed.visState!.layers![0];
    expect(restored.type).toBe('contour');
    expect(restored.config.columnMode).toBe(columnMode);
    expect(restored.config.visConfig).toEqual(layer.config.visConfig);
    // Saved configs retain column names; field indices are resolved against the loaded table.
    expect(restored.config.columns.value).toBe('value');
    if (columnMode === 'geojson') expect(restored.config.columns.geojson).toBe('geometry');
  }
);

describe('GeoJSON scalar inputs', () => {
  test.each([
    ['Point', pointGeometry],
    [
      'LineString',
      (x, y) => ({
        type: 'LineString',
        coordinates: [
          [x - 1, y - 1],
          [x + 1, y + 1]
        ]
      })
    ],
    ['Polygon', polygonGeometry],
    [
      'MultiPoint',
      (x, y) => ({
        type: 'MultiPoint',
        coordinates: [
          [x - 1, y],
          [x + 1, y]
        ]
      })
    ],
    [
      'MultiLineString',
      (x, y) => ({
        type: 'MultiLineString',
        coordinates: [
          [
            [x - 1, y - 1],
            [x + 1, y + 1]
          ]
        ]
      })
    ],
    [
      'MultiPolygon',
      (x, y) => ({
        type: 'MultiPolygon',
        coordinates: [polygonGeometry(x - 1, y).coordinates, polygonGeometry(x + 1, y).coordinates]
      })
    ],
    [
      'GeometryCollection',
      (x, y) => ({
        type: 'GeometryCollection',
        geometries: [pointGeometry(x - 1, y), pointGeometry(x + 1, y)]
      })
    ]
  ] as const)(
    'uses %s representative points and the selected scalar column',
    async (_type, geometry) => {
      const rows = scatteredSamples.map(([x, y, value], index) => {
        const shape = geometry(x, y);
        const feature = {type: 'Feature', geometry: shape, properties: {value: 999}};
        // Exercise raw geometries, Features and both JSON string forms.
        return [[shape, feature, JSON.stringify(shape), JSON.stringify(feature)][index], value];
      });
      const {layer, datasets} = setupGeojson(rows);
      const reference = await setup(scatteredSamples);
      reference.layer.updateLayerVisConfig(layer.config.visConfig);
      expect(layer.hasAllColumns()).toBe(true);
      const actual = layer.formatLayerData(datasets);
      expect(actual.data).toHaveLength(3);
      expect(actual).toEqual(reference.layer.formatLayerData(reference.datasets));
      expect(layer.errorMessage).toBeNull();
    }
  );

  test('requires geometry and value columns only in GeoJSON mode', () => {
    const {layer, datasets} = setupGeojson();
    expect(layer.hasAllColumns()).toBe(true);
    layer.updateLayerConfig({columnMode: 'grid'});
    expect(layer.hasAllColumns()).toBe(false);
    layer.updateLayerConfig({columnMode: 'geojson'});
    for (const name of ['geojson', 'value']) {
      const original = layer.config.columns[name];
      layer.config.columns[name] = {value: null, fieldIdx: -1};
      expect(layer.hasAllColumns()).toBe(false);
      expect(layer.formatLayerData(datasets).data).toEqual([]);
      layer.config.columns[name] = original;
    }
    expect(layer.formatLayerData(datasets).data).toHaveLength(3);
  });

  test('skips invalid geometries without losing valid rows, and handles empty input', () => {
    const invalid = [
      null,
      {},
      'not geojson',
      {type: 'Feature', geometry: null},
      {type: 'Point', coordinates: [null, null]},
      {type: 'Polygon', coordinates: []},
      {type: 'GeometryCollection', geometries: {}}
    ];
    const valid = scatteredSamples.map(([x, y, value]) => [pointGeometry(x, y), value]);
    const baseline = setupGeojson(valid);
    const mixed = setupGeojson([...invalid.map(geometry => [geometry, 100]), ...valid]);
    expect(mixed.layer.formatLayerData(mixed.datasets)).toEqual(
      baseline.layer.formatLayerData(baseline.datasets)
    );
    expect(mixed.layer.errorMessage).toBeNull();
    for (const rows of [[], invalid.map(geometry => [geometry, 100])]) {
      const empty = setupGeojson(rows);
      expect(empty.layer.formatLayerData(empty.datasets).data).toEqual([]);
      expect(empty.layer.errorMessage).toBeNull();
    }
  });

  test.each(['cpu', 'gpu'])(
    'applies %s filters before interpolating GeoJSON samples',
    filterType => {
      const {layer, dataset, datasets} = setupGeojson();
      expect(layer.formatLayerData(datasets).data).toHaveLength(3);
      if (filterType === 'cpu') {
        dataset.filteredIndex = [0, 1, 3];
      } else {
        dataset.gpuFilter = {
          ...getGpuFilterProps([], dataset.id, dataset.fields),
          filterValueUpdateTriggers: {test: true},
          filterRange: [[0, 0]],
          filterValueAccessor: () => () => d => [d.index === 2 ? 1 : 0]
        } as any;
      }
      expect(layer.formatLayerData(datasets).data.length).toBeGreaterThan(0);
      expect(layer.meta.bounds[3]).toBeCloseTo(0.625);
    }
  );

  test('retains grid holes when GeoJSON points form a regular lattice', () => {
    const rows = Array.from({length: 81}, (_, i) => {
      const x = i % 9;
      const y = Math.floor(i / 9);
      return [pointGeometry(x, y), i === 40 ? null : 1];
    });
    const {layer, datasets} = setupGeojson(rows);
    layer.updateLayerVisConfig({smoothing: 2});
    const result = layer.formatLayerData(datasets);
    expect(result.data).toHaveLength(3);
    expect(result.data.every(f => f.geometry.coordinates[0].length === 2)).toBe(true);
  });
});

test('interpolates scattered data and recomputes its support when samples are filtered', async () => {
  const {layer, dataset, datasets} = await setup([
    [0, 0, 3],
    [2, 0, 7],
    [0.7, 2, 10.4],
    [1.1, 0.6, 7]
  ]);
  layer.updateLayerVisConfig({minimum: 4, maximum: 8, interpolationResolution: 64});
  expect(layer.formatLayerData(datasets).data).toHaveLength(3);
  expect(layer.errorMessage).toBeNull();
  expect(layer.meta.bounds[3]).toBeCloseTo(2);
  const all = dataset.filteredIndex;
  dataset.filteredIndex = [0, 1, 3];
  expect(layer.formatLayerData(datasets).data.length).toBeGreaterThan(0);
  expect(layer.meta.bounds[3]).toBeCloseTo(0.6);
  dataset.filteredIndex = all;
  layer.updateLayerVisConfig({inputMode: 'grid'});
  expect(layer.formatLayerData(datasets).data).toEqual([]);
  expect(layer.errorMessage).toMatch(/regularly spaced/);
  layer.updateLayerVisConfig({inputMode: 'points'});
  expect(layer.formatLayerData(datasets).data).toHaveLength(3);
  expect(layer.errorMessage).toBeNull();
  expect(layer.meta.bounds[3]).toBeCloseTo(2);
});

test.each([false, true])(
  'sample (scattered = %s) generates all levels with islands and finite closed geometry',
  scattered => {
    const sample = createContourSamples(scattered);
    const {visConfig} = contourConfig.config.visState.layers[0].config;
    const result = generateContours(buildContourGrid(sample), {
      ...visConfig,
      domain: [visConfig.minimum, visConfig.maximum]
    });
    expect(result).toHaveLength(visConfig.levels);
    expect(result.some(f => f.geometry.coordinates.length > 5)).toBe(true);
    for (const feature of result) {
      for (const polygon of feature.geometry.coordinates) {
        for (const ring of polygon) {
          expect(ring[0]).toEqual(ring[ring.length - 1]);
          expect(ring.flat().every(Number.isFinite)).toBe(true);
        }
      }
    }
  }
);
