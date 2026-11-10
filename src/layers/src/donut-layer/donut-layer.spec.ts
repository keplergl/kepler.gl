// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Float64, Int64, Table, vectorFromArray} from 'apache-arrow';
import Supercluster from 'supercluster';
import {
  KeplerTable,
  copyTableAndUpdate,
  getGpuFilterProps,
  assignGpuChannels
} from '@kepler.gl/table';
import {processArrowBatches} from '@kepler.gl/processors';
import {EDITOR_AVAILABLE_LAYERS, FILTER_TYPES, MAX_GPU_FILTERS} from '@kepler.gl/constants';
import {getDefaultFilter, getPolygonFilterFunctor} from '@kepler.gl/utils';
import SchemaManager, {VisState} from '@kepler.gl/schemas';
import {
  INITIAL_VIS_STATE,
  getLayerHoverProp,
  layerTypeChangeUpdater,
  layerVisConfigChangeUpdater
} from '@kepler.gl/reducers';
import {StateWFiles} from 'test/helpers/mock-state';
import {LayerClasses} from '../index';
import DonutLayer from './donut-layer';
import {
  DONUT_COLORS,
  getDonutBoundaries,
  getDonutCategories,
  getDonutComposition
} from './donut-utils';

const fields = [
  {name: 'longitude', type: 'real'},
  {name: 'latitude', type: 'real'},
  {name: 'bus', type: 'real'},
  {name: 'car', type: 'real'}
];
const rows = [
  [-1, 0, 30, 70],
  [1, 0, 10, 15],
  [2, 0, 0, 0],
  [3, 0, null, 10],
  [4, 0, -1, 20]
];
const categories = ['bus', 'car'].map((field, index) => ({
  field,
  label: field,
  color: DONUT_COLORS[index]
}));

async function setup(data = {fields, rows}) {
  const dataset = new KeplerTable({info: {id: 'donut-test'}, color: [0, 0, 0]});
  await dataset.importData({data});
  dataset.gpuFilter = getGpuFilterProps([], dataset.id, dataset.fields);
  const layer = new DonutLayer({
    dataId: dataset.id,
    columns: {
      lng: {value: 'longitude', fieldIdx: 0},
      lat: {value: 'latitude', fieldIdx: 1}
    }
  });
  layer.updateLayerVisConfig({composition: {categories}});
  return {layer, dataset, datasets: {[dataset.id]: dataset}};
}

function render(layer, dataset, data, zoom = 10) {
  return layer.renderLayer({
    data,
    idx: 0,
    gpuFilter: dataset.gpuFilter,
    mapState: {zoom},
    visible: true
  });
}

test('offers a separate layer and point columns without adding a layer on import', async () => {
  const {layer, dataset} = await setup();
  expect(LayerClasses.donut).toBe(DonutLayer);
  expect(EDITOR_AVAILABLE_LAYERS).toContain('donut');
  expect(DonutLayer.findDefaultLayerProps(dataset).props).toEqual([]);
  expect(layer.hasAllColumns()).toBe(true);
  expect(layer.isAggregated).toBe(false);
  expect(layer.config.visConfig).toMatchObject({clusterRadius: 90, radius: 25});
  expect(layer.visConfigSettings.aggregationMode).toBeUndefined();
  expect(layer.visConfigSettings.gridSize).toBeUndefined();
});

test('normalizes missing cells to zero and rejects invalid numeric parts', () => {
  expect(getDonutComposition([30, 70])).toEqual({
    values: [30, 70],
    shares: [0.3, 0.7],
    total: 100,
    status: 'valid'
  });
  expect(getDonutComposition([30n, 70n]).shares).toEqual([0.3, 0.7]);
  expect(getDonutComposition([0, 0])).toMatchObject({total: 0, status: 'empty', shares: [0, 0]});
  for (const value of [null, undefined]) {
    expect(getDonutComposition([value, 10])).toMatchObject({
      values: [0, 10],
      total: 10,
      status: 'valid',
      shares: [0, 1]
    });
  }
  expect(getDonutComposition([null, undefined])).toEqual({
    values: [0, 0],
    total: 0,
    status: 'empty',
    shares: [0, 0]
  });
  for (const value of [-1, NaN, Infinity, '10', '']) {
    expect(getDonutComposition([value, 10])).toMatchObject({
      total: null,
      status: 'invalid',
      shares: [0, 0]
    });
  }
  expect(getDonutComposition([]).status).toBe('missing');
  expect(getDonutComposition([Number.MAX_VALUE, Number.MAX_VALUE]).status).toBe('invalid');
  expect(getDonutBoundaries(getDonutComposition([0, 10, 0, 10]))).toEqual([0, 0.5, 0.5, 1, 1, 1]);
});

