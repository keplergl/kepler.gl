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

import uniq from 'lodash.uniq';
import {DATA_TYPES} from 'type-analyzer';

import Layer, {
  colorMaker,
  LayerBaseConfig,
  LayerBaseConfigPartial,
  LayerColorConfig,
  LayerColumn,
  LayerHeightConfig,
  LayerRadiusConfig,
  LayerSizeConfig,
  LayerStrokeColorConfig
} from '../base-layer';
import {GeoJsonLayer as DeckGLGeoJsonLayer} from '@deck.gl/layers';
import {
  getGeojsonDataMaps,
  getGeojsonBounds,
  getGeojsonFeatureTypes,
  GeojsonDataMaps
} from './geojson-utils';
import GeojsonLayerIcon from './geojson-layer-icon';
import {
  GEOJSON_FIELDS,
  HIGHLIGH_COLOR_3D,
  CHANNEL_SCALES,
  ColorRange,
  LAYER_VIS_CONFIGS
} from '@kepler.gl/constants';
import {
  VisConfigNumber,
  VisConfigColorSelect,
  VisConfigColorRange,
  VisConfigRange,
  VisConfigBoolean,
  Merge,
  RGBColor
} from '@kepler.gl/types';
import {KeplerTable} from '@kepler.gl/table';
import {DataContainerInterface} from '@kepler.gl/utils';

const SUPPORTED_ANALYZER_TYPES = {
  [DATA_TYPES.GEOMETRY]: true,
  [DATA_TYPES.GEOMETRY_FROM_STRING]: true,
  [DATA_TYPES.PAIR_GEOMETRY_FROM_STRING]: true
};

export const geojsonVisConfigs: {
  opacity: 'opacity';
  strokeOpacity: VisConfigNumber;
  thickness: VisConfigNumber;
  strokeColor: 'strokeColor';
  colorRange: 'colorRange';
  strokeColorRange: 'strokeColorRange';
  radius: 'radius';

  sizeRange: 'strokeWidthRange';
  radiusRange: 'radiusRange';
  heightRange: 'elevationRange';
  elevationScale: 'elevationScale';
  enableElevationZoomFactor: 'enableElevationZoomFactor';
  stroked: 'stroked';
  filled: 'filled';
  enable3d: 'enable3d';
  wireframe: 'wireframe';
} = {
  opacity: 'opacity',
  strokeOpacity: {
    ...LAYER_VIS_CONFIGS.opacity,
    property: 'strokeOpacity'
  },
  thickness: {
    ...LAYER_VIS_CONFIGS.thickness,
    defaultValue: 0.5
  },
  strokeColor: 'strokeColor',
  colorRange: 'colorRange',
  strokeColorRange: 'strokeColorRange',
  radius: 'radius',

  sizeRange: 'strokeWidthRange',
  radiusRange: 'radiusRange',
  heightRange: 'elevationRange',
  elevationScale: 'elevationScale',
  enableElevationZoomFactor: 'enableElevationZoomFactor',
  stroked: 'stroked',
  filled: 'filled',
  enable3d: 'enable3d',
  wireframe: 'wireframe'
};

export type GeoJsonVisConfigSettings = {
  opacity: VisConfigNumber;
  strokeOpacity: VisConfigNumber;
  thickness: VisConfigNumber;
  strokeColor: VisConfigColorSelect;
  colorRange: VisConfigColorRange;
  strokeColorRange: VisConfigColorRange;
  radius: VisConfigNumber;

  sizeRange: VisConfigRange;
  radiusRange: VisConfigRange;
  heightRange: VisConfigRange;
  elevationScale: VisConfigNumber;
  enableElevationZoomFactor: VisConfigBoolean;
  stroked: VisConfigBoolean;
  filled: VisConfigBoolean;
  enable3d: VisConfigBoolean;
  wireframe: VisConfigBoolean;
};

export type GeoJsonLayerColumnsConfig = {
  geojson: LayerColumn;
};

