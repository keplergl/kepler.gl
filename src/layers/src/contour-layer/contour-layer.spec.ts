// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {KeplerTable, getGpuFilterProps, assignGpuChannels} from '@kepler.gl/table';
import {EDITOR_AVAILABLE_LAYERS, FILTER_TYPES} from '@kepler.gl/constants';
import {generatePolygonFilter, getDefaultFilter} from '@kepler.gl/utils';
import {PickingInfo} from '@deck.gl/core';
import {Int64, Uint64, Table, vectorFromArray} from 'apache-arrow';
import {processCsvData} from '@kepler.gl/processors';
import ContourLayer from './contour-layer';
import Layer from '../base-layer';
import {LayerClasses} from '../index';
import {
  createContourSamples,
  contourConfig
} from '../../../../examples/demo-app/src/data/sample-contour-data';
import {buildContourGrid, generateContours} from './contour-utils';
import SchemaManager from '@kepler.gl/schemas';
import {
  calculateLayerData,
  INITIAL_VIS_STATE,
  layerTypeChangeUpdater,
  removeLayerUpdater
} from '@kepler.gl/reducers';
import {StateWFiles} from 'test/helpers/mock-state';
import {messages} from '@kepler.gl/localization';
import React from 'react';
import {fireEvent, render, within} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {IntlProvider} from 'react-intl';
import {theme} from '@kepler.gl/styles';
import {appInjector, MapLegendFactory, LayerHoverInfoFactory} from '@kepler.gl/components';

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

function calculateContourLayerData(layer: ContourLayer, datasets) {
  return calculateLayerData(layer, {
    datasets,
    animationConfig: StateWFiles.visState.animationConfig
  });
}

test.each([
  {
    name: 'irregular grid',
    scattered: true,
    invalid: {inputMode: 'grid'},
    message: /regularly spaced/
  },
  {name: 'reversed range', scattered: false, invalid: {minimum: 9, maximum: 3}, message: /minimum/},
  {name: 'constant range', scattered: false, invalid: {minimum: 4, maximum: 4}, message: /minimum/},
  {
    name: 'nonfinite range',
    scattered: false,
    invalid: {minimum: NaN, maximum: 8},
    message: /minimum/
  }
])(
  'retains $name validation errors through layer calculation and recovers',
  async ({scattered, invalid, message}) => {
    const {layer, datasets} = await setup(scattered ? scatteredSamples : undefined);
    layer.updateLayerVisConfig({minimum: 4, maximum: 8, interpolationResolution: 32});
    expect(calculateContourLayerData(layer, datasets).layerData.data).toHaveLength(3);
    expect(layer.getContourLegend()).toHaveLength(3);
    layer.updateLayerVisConfig(invalid);
    for (let attempt = 0; attempt < 2; attempt++) {
      const result = calculateContourLayerData(layer, datasets);
      expect(result.layer.isValid).toBe(false);
      expect(result.layer.errorMessage).toMatch(message);
      expect(result.layer.config.isVisible).toBe(false);
      expect(result.layerData).toEqual({});
      expect(layer.getContourLegend()).toEqual([]);
    }
    layer.updateLayerVisConfig({inputMode: 'auto', minimum: 4, maximum: 8});
    const recovered = calculateContourLayerData(layer, datasets);
    expect(recovered.layer.isValid).toBe(true);
    expect(recovered.layer.errorMessage).toBeNull();
    expect(recovered.layer.config.isVisible).toBe(true);
    expect(recovered.layerData.data).toHaveLength(3);
    expect(layer.getContourLegend()).toHaveLength(3);
  }
);
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
  expect(layer.config.visConfig.colorByLevel).toBe(false);
  expect(passes[0].props.getFillColor).toEqual([36, 218, 211, 19]);
  expect(passes[0].props.data).toBe(data.data);
  expect(passes[1].props.data).toBe(data.data);
  expect(layer.renderLayer({...opts, mapState: {zoom: 15, longitude: 8}})[0].props.data).toBe(
    data.data
  );
  expect(layer.renderLayer({...opts, visible: false})).toEqual([]);
  layer.updateLayerVisConfig({filled: false});
  expect(layer.renderLayer(opts)).toHaveLength(1);
  expect(layer.getHoverData(data.data[0])).toEqual({
    fieldValues: [{labelMessage: 'columns.contour.value', value: 'value ≤ 6'}]
  });
  expect(layer.getHoverData(null)).toBeNull();
});

