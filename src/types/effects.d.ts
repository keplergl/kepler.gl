export type EffectParameterDescription = {
  name: string;
  label?: string | false;
  index?: number;
  min?: number;
  max?: number;
  default?: number;
};

export type EffectDescription = {
  type: string;
  name: string;
  parameters: EffectParameterDescription[];
};

export type EffectUpdateProps = {
  isEnabled: boolean;
  isConfigActive: boolean;
  isJsonEditorActive: boolean;
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
  isJsonEditorActive: boolean;
  // effect specific parameters for a deck.gl effect (uniforms)
  parameters: {[key: string]: any};
  deckEffect: any;
  _uiConfig: EffectParameterDescription[];

  getDefaultProps(props: Partial<EffectProps>): EffectProps;
  setProps(props: Partial<EffectProps>): void;
  isValidToSave(): boolean;
  getParameterDescriptions(): EffectParameterDescription[];
}
