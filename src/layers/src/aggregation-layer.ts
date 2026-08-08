// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import memoize from 'lodash/memoize';
import Layer, {
  LayerBaseConfig,
  LayerBaseConfigPartial,
  LayerColorConfig,
  LayerSizeConfig,
  VisualChannelDescription,
  VisualChannels
} from './base-layer';
import {hexToRgb, aggregate, DataContainerInterface} from '@kepler.gl/utils';
import {
  HIGHLIGH_COLOR_3D,
  CHANNEL_SCALES,
  FIELD_OPTS,
  DEFAULT_AGGREGATION,
  AGGREGATION_TYPES,
  ALL_FIELD_TYPES,
  GEOJSON_FIELDS
} from '@kepler.gl/constants';
import {ColorRange, Field, LayerColumn, Merge} from '@kepler.gl/types';
import {KeplerTable, Datasets} from '@kepler.gl/table';
import {DATA_TYPES} from 'type-analyzer';
import {booleanWithin} from '@turf/boolean-within';
import {point as turfPoint} from '@turf/helpers';
import {Feature, Polygon} from 'geojson';

import {getGeoArrowPointLayerProps, FindDefaultLayerPropsReturnValue} from './layer-utils';
import {parseGeoJsonRawFeature} from './geojson-layer/geojson-utils';

type AggregationLayerColumns = {
  lat: LayerColumn;
  lng: LayerColumn;
  geojson: LayerColumn;
};

export type AggregationLayerData = {
  index: number;
};

export const pointPosAccessor =
  ({lat, lng}: AggregationLayerColumns) =>
  dc =>
  d =>
    [dc.valueAt(d.index, lng.fieldIdx), dc.valueAt(d.index, lat.fieldIdx)];

export const pointPosResolver = ({lat, lng}: AggregationLayerColumns) =>
  `${lat.fieldIdx}-${lng.fieldIdx}`;

export const geojsonAccessor =
  ({geojson}: AggregationLayerColumns) =>
  (dc: DataContainerInterface) =>
  (d: {index: number}) =>
    dc.valueAt(d.index, geojson.fieldIdx);

export const COLUMN_MODE_POINTS = 'points';
export const COLUMN_MODE_GEOJSON = 'geojson';

const SUPPORTED_ANALYZER_TYPES = {
  [DATA_TYPES.GEOMETRY]: true,
  [DATA_TYPES.GEOMETRY_FROM_STRING]: true,
  [DATA_TYPES.PAIR_GEOMETRY_FROM_STRING]: true
};

const SUPPORTED_COLUMN_MODES = [
  {
    key: COLUMN_MODE_POINTS,
    label: 'Points',
    requiredColumns: ['lat', 'lng']
  },
  {
    key: COLUMN_MODE_GEOJSON,
    label: 'GeoJSON',
    requiredColumns: ['geojson']
  }
];
const DEFAULT_COLUMN_MODE = COLUMN_MODE_POINTS;

export const getValueAggrFunc = getPointData => (field, aggregation) => points =>
  field
    ? aggregate(
        points.map(p => field.valueAccessor(getPointData(p))),
        aggregation
      )
    : points.length;

export const getFilterDataFunc =
  (
    filterRange: number[][],
    getFilterValue: (d: unknown) => (number | number[])[]
  ): ((d: unknown) => boolean) =>
  pt =>
    getFilterValue(pt).every((val, i) => {
      return typeof val === 'number' ? val >= filterRange[i][0] && val <= filterRange[i][1] : false;
    });

const NON_NUMERIC_FIELD_TYPES: Set<string> = new Set([
  ALL_FIELD_TYPES.string,
  ALL_FIELD_TYPES.boolean,
  ALL_FIELD_TYPES.date
]);

/**
 * Wrap a per-bin accessor that may return a non-numeric value (e.g. a string
 * from "mode" aggregation) so that it returns a stable numeric index instead.
 * deck.gl 9's native CPU aggregation stores results in a Float32Array which
 * silently converts strings to NaN — this wrapper prevents that.
 */
function wrapOrdinalAccessor(
  accessor: (points: unknown[]) => unknown
): (points: unknown[]) => number {
  const valueToIndex = new Map<string, number>();
  return (points: unknown[]) => {
    const value = accessor(points);
    if (value == null) return NaN;
    const key = String(value);
    let idx = valueToIndex.get(key);
    if (idx === undefined) {
      idx = valueToIndex.size;
      valueToIndex.set(key, idx);
    }
    return idx;
  };
}

