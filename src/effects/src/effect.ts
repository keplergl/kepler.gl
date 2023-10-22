import {generateHashId} from '@kepler.gl/utils';
import {Effect as EffectInterface, EffectConfig, EffectParamsPartial} from '@kepler.gl/types';

export class Effect implements EffectInterface {
  id: string;
  config: EffectConfig;
  deckEffect: any;

  constructor(props: EffectParamsPartial = {}) {
    this.id = props.id || `e_${generateHashId(6)}`;
    this.config = this._getDefaultEffectConfig(props.config);
    this.deckEffect = null;

    this.deckEffect = null;
    this._initializeEffect();
  }

  _initializeEffect() {
    // implemented in subclasses
  }

  _onUpdateConfig() {
    // implemented in subclasses
  }

  _getDefaultEffectConfig(config: Partial<EffectConfig> = {}) {
    // implemented in subclasses
    return this.config;
  }

  updateConfig(config: Partial<EffectConfig>) {
    this.config = {
      ...this.config,
      ...config,
      params: {...this.config.params, ...(config.params || {})}
    };
  }

  isValidToSave() {
    return Boolean(this.config.type && this.id && this.deckEffect);
  }

  get type() {
    return this.config.type;
  }
}

export default Effect;