test('keeps category order and guards duplicate, missing, and excess field configuration', () => {
  expect(getDonutCategories(null)).toEqual([]);
  expect(getDonutCategories({categories: [null, ...categories, categories[0]]})).toEqual(
    categories
  );
  expect(
    getDonutCategories({categories: Array.from({length: 9}, (_, i) => ({field: String(i)}))})
  ).toHaveLength(6);
});

test('renders fixed pixel radii and optional totals even with a legacy area sizing flag', async () => {
  const {layer, dataset, datasets} = await setup();
  const data = layer.formatLayerData(datasets);
  expect(data.data.map(point => point.index)).toEqual([0, 1, 2, 3, 4]);
  expect(data.data.map(point => point.status)).toEqual([
    'valid',
    'valid',
    'empty',
    'valid',
    'valid'
  ]);
  const [ring] = render(layer, dataset, data);
  expect(ring.props.radiusUnits).toBe('pixels');
  expect(ring.props.pickable).toBe(true);
  expect(ring.props.data.map(point => point.index)).toEqual([0, 1, 3, 4]);
  expect(ring.props.data.map(ring.props.getRadius)).toEqual([25, 25, 25, 25]);
  expect(ring.props.getDonutStart(data.data[0])).toEqual([0.3, 1, 1]);
  expect(ring.props.getDonutEnd(data.data[0])).toEqual([1, 1, 1]);
  expect(ring.props.getDonutStart(data.data[3])).toEqual([0, 1, 1]);
  expect(ring.props.getDonutEnd(data.data[3])).toEqual([1, 1, 1]);
  layer.updateLayerVisConfig({sizeByTotal: true, showTotal: true, radius: 32});
  const [sized, labels] = render(layer, dataset, data);
  expect(sized.props.data.map(sized.props.getRadius)).toEqual([32, 32, 32, 32]);
  expect(labels.props.getText(data.data[0])).toBe('100');
  expect(labels.props.data).toEqual(sized.props.data);
  expect(labels.props.pickable).toBe(false);
  expect(labels.props.filterEnabled).toBe(false);
  expect(layer.getHoverData(data.data[0], dataset.dataContainer, dataset.fields)).toEqual({
    donut: {
      values: [30, 70],
      shares: [0.3, 0.7],
      total: 100,
      status: 'valid',
      categories
    }
  });
});

test.each([-1, NaN, Infinity])(
  'individual clusters ignore %s, render valid parts and include the omission count in hover',
  async invalidValue => {
    const {layer, dataset, datasets} = await setup({
      fields,
      rows: [
        [30.51, 50.45, 30, invalidValue],
        [30.52, 50.45, 10, 10]
      ]
    });
    layer.updateLayerVisConfig({showTotal: true});
    const data = layer.formatLayerData(datasets);
    const [rings, labels] = render(layer, dataset, data, 18);
    expect(rings.props.data).toHaveLength(2);
    const point = rings.props.data[0];
    expect(point).toMatchObject({
      values: [30, 0],
      shares: [1, 0],
      total: 30,
      status: 'valid',
      ignoredValueCount: 1
    });
    expect(rings.props.getDonutStart(point)).toEqual([1, 1, 1]);
    expect(rings.props.getDonutEnd(point)).toEqual([1, 1, 1]);
    expect(rings.props.donutColors).toEqual(categories.map(category => category.color));
    expect(labels.props.getText(point)).toBe('30');
    expect(rings.props.getRadius(point)).toBe(25);
    expect(layer.getHoverData(point, dataset.dataContainer, dataset.fields)?.donut).toMatchObject({
      values: [30, 0],
      shares: [1, 0],
      total: 30,
      status: 'valid',
      ignoredValueCount: 1
    });
  }
);

