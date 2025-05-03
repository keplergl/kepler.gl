// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import classnames from 'classnames';
import {createPortal} from 'react-dom';
import React, {
  ComponentType,
  FC,
  forwardRef,
  useCallback,
  useContext,
  useRef,
  PropsWithChildren
} from 'react';
import styled, {withTheme} from 'styled-components';

import {DndContext, useDraggable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';
import {useMergeRefs} from '@floating-ui/react';

import {ActionHandler, setMapControlSettings, toggleSplitMapViewport} from '@kepler.gl/actions';
import {Layer} from '@kepler.gl/layers';
import {breakPointValues} from '@kepler.gl/styles';
import {LayerVisConfig, MapControlMapLegend, MapControls, MapState} from '@kepler.gl/types';
import {hasPortableWidth} from '@kepler.gl/utils';
import {MapLegendControlSettings} from '@kepler.gl/types';

import {Legend, DraggableDots, HorizontalResizeHandle} from '../common/icons';
import {MapControlButton} from '../common/styled-components';
import {RootContext} from '../context';
import useLegendPosition from '../hooks/use-legend-position';
import MapControlPanelFactory from './map-control-panel';
import MapControlTooltipFactory from './map-control-tooltip';
import MapLegendFactory from './map-legend';
import {restrictToWindowEdges} from '@dnd-kit/modifiers';

const DRAG_RESIZE_ID = 'map-legend-resize';
const DRAG_MOVE_ID = 'map-legend-move';

const StyledDraggableLegendContent = styled.div<{contentHeight?: number}>`
  position: absolute;
  outline: none;
  transition: border-color 0.2s ease-in-out;
  border: 1px solid transparent;
  .legend-input-block {
    display: none;
  }
  &.is-dragging .legend-input-block {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
  }
  &:hover,
  &.is-dragging {
    .legend-move-handle {
      opacity: 1;
      pointer-events: auto;
    }
    .legend-resize-handle {
      opacity: 1;
      pointer-events: auto;
    }
    border-color: ${props => props.theme.activeColor};
  }
  .map-control__panel-content {
    max-height: calc(100vh - 100px);
    ${props => (props.contentHeight ? `height: ${props.contentHeight}px;` : '')};
  }
  border-radius: 4px;
  z-index: 2;
  .map-control-panel {
    margin-bottom: 0 !important;
  }
`;

const StyledMoveHandle = styled.div`
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  z-index: 2;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 16px;
  border-radius: 4px;
  cursor: move;
  background-color: ${props => props.theme.activeColor};
`;

const StyledResizeHandle = styled.div`
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #f7f8fa;
  z-index: 2;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 16px;
  border-radius: 4px;
  cursor: ns-resize;
`;

export type MapLegendPanelFactoryDeps = [
  typeof MapControlTooltipFactory,
  typeof MapControlPanelFactory,
  typeof MapLegendFactory
];

type DraggableLegendContentProps = {
  contentHeight?: number;
  positionStyles: Record<string, unknown>;
  children: React.ReactNode;
};

const DraggableLegendContent = forwardRef((props: DraggableLegendContentProps, ref) => {
  const {positionStyles, children} = props;
  const draggableMove = useDraggable({id: DRAG_MOVE_ID});
  const draggableResize = useDraggable({id: DRAG_RESIZE_ID});
  const refs = useMergeRefs([draggableMove.setNodeRef, ref]);
  const isDragging = draggableMove.isDragging || draggableResize.isDragging;
  return (
    <StyledDraggableLegendContent
      ref={refs}
      className={classnames('draggable-legend', {'is-dragging': isDragging})}
      style={{...positionStyles, transform: CSS.Translate.toString(draggableMove.transform)}}
      contentHeight={props.contentHeight}
      {...draggableMove.attributes}
    >
      {children}
      {isDragging ? <div className="legend-input-block" /> : null}
      <StyledMoveHandle className="legend-move-handle" {...draggableMove.listeners}>
        <DraggableDots height="16px" />
      </StyledMoveHandle>
      <StyledResizeHandle
        className="legend-resize-handle"
        ref={draggableResize.setNodeRef}
        {...draggableResize.listeners}
      >
        <HorizontalResizeHandle height="16px" />
      </StyledResizeHandle>
    </StyledDraggableLegendContent>
  );
});

type DraggableLegendProps = PropsWithChildren<{
  isSidePanelShown: boolean;
  mapControls: MapControls;
  setMapControlSettings: typeof setMapControlSettings;
}>;

const DraggableLegend = withTheme(
  ({
    isSidePanelShown,
    children,
    mapControls,
    setMapControlSettings,
    theme
  }: DraggableLegendProps & {theme: any}) => {
    const settings = mapControls?.mapLegend?.settings;

    const legendContentRef = useRef<HTMLElement>(null);
    const onChangeSettings = useCallback(
      newSettings => setMapControlSettings('mapLegend', newSettings),
      [setMapControlSettings]
    );
    const {positionStyles, updatePosition, startResize, resize, contentHeight} = useLegendPosition({
      legendContentRef,
      isSidePanelShown,
      theme,
      settings,
      onChangeSettings
    });

    const handleDragStart = useCallback(
      event => {
        switch (event.active.id) {
          case DRAG_RESIZE_ID:
            startResize();
            break;
          default:
            updatePosition();
        }
      },
      [updatePosition, startResize]
    );
    const handleDragEnd = useCallback(updatePosition, [updatePosition]);
    const handleDragMove = useCallback(
      event => {
        switch (event.active.id) {
          case DRAG_RESIZE_ID:
            resize(event.delta.y);
            break;
        }
      },
      [resize]
    );

    return (
      <DndContext
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        <DraggableLegendContent
          ref={legendContentRef}
          positionStyles={positionStyles}
          contentHeight={contentHeight}
        >
          {children}
        </DraggableLegendContent>
      </DndContext>
    );
  }
) as FC<DraggableLegendProps>;

type ImageExportLegendProps = {
  settings?: MapLegendControlSettings;
  isSidePanelShown: boolean;
  children: React.ReactNode;
};

const ImageExportLegend = withTheme(({settings, isSidePanelShown, theme, children}) => {
  const containerRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const legendContentRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);

  const {positionStyles} = useLegendPosition({
    legendContentRef,
    isSidePanelShown,
    theme,
    settings,
    onChangeSettings: () => {
      // do nothing by default
    }
  });

  const portalRoot = containerRef.current
    ?.closest('.export-map-instance')
    ?.querySelector('#default-deckgl-overlay-wrapper');

  return (
    <div ref={containerRef}>
      {portalRoot
        ? createPortal(
            <div
              className="fixed-legend"
              ref={legendContentRef}
              style={{...positionStyles, position: 'absolute'}}
            >
              {children}
            </div>,
            portalRoot
          )
        : null}
    </div>
  );
}) as React.FC<ImageExportLegendProps>;

