"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getValueFunc = getValueFunc;
exports.getScaleFunctor = getScaleFunctor;
exports.getGetValue = getGetValue;
exports.getDimensionSortedBins = getDimensionSortedBins;
exports.getDimensionValueDomain = getDimensionValueDomain;
exports.getDimensionScale = getDimensionScale;
exports.getAggregatedData = getAggregatedData;
exports["default"] = exports.defaultDimensions = exports.defaultElevationDimension = exports.defaultColorDimension = exports.defaultAggregation = exports.DECK_AGGREGATION_MAP = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _aggregationLayers = require("@deck.gl/aggregation-layers");

var _window = require("global/window");

var _enhancedBinSorter = _interopRequireDefault(require("./enhanced-bin-sorter"));

var _aggregateUtils = require("../../utils/aggregate-utils");

var _defaultSettings = require("../../constants/default-settings");

var _DECK_AGGREGATION_MAP;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var DECK_AGGREGATION_MAP = (_DECK_AGGREGATION_MAP = {}, (0, _defineProperty2["default"])(_DECK_AGGREGATION_MAP, _aggregationLayers.AGGREGATION_OPERATION.SUM, _defaultSettings.AGGREGATION_TYPES.sum), (0, _defineProperty2["default"])(_DECK_AGGREGATION_MAP, _aggregationLayers.AGGREGATION_OPERATION.MEAN, _defaultSettings.AGGREGATION_TYPES.average), (0, _defineProperty2["default"])(_DECK_AGGREGATION_MAP, _aggregationLayers.AGGREGATION_OPERATION.MIN, _defaultSettings.AGGREGATION_TYPES.minimum), (0, _defineProperty2["default"])(_DECK_AGGREGATION_MAP, _aggregationLayers.AGGREGATION_OPERATION.MAX, _defaultSettings.AGGREGATION_TYPES.maximum), _DECK_AGGREGATION_MAP);
exports.DECK_AGGREGATION_MAP = DECK_AGGREGATION_MAP;

function getValueFunc(aggregation, accessor) {
  if (!aggregation || !_aggregationLayers.AGGREGATION_OPERATION[aggregation.toUpperCase()]) {
    _window.console.warn("Aggregation ".concat(aggregation, " is not supported"));
  }

  var op = _aggregationLayers.AGGREGATION_OPERATION[aggregation.toUpperCase()] || _aggregationLayers.AGGREGATION_OPERATION.SUM;

  var keplerOp = DECK_AGGREGATION_MAP[op];
  return function (pts) {
    return (0, _aggregateUtils.aggregate)(pts.map(accessor), keplerOp);
  };
}

function getScaleFunctor(scaleType) {
  if (!scaleType || !_defaultSettings.SCALE_FUNC[scaleType]) {
    _window.console.warn("Scale ".concat(scaleType, " is not supported"));
  }

  return _defaultSettings.SCALE_FUNC[scaleType] || _defaultSettings.SCALE_FUNC.quantize;
}

function nop() {}

function getGetValue(step, props, dimensionUpdater) {
  var key = dimensionUpdater.key;
  var _step$triggers = step.triggers,
      value = _step$triggers.value,
      weight = _step$triggers.weight,
      aggregation = _step$triggers.aggregation;
  var getValue = props[value.prop];

  if (getValue === null) {
    // If `getValue` is not provided from props, build it with aggregation and weight.
    getValue = getValueFunc(props[aggregation.prop], props[weight.prop]);
  }

  if (getValue) {
    this._setDimensionState(key, {
      getValue: getValue
    });
  }
}

function getDimensionSortedBins(step, props, dimensionUpdater) {
  var key = dimensionUpdater.key;
  var getValue = this.state.dimensions[key].getValue;
  var sortedBins = new _enhancedBinSorter["default"](this.state.layerData.data || [], {
    getValue: getValue,
    filterData: props._filterData
  });

  this._setDimensionState(key, {
    sortedBins: sortedBins
  });
}

function getDimensionValueDomain(step, props, dimensionUpdater) {
  var key = dimensionUpdater.key;
  var _step$triggers2 = step.triggers,
      lowerPercentile = _step$triggers2.lowerPercentile,
      upperPercentile = _step$triggers2.upperPercentile,
      scaleType = _step$triggers2.scaleType;

  if (!this.state.dimensions[key].sortedBins) {
    // the previous step should set sortedBins, if not, something went wrong
    return;
  } // for log and sqrt scale, returns linear domain by default
  // TODO: support other scale function domain in bin sorter


  var valueDomain = this.state.dimensions[key].sortedBins.getValueDomainByScale(props[scaleType.prop], [props[lowerPercentile.prop], props[upperPercentile.prop]]);

  this._setDimensionState(key, {
    valueDomain: valueDomain
  });
}

function getDimensionScale(step, props, dimensionUpdater) {
  var key = dimensionUpdater.key;
  var _step$triggers3 = step.triggers,
      domain = _step$triggers3.domain,
      range = _step$triggers3.range,
      scaleType = _step$triggers3.scaleType;
  var onSet = step.onSet;

  if (!this.state.dimensions[key].valueDomain) {
    // the previous step should set valueDomain, if not, something went wrong
    return;
  }

  var dimensionRange = props[range.prop];
  var dimensionDomain = props[domain.prop] || this.state.dimensions[key].valueDomain;
  var scaleFunctor = getScaleFunctor(scaleType && props[scaleType.prop])();
  var scaleFunc = scaleFunctor.domain(dimensionDomain).range(dimensionRange);

  if ((0, _typeof2["default"])(onSet) === 'object' && typeof props[onSet.props] === 'function') {
    props[onSet.props](scaleFunc.domain());
  }

  this._setDimensionState(key, {
    scaleFunc: scaleFunc
  });
}

function normalizeResult() {
  var result = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  // support previous hexagonAggregator API
  if (result.hexagons) {
    return Object.assign({
      data: result.hexagons
    }, result);
  } else if (result.layerData) {
    return Object.assign({
      data: result.layerData
    }, result);
  }

  return result;
}

function getAggregatedData(step, props, aggregation, aggregationParams) {
  var aggr = step.triggers.aggregator;
  var aggregator = props[aggr.prop]; // result should contain a data array and other props
  // result = {data: [], ...other props}

  var result = aggregator(props, aggregationParams);
  this.setState({
    layerData: normalizeResult(result)
  });
}

var defaultAggregation = {
  key: 'position',
  updateSteps: [{
    key: 'aggregate',
    triggers: {
      cellSize: {
        prop: 'cellSize'
      },
      position: {
        prop: 'getPosition',
        updateTrigger: 'getPosition'
      },
      aggregator: {
        prop: 'gridAggregator'
      }
    },
    updater: getAggregatedData
  }]
};
exports.defaultAggregation = defaultAggregation;

function getSubLayerAccessor(dimensionState, dimension, layerProps) {
  return function (cell) {
    var sortedBins = dimensionState.sortedBins,
        scaleFunc = dimensionState.scaleFunc;
    var bin = sortedBins.binMap[cell.index];

    if (bin && bin.counts === 0) {
      // no points left in bin after filtering
      return dimension.nullValue;
    }

    var cv = bin && bin.value;
    var domain = scaleFunc.domain();
    var isValueInDomain = cv >= domain[0] && cv <= domain[domain.length - 1]; // if cell value is outside domain, set alpha to 0

    return isValueInDomain ? scaleFunc(cv) : dimension.nullValue;
  };
}

var defaultColorDimension = {
  key: 'fillColor',
  accessor: 'getFillColor',
  getPickingInfo: function getPickingInfo(dimensionState, cell) {
    var sortedBins = dimensionState.sortedBins;
    var colorValue = sortedBins.binMap[cell.index] && sortedBins.binMap[cell.index].value;
    return {
      colorValue: colorValue
    };
  },
  nullValue: [0, 0, 0, 0],
  updateSteps: [{
    key: 'getValue',
    triggers: {
      value: {
        prop: 'getColorValue',
        updateTrigger: 'getColorValue'
      },
      weight: {
        prop: 'getColorWeight',
        updateTrigger: 'getColorWeight'
      },
      aggregation: {
        prop: 'colorAggregation'
      }
    },
    updater: getGetValue
  }, {
    key: 'getBins',
    triggers: {
      _filterData: {
        prop: '_filterData',
        updateTrigger: '_filterData'
      }
    },
    updater: getDimensionSortedBins
  }, {
    key: 'getDomain',
    triggers: {
      lowerPercentile: {
        prop: 'lowerPercentile'
      },
      upperPercentile: {
        prop: 'upperPercentile'
      },
      scaleType: {
        prop: 'colorScaleType'
      }
    },
    updater: getDimensionValueDomain
  }, {
    key: 'getScaleFunc',
    triggers: {
      domain: {
        prop: 'colorDomain'
      },
      range: {
        prop: 'colorRange'
      },
      scaleType: {
        prop: 'colorScaleType'
      }
    },
    onSet: {
      props: 'onSetColorDomain'
    },
    updater: getDimensionScale
  }],
  getSubLayerAccessor: getSubLayerAccessor
};
exports.defaultColorDimension = defaultColorDimension;
var defaultElevationDimension = {
  key: 'elevation',
  accessor: 'getElevation',
  getPickingInfo: function getPickingInfo(dimensionState, cell) {
    var sortedBins = dimensionState.sortedBins;
    var elevationValue = sortedBins.binMap[cell.index] && sortedBins.binMap[cell.index].value;
    return {
      elevationValue: elevationValue
    };
  },
  nullValue: -1,
  updateSteps: [{
    key: 'getValue',
    triggers: {
      value: {
        prop: 'getElevationValue',
        updateTrigger: 'getElevationValue'
      },
      weight: {
        prop: 'getElevationWeight',
        updateTrigger: 'getElevationWeight'
      },
      aggregation: {
        prop: 'elevationAggregation'
      }
    },
    updater: getGetValue
  }, {
    key: 'getBins',
    triggers: {
      _filterData: {
        prop: '_filterData',
        updateTrigger: '_filterData'
      }
    },
    updater: getDimensionSortedBins
  }, {
    key: 'getDomain',
    triggers: {
      lowerPercentile: {
        prop: 'elevationLowerPercentile'
      },
      upperPercentile: {
        prop: 'elevationUpperPercentile'
      },
      scaleType: {
        prop: 'elevationScaleType'
      }
    },
    updater: getDimensionValueDomain
  }, {
    key: 'getScaleFunc',
    triggers: {
      domain: {
        prop: 'elevationDomain'
      },
      range: {
        prop: 'elevationRange'
      },
      scaleType: {
        prop: 'elevationScaleType'
      }
    },
    onSet: {
      props: 'onSetElevationDomain'
    },
    updater: getDimensionScale
  }],
  getSubLayerAccessor: getSubLayerAccessor
};
exports.defaultElevationDimension = defaultElevationDimension;
var _defaultDimensions = [defaultColorDimension, defaultElevationDimension];
exports.defaultDimensions = _defaultDimensions;

