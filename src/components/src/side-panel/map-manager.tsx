// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState, useMemo, useCallback} from 'react';

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
  const MapManager: React.FC<MapManagerProps> = ({
    mapStyle,
    intl,
    mapStyleActions,
    showAddMapStyleModal,
    panelMetadata
  }) => {
    const [isSelecting, setIsSelecting] = useState(false);
    const {mapStyleChange, removeCustomMapStyle} = mapStyleActions;
    const currentStyle = mapStyle.mapStyles[mapStyle.styleType] || {};
    const editableLayers = currentStyle.layerGroups || [];

    const toggleSelecting = useCallback(() => {
      setIsSelecting(prev => !prev);
    }, [setIsSelecting]);

    const mapStyles = mapStyle.mapStyles;
    const selectStyle = useCallback(
      (val: string) => {
        mapStyleChange(val);
        setIsSelecting(false);
      },
      [mapStyleChange, setIsSelecting]
    );

    const customMapStylesActions = useMemo(() => {
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
              onClick: () => removeCustomMapStyle({id})
            }
          ];
        });
      return actionsPerCustomStyle;
    }, [mapStyles, removeCustomMapStyle]);

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
            isSelecting={isSelecting}
            onChange={selectStyle}
            toggleActive={toggleSelecting}
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
  };

  return injectIntl(MapManager);
}

export default MapManagerFactory;
