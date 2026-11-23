// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {PMTilesSource} from '@loaders.gl/pmtiles';
import {KeplerTable, getMVTMetadata, getWMSCapabilities, getFieldsFromTile} from '@kepler.gl/table';
import {DatasetType} from '@kepler.gl/constants';
import {getLoadTilesetCommand} from './load-tileset-command';
import {getAddLayerCommand} from './layer-creation-command';
import {serializeProject} from './project-export';
import {createStore, applyMiddleware} from 'redux';
import {taskMiddleware} from '@kepler.gl/tasks';
import {keplerGlReducer} from '@kepler.gl/reducers';
import {addDataToMap, registerEntry, wrapTo} from '@kepler.gl/actions';
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
jest.mock('@loaders.gl/pmtiles', () => ({
  ...jest.requireActual('@loaders.gl/pmtiles'),
  PMTilesSource: {createDataSource: jest.fn()}
}));

function setup(datasets = {}) {
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
const googleUrl = 'https://tile.googleapis.com/v1/3dtiles/root.json';
const googleKey = 'test-google-key';
const googleSource = {
  type: DatasetType.TILE_3D,
  metadata: {tile3dUrl: googleUrl, tile3dProvider: 'google', tile3dAccessToken: googleKey}
};
const googleInput = {
  datasetName: 'Google terrain',
  type: 'tile3d',
  url: googleUrl,
  credentialDatasetId: 'google-credentials'
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
  (PMTilesSource.createDataSource as jest.Mock).mockReturnValue({
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
  undefined,
  {...googleSource, type: DatasetType.LOCAL},
  {
    ...googleSource,
    metadata: {...googleSource.metadata, tile3dUrl: 'https://example.com/tileset.json'}
  },
  {...googleSource, metadata: {...googleSource.metadata, tile3dAccessToken: undefined}},
  {...googleSource, metadata: {...googleSource.metadata, tile3dAccessToken: ''}},
  {...googleSource, metadata: {...googleSource.metadata, tile3dAccessToken: ' '}}
])('rejects an unavailable or unsuitable Google credential reference: %j', async source => {
  const {execute, dispatch} = setup(source ? {'google-credentials': source} : {});
  const result = await execute(googleInput);
  expect(result).toMatchObject({
    success: false,
    error: expect.stringContaining('credentialDatasetId')
  });
  expect(JSON.stringify(result)).not.toContain(googleKey);
  expect(global.fetch).not.toHaveBeenCalled();
  expect(dispatch).not.toHaveBeenCalled();
});

it.each([
  {credentialDatasetId: undefined},
  {credentialDatasetId: ''},
  {url: `${googleUrl}?key=${googleKey}`},
  {url: 'https://tile.googleapis.com.attacker.test/v1/3dtiles/root.json'},
  {url: 'https://example.com/google/tileset.json'},
  {url: googleUrl.replace('https:', 'http:')},
  {type: 'bitmap', bounds: [-10, -10, 10, 10]}
])('does not send Google credentials for invalid input: %j', async input => {
  const {execute, dispatch} = setup({'google-credentials': googleSource});
  const result = await execute({...googleInput, ...input});
  expect(result.success).toBe(false);
  expect(JSON.stringify(result)).not.toContain(googleKey);
  expect(global.fetch).not.toHaveBeenCalled();
  expect(dispatch).not.toHaveBeenCalled();
});

it.each([401, 403])(
  'reports Google authentication failure (HTTP %s) without credentials',
  async status => {
    const {execute, dispatch} = setup({'google-credentials': googleSource});
    const json = jest.fn().mockResolvedValue({error: `Rejected key: ${googleKey}`});
    (global.fetch as jest.Mock).mockResolvedValue({ok: false, status, statusText: googleKey, json});
    const result = await execute(googleInput);
    expect(result).toMatchObject({
      success: false,
      error: `Google 3D Tiles access denied (HTTP ${status}).`
    });
    expect(JSON.stringify(result)).not.toContain(googleKey);
    expect(json).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  }
);

it('does not echo Google request or JSON errors and preserves cancellation', async () => {
  const {execute, dispatch} = setup({'google-credentials': googleSource});
  (global.fetch as jest.Mock).mockRejectedValueOnce(
    new Error(`Failed: ${googleUrl}?key=${googleKey}`)
  );
  expect(await execute(googleInput)).toMatchObject({
    success: false,
    error: 'Google 3D Tiles request failed (network, CORS, or redirect).'
  });
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => {
      throw new Error(`Invalid JSON: ${googleKey}`);
    }
  });
  expect(await execute(googleInput)).toMatchObject({
    success: false,
    error: 'Google 3D Tiles returned invalid tileset JSON.'
  });
  const controller = new AbortController();
  (global.fetch as jest.Mock).mockImplementationOnce(async () => {
    controller.abort();
    throw new Error(googleKey);
  });
  expect(await execute(googleInput, controller.signal)).toMatchObject({
    success: false,
    error: 'Tileset import cancelled.'
  });
  expect(dispatch).not.toHaveBeenCalled();
});

