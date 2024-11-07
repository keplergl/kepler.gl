// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import KeplerGlLogo from '../common/logo';

// factories
import SplitMapButtonFactory from './split-map-button';
import Toggle3dButtonFactory from './toggle-3d-button';
import LayerSelectorPanelFactory from './layer-selector-panel';
import MapLegendPanelFactory from './map-legend-panel';
import MapDrawPanelFactory from './map-draw-panel';
import LocalePanelFactory from './locale-panel';
import {Layer} from '@kepler.gl/layers';
import {Editor, LayerVisConfig, MapControls, MapState} from '@kepler.gl/types';
import {Datasets} from '@kepler.gl/table';
import {MapStateActions, UIStateActions} from '@kepler.gl/actions';

interface StyledMapControlProps {
  top?: number;
}

const StyledMapControl = styled.div<StyledMapControlProps>`
  right: 0;
  padding: ${props => props.theme.mapControl.padding}px;
  z-index: 10;
  margin-top: ${props => props.top || 0}px;
  position: absolute;
  display: grid;
  row-gap: 8px;
  justify-items: end;
  pointer-events: none; /* prevent padding from blocking input */
  & > * {
    /* all children should allow input */
    pointer-events: all;
  }
`;

const LegendLogo = <KeplerGlLogo version={false} appName="kepler.gl" />;

export type MapControlProps = {
  availableLocales: ReadonlyArray<string>;
  datasets: Datasets;
  dragRotate: boolean;
  isSplit: boolean;
  primary: boolean;
  layers: Layer[];
  layersToRender: {[key: string]: boolean};
  mapIndex: number;
  mapControls: MapControls;
  onTogglePerspective: () => void;
  onToggleSplitMap: typeof MapStateActions.toggleSplitMap;
  onToggleSplitMapViewport: ({
    isViewportSynced,
    isZoomLocked
  }: {
    isViewportSynced: boolean;
    isZoomLocked: boolean;
  }) => void;
  onMapToggleLayer: (layerId: string) => void;
  onToggleMapControl: (control: string) => void;
  onSetEditorMode: (mode: string) => void;
  onToggleEditorVisibility: () => void;
  onLayerVisConfigChange: (oldLayer: Layer, newVisConfig: Partial<LayerVisConfig>) => void;
  top: number;
  onSetLocale: typeof UIStateActions.setLocale;
  locale: string;
  logoComponent?: React.FC | React.ReactNode;
  isExport?: boolean;

  // optional
  mapState?: MapState;
  readOnly?: boolean;
  scale?: number;
  mapLayers?: {[key: string]: boolean};
  editor: Editor;
  actionComponents?: React.ComponentType<any>[];
  mapHeight?: number;
};

MapControlFactory.deps = [
  SplitMapButtonFactory,
  Toggle3dButtonFactory,
  LayerSelectorPanelFactory,
  MapLegendPanelFactory,
  MapDrawPanelFactory,
  LocalePanelFactory
];

function MapControlFactory(
  SplitMapButton: ReturnType<typeof SplitMapButtonFactory>,
  Toggle3dButton: ReturnType<typeof Toggle3dButtonFactory>,
  LayerSelectorPanel: ReturnType<typeof LayerSelectorPanelFactory>,
  MapLegendPanel: ReturnType<typeof MapLegendPanelFactory>,
  MapDrawPanel: ReturnType<typeof MapDrawPanelFactory>,
  LocalePanel: ReturnType<typeof LocalePanelFactory>
) {
  const DEFAULT_ACTIONS = [
    SplitMapButton,
    LayerSelectorPanel,
    Toggle3dButton,
    MapDrawPanel,
    LocalePanel,
    MapLegendPanel
  ];

  const MapControl: React.FC<MapControlProps> & {
    defaultActionComponents: MapControlProps['actionComponents'];
  } = ({
    actionComponents = DEFAULT_ACTIONS,
    isSplit = false,
    top = 0,
    mapIndex = 0,
    logoComponent = LegendLogo,
    ...restProps
  }) => {
    const actionComponentProps = {
      isSplit,
      mapIndex,
      logoComponent,
      ...restProps
    };
    return (
      <StyledMapControl className="map-control" top={top}>
        {actionComponents.map((ActionComponent, index) => (
          <ActionComponent key={index} className="map-control-action" {...actionComponentProps} />
        ))}
      </StyledMapControl>
    );
  };

  MapControl.defaultActionComponents = DEFAULT_ACTIONS;

  MapControl.displayName = 'MapControl';

  return MapControl;
}

export default MapControlFactory;
