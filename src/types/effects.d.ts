export type EffectConfig = {
  type: string;
  name: string;
  isEnabled: boolean;
  isConfigActive: boolean;
  // effect specific params for a deck.gl effect (uniforms)
  params: {[key: string]: any};
};

export type EffectParams = {
  id: string;
  config: EffectConfig;
};

export type EffectParamsPartial = {
  id?: string;
  config?: Partial<EffectConfig>
};

export interface Effect {
  id: string;
  config: EffectConfig;
  deckEffect: any;

  _getDefaultEffectConfig(config: Partial<EffectConfig>): EffectConfig;
  updateConfig(config: Partial<EffectConfig>): void;
  isValidToSave(): boolean;
  get type(): string;
}
