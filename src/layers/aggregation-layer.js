// Copyright (c) 2021 Uber Technologies, Inc.
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

import memoize from 'lodash.memoize';
import Layer from './base-layer';
import {hexToRgb} from 'utils/color-utils';
import {aggregate} from 'utils/aggregate-utils';
import {
  HIGHLIGH_COLOR_3D,
  CHANNEL_SCALES,
  FIELD_OPTS,
  DEFAULT_AGGREGATION
} from 'constants/default-settings';

export const pointPosAccessor = ({lat, lng}) => dc => d => [
  dc.valueAt(d.index, lng.fieldIdx),
  dc.valueAt(d.index, lat.fieldIdx)
];

export const pointPosResolver = ({lat, lng}) => `${lat.fieldIdx}-${lng.fieldIdx}`;

export const getValueAggrFunc = (field, aggregation) => {
  return points => {
    return field
      ? aggregate(
          points.map(p => {
            return field.valueAccessor(p);
          }),
          aggregation
        )
      : points.length;
  };
};

export const getFilterDataFunc = (filterRange, getFilterValue) => pt =>
  getFilterValue(pt).every((val, i) => val >= filterRange[i][0] && val <= filterRange[i][1]);

const getLayerColorRange = colorRange => colorRange.colors.map(hexToRgb);

export const aggregateRequiredColumns = ['lat', 'lng'];

export default class AggregationLayer extends Layer {
  constructor(props) {
    super(props);

    this.getPositionAccessor = dataContainer =>
      pointPosAccessor(this.config.columns)(dataContainer);
    this.getColorRange = memoize(getLayerColorRange);
  }

  get isAggregated() {
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

  get visualChannels() {
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
   * @returns {{label: string, measure: (string|string)}}
   */
  getVisualChannelDescription(key) {
    // e.g. label: Color, measure: Average of ETA
    const {range, field, defaultMeasure, aggregation} = this.visualChannels[key];
    const fieldConfig = this.config[field];
    return {
      label: this.visConfigSettings[range].label,
      measure: fieldConfig
        ? `${this.config.visConfig[aggregation]} of ${fieldConfig.displayName || fieldConfig.name}`
        : defaultMeasure
    };
  }

  getHoverData(object) {
    // return aggregated object
    return object;
  }

  /**
   * Aggregation layer handles visual channel aggregation inside deck.gl layer
   */
  updateLayerVisualChannel({data, dataContainer}, channel) {
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
   * @param {string} channel
   * @returns {string[]}
   */
  getScaleOptions(channel) {
    const visualChannel = this.visualChannels[channel];
    const {field, aggregation, channelScaleType} = visualChannel;
    const aggregationType = this.config.visConfig[aggregation];
    return this.config[field]
      ? // scale options based on aggregation
        FIELD_OPTS[this.config[field].type].scale[channelScaleType][aggregationType]
      : // default scale options for point count
        DEFAULT_AGGREGATION[channelScaleType][aggregationType];
  }

  /**
   * Aggregation layer handles visual channel aggregation inside deck.gl layer
   */
  updateLayerDomain(datasets, newFilter) {
    return this;
  }

  updateLayerMeta(dataContainer, getPosition) {
    // get bounds from points
    const bounds = this.getPointsBounds(dataContainer, getPosition);

    this.updateMeta({bounds});
  }

  calculateDataAttribute({dataContainer, filteredIndex}, getPosition) {
    const data = [];

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

  formatLayerData(datasets, oldLayerData) {
    const {gpuFilter, dataContainer} = datasets[this.config.dataId];
    const getPosition = this.getPositionAccessor(dataContainer);

    const getColorValue = getValueAggrFunc(
      this.config.colorField,
      this.config.visConfig.colorAggregation
    );

    const getElevationValue = getValueAggrFunc(
      this.config.sizeField,
      this.config.visConfig.sizeAggregation
    );
    const hasFilter = Object.values(gpuFilter.filterRange).some(arr => arr.some(v => v !== 0));

    const getFilterValue = gpuFilter.filterValueAccessor(dataContainer)();
    const filterData = hasFilter
      ? getFilterDataFunc(gpuFilter.filterRange, getFilterValue)
      : undefined;

    const {data} = this.updateData(datasets, oldLayerData);

    return {
      data,
      getPosition,
      _filterData: filterData,
      ...(getColorValue ? {getColorValue} : {}),
      ...(getElevationValue ? {getElevationValue} : {})
    };
  }

  getDefaultDeckLayerProps(opts) {
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
