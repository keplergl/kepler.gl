// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import {createSelector} from 'reselect';

import {Button} from '../common/styled-components';
import MapStyleSelectorFactory from './map-style-panel/map-style-selector';
import LayerGroupSelectorFactory from './map-style-panel/map-layer-selector';
import PanelTitleFactory from '../side-panel/panel-title';

import {Add, Trash} from '../common/icons';
import {PanelMeta} from './common/types';
import {injectIntl, WrappedComponentProps} from 'react-intl';
import {FormattedMessage} from '@kepler.gl/localization';
import {MapStyle} from '@kepler.gl/reducers';
import {MapStyleActions} from '@kepler.gl/actions';
import {MapStyles} from '@kepler.gl/types';

export type MapManagerProps = {
  mapStyle: MapStyle;
  mapStyleActions: {
    mapStyleChange: typeof MapStyleActions.mapStyleChange;
    mapConfigChange: typeof MapStyleActions.mapConfigChange;
    set3dBuildingColor: typeof MapStyleActions.set3dBuildingColor;
    setBackgroundColor: typeof MapStyleActions.setBackgroundColor;
    removeCustomMapStyle: typeof MapStyleActions.removeCustomMapStyle;
  };
  showAddMapStyleModal: () => void;
  panelMetadata: PanelMeta;
} & WrappedComponentProps;

MapManagerFactory.deps = [MapStyleSelectorFactory, LayerGroupSelectorFactory, PanelTitleFactory];

function MapManagerFactory(
  MapStyleSelector: ReturnType<typeof MapStyleSelectorFactory>,
  LayerGroupSelector: ReturnType<typeof LayerGroupSelectorFactory>,
  PanelTitle: ReturnType<typeof PanelTitleFactory>
) {
  class MapManager extends Component<MapManagerProps> {
    state = {
      isSelecting: false
    };

    _toggleSelecting = () => {
      this.setState({isSelecting: !this.state.isSelecting});
    };

    _selectStyle = (val: string) => {
      const {mapStyleActions} = this.props;
      const {mapStyleChange} = mapStyleActions;
      mapStyleChange(val);
      this._toggleSelecting();
    };

    getCustomMapStylesActions = createSelector(
      (props: MapManagerProps) => props.mapStyle.mapStyles,
      (props: MapManagerProps) => props.mapStyleActions,
      (mapStyles: MapStyles, mapStyleActions) => {
        const actionsPerCustomStyle = {};
        Object.values(mapStyles)
          .filter(mapStyle => {
            return Boolean(mapStyle.custom);
          })
          .forEach(({id}) => {
            actionsPerCustomStyle[id] = [
              {
                id: `remove-map-style-${id}`,
                IconComponent: Trash,
                tooltip: 'tooltip.removeBaseMapStyle',
                onClick: () => mapStyleActions.removeCustomMapStyle({id})
              }
            ];
          });
        return actionsPerCustomStyle;
      }
    );

    render() {
      const {mapStyle, intl, mapStyleActions, showAddMapStyleModal, panelMetadata} = this.props;
      const currentStyle = mapStyle.mapStyles[mapStyle.styleType] || {};
      const editableLayers = currentStyle.layerGroups || [];
      const customMapStylesActions = this.getCustomMapStylesActions(this.props);

      return (
        <div className="map-style-panel">
          <PanelTitle
            className="map-manager-title"
            title={intl.formatMessage({id: panelMetadata.label})}
          >
            <Button className="add-map-style-button" onClick={showAddMapStyleModal}>
              <Add height="12px" />
              <FormattedMessage id={'mapManager.addMapStyle'} />
            </Button>
          </PanelTitle>
          <div>
            <MapStyleSelector
              mapStyle={mapStyle}
              isSelecting={this.state.isSelecting}
              onChange={this._selectStyle}
              toggleActive={this._toggleSelecting}
              customMapStylesActions={customMapStylesActions}
            />
            {editableLayers.length ? (
              <LayerGroupSelector
                layers={mapStyle.visibleLayerGroups}
                editableLayers={editableLayers}
                topLayers={mapStyle.topLayerGroups}
                onChange={mapStyleActions.mapConfigChange}
                threeDBuildingColor={mapStyle.threeDBuildingColor}
                on3dBuildingColorChange={mapStyleActions.set3dBuildingColor}
                backgroundColor={mapStyle.backgroundColor}
                onBackgroundColorChange={mapStyleActions.setBackgroundColor}
              />
            ) : null}
          </div>
        </div>
      );
    }
  }
  return injectIntl(MapManager);
}

export default MapManagerFactory;
