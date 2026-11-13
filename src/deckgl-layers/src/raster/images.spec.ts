// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {GL} from '@luma.gl/constants';
import type {Texture} from '@luma.gl/core';
import {loadImages} from './images';
import type {ImageInput, ImageState} from './types';

const gl = {} as WebGL2RenderingContext;
const texture = (id: string) => ({id, device: {}} as Texture);
const originalBitmap = Object.getOwnPropertyDescriptor(globalThis, 'ImageBitmap');
const originalImageData = Object.getOwnPropertyDescriptor(globalThis, 'ImageData');

function upload(
  imagesData: ImageInput,
  createTexture = jest.fn<Texture, [Record<string, unknown>]>(() => texture('uploaded'))
) {
  const images: ImageState = {};
  const result = loadImages({gl, device: {createTexture}, images, imagesData, oldImagesData: {}});
  return {result, createTexture, images};
}

describe('raster texture uploads', () => {
  beforeAll(() => {
    // jsdom has no bitmap API. Keep instanceof checks meaningful for CPU arrays.
    if (!globalThis.ImageBitmap) {
      Object.defineProperty(globalThis, 'ImageBitmap', {value: class {}, configurable: true});
    }
    if (!globalThis.ImageData) {
      Object.defineProperty(globalThis, 'ImageData', {value: class {}, configurable: true});
    }
  });

  afterAll(() => {
    for (const [key, descriptor] of [
      ['ImageBitmap', originalBitmap],
      ['ImageData', originalImageData]
    ] as const) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  });

  afterEach(() => jest.restoreAllMocks());

  test.each([
    [GL.R8UI, 'r8uint', new Uint8Array([0, 1, 128, 255])],
    [GL.R16UI, 'r16uint', new Uint16Array([0, 1, 256, 65535])],
    [GL.R32UI, 'r32uint', new Uint32Array([0, 1, 65536, 4294967295])],
    [GL.R8I, 'r8sint', new Int8Array([-128, -1, 0, 127])],
    [GL.R16I, 'r16sint', new Int16Array([-32768, -1, 0, 32767])],
    [GL.R32I, 'r32sint', new Int32Array([-2147483648, -1, 0, 2147483647])],
    [GL.R32F, 'r32float', new Float32Array([0, -1, 1, 0.5])],
    [GL.RGBA, 'rgba8unorm', new Uint8Array(16)]
  ])('maps raster format %s without converting sample values', (format, expected, data) => {
    const {createTexture} = upload({band: {data, width: 2, height: 2, format}});
    expect(createTexture).toHaveBeenCalledWith(
      expect.objectContaining({data, width: 2, height: 2, format: expected})
    );
    expect(createTexture.mock.calls[0][0].data).toBe(data);
  });

  test.each([Uint8Array, Uint8ClampedArray])('expands RGB bytes into opaque RGBA', ArrayType => {
    const data = new ArrayType([1, 2, 3, 254, 128, 0]);
    const {createTexture} = upload({rgb: {format: GL.RGB, data, width: 2, height: 1}});
    expect(createTexture).toHaveBeenCalledWith(
      expect.objectContaining({
        format: 'rgba8unorm',
        data: new Uint8Array([1, 2, 3, 255, 254, 128, 0, 255])
      })
    );
    expect(Array.from(data)).toEqual([1, 2, 3, 254, 128, 0]);
  });

  test('uploads DOM image data with intrinsic dimensions and default sampler', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 5;
    canvas.height = 3;
    const {createTexture} = upload({image: {data: canvas, mipmaps: false}});
    expect(createTexture).toHaveBeenCalledWith({
      data: canvas,
      width: 5,
      height: 3,
      format: 'rgba8unorm',
      mipmaps: false,
      sampler: {
        minFilter: 'nearest',
        magFilter: 'nearest',
        addressModeU: 'clamp-to-edge',
        addressModeV: 'clamp-to-edge'
      }
    });
  });

  test.each([
    [GL.NEAREST_MIPMAP_NEAREST, 'nearest', 'nearest'],
    [GL.NEAREST_MIPMAP_LINEAR, 'nearest', 'linear'],
    [GL.LINEAR_MIPMAP_NEAREST, 'linear', 'nearest'],
    [GL.LINEAR_MIPMAP_LINEAR, 'linear', 'linear']
  ])(
    'translates mipmap sampler %s independently from magnification and wrapping',
    (filter, minFilter, mipmapFilter) => {
      const {createTexture} = upload({
        image: {
          parameters: {
            [GL.TEXTURE_MIN_FILTER]: filter,
            [GL.TEXTURE_MAG_FILTER]: GL.LINEAR,
            [GL.TEXTURE_WRAP_S]: GL.REPEAT,
            [GL.TEXTURE_WRAP_T]: GL.MIRRORED_REPEAT
          }
        }
      });
      expect(createTexture).toHaveBeenCalledWith(
        expect.objectContaining({
          sampler: {
            minFilter,
            mipmapFilter,
            magFilter: 'linear',
            addressModeU: 'repeat',
            addressModeV: 'mirror-repeat'
          }
        })
      );
    }
  );

  test('retains safe sampling defaults for unknown legacy parameters', () => {
    const {createTexture} = upload({
      image: {
        parameters: {
          [GL.TEXTURE_MIN_FILTER]: -1,
          [GL.TEXTURE_MAG_FILTER]: -1,
          [GL.TEXTURE_WRAP_S]: -1,
          [GL.TEXTURE_WRAP_T]: -1
        }
      }
    });
    expect(createTexture).toHaveBeenCalledWith(
      expect.objectContaining({
        sampler: {
          minFilter: 'nearest',
          magFilter: 'nearest',
          addressModeU: 'clamp-to-edge',
          addressModeV: 'clamp-to-edge'
        }
      })
    );
  });

  test('reuses resident textures and preserves band order without uploading', () => {
    const first = texture('first');
    const second = texture('second');
    const {result, createTexture, images} = upload({bands: [first, second]});
    expect(images.bands).toEqual([first, second]);
    expect((images.bands as Texture[])[0]).toBe(first);
    expect(result).toEqual({images, hasPendingUploads: false});
    expect(createTexture).not.toHaveBeenCalled();
  });

  test('does not upload equal descriptors; removes deleted sources and replaces changed ones', () => {
    const old = {width: 2, height: 1};
    const stable = texture('stable');
    const images = {stable, removed: texture('removed'), changed: texture('old')};
    const replacement = texture('replacement');
    const createTexture = jest.fn(() => replacement);
    const result = loadImages({
      gl,
      device: {createTexture},
      images,
      oldImagesData: {stable: old, removed: old, changed: old},
      imagesData: {stable: {...old}, changed: {...old, width: 3}}
    });
    expect(createTexture).toHaveBeenCalledTimes(1);
    expect(images).toEqual({stable, changed: replacement});
    expect(result).toEqual({images, hasPendingUploads: false});
    expect(
      loadImages({
        gl,
        device: {createTexture},
        images,
        oldImagesData: {stable: old},
        imagesData: {stable: {...old}}
      })
    ).toEqual({images: null, hasPendingUploads: false});
  });

  test('reports unavailable or failed uploads as pending and allows a later retry', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const imagesData = {band: {width: 2, height: 1}};
    const images: ImageState = {};
    expect(loadImages({gl, images, imagesData, oldImagesData: {}})).toEqual({
      images: null,
      hasPendingUploads: true
    });
    const createTexture = jest
      .fn()
      .mockImplementationOnce(() => {
        throw new Error('device lost');
      })
      .mockReturnValue(texture('retry'));
    expect(
      loadImages({gl, device: {createTexture}, images, imagesData, oldImagesData: {}})
    ).toEqual({images: null, hasPendingUploads: true});
    expect(images).toEqual({});
    expect(
      loadImages({gl, device: {createTexture}, images, imagesData, oldImagesData: {}})
    ).toEqual({images, hasPendingUploads: false});
    expect((images.band as Texture).id).toBe('retry');
  });
});
