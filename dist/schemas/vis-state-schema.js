"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.visStateSchema = exports.visStateSchemaV1 = exports.visStateSchemaV0 = exports.propertiesV1 = exports.propertiesV0 = exports.filterPropsV1 = exports.SplitMapsSchema = exports.DimensionFieldSchema = exports.filterPropsV0 = exports.InteractionSchemaV1 = exports.FilterSchemaV0 = exports.LayerSchemaV0 = exports.layerPropsV1 = exports.layerPropsV0 = exports.dimensionPropsV0 = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = _interopRequireDefault(require("lodash.pick"));

var _versions = require("./versions");

var _filterUtils = require("../utils/filter-utils");

var _layerFactory = require("../layers/layer-factory");

var _schema = _interopRequireDefault(require("./schema"));

var _lodash2 = _interopRequireDefault(require("lodash.clonedeep"));

var _dataUtils = require("../utils/data-utils");

var _visStateSchema;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/**
 * V0 Schema
 */
var dimensionPropsV0 = ['name', 'type']; // in v0 geojson there is only sizeField
// in v1 geojson
// stroke base on -> sizeField
// height based on -> heightField
// radius based on -> radiusField
// here we make our wiredst guess on which channel sizeField belongs to

exports.dimensionPropsV0 = dimensionPropsV0;

function geojsonSizeFieldV0ToV1(config) {
  var defaultRaiuds = 10;
  var defaultRadiusRange = [0, 50]; // if extruded, sizeField is most likely used for height

  if (config.visConfig.extruded) {
    return 'heightField';
  } // if show stroke enabled, sizeField is most likely used for stroke


  if (config.visConfig.stroked) {
    return 'sizeField';
  } // if radius changed, or radius Range Changed, sizeField is most likely used for radius
  // this is the most unreliable guess, that's why we put it in the end


  if (config.visConfig.radius !== defaultRaiuds || config.visConfig.radiusRange.some(function (d, i) {
    return d !== defaultRadiusRange[i];
  })) {
    return 'radiusField';
  }

  return 'sizeField';
} // convert v0 to v1 layer config


var DimensionFieldSchemaV0 = /*#__PURE__*/function (_Schema) {
  (0, _inherits2["default"])(DimensionFieldSchemaV0, _Schema);

  var _super = _createSuper(DimensionFieldSchemaV0);

  function DimensionFieldSchemaV0() {
    var _this;

    (0, _classCallCheck2["default"])(this, DimensionFieldSchemaV0);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "version", _versions.VERSIONS.v0);
    return _this;
  }

  (0, _createClass2["default"])(DimensionFieldSchemaV0, [{
    key: "save",
    value: function save(field) {
      // should not be called anymore
      return (0, _defineProperty2["default"])({}, this.key, field !== null ? this.savePropertiesOrApplySchema(field)[this.key] : null);
    }
  }, {
    key: "load",
    value: function load(field, parents, accumulated) {
      var _parents$slice = parents.slice(-1),
          _parents$slice2 = (0, _slicedToArray2["default"])(_parents$slice, 1),
          config = _parents$slice2[0];

      var fieldName = this.key;

      if (config.type === 'geojson' && this.key === 'sizeField' && field) {
        fieldName = geojsonSizeFieldV0ToV1(config);
      } // fold into visualChannels to be load by VisualChannelSchemaV1


      return {
        visualChannels: _objectSpread(_objectSpread({}, accumulated.visualChannels || {}), {}, (0, _defineProperty2["default"])({}, fieldName, field))
      };
    }
  }]);
  return DimensionFieldSchemaV0;
}(_schema["default"]);

var DimensionScaleSchemaV0 = /*#__PURE__*/function (_Schema2) {
  (0, _inherits2["default"])(DimensionScaleSchemaV0, _Schema2);

  var _super2 = _createSuper(DimensionScaleSchemaV0);

  function DimensionScaleSchemaV0() {
    var _this2;

    (0, _classCallCheck2["default"])(this, DimensionScaleSchemaV0);

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    _this2 = _super2.call.apply(_super2, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this2), "version", _versions.VERSIONS.v0);
    return _this2;
  }

  (0, _createClass2["default"])(DimensionScaleSchemaV0, [{
    key: "save",
    value: function save(scale) {
      return (0, _defineProperty2["default"])({}, this.key, scale);
    }
  }, {
    key: "load",
    value: function load(scale, parents, accumulated) {
      var _parents$slice3 = parents.slice(-1),
          _parents$slice4 = (0, _slicedToArray2["default"])(_parents$slice3, 1),
          config = _parents$slice4[0]; // fold into visualChannels to be load by VisualChannelSchemaV1


      if (this.key === 'sizeScale' && config.type === 'geojson') {
        // sizeScale now split into radiusScale, heightScale
        // no user customization, just use default
        return {};
      }

      return {
        visualChannels: _objectSpread(_objectSpread({}, accumulated.visualChannels || {}), {}, (0, _defineProperty2["default"])({}, this.key, scale))
      };
    }
  }]);
  return DimensionScaleSchemaV0;
}(_schema["default"]); // used to convert v0 to v1 layer config


var LayerConfigSchemaV0 = /*#__PURE__*/function (_Schema3) {
  (0, _inherits2["default"])(LayerConfigSchemaV0, _Schema3);

  var _super3 = _createSuper(LayerConfigSchemaV0);

  function LayerConfigSchemaV0() {
    var _this3;

    (0, _classCallCheck2["default"])(this, LayerConfigSchemaV0);

    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    _this3 = _super3.call.apply(_super3, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this3), "version", _versions.VERSIONS.v0);
    return _this3;
  }

  (0, _createClass2["default"])(LayerConfigSchemaV0, [{
    key: "load",
    value: function load(saved, parents, accumulated) {
      // fold v0 layer property into config.key
      return {
        config: _objectSpread(_objectSpread({}, accumulated.config || {}), {}, (0, _defineProperty2["default"])({}, this.key, saved))
      };
    }
  }]);
  return LayerConfigSchemaV0;
}(_schema["default"]); // used to convert v0 to v1 layer columns
// only return column value for each column


var LayerColumnsSchemaV0 = /*#__PURE__*/function (_Schema4) {
  (0, _inherits2["default"])(LayerColumnsSchemaV0, _Schema4);

  var _super4 = _createSuper(LayerColumnsSchemaV0);

  function LayerColumnsSchemaV0() {
    var _this4;

    (0, _classCallCheck2["default"])(this, LayerColumnsSchemaV0);

    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    _this4 = _super4.call.apply(_super4, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this4), "version", _versions.VERSIONS.v0);
    return _this4;
  }

  (0, _createClass2["default"])(LayerColumnsSchemaV0, [{
    key: "load",
    value: function load(saved, parents, accumulated) {
      // fold v0 layer property into config.key, flatten columns
      return {
        config: _objectSpread(_objectSpread({}, accumulated.config || {}), {}, {
          columns: Object.keys(saved).reduce(function (accu, key) {
            return _objectSpread(_objectSpread({}, accu), {}, (0, _defineProperty2["default"])({}, key, saved[key].value));
          }, {})
        })
      };
    }
  }]);
  return LayerColumnsSchemaV0;
}(_schema["default"]); // used to convert v0 to v1 layer config.visConfig


var LayerConfigToVisConfigSchemaV0 = /*#__PURE__*/function (_Schema5) {
  (0, _inherits2["default"])(LayerConfigToVisConfigSchemaV0, _Schema5);

  var _super5 = _createSuper(LayerConfigToVisConfigSchemaV0);

  function LayerConfigToVisConfigSchemaV0() {
    var _this5;

    (0, _classCallCheck2["default"])(this, LayerConfigToVisConfigSchemaV0);

    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    _this5 = _super5.call.apply(_super5, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this5), "version", _versions.VERSIONS.v0);
    return _this5;
  }

  (0, _createClass2["default"])(LayerConfigToVisConfigSchemaV0, [{
    key: "load",
    value: function load(saved, parents, accumulated) {
      // fold v0 layer property into config.visConfig
      var accumulatedConfig = accumulated.config || {};
      return {
        config: _objectSpread(_objectSpread({}, accumulatedConfig), {}, {
          visConfig: _objectSpread(_objectSpread({}, accumulatedConfig.visConfig || {}), {}, (0, _defineProperty2["default"])({}, this.key, saved))
        })
      };
    }
  }]);
  return LayerConfigToVisConfigSchemaV0;
}(_schema["default"]);

var LayerVisConfigSchemaV0 = /*#__PURE__*/function (_Schema6) {
  (0, _inherits2["default"])(LayerVisConfigSchemaV0, _Schema6);

  var _super6 = _createSuper(LayerVisConfigSchemaV0);

  function LayerVisConfigSchemaV0() {
    var _this6;

    (0, _classCallCheck2["default"])(this, LayerVisConfigSchemaV0);

    for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
    }

    _this6 = _super6.call.apply(_super6, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this6), "version", _versions.VERSIONS.v0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this6), "key", 'visConfig');
    return _this6;
  }

  (0, _createClass2["default"])(LayerVisConfigSchemaV0, [{
    key: "load",
    value: function load(visConfig, parents, accumulator) {
      var _parents$slice5 = parents.slice(-1),
          _parents$slice6 = (0, _slicedToArray2["default"])(_parents$slice5, 1),
          config = _parents$slice6[0];

      var rename = {
        geojson: {
          extruded: 'enable3d',
          elevationRange: 'heightRange'
        }
      };

      if (config.type in rename) {
        var propToRename = rename[config.type];
        return {
          config: _objectSpread(_objectSpread({}, accumulator.config || {}), {}, {
            visConfig: Object.keys(visConfig).reduce(function (accu, key) {
              return _objectSpread(_objectSpread({}, accu), propToRename[key] ? (0, _defineProperty2["default"])({}, propToRename[key], visConfig[key]) : (0, _defineProperty2["default"])({}, key, visConfig[key]));
            }, {})
          })
        };
      }

      return {
        config: _objectSpread(_objectSpread({}, accumulator.config || {}), {}, {
          visConfig: visConfig
        })
      };
    }
  }]);
  return LayerVisConfigSchemaV0;
}(_schema["default"]);

var LayerConfigSchemaDeleteV0 = /*#__PURE__*/function (_Schema7) {
  (0, _inherits2["default"])(LayerConfigSchemaDeleteV0, _Schema7);

  var _super7 = _createSuper(LayerConfigSchemaDeleteV0);

  function LayerConfigSchemaDeleteV0() {
    var _this7;

    (0, _classCallCheck2["default"])(this, LayerConfigSchemaDeleteV0);

    for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }

    _this7 = _super7.call.apply(_super7, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this7), "version", _versions.VERSIONS.v0);
    return _this7;
  }

  (0, _createClass2["default"])(LayerConfigSchemaDeleteV0, [{
    key: "load",
    value: function load(value) {
      return {};
    }
  }]);
  return LayerConfigSchemaDeleteV0;
}(_schema["default"]);
/**
 * V0 -> V1 Changes
 * - layer is now a class
 * - config saved in a config object
 * - id, type, isAggregated is outside layer.config
 * - visualChannels is outside config, it defines available visual channel and
 *   property names for field, scale, domain and range of each visual chanel.
 * - enable3d, colorAggregation and sizeAggregation are moved into visConfig
 * - GeojsonLayer - added height, radius specific properties
 */


