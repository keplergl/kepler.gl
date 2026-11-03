// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Table, vectorFromArray, Float64, Int64} from 'apache-arrow';
import {
  KeplerTable,
  copyTableAndUpdate,
  getGpuFilterProps,
  assignGpuChannels
} from '@kepler.gl/table';
import {processArrowBatches} from '@kepler.gl/processors';
import {getPolygonFilterFunctor, getDefaultFilter} from '@kepler.gl/utils';
import {EDITOR_AVAILABLE_LAYERS, FILTER_TYPES} from '@kepler.gl/constants';
import {DATA_TYPES} from 'type-analyzer';
import SchemaManager from '@kepler.gl/schemas';
import {INITIAL_VIS_STATE, layerTypeChangeUpdater, setFilterUpdater} from '@kepler.gl/reducers';
import {StateWFiles} from 'test/helpers/mock-state';
import {LayerClasses} from '../index';
import VoronoiLayer from './voronoi-layer';

const rows = [
  [-1, -1, 10],
  [1, -1, 20],
  [-1, 1, 30],
  [1, 1, 40]
];
const fields = [
  {name: 'longitude', type: 'real'},
  {name: 'latitude', type: 'real'},
  {name: 'value', type: 'real'}
];

async function setup(data?: Parameters<KeplerTable['importData']>[0]['data']) {
  const dataset = new KeplerTable({info: {id: 'voronoi-test'}, color: [0, 0, 0]});
  await dataset.importData({data: data || {fields, rows}});
  dataset.gpuFilter = getGpuFilterProps([], dataset.id, dataset.fields);
  const layer = new VoronoiLayer({
    dataId: dataset.id,
    columns: {
      lng: {value: 'longitude', fieldIdx: 0},
      lat: {value: 'latitude', fieldIdx: 1}
    }
  });
  return {layer, dataset, datasets: {[dataset.id]: dataset}};
}

function render(layer, dataset, data) {
  return layer.renderLayer({
    data,
    idx: 0,
    gpuFilter: dataset.gpuFilter,
    mapState: {zoom: 10},
    visible: true
  })[0];
}

test('registers a selectable layer without adding a new default layer on import', async () => {
  const {layer, dataset} = await setup();
  expect(LayerClasses.voronoi).toBe(VoronoiLayer);
  expect(VoronoiLayer.findDefaultLayerProps(dataset).props).toEqual([]);
  expect(layer.hasAllColumns()).toBe(true);
  expect(layer.isAggregated).toBe(false);
});

test('keeps source row colors and hover data on the generated polygons', async () => {
  const {layer, dataset, datasets} = await setup();
  layer.updateLayerConfig({colorField: dataset.fields[2], colorScale: 'quantize'});
  layer.updateLayerDomain(datasets);
  layer.updateLayerVisConfig({
    colorRange: {...layer.config.visConfig.colorRange, colors: ['#FF0000', '#00FF00']}
  });
  const data = layer.formatLayerData(datasets);
  expect(data.data.map(cell => cell.index)).toEqual([0, 1, 2, 3]);
  expect(data.getFillColor(data.data[0])).toEqual([255, 0, 0]);
  expect(data.getFillColor(data.data[3])).toEqual([0, 255, 0]);
  expect(layer.getHoverData(data.data[3], dataset.dataContainer)).toEqual(
    dataset.dataContainer.row(3)
  );
  const polygon = render(layer, dataset, data);
  expect(polygon.props.getPolygon(data.data[0])).toEqual(data.data[0].polygon);
  expect(polygon.props.pickable).toBe(true);
  expect(polygon.props.filled).toBe(true);
  expect(polygon.props.stroked).toBe(true);
  expect(polygon.props.extruded).toBe(false);
});

