'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends6 = require('babel-runtime/helpers/extends');

var _extends7 = _interopRequireDefault(_extends6);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.getDefaultLayerConfig = getDefaultLayerConfig;

var _colorUtils = require('../utils/color-utils');

var _window = require('global/window');

var _defaultSettings = require('../constants/default-settings');

var _uberVizColors = require('../constants/uber-viz-colors');

var _layerFactory = require('./layer-factory');

var _utils = require('../utils/utils');

var _dataUtils = require('../utils/data-utils');

var _dataScaleUtils = require('../utils/data-scale-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(generateColor);

/**
 * Approx. number of points to sample in a large data set
 * @type {number}
 */
var MAX_SAMPLE_SIZE = 5000;

function generateColor() {
  var index, uberColors;
  return _regenerator2.default.wrap(function generateColor$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          index = 0;
          uberColors = Object.values(_uberVizColors.uberDataVizColors);

        case 2:
          if (!(index < uberColors.length + 1)) {
            _context.next = 8;
            break;
          }

          if (index === uberColors.length) {
            index = 0;
          }
          _context.next = 6;
          return (0, _colorUtils.hexToRgb)(uberColors[index++]);

        case 6:
          _context.next = 2;
          break;

        case 8:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked, this);
}

var colorMaker = generateColor();
var defaultGetFieldValue = function defaultGetFieldValue(field, d) {
  return d[field.tableFieldIndex - 1];
};

function getDefaultLayerConfig() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

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

var Layer = function () {
  function Layer() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Layer);

    this.id = props.id || (0, _utils.generateHashId)(6);

    this.config = getDefaultLayerConfig((0, _extends7.default)({
      columns: this.getLayerColumns()
    }, props));

    // meta
    this.meta = {};

    // visConfigSettings
    this.visConfigSettings = {};
    // layer utility methods
    // this.getLightSettingsFromBounds = getLightSettingsFromBounds;
  }

  (0, _createClass3.default)(Layer, [{
    key: 'assignColumn',


    /**
     * Assign a field to layer column, return column config
     * @param key - Column Key
     * @param field - Selected field
     * @returns {{}} - Column config
     */
    value: function assignColumn(key, field) {
      return (0, _extends7.default)({}, this.config.columns, (0, _defineProperty3.default)({}, key, (0, _extends7.default)({}, this.config.columns[key], {
        value: field.name,
        fieldIdx: field.tableFieldIndex - 1
      })));
    }

    /**
     * Assign a field pair to column config, return column config
     * @param key - Column Key
     * @param pair - field Pair
     * @returns {{}} - Column config
     */

  }, {
    key: 'assignColumnPairs',
    value: function assignColumnPairs(key, pair) {
      var _extends3;

      if (!this.columnPairs || !this.columnPairs[key]) {
        // should not end in this state
        return this.config.columns;
      }

      var _columnPairs$key = this.columnPairs[key],
          partnerKey = _columnPairs$key.pair,
          fieldPairKey = _columnPairs$key.fieldPairKey;
      var partnerFieldPairKey = this.columnPairs[partnerKey].fieldPairKey;


      return (0, _extends7.default)({}, this.config.columns, (_extends3 = {}, (0, _defineProperty3.default)(_extends3, key, pair[fieldPairKey]), (0, _defineProperty3.default)(_extends3, partnerKey, pair[partnerFieldPairKey]), _extends3));
    }
  }, {
    key: 'getZoomFactor',
    value: function getZoomFactor(zoom) {
      return Math.pow(2, Math.max(14 - zoom, 0));
    }
  }, {
    key: 'getElevationZoomFactor',
    value: function getElevationZoomFactor(zoom) {
      return Math.pow(2, Math.max(8 - zoom, 0));
    }
  }, {
    key: 'formatLayerData',
    value: function formatLayerData(data, allData, filteredIndex) {
      return {};
    }
  }, {
    key: 'renderLayer',
    value: function renderLayer() {
      return [];
    }
  }, {
    key: 'getHoverData',
    value: function getHoverData(object) {
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

  }, {
    key: 'assignConfigToLayer',
    value: function assignConfigToLayer(oldConfig, newConfig) {
      var _this = this;

      // TODO: have a better way to copy over dimension config range
      // e.g. hexagon height sizeRange -> point radius sizeRange
      // don't deep merge visualChannel field
      var notToDeepMerge = Object.values(this.visualChannels).map(function (v) {
        return v.field;
      });

      // don't deep merge color range, reversed: is not a key by default
      notToDeepMerge.push('colorRange');

      // don't copy over domain
      var notToCopy = Object.values(this.visualChannels).map(function (v) {
        return v.domain;
      });
      var copied = {};

      Object.keys(oldConfig).forEach(function (key) {
        if ((0, _utils.isPlainObject)(oldConfig[key]) && (0, _utils.isPlainObject)(newConfig[key]) && !notToDeepMerge.includes(key) && !notToCopy.includes(key)) {
          // recursively assign object value
          copied[key] = _this.assignConfigToLayer(oldConfig[key], newConfig[key]);
        } else if ((0, _utils.notNullorUndefined)(newConfig[key]) && !notToCopy.includes(key)) {
          copied[key] = newConfig[key];
        } else {
          copied[key] = oldConfig[key];
        }
      });

      return copied;
    }
  }, {
    key: 'registerVisConfig',
    value: function registerVisConfig(layerVisConfigs) {
      var _this2 = this;

      Object.keys(layerVisConfigs).forEach(function (item) {
        if (typeof item === 'string' && _layerFactory.LAYER_VIS_CONFIGS[layerVisConfigs[item]]) {
          // if assigned one of default LAYER_CONFIGS
          _this2.config.visConfig[item] = _layerFactory.LAYER_VIS_CONFIGS[layerVisConfigs[item]].defaultValue;
          _this2.visConfigSettings[item] = _layerFactory.LAYER_VIS_CONFIGS[layerVisConfigs[item]];
        } else if (['type', 'defaultValue'].every(function (p) {
          return layerVisConfigs[item][p];
        })) {
          // if provided customized visConfig, and has type && defaultValue
          // TODO: further check if customized visConfig is valid
          _this2.config.visConfig[item] = layerVisConfigs[item].defaultValue;
          _this2.visConfigSettings[item] = layerVisConfigs[item];
        }
      });
    }
  }, {
    key: 'getLayerColumns',
    value: function getLayerColumns() {
      var required = this.requiredLayerColumns.reduce(function (accu, key) {
        return (0, _extends7.default)({}, accu, (0, _defineProperty3.default)({}, key, { value: null, fieldIdx: -1 }));
      }, {});
      var optional = this.optionalColumns.reduce(function (accu, key) {
        return (0, _extends7.default)({}, accu, (0, _defineProperty3.default)({}, key, { value: null, fieldIdx: -1, optional: true }));
      }, {});

      return (0, _extends7.default)({}, required, optional);
    }
  }, {
    key: 'updateLayerConfig',
    value: function updateLayerConfig(newConfig) {
      this.config = (0, _extends7.default)({}, this.config, newConfig);
      return this;
    }
  }, {
    key: 'updateLayerVisConfig',
    value: function updateLayerVisConfig(newVisConfig) {
      this.config.visConfig = (0, _extends7.default)({}, this.config.visConfig, newVisConfig);
      return this;
    }
    /**
     * Check whether layer has all columns
     *
     * @param {object} layer
     * @returns {boolean} yes or no
     */

  }, {
    key: 'hasAllColumns',
    value: function hasAllColumns() {
      var columns = this.config.columns;

      return columns && Object.values(columns).every(function (v) {
        return Boolean(v.optional || v.value && v.fieldIdx > -1);
      });
    }

    /**
     * Check whether layer has data
     *
     * @param {object} layer
     * @param {Array | Object} layerData
     * @returns {boolean} yes or no
     */

  }, {
    key: 'hasLayerData',
    value: function hasLayerData(layerData) {
      if (!layerData) {
        return false;
      }

      return Boolean(layerData.data && layerData.data.length);
    }
  }, {
    key: 'isValidToSave',
    value: function isValidToSave() {
      return this.type && this.hasAllColumns();
    }
  }, {
    key: 'shouldRenderLayer',
    value: function shouldRenderLayer(data) {
      return this.type && this.hasAllColumns() && this.config.isVisible && this.hasLayerData(data);
    }
  }, {
    key: 'getVisChannelScale',
    value: function getVisChannelScale(scale, domain, range, fixed) {
      return _defaultSettings.SCALE_FUNC[fixed ? 'linear' : scale]().domain(domain).range(fixed ? domain : range);
    }
  }, {
    key: 'getPointsBounds',
    value: function getPointsBounds(allData, getPosition) {
      // no need to loop through the entire dataset
      // get a sample of data to calculate bounds
      var sampleData = allData.length > MAX_SAMPLE_SIZE ? (0, _dataUtils.getSampleData)(allData, MAX_SAMPLE_SIZE) : allData;
      var points = sampleData.map(getPosition);

      var latBounds = (0, _dataUtils.getLatLngBounds)(points, 1, [-90, 90]);
      var lngBounds = (0, _dataUtils.getLatLngBounds)(points, 0, [-180, 180]);

      if (!latBounds || !lngBounds) {
        return null;
      }

      return [lngBounds[0], latBounds[0], lngBounds[1], latBounds[1]];
    }
  }, {
    key: 'getLightSettingsFromBounds',
    value: function getLightSettingsFromBounds(bounds) {
      return Array.isArray(bounds) && bounds.length >= 4 ? (0, _extends7.default)({}, _defaultSettings.DEFAULT_LIGHT_SETTINGS, {
        lightsPosition: [].concat((0, _toConsumableArray3.default)(bounds.slice(0, 2)), [_defaultSettings.DEFAULT_LIGHT_SETTINGS.lightsPosition[2]], (0, _toConsumableArray3.default)(bounds.slice(2, 4)), [_defaultSettings.DEFAULT_LIGHT_SETTINGS.lightsPosition[5]])
      }) : _defaultSettings.DEFAULT_LIGHT_SETTINGS;
    }
  }, {
    key: 'getEncodedChannelValue',
    value: function getEncodedChannelValue(scale, data, field) {
      var defaultValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _defaultSettings.NO_VALUE_COLOR;
      var getValue = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : defaultGetFieldValue;
      var type = field.type;

      var value = getValue(field, data);
      var attributeValue = void 0;
      if (type === _defaultSettings.ALL_FIELD_TYPES.timestamp) {
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
  }, {
    key: 'updateMeta',
    value: function updateMeta(meta) {
      this.meta = (0, _extends7.default)({}, this.meta, meta);
    }

    /**
     * helper function to update one layer domain when state.data changed
     *
     * @param {Object[]} data
     * @param {Object[]} allData
     * @param {object} layer
     * @returns {object} layer
     */

  }, {
    key: 'updateLayerDomain',
    value: function updateLayerDomain(_ref) {
      var _this3 = this;

      var data = _ref.data,
          allData = _ref.allData;

      Object.values(this.visualChannels).forEach(function (channel) {
        var domain = channel.domain;

        var updatedDomain = _this3.calculateLayerDomain({ data: data, allData: allData }, channel);

        _this3.updateLayerConfig((0, _defineProperty3.default)({}, domain, updatedDomain));
      });

      return this;
    }
  }, {
    key: 'updateLayerVisualChannel',
    value: function updateLayerVisualChannel(_ref2, channel) {
      var data = _ref2.data,
          allData = _ref2.allData;

      var visualChannel = this.visualChannels[channel];
      var field = visualChannel.field,
          scale = visualChannel.scale,
          domain = visualChannel.domain,
          channelScaleType = visualChannel.channelScaleType;


      if (this.config[field]) {
        // if field is selected, check if current selected scale is
        // supported, if not, update to default
        var scaleOptions = _defaultSettings.FIELD_OPTS[this.config[field].type].scale[channelScaleType];
        if (!scaleOptions.includes(this.config[scale])) {
          this.updateLayerConfig((0, _defineProperty3.default)({}, scale, scaleOptions[0]));
        }
      }

      // calculate layer channel domain
      var updatedDomain = this.calculateLayerDomain({ data: data, allData: allData }, visualChannel);

      this.updateLayerConfig((0, _defineProperty3.default)({}, domain, updatedDomain));
    }
  }, {
    key: 'calculateLayerDomain',
    value: function calculateLayerDomain(_ref3, visualChannel) {
      var data = _ref3.data,
          allData = _ref3.allData;

      var defaultDomain = [0, 1];
      var scale = visualChannel.scale;

      var scaleType = this.config[scale];

      var field = this.config[visualChannel.field];
      if (!field) {
        // if colorField or sizeField were set back to null
        return defaultDomain;
      }

      if (!_defaultSettings.SCALE_TYPES[scaleType]) {
        _window.console.error('scale type ' + scaleType + ' not supported');
        return defaultDomain;
      }

      // TODO: refactor to add valueAccessor to field
      var fieldIdx = field.tableFieldIndex - 1;
      var isTime = field.type === _defaultSettings.ALL_FIELD_TYPES.timestamp;
      var valueAccessor = _dataUtils.maybeToDate.bind(null, isTime, fieldIdx, field.format);
      var sortFunction = (0, _dataUtils.getSortingFunction)(field.type);

      switch (scaleType) {
        case _defaultSettings.SCALE_TYPES.ordinal:
        case _defaultSettings.SCALE_TYPES.point:
          // do not recalculate ordinal domain based on filterred data
          return (0, _dataScaleUtils.getOrdinalDomain)(allData, valueAccessor);

        case _defaultSettings.SCALE_TYPES.quantile:
          return (0, _dataScaleUtils.getQuantileDomain)(data, valueAccessor, sortFunction);

        case _defaultSettings.SCALE_TYPES.quantize:
        case _defaultSettings.SCALE_TYPES.linear:
        case _defaultSettings.SCALE_TYPES.sqrt:
        default:
          return (0, _dataScaleUtils.getLinearDomain)(data, valueAccessor);
      }
    }
  }, {
    key: 'isLayerHovered',
    value: function isLayerHovered(objectInfo) {
      return objectInfo && objectInfo.layer && objectInfo.picked && objectInfo.layer.props.id === this.id;
    }
  }, {
    key: 'getRadiusScaleByZoom',
    value: function getRadiusScaleByZoom(zoom, fixedRadius) {
      var radiusChannel = Object.values(this.visualChannels).find(function (vc) {
        return vc.property === 'radius';
      });

      if (!radiusChannel) {
        return 1;
      }

      var field = radiusChannel.field;
      var fixed = fixedRadius === undefined ? this.config.visConfig.fixedRadius : fixedRadius;
      var radius = this.config.visConfig.radius;


      return fixed ? 1 : (this.config[field] ? 1 : radius) * this.getZoomFactor(zoom);
    }
  }, {
    key: 'shouldCalculateLayerData',
    value: function shouldCalculateLayerData(props) {
      var _this4 = this;

      return props.some(function (p) {
        return !_this4.noneLayerDataAffectingProps.includes(p);
      });
    }
  }, {
    key: 'type',
    get: function get() {
      return null;
    }
  }, {
    key: 'isAggregated',
    get: function get() {
      return false;
    }
  }, {
    key: 'requiredLayerColumns',
    get: function get() {
      return [];
    }
  }, {
    key: 'optionalColumns',
    get: function get() {
      return [];
    }
  }, {
    key: 'noneLayerDataAffectingProps',
    get: function get() {
      return ['label', 'opacity', 'thickness', 'isVisible'];
    }
  }, {
    key: 'visualChannels',
    get: function get() {
      return {
        color: {
          property: 'color',
          field: 'colorField',
          scale: 'colorScale',
          domain: 'colorDomain',
          range: 'colorRange',
          key: 'color',
          channelScaleType: _defaultSettings.CHANNEL_SCALES.color
        },
        size: {
          property: 'size',
          field: 'sizeField',
          scale: 'sizeScale',
          domain: 'sizeDomain',
          range: 'sizeRange',
          key: 'size',
          channelScaleType: _defaultSettings.CHANNEL_SCALES.size
        }
      };
    }

    /*
     * Column pairs maps layer column to a specific field pairs,
     * By default, it is set to null
     */

  }, {
    key: 'columnPairs',
    get: function get() {
      return null;
    }

    /*
     * Default point column pairs, can be used for point based layers: point, icon etc.
     */

  }, {
    key: 'defaultPointColumnPairs',
    get: function get() {
      return {
        lat: { pair: 'lng', fieldPairKey: 'lat' },
        lng: { pair: 'lat', fieldPairKey: 'lng' }
      };
    }

    /*
     * Default link column pairs, can be used for link based layers: arc, line etc
     */

  }, {
    key: 'defaultLinkColumnPairs',
    get: function get() {
      return {
        lat0: { pair: 'lng0', fieldPairKey: 'lat' },
        lng0: { pair: 'lat0', fieldPairKey: 'lng' },
        lat1: { pair: 'lng1', fieldPairKey: 'lat' },
        lng1: { pair: 'lat1', fieldPairKey: 'lng' }
      };
    }
  }]);
  return Layer;
}();

exports.default = Layer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvYmFzZS1sYXllci5qcyJdLCJuYW1lcyI6WyJnZXREZWZhdWx0TGF5ZXJDb25maWciLCJnZW5lcmF0ZUNvbG9yIiwiTUFYX1NBTVBMRV9TSVpFIiwiaW5kZXgiLCJ1YmVyQ29sb3JzIiwiT2JqZWN0IiwidmFsdWVzIiwibGVuZ3RoIiwiY29sb3JNYWtlciIsImRlZmF1bHRHZXRGaWVsZFZhbHVlIiwiZmllbGQiLCJkIiwidGFibGVGaWVsZEluZGV4IiwicHJvcHMiLCJkYXRhSWQiLCJsYWJlbCIsImNvbG9yIiwibmV4dCIsInZhbHVlIiwiY29sdW1ucyIsImlzVmlzaWJsZSIsImlzQ29uZmlnQWN0aXZlIiwiaGlnaGxpZ2h0Q29sb3IiLCJjb2xvckZpZWxkIiwiY29sb3JEb21haW4iLCJjb2xvclNjYWxlIiwic2l6ZURvbWFpbiIsInNpemVTY2FsZSIsInNpemVGaWVsZCIsInZpc0NvbmZpZyIsIkxheWVyIiwiaWQiLCJjb25maWciLCJnZXRMYXllckNvbHVtbnMiLCJtZXRhIiwidmlzQ29uZmlnU2V0dGluZ3MiLCJrZXkiLCJuYW1lIiwiZmllbGRJZHgiLCJwYWlyIiwiY29sdW1uUGFpcnMiLCJwYXJ0bmVyS2V5IiwiZmllbGRQYWlyS2V5IiwicGFydG5lckZpZWxkUGFpcktleSIsInpvb20iLCJNYXRoIiwicG93IiwibWF4IiwiZGF0YSIsImFsbERhdGEiLCJmaWx0ZXJlZEluZGV4Iiwib2JqZWN0Iiwib2xkQ29uZmlnIiwibmV3Q29uZmlnIiwibm90VG9EZWVwTWVyZ2UiLCJ2aXN1YWxDaGFubmVscyIsIm1hcCIsInYiLCJwdXNoIiwibm90VG9Db3B5IiwiZG9tYWluIiwiY29waWVkIiwia2V5cyIsImZvckVhY2giLCJpbmNsdWRlcyIsImFzc2lnbkNvbmZpZ1RvTGF5ZXIiLCJsYXllclZpc0NvbmZpZ3MiLCJpdGVtIiwiZGVmYXVsdFZhbHVlIiwiZXZlcnkiLCJwIiwicmVxdWlyZWQiLCJyZXF1aXJlZExheWVyQ29sdW1ucyIsInJlZHVjZSIsImFjY3UiLCJvcHRpb25hbCIsIm9wdGlvbmFsQ29sdW1ucyIsIm5ld1Zpc0NvbmZpZyIsIkJvb2xlYW4iLCJsYXllckRhdGEiLCJ0eXBlIiwiaGFzQWxsQ29sdW1ucyIsImhhc0xheWVyRGF0YSIsInNjYWxlIiwicmFuZ2UiLCJmaXhlZCIsImdldFBvc2l0aW9uIiwic2FtcGxlRGF0YSIsInBvaW50cyIsImxhdEJvdW5kcyIsImxuZ0JvdW5kcyIsImJvdW5kcyIsIkFycmF5IiwiaXNBcnJheSIsImxpZ2h0c1Bvc2l0aW9uIiwic2xpY2UiLCJnZXRWYWx1ZSIsImF0dHJpYnV0ZVZhbHVlIiwidGltZXN0YW1wIiwiRGF0ZSIsImNoYW5uZWwiLCJ1cGRhdGVkRG9tYWluIiwiY2FsY3VsYXRlTGF5ZXJEb21haW4iLCJ1cGRhdGVMYXllckNvbmZpZyIsInZpc3VhbENoYW5uZWwiLCJjaGFubmVsU2NhbGVUeXBlIiwic2NhbGVPcHRpb25zIiwiZGVmYXVsdERvbWFpbiIsInNjYWxlVHlwZSIsImVycm9yIiwiaXNUaW1lIiwidmFsdWVBY2Nlc3NvciIsImJpbmQiLCJmb3JtYXQiLCJzb3J0RnVuY3Rpb24iLCJvcmRpbmFsIiwicG9pbnQiLCJxdWFudGlsZSIsInF1YW50aXplIiwibGluZWFyIiwic3FydCIsIm9iamVjdEluZm8iLCJsYXllciIsInBpY2tlZCIsImZpeGVkUmFkaXVzIiwicmFkaXVzQ2hhbm5lbCIsImZpbmQiLCJ2YyIsInByb3BlcnR5IiwidW5kZWZpbmVkIiwicmFkaXVzIiwiZ2V0Wm9vbUZhY3RvciIsInNvbWUiLCJub25lTGF5ZXJEYXRhQWZmZWN0aW5nUHJvcHMiLCJzaXplIiwibGF0IiwibG5nIiwibGF0MCIsImxuZzAiLCJsYXQxIiwibG5nMSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQXNEZ0JBLHFCLEdBQUFBLHFCOztBQXREaEI7O0FBQ0E7O0FBRUE7O0FBU0E7O0FBQ0E7O0FBRUE7O0FBTUE7O0FBT0E7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QUFWRCxPQUFQO0FBb0JEOztBQUVEOzs7Ozs7O3dCQUlrQjtBQUNoQixhQUFPLElBQVA7QUFDRDs7QUFFRDs7Ozs7O3dCQUc4QjtBQUM1QixhQUFPO0FBQ0xDLGFBQUssRUFBQ2hHLE1BQU0sS0FBUCxFQUFjRyxjQUFjLEtBQTVCLEVBREE7QUFFTDhGLGFBQUssRUFBQ2pHLE1BQU0sS0FBUCxFQUFjRyxjQUFjLEtBQTVCO0FBRkEsT0FBUDtBQUlEOztBQUVEOzs7Ozs7d0JBRzZCO0FBQzNCLGFBQU87QUFDTCtGLGNBQU0sRUFBQ2xHLE1BQU0sTUFBUCxFQUFlRyxjQUFjLEtBQTdCLEVBREQ7QUFFTGdHLGNBQU0sRUFBQ25HLE1BQU0sTUFBUCxFQUFlRyxjQUFjLEtBQTdCLEVBRkQ7QUFHTGlHLGNBQU0sRUFBQ3BHLE1BQU0sTUFBUCxFQUFlRyxjQUFjLEtBQTdCLEVBSEQ7QUFJTGtHLGNBQU0sRUFBQ3JHLE1BQU0sTUFBUCxFQUFlRyxjQUFjLEtBQTdCO0FBSkQsT0FBUDtBQU1EOzs7OztrQkF6RmtCWixLIiwiZmlsZSI6ImJhc2UtbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2hleFRvUmdifSBmcm9tICcuLi91dGlscy9jb2xvci11dGlscyc7XG5pbXBvcnQge2NvbnNvbGUgYXMgQ29uc29sZX0gZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5cbmltcG9ydCB7XG4gIEFMTF9GSUVMRF9UWVBFUyxcbiAgREVGQVVMVF9MSUdIVF9TRVRUSU5HUyxcbiAgTk9fVkFMVUVfQ09MT1IsXG4gIFNDQUxFX1RZUEVTLFxuICBDSEFOTkVMX1NDQUxFUyxcbiAgRklFTERfT1BUUyxcbiAgU0NBTEVfRlVOQ1xufSBmcm9tICcuLi9jb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5pbXBvcnQge3ViZXJEYXRhVml6Q29sb3JzfSBmcm9tICcuLi9jb25zdGFudHMvdWJlci12aXotY29sb3JzJztcbmltcG9ydCB7TEFZRVJfVklTX0NPTkZJR1N9IGZyb20gJy4vbGF5ZXItZmFjdG9yeSc7XG5cbmltcG9ydCB7XG4gIGdlbmVyYXRlSGFzaElkLFxuICBub3ROdWxsb3JVbmRlZmluZWQsXG4gIGlzUGxhaW5PYmplY3Rcbn0gZnJvbSAnLi4vdXRpbHMvdXRpbHMnO1xuXG5pbXBvcnQge1xuICBnZXRTYW1wbGVEYXRhLFxuICBnZXRMYXRMbmdCb3VuZHMsXG4gIG1heWJlVG9EYXRlLFxuICBnZXRTb3J0aW5nRnVuY3Rpb25cbn0gZnJvbSAnLi4vdXRpbHMvZGF0YS11dGlscyc7XG5cbmltcG9ydCB7XG4gIGdldFF1YW50aWxlRG9tYWluLFxuICBnZXRPcmRpbmFsRG9tYWluLFxuICBnZXRMaW5lYXJEb21haW5cbn0gZnJvbSAnLi4vdXRpbHMvZGF0YS1zY2FsZS11dGlscyc7XG5cbi8qKlxuICogQXBwcm94LiBudW1iZXIgb2YgcG9pbnRzIHRvIHNhbXBsZSBpbiBhIGxhcmdlIGRhdGEgc2V0XG4gKiBAdHlwZSB7bnVtYmVyfVxuICovXG5jb25zdCBNQVhfU0FNUExFX1NJWkUgPSA1MDAwO1xuXG5mdW5jdGlvbiogZ2VuZXJhdGVDb2xvcigpIHtcbiAgbGV0IGluZGV4ID0gMDtcbiAgY29uc3QgdWJlckNvbG9ycyA9IE9iamVjdC52YWx1ZXModWJlckRhdGFWaXpDb2xvcnMpO1xuICB3aGlsZSAoaW5kZXggPCB1YmVyQ29sb3JzLmxlbmd0aCArIDEpIHtcbiAgICBpZiAoaW5kZXggPT09IHViZXJDb2xvcnMubGVuZ3RoKSB7XG4gICAgICBpbmRleCA9IDA7XG4gICAgfVxuICAgIHlpZWxkIGhleFRvUmdiKHViZXJDb2xvcnNbaW5kZXgrK10pO1xuICB9XG59XG5cbmNvbnN0IGNvbG9yTWFrZXIgPSBnZW5lcmF0ZUNvbG9yKCk7XG5jb25zdCBkZWZhdWx0R2V0RmllbGRWYWx1ZSA9IChmaWVsZCwgZCkgPT4gZFtmaWVsZC50YWJsZUZpZWxkSW5kZXggLSAxXTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldERlZmF1bHRMYXllckNvbmZpZyhwcm9wcyA9IHt9KSB7XG4gIHJldHVybiB7XG4gICAgZGF0YUlkOiBwcm9wcy5kYXRhSWQgfHwgbnVsbCxcbiAgICBsYWJlbDogcHJvcHMubGFiZWwgfHwgJ25ldyBsYXllcicsXG4gICAgY29sb3I6IHByb3BzLmNvbG9yIHx8IGNvbG9yTWFrZXIubmV4dCgpLnZhbHVlLFxuICAgIGNvbHVtbnM6IHByb3BzLmNvbHVtbnMgfHwgbnVsbCxcbiAgICBpc1Zpc2libGU6IHByb3BzLmlzVmlzaWJsZSB8fCBmYWxzZSxcbiAgICBpc0NvbmZpZ0FjdGl2ZTogcHJvcHMuaXNDb25maWdBY3RpdmUgfHwgZmFsc2UsXG4gICAgaGlnaGxpZ2h0Q29sb3I6IHByb3BzLmhpZ2hsaWdodENvbG9yIHx8IFsyNTIsIDI0MiwgMjZdLFxuXG4gICAgLy8gVE9ETzogcmVmYWN0b3IgdGhpcyBpbnRvIHNlcGVyYXRlIHZpc3VhbCBDaGFubmVsIGNvbmZpZ1xuICAgIC8vIGNvbG9yIGJ5IGZpZWxkLCBkb21haW4gaXMgc2V0IGJ5IGZpbHRlcnMsIGZpZWxkLCBzY2FsZSB0eXBlXG4gICAgY29sb3JGaWVsZDogbnVsbCxcbiAgICBjb2xvckRvbWFpbjogWzAsIDFdLFxuICAgIGNvbG9yU2NhbGU6ICdxdWFudGlsZScsXG5cbiAgICAvLyBjb2xvciBieSBzaXplLCBkb21haW4gaXMgc2V0IGJ5IGZpbHRlcnMsIGZpZWxkLCBzY2FsZSB0eXBlXG4gICAgc2l6ZURvbWFpbjogWzAsIDFdLFxuICAgIHNpemVTY2FsZTogJ2xpbmVhcicsXG4gICAgc2l6ZUZpZWxkOiBudWxsLFxuXG4gICAgdmlzQ29uZmlnOiB7fVxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKHByb3BzID0ge30pIHtcbiAgICB0aGlzLmlkID0gcHJvcHMuaWQgfHwgZ2VuZXJhdGVIYXNoSWQoNik7XG5cbiAgICB0aGlzLmNvbmZpZyA9IGdldERlZmF1bHRMYXllckNvbmZpZyh7XG4gICAgICBjb2x1bW5zOiB0aGlzLmdldExheWVyQ29sdW1ucygpLFxuICAgICAgLi4ucHJvcHNcbiAgICB9KTtcblxuICAgIC8vIG1ldGFcbiAgICB0aGlzLm1ldGEgPSB7fTtcblxuICAgIC8vIHZpc0NvbmZpZ1NldHRpbmdzXG4gICAgdGhpcy52aXNDb25maWdTZXR0aW5ncyA9IHt9O1xuICAgIC8vIGxheWVyIHV0aWxpdHkgbWV0aG9kc1xuICAgIC8vIHRoaXMuZ2V0TGlnaHRTZXR0aW5nc0Zyb21Cb3VuZHMgPSBnZXRMaWdodFNldHRpbmdzRnJvbUJvdW5kcztcbiAgfVxuXG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZ2V0IGlzQWdncmVnYXRlZCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXQgcmVxdWlyZWRMYXllckNvbHVtbnMoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgZ2V0IG9wdGlvbmFsQ29sdW1ucygpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBnZXQgbm9uZUxheWVyRGF0YUFmZmVjdGluZ1Byb3BzKCkge1xuICAgIHJldHVybiBbJ2xhYmVsJywgJ29wYWNpdHknLCAndGhpY2tuZXNzJywgJ2lzVmlzaWJsZSddO1xuICB9XG5cbiAgZ2V0IHZpc3VhbENoYW5uZWxzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb2xvcjoge1xuICAgICAgICBwcm9wZXJ0eTogJ2NvbG9yJyxcbiAgICAgICAgZmllbGQ6ICdjb2xvckZpZWxkJyxcbiAgICAgICAgc2NhbGU6ICdjb2xvclNjYWxlJyxcbiAgICAgICAgZG9tYWluOiAnY29sb3JEb21haW4nLFxuICAgICAgICByYW5nZTogJ2NvbG9yUmFuZ2UnLFxuICAgICAgICBrZXk6ICdjb2xvcicsXG4gICAgICAgIGNoYW5uZWxTY2FsZVR5cGU6IENIQU5ORUxfU0NBTEVTLmNvbG9yXG4gICAgICB9LFxuICAgICAgc2l6ZToge1xuICAgICAgICBwcm9wZXJ0eTogJ3NpemUnLFxuICAgICAgICBmaWVsZDogJ3NpemVGaWVsZCcsXG4gICAgICAgIHNjYWxlOiAnc2l6ZVNjYWxlJyxcbiAgICAgICAgZG9tYWluOiAnc2l6ZURvbWFpbicsXG4gICAgICAgIHJhbmdlOiAnc2l6ZVJhbmdlJyxcbiAgICAgICAga2V5OiAnc2l6ZScsXG4gICAgICAgIGNoYW5uZWxTY2FsZVR5cGU6IENIQU5ORUxfU0NBTEVTLnNpemVcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLypcbiAgICogQ29sdW1uIHBhaXJzIG1hcHMgbGF5ZXIgY29sdW1uIHRvIGEgc3BlY2lmaWMgZmllbGQgcGFpcnMsXG4gICAqIEJ5IGRlZmF1bHQsIGl0IGlzIHNldCB0byBudWxsXG4gICAqL1xuICBnZXQgY29sdW1uUGFpcnMoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKlxuICAgKiBEZWZhdWx0IHBvaW50IGNvbHVtbiBwYWlycywgY2FuIGJlIHVzZWQgZm9yIHBvaW50IGJhc2VkIGxheWVyczogcG9pbnQsIGljb24gZXRjLlxuICAgKi9cbiAgZ2V0IGRlZmF1bHRQb2ludENvbHVtblBhaXJzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBsYXQ6IHtwYWlyOiAnbG5nJywgZmllbGRQYWlyS2V5OiAnbGF0J30sXG4gICAgICBsbmc6IHtwYWlyOiAnbGF0JywgZmllbGRQYWlyS2V5OiAnbG5nJ31cbiAgICB9O1xuICB9XG5cbiAgLypcbiAgICogRGVmYXVsdCBsaW5rIGNvbHVtbiBwYWlycywgY2FuIGJlIHVzZWQgZm9yIGxpbmsgYmFzZWQgbGF5ZXJzOiBhcmMsIGxpbmUgZXRjXG4gICAqL1xuICBnZXQgZGVmYXVsdExpbmtDb2x1bW5QYWlycygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGF0MDoge3BhaXI6ICdsbmcwJywgZmllbGRQYWlyS2V5OiAnbGF0J30sXG4gICAgICBsbmcwOiB7cGFpcjogJ2xhdDAnLCBmaWVsZFBhaXJLZXk6ICdsbmcnfSxcbiAgICAgIGxhdDE6IHtwYWlyOiAnbG5nMScsIGZpZWxkUGFpcktleTogJ2xhdCd9LFxuICAgICAgbG5nMToge3BhaXI6ICdsYXQxJywgZmllbGRQYWlyS2V5OiAnbG5nJ31cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEFzc2lnbiBhIGZpZWxkIHRvIGxheWVyIGNvbHVtbiwgcmV0dXJuIGNvbHVtbiBjb25maWdcbiAgICogQHBhcmFtIGtleSAtIENvbHVtbiBLZXlcbiAgICogQHBhcmFtIGZpZWxkIC0gU2VsZWN0ZWQgZmllbGRcbiAgICogQHJldHVybnMge3t9fSAtIENvbHVtbiBjb25maWdcbiAgICovXG4gIGFzc2lnbkNvbHVtbihrZXksIGZpZWxkKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnRoaXMuY29uZmlnLmNvbHVtbnMsXG4gICAgICBba2V5XToge1xuICAgICAgICAuLi50aGlzLmNvbmZpZy5jb2x1bW5zW2tleV0sXG4gICAgICAgIHZhbHVlOiBmaWVsZC5uYW1lLFxuICAgICAgICBmaWVsZElkeDogZmllbGQudGFibGVGaWVsZEluZGV4IC0gMVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQXNzaWduIGEgZmllbGQgcGFpciB0byBjb2x1bW4gY29uZmlnLCByZXR1cm4gY29sdW1uIGNvbmZpZ1xuICAgKiBAcGFyYW0ga2V5IC0gQ29sdW1uIEtleVxuICAgKiBAcGFyYW0gcGFpciAtIGZpZWxkIFBhaXJcbiAgICogQHJldHVybnMge3t9fSAtIENvbHVtbiBjb25maWdcbiAgICovXG4gIGFzc2lnbkNvbHVtblBhaXJzKGtleSwgcGFpcikge1xuICAgIGlmICghdGhpcy5jb2x1bW5QYWlycyB8fCAhdGhpcy5jb2x1bW5QYWlyc1trZXldKSB7XG4gICAgICAvLyBzaG91bGQgbm90IGVuZCBpbiB0aGlzIHN0YXRlXG4gICAgICByZXR1cm4gdGhpcy5jb25maWcuY29sdW1ucztcbiAgICB9XG5cbiAgICBjb25zdCB7cGFpcjogcGFydG5lcktleSwgZmllbGRQYWlyS2V5fSA9IHRoaXMuY29sdW1uUGFpcnNba2V5XTtcbiAgICBjb25zdCB7ZmllbGRQYWlyS2V5OiBwYXJ0bmVyRmllbGRQYWlyS2V5fSA9IHRoaXMuY29sdW1uUGFpcnNbcGFydG5lcktleV07XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4udGhpcy5jb25maWcuY29sdW1ucyxcbiAgICAgIFtrZXldOiBwYWlyW2ZpZWxkUGFpcktleV0sXG4gICAgICBbcGFydG5lcktleV06IHBhaXJbcGFydG5lckZpZWxkUGFpcktleV1cbiAgICB9O1xuICB9XG5cbiAgZ2V0Wm9vbUZhY3Rvcih6b29tKSB7XG4gICAgcmV0dXJuIE1hdGgucG93KDIsIE1hdGgubWF4KDE0IC0gem9vbSwgMCkpO1xuICB9XG5cbiAgZ2V0RWxldmF0aW9uWm9vbUZhY3Rvcih6b29tKSB7XG4gICAgcmV0dXJuIE1hdGgucG93KDIsIE1hdGgubWF4KDggLSB6b29tLCAwKSk7XG4gIH1cblxuICBmb3JtYXRMYXllckRhdGEoZGF0YSwgYWxsRGF0YSwgZmlsdGVyZWRJbmRleCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIHJlbmRlckxheWVyKCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGdldEhvdmVyRGF0YShvYmplY3QpIHtcbiAgICBpZiAoIW9iamVjdCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIC8vIGJ5IGRlZmF1bHQsIGVhY2ggZW50cnkgb2YgbGF5ZXJEYXRhIHNob3VsZCBoYXZlIGEgZGF0YSBwcm9wZXJ0eSBwb2ludHNcbiAgICAvLyB0byB0aGUgb3JpZ2luYWwgaXRlbSBpbiB0aGUgYWxsRGF0YSBhcnJheVxuICAgIC8vIGVhY2ggbGF5ZXIgY2FuIGltcGxlbWVudCBpdHMgb3duIGdldEhvdmVyRGF0YSBtZXRob2RcbiAgICByZXR1cm4gb2JqZWN0LmRhdGE7XG4gIH1cblxuICAvLyBSZWN1cnNpdmVseSBjb3B5IGNvbmZpZyBvdmVyIHRvIGFuIGVtcHR5IGxheWVyXG4gIC8vIHdoZW4gcmVjZWl2ZWQgc2F2ZWQgY29uZmlnLCBvciBjb3B5IGNvbmZpZyBvdmVyIGZyb20gYSBkaWZmZXJlbnQgbGF5ZXIgdHlwZVxuICAvLyBtYWtlIHN1cmUgdG8gb25seSBjb3B5IG92ZXIgdmFsdWUgdG8gZXhpc3Rpbmcga2V5c1xuICBhc3NpZ25Db25maWdUb0xheWVyKG9sZENvbmZpZywgbmV3Q29uZmlnKSB7XG4gICAgLy8gVE9ETzogaGF2ZSBhIGJldHRlciB3YXkgdG8gY29weSBvdmVyIGRpbWVuc2lvbiBjb25maWcgcmFuZ2VcbiAgICAvLyBlLmcuIGhleGFnb24gaGVpZ2h0IHNpemVSYW5nZSAtPiBwb2ludCByYWRpdXMgc2l6ZVJhbmdlXG4gICAgLy8gZG9uJ3QgZGVlcCBtZXJnZSB2aXN1YWxDaGFubmVsIGZpZWxkXG4gICAgY29uc3Qgbm90VG9EZWVwTWVyZ2UgPSBPYmplY3QudmFsdWVzKHRoaXMudmlzdWFsQ2hhbm5lbHMpLm1hcCh2ID0+IHYuZmllbGQpO1xuXG4gICAgLy8gZG9uJ3QgZGVlcCBtZXJnZSBjb2xvciByYW5nZSwgcmV2ZXJzZWQ6IGlzIG5vdCBhIGtleSBieSBkZWZhdWx0XG4gICAgbm90VG9EZWVwTWVyZ2UucHVzaCgnY29sb3JSYW5nZScpO1xuXG4gICAgLy8gZG9uJ3QgY29weSBvdmVyIGRvbWFpblxuICAgIGNvbnN0IG5vdFRvQ29weSA9IE9iamVjdC52YWx1ZXModGhpcy52aXN1YWxDaGFubmVscykubWFwKHYgPT4gdi5kb21haW4pO1xuICAgIGNvbnN0IGNvcGllZCA9IHt9O1xuXG4gICAgT2JqZWN0LmtleXMob2xkQ29uZmlnKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBpZiAoXG4gICAgICAgIGlzUGxhaW5PYmplY3Qob2xkQ29uZmlnW2tleV0pICYmXG4gICAgICAgIGlzUGxhaW5PYmplY3QobmV3Q29uZmlnW2tleV0pICYmXG4gICAgICAgICFub3RUb0RlZXBNZXJnZS5pbmNsdWRlcyhrZXkpICYmXG4gICAgICAgICFub3RUb0NvcHkuaW5jbHVkZXMoa2V5KVxuICAgICAgKSB7XG4gICAgICAgIC8vIHJlY3Vyc2l2ZWx5IGFzc2lnbiBvYmplY3QgdmFsdWVcbiAgICAgICAgY29waWVkW2tleV0gPSB0aGlzLmFzc2lnbkNvbmZpZ1RvTGF5ZXIob2xkQ29uZmlnW2tleV0sIG5ld0NvbmZpZ1trZXldKTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIG5vdE51bGxvclVuZGVmaW5lZChuZXdDb25maWdba2V5XSkgJiZcbiAgICAgICAgIW5vdFRvQ29weS5pbmNsdWRlcyhrZXkpXG4gICAgICApIHtcbiAgICAgICAgY29waWVkW2tleV0gPSBuZXdDb25maWdba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvcGllZFtrZXldID0gb2xkQ29uZmlnW2tleV07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY29waWVkO1xuICB9XG5cbiAgcmVnaXN0ZXJWaXNDb25maWcobGF5ZXJWaXNDb25maWdzKSB7XG4gICAgT2JqZWN0LmtleXMobGF5ZXJWaXNDb25maWdzKS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKFxuICAgICAgICB0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycgJiZcbiAgICAgICAgTEFZRVJfVklTX0NPTkZJR1NbbGF5ZXJWaXNDb25maWdzW2l0ZW1dXVxuICAgICAgKSB7XG4gICAgICAgIC8vIGlmIGFzc2lnbmVkIG9uZSBvZiBkZWZhdWx0IExBWUVSX0NPTkZJR1NcbiAgICAgICAgdGhpcy5jb25maWcudmlzQ29uZmlnW2l0ZW1dID1cbiAgICAgICAgICBMQVlFUl9WSVNfQ09ORklHU1tsYXllclZpc0NvbmZpZ3NbaXRlbV1dLmRlZmF1bHRWYWx1ZTtcbiAgICAgICAgdGhpcy52aXNDb25maWdTZXR0aW5nc1tpdGVtXSA9IExBWUVSX1ZJU19DT05GSUdTW2xheWVyVmlzQ29uZmlnc1tpdGVtXV07XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICBbJ3R5cGUnLCAnZGVmYXVsdFZhbHVlJ10uZXZlcnkocCA9PiBsYXllclZpc0NvbmZpZ3NbaXRlbV1bcF0pXG4gICAgICApIHtcbiAgICAgICAgLy8gaWYgcHJvdmlkZWQgY3VzdG9taXplZCB2aXNDb25maWcsIGFuZCBoYXMgdHlwZSAmJiBkZWZhdWx0VmFsdWVcbiAgICAgICAgLy8gVE9ETzogZnVydGhlciBjaGVjayBpZiBjdXN0b21pemVkIHZpc0NvbmZpZyBpcyB2YWxpZFxuICAgICAgICB0aGlzLmNvbmZpZy52aXNDb25maWdbaXRlbV0gPSBsYXllclZpc0NvbmZpZ3NbaXRlbV0uZGVmYXVsdFZhbHVlO1xuICAgICAgICB0aGlzLnZpc0NvbmZpZ1NldHRpbmdzW2l0ZW1dID0gbGF5ZXJWaXNDb25maWdzW2l0ZW1dO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0TGF5ZXJDb2x1bW5zKCkge1xuICAgIGNvbnN0IHJlcXVpcmVkID0gdGhpcy5yZXF1aXJlZExheWVyQ29sdW1ucy5yZWR1Y2UoXG4gICAgICAoYWNjdSwga2V5KSA9PiAoe1xuICAgICAgICAuLi5hY2N1LFxuICAgICAgICBba2V5XToge3ZhbHVlOiBudWxsLCBmaWVsZElkeDogLTF9XG4gICAgICB9KSxcbiAgICAgIHt9XG4gICAgKTtcbiAgICBjb25zdCBvcHRpb25hbCA9IHRoaXMub3B0aW9uYWxDb2x1bW5zLnJlZHVjZShcbiAgICAgIChhY2N1LCBrZXkpID0+ICh7XG4gICAgICAgIC4uLmFjY3UsXG4gICAgICAgIFtrZXldOiB7dmFsdWU6IG51bGwsIGZpZWxkSWR4OiAtMSwgb3B0aW9uYWw6IHRydWV9XG4gICAgICB9KSxcbiAgICAgIHt9XG4gICAgKTtcblxuICAgIHJldHVybiB7Li4ucmVxdWlyZWQsIC4uLm9wdGlvbmFsfTtcbiAgfVxuXG4gIHVwZGF0ZUxheWVyQ29uZmlnKG5ld0NvbmZpZykge1xuICAgIHRoaXMuY29uZmlnID0gey4uLnRoaXMuY29uZmlnLCAuLi5uZXdDb25maWd9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdXBkYXRlTGF5ZXJWaXNDb25maWcobmV3VmlzQ29uZmlnKSB7XG4gICAgdGhpcy5jb25maWcudmlzQ29uZmlnID0gey4uLnRoaXMuY29uZmlnLnZpc0NvbmZpZywgLi4ubmV3VmlzQ29uZmlnfTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciBsYXllciBoYXMgYWxsIGNvbHVtbnNcbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGxheWVyXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB5ZXMgb3Igbm9cbiAgICovXG4gIGhhc0FsbENvbHVtbnMoKSB7XG4gICAgY29uc3Qge2NvbHVtbnN9ID0gdGhpcy5jb25maWc7XG4gICAgcmV0dXJuIChcbiAgICAgIGNvbHVtbnMgJiZcbiAgICAgIE9iamVjdC52YWx1ZXMoY29sdW1ucykuZXZlcnkodiA9PiB7XG4gICAgICAgIHJldHVybiBCb29sZWFuKHYub3B0aW9uYWwgfHwgKHYudmFsdWUgJiYgdi5maWVsZElkeCA+IC0xKSk7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciBsYXllciBoYXMgZGF0YVxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gbGF5ZXJcbiAgICogQHBhcmFtIHtBcnJheSB8IE9iamVjdH0gbGF5ZXJEYXRhXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB5ZXMgb3Igbm9cbiAgICovXG4gIGhhc0xheWVyRGF0YShsYXllckRhdGEpIHtcbiAgICBpZiAoIWxheWVyRGF0YSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBCb29sZWFuKGxheWVyRGF0YS5kYXRhICYmIGxheWVyRGF0YS5kYXRhLmxlbmd0aCk7XG4gIH1cblxuICBpc1ZhbGlkVG9TYXZlKCkge1xuICAgIHJldHVybiB0aGlzLnR5cGUgJiYgdGhpcy5oYXNBbGxDb2x1bW5zKCk7XG4gIH1cblxuICBzaG91bGRSZW5kZXJMYXllcihkYXRhKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMudHlwZSAmJlxuICAgICAgdGhpcy5oYXNBbGxDb2x1bW5zKCkgJiZcbiAgICAgIHRoaXMuY29uZmlnLmlzVmlzaWJsZSAmJlxuICAgICAgdGhpcy5oYXNMYXllckRhdGEoZGF0YSlcbiAgICApO1xuICB9XG5cbiAgZ2V0VmlzQ2hhbm5lbFNjYWxlKHNjYWxlLCBkb21haW4sIHJhbmdlLCBmaXhlZCkge1xuICAgIHJldHVybiBTQ0FMRV9GVU5DW2ZpeGVkID8gJ2xpbmVhcicgOiBzY2FsZV0oKVxuICAgICAgLmRvbWFpbihkb21haW4pXG4gICAgICAucmFuZ2UoZml4ZWQgPyBkb21haW4gOiByYW5nZSk7XG4gIH1cblxuICBnZXRQb2ludHNCb3VuZHMoYWxsRGF0YSwgZ2V0UG9zaXRpb24pIHtcbiAgICAvLyBubyBuZWVkIHRvIGxvb3AgdGhyb3VnaCB0aGUgZW50aXJlIGRhdGFzZXRcbiAgICAvLyBnZXQgYSBzYW1wbGUgb2YgZGF0YSB0byBjYWxjdWxhdGUgYm91bmRzXG4gICAgY29uc3Qgc2FtcGxlRGF0YSA9XG4gICAgICBhbGxEYXRhLmxlbmd0aCA+IE1BWF9TQU1QTEVfU0laRVxuICAgICAgICA/IGdldFNhbXBsZURhdGEoYWxsRGF0YSwgTUFYX1NBTVBMRV9TSVpFKVxuICAgICAgICA6IGFsbERhdGE7XG4gICAgY29uc3QgcG9pbnRzID0gc2FtcGxlRGF0YS5tYXAoZ2V0UG9zaXRpb24pO1xuXG4gICAgY29uc3QgbGF0Qm91bmRzID0gZ2V0TGF0TG5nQm91bmRzKHBvaW50cywgMSwgWy05MCwgOTBdKTtcbiAgICBjb25zdCBsbmdCb3VuZHMgPSBnZXRMYXRMbmdCb3VuZHMocG9pbnRzLCAwLCBbLTE4MCwgMTgwXSk7XG5cbiAgICBpZiAoIWxhdEJvdW5kcyB8fCAhbG5nQm91bmRzKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gW2xuZ0JvdW5kc1swXSwgbGF0Qm91bmRzWzBdLCBsbmdCb3VuZHNbMV0sIGxhdEJvdW5kc1sxXV07XG4gIH1cblxuICBnZXRMaWdodFNldHRpbmdzRnJvbUJvdW5kcyhib3VuZHMpIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShib3VuZHMpICYmIGJvdW5kcy5sZW5ndGggPj0gNFxuICAgICAgPyB7XG4gICAgICAgICAgLi4uREVGQVVMVF9MSUdIVF9TRVRUSU5HUyxcbiAgICAgICAgICBsaWdodHNQb3NpdGlvbjogW1xuICAgICAgICAgICAgLi4uYm91bmRzLnNsaWNlKDAsIDIpLFxuICAgICAgICAgICAgREVGQVVMVF9MSUdIVF9TRVRUSU5HUy5saWdodHNQb3NpdGlvblsyXSxcbiAgICAgICAgICAgIC4uLmJvdW5kcy5zbGljZSgyLCA0KSxcbiAgICAgICAgICAgIERFRkFVTFRfTElHSFRfU0VUVElOR1MubGlnaHRzUG9zaXRpb25bNV1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIDogREVGQVVMVF9MSUdIVF9TRVRUSU5HUztcbiAgfVxuXG4gIGdldEVuY29kZWRDaGFubmVsVmFsdWUoXG4gICAgc2NhbGUsXG4gICAgZGF0YSxcbiAgICBmaWVsZCxcbiAgICBkZWZhdWx0VmFsdWUgPSBOT19WQUxVRV9DT0xPUixcbiAgICBnZXRWYWx1ZSA9IGRlZmF1bHRHZXRGaWVsZFZhbHVlXG4gICkge1xuICAgIGNvbnN0IHt0eXBlfSA9IGZpZWxkO1xuICAgIGNvbnN0IHZhbHVlID0gZ2V0VmFsdWUoZmllbGQsIGRhdGEpO1xuICAgIGxldCBhdHRyaWJ1dGVWYWx1ZTtcbiAgICBpZiAodHlwZSA9PT0gQUxMX0ZJRUxEX1RZUEVTLnRpbWVzdGFtcCkge1xuICAgICAgLy8gc2hvdWxkbid0IG5lZWQgdG8gY29udmVydCBoZXJlXG4gICAgICAvLyBzY2FsZSBGdW5jdGlvbiBzaG91bGQgdGFrZSBjYXJlIG9mIGl0XG4gICAgICBhdHRyaWJ1dGVWYWx1ZSA9IHNjYWxlKG5ldyBEYXRlKHZhbHVlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF0dHJpYnV0ZVZhbHVlID0gc2NhbGUodmFsdWUpO1xuICAgIH1cblxuICAgIGlmICghYXR0cmlidXRlVmFsdWUpIHtcbiAgICAgIGF0dHJpYnV0ZVZhbHVlID0gZGVmYXVsdFZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiBhdHRyaWJ1dGVWYWx1ZTtcbiAgfVxuXG4gIHVwZGF0ZU1ldGEobWV0YSkge1xuICAgIHRoaXMubWV0YSA9IHsuLi50aGlzLm1ldGEsIC4uLm1ldGF9O1xuICB9XG5cbiAgLyoqXG4gICAqIGhlbHBlciBmdW5jdGlvbiB0byB1cGRhdGUgb25lIGxheWVyIGRvbWFpbiB3aGVuIHN0YXRlLmRhdGEgY2hhbmdlZFxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdFtdfSBkYXRhXG4gICAqIEBwYXJhbSB7T2JqZWN0W119IGFsbERhdGFcbiAgICogQHBhcmFtIHtvYmplY3R9IGxheWVyXG4gICAqIEByZXR1cm5zIHtvYmplY3R9IGxheWVyXG4gICAqL1xuICB1cGRhdGVMYXllckRvbWFpbih7ZGF0YSwgYWxsRGF0YX0pIHtcbiAgICBPYmplY3QudmFsdWVzKHRoaXMudmlzdWFsQ2hhbm5lbHMpLmZvckVhY2goY2hhbm5lbCA9PiB7XG4gICAgICBjb25zdCB7ZG9tYWlufSA9IGNoYW5uZWw7XG4gICAgICBjb25zdCB1cGRhdGVkRG9tYWluID0gdGhpcy5jYWxjdWxhdGVMYXllckRvbWFpbih7ZGF0YSwgYWxsRGF0YX0sIGNoYW5uZWwpO1xuXG4gICAgICB0aGlzLnVwZGF0ZUxheWVyQ29uZmlnKHtbZG9tYWluXTogdXBkYXRlZERvbWFpbn0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB1cGRhdGVMYXllclZpc3VhbENoYW5uZWwoe2RhdGEsIGFsbERhdGF9LCBjaGFubmVsKSB7XG4gICAgY29uc3QgdmlzdWFsQ2hhbm5lbCA9IHRoaXMudmlzdWFsQ2hhbm5lbHNbY2hhbm5lbF07XG4gICAgY29uc3Qge2ZpZWxkLCBzY2FsZSwgZG9tYWluLCBjaGFubmVsU2NhbGVUeXBlfSA9IHZpc3VhbENoYW5uZWw7XG5cbiAgICBpZiAodGhpcy5jb25maWdbZmllbGRdKSB7XG4gICAgICAvLyBpZiBmaWVsZCBpcyBzZWxlY3RlZCwgY2hlY2sgaWYgY3VycmVudCBzZWxlY3RlZCBzY2FsZSBpc1xuICAgICAgLy8gc3VwcG9ydGVkLCBpZiBub3QsIHVwZGF0ZSB0byBkZWZhdWx0XG4gICAgICBjb25zdCBzY2FsZU9wdGlvbnMgPVxuICAgICAgICBGSUVMRF9PUFRTW3RoaXMuY29uZmlnW2ZpZWxkXS50eXBlXS5zY2FsZVtjaGFubmVsU2NhbGVUeXBlXTtcbiAgICAgIGlmICghc2NhbGVPcHRpb25zLmluY2x1ZGVzKHRoaXMuY29uZmlnW3NjYWxlXSkpIHtcbiAgICAgICAgdGhpcy51cGRhdGVMYXllckNvbmZpZyh7W3NjYWxlXTogc2NhbGVPcHRpb25zWzBdfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gY2FsY3VsYXRlIGxheWVyIGNoYW5uZWwgZG9tYWluXG4gICAgY29uc3QgdXBkYXRlZERvbWFpbiA9IHRoaXMuY2FsY3VsYXRlTGF5ZXJEb21haW4oXG4gICAgICB7ZGF0YSwgYWxsRGF0YX0sXG4gICAgICB2aXN1YWxDaGFubmVsXG4gICAgKTtcblxuICAgIHRoaXMudXBkYXRlTGF5ZXJDb25maWcoe1tkb21haW5dOiB1cGRhdGVkRG9tYWlufSk7XG4gIH1cblxuICBjYWxjdWxhdGVMYXllckRvbWFpbih7ZGF0YSwgYWxsRGF0YX0sIHZpc3VhbENoYW5uZWwpIHtcbiAgICBjb25zdCBkZWZhdWx0RG9tYWluID0gWzAsIDFdO1xuICAgIGNvbnN0IHtzY2FsZX0gPSB2aXN1YWxDaGFubmVsO1xuICAgIGNvbnN0IHNjYWxlVHlwZSA9IHRoaXMuY29uZmlnW3NjYWxlXTtcblxuICAgIGNvbnN0IGZpZWxkID0gdGhpcy5jb25maWdbdmlzdWFsQ2hhbm5lbC5maWVsZF07XG4gICAgaWYgKCFmaWVsZCkge1xuICAgICAgLy8gaWYgY29sb3JGaWVsZCBvciBzaXplRmllbGQgd2VyZSBzZXQgYmFjayB0byBudWxsXG4gICAgICByZXR1cm4gZGVmYXVsdERvbWFpbjtcbiAgICB9XG5cbiAgICBpZiAoIVNDQUxFX1RZUEVTW3NjYWxlVHlwZV0pIHtcbiAgICAgIENvbnNvbGUuZXJyb3IoYHNjYWxlIHR5cGUgJHtzY2FsZVR5cGV9IG5vdCBzdXBwb3J0ZWRgKTtcbiAgICAgIHJldHVybiBkZWZhdWx0RG9tYWluO1xuICAgIH1cblxuICAgIC8vIFRPRE86IHJlZmFjdG9yIHRvIGFkZCB2YWx1ZUFjY2Vzc29yIHRvIGZpZWxkXG4gICAgY29uc3QgZmllbGRJZHggPSBmaWVsZC50YWJsZUZpZWxkSW5kZXggLSAxO1xuICAgIGNvbnN0IGlzVGltZSA9IGZpZWxkLnR5cGUgPT09IEFMTF9GSUVMRF9UWVBFUy50aW1lc3RhbXA7XG4gICAgY29uc3QgdmFsdWVBY2Nlc3NvciA9IG1heWJlVG9EYXRlLmJpbmQoXG4gICAgICBudWxsLFxuICAgICAgaXNUaW1lLFxuICAgICAgZmllbGRJZHgsXG4gICAgICBmaWVsZC5mb3JtYXRcbiAgICApO1xuICAgIGNvbnN0IHNvcnRGdW5jdGlvbiA9IGdldFNvcnRpbmdGdW5jdGlvbihmaWVsZC50eXBlKTtcblxuICAgIHN3aXRjaCAoc2NhbGVUeXBlKSB7XG4gICAgICBjYXNlIFNDQUxFX1RZUEVTLm9yZGluYWw6XG4gICAgICBjYXNlIFNDQUxFX1RZUEVTLnBvaW50OlxuICAgICAgICAvLyBkbyBub3QgcmVjYWxjdWxhdGUgb3JkaW5hbCBkb21haW4gYmFzZWQgb24gZmlsdGVycmVkIGRhdGFcbiAgICAgICAgcmV0dXJuIGdldE9yZGluYWxEb21haW4oYWxsRGF0YSwgdmFsdWVBY2Nlc3Nvcik7XG5cbiAgICAgIGNhc2UgU0NBTEVfVFlQRVMucXVhbnRpbGU6XG4gICAgICAgIHJldHVybiBnZXRRdWFudGlsZURvbWFpbihkYXRhLCB2YWx1ZUFjY2Vzc29yLCBzb3J0RnVuY3Rpb24pO1xuXG4gICAgICBjYXNlIFNDQUxFX1RZUEVTLnF1YW50aXplOlxuICAgICAgY2FzZSBTQ0FMRV9UWVBFUy5saW5lYXI6XG4gICAgICBjYXNlIFNDQUxFX1RZUEVTLnNxcnQ6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZ2V0TGluZWFyRG9tYWluKGRhdGEsIHZhbHVlQWNjZXNzb3IpO1xuICAgIH1cbiAgfVxuXG4gIGlzTGF5ZXJIb3ZlcmVkKG9iamVjdEluZm8pIHtcbiAgICByZXR1cm4gKFxuICAgICAgb2JqZWN0SW5mbyAmJlxuICAgICAgb2JqZWN0SW5mby5sYXllciAmJlxuICAgICAgb2JqZWN0SW5mby5waWNrZWQgJiZcbiAgICAgIG9iamVjdEluZm8ubGF5ZXIucHJvcHMuaWQgPT09IHRoaXMuaWRcbiAgICApO1xuICB9XG5cbiAgZ2V0UmFkaXVzU2NhbGVCeVpvb20oem9vbSwgZml4ZWRSYWRpdXMpIHtcbiAgICBjb25zdCByYWRpdXNDaGFubmVsID0gT2JqZWN0LnZhbHVlcyh0aGlzLnZpc3VhbENoYW5uZWxzKS5maW5kKFxuICAgICAgdmMgPT4gdmMucHJvcGVydHkgPT09ICdyYWRpdXMnXG4gICAgKTtcblxuICAgIGlmICghcmFkaXVzQ2hhbm5lbCkge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfVxuXG4gICAgY29uc3QgZmllbGQgPSByYWRpdXNDaGFubmVsLmZpZWxkO1xuICAgIGNvbnN0IGZpeGVkID1cbiAgICAgIGZpeGVkUmFkaXVzID09PSB1bmRlZmluZWRcbiAgICAgICAgPyB0aGlzLmNvbmZpZy52aXNDb25maWcuZml4ZWRSYWRpdXNcbiAgICAgICAgOiBmaXhlZFJhZGl1cztcbiAgICBjb25zdCB7cmFkaXVzfSA9IHRoaXMuY29uZmlnLnZpc0NvbmZpZztcblxuICAgIHJldHVybiBmaXhlZFxuICAgICAgPyAxXG4gICAgICA6ICh0aGlzLmNvbmZpZ1tmaWVsZF0gPyAxIDogcmFkaXVzKSAqIHRoaXMuZ2V0Wm9vbUZhY3Rvcih6b29tKTtcbiAgfVxuXG4gIHNob3VsZENhbGN1bGF0ZUxheWVyRGF0YShwcm9wcykge1xuICAgIHJldHVybiBwcm9wcy5zb21lKHAgPT4gIXRoaXMubm9uZUxheWVyRGF0YUFmZmVjdGluZ1Byb3BzLmluY2x1ZGVzKHApKTtcbiAgfVxufVxuIl19