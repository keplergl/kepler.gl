// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck This is a hack, don't check types

import {LightingEffect, shadow} from '@deck.gl/core';

/**
 * Inserts shader code before detected part.
 * @param {string} vs Original shader code.
 * @param {string} type Debug string.
 * @param {string} insertBeforeText Text chunk to insert before.
 * @param {string} textToInsert Text to insert.
 * @returns Modified shader code.
 */
export function insertBefore(vs, type, insertBeforeText, textToInsert) {
  const at = vs.indexOf(insertBeforeText);
  if (at < 0) {
    return vs;
  }

  return vs.slice(0, at) + textToInsert + vs.slice(at);
}

const CustomShadowModule = shadow ? {...shadow} : undefined;

/**
 * Custom shadow module
 * 1) Add u_outputUniformShadow uniform
 * 2) always produce full shadow when the uniform is set to true.
 */
if (CustomShadowModule?.fs) {
  CustomShadowModule.fs = insertBefore(
    CustomShadowModule.fs,
    'custom shadow #1',
    'uniform vec4 shadow_uColor;',
    'uniform bool u_outputUniformShadow;'
  );

  CustomShadowModule.fs = insertBefore(
    CustomShadowModule.fs,
    'custom shadow #1',
    'vec4 rgbaDepth = texture2D(shadowMap, position.xy);',
    'if(u_outputUniformShadow) return 1.0;'
  );
}

if (CustomShadowModule) {
  CustomShadowModule.getUniforms = (opts = {}, context = {}) => {
    const u = shadow.getUniforms(opts, context);
    if (opts.outputUniformShadow !== undefined) {
      u.u_outputUniformShadow = opts.outputUniformShadow;
    }
    return u;
  };
}

/**
 * Custom LightingEffect
 * 1) adds CustomShadowModule
 * 2) pass outputUniformShadow as module parameters
 * 3) properly removes CustomShadowModule
 */
class CustomDeckLightingEffect extends LightingEffect {
  constructor(props) {
    super(props);
    this.useOutputUniformShadow = false;
  }

  preRender(context) {
    if (!this.shadow) return;

    // In deck.gl 9.x, preRender receives a context object instead of positional args
    const device = context?.device;

    this.shadowMatrices = this._calculateMatrices();

    if (this.shadowPasses.length === 0) {
      this._createShadowPasses(device);
    }

    if (!this.dummyShadowMap && device) {
      this.dummyShadowMap = device.createTexture({
        width: 1,
        height: 1
      });
    }

    for (let i = 0; i < this.shadowPasses.length; i++) {
      const shadowPass = this.shadowPasses[i];
      shadowPass.render({
        layers: context.layers,
        layerFilter: context.layerFilter,
        viewports: context.viewports,
        onViewportActive: context.onViewportActive,
        views: context.views,
        moduleParameters: {
          shadowLightId: i,
          dummyShadowMap: this.dummyShadowMap,
          shadowMatrices: this.shadowMatrices,
          useOutputUniformShadow: false
        }
      });
    }
  }

  getModuleParameters(layer) {
    const parameters = super.getModuleParameters(layer);
    parameters.outputUniformShadow = this.outputUniformShadow;
    return parameters;
  }

  cleanup() {
    for (const shadowPass of this.shadowPasses) {
      shadowPass.delete?.() || shadowPass.destroy?.();
    }
    this.shadowPasses.length = 0;
    this.shadowMaps.length = 0;

    if (this.dummyShadowMap) {
      this.dummyShadowMap.delete?.() || this.dummyShadowMap.destroy?.();
      this.dummyShadowMap = null;
    }

    if (this.shadow && this.programManager) {
      this.programManager.removeDefaultModule?.(CustomShadowModule);
      this.programManager = null;
    }
  }
}

export default CustomDeckLightingEffect;
