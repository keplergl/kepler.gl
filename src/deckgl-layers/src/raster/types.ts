// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {Texture2DProps, Texture2D} from '@luma.gl/webgl';

import type {ShaderModule} from './webgl';

/** Allowed input for images prop
 * Texture2D is already on the GPU, while Texture2DProps can be data on the CPU that is not yet copied to the GPU.
 */
export type ImageInput = Record<
  string,
  Texture2DProps | Texture2D | (Texture2DProps | Texture2D)[]
>;

/** Internal storage of images
 * The Texture2D object references data on the GPU
 */
export type ImageState = Record<string, Texture2D | Texture2D[]>;

/** Properties added by RasterLayer. */
export type RasterLayerAddedProps = {
  modules: ShaderModule[];
  images: ImageInput;
  moduleProps: Record<string, number>;
};
