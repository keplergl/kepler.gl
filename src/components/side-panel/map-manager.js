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

import {Button, SidePanelSection} from 'components/common/styled-components';
import MapStyleSelectorFactory from 'components/side-panel/map-style-panel/map-style-selector';
import LayerGroupSelectorFactory from 'components/side-panel/map-style-panel/map-layer-selector';

import {Add} from 'components/common/icons';
import {DEFAULT_LAYER_GROUPS} from 'constants/default-settings';
import ColorSelector from './layer-panel/color-selector';
import {createSelector} from 'reselect';
import {FormattedMessage, injectIntl} from 'react-intl';

MapManagerFactory.deps = [MapStyleSelectorFactory, LayerGroupSelectorFactory];

function MapManagerFactory(MapStyleSelector, LayerGroupSelector) {
  class MapManager extends Component {
    static propTypes = {
      mapStyle: PropTypes.object.isRequired,
      onConfigChange: PropTypes.func.isRequired,
      onStyleChange: PropTypes.func.isRequired,
      showAddMapStyleModal: PropTypes.func.isRequired
    };

    state = {
      isSelecting: false
    };

    buildingColorSelector = props => props.mapStyle.threeDBuildingColor;
    setColorSelector = props => props.set3dBuildingColor;

    _toggleSelecting = () => {
      this.setState({isSelecting: !this.state.isSelecting});
    };

    _selectStyle = val => {
      this.props.onStyleChange(val);
      this._toggleSelecting();
    };

    render() {
      const {mapStyle, intl} = this.props;
      const editableLayers = DEFAULT_LAYER_GROUPS.map(lg => lg.slug);
      const hasBuildingLayer = mapStyle.visibleLayerGroups['3d building'];
      const colorSetSelector = createSelector(
        this.buildingColorSelector,
        this.setColorSelector,
        (selectedColor, setColor) => [
          {
            selectedColor,
            setColor,
            isRange: false,
            label: intl.formatMessage({id: 'mapManager.3dBuildingColor'})
          }
        ]
      );

      const colorSets = colorSetSelector(this.props);

      return (
        <div className="map-style-panel">
          <div>
            <MapStyleSelector
              mapStyle={mapStyle}
              isSelecting={this.state.isSelecting}
              onChange={this._selectStyle}
              toggleActive={this._toggleSelecting}
            />
            {editableLayers.length ? (
              <LayerGroupSelector
                layers={mapStyle.visibleLayerGroups}
                editableLayers={editableLayers}
                topLayers={mapStyle.topLayerGroups}
                onChange={this.props.onConfigChange}
              />
            ) : null}
            <SidePanelSection>
              <ColorSelector colorSets={colorSets} disabled={!hasBuildingLayer} />
            </SidePanelSection>
            <Button
              className="add-map-style-button"
              onClick={this.props.showAddMapStyleModal}
              secondary
            >
              <Add height="12px" />
              <FormattedMessage id={'mapManager.addMapStyle'} />
            </Button>
          </div>
        </div>
      );
    }
  }
  return injectIntl(MapManager);
}

export default MapManagerFactory;
