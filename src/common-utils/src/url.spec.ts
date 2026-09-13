// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  isCOGUrl,
  isGeoTiffContentType,
  isTiffMagicBytes,
  probeUrlIsCOG,
  shouldProbeForCOG
} from './url';

const NEXTGIS_COG = 'https://nextgis-web.prod.heritagewatch.ai/api/resource/2564/cog';
const TIF_URL = 'https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/TCI.tif';
const TITILER_STAC = `https://titiler.xyz/cog/stac?url=${encodeURIComponent(NEXTGIS_COG)}`;
const STAC_COLLECTION = 'https://earth-search.aws.element84.com/v1/collections/sentinel-2-l1c';
const JSON_STAC = 'https://example.com/sdk/examples/sample-data/raster/planet-skysat-opendata.json';
const EXTENSIONLESS = 'https://example.com/api/resource/2564/download';

function mockResponse({
  ok = true,
  status = 200,
  contentType,
  body
}: {
  ok?: boolean;
  status?: number;
  contentType?: string;
  body?: Uint8Array;
} = {}): Response {
  const headers = {
    get: (name: string) => (name.toLowerCase() === 'content-type' ? contentType || null : null)
  };
  return {
    ok,
    status,
    headers,
    body: body
      ? {
          cancel: jest.fn().mockResolvedValue(undefined),
          getReader: () => {
            let delivered = false;
            return {
              read: async () => {
                if (delivered) return {done: true, value: undefined};
                delivered = true;
                return {done: false, value: body};
              },
              cancel: async () => undefined
            };
          }
        }
      : {cancel: jest.fn().mockResolvedValue(undefined), getReader: undefined},
    arrayBuffer: async () => (body ? body.buffer : new ArrayBuffer(0))
  } as unknown as Response;
}

describe('isCOGUrl', () => {
  test('matches GeoTIFF extensions', () => {
    expect(isCOGUrl(TIF_URL)).toBe(true);
    expect(isCOGUrl('https://example.com/file.tiff')).toBe(true);
    expect(isCOGUrl('https://example.com/file.TIF')).toBe(true);
    expect(isCOGUrl('https://example.com/file.geotiff')).toBe(true);
    expect(isCOGUrl('https://example.com/file.tif?token=abc')).toBe(true);
    expect(isCOGUrl('https://example.com/file.tif/')).toBe(true);
  });

  test('matches extensionless NextGIS-style /cog paths', () => {
    expect(isCOGUrl(NEXTGIS_COG)).toBe(true);
    expect(isCOGUrl(`${NEXTGIS_COG}/`)).toBe(true);
    expect(isCOGUrl(`${NEXTGIS_COG}?download=1`)).toBe(true);
  });

  test('does not match STAC, PMTiles, or TiTiler wrappers', () => {
    expect(isCOGUrl(STAC_COLLECTION)).toBe(false);
    expect(isCOGUrl(JSON_STAC)).toBe(false);
    expect(isCOGUrl(TITILER_STAC)).toBe(false);
    expect(isCOGUrl('https://example.com/historic.pmtiles')).toBe(false);
    expect(isCOGUrl('')).toBe(false);
    expect(isCOGUrl(undefined)).toBe(false);
  });
});

describe('isGeoTiffContentType', () => {
  test('matches GeoTIFF and COG content types', () => {
    expect(isGeoTiffContentType('image/tiff')).toBe(true);
    expect(isGeoTiffContentType('image/tiff; application=geotiff; profile=cloud-optimized')).toBe(
      true
    );
    expect(isGeoTiffContentType('image/geotiff')).toBe(true);
    expect(isGeoTiffContentType('application/json')).toBe(false);
    expect(isGeoTiffContentType(null)).toBe(false);
  });
});