test('CPU and per-layer filters rebuild cells within unchanged dataset bounds', async () => {
  const {layer, dataset, datasets} = await setup();
  const original = layer.formatLayerData(datasets);
  const bounds = layer.meta.bounds;
  for (const table of [
    copyTableAndUpdate(dataset, {filteredIndex: [1, 3]}),
    copyTableAndUpdate(dataset, {filteredIndexByLayer: {[layer.id]: [1, 3]}})
  ]) {
    const filtered = layer.formatLayerData({[dataset.id]: table}, original);
    expect(filtered.data.map(cell => cell.index)).toEqual([1, 3]);
    expect(filtered.data[0].polygon).not.toEqual(original.data[1].polygon);
    expect(filtered.data[1].polygon).not.toEqual(original.data[3].polygon);
    // Both surviving sites are in the east; their cells now also cover the west.
    for (const cell of filtered.data) {
      expect(Math.min(...cell.polygon.map(point => point[0]))).toBeCloseTo(bounds[0]);
      expect(Math.max(...cell.polygon.map(point => point[0]))).toBeCloseTo(bounds[2]);
    }
    expect(layer.meta.bounds).toEqual(bounds);
    expect(layer.formatLayerData(datasets, filtered).data).toEqual(original.data);
  }
  const empty = copyTableAndUpdate(dataset, {filteredIndex: []});
  expect(layer.formatLayerData({[dataset.id]: empty}, original).data).toEqual([]);
  expect(layer.meta.bounds).toEqual(bounds);
  expect(layer.formatLayerData(datasets).data).toEqual(original.data);
});

test('GPU numeric filters rebuild cells even when the CPU row indices do not change', async () => {
  const {layer, dataset, datasets} = await setup();
  const original = layer.formatLayerData(datasets);
  const bounds = layer.meta.bounds;
  const filter = {
    ...getDefaultFilter({dataId: [dataset.id]}),
    type: FILTER_TYPES.range,
    name: ['value'],
    fieldIdx: [2],
    domain: [10, 40],
    value: [20, 20],
    gpu: true
  };
  let previous = original;
  for (const {value, indices} of [
    {value: [20, 20], indices: [1]},
    {value: [10, 10], indices: [0]},
    {value: [20, 40], indices: [1, 2, 3]},
    {value: [21, 29], indices: []}
  ]) {
    dataset.filterTable(assignGpuChannels([{...filter, value}]), [layer]);
    expect(dataset.filteredIndex).toEqual([0, 1, 2, 3]);
    const data = layer.formatLayerData(datasets, previous);
    expect(data.data.map(cell => cell.index)).toEqual(indices);
    expect(layer.meta.bounds).toEqual(bounds);
    if (indices.length === 1) {
      const polygon = data.data[0].polygon;
      expect(Math.min(...polygon.map(point => point[0]))).toBeCloseTo(bounds[0]);
      expect(Math.max(...polygon.map(point => point[0]))).toBeCloseTo(bounds[2]);
      expect(Math.min(...polygon.map(point => point[1]))).toBeCloseTo(bounds[1]);
      expect(Math.max(...polygon.map(point => point[1]))).toBeCloseTo(bounds[3]);
    }
    const rendered = render(layer, dataset, data);
    expect(rendered.props.filterRange).toEqual(dataset.gpuFilter.filterRange);
    expect(data.data.map(rendered.props.getFilterValue)).toEqual(
      indices.map(index => [rows[index][2] - 10, 0, 0, 0])
    );
    previous = data;
  }
  dataset.filterTable(assignGpuChannels([{...filter, enabled: false}]), [layer]);
  expect(layer.formatLayerData(datasets, previous).data).toEqual(original.data);
});

