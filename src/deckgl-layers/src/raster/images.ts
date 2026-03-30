// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-ignore GL resolution depends on moduleResolution setting
import {GL} from '@luma.gl/constants';
import isEqual from 'lodash/isEqual';

import type {Texture} from '@luma.gl/core';
import type {ImageInput, ImageState} from './types';

/**
 * Legacy texture creation descriptor used by raster shader modules.
 * Contains CPU-side data + old GL-enum-based parameters that get
 * translated to luma.gl 9's device.createTexture() props.
 */
type RasterTextureData = {
  handle?: unknown;
  id?: string;
  device?: unknown;
  width?: number;
  height?: number;
  format?: number;
  type?: number;
  parameters?: Record<number, number>;
  mipmaps?: boolean;
  data?: any;
};

/**
 * Texture sampler parameters for luma.gl 9 textures
 */
const DEFAULT_SAMPLER_PARAMETERS = {
  minFilter: 'nearest',
  magFilter: 'nearest',
  addressModeU: 'clamp-to-edge',
  addressModeV: 'clamp-to-edge'
};

type LoadImagesOptions = {
  gl: WebGL2RenderingContext;
  device?: any;
  images: ImageState;
  imagesData: ImageInput;
  oldImagesData: ImageInput;
};

/**
 * Load image items to webgl context
 */
function loadImageItem(
  gl: WebGL2RenderingContext,
  device: any,
  imageItem: any
): null | Texture | Texture[] {
  let result: null | Texture | Texture[];
  if (Array.isArray(imageItem)) {
    const dirtyResult = imageItem.map(x => loadTexture(gl, device, x));
    result = [];
    for (const texture of dirtyResult) {
      if (texture) {
        result.push(texture);
      }
    }
    if (!result.length) {
      result = null;
    }
  } else {
    result = loadTexture(gl, device, imageItem);
  }
  return result;
}

// eslint-disable-next-line complexity
export function loadImages({
  gl,
  device,
  images,
  imagesData,
  oldImagesData
}: LoadImagesOptions): ImageState | null {
  let imagesDirty = false;

  if (oldImagesData) {
    for (const key in oldImagesData) {
      if (imagesData && !(key in imagesData) && key in images) {
        delete images[key];
        imagesDirty = true;
      }
    }
  }

  const changedKeys: string[] = [];
  for (const key in imagesData) {
    if (!oldImagesData || (oldImagesData && !(key in oldImagesData))) {
      changedKeys.push(key);
      continue;
    }

    if (!isEqual(imagesData[key], oldImagesData[key])) {
      changedKeys.push(key);
    }
  }

  for (const key of changedKeys) {
    const imageData = imagesData[key];
    if (!imageData) {
      continue;
    }

    const loadedItem = loadImageItem(gl, device, imageData);
    if (loadedItem) {
      images[key] = loadedItem;
    }
    imagesDirty = true;
  }

  if (imagesDirty) {
    return images;
  }

  return null;
}

/**
 * Map old GL texture parameter constants to luma.gl 9 sampler parameters
 */
function mapSamplerParameters(oldParams: Record<number, number>): Record<string, string> {
  const result: Record<string, string> = {...DEFAULT_SAMPLER_PARAMETERS};

  const magFilterMap = {
    [GL.NEAREST]: 'nearest',
    [GL.LINEAR]: 'linear'
  };

  const minFilterMap: Record<number, {minFilter: string; mipmapFilter?: string}> = {
    [GL.NEAREST]: {minFilter: 'nearest'},
    [GL.LINEAR]: {minFilter: 'linear'},
    [GL.NEAREST_MIPMAP_NEAREST]: {minFilter: 'nearest', mipmapFilter: 'nearest'},
    [GL.NEAREST_MIPMAP_LINEAR]: {minFilter: 'nearest', mipmapFilter: 'linear'},
    [GL.LINEAR_MIPMAP_NEAREST]: {minFilter: 'linear', mipmapFilter: 'nearest'},
    [GL.LINEAR_MIPMAP_LINEAR]: {minFilter: 'linear', mipmapFilter: 'linear'}
  };

  const wrapMap = {
    [GL.CLAMP_TO_EDGE]: 'clamp-to-edge',
    [GL.REPEAT]: 'repeat',
    [GL.MIRRORED_REPEAT]: 'mirror-repeat'
  };

  if (oldParams) {
    if (oldParams[GL.TEXTURE_MIN_FILTER] !== undefined) {
      const mapped = minFilterMap[oldParams[GL.TEXTURE_MIN_FILTER]];
      if (mapped) {
        result.minFilter = mapped.minFilter;
        if (mapped.mipmapFilter) {
          result.mipmapFilter = mapped.mipmapFilter;
        }
      }
    }
    if (oldParams[GL.TEXTURE_MAG_FILTER] !== undefined) {
      result.magFilter = magFilterMap[oldParams[GL.TEXTURE_MAG_FILTER]] || 'nearest';
    }
    if (oldParams[GL.TEXTURE_WRAP_S] !== undefined) {
      result.addressModeU = wrapMap[oldParams[GL.TEXTURE_WRAP_S]] || 'clamp-to-edge';
    }
    if (oldParams[GL.TEXTURE_WRAP_T] !== undefined) {
      result.addressModeV = wrapMap[oldParams[GL.TEXTURE_WRAP_T]] || 'clamp-to-edge';
    }
  }

  return result;
}

