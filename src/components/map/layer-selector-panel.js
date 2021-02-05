import React, {useCallback, useMemo} from 'react';
import {MapControlButton} from 'components/common/styled-components';
import {Layers} from '../common/icons';
import MapLayerSelector from '../common/map-layer-selector';
import MapControlTooltipFactory from './map-control-tooltip';
import MapControlPanelFactory from './map-control-panel';

LayerSelectorPanelFactory.deps = [MapControlTooltipFactory, MapControlPanelFactory];

function LayerSelectorPanelFactory(MapControlTooltip, MapControlPanel) {
  /** @type {import('./layer-selector-panel').LayerSelectorPanelComponent} */
  const LayerSelectorPanel = ({
    onMapToggleLayer,
    onToggleMapControl,
    layers,
    layersToRender,
    isSplit,
    mapControls,
    readOnly
  }) => {
    const visibleLayers = mapControls?.visibleLayers || {};
    const {active: isActive, show, disableClose} = visibleLayers;

    const legendLayers = useMemo(
      () =>
        layers
          .filter(({config}) => config.isVisible)
          .map(({id, config}) => ({
            id,
            name: config.label,
            // layer
            isVisible: layersToRender[id]
          })),
      [layers, layersToRender]
    );

    const isVisible = useMemo(() => isSplit && show && readOnly !== true, [
      isSplit,
      show,
      readOnly
    ]);

    const onToggleMenuPanel = useCallback(
      event => {
        event.preventDefault();
        onToggleMapControl('visibleLayers');
      },
      [onToggleMapControl]
    );

    return isVisible ? (
      (!isActive ? (
        <MapControlButton
          key={1}
          onClick={onToggleMenuPanel}
          className="map-control-button toggle-layer"
          data-tip
          data-for="toggle-layer"
        >
          <Layers height="22px" />
          <MapControlTooltip
            id="toggle-layer"
            message={isActive ? 'tooltip.hideLayerPanel' : 'tooltip.showLayerPanel'}
          />
        </MapControlButton>
      ) : (
        <MapControlPanel
          header="header.visibleLayers"
          onClick={onToggleMenuPanel}
          disableClose={disableClose}
        >
          <MapLayerSelector layers={legendLayers} onMapToggleLayer={onMapToggleLayer} />
        </MapControlPanel>
      ))
    ) : null;
  };

  LayerSelectorPanel.displayName = 'LayerSelectorPanel';

  return React.memo(LayerSelectorPanel);
}

export default LayerSelectorPanelFactory;