test('CPU, polygon and GPU filtering preserve original indices, category colors and radius', async () => {
  const {layer, dataset, datasets} = await setup();
  const original = layer.formatLayerData(datasets);
  for (const patch of [
    {filteredIndex: [1]},
    {filteredIndexByLayer: {[layer.id]: [1]}},
    {filteredIndex: []}
  ]) {
    const table = copyTableAndUpdate(dataset, patch);
    const data = layer.formatLayerData({[dataset.id]: table}, original);
    expect(data.data.map(point => point.index)).toEqual(
      'filteredIndex' in patch ? patch.filteredIndex : [1]
    );
    const [ring] = render(layer, table, data);
    expect(ring.props.donutColors).toEqual(categories.map(category => category.color));
    if (data.data.length) {
      expect(ring.props.getRadius(data.data[0])).toBe(25);
    }
  }
  const filter = {
    ...getDefaultFilter({dataId: [dataset.id]}),
    type: FILTER_TYPES.range,
    name: ['bus'],
    fieldIdx: [2],
    domain: [0, 30],
    value: [10, 10],
    gpu: true
  };
  dataset.filterTable(assignGpuChannels([filter]), [layer]);
  const data = layer.formatLayerData(datasets);
  const [ring] = render(layer, dataset, data);
  expect(ring.props.filterRange).toEqual(dataset.gpuFilter.filterRange);
  expect(ring.props.filterEnabled).toBe(false);
  expect(ring.props.data.map(point => point.values)).toEqual([[10, 15]]);
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
              [-2, -1],
              [0, -1],
              [0, 1],
              [-2, 1],
              [-2, -1]
            ]
          ]
        }
      }
    },
    dataset.dataContainer
  );
  expect(contains({index: 0})).toBe(true);
  expect(contains({index: 1})).toBe(false);
});

test('one composition field fills the ring with its selected color in clusters', async () => {
  const {layer, dataset, datasets} = await setup({
    fields,
    rows: [
      [30.51, 50.45, 30, null],
      [30.52, 50.45, 10, -1]
    ]
  });
  const original = layer.formatLayerData(datasets);
  const category = {...categories[0], color: DONUT_COLORS[1]};
  layer.updateLayerVisConfig({
    showTotal: true,
    composition: {categories: [category]}
  });
  const data = layer.formatLayerData(datasets, original);
  const [rings, labels] = render(layer, dataset, data, 4);
  expect(rings.props.donutColors).toEqual([category.color]);
  expect(rings.props.data.map(point => point.total)).toEqual([40]);
  for (const point of rings.props.data) {
    expect(point.status).toBe('valid');
    expect(point.shares).toEqual([1]);
    expect(rings.props.getDonutStart(point)).toEqual([1, 1, 1]);
    expect(rings.props.getDonutEnd(point)).toEqual([1, 1, 1]);
    expect(labels.props.getText(point)).toBe(String(point.total));
    expect(layer.getHoverData(point, dataset.dataContainer, dataset.fields)?.donut).toMatchObject({
      categories: [category],
      values: [point.total],
      shares: [1],
      total: point.total
    });
  }
});

test('one composition field hides zero, missing and invalid-only records', async () => {
  const {layer, dataset, datasets} = await setup();
  layer.updateLayerVisConfig({composition: {categories: [categories[0]]}});
  const data = layer.formatLayerData(datasets);
  expect(data.data.map(point => point.status)).toEqual([
    'valid',
    'valid',
    'empty',
    'empty',
    'empty'
  ]);
  expect(data.data[4].ignoredValueCount).toBe(1);
  for (const point of data.data.slice(2)) {
    expect(point.shares).toEqual([0]);
    expect(point.boundaries).toEqual([0, 0, 0, 0, 0, 0]);
  }
  expect(render(layer, dataset, data)[0].props.data.map(point => point.index)).toEqual([0, 1]);
});

