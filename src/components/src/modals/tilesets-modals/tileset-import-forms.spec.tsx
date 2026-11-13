// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {act, fireEvent, waitFor} from '@testing-library/react';
import {DatasetType, PMTilesType, RasterTileType} from '@kepler.gl/constants';
import {getApplicationConfig, initApplicationConfig} from '@kepler.gl/utils';
import {getWMSCapabilities, wmsCapabilitiesToDatasetMetadata} from '@kepler.gl/table';
import {renderWithTheme} from 'test/helpers/component-jest-utils';
import useDetectCOGUrl from '../../hooks/use-detect-cog-url';
import useFetchMetadata from '../../hooks/use-fetch-raster-tile-metadata';
import TilesetTile3DForm from './tileset-tile3d-form';
import TilesetBitmapForm from './tileset-bitmap-form';
import TilesetRasterForm from './tileset-raster-form';
import TilesetWMSForm from './tileset-wms-form';

jest.mock('../../hooks/use-detect-cog-url');
jest.mock('../../hooks/use-fetch-raster-tile-metadata');
jest.mock('@kepler.gl/table', () => ({
  ...jest.requireActual('@kepler.gl/table'),
  getWMSCapabilities: jest.fn(),
  wmsCapabilitiesToDatasetMetadata: jest.fn()
}));

const lastResponse = (callback: jest.Mock) =>
  callback.mock.calls[callback.mock.calls.length - 1][0];
const change = (input: HTMLElement, value: string) => fireEvent.change(input, {target: {value}});
const response = (data: unknown, status = 200, contentType = 'application/json') =>
  ({
    ok: status === 200,
    status,
    headers: {get: () => contentType},
    json: async () => data
  } as unknown as Response);
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => {
    resolve = done;
  });
  return {promise, resolve};
}

