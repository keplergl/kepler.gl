// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import memoize from 'lodash.memoize';
import Layer, {
  LayerBaseConfig,
  LayerBaseConfigPartial,
  LayerColorConfig,
  LayerSizeConfig,
  VisualChannelDescription,
  VisualChannels
} from './base-layer';
import {hexToRgb, aggregate} from '@kepler.gl/utils';
import {
  HIGHLIGH_COLOR_3D,
  CHANNEL_SCALES,
  FIELD_OPTS,
  DEFAULT_AGGREGATION,
  ColorRange
} from '@kepler.gl/constants';
import {Merge, LayerColumn} from '@kepler.gl/types';
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
    getFilterValue(pt).every((val, i) => val >= filterRange[i][0] && val <= filterRange[i][1]);

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

    // Access data of a point from aggregated bins, depends on how BinSorter works
    // Deck.gl's BinSorter puts data in point.source
    this.getPointData = pt => pt.source;

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
      'enableElevationZoomFactor'
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

  getHoverData(object) {
    // return aggregated object
    return object;
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
      : // default scale options for point count
        DEFAULT_AGGREGATION[channelScaleType][aggregationType];
  }

  /**
   * Aggregation layer handles visual channel aggregation inside deck.gl layer
   */
  updateLayerDomain(): AggregationLayer {
    return this;
  }

  updateLayerMeta(dataContainer, getPosition) {
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

    const aggregatePoints = getValueAggrFunc(this.getPointData);
    const getColorValue = aggregatePoints(
      this.config.colorField,
      this.config.visConfig.colorAggregation
    );

    const getElevationValue = aggregatePoints(
      this.config.sizeField,
      this.config.visConfig.sizeAggregation
    );
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

    const {data} = this.updateData(datasets, oldLayerData);

    return {
      data,
      getPosition,
      _filterData: filterData,
      // @ts-expect-error
      ...(getColorValue ? {getColorValue} : {}),
      // @ts-expect-error
      ...(getElevationValue ? {getElevationValue} : {})
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
        colorAggregation: this.config.visConfig.colorAggregation
      },
      getElevationValue: {
        sizeField: this.config.sizeField,
        sizeAggregation: this.config.visConfig.sizeAggregation
      },
      _filterData: {
        filterRange: gpuFilter.filterRange,
        ...gpuFilter.filterValueUpdateTriggers
      }
    };

    return {
      ...this.getDefaultDeckLayerProps(opts),
      coverage: visConfig.coverage,

      // color
      colorRange: this.getColorRange(visConfig.colorRange),
      colorScaleType: this.config.colorScale,
      upperPercentile: visConfig.percentile[1],
      lowerPercentile: visConfig.percentile[0],
      colorAggregation: visConfig.colorAggregation,

      // elevation
      extruded: visConfig.enable3d,
      elevationScale: visConfig.elevationScale * eleZoomFactor,
      elevationScaleType: this.config.sizeScale,
      elevationRange: visConfig.sizeRange,
      elevationLowerPercentile: visConfig.elevationPercentile[0],
      elevationUpperPercentile: visConfig.elevationPercentile[1],

      // updateTriggers
      updateTriggers,

      // callbacks
      onSetColorDomain: layerCallbacks.onSetLayerDomain
    };
  }
}
