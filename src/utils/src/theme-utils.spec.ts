// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {getApplicationConfig, initApplicationConfig} from './application-config';
import {
  getConfiguredThemes,
  getDefaultUiTheme,
  getNextUiTheme,
  shouldShowThemeSwitcher
} from './theme-utils';

describe('configured UI themes', () => {
  let originalThemes: string[];

  beforeEach(() => {
    originalThemes = getApplicationConfig().themes;
  });

  afterEach(() => {
    initApplicationConfig({themes: originalThemes});
  });

  test.each([undefined, null, 'light', {}, []])(
    'falls back to dark without a switcher for an absent or invalid list: %p',
    themes => {
      // Application config can also come from JavaScript hosts without type checking.
      initApplicationConfig({themes: themes as unknown as string[]});
      expect(getConfiguredThemes()).toEqual([]);
      expect(getDefaultUiTheme()).toBe('dark');
      expect(shouldShowThemeSwitcher()).toBe(false);
      expect(getNextUiTheme('light')).toBe('dark');
    }
  );

  test('uses a single configured theme without exposing a redundant switcher', () => {
    initApplicationConfig({themes: ['space']});
    expect(getDefaultUiTheme()).toBe('space');
    expect(shouldShowThemeSwitcher()).toBe(false);
    expect(getNextUiTheme('space')).toBe('space');
    expect(getNextUiTheme('dark')).toBe('space');
  });

  test('cycles in configured order and wraps to the first theme', () => {
    initApplicationConfig({themes: ['space', 'light', 'dark']});
    expect(getDefaultUiTheme()).toBe('space');
    expect(shouldShowThemeSwitcher()).toBe(true);
    expect(getNextUiTheme('space')).toBe('light');
    expect(getNextUiTheme('light')).toBe('dark');
    expect(getNextUiTheme('dark')).toBe('space');
  });

  test('starts at the first theme when the current theme is unset or no longer configured', () => {
    initApplicationConfig({themes: ['light', 'space']});
    expect(getNextUiTheme()).toBe('light');
    expect(getNextUiTheme('dark')).toBe('light');
  });

  test('filters empty and non-string entries before choosing defaults and cycling', () => {
    const themes = ['', null, 'space', false, 0, 'light', undefined];
    initApplicationConfig({themes: themes as unknown as string[]});
    expect(getConfiguredThemes()).toEqual(['space', 'light']);
    expect(getDefaultUiTheme()).toBe('space');
    expect(shouldShowThemeSwitcher()).toBe(true);
    expect(getNextUiTheme('space')).toBe('light');
    expect(getNextUiTheme('light')).toBe('space');
    expect(themes).toEqual(['', null, 'space', false, 0, 'light', undefined]);

    initApplicationConfig({themes: ['', 'light', null] as unknown as string[]});
    expect(shouldShowThemeSwitcher()).toBe(false);
  });

  test('reads updated host configuration instead of retaining a stale cycle', () => {
    initApplicationConfig({themes: ['dark', 'light']});
    expect(getNextUiTheme('dark')).toBe('light');

    initApplicationConfig({themes: ['space']});
    expect(getConfiguredThemes()).toEqual(['space']);
    expect(getDefaultUiTheme()).toBe('space');
    expect(shouldShowThemeSwitcher()).toBe(false);
    expect(getNextUiTheme('light')).toBe('space');
  });
});
