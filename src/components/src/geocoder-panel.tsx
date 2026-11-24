// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';
import styled, {IStyledComponent} from 'styled-components';
import classnames from 'classnames';
import {processRowObject} from '@kepler.gl/processors';
import {FlyToInterpolator} from '@deck.gl/core';
import {getCenterAndZoomFromBounds} from '@kepler.gl/utils';
import {
  GEOCODER_DATASET_NAME,
  GEOCODER_LAYER_ID,
  GEOCODER_GEO_OFFSET,
  GEOCODER_ICON_COLOR,
  GEOCODER_ICON_SIZE
} from '@kepler.gl/constants';
import {
  AddDataToMapOptions,
  GeocoderFocusMode,
  LayerOrder,
  MapState,
  ProtoDataset,
  RGBColor,
  UiState,
  Viewport
} from '@kepler.gl/types';
import {ActionHandler, removeDataset, updateMap, updateVisData} from '@kepler.gl/actions';

import Geocoder, {Result} from './geocoder/geocoder';
type MapViewState = {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing?: number;
  pitch?: number;
  transitionDuration?: number;
  transitionInterpolator?: object;
};

import {BaseComponentProps} from './types';

function generateConfig(color: RGBColor) {
  const iconLayer = {
    id: GEOCODER_LAYER_ID,
    type: 'icon',
    config: {
      label: 'Geocoder Layer',
      color,
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

  return {
    visState: {
      layers: [iconLayer],
      layerOrder: [iconLayer.id]
    }
  };
}

export type StyledGeocoderPanelProps = BaseComponentProps & {
  unsyncedViewports?: boolean;
  index?: number;
  width?: number;
};

const StyledGeocoderPanel: IStyledComponent<
  'web',
  StyledGeocoderPanelProps
> = styled.div<StyledGeocoderPanelProps>`
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
  layerOrder: LayerOrder;
  limitSearch?: boolean;
  focusMode?: GeocoderFocusMode;
  color?: RGBColor;

  transitionDuration?: MapViewState['transitionDuration'];
  width?: number;
  className?: string;
  index: number;
  unsyncedViewports: boolean;
}

export default function GeocoderPanelFactory(): React.FC<GeocoderPanelProps> {
  const GeocoderPanel = ({
    isGeocoderEnabled,
    mapState,
    mapboxApiAccessToken,
    updateVisData,
    removeDataset,
    updateMap,
    limitSearch = false,
    focusMode,
    color = GEOCODER_ICON_COLOR,
    transitionDuration = 3000,
    width,
    className,
    index,
    unsyncedViewports
  }: GeocoderPanelProps) => {
    const removeGeocoderDataset = useCallback(() => {
      removeDataset(GEOCODER_DATASET_NAME);
    }, [removeDataset]);

    const onSelected = useCallback(
      (_viewport: Viewport | null = null, geoItem: Result) => {
        const {
          center: [lon, lat],
          text,
          bbox
        } = geoItem;

        const updateVisDataPayload = getUpdateVisDataPayload(lat, lon, text);
        if (updateVisDataPayload) {
          removeGeocoderDataset();
          updateVisData(...updateVisDataPayload, generateConfig(color));
        }

        const centerOnPin = focusMode === 'centerPin';
        // Don't fit the bounds in pin mode: keep the current pane's zoom and orientation.
        const centerAndZoom = centerOnPin
          ? Number.isFinite(lat) && Number.isFinite(lon)
            ? {center: [lon, lat]}
            : null
          : getCenterAndZoomFromBounds(
              bbox || [
                lon - GEOCODER_GEO_OFFSET,
                lat - GEOCODER_GEO_OFFSET,
                lon + GEOCODER_GEO_OFFSET,
                lat + GEOCODER_GEO_OFFSET
              ],
              {width: mapState.width, height: mapState.height}
            );

        if (!centerAndZoom) {
          return;
        }

        updateMap(
          {
            latitude: centerAndZoom.center[1],
            longitude: centerAndZoom.center[0],
            ...(!centerOnPin ? {pitch: 0, bearing: 0} : {}),
            // Degenerate fit bounds may produce a non-finite zoom; leave it unchanged.
            ...('zoom' in centerAndZoom && Number.isFinite(centerAndZoom.zoom)
              ? {zoom: centerAndZoom.zoom}
              : {}),
            transitionDuration,
            transitionInterpolator: new FlyToInterpolator()
          },
          index
        );
      },
      [
        color,
        focusMode,
        index,
        mapState,
        removeGeocoderDataset,
        transitionDuration,
        updateMap,
        updateVisData
      ]
    );

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
            onSelected={onSelected}
            onDeleteMarker={removeGeocoderDataset}
            width={width}
            mapState={mapState}
            limitSearch={limitSearch}
          />
        )}
      </StyledGeocoderPanel>
    );
  };

  return GeocoderPanel;
}
