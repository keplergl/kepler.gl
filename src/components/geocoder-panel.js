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
import {SidePanelSection, PanelLabel} from './common/styled-components';
import {FormattedMessage} from 'react-intl';
import Geocoder from 'react-mapbox-gl-geocoder';
import Processors from 'processors';
import {fitBounds, addDataToMap, removeDataset} from 'actions';

const GEOCODER_DATASET_NAME = 'geocoder_dataset';
const QUERY_PARAMS = {};
const GEO_OFFSET = 0.1;
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

const GeocoderPanelContent = styled.div`
  background-color: ${props => props.theme.panelBackground};
  padding: 0.5em 1em;
  position: absolute;
  top: 20px;
  left: 50%;
  margin-left: -20em;
  width: 40em;
  box-sizing: border-box;
`;

const GeocoderWrapper = styled.div`
  color: ${props => props.theme.textColor};
  font-size: ${props => props.theme.fontSize};

  .react-geocoder {
    position: relative;
  }

  .react-geocoder input {
    ${props => props.theme.secondaryInput};
  }

  .react-geocoder-results {
    background-color: ${props => props.theme.panelBackground};
    position: absolute;
    width: 43.5em;
  }

  .react-geocoder-item {
    ${props => props.theme.dropdownListItem};
    ${props => props.theme.textTruncate};
  }

  .remove-layer {
    background: transparent;
    border: none;
    bottom: 28px;
    color: ${props => props.theme.textColor};
    cursor: pointer;
    display: inline;
    font-size: 16px;
    padding: 2px 8px;
    position: absolute;
    right: 16px;

    :hover,
    :focus,
    :active {
      background: transparent !important;
      border: none;
      box-shadow: 0;
      color: ${props => props.theme.textColor};
      opacity: 0.6;
      outline: none;
    }
  }
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

export class GeocoderPanel extends Component {
  static propTypes = {
    isGeocoderEnabled: PropTypes.bool.isRequired,
    mapboxApiAccessToken: PropTypes.string.isRequired
  };

  state = {
    selectedGeoItem: null
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
              layers: [ICON_LAYER],
              interactionConfig: {
                geocoder: {
                  enabled: true,
                  data: {lat, lon, text}
                }
              }
            }
          }
        }
      })
    );
    this.props.dispatch(
      fitBounds(bbox || [lon - GEO_OFFSET, lat - GEO_OFFSET, lon + GEO_OFFSET, lat + GEO_OFFSET])
    );
    this.setState({
      selectedGeoItem: geoItem
    });
  };

  removeMarker = () => {
    this.setState({
      selectedGeoItem: null
    });
    this.removeGeocoderDataset();
  };

  render() {
    const {isGeocoderEnabled, mapboxApiAccessToken} = this.props;
    return (
      <GeocoderPanelContent
        className="geocoder-panel"
        style={{display: isGeocoderEnabled ? 'block' : 'none'}}
      >
        <SidePanelSection>
          <PanelLabel>
            <FormattedMessage id={'geocoder.title'} />
          </PanelLabel>
          <GeocoderWrapper>
            {isValid(mapboxApiAccessToken) && (
              <Geocoder
                mapboxApiAccessToken={mapboxApiAccessToken}
                onSelected={this.onSelected}
                hideOnSelect
                pointZoom={15}
                viewport={{}}
                queryParams={QUERY_PARAMS}
              />
            )}
            {this.state.selectedGeoItem && (
              <button
                type="button"
                className="btn btn-primary remove-layer"
                onClick={this.removeMarker}
                title="Remove marker"
              >
                &times;
              </button>
            )}
          </GeocoderWrapper>
        </SidePanelSection>
      </GeocoderPanelContent>
    );
  }
}

export default function GeocoderPanelFactory() {
  return GeocoderPanel;
}