test('timeline updates rebuild the mosaic and clearing the filter restores all sites', async () => {
  const {layer, dataset, datasets} = await setup({
    fields: [...fields, {name: 'time', type: 'timestamp', format: ''}],
    rows: rows.map((row, i) => [...row, (i + 1) * 1000])
  });
  const original = layer.formatLayerData(datasets);
  const bounds = layer.meta.bounds;
  let state = {
    ...INITIAL_VIS_STATE,
    datasets,
    filters: [getDefaultFilter({dataId: [dataset.id]})],
    layers: [layer],
    layerData: [original],
    layerOrder: [layer.id]
  };
  state = setFilterUpdater(state, {idx: 0, prop: 'name', value: 'time'});
  expect(state.filters[0].type).toBe(FILTER_TYPES.timeRange);
  expect(state.filters[0].gpu).toBe(true);
  for (const {value, indices} of [
    {value: [1000, 2000], indices: [0, 1]},
    {value: [3000, 4000], indices: [2, 3]},
    {value: [2100, 2900], indices: []},
    {value: [1000, 2000], indices: [0, 1]}
  ]) {
    state = setFilterUpdater(state, {idx: 0, prop: 'value', value});
    expect(state.layers[0].isValid).toBe(true);
    expect(state.layerData[0].data.map(cell => cell.index)).toEqual(indices);
    expect(state.layers[0].meta.bounds).toEqual(bounds);
    if (indices.length) {
      expect(state.layerData[0].data[0].polygon).not.toEqual(original.data[indices[0]].polygon);
    }
  }
  state = setFilterUpdater(state, {idx: 0, prop: 'enabled', value: false});
  expect(state.layerData[0].data).toEqual(original.data);
});

test('polygon filters operate on the source site rather than the cell boundary', async () => {
  const {layer, dataset} = await setup();
  expect(EDITOR_AVAILABLE_LAYERS).toContain('voronoi');
  const filter = {
    value: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-2, -2],
            [0, -2],
            [0, 2],
            [-2, 2],
            [-2, -2]
          ]
        ]
      }
    }
  };
  const contains = getPolygonFilterFunctor(layer, filter, dataset.dataContainer);
  expect([0, 1, 2, 3].map(index => contains({index}))).toEqual([true, false, true, false]);
});

test('reuses geometry for styling and rebuilds for padding, coordinates, and data revision', async () => {
  const {layer, dataset, datasets} = await setup();
  const first = layer.formatLayerData(datasets);
  layer.updateLayerVisConfig({opacity: 0.4, thickness: 2, filled: false});
  const styled = layer.formatLayerData(datasets, first);
  expect(styled.data).toBe(first.data);
  expect(render(layer, dataset, styled).props.filled).toBe(false);
  expect(render(layer, dataset, styled).props.opacity).toBe(0.4);
  layer.updateLayerVisConfig({boundsPadding: 30});
  const padded = layer.formatLayerData(datasets, styled);
  expect(padded.data[0].polygon).not.toEqual(first.data[0].polygon);
  await dataset.update({
    fields,
    rows: [
      [-2, 0, 15],
      [2, 0, 25]
    ]
  });
  const replaced = layer.formatLayerData(datasets, padded);
  expect(replaced.data).toHaveLength(2);
  expect(replaced.data[0].position).toEqual([-2, 0]);
  layer.updateLayerConfig({columns: {...layer.config.columns, lng: layer.config.columns.lat}});
  const moved = layer.formatLayerData(datasets, replaced);
  expect(moved.data).toHaveLength(1);
  expect(moved.data[0].position).toEqual([0, 0]);
});

test('missing datasets and columns clear stale cells and recover after reassignment', async () => {
  const {layer, datasets} = await setup();
  const original = layer.formatLayerData(datasets);
  expect(layer.formatLayerData({}, original).data).toEqual([]);
  expect(layer.meta.bounds).toBeNull();
  expect(layer.formatLayerData(datasets).data).toEqual(original.data);
  layer.updateLayerConfig({columns: {...layer.config.columns, lat: {value: null, fieldIdx: -1}}});
  expect(layer.formatLayerData(datasets).data).toEqual([]);
});

