'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.visStateSchema = exports.visStateSchemaV1 = exports.visStateSchemaV0 = exports.propertiesV1 = exports.propertiesV0 = exports.filterPropsV1 = exports.DimensionFieldSchema = exports.filterPropsV0 = exports.layerPropsV1 = exports.layerPropsV0 = exports.dimensionPropsV0 = undefined;

var _extends11 = require('babel-runtime/helpers/extends');

var _extends12 = _interopRequireDefault(_extends11);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _visStateSchema;

var _lodash = require('lodash.pick');

var _lodash2 = _interopRequireDefault(_lodash);

var _versions = require('./versions');

var _filterUtils = require('../utils/filter-utils');

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * V0 Schema
 */

var dimensionPropsV0 = exports.dimensionPropsV0 = ['name', 'type'];

// in v0 geojson there is only sizeField

// in v1 geojson
// stroke base on -> sizeField
// height based on -> heightField
// radius based on -> radiusField
// here we make our wiredst guess on which channel sizeField belongs to
function geojsonSizeFieldV0ToV1(config) {
  var defaultRaiuds = 10;
  var defaultRadiusRange = [0, 50];

  // if extruded, sizeField is most likely used for height
  if (config.visConfig.extruded) {
    return 'heightField';
  }

  // if show stroke enabled, sizeField is most likely used for stroke
  if (config.visConfig.stroked) {
    return 'sizeField';
  }

  // if radius changed, or radius Range Changed, sizeField is most likely used for radius
  // this is the most unreliable guess, that's why we put it in the end
  if (config.visConfig.radius !== defaultRaiuds || config.visConfig.radiusRange.some(function (d, i) {
    return d !== defaultRadiusRange[i];
  })) {
    return 'radiusField';
  }

  return 'sizeField';
}

// convert v0 to v1 layer config

var DimensionFieldSchemaV0 = function (_Schema) {
  (0, _inherits3.default)(DimensionFieldSchemaV0, _Schema);

  function DimensionFieldSchemaV0() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DimensionFieldSchemaV0);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DimensionFieldSchemaV0.__proto__ || Object.getPrototypeOf(DimensionFieldSchemaV0)).call.apply(_ref, [this].concat(args))), _this), _this.version = _versions.VERSIONS.v0, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DimensionFieldSchemaV0, [{
    key: 'save',
    value: function save(field, config) {
      // should not be called anymore
      return (0, _defineProperty3.default)({}, this.key, field !== null ? this.savePropertiesOrApplySchema(field)[this.key] : null);
    }
  }, {
    key: 'load',
    value: function load(field, config, accumulated) {
      var fieldName = this.key;
      if (config.type === 'geojson' && this.key === 'sizeField' && field) {
        fieldName = geojsonSizeFieldV0ToV1(config);
      }
      // fold into visualChannels to be load by VisualChannelSchemaV1
      return {
        visualChannels: (0, _extends12.default)({}, accumulated.visualChannels || {}, (0, _defineProperty3.default)({}, fieldName, field))
      };
    }
  }]);
  return DimensionFieldSchemaV0;
}(_schema2.default);

var DimensionScaleSchemaV0 = function (_Schema2) {
  (0, _inherits3.default)(DimensionScaleSchemaV0, _Schema2);

  function DimensionScaleSchemaV0() {
    var _ref3;

    var _temp2, _this2, _ret2;

    (0, _classCallCheck3.default)(this, DimensionScaleSchemaV0);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this2 = (0, _possibleConstructorReturn3.default)(this, (_ref3 = DimensionScaleSchemaV0.__proto__ || Object.getPrototypeOf(DimensionScaleSchemaV0)).call.apply(_ref3, [this].concat(args))), _this2), _this2.version = _versions.VERSIONS.v0, _temp2), (0, _possibleConstructorReturn3.default)(_this2, _ret2);
  }

  (0, _createClass3.default)(DimensionScaleSchemaV0, [{
    key: 'save',
    value: function save(scale) {
      return (0, _defineProperty3.default)({}, this.key, scale);
    }
  }, {
    key: 'load',
    value: function load(scale, config, accumulated) {
      // fold into visualChannels to be load by VisualChannelSchemaV1
      if (this.key === 'sizeScale' && config.type === 'geojson') {
        // sizeScale now split into radiusScale, heightScale
        // no user customization, just use default
        return {};
      }

      return {
        visualChannels: (0, _extends12.default)({}, accumulated.visualChannels || {}, (0, _defineProperty3.default)({}, this.key, scale))
      };
    }
  }]);
  return DimensionScaleSchemaV0;
}(_schema2.default);

// used to convert v0 to v1 layer config


var LayerConfigSchemaV0 = function (_Schema3) {
  (0, _inherits3.default)(LayerConfigSchemaV0, _Schema3);

  function LayerConfigSchemaV0() {
    var _ref5;

    var _temp3, _this3, _ret3;

    (0, _classCallCheck3.default)(this, LayerConfigSchemaV0);

    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return _ret3 = (_temp3 = (_this3 = (0, _possibleConstructorReturn3.default)(this, (_ref5 = LayerConfigSchemaV0.__proto__ || Object.getPrototypeOf(LayerConfigSchemaV0)).call.apply(_ref5, [this].concat(args))), _this3), _this3.version = _versions.VERSIONS.v0, _temp3), (0, _possibleConstructorReturn3.default)(_this3, _ret3);
  }

  (0, _createClass3.default)(LayerConfigSchemaV0, [{
    key: 'load',
    value: function load(saved, layer, accumulated) {
      // fold v0 layer property into config.key
      return {
        config: (0, _extends12.default)({}, accumulated.config || {}, (0, _defineProperty3.default)({}, this.key, saved))
      };
    }
  }]);
  return LayerConfigSchemaV0;
}(_schema2.default);

// used to convert v0 to v1 layer columns
// only return column value for each column


var LayerColumnsSchemaV0 = function (_Schema4) {
  (0, _inherits3.default)(LayerColumnsSchemaV0, _Schema4);

  function LayerColumnsSchemaV0() {
    var _ref6;

    var _temp4, _this4, _ret4;

    (0, _classCallCheck3.default)(this, LayerColumnsSchemaV0);

    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return _ret4 = (_temp4 = (_this4 = (0, _possibleConstructorReturn3.default)(this, (_ref6 = LayerColumnsSchemaV0.__proto__ || Object.getPrototypeOf(LayerColumnsSchemaV0)).call.apply(_ref6, [this].concat(args))), _this4), _this4.version = _versions.VERSIONS.v0, _temp4), (0, _possibleConstructorReturn3.default)(_this4, _ret4);
  }

  (0, _createClass3.default)(LayerColumnsSchemaV0, [{
    key: 'load',
    value: function load(saved, layer, accumulated) {
      // fold v0 layer property into config.key, flatten columns
      return {
        config: (0, _extends12.default)({}, accumulated.config || {}, {
          columns: Object.keys(saved).reduce(function (accu, key) {
            return (0, _extends12.default)({}, accu, (0, _defineProperty3.default)({}, key, saved[key].value));
          }, {})
        })
      };
    }
  }]);
  return LayerColumnsSchemaV0;
}(_schema2.default);

// used to convert v0 to v1 layer config.visConfig


var LayerConfigToVisConfigSchemaV0 = function (_Schema5) {
  (0, _inherits3.default)(LayerConfigToVisConfigSchemaV0, _Schema5);

  function LayerConfigToVisConfigSchemaV0() {
    var _ref7;

    var _temp5, _this5, _ret5;

    (0, _classCallCheck3.default)(this, LayerConfigToVisConfigSchemaV0);

    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    return _ret5 = (_temp5 = (_this5 = (0, _possibleConstructorReturn3.default)(this, (_ref7 = LayerConfigToVisConfigSchemaV0.__proto__ || Object.getPrototypeOf(LayerConfigToVisConfigSchemaV0)).call.apply(_ref7, [this].concat(args))), _this5), _this5.version = _versions.VERSIONS.v0, _temp5), (0, _possibleConstructorReturn3.default)(_this5, _ret5);
  }

  (0, _createClass3.default)(LayerConfigToVisConfigSchemaV0, [{
    key: 'load',
    value: function load(saved, layer, accumulated) {
      // fold v0 layer property into config.visConfig
      var accumulatedConfig = accumulated.config || {};
      return {
        config: (0, _extends12.default)({}, accumulatedConfig, {
          visConfig: (0, _extends12.default)({}, accumulatedConfig.visConfig || {}, (0, _defineProperty3.default)({}, this.key, saved))
        })
      };
    }
  }]);
  return LayerConfigToVisConfigSchemaV0;
}(_schema2.default);

