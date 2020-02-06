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

// libraries
import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import {createSelector} from 'reselect';
import styled from 'styled-components';
import {StaticMap} from 'react-map-gl';
import debounce from 'lodash.debounce';
import {exportImageError} from 'utils/notifications-utils';
import MapContainerFactory from './map-container';
import {convertToPng} from 'utils/export-utils';
import {scaleMapStyleByResolution} from 'utils/map-style-utils/mapbox-gl-style-editor';
import {getScaleFromImageSize} from 'utils/export-utils';

const propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  exportImageSetting: PropTypes.object.isRequired,
  addNotification: PropTypes.func.isRequired,
  mapFields: PropTypes.object.isRequired
};

PlotContainerFactory.deps = [MapContainerFactory];

// Remove mapbox logo in exported map, because it contains non-ascii characters
const StyledPlotContainer = styled.div`
  .mapboxgl-ctrl-bottom-left,
  .mapboxgl-ctrl-bottom-right {
    display: none;
  }

  position: absolute;
`;

const deckGlProps = {
  glOptions: {
    preserveDrawingBuffer: true,
    useDevicePixels: false
  }
};

export default function PlotContainerFactory(MapContainer) {
  class PlotContainer extends Component {
    constructor(props) {
      super(props);
      this._onMapRender = debounce(this._onMapRender, 500);
    }

    componentDidMount() {
      this.props.startExportingImage();
    }

    componentDidUpdate(prevProps) {
      // re-fetch the new screenshot only when ratio legend or resolution changes
      const checks = ['ratio', 'resolution', 'legend'];
      const shouldRetrieveScreenshot = checks.some(
        item => this.props.exportImageSetting[item] !== prevProps.exportImageSetting[item]
      );
      if (shouldRetrieveScreenshot) {
        this._retrieveNewScreenshot();
      }
    }

    plottingAreaRef = createRef();

    mapStyleSelector = props => props.mapFields.mapStyle;
    mapScaleSelector = props => {
      const {imageSize} = props.exportImageSetting;
      const {mapState} = props.mapFields;
      if (imageSize.scale) {
        return imageSize.scale;
      }

      const scale = getScaleFromImageSize(
        imageSize.imageW,
        imageSize.imageH,
        mapState.width * (mapState.isSplit ? 2 : 1),
        mapState.height
      );

      return scale > 0 ? scale : 1;
    };

    scaledMapStyleSelector = createSelector(
      this.mapStyleSelector,
      this.mapScaleSelector,
      (mapStyle, scale) => ({
        ...mapStyle,
        bottomMapStyle: scaleMapStyleByResolution(mapStyle.bottomMapStyle, scale),
        topMapStyle: scaleMapStyleByResolution(mapStyle.topMapStyle, scale)
      })
    );

    _onMapRender = map => {
      if (map.isStyleLoaded()) {
        this._retrieveNewScreenshot();
      }
    };

    _retrieveNewScreenshot = () => {
      if (this.plottingAreaRef.current) {
        this.props.startExportingImage();
        const filter = node => node.className !== 'mapboxgl-control-container';

        convertToPng(this.plottingAreaRef.current, {filter})
          .then(this.props.setExportImageDataUri)
          .catch(err => {
            this.props.setExportImageError(err);
            this.props.addNotification(exportImageError({err}));
          });
      }
    };

    render() {
      const {exportImageSetting, mapFields, splitMaps} = this.props;
      const {imageSize = {}, legend} = exportImageSetting;
      const isSplit = splitMaps && splitMaps.length > 1;

      const size = {
        width: imageSize.imageW || 1,
        height: imageSize.imageH || 1
      };
      const scale = this.mapScaleSelector(this.props);
      const mapProps = {
        ...mapFields,
        mapStyle: this.scaledMapStyleSelector(this.props),

        // override viewport based on export settings
        mapState: {
          ...mapFields.mapState,
          width: size.width / (isSplit ? 2 : 1),
          height: size.height,
          zoom: mapFields.mapState.zoom + (Math.log2(scale) || 0)
        },
        mapControls: {
          // override map legend visibility
          mapLegend: {
            show: legend,
            active: true
          }
        },
        MapComponent: StaticMap,
        onMapRender: this._onMapRender,
        isExport: true,
        deckGlProps
      };

      const mapContainers = !isSplit
        ? <MapContainer index={0} {...mapProps} />
        : splitMaps.map((settings, index) => (
            <MapContainer
              key={index}
              index={index}
              {...mapProps}
              mapLayers={splitMaps[index].layers}
            />
          ));

      return (
        <StyledPlotContainer
          style={{position: 'absolute', top: -9999, left: -9999}}
          className="export-map-instance"
        >
          <div
            ref={this.plottingAreaRef}
            style={{
              width: `${size.width}px`,
              height: `${size.height}px`,
              display: 'flex'
            }}
          >
            {mapContainers}
          </div>
        </StyledPlotContainer>
      );
    }
  }

  PlotContainer.propsTypes = propTypes;
  return PlotContainer;
}
