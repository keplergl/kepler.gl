// Copyright (c) 2021 Uber Technologies, Inc.
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
import ToolbarItem from 'components/common/toolbar-item';
import {MapControlButton} from 'components/common/styled-components';
import MapControlTooltipFactory from './map-control-tooltip';
import MapControlPanelFactory from './map-control-panel';
import MapControlToolbarFactory from './map-control-toolbar';

LocalePanelFactory.deps = [
  MapControlTooltipFactory,
  MapControlPanelFactory,
  MapControlToolbarFactory
];

function LocalePanelFactory(MapControlTooltip, MapControlPanel, MapControlToolbar) {
  /** @type {import('./locale-panel').LocalePanelComponent} */
  const LocalePanel = React.memo(
    ({availableLocales, onToggleMenuPanel, onSetLocale, locale: currentLocal, mapControls}) => {
      const {active: isActive, disableClose, show} = mapControls.mapLocale || {};

      const onClickItem = useCallback(
        locale => {
          onSetLocale(locale);
        },
        [onSetLocale]
      );

      const onClickButton = useCallback(
        e => {
          e.preventDefault();
          onToggleMenuPanel();
        },
        [onToggleMenuPanel]
      );
      const getLabel = useCallback(locale => `toolbar.${locale}`, []);

      if (!show) {
        return null;
      }
      return (
        <div style={{position: 'relative'}}>
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
          <MapControlButton
            onClick={onClickButton}
            active={isActive}
            data-tip
            data-for="locale"
            disableClose={disableClose}
          >
            {currentLocal.toUpperCase()}
            <MapControlTooltip id="locale" message="tooltip.selectLocale" />
          </MapControlButton>
        </div>
      );
    }
  );

  LocalePanel.displayName = 'LocalePanel';

  return LocalePanel;
}

export default LocalePanelFactory;
