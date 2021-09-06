// Copyright (c) 2021 Uber Technologies, Inc.
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

import React, {useCallback} from 'react';
import classnames from 'classnames';

import {EDITOR_MODES} from 'constants/default-settings';
import {
  CursorClick,
  DrawPolygon,
  EyeSeen,
  EyeUnseen,
  Polygon,
  Rectangle
} from 'components/common/icons';
import {MapControlButton} from 'components/common/styled-components';
import ToolbarItem from 'components/common/toolbar-item';
import MapControlTooltipFactory from './map-control-tooltip';
import MapControlPanelFactory from './map-control-panel';
import MapControlToolbarFactory from './map-control-toolbar';

MapDrawPanelFactory.deps = [
  MapControlTooltipFactory,
  MapControlPanelFactory,
  MapControlToolbarFactory
];
function MapDrawPanelFactory(MapControlTooltip, MapControlPanel, MapControlToolbar) {
  const defaultActionIcons = {
    visible: EyeSeen,
    hidden: EyeUnseen,
    polygon: DrawPolygon,
    cursor: CursorClick,
    innerPolygon: Polygon,
    rectangle: Rectangle
  };
  /** @type {import('./map-draw-panel').MapDrawPanelComponent} */
  const MapDrawPanel = React.memo(
    ({
      editor,
      mapControls,
      onToggleMapControl,
      onSetEditorMode,
      onToggleEditorVisibility,
      actionIcons = defaultActionIcons
    }) => {
      const isActive = mapControls?.mapDraw?.active;
      const onToggleMenuPanel = useCallback(() => onToggleMapControl('mapDraw'), [
        onToggleMapControl
      ]);
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
              <ToolbarItem
                className="toggle-features"
                onClick={onToggleEditorVisibility}
                label={editor.visible ? 'toolbar.hide' : 'toolbar.show'}
                icon={editor.visible ? actionIcons.visible : actionIcons.hidden}
              />
            </MapControlToolbar>
          ) : null}
          <MapControlButton
            onClick={e => {
              e.preventDefault();
              onToggleMenuPanel();
            }}
            active={isActive}
            className={classnames('map-control-button', 'map-draw', {isActive})}
            data-tip
            data-for="map-draw"
          >
            <actionIcons.polygon height="22px" />
            <MapControlTooltip id="map-draw" message="tooltip.DrawOnMap" />
          </MapControlButton>
        </div>
      );
    }
  );

  MapDrawPanel.displayName = 'MapDrawPanel';
  return MapDrawPanel;
}

export default MapDrawPanelFactory;
