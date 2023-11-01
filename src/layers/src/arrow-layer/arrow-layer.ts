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
import {getBinaryGeometriesFromArrow, parseGeometryFromArrow} from '@loaders.gl/arrow';
import {GeoJsonLayer as DeckGLGeoJsonLayer} from '@deck.gl/layers';
import {HIGHLIGH_COLOR_3D} from '@kepler.gl/constants';
import {KeplerTable} from '@kepler.gl/table';
import {DataContainerInterface} from '@kepler.gl/utils';
import {FilterArrowExtension} from '@kepler.gl/deckgl-layers';
import GeoJsonLayer, {SUPPORTED_ANALYZER_TYPES} from '../geojson-layer/geojson-layer';

function updateBoundsFromGeoArrowSamples(
  flatCoords: Float64Array,
  nDim: number,
  bounds: [number, number, number, number],
  sampleSize: number = 100
) {
  const numberOfFeatures = flatCoords.length / nDim;
  const sampleStep = Math.max(Math.floor(numberOfFeatures / sampleSize), 1);

  const newBounds: [number, number, number, number] = [...bounds];
  for (let i = 0; i < numberOfFeatures; i += sampleStep) {
    const lng = flatCoords[i * nDim];
    const lat = flatCoords[i * nDim + 1];
    if (lng < bounds[0]) {
      newBounds[0] = lng;
    }
    if (lat < newBounds[1]) {
      newBounds[1] = lat;
    }
    if (lng > newBounds[2]) {
      newBounds[2] = lng;
    }
    if (lat > newBounds[3]) {
      newBounds[3] = lat;
    }
  }

  return newBounds;
}

export default class ArrowLayer extends GeoJsonLayer {
  binaryFeatures: BinaryFeatures[];
  dataContainer: DataContainerInterface | null;
  filteredIndex: Uint8ClampedArray | null;
  filteredIndexTrigger: number[];

  // constructor
  constructor(props) {
    super(props);

    this.dataContainer = null;
    this.binaryFeatures = [];
    this.filteredIndex = null;
    this.filteredIndexTrigger = [];
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
    // filter arrow table by values and make a partial copy of the raw table could be expensive
    // so we will use filteredIndex to create an attribute e.g. filtered (bool) for deck.gl layer
    if (!this.filteredIndex) {
      this.filteredIndex = new Uint8ClampedArray(dataContainer.numRows());
    }
    this.filteredIndex.fill(0);
    for (let i = 0; i < filteredIndex.length; ++i) {
      this.filteredIndex[filteredIndex[i]] = 1;
    }

    this.filteredIndexTrigger = filteredIndex;
    this.dataContainer = dataContainer;
    return this.binaryFeatures;
  }

  formatLayerData(datasets, oldLayerData) {
    if (this.config.dataId === null) {
      return {};
    }
    const {gpuFilter, dataContainer} = datasets[this.config.dataId];

    // get data from calculateDataAttribute
    const {data} = this.updateData(datasets, oldLayerData);

    // deck.gl geojson-layer will use binaryToFeatureForAccesor(data, index)
    // to get feature from binary data, and the properties of the feature
    // e.g. properties: {index: i} can be used for gpu filter
    const customFilterValueAccessor = (dc, d, fieldIndex) => {
      return dc.valueAt(d.properties.index, fieldIndex);
    };
    const indexAccessor = f => {
      return f.properties.index;
    };

    const dataAccessor = dc => d => {
      return {index: d.properties.index};
    };

    const isFilteredAccessor = d => {
      return this.filteredIndex ? this.filteredIndex[d.properties.index] : 1;
    };

    const accessors = this.getAttributeAccessors({dataAccessor, dataContainer});

    // return layerData
    return {
      data,
      getFilterValue: gpuFilter.filterValueAccessor(dataContainer)(
        indexAccessor,
        customFilterValueAccessor
      ),
      getFiltered: isFilteredAccessor,
      ...accessors
    };
  }

  updateLayerMeta(dataContainer: DataContainerInterface) {
    this.dataContainer = dataContainer;
    const {geojson} = this.config.columns;

    const geoColumn = dataContainer.getColumn?.(geojson.fieldIdx);
    const arrowField = dataContainer.getField?.(geojson.fieldIdx);

    const encoding = arrowField?.metadata?.get('ARROW:extension:name');
    // create binary data from arrow data for GeoJsonLayer
    const {binaryGeometries, featureTypes} = getBinaryGeometriesFromArrow(
      geoColumn,
      encoding
    );
    this.binaryFeatures = binaryGeometries;

    // TODO: this should be removed once fix was applied in loaders.gl
    let bounds : [number, number, number, number] = [Infinity, Infinity, -Infinity, -Infinity]
    binaryGeometries.forEach(b => {
      const coords = featureTypes.polygon
        ? b.polygons?.positions
        : featureTypes.point
        ? b.points?.positions
        : b.lines?.positions;
      bounds = updateBoundsFromGeoArrowSamples(
        coords?.value as Float64Array,
        coords?.size || 2,
        bounds
      );
    });

    // since there is no feature.properties.radius, we set fixedRadius to false
    const fixedRadius = false;
    this.updateMeta({bounds, fixedRadius, featureTypes});
  }

  isLayerHovered(objectInfo): boolean {
    // there could be multiple deck.gl layers created from multiple chunks in arrow table
    // the objectInfo.layer id should be `${this.id}-${i}`
    if (objectInfo?.picked) {
      const deckLayerId = objectInfo?.layer?.props?.id;
      return deckLayerId.startsWith(this.id);
    }
    return false;
  }

  hasHoveredObject(objectInfo) {
    // hover object returns the index of the object in the data array
    // NOTE: this could be done in Deck.gl getPickingInfo(params) and binaryToGeojson()
    if (this.isLayerHovered(objectInfo) && objectInfo.index >= 0 && this.dataContainer) {
      const {geojson} = this.config.columns;

      const col = this.dataContainer.getColumn?.(geojson.fieldIdx);
      const rawGeometry = col?.get(objectInfo.index);

      const field = this.dataContainer.getField?.(geojson.fieldIdx);
      const encoding = field?.metadata?.get('ARROW:extension:name');

      const hoveredFeature = parseGeometryFromArrow({
        encoding,
        data: rawGeometry
      });

      const properties = this.dataContainer.rowAsArray(objectInfo.index).reduce((prev, cur, i) => {
        if (i !== geojson.fieldIdx) {
          const fieldName = this.dataContainer?.getField?.(i).name;
          prev[fieldName] = cur;
        }
        return prev;
      }, {});

      return {
        ...hoveredFeature,
        properties: {
          ...properties,
          index: objectInfo.index
        }
      };
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
      getFilterValue: gpuFilter.filterValueUpdateTriggers,
      getFiltered: this.filteredIndexTrigger
    };

    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);
    const opaOverwrite = {
      opacity: visConfig.strokeOpacity
    };

    const pickable = interactionConfig.tooltip.enabled;
    const hoveredObject = this.hasHoveredObject(objectHovered);

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
        extensions: [...defaultLayerProps.extensions, new FilterArrowExtension()],
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
