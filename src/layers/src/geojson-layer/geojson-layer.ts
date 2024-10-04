// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as arrow from 'apache-arrow';
import {point as turfPoint} from '@turf/helpers';
import booleanWithin from '@turf/boolean-within';
import {Feature, Polygon} from 'geojson';
import uniq from 'lodash.uniq';
import {DATA_TYPES} from 'type-analyzer';
import Layer, {
  colorMaker,
  defaultGetFieldValue,
  LayerBaseConfig,
  LayerBaseConfigPartial,
  LayerColorConfig,
  LayerHeightConfig,
  LayerRadiusConfig,
  LayerSizeConfig,
  LayerStrokeColorConfig
} from '../base-layer';
import {GeoJsonLayer as DeckGLGeoJsonLayer} from '@deck.gl/layers';
import {
  getGeojsonLayerMeta,
  GeojsonDataMaps,
  DeckGlGeoTypes,
  detectTableColumns,
  COLUMN_MODE_GEOJSON,
  applyFiltersToTableColumns
} from './geojson-utils';
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
  RGBColor,
  Field,
  LayerColumn
} from '@kepler.gl/types';
import {KeplerTable} from '@kepler.gl/table';
import {DataContainerInterface, ArrowDataContainer} from '@kepler.gl/utils';
import {FilterArrowExtension} from '@kepler.gl/deckgl-layers';
import GeojsonInfoModalFactory from './geojson-info-modal';

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
  stroked: 'stroked';
  filled: 'filled';
  enable3d: 'enable3d';
  wireframe: 'wireframe';
  fixedHeight: 'fixedHeight';
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
  stroked: 'stroked',
  filled: 'filled',
  enable3d: 'enable3d',
  wireframe: 'wireframe',
  fixedHeight: 'fixedHeight'
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
  fixedHeight: VisConfigBoolean;
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
  stroked: boolean;
  filled: boolean;
  enable3d: boolean;
  wireframe: boolean;
  fixedHeight: boolean;
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
  featureTypes?: DeckGlGeoTypes;
  fixedRadius?: boolean;
};

export const geoJsonRequiredColumns: ['geojson'] = ['geojson'];

type ObjectInfo = {
  index: number;
  object?: Feature | undefined;
  picked: boolean;
  layer: Layer;
  radius?: number;
  id?: string;
};

export const featureAccessor =
  ({geojson}: GeoJsonLayerColumnsConfig) =>
  (dc: DataContainerInterface) =>
  d =>
    dc.valueAt(d.index, geojson.fieldIdx);

const geoColumnAccessor =
  ({geojson}: GeoJsonLayerColumnsConfig) =>
  (dc: DataContainerInterface): arrow.Vector | null =>
    dc.getColumn?.(geojson.fieldIdx) as arrow.Vector;

const getTableModeValueAccessor = feature => {
  // Called from gpu-filter-utils.getFilterValueAccessor()
  return field => feature.properties.values.map(v => field.valueAccessor(v));
};

const getTableModeFieldValue = (field, data) => {
  let rv;
  if (typeof data === 'function') {
    rv = data(field);
  } else {
    rv = defaultGetFieldValue(field, data);
  }
  return rv;
};

const geoFieldAccessor =
  ({geojson}: GeoJsonLayerColumnsConfig) =>
  (dc: DataContainerInterface): Field | null =>
    dc.getField ? dc.getField(geojson.fieldIdx) : null;

// access feature properties from geojson sub layer
export const defaultElevation = 500;
export const defaultLineWidth = 1;
export const defaultRadius = 1;

export const COLUMN_MODE_TABLE = 'table';
const SUPPORTED_COLUMN_MODES = [
  {
    key: COLUMN_MODE_GEOJSON,
    label: 'GeoJSON',
    requiredColumns: ['geojson']
  },
  {
    key: COLUMN_MODE_TABLE,
    label: 'Table columns',
    requiredColumns: ['id', 'lat', 'lng'],
    optionalColumns: ['altitude', 'sortBy']
  }
];
const DEFAULT_COLUMN_MODE = COLUMN_MODE_GEOJSON;

export default class GeoJsonLayer extends Layer {
  declare config: GeoJsonLayerConfig;
  declare visConfigSettings: GeoJsonVisConfigSettings;
  declare meta: GeoJsonLayerMeta;

  dataToFeature: GeojsonDataMaps = [];
  dataContainer: DataContainerInterface | null = null;
  filteredIndex: Uint8ClampedArray | null = null;
  filteredIndexTrigger: number[] | null = null;
  centroids: Array<number[] | null> = [];

  _layerInfoModal: {
    [COLUMN_MODE_TABLE]: () => React.JSX.Element;
    [COLUMN_MODE_GEOJSON]: () => React.JSX.Element;
  };