var layerPropsV0 = {
  id: null,
  type: null,
  // move into layer.config
  dataId: new LayerConfigSchemaV0({
    key: 'dataId'
  }),
  label: new LayerConfigSchemaV0({
    key: 'label'
  }),
  color: new LayerConfigSchemaV0({
    key: 'color'
  }),
  isVisible: new LayerConfigSchemaV0({
    key: 'isVisible'
  }),
  hidden: new LayerConfigSchemaV0({
    key: 'hidden'
  }),
  // convert visConfig
  visConfig: new LayerVisConfigSchemaV0({
    key: 'visConfig'
  }),
  // move into layer.config
  // flatten
  columns: new LayerColumnsSchemaV0(),
  // save into visualChannels
  colorField: new DimensionFieldSchemaV0({
    properties: dimensionPropsV0,
    key: 'colorField'
  }),
  colorScale: new DimensionScaleSchemaV0({
    key: 'colorScale'
  }),
  sizeField: new DimensionFieldSchemaV0({
    properties: dimensionPropsV0,
    key: 'sizeField'
  }),
  sizeScale: new DimensionScaleSchemaV0({
    key: 'sizeScale'
  }),
  // move into config.visConfig
  enable3d: new LayerConfigToVisConfigSchemaV0({
    key: 'enable3d'
  }),
  colorAggregation: new LayerConfigToVisConfigSchemaV0({
    key: 'colorAggregation'
  }),
  sizeAggregation: new LayerConfigToVisConfigSchemaV0({
    key: 'sizeAggregation'
  }),
  // delete
  isAggregated: new LayerConfigSchemaDeleteV0()
};
/**
 * V1 Schema
 */

exports.layerPropsV0 = layerPropsV0;

var ColumnSchemaV1 = /*#__PURE__*/function (_Schema8) {
  (0, _inherits2["default"])(ColumnSchemaV1, _Schema8);

  var _super8 = _createSuper(ColumnSchemaV1);

  function ColumnSchemaV1() {
    (0, _classCallCheck2["default"])(this, ColumnSchemaV1);
    return _super8.apply(this, arguments);
  }

  (0, _createClass2["default"])(ColumnSchemaV1, [{
    key: "save",
    value: function save(columns, state) {
      // starting from v1, only save column value
      // fieldIdx will be calculated during merge
      return (0, _defineProperty2["default"])({}, this.key, Object.keys(columns).reduce(function (accu, ckey) {
        return _objectSpread(_objectSpread({}, accu), {}, (0, _defineProperty2["default"])({}, ckey, columns[ckey].value));
      }, {}));
    }
  }, {
    key: "load",
    value: function load(columns) {
      return {
        columns: columns
      };
    }
  }]);
  return ColumnSchemaV1;
}(_schema["default"]);

var TextLabelSchemaV1 = /*#__PURE__*/function (_Schema9) {
  (0, _inherits2["default"])(TextLabelSchemaV1, _Schema9);

  var _super9 = _createSuper(TextLabelSchemaV1);

  function TextLabelSchemaV1() {
    (0, _classCallCheck2["default"])(this, TextLabelSchemaV1);
    return _super9.apply(this, arguments);
  }

  (0, _createClass2["default"])(TextLabelSchemaV1, [{
    key: "save",
    value: function save(textLabel) {
      return (0, _defineProperty2["default"])({}, this.key, textLabel.map(function (tl) {
        return _objectSpread(_objectSpread({}, tl), {}, {
          field: tl.field ? (0, _lodash["default"])(tl.field, ['name', 'type']) : null
        });
      }));
    }
  }, {
    key: "load",
    value: function load(textLabel) {
      return {
        textLabel: Array.isArray(textLabel) ? textLabel : [textLabel]
      };
    }
  }]);
  return TextLabelSchemaV1;
}(_schema["default"]);

var visualChannelModificationV1 = {
  geojson: function geojson(vc, parents, accumulator) {
    var _parents$slice7 = parents.slice(-1),
        _parents$slice8 = (0, _slicedToArray2["default"])(_parents$slice7, 1),
        layer = _parents$slice8[0];

    var isOld = !vc.hasOwnProperty('strokeColorField'); // make our best guess if this geojson layer contains point

    var isPoint = vc.radiusField || layer.config.visConfig.radius !== _layerFactory.LAYER_VIS_CONFIGS.radius.defaultValue;

    if (isOld && !isPoint && layer.config.visConfig.stroked) {
      // if stroked is true, copy color config to stroke color config
      return {
        strokeColorField: vc.colorField,
        strokeColorScale: vc.colorScale
      };
    }

    return {};
  }
};
/**
 * V1: save [field]: {name, type}, [scale]: '' for each channel
 */

var VisualChannelSchemaV1 = /*#__PURE__*/function (_Schema10) {
  (0, _inherits2["default"])(VisualChannelSchemaV1, _Schema10);

  var _super10 = _createSuper(VisualChannelSchemaV1);

  function VisualChannelSchemaV1() {
    (0, _classCallCheck2["default"])(this, VisualChannelSchemaV1);
    return _super10.apply(this, arguments);
  }

  (0, _createClass2["default"])(VisualChannelSchemaV1, [{
    key: "save",
    value: function save(visualChannels, parents) {
      // only save field and scale of each channel
      var _parents$slice9 = parents.slice(-1),
          _parents$slice10 = (0, _slicedToArray2["default"])(_parents$slice9, 1),
          layer = _parents$slice10[0];

      return (0, _defineProperty2["default"])({}, this.key, Object.keys(visualChannels).reduce( //  save channel to null if didn't select any field
      function (accu, key) {
        var _objectSpread8;

        return _objectSpread(_objectSpread({}, accu), {}, (_objectSpread8 = {}, (0, _defineProperty2["default"])(_objectSpread8, visualChannels[key].field, layer.config[visualChannels[key].field] ? (0, _lodash["default"])(layer.config[visualChannels[key].field], ['name', 'type']) : null), (0, _defineProperty2["default"])(_objectSpread8, visualChannels[key].scale, layer.config[visualChannels[key].scale]), _objectSpread8));
      }, {}));
    }
  }, {
    key: "load",
    value: function load(vc, parents, accumulator) {
      // fold channels into config
      var _parents$slice11 = parents.slice(-1),
          _parents$slice12 = (0, _slicedToArray2["default"])(_parents$slice11, 1),
          layer = _parents$slice12[0];

      var modified = visualChannelModificationV1[layer.type] ? visualChannelModificationV1[layer.type](vc, parents, accumulator) : {};
      return _objectSpread(_objectSpread({}, accumulator), {}, {
        config: _objectSpread(_objectSpread(_objectSpread({}, accumulator.config || {}), vc), modified)
      });
    }
  }]);
  return VisualChannelSchemaV1;
}(_schema["default"]);

var visConfigModificationV1 = {
  point: function point(visConfig, parents, accumulated) {
    var modified = {};

    var _parents$slice13 = parents.slice(-2, -1),
        _parents$slice14 = (0, _slicedToArray2["default"])(_parents$slice13, 1),
        layer = _parents$slice14[0];

    var isOld = !visConfig.hasOwnProperty('filled') && !visConfig.strokeColor && !visConfig.strokeColorRange;

    if (isOld) {
      // color color & color range to stroke color
      modified.strokeColor = layer.config.color;
      modified.strokeColorRange = (0, _lodash2["default"])(visConfig.colorRange);

      if (visConfig.outline) {
        // point layer now supports both outline and fill
        // for older schema where filled has not been added to point layer
        // set it to false
        modified.filled = false;
      }
    }

    return modified;
  },
  geojson: function geojson(visConfig, parents, accumulated) {
    // is points?
    var modified = {};

    var _parents$slice15 = parents.slice(-2, -1),
        _parents$slice16 = (0, _slicedToArray2["default"])(_parents$slice15, 1),
        layer = _parents$slice16[0];

    var isOld = layer.visualChannels && !layer.visualChannels.hasOwnProperty('strokeColorField') && !visConfig.strokeColor && !visConfig.strokeColorRange; // make our best guess if this geojson layer contains point

    var isPoint = layer.visualChannels && layer.visualChannels.radiusField || visConfig && visConfig.radius !== _layerFactory.LAYER_VIS_CONFIGS.radius.defaultValue;

    if (isOld) {
      // color color & color range to stroke color
      modified.strokeColor = layer.config.color;
      modified.strokeColorRange = (0, _lodash2["default"])(visConfig.colorRange);

      if (isPoint) {
        // if is point, set stroke to false
        modified.filled = true;
        modified.stroked = false;
      }
    }

    return modified;
  }
};

var VisConfigSchemaV1 = /*#__PURE__*/function (_Schema11) {
  (0, _inherits2["default"])(VisConfigSchemaV1, _Schema11);

  var _super11 = _createSuper(VisConfigSchemaV1);

  function VisConfigSchemaV1() {
    var _this8;

    (0, _classCallCheck2["default"])(this, VisConfigSchemaV1);

    for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
      args[_key8] = arguments[_key8];
    }

    _this8 = _super11.call.apply(_super11, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this8), "key", 'visConfig');
    return _this8;
  }

  (0, _createClass2["default"])(VisConfigSchemaV1, [{
    key: "load",
    value: function load(visConfig, parents, accumulated) {
      var _parents$slice17 = parents.slice(-2, -1),
          _parents$slice18 = (0, _slicedToArray2["default"])(_parents$slice17, 1),
          layer = _parents$slice18[0];

      var modified = visConfigModificationV1[layer.type] ? visConfigModificationV1[layer.type](visConfig, parents, accumulated) : {};
      return {
        visConfig: _objectSpread(_objectSpread({}, visConfig), modified)
      };
    }
  }]);
  return VisConfigSchemaV1;
}(_schema["default"]);

var layerPropsV1 = {
  id: null,
  type: null,
  config: new _schema["default"]({
    version: _versions.VERSIONS.v1,
    key: 'config',
    properties: {
      dataId: null,
      label: null,
      color: null,
      highlightColor: null,
      columns: new ColumnSchemaV1({
        version: _versions.VERSIONS.v1,
        key: 'columns'
      }),
      isVisible: null,
      visConfig: new VisConfigSchemaV1({
        version: _versions.VERSIONS.v1
      }),
      hidden: null,
      textLabel: new TextLabelSchemaV1({
        version: _versions.VERSIONS.v1,
        key: 'textLabel'
      })
    }
  }),
  visualChannels: new VisualChannelSchemaV1({
    version: _versions.VERSIONS.v1,
    key: 'visualChannels'
  })
};
exports.layerPropsV1 = layerPropsV1;

var LayerSchemaV0 = /*#__PURE__*/function (_Schema12) {
  (0, _inherits2["default"])(LayerSchemaV0, _Schema12);

  var _super12 = _createSuper(LayerSchemaV0);

  function LayerSchemaV0() {
    var _this9;

    (0, _classCallCheck2["default"])(this, LayerSchemaV0);

    for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
      args[_key9] = arguments[_key9];
    }

    _this9 = _super12.call.apply(_super12, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this9), "key", 'layers');
    return _this9;
  }

  (0, _createClass2["default"])(LayerSchemaV0, [{
    key: "save",
    value: function save(layers, parents) {
      var _this10 = this;

      var _parents$slice19 = parents.slice(-1),
          _parents$slice20 = (0, _slicedToArray2["default"])(_parents$slice19, 1),
          visState = _parents$slice20[0];

      return (0, _defineProperty2["default"])({}, this.key, visState.layerOrder.reduce(function (saved, index) {
        // save layers according to their rendering order
        var layer = layers[index];

        if (layer.isValidToSave()) {
          saved.push(_this10.savePropertiesOrApplySchema(layer).layers);
        }

        return saved;
      }, []));
    }
  }, {
    key: "load",
    value: function load(layers) {
      var _this11 = this;

      return (0, _defineProperty2["default"])({}, this.key, layers.map(function (layer) {
        return _this11.loadPropertiesOrApplySchema(layer, layers).layers;
      }));
    }
  }]);
  return LayerSchemaV0;
}(_schema["default"]);

exports.LayerSchemaV0 = LayerSchemaV0;

var FilterSchemaV0 = /*#__PURE__*/function (_Schema13) {
  (0, _inherits2["default"])(FilterSchemaV0, _Schema13);

  var _super13 = _createSuper(FilterSchemaV0);

  function FilterSchemaV0() {
    var _this12;

    (0, _classCallCheck2["default"])(this, FilterSchemaV0);

    for (var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
      args[_key10] = arguments[_key10];
    }

    _this12 = _super13.call.apply(_super13, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this12), "key", 'filters');
    return _this12;
  }

  (0, _createClass2["default"])(FilterSchemaV0, [{
    key: "save",
    value: function save(filters) {
      var _this13 = this;

      return {
        filters: filters.filter(_filterUtils.isValidFilterValue).map(function (filter) {
          return _this13.savePropertiesOrApplySchema(filter).filters;
        })
      };
    }
  }, {
    key: "load",
    value: function load(filters) {
      return {
        filters: filters
      };
    }
  }]);
  return FilterSchemaV0;
}(_schema["default"]);

