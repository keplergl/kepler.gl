// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {Texture} from '@luma.gl/core';
import type {ShaderModule} from './webgl';

/** Allowed input for images prop — either GPU-resident Texture objects or
 * legacy raster texture descriptors with CPU data that will be uploaded.
 */
export type ImageInput = Record<string, any>;

/** Internal storage of images
 * The Texture object references data on the GPU
 */
export type ImageState = Record<string, Texture | Texture[]>;

/** Properties added by RasterLayer. */
export type RasterLayerAddedProps = {
  modules: ShaderModule[];
  images: ImageInput;
  moduleProps: Record<string, number>;
  onRedrawNeeded?: (() => void) | null;
};
