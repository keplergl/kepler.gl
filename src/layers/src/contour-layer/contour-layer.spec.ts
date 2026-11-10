// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {KeplerTable, getGpuFilterProps, assignGpuChannels} from '@kepler.gl/table';
import {EDITOR_AVAILABLE_LAYERS, FILTER_TYPES, KEPLER_COLOR_PALETTES} from '@kepler.gl/constants';
import {colorMaybeToRGB, generatePolygonFilter, getDefaultFilter} from '@kepler.gl/utils';
import {
  PickingInfo,
  AmbientLight,
  _SunLight as SunLight,
  LayerManager,
  LightingEffect,
  WebMercatorViewport
} from '@deck.gl/core';
import {device} from '@deck.gl/test-utils';
import {setGLParameters} from '@luma.gl/webgl';
import {getDistanceScales} from '@math.gl/web-mercator';
import {Int64, Uint64, Table, vectorFromArray} from 'apache-arrow';
import {processCsvData} from '@kepler.gl/processors';
import booleanWithin from '@turf/boolean-within';
import ContourLayer from './contour-layer';
import ContourSurfaceLayer from './deck-contour-surface-layer';
import {buildContourSurface} from './contour-surface';
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
  removeLayerUpdater,
  validateLayerWithData
} from '@kepler.gl/reducers';
import {StateWFiles} from 'test/helpers/mock-state';
import {messages} from '@kepler.gl/localization';
import React from 'react';
import {fireEvent, render, within} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {IntlProvider} from 'react-intl';
import {theme} from '@kepler.gl/styles';
import {
  appInjector,
  LayerConfiguratorFactory,
  MapLegendFactory,
  LayerHoverInfoFactory
} from '@kepler.gl/components';

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
    // Existing renderer fixtures exercise saved lower-value, plain-color contours explicitly.
    below: true,
    colorByLevel: false,
    fillOpacity: 0.075,
    customRange: true,
    minimum: 2,
    maximum: 6,
    smoothing: 0,
    gridResolution: scatteredRows ? 3 : 9,
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
    name: 'invalid grid resolution',
    scattered: true,
    invalid: {gridResolution: 0},
    message: /grid resolution/
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
    layer.updateLayerVisConfig({minimum: 4, maximum: 8, gridResolution: 3});
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
    layer.updateLayerVisConfig({gridResolution: 3, minimum: 4, maximum: 8});
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
    below: true,
    colorByLevel: false,
    fillOpacity: 0.075,
    customRange: true,
    minimum: 4,
    maximum: 8,
    levels: 3,
    smoothing: 0,
    gridResolution: 3
  });
  return {layer, dataset, datasets: {[dataset.id]: dataset}};
}

test.each([false, true])('new contours enclose peaks by default (weighted: %s)', async weighted => {
  const {
    layer: reference,
    dataset,
    datasets
  } = await setup([
    [0, 0, 1],
    [0.18, 0, 1],
    [0, 0.18, 1],
    [0.18, 0.18, 1],
    // Keep the peak away from a cell boundary; this checks fill direction, not bin placement.
    ...Array.from({length: 100}, () => [0.08, 0.08, 100])
  ]);
  const {lat, lng, value} = reference.config.columns;
  const layer = new ContourLayer({
    dataId: dataset.id,
    columns: {lat, lng, ...(weighted ? {value} : {})}
  });
  const {data} = layer.formatLayerData(datasets);
  expect(data).toHaveLength(layer.config.visConfig.levels);
  const contains = (feature, coordinates) =>
    feature.geometry.coordinates.some(polygon =>
      booleanWithin({type: 'Point', coordinates}, {type: 'Polygon', coordinates: polygon})
    );
  for (const feature of data) {
    expect(feature.properties.below).toBe(false);
    expect(contains(feature, [0.08, 0.08])).toBe(true);
  }
  expect(contains(data[data.length - 1], [0.17, 0.01])).toBe(false);
  expect(layer.config.visConfig.colorByLevel).toBe(true);
  expect(layer.config.visConfig.gridResolution).toBe(64);
  expect(layer.config.visConfig.smoothing).toBe(3);
  expect(layer.config.visConfig.fillOpacity).toBe(0.3);
  expect(layer.config.visConfig.colorRange.name).toBe(KEPLER_COLOR_PALETTES[0].name);
  const {colors} = layer.config.visConfig.colorRange;
  const passes = renderContourPasses(layer, dataset, {data});
  const getFillColor = passes[0].props.getFillColor;
  if (typeof getFillColor !== 'function') throw new Error('Expected colors for each contour level');
  for (const [index, color] of [
    [0, colors[0]],
    [data.length - 1, colors[colors.length - 1]]
  ] as const) {
    expect(getFillColor(data[index], {index, data, target: []})).toEqual([
      ...colorMaybeToRGB(color)!,
      Math.round(255 * layer.config.visConfig.fillOpacity)
    ]);
  }
});

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

