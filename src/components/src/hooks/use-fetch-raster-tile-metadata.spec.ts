// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {act, renderHook, waitFor} from '@testing-library/react';
import {fetch} from 'global';
import {PMTilesSourceLoader} from '@loaders.gl/tiles/pmtiles';
import {RasterTileType} from '@kepler.gl/constants';
import useFetchJson, {FetchJsonProps} from './use-fetch-raster-tile-metadata';

jest.mock('global', () => ({fetch: jest.fn()}));
jest.mock('@loaders.gl/tiles/pmtiles', () => ({
  PMTilesSourceLoader: {createDataSourceSync: jest.fn()}
}));

const URL = 'https://example.com/metadata.json';
const rawMetadata = {name: 'Elevation', bounds: [-10, -5, 10, 5]};
const metadata = {
  metaJson: null,
  bounds: null,
  center: null,
  maxZoom: null,
  minZoom: null,
  fields: []
};
const fetchMock = fetch as jest.MockedFunction<typeof fetch>;
const createSourceMock = PMTilesSourceLoader.createDataSourceSync as jest.Mock;

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => {
    resolve = done;
  });
  return {promise, resolve};
}

function response(json: unknown) {
  return {ok: true, json: jest.fn().mockResolvedValue(json)} as unknown as Response;
}

function props(overrides: Partial<FetchJsonProps> = {}): FetchJsonProps {
  return {
    url: URL,
    rasterTileType: RasterTileType.STAC,
    process: jest.fn().mockReturnValue(metadata),
    ...overrides
  };
}

describe('useFetchJson raster metadata', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('stays idle without a URL and does not invoke either transport or the processor', () => {
    const input = props({url: null});
    const {result} = renderHook(() => useFetchJson(input));
    expect(result.current).toEqual({data: null, loading: false, error: null});
    expect(fetchMock).not.toHaveBeenCalled();
    expect(createSourceMock).not.toHaveBeenCalled();
    expect(input.process).not.toHaveBeenCalled();
  });

  test('loads JSON with fetch options and passes the source context to the processor', async () => {
    const pending = deferred<Response>();
    fetchMock.mockReturnValue(pending.promise);
    const options = {headers: {Authorization: 'test-token'}};
    const input = props({options});
    const {result} = renderHook(() => useFetchJson(input));
    expect(result.current).toEqual({data: null, loading: true, error: null});
    expect(fetchMock).toHaveBeenCalledWith(URL, options);
    await act(async () => pending.resolve(response(rawMetadata)));
    expect(result.current).toEqual({data: metadata, loading: false, error: null});
    expect(input.process).toHaveBeenCalledWith(rawMetadata, {
      metadataUrl: URL,
      rasterTileType: RasterTileType.STAC
    });
    expect(createSourceMock).not.toHaveBeenCalled();
  });

  test('reads PMTiles metadata from the source instead of fetching JSON', async () => {
    const pending = deferred<typeof rawMetadata>();
    createSourceMock.mockReturnValue({metadata: pending.promise});
    const input = props({rasterTileType: RasterTileType.PMTILES});
    const {result} = renderHook(() => useFetchJson(input));
    expect(result.current.loading).toBe(true);
    expect(createSourceMock).toHaveBeenCalledWith(URL, {});
    await act(async () => pending.resolve(rawMetadata));
    expect(result.current).toEqual({data: metadata, loading: false, error: null});
    expect(input.process).toHaveBeenCalledWith(rawMetadata, {
      metadataUrl: URL,
      rasterTileType: RasterTileType.PMTILES
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('reports an HTTP failure without parsing or processing the response', async () => {
    const json = jest.fn();
    fetchMock.mockResolvedValue({ok: false, json} as unknown as Response);
    const input = props();
    const {result} = renderHook(() => useFetchJson(input));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeInstanceOf(Error);
    expect(json).not.toHaveBeenCalled();
    expect(input.process).not.toHaveBeenCalled();
  });

  test.each(['fetch', 'json', 'pmtiles'] as const)(
    'exposes a rejected %s operation and clears loading',
    async stage => {
      const error = new Error(`${stage} failed`);
      const input = props();
      if (stage === 'fetch') {
        fetchMock.mockRejectedValue(error);
      } else if (stage === 'json') {
        fetchMock.mockResolvedValue({
          ok: true,
          json: jest.fn().mockRejectedValue(error)
        } as unknown as Response);
      } else {
        input.rasterTileType = RasterTileType.PMTILES;
        createSourceMock.mockReturnValue({metadata: Promise.reject(error)});
      }
      const {result} = renderHook(() => useFetchJson(input));
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current).toEqual({data: null, loading: false, error});
      expect(input.process).not.toHaveBeenCalled();
    }
  );

  test.each([RasterTileType.STAC, RasterTileType.PMTILES])(
    'rejects missing metadata from %s without processing it',
    async rasterTileType => {
      fetchMock.mockResolvedValue(response(null));
      createSourceMock.mockReturnValue({metadata: Promise.resolve(null)});
      const input = props({rasterTileType});
      const {result} = renderHook(() => useFetchJson(input));
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.data).toBeNull();
      expect(input.process).not.toHaveBeenCalled();
    }
  );

  test.each(['returned', 'thrown'])('exposes a %s processing error', async kind => {
    const error = new Error('Unsupported raster metadata');
    fetchMock.mockResolvedValue(response(rawMetadata));
    const process = jest.fn(() => {
      if (kind === 'thrown') throw error;
      return error;
    });
    const {result} = renderHook(() => useFetchJson(props({process})));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current).toEqual({data: null, loading: false, error});
  });

  test('clears a completed failure and old data when requesting a new source', async () => {
    const error = new Error('Network failure');
    fetchMock.mockRejectedValueOnce(error).mockResolvedValueOnce(response(rawMetadata));
    const input = props();
    const {result, rerender} = renderHook(useFetchJson, {initialProps: input});
    await waitFor(() => expect(result.current.error).toBe(error));
    rerender({...input, url: 'https://example.com/recovered.json'});
    await waitFor(() => expect(result.current.data).toEqual(metadata));
    expect(result.current).toEqual({data: metadata, loading: false, error: null});

    const pending = deferred<Response>();
    fetchMock.mockReturnValueOnce(pending.promise);
    rerender({...input, url: 'https://example.com/next.json'});
    expect(result.current).toEqual({data: null, loading: true, error: null});
    await act(async () => pending.resolve(response(rawMetadata)));
    rerender({...input, url: null});
    expect(result.current).toEqual({data: null, loading: false, error: null});
  });
});
