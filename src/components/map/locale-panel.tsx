// Copyright (c) 2022 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {useCallback} from 'react';
import classnames from 'classnames';

import ToolbarItem from 'components/common/toolbar-item';
import {MapControlButton} from 'components/common/styled-components';
import MapControlTooltipFactory from './map-control-tooltip';
import MapControlToolbarFactory from './map-control-toolbar';
import {FormattedMessage} from '../../localization';
import TippyTooltip from 'components/common/tippy-tooltip';
import {MapControls} from 'reducers';

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
  /** @type {import('./locale-panel').LocalePanelComponent} */
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
        <div className="map-locale-controls" style={{position: 'relative'}}>
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
          <TippyTooltip
            placement="left"
            render={() => (
              <div id="locale">
                <FormattedMessage id="tooltip.selectLocale" />
              </div>
            )}
          >
            <MapControlButton
              className={classnames('map-control-button', 'map-locale', {isActive})}
              onClick={onClickButton}
              active={isActive}
            >
              <span className="map-control-button__locale">{currentLocal.toUpperCase()}</span>
            </MapControlButton>
          </TippyTooltip>
        </div>
      );
    }
  );

  LocalePanel.displayName = 'LocalePanel';

  return LocalePanel;
}

export default LocalePanelFactory;
