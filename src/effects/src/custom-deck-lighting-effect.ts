// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck

import {LightingEffect} from '@deck.gl/core';

/**
 * Custom LightingEffect for kepler.gl.
 *
 * This is a thin wrapper around deck.gl's LightingEffect. The original
 * deck.gl 8 version patched the shadow shader module with custom GLSL,
 * but that approach doesn't work with deck.gl 9's UBO-based shadow module.
 *
 * We override getShaderModuleProps to always include dummyShadowMap in
 * the shadow props, even when shadows are disabled. This prevents "Bad
 * texture binding" errors: the shadow module's createShadowUniforms needs
 * a valid texture for shadow_uShadowMap0/1 bindings, and without
 * dummyShadowMap it would set them to undefined.
 */
class CustomDeckLightingEffect extends LightingEffect {
  useOutputUniformShadow: boolean;

  constructor(props) {
    super(props);
    this.useOutputUniformShadow = false;
  }

  getShaderModuleProps(layer, otherShaderModuleProps) {
    const props = super.getShaderModuleProps(layer, otherShaderModuleProps);

    // When shadow is disabled, the parent returns shadow: {} without
    // dummyShadowMap. The shadow module's getUniforms then sets
    // shadow_uShadowMap0/1 to undefined, causing texture binding errors.
    // Always provide the dummy texture so bindings remain valid.
    if (props.shadow && !props.shadow.dummyShadowMap && this.dummyShadowMap) {
      props.shadow.dummyShadowMap = this.dummyShadowMap;
    }

    return props;
  }
}

export default CustomDeckLightingEffect;