test('Cluster sums missing cells as zero while preserving missing-field errors', async () => {
  const {layer, dataset, datasets} = await setup({
    fields,
    rows: [
      [30.51, 50.45, null, 10],
      [30.52, 50.45, 30, null]
    ]
  });
  layer.updateLayerVisConfig({showTotal: true});
  const data = layer.formatLayerData(datasets);
  const [rings, labels] = render(layer, dataset, data, 4);
  expect(rings.props.data.map(point => point.values)).toEqual([[30, 10]]);
  expect(rings.props.data.map(point => point.shares)).toEqual([[0.75, 0.25]]);
  for (const point of rings.props.data) {
    expect(point.status).toBe('valid');
    expect(point.boundaries[5]).toBe(1);
    expect(labels.props.getText(point)).toBe(String(point.total));
    expect(layer.getHoverData(point, dataset.dataContainer, dataset.fields)?.donut).toMatchObject({
      values: point.values,
      shares: point.shares,
      total: point.total,
      status: 'valid'
    });
  }
  expect(
    render(layer, dataset, data, 18)[0]
      .props.data.map(point => point.total)
      .sort((a, b) => a - b)
  ).toEqual([10, 30]);
  layer.updateLayerVisConfig({
    composition: {categories: [categories[0], {...categories[1], field: 'absent'}]}
  });
  const unavailable = layer.formatLayerData(datasets, data);
  for (const point of render(layer, dataset, unavailable, 4)[0].props.data) {
    expect(point).toMatchObject({status: 'missing', total: null, shares: [0, 0]});
    expect(point.values[1]).toBeNull();
  }
});

test('refreshes category values after edits, field reordering and data replacement', async () => {
  const {layer, dataset, datasets} = await setup();
  const original = layer.formatLayerData(datasets);
  layer.updateLayerVisConfig({composition: {categories: [...categories].reverse()}});
  const reordered = layer.formatLayerData(datasets, original);
  expect(reordered.data[0].shares).toEqual([0.7, 0.3]);
  await dataset.update({
    fields: [fields[0], fields[1], fields[3], fields[2]],
    rows: [[0, 0, 60, 20]]
  });
  const replaced = layer.formatLayerData(datasets, reordered);
  expect(replaced.data[0].values).toEqual([60, 20]);
  layer.updateLayerVisConfig({
    composition: {categories: [categories[0], {...categories[1], field: 'absent'}]}
  });
  expect(layer.formatLayerData(datasets, replaced).data[0].status).toBe('missing');
});

test('empty selections, missing datasets and columns clear stale data and recover', async () => {
  const {layer, datasets} = await setup();
  const original = layer.formatLayerData(datasets);
  expect(layer.formatLayerData({}, original).data).toEqual([]);
  expect(layer.formatLayerData(datasets, {data: []}).data).toEqual(original.data);
  layer.updateLayerVisConfig({composition: {categories: []}});
  expect(layer.formatLayerData(datasets, original).data).toEqual([]);
  layer.updateLayerVisConfig({composition: {categories: [categories[0]]}});
  expect(layer.formatLayerData(datasets, {data: []}).data.map(point => point.values)).toEqual(
    original.data.map(point => [point.values[0]])
  );
  layer.updateLayerVisConfig({composition: {categories}});
  expect(layer.formatLayerData(datasets, {data: []}).data).toEqual(original.data);
  layer.updateLayerConfig({columns: {...layer.config.columns, lat: {value: null, fieldIdx: -1}}});
  expect(layer.formatLayerData(datasets, original).data).toEqual([]);
});

test('rejects invalid coordinates and reads Arrow numeric fields', async () => {
  const invalid = await setup({
    fields,
    rows: [
      [null, 0, 1, 2],
      [200, 0, 1, 2],
      [0, 91, 1, 2],
      [0, 0, 1, 2]
    ]
  });
  expect(invalid.layer.formatLayerData(invalid.datasets).data.map(point => point.index)).toEqual([
    3
  ]);
  expect(invalid.layer.meta.bounds).toEqual([0, 0, 0, 0]);
  const table = new Table({
    longitude: vectorFromArray([1], new Float64()),
    latitude: vectorFromArray([2], new Float64()),
    bus: vectorFromArray([30n], new Int64()),
    car: vectorFromArray([70], new Float64())
  });
  const arrow = await setup(processArrowBatches(table.batches)!);
  expect(arrow.layer.formatLayerData(arrow.datasets).data[0]).toMatchObject({
    position: [1, 2],
    shares: [0.3, 0.7]
  });
});