var LayerVisConfigSchemaV0 = function (_Schema6) {
  (0, _inherits3.default)(LayerVisConfigSchemaV0, _Schema6);

  function LayerVisConfigSchemaV0() {
    var _ref8;

    var _temp6, _this6, _ret6;

    (0, _classCallCheck3.default)(this, LayerVisConfigSchemaV0);

    for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
    }

    return _ret6 = (_temp6 = (_this6 = (0, _possibleConstructorReturn3.default)(this, (_ref8 = LayerVisConfigSchemaV0.__proto__ || Object.getPrototypeOf(LayerVisConfigSchemaV0)).call.apply(_ref8, [this].concat(args))), _this6), _this6.version = _versions.VERSIONS.v0, _this6.key = 'visConfig', _temp6), (0, _possibleConstructorReturn3.default)(_this6, _ret6);
  }

  (0, _createClass3.default)(LayerVisConfigSchemaV0, [{
    key: 'load',
    value: function load(visConfig, config, accumulator) {
      var rename = {
        geojson: {
          extruded: 'enable3d',
          elevationRange: 'heightRange'
        }
      };

      if (config.type in rename) {
        var propToRename = rename[config.type];
        return {
          config: (0, _extends12.default)({}, accumulator.config || {}, {
            visConfig: Object.keys(visConfig).reduce(function (accu, key) {
              return (0, _extends12.default)({}, accu, propToRename[key] ? (0, _defineProperty3.default)({}, propToRename[key], visConfig[key]) : (0, _defineProperty3.default)({}, key, visConfig[key]));
            }, {})
          })
        };
      }

      return {
        config: (0, _extends12.default)({}, accumulator.config || {}, {
          visConfig: visConfig
        })
      };
    }
  }]);
  return LayerVisConfigSchemaV0;
}(_schema2.default);

var LayerConfigSchemaDeleteV0 = function (_Schema7) {
  (0, _inherits3.default)(LayerConfigSchemaDeleteV0, _Schema7);

  function LayerConfigSchemaDeleteV0() {
    var _ref11;

    var _temp7, _this7, _ret7;

    (0, _classCallCheck3.default)(this, LayerConfigSchemaDeleteV0);

    for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }

    return _ret7 = (_temp7 = (_this7 = (0, _possibleConstructorReturn3.default)(this, (_ref11 = LayerConfigSchemaDeleteV0.__proto__ || Object.getPrototypeOf(LayerConfigSchemaDeleteV0)).call.apply(_ref11, [this].concat(args))), _this7), _this7.version = _versions.VERSIONS.v0, _temp7), (0, _possibleConstructorReturn3.default)(_this7, _ret7);
  }

  (0, _createClass3.default)(LayerConfigSchemaDeleteV0, [{
    key: 'load',
    value: function load(value) {
      return {};
    }
  }]);
  return LayerConfigSchemaDeleteV0;
}(_schema2.default);

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

var layerPropsV0 = exports.layerPropsV0 = {
  id: null,
  type: null,

  // move into layer.config
  dataId: new LayerConfigSchemaV0({ key: 'dataId' }),
  label: new LayerConfigSchemaV0({ key: 'label' }),
  color: new LayerConfigSchemaV0({ key: 'color' }),
  isVisible: new LayerConfigSchemaV0({ key: 'isVisible' }),

  // convert visConfig
  visConfig: new LayerVisConfigSchemaV0({ key: 'visConfig' }),

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
  enable3d: new LayerConfigToVisConfigSchemaV0({ key: 'enable3d' }),
  colorAggregation: new LayerConfigToVisConfigSchemaV0({
    key: 'colorAggregation'
  }),
  sizeAggregation: new LayerConfigToVisConfigSchemaV0({ key: 'sizeAggregation' }),

  // delete
  isAggregated: new LayerConfigSchemaDeleteV0()
};

/**
 * V1 Schema
 */

var ColumnSchemaV1 = function (_Schema8) {
  (0, _inherits3.default)(ColumnSchemaV1, _Schema8);

  function ColumnSchemaV1() {
    (0, _classCallCheck3.default)(this, ColumnSchemaV1);
    return (0, _possibleConstructorReturn3.default)(this, (ColumnSchemaV1.__proto__ || Object.getPrototypeOf(ColumnSchemaV1)).apply(this, arguments));
  }

  (0, _createClass3.default)(ColumnSchemaV1, [{
    key: 'save',
    value: function save(columns, state) {
      // starting from v1, only save column value
      // fieldIdx will be calculated during merge
      return (0, _defineProperty3.default)({}, this.key, Object.keys(columns).reduce(function (accu, ckey) {
        return (0, _extends12.default)({}, accu, (0, _defineProperty3.default)({}, ckey, columns[ckey].value));
      }, {}));
    }
  }, {
    key: 'load',
    value: function load(columns) {
      return { columns: columns };
    }
  }]);
  return ColumnSchemaV1;
}(_schema2.default);

/**
 * V1: save [field]: {name, type}, [scale]: '' for each channel
 */


var VisualChannelSchemaV1 = function (_Schema9) {
  (0, _inherits3.default)(VisualChannelSchemaV1, _Schema9);

  function VisualChannelSchemaV1() {
    (0, _classCallCheck3.default)(this, VisualChannelSchemaV1);
    return (0, _possibleConstructorReturn3.default)(this, (VisualChannelSchemaV1.__proto__ || Object.getPrototypeOf(VisualChannelSchemaV1)).apply(this, arguments));
  }

  (0, _createClass3.default)(VisualChannelSchemaV1, [{
    key: 'save',
    value: function save(visualChannels, layer) {
      // only save field and scale of each channel
      return (0, _defineProperty3.default)({}, this.key, Object.keys(visualChannels).reduce(
      //  save channel to null if didn't select any field
      function (accu, key) {
        var _extends8;

        return (0, _extends12.default)({}, accu, (_extends8 = {}, (0, _defineProperty3.default)(_extends8, visualChannels[key].field, layer.config[visualChannels[key].field] ? (0, _lodash2.default)(layer.config[visualChannels[key].field], ['name', 'type']) : null), (0, _defineProperty3.default)(_extends8, visualChannels[key].scale, layer.config[visualChannels[key].scale]), _extends8));
      }, {}));
    }
  }, {
    key: 'load',
    value: function load(vc, layer, accumulator) {
      // fold channels into config
      return (0, _extends12.default)({}, accumulator, {
        config: (0, _extends12.default)({}, accumulator.config || {}, vc)
      });
    }
  }]);
  return VisualChannelSchemaV1;
}(_schema2.default);

var layerPropsV1 = exports.layerPropsV1 = {
  id: null,
  type: null,
  config: new _schema2.default({
    version: _versions.VERSIONS.v1,
    key: 'config',
    properties: {
      dataId: null,
      label: null,
      color: null,
      columns: new ColumnSchemaV1({
        version: _versions.VERSIONS.v1,
        key: 'columns'
      }),
      isVisible: null,
      visConfig: null
    }
  }),
  visualChannels: new VisualChannelSchemaV1({
    version: _versions.VERSIONS.v1,
    key: 'visualChannels'
  })
};

var LayerSchemaV0 = function (_Schema10) {
  (0, _inherits3.default)(LayerSchemaV0, _Schema10);

  function LayerSchemaV0() {
    var _ref14;

    var _temp8, _this10, _ret8;

    (0, _classCallCheck3.default)(this, LayerSchemaV0);

    for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
      args[_key8] = arguments[_key8];
    }

    return _ret8 = (_temp8 = (_this10 = (0, _possibleConstructorReturn3.default)(this, (_ref14 = LayerSchemaV0.__proto__ || Object.getPrototypeOf(LayerSchemaV0)).call.apply(_ref14, [this].concat(args))), _this10), _this10.key = 'layers', _temp8), (0, _possibleConstructorReturn3.default)(_this10, _ret8);
  }

  (0, _createClass3.default)(LayerSchemaV0, [{
    key: 'save',
    value: function save(layers, visState) {
      var _this11 = this;

      return (0, _defineProperty3.default)({}, this.key, visState.layerOrder.reduce(function (saved, index) {
        // save layers according to their rendering order
        var layer = layers[index];
        if (layer.isValidToSave()) {
          saved.push(_this11.savePropertiesOrApplySchema(layer).layers);
        }
        return saved;
      }, []));
    }
  }, {
    key: 'load',
    value: function load(layers, visState) {
      var _this12 = this;

      return (0, _defineProperty3.default)({}, this.key, layers.map(function (layer) {
        return _this12.loadPropertiesOrApplySchema(layer, layers).layers;
      }));
    }
  }]);
  return LayerSchemaV0;
}(_schema2.default);

