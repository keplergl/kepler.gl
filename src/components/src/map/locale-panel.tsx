// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';
import classnames from 'classnames';

import ToolbarItem from '../common/toolbar-item';
import {MapControlButton} from '../common/styled-components';
import MapControlTooltipFactory from './map-control-tooltip';
import MapControlToolbarFactory from './map-control-toolbar';
import {MapControls} from '@kepler.gl/types';

LocalePanelFactory.deps = [MapControlTooltipFactory, MapControlToolbarFactory];

export type LocalePanelProps = {
  availableLocales: ReadonlyArray<string>;
  onSetLocale: (locale: string) => void;
  locale: string;
  onToggleMapControl: (control: string) => void;
  mapControls: MapControls;
};

function LocalePanelFactory(
  MapControlTooltip: ReturnType<typeof MapControlTooltipFactory>,
  MapControlToolbar: ReturnType<typeof MapControlToolbarFactory>
) {
  const LocalePanel: React.FC<LocalePanelProps> = React.memo(
    ({availableLocales, onToggleMapControl, onSetLocale, locale: currentLocal, mapControls}) => {
      const {active: isActive, show} = mapControls.mapLocale || {};

      const onClickItem = useCallback(
        locale => {
          onSetLocale(locale);
        },
        [onSetLocale]
      );

      const onClickButton = useCallback(
        e => {
          e.preventDefault();
          onToggleMapControl('mapLocale');
        },
        [onToggleMapControl]
      );
      const getLabel = useCallback(locale => `toolbar.${locale}`, []);

      if (!show) {
        return null;
      }
      return (
        <div className="locale-panel-controls" style={{position: 'relative'}}>
          {isActive ? (
            <MapControlToolbar show={isActive}>
              {availableLocales.map(locale => (
                <ToolbarItem
                  key={locale}
                  onClick={() => onClickItem(locale)}
                  label={getLabel(locale)}
                  active={currentLocal === locale}
                />
              ))}
            </MapControlToolbar>
          ) : null}
          <MapControlTooltip id="locale" message="tooltip.selectLocale">
            <MapControlButton
              className={classnames('map-control-button', 'locale-panel', {isActive})}
              onClick={onClickButton}
              active={isActive}
            >
              <span className="map-control-button__locale">{currentLocal.toUpperCase()}</span>
            </MapControlButton>
          </MapControlTooltip>
        </div>
      );
    }
  );

  LocalePanel.displayName = 'LocalePanel';

  return LocalePanel;
}

export default LocalePanelFactory;
