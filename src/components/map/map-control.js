// Copyright (c) 2020 Uber Technologies, Inc.
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

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {createSelector} from 'reselect';
import styled from 'styled-components';

import {Tooltip, IconRoundSmall, MapControlButton} from 'components/common/styled-components';
import MapLayerSelector from 'components/common/map-layer-selector';
import KeplerGlLogo from 'components/common/logo';
import MapLegend from './map-legend';
import {
  Close,
  Split,
  Legend,
  Cube3d,
  Delete,
  Layers,
  DrawPolygon,
  Polygon,
  Rectangle,
  CursorClick,
  EyeSeen,
  EyeUnseen
} from 'components/common/icons';
import VerticalToolbar from 'components/common/vertical-toolbar';
import ToolbarItem from 'components/common/toolbar-item';
import {EDITOR_MODES} from 'constants/default-settings';

const StyledMapControl = styled.div`
  right: 0;
  width: ${props => props.theme.mapControl.width}px;
  padding: ${props => props.theme.mapControl.padding}px;
  z-index: 10;
  top: ${props => props.top}px;
  position: absolute;
`;

const StyledMapControlAction = styled.div`
  padding: 4px 0;
  display: flex;
  justify-content: flex-end;
`;

const StyledMapControlPanel = styled.div`
  background-color: ${props => props.theme.mapPanelBackgroundColor};
  flex-grow: 1;
  z-index: 1;
  p {
    margin-bottom: 0;
  }
`;

const StyledMapControlPanelContent = styled.div`
  ${props => props.theme.dropdownScrollBar};
  max-height: 500px;
  min-height: 100px;
  overflow: auto;
`;

const StyledMapControlPanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${props => props.theme.mapPanelHeaderBackgroundColor};
  height: 32px;
  padding: 6px 12px;
  font-size: 11px;
  color: ${props => props.theme.titleTextColor};
  position: relative;

  button {
    width: 18px;
    height: 18px;
  }
