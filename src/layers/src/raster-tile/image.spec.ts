// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {FetchError, load} from '@loaders.gl/core';
import {QuantizedMeshLoader} from '@loaders.gl/terrain';
import {sleep} from '@kepler.gl/common-utils';
import {getSTACImageRequests, loadTerrain} from './image';
import type {GetTileDataProps} from './types';

jest.mock('@loaders.gl/core', () => ({
  ...jest.requireActual('@loaders.gl/core'),
  load: jest.fn()
}));
jest.mock('@kepler.gl/common-utils', () => ({
  ...jest.requireActual('@kepler.gl/common-utils'),
  sleep: jest.fn(() => Promise.resolve())
}));

const mockLoad = load as jest.Mock;
const mockSleep = sleep as jest.Mock;
const server = 'https://raster.example.test';
const signal = new AbortController().signal;

function tileOptions(overrides: Partial<GetTileDataProps> = {}): GetTileDataProps {
  return {
    stac: {
      type: 'Feature',
      id: 'sample',
      assets: {
        red: {href: 'https://data.example.test/red.tif'},
        green: {href: 'https://data.example.test/green.tif'}
      },
      rasterTileServerUrls: [server],
      rasterServerUseLatestTitiler: true,
      rasterServerMaxRetries: 2,
      rasterServerRetryDelay: 100,
      rasterServerServerErrorsToRetry: [503],
      rasterServerMaxPerServerRequests: 4
    },
    loadAssetIds: ['red'],
    loadBandIndexes: [2, 0],
    index: {x: 1, y: 2, z: 3},
    signal,
    useSTACSearching: false,
    ...overrides
  } as GetTileDataProps;
}

beforeEach(() => {
  mockLoad.mockReset();
  mockSleep.mockClear();
});

describe('raster image request planning', () => {
  test('requests selected COG bands in order and propagates cancellation and retry options', async () => {
    const requests = await getSTACImageRequests(tileOptions());
    expect(requests).toHaveLength(1);
    if (!requests) throw new Error('Expected image requests');
    const request = requests[0];
    const url = new URL(request.url);
    expect(url.pathname).toBe('/cog/tiles/WebMercatorQuad/3/1/2.npy');
    expect(url.searchParams.getAll('bidx')).toEqual(['3', '1']);
    expect(url.searchParams.get('url')).toBe('https://data.example.test/red.tif');
    expect(url.searchParams.get('return_mask')).toBe('true');
    expect(request.options.signal).toBe(signal);
    expect(request).toMatchObject({
      rasterServerUrl: server,
      useMask: true,
      responseRequiredBandIndices: null,
      rasterServerMaxRetries: 2,
      rasterServerRetryDelay: 100,
      rasterServerServerErrorsToRetry: [503],
      rasterServerMaxPerServerRequests: 4
    });
  });

  test('keeps multi-asset ordering and requests one shared validity mask', async () => {
    const requests = await getSTACImageRequests(
      tileOptions({loadAssetIds: ['green', 'red'], loadBandIndexes: [1, 0]})
    );
    expect(requests).toHaveLength(2);
    if (!requests) throw new Error('Expected image requests');
    expect(
      requests.map(request => {
        const params = new URL(request.url).searchParams;
        expect(request.options.signal).toBe(signal);
        expect(request.rasterServerMaxRetries).toBe(2);
        return [params.get('url'), params.getAll('bidx'), params.get('return_mask')];
      })
    ).toEqual([
      ['https://data.example.test/green.tif', ['2'], 'true'],
      ['https://data.example.test/red.tif', ['1'], 'false']
    ]);
  });

  test('builds collection search requests with query and response-band selection', async () => {
    const options = tileOptions();
    const query = JSON.stringify({collections: ['sample'], limit: 2});
    const requests = await getSTACImageRequests(
      tileOptions({
        stac: {...options.stac, type: 'Collection'} as GetTileDataProps['stac'],
        useSTACSearching: true,
        stacSearchProvider: 'earth-search',
        _stacQuery: query
      })
    );
    if (!requests) throw new Error('Expected image requests');
    const request = requests[0];
    const url = new URL(request.url);
    expect(url.pathname).toBe('/stac/mosaic/tiles/WebMercatorQuad/3/1/2.npy');
    expect(url.searchParams.get('query')).toBe(query);
    expect(url.searchParams.get('assets')).toBe('red');
    expect(request.responseRequiredBandIndices).toEqual([2, 0]);
  });

  test('does not request a non-searchable collection as a single COG', async () => {
    const options = tileOptions();
    expect(
      await getSTACImageRequests(
        tileOptions({
          stac: {...options.stac, type: 'Collection'} as GetTileDataProps['stac']
        })
      )
    ).toBeNull();
    expect(mockLoad).not.toHaveBeenCalled();
  });
});

describe('terrain loading', () => {
  const props = {
    index: {x: 1, y: 2, z: 3},
    signal,
    rasterTileServerUrls: [server],
    boundsForGeometry: [-10, 20, 30, 40] as [number, number, number, number],
    rasterServerMaxRetries: 1,
    rasterServerRetryDelay: 25,
    rasterServerServerErrorsToRetry: [503]
  };
  const unavailable = () =>
    new FetchError('unavailable', {
      url: server,
      reason: 'HTTP',
      response: {status: 503} as Response
    });

  test('returns loaded mesh with cancellation, tile bounds and resolution-dependent skirts', async () => {
    const mesh = {attributes: {POSITION: {value: new Float32Array([0, 0, 0]), size: 3}}};
    mockLoad.mockResolvedValue(mesh);
    expect(await loadTerrain(props)).toBe(mesh);
    expect(mockLoad).toHaveBeenCalledTimes(1);
    const [url, loader, options] = mockLoad.mock.calls[0];
    expect(new URL(url).pathname).toBe('/mesh/tiles/3/1/2.terrain');
    expect(new URL(url).searchParams.get('url')).toBe('terrarium');
    const maxError = (77067.34 / 8) * 0.8;
    expect(new URL(url).searchParams.get('mesh_max_error')).toBe(maxError.toFixed(2));
    expect(loader).toBe(QuantizedMeshLoader);
    expect(options.fetch.signal).toBe(signal);
    expect(options['quantized-mesh']).toMatchObject({
      bounds: props.boundsForGeometry,
      skirtHeight: maxError * 3
    });
    expect(mockSleep).not.toHaveBeenCalled();
  });

  test('recovers from a configured transient server error after the configured delay', async () => {
    const mesh = {mode: 4};
    mockLoad.mockRejectedValueOnce(unavailable()).mockResolvedValueOnce(mesh);
    expect(await loadTerrain(props)).toBe(mesh);
    expect(mockLoad).toHaveBeenCalledTimes(2);
    expect(mockSleep).toHaveBeenCalledWith(25);
  });

  test('bounds repeated failed attempts and returns the missing-terrain sentinel', async () => {
    mockLoad.mockRejectedValue(unavailable());
    expect(await loadTerrain({...props, rasterServerMaxRetries: 2})).toBeNull();
    expect(mockLoad).toHaveBeenCalledTimes(3);
  });

  test('respects a zero retry override and handles failure without throwing', async () => {
    mockLoad.mockRejectedValue(new Error('network unavailable'));
    expect(await loadTerrain({...props, rasterServerMaxRetries: 0})).toBeNull();
    expect(mockLoad).toHaveBeenCalledTimes(1);
    expect(mockSleep).not.toHaveBeenCalled();
  });
});