test('GeoJSON features and geometries produce centroid sites with source colors and hover data', async () => {
  const {layer, dataset, datasets} = await setup({
    fields: [{name: 'shape', type: 'geojson', analyzerType: DATA_TYPES.GEOMETRY}, fields[2]],
    rows: [
      [{type: 'Feature', properties: {}, geometry: {type: 'Point', coordinates: [-1, -1]}}, 10],
      [
        {
          type: 'LineString',
          coordinates: [
            [1, -2],
            [1, 0]
          ]
        },
        20
      ],
      [
        {
          type: 'Polygon',
          coordinates: [
            [
              [-2, 0],
              [0, 0],
              [0, 2],
              [-2, 2],
              [-2, 0]
            ]
          ]
        },
        30
      ],
      [
        {
          type: 'MultiPoint',
          coordinates: [
            [0, 1],
            [2, 1]
          ]
        },
        40
      ],
      [
        {
          type: 'GeometryCollection',
          geometries: [
            {type: 'Point', coordinates: [-1, 3]},
            {
              type: 'LineString',
              coordinates: [
                [1, 2],
                [3, 4]
              ]
            }
          ]
        },
        50
      ],
      [JSON.stringify({type: 'Point', coordinates: [3, 3]}), 200],
      [null, 70],
      ['invalid geometry', 80],
      [{type: 'Feature', properties: {}, geometry: null}, 90],
      [{type: 'Polygon', coordinates: []}, 100],
      [{type: 'Point', coordinates: [NaN, 0]}, 110],
      [{type: 'Point', coordinates: [200, 0]}, 120]
    ]
  });
  const defaults = VoronoiLayer.findDefaultLayerProps(dataset);
  expect(defaults.props).toEqual([]);
  expect(defaults.altProps).toHaveLength(1);
  layer.updateLayerConfig({
    columnMode: defaults.altProps[0].columnMode,
    columns: {...layer.config.columns, ...defaults.altProps[0].columns},
    colorField: dataset.fields[1],
    colorScale: 'quantize'
  });
  layer.updateLayerDomain(datasets);
  layer.updateLayerVisConfig({
    colorRange: {...layer.config.visConfig.colorRange, colors: ['#FF0000', '#00FF00']}
  });
  expect(layer.hasAllColumns()).toBe(true);
  const data = layer.formatLayerData(datasets);
  expect(data.data.map(cell => cell.index)).toEqual([0, 1, 2, 3, 4, 5]);
  const expected = [
    [-1, -1],
    [1, -1],
    [-1.2, 0.8],
    [1, 1],
    [1, 3],
    [3, 3]
  ];
  data.data.forEach((cell, index) => {
    expect(cell.position[0]).toBeCloseTo(expected[index][0]);
    expect(cell.position[1]).toBeCloseTo(expected[index][1]);
    expect(data.getFillColor(cell)).toEqual(index === 5 ? [0, 255, 0] : [255, 0, 0]);
    expect(layer.getHoverData(cell, dataset.dataContainer)).toEqual(
      dataset.dataContainer.row(index)
    );
  });
  const bounds = layer.meta.bounds;
  const remaining = copyTableAndUpdate(dataset, {filteredIndex: [3]});
  const filtered = layer.formatLayerData({[dataset.id]: remaining}, data);
  expect(filtered.data.map(cell => cell.index)).toEqual([3]);
  expect(filtered.data[0].polygon).not.toEqual(data.data[3].polygon);
  expect(layer.meta.bounds).toEqual(bounds);

  const contains = getPolygonFilterFunctor(
    layer,
    {
      value: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [0.5, 0.5],
              [1.5, 0.5],
              [1.5, 1.5],
              [0.5, 1.5],
              [0.5, 0.5]
            ]
          ]
        }
      }
    },
    dataset.dataContainer
  );
  expect(contains({index: 3})).toBe(true); // Centroid is inside; both source points are outside.
  expect(contains({index: 2})).toBe(false);
  expect(contains({index: 6})).toBe(false);
  expect(contains({index: 7})).toBe(false);

  const invalid = copyTableAndUpdate(dataset, {filteredIndex: [6, 7, 8, 9, 10, 11]});
  expect(layer.formatLayerData({[dataset.id]: invalid}, filtered).data).toEqual([]);
});

