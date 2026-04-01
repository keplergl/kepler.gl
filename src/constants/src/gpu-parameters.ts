// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * WebGPU-style string constants for deck.gl 9 / luma.gl 9 render parameters.
 * These replace the old GL.* enum values that were used in deck.gl 8.
 */

// --- Blend factors ---
export const BLEND_FACTOR = {
  ZERO: 'zero',
  ONE: 'one',
  SRC: 'src',
  ONE_MINUS_SRC: 'one-minus-src',
  SRC_ALPHA: 'src-alpha',
  ONE_MINUS_SRC_ALPHA: 'one-minus-src-alpha',
  DST: 'dst',
  ONE_MINUS_DST: 'one-minus-dst',
  DST_ALPHA: 'dst-alpha',
  ONE_MINUS_DST_ALPHA: 'one-minus-dst-alpha'
} as const;

// --- Blend operations ---
export const BLEND_OPERATION = {
  ADD: 'add',
  SUBTRACT: 'subtract',
  REVERSE_SUBTRACT: 'reverse-subtract',
  MIN: 'min',
  MAX: 'max'
} as const;

// --- Cull modes ---
export const CULL_MODE = {
  NONE: 'none',
  FRONT: 'front',
  BACK: 'back'
} as const;

// --- Texture filter modes ---
export const FILTER_MODE = {
  NEAREST: 'nearest',
  LINEAR: 'linear'
} as const;

// --- Texture address (wrap) modes ---
export const ADDRESS_MODE = {
  CLAMP_TO_EDGE: 'clamp-to-edge',
  REPEAT: 'repeat',
  MIRROR_REPEAT: 'mirror-repeat'
} as const;

// --- Texture formats ---
export const TEXTURE_FORMAT = {
  R8_UINT: 'r8uint',
  R16_UINT: 'r16uint',
  R32_UINT: 'r32uint',
  R8_SINT: 'r8sint',
  R16_SINT: 'r16sint',
  R32_SINT: 'r32sint',
  R32_FLOAT: 'r32float',
  RGBA8_UNORM: 'rgba8unorm'
} as const;

// --- Depth-stencil attachment formats ---
export const DEPTH_STENCIL_FORMAT = {
  DEPTH24_PLUS: 'depth24plus'
} as const;

// --- Texture usage flags (mirroring luma.gl Texture static fields) ---
export const TEXTURE_USAGE = {
  COPY_SRC: 0x01,
  COPY_DST: 0x02,
  SAMPLE: 0x04,
  RENDER_ATTACHMENT: 0x10
} as const;

// --- Primitive topologies ---
export const TOPOLOGY = {
  TRIANGLE_LIST: 'triangle-list',
  TRIANGLE_STRIP: 'triangle-strip',
  LINE_LIST: 'line-list',
  LINE_STRIP: 'line-strip',
  POINT_LIST: 'point-list'
} as const;

// --- Precomposed parameter sets ---

/**
 * Standard alpha blending: srcAlpha / oneMinusSrcAlpha for both color and alpha.
 * Include `blend: true` since per-layer parameters override global ones in deck.gl 9.
 */
export const BLEND_PARAMS_ALPHA = {
  blend: true,
  blendColorSrcFactor: BLEND_FACTOR.SRC_ALPHA,
  blendColorDstFactor: BLEND_FACTOR.ONE_MINUS_SRC_ALPHA,
  blendAlphaSrcFactor: BLEND_FACTOR.ONE,
  blendAlphaDstFactor: BLEND_FACTOR.ONE_MINUS_SRC_ALPHA,
  blendColorOperation: BLEND_OPERATION.ADD,
  blendAlphaOperation: BLEND_OPERATION.ADD
} as const;

// --- Mapping tables (GL enum name → WebGPU string) used by gl-utils ---

export const GL_BLEND_FUNC_TO_WEBGPU: Record<string, string> = {
  SRC_ALPHA: BLEND_FACTOR.SRC_ALPHA,
  ONE_MINUS_SRC_ALPHA: BLEND_FACTOR.ONE_MINUS_SRC_ALPHA,
  DST_ALPHA: BLEND_FACTOR.DST_ALPHA,
  ONE: BLEND_FACTOR.ONE,
  ONE_MINUS_DST_COLOR: BLEND_FACTOR.ONE_MINUS_DST,
  DST_COLOR: BLEND_FACTOR.DST,
  ZERO: BLEND_FACTOR.ZERO,
  SRC_COLOR: BLEND_FACTOR.SRC
};

export const GL_BLEND_EQ_TO_WEBGPU: Record<string, string> = {
  FUNC_ADD: BLEND_OPERATION.ADD,
  FUNC_SUBTRACT: BLEND_OPERATION.SUBTRACT,
  FUNC_REVERSE_SUBTRACT: BLEND_OPERATION.REVERSE_SUBTRACT
};
