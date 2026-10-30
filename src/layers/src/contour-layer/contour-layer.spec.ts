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
import {buildScalarGrid, generateContours} from './contour-utils';
import SchemaManager from '@kepler.gl/schemas';
import {StateWFiles} from 'test/helpers/mock-state';
import {messages} from '@kepler.gl/localization';

test.each(Object.keys(messages))('resolves contour column labels in locale %s', locale => {
  const layer = new ContourLayer({dataId: 'contour-labels'});
  for (const key of layer.requiredLayerColumns) {
    const id = `columns.${layer.columnLabels[key] || key}`;
    expect(messages[locale][id]).toEqual(expect.any(String));
    expect(messages[locale][id]).not.toBe(id);
  }
});

async function setup() {
  const rows = Array.from({length: 81}, (_, i) => {
    const x = i % 9;
    const y = Math.floor(i / 9);
    return `${x},${y},${(x - 4) ** 2 + (y - 4) ** 2}`;
  });
  const dataset = new KeplerTable({info: {id: 'contour-test'}, color: [0, 0, 0]});
  await dataset.importData({data: processCsvData(`longitude,latitude,value\n${rows.join('\n')}`)!});
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

test('saves and reloads contour settings and value columns through the map schema', async () => {
  const {layer} = await setup();
  const saved = SchemaManager.getConfigToSave({
    ...StateWFiles,
    visState: {...StateWFiles.visState, layers: [layer], layerOrder: [layer.id]}
  });
  const parsed = SchemaManager.parseSavedConfig(saved);
  if (!parsed) throw new Error('Expected the saved contour configuration to parse.');
  const restored = parsed.visState!.layers![0];
  expect(restored.type).toBe('contour');
  expect(restored.config.visConfig).toEqual(layer.config.visConfig);
  // Saved configs retain column names; field indices are resolved against the loaded table.
  expect(restored.config.columns.value).toBe('value');
});

test('sample generates all configured levels with islands and finite closed geometry', () => {
  const sample = createContourSamples();
  const {visConfig} = contourConfig.config.visState.layers[0].config;
  const result = generateContours(buildScalarGrid(sample), {
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
});
