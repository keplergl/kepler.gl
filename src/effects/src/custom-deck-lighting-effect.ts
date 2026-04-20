// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {LightingEffect, shadow} from '@deck.gl/core';
import type {Texture} from '@luma.gl/core';
import type {ShaderModule} from '@luma.gl/shadertools';
import {EDITOR_LAYER_ID} from '@kepler.gl/constants';
import {patchTileViewportIds} from './tile-viewport-fix';

/**
 * Exposes private members of LightingEffect that we need to access.
 * These are runtime-accessible but TypeScript marks them as private.
 */
interface LightingEffectPrivate {
  shadow: boolean;
  shadowPasses: {delete(): void; render(params: Record<string, unknown>): void}[];
  dummyShadowMap: Texture | null;
  _createShadowPasses(device: unknown): void;
}

/** Extended shadow module props with our custom field. */
interface CustomShadowProps {
  outputUniformShadow?: boolean;
  dummyShadowMap?: Texture | null;
  [key: string]: unknown;
}

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
 *
 * Also fixes the vertex injection to be a no-op when shadows are disabled,
 * preventing position corruption in billboard layers (e.g. the editor layer).
 */
function createCustomShadowModule(): ShaderModule | null {
  if (!shadow) return null;

  const mod = {...shadow} as Record<string, any>;

  const uboField = '  float outputUniformShadow;\n';
  mod.vs = insertBefore(mod.vs, '} shadow;', uboField);
  mod.fs = insertBefore(mod.fs, '} shadow;', uboField);

  mod.fs = insertBefore(
    mod.fs,
    'vec4 rgbaDepth = texture(shadowMap, position.xy);',
    'if (shadow.outputUniformShadow > 0.5) return 1.0;\n  '
  );

  // Fix: guard the vertex injection so it's a no-op when shadows are disabled.
  // The original `return gl_Position` in shadow_setVertexPosition is incorrect
  // for billboard layers where gl_Position isn't yet assigned when the
  // DECKGL_FILTER_GL_POSITION hook fires.
  if (mod.inject) {
    mod.inject = {...mod.inject};
    mod.inject['vs:DECKGL_FILTER_GL_POSITION'] = `
    if (shadow.drawShadowMap || shadow.useShadowMap) {
      position = shadow_setVertexPosition(geometry.position);
    }
    `;
  }

  mod.uniformTypes = {
    ...shadow.uniformTypes,
    outputUniformShadow: 'f32'
  };

  const originalGetUniforms = shadow.getUniforms as (
    opts: Record<string, unknown>,
    prevUniforms: Record<string, unknown>
  ) => Record<string, unknown>;
  mod.getUniforms = (opts: CustomShadowProps = {}, context = {}) => {
    const u = originalGetUniforms(opts, context);
    u.outputUniformShadow = opts.outputUniformShadow ? 1.0 : 0.0;
    return u;
  };

  return mod as unknown as ShaderModule;
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
  isExportMode: boolean;

  private get _private(): LightingEffectPrivate {
    return this as unknown as LightingEffectPrivate;
  }

  constructor(props) {
    super(props);
    this.outputUniformShadow = false;
    this.isExportMode = false;
  }

  setup(context) {
    this.context = context;
    const {device, deck} = context;
    if (this._private.shadow && !this._private.dummyShadowMap) {
      this._private._createShadowPasses(device);
      deck._addDefaultShaderModule(CustomShadowModule || shadow);
      this._private.dummyShadowMap = device.createTexture({width: 1, height: 1});
    }
  }

  preRender(opts) {
    if (!this._private.shadow) return;

    let unpatch: (() => void) | undefined;
    if (this.isExportMode) {
      unpatch = patchTileViewportIds(opts);
    }

    super.preRender(opts);

    unpatch?.();
  }

  cleanup(context) {
    for (const shadowPass of this._private.shadowPasses) {
      shadowPass.delete();
    }
    this._private.shadowPasses.length = 0;
    if (this._private.dummyShadowMap) {
      this._private.dummyShadowMap.destroy();
      this._private.dummyShadowMap = null;
      context.deck._removeDefaultShaderModule(CustomShadowModule || shadow);
    }
  }

  getShaderModuleProps(layer, otherShaderModuleProps) {
    // Skip lighting/shadow for the editor layer and its sublayers.
    // These are 2D overlays that should not be affected by lighting effects.
    if (layer.id.startsWith(EDITOR_LAYER_ID)) {
      return {
        shadow: {
          shadowEnabled: false,
          dummyShadowMap: this._private.dummyShadowMap
        },
        lighting: {enabled: false},
        phongMaterial: null,
        gouraudMaterial: null
      } as unknown as ReturnType<LightingEffect['getShaderModuleProps']>;
    }

    const props = super.getShaderModuleProps(layer, otherShaderModuleProps);

    if (
      props.shadow &&
      !(props.shadow as CustomShadowProps).dummyShadowMap &&
      this._private.dummyShadowMap
    ) {
      (props.shadow as CustomShadowProps).dummyShadowMap = this._private.dummyShadowMap;
    }

    if (props.shadow) {
      (props.shadow as CustomShadowProps).outputUniformShadow = this.outputUniformShadow;
    }

    return props;
  }
}

export default CustomDeckLightingEffect;