const getLayerColorRange = (colorRange: ColorRange) => colorRange.colors.map(hexToRgb);

export const aggregateRequiredColumns: ['lat', 'lng'] = ['lat', 'lng'];

/**
 * Compute the centroid [lng, lat] of a GeoJSON geometry.
 * For Point returns the coordinate directly; for complex geometries
 * averages all vertex positions into a single representative point.
 */
function getCentroidFromGeometry(geometry: any): number[] | null {
  if (!geometry) return null;
  const positions = getAllPositions(geometry);
  if (positions.length === 0) return null;
  if (positions.length === 1) return positions[0];

  let sumLng = 0;
  let sumLat = 0;
  let count = 0;
  for (const pos of positions) {
    if (Number.isFinite(pos[0]) && Number.isFinite(pos[1])) {
      sumLng += pos[0];
      sumLat += pos[1];
      count++;
    }
  }
  return count > 0 ? [sumLng / count, sumLat / count] : null;
}

/**
 * Extract all vertex [lng, lat] coordinates from a GeoJSON geometry.
 */
function getAllPositions(geometry: any): number[][] {
  if (!geometry) return [];
  switch (geometry.type) {
    case 'Point':
      return [geometry.coordinates];
    case 'MultiPoint':
    case 'LineString':
      return geometry.coordinates;
    case 'MultiLineString':
    case 'Polygon':
      return geometry.coordinates.flat();
    case 'MultiPolygon':
      return geometry.coordinates.flat(2);
    case 'GeometryCollection':
      return (geometry.geometries || []).flatMap(getAllPositions);
    default:
      return [];
  }
}

export type AggregationLayerVisualChannelConfig = LayerColorConfig & LayerSizeConfig;
export type AggregationLayerConfig = Merge<LayerBaseConfig, {columns: AggregationLayerColumns}> &
  AggregationLayerVisualChannelConfig;
export default class AggregationLayer extends Layer {
  getColorRange: any;
  declare config: AggregationLayerConfig;
  declare getPointData: (any) => any;
  declare gpuFilterGetIndex: (any) => number;
  declare gpuFilterGetData: (dataContainer, data, fieldIndex) => any;

  dataToFeature: any[] = [];
  centroids: Array<number[] | null> = [];
  private _geojsonFieldIdx = -1;
  private _geojsonBounds: [number, number, number, number] | null = null;

  constructor(
    props: {
      id?: string;
    } & LayerBaseConfigPartial
  ) {
    super(props);

    this.getPositionAccessor = dataContainer => {
      if (this.config.columnMode === COLUMN_MODE_GEOJSON) {
        return geojsonAccessor(this.config.columns)(dataContainer as DataContainerInterface);
      }
      return pointPosAccessor(this.config.columns)(dataContainer);
    };
    this.getColorRange = memoize(getLayerColorRange);

    // Access data of a point from aggregated bins
    // In deck.gl 9, aggregation layers pass original data items directly to getColorValue/getElevationValue
    this.getPointData = pt => pt;

    this.gpuFilterGetIndex = pt => this.getPointData(pt).index;
    this.gpuFilterGetData = (dataContainer, data, fieldIndex) =>
      dataContainer.valueAt(data.index, fieldIndex);
  }

  get isAggregated(): true {
    return true;
  }

  get supportedColumnModes() {
    return SUPPORTED_COLUMN_MODES;
  }

  get columnPairs() {
    return this.defaultPointColumnPairs;
  }

  get noneLayerDataAffectingProps() {
    return [
      ...super.noneLayerDataAffectingProps,
      'enable3d',
      'colorRange',
      'colorDomain',
      'sizeRange',
      'sizeScale',
      'sizeDomain',
      'percentile',
      'coverage',
      'elevationPercentile',
      'elevationScale',
      'enableElevationZoomFactor',
      'fixedHeight'
    ];
  }

