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
  ALL_FIELD_TYPES
} from '@kepler.gl/constants';
import {ColorRange, Field, LayerColumn, Merge} from '@kepler.gl/types';
import {KeplerTable, Datasets} from '@kepler.gl/table';

type AggregationLayerColumns = {
  lat: LayerColumn;
  lng: LayerColumn;
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

export type AggregationLayerVisualChannelConfig = LayerColorConfig & LayerSizeConfig;
export type AggregationLayerConfig = Merge<LayerBaseConfig, {columns: AggregationLayerColumns}> &
  AggregationLayerVisualChannelConfig;
export default class AggregationLayer extends Layer {
  getColorRange: any;
  declare config: AggregationLayerConfig;
  declare getPointData: (any) => any;
  declare gpuFilterGetIndex: (any) => number;
  declare gpuFilterGetData: (dataContainer, data, fieldIndex) => any;

  constructor(
    props: {
      id?: string;
    } & LayerBaseConfigPartial
  ) {
    super(props);

    this.getPositionAccessor = dataContainer =>
      pointPosAccessor(this.config.columns)(dataContainer);
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

  get requiredLayerColumns() {
    return aggregateRequiredColumns;
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

  updateLayerMeta(dataset: KeplerTable, getPosition) {
    const {dataContainer} = dataset;
    // get bounds from points
    const bounds = this.getPointsBounds(dataContainer, getPosition);

    this.updateMeta({bounds});
  }

  calculateDataAttribute({filteredIndex}: KeplerTable, getPosition) {
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

  formatLayerData(datasets: Datasets, oldLayerData) {
    if (this.config.dataId === null) {
      return {};
    }
    const {gpuFilter, dataContainer} = datasets[this.config.dataId];
    const getPosition = this.getPositionAccessor(dataContainer);

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
    // deck.gl 9's native aggregation doesn't support per-bin filtering, so we
    // apply gpuFilter at the accessor level to keep bin values in sync with
    // active cross-filters / time-filters.
    const getFilteredColorValue =
      filterData && getColorValue
        ? points => getColorValue(points.filter(filterData))
        : getColorValue;
    const getFilteredElevationValue =
      filterData && getElevationValue
        ? points => getElevationValue(points.filter(filterData))
        : getElevationValue;

    const {data} = this.updateData(datasets, oldLayerData);

    return {
      data,
      getPosition,
      _filterData: filterData,
      ...(getFilteredColorValue ? {getColorValue: getFilteredColorValue} : {}),
      ...(getFilteredElevationValue ? {getElevationValue: getFilteredElevationValue} : {})
    };
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
        _filterData: {
          filterRange: gpuFilter.filterRange,
          ...gpuFilter.filterValueUpdateTriggers
        }
      },
      getElevationValue: {
        sizeField: this.config.sizeField,
        sizeAggregation: this.config.visConfig.sizeAggregation,
        _filterData: {
          filterRange: gpuFilter.filterRange,
          ...gpuFilter.filterValueUpdateTriggers
        }
      }
    };

    return {
      ...this.getDefaultDeckLayerProps(opts),
      coverage: visConfig.coverage,

      // color
      colorRange: this.getColorRange(visConfig.colorRange),
      colorMap: visConfig.colorRange.colorMap,
      colorScaleType: this.config.colorScale,
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