test('saves categories and sizing settings and switches to the layer using existing coordinates', async () => {
  const {layer, datasets} = await setup();
  layer.updateLayerVisConfig({
    showTotal: true,
    radius: 32,
    clusterRadius: 120
  });
  const saved = SchemaManager.getConfigToSave({
    ...StateWFiles,
    visState: {
      ...StateWFiles.visState,
      layers: [layer],
      layerOrder: [layer.id]
    }
  });
  const parsed = SchemaManager.parseSavedConfig(saved)!;
  expect(parsed.visState!.layers![0].type).toBe('donut');
  expect(parsed.visState!.layers![0].config.visConfig).toEqual(layer.config.visConfig);
  const state = {
    ...INITIAL_VIS_STATE,
    datasets,
    layers: [layer],
    layerData: [layer.formatLayerData(datasets)],
    layerOrder: [layer.id]
  };
  const points = layerTypeChangeUpdater(state, {oldLayer: layer, newType: 'point'});
  const donuts = layerTypeChangeUpdater(points, {oldLayer: points.layers[0], newType: 'donut'});
  expect(donuts.layers[0].hasAllColumns()).toBe(true);
  expect(donuts.layers[0].type).toBe('donut');
});

const nearbyRows = [
  [30.51, 50.45, 90, 10],
  [30.52, 50.45, 1, 9]
];

async function setupPinnedDonut() {
  const {layer, dataset, datasets} = await setup({
    fields: [...fields, {name: 'bike', type: 'real'}],
    rows: [
      [30.51, 50.45, 30, 70, 5],
      [30.52, 50.45, 10, 90, 15]
    ]
  });
  const data = layer.formatLayerData(datasets);
  const [rings] = render(layer, dataset, data, 4);
  const clicked = {picked: true, index: 0, object: rings.props.data[0], layer: rings};
  const state = {
    ...INITIAL_VIS_STATE,
    datasets,
    layers: [layer],
    layerData: [data],
    layerOrder: [layer.id],
    clicked,
    hoverInfo: clicked
  };
  const hover = current =>
    getLayerHoverProp({
      ...current,
      hoverInfo: current.clicked,
      layersToRender: {[layer.id]: true}
    });
  return {layer, dataset, state, hover};
}

test.each([
  ['removing', [categories[1]], [160]],
  ['adding', [...categories, {field: 'bike'}], [40, 160, 20]],
  ['reordering', [...categories].reverse(), [160, 40]],
  ['clearing', [], []]
])('%s composition fields clears stale pinned and hover tooltips', async (_, selected, values) => {
  const {layer, dataset, state, hover} = await setupPinnedDonut();
  expect(hover(state)?.data).toMatchObject({
    donut: {values: [40, 160], shares: [0.2, 0.8], total: 200}
  });
  const next = layerVisConfigChangeUpdater(state, {
    oldLayer: layer,
    newVisConfig: {composition: {categories: selected}}
  });
  expect(next.clicked).toBeUndefined();
  expect(next.hoverInfo).toBeUndefined();
  expect(hover(next)).toBeNull();

  const [rings] = render(next.layers[0], dataset, next.layerData[0], 4);
  if (values.length) {
    const repinned = hover({
      ...next,
      clicked: {...state.clicked, layer: rings, object: rings.props.data[0]}
    });
    expect(repinned?.data).toMatchObject({donut: {values}});
  } else {
    expect(rings.props.data).toEqual([]);
  }
});

test('presentation edits preserve pinned tooltips with current labels and colors', async () => {
  const {layer, state, hover} = await setupPinnedDonut();
  const renamed = [{...categories[0], label: 'Transit', color: [1, 2, 3]}, categories[1]];
  let next: VisState = state;
  for (const newVisConfig of [
    {composition: {categories: renamed}},
    {radius: 40},
    {showTotal: true}
  ]) {
    next = layerVisConfigChangeUpdater(next, {oldLayer: layer, newVisConfig});
    expect(next.clicked).toBe(state.clicked);
    expect(next.hoverInfo).toBe(state.hoverInfo);
    expect(hover(next)?.data).toMatchObject({
      donut: {categories: renamed, values: [40, 160], shares: [0.2, 0.8], total: 200}
    });
  }
});

test('composition edits preserve picks belonging to another layer', async () => {
  const {layer, state} = await setupPinnedDonut();
  const otherPick = {...state.clicked, layer: {props: {id: 'other-layer', idx: 1}}};
  const next = layerVisConfigChangeUpdater(
    {...state, clicked: otherPick, hoverInfo: otherPick},
    {oldLayer: layer, newVisConfig: {composition: {categories: [categories[1]]}}}
  );
  expect(next.clicked).toBe(otherPick);
  expect(next.hoverInfo).toBe(otherPick);
});

