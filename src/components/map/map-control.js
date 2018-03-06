// Copyright (c) 2018 Uber Technologies, Inc.
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

import {Tooltip, IconRoundSmall} from 'components/common/styled-components';
import MapLayerSelector from 'components/common/map-layer-selector';
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
  width: ${props => props.theme.mapControlWidth}px;
  padding: ${props => props.theme.mapControlPadding}px;
  z-index: 1;
  top: ${props => props.top}px;
  position: absolute;
`;

const StyledMapControlAction = styled.div`
  padding: 4px 0;
  display: flex;
  justify-content: flex-end;
`;

const StyledMapControlButton = styled.div`
  align-items: center;
  background-color: ${props =>
    props.active
      ? props.theme.secondaryBtnActBgd
      : props.theme.secondaryBtnBgd};
  border-radius: 18px;
  border: 0;
  box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.16);
  color: ${props =>
    props.active
      ? props.theme.secondaryBtnActColor
      : props.theme.secondaryBtnColor};
  cursor: pointer;
  display: flex;
  height: 36px;
  justify-content: center;
  margin: 0;
  outline: none;
  padding: 0;
  transition: ${props => props.theme.transition};
  width: 36px;

  :focus {
    outline: none;
  }

  :hover {
    cursor: pointer;
    background-color: ${props => props.theme.secondaryBtnActBgd};
    color: ${props => props.theme.secondaryBtnActColor};
  }
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
  overflow: overlay;
`;

const StyledMapControlPanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${props => props.theme.mapPanelHeaderBackgroundColor};
  height: 32px;
  padding: 6px 12px;
  font-size: 11px;
  color: ${props => props.theme.secondaryBtnColor};

  button {
    width: 18px;
    height: 18px;
  }
`;

const propTypes = {
  dragRotate: PropTypes.bool.isRequired,
  isSplit: PropTypes.bool.isRequired,
  onToggleFullScreen: PropTypes.func.isRequired,
  onTogglePerspective: PropTypes.func.isRequired,
  onToggleSplitMap: PropTypes.func.isRequired,
  top: PropTypes.number.isRequired
};

const defaultProps = {
  isSplit: false,
  top: 0
};

/**
 * Generates all layers available for the current map
 * TODO: this may be moved into map-container or map-control or even at the reducer level
 * @param layers
 * @param mapLayers
 * @returns {[id, label, isVisible]}
 */
const layerSelector = (layers, mapLayers) => {
  const availableItems = Object.keys(layers).reduce(
    (availableLayers, currentLayerId) => {
      // is available ? if yes add to available list
      const currentLayer = layers[currentLayerId];
      // if maplayers exists we need to make sure currentlayer
      // is contained in mapLayers in order to add onto availableLayers
      // otherwise we add all layers

      const layerConfig = mapLayers
        ? mapLayers[currentLayer.id]
        : currentLayer.config;

      const mustBeAdded =
        mapLayers && mapLayers[currentLayer.id]
          ? mapLayers[currentLayer.id].isAvailable
          : layerConfig.isVisible;

      return mustBeAdded
        ? [
            ...availableLayers,
            {
              id: currentLayer.id,
              name: currentLayer.config.label,
              isVisible:
                mapLayers && mapLayers[currentLayer.id]
                  ? mapLayers[currentLayer.id].isVisible
                  : layerConfig.isVisible,
              layer: currentLayer
            }
          ]
        : availableLayers;
    },
    []
  );

  return availableItems;
};

