'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.visStateSchema = exports.visStateSchemaV1 = exports.visStateSchemaV0 = exports.propertiesV1 = exports.propertiesV0 = exports.filterPropsV1 = exports.DimensionFieldSchema = exports.filterPropsV0 = exports.layerPropsV1 = exports.layerPropsV0 = exports.dimensionPropsV0 = undefined;

var _extends11 = require('babel-runtime/helpers/extends');

var _extends12 = _interopRequireDefault(_extends11);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

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
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DimensionFieldSchemaV0);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Schema.call.apply(_Schema, [this].concat(args))), _this), _this.version = _versions.VERSIONS.v0, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  DimensionFieldSchemaV0.prototype.save = function save(field, config) {
    var _ref;

    // should not be called anymore
    return _ref = {}, _ref[this.key] = field !== null ? this.savePropertiesOrApplySchema(field)[this.key] : null, _ref;
  };

  DimensionFieldSchemaV0.prototype.load = function load(field, config, accumulated) {
    var _extends2;

    var fieldName = this.key;
    if (config.type === 'geojson' && this.key === 'sizeField' && field) {
      fieldName = geojsonSizeFieldV0ToV1(config);
    }
    // fold into visualChannels to be load by VisualChannelSchemaV1
    return {
      visualChannels: (0, _extends12.default)({}, accumulated.visualChannels || {}, (_extends2 = {}, _extends2[fieldName] = field, _extends2))
    };
  };

  return DimensionFieldSchemaV0;
}(_schema2.default);

var DimensionScaleSchemaV0 = function (_Schema2) {
  (0, _inherits3.default)(DimensionScaleSchemaV0, _Schema2);

  function DimensionScaleSchemaV0() {
    var _temp2, _this2, _ret2;

    (0, _classCallCheck3.default)(this, DimensionScaleSchemaV0);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this2 = (0, _possibleConstructorReturn3.default)(this, _Schema2.call.apply(_Schema2, [this].concat(args))), _this2), _this2.version = _versions.VERSIONS.v0, _temp2), (0, _possibleConstructorReturn3.default)(_this2, _ret2);
  }

  DimensionScaleSchemaV0.prototype.save = function save(scale) {
    var _ref2;

    return _ref2 = {}, _ref2[this.key] = scale, _ref2;
  };

  DimensionScaleSchemaV0.prototype.load = function load(scale, config, accumulated) {
    var _extends3;

    // fold into visualChannels to be load by VisualChannelSchemaV1
    if (this.key === 'sizeScale' && config.type === 'geojson') {
      // sizeScale now split into radiusScale, heightScale
      // no user customization, just use default
      return {};
    }

    return {
      visualChannels: (0, _extends12.default)({}, accumulated.visualChannels || {}, (_extends3 = {}, _extends3[this.key] = scale, _extends3))
    };
  };

  return DimensionScaleSchemaV0;
}(_schema2.default);

// used to convert v0 to v1 layer config


var LayerConfigSchemaV0 = function (_Schema3) {
  (0, _inherits3.default)(LayerConfigSchemaV0, _Schema3);

  function LayerConfigSchemaV0() {
    var _temp3, _this3, _ret3;

    (0, _classCallCheck3.default)(this, LayerConfigSchemaV0);

    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return _ret3 = (_temp3 = (_this3 = (0, _possibleConstructorReturn3.default)(this, _Schema3.call.apply(_Schema3, [this].concat(args))), _this3), _this3.version = _versions.VERSIONS.v0, _temp3), (0, _possibleConstructorReturn3.default)(_this3, _ret3);
  }

  LayerConfigSchemaV0.prototype.load = function load(saved, layer, accumulated) {
    var _extends4;

    // fold v0 layer property into config.key
    return {
      config: (0, _extends12.default)({}, accumulated.config || {}, (_extends4 = {}, _extends4[this.key] = saved, _extends4))
    };
  };

  return LayerConfigSchemaV0;
}(_schema2.default);

// used to convert v0 to v1 layer columns
// only return column value for each column


var LayerColumnsSchemaV0 = function (_Schema4) {
  (0, _inherits3.default)(LayerColumnsSchemaV0, _Schema4);

  function LayerColumnsSchemaV0() {
    var _temp4, _this4, _ret4;

    (0, _classCallCheck3.default)(this, LayerColumnsSchemaV0);

    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return _ret4 = (_temp4 = (_this4 = (0, _possibleConstructorReturn3.default)(this, _Schema4.call.apply(_Schema4, [this].concat(args))), _this4), _this4.version = _versions.VERSIONS.v0, _temp4), (0, _possibleConstructorReturn3.default)(_this4, _ret4);
  }

  LayerColumnsSchemaV0.prototype.load = function load(saved, layer, accumulated) {
    // fold v0 layer property into config.key, flatten columns
    return {
      config: (0, _extends12.default)({}, accumulated.config || {}, {
        columns: Object.keys(saved).reduce(function (accu, key) {
          var _extends5;

          return (0, _extends12.default)({}, accu, (_extends5 = {}, _extends5[key] = saved[key].value, _extends5));
        }, {})
      })
    };
  };

  return LayerColumnsSchemaV0;
}(_schema2.default);

// used to convert v0 to v1 layer config.visConfig


var LayerConfigToVisConfigSchemaV0 = function (_Schema5) {
  (0, _inherits3.default)(LayerConfigToVisConfigSchemaV0, _Schema5);

  function LayerConfigToVisConfigSchemaV0() {
    var _temp5, _this5, _ret5;

    (0, _classCallCheck3.default)(this, LayerConfigToVisConfigSchemaV0);

    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    return _ret5 = (_temp5 = (_this5 = (0, _possibleConstructorReturn3.default)(this, _Schema5.call.apply(_Schema5, [this].concat(args))), _this5), _this5.version = _versions.VERSIONS.v0, _temp5), (0, _possibleConstructorReturn3.default)(_this5, _ret5);
  }

  LayerConfigToVisConfigSchemaV0.prototype.load = function load(saved, layer, accumulated) {
    var _extends6;

    // fold v0 layer property into config.visConfig
    var accumulatedConfig = accumulated.config || {};
    return {
      config: (0, _extends12.default)({}, accumulatedConfig, {
        visConfig: (0, _extends12.default)({}, accumulatedConfig.visConfig || {}, (_extends6 = {}, _extends6[this.key] = saved, _extends6))
      })
    };
  };

  return LayerConfigToVisConfigSchemaV0;
}(_schema2.default);

var LayerVisConfigSchemaV0 = function (_Schema6) {
  (0, _inherits3.default)(LayerVisConfigSchemaV0, _Schema6);

  function LayerVisConfigSchemaV0() {
    var _temp6, _this6, _ret6;

    (0, _classCallCheck3.default)(this, LayerVisConfigSchemaV0);

    for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
    }

    return _ret6 = (_temp6 = (_this6 = (0, _possibleConstructorReturn3.default)(this, _Schema6.call.apply(_Schema6, [this].concat(args))), _this6), _this6.version = _versions.VERSIONS.v0, _this6.key = 'visConfig', _temp6), (0, _possibleConstructorReturn3.default)(_this6, _ret6);
  }

  LayerVisConfigSchemaV0.prototype.load = function load(visConfig, config, accumulator) {
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
            var _ref3, _ref4;

            return (0, _extends12.default)({}, accu, propToRename[key] ? (_ref3 = {}, _ref3[propToRename[key]] = visConfig[key], _ref3) : (_ref4 = {}, _ref4[key] = visConfig[key], _ref4));
          }, {})
        })
      };
    }

    return {
      config: (0, _extends12.default)({}, accumulator.config || {}, {
        visConfig: visConfig
      })
    };
  };

  return LayerVisConfigSchemaV0;
}(_schema2.default);

