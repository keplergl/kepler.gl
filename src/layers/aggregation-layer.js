// Copyright (c) 2019 Uber Technologies, Inc.
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
import {CHANNEL_SCALES, FIELD_OPTS, DEFAULT_AGGREGATION} from 'constants/default-settings';

export const pointPosAccessor = ({lat, lng}) => d => [
  d[lng.fieldIdx],
  d[lat.fieldIdx]
];

export const pointPosResolver = ({lat, lng}) =>
  `${lat.fieldIdx}-${lng.fieldIdx}`;

export const getValueAggr = (field, aggregation) => points =>
  aggregate(points.map(p => p[field.tableFieldIndex - 1]), aggregation);

const aggrResolver = (field, aggregation) => `${field.name}-${aggregation}`;

const getLayerColorRange = colorRange => colorRange.colors.map(hexToRgb);

export const aggregateRequiredColumns = ['lat', 'lng'];

export default class AggregationLayer extends Layer {
  constructor(props) {
    super(props);

    this.getPosition = memoize(pointPosAccessor, pointPosResolver);
    this.getColorValue = memoize(getValueAggr, aggrResolver);
    this.getColorRange = memoize(getLayerColorRange);
    this.getElevationValue = memoize(getValueAggr, aggrResolver);
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
      'colorScale',
      'colorDomain',
      'sizeRange',
      'sizeScale',
      'sizeDomain',
      'percentile',
      'coverage',
      'elevationPercentile',
      'elevationScale'
    ];
  }

  get visualChannels() {
    return {
      color: {
        aggregation: 'colorAggregation',
        channelScaleType: CHANNEL_SCALES.colorAggr,
        defaultMeasure: 'Point Count',
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
        defaultMeasure: 'Point Count',
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
    return {
      label: this.visConfigSettings[range].label,
      measure: this.config[field]
        ? `${this.config.visConfig[aggregation]} of ${this.config[field].name}`
        : defaultMeasure
    }
  }

  getHoverData(object) {
    // return aggregated object
    return object;
  }

  /**
   * Aggregation layer handles visual channel aggregation inside deck.gl layer
   */
  updateLayerVisualChannel({data, allData}, channel) {
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
      this.config[field] ? FIELD_OPTS[this.config[field].type].scale[channelScaleType] :
        DEFAULT_AGGREGATION[channelScaleType])
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
    return this.config[field] ?
      // scale options based on aggregation
      FIELD_OPTS[this.config[field].type].scale[channelScaleType][aggregationType] :
      // default scale options for point count
      DEFAULT_AGGREGATION[channelScaleType][aggregationType];
  }

  /**
   * Aggregation layer handles visual channel aggregation inside deck.gl layer
   */
  updateLayerDomain(dataset, newFilter) {
    return this;
  }

  updateLayerMeta(allData, getPosition) {
    // get bounds from points
    const bounds = this.getPointsBounds(allData, getPosition);

    // get lightSettings from points
    const lightSettings = this.getLightSettingsFromBounds(bounds);

    this.updateMeta({bounds, lightSettings});
  }

  formatLayerData(datasets, oldLayerData, opt = {}) {
    const getPosition = this.getPosition(this.config.columns);
    const {filteredIndex, allData} = datasets[this.config.dataId];

    if (!oldLayerData || oldLayerData.getPosition !== getPosition) {
      this.updateLayerMeta(allData, getPosition);
    }

    const getColorValue = this.config.colorField
      ? this.getColorValue(
          this.config.colorField,
          this.config.visConfig.colorAggregation
        )
      : undefined;

    const getElevationValue = this.config.sizeField
      ? this.getElevationValue(
          this.config.sizeField,
          this.config.visConfig.sizeAggregation
        )
      : undefined;

    let data;
    if (
      oldLayerData &&
      oldLayerData.data &&
      opt.sameData &&
      oldLayerData.getPosition === getPosition
    ) {
      data = oldLayerData.data;
    } else {
      data = filteredIndex.map(i => allData[i]);
    }

    return {
      data,
      getPosition,
      ...(getColorValue ? {getColorValue} : {}),
      ...(getElevationValue ? {getElevationValue} : {})
    };
  }
}