  constructor(props) {
    super(props);

    this.registerVisConfig(geojsonVisConfigs);
    this.getPositionAccessor = (dataContainer: DataContainerInterface) =>
      featureAccessor(this.config.columns)(dataContainer);
    this._layerInfoModal = {
      [COLUMN_MODE_TABLE]: GeojsonInfoModalFactory(COLUMN_MODE_TABLE),
      [COLUMN_MODE_GEOJSON]: GeojsonInfoModalFactory(COLUMN_MODE_GEOJSON)
    };
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

  get columnPairs() {
    return this.defaultPointColumnPairs;
  }

  get supportedColumnModes() {
    return SUPPORTED_COLUMN_MODES;
  }

  get layerInfoModal() {
    return {
      [COLUMN_MODE_GEOJSON]: {
        id: 'iconInfo',
        template: this._layerInfoModal[COLUMN_MODE_GEOJSON],
        modalProps: {
          title: 'modal.polygonInfo.title'
        }
      },
      [COLUMN_MODE_TABLE]: {
        id: 'iconInfo',
        template: this._layerInfoModal[COLUMN_MODE_TABLE],
        modalProps: {
          title: 'modal.polygonInfo.titleTable'
        }
      }
    };
  }

  accessVSFieldValue() {
    if (this.config.columnMode === COLUMN_MODE_GEOJSON) {
      return defaultGetFieldValue;
    }
    return getTableModeFieldValue;
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
        fixed: 'fixedHeight',
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
      columnMode: props?.columnMode ?? DEFAULT_COLUMN_MODE,
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
    const index = dataContainer instanceof ArrowDataContainer ? object : object?.properties?.index;
    if (index >= 0) {
      return dataContainer.row(index);
    }
    return null;
  }

  getFilteredItemCount() {
    // return -polygons-fill or -polygons-stroke
    // + -linestrings
    // + -points-circle
    if (Object.keys(this.filteredItemCount).length) {
      const polygonCount =
        this.filteredItemCount[`${this.id}-polygons-fill`] ||
        this.filteredItemCount[`${this.id}-polygons-stroke`] ||
        0;
      const linestringCount = this.filteredItemCount[`${this.id}-linestrings`] || 0;
      const pointCount = this.filteredItemCount[`${this.id}-points-circle`] || 0;

      return polygonCount + linestringCount + pointCount;
    }

    return null;
  }

  calculateDataAttribute(dataset: KeplerTable) {
    const {dataContainer, filteredIndex} = dataset;
    if (dataContainer instanceof ArrowDataContainer) {
      // TODO add columnMode logic here for ArrowDataContainer?
      // filter geojson/arrow table by values and make a partial copy of the raw table are expensive
      // so we will use filteredIndex to create an attribute e.g. filteredIndex [0|1] for GPU filtering
      // in deck.gl layer, see: FilterArrowExtension in @kepler.gl/deckgl-layers
      if (!this.filteredIndex || this.filteredIndex.length !== dataContainer.numRows()) {
        // for incremental data loading, we need to update filteredIndex
        this.filteredIndex = new Uint8ClampedArray(dataContainer.numRows());
        this.filteredIndex.fill(1);
      }

      // check if filteredIndex is a range from 0 to numRows if it is, we don't need to update it
      const isRange = filteredIndex && filteredIndex.length === dataContainer.numRows();
      if (!isRange || this.filteredIndexTrigger !== null) {
        this.filteredIndex.fill(0);
        for (let i = 0; i < filteredIndex.length; ++i) {
          this.filteredIndex[filteredIndex[i]] = 1;
        }
        this.filteredIndexTrigger = filteredIndex;
      }
      // for arrow, always return full dataToFeature instead of a filtered one, so there is no need to update attributes in GPU
      return this.dataToFeature;
    }

    // for geojson, this should work as well and more efficient. But we need to update some test cases e.g. #GeojsonLayer -> formatLayerData
    switch (this.config.columnMode) {
      case COLUMN_MODE_GEOJSON: {
        return filteredIndex.map(i => this.dataToFeature[i]).filter(d => d);
      }

      case COLUMN_MODE_TABLE:
        return applyFiltersToTableColumns(dataset, this.dataToFeature);

      default:
        return [];
    }
  }

  formatLayerData(datasets, oldLayerData) {
    if (this.config.dataId === null) {
      return {};
    }
    const {gpuFilter, dataContainer} = datasets[this.config.dataId];
    const {data} = this.updateData(datasets, oldLayerData);

    let filterValueAccessor;
    let dataAccessor;
    if (this.config.columnMode === COLUMN_MODE_GEOJSON) {
      filterValueAccessor = (dc, d, fieldIndex) => dc.valueAt(d.properties.index, fieldIndex);
      dataAccessor = () => d => ({index: d.properties.index});
    } else {
      filterValueAccessor = getTableModeValueAccessor;
      dataAccessor = () => d => ({index: d.properties.index});
    }

    const indexAccessor = f => f.properties.index;
    const accessors = this.getAttributeAccessors({dataAccessor, dataContainer});

    const isFilteredAccessor = d => {
      return this.filteredIndex ? this.filteredIndex[d.properties.index] : 1;
    };

    return {
      data,
      getFilterValue: gpuFilter.filterValueAccessor(dataContainer)(
        indexAccessor,
        filterValueAccessor
      ),
      getFiltered: isFilteredAccessor,
      ...accessors
    };
  }

  isInPolygon(data: DataContainerInterface, index: number, polygon: Feature<Polygon>): boolean {
    if (this.centroids.length === 0 || !this.centroids[index]) {
      return false;
    }
    const isReactangleSearchBox = polygon.properties?.shape === 'Rectangle';
    const point = this.centroids[index];
    // if no valid centroid, return false
    if (!point) return false;
    // quick check if centroid is within the query rectangle
    if (isReactangleSearchBox && polygon.properties?.bbox) {
      const [minX, minY, maxX, maxY] = polygon?.properties?.bbox || [];
      return point[0] >= minX && point[0] <= maxX && point[1] >= minY && point[1] <= maxY;
    }
    // use turf.js to check if centroid is within query polygon
    return booleanWithin(turfPoint(point), polygon);
  }

  updateLayerMeta(dataContainer) {
    this.dataContainer = dataContainer;

    if (dataContainer instanceof ArrowDataContainer) {
      const geoColumn = geoColumnAccessor(this.config.columns)(dataContainer);
      const geoField = geoFieldAccessor(this.config.columns)(dataContainer);

      // update the latest batch/chunk of geoarrow data when loading data incrementally
      if (geoColumn && geoField && this.dataToFeature.length < dataContainer.numChunks()) {
        // for incrementally loading data, we only load and render the latest batch; otherwise, we will load and render all batches
        const isIncrementalLoad = dataContainer.numChunks() - this.dataToFeature.length === 1;
        // TODO: add support for COLUMN_MODE_TABLE in getGeojsonLayerMetaFromArrow
        const {dataToFeature, bounds, fixedRadius, featureTypes, centroids} =
          getGeojsonLayerMetaFromArrow({
            dataContainer,
            geoColumn,
            geoField,
            ...(isIncrementalLoad ? {chunkIndex: this.dataToFeature.length} : null)
          });
        if (centroids) this.centroids = this.centroids.concat(centroids);
        this.updateMeta({bounds, fixedRadius, featureTypes});
        this.dataToFeature = [...this.dataToFeature, ...dataToFeature];
      }
    } else if (this.dataToFeature.length === 0) {
      const getFeature = this.getPositionAccessor(dataContainer);

      const {dataToFeature, bounds, fixedRadius, featureTypes, centroids} = getGeojsonLayerMeta({
        dataContainer,
        getFeature,
        config: this.config
      });
      if (centroids) this.centroids = centroids;
      this.dataToFeature = dataToFeature;
      this.updateMeta({bounds, fixedRadius, featureTypes});
    }
  }

  setInitialLayerConfig(dataset) {
    const {dataContainer} = dataset;
    if (!dataContainer.numRows()) {
      return this;
    }

    // defefaultLayerProps will automatically find geojson column
    // if not found, we try to set it to id / lat /lng /ts
    if (!this.config.columns.geojson.value) {
      // find columns from lat, lng, id, and ts
      const columnConfig = detectTableColumns(dataset, this.config.columns, 'sortBy');
      if (columnConfig) {
        this.updateLayerConfig({
          ...columnConfig,
          columnMode: COLUMN_MODE_TABLE
        });
      }
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

  isLayerHovered(objectInfo: ObjectInfo): boolean {
    return this.dataContainer instanceof ArrowDataContainer
      ? isLayerHoveredFromArrow(objectInfo, this.id)
      : super.isLayerHovered(objectInfo);
  }

  hasHoveredObject(objectInfo: ObjectInfo): Feature | null {
    return this.dataContainer instanceof ArrowDataContainer
      ? getHoveredObjectFromArrow(
          objectInfo,
          this.dataContainer,
          this.id,
          geoColumnAccessor(this.config.columns),
          geoFieldAccessor(this.config.columns)
        )
      : super.hasHoveredObject(objectInfo);
  }

  getElevationZoomFactor({zoom, zoomOffset = 0}) {
    return this.config.visConfig.fixedHeight ? 1 : Math.pow(2, Math.max(8 - zoom + zoomOffset, 0));
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
      getFilterValue: gpuFilter.filterValueUpdateTriggers,
      getFiltered: this.filteredIndexTrigger
    };

    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);
    const opaOverwrite = {
      opacity: visConfig.strokeOpacity
    };

    const pickable = interactionConfig.tooltip.enabled;
    const hoveredObject = this.hasHoveredObject(objectHovered);

    const {data, ...props} = dataProps;

    // arrow table can have multiple chunks, a deck.gl layer is created for each chunk
    const deckLayerData = this.dataContainer instanceof ArrowDataContainer ? data : [data];
    const deckLayers = deckLayerData.map((d, i) => {
      return new DeckGLGeoJsonLayer({
        ...defaultLayerProps,
        ...layerProps,
        ...props,
        data: d,
        id: deckLayerData.length > 1 ? `${this.id}-${i}` : this.id,
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
