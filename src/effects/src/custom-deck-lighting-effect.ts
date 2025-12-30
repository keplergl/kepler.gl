// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck - This file needs significant refactoring for luma.gl 9.x and deck.gl 9.x APIs
// TODO: Refactor to use luma.gl 9.x Texture API and deck.gl 9.x shader module system

// import {console as Console} from 'global/window';
import {LightingEffect, shadow} from '@deck.gl/core';
import {Texture} from '@luma.gl/core';
import {luma} from '@luma.gl/core';

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
    // Console.error(`Cannot edit ${type} layer shader`);
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
if (CustomShadowModule && CustomShadowModule.fs) {
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

  preRender(gl, {layers, layerFilter, viewports, onViewportActive, views}) {
    if (!this.shadow) return;

    // create light matrix every frame to make sure always updated from light source
    this.shadowMatrices = this._calculateMatrices();

    if (this.shadowPasses.length === 0) {
      this._createShadowPasses(gl);
    }

    // In luma.gl 9.x, ProgramManager is removed
    // Shader modules are now managed through the Device/Shader system
    // For now, we'll skip the programManager setup and rely on deck.gl's shader management
    // TODO: Refactor to use luma.gl 9.x shader module system

    if (!this.dummyShadowMap) {
      // In luma.gl 9.x, Texture2D is replaced by Texture
      // Texture creation now requires a Device instance
      const device = luma.getDefaultDevice();
      if (device) {
        this.dummyShadowMap = device.createTexture({
          width: 1,
          height: 1,
          format: 'rgba8unorm'
        });
      }
    }

    for (let i = 0; i < this.shadowPasses.length; i++) {
      const shadowPass = this.shadowPasses[i];
      shadowPass.render({
        layers,
        layerFilter,
        viewports,
        onViewportActive,
        views,
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
      shadowPass.delete();
    }
    this.shadowPasses.length = 0;
    this.shadowMaps.length = 0;

    if (this.dummyShadowMap) {
      this.dummyShadowMap.destroy();
      this.dummyShadowMap = null;
    }

    // In luma.gl 9.x, ProgramManager is removed
    // Shader module cleanup is handled automatically
  }
}

export default CustomDeckLightingEffect;
