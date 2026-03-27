// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-expect-error GL not in luma.gl 9 public types
import {GL} from '@luma.gl/constants';
import isEqual from 'lodash/isEqual';

import type {ImageInput, ImageState} from './types';

type Texture2D = any;
type Texture2DProps = any;

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
  imageItem: Texture2DProps | Texture2D | (Texture2DProps | Texture2D)[]
): null | Texture2D | Texture2D[] {
  let result: null | Texture2D | Texture2D[];
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

  const filterMap = {
    [GL.NEAREST]: 'nearest',
    [GL.LINEAR]: 'linear',
    [GL.LINEAR_MIPMAP_LINEAR]: 'linear',
    [GL.NEAREST_MIPMAP_NEAREST]: 'nearest'
  };

  const wrapMap = {
    [GL.CLAMP_TO_EDGE]: 'clamp-to-edge',
    [GL.REPEAT]: 'repeat',
    [GL.MIRRORED_REPEAT]: 'mirror-repeat'
  };

  if (oldParams) {
    if (oldParams[GL.TEXTURE_MIN_FILTER] !== undefined) {
      result.minFilter = filterMap[oldParams[GL.TEXTURE_MIN_FILTER]] || 'nearest';
    }
    if (oldParams[GL.TEXTURE_MAG_FILTER] !== undefined) {
      result.magFilter = filterMap[oldParams[GL.TEXTURE_MAG_FILTER]] || 'nearest';
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
 * Create texture object from image data using luma.gl 9 device API.
 * Returns a proper luma.gl Texture object that works with the binding system.
 */
function loadTexture(
  gl: WebGL2RenderingContext,
  device: any,
  imageData: Texture2D | Texture2DProps
): Texture2D | null {
  if (!imageData) {
    return null;
  }

  // If already a luma.gl Texture instance, return as-is
  if (imageData.handle || imageData.id?.startsWith?.('luma') || imageData.device) {
    return imageData as Texture2D;
  }

  // @ts-expect-error luma internal properties not in WebGL2RenderingContext type
  const lumaDevice = device || gl.luma?.device || gl.__luma_device;

  if (!lumaDevice?.createTexture) {
    console.warn('RasterLayer: No luma.gl device available for texture creation');
    return null;
  }

  try {
    const samplerParams = mapSamplerParameters(imageData.parameters || {});
    const textureFormat = imageData.format
      ? mapTextureFormat(imageData.format, imageData.type)
      : 'rgba8unorm';

    const textureProps: any = {
      width: imageData.width || imageData.data?.width || 1,
      height: imageData.height || imageData.data?.height || 1,
      format: textureFormat,
      sampler: samplerParams,
      ...(imageData.mipmaps === false ? {mipmaps: false} : {})
    };

    if (imageData.data) {
      if (
        imageData.data instanceof HTMLImageElement ||
        imageData.data instanceof HTMLCanvasElement ||
        imageData.data instanceof ImageBitmap ||
        imageData.data instanceof ImageData
      ) {
        textureProps.data = imageData.data;
      } else if (ArrayBuffer.isView(imageData.data)) {
        textureProps.data = imageData.data;
      }
    }

    return lumaDevice.createTexture(textureProps);
  } catch (e) {
    console.warn('RasterLayer: Failed to create texture via device.createTexture:', e);
    return null;
  }
}
