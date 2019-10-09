// Copyright (c) 2019 Uber Technologies, Inc.
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
  Layers
} from 'components/common/icons';

const StyledMapControl = styled.div`
  right: 0;
  width: ${props => props.theme.mapControl.width}px;
  padding: ${props => props.theme.mapControl.padding}px;
  z-index: 1;
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
  ${props => props.theme.dropdownScrollBar} max-height: 500px;
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

  button {
    width: 18px;
    height: 18px;
  }
`;

const ActionPanel = ({children}) => (
  <StyledMapControlAction>{children}</StyledMapControlAction>
);

const MapLegendTooltip = ({id, message}) => (
  <Tooltip id={id} place="left" effect="solid">
    <span>{message}</span>
  </Tooltip>
);

const LayerSelectorPanel = ({
  items,
  onMapToggleLayer,
  isActive,
  toggleMenuPanel
}) =>
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
      <MapLegendTooltip
        id="toggle-layer"
        message={isActive ? 'Hide layer panel' : 'Show layer panel'}
      />
    </MapControlButton>
  ) : (
    <MapControlPanel header="Visible layers" onClick={toggleMenuPanel}>
      <MapLayerSelector layers={items} onMapToggleLayer={onMapToggleLayer} />
    </MapControlPanel>
  );

const MapControlPanel = ({children, header, onClick, scale = 1, isExport}) => (
  <StyledMapControlPanel
    style={{
      transform: `scale(${scale}) translate(calc(-${25 * (scale - 1)}% - ${10 *
        scale}px), calc(${25 * (scale - 1)}% + ${10 * scale}px))`
    }}
  >
    <StyledMapControlPanelHeader style={{position: 'relative'}}>
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
);

const MapLegendPanel = ({layers, isActive, scale, toggleMenuPanel, isExport}) =>
  !isActive ? (
    <MapControlButton
      key={2}
      data-tip
      data-for="show-legend"
      className="map-control-button show-legend"
      onClick={e => {
        e.preventDefault();
        toggleMenuPanel();
      }}
    >
      <Legend height="22px" />
      <MapLegendTooltip id="show-legend" message={'show legend'} />
    </MapControlButton>
  ) : (
    <MapControlPanel
      scale={scale}
      header={'Layer Legend'}
      onClick={toggleMenuPanel}
      isExport={isExport}
    >
      <MapLegend layers={layers}/>
    </MapControlPanel>
  );

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
      onMapToggleLayer: PropTypes.func.isRequired,
      top: PropTypes.number.isRequired,

      // optional
      readOnly: PropTypes.bool,
      scale: PropTypes.number
    };

    static defaultProps = {
      isSplit: false,
      top: 0
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
        scale,
        readOnly
      } = this.props;

      const {
        visibleLayers = {},
        mapLegend = {},
        toggle3d = {},
        splitMap = {}
      } = mapControls;

      return (
        <StyledMapControl className="map-control">
          {/* Split Map */}
          {splitMap.show && readOnly !== true ? (
            <ActionPanel key={0}>
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
                <MapLegendTooltip
                  id="action-toggle"
                  message={
                    isSplit ? 'Close current panel' : 'Switch to dual map view'
                  }
                />
              </MapControlButton>
            </ActionPanel>
          ) : null}

          {/* Map Layers */}
          {isSplit && visibleLayers.show && readOnly !== true ? (
            <ActionPanel key={1}>
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
            <ActionPanel key={2}>
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
                {/* No icon since we are injecting through css .threeD-map class*/}
                <MapLegendTooltip
                  id="action-3d"
                  message={dragRotate ? 'Disable 3D Map' : '3D Map'}
                />
              </MapControlButton>
            </ActionPanel>
          ) : null}

          {/* Map Legend */}
          {mapLegend.show ? (
            <ActionPanel key={3}>
              <MapLegendPanel
                layers={layers.filter(l => layersToRender[l.id])}
                scale={scale}
                isExport={isExport}
                onMapToggleLayer={onMapToggleLayer}
                isActive={mapLegend.active}
                toggleMenuPanel={() => onToggleMapControl('mapLegend')}
              />
            </ActionPanel>
          ) : null}
        </StyledMapControl>
      );
    }
  }

  return MapControl;
};

export default MapControlFactory;
