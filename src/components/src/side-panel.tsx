// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {memo, useCallback, useMemo} from 'react';

import {
  EXPORT_DATA_ID,
  EXPORT_MAP_ID,
  EXPORT_VIDEO_ID,
  SHARE_MAP_ID,
  SIDEBAR_PANELS,
  OVERWRITE_MAP_ID,
  SAVE_MAP_ID,
  EXPORT_IMAGE_ID,
  ADD_DATA_ID,
  ADD_MAP_STYLE_ID
} from '@kepler.gl/constants';

import {BaseMap, Layers, FilterFunnel, PointerClick} from './common/icons';

import SidebarFactory from './side-panel/side-bar';
import PanelHeaderFactory from './side-panel/panel-header';
import PanelToggleFactory from './side-panel/panel-toggle';
import LayerManagerFactory from './side-panel/layer-manager';
import FilterManagerFactory from './side-panel/filter-manager';
import InteractionManagerFactory from './side-panel/interaction-manager';
import MapManagerFactory from './side-panel/map-manager';
import CustomPanelsFactory from './side-panel/custom-panel';

import styled from 'styled-components';
import {SidePanelProps, SidePanelItem} from './types';

/**
 * Custom `React.memo` comparator for `SidePanel`.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY THIS EXISTS
 * ─────────────────────────────────────────────────────────────────────────────
 * During map animation and mouse-move events the Redux store updates at
 * animation-frame frequency.  Without memoization every tick causes `KeplerGL`
 * to re-render, which rebuilds the `sidePanelSelector` result object and passes
 * it to `SidePanel`.  Because the selector returns a new object each time,
 * React re-renders `SidePanel` and its entire sub-tree even though nothing
 * visible in the panel actually changed.
 *
 * This comparator allows `SidePanel` to skip re-renders caused by animation
 * ticks or map-pan events while still updating promptly when the user edits a
 * layer, adds a dataset, toggles a filter, etc.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW IT WORKS
 * ─────────────────────────────────────────────────────────────────────────────
 * The comparator iterates every key in `next`.  For each key:
 *   • If `prev[key] === next[key]`  →  skip (no change, no re-render needed).
 *   • If the key has a custom handler below  →  apply partial deep comparison
 *     that intentionally ignores high-frequency sub-fields.
 *   • Otherwise  →  `return false` (unrecognised change, always re-render).
 *
 * Returning `true`  = props are "equal" → React skips the re-render.
 * Returning `false` = props differ      → React re-renders the component.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PROP-BY-PROP CONTRACT  (covers every key in SidePanelProps)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  appName, appWebsite, version, onSaveMap      — reference/value equality (fallthrough)
 *  width                                        — value equality (fallthrough)
 *  layerBlending, overlayBlending               — value equality (fallthrough)
 *  layerClasses                                 — reference equality (fallthrough)
 *  interactionConfig                            — reference equality (fallthrough)
 *  mapInfo                                      — reference equality (fallthrough)
 *  mapStyle                                     — reference equality (fallthrough)
 *  mapSaved                                     — value equality (fallthrough)
 *  availableProviders                           — reference equality (fallthrough)
 *  panels                                       — reference equality (fallthrough)
 *                                                 NOTE: pass a stable reference (defined
 *                                                 outside the render function) or memo
 *                                                 the array — a new `[...]` literal on
 *                                                 every render defeats the optimisation.
 *  uiState                                      — reference equality (fallthrough)
 *                                                 Redux produces a new reference for any
 *                                                 uiState change, so this is correct and
 *                                                 ensures the SidePanel always reflects
 *                                                 the latest UI state.
 *  uiStateActions, visStateActions,
 *  mapStateActions, mapStyleActions             — reference equality (fallthrough)
 *                                                 Action creators are stable across renders.
 *
 *  mapState                                     — PARTIALLY SUPPRESSED
 *                                                 mapState.latitude/longitude/zoom/bearing/
 *                                                 pitch change on every animation frame
 *                                                 during pan/zoom.  SidePanel only uses
 *                                                 mapState.globe.enabled (in MapManager to
 *                                                 show/hide the globe-config panel), so
 *                                                 only that field triggers a re-render.
 *
 *  filters                                      — PARTIALLY SUPPRESSED
 *                                                 Always compared: id, name, type, dataId,
 *                                                 view, enabled, plotType, animationWindow,
 *                                                 speed, gpu.
 *                                                 `value` is only compared when the filter
 *                                                 panel is open — otherwise animation ticks
 *                                                 that continuously update filter values
 *                                                 (time-range slider) would cause the panel
 *                                                 to re-render on every frame.
 *
 *  layers                                       — PARTIALLY SUPPRESSED
 *                                                 Always compared: id, type, config.isVisible,
 *                                                 config.label.
 *                                                 When the layer panel is open, also compared:
 *                                                 config.isConfigActive, config.color,
 *                                                 config.highlightColor, config.visConfig,
 *                                                 config.dataId, config.columns.
 *                                                 Other config fields (e.g. per-layer
 *                                                 animation state) are suppressed when the
 *                                                 panel is closed.
 *
 *  layerOrder                                   — ALWAYS RE-RENDERS
 *                                                 Changes when the user drags layers to
 *                                                 reorder them.  Always triggers re-render.
 *
 *  datasets                                     — PARTIALLY SUPPRESSED
 *                                                 Compared per dataset: id, label, color,
 *                                                 fields (ref), dataContainer (ref).
 *                                                 Internal dataset mutations that don't
 *                                                 change these refs are suppressed.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * MAINTENANCE RULES — READ BEFORE EDITING
 * ─────────────────────────────────────────────────────────────────────────────
 *  1. Adding a prop to SidePanelProps:
 *       • If it is a stable scalar or reference (e.g. a Redux slice or action
 *         creator): the fallthrough `return false` handles it correctly.
 *         No change needed here, but add a row to the prop table above.
 *       • If it is an object recreated on every render that contains
 *         high-frequency fields (like mapState): add an explicit handler
 *         that suppresses the irrelevant sub-fields.
 *
 *  2. Adding a field to `filters`, `layers`, or `datasets`:
 *       • Decide whether SidePanel needs to see the field while the relevant
 *         panel is closed.  If yes, add it to the "always compared" section.
 *         If no (e.g. an animation-tick value), add it to the panel-open guard.
 *
 *  3. Never remove a check without verifying the corresponding panel still
 *     updates correctly when that field changes in a real browser session.
 *
 *  4. All comparator behaviour is covered by areSidePanelPropsEqual tests in
 *     side-panel.spec.tsx.  Add a test for every new case.
 */
