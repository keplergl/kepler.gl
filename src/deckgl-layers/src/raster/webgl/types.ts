// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Texture2D} from '@luma.gl/webgl';

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
  uniforms?: Record<string, any>;
  getUniforms?: (opts: object) => GetUniformsOutput;

  /** Optional constants to define when injecting */
  defines?: Record<string, string>;
  inject?: Record<string, string>;
  dependencies?: ShaderModule[];
  deprecations?: any[];
}

export type UniformType = number | number[] | Texture2D | undefined;

export type GetUniformsOutput = Record<string, UniformType> | null;