test.each(['fill', 'outline'])('clears %s picks on removal or type changes', async pass => {
  const {layer, dataset, datasets} = await setup();
  const data = layer.formatLayerData(datasets);
  const deckLayer = layer
    .renderLayer({data, visible: true, idx: 0, gpuFilter: dataset.gpuFilter, mapState: {zoom: 10}})
    .find(rendered => rendered.id === `${layer.id}-${pass}`)!;
  const pick: PickingInfo = {
    picked: true,
    layer: deckLayer,
    object: data.data[0],
    color: null,
    index: 0,
    x: 0,
    y: 0,
    pixelRatio: 1
  };
  const other = new LayerClasses.point({id: `${layer.id}-other`, dataId: dataset.id});
  const state = {
    ...INITIAL_VIS_STATE,
    datasets,
    layers: [layer, other],
    layerData: [data, {data: []}],
    layerOrder: [layer.id, other.id],
    clicked: pick,
    hoverInfo: pick
  };
  expect(layer.hasHoveredObject(pick)).toBe(data.data[0]);
  const removed = removeLayerUpdater(state, {id: layer.id});
  expect(removed.layers).toEqual([other]);
  expect(removed.clicked).toBeUndefined();
  expect(removed.hoverInfo).toBeUndefined();
  const changed = layerTypeChangeUpdater(state, {oldLayer: layer, newType: 'point'});
  expect(changed.layers[0].type).toBe('point');
  expect(changed.clicked).toBeUndefined();
  expect(changed.hoverInfo).toBeUndefined();

  const unrelated = {...pick, layer: deckLayer.clone({id: other.id})};
  const otherState = {...state, clicked: unrelated, hoverInfo: unrelated};
  for (const result of [
    removeLayerUpdater(otherState, {id: layer.id}),
    layerTypeChangeUpdater(otherState, {oldLayer: layer, newType: 'point'})
  ]) {
    expect(result.clicked).toBe(unrelated);
    expect(result.hoverInfo).toBe(unrelated);
  }
  for (const info of [null, undefined, {...pick, picked: false}, unrelated]) {
    expect(layer.hasHoveredObject(info)).toBeNull();
  }
});

describe.each([Int64, Uint64])('Arrow %p contour inputs', ArrowType => {
  test.each(['value', 'coordinates', 'both', 'geojson'])(
    'matches numeric contours with 64-bit %s columns, missing values, and filtering',
    async mode => {
      const {layer, dataset, datasets} = await setup();
      const longitudes = Array.from({length: 81}, (_, i) => i % 9);
      const latitudes = Array.from({length: 81}, (_, i) => Math.floor(i / 9));
      const values = longitudes.map((x, i) =>
        i === 40 ? null : (x - 4) ** 2 + (latitudes[i] - 4) ** 2
      );
      const arrowVector = (numbers: (number | null)[]) =>
        vectorFromArray(
          numbers.map(value => (value === null ? null : BigInt(value))),
          new ArrowType()
        );
      const arrowTable = new Table({
        longitude:
          mode === 'coordinates' || mode === 'both'
            ? arrowVector(longitudes)
            : vectorFromArray(longitudes),
        latitude:
          mode === 'coordinates' || mode === 'both'
            ? arrowVector(latitudes)
            : vectorFromArray(latitudes),
        value: mode === 'coordinates' ? vectorFromArray(values) : arrowVector(values),
        geometry: vectorFromArray(
          longitudes.map((x, i) => JSON.stringify(pointGeometry(x, latitudes[i])))
        )
      });
      const arrowDataset = new KeplerTable({info: {id: dataset.id}, color: [0, 0, 0]});
      await arrowDataset.importData({
        data: {
          rows: [],
          fields: [
            ...dataset.fields,
            {name: 'geometry', type: 'geojson', analyzerType: 'GEOMETRY'}
          ],
          cols: arrowTable.schema.fields.map((_, i) => arrowTable.getChildAt(i)!),
          arrowTable
        }
      });
      const numeric = new KeplerTable({info: {id: dataset.id}, color: [0, 0, 0]}).updateSchema({
        fields: dataset.fields,
        rows: longitudes.map((x, i) => [x, latitudes[i], values[i]])
      });
      numeric.filteredIndex = numeric.filteredIndex.filter(index => index !== 41);
      arrowDataset.filteredIndex = numeric.filteredIndex;
      const expected = layer.formatLayerData({...datasets, [dataset.id]: numeric});
      expect(expected.data).toHaveLength(3);
      if (mode === 'geojson') {
        layer.updateLayerConfig({
          columnMode: 'geojson',
          columns: {
            ...layer.config.columns,
            geojson: {value: 'geometry', fieldIdx: 3}
          }
        });
      }
      expect(typeof arrowDataset.dataContainer.valueAt(0, mode === 'coordinates' ? 0 : 2)).toBe(
        'bigint'
      );
      expect(arrowDataset.fields[2].valueAccessor({index: 40})).toBeNull();
      expect(layer.formatLayerData({...datasets, [dataset.id]: arrowDataset})).toEqual(expected);
    }
  );
});