  static findDefaultLayerProps(dataset: KeplerTable): FindDefaultLayerPropsReturnValue {
    const altProps = getGeoArrowPointLayerProps(dataset);

    const geojsonColumns = dataset.fields
      .filter(
        f =>
          (f.type === 'geojson' || f.type === 'geoarrow') &&
          f.analyzerType &&
          SUPPORTED_ANALYZER_TYPES[f.analyzerType]
      )
      .map(f => f.name);

    const defaultColumns = {
      geojson: [...(GEOJSON_FIELDS.geojson || []), ...geojsonColumns]
    };
    const foundColumns = this.findDefaultColumnField(defaultColumns, dataset.fields);

    if (foundColumns?.length) {
      const {label} = dataset;
      altProps.push(
        ...foundColumns.map(columns => ({
          label: (typeof label === 'string' && label.replace(/\.[^/.]+$/, '')) || 'aggregation',
          columns,
          columnMode: COLUMN_MODE_GEOJSON
        }))
      );
    }

    return {
      props: [],
      altProps
    };
  }

  getDefaultLayerConfig(props: LayerBaseConfigPartial) {
    return {
      ...super.getDefaultLayerConfig(props),
      columnMode: props?.columnMode ?? DEFAULT_COLUMN_MODE
    };
  }

  getDataUpdateTriggers(dataset: KeplerTable): any {
    const triggers = super.getDataUpdateTriggers(dataset);
    const {columnMode} = this.config;
    return {
      ...triggers,
      getData: {...triggers.getData, columnMode},
      getMeta: {...triggers.getMeta, columnMode}
    };
  }

  get visualChannels(): VisualChannels {
    return {
      color: {
        aggregation: 'colorAggregation',
        channelScaleType: CHANNEL_SCALES.colorAggr,
        defaultMeasure: 'property.pointCount',
        domain: 'colorDomain',
        field: 'colorField',
        key: 'color',
        property: 'color',
        range: 'colorRange',
        scale: 'colorScale'
      },
      size: {
        aggregation: 'sizeAggregation',
        channelScaleType: CHANNEL_SCALES.sizeAggr,
        condition: config => config.visConfig.enable3d,
        defaultMeasure: 'property.pointCount',
        domain: 'sizeDomain',
        field: 'sizeField',
        key: 'size',
        property: 'height',
        range: 'sizeRange',
        scale: 'sizeScale'
      }
    };
  }

  /**
   * Get the description of a visualChannel config
   * @param key
   * @returns
   */
  getVisualChannelDescription(key: string): VisualChannelDescription {
    const channel = this.visualChannels[key];
    if (!channel) return {label: '', measure: undefined};
    // e.g. label: Color, measure: Average of ETA
    const {range, field, defaultMeasure, aggregation} = channel;
    const fieldConfig = this.config[field];
    const label = this.visConfigSettings[range]?.label;

    return {
      label: typeof label === 'function' ? label(this.config) : label || '',
      measure:
        fieldConfig && aggregation
          ? `${this.config.visConfig[aggregation]} of ${
              fieldConfig.displayName || fieldConfig.name
            }`
          : defaultMeasure
    };
  }

  getHoverData(object: any, dataContainer: DataContainerInterface, fields: Field[]): any {
    if (!object) return object;
    const measure = this.config.visConfig.colorAggregation;
    // aggregate all fields for the hovered group
    const aggregatedData = fields.reduce((accu, field) => {
      accu[field.name] = {
        measure,
        value: aggregate(object.points, measure, (d: {index: number}) => {
          return dataContainer.valueAt(d.index, field.fieldIdx);
        })
      };
      return accu;
    }, {});

    // return aggregated object
    return {aggregatedData, ...object};
  }

  getFilteredItemCount() {
    // gpu filter not supported
    return null;
  }

  /**
   * Aggregation layer handles visual channel aggregation inside deck.gl layer
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateLayerVisualChannel({dataContainer}, channel) {
    this.validateVisualChannel(channel);

    // When the color scale type changes, recompute colorDomain from stored aggregatedBins.
    // quantile scale needs the full sorted array of bin values; other scales need [min, max].
    // aggregatedBins is only populated from onSetColorDomain, so restrict to the color channel.
    const visualChannel = this.visualChannels[channel];
    if (channel === 'color' && visualChannel && this.config.aggregatedBins) {
      const scaleType = this.config[visualChannel.scale];
      const domainKey = visualChannel.domain;
      const bins = Object.values(this.config.aggregatedBins) as {value: number}[];
      if (bins.length > 0) {
        if (scaleType === 'quantile') {
          const sorted = bins
            .map(b => b.value)
            .filter(Number.isFinite)
            .sort((a, b) => a - b);
          this.updateLayerConfig({[domainKey]: sorted});
        } else {
          let min = Infinity;
          let max = -Infinity;
          for (const b of bins) {
            if (Number.isFinite(b.value)) {
              if (b.value < min) min = b.value;
              if (b.value > max) max = b.value;
            }
          }
          if (Number.isFinite(min) && Number.isFinite(max)) {
            this.updateLayerConfig({[domainKey]: [min, max]});
          }
        }
      }
    }
  }

  /**
   * Validate aggregation type on top of basic layer visual channel validation
   * @param channel
   */
  validateVisualChannel(channel) {
    // field type decides aggregation type decides scale type
    this.validateFieldType(channel);
    this.validateAggregationType(channel);
    this.validateScale(channel);
  }

