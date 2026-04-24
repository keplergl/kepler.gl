// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {LightingEffect, shadow} from '@deck.gl/core';
import type {Texture} from '@luma.gl/core';
import type {ShaderModule} from '@luma.gl/shadertools';
import {EDITOR_LAYER_ID} from '@kepler.gl/constants';
import {patchTileViewportIds} from './tile-viewport-fix';

// A plain LightingEffect() — its constructor calls _applyDefaultLights()
// which populates the same default lights that deck.gl's EffectManager
// uses internally. This is used to restore the original shading.
const DEFAULT_LIGHTING_EFFECT = new LightingEffect();

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
  useSimplePhong?: boolean;
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
 * Create a patched shadow module that adds:
 * - `outputUniformShadow`: when true, shadow_getShadowWeight returns 1.0
 *   (full uniform shadow) instead of sampling the shadow map.
 * - `useSimplePhong`: when true, replaces PBR lighting with simple
 *   Lambertian diffuse (ambient + NdotL) for 3D tile layers, avoiding
 *   the PBR microfacet specular artifacts on flat surfaces.
 *
 * Also fixes the vertex injection to be a no-op when shadows are disabled,
 * preventing position corruption in billboard layers (e.g. the editor layer).
 */
function createCustomShadowModule(): ShaderModule | null {
  if (!shadow) return null;

  const mod = {...shadow} as Record<string, any>;

  const uboField = '  float outputUniformShadow;\n  float useSimplePhong;\n';
  mod.vs = insertBefore(mod.vs, '} shadow;', uboField);
  mod.fs = insertBefore(mod.fs, '} shadow;', uboField);

  // Add a varying to carry the common-space position for simple phong normals.
  mod.vs = 'out vec3 custom_vWorldPos;\n' + mod.vs;
  mod.fs = 'in vec3 custom_vWorldPos;\n' + mod.fs;

  mod.fs = insertBefore(
    mod.fs,
    'vec4 rgbaDepth = texture(shadowMap, position.xy);',
    'if (shadow.outputUniformShadow > 0.5) return 1.0;\n  '
  );

  // Patch the VS so the fallback returns the caller's position instead of
  // gl_Position (which is uninitialised when the hook fires in billboard
  // layers like PathLayer / the editor polygon tool).
  mod.vs = mod.vs
    .replace(
      'vec4 shadow_setVertexPosition(vec4 position_commonspace)',
      'vec4 shadow_setVertexPosition(vec4 position_commonspace, vec4 currentPosition)'
    )
    .replace(
      /return gl_Position;\s*\}/,
      'return currentPosition;\n}'
    );

  mod.inject = {
    ...shadow.inject,
    'vs:DECKGL_FILTER_GL_POSITION': `
    position = shadow_setVertexPosition(geometry.position, position);
    custom_vWorldPos = geometry.position.xyz;
    `,
    'fs:DECKGL_FILTER_COLOR': `
    #ifdef LIGHTING_FRAGMENT
    if (shadow.useSimplePhong > 0.5) {
      vec3 spDx = dFdx(custom_vWorldPos);
      vec3 spDy = dFdy(custom_vWorldPos);
      vec3 spN = normalize(cross(spDx, spDy));
      vec3 spLit = lighting.ambientColor;
      for (int i = 0; i < 3; i++) {
        if (i >= lighting.directionalLightCount) break;
        vec3 spDir = lighting_getDirectionalLight(i).direction;
        float spNdotL = max(dot(spN, -normalize(spDir)), 0.0);
        spLit += lighting_getDirectionalLight(i).color * spNdotL;
      }
      color.rgb *= spLit;
    }
    #endif
    color = shadow_filterShadowColor(color);
    `
  };

  mod.uniformTypes = {
    ...shadow.uniformTypes,
    outputUniformShadow: 'f32',
    useSimplePhong: 'f32'
  };

  const originalGetUniforms = shadow.getUniforms as (
    opts: Record<string, unknown>,
    prevUniforms: Record<string, unknown>
  ) => Record<string, unknown>;
  mod.getUniforms = (opts: CustomShadowProps = {}, context = {}) => {
    const u = originalGetUniforms(opts, context);
    u.outputUniformShadow = opts.outputUniformShadow ? 1.0 : 0.0;
    u.useSimplePhong = opts.useSimplePhong ? 1.0 : 0.0;
    return u;
  };

  return mod as unknown as ShaderModule;
}

const CustomShadowModule = createCustomShadowModule();

/**
 * Detect layers that use the PBR shader module (3D tile sublayers:
 * ScenegraphLayer sets `_lighting: 'pbr'`, SimpleMeshLayer sets `pbrMaterial`).
 */
function isPbrLayer(layer: any): boolean {
  return layer.props?._lighting === 'pbr' || layer.props?.pbrMaterial !== undefined;
}

/**
 * Custom LightingEffect for kepler.gl.
 *
 * Extends deck.gl's LightingEffect with:
 * - A patched shadow module with `outputUniformShadow` for uniform shadow
 *   during nighttime (avoids partial shadows from below).
 * - Simple phong replacement for PBR layers (avoids microfacet specular).
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

    // Filter editor layers out of the shadow pass so they don't cast shadows.
    const originalLayers = opts.layers;
    opts.layers = originalLayers.filter(l => !l.id.startsWith(EDITOR_LAYER_ID));

    let unpatch: (() => void) | undefined;
    if (this.isExportMode) {
      unpatch = patchTileViewportIds(opts);
    }

    super.preRender(opts);

    unpatch?.();

    opts.layers = originalLayers;
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

    // When the effect is disabled (ghost kept alive to preserve the shadow
    // shader module), delegate to a default LightingEffect so phong/gouraud
    // layers get the same shading they had before the effect was ever added.
    if (!this._private.shadow) {
      const defaults = DEFAULT_LIGHTING_EFFECT.getShaderModuleProps(layer, otherShaderModuleProps);
      return {
        ...defaults,
        shadow: {
          shadowEnabled: false,
          dummyShadowMap: this._private.dummyShadowMap
        },
        pbrMaterial: {unlit: 1}
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

    if (isPbrLayer(layer)) {
      // PBR layers: disable PBR lighting (unlit=1 → outputs base texture color),
      // keep directional lights in the lighting uniforms, and enable our simple
      // phong replacement in the DECKGL_FILTER_COLOR hook. This gives us
      // ambient + NdotL diffuse without PBR microfacet specular artifacts.
      // Light direction is sky→surface (deck.gl convention), negated in GLSL.
      (props as any).pbrMaterial = {unlit: 1};
      if (props.shadow) {
        (props.shadow as CustomShadowProps).useSimplePhong = true;
      }
      return props;
    }

    (props as any).pbrMaterial = {unlit: 0};

    return props;
  }
}

export default CustomDeckLightingEffect;
