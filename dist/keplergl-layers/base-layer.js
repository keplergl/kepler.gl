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
    key: 'overlayType',
    get: function get() {
      return 'deckgl';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvYmFzZS1sYXllci5qcyJdLCJuYW1lcyI6WyJnZXREZWZhdWx0TGF5ZXJDb25maWciLCJnZW5lcmF0ZUNvbG9yIiwiTUFYX1NBTVBMRV9TSVpFIiwibGF5ZXJDb2xvcnMiLCJPYmplY3QiLCJ2YWx1ZXMiLCJtYXAiLCJpbmRleCIsImxlbmd0aCIsImNvbG9yTWFrZXIiLCJkZWZhdWx0R2V0RmllbGRWYWx1ZSIsImZpZWxkIiwiZCIsInRhYmxlRmllbGRJbmRleCIsInByb3BzIiwiZGF0YUlkIiwibGFiZWwiLCJjb2xvciIsIm5leHQiLCJ2YWx1ZSIsImNvbHVtbnMiLCJpc1Zpc2libGUiLCJpc0NvbmZpZ0FjdGl2ZSIsImhpZ2hsaWdodENvbG9yIiwiY29sb3JGaWVsZCIsImNvbG9yRG9tYWluIiwiY29sb3JTY2FsZSIsInNpemVEb21haW4iLCJzaXplU2NhbGUiLCJzaXplRmllbGQiLCJ2aXNDb25maWciLCJMYXllciIsImlkIiwiY29uZmlnIiwiZ2V0TGF5ZXJDb2x1bW5zIiwibWV0YSIsInZpc0NvbmZpZ1NldHRpbmdzIiwia2V5IiwibmFtZSIsImZpZWxkSWR4IiwicGFpciIsImNvbHVtblBhaXJzIiwicGFydG5lcktleSIsImZpZWxkUGFpcktleSIsInBhcnRuZXJGaWVsZFBhaXJLZXkiLCJ6b29tIiwiTWF0aCIsInBvdyIsIm1heCIsImRhdGEiLCJhbGxEYXRhIiwiZmlsdGVyZWRJbmRleCIsIm9iamVjdCIsIm9sZENvbmZpZyIsIm5ld0NvbmZpZyIsIm5vdFRvRGVlcE1lcmdlIiwidmlzdWFsQ2hhbm5lbHMiLCJ2IiwicHVzaCIsIm5vdFRvQ29weSIsImRvbWFpbiIsImNvcGllZCIsImtleXMiLCJmb3JFYWNoIiwiaW5jbHVkZXMiLCJhc3NpZ25Db25maWdUb0xheWVyIiwibGF5ZXJWaXNDb25maWdzIiwiaXRlbSIsImRlZmF1bHRWYWx1ZSIsImV2ZXJ5IiwicCIsInJlcXVpcmVkIiwicmVxdWlyZWRMYXllckNvbHVtbnMiLCJyZWR1Y2UiLCJhY2N1Iiwib3B0aW9uYWwiLCJvcHRpb25hbENvbHVtbnMiLCJuZXdWaXNDb25maWciLCJCb29sZWFuIiwibGF5ZXJEYXRhIiwidHlwZSIsImhhc0FsbENvbHVtbnMiLCJoYXNMYXllckRhdGEiLCJzY2FsZSIsInJhbmdlIiwiZml4ZWQiLCJnZXRQb3NpdGlvbiIsInNhbXBsZURhdGEiLCJwb2ludHMiLCJsYXRCb3VuZHMiLCJsbmdCb3VuZHMiLCJib3VuZHMiLCJBcnJheSIsImlzQXJyYXkiLCJsaWdodHNQb3NpdGlvbiIsInNsaWNlIiwiZ2V0VmFsdWUiLCJhdHRyaWJ1dGVWYWx1ZSIsInRpbWVzdGFtcCIsIkRhdGUiLCJjaGFubmVsIiwidXBkYXRlZERvbWFpbiIsImNhbGN1bGF0ZUxheWVyRG9tYWluIiwidXBkYXRlTGF5ZXJDb25maWciLCJ2aXN1YWxDaGFubmVsIiwiY2hhbm5lbFNjYWxlVHlwZSIsInNjYWxlT3B0aW9ucyIsImRlZmF1bHREb21haW4iLCJzY2FsZVR5cGUiLCJlcnJvciIsImlzVGltZSIsInZhbHVlQWNjZXNzb3IiLCJiaW5kIiwiZm9ybWF0Iiwic29ydEZ1bmN0aW9uIiwib3JkaW5hbCIsInBvaW50IiwicXVhbnRpbGUiLCJxdWFudGl6ZSIsImxpbmVhciIsInNxcnQiLCJvYmplY3RJbmZvIiwibGF5ZXIiLCJwaWNrZWQiLCJmaXhlZFJhZGl1cyIsInJhZGl1c0NoYW5uZWwiLCJmaW5kIiwidmMiLCJwcm9wZXJ0eSIsInVuZGVmaW5lZCIsInJhZGl1cyIsImdldFpvb21GYWN0b3IiLCJzb21lIiwibm9uZUxheWVyRGF0YUFmZmVjdGluZ1Byb3BzIiwic2l6ZSIsImxhdCIsImxuZyIsImxhdDAiLCJsbmcwIiwibGF0MSIsImxuZzEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFzRGdCQSxxQixHQUFBQSxxQjs7QUF0RGhCOztBQUNBOztBQUVBOztBQVNBOztBQUNBOztBQUVBOztBQU1BOztBQU9B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QUFLLE1BTkQ7QUFPSm9FLDRCQUFrQixnQ0FBZTZCO0FBUDdCO0FBVkQsT0FBUDtBQW9CRDs7QUFFRDs7Ozs7Ozt3QkFJa0I7QUFDaEIsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozt3QkFHOEI7QUFDNUIsYUFBTztBQUNMQyxhQUFLLEVBQUMvRixNQUFNLEtBQVAsRUFBY0csY0FBYyxLQUE1QixFQURBO0FBRUw2RixhQUFLLEVBQUNoRyxNQUFNLEtBQVAsRUFBY0csY0FBYyxLQUE1QjtBQUZBLE9BQVA7QUFJRDs7QUFFRDs7Ozs7O3dCQUc2QjtBQUMzQixhQUFPO0FBQ0w4RixjQUFNLEVBQUNqRyxNQUFNLE1BQVAsRUFBZUcsY0FBYyxLQUE3QixFQUREO0FBRUwrRixjQUFNLEVBQUNsRyxNQUFNLE1BQVAsRUFBZUcsY0FBYyxLQUE3QixFQUZEO0FBR0xnRyxjQUFNLEVBQUNuRyxNQUFNLE1BQVAsRUFBZUcsY0FBYyxLQUE3QixFQUhEO0FBSUxpRyxjQUFNLEVBQUNwRyxNQUFNLE1BQVAsRUFBZUcsY0FBYyxLQUE3QjtBQUpELE9BQVA7QUFNRDs7Ozs7a0JBN0ZrQlosSyIsImZpbGUiOiJiYXNlLWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtoZXhUb1JnYn0gZnJvbSAnLi4vdXRpbHMvY29sb3ItdXRpbHMnO1xuaW1wb3J0IHtjb25zb2xlIGFzIENvbnNvbGV9IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuXG5pbXBvcnQge1xuICBBTExfRklFTERfVFlQRVMsXG4gIERFRkFVTFRfTElHSFRfU0VUVElOR1MsXG4gIE5PX1ZBTFVFX0NPTE9SLFxuICBTQ0FMRV9UWVBFUyxcbiAgQ0hBTk5FTF9TQ0FMRVMsXG4gIEZJRUxEX09QVFMsXG4gIFNDQUxFX0ZVTkNcbn0gZnJvbSAnLi4vY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHt1YmVyRGF0YVZpekNvbG9yc30gZnJvbSAnLi4vY29uc3RhbnRzL3ViZXItdml6LWNvbG9ycyc7XG5pbXBvcnQge0xBWUVSX1ZJU19DT05GSUdTfSBmcm9tICcuL2xheWVyLWZhY3RvcnknO1xuXG5pbXBvcnQge1xuICBnZW5lcmF0ZUhhc2hJZCxcbiAgbm90TnVsbG9yVW5kZWZpbmVkLFxuICBpc1BsYWluT2JqZWN0XG59IGZyb20gJy4uL3V0aWxzL3V0aWxzJztcblxuaW1wb3J0IHtcbiAgZ2V0U2FtcGxlRGF0YSxcbiAgZ2V0TGF0TG5nQm91bmRzLFxuICBtYXliZVRvRGF0ZSxcbiAgZ2V0U29ydGluZ0Z1bmN0aW9uXG59IGZyb20gJy4uL3V0aWxzL2RhdGEtdXRpbHMnO1xuXG5pbXBvcnQge1xuICBnZXRRdWFudGlsZURvbWFpbixcbiAgZ2V0T3JkaW5hbERvbWFpbixcbiAgZ2V0TGluZWFyRG9tYWluXG59IGZyb20gJy4uL3V0aWxzL2RhdGEtc2NhbGUtdXRpbHMnO1xuXG4vKipcbiAqIEFwcHJveC4gbnVtYmVyIG9mIHBvaW50cyB0byBzYW1wbGUgaW4gYSBsYXJnZSBkYXRhIHNldFxuICogQHR5cGUge251bWJlcn1cbiAqL1xuY29uc3QgTUFYX1NBTVBMRV9TSVpFID0gNTAwMDtcblxuY29uc3QgbGF5ZXJDb2xvcnMgPSBPYmplY3QudmFsdWVzKHViZXJEYXRhVml6Q29sb3JzKS5tYXAoaGV4VG9SZ2IpO1xuZnVuY3Rpb24qIGdlbmVyYXRlQ29sb3IoKSB7XG4gIGxldCBpbmRleCA9IDA7XG4gIHdoaWxlIChpbmRleCA8IGxheWVyQ29sb3JzLmxlbmd0aCArIDEpIHtcbiAgICBpZiAoaW5kZXggPT09IGxheWVyQ29sb3JzLmxlbmd0aCkge1xuICAgICAgaW5kZXggPSAwO1xuICAgIH1cbiAgICB5aWVsZCBsYXllckNvbG9yc1tpbmRleCsrXTtcbiAgfVxufVxuXG5jb25zdCBjb2xvck1ha2VyID0gZ2VuZXJhdGVDb2xvcigpO1xuY29uc3QgZGVmYXVsdEdldEZpZWxkVmFsdWUgPSAoZmllbGQsIGQpID0+IGRbZmllbGQudGFibGVGaWVsZEluZGV4IC0gMV07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWZhdWx0TGF5ZXJDb25maWcocHJvcHMgPSB7fSkge1xuICByZXR1cm4ge1xuICAgIGRhdGFJZDogcHJvcHMuZGF0YUlkIHx8IG51bGwsXG4gICAgbGFiZWw6IHByb3BzLmxhYmVsIHx8ICduZXcgbGF5ZXInLFxuICAgIGNvbG9yOiBwcm9wcy5jb2xvciB8fCBjb2xvck1ha2VyLm5leHQoKS52YWx1ZSxcbiAgICBjb2x1bW5zOiBwcm9wcy5jb2x1bW5zIHx8IG51bGwsXG4gICAgaXNWaXNpYmxlOiBwcm9wcy5pc1Zpc2libGUgfHwgZmFsc2UsXG4gICAgaXNDb25maWdBY3RpdmU6IHByb3BzLmlzQ29uZmlnQWN0aXZlIHx8IGZhbHNlLFxuICAgIGhpZ2hsaWdodENvbG9yOiBwcm9wcy5oaWdobGlnaHRDb2xvciB8fCBbMjUyLCAyNDIsIDI2XSxcblxuICAgIC8vIFRPRE86IHJlZmFjdG9yIHRoaXMgaW50byBzZXBlcmF0ZSB2aXN1YWwgQ2hhbm5lbCBjb25maWdcbiAgICAvLyBjb2xvciBieSBmaWVsZCwgZG9tYWluIGlzIHNldCBieSBmaWx0ZXJzLCBmaWVsZCwgc2NhbGUgdHlwZVxuICAgIGNvbG9yRmllbGQ6IG51bGwsXG4gICAgY29sb3JEb21haW46IFswLCAxXSxcbiAgICBjb2xvclNjYWxlOiAncXVhbnRpbGUnLFxuXG4gICAgLy8gY29sb3IgYnkgc2l6ZSwgZG9tYWluIGlzIHNldCBieSBmaWx0ZXJzLCBmaWVsZCwgc2NhbGUgdHlwZVxuICAgIHNpemVEb21haW46IFswLCAxXSxcbiAgICBzaXplU2NhbGU6ICdsaW5lYXInLFxuICAgIHNpemVGaWVsZDogbnVsbCxcblxuICAgIHZpc0NvbmZpZzoge31cbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGF5ZXIge1xuICBjb25zdHJ1Y3Rvcihwcm9wcyA9IHt9KSB7XG4gICAgdGhpcy5pZCA9IHByb3BzLmlkIHx8IGdlbmVyYXRlSGFzaElkKDYpO1xuXG4gICAgdGhpcy5jb25maWcgPSBnZXREZWZhdWx0TGF5ZXJDb25maWcoe1xuICAgICAgY29sdW1uczogdGhpcy5nZXRMYXllckNvbHVtbnMoKSxcbiAgICAgIC4uLnByb3BzXG4gICAgfSk7XG5cbiAgICAvLyBtZXRhXG4gICAgdGhpcy5tZXRhID0ge307XG5cbiAgICAvLyB2aXNDb25maWdTZXR0aW5nc1xuICAgIHRoaXMudmlzQ29uZmlnU2V0dGluZ3MgPSB7fTtcbiAgICAvLyBsYXllciB1dGlsaXR5IG1ldGhvZHNcbiAgICAvLyB0aGlzLmdldExpZ2h0U2V0dGluZ3NGcm9tQm91bmRzID0gZ2V0TGlnaHRTZXR0aW5nc0Zyb21Cb3VuZHM7XG4gIH1cblxuICBnZXQgb3ZlcmxheVR5cGUoKSB7XG4gICAgcmV0dXJuICdkZWNrZ2wnO1xuICB9XG5cbiAgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBnZXQgaXNBZ2dyZWdhdGVkKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldCByZXF1aXJlZExheWVyQ29sdW1ucygpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBnZXQgb3B0aW9uYWxDb2x1bW5zKCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGdldCBub25lTGF5ZXJEYXRhQWZmZWN0aW5nUHJvcHMoKSB7XG4gICAgcmV0dXJuIFsnbGFiZWwnLCAnb3BhY2l0eScsICd0aGlja25lc3MnLCAnaXNWaXNpYmxlJ107XG4gIH1cblxuICBnZXQgdmlzdWFsQ2hhbm5lbHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbG9yOiB7XG4gICAgICAgIHByb3BlcnR5OiAnY29sb3InLFxuICAgICAgICBmaWVsZDogJ2NvbG9yRmllbGQnLFxuICAgICAgICBzY2FsZTogJ2NvbG9yU2NhbGUnLFxuICAgICAgICBkb21haW46ICdjb2xvckRvbWFpbicsXG4gICAgICAgIHJhbmdlOiAnY29sb3JSYW5nZScsXG4gICAgICAgIGtleTogJ2NvbG9yJyxcbiAgICAgICAgY2hhbm5lbFNjYWxlVHlwZTogQ0hBTk5FTF9TQ0FMRVMuY29sb3JcbiAgICAgIH0sXG4gICAgICBzaXplOiB7XG4gICAgICAgIHByb3BlcnR5OiAnc2l6ZScsXG4gICAgICAgIGZpZWxkOiAnc2l6ZUZpZWxkJyxcbiAgICAgICAgc2NhbGU6ICdzaXplU2NhbGUnLFxuICAgICAgICBkb21haW46ICdzaXplRG9tYWluJyxcbiAgICAgICAgcmFuZ2U6ICdzaXplUmFuZ2UnLFxuICAgICAgICBrZXk6ICdzaXplJyxcbiAgICAgICAgY2hhbm5lbFNjYWxlVHlwZTogQ0hBTk5FTF9TQ0FMRVMuc2l6ZVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKlxuICAgKiBDb2x1bW4gcGFpcnMgbWFwcyBsYXllciBjb2x1bW4gdG8gYSBzcGVjaWZpYyBmaWVsZCBwYWlycyxcbiAgICogQnkgZGVmYXVsdCwgaXQgaXMgc2V0IHRvIG51bGxcbiAgICovXG4gIGdldCBjb2x1bW5QYWlycygpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qXG4gICAqIERlZmF1bHQgcG9pbnQgY29sdW1uIHBhaXJzLCBjYW4gYmUgdXNlZCBmb3IgcG9pbnQgYmFzZWQgbGF5ZXJzOiBwb2ludCwgaWNvbiBldGMuXG4gICAqL1xuICBnZXQgZGVmYXVsdFBvaW50Q29sdW1uUGFpcnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhdDoge3BhaXI6ICdsbmcnLCBmaWVsZFBhaXJLZXk6ICdsYXQnfSxcbiAgICAgIGxuZzoge3BhaXI6ICdsYXQnLCBmaWVsZFBhaXJLZXk6ICdsbmcnfVxuICAgIH07XG4gIH1cblxuICAvKlxuICAgKiBEZWZhdWx0IGxpbmsgY29sdW1uIHBhaXJzLCBjYW4gYmUgdXNlZCBmb3IgbGluayBiYXNlZCBsYXllcnM6IGFyYywgbGluZSBldGNcbiAgICovXG4gIGdldCBkZWZhdWx0TGlua0NvbHVtblBhaXJzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBsYXQwOiB7cGFpcjogJ2xuZzAnLCBmaWVsZFBhaXJLZXk6ICdsYXQnfSxcbiAgICAgIGxuZzA6IHtwYWlyOiAnbGF0MCcsIGZpZWxkUGFpcktleTogJ2xuZyd9LFxuICAgICAgbGF0MToge3BhaXI6ICdsbmcxJywgZmllbGRQYWlyS2V5OiAnbGF0J30sXG4gICAgICBsbmcxOiB7cGFpcjogJ2xhdDEnLCBmaWVsZFBhaXJLZXk6ICdsbmcnfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQXNzaWduIGEgZmllbGQgdG8gbGF5ZXIgY29sdW1uLCByZXR1cm4gY29sdW1uIGNvbmZpZ1xuICAgKiBAcGFyYW0ga2V5IC0gQ29sdW1uIEtleVxuICAgKiBAcGFyYW0gZmllbGQgLSBTZWxlY3RlZCBmaWVsZFxuICAgKiBAcmV0dXJucyB7e319IC0gQ29sdW1uIGNvbmZpZ1xuICAgKi9cbiAgYXNzaWduQ29sdW1uKGtleSwgZmllbGQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4udGhpcy5jb25maWcuY29sdW1ucyxcbiAgICAgIFtrZXldOiB7XG4gICAgICAgIC4uLnRoaXMuY29uZmlnLmNvbHVtbnNba2V5XSxcbiAgICAgICAgdmFsdWU6IGZpZWxkLm5hbWUsXG4gICAgICAgIGZpZWxkSWR4OiBmaWVsZC50YWJsZUZpZWxkSW5kZXggLSAxXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NpZ24gYSBmaWVsZCBwYWlyIHRvIGNvbHVtbiBjb25maWcsIHJldHVybiBjb2x1bW4gY29uZmlnXG4gICAqIEBwYXJhbSBrZXkgLSBDb2x1bW4gS2V5XG4gICAqIEBwYXJhbSBwYWlyIC0gZmllbGQgUGFpclxuICAgKiBAcmV0dXJucyB7e319IC0gQ29sdW1uIGNvbmZpZ1xuICAgKi9cbiAgYXNzaWduQ29sdW1uUGFpcnMoa2V5LCBwYWlyKSB7XG4gICAgaWYgKCF0aGlzLmNvbHVtblBhaXJzIHx8ICF0aGlzLmNvbHVtblBhaXJzW2tleV0pIHtcbiAgICAgIC8vIHNob3VsZCBub3QgZW5kIGluIHRoaXMgc3RhdGVcbiAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5jb2x1bW5zO1xuICAgIH1cblxuICAgIGNvbnN0IHtwYWlyOiBwYXJ0bmVyS2V5LCBmaWVsZFBhaXJLZXl9ID0gdGhpcy5jb2x1bW5QYWlyc1trZXldO1xuICAgIGNvbnN0IHtmaWVsZFBhaXJLZXk6IHBhcnRuZXJGaWVsZFBhaXJLZXl9ID0gdGhpcy5jb2x1bW5QYWlyc1twYXJ0bmVyS2V5XTtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi50aGlzLmNvbmZpZy5jb2x1bW5zLFxuICAgICAgW2tleV06IHBhaXJbZmllbGRQYWlyS2V5XSxcbiAgICAgIFtwYXJ0bmVyS2V5XTogcGFpcltwYXJ0bmVyRmllbGRQYWlyS2V5XVxuICAgIH07XG4gIH1cblxuICBnZXRab29tRmFjdG9yKHpvb20pIHtcbiAgICByZXR1cm4gTWF0aC5wb3coMiwgTWF0aC5tYXgoMTQgLSB6b29tLCAwKSk7XG4gIH1cblxuICBnZXRFbGV2YXRpb25ab29tRmFjdG9yKHpvb20pIHtcbiAgICByZXR1cm4gTWF0aC5wb3coMiwgTWF0aC5tYXgoOCAtIHpvb20sIDApKTtcbiAgfVxuXG4gIGZvcm1hdExheWVyRGF0YShkYXRhLCBhbGxEYXRhLCBmaWx0ZXJlZEluZGV4KSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgcmVuZGVyTGF5ZXIoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgZ2V0SG92ZXJEYXRhKG9iamVjdCkge1xuICAgIGlmICghb2JqZWN0KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgLy8gYnkgZGVmYXVsdCwgZWFjaCBlbnRyeSBvZiBsYXllckRhdGEgc2hvdWxkIGhhdmUgYSBkYXRhIHByb3BlcnR5IHBvaW50c1xuICAgIC8vIHRvIHRoZSBvcmlnaW5hbCBpdGVtIGluIHRoZSBhbGxEYXRhIGFycmF5XG4gICAgLy8gZWFjaCBsYXllciBjYW4gaW1wbGVtZW50IGl0cyBvd24gZ2V0SG92ZXJEYXRhIG1ldGhvZFxuICAgIHJldHVybiBvYmplY3QuZGF0YTtcbiAgfVxuXG4gIC8vIFJlY3Vyc2l2ZWx5IGNvcHkgY29uZmlnIG92ZXIgdG8gYW4gZW1wdHkgbGF5ZXJcbiAgLy8gd2hlbiByZWNlaXZlZCBzYXZlZCBjb25maWcsIG9yIGNvcHkgY29uZmlnIG92ZXIgZnJvbSBhIGRpZmZlcmVudCBsYXllciB0eXBlXG4gIC8vIG1ha2Ugc3VyZSB0byBvbmx5IGNvcHkgb3ZlciB2YWx1ZSB0byBleGlzdGluZyBrZXlzXG4gIGFzc2lnbkNvbmZpZ1RvTGF5ZXIob2xkQ29uZmlnLCBuZXdDb25maWcpIHtcbiAgICAvLyBUT0RPOiBoYXZlIGEgYmV0dGVyIHdheSB0byBjb3B5IG92ZXIgZGltZW5zaW9uIGNvbmZpZyByYW5nZVxuICAgIC8vIGUuZy4gaGV4YWdvbiBoZWlnaHQgc2l6ZVJhbmdlIC0+IHBvaW50IHJhZGl1cyBzaXplUmFuZ2VcbiAgICAvLyBkb24ndCBkZWVwIG1lcmdlIHZpc3VhbENoYW5uZWwgZmllbGRcbiAgICBjb25zdCBub3RUb0RlZXBNZXJnZSA9IE9iamVjdC52YWx1ZXModGhpcy52aXN1YWxDaGFubmVscykubWFwKHYgPT4gdi5maWVsZCk7XG5cbiAgICAvLyBkb24ndCBkZWVwIG1lcmdlIGNvbG9yIHJhbmdlLCByZXZlcnNlZDogaXMgbm90IGEga2V5IGJ5IGRlZmF1bHRcbiAgICBub3RUb0RlZXBNZXJnZS5wdXNoKCdjb2xvclJhbmdlJyk7XG5cbiAgICAvLyBkb24ndCBjb3B5IG92ZXIgZG9tYWluXG4gICAgY29uc3Qgbm90VG9Db3B5ID0gT2JqZWN0LnZhbHVlcyh0aGlzLnZpc3VhbENoYW5uZWxzKS5tYXAodiA9PiB2LmRvbWFpbik7XG4gICAgY29uc3QgY29waWVkID0ge307XG5cbiAgICBPYmplY3Qua2V5cyhvbGRDb25maWcpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGlmIChcbiAgICAgICAgaXNQbGFpbk9iamVjdChvbGRDb25maWdba2V5XSkgJiZcbiAgICAgICAgaXNQbGFpbk9iamVjdChuZXdDb25maWdba2V5XSkgJiZcbiAgICAgICAgIW5vdFRvRGVlcE1lcmdlLmluY2x1ZGVzKGtleSkgJiZcbiAgICAgICAgIW5vdFRvQ29weS5pbmNsdWRlcyhrZXkpXG4gICAgICApIHtcbiAgICAgICAgLy8gcmVjdXJzaXZlbHkgYXNzaWduIG9iamVjdCB2YWx1ZVxuICAgICAgICBjb3BpZWRba2V5XSA9IHRoaXMuYXNzaWduQ29uZmlnVG9MYXllcihvbGRDb25maWdba2V5XSwgbmV3Q29uZmlnW2tleV0pO1xuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgbm90TnVsbG9yVW5kZWZpbmVkKG5ld0NvbmZpZ1trZXldKSAmJlxuICAgICAgICAhbm90VG9Db3B5LmluY2x1ZGVzKGtleSlcbiAgICAgICkge1xuICAgICAgICBjb3BpZWRba2V5XSA9IG5ld0NvbmZpZ1trZXldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29waWVkW2tleV0gPSBvbGRDb25maWdba2V5XTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBjb3BpZWQ7XG4gIH1cblxuICByZWdpc3RlclZpc0NvbmZpZyhsYXllclZpc0NvbmZpZ3MpIHtcbiAgICBPYmplY3Qua2V5cyhsYXllclZpc0NvbmZpZ3MpLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBpZiAoXG4gICAgICAgIHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJyAmJlxuICAgICAgICBMQVlFUl9WSVNfQ09ORklHU1tsYXllclZpc0NvbmZpZ3NbaXRlbV1dXG4gICAgICApIHtcbiAgICAgICAgLy8gaWYgYXNzaWduZWQgb25lIG9mIGRlZmF1bHQgTEFZRVJfQ09ORklHU1xuICAgICAgICB0aGlzLmNvbmZpZy52aXNDb25maWdbaXRlbV0gPVxuICAgICAgICAgIExBWUVSX1ZJU19DT05GSUdTW2xheWVyVmlzQ29uZmlnc1tpdGVtXV0uZGVmYXVsdFZhbHVlO1xuICAgICAgICB0aGlzLnZpc0NvbmZpZ1NldHRpbmdzW2l0ZW1dID0gTEFZRVJfVklTX0NPTkZJR1NbbGF5ZXJWaXNDb25maWdzW2l0ZW1dXTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIFsndHlwZScsICdkZWZhdWx0VmFsdWUnXS5ldmVyeShwID0+IGxheWVyVmlzQ29uZmlnc1tpdGVtXVtwXSlcbiAgICAgICkge1xuICAgICAgICAvLyBpZiBwcm92aWRlZCBjdXN0b21pemVkIHZpc0NvbmZpZywgYW5kIGhhcyB0eXBlICYmIGRlZmF1bHRWYWx1ZVxuICAgICAgICAvLyBUT0RPOiBmdXJ0aGVyIGNoZWNrIGlmIGN1c3RvbWl6ZWQgdmlzQ29uZmlnIGlzIHZhbGlkXG4gICAgICAgIHRoaXMuY29uZmlnLnZpc0NvbmZpZ1tpdGVtXSA9IGxheWVyVmlzQ29uZmlnc1tpdGVtXS5kZWZhdWx0VmFsdWU7XG4gICAgICAgIHRoaXMudmlzQ29uZmlnU2V0dGluZ3NbaXRlbV0gPSBsYXllclZpc0NvbmZpZ3NbaXRlbV07XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRMYXllckNvbHVtbnMoKSB7XG4gICAgY29uc3QgcmVxdWlyZWQgPSB0aGlzLnJlcXVpcmVkTGF5ZXJDb2x1bW5zLnJlZHVjZShcbiAgICAgIChhY2N1LCBrZXkpID0+ICh7XG4gICAgICAgIC4uLmFjY3UsXG4gICAgICAgIFtrZXldOiB7dmFsdWU6IG51bGwsIGZpZWxkSWR4OiAtMX1cbiAgICAgIH0pLFxuICAgICAge31cbiAgICApO1xuICAgIGNvbnN0IG9wdGlvbmFsID0gdGhpcy5vcHRpb25hbENvbHVtbnMucmVkdWNlKFxuICAgICAgKGFjY3UsIGtleSkgPT4gKHtcbiAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgW2tleV06IHt2YWx1ZTogbnVsbCwgZmllbGRJZHg6IC0xLCBvcHRpb25hbDogdHJ1ZX1cbiAgICAgIH0pLFxuICAgICAge31cbiAgICApO1xuXG4gICAgcmV0dXJuIHsuLi5yZXF1aXJlZCwgLi4ub3B0aW9uYWx9O1xuICB9XG5cbiAgdXBkYXRlTGF5ZXJDb25maWcobmV3Q29uZmlnKSB7XG4gICAgdGhpcy5jb25maWcgPSB7Li4udGhpcy5jb25maWcsIC4uLm5ld0NvbmZpZ307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB1cGRhdGVMYXllclZpc0NvbmZpZyhuZXdWaXNDb25maWcpIHtcbiAgICB0aGlzLmNvbmZpZy52aXNDb25maWcgPSB7Li4udGhpcy5jb25maWcudmlzQ29uZmlnLCAuLi5uZXdWaXNDb25maWd9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIGxheWVyIGhhcyBhbGwgY29sdW1uc1xuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gbGF5ZXJcbiAgICogQHJldHVybnMge2Jvb2xlYW59IHllcyBvciBub1xuICAgKi9cbiAgaGFzQWxsQ29sdW1ucygpIHtcbiAgICBjb25zdCB7Y29sdW1uc30gPSB0aGlzLmNvbmZpZztcbiAgICByZXR1cm4gKFxuICAgICAgY29sdW1ucyAmJlxuICAgICAgT2JqZWN0LnZhbHVlcyhjb2x1bW5zKS5ldmVyeSh2ID0+IHtcbiAgICAgICAgcmV0dXJuIEJvb2xlYW4odi5vcHRpb25hbCB8fCAodi52YWx1ZSAmJiB2LmZpZWxkSWR4ID4gLTEpKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIGxheWVyIGhhcyBkYXRhXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBsYXllclxuICAgKiBAcGFyYW0ge0FycmF5IHwgT2JqZWN0fSBsYXllckRhdGFcbiAgICogQHJldHVybnMge2Jvb2xlYW59IHllcyBvciBub1xuICAgKi9cbiAgaGFzTGF5ZXJEYXRhKGxheWVyRGF0YSkge1xuICAgIGlmICghbGF5ZXJEYXRhKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIEJvb2xlYW4obGF5ZXJEYXRhLmRhdGEgJiYgbGF5ZXJEYXRhLmRhdGEubGVuZ3RoKTtcbiAgfVxuXG4gIGlzVmFsaWRUb1NhdmUoKSB7XG4gICAgcmV0dXJuIHRoaXMudHlwZSAmJiB0aGlzLmhhc0FsbENvbHVtbnMoKTtcbiAgfVxuXG4gIHNob3VsZFJlbmRlckxheWVyKGRhdGEpIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy50eXBlICYmXG4gICAgICB0aGlzLmhhc0FsbENvbHVtbnMoKSAmJlxuICAgICAgdGhpcy5jb25maWcuaXNWaXNpYmxlICYmXG4gICAgICB0aGlzLmhhc0xheWVyRGF0YShkYXRhKVxuICAgICk7XG4gIH1cblxuICBnZXRWaXNDaGFubmVsU2NhbGUoc2NhbGUsIGRvbWFpbiwgcmFuZ2UsIGZpeGVkKSB7XG4gICAgcmV0dXJuIFNDQUxFX0ZVTkNbZml4ZWQgPyAnbGluZWFyJyA6IHNjYWxlXSgpXG4gICAgICAuZG9tYWluKGRvbWFpbilcbiAgICAgIC5yYW5nZShmaXhlZCA/IGRvbWFpbiA6IHJhbmdlKTtcbiAgfVxuXG4gIGdldFBvaW50c0JvdW5kcyhhbGxEYXRhLCBnZXRQb3NpdGlvbikge1xuICAgIC8vIG5vIG5lZWQgdG8gbG9vcCB0aHJvdWdoIHRoZSBlbnRpcmUgZGF0YXNldFxuICAgIC8vIGdldCBhIHNhbXBsZSBvZiBkYXRhIHRvIGNhbGN1bGF0ZSBib3VuZHNcbiAgICBjb25zdCBzYW1wbGVEYXRhID1cbiAgICAgIGFsbERhdGEubGVuZ3RoID4gTUFYX1NBTVBMRV9TSVpFXG4gICAgICAgID8gZ2V0U2FtcGxlRGF0YShhbGxEYXRhLCBNQVhfU0FNUExFX1NJWkUpXG4gICAgICAgIDogYWxsRGF0YTtcbiAgICBjb25zdCBwb2ludHMgPSBzYW1wbGVEYXRhLm1hcChnZXRQb3NpdGlvbik7XG5cbiAgICBjb25zdCBsYXRCb3VuZHMgPSBnZXRMYXRMbmdCb3VuZHMocG9pbnRzLCAxLCBbLTkwLCA5MF0pO1xuICAgIGNvbnN0IGxuZ0JvdW5kcyA9IGdldExhdExuZ0JvdW5kcyhwb2ludHMsIDAsIFstMTgwLCAxODBdKTtcblxuICAgIGlmICghbGF0Qm91bmRzIHx8ICFsbmdCb3VuZHMpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBbbG5nQm91bmRzWzBdLCBsYXRCb3VuZHNbMF0sIGxuZ0JvdW5kc1sxXSwgbGF0Qm91bmRzWzFdXTtcbiAgfVxuXG4gIGdldExpZ2h0U2V0dGluZ3NGcm9tQm91bmRzKGJvdW5kcykge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KGJvdW5kcykgJiYgYm91bmRzLmxlbmd0aCA+PSA0XG4gICAgICA/IHtcbiAgICAgICAgICAuLi5ERUZBVUxUX0xJR0hUX1NFVFRJTkdTLFxuICAgICAgICAgIGxpZ2h0c1Bvc2l0aW9uOiBbXG4gICAgICAgICAgICAuLi5ib3VuZHMuc2xpY2UoMCwgMiksXG4gICAgICAgICAgICBERUZBVUxUX0xJR0hUX1NFVFRJTkdTLmxpZ2h0c1Bvc2l0aW9uWzJdLFxuICAgICAgICAgICAgLi4uYm91bmRzLnNsaWNlKDIsIDQpLFxuICAgICAgICAgICAgREVGQVVMVF9MSUdIVF9TRVRUSU5HUy5saWdodHNQb3NpdGlvbls1XVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgOiBERUZBVUxUX0xJR0hUX1NFVFRJTkdTO1xuICB9XG5cbiAgZ2V0RW5jb2RlZENoYW5uZWxWYWx1ZShcbiAgICBzY2FsZSxcbiAgICBkYXRhLFxuICAgIGZpZWxkLFxuICAgIGRlZmF1bHRWYWx1ZSA9IE5PX1ZBTFVFX0NPTE9SLFxuICAgIGdldFZhbHVlID0gZGVmYXVsdEdldEZpZWxkVmFsdWVcbiAgKSB7XG4gICAgY29uc3Qge3R5cGV9ID0gZmllbGQ7XG4gICAgY29uc3QgdmFsdWUgPSBnZXRWYWx1ZShmaWVsZCwgZGF0YSk7XG4gICAgbGV0IGF0dHJpYnV0ZVZhbHVlO1xuICAgIGlmICh0eXBlID09PSBBTExfRklFTERfVFlQRVMudGltZXN0YW1wKSB7XG4gICAgICAvLyBzaG91bGRuJ3QgbmVlZCB0byBjb252ZXJ0IGhlcmVcbiAgICAgIC8vIHNjYWxlIEZ1bmN0aW9uIHNob3VsZCB0YWtlIGNhcmUgb2YgaXRcbiAgICAgIGF0dHJpYnV0ZVZhbHVlID0gc2NhbGUobmV3IERhdGUodmFsdWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXR0cmlidXRlVmFsdWUgPSBzY2FsZSh2YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKCFhdHRyaWJ1dGVWYWx1ZSkge1xuICAgICAgYXR0cmlidXRlVmFsdWUgPSBkZWZhdWx0VmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF0dHJpYnV0ZVZhbHVlO1xuICB9XG5cbiAgdXBkYXRlTWV0YShtZXRhKSB7XG4gICAgdGhpcy5tZXRhID0gey4uLnRoaXMubWV0YSwgLi4ubWV0YX07XG4gIH1cblxuICAvKipcbiAgICogaGVscGVyIGZ1bmN0aW9uIHRvIHVwZGF0ZSBvbmUgbGF5ZXIgZG9tYWluIHdoZW4gc3RhdGUuZGF0YSBjaGFuZ2VkXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0W119IGRhdGFcbiAgICogQHBhcmFtIHtPYmplY3RbXX0gYWxsRGF0YVxuICAgKiBAcGFyYW0ge29iamVjdH0gbGF5ZXJcbiAgICogQHJldHVybnMge29iamVjdH0gbGF5ZXJcbiAgICovXG4gIHVwZGF0ZUxheWVyRG9tYWluKHtkYXRhLCBhbGxEYXRhfSkge1xuICAgIE9iamVjdC52YWx1ZXModGhpcy52aXN1YWxDaGFubmVscykuZm9yRWFjaChjaGFubmVsID0+IHtcbiAgICAgIGNvbnN0IHtkb21haW59ID0gY2hhbm5lbDtcbiAgICAgIGNvbnN0IHVwZGF0ZWREb21haW4gPSB0aGlzLmNhbGN1bGF0ZUxheWVyRG9tYWluKHtkYXRhLCBhbGxEYXRhfSwgY2hhbm5lbCk7XG5cbiAgICAgIHRoaXMudXBkYXRlTGF5ZXJDb25maWcoe1tkb21haW5dOiB1cGRhdGVkRG9tYWlufSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbCh7ZGF0YSwgYWxsRGF0YX0sIGNoYW5uZWwpIHtcbiAgICBjb25zdCB2aXN1YWxDaGFubmVsID0gdGhpcy52aXN1YWxDaGFubmVsc1tjaGFubmVsXTtcbiAgICBjb25zdCB7ZmllbGQsIHNjYWxlLCBkb21haW4sIGNoYW5uZWxTY2FsZVR5cGV9ID0gdmlzdWFsQ2hhbm5lbDtcblxuICAgIGlmICh0aGlzLmNvbmZpZ1tmaWVsZF0pIHtcbiAgICAgIC8vIGlmIGZpZWxkIGlzIHNlbGVjdGVkLCBjaGVjayBpZiBjdXJyZW50IHNlbGVjdGVkIHNjYWxlIGlzXG4gICAgICAvLyBzdXBwb3J0ZWQsIGlmIG5vdCwgdXBkYXRlIHRvIGRlZmF1bHRcbiAgICAgIGNvbnN0IHNjYWxlT3B0aW9ucyA9XG4gICAgICAgIEZJRUxEX09QVFNbdGhpcy5jb25maWdbZmllbGRdLnR5cGVdLnNjYWxlW2NoYW5uZWxTY2FsZVR5cGVdO1xuICAgICAgaWYgKCFzY2FsZU9wdGlvbnMuaW5jbHVkZXModGhpcy5jb25maWdbc2NhbGVdKSkge1xuICAgICAgICB0aGlzLnVwZGF0ZUxheWVyQ29uZmlnKHtbc2NhbGVdOiBzY2FsZU9wdGlvbnNbMF19KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjYWxjdWxhdGUgbGF5ZXIgY2hhbm5lbCBkb21haW5cbiAgICBjb25zdCB1cGRhdGVkRG9tYWluID0gdGhpcy5jYWxjdWxhdGVMYXllckRvbWFpbihcbiAgICAgIHtkYXRhLCBhbGxEYXRhfSxcbiAgICAgIHZpc3VhbENoYW5uZWxcbiAgICApO1xuXG4gICAgdGhpcy51cGRhdGVMYXllckNvbmZpZyh7W2RvbWFpbl06IHVwZGF0ZWREb21haW59KTtcbiAgfVxuXG4gIGNhbGN1bGF0ZUxheWVyRG9tYWluKHtkYXRhLCBhbGxEYXRhfSwgdmlzdWFsQ2hhbm5lbCkge1xuICAgIGNvbnN0IGRlZmF1bHREb21haW4gPSBbMCwgMV07XG4gICAgY29uc3Qge3NjYWxlfSA9IHZpc3VhbENoYW5uZWw7XG4gICAgY29uc3Qgc2NhbGVUeXBlID0gdGhpcy5jb25maWdbc2NhbGVdO1xuXG4gICAgY29uc3QgZmllbGQgPSB0aGlzLmNvbmZpZ1t2aXN1YWxDaGFubmVsLmZpZWxkXTtcbiAgICBpZiAoIWZpZWxkKSB7XG4gICAgICAvLyBpZiBjb2xvckZpZWxkIG9yIHNpemVGaWVsZCB3ZXJlIHNldCBiYWNrIHRvIG51bGxcbiAgICAgIHJldHVybiBkZWZhdWx0RG9tYWluO1xuICAgIH1cblxuICAgIGlmICghU0NBTEVfVFlQRVNbc2NhbGVUeXBlXSkge1xuICAgICAgQ29uc29sZS5lcnJvcihgc2NhbGUgdHlwZSAke3NjYWxlVHlwZX0gbm90IHN1cHBvcnRlZGApO1xuICAgICAgcmV0dXJuIGRlZmF1bHREb21haW47XG4gICAgfVxuXG4gICAgLy8gVE9ETzogcmVmYWN0b3IgdG8gYWRkIHZhbHVlQWNjZXNzb3IgdG8gZmllbGRcbiAgICBjb25zdCBmaWVsZElkeCA9IGZpZWxkLnRhYmxlRmllbGRJbmRleCAtIDE7XG4gICAgY29uc3QgaXNUaW1lID0gZmllbGQudHlwZSA9PT0gQUxMX0ZJRUxEX1RZUEVTLnRpbWVzdGFtcDtcbiAgICBjb25zdCB2YWx1ZUFjY2Vzc29yID0gbWF5YmVUb0RhdGUuYmluZChcbiAgICAgIG51bGwsXG4gICAgICBpc1RpbWUsXG4gICAgICBmaWVsZElkeCxcbiAgICAgIGZpZWxkLmZvcm1hdFxuICAgICk7XG4gICAgY29uc3Qgc29ydEZ1bmN0aW9uID0gZ2V0U29ydGluZ0Z1bmN0aW9uKGZpZWxkLnR5cGUpO1xuXG4gICAgc3dpdGNoIChzY2FsZVR5cGUpIHtcbiAgICAgIGNhc2UgU0NBTEVfVFlQRVMub3JkaW5hbDpcbiAgICAgIGNhc2UgU0NBTEVfVFlQRVMucG9pbnQ6XG4gICAgICAgIC8vIGRvIG5vdCByZWNhbGN1bGF0ZSBvcmRpbmFsIGRvbWFpbiBiYXNlZCBvbiBmaWx0ZXJyZWQgZGF0YVxuICAgICAgICByZXR1cm4gZ2V0T3JkaW5hbERvbWFpbihhbGxEYXRhLCB2YWx1ZUFjY2Vzc29yKTtcblxuICAgICAgY2FzZSBTQ0FMRV9UWVBFUy5xdWFudGlsZTpcbiAgICAgICAgcmV0dXJuIGdldFF1YW50aWxlRG9tYWluKGRhdGEsIHZhbHVlQWNjZXNzb3IsIHNvcnRGdW5jdGlvbik7XG5cbiAgICAgIGNhc2UgU0NBTEVfVFlQRVMucXVhbnRpemU6XG4gICAgICBjYXNlIFNDQUxFX1RZUEVTLmxpbmVhcjpcbiAgICAgIGNhc2UgU0NBTEVfVFlQRVMuc3FydDpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBnZXRMaW5lYXJEb21haW4oZGF0YSwgdmFsdWVBY2Nlc3Nvcik7XG4gICAgfVxuICB9XG5cbiAgaXNMYXllckhvdmVyZWQob2JqZWN0SW5mbykge1xuICAgIHJldHVybiAoXG4gICAgICBvYmplY3RJbmZvICYmXG4gICAgICBvYmplY3RJbmZvLmxheWVyICYmXG4gICAgICBvYmplY3RJbmZvLnBpY2tlZCAmJlxuICAgICAgb2JqZWN0SW5mby5sYXllci5wcm9wcy5pZCA9PT0gdGhpcy5pZFxuICAgICk7XG4gIH1cblxuICBnZXRSYWRpdXNTY2FsZUJ5Wm9vbSh6b29tLCBmaXhlZFJhZGl1cykge1xuICAgIGNvbnN0IHJhZGl1c0NoYW5uZWwgPSBPYmplY3QudmFsdWVzKHRoaXMudmlzdWFsQ2hhbm5lbHMpLmZpbmQoXG4gICAgICB2YyA9PiB2Yy5wcm9wZXJ0eSA9PT0gJ3JhZGl1cydcbiAgICApO1xuXG4gICAgaWYgKCFyYWRpdXNDaGFubmVsKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9XG5cbiAgICBjb25zdCBmaWVsZCA9IHJhZGl1c0NoYW5uZWwuZmllbGQ7XG4gICAgY29uc3QgZml4ZWQgPVxuICAgICAgZml4ZWRSYWRpdXMgPT09IHVuZGVmaW5lZFxuICAgICAgICA/IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5maXhlZFJhZGl1c1xuICAgICAgICA6IGZpeGVkUmFkaXVzO1xuICAgIGNvbnN0IHtyYWRpdXN9ID0gdGhpcy5jb25maWcudmlzQ29uZmlnO1xuXG4gICAgcmV0dXJuIGZpeGVkXG4gICAgICA/IDFcbiAgICAgIDogKHRoaXMuY29uZmlnW2ZpZWxkXSA/IDEgOiByYWRpdXMpICogdGhpcy5nZXRab29tRmFjdG9yKHpvb20pO1xuICB9XG5cbiAgc2hvdWxkQ2FsY3VsYXRlTGF5ZXJEYXRhKHByb3BzKSB7XG4gICAgcmV0dXJuIHByb3BzLnNvbWUocCA9PiAhdGhpcy5ub25lTGF5ZXJEYXRhQWZmZWN0aW5nUHJvcHMuaW5jbHVkZXMocCkpO1xuICB9XG59XG4iXX0=