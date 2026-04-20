// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {POSTPROCESSING_EFFECTS, DEFAULT_POST_PROCESSING_EFFECT_TYPE} from '@kepler.gl/constants';
import {EffectPropsPartial} from '@kepler.gl/types';

import Effect from './effect';
import {DeckSurfaceFogEffect, SurfaceFogProps} from './shader-passes/surface-fog';

class SurfaceFogEffect extends Effect {
  constructor(props: EffectPropsPartial) {
    super(props);
  }

  _initializeEffect() {
    const effectDesc = POSTPROCESSING_EFFECTS.surfaceFog;
    if (!effectDesc) return;

    const defaultParameters: Record<string, any> = {};
    for (const param of effectDesc.parameters) {
      defaultParameters[param.name] = param.defaultValue ?? param.min;
    }
    this.parameters = {...defaultParameters, ...this.parameters};

    const {animateHeight: _a, heightEnd: _h, linearEasing: _l, ...deckParams} = this.parameters;
    this.deckEffect = new DeckSurfaceFogEffect(deckParams as SurfaceFogProps);
  }

  getDefaultProps(props: EffectPropsPartial = {}) {
    return super.getDefaultProps({type: DEFAULT_POST_PROCESSING_EFFECT_TYPE, ...props});
  }

  setProps(props: EffectPropsPartial) {
    super.setProps(props);

    if (props.parameters) {
      const {
        animateHeight: _animateHeight,
        heightEnd: _heightEnd,
        linearEasing: _linearEasing,
        ...deckParams
      } = this.parameters;
      this.deckEffect?.setProps(deckParams);
    }
  }
}

export default SurfaceFogEffect;
