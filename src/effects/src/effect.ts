import {generateHashId} from '@kepler.gl/utils';
import {Effect as EffectInterface, EffectProps, EffectPropsPartial} from '@kepler.gl/types';
import {DEFAULT_POST_PROCESSING_EFFECT_TYPE} from '@kepler.gl/constants';

export class Effect implements EffectInterface {
  id: string;
  type: string;
  isEnabled: boolean;
  isConfigActive: boolean;
  // effect specific parameters for a deck.gl effect (uniforms)
  parameters: {[key: string]: any};
  deckEffect: any;

  constructor(props: EffectPropsPartial = {}) {
    this.id = props.id || `e_${generateHashId(6)}`;

    const _props = this.getDefaultProps(props);
    this.type = _props.type;
    this.isEnabled = _props.isEnabled;
    this.isConfigActive = _props.isConfigActive;
    this.parameters = _props.parameters;

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
      parameters: {...props.parameters}
    };
  }

  setProps(props: EffectPropsPartial) {
    this.id = props.id ?? this.id;
    this.type = props.type ?? this.type;
    this.isEnabled = props.isEnabled ?? this.isEnabled;
    this.isConfigActive = props.isConfigActive ?? this.isConfigActive;
    this.parameters = {...this.parameters, ...props.parameters};
  }

  isValidToSave() {
    return Boolean(this.type && this.id && this.deckEffect);
  }
}

export default Effect;
