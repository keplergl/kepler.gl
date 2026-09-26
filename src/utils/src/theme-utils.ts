// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {THEME} from '@kepler.gl/constants';

import {getApplicationConfig} from './application-config';

/** Configured UI theme names, in cycle order. Empty when unset. */
export function getConfiguredThemes(): string[] {
  const {themes} = getApplicationConfig();
  if (!Array.isArray(themes)) {
    return [];
  }
  return themes.filter((name): name is string => typeof name === 'string' && name.length > 0);
}

/** True when the map control should cycle themes (two or more names). */
export function shouldShowThemeSwitcher(): boolean {
  return getConfiguredThemes().length > 1;
}

/** First configured theme, or dark when none are set. */
export function getDefaultUiTheme(): string {
  return getConfiguredThemes()[0] || THEME.dark;
}

/** Next theme in the configured cycle. */
export function getNextUiTheme(current?: string): string {
  const themes = getConfiguredThemes();
  if (themes.length === 0) {
    return THEME.dark;
  }
  const index = current ? themes.indexOf(current) : -1;
  return themes[index === -1 ? 0 : (index + 1) % themes.length];
}
