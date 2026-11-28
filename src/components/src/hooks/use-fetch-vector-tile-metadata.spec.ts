// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {act, renderHook, waitFor} from '@testing-library/react';
import {PMTilesSourceLoader} from '@loaders.gl/tiles/pmtiles';
import {RemoteTileFormat} from '@kepler.gl/constants';
import {getMVTMetadata, getFieldsFromTile} from '@kepler.gl/table';
import useFetchVectorTileMetadata from './use-fetch-vector-tile-metadata';

jest.mock('@loaders.gl/tiles/pmtiles', () => ({
  PMTilesSourceLoader: {createDataSourceSync: jest.fn()}
}));
jest.mock('@kepler.gl/table', () => ({
  getMVTMetadata: jest.fn(),
  getFieldsFromTile: jest.fn()
}));

const input = {
  metadataUrl: 'https://example.com/metadata.json',
  tilesetUrl: 'https://example.com/{z}/{x}/{y}.pbf',
  remoteTileFormat: RemoteTileFormat.MVT
};
const rawMetadata = {name: 'Roads', minZoom: 2};
const metadata = {
  metaJson: null,
  bounds: null,
  center: null,
  maxZoom: null,
  fields: [],
  ...rawMetadata
};
const mvtMock = getMVTMetadata as jest.Mock;
const sourceMock = PMTilesSourceLoader.createDataSourceSync as jest.Mock;
const fieldsMock = getFieldsFromTile as jest.Mock;

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => {
    resolve = done;
  });
  return {promise, resolve};
}

describe('useFetchVectorTileMetadata', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mvtMock.mockResolvedValue(rawMetadata);
    sourceMock.mockReturnValue({metadata: Promise.resolve(rawMetadata)});
    fieldsMock.mockResolvedValue(undefined);
  });

  test('does not load or process metadata without a metadata URL', () => {
    const process = jest.fn();
    const {result} = renderHook(() =>
      useFetchVectorTileMetadata({...input, metadataUrl: null, process})
    );
    expect(result.current).toEqual({data: null, error: null, loading: false});
    expect(mvtMock).not.toHaveBeenCalled();
    expect(sourceMock).not.toHaveBeenCalled();
    expect(process).not.toHaveBeenCalled();
    expect(fieldsMock).not.toHaveBeenCalled();
  });

  test.each([RemoteTileFormat.MVT, RemoteTileFormat.PMTILES])(
    'loads %s metadata with defaults and waits for discovered fields before publishing it',
    async remoteTileFormat => {
      const discovery = deferred<void>();
      const discoveredFields = [{name: 'road_class', type: 'string'}];
      fieldsMock.mockImplementation(async ({metadata: target}) => {
        await discovery.promise;
        target.fields = discoveredFields;
      });
      const props = {...input, remoteTileFormat};
      const {result} = renderHook(() => useFetchVectorTileMetadata(props));
      await waitFor(() => expect(fieldsMock).toHaveBeenCalledWith({...props, metadata}));
      expect(result.current).toEqual({data: null, error: null, loading: true});
      expect(mvtMock.mock.calls).toEqual(
        remoteTileFormat === RemoteTileFormat.MVT ? [[input.metadataUrl]] : []
      );
      expect(sourceMock.mock.calls).toEqual(
        remoteTileFormat === RemoteTileFormat.PMTILES ? [[input.metadataUrl, {}]] : []
      );
      await act(async () => discovery.resolve());
      expect(result.current).toEqual({
        data: {...metadata, fields: discoveredFields},
        error: null,
        loading: false
      });
    }
  );

  test('uses custom processing before field discovery', async () => {
    const processed = {...metadata, name: 'Renamed roads'};
    const process = jest.fn().mockReturnValue(processed);
    const {result} = renderHook(() => useFetchVectorTileMetadata({...input, process}));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(process).toHaveBeenCalledWith(rawMetadata);
    expect(fieldsMock).toHaveBeenCalledWith({...input, metadata: processed});
    expect(result.current.data).toBe(processed);
  });

  test.each(['mvt', 'pmtiles', 'missing', 'returned', 'thrown', 'fields'])(
    'reports %s failures without publishing data and clears loading',
    async stage => {
      const failure = new Error('Metadata unavailable');
      const process = jest.fn().mockReturnValue(metadata);
      const props = {...input, process};
      if (stage === 'mvt') mvtMock.mockRejectedValue(failure);
      if (stage === 'pmtiles') {
        props.remoteTileFormat = RemoteTileFormat.PMTILES;
        sourceMock.mockImplementation(() => ({metadata: Promise.reject(failure)}));
      }
      if (stage === 'missing') mvtMock.mockResolvedValue(null);
      if (stage === 'returned') process.mockReturnValue(failure);
      if (stage === 'thrown')
        process.mockImplementation(() => {
          throw failure;
        });
      if (stage === 'fields') fieldsMock.mockRejectedValue(failure);
      const {result} = renderHook(() => useFetchVectorTileMetadata(props));
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.data).toBeNull();
      expect(result.current.error).toEqual(
        stage === 'missing' ? new Error('Failed to fetch metadata') : failure
      );
      expect(process).toHaveBeenCalledTimes(['mvt', 'pmtiles', 'missing'].includes(stage) ? 0 : 1);
      expect(fieldsMock).toHaveBeenCalledTimes(stage === 'fields' ? 1 : 0);
    }
  );

  test('clears a completed failure and reloads after the metadata URL changes', async () => {
    const failure = new Error('Offline');
    mvtMock.mockRejectedValueOnce(failure);
    const {result, rerender} = renderHook(useFetchVectorTileMetadata, {initialProps: input});
    await waitFor(() => expect(result.current.error).toBe(failure));
    const pending = deferred<typeof rawMetadata>();
    mvtMock.mockReturnValueOnce(pending.promise);
    rerender({...input, metadataUrl: 'https://example.com/next.json'});
    expect(result.current).toEqual({data: null, error: null, loading: true});
    await act(async () => pending.resolve(rawMetadata));
    expect(result.current).toEqual({data: metadata, error: null, loading: false});
  });

  test('reloads field discovery when the tile URL changes and clears completed data without a URL', async () => {
    const {result, rerender} = renderHook(useFetchVectorTileMetadata, {
      initialProps: {...input, metadataUrl: input.metadataUrl as string | null}
    });
    await waitFor(() => expect(result.current.data).toEqual(metadata));
    const next = {...input, tilesetUrl: 'https://example.com/other/{z}/{x}/{y}.pbf'};
    rerender(next);
    expect(result.current).toEqual({data: null, error: null, loading: true});
    await waitFor(() => expect(fieldsMock).toHaveBeenLastCalledWith({...next, metadata}));
    await waitFor(() => expect(result.current.loading).toBe(false));
    rerender({...next, metadataUrl: null});
    expect(result.current).toEqual({data: null, error: null, loading: false});
    expect(mvtMock).toHaveBeenCalledTimes(2);
  });
});
