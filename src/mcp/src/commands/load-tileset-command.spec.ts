// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {PMTilesSourceLoader} from '@loaders.gl/tiles/pmtiles';
import {KeplerTable, getMVTMetadata, getWMSCapabilities, getFieldsFromTile} from '@kepler.gl/table';
import {DatasetType} from '@kepler.gl/constants';
import {getLoadTilesetCommand} from './load-tileset-command';
import {getAddLayerCommand} from './layer-creation-command';
import {createStore, applyMiddleware} from 'redux';
import {taskMiddleware} from '@kepler.gl/tasks';
import {keplerGlReducer} from '@kepler.gl/reducers';
import {registerEntry, wrapTo} from '@kepler.gl/actions';
import {getApplicationConfig} from '@kepler.gl/utils';

jest.mock('@kepler.gl/utils', () => {
  const actual = jest.requireActual('@kepler.gl/utils');
  return {...actual, getApplicationConfig: jest.fn(actual.getApplicationConfig)};
});
import type {KeplerContext, RoomCommandResult, VisState} from './types';

jest.mock('@kepler.gl/table', () => ({
  ...jest.requireActual('@kepler.gl/table'),
  getMVTMetadata: jest.fn(),
  getWMSCapabilities: jest.fn(),
  getFieldsFromTile: jest.fn()
}));
jest.mock('@loaders.gl/tiles/pmtiles', () => ({
  ...jest.requireActual('@loaders.gl/tiles/pmtiles'),
  PMTilesSourceLoader: {createDataSourceSync: jest.fn()}
}));

function setup() {
  const datasets = {};
  const dispatch = jest.fn(async action => {
    for (const dataset of action.payload.datasets) datasets[dataset.info.id] = dataset;
  });
  const command = getLoadTilesetCommand({
    dispatch,
    getVisState: () => ({datasets})
  } as unknown as KeplerContext);
  return {
    dispatch,
    execute: async (input: unknown, signal?: AbortSignal) =>
      (await command.execute({signal} as any, input)) as RoomCommandResult<any>
  };
}
const stac = {
  type: 'Feature',
  stac_version: '1.1.0',
  assets: {
    image: {href: 'https://example.com/image.tif', bands: [{name: 'red', data_type: 'float32'}]}
  }
};
const originalFetch = global.fetch;
const appConfig = getApplicationConfig();
beforeEach(() => {
  jest.clearAllMocks();
  (getApplicationConfig as jest.Mock).mockReturnValue({...appConfig, rasterServerUrls: []});
  global.fetch = jest.fn().mockResolvedValue({ok: true, json: async () => stac});
  (getMVTMetadata as jest.Mock).mockResolvedValue({
    layers: [{id: 'roads', fields: [{name: 'speed', type: 'number'}]}]
  });
  (getFieldsFromTile as jest.Mock).mockResolvedValue(undefined);
  (getWMSCapabilities as jest.Mock).mockResolvedValue({
    version: '1.3.0',
    layers: [{name: 'roads', title: 'Roads'}]
  });
  (PMTilesSourceLoader.createDataSourceSync as jest.Mock).mockReturnValue({
    metadata: Promise.resolve({tileMIMEType: 'image/png'})
  });
});
afterAll(() => {
  global.fetch = originalFetch;
});

it.each([
  ['bitmap', DatasetType.BITMAP, {bounds: [-10, -10, 10, 10]}],
  [
    'vectorTile',
    DatasetType.VECTOR_TILE,
    {url: 'https://example.com/{z}/{x}/{y}.pbf', metadataUrl: 'https://example.com/metadata.json'}
  ],
  ['rasterTile', DatasetType.RASTER_TILE, {rasterTileServerUrls: ['https://example.com/titiler']}],
  ['rasterTile', DatasetType.RASTER_TILE, {url: 'https://example.com/raster.pmtiles'}],
  ['wms', DatasetType.WMS_TILE, {}]
])('imports %s into a matching metadata dataset: %j', async (type, datasetType, extra) => {
  const {dispatch, execute} = setup();
  const result = await execute({
    type,
    datasetName: 'Remote',
    url: 'https://example.com/data',
    ...(extra as object)
  });
  expect(result).toMatchObject({success: true, data: {layerType: type}});
  const payload = dispatch.mock.calls[0][0].payload;
  expect(payload).toMatchObject({
    datasets: [
      {
        info: {id: result.data.datasetId, type: datasetType},
        data: {rows: []},
        disableDataOperation: true
      }
    ],
    options: {autoCreateLayers: false}
  });
  if (type === 'wms') expect(result.data.layers).toEqual([{name: 'roads', title: 'Roads'}]);
  if (type === 'bitmap') expect(payload.datasets[0].metadata.bounds).toEqual([-10, -10, 10, 10]);
});

it('validates 3D Tiles metadata before dispatch', async () => {
  const {execute, dispatch} = setup();
  const args = {datasetName: 'Buildings', type: 'tile3d', url: 'https://example.com/tileset.json'};
  expect((await execute(args)).success).toBe(false);
  expect(dispatch).not.toHaveBeenCalled();
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({asset: {version: '1.1'}, root: {}})
  });
  expect((await execute(args)).success).toBe(true);
  expect(dispatch.mock.calls[0][0].payload.datasets[0].metadata.tile3dUrl).toBe(args.url);
});

