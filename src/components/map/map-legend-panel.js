import React, {useCallback} from 'react';
import {Legend} from 'components/common/icons';
import {FormattedMessage} from 'localization';
import {MapControlButton, Tooltip} from 'components/common/styled-components';
import MapControlTooltipFactory from './map-control-tooltip';
import MapControlPanelFactory from './map-control-panel';
import MapLegendFactory from './map-legend';

const MapLegendTooltip = ({id, message}) => (
  <Tooltip id={id} place="left" effect="solid">
    <span>
      <FormattedMessage id={message} />
    </span>
  </Tooltip>
);

MapLegendPanelFactory.deps = [MapControlTooltipFactory, MapControlPanelFactory, MapLegendFactory];

function MapLegendPanelFactory(MapControlTooltip, MapControlPanel, MapLegend) {
  const defaultActionIcons = {
    legend: Legend
  };

  /** @type {import('./map-legend-panel').MapLegendPanelComponent} */
  const MapLegendPanel = ({
    layers,
    mapControls,
    scale,
    onToggleMapControl,
    isExport,
    logoComponent,
    actionIcons = defaultActionIcons
  }) => {
    const {mapLegend} = mapControls;
    const {active: isActive, disableClose} = mapLegend;
    const onToggleMenuPanel = useCallback(() => onToggleMapControl('mapLegend'), [
      onToggleMapControl
    ]);

    const onClick = useCallback(
      e => {
        e.preventDefault();
        onToggleMenuPanel();
      },
      [onToggleMenuPanel]
    );

    return !isActive ? (
      (<MapControlButton
        data-tip
        data-for="show-legend"
        className="map-control-button show-legend"
        onClick={onClick}
      >
        <actionIcons.legend height="22px" />
        <MapLegendTooltip id="show-legend" message={'tooltip.showLegend'} />
      </MapControlButton>)
    ) : (
      (<MapControlPanel
        scale={scale}
        header={'header.layerLegend'}
        onClick={onToggleMenuPanel}
        isExport={isExport}
        disableClose={disableClose}
        logoComponent={logoComponent}
      >
        <MapLegend layers={layers} />
      </MapControlPanel>)
    );
  };

  MapLegendPanel.displayName = 'MapControlPanel';
  return MapLegendPanel;
}

export default MapLegendPanelFactory;
