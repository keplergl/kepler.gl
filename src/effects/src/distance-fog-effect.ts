// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {POSTPROCESSING_EFFECTS, DEFAULT_POST_PROCESSING_EFFECT_TYPE} from '@kepler.gl/constants';
import {EffectPropsPartial} from '@kepler.gl/types';

import Effect from './effect';
import {DeckDistanceFogEffect, DistanceFogProps} from './shader-passes/distance-fog';

class DistanceFogEffect extends Effect {
  constructor(props: EffectPropsPartial) {
    super(props);
  }

  _initializeEffect() {
    const effectDesc = POSTPROCESSING_EFFECTS.distanceFog;
    if (!effectDesc) return;

    const defaultParameters: Record<string, any> = {};
    for (const param of effectDesc.parameters) {
      defaultParameters[param.name] = param.defaultValue ?? param.min;
    }
    this.parameters = {...defaultParameters, ...this.parameters};

    this.deckEffect = new DeckDistanceFogEffect(this.parameters as DistanceFogProps);
  }

  getDefaultProps(props: EffectPropsPartial = {}) {
    return super.getDefaultProps({type: DEFAULT_POST_PROCESSING_EFFECT_TYPE, ...props});
  }

  setProps(props: EffectPropsPartial) {
    super.setProps(props);

    if (props.parameters) {
      this.deckEffect?.setProps(this.parameters);
    }
  }
}

export default DistanceFogEffect;
