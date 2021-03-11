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

// libraries
import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import {createSelector} from 'reselect';
import styled from 'styled-components';
import {StaticMap} from 'react-map-gl';
import debounce from 'lodash.debounce';
import {exportImageError} from 'utils/notifications-utils';
import MapContainerFactory from './map-container';
import MapsLayoutFactory from './maps-layout';
import {convertToPng, getScaleFromImageSize} from 'utils/export-utils';
import {scaleMapStyleByResolution} from 'utils/map-style-utils/mapbox-gl-style-editor';

import {findMapBounds} from 'utils/data-utils';
import {getCenterAndZoomFromBounds} from 'utils/projection-utils';
import {GEOCODER_LAYER_ID} from 'constants/default-settings';

const CLASS_FILTER = ['mapboxgl-control-container', 'attrition-link', 'attrition-logo'];
const DOM_FILTER_FUNC = node => !CLASS_FILTER.includes(node.className);
const OUT_OF_SCREEN_POSITION = -9999;

const propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  exportImageSetting: PropTypes.object.isRequired,
  addNotification: PropTypes.func.isRequired,
  mapFields: PropTypes.object.isRequired,
  setExportImageSetting: PropTypes.object.isRequired,
  setExportImageDataUri: PropTypes.func.isRequired,
  setExportImageError: PropTypes.func.isRequired,
  splitMaps: PropTypes.arrayOf(PropTypes.object)
};

PlotContainerFactory.deps = [MapContainerFactory, MapsLayoutFactory];

// Remove mapbox logo in exported map, because it contains non-ascii characters
const StyledPlotContainer = styled.div`
  .mapboxgl-ctrl-bottom-left,
  .mapboxgl-ctrl-bottom-right,
  .mapbox-attribution-container {
    display: none;
  }

  position: absolute;
  top: ${OUT_OF_SCREEN_POSITION}px;
  left: ${OUT_OF_SCREEN_POSITION}px;
`;

const StyledMapContainer = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  display: flex;
`;

const deckGlProps = {
  glOptions: {
    preserveDrawingBuffer: true,
    useDevicePixels: false
  }
};

export default function PlotContainerFactory(MapContainer, MapsLayout) {
  class PlotContainer extends Component {
    constructor(props) {
      super(props);
      this._onMapRender = debounce(this._onMapRender, 500);
      this._retrieveNewScreenshot = debounce(this._retrieveNewScreenshot, 500);
    }

    componentDidMount() {
      this.props.setExportImageSetting({processing: true});
    }

    componentDidUpdate(prevProps) {
      // re-fetch the new screenshot only when ratio legend or resolution changes
      const checks = ['ratio', 'resolution', 'legend'];
      const shouldRetrieveScreenshot = checks.some(
        item => this.props.exportImageSetting[item] !== prevProps.exportImageSetting[item]
      );
      if (shouldRetrieveScreenshot) {
        this.props.setExportImageSetting({processing: true});
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
        convertToPng(this.plottingAreaRef.current, {filter: DOM_FILTER_FUNC})
          .then(this.props.setExportImageDataUri)
          .catch(err => {
            this.props.setExportImageError(err);
            if (this.props.enableErrorNotification) {
              this.props.addNotification(exportImageError({err}));
            }
          });
      }
    };

    render() {
      const {exportImageSetting, mapFields, splitMaps} = this.props;
      const {imageSize = {}, legend} = exportImageSetting;
      const {mapState} = mapFields;
      const isSplit = splitMaps && splitMaps.length > 1;

      const size = {
        width: imageSize.imageW || 1,
        height: imageSize.imageH || 1
      };
      const width = size.width / (isSplit ? 2 : 1);
      const height = size.height;
      const scale = this.mapScaleSelector(this.props);
      const newMapState = {
        ...mapState,
        width,
        height,
        zoom: mapState.zoom + (Math.log2(scale) || 0)
      };

      // center and all layer bounds
      if (exportImageSetting.center) {
        const renderedLayers = mapFields.layers.filter(
          (layer, idx) =>
            layer.id !== GEOCODER_LAYER_ID && layer.shouldRenderLayer(mapFields.layerData[idx])
        );
        const bounds = findMapBounds(renderedLayers);
        const centerAndZoom = getCenterAndZoomFromBounds(bounds, {width, height});
        if (centerAndZoom) {
          const zoom = Number.isFinite(centerAndZoom.zoom) ? centerAndZoom.zoom : mapState.zoom;

          newMapState.longitude = centerAndZoom.center[0];
          newMapState.latitude = centerAndZoom.center[1];
          newMapState.zoom = zoom + Number(Math.log2(scale) || 0);
        }
      }

      const mapProps = {
        ...mapFields,
        mapStyle: this.scaledMapStyleSelector(this.props),

        // override viewport based on export settings
        mapState: newMapState,
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

      const mapContainers = !isSplit ? (
        <MapContainer index={0} primary={true} {...mapProps} />
      ) : (
        <MapsLayout>
          {splitMaps.map((settings, index) => (
            <MapContainer
              key={index}
              index={index}
              primary={index === 1}
              {...mapProps}
              mapLayers={splitMaps[index].layers}
            />
          ))}
        </MapsLayout>
      );
      return (
        <StyledPlotContainer className="export-map-instance">
          <StyledMapContainer ref={this.plottingAreaRef} width={size.width} height={size.height}>
            {mapContainers}
          </StyledMapContainer>
        </StyledPlotContainer>
      );
    }
  }

  PlotContainer.propsTypes = propTypes;
  return PlotContainer;
}