exports.FilterSchemaV0 = FilterSchemaV0;
var interactionPropsV0 = ['tooltip', 'brush'];

var InteractionSchemaV0 = /*#__PURE__*/function (_Schema14) {
  (0, _inherits2["default"])(InteractionSchemaV0, _Schema14);

  var _super14 = _createSuper(InteractionSchemaV0);

  function InteractionSchemaV0() {
    var _this14;

    (0, _classCallCheck2["default"])(this, InteractionSchemaV0);

    for (var _len11 = arguments.length, args = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
      args[_key11] = arguments[_key11];
    }

    _this14 = _super14.call.apply(_super14, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this14), "key", 'interactionConfig');
    return _this14;
  }

  (0, _createClass2["default"])(InteractionSchemaV0, [{
    key: "save",
    value: function save(interactionConfig) {
      return Array.isArray(this.properties) ? (0, _defineProperty2["default"])({}, this.key, this.properties.reduce(function (accu, key) {
        return _objectSpread(_objectSpread({}, accu), interactionConfig[key].enabled ? (0, _defineProperty2["default"])({}, key, interactionConfig[key].config) : {});
      }, {})) : {};
    }
  }, {
    key: "load",
    value: function load(interactionConfig) {
      // convert v0 -> v1
      // return enabled: false if disabled,
      return Array.isArray(this.properties) ? (0, _defineProperty2["default"])({}, this.key, this.properties.reduce(function (accu, key) {
        return _objectSpread(_objectSpread({}, accu), (0, _defineProperty2["default"])({}, key, _objectSpread(_objectSpread({}, interactionConfig[key] || {}), {}, {
          enabled: Boolean(interactionConfig[key])
        })));
      }, {})) : {};
    }
  }]);
  return InteractionSchemaV0;
}(_schema["default"]);

var interactionPropsV1 = [].concat(interactionPropsV0, ['geocoder', 'coordinate']);

var InteractionSchemaV1 = /*#__PURE__*/function (_Schema15) {
  (0, _inherits2["default"])(InteractionSchemaV1, _Schema15);

  var _super15 = _createSuper(InteractionSchemaV1);

  function InteractionSchemaV1() {
    var _this15;

    (0, _classCallCheck2["default"])(this, InteractionSchemaV1);

    for (var _len12 = arguments.length, args = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
      args[_key12] = arguments[_key12];
    }

    _this15 = _super15.call.apply(_super15, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this15), "key", 'interactionConfig');
    return _this15;
  }

  (0, _createClass2["default"])(InteractionSchemaV1, [{
    key: "save",
    value: function save(interactionConfig) {
      // save config even if disabled,
      return Array.isArray(this.properties) ? (0, _defineProperty2["default"])({}, this.key, this.properties.reduce(function (accu, key) {
        return _objectSpread(_objectSpread({}, accu), {}, (0, _defineProperty2["default"])({}, key, _objectSpread(_objectSpread({}, interactionConfig[key].config), {}, {
          enabled: interactionConfig[key].enabled
        })));
      }, {})) : {};
    }
  }, {
    key: "load",
    value: function load(interactionConfig) {
      var _this16 = this;

      var modifiedConfig = interactionConfig;
      Object.keys(interactionConfig).forEach(function (configType) {
        if (configType === 'tooltip') {
          var fieldsToShow = modifiedConfig[configType].fieldsToShow;

          if (!(0, _dataUtils.notNullorUndefined)(fieldsToShow)) {
            return (0, _defineProperty2["default"])({}, _this16.key, modifiedConfig);
          }

          Object.keys(fieldsToShow).forEach(function (key) {
            fieldsToShow[key] = fieldsToShow[key].map(function (fieldData) {
              if (!fieldData.name) {
                return {
                  name: fieldData,
                  format: null
                };
              }

              return fieldData;
            });
          });
        }

        return;
      });
      return (0, _defineProperty2["default"])({}, this.key, modifiedConfig);
    }
  }]);
  return InteractionSchemaV1;
}(_schema["default"]);

exports.InteractionSchemaV1 = InteractionSchemaV1;
var filterPropsV0 = {
  dataId: null,
  id: null,
  name: null,
  type: null,
  value: null,
  enlarged: null
};
exports.filterPropsV0 = filterPropsV0;

var DimensionFieldSchema = /*#__PURE__*/function (_Schema16) {
  (0, _inherits2["default"])(DimensionFieldSchema, _Schema16);

  var _super16 = _createSuper(DimensionFieldSchema);

  function DimensionFieldSchema() {
    (0, _classCallCheck2["default"])(this, DimensionFieldSchema);
    return _super16.apply(this, arguments);
  }

  (0, _createClass2["default"])(DimensionFieldSchema, [{
    key: "save",
    value: function save(field) {
      return (0, _defineProperty2["default"])({}, this.key, field ? this.savePropertiesOrApplySchema(field)[this.key] : null);
    }
  }, {
    key: "load",
    value: function load(field) {
      return (0, _defineProperty2["default"])({}, this.key, field);
    }
  }]);
  return DimensionFieldSchema;
}(_schema["default"]);

exports.DimensionFieldSchema = DimensionFieldSchema;

var SplitMapsSchema = /*#__PURE__*/function (_Schema17) {
  (0, _inherits2["default"])(SplitMapsSchema, _Schema17);

  var _super17 = _createSuper(SplitMapsSchema);

  function SplitMapsSchema() {
    (0, _classCallCheck2["default"])(this, SplitMapsSchema);
    return _super17.apply(this, arguments);
  }

  (0, _createClass2["default"])(SplitMapsSchema, [{
    key: "convertLayerSettings",
    value: function convertLayerSettings(accu, _ref18) {
      var _ref19 = (0, _slicedToArray2["default"])(_ref18, 2),
          key = _ref19[0],
          value = _ref19[1];

      if (typeof value === 'boolean') {
        return _objectSpread(_objectSpread({}, accu), {}, (0, _defineProperty2["default"])({}, key, value));
      } else if (value && (0, _typeof2["default"])(value) === 'object' && value.isAvailable) {
        return _objectSpread(_objectSpread({}, accu), {}, (0, _defineProperty2["default"])({}, key, Boolean(value.isVisible)));
      }

      return accu;
    }
  }, {
    key: "load",
    value: function load(splitMaps) {
      var _this17 = this;

      // previous splitMaps Schema {layers: {layerId: {isVisible, isAvailable}}}
      if (!Array.isArray(splitMaps) || !splitMaps.length) {
        return {
          splitMaps: []
        };
      }

      return {
        splitMaps: splitMaps.map(function (settings) {
          return _objectSpread(_objectSpread({}, settings), {}, {
            layers: Object.entries(settings.layers || {}).reduce(_this17.convertLayerSettings, {})
          });
        })
      };
    }
  }]);
  return SplitMapsSchema;
}(_schema["default"]);

exports.SplitMapsSchema = SplitMapsSchema;

var filterPropsV1 = _objectSpread(_objectSpread({}, filterPropsV0), {}, {
  plotType: null,
  animationWindow: null,
  yAxis: new DimensionFieldSchema({
    version: _versions.VERSIONS.v1,
    key: 'yAxis',
    properties: {
      name: null,
      type: null
    }
  }),
  // polygon filter properties
  layerId: null,
  speed: null
});

exports.filterPropsV1 = filterPropsV1;
var propertiesV0 = {
  filters: new FilterSchemaV0({
    version: _versions.VERSIONS.v0,
    properties: filterPropsV0
  }),
  layers: new LayerSchemaV0({
    version: _versions.VERSIONS.v0,
    properties: layerPropsV0
  }),
  interactionConfig: new InteractionSchemaV0({
    version: _versions.VERSIONS.v0,
    properties: interactionPropsV0
  }),
  layerBlending: null
};
exports.propertiesV0 = propertiesV0;
var propertiesV1 = {
  filters: new FilterSchemaV0({
    version: _versions.VERSIONS.v1,
    properties: filterPropsV1
  }),
  layers: new LayerSchemaV0({
    version: _versions.VERSIONS.v1,
    properties: layerPropsV1
  }),
  interactionConfig: new InteractionSchemaV1({
    version: _versions.VERSIONS.v1,
    properties: interactionPropsV1
  }),
  layerBlending: null,
  splitMaps: new SplitMapsSchema({
    key: 'splitMaps',
    version: _versions.VERSIONS.v1
  }),
  animationConfig: new _schema["default"]({
    version: _versions.VERSIONS.v1,
    properties: {
      currentTime: null,
      speed: null
    },
    key: 'animationConfig'
  })
};
exports.propertiesV1 = propertiesV1;
var visStateSchemaV0 = new _schema["default"]({
  version: _versions.VERSIONS.v0,
  properties: propertiesV0,
  key: 'visState'
});
exports.visStateSchemaV0 = visStateSchemaV0;
var visStateSchemaV1 = new _schema["default"]({
  version: _versions.VERSIONS.v1,
  properties: propertiesV1,
  key: 'visState'
});
exports.visStateSchemaV1 = visStateSchemaV1;
var visStateSchema = (_visStateSchema = {}, (0, _defineProperty2["default"])(_visStateSchema, _versions.VERSIONS.v0, {
  save: function save(toSave) {
    return visStateSchemaV0.save(toSave);
  },
  load: function load(toLoad) {
    return visStateSchemaV1.load(visStateSchemaV0.load(toLoad).visState);
  }
}), (0, _defineProperty2["default"])(_visStateSchema, _versions.VERSIONS.v1, visStateSchemaV1), _visStateSchema); // test load v0

