// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// libraries
import React, {Component, createRef} from 'react';
import {createSelector} from 'reselect';
import styled from 'styled-components';
import {Map} from 'react-map-gl';
import debounce from 'lodash.debounce';
import {
  exportImageError,
  scaleMapStyleByResolution,
  getCenterAndZoomFromBounds,
  convertToPng,
  getScaleFromImageSize
} from '@kepler.gl/utils';
import {findMapBounds} from '@kepler.gl/reducers';
import MapContainerFactory from './map-container';
import MapsLayoutFactory from './maps-layout';
import {MapViewStateContextProvider} from './map-view-state-context';

import {GEOCODER_LAYER_ID, ExportImage} from '@kepler.gl/constants';
import {SplitMap} from '@kepler.gl/types';
import {
  ActionHandler,
  addNotification,
  setExportImageDataUri,
  setExportImageError,
  setExportImageSetting
} from '@kepler.gl/actions';
import {mapFieldsSelector} from './kepler-gl';

const CLASS_FILTER = [
  'maplibregl-control-container',
  'attrition-link',
  'attrition-logo',
  'map-control__panel-split-viewport-tools'
];
const DOM_FILTER_FUNC = node => !CLASS_FILTER.includes(node.className);
const OUT_OF_SCREEN_POSITION = -9999;

PlotContainerFactory.deps = [MapContainerFactory, MapsLayoutFactory];

// Remove mapbox logo in exported map, because it contains non-ascii characters
// Remove split viewport UI controls from exported images when the legend is shown
const StyledPlotContainer = styled.div`
  .maplibregl-ctrl-bottom-left,
  .maplibregl-ctrl-bottom-right,
  .maplibre-attribution-container,
  .map-control__panel-split-viewport-tools {
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
  addNotification: ActionHandler<typeof addNotification>;
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
        const {imageSize, escapeXhtmlForWebpack} = this.props.exportImageSetting;
        convertToPng(this.plottingAreaRef.current, {
          filter: DOM_FILTER_FUNC,
          width: imageSize.imageW,
          height: imageSize.imageH,
          escapeXhtmlForWebpack
        })
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
        MapComponent: Map,
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
        <MapsLayout className="plot-container-maps" mapState={newMapState}>
          {splitMaps.map((settings, index) => (
            <MapContainer key={index} index={index} primary={index === 1} {...mapProps} />
          ))}
        </MapsLayout>
      );
      return (
        <StyledPlotContainer className="export-map-instance">
          <StyledMapContainer ref={this.plottingAreaRef} width={size.width} height={size.height}>
            <MapViewStateContextProvider mapState={newMapState}>
              {mapContainers}
            </MapViewStateContextProvider>
          </StyledMapContainer>
        </StyledPlotContainer>
      );
    }
  }
  return PlotContainer;
}