var LayerConfigSchemaDeleteV0 = function (_Schema7) {
  (0, _inherits3.default)(LayerConfigSchemaDeleteV0, _Schema7);

  function LayerConfigSchemaDeleteV0() {
    var _temp7, _this7, _ret7;

    (0, _classCallCheck3.default)(this, LayerConfigSchemaDeleteV0);

    for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }

    return _ret7 = (_temp7 = (_this7 = (0, _possibleConstructorReturn3.default)(this, _Schema7.call.apply(_Schema7, [this].concat(args))), _this7), _this7.version = _versions.VERSIONS.v0, _temp7), (0, _possibleConstructorReturn3.default)(_this7, _ret7);
  }

  LayerConfigSchemaDeleteV0.prototype.load = function load(value) {
    return {};
  };

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
    return (0, _possibleConstructorReturn3.default)(this, _Schema8.apply(this, arguments));
  }

  ColumnSchemaV1.prototype.save = function save(columns, state) {
    var _ref5;

    // starting from v1, only save column value
    // fieldIdx will be calculated during merge
    return _ref5 = {}, _ref5[this.key] = Object.keys(columns).reduce(function (accu, ckey) {
      var _extends7;

      return (0, _extends12.default)({}, accu, (_extends7 = {}, _extends7[ckey] = columns[ckey].value, _extends7));
    }, {}), _ref5;
  };

  ColumnSchemaV1.prototype.load = function load(columns) {
    return { columns: columns };
  };

  return ColumnSchemaV1;
}(_schema2.default);

/**
 * V1: save [field]: {name, type}, [scale]: '' for each channel
 */


var VisualChannelSchemaV1 = function (_Schema9) {
  (0, _inherits3.default)(VisualChannelSchemaV1, _Schema9);

  function VisualChannelSchemaV1() {
    (0, _classCallCheck3.default)(this, VisualChannelSchemaV1);
    return (0, _possibleConstructorReturn3.default)(this, _Schema9.apply(this, arguments));
  }

  VisualChannelSchemaV1.prototype.save = function save(visualChannels, layer) {
    var _ref6;

    // only save field and scale of each channel
    return _ref6 = {}, _ref6[this.key] = Object.keys(visualChannels).reduce(
    //  save channel to null if didn't select any field
    function (accu, key) {
      var _extends8;

      return (0, _extends12.default)({}, accu, (_extends8 = {}, _extends8[visualChannels[key].field] = layer.config[visualChannels[key].field] ? (0, _lodash2.default)(layer.config[visualChannels[key].field], ['name', 'type']) : null, _extends8[visualChannels[key].scale] = layer.config[visualChannels[key].scale], _extends8));
    }, {}), _ref6;
  };

  VisualChannelSchemaV1.prototype.load = function load(vc, layer, accumulator) {
    // fold channels into config
    return (0, _extends12.default)({}, accumulator, {
      config: (0, _extends12.default)({}, accumulator.config || {}, vc)
    });
  };

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
    var _temp8, _this10, _ret8;

    (0, _classCallCheck3.default)(this, LayerSchemaV0);

    for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
      args[_key8] = arguments[_key8];
    }

    return _ret8 = (_temp8 = (_this10 = (0, _possibleConstructorReturn3.default)(this, _Schema10.call.apply(_Schema10, [this].concat(args))), _this10), _this10.key = 'layers', _temp8), (0, _possibleConstructorReturn3.default)(_this10, _ret8);
  }

  LayerSchemaV0.prototype.save = function save(layers, visState) {
    var _this11 = this,
        _ref7;

    return _ref7 = {}, _ref7[this.key] = visState.layerOrder.reduce(function (saved, index) {
      // save layers according to their rendering order
      var layer = layers[index];
      if (layer.isValidToSave()) {
        saved.push(_this11.savePropertiesOrApplySchema(layer).layers);
      }
      return saved;
    }, []), _ref7;
  };

  LayerSchemaV0.prototype.load = function load(layers, visState) {
    var _this12 = this,
        _ref8;

    return _ref8 = {}, _ref8[this.key] = layers.map(function (layer) {
      return _this12.loadPropertiesOrApplySchema(layer, layers).layers;
    }), _ref8;
  };

  return LayerSchemaV0;
}(_schema2.default);

var FilterSchemaV0 = function (_Schema11) {
  (0, _inherits3.default)(FilterSchemaV0, _Schema11);

  function FilterSchemaV0() {
    var _temp9, _this13, _ret9;

    (0, _classCallCheck3.default)(this, FilterSchemaV0);

    for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
      args[_key9] = arguments[_key9];
    }

    return _ret9 = (_temp9 = (_this13 = (0, _possibleConstructorReturn3.default)(this, _Schema11.call.apply(_Schema11, [this].concat(args))), _this13), _this13.key = 'filters', _temp9), (0, _possibleConstructorReturn3.default)(_this13, _ret9);
  }

  FilterSchemaV0.prototype.save = function save(filters) {
    var _this14 = this;

    return {
      filters: filters.filter(_filterUtils.isValidFilterValue).map(function (filter) {
        return _this14.savePropertiesOrApplySchema(filter, _this14.properties).filters;
      })
    };
  };

  FilterSchemaV0.prototype.load = function load(filters) {
    return { filters: filters };
  };

  return FilterSchemaV0;
}(_schema2.default);

var interactionPropsV0 = ['tooltip', 'brush'];

var InteractionSchemaV0 = function (_Schema12) {
  (0, _inherits3.default)(InteractionSchemaV0, _Schema12);

  function InteractionSchemaV0() {
    var _temp10, _this15, _ret10;

    (0, _classCallCheck3.default)(this, InteractionSchemaV0);

    for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
      args[_key10] = arguments[_key10];
    }

    return _ret10 = (_temp10 = (_this15 = (0, _possibleConstructorReturn3.default)(this, _Schema12.call.apply(_Schema12, [this].concat(args))), _this15), _this15.key = 'interactionConfig', _temp10), (0, _possibleConstructorReturn3.default)(_this15, _ret10);
  }

  InteractionSchemaV0.prototype.save = function save(interactionConfig) {
    var _ref10;

    return _ref10 = {}, _ref10[this.key] = this.properties.reduce(function (accu, key) {
      var _ref9;

      return (0, _extends12.default)({}, accu, interactionConfig[key].enabled ? (_ref9 = {}, _ref9[key] = interactionConfig[key].config, _ref9) : {});
    }, {}), _ref10;
  };

  InteractionSchemaV0.prototype.load = function load(interactionConfig) {
    var _ref11;

    // convert v0 -> v1
    // return enabled: false if disabled,
    return _ref11 = {}, _ref11[this.key] = this.properties.reduce(function (accu, key) {
      var _extends9;

      return (0, _extends12.default)({}, accu, (_extends9 = {}, _extends9[key] = (0, _extends12.default)({}, interactionConfig[key] || {}, {
        enabled: Boolean(interactionConfig[key])
      }), _extends9));
    }, {}), _ref11;
  };

  return InteractionSchemaV0;
}(_schema2.default);

