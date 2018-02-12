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

var layerColors = Object.values(_uberVizColors.uberDataVizColors).map(_colorUtils.hexToRgb);
function generateColor() {
  var index;
  return _regenerator2.default.wrap(function generateColor$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          index = 0;

        case 1:
          if (!(index < layerColors.length + 1)) {
            _context.next = 7;
            break;
          }

          if (index === layerColors.length) {
            index = 0;
          }
          _context.next = 5;
          return layerColors[index++];

        case 5:
          _context.next = 1;
          break;

        case 7:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvYmFzZS1sYXllci5qcyJdLCJuYW1lcyI6WyJnZXREZWZhdWx0TGF5ZXJDb25maWciLCJnZW5lcmF0ZUNvbG9yIiwiTUFYX1NBTVBMRV9TSVpFIiwibGF5ZXJDb2xvcnMiLCJPYmplY3QiLCJ2YWx1ZXMiLCJtYXAiLCJpbmRleCIsImxlbmd0aCIsImNvbG9yTWFrZXIiLCJkZWZhdWx0R2V0RmllbGRWYWx1ZSIsImZpZWxkIiwiZCIsInRhYmxlRmllbGRJbmRleCIsInByb3BzIiwiZGF0YUlkIiwibGFiZWwiLCJjb2xvciIsIm5leHQiLCJ2YWx1ZSIsImNvbHVtbnMiLCJpc1Zpc2libGUiLCJpc0NvbmZpZ0FjdGl2ZSIsImhpZ2hsaWdodENvbG9yIiwiY29sb3JGaWVsZCIsImNvbG9yRG9tYWluIiwiY29sb3JTY2FsZSIsInNpemVEb21haW4iLCJzaXplU2NhbGUiLCJzaXplRmllbGQiLCJ2aXNDb25maWciLCJMYXllciIsImlkIiwiY29uZmlnIiwiZ2V0TGF5ZXJDb2x1bW5zIiwibWV0YSIsInZpc0NvbmZpZ1NldHRpbmdzIiwia2V5IiwibmFtZSIsImZpZWxkSWR4IiwicGFpciIsImNvbHVtblBhaXJzIiwicGFydG5lcktleSIsImZpZWxkUGFpcktleSIsInBhcnRuZXJGaWVsZFBhaXJLZXkiLCJ6b29tIiwiTWF0aCIsInBvdyIsIm1heCIsImRhdGEiLCJhbGxEYXRhIiwiZmlsdGVyZWRJbmRleCIsIm9iamVjdCIsIm9sZENvbmZpZyIsIm5ld0NvbmZpZyIsIm5vdFRvRGVlcE1lcmdlIiwidmlzdWFsQ2hhbm5lbHMiLCJ2IiwicHVzaCIsIm5vdFRvQ29weSIsImRvbWFpbiIsImNvcGllZCIsImtleXMiLCJmb3JFYWNoIiwiaW5jbHVkZXMiLCJhc3NpZ25Db25maWdUb0xheWVyIiwibGF5ZXJWaXNDb25maWdzIiwiaXRlbSIsImRlZmF1bHRWYWx1ZSIsImV2ZXJ5IiwicCIsInJlcXVpcmVkIiwicmVxdWlyZWRMYXllckNvbHVtbnMiLCJyZWR1Y2UiLCJhY2N1Iiwib3B0aW9uYWwiLCJvcHRpb25hbENvbHVtbnMiLCJuZXdWaXNDb25maWciLCJCb29sZWFuIiwibGF5ZXJEYXRhIiwidHlwZSIsImhhc0FsbENvbHVtbnMiLCJoYXNMYXllckRhdGEiLCJzY2FsZSIsInJhbmdlIiwiZml4ZWQiLCJnZXRQb3NpdGlvbiIsInNhbXBsZURhdGEiLCJwb2ludHMiLCJsYXRCb3VuZHMiLCJsbmdCb3VuZHMiLCJib3VuZHMiLCJBcnJheSIsImlzQXJyYXkiLCJsaWdodHNQb3NpdGlvbiIsInNsaWNlIiwiZ2V0VmFsdWUiLCJhdHRyaWJ1dGVWYWx1ZSIsInRpbWVzdGFtcCIsIkRhdGUiLCJjaGFubmVsIiwidXBkYXRlZERvbWFpbiIsImNhbGN1bGF0ZUxheWVyRG9tYWluIiwidXBkYXRlTGF5ZXJDb25maWciLCJ2aXN1YWxDaGFubmVsIiwiY2hhbm5lbFNjYWxlVHlwZSIsInNjYWxlT3B0aW9ucyIsImRlZmF1bHREb21haW4iLCJzY2FsZVR5cGUiLCJlcnJvciIsImlzVGltZSIsInZhbHVlQWNjZXNzb3IiLCJiaW5kIiwiZm9ybWF0Iiwic29ydEZ1bmN0aW9uIiwib3JkaW5hbCIsInBvaW50IiwicXVhbnRpbGUiLCJxdWFudGl6ZSIsImxpbmVhciIsInNxcnQiLCJvYmplY3RJbmZvIiwibGF5ZXIiLCJwaWNrZWQiLCJmaXhlZFJhZGl1cyIsInJhZGl1c0NoYW5uZWwiLCJmaW5kIiwidmMiLCJwcm9wZXJ0eSIsInVuZGVmaW5lZCIsInJhZGl1cyIsImdldFpvb21GYWN0b3IiLCJzb21lIiwibm9uZUxheWVyRGF0YUFmZmVjdGluZ1Byb3BzIiwic2l6ZSIsImxhdCIsImxuZyIsImxhdDAiLCJsbmcwIiwibGF0MSIsImxuZzEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFzRGdCQSxxQixHQUFBQSxxQjs7QUF0RGhCOztBQUNBOztBQUVBOztBQVNBOztBQUNBOztBQUVBOztBQU1BOztBQU9B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O0FBUDdCO0FBVkQsT0FBUDtBQW9CRDs7QUFFRDs7Ozs7Ozt3QkFJa0I7QUFDaEIsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozt3QkFHOEI7QUFDNUIsYUFBTztBQUNMQyxhQUFLLEVBQUMvRixNQUFNLEtBQVAsRUFBY0csY0FBYyxLQUE1QixFQURBO0FBRUw2RixhQUFLLEVBQUNoRyxNQUFNLEtBQVAsRUFBY0csY0FBYyxLQUE1QjtBQUZBLE9BQVA7QUFJRDs7QUFFRDs7Ozs7O3dCQUc2QjtBQUMzQixhQUFPO0FBQ0w4RixjQUFNLEVBQUNqRyxNQUFNLE1BQVAsRUFBZUcsY0FBYyxLQUE3QixFQUREO0FBRUwrRixjQUFNLEVBQUNsRyxNQUFNLE1BQVAsRUFBZUcsY0FBYyxLQUE3QixFQUZEO0FBR0xnRyxjQUFNLEVBQUNuRyxNQUFNLE1BQVAsRUFBZUcsY0FBYyxLQUE3QixFQUhEO0FBSUxpRyxjQUFNLEVBQUNwRyxNQUFNLE1BQVAsRUFBZUcsY0FBYyxLQUE3QjtBQUpELE9BQVA7QUFNRDs7Ozs7a0JBekZrQlosSyIsImZpbGUiOiJiYXNlLWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtoZXhUb1JnYn0gZnJvbSAnLi4vdXRpbHMvY29sb3ItdXRpbHMnO1xuaW1wb3J0IHtjb25zb2xlIGFzIENvbnNvbGV9IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuXG5pbXBvcnQge1xuICBBTExfRklFTERfVFlQRVMsXG4gIERFRkFVTFRfTElHSFRfU0VUVElOR1MsXG4gIE5PX1ZBTFVFX0NPTE9SLFxuICBTQ0FMRV9UWVBFUyxcbiAgQ0hBTk5FTF9TQ0FMRVMsXG4gIEZJRUxEX09QVFMsXG4gIFNDQUxFX0ZVTkNcbn0gZnJvbSAnLi4vY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHt1YmVyRGF0YVZpekNvbG9yc30gZnJvbSAnLi4vY29uc3RhbnRzL3ViZXItdml6LWNvbG9ycyc7XG5pbXBvcnQge0xBWUVSX1ZJU19DT05GSUdTfSBmcm9tICcuL2xheWVyLWZhY3RvcnknO1xuXG5pbXBvcnQge1xuICBnZW5lcmF0ZUhhc2hJZCxcbiAgbm90TnVsbG9yVW5kZWZpbmVkLFxuICBpc1BsYWluT2JqZWN0XG59IGZyb20gJy4uL3V0aWxzL3V0aWxzJztcblxuaW1wb3J0IHtcbiAgZ2V0U2FtcGxlRGF0YSxcbiAgZ2V0TGF0TG5nQm91bmRzLFxuICBtYXliZVRvRGF0ZSxcbiAgZ2V0U29ydGluZ0Z1bmN0aW9uXG59IGZyb20gJy4uL3V0aWxzL2RhdGEtdXRpbHMnO1xuXG5pbXBvcnQge1xuICBnZXRRdWFudGlsZURvbWFpbixcbiAgZ2V0T3JkaW5hbERvbWFpbixcbiAgZ2V0TGluZWFyRG9tYWluXG59IGZyb20gJy4uL3V0aWxzL2RhdGEtc2NhbGUtdXRpbHMnO1xuXG4vKipcbiAqIEFwcHJveC4gbnVtYmVyIG9mIHBvaW50cyB0byBzYW1wbGUgaW4gYSBsYXJnZSBkYXRhIHNldFxuICogQHR5cGUge251bWJlcn1cbiAqL1xuY29uc3QgTUFYX1NBTVBMRV9TSVpFID0gNTAwMDtcblxuY29uc3QgbGF5ZXJDb2xvcnMgPSBPYmplY3QudmFsdWVzKHViZXJEYXRhVml6Q29sb3JzKS5tYXAoaGV4VG9SZ2IpO1xuZnVuY3Rpb24qIGdlbmVyYXRlQ29sb3IoKSB7XG4gIGxldCBpbmRleCA9IDA7XG4gIHdoaWxlIChpbmRleCA8IGxheWVyQ29sb3JzLmxlbmd0aCArIDEpIHtcbiAgICBpZiAoaW5kZXggPT09IGxheWVyQ29sb3JzLmxlbmd0aCkge1xuICAgICAgaW5kZXggPSAwO1xuICAgIH1cbiAgICB5aWVsZCBsYXllckNvbG9yc1tpbmRleCsrXTtcbiAgfVxufVxuXG5jb25zdCBjb2xvck1ha2VyID0gZ2VuZXJhdGVDb2xvcigpO1xuY29uc3QgZGVmYXVsdEdldEZpZWxkVmFsdWUgPSAoZmllbGQsIGQpID0+IGRbZmllbGQudGFibGVGaWVsZEluZGV4IC0gMV07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWZhdWx0TGF5ZXJDb25maWcocHJvcHMgPSB7fSkge1xuICByZXR1cm4ge1xuICAgIGRhdGFJZDogcHJvcHMuZGF0YUlkIHx8IG51bGwsXG4gICAgbGFiZWw6IHByb3BzLmxhYmVsIHx8ICduZXcgbGF5ZXInLFxuICAgIGNvbG9yOiBwcm9wcy5jb2xvciB8fCBjb2xvck1ha2VyLm5leHQoKS52YWx1ZSxcbiAgICBjb2x1bW5zOiBwcm9wcy5jb2x1bW5zIHx8IG51bGwsXG4gICAgaXNWaXNpYmxlOiBwcm9wcy5pc1Zpc2libGUgfHwgZmFsc2UsXG4gICAgaXNDb25maWdBY3RpdmU6IHByb3BzLmlzQ29uZmlnQWN0aXZlIHx8IGZhbHNlLFxuICAgIGhpZ2hsaWdodENvbG9yOiBwcm9wcy5oaWdobGlnaHRDb2xvciB8fCBbMjUyLCAyNDIsIDI2XSxcblxuICAgIC8vIFRPRE86IHJlZmFjdG9yIHRoaXMgaW50byBzZXBlcmF0ZSB2aXN1YWwgQ2hhbm5lbCBjb25maWdcbiAgICAvLyBjb2xvciBieSBmaWVsZCwgZG9tYWluIGlzIHNldCBieSBmaWx0ZXJzLCBmaWVsZCwgc2NhbGUgdHlwZVxuICAgIGNvbG9yRmllbGQ6IG51bGwsXG4gICAgY29sb3JEb21haW46IFswLCAxXSxcbiAgICBjb2xvclNjYWxlOiAncXVhbnRpbGUnLFxuXG4gICAgLy8gY29sb3IgYnkgc2l6ZSwgZG9tYWluIGlzIHNldCBieSBmaWx0ZXJzLCBmaWVsZCwgc2NhbGUgdHlwZVxuICAgIHNpemVEb21haW46IFswLCAxXSxcbiAgICBzaXplU2NhbGU6ICdsaW5lYXInLFxuICAgIHNpemVGaWVsZDogbnVsbCxcblxuICAgIHZpc0NvbmZpZzoge31cbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGF5ZXIge1xuICBjb25zdHJ1Y3Rvcihwcm9wcyA9IHt9KSB7XG4gICAgdGhpcy5pZCA9IHByb3BzLmlkIHx8IGdlbmVyYXRlSGFzaElkKDYpO1xuXG4gICAgdGhpcy5jb25maWcgPSBnZXREZWZhdWx0TGF5ZXJDb25maWcoe1xuICAgICAgY29sdW1uczogdGhpcy5nZXRMYXllckNvbHVtbnMoKSxcbiAgICAgIC4uLnByb3BzXG4gICAgfSk7XG5cbiAgICAvLyBtZXRhXG4gICAgdGhpcy5tZXRhID0ge307XG5cbiAgICAvLyB2aXNDb25maWdTZXR0aW5nc1xuICAgIHRoaXMudmlzQ29uZmlnU2V0dGluZ3MgPSB7fTtcbiAgICAvLyBsYXllciB1dGlsaXR5IG1ldGhvZHNcbiAgICAvLyB0aGlzLmdldExpZ2h0U2V0dGluZ3NGcm9tQm91bmRzID0gZ2V0TGlnaHRTZXR0aW5nc0Zyb21Cb3VuZHM7XG4gIH1cblxuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGdldCBpc0FnZ3JlZ2F0ZWQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0IHJlcXVpcmVkTGF5ZXJDb2x1bW5zKCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGdldCBvcHRpb25hbENvbHVtbnMoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgZ2V0IG5vbmVMYXllckRhdGFBZmZlY3RpbmdQcm9wcygpIHtcbiAgICByZXR1cm4gWydsYWJlbCcsICdvcGFjaXR5JywgJ3RoaWNrbmVzcycsICdpc1Zpc2libGUnXTtcbiAgfVxuXG4gIGdldCB2aXN1YWxDaGFubmVscygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29sb3I6IHtcbiAgICAgICAgcHJvcGVydHk6ICdjb2xvcicsXG4gICAgICAgIGZpZWxkOiAnY29sb3JGaWVsZCcsXG4gICAgICAgIHNjYWxlOiAnY29sb3JTY2FsZScsXG4gICAgICAgIGRvbWFpbjogJ2NvbG9yRG9tYWluJyxcbiAgICAgICAgcmFuZ2U6ICdjb2xvclJhbmdlJyxcbiAgICAgICAga2V5OiAnY29sb3InLFxuICAgICAgICBjaGFubmVsU2NhbGVUeXBlOiBDSEFOTkVMX1NDQUxFUy5jb2xvclxuICAgICAgfSxcbiAgICAgIHNpemU6IHtcbiAgICAgICAgcHJvcGVydHk6ICdzaXplJyxcbiAgICAgICAgZmllbGQ6ICdzaXplRmllbGQnLFxuICAgICAgICBzY2FsZTogJ3NpemVTY2FsZScsXG4gICAgICAgIGRvbWFpbjogJ3NpemVEb21haW4nLFxuICAgICAgICByYW5nZTogJ3NpemVSYW5nZScsXG4gICAgICAgIGtleTogJ3NpemUnLFxuICAgICAgICBjaGFubmVsU2NhbGVUeXBlOiBDSEFOTkVMX1NDQUxFUy5zaXplXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qXG4gICAqIENvbHVtbiBwYWlycyBtYXBzIGxheWVyIGNvbHVtbiB0byBhIHNwZWNpZmljIGZpZWxkIHBhaXJzLFxuICAgKiBCeSBkZWZhdWx0LCBpdCBpcyBzZXQgdG8gbnVsbFxuICAgKi9cbiAgZ2V0IGNvbHVtblBhaXJzKCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLypcbiAgICogRGVmYXVsdCBwb2ludCBjb2x1bW4gcGFpcnMsIGNhbiBiZSB1c2VkIGZvciBwb2ludCBiYXNlZCBsYXllcnM6IHBvaW50LCBpY29uIGV0Yy5cbiAgICovXG4gIGdldCBkZWZhdWx0UG9pbnRDb2x1bW5QYWlycygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGF0OiB7cGFpcjogJ2xuZycsIGZpZWxkUGFpcktleTogJ2xhdCd9LFxuICAgICAgbG5nOiB7cGFpcjogJ2xhdCcsIGZpZWxkUGFpcktleTogJ2xuZyd9XG4gICAgfTtcbiAgfVxuXG4gIC8qXG4gICAqIERlZmF1bHQgbGluayBjb2x1bW4gcGFpcnMsIGNhbiBiZSB1c2VkIGZvciBsaW5rIGJhc2VkIGxheWVyczogYXJjLCBsaW5lIGV0Y1xuICAgKi9cbiAgZ2V0IGRlZmF1bHRMaW5rQ29sdW1uUGFpcnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhdDA6IHtwYWlyOiAnbG5nMCcsIGZpZWxkUGFpcktleTogJ2xhdCd9LFxuICAgICAgbG5nMDoge3BhaXI6ICdsYXQwJywgZmllbGRQYWlyS2V5OiAnbG5nJ30sXG4gICAgICBsYXQxOiB7cGFpcjogJ2xuZzEnLCBmaWVsZFBhaXJLZXk6ICdsYXQnfSxcbiAgICAgIGxuZzE6IHtwYWlyOiAnbGF0MScsIGZpZWxkUGFpcktleTogJ2xuZyd9XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NpZ24gYSBmaWVsZCB0byBsYXllciBjb2x1bW4sIHJldHVybiBjb2x1bW4gY29uZmlnXG4gICAqIEBwYXJhbSBrZXkgLSBDb2x1bW4gS2V5XG4gICAqIEBwYXJhbSBmaWVsZCAtIFNlbGVjdGVkIGZpZWxkXG4gICAqIEByZXR1cm5zIHt7fX0gLSBDb2x1bW4gY29uZmlnXG4gICAqL1xuICBhc3NpZ25Db2x1bW4oa2V5LCBmaWVsZCkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi50aGlzLmNvbmZpZy5jb2x1bW5zLFxuICAgICAgW2tleV06IHtcbiAgICAgICAgLi4udGhpcy5jb25maWcuY29sdW1uc1trZXldLFxuICAgICAgICB2YWx1ZTogZmllbGQubmFtZSxcbiAgICAgICAgZmllbGRJZHg6IGZpZWxkLnRhYmxlRmllbGRJbmRleCAtIDFcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEFzc2lnbiBhIGZpZWxkIHBhaXIgdG8gY29sdW1uIGNvbmZpZywgcmV0dXJuIGNvbHVtbiBjb25maWdcbiAgICogQHBhcmFtIGtleSAtIENvbHVtbiBLZXlcbiAgICogQHBhcmFtIHBhaXIgLSBmaWVsZCBQYWlyXG4gICAqIEByZXR1cm5zIHt7fX0gLSBDb2x1bW4gY29uZmlnXG4gICAqL1xuICBhc3NpZ25Db2x1bW5QYWlycyhrZXksIHBhaXIpIHtcbiAgICBpZiAoIXRoaXMuY29sdW1uUGFpcnMgfHwgIXRoaXMuY29sdW1uUGFpcnNba2V5XSkge1xuICAgICAgLy8gc2hvdWxkIG5vdCBlbmQgaW4gdGhpcyBzdGF0ZVxuICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmNvbHVtbnM7XG4gICAgfVxuXG4gICAgY29uc3Qge3BhaXI6IHBhcnRuZXJLZXksIGZpZWxkUGFpcktleX0gPSB0aGlzLmNvbHVtblBhaXJzW2tleV07XG4gICAgY29uc3Qge2ZpZWxkUGFpcktleTogcGFydG5lckZpZWxkUGFpcktleX0gPSB0aGlzLmNvbHVtblBhaXJzW3BhcnRuZXJLZXldO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnRoaXMuY29uZmlnLmNvbHVtbnMsXG4gICAgICBba2V5XTogcGFpcltmaWVsZFBhaXJLZXldLFxuICAgICAgW3BhcnRuZXJLZXldOiBwYWlyW3BhcnRuZXJGaWVsZFBhaXJLZXldXG4gICAgfTtcbiAgfVxuXG4gIGdldFpvb21GYWN0b3Ioem9vbSkge1xuICAgIHJldHVybiBNYXRoLnBvdygyLCBNYXRoLm1heCgxNCAtIHpvb20sIDApKTtcbiAgfVxuXG4gIGdldEVsZXZhdGlvblpvb21GYWN0b3Ioem9vbSkge1xuICAgIHJldHVybiBNYXRoLnBvdygyLCBNYXRoLm1heCg4IC0gem9vbSwgMCkpO1xuICB9XG5cbiAgZm9ybWF0TGF5ZXJEYXRhKGRhdGEsIGFsbERhdGEsIGZpbHRlcmVkSW5kZXgpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICByZW5kZXJMYXllcigpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBnZXRIb3ZlckRhdGEob2JqZWN0KSB7XG4gICAgaWYgKCFvYmplY3QpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICAvLyBieSBkZWZhdWx0LCBlYWNoIGVudHJ5IG9mIGxheWVyRGF0YSBzaG91bGQgaGF2ZSBhIGRhdGEgcHJvcGVydHkgcG9pbnRzXG4gICAgLy8gdG8gdGhlIG9yaWdpbmFsIGl0ZW0gaW4gdGhlIGFsbERhdGEgYXJyYXlcbiAgICAvLyBlYWNoIGxheWVyIGNhbiBpbXBsZW1lbnQgaXRzIG93biBnZXRIb3ZlckRhdGEgbWV0aG9kXG4gICAgcmV0dXJuIG9iamVjdC5kYXRhO1xuICB9XG5cbiAgLy8gUmVjdXJzaXZlbHkgY29weSBjb25maWcgb3ZlciB0byBhbiBlbXB0eSBsYXllclxuICAvLyB3aGVuIHJlY2VpdmVkIHNhdmVkIGNvbmZpZywgb3IgY29weSBjb25maWcgb3ZlciBmcm9tIGEgZGlmZmVyZW50IGxheWVyIHR5cGVcbiAgLy8gbWFrZSBzdXJlIHRvIG9ubHkgY29weSBvdmVyIHZhbHVlIHRvIGV4aXN0aW5nIGtleXNcbiAgYXNzaWduQ29uZmlnVG9MYXllcihvbGRDb25maWcsIG5ld0NvbmZpZykge1xuICAgIC8vIFRPRE86IGhhdmUgYSBiZXR0ZXIgd2F5IHRvIGNvcHkgb3ZlciBkaW1lbnNpb24gY29uZmlnIHJhbmdlXG4gICAgLy8gZS5nLiBoZXhhZ29uIGhlaWdodCBzaXplUmFuZ2UgLT4gcG9pbnQgcmFkaXVzIHNpemVSYW5nZVxuICAgIC8vIGRvbid0IGRlZXAgbWVyZ2UgdmlzdWFsQ2hhbm5lbCBmaWVsZFxuICAgIGNvbnN0IG5vdFRvRGVlcE1lcmdlID0gT2JqZWN0LnZhbHVlcyh0aGlzLnZpc3VhbENoYW5uZWxzKS5tYXAodiA9PiB2LmZpZWxkKTtcblxuICAgIC8vIGRvbid0IGRlZXAgbWVyZ2UgY29sb3IgcmFuZ2UsIHJldmVyc2VkOiBpcyBub3QgYSBrZXkgYnkgZGVmYXVsdFxuICAgIG5vdFRvRGVlcE1lcmdlLnB1c2goJ2NvbG9yUmFuZ2UnKTtcblxuICAgIC8vIGRvbid0IGNvcHkgb3ZlciBkb21haW5cbiAgICBjb25zdCBub3RUb0NvcHkgPSBPYmplY3QudmFsdWVzKHRoaXMudmlzdWFsQ2hhbm5lbHMpLm1hcCh2ID0+IHYuZG9tYWluKTtcbiAgICBjb25zdCBjb3BpZWQgPSB7fTtcblxuICAgIE9iamVjdC5rZXlzKG9sZENvbmZpZykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgaWYgKFxuICAgICAgICBpc1BsYWluT2JqZWN0KG9sZENvbmZpZ1trZXldKSAmJlxuICAgICAgICBpc1BsYWluT2JqZWN0KG5ld0NvbmZpZ1trZXldKSAmJlxuICAgICAgICAhbm90VG9EZWVwTWVyZ2UuaW5jbHVkZXMoa2V5KSAmJlxuICAgICAgICAhbm90VG9Db3B5LmluY2x1ZGVzKGtleSlcbiAgICAgICkge1xuICAgICAgICAvLyByZWN1cnNpdmVseSBhc3NpZ24gb2JqZWN0IHZhbHVlXG4gICAgICAgIGNvcGllZFtrZXldID0gdGhpcy5hc3NpZ25Db25maWdUb0xheWVyKG9sZENvbmZpZ1trZXldLCBuZXdDb25maWdba2V5XSk7XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICBub3ROdWxsb3JVbmRlZmluZWQobmV3Q29uZmlnW2tleV0pICYmXG4gICAgICAgICFub3RUb0NvcHkuaW5jbHVkZXMoa2V5KVxuICAgICAgKSB7XG4gICAgICAgIGNvcGllZFtrZXldID0gbmV3Q29uZmlnW2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb3BpZWRba2V5XSA9IG9sZENvbmZpZ1trZXldO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvcGllZDtcbiAgfVxuXG4gIHJlZ2lzdGVyVmlzQ29uZmlnKGxheWVyVmlzQ29uZmlncykge1xuICAgIE9iamVjdC5rZXlzKGxheWVyVmlzQ29uZmlncykuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGlmIChcbiAgICAgICAgdHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnICYmXG4gICAgICAgIExBWUVSX1ZJU19DT05GSUdTW2xheWVyVmlzQ29uZmlnc1tpdGVtXV1cbiAgICAgICkge1xuICAgICAgICAvLyBpZiBhc3NpZ25lZCBvbmUgb2YgZGVmYXVsdCBMQVlFUl9DT05GSUdTXG4gICAgICAgIHRoaXMuY29uZmlnLnZpc0NvbmZpZ1tpdGVtXSA9XG4gICAgICAgICAgTEFZRVJfVklTX0NPTkZJR1NbbGF5ZXJWaXNDb25maWdzW2l0ZW1dXS5kZWZhdWx0VmFsdWU7XG4gICAgICAgIHRoaXMudmlzQ29uZmlnU2V0dGluZ3NbaXRlbV0gPSBMQVlFUl9WSVNfQ09ORklHU1tsYXllclZpc0NvbmZpZ3NbaXRlbV1dO1xuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgWyd0eXBlJywgJ2RlZmF1bHRWYWx1ZSddLmV2ZXJ5KHAgPT4gbGF5ZXJWaXNDb25maWdzW2l0ZW1dW3BdKVxuICAgICAgKSB7XG4gICAgICAgIC8vIGlmIHByb3ZpZGVkIGN1c3RvbWl6ZWQgdmlzQ29uZmlnLCBhbmQgaGFzIHR5cGUgJiYgZGVmYXVsdFZhbHVlXG4gICAgICAgIC8vIFRPRE86IGZ1cnRoZXIgY2hlY2sgaWYgY3VzdG9taXplZCB2aXNDb25maWcgaXMgdmFsaWRcbiAgICAgICAgdGhpcy5jb25maWcudmlzQ29uZmlnW2l0ZW1dID0gbGF5ZXJWaXNDb25maWdzW2l0ZW1dLmRlZmF1bHRWYWx1ZTtcbiAgICAgICAgdGhpcy52aXNDb25maWdTZXR0aW5nc1tpdGVtXSA9IGxheWVyVmlzQ29uZmlnc1tpdGVtXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldExheWVyQ29sdW1ucygpIHtcbiAgICBjb25zdCByZXF1aXJlZCA9IHRoaXMucmVxdWlyZWRMYXllckNvbHVtbnMucmVkdWNlKFxuICAgICAgKGFjY3UsIGtleSkgPT4gKHtcbiAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgW2tleV06IHt2YWx1ZTogbnVsbCwgZmllbGRJZHg6IC0xfVxuICAgICAgfSksXG4gICAgICB7fVxuICAgICk7XG4gICAgY29uc3Qgb3B0aW9uYWwgPSB0aGlzLm9wdGlvbmFsQ29sdW1ucy5yZWR1Y2UoXG4gICAgICAoYWNjdSwga2V5KSA9PiAoe1xuICAgICAgICAuLi5hY2N1LFxuICAgICAgICBba2V5XToge3ZhbHVlOiBudWxsLCBmaWVsZElkeDogLTEsIG9wdGlvbmFsOiB0cnVlfVxuICAgICAgfSksXG4gICAgICB7fVxuICAgICk7XG5cbiAgICByZXR1cm4gey4uLnJlcXVpcmVkLCAuLi5vcHRpb25hbH07XG4gIH1cblxuICB1cGRhdGVMYXllckNvbmZpZyhuZXdDb25maWcpIHtcbiAgICB0aGlzLmNvbmZpZyA9IHsuLi50aGlzLmNvbmZpZywgLi4ubmV3Q29uZmlnfTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHVwZGF0ZUxheWVyVmlzQ29uZmlnKG5ld1Zpc0NvbmZpZykge1xuICAgIHRoaXMuY29uZmlnLnZpc0NvbmZpZyA9IHsuLi50aGlzLmNvbmZpZy52aXNDb25maWcsIC4uLm5ld1Zpc0NvbmZpZ307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgbGF5ZXIgaGFzIGFsbCBjb2x1bW5zXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBsYXllclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0geWVzIG9yIG5vXG4gICAqL1xuICBoYXNBbGxDb2x1bW5zKCkge1xuICAgIGNvbnN0IHtjb2x1bW5zfSA9IHRoaXMuY29uZmlnO1xuICAgIHJldHVybiAoXG4gICAgICBjb2x1bW5zICYmXG4gICAgICBPYmplY3QudmFsdWVzKGNvbHVtbnMpLmV2ZXJ5KHYgPT4ge1xuICAgICAgICByZXR1cm4gQm9vbGVhbih2Lm9wdGlvbmFsIHx8ICh2LnZhbHVlICYmIHYuZmllbGRJZHggPiAtMSkpO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgbGF5ZXIgaGFzIGRhdGFcbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGxheWVyXG4gICAqIEBwYXJhbSB7QXJyYXkgfCBPYmplY3R9IGxheWVyRGF0YVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0geWVzIG9yIG5vXG4gICAqL1xuICBoYXNMYXllckRhdGEobGF5ZXJEYXRhKSB7XG4gICAgaWYgKCFsYXllckRhdGEpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gQm9vbGVhbihsYXllckRhdGEuZGF0YSAmJiBsYXllckRhdGEuZGF0YS5sZW5ndGgpO1xuICB9XG5cbiAgaXNWYWxpZFRvU2F2ZSgpIHtcbiAgICByZXR1cm4gdGhpcy50eXBlICYmIHRoaXMuaGFzQWxsQ29sdW1ucygpO1xuICB9XG5cbiAgc2hvdWxkUmVuZGVyTGF5ZXIoZGF0YSkge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLnR5cGUgJiZcbiAgICAgIHRoaXMuaGFzQWxsQ29sdW1ucygpICYmXG4gICAgICB0aGlzLmNvbmZpZy5pc1Zpc2libGUgJiZcbiAgICAgIHRoaXMuaGFzTGF5ZXJEYXRhKGRhdGEpXG4gICAgKTtcbiAgfVxuXG4gIGdldFZpc0NoYW5uZWxTY2FsZShzY2FsZSwgZG9tYWluLCByYW5nZSwgZml4ZWQpIHtcbiAgICByZXR1cm4gU0NBTEVfRlVOQ1tmaXhlZCA/ICdsaW5lYXInIDogc2NhbGVdKClcbiAgICAgIC5kb21haW4oZG9tYWluKVxuICAgICAgLnJhbmdlKGZpeGVkID8gZG9tYWluIDogcmFuZ2UpO1xuICB9XG5cbiAgZ2V0UG9pbnRzQm91bmRzKGFsbERhdGEsIGdldFBvc2l0aW9uKSB7XG4gICAgLy8gbm8gbmVlZCB0byBsb29wIHRocm91Z2ggdGhlIGVudGlyZSBkYXRhc2V0XG4gICAgLy8gZ2V0IGEgc2FtcGxlIG9mIGRhdGEgdG8gY2FsY3VsYXRlIGJvdW5kc1xuICAgIGNvbnN0IHNhbXBsZURhdGEgPVxuICAgICAgYWxsRGF0YS5sZW5ndGggPiBNQVhfU0FNUExFX1NJWkVcbiAgICAgICAgPyBnZXRTYW1wbGVEYXRhKGFsbERhdGEsIE1BWF9TQU1QTEVfU0laRSlcbiAgICAgICAgOiBhbGxEYXRhO1xuICAgIGNvbnN0IHBvaW50cyA9IHNhbXBsZURhdGEubWFwKGdldFBvc2l0aW9uKTtcblxuICAgIGNvbnN0IGxhdEJvdW5kcyA9IGdldExhdExuZ0JvdW5kcyhwb2ludHMsIDEsIFstOTAsIDkwXSk7XG4gICAgY29uc3QgbG5nQm91bmRzID0gZ2V0TGF0TG5nQm91bmRzKHBvaW50cywgMCwgWy0xODAsIDE4MF0pO1xuXG4gICAgaWYgKCFsYXRCb3VuZHMgfHwgIWxuZ0JvdW5kcykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIFtsbmdCb3VuZHNbMF0sIGxhdEJvdW5kc1swXSwgbG5nQm91bmRzWzFdLCBsYXRCb3VuZHNbMV1dO1xuICB9XG5cbiAgZ2V0TGlnaHRTZXR0aW5nc0Zyb21Cb3VuZHMoYm91bmRzKSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYm91bmRzKSAmJiBib3VuZHMubGVuZ3RoID49IDRcbiAgICAgID8ge1xuICAgICAgICAgIC4uLkRFRkFVTFRfTElHSFRfU0VUVElOR1MsXG4gICAgICAgICAgbGlnaHRzUG9zaXRpb246IFtcbiAgICAgICAgICAgIC4uLmJvdW5kcy5zbGljZSgwLCAyKSxcbiAgICAgICAgICAgIERFRkFVTFRfTElHSFRfU0VUVElOR1MubGlnaHRzUG9zaXRpb25bMl0sXG4gICAgICAgICAgICAuLi5ib3VuZHMuc2xpY2UoMiwgNCksXG4gICAgICAgICAgICBERUZBVUxUX0xJR0hUX1NFVFRJTkdTLmxpZ2h0c1Bvc2l0aW9uWzVdXG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICA6IERFRkFVTFRfTElHSFRfU0VUVElOR1M7XG4gIH1cblxuICBnZXRFbmNvZGVkQ2hhbm5lbFZhbHVlKFxuICAgIHNjYWxlLFxuICAgIGRhdGEsXG4gICAgZmllbGQsXG4gICAgZGVmYXVsdFZhbHVlID0gTk9fVkFMVUVfQ09MT1IsXG4gICAgZ2V0VmFsdWUgPSBkZWZhdWx0R2V0RmllbGRWYWx1ZVxuICApIHtcbiAgICBjb25zdCB7dHlwZX0gPSBmaWVsZDtcbiAgICBjb25zdCB2YWx1ZSA9IGdldFZhbHVlKGZpZWxkLCBkYXRhKTtcbiAgICBsZXQgYXR0cmlidXRlVmFsdWU7XG4gICAgaWYgKHR5cGUgPT09IEFMTF9GSUVMRF9UWVBFUy50aW1lc3RhbXApIHtcbiAgICAgIC8vIHNob3VsZG4ndCBuZWVkIHRvIGNvbnZlcnQgaGVyZVxuICAgICAgLy8gc2NhbGUgRnVuY3Rpb24gc2hvdWxkIHRha2UgY2FyZSBvZiBpdFxuICAgICAgYXR0cmlidXRlVmFsdWUgPSBzY2FsZShuZXcgRGF0ZSh2YWx1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhdHRyaWJ1dGVWYWx1ZSA9IHNjYWxlKHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAoIWF0dHJpYnV0ZVZhbHVlKSB7XG4gICAgICBhdHRyaWJ1dGVWYWx1ZSA9IGRlZmF1bHRWYWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXR0cmlidXRlVmFsdWU7XG4gIH1cblxuICB1cGRhdGVNZXRhKG1ldGEpIHtcbiAgICB0aGlzLm1ldGEgPSB7Li4udGhpcy5tZXRhLCAuLi5tZXRhfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBoZWxwZXIgZnVuY3Rpb24gdG8gdXBkYXRlIG9uZSBsYXllciBkb21haW4gd2hlbiBzdGF0ZS5kYXRhIGNoYW5nZWRcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3RbXX0gZGF0YVxuICAgKiBAcGFyYW0ge09iamVjdFtdfSBhbGxEYXRhXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBsYXllclxuICAgKiBAcmV0dXJucyB7b2JqZWN0fSBsYXllclxuICAgKi9cbiAgdXBkYXRlTGF5ZXJEb21haW4oe2RhdGEsIGFsbERhdGF9KSB7XG4gICAgT2JqZWN0LnZhbHVlcyh0aGlzLnZpc3VhbENoYW5uZWxzKS5mb3JFYWNoKGNoYW5uZWwgPT4ge1xuICAgICAgY29uc3Qge2RvbWFpbn0gPSBjaGFubmVsO1xuICAgICAgY29uc3QgdXBkYXRlZERvbWFpbiA9IHRoaXMuY2FsY3VsYXRlTGF5ZXJEb21haW4oe2RhdGEsIGFsbERhdGF9LCBjaGFubmVsKTtcblxuICAgICAgdGhpcy51cGRhdGVMYXllckNvbmZpZyh7W2RvbWFpbl06IHVwZGF0ZWREb21haW59KTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdXBkYXRlTGF5ZXJWaXN1YWxDaGFubmVsKHtkYXRhLCBhbGxEYXRhfSwgY2hhbm5lbCkge1xuICAgIGNvbnN0IHZpc3VhbENoYW5uZWwgPSB0aGlzLnZpc3VhbENoYW5uZWxzW2NoYW5uZWxdO1xuICAgIGNvbnN0IHtmaWVsZCwgc2NhbGUsIGRvbWFpbiwgY2hhbm5lbFNjYWxlVHlwZX0gPSB2aXN1YWxDaGFubmVsO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnW2ZpZWxkXSkge1xuICAgICAgLy8gaWYgZmllbGQgaXMgc2VsZWN0ZWQsIGNoZWNrIGlmIGN1cnJlbnQgc2VsZWN0ZWQgc2NhbGUgaXNcbiAgICAgIC8vIHN1cHBvcnRlZCwgaWYgbm90LCB1cGRhdGUgdG8gZGVmYXVsdFxuICAgICAgY29uc3Qgc2NhbGVPcHRpb25zID1cbiAgICAgICAgRklFTERfT1BUU1t0aGlzLmNvbmZpZ1tmaWVsZF0udHlwZV0uc2NhbGVbY2hhbm5lbFNjYWxlVHlwZV07XG4gICAgICBpZiAoIXNjYWxlT3B0aW9ucy5pbmNsdWRlcyh0aGlzLmNvbmZpZ1tzY2FsZV0pKSB7XG4gICAgICAgIHRoaXMudXBkYXRlTGF5ZXJDb25maWcoe1tzY2FsZV06IHNjYWxlT3B0aW9uc1swXX0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNhbGN1bGF0ZSBsYXllciBjaGFubmVsIGRvbWFpblxuICAgIGNvbnN0IHVwZGF0ZWREb21haW4gPSB0aGlzLmNhbGN1bGF0ZUxheWVyRG9tYWluKFxuICAgICAge2RhdGEsIGFsbERhdGF9LFxuICAgICAgdmlzdWFsQ2hhbm5lbFxuICAgICk7XG5cbiAgICB0aGlzLnVwZGF0ZUxheWVyQ29uZmlnKHtbZG9tYWluXTogdXBkYXRlZERvbWFpbn0pO1xuICB9XG5cbiAgY2FsY3VsYXRlTGF5ZXJEb21haW4oe2RhdGEsIGFsbERhdGF9LCB2aXN1YWxDaGFubmVsKSB7XG4gICAgY29uc3QgZGVmYXVsdERvbWFpbiA9IFswLCAxXTtcbiAgICBjb25zdCB7c2NhbGV9ID0gdmlzdWFsQ2hhbm5lbDtcbiAgICBjb25zdCBzY2FsZVR5cGUgPSB0aGlzLmNvbmZpZ1tzY2FsZV07XG5cbiAgICBjb25zdCBmaWVsZCA9IHRoaXMuY29uZmlnW3Zpc3VhbENoYW5uZWwuZmllbGRdO1xuICAgIGlmICghZmllbGQpIHtcbiAgICAgIC8vIGlmIGNvbG9yRmllbGQgb3Igc2l6ZUZpZWxkIHdlcmUgc2V0IGJhY2sgdG8gbnVsbFxuICAgICAgcmV0dXJuIGRlZmF1bHREb21haW47XG4gICAgfVxuXG4gICAgaWYgKCFTQ0FMRV9UWVBFU1tzY2FsZVR5cGVdKSB7XG4gICAgICBDb25zb2xlLmVycm9yKGBzY2FsZSB0eXBlICR7c2NhbGVUeXBlfSBub3Qgc3VwcG9ydGVkYCk7XG4gICAgICByZXR1cm4gZGVmYXVsdERvbWFpbjtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiByZWZhY3RvciB0byBhZGQgdmFsdWVBY2Nlc3NvciB0byBmaWVsZFxuICAgIGNvbnN0IGZpZWxkSWR4ID0gZmllbGQudGFibGVGaWVsZEluZGV4IC0gMTtcbiAgICBjb25zdCBpc1RpbWUgPSBmaWVsZC50eXBlID09PSBBTExfRklFTERfVFlQRVMudGltZXN0YW1wO1xuICAgIGNvbnN0IHZhbHVlQWNjZXNzb3IgPSBtYXliZVRvRGF0ZS5iaW5kKFxuICAgICAgbnVsbCxcbiAgICAgIGlzVGltZSxcbiAgICAgIGZpZWxkSWR4LFxuICAgICAgZmllbGQuZm9ybWF0XG4gICAgKTtcbiAgICBjb25zdCBzb3J0RnVuY3Rpb24gPSBnZXRTb3J0aW5nRnVuY3Rpb24oZmllbGQudHlwZSk7XG5cbiAgICBzd2l0Y2ggKHNjYWxlVHlwZSkge1xuICAgICAgY2FzZSBTQ0FMRV9UWVBFUy5vcmRpbmFsOlxuICAgICAgY2FzZSBTQ0FMRV9UWVBFUy5wb2ludDpcbiAgICAgICAgLy8gZG8gbm90IHJlY2FsY3VsYXRlIG9yZGluYWwgZG9tYWluIGJhc2VkIG9uIGZpbHRlcnJlZCBkYXRhXG4gICAgICAgIHJldHVybiBnZXRPcmRpbmFsRG9tYWluKGFsbERhdGEsIHZhbHVlQWNjZXNzb3IpO1xuXG4gICAgICBjYXNlIFNDQUxFX1RZUEVTLnF1YW50aWxlOlxuICAgICAgICByZXR1cm4gZ2V0UXVhbnRpbGVEb21haW4oZGF0YSwgdmFsdWVBY2Nlc3Nvciwgc29ydEZ1bmN0aW9uKTtcblxuICAgICAgY2FzZSBTQ0FMRV9UWVBFUy5xdWFudGl6ZTpcbiAgICAgIGNhc2UgU0NBTEVfVFlQRVMubGluZWFyOlxuICAgICAgY2FzZSBTQ0FMRV9UWVBFUy5zcXJ0OlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGdldExpbmVhckRvbWFpbihkYXRhLCB2YWx1ZUFjY2Vzc29yKTtcbiAgICB9XG4gIH1cblxuICBpc0xheWVySG92ZXJlZChvYmplY3RJbmZvKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIG9iamVjdEluZm8gJiZcbiAgICAgIG9iamVjdEluZm8ubGF5ZXIgJiZcbiAgICAgIG9iamVjdEluZm8ucGlja2VkICYmXG4gICAgICBvYmplY3RJbmZvLmxheWVyLnByb3BzLmlkID09PSB0aGlzLmlkXG4gICAgKTtcbiAgfVxuXG4gIGdldFJhZGl1c1NjYWxlQnlab29tKHpvb20sIGZpeGVkUmFkaXVzKSB7XG4gICAgY29uc3QgcmFkaXVzQ2hhbm5lbCA9IE9iamVjdC52YWx1ZXModGhpcy52aXN1YWxDaGFubmVscykuZmluZChcbiAgICAgIHZjID0+IHZjLnByb3BlcnR5ID09PSAncmFkaXVzJ1xuICAgICk7XG5cbiAgICBpZiAoIXJhZGl1c0NoYW5uZWwpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH1cblxuICAgIGNvbnN0IGZpZWxkID0gcmFkaXVzQ2hhbm5lbC5maWVsZDtcbiAgICBjb25zdCBmaXhlZCA9XG4gICAgICBmaXhlZFJhZGl1cyA9PT0gdW5kZWZpbmVkXG4gICAgICAgID8gdGhpcy5jb25maWcudmlzQ29uZmlnLmZpeGVkUmFkaXVzXG4gICAgICAgIDogZml4ZWRSYWRpdXM7XG4gICAgY29uc3Qge3JhZGl1c30gPSB0aGlzLmNvbmZpZy52aXNDb25maWc7XG5cbiAgICByZXR1cm4gZml4ZWRcbiAgICAgID8gMVxuICAgICAgOiAodGhpcy5jb25maWdbZmllbGRdID8gMSA6IHJhZGl1cykgKiB0aGlzLmdldFpvb21GYWN0b3Ioem9vbSk7XG4gIH1cblxuICBzaG91bGRDYWxjdWxhdGVMYXllckRhdGEocHJvcHMpIHtcbiAgICByZXR1cm4gcHJvcHMuc29tZShwID0+ICF0aGlzLm5vbmVMYXllckRhdGFBZmZlY3RpbmdQcm9wcy5pbmNsdWRlcyhwKSk7XG4gIH1cbn1cbiJdfQ==