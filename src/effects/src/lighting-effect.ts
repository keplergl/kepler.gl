// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {AmbientLight, _SunLight as SunLight} from '@deck.gl/core';
import moment from 'moment-timezone';

import {LIGHT_AND_SHADOW_EFFECT, DEFAULT_LIGHT_AND_SHADOW_PROPS} from '@kepler.gl/constants';
import {normalizeColor} from '@kepler.gl/utils';
import {EffectProps, EffectPropsPartial} from '@kepler.gl/types';

import Effect from './effect';
import CustomDeckLightingEffect from './custom-deck-lighting-effect';

const LIGHT_AND_SHADOW_EFFECT_DESC = {
  ...LIGHT_AND_SHADOW_EFFECT,
  class: null
};

class LightingEffect extends Effect {
  // deckEffect: PostProcessEffect | LightingEffect | null;

  constructor(props: EffectPropsPartial) {
    super(props);
  }

  _initializeEffect() {
    this.parameters = {
      ...DEFAULT_LIGHT_AND_SHADOW_PROPS,
      timezone: moment.tz.guess(true),
      ...this.parameters
    };
    const {parameters} = this;

    const ambientLight = new AmbientLight({
      color: parameters.ambientLightColor,
      intensity: parameters.ambientLightIntensity
    });

    const sunLight = new SunLight({
      timestamp: parameters.timestamp,
      color: parameters.sunLightColor,
      intensity: parameters.sunLightIntensity,
      _shadow: true
    });

    this.deckEffect = new CustomDeckLightingEffect({
      ambientLight,
      sunLight
    });
    if (this.deckEffect) {
      this.deckEffect.shadowColor = [
        ...normalizeColor(parameters.shadowColor),
        parameters.shadowIntensity
      ];
    }
  }

  getDefaultProps(props: EffectPropsPartial = {}): EffectProps {
    return super.getDefaultProps({type: LIGHT_AND_SHADOW_EFFECT_DESC.type, ...props});
  }

  setProps(props: EffectPropsPartial) {
    super.setProps(props);

    // any uniform updated?
    if (props.parameters) {
      const {parameters} = this;

      if (this.type === LIGHT_AND_SHADOW_EFFECT_DESC.type) {
        /** @type {LightingEffect} */
        const effect = this.deckEffect;
        if (effect) {
          effect.shadowColor = [
            ...normalizeColor(parameters.shadowColor),
            parameters.shadowIntensity
          ];

          effect.ambientLight.intensity = parameters.ambientLightIntensity;
          effect.ambientLight.color = parameters.ambientLightColor.slice();

          const sunLight = effect.directionalLights[0];
          if (sunLight) {
            sunLight.intensity = parameters.sunLightIntensity;
            sunLight.color = parameters.sunLightColor.slice();
            sunLight.timestamp = parameters.timestamp;
          }
        }
      }
    }
  }
}

export default LightingEffect;