test('presentation edits reuse the cluster index while updating radii, totals, labels and colors', async () => {
  const {layer, dataset, datasets} = await setup({fields, rows: nearbyRows});
  const load = jest.spyOn(Supercluster.prototype, 'load');
  try {
    let data = layer.formatLayerData(datasets);
    const originalGroups = render(layer, dataset, data, 4)[0].props.data;
    expect(load).toHaveBeenCalledTimes(1);
    const renamed = [{...categories[0], label: 'Transit'}, categories[1]];
    const recolored = [{...renamed[0], color: [1, 2, 3]}, renamed[1]];
    for (const change of [
      {radius: 40},
      {showTotal: true},
      {composition: {categories: renamed}},
      {composition: {categories: recolored}}
    ]) {
      layer.updateLayerVisConfig(change);
      data = layer.formatLayerData(datasets, data);
      expect(render(layer, dataset, data, 4)[0].props.data).toBe(originalGroups);
      expect(load).toHaveBeenCalledTimes(1);
    }
    const [rings, labels] = render(layer, dataset, data, 4);
    expect(rings.props.getRadius(originalGroups[0])).toBe(40);
    expect(labels.props.getText(originalGroups[0])).toBe('110');
    expect(rings.props.donutColors).toEqual([[1, 2, 3], categories[1].color]);
    expect(
      layer.getHoverData(originalGroups[0], dataset.dataContainer, dataset.fields)?.donut.categories
    ).toEqual(recolored);
  } finally {
    load.mockRestore();
  }
});

test('cached filter accessors refresh when the factory or data container changes', async () => {
  const {layer, dataset, datasets} = await setup({fields, rows: nearbyRows});
  const factory =
    (fieldIndex: number) =>
    (dc: KeplerTable['dataContainer']) =>
    () =>
    ({index}: {index: number}) =>
      Array.from({length: MAX_GPU_FILTERS}, (_, channel) =>
        channel === 0 ? dc.valueAt(index, fieldIndex) : 0
      );
  dataset.gpuFilter = {
    filterRange: Array.from({length: MAX_GPU_FILTERS}, () => [0, 10]),
    filterValueUpdateTriggers: {gpuFilter_0: {name: 'bus', domain0: 0}},
    filterValueAccessor: factory(2)
  };
  let data = layer.formatLayerData(datasets);
  expect(render(layer, dataset, data, 4)[0].props.data[0].total).toBe(10);

  // Keep all other inputs stable to verify a new accessor factory takes effect.
  dataset.gpuFilter = {...dataset.gpuFilter, filterValueAccessor: factory(3)};
  data = layer.formatLayerData(datasets, data);
  expect(render(layer, dataset, data, 4)[0].props.data[0].total).toBe(110);

  const replacement = await setup({
    fields,
    rows: [[30.51, 50.45, 1, 99], nearbyRows[1]]
  });
  replacement.dataset.gpuFilter = dataset.gpuFilter;
  data = layer.formatLayerData(replacement.datasets, data);
  expect(render(layer, replacement.dataset, data, 4)[0].props.data[0]).toMatchObject({
    total: 10,
    pointCount: 1
  });
});

test.each(['none', 'grid'])(
  'restores legacy %s settings as clusters while preserving custom radii',
  async aggregationMode => {
    const {layer, dataset, datasets} = await setup({fields, rows: nearbyRows});
    layer.assignConfigToLayer(
      {
        ...layer.config,
        visConfig: {
          ...layer.config.visConfig,
          aggregationMode,
          gridSize: 1,
          sizeByTotal: true,
          radius: 33,
          clusterRadius: 110
        }
      },
      layer.visConfigSettings,
      datasets
    );
    expect(layer.config.visConfig.aggregationMode).toBeUndefined();
    expect(layer.config.visConfig.gridSize).toBeUndefined();
    expect(layer.config.visConfig.sizeByTotal).toBeUndefined();
    expect(layer.config.visConfig).toMatchObject({radius: 33, clusterRadius: 110});
    const data = layer.formatLayerData(datasets);
    const [rings] = render(layer, dataset, data, 4);
    expect(rings.props.data).toHaveLength(1);
    expect(rings.props.data[0]).toMatchObject({total: 110, pointCount: 2});
    expect(rings.props.getRadius(rings.props.data[0])).toBe(33);
    const [detail] = render(layer, dataset, data, 18);
    expect(detail.props.data.map(detail.props.getRadius)).toEqual([33, 33]);
  }
);

