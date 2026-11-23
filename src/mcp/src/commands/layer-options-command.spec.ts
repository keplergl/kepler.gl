// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {LayerClasses} from '@kepler.gl/layers';
import KeplerTable from '@kepler.gl/table';
import {DatasetType} from '@kepler.gl/constants';
import {INITIAL_VIS_STATE, visStateReducer} from '@kepler.gl/reducers';
import {getLayerOptionsCommand, getSetLayerOptionsCommand} from './layer-options-command';
import type {KeplerContext, RoomCommandResult} from './types';

function setup(type = 'point', metadata = {}) {
  const dataset = new KeplerTable({
    info: {id: 'data', type: type === 'zarr' ? DatasetType.ZARR : DatasetType.LOCAL},
    metadata
  } as any);
  const layer = new LayerClasses[type]({id: 'layer', dataId: dataset.id});
  let state = {...INITIAL_VIS_STATE, layers: [layer], datasets: {[dataset.id]: dataset}};
  const dispatch = jest.fn(action => {
    state = visStateReducer(state, action);
  });
  const ctx = {getVisState: () => state, dispatch} as unknown as KeplerContext;
  return {
    dataset,
    layer,
    dispatch,
    state: () => state,
    ctx,
    set: async (input: unknown) =>
      (await getSetLayerOptionsCommand(ctx).execute({} as any, input)) as RoomCommandResult<any>
  };
}

