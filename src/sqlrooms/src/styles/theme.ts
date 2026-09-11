// SPDX-License-Identifier: MIT
// Copyright SQLRooms Contributors and contributors to the kepler.gl project

import {theme} from '@kepler.gl/styles';
import {DefaultTheme} from 'styled-components';

// SQL Room dark theme exported from sqlRoom preset, maybe there is a better way to do this
// but this is the only way I could find to make it work with tailwind

export const darkTheme: DefaultTheme = {
  ...theme,
  sidePanelBg: 'hsl(var(--background))',
  bottomWidgetBgd: 'hsl(var(--background))',
  textColor: 'hsl(var(--foreground))',
  titleTextColor: 'hsl(var(--foreground))',
  textColorHl: 'hsl(var(--foreground))',
  activeColor: 'hsl(var(--primary))',
  subtextColor: 'hsl(var(--muted-foreground))',
  labelColor: 'hsl(var(--muted-foreground))',
  panelBackground: 'hsl(var(--primary-foreground))',
  panelBorderColor: 'hsl(var(--muted-foreground) / 0.2)',
  panelContentBackground: 'hsl(var(--background))',
  mapPanelBackgroundColor: 'hsl(var(--primary-foreground))',
  mapPanelHeaderBackgroundColor: 'hsl(var(--muted))',

  inputBgd: 'hsl(var(--input))',
  inputColor: 'hsl(var(--foreground))',
  inputPlaceholderColor: 'hsl(var(--muted-foreground))',
  selectColor: 'hsl(var(--foreground))',
  selectColorPlaceHolder: 'hsl(var(--muted-foreground))',
  selectColorPlaceHolderLT: 'hsl(var(--muted-foreground))',
  inputBgdHover: 'hsl(var(--input) / 0.8)',
  inputBgdActive: 'hsl(var(--input) / 0.8)',
  inputBorderHoverColor: 'hsl(var(--input) / 0.8)',
  inputBorderActiveColor: 'hsl(var(--input) / 0.8)',

  switchTrackBgdActive: 'hsl(var(--input))',
  switchTrackBgd: 'hsl(var(--input))',
  switchBtnBgdActive: 'hsl(var(--foreground))',
  switchBtnBgd: 'hsl(var(--muted-foreground) / 0.2)',
  secondarySwitchTrackBgd: 'hsl(var(--input))',
  secondarySwitchBtnBgd: 'hsl(var(--muted-foreground) / 0.2)',

  secondaryInputColor: 'hsl(var(--foreground))',
  secondaryInputBgd: 'hsl(var(--input))',
  secondaryInputBgdHover: 'hsl(var(--input) / 0.8)',
  secondaryInputBgdActive: 'hsl(var(--input) / 0.8)',
  secondaryInputBorderActiveColor: 'hsl(var(--input) / 0.8)',
  secondaryInputBorderColor: 'hsl(var(--input))',

  panelBackgroundHover: 'hsl(var(--muted))',
  panelHeaderIcon: 'hsl(var(--muted-foreground))',
  panelHeaderIconActive: 'hsl(var(--foreground))',
  panelHeaderIconHover: 'hsl(var(--foreground))',
  toolbarItemIconHover: 'hsl(var(--foreground))',

  // button
  primaryBtnBgd: 'hsl(var(--primary))',
  primaryBtnBgdHover: 'hsl(var(--primary) / 0.8)',
  primaryBtnRadius: 'calc(var(--radius) - 2px)',
  primaryBtnColor: 'hsl(var(--primary-foreground))',
  primaryBtnActColor: 'hsl(var(--primary-foreground))',
  primaryBtnFontSizeDefault: '0.875rem',
  floatingBtnRadius: '4px',
  ctaBtnBgd: 'hsl(var(--primary))',
  ctaBtnBgdHover: 'hsl(var(--primary) / 0.8)',
  ctaBtnActBgd: 'hsl(var(--primary) / 0.8)',
  floatingBtnBgd: 'hsl(var(--primary-foreground))',
  floatingBtnBgdHover: 'hsl(var(--accent))',
  floatingBtnActColor: 'hsl(var(--foreground))',
  floatingBtnColor: 'hsl(var(--foreground))',

  // dropdown
  dropdownListBgd: 'hsl(var(--primary-foreground))',
  toolbarItemBgdHover: 'hsl(var(--accent))',
  dropdownListHighlightBg: 'hsl(var(--accent))',
  chickletBgd: 'hsl(var(--muted-foreground) / 0.4)',
  dropdownListBorderTop: 'hsl(var(--muted-foreground) / 0.2)',
  // slider
  sliderBarBgd: 'hsl(var(--secondary))',

  // chart
  histogramFillInRange: 'hsl(var(--chart-1))',

  // size
  bottomWidgetPaddingTop: 0,
  bottomWidgetPaddingRight: 0,
  bottomWidgetPaddingBottom: 0,
  bottomWidgetPaddingLeft: 0,
  panelHeaderBorderRadius: '4px'
};

export type KeplerThemeOverrides = Partial<typeof theme> & Partial<DefaultTheme>;

/**
 * Create a custom Kepler theme by merging overrides into the base dark theme.
 * Use this to set modal z-indices, colors, or other theme values from the app level.
 *
 * @example
 * ```ts
 * const myTheme = createKeplerTheme({ modalOverLayZ: 49 });
 * ```
 */
export function createKeplerTheme(overrides?: KeplerThemeOverrides): DefaultTheme {
  return {...darkTheme, ...overrides};
}
