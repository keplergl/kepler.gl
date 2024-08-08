// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';
import classnames from 'classnames';

import {MapControlButton} from '../common/styled-components';
import {Layers} from '../common/icons';
import MapLayerSelector from '../common/map-layer-selector';
import MapControlTooltipFactory from './map-control-tooltip';
import MapControlPanelFactory from './map-control-panel';
import {Layer} from '@kepler.gl/layers';
import {MapControlItem, MapControls} from '@kepler.gl/types';

LayerSelectorPanelFactory.deps = [MapControlTooltipFactory, MapControlPanelFactory];

export type LayerSelectorPanelProps = {
  onMapToggleLayer: (layerId: string) => void;
  onToggleMapControl: (control: string) => void;
  layers: ReadonlyArray<Layer>;
  layersToRender: {[key: string]: boolean};
  isSplit: boolean;
  mapControls: MapControls;
  readOnly: boolean;
};

function LayerSelectorPanelFactory(
  MapControlTooltip: ReturnType<typeof MapControlTooltipFactory>,
  MapControlPanel: ReturnType<typeof MapControlPanelFactory>
) {
  /** @type {import('./layer-selector-panel').LayerSelectorPanelComponent} */
  const LayerSelectorPanel: React.FC<LayerSelectorPanelProps> = ({
    onMapToggleLayer,
    onToggleMapControl,
    layers,
    layersToRender,
    isSplit,
    mapControls,
    readOnly
  }) => {
    const visibleLayers = mapControls?.visibleLayers || ({} as MapControlItem);
    const {active: isActive, show, disableClose} = visibleLayers || {};

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

    const isVisible = useMemo(
      () => isSplit && show && readOnly !== true,
      [isSplit, show, readOnly]
    );

    const onToggleMenuPanel = useCallback(
      event => {
        event.preventDefault();
        onToggleMapControl('visibleLayers');
      },
      [onToggleMapControl]
    );

    return isVisible ? (
      !isActive ? (
        <MapControlButton
          key={1}
          onClick={onToggleMenuPanel}
          className={classnames('map-control-button', 'toggle-layer', {isActive})}
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
      )
    ) : null;
  };

  LayerSelectorPanel.displayName = 'LayerSelectorPanel';

  return React.memo(LayerSelectorPanel);
}

export default LayerSelectorPanelFactory;
