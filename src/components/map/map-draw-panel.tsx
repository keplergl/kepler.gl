// Copyright (c) 2022 Uber Technologies, Inc.
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

import {EDITOR_MODES} from '@kepler.gl/constants';
import {CursorClick, DrawPolygon, EyeSeen, EyeUnseen, Polygon, Rectangle} from '../common/icons';
import {MapControlButton} from '../common/styled-components';
import ToolbarItem from '../common/toolbar-item';
import MapControlTooltipFactory from './map-control-tooltip';
import MapControlPanelFactory from './map-control-panel';
import MapControlToolbarFactory from './map-control-toolbar';
import {FormattedMessage} from '../../localization';
import TippyTooltip from '../common/tippy-tooltip';
import {Editor, MapControls} from 'reducers';
import {BaseProps} from '../common/icons/base';

MapDrawPanelFactory.deps = [
  MapControlTooltipFactory,
  MapControlPanelFactory,
  MapControlToolbarFactory
];

export type MapDrawPanelProps = {
  editor: Editor;
  mapControls: MapControls;
  onToggleMapControl: (control: string) => void;
  onSetEditorMode: (mode: string) => void;
  onToggleEditorVisibility: () => void;
  actionIcons: {[id: string]: React.ComponentType<Partial<BaseProps>>};
};

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
  const MapDrawPanel: React.FC<MapDrawPanelProps> = React.memo(
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
          <TippyTooltip
            placement="left"
            render={() => (
              <div id="map-draw">
                <FormattedMessage id="tooltip.DrawOnMap" />
              </div>
            )}
          >
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
          </TippyTooltip>
        </div>
      );
    }
  );

  MapDrawPanel.displayName = 'MapDrawPanel';
  return MapDrawPanel;
}

export default MapDrawPanelFactory;
