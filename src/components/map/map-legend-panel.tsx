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
import {MapControlButton} from 'components/common/styled-components';
import MapControlTooltipFactory from './map-control-tooltip';
import MapControlPanelFactory from './map-control-panel';
import MapLegendFactory from './map-legend';
import LazyTippy from './lazy-tippy';
import {createPortal} from 'react-dom';
import {DIMENSIONS} from '@kepler.gl/constants';
import {MapControl, MapControls} from '@kepler.gl/types';
import {Layer} from '@kepler.gl/layers';

MapLegendPanelFactory.deps = [MapControlTooltipFactory, MapControlPanelFactory, MapLegendFactory];

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

function MapLegendPanelFactory(MapControlTooltip, MapControlPanel, MapLegend) {
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
        {/* 
  // @ts-ignore */}
        <LazyTippy
          interactive={true}
          trigger="click"
          placement="left-start"
          onCreate={setTippyInstance}
          render={attrs => <div {...attrs}>{mapControlPanel}</div>}
          appendTo="parent"
        >
          <div>
            <MapControlTooltip id="show-legend" message="tooltip.showLegend">
              <MapControlButton className="map-control-button show-legend" onClick={onClick}>
                <actionIcons.legend height="22px" />
              </MapControlButton>
            </MapControlTooltip>
          </div>
        </LazyTippy>
      </div>
    );
  };

  MapLegendPanel.displayName = 'MapLegendPanel';
  return MapLegendPanel;
}

export default MapLegendPanelFactory;
