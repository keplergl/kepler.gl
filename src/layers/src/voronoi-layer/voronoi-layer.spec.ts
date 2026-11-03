// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Table, vectorFromArray, Float64, Int64} from 'apache-arrow';
import {KeplerTable, copyTableAndUpdate, getGpuFilterProps} from '@kepler.gl/table';
import {processArrowBatches} from '@kepler.gl/processors';
import {getPolygonFilterFunctor} from '@kepler.gl/utils';
import {EDITOR_AVAILABLE_LAYERS} from '@kepler.gl/constants';
import SchemaManager from '@kepler.gl/schemas';
import {INITIAL_VIS_STATE, layerTypeChangeUpdater} from '@kepler.gl/reducers';
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

test('CPU and per-layer filters hide cells without changing the retained boundaries', async () => {
  const {layer, dataset, datasets} = await setup();
  const original = layer.formatLayerData(datasets);
  for (const table of [
    copyTableAndUpdate(dataset, {filteredIndex: [1, 3]}),
    copyTableAndUpdate(dataset, {filteredIndexByLayer: {[layer.id]: [1, 3]}})
  ]) {
    const filtered = layer.formatLayerData({[dataset.id]: table}, original);
    expect(filtered.data.map(cell => cell.index)).toEqual([1, 3]);
    expect(filtered.data[0].polygon).toEqual(original.data[1].polygon);
    expect(filtered.data[1].polygon).toEqual(original.data[3].polygon);
    expect(layer.formatLayerData(datasets, filtered).data).toEqual(original.data);
  }
  const empty = copyTableAndUpdate(dataset, {filteredIndex: []});
  expect(layer.formatLayerData({[dataset.id]: empty}, original).data).toEqual([]);
});

test('passes GPU filter values and ranges through using source row indices', async () => {
  const {layer, dataset, datasets} = await setup();
  dataset.gpuFilter = {
    ...dataset.gpuFilter,
    filterRange: [
      [15, 25],
      [0, 0],
      [0, 0],
      [0, 0]
    ],
    filterValueAccessor: () => () => cell => [rows[cell.index][2], 0, 0, 0],
    filterValueUpdateTriggers: {value: {name: 'value', domain0: 0}}
  } as typeof dataset.gpuFilter;
  const data = layer.formatLayerData(datasets);
  const polygon = render(layer, dataset, data);
  expect(polygon.props.filterRange).toEqual(dataset.gpuFilter.filterRange);
  expect(data.data.map(polygon.props.getFilterValue)).toEqual(
    [10, 20, 30, 40].map(value => [value, 0, 0, 0])
  );
  expect(polygon.props.updateTriggers.getFilterValue).toEqual({value: {name: 'value', domain0: 0}});
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
