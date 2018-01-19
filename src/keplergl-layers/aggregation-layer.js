import memoize from 'lodash.memoize';
import Layer from './base-layer';
import {hexToRgb} from '../utils/color-utils';
import {aggregate} from '../utils/aggregate-utils';
import {CHANNEL_SCALES, FIELD_OPTS} from '../constants/default-settings';

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
        property: 'color',
        field: 'colorField',
        scale: 'colorScale',
        domain: 'colorDomain',
        range: 'colorRange',
        key: 'color',
        channelScaleType: CHANNEL_SCALES.colorAggr,
        defaultMeasure: 'Point Count'
      },
      size: {
        property: 'height',
        field: 'sizeField',
        scale: 'sizeScale',
        domain: 'sizeDomain',
        range: 'sizeRange',
        key: 'size',
        channelScaleType: CHANNEL_SCALES.sizeAggr,
        defaultMeasure: 'Point Count',
        condition: config => config.visConfig.enable3d
      }
    };
  }

  getHoverData(object) {
    // return aggregated object
    return object;
  }

  /**
   * Aggregation layer handles visual channel aggregation inside deck.gl layer
   */
  updateLayerVisualChannel({data, allData}, channel) {
    const visualChannel = this.visualChannels[channel];
    const {field, scale, channelScaleType} = visualChannel;

    if (this.config[field]) {
      // if field is selected, check if current selected scale is
      // supported, if not, update to default
      const scaleOptions =
        FIELD_OPTS[this.config[field].type].scale[channelScaleType];
      if (!scaleOptions.includes(this.config[scale])) {
        this.updateLayerConfig({[scale]: scaleOptions[0]});
      }
    }
  }

  /**
   * Aggregation layer handles visual channel aggregation inside deck.gl layer
   */
  updateLayerDomain({data, allData}) {
    return this;
  }

  updateLayerMeta(allData, getPosition) {
    // get bounds from points
    const bounds = this.getPointsBounds(allData, getPosition);

    // get lightSettings from points
    const lightSettings = this.getLightSettingsFromBounds(bounds);

    this.updateMeta({bounds, lightSettings});
  }

  formatLayerData(_, allData, filteredIndex, oldLayerData, opt = {}) {
    const getPosition = this.getPosition(this.config.columns);

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
