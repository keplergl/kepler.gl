// Copyright (c) 2022 Uber Technologies, Inc.
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
import {createSelector} from 'reselect';
import styled from 'styled-components';
import {StaticMap} from 'react-map-gl';
import debounce from 'lodash.debounce';
import {
  exportImageError,
  scaleMapStyleByResolution,
  getCenterAndZoomFromBounds,
  convertToPng,
  getScaleFromImageSize
} from '@kepler.gl/utils';
import {findMapBounds} from 'reducers/data-utils';
import MapContainerFactory from './map-container';
import MapsLayoutFactory from './maps-layout';

import {GEOCODER_LAYER_ID, ExportImage} from '@kepler.gl/constants';
import {SplitMap} from '@kepler.gl/types';
import {setExportImageDataUri, setExportImageError, setExportImageSetting} from 'actions';
import {mapFieldsSelector} from './kepler-gl';

const CLASS_FILTER = ['mapboxgl-control-container', 'attrition-link', 'attrition-logo'];
const DOM_FILTER_FUNC = node => !CLASS_FILTER.includes(node.className);
const OUT_OF_SCREEN_POSITION = -9999;

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

interface StyledMapContainerProps {
  width?: number;
  height?: number;
}

const StyledMapContainer = styled.div<StyledMapContainerProps>`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  display: flex;
`;

interface PlotContainerProps {
  width?: number;
  height?: number;
  exportImageSetting: ExportImage;
  addNotification: Function;
  mapFields: ReturnType<typeof mapFieldsSelector>;
  setExportImageSetting: typeof setExportImageSetting;
  setExportImageDataUri: typeof setExportImageDataUri;
  setExportImageError: typeof setExportImageError;
  splitMaps?: SplitMap[];
  enableErrorNotification?: boolean;
}

export default function PlotContainerFactory(
  MapContainer: ReturnType<typeof MapContainerFactory>,
  MapsLayout: ReturnType<typeof MapsLayoutFactory>
): React.ComponentType<PlotContainerProps> {
  class PlotContainer extends Component<PlotContainerProps> {
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

    plottingAreaRef = createRef<HTMLDivElement>();

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
      const {exportImageSetting, mapFields, splitMaps = []} = this.props;
      const {mapState, visState} = mapFields;
      const {layers, layerData} = visState;
      const {imageSize, legend} = exportImageSetting;

      const isSplit = splitMaps && splitMaps.length > 1;

      const size = {
        width: imageSize?.imageW || 1,
        height: imageSize?.imageH || 1
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
        const renderedLayers = layers.filter(
          (layer, idx) => layer.id !== GEOCODER_LAYER_ID && layer.shouldRenderLayer(layerData[idx])
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
        deckGlProps: {
          ...mapFields.deckGlProps,
          glOptions: {
            preserveDrawingBuffer: true,
            useDevicePixels: false
          }
        }
      };

      const mapContainers = !isSplit ? (
        <MapContainer index={0} primary={true} {...mapProps} />
      ) : (
        <MapsLayout className="plot-container-maps">
          {splitMaps.map((settings, index) => (
            <MapContainer key={index} index={index} primary={index === 1} {...mapProps} />
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
  return PlotContainer;
}
