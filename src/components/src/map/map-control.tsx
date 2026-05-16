// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {memo} from 'react';
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
  LocalePanelFactory,
  AnnotationControlFactory
];

function MapControlFactory(
  SplitMapButton: ReturnType<typeof SplitMapButtonFactory>,
  Toggle3dButton: ReturnType<typeof Toggle3dButtonFactory>,
  LayerSelectorPanel: ReturnType<typeof LayerSelectorPanelFactory>,
  MapLegendPanel: ReturnType<typeof MapLegendPanelFactory>,
  MapDrawPanel: ReturnType<typeof MapDrawPanelFactory>,
  LocalePanel: ReturnType<typeof LocalePanelFactory>,
  AnnotationControl: ReturnType<typeof AnnotationControlFactory>
) {
  const DEFAULT_ACTIONS = [
    SplitMapButton,
    LayerSelectorPanel,
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
    ...restProps
  }) => {
    const actionComponentProps = {
      isSplit,
      mapIndex,
      logoComponent,
      ...restProps
    };
    return (
      <StyledMapControl className="map-control" $top={top}>
        {actionComponents.map((ActionComponent, index) => (
          <ActionComponent key={index} className="map-control-action" {...actionComponentProps} />
        ))}
      </StyledMapControl>
    );
  };

  MapControl.defaultActionComponents = DEFAULT_ACTIONS;

  MapControl.displayName = 'MapControl';

  const areMapControlPropsEqual = (prev: MapControlProps, next: MapControlProps): boolean => {
    const keys = Object.keys(next) as (keyof MapControlProps)[];
    for (const key of keys) {
      if (prev[key] === next[key]) continue;

      if (key === 'layers') {
        const pl = prev.layers;
        const nl = next.layers;
        if (!pl || !nl || pl.length !== nl.length) return false;
        for (let i = 0; i < nl.length; i++) {
          if (pl[i] === nl[i]) continue;
          if (pl[i].id !== nl[i].id) return false;
          if (pl[i].config.isVisible !== nl[i].config.isVisible) return false;
          if (pl[i].config.label !== nl[i].config.label) return false;
          if (pl[i].config.isConfigActive !== nl[i].config.isConfigActive) return false;
        }
        continue;
      }

      if (key === 'datasets') {
        const pd = prev.datasets;
        const nd = next.datasets;
        if (!pd || !nd) return false;
        const pKeys = Object.keys(pd);
        const nKeys = Object.keys(nd);
        if (pKeys.length !== nKeys.length) return false;
        for (const dk of nKeys) {
          if (!pd[dk]) return false;
          if (pd[dk] === nd[dk]) continue;
          if (pd[dk].id !== nd[dk].id) return false;
          if (pd[dk].label !== nd[dk].label) return false;
          if (pd[dk].color !== nd[dk].color) return false;
        }
        continue;
      }

      if (key === 'layersToRender') {
        const pl = prev.layersToRender;
        const nl = next.layersToRender;
        if (!pl || !nl) return false;
        const pKeys = Object.keys(pl);
        const nKeys = Object.keys(nl);
        if (pKeys.length !== nKeys.length) return false;
        for (const lk of nKeys) {
          if (pl[lk] !== nl[lk]) return false;
        }
        continue;
      }

      return false;
    }
    return true;
  };

  const MemoizedMapControl = memo(MapControl, areMapControlPropsEqual) as React.NamedExoticComponent<MapControlProps> & {
    defaultActionComponents: MapControlProps['actionComponents'];
  };
  (MemoizedMapControl as any).defaultActionComponents = DEFAULT_ACTIONS;

  return MemoizedMapControl;
}

export default MapControlFactory;