var CPUAggregator =
/*#__PURE__*/
function () {
  function CPUAggregator() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2["default"])(this, CPUAggregator);
    this.state = _objectSpread({
      layerData: {},
      dimensions: {// color: {
        //   getValue: null,
        //   domain: null,
        //   sortedBins: null,
        //   scaleFunc: nop
        // },
        // elevation: {
        //   getValue: null,
        //   domain: null,
        //   sortedBins: null,
        //   scaleFunc: nop
        // }
      }
    }, opts.initialState);
    this.dimensionUpdaters = {};
    this.aggregationUpdater = {};

    this._addDimension(opts.dimensions || _defaultDimensions);

    this._addAggregation(opts.aggregation || defaultAggregation);
  }

  (0, _createClass2["default"])(CPUAggregator, [{
    key: "updateAllDimensions",
    value: function updateAllDimensions(props) {
      var dimensionChanges = []; // update all dimensions

      for (var dim in this.dimensionUpdaters) {
        var updaters = this._accumulateUpdaters(0, props, this.dimensionUpdaters[dim]);

        dimensionChanges = dimensionChanges.concat(updaters);
      }

      dimensionChanges.forEach(function (f) {
        return typeof f === 'function' && f();
      });
    }
  }, {
    key: "updateAggregation",
    value: function updateAggregation(props, aggregationParams) {
      var updaters = this._accumulateUpdaters(0, props, this.aggregationUpdater);

      updaters.forEach(function (f) {
        return typeof f === 'function' && f(aggregationParams);
      });
    }
  }, {
    key: "updateState",
    value: function updateState(opts, aggregationParams) {
      var oldProps = opts.oldProps,
          props = opts.props,
          changeFlags = opts.changeFlags;
      var dimensionChanges = [];

      if (changeFlags.dataChanged) {
        // if data changed update everything
        this.updateAggregation(props, aggregationParams);
        this.updateAllDimensions(props);
        return this.state;
      }

      var aggregationChanges = this._getAggregationChanges(oldProps, props, changeFlags);

      if (aggregationChanges && aggregationChanges.length) {
        // get aggregatedData
        aggregationChanges.forEach(function (f) {
          return typeof f === 'function' && f(aggregationParams);
        });
        this.updateAllDimensions(props);
      } else {
        // only update dimensions
        dimensionChanges = this._getDimensionChanges(oldProps, props, changeFlags) || [];
        dimensionChanges.forEach(function (f) {
          return typeof f === 'function' && f();
        });
      }

      return this.state;
    } // Update private state

  }, {
    key: "setState",
    value: function setState(updateObject) {
      this.state = Object.assign({}, this.state, updateObject);
    } // Update private state.dimensions

  }, {
    key: "_setDimensionState",
    value: function _setDimensionState(key, updateObject) {
      this.setState({
        dimensions: Object.assign({}, this.state.dimensions, (0, _defineProperty2["default"])({}, key, Object.assign({}, this.state.dimensions[key], updateObject)))
      });
    }
  }, {
    key: "_addAggregation",
    value: function _addAggregation(aggregation) {
      this.aggregationUpdater = aggregation;
    }
  }, {
    key: "_addDimension",
    value: function _addDimension() {
      var _this = this;

      var dimensions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      dimensions.forEach(function (dimension) {
        var key = dimension.key;
        _this.dimensionUpdaters[key] = dimension;
      });
    }
  }, {
    key: "_needUpdateStep",
    value: function _needUpdateStep(dimensionStep, oldProps, props, changeFlags) {
      // whether need to update current dimension step
      // dimension step is the value, domain, scaleFunction of each dimension
      // each step is an object with properties links to layer prop and whether the prop is
      // controlled by updateTriggers
      return Object.values(dimensionStep.triggers).some(function (item) {
        if (item.updateTrigger) {
          // check based on updateTriggers change first
          return changeFlags.updateTriggersChanged && (changeFlags.updateTriggersChanged.all || changeFlags.updateTriggersChanged[item.updateTrigger]);
        } // fallback to direct comparison


        return oldProps[item.prop] !== props[item.prop];
      });
    }
  }, {
    key: "_accumulateUpdaters",
    value: function _accumulateUpdaters(step, props, dimension) {
      var updaters = [];

      for (var i = step; i < dimension.updateSteps.length; i++) {
        if (typeof dimension.updateSteps[i].updater === 'function') {
          updaters.push(dimension.updateSteps[i].updater.bind(this, dimension.updateSteps[i], props, dimension));
        }
      }

      return updaters;
    }
  }, {
    key: "_getAllUpdaters",
    value: function _getAllUpdaters(dimension, oldProps, props, changeFlags) {
      var _this2 = this;

      var updaters = [];
      var needUpdateStep = dimension.updateSteps.findIndex(function (step) {
        return _this2._needUpdateStep(step, oldProps, props, changeFlags);
      });

      if (needUpdateStep > -1) {
        updaters = updaters.concat(this._accumulateUpdaters(needUpdateStep, props, dimension));
      }

      return updaters;
    }
  }, {
    key: "_getAggregationChanges",
    value: function _getAggregationChanges(oldProps, props, changeFlags) {
      var updaters = this._getAllUpdaters(this.aggregationUpdater, oldProps, props, changeFlags);

      return updaters.length ? updaters : null;
    }
  }, {
    key: "_getDimensionChanges",
    value: function _getDimensionChanges(oldProps, props, changeFlags) {
      var updaters = []; // get dimension to be updated

      for (var key in this.dimensionUpdaters) {
        // return the first triggered updater for each dimension
        var dimension = this.dimensionUpdaters[key];

        var dimensionUpdaters = this._getAllUpdaters(dimension, oldProps, props, changeFlags);

        updaters = updaters.concat(dimensionUpdaters);
      }

      return updaters.length ? updaters : null;
    }
  }, {
    key: "getUpdateTriggers",
    value: function getUpdateTriggers(props) {
      var _this3 = this;

      var _updateTriggers = props.updateTriggers || {};

      var updateTriggers = {};

      var _loop = function _loop(key) {
        var _this3$dimensionUpdat = _this3.dimensionUpdaters[key],
            accessor = _this3$dimensionUpdat.accessor,
            updateSteps = _this3$dimensionUpdat.updateSteps; // fold dimension triggers into each accessor

        updateTriggers[accessor] = {};
        updateSteps.forEach(function (step) {
          Object.values(step.triggers || []).forEach(function (_ref) {
            var prop = _ref.prop,
                updateTrigger = _ref.updateTrigger;

            if (updateTrigger) {
              // if prop is based on updateTrigger e.g. getColorValue, getColorWeight
              // and updateTriggers is passed in from layer prop
              // fold the updateTriggers into accessor
              var fromProp = _updateTriggers[updateTrigger];

              if ((0, _typeof2["default"])(fromProp) === 'object' && !Array.isArray(fromProp)) {
                // if updateTrigger is an object spread it
                Object.assign(updateTriggers[accessor], fromProp);
              } else if (fromProp !== undefined) {
                updateTriggers[accessor][prop] = fromProp;
              }
            } else {
              // if prop is not based on updateTrigger
              updateTriggers[accessor][prop] = props[prop];
            }
          });
        });
      };

      for (var key in this.dimensionUpdaters) {
        _loop(key);
      }

      return updateTriggers;
    }
  }, {
    key: "getPickingInfo",
    value: function getPickingInfo(_ref2, layerProps) {
      var info = _ref2.info;
      var isPicked = info.picked && info.index > -1;
      var object = null;

      if (isPicked) {
        var cell = this.state.layerData.data[info.index];
        var binInfo = {};

        for (var key in this.dimensionUpdaters) {
          var getPickingInfo = this.dimensionUpdaters[key].getPickingInfo;

          if (typeof getPickingInfo === 'function') {
            binInfo = Object.assign({}, binInfo, getPickingInfo(this.state.dimensions[key], cell, layerProps));
          }
        }

        object = Object.assign(binInfo, cell, {
          points: cell.filteredPoints || cell.points
        });
      } // add bin  and  to info


      return Object.assign(info, {
        picked: Boolean(object),
        // override object with picked cell
        object: object
      });
    }
  }, {
    key: "getAccessor",
    value: function getAccessor(dimensionKey, layerProps) {
      if (!this.dimensionUpdaters.hasOwnProperty(dimensionKey)) {
        return nop;
      }

      return this.dimensionUpdaters[dimensionKey].getSubLayerAccessor(this.state.dimensions[dimensionKey], this.dimensionUpdaters[dimensionKey], layerProps);
    }
  }], [{
    key: "defaultDimensions",
    value: function defaultDimensions() {
      return _defaultDimensions;
    }
  }]);
  return CPUAggregator;
}();

