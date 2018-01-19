'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

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

  /**
   * Assign a field to layer column, return column config
   * @param key - Column Key
   * @param field - Selected field
   * @returns {{}} - Column config
   */
  Layer.prototype.assignColumn = function assignColumn(key, field) {
    var _extends2;

    return (0, _extends7.default)({}, this.config.columns, (_extends2 = {}, _extends2[key] = (0, _extends7.default)({}, this.config.columns[key], {
      value: field.name,
      fieldIdx: field.tableFieldIndex - 1
    }), _extends2));
  };

  /**
   * Assign a field pair to column config, return column config
   * @param key - Column Key
   * @param pair - field Pair
   * @returns {{}} - Column config
   */


  Layer.prototype.assignColumnPairs = function assignColumnPairs(key, pair) {
    var _extends3;

    if (!this.columnPairs || !this.columnPairs[key]) {
      // should not end in this state
      return this.config.columns;
    }

    var _columnPairs$key = this.columnPairs[key],
        partnerKey = _columnPairs$key.pair,
        fieldPairKey = _columnPairs$key.fieldPairKey;
    var partnerFieldPairKey = this.columnPairs[partnerKey].fieldPairKey;


    return (0, _extends7.default)({}, this.config.columns, (_extends3 = {}, _extends3[key] = pair[fieldPairKey], _extends3[partnerKey] = pair[partnerFieldPairKey], _extends3));
  };

  Layer.prototype.getZoomFactor = function getZoomFactor(zoom) {
    return Math.pow(2, Math.max(14 - zoom, 0));
  };

  Layer.prototype.getElevationZoomFactor = function getElevationZoomFactor(zoom) {
    return Math.pow(2, Math.max(8 - zoom, 0));
  };

  Layer.prototype.formatLayerData = function formatLayerData(data, allData, filteredIndex) {
    return {};
  };

  Layer.prototype.renderLayer = function renderLayer() {
    return [];
  };

  Layer.prototype.getHoverData = function getHoverData(object) {
    if (!object) {
      return null;
    }
    // by default, each entry of layerData should have a data property points
    // to the original item in the allData array
    // each layer can implement its own getHoverData method
    return object.data;
  };

  // Recursively copy config over to an empty layer
  // when received saved config, or copy config over from a different layer type
  // make sure to only copy over value to existing keys


  Layer.prototype.assignConfigToLayer = function assignConfigToLayer(oldConfig, newConfig) {
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
  };

  Layer.prototype.registerVisConfig = function registerVisConfig(layerVisConfigs) {
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
  };

  Layer.prototype.getLayerColumns = function getLayerColumns() {
    var required = this.requiredLayerColumns.reduce(function (accu, key) {
      var _extends4;

      return (0, _extends7.default)({}, accu, (_extends4 = {}, _extends4[key] = { value: null, fieldIdx: -1 }, _extends4));
    }, {});
    var optional = this.optionalColumns.reduce(function (accu, key) {
      var _extends5;

      return (0, _extends7.default)({}, accu, (_extends5 = {}, _extends5[key] = { value: null, fieldIdx: -1, optional: true }, _extends5));
    }, {});

    return (0, _extends7.default)({}, required, optional);
  };

  Layer.prototype.updateLayerConfig = function updateLayerConfig(newConfig) {
    this.config = (0, _extends7.default)({}, this.config, newConfig);
    return this;
  };

  Layer.prototype.updateLayerVisConfig = function updateLayerVisConfig(newVisConfig) {
    this.config.visConfig = (0, _extends7.default)({}, this.config.visConfig, newVisConfig);
    return this;
  };
  /**
   * Check whether layer has all columns
   *
   * @param {object} layer
   * @returns {boolean} yes or no
   */


  Layer.prototype.hasAllColumns = function hasAllColumns() {
    var columns = this.config.columns;

    return columns && Object.values(columns).every(function (v) {
      return Boolean(v.optional || v.value && v.fieldIdx > -1);
    });
  };

  /**
   * Check whether layer has data
   *
   * @param {object} layer
   * @param {Array | Object} layerData
   * @returns {boolean} yes or no
   */


  Layer.prototype.hasLayerData = function hasLayerData(layerData) {
    if (!layerData) {
      return false;
    }

    return Boolean(layerData.data && layerData.data.length);
  };

  Layer.prototype.isValidToSave = function isValidToSave() {
    return this.type && this.hasAllColumns();
  };

  Layer.prototype.shouldRenderLayer = function shouldRenderLayer(data) {
    return this.type && this.hasAllColumns() && this.config.isVisible && this.hasLayerData(data);
  };

  Layer.prototype.getVisChannelScale = function getVisChannelScale(scale, domain, range, fixed) {
    return _defaultSettings.SCALE_FUNC[fixed ? 'linear' : scale]().domain(domain).range(fixed ? domain : range);
  };

  Layer.prototype.getPointsBounds = function getPointsBounds(allData, getPosition) {
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
  };

  Layer.prototype.getLightSettingsFromBounds = function getLightSettingsFromBounds(bounds) {
    return Array.isArray(bounds) && bounds.length >= 4 ? (0, _extends7.default)({}, _defaultSettings.DEFAULT_LIGHT_SETTINGS, {
      lightsPosition: [].concat(bounds.slice(0, 2), [_defaultSettings.DEFAULT_LIGHT_SETTINGS.lightsPosition[2]], bounds.slice(2, 4), [_defaultSettings.DEFAULT_LIGHT_SETTINGS.lightsPosition[5]])
    }) : _defaultSettings.DEFAULT_LIGHT_SETTINGS;
  };

  Layer.prototype.getEncodedChannelValue = function getEncodedChannelValue(scale, data, field) {
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
  };

  Layer.prototype.updateMeta = function updateMeta(meta) {
    this.meta = (0, _extends7.default)({}, this.meta, meta);
  };

  /**
   * helper function to update one layer domain when state.data changed
   *
   * @param {Object[]} data
   * @param {Object[]} allData
   * @param {object} layer
   * @returns {object} layer
   */


  Layer.prototype.updateLayerDomain = function updateLayerDomain(_ref) {
    var _this3 = this;

    var data = _ref.data,
        allData = _ref.allData;

    Object.values(this.visualChannels).forEach(function (channel) {
      var _this3$updateLayerCon;

      var domain = channel.domain;

      var updatedDomain = _this3.calculateLayerDomain({ data: data, allData: allData }, channel);

      _this3.updateLayerConfig((_this3$updateLayerCon = {}, _this3$updateLayerCon[domain] = updatedDomain, _this3$updateLayerCon));
    });

    return this;
  };

  Layer.prototype.updateLayerVisualChannel = function updateLayerVisualChannel(_ref2, channel) {
    var _updateLayerConfig2;

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
        var _updateLayerConfig;

        this.updateLayerConfig((_updateLayerConfig = {}, _updateLayerConfig[scale] = scaleOptions[0], _updateLayerConfig));
      }
    }

    // calculate layer channel domain
    var updatedDomain = this.calculateLayerDomain({ data: data, allData: allData }, visualChannel);

    this.updateLayerConfig((_updateLayerConfig2 = {}, _updateLayerConfig2[domain] = updatedDomain, _updateLayerConfig2));
  };

  Layer.prototype.calculateLayerDomain = function calculateLayerDomain(_ref3, visualChannel) {
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
  };

  Layer.prototype.isLayerHovered = function isLayerHovered(objectInfo) {
    return objectInfo && objectInfo.layer && objectInfo.picked && objectInfo.layer.props.id === this.id;
  };

  Layer.prototype.getRadiusScaleByZoom = function getRadiusScaleByZoom(zoom, fixedRadius) {
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
  };

  Layer.prototype.shouldCalculateLayerData = function shouldCalculateLayerData(props) {
    var _this4 = this;

    return props.some(function (p) {
      return !_this4.noneLayerDataAffectingProps.includes(p);
    });
  };

  (0, _createClass3.default)(Layer, [{
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvYmFzZS1sYXllci5qcyJdLCJuYW1lcyI6WyJnZXREZWZhdWx0TGF5ZXJDb25maWciLCJnZW5lcmF0ZUNvbG9yIiwiTUFYX1NBTVBMRV9TSVpFIiwiaW5kZXgiLCJ1YmVyQ29sb3JzIiwiT2JqZWN0IiwidmFsdWVzIiwibGVuZ3RoIiwiY29sb3JNYWtlciIsImRlZmF1bHRHZXRGaWVsZFZhbHVlIiwiZmllbGQiLCJkIiwidGFibGVGaWVsZEluZGV4IiwicHJvcHMiLCJkYXRhSWQiLCJsYWJlbCIsImNvbG9yIiwibmV4dCIsInZhbHVlIiwiY29sdW1ucyIsImlzVmlzaWJsZSIsImlzQ29uZmlnQWN0aXZlIiwiaGlnaGxpZ2h0Q29sb3IiLCJjb2xvckZpZWxkIiwiY29sb3JEb21haW4iLCJjb2xvclNjYWxlIiwic2l6ZURvbWFpbiIsInNpemVTY2FsZSIsInNpemVGaWVsZCIsInZpc0NvbmZpZyIsIkxheWVyIiwiaWQiLCJjb25maWciLCJnZXRMYXllckNvbHVtbnMiLCJtZXRhIiwidmlzQ29uZmlnU2V0dGluZ3MiLCJhc3NpZ25Db2x1bW4iLCJrZXkiLCJuYW1lIiwiZmllbGRJZHgiLCJhc3NpZ25Db2x1bW5QYWlycyIsInBhaXIiLCJjb2x1bW5QYWlycyIsInBhcnRuZXJLZXkiLCJmaWVsZFBhaXJLZXkiLCJwYXJ0bmVyRmllbGRQYWlyS2V5IiwiZ2V0Wm9vbUZhY3RvciIsInpvb20iLCJNYXRoIiwicG93IiwibWF4IiwiZ2V0RWxldmF0aW9uWm9vbUZhY3RvciIsImZvcm1hdExheWVyRGF0YSIsImRhdGEiLCJhbGxEYXRhIiwiZmlsdGVyZWRJbmRleCIsInJlbmRlckxheWVyIiwiZ2V0SG92ZXJEYXRhIiwib2JqZWN0IiwiYXNzaWduQ29uZmlnVG9MYXllciIsIm9sZENvbmZpZyIsIm5ld0NvbmZpZyIsIm5vdFRvRGVlcE1lcmdlIiwidmlzdWFsQ2hhbm5lbHMiLCJtYXAiLCJ2IiwicHVzaCIsIm5vdFRvQ29weSIsImRvbWFpbiIsImNvcGllZCIsImtleXMiLCJmb3JFYWNoIiwiaW5jbHVkZXMiLCJyZWdpc3RlclZpc0NvbmZpZyIsImxheWVyVmlzQ29uZmlncyIsIml0ZW0iLCJkZWZhdWx0VmFsdWUiLCJldmVyeSIsInAiLCJyZXF1aXJlZCIsInJlcXVpcmVkTGF5ZXJDb2x1bW5zIiwicmVkdWNlIiwiYWNjdSIsIm9wdGlvbmFsIiwib3B0aW9uYWxDb2x1bW5zIiwidXBkYXRlTGF5ZXJDb25maWciLCJ1cGRhdGVMYXllclZpc0NvbmZpZyIsIm5ld1Zpc0NvbmZpZyIsImhhc0FsbENvbHVtbnMiLCJCb29sZWFuIiwiaGFzTGF5ZXJEYXRhIiwibGF5ZXJEYXRhIiwiaXNWYWxpZFRvU2F2ZSIsInR5cGUiLCJzaG91bGRSZW5kZXJMYXllciIsImdldFZpc0NoYW5uZWxTY2FsZSIsInNjYWxlIiwicmFuZ2UiLCJmaXhlZCIsImdldFBvaW50c0JvdW5kcyIsImdldFBvc2l0aW9uIiwic2FtcGxlRGF0YSIsInBvaW50cyIsImxhdEJvdW5kcyIsImxuZ0JvdW5kcyIsImdldExpZ2h0U2V0dGluZ3NGcm9tQm91bmRzIiwiYm91bmRzIiwiQXJyYXkiLCJpc0FycmF5IiwibGlnaHRzUG9zaXRpb24iLCJzbGljZSIsImdldEVuY29kZWRDaGFubmVsVmFsdWUiLCJnZXRWYWx1ZSIsImF0dHJpYnV0ZVZhbHVlIiwidGltZXN0YW1wIiwiRGF0ZSIsInVwZGF0ZU1ldGEiLCJ1cGRhdGVMYXllckRvbWFpbiIsImNoYW5uZWwiLCJ1cGRhdGVkRG9tYWluIiwiY2FsY3VsYXRlTGF5ZXJEb21haW4iLCJ1cGRhdGVMYXllclZpc3VhbENoYW5uZWwiLCJ2aXN1YWxDaGFubmVsIiwiY2hhbm5lbFNjYWxlVHlwZSIsInNjYWxlT3B0aW9ucyIsImRlZmF1bHREb21haW4iLCJzY2FsZVR5cGUiLCJlcnJvciIsImlzVGltZSIsInZhbHVlQWNjZXNzb3IiLCJiaW5kIiwiZm9ybWF0Iiwic29ydEZ1bmN0aW9uIiwib3JkaW5hbCIsInBvaW50IiwicXVhbnRpbGUiLCJxdWFudGl6ZSIsImxpbmVhciIsInNxcnQiLCJpc0xheWVySG92ZXJlZCIsIm9iamVjdEluZm8iLCJsYXllciIsInBpY2tlZCIsImdldFJhZGl1c1NjYWxlQnlab29tIiwiZml4ZWRSYWRpdXMiLCJyYWRpdXNDaGFubmVsIiwiZmluZCIsInZjIiwicHJvcGVydHkiLCJ1bmRlZmluZWQiLCJyYWRpdXMiLCJzaG91bGRDYWxjdWxhdGVMYXllckRhdGEiLCJzb21lIiwibm9uZUxheWVyRGF0YUFmZmVjdGluZ1Byb3BzIiwic2l6ZSIsImxhdCIsImxuZyIsImxhdDAiLCJsbmcwIiwibGF0MSIsImxuZzEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBc0RnQkEscUIsR0FBQUEscUI7O0FBdERoQjs7QUFDQTs7QUFFQTs7QUFTQTs7QUFDQTs7QUFFQTs7QUFNQTs7QUFPQTs7OztzREFZVUMsYTs7QUFOVjs7OztBQUlBLElBQU1DLGtCQUFrQixJQUF4Qjs7QUFFQSxTQUFVRCxhQUFWO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNNRSxlQUROLEdBQ2MsQ0FEZDtBQUVRQyxvQkFGUixHQUVxQkMsT0FBT0MsTUFBUCxrQ0FGckI7O0FBQUE7QUFBQSxnQkFHU0gsUUFBUUMsV0FBV0csTUFBWCxHQUFvQixDQUhyQztBQUFBO0FBQUE7QUFBQTs7QUFJSSxjQUFJSixVQUFVQyxXQUFXRyxNQUF6QixFQUFpQztBQUMvQkosb0JBQVEsQ0FBUjtBQUNEO0FBTkw7QUFBQSxpQkFPVSwwQkFBU0MsV0FBV0QsT0FBWCxDQUFULENBUFY7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVdBLElBQU1LLGFBQWFQLGVBQW5CO0FBQ0EsSUFBTVEsdUJBQXVCLFNBQXZCQSxvQkFBdUIsQ0FBQ0MsS0FBRCxFQUFRQyxDQUFSO0FBQUEsU0FBY0EsRUFBRUQsTUFBTUUsZUFBTixHQUF3QixDQUExQixDQUFkO0FBQUEsQ0FBN0I7O0FBRU8s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QSxPQUFQO0FBSUQ7O0FBRUQ7Ozs7Ozt3QkFHNkI7QUFDM0IsYUFBTztBQUNMaUgsY0FBTSxFQUFDcEgsTUFBTSxNQUFQLEVBQWVHLGNBQWMsS0FBN0IsRUFERDtBQUVMa0gsY0FBTSxFQUFDckgsTUFBTSxNQUFQLEVBQWVHLGNBQWMsS0FBN0IsRUFGRDtBQUdMbUgsY0FBTSxFQUFDdEgsTUFBTSxNQUFQLEVBQWVHLGNBQWMsS0FBN0IsRUFIRDtBQUlMb0gsY0FBTSxFQUFDdkgsTUFBTSxNQUFQLEVBQWVHLGNBQWMsS0FBN0I7QUFKRCxPQUFQO0FBTUQ7Ozs7O2tCQXpGa0JkLEsiLCJmaWxlIjoiYmFzZS1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aGV4VG9SZ2J9IGZyb20gJy4uL3V0aWxzL2NvbG9yLXV0aWxzJztcbmltcG9ydCB7Y29uc29sZSBhcyBDb25zb2xlfSBmcm9tICdnbG9iYWwvd2luZG93JztcblxuaW1wb3J0IHtcbiAgQUxMX0ZJRUxEX1RZUEVTLFxuICBERUZBVUxUX0xJR0hUX1NFVFRJTkdTLFxuICBOT19WQUxVRV9DT0xPUixcbiAgU0NBTEVfVFlQRVMsXG4gIENIQU5ORUxfU0NBTEVTLFxuICBGSUVMRF9PUFRTLFxuICBTQ0FMRV9GVU5DXG59IGZyb20gJy4uL2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCB7dWJlckRhdGFWaXpDb2xvcnN9IGZyb20gJy4uL2NvbnN0YW50cy91YmVyLXZpei1jb2xvcnMnO1xuaW1wb3J0IHtMQVlFUl9WSVNfQ09ORklHU30gZnJvbSAnLi9sYXllci1mYWN0b3J5JztcblxuaW1wb3J0IHtcbiAgZ2VuZXJhdGVIYXNoSWQsXG4gIG5vdE51bGxvclVuZGVmaW5lZCxcbiAgaXNQbGFpbk9iamVjdFxufSBmcm9tICcuLi91dGlscy91dGlscyc7XG5cbmltcG9ydCB7XG4gIGdldFNhbXBsZURhdGEsXG4gIGdldExhdExuZ0JvdW5kcyxcbiAgbWF5YmVUb0RhdGUsXG4gIGdldFNvcnRpbmdGdW5jdGlvblxufSBmcm9tICcuLi91dGlscy9kYXRhLXV0aWxzJztcblxuaW1wb3J0IHtcbiAgZ2V0UXVhbnRpbGVEb21haW4sXG4gIGdldE9yZGluYWxEb21haW4sXG4gIGdldExpbmVhckRvbWFpblxufSBmcm9tICcuLi91dGlscy9kYXRhLXNjYWxlLXV0aWxzJztcblxuLyoqXG4gKiBBcHByb3guIG51bWJlciBvZiBwb2ludHMgdG8gc2FtcGxlIGluIGEgbGFyZ2UgZGF0YSBzZXRcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKi9cbmNvbnN0IE1BWF9TQU1QTEVfU0laRSA9IDUwMDA7XG5cbmZ1bmN0aW9uKiBnZW5lcmF0ZUNvbG9yKCkge1xuICBsZXQgaW5kZXggPSAwO1xuICBjb25zdCB1YmVyQ29sb3JzID0gT2JqZWN0LnZhbHVlcyh1YmVyRGF0YVZpekNvbG9ycyk7XG4gIHdoaWxlIChpbmRleCA8IHViZXJDb2xvcnMubGVuZ3RoICsgMSkge1xuICAgIGlmIChpbmRleCA9PT0gdWJlckNvbG9ycy5sZW5ndGgpIHtcbiAgICAgIGluZGV4ID0gMDtcbiAgICB9XG4gICAgeWllbGQgaGV4VG9SZ2IodWJlckNvbG9yc1tpbmRleCsrXSk7XG4gIH1cbn1cblxuY29uc3QgY29sb3JNYWtlciA9IGdlbmVyYXRlQ29sb3IoKTtcbmNvbnN0IGRlZmF1bHRHZXRGaWVsZFZhbHVlID0gKGZpZWxkLCBkKSA9PiBkW2ZpZWxkLnRhYmxlRmllbGRJbmRleCAtIDFdO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVmYXVsdExheWVyQ29uZmlnKHByb3BzID0ge30pIHtcbiAgcmV0dXJuIHtcbiAgICBkYXRhSWQ6IHByb3BzLmRhdGFJZCB8fCBudWxsLFxuICAgIGxhYmVsOiBwcm9wcy5sYWJlbCB8fCAnbmV3IGxheWVyJyxcbiAgICBjb2xvcjogcHJvcHMuY29sb3IgfHwgY29sb3JNYWtlci5uZXh0KCkudmFsdWUsXG4gICAgY29sdW1uczogcHJvcHMuY29sdW1ucyB8fCBudWxsLFxuICAgIGlzVmlzaWJsZTogcHJvcHMuaXNWaXNpYmxlIHx8IGZhbHNlLFxuICAgIGlzQ29uZmlnQWN0aXZlOiBwcm9wcy5pc0NvbmZpZ0FjdGl2ZSB8fCBmYWxzZSxcbiAgICBoaWdobGlnaHRDb2xvcjogcHJvcHMuaGlnaGxpZ2h0Q29sb3IgfHwgWzI1MiwgMjQyLCAyNl0sXG5cbiAgICAvLyBUT0RPOiByZWZhY3RvciB0aGlzIGludG8gc2VwZXJhdGUgdmlzdWFsIENoYW5uZWwgY29uZmlnXG4gICAgLy8gY29sb3IgYnkgZmllbGQsIGRvbWFpbiBpcyBzZXQgYnkgZmlsdGVycywgZmllbGQsIHNjYWxlIHR5cGVcbiAgICBjb2xvckZpZWxkOiBudWxsLFxuICAgIGNvbG9yRG9tYWluOiBbMCwgMV0sXG4gICAgY29sb3JTY2FsZTogJ3F1YW50aWxlJyxcblxuICAgIC8vIGNvbG9yIGJ5IHNpemUsIGRvbWFpbiBpcyBzZXQgYnkgZmlsdGVycywgZmllbGQsIHNjYWxlIHR5cGVcbiAgICBzaXplRG9tYWluOiBbMCwgMV0sXG4gICAgc2l6ZVNjYWxlOiAnbGluZWFyJyxcbiAgICBzaXplRmllbGQ6IG51bGwsXG5cbiAgICB2aXNDb25maWc6IHt9XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExheWVyIHtcbiAgY29uc3RydWN0b3IocHJvcHMgPSB7fSkge1xuICAgIHRoaXMuaWQgPSBwcm9wcy5pZCB8fCBnZW5lcmF0ZUhhc2hJZCg2KTtcblxuICAgIHRoaXMuY29uZmlnID0gZ2V0RGVmYXVsdExheWVyQ29uZmlnKHtcbiAgICAgIGNvbHVtbnM6IHRoaXMuZ2V0TGF5ZXJDb2x1bW5zKCksXG4gICAgICAuLi5wcm9wc1xuICAgIH0pO1xuXG4gICAgLy8gbWV0YVxuICAgIHRoaXMubWV0YSA9IHt9O1xuXG4gICAgLy8gdmlzQ29uZmlnU2V0dGluZ3NcbiAgICB0aGlzLnZpc0NvbmZpZ1NldHRpbmdzID0ge307XG4gICAgLy8gbGF5ZXIgdXRpbGl0eSBtZXRob2RzXG4gICAgLy8gdGhpcy5nZXRMaWdodFNldHRpbmdzRnJvbUJvdW5kcyA9IGdldExpZ2h0U2V0dGluZ3NGcm9tQm91bmRzO1xuICB9XG5cbiAgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBnZXQgaXNBZ2dyZWdhdGVkKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldCByZXF1aXJlZExheWVyQ29sdW1ucygpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBnZXQgb3B0aW9uYWxDb2x1bW5zKCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGdldCBub25lTGF5ZXJEYXRhQWZmZWN0aW5nUHJvcHMoKSB7XG4gICAgcmV0dXJuIFsnbGFiZWwnLCAnb3BhY2l0eScsICd0aGlja25lc3MnLCAnaXNWaXNpYmxlJ107XG4gIH1cblxuICBnZXQgdmlzdWFsQ2hhbm5lbHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbG9yOiB7XG4gICAgICAgIHByb3BlcnR5OiAnY29sb3InLFxuICAgICAgICBmaWVsZDogJ2NvbG9yRmllbGQnLFxuICAgICAgICBzY2FsZTogJ2NvbG9yU2NhbGUnLFxuICAgICAgICBkb21haW46ICdjb2xvckRvbWFpbicsXG4gICAgICAgIHJhbmdlOiAnY29sb3JSYW5nZScsXG4gICAgICAgIGtleTogJ2NvbG9yJyxcbiAgICAgICAgY2hhbm5lbFNjYWxlVHlwZTogQ0hBTk5FTF9TQ0FMRVMuY29sb3JcbiAgICAgIH0sXG4gICAgICBzaXplOiB7XG4gICAgICAgIHByb3BlcnR5OiAnc2l6ZScsXG4gICAgICAgIGZpZWxkOiAnc2l6ZUZpZWxkJyxcbiAgICAgICAgc2NhbGU6ICdzaXplU2NhbGUnLFxuICAgICAgICBkb21haW46ICdzaXplRG9tYWluJyxcbiAgICAgICAgcmFuZ2U6ICdzaXplUmFuZ2UnLFxuICAgICAgICBrZXk6ICdzaXplJyxcbiAgICAgICAgY2hhbm5lbFNjYWxlVHlwZTogQ0hBTk5FTF9TQ0FMRVMuc2l6ZVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKlxuICAgKiBDb2x1bW4gcGFpcnMgbWFwcyBsYXllciBjb2x1bW4gdG8gYSBzcGVjaWZpYyBmaWVsZCBwYWlycyxcbiAgICogQnkgZGVmYXVsdCwgaXQgaXMgc2V0IHRvIG51bGxcbiAgICovXG4gIGdldCBjb2x1bW5QYWlycygpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qXG4gICAqIERlZmF1bHQgcG9pbnQgY29sdW1uIHBhaXJzLCBjYW4gYmUgdXNlZCBmb3IgcG9pbnQgYmFzZWQgbGF5ZXJzOiBwb2ludCwgaWNvbiBldGMuXG4gICAqL1xuICBnZXQgZGVmYXVsdFBvaW50Q29sdW1uUGFpcnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhdDoge3BhaXI6ICdsbmcnLCBmaWVsZFBhaXJLZXk6ICdsYXQnfSxcbiAgICAgIGxuZzoge3BhaXI6ICdsYXQnLCBmaWVsZFBhaXJLZXk6ICdsbmcnfVxuICAgIH07XG4gIH1cblxuICAvKlxuICAgKiBEZWZhdWx0IGxpbmsgY29sdW1uIHBhaXJzLCBjYW4gYmUgdXNlZCBmb3IgbGluayBiYXNlZCBsYXllcnM6IGFyYywgbGluZSBldGNcbiAgICovXG4gIGdldCBkZWZhdWx0TGlua0NvbHVtblBhaXJzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBsYXQwOiB7cGFpcjogJ2xuZzAnLCBmaWVsZFBhaXJLZXk6ICdsYXQnfSxcbiAgICAgIGxuZzA6IHtwYWlyOiAnbGF0MCcsIGZpZWxkUGFpcktleTogJ2xuZyd9LFxuICAgICAgbGF0MToge3BhaXI6ICdsbmcxJywgZmllbGRQYWlyS2V5OiAnbGF0J30sXG4gICAgICBsbmcxOiB7cGFpcjogJ2xhdDEnLCBmaWVsZFBhaXJLZXk6ICdsbmcnfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQXNzaWduIGEgZmllbGQgdG8gbGF5ZXIgY29sdW1uLCByZXR1cm4gY29sdW1uIGNvbmZpZ1xuICAgKiBAcGFyYW0ga2V5IC0gQ29sdW1uIEtleVxuICAgKiBAcGFyYW0gZmllbGQgLSBTZWxlY3RlZCBmaWVsZFxuICAgKiBAcmV0dXJucyB7e319IC0gQ29sdW1uIGNvbmZpZ1xuICAgKi9cbiAgYXNzaWduQ29sdW1uKGtleSwgZmllbGQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4udGhpcy5jb25maWcuY29sdW1ucyxcbiAgICAgIFtrZXldOiB7XG4gICAgICAgIC4uLnRoaXMuY29uZmlnLmNvbHVtbnNba2V5XSxcbiAgICAgICAgdmFsdWU6IGZpZWxkLm5hbWUsXG4gICAgICAgIGZpZWxkSWR4OiBmaWVsZC50YWJsZUZpZWxkSW5kZXggLSAxXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NpZ24gYSBmaWVsZCBwYWlyIHRvIGNvbHVtbiBjb25maWcsIHJldHVybiBjb2x1bW4gY29uZmlnXG4gICAqIEBwYXJhbSBrZXkgLSBDb2x1bW4gS2V5XG4gICAqIEBwYXJhbSBwYWlyIC0gZmllbGQgUGFpclxuICAgKiBAcmV0dXJucyB7e319IC0gQ29sdW1uIGNvbmZpZ1xuICAgKi9cbiAgYXNzaWduQ29sdW1uUGFpcnMoa2V5LCBwYWlyKSB7XG4gICAgaWYgKCF0aGlzLmNvbHVtblBhaXJzIHx8ICF0aGlzLmNvbHVtblBhaXJzW2tleV0pIHtcbiAgICAgIC8vIHNob3VsZCBub3QgZW5kIGluIHRoaXMgc3RhdGVcbiAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5jb2x1bW5zO1xuICAgIH1cblxuICAgIGNvbnN0IHtwYWlyOiBwYXJ0bmVyS2V5LCBmaWVsZFBhaXJLZXl9ID0gdGhpcy5jb2x1bW5QYWlyc1trZXldO1xuICAgIGNvbnN0IHtmaWVsZFBhaXJLZXk6IHBhcnRuZXJGaWVsZFBhaXJLZXl9ID0gdGhpcy5jb2x1bW5QYWlyc1twYXJ0bmVyS2V5XTtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi50aGlzLmNvbmZpZy5jb2x1bW5zLFxuICAgICAgW2tleV06IHBhaXJbZmllbGRQYWlyS2V5XSxcbiAgICAgIFtwYXJ0bmVyS2V5XTogcGFpcltwYXJ0bmVyRmllbGRQYWlyS2V5XVxuICAgIH07XG4gIH1cblxuICBnZXRab29tRmFjdG9yKHpvb20pIHtcbiAgICByZXR1cm4gTWF0aC5wb3coMiwgTWF0aC5tYXgoMTQgLSB6b29tLCAwKSk7XG4gIH1cblxuICBnZXRFbGV2YXRpb25ab29tRmFjdG9yKHpvb20pIHtcbiAgICByZXR1cm4gTWF0aC5wb3coMiwgTWF0aC5tYXgoOCAtIHpvb20sIDApKTtcbiAgfVxuXG4gIGZvcm1hdExheWVyRGF0YShkYXRhLCBhbGxEYXRhLCBmaWx0ZXJlZEluZGV4KSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgcmVuZGVyTGF5ZXIoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgZ2V0SG92ZXJEYXRhKG9iamVjdCkge1xuICAgIGlmICghb2JqZWN0KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgLy8gYnkgZGVmYXVsdCwgZWFjaCBlbnRyeSBvZiBsYXllckRhdGEgc2hvdWxkIGhhdmUgYSBkYXRhIHByb3BlcnR5IHBvaW50c1xuICAgIC8vIHRvIHRoZSBvcmlnaW5hbCBpdGVtIGluIHRoZSBhbGxEYXRhIGFycmF5XG4gICAgLy8gZWFjaCBsYXllciBjYW4gaW1wbGVtZW50IGl0cyBvd24gZ2V0SG92ZXJEYXRhIG1ldGhvZFxuICAgIHJldHVybiBvYmplY3QuZGF0YTtcbiAgfVxuXG4gIC8vIFJlY3Vyc2l2ZWx5IGNvcHkgY29uZmlnIG92ZXIgdG8gYW4gZW1wdHkgbGF5ZXJcbiAgLy8gd2hlbiByZWNlaXZlZCBzYXZlZCBjb25maWcsIG9yIGNvcHkgY29uZmlnIG92ZXIgZnJvbSBhIGRpZmZlcmVudCBsYXllciB0eXBlXG4gIC8vIG1ha2Ugc3VyZSB0byBvbmx5IGNvcHkgb3ZlciB2YWx1ZSB0byBleGlzdGluZyBrZXlzXG4gIGFzc2lnbkNvbmZpZ1RvTGF5ZXIob2xkQ29uZmlnLCBuZXdDb25maWcpIHtcbiAgICAvLyBUT0RPOiBoYXZlIGEgYmV0dGVyIHdheSB0byBjb3B5IG92ZXIgZGltZW5zaW9uIGNvbmZpZyByYW5nZVxuICAgIC8vIGUuZy4gaGV4YWdvbiBoZWlnaHQgc2l6ZVJhbmdlIC0+IHBvaW50IHJhZGl1cyBzaXplUmFuZ2VcbiAgICAvLyBkb24ndCBkZWVwIG1lcmdlIHZpc3VhbENoYW5uZWwgZmllbGRcbiAgICBjb25zdCBub3RUb0RlZXBNZXJnZSA9IE9iamVjdC52YWx1ZXModGhpcy52aXN1YWxDaGFubmVscykubWFwKHYgPT4gdi5maWVsZCk7XG5cbiAgICAvLyBkb24ndCBkZWVwIG1lcmdlIGNvbG9yIHJhbmdlLCByZXZlcnNlZDogaXMgbm90IGEga2V5IGJ5IGRlZmF1bHRcbiAgICBub3RUb0RlZXBNZXJnZS5wdXNoKCdjb2xvclJhbmdlJyk7XG5cbiAgICAvLyBkb24ndCBjb3B5IG92ZXIgZG9tYWluXG4gICAgY29uc3Qgbm90VG9Db3B5ID0gT2JqZWN0LnZhbHVlcyh0aGlzLnZpc3VhbENoYW5uZWxzKS5tYXAodiA9PiB2LmRvbWFpbik7XG4gICAgY29uc3QgY29waWVkID0ge307XG5cbiAgICBPYmplY3Qua2V5cyhvbGRDb25maWcpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGlmIChcbiAgICAgICAgaXNQbGFpbk9iamVjdChvbGRDb25maWdba2V5XSkgJiZcbiAgICAgICAgaXNQbGFpbk9iamVjdChuZXdDb25maWdba2V5XSkgJiZcbiAgICAgICAgIW5vdFRvRGVlcE1lcmdlLmluY2x1ZGVzKGtleSkgJiZcbiAgICAgICAgIW5vdFRvQ29weS5pbmNsdWRlcyhrZXkpXG4gICAgICApIHtcbiAgICAgICAgLy8gcmVjdXJzaXZlbHkgYXNzaWduIG9iamVjdCB2YWx1ZVxuICAgICAgICBjb3BpZWRba2V5XSA9IHRoaXMuYXNzaWduQ29uZmlnVG9MYXllcihvbGRDb25maWdba2V5XSwgbmV3Q29uZmlnW2tleV0pO1xuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgbm90TnVsbG9yVW5kZWZpbmVkKG5ld0NvbmZpZ1trZXldKSAmJlxuICAgICAgICAhbm90VG9Db3B5LmluY2x1ZGVzKGtleSlcbiAgICAgICkge1xuICAgICAgICBjb3BpZWRba2V5XSA9IG5ld0NvbmZpZ1trZXldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29waWVkW2tleV0gPSBvbGRDb25maWdba2V5XTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBjb3BpZWQ7XG4gIH1cblxuICByZWdpc3RlclZpc0NvbmZpZyhsYXllclZpc0NvbmZpZ3MpIHtcbiAgICBPYmplY3Qua2V5cyhsYXllclZpc0NvbmZpZ3MpLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBpZiAoXG4gICAgICAgIHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJyAmJlxuICAgICAgICBMQVlFUl9WSVNfQ09ORklHU1tsYXllclZpc0NvbmZpZ3NbaXRlbV1dXG4gICAgICApIHtcbiAgICAgICAgLy8gaWYgYXNzaWduZWQgb25lIG9mIGRlZmF1bHQgTEFZRVJfQ09ORklHU1xuICAgICAgICB0aGlzLmNvbmZpZy52aXNDb25maWdbaXRlbV0gPVxuICAgICAgICAgIExBWUVSX1ZJU19DT05GSUdTW2xheWVyVmlzQ29uZmlnc1tpdGVtXV0uZGVmYXVsdFZhbHVlO1xuICAgICAgICB0aGlzLnZpc0NvbmZpZ1NldHRpbmdzW2l0ZW1dID0gTEFZRVJfVklTX0NPTkZJR1NbbGF5ZXJWaXNDb25maWdzW2l0ZW1dXTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIFsndHlwZScsICdkZWZhdWx0VmFsdWUnXS5ldmVyeShwID0+IGxheWVyVmlzQ29uZmlnc1tpdGVtXVtwXSlcbiAgICAgICkge1xuICAgICAgICAvLyBpZiBwcm92aWRlZCBjdXN0b21pemVkIHZpc0NvbmZpZywgYW5kIGhhcyB0eXBlICYmIGRlZmF1bHRWYWx1ZVxuICAgICAgICAvLyBUT0RPOiBmdXJ0aGVyIGNoZWNrIGlmIGN1c3RvbWl6ZWQgdmlzQ29uZmlnIGlzIHZhbGlkXG4gICAgICAgIHRoaXMuY29uZmlnLnZpc0NvbmZpZ1tpdGVtXSA9IGxheWVyVmlzQ29uZmlnc1tpdGVtXS5kZWZhdWx0VmFsdWU7XG4gICAgICAgIHRoaXMudmlzQ29uZmlnU2V0dGluZ3NbaXRlbV0gPSBsYXllclZpc0NvbmZpZ3NbaXRlbV07XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRMYXllckNvbHVtbnMoKSB7XG4gICAgY29uc3QgcmVxdWlyZWQgPSB0aGlzLnJlcXVpcmVkTGF5ZXJDb2x1bW5zLnJlZHVjZShcbiAgICAgIChhY2N1LCBrZXkpID0+ICh7XG4gICAgICAgIC4uLmFjY3UsXG4gICAgICAgIFtrZXldOiB7dmFsdWU6IG51bGwsIGZpZWxkSWR4OiAtMX1cbiAgICAgIH0pLFxuICAgICAge31cbiAgICApO1xuICAgIGNvbnN0IG9wdGlvbmFsID0gdGhpcy5vcHRpb25hbENvbHVtbnMucmVkdWNlKFxuICAgICAgKGFjY3UsIGtleSkgPT4gKHtcbiAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgW2tleV06IHt2YWx1ZTogbnVsbCwgZmllbGRJZHg6IC0xLCBvcHRpb25hbDogdHJ1ZX1cbiAgICAgIH0pLFxuICAgICAge31cbiAgICApO1xuXG4gICAgcmV0dXJuIHsuLi5yZXF1aXJlZCwgLi4ub3B0aW9uYWx9O1xuICB9XG5cbiAgdXBkYXRlTGF5ZXJDb25maWcobmV3Q29uZmlnKSB7XG4gICAgdGhpcy5jb25maWcgPSB7Li4udGhpcy5jb25maWcsIC4uLm5ld0NvbmZpZ307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB1cGRhdGVMYXllclZpc0NvbmZpZyhuZXdWaXNDb25maWcpIHtcbiAgICB0aGlzLmNvbmZpZy52aXNDb25maWcgPSB7Li4udGhpcy5jb25maWcudmlzQ29uZmlnLCAuLi5uZXdWaXNDb25maWd9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIGxheWVyIGhhcyBhbGwgY29sdW1uc1xuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gbGF5ZXJcbiAgICogQHJldHVybnMge2Jvb2xlYW59IHllcyBvciBub1xuICAgKi9cbiAgaGFzQWxsQ29sdW1ucygpIHtcbiAgICBjb25zdCB7Y29sdW1uc30gPSB0aGlzLmNvbmZpZztcbiAgICByZXR1cm4gKFxuICAgICAgY29sdW1ucyAmJlxuICAgICAgT2JqZWN0LnZhbHVlcyhjb2x1bW5zKS5ldmVyeSh2ID0+IHtcbiAgICAgICAgcmV0dXJuIEJvb2xlYW4odi5vcHRpb25hbCB8fCAodi52YWx1ZSAmJiB2LmZpZWxkSWR4ID4gLTEpKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIGxheWVyIGhhcyBkYXRhXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBsYXllclxuICAgKiBAcGFyYW0ge0FycmF5IHwgT2JqZWN0fSBsYXllckRhdGFcbiAgICogQHJldHVybnMge2Jvb2xlYW59IHllcyBvciBub1xuICAgKi9cbiAgaGFzTGF5ZXJEYXRhKGxheWVyRGF0YSkge1xuICAgIGlmICghbGF5ZXJEYXRhKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIEJvb2xlYW4obGF5ZXJEYXRhLmRhdGEgJiYgbGF5ZXJEYXRhLmRhdGEubGVuZ3RoKTtcbiAgfVxuXG4gIGlzVmFsaWRUb1NhdmUoKSB7XG4gICAgcmV0dXJuIHRoaXMudHlwZSAmJiB0aGlzLmhhc0FsbENvbHVtbnMoKTtcbiAgfVxuXG4gIHNob3VsZFJlbmRlckxheWVyKGRhdGEpIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy50eXBlICYmXG4gICAgICB0aGlzLmhhc0FsbENvbHVtbnMoKSAmJlxuICAgICAgdGhpcy5jb25maWcuaXNWaXNpYmxlICYmXG4gICAgICB0aGlzLmhhc0xheWVyRGF0YShkYXRhKVxuICAgICk7XG4gIH1cblxuICBnZXRWaXNDaGFubmVsU2NhbGUoc2NhbGUsIGRvbWFpbiwgcmFuZ2UsIGZpeGVkKSB7XG4gICAgcmV0dXJuIFNDQUxFX0ZVTkNbZml4ZWQgPyAnbGluZWFyJyA6IHNjYWxlXSgpXG4gICAgICAuZG9tYWluKGRvbWFpbilcbiAgICAgIC5yYW5nZShmaXhlZCA/IGRvbWFpbiA6IHJhbmdlKTtcbiAgfVxuXG4gIGdldFBvaW50c0JvdW5kcyhhbGxEYXRhLCBnZXRQb3NpdGlvbikge1xuICAgIC8vIG5vIG5lZWQgdG8gbG9vcCB0aHJvdWdoIHRoZSBlbnRpcmUgZGF0YXNldFxuICAgIC8vIGdldCBhIHNhbXBsZSBvZiBkYXRhIHRvIGNhbGN1bGF0ZSBib3VuZHNcbiAgICBjb25zdCBzYW1wbGVEYXRhID1cbiAgICAgIGFsbERhdGEubGVuZ3RoID4gTUFYX1NBTVBMRV9TSVpFXG4gICAgICAgID8gZ2V0U2FtcGxlRGF0YShhbGxEYXRhLCBNQVhfU0FNUExFX1NJWkUpXG4gICAgICAgIDogYWxsRGF0YTtcbiAgICBjb25zdCBwb2ludHMgPSBzYW1wbGVEYXRhLm1hcChnZXRQb3NpdGlvbik7XG5cbiAgICBjb25zdCBsYXRCb3VuZHMgPSBnZXRMYXRMbmdCb3VuZHMocG9pbnRzLCAxLCBbLTkwLCA5MF0pO1xuICAgIGNvbnN0IGxuZ0JvdW5kcyA9IGdldExhdExuZ0JvdW5kcyhwb2ludHMsIDAsIFstMTgwLCAxODBdKTtcblxuICAgIGlmICghbGF0Qm91bmRzIHx8ICFsbmdCb3VuZHMpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBbbG5nQm91bmRzWzBdLCBsYXRCb3VuZHNbMF0sIGxuZ0JvdW5kc1sxXSwgbGF0Qm91bmRzWzFdXTtcbiAgfVxuXG4gIGdldExpZ2h0U2V0dGluZ3NGcm9tQm91bmRzKGJvdW5kcykge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KGJvdW5kcykgJiYgYm91bmRzLmxlbmd0aCA+PSA0XG4gICAgICA/IHtcbiAgICAgICAgICAuLi5ERUZBVUxUX0xJR0hUX1NFVFRJTkdTLFxuICAgICAgICAgIGxpZ2h0c1Bvc2l0aW9uOiBbXG4gICAgICAgICAgICAuLi5ib3VuZHMuc2xpY2UoMCwgMiksXG4gICAgICAgICAgICBERUZBVUxUX0xJR0hUX1NFVFRJTkdTLmxpZ2h0c1Bvc2l0aW9uWzJdLFxuICAgICAgICAgICAgLi4uYm91bmRzLnNsaWNlKDIsIDQpLFxuICAgICAgICAgICAgREVGQVVMVF9MSUdIVF9TRVRUSU5HUy5saWdodHNQb3NpdGlvbls1XVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgOiBERUZBVUxUX0xJR0hUX1NFVFRJTkdTO1xuICB9XG5cbiAgZ2V0RW5jb2RlZENoYW5uZWxWYWx1ZShcbiAgICBzY2FsZSxcbiAgICBkYXRhLFxuICAgIGZpZWxkLFxuICAgIGRlZmF1bHRWYWx1ZSA9IE5PX1ZBTFVFX0NPTE9SLFxuICAgIGdldFZhbHVlID0gZGVmYXVsdEdldEZpZWxkVmFsdWVcbiAgKSB7XG4gICAgY29uc3Qge3R5cGV9ID0gZmllbGQ7XG4gICAgY29uc3QgdmFsdWUgPSBnZXRWYWx1ZShmaWVsZCwgZGF0YSk7XG4gICAgbGV0IGF0dHJpYnV0ZVZhbHVlO1xuICAgIGlmICh0eXBlID09PSBBTExfRklFTERfVFlQRVMudGltZXN0YW1wKSB7XG4gICAgICAvLyBzaG91bGRuJ3QgbmVlZCB0byBjb252ZXJ0IGhlcmVcbiAgICAgIC8vIHNjYWxlIEZ1bmN0aW9uIHNob3VsZCB0YWtlIGNhcmUgb2YgaXRcbiAgICAgIGF0dHJpYnV0ZVZhbHVlID0gc2NhbGUobmV3IERhdGUodmFsdWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXR0cmlidXRlVmFsdWUgPSBzY2FsZSh2YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKCFhdHRyaWJ1dGVWYWx1ZSkge1xuICAgICAgYXR0cmlidXRlVmFsdWUgPSBkZWZhdWx0VmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF0dHJpYnV0ZVZhbHVlO1xuICB9XG5cbiAgdXBkYXRlTWV0YShtZXRhKSB7XG4gICAgdGhpcy5tZXRhID0gey4uLnRoaXMubWV0YSwgLi4ubWV0YX07XG4gIH1cblxuICAvKipcbiAgICogaGVscGVyIGZ1bmN0aW9uIHRvIHVwZGF0ZSBvbmUgbGF5ZXIgZG9tYWluIHdoZW4gc3RhdGUuZGF0YSBjaGFuZ2VkXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0W119IGRhdGFcbiAgICogQHBhcmFtIHtPYmplY3RbXX0gYWxsRGF0YVxuICAgKiBAcGFyYW0ge29iamVjdH0gbGF5ZXJcbiAgICogQHJldHVybnMge29iamVjdH0gbGF5ZXJcbiAgICovXG4gIHVwZGF0ZUxheWVyRG9tYWluKHtkYXRhLCBhbGxEYXRhfSkge1xuICAgIE9iamVjdC52YWx1ZXModGhpcy52aXN1YWxDaGFubmVscykuZm9yRWFjaChjaGFubmVsID0+IHtcbiAgICAgIGNvbnN0IHtkb21haW59ID0gY2hhbm5lbDtcbiAgICAgIGNvbnN0IHVwZGF0ZWREb21haW4gPSB0aGlzLmNhbGN1bGF0ZUxheWVyRG9tYWluKHtkYXRhLCBhbGxEYXRhfSwgY2hhbm5lbCk7XG5cbiAgICAgIHRoaXMudXBkYXRlTGF5ZXJDb25maWcoe1tkb21haW5dOiB1cGRhdGVkRG9tYWlufSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbCh7ZGF0YSwgYWxsRGF0YX0sIGNoYW5uZWwpIHtcbiAgICBjb25zdCB2aXN1YWxDaGFubmVsID0gdGhpcy52aXN1YWxDaGFubmVsc1tjaGFubmVsXTtcbiAgICBjb25zdCB7ZmllbGQsIHNjYWxlLCBkb21haW4sIGNoYW5uZWxTY2FsZVR5cGV9ID0gdmlzdWFsQ2hhbm5lbDtcblxuICAgIGlmICh0aGlzLmNvbmZpZ1tmaWVsZF0pIHtcbiAgICAgIC8vIGlmIGZpZWxkIGlzIHNlbGVjdGVkLCBjaGVjayBpZiBjdXJyZW50IHNlbGVjdGVkIHNjYWxlIGlzXG4gICAgICAvLyBzdXBwb3J0ZWQsIGlmIG5vdCwgdXBkYXRlIHRvIGRlZmF1bHRcbiAgICAgIGNvbnN0IHNjYWxlT3B0aW9ucyA9XG4gICAgICAgIEZJRUxEX09QVFNbdGhpcy5jb25maWdbZmllbGRdLnR5cGVdLnNjYWxlW2NoYW5uZWxTY2FsZVR5cGVdO1xuICAgICAgaWYgKCFzY2FsZU9wdGlvbnMuaW5jbHVkZXModGhpcy5jb25maWdbc2NhbGVdKSkge1xuICAgICAgICB0aGlzLnVwZGF0ZUxheWVyQ29uZmlnKHtbc2NhbGVdOiBzY2FsZU9wdGlvbnNbMF19KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjYWxjdWxhdGUgbGF5ZXIgY2hhbm5lbCBkb21haW5cbiAgICBjb25zdCB1cGRhdGVkRG9tYWluID0gdGhpcy5jYWxjdWxhdGVMYXllckRvbWFpbihcbiAgICAgIHtkYXRhLCBhbGxEYXRhfSxcbiAgICAgIHZpc3VhbENoYW5uZWxcbiAgICApO1xuXG4gICAgdGhpcy51cGRhdGVMYXllckNvbmZpZyh7W2RvbWFpbl06IHVwZGF0ZWREb21haW59KTtcbiAgfVxuXG4gIGNhbGN1bGF0ZUxheWVyRG9tYWluKHtkYXRhLCBhbGxEYXRhfSwgdmlzdWFsQ2hhbm5lbCkge1xuICAgIGNvbnN0IGRlZmF1bHREb21haW4gPSBbMCwgMV07XG4gICAgY29uc3Qge3NjYWxlfSA9IHZpc3VhbENoYW5uZWw7XG4gICAgY29uc3Qgc2NhbGVUeXBlID0gdGhpcy5jb25maWdbc2NhbGVdO1xuXG4gICAgY29uc3QgZmllbGQgPSB0aGlzLmNvbmZpZ1t2aXN1YWxDaGFubmVsLmZpZWxkXTtcbiAgICBpZiAoIWZpZWxkKSB7XG4gICAgICAvLyBpZiBjb2xvckZpZWxkIG9yIHNpemVGaWVsZCB3ZXJlIHNldCBiYWNrIHRvIG51bGxcbiAgICAgIHJldHVybiBkZWZhdWx0RG9tYWluO1xuICAgIH1cblxuICAgIGlmICghU0NBTEVfVFlQRVNbc2NhbGVUeXBlXSkge1xuICAgICAgQ29uc29sZS5lcnJvcihgc2NhbGUgdHlwZSAke3NjYWxlVHlwZX0gbm90IHN1cHBvcnRlZGApO1xuICAgICAgcmV0dXJuIGRlZmF1bHREb21haW47XG4gICAgfVxuXG4gICAgLy8gVE9ETzogcmVmYWN0b3IgdG8gYWRkIHZhbHVlQWNjZXNzb3IgdG8gZmllbGRcbiAgICBjb25zdCBmaWVsZElkeCA9IGZpZWxkLnRhYmxlRmllbGRJbmRleCAtIDE7XG4gICAgY29uc3QgaXNUaW1lID0gZmllbGQudHlwZSA9PT0gQUxMX0ZJRUxEX1RZUEVTLnRpbWVzdGFtcDtcbiAgICBjb25zdCB2YWx1ZUFjY2Vzc29yID0gbWF5YmVUb0RhdGUuYmluZChcbiAgICAgIG51bGwsXG4gICAgICBpc1RpbWUsXG4gICAgICBmaWVsZElkeCxcbiAgICAgIGZpZWxkLmZvcm1hdFxuICAgICk7XG4gICAgY29uc3Qgc29ydEZ1bmN0aW9uID0gZ2V0U29ydGluZ0Z1bmN0aW9uKGZpZWxkLnR5cGUpO1xuXG4gICAgc3dpdGNoIChzY2FsZVR5cGUpIHtcbiAgICAgIGNhc2UgU0NBTEVfVFlQRVMub3JkaW5hbDpcbiAgICAgIGNhc2UgU0NBTEVfVFlQRVMucG9pbnQ6XG4gICAgICAgIC8vIGRvIG5vdCByZWNhbGN1bGF0ZSBvcmRpbmFsIGRvbWFpbiBiYXNlZCBvbiBmaWx0ZXJyZWQgZGF0YVxuICAgICAgICByZXR1cm4gZ2V0T3JkaW5hbERvbWFpbihhbGxEYXRhLCB2YWx1ZUFjY2Vzc29yKTtcblxuICAgICAgY2FzZSBTQ0FMRV9UWVBFUy5xdWFudGlsZTpcbiAgICAgICAgcmV0dXJuIGdldFF1YW50aWxlRG9tYWluKGRhdGEsIHZhbHVlQWNjZXNzb3IsIHNvcnRGdW5jdGlvbik7XG5cbiAgICAgIGNhc2UgU0NBTEVfVFlQRVMucXVhbnRpemU6XG4gICAgICBjYXNlIFNDQUxFX1RZUEVTLmxpbmVhcjpcbiAgICAgIGNhc2UgU0NBTEVfVFlQRVMuc3FydDpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBnZXRMaW5lYXJEb21haW4oZGF0YSwgdmFsdWVBY2Nlc3Nvcik7XG4gICAgfVxuICB9XG5cbiAgaXNMYXllckhvdmVyZWQob2JqZWN0SW5mbykge1xuICAgIHJldHVybiAoXG4gICAgICBvYmplY3RJbmZvICYmXG4gICAgICBvYmplY3RJbmZvLmxheWVyICYmXG4gICAgICBvYmplY3RJbmZvLnBpY2tlZCAmJlxuICAgICAgb2JqZWN0SW5mby5sYXllci5wcm9wcy5pZCA9PT0gdGhpcy5pZFxuICAgICk7XG4gIH1cblxuICBnZXRSYWRpdXNTY2FsZUJ5Wm9vbSh6b29tLCBmaXhlZFJhZGl1cykge1xuICAgIGNvbnN0IHJhZGl1c0NoYW5uZWwgPSBPYmplY3QudmFsdWVzKHRoaXMudmlzdWFsQ2hhbm5lbHMpLmZpbmQoXG4gICAgICB2YyA9PiB2Yy5wcm9wZXJ0eSA9PT0gJ3JhZGl1cydcbiAgICApO1xuXG4gICAgaWYgKCFyYWRpdXNDaGFubmVsKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9XG5cbiAgICBjb25zdCBmaWVsZCA9IHJhZGl1c0NoYW5uZWwuZmllbGQ7XG4gICAgY29uc3QgZml4ZWQgPVxuICAgICAgZml4ZWRSYWRpdXMgPT09IHVuZGVmaW5lZFxuICAgICAgICA/IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5maXhlZFJhZGl1c1xuICAgICAgICA6IGZpeGVkUmFkaXVzO1xuICAgIGNvbnN0IHtyYWRpdXN9ID0gdGhpcy5jb25maWcudmlzQ29uZmlnO1xuXG4gICAgcmV0dXJuIGZpeGVkXG4gICAgICA/IDFcbiAgICAgIDogKHRoaXMuY29uZmlnW2ZpZWxkXSA/IDEgOiByYWRpdXMpICogdGhpcy5nZXRab29tRmFjdG9yKHpvb20pO1xuICB9XG5cbiAgc2hvdWxkQ2FsY3VsYXRlTGF5ZXJEYXRhKHByb3BzKSB7XG4gICAgcmV0dXJuIHByb3BzLnNvbWUocCA9PiAhdGhpcy5ub25lTGF5ZXJEYXRhQWZmZWN0aW5nUHJvcHMuaW5jbHVkZXMocCkpO1xuICB9XG59XG4iXX0=