// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// libraries
import React, {useRef, useEffect, useState, useCallback, useMemo} from 'react';
import styled from 'styled-components';
import {Map} from 'react-map-gl';
import debounce from 'lodash/debounce';
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

import {GEOCODER_LAYER_ID} from '@kepler.gl/constants';
import {Effect, SplitMap, ExportImage} from '@kepler.gl/types';
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
  'mapboxgl-control-container',
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
  .mapboxgl-ctrl-bottom-left,
  .mapboxgl-ctrl-bottom-right,
  .mapbox-attribution-container,
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
  // Image export settings
  ratio?: string;
  resolution?: string;
  legend?: boolean;
  center?: boolean;
  imageSize: ExportImage['imageSize'];
  escapeXhtmlForWebpack?: boolean;

  // Map settings
  mapFields: ReturnType<typeof mapFieldsSelector>;
  splitMaps?: SplitMap[];

  // Callbacks
  setExportImageSetting: typeof setExportImageSetting;
  setExportImageDataUri: typeof setExportImageDataUri;
  setExportImageError: typeof setExportImageError;
  addNotification: ActionHandler<typeof addNotification>;

  // Flags
  enableErrorNotification?: boolean;
}

export default function PlotContainerFactory(
  MapContainer: ReturnType<typeof MapContainerFactory>,
  MapsLayout: ReturnType<typeof MapsLayoutFactory>
): React.ComponentType<PlotContainerProps> {
  function PlotContainer({
    // Image export settings
    ratio,
    resolution,
    legend = false,
    center,
    imageSize,
    escapeXhtmlForWebpack,

    // Map settings
    mapFields,
    splitMaps = [],

    // Callbacks
    setExportImageSetting,
    setExportImageDataUri,
    setExportImageError,
    addNotification,

    // Flags
    enableErrorNotification
  }: PlotContainerProps) {
    const plottingAreaRef = useRef<HTMLDivElement>(null);
    const [plotEffects] = useState<Effect[]>(() =>
      mapFields.visState.effects.map(effect => effect.clone())
    );

    const {mapState} = mapFields;

    // Memoize the scale calculation
    const scale = useMemo(() => {
      if (imageSize.scale) {
        return imageSize.scale;
      }

      const calculatedScale = getScaleFromImageSize(
        imageSize.imageW,
        imageSize.imageH,
        mapState.width * (mapState.isSplit ? 2 : 1),
        mapState.height
      );

      return calculatedScale > 0 ? calculatedScale : 1;
    }, [
      imageSize.scale,
      imageSize.imageW,
      imageSize.imageH,
      mapState.width,
      mapState.height,
      mapState.isSplit
    ]);

    // Memoize the map style
    const scaledMapStyle = useMemo(() => {
      const mapStyle = mapFields.mapStyle;
      return {
        ...mapStyle,
        bottomMapStyle: scaleMapStyleByResolution(mapStyle.bottomMapStyle, scale),
        topMapStyle: scaleMapStyleByResolution(mapStyle.topMapStyle, scale)
      };
    }, [mapFields.mapStyle, scale]);

    // Memoize the retrieveNewScreenshot callback
    const debouncedScreenshot = useMemo(
      () =>
        debounce(() => {
          if (plottingAreaRef.current) {
            convertToPng(plottingAreaRef.current, {
              filter: DOM_FILTER_FUNC,
              width: imageSize.imageW,
              height: imageSize.imageH,
              escapeXhtmlForWebpack
            })
              .then(setExportImageDataUri)
              .catch(err => {
                setExportImageError(err);
                if (enableErrorNotification) {
                  addNotification(exportImageError({err}));
                }
              });
          }
        }, 500),
      [
        imageSize.imageW,
        imageSize.imageH,
        escapeXhtmlForWebpack,
        setExportImageDataUri,
        setExportImageError,
        enableErrorNotification,
        addNotification
      ]
    );

    const retrieveNewScreenshot = useCallback(debouncedScreenshot, [debouncedScreenshot]);

    // Memoize the onMapRender callback
    const debouncedMapRender = useMemo(
      () =>
        debounce(map => {
          if (map.isStyleLoaded()) {
            retrieveNewScreenshot();
          }
        }, 500),
      [retrieveNewScreenshot]
    );

    const onMapRender = useCallback(debouncedMapRender, [debouncedMapRender]);

    // Initial setup effect
    useEffect(() => {
      setExportImageSetting({processing: true});
    }, [setExportImageSetting]);

    // Screenshot update effect
    useEffect(() => {
      if (ratio !== undefined || resolution !== undefined || legend !== undefined) {
        setExportImageSetting({processing: true});
        retrieveNewScreenshot();
      }
    }, [ratio, resolution, legend, setExportImageSetting, retrieveNewScreenshot]);

    // Memoize size calculations
    const {size, width, height} = useMemo(() => {
      const size = {
        width: imageSize.imageW || 1,
        height: imageSize.imageH || 1
      };
      const isSplit = splitMaps.length > 1;
      return {
        size,
        width: size.width / (isSplit ? 2 : 1),
        height: size.height
      };
    }, [imageSize.imageW, imageSize.imageH, splitMaps.length]);

    // Memoize map state
    const newMapState = useMemo(() => {
      const baseMapState = {
        ...mapState,
        width,
        height,
        zoom: mapState.zoom + (Math.log2(scale) || 0)
      };

      if (center) {
        const renderedLayers = mapFields.visState.layers.filter(
          (layer, idx) =>
            layer.id !== GEOCODER_LAYER_ID &&
            layer.shouldRenderLayer(mapFields.visState.layerData[idx])
        );
        const bounds = findMapBounds(renderedLayers);
        const centerAndZoom = getCenterAndZoomFromBounds(bounds, {width, height});
        if (centerAndZoom) {
          const zoom = Number.isFinite(centerAndZoom.zoom) ? centerAndZoom.zoom : mapState.zoom;
          return {
            ...baseMapState,
            longitude: centerAndZoom.center[0],
            latitude: centerAndZoom.center[1],
            zoom: zoom + Number(Math.log2(scale) || 0)
          };
        }
      }

      return baseMapState;
    }, [mapState, width, height, scale, center, mapFields.visState]);

    // Memoize map props
    const mapProps = useMemo(
      () => ({
        ...mapFields,
        mapStyle: scaledMapStyle,
        mapState: newMapState,
        mapControls: {
          mapLegend: {
            show: Boolean(legend),
            active: true
          }
        },
        MapComponent: Map,
        onMapRender,
        isExport: true,
        deckGlProps: {
          ...mapFields.deckGlProps,
          glOptions: {
            preserveDrawingBuffer: true,
            useDevicePixels: false
          }
        },
        visState: {
          ...mapFields.visState,
          effects: plotEffects
        }
      }),
      [mapFields, scaledMapStyle, newMapState, legend, onMapRender, plotEffects]
    );

    const isSplit = splitMaps.length > 1;
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
        <StyledMapContainer ref={plottingAreaRef} width={size.width} height={size.height}>
          <MapViewStateContextProvider mapState={newMapState}>
            {mapContainers}
          </MapViewStateContextProvider>
        </StyledMapContainer>
      </StyledPlotContainer>
    );
  }

  return React.memo(PlotContainer);
}