var FilterSchemaV0 = function (_Schema11) {
  (0, _inherits3.default)(FilterSchemaV0, _Schema11);

  function FilterSchemaV0() {
    var _ref17;

    var _temp9, _this13, _ret9;

    (0, _classCallCheck3.default)(this, FilterSchemaV0);

    for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
      args[_key9] = arguments[_key9];
    }

    return _ret9 = (_temp9 = (_this13 = (0, _possibleConstructorReturn3.default)(this, (_ref17 = FilterSchemaV0.__proto__ || Object.getPrototypeOf(FilterSchemaV0)).call.apply(_ref17, [this].concat(args))), _this13), _this13.key = 'filters', _temp9), (0, _possibleConstructorReturn3.default)(_this13, _ret9);
  }

  (0, _createClass3.default)(FilterSchemaV0, [{
    key: 'save',
    value: function save(filters) {
      var _this14 = this;

      return {
        filters: filters.filter(_filterUtils.isValidFilterValue).map(function (filter) {
          return _this14.savePropertiesOrApplySchema(filter, _this14.properties).filters;
        })
      };
    }
  }, {
    key: 'load',
    value: function load(filters) {
      return { filters: filters };
    }
  }]);
  return FilterSchemaV0;
}(_schema2.default);

var interactionPropsV0 = ['tooltip', 'brush'];

var InteractionSchemaV0 = function (_Schema12) {
  (0, _inherits3.default)(InteractionSchemaV0, _Schema12);

  function InteractionSchemaV0() {
    var _ref18;

    var _temp10, _this15, _ret10;

    (0, _classCallCheck3.default)(this, InteractionSchemaV0);

    for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
      args[_key10] = arguments[_key10];
    }

    return _ret10 = (_temp10 = (_this15 = (0, _possibleConstructorReturn3.default)(this, (_ref18 = InteractionSchemaV0.__proto__ || Object.getPrototypeOf(InteractionSchemaV0)).call.apply(_ref18, [this].concat(args))), _this15), _this15.key = 'interactionConfig', _temp10), (0, _possibleConstructorReturn3.default)(_this15, _ret10);
  }

  (0, _createClass3.default)(InteractionSchemaV0, [{
    key: 'save',
    value: function save(interactionConfig) {
      return (0, _defineProperty3.default)({}, this.key, this.properties.reduce(function (accu, key) {
        return (0, _extends12.default)({}, accu, interactionConfig[key].enabled ? (0, _defineProperty3.default)({}, key, interactionConfig[key].config) : {});
      }, {}));
    }
  }, {
    key: 'load',
    value: function load(interactionConfig) {
      // convert v0 -> v1
      // return enabled: false if disabled,
      return (0, _defineProperty3.default)({}, this.key, this.properties.reduce(function (accu, key) {
        return (0, _extends12.default)({}, accu, (0, _defineProperty3.default)({}, key, (0, _extends12.default)({}, interactionConfig[key] || {}, {
          enabled: Boolean(interactionConfig[key])
        })));
      }, {}));
    }
  }]);
  return InteractionSchemaV0;
}(_schema2.default);

var InteractionSchemaV1 = function (_Schema13) {
  (0, _inherits3.default)(InteractionSchemaV1, _Schema13);

  function InteractionSchemaV1() {
    var _ref22;

    var _temp11, _this16, _ret11;

    (0, _classCallCheck3.default)(this, InteractionSchemaV1);

    for (var _len11 = arguments.length, args = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
      args[_key11] = arguments[_key11];
    }

    return _ret11 = (_temp11 = (_this16 = (0, _possibleConstructorReturn3.default)(this, (_ref22 = InteractionSchemaV1.__proto__ || Object.getPrototypeOf(InteractionSchemaV1)).call.apply(_ref22, [this].concat(args))), _this16), _this16.key = 'interactionConfig', _temp11), (0, _possibleConstructorReturn3.default)(_this16, _ret11);
  }

  (0, _createClass3.default)(InteractionSchemaV1, [{
    key: 'save',
    value: function save(interactionConfig) {
      // save config even if disabled,
      return (0, _defineProperty3.default)({}, this.key, this.properties.reduce(function (accu, key) {
        return (0, _extends12.default)({}, accu, (0, _defineProperty3.default)({}, key, (0, _extends12.default)({}, interactionConfig[key].config, {
          enabled: interactionConfig[key].enabled
        })));
      }, {}));
    }
  }, {
    key: 'load',
    value: function load(interactionConfig) {
      return (0, _defineProperty3.default)({}, this.key, interactionConfig);
    }
  }]);
  return InteractionSchemaV1;
}(_schema2.default);

var filterPropsV0 = exports.filterPropsV0 = {
  dataId: null,
  id: null,
  name: null,
  type: null,
  value: null,
  enlarged: null
};

var DimensionFieldSchema = exports.DimensionFieldSchema = function (_Schema14) {
  (0, _inherits3.default)(DimensionFieldSchema, _Schema14);

  function DimensionFieldSchema() {
    (0, _classCallCheck3.default)(this, DimensionFieldSchema);
    return (0, _possibleConstructorReturn3.default)(this, (DimensionFieldSchema.__proto__ || Object.getPrototypeOf(DimensionFieldSchema)).apply(this, arguments));
  }

  (0, _createClass3.default)(DimensionFieldSchema, [{
    key: 'save',
    value: function save(field) {
      return (0, _defineProperty3.default)({}, this.key, field ? this.savePropertiesOrApplySchema(field)[this.key] : null);
    }
  }, {
    key: 'load',
    value: function load(field) {
      return (0, _defineProperty3.default)({}, this.key, field);
    }
  }]);
  return DimensionFieldSchema;
}(_schema2.default);

var filterPropsV1 = exports.filterPropsV1 = (0, _extends12.default)({}, filterPropsV0, {
  plotType: null,
  yAxis: new DimensionFieldSchema({
    version: _versions.VERSIONS.v1,
    key: 'yAxis',
    properties: {
      name: null,
      type: null
    }
  })
});

var propertiesV0 = exports.propertiesV0 = {
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

var propertiesV1 = exports.propertiesV1 = {
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
    properties: interactionPropsV0
  }),
  layerBlending: null,
  splitMaps: null
};

var visStateSchemaV0 = exports.visStateSchemaV0 = new _schema2.default({
  version: _versions.VERSIONS.v0,
  properties: propertiesV0,
  key: 'visState'
});

var visStateSchemaV1 = exports.visStateSchemaV1 = new _schema2.default({
  version: _versions.VERSIONS.v1,
  properties: propertiesV1,
  key: 'visState'
});

var visStateSchema = exports.visStateSchema = (_visStateSchema = {}, (0, _defineProperty3.default)(_visStateSchema, _versions.VERSIONS.v0, {
  save: function save(toSave) {
    return visStateSchemaV0.save(toSave);
  },
  load: function load(toLoad) {
    return visStateSchemaV1.load(visStateSchemaV0.load(toLoad).visState);
  }
}), (0, _defineProperty3.default)(_visStateSchema, _versions.VERSIONS.v1, visStateSchemaV1), _visStateSchema);