test('Cluster responds to grouping size changes and recovers from invalid saved sizes', async () => {
  const {layer, dataset, datasets} = await setup({fields, rows: nearbyRows});
  layer.updateLayerVisConfig({clusterRadius: 20});
  const data = layer.formatLayerData(datasets);
  expect(render(layer, dataset, data, 12)[0].props.data).toHaveLength(2);
  layer.updateLayerVisConfig({clusterRadius: 500});
  expect(render(layer, dataset, data, 12)[0].props.data).toHaveLength(1);
  for (const size of [0, -1, NaN, undefined]) {
    layer.updateLayerVisConfig({clusterRadius: size});
    const groups = render(layer, dataset, data, 4)[0].props.data;
    expect(groups).toHaveLength(1);
    expect(groups[0].position.every(Number.isFinite)).toBe(true);
    expect(groups[0].total).toBe(110);
  }
});

test('Cluster merges on zoom out, sums before calculating ratios, and splits on zoom in', async () => {
  const {layer, dataset, datasets} = await setup({fields, rows: nearbyRows});
  layer.updateLayerVisConfig({showTotal: true});
  const data = layer.formatLayerData(datasets);
  const [rings, labels] = render(layer, dataset, data, 4);
  expect(rings.props.data).toHaveLength(1);
  const group = rings.props.data[0];
  expect(group).toMatchObject({
    values: [91, 19],
    total: 110,
    pointCount: 2,
    status: 'valid'
  });
  expect(group.shares[0]).toBeCloseTo(91 / 110);
  expect(group.boundaries).toEqual([91 / 110, 1, 1, 1, 1, 1]);
  expect(rings.props.getRadius(group)).toBe(25);
  expect(labels.props.getText(group)).toBe('110');
  expect(rings.props.filterEnabled).toBe(false);
  expect(labels.props.filterEnabled).toBe(false);
  expect(layer.getHoverData(group, dataset.dataContainer, dataset.fields)?.donut).toMatchObject({
    values: [91, 19],
    total: 110,
    pointCount: 2,
    categories
  });
  const [detail] = render(layer, dataset, data, 18);
  expect(detail.props.data).toHaveLength(2);
  expect(detail.props.data.map(point => point.total).sort((a, b) => a - b)).toEqual([10, 100]);
  expect(detail.props.data.every(point => point.pointCount === 1)).toBe(true);
  expect(detail.props.data.map(detail.props.getRadius)).toEqual([25, 25]);
  // A second map/zoom cannot mutate the first map's data or radius.
  expect(rings.props.getRadius(group)).toBe(25);
  expect(render(layer, dataset, data, 4)[0].props.data).toEqual(rings.props.data);
});

test('Cluster filters members before summing and refreshes after empty filters and dataset changes', async () => {
  const {layer, dataset, datasets} = await setup({fields, rows: nearbyRows});
  let data = layer.formatLayerData(datasets);
  expect(render(layer, dataset, data, 4)[0].props.data[0].total).toBe(110);
  // Both CPU filters and layer-specific polygon selections restrict the source rows.
  for (const patch of [{filteredIndex: [1]}, {filteredIndexByLayer: {[layer.id]: [1]}}]) {
    const table = copyTableAndUpdate(dataset, patch);
    data = layer.formatLayerData({[dataset.id]: table}, data);
    expect(render(layer, table, data, 4)[0].props.data[0]).toMatchObject({
      values: [1, 9],
      total: 10,
      pointCount: 1
    });
  }
  const filter = {
    ...getDefaultFilter({dataId: [dataset.id]}),
    type: FILTER_TYPES.range,
    name: ['bus'],
    fieldIdx: [2],
    domain: [1, 90],
    value: [1, 1],
    gpu: true
  };
  for (const [value, count, total] of [
    [[1, 1], 1, 10],
    [[20, 30], 0, undefined],
    [[1, 90], 2, 110]
  ] as [number[], number, number | undefined][]) {
    dataset.filterTable(assignGpuChannels([{...filter, value}]), [layer]);
    data = layer.formatLayerData(datasets, data);
    const groups = render(layer, dataset, data, 4)[0].props.data;
    expect(groups).toHaveLength(count ? 1 : 0);
    expect(groups[0]?.pointCount).toBe(count || undefined);
    expect(groups[0]?.total).toBe(total);
  }
  dataset.filterTable([], [layer]);
  await dataset.update({fields, rows: [[30.51, 50.45, 20, 60]]});
  layer.updateLayerVisConfig({composition: {categories: [...categories].reverse()}});
  data = layer.formatLayerData(datasets, data);
  expect(render(layer, dataset, data, 4)[0].props.data[0]).toMatchObject({
    values: [60, 20],
    shares: [0.75, 0.25],
    total: 80,
    pointCount: 1
  });
});