test('shows contour thresholds without selected tooltip fields and preserves real aggregation counts', async () => {
  const {layer, dataset, datasets} = await setup();
  const data = layer.formatLayerData(datasets);
  const LayerHoverInfo = appInjector.get(LayerHoverInfoFactory);
  const view = render(
    React.createElement(LayerHoverInfo, {
      layer,
      data: layer.getHoverData(data.data[0]),
      fields: dataset.fields,
      fieldsToShow: []
    }),
    {
      wrapper: ({children}) =>
        React.createElement(ThemeProvider, {
          theme,
          children: React.createElement(IntlProvider, {
            locale: 'en',
            messages: messages.en,
            children
          })
        })
    }
  );
  expect(view.queryByText(/total points/i)).toBeNull();
  expect(view.queryByText('undefined')).toBeNull();
  expect(view.getByText('value ≤ 6')).toBeInTheDocument();

  for (const below of [false, true]) {
    const feature = {...data.data[0], properties: {...data.data[0].properties, below}};
    view.rerender(
      React.createElement(LayerHoverInfo, {
        layer,
        data: layer.getHoverData(feature),
        fields: dataset.fields,
        fieldsToShow: [{name: 'longitude', format: null}]
      })
    );
    expect(view.getByText(`value ${below ? '≤' : '≥'} 6`)).toBeInTheDocument();
    expect(view.queryByText(/total points/i)).toBeNull();
  }

  const gridLayer = new LayerClasses.grid({dataId: dataset.id});
  for (const points of [[], [{index: 0}, {index: 1}]]) {
    view.rerender(
      React.createElement(LayerHoverInfo, {
        layer: gridLayer,
        data: {points},
        fields: [],
        fieldsToShow: []
      })
    );
    expect(view.getByText(/total points/i)).toBeInTheDocument();
    expect(view.getByText(String(points.length))).toBeInTheDocument();
  }
});

function renderLegend(
  layer: Layer,
  isExport = false,
  options: Partial<React.ComponentProps<ReturnType<typeof MapLegendFactory>>> = {}
) {
  const MapLegend = appInjector.get(MapLegendFactory);
  const props = {layers: [layer], isExport, ...options};
  const view = render(React.createElement(MapLegend, props), {
    wrapper: ({children}) =>
      React.createElement(ThemeProvider, {
        theme,
        children: React.createElement(IntlProvider, {locale: 'en', messages: messages.en, children})
      })
  });
  return {
    ...view,
    update: () => view.rerender(React.createElement(MapLegend, props))
  };
}

function renderContourPasses(layer: ContourLayer, dataset: KeplerTable, data) {
  return layer.renderLayer({
    data,
    visible: true,
    idx: 0,
    gpuFilter: dataset.gpuFilter,
    layerCallbacks: {},
    mapState: {zoom: 10}
  });
}

test.each([true, false])(
  'colors each contour level from low to high values (below = %s)',
  async below => {
    const {layer, dataset, datasets} = await setup();
    layer.updateLayerVisConfig({
      colorByLevel: true,
      below,
      fillOpacity: 0.2,
      colorRange: {...layer.config.visConfig.colorRange, colors: ['#FF0000', '#00FF00', '#0000FF']}
    });
    const data = layer.formatLayerData(datasets);
    const passes = renderContourPasses(layer, dataset, data);
    const getFillColor = passes[0].props.getFillColor;
    const getLineColor = passes[1].props.getLineColor;
    if (typeof getFillColor !== 'function' || typeof getLineColor !== 'function') {
      throw new Error('Expected colors for each contour level');
    }
    const ordered = [...data.data].sort((a, b) => a.properties.threshold - b.properties.threshold);
    const view = renderLegend(layer);
    const items = view.getAllByRole('listitem');
    [
      [255, 0, 0],
      [0, 255, 0],
      [0, 0, 255]
    ].forEach((rgb, index) => {
      const info = {index, data: ordered, target: []};
      expect(getFillColor(ordered[index], info)).toEqual([...rgb, 51]);
      const outline = getLineColor(ordered[index], info);
      expect(outline.slice(0, 3)).toEqual(rgb);
      expect(layer.getContourLegend()[index].color).toEqual(outline);
      expect(items[index].querySelector('.legend-row-color')).toHaveStyle({
        backgroundColor: `rgba(${rgb.join(', ')}, ${(outline[3] ?? 255) / 255})`
      });
    });

    layer.updateLayerVisConfig({colorByLevel: false});
    const plain = renderContourPasses(layer, dataset, data);
    expect(plain[0].props.getFillColor).toEqual([36, 218, 211, 51]);
    expect(plain[0].props.data).toBe(data.data);
    expect(plain[0].props.updateTriggers?.getFillColor).not.toEqual(
      passes[0].props.updateTriggers?.getFillColor
    );
    expect(plain[1].props.updateTriggers?.getLineColor).not.toEqual(
      passes[1].props.updateTriggers?.getLineColor
    );
    expect(
      layer.getContourLegend().every(level => level.color.slice(0, 3).join() === '36,218,211')
    ).toBe(true);
  }
);

test('interpolates a palette to the level count and reverses it without losing threshold labels', async () => {
  const {layer, dataset, datasets} = await setup();
  const colorLegends = {[JSON.stringify(['value', true, 2])]: 'Low'};
  layer.updateLayerVisConfig({
    colorByLevel: true,
    levels: 5,
    colorRange: {
      ...layer.config.visConfig.colorRange,
      category: 'Custom',
      colors: ['#FFFFFF', '#000000'],
      colorLegends
    }
  });
  const data = layer.formatLayerData(datasets);
  const before = renderContourPasses(layer, dataset, data);
  expect(layer.getContourLegend().map(level => level.color.slice(0, 3))).toEqual(
    [255, 191, 128, 64, 0].map(value => [value, value, value])
  );
  layer.updateLayerColorUI('colorRange', {colorRangeConfig: {reversed: true}});
  const after = renderContourPasses(layer, dataset, data);
  expect(layer.getContourLegend().map(level => level.color.slice(0, 3))).toEqual(
    [0, 64, 128, 191, 255].map(value => [value, value, value])
  );
  expect(after[0].props.data).toBe(data.data);
  expect(after[0].props.updateTriggers?.getFillColor).not.toEqual(
    before[0].props.updateTriggers?.getFillColor
  );
  expect(after[1].props.updateTriggers?.getLineColor).not.toEqual(
    before[1].props.updateTriggers?.getLineColor
  );
  expect(layer.config.visConfig.colorRange.colorLegends).toEqual(colorLegends);
});

