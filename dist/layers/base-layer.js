"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.colorMaker = exports.layerColors = exports.OVERLAY_TYPE = void 0;

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

var _dataScaleUtils = require("../utils/data-scale-utils");

var _colorUtils = require("../utils/color-utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var _marked =
/*#__PURE__*/
_regenerator["default"].mark(generateColor);

/**
 * Approx. number of points to sample in a large data set
 * @type {number}
 */
var MAX_SAMPLE_SIZE = 5000;
var dataFilterExtension = new _extensions.DataFilterExtension({
  filterSize: _defaultSettings.MAX_GPU_FILTERS
});

var identity = function identity(d) {
  return d;
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
  return d[field.tableFieldIndex - 1];
};

var Layer =
/*#__PURE__*/
function () {
  function Layer() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2["default"])(this, Layer);
    this.id = props.id || (0, _utils.generateHashId)(6); // meta

    this.meta = {}; // visConfigSettings

    this.visConfigSettings = {};
    this.config = this.getDefaultLayerConfig(_objectSpread({
      columns: this.getLayerColumns()
    }, props));
  }

  (0, _createClass2["default"])(Layer, [{
    key: "getDefaultLayerConfig",
    value: function getDefaultLayerConfig() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return {
        dataId: props.dataId || null,
        label: props.label || 'new layer',
        color: props.color || colorMaker.next().value,
        columns: props.columns || null,
        isVisible: props.isVisible || false,
        isConfigActive: props.isConfigActive || false,
        highlightColor: props.highlightColor || [252, 242, 26, 255],
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
        measure: this.config[this.visualChannels[key].field] ? this.config[this.visualChannels[key].field].name : this.visualChannels[key].defaultMeasure
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
        fieldIdx: field.tableFieldIndex - 1
      } : {
        value: null,
        fieldIdx: -1
      };
      return _objectSpread({}, this.config.columns, (0, _defineProperty2["default"])({}, key, _objectSpread({}, this.config.columns[key], {}, update)));
    }
    /**
     * Assign a field pair to column config, return column config
     * @param key - Column Key
     * @param pair - field Pair
     * @returns {{}} - Column config
     */

  }, {
    key: "assignColumnPairs",
    value: function assignColumnPairs(key, pair) {
      var _objectSpread3;

      if (!this.columnPairs || !this.columnPairs[key]) {
        // should not end in this state
        return this.config.columns;
      }

      var _this$columnPairs$key = this.columnPairs[key],
          partnerKey = _this$columnPairs$key.pair,
          fieldPairKey = _this$columnPairs$key.fieldPairKey;
      var partnerFieldPairKey = this.columnPairs[partnerKey].fieldPairKey;
      return _objectSpread({}, this.config.columns, (_objectSpread3 = {}, (0, _defineProperty2["default"])(_objectSpread3, key, pair[fieldPairKey]), (0, _defineProperty2["default"])(_objectSpread3, partnerKey, pair[partnerFieldPairKey]), _objectSpread3));
    }
    /**
     * Calculate a radius zoom multiplier to render points, so they are visible in all zoom level
     * @param mapState
     * @param mapState.zoom - actual zoom
     * @param mapState.zoomOffset - zoomOffset when render in the plot container for export image
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
     * @param mapState
     * @param mapState.zoom - actual zoom
     * @param mapState.zoomOffset - zoomOffset when render in the plot container for export image
     * @returns {number}
     */

  }, {
    key: "getElevationZoomFactor",
    value: function getElevationZoomFactor(_ref2) {
      var zoom = _ref2.zoom,
          _ref2$zoomOffset = _ref2.zoomOffset,
          zoomOffset = _ref2$zoomOffset === void 0 ? 0 : _ref2$zoomOffset;
      return Math.pow(2, Math.max(8 - zoom + zoomOffset, 0));
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
        if (configToCopy.visConfig[v.range] && visConfigSettings[v.range].group !== _this.visConfigSettings[v.range].group) {
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
      var required = this.requiredLayerColumns.reduce(function (accu, key) {
        return _objectSpread({}, accu, (0, _defineProperty2["default"])({}, key, {
          value: null,
          fieldIdx: -1
        }));
      }, {});
      var optional = this.optionalColumns.reduce(function (accu, key) {
        return _objectSpread({}, accu, (0, _defineProperty2["default"])({}, key, {
          value: null,
          fieldIdx: -1,
          optional: true
        }));
      }, {});
      return _objectSpread({}, required, {}, optional);
    }
  }, {
    key: "updateLayerConfig",
    value: function updateLayerConfig(newConfig) {
      this.config = _objectSpread({}, this.config, {}, newConfig);
      return this;
    }
  }, {
    key: "updateLayerVisConfig",
    value: function updateLayerVisConfig(newVisConfig) {
      this.config.visConfig = _objectSpread({}, this.config.visConfig, {}, newVisConfig);
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

        return _objectSpread({}, accu, (0, _defineProperty2["default"])({}, key, (0, _utils.isPlainObject)(accu[key]) && (0, _utils.isPlainObject)(value) ? _objectSpread({}, accu[key], {}, value) : value));
      }, previous[prop] || _layerFactory.DEFAULT_COLOR_UI);

      var colorUI = _objectSpread({}, previous, (0, _defineProperty2["default"])({}, prop, colorUIProp));

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

      var customPalette = _objectSpread({}, colorUI[prop].customPalette, {
        name: 'Custom Palette',
        colors: (0, _toConsumableArray2["default"])(colors)
      });

      this.updateLayerConfig({
        colorUI: _objectSpread({}, colorUI, (0, _defineProperty2["default"])({}, prop, _objectSpread({}, colorUI[prop], {
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
        colorUI: _objectSpread({}, colorUI, (0, _defineProperty2["default"])({}, prop, _objectSpread({}, colorUI[prop], {
          colorRangeConfig: _objectSpread({}, colorUI[prop].colorRangeConfig, {
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
     *
     * @param {object} layer
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
     * @param {object} layer
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
      this.meta = _objectSpread({}, this.meta, {}, meta);
    }
  }, {
    key: "getDataUpdateTriggers",
    value: function getDataUpdateTriggers(_ref6) {
      var filteredIndex = _ref6.filteredIndex,
          id = _ref6.id;
      var columns = this.config.columns;
      return _objectSpread({
        getData: {
          datasetId: id,
          columns: columns,
          filteredIndex: filteredIndex
        },
        getMeta: {
          datasetId: id,
          columns: columns
        }
      }, (this.config.textLabel || []).reduce(function (accu, tl, i) {
        return _objectSpread({}, accu, (0, _defineProperty2["default"])({}, "getLabelCharacterSet-".concat(i), tl.field ? tl.field.name : null));
      }, {}));
    }
  }, {
    key: "updateData",
    value: function updateData(datasets, oldLayerData) {
      var layerDataset = datasets[this.config.dataId];
      var allData = datasets[this.config.dataId].allData;
      var getPosition = this.getPositionAccessor();
      var dataUpdateTriggers = this.getDataUpdateTriggers(layerDataset);
      var triggerChanged = this.getChangedTriggers(dataUpdateTriggers);

      if (triggerChanged.getMeta) {
        this.updateLayerMeta(allData, getPosition);
      }

      var data = [];

      if (!triggerChanged.getData) {
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
     * @param {Object} dataset
     * @param {Object} newFilter
     * @returns {object} layer
     */

  }, {
    key: "updateLayerDomain",
    value: function updateLayerDomain(datasets, newFilter) {
      var _this4 = this;

      var dataset = this.getDataset(datasets);

      if (!dataset) {
        return this;
      }

      Object.values(this.visualChannels).forEach(function (channel) {
        var scale = channel.scale;
        var scaleType = _this4.config[scale]; // ordinal domain is based on allData, if only filter changed
        // no need to update ordinal domain

        if (!newFilter || scaleType !== _defaultSettings.SCALE_TYPES.ordinal) {
          var domain = channel.domain;

          var updatedDomain = _this4.calculateLayerDomain(dataset, channel);

          _this4.updateLayerConfig((0, _defineProperty2["default"])({}, domain, updatedDomain));
        }
      });
      return this;
    }
  }, {
    key: "getDataset",
    value: function getDataset(datasets) {
      return datasets[this.config.dataId];
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
    key: "calculateLayerDomain",
    value: function calculateLayerDomain(dataset, visualChannel) {
      var allData = dataset.allData,
          filteredIndexForDomain = dataset.filteredIndexForDomain;
      var defaultDomain = [0, 1];
      var scale = visualChannel.scale;
      var scaleType = this.config[scale];
      var field = this.config[visualChannel.field];

      if (!field) {
        // if colorField or sizeField were set back to null
        return defaultDomain;
      }

      if (!_defaultSettings.SCALE_TYPES[scaleType]) {
        _window.console.error("scale type ".concat(scaleType, " not supported"));

        return defaultDomain;
      } // TODO: refactor to add valueAccessor to field


      var fieldIdx = field.tableFieldIndex - 1;
      var isTime = field.type === _defaultSettings.ALL_FIELD_TYPES.timestamp;

      var valueAccessor = _dataUtils.maybeToDate.bind(null, isTime, fieldIdx, field.format);

      var indexValueAccessor = function indexValueAccessor(i) {
        return valueAccessor(allData[i]);
      };

      var sortFunction = (0, _dataUtils.getSortingFunction)(field.type);

      switch (scaleType) {
        case _defaultSettings.SCALE_TYPES.ordinal:
        case _defaultSettings.SCALE_TYPES.point:
          // do not recalculate ordinal domain based on filtered data
          // don't need to update ordinal domain every time
          return (0, _dataScaleUtils.getOrdinalDomain)(allData, valueAccessor);

        case _defaultSettings.SCALE_TYPES.quantile:
          return (0, _dataScaleUtils.getQuantileDomain)(filteredIndexForDomain, indexValueAccessor, sortFunction);

        case _defaultSettings.SCALE_TYPES.log:
          return (0, _dataScaleUtils.getLogDomain)(filteredIndexForDomain, indexValueAccessor);

        case _defaultSettings.SCALE_TYPES.quantize:
        case _defaultSettings.SCALE_TYPES.linear:
        case _defaultSettings.SCALE_TYPES.sqrt:
        default:
          return (0, _dataScaleUtils.getLinearDomain)(filteredIndexForDomain, indexValueAccessor);
      }
    }
  }, {
    key: "isLayerHovered",
    value: function isLayerHovered(objectInfo) {
      return objectInfo && objectInfo.layer && objectInfo.picked && objectInfo.layer.props.id === this.id;
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
      var radius = this.config.visConfig.radius;
      return fixed ? 1 : (this.config[field] ? 1 : radius) * this.getZoomFactor(mapState);
    }
  }, {
    key: "shouldCalculateLayerData",
    value: function shouldCalculateLayerData(props) {
      var _this5 = this;

      return props.some(function (p) {
        return !_this5.noneLayerDataAffectingProps.includes(p);
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
    value: function getDefaultDeckLayerProps(_ref7) {
      var idx = _ref7.idx,
          gpuFilter = _ref7.gpuFilter,
          mapState = _ref7.mapState;
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
        filterRange: gpuFilter.filterRange
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
    value: function renderTextLabelLayer(_ref8, renderOpts) {
      var _this6 = this;

      var getPosition = _ref8.getPosition,
          getPixelOffset = _ref8.getPixelOffset,
          updateTriggers = _ref8.updateTriggers,
          sharedProps = _ref8.sharedProps;
      var data = renderOpts.data,
          mapState = renderOpts.mapState;
      var textLabel = this.config.textLabel;
      return data.textLabels.reduce(function (accu, d, i) {
        if (d.getText) {
          accu.push(new _layers.TextLayer(_objectSpread({}, sharedProps, {
            id: "".concat(_this6.id, "-label-").concat(textLabel[i].field.name),
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
            updateTriggers: _objectSpread({}, updateTriggers, {
              getText: textLabel[i].field.name,
              getPixelOffset: _objectSpread({}, updateTriggers.getRadius, {
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
            fieldIdx: f.tableFieldIndex - 1
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

exports["default"] = Layer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvYmFzZS1sYXllci5qcyJdLCJuYW1lcyI6WyJnZW5lcmF0ZUNvbG9yIiwiTUFYX1NBTVBMRV9TSVpFIiwiZGF0YUZpbHRlckV4dGVuc2lvbiIsIkRhdGFGaWx0ZXJFeHRlbnNpb24iLCJmaWx0ZXJTaXplIiwiTUFYX0dQVV9GSUxURVJTIiwiaWRlbnRpdHkiLCJkIiwiT1ZFUkxBWV9UWVBFIiwiZGVja2dsIiwibWFwYm94Z2wiLCJsYXllckNvbG9ycyIsIk9iamVjdCIsInZhbHVlcyIsIkRhdGFWaXpDb2xvcnMiLCJtYXAiLCJoZXhUb1JnYiIsImluZGV4IiwibGVuZ3RoIiwiY29sb3JNYWtlciIsImRlZmF1bHRHZXRGaWVsZFZhbHVlIiwiZmllbGQiLCJ0YWJsZUZpZWxkSW5kZXgiLCJMYXllciIsInByb3BzIiwiaWQiLCJtZXRhIiwidmlzQ29uZmlnU2V0dGluZ3MiLCJjb25maWciLCJnZXREZWZhdWx0TGF5ZXJDb25maWciLCJjb2x1bW5zIiwiZ2V0TGF5ZXJDb2x1bW5zIiwiZGF0YUlkIiwibGFiZWwiLCJjb2xvciIsIm5leHQiLCJ2YWx1ZSIsImlzVmlzaWJsZSIsImlzQ29uZmlnQWN0aXZlIiwiaGlnaGxpZ2h0Q29sb3IiLCJoaWRkZW4iLCJjb2xvckZpZWxkIiwiY29sb3JEb21haW4iLCJjb2xvclNjYWxlIiwiU0NBTEVfVFlQRVMiLCJxdWFudGlsZSIsInNpemVEb21haW4iLCJzaXplU2NhbGUiLCJsaW5lYXIiLCJzaXplRmllbGQiLCJ2aXNDb25maWciLCJ0ZXh0TGFiZWwiLCJERUZBVUxUX1RFWFRfTEFCRUwiLCJjb2xvclVJIiwiREVGQVVMVF9DT0xPUl9VSSIsImNvbG9yUmFuZ2UiLCJhbmltYXRpb24iLCJlbmFibGVkIiwia2V5IiwidmlzdWFsQ2hhbm5lbHMiLCJyYW5nZSIsIm1lYXN1cmUiLCJuYW1lIiwiZGVmYXVsdE1lYXN1cmUiLCJ1cGRhdGUiLCJmaWVsZElkeCIsInBhaXIiLCJjb2x1bW5QYWlycyIsInBhcnRuZXJLZXkiLCJmaWVsZFBhaXJLZXkiLCJwYXJ0bmVyRmllbGRQYWlyS2V5Iiwiem9vbSIsInpvb21PZmZzZXQiLCJNYXRoIiwicG93IiwibWF4IiwiZGF0YXNldHMiLCJmaWx0ZXJlZEluZGV4Iiwib2JqZWN0IiwiZGF0YSIsImNvbmZpZ1RvQ29weSIsInNoYWxsb3dDb3B5IiwiY29uY2F0IiwidiIsIm5vdFRvQ29weSIsImRvbWFpbiIsImZvckVhY2giLCJncm91cCIsInB1c2giLCJjdXJyZW50Q29uZmlnIiwiY29waWVkIiwiY29weUxheWVyQ29uZmlnIiwidXBkYXRlTGF5ZXJDb25maWciLCJrZXlzIiwiY2hhbm5lbCIsInZhbGlkYXRlVmlzdWFsQ2hhbm5lbCIsImluY2x1ZGVzIiwibGF5ZXJWaXNDb25maWdzIiwiaXRlbSIsIkxBWUVSX1ZJU19DT05GSUdTIiwiZGVmYXVsdFZhbHVlIiwiZXZlcnkiLCJwIiwiaGFzT3duUHJvcGVydHkiLCJyZXF1aXJlZCIsInJlcXVpcmVkTGF5ZXJDb2x1bW5zIiwicmVkdWNlIiwiYWNjdSIsIm9wdGlvbmFsIiwib3B0aW9uYWxDb2x1bW5zIiwibmV3Q29uZmlnIiwibmV3VmlzQ29uZmlnIiwicHJvcCIsInByZXZpb3VzIiwiY29sb3JVSVByb3AiLCJlbnRyaWVzIiwiaXNDb2xvclJhbmdlIiwiY29sb3JzIiwidXBkYXRlQ29sb3JVSUJ5Q29sb3JSYW5nZSIsInVwZGF0ZUNvbG9yUmFuZ2VCeUNvbG9yVUkiLCJ1cGRhdGVDdXN0b21QYWxldHRlIiwiY29sb3JSYW5nZUNvbmZpZyIsImN1c3RvbSIsImN1c3RvbVBhbGV0dGUiLCJzaG93RHJvcGRvd24iLCJzdGVwcyIsInJldmVyc2VkIiwiQm9vbGVhbiIsInNob3VsZFVwZGF0ZSIsInNvbWUiLCJzYW1lR3JvdXAiLCJDT0xPUl9SQU5HRVMiLCJmaWx0ZXIiLCJjciIsImZpbmQiLCJ1cGRhdGVMYXllclZpc0NvbmZpZyIsImxheWVyRGF0YSIsInR5cGUiLCJoYXNBbGxDb2x1bW5zIiwiaGFzTGF5ZXJEYXRhIiwicmVuZGVyTGF5ZXIiLCJzY2FsZSIsImZpeGVkIiwiU0NBTEVfRlVOQyIsImFsbERhdGEiLCJnZXRQb3NpdGlvbiIsInNhbXBsZURhdGEiLCJwb2ludHMiLCJsYXRCb3VuZHMiLCJsbmdCb3VuZHMiLCJkYXRhVXBkYXRlVHJpZ2dlcnMiLCJ0cmlnZ2VyQ2hhbmdlZCIsIl9vbGREYXRhVXBkYXRlVHJpZ2dlcnMiLCJudWxsVmFsdWUiLCJOT19WQUxVRV9DT0xPUiIsImdldFZhbHVlIiwiYXR0cmlidXRlVmFsdWUiLCJBTExfRklFTERfVFlQRVMiLCJ0aW1lc3RhbXAiLCJEYXRlIiwiZ2V0RGF0YSIsImRhdGFzZXRJZCIsImdldE1ldGEiLCJ0bCIsImkiLCJvbGRMYXllckRhdGEiLCJsYXllckRhdGFzZXQiLCJnZXRQb3NpdGlvbkFjY2Vzc29yIiwiZ2V0RGF0YVVwZGF0ZVRyaWdnZXJzIiwiZ2V0Q2hhbmdlZFRyaWdnZXJzIiwidXBkYXRlTGF5ZXJNZXRhIiwiY2FsY3VsYXRlRGF0YUF0dHJpYnV0ZSIsIm5ld0ZpbHRlciIsImRhdGFzZXQiLCJnZXREYXRhc2V0Iiwic2NhbGVUeXBlIiwib3JkaW5hbCIsInVwZGF0ZWREb21haW4iLCJjYWxjdWxhdGVMYXllckRvbWFpbiIsInZhbGlkYXRlRmllbGRUeXBlIiwidmFsaWRhdGVTY2FsZSIsInZpc3VhbENoYW5uZWwiLCJjaGFubmVsU2NhbGVUeXBlIiwic3VwcG9ydGVkRmllbGRUeXBlcyIsImNoYW5uZWxTdXBwb3J0ZWRGaWVsZFR5cGVzIiwiQ0hBTk5FTF9TQ0FMRV9TVVBQT1JURURfRklFTERTIiwic2NhbGVPcHRpb25zIiwiZ2V0U2NhbGVPcHRpb25zIiwiRklFTERfT1BUUyIsImZpbHRlcmVkSW5kZXhGb3JEb21haW4iLCJkZWZhdWx0RG9tYWluIiwiQ29uc29sZSIsImVycm9yIiwiaXNUaW1lIiwidmFsdWVBY2Nlc3NvciIsIm1heWJlVG9EYXRlIiwiYmluZCIsImZvcm1hdCIsImluZGV4VmFsdWVBY2Nlc3NvciIsInNvcnRGdW5jdGlvbiIsInBvaW50IiwibG9nIiwicXVhbnRpemUiLCJzcXJ0Iiwib2JqZWN0SW5mbyIsImxheWVyIiwicGlja2VkIiwibWFwU3RhdGUiLCJmaXhlZFJhZGl1cyIsInJhZGl1c0NoYW5uZWwiLCJ2YyIsInByb3BlcnR5IiwidW5kZWZpbmVkIiwicmFkaXVzIiwiZ2V0Wm9vbUZhY3RvciIsIm5vbmVMYXllckRhdGFBZmZlY3RpbmdQcm9wcyIsImludGVyYWN0aW9uQ29uZmlnIiwiYnJ1c2hpbmdUYXJnZXQiLCJicnVzaCIsImF1dG9IaWdobGlnaHQiLCJicnVzaGluZ1JhZGl1cyIsInNpemUiLCJicnVzaGluZ0VuYWJsZWQiLCJpZHgiLCJncHVGaWx0ZXIiLCJjb29yZGluYXRlU3lzdGVtIiwiQ09PUkRJTkFURV9TWVNURU0iLCJMTkdMQVQiLCJwaWNrYWJsZSIsIndyYXBMb25naXR1ZGUiLCJwYXJhbWV0ZXJzIiwiZGVwdGhUZXN0IiwiZHJhZ1JvdGF0ZSIsImVuYWJsZTNkIiwib3BhY2l0eSIsImV4dGVuc2lvbnMiLCJmaWx0ZXJSYW5nZSIsInJlbmRlck9wdHMiLCJnZXRQaXhlbE9mZnNldCIsInVwZGF0ZVRyaWdnZXJzIiwic2hhcmVkUHJvcHMiLCJ0ZXh0TGFiZWxzIiwiZ2V0VGV4dCIsIlRleHRMYXllciIsImNoYXJhY3RlclNldCIsImdldFNpemUiLCJnZXRUZXh0QW5jaG9yIiwiYW5jaG9yIiwiZ2V0QWxpZ25tZW50QmFzZWxpbmUiLCJhbGlnbm1lbnQiLCJnZXRDb2xvciIsImdldEZpbHRlclZhbHVlIiwiZ2V0UmFkaXVzIiwiRGVmYXVsdExheWVySWNvbiIsIkNIQU5ORUxfU0NBTEVTIiwibGF0IiwibG5nIiwibGF0MCIsImxuZzAiLCJsYXQxIiwibG5nMSIsImZvdW5kTGF5ZXJzIiwiZGVmYXVsdEZpZWxkcyIsImFsbEZpZWxkcyIsInJlcXVpcmVkQ29sdW1ucyIsInByZXYiLCJyZXF1aXJlZEZpZWxkcyIsImYiLCJnZXRBbGxQb3NzaWJsZUNvbHVtblBhcmlzIiwiYWxsS2V5cyIsInBvaW50ZXJzIiwiayIsImNvdW50UGVyS2V5IiwicGFpcnMiLCJpbmNyZW1lbnRQb2ludGVycyIsIm5ld1BhaXIiLCJjdXVyIiwicHRzIiwiY291bnRzIiwiYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUVBOztBQVVBOztBQUNBOztBQUNBOztBQUVBOztBQUVBOztBQVFBOztBQU1BOzs7Ozs7Ozs2QkFnQlVBLGE7O0FBZFY7Ozs7QUFJQSxJQUFNQyxlQUFlLEdBQUcsSUFBeEI7QUFDQSxJQUFNQyxtQkFBbUIsR0FBRyxJQUFJQywrQkFBSixDQUF3QjtBQUFDQyxFQUFBQSxVQUFVLEVBQUVDO0FBQWIsQ0FBeEIsQ0FBNUI7O0FBQ0EsSUFBTUMsUUFBUSxHQUFHLFNBQVhBLFFBQVcsQ0FBQUMsQ0FBQztBQUFBLFNBQUlBLENBQUo7QUFBQSxDQUFsQjs7QUFFTyxJQUFNQyxZQUFZLEdBQUcsMkJBQVU7QUFDcENDLEVBQUFBLE1BQU0sRUFBRSxJQUQ0QjtBQUVwQ0MsRUFBQUEsUUFBUSxFQUFFO0FBRjBCLENBQVYsQ0FBckI7O0FBS0EsSUFBTUMsV0FBVyxHQUFHQyxNQUFNLENBQUNDLE1BQVAsQ0FBY0MsZ0NBQWQsRUFBNkJDLEdBQTdCLENBQWlDQyxvQkFBakMsQ0FBcEI7OztBQUNQLFNBQVVoQixhQUFWO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNNaUIsVUFBQUEsS0FETixHQUNjLENBRGQ7O0FBQUE7QUFBQSxnQkFFU0EsS0FBSyxHQUFHTixXQUFXLENBQUNPLE1BQVosR0FBcUIsQ0FGdEM7QUFBQTtBQUFBO0FBQUE7O0FBR0ksY0FBSUQsS0FBSyxLQUFLTixXQUFXLENBQUNPLE1BQTFCLEVBQWtDO0FBQ2hDRCxZQUFBQSxLQUFLLEdBQUcsQ0FBUjtBQUNEOztBQUxMO0FBTUksaUJBQU1OLFdBQVcsQ0FBQ00sS0FBSyxFQUFOLENBQWpCOztBQU5KO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFB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QUFJRCxHQUFHLENBQUNwUSxLQUFELENBQUgsR0FBYSxDQUFiLEdBQWlCcVEsTUFBTSxDQUFDclEsS0FBRCxDQUEzQixFQUFvQztBQUNsQ29RLFVBQUFBLEdBQUcsQ0FBQ3BRLEtBQUQsQ0FBSCxHQUFhb1EsR0FBRyxDQUFDcFEsS0FBRCxDQUFILEdBQWEsQ0FBMUI7QUFDQSxpQkFBTyxJQUFQO0FBQ0Q7O0FBRURvUSxRQUFBQSxHQUFHLENBQUNwUSxLQUFELENBQUgsR0FBYSxDQUFiO0FBQ0EsZUFBT2lRLGlCQUFpQixDQUFDRyxHQUFELEVBQU1DLE1BQU4sRUFBY3JRLEtBQUssR0FBRyxDQUF0QixDQUF4QjtBQUNEOztBQUVELGFBQU9nUSxLQUFQO0FBQ0Q7Ozs2QkFFZU0sQyxFQUFHO0FBQ2pCLGFBQU8sMEJBQVNBLENBQVQsQ0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtjb25zb2xlIGFzIENvbnNvbGV9IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuaW1wb3J0IGtleW1pcnJvciBmcm9tICdrZXltaXJyb3InO1xuaW1wb3J0IHtEYXRhRmlsdGVyRXh0ZW5zaW9ufSBmcm9tICdAZGVjay5nbC9leHRlbnNpb25zJztcbmltcG9ydCB7Q09PUkRJTkFURV9TWVNURU19IGZyb20gJ0BkZWNrLmdsL2NvcmUnO1xuaW1wb3J0IHtUZXh0TGF5ZXJ9IGZyb20gJ0BkZWNrLmdsL2xheWVycyc7XG5cbmltcG9ydCBEZWZhdWx0TGF5ZXJJY29uIGZyb20gJy4vZGVmYXVsdC1sYXllci1pY29uJztcbmltcG9ydCB7ZGlmZlVwZGF0ZVRyaWdnZXJzfSBmcm9tICcuL2xheWVyLXVwZGF0ZSc7XG5cbmltcG9ydCB7XG4gIEFMTF9GSUVMRF9UWVBFUyxcbiAgTk9fVkFMVUVfQ09MT1IsXG4gIFNDQUxFX1RZUEVTLFxuICBDSEFOTkVMX1NDQUxFUyxcbiAgRklFTERfT1BUUyxcbiAgU0NBTEVfRlVOQyxcbiAgQ0hBTk5FTF9TQ0FMRV9TVVBQT1JURURfRklFTERTLFxuICBNQVhfR1BVX0ZJTFRFUlNcbn0gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHtDT0xPUl9SQU5HRVN9IGZyb20gJ2NvbnN0YW50cy9jb2xvci1yYW5nZXMnO1xuaW1wb3J0IHtEYXRhVml6Q29sb3JzfSBmcm9tICdjb25zdGFudHMvY3VzdG9tLWNvbG9yLXJhbmdlcyc7XG5pbXBvcnQge0xBWUVSX1ZJU19DT05GSUdTLCBERUZBVUxUX1RFWFRfTEFCRUwsIERFRkFVTFRfQ09MT1JfVUl9IGZyb20gJy4vbGF5ZXItZmFjdG9yeSc7XG5cbmltcG9ydCB7Z2VuZXJhdGVIYXNoSWQsIGlzUGxhaW5PYmplY3R9IGZyb20gJ3V0aWxzL3V0aWxzJztcblxuaW1wb3J0IHtcbiAgZ2V0U2FtcGxlRGF0YSxcbiAgZ2V0TGF0TG5nQm91bmRzLFxuICBtYXliZVRvRGF0ZSxcbiAgZ2V0U29ydGluZ0Z1bmN0aW9uLFxuICBub3ROdWxsb3JVbmRlZmluZWRcbn0gZnJvbSAndXRpbHMvZGF0YS11dGlscyc7XG5cbmltcG9ydCB7XG4gIGdldFF1YW50aWxlRG9tYWluLFxuICBnZXRPcmRpbmFsRG9tYWluLFxuICBnZXRMb2dEb21haW4sXG4gIGdldExpbmVhckRvbWFpblxufSBmcm9tICd1dGlscy9kYXRhLXNjYWxlLXV0aWxzJztcbmltcG9ydCB7aGV4VG9SZ2IsIGdldENvbG9yR3JvdXBCeU5hbWUsIHJldmVyc2VDb2xvclJhbmdlfSBmcm9tICd1dGlscy9jb2xvci11dGlscyc7XG5cbi8qKlxuICogQXBwcm94LiBudW1iZXIgb2YgcG9pbnRzIHRvIHNhbXBsZSBpbiBhIGxhcmdlIGRhdGEgc2V0XG4gKiBAdHlwZSB7bnVtYmVyfVxuICovXG5jb25zdCBNQVhfU0FNUExFX1NJWkUgPSA1MDAwO1xuY29uc3QgZGF0YUZpbHRlckV4dGVuc2lvbiA9IG5ldyBEYXRhRmlsdGVyRXh0ZW5zaW9uKHtmaWx0ZXJTaXplOiBNQVhfR1BVX0ZJTFRFUlN9KTtcbmNvbnN0IGlkZW50aXR5ID0gZCA9PiBkO1xuXG5leHBvcnQgY29uc3QgT1ZFUkxBWV9UWVBFID0ga2V5bWlycm9yKHtcbiAgZGVja2dsOiBudWxsLFxuICBtYXBib3hnbDogbnVsbFxufSk7XG5cbmV4cG9ydCBjb25zdCBsYXllckNvbG9ycyA9IE9iamVjdC52YWx1ZXMoRGF0YVZpekNvbG9ycykubWFwKGhleFRvUmdiKTtcbmZ1bmN0aW9uKiBnZW5lcmF0ZUNvbG9yKCkge1xuICBsZXQgaW5kZXggPSAwO1xuICB3aGlsZSAoaW5kZXggPCBsYXllckNvbG9ycy5sZW5ndGggKyAxKSB7XG4gICAgaWYgKGluZGV4ID09PSBsYXllckNvbG9ycy5sZW5ndGgpIHtcbiAgICAgIGluZGV4ID0gMDtcbiAgICB9XG4gICAgeWllbGQgbGF5ZXJDb2xvcnNbaW5kZXgrK107XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGNvbG9yTWFrZXIgPSBnZW5lcmF0ZUNvbG9yKCk7XG5jb25zdCBkZWZhdWx0R2V0RmllbGRWYWx1ZSA9IChmaWVsZCwgZCkgPT4gZFtmaWVsZC50YWJsZUZpZWxkSW5kZXggLSAxXTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGF5ZXIge1xuICBjb25zdHJ1Y3Rvcihwcm9wcyA9IHt9KSB7XG4gICAgdGhpcy5pZCA9IHByb3BzLmlkIHx8IGdlbmVyYXRlSGFzaElkKDYpO1xuXG4gICAgLy8gbWV0YVxuICAgIHRoaXMubWV0YSA9IHt9O1xuXG4gICAgLy8gdmlzQ29uZmlnU2V0dGluZ3NcbiAgICB0aGlzLnZpc0NvbmZpZ1NldHRpbmdzID0ge307XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMuZ2V0RGVmYXVsdExheWVyQ29uZmlnKHtcbiAgICAgIGNvbHVtbnM6IHRoaXMuZ2V0TGF5ZXJDb2x1bW5zKCksXG4gICAgICAuLi5wcm9wc1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IGxheWVySWNvbigpIHtcbiAgICByZXR1cm4gRGVmYXVsdExheWVySWNvbjtcbiAgfVxuXG4gIGdldCBvdmVybGF5VHlwZSgpIHtcbiAgICByZXR1cm4gT1ZFUkxBWV9UWVBFLmRlY2tnbDtcbiAgfVxuXG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZ2V0IG5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMudHlwZTtcbiAgfVxuXG4gIGdldCBpc0FnZ3JlZ2F0ZWQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0IHJlcXVpcmVkTGF5ZXJDb2x1bW5zKCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGdldCBvcHRpb25hbENvbHVtbnMoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgZ2V0IG5vbmVMYXllckRhdGFBZmZlY3RpbmdQcm9wcygpIHtcbiAgICByZXR1cm4gWydsYWJlbCcsICdvcGFjaXR5JywgJ3RoaWNrbmVzcycsICdpc1Zpc2libGUnLCAnaGlkZGVuJ107XG4gIH1cblxuICBnZXQgdmlzdWFsQ2hhbm5lbHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbG9yOiB7XG4gICAgICAgIHByb3BlcnR5OiAnY29sb3InLFxuICAgICAgICBmaWVsZDogJ2NvbG9yRmllbGQnLFxuICAgICAgICBzY2FsZTogJ2NvbG9yU2NhbGUnLFxuICAgICAgICBkb21haW46ICdjb2xvckRvbWFpbicsXG4gICAgICAgIHJhbmdlOiAnY29sb3JSYW5nZScsXG4gICAgICAgIGtleTogJ2NvbG9yJyxcbiAgICAgICAgY2hhbm5lbFNjYWxlVHlwZTogQ0hBTk5FTF9TQ0FMRVMuY29sb3JcbiAgICAgIH0sXG4gICAgICBzaXplOiB7XG4gICAgICAgIHByb3BlcnR5OiAnc2l6ZScsXG4gICAgICAgIGZpZWxkOiAnc2l6ZUZpZWxkJyxcbiAgICAgICAgc2NhbGU6ICdzaXplU2NhbGUnLFxuICAgICAgICBkb21haW46ICdzaXplRG9tYWluJyxcbiAgICAgICAgcmFuZ2U6ICdzaXplUmFuZ2UnLFxuICAgICAgICBrZXk6ICdzaXplJyxcbiAgICAgICAgY2hhbm5lbFNjYWxlVHlwZTogQ0hBTk5FTF9TQ0FMRVMuc2l6ZVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKlxuICAgKiBDb2x1bW4gcGFpcnMgbWFwcyBsYXllciBjb2x1bW4gdG8gYSBzcGVjaWZpYyBmaWVsZCBwYWlycyxcbiAgICogQnkgZGVmYXVsdCwgaXQgaXMgc2V0IHRvIG51bGxcbiAgICovXG4gIGdldCBjb2x1bW5QYWlycygpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qXG4gICAqIERlZmF1bHQgcG9pbnQgY29sdW1uIHBhaXJzLCBjYW4gYmUgdXNlZCBmb3IgcG9pbnQgYmFzZWQgbGF5ZXJzOiBwb2ludCwgaWNvbiBldGMuXG4gICAqL1xuICBnZXQgZGVmYXVsdFBvaW50Q29sdW1uUGFpcnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhdDoge3BhaXI6ICdsbmcnLCBmaWVsZFBhaXJLZXk6ICdsYXQnfSxcbiAgICAgIGxuZzoge3BhaXI6ICdsYXQnLCBmaWVsZFBhaXJLZXk6ICdsbmcnfVxuICAgIH07XG4gIH1cblxuICAvKlxuICAgKiBEZWZhdWx0IGxpbmsgY29sdW1uIHBhaXJzLCBjYW4gYmUgdXNlZCBmb3IgbGluayBiYXNlZCBsYXllcnM6IGFyYywgbGluZSBldGNcbiAgICovXG4gIGdldCBkZWZhdWx0TGlua0NvbHVtblBhaXJzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBsYXQwOiB7cGFpcjogJ2xuZzAnLCBmaWVsZFBhaXJLZXk6ICdsYXQnfSxcbiAgICAgIGxuZzA6IHtwYWlyOiAnbGF0MCcsIGZpZWxkUGFpcktleTogJ2xuZyd9LFxuICAgICAgbGF0MToge3BhaXI6ICdsbmcxJywgZmllbGRQYWlyS2V5OiAnbGF0J30sXG4gICAgICBsbmcxOiB7cGFpcjogJ2xhdDEnLCBmaWVsZFBhaXJLZXk6ICdsbmcnfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGEgUmVhY3QgY29tcG9uZW50IGZvciB0byByZW5kZXIgbGF5ZXIgaW5zdHJ1Y3Rpb25zIGluIGEgbW9kYWxcbiAgICogQHJldHVybnMge29iamVjdH0gLSBhbiBvYmplY3RcbiAgICogQGV4YW1wbGVcbiAgICogIHJldHVybiB7XG4gICAqICAgIGlkOiAnaWNvbkluZm8nLFxuICAgKiAgICB0ZW1wbGF0ZTogSWNvbkluZm9Nb2RhbCxcbiAgICogICAgbW9kYWxQcm9wczoge1xuICAgKiAgICAgIHRpdGxlOiAnSG93IHRvIGRyYXcgaWNvbnMnXG4gICAqICAgfTtcbiAgICogfVxuICAgKi9cbiAgZ2V0IGxheWVySW5mb01vZGFsKCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIC8qXG4gICAqIEdpdmVuIGEgZGF0YXNldCwgYXV0b21hdGljYWxseSBmaW5kIHByb3BzIHRvIGNyZWF0ZSBsYXllciBiYXNlZCBvbiBpdFxuICAgKiBhbmQgcmV0dXJuIHRoZSBwcm9wcyBhbmQgcHJldmlvdXMgZm91bmQgbGF5ZXJzLlxuICAgKiBCeSBkZWZhdWx0LCBubyBsYXllcnMgd2lsbCBiZSBmb3VuZFxuICAgKi9cbiAgc3RhdGljIGZpbmREZWZhdWx0TGF5ZXJQcm9wcyhkYXRhc2V0LCBmb3VuZExheWVycykge1xuICAgIHJldHVybiB7cHJvcHM6IFtdLCBmb3VuZExheWVyc307XG4gIH1cblxuICAvKipcbiAgICogR2l2ZW4gYSBhcnJheSBvZiBwcmVzZXQgcmVxdWlyZWQgY29sdW1uIG5hbWVzXG4gICAqIGZvdW5kIGZpZWxkIHRoYXQgaGFzIHRoZSBzYW1lIG5hbWUgdG8gc2V0IGFzIGxheWVyIGNvbHVtblxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gZGVmYXVsdEZpZWxkc1xuICAgKiBAcGFyYW0ge29iamVjdFtdfSBhbGxGaWVsZHNcbiAgICogQHJldHVybnMge29iamVjdFtdIHwgbnVsbH0gYWxsIHBvc3NpYmxlIHJlcXVpcmVkIGxheWVyIGNvbHVtbiBwYWlyc1xuICAgKi9cbiAgc3RhdGljIGZpbmREZWZhdWx0Q29sdW1uRmllbGQoZGVmYXVsdEZpZWxkcywgYWxsRmllbGRzKSB7XG4gICAgLy8gZmluZCBhbGwgbWF0Y2hlZCBmaWVsZHMgZm9yIGVhY2ggcmVxdWlyZWQgY29sXG4gICAgY29uc3QgcmVxdWlyZWRDb2x1bW5zID0gT2JqZWN0LmtleXMoZGVmYXVsdEZpZWxkcykucmVkdWNlKChwcmV2LCBrZXkpID0+IHtcbiAgICAgIGNvbnN0IHJlcXVpcmVkRmllbGRzID0gYWxsRmllbGRzLmZpbHRlcihcbiAgICAgICAgZiA9PiBmLm5hbWUgPT09IGRlZmF1bHRGaWVsZHNba2V5XSB8fCBkZWZhdWx0RmllbGRzW2tleV0uaW5jbHVkZXMoZi5uYW1lKVxuICAgICAgKTtcblxuICAgICAgcHJldltrZXldID0gcmVxdWlyZWRGaWVsZHMubGVuZ3RoXG4gICAgICAgID8gcmVxdWlyZWRGaWVsZHMubWFwKGYgPT4gKHtcbiAgICAgICAgICAgIHZhbHVlOiBmLm5hbWUsXG4gICAgICAgICAgICBmaWVsZElkeDogZi50YWJsZUZpZWxkSW5kZXggLSAxXG4gICAgICAgICAgfSkpXG4gICAgICAgIDogbnVsbDtcbiAgICAgIHJldHVybiBwcmV2O1xuICAgIH0sIHt9KTtcblxuICAgIGlmICghT2JqZWN0LnZhbHVlcyhyZXF1aXJlZENvbHVtbnMpLmV2ZXJ5KEJvb2xlYW4pKSB7XG4gICAgICAvLyBpZiBhbnkgZmllbGQgbWlzc2luZywgcmV0dXJuIG51bGxcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmdldEFsbFBvc3NpYmxlQ29sdW1uUGFyaXMocmVxdWlyZWRDb2x1bW5zKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRBbGxQb3NzaWJsZUNvbHVtblBhcmlzKHJlcXVpcmVkQ29sdW1ucykge1xuICAgIC8vIGZvciBtdWx0aXBsZSBtYXRjaGVkIGZpZWxkIGZvciBvbmUgcmVxdWlyZWQgY29sdW1uLCByZXR1cm4gbXVsdGlwbGVcbiAgICAvLyBjb21iaW5hdGlvbnMsIGUuIGcuIGlmIGNvbHVtbiBhIGhhcyAyIG1hdGNoZWQsIGNvbHVtbiBiIGhhcyAzIG1hdGNoZWRcbiAgICAvLyA2IHBvc3NpYmxlIGNvbHVtbiBwYWlycyB3aWxsIGJlIHJldHVybmVkXG4gICAgY29uc3QgYWxsS2V5cyA9IE9iamVjdC5rZXlzKHJlcXVpcmVkQ29sdW1ucyk7XG4gICAgY29uc3QgcG9pbnRlcnMgPSBhbGxLZXlzLm1hcCgoaywgaSkgPT4gKGkgPT09IGFsbEtleXMubGVuZ3RoIC0gMSA/IC0xIDogMCkpO1xuICAgIGNvbnN0IGNvdW50UGVyS2V5ID0gYWxsS2V5cy5tYXAoayA9PiByZXF1aXJlZENvbHVtbnNba10ubGVuZ3RoKTtcbiAgICBjb25zdCBwYWlycyA9IFtdO1xuXG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8tbG9vcC1mdW5jICovXG4gICAgd2hpbGUgKGluY3JlbWVudFBvaW50ZXJzKHBvaW50ZXJzLCBjb3VudFBlcktleSwgcG9pbnRlcnMubGVuZ3RoIC0gMSkpIHtcbiAgICAgIGNvbnN0IG5ld1BhaXIgPSBwb2ludGVycy5yZWR1Y2UoKHByZXYsIGN1dXIsIGkpID0+IHtcbiAgICAgICAgcHJldlthbGxLZXlzW2ldXSA9IHJlcXVpcmVkQ29sdW1uc1thbGxLZXlzW2ldXVtjdXVyXTtcbiAgICAgICAgcmV0dXJuIHByZXY7XG4gICAgICB9LCB7fSk7XG5cbiAgICAgIHBhaXJzLnB1c2gobmV3UGFpcik7XG4gICAgfVxuICAgIC8qIGVzbGludC1lbmFibGUgbm8tbG9vcC1mdW5jICovXG5cbiAgICAvLyByZWN1cnNpdmVseSBpbmNyZW1lbnQgcG9pbnRlcnNcbiAgICBmdW5jdGlvbiBpbmNyZW1lbnRQb2ludGVycyhwdHMsIGNvdW50cywgaW5kZXgpIHtcbiAgICAgIGlmIChpbmRleCA9PT0gMCAmJiBwdHNbMF0gPT09IGNvdW50c1swXSAtIDEpIHtcbiAgICAgICAgLy8gbm90aGluZyB0byBpbmNyZW1lbnRcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAocHRzW2luZGV4XSArIDEgPCBjb3VudHNbaW5kZXhdKSB7XG4gICAgICAgIHB0c1tpbmRleF0gPSBwdHNbaW5kZXhdICsgMTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIHB0c1tpbmRleF0gPSAwO1xuICAgICAgcmV0dXJuIGluY3JlbWVudFBvaW50ZXJzKHB0cywgY291bnRzLCBpbmRleCAtIDEpO1xuICAgIH1cblxuICAgIHJldHVybiBwYWlycztcbiAgfVxuXG4gIHN0YXRpYyBoZXhUb1JnYihjKSB7XG4gICAgcmV0dXJuIGhleFRvUmdiKGMpO1xuICB9XG5cbiAgZ2V0RGVmYXVsdExheWVyQ29uZmlnKHByb3BzID0ge30pIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGF0YUlkOiBwcm9wcy5kYXRhSWQgfHwgbnVsbCxcbiAgICAgIGxhYmVsOiBwcm9wcy5sYWJlbCB8fCAnbmV3IGxheWVyJyxcbiAgICAgIGNvbG9yOiBwcm9wcy5jb2xvciB8fCBjb2xvck1ha2VyLm5leHQoKS52YWx1ZSxcbiAgICAgIGNvbHVtbnM6IHByb3BzLmNvbHVtbnMgfHwgbnVsbCxcbiAgICAgIGlzVmlzaWJsZTogcHJvcHMuaXNWaXNpYmxlIHx8IGZhbHNlLFxuICAgICAgaXNDb25maWdBY3RpdmU6IHByb3BzLmlzQ29uZmlnQWN0aXZlIHx8IGZhbHNlLFxuICAgICAgaGlnaGxpZ2h0Q29sb3I6IHByb3BzLmhpZ2hsaWdodENvbG9yIHx8IFsyNTIsIDI0MiwgMjYsIDI1NV0sXG4gICAgICBoaWRkZW46IHByb3BzLmhpZGRlbiB8fCBmYWxzZSxcblxuICAgICAgLy8gVE9ETzogcmVmYWN0b3IgdGhpcyBpbnRvIHNlcGFyYXRlIHZpc3VhbCBDaGFubmVsIGNvbmZpZ1xuICAgICAgLy8gY29sb3IgYnkgZmllbGQsIGRvbWFpbiBpcyBzZXQgYnkgZmlsdGVycywgZmllbGQsIHNjYWxlIHR5cGVcbiAgICAgIGNvbG9yRmllbGQ6IG51bGwsXG4gICAgICBjb2xvckRvbWFpbjogWzAsIDFdLFxuICAgICAgY29sb3JTY2FsZTogU0NBTEVfVFlQRVMucXVhbnRpbGUsXG5cbiAgICAgIC8vIGNvbG9yIGJ5IHNpemUsIGRvbWFpbiBpcyBzZXQgYnkgZmlsdGVycywgZmllbGQsIHNjYWxlIHR5cGVcbiAgICAgIHNpemVEb21haW46IFswLCAxXSxcbiAgICAgIHNpemVTY2FsZTogU0NBTEVfVFlQRVMubGluZWFyLFxuICAgICAgc2l6ZUZpZWxkOiBudWxsLFxuXG4gICAgICB2aXNDb25maWc6IHt9LFxuXG4gICAgICB0ZXh0TGFiZWw6IFtERUZBVUxUX1RFWFRfTEFCRUxdLFxuXG4gICAgICBjb2xvclVJOiB7XG4gICAgICAgIGNvbG9yOiBERUZBVUxUX0NPTE9SX1VJLFxuICAgICAgICBjb2xvclJhbmdlOiBERUZBVUxUX0NPTE9SX1VJXG4gICAgICB9LFxuICAgICAgYW5pbWF0aW9uOiB7ZW5hYmxlZDogZmFsc2V9XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGRlc2NyaXB0aW9uIG9mIGEgdmlzdWFsQ2hhbm5lbCBjb25maWdcbiAgICogQHBhcmFtIGtleVxuICAgKiBAcmV0dXJucyB7e2xhYmVsOiBzdHJpbmcsIG1lYXN1cmU6IChzdHJpbmd8c3RyaW5nKX19XG4gICAqL1xuICBnZXRWaXN1YWxDaGFubmVsRGVzY3JpcHRpb24oa2V5KSB7XG4gICAgLy8gZS5nLiBsYWJlbDogQ29sb3IsIG1lYXN1cmU6IFZlaGljbGUgVHlwZVxuICAgIHJldHVybiB7XG4gICAgICBsYWJlbDogdGhpcy52aXNDb25maWdTZXR0aW5nc1t0aGlzLnZpc3VhbENoYW5uZWxzW2tleV0ucmFuZ2VdLmxhYmVsLFxuICAgICAgbWVhc3VyZTogdGhpcy5jb25maWdbdGhpcy52aXN1YWxDaGFubmVsc1trZXldLmZpZWxkXVxuICAgICAgICA/IHRoaXMuY29uZmlnW3RoaXMudmlzdWFsQ2hhbm5lbHNba2V5XS5maWVsZF0ubmFtZVxuICAgICAgICA6IHRoaXMudmlzdWFsQ2hhbm5lbHNba2V5XS5kZWZhdWx0TWVhc3VyZVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQXNzaWduIGEgZmllbGQgdG8gbGF5ZXIgY29sdW1uLCByZXR1cm4gY29sdW1uIGNvbmZpZ1xuICAgKiBAcGFyYW0ga2V5IC0gQ29sdW1uIEtleVxuICAgKiBAcGFyYW0gZmllbGQgLSBTZWxlY3RlZCBmaWVsZFxuICAgKiBAcmV0dXJucyB7e319IC0gQ29sdW1uIGNvbmZpZ1xuICAgKi9cbiAgYXNzaWduQ29sdW1uKGtleSwgZmllbGQpIHtcbiAgICAvLyBmaWVsZCB2YWx1ZSBjb3VsZCBiZSBudWxsIGZvciBvcHRpb25hbCBjb2x1bW5zXG4gICAgY29uc3QgdXBkYXRlID0gZmllbGRcbiAgICAgID8ge1xuICAgICAgICAgIHZhbHVlOiBmaWVsZC5uYW1lLFxuICAgICAgICAgIGZpZWxkSWR4OiBmaWVsZC50YWJsZUZpZWxkSW5kZXggLSAxXG4gICAgICAgIH1cbiAgICAgIDoge3ZhbHVlOiBudWxsLCBmaWVsZElkeDogLTF9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnRoaXMuY29uZmlnLmNvbHVtbnMsXG4gICAgICBba2V5XToge1xuICAgICAgICAuLi50aGlzLmNvbmZpZy5jb2x1bW5zW2tleV0sXG4gICAgICAgIC4uLnVwZGF0ZVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQXNzaWduIGEgZmllbGQgcGFpciB0byBjb2x1bW4gY29uZmlnLCByZXR1cm4gY29sdW1uIGNvbmZpZ1xuICAgKiBAcGFyYW0ga2V5IC0gQ29sdW1uIEtleVxuICAgKiBAcGFyYW0gcGFpciAtIGZpZWxkIFBhaXJcbiAgICogQHJldHVybnMge3t9fSAtIENvbHVtbiBjb25maWdcbiAgICovXG4gIGFzc2lnbkNvbHVtblBhaXJzKGtleSwgcGFpcikge1xuICAgIGlmICghdGhpcy5jb2x1bW5QYWlycyB8fCAhdGhpcy5jb2x1bW5QYWlyc1trZXldKSB7XG4gICAgICAvLyBzaG91bGQgbm90IGVuZCBpbiB0aGlzIHN0YXRlXG4gICAgICByZXR1cm4gdGhpcy5jb25maWcuY29sdW1ucztcbiAgICB9XG5cbiAgICBjb25zdCB7cGFpcjogcGFydG5lcktleSwgZmllbGRQYWlyS2V5fSA9IHRoaXMuY29sdW1uUGFpcnNba2V5XTtcbiAgICBjb25zdCB7ZmllbGRQYWlyS2V5OiBwYXJ0bmVyRmllbGRQYWlyS2V5fSA9IHRoaXMuY29sdW1uUGFpcnNbcGFydG5lcktleV07XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4udGhpcy5jb25maWcuY29sdW1ucyxcbiAgICAgIFtrZXldOiBwYWlyW2ZpZWxkUGFpcktleV0sXG4gICAgICBbcGFydG5lcktleV06IHBhaXJbcGFydG5lckZpZWxkUGFpcktleV1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZSBhIHJhZGl1cyB6b29tIG11bHRpcGxpZXIgdG8gcmVuZGVyIHBvaW50cywgc28gdGhleSBhcmUgdmlzaWJsZSBpbiBhbGwgem9vbSBsZXZlbFxuICAgKiBAcGFyYW0gbWFwU3RhdGVcbiAgICogQHBhcmFtIG1hcFN0YXRlLnpvb20gLSBhY3R1YWwgem9vbVxuICAgKiBAcGFyYW0gbWFwU3RhdGUuem9vbU9mZnNldCAtIHpvb21PZmZzZXQgd2hlbiByZW5kZXIgaW4gdGhlIHBsb3QgY29udGFpbmVyIGZvciBleHBvcnQgaW1hZ2VcbiAgICogQHJldHVybnMge251bWJlcn1cbiAgICovXG4gIGdldFpvb21GYWN0b3Ioe3pvb20sIHpvb21PZmZzZXQgPSAwfSkge1xuICAgIHJldHVybiBNYXRoLnBvdygyLCBNYXRoLm1heCgxNCAtIHpvb20gKyB6b29tT2Zmc2V0LCAwKSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlIGEgZWxldmF0aW9uIHpvb20gbXVsdGlwbGllciB0byByZW5kZXIgcG9pbnRzLCBzbyB0aGV5IGFyZSB2aXNpYmxlIGluIGFsbCB6b29tIGxldmVsXG4gICAqIEBwYXJhbSBtYXBTdGF0ZVxuICAgKiBAcGFyYW0gbWFwU3RhdGUuem9vbSAtIGFjdHVhbCB6b29tXG4gICAqIEBwYXJhbSBtYXBTdGF0ZS56b29tT2Zmc2V0IC0gem9vbU9mZnNldCB3aGVuIHJlbmRlciBpbiB0aGUgcGxvdCBjb250YWluZXIgZm9yIGV4cG9ydCBpbWFnZVxuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgKi9cbiAgZ2V0RWxldmF0aW9uWm9vbUZhY3Rvcih7em9vbSwgem9vbU9mZnNldCA9IDB9KSB7XG4gICAgcmV0dXJuIE1hdGgucG93KDIsIE1hdGgubWF4KDggLSB6b29tICsgem9vbU9mZnNldCwgMCkpO1xuICB9XG5cbiAgZm9ybWF0TGF5ZXJEYXRhKGRhdGFzZXRzLCBmaWx0ZXJlZEluZGV4KSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgcmVuZGVyTGF5ZXIoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgZ2V0SG92ZXJEYXRhKG9iamVjdCkge1xuICAgIGlmICghb2JqZWN0KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgLy8gYnkgZGVmYXVsdCwgZWFjaCBlbnRyeSBvZiBsYXllckRhdGEgc2hvdWxkIGhhdmUgYSBkYXRhIHByb3BlcnR5IHBvaW50c1xuICAgIC8vIHRvIHRoZSBvcmlnaW5hbCBpdGVtIGluIHRoZSBhbGxEYXRhIGFycmF5XG4gICAgLy8gZWFjaCBsYXllciBjYW4gaW1wbGVtZW50IGl0cyBvd24gZ2V0SG92ZXJEYXRhIG1ldGhvZFxuICAgIHJldHVybiBvYmplY3QuZGF0YTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGVuIGNoYW5nZSBsYXllciB0eXBlLCB0cnkgdG8gY29weSBvdmVyIGxheWVyIGNvbmZpZ3MgYXMgbXVjaCBhcyBwb3NzaWJsZVxuICAgKiBAcGFyYW0gY29uZmlnVG9Db3B5IC0gY29uZmlnIHRvIGNvcHkgb3ZlclxuICAgKiBAcGFyYW0gdmlzQ29uZmlnU2V0dGluZ3MgLSB2aXNDb25maWcgc2V0dGluZ3Mgb2YgY29uZmlnIHRvIGNvcHlcbiAgICovXG4gIGFzc2lnbkNvbmZpZ1RvTGF5ZXIoY29uZmlnVG9Db3B5LCB2aXNDb25maWdTZXR0aW5ncykge1xuICAgIC8vIGRvbid0IGRlZXAgbWVyZ2UgdmlzdWFsQ2hhbm5lbCBmaWVsZFxuICAgIC8vIGRvbid0IGRlZXAgbWVyZ2UgY29sb3IgcmFuZ2UsIHJldmVyc2VkOiBpcyBub3QgYSBrZXkgYnkgZGVmYXVsdFxuICAgIGNvbnN0IHNoYWxsb3dDb3B5ID0gWydjb2xvclJhbmdlJywgJ3N0cm9rZUNvbG9yUmFuZ2UnXS5jb25jYXQoXG4gICAgICBPYmplY3QudmFsdWVzKHRoaXMudmlzdWFsQ2hhbm5lbHMpLm1hcCh2ID0+IHYuZmllbGQpXG4gICAgKTtcblxuICAgIC8vIGRvbid0IGNvcHkgb3ZlciBkb21haW4gYW5kIGFuaW1hdGlvblxuICAgIGNvbnN0IG5vdFRvQ29weSA9IFsnYW5pbWF0aW9uJ10uY29uY2F0KE9iamVjdC52YWx1ZXModGhpcy52aXN1YWxDaGFubmVscykubWFwKHYgPT4gdi5kb21haW4pKTtcbiAgICAvLyBpZiByYW5nZSBpcyBmb3IgdGhlIHNhbWUgcHJvcGVydHkgZ3JvdXAgY29weSBpdCwgb3RoZXJ3aXNlLCBub3QgdG8gY29weVxuICAgIE9iamVjdC52YWx1ZXModGhpcy52aXN1YWxDaGFubmVscykuZm9yRWFjaCh2ID0+IHtcbiAgICAgIGlmIChcbiAgICAgICAgY29uZmlnVG9Db3B5LnZpc0NvbmZpZ1t2LnJhbmdlXSAmJlxuICAgICAgICB2aXNDb25maWdTZXR0aW5nc1t2LnJhbmdlXS5ncm91cCAhPT0gdGhpcy52aXNDb25maWdTZXR0aW5nc1t2LnJhbmdlXS5ncm91cFxuICAgICAgKSB7XG4gICAgICAgIG5vdFRvQ29weS5wdXNoKHYucmFuZ2UpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gZG9uJ3QgY29weSBvdmVyIHZpc3VhbENoYW5uZWwgcmFuZ2VcbiAgICBjb25zdCBjdXJyZW50Q29uZmlnID0gdGhpcy5jb25maWc7XG4gICAgY29uc3QgY29waWVkID0gdGhpcy5jb3B5TGF5ZXJDb25maWcoY3VycmVudENvbmZpZywgY29uZmlnVG9Db3B5LCB7XG4gICAgICBzaGFsbG93Q29weSxcbiAgICAgIG5vdFRvQ29weVxuICAgIH0pO1xuXG4gICAgdGhpcy51cGRhdGVMYXllckNvbmZpZyhjb3BpZWQpO1xuICAgIC8vIHZhbGlkYXRlIHZpc3VhbENoYW5uZWwgZmllbGQgdHlwZSBhbmQgc2NhbGUgdHlwZXNcbiAgICBPYmplY3Qua2V5cyh0aGlzLnZpc3VhbENoYW5uZWxzKS5mb3JFYWNoKGNoYW5uZWwgPT4ge1xuICAgICAgdGhpcy52YWxpZGF0ZVZpc3VhbENoYW5uZWwoY2hhbm5lbCk7XG4gICAgfSk7XG4gIH1cblxuICAvKlxuICAgKiBSZWN1cnNpdmVseSBjb3B5IGNvbmZpZyBvdmVyIHRvIGFuIGVtcHR5IGxheWVyXG4gICAqIHdoZW4gcmVjZWl2ZWQgc2F2ZWQgY29uZmlnLCBvciBjb3B5IGNvbmZpZyBvdmVyIGZyb20gYSBkaWZmZXJlbnQgbGF5ZXIgdHlwZVxuICAgKiBtYWtlIHN1cmUgdG8gb25seSBjb3B5IG92ZXIgdmFsdWUgdG8gZXhpc3Rpbmcga2V5c1xuICAgKiBAcGFyYW0ge29iamVjdH0gY3VycmVudENvbmZpZyAtIGV4aXN0aW5nIGNvbmZpZyB0byBiZSBvdmVycmlkZVxuICAgKiBAcGFyYW0ge29iamVjdH0gY29uZmlnVG9Db3B5IC0gbmV3IENvbmZpZyB0byBjb3B5IG92ZXJcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gc2hhbGxvd0NvcHkgLSBhcnJheSBvZiBwcm9wZXJ0aWVzIHRvIG5vdCB0byBiZSBkZWVwIGNvcGllZFxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBub3RUb0NvcHkgLSBhcnJheSBvZiBwcm9wZXJ0aWVzIG5vdCB0byBjb3B5XG4gICAqIEByZXR1cm5zIHtvYmplY3R9IC0gY29waWVkIGNvbmZpZ1xuICAgKi9cbiAgY29weUxheWVyQ29uZmlnKGN1cnJlbnRDb25maWcsIGNvbmZpZ1RvQ29weSwge3NoYWxsb3dDb3B5ID0gW10sIG5vdFRvQ29weSA9IFtdfSA9IHt9KSB7XG4gICAgY29uc3QgY29waWVkID0ge307XG4gICAgT2JqZWN0LmtleXMoY3VycmVudENvbmZpZykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgaWYgKFxuICAgICAgICBpc1BsYWluT2JqZWN0KGN1cnJlbnRDb25maWdba2V5XSkgJiZcbiAgICAgICAgaXNQbGFpbk9iamVjdChjb25maWdUb0NvcHlba2V5XSkgJiZcbiAgICAgICAgIXNoYWxsb3dDb3B5LmluY2x1ZGVzKGtleSkgJiZcbiAgICAgICAgIW5vdFRvQ29weS5pbmNsdWRlcyhrZXkpXG4gICAgICApIHtcbiAgICAgICAgLy8gcmVjdXJzaXZlbHkgYXNzaWduIG9iamVjdCB2YWx1ZVxuICAgICAgICBjb3BpZWRba2V5XSA9IHRoaXMuY29weUxheWVyQ29uZmlnKGN1cnJlbnRDb25maWdba2V5XSwgY29uZmlnVG9Db3B5W2tleV0sIHtcbiAgICAgICAgICBzaGFsbG93Q29weSxcbiAgICAgICAgICBub3RUb0NvcHlcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKG5vdE51bGxvclVuZGVmaW5lZChjb25maWdUb0NvcHlba2V5XSkgJiYgIW5vdFRvQ29weS5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICAgIC8vIGNvcHlcbiAgICAgICAgY29waWVkW2tleV0gPSBjb25maWdUb0NvcHlba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGtlZXAgZXhpc3RpbmdcbiAgICAgICAgY29waWVkW2tleV0gPSBjdXJyZW50Q29uZmlnW2tleV07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY29waWVkO1xuICB9XG5cbiAgcmVnaXN0ZXJWaXNDb25maWcobGF5ZXJWaXNDb25maWdzKSB7XG4gICAgT2JqZWN0LmtleXMobGF5ZXJWaXNDb25maWdzKS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJyAmJiBMQVlFUl9WSVNfQ09ORklHU1tsYXllclZpc0NvbmZpZ3NbaXRlbV1dKSB7XG4gICAgICAgIC8vIGlmIGFzc2lnbmVkIG9uZSBvZiBkZWZhdWx0IExBWUVSX0NPTkZJR1NcbiAgICAgICAgdGhpcy5jb25maWcudmlzQ29uZmlnW2l0ZW1dID0gTEFZRVJfVklTX0NPTkZJR1NbbGF5ZXJWaXNDb25maWdzW2l0ZW1dXS5kZWZhdWx0VmFsdWU7XG4gICAgICAgIHRoaXMudmlzQ29uZmlnU2V0dGluZ3NbaXRlbV0gPSBMQVlFUl9WSVNfQ09ORklHU1tsYXllclZpc0NvbmZpZ3NbaXRlbV1dO1xuICAgICAgfSBlbHNlIGlmIChbJ3R5cGUnLCAnZGVmYXVsdFZhbHVlJ10uZXZlcnkocCA9PiBsYXllclZpc0NvbmZpZ3NbaXRlbV0uaGFzT3duUHJvcGVydHkocCkpKSB7XG4gICAgICAgIC8vIGlmIHByb3ZpZGVkIGN1c3RvbWl6ZWQgdmlzQ29uZmlnLCBhbmQgaGFzIHR5cGUgJiYgZGVmYXVsdFZhbHVlXG4gICAgICAgIC8vIFRPRE86IGZ1cnRoZXIgY2hlY2sgaWYgY3VzdG9taXplZCB2aXNDb25maWcgaXMgdmFsaWRcbiAgICAgICAgdGhpcy5jb25maWcudmlzQ29uZmlnW2l0ZW1dID0gbGF5ZXJWaXNDb25maWdzW2l0ZW1dLmRlZmF1bHRWYWx1ZTtcbiAgICAgICAgdGhpcy52aXNDb25maWdTZXR0aW5nc1tpdGVtXSA9IGxheWVyVmlzQ29uZmlnc1tpdGVtXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldExheWVyQ29sdW1ucygpIHtcbiAgICBjb25zdCByZXF1aXJlZCA9IHRoaXMucmVxdWlyZWRMYXllckNvbHVtbnMucmVkdWNlKFxuICAgICAgKGFjY3UsIGtleSkgPT4gKHtcbiAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgW2tleV06IHt2YWx1ZTogbnVsbCwgZmllbGRJZHg6IC0xfVxuICAgICAgfSksXG4gICAgICB7fVxuICAgICk7XG4gICAgY29uc3Qgb3B0aW9uYWwgPSB0aGlzLm9wdGlvbmFsQ29sdW1ucy5yZWR1Y2UoXG4gICAgICAoYWNjdSwga2V5KSA9PiAoe1xuICAgICAgICAuLi5hY2N1LFxuICAgICAgICBba2V5XToge3ZhbHVlOiBudWxsLCBmaWVsZElkeDogLTEsIG9wdGlvbmFsOiB0cnVlfVxuICAgICAgfSksXG4gICAgICB7fVxuICAgICk7XG5cbiAgICByZXR1cm4gey4uLnJlcXVpcmVkLCAuLi5vcHRpb25hbH07XG4gIH1cblxuICB1cGRhdGVMYXllckNvbmZpZyhuZXdDb25maWcpIHtcbiAgICB0aGlzLmNvbmZpZyA9IHsuLi50aGlzLmNvbmZpZywgLi4ubmV3Q29uZmlnfTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHVwZGF0ZUxheWVyVmlzQ29uZmlnKG5ld1Zpc0NvbmZpZykge1xuICAgIHRoaXMuY29uZmlnLnZpc0NvbmZpZyA9IHsuLi50aGlzLmNvbmZpZy52aXNDb25maWcsIC4uLm5ld1Zpc0NvbmZpZ307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB1cGRhdGVMYXllckNvbG9yVUkocHJvcCwgbmV3Q29uZmlnKSB7XG4gICAgY29uc3Qge2NvbG9yVUk6IHByZXZpb3VzLCB2aXNDb25maWd9ID0gdGhpcy5jb25maWc7XG5cbiAgICBpZiAoIWlzUGxhaW5PYmplY3QobmV3Q29uZmlnKSB8fCB0eXBlb2YgcHJvcCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbG9yVUlQcm9wID0gT2JqZWN0LmVudHJpZXMobmV3Q29uZmlnKS5yZWR1Y2UoKGFjY3UsIFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgW2tleV06IGlzUGxhaW5PYmplY3QoYWNjdVtrZXldKSAmJiBpc1BsYWluT2JqZWN0KHZhbHVlKSA/IHsuLi5hY2N1W2tleV0sIC4uLnZhbHVlfSA6IHZhbHVlXG4gICAgICB9O1xuICAgIH0sIHByZXZpb3VzW3Byb3BdIHx8IERFRkFVTFRfQ09MT1JfVUkpO1xuXG4gICAgY29uc3QgY29sb3JVSSA9IHtcbiAgICAgIC4uLnByZXZpb3VzLFxuICAgICAgW3Byb3BdOiBjb2xvclVJUHJvcFxuICAgIH07XG5cbiAgICB0aGlzLnVwZGF0ZUxheWVyQ29uZmlnKHtjb2xvclVJfSk7XG4gICAgLy8gaWYgY29sb3JVSVtwcm9wXSBpcyBjb2xvclJhbmdlXG4gICAgY29uc3QgaXNDb2xvclJhbmdlID0gdmlzQ29uZmlnW3Byb3BdICYmIHZpc0NvbmZpZ1twcm9wXS5jb2xvcnM7XG5cbiAgICBpZiAoaXNDb2xvclJhbmdlKSB7XG4gICAgICB0aGlzLnVwZGF0ZUNvbG9yVUlCeUNvbG9yUmFuZ2UobmV3Q29uZmlnLCBwcm9wKTtcbiAgICAgIHRoaXMudXBkYXRlQ29sb3JSYW5nZUJ5Q29sb3JVSShuZXdDb25maWcsIHByZXZpb3VzLCBwcm9wKTtcbiAgICAgIHRoaXMudXBkYXRlQ3VzdG9tUGFsZXR0ZShuZXdDb25maWcsIHByZXZpb3VzLCBwcm9wKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHVwZGF0ZUN1c3RvbVBhbGV0dGUobmV3Q29uZmlnLCBwcmV2aW91cywgcHJvcCkge1xuICAgIGlmICghbmV3Q29uZmlnLmNvbG9yUmFuZ2VDb25maWcgfHwgIW5ld0NvbmZpZy5jb2xvclJhbmdlQ29uZmlnLmN1c3RvbSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHtjb2xvclVJLCB2aXNDb25maWd9ID0gdGhpcy5jb25maWc7XG5cbiAgICBpZiAoIXZpc0NvbmZpZ1twcm9wXSkgcmV0dXJuO1xuICAgIGNvbnN0IHtjb2xvcnN9ID0gdmlzQ29uZmlnW3Byb3BdO1xuICAgIGNvbnN0IGN1c3RvbVBhbGV0dGUgPSB7XG4gICAgICAuLi5jb2xvclVJW3Byb3BdLmN1c3RvbVBhbGV0dGUsXG4gICAgICBuYW1lOiAnQ3VzdG9tIFBhbGV0dGUnLFxuICAgICAgY29sb3JzOiBbLi4uY29sb3JzXVxuICAgIH07XG4gICAgdGhpcy51cGRhdGVMYXllckNvbmZpZyh7XG4gICAgICBjb2xvclVJOiB7XG4gICAgICAgIC4uLmNvbG9yVUksXG4gICAgICAgIFtwcm9wXToge1xuICAgICAgICAgIC4uLmNvbG9yVUlbcHJvcF0sXG4gICAgICAgICAgY3VzdG9tUGFsZXR0ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIGlmIG9wZW4gZHJvcGRvd24gYW5kIHByb3AgaXMgY29sb3IgcmFuZ2VcbiAgICogQXV0b21hdGljYWxseSBzZXQgY29sb3JSYW5nZUNvbmZpZydzIHN0ZXAgYW5kIHJldmVyc2VkXG4gICAqIEBwYXJhbSB7Kn0gbmV3Q29uZmlnXG4gICAqIEBwYXJhbSB7Kn0gcHJvcFxuICAgKi9cbiAgdXBkYXRlQ29sb3JVSUJ5Q29sb3JSYW5nZShuZXdDb25maWcsIHByb3ApIHtcbiAgICBpZiAodHlwZW9mIG5ld0NvbmZpZy5zaG93RHJvcGRvd24gIT09ICdudW1iZXInKSByZXR1cm47XG5cbiAgICBjb25zdCB7Y29sb3JVSSwgdmlzQ29uZmlnfSA9IHRoaXMuY29uZmlnO1xuICAgIHRoaXMudXBkYXRlTGF5ZXJDb25maWcoe1xuICAgICAgY29sb3JVSToge1xuICAgICAgICAuLi5jb2xvclVJLFxuICAgICAgICBbcHJvcF06IHtcbiAgICAgICAgICAuLi5jb2xvclVJW3Byb3BdLFxuICAgICAgICAgIGNvbG9yUmFuZ2VDb25maWc6IHtcbiAgICAgICAgICAgIC4uLmNvbG9yVUlbcHJvcF0uY29sb3JSYW5nZUNvbmZpZyxcbiAgICAgICAgICAgIHN0ZXBzOiB2aXNDb25maWdbcHJvcF0uY29sb3JzLmxlbmd0aCxcbiAgICAgICAgICAgIHJldmVyc2VkOiBCb29sZWFuKHZpc0NvbmZpZ1twcm9wXS5yZXZlcnNlZClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZUNvbG9yUmFuZ2VCeUNvbG9yVUkobmV3Q29uZmlnLCBwcmV2aW91cywgcHJvcCkge1xuICAgIC8vIG9ubHkgdXBkYXRlIGNvbG9yUmFuZ2UgaWYgY2hhbmdlcyBpbiBVSSBpcyBtYWRlIHRvICdyZXZlcnNlZCcsICdzdGVwcycgb3Igc3RlcHNcbiAgICBjb25zdCBzaG91bGRVcGRhdGUgPVxuICAgICAgbmV3Q29uZmlnLmNvbG9yUmFuZ2VDb25maWcgJiZcbiAgICAgIFsncmV2ZXJzZWQnLCAnc3RlcHMnXS5zb21lKFxuICAgICAgICBrZXkgPT5cbiAgICAgICAgICBuZXdDb25maWcuY29sb3JSYW5nZUNvbmZpZy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmXG4gICAgICAgICAgbmV3Q29uZmlnLmNvbG9yUmFuZ2VDb25maWdba2V5XSAhPT1cbiAgICAgICAgICAgIChwcmV2aW91c1twcm9wXSB8fCBERUZBVUxUX0NPTE9SX1VJKS5jb2xvclJhbmdlQ29uZmlnW2tleV1cbiAgICAgICk7XG4gICAgaWYgKCFzaG91bGRVcGRhdGUpIHJldHVybjtcblxuICAgIGNvbnN0IHtjb2xvclVJLCB2aXNDb25maWd9ID0gdGhpcy5jb25maWc7XG4gICAgY29uc3Qge3N0ZXBzLCByZXZlcnNlZH0gPSBjb2xvclVJW3Byb3BdLmNvbG9yUmFuZ2VDb25maWc7XG4gICAgY29uc3QgY29sb3JSYW5nZSA9IHZpc0NvbmZpZ1twcm9wXTtcbiAgICAvLyBmaW5kIGJhc2VkIG9uIHN0ZXAgb3IgcmV2ZXJzZWRcbiAgICBsZXQgdXBkYXRlO1xuICAgIGlmIChuZXdDb25maWcuY29sb3JSYW5nZUNvbmZpZy5oYXNPd25Qcm9wZXJ0eSgnc3RlcHMnKSkge1xuICAgICAgY29uc3QgZ3JvdXAgPSBnZXRDb2xvckdyb3VwQnlOYW1lKGNvbG9yUmFuZ2UpO1xuXG4gICAgICBpZiAoZ3JvdXApIHtcbiAgICAgICAgY29uc3Qgc2FtZUdyb3VwID0gQ09MT1JfUkFOR0VTLmZpbHRlcihjciA9PiBnZXRDb2xvckdyb3VwQnlOYW1lKGNyKSA9PT0gZ3JvdXApO1xuXG4gICAgICAgIHVwZGF0ZSA9IHNhbWVHcm91cC5maW5kKGNyID0+IGNyLmNvbG9ycy5sZW5ndGggPT09IHN0ZXBzKTtcblxuICAgICAgICBpZiAodXBkYXRlICYmIGNvbG9yUmFuZ2UucmV2ZXJzZWQpIHtcbiAgICAgICAgICB1cGRhdGUgPSByZXZlcnNlQ29sb3JSYW5nZSh0cnVlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG5ld0NvbmZpZy5jb2xvclJhbmdlQ29uZmlnLmhhc093blByb3BlcnR5KCdyZXZlcnNlZCcpKSB7XG4gICAgICB1cGRhdGUgPSByZXZlcnNlQ29sb3JSYW5nZShyZXZlcnNlZCwgdXBkYXRlIHx8IGNvbG9yUmFuZ2UpO1xuICAgIH1cblxuICAgIGlmICh1cGRhdGUpIHtcbiAgICAgIHRoaXMudXBkYXRlTGF5ZXJWaXNDb25maWcoe1twcm9wXTogdXBkYXRlfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgbGF5ZXIgaGFzIGFsbCBjb2x1bW5zXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBsYXllclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0geWVzIG9yIG5vXG4gICAqL1xuICBoYXNBbGxDb2x1bW5zKCkge1xuICAgIGNvbnN0IHtjb2x1bW5zfSA9IHRoaXMuY29uZmlnO1xuICAgIHJldHVybiAoXG4gICAgICBjb2x1bW5zICYmXG4gICAgICBPYmplY3QudmFsdWVzKGNvbHVtbnMpLmV2ZXJ5KHYgPT4ge1xuICAgICAgICByZXR1cm4gQm9vbGVhbih2Lm9wdGlvbmFsIHx8ICh2LnZhbHVlICYmIHYuZmllbGRJZHggPiAtMSkpO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgbGF5ZXIgaGFzIGRhdGFcbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGxheWVyXG4gICAqIEBwYXJhbSB7QXJyYXkgfCBPYmplY3R9IGxheWVyRGF0YVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0geWVzIG9yIG5vXG4gICAqL1xuICBoYXNMYXllckRhdGEobGF5ZXJEYXRhKSB7XG4gICAgaWYgKCFsYXllckRhdGEpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gQm9vbGVhbihsYXllckRhdGEuZGF0YSAmJiBsYXllckRhdGEuZGF0YS5sZW5ndGgpO1xuICB9XG5cbiAgaXNWYWxpZFRvU2F2ZSgpIHtcbiAgICByZXR1cm4gdGhpcy50eXBlICYmIHRoaXMuaGFzQWxsQ29sdW1ucygpO1xuICB9XG5cbiAgc2hvdWxkUmVuZGVyTGF5ZXIoZGF0YSkge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLnR5cGUgJiZcbiAgICAgIHRoaXMuY29uZmlnLmlzVmlzaWJsZSAmJlxuICAgICAgdGhpcy5oYXNBbGxDb2x1bW5zKCkgJiZcbiAgICAgIHRoaXMuaGFzTGF5ZXJEYXRhKGRhdGEpICYmXG4gICAgICB0eXBlb2YgdGhpcy5yZW5kZXJMYXllciA9PT0gJ2Z1bmN0aW9uJ1xuICAgICk7XG4gIH1cblxuICBnZXRWaXNDaGFubmVsU2NhbGUoc2NhbGUsIGRvbWFpbiwgcmFuZ2UsIGZpeGVkKSB7XG4gICAgcmV0dXJuIFNDQUxFX0ZVTkNbZml4ZWQgPyAnbGluZWFyJyA6IHNjYWxlXSgpXG4gICAgICAuZG9tYWluKGRvbWFpbilcbiAgICAgIC5yYW5nZShmaXhlZCA/IGRvbWFpbiA6IHJhbmdlKTtcbiAgfVxuXG4gIGdldFBvaW50c0JvdW5kcyhhbGxEYXRhLCBnZXRQb3NpdGlvbiA9IGlkZW50aXR5KSB7XG4gICAgLy8gbm8gbmVlZCB0byBsb29wIHRocm91Z2ggdGhlIGVudGlyZSBkYXRhc2V0XG4gICAgLy8gZ2V0IGEgc2FtcGxlIG9mIGRhdGEgdG8gY2FsY3VsYXRlIGJvdW5kc1xuICAgIGNvbnN0IHNhbXBsZURhdGEgPVxuICAgICAgYWxsRGF0YS5sZW5ndGggPiBNQVhfU0FNUExFX1NJWkUgPyBnZXRTYW1wbGVEYXRhKGFsbERhdGEsIE1BWF9TQU1QTEVfU0laRSkgOiBhbGxEYXRhO1xuICAgIGNvbnN0IHBvaW50cyA9IHNhbXBsZURhdGEubWFwKGdldFBvc2l0aW9uKTtcblxuICAgIGNvbnN0IGxhdEJvdW5kcyA9IGdldExhdExuZ0JvdW5kcyhwb2ludHMsIDEsIFstOTAsIDkwXSk7XG4gICAgY29uc3QgbG5nQm91bmRzID0gZ2V0TGF0TG5nQm91bmRzKHBvaW50cywgMCwgWy0xODAsIDE4MF0pO1xuXG4gICAgaWYgKCFsYXRCb3VuZHMgfHwgIWxuZ0JvdW5kcykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIFtsbmdCb3VuZHNbMF0sIGxhdEJvdW5kc1swXSwgbG5nQm91bmRzWzFdLCBsYXRCb3VuZHNbMV1dO1xuICB9XG5cbiAgZ2V0Q2hhbmdlZFRyaWdnZXJzKGRhdGFVcGRhdGVUcmlnZ2Vycykge1xuICAgIGNvbnN0IHRyaWdnZXJDaGFuZ2VkID0gZGlmZlVwZGF0ZVRyaWdnZXJzKGRhdGFVcGRhdGVUcmlnZ2VycywgdGhpcy5fb2xkRGF0YVVwZGF0ZVRyaWdnZXJzKTtcbiAgICB0aGlzLl9vbGREYXRhVXBkYXRlVHJpZ2dlcnMgPSBkYXRhVXBkYXRlVHJpZ2dlcnM7XG5cbiAgICByZXR1cm4gdHJpZ2dlckNoYW5nZWQ7XG4gIH1cblxuICBnZXRFbmNvZGVkQ2hhbm5lbFZhbHVlKFxuICAgIHNjYWxlLFxuICAgIGRhdGEsXG4gICAgZmllbGQsXG4gICAgbnVsbFZhbHVlID0gTk9fVkFMVUVfQ09MT1IsXG4gICAgZ2V0VmFsdWUgPSBkZWZhdWx0R2V0RmllbGRWYWx1ZVxuICApIHtcbiAgICBjb25zdCB7dHlwZX0gPSBmaWVsZDtcbiAgICBjb25zdCB2YWx1ZSA9IGdldFZhbHVlKGZpZWxkLCBkYXRhKTtcblxuICAgIGlmICghbm90TnVsbG9yVW5kZWZpbmVkKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIG51bGxWYWx1ZTtcbiAgICB9XG5cbiAgICBsZXQgYXR0cmlidXRlVmFsdWU7XG4gICAgaWYgKHR5cGUgPT09IEFMTF9GSUVMRF9UWVBFUy50aW1lc3RhbXApIHtcbiAgICAgIC8vIHNob3VsZG4ndCBuZWVkIHRvIGNvbnZlcnQgaGVyZVxuICAgICAgLy8gc2NhbGUgRnVuY3Rpb24gc2hvdWxkIHRha2UgY2FyZSBvZiBpdFxuICAgICAgYXR0cmlidXRlVmFsdWUgPSBzY2FsZShuZXcgRGF0ZSh2YWx1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhdHRyaWJ1dGVWYWx1ZSA9IHNjYWxlKHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAoIW5vdE51bGxvclVuZGVmaW5lZChhdHRyaWJ1dGVWYWx1ZSkpIHtcbiAgICAgIGF0dHJpYnV0ZVZhbHVlID0gbnVsbFZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiBhdHRyaWJ1dGVWYWx1ZTtcbiAgfVxuXG4gIHVwZGF0ZU1ldGEobWV0YSkge1xuICAgIHRoaXMubWV0YSA9IHsuLi50aGlzLm1ldGEsIC4uLm1ldGF9O1xuICB9XG5cbiAgZ2V0RGF0YVVwZGF0ZVRyaWdnZXJzKHtmaWx0ZXJlZEluZGV4LCBpZH0pIHtcbiAgICBjb25zdCB7Y29sdW1uc30gPSB0aGlzLmNvbmZpZztcblxuICAgIHJldHVybiB7XG4gICAgICBnZXREYXRhOiB7ZGF0YXNldElkOiBpZCwgY29sdW1ucywgZmlsdGVyZWRJbmRleH0sXG4gICAgICBnZXRNZXRhOiB7ZGF0YXNldElkOiBpZCwgY29sdW1uc30sXG4gICAgICAuLi4odGhpcy5jb25maWcudGV4dExhYmVsIHx8IFtdKS5yZWR1Y2UoXG4gICAgICAgIChhY2N1LCB0bCwgaSkgPT4gKHtcbiAgICAgICAgICAuLi5hY2N1LFxuICAgICAgICAgIFtgZ2V0TGFiZWxDaGFyYWN0ZXJTZXQtJHtpfWBdOiB0bC5maWVsZCA/IHRsLmZpZWxkLm5hbWUgOiBudWxsXG4gICAgICAgIH0pLFxuICAgICAgICB7fVxuICAgICAgKVxuICAgIH07XG4gIH1cblxuICB1cGRhdGVEYXRhKGRhdGFzZXRzLCBvbGRMYXllckRhdGEpIHtcbiAgICBjb25zdCBsYXllckRhdGFzZXQgPSBkYXRhc2V0c1t0aGlzLmNvbmZpZy5kYXRhSWRdO1xuICAgIGNvbnN0IHthbGxEYXRhfSA9IGRhdGFzZXRzW3RoaXMuY29uZmlnLmRhdGFJZF07XG5cbiAgICBjb25zdCBnZXRQb3NpdGlvbiA9IHRoaXMuZ2V0UG9zaXRpb25BY2Nlc3NvcigpO1xuICAgIGNvbnN0IGRhdGFVcGRhdGVUcmlnZ2VycyA9IHRoaXMuZ2V0RGF0YVVwZGF0ZVRyaWdnZXJzKGxheWVyRGF0YXNldCk7XG4gICAgY29uc3QgdHJpZ2dlckNoYW5nZWQgPSB0aGlzLmdldENoYW5nZWRUcmlnZ2VycyhkYXRhVXBkYXRlVHJpZ2dlcnMpO1xuXG4gICAgaWYgKHRyaWdnZXJDaGFuZ2VkLmdldE1ldGEpIHtcbiAgICAgIHRoaXMudXBkYXRlTGF5ZXJNZXRhKGFsbERhdGEsIGdldFBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBsZXQgZGF0YSA9IFtdO1xuICAgIGlmICghdHJpZ2dlckNoYW5nZWQuZ2V0RGF0YSkge1xuICAgICAgLy8gc2FtZSBkYXRhXG4gICAgICBkYXRhID0gb2xkTGF5ZXJEYXRhLmRhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEgPSB0aGlzLmNhbGN1bGF0ZURhdGFBdHRyaWJ1dGUobGF5ZXJEYXRhc2V0LCBnZXRQb3NpdGlvbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtkYXRhLCB0cmlnZ2VyQ2hhbmdlZH07XG4gIH1cbiAgLyoqXG4gICAqIGhlbHBlciBmdW5jdGlvbiB0byB1cGRhdGUgb25lIGxheWVyIGRvbWFpbiB3aGVuIHN0YXRlLmRhdGEgY2hhbmdlZFxuICAgKiBpZiBzdGF0ZS5kYXRhIGNoYW5nZSBpcyBkdWUgb3QgdXBkYXRlIGZpbHRlciwgbmV3RmlsZXIgd2lsbCBiZSBwYXNzZWRcbiAgICogY2FsbGVkIGJ5IHVwZGF0ZUFsbExheWVyRG9tYWluRGF0YVxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YXNldFxuICAgKiBAcGFyYW0ge09iamVjdH0gbmV3RmlsdGVyXG4gICAqIEByZXR1cm5zIHtvYmplY3R9IGxheWVyXG4gICAqL1xuICB1cGRhdGVMYXllckRvbWFpbihkYXRhc2V0cywgbmV3RmlsdGVyKSB7XG4gICAgY29uc3QgZGF0YXNldCA9IHRoaXMuZ2V0RGF0YXNldChkYXRhc2V0cyk7XG4gICAgaWYgKCFkYXRhc2V0KSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgT2JqZWN0LnZhbHVlcyh0aGlzLnZpc3VhbENoYW5uZWxzKS5mb3JFYWNoKGNoYW5uZWwgPT4ge1xuICAgICAgY29uc3Qge3NjYWxlfSA9IGNoYW5uZWw7XG4gICAgICBjb25zdCBzY2FsZVR5cGUgPSB0aGlzLmNvbmZpZ1tzY2FsZV07XG4gICAgICAvLyBvcmRpbmFsIGRvbWFpbiBpcyBiYXNlZCBvbiBhbGxEYXRhLCBpZiBvbmx5IGZpbHRlciBjaGFuZ2VkXG4gICAgICAvLyBubyBuZWVkIHRvIHVwZGF0ZSBvcmRpbmFsIGRvbWFpblxuICAgICAgaWYgKCFuZXdGaWx0ZXIgfHwgc2NhbGVUeXBlICE9PSBTQ0FMRV9UWVBFUy5vcmRpbmFsKSB7XG4gICAgICAgIGNvbnN0IHtkb21haW59ID0gY2hhbm5lbDtcbiAgICAgICAgY29uc3QgdXBkYXRlZERvbWFpbiA9IHRoaXMuY2FsY3VsYXRlTGF5ZXJEb21haW4oZGF0YXNldCwgY2hhbm5lbCk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVMYXllckNvbmZpZyh7W2RvbWFpbl06IHVwZGF0ZWREb21haW59KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZ2V0RGF0YXNldChkYXRhc2V0cykge1xuICAgIHJldHVybiBkYXRhc2V0c1t0aGlzLmNvbmZpZy5kYXRhSWRdO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIHZpc3VhbCBjaGFubmVsIGZpZWxkIGFuZCBzY2FsZXMgYmFzZWQgb24gc3VwcG9ydGVkIGZpZWxkICYgc2NhbGUgdHlwZVxuICAgKiBAcGFyYW0gY2hhbm5lbFxuICAgKi9cbiAgdmFsaWRhdGVWaXN1YWxDaGFubmVsKGNoYW5uZWwpIHtcbiAgICB0aGlzLnZhbGlkYXRlRmllbGRUeXBlKGNoYW5uZWwpO1xuICAgIHRoaXMudmFsaWRhdGVTY2FsZShjaGFubmVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZSBmaWVsZCB0eXBlIGJhc2VkIG9uIGNoYW5uZWxTY2FsZVR5cGVcbiAgICovXG4gIHZhbGlkYXRlRmllbGRUeXBlKGNoYW5uZWwpIHtcbiAgICBjb25zdCB2aXN1YWxDaGFubmVsID0gdGhpcy52aXN1YWxDaGFubmVsc1tjaGFubmVsXTtcbiAgICBjb25zdCB7ZmllbGQsIGNoYW5uZWxTY2FsZVR5cGUsIHN1cHBvcnRlZEZpZWxkVHlwZXN9ID0gdmlzdWFsQ2hhbm5lbDtcblxuICAgIGlmICh0aGlzLmNvbmZpZ1tmaWVsZF0pIHtcbiAgICAgIC8vIGlmIGZpZWxkIGlzIHNlbGVjdGVkLCBjaGVjayBpZiBmaWVsZCB0eXBlIGlzIHN1cHBvcnRlZFxuICAgICAgY29uc3QgY2hhbm5lbFN1cHBvcnRlZEZpZWxkVHlwZXMgPVxuICAgICAgICBzdXBwb3J0ZWRGaWVsZFR5cGVzIHx8IENIQU5ORUxfU0NBTEVfU1VQUE9SVEVEX0ZJRUxEU1tjaGFubmVsU2NhbGVUeXBlXTtcblxuICAgICAgaWYgKCFjaGFubmVsU3VwcG9ydGVkRmllbGRUeXBlcy5pbmNsdWRlcyh0aGlzLmNvbmZpZ1tmaWVsZF0udHlwZSkpIHtcbiAgICAgICAgLy8gZmllbGQgdHlwZSBpcyBub3Qgc3VwcG9ydGVkLCBzZXQgaXQgYmFjayB0byBudWxsXG4gICAgICAgIC8vIHNldCBzY2FsZSBiYWNrIHRvIGRlZmF1bHRcbiAgICAgICAgdGhpcy51cGRhdGVMYXllckNvbmZpZyh7W2ZpZWxkXTogbnVsbH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZSBzY2FsZSB0eXBlIGJhc2VkIG9uIGFnZ3JlZ2F0aW9uXG4gICAqL1xuICB2YWxpZGF0ZVNjYWxlKGNoYW5uZWwpIHtcbiAgICBjb25zdCB2aXN1YWxDaGFubmVsID0gdGhpcy52aXN1YWxDaGFubmVsc1tjaGFubmVsXTtcbiAgICBjb25zdCB7c2NhbGV9ID0gdmlzdWFsQ2hhbm5lbDtcbiAgICBpZiAoIXNjYWxlKSB7XG4gICAgICAvLyB2aXN1YWxDaGFubmVsIGRvZXNuJ3QgaGF2ZSBzY2FsZVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzY2FsZU9wdGlvbnMgPSB0aGlzLmdldFNjYWxlT3B0aW9ucyhjaGFubmVsKTtcbiAgICAvLyBjaGVjayBpZiBjdXJyZW50IHNlbGVjdGVkIHNjYWxlIGlzXG4gICAgLy8gc3VwcG9ydGVkLCBpZiBub3QsIGNoYW5nZSB0byBkZWZhdWx0XG4gICAgaWYgKCFzY2FsZU9wdGlvbnMuaW5jbHVkZXModGhpcy5jb25maWdbc2NhbGVdKSkge1xuICAgICAgdGhpcy51cGRhdGVMYXllckNvbmZpZyh7W3NjYWxlXTogc2NhbGVPcHRpb25zWzBdfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBzY2FsZSBvcHRpb25zIGJhc2VkIG9uIGN1cnJlbnQgZmllbGRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNoYW5uZWxcbiAgICogQHJldHVybnMge3N0cmluZ1tdfVxuICAgKi9cbiAgZ2V0U2NhbGVPcHRpb25zKGNoYW5uZWwpIHtcbiAgICBjb25zdCB2aXN1YWxDaGFubmVsID0gdGhpcy52aXN1YWxDaGFubmVsc1tjaGFubmVsXTtcbiAgICBjb25zdCB7ZmllbGQsIHNjYWxlLCBjaGFubmVsU2NhbGVUeXBlfSA9IHZpc3VhbENoYW5uZWw7XG5cbiAgICByZXR1cm4gdGhpcy5jb25maWdbZmllbGRdXG4gICAgICA/IEZJRUxEX09QVFNbdGhpcy5jb25maWdbZmllbGRdLnR5cGVdLnNjYWxlW2NoYW5uZWxTY2FsZVR5cGVdXG4gICAgICA6IFt0aGlzLmdldERlZmF1bHRMYXllckNvbmZpZygpW3NjYWxlXV07XG4gIH1cblxuICB1cGRhdGVMYXllclZpc3VhbENoYW5uZWwoZGF0YXNldCwgY2hhbm5lbCkge1xuICAgIGNvbnN0IHZpc3VhbENoYW5uZWwgPSB0aGlzLnZpc3VhbENoYW5uZWxzW2NoYW5uZWxdO1xuICAgIHRoaXMudmFsaWRhdGVWaXN1YWxDaGFubmVsKGNoYW5uZWwpO1xuICAgIC8vIGNhbGN1bGF0ZSBsYXllciBjaGFubmVsIGRvbWFpblxuICAgIGNvbnN0IHVwZGF0ZWREb21haW4gPSB0aGlzLmNhbGN1bGF0ZUxheWVyRG9tYWluKGRhdGFzZXQsIHZpc3VhbENoYW5uZWwpO1xuICAgIHRoaXMudXBkYXRlTGF5ZXJDb25maWcoe1t2aXN1YWxDaGFubmVsLmRvbWFpbl06IHVwZGF0ZWREb21haW59KTtcbiAgfVxuXG4gIGNhbGN1bGF0ZUxheWVyRG9tYWluKGRhdGFzZXQsIHZpc3VhbENoYW5uZWwpIHtcbiAgICBjb25zdCB7YWxsRGF0YSwgZmlsdGVyZWRJbmRleEZvckRvbWFpbn0gPSBkYXRhc2V0O1xuICAgIGNvbnN0IGRlZmF1bHREb21haW4gPSBbMCwgMV07XG4gICAgY29uc3Qge3NjYWxlfSA9IHZpc3VhbENoYW5uZWw7XG4gICAgY29uc3Qgc2NhbGVUeXBlID0gdGhpcy5jb25maWdbc2NhbGVdO1xuXG4gICAgY29uc3QgZmllbGQgPSB0aGlzLmNvbmZpZ1t2aXN1YWxDaGFubmVsLmZpZWxkXTtcbiAgICBpZiAoIWZpZWxkKSB7XG4gICAgICAvLyBpZiBjb2xvckZpZWxkIG9yIHNpemVGaWVsZCB3ZXJlIHNldCBiYWNrIHRvIG51bGxcbiAgICAgIHJldHVybiBkZWZhdWx0RG9tYWluO1xuICAgIH1cblxuICAgIGlmICghU0NBTEVfVFlQRVNbc2NhbGVUeXBlXSkge1xuICAgICAgQ29uc29sZS5lcnJvcihgc2NhbGUgdHlwZSAke3NjYWxlVHlwZX0gbm90IHN1cHBvcnRlZGApO1xuICAgICAgcmV0dXJuIGRlZmF1bHREb21haW47XG4gICAgfVxuXG4gICAgLy8gVE9ETzogcmVmYWN0b3IgdG8gYWRkIHZhbHVlQWNjZXNzb3IgdG8gZmllbGRcbiAgICBjb25zdCBmaWVsZElkeCA9IGZpZWxkLnRhYmxlRmllbGRJbmRleCAtIDE7XG4gICAgY29uc3QgaXNUaW1lID0gZmllbGQudHlwZSA9PT0gQUxMX0ZJRUxEX1RZUEVTLnRpbWVzdGFtcDtcbiAgICBjb25zdCB2YWx1ZUFjY2Vzc29yID0gbWF5YmVUb0RhdGUuYmluZChudWxsLCBpc1RpbWUsIGZpZWxkSWR4LCBmaWVsZC5mb3JtYXQpO1xuICAgIGNvbnN0IGluZGV4VmFsdWVBY2Nlc3NvciA9IGkgPT4gdmFsdWVBY2Nlc3NvcihhbGxEYXRhW2ldKTtcblxuICAgIGNvbnN0IHNvcnRGdW5jdGlvbiA9IGdldFNvcnRpbmdGdW5jdGlvbihmaWVsZC50eXBlKTtcblxuICAgIHN3aXRjaCAoc2NhbGVUeXBlKSB7XG4gICAgICBjYXNlIFNDQUxFX1RZUEVTLm9yZGluYWw6XG4gICAgICBjYXNlIFNDQUxFX1RZUEVTLnBvaW50OlxuICAgICAgICAvLyBkbyBub3QgcmVjYWxjdWxhdGUgb3JkaW5hbCBkb21haW4gYmFzZWQgb24gZmlsdGVyZWQgZGF0YVxuICAgICAgICAvLyBkb24ndCBuZWVkIHRvIHVwZGF0ZSBvcmRpbmFsIGRvbWFpbiBldmVyeSB0aW1lXG4gICAgICAgIHJldHVybiBnZXRPcmRpbmFsRG9tYWluKGFsbERhdGEsIHZhbHVlQWNjZXNzb3IpO1xuXG4gICAgICBjYXNlIFNDQUxFX1RZUEVTLnF1YW50aWxlOlxuICAgICAgICByZXR1cm4gZ2V0UXVhbnRpbGVEb21haW4oZmlsdGVyZWRJbmRleEZvckRvbWFpbiwgaW5kZXhWYWx1ZUFjY2Vzc29yLCBzb3J0RnVuY3Rpb24pO1xuXG4gICAgICBjYXNlIFNDQUxFX1RZUEVTLmxvZzpcbiAgICAgICAgcmV0dXJuIGdldExvZ0RvbWFpbihmaWx0ZXJlZEluZGV4Rm9yRG9tYWluLCBpbmRleFZhbHVlQWNjZXNzb3IpO1xuXG4gICAgICBjYXNlIFNDQUxFX1RZUEVTLnF1YW50aXplOlxuICAgICAgY2FzZSBTQ0FMRV9UWVBFUy5saW5lYXI6XG4gICAgICBjYXNlIFNDQUxFX1RZUEVTLnNxcnQ6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZ2V0TGluZWFyRG9tYWluKGZpbHRlcmVkSW5kZXhGb3JEb21haW4sIGluZGV4VmFsdWVBY2Nlc3Nvcik7XG4gICAgfVxuICB9XG5cbiAgaXNMYXllckhvdmVyZWQob2JqZWN0SW5mbykge1xuICAgIHJldHVybiAoXG4gICAgICBvYmplY3RJbmZvICYmIG9iamVjdEluZm8ubGF5ZXIgJiYgb2JqZWN0SW5mby5waWNrZWQgJiYgb2JqZWN0SW5mby5sYXllci5wcm9wcy5pZCA9PT0gdGhpcy5pZFxuICAgICk7XG4gIH1cblxuICBnZXRSYWRpdXNTY2FsZUJ5Wm9vbShtYXBTdGF0ZSwgZml4ZWRSYWRpdXMpIHtcbiAgICBjb25zdCByYWRpdXNDaGFubmVsID0gT2JqZWN0LnZhbHVlcyh0aGlzLnZpc3VhbENoYW5uZWxzKS5maW5kKHZjID0+IHZjLnByb3BlcnR5ID09PSAncmFkaXVzJyk7XG5cbiAgICBpZiAoIXJhZGl1c0NoYW5uZWwpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH1cblxuICAgIGNvbnN0IGZpZWxkID0gcmFkaXVzQ2hhbm5lbC5maWVsZDtcbiAgICBjb25zdCBmaXhlZCA9IGZpeGVkUmFkaXVzID09PSB1bmRlZmluZWQgPyB0aGlzLmNvbmZpZy52aXNDb25maWcuZml4ZWRSYWRpdXMgOiBmaXhlZFJhZGl1cztcbiAgICBjb25zdCB7cmFkaXVzfSA9IHRoaXMuY29uZmlnLnZpc0NvbmZpZztcblxuICAgIHJldHVybiBmaXhlZCA/IDEgOiAodGhpcy5jb25maWdbZmllbGRdID8gMSA6IHJhZGl1cykgKiB0aGlzLmdldFpvb21GYWN0b3IobWFwU3RhdGUpO1xuICB9XG5cbiAgc2hvdWxkQ2FsY3VsYXRlTGF5ZXJEYXRhKHByb3BzKSB7XG4gICAgcmV0dXJuIHByb3BzLnNvbWUocCA9PiAhdGhpcy5ub25lTGF5ZXJEYXRhQWZmZWN0aW5nUHJvcHMuaW5jbHVkZXMocCkpO1xuICB9XG5cbiAgZ2V0QnJ1c2hpbmdFeHRlbnNpb25Qcm9wcyhpbnRlcmFjdGlvbkNvbmZpZywgYnJ1c2hpbmdUYXJnZXQpIHtcbiAgICBjb25zdCB7YnJ1c2h9ID0gaW50ZXJhY3Rpb25Db25maWc7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLy8gYnJ1c2hpbmdcbiAgICAgIGF1dG9IaWdobGlnaHQ6ICFicnVzaC5lbmFibGVkLFxuICAgICAgYnJ1c2hpbmdSYWRpdXM6IGJydXNoLmNvbmZpZy5zaXplICogMTAwMCxcbiAgICAgIGJydXNoaW5nVGFyZ2V0OiBicnVzaGluZ1RhcmdldCB8fCAnc291cmNlJyxcbiAgICAgIGJydXNoaW5nRW5hYmxlZDogYnJ1c2guZW5hYmxlZFxuICAgIH07XG4gIH1cblxuICBnZXREZWZhdWx0RGVja0xheWVyUHJvcHMoe2lkeCwgZ3B1RmlsdGVyLCBtYXBTdGF0ZX0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICBpZHgsXG4gICAgICBjb29yZGluYXRlU3lzdGVtOiBDT09SRElOQVRFX1NZU1RFTS5MTkdMQVQsXG4gICAgICBwaWNrYWJsZTogdHJ1ZSxcbiAgICAgIHdyYXBMb25naXR1ZGU6IHRydWUsXG4gICAgICBwYXJhbWV0ZXJzOiB7ZGVwdGhUZXN0OiBCb29sZWFuKG1hcFN0YXRlLmRyYWdSb3RhdGUgfHwgdGhpcy5jb25maWcudmlzQ29uZmlnLmVuYWJsZTNkKX0sXG4gICAgICBoaWRkZW46IHRoaXMuY29uZmlnLmhpZGRlbixcbiAgICAgIC8vIHZpc2NvbmZpZ1xuICAgICAgb3BhY2l0eTogdGhpcy5jb25maWcudmlzQ29uZmlnLm9wYWNpdHksXG4gICAgICBoaWdobGlnaHRDb2xvcjogdGhpcy5jb25maWcuaGlnaGxpZ2h0Q29sb3IsXG4gICAgICAvLyBkYXRhIGZpbHRlcmluZ1xuICAgICAgZXh0ZW5zaW9uczogW2RhdGFGaWx0ZXJFeHRlbnNpb25dLFxuICAgICAgZmlsdGVyUmFuZ2U6IGdwdUZpbHRlci5maWx0ZXJSYW5nZVxuICAgIH07XG4gIH1cblxuICBnZXREZWZhdWx0SG92ZXJMYXllclByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogYCR7dGhpcy5pZH0taG92ZXJlZGAsXG4gICAgICBwaWNrYWJsZTogZmFsc2UsXG4gICAgICB3cmFwTG9uZ2l0dWRlOiB0cnVlLFxuICAgICAgY29vcmRpbmF0ZVN5c3RlbTogQ09PUkRJTkFURV9TWVNURU0uTE5HTEFUXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlclRleHRMYWJlbExheWVyKHtnZXRQb3NpdGlvbiwgZ2V0UGl4ZWxPZmZzZXQsIHVwZGF0ZVRyaWdnZXJzLCBzaGFyZWRQcm9wc30sIHJlbmRlck9wdHMpIHtcbiAgICBjb25zdCB7ZGF0YSwgbWFwU3RhdGV9ID0gcmVuZGVyT3B0cztcbiAgICBjb25zdCB7dGV4dExhYmVsfSA9IHRoaXMuY29uZmlnO1xuXG4gICAgcmV0dXJuIGRhdGEudGV4dExhYmVscy5yZWR1Y2UoKGFjY3UsIGQsIGkpID0+IHtcbiAgICAgIGlmIChkLmdldFRleHQpIHtcbiAgICAgICAgYWNjdS5wdXNoKFxuICAgICAgICAgIG5ldyBUZXh0TGF5ZXIoe1xuICAgICAgICAgICAgLi4uc2hhcmVkUHJvcHMsXG4gICAgICAgICAgICBpZDogYCR7dGhpcy5pZH0tbGFiZWwtJHt0ZXh0TGFiZWxbaV0uZmllbGQubmFtZX1gLFxuICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhLFxuICAgICAgICAgICAgZ2V0VGV4dDogZC5nZXRUZXh0LFxuICAgICAgICAgICAgZ2V0UG9zaXRpb24sXG4gICAgICAgICAgICBjaGFyYWN0ZXJTZXQ6IGQuY2hhcmFjdGVyU2V0LFxuICAgICAgICAgICAgZ2V0UGl4ZWxPZmZzZXQ6IGdldFBpeGVsT2Zmc2V0KHRleHRMYWJlbFtpXSksXG4gICAgICAgICAgICBnZXRTaXplOiAxLFxuICAgICAgICAgICAgc2l6ZVNjYWxlOiB0ZXh0TGFiZWxbaV0uc2l6ZSxcbiAgICAgICAgICAgIGdldFRleHRBbmNob3I6IHRleHRMYWJlbFtpXS5hbmNob3IsXG4gICAgICAgICAgICBnZXRBbGlnbm1lbnRCYXNlbGluZTogdGV4dExhYmVsW2ldLmFsaWdubWVudCxcbiAgICAgICAgICAgIGdldENvbG9yOiB0ZXh0TGFiZWxbaV0uY29sb3IsXG4gICAgICAgICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICAgIC8vIHRleHQgd2lsbCBhbHdheXMgc2hvdyBvbiB0b3Agb2YgYWxsIGxheWVyc1xuICAgICAgICAgICAgICBkZXB0aFRlc3Q6IGZhbHNlXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBnZXRGaWx0ZXJWYWx1ZTogZGF0YS5nZXRGaWx0ZXJWYWx1ZSxcbiAgICAgICAgICAgIHVwZGF0ZVRyaWdnZXJzOiB7XG4gICAgICAgICAgICAgIC4uLnVwZGF0ZVRyaWdnZXJzLFxuICAgICAgICAgICAgICBnZXRUZXh0OiB0ZXh0TGFiZWxbaV0uZmllbGQubmFtZSxcbiAgICAgICAgICAgICAgZ2V0UGl4ZWxPZmZzZXQ6IHtcbiAgICAgICAgICAgICAgICAuLi51cGRhdGVUcmlnZ2Vycy5nZXRSYWRpdXMsXG4gICAgICAgICAgICAgICAgbWFwU3RhdGUsXG4gICAgICAgICAgICAgICAgYW5jaG9yOiB0ZXh0TGFiZWxbaV0uYW5jaG9yLFxuICAgICAgICAgICAgICAgIGFsaWdubWVudDogdGV4dExhYmVsW2ldLmFsaWdubWVudFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBnZXRUZXh0QW5jaG9yOiB0ZXh0TGFiZWxbaV0uYW5jaG9yLFxuICAgICAgICAgICAgICBnZXRBbGlnbm1lbnRCYXNlbGluZTogdGV4dExhYmVsW2ldLmFsaWdubWVudCxcbiAgICAgICAgICAgICAgZ2V0Q29sb3I6IHRleHRMYWJlbFtpXS5jb2xvclxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYWNjdTtcbiAgICB9LCBbXSk7XG4gIH1cbn1cbiJdfQ==