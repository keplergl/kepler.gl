// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Maximum number of iso-levels supported.
 * Determines the size of the 1-D data textures created in IsolineTriangleLayer.
 */
export const MAX_ISOLINE_LEVELS = 16;

/**
 * Fragment shader for the isoline layer.
 *
 * Per-level data (thresholds and colors) is passed via 1-D textures rather
 * than uniform arrays because luma.gl 9's uniform-block reflection system
 * does not support GLSL `float arr[N]` array declarations — it requires one
 * named field per element. Textures side-step that limitation entirely.
 *
 * Textures (bound as uniform samplers, NOT inside the UBO):
 *   levelsTexture      – MAX_LEVELS×1 R32F: normalised threshold [0..1] per level
 *   bandColorsTexture  – MAX_LEVELS×1 RGBA32F: fill color for band above each level
 *   lineColorsTexture  – MAX_LEVELS×1 RGBA32F: stroke color for each level line
 *
 * UBO (isolineUniforms) — scalar fields only:
 *   levelCount   – int, number of active levels
 *   showFill     – 1.0 = render filled iso-bands
 *   showLines    – 1.0 = render isoline strokes
 *   lineWidthPx  – stroke half-width in texel units
 *
 * The vertex shader is the stock deck.gl TriangleLayer vertex shader, which
 * sets up `vTexCoords`, `vIntensityMin`, and `vIntensityMax`.
 */

export const ISOLINE_UNIFORM_BLOCK = `\
layout(std140) uniform isolineUniforms {
  int   levelCount;
  float showFill;
  float showLines;
  float lineWidthPx;
} isoline;
`;

export const isolineShaderModule = {
  name: 'isoline',
  vs: '',  // VS does not use isoline uniforms — only inject into FS to avoid link precision mismatch
  fs: ISOLINE_UNIFORM_BLOCK,
  uniformTypes: {
    levelCount: 'i32',
    showFill: 'f32',
    showLines: 'f32',
    lineWidthPx: 'f32'
  }
} as any;

export const isolineFragmentShader = `\
#version 300 es
#define SHADER_NAME isoline-layer-fragment-shader
#define MAX_LEVELS ${MAX_ISOLINE_LEVELS}

precision highp float;

// Per-level data textures (MAX_LEVELS×1) — bound as regular samplers,
// NOT inside the UBO. The isolineUniforms block is injected by the module.
uniform sampler2D weightsTexture;
uniform sampler2D maxTexture;
uniform sampler2D levelsTexture;
uniform sampler2D bandColorsTexture;
uniform sampler2D lineColorsTexture;

in vec2 vTexCoords;
in float vIntensityMin;
in float vIntensityMax;

out vec4 fragColor;

float sampleWeight(vec2 uv) {
  float w = texture(weightsTexture, uv).r;
  return clamp(w * vIntensityMax, 0.0, 1.0);
}

float levelAt(int i) {
  float u = (float(i) + 0.5) / float(MAX_LEVELS);
  return texture(levelsTexture, vec2(u, 0.5)).r;
}

void main(void) {
  float w = sampleWeight(vTexCoords);

  // ---- find which band this fragment belongs to -----------------------
  int band = 0;
  for (int i = 0; i < MAX_LEVELS; i++) {
    if (i >= isoline.levelCount) break;
    if (w >= levelAt(i)) band = i + 1;
  }

  // ---- fill color -----------------------------------------------------
  vec4 fillColor = vec4(0.0);
  if (isoline.showFill > 0.5 && band > 0) {
    float u = (float(band - 1) + 0.5) / float(MAX_LEVELS);
    fillColor = texture(bandColorsTexture, vec2(u, 0.5));
  }

  // ---- isoline edge detection (finite-difference) --------------------
  vec4 lineColor = vec4(0.0);
  if (isoline.showLines > 0.5 && isoline.levelCount > 0) {
    // texelSize: UV change per 1 CSS pixel (via hardware derivatives).
    vec2 texelSize = vec2(abs(dFdx(vTexCoords.x)), abs(dFdy(vTexCoords.y)));
    // Half-width in UV space: lineWidthPx / 2 pixels from the isoline centre.
    float hw = max(0.5, isoline.lineWidthPx) * 0.5;
    vec2 dx = vec2(texelSize.x * hw, 0.0);
    vec2 dy = vec2(0.0, texelSize.y * hw);

    float wR = sampleWeight(vTexCoords + dx);
    float wL = sampleWeight(vTexCoords - dx);
    float wU = sampleWeight(vTexCoords + dy);
    float wD = sampleWeight(vTexCoords - dy);

    for (int i = 0; i < MAX_LEVELS; i++) {
      if (i >= isoline.levelCount) break;
      float lvl = levelAt(i);
      bool crossing = (w >= lvl) != (wR >= lvl)
                   || (w >= lvl) != (wL >= lvl)
                   || (w >= lvl) != (wU >= lvl)
                   || (w >= lvl) != (wD >= lvl);
      if (crossing) {
        // Estimate sub-pixel distance to the level threshold in UV units,
        // then convert to pixels for a consistent smooth edge.
        vec2 grad = vec2(wR - wL, wU - wD); // gradient in UV space (sampled ±hw px)
        // grad magnitude per UV unit → divide by sample step (hw pixels) to get
        // gradient in weight-units-per-pixel.
        vec2 gradPx = grad / (texelSize * hw);
        float gradLen = length(gradPx);                // weight units per pixel
        // distance from level in pixels
        float distPx = gradLen > 1e-6 ? abs(w - lvl) / gradLen : 0.0;
        float alpha = 1.0 - smoothstep(hw - 0.5, hw + 0.5, distPx);
        float u = (float(i) + 0.5) / float(MAX_LEVELS);
        vec4 lc = texture(lineColorsTexture, vec2(u, 0.5));
        float a = lc.a * alpha;
        lineColor = mix(lineColor, vec4(lc.rgb, a), a);
        break;
      }
    }
  }

  // ---- discard empty fragments ----------------------------------------
  if (band == 0 && lineColor.a < 0.01) {
    discard;
  }

  // ---- composite: lines on top of fill --------------------------------
  vec4 result = fillColor;
  if (lineColor.a > 0.0) {
    result = mix(result, lineColor, lineColor.a);
  }
  fragColor = result;
}
`;