test.each([true, false])(
  'exports composite palette colors for nested fills (below = %s)',
  async below => {
    const {layer, datasets} = await setup();
    layer.updateLayerVisConfig({
      colorByLevel: true,
      below,
      stroked: false,
      fillOpacity: 0.2,
      colorRange: {...layer.config.visConfig.colorRange, colors: ['#FF0000', '#00FF00', '#0000FF']}
    });
    layer.formatLayerData(datasets);
    const expected = below
      ? [
          [105, 84, 67, 124],
          [0, 142, 113, 92],
          [0, 0, 255, 51]
        ]
      : [
          [255, 0, 0, 51],
          [113, 142, 0, 92],
          [67, 84, 105, 124]
        ];
    expect(layer.getContourLegend().map(level => level.color)).toEqual(expected);
    const view = renderLegend(layer, true);
    view.getAllByRole('listitem').forEach((item, index) => {
      const [r, g, b, alpha] = expected[index];
      expect(item.querySelector('.legend-row-color')).toHaveStyle({
        backgroundColor: `rgba(${r}, ${g}, ${b}, ${alpha / 255})`
      });
    });
    layer.updateLayerVisConfig({fillOpacity: 0});
    expect(
      layer
        .getContourLegend()
        .every(level => level.color.every(Number.isFinite) && level.color[3] === 0)
    ).toBe(true);
  }
);

test.each([undefined, [], ['invalid'], ['#112233']])(
  'handles a missing, invalid, or single-color palette: %j',
  async colors => {
    const {layer, datasets} = await setup();
    layer.updateLayerVisConfig({
      colorByLevel: true,
      colorRange: {...layer.config.visConfig.colorRange, colors}
    });
    layer.formatLayerData(datasets);
    const expected = colors?.[0] === '#112233' ? [17, 34, 51] : layer.config.color;
    expect(layer.getContourLegend().map(level => level.color.slice(0, 3))).toEqual([
      expected,
      expected,
      expected
    ]);
  }
);

test.each([true, false])(
  'shows each contour threshold and matching outline color (below = %s)',
  async below => {
    const {layer, dataset, datasets} = await setup();
    layer.updateLayerVisConfig({below});
    const data = layer.formatLayerData(datasets);
    const view = renderLegend(layer);
    const items = () =>
      within(view.getByRole('list', {name: 'Contour levels'})).getAllByRole('listitem');
    const expected = [2, 4, 6].map(value => `${below ? '≤' : '≥'} ${value}`);
    expect(items().map(item => item.textContent)).toEqual(expected);

    const checkColors = () => {
      const passes = layer.renderLayer({
        data,
        visible: true,
        idx: 0,
        gpuFilter: dataset.gpuFilter,
        layerCallbacks: {},
        mapState: {zoom: 10}
      });
      const getLineColor = passes[passes.length - 1].props.getLineColor;
      if (typeof getLineColor !== 'function') throw new Error('Expected per-level outline colors');
      const ordered = [...data.data].sort(
        (a, b) => a.properties.threshold - b.properties.threshold
      );
      items().forEach((item, i) => {
        const [r, g, b, alpha = 255] = getLineColor(ordered[i], {
          index: i,
          data: ordered,
          target: []
        });
        expect(item.querySelector('.legend-row-color')).toHaveStyle({
          backgroundColor: `rgba(${r}, ${g}, ${b}, ${alpha / 255})`
        });
      });
    };
    checkColors();

    layer.updateLayerConfig({color: [200, 100, 50]});
    layer.updateLayerVisConfig({filled: false, stroked: true});
    view.update();
    checkColors();
    expect(items().map(item => item.textContent)).toEqual(expected);
  }
);

test('shows accumulated nested fill colors in the exported legend', async () => {
  const {layer, datasets} = await setup();
  layer.updateLayerVisConfig({stroked: false, fillOpacity: 0.2});
  layer.formatLayerData(datasets);
  const view = renderLegend(layer, true);
  const items = view.getAllByRole('listitem');
  expect(items.map(item => item.textContent)).toEqual(['≤ 2', '≤ 4', '≤ 6']);
  // Three, two, then one overlapping regions, each with 20% opacity.
  [124, 92, 51].forEach((alpha, i) => {
    expect(items[i].querySelector('.legend-row-color')).toHaveStyle({
      backgroundColor: `rgba(36, 218, 211, ${alpha / 255})`
    });
  });
  layer.updateLayerVisConfig({fillOpacity: 0});
  view.update();
  view.getAllByRole('listitem').forEach(item => {
    expect(item.querySelector('.legend-row-color')).toHaveStyle({
      backgroundColor: 'rgba(36, 218, 211, 0)'
    });
  });

  layer.updateLayerVisConfig({filled: false, stroked: false});
  view.update();
  expect(view.queryByRole('list')).toBeNull();
});