export class MapControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areLayersVisible: false,
      isLegendVisible: false
    };
  }
  layerSelector = state => state.layers;
  mapLayersSelector = state => state.mapLayers;

  initialDataSelector = createSelector(
    this.layerSelector,
    this.mapLayersSelector,
    layerSelector
  );

  // if one panel is already open and user tries to open a new one well the previous one will be closed
  _toggleMenuPanel(panelId) {
    this.setState({
      areLayersVisible: false,
      isLegendVisible: false,
      [panelId]: !this.state[panelId]
    });
  }

  _renderLayerSelector(items) {
    const {onMapToggleLayer} = this.props;
    const {areLayersVisible} = this.state;

    return !areLayersVisible ? (
      <StyledMapControlButton
        key={1}
        onClick={e => {
          e.preventDefault();
          this._toggleMenuPanel('areLayersVisible');
        }}
        className="map-control-button toggle-layer"
        data-tip
        data-for="toggle-layer"
      >
        <Layers height="22px" />
        <MapLegendTooltip
          id="toggle-layer"
          message={areLayersVisible ? 'Hide layer panel' : 'Show layer panel'}
        />
      </StyledMapControlButton>
    ) : (
      <MapControlPanel
        header={'Visible layers'}
        onClick={() => this._toggleMenuPanel('areLayersVisible')}
      >
        <MapLayerSelector layers={items} onMapToggleLayer={onMapToggleLayer} />
      </MapControlPanel>
    );
  }

  _renderLegend(items) {
    const {isLegendVisible} = this.state;
    return !isLegendVisible ? (
      <StyledMapControlButton
        key={2}
        data-tip
        data-for="show-legend"
        className="map-control-button show-legend"
        onClick={e => {
          e.preventDefault();
          this._toggleMenuPanel('isLegendVisible');
        }}
      >
        <Legend height="22px" />
        <MapLegendTooltip id="show-legend" message={'show legend'} />
      </StyledMapControlButton>
    ) : (
      <MapControlPanel
        header={'Layer Legend'}
        onClick={() => this._toggleMenuPanel('isLegendVisible')}
      >
        <MapLegend
          layers={items.filter(item => item.isVisible).map(item => item.layer)}
        />
      </MapControlPanel>
    );
  }

  render() {
    const items = this.initialDataSelector(this.props);

    if (!items) {
      return null;
    }

    const {
      dragRotate,
      isSplit,
      mapIndex,
      onTogglePerspective,
      onToggleSplitMap
    } = this.props;

    return (
      <StyledMapControl className="map-control">
        {/* Split Map */}
        <ActionPanel key={0}>
          <StyledMapControlButton
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
            {isSplit ?
              <Delete height={'18px'} /> :
              <Split height={'18px'} />
            }
            <MapLegendTooltip
              id="action-toggle"
              message={
                isSplit ? 'Close current panel' : 'Switch to dual map view'
              }
            />
          </StyledMapControlButton>
        </ActionPanel>
        {/* Map Layers */}
        {isSplit && (
          <ActionPanel key={1}>{this._renderLayerSelector(items)}</ActionPanel>
        )}
        {/* 3D Map */}
        <ActionPanel key={2}>
          <StyledMapControlButton
            onClick={e => {
              e.preventDefault();
              onTogglePerspective();
            }}
            active={dragRotate}
            data-tip
            data-for="action-3d"
          >
            <Cube3d height={'22px'} />
            {/* No icon since we are injecting through css .threeD-map class*/}
            <MapLegendTooltip
              id="action-3d"
              message={dragRotate ? 'Disable 3D Map' : '3D Map'}
            />
          </StyledMapControlButton>
        </ActionPanel>
        {/* Map Legend */}
        <ActionPanel key={3}>{this._renderLegend(items)}</ActionPanel>
      </StyledMapControl>
    );
  }
}

const MapControlPanel = ({children, header, onClick}) => (
  <StyledMapControlPanel>
    <StyledMapControlPanelHeader style={{position: 'relative'}}>
      <span style={{verticalAlign: 'middle'}}>{header}</span>
      <IconRoundSmall>
        <Close height="16px" onClick={onClick} />
      </IconRoundSmall>
    </StyledMapControlPanelHeader>
    <StyledMapControlPanelContent>{children}</StyledMapControlPanelContent>
  </StyledMapControlPanel>
);

const ActionPanel = ({children}) => (
  <StyledMapControlAction>{children}</StyledMapControlAction>
);

const MapLegendTooltip = ({id, message}) => (
  <Tooltip id={id} place="left" effect="solid">
    <span>{message}</span>
  </Tooltip>
);

MapControl.propTypes = propTypes;
MapControl.defaultProps = defaultProps;

const MapControlFactory =  () => MapControl;
export default MapControlFactory;