  /**
   * Validate aggregation type based on selected field
   */
  validateAggregationType(channel) {
    const visualChannel = this.visualChannels[channel];
    const {field, aggregation} = visualChannel;
    const aggregationOptions = this.getAggregationOptions(channel);

    if (!aggregation) {
      return;
    }

    if (!aggregationOptions.length) {
      // if field cannot be aggregated, set field to null
      this.updateLayerConfig({[field]: null});
    } else if (!aggregationOptions.includes(this.config.visConfig[aggregation])) {
      // current aggregation type is not supported by this field
      // set aggregation to the first supported option
      this.updateLayerVisConfig({[aggregation]: aggregationOptions[0]});
    } else if (
      this.config[field] &&
      this.config.visConfig[aggregation] === AGGREGATION_TYPES.count
    ) {
      // When a field is selected but aggregation is still 'count' (carried over
      // from the no-field / "Count Points" state), switch to a meaningful default.
      // 'count' ignores the field values entirely, so keeping it would make the
      // field selection appear to have no effect.
      const meaningful = aggregationOptions.find(opt => opt !== AGGREGATION_TYPES.count);
      if (meaningful) {
        this.updateLayerVisConfig({[aggregation]: meaningful});
      }
    }
  }

  getAggregationOptions(channel) {
    const visualChannel = this.visualChannels[channel];
    const {field, channelScaleType} = visualChannel;

    return Object.keys(
      this.config[field]
        ? FIELD_OPTS[this.config[field].type].scale[channelScaleType]
        : DEFAULT_AGGREGATION[channelScaleType]
    );
  }

  /**
   * Get scale options based on current field and aggregation type
   * @param channel
   * @returns
   */
  getScaleOptions(channel: string): string[] {
    const visualChannel = this.visualChannels[channel];
    const {field, aggregation, channelScaleType} = visualChannel;
    const aggregationType = aggregation ? this.config.visConfig[aggregation] : null;

    if (!aggregationType) {
      return [];
    }

    return this.config[field]
      ? // scale options based on aggregation
        FIELD_OPTS[this.config[field].type].scale[channelScaleType][aggregationType]
      : // default scale options for point count: aggregationType should be count since
        // LAYER_VIS_CONFIGS.aggregation.defaultValue is AGGREGATION_TYPES.average,
        DEFAULT_AGGREGATION[channelScaleType][AGGREGATION_TYPES.count];
  }

  /**
   * Aggregation layer handles visual channel aggregation inside deck.gl layer
   */
  updateLayerDomain(): AggregationLayer {
    return this;
  }

  updateLayerMeta(dataset: KeplerTable, getPosition?) {
    const {dataContainer} = dataset;

    if (this.config.columnMode === COLUMN_MODE_GEOJSON) {
      const getFeature = this.getPositionAccessor(dataContainer);
      this._buildGeojsonDataToFeature(dataContainer, getFeature);
      this.updateMeta({bounds: this._geojsonBounds});
    } else {
      this.dataToFeature = [];
      this.centroids = [];
      if (!getPosition) {
        getPosition = this.getPositionAccessor(dataContainer);
      }
      const bounds = this.getPointsBounds(dataContainer, getPosition);
      this.updateMeta({bounds});
    }
  }

