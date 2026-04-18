// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {LightingEffect, shadow} from '@deck.gl/core';
import type {Texture} from '@luma.gl/core';
import type {ShaderModule} from '@luma.gl/shadertools';

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

    // In interleaved (MapboxOverlay) mode during video export, deck.gl creates
    // two viewports per frame: 'MapView' and 'mapbox'. loaders.gl's Tileset3D
    // creates separate Tile3D trees per viewport, then merges selected tiles by
    // ID — the last viewport overwrites. Tile3D.updateVisibility sets viewportIds
    // to only the traversing viewport's ID (overwrite, not append) and guards
    // against re-entry within the same frame. The result: some tiles end up with
    // viewportIds=['MapView'] only. Tile3DLayer.filterSubLayer then rejects them
    // when the shadow pass uses viewport 'mapbox'.
    //
    // Fix: before the shadow pass, ensure every tile sub-layer's tile has the
    // shadow pass viewport ID in its viewportIds array.
    if (this.isExportMode) {
      const shadowViewportId = opts.viewports?.[0]?.id;
      if (shadowViewportId && opts.layers) {
        for (const layer of opts.layers) {
          const tile = (layer as any).props?.tile;
          if (
            tile?.viewportIds &&
            tile.selected &&
            !tile.viewportIds.includes(shadowViewportId)
          ) {
            tile.viewportIds.push(shadowViewportId);
          }
        }
      }
    }

    super.preRender(opts);
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
