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
      const {active: isActive, disableClose} = mapControls.mapLocale || {};

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

      if (!mapControls.mapLocale) {
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
