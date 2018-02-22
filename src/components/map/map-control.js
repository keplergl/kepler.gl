import React, {Component} from 'react';
import {createSelector} from 'reselect';
import styled from 'styled-components';

import {Tooltip, IconRoundSmall} from 'components/common/styled-components';
import MapLayerSelector from 'components/common/map-layer-selector';
import MapLegend from './map-legend';
import {
  Close,
  Reduce,
  Expand,
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
  dragRotate: React.PropTypes.bool.isRequired,
  isFullScreen: React.PropTypes.bool.isRequired,
  isSplit: React.PropTypes.bool.isRequired,
  onToggleFullScreen: React.PropTypes.func.isRequired,
  onTogglePerspective: React.PropTypes.func.isRequired,
  onToggleSplitMap: React.PropTypes.func.isRequired,
  top: React.PropTypes.number.isRequired
};

const defaultProps = {
  isFullScreen: false,
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
        className={'legend'}
        data-tip
        data-for="show-legend"
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
      isFullScreen,
      isSplit,
      mapIndex,
      onToggleFullScreen,
      onTogglePerspective,
      onToggleSplitMap
    } = this.props;

    return (
      <StyledMapControl className={'map-control'}>
        {/* Split Map */}
        <ActionPanel key={0}>
          <StyledMapControlButton
            active={isSplit}
            onClick={e => {
              e.preventDefault();
              onToggleSplitMap(isSplit ? mapIndex : undefined);
            }}
            data-tip
            data-for={`action-toggle_${mapIndex}`}
          >
            {isSplit ? <Delete height={'18px'} /> : <Split height={'18px'} />}
            <MapLegendTooltip
              id={`action-toggle_${mapIndex}`}
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
        {/* Full Screen */}
        <ActionPanel key={4}>
          <StyledMapControlButton
            onClick={e => {
              e.preventDefault();
              onToggleFullScreen();
            }}
            active={isFullScreen}
            data-tip
            data-for={`action-fullscreen_${mapIndex}_${isFullScreen}`}
          >
            {isFullScreen ? (
              <Reduce height={'22px'} />
            ) : (
              <Expand height={'22px'} />
            )}
            <MapLegendTooltip
              id={`action-fullscreen_${mapIndex}_${isFullScreen}`}
              message={!isFullScreen ? 'Go full screen' : 'Exit full screen'}
            />
          </StyledMapControlButton>
        </ActionPanel>
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