export const areSidePanelPropsEqual = (prev: SidePanelProps, next: SidePanelProps): boolean => {
  const keys = Object.keys(next) as (keyof SidePanelProps)[];
  for (const key of keys) {
    if (prev[key] === next[key]) continue;

    if (key === 'filters') {
      const pf = prev.filters;
      const nf = next.filters;
      if (pf?.length !== nf?.length) return false;
      const isFilterPanelOpen = (next as any).uiState?.activeSidePanel === 'filter';
      for (let i = 0; i < nf.length; i++) {
        if (pf[i] === nf[i]) continue;
        if (pf[i].id !== nf[i].id) return false;
        if (pf[i].name !== nf[i].name) return false;
        if (pf[i].type !== nf[i].type) return false;
        if (pf[i].dataId !== nf[i].dataId) return false;
        if (pf[i].view !== nf[i].view) return false;
        if (pf[i].enabled !== nf[i].enabled) return false;
        if (pf[i].plotType !== nf[i].plotType) return false;
        if ((pf[i] as any).animationWindow !== (nf[i] as any).animationWindow) return false;
        if (pf[i].speed !== nf[i].speed) return false;
        if (pf[i].gpu !== nf[i].gpu) return false;
        // Always check value when the filter panel is open so the panel stays up-to-date.
        // Outside the panel, suppress value changes to avoid re-renders during animation.
        if (isFilterPanelOpen) {
          if (pf[i].value !== nf[i].value) return false;
        }
      }
      continue;
    }

    if (key === 'datasets') {
      const pd = prev.datasets;
      const nd = next.datasets;
      const pKeys = Object.keys(pd || {});
      const nKeys = Object.keys(nd || {});
      if (pKeys.length !== nKeys.length) return false;
      for (const dk of nKeys) {
        if (!pd?.[dk]) return false;
        if (pd[dk] === nd[dk]) continue;
        if (pd[dk].id !== nd[dk].id) return false;
        if (pd[dk].label !== nd[dk].label) return false;
        if (pd[dk].color !== nd[dk].color) return false;
        if (pd[dk].fields !== nd[dk].fields) return false;
        if (pd[dk].dataContainer !== nd[dk].dataContainer) return false;
      }
      continue;
    }

    if (key === 'layers') {
      const pl = prev.layers;
      const nl = next.layers;
      if (pl?.length !== nl?.length) return false;
      const isLayerPanelOpen = (next as any).uiState?.activeSidePanel === 'layer';
      for (let i = 0; i < nl.length; i++) {
        if (pl[i] === nl[i]) continue;
        if (pl[i].id !== nl[i].id) return false;
        if (pl[i].type !== nl[i].type) return false;
        if (pl[i].config.isVisible !== nl[i].config.isVisible) return false;
        if (pl[i].config.label !== nl[i].config.label) return false;
        // When the layer panel is open, also check config fields visible in the panel UI
        if (isLayerPanelOpen) {
          if (pl[i].config.isConfigActive !== nl[i].config.isConfigActive) return false;
          if (pl[i].config.color !== nl[i].config.color) return false;
          if (pl[i].config.highlightColor !== nl[i].config.highlightColor) return false;
          if (pl[i].config.visConfig !== nl[i].config.visConfig) return false;
          if (pl[i].config.dataId !== nl[i].config.dataId) return false;
          if (pl[i].config.columns !== nl[i].config.columns) return false;
        }
      }
      continue;
    }

    if (key === 'layerOrder') {
      // layerOrder changes during drag-and-drop reordering — always re-render
      return false;
    }

    if (key === 'mapState') {
      // mapState changes on every pan/zoom frame (latitude, longitude, zoom, bearing, pitch).
      // SidePanel only cares about globe.enabled (used in MapManager to conditionally
      // show the globe settings panel). Suppress all other mapState changes.
      const pm = prev.mapState;
      const nm = next.mapState;
      if (pm?.globe?.enabled !== nm?.globe?.enabled) return false;
      continue;
    }

    return false;
  }
  return true;
};

