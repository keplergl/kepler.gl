// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * WebGL constants for use in kepler.gl layers.
 * In luma.gl 9.x, @luma.gl/constants was removed.
 * These are standard WebGL constants.
 */

// Blend equations
export const FUNC_ADD = 0x8006;
export const FUNC_SUBTRACT = 0x800a;
export const FUNC_REVERSE_SUBTRACT = 0x800b;
export const MIN = 0x8007;
export const MAX = 0x8008;

// Blend functions
export const ZERO = 0;
export const ONE = 1;
export const SRC_COLOR = 0x0300;
export const ONE_MINUS_SRC_COLOR = 0x0301;
export const SRC_ALPHA = 0x0302;
export const ONE_MINUS_SRC_ALPHA = 0x0303;
export const DST_ALPHA = 0x0304;
export const ONE_MINUS_DST_ALPHA = 0x0305;
export const DST_COLOR = 0x0306;
export const ONE_MINUS_DST_COLOR = 0x0307;
export const SRC_ALPHA_SATURATE = 0x0308;
export const CONSTANT_COLOR = 0x8001;
export const ONE_MINUS_CONSTANT_COLOR = 0x8002;
export const CONSTANT_ALPHA = 0x8003;
export const ONE_MINUS_CONSTANT_ALPHA = 0x8004;

// Enable caps
export const BLEND = 0x0be2;
export const DEPTH_TEST = 0x0b71;
export const CULL_FACE = 0x0b44;
export const STENCIL_TEST = 0x0b90;
export const SCISSOR_TEST = 0x0c11;

// Cull face modes
export const FRONT = 0x0404;
export const BACK = 0x0405;
export const FRONT_AND_BACK = 0x0408;

// Draw modes
export const POINTS = 0x0000;
export const LINES = 0x0001;
export const LINE_LOOP = 0x0002;
export const LINE_STRIP = 0x0003;
export const TRIANGLES = 0x0004;
export const TRIANGLE_STRIP = 0x0005;
export const TRIANGLE_FAN = 0x0006;

// Texture parameters
export const TEXTURE_2D = 0x0de1;
export const TEXTURE_MAG_FILTER = 0x2800;
export const TEXTURE_MIN_FILTER = 0x2801;
export const TEXTURE_WRAP_S = 0x2802;
export const TEXTURE_WRAP_T = 0x2803;
export const LINEAR = 0x2601;
export const NEAREST = 0x2600;
export const CLAMP_TO_EDGE = 0x812f;
export const REPEAT = 0x2901;
export const MIRRORED_REPEAT = 0x8370;

// Data types
export const UNSIGNED_BYTE = 0x1401;
export const UNSIGNED_SHORT = 0x1403;
export const UNSIGNED_INT = 0x1405;
export const FLOAT = 0x1406;

// Pixel formats
export const RGBA = 0x1908;
export const RGB = 0x1907;
export const LUMINANCE = 0x1909;
export const LUMINANCE_ALPHA = 0x190a;
export const RED = 0x1903;
export const RED_INTEGER = 0x8d94;

// Buffer targets
export const ARRAY_BUFFER = 0x8892;
export const ELEMENT_ARRAY_BUFFER = 0x8893;

// WebGL2 internal formats
export const R8UI = 0x8232;
export const R16UI = 0x8234;
export const R32UI = 0x8236;
export const R8I = 0x8231;
export const R16I = 0x8233;
export const R32I = 0x8235;
export const R32F = 0x822e;

// WebGL2 data types
export const BYTE = 0x1400;
export const SHORT = 0x1402;
export const INT = 0x1404;

// Texture filter modes
export const LINEAR_MIPMAP_LINEAR = 0x2703;
export const LINEAR_MIPMAP_NEAREST = 0x2701;
export const NEAREST_MIPMAP_LINEAR = 0x2702;
export const NEAREST_MIPMAP_NEAREST = 0x2700;

// Default export as object for backward compatibility
const GL = {
  FUNC_ADD,
  FUNC_SUBTRACT,
  FUNC_REVERSE_SUBTRACT,
  MIN,
  MAX,
  ZERO,
  ONE,
  SRC_COLOR,
  ONE_MINUS_SRC_COLOR,
  SRC_ALPHA,
  ONE_MINUS_SRC_ALPHA,
  DST_ALPHA,
  ONE_MINUS_DST_ALPHA,
  DST_COLOR,
  ONE_MINUS_DST_COLOR,
  SRC_ALPHA_SATURATE,
  CONSTANT_COLOR,
  ONE_MINUS_CONSTANT_COLOR,
  CONSTANT_ALPHA,
  ONE_MINUS_CONSTANT_ALPHA,
  BLEND,
  DEPTH_TEST,
  CULL_FACE,
  STENCIL_TEST,
  SCISSOR_TEST,
  FRONT,
  BACK,
  FRONT_AND_BACK,
  POINTS,
  LINES,
  LINE_LOOP,
  LINE_STRIP,
  TRIANGLES,
  TRIANGLE_STRIP,
  TRIANGLE_FAN,
  TEXTURE_2D,
  TEXTURE_MAG_FILTER,
  TEXTURE_MIN_FILTER,
  TEXTURE_WRAP_S,
  TEXTURE_WRAP_T,
  LINEAR,
  NEAREST,
  CLAMP_TO_EDGE,
  REPEAT,
  MIRRORED_REPEAT,
  UNSIGNED_BYTE,
  UNSIGNED_SHORT,
  UNSIGNED_INT,
  FLOAT,
  RGBA,
  RGB,
  LUMINANCE,
  LUMINANCE_ALPHA,
  RED,
  RED_INTEGER,
  ARRAY_BUFFER,
  ELEMENT_ARRAY_BUFFER,
  R8UI,
  R16UI,
  R32UI,
  R8I,
  R16I,
  R32I,
  R32F,
  BYTE,
  SHORT,
  INT,
  LINEAR_MIPMAP_LINEAR,
  LINEAR_MIPMAP_NEAREST,
  NEAREST_MIPMAP_LINEAR,
  NEAREST_MIPMAP_NEAREST
};

export default GL;