export type GeoJsonLayerVisConfig = {
  opacity: number;
  strokeOpacity: number;
  thickness: number;
  strokeColor: RGBColor;
  colorRange: ColorRange;
  strokeColorRange: ColorRange;
  radius: number;

  sizeRange: [number, number];
  radiusRange: [number, number];
  heightRange: [number, number];
  elevationScale: number;
  enableElevationZoomFactor: boolean;
  stroked: boolean;
  filled: boolean;
  enable3d: boolean;
  wireframe: boolean;
};

type GeoJsonLayerVisualChannelConfig = LayerColorConfig &
  LayerStrokeColorConfig &
  LayerSizeConfig &
  LayerHeightConfig &
  LayerRadiusConfig;
export type GeoJsonLayerConfig = Merge<
  LayerBaseConfig,
  {columns: GeoJsonLayerColumnsConfig; visConfig: GeoJsonLayerVisConfig}
> &
  GeoJsonLayerVisualChannelConfig;

export type GeoJsonLayerMeta = {
  featureTypes?: {polygon: boolean; point: boolean; line: boolean};
  fixedRadius?: boolean;
  isArrow?: boolean;
};

export const geoJsonRequiredColumns: ['geojson'] = ['geojson'];
export const featureAccessor = ({geojson}: GeoJsonLayerColumnsConfig) => (
  dc: DataContainerInterface
) => d => dc.valueAt(d.index, geojson.fieldIdx);

// access feature properties from geojson sub layer
export const defaultElevation = 500;
export const defaultLineWidth = 1;
export const defaultRadius = 1;

export default class GeoJsonLayer extends Layer {
  declare config: GeoJsonLayerConfig;
  declare visConfigSettings: GeoJsonVisConfigSettings;
  declare meta: GeoJsonLayerMeta;
  dataToFeature: GeojsonDataMaps;

  constructor(props) {
    super(props);

    this.dataToFeature = [];
    this.registerVisConfig(geojsonVisConfigs);
    this.getPositionAccessor = (dataContainer: DataContainerInterface) =>
      featureAccessor(this.config.columns)(dataContainer);
  }

  get type() {
    return GeoJsonLayer.type;
  }
  static get type(): 'geojson' {
    return 'geojson';
  }

  get name(): 'Polygon' {
    return 'Polygon';
  }

  get layerIcon() {
    return GeojsonLayerIcon;
  }

  get requiredLayerColumns() {
    return geoJsonRequiredColumns;
  }

  get visualChannels() {
    const visualChannels = super.visualChannels;
    return {
      color: {
        ...visualChannels.color,
        accessor: 'getFillColor',
        condition: config => config.visConfig.filled,
        nullValue: visualChannels.color.nullValue,
        getAttributeValue: config => d => d.properties.fillColor || config.color,
        // used this to get updateTriggers
        defaultValue: config => config.color
      },
      strokeColor: {
        property: 'strokeColor',
        field: 'strokeColorField',
        scale: 'strokeColorScale',
        domain: 'strokeColorDomain',
        range: 'strokeColorRange',
        key: 'strokeColor',
        channelScaleType: CHANNEL_SCALES.color,
        accessor: 'getLineColor',
        condition: config => config.visConfig.stroked,
        nullValue: visualChannels.color.nullValue,
        getAttributeValue: config => d =>
          d.properties.lineColor || config.visConfig.strokeColor || config.color,
        // used this to get updateTriggers
        defaultValue: config => config.visConfig.strokeColor || config.color
      },
      size: {
        ...visualChannels.size,
        property: 'stroke',
        accessor: 'getLineWidth',
        condition: config => config.visConfig.stroked,
        nullValue: 0,
        getAttributeValue: () => d => d.properties.lineWidth || defaultLineWidth
      },
      height: {
        property: 'height',
        field: 'heightField',
        scale: 'heightScale',
        domain: 'heightDomain',
        range: 'heightRange',
        key: 'height',
        channelScaleType: CHANNEL_SCALES.size,
        accessor: 'getElevation',
        condition: config => config.visConfig.enable3d,
        nullValue: 0,
        getAttributeValue: () => d => d.properties.elevation || defaultElevation
      },
      radius: {
        property: 'radius',
        field: 'radiusField',
        scale: 'radiusScale',
        domain: 'radiusDomain',
        range: 'radiusRange',
        key: 'radius',
        channelScaleType: CHANNEL_SCALES.radius,
        accessor: 'getPointRadius',
        nullValue: 0,
        getAttributeValue: () => d => d.properties.radius || defaultRadius
      }
    };
  }