test.each([
  ['fill', ''],
  ['fill', '-polygons-fill'],
  ['outline', ''],
  ['outline', '-polygons-stroke'],
  ['surface-fill', ''],
  ['surface-fill', '-polygons-fill']
])('clears %s%s picks on removal or type changes', async (pass, sublayer) => {
  const {layer, dataset, datasets} = await setup();
  layer.updateLayerVisConfig({enable3d: pass === 'surface-fill'});
  const data = layer.formatLayerData(datasets);
  const deckLayer = layer
    .renderLayer({data, visible: true, idx: 0, gpuFilter: dataset.gpuFilter, mapState: {zoom: 10}})
    .find(rendered => rendered.id === `${layer.id}-${pass}`)!;
  const pick: PickingInfo = {
    picked: true,
    layer: deckLayer.clone({id: `${deckLayer.id}${sublayer}`}),
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
  for (const info of [
    null,
    undefined,
    {...pick, picked: false},
    {...pick, layer: null},
    unrelated
  ]) {
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

test.each([0, 60])('projects contour normals perpendicular to slopes at latitude %s', latitude => {
  const grid = {
    width: 5,
    height: 5,
    longitude: 0,
    latitude: latitude - 0.02,
    stepLng: 0.01,
    stepLat: 0.01,
    values: Float64Array.from({length: 25}, (_, i) => (i % 5) + Math.floor(i / 5))
  };
  const surface = buildContourSurface(
    grid,
    generateContours(grid, {smoothing: 0, levels: 2, below: true, domain: [0, 9]})
  );
  const position = [0.02, latitude];
  const normal = surface.getNormal(position);
  const {unitsPerDegree, unitsPerMeter} = getDistanceScales({longitude: position[0], latitude});
  const vertices = surface.fills[0].geometry.coordinates.flat(2);
  const height = (x: number, y: number) =>
    vertices.find(point => Math.abs(point[0] - x) < 1e-9 && Math.abs(point[1] - y) < 1e-9)![2];
  const dzdx = (height(0.03, latitude) - height(0.01, latitude)) / 0.02;
  const dzdy = (height(0.02, latitude + 0.01) - height(0.02, latitude - 0.01)) / 0.02;
  const normalize = (vector: number[]) => vector.map(value => value / Math.hypot(...vector));
  for (const elevationScale of [1, 3, 0]) {
    // Evaluate project_offset_normal's lng/lat branch with deck.gl's scales.
    // The shader assembly test below also checks this helper and scale are used.
    const projected = normalize(
      elevationScale
        ? [
            normal[0] * unitsPerDegree[0],
            normal[1] * unitsPerDegree[1],
            (normal[2] * unitsPerMeter[2]) / elevationScale
          ]
        : [0, 0, 1]
    );
    // Independently derive the normal from the draped geometry's common-space tangents.
    const expected = normalize([
      (-dzdx * unitsPerMeter[2] * elevationScale) / unitsPerDegree[0],
      (-dzdy * unitsPerMeter[2] * elevationScale) / unitsPerDegree[1],
      1
    ]);
    // The surface uses 111320 m/degree, a close approximation to deck.gl's earth radius.
    projected.forEach((value, i) => expect(value).toBeCloseTo(expected[i], 2));
  }
});

test('3D contour fills derive slope normals and respond to scene lighting after height changes', async () => {
  const {layer, dataset, datasets} = await setup();
  const data = layer.formatLayerData(datasets);
  const viewport = new WebMercatorViewport({width: 800, height: 600, zoom: 10, pitch: 45});
  const onError = jest.fn();
  const manager = new LayerManager(device, {viewport});
  manager.setProps({onError});
  const ambientLight = new AmbientLight({intensity: 0.2});
  const directionalLight = new SunLight({timestamp: Date.UTC(2026, 5, 1, 12), intensity: 1});
  const effect = new LightingEffect({ambientLight, directionalLight});
  try {
    const initialFlat = renderContourPasses(layer, dataset, data);
    manager.setLayers(initialFlat);
    const flatModel = (initialFlat[0].getSubLayers()[0] as ContourSurfaceLayer).state.topModel;
    layer.updateLayerVisConfig({enable3d: true});
    const passes = renderContourPasses(layer, dataset, data);
    manager.setLayers(passes);
    const surface = passes[1].getSubLayers()[0] as ContourSurfaceLayer;
    expect(surface).toBeInstanceOf(ContourSurfaceLayer);
    expect(surface.props.extruded).toBe(false);
    expect(passes[0].getSubLayers()[0]).not.toBeInstanceOf(ContourSurfaceLayer);
    expect(passes[2].getSubLayers()[0]).not.toBeInstanceOf(ContourSurfaceLayer);
    const model = surface.state.topModel!;
    expect(model).toBeDefined();
    expect(model).not.toBe(flatModel);
    // Check the assembled shaders, including the material module and picking hooks.
    const normals = surface.getAttributeManager()!.getAttributes().contourNormals
      .value as Float32Array;
    expect(normals.length).toBeGreaterThan(0);
    expect(Array.from(normals.slice(0, 3))).not.toEqual(Array.from(normals.slice(3, 6)));
    expect(model.vs).toContain('in vec3 contourNormals;');
    expect(model.vs).toContain('vSurfaceNormal = normalize(project_offset_normal(surfaceNormal));');
    expect(model.vs).toContain('vec3(contourNormals.xy, contourNormals.z / elevationScale)');
    expect(model.vs).toContain('vCommonPosition = geometry.position.xyz;');
    expect(model.vs).not.toContain('lighting_getLightColor(');
    expect(model.fs).toContain('vec3 normal = normalize(vSurfaceNormal);');
    expect(model.fs).not.toContain('dFdx(');
    expect(model.fs).toContain('phongMaterialUniforms');
    expect(model.fs).not.toContain('gouraudMaterialUniforms');
    expect(model.fs).toContain('fragColor.rgb = lighting_getLightColor(');
    expect(model.fs.indexOf('fragColor.rgb = lighting_getLightColor(')).toBeLessThan(
      model.fs.lastIndexOf('DECKGL_FILTER_COLOR(fragColor, geometry)')
    );
    const applyLighting = () => {
      surface.setShaderModuleProps(effect.getShaderModuleProps(surface, {project: {viewport}}));
      const {lighting, phongMaterial} = model.shaderInputs.getUniformValues();
      if (!lighting || !phongMaterial) throw new Error('Expected surface lighting uniforms');
      return {lighting, phongMaterial};
    };
    const initial = applyLighting();
    expect(initial.phongMaterial.unlit).toBe(false);
    expect(initial.lighting.ambientColor).toEqual([0.2, 0.2, 0.2]);
    expect(initial.lighting.directionalLightCount).toBe(1);
    const initialDirection = [...initial.lighting.lights[0].direction];
    ambientLight.intensity = 0.4;
    directionalLight.timestamp = Date.UTC(2026, 5, 1, 18);
    const updated = applyLighting();
    expect(updated.lighting.ambientColor).toEqual([0.4, 0.4, 0.4]);
    expect(updated.lighting.lights[0].direction).not.toEqual(initialDirection);
    for (const elevationScale of [3, 0]) {
      layer.updateLayerVisConfig({elevationScale});
      const scaled = renderContourPasses(layer, dataset, data);
      manager.setLayers(scaled);
      const scaledSurface = scaled[1].getSubLayers()[0] as ContourSurfaceLayer;
      expect(scaledSurface.state.topModel).toBe(model);
      expect(scaledSurface.props.modelMatrix?.[10]).toBe(elevationScale);
    }
    layer.updateLayerVisConfig({enable3d: false});
    const flat = renderContourPasses(layer, dataset, data);
    manager.setLayers(flat);
    expect(flat[0].getSubLayers()[0]).not.toBeInstanceOf(ContourSurfaceLayer);
    const restoredFlatModel = (flat[0].getSubLayers()[0] as ContourSurfaceLayer).state.topModel!;
    expect(restoredFlatModel).not.toBe(model);
    expect(restoredFlatModel.fs).not.toContain('dFdx(vCommonPosition)');
    layer.updateLayerVisConfig({enable3d: true});
    const restoredSurface = renderContourPasses(layer, dataset, data);
    manager.setLayers(restoredSurface);
    const restoredModel = (restoredSurface[1].getSubLayers()[0] as ContourSurfaceLayer).state
      .topModel!;
    expect(restoredModel).not.toBe(restoredFlatModel);
    expect(restoredModel.fs).toContain('vec3 normal = normalize(vSurfaceNormal);');
    expect(onError).not.toHaveBeenCalled();
  } finally {
    manager.finalize();
  }
});

test.each([false, true])(
  '3D drapes the same smoothed contours, colors and hover values (below: %s)',
  async below => {
    const {layer, dataset, datasets} = await setup();
    layer.updateLayerVisConfig({below, smoothing: 1.5, colorByLevel: true});
    const data = layer.formatLayerData(datasets);
    const flat = renderContourPasses(layer, dataset, data);
    const legend = layer.getContourLegend();
    expect(layer.config.visConfig.enable3d).toBe(false);
    layer.updateLayerVisConfig({enable3d: true, elevationScale: 2});
    const [depth, fill, outline] = renderContourPasses(layer, dataset, data);
    expect(depth.props.pickable).toBe(false);
    const gl = {enable: jest.fn(), depthMask: jest.fn(), colorMask: jest.fn()};
    const applyDepthParameters = pass =>
      setGLParameters(gl as unknown as WebGL2RenderingContext, pass.props.parameters);
    // Exercise the actual WebGL parameter setter: a numeric render-pass mask
    // is not valid for per-layer parameters and throws before drawing.
    expect(() => applyDepthParameters(depth)).not.toThrow();
    expect(gl.colorMask).toHaveBeenLastCalledWith(false, false, false, false);
    expect(gl.depthMask).toHaveBeenLastCalledWith(true);
    expect(fill.props.parameters).toMatchObject({depthMask: false});
    expect(fill.props.modelMatrix?.[10]).toBe(2);
    expect(outline.props.modelMatrix?.[10]).toBe(2);
    const raised = fill.props.data as typeof data.data;
    expect(raised.map(f => f.properties)).toEqual(data.data.map(f => f.properties));
    expect(raised.flatMap(f => f.geometry.coordinates.flat(2)).some(p => p[2] > 0)).toBe(true);
    for (const [index, pass] of [fill, outline].entries()) {
      const property = index ? 'getLineColor' : 'getFillColor';
      const getColor = pass.props[property];
      const getFlatColor = flat[index].props[property];
      if (typeof getColor !== 'function' || typeof getFlatColor !== 'function') {
        throw new Error('Expected colors for each contour level');
      }
      data.data.forEach((feature, i) => {
        const info = {index: i, data: data.data, target: []};
        expect(getColor(feature, info)).toEqual(getFlatColor(feature, info));
        const object = (pass.props.data as typeof data.data)[i];
        expect(layer.getHoverData(object)).toEqual(layer.getHoverData(feature));
        expect(layer.isLayerHovered({picked: true, layer: pass} as unknown as PickingInfo)).toBe(
          true
        );
      });
    }
    expect(layer.getContourLegend()).toEqual(legend);
    layer.updateLayerVisConfig({elevationScale: 0});
    const flattened = renderContourPasses(layer, dataset, data);
    expect(() => applyDepthParameters(flattened[0])).not.toThrow();
    expect(gl.colorMask).toHaveBeenLastCalledWith(false, false, false, false);
    expect(flattened[0].props.data).toBe(depth.props.data);
    expect(flattened[1].props.data).toBe(fill.props.data);
    expect(flattened[1].props.modelMatrix?.[10]).toBe(0);
    layer.updateLayerVisConfig({filled: false});
    expect(renderContourPasses(layer, dataset, data).map(pass => pass.id)).toEqual([
      `${layer.id}-outline`
    ]);
    layer.updateLayerVisConfig({stroked: false});
    expect(renderContourPasses(layer, dataset, data)).toEqual([]);
    layer.updateLayerVisConfig({filled: true, stroked: true, enable3d: false});
    const restored = renderContourPasses(layer, dataset, data);
    expect(restored[0].props.data).toBe(data.data);
    expect(restored[1].props.data).toBe(data.data);
  }
);

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

test.each([false, true])('colors outlines independently of fills (3D: %s)', async enable3d => {
  const {layer, dataset, datasets} = await setup();
  layer.updateLayerVisConfig({
    enable3d,
    colorByLevel: true,
    colorRange: {...layer.config.visConfig.colorRange, colors: ['#FF0000', '#00FF00', '#0000FF']}
  });
  const data = layer.formatLayerData(datasets);
  const readColors = () => {
    const [fill, outline] = renderContourPasses(layer, dataset, data).slice(-2);
    const {getFillColor} = fill.props;
    const {getLineColor} = outline.props;
    if (typeof getFillColor !== 'function' || typeof getLineColor !== 'function') {
      throw new Error('Expected colors for each contour level');
    }
    const ordered = [...data.data].sort((a, b) => a.properties.threshold - b.properties.threshold);
    const colors = ordered.map((feature, index) => {
      const info = {index, data: ordered, target: []};
      return {fill: getFillColor(feature, info), outline: getLineColor(feature, info)};
    });
    expect(layer.getContourLegend().map(level => level.color)).toEqual(
      colors.map(color => color.outline)
    );
    return colors;
  };

  const inherited = readColors();
  layer.updateLayerVisConfig({contourColor: [18, 52, 86]});
  expect(readColors()).toEqual(
    inherited.map(({fill, outline}) => ({fill, outline: [18, 52, 86, outline[3]]}))
  );
  layer.updateLayerVisConfig({contourColor: null});
  expect(readColors()).toEqual(inherited);
});

test('selects and retains a custom color when Contour outlines are turned off and on', async () => {
  const {layer, datasets} = await setup();
  const Configurator: ReturnType<typeof LayerConfiguratorFactory> =
    appInjector.get(LayerConfiguratorFactory);
  function Editor() {
    const [, refresh] = React.useReducer(value => value + 1, 0);
    return React.createElement(Configurator, {
      layer,
      datasets,
      layerTypeOptions: [],
      openModal: jest.fn(),
      updateLayerConfig: jest.fn(),
      updateLayerType: jest.fn(),
      updateLayerVisConfig: config => {
        layer.updateLayerVisConfig(config);
        refresh();
      },
      updateLayerVisualChannelConfig: jest.fn(),
      updateLayerColorUI: (property, config) => {
        layer.updateLayerColorUI(property, config);
        refresh();
      },
      updateLayerTextLabel: jest.fn()
    });
  }
  const view = render(React.createElement(Editor), {
    wrapper: ({children}) =>
      React.createElement(ThemeProvider, {
        theme,
        children: React.createElement(IntlProvider, {locale: 'en', messages: messages.en, children})
      })
  });
  const toggle = view.getByRole('checkbox', {name: 'Custom outline color'});
  expect(toggle).not.toBeChecked();
  fireEvent.click(toggle);
  expect(toggle).toBeChecked();
  const outline = toggle.closest('.layer-config-group') as HTMLElement;
  const picker = outline.querySelector('.color-selector__selector')!;
  fireEvent.click(picker);
  fireEvent.click(within(outline).getByText('Color Picker'));
  fireEvent.change(within(outline).getByLabelText(/hex/i), {target: {value: '123456'}});
  expect(layer.config.visConfig.contourColor).toEqual([18, 52, 86]);
  expect(layer.config.color).toEqual([36, 218, 211]);
  fireEvent.click(picker);

  const header = outline.querySelector<HTMLElement>('.layer-config-group__header')!;
  const visibilityToggle = within(header).getByRole('checkbox');
  fireEvent.click(visibilityToggle);
  expect(picker).toBeVisible();
  expect(picker.closest('[inert]')).toBeInTheDocument();
  fireEvent.click(visibilityToggle);
  expect(picker.closest('[inert]')).toBeNull();
  expect(layer.config.visConfig.contourColor).toEqual([18, 52, 86]);

  fireEvent.click(toggle);
  expect(layer.config.visConfig.contourColor).toBeNull();
  expect(picker).not.toBeInTheDocument();
});

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
  'changing a default %s layer to Contour selects the first palette',
  async type => {
    const {dataset, datasets, layer: reference} = await setup();
    const {lat, lng} = reference.config.columns;
    const layer = new LayerClasses[type]({dataId: dataset.id, columns: {lat, lng}});
    const state = {
      ...INITIAL_VIS_STATE,
      datasets,
      layers: [layer],
      layerData: [{}],
      layerOrder: [layer.id]
    };
    const result = layerTypeChangeUpdater(state, {oldLayer: layer, newType: 'contour'});
    const converted = result.layers[0];
    const {colorRange} = converted.config.visConfig;
    expect(colorRange.name).toBe(KEPLER_COLOR_PALETTES[0].name);
    expect(colorRange.colors).toEqual(KEPLER_COLOR_PALETTES[0].colors(colorRange.colors.length));
    expect(converted.config.visConfig.colorByLevel).toBe(true);
    expect(converted.config.visConfig.gridResolution).toBe(64);
    expect(converted.config.visConfig.smoothing).toBe(3);
  }
);

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

test('applies the selected maximum axis resolution when averaging nearby observations', async () => {
  const {layer, datasets} = await setup([
    [0, 0, 10],
    [0.0004, 0.0004, 30],
    [0.03, 0.03, 8]
  ]);
  layer.updateLayerVisConfig({gridResolution: 32});
  layer.formatLayerData(datasets);
  expect(layer.meta.contourDomain).toEqual([0, 20]);
  layer.updateLayerVisConfig({gridResolution: 256});
  layer.formatLayerData(datasets);
  expect(layer.meta.contourDomain).toEqual([0, 30]);
});

test('filters observations before averaging and restores them when the filter clears', async () => {
  const {layer, dataset, datasets} = await setup([
    [0, 0, 10],
    [0.0001, 0.0001, 30],
    [0.03, 0.03, 8]
  ]);
  layer.updateLayerVisConfig({gridResolution: 32, minimum: 5, maximum: 15, below: false});
  const all = dataset.filteredIndex;
  const original = layer.formatLayerData(datasets);
  expect(layer.meta.contourDomain).toEqual([0, 20]);
  dataset.filteredIndex = [0, 2];
  const filtered = layer.formatLayerData(datasets);
  expect(layer.meta.contourDomain).toEqual([0, 10]);
  expect(filtered.data.map(feature => feature.properties.threshold)).toEqual([5, 10]);
  dataset.filteredIndex = all;
  expect(layer.formatLayerData(datasets)).toEqual(original);
});

test.each([false, true])(
  'preserves the continuous weighted surface when filtering observations (GPU %s)',
  async gpu => {
    const rows = [
      [0, 0, 0],
      [0.015, 0.015, 4.5],
      [0, 0.03, 5],
      [0.03, 0, 7],
      [0.03, 0.03, 10]
    ];
    const {layer, dataset, datasets} = await setup(rows);
    layer.updateLayerVisConfig({
      customRange: false,
      gridResolution: 64,
      smoothing: 3,
      levels: 7,
      below: false
    });
    const original = layer.formatLayerData(datasets);
    expect(layer.getContourLegend().map(level => level.threshold)).toEqual(
      original.data.map(feature => feature.properties.threshold)
    );
    expect(layer.getHoverData(original.data[0])?.fieldValues[0].value).toBe(
      `value ≥ ${original.data[0].properties.threshold}`
    );
    const view = renderLegend(layer);
    const filter = {
      ...getDefaultFilter({dataId: [dataset.id]}),
      type: FILTER_TYPES.range,
      name: ['value'],
      fieldIdx: [2],
      value: [5, 10],
      domain: [0, 10],
      gpu
    };
    dataset.filterTable(assignGpuChannels([filter]), [layer]);
    const filtered = layer.formatLayerData(datasets);
    const grid = buildContourGrid(
      rows
        .filter(([, , value]) => value >= 5)
        .map(([longitude, latitude, value]) => ({longitude, latitude, value})),
      64
    )!;
    expect(grid.values.every(Number.isFinite)).toBe(true);
    expect(grid.values.some(value => value === 0)).toBe(true);
    expect(filtered.data).toEqual(generateContours(grid, {smoothing: 3, levels: 7, below: false}));
    expect(filtered.data).toHaveLength(7);
    expect(filtered.data.map(feature => feature.geometry)).not.toEqual(
      original.data.map(feature => feature.geometry)
    );
    expect(filtered.grid?.values.every(Number.isFinite)).toBe(true);
    const expectedLabels = [5.625, 6.25, 6.875, 7.5, 8.125, 8.75, 9.375];
    expect(layer.getContourLegend().map(level => level.threshold)).toEqual(expectedLabels);
    filtered.data.forEach((feature, rank) => {
      expect(layer.getHoverData(feature)?.fieldValues[0].value).toBe(
        `value ≥ ${expectedLabels[rank]}`
      );
    });
    view.update();
    expect(view.getAllByRole('listitem').map(item => item.textContent)).toEqual(
      expectedLabels.map(value => `≥ ${value}`)
    );

    dataset.filterTable(assignGpuChannels([{...filter, value: [6, 6]}]), [layer]);
    expect(layer.formatLayerData(datasets).data).toEqual([]);
    expect(layer.getContourLegend()).toEqual([]);

    dataset.filterTable([], [layer]);
    expect(layer.formatLayerData(datasets)).toEqual(original);
    expect(layer.getContourLegend().map(level => level.threshold)).toEqual(
      original.data.map(feature => feature.properties.threshold)
    );
  }
);

test.each([true, false])(
  'orders filtered weighted display values correctly (below %s)',
  async below => {
    const {layer, dataset, datasets} = await setup([
      [0, 0, 0],
      [0, 0.03, 5],
      [0.03, 0, 7],
      [0.03, 0.03, 10]
    ]);
    layer.updateLayerVisConfig({customRange: false, levels: 3, smoothing: 3, below});
    dataset.filteredIndex = [1, 2, 3];
    const data = layer.formatLayerData(datasets);
    expect(layer.getContourLegend().map(level => level.threshold)).toEqual([6.25, 7.5, 8.75]);
    const expected = below ? [8.75, 7.5, 6.25] : [6.25, 7.5, 8.75];
    data.data.forEach((feature, rank) => {
      expect(layer.getHoverData(feature)?.fieldValues[0].value).toBe(
        `value ${below ? '≤' : '≥'} ${expected[rank]}`
      );
    });
  }
);

test.each([5, -5])(
  'shows constant retained weights of %s without inventing lower values',
  async value => {
    const {layer, dataset, datasets} = await setup([
      [0, 0, value - 1],
      [0, 0.03, value],
      [0.03, 0, value],
      [0.03, 0.03, value]
    ]);
    layer.updateLayerVisConfig({customRange: false, levels: 3, smoothing: 3});
    dataset.filteredIndex = [1, 2, 3];
    const data = layer.formatLayerData(datasets);
    expect(data.data).toHaveLength(3);
    expect(layer.getContourLegend().map(level => level.threshold)).toEqual([value, value, value]);
    const view = renderLegend(layer);
    expect(view.getAllByRole('listitem').map(item => item.textContent)).toEqual(
      Array(3).fill(`≤ ${value}`)
    );
  }
);

test.each(['custom', 'density'])(
  'keeps %s labels on their scalar thresholds when filtering',
  async mode => {
    const {layer, dataset, datasets} = await setup([
      [0, 0, 0],
      [0, 0.03, 5],
      [0.03, 0, 7],
      [0.03, 0.03, 10]
    ]);
    if (mode === 'density') {
      layer.updateLayerConfig({
        columns: {...layer.config.columns, value: {value: null, fieldIdx: -1, optional: true}}
      });
    }
    layer.updateLayerVisConfig({
      customRange: mode === 'custom',
      minimum: 1,
      maximum: 3,
      smoothing: 0,
      below: false
    });
    dataset.filteredIndex = [1, 2, 3];
    const data = layer.formatLayerData(datasets);
    expect(data.data.length).toBeGreaterThan(0);
    expect(layer.getContourLegend().map(level => level.threshold)).toEqual(
      data.data.map(feature => feature.properties.threshold)
    );
    const field = mode === 'density' ? 'Point count' : 'value';
    data.data.forEach(feature => {
      expect(layer.getHoverData(feature)?.fieldValues[0].value).toBe(
        `${field} ≥ ${feature.properties.threshold}`
      );
    });
  }
);

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

test('polygon filters exclude observations, isolate layers, and restore on disable or clear', async () => {
  const {layer, dataset, datasets} = await setup(
    Array.from({length: 81}, (_, i) => {
      const x = i % 9;
      const y = Math.floor(i / 9);
      return [x, y, i === 40 ? 100 : (x - 4) ** 2 + (y - 4) ** 2];
    })
  );
  layer.updateLayerVisConfig({gridResolution: 9});
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
  expect(original.every(feature => feature.geometry.coordinates[0].length === 2)).toBe(true);
  expect(filtered.every(feature => feature.geometry.coordinates[0].length === 1)).toBe(true);
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
    }),
    layer.config.visConfig.gridResolution
  );
  const expected = generateContours(grid, {smoothing: 0, levels: 3, below: true, domain: [2, 6]});
  expect(expected.length).toBeGreaterThan(0);
  expect(calculateContourLayerData(layer, datasets).layerData.data).toEqual(expected);
});

