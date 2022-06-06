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

import React, {ComponentType, useState} from 'react';
import styled from 'styled-components';

import {Legend} from 'components/common/icons';
import {FormattedMessage} from 'localization';
import {MapControlButton} from 'components/common/styled-components';
import MapControlPanelFactory from './map-control-panel';
import MapLegendFactory from './map-legend';
import Tippy from '@tippyjs/react/headless';
import TippyTooltip from 'components/common/tippy-tooltip';
import {createPortal} from 'react-dom';
import {DIMENSIONS} from 'constants/default-settings';
import {MapControl, MapControls} from 'reducers';
import {Layer} from 'layers';

MapLegendPanelFactory.deps = [MapControlPanelFactory, MapLegendFactory];

const PinToBottom = styled.div`
  position: absolute;
  bottom: ${DIMENSIONS.mapControl.mapLegend.pinned.bottom}px;
  right: ${DIMENSIONS.mapControl.mapLegend.pinned.right}px;
`;

interface MapLegendPanelIcons {
  legend: ComponentType<any>;
}

export type MapLegendPanelProps = {
  layers: ReadonlyArray<Layer>;
  scale: number;
  onToggleMapControl: (control: string) => void;
  isExport: boolean;
  logoComponent: Element;
  actionIcons: MapLegendPanelIcons;
  mapControls: MapControls;
  mapHeight?: number;
};

function MapLegendPanelFactory(MapControlPanel, MapLegend) {
  const defaultActionIcons = {
    legend: Legend
  };

  /** @type {import('./map-legend-panel').MapLegendPanelComponent} */
  const MapLegendPanel: React.FC<MapLegendPanelProps> = ({
    layers,
    mapControls,
    scale,
    onToggleMapControl,
    isExport,
    logoComponent,
    actionIcons = defaultActionIcons,
    mapHeight
  }) => {
    const mapLegend = mapControls?.mapLegend || ({} as MapControl);
    const {active: isPinned} = mapLegend || {};

    const onClick = () => {
      if (mapControls?.mapDraw?.active) {
        onToggleMapControl('mapDraw');
      }
    };
    const [tippyInstance, setTippyInstance] = useState(null);
    const onCloseClick = e => {
      e.preventDefault();
      onToggleMapControl('mapLegend');
    };
    const onPinClick = e => {
      e.preventDefault();
      if (tippyInstance) {
        // @ts-ignore
        tippyInstance.hide();
      }
      onToggleMapControl('mapLegend');
    };

    if (!mapLegend.show) {
      return null;
    }
    const mapControlPanel = (
      <MapControlPanel
        scale={scale}
        header={'header.layerLegend'}
        isPinned={true}
        {...(isPinned
          ? {
              onClick: onCloseClick,
              pinnable: false,
              disableClose: false
            }
          : {
              onPinClick,
              pinnable: true,
              disableClose: true
            })}
        isExport={isExport}
        logoComponent={logoComponent}
      >
        <MapLegend layers={layers} mapHeight={mapHeight} />
      </MapControlPanel>
    );

    if (isPinned) {
      // Pinned panel is not supported in export mode
      if (isExport) {
        return mapControlPanel;
      }
      const pinnedPanel = <PinToBottom>{mapControlPanel}</PinToBottom>;
      return createPortal(pinnedPanel, document.body);
    }

    return (
      // The outer div is to prevent an accessibility warning from Tippy
      <div>
        <Tippy
          interactive={true}
          trigger="click"
          placement="left-start"
          // @ts-ignore
          onCreate={setTippyInstance}
          render={attrs => <div {...attrs}>{mapControlPanel}</div>}
          appendTo={document.body}
        >
          <div>
            <TippyTooltip
              placement="left"
              render={() => (
                <div id="show-legend">
                  <FormattedMessage id="tooltip.showLegend" />
                </div>
              )}
            >
              <MapControlButton className="map-control-button show-legend" onClick={onClick}>
                <actionIcons.legend height="22px" />
              </MapControlButton>
            </TippyTooltip>
          </div>
        </Tippy>
      </div>
    );
  };

  MapLegendPanel.displayName = 'MapLegendPanel';
  return MapLegendPanel;
}

export default MapLegendPanelFactory;