  private _buildGeojsonDataToFeature(dataContainer: DataContainerInterface, getFeature: any) {
    const fieldIdx = this.config.columns.geojson.fieldIdx;
    if (
      this.dataToFeature.length === dataContainer.numRows() &&
      this._geojsonFieldIdx === fieldIdx
    ) {
      return;
    }
    this._geojsonFieldIdx = fieldIdx;
    this.dataToFeature = [];
    this.centroids = [];

    let minLng = Infinity;
    let maxLng = -Infinity;
    let minLat = Infinity;
    let maxLat = -Infinity;
    let hasValid = false;

    for (let i = 0; i < dataContainer.numRows(); i++) {
      const rawFeature = getFeature({index: i});
      const feature = parseGeoJsonRawFeature(rawFeature);
      this.dataToFeature[i] = feature;
      this.centroids[i] = feature?.geometry ? getCentroidFromGeometry(feature.geometry) : null;

      if (feature?.geometry) {
        const positions = getAllPositions(feature.geometry);
        for (const pos of positions) {
          const lng = pos[0];
          const lat = pos[1];
          if (Number.isFinite(lng) && Number.isFinite(lat)) {
            hasValid = true;
            if (lng < minLng) minLng = lng;
            if (lng > maxLng) maxLng = lng;
            if (lat < minLat) minLat = lat;
            if (lat > maxLat) maxLat = lat;
          }
        }
      }
    }

    this._geojsonBounds = hasValid ? [minLng, minLat, maxLng, maxLat] : null;
  }

  isInPolygon(data: DataContainerInterface, index: number, polygon: Feature<Polygon>): boolean {
    if (this.centroids.length === 0 || !this.centroids[index]) {
      return false;
    }
    const point = this.centroids[index];
    if (!point) return false;
    const isRectangleSearchBox = polygon.properties?.shape === 'Rectangle';
    if (isRectangleSearchBox && polygon.properties?.bbox) {
      const [minX, minY, maxX, maxY] = polygon.properties.bbox;
      return point[0] >= minX && point[0] <= maxX && point[1] >= minY && point[1] <= maxY;
    }
    return booleanWithin(turfPoint(point), polygon);
  }

  calculateDataAttribute({filteredIndex}: KeplerTable, getPosition) {
    if (this.config.columnMode === COLUMN_MODE_GEOJSON) {
      return this._calculateGeojsonDataAttribute(filteredIndex);
    }

    const data: AggregationLayerData[] = [];

    for (let i = 0; i < filteredIndex.length; i++) {
      const index = filteredIndex[i];
      const pos = getPosition({index});

      // if doesn't have point lat or lng, do not add the point
      // deck.gl can't handle position = null
      if (pos.every(Number.isFinite)) {
        data.push({
          index
        });
      }
    }

    return data;
  }

  private _calculateGeojsonDataAttribute(filteredIndex: number[]) {
    const data: {index: number; position: number[]}[] = [];

    for (let i = 0; i < filteredIndex.length; i++) {
      const index = filteredIndex[i];
      const feature = this.dataToFeature[index];
      if (!feature?.geometry) continue;

      const centroid = getCentroidFromGeometry(feature.geometry);
      if (centroid) {
        data.push({index, position: centroid});
      }
    }

    return data;
  }

  formatLayerData(datasets: Datasets, oldLayerData) {
    if (this.config.dataId === null) {
      return {};
    }
    const {gpuFilter, dataContainer} = datasets[this.config.dataId];
    const isGeojsonMode = this.config.columnMode === COLUMN_MODE_GEOJSON;

    const getPosition = isGeojsonMode
      ? (d: {position: number[]}) => d.position
      : this.getPositionAccessor(dataContainer);

    const hasFilter = Object.values(gpuFilter.filterRange).some((arr: any) =>
      arr.some(v => v !== 0)
    );

    const getFilterValue = gpuFilter.filterValueAccessor(dataContainer)(
      this.gpuFilterGetIndex,
      this.gpuFilterGetData
    );
    const filterData = hasFilter
      ? getFilterDataFunc(gpuFilter.filterRange, getFilterValue)
      : undefined;

    const aggregatePoints = getValueAggrFunc(this.getPointData);
    let getColorValue = aggregatePoints(
      this.config.colorField,
      this.config.visConfig.colorAggregation
    );

    let getElevationValue = aggregatePoints(
      this.config.sizeField,
      this.config.visConfig.sizeAggregation
    );

    // deck.gl 9's native CPU aggregation stores getColorValue/getElevationValue
    // results in a Float32Array. "mode" aggregation on non-numeric fields returns
    // a string, which becomes NaN in Float32Array. Wrap with ordinal mapping to
    // convert strings to stable numeric indices.
    if (
      this.config.colorField &&
      this.config.visConfig.colorAggregation === AGGREGATION_TYPES.mode &&
      NON_NUMERIC_FIELD_TYPES.has(this.config.colorField.type)
    ) {
      getColorValue = wrapOrdinalAccessor(getColorValue);
    }
    if (
      this.config.sizeField &&
      this.config.visConfig.sizeAggregation === AGGREGATION_TYPES.mode &&
      NON_NUMERIC_FIELD_TYPES.has(this.config.sizeField.type)
    ) {
      getElevationValue = wrapOrdinalAccessor(getElevationValue);
    }

    // Wrap accessors to filter points within each bin before aggregating.
    const getFilteredColorValue =
      filterData && getColorValue
        ? points => getColorValue(points.filter(filterData))
        : getColorValue;
    const getFilteredElevationValue =
      filterData && getElevationValue
        ? points => getElevationValue(points.filter(filterData))
        : getElevationValue;

    const {data} = this.updateData(datasets, oldLayerData);

    const result = {
      data,
      getPosition,
      _filterData: filterData,
      ...(getFilteredColorValue ? {getColorValue: getFilteredColorValue} : {}),
      ...(getFilteredElevationValue ? {getElevationValue: getFilteredElevationValue} : {})
    };

    return result;
  }