MapLegendPanelFactory.deps = [MapControlTooltipFactory, MapControlPanelFactory, MapLegendFactory];

interface MapLegendPanelIcons {
  legend: ComponentType<any>;
}

export type MapLegendPanelProps = {
  theme: any;
  layers: ReadonlyArray<Layer>;
  scale: number;
  onToggleMapControl: (control: string) => void;
  isExport: boolean;
  logoComponent: Element;
  actionIcons: MapLegendPanelIcons;
  mapControls: MapControls;
  mapState?: MapState;
  onLayerVisConfigChange?: (oldLayer: Layer, newVisConfig: Partial<LayerVisConfig>) => void;
  onToggleSplitMapViewport?: ActionHandler<typeof toggleSplitMapViewport>;
  isViewportUnsyncAllowed?: boolean;
  onClickControlBtn?: (e?: MouseEvent) => void;
  className: string;
  settings: MapLegendControlSettings;
  isSidePanelShown: boolean;
  activeSidePanel: string | null;
  setMapControlSettings: any;
};

type MapLegendPanelComponents = {
  MapControlTooltip: ReturnType<typeof MapControlTooltipFactory>;
  MapControlPanel: ReturnType<typeof MapControlPanelFactory>;
  MapLegend: ReturnType<typeof MapLegendFactory>;
};

