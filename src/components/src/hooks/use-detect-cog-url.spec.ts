// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {act, renderHook, waitFor} from '@testing-library/react';

import useDetectCOGUrl from './use-detect-cog-url';

const TIF_URL = 'https://example.com/scene.tif';
const NEXTGIS_COG = 'https://nextgis-web.prod.heritagewatch.ai/api/resource/2564/cog';
const STAC_COLLECTION = 'https://earth-search.aws.element84.com/v1/collections/sentinel-2-l1c';
const EXTENSIONLESS = 'https://example.com/api/resource/2564/download';

describe('useDetectCOGUrl', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.useRealTimers();
  });

  test('synchronously detects .tif URLs', () => {
    const {result} = renderHook(() => useDetectCOGUrl(TIF_URL));
    expect(result.current).toEqual({isCOG: true, probing: false});
  });

  test('synchronously detects extensionless /cog paths', () => {
    const {result} = renderHook(() => useDetectCOGUrl(NEXTGIS_COG));
    expect(result.current).toEqual({isCOG: true, probing: false});
  });

  test('does not probe documented STAC collection URLs', () => {
    global.fetch = jest.fn() as unknown as typeof fetch;
    const {result} = renderHook(() => useDetectCOGUrl(STAC_COLLECTION));
    expect(result.current).toEqual({isCOG: false, probing: false});
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('probes ambiguous URLs after debounce and treats GeoTIFF Content-Type as COG', async () => {
    jest.useFakeTimers();
    global.fetch = jest.fn(async () => {
      return {
        ok: true,
        status: 200,
        headers: {
          get: (name: string) =>
            name.toLowerCase() === 'content-type'
              ? 'image/tiff; application=geotiff; profile=cloud-optimized'
              : null
        },
        body: {cancel: jest.fn()}
      } as unknown as Response;
    }) as unknown as typeof fetch;

    const {result} = renderHook(() => useDetectCOGUrl(EXTENSIONLESS, 300));
    expect(result.current).toEqual({isCOG: false, probing: true});

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current).toEqual({isCOG: true, probing: false});
    });
    expect(global.fetch).toHaveBeenCalled();
  });

  test('does not start a probe until debounce elapses', () => {
    jest.useFakeTimers();
    global.fetch = jest.fn() as unknown as typeof fetch;

    const {result} = renderHook(() => useDetectCOGUrl(EXTENSIONLESS, 300));
    expect(result.current.probing).toBe(true);

    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