/**
 * Map old GL format/type to luma.gl 9 texture format string
 */
function mapTextureFormat(glFormat: number, glType?: number): string {
  switch (glFormat) {
    case GL.R8UI:
      return 'r8uint';
    case GL.R16UI:
      return 'r16uint';
    case GL.R32UI:
      return 'r32uint';
    case GL.R8I:
      return 'r8sint';
    case GL.R16I:
      return 'r16sint';
    case GL.R32I:
      return 'r32sint';
    case GL.R32F:
      return 'r32float';
    case GL.RGBA:
      if (glType === GL.UNSIGNED_BYTE) return 'rgba8unorm';
      return 'rgba8unorm';
    case GL.RGB:
      return 'rgba8unorm';
    default:
      return 'rgba8unorm';
  }
}

/**
 * Expand 3-byte-per-pixel RGB data to 4-byte-per-pixel RGBA.
 * Needed because WebGPU/luma.gl 9 has no 3-channel texture format.
 */
function expandRGBtoRGBA(
  data: Uint8Array | Uint8ClampedArray,
  width: number,
  height: number
): Uint8Array {
  const pixelCount = width * height;
  const rgba = new Uint8Array(pixelCount * 4);
  for (let i = 0; i < pixelCount; i++) {
    rgba[i * 4] = data[i * 3];
    rgba[i * 4 + 1] = data[i * 3 + 1];
    rgba[i * 4 + 2] = data[i * 3 + 2];
    rgba[i * 4 + 3] = 255;
  }
  return rgba;
}

/**
 * Create texture object from image data using luma.gl 9 device API.
 * Returns a proper luma.gl Texture object that works with the binding system.
 */
function loadTexture(
  gl: WebGL2RenderingContext,
  device: any,
  imageData: Texture | RasterTextureData
): Texture | null {
  if (!imageData) {
    return null;
  }

  // If already a luma.gl Texture instance, return as-is
  if (
    (imageData as any).handle ||
    (imageData as any).id?.startsWith?.('luma') ||
    (imageData as any).device
  ) {
    return imageData as Texture;
  }

  const rawData = imageData as RasterTextureData;

  // @ts-expect-error luma internal properties not in WebGL2RenderingContext type
  const lumaDevice = device || gl.luma?.device || gl.__luma_device;

  if (!lumaDevice?.createTexture) {
    console.warn('RasterLayer: No luma.gl device available for texture creation');
    return null;
  }

  try {
    const samplerParams = mapSamplerParameters(rawData.parameters || {});
    const textureFormat = rawData.format
      ? mapTextureFormat(rawData.format, rawData.type)
      : 'rgba8unorm';

    const textureProps: any = {
      width: rawData.width || rawData.data?.width || 1,
      height: rawData.height || rawData.data?.height || 1,
      format: textureFormat,
      sampler: samplerParams,
      ...(rawData.mipmaps === false ? {mipmaps: false} : {})
    };

    if (rawData.data) {
      if (
        rawData.data instanceof HTMLImageElement ||
        rawData.data instanceof HTMLCanvasElement ||
        rawData.data instanceof ImageBitmap ||
        rawData.data instanceof ImageData
      ) {
        textureProps.data = rawData.data;
      } else if (ArrayBuffer.isView(rawData.data)) {
        if (
          rawData.format === GL.RGB &&
          (rawData.data instanceof Uint8Array || rawData.data instanceof Uint8ClampedArray)
        ) {
          textureProps.data = expandRGBtoRGBA(
            rawData.data,
            textureProps.width,
            textureProps.height
          );
        } else {
          textureProps.data = rawData.data;
        }
      }
    }

    return lumaDevice.createTexture(textureProps);
  } catch (e) {
    console.warn('RasterLayer: Failed to create texture via device.createTexture:', e);
    return null;
  }
}