describe('layer visual options', () => {
  it.each([
    [
      'point',
      {glowEnabled: true, glowExtent: 3, pulseEnabled: true, pulseMode: 'ripple', pulseSpeed: 2}
    ],
    [
      'heatmap',
      {surfaceEnabled: true, surfaceHeight: 2000, surfaceLighting: false, surfaceContours: true}
    ],
    [
      'flowField',
      {linesPerScreen: 1000, strokeWidth: 2, trailLength: 30, cycleSeconds: 40, smoothing: 2}
    ],
    ['3D', {scenegraph: 'https://example.com/tree.glb', sizeScale: 2}]
  ])(
    'patches %s options through the reducer without changing unrelated settings',
    async (type, options) => {
      const {set, state, layer} = setup(type as string);
      const previous = {...layer.config.visConfig};
      expect(await set({layerId: layer.id, options})).toMatchObject({success: true});
      expect(state().layers[0].config.visConfig).toEqual({...previous, ...(options as object)});
    }
  );

  it('discovers settings and limits without mutating the map', async () => {
    const {ctx, dispatch} = setup();
    const result = (await getLayerOptionsCommand(ctx).execute({} as any, {
      layerId: 'layer'
    })) as RoomCommandResult<any>;
    expect(result.data.settings.glowExtent).toEqual({type: 'number', value: 2, range: [1, 5]});
    expect(result.data.settings.pulseMode.options).toEqual(['pulse', 'ripple']);
    expect(result.data.settings.radiusRange).toBeUndefined();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it.each<Record<string, unknown>>([
    {options: {glowExtent: 6}},
    {options: {glowExtent: NaN}},
    {options: {glowEnabled: 'true'}},
    {options: {pulseMode: 'invalid'}},
    {options: {surfaceEnabled: true}},
    {options: {constructor: 'invalid'}},
    {options: {pulseTimeField: 'missing'}},
    {options: {}},
    {options: {glowEnabled: true, unsupported: 1}},
    {layerId: 'missing', options: {glowEnabled: true}},
    {zarr: {opacity: 0.2}},
    {wmsLayer: 'missing'}
  ])('rejects invalid options atomically: %j', async args => {
    const {set, dispatch} = setup();
    expect((await set({layerId: 'layer', ...args})).success).toBe(false);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('selects a named WMS service layer from its metadata', async () => {
    const serviceLayer = {name: 'elevation', title: 'Elevation'};
    const {set, state} = setup('wms', {layers: [serviceLayer]});
    expect((await set({layerId: 'layer', wmsLayer: 'elevation'})).success).toBe(true);
    expect(state().layers[0].config.visConfig.wmsLayer).toEqual(serviceLayer);
  });
});

it('updates Zarr dimensions and axes, resets incompatible selections on variable changes, and rejects invalid indexes', async () => {
  const band = {name: 'band', size: 3};
  const variables = [
    {path: 'temperature', nonSpatialDims: [band], dataRange: [250, 310]},
    {path: 'rain', nonSpatialDims: [], dataRange: [0, 100]}
  ];
  const {set, state, dispatch, ctx} = setup('zarr', {
    url: 'https://example.com/data.zarr',
    variables
  });
  expect(
    await set({
      layerId: 'layer',
      zarr: {variable: 'temperature', axis: {kind: 'dimension', dimension: 'band'}, frame: 2}
    })
  ).toMatchObject({success: true});
  expect(state().layers[0].config.visConfig).toMatchObject({
    zarrVariable: 'temperature',
    zarrFrame: 2
  });
  const details = (await getLayerOptionsCommand(ctx).execute({} as any, {
    layerId: 'layer'
  })) as RoomCommandResult<any>;
  expect(details.data.zarr.variables[0]).toEqual({
    path: 'temperature',
    dimensions: [band],
    dataRange: [250, 310]
  });
  expect(await set({layerId: 'layer', zarr: {opacity: 0.5}})).toMatchObject({success: true});
  expect(state().layers[0].config.visConfig).toMatchObject({zarrFrame: 2, opacity: 0.5});
  dispatch.mockClear();
  expect(await set({layerId: 'layer', zarr: {dimensionIndexes: {band: 9}}})).toMatchObject({
    success: false
  });
  expect(dispatch).not.toHaveBeenCalled();
  expect(await set({layerId: 'layer', zarr: {variable: 'rain'}})).toMatchObject({success: true});
  expect(state().layers[0].config.visConfig).toMatchObject({
    zarrVariable: 'rain',
    dimensionIndexes: {},
    zarrFrame: 0,
    rescale: [0, 100],
    opacity: 0.5
  });
});

it('only accepts timestamp fields for event pulses', async () => {
  const {dataset, set, dispatch, state} = setup();
  dataset.fields.push(
    {name: 'date', type: 'date'} as any,
    {name: 'time', type: 'timestamp'} as any
  );
  expect(await set({layerId: 'layer', options: {pulseTimeField: 'date'}})).toMatchObject({
    success: false,
    error: expect.stringContaining('timestamp field')
  });
  expect(dispatch).not.toHaveBeenCalled();
  expect(await set({layerId: 'layer', options: {pulseTimeField: 'time'}})).toMatchObject({
    success: true
  });
  expect(state().layers[0].config.visConfig.pulseTimeField).toBe('time');
});

it('preserves automatic Zarr stretching while updating selections and opacity', async () => {
  const {set, state} = setup('zarr', {
    url: 'https://example.com/data.zarr',
    variables: [{path: 'temperature', nonSpatialDims: [{name: 'band', size: 3}]}]
  });
  expect(state().layers[0].config.visConfig.rescale).toBeNull();
  for (const zarr of [
    {dimensionIndexes: {band: 1}},
    {axis: {kind: 'dimension', dimension: 'band'}, frame: 2},
    {opacity: 0.5}
  ]) {
    expect(await set({layerId: 'layer', zarr})).toMatchObject({success: true});
    expect(state().layers[0].config.visConfig.rescale).toBeNull();
  }
  expect(state().layers[0].config.visConfig).toMatchObject({zarrFrame: 2, opacity: 0.5});
});

describe('point age styling', () => {
  const style = {
    timeField: 'observed',
    stops: [
      {ageMs: 0, opacity: 1, color: [255, 0, 0]},
      {ageMs: 14 * 86400000, opacity: 0.5},
      {ageMs: 35 * 86400000, opacity: 0.2, color: [0, 0, 255]}
    ]
  };

  it('sets, inspects and clears age bands without changing other settings', async () => {
    const {dataset, set, state, ctx, layer} = setup();
    dataset.fields.push({name: 'observed', type: 'timestamp'} as any);
    const previous = {...layer.config.visConfig};
    expect(await set({layerId: 'layer', ageStyle: style})).toMatchObject({success: true});
    expect(state().layers[0].config.visConfig).toEqual({...previous, ageStyle: style});
    expect(await getLayerOptionsCommand(ctx).execute({} as any, {layerId: 'layer'})).toMatchObject({
      success: true,
      data: {ageStyle: style}
    });
    expect(await set({layerId: 'layer', options: {opacity: 0.4}})).toMatchObject({success: true});
    expect(state().layers[0].config.visConfig.ageStyle).toEqual(style);
    expect(await set({layerId: 'layer', ageStyle: null})).toMatchObject({success: true});
    expect(state().layers[0].config.visConfig).toEqual({...previous, opacity: 0.4});
  });

  it.each([
    {},
    {...style, timeField: 'missing'},
    {...style, timeField: 'number'},
    {...style, stops: []},
    {...style, stops: [{ageMs: 1, opacity: 1}]},
    {...style, stops: [{ageMs: -1, opacity: 1}]},
    {...style, stops: [{ageMs: 0}]},
    {...style, stops: [{ageMs: 0, opacity: 2}]},
    {...style, stops: [{ageMs: 0, opacity: NaN}]},
    {...style, stops: [{ageMs: 0, color: [0, 256, 0]}]},
    {...style, stops: [{ageMs: 0, color: [0, 0]}]},
    {...style, stops: [style.stops[0], style.stops[0]]},
    {...style, stops: [style.stops[0], style.stops[2], style.stops[1]]}
  ])('rejects invalid age styles atomically: %j', async ageStyle => {
    const {dataset, set, dispatch} = setup();
    dataset.fields.push(
      {name: 'observed', type: 'timestamp'} as any,
      {name: 'number', type: 'real'} as any
    );
    expect(await set({layerId: 'layer', options: {opacity: 0.4}, ageStyle})).toMatchObject({
      success: false
    });
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('rejects age styling on other layer types', async () => {
    const {set, dispatch} = setup('heatmap');
    expect(await set({layerId: 'layer', ageStyle: style})).toMatchObject({success: false});
    expect(dispatch).not.toHaveBeenCalled();
  });
});
