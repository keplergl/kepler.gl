// Copyright (c) 2023 Uber Technologies, Inc.
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

import {Button, SidePanelSection} from '../common/styled-components';
import MapStyleSelectorFactory from './map-style-panel/map-style-selector';
import LayerGroupSelectorFactory from './map-style-panel/map-layer-selector';

import {Add} from '../common/icons';
import ColorSelector from './layer-panel/color-selector';
import {createSelector} from 'reselect';
import {injectIntl, WrappedComponentProps} from 'react-intl';
import {FormattedMessage} from '@kepler.gl/localization';
import {MapStyle} from '@kepler.gl/reducers';
import {MapStyleActions} from '@kepler.gl/actions';

type MapManagerProps = {
  mapStyle: MapStyle;
  mapStyleActions: typeof MapStyleActions;
  showAddMapStyleModal: () => void;
} & WrappedComponentProps;

MapManagerFactory.deps = [MapStyleSelectorFactory, LayerGroupSelectorFactory];

function MapManagerFactory(
  MapStyleSelector: ReturnType<typeof MapStyleSelectorFactory>,
  LayerGroupSelector: ReturnType<typeof LayerGroupSelectorFactory>
) {
  class MapManager extends Component<MapManagerProps> {
    state = {
      isSelecting: false
    };

    buildingColorSelector = (props: MapManagerProps) => props.mapStyle.threeDBuildingColor;
    setColorSelector = (props: MapManagerProps) => props.mapStyleActions.set3dBuildingColor;

    _toggleSelecting = () => {
      this.setState({isSelecting: !this.state.isSelecting});
    };

    _selectStyle = (val: string) => {
      const {mapStyleActions} = this.props;
      const {mapStyleChange} = mapStyleActions;
      mapStyleChange(val);
      this._toggleSelecting();
    };

    render() {
      const {mapStyle, intl, mapStyleActions, showAddMapStyleModal} = this.props;
      const currentStyle = mapStyle.mapStyles[mapStyle.styleType] || {};
      const editableLayers = (currentStyle.layerGroups || []).map(lg => lg.slug);
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
                onChange={mapStyleActions.mapConfigChange}
              />
            ) : null}
            <SidePanelSection>
              <ColorSelector colorSets={colorSets} disabled={!hasBuildingLayer} />
            </SidePanelSection>
            <Button className="add-map-style-button" onClick={showAddMapStyleModal} secondary>
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
