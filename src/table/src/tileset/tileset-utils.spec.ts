/** @jest-environment node */

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {getMVTMetadata} from './tileset-utils';

const METADATA_URL = 'https://example.com/tiles/metadata.json';

// Keep the real TileJSON loader: the attribution workaround must coexist with
// its normalized bounds, zoom levels and vector layer metadata.
describe('getMVTMetadata', () => {
  const originalFetch = globalThis.fetch;
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    globalThis.fetch = fetchMock;
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  function respondWith(body: string) {
    const text = jest.fn().mockResolvedValue(body);
    fetchMock.mockResolvedValue({ok: true, text});
    return text;
  }

  test.each([null, ''])('does not fetch an absent metadata URL (%s)', async url => {
    await expect(getMVTMetadata(url)).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('returns null when fetching fails, including a CORS-style network error', async () => {
    const error = new TypeError('Failed to fetch');
    fetchMock.mockRejectedValue(error);

    await expect(getMVTMetadata(METADATA_URL)).resolves.toBeNull();
    expect(fetchMock).toHaveBeenCalledWith(METADATA_URL);
    expect(console.error).toHaveBeenCalledWith(error.message);
  });

  test('does not read an unsuccessful HTTP response as metadata', async () => {
    const text = jest.fn().mockResolvedValue('<html>Not Found</html>');
    fetchMock.mockResolvedValue({ok: false, statusText: 'Not Found', text});

    await expect(getMVTMetadata(METADATA_URL)).resolves.toBeNull();
    expect(text).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Not Found');
  });

  test('keeps parsed metadata and restores the TileJSON attribution', async () => {
    const attribution = '<a href="https://example.com/source">Data provider</a>';
    respondWith(
      JSON.stringify({
        name: 'Roads',
        bounds: [-10, -20, 30, 40],
        minzoom: 0,
        maxzoom: 12,
        vector_layers: [{id: 'roads', fields: {class: 'String'}}],
        attribution
      })
    );

    await expect(getMVTMetadata(METADATA_URL)).resolves.toMatchObject({
      name: 'Roads',
      boundingBox: [
        [-10, -20],
        [30, 40]
      ],
      minZoom: 0,
      maxZoom: 12,
      layers: [{name: 'roads', fields: [{name: 'class', type: 'utf8'}]}],
      attributions: [attribution]
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(METADATA_URL);
  });

  test.each([{}, {attribution: ''}])(
    'does not invent an attribution when it is absent or empty: %j',
    async extra => {
      respondWith(JSON.stringify({name: 'Unattributed tiles', ...extra}));

      const metadata = await getMVTMetadata(METADATA_URL);

      expect(metadata).toMatchObject({name: 'Unattributed tiles'});
      expect(metadata).not.toHaveProperty('attributions');
    }
  );

  test('returns null when the loader cannot produce metadata', async () => {
    respondWith('null');

    await expect(getMVTMetadata(METADATA_URL)).resolves.toBeNull();
  });

  test('propagates a response body read failure to the caller', async () => {
    const error = new Error('Body stream interrupted');
    fetchMock.mockResolvedValue({ok: true, text: jest.fn().mockRejectedValue(error)});

    await expect(getMVTMetadata(METADATA_URL)).rejects.toBe(error);
  });

  test('rejects malformed JSON rather than returning successful metadata', async () => {
    respondWith('{invalid json');

    await expect(getMVTMetadata(METADATA_URL)).rejects.toThrow(SyntaxError);
  });
});
