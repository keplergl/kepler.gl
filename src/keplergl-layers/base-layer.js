// Copyright (c) 2018 Uber Technologies, Inc.
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

import {hexToRgb} from 'utils/color-utils';
import {console as Console} from 'global/window';
import keymirror from 'keymirror';
import DefaultLayerIcon from './default-layer-icon';

import {
  ALL_FIELD_TYPES,
  DEFAULT_LIGHT_SETTINGS,
  NO_VALUE_COLOR,
  SCALE_TYPES,
  CHANNEL_SCALES,
  FIELD_OPTS,
  SCALE_FUNC
} from 'constants/default-settings';
import {DataVizColors} from 'constants/custom-color-ranges';
import {LAYER_VIS_CONFIGS} from './layer-factory';

import {
  generateHashId,
  notNullorUndefined,
  isPlainObject
} from 'utils/utils';

import {
  getSampleData,
  getLatLngBounds,
  maybeToDate,
  getSortingFunction
} from 'utils/data-utils';

import {
  getQuantileDomain,
  getOrdinalDomain,
  getLinearDomain
} from 'utils/data-scale-utils';

/**
 * Approx. number of points to sample in a large data set
 * @type {number}
 */
const MAX_SAMPLE_SIZE = 5000;

export const OVERLAY_TYPE = keymirror({
  deckgl: null,
  mapboxgl: null
});

const layerColors = Object.values(DataVizColors).map(hexToRgb);
function* generateColor() {
  let index = 0;
  while (index < layerColors.length + 1) {
    if (index === layerColors.length) {
      index = 0;
    }
    yield layerColors[index++];
  }
}

const colorMaker = generateColor();
const defaultGetFieldValue = (field, d) => d[field.tableFieldIndex - 1];

export function getDefaultLayerConfig(props = {}) {
  return {
    dataId: props.dataId || null,
    label: props.label || 'new layer',
    color: props.color || colorMaker.next().value,
    columns: props.columns || null,
    isVisible: props.isVisible || false,
    isConfigActive: props.isConfigActive || false,
    highlightColor: props.highlightColor || [252, 242, 26],

    // TODO: refactor this into seperate visual Channel config
    // color by field, domain is set by filters, field, scale type
    colorField: null,
    colorDomain: [0, 1],
    colorScale: 'quantile',

    // color by size, domain is set by filters, field, scale type
    sizeDomain: [0, 1],
    sizeScale: 'linear',
    sizeField: null,

    visConfig: {}
  };
}

export default class Layer {
  constructor(props = {}) {
    this.id = props.id || generateHashId(6);

    this.config = getDefaultLayerConfig({
      columns: this.getLayerColumns(),
      ...props
    });

    // meta
    this.meta = {};

    // visConfigSettings
    this.visConfigSettings = {};
  }

  get layerIcon() {
    return DefaultLayerIcon;
  }

  get overlayType() {
    return OVERLAY_TYPE.deckgl;
  }

  get type() {
    return null;
  }

  get name() {
    return this.type;
  }

  get isAggregated() {
    return false;
  }

  get requiredLayerColumns() {
    return [];
  }

  get optionalColumns() {
    return [];
  }