let previousConfig: ReturnType<typeof getApplicationConfig>;
const originalFetch = global.fetch;
beforeEach(() => {
  previousConfig = {...getApplicationConfig()};
  initApplicationConfig({
    showInlineTilesetExamples: false,
    rasterServerShowServerInput: true,
    rasterServerUrls: []
  });
  global.fetch = jest.fn();
  jest.mocked(useDetectCOGUrl).mockReturnValue({isCOG: false, probing: false});
  jest.mocked(useFetchMetadata).mockReturnValue({data: null, loading: false, error: null});
});
afterEach(() => {
  initApplicationConfig(previousConfig);
  global.fetch = originalFetch;
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

describe('3D tileset import', () => {
  it('waits for metadata and preserves an explicit dataset name', async () => {
    const pending = deferred<Response>();
    jest.mocked(fetch).mockReturnValue(pending.promise);
    const setResponse = jest.fn();
    const {getByLabelText} = renderWithTheme(<TilesetTile3DForm setResponse={setResponse} />);
    expect(lastResponse(setResponse).dataset).toBeNull();
    change(getByLabelText('Tileset URL'), 'not a URL');
    expect(fetch).not.toHaveBeenCalled();
    change(getByLabelText('Name'), 'Buildings');
    change(getByLabelText('Tileset URL'), 'https://example.com/tileset.json');
    expect(lastResponse(setResponse).loading).toBe(true);
    const metadata = {asset: {version: '1.1'}, root: {}};
    await act(async () => pending.resolve(response(metadata)));
    expect(lastResponse(setResponse)).toMatchObject({
      loading: false,
      error: null,
      metadata,
      dataset: {
        name: 'Buildings',
        type: DatasetType.TILE_3D,
        metadata: {tile3dUrl: 'https://example.com/tileset.json'}
      }
    });
  });

  it('uses the Google API-key header without altering the dataset URL', async () => {
    jest.mocked(fetch).mockResolvedValue(response({root: {}}));
    const setResponse = jest.fn();
    const {getByLabelText} = renderWithTheme(<TilesetTile3DForm setResponse={setResponse} />);
    change(getByLabelText('Access Token (if needed)'), 'test-key');
    const url = 'https://tile.googleapis.com/v1/3dtiles/root.json';
    change(getByLabelText('Tileset URL'), url);
    await waitFor(() => expect(lastResponse(setResponse).loading).toBe(false));
    expect(fetch).toHaveBeenCalledWith(url, {headers: {'X-GOOG-API-KEY': 'test-key'}});
    expect(lastResponse(setResponse).dataset.metadata).toMatchObject({
      tile3dUrl: url,
      tile3dProvider: 'google',
      tile3dAccessToken: 'test-key'
    });
  });

  it('resolves Cesium assets and uses the endpoint token only for metadata transport', async () => {
    jest
      .mocked(fetch)
      .mockResolvedValueOnce(
        response({url: 'https://example.com/resolved.json', accessToken: 'endpoint-token'})
      )
      .mockResolvedValueOnce(response({root: {}}));
    const setResponse = jest.fn();
    const {getByLabelText} = renderWithTheme(<TilesetTile3DForm setResponse={setResponse} />);
    change(getByLabelText('Access Token (if needed)'), 'user-token');
    change(getByLabelText('Tileset URL'), 'https://assets.ion.cesium.com/57588/tileset.json');
    await waitFor(() => expect(lastResponse(setResponse).loading).toBe(false));
    expect(fetch).toHaveBeenNthCalledWith(1, 'https://api.cesium.com/v1/assets/57588/endpoint', {
      headers: {Authorization: 'Bearer user-token'}
    });
    expect(fetch).toHaveBeenNthCalledWith(2, 'https://example.com/resolved.json', {
      headers: {Authorization: 'Bearer endpoint-token'}
    });
    expect(lastResponse(setResponse).dataset.metadata.tile3dAccessToken).toBe('user-token');
  });

  it.each([401, 404, 500])('rejects HTTP %s metadata and recovers on a new URL', async status => {
    jest
      .mocked(fetch)
      .mockResolvedValueOnce(response(null, status))
      .mockResolvedValueOnce(response({root: {}}));
    const setResponse = jest.fn();
    const {getByLabelText} = renderWithTheme(<TilesetTile3DForm setResponse={setResponse} />);
    change(getByLabelText('Tileset URL'), 'https://example.com/bad.json');
    await waitFor(() => expect(lastResponse(setResponse).error).toBeInstanceOf(Error));
    expect(lastResponse(setResponse)).toMatchObject({
      dataset: null,
      metadata: null,
      loading: false
    });
    change(getByLabelText('Tileset URL'), 'https://example.com/good.json');
    await waitFor(() =>
      expect(lastResponse(setResponse)).toMatchObject({
        error: null,
        loading: false,
        metadata: {root: {}}
      })
    );
  });

  it('ignores an older successful request after a newer URL resolves', async () => {
    const first = deferred<Response>();
    const second = deferred<Response>();
    jest.mocked(fetch).mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    const setResponse = jest.fn();
    const {getByLabelText} = renderWithTheme(<TilesetTile3DForm setResponse={setResponse} />);
    change(getByLabelText('Tileset URL'), 'https://example.com/first.json');
    change(getByLabelText('Tileset URL'), 'https://example.com/second.json');
    await act(async () => second.resolve(response({id: 'second'})));
    await act(async () => first.resolve(response({id: 'first'})));
    expect(lastResponse(setResponse).metadata).toEqual({id: 'second'});
  });
});

describe('bitmap import', () => {
  it('requires complete numeric bounds, retains zero, and clears the selected image', () => {
    const setResponse = jest.fn();
    const {getByLabelText, getByTitle} = renderWithTheme(
      <TilesetBitmapForm setResponse={setResponse} />
    );
    change(getByLabelText('Image source'), 'https://example.com/image.png');
    change(getByLabelText('West (min lng)'), '');
    expect(lastResponse(setResponse).dataset).toBeNull();
    change(getByLabelText('West (min lng)'), 'invalid');
    expect(lastResponse(setResponse).dataset).toBeNull();
    change(getByLabelText('West (min lng)'), '0');
    expect(lastResponse(setResponse).dataset.metadata.bounds[0]).toBe(0);
    fireEvent.click(getByTitle('Clear image'));
    expect(lastResponse(setResponse)).toMatchObject({dataset: null, metadata: null, error: null});
  });

  it('loads a local image, derives its name, and can return to a URL source', async () => {
    const setResponse = jest.fn();
    const {container, getByLabelText, getByTitle} = renderWithTheme(
      <TilesetBitmapForm setResponse={setResponse} />
    );
    fireEvent.change(container.querySelector('input[type=file]') as HTMLInputElement, {
      target: {files: [new File(['pixels'], 'map.overlay.png', {type: 'image/png'})]}
    });
    await waitFor(() => expect(lastResponse(setResponse).dataset?.metadata.isDataUri).toBe(true));
    expect(lastResponse(setResponse).dataset.name).toBe('map.overlay');
    expect(lastResponse(setResponse).dataset.metadata.imageUrl).toMatch(/^data:image\/png;base64,/);
    expect(getByLabelText('Image source')).toBeDisabled();
    fireEvent.click(getByTitle('Clear image'));
    change(getByLabelText('Image source'), 'https://example.com/new.png');
    expect(lastResponse(setResponse).dataset.metadata).toMatchObject({
      imageUrl: 'https://example.com/new.png',
      isDataUri: false
    });
    expect(lastResponse(setResponse).dataset.name).toBe('map.overlay');
  });

  it.each(['unsupported', 'oversized'])('blocks %s files and recovers with a URL', kind => {
    const file = new File(['data'], 'image.png', {
      type: kind === 'unsupported' ? 'text/plain' : 'image/png'
    });
    if (kind === 'oversized') Object.defineProperty(file, 'size', {value: 10 * 1024 * 1024 + 1});
    const setResponse = jest.fn();
    const {container, getByLabelText} = renderWithTheme(
      <TilesetBitmapForm setResponse={setResponse} />
    );
    fireEvent.change(container.querySelector('input[type=file]') as HTMLInputElement, {
      target: {files: [file]}
    });
    expect(lastResponse(setResponse).error).toBeInstanceOf(Error);
    expect(lastResponse(setResponse).dataset).toBeNull();
    change(getByLabelText('Image source'), 'https://example.com/new.png');
    expect(lastResponse(setResponse).error).toBeNull();
    expect(lastResponse(setResponse).dataset).not.toBeNull();
  });
});

describe('raster import', () => {
  it('blocks STAC without a valid server and persists normalized servers and user name', () => {
    const setResponse = jest.fn();
    const {getByLabelText} = renderWithTheme(<TilesetRasterForm setResponse={setResponse} />);
    change(getByLabelText('Tileset metadata URL'), 'https://example.com/item/');
    expect(lastResponse(setResponse).error).toBeInstanceOf(Error);
    change(
      getByLabelText('Raster tile servers'),
      ' https://one.example.com , , https://two.example.com '
    );
    change(getByLabelText('Name'), 'My raster');
    change(getByLabelText('Tileset metadata URL'), 'https://example.com/other/');
    expect(lastResponse(setResponse)).toMatchObject({
      error: null,
      dataset: {
        name: 'My raster',
        metadata: {
          metadataUrl: 'https://example.com/other',
          rasterTileServerUrls: ['https://one.example.com', 'https://two.example.com']
        }
      }
    });
  });

  it('allows raster PMTiles without an elevation server but rejects vector PMTiles', () => {
    const setResponse = jest.fn();
    const {getByLabelText} = renderWithTheme(<TilesetRasterForm setResponse={setResponse} />);
    change(getByLabelText('Tileset metadata URL'), 'https://example.com/raster.pmtiles');
    expect(lastResponse(setResponse)).toMatchObject({
      error: null,
      dataset: {metadata: {rasterTileServerUrls: []}}
    });
    expect(
      jest.mocked(useFetchMetadata).mock.calls[
        jest.mocked(useFetchMetadata).mock.calls.length - 1
      ][0].rasterTileType
    ).toBe(RasterTileType.PMTILES);
    jest.mocked(useFetchMetadata).mockReturnValue({
      data: {
        pmtilesType: PMTilesType.MVT,
        metaJson: {},
        bounds: null,
        center: null,
        maxZoom: null,
        minZoom: null,
        fields: []
      },
      loading: false,
      error: null
    });
    change(getByLabelText('Name'), 'Updated raster');
    expect(lastResponse(setResponse).dataset).toBeNull();
    expect(lastResponse(setResponse).error).toBeInstanceOf(Error);
  });

  it('withholds the dataset while probing and converts COG URLs to encoded STAC requests', () => {
    jest.mocked(useDetectCOGUrl).mockReturnValue({isCOG: false, probing: true});
    const setResponse = jest.fn();
    const {getByLabelText} = renderWithTheme(<TilesetRasterForm setResponse={setResponse} />);
    const url = 'https://example.com/elevation.tif?version=2&band=1';
    change(getByLabelText('Tileset metadata URL'), url);
    expect(lastResponse(setResponse)).toMatchObject({dataset: null, loading: true, error: null});
    expect(
      jest.mocked(useFetchMetadata).mock.calls[
        jest.mocked(useFetchMetadata).mock.calls.length - 1
      ][0].url
    ).toBe('');
    jest.mocked(useDetectCOGUrl).mockReturnValue({isCOG: true, probing: false});
    change(getByLabelText('Name'), 'Updated raster');
    expect(lastResponse(setResponse)).toMatchObject({
      loading: false,
      error: null,
      dataset: {
        metadata: {
          metadataUrl: `https://titiler.xyz/cog/stac?url=${encodeURIComponent(url)}`,
          rasterTileServerUrls: ['https://titiler.xyz']
        }
      }
    });
  });
});

describe('WMS import', () => {
  it('loads capabilities, derives the name, and preserves selected service metadata', async () => {
    const pending = deferred<Awaited<ReturnType<typeof getWMSCapabilities>>>();
    jest.mocked(getWMSCapabilities).mockReturnValue(pending.promise);
    jest
      .mocked(wmsCapabilitiesToDatasetMetadata)
      .mockReturnValue({layers: [{name: 'roads'}], version: '1.1.1'} as ReturnType<
        typeof wmsCapabilitiesToDatasetMetadata
      >);
    const setResponse = jest.fn();
    const {getByLabelText} = renderWithTheme(<TilesetWMSForm setResponse={setResponse} />);
    change(getByLabelText('WMS URL'), 'invalid');
    expect(getWMSCapabilities).not.toHaveBeenCalled();
    change(getByLabelText('WMS URL'), 'https://example.com/wms?token=test');
    expect(lastResponse(setResponse).loading).toBe(true);
    const capabilities = {title: 'Road service'} as Awaited<ReturnType<typeof getWMSCapabilities>>;
    await act(async () => pending.resolve(capabilities));
    expect(lastResponse(setResponse)).toMatchObject({
      loading: false,
      error: null,
      metadata: capabilities,
      dataset: {
        name: 'Road service',
        type: DatasetType.WMS_TILE,
        metadata: {layers: [{name: 'roads'}], version: '1.1.1'}
      }
    });
    const metadataUrl = new URL(lastResponse(setResponse).dataset.metadata.tilesetMetadataUrl);
    expect(metadataUrl.searchParams.get('token')).toBe('test');
    expect(metadataUrl.search.toLowerCase()).toContain('request=getcapabilities');
  });

  it('reports transport errors and recovers without replacing a user-supplied name', async () => {
    const error = new Error('Service unavailable');
    jest
      .mocked(getWMSCapabilities)
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce({title: 'Server title'} as Awaited<
        ReturnType<typeof getWMSCapabilities>
      >);
    jest
      .mocked(wmsCapabilitiesToDatasetMetadata)
      .mockReturnValue({layers: [], version: '1.3.0'} as ReturnType<
        typeof wmsCapabilitiesToDatasetMetadata
      >);
    const setResponse = jest.fn();
    const {getByLabelText} = renderWithTheme(<TilesetWMSForm setResponse={setResponse} />);
    change(getByLabelText('Name'), 'Custom service');
    change(getByLabelText('WMS URL'), 'https://example.com/unavailable');
    await waitFor(() => expect(lastResponse(setResponse).error).toBe(error));
    expect(lastResponse(setResponse)).toMatchObject({loading: false, metadata: null});
    change(getByLabelText('WMS URL'), 'https://example.com/working');
    await waitFor(() =>
      expect(lastResponse(setResponse)).toMatchObject({
        loading: false,
        error: null,
        dataset: {name: 'Custom service'}
      })
    );
  });
});