  static findDefaultLayerProps({label, fields = []}: KeplerTable) {
    const geojsonColumns = fields
      .filter(f => f.type === 'geojson' && SUPPORTED_ANALYZER_TYPES[f.analyzerType])
      .map(f => f.name);

    const defaultColumns = {
      geojson: uniq([...GEOJSON_FIELDS.geojson, ...geojsonColumns])
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

  getDefaultLayerConfig(props: LayerBaseConfigPartial) {
    return {
      ...super.getDefaultLayerConfig(props),

      // add height visual channel
      heightField: null,
      heightDomain: [0, 1],
      heightScale: 'linear',

      // add radius visual channel
      radiusField: null,
      radiusDomain: [0, 1],
      radiusScale: 'linear',

      // add stroke color visual channel
      strokeColorField: null,
      strokeColorDomain: [0, 1],
      strokeColorScale: 'quantile'
    };
  }

  getHoverData(object, dataContainer) {
    // index of dataContainer is saved to feature.properties
    const index = object?.properties?.index;
    if (index >= 0) {
      return dataContainer.row(index);
    }
    return null;
  }

  calculateDataAttribute({dataContainer, filteredIndex}, getPosition) {
    return this.meta.isArrow
      ? this.dataToFeature
      : filteredIndex.map(i => this.dataToFeature[i]).filter(d => d);
  }

  formatLayerData(datasets, oldLayerData) {
    if (this.config.dataId === null) {
      return {};
    }
    const {gpuFilter, dataContainer} = datasets[this.config.dataId];
    const {data} = this.updateData(datasets, oldLayerData);

    const customFilterValueAccessor = (dc, d, fieldIndex) => {
      return dc.valueAt(d.properties.index, fieldIndex);
    };
    const indexAccessor = f => f.properties.index;

    const dataAccessor = dc => d => ({index: d.properties.index});
    const accessors = this.getAttributeAccessors({dataAccessor, dataContainer});

    return {
      data,
      getFilterValue: gpuFilter.filterValueAccessor(dataContainer)(
        indexAccessor,
        customFilterValueAccessor
      ),
      ...accessors
    };
  }

  updateLayerMeta(dataContainer) {
    const getFeature = this.getPositionAccessor(dataContainer);

    const feature = getFeature({index: 0});
    const isArrow = feature && 'encoding' in feature;

    if (isArrow) {
      // create binary data from arrow data for GeoJsonLayer
      const nDim = 2;
      const geoColumn = feature.data.parent;
      const chunks = geoColumn.chunks;
      const dataToFeature: any = [];
      let sampleCoordinateArray: any = null;
      for (let c = 0; c < chunks.length; c++) {
        const geometries = chunks[c];
        const flatCoordinateArray = geometries
          .getChildAt(0)
          .getChildAt(0)
          .getChildAt(0)
          .getChildAt(0).data.values;
        sampleCoordinateArray = flatCoordinateArray;
        const ringOffsets = geometries.getChildAt(0).getChildAt(0).valueOffsets;
        const polygonOffsets = ringOffsets;
        const numOfPolygon = flatCoordinateArray.length / nDim;

        // create Uint16Array with incremental values starting from 0
        const featureIds = new Uint32Array(numOfPolygon);
        for (let i = 0; i < numOfPolygon; i++) {
          featureIds[i] = i;
        }
        const globalFeatureIds = new Uint32Array(numOfPolygon);
        for (let i = 0; i < numOfPolygon; i++) {
          globalFeatureIds[i] = i + geoColumn._chunkOffsets[c];
        }
        dataToFeature.push({
          points: {
            globalFeatureIds: {value: [], size: 1},
            positions: {value: [], size: 2},
            properties: [],
            numericProps: [],
            featureIds: {value: [], size: 1}
          },
          lines: {
            globalFeatureIds: {value: new Uint32Array(0), size: 1},
            pathIndices: {value: new Uint16Array(0), size: 1},
            positions: {value: new Float32Array(0), size: 2},
            properties: [],
            numericProps: [],
            featureIds: {value: new Uint32Array(0), size: 1}
          },
          polygons: {
            globalFeatureIds: {value: globalFeatureIds, size: 1},
            positions: {
              value: flatCoordinateArray,
              size: nDim
            },
            polygonIndices: {value: polygonOffsets, size: 1},
            primitivePolygonIndices: {value: polygonOffsets, size: 1},
            properties: [],
            featureIds: {value: featureIds, size: 1},
            numericProps: [],
            fields: []
          }
        });
      }
      this.dataToFeature = dataToFeature;

      // iterate flatCoodrinatesArray to get bounds
      const bounds = [Infinity, Infinity, -Infinity, -Infinity];
      const nSamples =
        sampleCoordinateArray.length / nDim > 1000 ? 1000 : sampleCoordinateArray.length / 2;
      for (let i = 0; i < nSamples; i += nDim) {
        const lng = sampleCoordinateArray[i];
        const lat = sampleCoordinateArray[i + 1];
        if (lng < bounds[0]) {
          bounds[0] = lng;
        }
        if (lat < bounds[1]) {
          bounds[1] = lat;
        }
        if (lng > bounds[2]) {
          bounds[2] = lng;
        }
        if (lat > bounds[3]) {
          bounds[3] = lat;
        }
      }
      const fixedRadius = false;
      const featureTypes = {polygon: true, point: false, line: false};
      this.updateMeta({bounds, fixedRadius, featureTypes, isArrow});
    } else {
      this.dataToFeature = getGeojsonDataMaps(dataContainer, getFeature);
      // get bounds from features
      const bounds = getGeojsonBounds(this.dataToFeature);
      // if any of the feature has properties.radius set to be true
      const fixedRadius = Boolean(
        this.dataToFeature.find(d => d && d.properties && d.properties.radius)
      );

      // keep a record of what type of geometry the collection has
      const featureTypes = getGeojsonFeatureTypes(this.dataToFeature);

      this.updateMeta({bounds, fixedRadius, featureTypes, isArrow});
    }
  }

  setInitialLayerConfig({dataContainer}) {
    if (!dataContainer.numRows()) {
      return this;
    }
    this.updateLayerMeta(dataContainer);

    const {featureTypes} = this.meta;
    // default settings is stroke: true, filled: false
    if (featureTypes && featureTypes.polygon) {
      // set both fill and stroke to true
      return this.updateLayerVisConfig({
        filled: true,
        stroked: false,
        strokeColor: colorMaker.next().value
      });
    } else if (featureTypes && featureTypes.point) {
      // set fill to true if detect point
      return this.updateLayerVisConfig({filled: true, stroked: false});
    }

    return this;
  }

  hasLayerData(layerData) {
    if (!layerData) {
      return false;
    }
    return Boolean(
      layerData.data &&
        (layerData.data.length ||
          ('points' in layerData.data && 'polygons' in layerData.data && 'lines' in layerData.data))
    );
  }

  renderLayer(opts) {
    const {data, gpuFilter, objectHovered, mapState, interactionConfig} = opts;

    const {fixedRadius, featureTypes, isArrow} = this.meta;
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

    const geojsonLayers = isArrow ?
      data.data.map((d, i) => {
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
            ...(featureTypes?.polygon ? { 'polygons-stroke': opaOverwrite } : {}),
            ...(featureTypes?.line ? { linestrings: opaOverwrite } : {}),
            ...(featureTypes?.point
              ? {
                points: {
                  lineOpacity: visConfig.strokeOpacity
                }
              }
              : {})
          }
        });
      }) : [
        new DeckGLGeoJsonLayer({
          ...defaultLayerProps,
          ...layerProps,
          ...data,
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
            ...(featureTypes?.polygon ? { 'polygons-stroke': opaOverwrite } : {}),
            ...(featureTypes?.line ? { linestrings: opaOverwrite } : {}),
            ...(featureTypes?.point
              ? {
                points: {
                  lineOpacity: visConfig.strokeOpacity
                }
              }
              : {})
          }
        })
      ];
    return [
      ...geojsonLayers,
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