test('limits long contour legends to a scrollable channel that can expand independently', async () => {
  const {layer, datasets} = await setup();
  const {layer: otherLayer} = await setup();
  layer.updateLayerVisConfig({minimum: 0.25, maximum: 7.85, levels: 20});
  layer.formatLayerData(datasets);
  otherLayer.formatLayerData(datasets);
  const view = renderLegend(layer, false, {layers: [layer, otherLayer]});
  const [list, otherList] = view.getAllByRole('list', {name: 'Contour levels'});
  const [toggle, otherToggle] = view.getAllByRole('button', {name: 'value'});
  expect(within(list).getAllByRole('listitem')).toHaveLength(20);
  expect(list).toHaveStyle({overflowY: 'auto'});
  expect(parseFloat(getComputedStyle(list).maxHeight)).toBeGreaterThan(0);
  expect(list).toHaveAttribute('tabindex', '0');
  expect(toggle).toHaveAttribute('aria-controls', list.id);
  expect(toggle).toHaveAttribute('aria-expanded', 'false');

  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  expect(list).toHaveStyle({maxHeight: 'none'});
  expect(otherToggle).toHaveAttribute('aria-expanded', 'false');
  expect(parseFloat(getComputedStyle(otherList).maxHeight)).toBeGreaterThan(0);

  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(parseFloat(getComputedStyle(list).maxHeight)).toBeGreaterThan(0);
  expect(within(list).getAllByRole('listitem')).toHaveLength(20);
});

test.each(['point', 'contour'])(
  '%s legend keeps row and editor heights stable on hover and reveals a working reset control',
  async layerType => {
    const fixture = await setup();
    const layer =
      layerType === 'contour'
        ? fixture.layer
        : new LayerClasses.point({
            dataId: fixture.dataset.id,
            columns: fixture.layer.config.columns
          });
    if (layerType === 'contour') {
      fixture.layer.formatLayerData(fixture.datasets);
    } else {
      layer.updateLayerConfig({
        colorField: fixture.dataset.fields[2],
        colorDomain: [0, 32]
      });
    }
    const view = renderLegend(layer, false, {
      onLayerVisConfigChange: (oldLayer, config) => oldLayer.updateLayerVisConfig(config)
    });
    const editor = view.getAllByRole('textbox')[0] as HTMLInputElement;
    const defaultLabel = editor.value;
    const row = editor.parentElement!;
    expect(within(row).queryByRole('button', {name: 'Reset label'})).toBeNull();
    fireEvent.change(editor, {target: {value: 'Custom label'}});
    view.update();
    const reset = within(row).getByRole('button', {name: 'Reset label'});
    // JSDOM matches :hover while the document is unfocused. Match the real
    // compiled CSS against explicit interaction attributes instead.
    const rules = Array.from(document.styleSheets)
      .flatMap(sheet => Array.from(sheet.cssRules))
      .filter(rule => rule.type === CSSRule.STYLE_RULE) as CSSStyleRule[];
    const styleAt = (element: Element, property: string) =>
      rules
        .filter(rule =>
          element.matches(
            rule.selectorText
              .replace(/:hover/g, '[data-legend-hover]')
              .replace(/:focus-within/g, '[data-legend-focus]')
          )
        )
        .map(rule => rule.style.getPropertyValue(property))
        .filter(Boolean)
        .pop();
    const rowHeight = styleAt(row, 'height');
    const editorHeight = styleAt(editor, 'height');
    expect(rowHeight).toBeTruthy();
    expect(editorHeight).toBeTruthy();
    expect(styleAt(reset, 'opacity')).toBe('0');

    row.setAttribute('data-legend-hover', '');
    editor.setAttribute('data-legend-hover', '');
    expect(styleAt(row, 'height')).toBe(rowHeight);
    expect(styleAt(editor, 'height')).toBe(editorHeight);
    expect(styleAt(reset, 'opacity')).toBe('1');
    expect(styleAt(reset, 'pointer-events')).toBe('auto');
    row.removeAttribute('data-legend-hover');
    editor.removeAttribute('data-legend-hover');
    expect(styleAt(reset, 'opacity')).toBe('0');

    row.setAttribute('data-legend-focus', '');
    expect(styleAt(reset, 'opacity')).toBe('1');
    expect(reset).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(reset, {key: 'Enter'});
    view.update();
    expect(editor.value).toBe(defaultLabel);
    expect(within(row).queryByRole('button', {name: 'Reset label'})).toBeNull();
  }
);

