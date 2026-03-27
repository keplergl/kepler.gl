// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck

import {ShaderAssembler} from '@luma.gl/shadertools';
import type {ShaderModule as LumaShaderModule} from '../webgl/types';

/**
 * UBO-based shader module for raster layer uniforms.
 * Replaces the old standalone `uniform float desaturate` etc.
 */
const rasterUniformBlock = `\
uniform rasterUniforms {
  vec4 bounds;
  float coordinateConversion;
  float desaturate;
  float opacity;
  vec3 tintColor;
  vec4 transparentColor;
} raster;
`;

export const rasterUniforms = {
  name: 'raster',
  vs: rasterUniformBlock,
  fs: rasterUniformBlock,
  uniformTypes: {
    bounds: 'vec4<f32>',
    coordinateConversion: 'f32',
    desaturate: 'f32',
    opacity: 'f32',
    tintColor: 'vec3<f32>',
    transparentColor: 'vec4<f32>'
  }
};

let _hooksRegistered = false;

/**
 * Register custom DECKGL_CREATE_COLOR and DECKGL_MUTATE_COLOR shader hooks
 * with the default ShaderAssembler. These hooks are used by the raster layer's
 * custom shader modules (rgbaImage, combineBands, colormap, etc.).
 *
 * In luma.gl 8.x these were registered via ProgramManager; in luma.gl 9.x
 * we register them with the ShaderAssembler singleton.
 */
export function ensureRasterHooksRegistered(): void {
  if (_hooksRegistered) return;
  _hooksRegistered = true;

  const assembler = ShaderAssembler.getDefaultShaderAssembler();
  // Check if hooks already exist to avoid duplicates
  const existingHooks = assembler._hookFunctions || [];
  const hookNames = existingHooks.map(h => (typeof h === 'string' ? h : h.hook));

  if (!hookNames.some(h => h?.includes('DECKGL_CREATE_COLOR'))) {
    assembler.addShaderHook('fs:DECKGL_CREATE_COLOR(inout vec4 image, vec2 coord)');
  }
  if (!hookNames.some(h => h?.includes('DECKGL_MUTATE_COLOR'))) {
    assembler.addShaderHook('fs:DECKGL_MUTATE_COLOR(inout vec4 image, vec2 coord)');
  }
}

/**
 * Convert kepler.gl's custom raster shader modules into luma.gl 9 compatible
 * format. Ensures fs2 (WebGL2) shaders are used and texture2D -> texture.
 */
