// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck

import {LightingEffect, shadow} from '@deck.gl/core';

/**
 * Insert text before a target string in shader source.
 */
function insertBefore(source: string, target: string, textToInsert: string): string {
  const at = source.indexOf(target);
  if (at < 0) return source;
  return source.slice(0, at) + textToInsert + source.slice(at);
}

/**
 * Create a patched shadow module that adds `outputUniformShadow` to the
 * shadow UBO. When true, `shadow_getShadowWeight` returns 1.0 (full
 * uniform shadow) instead of sampling the shadow map. Used for nighttime
 * rendering to avoid partial shadows from below.
 */
function createCustomShadowModule() {
  if (!shadow) return null;

  const mod = {...shadow};

  // Add outputUniformShadow to the UBO block (present in both vs and fs)
  const uboField = '  bool outputUniformShadow;\n';
  mod.vs = insertBefore(mod.vs, '} shadow;', uboField);
  mod.fs = insertBefore(mod.fs, '} shadow;', uboField);

  // Early return in shadow_getShadowWeight when outputUniformShadow is set
  mod.fs = insertBefore(
    mod.fs,
    'vec4 rgbaDepth = texture(shadowMap, position.xy);',
    'if (shadow.outputUniformShadow) return 1.0;\n  '
  );

  mod.uniformTypes = {
    ...shadow.uniformTypes,
    outputUniformShadow: 'f32'
  };

  // Wrap getUniforms to include outputUniformShadow in the UBO
  const originalGetUniforms = shadow.getUniforms;
  mod.getUniforms = (opts = {}, context = {}) => {
    const u = originalGetUniforms(opts, context);
    if (opts.outputUniformShadow !== undefined) {
      u.outputUniformShadow = opts.outputUniformShadow;
    } else {
      u.outputUniformShadow = false;
    }
    return u;
  };

  return mod;
}

const CustomShadowModule = createCustomShadowModule();

/**
 * Custom LightingEffect for kepler.gl.
 *
 * Extends deck.gl's LightingEffect with:
 * - A patched shadow module with `outputUniformShadow` for uniform shadow
 *   during nighttime (avoids partial shadows from below).
 * - getShaderModuleProps override that always provides dummyShadowMap
 *   to prevent "Bad texture binding" errors when shadows are disabled.
 */
class CustomDeckLightingEffect extends LightingEffect {
  outputUniformShadow: boolean;

  constructor(props) {
    super(props);
    this.outputUniformShadow = false;
  }

  setup(context) {
    this.context = context;
    const {device, deck} = context;
    if (this.shadow && !this.dummyShadowMap) {
      this._createShadowPasses(device);
      deck._addDefaultShaderModule(CustomShadowModule || shadow);
      this.dummyShadowMap = device.createTexture({width: 1, height: 1});
    }
  }

  cleanup(context) {
    for (const shadowPass of this.shadowPasses) {
      shadowPass.delete();
    }
    this.shadowPasses.length = 0;
    if (this.dummyShadowMap) {
      this.dummyShadowMap.destroy();
      this.dummyShadowMap = null;
      context.deck._removeDefaultShaderModule(CustomShadowModule || shadow);
    }
  }

  getShaderModuleProps(layer, otherShaderModuleProps) {
    const props = super.getShaderModuleProps(layer, otherShaderModuleProps);

    // Always provide dummyShadowMap so texture bindings are never undefined.
    // Prevents "Bad texture binding" errors in composite layer sublayers
    // when shadows are disabled.
    if (props.shadow && !props.shadow.dummyShadowMap && this.dummyShadowMap) {
      props.shadow.dummyShadowMap = this.dummyShadowMap;
    }

    // Pass outputUniformShadow through to the custom shadow module
    if (props.shadow) {
      props.shadow.outputUniformShadow = this.outputUniformShadow;
    }

    return props;
  }
}

export default CustomDeckLightingEffect;