test('edits and resets contour labels by threshold even when levels have the same color', async () => {
  const {layer, datasets} = await setup();
  layer.updateLayerVisConfig({stroked: false, fillOpacity: 0});
  layer.formatLayerData(datasets);
  const onLayerVisConfigChange = jest.fn((oldLayer, config) => {
    oldLayer.updateLayerVisConfig(config);
  });
  const view = renderLegend(layer, false, {onLayerVisConfigChange});
  const inputs = () => view.getAllByRole('textbox') as HTMLInputElement[];
  expect(inputs().map(input => input.value)).toEqual(['≤ 2', '≤ 4', '≤ 6']);
  fireEvent.change(inputs()[0], {target: {value: 'Low'}});
  view.update();
  fireEvent.change(inputs()[1], {target: {value: 'Medium'}});
  view.update();
  expect(onLayerVisConfigChange).toHaveBeenCalledTimes(2);
  expect(inputs().map(input => input.value)).toEqual(['Low', 'Medium', '≤ 6']);

  layer.updateLayerConfig({color: [100, 150, 200]});
  layer.updateLayerVisConfig({stroked: true, minimum: 4});
  layer.formatLayerData(datasets);
  view.update();
  expect(inputs().map(input => input.value)).toEqual(['Medium', '≤ 5', '≤ 6']);
  layer.updateLayerVisConfig({minimum: 2, below: false});
  layer.formatLayerData(datasets);
  view.update();
  expect(inputs().map(input => input.value)).toEqual(['≥ 2', '≥ 4', '≥ 6']);
  layer.updateLayerVisConfig({below: true});
  layer.formatLayerData(datasets);
  view.update();
  expect(inputs().map(input => input.value)).toEqual(['Low', 'Medium', '≤ 6']);

  fireEvent.click(
    within(view.getAllByRole('listitem')[0]).getByRole('button', {name: 'Reset label'})
  );
  view.update();
  expect(inputs().map(input => input.value)).toEqual(['≤ 2', 'Medium', '≤ 6']);
  expect(layer.config.visConfig.colorRange.colorLegends).toEqual({
    [JSON.stringify(['value', true, 4])]: 'Medium'
  });
});

test.each(['point', 'grid'])(
  'changing from Contour to %s removes threshold labels while preserving the palette and color labels',
  async newType => {
    const {layer, datasets, dataset} = await setup();
    const data = layer.formatLayerData(datasets);
    const key = JSON.stringify(['value', true, 6]);
    const colorRange = {
      ...layer.config.visConfig.colorRange,
      colors: ['#FF0000', '#00FF00', '#0000FF'],
      colorLegends: {[key]: 'Custom contour', '#FF0000': 'Existing color label'}
    };
    layer.updateLayerVisConfig({colorRange});
    const state = {
      ...INITIAL_VIS_STATE,
      datasets,
      layers: [layer],
      layerData: [data],
      layerOrder: [layer.id]
    };
    const result = layerTypeChangeUpdater(state, {oldLayer: layer, newType});
    const converted = result.layers[0];
    expect(converted.config.visConfig.colorRange).toEqual({
      ...colorRange,
      colorLegends: {'#FF0000': 'Existing color label'}
    });
    expect(layer.config.visConfig.colorRange).toEqual(colorRange);
    if (newType === 'point') {
      converted.updateLayerConfig({colorField: dataset.fields[2]});
      converted.updateLayerDomain(datasets);
      const view = renderLegend(converted);
      expect(view.queryByDisplayValue('Custom contour')).toBeNull();
      expect(view.getByDisplayValue('Existing color label')).toBeInTheDocument();
      expect(view.container.querySelectorAll('.legend-row-color')).toHaveLength(3);
    }
    const roundTrip = layerTypeChangeUpdater(result, {oldLayer: converted, newType: 'contour'});
    expect(roundTrip.layers[0].config.visConfig.colorRange).toEqual(
      converted.config.visConfig.colorRange
    );
    const retained = layerTypeChangeUpdater(state, {oldLayer: layer, newType: 'contour'});
    expect(retained.layers[0].config.visConfig.colorRange).toEqual(colorRange);
  }
);

test.each([false, true])(
  'preserves custom labels without editors in read-only legends (export = %s)',
  async isExport => {
    const {layer, datasets} = await setup();
    layer.updateLayerVisConfig({
      minimum: 0.25,
      maximum: 7.85,
      levels: 20,
      colorRange: {
        ...layer.config.visConfig.colorRange,
        colorLegends: {[JSON.stringify(['value', true, 0.25])]: 'Low'}
      }
    });
    layer.formatLayerData(datasets);
    const onLayerVisConfigChange = jest.fn();
    const view = renderLegend(layer, isExport, {disableEdit: !isExport, onLayerVisConfigChange});
    expect(view.queryAllByRole('textbox')).toHaveLength(0);
    expect(view.getByText('Low')).toBeInTheDocument();
    expect(view.getAllByRole('listitem')).toHaveLength(20);
    if (isExport) {
      expect(view.queryByRole('button', {name: 'value'})).toBeNull();
      expect(view.getByRole('list')).toHaveStyle({maxHeight: 'none'});
    }
    expect(onLayerVisConfigChange).not.toHaveBeenCalled();
  }
);