export function prepareLumaModules(modules: LumaShaderModule[]): any[] {
  return modules.map(mod => {
    const fs = mod.fs2 || mod.fs || '';
    const result: any = {
      name: mod.name,
      // Replace texture2D with texture for GLSL 300 es
      fs: fs.replace(/texture2D\(/g, 'texture('),
      dependencies: mod.dependencies,
      deprecations: mod.deprecations
    };

    if (mod.vs) {
      result.vs = mod.vs.replace(/texture2D\(/g, 'texture(');
    }

    if (mod.defines) {
      result.defines = mod.defines;
    }

    if (mod.getUniforms) {
      result.getUniforms = mod.getUniforms;
    }

    if (mod.uniforms) {
      result.uniforms = mod.uniforms;
    }

    // Convert inject code, replacing texture2D -> texture
    if (mod.inject) {
      result.inject = {};
      for (const [hook, code] of Object.entries(mod.inject)) {
        const codeStr = typeof code === 'string' ? code : (code as any).injection || '';
        result.inject[hook] = codeStr.replace(/texture2D\(/g, 'texture(');
      }
    }

    return result;
  });
}

/**
 * Build the vertex shader for the raster layer.
 * References raster.coordinateConversion from the UBO.
 */
export function buildRasterVertexShader(): string {
  return `\
#version 300 es
#define SHADER_NAME raster-layer-vertex-shader

precision mediump float;

in vec2 texCoords;
in vec3 positions;
in vec3 positions64Low;

out vec2 vTexCoord;
out vec2 vTexPos;

const vec3 pickingColor = vec3(1.0, 0.0, 0.0);

void main(void) {
  geometry.worldPosition = positions;
  geometry.uv = texCoords;
  geometry.pickingColor = pickingColor;

  gl_Position = project_position_to_clipspace(positions, positions64Low, vec3(0.0), geometry.position);
  DECKGL_FILTER_GL_POSITION(gl_Position, geometry);

  vTexCoord = texCoords;

  if (raster.coordinateConversion < -0.5) {
    vTexPos = geometry.position.xy + project.commonOrigin.xy;
  } else if (raster.coordinateConversion > 0.5) {
    vTexPos = geometry.worldPosition.xy;
  }

  vec4 color = vec4(0.0);
  DECKGL_FILTER_COLOR(color, geometry);
}
`;
}

/**
 * Build the fragment shader for the raster layer.
 * Uses DECKGL_CREATE_COLOR and DECKGL_MUTATE_COLOR hooks which are now
 * registered with the ShaderAssembler and populated by module injections.
 */
export function buildRasterFragmentShader(): string {
  return `\
#version 300 es
#define SHADER_NAME raster-layer-fragment-shader

precision mediump float;
precision mediump int;
precision mediump usampler2D;

in vec2 vTexCoord;
in vec2 vTexPos;

out vec4 fragColor;

/* projection utils */
const float TILE_SIZE = 512.0;
const float PI = 3.1415926536;
const float WORLD_SCALE = TILE_SIZE / PI / 2.0;

vec2 lnglat_to_mercator(vec2 lnglat) {
  float x = lnglat.x;
  float y = clamp(lnglat.y, -89.9, 89.9);
  return vec2(
    radians(x) + PI,
    PI + log(tan(PI * 0.25 + radians(y) * 0.5))
  ) * WORLD_SCALE;
}

vec2 mercator_to_lnglat(vec2 xy) {
  xy /= WORLD_SCALE;
  return degrees(vec2(
    xy.x - PI,
    atan(exp(xy.y - PI)) * 2.0 - PI * 0.5
  ));
}

vec3 color_desaturate(vec3 color) {
  float luminance = (color.r + color.g + color.b) * 0.333333333;
  return mix(color, vec3(luminance), raster.desaturate);
}

vec3 color_tint(vec3 color) {
  return color * raster.tintColor;
}

vec4 apply_opacity(vec3 color, float alpha) {
  if (raster.transparentColor.a == 0.0) {
    return vec4(color, alpha);
  }
  float blendedAlpha = alpha + raster.transparentColor.a * (1.0 - alpha);
  float highLightRatio = alpha / blendedAlpha;
  vec3 blendedRGB = mix(raster.transparentColor.rgb, color, highLightRatio);
  return vec4(blendedRGB, blendedAlpha);
}

vec2 getUV(vec2 pos) {
  return vec2(
    (pos.x - raster.bounds[0]) / (raster.bounds[2] - raster.bounds[0]),
    (pos.y - raster.bounds[3]) / (raster.bounds[1] - raster.bounds[3])
  );
}

void main(void) {
  vec2 uv = vTexCoord;
  if (raster.coordinateConversion < -0.5) {
    vec2 lnglat = mercator_to_lnglat(vTexPos);
    uv = getUV(lnglat);
  } else if (raster.coordinateConversion > 0.5) {
    vec2 commonPos = lnglat_to_mercator(vTexPos);
    uv = getUV(commonPos);
  }

  vec4 image = vec4(0.0);
  DECKGL_CREATE_COLOR(image, uv);

  DECKGL_MUTATE_COLOR(image, uv);

  fragColor = apply_opacity(color_tint(color_desaturate(image.rgb)), raster.opacity);

  geometry.uv = uv;
  DECKGL_FILTER_COLOR(fragColor, geometry);
}
`;
}