test('Cluster sums valid cells in every category and reports invalid omissions', async () => {
  const fourFields = [...fields, {name: 'bike', type: 'real'}, {name: 'walk', type: 'real'}];
  const fourCategories = ['bus', 'car', 'bike', 'walk'].map((field, index) => ({
    field,
    label: field,
    color: DONUT_COLORS[index]
  }));
  for (const walkValue of [8, 0]) {
    const {layer, dataset, datasets} = await setup({
      fields: fourFields,
      rows: [
        [30.51, 50.45, 10, 20, 30, -1],
        [30.52, 50.45, 5, 6, 7, walkValue],
        [30.53, 50.45, 0, 0, 0, -2]
      ]
    });
    layer.updateLayerVisConfig({composition: {categories: fourCategories}});
    const original = layer.formatLayerData(datasets);
    expect(original.data[0]).toMatchObject({status: 'valid', ignoredValueCount: 1});
    layer.updateLayerVisConfig({showTotal: true});
    const data = layer.formatLayerData(datasets, original);
    const [rings, labels] = render(layer, dataset, data, 4);
    expect(rings.props.data).toHaveLength(1);
    const group = rings.props.data[0];
    const total = 78 + walkValue;
    expect(group).toMatchObject({
      values: [15, 26, 37, walkValue],
      shares: [15, 26, 37, walkValue].map(value => value / total),
      total,
      status: 'valid',
      pointCount: 3,
      ignoredValueCount: 2
    });
    expect(group.boundaries[5]).toBe(1);
    expect(labels.props.getText(group)).toBe(String(total));
    expect(rings.props.getRadius(group)).toBe(25);
    expect(layer.getHoverData(group, dataset.dataContainer, dataset.fields)?.donut).toMatchObject({
      values: [15, 26, 37, walkValue],
      total,
      ignoredValueCount: 2
    });
    const filtered = copyTableAndUpdate(dataset, {filteredIndex: [1]});
    const filteredData = layer.formatLayerData({[dataset.id]: filtered}, data);
    expect(render(layer, filtered, filteredData, 4)[0].props.data[0]).toMatchObject({
      values: [5, 6, 7, walkValue],
      total: 18 + walkValue,
      pointCount: 1,
      ignoredValueCount: 0
    });
  }
});

test('Cluster hides zero-total donuts and labels and updates when values change', async () => {
  const zeroRows = [0, null, -1, NaN, Infinity].map(value => [30.51, 50.45, value, 0]);
  const {layer, dataset, datasets} = await setup({fields, rows: zeroRows});
  layer.updateLayerVisConfig({showTotal: true});
  let data = layer.formatLayerData(datasets);
  expect(render(layer, dataset, data, 4).map(deckLayer => deckLayer.props.data)).toEqual([[], []]);
  await dataset.update({
    fields,
    rows: [
      [30.51, 50.45, 0, 0],
      [30.52, 50.45, -1, 0],
      [-120, 37, 10, 0],
      [-120.0001, 37, 0, 0]
    ]
  });
  data = layer.formatLayerData(datasets, data);
  const [rings, labels] = render(layer, dataset, data, 4);
  expect(rings.props.data).toHaveLength(1);
  expect(labels.props.data).toEqual(rings.props.data);
  const point = rings.props.data[0];
  expect(point.total).toBe(10);
  expect(labels.props.getText(point)).toBe('10');
  expect(point.pointCount).toBe(2);
  expect(layer.getHoverData(point, dataset.dataContainer, dataset.fields)?.donut.total).toBe(10);
  await dataset.update({fields, rows: zeroRows});
  data = layer.formatLayerData(datasets, data);
  expect(render(layer, dataset, data, 4).map(deckLayer => deckLayer.props.data)).toEqual([[], []]);
});
