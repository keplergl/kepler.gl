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
import {getGeojsonLayerMeta, GeojsonDataMaps} from './geojson-utils';
import {
  getGeojsonLayerMetaFromArrow,
  isLayerHoveredFromArrow,
  getHoveredObjectFromArrow
} from '../layer-utils';
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
import {DataContainerInterface, ArrowDataContainer} from '@kepler.gl/utils';

export const SUPPORTED_ANALYZER_TYPES = {
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

export type GeoJsonLayerVisualChannelConfig = LayerColorConfig &
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
};

export const geoJsonRequiredColumns = ['geojson'];

export const featureAccessor = ({geojson}: GeoJsonLayerColumnsConfig) => (
  dc: DataContainerInterface
) => d => dc.valueAt(d.index, geojson.fieldIdx);

export const columnAccessor = ({geojson}: GeoJsonLayerColumnsConfig) => (
  dc: DataContainerInterface
) => dc.getColumn?.(geojson.fieldIdx);

export const fieldAccessor = ({geojson}: GeoJsonLayerColumnsConfig) => (
  dc: DataContainerInterface
) => dc.getField?.(geojson.fieldIdx);

// access feature properties from geojson sub layer
export const defaultElevation = 500;
export const defaultLineWidth = 1;
export const defaultRadius = 1;

export default class GeoJsonLayer extends Layer {
  declare config: GeoJsonLayerConfig;
  declare visConfigSettings: GeoJsonVisConfigSettings;
  declare meta: GeoJsonLayerMeta;

  dataToFeature: GeojsonDataMaps | BinaryFeatures[];
  dataContainer: DataContainerInterface | null;
  filteredIndex: Uint8ClampedArray | null;
  filteredIndexTrigger: number[];
  isArrow: boolean;

  constructor(props) {
    super(props);

    this.isArrow = false;
    this.dataToFeature = [];
    this.dataContainer = null;
    this.filteredIndex = null;
    this.filteredIndexTrigger = [];
    this.registerVisConfig(geojsonVisConfigs);
    this.getPositionAccessor = (dataContainer: DataContainerInterface) =>
      featureAccessor(this.config.columns)(dataContainer);
    this.getColumnAccessor = (dataContainer: DataContainerInterface) =>
      columnAccessor(this.config.columns)(dataContainer);
    this.getFieldAccessor = (dataContainer: DataContainerInterface) =>
      fieldAccessor(this.config.columns)(dataContainer);
  }

  get type() {
    return GeoJsonLayer.type;
  }
  static get type() {
    return 'geojson';
  }

  get name() {
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
      .filter(
        f =>
          (f.type === 'geojson' || f.type === 'geoarrow') &&
          SUPPORTED_ANALYZER_TYPES[f.analyzerType]
      )
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
    // for arrow format, `object` is the index of the row returned from deck
    const index = this.isArrow ? object : object?.properties?.index;
    if (index >= 0) {
      return dataContainer.row(index);
    }
    return null;
  }

  calculateDataAttribute({dataContainer, filteredIndex}, getPosition) {
    if (this.isArrow) {
      // return calculateDataAttributeFromArrow({dataContainer, filteredIndex});
      return this.dataToFeature;
    }
    return filteredIndex.map(i => this.dataToFeature[i]).filter(d => d);
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

    const isFilteredAccessor = d => {
      return this.filteredIndex ? this.filteredIndex[d.properties.index] : 1;
    };

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

  updateLayerMeta(dataContainer) {
    this.isArrow = dataContainer instanceof ArrowDataContainer;
    this.dataContainer = dataContainer;

    const getFeature = this.getPositionAccessor(dataContainer);
    const getColumn = this.getColumnAccessor;
    const getField = this.getFieldAccessor;

    const updateLayerMetaFunc = this.isArrow ? getGeojsonLayerMetaFromArrow : getGeojsonLayerMeta;
    const {dataToFeature, bounds, fixedRadius, featureTypes} = updateLayerMetaFunc(
      dataContainer,
      getFeature,
      getColumn,
      getField
    );

    this.dataToFeature = dataToFeature;
    this.updateMeta({bounds, fixedRadius, featureTypes});
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
        stroked: true,
        strokeColor: colorMaker.next().value
      });
    } else if (featureTypes && featureTypes.point) {
      // set fill to true if detect point
      return this.updateLayerVisConfig({filled: true, stroked: false});
    }

    return this;
  }

  isLayerHovered(objectInfo: any): boolean {
    return this.isArrow
      ? isLayerHoveredFromArrow(objectInfo, this.id)
      : super.isLayerHovered(objectInfo);
  }

  hasHoveredObject(objectInfo: any) {
    return this.isArrow
      ? getHoveredObjectFromArrow(
          objectInfo,
          this.dataContainer,
          this.id,
          this.getColumnAccessor,
          this.getFieldAccessor
        )
      : super.hasHoveredObject(objectInfo);
  }

  renderLayer(opts) {
    const {data: dataProps, gpuFilter, objectHovered, mapState, interactionConfig} = opts;

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

    const {data, ...props} = dataProps;
    const deckLayerData = this.isArrow ? data : [data];
    const deckLayers = deckLayerData.map((d, i) => {
      return new DeckGLGeoJsonLayer({
        ...defaultLayerProps,
        ...layerProps,
        ...props,
        data: d,
        id: this.isArrow ? `${this.id}-${i}` : this.id,
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
        // extensions: [...defaultLayerProps.extensions, new FilterArrowExtension()],
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
              getLineWidth: props.getLineWidth,
              getPointRadius: props.getPointRadius,
              getElevation: props.getElevation,
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