// test load v0
exports.default = visStateSchema;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL3Zpcy1zdGF0ZS1zY2hlbWEuanMiXSwibmFtZXMiOlsiZGltZW5zaW9uUHJvcHNWMCIsImdlb2pzb25TaXplRmllbGRWMFRvVjEiLCJjb25maWciLCJkZWZhdWx0UmFpdWRzIiwiZGVmYXVsdFJhZGl1c1JhbmdlIiwidmlzQ29uZmlnIiwiZXh0cnVkZWQiLCJzdHJva2VkIiwicmFkaXVzIiwicmFkaXVzUmFuZ2UiLCJzb21lIiwiZCIsImkiLCJEaW1lbnNpb25GaWVsZFNjaGVtYVYwIiwidmVyc2lvbiIsInYwIiwiZmllbGQiLCJrZXkiLCJzYXZlUHJvcGVydGllc09yQXBwbHlTY2hlbWEiLCJhY2N1bXVsYXRlZCIsImZpZWxkTmFtZSIsInR5cGUiLCJ2aXN1YWxDaGFubmVscyIsIkRpbWVuc2lvblNjYWxlU2NoZW1hVjAiLCJzY2FsZSIsIkxheWVyQ29uZmlnU2NoZW1hVjAiLCJzYXZlZCIsImxheWVyIiwiTGF5ZXJDb2x1bW5zU2NoZW1hVjAiLCJjb2x1bW5zIiwiT2JqZWN0Iiwia2V5cyIsInJlZHVjZSIsImFjY3UiLCJ2YWx1ZSIsIkxheWVyQ29uZmlnVG9WaXNDb25maWdTY2hlbWFWMCIsImFjY3VtdWxhdGVkQ29uZmlnIiwiTGF5ZXJWaXNDb25maWdTY2hlbWFWMCIsImFjY3VtdWxhdG9yIiwicmVuYW1lIiwiZ2VvanNvbiIsImVsZXZhdGlvblJhbmdlIiwicHJvcFRvUmVuYW1lIiwiTGF5ZXJDb25maWdTY2hlbWFEZWxldGVWMCIsImxheWVyUHJvcHNWMCIsImlkIiwiZGF0YUlkIiwibGFiZWwiLCJjb2xvciIsImlzVmlzaWJsZSIsImNvbG9yRmllbGQiLCJwcm9wZXJ0aWVzIiwiY29sb3JTY2FsZSIsInNpemVGaWVsZCIsInNpemVTY2FsZSIsImVuYWJsZTNkIiwiY29sb3JBZ2dyZWdhdGlvbiIsInNpemVBZ2dyZWdhdGlvbiIsImlzQWdncmVnYXRlZCIsIkNvbHVtblNjaGVtYVYxIiwic3RhdGUiLCJja2V5IiwiVmlzdWFsQ2hhbm5lbFNjaGVtYVYxIiwidmMiLCJsYXllclByb3BzVjEiLCJ2MSIsIkxheWVyU2NoZW1hVjAiLCJsYXllcnMiLCJ2aXNTdGF0ZSIsImxheWVyT3JkZXIiLCJpbmRleCIsImlzVmFsaWRUb1NhdmUiLCJwdXNoIiwibWFwIiwibG9hZFByb3BlcnRpZXNPckFwcGx5U2NoZW1hIiwiRmlsdGVyU2NoZW1hVjAiLCJmaWx0ZXJzIiwiZmlsdGVyIiwiaW50ZXJhY3Rpb25Qcm9wc1YwIiwiSW50ZXJhY3Rpb25TY2hlbWFWMCIsImludGVyYWN0aW9uQ29uZmlnIiwiZW5hYmxlZCIsIkJvb2xlYW4iLCJJbnRlcmFjdGlvblNjaGVtYVYxIiwiZmlsdGVyUHJvcHNWMCIsIm5hbWUiLCJlbmxhcmdlZCIsIkRpbWVuc2lvbkZpZWxkU2NoZW1hIiwiZmlsdGVyUHJvcHNWMSIsInBsb3RUeXBlIiwieUF4aXMiLCJwcm9wZXJ0aWVzVjAiLCJsYXllckJsZW5kaW5nIiwicHJvcGVydGllc1YxIiwic3BsaXRNYXBzIiwidmlzU3RhdGVTY2hlbWFWMCIsInZpc1N0YXRlU2NoZW1hVjEiLCJ2aXNTdGF0ZVNjaGVtYSIsInNhdmUiLCJ0b1NhdmUiLCJsb2FkIiwidG9Mb2FkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOztBQUVBOzs7Ozs7QUFFQTs7OztBQUlPLElBQU1BLDhDQUFtQixDQUFDLE1BQUQsRUFBUyxNQUFULENBQXpCOztBQUVQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTQyxzQkFBVCxDQUFnQ0MsTUFBaEMsRUFBd0M7QUFDdEMsTUFBTUMsZ0JBQWdCLEVBQXRCO0FBQ0EsTUFBTUMscUJBQXFCLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBM0I7O0FBRUE7QUFDQSxNQUFJRixPQUFPRyxTQUFQLENBQWlCQyxRQUFyQixFQUErQjtBQUM3QixXQUFPLGFBQVA7QUFDRDs7QUFFRDtBQUNBLE1BQUlKLE9BQU9HLFNB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Q0FBc0JMLGlCQUFpQkssSUFBakIsQ0FBc0JDLE1BQXRCLEVBQThCakMsUUFBcEQsQ0FESTtBQUFBO0FBRk8sQ0FESixrREFNVixtQkFBU0gsRUFOQyxFQU1JK0IsZ0JBTkosbUJBQU47O0FBU1A7a0JBQ2VDLGMiLCJmaWxlIjoidmlzLXN0YXRlLXNjaGVtYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwaWNrIGZyb20gJ2xvZGFzaC5waWNrJztcbmltcG9ydCB7VkVSU0lPTlN9IGZyb20gJy4vdmVyc2lvbnMnO1xuaW1wb3J0IHtpc1ZhbGlkRmlsdGVyVmFsdWV9IGZyb20gJy4uL3V0aWxzL2ZpbHRlci11dGlscyc7XG5cbmltcG9ydCBTY2hlbWEgZnJvbSAnLi9zY2hlbWEnO1xuXG4vKipcbiAqIFYwIFNjaGVtYVxuICovXG5cbmV4cG9ydCBjb25zdCBkaW1lbnNpb25Qcm9wc1YwID0gWyduYW1lJywgJ3R5cGUnXTtcblxuLy8gaW4gdjAgZ2VvanNvbiB0aGVyZSBpcyBvbmx5IHNpemVGaWVsZFxuXG4vLyBpbiB2MSBnZW9qc29uXG4vLyBzdHJva2UgYmFzZSBvbiAtPiBzaXplRmllbGRcbi8vIGhlaWdodCBiYXNlZCBvbiAtPiBoZWlnaHRGaWVsZFxuLy8gcmFkaXVzIGJhc2VkIG9uIC0+IHJhZGl1c0ZpZWxkXG4vLyBoZXJlIHdlIG1ha2Ugb3VyIHdpcmVkc3QgZ3Vlc3Mgb24gd2hpY2ggY2hhbm5lbCBzaXplRmllbGQgYmVsb25ncyB0b1xuZnVuY3Rpb24gZ2VvanNvblNpemVGaWVsZFYwVG9WMShjb25maWcpIHtcbiAgY29uc3QgZGVmYXVsdFJhaXVkcyA9IDEwO1xuICBjb25zdCBkZWZhdWx0UmFkaXVzUmFuZ2UgPSBbMCwgNTBdO1xuXG4gIC8vIGlmIGV4dHJ1ZGVkLCBzaXplRmllbGQgaXMgbW9zdCBsaWtlbHkgdXNlZCBmb3IgaGVpZ2h0XG4gIGlmIChjb25maWcudmlzQ29uZmlnLmV4dHJ1ZGVkKSB7XG4gICAgcmV0dXJuICdoZWlnaHRGaWVsZCc7XG4gIH1cblxuICAvLyBpZiBzaG93IHN0cm9rZSBlbmFibGVkLCBzaXplRmllbGQgaXMgbW9zdCBsaWtlbHkgdXNlZCBmb3Igc3Ryb2tlXG4gIGlmIChjb25maWcudmlzQ29uZmlnLnN0cm9rZWQpIHtcbiAgICByZXR1cm4gJ3NpemVGaWVsZCc7XG4gIH1cblxuICAvLyBpZiByYWRpdXMgY2hhbmdlZCwgb3IgcmFkaXVzIFJhbmdlIENoYW5nZWQsIHNpemVGaWVsZCBpcyBtb3N0IGxpa2VseSB1c2VkIGZvciByYWRpdXNcbiAgLy8gdGhpcyBpcyB0aGUgbW9zdCB1bnJlbGlhYmxlIGd1ZXNzLCB0aGF0J3Mgd2h5IHdlIHB1dCBpdCBpbiB0aGUgZW5kXG4gIGlmIChcbiAgICBjb25maWcudmlzQ29uZmlnLnJhZGl1cyAhPT0gZGVmYXVsdFJhaXVkcyB8fFxuICAgIGNvbmZpZy52aXNDb25maWcucmFkaXVzUmFuZ2Uuc29tZSgoZCwgaSkgPT4gZCAhPT0gZGVmYXVsdFJhZGl1c1JhbmdlW2ldKVxuICApIHtcbiAgICByZXR1cm4gJ3JhZGl1c0ZpZWxkJztcbiAgfVxuXG4gIHJldHVybiAnc2l6ZUZpZWxkJztcbn1cblxuLy8gY29udmVydCB2MCB0byB2MSBsYXllciBjb25maWdcbmNsYXNzIERpbWVuc2lvbkZpZWxkU2NoZW1hVjAgZXh0ZW5kcyBTY2hlbWEge1xuICB2ZXJzaW9uID0gVkVSU0lPTlMudjA7XG4gIHNhdmUoZmllbGQsIGNvbmZpZykge1xuICAgIC8vIHNob3VsZCBub3QgYmUgY2FsbGVkIGFueW1vcmVcbiAgICByZXR1cm4ge1xuICAgICAgW3RoaXMua2V5XTpcbiAgICAgICAgZmllbGQgIT09IG51bGxcbiAgICAgICAgICA/IHRoaXMuc2F2ZVByb3BlcnRpZXNPckFwcGx5U2NoZW1hKGZpZWxkKVt0aGlzLmtleV1cbiAgICAgICAgICA6IG51bGxcbiAgICB9O1xuICB9XG5cbiAgbG9hZChmaWVsZCwgY29uZmlnLCBhY2N1bXVsYXRlZCkge1xuICAgIGxldCBmaWVsZE5hbWUgPSB0aGlzLmtleTtcbiAgICBpZiAoY29uZmlnLnR5cGUgPT09ICdnZW9qc29uJyAmJiB0aGlzLmtleSA9PT0gJ3NpemVGaWVsZCcgJiYgZmllbGQpIHtcbiAgICAgIGZpZWxkTmFtZSA9IGdlb2pzb25TaXplRmllbGRWMFRvVjEoY29uZmlnKTtcbiAgICB9XG4gICAgLy8gZm9sZCBpbnRvIHZpc3VhbENoYW5uZWxzIHRvIGJlIGxvYWQgYnkgVmlzdWFsQ2hhbm5lbFNjaGVtYVYxXG4gICAgcmV0dXJuIHtcbiAgICAgIHZpc3VhbENoYW5uZWxzOiB7XG4gICAgICAgIC4uLihhY2N1bXVsYXRlZC52aXN1YWxDaGFubmVscyB8fCB7fSksXG4gICAgICAgIFtmaWVsZE5hbWVdOiBmaWVsZFxuICAgICAgfVxuICAgIH07XG4gIH1cbn1cblxuY2xhc3MgRGltZW5zaW9uU2NhbGVTY2hlbWFWMCBleHRlbmRzIFNjaGVtYSB7XG4gIHZlcnNpb24gPSBWRVJTSU9OUy52MDtcbiAgc2F2ZShzY2FsZSkge1xuICAgIHJldHVybiB7W3RoaXMua2V5XTogc2NhbGV9O1xuICB9XG4gIGxvYWQoc2NhbGUsIGNvbmZpZywgYWNjdW11bGF0ZWQpIHtcbiAgICAvLyBmb2xkIGludG8gdmlzdWFsQ2hhbm5lbHMgdG8gYmUgbG9hZCBieSBWaXN1YWxDaGFubmVsU2NoZW1hVjFcbiAgICBpZiAodGhpcy5rZXkgPT09ICdzaXplU2NhbGUnICYmIGNvbmZpZy50eXBlID09PSAnZ2VvanNvbicpIHtcbiAgICAgIC8vIHNpemVTY2FsZSBub3cgc3BsaXQgaW50byByYWRpdXNTY2FsZSwgaGVpZ2h0U2NhbGVcbiAgICAgIC8vIG5vIHVzZXIgY3VzdG9taXphdGlvbiwganVzdCB1c2UgZGVmYXVsdFxuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB2aXN1YWxDaGFubmVsczoge1xuICAgICAgICAuLi4oYWNjdW11bGF0ZWQudmlzdWFsQ2hhbm5lbHMgfHwge30pLFxuICAgICAgICBbdGhpcy5rZXldOiBzY2FsZVxuICAgICAgfVxuICAgIH07XG4gIH1cbn1cblxuLy8gdXNlZCB0byBjb252ZXJ0IHYwIHRvIHYxIGxheWVyIGNvbmZpZ1xuY2xhc3MgTGF5ZXJDb25maWdTY2hlbWFWMCBleHRlbmRzIFNjaGVtYSB7XG4gIHZlcnNpb24gPSBWRVJTSU9OUy52MDtcbiAgbG9hZChzYXZlZCwgbGF5ZXIsIGFjY3VtdWxhdGVkKSB7XG4gICAgLy8gZm9sZCB2MCBsYXllciBwcm9wZXJ0eSBpbnRvIGNvbmZpZy5rZXlcbiAgICByZXR1cm4ge1xuICAgICAgY29uZmlnOiB7XG4gICAgICAgIC4uLihhY2N1bXVsYXRlZC5jb25maWcgfHwge30pLFxuICAgICAgICBbdGhpcy5rZXldOiBzYXZlZFxuICAgICAgfVxuICAgIH07XG4gIH1cbn1cblxuLy8gdXNlZCB0byBjb252ZXJ0IHYwIHRvIHYxIGxheWVyIGNvbHVtbnNcbi8vIG9ubHkgcmV0dXJuIGNvbHVtbiB2YWx1ZSBmb3IgZWFjaCBjb2x1bW5cbmNsYXNzIExheWVyQ29sdW1uc1NjaGVtYVYwIGV4dGVuZHMgU2NoZW1hIHtcbiAgdmVyc2lvbiA9IFZFUlNJT05TLnYwO1xuICBsb2FkKHNhdmVkLCBsYXllciwgYWNjdW11bGF0ZWQpIHtcbiAgICAvLyBmb2xkIHYwIGxheWVyIHByb3BlcnR5IGludG8gY29uZmlnLmtleSwgZmxhdHRlbiBjb2x1bW5zXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmZpZzoge1xuICAgICAgICAuLi4oYWNjdW11bGF0ZWQuY29uZmlnIHx8IHt9KSxcbiAgICAgICAgY29sdW1uczogT2JqZWN0LmtleXMoc2F2ZWQpLnJlZHVjZShcbiAgICAgICAgICAoYWNjdSwga2V5KSA9PiAoe1xuICAgICAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgICAgIFtrZXldOiBzYXZlZFtrZXldLnZhbHVlXG4gICAgICAgICAgfSksXG4gICAgICAgICAge31cbiAgICAgICAgKVxuICAgICAgfVxuICAgIH07XG4gIH1cbn1cblxuLy8gdXNlZCB0byBjb252ZXJ0IHYwIHRvIHYxIGxheWVyIGNvbmZpZy52aXNDb25maWdcbmNsYXNzIExheWVyQ29uZmlnVG9WaXNDb25maWdTY2hlbWFWMCBleHRlbmRzIFNjaGVtYSB7XG4gIHZlcnNpb24gPSBWRVJTSU9OUy52MDtcbiAgbG9hZChzYXZlZCwgbGF5ZXIsIGFjY3VtdWxhdGVkKSB7XG4gICAgLy8gZm9sZCB2MCBsYXllciBwcm9wZXJ0eSBpbnRvIGNvbmZpZy52aXNDb25maWdcbiAgICBjb25zdCBhY2N1bXVsYXRlZENvbmZpZyA9IGFjY3VtdWxhdGVkLmNvbmZpZyB8fCB7fTtcbiAgICByZXR1cm4ge1xuICAgICAgY29uZmlnOiB7XG4gICAgICAgIC4uLmFjY3VtdWxhdGVkQ29uZmlnLFxuICAgICAgICB2aXNDb25maWc6IHtcbiAgICAgICAgICAuLi4oYWNjdW11bGF0ZWRDb25maWcudmlzQ29uZmlnIHx8IHt9KSxcbiAgICAgICAgICBbdGhpcy5rZXldOiBzYXZlZFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuXG5jbGFzcyBMYXllclZpc0NvbmZpZ1NjaGVtYVYwIGV4dGVuZHMgU2NoZW1hIHtcbiAgdmVyc2lvbiA9IFZFUlNJT05TLnYwO1xuICBrZXkgPSAndmlzQ29uZmlnJztcblxuICBsb2FkKHZpc0NvbmZpZywgY29uZmlnLCBhY2N1bXVsYXRvcikge1xuICAgIGNvbnN0IHJlbmFtZSA9IHtcbiAgICAgIGdlb2pzb246IHtcbiAgICAgICAgZXh0cnVkZWQ6ICdlbmFibGUzZCcsXG4gICAgICAgIGVsZXZhdGlvblJhbmdlOiAnaGVpZ2h0UmFuZ2UnXG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmIChjb25maWcudHlwZSBpbiByZW5hbWUpIHtcbiAgICAgIGNvbnN0IHByb3BUb1JlbmFtZSA9IHJlbmFtZVtjb25maWcudHlwZV07XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAuLi4oYWNjdW11bGF0b3IuY29uZmlnIHx8IHt9KSxcbiAgICAgICAgICB2aXNDb25maWc6IE9iamVjdC5rZXlzKHZpc0NvbmZpZykucmVkdWNlKFxuICAgICAgICAgICAgKGFjY3UsIGtleSkgPT4gKHtcbiAgICAgICAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgICAgICAgLi4uKHByb3BUb1JlbmFtZVtrZXldXG4gICAgICAgICAgICAgICAgPyB7W3Byb3BUb1JlbmFtZVtrZXldXTogdmlzQ29uZmlnW2tleV19XG4gICAgICAgICAgICAgICAgOiB7W2tleV06IHZpc0NvbmZpZ1trZXldfSlcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAge31cbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmZpZzoge1xuICAgICAgICAuLi4oYWNjdW11bGF0b3IuY29uZmlnIHx8IHt9KSxcbiAgICAgICAgdmlzQ29uZmlnXG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuXG5jbGFzcyBMYXllckNvbmZpZ1NjaGVtYURlbGV0ZVYwIGV4dGVuZHMgU2NoZW1hIHtcbiAgdmVyc2lvbiA9IFZFUlNJT05TLnYwO1xuICBsb2FkKHZhbHVlKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG59XG5cbi8qKlxuICogVjAgLT4gVjEgQ2hhbmdlc1xuICogLSBsYXllciBpcyBub3cgYSBjbGFzc1xuICogLSBjb25maWcgc2F2ZWQgaW4gYSBjb25maWcgb2JqZWN0XG4gKiAtIGlkLCB0eXBlLCBpc0FnZ3JlZ2F0ZWQgaXMgb3V0c2lkZSBsYXllci5jb25maWdcbiAqIC0gdmlzdWFsQ2hhbm5lbHMgaXMgb3V0c2lkZSBjb25maWcsIGl0IGRlZmluZXMgYXZhaWxhYmxlIHZpc3VhbCBjaGFubmVsIGFuZFxuICogICBwcm9wZXJ0eSBuYW1lcyBmb3IgZmllbGQsIHNjYWxlLCBkb21haW4gYW5kIHJhbmdlIG9mIGVhY2ggdmlzdWFsIGNoYW5lbC5cbiAqIC0gZW5hYmxlM2QsIGNvbG9yQWdncmVnYXRpb24gYW5kIHNpemVBZ2dyZWdhdGlvbiBhcmUgbW92ZWQgaW50byB2aXNDb25maWdcbiAqIC0gR2VvanNvbkxheWVyIC0gYWRkZWQgaGVpZ2h0LCByYWRpdXMgc3BlY2lmaWMgcHJvcGVydGllc1xuICovXG5cbmV4cG9ydCBjb25zdCBsYXllclByb3BzVjAgPSB7XG4gIGlkOiBudWxsLFxuICB0eXBlOiBudWxsLFxuXG4gIC8vIG1vdmUgaW50byBsYXllci5jb25maWdcbiAgZGF0YUlkOiBuZXcgTGF5ZXJDb25maWdTY2hlbWFWMCh7a2V5OiAnZGF0YUlkJ30pLFxuICBsYWJlbDogbmV3IExheWVyQ29uZmlnU2NoZW1hVjAoe2tleTogJ2xhYmVsJ30pLFxuICBjb2xvcjogbmV3IExheWVyQ29uZmlnU2NoZW1hVjAoe2tleTogJ2NvbG9yJ30pLFxuICBpc1Zpc2libGU6IG5ldyBMYXllckNvbmZpZ1NjaGVtYVYwKHtrZXk6ICdpc1Zpc2libGUnfSksXG5cbiAgLy8gY29udmVydCB2aXNDb25maWdcbiAgdmlzQ29uZmlnOiBuZXcgTGF5ZXJWaXNDb25maWdTY2hlbWFWMCh7a2V5OiAndmlzQ29uZmlnJ30pLFxuXG4gIC8vIG1vdmUgaW50byBsYXllci5jb25maWdcbiAgLy8gZmxhdHRlblxuICBjb2x1bW5zOiBuZXcgTGF5ZXJDb2x1bW5zU2NoZW1hVjAoKSxcblxuICAvLyBzYXZlIGludG8gdmlzdWFsQ2hhbm5lbHNcbiAgY29sb3JGaWVsZDogbmV3IERpbWVuc2lvbkZpZWxkU2NoZW1hVjAoe1xuICAgIHByb3BlcnRpZXM6IGRpbWVuc2lvblByb3BzVjAsXG4gICAga2V5OiAnY29sb3JGaWVsZCdcbiAgfSksXG4gIGNvbG9yU2NhbGU6IG5ldyBEaW1lbnNpb25TY2FsZVNjaGVtYVYwKHtcbiAgICBrZXk6ICdjb2xvclNjYWxlJ1xuICB9KSxcbiAgc2l6ZUZpZWxkOiBuZXcgRGltZW5zaW9uRmllbGRTY2hlbWFWMCh7XG4gICAgcHJvcGVydGllczogZGltZW5zaW9uUHJvcHNWMCxcbiAgICBrZXk6ICdzaXplRmllbGQnXG4gIH0pLFxuICBzaXplU2NhbGU6IG5ldyBEaW1lbnNpb25TY2FsZVNjaGVtYVYwKHtcbiAgICBrZXk6ICdzaXplU2NhbGUnXG4gIH0pLFxuXG4gIC8vIG1vdmUgaW50byBjb25maWcudmlzQ29uZmlnXG4gIGVuYWJsZTNkOiBuZXcgTGF5ZXJDb25maWdUb1Zpc0NvbmZpZ1NjaGVtYVYwKHtrZXk6ICdlbmFibGUzZCd9KSxcbiAgY29sb3JBZ2dyZWdhdGlvbjogbmV3IExheWVyQ29uZmlnVG9WaXNDb25maWdTY2hlbWFWMCh7XG4gICAga2V5OiAnY29sb3JBZ2dyZWdhdGlvbidcbiAgfSksXG4gIHNpemVBZ2dyZWdhdGlvbjogbmV3IExheWVyQ29uZmlnVG9WaXNDb25maWdTY2hlbWFWMCh7a2V5OiAnc2l6ZUFnZ3JlZ2F0aW9uJ30pLFxuXG4gIC8vIGRlbGV0ZVxuICBpc0FnZ3JlZ2F0ZWQ6IG5ldyBMYXllckNvbmZpZ1NjaGVtYURlbGV0ZVYwKClcbn07XG5cbi8qKlxuICogVjEgU2NoZW1hXG4gKi9cbmNsYXNzIENvbHVtblNjaGVtYVYxIGV4dGVuZHMgU2NoZW1hIHtcbiAgc2F2ZShjb2x1bW5zLCBzdGF0ZSkge1xuICAgIC8vIHN0YXJ0aW5nIGZyb20gdjEsIG9ubHkgc2F2ZSBjb2x1bW4gdmFsdWVcbiAgICAvLyBmaWVsZElkeCB3aWxsIGJlIGNhbGN1bGF0ZWQgZHVyaW5nIG1lcmdlXG4gICAgcmV0dXJuIHtcbiAgICAgIFt0aGlzLmtleV06IE9iamVjdC5rZXlzKGNvbHVtbnMpLnJlZHVjZShcbiAgICAgICAgKGFjY3UsIGNrZXkpID0+ICh7XG4gICAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgICBbY2tleV06IGNvbHVtbnNbY2tleV0udmFsdWVcbiAgICAgICAgfSksXG4gICAgICAgIHt9XG4gICAgICApXG4gICAgfTtcbiAgfVxuXG4gIGxvYWQoY29sdW1ucykge1xuICAgIHJldHVybiB7Y29sdW1uc307XG4gIH1cbn1cblxuLyoqXG4gKiBWMTogc2F2ZSBbZmllbGRdOiB7bmFtZSwgdHlwZX0sIFtzY2FsZV06ICcnIGZvciBlYWNoIGNoYW5uZWxcbiAqL1xuY2xhc3MgVmlzdWFsQ2hhbm5lbFNjaGVtYVYxIGV4dGVuZHMgU2NoZW1hIHtcbiAgc2F2ZSh2aXN1YWxDaGFubmVscywgbGF5ZXIpIHtcbiAgICAvLyBvbmx5IHNhdmUgZmllbGQgYW5kIHNjYWxlIG9mIGVhY2ggY2hhbm5lbFxuICAgIHJldHVybiB7XG4gICAgICBbdGhpcy5rZXldOiBPYmplY3Qua2V5cyh2aXN1YWxDaGFubmVscykucmVkdWNlKFxuICAgICAgICAvLyAgc2F2ZSBjaGFubmVsIHRvIG51bGwgaWYgZGlkbid0IHNlbGVjdCBhbnkgZmllbGRcbiAgICAgICAgKGFjY3UsIGtleSkgPT4gKHtcbiAgICAgICAgICAuLi5hY2N1LFxuICAgICAgICAgIFt2aXN1YWxDaGFubmVsc1trZXldLmZpZWxkXTogbGF5ZXIuY29uZmlnW3Zpc3VhbENoYW5uZWxzW2tleV0uZmllbGRdXG4gICAgICAgICAgICA/IHBpY2sobGF5ZXIuY29uZmlnW3Zpc3VhbENoYW5uZWxzW2tleV0uZmllbGRdLCBbJ25hbWUnLCAndHlwZSddKVxuICAgICAgICAgICAgOiBudWxsLFxuICAgICAgICAgIFt2aXN1YWxDaGFubmVsc1trZXldLnNjYWxlXTogbGF5ZXIuY29uZmlnW3Zpc3VhbENoYW5uZWxzW2tleV0uc2NhbGVdXG4gICAgICAgIH0pLFxuICAgICAgICB7fVxuICAgICAgKVxuICAgIH07XG4gIH1cbiAgbG9hZCh2YywgbGF5ZXIsIGFjY3VtdWxhdG9yKSB7XG4gICAgLy8gZm9sZCBjaGFubmVscyBpbnRvIGNvbmZpZ1xuICAgIHJldHVybiB7XG4gICAgICAuLi5hY2N1bXVsYXRvcixcbiAgICAgIGNvbmZpZzoge1xuICAgICAgICAuLi4oYWNjdW11bGF0b3IuY29uZmlnIHx8IHt9KSxcbiAgICAgICAgLi4udmNcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBsYXllclByb3BzVjEgPSB7XG4gIGlkOiBudWxsLFxuICB0eXBlOiBudWxsLFxuICBjb25maWc6IG5ldyBTY2hlbWEoe1xuICAgIHZlcnNpb246IFZFUlNJT05TLnYxLFxuICAgIGtleTogJ2NvbmZpZycsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgZGF0YUlkOiBudWxsLFxuICAgICAgbGFiZWw6IG51bGwsXG4gICAgICBjb2xvcjogbnVsbCxcbiAgICAgIGNvbHVtbnM6IG5ldyBDb2x1bW5TY2hlbWFWMSh7XG4gICAgICAgIHZlcnNpb246IFZFUlNJT05TLnYxLFxuICAgICAgICBrZXk6ICdjb2x1bW5zJ1xuICAgICAgfSksXG4gICAgICBpc1Zpc2libGU6IG51bGwsXG4gICAgICB2aXNDb25maWc6IG51bGxcbiAgICB9XG4gIH0pLFxuICB2aXN1YWxDaGFubmVsczogbmV3IFZpc3VhbENoYW5uZWxTY2hlbWFWMSh7XG4gICAgdmVyc2lvbjogVkVSU0lPTlMudjEsXG4gICAga2V5OiAndmlzdWFsQ2hhbm5lbHMnXG4gIH0pXG59O1xuXG5jbGFzcyBMYXllclNjaGVtYVYwIGV4dGVuZHMgU2NoZW1hIHtcbiAga2V5ID0gJ2xheWVycyc7XG5cbiAgc2F2ZShsYXllcnMsIHZpc1N0YXRlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFt0aGlzLmtleV06IHZpc1N0YXRlLmxheWVyT3JkZXIucmVkdWNlKChzYXZlZCwgaW5kZXgpID0+IHtcbiAgICAgICAgLy8gc2F2ZSBsYXllcnMgYWNjb3JkaW5nIHRvIHRoZWlyIHJlbmRlcmluZyBvcmRlclxuICAgICAgICBjb25zdCBsYXllciA9IGxheWVyc1tpbmRleF07XG4gICAgICAgIGlmIChsYXllci5pc1ZhbGlkVG9TYXZlKCkpIHtcbiAgICAgICAgICBzYXZlZC5wdXNoKHRoaXMuc2F2ZVByb3BlcnRpZXNPckFwcGx5U2NoZW1hKGxheWVyKS5sYXllcnMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzYXZlZDtcbiAgICAgIH0sIFtdKVxuICAgIH07XG4gIH1cblxuICBsb2FkKGxheWVycywgdmlzU3RhdGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgW3RoaXMua2V5XTogbGF5ZXJzLm1hcChcbiAgICAgICAgbGF5ZXIgPT4gdGhpcy5sb2FkUHJvcGVydGllc09yQXBwbHlTY2hlbWEobGF5ZXIsIGxheWVycykubGF5ZXJzXG4gICAgICApXG4gICAgfTtcbiAgfVxufVxuXG5jbGFzcyBGaWx0ZXJTY2hlbWFWMCBleHRlbmRzIFNjaGVtYSB7XG4gIGtleSA9ICdmaWx0ZXJzJztcbiAgc2F2ZShmaWx0ZXJzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbHRlcnM6IGZpbHRlcnNcbiAgICAgICAgLmZpbHRlcihpc1ZhbGlkRmlsdGVyVmFsdWUpXG4gICAgICAgIC5tYXAoXG4gICAgICAgICAgZmlsdGVyID0+XG4gICAgICAgICAgICB0aGlzLnNhdmVQcm9wZXJ0aWVzT3JBcHBseVNjaGVtYShmaWx0ZXIsIHRoaXMucHJvcGVydGllcykuZmlsdGVyc1xuICAgICAgICApXG4gICAgfTtcbiAgfVxuICBsb2FkKGZpbHRlcnMpIHtcbiAgICByZXR1cm4ge2ZpbHRlcnN9O1xuICB9XG59XG5cbmNvbnN0IGludGVyYWN0aW9uUHJvcHNWMCA9IFsndG9vbHRpcCcsICdicnVzaCddO1xuXG5jbGFzcyBJbnRlcmFjdGlvblNjaGVtYVYwIGV4dGVuZHMgU2NoZW1hIHtcbiAga2V5ID0gJ2ludGVyYWN0aW9uQ29uZmlnJztcblxuICBzYXZlKGludGVyYWN0aW9uQ29uZmlnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFt0aGlzLmtleV06IHRoaXMucHJvcGVydGllcy5yZWR1Y2UoXG4gICAgICAgIChhY2N1LCBrZXkpID0+ICh7XG4gICAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgICAuLi4oaW50ZXJhY3Rpb25Db25maWdba2V5XS5lbmFibGVkXG4gICAgICAgICAgICA/IHtba2V5XTogaW50ZXJhY3Rpb25Db25maWdba2V5XS5jb25maWd9XG4gICAgICAgICAgICA6IHt9KVxuICAgICAgICB9KSxcbiAgICAgICAge31cbiAgICAgIClcbiAgICB9O1xuICB9XG4gIGxvYWQoaW50ZXJhY3Rpb25Db25maWcpIHtcbiAgICAvLyBjb252ZXJ0IHYwIC0+IHYxXG4gICAgLy8gcmV0dXJuIGVuYWJsZWQ6IGZhbHNlIGlmIGRpc2FibGVkLFxuICAgIHJldHVybiB7XG4gICAgICBbdGhpcy5rZXldOiB0aGlzLnByb3BlcnRpZXMucmVkdWNlKFxuICAgICAgICAoYWNjdSwga2V5KSA9PiAoe1xuICAgICAgICAgIC4uLmFjY3UsXG4gICAgICAgICAgLi4ue1xuICAgICAgICAgICAgW2tleV06IHtcbiAgICAgICAgICAgICAgLi4uKGludGVyYWN0aW9uQ29uZmlnW2tleV0gfHwge30pLFxuICAgICAgICAgICAgICBlbmFibGVkOiBCb29sZWFuKGludGVyYWN0aW9uQ29uZmlnW2tleV0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KSxcbiAgICAgICAge31cbiAgICAgIClcbiAgICB9O1xuICB9XG59XG5cbmNsYXNzIEludGVyYWN0aW9uU2NoZW1hVjEgZXh0ZW5kcyBTY2hlbWEge1xuICBrZXkgPSAnaW50ZXJhY3Rpb25Db25maWcnO1xuXG4gIHNhdmUoaW50ZXJhY3Rpb25Db25maWcpIHtcbiAgICAvLyBzYXZlIGNvbmZpZyBldmVuIGlmIGRpc2FibGVkLFxuICAgIHJldHVybiB7XG4gICAgICBbdGhpcy5rZXldOiB0aGlzLnByb3BlcnRpZXMucmVkdWNlKFxuICAgICAgICAoYWNjdSwga2V5KSA9PiAoe1xuICAgICAgICAgIC4uLmFjY3UsXG4gICAgICAgICAgW2tleV06IHtcbiAgICAgICAgICAgIC4uLmludGVyYWN0aW9uQ29uZmlnW2tleV0uY29uZmlnLFxuICAgICAgICAgICAgZW5hYmxlZDogaW50ZXJhY3Rpb25Db25maWdba2V5XS5lbmFibGVkXG4gICAgICAgICAgfVxuICAgICAgICB9KSxcbiAgICAgICAge31cbiAgICAgIClcbiAgICB9O1xuICB9XG4gIGxvYWQoaW50ZXJhY3Rpb25Db25maWcpIHtcbiAgICByZXR1cm4ge1t0aGlzLmtleV06IGludGVyYWN0aW9uQ29uZmlnfTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZmlsdGVyUHJvcHNWMCA9IHtcbiAgZGF0YUlkOiBudWxsLFxuICBpZDogbnVsbCxcbiAgbmFtZTogbnVsbCxcbiAgdHlwZTogbnVsbCxcbiAgdmFsdWU6IG51bGwsXG4gIGVubGFyZ2VkOiBudWxsXG59O1xuXG5leHBvcnQgY2xhc3MgRGltZW5zaW9uRmllbGRTY2hlbWEgZXh0ZW5kcyBTY2hlbWEge1xuICBzYXZlKGZpZWxkKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFt0aGlzLmtleV06IGZpZWxkXG4gICAgICAgID8gdGhpcy5zYXZlUHJvcGVydGllc09yQXBwbHlTY2hlbWEoZmllbGQpW3RoaXMua2V5XVxuICAgICAgICA6IG51bGxcbiAgICB9O1xuICB9XG5cbiAgbG9hZChmaWVsZCkge1xuICAgIHJldHVybiB7W3RoaXMua2V5XTogZmllbGR9O1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBmaWx0ZXJQcm9wc1YxID0ge1xuICAuLi5maWx0ZXJQcm9wc1YwLFxuICBwbG90VHlwZTogbnVsbCxcbiAgeUF4aXM6IG5ldyBEaW1lbnNpb25GaWVsZFNjaGVtYSh7XG4gICAgdmVyc2lvbjogVkVSU0lPTlMudjEsXG4gICAga2V5OiAneUF4aXMnLFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIG5hbWU6IG51bGwsXG4gICAgICB0eXBlOiBudWxsXG4gICAgfVxuICB9KVxufTtcblxuZXhwb3J0IGNvbnN0IHByb3BlcnRpZXNWMCA9IHtcbiAgZmlsdGVyczogbmV3IEZpbHRlclNjaGVtYVYwKHtcbiAgICB2ZXJzaW9uOiBWRVJTSU9OUy52MCxcbiAgICBwcm9wZXJ0aWVzOiBmaWx0ZXJQcm9wc1YwXG4gIH0pLFxuICBsYXllcnM6IG5ldyBMYXllclNjaGVtYVYwKHtcbiAgICB2ZXJzaW9uOiBWRVJTSU9OUy52MCxcbiAgICBwcm9wZXJ0aWVzOiBsYXllclByb3BzVjBcbiAgfSksXG4gIGludGVyYWN0aW9uQ29uZmlnOiBuZXcgSW50ZXJhY3Rpb25TY2hlbWFWMCh7XG4gICAgdmVyc2lvbjogVkVSU0lPTlMudjAsXG4gICAgcHJvcGVydGllczogaW50ZXJhY3Rpb25Qcm9wc1YwXG4gIH0pLFxuICBsYXllckJsZW5kaW5nOiBudWxsXG59O1xuXG5leHBvcnQgY29uc3QgcHJvcGVydGllc1YxID0ge1xuICBmaWx0ZXJzOiBuZXcgRmlsdGVyU2NoZW1hVjAoe1xuICAgIHZlcnNpb246IFZFUlNJT05TLnYxLFxuICAgIHByb3BlcnRpZXM6IGZpbHRlclByb3BzVjFcbiAgfSksXG4gIGxheWVyczogbmV3IExheWVyU2NoZW1hVjAoe1xuICAgIHZlcnNpb246IFZFUlNJT05TLnYxLFxuICAgIHByb3BlcnRpZXM6IGxheWVyUHJvcHNWMVxuICB9KSxcbiAgaW50ZXJhY3Rpb25Db25maWc6IG5ldyBJbnRlcmFjdGlvblNjaGVtYVYxKHtcbiAgICB2ZXJzaW9uOiBWRVJTSU9OUy52MSxcbiAgICBwcm9wZXJ0aWVzOiBpbnRlcmFjdGlvblByb3BzVjBcbiAgfSksXG4gIGxheWVyQmxlbmRpbmc6IG51bGwsXG4gIHNwbGl0TWFwczogbnVsbFxufTtcblxuZXhwb3J0IGNvbnN0IHZpc1N0YXRlU2NoZW1hVjAgPSBuZXcgU2NoZW1hKHtcbiAgdmVyc2lvbjogVkVSU0lPTlMudjAsXG4gIHByb3BlcnRpZXM6IHByb3BlcnRpZXNWMCxcbiAga2V5OiAndmlzU3RhdGUnXG59KTtcblxuZXhwb3J0IGNvbnN0IHZpc1N0YXRlU2NoZW1hVjEgPSBuZXcgU2NoZW1hKHtcbiAgdmVyc2lvbjogVkVSU0lPTlMudjEsXG4gIHByb3BlcnRpZXM6IHByb3BlcnRpZXNWMSxcbiAga2V5OiAndmlzU3RhdGUnXG59KTtcblxuZXhwb3J0IGNvbnN0IHZpc1N0YXRlU2NoZW1hID0ge1xuICBbVkVSU0lPTlMudjBdOiB7XG4gICAgc2F2ZTogdG9TYXZlID0+IHZpc1N0YXRlU2NoZW1hVjAuc2F2ZSh0b1NhdmUpLFxuICAgIGxvYWQ6IHRvTG9hZCA9PlxuICAgICAgdmlzU3RhdGVTY2hlbWFWMS5sb2FkKHZpc1N0YXRlU2NoZW1hVjAubG9hZCh0b0xvYWQpLnZpc1N0YXRlKVxuICB9LFxuICBbVkVSU0lPTlMudjFdOiB2aXNTdGF0ZVNjaGVtYVYxXG59O1xuXG4vLyB0ZXN0IGxvYWQgdjBcbmV4cG9ydCBkZWZhdWx0IHZpc1N0YXRlU2NoZW1hO1xuIl19