exports["default"] = CPUAggregator;
CPUAggregator.getDimensionScale = getDimensionScale;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2xheWVyLXV0aWxzL2NwdS1hZ2dyZWdhdG9yLmpzIl0sIm5hbWVzIjpbIkRFQ0tfQUdHUkVHQVRJT05fTUFQIiwiQUdHUkVHQVRJT05fT1BFUkFUSU9OIiwiU1VNIiwiQUdHUkVHQVRJT05fVFlQRVMiLCJzdW0iLCJNRUFOIiwiYXZlcmFnZSIsIk1JTiIsIm1pbmltdW0iLCJNQVgiLCJtYXhpbXVtIiwiZ2V0VmFsdWVGdW5jIiwiYWdncmVnYXRpb24iLCJhY2Nlc3NvciIsInRvVXBwZXJDYXNlIiwiQ29uc29sZSIsIndhcm4iLCJvcCIsImtlcGxlck9wIiwicHRzIiwibWFwIiwiZ2V0U2NhbGVGdW5jdG9yIiwic2NhbGVUeXBlIiwiU0NBTEVfRlVOQyIsInF1YW50aXplIiwibm9wIiwiZ2V0R2V0VmFsdWUiLCJzdGVwIiwicHJvcHMiLCJkaW1lbnNpb25VcGRhdGVyIiwia2V5IiwidHJpZ2dlcnMiLCJ2YWx1ZSIsIndlaWdodCIsImdldFZhbHVlIiwicHJvcCIsIl9zZXREaW1lbnNpb25TdGF0ZSIsImdldERpbWVuc2lvblNvcnRlZEJpbnMiLCJzdGF0ZSIsImRpbWVuc2lvbnMiLCJzb3J0ZWRCaW5zIiwiRW5oYW5jZWRCaW5Tb3J0ZXIiLCJsYXllckRhdGEiLCJkYXRhIiwiZmlsdGVyRGF0YSIsIl9maWx0ZXJEYXRhIiwiZ2V0RGltZW5zaW9uVmFsdWVEb21haW4iLCJsb3dlclBlcmNlbnRpbGUiLCJ1cHBlclBlcmNlbnRpbGUiLCJ2YWx1ZURvbWFpbiIsImdldFZhbHVlRG9tYWluQnlTY2FsZSIsImdldERpbWVuc2lvblNjYWxlIiwiZG9tYWluIiwicmFuZ2UiLCJvblNldCIsImRpbWVuc2lvblJhbmdlIiwiZGltZW5zaW9uRG9tYWluIiwic2NhbGVGdW5jdG9yIiwic2NhbGVGdW5jIiwibm9ybWFsaXplUmVzdWx0IiwicmVzdWx0IiwiaGV4YWdvbnMiLCJPYmplY3QiLCJhc3NpZ24iLCJnZXRBZ2dyZWdhdGVkRGF0YSIsImFnZ3JlZ2F0aW9uUGFyYW1zIiwiYWdnciIsImFnZ3JlZ2F0b3IiLCJzZXRTdGF0ZSIsImRlZmF1bHRBZ2dyZWdhdGlvbiIsInVwZGF0ZVN0ZXBzIiwiY2VsbFNpemUiLCJwb3NpdGlvbiIsInVwZGF0ZVRyaWdnZXIiLCJ1cGRhdGVyIiwiZ2V0U3ViTGF5ZXJBY2Nlc3NvciIsImRpbWVuc2lvblN0YXRlIiwiZGltZW5zaW9uIiwibGF5ZXJQcm9wcyIsImNlbGwiLCJiaW4iLCJiaW5NYXAiLCJpbmRleCIsImNvdW50cyIsIm51bGxWYWx1ZSIsImN2IiwiaXNWYWx1ZUluRG9tYWluIiwibGVuZ3RoIiwiZGVmYXVsdENvbG9yRGltZW5zaW9uIiwiZ2V0UGlja2luZ0luZm8iLCJjb2xvclZhbHVlIiwiZGVmYXVsdEVsZXZhdGlvbkRpbWVuc2lvbiIsImVsZXZhdGlvblZhbHVlIiwiZGVmYXVsdERpbWVuc2lvbnMiLCJDUFVBZ2dyZWdhdG9yIiwib3B0cyIsImluaXRpYWxTdGF0ZSIsImRpbWVuc2lvblVwZGF0ZXJzIiwiYWdncmVnYXRpb25VcGRhdGVyIiwiX2FkZERpbWVuc2lvbiIsIl9hZGRBZ2dyZWdhdGlvbiIsImRpbWVuc2lvbkNoYW5nZXMiLCJkaW0iLCJ1cGRhdGVycyIsIl9hY2N1bXVsYXRlVXBkYXRlcnMiLCJjb25jYXQiLCJmb3JFYWNoIiwiZiIsIm9sZFByb3BzIiwiY2hhbmdlRmxhZ3MiLCJkYXRhQ2hhbmdlZCIsInVwZGF0ZUFnZ3JlZ2F0aW9uIiwidXBkYXRlQWxsRGltZW5zaW9ucyIsImFnZ3JlZ2F0aW9uQ2hhbmdlcyIsIl9nZXRBZ2dyZWdhdGlvbkNoYW5nZXMiLCJfZ2V0RGltZW5zaW9uQ2hhbmdlcyIsInVwZGF0ZU9iamVjdCIsImRpbWVuc2lvblN0ZXAiLCJ2YWx1ZXMiLCJzb21lIiwiaXRlbSIsInVwZGF0ZVRyaWdnZXJzQ2hhbmdlZCIsImFsbCIsImkiLCJwdXNoIiwiYmluZCIsIm5lZWRVcGRhdGVTdGVwIiwiZmluZEluZGV4IiwiX25lZWRVcGRhdGVTdGVwIiwiX2dldEFsbFVwZGF0ZXJzIiwiX3VwZGF0ZVRyaWdnZXJzIiwidXBkYXRlVHJpZ2dlcnMiLCJmcm9tUHJvcCIsIkFycmF5IiwiaXNBcnJheSIsInVuZGVmaW5lZCIsImluZm8iLCJpc1BpY2tlZCIsInBpY2tlZCIsIm9iamVjdCIsImJpbkluZm8iLCJwb2ludHMiLCJmaWx0ZXJlZFBvaW50cyIsIkJvb2xlYW4iLCJkaW1lbnNpb25LZXkiLCJoYXNPd25Qcm9wZXJ0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUJBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOzs7Ozs7OztBQUVPLElBQU1BLG9CQUFvQix3RkFDOUJDLHlDQUFzQkMsR0FEUSxFQUNGQyxtQ0FBa0JDLEdBRGhCLDJEQUU5QkgseUNBQXNCSSxJQUZRLEVBRURGLG1DQUFrQkcsT0FGakIsMkRBRzlCTCx5Q0FBc0JNLEdBSFEsRUFHRkosbUNBQWtCSyxPQUhoQiwyREFJOUJQLHlDQUFzQlEsR0FKUSxFQUlGTixtQ0FBa0JPLE9BSmhCLHlCQUExQjs7O0FBT0EsU0FBU0MsWUFBVCxDQUFzQkMsV0FBdEIsRUFBbUNDLFFBQW5DLEVBQTZDO0FBQ2xELE1BQUksQ0FBQ0QsV0FBRCxJQUFnQixDQUFDWCx5Q0FBc0JXLFdBQVcsQ0FBQ0UsV0FBWixFQUF0QixDQUFyQixFQUF1RTtBQUNyRUMsb0JBQVFDLElBQVIsdUJBQTRCSixXQUE1QjtBQUNEOztBQUVELE1BQU1LLEVBQUUsR0FBR2hCLHlDQUFzQlcsV0FBVyxDQUFDRSxXQUFaLEVBQXRCLEtBQW9EYix5Q0FBc0JDLEdBQXJGOztBQUNBLE1BQU1nQixRQUFRLEdBQUdsQixvQkFBb0IsQ0FBQ2lCLEVBQUQsQ0FBckM7QUFFQSxTQUFPLFVBQUFFLEdBQUc7QUFBQSxXQUFJLCtCQUFVQSxHQUFHLENBQUNDLEdBQUosQ0FBUVAsUUFBUixDQUFWLEVBQTZCSyxRQUE3QixDQUFKO0FBQUEsR0FBVjtBQUNEOztBQUVNLFNBQVNHLGVBQVQsQ0FBeUJDLFNBQXpCLEVBQW9DO0FBQ3pDLE1BQUksQ0FBQ0EsU0FBRCxJQUFjLENBQUNDLDRCQUFXRCxTQUFYLENBQW5CLEVBQTBDO0FBQ3hDUCxvQkFBUUMsSUFBUixpQkFBc0JNLFNBQXRCO0FBQ0Q7O0FBQ0QsU0FBT0MsNEJBQVdELFNBQVgsS0FBeUJDLDRCQUFXQyxRQUEzQztBQUNEOztBQUVELFNBQVNDLEdBQVQsR0FBZSxDQUFFOztBQUVWLFNBQVNDLFdBQVQsQ0FBcUJDLElBQXJCLEVBQTJCQyxLQUEzQixFQUFrQ0MsZ0JBQWxDLEVBQW9EO0FBQUEsTUFDbERDLEdBRGtELEdBQzNDRCxnQkFEMkMsQ0FDbERDLEdBRGtEO0FBQUEsdUJBRXBCSCxJQUFJLENBQUNJLFFBRmU7QUFBQSxNQUVsREMsS0FGa0Qsa0JBRWxEQSxLQUZrRDtBQUFBLE1BRTNDQyxNQUYyQyxrQkFFM0NBLE1BRjJDO0FBQUEsTUFFbkNyQixXQUZtQyxrQkFFbkNBLFdBRm1DO0FBSXpELE1BQUlzQixRQUFRLEdBQUdOLEtBQUssQ0FBQ0ksS0FBSyxDQUFDRyxJQUFQLENBQXBCOztBQUVBLE1BQUlELFFBQVEsS0FBSyxJQUFqQixFQUF1QjtBQUNyQjtBQUNBQSxJQUFBQSxRQUFRLEdBQUd2QixZQUFZLENBQUNpQixLQUFLLENBQUNoQixXQUFXLENBQUN1QixJQUFiLENBQU4sRUFBMEJQLEtBQUssQ0FBQ0ssTUFBTSxDQUFDRSxJQUFSLENBQS9CLENBQXZCO0FBQ0Q7O0FBRUQsTUFBSUQsUUFBSixFQUFjO0FBQ1osU0FBS0Usa0JBQUwsQ0FBd0JOLEdBQXhCLEVBQTZCO0FBQUNJLE1BQUFBLFFBQVEsRUFBUkE7QUFBRCxLQUE3QjtBQUNEO0FBQ0Y7O0FBRU0sU0FBU0csc0JBQVQsQ0FBZ0NWLElBQWhDLEVBQXNDQyxLQUF0QyxFQUE2Q0MsZ0JBQTdDLEVBQStEO0FBQUEsTUFDN0RDLEdBRDZELEdBQ3RERCxnQkFEc0QsQ0FDN0RDLEdBRDZEO0FBQUEsTUFFN0RJLFFBRjZELEdBRWpELEtBQUtJLEtBQUwsQ0FBV0MsVUFBWCxDQUFzQlQsR0FBdEIsQ0FGaUQsQ0FFN0RJLFFBRjZEO0FBSXBFLE1BQU1NLFVBQVUsR0FBRyxJQUFJQyw2QkFBSixDQUFzQixLQUFLSCxLQUFMLENBQVdJLFNBQVgsQ0FBcUJDLElBQXJCLElBQTZCLEVBQW5ELEVBQXVEO0FBQ3hFVCxJQUFBQSxRQUFRLEVBQVJBLFFBRHdFO0FBRXhFVSxJQUFBQSxVQUFVLEVBQUVoQixLQUFLLENBQUNpQjtBQUZzRCxHQUF2RCxDQUFuQjs7QUFJQSxPQUFLVCxrQkFBTCxDQUF3Qk4sR0FBeEIsRUFBNkI7QUFBQ1UsSUFBQUEsVUFBVSxFQUFWQTtBQUFELEdBQTdCO0FBQ0Q7O0FBRU0sU0FBU00sdUJBQVQsQ0FBaUNuQixJQUFqQyxFQUF1Q0MsS0FBdkMsRUFBOENDLGdCQUE5QyxFQUFnRTtBQUFBLE1BQzlEQyxHQUQ4RCxHQUN2REQsZ0JBRHVELENBQzlEQyxHQUQ4RDtBQUFBLHdCQUlqRUgsSUFKaUUsQ0FHbkVJLFFBSG1FO0FBQUEsTUFHeERnQixlQUh3RCxtQkFHeERBLGVBSHdEO0FBQUEsTUFHdkNDLGVBSHVDLG1CQUd2Q0EsZUFIdUM7QUFBQSxNQUd0QjFCLFNBSHNCLG1CQUd0QkEsU0FIc0I7O0FBTXJFLE1BQUksQ0FBQyxLQUFLZ0IsS0FBTCxDQUFXQyxVQUFYLENBQXNCVCxHQUF0QixFQUEyQlUsVUFBaEMsRUFBNEM7QUFDMUM7QUFDQTtBQUNELEdBVG9FLENBV3JFO0FBQ0E7OztBQUNBLE1BQU1TLFdBQVcsR0FBRyxLQUFLWCxLQUFMLENBQVdDLFVBQVgsQ0FBc0JULEdBQXRCLEVBQTJCVSxVQUEzQixDQUFzQ1UscUJBQXRDLENBQ2xCdEIsS0FBSyxDQUFDTixTQUFTLENBQUNhLElBQVgsQ0FEYSxFQUVsQixDQUFDUCxLQUFLLENBQUNtQixlQUFlLENBQUNaLElBQWpCLENBQU4sRUFBOEJQLEtBQUssQ0FBQ29CLGVBQWUsQ0FBQ2IsSUFBakIsQ0FBbkMsQ0FGa0IsQ0FBcEI7O0FBS0EsT0FBS0Msa0JBQUwsQ0FBd0JOLEdBQXhCLEVBQTZCO0FBQUNtQixJQUFBQSxXQUFXLEVBQVhBO0FBQUQsR0FBN0I7QUFDRDs7QUFFTSxTQUFTRSxpQkFBVCxDQUEyQnhCLElBQTNCLEVBQWlDQyxLQUFqQyxFQUF3Q0MsZ0JBQXhDLEVBQTBEO0FBQUEsTUFDeERDLEdBRHdELEdBQ2pERCxnQkFEaUQsQ0FDeERDLEdBRHdEO0FBQUEsd0JBRTVCSCxJQUFJLENBQUNJLFFBRnVCO0FBQUEsTUFFeERxQixNQUZ3RCxtQkFFeERBLE1BRndEO0FBQUEsTUFFaERDLEtBRmdELG1CQUVoREEsS0FGZ0Q7QUFBQSxNQUV6Qy9CLFNBRnlDLG1CQUV6Q0EsU0FGeUM7QUFBQSxNQUd4RGdDLEtBSHdELEdBRy9DM0IsSUFIK0MsQ0FHeEQyQixLQUh3RDs7QUFJL0QsTUFBSSxDQUFDLEtBQUtoQixLQUFMLENBQVdDLFVBQVgsQ0FBc0JULEdBQXRCLEVBQTJCbUIsV0FBaEMsRUFBNkM7QUFDM0M7QUFDQTtBQUNEOztBQUVELE1BQU1NLGNBQWMsR0FBRzNCLEtBQUssQ0FBQ3lCLEtBQUssQ0FBQ2xCLElBQVAsQ0FBNUI7QUFDQSxNQUFNcUIsZUFBZSxHQUFHNUIsS0FBSyxDQUFDd0IsTUFBTSxDQUFDakIsSUFBUixDQUFMLElBQXNCLEtBQUtHLEtBQUwsQ0FBV0MsVUFBWCxDQUFzQlQsR0FBdEIsRUFBMkJtQixXQUF6RTtBQUVBLE1BQU1RLFlBQVksR0FBR3BDLGVBQWUsQ0FBQ0MsU0FBUyxJQUFJTSxLQUFLLENBQUNOLFNBQVMsQ0FBQ2EsSUFBWCxDQUFuQixDQUFmLEVBQXJCO0FBRUEsTUFBTXVCLFNBQVMsR0FBR0QsWUFBWSxDQUFDTCxNQUFiLENBQW9CSSxlQUFwQixFQUFxQ0gsS0FBckMsQ0FBMkNFLGNBQTNDLENBQWxCOztBQUVBLE1BQUkseUJBQU9ELEtBQVAsTUFBaUIsUUFBakIsSUFBNkIsT0FBTzFCLEtBQUssQ0FBQzBCLEtBQUssQ0FBQzFCLEtBQVAsQ0FBWixLQUE4QixVQUEvRCxFQUEyRTtBQUN6RUEsSUFBQUEsS0FBSyxDQUFDMEIsS0FBSyxDQUFDMUIsS0FBUCxDQUFMLENBQW1COEIsU0FBUyxDQUFDTixNQUFWLEVBQW5CO0FBQ0Q7O0FBQ0QsT0FBS2hCLGtCQUFMLENBQXdCTixHQUF4QixFQUE2QjtBQUFDNEIsSUFBQUEsU0FBUyxFQUFUQTtBQUFELEdBQTdCO0FBQ0Q7O0FBRUQsU0FBU0MsZUFBVCxHQUFzQztBQUFBLE1BQWJDLE1BQWEsdUVBQUosRUFBSTs7QUFDcEM7QUFDQSxNQUFJQSxNQUFNLENBQUNDLFFBQVgsRUFBcUI7QUFDbkIsV0FBT0MsTUFBTSxDQUFDQyxNQUFQLENBQWM7QUFBQ3BCLE1BQUFBLElBQUksRUFBRWlCLE1BQU0sQ0FBQ0M7QUFBZCxLQUFkLEVBQXVDRCxNQUF2QyxDQUFQO0FBQ0QsR0FGRCxNQUVPLElBQUlBLE1BQU0sQ0FBQ2xCLFNBQVgsRUFBc0I7QUFDM0IsV0FBT29CLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUNwQixNQUFBQSxJQUFJLEVBQUVpQixNQUFNLENBQUNsQjtBQUFkLEtBQWQsRUFBd0NrQixNQUF4QyxDQUFQO0FBQ0Q7O0FBRUQsU0FBT0EsTUFBUDtBQUNEOztBQUVNLFNBQVNJLGlCQUFULENBQTJCckMsSUFBM0IsRUFBaUNDLEtBQWpDLEVBQXdDaEIsV0FBeEMsRUFBcURxRCxpQkFBckQsRUFBd0U7QUFBQSxNQUVwREMsSUFGb0QsR0FHekV2QyxJQUh5RSxDQUUzRUksUUFGMkUsQ0FFaEVvQyxVQUZnRTtBQUk3RSxNQUFNQSxVQUFVLEdBQUd2QyxLQUFLLENBQUNzQyxJQUFJLENBQUMvQixJQUFOLENBQXhCLENBSjZFLENBTTdFO0FBQ0E7O0FBQ0EsTUFBTXlCLE1BQU0sR0FBR08sVUFBVSxDQUFDdkMsS0FBRCxFQUFRcUMsaUJBQVIsQ0FBekI7QUFDQSxPQUFLRyxRQUFMLENBQWM7QUFDWjFCLElBQUFBLFNBQVMsRUFBRWlCLGVBQWUsQ0FBQ0MsTUFBRDtBQURkLEdBQWQ7QUFHRDs7QUFFTSxJQUFNUyxrQkFBa0IsR0FBRztBQUNoQ3ZDLEVBQUFBLEdBQUcsRUFBRSxVQUQyQjtBQUVoQ3dDLEVBQUFBLFdBQVcsRUFBRSxDQUNYO0FBQ0V4QyxJQUFBQSxHQUFHLEVBQUUsV0FEUDtBQUVFQyxJQUFBQSxRQUFRLEVBQUU7QUFDUndDLE1BQUFBLFFBQVEsRUFBRTtBQUNScEMsUUFBQUEsSUFBSSxFQUFFO0FBREUsT0FERjtBQUlScUMsTUFBQUEsUUFBUSxFQUFFO0FBQ1JyQyxRQUFBQSxJQUFJLEVBQUUsYUFERTtBQUVSc0MsUUFBQUEsYUFBYSxFQUFFO0FBRlAsT0FKRjtBQVFSTixNQUFBQSxVQUFVLEVBQUU7QUFDVmhDLFFBQUFBLElBQUksRUFBRTtBQURJO0FBUkosS0FGWjtBQWNFdUMsSUFBQUEsT0FBTyxFQUFFVjtBQWRYLEdBRFc7QUFGbUIsQ0FBM0I7OztBQXNCUCxTQUFTVyxtQkFBVCxDQUE2QkMsY0FBN0IsRUFBNkNDLFNBQTdDLEVBQXdEQyxVQUF4RCxFQUFvRTtBQUNsRSxTQUFPLFVBQUFDLElBQUksRUFBSTtBQUFBLFFBQ052QyxVQURNLEdBQ21Cb0MsY0FEbkIsQ0FDTnBDLFVBRE07QUFBQSxRQUNNa0IsU0FETixHQUNtQmtCLGNBRG5CLENBQ01sQixTQUROO0FBRWIsUUFBTXNCLEdBQUcsR0FBR3hDLFVBQVUsQ0FBQ3lDLE1BQVgsQ0FBa0JGLElBQUksQ0FBQ0csS0FBdkIsQ0FBWjs7QUFFQSxRQUFJRixHQUFHLElBQUlBLEdBQUcsQ0FBQ0csTUFBSixLQUFlLENBQTFCLEVBQTZCO0FBQzNCO0FBQ0EsYUFBT04sU0FBUyxDQUFDTyxTQUFqQjtBQUNEOztBQUVELFFBQU1DLEVBQUUsR0FBR0wsR0FBRyxJQUFJQSxHQUFHLENBQUNoRCxLQUF0QjtBQUNBLFFBQU1vQixNQUFNLEdBQUdNLFNBQVMsQ0FBQ04sTUFBVixFQUFmO0FBRUEsUUFBTWtDLGVBQWUsR0FBR0QsRUFBRSxJQUFJakMsTUFBTSxDQUFDLENBQUQsQ0FBWixJQUFtQmlDLEVBQUUsSUFBSWpDLE1BQU0sQ0FBQ0EsTUFBTSxDQUFDbUMsTUFBUCxHQUFnQixDQUFqQixDQUF2RCxDQVphLENBY2I7O0FBQ0EsV0FBT0QsZUFBZSxHQUFHNUIsU0FBUyxDQUFDMkIsRUFBRCxDQUFaLEdBQW1CUixTQUFTLENBQUNPLFNBQW5EO0FBQ0QsR0FoQkQ7QUFpQkQ7O0FBRU0sSUFBTUkscUJBQXFCLEdBQUc7QUFDbkMxRCxFQUFBQSxHQUFHLEVBQUUsV0FEOEI7QUFFbkNqQixFQUFBQSxRQUFRLEVBQUUsY0FGeUI7QUFHbkM0RSxFQUFBQSxjQUFjLEVBQUUsd0JBQUNiLGNBQUQsRUFBaUJHLElBQWpCLEVBQTBCO0FBQUEsUUFDakN2QyxVQURpQyxHQUNuQm9DLGNBRG1CLENBQ2pDcEMsVUFEaUM7QUFFeEMsUUFBTWtELFVBQVUsR0FBR2xELFVBQVUsQ0FBQ3lDLE1BQVgsQ0FBa0JGLElBQUksQ0FBQ0csS0FBdkIsS0FBaUMxQyxVQUFVLENBQUN5QyxNQUFYLENBQWtCRixJQUFJLENBQUNHLEtBQXZCLEVBQThCbEQsS0FBbEY7QUFDQSxXQUFPO0FBQUMwRCxNQUFBQSxVQUFVLEVBQVZBO0FBQUQsS0FBUDtBQUNELEdBUGtDO0FBUW5DTixFQUFBQSxTQUFTLEVBQUUsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWLENBUndCO0FBU25DZCxFQUFBQSxXQUFXLEVBQUUsQ0FDWDtBQUNFeEMsSUFBQUEsR0FBRyxFQUFFLFVBRFA7QUFFRUMsSUFBQUEsUUFBUSxFQUFFO0FBQ1JDLE1BQUFBLEtBQUssRUFBRTtBQUNMRyxRQUFBQSxJQUFJLEVBQUUsZUFERDtBQUVMc0MsUUFBQUEsYUFBYSxFQUFFO0FBRlYsT0FEQztBQUtSeEMsTUFBQUEsTUFBTSxFQUFFO0FBQ05FLFFBQUFBLElBQUksRUFBRSxnQkFEQTtBQUVOc0MsUUFBQUEsYUFBYSxFQUFFO0FBRlQsT0FMQTtBQVNSN0QsTUFBQUEsV0FBVyxFQUFFO0FBQ1h1QixRQUFBQSxJQUFJLEVBQUU7QUFESztBQVRMLEtBRlo7QUFlRXVDLElBQUFBLE9BQU8sRUFBRWhEO0FBZlgsR0FEVyxFQWtCWDtBQUNFSSxJQUFBQSxHQUFHLEVBQUUsU0FEUDtBQUVFQyxJQUFBQSxRQUFRLEVBQUU7QUFDUmMsTUFBQUEsV0FBVyxFQUFFO0FBQ1hWLFFBQUFBLElBQUksRUFBRSxhQURLO0FBRVhzQyxRQUFBQSxhQUFhLEVBQUU7QUFGSjtBQURMLEtBRlo7QUFRRUMsSUFBQUEsT0FBTyxFQUFFckM7QUFSWCxHQWxCVyxFQTRCWDtBQUNFUCxJQUFBQSxHQUFHLEVBQUUsV0FEUDtBQUVFQyxJQUFBQSxRQUFRLEVBQUU7QUFDUmdCLE1BQUFBLGVBQWUsRUFBRTtBQUNmWixRQUFBQSxJQUFJLEVBQUU7QUFEUyxPQURUO0FBSVJhLE1BQUFBLGVBQWUsRUFBRTtBQUNmYixRQUFBQSxJQUFJLEVBQUU7QUFEUyxPQUpUO0FBT1JiLE1BQUFBLFNBQVMsRUFBRTtBQUFDYSxRQUFBQSxJQUFJLEVBQUU7QUFBUDtBQVBILEtBRlo7QUFXRXVDLElBQUFBLE9BQU8sRUFBRTVCO0FBWFgsR0E1QlcsRUF5Q1g7QUFDRWhCLElBQUFBLEdBQUcsRUFBRSxjQURQO0FBRUVDLElBQUFBLFFBQVEsRUFBRTtBQUNScUIsTUFBQUEsTUFBTSxFQUFFO0FBQUNqQixRQUFBQSxJQUFJLEVBQUU7QUFBUCxPQURBO0FBRVJrQixNQUFBQSxLQUFLLEVBQUU7QUFBQ2xCLFFBQUFBLElBQUksRUFBRTtBQUFQLE9BRkM7QUFHUmIsTUFBQUEsU0FBUyxFQUFFO0FBQUNhLFFBQUFBLElBQUksRUFBRTtBQUFQO0FBSEgsS0FGWjtBQU9FbUIsSUFBQUEsS0FBSyxFQUFFO0FBQ0wxQixNQUFBQSxLQUFLLEVBQUU7QUFERixLQVBUO0FBVUU4QyxJQUFBQSxPQUFPLEVBQUV2QjtBQVZYLEdBekNXLENBVHNCO0FBK0RuQ3dCLEVBQUFBLG1CQUFtQixFQUFuQkE7QUEvRG1DLENBQTlCOztBQWtFQSxJQUFNZ0IseUJBQXlCLEdBQUc7QUFDdkM3RCxFQUFBQSxHQUFHLEVBQUUsV0FEa0M7QUFFdkNqQixFQUFBQSxRQUFRLEVBQUUsY0FGNkI7QUFHdkM0RSxFQUFBQSxjQUFjLEVBQUUsd0JBQUNiLGNBQUQsRUFBaUJHLElBQWpCLEVBQTBCO0FBQUEsUUFDakN2QyxVQURpQyxHQUNuQm9DLGNBRG1CLENBQ2pDcEMsVUFEaUM7QUFFeEMsUUFBTW9ELGNBQWMsR0FBR3BELFVBQVUsQ0FBQ3lDLE1BQVgsQ0FBa0JGLElBQUksQ0FBQ0csS0FBdkIsS0FBaUMxQyxVQUFVLENBQUN5QyxNQUFYLENBQWtCRixJQUFJLENBQUNHLEtBQXZCLEVBQThCbEQsS0FBdEY7QUFDQSxXQUFPO0FBQUM0RCxNQUFBQSxjQUFjLEVBQWRBO0FBQUQsS0FBUDtBQUNELEdBUHNDO0FBUXZDUixFQUFBQSxTQUFTLEVBQUUsQ0FBQyxDQVIyQjtBQVN2Q2QsRUFBQUEsV0FBVyxFQUFFLENBQ1g7QUFDRXhDLElBQUFBLEdBQUcsRUFBRSxVQURQO0FBRUVDLElBQUFBLFFBQVEsRUFBRTtBQUNSQyxNQUFBQSxLQUFLLEVBQUU7QUFDTEcsUUFBQUEsSUFBSSxFQUFFLG1CQUREO0FBRUxzQyxRQUFBQSxhQUFhLEVBQUU7QUFGVixPQURDO0FBS1J4QyxNQUFBQSxNQUFNLEVBQUU7QUFDTkUsUUFBQUEsSUFBSSxFQUFFLG9CQURBO0FBRU5zQyxRQUFBQSxhQUFhLEVBQUU7QUFGVCxPQUxBO0FBU1I3RCxNQUFBQSxXQUFXLEVBQUU7QUFDWHVCLFFBQUFBLElBQUksRUFBRTtBQURLO0FBVEwsS0FGWjtBQWVFdUMsSUFBQUEsT0FBTyxFQUFFaEQ7QUFmWCxHQURXLEVBa0JYO0FBQ0VJLElBQUFBLEdBQUcsRUFBRSxTQURQO0FBRUVDLElBQUFBLFFBQVEsRUFBRTtBQUNSYyxNQUFBQSxXQUFXLEVBQUU7QUFDWFYsUUFBQUEsSUFBSSxFQUFFLGFBREs7QUFFWHNDLFFBQUFBLGFBQWEsRUFBRTtBQUZKO0FBREwsS0FGWjtBQVFFQyxJQUFBQSxPQUFPLEVBQUVyQztBQVJYLEdBbEJXLEVBNEJYO0FBQ0VQLElBQUFBLEdBQUcsRUFBRSxXQURQO0FBRUVDLElBQUFBLFFBQVEsRUFBRTtBQUNSZ0IsTUFBQUEsZUFBZSxFQUFFO0FBQ2ZaLFFBQUFBLElBQUksRUFBRTtBQURTLE9BRFQ7QUFJUmEsTUFBQUEsZUFBZSxFQUFFO0FBQ2ZiLFFBQUFBLElBQUksRUFBRTtBQURTLE9BSlQ7QUFPUmIsTUFBQUEsU0FBUyxFQUFFO0FBQUNhLFFBQUFBLElBQUksRUFBRTtBQUFQO0FBUEgsS0FGWjtBQVdFdUMsSUFBQUEsT0FBTyxFQUFFNUI7QUFYWCxHQTVCVyxFQXlDWDtBQUNFaEIsSUFBQUEsR0FBRyxFQUFFLGNBRFA7QUFFRUMsSUFBQUEsUUFBUSxFQUFFO0FBQ1JxQixNQUFBQSxNQUFNLEVBQUU7QUFBQ2pCLFFBQUFBLElBQUksRUFBRTtBQUFQLE9BREE7QUFFUmtCLE1BQUFBLEtBQUssRUFBRTtBQUFDbEIsUUFBQUEsSUFBSSxFQUFFO0FBQVAsT0FGQztBQUdSYixNQUFBQSxTQUFTLEVBQUU7QUFBQ2EsUUFBQUEsSUFBSSxFQUFFO0FBQVA7QUFISCxLQUZaO0FBT0VtQixJQUFBQSxLQUFLLEVBQUU7QUFDTDFCLE1BQUFBLEtBQUssRUFBRTtBQURGLEtBUFQ7QUFVRThDLElBQUFBLE9BQU8sRUFBRXZCO0FBVlgsR0F6Q1csQ0FUMEI7QUErRHZDd0IsRUFBQUEsbUJBQW1CLEVBQW5CQTtBQS9EdUMsQ0FBbEM7O0FBa0VBLElBQU1rQixrQkFBaUIsR0FBRyxDQUFDTCxxQkFBRCxFQUF3QkcseUJBQXhCLENBQTFCOzs7SUFFY0csYTs7O0FBQ25CLDJCQUF1QjtBQUFBLFFBQVhDLElBQVcsdUVBQUosRUFBSTtBQUFBO0FBQ3JCLFNBQUt6RCxLQUFMO0FBQ0VJLE1BQUFBLFNBQVMsRUFBRSxFQURiO0FBRUVILE1BQUFBLFVBQVUsRUFBRSxDQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVpVO0FBRmQsT0FnQkt3RCxJQUFJLENBQUNDLFlBaEJWO0FBa0JBLFNBQUtDLGlCQUFMLEdBQXlCLEVBQXpCO0FBQ0EsU0FBS0Msa0JBQUwsR0FBMEIsRUFBMUI7O0FBRUEsU0FBS0MsYUFBTCxDQUFtQkosSUFBSSxDQUFDeEQsVUFBTCxJQUFtQnNELGtCQUF0Qzs7QUFDQSxTQUFLTyxlQUFMLENBQXFCTCxJQUFJLENBQUNuRixXQUFMLElBQW9CeUQsa0JBQXpDO0FBQ0Q7Ozs7d0NBTW1CekMsSyxFQUFPO0FBQ3pCLFVBQUl5RSxnQkFBZ0IsR0FBRyxFQUF2QixDQUR5QixDQUV6Qjs7QUFDQSxXQUFLLElBQU1DLEdBQVgsSUFBa0IsS0FBS0wsaUJBQXZCLEVBQTBDO0FBQ3hDLFlBQU1NLFFBQVEsR0FBRyxLQUFLQyxtQkFBTCxDQUF5QixDQUF6QixFQUE0QjVFLEtBQTVCLEVBQW1DLEtBQUtxRSxpQkFBTCxDQUF1QkssR0FBdkIsQ0FBbkMsQ0FBakI7O0FBQ0FELFFBQUFBLGdCQUFnQixHQUFHQSxnQkFBZ0IsQ0FBQ0ksTUFBakIsQ0FBd0JGLFFBQXhCLENBQW5CO0FBQ0Q7O0FBRURGLE1BQUFBLGdCQUFnQixDQUFDSyxPQUFqQixDQUF5QixVQUFBQyxDQUFDO0FBQUEsZUFBSSxPQUFPQSxDQUFQLEtBQWEsVUFBYixJQUEyQkEsQ0FBQyxFQUFoQztBQUFBLE9BQTFCO0FBQ0Q7OztzQ0FFaUIvRSxLLEVBQU9xQyxpQixFQUFtQjtBQUMxQyxVQUFNc0MsUUFBUSxHQUFHLEtBQUtDLG1CQUFMLENBQXlCLENBQXpCLEVBQTRCNUUsS0FBNUIsRUFBbUMsS0FBS3NFLGtCQUF4QyxDQUFqQjs7QUFDQUssTUFBQUEsUUFBUSxDQUFDRyxPQUFULENBQWlCLFVBQUFDLENBQUM7QUFBQSxlQUFJLE9BQU9BLENBQVAsS0FBYSxVQUFiLElBQTJCQSxDQUFDLENBQUMxQyxpQkFBRCxDQUFoQztBQUFBLE9BQWxCO0FBQ0Q7OztnQ0FFVzhCLEksRUFBTTlCLGlCLEVBQW1CO0FBQUEsVUFDNUIyQyxRQUQ0QixHQUNJYixJQURKLENBQzVCYSxRQUQ0QjtBQUFBLFVBQ2xCaEYsS0FEa0IsR0FDSW1FLElBREosQ0FDbEJuRSxLQURrQjtBQUFBLFVBQ1hpRixXQURXLEdBQ0lkLElBREosQ0FDWGMsV0FEVztBQUVuQyxVQUFJUixnQkFBZ0IsR0FBRyxFQUF2Qjs7QUFFQSxVQUFJUSxXQUFXLENBQUNDLFdBQWhCLEVBQTZCO0FBQzNCO0FBQ0EsYUFBS0MsaUJBQUwsQ0FBdUJuRixLQUF2QixFQUE4QnFDLGlCQUE5QjtBQUNBLGFBQUsrQyxtQkFBTCxDQUF5QnBGLEtBQXpCO0FBRUEsZUFBTyxLQUFLVSxLQUFaO0FBQ0Q7O0FBRUQsVUFBTTJFLGtCQUFrQixHQUFHLEtBQUtDLHNCQUFMLENBQTRCTixRQUE1QixFQUFzQ2hGLEtBQXRDLEVBQTZDaUYsV0FBN0MsQ0FBM0I7O0FBRUEsVUFBSUksa0JBQWtCLElBQUlBLGtCQUFrQixDQUFDMUIsTUFBN0MsRUFBcUQ7QUFDbkQ7QUFDQTBCLFFBQUFBLGtCQUFrQixDQUFDUCxPQUFuQixDQUEyQixVQUFBQyxDQUFDO0FBQUEsaUJBQUksT0FBT0EsQ0FBUCxLQUFhLFVBQWIsSUFBMkJBLENBQUMsQ0FBQzFDLGlCQUFELENBQWhDO0FBQUEsU0FBNUI7QUFDQSxhQUFLK0MsbUJBQUwsQ0FBeUJwRixLQUF6QjtBQUNELE9BSkQsTUFJTztBQUNMO0FBQ0F5RSxRQUFBQSxnQkFBZ0IsR0FBRyxLQUFLYyxvQkFBTCxDQUEwQlAsUUFBMUIsRUFBb0NoRixLQUFwQyxFQUEyQ2lGLFdBQTNDLEtBQTJELEVBQTlFO0FBQ0FSLFFBQUFBLGdCQUFnQixDQUFDSyxPQUFqQixDQUF5QixVQUFBQyxDQUFDO0FBQUEsaUJBQUksT0FBT0EsQ0FBUCxLQUFhLFVBQWIsSUFBMkJBLENBQUMsRUFBaEM7QUFBQSxTQUExQjtBQUNEOztBQUVELGFBQU8sS0FBS3JFLEtBQVo7QUFDRCxLLENBRUQ7Ozs7NkJBQ1M4RSxZLEVBQWM7QUFDckIsV0FBSzlFLEtBQUwsR0FBYXdCLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEVBQWQsRUFBa0IsS0FBS3pCLEtBQXZCLEVBQThCOEUsWUFBOUIsQ0FBYjtBQUNELEssQ0FFRDs7Ozt1Q0FDbUJ0RixHLEVBQUtzRixZLEVBQWM7QUFDcEMsV0FBS2hELFFBQUwsQ0FBYztBQUNaN0IsUUFBQUEsVUFBVSxFQUFFdUIsTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFrQixLQUFLekIsS0FBTCxDQUFXQyxVQUE3Qix1Q0FDVFQsR0FEUyxFQUNIZ0MsTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFrQixLQUFLekIsS0FBTCxDQUFXQyxVQUFYLENBQXNCVCxHQUF0QixDQUFsQixFQUE4Q3NGLFlBQTlDLENBREc7QUFEQSxPQUFkO0FBS0Q7OztvQ0FFZXhHLFcsRUFBYTtBQUMzQixXQUFLc0Ysa0JBQUwsR0FBMEJ0RixXQUExQjtBQUNEOzs7b0NBRThCO0FBQUE7O0FBQUEsVUFBakIyQixVQUFpQix1RUFBSixFQUFJO0FBQzdCQSxNQUFBQSxVQUFVLENBQUNtRSxPQUFYLENBQW1CLFVBQUE3QixTQUFTLEVBQUk7QUFBQSxZQUN2Qi9DLEdBRHVCLEdBQ2hCK0MsU0FEZ0IsQ0FDdkIvQyxHQUR1QjtBQUU5QixRQUFBLEtBQUksQ0FBQ21FLGlCQUFMLENBQXVCbkUsR0FBdkIsSUFBOEIrQyxTQUE5QjtBQUNELE9BSEQ7QUFJRDs7O29DQUVld0MsYSxFQUFlVCxRLEVBQVVoRixLLEVBQU9pRixXLEVBQWE7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFPL0MsTUFBTSxDQUFDd0QsTUFBUCxDQUFjRCxhQUFhLENBQUN0RixRQUE1QixFQUFzQ3dGLElBQXRDLENBQTJDLFVBQUFDLElBQUksRUFBSTtBQUN4RCxZQUFJQSxJQUFJLENBQUMvQyxhQUFULEVBQXdCO0FBQ3RCO0FBQ0EsaUJBQ0VvQyxXQUFXLENBQUNZLHFCQUFaLEtBQ0NaLFdBQVcsQ0FBQ1kscUJBQVosQ0FBa0NDLEdBQWxDLElBQ0NiLFdBQVcsQ0FBQ1kscUJBQVosQ0FBa0NELElBQUksQ0FBQy9DLGFBQXZDLENBRkYsQ0FERjtBQUtELFNBUnVELENBU3hEOzs7QUFDQSxlQUFPbUMsUUFBUSxDQUFDWSxJQUFJLENBQUNyRixJQUFOLENBQVIsS0FBd0JQLEtBQUssQ0FBQzRGLElBQUksQ0FBQ3JGLElBQU4sQ0FBcEM7QUFDRCxPQVhNLENBQVA7QUFZRDs7O3dDQUVtQlIsSSxFQUFNQyxLLEVBQU9pRCxTLEVBQVc7QUFDMUMsVUFBTTBCLFFBQVEsR0FBRyxFQUFqQjs7QUFDQSxXQUFLLElBQUlvQixDQUFDLEdBQUdoRyxJQUFiLEVBQW1CZ0csQ0FBQyxHQUFHOUMsU0FBUyxDQUFDUCxXQUFWLENBQXNCaUIsTUFBN0MsRUFBcURvQyxDQUFDLEVBQXRELEVBQTBEO0FBQ3hELFlBQUksT0FBTzlDLFNBQVMsQ0FBQ1AsV0FBVixDQUFzQnFELENBQXRCLEVBQXlCakQsT0FBaEMsS0FBNEMsVUFBaEQsRUFBNEQ7QUFDMUQ2QixVQUFBQSxRQUFRLENBQUNxQixJQUFULENBQ0UvQyxTQUFTLENBQUNQLFdBQVYsQ0FBc0JxRCxDQUF0QixFQUF5QmpELE9BQXpCLENBQWlDbUQsSUFBakMsQ0FBc0MsSUFBdEMsRUFBNENoRCxTQUFTLENBQUNQLFdBQVYsQ0FBc0JxRCxDQUF0QixDQUE1QyxFQUFzRS9GLEtBQXRFLEVBQTZFaUQsU0FBN0UsQ0FERjtBQUdEO0FBQ0Y7O0FBRUQsYUFBTzBCLFFBQVA7QUFDRDs7O29DQUVlMUIsUyxFQUFXK0IsUSxFQUFVaEYsSyxFQUFPaUYsVyxFQUFhO0FBQUE7O0FBQ3ZELFVBQUlOLFFBQVEsR0FBRyxFQUFmO0FBQ0EsVUFBTXVCLGNBQWMsR0FBR2pELFNBQVMsQ0FBQ1AsV0FBVixDQUFzQnlELFNBQXRCLENBQWdDLFVBQUFwRyxJQUFJO0FBQUEsZUFDekQsTUFBSSxDQUFDcUcsZUFBTCxDQUFxQnJHLElBQXJCLEVBQTJCaUYsUUFBM0IsRUFBcUNoRixLQUFyQyxFQUE0Q2lGLFdBQTVDLENBRHlEO0FBQUEsT0FBcEMsQ0FBdkI7O0FBSUEsVUFBSWlCLGNBQWMsR0FBRyxDQUFDLENBQXRCLEVBQXlCO0FBQ3ZCdkIsUUFBQUEsUUFBUSxHQUFHQSxRQUFRLENBQUNFLE1BQVQsQ0FBZ0IsS0FBS0QsbUJBQUwsQ0FBeUJzQixjQUF6QixFQUF5Q2xHLEtBQXpDLEVBQWdEaUQsU0FBaEQsQ0FBaEIsQ0FBWDtBQUNEOztBQUVELGFBQU8wQixRQUFQO0FBQ0Q7OzsyQ0FFc0JLLFEsRUFBVWhGLEssRUFBT2lGLFcsRUFBYTtBQUNuRCxVQUFNTixRQUFRLEdBQUcsS0FBSzBCLGVBQUwsQ0FBcUIsS0FBSy9CLGtCQUExQixFQUE4Q1UsUUFBOUMsRUFBd0RoRixLQUF4RCxFQUErRGlGLFdBQS9ELENBQWpCOztBQUNBLGFBQU9OLFFBQVEsQ0FBQ2hCLE1BQVQsR0FBa0JnQixRQUFsQixHQUE2QixJQUFwQztBQUNEOzs7eUNBRW9CSyxRLEVBQVVoRixLLEVBQU9pRixXLEVBQWE7QUFDakQsVUFBSU4sUUFBUSxHQUFHLEVBQWYsQ0FEaUQsQ0FHakQ7O0FBQ0EsV0FBSyxJQUFNekUsR0FBWCxJQUFrQixLQUFLbUUsaUJBQXZCLEVBQTBDO0FBQ3hDO0FBQ0EsWUFBTXBCLFNBQVMsR0FBRyxLQUFLb0IsaUJBQUwsQ0FBdUJuRSxHQUF2QixDQUFsQjs7QUFDQSxZQUFNbUUsaUJBQWlCLEdBQUcsS0FBS2dDLGVBQUwsQ0FBcUJwRCxTQUFyQixFQUFnQytCLFFBQWhDLEVBQTBDaEYsS0FBMUMsRUFBaURpRixXQUFqRCxDQUExQjs7QUFDQU4sUUFBQUEsUUFBUSxHQUFHQSxRQUFRLENBQUNFLE1BQVQsQ0FBZ0JSLGlCQUFoQixDQUFYO0FBQ0Q7O0FBRUQsYUFBT00sUUFBUSxDQUFDaEIsTUFBVCxHQUFrQmdCLFFBQWxCLEdBQTZCLElBQXBDO0FBQ0Q7OztzQ0FFaUIzRSxLLEVBQU87QUFBQTs7QUFDdkIsVUFBTXNHLGVBQWUsR0FBR3RHLEtBQUssQ0FBQ3VHLGNBQU4sSUFBd0IsRUFBaEQ7O0FBQ0EsVUFBTUEsY0FBYyxHQUFHLEVBQXZCOztBQUZ1QixpQ0FJWnJHLEdBSlk7QUFBQSxvQ0FLVyxNQUFJLENBQUNtRSxpQkFBTCxDQUF1Qm5FLEdBQXZCLENBTFg7QUFBQSxZQUtkakIsUUFMYyx5QkFLZEEsUUFMYztBQUFBLFlBS0p5RCxXQUxJLHlCQUtKQSxXQUxJLEVBTXJCOztBQUNBNkQsUUFBQUEsY0FBYyxDQUFDdEgsUUFBRCxDQUFkLEdBQTJCLEVBQTNCO0FBRUF5RCxRQUFBQSxXQUFXLENBQUNvQyxPQUFaLENBQW9CLFVBQUEvRSxJQUFJLEVBQUk7QUFDMUJtQyxVQUFBQSxNQUFNLENBQUN3RCxNQUFQLENBQWMzRixJQUFJLENBQUNJLFFBQUwsSUFBaUIsRUFBL0IsRUFBbUMyRSxPQUFuQyxDQUEyQyxnQkFBMkI7QUFBQSxnQkFBekJ2RSxJQUF5QixRQUF6QkEsSUFBeUI7QUFBQSxnQkFBbkJzQyxhQUFtQixRQUFuQkEsYUFBbUI7O0FBQ3BFLGdCQUFJQSxhQUFKLEVBQW1CO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLGtCQUFNMkQsUUFBUSxHQUFHRixlQUFlLENBQUN6RCxhQUFELENBQWhDOztBQUNBLGtCQUFJLHlCQUFPMkQsUUFBUCxNQUFvQixRQUFwQixJQUFnQyxDQUFDQyxLQUFLLENBQUNDLE9BQU4sQ0FBY0YsUUFBZCxDQUFyQyxFQUE4RDtBQUM1RDtBQUNBdEUsZ0JBQUFBLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjb0UsY0FBYyxDQUFDdEgsUUFBRCxDQUE1QixFQUF3Q3VILFFBQXhDO0FBQ0QsZUFIRCxNQUdPLElBQUlBLFFBQVEsS0FBS0csU0FBakIsRUFBNEI7QUFDakNKLGdCQUFBQSxjQUFjLENBQUN0SCxRQUFELENBQWQsQ0FBeUJzQixJQUF6QixJQUFpQ2lHLFFBQWpDO0FBQ0Q7QUFDRixhQVhELE1BV087QUFDTDtBQUNBRCxjQUFBQSxjQUFjLENBQUN0SCxRQUFELENBQWQsQ0FBeUJzQixJQUF6QixJQUFpQ1AsS0FBSyxDQUFDTyxJQUFELENBQXRDO0FBQ0Q7QUFDRixXQWhCRDtBQWlCRCxTQWxCRDtBQVRxQjs7QUFJdkIsV0FBSyxJQUFNTCxHQUFYLElBQWtCLEtBQUttRSxpQkFBdkIsRUFBMEM7QUFBQSxjQUEvQm5FLEdBQStCO0FBd0J6Qzs7QUFFRCxhQUFPcUcsY0FBUDtBQUNEOzs7MENBRXNCckQsVSxFQUFZO0FBQUEsVUFBbkIwRCxJQUFtQixTQUFuQkEsSUFBbUI7QUFDakMsVUFBTUMsUUFBUSxHQUFHRCxJQUFJLENBQUNFLE1BQUwsSUFBZUYsSUFBSSxDQUFDdEQsS0FBTCxHQUFhLENBQUMsQ0FBOUM7QUFDQSxVQUFJeUQsTUFBTSxHQUFHLElBQWI7O0FBRUEsVUFBSUYsUUFBSixFQUFjO0FBQ1osWUFBTTFELElBQUksR0FBRyxLQUFLekMsS0FBTCxDQUFXSSxTQUFYLENBQXFCQyxJQUFyQixDQUEwQjZGLElBQUksQ0FBQ3RELEtBQS9CLENBQWI7QUFFQSxZQUFJMEQsT0FBTyxHQUFHLEVBQWQ7O0FBQ0EsYUFBSyxJQUFNOUcsR0FBWCxJQUFrQixLQUFLbUUsaUJBQXZCLEVBQTBDO0FBQUEsY0FDakNSLGNBRGlDLEdBQ2YsS0FBS1EsaUJBQUwsQ0FBdUJuRSxHQUF2QixDQURlLENBQ2pDMkQsY0FEaUM7O0FBRXhDLGNBQUksT0FBT0EsY0FBUCxLQUEwQixVQUE5QixFQUEwQztBQUN4Q21ELFlBQUFBLE9BQU8sR0FBRzlFLE1BQU0sQ0FBQ0MsTUFBUCxDQUNSLEVBRFEsRUFFUjZFLE9BRlEsRUFHUm5ELGNBQWMsQ0FBQyxLQUFLbkQsS0FBTCxDQUFXQyxVQUFYLENBQXNCVCxHQUF0QixDQUFELEVBQTZCaUQsSUFBN0IsRUFBbUNELFVBQW5DLENBSE4sQ0FBVjtBQUtEO0FBQ0Y7O0FBRUQ2RCxRQUFBQSxNQUFNLEdBQUc3RSxNQUFNLENBQUNDLE1BQVAsQ0FBYzZFLE9BQWQsRUFBdUI3RCxJQUF2QixFQUE2QjtBQUNwQzhELFVBQUFBLE1BQU0sRUFBRTlELElBQUksQ0FBQytELGNBQUwsSUFBdUIvRCxJQUFJLENBQUM4RDtBQURBLFNBQTdCLENBQVQ7QUFHRCxPQXRCZ0MsQ0F3QmpDOzs7QUFDQSxhQUFPL0UsTUFBTSxDQUFDQyxNQUFQLENBQWN5RSxJQUFkLEVBQW9CO0FBQ3pCRSxRQUFBQSxNQUFNLEVBQUVLLE9BQU8sQ0FBQ0osTUFBRCxDQURVO0FBRXpCO0FBQ0FBLFFBQUFBLE1BQU0sRUFBTkE7QUFIeUIsT0FBcEIsQ0FBUDtBQUtEOzs7Z0NBRVdLLFksRUFBY2xFLFUsRUFBWTtBQUNwQyxVQUFJLENBQUMsS0FBS21CLGlCQUFMLENBQXVCZ0QsY0FBdkIsQ0FBc0NELFlBQXRDLENBQUwsRUFBMEQ7QUFDeEQsZUFBT3ZILEdBQVA7QUFDRDs7QUFDRCxhQUFPLEtBQUt3RSxpQkFBTCxDQUF1QitDLFlBQXZCLEVBQXFDckUsbUJBQXJDLENBQ0wsS0FBS3JDLEtBQUwsQ0FBV0MsVUFBWCxDQUFzQnlHLFlBQXRCLENBREssRUFFTCxLQUFLL0MsaUJBQUwsQ0FBdUIrQyxZQUF2QixDQUZLLEVBR0xsRSxVQUhLLENBQVA7QUFLRDs7O3dDQWxOMEI7QUFDekIsYUFBT2Usa0JBQVA7QUFDRDs7Ozs7O0FBbU5IQyxhQUFhLENBQUMzQyxpQkFBZCxHQUFrQ0EsaUJBQWxDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuLyogZXNsaW50LWRpc2FibGUgZ3VhcmQtZm9yLWluICovXG5pbXBvcnQge0FHR1JFR0FUSU9OX09QRVJBVElPTn0gZnJvbSAnQGRlY2suZ2wvYWdncmVnYXRpb24tbGF5ZXJzJztcbmltcG9ydCB7Y29uc29sZSBhcyBDb25zb2xlfSBmcm9tICdnbG9iYWwvd2luZG93JztcblxuaW1wb3J0IEVuaGFuY2VkQmluU29ydGVyIGZyb20gJy4vZW5oYW5jZWQtYmluLXNvcnRlcic7XG5pbXBvcnQge2FnZ3JlZ2F0ZX0gZnJvbSAndXRpbHMvYWdncmVnYXRlLXV0aWxzJztcbmltcG9ydCB7QUdHUkVHQVRJT05fVFlQRVMsIFNDQUxFX0ZVTkN9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuZXhwb3J0IGNvbnN0IERFQ0tfQUdHUkVHQVRJT05fTUFQID0ge1xuICBbQUdHUkVHQVRJT05fT1BFUkFUSU9OLlNVTV06IEFHR1JFR0FUSU9OX1RZUEVTLnN1bSxcbiAgW0FHR1JFR0FUSU9OX09QRVJBVElPTi5NRUFOXTogQUdHUkVHQVRJT05fVFlQRVMuYXZlcmFnZSxcbiAgW0FHR1JFR0FUSU9OX09QRVJBVElPTi5NSU5dOiBBR0dSRUdBVElPTl9UWVBFUy5taW5pbXVtLFxuICBbQUdHUkVHQVRJT05fT1BFUkFUSU9OLk1BWF06IEFHR1JFR0FUSU9OX1RZUEVTLm1heGltdW1cbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRWYWx1ZUZ1bmMoYWdncmVnYXRpb24sIGFjY2Vzc29yKSB7XG4gIGlmICghYWdncmVnYXRpb24gfHwgIUFHR1JFR0FUSU9OX09QRVJBVElPTlthZ2dyZWdhdGlvbi50b1VwcGVyQ2FzZSgpXSkge1xuICAgIENvbnNvbGUud2FybihgQWdncmVnYXRpb24gJHthZ2dyZWdhdGlvbn0gaXMgbm90IHN1cHBvcnRlZGApO1xuICB9XG5cbiAgY29uc3Qgb3AgPSBBR0dSRUdBVElPTl9PUEVSQVRJT05bYWdncmVnYXRpb24udG9VcHBlckNhc2UoKV0gfHwgQUdHUkVHQVRJT05fT1BFUkFUSU9OLlNVTTtcbiAgY29uc3Qga2VwbGVyT3AgPSBERUNLX0FHR1JFR0FUSU9OX01BUFtvcF07XG5cbiAgcmV0dXJuIHB0cyA9PiBhZ2dyZWdhdGUocHRzLm1hcChhY2Nlc3NvciksIGtlcGxlck9wKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNjYWxlRnVuY3RvcihzY2FsZVR5cGUpIHtcbiAgaWYgKCFzY2FsZVR5cGUgfHwgIVNDQUxFX0ZVTkNbc2NhbGVUeXBlXSkge1xuICAgIENvbnNvbGUud2FybihgU2NhbGUgJHtzY2FsZVR5cGV9IGlzIG5vdCBzdXBwb3J0ZWRgKTtcbiAgfVxuICByZXR1cm4gU0NBTEVfRlVOQ1tzY2FsZVR5cGVdIHx8IFNDQUxFX0ZVTkMucXVhbnRpemU7XG59XG5cbmZ1bmN0aW9uIG5vcCgpIHt9XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRHZXRWYWx1ZShzdGVwLCBwcm9wcywgZGltZW5zaW9uVXBkYXRlcikge1xuICBjb25zdCB7a2V5fSA9IGRpbWVuc2lvblVwZGF0ZXI7XG4gIGNvbnN0IHt2YWx1ZSwgd2VpZ2h0LCBhZ2dyZWdhdGlvbn0gPSBzdGVwLnRyaWdnZXJzO1xuXG4gIGxldCBnZXRWYWx1ZSA9IHByb3BzW3ZhbHVlLnByb3BdO1xuXG4gIGlmIChnZXRWYWx1ZSA9PT0gbnVsbCkge1xuICAgIC8vIElmIGBnZXRWYWx1ZWAgaXMgbm90IHByb3ZpZGVkIGZyb20gcHJvcHMsIGJ1aWxkIGl0IHdpdGggYWdncmVnYXRpb24gYW5kIHdlaWdodC5cbiAgICBnZXRWYWx1ZSA9IGdldFZhbHVlRnVuYyhwcm9wc1thZ2dyZWdhdGlvbi5wcm9wXSwgcHJvcHNbd2VpZ2h0LnByb3BdKTtcbiAgfVxuXG4gIGlmIChnZXRWYWx1ZSkge1xuICAgIHRoaXMuX3NldERpbWVuc2lvblN0YXRlKGtleSwge2dldFZhbHVlfSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERpbWVuc2lvblNvcnRlZEJpbnMoc3RlcCwgcHJvcHMsIGRpbWVuc2lvblVwZGF0ZXIpIHtcbiAgY29uc3Qge2tleX0gPSBkaW1lbnNpb25VcGRhdGVyO1xuICBjb25zdCB7Z2V0VmFsdWV9ID0gdGhpcy5zdGF0ZS5kaW1lbnNpb25zW2tleV07XG5cbiAgY29uc3Qgc29ydGVkQmlucyA9IG5ldyBFbmhhbmNlZEJpblNvcnRlcih0aGlzLnN0YXRlLmxheWVyRGF0YS5kYXRhIHx8IFtdLCB7XG4gICAgZ2V0VmFsdWUsXG4gICAgZmlsdGVyRGF0YTogcHJvcHMuX2ZpbHRlckRhdGFcbiAgfSk7XG4gIHRoaXMuX3NldERpbWVuc2lvblN0YXRlKGtleSwge3NvcnRlZEJpbnN9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERpbWVuc2lvblZhbHVlRG9tYWluKHN0ZXAsIHByb3BzLCBkaW1lbnNpb25VcGRhdGVyKSB7XG4gIGNvbnN0IHtrZXl9ID0gZGltZW5zaW9uVXBkYXRlcjtcbiAgY29uc3Qge1xuICAgIHRyaWdnZXJzOiB7bG93ZXJQZXJjZW50aWxlLCB1cHBlclBlcmNlbnRpbGUsIHNjYWxlVHlwZX1cbiAgfSA9IHN0ZXA7XG5cbiAgaWYgKCF0aGlzLnN0YXRlLmRpbWVuc2lvbnNba2V5XS5zb3J0ZWRCaW5zKSB7XG4gICAgLy8gdGhlIHByZXZpb3VzIHN0ZXAgc2hvdWxkIHNldCBzb3J0ZWRCaW5zLCBpZiBub3QsIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gZm9yIGxvZyBhbmQgc3FydCBzY2FsZSwgcmV0dXJucyBsaW5lYXIgZG9tYWluIGJ5IGRlZmF1bHRcbiAgLy8gVE9ETzogc3VwcG9ydCBvdGhlciBzY2FsZSBmdW5jdGlvbiBkb21haW4gaW4gYmluIHNvcnRlclxuICBjb25zdCB2YWx1ZURvbWFpbiA9IHRoaXMuc3RhdGUuZGltZW5zaW9uc1trZXldLnNvcnRlZEJpbnMuZ2V0VmFsdWVEb21haW5CeVNjYWxlKFxuICAgIHByb3BzW3NjYWxlVHlwZS5wcm9wXSxcbiAgICBbcHJvcHNbbG93ZXJQZXJjZW50aWxlLnByb3BdLCBwcm9wc1t1cHBlclBlcmNlbnRpbGUucHJvcF1dXG4gICk7XG5cbiAgdGhpcy5fc2V0RGltZW5zaW9uU3RhdGUoa2V5LCB7dmFsdWVEb21haW59KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERpbWVuc2lvblNjYWxlKHN0ZXAsIHByb3BzLCBkaW1lbnNpb25VcGRhdGVyKSB7XG4gIGNvbnN0IHtrZXl9ID0gZGltZW5zaW9uVXBkYXRlcjtcbiAgY29uc3Qge2RvbWFpbiwgcmFuZ2UsIHNjYWxlVHlwZX0gPSBzdGVwLnRyaWdnZXJzO1xuICBjb25zdCB7b25TZXR9ID0gc3RlcDtcbiAgaWYgKCF0aGlzLnN0YXRlLmRpbWVuc2lvbnNba2V5XS52YWx1ZURvbWFpbikge1xuICAgIC8vIHRoZSBwcmV2aW91cyBzdGVwIHNob3VsZCBzZXQgdmFsdWVEb21haW4sIGlmIG5vdCwgc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBkaW1lbnNpb25SYW5nZSA9IHByb3BzW3JhbmdlLnByb3BdO1xuICBjb25zdCBkaW1lbnNpb25Eb21haW4gPSBwcm9wc1tkb21haW4ucHJvcF0gfHwgdGhpcy5zdGF0ZS5kaW1lbnNpb25zW2tleV0udmFsdWVEb21haW47XG5cbiAgY29uc3Qgc2NhbGVGdW5jdG9yID0gZ2V0U2NhbGVGdW5jdG9yKHNjYWxlVHlwZSAmJiBwcm9wc1tzY2FsZVR5cGUucHJvcF0pKCk7XG5cbiAgY29uc3Qgc2NhbGVGdW5jID0gc2NhbGVGdW5jdG9yLmRvbWFpbihkaW1lbnNpb25Eb21haW4pLnJhbmdlKGRpbWVuc2lvblJhbmdlKTtcblxuICBpZiAodHlwZW9mIG9uU2V0ID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgcHJvcHNbb25TZXQucHJvcHNdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcHJvcHNbb25TZXQucHJvcHNdKHNjYWxlRnVuYy5kb21haW4oKSk7XG4gIH1cbiAgdGhpcy5fc2V0RGltZW5zaW9uU3RhdGUoa2V5LCB7c2NhbGVGdW5jfSk7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVJlc3VsdChyZXN1bHQgPSB7fSkge1xuICAvLyBzdXBwb3J0IHByZXZpb3VzIGhleGFnb25BZ2dyZWdhdG9yIEFQSVxuICBpZiAocmVzdWx0LmhleGFnb25zKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe2RhdGE6IHJlc3VsdC5oZXhhZ29uc30sIHJlc3VsdCk7XG4gIH0gZWxzZSBpZiAocmVzdWx0LmxheWVyRGF0YSkge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHtkYXRhOiByZXN1bHQubGF5ZXJEYXRhfSwgcmVzdWx0KTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBZ2dyZWdhdGVkRGF0YShzdGVwLCBwcm9wcywgYWdncmVnYXRpb24sIGFnZ3JlZ2F0aW9uUGFyYW1zKSB7XG4gIGNvbnN0IHtcbiAgICB0cmlnZ2Vyczoge2FnZ3JlZ2F0b3I6IGFnZ3J9XG4gIH0gPSBzdGVwO1xuICBjb25zdCBhZ2dyZWdhdG9yID0gcHJvcHNbYWdnci5wcm9wXTtcblxuICAvLyByZXN1bHQgc2hvdWxkIGNvbnRhaW4gYSBkYXRhIGFycmF5IGFuZCBvdGhlciBwcm9wc1xuICAvLyByZXN1bHQgPSB7ZGF0YTogW10sIC4uLm90aGVyIHByb3BzfVxuICBjb25zdCByZXN1bHQgPSBhZ2dyZWdhdG9yKHByb3BzLCBhZ2dyZWdhdGlvblBhcmFtcyk7XG4gIHRoaXMuc2V0U3RhdGUoe1xuICAgIGxheWVyRGF0YTogbm9ybWFsaXplUmVzdWx0KHJlc3VsdClcbiAgfSk7XG59XG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0QWdncmVnYXRpb24gPSB7XG4gIGtleTogJ3Bvc2l0aW9uJyxcbiAgdXBkYXRlU3RlcHM6IFtcbiAgICB7XG4gICAgICBrZXk6ICdhZ2dyZWdhdGUnLFxuICAgICAgdHJpZ2dlcnM6IHtcbiAgICAgICAgY2VsbFNpemU6IHtcbiAgICAgICAgICBwcm9wOiAnY2VsbFNpemUnXG4gICAgICAgIH0sXG4gICAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgICAgcHJvcDogJ2dldFBvc2l0aW9uJyxcbiAgICAgICAgICB1cGRhdGVUcmlnZ2VyOiAnZ2V0UG9zaXRpb24nXG4gICAgICAgIH0sXG4gICAgICAgIGFnZ3JlZ2F0b3I6IHtcbiAgICAgICAgICBwcm9wOiAnZ3JpZEFnZ3JlZ2F0b3InXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB1cGRhdGVyOiBnZXRBZ2dyZWdhdGVkRGF0YVxuICAgIH1cbiAgXVxufTtcblxuZnVuY3Rpb24gZ2V0U3ViTGF5ZXJBY2Nlc3NvcihkaW1lbnNpb25TdGF0ZSwgZGltZW5zaW9uLCBsYXllclByb3BzKSB7XG4gIHJldHVybiBjZWxsID0+IHtcbiAgICBjb25zdCB7c29ydGVkQmlucywgc2NhbGVGdW5jfSA9IGRpbWVuc2lvblN0YXRlO1xuICAgIGNvbnN0IGJpbiA9IHNvcnRlZEJpbnMuYmluTWFwW2NlbGwuaW5kZXhdO1xuXG4gICAgaWYgKGJpbiAmJiBiaW4uY291bnRzID09PSAwKSB7XG4gICAgICAvLyBubyBwb2ludHMgbGVmdCBpbiBiaW4gYWZ0ZXIgZmlsdGVyaW5nXG4gICAgICByZXR1cm4gZGltZW5zaW9uLm51bGxWYWx1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBjdiA9IGJpbiAmJiBiaW4udmFsdWU7XG4gICAgY29uc3QgZG9tYWluID0gc2NhbGVGdW5jLmRvbWFpbigpO1xuXG4gICAgY29uc3QgaXNWYWx1ZUluRG9tYWluID0gY3YgPj0gZG9tYWluWzBdICYmIGN2IDw9IGRvbWFpbltkb21haW4ubGVuZ3RoIC0gMV07XG5cbiAgICAvLyBpZiBjZWxsIHZhbHVlIGlzIG91dHNpZGUgZG9tYWluLCBzZXQgYWxwaGEgdG8gMFxuICAgIHJldHVybiBpc1ZhbHVlSW5Eb21haW4gPyBzY2FsZUZ1bmMoY3YpIDogZGltZW5zaW9uLm51bGxWYWx1ZTtcbiAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRDb2xvckRpbWVuc2lvbiA9IHtcbiAga2V5OiAnZmlsbENvbG9yJyxcbiAgYWNjZXNzb3I6ICdnZXRGaWxsQ29sb3InLFxuICBnZXRQaWNraW5nSW5mbzogKGRpbWVuc2lvblN0YXRlLCBjZWxsKSA9PiB7XG4gICAgY29uc3Qge3NvcnRlZEJpbnN9ID0gZGltZW5zaW9uU3RhdGU7XG4gICAgY29uc3QgY29sb3JWYWx1ZSA9IHNvcnRlZEJpbnMuYmluTWFwW2NlbGwuaW5kZXhdICYmIHNvcnRlZEJpbnMuYmluTWFwW2NlbGwuaW5kZXhdLnZhbHVlO1xuICAgIHJldHVybiB7Y29sb3JWYWx1ZX07XG4gIH0sXG4gIG51bGxWYWx1ZTogWzAsIDAsIDAsIDBdLFxuICB1cGRhdGVTdGVwczogW1xuICAgIHtcbiAgICAgIGtleTogJ2dldFZhbHVlJyxcbiAgICAgIHRyaWdnZXJzOiB7XG4gICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgcHJvcDogJ2dldENvbG9yVmFsdWUnLFxuICAgICAgICAgIHVwZGF0ZVRyaWdnZXI6ICdnZXRDb2xvclZhbHVlJ1xuICAgICAgICB9LFxuICAgICAgICB3ZWlnaHQ6IHtcbiAgICAgICAgICBwcm9wOiAnZ2V0Q29sb3JXZWlnaHQnLFxuICAgICAgICAgIHVwZGF0ZVRyaWdnZXI6ICdnZXRDb2xvcldlaWdodCdcbiAgICAgICAgfSxcbiAgICAgICAgYWdncmVnYXRpb246IHtcbiAgICAgICAgICBwcm9wOiAnY29sb3JBZ2dyZWdhdGlvbidcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHVwZGF0ZXI6IGdldEdldFZhbHVlXG4gICAgfSxcbiAgICB7XG4gICAgICBrZXk6ICdnZXRCaW5zJyxcbiAgICAgIHRyaWdnZXJzOiB7XG4gICAgICAgIF9maWx0ZXJEYXRhOiB7XG4gICAgICAgICAgcHJvcDogJ19maWx0ZXJEYXRhJyxcbiAgICAgICAgICB1cGRhdGVUcmlnZ2VyOiAnX2ZpbHRlckRhdGEnXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB1cGRhdGVyOiBnZXREaW1lbnNpb25Tb3J0ZWRCaW5zXG4gICAgfSxcbiAgICB7XG4gICAgICBrZXk6ICdnZXREb21haW4nLFxuICAgICAgdHJpZ2dlcnM6IHtcbiAgICAgICAgbG93ZXJQZXJjZW50aWxlOiB7XG4gICAgICAgICAgcHJvcDogJ2xvd2VyUGVyY2VudGlsZSdcbiAgICAgICAgfSxcbiAgICAgICAgdXBwZXJQZXJjZW50aWxlOiB7XG4gICAgICAgICAgcHJvcDogJ3VwcGVyUGVyY2VudGlsZSdcbiAgICAgICAgfSxcbiAgICAgICAgc2NhbGVUeXBlOiB7cHJvcDogJ2NvbG9yU2NhbGVUeXBlJ31cbiAgICAgIH0sXG4gICAgICB1cGRhdGVyOiBnZXREaW1lbnNpb25WYWx1ZURvbWFpblxuICAgIH0sXG4gICAge1xuICAgICAga2V5OiAnZ2V0U2NhbGVGdW5jJyxcbiAgICAgIHRyaWdnZXJzOiB7XG4gICAgICAgIGRvbWFpbjoge3Byb3A6ICdjb2xvckRvbWFpbid9LFxuICAgICAgICByYW5nZToge3Byb3A6ICdjb2xvclJhbmdlJ30sXG4gICAgICAgIHNjYWxlVHlwZToge3Byb3A6ICdjb2xvclNjYWxlVHlwZSd9XG4gICAgICB9LFxuICAgICAgb25TZXQ6IHtcbiAgICAgICAgcHJvcHM6ICdvblNldENvbG9yRG9tYWluJ1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZXI6IGdldERpbWVuc2lvblNjYWxlXG4gICAgfVxuICBdLFxuICBnZXRTdWJMYXllckFjY2Vzc29yXG59O1xuXG5leHBvcnQgY29uc3QgZGVmYXVsdEVsZXZhdGlvbkRpbWVuc2lvbiA9IHtcbiAga2V5OiAnZWxldmF0aW9uJyxcbiAgYWNjZXNzb3I6ICdnZXRFbGV2YXRpb24nLFxuICBnZXRQaWNraW5nSW5mbzogKGRpbWVuc2lvblN0YXRlLCBjZWxsKSA9PiB7XG4gICAgY29uc3Qge3NvcnRlZEJpbnN9ID0gZGltZW5zaW9uU3RhdGU7XG4gICAgY29uc3QgZWxldmF0aW9uVmFsdWUgPSBzb3J0ZWRCaW5zLmJpbk1hcFtjZWxsLmluZGV4XSAmJiBzb3J0ZWRCaW5zLmJpbk1hcFtjZWxsLmluZGV4XS52YWx1ZTtcbiAgICByZXR1cm4ge2VsZXZhdGlvblZhbHVlfTtcbiAgfSxcbiAgbnVsbFZhbHVlOiAtMSxcbiAgdXBkYXRlU3RlcHM6IFtcbiAgICB7XG4gICAgICBrZXk6ICdnZXRWYWx1ZScsXG4gICAgICB0cmlnZ2Vyczoge1xuICAgICAgICB2YWx1ZToge1xuICAgICAgICAgIHByb3A6ICdnZXRFbGV2YXRpb25WYWx1ZScsXG4gICAgICAgICAgdXBkYXRlVHJpZ2dlcjogJ2dldEVsZXZhdGlvblZhbHVlJ1xuICAgICAgICB9LFxuICAgICAgICB3ZWlnaHQ6IHtcbiAgICAgICAgICBwcm9wOiAnZ2V0RWxldmF0aW9uV2VpZ2h0JyxcbiAgICAgICAgICB1cGRhdGVUcmlnZ2VyOiAnZ2V0RWxldmF0aW9uV2VpZ2h0J1xuICAgICAgICB9LFxuICAgICAgICBhZ2dyZWdhdGlvbjoge1xuICAgICAgICAgIHByb3A6ICdlbGV2YXRpb25BZ2dyZWdhdGlvbidcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHVwZGF0ZXI6IGdldEdldFZhbHVlXG4gICAgfSxcbiAgICB7XG4gICAgICBrZXk6ICdnZXRCaW5zJyxcbiAgICAgIHRyaWdnZXJzOiB7XG4gICAgICAgIF9maWx0ZXJEYXRhOiB7XG4gICAgICAgICAgcHJvcDogJ19maWx0ZXJEYXRhJyxcbiAgICAgICAgICB1cGRhdGVUcmlnZ2VyOiAnX2ZpbHRlckRhdGEnXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB1cGRhdGVyOiBnZXREaW1lbnNpb25Tb3J0ZWRCaW5zXG4gICAgfSxcbiAgICB7XG4gICAgICBrZXk6ICdnZXREb21haW4nLFxuICAgICAgdHJpZ2dlcnM6IHtcbiAgICAgICAgbG93ZXJQZXJjZW50aWxlOiB7XG4gICAgICAgICAgcHJvcDogJ2VsZXZhdGlvbkxvd2VyUGVyY2VudGlsZSdcbiAgICAgICAgfSxcbiAgICAgICAgdXBwZXJQZXJjZW50aWxlOiB7XG4gICAgICAgICAgcHJvcDogJ2VsZXZhdGlvblVwcGVyUGVyY2VudGlsZSdcbiAgICAgICAgfSxcbiAgICAgICAgc2NhbGVUeXBlOiB7cHJvcDogJ2VsZXZhdGlvblNjYWxlVHlwZSd9XG4gICAgICB9LFxuICAgICAgdXBkYXRlcjogZ2V0RGltZW5zaW9uVmFsdWVEb21haW5cbiAgICB9LFxuICAgIHtcbiAgICAgIGtleTogJ2dldFNjYWxlRnVuYycsXG4gICAgICB0cmlnZ2Vyczoge1xuICAgICAgICBkb21haW46IHtwcm9wOiAnZWxldmF0aW9uRG9tYWluJ30sXG4gICAgICAgIHJhbmdlOiB7cHJvcDogJ2VsZXZhdGlvblJhbmdlJ30sXG4gICAgICAgIHNjYWxlVHlwZToge3Byb3A6ICdlbGV2YXRpb25TY2FsZVR5cGUnfVxuICAgICAgfSxcbiAgICAgIG9uU2V0OiB7XG4gICAgICAgIHByb3BzOiAnb25TZXRFbGV2YXRpb25Eb21haW4nXG4gICAgICB9LFxuICAgICAgdXBkYXRlcjogZ2V0RGltZW5zaW9uU2NhbGVcbiAgICB9XG4gIF0sXG4gIGdldFN1YkxheWVyQWNjZXNzb3Jcbn07XG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0RGltZW5zaW9ucyA9IFtkZWZhdWx0Q29sb3JEaW1lbnNpb24sIGRlZmF1bHRFbGV2YXRpb25EaW1lbnNpb25dO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDUFVBZ2dyZWdhdG9yIHtcbiAgY29uc3RydWN0b3Iob3B0cyA9IHt9KSB7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGxheWVyRGF0YToge30sXG4gICAgICBkaW1lbnNpb25zOiB7XG4gICAgICAgIC8vIGNvbG9yOiB7XG4gICAgICAgIC8vICAgZ2V0VmFsdWU6IG51bGwsXG4gICAgICAgIC8vICAgZG9tYWluOiBudWxsLFxuICAgICAgICAvLyAgIHNvcnRlZEJpbnM6IG51bGwsXG4gICAgICAgIC8vICAgc2NhbGVGdW5jOiBub3BcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gZWxldmF0aW9uOiB7XG4gICAgICAgIC8vICAgZ2V0VmFsdWU6IG51bGwsXG4gICAgICAgIC8vICAgZG9tYWluOiBudWxsLFxuICAgICAgICAvLyAgIHNvcnRlZEJpbnM6IG51bGwsXG4gICAgICAgIC8vICAgc2NhbGVGdW5jOiBub3BcbiAgICAgICAgLy8gfVxuICAgICAgfSxcbiAgICAgIC4uLm9wdHMuaW5pdGlhbFN0YXRlXG4gICAgfTtcbiAgICB0aGlzLmRpbWVuc2lvblVwZGF0ZXJzID0ge307XG4gICAgdGhpcy5hZ2dyZWdhdGlvblVwZGF0ZXIgPSB7fTtcblxuICAgIHRoaXMuX2FkZERpbWVuc2lvbihvcHRzLmRpbWVuc2lvbnMgfHwgZGVmYXVsdERpbWVuc2lvbnMpO1xuICAgIHRoaXMuX2FkZEFnZ3JlZ2F0aW9uKG9wdHMuYWdncmVnYXRpb24gfHwgZGVmYXVsdEFnZ3JlZ2F0aW9uKTtcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0RGltZW5zaW9ucygpIHtcbiAgICByZXR1cm4gZGVmYXVsdERpbWVuc2lvbnM7XG4gIH1cblxuICB1cGRhdGVBbGxEaW1lbnNpb25zKHByb3BzKSB7XG4gICAgbGV0IGRpbWVuc2lvbkNoYW5nZXMgPSBbXTtcbiAgICAvLyB1cGRhdGUgYWxsIGRpbWVuc2lvbnNcbiAgICBmb3IgKGNvbnN0IGRpbSBpbiB0aGlzLmRpbWVuc2lvblVwZGF0ZXJzKSB7XG4gICAgICBjb25zdCB1cGRhdGVycyA9IHRoaXMuX2FjY3VtdWxhdGVVcGRhdGVycygwLCBwcm9wcywgdGhpcy5kaW1lbnNpb25VcGRhdGVyc1tkaW1dKTtcbiAgICAgIGRpbWVuc2lvbkNoYW5nZXMgPSBkaW1lbnNpb25DaGFuZ2VzLmNvbmNhdCh1cGRhdGVycyk7XG4gICAgfVxuXG4gICAgZGltZW5zaW9uQ2hhbmdlcy5mb3JFYWNoKGYgPT4gdHlwZW9mIGYgPT09ICdmdW5jdGlvbicgJiYgZigpKTtcbiAgfVxuXG4gIHVwZGF0ZUFnZ3JlZ2F0aW9uKHByb3BzLCBhZ2dyZWdhdGlvblBhcmFtcykge1xuICAgIGNvbnN0IHVwZGF0ZXJzID0gdGhpcy5fYWNjdW11bGF0ZVVwZGF0ZXJzKDAsIHByb3BzLCB0aGlzLmFnZ3JlZ2F0aW9uVXBkYXRlcik7XG4gICAgdXBkYXRlcnMuZm9yRWFjaChmID0+IHR5cGVvZiBmID09PSAnZnVuY3Rpb24nICYmIGYoYWdncmVnYXRpb25QYXJhbXMpKTtcbiAgfVxuXG4gIHVwZGF0ZVN0YXRlKG9wdHMsIGFnZ3JlZ2F0aW9uUGFyYW1zKSB7XG4gICAgY29uc3Qge29sZFByb3BzLCBwcm9wcywgY2hhbmdlRmxhZ3N9ID0gb3B0cztcbiAgICBsZXQgZGltZW5zaW9uQ2hhbmdlcyA9IFtdO1xuXG4gICAgaWYgKGNoYW5nZUZsYWdzLmRhdGFDaGFuZ2VkKSB7XG4gICAgICAvLyBpZiBkYXRhIGNoYW5nZWQgdXBkYXRlIGV2ZXJ5dGhpbmdcbiAgICAgIHRoaXMudXBkYXRlQWdncmVnYXRpb24ocHJvcHMsIGFnZ3JlZ2F0aW9uUGFyYW1zKTtcbiAgICAgIHRoaXMudXBkYXRlQWxsRGltZW5zaW9ucyhwcm9wcyk7XG5cbiAgICAgIHJldHVybiB0aGlzLnN0YXRlO1xuICAgIH1cblxuICAgIGNvbnN0IGFnZ3JlZ2F0aW9uQ2hhbmdlcyA9IHRoaXMuX2dldEFnZ3JlZ2F0aW9uQ2hhbmdlcyhvbGRQcm9wcywgcHJvcHMsIGNoYW5nZUZsYWdzKTtcblxuICAgIGlmIChhZ2dyZWdhdGlvbkNoYW5nZXMgJiYgYWdncmVnYXRpb25DaGFuZ2VzLmxlbmd0aCkge1xuICAgICAgLy8gZ2V0IGFnZ3JlZ2F0ZWREYXRhXG4gICAgICBhZ2dyZWdhdGlvbkNoYW5nZXMuZm9yRWFjaChmID0+IHR5cGVvZiBmID09PSAnZnVuY3Rpb24nICYmIGYoYWdncmVnYXRpb25QYXJhbXMpKTtcbiAgICAgIHRoaXMudXBkYXRlQWxsRGltZW5zaW9ucyhwcm9wcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG9ubHkgdXBkYXRlIGRpbWVuc2lvbnNcbiAgICAgIGRpbWVuc2lvbkNoYW5nZXMgPSB0aGlzLl9nZXREaW1lbnNpb25DaGFuZ2VzKG9sZFByb3BzLCBwcm9wcywgY2hhbmdlRmxhZ3MpIHx8IFtdO1xuICAgICAgZGltZW5zaW9uQ2hhbmdlcy5mb3JFYWNoKGYgPT4gdHlwZW9mIGYgPT09ICdmdW5jdGlvbicgJiYgZigpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zdGF0ZTtcbiAgfVxuXG4gIC8vIFVwZGF0ZSBwcml2YXRlIHN0YXRlXG4gIHNldFN0YXRlKHVwZGF0ZU9iamVjdCkge1xuICAgIHRoaXMuc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB1cGRhdGVPYmplY3QpO1xuICB9XG5cbiAgLy8gVXBkYXRlIHByaXZhdGUgc3RhdGUuZGltZW5zaW9uc1xuICBfc2V0RGltZW5zaW9uU3RhdGUoa2V5LCB1cGRhdGVPYmplY3QpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGRpbWVuc2lvbnM6IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUuZGltZW5zaW9ucywge1xuICAgICAgICBba2V5XTogT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZS5kaW1lbnNpb25zW2tleV0sIHVwZGF0ZU9iamVjdClcbiAgICAgIH0pXG4gICAgfSk7XG4gIH1cblxuICBfYWRkQWdncmVnYXRpb24oYWdncmVnYXRpb24pIHtcbiAgICB0aGlzLmFnZ3JlZ2F0aW9uVXBkYXRlciA9IGFnZ3JlZ2F0aW9uO1xuICB9XG5cbiAgX2FkZERpbWVuc2lvbihkaW1lbnNpb25zID0gW10pIHtcbiAgICBkaW1lbnNpb25zLmZvckVhY2goZGltZW5zaW9uID0+IHtcbiAgICAgIGNvbnN0IHtrZXl9ID0gZGltZW5zaW9uO1xuICAgICAgdGhpcy5kaW1lbnNpb25VcGRhdGVyc1trZXldID0gZGltZW5zaW9uO1xuICAgIH0pO1xuICB9XG5cbiAgX25lZWRVcGRhdGVTdGVwKGRpbWVuc2lvblN0ZXAsIG9sZFByb3BzLCBwcm9wcywgY2hhbmdlRmxhZ3MpIHtcbiAgICAvLyB3aGV0aGVyIG5lZWQgdG8gdXBkYXRlIGN1cnJlbnQgZGltZW5zaW9uIHN0ZXBcbiAgICAvLyBkaW1lbnNpb24gc3RlcCBpcyB0aGUgdmFsdWUsIGRvbWFpbiwgc2NhbGVGdW5jdGlvbiBvZiBlYWNoIGRpbWVuc2lvblxuICAgIC8vIGVhY2ggc3RlcCBpcyBhbiBvYmplY3Qgd2l0aCBwcm9wZXJ0aWVzIGxpbmtzIHRvIGxheWVyIHByb3AgYW5kIHdoZXRoZXIgdGhlIHByb3AgaXNcbiAgICAvLyBjb250cm9sbGVkIGJ5IHVwZGF0ZVRyaWdnZXJzXG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMoZGltZW5zaW9uU3RlcC50cmlnZ2Vycykuc29tZShpdGVtID0+IHtcbiAgICAgIGlmIChpdGVtLnVwZGF0ZVRyaWdnZXIpIHtcbiAgICAgICAgLy8gY2hlY2sgYmFzZWQgb24gdXBkYXRlVHJpZ2dlcnMgY2hhbmdlIGZpcnN0XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgY2hhbmdlRmxhZ3MudXBkYXRlVHJpZ2dlcnNDaGFuZ2VkICYmXG4gICAgICAgICAgKGNoYW5nZUZsYWdzLnVwZGF0ZVRyaWdnZXJzQ2hhbmdlZC5hbGwgfHxcbiAgICAgICAgICAgIGNoYW5nZUZsYWdzLnVwZGF0ZVRyaWdnZXJzQ2hhbmdlZFtpdGVtLnVwZGF0ZVRyaWdnZXJdKVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgLy8gZmFsbGJhY2sgdG8gZGlyZWN0IGNvbXBhcmlzb25cbiAgICAgIHJldHVybiBvbGRQcm9wc1tpdGVtLnByb3BdICE9PSBwcm9wc1tpdGVtLnByb3BdO1xuICAgIH0pO1xuICB9XG5cbiAgX2FjY3VtdWxhdGVVcGRhdGVycyhzdGVwLCBwcm9wcywgZGltZW5zaW9uKSB7XG4gICAgY29uc3QgdXBkYXRlcnMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gc3RlcDsgaSA8IGRpbWVuc2lvbi51cGRhdGVTdGVwcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHR5cGVvZiBkaW1lbnNpb24udXBkYXRlU3RlcHNbaV0udXBkYXRlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB1cGRhdGVycy5wdXNoKFxuICAgICAgICAgIGRpbWVuc2lvbi51cGRhdGVTdGVwc1tpXS51cGRhdGVyLmJpbmQodGhpcywgZGltZW5zaW9uLnVwZGF0ZVN0ZXBzW2ldLCBwcm9wcywgZGltZW5zaW9uKVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB1cGRhdGVycztcbiAgfVxuXG4gIF9nZXRBbGxVcGRhdGVycyhkaW1lbnNpb24sIG9sZFByb3BzLCBwcm9wcywgY2hhbmdlRmxhZ3MpIHtcbiAgICBsZXQgdXBkYXRlcnMgPSBbXTtcbiAgICBjb25zdCBuZWVkVXBkYXRlU3RlcCA9IGRpbWVuc2lvbi51cGRhdGVTdGVwcy5maW5kSW5kZXgoc3RlcCA9PlxuICAgICAgdGhpcy5fbmVlZFVwZGF0ZVN0ZXAoc3RlcCwgb2xkUHJvcHMsIHByb3BzLCBjaGFuZ2VGbGFncylcbiAgICApO1xuXG4gICAgaWYgKG5lZWRVcGRhdGVTdGVwID4gLTEpIHtcbiAgICAgIHVwZGF0ZXJzID0gdXBkYXRlcnMuY29uY2F0KHRoaXMuX2FjY3VtdWxhdGVVcGRhdGVycyhuZWVkVXBkYXRlU3RlcCwgcHJvcHMsIGRpbWVuc2lvbikpO1xuICAgIH1cblxuICAgIHJldHVybiB1cGRhdGVycztcbiAgfVxuXG4gIF9nZXRBZ2dyZWdhdGlvbkNoYW5nZXMob2xkUHJvcHMsIHByb3BzLCBjaGFuZ2VGbGFncykge1xuICAgIGNvbnN0IHVwZGF0ZXJzID0gdGhpcy5fZ2V0QWxsVXBkYXRlcnModGhpcy5hZ2dyZWdhdGlvblVwZGF0ZXIsIG9sZFByb3BzLCBwcm9wcywgY2hhbmdlRmxhZ3MpO1xuICAgIHJldHVybiB1cGRhdGVycy5sZW5ndGggPyB1cGRhdGVycyA6IG51bGw7XG4gIH1cblxuICBfZ2V0RGltZW5zaW9uQ2hhbmdlcyhvbGRQcm9wcywgcHJvcHMsIGNoYW5nZUZsYWdzKSB7XG4gICAgbGV0IHVwZGF0ZXJzID0gW107XG5cbiAgICAvLyBnZXQgZGltZW5zaW9uIHRvIGJlIHVwZGF0ZWRcbiAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLmRpbWVuc2lvblVwZGF0ZXJzKSB7XG4gICAgICAvLyByZXR1cm4gdGhlIGZpcnN0IHRyaWdnZXJlZCB1cGRhdGVyIGZvciBlYWNoIGRpbWVuc2lvblxuICAgICAgY29uc3QgZGltZW5zaW9uID0gdGhpcy5kaW1lbnNpb25VcGRhdGVyc1trZXldO1xuICAgICAgY29uc3QgZGltZW5zaW9uVXBkYXRlcnMgPSB0aGlzLl9nZXRBbGxVcGRhdGVycyhkaW1lbnNpb24sIG9sZFByb3BzLCBwcm9wcywgY2hhbmdlRmxhZ3MpO1xuICAgICAgdXBkYXRlcnMgPSB1cGRhdGVycy5jb25jYXQoZGltZW5zaW9uVXBkYXRlcnMpO1xuICAgIH1cblxuICAgIHJldHVybiB1cGRhdGVycy5sZW5ndGggPyB1cGRhdGVycyA6IG51bGw7XG4gIH1cblxuICBnZXRVcGRhdGVUcmlnZ2Vycyhwcm9wcykge1xuICAgIGNvbnN0IF91cGRhdGVUcmlnZ2VycyA9IHByb3BzLnVwZGF0ZVRyaWdnZXJzIHx8IHt9O1xuICAgIGNvbnN0IHVwZGF0ZVRyaWdnZXJzID0ge307XG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLmRpbWVuc2lvblVwZGF0ZXJzKSB7XG4gICAgICBjb25zdCB7YWNjZXNzb3IsIHVwZGF0ZVN0ZXBzfSA9IHRoaXMuZGltZW5zaW9uVXBkYXRlcnNba2V5XTtcbiAgICAgIC8vIGZvbGQgZGltZW5zaW9uIHRyaWdnZXJzIGludG8gZWFjaCBhY2Nlc3NvclxuICAgICAgdXBkYXRlVHJpZ2dlcnNbYWNjZXNzb3JdID0ge307XG5cbiAgICAgIHVwZGF0ZVN0ZXBzLmZvckVhY2goc3RlcCA9PiB7XG4gICAgICAgIE9iamVjdC52YWx1ZXMoc3RlcC50cmlnZ2VycyB8fCBbXSkuZm9yRWFjaCgoe3Byb3AsIHVwZGF0ZVRyaWdnZXJ9KSA9PiB7XG4gICAgICAgICAgaWYgKHVwZGF0ZVRyaWdnZXIpIHtcbiAgICAgICAgICAgIC8vIGlmIHByb3AgaXMgYmFzZWQgb24gdXBkYXRlVHJpZ2dlciBlLmcuIGdldENvbG9yVmFsdWUsIGdldENvbG9yV2VpZ2h0XG4gICAgICAgICAgICAvLyBhbmQgdXBkYXRlVHJpZ2dlcnMgaXMgcGFzc2VkIGluIGZyb20gbGF5ZXIgcHJvcFxuICAgICAgICAgICAgLy8gZm9sZCB0aGUgdXBkYXRlVHJpZ2dlcnMgaW50byBhY2Nlc3NvclxuICAgICAgICAgICAgY29uc3QgZnJvbVByb3AgPSBfdXBkYXRlVHJpZ2dlcnNbdXBkYXRlVHJpZ2dlcl07XG4gICAgICAgICAgICBpZiAodHlwZW9mIGZyb21Qcm9wID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShmcm9tUHJvcCkpIHtcbiAgICAgICAgICAgICAgLy8gaWYgdXBkYXRlVHJpZ2dlciBpcyBhbiBvYmplY3Qgc3ByZWFkIGl0XG4gICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odXBkYXRlVHJpZ2dlcnNbYWNjZXNzb3JdLCBmcm9tUHJvcCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZyb21Qcm9wICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgdXBkYXRlVHJpZ2dlcnNbYWNjZXNzb3JdW3Byb3BdID0gZnJvbVByb3A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGlmIHByb3AgaXMgbm90IGJhc2VkIG9uIHVwZGF0ZVRyaWdnZXJcbiAgICAgICAgICAgIHVwZGF0ZVRyaWdnZXJzW2FjY2Vzc29yXVtwcm9wXSA9IHByb3BzW3Byb3BdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdXBkYXRlVHJpZ2dlcnM7XG4gIH1cblxuICBnZXRQaWNraW5nSW5mbyh7aW5mb30sIGxheWVyUHJvcHMpIHtcbiAgICBjb25zdCBpc1BpY2tlZCA9IGluZm8ucGlja2VkICYmIGluZm8uaW5kZXggPiAtMTtcbiAgICBsZXQgb2JqZWN0ID0gbnVsbDtcblxuICAgIGlmIChpc1BpY2tlZCkge1xuICAgICAgY29uc3QgY2VsbCA9IHRoaXMuc3RhdGUubGF5ZXJEYXRhLmRhdGFbaW5mby5pbmRleF07XG5cbiAgICAgIGxldCBiaW5JbmZvID0ge307XG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLmRpbWVuc2lvblVwZGF0ZXJzKSB7XG4gICAgICAgIGNvbnN0IHtnZXRQaWNraW5nSW5mb30gPSB0aGlzLmRpbWVuc2lvblVwZGF0ZXJzW2tleV07XG4gICAgICAgIGlmICh0eXBlb2YgZ2V0UGlja2luZ0luZm8gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBiaW5JbmZvID0gT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICAgIHt9LFxuICAgICAgICAgICAgYmluSW5mbyxcbiAgICAgICAgICAgIGdldFBpY2tpbmdJbmZvKHRoaXMuc3RhdGUuZGltZW5zaW9uc1trZXldLCBjZWxsLCBsYXllclByb3BzKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgb2JqZWN0ID0gT2JqZWN0LmFzc2lnbihiaW5JbmZvLCBjZWxsLCB7XG4gICAgICAgIHBvaW50czogY2VsbC5maWx0ZXJlZFBvaW50cyB8fCBjZWxsLnBvaW50c1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gYWRkIGJpbiAgYW5kICB0byBpbmZvXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oaW5mbywge1xuICAgICAgcGlja2VkOiBCb29sZWFuKG9iamVjdCksXG4gICAgICAvLyBvdmVycmlkZSBvYmplY3Qgd2l0aCBwaWNrZWQgY2VsbFxuICAgICAgb2JqZWN0XG4gICAgfSk7XG4gIH1cblxuICBnZXRBY2Nlc3NvcihkaW1lbnNpb25LZXksIGxheWVyUHJvcHMpIHtcbiAgICBpZiAoIXRoaXMuZGltZW5zaW9uVXBkYXRlcnMuaGFzT3duUHJvcGVydHkoZGltZW5zaW9uS2V5KSkge1xuICAgICAgcmV0dXJuIG5vcDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZGltZW5zaW9uVXBkYXRlcnNbZGltZW5zaW9uS2V5XS5nZXRTdWJMYXllckFjY2Vzc29yKFxuICAgICAgdGhpcy5zdGF0ZS5kaW1lbnNpb25zW2RpbWVuc2lvbktleV0sXG4gICAgICB0aGlzLmRpbWVuc2lvblVwZGF0ZXJzW2RpbWVuc2lvbktleV0sXG4gICAgICBsYXllclByb3BzXG4gICAgKTtcbiAgfVxufVxuXG5DUFVBZ2dyZWdhdG9yLmdldERpbWVuc2lvblNjYWxlID0gZ2V0RGltZW5zaW9uU2NhbGU7XG4iXX0=