// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// In luma.gl 9.x, Texture2D is replaced by Texture from @luma.gl/core
// Using generic types as placeholders until full migration
import type {Texture, TextureProps} from '@luma.gl/core';

import type {ShaderModule} from './webgl';

// Type aliases for luma.gl 9.x compatibility
type Texture2DProps = TextureProps;
type Texture2D = Texture;

/** Allowed input for images prop
 * Texture is already on the GPU, while TextureProps can be data on the CPU that is not yet copied to the GPU.
 */
export type ImageInput = Record<
  string,
  Texture2DProps | Texture2D | (Texture2DProps | Texture2D)[]
>;

/** Internal storage of images
 * The Texture object references data on the GPU
 */
export type ImageState = Record<string, Texture2D | Texture2D[]>;

/** Properties added by RasterLayer. */
export type RasterLayerAddedProps = {
  modules: ShaderModule[];
  images: ImageInput;
  moduleProps: Record<string, number>;
};
