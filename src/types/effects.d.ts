// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

type EffectParameterDescription = {
  name: string;
  type?: 'number' | 'array' | 'color' | 'checkbox';
  label?: string | false | (string | false)[];
  tooltip?: string;
  min: number;
  max: number;
  defaultValue?: number | number[] | boolean;
};

export type EffectDescription = {
  type: string;
  name: string;
  description?: string;
  parameters: EffectParameterDescription[];
};

export type EffectParameterAnimation = {
  /** Stable identity for a block in a timed sequence. */
  id?: string;
  startValue?: number | number[];
  endValue: number | number[];
  easing: 'linear' | 'easeInOut';
  /** Explicit start and end in elapsed milliseconds. */
  startTimeMs: number;
  endTimeMs: number;
};

/** A timed transition or an ordered sequence of timed blocks. */
export type EffectAnimation = Record<string, EffectParameterAnimation | EffectParameterAnimation[]>;

export type EffectUpdateProps = {
  isEnabled: boolean;
  isConfigActive: boolean;
  isJsonEditorActive: boolean;
  // effect specific parameters for a deck.gl effect (uniforms)
  parameters: {[key: string]: any};
  animation?: EffectAnimation;
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
  animation?: EffectAnimation;
  deckEffect: any;
  _uiConfig: EffectParameterDescription[];

  getDefaultProps(props: Partial<EffectProps>): EffectProps;
  setProps(props: Partial<EffectProps>): void;
  isValidToSave(): boolean;
  getParameterDescriptions(): EffectParameterDescription[];
  clone(): Effect;
}
