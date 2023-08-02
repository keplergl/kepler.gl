export type EffectUpdateProps = {
  isEnabled: boolean;
  isConfigActive: boolean;
  // effect specific parameters for a deck.gl effect (uniforms)
  parameters: {[key: string]: any};
};

export type EffectProps = EffectUpdateProps & {
  id: string;
  type: string;
};

export type EffectPropsPartial = Partial<EffectProps>;

export interface Effect {
  id: string;
  type: string;
  isEnabled: boolean;
  isConfigActive: boolean;
  // effect specific parameters for a deck.gl effect (uniforms)
  parameters: {[key: string]: any};
  deckEffect: any;

  getDefaultProps(props: Partial<EffectProps>): EffectProps;
  setProps(props: Partial<EffectProps>): void;
  isValidToSave(): boolean;
}
