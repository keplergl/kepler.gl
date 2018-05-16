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

// libraries
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import throttle from 'lodash.throttle';

import MapContainerFactory from './map-container';
import {calculateExportImageSize, convertToPng} from 'utils/export-image-utils';

const propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  exportImageSetting: PropTypes.object.isRequired,
  mapFields: PropTypes.object.isRequired
};

PlotContainerFactory.deps = [MapContainerFactory];

const StyledPlotContainer = styled.div`
  .mapboxgl-ctrl-bottom-left,
  .mapboxgl-ctrl-bottom-right {
    display: none
  }
`;

export default function PlotContainerFactory(MapContainer) {
  class PlotContainer extends Component {
    constructor(props) {
      super(props);
      this._onMapRender = throttle(this._onMapRender, 500);
    }

    componentWillReceiveProps(newProps) {
      // re-fetch the new screenshot only when ratio or resolution changes
      if (
        this.props.exportImageSetting.ratio !== newProps.exportImageSetting.ratio ||
        this.props.exportImageSetting.resolution !== newProps.exportImageSetting.resolution ||
        this.props.exportImageSetting.legend !== newProps.exportImageSetting.legend
      ) {
        this._retrieveNewScreenshot();
      }
    }

    _onMapRender = (map) => {
      if (map.isStyleLoaded()) {
        this._retrieveNewScreenshot();
      }
    };

    _retrieveNewScreenshot = () => {
      if (this.plottingAreaRef) {
        this.props.startExportingImage();
        convertToPng(this.plottingAreaRef).then(
          dataUri => this.props.setExportImageDataUri({dataUri})
        );
      }
    };

    render() {
      const {width, height, exportImageSetting, mapFields} = this.props;
      const {ratio, resolution, legend} = exportImageSetting;
      const exportImageSize = calculateExportImageSize({
        width, height, ratio, resolution
      });

      const mapboxStyle = mapFields.mapStyle;

      // figure out how to turn on legend through mapProps
      const mapProps = {
        ...mapFields,
        mapboxStyle,
        mapState: {
          ...mapFields.mapState,
          zoom: mapFields.mapState.zoom + exportImageSize.zoomOffset,
          width: exportImageSize.width,
          height: exportImageSize.height
        },
        mapControls: {
          // override map legend visibility
          mapLegend: {
            show: legend,
            active: true
          }
        },
        mapStateActions: {
          ...mapFields.mapStateActions,
          updateMap: () => {}
        }
      };

      return (
        <StyledPlotContainer style={{position: 'absolute', top: -9999, left: -9999}}>
          <div
            ref={element => {this.plottingAreaRef = element}}
            style={{
              width: exportImageSize.width,
              height: exportImageSize.height
            }}
          >
            <MapContainer
              index={0}
              onMapRender={this._onMapRender}
              {...mapProps}
            />
          </div>
        </StyledPlotContainer>
      );
    }
  }

  PlotContainer.propsTypes = propTypes;
  return PlotContainer;
}
