// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

type EffectParameterDescription = {
  name: string;
  type?: 'number' | 'array' | 'color';
  label?: string | false | (string | false)[];
  min: number;
  max: number;
  defaultValue?: number | number[];
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