it.each([
  {},
  {type: 'bitmap', bounds: [10, 10, -10, -10]},
  {type: 'bitmap'},
  {type: 'wms', url: 'file:///tmp/service'},
  {type: 'rasterTile', datasetName: ''}
])('rejects invalid input without importing: %j', async extra => {
  const {execute, dispatch} = setup();
  expect(
    (await execute({datasetName: 'Data', url: 'https://example.com/data', ...extra})).success
  ).toBe(false);
  expect(dispatch).not.toHaveBeenCalled();
});

it('rejects failed metadata and cancellation without importing', async () => {
  const {execute, dispatch} = setup();
  const args = {
    datasetName: 'Data',
    type: 'rasterTile',
    url: 'https://example.com/data',
    rasterTileServerUrls: ['https://example.com/titiler']
  };
  (global.fetch as jest.Mock).mockResolvedValueOnce({ok: false, status: 404});
  expect(await execute(args)).toMatchObject({
    success: false,
    error: expect.stringContaining('404')
  });
  const controller = new AbortController();
  (global.fetch as jest.Mock).mockImplementationOnce(async () => {
    controller.abort();
    return {ok: true, json: async () => stac};
  });
  expect(await execute(args, controller.signal)).toMatchObject({
    success: false,
    error: expect.stringContaining('cancelled')
  });
  expect(dispatch).not.toHaveBeenCalled();
});

it('requires a TiTiler server for STAC and accepts the host default', async () => {
  const {execute, dispatch} = setup();
  const args = {datasetName: 'STAC', type: 'rasterTile', url: 'https://example.com/data'};
  expect(await execute(args)).toMatchObject({
    success: false,
    error: expect.stringContaining('rasterTileServerUrls')
  });
  expect(dispatch).not.toHaveBeenCalled();
  expect(global.fetch).not.toHaveBeenCalled();
  (getApplicationConfig as jest.Mock).mockReturnValue({
    ...appConfig,
    rasterServerUrls: ['https://example.com/titiler']
  });
  expect(await execute(args)).toMatchObject({success: true});
  expect(dispatch.mock.calls[0][0].payload.datasets[0].metadata.rasterTileServerUrls).toEqual([
    'https://example.com/titiler'
  ]);
});

function setupReducer() {
  const store = createStore(keplerGlReducer, applyMiddleware(taskMiddleware));
  store.dispatch(registerEntry({id: 'map'}));
  const ctx = {
    getVisState: () => (store.getState() as {map: {visState: VisState}}).map.visState,
    dispatch: action => store.dispatch(wrapTo('map', action))
  } as unknown as KeplerContext;
  return {
    ctx,
    execute: async (signal?: AbortSignal) =>
      (await getLoadTilesetCommand(ctx).execute({signal} as any, {
        datasetName: 'STAC',
        type: 'rasterTile',
        url: 'https://example.com/data',
        rasterTileServerUrls: ['https://example.com/titiler']
      })) as RoomCommandResult<any>
  };
}

it('waits for asynchronous registration before an immediate add-layer call', async () => {
  const {ctx, execute} = setupReducer();
  let finishMetadata: (response: any) => void;
  let metadataStarted: () => void;
  const started = new Promise<void>(resolve => {
    metadataStarted = resolve;
  });
  (global.fetch as jest.Mock)
    .mockResolvedValueOnce({ok: true, json: async () => stac})
    .mockImplementationOnce(
      () =>
        new Promise(resolve => {
          finishMetadata = resolve;
          metadataStarted();
        })
    );
  let completed = false;
  const pending = execute().then(result => {
    completed = true;
    return result;
  });
  await started;
  expect(completed).toBe(false);
  expect(Object.keys(ctx.getVisState().datasets)).toHaveLength(0);
  finishMetadata!({ok: true, json: async () => stac});
  const result = await pending;
  expect(result).toMatchObject({success: true});
  expect(ctx.getVisState().datasets[result.data.datasetId]).toBeDefined();
  expect(
    await getAddLayerCommand(ctx).execute({} as any, {
      datasetName: result.data.datasetId,
      layerType: 'rasterTile'
    })
  ).toMatchObject({success: true});
  expect(ctx.getVisState().layers[0].config.visConfig).toMatchObject({
    preset: 'singleBand',
    singleBandName: 'red'
  });
});

it('reports table creation failures instead of successful imports', async () => {
  const {execute} = setupReducer();
  const importData = jest
    .spyOn(KeplerTable.prototype, 'importData')
    .mockRejectedValueOnce(new Error('Table creation failed'));
  const log = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  try {
    expect(await execute()).toMatchObject({
      success: false,
      error: expect.stringContaining('Dataset registration failed')
    });
  } finally {
    importData.mockRestore();
    log.mockRestore();
  }
});

it('returns cancellation while table creation is pending and handles its eventual completion', async () => {
  const {execute} = setupReducer();
  const controller = new AbortController();
  let finishImport: () => void;
  let importStarted: () => void;
  const started = new Promise<void>(resolve => {
    importStarted = resolve;
  });
  const importData = jest.spyOn(KeplerTable.prototype, 'importData').mockImplementationOnce(
    () =>
      new Promise(resolve => {
        finishImport = () => resolve(undefined as any);
        importStarted();
      })
  );
  try {
    const pending = execute(controller.signal);
    await started;
    controller.abort();
    expect(await pending).toMatchObject({
      success: false,
      error: expect.stringContaining('cancelled')
    });
    finishImport!();
    await new Promise(resolve => setTimeout(resolve, 0));
  } finally {
    importData.mockRestore();
  }
});
