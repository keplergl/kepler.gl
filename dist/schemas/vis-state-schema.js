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
  colorAggregation: new LayerConfigToVisConfigSchemaV0({ key: 'colorAggregation' }),
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

;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL3Zpcy1zdGF0ZS1zY2hlbWEuanMiXSwibmFtZXMiOlsiZGltZW5zaW9uUHJvcHNWMCIsImdlb2pzb25TaXplRmllbGRWMFRvVjEiLCJjb25maWciLCJkZWZhdWx0UmFpdWRzIiwiZGVmYXVsdFJhZGl1c1JhbmdlIiwidmlzQ29uZmlnIiwiZXh0cnVkZWQiLCJzdHJva2VkIiwicmFkaXVzIiwicmFkaXVzUmFuZ2UiLCJzb21lIiwiZCIsImkiLCJEaW1lbnNpb25GaWVsZFNjaGVtYVYwIiwidmVyc2lvbiIsInYwIiwic2F2ZSIsImZpZWxkIiwia2V5Iiwic2F2ZVByb3BlcnRpZXNPckFwcGx5U2NoZW1hIiwibG9hZCIsImFjY3VtdWxhdGVkIiwiZmllbGROYW1lIiwidHlwZSIsInZpc3VhbENoYW5uZWxzIiwiRGltZW5zaW9uU2NhbGVTY2hlbWFWMCIsInNjYWxlIiwiTGF5ZXJDb25maWdTY2hlbWFWMCIsInNhdmVkIiwibGF5ZXIiLCJMYXllckNvbHVtbnNTY2hlbWFWMCIsImNvbHVtbnMiLCJPYmplY3QiLCJrZXlzIiwicmVkdWNlIiwiYWNjdSIsInZhbHVlIiwiTGF5ZXJDb25maWdUb1Zpc0NvbmZpZ1NjaGVtYVYwIiwiYWNjdW11bGF0ZWRDb25maWciLCJMYXllclZpc0NvbmZpZ1NjaGVtYVYwIiwiYWNjdW11bGF0b3IiLCJyZW5hbWUiLCJnZW9qc29uIiwiZWxldmF0aW9uUmFuZ2UiLCJwcm9wVG9SZW5hbWUiLCJMYXllckNvbmZpZ1NjaGVtYURlbGV0ZVYwIiwibGF5ZXJQcm9wc1YwIiwiaWQiLCJkYXRhSWQiLCJsYWJlbCIsImNvbG9yIiwiaXNWaXNpYmxlIiwiY29sb3JGaWVsZCIsInByb3BlcnRpZXMiLCJjb2xvclNjYWxlIiwic2l6ZUZpZWxkIiwic2l6ZVNjYWxlIiwiZW5hYmxlM2QiLCJjb2xvckFnZ3JlZ2F0aW9uIiwic2l6ZUFnZ3JlZ2F0aW9uIiwiaXNBZ2dyZWdhdGVkIiwiQ29sdW1uU2NoZW1hVjEiLCJzdGF0ZSIsImNrZXkiLCJWaXN1YWxDaGFubmVsU2NoZW1hVjEiLCJ2YyIsImxheWVyUHJvcHNWMSIsInYxIiwiTGF5ZXJTY2hlbWFWMCIsImxheWVycyIsInZpc1N0YXRlIiwibGF5ZXJPcmRlciIsImluZGV4IiwiaXNWYWxpZFRvU2F2ZSIsInB1c2giLCJtYXAiLCJsb2FkUHJvcGVydGllc09yQXBwbHlTY2hlbWEiLCJGaWx0ZXJTY2hlbWFWMCIsImZpbHRlcnMiLCJmaWx0ZXIiLCJpbnRlcmFjdGlvblByb3BzVjAiLCJJbnRlcmFjdGlvblNjaGVtYVYwIiwiaW50ZXJhY3Rpb25Db25maWciLCJlbmFibGVkIiwiQm9vbGVhbiIsIkludGVyYWN0aW9uU2NoZW1hVjEiLCJmaWx0ZXJQcm9wc1YwIiwibmFtZSIsImVubGFyZ2VkIiwiRGltZW5zaW9uRmllbGRTY2hlbWEiLCJmaWx0ZXJQcm9wc1YxIiwicGxvdFR5cGUiLCJ5QXhpcyIsInByb3BlcnRpZXNWMCIsImxheWVyQmxlbmRpbmciLCJwcm9wZXJ0aWVzVjEiLCJzcGxpdE1hcHMiLCJ2aXNTdGF0ZVNjaGVtYVYwIiwidmlzU3RhdGVTY2hlbWFWMSIsInZpc1N0YXRlU2NoZW1hIiwidG9TYXZlIiwidG9Mb2FkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7QUFFQTs7Ozs7O0FBRUE7Ozs7QUFJTyxJQUFNQSw4Q0FBbUIsQ0FBQyxNQUFELEVBQVMsTUFBVCxDQUF6Qjs7QUFFUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBU0Msc0JBQVQsQ0FBZ0NDLE1BQWhDLEVBQXdDO0FBQ3RDLE1BQU1DLGdCQUFnQixFQUF0QjtBQUNBLE1BQU1DLHFCQUFxQixDQUFDLENBQUQsRUFBSSxFQUFKLENBQTNCOztBQUVBO0FBQ0EsTUFBSUYsT0FBT0csU0FBUCxDQUFpQkMsUUFBckIsRUFBK0I7QUFDN0IsV0FBTyxhQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxNQUFJSixPQUFPRyxTQUFQLENBQWlCRSxPQUFyQixFQUE4QjtBQUM1QixXQUFPLFdBQVA7QUFDRDs7QUFFRDtBQUNBO0FBQ0EsTUFBSUwsT0FBT0csU0FBUCxDQUFpQkcsTUFBakIsS0FBNEJMLGFBQTVCLElBQ0ZELE9BQU9HLFNBQVAsQ0FBaUJJLFdBQWpCLENBQTZCQyxJQUE3QixDQUFrQyxVQUFDQyxDQUFELEVBQUlDLENBQUo7QUFBQSxXQUFVRCxNQUFNUCxtQkFBbUJRLENBQW5CLENBQWhCO0FBQUEsR0FBbEMsQ0FERixFQUM0RTtBQUMxRSxXQUFPLGFBQVA7QUFDRDs7QUFFRCxTQUFPLFdBQVA7QUFDRDs7QUFFRDs7SUFDTUMsc0I7Ozs7Ozs7Ozs7OztvSkFDSkMsTyxHQUFVLG1CQUFTQyxFOzs7bUNBQ25CQyxJLGlCQUFLQyxLLEVBQU9mLE0sRUFBUTtBQUFBOztBQUNsQjtBQUNBLDJCQUNHLEtBQUtnQixHQURSLElBRUlELFVBQVUsSUFBVixHQUNJLEtBQUtFLDJCQUFMLENBQWlDRixLQUFqQyxFQUF3QyxLQUFLQyxHQUE3QyxDQURKLEdBRUksSUFKUjtBQU1ELEc7O21DQUVERSxJLGlCQUFLSCxLLEVBQU9mLE0sRUFBUW1CLFcsRUFBYTtBQUFBOztBQUMvQixRQUFJQyxZQUFZLEtBQUtKLEdBQXJCO0FBQ0EsUUFBSWhCLE9BQU9xQixJQUFQLEtBQWdCLFNBQWhCLElBQTZCLEtBQUtMLEdBQUwsS0FBYSxXQUExQyxJQUF5REQsS0FBN0QsRUFBb0U7QUFDbEVLLGtCQUFZckIsdUJBQXVCQyxNQUF2QixDQUFaO0FBQ0Q7QUFDRDtBQUNBLFdBQU87QUFDTHNCLGtEQUNNSCxZQUFZRyxjQUFaLElBQThCLEVBRHBDLDZCQUVHRixTQUZILElBRWVMLEtBRmY7QUFESyxLQUFQO0FBTUQsRzs7Ozs7SUFHR1Esc0I7Ozs7Ozs7Ozs7OzsySkFDSlgsTyxHQUFVLG1CQUFTQyxFOzs7bUNBQ25CQyxJLGlCQUFLVSxLLEVBQU87QUFBQTs7QUFDViw2QkFBUyxLQUFLUixHQUFkLElBQW9CUSxLQUFwQjtBQUNELEc7O21DQUNETixJLGlCQUFLTSxLLEVBQU94QixNLEVBQVFtQixXLEVBQWE7QUFBQTs7QUFDL0I7QUFDQSxRQUFJLEtBQUtILEdBQUwsS0FBYSxXQUFiLElBQTRCaEIsT0FBT3FCLElBQVAsS0FBZ0IsU0FBaEQsRUFBMkQ7QUFDekQ7QUFDQTtBQUNBLGFBQU8sRUFBUDtBQUNEOztBQUVELFdBQU87QUFDTEMsa0RBQ01ILFlBQVlHLGNBQVosSUFBOEIsRUFEcEMsNkJBRUcsS0FBS04sR0FGUixJQUVjUSxLQUZkO0FBREssS0FBUDtBQU1ELEc7Ozs7O0FBR0g7OztJQUNNQyxtQjs7Ozs7Ozs7Ozs7OzJKQUNKYixPLEdBQVUsbUJBQVNDLEU7OztnQ0FDbkJLLEksaUJBQUtRLEssRUFBT0MsSyxFQUFPUixXLEVBQWE7QUFBQTs7QUFDOUI7QUFDQSxXQUFPO0FBQ0xuQiwwQ0FDTW1CLFlBQVluQixNQUFaLElBQXNCLEVBRDVCLDZCQUVHLEtBQUtnQixHQUZSLElBRWNVLEtBRmQ7QUFESyxLQUFQO0FBTUQsRzs7Ozs7QUFHSDtBQUNBOzs7SUFDTUUsb0I7Ozs7Ozs7Ozs7OzsySkFDSmhCLE8sR0FBVSxtQkFBU0MsRTs7O2lDQUNuQkssSSxpQkFBS1EsSyxFQUFPQyxLLEVBQU9SLFcsRUFBYTtBQUM5QjtBQUNBLFdBQU87QUFDTG5CLDBDQUNNbUIsWUFBWW5CLE1BQVosSUFBc0IsRUFENUI7QUFFRTZCLGlCQUFTQyxPQUFPQyxJQUFQLENBQVlMLEtBQVosRUFBbUJNLE1BQW5CLENBQ1AsVUFBQ0MsSUFBRCxFQUFPakIsR0FBUDtBQUFBOztBQUFBLDZDQUNLaUIsSUFETCw2QkFFR2pCLEdBRkgsSUFFU1UsTUFBTVYsR0FBTixFQUFXa0IsS0FGcEI7QUFBQSxTQURPLEVBS1AsRUFMTztBQUZYO0FBREssS0FBUDtBQVlELEc7Ozs7O0FBR0g7OztJQUNNQyw4Qjs7Ozs7Ozs7Ozs7OzJKQUNKdkIsTyxHQUFVLG1CQUFTQyxFOzs7MkNBQ25CSyxJLGlCQUFLUSxLLEVBQU9DLEssRUFBT1IsVyxFQUFhO0FBQUE7O0FBQzlCO0FBQ0EsUUFBTWlCLG9CQUFvQmpCLFlBQVluQixNQUFaLElBQXNCLEVBQWhEO0FBQ0EsV0FBTztBQUNMQSwwQ0FDS29DLGlCQURMO0FBRUVqQywrQ0FDTWlDLGtCQUFrQmpDLFNBQWxCLElBQStCLEVBRHJDLDZCQUVHLEtBQUthLEdBRlIsSUFFY1UsS0FGZDtBQUZGO0FBREssS0FBUDtBQVNELEc7Ozs7O0lBR0dXLHNCOzs7Ozs7Ozs7Ozs7MkpBQ0p6QixPLEdBQVUsbUJBQVNDLEUsU0FDbkJHLEcsR0FBTSxXOzs7bUNBRU5FLEksaUJBQUtmLFMsRUFBV0gsTSxFQUFRc0MsVyxFQUFhO0FBQ25DLFFBQU1DLFNBQVM7QUFDYkMsZUFBUztBQUNQcEMsa0JBQVUsVUFESDtBQUVQcUMsd0JBQWdCO0FBRlQ7QUFESSxLQUFmOztBQU9BLFFBQUl6QyxPQUFPcUIsSUFBUCxJQUFla0IsTUFBbkIsRUFBMkI7QUFDekIsVUFBTUcsZUFBZUgsT0FBT3ZDLE9BQU9xQixJQUFkLENBQXJCO0FBQ0EsYUFBTztBQUNMckIsNENBQ01zQyxZQUFZdEMsTUFBWixJQUFzQixFQUQ1QjtBQUVFRyxxQkFBVzJCLE9BQU9DLElBQVAsQ0FBWTVCLFNBQVosRUFBdUI2QixNQUF2QixDQUE4QixVQUFDQyxJQUFELEVBQU9qQixHQUFQO0FBQUE7O0FBQUEsK0NBQ3BDaUIsSUFEb0MsRUFFbkNTLGFBQWExQixHQUFiLHVCQUFzQjBCLGFBQWExQixHQUFiLENBQXRCLElBQTBDYixVQUFVYSxHQUFWLENBQTFDLDhCQUE4REEsR0FBOUQsSUFBb0ViLFVBQVVhLEdBQVYsQ0FBcEUsUUFGbUM7QUFBQSxXQUE5QixFQUdQLEVBSE87QUFGYjtBQURLLE9BQVA7QUFTRDs7QUFFRCxXQUFPO0FBQ0xoQiwwQ0FDTXNDLFlBQVl0QyxNQUFaLElBQXNCLEVBRDVCO0FBRUVHO0FBRkY7QUFESyxLQUFQO0FBTUQsRzs7Ozs7SUFHR3dDLHlCOzs7Ozs7Ozs7Ozs7MkpBQ0ovQixPLEdBQVUsbUJBQVNDLEU7OztzQ0FDbkJLLEksaUJBQUtnQixLLEVBQU87QUFDVixXQUFPLEVBQVA7QUFDRCxHOzs7OztBQUdIOzs7Ozs7Ozs7OztBQVdPLElBQU1VLHNDQUFlO0FBQzFCQyxNQUFJLElBRHNCO0FBRTFCeEIsUUFBTSxJQUZvQjs7QUFJMUI7QUFDQXlCLFVBQVEsSUFBSXJCLG1CQUFKLENBQXdCLEVBQUNULEtBQUssUUFBTixFQUF4QixDQUxrQjtBQU0xQitCLFNBQU8sSUFBSXRCLG1CQUFKLENBQXdCLEVBQUNULEtBQUssT0FBTixFQUF4QixDQU5tQjtBQU8xQmdDLFNBQU8sSUFBSXZCLG1CQUFKLENBQXdCLEVBQUNULEtBQUssT0FBTixFQUF4QixDQVBtQjtBQVExQmlDLGFBQVcsSUFBSXhCLG1CQUFKLENBQXdCLEVBQUNULEtBQUssV0FBTixFQUF4QixDQVJlOztBQVUxQjtBQUNBYixhQUFXLElBQUlrQyxzQkFBSixDQUEyQixFQUFDckIsS0FBSyxXQUFOLEVBQTNCLENBWGU7O0FBYTFCO0FBQ0E7QUFDQWEsV0FBUyxJQUFJRCxvQkFBSixFQWZpQjs7QUFpQjFCO0FBQ0FzQixjQUFZLElBQUl2QyxzQkFBSixDQUEyQjtBQUNyQ3dDLGdCQUFZckQsZ0JBRHlCO0FBRXJDa0IsU0FBSztBQUZnQyxHQUEzQixDQWxCYztBQXNCMUJvQyxjQUFZLElBQUk3QixzQkFBSixDQUEyQjtBQUNyQ1AsU0FBSztBQURnQyxHQUEzQixDQXRCYztBQXlCMUJxQyxhQUFXLElBQUkxQyxzQkFBSixDQUEyQjtBQUNwQ3dDLGdCQUFZckQsZ0JBRHdCO0FBRXBDa0IsU0FBSztBQUYrQixHQUEzQixDQXpCZTtBQTZCMUJzQyxhQUFXLElBQUkvQixzQkFBSixDQUEyQjtBQUNwQ1AsU0FBSztBQUQrQixHQUEzQixDQTdCZTs7QUFpQzFCO0FBQ0F1QyxZQUFVLElBQUlwQiw4QkFBSixDQUFtQyxFQUFDbkIsS0FBSyxVQUFOLEVBQW5DLENBbENnQjtBQW1DMUJ3QyxvQkFBa0IsSUFBSXJCLDhCQUFKLENBQW1DLEVBQUNuQixLQUFLLGtCQUFOLEVBQW5DLENBbkNRO0FBb0MxQnlDLG1CQUFpQixJQUFJdEIsOEJBQUosQ0FBbUMsRUFBQ25CLEtBQUssaUJBQU4sRUFBbkMsQ0FwQ1M7O0FBc0MxQjtBQUNBMEMsZ0JBQWMsSUFBSWYseUJBQUo7QUF2Q1ksQ0FBckI7O0FBMENQOzs7O0lBR01nQixjOzs7Ozs7OzsyQkFDSjdDLEksaUJBQUtlLE8sRUFBUytCLEssRUFBTztBQUFBOztBQUNuQjtBQUNBO0FBQ0EsNkJBQ0csS0FBSzVDLEdBRFIsSUFDY2MsT0FBT0MsSUFBUCxDQUFZRixPQUFaLEVBQXFCRyxNQUFyQixDQUNWLFVBQUNDLElBQUQsRUFBTzRCLElBQVA7QUFBQTs7QUFBQSx5Q0FDSzVCLElBREwsNkJBRUc0QixJQUZILElBRVVoQyxRQUFRZ0MsSUFBUixFQUFjM0IsS0FGeEI7QUFBQSxLQURVLEVBS1YsRUFMVSxDQURkO0FBU0QsRzs7MkJBRURoQixJLGlCQUFLVyxPLEVBQVM7QUFDWixXQUFPLEVBQUNBLGdCQUFELEVBQVA7QUFDRCxHOzs7OztBQUdIOzs7OztJQUdNaUMscUI7Ozs7Ozs7O2tDQUNKaEQsSSxpQkFBS1EsYyxFQUFnQkssSyxFQUFPO0FBQUE7O0FBQzFCO0FBQ0EsNkJBQ0csS0FBS1gsR0FEUixJQUNjYyxPQUFPQyxJQUFQLENBQVlULGNBQVosRUFBNEJVLE1BQTVCO0FBQ1Y7QUFDQSxjQUFDQyxJQUFELEVBQU9qQixHQUFQO0FBQUE7O0FBQUEseUNBQ0tpQixJQURMLDZCQUVHWCxlQUFlTixHQUFmLEVBQW9CRCxLQUZ2QixJQUUrQlksTUFBTTNCLE1BQU4sQ0FBYXNCLGVBQWVOLEdBQWYsRUFBb0JELEtBQWpDLElBQ3pCLHNCQUFLWSxNQUFNM0IsTUFBTixDQUFhc0IsZUFBZU4sR0FBZixFQUFvQkQsS0FBakMsQ0FBTCxFQUE4QyxDQUFDLE1BQUQsRUFBUyxNQUFULENBQTlDLENBRHlCLEdBRXpCLElBSk4sWUFLR08sZUFBZU4sR0FBZixFQUFvQlEsS0FMdkIsSUFLK0JHLE1BQU0zQixNQUFOLENBQWFzQixlQUFlTixHQUFmLEVBQW9CUSxLQUFqQyxDQUwvQjtBQUFBLEtBRlUsRUFTVixFQVRVLENBRGQ7QUFhRCxHOztrQ0FDRE4sSSxpQkFBSzZDLEUsRUFBSXBDLEssRUFBT1csVyxFQUFhO0FBQzNCO0FBQ0EsdUNBQ0tBLFdBREw7QUFFRXRDLDBDQUNNc0MsWUFBWXRDLE1BQVosSUFBc0IsRUFENUIsRUFFSytELEVBRkw7QUFGRjtBQU9ELEc7Ozs7O0FBR0ksSUFBTUMsc0NBQWU7QUFDMUJuQixNQUFJLElBRHNCO0FBRTFCeEIsUUFBTSxJQUZvQjtBQUcxQnJCLFVBQVEscUJBQVc7QUFDakJZLGFBQVMsbUJBQVNxRCxFQUREO0FBRWpCakQsU0FBSyxRQUZZO0FBR2pCbUMsZ0JBQVk7QUFDVkwsY0FBUSxJQURFO0FBRVZDLGFBQU8sSUFGRztBQUdWQyxhQUFPLElBSEc7QUFJVm5CLGVBQVMsSUFBSThCLGNBQUosQ0FBbUI7QUFDMUIvQyxpQkFBUyxtQkFBU3FELEVBRFE7QUFFMUJqRCxhQUFLO0FBRnFCLE9BQW5CLENBSkM7QUFRVmlDLGlCQUFXLElBUkQ7QUFTVjlDLGlCQUFXO0FBVEQ7QUFISyxHQUFYLENBSGtCO0FBa0IxQm1CLGtCQUFnQixJQUFJd0MscUJBQUosQ0FBMEI7QUFDeENsRCxhQUFTLG1CQUFTcUQsRUFEc0I7QUFFeENqRCxTQUFLO0FBRm1DLEdBQTFCO0FBbEJVLENBQXJCOztJQXdCRGtELGE7Ozs7Ozs7Ozs7OztnS0FDSmxELEcsR0FBTSxROzs7MEJBRU5GLEksaUJBQUtxRCxNLEVBQVFDLFEsRUFBVTtBQUFBO0FBQUE7O0FBQ3JCLDZCQUNHLEtBQUtwRCxHQURSLElBQ2NvRCxTQUFTQyxVQUFULENBQW9CckMsTUFBcEIsQ0FBMkIsVUFBQ04sS0FBRCxFQUFRNEMsS0FBUixFQUFrQjtBQUN2RDtBQUNBLFVBQU0zQyxRQUFRd0MsT0FBT0csS0FBUCxDQUFkO0FBQ0EsVUFBSTNDLE1BQU00QyxhQUFOLEVBQUosRUFBMkI7QUFDekI3QyxjQUFNOEMsSUFBTixDQUFXLFFBQUt2RCwyQkFBTCxDQUFpQ1UsS0FBakMsRUFBd0N3QyxNQUFuRDtBQUNEO0FBQ0QsYUFBT3pDLEtBQVA7QUFDRCxLQVBXLEVBT1QsRUFQUyxDQURkO0FBVUQsRzs7MEJBRURSLEksaUJBQUtpRCxNLEVBQVFDLFEsRUFBVTtBQUFBO0FBQUE7O0FBQ3JCLDZCQUNHLEtBQUtwRCxHQURSLElBQ2NtRCxPQUFPTSxHQUFQLENBQ1Y7QUFBQSxhQUFTLFFBQUtDLDJCQUFMLENBQWlDL0MsS0FBakMsRUFBd0N3QyxNQUF4QyxFQUFnREEsTUFBekQ7QUFBQSxLQURVLENBRGQ7QUFLRCxHOzs7OztJQUdHUSxjOzs7Ozs7Ozs7Ozs7Z0tBQ0ozRCxHLEdBQU0sUzs7OzJCQUNORixJLGlCQUFLOEQsTyxFQUFTO0FBQUE7O0FBQ1osV0FBTztBQUNMQSxlQUFTQSxRQUNOQyxNQURNLGtDQUVOSixHQUZNLENBR0w7QUFBQSxlQUNFLFFBQUt4RCwyQkFBTCxDQUFpQzRELE1BQWpDLEVBQXlDLFFBQUsxQixVQUE5QyxFQUEwRHlCLE9BRDVEO0FBQUEsT0FISztBQURKLEtBQVA7QUFRRCxHOzsyQkFDRDFELEksaUJBQUswRCxPLEVBQVM7QUFDWixXQUFPLEVBQUNBLGdCQUFELEVBQVA7QUFDRCxHOzs7OztBQUdILElBQU1FLHFCQUFxQixDQUFDLFNBQUQsRUFBWSxPQUFaLENBQTNCOztJQUVNQyxtQjs7Ozs7Ozs7Ozs7O2tLQUNKL0QsRyxHQUFNLG1COzs7Z0NBRU5GLEksaUJBQUtrRSxpQixFQUFtQjtBQUFBOztBQUN0QiwrQkFDRyxLQUFLaEUsR0FEUixJQUNjLEtBQUttQyxVQUFMLENBQWdCbkIsTUFBaEIsQ0FDVixVQUFDQyxJQUFELEVBQU9qQixHQUFQO0FBQUE7O0FBQUEseUNBQ0tpQixJQURMLEVBRU0rQyxrQkFBa0JoRSxHQUFsQixFQUF1QmlFLE9BQXZCLHNCQUNFakUsR0FERixJQUNRZ0Usa0JBQWtCaEUsR0FBbEIsRUFBdUJoQixNQUQvQixXQUVBLEVBSk47QUFBQSxLQURVLEVBT1YsRUFQVSxDQURkO0FBV0QsRzs7Z0NBQ0RrQixJLGlCQUFLOEQsaUIsRUFBbUI7QUFBQTs7QUFDdEI7QUFDQTtBQUNBLCtCQUNHLEtBQUtoRSxHQURSLElBQ2MsS0FBS21DLFVBQUwsQ0FBZ0JuQixNQUFoQixDQUNWLFVBQUNDLElBQUQsRUFBT2pCLEdBQVA7QUFBQTs7QUFBQSx5Q0FDS2lCLElBREwsNkJBRU9qQixHQUZQLGdDQUdRZ0Usa0JBQWtCaEUsR0FBbEIsS0FBMEIsRUFIbEM7QUFJSWlFLGlCQUFTQyxRQUFRRixrQkFBa0JoRSxHQUFsQixDQUFSO0FBSmI7QUFBQSxLQURVLEVBUVYsRUFSVSxDQURkO0FBWUQsRzs7Ozs7SUFHR21FLG1COzs7Ozs7Ozs7Ozs7a0tBQ0puRSxHLEdBQU0sbUI7OztnQ0FFTkYsSSxpQkFBS2tFLGlCLEVBQW1CO0FBQUE7O0FBQ3RCO0FBQ0EsK0JBQ0csS0FBS2hFLEdBRFIsSUFDYyxLQUFLbUMsVUFBTCxDQUFnQm5CLE1BQWhCLENBQ1YsVUFBQ0MsSUFBRCxFQUFPakIsR0FBUDtBQUFBOztBQUFBLHlDQUNLaUIsSUFETCwrQkFFR2pCLEdBRkgsZ0NBR09nRSxrQkFBa0JoRSxHQUFsQixFQUF1QmhCLE1BSDlCO0FBSUlpRixpQkFBU0Qsa0JBQWtCaEUsR0FBbEIsRUFBdUJpRTtBQUpwQztBQUFBLEtBRFUsRUFRVixFQVJVLENBRGQ7QUFZRCxHOztnQ0FDRC9ELEksaUJBQUs4RCxpQixFQUFtQjtBQUFBOztBQUN0QiwrQkFBUyxLQUFLaEUsR0FBZCxJQUFvQmdFLGlCQUFwQjtBQUNELEc7Ozs7O0FBR0ksSUFBTUksd0NBQWdCO0FBQzNCdEMsVUFBUSxJQURtQjtBQUUzQkQsTUFBSSxJQUZ1QjtBQUczQndDLFFBQU0sSUFIcUI7QUFJM0JoRSxRQUFNLElBSnFCO0FBSzNCYSxTQUFPLElBTG9CO0FBTTNCb0QsWUFBVTtBQU5pQixDQUF0Qjs7SUFTTUMsb0IsV0FBQUEsb0I7Ozs7Ozs7O2lDQUNYekUsSSxpQkFBS0MsSyxFQUFPO0FBQUE7O0FBQ1YsK0JBQVMsS0FBS0MsR0FBZCxJQUFvQkQsUUFBUSxLQUFLRSwyQkFBTCxDQUFpQ0YsS0FBakMsRUFBd0MsS0FBS0MsR0FBN0MsQ0FBUixHQUE0RCxJQUFoRjtBQUNELEc7O2lDQUVERSxJLGlCQUFLSCxLLEVBQU87QUFBQTs7QUFDViwrQkFBUyxLQUFLQyxHQUFkLElBQW9CRCxLQUFwQjtBQUNELEc7Ozs7O0FBQ0Y7O0FBRU0sSUFBTXlFLG9FQUNSSixhQURRO0FBRVhLLFlBQVUsSUFGQztBQUdYQyxTQUFPLElBQUlILG9CQUFKLENBQXlCO0FBQzlCM0UsYUFBUyxtQkFBU3FELEVBRFk7QUFFOUJqRCxTQUFLLE9BRnlCO0FBRzlCbUMsZ0JBQVk7QUFDVmtDLFlBQU0sSUFESTtBQUVWaEUsWUFBTTtBQUZJO0FBSGtCLEdBQXpCO0FBSEksRUFBTjs7QUFhQSxJQUFNc0Usc0NBQWU7QUFDMUJmLFdBQVMsSUFBSUQsY0FBSixDQUFtQjtBQUMxQi9ELGFBQVMsbUJBQVNDLEVBRFE7QUFFMUJzQyxnQkFBWWlDO0FBRmMsR0FBbkIsQ0FEaUI7QUFLMUJqQixVQUFRLElBQUlELGFBQUosQ0FBa0I7QUFDeEJ0RCxhQUFTLG1CQUFTQyxFQURNO0FBRXhCc0MsZ0JBQVlQO0FBRlksR0FBbEIsQ0FMa0I7QUFTMUJvQyxxQkFBbUIsSUFBSUQsbUJBQUosQ0FBd0I7QUFDekNuRSxhQUFTLG1CQUFTQyxFQUR1QjtBQUV6Q3NDLGdCQUFZMkI7QUFGNkIsR0FBeEIsQ0FUTztBQWExQmMsaUJBQWU7QUFiVyxDQUFyQjs7QUFnQkEsSUFBTUMsc0NBQWU7QUFDMUJqQixXQUFTLElBQUlELGNBQUosQ0FBbUI7QUFDMUIvRCxhQUFTLG1CQUFTcUQsRUFEUTtBQUUxQmQsZ0JBQVlxQztBQUZjLEdBQW5CLENBRGlCO0FBSzFCckIsVUFBUSxJQUFJRCxhQUFKLENBQWtCO0FBQ3hCdEQsYUFBUyxtQkFBU3FELEVBRE07QUFFeEJkLGdCQUFZYTtBQUZZLEdBQWxCLENBTGtCO0FBUzFCZ0IscUJBQW1CLElBQUlHLG1CQUFKLENBQXdCO0FBQ3pDdkUsYUFBUyxtQkFBU3FELEVBRHVCO0FBRXpDZCxnQkFBWTJCO0FBRjZCLEdBQXhCLENBVE87QUFhMUJjLGlCQUFlLElBYlc7QUFjMUJFLGFBQVc7QUFkZSxDQUFyQjs7QUFpQkEsSUFBTUMsOENBQW1CLHFCQUFXO0FBQ3pDbkYsV0FBUyxtQkFBU0MsRUFEdUI7QUFFekNzQyxjQUFZd0MsWUFGNkI7QUFHekMzRSxPQUFLO0FBSG9DLENBQVgsQ0FBekI7O0FBTUEsSUFBTWdGLDhDQUFtQixxQkFBVztBQUN6Q3BGLFdBQVMsbUJBQVNxRCxFQUR1QjtBQUV6Q2QsY0FBWTBDLFlBRjZCO0FBR3pDN0UsT0FBSztBQUhvQyxDQUFYLENBQXpCOztBQU1BLElBQU1pRixpRkFDVixtQkFBU3BGLEVBREMsSUFDSTtBQUNiQyxRQUFNO0FBQUEsV0FBVWlGLGlCQUFpQmpGLElBQWpCLENBQXNCb0YsTUFBdEIsQ0FBVjtBQUFBLEdBRE87QUFFYmhGLFFBQU07QUFBQSxXQUFVOEUsaUJBQWlCOUUsSUFBakIsQ0FBc0I2RSxpQkFBaUI3RSxJQUFqQixDQUFzQmlGLE1BQXRCLEVBQThCL0IsUUFBcEQsQ0FBVjtBQUFBO0FBRk8sQ0FESixrQkFLVixtQkFBU0gsRUFMQyxJQUtJK0IsZ0JBTEosa0JBQU47O0FBUVA7a0JBQ2VDLGMiLCJmaWxlIjoidmlzLXN0YXRlLXNjaGVtYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwaWNrIGZyb20gJ2xvZGFzaC5waWNrJztcbmltcG9ydCB7VkVSU0lPTlN9IGZyb20gJy4vdmVyc2lvbnMnO1xuaW1wb3J0IHtpc1ZhbGlkRmlsdGVyVmFsdWV9IGZyb20gJy4uL3V0aWxzL2ZpbHRlci11dGlscyc7XG5cbmltcG9ydCBTY2hlbWEgZnJvbSAnLi9zY2hlbWEnO1xuXG4vKipcbiAqIFYwIFNjaGVtYVxuICovXG5cbmV4cG9ydCBjb25zdCBkaW1lbnNpb25Qcm9wc1YwID0gWyduYW1lJywgJ3R5cGUnXTtcblxuLy8gaW4gdjAgZ2VvanNvbiB0aGVyZSBpcyBvbmx5IHNpemVGaWVsZFxuXG4vLyBpbiB2MSBnZW9qc29uXG4vLyBzdHJva2UgYmFzZSBvbiAtPiBzaXplRmllbGRcbi8vIGhlaWdodCBiYXNlZCBvbiAtPiBoZWlnaHRGaWVsZFxuLy8gcmFkaXVzIGJhc2VkIG9uIC0+IHJhZGl1c0ZpZWxkXG4vLyBoZXJlIHdlIG1ha2Ugb3VyIHdpcmVkc3QgZ3Vlc3Mgb24gd2hpY2ggY2hhbm5lbCBzaXplRmllbGQgYmVsb25ncyB0b1xuZnVuY3Rpb24gZ2VvanNvblNpemVGaWVsZFYwVG9WMShjb25maWcpIHtcbiAgY29uc3QgZGVmYXVsdFJhaXVkcyA9IDEwO1xuICBjb25zdCBkZWZhdWx0UmFkaXVzUmFuZ2UgPSBbMCwgNTBdO1xuXG4gIC8vIGlmIGV4dHJ1ZGVkLCBzaXplRmllbGQgaXMgbW9zdCBsaWtlbHkgdXNlZCBmb3IgaGVpZ2h0XG4gIGlmIChjb25maWcudmlzQ29uZmlnLmV4dHJ1ZGVkKSB7XG4gICAgcmV0dXJuICdoZWlnaHRGaWVsZCc7XG4gIH1cblxuICAvLyBpZiBzaG93IHN0cm9rZSBlbmFibGVkLCBzaXplRmllbGQgaXMgbW9zdCBsaWtlbHkgdXNlZCBmb3Igc3Ryb2tlXG4gIGlmIChjb25maWcudmlzQ29uZmlnLnN0cm9rZWQpIHtcbiAgICByZXR1cm4gJ3NpemVGaWVsZCc7XG4gIH1cblxuICAvLyBpZiByYWRpdXMgY2hhbmdlZCwgb3IgcmFkaXVzIFJhbmdlIENoYW5nZWQsIHNpemVGaWVsZCBpcyBtb3N0IGxpa2VseSB1c2VkIGZvciByYWRpdXNcbiAgLy8gdGhpcyBpcyB0aGUgbW9zdCB1bnJlbGlhYmxlIGd1ZXNzLCB0aGF0J3Mgd2h5IHdlIHB1dCBpdCBpbiB0aGUgZW5kXG4gIGlmIChjb25maWcudmlzQ29uZmlnLnJhZGl1cyAhPT0gZGVmYXVsdFJhaXVkcyB8fFxuICAgIGNvbmZpZy52aXNDb25maWcucmFkaXVzUmFuZ2Uuc29tZSgoZCwgaSkgPT4gZCAhPT0gZGVmYXVsdFJhZGl1c1JhbmdlW2ldKSkge1xuICAgIHJldHVybiAncmFkaXVzRmllbGQnO1xuICB9XG5cbiAgcmV0dXJuICdzaXplRmllbGQnO1xufVxuXG4vLyBjb252ZXJ0IHYwIHRvIHYxIGxheWVyIGNvbmZpZ1xuY2xhc3MgRGltZW5zaW9uRmllbGRTY2hlbWFWMCBleHRlbmRzIFNjaGVtYSB7XG4gIHZlcnNpb24gPSBWRVJTSU9OUy52MDtcbiAgc2F2ZShmaWVsZCwgY29uZmlnKSB7XG4gICAgLy8gc2hvdWxkIG5vdCBiZSBjYWxsZWQgYW55bW9yZVxuICAgIHJldHVybiB7XG4gICAgICBbdGhpcy5rZXldOlxuICAgICAgICBmaWVsZCAhPT0gbnVsbFxuICAgICAgICAgID8gdGhpcy5zYXZlUHJvcGVydGllc09yQXBwbHlTY2hlbWEoZmllbGQpW3RoaXMua2V5XVxuICAgICAgICAgIDogbnVsbFxuICAgIH07XG4gIH1cblxuICBsb2FkKGZpZWxkLCBjb25maWcsIGFjY3VtdWxhdGVkKSB7XG4gICAgbGV0IGZpZWxkTmFtZSA9IHRoaXMua2V5O1xuICAgIGlmIChjb25maWcudHlwZSA9PT0gJ2dlb2pzb24nICYmIHRoaXMua2V5ID09PSAnc2l6ZUZpZWxkJyAmJiBmaWVsZCkge1xuICAgICAgZmllbGROYW1lID0gZ2VvanNvblNpemVGaWVsZFYwVG9WMShjb25maWcpO1xuICAgIH1cbiAgICAvLyBmb2xkIGludG8gdmlzdWFsQ2hhbm5lbHMgdG8gYmUgbG9hZCBieSBWaXN1YWxDaGFubmVsU2NoZW1hVjFcbiAgICByZXR1cm4ge1xuICAgICAgdmlzdWFsQ2hhbm5lbHM6IHtcbiAgICAgICAgLi4uKGFjY3VtdWxhdGVkLnZpc3VhbENoYW5uZWxzIHx8IHt9KSxcbiAgICAgICAgW2ZpZWxkTmFtZV06IGZpZWxkXG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuXG5jbGFzcyBEaW1lbnNpb25TY2FsZVNjaGVtYVYwIGV4dGVuZHMgU2NoZW1hIHtcbiAgdmVyc2lvbiA9IFZFUlNJT05TLnYwO1xuICBzYXZlKHNjYWxlKSB7XG4gICAgcmV0dXJuIHtbdGhpcy5rZXldOiBzY2FsZX07XG4gIH1cbiAgbG9hZChzY2FsZSwgY29uZmlnLCBhY2N1bXVsYXRlZCkge1xuICAgIC8vIGZvbGQgaW50byB2aXN1YWxDaGFubmVscyB0byBiZSBsb2FkIGJ5IFZpc3VhbENoYW5uZWxTY2hlbWFWMVxuICAgIGlmICh0aGlzLmtleSA9PT0gJ3NpemVTY2FsZScgJiYgY29uZmlnLnR5cGUgPT09ICdnZW9qc29uJykge1xuICAgICAgLy8gc2l6ZVNjYWxlIG5vdyBzcGxpdCBpbnRvIHJhZGl1c1NjYWxlLCBoZWlnaHRTY2FsZVxuICAgICAgLy8gbm8gdXNlciBjdXN0b21pemF0aW9uLCBqdXN0IHVzZSBkZWZhdWx0XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHZpc3VhbENoYW5uZWxzOiB7XG4gICAgICAgIC4uLihhY2N1bXVsYXRlZC52aXN1YWxDaGFubmVscyB8fCB7fSksXG4gICAgICAgIFt0aGlzLmtleV06IHNjYWxlXG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuXG4vLyB1c2VkIHRvIGNvbnZlcnQgdjAgdG8gdjEgbGF5ZXIgY29uZmlnXG5jbGFzcyBMYXllckNvbmZpZ1NjaGVtYVYwIGV4dGVuZHMgU2NoZW1hIHtcbiAgdmVyc2lvbiA9IFZFUlNJT05TLnYwO1xuICBsb2FkKHNhdmVkLCBsYXllciwgYWNjdW11bGF0ZWQpIHtcbiAgICAvLyBmb2xkIHYwIGxheWVyIHByb3BlcnR5IGludG8gY29uZmlnLmtleVxuICAgIHJldHVybiB7XG4gICAgICBjb25maWc6IHtcbiAgICAgICAgLi4uKGFjY3VtdWxhdGVkLmNvbmZpZyB8fCB7fSksXG4gICAgICAgIFt0aGlzLmtleV06IHNhdmVkXG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuXG4vLyB1c2VkIHRvIGNvbnZlcnQgdjAgdG8gdjEgbGF5ZXIgY29sdW1uc1xuLy8gb25seSByZXR1cm4gY29sdW1uIHZhbHVlIGZvciBlYWNoIGNvbHVtblxuY2xhc3MgTGF5ZXJDb2x1bW5zU2NoZW1hVjAgZXh0ZW5kcyBTY2hlbWEge1xuICB2ZXJzaW9uID0gVkVSU0lPTlMudjA7XG4gIGxvYWQoc2F2ZWQsIGxheWVyLCBhY2N1bXVsYXRlZCkge1xuICAgIC8vIGZvbGQgdjAgbGF5ZXIgcHJvcGVydHkgaW50byBjb25maWcua2V5LCBmbGF0dGVuIGNvbHVtbnNcbiAgICByZXR1cm4ge1xuICAgICAgY29uZmlnOiB7XG4gICAgICAgIC4uLihhY2N1bXVsYXRlZC5jb25maWcgfHwge30pLFxuICAgICAgICBjb2x1bW5zOiBPYmplY3Qua2V5cyhzYXZlZCkucmVkdWNlKFxuICAgICAgICAgIChhY2N1LCBrZXkpID0+ICh7XG4gICAgICAgICAgICAuLi5hY2N1LFxuICAgICAgICAgICAgW2tleV06IHNhdmVkW2tleV0udmFsdWVcbiAgICAgICAgICB9KSxcbiAgICAgICAgICB7fVxuICAgICAgICApXG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuXG4vLyB1c2VkIHRvIGNvbnZlcnQgdjAgdG8gdjEgbGF5ZXIgY29uZmlnLnZpc0NvbmZpZ1xuY2xhc3MgTGF5ZXJDb25maWdUb1Zpc0NvbmZpZ1NjaGVtYVYwIGV4dGVuZHMgU2NoZW1hIHtcbiAgdmVyc2lvbiA9IFZFUlNJT05TLnYwO1xuICBsb2FkKHNhdmVkLCBsYXllciwgYWNjdW11bGF0ZWQpIHtcbiAgICAvLyBmb2xkIHYwIGxheWVyIHByb3BlcnR5IGludG8gY29uZmlnLnZpc0NvbmZpZ1xuICAgIGNvbnN0IGFjY3VtdWxhdGVkQ29uZmlnID0gYWNjdW11bGF0ZWQuY29uZmlnIHx8IHt9O1xuICAgIHJldHVybiB7XG4gICAgICBjb25maWc6IHtcbiAgICAgICAgLi4uYWNjdW11bGF0ZWRDb25maWcsXG4gICAgICAgIHZpc0NvbmZpZzoge1xuICAgICAgICAgIC4uLihhY2N1bXVsYXRlZENvbmZpZy52aXNDb25maWcgfHwge30pLFxuICAgICAgICAgIFt0aGlzLmtleV06IHNhdmVkXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG5cbmNsYXNzIExheWVyVmlzQ29uZmlnU2NoZW1hVjAgZXh0ZW5kcyBTY2hlbWEge1xuICB2ZXJzaW9uID0gVkVSU0lPTlMudjA7XG4gIGtleSA9ICd2aXNDb25maWcnO1xuXG4gIGxvYWQodmlzQ29uZmlnLCBjb25maWcsIGFjY3VtdWxhdG9yKSB7XG4gICAgY29uc3QgcmVuYW1lID0ge1xuICAgICAgZ2VvanNvbjoge1xuICAgICAgICBleHRydWRlZDogJ2VuYWJsZTNkJyxcbiAgICAgICAgZWxldmF0aW9uUmFuZ2U6ICdoZWlnaHRSYW5nZSdcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKGNvbmZpZy50eXBlIGluIHJlbmFtZSkge1xuICAgICAgY29uc3QgcHJvcFRvUmVuYW1lID0gcmVuYW1lW2NvbmZpZy50eXBlXTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgIC4uLihhY2N1bXVsYXRvci5jb25maWcgfHwge30pLFxuICAgICAgICAgIHZpc0NvbmZpZzogT2JqZWN0LmtleXModmlzQ29uZmlnKS5yZWR1Y2UoKGFjY3UsIGtleSkgPT4gKHtcbiAgICAgICAgICAgIC4uLmFjY3UsXG4gICAgICAgICAgICAuLi4ocHJvcFRvUmVuYW1lW2tleV0gPyB7W3Byb3BUb1JlbmFtZVtrZXldXTogdmlzQ29uZmlnW2tleV19IDoge1trZXldOiB2aXNDb25maWdba2V5XX0pXG4gICAgICAgICAgfSksIHt9KVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBjb25maWc6IHtcbiAgICAgICAgLi4uKGFjY3VtdWxhdG9yLmNvbmZpZyB8fCB7fSksXG4gICAgICAgIHZpc0NvbmZpZ1xuICAgICAgfVxuICAgIH07XG4gIH1cbn1cblxuY2xhc3MgTGF5ZXJDb25maWdTY2hlbWFEZWxldGVWMCBleHRlbmRzIFNjaGVtYSB7XG4gIHZlcnNpb24gPSBWRVJTSU9OUy52MDtcbiAgbG9hZCh2YWx1ZSkge1xuICAgIHJldHVybiB7fTtcbiAgfVxufVxuXG4vKipcbiAqIFYwIC0+IFYxIENoYW5nZXNcbiAqIC0gbGF5ZXIgaXMgbm93IGEgY2xhc3NcbiAqIC0gY29uZmlnIHNhdmVkIGluIGEgY29uZmlnIG9iamVjdFxuICogLSBpZCwgdHlwZSwgaXNBZ2dyZWdhdGVkIGlzIG91dHNpZGUgbGF5ZXIuY29uZmlnXG4gKiAtIHZpc3VhbENoYW5uZWxzIGlzIG91dHNpZGUgY29uZmlnLCBpdCBkZWZpbmVzIGF2YWlsYWJsZSB2aXN1YWwgY2hhbm5lbCBhbmRcbiAqICAgcHJvcGVydHkgbmFtZXMgZm9yIGZpZWxkLCBzY2FsZSwgZG9tYWluIGFuZCByYW5nZSBvZiBlYWNoIHZpc3VhbCBjaGFuZWwuXG4gKiAtIGVuYWJsZTNkLCBjb2xvckFnZ3JlZ2F0aW9uIGFuZCBzaXplQWdncmVnYXRpb24gYXJlIG1vdmVkIGludG8gdmlzQ29uZmlnXG4gKiAtIEdlb2pzb25MYXllciAtIGFkZGVkIGhlaWdodCwgcmFkaXVzIHNwZWNpZmljIHByb3BlcnRpZXNcbiAqL1xuXG5leHBvcnQgY29uc3QgbGF5ZXJQcm9wc1YwID0ge1xuICBpZDogbnVsbCxcbiAgdHlwZTogbnVsbCxcblxuICAvLyBtb3ZlIGludG8gbGF5ZXIuY29uZmlnXG4gIGRhdGFJZDogbmV3IExheWVyQ29uZmlnU2NoZW1hVjAoe2tleTogJ2RhdGFJZCd9KSxcbiAgbGFiZWw6IG5ldyBMYXllckNvbmZpZ1NjaGVtYVYwKHtrZXk6ICdsYWJlbCd9KSxcbiAgY29sb3I6IG5ldyBMYXllckNvbmZpZ1NjaGVtYVYwKHtrZXk6ICdjb2xvcid9KSxcbiAgaXNWaXNpYmxlOiBuZXcgTGF5ZXJDb25maWdTY2hlbWFWMCh7a2V5OiAnaXNWaXNpYmxlJ30pLFxuXG4gIC8vIGNvbnZlcnQgdmlzQ29uZmlnXG4gIHZpc0NvbmZpZzogbmV3IExheWVyVmlzQ29uZmlnU2NoZW1hVjAoe2tleTogJ3Zpc0NvbmZpZyd9KSxcblxuICAvLyBtb3ZlIGludG8gbGF5ZXIuY29uZmlnXG4gIC8vIGZsYXR0ZW5cbiAgY29sdW1uczogbmV3IExheWVyQ29sdW1uc1NjaGVtYVYwKCksXG5cbiAgLy8gc2F2ZSBpbnRvIHZpc3VhbENoYW5uZWxzXG4gIGNvbG9yRmllbGQ6IG5ldyBEaW1lbnNpb25GaWVsZFNjaGVtYVYwKHtcbiAgICBwcm9wZXJ0aWVzOiBkaW1lbnNpb25Qcm9wc1YwLFxuICAgIGtleTogJ2NvbG9yRmllbGQnXG4gIH0pLFxuICBjb2xvclNjYWxlOiBuZXcgRGltZW5zaW9uU2NhbGVTY2hlbWFWMCh7XG4gICAga2V5OiAnY29sb3JTY2FsZSdcbiAgfSksXG4gIHNpemVGaWVsZDogbmV3IERpbWVuc2lvbkZpZWxkU2NoZW1hVjAoe1xuICAgIHByb3BlcnRpZXM6IGRpbWVuc2lvblByb3BzVjAsXG4gICAga2V5OiAnc2l6ZUZpZWxkJ1xuICB9KSxcbiAgc2l6ZVNjYWxlOiBuZXcgRGltZW5zaW9uU2NhbGVTY2hlbWFWMCh7XG4gICAga2V5OiAnc2l6ZVNjYWxlJ1xuICB9KSxcblxuICAvLyBtb3ZlIGludG8gY29uZmlnLnZpc0NvbmZpZ1xuICBlbmFibGUzZDogbmV3IExheWVyQ29uZmlnVG9WaXNDb25maWdTY2hlbWFWMCh7a2V5OiAnZW5hYmxlM2QnfSksXG4gIGNvbG9yQWdncmVnYXRpb246IG5ldyBMYXllckNvbmZpZ1RvVmlzQ29uZmlnU2NoZW1hVjAoe2tleTogJ2NvbG9yQWdncmVnYXRpb24nfSksXG4gIHNpemVBZ2dyZWdhdGlvbjogbmV3IExheWVyQ29uZmlnVG9WaXNDb25maWdTY2hlbWFWMCh7a2V5OiAnc2l6ZUFnZ3JlZ2F0aW9uJ30pLFxuXG4gIC8vIGRlbGV0ZVxuICBpc0FnZ3JlZ2F0ZWQ6IG5ldyBMYXllckNvbmZpZ1NjaGVtYURlbGV0ZVYwKClcbn07XG5cbi8qKlxuICogVjEgU2NoZW1hXG4gKi9cbmNsYXNzIENvbHVtblNjaGVtYVYxIGV4dGVuZHMgU2NoZW1hIHtcbiAgc2F2ZShjb2x1bW5zLCBzdGF0ZSkge1xuICAgIC8vIHN0YXJ0aW5nIGZyb20gdjEsIG9ubHkgc2F2ZSBjb2x1bW4gdmFsdWVcbiAgICAvLyBmaWVsZElkeCB3aWxsIGJlIGNhbGN1bGF0ZWQgZHVyaW5nIG1lcmdlXG4gICAgcmV0dXJuIHtcbiAgICAgIFt0aGlzLmtleV06IE9iamVjdC5rZXlzKGNvbHVtbnMpLnJlZHVjZShcbiAgICAgICAgKGFjY3UsIGNrZXkpID0+ICh7XG4gICAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgICBbY2tleV06IGNvbHVtbnNbY2tleV0udmFsdWVcbiAgICAgICAgfSksXG4gICAgICAgIHt9XG4gICAgICApXG4gICAgfTtcbiAgfVxuXG4gIGxvYWQoY29sdW1ucykge1xuICAgIHJldHVybiB7Y29sdW1uc307XG4gIH1cbn1cblxuLyoqXG4gKiBWMTogc2F2ZSBbZmllbGRdOiB7bmFtZSwgdHlwZX0sIFtzY2FsZV06ICcnIGZvciBlYWNoIGNoYW5uZWxcbiAqL1xuY2xhc3MgVmlzdWFsQ2hhbm5lbFNjaGVtYVYxIGV4dGVuZHMgU2NoZW1hIHtcbiAgc2F2ZSh2aXN1YWxDaGFubmVscywgbGF5ZXIpIHtcbiAgICAvLyBvbmx5IHNhdmUgZmllbGQgYW5kIHNjYWxlIG9mIGVhY2ggY2hhbm5lbFxuICAgIHJldHVybiB7XG4gICAgICBbdGhpcy5rZXldOiBPYmplY3Qua2V5cyh2aXN1YWxDaGFubmVscykucmVkdWNlKFxuICAgICAgICAvLyAgc2F2ZSBjaGFubmVsIHRvIG51bGwgaWYgZGlkbid0IHNlbGVjdCBhbnkgZmllbGRcbiAgICAgICAgKGFjY3UsIGtleSkgPT4gKHtcbiAgICAgICAgICAuLi5hY2N1LFxuICAgICAgICAgIFt2aXN1YWxDaGFubmVsc1trZXldLmZpZWxkXTogbGF5ZXIuY29uZmlnW3Zpc3VhbENoYW5uZWxzW2tleV0uZmllbGRdXG4gICAgICAgICAgICA/IHBpY2sobGF5ZXIuY29uZmlnW3Zpc3VhbENoYW5uZWxzW2tleV0uZmllbGRdLCBbJ25hbWUnLCAndHlwZSddKVxuICAgICAgICAgICAgOiBudWxsLFxuICAgICAgICAgIFt2aXN1YWxDaGFubmVsc1trZXldLnNjYWxlXTogbGF5ZXIuY29uZmlnW3Zpc3VhbENoYW5uZWxzW2tleV0uc2NhbGVdXG4gICAgICAgIH0pLFxuICAgICAgICB7fVxuICAgICAgKVxuICAgIH07XG4gIH1cbiAgbG9hZCh2YywgbGF5ZXIsIGFjY3VtdWxhdG9yKSB7XG4gICAgLy8gZm9sZCBjaGFubmVscyBpbnRvIGNvbmZpZ1xuICAgIHJldHVybiB7XG4gICAgICAuLi5hY2N1bXVsYXRvcixcbiAgICAgIGNvbmZpZzoge1xuICAgICAgICAuLi4oYWNjdW11bGF0b3IuY29uZmlnIHx8IHt9KSxcbiAgICAgICAgLi4udmNcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBsYXllclByb3BzVjEgPSB7XG4gIGlkOiBudWxsLFxuICB0eXBlOiBudWxsLFxuICBjb25maWc6IG5ldyBTY2hlbWEoe1xuICAgIHZlcnNpb246IFZFUlNJT05TLnYxLFxuICAgIGtleTogJ2NvbmZpZycsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgZGF0YUlkOiBudWxsLFxuICAgICAgbGFiZWw6IG51bGwsXG4gICAgICBjb2xvcjogbnVsbCxcbiAgICAgIGNvbHVtbnM6IG5ldyBDb2x1bW5TY2hlbWFWMSh7XG4gICAgICAgIHZlcnNpb246IFZFUlNJT05TLnYxLFxuICAgICAgICBrZXk6ICdjb2x1bW5zJ1xuICAgICAgfSksXG4gICAgICBpc1Zpc2libGU6IG51bGwsXG4gICAgICB2aXNDb25maWc6IG51bGxcbiAgICB9XG4gIH0pLFxuICB2aXN1YWxDaGFubmVsczogbmV3IFZpc3VhbENoYW5uZWxTY2hlbWFWMSh7XG4gICAgdmVyc2lvbjogVkVSU0lPTlMudjEsXG4gICAga2V5OiAndmlzdWFsQ2hhbm5lbHMnXG4gIH0pXG59O1xuXG5jbGFzcyBMYXllclNjaGVtYVYwIGV4dGVuZHMgU2NoZW1hIHtcbiAga2V5ID0gJ2xheWVycyc7XG5cbiAgc2F2ZShsYXllcnMsIHZpc1N0YXRlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFt0aGlzLmtleV06IHZpc1N0YXRlLmxheWVyT3JkZXIucmVkdWNlKChzYXZlZCwgaW5kZXgpID0+IHtcbiAgICAgICAgLy8gc2F2ZSBsYXllcnMgYWNjb3JkaW5nIHRvIHRoZWlyIHJlbmRlcmluZyBvcmRlclxuICAgICAgICBjb25zdCBsYXllciA9IGxheWVyc1tpbmRleF07XG4gICAgICAgIGlmIChsYXllci5pc1ZhbGlkVG9TYXZlKCkpIHtcbiAgICAgICAgICBzYXZlZC5wdXNoKHRoaXMuc2F2ZVByb3BlcnRpZXNPckFwcGx5U2NoZW1hKGxheWVyKS5sYXllcnMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzYXZlZDtcbiAgICAgIH0sIFtdKVxuICAgIH07XG4gIH1cblxuICBsb2FkKGxheWVycywgdmlzU3RhdGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgW3RoaXMua2V5XTogbGF5ZXJzLm1hcChcbiAgICAgICAgbGF5ZXIgPT4gdGhpcy5sb2FkUHJvcGVydGllc09yQXBwbHlTY2hlbWEobGF5ZXIsIGxheWVycykubGF5ZXJzXG4gICAgICApXG4gICAgfTtcbiAgfVxufVxuXG5jbGFzcyBGaWx0ZXJTY2hlbWFWMCBleHRlbmRzIFNjaGVtYSB7XG4gIGtleSA9ICdmaWx0ZXJzJztcbiAgc2F2ZShmaWx0ZXJzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbHRlcnM6IGZpbHRlcnNcbiAgICAgICAgLmZpbHRlcihpc1ZhbGlkRmlsdGVyVmFsdWUpXG4gICAgICAgIC5tYXAoXG4gICAgICAgICAgZmlsdGVyID0+XG4gICAgICAgICAgICB0aGlzLnNhdmVQcm9wZXJ0aWVzT3JBcHBseVNjaGVtYShmaWx0ZXIsIHRoaXMucHJvcGVydGllcykuZmlsdGVyc1xuICAgICAgICApXG4gICAgfTtcbiAgfVxuICBsb2FkKGZpbHRlcnMpIHtcbiAgICByZXR1cm4ge2ZpbHRlcnN9O1xuICB9XG59XG5cbmNvbnN0IGludGVyYWN0aW9uUHJvcHNWMCA9IFsndG9vbHRpcCcsICdicnVzaCddO1xuXG5jbGFzcyBJbnRlcmFjdGlvblNjaGVtYVYwIGV4dGVuZHMgU2NoZW1hIHtcbiAga2V5ID0gJ2ludGVyYWN0aW9uQ29uZmlnJztcblxuICBzYXZlKGludGVyYWN0aW9uQ29uZmlnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFt0aGlzLmtleV06IHRoaXMucHJvcGVydGllcy5yZWR1Y2UoXG4gICAgICAgIChhY2N1LCBrZXkpID0+ICh7XG4gICAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgICAuLi4oaW50ZXJhY3Rpb25Db25maWdba2V5XS5lbmFibGVkXG4gICAgICAgICAgICA/IHtba2V5XTogaW50ZXJhY3Rpb25Db25maWdba2V5XS5jb25maWd9XG4gICAgICAgICAgICA6IHt9KVxuICAgICAgICB9KSxcbiAgICAgICAge31cbiAgICAgIClcbiAgICB9O1xuICB9XG4gIGxvYWQoaW50ZXJhY3Rpb25Db25maWcpIHtcbiAgICAvLyBjb252ZXJ0IHYwIC0+IHYxXG4gICAgLy8gcmV0dXJuIGVuYWJsZWQ6IGZhbHNlIGlmIGRpc2FibGVkLFxuICAgIHJldHVybiB7XG4gICAgICBbdGhpcy5rZXldOiB0aGlzLnByb3BlcnRpZXMucmVkdWNlKFxuICAgICAgICAoYWNjdSwga2V5KSA9PiAoe1xuICAgICAgICAgIC4uLmFjY3UsXG4gICAgICAgICAgLi4ue1trZXldOiB7XG4gICAgICAgICAgICAuLi4oaW50ZXJhY3Rpb25Db25maWdba2V5XSB8fCB7fSksXG4gICAgICAgICAgICBlbmFibGVkOiBCb29sZWFuKGludGVyYWN0aW9uQ29uZmlnW2tleV0pXG4gICAgICAgICAgfX1cbiAgICAgICAgfSksXG4gICAgICAgIHt9XG4gICAgICApXG4gICAgfTtcbiAgfVxufVxuXG5jbGFzcyBJbnRlcmFjdGlvblNjaGVtYVYxIGV4dGVuZHMgU2NoZW1hIHtcbiAga2V5ID0gJ2ludGVyYWN0aW9uQ29uZmlnJztcblxuICBzYXZlKGludGVyYWN0aW9uQ29uZmlnKSB7XG4gICAgLy8gc2F2ZSBjb25maWcgZXZlbiBpZiBkaXNhYmxlZCxcbiAgICByZXR1cm4ge1xuICAgICAgW3RoaXMua2V5XTogdGhpcy5wcm9wZXJ0aWVzLnJlZHVjZShcbiAgICAgICAgKGFjY3UsIGtleSkgPT4gKHtcbiAgICAgICAgICAuLi5hY2N1LFxuICAgICAgICAgIFtrZXldOiB7XG4gICAgICAgICAgICAuLi5pbnRlcmFjdGlvbkNvbmZpZ1trZXldLmNvbmZpZyxcbiAgICAgICAgICAgIGVuYWJsZWQ6IGludGVyYWN0aW9uQ29uZmlnW2tleV0uZW5hYmxlZFxuICAgICAgICAgIH1cbiAgICAgICAgfSksXG4gICAgICAgIHt9XG4gICAgICApXG4gICAgfTtcbiAgfVxuICBsb2FkKGludGVyYWN0aW9uQ29uZmlnKSB7XG4gICAgcmV0dXJuIHtbdGhpcy5rZXldOiBpbnRlcmFjdGlvbkNvbmZpZ307XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGZpbHRlclByb3BzVjAgPSB7XG4gIGRhdGFJZDogbnVsbCxcbiAgaWQ6IG51bGwsXG4gIG5hbWU6IG51bGwsXG4gIHR5cGU6IG51bGwsXG4gIHZhbHVlOiBudWxsLFxuICBlbmxhcmdlZDogbnVsbFxufTtcblxuZXhwb3J0IGNsYXNzIERpbWVuc2lvbkZpZWxkU2NoZW1hIGV4dGVuZHMgU2NoZW1hIHtcbiAgc2F2ZShmaWVsZCkge1xuICAgIHJldHVybiB7W3RoaXMua2V5XTogZmllbGQgPyB0aGlzLnNhdmVQcm9wZXJ0aWVzT3JBcHBseVNjaGVtYShmaWVsZClbdGhpcy5rZXldIDogbnVsbH1cbiAgfVxuXG4gIGxvYWQoZmllbGQpIHtcbiAgICByZXR1cm4ge1t0aGlzLmtleV06IGZpZWxkfVxuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZmlsdGVyUHJvcHNWMSA9IHtcbiAgLi4uZmlsdGVyUHJvcHNWMCxcbiAgcGxvdFR5cGU6IG51bGwsXG4gIHlBeGlzOiBuZXcgRGltZW5zaW9uRmllbGRTY2hlbWEoe1xuICAgIHZlcnNpb246IFZFUlNJT05TLnYxLFxuICAgIGtleTogJ3lBeGlzJyxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBuYW1lOiBudWxsLFxuICAgICAgdHlwZTogbnVsbFxuICAgIH1cbiAgfSlcbn07XG5cbmV4cG9ydCBjb25zdCBwcm9wZXJ0aWVzVjAgPSB7XG4gIGZpbHRlcnM6IG5ldyBGaWx0ZXJTY2hlbWFWMCh7XG4gICAgdmVyc2lvbjogVkVSU0lPTlMudjAsXG4gICAgcHJvcGVydGllczogZmlsdGVyUHJvcHNWMFxuICB9KSxcbiAgbGF5ZXJzOiBuZXcgTGF5ZXJTY2hlbWFWMCh7XG4gICAgdmVyc2lvbjogVkVSU0lPTlMudjAsXG4gICAgcHJvcGVydGllczogbGF5ZXJQcm9wc1YwXG4gIH0pLFxuICBpbnRlcmFjdGlvbkNvbmZpZzogbmV3IEludGVyYWN0aW9uU2NoZW1hVjAoe1xuICAgIHZlcnNpb246IFZFUlNJT05TLnYwLFxuICAgIHByb3BlcnRpZXM6IGludGVyYWN0aW9uUHJvcHNWMFxuICB9KSxcbiAgbGF5ZXJCbGVuZGluZzogbnVsbFxufTtcblxuZXhwb3J0IGNvbnN0IHByb3BlcnRpZXNWMSA9IHtcbiAgZmlsdGVyczogbmV3IEZpbHRlclNjaGVtYVYwKHtcbiAgICB2ZXJzaW9uOiBWRVJTSU9OUy52MSxcbiAgICBwcm9wZXJ0aWVzOiBmaWx0ZXJQcm9wc1YxXG4gIH0pLFxuICBsYXllcnM6IG5ldyBMYXllclNjaGVtYVYwKHtcbiAgICB2ZXJzaW9uOiBWRVJTSU9OUy52MSxcbiAgICBwcm9wZXJ0aWVzOiBsYXllclByb3BzVjFcbiAgfSksXG4gIGludGVyYWN0aW9uQ29uZmlnOiBuZXcgSW50ZXJhY3Rpb25TY2hlbWFWMSh7XG4gICAgdmVyc2lvbjogVkVSU0lPTlMudjEsXG4gICAgcHJvcGVydGllczogaW50ZXJhY3Rpb25Qcm9wc1YwXG4gIH0pLFxuICBsYXllckJsZW5kaW5nOiBudWxsLFxuICBzcGxpdE1hcHM6IG51bGxcbn07XG5cbmV4cG9ydCBjb25zdCB2aXNTdGF0ZVNjaGVtYVYwID0gbmV3IFNjaGVtYSh7XG4gIHZlcnNpb246IFZFUlNJT05TLnYwLFxuICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzVjAsXG4gIGtleTogJ3Zpc1N0YXRlJ1xufSk7XG5cbmV4cG9ydCBjb25zdCB2aXNTdGF0ZVNjaGVtYVYxID0gbmV3IFNjaGVtYSh7XG4gIHZlcnNpb246IFZFUlNJT05TLnYxLFxuICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzVjEsXG4gIGtleTogJ3Zpc1N0YXRlJ1xufSk7XG5cbmV4cG9ydCBjb25zdCB2aXNTdGF0ZVNjaGVtYSA9IHtcbiAgW1ZFUlNJT05TLnYwXToge1xuICAgIHNhdmU6IHRvU2F2ZSA9PiB2aXNTdGF0ZVNjaGVtYVYwLnNhdmUodG9TYXZlKSxcbiAgICBsb2FkOiB0b0xvYWQgPT4gdmlzU3RhdGVTY2hlbWFWMS5sb2FkKHZpc1N0YXRlU2NoZW1hVjAubG9hZCh0b0xvYWQpLnZpc1N0YXRlKVxuICB9LFxuICBbVkVSU0lPTlMudjFdOiB2aXNTdGF0ZVNjaGVtYVYxXG59O1xuXG4vLyB0ZXN0IGxvYWQgdjBcbmV4cG9ydCBkZWZhdWx0IHZpc1N0YXRlU2NoZW1hO1xuIl19