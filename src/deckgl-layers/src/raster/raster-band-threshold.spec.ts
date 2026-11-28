// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {assembleGLSLShaderPair, resolveShaderPlugins, type ShaderModule} from '@luma.gl/shaders';
import {spawnSync} from 'child_process';
import {prepareLumaModules} from './raster-layer/raster-layer-shaders';
import {rasterProcessingUniforms} from './raster-processing-uniforms';
import {applyModuleUniforms} from './util';
import {
  combineBandsFloat,
  combineBandsInt,
  combineBandsUint,
  maskUint,
  rawBandThreshold
} from './webgl';

const platformInfo = {
  type: 'webgl' as const,
  shaderLanguage: 'glsl' as const,
  shaderLanguageVersion: 300 as const,
  gpu: 'test',
  features: new Set<string>()
};

function assemble(enabled: boolean, combineBands = combineBandsFloat) {
  const plugins = resolveShaderPlugins(
    prepareLumaModules([combineBands, ...(enabled ? [rawBandThreshold] : [])]),
    'glsl'
  );
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
    modules: [rasterProcessingUniforms as ShaderModule, ...plugins.modules],
    defines: plugins.defines,
    pluginInjections: plugins.injections,
    injectionTargets: [
      ...plugins.injectionTargets,
      {
        name: 'DECKGL_CREATE_COLOR',
        stage: 'fragment',
        glsl: {parameters: 'inout vec4 image, vec2 coord'}
      }
    ]
  });
}

test('GPU threshold opt-in enables the full-precision comparison and shares the raster UBO', () => {
  const enabled = assemble(true).fs;
  expect(enabled.indexOf('#define KEPLER_RAW_BAND_THRESHOLD 1')).toBeGreaterThan(-1);
  expect(enabled.indexOf('#define KEPLER_RAW_BAND_THRESHOLD 1')).toBeLessThan(
    enabled.indexOf('#ifdef KEPLER_RAW_BAND_THRESHOLD')
  );
  expect(enabled).toContain('uniform rasterProcessingUniforms');
  expect(enabled).not.toContain('uniform rawBandThresholdUniforms');
  expect(assemble(false).fs).not.toContain('#define KEPLER_RAW_BAND_THRESHOLD 1');

  const shader = {moduleUniforms: {}, moduleBindings: {}};
  applyModuleUniforms(shader, [rawBandThreshold, maskUint], {
    rawBandMaximum: 1.8,
    rawBandChannel: 2
  });
  expect(shader.moduleUniforms).toEqual({
    rasterProcessing: {rawBandThreshold_maximum: 1.8, rawBandThreshold_channel: 2}
  });
});

test.each([combineBandsFloat, combineBandsUint, combineBandsInt])(
  '$name compiles and links in WebGL2 with the cutoff enabled and disabled',
  combineBands => {
    // Match the point-layer shader tests: isolate native GL cleanup from Jest's GC.
    const result = spawnSync(
      process.execPath,
      [
        '-e',
        `
          const sources = JSON.parse(require('fs').readFileSync(0, 'utf8'));
          const gl = require('gl')(1, 1, {createWebGL2Context: true});
          if (!gl) throw new Error('Could not create a WebGL2 context');
          try {
            for (const {vs, fs} of sources) {
              const program = gl.createProgram();
              if (!program) throw new Error('Could not create a WebGL program');
              try {
                for (const [type, source] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]]) {
                  const shader = gl.createShader(type);
                  if (!shader) throw new Error('Could not create a WebGL shader');
                  try {
                    gl.shaderSource(shader, source);
                    gl.compileShader(shader);
                    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                      throw new Error(gl.getShaderInfoLog(shader) || 'Shader compilation failed');
                    }
                    gl.attachShader(program, shader);
                  } finally {
                    gl.deleteShader(shader);
                  }
                }
                gl.linkProgram(program);
                if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                  throw new Error(gl.getProgramInfoLog(program) || 'Shader linking failed');
                }
              } finally {
                gl.deleteProgram(program);
              }
            }
            process.stdout.write(String(sources.length));
          } finally {
            gl.getExtension('STACKGL_destroy_context').destroy();
          }
        `
      ],
      {
        input: JSON.stringify([assemble(true, combineBands), assemble(false, combineBands)]),
        encoding: 'utf8',
        timeout: 30000
      }
    );
    expect({status: result.status, stderr: result.stderr, error: result.error}).toEqual({
      status: 0,
      stderr: '',
      error: undefined
    });
    expect(result.stdout.trim()).toBe('2');
  }
);
