// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ComponentType, useCallback} from 'react';
import classnames from 'classnames';

import {THEME} from '@kepler.gl/constants';
import {MapControls} from '@kepler.gl/types';
import {getApplicationConfig} from '@kepler.gl/utils';

import {Moon, Sun} from '../common/icons';
import {MapControlButton} from '../common/styled-components';
import MapControlTooltipFactory from './map-control-tooltip';

interface ThemeToggleButtonIcons {
  sun: ComponentType<any>;
  moon: ComponentType<any>;
}

export type ThemeToggleButtonProps = {
  themeName?: string;
  onSetTheme: (theme: string) => void;
  mapControls: MapControls;
  actionIcons?: ThemeToggleButtonIcons;
};

ThemeToggleButtonFactory.deps = [MapControlTooltipFactory];

function ThemeToggleButtonFactory(
  MapControlTooltip: ReturnType<typeof MapControlTooltipFactory>
) {
  const defaultActionIcons = {
    sun: Sun,
    moon: Moon
  };

  const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({
    themeName = THEME.dark,
    onSetTheme,
    mapControls,
    actionIcons = defaultActionIcons
  }) => {
    const isLight = themeName === THEME.light;

    const onClick = useCallback(
      event => {
        event.preventDefault();
        onSetTheme(isLight ? THEME.dark : THEME.light);
      },
      [isLight, onSetTheme]
    );

    if (!getApplicationConfig().enableThemeToggle) {
      return null;
    }

    const showControl = mapControls?.mapTheme?.show;
    if (!showControl) {
      return null;
    }

    const Icon = isLight ? actionIcons.moon : actionIcons.sun;

    return (
      <MapControlTooltip
        id="toggle-theme"
        message={isLight ? 'tooltip.switchToDarkTheme' : 'tooltip.switchToLightTheme'}
      >
        <MapControlButton
          className={classnames('map-control-button', 'toggle-theme', {light: isLight})}
          onClick={onClick}
          active={isLight}
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
