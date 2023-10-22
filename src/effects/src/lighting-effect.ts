import {
  LightingEffect as DeckLightingEffect,
  AmbientLight,
  _SunLight as SunLight
} from '@deck.gl/core';

import {LIGHT_AND_SHADOW_EFFECT, DEFAULT_LIGHT_AND_SHADOW_PROPS} from '@kepler.gl/constants';
import {normalizeColor} from '@kepler.gl/utils';
import {EffectConfig, EffectParamsPartial} from '@kepler.gl/types';

import Effect from './effect';

const LIGHT_AND_SHADOW_EFFECT_DESC = {
  ...LIGHT_AND_SHADOW_EFFECT,
  class: null
};

class LightingEffect extends Effect {
  // deckEffect: PostProcessEffect | LightingEffect | null;

  constructor(props: EffectParamsPartial) {
    super(props);
  }

  _initializeEffect() {
    this.config.params = {...DEFAULT_LIGHT_AND_SHADOW_PROPS, ...this.config.params};
    const {params} = this.config;

    const ambientLight = new AmbientLight({
      color: params.ambientLightColor,
      intensity: params.ambientLightIntensity
    });

    const sunLight = new SunLight({
      timestamp: params.timestamp,
      color: params.sunLightColor,
      intensity: params.sunLightIntensity,
      _shadow: true
    });

    this.deckEffect = new DeckLightingEffect({
      ambientLight,
      sunLight
    });
    if (this.deckEffect) {
      this.deckEffect.shadowColor = [...normalizeColor(params.shadowColor), params.shadowIntensity];
    }
  }

  _getDefaultEffectConfig(config: Partial<EffectConfig> = {}) {
    const type = config.type || LIGHT_AND_SHADOW_EFFECT_DESC.type;
    return {
      type,
      name: config.name || LIGHT_AND_SHADOW_EFFECT_DESC.name,
      isEnabled: config.isEnabled ?? true,
      isConfigActive: config.isConfigActive ?? true,
      params: {...(config.params || {})}
    };
  }

  updateConfig(config: Partial<EffectConfig>) {
    super.updateConfig(config);

    // any uniform updated?
    if (config.params) {
      const {params} = this.config;

      if (this.config.type === LIGHT_AND_SHADOW_EFFECT_DESC.type) {
        /** @type {LightingEffect} */
        const effect = this.deckEffect;
        if (effect) {
          effect.shadowColor = [...normalizeColor(params.shadowColor), params.shadowIntensity];

          effect.ambientLight.intensity = params.ambientLightIntensity;
          effect.ambientLight.color = params.ambientLightColor.slice();

          const sunLight = effect.directionalLights[0];
          if (sunLight) {
            sunLight.intensity = params.sunLightIntensity;
            sunLight.color = params.sunLightColor.slice();
            sunLight.timestamp = params.timestamp;
          }
        }
      }
    }
  }
}

export default LightingEffect;
