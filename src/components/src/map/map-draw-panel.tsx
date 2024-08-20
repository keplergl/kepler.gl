// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';
import classnames from 'classnames';

import {EDITOR_MODES} from '@kepler.gl/constants';
import {CursorClick, DrawPolygon, EyeSeen, EyeUnseen, Polygon, Rectangle} from '../common/icons';
import {MapControlButton} from '../common/styled-components';
import ToolbarItem from '../common/toolbar-item';
import MapControlTooltipFactory from './map-control-tooltip';
import MapControlToolbarFactory from './map-control-toolbar';
import {Editor, MapControls} from '@kepler.gl/types';
import {BaseProps} from '../common/icons';

MapDrawPanelFactory.deps = [MapControlTooltipFactory, MapControlToolbarFactory];

export type MapDrawPanelProps = {
  editor: Editor;
  mapControls: MapControls;
  onToggleMapControl: (control: string) => void;
  onSetEditorMode: (mode: string) => void;
  onToggleEditorVisibility: () => void;
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
    rectangle: Rectangle
  };

  const MapDrawPanel: React.FC<MapDrawPanelProps> = React.memo(
    ({
      editor,
      mapControls,
      onToggleMapControl,
      onSetEditorMode,
      actionIcons = defaultActionIcons
    }) => {
      const isActive = mapControls?.mapDraw?.active;
      const onToggleMenuPanel = useCallback(
        () => onToggleMapControl('mapDraw'),
        [onToggleMapControl]
      );
      if (!mapControls?.mapDraw?.show) {
        return null;
      }
      return (
        <div className="map-draw-controls" style={{position: 'relative'}}>
          {isActive ? (
            <MapControlToolbar show={isActive}>
              <ToolbarItem
                className="edit-feature"
                onClick={() => onSetEditorMode(EDITOR_MODES.EDIT)}
                label="toolbar.select"
                icon={actionIcons.cursor}
                active={editor.mode === EDITOR_MODES.EDIT}
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
              <actionIcons.polygon height="22px" />
            </MapControlButton>
          </MapControlTooltip>
        </div>
      );
    }
  );

  MapDrawPanel.displayName = 'MapDrawPanel';
  return MapDrawPanel;
}

export default MapDrawPanelFactory;