it('redacts the referenced credential from downstream import failures', async () => {
  const key = `${googleKey}/encoded+value`;
  const {execute, dispatch} = setup({
    'google-credentials': {
      ...googleSource,
      metadata: {...googleSource.metadata, tile3dAccessToken: key}
    }
  });
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({asset: {version: '1.1'}, root: {}})
  });
  dispatch.mockRejectedValueOnce(new Error(`Import failed: ${key}, ${encodeURIComponent(key)}`));
  expect(await execute(googleInput)).toMatchObject({
    success: false,
    error: 'Import failed: [redacted], [redacted]'
  });
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

it('imports Google tiles with a referenced key, renders natively, and honors export credential choices', async () => {
  const {ctx} = setupReducer();
  await ctx.dispatch(
    addDataToMap({
      datasets: [
        {
          info: {id: 'google-credentials', label: 'Google', type: DatasetType.TILE_3D},
          data: {fields: [], rows: []},
          metadata: googleSource.metadata
        }
      ],
      options: {autoCreateLayers: false, centerMap: false}
    })
  );
  (global.fetch as jest.Mock).mockImplementation(async (url, options) => ({
    ok: url === googleUrl && options.headers['X-GOOG-API-KEY'] === googleKey,
    status: 403,
    json: async () => ({asset: {version: '1.1'}, root: {}})
  }));
  const result = (await getLoadTilesetCommand(ctx).execute(
    {} as any,
    googleInput
  )) as RoomCommandResult<any>;
  expect(result.success).toBe(true);
  expect(global.fetch).toHaveBeenCalledWith(
    googleUrl,
    expect.objectContaining({
      headers: {'X-GOOG-API-KEY': googleKey},
      redirect: 'error'
    })
  );
  expect(JSON.stringify(result)).not.toContain(googleKey);
  expect(
    await getAddLayerCommand(ctx).execute({} as any, {
      datasetName: result.data.datasetId,
      layerType: 'tile3d'
    })
  ).toMatchObject({success: true});
  const visState = ctx.getVisState();
  const layer = visState.layers[0];
  const [rendered] = layer.renderLayer({
    data: layer.formatLayerData(visState.datasets),
    mapState: {},
    visible: true,
    idx: 0
  });
  // Native rendering authenticates the root URL and all subsequent tile fetches.
  expect(rendered.props.data).toBe(`${googleUrl}?key=${googleKey}`);
  expect(rendered.props.loadOptions.fetch.headers).toEqual({'X-GOOG-API-KEY': googleKey});
  const metadata = visState.datasets[result.data.datasetId].metadata;
  expect(metadata).toEqual({
    ...googleSource.metadata,
    id: result.data.datasetId,
    label: googleInput.datasetName,
    format: 'rows'
  });
  for (const includeCredentials of [false, true]) {
    const exported = serializeProject({visState}, {dataMode: 'references', includeCredentials});
    expect(exported.text.includes(googleKey)).toBe(includeCredentials);
    expect(JSON.stringify(exported.warnings)).not.toContain(googleKey);
    for (const dataset of JSON.parse(exported.text).datasets) {
      expect(dataset.data.metadata.tile3dUrl).toBe(googleUrl);
      expect(dataset.data.metadata.tile3dAccessToken).toBe(
        includeCredentials ? googleKey : undefined
      );
    }
  }
  expect(metadata?.tile3dAccessToken).toBe(googleKey);
});

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
