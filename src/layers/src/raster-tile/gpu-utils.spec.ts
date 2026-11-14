// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {FetchError, fetchFile, load, parse} from '@loaders.gl/core';
import {ImageLoader} from '@loaders.gl/images';
import {NPYLoader} from '@loaders.gl/textures';
// @ts-ignore GL resolution depends on moduleResolution setting
import {GL} from '@luma.gl/constants';
import {loadImage, loadNpyArray} from './gpu-utils';

// Keep texture conversion, channel splitting, retry control and throttling real.
// Only the network/decoder boundary is replaced: these tests do not render a GPU texture.
jest.mock('@loaders.gl/core', () => ({
  ...jest.requireActual('@loaders.gl/core'),
  fetchFile: jest.fn(),
  load: jest.fn(),
  parse: jest.fn()
}));

const loadMock = load as jest.Mock;
const fetchMock = fetchFile as jest.Mock;
const parseMock = parse as jest.Mock;
const request = {
  url: 'https://tiles.example/band.npy',
  rasterServerUrl: 'https://tiles.example',
  options: {},
  rasterServerMaxRetries: 0,
  rasterServerRetryDelay: 0,
  rasterServerServerErrorsToRetry: [503]
};

function response(data: ArrayBufferView, shape = [1, 2, 3]) {
  return {data, header: {descr: 'test', shape}};
}
function unavailable() {
  return new FetchError('temporarily unavailable', {
    url: request.url,
    reason: 'failed',
    response: {status: 503} as Response
  });
}

beforeEach(() => jest.resetAllMocks());