`;

const ActionPanel = ({className, children}) => (
  <StyledMapControlAction className={className}>{children}</StyledMapControlAction>
);

ActionPanel.displayName = 'ActionPanel';

const MapControlTooltip = React.memo(({id, message}) => (
  <Tooltip id={id} place="left" effect="solid">
    <span>{message}</span>
  </Tooltip>
));

MapControlTooltip.displayName = 'MapControlTooltip';

const MapLegendTooltip = ({id, message}) => (
  <Tooltip id={id} place="left" effect="solid">
    <span>{message}</span>
  </Tooltip>
);

const LayerSelectorPanel = React.memo(({items, onMapToggleLayer, isActive, toggleMenuPanel}) =>
  !isActive ? (
    <MapControlButton
      key={1}
      onClick={e => {
        e.preventDefault();
        toggleMenuPanel();
      }}
      className="map-control-button toggle-layer"
      data-tip
      data-for="toggle-layer"
    >
      <Layers height="22px" />
      <MapControlTooltip
        id="toggle-layer"
        message={isActive ? 'Hide layer panel' : 'Show layer panel'}
      />
    </MapControlButton>
  ) : (
    <MapControlPanel header="Visible layers" onClick={toggleMenuPanel}>
      <MapLayerSelector layers={items} onMapToggleLayer={onMapToggleLayer} />
    </MapControlPanel>
  )
);

LayerSelectorPanel.displayName = 'LayerSelectorPanel';

const MapControlPanel = React.memo(({children, header, onClick, scale = 1, isExport}) => (
  <StyledMapControlPanel
    style={{
      transform: `scale(${scale}) translate(calc(-${25 * (scale - 1)}% - ${10 *
        scale}px), calc(${25 * (scale - 1)}% + ${10 * scale}px))`,
      marginBottom: '8px'
    }}
  >
    <StyledMapControlPanelHeader>
      {isExport ? (
        <KeplerGlLogo version={false} appName="kepler.gl" />
      ) : (
        <span style={{verticalAlign: 'middle'}}>{header}</span>
      )}
      {isExport ? null : (
        <IconRoundSmall>
          <Close height="16px" onClick={onClick} />
        </IconRoundSmall>
      )}
    </StyledMapControlPanelHeader>
    <StyledMapControlPanelContent>{children}</StyledMapControlPanelContent>
  </StyledMapControlPanel>
));

MapControlPanel.displayName = 'MapControlPanel';

const MapLegendPanel = ({layers, isActive, scale, onToggleMenuPanel, isExport}) =>
  !isActive ? (
    <MapControlButton
      key={2}
      data-tip
      data-for="show-legend"
      className="map-control-button show-legend"
      onClick={e => {
        e.preventDefault();
        onToggleMenuPanel();
      }}
    >
      <Legend height="22px" />
      <MapLegendTooltip id="show-legend" message={'show legend'} />
    </MapControlButton>
  ) : (
    <MapControlPanel
      scale={scale}
      header={'Layer Legend'}
      onClick={onToggleMenuPanel}
      isExport={isExport}
    >
      <MapLegend layers={layers} />
    </MapControlPanel>
  );

MapLegendPanel.displayName = 'MapControlPanel';

const SplitMapButton = React.memo(({isSplit, mapIndex, onToggleSplitMap}) => (
  <MapControlButton
    active={isSplit}
    onClick={e => {
      e.preventDefault();
      onToggleSplitMap(isSplit ? mapIndex : undefined);
    }}
    key={`split-${isSplit}`}
    className="map-control-button split-map"
    data-tip
    data-for="action-toggle"
  >
    {isSplit ? <Delete height="18px" /> : <Split height="18px" />}
    <MapControlTooltip
      id="action-toggle"
      message={isSplit ? 'Close current panel' : 'Switch to dual map view'}
    />
  </MapControlButton>
));

SplitMapButton.displayName = 'SplitMapButton';

const Toggle3dButton = React.memo(({dragRotate, onTogglePerspective}) => (
  <MapControlButton
    onClick={e => {
      e.preventDefault();
      onTogglePerspective();
    }}
    active={dragRotate}
    data-tip
    data-for="action-3d"
  >
    <Cube3d height="22px" />
    <MapControlTooltip id="action-3d" message={dragRotate ? 'Disable 3D Map' : '3D Map'} />
  </MapControlButton>
));

Toggle3dButton.displayName = 'Toggle3dButton';

const StyledToolbar = styled(VerticalToolbar)`
  position: absolute;
  right: 32px;