test('keeps legend levels in sync with auto ranges, filters, and invalid or empty data', async () => {
  const {layer, dataset, datasets} = await setup();
  layer.updateLayerVisConfig({customRange: false});
  layer.formatLayerData(datasets);
  const view = renderLegend(layer);
  const labels = () => view.queryAllByRole('listitem').map(item => item.textContent);
  expect(labels()).toEqual(['≤ 8', '≤ 16', '≤ 24']);

  const all = dataset.filteredIndex;
  dataset.filteredIndex = all.filter(i => dataset.dataContainer.valueAt(i, 2) <= 8);
  layer.formatLayerData(datasets);
  view.update();
  expect(labels()).toEqual(['≤ 2', '≤ 4', '≤ 6']);

  dataset.filteredIndex = all;
  layer.updateLayerVisConfig({customRange: true, minimum: 0.25, maximum: 7.85, levels: 20});
  layer.formatLayerData(datasets);
  view.update();
  expect(labels()).toHaveLength(20);
  expect(labels()[0]).toBe('≤ 0.25');
  expect(labels()[19]).toBe('≤ 7.85');

  layer.updateLayerVisConfig({below: false, minimum: 10, maximum: 40, levels: 4});
  layer.formatLayerData(datasets);
  view.update();
  // No geometry exists above 40, so it must not appear as a rendered contour level.
  expect(labels()).toEqual(['≥ 10', '≥ 20', '≥ 30']);

  layer.updateLayerVisConfig({minimum: 50});
  calculateContourLayerData(layer, datasets);
  view.update();
  expect(layer.errorMessage).toMatch(/minimum/);
  expect(labels()).toEqual([]);
  layer.updateLayerVisConfig({minimum: 2, maximum: 6});
  calculateContourLayerData(layer, datasets);
  view.update();
  expect(labels()).toHaveLength(4);
  dataset.filteredIndex = [];
  layer.formatLayerData(datasets);
  view.update();
  expect(labels()).toEqual([]);
  expect(layer.getContourLegend()).toEqual([]);
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

function contourPolygonFilter(layer: ContourLayer, bounds: number[], inverted = false) {
  const [west, south, east, north] = bounds;
  return {
    ...generatePolygonFilter([layer], {
      type: 'Feature',
      id: 'contour-filter-polygon',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [west, south],
            [east, south],
            [east, north],
            [west, north],
            [west, south]
          ]
        ]
      }
    }),
    inverted
  };
}

test('polygon filters preserve grid holes, isolate layers, and restore on disable or clear', async () => {
  const {layer, dataset, datasets} = await setup();
  layer.updateLayerVisConfig({inputMode: 'grid'});
  const other = new ContourLayer({dataId: dataset.id, columns: layer.config.columns});
  other.updateLayerVisConfig(layer.config.visConfig);
  const point = new LayerClasses.point({dataId: dataset.id, columns: layer.config.columns});
  const layers = [layer, other, point];
  const original = calculateContourLayerData(layer, datasets).layerData.data;
  const pointState = {datasets, animationConfig: StateWFiles.visState.animationConfig};
  const originalPoint = calculateLayerData(point, pointState).layerData.data;
  expect(originalPoint).toHaveLength(dataset.dataContainer.numRows());
  const all = dataset.filteredIndex;
  const filter = contourPolygonFilter(layer, [3.5, 3.5, 4.5, 4.5], true);
  expect(EDITOR_AVAILABLE_LAYERS).toContain(layer.type);

  dataset.filterTable([filter], layers);
  expect(dataset.filteredIndex).toEqual(all);
  expect(dataset.filteredIndexByLayer[layer.id]).toEqual(all.filter(index => index !== 40));
  const filtered = calculateContourLayerData(layer, datasets).layerData.data;
  expect(filtered).toHaveLength(3);
  expect(filtered.every(feature => feature.geometry.coordinates[0].length === 2)).toBe(true);
  expect(other.formatLayerData(datasets).data).toEqual(original);
  expect(calculateLayerData(point, pointState).layerData.data).toEqual(originalPoint);

  dataset.filterTable([{...filter, inverted: false}], layers);
  expect(dataset.filteredIndexByLayer[layer.id]).toEqual([40]);
  expect(calculateContourLayerData(layer, datasets).layerData.data).not.toEqual(filtered);

  dataset.filterTable([{...filter, enabled: false}], layers);
  expect(calculateContourLayerData(layer, datasets).layerData.data).toEqual(original);
  dataset.filterTable([filter], layers);
  dataset.filterTable([], layers);
  expect(calculateContourLayerData(layer, datasets).layerData.data).toEqual(original);

  dataset.filterTable([contourPolygonFilter(layer, [20, 20, 21, 21])], layers);
  expect(dataset.filteredIndexByLayer[layer.id]).toEqual([]);
  expect(calculateContourLayerData(layer, datasets).layerData.data).toEqual([]);
  expect(layer.getContourLegend()).toEqual([]);
  expect(other.formatLayerData(datasets).data).toEqual(original);
});

test.each([false, true])('combines polygon filtering with numeric filters (GPU %s)', async gpu => {
  const {layer, dataset, datasets} = await setup();
  const polygon = contourPolygonFilter(layer, [3.5, 3.5, 4.5, 4.5], true);
  const range = {
    ...getDefaultFilter({dataId: [dataset.id]}),
    type: FILTER_TYPES.range,
    name: ['value'],
    fieldIdx: [2],
    value: [0, 4],
    domain: [0, 32],
    gpu
  };
  dataset.filterTable(assignGpuChannels([polygon, range]), [layer]);
  const grid = buildContourGrid(
    dataset.dataContainer.mapIndex(({index}) => {
      const [longitude, latitude, value] = dataset.dataContainer.rowAsArray(index);
      return {longitude, latitude, value: index !== 40 && value <= 4 ? value : null};
    })
  );
  const expected = generateContours(grid, {smoothing: 0, levels: 3, below: true, domain: [2, 6]});
  expect(expected.length).toBeGreaterThan(0);
  expect(calculateContourLayerData(layer, datasets).layerData.data).toEqual(expected);
});

