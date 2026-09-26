// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ComponentType, useCallback} from 'react';
import classnames from 'classnames';

import {THEME} from '@kepler.gl/constants';
import {MapControls} from '@kepler.gl/types';
import {getNextUiTheme, shouldShowThemeSwitcher} from '@kepler.gl/utils';

import {Moon, Space, Sun} from '../common/icons';
import {MapControlButton} from '../common/styled-components';
import MapControlTooltipFactory from './map-control-tooltip';

interface ThemeToggleButtonIcons {
  sun: ComponentType<any>;
  moon: ComponentType<any>;
  space: ComponentType<any>;
}

const NEXT_THEME_TOOLTIP: Record<string, string> = {
  [THEME.light]: 'tooltip.switchToLightTheme',
  [THEME.dark]: 'tooltip.switchToDarkTheme',
  [THEME.space]: 'tooltip.switchToSpaceTheme'
};

export type ThemeToggleButtonProps = {
  themeName?: string;
  onSetTheme: (theme: string) => void;
  mapControls: MapControls;
  actionIcons?: ThemeToggleButtonIcons;
};

ThemeToggleButtonFactory.deps = [MapControlTooltipFactory];

function ThemeToggleButtonFactory(MapControlTooltip: ReturnType<typeof MapControlTooltipFactory>) {
  const defaultActionIcons = {
    sun: Sun,
    moon: Moon,
    space: Space
  };

  const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({
    themeName = THEME.dark,
    onSetTheme,
    mapControls,
    actionIcons = defaultActionIcons
  }) => {
    const upcomingTheme = getNextUiTheme(themeName);

    const onClick = useCallback(
      event => {
        event.preventDefault();
        onSetTheme(getNextUiTheme(themeName));
      },
      [themeName, onSetTheme]
    );

    if (!shouldShowThemeSwitcher()) {
      return null;
    }

    const showControl = mapControls?.mapTheme?.show;
    if (!showControl) {
      return null;
    }

    const Icon =
      upcomingTheme === THEME.light
        ? actionIcons.sun
        : upcomingTheme === THEME.space
        ? actionIcons.space
        : actionIcons.moon;

    return (
      <MapControlTooltip
        id="toggle-theme"
        message={NEXT_THEME_TOOLTIP[upcomingTheme] || 'tooltip.switchToDarkTheme'}
      >
        <MapControlButton
          className={classnames('map-control-button', 'toggle-theme', {
            light: themeName === THEME.light,
            space: themeName === THEME.space
          })}
          onClick={onClick}
          active={themeName !== THEME.dark}
        >
          <Icon height="18px" />
        </MapControlButton>
      </MapControlTooltip>
    );
  };

  ThemeToggleButton.displayName = 'ThemeToggleButton';
  return React.memo(ThemeToggleButton);
}

export default ThemeToggleButtonFactory;
