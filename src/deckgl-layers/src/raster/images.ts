// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck - Raster images module uses luma.gl Texture APIs that changed in 9.x
// TODO: Refactor to use luma.gl 9.x Texture API

import {GL} from '@luma.gl/constants';
import isEqual from 'lodash/isEqual';

import type {ImageInput, ImageState, Texture2D, Texture2DProps} from './types';

/**
 * Texture parameters for WebGL2 textures
 */
const DEFAULT_UNIVERSAL_TEXTURE_PARAMETERS = {
  [GL.TEXTURE_MIN_FILTER]: GL.NEAREST,
  [GL.TEXTURE_MAG_FILTER]: GL.NEAREST,
  [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
  [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE
};

type LoadImagesOptions = {
  gl: WebGL2RenderingContext;
  images: ImageState;
  imagesData: ImageInput;
  oldImagesData: ImageInput;
};

/**
 * Load image items to webgl context
 * @param gl webgl rendering context
 * @param imageItem image item, might be single texture or array of textures
 * @returns loaded single webgl texture or array of webgl texture or null
 */
function loadImageItem(
  gl: WebGL2RenderingContext,
  imageItem: Texture2DProps | Texture2D | (Texture2DProps | Texture2D)[]
): null | Texture2D | Texture2D[] {
  let result: null | Texture2D | Texture2D[];
  if (Array.isArray(imageItem)) {
    const dirtyResult = imageItem.map(x => loadTexture(gl, x));
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
    result = loadTexture(gl, imageItem);
  }
  return result;
}

// eslint-disable-next-line complexity
export function loadImages({
  gl,
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

    const loadedItem = loadImageItem(gl, imageData);
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
 * Create texture object from image data
 */
function loadTexture(
  gl: WebGL2RenderingContext,
  imageData: Texture2D | Texture2DProps
): Texture2D | null {
  if (!imageData) {
    return null;
  }

  // If already a Texture instance, return as-is
  if (imageData.handle || imageData.gl || imageData.device) {
    return imageData as Texture2D;
  }

  const textureParams: Texture2DProps = {
    parameters: DEFAULT_UNIVERSAL_TEXTURE_PARAMETERS,
    ...imageData
  };

  // In luma.gl 9.x this would be device.createTexture(textureParams)
  // For now, maintain backward compatibility
  const Texture2DClass = gl.__luma_Texture2D;
  if (Texture2DClass) {
    return new Texture2DClass(gl, textureParams);
  }

  // Fallback: try creating texture through the WebGL context
  return textureParams as any;
}
