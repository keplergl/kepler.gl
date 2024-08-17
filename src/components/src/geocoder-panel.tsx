// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component, ComponentType} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import {processRowObject} from '@kepler.gl/processors';
import {FlyToInterpolator} from '@deck.gl/core/typed';
import {getCenterAndZoomFromBounds} from '@kepler.gl/utils';
import {
  GEOCODER_DATASET_NAME,
  GEOCODER_LAYER_ID,
  GEOCODER_GEO_OFFSET,
  GEOCODER_ICON_COLOR,
  GEOCODER_ICON_SIZE
} from '@kepler.gl/constants';
import {AddDataToMapOptions, MapState, ProtoDataset, UiState, Viewport} from '@kepler.gl/types';
import {ActionHandler, removeDataset, updateMap, updateVisData} from '@kepler.gl/actions';

import Geocoder, {Result} from './geocoder/geocoder';
import {MapViewState} from '@deck.gl/core/typed';

const ICON_LAYER = {
  id: GEOCODER_LAYER_ID,
  type: 'icon',
  config: {
    label: 'Geocoder Layer',
    color: GEOCODER_ICON_COLOR,
    dataId: GEOCODER_DATASET_NAME,
    columns: {
      lat: 'lt',
      lng: 'ln',
      icon: 'icon',
      label: 'text'
    },
    isVisible: true,
    hidden: true,
    visConfig: {
      radius: GEOCODER_ICON_SIZE
    }
  }
};

function generateConfig(layerOrder) {
  return {
    visState: {
      layers: [ICON_LAYER],
      layerOrder: [ICON_LAYER.id, ...layerOrder]
    }
  };
}

interface StyledGeocoderPanelProps {
  width?: number;
  unsyncedViewports: any;
  index: any;
}

const StyledGeocoderPanel = styled.div<StyledGeocoderPanelProps>`
  position: absolute;
  top: ${props => props.theme.geocoderTop}px;
  right: ${props =>
    props.unsyncedViewports
      ? // 2 geocoders: split mode and unsynced viewports
        Number.isFinite(props.index) && props.index === 0
        ? `calc(50% + ${props.theme.geocoderRight}px)` // unsynced left geocoder (index 0)
        : `${props.theme.geocoderRight}px` // unsynced right geocoder (index 1)
      : // 1 geocoder: single mode OR split mode and synced viewports
        `${props.theme.geocoderRight}px`};
  width: ${props => (Number.isFinite(props.width) ? props.width : props.theme.geocoderWidth)}px;
  box-shadow: ${props => props.theme.boxShadow};
  z-index: 100;
`;

function generateGeocoderDataset(lat: number, lon: number, text?: string): ProtoDataset | null {
  const data = processRowObject([
    {
      lt: lat,
      ln: lon,
      icon: 'place',
      text
    }
  ]);
  if (!data) {
    return null;
  }

  return {
    data,
    info: {
      hidden: true,
      id: GEOCODER_DATASET_NAME,
      label: GEOCODER_DATASET_NAME
    }
  };
}

function isValid(key) {
  return /pk\..*\..*/.test(key);
}

export function getUpdateVisDataPayload(
  lat: number,
  lon: number,
  text?: string
): [ProtoDataset[], AddDataToMapOptions] | null {
  const dataset = generateGeocoderDataset(lat, lon, text);
  if (!dataset) {
    return null;
  }
  return [
    [dataset],
    {
      keepExistingConfig: true
    }
  ];
}

interface GeocoderPanelProps {
  isGeocoderEnabled: boolean;
  mapState: MapState;
  uiState: UiState;
  mapboxApiAccessToken: string;
  updateVisData: ActionHandler<typeof updateVisData>;
  removeDataset: ActionHandler<typeof removeDataset>;
  updateMap: ActionHandler<typeof updateMap>;
  layerOrder: string[];

  transitionDuration?: MapViewState['transitionDuration'];
  width?: number;
  className?: string;
  index: number;
  unsyncedViewports: boolean;
}

export default function GeocoderPanelFactory(): ComponentType<GeocoderPanelProps> {
  class GeocoderPanel extends Component<GeocoderPanelProps> {
    defaultProps = {
      transitionDuration: 3000
    };

    removeGeocoderDataset() {
      this.props.removeDataset(GEOCODER_DATASET_NAME);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSelected = (viewport: Viewport | null = null, geoItem: Result) => {
      const {
        center: [lon, lat],
        text,
        bbox
      } = geoItem;
      const {layerOrder} = this.props;

      const updateVisDataPayload = getUpdateVisDataPayload(lat, lon, text);
      if (updateVisDataPayload) {
        this.removeGeocoderDataset();
        this.props.updateVisData(...updateVisDataPayload, generateConfig(layerOrder));
      }

      const bounds = bbox || [
        lon - GEOCODER_GEO_OFFSET,
        lat - GEOCODER_GEO_OFFSET,
        lon + GEOCODER_GEO_OFFSET,
        lat + GEOCODER_GEO_OFFSET
      ];
      const centerAndZoom = getCenterAndZoomFromBounds(bounds, {
        width: this.props.mapState.width,
        height: this.props.mapState.height
      });

      if (!centerAndZoom) {
        // failed to fit bounds
        return;
      }

      this.props.updateMap(
        {
          latitude: centerAndZoom.center[1],
          longitude: centerAndZoom.center[0],
          // For marginal or invalid bounds, zoom may be NaN. Make sure to provide a valid value in order
          // to avoid corrupt state and potential crashes as zoom is expected to be a number
          ...(Number.isFinite(centerAndZoom.zoom) ? {zoom: centerAndZoom.zoom} : {}),
          pitch: 0,
          bearing: 0,
          transitionDuration: this.props.transitionDuration,
          transitionInterpolator: new FlyToInterpolator()
        },
        this.props.index
      );
    };

    removeMarker = () => {
      this.removeGeocoderDataset();
    };

    render() {
      const {className, isGeocoderEnabled, mapboxApiAccessToken, width, index, unsyncedViewports} =
        this.props;
      return (
        <StyledGeocoderPanel
          className={classnames('geocoder-panel', className)}
          width={width}
          index={index}
          unsyncedViewports={unsyncedViewports}
          style={{display: isGeocoderEnabled ? 'block' : 'none'}}
        >
          {isValid(mapboxApiAccessToken) && (
            <Geocoder
              mapboxApiAccessToken={mapboxApiAccessToken}
              onSelected={this.onSelected}
              onDeleteMarker={this.removeMarker}
              width={width}
            />
          )}
        </StyledGeocoderPanel>
      );
    }
  }

  return GeocoderPanel;
}
