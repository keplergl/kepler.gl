// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {Texture} from '@luma.gl/core';

export interface ShaderModule {
  /** A unique name for this shader module */
  name: string;

  /** A fragment shader to be used in both WebGL1 and WebGL2 environments */
  fs?: string;

  /** A fragment shader to be used only in WebGL1 environments */
  fs1?: string;

  /** A fragment shader to be used only in WebGL2 environments */
  fs2?: string;

  /** A vertex shader to inject */
  vs?: string;
  uniforms?: Record<string, UniformType>;
  getUniforms?: (opts: object) => GetUniformsOutput;

  /** luma.gl 9 UBO uniform type declarations (e.g. { opacity: 'f32' }) */
  uniformTypes?: Record<string, string>;

  /** Optional constants to define when injecting */
  defines?: Record<string, string>;
  inject?: Record<string, string>;
  dependencies?: ShaderModule[];
  deprecations?: {type: string; old: string; new: string}[];
}

export type UniformType = number | number[] | Texture | undefined;

export type GetUniformsOutput = Record<string, UniformType> | null;
