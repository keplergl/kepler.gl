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

import React, {useCallback, useMemo} from 'react';
import classnames from 'classnames';

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
      ))
    ) : null;
  };

  LayerSelectorPanel.displayName = 'LayerSelectorPanel';

  return React.memo(LayerSelectorPanel);
}

export default LayerSelectorPanelFactory;
