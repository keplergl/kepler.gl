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
import classnames from 'classnames';
import styled from 'styled-components';

import {
  Button,
  PanelLabel,
  StyledPanelHeader,
  PanelHeaderTitle,
  PanelHeaderContent,
  PanelContent,
  PanelLabelBold,
  PanelLabelWrapper,
  CenterFlexbox
} from 'components/common/styled-components';

import PanelHeaderAction from 'components/side-panel/panel-header-action';
import {Add, ArrowDown, EyeSeen, EyeUnseen, Upload} from 'components/common/icons';

const StyledInteractionPanel = styled.div`
  padding-bottom: 12px;
`;

export default class MapManager extends Component {
  static propTypes = {
    mapStyle: PropTypes.object.isRequired,
    onConfigChange: PropTypes.func.isRequired,
    onStyleChange: PropTypes.func.isRequired,
    showAddMapStyleModal: PropTypes.func.isRequired
  };

  state = {
    isSelecting: false
  };

  _updateConfig = newProp => {
    const newConfig = {...this.props.mapStyle, ...newProp};
    this.props.onConfigChange(newConfig);
  };

  _toggleSelecting = () => {
    this.setState({isSelecting: !this.state.isSelecting});
  };

  _selectStyle = val => {
    this.props.onStyleChange(val);
    this._toggleSelecting();
  };

  render() {
    const {mapStyle} = this.props;
    const editableLayers = mapStyle.visibleLayerGroups;

    return (
      <div className="map-style-panel">
        <div>
          <MapStyleSelector
            mapStyle={mapStyle}
            isSelecting={this.state.isSelecting}
            onChange={this._selectStyle}
            toggleActive={this._toggleSelecting}
          />
          {Object.keys(editableLayers).length ? (
            <LayerGroupSelector
              layers={mapStyle.visibleLayerGroups}
              editableLayers={editableLayers}
              topLayers={mapStyle.topLayerGroups}
              onChange={this._updateConfig}
            />
          ) : null}
          <Button
            onClick={this.props.showAddMapStyleModal}
            secondary>
            <Add height="12px" />Add Map Style
          </Button>
        </div>
      </div>
    );
  }
}

const StyledMapDropdown = StyledPanelHeader.extend`
  height: 48px;
  margin-bottom: 5px;
  opacity: 1;
  position: relative;
  transition: opacity 0.05s ease-in, height 0.25s ease-out;
  
  &.collapsed {
    height: 0;
    margin-bottom: 0;
    opacity: 0;
  }

  :hover {
    cursor: pointer;
    background-color: ${props => props.theme.panelBackgroundHover};
  }

  .map-title-block img {
    margin-right: 12px;
  }

  .map-preview {
    border-radius: 3px;
    height: 30px;
    width: 40px;
  }
`;

const MapStyleSelector = ({mapStyle, onChange, toggleActive, isSelecting}) => (
  <div>
    <PanelLabel>Map style</PanelLabel>
    {Object.keys(mapStyle.mapStyles).map(op => (
      <StyledMapDropdown
        className={classnames('map-dropdown-option', {
          collapsed: !isSelecting && mapStyle.styleType !== op
        })}
        key={op}
        onClick={isSelecting ? () => onChange(op) : toggleActive}
      >
        <PanelHeaderContent className="map-title-block">
          <img className="map-preview" src={mapStyle.mapStyles[op].icon} />
          <PanelHeaderTitle className="map-preview-name">
            {mapStyle.mapStyles[op].label}
          </PanelHeaderTitle>
        </PanelHeaderContent>
        {!isSelecting ? (
          <PanelHeaderAction
            className="map-dropdown-option__enable-config"
            id="map-enable-config"
            IconComponent={ArrowDown}
            tooltip={'Select Base Map Style'}
            onClick={toggleActive}
          />
        ) : null}
      </StyledMapDropdown>
    ))}
  </div>
);

const StyledLayerGroupItem = styled.div`
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;

  &:last-child {
    margin-bottom: 0;
  }

  .layer-group__visibility-toggle {
    margin-right: 12px;
  }
`;

const LayerLabel = PanelLabelBold.extend`
  color: ${props =>
    props.active ? props.theme.textColor : props.theme.labelColor};
`;
const LayerGroupSelector = ({layers, editableLayers, onChange, topLayers}) => (
  <StyledInteractionPanel className="map-style__layer-group__selector">
    <div className="layer-group__header">
      <PanelLabel>Map Layers</PanelLabel>
    </div>
    <PanelContent className="map-style__layer-group">
      {Object.keys(editableLayers).map(slug => (
        <StyledLayerGroupItem className="layer-group__select" key={slug}>
          <PanelLabelWrapper>
            <PanelHeaderAction
              className="layer-group__visibility-toggle"
              id={`${slug}-toggle`}
              tooltip={layers[slug] ? 'hide' : 'show'}
              onClick={() =>
                onChange({
                  visibleLayerGroups: {
                    ...layers,
                    [slug]: !layers[slug]
                  }
                })
              }
              IconComponent={layers[slug] ? EyeSeen : EyeUnseen}
              active={layers[slug]}
              flush
            />
            <LayerLabel active={layers[slug]}>{slug}</LayerLabel>
          </PanelLabelWrapper>
          <CenterFlexbox className="layer-group__bring-top">
            <PanelHeaderAction
              id={`${slug}-top`}
              tooltip="Move to top of data layers"
              disabled={!layers[slug]}
              IconComponent={Upload}
              active={topLayers[slug]}
              onClick={() =>
                onChange({
                  topLayerGroups: {
                    ...topLayers,
                    [slug]: !topLayers[slug]
                  }
                })
              }
            />
          </CenterFlexbox>
        </StyledLayerGroupItem>
      ))}
    </PanelContent>
  </StyledInteractionPanel>
);