var InteractionSchemaV1 = function (_Schema13) {
  (0, _inherits3.default)(InteractionSchemaV1, _Schema13);

  function InteractionSchemaV1() {
    var _temp11, _this16, _ret11;

    (0, _classCallCheck3.default)(this, InteractionSchemaV1);

    for (var _len11 = arguments.length, args = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
      args[_key11] = arguments[_key11];
    }

    return _ret11 = (_temp11 = (_this16 = (0, _possibleConstructorReturn3.default)(this, _Schema13.call.apply(_Schema13, [this].concat(args))), _this16), _this16.key = 'interactionConfig', _temp11), (0, _possibleConstructorReturn3.default)(_this16, _ret11);
  }

  InteractionSchemaV1.prototype.save = function save(interactionConfig) {
    var _ref12;

    // save config even if disabled,
    return _ref12 = {}, _ref12[this.key] = this.properties.reduce(function (accu, key) {
      var _extends10;

      return (0, _extends12.default)({}, accu, (_extends10 = {}, _extends10[key] = (0, _extends12.default)({}, interactionConfig[key].config, {
        enabled: interactionConfig[key].enabled
      }), _extends10));
    }, {}), _ref12;
  };

  InteractionSchemaV1.prototype.load = function load(interactionConfig) {
    var _ref13;

    return _ref13 = {}, _ref13[this.key] = interactionConfig, _ref13;
  };

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
    return (0, _possibleConstructorReturn3.default)(this, _Schema14.apply(this, arguments));
  }

  DimensionFieldSchema.prototype.save = function save(field) {
    var _ref14;

    return _ref14 = {}, _ref14[this.key] = field ? this.savePropertiesOrApplySchema(field)[this.key] : null, _ref14;
  };

  DimensionFieldSchema.prototype.load = function load(field) {
    var _ref15;

    return _ref15 = {}, _ref15[this.key] = field, _ref15;
  };

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

var visStateSchema = exports.visStateSchema = (_visStateSchema = {}, _visStateSchema[_versions.VERSIONS.v0] = {
  save: function save(toSave) {
    return visStateSchemaV0.save(toSave);
  },
  load: function load(toLoad) {
    return visStateSchemaV1.load(visStateSchemaV0.load(toLoad).visState);
  }
}, _visStateSchema[_versions.VERSIONS.v1] = visStateSchemaV1, _visStateSchema);

