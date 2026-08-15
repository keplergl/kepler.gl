// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';
import classnames from 'classnames';
import copy from 'copy-to-clipboard';
import styled from 'styled-components';

import {EDITOR_MODES} from '@kepler.gl/constants';
import {editorFeaturesToFeatureCollection} from '@kepler.gl/utils';
import {
  Copy,
  CursorClick,
  DrawPoint,
  DrawPolygon,
  EyeSeen,
  EyeUnseen,
  Layers,
  LineString,
  Polygon,
  Rectangle
} from '../common/icons';
import {MapControlButton} from '../common/styled-components';
import ToolbarItem from '../common/toolbar-item';
import MapControlTooltipFactory from './map-control-tooltip';
import MapControlToolbarFactory from './map-control-toolbar';
import {Editor, MapControls} from '@kepler.gl/types';
import {BaseProps} from '../common/icons';

const ToolbarSeparator = styled.div`
  height: 1px;
  margin: 4px 12px;
  background-color: ${props => props.theme.panelHeaderIcon};
  opacity: 0.2;
`;

const DrawControls = styled.div`
  position: relative;

  .convert-to-layer .toolbar-item__title {
    flex: 1;
    min-width: 0;
    white-space: pre;
    text-align: center;
    line-height: 1.25;
    overflow: hidden;
    font-size: 11px;
  }
`;

MapDrawPanelFactory.deps = [MapControlTooltipFactory, MapControlToolbarFactory];

export type MapDrawPanelProps = {
  editor: Editor;
  mapControls: MapControls;
  onToggleMapControl: (control: string) => void;
  onSetEditorMode: (mode: string) => void;
  onToggleEditorVisibility: () => void;
  onConvertEditorFeaturesToLayer?: () => void;
  actionIcons: {[id: string]: React.ComponentType<Partial<BaseProps>>};
};

function MapDrawPanelFactory(
  MapControlTooltip: ReturnType<typeof MapControlTooltipFactory>,
  MapControlToolbar: ReturnType<typeof MapControlToolbarFactory>
) {
  const defaultActionIcons = {
    visible: EyeSeen,
    hidden: EyeUnseen,
    polygon: DrawPolygon,
    cursor: CursorClick,
    innerPolygon: Polygon,
    rectangle: Rectangle,
    point: DrawPoint,
    line: LineString,
    copy: Copy,
    layers: Layers
  };

  const MapDrawPanel: React.FC<MapDrawPanelProps> = React.memo(
    ({
      editor,
      mapControls,
      onToggleMapControl,
      onSetEditorMode,
      onConvertEditorFeaturesToLayer,
      actionIcons = defaultActionIcons
    }) => {
      const isActive = mapControls?.mapDraw?.active;
      const hasSketchFeatures = Boolean(editor?.features?.length);
      const onToggleMenuPanel = useCallback(() => {
        if (!isActive) {
          onSetEditorMode(EDITOR_MODES.DRAW_RECTANGLE);
        }
        onToggleMapControl('mapDraw');
      }, [isActive, onToggleMapControl, onSetEditorMode]);
      const onCopyAllGeometry = useCallback(() => {
        if (!editor?.features?.length) {
          return;
        }
        copy(JSON.stringify(editorFeaturesToFeatureCollection(editor.features)));
      }, [editor?.features]);
      if (!mapControls?.mapDraw?.show) {
        return null;
      }
      return (
        <DrawControls className="map-draw-controls">
          {isActive ? (
            <MapControlToolbar $show={isActive}>
              <ToolbarItem
                className="edit-feature"
                onClick={() => onSetEditorMode(EDITOR_MODES.EDIT)}
                label="toolbar.select"
                icon={actionIcons.cursor}
                active={editor.mode === EDITOR_MODES.EDIT}
              />
              <ToolbarItem
                className="draw-point"
                onClick={() => onSetEditorMode(EDITOR_MODES.DRAW_POINT)}
                label="toolbar.point"
                icon={actionIcons.point}
                active={editor.mode === EDITOR_MODES.DRAW_POINT}
              />
              <ToolbarItem
                className="draw-line"
                onClick={() => onSetEditorMode(EDITOR_MODES.DRAW_LINESTRING)}
                label="toolbar.line"
                icon={actionIcons.line}
                active={editor.mode === EDITOR_MODES.DRAW_LINESTRING}
              />
              <ToolbarItem
                className="draw-feature"
                onClick={() => onSetEditorMode(EDITOR_MODES.DRAW_POLYGON)}
                label="toolbar.polygon"
                icon={actionIcons.innerPolygon}
                active={editor.mode === EDITOR_MODES.DRAW_POLYGON}
              />
              <ToolbarItem
                className="draw-rectangle"
                onClick={() => onSetEditorMode(EDITOR_MODES.DRAW_RECTANGLE)}
                label="toolbar.rectangle"
                icon={actionIcons.rectangle}
                active={editor.mode === EDITOR_MODES.DRAW_RECTANGLE}
              />
              <ToolbarSeparator />
              <ToolbarItem
                className="copy-all-geometry"
                onClick={onCopyAllGeometry}
                label="toolbar.copyAll"
                tooltip="tooltip.copyAllSketches"
                icon={actionIcons.copy}
                disabled={!hasSketchFeatures}
              />
              <ToolbarItem
                className="convert-to-layer"
                onClick={() => onConvertEditorFeaturesToLayer?.()}
                label="toolbar.convertToLayer"
                tooltip="tooltip.convertToLayer"
                icon={actionIcons.layers}
                disabled={!hasSketchFeatures}
              />
            </MapControlToolbar>
          ) : null}
          <MapControlTooltip id="map-draw" message="tooltip.DrawOnMap">
            <MapControlButton
              className={classnames('map-control-button', 'map-draw', {isActive})}
              onClick={e => {
                e.preventDefault();
                onToggleMenuPanel();
              }}
              active={isActive}
            >
              <actionIcons.polygon height="18px" />
            </MapControlButton>
          </MapControlTooltip>
        </DrawControls>
      );
    }
  );

  MapDrawPanel.displayName = 'MapDrawPanel';
  return MapDrawPanel;
}

export default MapDrawPanelFactory;
