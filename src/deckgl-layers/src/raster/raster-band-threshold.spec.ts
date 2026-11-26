// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {assembleGLSLShaderPair, type ShaderModule} from '@luma.gl/shadertools';
import {prepareLumaModules} from './raster-layer/raster-layer-shaders';
import {rasterProcessingUniforms} from './raster-processing-uniforms';
import {applyModuleUniforms} from './util';
import {combineBandsFloat, maskUint, rawBandThreshold} from './webgl';

const platformInfo = {
  type: 'webgl' as const,
  shaderLanguage: 'glsl' as const,
  shaderLanguageVersion: 300 as const,
  gpu: 'test',
  features: new Set<string>()
};

function assemble(enabled: boolean) {
  return assembleGLSLShaderPair({
    platformInfo,
    vs: '#version 300 es\nvoid main() {gl_Position = vec4(0.0);}',
    fs: `#version 300 es
      precision mediump float;
      out vec4 fragColor;
      void main() {
        vec4 image = vec4(0.0);
        DECKGL_CREATE_COLOR(image, vec2(0.5));
        fragColor = image;
      }`,
    modules: [
      rasterProcessingUniforms,
      // Assembly only consumes source and defines, not the raster uniform adapter.
      ...(prepareLumaModules([
        combineBandsFloat,
        ...(enabled ? [rawBandThreshold] : [])
      ]) as ShaderModule[])
    ],
    hookFunctions: ['fs:DECKGL_CREATE_COLOR(inout vec4 image, vec2 coord)']
  }).fs;
}

test('GPU threshold opt-in enables the full-precision comparison and shares the raster UBO', () => {
  const enabled = assemble(true);
  expect(enabled.indexOf('#define KEPLER_RAW_BAND_THRESHOLD 1')).toBeGreaterThan(-1);
  expect(enabled.indexOf('#define KEPLER_RAW_BAND_THRESHOLD 1')).toBeLessThan(
    enabled.indexOf('#ifdef KEPLER_RAW_BAND_THRESHOLD')
  );
  expect(enabled).toContain('uniform rasterProcessingUniforms');
  expect(enabled).not.toContain('uniform rawBandThresholdUniforms');
  expect(assemble(false)).not.toContain('#define KEPLER_RAW_BAND_THRESHOLD 1');

  const shader = {moduleUniforms: {}, moduleBindings: {}};
  applyModuleUniforms(shader, [rawBandThreshold, maskUint], {
    rawBandMaximum: 1.8,
    rawBandChannel: 2
  });
  expect(shader.moduleUniforms).toEqual({
    rasterProcessing: {rawBandThreshold_maximum: 1.8, rawBandThreshold_channel: 2}
  });
});
