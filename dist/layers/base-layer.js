"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.colorMaker = exports.layerColors = exports.OVERLAY_TYPE = exports.LAYER_ID_LENGTH = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _window = require("global/window");

var _keymirror = _interopRequireDefault(require("keymirror"));

var _extensions = require("@deck.gl/extensions");

var _core = require("@deck.gl/core");

var _layers = require("@deck.gl/layers");

var _defaultLayerIcon = _interopRequireDefault(require("./default-layer-icon"));

var _layerUpdate = require("./layer-update");

var _defaultSettings = require("../constants/default-settings");

var _colorRanges = require("../constants/color-ranges");

var _customColorRanges = require("../constants/custom-color-ranges");

var _layerFactory = require("./layer-factory");

var _utils = require("../utils/utils");

var _dataUtils = require("../utils/data-utils");

var _colorUtils = require("../utils/color-utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var _marked = /*#__PURE__*/_regenerator["default"].mark(generateColor);

/** @typedef {import('./index').Layer} LayerClass} */

/**
 * Approx. number of points to sample in a large data set
 * @type {number}
 */
var LAYER_ID_LENGTH = 6;
exports.LAYER_ID_LENGTH = LAYER_ID_LENGTH;
var MAX_SAMPLE_SIZE = 5000;
var defaultDomain = [0, 1];
var dataFilterExtension = new _extensions.DataFilterExtension({
  filterSize: _defaultSettings.MAX_GPU_FILTERS
});

var identity = function identity(d) {
  return d;
};

var defaultDataAccessor = function defaultDataAccessor(d) {
  return d.data;
};

var OVERLAY_TYPE = (0, _keymirror["default"])({
  deckgl: null,
  mapboxgl: null
});
exports.OVERLAY_TYPE = OVERLAY_TYPE;
var layerColors = Object.values(_customColorRanges.DataVizColors).map(_colorUtils.hexToRgb);
exports.layerColors = layerColors;

function generateColor() {
  var index;
  return _regenerator["default"].wrap(function generateColor$(_context) {
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
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}

var colorMaker = generateColor();
exports.colorMaker = colorMaker;

var defaultGetFieldValue = function defaultGetFieldValue(field, d) {
  return field.valueAccessor(d);
};
/** @type {LayerClass} */


var Layer = /*#__PURE__*/function () {
  function Layer() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2["default"])(this, Layer);
    this.id = props.id || (0, _utils.generateHashId)(LAYER_ID_LENGTH); // meta

    this.meta = {}; // visConfigSettings

    this.visConfigSettings = {}; // @ts-ignore

    this.config = this.getDefaultLayerConfig(_objectSpread({
      columns: this.getLayerColumns()
    }, props));
  }

  (0, _createClass2["default"])(Layer, [{
    key: "layerIcon",
    get: function get() {
      return _defaultLayerIcon["default"];
    }
  }, {
    key: "overlayType",
    get: function get() {
      return OVERLAY_TYPE.deckgl;
    }
  }, {
    key: "type",
    get: function get() {
      return null;
    }
  }, {
    key: "name",
    get: function get() {
      return this.type;
    }
  }, {
    key: "isAggregated",
    get: function get() {
      return false;
    }
  }, {
    key: "requiredLayerColumns",
    get: function get() {
      return [];
    }
  }, {
    key: "optionalColumns",
    get: function get() {
      return [];
    }
  }, {
    key: "noneLayerDataAffectingProps",
    get: function get() {
      return ['label', 'opacity', 'thickness', 'isVisible', 'hidden'];
    }
  }, {
    key: "visualChannels",
    get: function get() {
      return {
        color: {
          property: 'color',
          field: 'colorField',
          scale: 'colorScale',
          domain: 'colorDomain',
          range: 'colorRange',
          key: 'color',
          channelScaleType: _defaultSettings.CHANNEL_SCALES.color,
          nullValue: _defaultSettings.NO_VALUE_COLOR,
          defaultValue: function defaultValue(config) {
            return config.color;
          }
        },
        size: {
          property: 'size',
          field: 'sizeField',
          scale: 'sizeScale',
          domain: 'sizeDomain',
          range: 'sizeRange',
          key: 'size',
          channelScaleType: _defaultSettings.CHANNEL_SCALES.size,
          nullValue: 0,
          defaultValue: 1
        }
      };
    }
    /*
     * Column pairs maps layer column to a specific field pairs,
     * By default, it is set to null
     */

  }, {
    key: "columnPairs",
    get: function get() {
      return null;
    }
    /*
     * Default point column pairs, can be used for point based layers: point, icon etc.
     */

  }, {
    key: "defaultPointColumnPairs",
    get: function get() {
      return {
        lat: {
          pair: 'lng',
          fieldPairKey: 'lat'
        },
        lng: {
          pair: 'lat',
          fieldPairKey: 'lng'
        }
      };
    }
    /*
     * Default link column pairs, can be used for link based layers: arc, line etc
     */

  }, {
    key: "defaultLinkColumnPairs",
    get: function get() {
      return {
        lat0: {
          pair: 'lng0',
          fieldPairKey: 'lat'
        },
        lng0: {
          pair: 'lat0',
          fieldPairKey: 'lng'
        },
        lat1: {
          pair: 'lng1',
          fieldPairKey: 'lat'
        },
        lng1: {
          pair: 'lat1',
          fieldPairKey: 'lng'
        }
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

  }, {
    key: "layerInfoModal",
    get: function get() {
      return null;
    }
    /*
     * Given a dataset, automatically find props to create layer based on it
     * and return the props and previous found layers.
     * By default, no layers will be found
     */

  }, {
    key: "getDefaultLayerConfig",
    value: function getDefaultLayerConfig() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return {
        dataId: props.dataId || null,
        label: props.label || _layerFactory.DEFAULT_LAYER_LABEL,
        color: props.color || colorMaker.next().value,
        columns: props.columns || null,
        isVisible: props.isVisible || false,
        isConfigActive: props.isConfigActive || false,
        highlightColor: props.highlightColor || _layerFactory.DEFAULT_HIGHLIGHT_COLOR,
        hidden: props.hidden || false,
        // TODO: refactor this into separate visual Channel config
        // color by field, domain is set by filters, field, scale type
        colorField: null,
        colorDomain: [0, 1],
        colorScale: _defaultSettings.SCALE_TYPES.quantile,
        // color by size, domain is set by filters, field, scale type
        sizeDomain: [0, 1],
        sizeScale: _defaultSettings.SCALE_TYPES.linear,
        sizeField: null,
        visConfig: {},
        textLabel: [_layerFactory.DEFAULT_TEXT_LABEL],
        colorUI: {
          color: _layerFactory.DEFAULT_COLOR_UI,
          colorRange: _layerFactory.DEFAULT_COLOR_UI
        },
        animation: {
          enabled: false
        }
      };
    }
    /**
     * Get the description of a visualChannel config
     * @param key
     * @returns {{label: string, measure: (string|string)}}
     */

  }, {
    key: "getVisualChannelDescription",
    value: function getVisualChannelDescription(key) {
      // e.g. label: Color, measure: Vehicle Type
      return {
        label: this.visConfigSettings[this.visualChannels[key].range].label,
        measure: this.config[this.visualChannels[key].field] ? this.config[this.visualChannels[key].field].displayName || this.config[this.visualChannels[key].field].name : this.visualChannels[key].defaultMeasure
      };
    }
    /**
     * Assign a field to layer column, return column config
     * @param key - Column Key
     * @param field - Selected field
     * @returns {{}} - Column config
     */

  }, {
    key: "assignColumn",
    value: function assignColumn(key, field) {
      // field value could be null for optional columns
      var update = field ? {
        value: field.name,
        fieldIdx: field.fieldIdx
      } : {
        value: null,
        fieldIdx: -1
      };
      return _objectSpread(_objectSpread({}, this.config.columns), {}, (0, _defineProperty2["default"])({}, key, _objectSpread(_objectSpread({}, this.config.columns[key]), update)));
    }
    /**
     * Assign a field pair to column config, return column config
     * @param key - Column Key
     * @param pair - field Pair
     * @returns {object} - Column config
     */

  }, {
    key: "assignColumnPairs",
    value: function assignColumnPairs(key, pair) {
      var _this$columnPairs, _this$columnPairs2, _this$columnPairs3, _objectSpread3;

      if (!this.columnPairs || !((_this$columnPairs = this.columnPairs) !== null && _this$columnPairs !== void 0 && _this$columnPairs[key])) {
        // should not end in this state
        return this.config.columns;
      }

      var _this$columnPairs$key = (_this$columnPairs2 = this.columnPairs) === null || _this$columnPairs2 === void 0 ? void 0 : _this$columnPairs2[key],
          partnerKey = _this$columnPairs$key.pair,
          fieldPairKey = _this$columnPairs$key.fieldPairKey;

      var _this$columnPairs$par = (_this$columnPairs3 = this.columnPairs) === null || _this$columnPairs3 === void 0 ? void 0 : _this$columnPairs3[partnerKey],
          partnerFieldPairKey = _this$columnPairs$par.fieldPairKey;

      return _objectSpread(_objectSpread({}, this.config.columns), {}, (_objectSpread3 = {}, (0, _defineProperty2["default"])(_objectSpread3, key, pair[fieldPairKey]), (0, _defineProperty2["default"])(_objectSpread3, partnerKey, pair[partnerFieldPairKey]), _objectSpread3));
    }
    /**
     * Calculate a radius zoom multiplier to render points, so they are visible in all zoom level
     * @param {object} mapState
     * @param {number} mapState.zoom - actual zoom
     * @param {number | void} mapState.zoomOffset - zoomOffset when render in the plot container for export image
     * @returns {number}
     */

  }, {
    key: "getZoomFactor",
    value: function getZoomFactor(_ref) {
      var zoom = _ref.zoom,
          _ref$zoomOffset = _ref.zoomOffset,
          zoomOffset = _ref$zoomOffset === void 0 ? 0 : _ref$zoomOffset;
      return Math.pow(2, Math.max(14 - zoom + zoomOffset, 0));
    }
    /**
     * Calculate a elevation zoom multiplier to render points, so they are visible in all zoom level
     * @param {object} mapState
     * @param {number} mapState.zoom - actual zoom
     * @param {number | void} mapState.zoomOffset - zoomOffset when render in the plot container for export image
     * @returns {number}
     */

  }, {
    key: "getElevationZoomFactor",
    value: function getElevationZoomFactor(_ref2) {
      var zoom = _ref2.zoom,
          _ref2$zoomOffset = _ref2.zoomOffset,
          zoomOffset = _ref2$zoomOffset === void 0 ? 0 : _ref2$zoomOffset;
      return this.config.visConfig.enableElevationZoomFactor ? Math.pow(2, Math.max(8 - zoom + zoomOffset, 0)) : 1;
    }
  }, {
    key: "formatLayerData",
    value: function formatLayerData(datasets, filteredIndex) {
      return {};
    }
  }, {
    key: "renderLayer",
    value: function renderLayer() {
      return [];
    }
  }, {
    key: "getHoverData",
    value: function getHoverData(object) {
      if (!object) {
        return null;
      } // by default, each entry of layerData should have a data property points
      // to the original item in the allData array
      // each layer can implement its own getHoverData method


      return object.data;
    }
    /**
     * When change layer type, try to copy over layer configs as much as possible
     * @param configToCopy - config to copy over
     * @param visConfigSettings - visConfig settings of config to copy
     */

  }, {
    key: "assignConfigToLayer",
    value: function assignConfigToLayer(configToCopy, visConfigSettings) {
      var _this = this;

      // don't deep merge visualChannel field
      // don't deep merge color range, reversed: is not a key by default
      var shallowCopy = ['colorRange', 'strokeColorRange'].concat(Object.values(this.visualChannels).map(function (v) {
        return v.field;
      })); // don't copy over domain and animation

      var notToCopy = ['animation'].concat(Object.values(this.visualChannels).map(function (v) {
        return v.domain;
      })); // if range is for the same property group copy it, otherwise, not to copy

      Object.values(this.visualChannels).forEach(function (v) {
        if (configToCopy.visConfig[v.range] && _this.visConfigSettings[v.range] && visConfigSettings[v.range].group !== _this.visConfigSettings[v.range].group) {
          notToCopy.push(v.range);
        }
      }); // don't copy over visualChannel range

      var currentConfig = this.config;
      var copied = this.copyLayerConfig(currentConfig, configToCopy, {
        shallowCopy: shallowCopy,
        notToCopy: notToCopy
      });
      this.updateLayerConfig(copied); // validate visualChannel field type and scale types

      Object.keys(this.visualChannels).forEach(function (channel) {
        _this.validateVisualChannel(channel);
      });
    }
    /*
     * Recursively copy config over to an empty layer
     * when received saved config, or copy config over from a different layer type
     * make sure to only copy over value to existing keys
     * @param {object} currentConfig - existing config to be override
     * @param {object} configToCopy - new Config to copy over
     * @param {string[]} shallowCopy - array of properties to not to be deep copied
     * @param {string[]} notToCopy - array of properties not to copy
     * @returns {object} - copied config
     */

  }, {
    key: "copyLayerConfig",
    value: function copyLayerConfig(currentConfig, configToCopy) {
      var _this2 = this;

      var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          _ref3$shallowCopy = _ref3.shallowCopy,
          shallowCopy = _ref3$shallowCopy === void 0 ? [] : _ref3$shallowCopy,
          _ref3$notToCopy = _ref3.notToCopy,
          notToCopy = _ref3$notToCopy === void 0 ? [] : _ref3$notToCopy;

      var copied = {};
      Object.keys(currentConfig).forEach(function (key) {
        if ((0, _utils.isPlainObject)(currentConfig[key]) && (0, _utils.isPlainObject)(configToCopy[key]) && !shallowCopy.includes(key) && !notToCopy.includes(key)) {
          // recursively assign object value
          copied[key] = _this2.copyLayerConfig(currentConfig[key], configToCopy[key], {
            shallowCopy: shallowCopy,
            notToCopy: notToCopy
          });
        } else if ((0, _dataUtils.notNullorUndefined)(configToCopy[key]) && !notToCopy.includes(key)) {
          // copy
          copied[key] = configToCopy[key];
        } else {
          // keep existing
          copied[key] = currentConfig[key];
        }
      });
      return copied;
    }
  }, {
    key: "registerVisConfig",
    value: function registerVisConfig(layerVisConfigs) {
      var _this3 = this;

      Object.keys(layerVisConfigs).forEach(function (item) {
        if (typeof item === 'string' && _layerFactory.LAYER_VIS_CONFIGS[layerVisConfigs[item]]) {
          // if assigned one of default LAYER_CONFIGS
          _this3.config.visConfig[item] = _layerFactory.LAYER_VIS_CONFIGS[layerVisConfigs[item]].defaultValue;
          _this3.visConfigSettings[item] = _layerFactory.LAYER_VIS_CONFIGS[layerVisConfigs[item]];
        } else if (['type', 'defaultValue'].every(function (p) {
          return layerVisConfigs[item].hasOwnProperty(p);
        })) {
          // if provided customized visConfig, and has type && defaultValue
          // TODO: further check if customized visConfig is valid
          _this3.config.visConfig[item] = layerVisConfigs[item].defaultValue;
          _this3.visConfigSettings[item] = layerVisConfigs[item];
        }
      });
    }
  }, {
    key: "getLayerColumns",
    value: function getLayerColumns() {
      var columnValidators = this.columnValidators || {};
      var required = this.requiredLayerColumns.reduce(function (accu, key) {
        return _objectSpread(_objectSpread({}, accu), {}, (0, _defineProperty2["default"])({}, key, columnValidators[key] ? {
          value: null,
          fieldIdx: -1,
          validator: columnValidators[key]
        } : {
          value: null,
          fieldIdx: -1
        }));
      }, {});
      var optional = this.optionalColumns.reduce(function (accu, key) {
        return _objectSpread(_objectSpread({}, accu), {}, (0, _defineProperty2["default"])({}, key, {
          value: null,
          fieldIdx: -1,
          optional: true
        }));
      }, {});
      return _objectSpread(_objectSpread({}, required), optional);
    }
  }, {
    key: "updateLayerConfig",
    value: function updateLayerConfig(newConfig) {
      this.config = _objectSpread(_objectSpread({}, this.config), newConfig);
      return this;
    }
  }, {
    key: "updateLayerVisConfig",
    value: function updateLayerVisConfig(newVisConfig) {
      this.config.visConfig = _objectSpread(_objectSpread({}, this.config.visConfig), newVisConfig);
      return this;
    }
  }, {
    key: "updateLayerColorUI",
    value: function updateLayerColorUI(prop, newConfig) {
      var _this$config = this.config,
          previous = _this$config.colorUI,
          visConfig = _this$config.visConfig;

      if (!(0, _utils.isPlainObject)(newConfig) || typeof prop !== 'string') {
        return this;
      }

      var colorUIProp = Object.entries(newConfig).reduce(function (accu, _ref4) {
        var _ref5 = (0, _slicedToArray2["default"])(_ref4, 2),
            key = _ref5[0],
            value = _ref5[1];

        return _objectSpread(_objectSpread({}, accu), {}, (0, _defineProperty2["default"])({}, key, (0, _utils.isPlainObject)(accu[key]) && (0, _utils.isPlainObject)(value) ? _objectSpread(_objectSpread({}, accu[key]), value) : value));
      }, previous[prop] || _layerFactory.DEFAULT_COLOR_UI);

      var colorUI = _objectSpread(_objectSpread({}, previous), {}, (0, _defineProperty2["default"])({}, prop, colorUIProp));

      this.updateLayerConfig({
        colorUI: colorUI
      }); // if colorUI[prop] is colorRange

      var isColorRange = visConfig[prop] && visConfig[prop].colors;

      if (isColorRange) {
        this.updateColorUIByColorRange(newConfig, prop);
        this.updateColorRangeByColorUI(newConfig, previous, prop);
        this.updateCustomPalette(newConfig, previous, prop);
      }

      return this;
    }
  }, {
    key: "updateCustomPalette",
    value: function updateCustomPalette(newConfig, previous, prop) {
      if (!newConfig.colorRangeConfig || !newConfig.colorRangeConfig.custom) {
        return;
      }

      var _this$config2 = this.config,
          colorUI = _this$config2.colorUI,
          visConfig = _this$config2.visConfig;
      if (!visConfig[prop]) return;
      var colors = visConfig[prop].colors;

      var customPalette = _objectSpread(_objectSpread({}, colorUI[prop].customPalette), {}, {
        name: 'Custom Palette',
        colors: (0, _toConsumableArray2["default"])(colors)
      });

      this.updateLayerConfig({
        colorUI: _objectSpread(_objectSpread({}, colorUI), {}, (0, _defineProperty2["default"])({}, prop, _objectSpread(_objectSpread({}, colorUI[prop]), {}, {
          customPalette: customPalette
        })))
      });
    }
    /**
     * if open dropdown and prop is color range
     * Automatically set colorRangeConfig's step and reversed
     * @param {*} newConfig
     * @param {*} prop
     */

  }, {
    key: "updateColorUIByColorRange",
    value: function updateColorUIByColorRange(newConfig, prop) {
      if (typeof newConfig.showDropdown !== 'number') return;
      var _this$config3 = this.config,
          colorUI = _this$config3.colorUI,
          visConfig = _this$config3.visConfig;
      this.updateLayerConfig({
        colorUI: _objectSpread(_objectSpread({}, colorUI), {}, (0, _defineProperty2["default"])({}, prop, _objectSpread(_objectSpread({}, colorUI[prop]), {}, {
          colorRangeConfig: _objectSpread(_objectSpread({}, colorUI[prop].colorRangeConfig), {}, {
            steps: visConfig[prop].colors.length,
            reversed: Boolean(visConfig[prop].reversed)
          })
        })))
      });
    }
  }, {
    key: "updateColorRangeByColorUI",
    value: function updateColorRangeByColorUI(newConfig, previous, prop) {
      // only update colorRange if changes in UI is made to 'reversed', 'steps' or steps
      var shouldUpdate = newConfig.colorRangeConfig && ['reversed', 'steps'].some(function (key) {
        return newConfig.colorRangeConfig.hasOwnProperty(key) && newConfig.colorRangeConfig[key] !== (previous[prop] || _layerFactory.DEFAULT_COLOR_UI).colorRangeConfig[key];
      });
      if (!shouldUpdate) return;
      var _this$config4 = this.config,
          colorUI = _this$config4.colorUI,
          visConfig = _this$config4.visConfig;
      var _colorUI$prop$colorRa = colorUI[prop].colorRangeConfig,
          steps = _colorUI$prop$colorRa.steps,
          reversed = _colorUI$prop$colorRa.reversed;
      var colorRange = visConfig[prop]; // find based on step or reversed

      var update;

      if (newConfig.colorRangeConfig.hasOwnProperty('steps')) {
        var group = (0, _colorUtils.getColorGroupByName)(colorRange);

        if (group) {
          var sameGroup = _colorRanges.COLOR_RANGES.filter(function (cr) {
            return (0, _colorUtils.getColorGroupByName)(cr) === group;
          });

          update = sameGroup.find(function (cr) {
            return cr.colors.length === steps;
          });

          if (update && colorRange.reversed) {
            update = (0, _colorUtils.reverseColorRange)(true, update);
          }
        }
      }

      if (newConfig.colorRangeConfig.hasOwnProperty('reversed')) {
        update = (0, _colorUtils.reverseColorRange)(reversed, update || colorRange);
      }

      if (update) {
        this.updateLayerVisConfig((0, _defineProperty2["default"])({}, prop, update));
      }
    }
    /**
     * Check whether layer has all columns
     * @returns {boolean} yes or no
     */

  }, {
    key: "hasAllColumns",
    value: function hasAllColumns() {
      var columns = this.config.columns;
      return columns && Object.values(columns).every(function (v) {
        return Boolean(v.optional || v.value && v.fieldIdx > -1);
      });
    }
    /**
     * Check whether layer has data
     *
     * @param {Array | Object} layerData
     * @returns {boolean} yes or no
     */

  }, {
    key: "hasLayerData",
    value: function hasLayerData(layerData) {
      if (!layerData) {
        return false;
      }

      return Boolean(layerData.data && layerData.data.length);
    }
  }, {
    key: "isValidToSave",
    value: function isValidToSave() {
      return this.type && this.hasAllColumns();
    }
  }, {
    key: "shouldRenderLayer",
    value: function shouldRenderLayer(data) {
      return this.type && this.config.isVisible && this.hasAllColumns() && this.hasLayerData(data) && typeof this.renderLayer === 'function';
    }
  }, {
    key: "getColorScale",
    value: function getColorScale(colorScale, colorDomain, colorRange) {
      if (Array.isArray(colorRange.colorMap)) {
        var cMap = new Map();
        colorRange.colorMap.forEach(function (_ref6) {
          var _ref7 = (0, _slicedToArray2["default"])(_ref6, 2),
              k = _ref7[0],
              v = _ref7[1];

          cMap.set(k, typeof v === 'string' ? (0, _colorUtils.hexToRgb)(v) : v);
        });

        var scale = _defaultSettings.SCALE_FUNC[_defaultSettings.SCALE_TYPES.ordinal]().domain(cMap.keys()).range(cMap.values()).unknown(cMap.get(_layerFactory.UNKNOWN_COLOR_KEY) || _defaultSettings.NO_VALUE_COLOR);

        return scale;
      }

      return this.getVisChannelScale(colorScale, colorDomain, colorRange.colors.map(_colorUtils.hexToRgb));
    }
    /**
     * Mapping from visual channels to deck.gl accesors
     * @param {Function} dataAccessor - access kepler.gl layer data from deck.gl layer
     * @return {Object} attributeAccessors - deck.gl layer attribute accessors
     */

  }, {
    key: "getAttributeAccessors",
    value: function getAttributeAccessors() {
      var _this4 = this;

      var dataAccessor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultDataAccessor;
      var attributeAccessors = {};
      Object.keys(this.visualChannels).forEach(function (channel) {
        var _this4$visualChannels = _this4.visualChannels[channel],
            field = _this4$visualChannels.field,
            fixed = _this4$visualChannels.fixed,
            scale = _this4$visualChannels.scale,
            domain = _this4$visualChannels.domain,
            range = _this4$visualChannels.range,
            accessor = _this4$visualChannels.accessor,
            defaultValue = _this4$visualChannels.defaultValue,
            getAttributeValue = _this4$visualChannels.getAttributeValue,
            nullValue = _this4$visualChannels.nullValue,
            channelScaleType = _this4$visualChannels.channelScaleType;
        var shouldGetScale = _this4.config[field];

        if (shouldGetScale) {
          var args = [_this4.config[scale], _this4.config[domain], _this4.config.visConfig[range]];
          var isFixed = fixed && _this4.config.visConfig[fixed];
          var scaleFunction = channelScaleType === _defaultSettings.CHANNEL_SCALES.color ? _this4.getColorScale.apply(_this4, args) : _this4.getVisChannelScale.apply(_this4, args.concat([isFixed]));

          attributeAccessors[accessor] = function (d) {
            return _this4.getEncodedChannelValue(scaleFunction, dataAccessor(d), _this4.config[field], nullValue);
          };
        } else if (typeof getAttributeValue === 'function') {
          attributeAccessors[accessor] = getAttributeValue(_this4.config);
        } else {
          attributeAccessors[accessor] = typeof defaultValue === 'function' ? defaultValue(_this4.config) : defaultValue;
        }

        if (!attributeAccessors[accessor]) {
          _window.console.warn("Failed to provide accesso function for ".concat(accessor || channel));
        }
      });
      return attributeAccessors;
    }
  }, {
    key: "getVisChannelScale",
    value: function getVisChannelScale(scale, domain, range, fixed) {
      return _defaultSettings.SCALE_FUNC[fixed ? 'linear' : scale]().domain(domain).range(fixed ? domain : range);
    }
  }, {
    key: "getPointsBounds",
    value: function getPointsBounds(allData) {
      var getPosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : identity;
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
    key: "getChangedTriggers",
    value: function getChangedTriggers(dataUpdateTriggers) {
      var triggerChanged = (0, _layerUpdate.diffUpdateTriggers)(dataUpdateTriggers, this._oldDataUpdateTriggers);
      this._oldDataUpdateTriggers = dataUpdateTriggers;
      return triggerChanged;
    }
  }, {
    key: "getEncodedChannelValue",
    value: function getEncodedChannelValue(scale, data, field) {
      var nullValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _defaultSettings.NO_VALUE_COLOR;
      var getValue = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : defaultGetFieldValue;
      var type = field.type;
      var value = getValue(field, data);

      if (!(0, _dataUtils.notNullorUndefined)(value)) {
        return nullValue;
      }

      var attributeValue;

      if (type === _defaultSettings.ALL_FIELD_TYPES.timestamp) {
        // shouldn't need to convert here
        // scale Function should take care of it
        attributeValue = scale(new Date(value));
      } else {
        attributeValue = scale(value);
      }

      if (!(0, _dataUtils.notNullorUndefined)(attributeValue)) {
        attributeValue = nullValue;
      }

      return attributeValue;
    }
  }, {
    key: "updateMeta",
    value: function updateMeta(meta) {
      this.meta = _objectSpread(_objectSpread({}, this.meta), meta);
    }
  }, {
    key: "getDataUpdateTriggers",
    value: function getDataUpdateTriggers(_ref8) {
      var filteredIndex = _ref8.filteredIndex,
          id = _ref8.id,
          allData = _ref8.allData;
      var columns = this.config.columns;
      return _objectSpread({
        getData: {
          datasetId: id,
          allData: allData,
          columns: columns,
          filteredIndex: filteredIndex
        },
        getMeta: {
          datasetId: id,
          allData: allData,
          columns: columns
        }
      }, (this.config.textLabel || []).reduce(function (accu, tl, i) {
        return _objectSpread(_objectSpread({}, accu), {}, (0, _defineProperty2["default"])({}, "getLabelCharacterSet-".concat(i), tl.field ? tl.field.name : null));
      }, {}));
    }
  }, {
    key: "updateData",
    value: function updateData(datasets, oldLayerData) {
      if (!this.config.dataId) {
        return {};
      }

      var layerDataset = datasets[this.config.dataId];
      var allData = datasets[this.config.dataId].allData;
      var getPosition = this.getPositionAccessor();
      var dataUpdateTriggers = this.getDataUpdateTriggers(layerDataset);
      var triggerChanged = this.getChangedTriggers(dataUpdateTriggers);

      if (triggerChanged.getMeta) {
        this.updateLayerMeta(allData, getPosition);
      }

      var data = [];

      if (!triggerChanged.getData && oldLayerData && oldLayerData.data) {
        // same data
        data = oldLayerData.data;
      } else {
        data = this.calculateDataAttribute(layerDataset, getPosition);
      }

      return {
        data: data,
        triggerChanged: triggerChanged
      };
    }
    /**
     * helper function to update one layer domain when state.data changed
     * if state.data change is due ot update filter, newFiler will be passed
     * called by updateAllLayerDomainData
     * @param {Object} datasets
     * @param {Object} newFilter
     * @returns {object} layer
     */

  }, {
    key: "updateLayerDomain",
    value: function updateLayerDomain(datasets, newFilter) {
      var _this5 = this;

      var table = this.getDataset(datasets);

      if (!table) {
        return this;
      }

      Object.values(this.visualChannels).forEach(function (channel) {
        var scale = channel.scale;
        var scaleType = _this5.config[scale]; // ordinal domain is based on allData, if only filter changed
        // no need to update ordinal domain

        if (!newFilter || scaleType !== _defaultSettings.SCALE_TYPES.ordinal) {
          var domain = channel.domain;

          var updatedDomain = _this5.calculateLayerDomain(table, channel);

          _this5.updateLayerConfig((0, _defineProperty2["default"])({}, domain, updatedDomain));
        }
      });
      return this;
    }
  }, {
    key: "getDataset",
    value: function getDataset(datasets) {
      return this.config.dataId ? datasets[this.config.dataId] : null;
    }
    /**
     * Validate visual channel field and scales based on supported field & scale type
     * @param channel
     */

  }, {
    key: "validateVisualChannel",
    value: function validateVisualChannel(channel) {
      this.validateFieldType(channel);
      this.validateScale(channel);
    }
    /**
     * Validate field type based on channelScaleType
     */

  }, {
    key: "validateFieldType",
    value: function validateFieldType(channel) {
      var visualChannel = this.visualChannels[channel];
      var field = visualChannel.field,
          channelScaleType = visualChannel.channelScaleType,
          supportedFieldTypes = visualChannel.supportedFieldTypes;

      if (this.config[field]) {
        // if field is selected, check if field type is supported
        var channelSupportedFieldTypes = supportedFieldTypes || _defaultSettings.CHANNEL_SCALE_SUPPORTED_FIELDS[channelScaleType];

        if (!channelSupportedFieldTypes.includes(this.config[field].type)) {
          // field type is not supported, set it back to null
          // set scale back to default
          this.updateLayerConfig((0, _defineProperty2["default"])({}, field, null));
        }
      }
    }
    /**
     * Validate scale type based on aggregation
     */

  }, {
    key: "validateScale",
    value: function validateScale(channel) {
      var visualChannel = this.visualChannels[channel];
      var scale = visualChannel.scale;

      if (!scale) {
        // visualChannel doesn't have scale
        return;
      }

      var scaleOptions = this.getScaleOptions(channel); // check if current selected scale is
      // supported, if not, change to default

      if (!scaleOptions.includes(this.config[scale])) {
        this.updateLayerConfig((0, _defineProperty2["default"])({}, scale, scaleOptions[0]));
      }
    }
    /**
     * Get scale options based on current field
     * @param {string} channel
     * @returns {string[]}
     */

  }, {
    key: "getScaleOptions",
    value: function getScaleOptions(channel) {
      var visualChannel = this.visualChannels[channel];
      var field = visualChannel.field,
          scale = visualChannel.scale,
          channelScaleType = visualChannel.channelScaleType;
      return this.config[field] ? _defaultSettings.FIELD_OPTS[this.config[field].type].scale[channelScaleType] : [this.getDefaultLayerConfig()[scale]];
    }
  }, {
    key: "updateLayerVisualChannel",
    value: function updateLayerVisualChannel(dataset, channel) {
      var visualChannel = this.visualChannels[channel];
      this.validateVisualChannel(channel); // calculate layer channel domain

      var updatedDomain = this.calculateLayerDomain(dataset, visualChannel);
      this.updateLayerConfig((0, _defineProperty2["default"])({}, visualChannel.domain, updatedDomain));
    }
  }, {
    key: "getVisualChannelUpdateTriggers",
    value: function getVisualChannelUpdateTriggers() {
      var _this6 = this;

      var updateTriggers = {};
      Object.values(this.visualChannels).forEach(function (visualChannel) {
        var _objectSpread11;

        // field range scale domain
        var accessor = visualChannel.accessor,
            field = visualChannel.field,
            scale = visualChannel.scale,
            domain = visualChannel.domain,
            range = visualChannel.range,
            defaultValue = visualChannel.defaultValue,
            fixed = visualChannel.fixed;
        updateTriggers[accessor] = _objectSpread((_objectSpread11 = {}, (0, _defineProperty2["default"])(_objectSpread11, field, _this6.config[field]), (0, _defineProperty2["default"])(_objectSpread11, scale, _this6.config[scale]), (0, _defineProperty2["default"])(_objectSpread11, domain, _this6.config[domain]), (0, _defineProperty2["default"])(_objectSpread11, range, _this6.config.visConfig[range]), (0, _defineProperty2["default"])(_objectSpread11, "defaultValue", typeof defaultValue === 'function' ? defaultValue(_this6.config) : defaultValue), _objectSpread11), fixed ? (0, _defineProperty2["default"])({}, fixed, _this6.config.visConfig[fixed]) : {});
      });
      return updateTriggers;
    }
  }, {
    key: "calculateLayerDomain",
    value: function calculateLayerDomain(dataset, visualChannel) {
      var scale = visualChannel.scale;
      var scaleType = this.config[scale];
      var field = this.config[visualChannel.field];

      if (!field) {
        // if colorField or sizeField were set back to null
        return defaultDomain;
      }

      return dataset.getColumnLayerDomain(field, scaleType) || defaultDomain;
    }
  }, {
    key: "hasHoveredObject",
    value: function hasHoveredObject(objectInfo) {
      return this.isLayerHovered(objectInfo) && objectInfo.object ? objectInfo.object : null;
    }
  }, {
    key: "isLayerHovered",
    value: function isLayerHovered(objectInfo) {
      var _objectInfo$layer, _objectInfo$layer$pro;

      return (objectInfo === null || objectInfo === void 0 ? void 0 : objectInfo.picked) && (objectInfo === null || objectInfo === void 0 ? void 0 : (_objectInfo$layer = objectInfo.layer) === null || _objectInfo$layer === void 0 ? void 0 : (_objectInfo$layer$pro = _objectInfo$layer.props) === null || _objectInfo$layer$pro === void 0 ? void 0 : _objectInfo$layer$pro.id) === this.id;
    }
  }, {
    key: "getRadiusScaleByZoom",
    value: function getRadiusScaleByZoom(mapState, fixedRadius) {
      var radiusChannel = Object.values(this.visualChannels).find(function (vc) {
        return vc.property === 'radius';
      });

      if (!radiusChannel) {
        return 1;
      }

      var field = radiusChannel.field;
      var fixed = fixedRadius === undefined ? this.config.visConfig.fixedRadius : fixedRadius;
      var radius = this.config.visConfig.radius; // @ts-ignore

      return fixed ? 1 : (this.config[field] ? 1 : radius) * this.getZoomFactor(mapState);
    }
  }, {
    key: "shouldCalculateLayerData",
    value: function shouldCalculateLayerData(props) {
      var _this7 = this;

      return props.some(function (p) {
        return !_this7.noneLayerDataAffectingProps.includes(p);
      });
    }
  }, {
    key: "getBrushingExtensionProps",
    value: function getBrushingExtensionProps(interactionConfig, brushingTarget) {
      var brush = interactionConfig.brush;
      return {
        // brushing
        autoHighlight: !brush.enabled,
        brushingRadius: brush.config.size * 1000,
        brushingTarget: brushingTarget || 'source',
        brushingEnabled: brush.enabled
      };
    }
  }, {
    key: "getDefaultDeckLayerProps",
    value: function getDefaultDeckLayerProps(_ref10) {
      var idx = _ref10.idx,
          gpuFilter = _ref10.gpuFilter,
          mapState = _ref10.mapState;
      return {
        id: this.id,
        idx: idx,
        coordinateSystem: _core.COORDINATE_SYSTEM.LNGLAT,
        pickable: true,
        wrapLongitude: true,
        parameters: {
          depthTest: Boolean(mapState.dragRotate || this.config.visConfig.enable3d)
        },
        hidden: this.config.hidden,
        // visconfig
        opacity: this.config.visConfig.opacity,
        highlightColor: this.config.highlightColor,
        // data filtering
        extensions: [dataFilterExtension],
        filterRange: gpuFilter ? gpuFilter.filterRange : undefined
      };
    }
  }, {
    key: "getDefaultHoverLayerProps",
    value: function getDefaultHoverLayerProps() {
      return {
        id: "".concat(this.id, "-hovered"),
        pickable: false,
        wrapLongitude: true,
        coordinateSystem: _core.COORDINATE_SYSTEM.LNGLAT
      };
    }
  }, {
    key: "renderTextLabelLayer",
    value: function renderTextLabelLayer(_ref11, renderOpts) {
      var _this8 = this;

      var getPosition = _ref11.getPosition,
          getPixelOffset = _ref11.getPixelOffset,
          updateTriggers = _ref11.updateTriggers,
          sharedProps = _ref11.sharedProps;
      var data = renderOpts.data,
          mapState = renderOpts.mapState;
      var textLabel = this.config.textLabel;
      return data.textLabels.reduce(function (accu, d, i) {
        if (d.getText) {
          var _textLabel$i$field, _textLabel$i$field2;

          accu.push(new _layers.TextLayer(_objectSpread(_objectSpread({}, sharedProps), {}, {
            id: "".concat(_this8.id, "-label-").concat((_textLabel$i$field = textLabel[i].field) === null || _textLabel$i$field === void 0 ? void 0 : _textLabel$i$field.name),
            data: data.data,
            getText: d.getText,
            getPosition: getPosition,
            characterSet: d.characterSet,
            getPixelOffset: getPixelOffset(textLabel[i]),
            getSize: 1,
            sizeScale: textLabel[i].size,
            getTextAnchor: textLabel[i].anchor,
            getAlignmentBaseline: textLabel[i].alignment,
            getColor: textLabel[i].color,
            parameters: {
              // text will always show on top of all layers
              depthTest: false
            },
            getFilterValue: data.getFilterValue,
            updateTriggers: _objectSpread(_objectSpread({}, updateTriggers), {}, {
              getText: (_textLabel$i$field2 = textLabel[i].field) === null || _textLabel$i$field2 === void 0 ? void 0 : _textLabel$i$field2.name,
              getPixelOffset: _objectSpread(_objectSpread({}, updateTriggers.getRadius), {}, {
                mapState: mapState,
                anchor: textLabel[i].anchor,
                alignment: textLabel[i].alignment
              }),
              getTextAnchor: textLabel[i].anchor,
              getAlignmentBaseline: textLabel[i].alignment,
              getColor: textLabel[i].color
            })
          })));
        }

        return accu;
      }, []);
    }
  }, {
    key: "calculateDataAttribute",
    value: function calculateDataAttribute(dataset, getPosition) {
      // implemented in subclasses
      return [];
    }
  }, {
    key: "updateLayerMeta",
    value: function updateLayerMeta(allData, getPosition) {// implemented in subclasses
    }
  }, {
    key: "getPositionAccessor",
    value: function getPositionAccessor() {
      // implemented in subclasses
      return function () {
        return null;
      };
    }
  }], [{
    key: "findDefaultLayerProps",
    value: function findDefaultLayerProps(dataset, foundLayers) {
      return {
        props: [],
        foundLayers: foundLayers
      };
    }
    /**
     * Given a array of preset required column names
     * found field that has the same name to set as layer column
     *
     * @param {object} defaultFields
     * @param {object[]} allFields
     * @returns {object[] | null} all possible required layer column pairs
     */

  }, {
    key: "findDefaultColumnField",
    value: function findDefaultColumnField(defaultFields, allFields) {
      // find all matched fields for each required col
      var requiredColumns = Object.keys(defaultFields).reduce(function (prev, key) {
        var requiredFields = allFields.filter(function (f) {
          return f.name === defaultFields[key] || defaultFields[key].includes(f.name);
        });
        prev[key] = requiredFields.length ? requiredFields.map(function (f) {
          return {
            value: f.name,
            fieldIdx: f.fieldIdx
          };
        }) : null;
        return prev;
      }, {});

      if (!Object.values(requiredColumns).every(Boolean)) {
        // if any field missing, return null
        return null;
      }

      return this.getAllPossibleColumnParis(requiredColumns);
    }
  }, {
    key: "getAllPossibleColumnParis",
    value: function getAllPossibleColumnParis(requiredColumns) {
      // for multiple matched field for one required column, return multiple
      // combinations, e. g. if column a has 2 matched, column b has 3 matched
      // 6 possible column pairs will be returned
      var allKeys = Object.keys(requiredColumns);
      var pointers = allKeys.map(function (k, i) {
        return i === allKeys.length - 1 ? -1 : 0;
      });
      var countPerKey = allKeys.map(function (k) {
        return requiredColumns[k].length;
      });
      var pairs = [];
      /* eslint-disable no-loop-func */

      while (incrementPointers(pointers, countPerKey, pointers.length - 1)) {
        var newPair = pointers.reduce(function (prev, cuur, i) {
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
  }, {
    key: "hexToRgb",
    value: function hexToRgb(c) {
      return (0, _colorUtils.hexToRgb)(c);
    }
  }]);
  return Layer;
}();

var _default = Layer;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvYmFzZS1sYXllci5qcyJdLCJuYW1lcyI6WyJnZW5lcmF0ZUNvbG9yIiwiTEFZRVJfSURfTEVOR1RIIiwiTUFYX1NBTVBMRV9TSVpFIiwiZGVmYXVsdERvbWFpbiIsImRhdGFGaWx0ZXJFeHRlbnNpb24iLCJEYXRhRmlsdGVyRXh0ZW5zaW9uIiwiZmlsdGVyU2l6ZSIsIk1BWF9HUFVfRklMVEVSUyIsImlkZW50aXR5IiwiZCIsImRlZmF1bHREYXRhQWNjZXNzb3IiLCJkYXRhIiwiT1ZFUkxBWV9UWVBFIiwiZGVja2dsIiwibWFwYm94Z2wiLCJsYXllckNvbG9ycyIsIk9iamVjdCIsInZhbHVlcyIsIkRhdGFWaXpDb2xvcnMiLCJtYXAiLCJoZXhUb1JnYiIsImluZGV4IiwibGVuZ3RoIiwiY29sb3JNYWtlciIsImRlZmF1bHRHZXRGaWVsZFZhbHVlIiwiZmllbGQiLCJ2YWx1ZUFjY2Vzc29yIiwiTGF5ZXIiLCJwcm9wcyIsImlkIiwibWV0YSIsInZpc0NvbmZpZ1NldHRpbmdzIiwiY29uZmlnIiwiZ2V0RGVmYXVsdExheWVyQ29uZmlnIiwiY29sdW1ucyIsImdldExheWVyQ29sdW1ucyIsIkRlZmF1bHRMYXllckljb24iLCJ0eXBlIiwiY29sb3IiLCJwcm9wZXJ0eSIsInNjYWxlIiwiZG9tYWluIiwicmFuZ2UiLCJrZXkiLCJjaGFubmVsU2NhbGVUeXBlIiwiQ0hBTk5FTF9TQ0FMRVMiLCJudWxsVmFsdWUiLCJOT19WQUxVRV9DT0xPUiIsImRlZmF1bHRWYWx1ZSIsInNpemUiLCJsYXQiLCJwYWlyIiwiZmllbGRQYWlyS2V5IiwibG5nIiwibGF0MCIsImxuZzAiLCJsYXQxIiwibG5nMSIsImRhdGFJZCIsImxhYmVsIiwiREVGQVVMVF9MQVlFUl9MQUJFTCIsIm5leHQiLCJ2YWx1ZSIsImlzVmlzaWJsZSIsImlzQ29uZmlnQWN0aXZlIiwiaGlnaGxpZ2h0Q29sb3IiLCJERUZBVUxUX0hJR0hMSUdIVF9DT0xPUiIsImhpZGRlbiIsImNvbG9yRmllbGQiLCJjb2xvckRvbWFpbiIsImNvbG9yU2NhbGUiLCJTQ0FMRV9UWVBFUyIsInF1YW50aWxlIiwic2l6ZURvbWFpbiIsInNpemVTY2FsZSIsImxpbmVhciIsInNpemVGaWVsZCIsInZpc0NvbmZpZyIsInRleHRMYWJlbCIsIkRFRkFVTFRfVEVYVF9MQUJFTCIsImNvbG9yVUkiLCJERUZBVUxUX0NPTE9SX1VJIiwiY29sb3JSYW5nZSIsImFuaW1hdGlvbiIsImVuYWJsZWQiLCJ2aXN1YWxDaGFubmVscyIsIm1lYXN1cmUiLCJkaXNwbGF5TmFtZSIsIm5hbWUiLCJkZWZhdWx0TWVhc3VyZSIsInVwZGF0ZSIsImZpZWxkSWR4IiwiY29sdW1uUGFpcnMiLCJwYXJ0bmVyS2V5IiwicGFydG5lckZpZWxkUGFpcktleSIsInpvb20iLCJ6b29tT2Zmc2V0IiwiTWF0aCIsInBvdyIsIm1heCIsImVuYWJsZUVsZXZhdGlvblpvb21GYWN0b3IiLCJkYXRhc2V0cyIsImZpbHRlcmVkSW5kZXgiLCJvYmplY3QiLCJjb25maWdUb0NvcHkiLCJzaGFsbG93Q29weSIsImNvbmNhdCIsInYiLCJub3RUb0NvcHkiLCJmb3JFYWNoIiwiZ3JvdXAiLCJwdXNoIiwiY3VycmVudENvbmZpZyIsImNvcGllZCIsImNvcHlMYXllckNvbmZpZyIsInVwZGF0ZUxheWVyQ29uZmlnIiwia2V5cyIsImNoYW5uZWwiLCJ2YWxpZGF0ZVZpc3VhbENoYW5uZWwiLCJpbmNsdWRlcyIsImxheWVyVmlzQ29uZmlncyIsIml0ZW0iLCJMQVlFUl9WSVNfQ09ORklHUyIsImV2ZXJ5IiwicCIsImhhc093blByb3BlcnR5IiwiY29sdW1uVmFsaWRhdG9ycyIsInJlcXVpcmVkIiwicmVxdWlyZWRMYXllckNvbHVtbnMiLCJyZWR1Y2UiLCJhY2N1IiwidmFsaWRhdG9yIiwib3B0aW9uYWwiLCJvcHRpb25hbENvbHVtbnMiLCJuZXdDb25maWciLCJuZXdWaXNDb25maWciLCJwcm9wIiwicHJldmlvdXMiLCJjb2xvclVJUHJvcCIsImVudHJpZXMiLCJpc0NvbG9yUmFuZ2UiLCJjb2xvcnMiLCJ1cGRhdGVDb2xvclVJQnlDb2xvclJhbmdlIiwidXBkYXRlQ29sb3JSYW5nZUJ5Q29sb3JVSSIsInVwZGF0ZUN1c3RvbVBhbGV0dGUiLCJjb2xvclJhbmdlQ29uZmlnIiwiY3VzdG9tIiwiY3VzdG9tUGFsZXR0ZSIsInNob3dEcm9wZG93biIsInN0ZXBzIiwicmV2ZXJzZWQiLCJCb29sZWFuIiwic2hvdWxkVXBkYXRlIiwic29tZSIsInNhbWVHcm91cCIsIkNPTE9SX1JBTkdFUyIsImZpbHRlciIsImNyIiwiZmluZCIsInVwZGF0ZUxheWVyVmlzQ29uZmlnIiwibGF5ZXJEYXRhIiwiaGFzQWxsQ29sdW1ucyIsImhhc0xheWVyRGF0YSIsInJlbmRlckxheWVyIiwiQXJyYXkiLCJpc0FycmF5IiwiY29sb3JNYXAiLCJjTWFwIiwiTWFwIiwiayIsInNldCIsIlNDQUxFX0ZVTkMiLCJvcmRpbmFsIiwidW5rbm93biIsImdldCIsIlVOS05PV05fQ09MT1JfS0VZIiwiZ2V0VmlzQ2hhbm5lbFNjYWxlIiwiZGF0YUFjY2Vzc29yIiwiYXR0cmlidXRlQWNjZXNzb3JzIiwiZml4ZWQiLCJhY2Nlc3NvciIsImdldEF0dHJpYnV0ZVZhbHVlIiwic2hvdWxkR2V0U2NhbGUiLCJhcmdzIiwiaXNGaXhlZCIsInNjYWxlRnVuY3Rpb24iLCJnZXRDb2xvclNjYWxlIiwiZ2V0RW5jb2RlZENoYW5uZWxWYWx1ZSIsIkNvbnNvbGUiLCJ3YXJuIiwiYWxsRGF0YSIsImdldFBvc2l0aW9uIiwic2FtcGxlRGF0YSIsInBvaW50cyIsImxhdEJvdW5kcyIsImxuZ0JvdW5kcyIsImRhdGFVcGRhdGVUcmlnZ2VycyIsInRyaWdnZXJDaGFuZ2VkIiwiX29sZERhdGFVcGRhdGVUcmlnZ2VycyIsImdldFZhbHVlIiwiYXR0cmlidXRlVmFsdWUiLCJBTExfRklFTERfVFlQRVMiLCJ0aW1lc3RhbXAiLCJEYXRlIiwiZ2V0RGF0YSIsImRhdGFzZXRJZCIsImdldE1ldGEiLCJ0bCIsImkiLCJvbGRMYXllckRhdGEiLCJsYXllckRhdGFzZXQiLCJnZXRQb3NpdGlvbkFjY2Vzc29yIiwiZ2V0RGF0YVVwZGF0ZVRyaWdnZXJzIiwiZ2V0Q2hhbmdlZFRyaWdnZXJzIiwidXBkYXRlTGF5ZXJNZXRhIiwiY2FsY3VsYXRlRGF0YUF0dHJpYnV0ZSIsIm5ld0ZpbHRlciIsInRhYmxlIiwiZ2V0RGF0YXNldCIsInNjYWxlVHlwZSIsInVwZGF0ZWREb21haW4iLCJjYWxjdWxhdGVMYXllckRvbWFpbiIsInZhbGlkYXRlRmllbGRUeXBlIiwidmFsaWRhdGVTY2FsZSIsInZpc3VhbENoYW5uZWwiLCJzdXBwb3J0ZWRGaWVsZFR5cGVzIiwiY2hhbm5lbFN1cHBvcnRlZEZpZWxkVHlwZXMiLCJDSEFOTkVMX1NDQUxFX1NVUFBPUlRFRF9GSUVMRFMiLCJzY2FsZU9wdGlvbnMiLCJnZXRTY2FsZU9wdGlvbnMiLCJGSUVMRF9PUFRTIiwiZGF0YXNldCIsInVwZGF0ZVRyaWdnZXJzIiwiZ2V0Q29sdW1uTGF5ZXJEb21haW4iLCJvYmplY3RJbmZvIiwiaXNMYXllckhvdmVyZWQiLCJwaWNrZWQiLCJsYXllciIsIm1hcFN0YXRlIiwiZml4ZWRSYWRpdXMiLCJyYWRpdXNDaGFubmVsIiwidmMiLCJ1bmRlZmluZWQiLCJyYWRpdXMiLCJnZXRab29tRmFjdG9yIiwibm9uZUxheWVyRGF0YUFmZmVjdGluZ1Byb3BzIiwiaW50ZXJhY3Rpb25Db25maWciLCJicnVzaGluZ1RhcmdldCIsImJydXNoIiwiYXV0b0hpZ2hsaWdodCIsImJydXNoaW5nUmFkaXVzIiwiYnJ1c2hpbmdFbmFibGVkIiwiaWR4IiwiZ3B1RmlsdGVyIiwiY29vcmRpbmF0ZVN5c3RlbSIsIkNPT1JESU5BVEVfU1lTVEVNIiwiTE5HTEFUIiwicGlja2FibGUiLCJ3cmFwTG9uZ2l0dWRlIiwicGFyYW1ldGVycyIsImRlcHRoVGVzdCIsImRyYWdSb3RhdGUiLCJlbmFibGUzZCIsIm9wYWNpdHkiLCJleHRlbnNpb25zIiwiZmlsdGVyUmFuZ2UiLCJyZW5kZXJPcHRzIiwiZ2V0UGl4ZWxPZmZzZXQiLCJzaGFyZWRQcm9wcyIsInRleHRMYWJlbHMiLCJnZXRUZXh0IiwiVGV4dExheWVyIiwiY2hhcmFjdGVyU2V0IiwiZ2V0U2l6ZSIsImdldFRleHRBbmNob3IiLCJhbmNob3IiLCJnZXRBbGlnbm1lbnRCYXNlbGluZSIsImFsaWdubWVudCIsImdldENvbG9yIiwiZ2V0RmlsdGVyVmFsdWUiLCJnZXRSYWRpdXMiLCJmb3VuZExheWVycyIsImRlZmF1bHRGaWVsZHMiLCJhbGxGaWVsZHMiLCJyZXF1aXJlZENvbHVtbnMiLCJwcmV2IiwicmVxdWlyZWRGaWVsZHMiLCJmIiwiZ2V0QWxsUG9zc2libGVDb2x1bW5QYXJpcyIsImFsbEtleXMiLCJwb2ludGVycyIsImNvdW50UGVyS2V5IiwicGFpcnMiLCJpbmNyZW1lbnRQb2ludGVycyIsIm5ld1BhaXIiLCJjdXVyIiwicHRzIiwiY291bnRzIiwiYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUVBOztBQVVBOztBQUNBOztBQUNBOztBQVNBOztBQUVBOztBQUVBOzs7Ozs7d0RBc0JVQSxhOztBQXBCVjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLElBQU1DLGVBQWUsR0FBRyxDQUF4Qjs7QUFFUCxJQUFNQyxlQUFlLEdBQUcsSUFBeEI7QUFDQSxJQUFNQyxhQUFhLEdBQUcsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUF0QjtBQUNBLElBQU1DLG1CQUFtQixHQUFHLElBQUlDLCtCQUFKLENBQXdCO0FBQUNDLEVBQUFBLFVBQVUsRUFBRUM7QUFBYixDQUF4QixDQUE1Qjs7QUFDQSxJQUFNQyxRQUFRLEdBQUcsU0FBWEEsUUFBVyxDQUFBQyxDQUFDO0FBQUEsU0FBSUEsQ0FBSjtBQUFBLENBQWxCOztBQUNBLElBQU1DLG1CQUFtQixHQUFHLFNBQXRCQSxtQkFBc0IsQ0FBQUQsQ0FBQztBQUFBLFNBQUlBLENBQUMsQ0FBQ0UsSUFBTjtB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SW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7Y29uc29sZSBhcyBDb25zb2xlfSBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCBrZXltaXJyb3IgZnJvbSAna2V5bWlycm9yJztcbmltcG9ydCB7RGF0YUZpbHRlckV4dGVuc2lvbn0gZnJvbSAnQGRlY2suZ2wvZXh0ZW5zaW9ucyc7XG5pbXBvcnQge0NPT1JESU5BVEVfU1lTVEVNfSBmcm9tICdAZGVjay5nbC9jb3JlJztcbmltcG9ydCB7VGV4dExheWVyfSBmcm9tICdAZGVjay5nbC9sYXllcnMnO1xuXG5pbXBvcnQgRGVmYXVsdExheWVySWNvbiBmcm9tICcuL2RlZmF1bHQtbGF5ZXItaWNvbic7XG5pbXBvcnQge2RpZmZVcGRhdGVUcmlnZ2Vyc30gZnJvbSAnLi9sYXllci11cGRhdGUnO1xuXG5pbXBvcnQge1xuICBBTExfRklFTERfVFlQRVMsXG4gIE5PX1ZBTFVFX0NPTE9SLFxuICBTQ0FMRV9UWVBFUyxcbiAgQ0hBTk5FTF9TQ0FMRVMsXG4gIEZJRUxEX09QVFMsXG4gIFNDQUxFX0ZVTkMsXG4gIENIQU5ORUxfU0NBTEVfU1VQUE9SVEVEX0ZJRUxEUyxcbiAgTUFYX0dQVV9GSUxURVJTXG59IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCB7Q09MT1JfUkFOR0VTfSBmcm9tICdjb25zdGFudHMvY29sb3ItcmFuZ2VzJztcbmltcG9ydCB7RGF0YVZpekNvbG9yc30gZnJvbSAnY29uc3RhbnRzL2N1c3RvbS1jb2xvci1yYW5nZXMnO1xuaW1wb3J0IHtcbiAgTEFZRVJfVklTX0NPTkZJR1MsXG4gIERFRkFVTFRfVEVYVF9MQUJFTCxcbiAgREVGQVVMVF9DT0xPUl9VSSxcbiAgVU5LTk9XTl9DT0xPUl9LRVksXG4gIERFRkFVTFRfSElHSExJR0hUX0NPTE9SLFxuICBERUZBVUxUX0xBWUVSX0xBQkVMXG59IGZyb20gJy4vbGF5ZXItZmFjdG9yeSc7XG5cbmltcG9ydCB7Z2VuZXJhdGVIYXNoSWQsIGlzUGxhaW5PYmplY3R9IGZyb20gJ3V0aWxzL3V0aWxzJztcblxuaW1wb3J0IHtnZXRTYW1wbGVEYXRhLCBnZXRMYXRMbmdCb3VuZHMsIG5vdE51bGxvclVuZGVmaW5lZH0gZnJvbSAndXRpbHMvZGF0YS11dGlscyc7XG5cbmltcG9ydCB7aGV4VG9SZ2IsIGdldENvbG9yR3JvdXBCeU5hbWUsIHJldmVyc2VDb2xvclJhbmdlfSBmcm9tICd1dGlscy9jb2xvci11dGlscyc7XG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuL2luZGV4JykuTGF5ZXJ9IExheWVyQ2xhc3N9ICovXG5cbi8qKlxuICogQXBwcm94LiBudW1iZXIgb2YgcG9pbnRzIHRvIHNhbXBsZSBpbiBhIGxhcmdlIGRhdGEgc2V0XG4gKiBAdHlwZSB7bnVtYmVyfVxuICovXG5leHBvcnQgY29uc3QgTEFZRVJfSURfTEVOR1RIID0gNjtcblxuY29uc3QgTUFYX1NBTVBMRV9TSVpFID0gNTAwMDtcbmNvbnN0IGRlZmF1bHREb21haW4gPSBbMCwgMV07XG5jb25zdCBkYXRhRmlsdGVyRXh0ZW5zaW9uID0gbmV3IERhdGFGaWx0ZXJFeHRlbnNpb24oe2ZpbHRlclNpemU6IE1BWF9HUFVfRklMVEVSU30pO1xuY29uc3QgaWRlbnRpdHkgPSBkID0+IGQ7XG5jb25zdCBkZWZhdWx0RGF0YUFjY2Vzc29yID0gZCA9PiBkLmRhdGE7XG5cbmV4cG9ydCBjb25zdCBPVkVSTEFZX1RZUEUgPSBrZXltaXJyb3Ioe1xuICBkZWNrZ2w6IG51bGwsXG4gIG1hcGJveGdsOiBudWxsXG59KTtcblxuZXhwb3J0IGNvbnN0IGxheWVyQ29sb3JzID0gT2JqZWN0LnZhbHVlcyhEYXRhVml6Q29sb3JzKS5tYXAoaGV4VG9SZ2IpO1xuZnVuY3Rpb24qIGdlbmVyYXRlQ29sb3IoKSB7XG4gIGxldCBpbmRleCA9IDA7XG4gIHdoaWxlIChpbmRleCA8IGxheWVyQ29sb3JzLmxlbmd0aCArIDEpIHtcbiAgICBpZiAoaW5kZXggPT09IGxheWVyQ29sb3JzLmxlbmd0aCkge1xuICAgICAgaW5kZXggPSAwO1xuICAgIH1cbiAgICB5aWVsZCBsYXllckNvbG9yc1tpbmRleCsrXTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgY29sb3JNYWtlciA9IGdlbmVyYXRlQ29sb3IoKTtcbmNvbnN0IGRlZmF1bHRHZXRGaWVsZFZhbHVlID0gKGZpZWxkLCBkKSA9PiBmaWVsZC52YWx1ZUFjY2Vzc29yKGQpO1xuXG4vKiogQHR5cGUge0xheWVyQ2xhc3N9ICovXG5jbGFzcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKHByb3BzID0ge30pIHtcbiAgICB0aGlzLmlkID0gcHJvcHMuaWQgfHwgZ2VuZXJhdGVIYXNoSWQoTEFZRVJfSURfTEVOR1RIKTtcblxuICAgIC8vIG1ldGFcbiAgICB0aGlzLm1ldGEgPSB7fTtcblxuICAgIC8vIHZpc0NvbmZpZ1NldHRpbmdzXG4gICAgdGhpcy52aXNDb25maWdTZXR0aW5ncyA9IHt9O1xuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5nZXREZWZhdWx0TGF5ZXJDb25maWcoe1xuICAgICAgY29sdW1uczogdGhpcy5nZXRMYXllckNvbHVtbnMoKSxcbiAgICAgIC4uLnByb3BzXG4gICAgfSk7XG4gIH1cblxuICBnZXQgbGF5ZXJJY29uKCkge1xuICAgIHJldHVybiBEZWZhdWx0TGF5ZXJJY29uO1xuICB9XG5cbiAgZ2V0IG92ZXJsYXlUeXBlKCkge1xuICAgIHJldHVybiBPVkVSTEFZX1RZUEUuZGVja2dsO1xuICB9XG5cbiAgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBnZXQgbmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy50eXBlO1xuICB9XG5cbiAgZ2V0IGlzQWdncmVnYXRlZCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXQgcmVxdWlyZWRMYXllckNvbHVtbnMoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgZ2V0IG9wdGlvbmFsQ29sdW1ucygpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBnZXQgbm9uZUxheWVyRGF0YUFmZmVjdGluZ1Byb3BzKCkge1xuICAgIHJldHVybiBbJ2xhYmVsJywgJ29wYWNpdHknLCAndGhpY2tuZXNzJywgJ2lzVmlzaWJsZScsICdoaWRkZW4nXTtcbiAgfVxuXG4gIGdldCB2aXN1YWxDaGFubmVscygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29sb3I6IHtcbiAgICAgICAgcHJvcGVydHk6ICdjb2xvcicsXG4gICAgICAgIGZpZWxkOiAnY29sb3JGaWVsZCcsXG4gICAgICAgIHNjYWxlOiAnY29sb3JTY2FsZScsXG4gICAgICAgIGRvbWFpbjogJ2NvbG9yRG9tYWluJyxcbiAgICAgICAgcmFuZ2U6ICdjb2xvclJhbmdlJyxcbiAgICAgICAga2V5OiAnY29sb3InLFxuICAgICAgICBjaGFubmVsU2NhbGVUeXBlOiBDSEFOTkVMX1NDQUxFUy5jb2xvcixcbiAgICAgICAgbnVsbFZhbHVlOiBOT19WQUxVRV9DT0xPUixcbiAgICAgICAgZGVmYXVsdFZhbHVlOiBjb25maWcgPT4gY29uZmlnLmNvbG9yXG4gICAgICB9LFxuICAgICAgc2l6ZToge1xuICAgICAgICBwcm9wZXJ0eTogJ3NpemUnLFxuICAgICAgICBmaWVsZDogJ3NpemVGaWVsZCcsXG4gICAgICAgIHNjYWxlOiAnc2l6ZVNjYWxlJyxcbiAgICAgICAgZG9tYWluOiAnc2l6ZURvbWFpbicsXG4gICAgICAgIHJhbmdlOiAnc2l6ZVJhbmdlJyxcbiAgICAgICAga2V5OiAnc2l6ZScsXG4gICAgICAgIGNoYW5uZWxTY2FsZVR5cGU6IENIQU5ORUxfU0NBTEVTLnNpemUsXG4gICAgICAgIG51bGxWYWx1ZTogMCxcbiAgICAgICAgZGVmYXVsdFZhbHVlOiAxXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qXG4gICAqIENvbHVtbiBwYWlycyBtYXBzIGxheWVyIGNvbHVtbiB0byBhIHNwZWNpZmljIGZpZWxkIHBhaXJzLFxuICAgKiBCeSBkZWZhdWx0LCBpdCBpcyBzZXQgdG8gbnVsbFxuICAgKi9cbiAgZ2V0IGNvbHVtblBhaXJzKCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLypcbiAgICogRGVmYXVsdCBwb2ludCBjb2x1bW4gcGFpcnMsIGNhbiBiZSB1c2VkIGZvciBwb2ludCBiYXNlZCBsYXllcnM6IHBvaW50LCBpY29uIGV0Yy5cbiAgICovXG4gIGdldCBkZWZhdWx0UG9pbnRDb2x1bW5QYWlycygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGF0OiB7cGFpcjogJ2xuZycsIGZpZWxkUGFpcktleTogJ2xhdCd9LFxuICAgICAgbG5nOiB7cGFpcjogJ2xhdCcsIGZpZWxkUGFpcktleTogJ2xuZyd9XG4gICAgfTtcbiAgfVxuXG4gIC8qXG4gICAqIERlZmF1bHQgbGluayBjb2x1bW4gcGFpcnMsIGNhbiBiZSB1c2VkIGZvciBsaW5rIGJhc2VkIGxheWVyczogYXJjLCBsaW5lIGV0Y1xuICAgKi9cbiAgZ2V0IGRlZmF1bHRMaW5rQ29sdW1uUGFpcnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhdDA6IHtwYWlyOiAnbG5nMCcsIGZpZWxkUGFpcktleTogJ2xhdCd9LFxuICAgICAgbG5nMDoge3BhaXI6ICdsYXQwJywgZmllbGRQYWlyS2V5OiAnbG5nJ30sXG4gICAgICBsYXQxOiB7cGFpcjogJ2xuZzEnLCBmaWVsZFBhaXJLZXk6ICdsYXQnfSxcbiAgICAgIGxuZzE6IHtwYWlyOiAnbGF0MScsIGZpZWxkUGFpcktleTogJ2xuZyd9XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSBSZWFjdCBjb21wb25lbnQgZm9yIHRvIHJlbmRlciBsYXllciBpbnN0cnVjdGlvbnMgaW4gYSBtb2RhbFxuICAgKiBAcmV0dXJucyB7b2JqZWN0fSAtIGFuIG9iamVjdFxuICAgKiBAZXhhbXBsZVxuICAgKiAgcmV0dXJuIHtcbiAgICogICAgaWQ6ICdpY29uSW5mbycsXG4gICAqICAgIHRlbXBsYXRlOiBJY29uSW5mb01vZGFsLFxuICAgKiAgICBtb2RhbFByb3BzOiB7XG4gICAqICAgICAgdGl0bGU6ICdIb3cgdG8gZHJhdyBpY29ucydcbiAgICogICB9O1xuICAgKiB9XG4gICAqL1xuICBnZXQgbGF5ZXJJbmZvTW9kYWwoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgLypcbiAgICogR2l2ZW4gYSBkYXRhc2V0LCBhdXRvbWF0aWNhbGx5IGZpbmQgcHJvcHMgdG8gY3JlYXRlIGxheWVyIGJhc2VkIG9uIGl0XG4gICAqIGFuZCByZXR1cm4gdGhlIHByb3BzIGFuZCBwcmV2aW91cyBmb3VuZCBsYXllcnMuXG4gICAqIEJ5IGRlZmF1bHQsIG5vIGxheWVycyB3aWxsIGJlIGZvdW5kXG4gICAqL1xuICBzdGF0aWMgZmluZERlZmF1bHRMYXllclByb3BzKGRhdGFzZXQsIGZvdW5kTGF5ZXJzKSB7XG4gICAgcmV0dXJuIHtwcm9wczogW10sIGZvdW5kTGF5ZXJzfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlbiBhIGFycmF5IG9mIHByZXNldCByZXF1aXJlZCBjb2x1bW4gbmFtZXNcbiAgICogZm91bmQgZmllbGQgdGhhdCBoYXMgdGhlIHNhbWUgbmFtZSB0byBzZXQgYXMgbGF5ZXIgY29sdW1uXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBkZWZhdWx0RmllbGRzXG4gICAqIEBwYXJhbSB7b2JqZWN0W119IGFsbEZpZWxkc1xuICAgKiBAcmV0dXJucyB7b2JqZWN0W10gfCBudWxsfSBhbGwgcG9zc2libGUgcmVxdWlyZWQgbGF5ZXIgY29sdW1uIHBhaXJzXG4gICAqL1xuICBzdGF0aWMgZmluZERlZmF1bHRDb2x1bW5GaWVsZChkZWZhdWx0RmllbGRzLCBhbGxGaWVsZHMpIHtcbiAgICAvLyBmaW5kIGFsbCBtYXRjaGVkIGZpZWxkcyBmb3IgZWFjaCByZXF1aXJlZCBjb2xcbiAgICBjb25zdCByZXF1aXJlZENvbHVtbnMgPSBPYmplY3Qua2V5cyhkZWZhdWx0RmllbGRzKS5yZWR1Y2UoKHByZXYsIGtleSkgPT4ge1xuICAgICAgY29uc3QgcmVxdWlyZWRGaWVsZHMgPSBhbGxGaWVsZHMuZmlsdGVyKFxuICAgICAgICBmID0+IGYubmFtZSA9PT0gZGVmYXVsdEZpZWxkc1trZXldIHx8IGRlZmF1bHRGaWVsZHNba2V5XS5pbmNsdWRlcyhmLm5hbWUpXG4gICAgICApO1xuXG4gICAgICBwcmV2W2tleV0gPSByZXF1aXJlZEZpZWxkcy5sZW5ndGhcbiAgICAgICAgPyByZXF1aXJlZEZpZWxkcy5tYXAoZiA9PiAoe1xuICAgICAgICAgICAgdmFsdWU6IGYubmFtZSxcbiAgICAgICAgICAgIGZpZWxkSWR4OiBmLmZpZWxkSWR4XG4gICAgICAgICAgfSkpXG4gICAgICAgIDogbnVsbDtcbiAgICAgIHJldHVybiBwcmV2O1xuICAgIH0sIHt9KTtcblxuICAgIGlmICghT2JqZWN0LnZhbHVlcyhyZXF1aXJlZENvbHVtbnMpLmV2ZXJ5KEJvb2xlYW4pKSB7XG4gICAgICAvLyBpZiBhbnkgZmllbGQgbWlzc2luZywgcmV0dXJuIG51bGxcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmdldEFsbFBvc3NpYmxlQ29sdW1uUGFyaXMocmVxdWlyZWRDb2x1bW5zKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRBbGxQb3NzaWJsZUNvbHVtblBhcmlzKHJlcXVpcmVkQ29sdW1ucykge1xuICAgIC8vIGZvciBtdWx0aXBsZSBtYXRjaGVkIGZpZWxkIGZvciBvbmUgcmVxdWlyZWQgY29sdW1uLCByZXR1cm4gbXVsdGlwbGVcbiAgICAvLyBjb21iaW5hdGlvbnMsIGUuIGcuIGlmIGNvbHVtbiBhIGhhcyAyIG1hdGNoZWQsIGNvbHVtbiBiIGhhcyAzIG1hdGNoZWRcbiAgICAvLyA2IHBvc3NpYmxlIGNvbHVtbiBwYWlycyB3aWxsIGJlIHJldHVybmVkXG4gICAgY29uc3QgYWxsS2V5cyA9IE9iamVjdC5rZXlzKHJlcXVpcmVkQ29sdW1ucyk7XG4gICAgY29uc3QgcG9pbnRlcnMgPSBhbGxLZXlzLm1hcCgoaywgaSkgPT4gKChpID09PSBhbGxLZXlzLmxlbmd0aCAtIDEgPyAtMSA6IDApKSk7XG4gICAgY29uc3QgY291bnRQZXJLZXkgPSBhbGxLZXlzLm1hcChrID0+IHJlcXVpcmVkQ29sdW1uc1trXS5sZW5ndGgpO1xuICAgIGNvbnN0IHBhaXJzID0gW107XG5cbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1sb29wLWZ1bmMgKi9cbiAgICB3aGlsZSAoaW5jcmVtZW50UG9pbnRlcnMocG9pbnRlcnMsIGNvdW50UGVyS2V5LCBwb2ludGVycy5sZW5ndGggLSAxKSkge1xuICAgICAgY29uc3QgbmV3UGFpciA9IHBvaW50ZXJzLnJlZHVjZSgocHJldiwgY3V1ciwgaSkgPT4ge1xuICAgICAgICBwcmV2W2FsbEtleXNbaV1dID0gcmVxdWlyZWRDb2x1bW5zW2FsbEtleXNbaV1dW2N1dXJdO1xuICAgICAgICByZXR1cm4gcHJldjtcbiAgICAgIH0sIHt9KTtcblxuICAgICAgcGFpcnMucHVzaChuZXdQYWlyKTtcbiAgICB9XG4gICAgLyogZXNsaW50LWVuYWJsZSBuby1sb29wLWZ1bmMgKi9cblxuICAgIC8vIHJlY3Vyc2l2ZWx5IGluY3JlbWVudCBwb2ludGVyc1xuICAgIGZ1bmN0aW9uIGluY3JlbWVudFBvaW50ZXJzKHB0cywgY291bnRzLCBpbmRleCkge1xuICAgICAgaWYgKGluZGV4ID09PSAwICYmIHB0c1swXSA9PT0gY291bnRzWzBdIC0gMSkge1xuICAgICAgICAvLyBub3RoaW5nIHRvIGluY3JlbWVudFxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmIChwdHNbaW5kZXhdICsgMSA8IGNvdW50c1tpbmRleF0pIHtcbiAgICAgICAgcHRzW2luZGV4XSA9IHB0c1tpbmRleF0gKyAxO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgcHRzW2luZGV4XSA9IDA7XG4gICAgICByZXR1cm4gaW5jcmVtZW50UG9pbnRlcnMocHRzLCBjb3VudHMsIGluZGV4IC0gMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhaXJzO1xuICB9XG5cbiAgc3RhdGljIGhleFRvUmdiKGMpIHtcbiAgICByZXR1cm4gaGV4VG9SZ2IoYyk7XG4gIH1cblxuICBnZXREZWZhdWx0TGF5ZXJDb25maWcocHJvcHMgPSB7fSkge1xuICAgIHJldHVybiB7XG4gICAgICBkYXRhSWQ6IHByb3BzLmRhdGFJZCB8fCBudWxsLFxuICAgICAgbGFiZWw6IHByb3BzLmxhYmVsIHx8IERFRkFVTFRfTEFZRVJfTEFCRUwsXG4gICAgICBjb2xvcjogcHJvcHMuY29sb3IgfHwgY29sb3JNYWtlci5uZXh0KCkudmFsdWUsXG4gICAgICBjb2x1bW5zOiBwcm9wcy5jb2x1bW5zIHx8IG51bGwsXG4gICAgICBpc1Zpc2libGU6IHByb3BzLmlzVmlzaWJsZSB8fCBmYWxzZSxcbiAgICAgIGlzQ29uZmlnQWN0aXZlOiBwcm9wcy5pc0NvbmZpZ0FjdGl2ZSB8fCBmYWxzZSxcbiAgICAgIGhpZ2hsaWdodENvbG9yOiBwcm9wcy5oaWdobGlnaHRDb2xvciB8fCBERUZBVUxUX0hJR0hMSUdIVF9DT0xPUixcbiAgICAgIGhpZGRlbjogcHJvcHMuaGlkZGVuIHx8IGZhbHNlLFxuXG4gICAgICAvLyBUT0RPOiByZWZhY3RvciB0aGlzIGludG8gc2VwYXJhdGUgdmlzdWFsIENoYW5uZWwgY29uZmlnXG4gICAgICAvLyBjb2xvciBieSBmaWVsZCwgZG9tYWluIGlzIHNldCBieSBmaWx0ZXJzLCBmaWVsZCwgc2NhbGUgdHlwZVxuICAgICAgY29sb3JGaWVsZDogbnVsbCxcbiAgICAgIGNvbG9yRG9tYWluOiBbMCwgMV0sXG4gICAgICBjb2xvclNjYWxlOiBTQ0FMRV9UWVBFUy5xdWFudGlsZSxcblxuICAgICAgLy8gY29sb3IgYnkgc2l6ZSwgZG9tYWluIGlzIHNldCBieSBmaWx0ZXJzLCBmaWVsZCwgc2NhbGUgdHlwZVxuICAgICAgc2l6ZURvbWFpbjogWzAsIDFdLFxuICAgICAgc2l6ZVNjYWxlOiBTQ0FMRV9UWVBFUy5saW5lYXIsXG4gICAgICBzaXplRmllbGQ6IG51bGwsXG5cbiAgICAgIHZpc0NvbmZpZzoge30sXG5cbiAgICAgIHRleHRMYWJlbDogW0RFRkFVTFRfVEVYVF9MQUJFTF0sXG5cbiAgICAgIGNvbG9yVUk6IHtcbiAgICAgICAgY29sb3I6IERFRkFVTFRfQ09MT1JfVUksXG4gICAgICAgIGNvbG9yUmFuZ2U6IERFRkFVTFRfQ09MT1JfVUlcbiAgICAgIH0sXG4gICAgICBhbmltYXRpb246IHtlbmFibGVkOiBmYWxzZX1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgZGVzY3JpcHRpb24gb2YgYSB2aXN1YWxDaGFubmVsIGNvbmZpZ1xuICAgKiBAcGFyYW0ga2V5XG4gICAqIEByZXR1cm5zIHt7bGFiZWw6IHN0cmluZywgbWVhc3VyZTogKHN0cmluZ3xzdHJpbmcpfX1cbiAgICovXG4gIGdldFZpc3VhbENoYW5uZWxEZXNjcmlwdGlvbihrZXkpIHtcbiAgICAvLyBlLmcuIGxhYmVsOiBDb2xvciwgbWVhc3VyZTogVmVoaWNsZSBUeXBlXG4gICAgcmV0dXJuIHtcbiAgICAgIGxhYmVsOiB0aGlzLnZpc0NvbmZpZ1NldHRpbmdzW3RoaXMudmlzdWFsQ2hhbm5lbHNba2V5XS5yYW5nZV0ubGFiZWwsXG4gICAgICBtZWFzdXJlOiB0aGlzLmNvbmZpZ1t0aGlzLnZpc3VhbENoYW5uZWxzW2tleV0uZmllbGRdXG4gICAgICAgID8gKHRoaXMuY29uZmlnW3RoaXMudmlzdWFsQ2hhbm5lbHNba2V5XS5maWVsZF0uZGlzcGxheU5hbWUgfHxcbiAgICAgICAgICB0aGlzLmNvbmZpZ1t0aGlzLnZpc3VhbENoYW5uZWxzW2tleV0uZmllbGRdLm5hbWUpXG4gICAgICAgIDogdGhpcy52aXN1YWxDaGFubmVsc1trZXldLmRlZmF1bHRNZWFzdXJlXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NpZ24gYSBmaWVsZCB0byBsYXllciBjb2x1bW4sIHJldHVybiBjb2x1bW4gY29uZmlnXG4gICAqIEBwYXJhbSBrZXkgLSBDb2x1bW4gS2V5XG4gICAqIEBwYXJhbSBmaWVsZCAtIFNlbGVjdGVkIGZpZWxkXG4gICAqIEByZXR1cm5zIHt7fX0gLSBDb2x1bW4gY29uZmlnXG4gICAqL1xuICBhc3NpZ25Db2x1bW4oa2V5LCBmaWVsZCkge1xuICAgIC8vIGZpZWxkIHZhbHVlIGNvdWxkIGJlIG51bGwgZm9yIG9wdGlvbmFsIGNvbHVtbnNcbiAgICBjb25zdCB1cGRhdGUgPSBmaWVsZFxuICAgICAgPyB7XG4gICAgICAgICAgdmFsdWU6IGZpZWxkLm5hbWUsXG4gICAgICAgICAgZmllbGRJZHg6IGZpZWxkLmZpZWxkSWR4XG4gICAgICAgIH1cbiAgICAgIDoge3ZhbHVlOiBudWxsLCBmaWVsZElkeDogLTF9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnRoaXMuY29uZmlnLmNvbHVtbnMsXG4gICAgICBba2V5XToge1xuICAgICAgICAuLi50aGlzLmNvbmZpZy5jb2x1bW5zW2tleV0sXG4gICAgICAgIC4uLnVwZGF0ZVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQXNzaWduIGEgZmllbGQgcGFpciB0byBjb2x1bW4gY29uZmlnLCByZXR1cm4gY29sdW1uIGNvbmZpZ1xuICAgKiBAcGFyYW0ga2V5IC0gQ29sdW1uIEtleVxuICAgKiBAcGFyYW0gcGFpciAtIGZpZWxkIFBhaXJcbiAgICogQHJldHVybnMge29iamVjdH0gLSBDb2x1bW4gY29uZmlnXG4gICAqL1xuICBhc3NpZ25Db2x1bW5QYWlycyhrZXksIHBhaXIpIHtcbiAgICBpZiAoIXRoaXMuY29sdW1uUGFpcnMgfHwgIXRoaXMuY29sdW1uUGFpcnM/LltrZXldKSB7XG4gICAgICAvLyBzaG91bGQgbm90IGVuZCBpbiB0aGlzIHN0YXRlXG4gICAgICByZXR1cm4gdGhpcy5jb25maWcuY29sdW1ucztcbiAgICB9XG5cbiAgICBjb25zdCB7cGFpcjogcGFydG5lcktleSwgZmllbGRQYWlyS2V5fSA9IHRoaXMuY29sdW1uUGFpcnM/LltrZXldO1xuICAgIGNvbnN0IHtmaWVsZFBhaXJLZXk6IHBhcnRuZXJGaWVsZFBhaXJLZXl9ID0gdGhpcy5jb2x1bW5QYWlycz8uW3BhcnRuZXJLZXldO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnRoaXMuY29uZmlnLmNvbHVtbnMsXG4gICAgICBba2V5XTogcGFpcltmaWVsZFBhaXJLZXldLFxuICAgICAgW3BhcnRuZXJLZXldOiBwYWlyW3BhcnRuZXJGaWVsZFBhaXJLZXldXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGUgYSByYWRpdXMgem9vbSBtdWx0aXBsaWVyIHRvIHJlbmRlciBwb2ludHMsIHNvIHRoZXkgYXJlIHZpc2libGUgaW4gYWxsIHpvb20gbGV2ZWxcbiAgICogQHBhcmFtIHtvYmplY3R9IG1hcFN0YXRlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBtYXBTdGF0ZS56b29tIC0gYWN0dWFsIHpvb21cbiAgICogQHBhcmFtIHtudW1iZXIgfCB2b2lkfSBtYXBTdGF0ZS56b29tT2Zmc2V0IC0gem9vbU9mZnNldCB3aGVuIHJlbmRlciBpbiB0aGUgcGxvdCBjb250YWluZXIgZm9yIGV4cG9ydCBpbWFnZVxuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgKi9cbiAgZ2V0Wm9vbUZhY3Rvcih7em9vbSwgem9vbU9mZnNldCA9IDB9KSB7XG4gICAgcmV0dXJuIE1hdGgucG93KDIsIE1hdGgubWF4KDE0IC0gem9vbSArIHpvb21PZmZzZXQsIDApKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGUgYSBlbGV2YXRpb24gem9vbSBtdWx0aXBsaWVyIHRvIHJlbmRlciBwb2ludHMsIHNvIHRoZXkgYXJlIHZpc2libGUgaW4gYWxsIHpvb20gbGV2ZWxcbiAgICogQHBhcmFtIHtvYmplY3R9IG1hcFN0YXRlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBtYXBTdGF0ZS56b29tIC0gYWN0dWFsIHpvb21cbiAgICogQHBhcmFtIHtudW1iZXIgfCB2b2lkfSBtYXBTdGF0ZS56b29tT2Zmc2V0IC0gem9vbU9mZnNldCB3aGVuIHJlbmRlciBpbiB0aGUgcGxvdCBjb250YWluZXIgZm9yIGV4cG9ydCBpbWFnZVxuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgKi9cbiAgZ2V0RWxldmF0aW9uWm9vbUZhY3Rvcih7em9vbSwgem9vbU9mZnNldCA9IDB9KSB7XG4gICAgcmV0dXJuIHRoaXMuY29uZmlnLnZpc0NvbmZpZy5lbmFibGVFbGV2YXRpb25ab29tRmFjdG9yXG4gICAgICA/IE1hdGgucG93KDIsIE1hdGgubWF4KDggLSB6b29tICsgem9vbU9mZnNldCwgMCkpXG4gICAgICA6IDE7XG4gIH1cblxuICBmb3JtYXRMYXllckRhdGEoZGF0YXNldHMsIGZpbHRlcmVkSW5kZXgpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICByZW5kZXJMYXllcigpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBnZXRIb3ZlckRhdGEob2JqZWN0KSB7XG4gICAgaWYgKCFvYmplY3QpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICAvLyBieSBkZWZhdWx0LCBlYWNoIGVudHJ5IG9mIGxheWVyRGF0YSBzaG91bGQgaGF2ZSBhIGRhdGEgcHJvcGVydHkgcG9pbnRzXG4gICAgLy8gdG8gdGhlIG9yaWdpbmFsIGl0ZW0gaW4gdGhlIGFsbERhdGEgYXJyYXlcbiAgICAvLyBlYWNoIGxheWVyIGNhbiBpbXBsZW1lbnQgaXRzIG93biBnZXRIb3ZlckRhdGEgbWV0aG9kXG4gICAgcmV0dXJuIG9iamVjdC5kYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZW4gY2hhbmdlIGxheWVyIHR5cGUsIHRyeSB0byBjb3B5IG92ZXIgbGF5ZXIgY29uZmlncyBhcyBtdWNoIGFzIHBvc3NpYmxlXG4gICAqIEBwYXJhbSBjb25maWdUb0NvcHkgLSBjb25maWcgdG8gY29weSBvdmVyXG4gICAqIEBwYXJhbSB2aXNDb25maWdTZXR0aW5ncyAtIHZpc0NvbmZpZyBzZXR0aW5ncyBvZiBjb25maWcgdG8gY29weVxuICAgKi9cbiAgYXNzaWduQ29uZmlnVG9MYXllcihjb25maWdUb0NvcHksIHZpc0NvbmZpZ1NldHRpbmdzKSB7XG4gICAgLy8gZG9uJ3QgZGVlcCBtZXJnZSB2aXN1YWxDaGFubmVsIGZpZWxkXG4gICAgLy8gZG9uJ3QgZGVlcCBtZXJnZSBjb2xvciByYW5nZSwgcmV2ZXJzZWQ6IGlzIG5vdCBhIGtleSBieSBkZWZhdWx0XG4gICAgY29uc3Qgc2hhbGxvd0NvcHkgPSBbJ2NvbG9yUmFuZ2UnLCAnc3Ryb2tlQ29sb3JSYW5nZSddLmNvbmNhdChcbiAgICAgIE9iamVjdC52YWx1ZXModGhpcy52aXN1YWxDaGFubmVscykubWFwKHYgPT4gdi5maWVsZClcbiAgICApO1xuXG4gICAgLy8gZG9uJ3QgY29weSBvdmVyIGRvbWFpbiBhbmQgYW5pbWF0aW9uXG4gICAgY29uc3Qgbm90VG9Db3B5ID0gWydhbmltYXRpb24nXS5jb25jYXQoT2JqZWN0LnZhbHVlcyh0aGlzLnZpc3VhbENoYW5uZWxzKS5tYXAodiA9PiB2LmRvbWFpbikpO1xuICAgIC8vIGlmIHJhbmdlIGlzIGZvciB0aGUgc2FtZSBwcm9wZXJ0eSBncm91cCBjb3B5IGl0LCBvdGhlcndpc2UsIG5vdCB0byBjb3B5XG4gICAgT2JqZWN0LnZhbHVlcyh0aGlzLnZpc3VhbENoYW5uZWxzKS5mb3JFYWNoKHYgPT4ge1xuICAgICAgaWYgKFxuICAgICAgICBjb25maWdUb0NvcHkudmlzQ29uZmlnW3YucmFuZ2VdICYmXG4gICAgICAgIHRoaXMudmlzQ29uZmlnU2V0dGluZ3Nbdi5yYW5nZV0gJiZcbiAgICAgICAgdmlzQ29uZmlnU2V0dGluZ3Nbdi5yYW5nZV0uZ3JvdXAgIT09IHRoaXMudmlzQ29uZmlnU2V0dGluZ3Nbdi5yYW5nZV0uZ3JvdXBcbiAgICAgICkge1xuICAgICAgICBub3RUb0NvcHkucHVzaCh2LnJhbmdlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIGRvbid0IGNvcHkgb3ZlciB2aXN1YWxDaGFubmVsIHJhbmdlXG4gICAgY29uc3QgY3VycmVudENvbmZpZyA9IHRoaXMuY29uZmlnO1xuICAgIGNvbnN0IGNvcGllZCA9IHRoaXMuY29weUxheWVyQ29uZmlnKGN1cnJlbnRDb25maWcsIGNvbmZpZ1RvQ29weSwge1xuICAgICAgc2hhbGxvd0NvcHksXG4gICAgICBub3RUb0NvcHlcbiAgICB9KTtcblxuICAgIHRoaXMudXBkYXRlTGF5ZXJDb25maWcoY29waWVkKTtcbiAgICAvLyB2YWxpZGF0ZSB2aXN1YWxDaGFubmVsIGZpZWxkIHR5cGUgYW5kIHNjYWxlIHR5cGVzXG4gICAgT2JqZWN0LmtleXModGhpcy52aXN1YWxDaGFubmVscykuZm9yRWFjaChjaGFubmVsID0+IHtcbiAgICAgIHRoaXMudmFsaWRhdGVWaXN1YWxDaGFubmVsKGNoYW5uZWwpO1xuICAgIH0pO1xuICB9XG5cbiAgLypcbiAgICogUmVjdXJzaXZlbHkgY29weSBjb25maWcgb3ZlciB0byBhbiBlbXB0eSBsYXllclxuICAgKiB3aGVuIHJlY2VpdmVkIHNhdmVkIGNvbmZpZywgb3IgY29weSBjb25maWcgb3ZlciBmcm9tIGEgZGlmZmVyZW50IGxheWVyIHR5cGVcbiAgICogbWFrZSBzdXJlIHRvIG9ubHkgY29weSBvdmVyIHZhbHVlIHRvIGV4aXN0aW5nIGtleXNcbiAgICogQHBhcmFtIHtvYmplY3R9IGN1cnJlbnRDb25maWcgLSBleGlzdGluZyBjb25maWcgdG8gYmUgb3ZlcnJpZGVcbiAgICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZ1RvQ29weSAtIG5ldyBDb25maWcgdG8gY29weSBvdmVyXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IHNoYWxsb3dDb3B5IC0gYXJyYXkgb2YgcHJvcGVydGllcyB0byBub3QgdG8gYmUgZGVlcCBjb3BpZWRcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gbm90VG9Db3B5IC0gYXJyYXkgb2YgcHJvcGVydGllcyBub3QgdG8gY29weVxuICAgKiBAcmV0dXJucyB7b2JqZWN0fSAtIGNvcGllZCBjb25maWdcbiAgICovXG4gIGNvcHlMYXllckNvbmZpZyhjdXJyZW50Q29uZmlnLCBjb25maWdUb0NvcHksIHtzaGFsbG93Q29weSA9IFtdLCBub3RUb0NvcHkgPSBbXX0gPSB7fSkge1xuICAgIGNvbnN0IGNvcGllZCA9IHt9O1xuICAgIE9iamVjdC5rZXlzKGN1cnJlbnRDb25maWcpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGlmIChcbiAgICAgICAgaXNQbGFpbk9iamVjdChjdXJyZW50Q29uZmlnW2tleV0pICYmXG4gICAgICAgIGlzUGxhaW5PYmplY3QoY29uZmlnVG9Db3B5W2tleV0pICYmXG4gICAgICAgICFzaGFsbG93Q29weS5pbmNsdWRlcyhrZXkpICYmXG4gICAgICAgICFub3RUb0NvcHkuaW5jbHVkZXMoa2V5KVxuICAgICAgKSB7XG4gICAgICAgIC8vIHJlY3Vyc2l2ZWx5IGFzc2lnbiBvYmplY3QgdmFsdWVcbiAgICAgICAgY29waWVkW2tleV0gPSB0aGlzLmNvcHlMYXllckNvbmZpZyhjdXJyZW50Q29uZmlnW2tleV0sIGNvbmZpZ1RvQ29weVtrZXldLCB7XG4gICAgICAgICAgc2hhbGxvd0NvcHksXG4gICAgICAgICAgbm90VG9Db3B5XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChub3ROdWxsb3JVbmRlZmluZWQoY29uZmlnVG9Db3B5W2tleV0pICYmICFub3RUb0NvcHkuaW5jbHVkZXMoa2V5KSkge1xuICAgICAgICAvLyBjb3B5XG4gICAgICAgIGNvcGllZFtrZXldID0gY29uZmlnVG9Db3B5W2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBrZWVwIGV4aXN0aW5nXG4gICAgICAgIGNvcGllZFtrZXldID0gY3VycmVudENvbmZpZ1trZXldO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvcGllZDtcbiAgfVxuXG4gIHJlZ2lzdGVyVmlzQ29uZmlnKGxheWVyVmlzQ29uZmlncykge1xuICAgIE9iamVjdC5rZXlzKGxheWVyVmlzQ29uZmlncykuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycgJiYgTEFZRVJfVklTX0NPTkZJR1NbbGF5ZXJWaXNDb25maWdzW2l0ZW1dXSkge1xuICAgICAgICAvLyBpZiBhc3NpZ25lZCBvbmUgb2YgZGVmYXVsdCBMQVlFUl9DT05GSUdTXG4gICAgICAgIHRoaXMuY29uZmlnLnZpc0NvbmZpZ1tpdGVtXSA9IExBWUVSX1ZJU19DT05GSUdTW2xheWVyVmlzQ29uZmlnc1tpdGVtXV0uZGVmYXVsdFZhbHVlO1xuICAgICAgICB0aGlzLnZpc0NvbmZpZ1NldHRpbmdzW2l0ZW1dID0gTEFZRVJfVklTX0NPTkZJR1NbbGF5ZXJWaXNDb25maWdzW2l0ZW1dXTtcbiAgICAgIH0gZWxzZSBpZiAoWyd0eXBlJywgJ2RlZmF1bHRWYWx1ZSddLmV2ZXJ5KHAgPT4gbGF5ZXJWaXNDb25maWdzW2l0ZW1dLmhhc093blByb3BlcnR5KHApKSkge1xuICAgICAgICAvLyBpZiBwcm92aWRlZCBjdXN0b21pemVkIHZpc0NvbmZpZywgYW5kIGhhcyB0eXBlICYmIGRlZmF1bHRWYWx1ZVxuICAgICAgICAvLyBUT0RPOiBmdXJ0aGVyIGNoZWNrIGlmIGN1c3RvbWl6ZWQgdmlzQ29uZmlnIGlzIHZhbGlkXG4gICAgICAgIHRoaXMuY29uZmlnLnZpc0NvbmZpZ1tpdGVtXSA9IGxheWVyVmlzQ29uZmlnc1tpdGVtXS5kZWZhdWx0VmFsdWU7XG4gICAgICAgIHRoaXMudmlzQ29uZmlnU2V0dGluZ3NbaXRlbV0gPSBsYXllclZpc0NvbmZpZ3NbaXRlbV07XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRMYXllckNvbHVtbnMoKSB7XG4gICAgY29uc3QgY29sdW1uVmFsaWRhdG9ycyA9IHRoaXMuY29sdW1uVmFsaWRhdG9ycyB8fCB7fTtcbiAgICBjb25zdCByZXF1aXJlZCA9IHRoaXMucmVxdWlyZWRMYXllckNvbHVtbnMucmVkdWNlKFxuICAgICAgKGFjY3UsIGtleSkgPT4gKHtcbiAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgW2tleV06IGNvbHVtblZhbGlkYXRvcnNba2V5XVxuICAgICAgICAgID8ge3ZhbHVlOiBudWxsLCBmaWVsZElkeDogLTEsIHZhbGlkYXRvcjogY29sdW1uVmFsaWRhdG9yc1trZXldfVxuICAgICAgICAgIDoge3ZhbHVlOiBudWxsLCBmaWVsZElkeDogLTF9XG4gICAgICB9KSxcbiAgICAgIHt9XG4gICAgKTtcbiAgICBjb25zdCBvcHRpb25hbCA9IHRoaXMub3B0aW9uYWxDb2x1bW5zLnJlZHVjZShcbiAgICAgIChhY2N1LCBrZXkpID0+ICh7XG4gICAgICAgIC4uLmFjY3UsXG4gICAgICAgIFtrZXldOiB7dmFsdWU6IG51bGwsIGZpZWxkSWR4OiAtMSwgb3B0aW9uYWw6IHRydWV9XG4gICAgICB9KSxcbiAgICAgIHt9XG4gICAgKTtcblxuICAgIHJldHVybiB7Li4ucmVxdWlyZWQsIC4uLm9wdGlvbmFsfTtcbiAgfVxuXG4gIHVwZGF0ZUxheWVyQ29uZmlnKG5ld0NvbmZpZykge1xuICAgIHRoaXMuY29uZmlnID0gey4uLnRoaXMuY29uZmlnLCAuLi5uZXdDb25maWd9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdXBkYXRlTGF5ZXJWaXNDb25maWcobmV3VmlzQ29uZmlnKSB7XG4gICAgdGhpcy5jb25maWcudmlzQ29uZmlnID0gey4uLnRoaXMuY29uZmlnLnZpc0NvbmZpZywgLi4ubmV3VmlzQ29uZmlnfTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHVwZGF0ZUxheWVyQ29sb3JVSShwcm9wLCBuZXdDb25maWcpIHtcbiAgICBjb25zdCB7Y29sb3JVSTogcHJldmlvdXMsIHZpc0NvbmZpZ30gPSB0aGlzLmNvbmZpZztcblxuICAgIGlmICghaXNQbGFpbk9iamVjdChuZXdDb25maWcpIHx8IHR5cGVvZiBwcm9wICE9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY29uc3QgY29sb3JVSVByb3AgPSBPYmplY3QuZW50cmllcyhuZXdDb25maWcpLnJlZHVjZSgoYWNjdSwgW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5hY2N1LFxuICAgICAgICBba2V5XTogaXNQbGFpbk9iamVjdChhY2N1W2tleV0pICYmIGlzUGxhaW5PYmplY3QodmFsdWUpID8gey4uLmFjY3Vba2V5XSwgLi4udmFsdWV9IDogdmFsdWVcbiAgICAgIH07XG4gICAgfSwgcHJldmlvdXNbcHJvcF0gfHwgREVGQVVMVF9DT0xPUl9VSSk7XG5cbiAgICBjb25zdCBjb2xvclVJID0ge1xuICAgICAgLi4ucHJldmlvdXMsXG4gICAgICBbcHJvcF06IGNvbG9yVUlQcm9wXG4gICAgfTtcblxuICAgIHRoaXMudXBkYXRlTGF5ZXJDb25maWcoe2NvbG9yVUl9KTtcbiAgICAvLyBpZiBjb2xvclVJW3Byb3BdIGlzIGNvbG9yUmFuZ2VcbiAgICBjb25zdCBpc0NvbG9yUmFuZ2UgPSB2aXNDb25maWdbcHJvcF0gJiYgdmlzQ29uZmlnW3Byb3BdLmNvbG9ycztcblxuICAgIGlmIChpc0NvbG9yUmFuZ2UpIHtcbiAgICAgIHRoaXMudXBkYXRlQ29sb3JVSUJ5Q29sb3JSYW5nZShuZXdDb25maWcsIHByb3ApO1xuICAgICAgdGhpcy51cGRhdGVDb2xvclJhbmdlQnlDb2xvclVJKG5ld0NvbmZpZywgcHJldmlvdXMsIHByb3ApO1xuICAgICAgdGhpcy51cGRhdGVDdXN0b21QYWxldHRlKG5ld0NvbmZpZywgcHJldmlvdXMsIHByb3ApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdXBkYXRlQ3VzdG9tUGFsZXR0ZShuZXdDb25maWcsIHByZXZpb3VzLCBwcm9wKSB7XG4gICAgaWYgKCFuZXdDb25maWcuY29sb3JSYW5nZUNvbmZpZyB8fCAhbmV3Q29uZmlnLmNvbG9yUmFuZ2VDb25maWcuY3VzdG9tKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qge2NvbG9yVUksIHZpc0NvbmZpZ30gPSB0aGlzLmNvbmZpZztcblxuICAgIGlmICghdmlzQ29uZmlnW3Byb3BdKSByZXR1cm47XG4gICAgY29uc3Qge2NvbG9yc30gPSB2aXNDb25maWdbcHJvcF07XG4gICAgY29uc3QgY3VzdG9tUGFsZXR0ZSA9IHtcbiAgICAgIC4uLmNvbG9yVUlbcHJvcF0uY3VzdG9tUGFsZXR0ZSxcbiAgICAgIG5hbWU6ICdDdXN0b20gUGFsZXR0ZScsXG4gICAgICBjb2xvcnM6IFsuLi5jb2xvcnNdXG4gICAgfTtcbiAgICB0aGlzLnVwZGF0ZUxheWVyQ29uZmlnKHtcbiAgICAgIGNvbG9yVUk6IHtcbiAgICAgICAgLi4uY29sb3JVSSxcbiAgICAgICAgW3Byb3BdOiB7XG4gICAgICAgICAgLi4uY29sb3JVSVtwcm9wXSxcbiAgICAgICAgICBjdXN0b21QYWxldHRlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogaWYgb3BlbiBkcm9wZG93biBhbmQgcHJvcCBpcyBjb2xvciByYW5nZVxuICAgKiBBdXRvbWF0aWNhbGx5IHNldCBjb2xvclJhbmdlQ29uZmlnJ3Mgc3RlcCBhbmQgcmV2ZXJzZWRcbiAgICogQHBhcmFtIHsqfSBuZXdDb25maWdcbiAgICogQHBhcmFtIHsqfSBwcm9wXG4gICAqL1xuICB1cGRhdGVDb2xvclVJQnlDb2xvclJhbmdlKG5ld0NvbmZpZywgcHJvcCkge1xuICAgIGlmICh0eXBlb2YgbmV3Q29uZmlnLnNob3dEcm9wZG93biAhPT0gJ251bWJlcicpIHJldHVybjtcblxuICAgIGNvbnN0IHtjb2xvclVJLCB2aXNDb25maWd9ID0gdGhpcy5jb25maWc7XG4gICAgdGhpcy51cGRhdGVMYXllckNvbmZpZyh7XG4gICAgICBjb2xvclVJOiB7XG4gICAgICAgIC4uLmNvbG9yVUksXG4gICAgICAgIFtwcm9wXToge1xuICAgICAgICAgIC4uLmNvbG9yVUlbcHJvcF0sXG4gICAgICAgICAgY29sb3JSYW5nZUNvbmZpZzoge1xuICAgICAgICAgICAgLi4uY29sb3JVSVtwcm9wXS5jb2xvclJhbmdlQ29uZmlnLFxuICAgICAgICAgICAgc3RlcHM6IHZpc0NvbmZpZ1twcm9wXS5jb2xvcnMubGVuZ3RoLFxuICAgICAgICAgICAgcmV2ZXJzZWQ6IEJvb2xlYW4odmlzQ29uZmlnW3Byb3BdLnJldmVyc2VkKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlQ29sb3JSYW5nZUJ5Q29sb3JVSShuZXdDb25maWcsIHByZXZpb3VzLCBwcm9wKSB7XG4gICAgLy8gb25seSB1cGRhdGUgY29sb3JSYW5nZSBpZiBjaGFuZ2VzIGluIFVJIGlzIG1hZGUgdG8gJ3JldmVyc2VkJywgJ3N0ZXBzJyBvciBzdGVwc1xuICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9XG4gICAgICBuZXdDb25maWcuY29sb3JSYW5nZUNvbmZpZyAmJlxuICAgICAgWydyZXZlcnNlZCcsICdzdGVwcyddLnNvbWUoXG4gICAgICAgIGtleSA9PlxuICAgICAgICAgIG5ld0NvbmZpZy5jb2xvclJhbmdlQ29uZmlnLmhhc093blByb3BlcnR5KGtleSkgJiZcbiAgICAgICAgICBuZXdDb25maWcuY29sb3JSYW5nZUNvbmZpZ1trZXldICE9PVxuICAgICAgICAgICAgKHByZXZpb3VzW3Byb3BdIHx8IERFRkFVTFRfQ09MT1JfVUkpLmNvbG9yUmFuZ2VDb25maWdba2V5XVxuICAgICAgKTtcbiAgICBpZiAoIXNob3VsZFVwZGF0ZSkgcmV0dXJuO1xuXG4gICAgY29uc3Qge2NvbG9yVUksIHZpc0NvbmZpZ30gPSB0aGlzLmNvbmZpZztcbiAgICBjb25zdCB7c3RlcHMsIHJldmVyc2VkfSA9IGNvbG9yVUlbcHJvcF0uY29sb3JSYW5nZUNvbmZpZztcbiAgICBjb25zdCBjb2xvclJhbmdlID0gdmlzQ29uZmlnW3Byb3BdO1xuICAgIC8vIGZpbmQgYmFzZWQgb24gc3RlcCBvciByZXZlcnNlZFxuICAgIGxldCB1cGRhdGU7XG4gICAgaWYgKG5ld0NvbmZpZy5jb2xvclJhbmdlQ29uZmlnLmhhc093blByb3BlcnR5KCdzdGVwcycpKSB7XG4gICAgICBjb25zdCBncm91cCA9IGdldENvbG9yR3JvdXBCeU5hbWUoY29sb3JSYW5nZSk7XG5cbiAgICAgIGlmIChncm91cCkge1xuICAgICAgICBjb25zdCBzYW1lR3JvdXAgPSBDT0xPUl9SQU5HRVMuZmlsdGVyKGNyID0+IGdldENvbG9yR3JvdXBCeU5hbWUoY3IpID09PSBncm91cCk7XG5cbiAgICAgICAgdXBkYXRlID0gc2FtZUdyb3VwLmZpbmQoY3IgPT4gY3IuY29sb3JzLmxlbmd0aCA9PT0gc3RlcHMpO1xuXG4gICAgICAgIGlmICh1cGRhdGUgJiYgY29sb3JSYW5nZS5yZXZlcnNlZCkge1xuICAgICAgICAgIHVwZGF0ZSA9IHJldmVyc2VDb2xvclJhbmdlKHRydWUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobmV3Q29uZmlnLmNvbG9yUmFuZ2VDb25maWcuaGFzT3duUHJvcGVydHkoJ3JldmVyc2VkJykpIHtcbiAgICAgIHVwZGF0ZSA9IHJldmVyc2VDb2xvclJhbmdlKHJldmVyc2VkLCB1cGRhdGUgfHwgY29sb3JSYW5nZSk7XG4gICAgfVxuXG4gICAgaWYgKHVwZGF0ZSkge1xuICAgICAgdGhpcy51cGRhdGVMYXllclZpc0NvbmZpZyh7W3Byb3BdOiB1cGRhdGV9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciBsYXllciBoYXMgYWxsIGNvbHVtbnNcbiAgICogQHJldHVybnMge2Jvb2xlYW59IHllcyBvciBub1xuICAgKi9cbiAgaGFzQWxsQ29sdW1ucygpIHtcbiAgICBjb25zdCB7Y29sdW1uc30gPSB0aGlzLmNvbmZpZztcbiAgICByZXR1cm4gKFxuICAgICAgKGNvbHVtbnMgJiZcbiAgICAgIE9iamVjdC52YWx1ZXMoY29sdW1ucykuZXZlcnkodiA9PiB7XG4gICAgICAgIHJldHVybiBCb29sZWFuKHYub3B0aW9uYWwgfHwgKHYudmFsdWUgJiYgdi5maWVsZElkeCA+IC0xKSk7XG4gICAgICB9KSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgbGF5ZXIgaGFzIGRhdGFcbiAgICpcbiAgICogQHBhcmFtIHtBcnJheSB8IE9iamVjdH0gbGF5ZXJEYXRhXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB5ZXMgb3Igbm9cbiAgICovXG4gIGhhc0xheWVyRGF0YShsYXllckRhdGEpIHtcbiAgICBpZiAoIWxheWVyRGF0YSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gQm9vbGVhbihsYXllckRhdGEuZGF0YSAmJiBsYXllckRhdGEuZGF0YS5sZW5ndGgpO1xuICB9XG5cbiAgaXNWYWxpZFRvU2F2ZSgpIHtcbiAgICByZXR1cm4gdGhpcy50eXBlICYmIHRoaXMuaGFzQWxsQ29sdW1ucygpO1xuICB9XG5cbiAgc2hvdWxkUmVuZGVyTGF5ZXIoZGF0YSkge1xuICAgIHJldHVybiAoXG4gICAgICAodGhpcy50eXBlICYmXG4gICAgICB0aGlzLmNvbmZpZy5pc1Zpc2libGUgJiZcbiAgICAgIHRoaXMuaGFzQWxsQ29sdW1ucygpICYmXG4gICAgICB0aGlzLmhhc0xheWVyRGF0YShkYXRhKSAmJlxuICAgICAgdHlwZW9mIHRoaXMucmVuZGVyTGF5ZXIgPT09ICdmdW5jdGlvbicpXG4gICAgKTtcbiAgfVxuXG4gIGdldENvbG9yU2NhbGUoY29sb3JTY2FsZSwgY29sb3JEb21haW4sIGNvbG9yUmFuZ2UpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShjb2xvclJhbmdlLmNvbG9yTWFwKSkge1xuICAgICAgY29uc3QgY01hcCA9IG5ldyBNYXAoKTtcbiAgICAgIGNvbG9yUmFuZ2UuY29sb3JNYXAuZm9yRWFjaCgoW2ssIHZdKSA9PiB7XG4gICAgICAgIGNNYXAuc2V0KGssIHR5cGVvZiB2ID09PSAnc3RyaW5nJyA/IGhleFRvUmdiKHYpIDogdik7XG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgc2NhbGUgPSBTQ0FMRV9GVU5DW1NDQUxFX1RZUEVTLm9yZGluYWxdKClcbiAgICAgICAgLmRvbWFpbihjTWFwLmtleXMoKSlcbiAgICAgICAgLnJhbmdlKGNNYXAudmFsdWVzKCkpXG4gICAgICAgIC51bmtub3duKGNNYXAuZ2V0KFVOS05PV05fQ09MT1JfS0VZKSB8fCBOT19WQUxVRV9DT0xPUik7XG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZ2V0VmlzQ2hhbm5lbFNjYWxlKGNvbG9yU2NhbGUsIGNvbG9yRG9tYWluLCBjb2xvclJhbmdlLmNvbG9ycy5tYXAoaGV4VG9SZ2IpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXBwaW5nIGZyb20gdmlzdWFsIGNoYW5uZWxzIHRvIGRlY2suZ2wgYWNjZXNvcnNcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZGF0YUFjY2Vzc29yIC0gYWNjZXNzIGtlcGxlci5nbCBsYXllciBkYXRhIGZyb20gZGVjay5nbCBsYXllclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IGF0dHJpYnV0ZUFjY2Vzc29ycyAtIGRlY2suZ2wgbGF5ZXIgYXR0cmlidXRlIGFjY2Vzc29yc1xuICAgKi9cbiAgZ2V0QXR0cmlidXRlQWNjZXNzb3JzKGRhdGFBY2Nlc3NvciA9IGRlZmF1bHREYXRhQWNjZXNzb3IpIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVBY2Nlc3NvcnMgPSB7fTtcblxuICAgIE9iamVjdC5rZXlzKHRoaXMudmlzdWFsQ2hhbm5lbHMpLmZvckVhY2goY2hhbm5lbCA9PiB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGZpZWxkLFxuICAgICAgICBmaXhlZCxcbiAgICAgICAgc2NhbGUsXG4gICAgICAgIGRvbWFpbixcbiAgICAgICAgcmFuZ2UsXG4gICAgICAgIGFjY2Vzc29yLFxuICAgICAgICBkZWZhdWx0VmFsdWUsXG4gICAgICAgIGdldEF0dHJpYnV0ZVZhbHVlLFxuICAgICAgICBudWxsVmFsdWUsXG4gICAgICAgIGNoYW5uZWxTY2FsZVR5cGVcbiAgICAgIH0gPSB0aGlzLnZpc3VhbENoYW5uZWxzW2NoYW5uZWxdO1xuXG4gICAgICBjb25zdCBzaG91bGRHZXRTY2FsZSA9IHRoaXMuY29uZmlnW2ZpZWxkXTtcblxuICAgICAgaWYgKHNob3VsZEdldFNjYWxlKSB7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSBbdGhpcy5jb25maWdbc2NhbGVdLCB0aGlzLmNvbmZpZ1tkb21haW5dLCB0aGlzLmNvbmZpZy52aXNDb25maWdbcmFuZ2VdXTtcbiAgICAgICAgY29uc3QgaXNGaXhlZCA9IGZpeGVkICYmIHRoaXMuY29uZmlnLnZpc0NvbmZpZ1tmaXhlZF07XG5cbiAgICAgICAgY29uc3Qgc2NhbGVGdW5jdGlvbiA9XG4gICAgICAgICAgY2hhbm5lbFNjYWxlVHlwZSA9PT0gQ0hBTk5FTF9TQ0FMRVMuY29sb3JcbiAgICAgICAgICAgID8gdGhpcy5nZXRDb2xvclNjYWxlKC4uLmFyZ3MpXG4gICAgICAgICAgICA6IHRoaXMuZ2V0VmlzQ2hhbm5lbFNjYWxlKC4uLmFyZ3MsIGlzRml4ZWQpO1xuXG4gICAgICAgIGF0dHJpYnV0ZUFjY2Vzc29yc1thY2Nlc3Nvcl0gPSBkID0+XG4gICAgICAgICAgdGhpcy5nZXRFbmNvZGVkQ2hhbm5lbFZhbHVlKFxuICAgICAgICAgICAgc2NhbGVGdW5jdGlvbixcbiAgICAgICAgICAgIGRhdGFBY2Nlc3NvcihkKSxcbiAgICAgICAgICAgIHRoaXMuY29uZmlnW2ZpZWxkXSxcbiAgICAgICAgICAgIG51bGxWYWx1ZVxuICAgICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBnZXRBdHRyaWJ1dGVWYWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBhdHRyaWJ1dGVBY2Nlc3NvcnNbYWNjZXNzb3JdID0gZ2V0QXR0cmlidXRlVmFsdWUodGhpcy5jb25maWcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXR0cmlidXRlQWNjZXNzb3JzW2FjY2Vzc29yXSA9XG4gICAgICAgICAgdHlwZW9mIGRlZmF1bHRWYWx1ZSA9PT0gJ2Z1bmN0aW9uJyA/IGRlZmF1bHRWYWx1ZSh0aGlzLmNvbmZpZykgOiBkZWZhdWx0VmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGlmICghYXR0cmlidXRlQWNjZXNzb3JzW2FjY2Vzc29yXSkge1xuICAgICAgICBDb25zb2xlLndhcm4oYEZhaWxlZCB0byBwcm92aWRlIGFjY2Vzc28gZnVuY3Rpb24gZm9yICR7YWNjZXNzb3IgfHwgY2hhbm5lbH1gKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBhdHRyaWJ1dGVBY2Nlc3NvcnM7XG4gIH1cblxuICBnZXRWaXNDaGFubmVsU2NhbGUoc2NhbGUsIGRvbWFpbiwgcmFuZ2UsIGZpeGVkKSB7XG4gICAgcmV0dXJuIFNDQUxFX0ZVTkNbZml4ZWQgPyAnbGluZWFyJyA6IHNjYWxlXSgpXG4gICAgICAuZG9tYWluKGRvbWFpbilcbiAgICAgIC5yYW5nZShmaXhlZCA/IGRvbWFpbiA6IHJhbmdlKTtcbiAgfVxuXG4gIGdldFBvaW50c0JvdW5kcyhhbGxEYXRhLCBnZXRQb3NpdGlvbiA9IGlkZW50aXR5KSB7XG4gICAgLy8gbm8gbmVlZCB0byBsb29wIHRocm91Z2ggdGhlIGVudGlyZSBkYXRhc2V0XG4gICAgLy8gZ2V0IGEgc2FtcGxlIG9mIGRhdGEgdG8gY2FsY3VsYXRlIGJvdW5kc1xuICAgIGNvbnN0IHNhbXBsZURhdGEgPVxuICAgICAgYWxsRGF0YS5sZW5ndGggPiBNQVhfU0FNUExFX1NJWkUgPyBnZXRTYW1wbGVEYXRhKGFsbERhdGEsIE1BWF9TQU1QTEVfU0laRSkgOiBhbGxEYXRhO1xuICAgIGNvbnN0IHBvaW50cyA9IHNhbXBsZURhdGEubWFwKGdldFBvc2l0aW9uKTtcblxuICAgIGNvbnN0IGxhdEJvdW5kcyA9IGdldExhdExuZ0JvdW5kcyhwb2ludHMsIDEsIFstOTAsIDkwXSk7XG4gICAgY29uc3QgbG5nQm91bmRzID0gZ2V0TGF0TG5nQm91bmRzKHBvaW50cywgMCwgWy0xODAsIDE4MF0pO1xuXG4gICAgaWYgKCFsYXRCb3VuZHMgfHwgIWxuZ0JvdW5kcykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIFtsbmdCb3VuZHNbMF0sIGxhdEJvdW5kc1swXSwgbG5nQm91bmRzWzFdLCBsYXRCb3VuZHNbMV1dO1xuICB9XG5cbiAgZ2V0Q2hhbmdlZFRyaWdnZXJzKGRhdGFVcGRhdGVUcmlnZ2Vycykge1xuICAgIGNvbnN0IHRyaWdnZXJDaGFuZ2VkID0gZGlmZlVwZGF0ZVRyaWdnZXJzKGRhdGFVcGRhdGVUcmlnZ2VycywgdGhpcy5fb2xkRGF0YVVwZGF0ZVRyaWdnZXJzKTtcbiAgICB0aGlzLl9vbGREYXRhVXBkYXRlVHJpZ2dlcnMgPSBkYXRhVXBkYXRlVHJpZ2dlcnM7XG5cbiAgICByZXR1cm4gdHJpZ2dlckNoYW5nZWQ7XG4gIH1cblxuICBnZXRFbmNvZGVkQ2hhbm5lbFZhbHVlKFxuICAgIHNjYWxlLFxuICAgIGRhdGEsXG4gICAgZmllbGQsXG4gICAgbnVsbFZhbHVlID0gTk9fVkFMVUVfQ09MT1IsXG4gICAgZ2V0VmFsdWUgPSBkZWZhdWx0R2V0RmllbGRWYWx1ZVxuICApIHtcbiAgICBjb25zdCB7dHlwZX0gPSBmaWVsZDtcbiAgICBjb25zdCB2YWx1ZSA9IGdldFZhbHVlKGZpZWxkLCBkYXRhKTtcblxuICAgIGlmICghbm90TnVsbG9yVW5kZWZpbmVkKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIG51bGxWYWx1ZTtcbiAgICB9XG5cbiAgICBsZXQgYXR0cmlidXRlVmFsdWU7XG4gICAgaWYgKHR5cGUgPT09IEFMTF9GSUVMRF9UWVBFUy50aW1lc3RhbXApIHtcbiAgICAgIC8vIHNob3VsZG4ndCBuZWVkIHRvIGNvbnZlcnQgaGVyZVxuICAgICAgLy8gc2NhbGUgRnVuY3Rpb24gc2hvdWxkIHRha2UgY2FyZSBvZiBpdFxuICAgICAgYXR0cmlidXRlVmFsdWUgPSBzY2FsZShuZXcgRGF0ZSh2YWx1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhdHRyaWJ1dGVWYWx1ZSA9IHNjYWxlKHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAoIW5vdE51bGxvclVuZGVmaW5lZChhdHRyaWJ1dGVWYWx1ZSkpIHtcbiAgICAgIGF0dHJpYnV0ZVZhbHVlID0gbnVsbFZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiBhdHRyaWJ1dGVWYWx1ZTtcbiAgfVxuXG4gIHVwZGF0ZU1ldGEobWV0YSkge1xuICAgIHRoaXMubWV0YSA9IHsuLi50aGlzLm1ldGEsIC4uLm1ldGF9O1xuICB9XG5cbiAgZ2V0RGF0YVVwZGF0ZVRyaWdnZXJzKHtmaWx0ZXJlZEluZGV4LCBpZCwgYWxsRGF0YX0pIHtcbiAgICBjb25zdCB7Y29sdW1uc30gPSB0aGlzLmNvbmZpZztcblxuICAgIHJldHVybiB7XG4gICAgICBnZXREYXRhOiB7ZGF0YXNldElkOiBpZCwgYWxsRGF0YSwgY29sdW1ucywgZmlsdGVyZWRJbmRleH0sXG4gICAgICBnZXRNZXRhOiB7ZGF0YXNldElkOiBpZCwgYWxsRGF0YSwgY29sdW1uc30sXG4gICAgICAuLi4odGhpcy5jb25maWcudGV4dExhYmVsIHx8IFtdKS5yZWR1Y2UoXG4gICAgICAgIChhY2N1LCB0bCwgaSkgPT4gKHtcbiAgICAgICAgICAuLi5hY2N1LFxuICAgICAgICAgIFtgZ2V0TGFiZWxDaGFyYWN0ZXJTZXQtJHtpfWBdOiB0bC5maWVsZCA/IHRsLmZpZWxkLm5hbWUgOiBudWxsXG4gICAgICAgIH0pLFxuICAgICAgICB7fVxuICAgICAgKVxuICAgIH07XG4gIH1cblxuICB1cGRhdGVEYXRhKGRhdGFzZXRzLCBvbGRMYXllckRhdGEpIHtcbiAgICBpZiAoIXRoaXMuY29uZmlnLmRhdGFJZCkge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBjb25zdCBsYXllckRhdGFzZXQgPSBkYXRhc2V0c1t0aGlzLmNvbmZpZy5kYXRhSWRdO1xuICAgIGNvbnN0IHthbGxEYXRhfSA9IGRhdGFzZXRzW3RoaXMuY29uZmlnLmRhdGFJZF07XG5cbiAgICBjb25zdCBnZXRQb3NpdGlvbiA9IHRoaXMuZ2V0UG9zaXRpb25BY2Nlc3NvcigpO1xuICAgIGNvbnN0IGRhdGFVcGRhdGVUcmlnZ2VycyA9IHRoaXMuZ2V0RGF0YVVwZGF0ZVRyaWdnZXJzKGxheWVyRGF0YXNldCk7XG4gICAgY29uc3QgdHJpZ2dlckNoYW5nZWQgPSB0aGlzLmdldENoYW5nZWRUcmlnZ2VycyhkYXRhVXBkYXRlVHJpZ2dlcnMpO1xuXG4gICAgaWYgKHRyaWdnZXJDaGFuZ2VkLmdldE1ldGEpIHtcbiAgICAgIHRoaXMudXBkYXRlTGF5ZXJNZXRhKGFsbERhdGEsIGdldFBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBsZXQgZGF0YSA9IFtdO1xuXG4gICAgaWYgKCF0cmlnZ2VyQ2hhbmdlZC5nZXREYXRhICYmIG9sZExheWVyRGF0YSAmJiBvbGRMYXllckRhdGEuZGF0YSkge1xuICAgICAgLy8gc2FtZSBkYXRhXG4gICAgICBkYXRhID0gb2xkTGF5ZXJEYXRhLmRhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEgPSB0aGlzLmNhbGN1bGF0ZURhdGFBdHRyaWJ1dGUobGF5ZXJEYXRhc2V0LCBnZXRQb3NpdGlvbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtkYXRhLCB0cmlnZ2VyQ2hhbmdlZH07XG4gIH1cbiAgLyoqXG4gICAqIGhlbHBlciBmdW5jdGlvbiB0byB1cGRhdGUgb25lIGxheWVyIGRvbWFpbiB3aGVuIHN0YXRlLmRhdGEgY2hhbmdlZFxuICAgKiBpZiBzdGF0ZS5kYXRhIGNoYW5nZSBpcyBkdWUgb3QgdXBkYXRlIGZpbHRlciwgbmV3RmlsZXIgd2lsbCBiZSBwYXNzZWRcbiAgICogY2FsbGVkIGJ5IHVwZGF0ZUFsbExheWVyRG9tYWluRGF0YVxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YXNldHNcbiAgICogQHBhcmFtIHtPYmplY3R9IG5ld0ZpbHRlclxuICAgKiBAcmV0dXJucyB7b2JqZWN0fSBsYXllclxuICAgKi9cbiAgdXBkYXRlTGF5ZXJEb21haW4oZGF0YXNldHMsIG5ld0ZpbHRlcikge1xuICAgIGNvbnN0IHRhYmxlID0gdGhpcy5nZXREYXRhc2V0KGRhdGFzZXRzKTtcbiAgICBpZiAoIXRhYmxlKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgT2JqZWN0LnZhbHVlcyh0aGlzLnZpc3VhbENoYW5uZWxzKS5mb3JFYWNoKGNoYW5uZWwgPT4ge1xuICAgICAgY29uc3Qge3NjYWxlfSA9IGNoYW5uZWw7XG4gICAgICBjb25zdCBzY2FsZVR5cGUgPSB0aGlzLmNvbmZpZ1tzY2FsZV07XG4gICAgICAvLyBvcmRpbmFsIGRvbWFpbiBpcyBiYXNlZCBvbiBhbGxEYXRhLCBpZiBvbmx5IGZpbHRlciBjaGFuZ2VkXG4gICAgICAvLyBubyBuZWVkIHRvIHVwZGF0ZSBvcmRpbmFsIGRvbWFpblxuICAgICAgaWYgKCFuZXdGaWx0ZXIgfHwgc2NhbGVUeXBlICE9PSBTQ0FMRV9UWVBFUy5vcmRpbmFsKSB7XG4gICAgICAgIGNvbnN0IHtkb21haW59ID0gY2hhbm5lbDtcbiAgICAgICAgY29uc3QgdXBkYXRlZERvbWFpbiA9IHRoaXMuY2FsY3VsYXRlTGF5ZXJEb21haW4odGFibGUsIGNoYW5uZWwpO1xuICAgICAgICB0aGlzLnVwZGF0ZUxheWVyQ29uZmlnKHtbZG9tYWluXTogdXBkYXRlZERvbWFpbn0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBnZXREYXRhc2V0KGRhdGFzZXRzKSB7XG4gICAgcmV0dXJuIHRoaXMuY29uZmlnLmRhdGFJZCA/IGRhdGFzZXRzW3RoaXMuY29uZmlnLmRhdGFJZF0gOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIHZpc3VhbCBjaGFubmVsIGZpZWxkIGFuZCBzY2FsZXMgYmFzZWQgb24gc3VwcG9ydGVkIGZpZWxkICYgc2NhbGUgdHlwZVxuICAgKiBAcGFyYW0gY2hhbm5lbFxuICAgKi9cbiAgdmFsaWRhdGVWaXN1YWxDaGFubmVsKGNoYW5uZWwpIHtcbiAgICB0aGlzLnZhbGlkYXRlRmllbGRUeXBlKGNoYW5uZWwpO1xuICAgIHRoaXMudmFsaWRhdGVTY2FsZShjaGFubmVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZSBmaWVsZCB0eXBlIGJhc2VkIG9uIGNoYW5uZWxTY2FsZVR5cGVcbiAgICovXG4gIHZhbGlkYXRlRmllbGRUeXBlKGNoYW5uZWwpIHtcbiAgICBjb25zdCB2aXN1YWxDaGFubmVsID0gdGhpcy52aXN1YWxDaGFubmVsc1tjaGFubmVsXTtcbiAgICBjb25zdCB7ZmllbGQsIGNoYW5uZWxTY2FsZVR5cGUsIHN1cHBvcnRlZEZpZWxkVHlwZXN9ID0gdmlzdWFsQ2hhbm5lbDtcblxuICAgIGlmICh0aGlzLmNvbmZpZ1tmaWVsZF0pIHtcbiAgICAgIC8vIGlmIGZpZWxkIGlzIHNlbGVjdGVkLCBjaGVjayBpZiBmaWVsZCB0eXBlIGlzIHN1cHBvcnRlZFxuICAgICAgY29uc3QgY2hhbm5lbFN1cHBvcnRlZEZpZWxkVHlwZXMgPVxuICAgICAgICBzdXBwb3J0ZWRGaWVsZFR5cGVzIHx8IENIQU5ORUxfU0NBTEVfU1VQUE9SVEVEX0ZJRUxEU1tjaGFubmVsU2NhbGVUeXBlXTtcblxuICAgICAgaWYgKCFjaGFubmVsU3VwcG9ydGVkRmllbGRUeXBlcy5pbmNsdWRlcyh0aGlzLmNvbmZpZ1tmaWVsZF0udHlwZSkpIHtcbiAgICAgICAgLy8gZmllbGQgdHlwZSBpcyBub3Qgc3VwcG9ydGVkLCBzZXQgaXQgYmFjayB0byBudWxsXG4gICAgICAgIC8vIHNldCBzY2FsZSBiYWNrIHRvIGRlZmF1bHRcbiAgICAgICAgdGhpcy51cGRhdGVMYXllckNvbmZpZyh7W2ZpZWxkXTogbnVsbH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZSBzY2FsZSB0eXBlIGJhc2VkIG9uIGFnZ3JlZ2F0aW9uXG4gICAqL1xuICB2YWxpZGF0ZVNjYWxlKGNoYW5uZWwpIHtcbiAgICBjb25zdCB2aXN1YWxDaGFubmVsID0gdGhpcy52aXN1YWxDaGFubmVsc1tjaGFubmVsXTtcbiAgICBjb25zdCB7c2NhbGV9ID0gdmlzdWFsQ2hhbm5lbDtcbiAgICBpZiAoIXNjYWxlKSB7XG4gICAgICAvLyB2aXN1YWxDaGFubmVsIGRvZXNuJ3QgaGF2ZSBzY2FsZVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzY2FsZU9wdGlvbnMgPSB0aGlzLmdldFNjYWxlT3B0aW9ucyhjaGFubmVsKTtcbiAgICAvLyBjaGVjayBpZiBjdXJyZW50IHNlbGVjdGVkIHNjYWxlIGlzXG4gICAgLy8gc3VwcG9ydGVkLCBpZiBub3QsIGNoYW5nZSB0byBkZWZhdWx0XG4gICAgaWYgKCFzY2FsZU9wdGlvbnMuaW5jbHVkZXModGhpcy5jb25maWdbc2NhbGVdKSkge1xuICAgICAgdGhpcy51cGRhdGVMYXllckNvbmZpZyh7W3NjYWxlXTogc2NhbGVPcHRpb25zWzBdfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBzY2FsZSBvcHRpb25zIGJhc2VkIG9uIGN1cnJlbnQgZmllbGRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNoYW5uZWxcbiAgICogQHJldHVybnMge3N0cmluZ1tdfVxuICAgKi9cbiAgZ2V0U2NhbGVPcHRpb25zKGNoYW5uZWwpIHtcbiAgICBjb25zdCB2aXN1YWxDaGFubmVsID0gdGhpcy52aXN1YWxDaGFubmVsc1tjaGFubmVsXTtcbiAgICBjb25zdCB7ZmllbGQsIHNjYWxlLCBjaGFubmVsU2NhbGVUeXBlfSA9IHZpc3VhbENoYW5uZWw7XG5cbiAgICByZXR1cm4gdGhpcy5jb25maWdbZmllbGRdXG4gICAgICA/IEZJRUxEX09QVFNbdGhpcy5jb25maWdbZmllbGRdLnR5cGVdLnNjYWxlW2NoYW5uZWxTY2FsZVR5cGVdXG4gICAgICA6IFt0aGlzLmdldERlZmF1bHRMYXllckNvbmZpZygpW3NjYWxlXV07XG4gIH1cblxuICB1cGRhdGVMYXllclZpc3VhbENoYW5uZWwoZGF0YXNldCwgY2hhbm5lbCkge1xuICAgIGNvbnN0IHZpc3VhbENoYW5uZWwgPSB0aGlzLnZpc3VhbENoYW5uZWxzW2NoYW5uZWxdO1xuICAgIHRoaXMudmFsaWRhdGVWaXN1YWxDaGFubmVsKGNoYW5uZWwpO1xuICAgIC8vIGNhbGN1bGF0ZSBsYXllciBjaGFubmVsIGRvbWFpblxuICAgIGNvbnN0IHVwZGF0ZWREb21haW4gPSB0aGlzLmNhbGN1bGF0ZUxheWVyRG9tYWluKGRhdGFzZXQsIHZpc3VhbENoYW5uZWwpO1xuICAgIHRoaXMudXBkYXRlTGF5ZXJDb25maWcoe1t2aXN1YWxDaGFubmVsLmRvbWFpbl06IHVwZGF0ZWREb21haW59KTtcbiAgfVxuXG4gIGdldFZpc3VhbENoYW5uZWxVcGRhdGVUcmlnZ2VycygpIHtcbiAgICBjb25zdCB1cGRhdGVUcmlnZ2VycyA9IHt9O1xuICAgIE9iamVjdC52YWx1ZXModGhpcy52aXN1YWxDaGFubmVscykuZm9yRWFjaCh2aXN1YWxDaGFubmVsID0+IHtcbiAgICAgIC8vIGZpZWxkIHJhbmdlIHNjYWxlIGRvbWFpblxuICAgICAgY29uc3Qge2FjY2Vzc29yLCBmaWVsZCwgc2NhbGUsIGRvbWFpbiwgcmFuZ2UsIGRlZmF1bHRWYWx1ZSwgZml4ZWR9ID0gdmlzdWFsQ2hhbm5lbDtcblxuICAgICAgdXBkYXRlVHJpZ2dlcnNbYWNjZXNzb3JdID0ge1xuICAgICAgICBbZmllbGRdOiB0aGlzLmNvbmZpZ1tmaWVsZF0sXG4gICAgICAgIFtzY2FsZV06IHRoaXMuY29uZmlnW3NjYWxlXSxcbiAgICAgICAgW2RvbWFpbl06IHRoaXMuY29uZmlnW2RvbWFpbl0sXG4gICAgICAgIFtyYW5nZV06IHRoaXMuY29uZmlnLnZpc0NvbmZpZ1tyYW5nZV0sXG4gICAgICAgIGRlZmF1bHRWYWx1ZTogdHlwZW9mIGRlZmF1bHRWYWx1ZSA9PT0gJ2Z1bmN0aW9uJyA/IGRlZmF1bHRWYWx1ZSh0aGlzLmNvbmZpZykgOiBkZWZhdWx0VmFsdWUsXG4gICAgICAgIC4uLihmaXhlZCA/IHtbZml4ZWRdOiB0aGlzLmNvbmZpZy52aXNDb25maWdbZml4ZWRdfSA6IHt9KVxuICAgICAgfTtcbiAgICB9KTtcbiAgICByZXR1cm4gdXBkYXRlVHJpZ2dlcnM7XG4gIH1cblxuICBjYWxjdWxhdGVMYXllckRvbWFpbihkYXRhc2V0LCB2aXN1YWxDaGFubmVsKSB7XG4gICAgY29uc3Qge3NjYWxlfSA9IHZpc3VhbENoYW5uZWw7XG4gICAgY29uc3Qgc2NhbGVUeXBlID0gdGhpcy5jb25maWdbc2NhbGVdO1xuXG4gICAgY29uc3QgZmllbGQgPSB0aGlzLmNvbmZpZ1t2aXN1YWxDaGFubmVsLmZpZWxkXTtcbiAgICBpZiAoIWZpZWxkKSB7XG4gICAgICAvLyBpZiBjb2xvckZpZWxkIG9yIHNpemVGaWVsZCB3ZXJlIHNldCBiYWNrIHRvIG51bGxcbiAgICAgIHJldHVybiBkZWZhdWx0RG9tYWluO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhc2V0LmdldENvbHVtbkxheWVyRG9tYWluKGZpZWxkLCBzY2FsZVR5cGUpIHx8IGRlZmF1bHREb21haW47XG4gIH1cblxuICBoYXNIb3ZlcmVkT2JqZWN0KG9iamVjdEluZm8pIHtcbiAgICByZXR1cm4gdGhpcy5pc0xheWVySG92ZXJlZChvYmplY3RJbmZvKSAmJiBvYmplY3RJbmZvLm9iamVjdCA/IG9iamVjdEluZm8ub2JqZWN0IDogbnVsbDtcbiAgfVxuXG4gIGlzTGF5ZXJIb3ZlcmVkKG9iamVjdEluZm8pIHtcbiAgICByZXR1cm4gb2JqZWN0SW5mbz8ucGlja2VkICYmIG9iamVjdEluZm8/LmxheWVyPy5wcm9wcz8uaWQgPT09IHRoaXMuaWQ7XG4gIH1cblxuICBnZXRSYWRpdXNTY2FsZUJ5Wm9vbShtYXBTdGF0ZSwgZml4ZWRSYWRpdXMpIHtcbiAgICBjb25zdCByYWRpdXNDaGFubmVsID0gT2JqZWN0LnZhbHVlcyh0aGlzLnZpc3VhbENoYW5uZWxzKS5maW5kKHZjID0+IHZjLnByb3BlcnR5ID09PSAncmFkaXVzJyk7XG5cbiAgICBpZiAoIXJhZGl1c0NoYW5uZWwpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH1cblxuICAgIGNvbnN0IGZpZWxkID0gcmFkaXVzQ2hhbm5lbC5maWVsZDtcbiAgICBjb25zdCBmaXhlZCA9IGZpeGVkUmFkaXVzID09PSB1bmRlZmluZWQgPyB0aGlzLmNvbmZpZy52aXNDb25maWcuZml4ZWRSYWRpdXMgOiBmaXhlZFJhZGl1cztcbiAgICBjb25zdCB7cmFkaXVzfSA9IHRoaXMuY29uZmlnLnZpc0NvbmZpZztcblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICByZXR1cm4gZml4ZWQgPyAxIDogKHRoaXMuY29uZmlnW2ZpZWxkXSA/IDEgOiByYWRpdXMpICogdGhpcy5nZXRab29tRmFjdG9yKG1hcFN0YXRlKTtcbiAgfVxuXG4gIHNob3VsZENhbGN1bGF0ZUxheWVyRGF0YShwcm9wcykge1xuICAgIHJldHVybiBwcm9wcy5zb21lKHAgPT4gIXRoaXMubm9uZUxheWVyRGF0YUFmZmVjdGluZ1Byb3BzLmluY2x1ZGVzKHApKTtcbiAgfVxuXG4gIGdldEJydXNoaW5nRXh0ZW5zaW9uUHJvcHMoaW50ZXJhY3Rpb25Db25maWcsIGJydXNoaW5nVGFyZ2V0KSB7XG4gICAgY29uc3Qge2JydXNofSA9IGludGVyYWN0aW9uQ29uZmlnO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIGJydXNoaW5nXG4gICAgICBhdXRvSGlnaGxpZ2h0OiAhYnJ1c2guZW5hYmxlZCxcbiAgICAgIGJydXNoaW5nUmFkaXVzOiBicnVzaC5jb25maWcuc2l6ZSAqIDEwMDAsXG4gICAgICBicnVzaGluZ1RhcmdldDogYnJ1c2hpbmdUYXJnZXQgfHwgJ3NvdXJjZScsXG4gICAgICBicnVzaGluZ0VuYWJsZWQ6IGJydXNoLmVuYWJsZWRcbiAgICB9O1xuICB9XG5cbiAgZ2V0RGVmYXVsdERlY2tMYXllclByb3BzKHtpZHgsIGdwdUZpbHRlciwgbWFwU3RhdGV9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgaWR4LFxuICAgICAgY29vcmRpbmF0ZVN5c3RlbTogQ09PUkRJTkFURV9TWVNURU0uTE5HTEFULFxuICAgICAgcGlja2FibGU6IHRydWUsXG4gICAgICB3cmFwTG9uZ2l0dWRlOiB0cnVlLFxuICAgICAgcGFyYW1ldGVyczoge2RlcHRoVGVzdDogQm9vbGVhbihtYXBTdGF0ZS5kcmFnUm90YXRlIHx8IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5lbmFibGUzZCl9LFxuICAgICAgaGlkZGVuOiB0aGlzLmNvbmZpZy5oaWRkZW4sXG4gICAgICAvLyB2aXNjb25maWdcbiAgICAgIG9wYWNpdHk6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5vcGFjaXR5LFxuICAgICAgaGlnaGxpZ2h0Q29sb3I6IHRoaXMuY29uZmlnLmhpZ2hsaWdodENvbG9yLFxuICAgICAgLy8gZGF0YSBmaWx0ZXJpbmdcbiAgICAgIGV4dGVuc2lvbnM6IFtkYXRhRmlsdGVyRXh0ZW5zaW9uXSxcbiAgICAgIGZpbHRlclJhbmdlOiBncHVGaWx0ZXIgPyBncHVGaWx0ZXIuZmlsdGVyUmFuZ2UgOiB1bmRlZmluZWRcbiAgICB9O1xuICB9XG5cbiAgZ2V0RGVmYXVsdEhvdmVyTGF5ZXJQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IGAke3RoaXMuaWR9LWhvdmVyZWRgLFxuICAgICAgcGlja2FibGU6IGZhbHNlLFxuICAgICAgd3JhcExvbmdpdHVkZTogdHJ1ZSxcbiAgICAgIGNvb3JkaW5hdGVTeXN0ZW06IENPT1JESU5BVEVfU1lTVEVNLkxOR0xBVFxuICAgIH07XG4gIH1cblxuICByZW5kZXJUZXh0TGFiZWxMYXllcih7Z2V0UG9zaXRpb24sIGdldFBpeGVsT2Zmc2V0LCB1cGRhdGVUcmlnZ2Vycywgc2hhcmVkUHJvcHN9LCByZW5kZXJPcHRzKSB7XG4gICAgY29uc3Qge2RhdGEsIG1hcFN0YXRlfSA9IHJlbmRlck9wdHM7XG4gICAgY29uc3Qge3RleHRMYWJlbH0gPSB0aGlzLmNvbmZpZztcblxuICAgIHJldHVybiBkYXRhLnRleHRMYWJlbHMucmVkdWNlKChhY2N1LCBkLCBpKSA9PiB7XG4gICAgICBpZiAoZC5nZXRUZXh0KSB7XG4gICAgICAgIGFjY3UucHVzaChcbiAgICAgICAgICBuZXcgVGV4dExheWVyKHtcbiAgICAgICAgICAgIC4uLnNoYXJlZFByb3BzLFxuICAgICAgICAgICAgaWQ6IGAke3RoaXMuaWR9LWxhYmVsLSR7dGV4dExhYmVsW2ldLmZpZWxkPy5uYW1lfWAsXG4gICAgICAgICAgICBkYXRhOiBkYXRhLmRhdGEsXG4gICAgICAgICAgICBnZXRUZXh0OiBkLmdldFRleHQsXG4gICAgICAgICAgICBnZXRQb3NpdGlvbixcbiAgICAgICAgICAgIGNoYXJhY3RlclNldDogZC5jaGFyYWN0ZXJTZXQsXG4gICAgICAgICAgICBnZXRQaXhlbE9mZnNldDogZ2V0UGl4ZWxPZmZzZXQodGV4dExhYmVsW2ldKSxcbiAgICAgICAgICAgIGdldFNpemU6IDEsXG4gICAgICAgICAgICBzaXplU2NhbGU6IHRleHRMYWJlbFtpXS5zaXplLFxuICAgICAgICAgICAgZ2V0VGV4dEFuY2hvcjogdGV4dExhYmVsW2ldLmFuY2hvcixcbiAgICAgICAgICAgIGdldEFsaWdubWVudEJhc2VsaW5lOiB0ZXh0TGFiZWxbaV0uYWxpZ25tZW50LFxuICAgICAgICAgICAgZ2V0Q29sb3I6IHRleHRMYWJlbFtpXS5jb2xvcixcbiAgICAgICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgLy8gdGV4dCB3aWxsIGFsd2F5cyBzaG93IG9uIHRvcCBvZiBhbGwgbGF5ZXJzXG4gICAgICAgICAgICAgIGRlcHRoVGVzdDogZmFsc2VcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGdldEZpbHRlclZhbHVlOiBkYXRhLmdldEZpbHRlclZhbHVlLFxuICAgICAgICAgICAgdXBkYXRlVHJpZ2dlcnM6IHtcbiAgICAgICAgICAgICAgLi4udXBkYXRlVHJpZ2dlcnMsXG4gICAgICAgICAgICAgIGdldFRleHQ6IHRleHRMYWJlbFtpXS5maWVsZD8ubmFtZSxcbiAgICAgICAgICAgICAgZ2V0UGl4ZWxPZmZzZXQ6IHtcbiAgICAgICAgICAgICAgICAuLi51cGRhdGVUcmlnZ2Vycy5nZXRSYWRpdXMsXG4gICAgICAgICAgICAgICAgbWFwU3RhdGUsXG4gICAgICAgICAgICAgICAgYW5jaG9yOiB0ZXh0TGFiZWxbaV0uYW5jaG9yLFxuICAgICAgICAgICAgICAgIGFsaWdubWVudDogdGV4dExhYmVsW2ldLmFsaWdubWVudFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBnZXRUZXh0QW5jaG9yOiB0ZXh0TGFiZWxbaV0uYW5jaG9yLFxuICAgICAgICAgICAgICBnZXRBbGlnbm1lbnRCYXNlbGluZTogdGV4dExhYmVsW2ldLmFsaWdubWVudCxcbiAgICAgICAgICAgICAgZ2V0Q29sb3I6IHRleHRMYWJlbFtpXS5jb2xvclxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYWNjdTtcbiAgICB9LCBbXSk7XG4gIH1cblxuICBjYWxjdWxhdGVEYXRhQXR0cmlidXRlKGRhdGFzZXQsIGdldFBvc2l0aW9uKSB7XG4gICAgLy8gaW1wbGVtZW50ZWQgaW4gc3ViY2xhc3Nlc1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHVwZGF0ZUxheWVyTWV0YShhbGxEYXRhLCBnZXRQb3NpdGlvbikge1xuICAgIC8vIGltcGxlbWVudGVkIGluIHN1YmNsYXNzZXNcbiAgfVxuXG4gIGdldFBvc2l0aW9uQWNjZXNzb3IoKSB7XG4gICAgLy8gaW1wbGVtZW50ZWQgaW4gc3ViY2xhc3Nlc1xuICAgIHJldHVybiAoKSA9PiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExheWVyO1xuIl19