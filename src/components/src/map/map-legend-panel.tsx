// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ComponentType, useCallback, useContext, useState} from 'react';
import styled from 'styled-components';

import {Legend} from '../common/icons';
import {MapControlButton} from '../common/styled-components';
import MapControlTooltipFactory from './map-control-tooltip';
import MapControlPanelFactory from './map-control-panel';
import MapLegendFactory from './map-legend';
import {createPortal} from 'react-dom';
import {DIMENSIONS} from '@kepler.gl/constants';
import {LayerVisConfig, MapControlMapLegend, MapControls, MapState} from '@kepler.gl/types';
import {Layer} from '@kepler.gl/layers';
import {media} from '@kepler.gl/styles';
import {ActionHandler, toggleSplitMapViewport} from '@kepler.gl/actions';

import {RootContext} from '../context';

MapLegendPanelFactory.deps = [MapControlTooltipFactory, MapControlPanelFactory, MapLegendFactory];

export type MapLegendPanelFactoryDeps = [
  typeof MapControlTooltipFactory,
  typeof MapControlPanelFactory,
  typeof MapLegendFactory
];
interface PinToBottomProps {
  offsetRight?: number;
}
import {
  FloatingPortal,
  offset,
  useClick,
  useDismiss,
  useFloating,
  useInteractions
} from '@floating-ui/react';

const PinToBottom = styled.div<PinToBottomProps>`
  position: absolute;
  bottom: ${DIMENSIONS.mapControl.mapLegend.pinned.bottom}px;
  right: ${props => (props.offsetRight || 0) + DIMENSIONS.mapControl.mapLegend.pinned.right}px;
  ${media.portable`
    bottom: 0px;
    right: 0px;
    min-width: ${DIMENSIONS.mapControl.width + DIMENSIONS.mapControl.mapLegend.pinned.right}px;
    .map-control-panel {
      min-height: 215px;
      margin-bottom: 0px;
    };
  `};
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
  mapState?: MapState;
  mapHeight?: number;
  offsetRight?: number;
  onToggleSplitMapViewport?: ActionHandler<typeof toggleSplitMapViewport>;
  isViewportUnsyncAllowed?: boolean;
  onClickControlBtn?: (e?: MouseEvent) => void;
  onLayerVisConfigChange?: (oldLayer: Layer, newVisConfig: Partial<LayerVisConfig>) => void;
};

function MapLegendPanelFactory(MapControlTooltip, MapControlPanel, MapLegend) {
  const defaultActionIcons = {
    legend: Legend
  };

  const MapLegendPanel: React.FC<MapLegendPanelProps> = ({
    layers,
    mapControls,
    scale,
    onToggleMapControl,
    isExport,
    logoComponent,
    actionIcons = defaultActionIcons,
    mapState,
    offsetRight,
    onToggleSplitMapViewport,
    onClickControlBtn,
    isViewportUnsyncAllowed = true,
    onLayerVisConfigChange
  }) => {
    const mapLegend = mapControls?.mapLegend || ({} as MapControlMapLegend);
    const {active: isPinned, disableEdit} = mapLegend || {};
    const rootContext = useContext(RootContext);
    const [isOpened, setIsOpened] = useState(false);

    const {refs, context, floatingStyles} = useFloating({
      placement: 'left-start',
      open: isOpened,
      onOpenChange: setIsOpened,
      middleware: [offset(10)]
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);
    const {getFloatingProps, getReferenceProps} = useInteractions([click, dismiss]);

    const onClick = useCallback(() => {
      onClickControlBtn?.();
      if (mapControls?.mapDraw?.active) {
        onToggleMapControl('mapDraw');
      }
    }, [onClickControlBtn, onToggleMapControl, mapControls]);
    const onCloseClick = useCallback(
      e => {
        e.preventDefault();
        onToggleMapControl('mapLegend');
      },
      [onToggleMapControl]
    );
    const onPinClick = useCallback(
      e => {
        e.preventDefault();
        setIsOpened(false);
        onToggleMapControl('mapLegend');
      },
      [setIsOpened, onToggleMapControl]
    );

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
        mapState={mapState}
        onToggleSplitMapViewport={onToggleSplitMapViewport}
        isViewportUnsyncAllowed={isViewportUnsyncAllowed}
      >
        <MapLegend
          layers={layers}
          mapState={mapState}
          disableEdit={disableEdit}
          onLayerVisConfigChange={onLayerVisConfigChange}
        />
      </MapControlPanel>
    );

    if (isPinned) {
      // Pinned panel is not supported in export mode
      if (isExport) {
        return mapControlPanel;
      }
      const pinnedPanel = <PinToBottom offsetRight={offsetRight}>{mapControlPanel}</PinToBottom>;
      return createPortal(pinnedPanel, rootContext?.current || document.body);
    }

    return (
      <>
        {isOpened ? (
          <FloatingPortal root={rootContext?.current}>
            <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
              {mapControlPanel}
            </div>
          </FloatingPortal>
        ) : null}
        <div ref={refs.setReference} {...getReferenceProps()}>
          <MapControlTooltip id="show-legend" message="tooltip.showLegend">
            <MapControlButton className="map-control-button show-legend" onClick={onClick}>
              <actionIcons.legend height="22px" />
            </MapControlButton>
          </MapControlTooltip>
        </div>
      </>
    );
  };

  MapLegendPanel.displayName = 'MapLegendPanel';
  return MapLegendPanel;
}

export default MapLegendPanelFactory;