test.each(['grid', 'geojson'])(
  'polygon filters %s source samples before scattered interpolation and smoothing',
  async columnMode => {
    const rows = scatteredSamples.map((row, index) => [
      row[0],
      row[1],
      index === 1 ? 1000 : row[2]
    ]);
    const {layer, dataset, datasets} =
      columnMode === 'geojson'
        ? setupGeojson([
            ...rows.map(([x, y, value]) => [polygonGeometry(x, y), value]),
            [null, 1000],
            ['invalid geojson', 1000],
            [{type: 'Point', coordinates: [null, null]}, 1000]
          ])
        : await setup(rows);
    const filter = contourPolygonFilter(layer, [-0.5, -0.5, 1.5, 2.5]);
    // Apply before the first render, so filtering cannot depend on cached geometry.
    dataset.filterTable([filter], [layer]);
    expect(dataset.filteredIndexByLayer[layer.id]).toEqual([0, 2, 3]);
    for (const inputMode of ['auto', 'points'] as const) {
      layer.updateLayerVisConfig({
        inputMode,
        minimum: 4,
        maximum: 8,
        interpolationResolution: 32,
        smoothing: 1.5
      });
      const expectedGrid = buildContourGrid(
        rows.map(([longitude, latitude, value], index) => ({
          longitude,
          latitude,
          value: index === 1 ? null : value
        })),
        inputMode,
        32
      );
      const expected = generateContours(expectedGrid, {
        smoothing: 1.5,
        levels: 3,
        below: true,
        domain: [4, 8]
      });
      expect(expected.length).toBeGreaterThan(0);
      expect(calculateContourLayerData(layer, datasets).layerData.data).toEqual(expected);
    }
    dataset.filterTable([contourPolygonFilter(layer, [20, 20, 21, 21])], [layer]);
    expect(calculateContourLayerData(layer, datasets).layerData.data).toEqual([]);
    expect(layer.isValid).toBe(true);
  }
);

test.each([Int64, Uint64])(
  'polygon filters Arrow %p coordinates without coercing nulls',
  async ArrowType => {
    const reference = await setup([
      [0, 0, 3],
      [0, 2, 9],
      [1, 1, 8]
    ]);
    const {layer} = reference;
    layer.updateLayerVisConfig({
      inputMode: 'points',
      minimum: 4,
      maximum: 8,
      interpolationResolution: 32
    });
    const expected = layer.formatLayerData(reference.datasets).data;
    const arrowVector = (values: (number | null)[]) =>
      vectorFromArray(
        values.map(value => (value === null ? null : BigInt(value))),
        new ArrowType()
      );
    const table = new Table({
      longitude: arrowVector([0, 2, 0, 1, null]),
      latitude: arrowVector([0, 0, 2, 1, 1]),
      value: arrowVector([3, 1000, 9, 8, 1000])
    });
    const dataset = new KeplerTable({info: {id: reference.dataset.id}, color: [0, 0, 0]});
    await dataset.importData({
      data: {
        rows: [],
        fields: reference.dataset.fields,
        cols: table.schema.fields.map((_, index) => table.getChildAt(index)!),
        arrowTable: table
      }
    });
    dataset.filterTable([contourPolygonFilter(layer, [-0.5, -0.5, 1.5, 2.5])], [layer]);
    expect(dataset.filteredIndexByLayer[layer.id]).toEqual([0, 2, 3]);
    expect(layer.formatLayerData({[dataset.id]: dataset}).data).toEqual(expected);
  }
);

test('reports invalid settings and recovers after correcting them', async () => {
  const {layer, datasets} = await setup();
  layer.updateLayerVisConfig({minimum: 9, maximum: 3});
  expect(calculateContourLayerData(layer, datasets).layerData).toEqual({});
  expect(layer.errorMessage).toMatch(/minimum/);
  layer.updateLayerVisConfig({minimum: 2, maximum: 6});
  expect(calculateContourLayerData(layer, datasets).layerData.data).toHaveLength(3);
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
    layer.updateLayerVisConfig({
      inputMode: 'points',
      interpolationResolution: 128,
      colorByLevel: true,
      colorRange: {
        ...layer.config.visConfig.colorRange,
        colors: ['#FF0000', '#00FF00', '#0000FF'],
        colorLegends: {[JSON.stringify(['value', true, 2])]: 'Low'}
      }
    });
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
  expect(calculateContourLayerData(layer, datasets).layerData).toEqual({});
  expect(layer.errorMessage).toMatch(/regularly spaced/);
  layer.updateLayerVisConfig({inputMode: 'points'});
  expect(calculateContourLayerData(layer, datasets).layerData.data).toHaveLength(3);
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
