// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import GL from '@luma.gl/constants';
import {isWebGL2, Texture2D} from '@luma.gl/core';
import type {Texture2DProps} from '@luma.gl/webgl';
import isEqual from 'lodash/isEqual';

import type {ImageInput, ImageState} from './types';

/**
 * Texture parameters that should work for every texture on both WebGL1 and WebGL2
 */
const DEFAULT_UNIVERSAL_TEXTURE_PARAMETERS = {
  [GL.TEXTURE_MIN_FILTER]: GL.NEAREST,
  [GL.TEXTURE_MAG_FILTER]: GL.NEAREST,
  [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
  [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE
};

type LoadImagesOptions = {
  gl: WebGLRenderingContext | WebGL2RenderingContext;
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
  gl: WebGLRenderingContext | WebGL2RenderingContext,
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
  // Change to `true` if we need to setState with a new `images` object
  let imagesDirty = false;

  // If there are any removed keys, which previously existed in oldProps and
  // this.state.images but no longer exist in props, remove from the images
  // object
  if (oldImagesData) {
    for (const key in oldImagesData) {
      if (imagesData && !(key in imagesData) && key in images) {
        delete images[key];
        imagesDirty = true;
      }
    }
  }

  // Check if any keys of props.images have changed
  const changedKeys: string[] = [];
  for (const key in imagesData) {
    // If oldProps.images didn't exist or it existed and this key didn't exist
    if (!oldImagesData || (oldImagesData && !(key in oldImagesData))) {
      changedKeys.push(key);
      continue;
    }

    // Deep compare when the key previously existed to see if it changed
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
 * Create Texture2D object from image data
 */
function loadTexture(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  imageData: Texture2D | Texture2DProps
): Texture2D | null {
  if (!imageData) {
    return null;
  }

  if (imageData instanceof Texture2D) {
    return imageData;
  }

  let textureParams: Texture2DProps = {
    parameters: DEFAULT_UNIVERSAL_TEXTURE_PARAMETERS,
    ...imageData
  };

  if (!isWebGL2(gl)) {
    textureParams = webgl1TextureFallbacks(textureParams);
  }

  return new Texture2D(gl, textureParams);
}

/**
 * Texture fallbacks for WebGL1
 * Fallback ideas derived from viv
 * https://github.com/hms-dbmi/viv/blob/5bcec429eeba55914ef3d7155a610d82048520a0/src/layers/XRLayer/XRLayer.js#L280-L302
 */
function webgl1TextureFallbacks(textureParams: Texture2DProps): Texture2DProps {
  // Set mipmaps to false
  // Not sure if this is necessary?
  // Might actually only be necessary for uint textures
  textureParams.mipmaps = false;

  // Change format to Luminance
  if (textureParams.format && [GL.R8UI, GL.R16UI, GL.R32UI].includes(textureParams.format)) {
    textureParams.format = GL.LUMINANCE;
  }

  // Change dataFormat to Luminance
  if (textureParams.dataFormat === GL.RED_INTEGER) {
    textureParams.dataFormat = GL.LUMINANCE;
  }

  // Set data type to float
  if (
    textureParams.type &&
    [GL.UNSIGNED_BYTE, GL.UNSIGNED_SHORT, GL.UNSIGNED_INT].includes(textureParams.type)
  ) {
    textureParams.type = GL.FLOAT;
  }

  // Cast data to float 32 if one of the uint types
  if (
    textureParams.data instanceof Uint8Array ||
    textureParams.data instanceof Uint16Array ||
    textureParams.data instanceof Uint32Array
  ) {
    textureParams.data = new Float32Array(textureParams.data);
  }

  // Override texture parameters to make sure they're valid on WebGL1
  textureParams.parameters = {...textureParams.parameters, ...DEFAULT_UNIVERSAL_TEXTURE_PARAMETERS};

  return textureParams;
}