type MapLegendPanelComponentType = React.FC<MapLegendPanelProps>;

const defaultActionIcons = {
  legend: props => <Legend {...props} height="18px" />
};

const MapLegendPanelComponent = ({
  layers,
  mapControls,
  scale,
  onToggleMapControl,
  isExport,
  logoComponent,
  actionIcons = defaultActionIcons,
  mapState,
  onLayerVisConfigChange,
  onToggleSplitMapViewport,
  onClickControlBtn,
  activeSidePanel,
  setMapControlSettings,
  isViewportUnsyncAllowed = true,
  className,
  MapControlTooltip,
  MapControlPanel,
  MapLegend
}: MapLegendPanelProps & MapLegendPanelComponents) => {
  const isSidePanelShown = Boolean(activeSidePanel);
  const settings = mapControls?.mapLegend?.settings;

  const mapLegend = mapControls?.mapLegend || ({} as MapControlMapLegend);
  const {active, disableEdit} = mapLegend || {};
  const rootContext = useContext(RootContext);

  const onClick = useCallback(() => {
    onClickControlBtn?.();
    if (mapControls?.mapDraw?.active) {
      onToggleMapControl('mapDraw');
    }
    onToggleMapControl('mapLegend');
  }, [onClickControlBtn, onToggleMapControl, mapControls]);
  const onCloseClick = useCallback(
    e => {
      e.preventDefault();
      onToggleMapControl('mapLegend');
    },
    [onToggleMapControl]
  );

  if (!mapLegend.show) {
    return null;
  }

  const legendPanel = active ? (
    <MapControlPanel
      scale={scale}
      header="header.layerLegend"
      {...{onClick: onCloseClick, pinnable: false, disableClose: false}}
      isExport={isExport}
      logoComponent={logoComponent}
      mapState={mapState}
      onToggleSplitMapViewport={onToggleSplitMapViewport}
      isViewportUnsyncAllowed={isViewportUnsyncAllowed}
      className={className}
    >
      <MapLegend
        layers={layers}
        mapState={mapState}
        disableEdit={disableEdit}
        isExport={isExport}
        onLayerVisConfigChange={onLayerVisConfigChange}
      />
    </MapControlPanel>
  ) : null;

  return (
    <>
      {active ? (
        hasPortableWidth(breakPointValues) ? (
          legendPanel
        ) : isExport ? (
          <ImageExportLegend isSidePanelShown={isSidePanelShown} settings={settings}>
            {legendPanel}
          </ImageExportLegend>
        ) : (
          createPortal(
            <DraggableLegend
              isSidePanelShown={isSidePanelShown}
              mapControls={mapControls}
              setMapControlSettings={setMapControlSettings}
            >
              {legendPanel}
            </DraggableLegend>,
            rootContext?.current ?? document.body
          )
        )
      ) : null}
      {!isExport ? (
        <MapControlTooltip id="show-legend" message="tooltip.showLegend">
          <MapControlButton className="map-control-button show-legend" onClick={onClick}>
            <actionIcons.legend height="22px" />
          </MapControlButton>
        </MapControlTooltip>
      ) : null}
    </>
  );
};

function MapLegendPanelFactory(
  MapControlTooltip: ReturnType<typeof MapControlTooltipFactory>,
  MapControlPanel: ReturnType<typeof MapControlPanelFactory>,
  MapLegend: ReturnType<typeof MapLegendFactory>
): MapLegendPanelComponentType {
  return (props: MapLegendPanelProps) => (
    <MapLegendPanelComponent
      {...props}
      MapControlTooltip={MapControlTooltip}
      MapControlPanel={MapControlPanel}
      MapLegend={MapLegend}
    />
  );
}

export default MapLegendPanelFactory;
