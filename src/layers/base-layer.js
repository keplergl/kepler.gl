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
  SCALE_FUNC,
  CHANNEL_SCALE_SUPPORTED_FIELDS
} from 'constants/default-settings';
import {DataVizColors} from 'constants/custom-color-ranges';
import {LAYER_VIS_CONFIGS} from './layer-factory';

import {generateHashId, notNullorUndefined, isPlainObject} from 'utils/utils';

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

export default class Layer {
  constructor(props = {}) {
    this.id = props.id || generateHashId(6);

    // meta
    this.meta = {};

    // visConfigSettings
    this.visConfigSettings = {};

    this.config = this.getDefaultLayerConfig({
      columns: this.getLayerColumns(),
      ...props
    });
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
   * Return a React component for to render layer instructions in a modal
   * @returns {object} - an object
   * @example
   *  return {
   *    id: 'iconInfo',
   *    template: IconInfoModal,
   *    modalProps: {
   *      title: 'How to draw icons'
   *   };
   * }
   */
  get layerInfoModal() {
    return null;
  }
  /*
   * Given a dataset, automatically create layers based on it
   * and return the props
   * By default, no layers will be found
   */
  static findDefaultLayerProps(fieldPairs, dataId) {
    return null;
  }

  /**
   * Given a array of preset required column names
   * found field that has the same name to set as layer column
   *
   * @param {object[]} defaultFields
   * @param {object[]} allFields
   * @returns {object[] | null} all possible required layer column pairs
   */
  static findDefaultColumnField(defaultFields, allFields) {
    // find all matched fields for each required col
    const requiredColumns = Object.keys(defaultFields).reduce((prev, key) => {
      const requiredFields = allFields.filter(
        f => f.name === defaultFields[key] || defaultFields[key].includes(f.name)
      );

      prev[key] = requiredFields.length
        ? requiredFields.map(f => ({
          value: f.name,
          fieldIdx: f.tableFieldIndex - 1
        }))
        : null;
      return prev;
    }, {});

    if (!Object.values(requiredColumns).every(Boolean)) {
      // if any field missing, return null
      return null;
    }

    return this.getAllPossibleColumnParis(requiredColumns);
  }

  static getAllPossibleColumnParis(requiredColumns) {
    // for multiple matched field for one required column, return multiple
    // combinations, e. g. if column a has 2 matched, column b has 3 matched
    // 6 possible column pairs will be returned
    const allKeys = Object.keys(requiredColumns);
    const pointers = allKeys.map((k, i) => (i === allKeys.length - 1 ? -1 : 0));
    const countPerKey = allKeys.map(k => requiredColumns[k].length);
    const pairs = [];

    /* eslint-disable no-loop-func */
    while (incrementPointers(pointers, countPerKey, pointers.length - 1)) {
      const newPair = pointers.reduce((prev, cuur, i) => {
        prev[allKeys[i]] = requiredColumns[allKeys[i]][cuur];
        return prev;
      }, {});

      pairs.push(newPair);
    }
    /* eslint-enable no-loop-func */

    // recursively increment pointers
    function incrementPointers(pts, counts, index) {
      if (index === 0 && pts[0] === counts[0] - 1) {
        // nothing to increment
        return false;
      }

      if (pts[index] + 1 < counts[index]) {
        pts[index] = pts[index] + 1;
        return true;
      }

      pts[index] = 0;
      return incrementPointers(pts, counts, index - 1);
    }

    return pairs;
  }

  static hexToRgb(c) {
    return hexToRgb(c);
  }

  getDefaultLayerConfig(props = {}) {
    return {
      dataId: props.dataId || null,
      label: props.label || 'new layer',
      color: props.color || colorMaker.next().value,
      columns: props.columns || null,
      isVisible: props.isVisible || false,
      isConfigActive: props.isConfigActive || false,
      highlightColor: props.highlightColor || [252, 242, 26, 255],

      // TODO: refactor this into separate visual Channel config
      // color by field, domain is set by filters, field, scale type
      colorField: null,
      colorDomain: [0, 1],
      colorScale: 'quantile',

      // color by size, domain is set by filters, field, scale type
      sizeDomain: [0, 1],
      sizeScale: 'linear',
      sizeField: null,

      visConfig: {},

      textLabel: {
        field: null,
        color: [255, 255, 255],
        size: 50,
        offset: [0, 0],
        anchor: 'middle'
      }
    };
  }

  /**
   * Get the description of a visualChannel config
   * @param key
   * @returns {{label: string, measure: (string|string)}}
   */
  getVisualChannelDescription(key) {
    // e.g. label: Color, measure: Vehicle Type
    return {
      label: this.visConfigSettings[this.visualChannels[key].range].label,
      measure: this.config[this.visualChannels[key].field]
        ? this.config[this.visualChannels[key].field].name
        : this.visualChannels[key].defaultMeasure
    }
  }

  /**
   * Assign a field to layer column, return column config
   * @param key - Column Key
   * @param field - Selected field
   * @returns {{}} - Column config
   */
  assignColumn(key, field) {
    // field value could be null for optional columns
    const update = field
      ? {
          value: field.name,
          fieldIdx: field.tableFieldIndex - 1
        }
      : {value: null, fieldIdx: -1};

    return {
      ...this.config.columns,
      [key]: {
        ...this.config.columns[key],
        ...update
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

	/**
   * Calculate a radius zoom multiplier to render points, so they are visible in all zoom level
   * @param mapState
   * @param mapState.zoom - actual zoom
   * @param mapState.zoomOffset - zoomOffset when render in the plot container for export image
   * @returns {number}
   */
  getZoomFactor({zoom, zoomOffset = 0}) {
    return Math.pow(2, Math.max(14 - zoom + zoomOffset, 0));
  }

	/**
   * Calculate a elevation zoom multiplier to render points, so they are visible in all zoom level
   * @param mapState
   * @param mapState.zoom - actual zoom
   * @param mapState.zoomOffset - zoomOffset when render in the plot container for export image
   * @returns {number}
   */
  getElevationZoomFactor({zoom, zoomOffset = 0}) {
    return Math.pow(2, Math.max(8 - zoom + zoomOffset, 0));
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

  /**
   * When change layer type, try to copy over layer configs as much as possible
   * @param configToCopy - config to copy over
   * @param visConfigSettings - visConfig settings of config to copy
   */
  assignConfigToLayer(configToCopy, visConfigSettings) {
    // don't deep merge visualChannel field
    const notToDeepMerge = Object.values(this.visualChannels).map(v => v.field);

    // don't deep merge color range, reversed: is not a key by default
    notToDeepMerge.push('colorRange');

    // don't copy over domain
    const notToCopy = Object.values(this.visualChannels).map(v => v.domain);

    // if range is for the same property group copy it, otherwise, not to copy
    Object.values(this.visualChannels).forEach(v => {
      if (configToCopy.visConfig[v.range] && visConfigSettings[v.range].group !== this.visConfigSettings[v.range].group) {
        notToCopy.push(v.range);
      }
    });

    // don't copy over visualChannel range
    const currentConfig = this.config;
    const copied = this.copyLayerConfig(currentConfig, configToCopy, {notToDeepMerge, notToCopy});

    this.updateLayerConfig(copied);
    // validate visualChannel field type and scale types
    Object.keys(this.visualChannels).forEach(channel => {
      this.validateVisualChannel(channel);
    });
  }

  /*
   * Recursively copy config over to an empty layer
   * when received saved config, or copy config over from a different layer type
   * make sure to only copy over value to existing keys
   * @param {object} currentConfig - existing config to be override
   * @param {object} configToCopy - new Config to copy over
   * @param {string[]} notToDeepMerge - array of properties to not to be deep copied
   * @param {string[]} notToCopy - array of properties not to copy
   * @returns {object} - copied config
   */
  copyLayerConfig(currentConfig, configToCopy, {notToDeepMerge = [], notToCopy = []} = {}) {
    const copied = {};
    Object.keys(currentConfig).forEach(key => {
      if (
        isPlainObject(currentConfig[key]) &&
        isPlainObject(configToCopy[key]) &&
        !notToDeepMerge.includes(key) &&
        !notToCopy.includes(key)
      ) {
        // recursively assign object value
        copied[key] = this.copyLayerConfig(currentConfig[key], configToCopy[key], {notToDeepMerge, notToCopy});
      } else if (
        notNullorUndefined(configToCopy[key]) &&
        !notToCopy.includes(key)
      ) {
        // copy
        copied[key] = configToCopy[key];
      } else {
        // keep existing
        copied[key] = currentConfig[key];
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
   * if state.data change is due ot update filter, newFiler will be passed
   * called by updateAllLayerDomainData
   * @param {Object} dataset
   * @param {Object} newFilter
   * @returns {object} layer
   */
  updateLayerDomain(dataset, newFilter) {
    Object.values(this.visualChannels).forEach(channel => {
      const {scale} = channel;
      const scaleType = this.config[scale];
      // ordinal domain is based on allData, if only filter changed
      // no need to update ordinal domain
      if (!newFilter || scaleType !== SCALE_TYPES.ordinal) {
        const {domain} = channel;
        const updatedDomain = this.calculateLayerDomain(dataset, channel);

        this.updateLayerConfig({[domain]: updatedDomain});
      }
    });

    return this;
  }

  /**
   * Validate visual channel field and scales based on supported field & scale type
   * @param channel
   */
  validateVisualChannel(channel) {
    this.validateFieldType(channel);
    this.validateScale(channel);
  }

  /**
   * Validate field type based on channelScaleType
   */
  validateFieldType(channel) {
    const visualChannel = this.visualChannels[channel];
    const {field, channelScaleType, supportedFieldTypes} = visualChannel;

    if (this.config[field]) {
      // if field is selected, check if field type is supported
      const channelSupportedFieldTypes = supportedFieldTypes || CHANNEL_SCALE_SUPPORTED_FIELDS[channelScaleType];

      if (!channelSupportedFieldTypes.includes(this.config[field].type)) {
        // field type is not supported, set it back to null
        // set scale back to default
        this.updateLayerConfig({[field]: null});
      }
    }
  }

  /**
   * Validate scale type based on aggregation
   */
  validateScale(channel) {
    const visualChannel = this.visualChannels[channel];
    const {scale} = visualChannel;
    if (!scale) {
      // visualChannel doesn't have scale
      return;
    }
    const scaleOptions = this.getScaleOptions(channel);
    // check if current selected scale is
    // supported, if not, change to default
    if (!scaleOptions.includes(this.config[scale])) {
      this.updateLayerConfig({[scale]: scaleOptions[0]});
    }
  }

  /**
   * Get scale options based on current field
   * @param {string} channel
   * @returns {string[]}
   */
  getScaleOptions(channel) {
    const visualChannel = this.visualChannels[channel];
    const {field, scale, channelScaleType} = visualChannel;

    return this.config[field] ?
      FIELD_OPTS[this.config[field].type].scale[channelScaleType] :
      [this.getDefaultLayerConfig()[scale]];
  }

  updateLayerVisualChannel(dataset, channel) {
    const visualChannel = this.visualChannels[channel];

    this.validateVisualChannel(channel);
      // calculate layer channel domain
    const updatedDomain = this.calculateLayerDomain(dataset, visualChannel);

    this.updateLayerConfig({[visualChannel.domain]: updatedDomain});
  }

  calculateLayerDomain(dataset, visualChannel) {
    const {allData, filteredIndexForDomain} = dataset;
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
    const indexValueAccessor = i => valueAccessor(allData[i]);

    const sortFunction = getSortingFunction(field.type);

    switch (scaleType) {
      case SCALE_TYPES.ordinal:
      case SCALE_TYPES.point:
        // do not recalculate ordinal domain based on filtered data
        // don't need to update ordinal domain every time
        return getOrdinalDomain(allData, valueAccessor);

      case SCALE_TYPES.quantile:
        return getQuantileDomain(filteredIndexForDomain, indexValueAccessor, sortFunction);

      case SCALE_TYPES.quantize:
      case SCALE_TYPES.linear:
      case SCALE_TYPES.sqrt:
      default:
        return getLinearDomain(filteredIndexForDomain, indexValueAccessor);
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

  getRadiusScaleByZoom(mapState, fixedRadius) {
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
      : (this.config[field] ? 1 : radius) * this.getZoomFactor(mapState);
  }

  shouldCalculateLayerData(props) {
    return props.some(p => !this.noneLayerDataAffectingProps.includes(p));
  }
}
