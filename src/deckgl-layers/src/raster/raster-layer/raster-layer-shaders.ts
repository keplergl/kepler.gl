// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ShaderAssembler} from '@luma.gl/shadertools';
import type {ShaderModule as LumaShaderModule} from '../webgl/types';
import {UNIFORM_NAME_MAP} from '../raster-processing-uniforms';

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

/**
 * Register custom DECKGL_CREATE_COLOR and DECKGL_MUTATE_COLOR shader hooks
 * with the default ShaderAssembler. These hooks are used by the raster layer's
 * custom shader modules (rgbaImage, combineBands, colormap, etc.).
 *
 * In luma.gl 8.x these were registered via ProgramManager; in luma.gl 9.x
 * we register them with the ShaderAssembler singleton.
 *
 * NOTE: We must check the assembler's hook list every time rather than using
 * a module-level boolean guard, because deck.gl's getShaderAssembler() clears
 * _hookFunctions when a new Deck instance is created (e.g. during image export).
 */
export function ensureRasterHooksRegistered(): void {
  const assembler = ShaderAssembler.getDefaultShaderAssembler();
  // @ts-expect-error _hookFunctions is private in ShaderAssembler
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
interface LumaModuleOutput {
  name: string;
  fs: string;
  vs?: string;
  defines?: Record<string, string>;
  getUniforms?: (opts: object) => Record<string, unknown> | null;
  uniforms?: Record<string, unknown>;
  uniformTypes?: Record<string, string>;
  inject?: Record<string, string>;
  dependencies?: unknown[];
  deprecations?: unknown[];
}

export function prepareLumaModules(modules: LumaShaderModule[]): LumaModuleOutput[] {
  return modules.map(mod => {
    let fs = mod.fs2 || mod.fs || '';
    // Replace texture2D with texture for GLSL 300 es
    fs = fs.replace(/texture2D\(/g, 'texture(');

    const nameMap = UNIFORM_NAME_MAP[mod.name];
    const consolidate = Boolean(nameMap && mod.uniformTypes);

    if (consolidate) {
      // Strip the per-module uniform block declaration so it doesn't create
      // its own UBO.  Matches: uniform <name>Uniforms { ... } <name>;
      fs = fs.replace(/uniform\s+\w+Uniforms\s*\{[^}]*\}\s*\w+\s*;/gs, '');

      // Rewrite moduleName.fieldName references to the shared UBO aliases
      for (const [origField, prefixedField] of Object.entries(nameMap)) {
        const pattern = new RegExp(`\\b${mod.name}\\.${origField}\\b`, 'g');
        fs = fs.replace(pattern, `${prefixedField}_ALIAS`);
      }
    }

    const result: LumaModuleOutput = {
      name: mod.name,
      fs,
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

    // Only keep uniformTypes for modules NOT consolidated into the shared UBO
    if (mod.uniformTypes && !consolidate) {
      result.uniformTypes = mod.uniformTypes;
    }

    // Convert inject code, replacing texture2D -> texture and UBO references
    if (mod.inject) {
      result.inject = {};
      for (const [hook, code] of Object.entries(mod.inject)) {
        let codeStr =
          typeof code === 'string' ? code : (code as {injection?: string}).injection || '';
        codeStr = codeStr.replace(/texture2D\(/g, 'texture(');

        if (consolidate && nameMap) {
          for (const [origField, prefixedField] of Object.entries(nameMap)) {
            const pattern = new RegExp(`\\b${mod.name}\\.${origField}\\b`, 'g');
            codeStr = codeStr.replace(pattern, `${prefixedField}_ALIAS`);
          }
        }

        result.inject[hook] = codeStr;
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
