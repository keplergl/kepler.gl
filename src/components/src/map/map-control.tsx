// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import KeplerGlLogo from '../common/logo';

// factories
import SplitMapButtonFactory from './split-map-button';
import Toggle3dButtonFactory from './toggle-3d-button';
import MapLegendPanelFactory from './map-legend-panel';
import MapDrawPanelFactory from './map-draw-panel';
import LocalePanelFactory from './locale-panel';
import MapNavigationControlFactory from './map-navigation-control';
import {Layer} from '@kepler.gl/layers';
import {Editor, LayerVisConfig, LayerOrder, MapControls, MapState} from '@kepler.gl/types';
import {Datasets} from '@kepler.gl/table';
import {MapStateActions, UIStateActions} from '@kepler.gl/actions';
import {getApplicationConfig} from '@kepler.gl/utils';
import {MapViewMode} from '@kepler.gl/constants';

import AnnotationControlFactory from './annotations/annotation-control';

interface StyledMapControlProps {
  $top?: number;
}

const StyledMapControl = styled.div<StyledMapControlProps>`
  right: 0;
  padding: ${props => props.theme.mapControl.padding}px;
  z-index: 10;
  margin-top: ${props => props.$top || 0}px;
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
  datasets: Datasets;
  dragRotate: boolean;
  isSplit: boolean;
  primary: boolean;
  layers: Layer[];
  layerOrder?: LayerOrder;
  layersToRender: {[key: string]: boolean};
  mapIndex: number;
  mapControls: MapControls;
  onTogglePerspective: () => void;
  onSetMapViewMode?: (mode: MapViewMode) => void;
  mapViewMode?: MapViewMode;
  onToggleSplitMap: typeof MapStateActions.toggleSplitMap;
  onSetMapSplitMode?: typeof MapStateActions.setMapSplitMode;
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
  onToggleLayerVisibility?: (layer: Layer) => void;
  top: number;
  onSetLocale: typeof UIStateActions.setLocale;
  availableLocales: string[];
  locale: string;
  logoComponent?: React.FC | React.ReactNode;
  isExport?: boolean;

  setMapControlSettings: typeof UIStateActions.setMapControlSettings;
  activeSidePanel: string | null;

  // optional
  mapState?: MapState;
  mapStateActions?: typeof MapStateActions;
  readOnly?: boolean;
  scale?: number;
  mapLayers?: {[key: string]: boolean};
  editor: Editor;
  actionComponents?: React.ComponentType<any>[];
  mapHeight?: number;
  splitMaps?: {layers: {[key: string]: boolean}}[];
  onToggleLayerForMap?: (mapIndex: number, layerId: string) => void;
};

MapControlFactory.deps = [
  SplitMapButtonFactory,
  Toggle3dButtonFactory,
  MapLegendPanelFactory,
  MapDrawPanelFactory,
  LocalePanelFactory,
  AnnotationControlFactory,
  MapNavigationControlFactory
];

function MapControlFactory(
  SplitMapButton: ReturnType<typeof SplitMapButtonFactory>,
  Toggle3dButton: ReturnType<typeof Toggle3dButtonFactory>,
  MapLegendPanel: ReturnType<typeof MapLegendPanelFactory>,
  MapDrawPanel: ReturnType<typeof MapDrawPanelFactory>,
  LocalePanel: ReturnType<typeof LocalePanelFactory>,
  AnnotationControl: ReturnType<typeof AnnotationControlFactory>,
  MapNavigationControl: ReturnType<typeof MapNavigationControlFactory>
) {
  const DEFAULT_ACTIONS = [
    SplitMapButton,
    Toggle3dButton,
    MapDrawPanel,
    AnnotationControl,
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
    mapState,
    mapStateActions,
    ...restProps
  }) => {
    const actionComponentProps = {
      isSplit,
      mapIndex,
      logoComponent,
      mapState,
      onSetMapSplitMode: getApplicationConfig().enableSwipeMode
        ? mapStateActions?.setMapSplitMode
        : undefined,
      ...restProps
    };
    return (
      <StyledMapControl className="map-control" $top={top}>
        {actionComponents.map((ActionComponent, index) => (
          <ActionComponent key={index} className="map-control-action" {...actionComponentProps} />
        ))}
        {mapState && mapStateActions ? (
          <MapNavigationControl
            mapState={mapState}
            mapIndex={mapIndex}
            mapStateActions={mapStateActions}
          />
        ) : null}
      </StyledMapControl>
    );
  };

  MapControl.defaultActionComponents = DEFAULT_ACTIONS;

  MapControl.displayName = 'MapControl';

  return MapControl;
}

export default MapControlFactory;
