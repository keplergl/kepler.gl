// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {memo} from 'react';
import styled from 'styled-components';
import KeplerGlLogo from '../common/logo';

// factories
import SplitMapButtonFactory from './split-map-button';
import Toggle3dButtonFactory from './toggle-3d-button';
import MapLegendPanelFactory from './map-legend-panel';
import MapDrawPanelFactory from './map-draw-panel';
import LocalePanelFactory from './locale-panel';
import ThemeToggleButtonFactory from './theme-toggle-button';
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
  onConvertEditorFeaturesToLayer?: () => void;
  onLayerVisConfigChange: (oldLayer: Layer, newVisConfig: Partial<LayerVisConfig>) => void;
  onToggleLayerVisibility?: (layer: Layer) => void;
  top: number;
  onSetLocale: typeof UIStateActions.setLocale;
  onSetTheme: typeof UIStateActions.setTheme;
  availableLocales: string[];
  locale: string;
  themeName?: string;
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

/**
 * Custom `React.memo` comparator for `MapControl`.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY THIS EXISTS
 * ─────────────────────────────────────────────────────────────────────────────
 * `MapControl` sits inside `MapContainer`, which re-renders on every Redux
 * state update (including animation ticks and mouse-move events).  Most of
 * those updates are irrelevant to the map controls UI.  This comparator
 * prevents `MapControl` from re-rendering unless something visible in the
 * controls (layer legend, dataset list, viewport sync button, etc.) actually
 * changed.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW IT WORKS
 * ─────────────────────────────────────────────────────────────────────────────
 * The comparator iterates every key in `next`.  For each key:
 *   • If `prev[key] === next[key]`  →  skip (no change, no re-render needed).
 *   • If the key has a custom handler below  →  apply field-level comparison
 *     that only checks fields actually rendered by MapControl.
 *   • Otherwise  →  `return false` (unrecognised change, always re-render).
 *
 * Returning `true`  = props are "equal" → React skips the re-render.
 * Returning `false` = props differ      → React re-renders the component.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PROP-BY-PROP CONTRACT  (covers every key in MapControlProps)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  dragRotate, isSplit, primary               — value equality (fallthrough)
 *  mapIndex, top                              — value equality (fallthrough)
 *  locale, availableLocales                   — value equality (fallthrough)
 *  activeSidePanel                            — value equality (fallthrough)
 *  readOnly, scale, mapHeight                 — value equality (fallthrough)
 *  mapViewMode                                — value equality (fallthrough)
 *  isExport                                   — value equality (fallthrough)
 *  logoComponent                              — reference equality (fallthrough)
 *  actionComponents                           — reference equality (fallthrough)
 *                                               NOTE: pass a stable reference — a new
 *                                               `[...]` literal on every render defeats
 *                                               the optimisation.
 *  mapControls                                — reference equality (fallthrough)
 *                                               Redux produces a new reference when any
 *                                               map control setting changes, so this is
 *                                               correct.
 *  mapState, mapStateActions                  — reference equality (fallthrough)
 *                                               mapState changes on every animation frame
 *                                               during pan/zoom; MapControl does NOT
 *                                               receive mapState directly — it receives
 *                                               specific action dispatchers.  If mapState
 *                                               is ever passed directly, add a handler
 *                                               like the one in areSidePanelPropsEqual.
 *  splitMaps                                  — reference equality (fallthrough)
 *  editor                                     — reference equality (fallthrough)
 *  onTogglePerspective, onToggleSplitMap,
 *  onToggleSplitMapViewport, onMapToggleLayer,
 *  onToggleMapControl, onSetEditorMode,
 *  onToggleEditorVisibility,
 *  onLayerVisConfigChange,
 *  onToggleLayerVisibility, onSetLocale,
 *  onSetMapSplitMode, onSetMapViewMode,
 *  setMapControlSettings,
 *  onToggleLayerForMap                        — reference equality (fallthrough)
 *                                               Callbacks should be stable references
 *                                               (e.g. from Redux bindActionCreators or
 *                                               useCallback).
 *  mapLayers                                  — reference equality (fallthrough)
 *
 *  layers                                     — PARTIALLY COMPARED
 *                                               Checks: id, type, config.isVisible,
 *                                               config.label, config.isConfigActive,
 *                                               config.color, config.highlightColor.
 *                                               These are the fields shown in the legend.
 *                                               Other config fields (e.g. visConfig,
 *                                               columns) are not rendered by MapControl
 *                                               and are intentionally suppressed.
 *
 *  datasets                                   — PARTIALLY COMPARED
 *                                               Checks per dataset: id, label, color.
 *                                               The dataset list is shown in the legend.
 *                                               Heavy fields (fields array, dataContainer)
 *                                               are not rendered and are suppressed.
 *
 *  layersToRender                             — DEEP-COMPARED
 *                                               Each `layerId → boolean` entry is compared
 *                                               individually.  A change in any entry
 *                                               triggers a re-render (layer visibility in
 *                                               the legend).
 *
 *  layerOrder                                 — reference equality (fallthrough)
 *                                               MapControl renders layers in `layers` order,
 *                                               not `layerOrder` order, so layerOrder
 *                                               changes do not require special handling.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * MAINTENANCE RULES — READ BEFORE EDITING
 * ─────────────────────────────────────────────────────────────────────────────
 *  1. Adding a prop to MapControlProps:
 *       • If it is a stable scalar, callback, or Redux-slice reference:
 *         the fallthrough `return false` handles it correctly.
 *         No change needed here, but add a row to the prop table above.
 *       • If it is a large object with irrelevant high-frequency sub-fields:
 *         add an explicit handler that only checks the fields MapControl
 *         actually renders.
 *
 *  2. Adding a field rendered in the legend to `layers` or `datasets`:
 *       Add it to the respective handler so changes to that field trigger
 *       a re-render.
 *
 *  3. Never remove a check without verifying the legend still updates
 *     correctly when that field changes in a real browser session.
 *
 *  4. All comparator behaviour is covered by areMapControlPropsEqual tests in
 *     map-control.spec.tsx.  Add a test for every new case.
 */