// test load v0
exports.default = visStateSchema;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL3Zpcy1zdGF0ZS1zY2hlbWEuanMiXSwibmFtZXMiOlsiZGltZW5zaW9uUHJvcHNWMCIsImdlb2pzb25TaXplRmllbGRWMFRvVjEiLCJjb25maWciLCJkZWZhdWx0UmFpdWRzIiwiZGVmYXVsdFJhZGl1c1JhbmdlIiwidmlzQ29uZmlnIiwiZXh0cnVkZWQiLCJzdHJva2VkIiwicmFkaXVzIiwicmFkaXVzUmFuZ2UiLCJzb21lIiwiZCIsImkiLCJEaW1lbnNpb25GaWVsZFNjaGVtYVYwIiwidmVyc2lvbiIsInYwIiwic2F2ZSIsImZpZWxkIiwia2V5Iiwic2F2ZVByb3BlcnRpZXNPckFwcGx5U2NoZW1hIiwibG9hZCIsImFjY3VtdWxhdGVkIiwiZmllbGROYW1lIiwidHlwZSIsInZpc3VhbENoYW5uZWxzIiwiRGltZW5zaW9uU2NhbGVTY2hlbWFWMCIsInNjYWxlIiwiTGF5ZXJDb25maWdTY2hlbWFWMCIsInNhdmVkIiwibGF5ZXIiLCJMYXllckNvbHVtbnNTY2hlbWFWMCIsImNvbHVtbnMiLCJPYmplY3QiLCJrZXlzIiwicmVkdWNlIiwiYWNjdSIsInZhbHVlIiwiTGF5ZXJDb25maWdUb1Zpc0NvbmZpZ1NjaGVtYVYwIiwiYWNjdW11bGF0ZWRDb25maWciLCJMYXllclZpc0NvbmZpZ1NjaGVtYVYwIiwiYWNjdW11bGF0b3IiLCJyZW5hbWUiLCJnZW9qc29uIiwiZWxldmF0aW9uUmFuZ2UiLCJwcm9wVG9SZW5hbWUiLCJMYXllckNvbmZpZ1NjaGVtYURlbGV0ZVYwIiwibGF5ZXJQcm9wc1YwIiwiaWQiLCJkYXRhSWQiLCJsYWJlbCIsImNvbG9yIiwiaXNWaXNpYmxlIiwiY29sb3JGaWVsZCIsInByb3BlcnRpZXMiLCJjb2xvclNjYWxlIiwic2l6ZUZpZWxkIiwic2l6ZVNjYWxlIiwiZW5hYmxlM2QiLCJjb2xvckFnZ3JlZ2F0aW9uIiwic2l6ZUFnZ3JlZ2F0aW9uIiwiaXNBZ2dyZWdhdGVkIiwiQ29sdW1uU2NoZW1hVjEiLCJzdGF0ZSIsImNrZXkiLCJWaXN1YWxDaGFubmVsU2NoZW1hVjEiLCJ2YyIsImxheWVyUHJvcHNWMSIsInYxIiwiTGF5ZXJTY2hlbWFWMCIsImxheWVycyIsInZpc1N0YXRlIiwibGF5ZXJPcmRlciIsImluZGV4IiwiaXNWYWxpZFRvU2F2ZSIsInB1c2giLCJtYXAiLCJsb2FkUHJvcGVydGllc09yQXBwbHlTY2hlbWEiLCJGaWx0ZXJTY2hlbWFWMCIsImZpbHRlcnMiLCJmaWx0ZXIiLCJpbnRlcmFjdGlvblByb3BzVjAiLCJJbnRlcmFjdGlvblNjaGVtYVYwIiwiaW50ZXJhY3Rpb25Db25maWciLCJlbmFibGVkIiwiQm9vbGVhbiIsIkludGVyYWN0aW9uU2NoZW1hVjEiLCJmaWx0ZXJQcm9wc1YwIiwibmFtZSIsImVubGFyZ2VkIiwiRGltZW5zaW9uRmllbGRTY2hlbWEiLCJmaWx0ZXJQcm9wc1YxIiwicGxvdFR5cGUiLCJ5QXhpcyIsInByb3BlcnRpZXNWMCIsImxheWVyQmxlbmRpbmciLCJwcm9wZXJ0aWVzVjEiLCJzcGxpdE1hcHMiLCJ2aXNTdGF0ZVNjaGVtYVYwIiwidmlzU3RhdGVTY2hlbWFWMSIsInZpc1N0YXRlU2NoZW1hIiwidG9TYXZlIiwidG9Mb2FkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7QUFFQTs7Ozs7O0FBRUE7Ozs7QUFJTyxJQUFNQSw4Q0FBbUIsQ0FBQyxNQUFELEVBQVMsTUFBVCxDQUF6Qjs7QUFFUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBU0Msc0JBQVQsQ0FBZ0NDLE1BQWhDLEVBQXdDO0FBQ3RDLE1BQU1DLGdCQUFnQixFQUF0QjtBQUNBLE1BQU1DLHFCQUFxQixDQUFDLENBQUQsRUFBSSxFQUFKLENBQTNCOztBQUVBO0FBQ0EsTUFBSUYsT0FBT0csU0FBUCxDQUFpQkMsUUFBckIsRUFBK0I7QUFDN0IsV0FBTyxhQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxNQUFJSixPQUFPRyxTQUFQLENBQWlC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Q0FBbUIscUJBQVc7QUFDekNuRixXQUFTLG1CQUFTQyxFQUR1QjtBQUV6Q3NDLGNBQVl3QyxZQUY2QjtBQUd6QzNFLE9BQUs7QUFIb0MsQ0FBWCxDQUF6Qjs7QUFNQSxJQUFNZ0YsOENBQW1CLHFCQUFXO0FBQ3pDcEYsV0FBUyxtQkFBU3FELEVBRHVCO0FBRXpDZCxjQUFZMEMsWUFGNkI7QUFHekM3RSxPQUFLO0FBSG9DLENBQVgsQ0FBekI7O0FBTUEsSUFBTWlGLGlGQUNWLG1CQUFTcEYsRUFEQyxJQUNJO0FBQ2JDLFFBQU07QUFBQSxXQUFVaUYsaUJBQWlCakYsSUFBakIsQ0FBc0JvRixNQUF0QixDQUFWO0FBQUEsR0FETztBQUViaEYsUUFBTTtBQUFBLFdBQ0o4RSxpQkFBaUI5RSxJQUFqQixDQUFzQjZFLGlCQUFpQjdFLElBQWpCLENBQXNCaUYsTUFBdEIsRUFBOEIvQixRQUFwRCxDQURJO0FBQUE7QUFGTyxDQURKLGtCQU1WLG1CQUFTSCxFQU5DLElBTUkrQixnQkFOSixrQkFBTjs7QUFTUDtrQkFDZUMsYyIsImZpbGUiOiJ2aXMtc3RhdGUtc2NoZW1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBpY2sgZnJvbSAnbG9kYXNoLnBpY2snO1xuaW1wb3J0IHtWRVJTSU9OU30gZnJvbSAnLi92ZXJzaW9ucyc7XG5pbXBvcnQge2lzVmFsaWRGaWx0ZXJWYWx1ZX0gZnJvbSAnLi4vdXRpbHMvZmlsdGVyLXV0aWxzJztcblxuaW1wb3J0IFNjaGVtYSBmcm9tICcuL3NjaGVtYSc7XG5cbi8qKlxuICogVjAgU2NoZW1hXG4gKi9cblxuZXhwb3J0IGNvbnN0IGRpbWVuc2lvblByb3BzVjAgPSBbJ25hbWUnLCAndHlwZSddO1xuXG4vLyBpbiB2MCBnZW9qc29uIHRoZXJlIGlzIG9ubHkgc2l6ZUZpZWxkXG5cbi8vIGluIHYxIGdlb2pzb25cbi8vIHN0cm9rZSBiYXNlIG9uIC0+IHNpemVGaWVsZFxuLy8gaGVpZ2h0IGJhc2VkIG9uIC0+IGhlaWdodEZpZWxkXG4vLyByYWRpdXMgYmFzZWQgb24gLT4gcmFkaXVzRmllbGRcbi8vIGhlcmUgd2UgbWFrZSBvdXIgd2lyZWRzdCBndWVzcyBvbiB3aGljaCBjaGFubmVsIHNpemVGaWVsZCBiZWxvbmdzIHRvXG5mdW5jdGlvbiBnZW9qc29uU2l6ZUZpZWxkVjBUb1YxKGNvbmZpZykge1xuICBjb25zdCBkZWZhdWx0UmFpdWRzID0gMTA7XG4gIGNvbnN0IGRlZmF1bHRSYWRpdXNSYW5nZSA9IFswLCA1MF07XG5cbiAgLy8gaWYgZXh0cnVkZWQsIHNpemVGaWVsZCBpcyBtb3N0IGxpa2VseSB1c2VkIGZvciBoZWlnaHRcbiAgaWYgKGNvbmZpZy52aXNDb25maWcuZXh0cnVkZWQpIHtcbiAgICByZXR1cm4gJ2hlaWdodEZpZWxkJztcbiAgfVxuXG4gIC8vIGlmIHNob3cgc3Ryb2tlIGVuYWJsZWQsIHNpemVGaWVsZCBpcyBtb3N0IGxpa2VseSB1c2VkIGZvciBzdHJva2VcbiAgaWYgKGNvbmZpZy52aXNDb25maWcuc3Ryb2tlZCkge1xuICAgIHJldHVybiAnc2l6ZUZpZWxkJztcbiAgfVxuXG4gIC8vIGlmIHJhZGl1cyBjaGFuZ2VkLCBvciByYWRpdXMgUmFuZ2UgQ2hhbmdlZCwgc2l6ZUZpZWxkIGlzIG1vc3QgbGlrZWx5IHVzZWQgZm9yIHJhZGl1c1xuICAvLyB0aGlzIGlzIHRoZSBtb3N0IHVucmVsaWFibGUgZ3Vlc3MsIHRoYXQncyB3aHkgd2UgcHV0IGl0IGluIHRoZSBlbmRcbiAgaWYgKFxuICAgIGNvbmZpZy52aXNDb25maWcucmFkaXVzICE9PSBkZWZhdWx0UmFpdWRzIHx8XG4gICAgY29uZmlnLnZpc0NvbmZpZy5yYWRpdXNSYW5nZS5zb21lKChkLCBpKSA9PiBkICE9PSBkZWZhdWx0UmFkaXVzUmFuZ2VbaV0pXG4gICkge1xuICAgIHJldHVybiAncmFkaXVzRmllbGQnO1xuICB9XG5cbiAgcmV0dXJuICdzaXplRmllbGQnO1xufVxuXG4vLyBjb252ZXJ0IHYwIHRvIHYxIGxheWVyIGNvbmZpZ1xuY2xhc3MgRGltZW5zaW9uRmllbGRTY2hlbWFWMCBleHRlbmRzIFNjaGVtYSB7XG4gIHZlcnNpb24gPSBWRVJTSU9OUy52MDtcbiAgc2F2ZShmaWVsZCwgY29uZmlnKSB7XG4gICAgLy8gc2hvdWxkIG5vdCBiZSBjYWxsZWQgYW55bW9yZVxuICAgIHJldHVybiB7XG4gICAgICBbdGhpcy5rZXldOlxuICAgICAgICBmaWVsZCAhPT0gbnVsbFxuICAgICAgICAgID8gdGhpcy5zYXZlUHJvcGVydGllc09yQXBwbHlTY2hlbWEoZmllbGQpW3RoaXMua2V5XVxuICAgICAgICAgIDogbnVsbFxuICAgIH07XG4gIH1cblxuICBsb2FkKGZpZWxkLCBjb25maWcsIGFjY3VtdWxhdGVkKSB7XG4gICAgbGV0IGZpZWxkTmFtZSA9IHRoaXMua2V5O1xuICAgIGlmIChjb25maWcudHlwZSA9PT0gJ2dlb2pzb24nICYmIHRoaXMua2V5ID09PSAnc2l6ZUZpZWxkJyAmJiBmaWVsZCkge1xuICAgICAgZmllbGROYW1lID0gZ2VvanNvblNpemVGaWVsZFYwVG9WMShjb25maWcpO1xuICAgIH1cbiAgICAvLyBmb2xkIGludG8gdmlzdWFsQ2hhbm5lbHMgdG8gYmUgbG9hZCBieSBWaXN1YWxDaGFubmVsU2NoZW1hVjFcbiAgICByZXR1cm4ge1xuICAgICAgdmlzdWFsQ2hhbm5lbHM6IHtcbiAgICAgICAgLi4uKGFjY3VtdWxhdGVkLnZpc3VhbENoYW5uZWxzIHx8IHt9KSxcbiAgICAgICAgW2ZpZWxkTmFtZV06IGZpZWxkXG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuXG5jbGFzcyBEaW1lbnNpb25TY2FsZVNjaGVtYVYwIGV4dGVuZHMgU2NoZW1hIHtcbiAgdmVyc2lvbiA9IFZFUlNJT05TLnYwO1xuICBzYXZlKHNjYWxlKSB7XG4gICAgcmV0dXJuIHtbdGhpcy5rZXldOiBzY2FsZX07XG4gIH1cbiAgbG9hZChzY2FsZSwgY29uZmlnLCBhY2N1bXVsYXRlZCkge1xuICAgIC8vIGZvbGQgaW50byB2aXN1YWxDaGFubmVscyB0byBiZSBsb2FkIGJ5IFZpc3VhbENoYW5uZWxTY2hlbWFWMVxuICAgIGlmICh0aGlzLmtleSA9PT0gJ3NpemVTY2FsZScgJiYgY29uZmlnLnR5cGUgPT09ICdnZW9qc29uJykge1xuICAgICAgLy8gc2l6ZVNjYWxlIG5vdyBzcGxpdCBpbnRvIHJhZGl1c1NjYWxlLCBoZWlnaHRTY2FsZVxuICAgICAgLy8gbm8gdXNlciBjdXN0b21pemF0aW9uLCBqdXN0IHVzZSBkZWZhdWx0XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHZpc3VhbENoYW5uZWxzOiB7XG4gICAgICAgIC4uLihhY2N1bXVsYXRlZC52aXN1YWxDaGFubmVscyB8fCB7fSksXG4gICAgICAgIFt0aGlzLmtleV06IHNjYWxlXG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuXG4vLyB1c2VkIHRvIGNvbnZlcnQgdjAgdG8gdjEgbGF5ZXIgY29uZmlnXG5jbGFzcyBMYXllckNvbmZpZ1NjaGVtYVYwIGV4dGVuZHMgU2NoZW1hIHtcbiAgdmVyc2lvbiA9IFZFUlNJT05TLnYwO1xuICBsb2FkKHNhdmVkLCBsYXllciwgYWNjdW11bGF0ZWQpIHtcbiAgICAvLyBmb2xkIHYwIGxheWVyIHByb3BlcnR5IGludG8gY29uZmlnLmtleVxuICAgIHJldHVybiB7XG4gICAgICBjb25maWc6IHtcbiAgICAgICAgLi4uKGFjY3VtdWxhdGVkLmNvbmZpZyB8fCB7fSksXG4gICAgICAgIFt0aGlzLmtleV06IHNhdmVkXG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuXG4vLyB1c2VkIHRvIGNvbnZlcnQgdjAgdG8gdjEgbGF5ZXIgY29sdW1uc1xuLy8gb25seSByZXR1cm4gY29sdW1uIHZhbHVlIGZvciBlYWNoIGNvbHVtblxuY2xhc3MgTGF5ZXJDb2x1bW5zU2NoZW1hVjAgZXh0ZW5kcyBTY2hlbWEge1xuICB2ZXJzaW9uID0gVkVSU0lPTlMudjA7XG4gIGxvYWQoc2F2ZWQsIGxheWVyLCBhY2N1bXVsYXRlZCkge1xuICAgIC8vIGZvbGQgdjAgbGF5ZXIgcHJvcGVydHkgaW50byBjb25maWcua2V5LCBmbGF0dGVuIGNvbHVtbnNcbiAgICByZXR1cm4ge1xuICAgICAgY29uZmlnOiB7XG4gICAgICAgIC4uLihhY2N1bXVsYXRlZC5jb25maWcgfHwge30pLFxuICAgICAgICBjb2x1bW5zOiBPYmplY3Qua2V5cyhzYXZlZCkucmVkdWNlKFxuICAgICAgICAgIChhY2N1LCBrZXkpID0+ICh7XG4gICAgICAgICAgICAuLi5hY2N1LFxuICAgICAgICAgICAgW2tleV06IHNhdmVkW2tleV0udmFsdWVcbiAgICAgICAgICB9KSxcbiAgICAgICAgICB7fVxuICAgICAgICApXG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuXG4vLyB1c2VkIHRvIGNvbnZlcnQgdjAgdG8gdjEgbGF5ZXIgY29uZmlnLnZpc0NvbmZpZ1xuY2xhc3MgTGF5ZXJDb25maWdUb1Zpc0NvbmZpZ1NjaGVtYVYwIGV4dGVuZHMgU2NoZW1hIHtcbiAgdmVyc2lvbiA9IFZFUlNJT05TLnYwO1xuICBsb2FkKHNhdmVkLCBsYXllciwgYWNjdW11bGF0ZWQpIHtcbiAgICAvLyBmb2xkIHYwIGxheWVyIHByb3BlcnR5IGludG8gY29uZmlnLnZpc0NvbmZpZ1xuICAgIGNvbnN0IGFjY3VtdWxhdGVkQ29uZmlnID0gYWNjdW11bGF0ZWQuY29uZmlnIHx8IHt9O1xuICAgIHJldHVybiB7XG4gICAgICBjb25maWc6IHtcbiAgICAgICAgLi4uYWNjdW11bGF0ZWRDb25maWcsXG4gICAgICAgIHZpc0NvbmZpZzoge1xuICAgICAgICAgIC4uLihhY2N1bXVsYXRlZENvbmZpZy52aXNDb25maWcgfHwge30pLFxuICAgICAgICAgIFt0aGlzLmtleV06IHNhdmVkXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG5cbmNsYXNzIExheWVyVmlzQ29uZmlnU2NoZW1hVjAgZXh0ZW5kcyBTY2hlbWEge1xuICB2ZXJzaW9uID0gVkVSU0lPTlMudjA7XG4gIGtleSA9ICd2aXNDb25maWcnO1xuXG4gIGxvYWQodmlzQ29uZmlnLCBjb25maWcsIGFjY3VtdWxhdG9yKSB7XG4gICAgY29uc3QgcmVuYW1lID0ge1xuICAgICAgZ2VvanNvbjoge1xuICAgICAgICBleHRydWRlZDogJ2VuYWJsZTNkJyxcbiAgICAgICAgZWxldmF0aW9uUmFuZ2U6ICdoZWlnaHRSYW5nZSdcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKGNvbmZpZy50eXBlIGluIHJlbmFtZSkge1xuICAgICAgY29uc3QgcHJvcFRvUmVuYW1lID0gcmVuYW1lW2NvbmZpZy50eXBlXTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgIC4uLihhY2N1bXVsYXRvci5jb25maWcgfHwge30pLFxuICAgICAgICAgIHZpc0NvbmZpZzogT2JqZWN0LmtleXModmlzQ29uZmlnKS5yZWR1Y2UoXG4gICAgICAgICAgICAoYWNjdSwga2V5KSA9PiAoe1xuICAgICAgICAgICAgICAuLi5hY2N1LFxuICAgICAgICAgICAgICAuLi4ocHJvcFRvUmVuYW1lW2tleV1cbiAgICAgICAgICAgICAgICA/IHtbcHJvcFRvUmVuYW1lW2tleV1dOiB2aXNDb25maWdba2V5XX1cbiAgICAgICAgICAgICAgICA6IHtba2V5XTogdmlzQ29uZmlnW2tleV19KVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB7fVxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgY29uZmlnOiB7XG4gICAgICAgIC4uLihhY2N1bXVsYXRvci5jb25maWcgfHwge30pLFxuICAgICAgICB2aXNDb25maWdcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG5cbmNsYXNzIExheWVyQ29uZmlnU2NoZW1hRGVsZXRlVjAgZXh0ZW5kcyBTY2hlbWEge1xuICB2ZXJzaW9uID0gVkVSU0lPTlMudjA7XG4gIGxvYWQodmFsdWUpIHtcbiAgICByZXR1cm4ge307XG4gIH1cbn1cblxuLyoqXG4gKiBWMCAtPiBWMSBDaGFuZ2VzXG4gKiAtIGxheWVyIGlzIG5vdyBhIGNsYXNzXG4gKiAtIGNvbmZpZyBzYXZlZCBpbiBhIGNvbmZpZyBvYmplY3RcbiAqIC0gaWQsIHR5cGUsIGlzQWdncmVnYXRlZCBpcyBvdXRzaWRlIGxheWVyLmNvbmZpZ1xuICogLSB2aXN1YWxDaGFubmVscyBpcyBvdXRzaWRlIGNvbmZpZywgaXQgZGVmaW5lcyBhdmFpbGFibGUgdmlzdWFsIGNoYW5uZWwgYW5kXG4gKiAgIHByb3BlcnR5IG5hbWVzIGZvciBmaWVsZCwgc2NhbGUsIGRvbWFpbiBhbmQgcmFuZ2Ugb2YgZWFjaCB2aXN1YWwgY2hhbmVsLlxuICogLSBlbmFibGUzZCwgY29sb3JBZ2dyZWdhdGlvbiBhbmQgc2l6ZUFnZ3JlZ2F0aW9uIGFyZSBtb3ZlZCBpbnRvIHZpc0NvbmZpZ1xuICogLSBHZW9qc29uTGF5ZXIgLSBhZGRlZCBoZWlnaHQsIHJhZGl1cyBzcGVjaWZpYyBwcm9wZXJ0aWVzXG4gKi9cblxuZXhwb3J0IGNvbnN0IGxheWVyUHJvcHNWMCA9IHtcbiAgaWQ6IG51bGwsXG4gIHR5cGU6IG51bGwsXG5cbiAgLy8gbW92ZSBpbnRvIGxheWVyLmNvbmZpZ1xuICBkYXRhSWQ6IG5ldyBMYXllckNvbmZpZ1NjaGVtYVYwKHtrZXk6ICdkYXRhSWQnfSksXG4gIGxhYmVsOiBuZXcgTGF5ZXJDb25maWdTY2hlbWFWMCh7a2V5OiAnbGFiZWwnfSksXG4gIGNvbG9yOiBuZXcgTGF5ZXJDb25maWdTY2hlbWFWMCh7a2V5OiAnY29sb3InfSksXG4gIGlzVmlzaWJsZTogbmV3IExheWVyQ29uZmlnU2NoZW1hVjAoe2tleTogJ2lzVmlzaWJsZSd9KSxcblxuICAvLyBjb252ZXJ0IHZpc0NvbmZpZ1xuICB2aXNDb25maWc6IG5ldyBMYXllclZpc0NvbmZpZ1NjaGVtYVYwKHtrZXk6ICd2aXNDb25maWcnfSksXG5cbiAgLy8gbW92ZSBpbnRvIGxheWVyLmNvbmZpZ1xuICAvLyBmbGF0dGVuXG4gIGNvbHVtbnM6IG5ldyBMYXllckNvbHVtbnNTY2hlbWFWMCgpLFxuXG4gIC8vIHNhdmUgaW50byB2aXN1YWxDaGFubmVsc1xuICBjb2xvckZpZWxkOiBuZXcgRGltZW5zaW9uRmllbGRTY2hlbWFWMCh7XG4gICAgcHJvcGVydGllczogZGltZW5zaW9uUHJvcHNWMCxcbiAgICBrZXk6ICdjb2xvckZpZWxkJ1xuICB9KSxcbiAgY29sb3JTY2FsZTogbmV3IERpbWVuc2lvblNjYWxlU2NoZW1hVjAoe1xuICAgIGtleTogJ2NvbG9yU2NhbGUnXG4gIH0pLFxuICBzaXplRmllbGQ6IG5ldyBEaW1lbnNpb25GaWVsZFNjaGVtYVYwKHtcbiAgICBwcm9wZXJ0aWVzOiBkaW1lbnNpb25Qcm9wc1YwLFxuICAgIGtleTogJ3NpemVGaWVsZCdcbiAgfSksXG4gIHNpemVTY2FsZTogbmV3IERpbWVuc2lvblNjYWxlU2NoZW1hVjAoe1xuICAgIGtleTogJ3NpemVTY2FsZSdcbiAgfSksXG5cbiAgLy8gbW92ZSBpbnRvIGNvbmZpZy52aXNDb25maWdcbiAgZW5hYmxlM2Q6IG5ldyBMYXllckNvbmZpZ1RvVmlzQ29uZmlnU2NoZW1hVjAoe2tleTogJ2VuYWJsZTNkJ30pLFxuICBjb2xvckFnZ3JlZ2F0aW9uOiBuZXcgTGF5ZXJDb25maWdUb1Zpc0NvbmZpZ1NjaGVtYVYwKHtcbiAgICBrZXk6ICdjb2xvckFnZ3JlZ2F0aW9uJ1xuICB9KSxcbiAgc2l6ZUFnZ3JlZ2F0aW9uOiBuZXcgTGF5ZXJDb25maWdUb1Zpc0NvbmZpZ1NjaGVtYVYwKHtrZXk6ICdzaXplQWdncmVnYXRpb24nfSksXG5cbiAgLy8gZGVsZXRlXG4gIGlzQWdncmVnYXRlZDogbmV3IExheWVyQ29uZmlnU2NoZW1hRGVsZXRlVjAoKVxufTtcblxuLyoqXG4gKiBWMSBTY2hlbWFcbiAqL1xuY2xhc3MgQ29sdW1uU2NoZW1hVjEgZXh0ZW5kcyBTY2hlbWEge1xuICBzYXZlKGNvbHVtbnMsIHN0YXRlKSB7XG4gICAgLy8gc3RhcnRpbmcgZnJvbSB2MSwgb25seSBzYXZlIGNvbHVtbiB2YWx1ZVxuICAgIC8vIGZpZWxkSWR4IHdpbGwgYmUgY2FsY3VsYXRlZCBkdXJpbmcgbWVyZ2VcbiAgICByZXR1cm4ge1xuICAgICAgW3RoaXMua2V5XTogT2JqZWN0LmtleXMoY29sdW1ucykucmVkdWNlKFxuICAgICAgICAoYWNjdSwgY2tleSkgPT4gKHtcbiAgICAgICAgICAuLi5hY2N1LFxuICAgICAgICAgIFtja2V5XTogY29sdW1uc1tja2V5XS52YWx1ZVxuICAgICAgICB9KSxcbiAgICAgICAge31cbiAgICAgIClcbiAgICB9O1xuICB9XG5cbiAgbG9hZChjb2x1bW5zKSB7XG4gICAgcmV0dXJuIHtjb2x1bW5zfTtcbiAgfVxufVxuXG4vKipcbiAqIFYxOiBzYXZlIFtmaWVsZF06IHtuYW1lLCB0eXBlfSwgW3NjYWxlXTogJycgZm9yIGVhY2ggY2hhbm5lbFxuICovXG5jbGFzcyBWaXN1YWxDaGFubmVsU2NoZW1hVjEgZXh0ZW5kcyBTY2hlbWEge1xuICBzYXZlKHZpc3VhbENoYW5uZWxzLCBsYXllcikge1xuICAgIC8vIG9ubHkgc2F2ZSBmaWVsZCBhbmQgc2NhbGUgb2YgZWFjaCBjaGFubmVsXG4gICAgcmV0dXJuIHtcbiAgICAgIFt0aGlzLmtleV06IE9iamVjdC5rZXlzKHZpc3VhbENoYW5uZWxzKS5yZWR1Y2UoXG4gICAgICAgIC8vICBzYXZlIGNoYW5uZWwgdG8gbnVsbCBpZiBkaWRuJ3Qgc2VsZWN0IGFueSBmaWVsZFxuICAgICAgICAoYWNjdSwga2V5KSA9PiAoe1xuICAgICAgICAgIC4uLmFjY3UsXG4gICAgICAgICAgW3Zpc3VhbENoYW5uZWxzW2tleV0uZmllbGRdOiBsYXllci5jb25maWdbdmlzdWFsQ2hhbm5lbHNba2V5XS5maWVsZF1cbiAgICAgICAgICAgID8gcGljayhsYXllci5jb25maWdbdmlzdWFsQ2hhbm5lbHNba2V5XS5maWVsZF0sIFsnbmFtZScsICd0eXBlJ10pXG4gICAgICAgICAgICA6IG51bGwsXG4gICAgICAgICAgW3Zpc3VhbENoYW5uZWxzW2tleV0uc2NhbGVdOiBsYXllci5jb25maWdbdmlzdWFsQ2hhbm5lbHNba2V5XS5zY2FsZV1cbiAgICAgICAgfSksXG4gICAgICAgIHt9XG4gICAgICApXG4gICAgfTtcbiAgfVxuICBsb2FkKHZjLCBsYXllciwgYWNjdW11bGF0b3IpIHtcbiAgICAvLyBmb2xkIGNoYW5uZWxzIGludG8gY29uZmlnXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmFjY3VtdWxhdG9yLFxuICAgICAgY29uZmlnOiB7XG4gICAgICAgIC4uLihhY2N1bXVsYXRvci5jb25maWcgfHwge30pLFxuICAgICAgICAuLi52Y1xuICAgICAgfVxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGxheWVyUHJvcHNWMSA9IHtcbiAgaWQ6IG51bGwsXG4gIHR5cGU6IG51bGwsXG4gIGNvbmZpZzogbmV3IFNjaGVtYSh7XG4gICAgdmVyc2lvbjogVkVSU0lPTlMudjEsXG4gICAga2V5OiAnY29uZmlnJyxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBkYXRhSWQ6IG51bGwsXG4gICAgICBsYWJlbDogbnVsbCxcbiAgICAgIGNvbG9yOiBudWxsLFxuICAgICAgY29sdW1uczogbmV3IENvbHVtblNjaGVtYVYxKHtcbiAgICAgICAgdmVyc2lvbjogVkVSU0lPTlMudjEsXG4gICAgICAgIGtleTogJ2NvbHVtbnMnXG4gICAgICB9KSxcbiAgICAgIGlzVmlzaWJsZTogbnVsbCxcbiAgICAgIHZpc0NvbmZpZzogbnVsbFxuICAgIH1cbiAgfSksXG4gIHZpc3VhbENoYW5uZWxzOiBuZXcgVmlzdWFsQ2hhbm5lbFNjaGVtYVYxKHtcbiAgICB2ZXJzaW9uOiBWRVJTSU9OUy52MSxcbiAgICBrZXk6ICd2aXN1YWxDaGFubmVscydcbiAgfSlcbn07XG5cbmNsYXNzIExheWVyU2NoZW1hVjAgZXh0ZW5kcyBTY2hlbWEge1xuICBrZXkgPSAnbGF5ZXJzJztcblxuICBzYXZlKGxheWVycywgdmlzU3RhdGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgW3RoaXMua2V5XTogdmlzU3RhdGUubGF5ZXJPcmRlci5yZWR1Y2UoKHNhdmVkLCBpbmRleCkgPT4ge1xuICAgICAgICAvLyBzYXZlIGxheWVycyBhY2NvcmRpbmcgdG8gdGhlaXIgcmVuZGVyaW5nIG9yZGVyXG4gICAgICAgIGNvbnN0IGxheWVyID0gbGF5ZXJzW2luZGV4XTtcbiAgICAgICAgaWYgKGxheWVyLmlzVmFsaWRUb1NhdmUoKSkge1xuICAgICAgICAgIHNhdmVkLnB1c2godGhpcy5zYXZlUHJvcGVydGllc09yQXBwbHlTY2hlbWEobGF5ZXIpLmxheWVycyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNhdmVkO1xuICAgICAgfSwgW10pXG4gICAgfTtcbiAgfVxuXG4gIGxvYWQobGF5ZXJzLCB2aXNTdGF0ZSkge1xuICAgIHJldHVybiB7XG4gICAgICBbdGhpcy5rZXldOiBsYXllcnMubWFwKFxuICAgICAgICBsYXllciA9PiB0aGlzLmxvYWRQcm9wZXJ0aWVzT3JBcHBseVNjaGVtYShsYXllciwgbGF5ZXJzKS5sYXllcnNcbiAgICAgIClcbiAgICB9O1xuICB9XG59XG5cbmNsYXNzIEZpbHRlclNjaGVtYVYwIGV4dGVuZHMgU2NoZW1hIHtcbiAga2V5ID0gJ2ZpbHRlcnMnO1xuICBzYXZlKGZpbHRlcnMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZmlsdGVyczogZmlsdGVyc1xuICAgICAgICAuZmlsdGVyKGlzVmFsaWRGaWx0ZXJWYWx1ZSlcbiAgICAgICAgLm1hcChcbiAgICAgICAgICBmaWx0ZXIgPT5cbiAgICAgICAgICAgIHRoaXMuc2F2ZVByb3BlcnRpZXNPckFwcGx5U2NoZW1hKGZpbHRlciwgdGhpcy5wcm9wZXJ0aWVzKS5maWx0ZXJzXG4gICAgICAgIClcbiAgICB9O1xuICB9XG4gIGxvYWQoZmlsdGVycykge1xuICAgIHJldHVybiB7ZmlsdGVyc307XG4gIH1cbn1cblxuY29uc3QgaW50ZXJhY3Rpb25Qcm9wc1YwID0gWyd0b29sdGlwJywgJ2JydXNoJ107XG5cbmNsYXNzIEludGVyYWN0aW9uU2NoZW1hVjAgZXh0ZW5kcyBTY2hlbWEge1xuICBrZXkgPSAnaW50ZXJhY3Rpb25Db25maWcnO1xuXG4gIHNhdmUoaW50ZXJhY3Rpb25Db25maWcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgW3RoaXMua2V5XTogdGhpcy5wcm9wZXJ0aWVzLnJlZHVjZShcbiAgICAgICAgKGFjY3UsIGtleSkgPT4gKHtcbiAgICAgICAgICAuLi5hY2N1LFxuICAgICAgICAgIC4uLihpbnRlcmFjdGlvbkNvbmZpZ1trZXldLmVuYWJsZWRcbiAgICAgICAgICAgID8ge1trZXldOiBpbnRlcmFjdGlvbkNvbmZpZ1trZXldLmNvbmZpZ31cbiAgICAgICAgICAgIDoge30pXG4gICAgICAgIH0pLFxuICAgICAgICB7fVxuICAgICAgKVxuICAgIH07XG4gIH1cbiAgbG9hZChpbnRlcmFjdGlvbkNvbmZpZykge1xuICAgIC8vIGNvbnZlcnQgdjAgLT4gdjFcbiAgICAvLyByZXR1cm4gZW5hYmxlZDogZmFsc2UgaWYgZGlzYWJsZWQsXG4gICAgcmV0dXJuIHtcbiAgICAgIFt0aGlzLmtleV06IHRoaXMucHJvcGVydGllcy5yZWR1Y2UoXG4gICAgICAgIChhY2N1LCBrZXkpID0+ICh7XG4gICAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgICAuLi57XG4gICAgICAgICAgICBba2V5XToge1xuICAgICAgICAgICAgICAuLi4oaW50ZXJhY3Rpb25Db25maWdba2V5XSB8fCB7fSksXG4gICAgICAgICAgICAgIGVuYWJsZWQ6IEJvb2xlYW4oaW50ZXJhY3Rpb25Db25maWdba2V5XSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICAgICB7fVxuICAgICAgKVxuICAgIH07XG4gIH1cbn1cblxuY2xhc3MgSW50ZXJhY3Rpb25TY2hlbWFWMSBleHRlbmRzIFNjaGVtYSB7XG4gIGtleSA9ICdpbnRlcmFjdGlvbkNvbmZpZyc7XG5cbiAgc2F2ZShpbnRlcmFjdGlvbkNvbmZpZykge1xuICAgIC8vIHNhdmUgY29uZmlnIGV2ZW4gaWYgZGlzYWJsZWQsXG4gICAgcmV0dXJuIHtcbiAgICAgIFt0aGlzLmtleV06IHRoaXMucHJvcGVydGllcy5yZWR1Y2UoXG4gICAgICAgIChhY2N1LCBrZXkpID0+ICh7XG4gICAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgICBba2V5XToge1xuICAgICAgICAgICAgLi4uaW50ZXJhY3Rpb25Db25maWdba2V5XS5jb25maWcsXG4gICAgICAgICAgICBlbmFibGVkOiBpbnRlcmFjdGlvbkNvbmZpZ1trZXldLmVuYWJsZWRcbiAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICAgICB7fVxuICAgICAgKVxuICAgIH07XG4gIH1cbiAgbG9hZChpbnRlcmFjdGlvbkNvbmZpZykge1xuICAgIHJldHVybiB7W3RoaXMua2V5XTogaW50ZXJhY3Rpb25Db25maWd9O1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBmaWx0ZXJQcm9wc1YwID0ge1xuICBkYXRhSWQ6IG51bGwsXG4gIGlkOiBudWxsLFxuICBuYW1lOiBudWxsLFxuICB0eXBlOiBudWxsLFxuICB2YWx1ZTogbnVsbCxcbiAgZW5sYXJnZWQ6IG51bGxcbn07XG5cbmV4cG9ydCBjbGFzcyBEaW1lbnNpb25GaWVsZFNjaGVtYSBleHRlbmRzIFNjaGVtYSB7XG4gIHNhdmUoZmllbGQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgW3RoaXMua2V5XTogZmllbGRcbiAgICAgICAgPyB0aGlzLnNhdmVQcm9wZXJ0aWVzT3JBcHBseVNjaGVtYShmaWVsZClbdGhpcy5rZXldXG4gICAgICAgIDogbnVsbFxuICAgIH07XG4gIH1cblxuICBsb2FkKGZpZWxkKSB7XG4gICAgcmV0dXJuIHtbdGhpcy5rZXldOiBmaWVsZH07XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGZpbHRlclByb3BzVjEgPSB7XG4gIC4uLmZpbHRlclByb3BzVjAsXG4gIHBsb3RUeXBlOiBudWxsLFxuICB5QXhpczogbmV3IERpbWVuc2lvbkZpZWxkU2NoZW1hKHtcbiAgICB2ZXJzaW9uOiBWRVJTSU9OUy52MSxcbiAgICBrZXk6ICd5QXhpcycsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgbmFtZTogbnVsbCxcbiAgICAgIHR5cGU6IG51bGxcbiAgICB9XG4gIH0pXG59O1xuXG5leHBvcnQgY29uc3QgcHJvcGVydGllc1YwID0ge1xuICBmaWx0ZXJzOiBuZXcgRmlsdGVyU2NoZW1hVjAoe1xuICAgIHZlcnNpb246IFZFUlNJT05TLnYwLFxuICAgIHByb3BlcnRpZXM6IGZpbHRlclByb3BzVjBcbiAgfSksXG4gIGxheWVyczogbmV3IExheWVyU2NoZW1hVjAoe1xuICAgIHZlcnNpb246IFZFUlNJT05TLnYwLFxuICAgIHByb3BlcnRpZXM6IGxheWVyUHJvcHNWMFxuICB9KSxcbiAgaW50ZXJhY3Rpb25Db25maWc6IG5ldyBJbnRlcmFjdGlvblNjaGVtYVYwKHtcbiAgICB2ZXJzaW9uOiBWRVJTSU9OUy52MCxcbiAgICBwcm9wZXJ0aWVzOiBpbnRlcmFjdGlvblByb3BzVjBcbiAgfSksXG4gIGxheWVyQmxlbmRpbmc6IG51bGxcbn07XG5cbmV4cG9ydCBjb25zdCBwcm9wZXJ0aWVzVjEgPSB7XG4gIGZpbHRlcnM6IG5ldyBGaWx0ZXJTY2hlbWFWMCh7XG4gICAgdmVyc2lvbjogVkVSU0lPTlMudjEsXG4gICAgcHJvcGVydGllczogZmlsdGVyUHJvcHNWMVxuICB9KSxcbiAgbGF5ZXJzOiBuZXcgTGF5ZXJTY2hlbWFWMCh7XG4gICAgdmVyc2lvbjogVkVSU0lPTlMudjEsXG4gICAgcHJvcGVydGllczogbGF5ZXJQcm9wc1YxXG4gIH0pLFxuICBpbnRlcmFjdGlvbkNvbmZpZzogbmV3IEludGVyYWN0aW9uU2NoZW1hVjEoe1xuICAgIHZlcnNpb246IFZFUlNJT05TLnYxLFxuICAgIHByb3BlcnRpZXM6IGludGVyYWN0aW9uUHJvcHNWMFxuICB9KSxcbiAgbGF5ZXJCbGVuZGluZzogbnVsbCxcbiAgc3BsaXRNYXBzOiBudWxsXG59O1xuXG5leHBvcnQgY29uc3QgdmlzU3RhdGVTY2hlbWFWMCA9IG5ldyBTY2hlbWEoe1xuICB2ZXJzaW9uOiBWRVJTSU9OUy52MCxcbiAgcHJvcGVydGllczogcHJvcGVydGllc1YwLFxuICBrZXk6ICd2aXNTdGF0ZSdcbn0pO1xuXG5leHBvcnQgY29uc3QgdmlzU3RhdGVTY2hlbWFWMSA9IG5ldyBTY2hlbWEoe1xuICB2ZXJzaW9uOiBWRVJTSU9OUy52MSxcbiAgcHJvcGVydGllczogcHJvcGVydGllc1YxLFxuICBrZXk6ICd2aXNTdGF0ZSdcbn0pO1xuXG5leHBvcnQgY29uc3QgdmlzU3RhdGVTY2hlbWEgPSB7XG4gIFtWRVJTSU9OUy52MF06IHtcbiAgICBzYXZlOiB0b1NhdmUgPT4gdmlzU3RhdGVTY2hlbWFWMC5zYXZlKHRvU2F2ZSksXG4gICAgbG9hZDogdG9Mb2FkID0+XG4gICAgICB2aXNTdGF0ZVNjaGVtYVYxLmxvYWQodmlzU3RhdGVTY2hlbWFWMC5sb2FkKHRvTG9hZCkudmlzU3RhdGUpXG4gIH0sXG4gIFtWRVJTSU9OUy52MV06IHZpc1N0YXRlU2NoZW1hVjFcbn07XG5cbi8vIHRlc3QgbG9hZCB2MFxuZXhwb3J0IGRlZmF1bHQgdmlzU3RhdGVTY2hlbWE7XG4iXX0=