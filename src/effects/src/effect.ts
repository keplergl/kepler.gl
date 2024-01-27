// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {generateHashId, validateEffectParameters} from '@kepler.gl/utils';
import {
  Effect as EffectInterface,
  EffectProps,
  EffectPropsPartial,
  EffectParameterDescription
} from '@kepler.gl/types';
import {
  DEFAULT_POST_PROCESSING_EFFECT_TYPE,
  POSTPROCESSING_EFFECTS,
  LIGHT_AND_SHADOW_EFFECT
} from '@kepler.gl/constants';

export class Effect implements EffectInterface {
  id: string;
  type: string;
  isEnabled: boolean;
  // effect specific parameters for a deck.gl effect (uniforms)
  parameters: {[key: string]: any};
  // runtime props
  isConfigActive: boolean;
  isJsonEditorActive: boolean;
  deckEffect: any;
  _uiConfig: EffectParameterDescription[];

  constructor(props: EffectPropsPartial = {}) {
    this.id = props.id || `e_${generateHashId(6)}`;

    const _props = this.getDefaultProps(props);
    this.type = _props.type;
    this.isEnabled = _props.isEnabled;
    this.isConfigActive = _props.isConfigActive;
    this.isJsonEditorActive = _props.isJsonEditorActive;

    this._uiConfig =
      LIGHT_AND_SHADOW_EFFECT.type === this.type
        ? LIGHT_AND_SHADOW_EFFECT.parameters
        : POSTPROCESSING_EFFECTS[this.type]?.parameters || [];
    this.parameters = validateEffectParameters(_props.parameters, this._uiConfig);

    this.deckEffect = null;
    this._initializeEffect();
  }

  _initializeEffect() {
    // implemented in subclasses
  }

  getDefaultProps(props: EffectPropsPartial = {}): EffectProps {
    return {
      id: props.id || `e_${generateHashId(6)}`,
      type: props.type || DEFAULT_POST_PROCESSING_EFFECT_TYPE,
      isEnabled: props.isEnabled ?? true,
      isConfigActive: props.isConfigActive ?? true,
      isJsonEditorActive: props.isJsonEditorActive ?? false,
      parameters: {...props.parameters}
    };
  }

  setProps(props: EffectPropsPartial) {
    this.id = props.id ?? this.id;
    this.type = props.type ?? this.type;
    this.isEnabled = props.isEnabled ?? this.isEnabled;
    this.isConfigActive = props.isConfigActive ?? this.isConfigActive;
    this.isJsonEditorActive = props.isJsonEditorActive ?? this.isJsonEditorActive;
    this.parameters = {
      ...this.parameters,
      ...validateEffectParameters(props.parameters, this._uiConfig)
    };
  }

  isValidToSave() {
    return Boolean(this.type && this.id && this.deckEffect);
  }

  /**
   * Effect specific list of configurable parameters.
   * @returns All parameters are in preffered order.
   */
  getParameterDescriptions() {
    return this._uiConfig || [];
  }
}

export default Effect;
