// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {PMTilesSource} from '@loaders.gl/pmtiles';
import {getMVTMetadata, getWMSCapabilities, getFieldsFromTile} from '@kepler.gl/table';
import {DatasetType} from '@kepler.gl/constants';
import {getLoadTilesetCommand} from './load-tileset-command';
import type {KeplerContext, RoomCommandResult} from './types';

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

function setup() {
  const dispatch = jest.fn();
  const command = getLoadTilesetCommand({dispatch} as unknown as KeplerContext);
  return {
    dispatch,
    execute: async (input: unknown, signal?: AbortSignal) =>
      (await command.execute({signal} as any, input)) as RoomCommandResult<any>
  };
}
const stac = {
  type: 'Feature',
  stac_version: '1.1.0',
  assets: {image: {href: 'https://example.com/image.tif', bands: [{name: 'red'}]}}
};
const originalFetch = global.fetch;
beforeEach(() => {
  jest.clearAllMocks();
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
  const args = {datasetName: 'Data', type: 'rasterTile', url: 'https://example.com/data'};
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