describe('NPY texture payloads', () => {
  test.each([
    [new Uint8Array([0, 255]), GL.R8UI, GL.RED_INTEGER, GL.UNSIGNED_BYTE],
    [new Uint16Array([0, 65535]), GL.R16UI, GL.RED_INTEGER, GL.UNSIGNED_SHORT],
    [new Uint32Array([0, 4294967295]), GL.R32UI, GL.RED_INTEGER, GL.UNSIGNED_INT],
    [new Int8Array([-128, 127]), GL.R8I, GL.RED_INTEGER, GL.BYTE],
    [new Int16Array([-32768, 32767]), GL.R16I, GL.RED_INTEGER, GL.SHORT],
    [new Int32Array([-2147483648, 2147483647]), GL.R32I, GL.RED_INTEGER, GL.INT],
    [new Float32Array([-0.25, 1.5]), GL.R32F, GL.RED, GL.FLOAT]
  ])(
    'preserves %p values and selects the matching texture format',
    async (data, format, dataFormat, type) => {
      loadMock.mockResolvedValueOnce(response(data as ArrayBufferView, [1, 1, 2]));
      const texture = await loadNpyArray(request, false);
      expect(texture).toMatchObject({
        data,
        width: 2,
        height: 1,
        format,
        dataFormat,
        type,
        mipmaps: false
      });
      expect(texture?.data).toBe(data);
      expect(texture?.parameters).toMatchObject({
        [GL.TEXTURE_MIN_FILTER]: GL.NEAREST,
        [GL.TEXTURE_MAG_FILTER]: GL.NEAREST,
        [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
        [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE
      });
    }
  );

  test('splits non-square multi-band data into zero-copy channel views in order', async () => {
    const data = new Uint16Array([1, 2, 3, 4, 5, 6, 11, 12, 13, 14, 15, 16]);
    loadMock.mockResolvedValueOnce(response(data, [2, 2, 3]));
    const fetchOverride = jest.fn();
    const channels = await loadNpyArray(request, true, {fetch: fetchOverride});
    expect(channels).toHaveLength(2);
    expect(channels?.map(channel => Array.from(channel.data))).toEqual([
      [1, 2, 3, 4, 5, 6],
      [11, 12, 13, 14, 15, 16]
    ]);
    channels?.forEach(channel => {
      expect(channel).toMatchObject({width: 3, height: 2, format: GL.R16UI});
      expect(channel.data.buffer).toBe(data.buffer);
    });
    expect(loadMock).toHaveBeenCalledWith(
      request.url,
      NPYLoader,
      expect.objectContaining({fetch: fetchOverride})
    );
  });

  test('converts Float64 values to GPU-compatible Float32 before splitting', async () => {
    const original = new Float64Array([1 / 3, -2.5, 0, 100.25]);
    loadMock.mockResolvedValueOnce(response(original, [2, 1, 2]));
    const channels = await loadNpyArray(request, true);
    expect(channels?.map(channel => Array.from(channel.data))).toEqual([
      [Math.fround(1 / 3), -2.5],
      [0, 100.25]
    ]);
    channels?.forEach(channel => {
      expect(channel.data).toBeInstanceOf(Float32Array);
      expect(channel).toMatchObject({format: GL.R32F, dataFormat: GL.RED, type: GL.FLOAT});
    });
    expect(original[0]).toBe(1 / 3);
  });

  test('does not return a decoded tile after its request has been aborted', async () => {
    const controller = new AbortController();
    loadMock.mockImplementationOnce(async () => {
      controller.abort();
      return response(new Uint8Array(6));
    });
    await expect(
      loadNpyArray({...request, options: {signal: controller.signal}}, true)
    ).resolves.toBeNull();
    expect(loadMock).toHaveBeenCalledTimes(1);
    expect(loadMock).toHaveBeenCalledWith(
      request.url,
      NPYLoader,
      expect.objectContaining({fetch: {signal: controller.signal}})
    );
  });

  test('returns no texture for a missing decoded payload', async () => {
    loadMock.mockResolvedValueOnce({header: {shape: [1, 2, 3]}});
    await expect(loadNpyArray(request, false)).resolves.toBeNull();
    expect(loadMock).toHaveBeenCalledTimes(1);
  });

  test('retries a temporary server failure and uses the successful decoded payload', async () => {
    const data = new Float32Array([42]);
    loadMock.mockRejectedValueOnce(unavailable()).mockResolvedValueOnce(response(data, [1, 1, 1]));
    const texture = await loadNpyArray({...request, rasterServerMaxRetries: 1}, false);
    expect(loadMock).toHaveBeenCalledTimes(2);
    expect(texture?.data).toBe(data);
  });

  test('stops at the retry budget and releases the server slot for the next request', async () => {
    loadMock.mockRejectedValueOnce(unavailable()).mockRejectedValueOnce(unavailable());
    await expect(
      loadNpyArray(
        {...request, rasterServerMaxRetries: 1, rasterServerMaxPerServerRequests: 1},
        false
      )
    ).resolves.toBeNull();
    expect(loadMock).toHaveBeenCalledTimes(2);
    const data = new Uint8Array([7]);
    loadMock.mockResolvedValueOnce(response(data, [1, 1, 1]));
    const next = await loadNpyArray({...request, rasterServerMaxPerServerRequests: 1}, false);
    expect(next?.data).toBe(data);
  });
});

describe('image texture loading', () => {
  test('forwards request options and combines decoded image defaults with explicit texture options', async () => {
    const fetched = {};
    const image = {width: 2, height: 3};
    const options = {signal: new AbortController().signal, headers: {Authorization: 'test-token'}};
    const parameters = {[GL.TEXTURE_MIN_FILTER]: GL.NEAREST};
    fetchMock.mockResolvedValueOnce(fetched);
    parseMock.mockResolvedValueOnce(image);
    const texture = await loadImage(
      'https://tiles.example/image.png',
      {format: GL.RGBA, parameters},
      options
    );
    expect(fetchMock).toHaveBeenCalledWith('https://tiles.example/image.png', options);
    expect(parseMock).toHaveBeenCalledWith(fetched, ImageLoader);
    expect(texture).toEqual({data: image, format: GL.RGBA, parameters});
  });

  test('propagates decoding failure instead of supplying an incomplete texture', async () => {
    const error = new Error('invalid image');
    fetchMock.mockResolvedValueOnce({});
    parseMock.mockRejectedValueOnce(error);
    await expect(loadImage('https://tiles.example/broken.png')).rejects.toBe(error);
  });
});
