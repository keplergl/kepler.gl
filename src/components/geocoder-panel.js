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
import styled from 'styled-components';
import Geocoder from './geocoder/geocoder';
import Processors from 'processors';
import {addDataToMap, removeDataset, updateMap} from 'actions';
import {FlyToInterpolator} from '@deck.gl/core';
import geoViewport from '@mapbox/geo-viewport';

const GEOCODER_DATASET_NAME = 'geocoder_dataset';
const GEO_OFFSET = 0.05;
const ICON_LAYER = {
  id: 'geocoder_layer',
  type: 'icon',
  config: {
    label: 'Geocoder Layer',
    color: [255, 0, 0],
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
      radius: 80
    }
  }
};

const StyledGeocoderPanel = styled.div`
  position: absolute;
  top: ${props => props.theme.geocoderTop}px;
  right: ${props => props.theme.geocoderRight}px;
  width: ${props => props.theme.geocoderWidth}px;
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
      transitionDuration: PropTypes.number
    };

    removeGeocoderDataset() {
      this.props.dispatch(removeDataset(GEOCODER_DATASET_NAME));
    }

    onSelected = (viewport = null, geoItem) => {
      const {
        center: [lon, lat],
        text,
        bbox
      } = geoItem;
      this.removeGeocoderDataset();
      this.props.dispatch(
        addDataToMap({
          datasets: [generateGeocoderDataset(lat, lon, text)],
          options: {
            keepExistingConfig: true
          },
          config: {
            version: 'v1',
            config: {
              visState: {
                layers: [ICON_LAYER]
              }
            }
          }
        })
      );
      const bounds = bbox || [
        lon - GEO_OFFSET,
        lat - GEO_OFFSET,
        lon + GEO_OFFSET,
        lat + GEO_OFFSET
      ];
      const {center, zoom} = geoViewport.viewport(bounds, [
        this.props.mapState.width,
        this.props.mapState.height
      ]);

      this.props.dispatch(
        updateMap({
          latitude: center[1],
          longitude: center[0],
          zoom,
          pitch: 0,
          bearing: 0,
          transitionDuration: this.props.transitionDuration,
          transitionInterpolator: new FlyToInterpolator()
        })
      );
    };

    removeMarker = () => {
      this.removeGeocoderDataset();
    };

    render() {
      const {isGeocoderEnabled, mapboxApiAccessToken} = this.props;
      return (
        <StyledGeocoderPanel
          className="geocoder-panel"
          style={{display: isGeocoderEnabled ? 'block' : 'none'}}
        >
          {isValid(mapboxApiAccessToken) && (
            <Geocoder
              mapboxApiAccessToken={mapboxApiAccessToken}
              onSelected={this.onSelected}
              onDeleteMarker={this.removeMarker}
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
