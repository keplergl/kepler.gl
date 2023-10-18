// Copyright (c) 2023 Uber Technologies, Inc.
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

import {BinaryFeatures} from '@loaders.gl/schema';
import {GeoJsonLayer as DeckGLGeoJsonLayer} from '@deck.gl/layers';
import {HIGHLIGH_COLOR_3D} from '@kepler.gl/constants';
import {KeplerTable} from '@kepler.gl/table';
import {
  DataContainerInterface,
  getBinaryGeometriesFromGeoArrowPolygon,
  parseGeometryFromArrow
} from '@kepler.gl/utils';
import {Merge} from '@kepler.gl/types';

import {LayerColumn, LayerBaseConfig} from '../base-layer';
import GeoJsonLayer, {
  SUPPORTED_ANALYZER_TYPES,
  GeoJsonLayerVisConfig,
  GeoJsonLayerVisualChannelConfig
} from '../geojson-layer/geojson-layer';

export default class ArrowLayer extends GeoJsonLayer {
  binaryFeatures: BinaryFeatures[];
  dataContainer: DataContainerInterface | null;

  // constructor
  constructor(props) {
    super(props);

    this.dataContainer = null;
    this.binaryFeatures = [];
  }

  static findDefaultLayerProps({label, fields = []}: KeplerTable) {
    const geoarrowColumns = fields
      .filter(f => f.type === 'geoarrow' && SUPPORTED_ANALYZER_TYPES[f.analyzerType])
      .map(f => f.name);

    const defaultColumns = {
      geojson: geoarrowColumns
    };

    const foundColumns = this.findDefaultColumnField(defaultColumns, fields);
    if (!foundColumns || !foundColumns.length) {
      return {props: []};
    }

    return {
      props: foundColumns.map(columns => ({
        label: (typeof label === 'string' && label.replace(/\.[^/.]+$/, '')) || this.type,
        columns,
        isVisible: true
      }))
    };
  }

  get type() {
    return ArrowLayer.type;
  }
  static get type() {
    return 'geoarrow';
  }

  get name() {
    return 'GeoArrow';
  }

  get requiredLayerColumns() {
    return ['geojson'];
  }

  calculateDataAttribute({dataContainer, filteredIndex}, getPosition) {
    // TODO: filter arrow table using predicate
    // filteredIndex.map(i => this.dataToFeature[i]).filter(d => d);
    this.dataContainer = dataContainer;
    return this.binaryFeatures;
  }

  updateLayerMeta(dataContainer: DataContainerInterface) {
    this.dataContainer = dataContainer;
    const {geojson} = this.config.columns;
    const geoColumn = dataContainer.getColumn(geojson.fieldIdx);

    // create binary data from arrow data for GeoJsonLayer
    const {binaryGeometries, bounds, featureTypes} = getBinaryGeometriesFromGeoArrowPolygon(
      geoColumn
    );
    this.binaryFeatures = binaryGeometries;

    const fixedRadius = false;
    this.updateMeta({bounds, fixedRadius, featureTypes});
  }

  isLayerHovered(objectInfo): boolean {
    // there could be multiple deck.gl layers created from multiple chunks in arrow table
    // the objectInfo.layer id should be `${this.id}-${i}`
    if (objectInfo?.picked) {
      const deckLayerId = objectInfo?.layer?.props?.id;
      console.log(deckLayerId);
      return deckLayerId.startsWith(this.id);
    }
    return false;
  }

  hasHoveredObject(objectInfo) {
    // hover object returns the index of the object in the data array
    if (this.isLayerHovered(objectInfo) && objectInfo.index >= 0 && this.dataContainer) {
      console.time('getHoverData');
      const {geojson} = this.config.columns;
      const col = this.dataContainer.getColumn(geojson.fieldIdx);
      const rawGeometry = col.get(objectInfo.index);
      const hoveredFeature = parseGeometryFromArrow({
        encoding: col.metadata?.get('ARROW:extension:name'),
        data: rawGeometry
      });
      console.timeEnd('getHoverData');
      return hoveredFeature;
    }
    return null;
  }

  getHoverData(object, dataContainer) {
    // index of dataContainer is saved to feature.properties
    const index = object;
    if (index >= 0) {
      return dataContainer.row(index);
    }
    return null;
  }

  renderLayer(opts) {
    const {data, gpuFilter, objectHovered, mapState, interactionConfig} = opts;

    const {fixedRadius, featureTypes} = this.meta;
    const radiusScale = this.getRadiusScaleByZoom(mapState, fixedRadius);
    const zoomFactor = this.getZoomFactor(mapState);
    const eleZoomFactor = this.getElevationZoomFactor(mapState);

    const {visConfig} = this.config;

    const layerProps = {
      lineWidthScale: visConfig.thickness * zoomFactor * 8,
      elevationScale: visConfig.elevationScale * eleZoomFactor,
      pointRadiusScale: radiusScale,
      lineMiterLimit: 4
    };

    const updateTriggers = {
      ...this.getVisualChannelUpdateTriggers(),
      getFilterValue: gpuFilter.filterValueUpdateTriggers
    };

    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);
    const opaOverwrite = {
      opacity: visConfig.strokeOpacity
    };

    const pickable = interactionConfig.tooltip.enabled;
    const hoveredObject = this.hasHoveredObject(objectHovered);
    console.log(hoveredObject);

    const deckLayers = data.data.map((d, i) => {
      return new DeckGLGeoJsonLayer({
        ...defaultLayerProps,
        ...layerProps,
        ...data,
        data: d,
        id: `${this.id}-${i}`,
        pickable,
        highlightColor: HIGHLIGH_COLOR_3D,
        autoHighlight: visConfig.enable3d && pickable,
        stroked: visConfig.stroked,
        filled: visConfig.filled,
        extruded: visConfig.enable3d,
        wireframe: visConfig.wireframe,
        wrapLongitude: false,
        lineMiterLimit: 2,
        capRounded: true,
        jointRounded: true,
        updateTriggers,
        _subLayerProps: {
          ...(featureTypes?.polygon ? {'polygons-stroke': opaOverwrite} : {}),
          ...(featureTypes?.line ? {linestrings: opaOverwrite} : {}),
          ...(featureTypes?.point
            ? {
                points: {
                  lineOpacity: visConfig.strokeOpacity
                }
              }
            : {})
        }
      });
    });
    return [
      ...deckLayers,
      // hover layer
      ...(hoveredObject && !visConfig.enable3d
        ? [
            new DeckGLGeoJsonLayer({
              ...this.getDefaultHoverLayerProps(),
              ...layerProps,
              visible: defaultLayerProps.visible,
              wrapLongitude: false,
              data: [hoveredObject],
              getLineWidth: data.getLineWidth,
              getPointRadius: data.getPointRadius,
              getElevation: data.getElevation,
              getLineColor: this.config.highlightColor,
              getFillColor: this.config.highlightColor,
              // always draw outline
              stroked: true,
              filled: false
            })
          ]
        : [])
    ];
  }
}