describe('isTiffMagicBytes', () => {
  test('detects little-endian and big-endian classic TIFF headers', () => {
    expect(isTiffMagicBytes(new Uint8Array([0x49, 0x49, 0x2a, 0x00]))).toBe(true);
    expect(isTiffMagicBytes(new Uint8Array([0x4d, 0x4d, 0x00, 0x2a]))).toBe(true);
    expect(isTiffMagicBytes(new Uint8Array([0x7b, 0x22, 0x74, 0x79]))).toBe(false);
    expect(isTiffMagicBytes(new Uint8Array([0x49, 0x49]))).toBe(false);
  });

  test('detects little-endian and big-endian BigTIFF headers', () => {
    // BigTIFF uses version 43 (0x2b) instead of classic TIFF's 42 (0x2a).
    expect(isTiffMagicBytes(new Uint8Array([0x49, 0x49, 0x2b, 0x00]))).toBe(true);
    expect(isTiffMagicBytes(new Uint8Array([0x4d, 0x4d, 0x00, 0x2b]))).toBe(true);
  });
});

describe('shouldProbeForCOG', () => {
  test('probes ambiguous extensionless URLs', () => {
    expect(shouldProbeForCOG(EXTENSIONLESS)).toBe(true);
  });

  test('skips known types so STAC examples do not pay an extra HEAD', () => {
    expect(shouldProbeForCOG(TIF_URL)).toBe(false);
    expect(shouldProbeForCOG(NEXTGIS_COG)).toBe(false);
    expect(shouldProbeForCOG(JSON_STAC)).toBe(false);
    expect(shouldProbeForCOG(STAC_COLLECTION)).toBe(false);
    expect(shouldProbeForCOG('https://example.com/file.pmtiles')).toBe(false);
    expect(shouldProbeForCOG('not a url')).toBe(false);
  });
});

describe('probeUrlIsCOG', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test('returns true when HEAD reports a GeoTIFF Content-Type', async () => {
    global.fetch = jest.fn(async (input, init) => {
      expect(input).toBe(EXTENSIONLESS);
      expect((init as RequestInit).method).toBe('HEAD');
      return mockResponse({
        contentType: 'image/tiff; application=geotiff; profile=cloud-optimized'
      });
    }) as unknown as typeof fetch;

    await expect(probeUrlIsCOG(EXTENSIONLESS)).resolves.toBe(true);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('returns false when HEAD reports JSON', async () => {
    global.fetch = jest.fn(async () =>
      mockResponse({contentType: 'application/json'})
    ) as unknown as typeof fetch;

    await expect(probeUrlIsCOG(EXTENSIONLESS)).resolves.toBe(false);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('falls back to ranged GET magic bytes when HEAD fails', async () => {
    global.fetch = jest.fn(async (_input, init) => {
      if ((init as RequestInit).method === 'HEAD') {
        throw new TypeError('Failed to fetch');
      }
      expect((init as RequestInit).headers).toEqual({Range: 'bytes=0-15'});
      return mockResponse({
        contentType: 'application/octet-stream',
        body: new Uint8Array([0x49, 0x49, 0x2a, 0x00, 0x08, 0x00])
      });
    }) as unknown as typeof fetch;

    await expect(probeUrlIsCOG(EXTENSIONLESS)).resolves.toBe(true);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  test('returns false when both HEAD and GET fail', async () => {
    global.fetch = jest.fn(async () => {
      throw new TypeError('Failed to fetch');
    }) as unknown as typeof fetch;

    await expect(probeUrlIsCOG(EXTENSIONLESS)).resolves.toBe(false);
  });

  test('returns false when aborted', async () => {
    const controller = new AbortController();
    controller.abort();
    global.fetch = jest.fn() as unknown as typeof fetch;
    await expect(probeUrlIsCOG(EXTENSIONLESS, controller.signal)).resolves.toBe(false);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('returns false when the probe times out', async () => {
    jest.useFakeTimers();
    global.fetch = jest.fn((_input, init) => {
      return new Promise((_resolve, reject) => {
        const signal = (init as RequestInit | undefined)?.signal;
        const abort = () => {
          const err = new Error('Aborted');
          err.name = 'AbortError';
          reject(err);
        };
        if (signal?.aborted) {
          abort();
          return;
        }
        signal?.addEventListener('abort', abort);
      });
    }) as unknown as typeof fetch;

    const promise = probeUrlIsCOG(EXTENSIONLESS, undefined, 50);
    await jest.advanceTimersByTimeAsync(50);
    await expect(promise).resolves.toBe(false);
    jest.useRealTimers();
  });
});