export const StyledSidePanelContent = styled.div`
  ${props => props.theme.sidePanelScrollBar};
  flex-grow: 1;
  padding: ${props => props.theme.sidePanelInnerPadding}px;
  overflow-y: scroll;
  overflow-x: hidden;

  .side-panel__content__inner {
    display: flex;
    height: 100%;
    flex-direction: column;
  }
`;

SidePanelFactory.deps = [
  SidebarFactory,
  PanelHeaderFactory,
  PanelToggleFactory,
  LayerManagerFactory,
  FilterManagerFactory,
  InteractionManagerFactory,
  MapManagerFactory,
  CustomPanelsFactory
];

/**
 * Vertical sidebar containing input components for the rendering layers
 */
export default function SidePanelFactory(
  Sidebar: ReturnType<typeof SidebarFactory>,
  PanelHeader: ReturnType<typeof PanelHeaderFactory>,
  PanelToggle: ReturnType<typeof PanelToggleFactory>,
  LayerManager: ReturnType<typeof LayerManagerFactory>,
  FilterManager: ReturnType<typeof FilterManagerFactory>,
  InteractionManager: ReturnType<typeof InteractionManagerFactory>,
  MapManager: ReturnType<typeof MapManagerFactory>,
  CustomPanels: ReturnType<typeof CustomPanelsFactory>
) {
  // inject components
  const SIDEBAR_COMPONENTS = {
    layer: LayerManager,
    filter: FilterManager,
    interaction: InteractionManager,
    map: MapManager
  };

  const SIDEBAR_ICONS = {
    layer: props => <Layers {...props} height="18px" />,
    filter: props => <FilterFunnel {...props} height="18px" />,
    interaction: props => <PointerClick {...props} height="18px" />,
    map: props => <BaseMap {...props} height="18px" />
  };

  // We should defined sidebar panels here but keeping them for backward compatible
  const defaultSidePanels: SidePanelItem[] = SIDEBAR_PANELS.map(component => ({
    ...component,
    component: SIDEBAR_COMPONENTS[component.id],
    iconComponent: SIDEBAR_ICONS[component.id]
  }));

  const fullPanels = [...defaultSidePanels, ...(CustomPanels.panels || [])];

  const getCustomPanelProps = CustomPanels.getProps || (() => ({}));

  // eslint-disable-next-line max-statements
  const SidePanel: React.FC<SidePanelProps> & {defaultPanels: SidePanelProps['panels']} = (
    props: SidePanelProps
  ) => {
    const {
      appName,
      appWebsite,
      availableProviders = {},
      datasets,
      filters,
      layers,
      layerBlending,
      overlayBlending,
      layerClasses,
      layerOrder,
      interactionConfig,
      panels = fullPanels,
      mapInfo = {},
      mapSaved,
      mapState,
      mapStateActions,
      mapStyle,
      mapStyleActions,
      onSaveMap,
      uiState,
      uiStateActions,
      visStateActions,
      version,
      width
    } = props;
    const {openDeleteModal, toggleModal, toggleSidePanel} = uiStateActions;
    const {activeSidePanel} = uiState;
    const {setMapInfo, showDatasetTable, updateTableColor} = visStateActions;
    const {hasShare, hasStorage} = availableProviders;

    const {title} = mapInfo;

    const isOpen = Boolean(activeSidePanel);

    const _onOpenOrClose = useCallback(
      () => toggleSidePanel(activeSidePanel ? '' : 'layer'),
      [activeSidePanel, toggleSidePanel]
    );

    const onClickExportImage = useCallback(() => toggleModal(EXPORT_IMAGE_ID), [toggleModal]);
    const onClickExportData = useCallback(() => toggleModal(EXPORT_DATA_ID), [toggleModal]);
    const onClickExportMap = useCallback(() => toggleModal(EXPORT_MAP_ID), [toggleModal]);
    const onClickExportVideo = useCallback(() => toggleModal(EXPORT_VIDEO_ID), [toggleModal]);
    const onClickSaveToStorage = useCallback(
      () => toggleModal(mapSaved ? OVERWRITE_MAP_ID : SAVE_MAP_ID),
      [mapSaved, toggleModal]
    );
    const onClickSaveAsToStorage = useCallback(() => {
      setMapInfo({
        title: `${title || 'Kepler.gl'} (Copy)`
      });

      toggleModal(SAVE_MAP_ID);
    }, [title, setMapInfo, toggleModal]);
    const onClickShareMap = useCallback(() => toggleModal(SHARE_MAP_ID), [toggleModal]);
    const onShowDatasetTable = useCallback(dataId => showDatasetTable(dataId), [showDatasetTable]);
    const onUpdateTableColor = useCallback(
      (dataId, newColor) => updateTableColor(dataId, newColor),
      [updateTableColor]
    );
    const onShowAddDataModal = useCallback(() => toggleModal(ADD_DATA_ID), [toggleModal]);
    const onShowAddMapStyleModal = useCallback(() => toggleModal(ADD_MAP_STYLE_ID), [toggleModal]);
    const onRemoveDataset = useCallback(dataId => openDeleteModal(dataId), [openDeleteModal]);

    const currentPanel = useMemo(
      () => panels.find(({id}) => id === activeSidePanel) || null,
      [activeSidePanel, panels]
    );

    const customPanelProps = useMemo(() => getCustomPanelProps(props), [props]) as Record<
      string,
      any
    >;
    const PanelComponent = currentPanel?.component;

    return (
      <Sidebar
        width={width}
        isOpen={isOpen}
        shouldShowCollapseButton={uiState.isSidePanelCloseButtonVisible}
        minifiedWidth={0}
        onOpenOrClose={_onOpenOrClose}
      >
        <PanelHeader
          appName={appName}
          version={version}
          appWebsite={appWebsite}
          visibleDropdown={uiState.visibleDropdown}
          showExportDropdown={uiStateActions.showExportDropdown}
          hideExportDropdown={uiStateActions.hideExportDropdown}
          onExportImage={onClickExportImage}
          onExportData={onClickExportData}
          onExportMap={onClickExportMap}
          onExportVideo={onClickExportVideo}
          onSaveMap={hasStorage ? onSaveMap : undefined}
          onSaveToStorage={hasStorage ? onClickSaveToStorage : null}
          onSaveAsToStorage={hasStorage && mapSaved ? onClickSaveAsToStorage : null}
          onShareMap={hasShare ? onClickShareMap : null}
        />
        {/* the next two components should be moved into one */}
        {/* but i am keeping them because of backward compatibility */}
        <PanelToggle
          panels={panels}
          activePanel={activeSidePanel}
          togglePanel={uiStateActions.toggleSidePanel}
        />
        <StyledSidePanelContent className="side-panel__content">
          <div className="side-panel__content__inner">
            {PanelComponent ? (
              <PanelComponent
                datasets={datasets}
                filters={filters}
                layers={layers}
                layerClasses={layerClasses}
                layerOrder={layerOrder}
                layerBlending={layerBlending}
                overlayBlending={overlayBlending}
                mapStyle={mapStyle}
                mapState={mapState}
                mapStyleActions={mapStyleActions}
                mapStateActions={mapStateActions}
                interactionConfig={interactionConfig}
                removeDataset={onRemoveDataset}
                showDatasetTable={onShowDatasetTable}
                updateTableColor={onUpdateTableColor}
                showAddDataModal={onShowAddDataModal}
                showAddMapStyleModal={onShowAddMapStyleModal}
                uiStateActions={uiStateActions}
                visStateActions={visStateActions}
                panelMetadata={currentPanel}
                panelListView={
                  currentPanel?.id === 'layer'
                    ? uiState.layerPanelListView
                    : currentPanel?.id === 'filter'
                    ? uiState.filterPanelListView
                    : null
                }
              />
            ) : null}
            <CustomPanels
              {...customPanelProps}
              activeSidePanel={activeSidePanel}
              updateTableColor={onUpdateTableColor}
            />
          </div>
        </StyledSidePanelContent>
      </Sidebar>
    );
  };

  SidePanel.defaultPanels = fullPanels;

  const MemoizedSidePanel = memo(SidePanel, areSidePanelPropsEqual) as React.NamedExoticComponent<SidePanelProps> & {
    defaultPanels: SidePanelProps['panels'];
  };
  MemoizedSidePanel.displayName = 'SidePanel';
  (MemoizedSidePanel as any).defaultPanels = fullPanels;
  return MemoizedSidePanel;
}
