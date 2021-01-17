// Copyright (c) 2021 Uber Technologies, Inc.
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
import styled from 'styled-components';
import Processors from 'processors';
import {FlyToInterpolator} from '@deck.gl/core';
import KeplerGlSchema from 'schemas';
import {getCenterAndZoomFromBounds} from 'utils/projection-utils';

import Geocoder from './geocoder/geocoder';
import {
  GEOCODER_DATASET_NAME,
  GEOCODER_LAYER_ID,
  GEOCODER_GEO_OFFSET,
  GEOCODER_ICON_COLOR,
  GEOCODER_ICON_SIZE
} from 'constants/default-settings';

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

const PARSED_CONFIG = KeplerGlSchema.parseSavedConfig({
  version: 'v1',
  config: {
    visState: {
      layers: [ICON_LAYER]
    }
  }
});

const StyledGeocoderPanel = styled.div`
  position: absolute;
  top: ${props => props.theme.geocoderTop}px;
  right: ${props => props.theme.geocoderRight}px;
  width: ${props => (Number.isFinite(props.width) ? props.width : props.theme.geocoderWidth)}px;
  box-shadow: ${props => props.theme.boxShadow};
  z-index: 100;
`;

function generateGeocoderDataset(lat, lon, text) {
  return {
    data: Processors.processRowObject([
      {
        lt: lat,
        ln: lon,
        icon: 'place',
        text
      }
    ]),
    id: GEOCODER_DATASET_NAME,
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

export default function GeocoderPanelFactory() {
  class GeocoderPanel extends Component {
    static propTypes = {
      isGeocoderEnabled: PropTypes.bool.isRequired,
      mapboxApiAccessToken: PropTypes.string.isRequired,
      mapState: PropTypes.object.isRequired,
      updateVisData: PropTypes.func.isRequired,
      removeDataset: PropTypes.func.isRequired,
      updateMap: PropTypes.func.isRequired,

      transitionDuration: PropTypes.number,
      width: PropTypes.number
    };

    removeGeocoderDataset() {
      this.props.removeDataset(GEOCODER_DATASET_NAME);
    }

    onSelected = (viewport = null, geoItem) => {
      const {
        center: [lon, lat],
        text,
        bbox
      } = geoItem;
      this.removeGeocoderDataset();
      this.props.updateVisData(
        [generateGeocoderDataset(lat, lon, text)],
        {
          keepExistingConfig: true
        },
        PARSED_CONFIG
      );
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

      this.props.updateMap({
        latitude: centerAndZoom.center[1],
        longitude: centerAndZoom.center[0],
        // For marginal or invalid bounds, zoom may be NaN. Make sure to provide a valid value in order
        // to avoid corrupt state and potential crashes as zoom is expected to be a number
        ...(Number.isFinite(centerAndZoom.zoom) ? {zoom: centerAndZoom.zoom} : {}),
        pitch: 0,
        bearing: 0,
        transitionDuration: this.props.transitionDuration,
        transitionInterpolator: new FlyToInterpolator()
      });
    };

    removeMarker = () => {
      this.removeGeocoderDataset();
    };

    render() {
      const {isGeocoderEnabled, mapboxApiAccessToken, width} = this.props;
      return (
        <StyledGeocoderPanel
          className="geocoder-panel"
          width={width}
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

  GeocoderPanel.defaultProps = {
    transitionDuration: 3000
  };

  return GeocoderPanel;
}