exports.visStateSchema = visStateSchema;
var _default = visStateSchema;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL3Zpcy1zdGF0ZS1zY2hlbWEuanMiXSwibmFtZXMiOlsiZGltZW5zaW9uUHJvcHNWMCIsImdlb2pzb25TaXplRmllbGRWMFRvVjEiLCJjb25maWciLCJkZWZhdWx0UmFpdWRzIiwiZGVmYXVsdFJhZGl1c1JhbmdlIiwidmlzQ29uZmlnIiwiZXh0cnVkZWQiLCJzdHJva2VkIiwicmFkaXVzIiwicmFkaXVzUmFuZ2UiLCJzb21lIiwiZCIsImkiLCJEaW1lbnNpb25GaWVsZFNjaGVtYVYwIiwiVkVSU0lPTlMiLCJ2MCIsImZpZWxkIiwia2V5Iiwic2F2ZVByb3BlcnRpZXNPckFwcGx5U2NoZW1hIiwicGFyZW50cyIsImFjY3VtdWxhdGVkIiwic2xpY2UiLCJmaWVsZE5hbWUiLCJ0eXBlIiwidmlzdWFsQ2hhbm5lbHMiLCJTY2hlbWEiLCJEaW1lbnNpb25TY2FsZVNjaGVtYVYwIiwic2NhbGUiLCJMYXllckNvbmZpZ1NjaGVtYVYwIiwic2F2ZWQiLCJMYXllckNvbHVtbnNTY2hlbWFWMCIsImNvbHVtbnMiLCJPYmplY3QiLCJrZXlzIiwicmVkdWNlIiwiYWNjdSIsInZhbHVlIiwiTGF5ZXJDb25maWdUb1Zpc0NvbmZpZ1NjaGVtYVYwIiwiYWNjdW11bGF0ZWRDb25maWciLCJMYXllclZpc0NvbmZpZ1NjaGVtYVYwIiwiYWNjdW11bGF0b3IiLCJyZW5hbWUiLCJnZW9qc29uIiwiZWxldmF0aW9uUmFuZ2UiLCJwcm9wVG9SZW5hbWUiLCJMYXllckNvbmZpZ1NjaGVtYURlbGV0ZVYwIiwibGF5ZXJQcm9wc1YwIiwiaWQiLCJkYXRhSWQiLCJsYWJlbCIsImNvbG9yIiwiaXNWaXNpYmxlIiwiaGlkZGVuIiwiY29sb3JGaWVsZCIsInByb3BlcnRpZXMiLCJjb2xvclNjYWxlIiwic2l6ZUZpZWxkIiwic2l6ZVNjYWxlIiwiZW5hYmxlM2QiLCJjb2xvckFnZ3JlZ2F0aW9uIiwic2l6ZUFnZ3JlZ2F0aW9uIiwiaXNBZ2dyZWdhdGVkIiwiQ29sdW1uU2NoZW1hVjEiLCJzdGF0ZSIsImNrZXkiLCJUZXh0TGFiZWxTY2hlbWFWMSIsInRleHRMYWJlbCIsIm1hcCIsInRsIiwiQXJyYXkiLCJpc0FycmF5IiwidmlzdWFsQ2hhbm5lbE1vZGlmaWNhdGlvblYxIiwidmMiLCJsYXllciIsImlzT2xkIiwiaGFzT3duUHJvcGVydHkiLCJpc1BvaW50IiwicmFkaXVzRmllbGQiLCJMQVlFUl9WSVNfQ09ORklHUyIsImRlZmF1bHRWYWx1ZSIsInN0cm9rZUNvbG9yRmllbGQiLCJzdHJva2VDb2xvclNjYWxlIiwiVmlzdWFsQ2hhbm5lbFNjaGVtYVYxIiwibW9kaWZpZWQiLCJ2aXNDb25maWdNb2RpZmljYXRpb25WMSIsInBvaW50Iiwic3Ryb2tlQ29sb3IiLCJzdHJva2VDb2xvclJhbmdlIiwiY29sb3JSYW5nZSIsIm91dGxpbmUiLCJmaWxsZWQiLCJWaXNDb25maWdTY2hlbWFWMSIsImxheWVyUHJvcHNWMSIsInZlcnNpb24iLCJ2MSIsImhpZ2hsaWdodENvbG9yIiwiTGF5ZXJTY2hlbWFWMCIsImxheWVycyIsInZpc1N0YXRlIiwibGF5ZXJPcmRlciIsImluZGV4IiwiaXNWYWxpZFRvU2F2ZSIsInB1c2giLCJsb2FkUHJvcGVydGllc09yQXBwbHlTY2hlbWEiLCJGaWx0ZXJTY2hlbWFWMCIsImZpbHRlcnMiLCJmaWx0ZXIiLCJpc1ZhbGlkRmlsdGVyVmFsdWUiLCJpbnRlcmFjdGlvblByb3BzVjAiLCJJbnRlcmFjdGlvblNjaGVtYVYwIiwiaW50ZXJhY3Rpb25Db25maWciLCJlbmFibGVkIiwiQm9vbGVhbiIsImludGVyYWN0aW9uUHJvcHNWMSIsIkludGVyYWN0aW9uU2NoZW1hVjEiLCJtb2RpZmllZENvbmZpZyIsImZvckVhY2giLCJjb25maWdUeXBlIiwiZmllbGRzVG9TaG93IiwiZmllbGREYXRhIiwibmFtZSIsImZvcm1hdCIsImZpbHRlclByb3BzVjAiLCJlbmxhcmdlZCIsIkRpbWVuc2lvbkZpZWxkU2NoZW1hIiwiU3BsaXRNYXBzU2NoZW1hIiwiaXNBdmFpbGFibGUiLCJzcGxpdE1hcHMiLCJsZW5ndGgiLCJzZXR0aW5ncyIsImVudHJpZXMiLCJjb252ZXJ0TGF5ZXJTZXR0aW5ncyIsImZpbHRlclByb3BzVjEiLCJwbG90VHlwZSIsImFuaW1hdGlvbldpbmRvdyIsInlBeGlzIiwibGF5ZXJJZCIsInNwZWVkIiwicHJvcGVydGllc1YwIiwibGF5ZXJCbGVuZGluZyIsInByb3BlcnRpZXNWMSIsImFuaW1hdGlvbkNvbmZpZyIsImN1cnJlbnRUaW1lIiwidmlzU3RhdGVTY2hlbWFWMCIsInZpc1N0YXRlU2NoZW1hVjEiLCJ2aXNTdGF0ZVNjaGVtYSIsInNhdmUiLCJ0b1NhdmUiLCJsb2FkIiwidG9Mb2FkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBO0FBQ0E7QUFDQTtBQUVPLElBQU1BLGdCQUFnQixHQUFHLENBQUMsTUFBRCxFQUFTLE1BQVQsQ0FBekIsQyxDQUVQO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUNBLFNBQVNDLHNCQUFULENBQWdDQyxNQUFoQyxFQUF3QztBQUN0QyxNQUFNQyxhQUFhLEdBQUcsRUFBdEI7QUFDQSxNQUFNQyxrQkFBa0IsR0FBRyxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTNCLENBRnNDLENBSXRDOztBQUNBLE1BQUlGLE1BQU0sQ0FBQ0csU0FBUCxDQUFpQkMsUUFBckIsRUFBK0I7QUFDN0IsV0FBTyxhQUFQO0FBQ0QsR0FQcUMsQ0FTdEM7OztBQUNBLE1BQUlKLE1BQU0sQ0FBQ0csU0FBUCxDQUFpQkUsT0FBckIsRUFBOEI7QUFDNUIsV0FBTyxXQUFQO0FBQ0QsR0FacUMsQ0FjdEM7QUFDQTs7O0FBQ0EsTUFDRUwsTUFBTSxDQUFDRyxTQUFQLENBQWlCRyxNQUFqQixLQUE0QkwsYUFBNUIsSUFDQUQsTUFBTSxDQUFDRyxTQUFQLENBQWlCSSxXQUFqQixDQUE2QkMsSUFBN0Is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LE9BQU8sRUFBRS9FLG1CQUFTZ0YsRUFEUTtBQUUxQnhDLElBQUFBLFVBQVUsRUFBRTtBQUNWd0YsTUFBQUEsV0FBVyxFQUFFLElBREg7QUFFVkwsTUFBQUEsS0FBSyxFQUFFO0FBRkcsS0FGYztBQU0xQnhILElBQUFBLEdBQUcsRUFBRTtBQU5xQixHQUFYO0FBbEJTLENBQXJCOztBQTRCQSxJQUFNOEgsZ0JBQWdCLEdBQUcsSUFBSXRILGtCQUFKLENBQVc7QUFDekNvRSxFQUFBQSxPQUFPLEVBQUUvRSxtQkFBU0MsRUFEdUI7QUFFekN1QyxFQUFBQSxVQUFVLEVBQUVvRixZQUY2QjtBQUd6Q3pILEVBQUFBLEdBQUcsRUFBRTtBQUhvQyxDQUFYLENBQXpCOztBQU1BLElBQU0rSCxnQkFBZ0IsR0FBRyxJQUFJdkgsa0JBQUosQ0FBVztBQUN6Q29FLEVBQUFBLE9BQU8sRUFBRS9FLG1CQUFTZ0YsRUFEdUI7QUFFekN4QyxFQUFBQSxVQUFVLEVBQUVzRixZQUY2QjtBQUd6QzNILEVBQUFBLEdBQUcsRUFBRTtBQUhvQyxDQUFYLENBQXpCOztBQU1BLElBQU1nSSxjQUFjLDRFQUN4Qm5JLG1CQUFTQyxFQURlLEVBQ1Y7QUFDYm1JLEVBQUFBLElBQUksRUFBRSxjQUFBQyxNQUFNO0FBQUEsV0FBSUosZ0JBQWdCLENBQUNHLElBQWpCLENBQXNCQyxNQUF0QixDQUFKO0FBQUEsR0FEQztBQUViQyxFQUFBQSxJQUFJLEVBQUUsY0FBQUMsTUFBTTtBQUFBLFdBQUlMLGdCQUFnQixDQUFDSSxJQUFqQixDQUFzQkwsZ0JBQWdCLENBQUNLLElBQWpCLENBQXNCQyxNQUF0QixFQUE4Qm5ELFFBQXBELENBQUo7QUFBQTtBQUZDLENBRFUscURBS3hCcEYsbUJBQVNnRixFQUxlLEVBS1ZrRCxnQkFMVSxtQkFBcEIsQyxDQVFQOzs7ZUFDZUMsYyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBwaWNrIGZyb20gJ2xvZGFzaC5waWNrJztcbmltcG9ydCB7VkVSU0lPTlN9IGZyb20gJy4vdmVyc2lvbnMnO1xuaW1wb3J0IHtpc1ZhbGlkRmlsdGVyVmFsdWV9IGZyb20gJ3V0aWxzL2ZpbHRlci11dGlscyc7XG5pbXBvcnQge0xBWUVSX1ZJU19DT05GSUdTfSBmcm9tICdsYXllcnMvbGF5ZXItZmFjdG9yeSc7XG5pbXBvcnQgU2NoZW1hIGZyb20gJy4vc2NoZW1hJztcbmltcG9ydCBjbG9uZURlZXAgZnJvbSAnbG9kYXNoLmNsb25lZGVlcCc7XG5pbXBvcnQge25vdE51bGxvclVuZGVmaW5lZH0gZnJvbSAndXRpbHMvZGF0YS11dGlscyc7XG5cbi8qKlxuICogVjAgU2NoZW1hXG4gKi9cblxuZXhwb3J0IGNvbnN0IGRpbWVuc2lvblByb3BzVjAgPSBbJ25hbWUnLCAndHlwZSddO1xuXG4vLyBpbiB2MCBnZW9qc29uIHRoZXJlIGlzIG9ubHkgc2l6ZUZpZWxkXG5cbi8vIGluIHYxIGdlb2pzb25cbi8vIHN0cm9rZSBiYXNlIG9uIC0+IHNpemVGaWVsZFxuLy8gaGVpZ2h0IGJhc2VkIG9uIC0+IGhlaWdodEZpZWxkXG4vLyByYWRpdXMgYmFzZWQgb24gLT4gcmFkaXVzRmllbGRcbi8vIGhlcmUgd2UgbWFrZSBvdXIgd2lyZWRzdCBndWVzcyBvbiB3aGljaCBjaGFubmVsIHNpemVGaWVsZCBiZWxvbmdzIHRvXG5mdW5jdGlvbiBnZW9qc29uU2l6ZUZpZWxkVjBUb1YxKGNvbmZpZykge1xuICBjb25zdCBkZWZhdWx0UmFpdWRzID0gMTA7XG4gIGNvbnN0IGRlZmF1bHRSYWRpdXNSYW5nZSA9IFswLCA1MF07XG5cbiAgLy8gaWYgZXh0cnVkZWQsIHNpemVGaWVsZCBpcyBtb3N0IGxpa2VseSB1c2VkIGZvciBoZWlnaHRcbiAgaWYgKGNvbmZpZy52aXNDb25maWcuZXh0cnVkZWQpIHtcbiAgICByZXR1cm4gJ2hlaWdodEZpZWxkJztcbiAgfVxuXG4gIC8vIGlmIHNob3cgc3Ryb2tlIGVuYWJsZWQsIHNpemVGaWVsZCBpcyBtb3N0IGxpa2VseSB1c2VkIGZvciBzdHJva2VcbiAgaWYgKGNvbmZpZy52aXNDb25maWcuc3Ryb2tlZCkge1xuICAgIHJldHVybiAnc2l6ZUZpZWxkJztcbiAgfVxuXG4gIC8vIGlmIHJhZGl1cyBjaGFuZ2VkLCBvciByYWRpdXMgUmFuZ2UgQ2hhbmdlZCwgc2l6ZUZpZWxkIGlzIG1vc3QgbGlrZWx5IHVzZWQgZm9yIHJhZGl1c1xuICAvLyB0aGlzIGlzIHRoZSBtb3N0IHVucmVsaWFibGUgZ3Vlc3MsIHRoYXQncyB3aHkgd2UgcHV0IGl0IGluIHRoZSBlbmRcbiAgaWYgKFxuICAgIGNvbmZpZy52aXNDb25maWcucmFkaXVzICE9PSBkZWZhdWx0UmFpdWRzIHx8XG4gICAgY29uZmlnLnZpc0NvbmZpZy5yYWRpdXNSYW5nZS5zb21lKChkLCBpKSA9PiBkICE9PSBkZWZhdWx0UmFkaXVzUmFuZ2VbaV0pXG4gICkge1xuICAgIHJldHVybiAncmFkaXVzRmllbGQnO1xuICB9XG5cbiAgcmV0dXJuICdzaXplRmllbGQnO1xufVxuXG4vLyBjb252ZXJ0IHYwIHRvIHYxIGxheWVyIGNvbmZpZ1xuY2xhc3MgRGltZW5zaW9uRmllbGRTY2hlbWFWMCBleHRlbmRzIFNjaGVtYSB7XG4gIHZlcnNpb24gPSBWRVJTSU9OUy52MDtcbiAgc2F2ZShmaWVsZCkge1xuICAgIC8vIHNob3VsZCBub3QgYmUgY2FsbGVkIGFueW1vcmVcbiAgICByZXR1cm4ge1xuICAgICAgW3RoaXMua2V5XTogZmllbGQgIT09IG51bGwgPyB0aGlzLnNhdmVQcm9wZXJ0aWVzT3JBcHBseVNjaGVtYShmaWVsZClbdGhpcy5rZXldIDogbnVsbFxuICAgIH07XG4gIH1cblxuICBsb2FkKGZpZWxkLCBwYXJlbnRzLCBhY2N1bXVsYXRlZCkge1xuICAgIGNvbnN0IFtjb25maWddID0gcGFyZW50cy5zbGljZSgtMSk7XG4gICAgbGV0IGZpZWxkTmFtZSA9IHRoaXMua2V5O1xuICAgIGlmIChjb25maWcudHlwZSA9PT0gJ2dlb2pzb24nICYmIHRoaXMua2V5ID09PSAnc2l6ZUZpZWxkJyAmJiBmaWVsZCkge1xuICAgICAgZmllbGROYW1lID0gZ2VvanNvblNpemVGaWVsZFYwVG9WMShjb25maWcpO1xuICAgIH1cbiAgICAvLyBmb2xkIGludG8gdmlzdWFsQ2hhbm5lbHMgdG8gYmUgbG9hZCBieSBWaXN1YWxDaGFubmVsU2NoZW1hVjFcbiAgICByZXR1cm4ge1xuICAgICAgdmlzdWFsQ2hhbm5lbHM6IHtcbiAgICAgICAgLi4uKGFjY3VtdWxhdGVkLnZpc3VhbENoYW5uZWxzIHx8IHt9KSxcbiAgICAgICAgW2ZpZWxkTmFtZV06IGZpZWxkXG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuXG5jbGFzcyBEaW1lbnNpb25TY2FsZVNjaGVtYVYwIGV4dGVuZHMgU2NoZW1hIHtcbiAgdmVyc2lvbiA9IFZFUlNJT05TLnYwO1xuICBzYXZlKHNjYWxlKSB7XG4gICAgcmV0dXJuIHtbdGhpcy5rZXldOiBzY2FsZX07XG4gIH1cbiAgbG9hZChzY2FsZSwgcGFyZW50cywgYWNjdW11bGF0ZWQpIHtcbiAgICBjb25zdCBbY29uZmlnXSA9IHBhcmVudHMuc2xpY2UoLTEpO1xuICAgIC8vIGZvbGQgaW50byB2aXN1YWxDaGFubmVscyB0byBiZSBsb2FkIGJ5IFZpc3VhbENoYW5uZWxTY2hlbWFWMVxuICAgIGlmICh0aGlzLmtleSA9PT0gJ3NpemVTY2FsZScgJiYgY29uZmlnLnR5cGUgPT09ICdnZW9qc29uJykge1xuICAgICAgLy8gc2l6ZVNjYWxlIG5vdyBzcGxpdCBpbnRvIHJhZGl1c1NjYWxlLCBoZWlnaHRTY2FsZVxuICAgICAgLy8gbm8gdXNlciBjdXN0b21pemF0aW9uLCBqdXN0IHVzZSBkZWZhdWx0XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHZpc3VhbENoYW5uZWxzOiB7XG4gICAgICAgIC4uLihhY2N1bXVsYXRlZC52aXN1YWxDaGFubmVscyB8fCB7fSksXG4gICAgICAgIFt0aGlzLmtleV06IHNjYWxlXG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuXG4vLyB1c2VkIHRvIGNvbnZlcnQgdjAgdG8gdjEgbGF5ZXIgY29uZmlnXG5jbGFzcyBMYXllckNvbmZpZ1NjaGVtYVYwIGV4dGVuZHMgU2NoZW1hIHtcbiAgdmVyc2lvbiA9IFZFUlNJT05TLnYwO1xuICBsb2FkKHNhdmVkLCBwYXJlbnRzLCBhY2N1bXVsYXRlZCkge1xuICAgIC8vIGZvbGQgdjAgbGF5ZXIgcHJvcGVydHkgaW50byBjb25maWcua2V5XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmZpZzoge1xuICAgICAgICAuLi4oYWNjdW11bGF0ZWQuY29uZmlnIHx8IHt9KSxcbiAgICAgICAgW3RoaXMua2V5XTogc2F2ZWRcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG5cbi8vIHVzZWQgdG8gY29udmVydCB2MCB0byB2MSBsYXllciBjb2x1bW5zXG4vLyBvbmx5IHJldHVybiBjb2x1bW4gdmFsdWUgZm9yIGVhY2ggY29sdW1uXG5jbGFzcyBMYXllckNvbHVtbnNTY2hlbWFWMCBleHRlbmRzIFNjaGVtYSB7XG4gIHZlcnNpb24gPSBWRVJTSU9OUy52MDtcbiAgbG9hZChzYXZlZCwgcGFyZW50cywgYWNjdW11bGF0ZWQpIHtcbiAgICAvLyBmb2xkIHYwIGxheWVyIHByb3BlcnR5IGludG8gY29uZmlnLmtleSwgZmxhdHRlbiBjb2x1bW5zXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmZpZzoge1xuICAgICAgICAuLi4oYWNjdW11bGF0ZWQuY29uZmlnIHx8IHt9KSxcbiAgICAgICAgY29sdW1uczogT2JqZWN0LmtleXMoc2F2ZWQpLnJlZHVjZShcbiAgICAgICAgICAoYWNjdSwga2V5KSA9PiAoe1xuICAgICAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgICAgIFtrZXldOiBzYXZlZFtrZXldLnZhbHVlXG4gICAgICAgICAgfSksXG4gICAgICAgICAge31cbiAgICAgICAgKVxuICAgICAgfVxuICAgIH07XG4gIH1cbn1cblxuLy8gdXNlZCB0byBjb252ZXJ0IHYwIHRvIHYxIGxheWVyIGNvbmZpZy52aXNDb25maWdcbmNsYXNzIExheWVyQ29uZmlnVG9WaXNDb25maWdTY2hlbWFWMCBleHRlbmRzIFNjaGVtYSB7XG4gIHZlcnNpb24gPSBWRVJTSU9OUy52MDtcbiAgbG9hZChzYXZlZCwgcGFyZW50cywgYWNjdW11bGF0ZWQpIHtcbiAgICAvLyBmb2xkIHYwIGxheWVyIHByb3BlcnR5IGludG8gY29uZmlnLnZpc0NvbmZpZ1xuICAgIGNvbnN0IGFjY3VtdWxhdGVkQ29uZmlnID0gYWNjdW11bGF0ZWQuY29uZmlnIHx8IHt9O1xuICAgIHJldHVybiB7XG4gICAgICBjb25maWc6IHtcbiAgICAgICAgLi4uYWNjdW11bGF0ZWRDb25maWcsXG4gICAgICAgIHZpc0NvbmZpZzoge1xuICAgICAgICAgIC4uLihhY2N1bXVsYXRlZENvbmZpZy52aXNDb25maWcgfHwge30pLFxuICAgICAgICAgIFt0aGlzLmtleV06IHNhdmVkXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG5cbmNsYXNzIExheWVyVmlzQ29uZmlnU2NoZW1hVjAgZXh0ZW5kcyBTY2hlbWEge1xuICB2ZXJzaW9uID0gVkVSU0lPTlMudjA7XG4gIGtleSA9ICd2aXNDb25maWcnO1xuXG4gIGxvYWQodmlzQ29uZmlnLCBwYXJlbnRzLCBhY2N1bXVsYXRvcikge1xuICAgIGNvbnN0IFtjb25maWddID0gcGFyZW50cy5zbGljZSgtMSk7XG4gICAgY29uc3QgcmVuYW1lID0ge1xuICAgICAgZ2VvanNvbjoge1xuICAgICAgICBleHRydWRlZDogJ2VuYWJsZTNkJyxcbiAgICAgICAgZWxldmF0aW9uUmFuZ2U6ICdoZWlnaHRSYW5nZSdcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKGNvbmZpZy50eXBlIGluIHJlbmFtZSkge1xuICAgICAgY29uc3QgcHJvcFRvUmVuYW1lID0gcmVuYW1lW2NvbmZpZy50eXBlXTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgIC4uLihhY2N1bXVsYXRvci5jb25maWcgfHwge30pLFxuICAgICAgICAgIHZpc0NvbmZpZzogT2JqZWN0LmtleXModmlzQ29uZmlnKS5yZWR1Y2UoXG4gICAgICAgICAgICAoYWNjdSwga2V5KSA9PiAoe1xuICAgICAgICAgICAgICAuLi5hY2N1LFxuICAgICAgICAgICAgICAuLi4ocHJvcFRvUmVuYW1lW2tleV1cbiAgICAgICAgICAgICAgICA/IHtbcHJvcFRvUmVuYW1lW2tleV1dOiB2aXNDb25maWdba2V5XX1cbiAgICAgICAgICAgICAgICA6IHtba2V5XTogdmlzQ29uZmlnW2tleV19KVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB7fVxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgY29uZmlnOiB7XG4gICAgICAgIC4uLihhY2N1bXVsYXRvci5jb25maWcgfHwge30pLFxuICAgICAgICB2aXNDb25maWdcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG5cbmNsYXNzIExheWVyQ29uZmlnU2NoZW1hRGVsZXRlVjAgZXh0ZW5kcyBTY2hlbWEge1xuICB2ZXJzaW9uID0gVkVSU0lPTlMudjA7XG4gIGxvYWQodmFsdWUpIHtcbiAgICByZXR1cm4ge307XG4gIH1cbn1cblxuLyoqXG4gKiBWMCAtPiBWMSBDaGFuZ2VzXG4gKiAtIGxheWVyIGlzIG5vdyBhIGNsYXNzXG4gKiAtIGNvbmZpZyBzYXZlZCBpbiBhIGNvbmZpZyBvYmplY3RcbiAqIC0gaWQsIHR5cGUsIGlzQWdncmVnYXRlZCBpcyBvdXRzaWRlIGxheWVyLmNvbmZpZ1xuICogLSB2aXN1YWxDaGFubmVscyBpcyBvdXRzaWRlIGNvbmZpZywgaXQgZGVmaW5lcyBhdmFpbGFibGUgdmlzdWFsIGNoYW5uZWwgYW5kXG4gKiAgIHByb3BlcnR5IG5hbWVzIGZvciBmaWVsZCwgc2NhbGUsIGRvbWFpbiBhbmQgcmFuZ2Ugb2YgZWFjaCB2aXN1YWwgY2hhbmVsLlxuICogLSBlbmFibGUzZCwgY29sb3JBZ2dyZWdhdGlvbiBhbmQgc2l6ZUFnZ3JlZ2F0aW9uIGFyZSBtb3ZlZCBpbnRvIHZpc0NvbmZpZ1xuICogLSBHZW9qc29uTGF5ZXIgLSBhZGRlZCBoZWlnaHQsIHJhZGl1cyBzcGVjaWZpYyBwcm9wZXJ0aWVzXG4gKi9cblxuZXhwb3J0IGNvbnN0IGxheWVyUHJvcHNWMCA9IHtcbiAgaWQ6IG51bGwsXG4gIHR5cGU6IG51bGwsXG5cbiAgLy8gbW92ZSBpbnRvIGxheWVyLmNvbmZpZ1xuICBkYXRhSWQ6IG5ldyBMYXllckNvbmZpZ1NjaGVtYVYwKHtrZXk6ICdkYXRhSWQnfSksXG4gIGxhYmVsOiBuZXcgTGF5ZXJDb25maWdTY2hlbWFWMCh7a2V5OiAnbGFiZWwnfSksXG4gIGNvbG9yOiBuZXcgTGF5ZXJDb25maWdTY2hlbWFWMCh7a2V5OiAnY29sb3InfSksXG4gIGlzVmlzaWJsZTogbmV3IExheWVyQ29uZmlnU2NoZW1hVjAoe2tleTogJ2lzVmlzaWJsZSd9KSxcbiAgaGlkZGVuOiBuZXcgTGF5ZXJDb25maWdTY2hlbWFWMCh7a2V5OiAnaGlkZGVuJ30pLFxuXG4gIC8vIGNvbnZlcnQgdmlzQ29uZmlnXG4gIHZpc0NvbmZpZzogbmV3IExheWVyVmlzQ29uZmlnU2NoZW1hVjAoe2tleTogJ3Zpc0NvbmZpZyd9KSxcblxuICAvLyBtb3ZlIGludG8gbGF5ZXIuY29uZmlnXG4gIC8vIGZsYXR0ZW5cbiAgY29sdW1uczogbmV3IExheWVyQ29sdW1uc1NjaGVtYVYwKCksXG5cbiAgLy8gc2F2ZSBpbnRvIHZpc3VhbENoYW5uZWxzXG4gIGNvbG9yRmllbGQ6IG5ldyBEaW1lbnNpb25GaWVsZFNjaGVtYVYwKHtcbiAgICBwcm9wZXJ0aWVzOiBkaW1lbnNpb25Qcm9wc1YwLFxuICAgIGtleTogJ2NvbG9yRmllbGQnXG4gIH0pLFxuICBjb2xvclNjYWxlOiBuZXcgRGltZW5zaW9uU2NhbGVTY2hlbWFWMCh7XG4gICAga2V5OiAnY29sb3JTY2FsZSdcbiAgfSksXG4gIHNpemVGaWVsZDogbmV3IERpbWVuc2lvbkZpZWxkU2NoZW1hVjAoe1xuICAgIHByb3BlcnRpZXM6IGRpbWVuc2lvblByb3BzVjAsXG4gICAga2V5OiAnc2l6ZUZpZWxkJ1xuICB9KSxcbiAgc2l6ZVNjYWxlOiBuZXcgRGltZW5zaW9uU2NhbGVTY2hlbWFWMCh7XG4gICAga2V5OiAnc2l6ZVNjYWxlJ1xuICB9KSxcblxuICAvLyBtb3ZlIGludG8gY29uZmlnLnZpc0NvbmZpZ1xuICBlbmFibGUzZDogbmV3IExheWVyQ29uZmlnVG9WaXNDb25maWdTY2hlbWFWMCh7a2V5OiAnZW5hYmxlM2QnfSksXG4gIGNvbG9yQWdncmVnYXRpb246IG5ldyBMYXllckNvbmZpZ1RvVmlzQ29uZmlnU2NoZW1hVjAoe1xuICAgIGtleTogJ2NvbG9yQWdncmVnYXRpb24nXG4gIH0pLFxuICBzaXplQWdncmVnYXRpb246IG5ldyBMYXllckNvbmZpZ1RvVmlzQ29uZmlnU2NoZW1hVjAoe2tleTogJ3NpemVBZ2dyZWdhdGlvbid9KSxcblxuICAvLyBkZWxldGVcbiAgaXNBZ2dyZWdhdGVkOiBuZXcgTGF5ZXJDb25maWdTY2hlbWFEZWxldGVWMCgpXG59O1xuXG4vKipcbiAqIFYxIFNjaGVtYVxuICovXG5jbGFzcyBDb2x1bW5TY2hlbWFWMSBleHRlbmRzIFNjaGVtYSB7XG4gIHNhdmUoY29sdW1ucywgc3RhdGUpIHtcbiAgICAvLyBzdGFydGluZyBmcm9tIHYxLCBvbmx5IHNhdmUgY29sdW1uIHZhbHVlXG4gICAgLy8gZmllbGRJZHggd2lsbCBiZSBjYWxjdWxhdGVkIGR1cmluZyBtZXJnZVxuICAgIHJldHVybiB7XG4gICAgICBbdGhpcy5rZXldOiBPYmplY3Qua2V5cyhjb2x1bW5zKS5yZWR1Y2UoXG4gICAgICAgIChhY2N1LCBja2V5KSA9PiAoe1xuICAgICAgICAgIC4uLmFjY3UsXG4gICAgICAgICAgW2NrZXldOiBjb2x1bW5zW2NrZXldLnZhbHVlXG4gICAgICAgIH0pLFxuICAgICAgICB7fVxuICAgICAgKVxuICAgIH07XG4gIH1cblxuICBsb2FkKGNvbHVtbnMpIHtcbiAgICByZXR1cm4ge2NvbHVtbnN9O1xuICB9XG59XG5cbmNsYXNzIFRleHRMYWJlbFNjaGVtYVYxIGV4dGVuZHMgU2NoZW1hIHtcbiAgc2F2ZSh0ZXh0TGFiZWwpIHtcbiAgICByZXR1cm4ge1xuICAgICAgW3RoaXMua2V5XTogdGV4dExhYmVsLm1hcCh0bCA9PiAoe1xuICAgICAgICAuLi50bCxcbiAgICAgICAgZmllbGQ6IHRsLmZpZWxkID8gcGljayh0bC5maWVsZCwgWyduYW1lJywgJ3R5cGUnXSkgOiBudWxsXG4gICAgICB9KSlcbiAgICB9O1xuICB9XG5cbiAgbG9hZCh0ZXh0TGFiZWwpIHtcbiAgICByZXR1cm4ge3RleHRMYWJlbDogQXJyYXkuaXNBcnJheSh0ZXh0TGFiZWwpID8gdGV4dExhYmVsIDogW3RleHRMYWJlbF19O1xuICB9XG59XG5cbmNvbnN0IHZpc3VhbENoYW5uZWxNb2RpZmljYXRpb25WMSA9IHtcbiAgZ2VvanNvbjogKHZjLCBwYXJlbnRzLCBhY2N1bXVsYXRvcikgPT4ge1xuICAgIGNvbnN0IFtsYXllcl0gPSBwYXJlbnRzLnNsaWNlKC0xKTtcbiAgICBjb25zdCBpc09sZCA9ICF2Yy5oYXNPd25Qcm9wZXJ0eSgnc3Ryb2tlQ29sb3JGaWVsZCcpO1xuICAgIC8vIG1ha2Ugb3VyIGJlc3QgZ3Vlc3MgaWYgdGhpcyBnZW9qc29uIGxheWVyIGNvbnRhaW5zIHBvaW50XG4gICAgY29uc3QgaXNQb2ludCA9XG4gICAgICB2Yy5yYWRpdXNGaWVsZCB8fCBsYXllci5jb25maWcudmlzQ29uZmlnLnJhZGl1cyAhPT0gTEFZRVJfVklTX0NPTkZJR1MucmFkaXVzLmRlZmF1bHRWYWx1ZTtcblxuICAgIGlmIChpc09sZCAmJiAhaXNQb2ludCAmJiBsYXllci5jb25maWcudmlzQ29uZmlnLnN0cm9rZWQpIHtcbiAgICAgIC8vIGlmIHN0cm9rZWQgaXMgdHJ1ZSwgY29weSBjb2xvciBjb25maWcgdG8gc3Ryb2tlIGNvbG9yIGNvbmZpZ1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3Ryb2tlQ29sb3JGaWVsZDogdmMuY29sb3JGaWVsZCxcbiAgICAgICAgc3Ryb2tlQ29sb3JTY2FsZTogdmMuY29sb3JTY2FsZVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHt9O1xuICB9XG59O1xuLyoqXG4gKiBWMTogc2F2ZSBbZmllbGRdOiB7bmFtZSwgdHlwZX0sIFtzY2FsZV06ICcnIGZvciBlYWNoIGNoYW5uZWxcbiAqL1xuY2xhc3MgVmlzdWFsQ2hhbm5lbFNjaGVtYVYxIGV4dGVuZHMgU2NoZW1hIHtcbiAgc2F2ZSh2aXN1YWxDaGFubmVscywgcGFyZW50cykge1xuICAgIC8vIG9ubHkgc2F2ZSBmaWVsZCBhbmQgc2NhbGUgb2YgZWFjaCBjaGFubmVsXG4gICAgY29uc3QgW2xheWVyXSA9IHBhcmVudHMuc2xpY2UoLTEpO1xuICAgIHJldHVybiB7XG4gICAgICBbdGhpcy5rZXldOiBPYmplY3Qua2V5cyh2aXN1YWxDaGFubmVscykucmVkdWNlKFxuICAgICAgICAvLyAgc2F2ZSBjaGFubmVsIHRvIG51bGwgaWYgZGlkbid0IHNlbGVjdCBhbnkgZmllbGRcbiAgICAgICAgKGFjY3UsIGtleSkgPT4gKHtcbiAgICAgICAgICAuLi5hY2N1LFxuICAgICAgICAgIFt2aXN1YWxDaGFubmVsc1trZXldLmZpZWxkXTogbGF5ZXIuY29uZmlnW3Zpc3VhbENoYW5uZWxzW2tleV0uZmllbGRdXG4gICAgICAgICAgICA/IHBpY2sobGF5ZXIuY29uZmlnW3Zpc3VhbENoYW5uZWxzW2tleV0uZmllbGRdLCBbJ25hbWUnLCAndHlwZSddKVxuICAgICAgICAgICAgOiBudWxsLFxuICAgICAgICAgIFt2aXN1YWxDaGFubmVsc1trZXldLnNjYWxlXTogbGF5ZXIuY29uZmlnW3Zpc3VhbENoYW5uZWxzW2tleV0uc2NhbGVdXG4gICAgICAgIH0pLFxuICAgICAgICB7fVxuICAgICAgKVxuICAgIH07XG4gIH1cbiAgbG9hZCh2YywgcGFyZW50cywgYWNjdW11bGF0b3IpIHtcbiAgICAvLyBmb2xkIGNoYW5uZWxzIGludG8gY29uZmlnXG4gICAgY29uc3QgW2xheWVyXSA9IHBhcmVudHMuc2xpY2UoLTEpO1xuICAgIGNvbnN0IG1vZGlmaWVkID0gdmlzdWFsQ2hhbm5lbE1vZGlmaWNhdGlvblYxW2xheWVyLnR5cGVdXG4gICAgICA/IHZpc3VhbENoYW5uZWxNb2RpZmljYXRpb25WMVtsYXllci50eXBlXSh2YywgcGFyZW50cywgYWNjdW11bGF0b3IpXG4gICAgICA6IHt9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmFjY3VtdWxhdG9yLFxuICAgICAgY29uZmlnOiB7XG4gICAgICAgIC4uLihhY2N1bXVsYXRvci5jb25maWcgfHwge30pLFxuICAgICAgICAuLi52YyxcbiAgICAgICAgLi4ubW9kaWZpZWRcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG5jb25zdCB2aXNDb25maWdNb2RpZmljYXRpb25WMSA9IHtcbiAgcG9pbnQ6ICh2aXNDb25maWcsIHBhcmVudHMsIGFjY3VtdWxhdGVkKSA9PiB7XG4gICAgY29uc3QgbW9kaWZpZWQgPSB7fTtcbiAgICBjb25zdCBbbGF5ZXJdID0gcGFyZW50cy5zbGljZSgtMiwgLTEpO1xuICAgIGNvbnN0IGlzT2xkID1cbiAgICAgICF2aXNDb25maWcuaGFzT3duUHJvcGVydHkoJ2ZpbGxlZCcpICYmICF2aXNDb25maWcuc3Ryb2tlQ29sb3IgJiYgIXZpc0NvbmZpZy5zdHJva2VDb2xvclJhbmdlO1xuICAgIGlmIChpc09sZCkge1xuICAgICAgLy8gY29sb3IgY29sb3IgJiBjb2xvciByYW5nZSB0byBzdHJva2UgY29sb3JcbiAgICAgIG1vZGlmaWVkLnN0cm9rZUNvbG9yID0gbGF5ZXIuY29uZmlnLmNvbG9yO1xuICAgICAgbW9kaWZpZWQuc3Ryb2tlQ29sb3JSYW5nZSA9IGNsb25lRGVlcCh2aXNDb25maWcuY29sb3JSYW5nZSk7XG4gICAgICBpZiAodmlzQ29uZmlnLm91dGxpbmUpIHtcbiAgICAgICAgLy8gcG9pbnQgbGF5ZXIgbm93IHN1cHBvcnRzIGJvdGggb3V0bGluZSBhbmQgZmlsbFxuICAgICAgICAvLyBmb3Igb2xkZXIgc2NoZW1hIHdoZXJlIGZpbGxlZCBoYXMgbm90IGJlZW4gYWRkZWQgdG8gcG9pbnQgbGF5ZXJcbiAgICAgICAgLy8gc2V0IGl0IHRvIGZhbHNlXG4gICAgICAgIG1vZGlmaWVkLmZpbGxlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtb2RpZmllZDtcbiAgfSxcbiAgZ2VvanNvbjogKHZpc0NvbmZpZywgcGFyZW50cywgYWNjdW11bGF0ZWQpID0+IHtcbiAgICAvLyBpcyBwb2ludHM/XG4gICAgY29uc3QgbW9kaWZpZWQgPSB7fTtcbiAgICBjb25zdCBbbGF5ZXJdID0gcGFyZW50cy5zbGljZSgtMiwgLTEpO1xuICAgIGNvbnN0IGlzT2xkID1cbiAgICAgIGxheWVyLnZpc3VhbENoYW5uZWxzICYmXG4gICAgICAhbGF5ZXIudmlzdWFsQ2hhbm5lbHMuaGFzT3duUHJvcGVydHkoJ3N0cm9rZUNvbG9yRmllbGQnKSAmJlxuICAgICAgIXZpc0NvbmZpZy5zdHJva2VDb2xvciAmJlxuICAgICAgIXZpc0NvbmZpZy5zdHJva2VDb2xvclJhbmdlO1xuICAgIC8vIG1ha2Ugb3VyIGJlc3QgZ3Vlc3MgaWYgdGhpcyBnZW9qc29uIGxheWVyIGNvbnRhaW5zIHBvaW50XG4gICAgY29uc3QgaXNQb2ludCA9XG4gICAgICAobGF5ZXIudmlzdWFsQ2hhbm5lbHMgJiYgbGF5ZXIudmlzdWFsQ2hhbm5lbHMucmFkaXVzRmllbGQpIHx8XG4gICAgICAodmlzQ29uZmlnICYmIHZpc0NvbmZpZy5yYWRpdXMgIT09IExBWUVSX1ZJU19DT05GSUdTLnJhZGl1cy5kZWZhdWx0VmFsdWUpO1xuXG4gICAgaWYgKGlzT2xkKSB7XG4gICAgICAvLyBjb2xvciBjb2xvciAmIGNvbG9yIHJhbmdlIHRvIHN0cm9rZSBjb2xvclxuICAgICAgbW9kaWZpZWQuc3Ryb2tlQ29sb3IgPSBsYXllci5jb25maWcuY29sb3I7XG4gICAgICBtb2RpZmllZC5zdHJva2VDb2xvclJhbmdlID0gY2xvbmVEZWVwKHZpc0NvbmZpZy5jb2xvclJhbmdlKTtcbiAgICAgIGlmIChpc1BvaW50KSB7XG4gICAgICAgIC8vIGlmIGlzIHBvaW50LCBzZXQgc3Ryb2tlIHRvIGZhbHNlXG4gICAgICAgIG1vZGlmaWVkLmZpbGxlZCA9IHRydWU7XG4gICAgICAgIG1vZGlmaWVkLnN0cm9rZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbW9kaWZpZWQ7XG4gIH1cbn07XG5cbmNsYXNzIFZpc0NvbmZpZ1NjaGVtYVYxIGV4dGVuZHMgU2NoZW1hIHtcbiAga2V5ID0gJ3Zpc0NvbmZpZyc7XG5cbiAgbG9hZCh2aXNDb25maWcsIHBhcmVudHMsIGFjY3VtdWxhdGVkKSB7XG4gICAgY29uc3QgW2xheWVyXSA9IHBhcmVudHMuc2xpY2UoLTIsIC0xKTtcbiAgICBjb25zdCBtb2RpZmllZCA9IHZpc0NvbmZpZ01vZGlmaWNhdGlvblYxW2xheWVyLnR5cGVdXG4gICAgICA/IHZpc0NvbmZpZ01vZGlmaWNhdGlvblYxW2xheWVyLnR5cGVdKHZpc0NvbmZpZywgcGFyZW50cywgYWNjdW11bGF0ZWQpXG4gICAgICA6IHt9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHZpc0NvbmZpZzoge1xuICAgICAgICAuLi52aXNDb25maWcsXG4gICAgICAgIC4uLm1vZGlmaWVkXG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgbGF5ZXJQcm9wc1YxID0ge1xuICBpZDogbnVsbCxcbiAgdHlwZTogbnVsbCxcbiAgY29uZmlnOiBuZXcgU2NoZW1hKHtcbiAgICB2ZXJzaW9uOiBWRVJTSU9OUy52MSxcbiAgICBrZXk6ICdjb25maWcnLFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIGRhdGFJZDogbnVsbCxcbiAgICAgIGxhYmVsOiBudWxsLFxuICAgICAgY29sb3I6IG51bGwsXG4gICAgICBoaWdobGlnaHRDb2xvcjogbnVsbCxcbiAgICAgIGNvbHVtbnM6IG5ldyBDb2x1bW5TY2hlbWFWMSh7XG4gICAgICAgIHZlcnNpb246IFZFUlNJT05TLnYxLFxuICAgICAgICBrZXk6ICdjb2x1bW5zJ1xuICAgICAgfSksXG4gICAgICBpc1Zpc2libGU6IG51bGwsXG4gICAgICB2aXNDb25maWc6IG5ldyBWaXNDb25maWdTY2hlbWFWMSh7XG4gICAgICAgIHZlcnNpb246IFZFUlNJT05TLnYxXG4gICAgICB9KSxcbiAgICAgIGhpZGRlbjogbnVsbCxcbiAgICAgIHRleHRMYWJlbDogbmV3IFRleHRMYWJlbFNjaGVtYVYxKHtcbiAgICAgICAgdmVyc2lvbjogVkVSU0lPTlMudjEsXG4gICAgICAgIGtleTogJ3RleHRMYWJlbCdcbiAgICAgIH0pXG4gICAgfVxuICB9KSxcbiAgdmlzdWFsQ2hhbm5lbHM6IG5ldyBWaXN1YWxDaGFubmVsU2NoZW1hVjEoe1xuICAgIHZlcnNpb246IFZFUlNJT05TLnYxLFxuICAgIGtleTogJ3Zpc3VhbENoYW5uZWxzJ1xuICB9KVxufTtcblxuZXhwb3J0IGNsYXNzIExheWVyU2NoZW1hVjAgZXh0ZW5kcyBTY2hlbWEge1xuICBrZXkgPSAnbGF5ZXJzJztcblxuICBzYXZlKGxheWVycywgcGFyZW50cykge1xuICAgIGNvbnN0IFt2aXNTdGF0ZV0gPSBwYXJlbnRzLnNsaWNlKC0xKTtcblxuICAgIHJldHVybiB7XG4gICAgICBbdGhpcy5rZXldOiB2aXNTdGF0ZS5sYXllck9yZGVyLnJlZHVjZSgoc2F2ZWQsIGluZGV4KSA9PiB7XG4gICAgICAgIC8vIHNhdmUgbGF5ZXJzIGFjY29yZGluZyB0byB0aGVpciByZW5kZXJpbmcgb3JkZXJcbiAgICAgICAgY29uc3QgbGF5ZXIgPSBsYXllcnNbaW5kZXhdO1xuICAgICAgICBpZiAobGF5ZXIuaXNWYWxpZFRvU2F2ZSgpKSB7XG4gICAgICAgICAgc2F2ZWQucHVzaCh0aGlzLnNhdmVQcm9wZXJ0aWVzT3JBcHBseVNjaGVtYShsYXllcikubGF5ZXJzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2F2ZWQ7XG4gICAgICB9LCBbXSlcbiAgICB9O1xuICB9XG5cbiAgbG9hZChsYXllcnMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgW3RoaXMua2V5XTogbGF5ZXJzLm1hcChsYXllciA9PiB0aGlzLmxvYWRQcm9wZXJ0aWVzT3JBcHBseVNjaGVtYShsYXllciwgbGF5ZXJzKS5sYXllcnMpXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRmlsdGVyU2NoZW1hVjAgZXh0ZW5kcyBTY2hlbWEge1xuICBrZXkgPSAnZmlsdGVycyc7XG4gIHNhdmUoZmlsdGVycykge1xuICAgIHJldHVybiB7XG4gICAgICBmaWx0ZXJzOiBmaWx0ZXJzXG4gICAgICAgIC5maWx0ZXIoaXNWYWxpZEZpbHRlclZhbHVlKVxuICAgICAgICAubWFwKGZpbHRlciA9PiB0aGlzLnNhdmVQcm9wZXJ0aWVzT3JBcHBseVNjaGVtYShmaWx0ZXIpLmZpbHRlcnMpXG4gICAgfTtcbiAgfVxuICBsb2FkKGZpbHRlcnMpIHtcbiAgICByZXR1cm4ge2ZpbHRlcnN9O1xuICB9XG59XG5cbmNvbnN0IGludGVyYWN0aW9uUHJvcHNWMCA9IFsndG9vbHRpcCcsICdicnVzaCddO1xuXG5jbGFzcyBJbnRlcmFjdGlvblNjaGVtYVYwIGV4dGVuZHMgU2NoZW1hIHtcbiAga2V5ID0gJ2ludGVyYWN0aW9uQ29uZmlnJztcblxuICBzYXZlKGludGVyYWN0aW9uQ29uZmlnKSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodGhpcy5wcm9wZXJ0aWVzKVxuICAgICAgPyB7XG4gICAgICAgICAgW3RoaXMua2V5XTogdGhpcy5wcm9wZXJ0aWVzLnJlZHVjZShcbiAgICAgICAgICAgIChhY2N1LCBrZXkpID0+ICh7XG4gICAgICAgICAgICAgIC4uLmFjY3UsXG4gICAgICAgICAgICAgIC4uLihpbnRlcmFjdGlvbkNvbmZpZ1trZXldLmVuYWJsZWQgPyB7W2tleV06IGludGVyYWN0aW9uQ29uZmlnW2tleV0uY29uZmlnfSA6IHt9KVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB7fVxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgOiB7fTtcbiAgfVxuICBsb2FkKGludGVyYWN0aW9uQ29uZmlnKSB7XG4gICAgLy8gY29udmVydCB2MCAtPiB2MVxuICAgIC8vIHJldHVybiBlbmFibGVkOiBmYWxzZSBpZiBkaXNhYmxlZCxcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh0aGlzLnByb3BlcnRpZXMpXG4gICAgICA/IHtcbiAgICAgICAgICBbdGhpcy5rZXldOiB0aGlzLnByb3BlcnRpZXMucmVkdWNlKFxuICAgICAgICAgICAgKGFjY3UsIGtleSkgPT4gKHtcbiAgICAgICAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgICAgICAgLi4ue1xuICAgICAgICAgICAgICAgIFtrZXldOiB7XG4gICAgICAgICAgICAgICAgICAuLi4oaW50ZXJhY3Rpb25Db25maWdba2V5XSB8fCB7fSksXG4gICAgICAgICAgICAgICAgICBlbmFibGVkOiBCb29sZWFuKGludGVyYWN0aW9uQ29uZmlnW2tleV0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHt9XG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICA6IHt9O1xuICB9XG59XG5cbmNvbnN0IGludGVyYWN0aW9uUHJvcHNWMSA9IFsuLi5pbnRlcmFjdGlvblByb3BzVjAsICdnZW9jb2RlcicsICdjb29yZGluYXRlJ107XG5cbmV4cG9ydCBjbGFzcyBJbnRlcmFjdGlvblNjaGVtYVYxIGV4dGVuZHMgU2NoZW1hIHtcbiAga2V5ID0gJ2ludGVyYWN0aW9uQ29uZmlnJztcblxuICBzYXZlKGludGVyYWN0aW9uQ29uZmlnKSB7XG4gICAgLy8gc2F2ZSBjb25maWcgZXZlbiBpZiBkaXNhYmxlZCxcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh0aGlzLnByb3BlcnRpZXMpXG4gICAgICA/IHtcbiAgICAgICAgICBbdGhpcy5rZXldOiB0aGlzLnByb3BlcnRpZXMucmVkdWNlKFxuICAgICAgICAgICAgKGFjY3UsIGtleSkgPT4gKHtcbiAgICAgICAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgICAgICAgW2tleV06IHtcbiAgICAgICAgICAgICAgICAuLi5pbnRlcmFjdGlvbkNvbmZpZ1trZXldLmNvbmZpZyxcbiAgICAgICAgICAgICAgICBlbmFibGVkOiBpbnRlcmFjdGlvbkNvbmZpZ1trZXldLmVuYWJsZWRcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB7fVxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgOiB7fTtcbiAgfVxuICBsb2FkKGludGVyYWN0aW9uQ29uZmlnKSB7XG4gICAgY29uc3QgbW9kaWZpZWRDb25maWcgPSBpbnRlcmFjdGlvbkNvbmZpZztcbiAgICBPYmplY3Qua2V5cyhpbnRlcmFjdGlvbkNvbmZpZykuZm9yRWFjaChjb25maWdUeXBlID0+IHtcbiAgICAgIGlmIChjb25maWdUeXBlID09PSAndG9vbHRpcCcpIHtcbiAgICAgICAgY29uc3QgZmllbGRzVG9TaG93ID0gbW9kaWZpZWRDb25maWdbY29uZmlnVHlwZV0uZmllbGRzVG9TaG93O1xuICAgICAgICBpZiAoIW5vdE51bGxvclVuZGVmaW5lZChmaWVsZHNUb1Nob3cpKSB7XG4gICAgICAgICAgcmV0dXJuIHtbdGhpcy5rZXldOiBtb2RpZmllZENvbmZpZ307XG4gICAgICAgIH1cbiAgICAgICAgT2JqZWN0LmtleXMoZmllbGRzVG9TaG93KS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgZmllbGRzVG9TaG93W2tleV0gPSBmaWVsZHNUb1Nob3dba2V5XS5tYXAoZmllbGREYXRhID0+IHtcbiAgICAgICAgICAgIGlmICghZmllbGREYXRhLm5hbWUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBmaWVsZERhdGEsXG4gICAgICAgICAgICAgICAgZm9ybWF0OiBudWxsXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmllbGREYXRhO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9KTtcbiAgICByZXR1cm4ge1t0aGlzLmtleV06IG1vZGlmaWVkQ29uZmlnfTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZmlsdGVyUHJvcHNWMCA9IHtcbiAgZGF0YUlkOiBudWxsLFxuICBpZDogbnVsbCxcbiAgbmFtZTogbnVsbCxcbiAgdHlwZTogbnVsbCxcbiAgdmFsdWU6IG51bGwsXG4gIGVubGFyZ2VkOiBudWxsXG59O1xuXG5leHBvcnQgY2xhc3MgRGltZW5zaW9uRmllbGRTY2hlbWEgZXh0ZW5kcyBTY2hlbWEge1xuICBzYXZlKGZpZWxkKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFt0aGlzLmtleV06IGZpZWxkID8gdGhpcy5zYXZlUHJvcGVydGllc09yQXBwbHlTY2hlbWEoZmllbGQpW3RoaXMua2V5XSA6IG51bGxcbiAgICB9O1xuICB9XG5cbiAgbG9hZChmaWVsZCkge1xuICAgIHJldHVybiB7W3RoaXMua2V5XTogZmllbGR9O1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTcGxpdE1hcHNTY2hlbWEgZXh0ZW5kcyBTY2hlbWEge1xuICBjb252ZXJ0TGF5ZXJTZXR0aW5ncyhhY2N1LCBba2V5LCB2YWx1ZV0pIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmFjY3UsXG4gICAgICAgIFtrZXldOiB2YWx1ZVxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUuaXNBdmFpbGFibGUpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmFjY3UsXG4gICAgICAgIFtrZXldOiBCb29sZWFuKHZhbHVlLmlzVmlzaWJsZSlcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBhY2N1O1xuICB9XG5cbiAgbG9hZChzcGxpdE1hcHMpIHtcbiAgICAvLyBwcmV2aW91cyBzcGxpdE1hcHMgU2NoZW1hIHtsYXllcnM6IHtsYXllcklkOiB7aXNWaXNpYmxlLCBpc0F2YWlsYWJsZX19fVxuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHNwbGl0TWFwcykgfHwgIXNwbGl0TWFwcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB7c3BsaXRNYXBzOiBbXX07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNwbGl0TWFwczogc3BsaXRNYXBzLm1hcChzZXR0aW5ncyA9PiAoe1xuICAgICAgICAuLi5zZXR0aW5ncyxcbiAgICAgICAgbGF5ZXJzOiBPYmplY3QuZW50cmllcyhzZXR0aW5ncy5sYXllcnMgfHwge30pLnJlZHVjZSh0aGlzLmNvbnZlcnRMYXllclNldHRpbmdzLCB7fSlcbiAgICAgIH0pKVxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGZpbHRlclByb3BzVjEgPSB7XG4gIC4uLmZpbHRlclByb3BzVjAsXG4gIHBsb3RUeXBlOiBudWxsLFxuICBhbmltYXRpb25XaW5kb3c6IG51bGwsXG4gIHlBeGlzOiBuZXcgRGltZW5zaW9uRmllbGRTY2hlbWEoe1xuICAgIHZlcnNpb246IFZFUlNJT05TLnYxLFxuICAgIGtleTogJ3lBeGlzJyxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBuYW1lOiBudWxsLFxuICAgICAgdHlwZTogbnVsbFxuICAgIH1cbiAgfSksXG5cbiAgLy8gcG9seWdvbiBmaWx0ZXIgcHJvcGVydGllc1xuICBsYXllcklkOiBudWxsLFxuICBzcGVlZDogbnVsbFxufTtcblxuZXhwb3J0IGNvbnN0IHByb3BlcnRpZXNWMCA9IHtcbiAgZmlsdGVyczogbmV3IEZpbHRlclNjaGVtYVYwKHtcbiAgICB2ZXJzaW9uOiBWRVJTSU9OUy52MCxcbiAgICBwcm9wZXJ0aWVzOiBmaWx0ZXJQcm9wc1YwXG4gIH0pLFxuICBsYXllcnM6IG5ldyBMYXllclNjaGVtYVYwKHtcbiAgICB2ZXJzaW9uOiBWRVJTSU9OUy52MCxcbiAgICBwcm9wZXJ0aWVzOiBsYXllclByb3BzVjBcbiAgfSksXG4gIGludGVyYWN0aW9uQ29uZmlnOiBuZXcgSW50ZXJhY3Rpb25TY2hlbWFWMCh7XG4gICAgdmVyc2lvbjogVkVSU0lPTlMudjAsXG4gICAgcHJvcGVydGllczogaW50ZXJhY3Rpb25Qcm9wc1YwXG4gIH0pLFxuICBsYXllckJsZW5kaW5nOiBudWxsXG59O1xuXG5leHBvcnQgY29uc3QgcHJvcGVydGllc1YxID0ge1xuICBmaWx0ZXJzOiBuZXcgRmlsdGVyU2NoZW1hVjAoe1xuICAgIHZlcnNpb246IFZFUlNJT05TLnYxLFxuICAgIHByb3BlcnRpZXM6IGZpbHRlclByb3BzVjFcbiAgfSksXG4gIGxheWVyczogbmV3IExheWVyU2NoZW1hVjAoe1xuICAgIHZlcnNpb246IFZFUlNJT05TLnYxLFxuICAgIHByb3BlcnRpZXM6IGxheWVyUHJvcHNWMVxuICB9KSxcbiAgaW50ZXJhY3Rpb25Db25maWc6IG5ldyBJbnRlcmFjdGlvblNjaGVtYVYxKHtcbiAgICB2ZXJzaW9uOiBWRVJTSU9OUy52MSxcbiAgICBwcm9wZXJ0aWVzOiBpbnRlcmFjdGlvblByb3BzVjFcbiAgfSksXG4gIGxheWVyQmxlbmRpbmc6IG51bGwsXG4gIHNwbGl0TWFwczogbmV3IFNwbGl0TWFwc1NjaGVtYSh7XG4gICAga2V5OiAnc3BsaXRNYXBzJyxcbiAgICB2ZXJzaW9uOiBWRVJTSU9OUy52MVxuICB9KSxcbiAgYW5pbWF0aW9uQ29uZmlnOiBuZXcgU2NoZW1hKHtcbiAgICB2ZXJzaW9uOiBWRVJTSU9OUy52MSxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBjdXJyZW50VGltZTogbnVsbCxcbiAgICAgIHNwZWVkOiBudWxsXG4gICAgfSxcbiAgICBrZXk6ICdhbmltYXRpb25Db25maWcnXG4gIH0pXG59O1xuXG5leHBvcnQgY29uc3QgdmlzU3RhdGVTY2hlbWFWMCA9IG5ldyBTY2hlbWEoe1xuICB2ZXJzaW9uOiBWRVJTSU9OUy52MCxcbiAgcHJvcGVydGllczogcHJvcGVydGllc1YwLFxuICBrZXk6ICd2aXNTdGF0ZSdcbn0pO1xuXG5leHBvcnQgY29uc3QgdmlzU3RhdGVTY2hlbWFWMSA9IG5ldyBTY2hlbWEoe1xuICB2ZXJzaW9uOiBWRVJTSU9OUy52MSxcbiAgcHJvcGVydGllczogcHJvcGVydGllc1YxLFxuICBrZXk6ICd2aXNTdGF0ZSdcbn0pO1xuXG5leHBvcnQgY29uc3QgdmlzU3RhdGVTY2hlbWEgPSB7XG4gIFtWRVJTSU9OUy52MF06IHtcbiAgICBzYXZlOiB0b1NhdmUgPT4gdmlzU3RhdGVTY2hlbWFWMC5zYXZlKHRvU2F2ZSksXG4gICAgbG9hZDogdG9Mb2FkID0+IHZpc1N0YXRlU2NoZW1hVjEubG9hZCh2aXNTdGF0ZVNjaGVtYVYwLmxvYWQodG9Mb2FkKS52aXNTdGF0ZSlcbiAgfSxcbiAgW1ZFUlNJT05TLnYxXTogdmlzU3RhdGVTY2hlbWFWMVxufTtcblxuLy8gdGVzdCBsb2FkIHYwXG5leHBvcnQgZGVmYXVsdCB2aXNTdGF0ZVNjaGVtYTtcbiJdfQ==