  getDefaultDeckLayerProps(opts): any {
    const baseProp = super.getDefaultDeckLayerProps(opts);
    return {
      ...baseProp,
      highlightColor: HIGHLIGH_COLOR_3D,
      // gpu data filtering is not supported in aggregation layer
      extensions: [],
      autoHighlight: this.config.visConfig.enable3d
    };
  }

  getDefaultAggregationLayerProp(opts) {
    const {gpuFilter, mapState, layerCallbacks = {}} = opts;
    const {visConfig} = this.config;
    const eleZoomFactor = this.getElevationZoomFactor(mapState);

    const updateTriggers = {
      getColorValue: {
        colorField: this.config.colorField,
        colorAggregation: this.config.visConfig.colorAggregation,
        colorRange: visConfig.colorRange,
        colorMap: visConfig.colorRange.colorMap,
        filterRange: gpuFilter.filterRange,
        ...gpuFilter.filterValueUpdateTriggers
      },
      getElevationValue: {
        sizeField: this.config.sizeField,
        sizeAggregation: this.config.visConfig.sizeAggregation,
        filterRange: gpuFilter.filterRange,
        ...gpuFilter.filterValueUpdateTriggers
      }
    };

    // deck.gl's aggregation shader maps bin values to a color texture using a
    // simple linear interpolation: (value - domain[0]) / (domain[1] - domain[0]).
    // It only understands 'quantize', 'quantile', 'ordinal', and 'linear'.
    // kepler.gl's 'custom' scale (d3.scaleThreshold with user-defined break
    // points) cannot be represented in the shader directly.  Instead, our
    // ScaleEnhanced*Layer._onAggregationUpdate reclassifies each bin's raw
    // value into a break index [0 … N-1].  We then tell deck.gl to use
    // 'quantize' over [0, N-1] so each index maps to the correct color pixel.
    let colorScaleType = this.config.colorScale as string;
    let customColorDomain: [number, number] | undefined;
    const isCustomScale = colorScaleType === 'custom';
    const colorMap = isCustomScale ? visConfig.colorRange.colorMap : undefined;
    if (isCustomScale && colorMap) {
      colorScaleType = 'quantize';
      customColorDomain = [0, colorMap.length - 1];
    }

    return {
      ...this.getDefaultDeckLayerProps(opts),
      coverage: visConfig.coverage,

      // color
      colorRange: this.getColorRange(visConfig.colorRange),
      colorMap,
      colorScaleType,
      ...(customColorDomain ? {colorDomain: customColorDomain} : {}),
      upperPercentile: visConfig.percentile[1],
      lowerPercentile: visConfig.percentile[0],
      colorAggregation: visConfig.colorAggregation,

      // elevation
      extruded: visConfig.enable3d,
      elevationScale: visConfig.elevationScale * eleZoomFactor,
      elevationScaleType: this.config.sizeScale,
      elevationRange: visConfig.sizeRange,
      elevationFixed: visConfig.fixedHeight,

      elevationLowerPercentile: visConfig.elevationPercentile[0],
      elevationUpperPercentile: visConfig.elevationPercentile[1],

      // updateTriggers
      updateTriggers,

      // callbacks
      onSetColorDomain: layerCallbacks.onSetLayerDomain
    };
  }
}
