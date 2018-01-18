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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvYmFzZS1sYXllci5qcyJdLCJuYW1lcyI6WyJnZXREZWZhdWx0TGF5ZXJDb25maWciLCJnZW5lcmF0ZUNvbG9yIiwiTUFYX1NBTVBMRV9TSVpFIiwiaW5kZXgiLCJ1YmVyQ29sb3JzIiwiT2JqZWN0IiwidmFsdWVzIiwibGVuZ3RoIiwiY29sb3JNYWtlciIsImRlZmF1bHRHZXRGaWVsZFZhbHVlIiwiZmllbGQiLCJkIiwidGFibGVGaWVsZEluZGV4IiwicHJvcHMiLCJkYXRhSWQiLCJsYWJlbCIsImNvbG9yIiwibmV4dCIsInZhbHVlIiwiY29sdW1ucyIsImlzVmlzaWJsZSIsImlzQ29uZmlnQWN0aXZlIiwiaGlnaGxpZ2h0Q29sb3IiLCJjb2xvckZpZWxkIiwiY29sb3JEb21haW4iLCJjb2xvclNjYWxlIiwic2l6ZURvbWFpbiIsInNpemVTY2FsZSIsInNpemVGaWVsZCIsInZpc0NvbmZpZyIsIkxheWVyIiwiaWQiLCJjb25maWciLCJnZXRMYXllckNvbHVtbnMiLCJtZXRhIiwidmlzQ29uZmlnU2V0dGluZ3MiLCJhc3NpZ25Db2x1bW4iLCJrZXkiLCJuYW1lIiwiZmllbGRJZHgiLCJhc3NpZ25Db2x1bW5QYWlycyIsInBhaXIiLCJjb2x1bW5QYWlycyIsInBhcnRuZXJLZXkiLCJmaWVsZFBhaXJLZXkiLCJwYXJ0bmVyRmllbGRQYWlyS2V5IiwiZ2V0Wm9vbUZhY3RvciIsInpvb20iLCJNYXRoIiwicG93IiwibWF4IiwiZ2V0RWxldmF0aW9uWm9vbUZhY3RvciIsImZvcm1hdExheWVyRGF0YSIsImRhdGEiLCJhbGxEYXRhIiwiZmlsdGVyZWRJbmRleCIsInJlbmRlckxheWVyIiwiZ2V0SG92ZXJEYXRhIiwib2JqZWN0IiwiYXNzaWduQ29uZmlnVG9MYXllciIsIm9sZENvbmZpZyIsIm5ld0NvbmZpZyIsIm5vdFRvRGVlcE1lcmdlIiwidmlzdWFsQ2hhbm5lbHMiLCJtYXAiLCJ2IiwicHVzaCIsIm5vdFRvQ29weSIsImRvbWFpbiIsImNvcGllZCIsImtleXMiLCJmb3JFYWNoIiwiaW5jbHVkZXMiLCJyZWdpc3RlclZpc0NvbmZpZyIsImxheWVyVmlzQ29uZmlncyIsIml0ZW0iLCJkZWZhdWx0VmFsdWUiLCJldmVyeSIsInAiLCJyZXF1aXJlZCIsInJlcXVpcmVkTGF5ZXJDb2x1bW5zIiwicmVkdWNlIiwiYWNjdSIsIm9wdGlvbmFsIiwib3B0aW9uYWxDb2x1bW5zIiwidXBkYXRlTGF5ZXJDb25maWciLCJ1cGRhdGVMYXllclZpc0NvbmZpZyIsIm5ld1Zpc0NvbmZpZyIsImhhc0FsbENvbHVtbnMiLCJCb29sZWFuIiwiaGFzTGF5ZXJEYXRhIiwibGF5ZXJEYXRhIiwiaXNWYWxpZFRvU2F2ZSIsInR5cGUiLCJzaG91bGRSZW5kZXJMYXllciIsImdldFZpc0NoYW5uZWxTY2FsZSIsInNjYWxlIiwicmFuZ2UiLCJmaXhlZCIsImdldFBvaW50c0JvdW5kcyIsImdldFBvc2l0aW9uIiwic2FtcGxlRGF0YSIsInBvaW50cyIsImxhdEJvdW5kcyIsImxuZ0JvdW5kcyIsImdldExpZ2h0U2V0dGluZ3NGcm9tQm91bmRzIiwiYm91bmRzIiwiQXJyYXkiLCJpc0FycmF5IiwibGlnaHRzUG9zaXRpb24iLCJzbGljZSIsImdldEVuY29kZWRDaGFubmVsVmFsdWUiLCJnZXRWYWx1ZSIsImF0dHJpYnV0ZVZhbHVlIiwidGltZXN0YW1wIiwiRGF0ZSIsInVwZGF0ZU1ldGEiLCJ1cGRhdGVMYXllckRvbWFpbiIsImNoYW5uZWwiLCJ1cGRhdGVkRG9tYWluIiwiY2FsY3VsYXRlTGF5ZXJEb21haW4iLCJ1cGRhdGVMYXllclZpc3VhbENoYW5uZWwiLCJ2aXN1YWxDaGFubmVsIiwiY2hhbm5lbFNjYWxlVHlwZSIsInNjYWxlT3B0aW9ucyIsImRlZmF1bHREb21haW4iLCJzY2FsZVR5cGUiLCJlcnJvciIsImlzVGltZSIsInZhbHVlQWNjZXNzb3IiLCJiaW5kIiwiZm9ybWF0Iiwic29ydEZ1bmN0aW9uIiwib3JkaW5hbCIsInBvaW50IiwicXVhbnRpbGUiLCJxdWFudGl6ZSIsImxpbmVhciIsInNxcnQiLCJpc0xheWVySG92ZXJlZCIsIm9iamVjdEluZm8iLCJsYXllciIsInBpY2tlZCIsImdldFJhZGl1c1NjYWxlQnlab29tIiwiZml4ZWRSYWRpdXMiLCJyYWRpdXNDaGFubmVsIiwiZmluZCIsInZjIiwicHJvcGVydHkiLCJ1bmRlZmluZWQiLCJyYWRpdXMiLCJzaG91bGRDYWxjdWxhdGVMYXllckRhdGEiLCJzb21lIiwibm9uZUxheWVyRGF0YUFmZmVjdGluZ1Byb3BzIiwic2l6ZSIsImxhdCIsImxuZyIsImxhdDAiLCJsbmcwIiwibGF0MSIsImxuZzEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBaURnQkEscUIsR0FBQUEscUI7O0FBakRoQjs7QUFDQTs7QUFFQTs7QUFTQTs7QUFDQTs7QUFFQTs7QUFNQTs7QUFFQTs7OztzREFZVUMsYTs7QUFOVjs7OztBQUlBLElBQU1DLGtCQUFrQixJQUF4Qjs7QUFFQSxTQUFVRCxhQUFWO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNNRSxlQUROLEdBQ2MsQ0FEZDtBQUVRQyxvQkFGUixHQUVxQkMsT0FBT0MsTUFBUCxrQ0FGckI7O0FBQUE7QUFBQSxnQkFHU0gsUUFBUUMsV0FBV0csTUFBWCxHQUFvQixDQUhyQztBQUFBO0FBQUE7QUFBQTs7QUFJSSxjQUFJSixVQUFVQyxXQUFXRyxNQUF6QixFQUFpQztBQUMvQkosb0JBQVEsQ0FBUjtBQUNEO0FBTkw7QUFBQSxpQkFPVSwwQkFBU0MsV0FBV0QsT0FBWCxDQUFULENBUFY7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVdBLElBQU1LLGFBQWFQLGVBQW5CO0FBQ0EsSUFBTVEsdUJBQXVCLFNBQXZCQSxvQkFBdUIsQ0FBQ0MsS0FBRCxFQUFRQyxDQUFSO0FBQUEsU0FBY0EsRUFBRUQsTUFBTUUsZUFBTixHQUF3QixDQUExQixDQUFkO0FBQUEsQ0FBN0I7O0FBRU8s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NUIsRUFEQTtBQUVMZ0gsYUFBSyxFQUFDbkgsTUFBTSxLQUFQLEVBQWNHLGNBQWMsS0FBNUI7QUFGQSxPQUFQO0FBSUQ7O0FBRUQ7Ozs7Ozt3QkFHNkI7QUFDM0IsYUFBTztBQUNMaUgsY0FBTSxFQUFDcEgsTUFBTSxNQUFQLEVBQWVHLGNBQWMsS0FBN0IsRUFERDtBQUVMa0gsY0FBTSxFQUFDckgsTUFBTSxNQUFQLEVBQWVHLGNBQWMsS0FBN0IsRUFGRDtBQUdMbUgsY0FBTSxFQUFDdEgsTUFBTSxNQUFQLEVBQWVHLGNBQWMsS0FBN0IsRUFIRDtBQUlMb0gsY0FBTSxFQUFDdkgsTUFBTSxNQUFQLEVBQWVHLGNBQWMsS0FBN0I7QUFKRCxPQUFQO0FBTUQ7Ozs7O2tCQS9Ga0JkLEsiLCJmaWxlIjoiYmFzZS1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aGV4VG9SZ2J9IGZyb20gJy4uL3V0aWxzL2NvbG9yLXV0aWxzJztcbmltcG9ydCB7Y29uc29sZSBhcyBDb25zb2xlfSBmcm9tICdnbG9iYWwvd2luZG93JztcblxuaW1wb3J0IHtcbiAgQUxMX0ZJRUxEX1RZUEVTLFxuICBERUZBVUxUX0xJR0hUX1NFVFRJTkdTLFxuICBOT19WQUxVRV9DT0xPUixcbiAgU0NBTEVfVFlQRVMsXG4gIENIQU5ORUxfU0NBTEVTLFxuICBGSUVMRF9PUFRTLFxuICBTQ0FMRV9GVU5DXG59IGZyb20gJy4uL2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCB7dWJlckRhdGFWaXpDb2xvcnN9IGZyb20gJy4uL2NvbnN0YW50cy91YmVyLXZpei1jb2xvcnMnO1xuaW1wb3J0IHtMQVlFUl9WSVNfQ09ORklHU30gZnJvbSAnLi9sYXllci1mYWN0b3J5J1xuXG5pbXBvcnQge1xuICBnZW5lcmF0ZUhhc2hJZCxcbiAgbm90TnVsbG9yVW5kZWZpbmVkLFxuICBpc1BsYWluT2JqZWN0XG59IGZyb20gJy4uL3V0aWxzL3V0aWxzJztcblxuaW1wb3J0IHtnZXRTYW1wbGVEYXRhLCBnZXRMYXRMbmdCb3VuZHMsIG1heWJlVG9EYXRlLCBnZXRTb3J0aW5nRnVuY3Rpb259IGZyb20gJy4uL3V0aWxzL2RhdGEtdXRpbHMnO1xuXG5pbXBvcnQge1xuICBnZXRRdWFudGlsZURvbWFpbixcbiAgZ2V0T3JkaW5hbERvbWFpbixcbiAgZ2V0TGluZWFyRG9tYWluXG59IGZyb20gJy4uL3V0aWxzL2RhdGEtc2NhbGUtdXRpbHMnO1xuXG4vKipcbiAqIEFwcHJveC4gbnVtYmVyIG9mIHBvaW50cyB0byBzYW1wbGUgaW4gYSBsYXJnZSBkYXRhIHNldFxuICogQHR5cGUge251bWJlcn1cbiAqL1xuY29uc3QgTUFYX1NBTVBMRV9TSVpFID0gNTAwMDtcblxuZnVuY3Rpb24qIGdlbmVyYXRlQ29sb3IoKSB7XG4gIGxldCBpbmRleCA9IDA7XG4gIGNvbnN0IHViZXJDb2xvcnMgPSBPYmplY3QudmFsdWVzKHViZXJEYXRhVml6Q29sb3JzKTtcbiAgd2hpbGUgKGluZGV4IDwgdWJlckNvbG9ycy5sZW5ndGggKyAxKSB7XG4gICAgaWYgKGluZGV4ID09PSB1YmVyQ29sb3JzLmxlbmd0aCkge1xuICAgICAgaW5kZXggPSAwO1xuICAgIH1cbiAgICB5aWVsZCBoZXhUb1JnYih1YmVyQ29sb3JzW2luZGV4KytdKTtcbiAgfVxufVxuXG5jb25zdCBjb2xvck1ha2VyID0gZ2VuZXJhdGVDb2xvcigpO1xuY29uc3QgZGVmYXVsdEdldEZpZWxkVmFsdWUgPSAoZmllbGQsIGQpID0+IGRbZmllbGQudGFibGVGaWVsZEluZGV4IC0gMV07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWZhdWx0TGF5ZXJDb25maWcocHJvcHMgPSB7fSkge1xuICByZXR1cm4ge1xuICAgIGRhdGFJZDogcHJvcHMuZGF0YUlkIHx8IG51bGwsXG4gICAgbGFiZWw6IHByb3BzLmxhYmVsIHx8ICduZXcgbGF5ZXInLFxuICAgIGNvbG9yOiBwcm9wcy5jb2xvciB8fCBjb2xvck1ha2VyLm5leHQoKS52YWx1ZSxcbiAgICBjb2x1bW5zOiBwcm9wcy5jb2x1bW5zIHx8IG51bGwsXG4gICAgaXNWaXNpYmxlOiBwcm9wcy5pc1Zpc2libGUgfHwgZmFsc2UsXG4gICAgaXNDb25maWdBY3RpdmU6IHByb3BzLmlzQ29uZmlnQWN0aXZlIHx8IGZhbHNlLFxuICAgIGhpZ2hsaWdodENvbG9yOiBwcm9wcy5oaWdobGlnaHRDb2xvciB8fCBbMjUyLCAyNDIsIDI2XSxcblxuICAgIC8vIFRPRE86IHJlZmFjdG9yIHRoaXMgaW50byBzZXBlcmF0ZSB2aXN1YWwgQ2hhbm5lbCBjb25maWdcbiAgICAvLyBjb2xvciBieSBmaWVsZCwgZG9tYWluIGlzIHNldCBieSBmaWx0ZXJzLCBmaWVsZCwgc2NhbGUgdHlwZVxuICAgIGNvbG9yRmllbGQ6IG51bGwsXG4gICAgY29sb3JEb21haW46IFswLCAxXSxcbiAgICBjb2xvclNjYWxlOiAncXVhbnRpbGUnLFxuXG4gICAgLy8gY29sb3IgYnkgc2l6ZSwgZG9tYWluIGlzIHNldCBieSBmaWx0ZXJzLCBmaWVsZCwgc2NhbGUgdHlwZVxuICAgIHNpemVEb21haW46IFswLCAxXSxcbiAgICBzaXplU2NhbGU6ICdsaW5lYXInLFxuICAgIHNpemVGaWVsZDogbnVsbCxcblxuICAgIHZpc0NvbmZpZzoge31cbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGF5ZXIge1xuICBjb25zdHJ1Y3Rvcihwcm9wcyA9IHt9KSB7XG5cbiAgICB0aGlzLmlkID0gcHJvcHMuaWQgfHwgZ2VuZXJhdGVIYXNoSWQoNik7XG5cbiAgICB0aGlzLmNvbmZpZyA9IGdldERlZmF1bHRMYXllckNvbmZpZyh7XG4gICAgICBjb2x1bW5zOiB0aGlzLmdldExheWVyQ29sdW1ucygpLFxuICAgICAgLi4ucHJvcHNcbiAgICB9KTtcblxuICAgIC8vIG1ldGFcbiAgICB0aGlzLm1ldGEgPSB7fTtcblxuICAgIC8vIHZpc0NvbmZpZ1NldHRpbmdzXG4gICAgdGhpcy52aXNDb25maWdTZXR0aW5ncyA9IHt9O1xuICAgIC8vIGxheWVyIHV0aWxpdHkgbWV0aG9kc1xuICAgIC8vIHRoaXMuZ2V0TGlnaHRTZXR0aW5nc0Zyb21Cb3VuZHMgPSBnZXRMaWdodFNldHRpbmdzRnJvbUJvdW5kcztcbiAgfVxuXG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZ2V0IGlzQWdncmVnYXRlZCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXQgcmVxdWlyZWRMYXllckNvbHVtbnMoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgZ2V0IG9wdGlvbmFsQ29sdW1ucygpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBnZXQgbm9uZUxheWVyRGF0YUFmZmVjdGluZ1Byb3BzKCkge1xuICAgIHJldHVybiBbXG4gICAgICAnbGFiZWwnLFxuICAgICAgJ29wYWNpdHknLFxuICAgICAgJ3RoaWNrbmVzcycsXG4gICAgICAnaXNWaXNpYmxlJ1xuICAgIF07XG4gIH1cblxuICBnZXQgdmlzdWFsQ2hhbm5lbHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbG9yOiB7XG4gICAgICAgIHByb3BlcnR5OiAnY29sb3InLFxuICAgICAgICBmaWVsZDogJ2NvbG9yRmllbGQnLFxuICAgICAgICBzY2FsZTogJ2NvbG9yU2NhbGUnLFxuICAgICAgICBkb21haW46ICdjb2xvckRvbWFpbicsXG4gICAgICAgIHJhbmdlOiAnY29sb3JSYW5nZScsXG4gICAgICAgIGtleTogJ2NvbG9yJyxcbiAgICAgICAgY2hhbm5lbFNjYWxlVHlwZTogQ0hBTk5FTF9TQ0FMRVMuY29sb3JcbiAgICAgIH0sXG4gICAgICBzaXplOiB7XG4gICAgICAgIHByb3BlcnR5OiAnc2l6ZScsXG4gICAgICAgIGZpZWxkOiAnc2l6ZUZpZWxkJyxcbiAgICAgICAgc2NhbGU6ICdzaXplU2NhbGUnLFxuICAgICAgICBkb21haW46ICdzaXplRG9tYWluJyxcbiAgICAgICAgcmFuZ2U6ICdzaXplUmFuZ2UnLFxuICAgICAgICBrZXk6ICdzaXplJyxcbiAgICAgICAgY2hhbm5lbFNjYWxlVHlwZTogQ0hBTk5FTF9TQ0FMRVMuc2l6ZVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qXG4gICAqIENvbHVtbiBwYWlycyBtYXBzIGxheWVyIGNvbHVtbiB0byBhIHNwZWNpZmljIGZpZWxkIHBhaXJzLFxuICAgKiBCeSBkZWZhdWx0LCBpdCBpcyBzZXQgdG8gbnVsbFxuICAgKi9cbiAgZ2V0IGNvbHVtblBhaXJzKCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLypcbiAgICogRGVmYXVsdCBwb2ludCBjb2x1bW4gcGFpcnMsIGNhbiBiZSB1c2VkIGZvciBwb2ludCBiYXNlZCBsYXllcnM6IHBvaW50LCBpY29uIGV0Yy5cbiAgICovXG4gIGdldCBkZWZhdWx0UG9pbnRDb2x1bW5QYWlycygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGF0OiB7cGFpcjogJ2xuZycsIGZpZWxkUGFpcktleTogJ2xhdCd9LFxuICAgICAgbG5nOiB7cGFpcjogJ2xhdCcsIGZpZWxkUGFpcktleTogJ2xuZyd9XG4gICAgfTtcbiAgfVxuXG4gIC8qXG4gICAqIERlZmF1bHQgbGluayBjb2x1bW4gcGFpcnMsIGNhbiBiZSB1c2VkIGZvciBsaW5rIGJhc2VkIGxheWVyczogYXJjLCBsaW5lIGV0Y1xuICAgKi9cbiAgZ2V0IGRlZmF1bHRMaW5rQ29sdW1uUGFpcnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhdDA6IHtwYWlyOiAnbG5nMCcsIGZpZWxkUGFpcktleTogJ2xhdCd9LFxuICAgICAgbG5nMDoge3BhaXI6ICdsYXQwJywgZmllbGRQYWlyS2V5OiAnbG5nJ30sXG4gICAgICBsYXQxOiB7cGFpcjogJ2xuZzEnLCBmaWVsZFBhaXJLZXk6ICdsYXQnfSxcbiAgICAgIGxuZzE6IHtwYWlyOiAnbGF0MScsIGZpZWxkUGFpcktleTogJ2xuZyd9XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NpZ24gYSBmaWVsZCB0byBsYXllciBjb2x1bW4sIHJldHVybiBjb2x1bW4gY29uZmlnXG4gICAqIEBwYXJhbSBrZXkgLSBDb2x1bW4gS2V5XG4gICAqIEBwYXJhbSBmaWVsZCAtIFNlbGVjdGVkIGZpZWxkXG4gICAqIEByZXR1cm5zIHt7fX0gLSBDb2x1bW4gY29uZmlnXG4gICAqL1xuICBhc3NpZ25Db2x1bW4oa2V5LCBmaWVsZCkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi50aGlzLmNvbmZpZy5jb2x1bW5zLFxuICAgICAgW2tleV06IHtcbiAgICAgICAgLi4udGhpcy5jb25maWcuY29sdW1uc1trZXldLFxuICAgICAgICB2YWx1ZTogZmllbGQubmFtZSxcbiAgICAgICAgZmllbGRJZHg6IGZpZWxkLnRhYmxlRmllbGRJbmRleCAtIDFcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEFzc2lnbiBhIGZpZWxkIHBhaXIgdG8gY29sdW1uIGNvbmZpZywgcmV0dXJuIGNvbHVtbiBjb25maWdcbiAgICogQHBhcmFtIGtleSAtIENvbHVtbiBLZXlcbiAgICogQHBhcmFtIHBhaXIgLSBmaWVsZCBQYWlyXG4gICAqIEByZXR1cm5zIHt7fX0gLSBDb2x1bW4gY29uZmlnXG4gICAqL1xuICBhc3NpZ25Db2x1bW5QYWlycyhrZXksIHBhaXIpIHtcbiAgICBpZiAoIXRoaXMuY29sdW1uUGFpcnMgfHwgIXRoaXMuY29sdW1uUGFpcnNba2V5XSkge1xuICAgICAgLy8gc2hvdWxkIG5vdCBlbmQgaW4gdGhpcyBzdGF0ZVxuICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmNvbHVtbnM7XG4gICAgfVxuXG4gICAgY29uc3Qge3BhaXI6IHBhcnRuZXJLZXksIGZpZWxkUGFpcktleX0gPSB0aGlzLmNvbHVtblBhaXJzW2tleV07XG4gICAgY29uc3Qge2ZpZWxkUGFpcktleTogcGFydG5lckZpZWxkUGFpcktleX0gPSB0aGlzLmNvbHVtblBhaXJzW3BhcnRuZXJLZXldO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnRoaXMuY29uZmlnLmNvbHVtbnMsXG4gICAgICBba2V5XTogcGFpcltmaWVsZFBhaXJLZXldLFxuICAgICAgW3BhcnRuZXJLZXldOiBwYWlyW3BhcnRuZXJGaWVsZFBhaXJLZXldXG4gICAgfTtcbiAgfVxuXG4gIGdldFpvb21GYWN0b3Ioem9vbSkge1xuICAgIHJldHVybiBNYXRoLnBvdygyLCBNYXRoLm1heCgxNCAtIHpvb20sIDApKTtcbiAgfVxuXG4gIGdldEVsZXZhdGlvblpvb21GYWN0b3Ioem9vbSkge1xuICAgIHJldHVybiBNYXRoLnBvdygyLCBNYXRoLm1heCg4IC0gem9vbSwgMCkpO1xuICB9XG5cbiAgZm9ybWF0TGF5ZXJEYXRhKGRhdGEsIGFsbERhdGEsIGZpbHRlcmVkSW5kZXgpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICByZW5kZXJMYXllcigpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBnZXRIb3ZlckRhdGEob2JqZWN0KSB7XG4gICAgaWYgKCFvYmplY3QpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICAvLyBieSBkZWZhdWx0LCBlYWNoIGVudHJ5IG9mIGxheWVyRGF0YSBzaG91bGQgaGF2ZSBhIGRhdGEgcHJvcGVydHkgcG9pbnRzXG4gICAgLy8gdG8gdGhlIG9yaWdpbmFsIGl0ZW0gaW4gdGhlIGFsbERhdGEgYXJyYXlcbiAgICAvLyBlYWNoIGxheWVyIGNhbiBpbXBsZW1lbnQgaXRzIG93biBnZXRIb3ZlckRhdGEgbWV0aG9kXG4gICAgcmV0dXJuIG9iamVjdC5kYXRhO1xuICB9XG5cbiAgLy8gUmVjdXJzaXZlbHkgY29weSBjb25maWcgb3ZlciB0byBhbiBlbXB0eSBsYXllclxuICAvLyB3aGVuIHJlY2VpdmVkIHNhdmVkIGNvbmZpZywgb3IgY29weSBjb25maWcgb3ZlciBmcm9tIGEgZGlmZmVyZW50IGxheWVyIHR5cGVcbiAgLy8gbWFrZSBzdXJlIHRvIG9ubHkgY29weSBvdmVyIHZhbHVlIHRvIGV4aXN0aW5nIGtleXNcbiAgYXNzaWduQ29uZmlnVG9MYXllcihvbGRDb25maWcsIG5ld0NvbmZpZykge1xuXG4gICAgLy8gVE9ETzogaGF2ZSBhIGJldHRlciB3YXkgdG8gY29weSBvdmVyIGRpbWVuc2lvbiBjb25maWcgcmFuZ2VcbiAgICAvLyBlLmcuIGhleGFnb24gaGVpZ2h0IHNpemVSYW5nZSAtPiBwb2ludCByYWRpdXMgc2l6ZVJhbmdlXG4gICAgLy8gZG9uJ3QgZGVlcCBtZXJnZSB2aXN1YWxDaGFubmVsIGZpZWxkXG4gICAgY29uc3Qgbm90VG9EZWVwTWVyZ2UgPSBPYmplY3QudmFsdWVzKHRoaXMudmlzdWFsQ2hhbm5lbHMpLm1hcCh2ID0+IHYuZmllbGQpO1xuXG4gICAgLy8gZG9uJ3QgZGVlcCBtZXJnZSBjb2xvciByYW5nZSwgcmV2ZXJzZWQ6IGlzIG5vdCBhIGtleSBieSBkZWZhdWx0XG4gICAgbm90VG9EZWVwTWVyZ2UucHVzaCgnY29sb3JSYW5nZScpO1xuXG4gICAgLy8gZG9uJ3QgY29weSBvdmVyIGRvbWFpblxuICAgIGNvbnN0IG5vdFRvQ29weSA9IE9iamVjdC52YWx1ZXModGhpcy52aXN1YWxDaGFubmVscykubWFwKHYgPT4gdi5kb21haW4pO1xuICAgIGNvbnN0IGNvcGllZCA9IHt9O1xuXG4gICAgT2JqZWN0LmtleXMob2xkQ29uZmlnKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBpZiAoaXNQbGFpbk9iamVjdChvbGRDb25maWdba2V5XSkgJiYgaXNQbGFpbk9iamVjdChuZXdDb25maWdba2V5XSkgJiZcbiAgICAgICAgIW5vdFRvRGVlcE1lcmdlLmluY2x1ZGVzKGtleSkgJiYgIW5vdFRvQ29weS5pbmNsdWRlcyhrZXkpKSB7XG5cbiAgICAgICAgLy8gcmVjdXJzaXZlbHkgYXNzaWduIG9iamVjdCB2YWx1ZVxuICAgICAgICBjb3BpZWRba2V5XSA9IHRoaXMuYXNzaWduQ29uZmlnVG9MYXllcihvbGRDb25maWdba2V5XSwgbmV3Q29uZmlnW2tleV0pO1xuICAgICAgfSBlbHNlIGlmIChub3ROdWxsb3JVbmRlZmluZWQobmV3Q29uZmlnW2tleV0pICYmICFub3RUb0NvcHkuaW5jbHVkZXMoa2V5KSkge1xuXG4gICAgICAgIGNvcGllZFtrZXldID0gbmV3Q29uZmlnW2tleV07XG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIGNvcGllZFtrZXldID0gb2xkQ29uZmlnW2tleV07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY29waWVkO1xuICB9XG5cbiAgcmVnaXN0ZXJWaXNDb25maWcobGF5ZXJWaXNDb25maWdzKSB7XG4gICAgT2JqZWN0LmtleXMobGF5ZXJWaXNDb25maWdzKS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJyAmJiBMQVlFUl9WSVNfQ09ORklHU1tsYXllclZpc0NvbmZpZ3NbaXRlbV1dKSB7XG5cbiAgICAgICAgLy8gaWYgYXNzaWduZWQgb25lIG9mIGRlZmF1bHQgTEFZRVJfQ09ORklHU1xuICAgICAgICB0aGlzLmNvbmZpZy52aXNDb25maWdbaXRlbV0gPSBMQVlFUl9WSVNfQ09ORklHU1tsYXllclZpc0NvbmZpZ3NbaXRlbV1dLmRlZmF1bHRWYWx1ZTtcbiAgICAgICAgdGhpcy52aXNDb25maWdTZXR0aW5nc1tpdGVtXSA9IExBWUVSX1ZJU19DT05GSUdTW2xheWVyVmlzQ29uZmlnc1tpdGVtXV07XG4gICAgICB9IGVsc2UgaWYgKFsndHlwZScsICdkZWZhdWx0VmFsdWUnXS5ldmVyeShwID0+IGxheWVyVmlzQ29uZmlnc1tpdGVtXVtwXSkpIHtcblxuICAgICAgICAvLyBpZiBwcm92aWRlZCBjdXN0b21pemVkIHZpc0NvbmZpZywgYW5kIGhhcyB0eXBlICYmIGRlZmF1bHRWYWx1ZVxuICAgICAgICAvLyBUT0RPOiBmdXJ0aGVyIGNoZWNrIGlmIGN1c3RvbWl6ZWQgdmlzQ29uZmlnIGlzIHZhbGlkXG4gICAgICAgIHRoaXMuY29uZmlnLnZpc0NvbmZpZ1tpdGVtXSA9IGxheWVyVmlzQ29uZmlnc1tpdGVtXS5kZWZhdWx0VmFsdWU7XG4gICAgICAgIHRoaXMudmlzQ29uZmlnU2V0dGluZ3NbaXRlbV0gPSBsYXllclZpc0NvbmZpZ3NbaXRlbV07XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRMYXllckNvbHVtbnMoKSB7XG4gICAgY29uc3QgcmVxdWlyZWQgPVxuICAgICAgdGhpcy5yZXF1aXJlZExheWVyQ29sdW1ucy5yZWR1Y2UoKGFjY3UsIGtleSkgPT4gKHtcbiAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgW2tleV06IHt2YWx1ZTogbnVsbCwgZmllbGRJZHg6IC0xfVxuICAgICAgfSksIHt9KTtcbiAgICBjb25zdCBvcHRpb25hbCA9XG4gICAgICB0aGlzLm9wdGlvbmFsQ29sdW1ucy5yZWR1Y2UoKGFjY3UsIGtleSkgPT4gKHtcbiAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgW2tleV06IHt2YWx1ZTogbnVsbCwgZmllbGRJZHg6IC0xLCBvcHRpb25hbDogdHJ1ZX1cbiAgICAgIH0pLCB7fSk7XG5cbiAgICByZXR1cm4gey4uLnJlcXVpcmVkLCAuLi5vcHRpb25hbH07XG4gIH1cblxuICB1cGRhdGVMYXllckNvbmZpZyhuZXdDb25maWcpIHtcbiAgICB0aGlzLmNvbmZpZyA9IHsuLi50aGlzLmNvbmZpZywgLi4ubmV3Q29uZmlnfTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHVwZGF0ZUxheWVyVmlzQ29uZmlnKG5ld1Zpc0NvbmZpZykge1xuICAgIHRoaXMuY29uZmlnLnZpc0NvbmZpZyA9IHsuLi50aGlzLmNvbmZpZy52aXNDb25maWcsIC4uLm5ld1Zpc0NvbmZpZ307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgbGF5ZXIgaGFzIGFsbCBjb2x1bW5zXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBsYXllclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0geWVzIG9yIG5vXG4gICAqL1xuICBoYXNBbGxDb2x1bW5zKCkge1xuICAgIGNvbnN0IHtjb2x1bW5zfSA9IHRoaXMuY29uZmlnO1xuICAgIHJldHVybiBjb2x1bW5zICYmXG4gICAgICBPYmplY3QudmFsdWVzKGNvbHVtbnMpLmV2ZXJ5KHYgPT4ge1xuICAgICAgICByZXR1cm4gQm9vbGVhbih2Lm9wdGlvbmFsIHx8ICh2LnZhbHVlICYmIHYuZmllbGRJZHggPiAtMSkpO1xuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciBsYXllciBoYXMgZGF0YVxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gbGF5ZXJcbiAgICogQHBhcmFtIHtBcnJheSB8IE9iamVjdH0gbGF5ZXJEYXRhXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB5ZXMgb3Igbm9cbiAgICovXG4gIGhhc0xheWVyRGF0YShsYXllckRhdGEpIHtcbiAgICBpZiAoIWxheWVyRGF0YSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBCb29sZWFuKGxheWVyRGF0YS5kYXRhICYmIGxheWVyRGF0YS5kYXRhLmxlbmd0aCk7XG4gIH1cblxuICBpc1ZhbGlkVG9TYXZlKCkge1xuICAgIHJldHVybiB0aGlzLnR5cGUgJiYgdGhpcy5oYXNBbGxDb2x1bW5zKCk7XG4gIH1cblxuICBzaG91bGRSZW5kZXJMYXllcihkYXRhKSB7XG4gICAgcmV0dXJuIHRoaXMudHlwZSAmJiB0aGlzLmhhc0FsbENvbHVtbnMoKSAmJiB0aGlzLmNvbmZpZy5pc1Zpc2libGUgJiYgdGhpcy5oYXNMYXllckRhdGEoZGF0YSk7XG4gIH1cblxuICBnZXRWaXNDaGFubmVsU2NhbGUoc2NhbGUsIGRvbWFpbiwgcmFuZ2UsIGZpeGVkKSB7XG4gICAgcmV0dXJuIFNDQUxFX0ZVTkNbZml4ZWQgPyAnbGluZWFyJyA6IHNjYWxlXSgpXG4gICAgICAuZG9tYWluKGRvbWFpbilcbiAgICAgIC5yYW5nZShmaXhlZCA/IGRvbWFpbiA6IHJhbmdlKTtcbiAgfVxuXG4gIGdldFBvaW50c0JvdW5kcyhhbGxEYXRhLCBnZXRQb3NpdGlvbikge1xuICAgIC8vIG5vIG5lZWQgdG8gbG9vcCB0aHJvdWdoIHRoZSBlbnRpcmUgZGF0YXNldFxuICAgIC8vIGdldCBhIHNhbXBsZSBvZiBkYXRhIHRvIGNhbGN1bGF0ZSBib3VuZHNcbiAgICBjb25zdCBzYW1wbGVEYXRhID0gYWxsRGF0YS5sZW5ndGggPiBNQVhfU0FNUExFX1NJWkUgPyBnZXRTYW1wbGVEYXRhKGFsbERhdGEsIE1BWF9TQU1QTEVfU0laRSkgOiBhbGxEYXRhO1xuICAgIGNvbnN0IHBvaW50cyA9IHNhbXBsZURhdGEubWFwKGdldFBvc2l0aW9uKTtcblxuICAgIGNvbnN0IGxhdEJvdW5kcyA9IGdldExhdExuZ0JvdW5kcyhwb2ludHMsIDEsIFstOTAsIDkwXSk7XG4gICAgY29uc3QgbG5nQm91bmRzID0gZ2V0TGF0TG5nQm91bmRzKHBvaW50cywgMCwgWy0xODAsIDE4MF0pO1xuXG4gICAgaWYgKCFsYXRCb3VuZHMgfHwgIWxuZ0JvdW5kcykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIFtsbmdCb3VuZHNbMF0sIGxhdEJvdW5kc1swXSwgbG5nQm91bmRzWzFdLCBsYXRCb3VuZHNbMV1dO1xuICB9XG5cbiAgZ2V0TGlnaHRTZXR0aW5nc0Zyb21Cb3VuZHMoYm91bmRzKSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYm91bmRzKSAmJiBib3VuZHMubGVuZ3RoID49IDQgPyB7XG4gICAgICAuLi5ERUZBVUxUX0xJR0hUX1NFVFRJTkdTLFxuICAgICAgbGlnaHRzUG9zaXRpb246IFtcbiAgICAgICAgLi4uYm91bmRzLnNsaWNlKDAsIDIpLFxuICAgICAgICBERUZBVUxUX0xJR0hUX1NFVFRJTkdTLmxpZ2h0c1Bvc2l0aW9uWzJdLFxuICAgICAgICAuLi5ib3VuZHMuc2xpY2UoMiwgNCksXG4gICAgICAgIERFRkFVTFRfTElHSFRfU0VUVElOR1MubGlnaHRzUG9zaXRpb25bNV1cbiAgICAgIF1cbiAgICB9IDogREVGQVVMVF9MSUdIVF9TRVRUSU5HUztcbiAgfVxuXG4gIGdldEVuY29kZWRDaGFubmVsVmFsdWUoc2NhbGUsIGRhdGEsIGZpZWxkLCBkZWZhdWx0VmFsdWUgPSBOT19WQUxVRV9DT0xPUiwgZ2V0VmFsdWUgPSBkZWZhdWx0R2V0RmllbGRWYWx1ZSkge1xuICAgIGNvbnN0IHt0eXBlfSA9IGZpZWxkO1xuICAgIGNvbnN0IHZhbHVlID0gZ2V0VmFsdWUoZmllbGQsIGRhdGEpO1xuICAgIGxldCBhdHRyaWJ1dGVWYWx1ZTtcbiAgICBpZiAodHlwZSA9PT0gQUxMX0ZJRUxEX1RZUEVTLnRpbWVzdGFtcCkge1xuICAgICAgLy8gc2hvdWxkbid0IG5lZWQgdG8gY29udmVydCBoZXJlXG4gICAgICAvLyBzY2FsZSBGdW5jdGlvbiBzaG91bGQgdGFrZSBjYXJlIG9mIGl0XG4gICAgICBhdHRyaWJ1dGVWYWx1ZSA9IHNjYWxlKG5ldyBEYXRlKHZhbHVlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF0dHJpYnV0ZVZhbHVlID0gc2NhbGUodmFsdWUpO1xuICAgIH1cblxuICAgIGlmICghYXR0cmlidXRlVmFsdWUpIHtcbiAgICAgIGF0dHJpYnV0ZVZhbHVlID0gZGVmYXVsdFZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiBhdHRyaWJ1dGVWYWx1ZTtcbiAgfVxuXG4gIHVwZGF0ZU1ldGEobWV0YSkge1xuICAgIHRoaXMubWV0YSA9IHsuLi50aGlzLm1ldGEsIC4uLm1ldGF9O1xuICB9XG5cbiAgLyoqXG4gICAqIGhlbHBlciBmdW5jdGlvbiB0byB1cGRhdGUgb25lIGxheWVyIGRvbWFpbiB3aGVuIHN0YXRlLmRhdGEgY2hhbmdlZFxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdFtdfSBkYXRhXG4gICAqIEBwYXJhbSB7T2JqZWN0W119IGFsbERhdGFcbiAgICogQHBhcmFtIHtvYmplY3R9IGxheWVyXG4gICAqIEByZXR1cm5zIHtvYmplY3R9IGxheWVyXG4gICAqL1xuICB1cGRhdGVMYXllckRvbWFpbih7ZGF0YSwgYWxsRGF0YX0pIHtcbiAgICBPYmplY3QudmFsdWVzKHRoaXMudmlzdWFsQ2hhbm5lbHMpLmZvckVhY2goY2hhbm5lbCA9PiB7XG4gICAgICBjb25zdCB7ZG9tYWlufSA9IGNoYW5uZWw7XG4gICAgICBjb25zdCB1cGRhdGVkRG9tYWluID0gdGhpcy5jYWxjdWxhdGVMYXllckRvbWFpbih7ZGF0YSwgYWxsRGF0YX0sIGNoYW5uZWwpO1xuXG4gICAgICB0aGlzLnVwZGF0ZUxheWVyQ29uZmlnKHtbZG9tYWluXTogdXBkYXRlZERvbWFpbn0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB1cGRhdGVMYXllclZpc3VhbENoYW5uZWwoe2RhdGEsIGFsbERhdGF9LCBjaGFubmVsKSB7XG4gICAgY29uc3QgdmlzdWFsQ2hhbm5lbCA9IHRoaXMudmlzdWFsQ2hhbm5lbHNbY2hhbm5lbF07XG4gICAgY29uc3Qge2ZpZWxkLCBzY2FsZSwgZG9tYWluLCBjaGFubmVsU2NhbGVUeXBlfSA9IHZpc3VhbENoYW5uZWw7XG5cbiAgICBpZiAodGhpcy5jb25maWdbZmllbGRdKSB7XG4gICAgICAvLyBpZiBmaWVsZCBpcyBzZWxlY3RlZCwgY2hlY2sgaWYgY3VycmVudCBzZWxlY3RlZCBzY2FsZSBpc1xuICAgICAgLy8gc3VwcG9ydGVkLCBpZiBub3QsIHVwZGF0ZSB0byBkZWZhdWx0XG4gICAgICBjb25zdCBzY2FsZU9wdGlvbnMgPSBGSUVMRF9PUFRTW3RoaXMuY29uZmlnW2ZpZWxkXS50eXBlXS5zY2FsZVtjaGFubmVsU2NhbGVUeXBlXTtcbiAgICAgIGlmICghc2NhbGVPcHRpb25zLmluY2x1ZGVzKHRoaXMuY29uZmlnW3NjYWxlXSkpIHtcbiAgICAgICAgdGhpcy51cGRhdGVMYXllckNvbmZpZyh7W3NjYWxlXTogc2NhbGVPcHRpb25zWzBdfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjYWxjdWxhdGUgbGF5ZXIgY2hhbm5lbCBkb21haW5cbiAgICBjb25zdCB1cGRhdGVkRG9tYWluID0gdGhpcy5jYWxjdWxhdGVMYXllckRvbWFpbihcbiAgICAgIHtkYXRhLCBhbGxEYXRhfSxcbiAgICAgIHZpc3VhbENoYW5uZWxcbiAgICApO1xuXG4gICAgdGhpcy51cGRhdGVMYXllckNvbmZpZyh7W2RvbWFpbl06IHVwZGF0ZWREb21haW59KTtcbiAgfVxuXG4gIGNhbGN1bGF0ZUxheWVyRG9tYWluKHtkYXRhLCBhbGxEYXRhfSwgdmlzdWFsQ2hhbm5lbCkge1xuICAgIGNvbnN0IGRlZmF1bHREb21haW4gPSBbMCwgMV07XG4gICAgY29uc3Qge3NjYWxlfSA9IHZpc3VhbENoYW5uZWw7XG4gICAgY29uc3Qgc2NhbGVUeXBlID0gdGhpcy5jb25maWdbc2NhbGVdO1xuXG4gICAgY29uc3QgZmllbGQgPSB0aGlzLmNvbmZpZ1t2aXN1YWxDaGFubmVsLmZpZWxkXTtcbiAgICBpZiAoIWZpZWxkKSB7XG4gICAgICAvLyBpZiBjb2xvckZpZWxkIG9yIHNpemVGaWVsZCB3ZXJlIHNldCBiYWNrIHRvIG51bGxcbiAgICAgIHJldHVybiBkZWZhdWx0RG9tYWluO1xuICAgIH1cblxuICAgIGlmICghU0NBTEVfVFlQRVNbc2NhbGVUeXBlXSkge1xuICAgICAgQ29uc29sZS5lcnJvcihgc2NhbGUgdHlwZSAke3NjYWxlVHlwZX0gbm90IHN1cHBvcnRlZGApO1xuICAgICAgcmV0dXJuIGRlZmF1bHREb21haW47XG4gICAgfVxuXG4gICAgLy8gVE9ETzogcmVmYWN0b3IgdG8gYWRkIHZhbHVlQWNjZXNzb3IgdG8gZmllbGRcbiAgICBjb25zdCBmaWVsZElkeCA9IGZpZWxkLnRhYmxlRmllbGRJbmRleCAtIDE7XG4gICAgY29uc3QgaXNUaW1lID0gZmllbGQudHlwZSA9PT0gQUxMX0ZJRUxEX1RZUEVTLnRpbWVzdGFtcDtcbiAgICBjb25zdCB2YWx1ZUFjY2Vzc29yID0gbWF5YmVUb0RhdGUuYmluZChudWxsLCBpc1RpbWUsIGZpZWxkSWR4LCBmaWVsZC5mb3JtYXQpO1xuICAgIGNvbnN0IHNvcnRGdW5jdGlvbiA9IGdldFNvcnRpbmdGdW5jdGlvbihmaWVsZC50eXBlKTtcblxuICAgIHN3aXRjaCAoc2NhbGVUeXBlKSB7XG4gICAgICBjYXNlIFNDQUxFX1RZUEVTLm9yZGluYWw6XG4gICAgICBjYXNlIFNDQUxFX1RZUEVTLnBvaW50OlxuICAgICAgICAvLyBkbyBub3QgcmVjYWxjdWxhdGUgb3JkaW5hbCBkb21haW4gYmFzZWQgb24gZmlsdGVycmVkIGRhdGFcbiAgICAgICAgcmV0dXJuIGdldE9yZGluYWxEb21haW4oYWxsRGF0YSwgdmFsdWVBY2Nlc3Nvcik7XG5cbiAgICAgIGNhc2UgU0NBTEVfVFlQRVMucXVhbnRpbGU6XG4gICAgICAgIHJldHVybiBnZXRRdWFudGlsZURvbWFpbihkYXRhLCB2YWx1ZUFjY2Vzc29yLCBzb3J0RnVuY3Rpb24pO1xuXG4gICAgICBjYXNlIFNDQUxFX1RZUEVTLnF1YW50aXplOlxuICAgICAgY2FzZSBTQ0FMRV9UWVBFUy5saW5lYXI6XG4gICAgICBjYXNlIFNDQUxFX1RZUEVTLnNxcnQ6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZ2V0TGluZWFyRG9tYWluKGRhdGEsIHZhbHVlQWNjZXNzb3IpO1xuICAgIH1cbiAgfVxuXG4gIGlzTGF5ZXJIb3ZlcmVkKG9iamVjdEluZm8pIHtcbiAgICByZXR1cm4gb2JqZWN0SW5mbyAmJiBvYmplY3RJbmZvLmxheWVyICYmIG9iamVjdEluZm8ucGlja2VkICYmXG4gICAgICBvYmplY3RJbmZvLmxheWVyLnByb3BzLmlkID09PSB0aGlzLmlkO1xuICB9XG5cbiAgZ2V0UmFkaXVzU2NhbGVCeVpvb20oem9vbSwgZml4ZWRSYWRpdXMpIHtcbiAgICBjb25zdCByYWRpdXNDaGFubmVsID0gT2JqZWN0LnZhbHVlcyh0aGlzLnZpc3VhbENoYW5uZWxzKVxuICAgICAgLmZpbmQodmMgPT4gdmMucHJvcGVydHkgPT09ICdyYWRpdXMnKTtcblxuICAgIGlmICghcmFkaXVzQ2hhbm5lbCkge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfVxuXG4gICAgY29uc3QgZmllbGQgPSByYWRpdXNDaGFubmVsLmZpZWxkO1xuICAgIGNvbnN0IGZpeGVkID0gZml4ZWRSYWRpdXMgPT09IHVuZGVmaW5lZCA/IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5maXhlZFJhZGl1cyA6IGZpeGVkUmFkaXVzO1xuICAgIGNvbnN0IHtyYWRpdXN9ID0gdGhpcy5jb25maWcudmlzQ29uZmlnO1xuXG4gICAgcmV0dXJuIGZpeGVkID8gMSA6ICgodGhpcy5jb25maWdbZmllbGRdID8gMSA6IHJhZGl1cykgKiB0aGlzLmdldFpvb21GYWN0b3Ioem9vbSkpXG4gIH1cblxuICBzaG91bGRDYWxjdWxhdGVMYXllckRhdGEocHJvcHMpIHtcbiAgICByZXR1cm4gcHJvcHMuc29tZShwID0+ICF0aGlzLm5vbmVMYXllckRhdGFBZmZlY3RpbmdQcm9wcy5pbmNsdWRlcyhwKSk7XG4gIH1cbn1cbiJdfQ==