`;

const MapDrawPanel = React.memo(
  ({editor, isActive, onToggleMenuPanel, onSetEditorMode, onToggleEditorVisibility}) => {
    return (
      <div style={{position: 'relative'}}>
        {isActive ? (
          <StyledToolbar show={isActive}>
            <ToolbarItem
              onClick={() => onSetEditorMode(EDITOR_MODES.EDIT)}
              label="select"
              iconHeight="22px"
              icon={CursorClick}
              active={editor.mode === EDITOR_MODES.EDIT}
            />
            <ToolbarItem
              onClick={() => onSetEditorMode(EDITOR_MODES.DRAW_POLYGON)}
              label="polygon"
              iconHeight="22px"
              icon={Polygon}
              active={editor.mode === EDITOR_MODES.DRAW_POLYGON}
            />
            <ToolbarItem
              onClick={() => onSetEditorMode(EDITOR_MODES.DRAW_RECTANGLE)}
              label="rectangle"
              iconHeight="22px"
              icon={Rectangle}
              active={editor.mode === EDITOR_MODES.DRAW_RECTANGLE}
            />
            <ToolbarItem
              onClick={onToggleEditorVisibility}
              label={editor.visible ? 'hide' : 'show'}
              iconHeight="22px"
              icon={editor.visible ? EyeSeen : EyeUnseen}
            />
          </StyledToolbar>
        ) : null}
        <MapControlButton
          onClick={e => {
            e.preventDefault();
            onToggleMenuPanel();
          }}
          active={isActive}
          data-tip
          data-for="map-draw"
        >
          <DrawPolygon height="22px" />
          <MapControlTooltip id="map-draw" message="Draw on map" />
        </MapControlButton>
      </div>
    );
  }
);

MapDrawPanel.displayName = 'MapDrawPanel';

const MapControlFactory = () => {
  class MapControl extends Component {
    static propTypes = {
      datasets: PropTypes.object.isRequired,
      dragRotate: PropTypes.bool.isRequired,
      isSplit: PropTypes.bool.isRequired,
      layers: PropTypes.arrayOf(PropTypes.object),
      layersToRender: PropTypes.object.isRequired,
      mapIndex: PropTypes.number.isRequired,
      mapControls: PropTypes.object.isRequired,
      onTogglePerspective: PropTypes.func.isRequired,
      onToggleSplitMap: PropTypes.func.isRequired,
      onToggleMapControl: PropTypes.func.isRequired,
      onSetEditorMode: PropTypes.func.isRequired,
      onToggleEditorVisibility: PropTypes.func.isRequired,
      top: PropTypes.number.isRequired,

      // optional
      readOnly: PropTypes.bool,
      scale: PropTypes.number,
      mapLayers: PropTypes.object,
      editor: PropTypes.object
    };

    static defaultProps = {
      isSplit: false,
      top: 0,
      mapIndex: 0
    };

    layerSelector = props => props.layers;
    layersToRenderSelector = props => props.layersToRender;
    layerPanelItemsSelector = createSelector(
      this.layerSelector,
      this.layersToRenderSelector,
      (layers, layersToRender) =>
        layers
          .filter(l => l.config.isVisible)
          .map(layer => ({
            id: layer.id,
            name: layer.config.label,
            // layer
            isVisible: layersToRender[layer.id]
          }))
    );

    render() {
      const {
        dragRotate,
        layers,
        layersToRender,
        isSplit,
        isExport,
        mapIndex,
        mapControls,
        onTogglePerspective,
        onToggleSplitMap,
        onMapToggleLayer,
        onToggleMapControl,
        editor,
        scale,
        readOnly
      } = this.props;

      const {
        visibleLayers = {},
        mapLegend = {},
        toggle3d = {},
        splitMap = {},
        mapDraw = {}
      } = mapControls;

      return (
        <StyledMapControl className="map-control">
          {/* Split Map */}
          {splitMap.show && readOnly !== true ? (
            <ActionPanel className="split-map" key={0}>
              <SplitMapButton
                isSplit={isSplit}
                mapIndex={mapIndex}
                onToggleSplitMap={onToggleSplitMap}
              />
            </ActionPanel>
          ) : null}

          {/* Map Layers */}
          {isSplit && visibleLayers.show && readOnly !== true ? (
            <ActionPanel className="map-layers" key={1}>
              <LayerSelectorPanel
                items={this.layerPanelItemsSelector(this.props)}
                onMapToggleLayer={onMapToggleLayer}
                isActive={visibleLayers.active}
                toggleMenuPanel={() => onToggleMapControl('visibleLayers')}
              />
            </ActionPanel>
          ) : null}

          {/* 3D Map */}
          {toggle3d.show ? (
            <ActionPanel className="toggle-3d" key={2}>
              <Toggle3dButton dragRotate={dragRotate} onTogglePerspective={onTogglePerspective} />
            </ActionPanel>
          ) : null}

          {/* Map Legend */}
          {mapLegend.show ? (
            <ActionPanel className="show-legend" key={3}>
              <MapLegendPanel
                layers={layers.filter(l => layersToRender[l.id])}
                scale={scale}
                isExport={isExport}
                onMapToggleLayer={onMapToggleLayer}
                isActive={mapLegend.active}
                onToggleMenuPanel={() => onToggleMapControl('mapLegend')}
              />
            </ActionPanel>
          ) : null}

          {mapDraw.show ? (
            <ActionPanel key={4}>
              <MapDrawPanel
                isActive={mapDraw.active && mapDraw.activeMapIndex === mapIndex}
                editor={editor}
                onToggleMenuPanel={() => onToggleMapControl('mapDraw')}
                onSetEditorMode={this.props.onSetEditorMode}
                onToggleEditorVisibility={this.props.onToggleEditorVisibility}
              />
            </ActionPanel>
          ) : null}
        </StyledMapControl>
      );
    }
  }

  MapControl.displayName = 'MapControl';

  return MapControl;
};

export default MapControlFactory;