  get noneLayerDataAffectingProps() {
    return ['label', 'opacity', 'thickness', 'isVisible'];
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
        channelScaleType: CHANNEL_SCALES.color
      },
      size: {
        property: 'size',
        field: 'sizeField',
        scale: 'sizeScale',
        domain: 'sizeDomain',
        range: 'sizeRange',
        key: 'size',
        channelScaleType: CHANNEL_SCALES.size
      }
    };
  }

  /*
   * Column pairs maps layer column to a specific field pairs,
   * By default, it is set to null
   */
  get columnPairs() {
    return null;
  }

  /*
   * Default point column pairs, can be used for point based layers: point, icon etc.
   */
  get defaultPointColumnPairs() {
    return {
      lat: {pair: 'lng', fieldPairKey: 'lat'},
      lng: {pair: 'lat', fieldPairKey: 'lng'}
    };
  }

  /*
   * Default link column pairs, can be used for link based layers: arc, line etc
   */
  get defaultLinkColumnPairs() {
    return {
      lat0: {pair: 'lng0', fieldPairKey: 'lat'},
      lng0: {pair: 'lat0', fieldPairKey: 'lng'},
      lat1: {pair: 'lng1', fieldPairKey: 'lat'},
      lng1: {pair: 'lat1', fieldPairKey: 'lng'}
    };
  }

  /**
   * Assign a field to layer column, return column config
   * @param key - Column Key
   * @param field - Selected field
   * @returns {{}} - Column config
   */
  assignColumn(key, field) {
    return {
      ...this.config.columns,
      [key]: {
        ...this.config.columns[key],
        value: field.name,
        fieldIdx: field.tableFieldIndex - 1
      }
    };
  }

  /**
   * Assign a field pair to column config, return column config
   * @param key - Column Key
   * @param pair - field Pair
   * @returns {{}} - Column config
   */
  assignColumnPairs(key, pair) {
    if (!this.columnPairs || !this.columnPairs[key]) {
      // should not end in this state
      return this.config.columns;
    }

    const {pair: partnerKey, fieldPairKey} = this.columnPairs[key];
    const {fieldPairKey: partnerFieldPairKey} = this.columnPairs[partnerKey];

    return {
      ...this.config.columns,
      [key]: pair[fieldPairKey],
      [partnerKey]: pair[partnerFieldPairKey]
    };
  }

  getZoomFactor(zoom) {
    return Math.pow(2, Math.max(14 - zoom, 0));
  }

  getElevationZoomFactor(zoom) {
    return Math.pow(2, Math.max(8 - zoom, 0));
  }

  formatLayerData(data, allData, filteredIndex) {
    return {};
  }

  renderLayer() {
    return [];
  }

  getHoverData(object) {
    if (!object) {
      return null;
    }
    // by default, each entry of layerData should have a data property points
    // to the original item in the allData array
    // each layer can implement its own getHoverData method
    return object.data;
  }

  // Recursively copy config over to an empty layer
  // when received saved config, or copy config over from a different layer type
  // make sure to only copy over value to existing keys
  assignConfigToLayer(oldConfig, newConfig) {
    // TODO: have a better way to copy over dimension config range
    // e.g. hexagon height sizeRange -> point radius sizeRange
    // don't deep merge visualChannel field
    const notToDeepMerge = Object.values(this.visualChannels).map(v => v.field);

    // don't deep merge color range, reversed: is not a key by default
    notToDeepMerge.push('colorRange');

    // don't copy over domain
    const notToCopy = Object.values(this.visualChannels).map(v => v.domain);
    const copied = {};

    Object.keys(oldConfig).forEach(key => {
      if (
        isPlainObject(oldConfig[key]) &&
        isPlainObject(newConfig[key]) &&
        !notToDeepMerge.includes(key) &&
        !notToCopy.includes(key)
      ) {
        // recursively assign object value
        copied[key] = this.assignConfigToLayer(oldConfig[key], newConfig[key]);
      } else if (
        notNullorUndefined(newConfig[key]) &&
        !notToCopy.includes(key)
      ) {
        copied[key] = newConfig[key];
      } else {
        copied[key] = oldConfig[key];
      }
    });

    return copied;
  }

  registerVisConfig(layerVisConfigs) {
    Object.keys(layerVisConfigs).forEach(item => {
      if (
        typeof item === 'string' &&
        LAYER_VIS_CONFIGS[layerVisConfigs[item]]
      ) {
        // if assigned one of default LAYER_CONFIGS
        this.config.visConfig[item] =
          LAYER_VIS_CONFIGS[layerVisConfigs[item]].defaultValue;
        this.visConfigSettings[item] = LAYER_VIS_CONFIGS[layerVisConfigs[item]];
      } else if (
        ['type', 'defaultValue'].every(p => layerVisConfigs[item][p])
      ) {
        // if provided customized visConfig, and has type && defaultValue
        // TODO: further check if customized visConfig is valid
        this.config.visConfig[item] = layerVisConfigs[item].defaultValue;
        this.visConfigSettings[item] = layerVisConfigs[item];
      }
    });
  }

  getLayerColumns() {
    const required = this.requiredLayerColumns.reduce(
      (accu, key) => ({
        ...accu,
        [key]: {value: null, fieldIdx: -1}
      }),
      {}
    );
    const optional = this.optionalColumns.reduce(
      (accu, key) => ({
        ...accu,
        [key]: {value: null, fieldIdx: -1, optional: true}
      }),
      {}
    );

    return {...required, ...optional};
  }

  updateLayerConfig(newConfig) {
    this.config = {...this.config, ...newConfig};
    return this;
  }

  updateLayerVisConfig(newVisConfig) {
    this.config.visConfig = {...this.config.visConfig, ...newVisConfig};
    return this;
  }
  /**
   * Check whether layer has all columns
   *
   * @param {object} layer
   * @returns {boolean} yes or no
   */
  hasAllColumns() {
    const {columns} = this.config;
    return (
      columns &&
      Object.values(columns).every(v => {
        return Boolean(v.optional || (v.value && v.fieldIdx > -1));
      })
    );
  }

  /**
   * Check whether layer has data
   *
   * @param {object} layer
   * @param {Array | Object} layerData
   * @returns {boolean} yes or no
   */
  hasLayerData(layerData) {
    if (!layerData) {
      return false;
    }

    return Boolean(layerData.data && layerData.data.length);
  }

  isValidToSave() {
    return this.type && this.hasAllColumns();
  }

  shouldRenderLayer(data) {
    return (
      this.type &&
      this.hasAllColumns() &&
      this.config.isVisible &&
      this.hasLayerData(data)
    );
  }

  getVisChannelScale(scale, domain, range, fixed) {
    return SCALE_FUNC[fixed ? 'linear' : scale]()
      .domain(domain)
      .range(fixed ? domain : range);
  }

  getPointsBounds(allData, getPosition) {
    // no need to loop through the entire dataset
    // get a sample of data to calculate bounds
    const sampleData =
      allData.length > MAX_SAMPLE_SIZE
        ? getSampleData(allData, MAX_SAMPLE_SIZE)
        : allData;
    const points = sampleData.map(getPosition);

    const latBounds = getLatLngBounds(points, 1, [-90, 90]);
    const lngBounds = getLatLngBounds(points, 0, [-180, 180]);

    if (!latBounds || !lngBounds) {
      return null;
    }

    return [lngBounds[0], latBounds[0], lngBounds[1], latBounds[1]];
  }

  getLightSettingsFromBounds(bounds) {
    return Array.isArray(bounds) && bounds.length >= 4
      ? {
          ...DEFAULT_LIGHT_SETTINGS,
          lightsPosition: [
            ...bounds.slice(0, 2),
            DEFAULT_LIGHT_SETTINGS.lightsPosition[2],
            ...bounds.slice(2, 4),
            DEFAULT_LIGHT_SETTINGS.lightsPosition[5]
          ]
        }
      : DEFAULT_LIGHT_SETTINGS;
  }

  getEncodedChannelValue(
    scale,
    data,
    field,
    defaultValue = NO_VALUE_COLOR,
    getValue = defaultGetFieldValue
  ) {
    const {type} = field;
    const value = getValue(field, data);
    let attributeValue;
    if (type === ALL_FIELD_TYPES.timestamp) {
      // shouldn't need to convert here
      // scale Function should take care of it
      attributeValue = scale(new Date(value));
    } else {
      attributeValue = scale(value);
    }

    if (!attributeValue) {
      attributeValue = defaultValue;
    }

    return attributeValue;
  }

  updateMeta(meta) {
    this.meta = {...this.meta, ...meta};
  }

  /**
   * helper function to update one layer domain when state.data changed
   *
   * @param {Object[]} data
   * @param {Object[]} allData
   * @param {object} layer
   * @returns {object} layer
   */
  updateLayerDomain({data, allData}) {
    Object.values(this.visualChannels).forEach(channel => {
      const {domain} = channel;
      const updatedDomain = this.calculateLayerDomain({data, allData}, channel);

      this.updateLayerConfig({[domain]: updatedDomain});
    });

    return this;
  }

  updateLayerVisualChannel({data, allData}, channel) {
    const visualChannel = this.visualChannels[channel];
    const {field, scale, domain, channelScaleType} = visualChannel;

    if (this.config[field]) {
      // if field is selected, check if current selected scale is
      // supported, if not, update to default
      const scaleOptions =
        FIELD_OPTS[this.config[field].type].scale[channelScaleType];
      if (!scaleOptions.includes(this.config[scale])) {
        this.updateLayerConfig({[scale]: scaleOptions[0]});
      }
    }

    // calculate layer channel domain
    const updatedDomain = this.calculateLayerDomain(
      {data, allData},
      visualChannel
    );

    this.updateLayerConfig({[domain]: updatedDomain});
  }

  calculateLayerDomain({data, allData}, visualChannel) {
    const defaultDomain = [0, 1];
    const {scale} = visualChannel;
    const scaleType = this.config[scale];

    const field = this.config[visualChannel.field];
    if (!field) {
      // if colorField or sizeField were set back to null
      return defaultDomain;
    }

    if (!SCALE_TYPES[scaleType]) {
      Console.error(`scale type ${scaleType} not supported`);
      return defaultDomain;
    }

    // TODO: refactor to add valueAccessor to field
    const fieldIdx = field.tableFieldIndex - 1;
    const isTime = field.type === ALL_FIELD_TYPES.timestamp;
    const valueAccessor = maybeToDate.bind(
      null,
      isTime,
      fieldIdx,
      field.format
    );
    const sortFunction = getSortingFunction(field.type);

    switch (scaleType) {
      case SCALE_TYPES.ordinal:
      case SCALE_TYPES.point:
        // do not recalculate ordinal domain based on filterred data
        return getOrdinalDomain(allData, valueAccessor);

      case SCALE_TYPES.quantile:
        return getQuantileDomain(data, valueAccessor, sortFunction);

      case SCALE_TYPES.quantize:
      case SCALE_TYPES.linear:
      case SCALE_TYPES.sqrt:
      default:
        return getLinearDomain(data, valueAccessor);
    }
  }

  isLayerHovered(objectInfo) {
    return (
      objectInfo &&
      objectInfo.layer &&
      objectInfo.picked &&
      objectInfo.layer.props.id === this.id
    );
  }

  getRadiusScaleByZoom(zoom, fixedRadius) {
    const radiusChannel = Object.values(this.visualChannels).find(
      vc => vc.property === 'radius'
    );

    if (!radiusChannel) {
      return 1;
    }

    const field = radiusChannel.field;
    const fixed =
      fixedRadius === undefined
        ? this.config.visConfig.fixedRadius
        : fixedRadius;
    const {radius} = this.config.visConfig;

    return fixed
      ? 1
      : (this.config[field] ? 1 : radius) * this.getZoomFactor(zoom);
  }

  shouldCalculateLayerData(props) {
    return props.some(p => !this.noneLayerDataAffectingProps.includes(p));
  }
}