test.each(['grid', 'geojson'])(
  'polygon filters %s source samples before aggregation and smoothing',
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
    layer.updateLayerVisConfig({minimum: 4, maximum: 8, gridResolution: 3, smoothing: 1.5});
    const expectedGrid = buildContourGrid(
      rows
        .filter((_, index) => index !== 1)
        .map(([longitude, latitude, value]) => ({
          longitude,
          latitude,
          value
        })),
      3
    );
    const expected = generateContours(expectedGrid, {
      smoothing: 1.5,
      levels: 3,
      below: true,
      domain: [4, 8]
    });
    expect(expected.length).toBeGreaterThan(0);
    expect(calculateContourLayerData(layer, datasets).layerData.data).toEqual(expected);
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
      minimum: 4,
      maximum: 8,
      gridResolution: 3
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

test('applies numeric GPU filters to density even at a zero-valued range', async () => {
  const {layer, dataset, datasets} = await setup([
    [0, 0, 3],
    [0, 0, 7],
    [0, 0, 9]
  ]);
  layer.updateLayerConfig({columns: {...layer.config.columns, value: {value: null, fieldIdx: -1}}});
  layer.updateLayerVisConfig({minimum: 1, maximum: 3, below: false});
  layer.formatLayerData(datasets);
  expect(layer.meta.contourDomain).toEqual([0, 3]);
  dataset.gpuFilter = {
    ...dataset.gpuFilter,
    filterValueUpdateTriggers: {test: true},
    filterRange: [[0, 0]],
    filterValueAccessor: () => () => d => [d.index === 1 ? 1 : 0]
  } as any;
  expect(layer.formatLayerData(datasets).data.map(feature => feature.properties.threshold)).toEqual(
    [1, 2]
  );
  expect(layer.meta.contourDomain).toEqual([0, 2]);
});

test.each(
  [
    {columnMode: 'grid', weighted: true},
    {columnMode: 'grid', weighted: false},
    {columnMode: 'geojson', weighted: true},
    {columnMode: 'geojson', weighted: false}
  ].flatMap(config => [true, false].map(below => ({...config, below})))
)(
  'saves and reloads $columnMode contours (weighted: $weighted, below: $below) through the map schema',
  async ({columnMode, weighted, below}) => {
    const {layer, dataset, datasets} = columnMode === 'geojson' ? setupGeojson() : await setup();
    if (!weighted) {
      layer.updateLayerConfig({
        columns: {...layer.config.columns, value: {value: null, fieldIdx: -1, optional: true}}
      });
    }
    layer.updateLayerVisConfig({
      below,
      gridResolution: 128,
      enable3d: true,
      elevationScale: 2.5,
      colorByLevel: true,
      contourColor: [18, 52, 86],
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
    expect(restored.config.columns.value).toBe(weighted ? 'value' : undefined);
    if (columnMode === 'geojson') expect(restored.config.columns.geojson).toBe('geometry');
    const loaded = validateLayerWithData(dataset, restored, LayerClasses)!;
    expect(loaded.config.visConfig.contourColor).toEqual([18, 52, 86]);
    expect(loaded.formatLayerData(datasets)).toEqual(layer.formatLayerData(datasets));
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

  test('requires only geometry in GeoJSON mode', () => {
    const {layer, datasets} = setupGeojson();
    expect(layer.hasAllColumns()).toBe(true);
    layer.updateLayerConfig({columnMode: 'grid'});
    expect(layer.hasAllColumns()).toBe(false);
    layer.updateLayerConfig({columnMode: 'geojson'});
    for (const name of ['geojson']) {
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

  test.each(['cpu', 'gpu'])('applies %s filters before aggregating GeoJSON samples', filterType => {
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
  });

  test('uses point counts when the GeoJSON weight column is cleared', () => {
    const {layer, datasets} = setupGeojson([
      [pointGeometry(0, 0), 10],
      [pointGeometry(0, 0), 20]
    ]);
    layer.updateLayerConfig({
      columns: {...layer.config.columns, value: {value: null, fieldIdx: -1}}
    });
    layer.updateLayerVisConfig({minimum: 1, maximum: 2, levels: 2, below: false});
    expect(layer.hasAllColumns()).toBe(true);
    expect(
      layer.formatLayerData(datasets).data.map(feature => feature.properties.threshold)
    ).toEqual([1, 2]);
    expect(layer.meta.contourDomain).toEqual([0, 2]);
  });
});

test('uses one aggregation path for regular and irregular points regardless of legacy input modes', async () => {
  const {layer, datasets} = await setup(scatteredSamples);
  layer.updateLayerVisConfig({minimum: 4, maximum: 8});
  const expected = layer.formatLayerData(datasets);
  expect(expected.data).toHaveLength(3);
  for (const inputMode of ['auto', 'grid', 'points']) {
    layer.updateLayerVisConfig({inputMode});
    expect(layer.formatLayerData(datasets)).toEqual(expected);
  }
});

test('switches between optional weights and density, including legend and hover values', async () => {
  const {layer, dataset, datasets} = await setup([
    [0, 0, 10],
    [0.0001, 0.0001, 30],
    [0.03, 0.03, 8]
  ]);
  layer.updateLayerVisConfig({gridResolution: 32, minimum: 1, maximum: 2, levels: 2, below: false});
  layer.formatLayerData(datasets);
  expect(layer.meta.contourDomain).toEqual([0, 20]);
  const columns = layer.config.columns;
  layer.updateLayerConfig({
    columns: {...columns, value: {value: null, fieldIdx: -1, optional: true}}
  });
  expect(layer.hasAllColumns()).toBe(true);
  const data = layer.formatLayerData(datasets);
  expect(layer.meta.contourDomain).toEqual([0, 2]);
  expect(data.data.map(feature => feature.properties.threshold)).toEqual([1, 2]);
  expect(layer.getHoverData(data.data[0])?.fieldValues[0]).toEqual({
    labelMessage: 'columns.contour.density',
    value: 'Point count ≥ 1'
  });
  const view = renderLegend(layer);
  expect(view.getByRole('button', {name: 'Point count'})).toBeTruthy();
  expect(view.getAllByRole('listitem').map(item => item.textContent)).toEqual(['≥ 1', '≥ 2']);
  view.unmount();
  layer.updateLayerConfig({columns});
  layer.formatLayerData(datasets);
  expect(layer.meta.contourDomain).toEqual([0, 20]);
  dataset.filteredIndex = [];
  expect(layer.formatLayerData(datasets).data).toEqual([]);
  expect(layer.meta.contourDomain).toBeNull();
});

test('missing or invalid selected weights do not silently become density', async () => {
  const {layer, datasets} = await setup([
    [0, 0, NaN],
    [0.03, 0.03, Infinity]
  ]);
  expect(layer.formatLayerData(datasets).data).toEqual([]);
  layer.updateLayerConfig({
    columns: {...layer.config.columns, value: {value: 'missing', fieldIdx: -1}}
  });
  expect(calculateContourLayerData(layer, datasets).layerData).toEqual({});
  expect(layer.errorMessage).toMatch(/numeric contour weight/);
});

test.each(['grid', 'geojson'])(
  'loading %s contours preserves a missing saved weight until explicitly cleared',
  async columnMode => {
    const {layer, dataset} =
      columnMode === 'geojson' ? setupGeojson() : await setup(scatteredSamples);
    layer.updateLayerVisConfig({customRange: false, below: false});
    const saved = SchemaManager.getConfigToSave({
      ...StateWFiles,
      visState: {...StateWFiles.visState, layers: [layer], layerOrder: [layer.id]}
    });
    const restored = SchemaManager.parseSavedConfig(saved)!.visState!.layers![0];
    const fields = dataset.fields.slice(0, -1);
    const missingWeightDataset = new KeplerTable({
      info: {id: dataset.id},
      color: [0, 0, 0]
    }).updateSchema({
      fields,
      rows: Array.from({length: dataset.dataContainer.numRows()}, (_, index) =>
        fields.map((_, fieldIdx) => dataset.dataContainer.valueAt(index, fieldIdx))
      )
    });
    const datasets = {[dataset.id]: missingWeightDataset};

    for (const options of [{}, {allowEmptyColumn: true}]) {
      const loaded = validateLayerWithData(
        missingWeightDataset,
        restored,
        LayerClasses,
        options
      ) as ContourLayer;
      expect(loaded.config.columns.value.value).toBe('value');
      expect(calculateContourLayerData(loaded, datasets).layerData).toEqual({});
      expect(loaded.isValid).toBe(false);
      expect(loaded.errorMessage).toMatch(/numeric contour weight/);

      loaded.updateLayerConfig({
        columns: {
          ...loaded.config.columns,
          value: {...loaded.config.columns.value, value: null, fieldIdx: -1}
        }
      });
      const density = calculateContourLayerData(loaded, datasets);
      expect(density.layer.isValid).toBe(true);
      expect(density.layer.errorMessage).toBeNull();
      expect(density.layerData.data.length).toBeGreaterThan(0);
      expect(loaded.config.columns.value.value).toBeNull();
    }
    expect(() =>
      validateLayerWithData(missingWeightDataset, restored, LayerClasses, {throwOnError: true})
    ).toThrow(/invalid columns: value/);
  }
);

test.each([false, true])(
  'sample (scattered = %s) generates all levels with islands and finite closed geometry',
  scattered => {
    const sample = createContourSamples(scattered);
    const {visConfig} = contourConfig.config.visState.layers[0].config;
    const result = generateContours(buildContourGrid(sample, visConfig.gridResolution), {
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