export const areMapControlPropsEqual = (prev: MapControlProps, next: MapControlProps): boolean => {
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
        if (pl[i].type !== nl[i].type) return false;
        if (pl[i].config.isVisible !== nl[i].config.isVisible) return false;
        if (pl[i].config.label !== nl[i].config.label) return false;
        if (pl[i].config.isConfigActive !== nl[i].config.isConfigActive) return false;
        // color is shown in the legend panel
        if (pl[i].config.color !== nl[i].config.color) return false;
        if (pl[i].config.highlightColor !== nl[i].config.highlightColor) return false;
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

MapControlFactory.deps = [
  SplitMapButtonFactory,
  Toggle3dButtonFactory,
  MapLegendPanelFactory,
  MapDrawPanelFactory,
  LocalePanelFactory,
  ThemeToggleButtonFactory,
  AnnotationControlFactory,
  MapNavigationControlFactory
];

function MapControlFactory(
  SplitMapButton: ReturnType<typeof SplitMapButtonFactory>,
  Toggle3dButton: ReturnType<typeof Toggle3dButtonFactory>,
  MapLegendPanel: ReturnType<typeof MapLegendPanelFactory>,
  MapDrawPanel: ReturnType<typeof MapDrawPanelFactory>,
  LocalePanel: ReturnType<typeof LocalePanelFactory>,
  ThemeToggleButton: ReturnType<typeof ThemeToggleButtonFactory>,
  AnnotationControl: ReturnType<typeof AnnotationControlFactory>,
  MapNavigationControl: ReturnType<typeof MapNavigationControlFactory>
) {
  const DEFAULT_ACTIONS = [
    SplitMapButton,
    Toggle3dButton,
    MapDrawPanel,
    AnnotationControl,
    LocalePanel,
    ThemeToggleButton,
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
    themeName,
    onSetTheme,
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
      ...restProps,
      themeName,
      onSetTheme
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

  const MemoizedMapControl = memo(MapControl, areMapControlPropsEqual) as React.NamedExoticComponent<MapControlProps> & {
    defaultActionComponents: MapControlProps['actionComponents'];
  };
  (MemoizedMapControl as any).defaultActionComponents = DEFAULT_ACTIONS;

  return MemoizedMapControl;
}

export default MapControlFactory;