test('switching input modes rebuilds cells and GeoJSON settings survive layer type changes', async () => {
  const {layer, dataset, datasets} = await setup({
    fields: [...fields, {name: 'shape', type: 'geojson', analyzerType: DATA_TYPES.GEOMETRY}],
    rows: rows.map(row => [...row, {type: 'Point', coordinates: [row[0] + 10, row[1]]}])
  });
  layer.updateLayerConfig({columns: layer.assignColumn('geojson', dataset.fields[3])});
  const original = layer.formatLayerData(datasets);
  layer.updateLayerConfig({columnMode: 'geojson'});
  const centroids = layer.formatLayerData(datasets, original);
  expect(centroids.data.map(cell => cell.position)).toEqual(rows.map(row => [row[0] + 10, row[1]]));
  layer.updateLayerConfig({columnMode: 'points'});
  expect(layer.formatLayerData(datasets, centroids).data).toEqual(original.data);

  // A geometry-only layer must stay valid without latitude/longitude assignments.
  layer.updateLayerConfig({
    columnMode: 'geojson',
    columns: {
      ...layer.config.columns,
      lat: {value: null, fieldIdx: -1},
      lng: {value: null, fieldIdx: -1}
    }
  });
  const saved = SchemaManager.getConfigToSave({
    ...StateWFiles,
    visState: {...StateWFiles.visState, layers: [layer], layerOrder: [layer.id]}
  });
  const config = SchemaManager.parseSavedConfig(saved)!.visState!.layers![0].config;
  expect(config.columnMode).toBe('geojson');
  expect(config.columns.geojson).toBe('shape');
  const state = {
    ...INITIAL_VIS_STATE,
    datasets,
    layers: [layer],
    layerData: [layer.formatLayerData(datasets)],
    layerOrder: [layer.id]
  };
  const geojsonState = layerTypeChangeUpdater(state, {oldLayer: layer, newType: 'geojson'});
  const mosaicState = layerTypeChangeUpdater(geojsonState, {
    oldLayer: geojsonState.layers[0],
    newType: 'voronoi'
  });
  expect(mosaicState.layers[0].config.columnMode).toBe('geojson');
  expect(mosaicState.layerData[0].data).toEqual(centroids.data);
  layer.updateLayerConfig({
    columns: {...layer.config.columns, geojson: {value: null, fieldIdx: -1}}
  });
  expect(layer.hasAllColumns()).toBe(false);
  expect(layer.formatLayerData(datasets).data).toEqual([]);
});

test.each([new Float64(), new Int64()])(
  'reads numeric Arrow-backed coordinates: %s',
  async type => {
    const values = type instanceof Int64 ? [-1n, 1n, -1n, 1n] : [-1, 1, -1, 1];
    const table = new Table({
      longitude: vectorFromArray(values, type),
      latitude: vectorFromArray([-1, -1, 1, 1], new Float64()),
      value: vectorFromArray([10, 20, 30, 40], new Float64())
    });
    const {layer, datasets} = await setup(processArrowBatches(table.batches)!);
    expect(layer.formatLayerData(datasets).data.map(cell => cell.position)).toEqual(
      rows.map(row => row.slice(0, 2))
    );
  }
);

test('saves Voronoi settings and switches between point and Voronoi without changing data', async () => {
  const {layer, dataset, datasets} = await setup();
  layer.updateLayerVisConfig({boundsPadding: 25, strokeColor: [12, 34, 56]});
  const saved = SchemaManager.getConfigToSave({
    ...StateWFiles,
    visState: {...StateWFiles.visState, layers: [layer], layerOrder: [layer.id]}
  });
  const parsed = SchemaManager.parseSavedConfig(saved)!;
  expect(parsed.visState!.layers![0].type).toBe('voronoi');
  expect(parsed.visState!.layers![0].config.visConfig).toEqual(layer.config.visConfig);
  const state = {
    ...INITIAL_VIS_STATE,
    datasets,
    layers: [layer],
    layerData: [layer.formatLayerData(datasets)],
    layerOrder: [layer.id]
  };
  const pointState = layerTypeChangeUpdater(state, {oldLayer: layer, newType: 'point'});
  expect(pointState.layers[0].type).toBe('point');
  const mosaicState = layerTypeChangeUpdater(pointState, {
    oldLayer: pointState.layers[0],
    newType: 'voronoi'
  });
  expect(mosaicState.layers[0].hasAllColumns()).toBe(true);
  expect(mosaicState.layerData[0].data).toHaveLength(4);
  expect(dataset.dataContainer.numRows()).toBe(4);
});
