"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeFilters = mergeFilters;
exports.createLayerFromConfig = createLayerFromConfig;
exports.serializeLayer = serializeLayer;
exports.mergeLayers = mergeLayers;
exports.insertLayerAtRightOrder = insertLayerAtRightOrder;
exports.mergeInteractions = mergeInteractions;
exports.mergeSplitMaps = mergeSplitMaps;
exports.mergeInteractionTooltipConfig = mergeInteractionTooltipConfig;
exports.mergeLayerBlending = mergeLayerBlending;
exports.mergeAnimationConfig = mergeAnimationConfig;
exports.validateSavedLayerColumns = validateSavedLayerColumns;
exports.validateColumn = validateColumn;
exports.validateSavedTextLabel = validateSavedTextLabel;
exports.validateSavedVisualChannels = validateSavedVisualChannels;
exports.validateLayersByDatasets = validateLayersByDatasets;
exports.validateLayerWithData = validateLayerWithData;
exports.isValidMerger = isValidMerger;
exports.VIS_STATE_MERGERS = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _lodash = _interopRequireDefault(require("lodash.uniq"));

var _lodash2 = _interopRequireDefault(require("lodash.pick"));

var _lodash3 = _interopRequireDefault(require("lodash.flattendeep"));

var _utils = require("../utils/utils");

var _filterUtils = require("../utils/filter-utils");

var _splitMapUtils = require("../utils/split-map-utils");

var _gpuFilterUtils = require("../utils/gpu-filter-utils");

var _defaultSettings = require("../constants/default-settings");

var _schemas = require("../schemas");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * Merge loaded filters with current state, if no fields or data are loaded
 * save it for later
 *
 * @type {typeof import('./vis-state-merger').mergeFilters}
 */
function mergeFilters(state, filtersToMerge) {
  if (!Array.isArray(filtersToMerge) || !filtersToMerge.length) {
    return state;
  }

  var _validateFiltersUpdat = (0, _filterUtils.validateFiltersUpdateDatasets)(state, filtersToMerge),
      validated = _validateFiltersUpdat.validated,
      failed = _validateFiltersUpdat.failed,
      updatedDatasets = _validateFiltersUpdat.updatedDatasets; // merge filter with existing


  var updatedFilters = [].concat((0, _toConsumableArray2["default"])(state.filters || []), (0, _toConsumableArray2["default"])(validated));
  updatedFilters = (0, _gpuFilterUtils.resetFilterGpuMode)(updatedFilters);
  updatedFilters = (0, _gpuFilterUtils.assignGpuChannels)(updatedFilters); // filter data

  var datasetsToFilter = (0, _lodash["default"])((0, _lodash3["default"])(validated.map(function (f) {
    return f.dataId;
  })));
  var filtered = (0, _filterUtils.applyFiltersToDatasets)(datasetsToFilter, updatedDatasets, updatedFilters, state.layers);
  return _objectSpread(_objectSpread({}, state), {}, {
    filters: updatedFilters,
    datasets: filtered,
    filterToBeMerged: [].concat((0, _toConsumableArray2["default"])(state.filterToBeMerged), (0, _toConsumableArray2["default"])(failed))
  });
}

function createLayerFromConfig(state, layerConfig) {
  // first validate config against dataset
  var _validateLayersByData = validateLayersByDatasets(state.datasets, state.layerClasses, [layerConfig]),
      validated = _validateLayersByData.validated,
      failed = _validateLayersByData.failed;

  if (failed.length || !validated.length) {
    // failed
    return null;
  }

  var newLayer = validated[0];
  newLayer.updateLayerDomain(state.datasets);
  return newLayer;
}

function serializeLayer(newLayer) {
  var savedVisState = _schemas.visStateSchema[_schemas.CURRENT_VERSION].save({
    layers: [newLayer],
    layerOrder: [0]
  }).visState;

  var loadedLayer = _schemas.visStateSchema[_schemas.CURRENT_VERSION].load(savedVisState).visState.layers[0];

  return loadedLayer;
}
/**
 * Merge layers from de-serialized state, if no fields or data are loaded
 * save it for later
 *
 * @type {typeof import('./vis-state-merger').mergeLayers}
 */


function mergeLayers(state, layersToMerge, fromConfig) {
  var preserveLayerOrder = fromConfig ? layersToMerge.map(function (l) {
    return l.id;
  }) : state.preserveLayerOrder;

  if (!Array.isArray(layersToMerge) || !layersToMerge.length) {
    return state;
  }

  var _validateLayersByData2 = validateLayersByDatasets(state.datasets, state.layerClasses, layersToMerge),
      mergedLayer = _validateLayersByData2.validated,
      unmerged = _validateLayersByData2.failed; // put new layers in front of current layers


  var _insertLayerAtRightOr = insertLayerAtRightOrder(state.layers, mergedLayer, state.layerOrder, preserveLayerOrder),
      newLayerOrder = _insertLayerAtRightOr.newLayerOrder,
      newLayers = _insertLayerAtRightOr.newLayers;

  return _objectSpread(_objectSpread({}, state), {}, {
    layers: newLayers,
    layerOrder: newLayerOrder,
    preserveLayerOrder: preserveLayerOrder,
    layerToBeMerged: [].concat((0, _toConsumableArray2["default"])(state.layerToBeMerged), (0, _toConsumableArray2["default"])(unmerged))
  });
}

function insertLayerAtRightOrder(currentLayers, layersToInsert, currentOrder) {
  var preservedOrder = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  // perservedOrder ['a', 'b', 'c'];
  // layerOrder [1, 0, 3]
  // layerOrderMap ['a', 'c']
  var layerOrderQueue = currentOrder.map(function (i) {
    return currentLayers[i].id;
  });
  var newLayers = currentLayers;

  var _iterator = _createForOfIteratorHelper(layersToInsert),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var newLayer = _step.value;
      // find where to insert it
      var expectedIdx = preservedOrder.indexOf(newLayer.id); // if cant find place to insert, insert at the font

      var insertAt = 0;

      if (expectedIdx > 0) {
        // look for layer to insert after
        var i = expectedIdx + 1;
        var preceedIdx = null;

        while (i-- > 0 && preceedIdx === null) {
          var preceedLayer = preservedOrder[expectedIdx - 1];
          preceedIdx = layerOrderQueue.indexOf(preceedLayer);
        }

        if (preceedIdx > -1) {
          insertAt = preceedIdx + 1;
        }
      }

      layerOrderQueue = (0, _utils.arrayInsert)(layerOrderQueue, insertAt, newLayer.id);
      newLayers = newLayers.concat(newLayer);
    } // reconstruct layerOrder after insert

  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  var newLayerOrder = layerOrderQueue.map(function (id) {
    return newLayers.findIndex(function (l) {
      return l.id === id;
    });
  });
  return {
    newLayerOrder: newLayerOrder,
    newLayers: newLayers
  };
}
/**
 * Merge interactions with saved config
 *
 * @type {typeof import('./vis-state-merger').mergeInteractions}
 */


function mergeInteractions(state, interactionToBeMerged) {
  var merged = {};
  var unmerged = {};

  if (interactionToBeMerged) {
    Object.keys(interactionToBeMerged).forEach(function (key) {
      if (!state.interactionConfig[key]) {
        return;
      }

      var currentConfig = state.interactionConfig[key].config;

      var _ref = interactionToBeMerged[key] || {},
          enabled = _ref.enabled,
          configSaved = (0, _objectWithoutProperties2["default"])(_ref, ["enabled"]);

      var configToMerge = configSaved;

      if (key === 'tooltip') {
        var _mergeInteractionTool = mergeInteractionTooltipConfig(state, configSaved),
            mergedTooltip = _mergeInteractionTool.mergedTooltip,
            unmergedTooltip = _mergeInteractionTool.unmergedTooltip; // merge new dataset tooltips with original dataset tooltips


        configToMerge = {
          fieldsToShow: _objectSpread(_objectSpread({}, currentConfig.fieldsToShow), mergedTooltip)
        };

        if (Object.keys(unmergedTooltip).length) {
          unmerged.tooltip = {
            fieldsToShow: unmergedTooltip,
            enabled: enabled
          };
        }
      }

      merged[key] = _objectSpread(_objectSpread({}, state.interactionConfig[key]), {}, {
        enabled: enabled
      }, currentConfig ? {
        config: (0, _lodash2["default"])(_objectSpread(_objectSpread({}, currentConfig), configToMerge), Object.keys(currentConfig))
      } : {});
    });
  }

  return _objectSpread(_objectSpread({}, state), {}, {
    interactionConfig: _objectSpread(_objectSpread({}, state.interactionConfig), merged),
    interactionToBeMerged: unmerged
  });
}
/**
 * Merge splitMaps config with current visStete.
 * 1. if current map is split, but splitMap DOESNOT contain maps
 *    : don't merge anything
 * 2. if current map is NOT split, but splitMaps contain maps
 *    : add to splitMaps, and add current layers to splitMaps
 * @type {typeof import('./vis-state-merger').mergeInteractions}
 */


function mergeSplitMaps(state) {
  var splitMaps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var merged = (0, _toConsumableArray2["default"])(state.splitMaps);
  var unmerged = [];
  splitMaps.forEach(function (sm, i) {
    Object.entries(sm.layers).forEach(function (_ref2) {
      var _ref3 = (0, _slicedToArray2["default"])(_ref2, 2),
          id = _ref3[0],
          value = _ref3[1];

      // check if layer exists
      var pushTo = state.layers.find(function (l) {
        return l.id === id;
      }) ? merged : unmerged; // create map panel if current map is not split

      pushTo[i] = pushTo[i] || {
        layers: pushTo === merged ? (0, _splitMapUtils.getInitialMapLayersForSplitMap)(state.layers) : []
      };
      pushTo[i].layers = _objectSpread(_objectSpread({}, pushTo[i].layers), {}, (0, _defineProperty2["default"])({}, id, value));
    });
  });
  return _objectSpread(_objectSpread({}, state), {}, {
    splitMaps: merged,
    splitMapsToBeMerged: [].concat((0, _toConsumableArray2["default"])(state.splitMapsToBeMerged), unmerged)
  });
}
/**
 * Merge interactionConfig.tooltip with saved config,
 * validate fieldsToShow
 *
 * @param {object} state
 * @param {object} tooltipConfig
 * @return {object} - {mergedTooltip: {}, unmergedTooltip: {}}
 */


function mergeInteractionTooltipConfig(state) {
  var tooltipConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var unmergedTooltip = {};
  var mergedTooltip = {};

  if (!tooltipConfig.fieldsToShow || !Object.keys(tooltipConfig.fieldsToShow).length) {
    return {
      mergedTooltip: mergedTooltip,
      unmergedTooltip: unmergedTooltip
    };
  }

  for (var dataId in tooltipConfig.fieldsToShow) {
    if (!state.datasets[dataId]) {
      // is not yet loaded
      unmergedTooltip[dataId] = tooltipConfig.fieldsToShow[dataId];
    } else {
      (function () {
        // if dataset is loaded
        var allFields = state.datasets[dataId].fields.map(function (d) {
          return d.name;
        });
        var foundFieldsToShow = tooltipConfig.fieldsToShow[dataId].filter(function (field) {
          return allFields.includes(field.name);
        });
        mergedTooltip[dataId] = foundFieldsToShow;
      })();
    }
  }

  return {
    mergedTooltip: mergedTooltip,
    unmergedTooltip: unmergedTooltip
  };
}
/**
 * Merge layerBlending with saved
 *
 * @type {typeof import('./vis-state-merger').mergeLayerBlending}
 */


function mergeLayerBlending(state, layerBlending) {
  if (layerBlending && _defaultSettings.LAYER_BLENDINGS[layerBlending]) {
    return _objectSpread(_objectSpread({}, state), {}, {
      layerBlending: layerBlending
    });
  }

  return state;
}
/**
 * Merge animation config
 * @type {typeof import('./vis-state-merger').mergeAnimationConfig}
 */


function mergeAnimationConfig(state, animation) {
  if (animation && animation.currentTime) {
    return _objectSpread(_objectSpread({}, state), {}, {
      animationConfig: _objectSpread(_objectSpread(_objectSpread({}, state.animationConfig), animation), {}, {
        domain: null
      })
    });
  }

  return state;
}
/**
 * Validate saved layer columns with new data,
 * update fieldIdx based on new fields
 *
 * @param {Array<Object>} fields
 * @param {Object} savedCols
 * @param {Object} emptyCols
 * @return {null | Object} - validated columns or null
 */


function validateSavedLayerColumns(fields) {
  var savedCols = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var emptyCols = arguments.length > 2 ? arguments[2] : undefined;
  // Prepare columns for the validator
  var columns = {};

  var _loop = function _loop() {
    var key = _Object$keys[_i];
    columns[key] = _objectSpread({}, emptyCols[key]);
    var saved = savedCols[key];

    if (saved) {
      var fieldIdx = fields.findIndex(function (_ref4) {
        var name = _ref4.name;
        return name === saved;
      });

      if (fieldIdx > -1) {
        // update found columns
        columns[key].fieldIdx = fieldIdx;
        columns[key].value = saved;
      }
    }
  };

  for (var _i = 0, _Object$keys = Object.keys(emptyCols); _i < _Object$keys.length; _i++) {
    _loop();
  } // find actual column fieldIdx, in case it has changed


  var allColFound = Object.keys(columns).every(function (key) {
    return validateColumn(columns[key], columns, fields);
  });

  if (allColFound) {
    return columns;
  }

  return null;
}

function validateColumn(column, columns, allFields) {
  if (column.optional || column.value) {
    return true;
  }

  if (column.validator) {
    return column.validator(column, columns, allFields);
  }

  return false;
}
/**
 * Validate saved text label config with new data
 * refer to vis-state-schema.js TextLabelSchemaV1
 *
 * @param {Array<Object>} fields
 * @param {Object} savedTextLabel
 * @return {Object} - validated textlabel
 */


function validateSavedTextLabel(fields, _ref5, savedTextLabel) {
  var _ref6 = (0, _slicedToArray2["default"])(_ref5, 1),
      layerTextLabel = _ref6[0];

  var savedTextLabels = Array.isArray(savedTextLabel) ? savedTextLabel : [savedTextLabel]; // validate field

  return savedTextLabels.map(function (textLabel) {
    var field = textLabel.field ? fields.find(function (fd) {
      return Object.keys(textLabel.field).every(function (key) {
        return textLabel.field[key] === fd[key];
      });
    }) : null;
    return Object.keys(layerTextLabel).reduce(function (accu, key) {
      return _objectSpread(_objectSpread({}, accu), {}, (0, _defineProperty2["default"])({}, key, key === 'field' ? field : textLabel[key] || layerTextLabel[key]));
    }, {});
  });
}
/**
 * Validate saved visual channels config with new data,
 * refer to vis-state-schema.js VisualChannelSchemaV1
 * @type {typeof import('./vis-state-merger').validateSavedVisualChannels}
 */


function validateSavedVisualChannels(fields, newLayer, savedLayer) {
  Object.values(newLayer.visualChannels).forEach(function (_ref7) {
    var field = _ref7.field,
        scale = _ref7.scale,
        key = _ref7.key;
    var foundField;

    if (savedLayer.config) {
      if (savedLayer.config[field]) {
        foundField = fields.find(function (fd) {
          return savedLayer.config && fd.name === savedLayer.config[field].name;
        });
      }

      var foundChannel = _objectSpread(_objectSpread({}, foundField ? (0, _defineProperty2["default"])({}, field, foundField) : {}), savedLayer.config[scale] ? (0, _defineProperty2["default"])({}, scale, savedLayer.config[scale]) : {});

      if (Object.keys(foundChannel).length) {
        newLayer.updateLayerConfig(foundChannel);
      }

      newLayer.validateVisualChannel(key);
    }
  });
  return newLayer;
}

function validateLayersByDatasets(datasets, layerClasses, layers) {
  var validated = [];
  var failed = [];
  layers.forEach(function (layer) {
    var validateLayer;

    if (!layer || !layer.config) {
      validateLayer = null;
    } else if (datasets[layer.config.dataId]) {
      // datasets are already loaded
      validateLayer = validateLayerWithData(datasets[layer.config.dataId], layer, layerClasses);
    }

    if (validateLayer) {
      validated.push(validateLayer);
    } else {
      // datasets not yet loaded
      failed.push(layer);
    }
  });
  return {
    validated: validated,
    failed: failed
  };
}
/**
 * Validate saved layer config with new data,
 * update fieldIdx based on new fields
 * @type {typeof import('./vis-state-merger').validateLayerWithData}
 */


function validateLayerWithData(_ref10, savedLayer, layerClasses) {
  var fields = _ref10.fields,
      dataId = _ref10.id;
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var type = savedLayer.type; // layer doesnt have a valid type

  if (!type || !layerClasses.hasOwnProperty(type) || !savedLayer.config) {
    return null;
  }

  var newLayer = new layerClasses[type]({
    id: savedLayer.id,
    dataId: dataId,
    label: savedLayer.config.label,
    color: savedLayer.config.color,
    isVisible: savedLayer.config.isVisible,
    hidden: savedLayer.config.hidden,
    highlightColor: savedLayer.config.highlightColor
  }); // find column fieldIdx

  var columnConfig = newLayer.getLayerColumns();

  if (Object.keys(columnConfig).length) {
    var columns = validateSavedLayerColumns(fields, savedLayer.config.columns, columnConfig);

    if (columns) {
      newLayer.updateLayerConfig({
        columns: columns
      });
    } else if (!options.allowEmptyColumn) {
      return null;
    }
  } // visual channel field is saved to be {name, type}
  // find visual channel field by matching both name and type
  // refer to vis-state-schema.js VisualChannelSchemaV1


  newLayer = validateSavedVisualChannels(fields, newLayer, savedLayer);
  var textLabel = savedLayer.config.textLabel && newLayer.config.textLabel ? validateSavedTextLabel(fields, newLayer.config.textLabel, savedLayer.config.textLabel) : newLayer.config.textLabel; // copy visConfig over to emptyLayer to make sure it has all the props

  var visConfig = newLayer.copyLayerConfig(newLayer.config.visConfig, savedLayer.config.visConfig || {}, {
    shallowCopy: ['colorRange', 'strokeColorRange']
  });
  newLayer.updateLayerConfig({
    visConfig: visConfig,
    textLabel: textLabel
  });
  return newLayer;
}

function isValidMerger(merger) {
  return (0, _utils.isObject)(merger) && typeof merger.merge === 'function' && typeof merger.prop === 'string';
}

var VIS_STATE_MERGERS = [{
  merge: mergeLayers,
  prop: 'layers',
  toMergeProp: 'layerToBeMerged'
}, {
  merge: mergeFilters,
  prop: 'filters',
  toMergeProp: 'filterToBeMerged'
}, {
  merge: mergeInteractions,
  prop: 'interactionConfig',
  toMergeProp: 'interactionToBeMerged'
}, {
  merge: mergeLayerBlending,
  prop: 'layerBlending'
}, {
  merge: mergeSplitMaps,
  prop: 'splitMaps',
  toMergeProp: 'splitMapsToBeMerged'
}, {
  merge: mergeAnimationConfig,
  prop: 'animationConfig'
}];
exports.VIS_STATE_MERGERS = VIS_STATE_MERGERS;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy92aXMtc3RhdGUtbWVyZ2VyLmpzIl0sIm5hbWVzIjpbIm1lcmdlRmlsdGVycyIsInN0YXRlIiwiZmlsdGVyc1RvTWVyZ2UiLCJBcnJheSIsImlzQXJyYXkiLCJsZW5ndGgiLCJ2YWxpZGF0ZWQiLCJmYWlsZWQiLCJ1cGRhdGVkRGF0YXNldHMiLCJ1cGRhdGVkRmlsdGVycyIsImZpbHRlcnMiLCJkYXRhc2V0c1RvRmlsdGVyIiwibWFwIiwiZiIsImRhdGFJZCIsImZpbHRlcmVkIiwibGF5ZXJzIiwiZGF0YXNldHMiLCJmaWx0ZXJUb0JlTWVyZ2VkIiwiY3JlYXRlTGF5ZXJGcm9tQ29uZmlnIiwibGF5ZXJDb25maWciLCJ2YWxpZGF0ZUxheWVyc0J5RGF0YXNldHMiLCJsYXllckNsYXNzZXMiLCJuZXdMYXllciIsInVwZGF0ZUxheWVyRG9tYWluIiwic2VyaWFsaXplTGF5ZXIiLCJzYXZlZFZpc1N0YXRlIiwidmlzU3RhdGVTY2hlbWEiLCJDVVJSRU5UX1ZFUlNJT04iLCJzYXZlIiwibGF5ZXJPcmRlciIsInZpc1N0YXRlIiwibG9hZGVkTGF5ZXIiLCJsb2FkIiwibWVyZ2VMYXllcnMiLCJsYXllcnNUb01lcmdlIiwiZnJvbUNvbmZpZyIsInByZXNlcnZlTGF5ZXJPcmRlciIsImwiLCJpZCIsIm1lcmdlZExheWVyIiwidW5tZXJnZWQiLCJpbnNlcnRMYXllckF0UmlnaHRPcmRlciIsIm5ld0xheWVyT3JkZXIiLCJuZXdMYXllcnMiLCJsYXllclRvQmVNZXJnZWQiLCJjdXJyZW50TGF5ZXJzIiwibGF5ZXJzVG9JbnNlcnQiLCJjdXJyZW50T3JkZXIiLCJwcmVzZXJ2ZWRPcmRlciIsImxheWVyT3JkZXJRdWV1ZSIsImkiLCJleHBlY3RlZElkeCIsImluZGV4T2YiLCJpbnNlcnRBdCIsInByZWNlZWRJZHgiLCJwcmVjZWVkTGF5ZXIiLCJjb25jYXQiLCJmaW5kSW5kZXgiLCJtZXJnZUludGVyYWN0aW9ucyIsImludGVyYWN0aW9uVG9CZU1lcmdlZCIsIm1lcmdlZCIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwia2V5IiwiaW50ZXJhY3Rpb25Db25maWciLCJjdXJyZW50Q29uZmlnIiwiY29uZmlnIiwiZW5hYmxlZCIsImNvbmZpZ1NhdmVkIiwiY29uZmlnVG9NZXJnZSIsIm1lcmdlSW50ZXJhY3Rpb25Ub29sdGlwQ29uZmlnIiwibWVyZ2VkVG9vbHRpcCIsInVubWVyZ2VkVG9vbHRpcCIsImZpZWxkc1RvU2hvdyIsInRvb2x0aXAiLCJtZXJnZVNwbGl0TWFwcyIsInNwbGl0TWFwcyIsInNtIiwiZW50cmllcyIsInZhbHVlIiwicHVzaFRvIiwiZmluZCIsInNwbGl0TWFwc1RvQmVNZXJnZWQiLCJ0b29sdGlwQ29uZmlnIiwiYWxsRmllbGRzIiwiZmllbGRzIiwiZCIsIm5hbWUiLCJmb3VuZEZpZWxkc1RvU2hvdyIsImZpbHRlciIsImZpZWxkIiwiaW5jbHVkZXMiLCJtZXJnZUxheWVyQmxlbmRpbmciLCJsYXllckJsZW5kaW5nIiwiTEFZRVJfQkxFTkRJTkdTIiwibWVyZ2VBbmltYXRpb25Db25maWciLCJhbmltYXRpb24iLCJjdXJyZW50VGltZSIsImFuaW1hdGlvbkNvbmZpZyIsImRvbWFpbiIsInZhbGlkYXRlU2F2ZWRMYXllckNvbHVtbnMiLCJzYXZlZENvbHMiLCJlbXB0eUNvbHMiLCJjb2x1bW5zIiwic2F2ZWQiLCJmaWVsZElkeCIsImFsbENvbEZvdW5kIiwiZXZlcnkiLCJ2YWxpZGF0ZUNvbHVtbiIsImNvbHVtbiIsIm9wdGlvbmFsIiwidmFsaWRhdG9yIiwidmFsaWRhdGVTYXZlZFRleHRMYWJlbCIsInNhdmVkVGV4dExhYmVsIiwibGF5ZXJUZXh0TGFiZWwiLCJzYXZlZFRleHRMYWJlbHMiLCJ0ZXh0TGFiZWwiLCJmZCIsInJlZHVjZSIsImFjY3UiLCJ2YWxpZGF0ZVNhdmVkVmlzdWFsQ2hhbm5lbHMiLCJzYXZlZExheWVyIiwidmFsdWVzIiwidmlzdWFsQ2hhbm5lbHMiLCJzY2FsZSIsImZvdW5kRmllbGQiLCJmb3VuZENoYW5uZWwiLCJ1cGRhdGVMYXllckNvbmZpZyIsInZhbGlkYXRlVmlzdWFsQ2hhbm5lbCIsImxheWVyIiwidmFsaWRhdGVMYXllciIsInZhbGlkYXRlTGF5ZXJXaXRoRGF0YSIsInB1c2giLCJvcHRpb25zIiwidHlwZSIsImhhc093blByb3BlcnR5IiwibGFiZWwiLCJjb2xvciIsImlzVmlzaWJsZSIsImhpZGRlbiIsImhpZ2hsaWdodENvbG9yIiwiY29sdW1uQ29uZmlnIiwiZ2V0TGF5ZXJDb2x1bW5zIiwiYWxsb3dFbXB0eUNvbHVtbiIsInZpc0NvbmZpZyIsImNvcHlMYXllckNvbmZpZyIsInNoYWxsb3dDb3B5IiwiaXNWYWxpZE1lcmdlciIsIm1lcmdlciIsIm1lcmdlIiwicHJvcCIsIlZJU19TVEFURV9NRVJHRVJTIiwidG9NZXJnZVByb3AiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLFNBQVNBLFlBQVQsQ0FBc0JDLEtBQXRCLEVBQTZCQyxjQUE3QixFQUE2QztBQUNsRCxNQUFJLENBQUNDLEtBQUssQ0FBQ0MsT0FBTixDQUFjRixjQUFkLENBQUQsSUFBa0MsQ0FBQ0EsY0FBYyxDQUFDRyxNQUF0RCxFQUE4RDtBQUM1RCxXQUFPSixLQUFQO0FBQ0Q7O0FBSGlELDhCQUtMLGdEQUE4QkEsS0FBOUIsRUFBcUNDLGNBQXJDLENBTEs7QUFBQSxNQUszQ0ksU0FMMkMseUJBSzNDQSxTQUwyQztBQUFBLE1BS2hDQyxNQUxnQyx5QkFLaENBLE1BTGdDO0FBQUEsTUFLeEJDLGVBTHdCLHlCQUt4QkEsZUFMd0IsRUFPbEQ7OztBQUNBLE1BQUlDLGNBQWMsaURBQVFSLEtBQUssQ0FBQ1MsT0FBTixJQUFpQixFQUF6Qix1Q0FBaUNKLFNBQWpDLEVBQWxCO0FBQ0FHLEVBQUFBLGNB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QU1DLGlCQUFpQixHQUFHLENBQy9CO0FBQUNGLEVBQUFBLEtBQUssRUFBRXJILFdBQVI7QUFBcUJzSCxFQUFBQSxJQUFJLEVBQUUsUUFBM0I7QUFBcUNFLEVBQUFBLFdBQVcsRUFBRTtBQUFsRCxDQUQrQixFQUUvQjtBQUFDSCxFQUFBQSxLQUFLLEVBQUV2SixZQUFSO0FBQXNCd0osRUFBQUEsSUFBSSxFQUFFLFNBQTVCO0FBQXVDRSxFQUFBQSxXQUFXLEVBQUU7QUFBcEQsQ0FGK0IsRUFHL0I7QUFBQ0gsRUFBQUEsS0FBSyxFQUFFNUYsaUJBQVI7QUFBMkI2RixFQUFBQSxJQUFJLEVBQUUsbUJBQWpDO0FBQXNERSxFQUFBQSxXQUFXLEVBQUU7QUFBbkUsQ0FIK0IsRUFJL0I7QUFBQ0gsRUFBQUEsS0FBSyxFQUFFekQsa0JBQVI7QUFBNEIwRCxFQUFBQSxJQUFJLEVBQUU7QUFBbEMsQ0FKK0IsRUFLL0I7QUFBQ0QsRUFBQUEsS0FBSyxFQUFFMUUsY0FBUjtBQUF3QjJFLEVBQUFBLElBQUksRUFBRSxXQUE5QjtBQUEyQ0UsRUFBQUEsV0FBVyxFQUFFO0FBQXhELENBTCtCLEVBTS9CO0FBQUNILEVBQUFBLEtBQUssRUFBRXRELG9CQUFSO0FBQThCdUQsRUFBQUEsSUFBSSxFQUFFO0FBQXBDLENBTitCLENBQTFCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHVuaXEgZnJvbSAnbG9kYXNoLnVuaXEnO1xuaW1wb3J0IHBpY2sgZnJvbSAnbG9kYXNoLnBpY2snO1xuaW1wb3J0IGZsYXR0ZW5EZWVwIGZyb20gJ2xvZGFzaC5mbGF0dGVuZGVlcCc7XG5pbXBvcnQge2lzT2JqZWN0LCBhcnJheUluc2VydH0gZnJvbSAndXRpbHMvdXRpbHMnO1xuaW1wb3J0IHthcHBseUZpbHRlcnNUb0RhdGFzZXRzLCB2YWxpZGF0ZUZpbHRlcnNVcGRhdGVEYXRhc2V0c30gZnJvbSAndXRpbHMvZmlsdGVyLXV0aWxzJztcblxuaW1wb3J0IHtnZXRJbml0aWFsTWFwTGF5ZXJzRm9yU3BsaXRNYXB9IGZyb20gJ3V0aWxzL3NwbGl0LW1hcC11dGlscyc7XG5pbXBvcnQge3Jlc2V0RmlsdGVyR3B1TW9kZSwgYXNzaWduR3B1Q2hhbm5lbHN9IGZyb20gJ3V0aWxzL2dwdS1maWx0ZXItdXRpbHMnO1xuaW1wb3J0IHtMQVlFUl9CTEVORElOR1N9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCB7Q1VSUkVOVF9WRVJTSU9OLCB2aXNTdGF0ZVNjaGVtYX0gZnJvbSAnc2NoZW1hcyc7XG5cbi8qKlxuICogTWVyZ2UgbG9hZGVkIGZpbHRlcnMgd2l0aCBjdXJyZW50IHN0YXRlLCBpZiBubyBmaWVsZHMgb3IgZGF0YSBhcmUgbG9hZGVkXG4gKiBzYXZlIGl0IGZvciBsYXRlclxuICpcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1tZXJnZXInKS5tZXJnZUZpbHRlcnN9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZUZpbHRlcnMoc3RhdGUsIGZpbHRlcnNUb01lcmdlKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShmaWx0ZXJzVG9NZXJnZSkgfHwgIWZpbHRlcnNUb01lcmdlLmxlbmd0aCkge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIGNvbnN0IHt2YWxpZGF0ZWQsIGZhaWxlZCwgdXBkYXRlZERhdGFzZXRzfSA9IHZhbGlkYXRlRmlsdGVyc1VwZGF0ZURhdGFzZXRzKHN0YXRlLCBmaWx0ZXJzVG9NZXJnZSk7XG5cbiAgLy8gbWVyZ2UgZmlsdGVyIHdpdGggZXhpc3RpbmdcbiAgbGV0IHVwZGF0ZWRGaWx0ZXJzID0gWy4uLihzdGF0ZS5maWx0ZXJzIHx8IFtdKSwgLi4udmFsaWRhdGVkXTtcbiAgdXBkYXRlZEZpbHRlcnMgPSByZXNldEZpbHRlckdwdU1vZGUodXBkYXRlZEZpbHRlcnMpO1xuICB1cGRhdGVkRmlsdGVycyA9IGFzc2lnbkdwdUNoYW5uZWxzKHVwZGF0ZWRGaWx0ZXJzKTtcbiAgLy8gZmlsdGVyIGRhdGFcbiAgY29uc3QgZGF0YXNldHNUb0ZpbHRlciA9IHVuaXEoZmxhdHRlbkRlZXAodmFsaWRhdGVkLm1hcChmID0+IGYuZGF0YUlkKSkpO1xuXG4gIGNvbnN0IGZpbHRlcmVkID0gYXBwbHlGaWx0ZXJzVG9EYXRhc2V0cyhcbiAgICBkYXRhc2V0c1RvRmlsdGVyLFxuICAgIHVwZGF0ZWREYXRhc2V0cyxcbiAgICB1cGRhdGVkRmlsdGVycyxcbiAgICBzdGF0ZS5sYXllcnNcbiAgKTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGZpbHRlcnM6IHVwZGF0ZWRGaWx0ZXJzLFxuICAgIGRhdGFzZXRzOiBmaWx0ZXJlZCxcbiAgICBmaWx0ZXJUb0JlTWVyZ2VkOiBbLi4uc3RhdGUuZmlsdGVyVG9CZU1lcmdlZCwgLi4uZmFpbGVkXVxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTGF5ZXJGcm9tQ29uZmlnKHN0YXRlLCBsYXllckNvbmZpZykge1xuICAvLyBmaXJzdCB2YWxpZGF0ZSBjb25maWcgYWdhaW5zdCBkYXRhc2V0XG4gIGNvbnN0IHt2YWxpZGF0ZWQsIGZhaWxlZH0gPSB2YWxpZGF0ZUxheWVyc0J5RGF0YXNldHMoc3RhdGUuZGF0YXNldHMsIHN0YXRlLmxheWVyQ2xhc3NlcywgW1xuICAgIGxheWVyQ29uZmlnXG4gIF0pO1xuXG4gIGlmIChmYWlsZWQubGVuZ3RoIHx8ICF2YWxpZGF0ZWQubGVuZ3RoKSB7XG4gICAgLy8gZmFpbGVkXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBuZXdMYXllciA9IHZhbGlkYXRlZFswXTtcbiAgbmV3TGF5ZXIudXBkYXRlTGF5ZXJEb21haW4oc3RhdGUuZGF0YXNldHMpO1xuICByZXR1cm4gbmV3TGF5ZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXJpYWxpemVMYXllcihuZXdMYXllcikge1xuICBjb25zdCBzYXZlZFZpc1N0YXRlID0gdmlzU3RhdGVTY2hlbWFbQ1VSUkVOVF9WRVJTSU9OXS5zYXZlKHtcbiAgICBsYXllcnM6IFtuZXdMYXllcl0sXG4gICAgbGF5ZXJPcmRlcjogWzBdXG4gIH0pLnZpc1N0YXRlO1xuICBjb25zdCBsb2FkZWRMYXllciA9IHZpc1N0YXRlU2NoZW1hW0NVUlJFTlRfVkVSU0lPTl0ubG9hZChzYXZlZFZpc1N0YXRlKS52aXNTdGF0ZS5sYXllcnNbMF07XG4gIHJldHVybiBsb2FkZWRMYXllcjtcbn1cblxuLyoqXG4gKiBNZXJnZSBsYXllcnMgZnJvbSBkZS1zZXJpYWxpemVkIHN0YXRlLCBpZiBubyBmaWVsZHMgb3IgZGF0YSBhcmUgbG9hZGVkXG4gKiBzYXZlIGl0IGZvciBsYXRlclxuICpcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1tZXJnZXInKS5tZXJnZUxheWVyc31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlTGF5ZXJzKHN0YXRlLCBsYXllcnNUb01lcmdlLCBmcm9tQ29uZmlnKSB7XG4gIGNvbnN0IHByZXNlcnZlTGF5ZXJPcmRlciA9IGZyb21Db25maWcgPyBsYXllcnNUb01lcmdlLm1hcChsID0+IGwuaWQpIDogc3RhdGUucHJlc2VydmVMYXllck9yZGVyO1xuXG4gIGlmICghQXJyYXkuaXNBcnJheShsYXllcnNUb01lcmdlKSB8fCAhbGF5ZXJzVG9NZXJnZS5sZW5ndGgpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICBjb25zdCB7dmFsaWRhdGVkOiBtZXJnZWRMYXllciwgZmFpbGVkOiB1bm1lcmdlZH0gPSB2YWxpZGF0ZUxheWVyc0J5RGF0YXNldHMoXG4gICAgc3RhdGUuZGF0YXNldHMsXG4gICAgc3RhdGUubGF5ZXJDbGFzc2VzLFxuICAgIGxheWVyc1RvTWVyZ2VcbiAgKTtcblxuICAvLyBwdXQgbmV3IGxheWVycyBpbiBmcm9udCBvZiBjdXJyZW50IGxheWVyc1xuICBjb25zdCB7bmV3TGF5ZXJPcmRlciwgbmV3TGF5ZXJzfSA9IGluc2VydExheWVyQXRSaWdodE9yZGVyKFxuICAgIHN0YXRlLmxheWVycyxcbiAgICBtZXJnZWRMYXllcixcbiAgICBzdGF0ZS5sYXllck9yZGVyLFxuICAgIHByZXNlcnZlTGF5ZXJPcmRlclxuICApO1xuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgbGF5ZXJzOiBuZXdMYXllcnMsXG4gICAgbGF5ZXJPcmRlcjogbmV3TGF5ZXJPcmRlcixcbiAgICBwcmVzZXJ2ZUxheWVyT3JkZXIsXG4gICAgbGF5ZXJUb0JlTWVyZ2VkOiBbLi4uc3RhdGUubGF5ZXJUb0JlTWVyZ2VkLCAuLi51bm1lcmdlZF1cbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluc2VydExheWVyQXRSaWdodE9yZGVyKFxuICBjdXJyZW50TGF5ZXJzLFxuICBsYXllcnNUb0luc2VydCxcbiAgY3VycmVudE9yZGVyLFxuICBwcmVzZXJ2ZWRPcmRlciA9IFtdXG4pIHtcbiAgLy8gcGVyc2VydmVkT3JkZXIgWydhJywgJ2InLCAnYyddO1xuICAvLyBsYXllck9yZGVyIFsxLCAwLCAzXVxuICAvLyBsYXllck9yZGVyTWFwIFsnYScsICdjJ11cbiAgbGV0IGxheWVyT3JkZXJRdWV1ZSA9IGN1cnJlbnRPcmRlci5tYXAoaSA9PiBjdXJyZW50TGF5ZXJzW2ldLmlkKTtcbiAgbGV0IG5ld0xheWVycyA9IGN1cnJlbnRMYXllcnM7XG5cbiAgZm9yIChjb25zdCBuZXdMYXllciBvZiBsYXllcnNUb0luc2VydCkge1xuICAgIC8vIGZpbmQgd2hlcmUgdG8gaW5zZXJ0IGl0XG4gICAgY29uc3QgZXhwZWN0ZWRJZHggPSBwcmVzZXJ2ZWRPcmRlci5pbmRleE9mKG5ld0xheWVyLmlkKTtcbiAgICAvLyBpZiBjYW50IGZpbmQgcGxhY2UgdG8gaW5zZXJ0LCBpbnNlcnQgYXQgdGhlIGZvbnRcbiAgICBsZXQgaW5zZXJ0QXQgPSAwO1xuXG4gICAgaWYgKGV4cGVjdGVkSWR4ID4gMCkge1xuICAgICAgLy8gbG9vayBmb3IgbGF5ZXIgdG8gaW5zZXJ0IGFmdGVyXG4gICAgICBsZXQgaSA9IGV4cGVjdGVkSWR4ICsgMTtcbiAgICAgIGxldCBwcmVjZWVkSWR4ID0gbnVsbDtcbiAgICAgIHdoaWxlIChpLS0gPiAwICYmIHByZWNlZWRJZHggPT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgcHJlY2VlZExheWVyID0gcHJlc2VydmVkT3JkZXJbZXhwZWN0ZWRJZHggLSAxXTtcbiAgICAgICAgcHJlY2VlZElkeCA9IGxheWVyT3JkZXJRdWV1ZS5pbmRleE9mKHByZWNlZWRMYXllcik7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmVjZWVkSWR4ID4gLTEpIHtcbiAgICAgICAgaW5zZXJ0QXQgPSBwcmVjZWVkSWR4ICsgMTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsYXllck9yZGVyUXVldWUgPSBhcnJheUluc2VydChsYXllck9yZGVyUXVldWUsIGluc2VydEF0LCBuZXdMYXllci5pZCk7XG4gICAgbmV3TGF5ZXJzID0gbmV3TGF5ZXJzLmNvbmNhdChuZXdMYXllcik7XG4gIH1cblxuICAvLyByZWNvbnN0cnVjdCBsYXllck9yZGVyIGFmdGVyIGluc2VydFxuICBjb25zdCBuZXdMYXllck9yZGVyID0gbGF5ZXJPcmRlclF1ZXVlLm1hcChpZCA9PiBuZXdMYXllcnMuZmluZEluZGV4KGwgPT4gbC5pZCA9PT0gaWQpKTtcblxuICByZXR1cm4ge1xuICAgIG5ld0xheWVyT3JkZXIsXG4gICAgbmV3TGF5ZXJzXG4gIH07XG59XG5cbi8qKlxuICogTWVyZ2UgaW50ZXJhY3Rpb25zIHdpdGggc2F2ZWQgY29uZmlnXG4gKlxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLW1lcmdlcicpLm1lcmdlSW50ZXJhY3Rpb25zfVxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VJbnRlcmFjdGlvbnMoc3RhdGUsIGludGVyYWN0aW9uVG9CZU1lcmdlZCkge1xuICBjb25zdCBtZXJnZWQgPSB7fTtcbiAgY29uc3QgdW5tZXJnZWQgPSB7fTtcblxuICBpZiAoaW50ZXJhY3Rpb25Ub0JlTWVyZ2VkKSB7XG4gICAgT2JqZWN0LmtleXMoaW50ZXJhY3Rpb25Ub0JlTWVyZ2VkKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBpZiAoIXN0YXRlLmludGVyYWN0aW9uQ29uZmlnW2tleV0pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjdXJyZW50Q29uZmlnID0gc3RhdGUuaW50ZXJhY3Rpb25Db25maWdba2V5XS5jb25maWc7XG5cbiAgICAgIGNvbnN0IHtlbmFibGVkLCAuLi5jb25maWdTYXZlZH0gPSBpbnRlcmFjdGlvblRvQmVNZXJnZWRba2V5XSB8fCB7fTtcbiAgICAgIGxldCBjb25maWdUb01lcmdlID0gY29uZmlnU2F2ZWQ7XG5cbiAgICAgIGlmIChrZXkgPT09ICd0b29sdGlwJykge1xuICAgICAgICBjb25zdCB7bWVyZ2VkVG9vbHRpcCwgdW5tZXJnZWRUb29sdGlwfSA9IG1lcmdlSW50ZXJhY3Rpb25Ub29sdGlwQ29uZmlnKHN0YXRlLCBjb25maWdTYXZlZCk7XG5cbiAgICAgICAgLy8gbWVyZ2UgbmV3IGRhdGFzZXQgdG9vbHRpcHMgd2l0aCBvcmlnaW5hbCBkYXRhc2V0IHRvb2x0aXBzXG4gICAgICAgIGNvbmZpZ1RvTWVyZ2UgPSB7XG4gICAgICAgICAgZmllbGRzVG9TaG93OiB7XG4gICAgICAgICAgICAuLi5jdXJyZW50Q29uZmlnLmZpZWxkc1RvU2hvdyxcbiAgICAgICAgICAgIC4uLm1lcmdlZFRvb2x0aXBcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKHVubWVyZ2VkVG9vbHRpcCkubGVuZ3RoKSB7XG4gICAgICAgICAgdW5tZXJnZWQudG9vbHRpcCA9IHtmaWVsZHNUb1Nob3c6IHVubWVyZ2VkVG9vbHRpcCwgZW5hYmxlZH07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbWVyZ2VkW2tleV0gPSB7XG4gICAgICAgIC4uLnN0YXRlLmludGVyYWN0aW9uQ29uZmlnW2tleV0sXG4gICAgICAgIGVuYWJsZWQsXG4gICAgICAgIC4uLihjdXJyZW50Q29uZmlnXG4gICAgICAgICAgPyB7XG4gICAgICAgICAgICAgIGNvbmZpZzogcGljayhcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAuLi5jdXJyZW50Q29uZmlnLFxuICAgICAgICAgICAgICAgICAgLi4uY29uZmlnVG9NZXJnZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoY3VycmVudENvbmZpZylcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIDoge30pXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBpbnRlcmFjdGlvbkNvbmZpZzoge1xuICAgICAgLi4uc3RhdGUuaW50ZXJhY3Rpb25Db25maWcsXG4gICAgICAuLi5tZXJnZWRcbiAgICB9LFxuICAgIGludGVyYWN0aW9uVG9CZU1lcmdlZDogdW5tZXJnZWRcbiAgfTtcbn1cblxuLyoqXG4gKiBNZXJnZSBzcGxpdE1hcHMgY29uZmlnIHdpdGggY3VycmVudCB2aXNTdGV0ZS5cbiAqIDEuIGlmIGN1cnJlbnQgbWFwIGlzIHNwbGl0LCBidXQgc3BsaXRNYXAgRE9FU05PVCBjb250YWluIG1hcHNcbiAqICAgIDogZG9uJ3QgbWVyZ2UgYW55dGhpbmdcbiAqIDIuIGlmIGN1cnJlbnQgbWFwIGlzIE5PVCBzcGxpdCwgYnV0IHNwbGl0TWFwcyBjb250YWluIG1hcHNcbiAqICAgIDogYWRkIHRvIHNwbGl0TWFwcywgYW5kIGFkZCBjdXJyZW50IGxheWVycyB0byBzcGxpdE1hcHNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1tZXJnZXInKS5tZXJnZUludGVyYWN0aW9uc31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlU3BsaXRNYXBzKHN0YXRlLCBzcGxpdE1hcHMgPSBbXSkge1xuICBjb25zdCBtZXJnZWQgPSBbLi4uc3RhdGUuc3BsaXRNYXBzXTtcbiAgY29uc3QgdW5tZXJnZWQgPSBbXTtcbiAgc3BsaXRNYXBzLmZvckVhY2goKHNtLCBpKSA9PiB7XG4gICAgT2JqZWN0LmVudHJpZXMoc20ubGF5ZXJzKS5mb3JFYWNoKChbaWQsIHZhbHVlXSkgPT4ge1xuICAgICAgLy8gY2hlY2sgaWYgbGF5ZXIgZXhpc3RzXG4gICAgICBjb25zdCBwdXNoVG8gPSBzdGF0ZS5sYXllcnMuZmluZChsID0+IGwuaWQgPT09IGlkKSA/IG1lcmdlZCA6IHVubWVyZ2VkO1xuXG4gICAgICAvLyBjcmVhdGUgbWFwIHBhbmVsIGlmIGN1cnJlbnQgbWFwIGlzIG5vdCBzcGxpdFxuICAgICAgcHVzaFRvW2ldID0gcHVzaFRvW2ldIHx8IHtcbiAgICAgICAgbGF5ZXJzOiBwdXNoVG8gPT09IG1lcmdlZCA/IGdldEluaXRpYWxNYXBMYXllcnNGb3JTcGxpdE1hcChzdGF0ZS5sYXllcnMpIDogW11cbiAgICAgIH07XG4gICAgICBwdXNoVG9baV0ubGF5ZXJzID0ge1xuICAgICAgICAuLi5wdXNoVG9baV0ubGF5ZXJzLFxuICAgICAgICBbaWRdOiB2YWx1ZVxuICAgICAgfTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBzcGxpdE1hcHM6IG1lcmdlZCxcbiAgICBzcGxpdE1hcHNUb0JlTWVyZ2VkOiBbLi4uc3RhdGUuc3BsaXRNYXBzVG9CZU1lcmdlZCwgLi4udW5tZXJnZWRdXG4gIH07XG59XG5cbi8qKlxuICogTWVyZ2UgaW50ZXJhY3Rpb25Db25maWcudG9vbHRpcCB3aXRoIHNhdmVkIGNvbmZpZyxcbiAqIHZhbGlkYXRlIGZpZWxkc1RvU2hvd1xuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBzdGF0ZVxuICogQHBhcmFtIHtvYmplY3R9IHRvb2x0aXBDb25maWdcbiAqIEByZXR1cm4ge29iamVjdH0gLSB7bWVyZ2VkVG9vbHRpcDoge30sIHVubWVyZ2VkVG9vbHRpcDoge319XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZUludGVyYWN0aW9uVG9vbHRpcENvbmZpZyhzdGF0ZSwgdG9vbHRpcENvbmZpZyA9IHt9KSB7XG4gIGNvbnN0IHVubWVyZ2VkVG9vbHRpcCA9IHt9O1xuICBjb25zdCBtZXJnZWRUb29sdGlwID0ge307XG5cbiAgaWYgKCF0b29sdGlwQ29uZmlnLmZpZWxkc1RvU2hvdyB8fCAhT2JqZWN0LmtleXModG9vbHRpcENvbmZpZy5maWVsZHNUb1Nob3cpLmxlbmd0aCkge1xuICAgIHJldHVybiB7bWVyZ2VkVG9vbHRpcCwgdW5tZXJnZWRUb29sdGlwfTtcbiAgfVxuXG4gIGZvciAoY29uc3QgZGF0YUlkIGluIHRvb2x0aXBDb25maWcuZmllbGRzVG9TaG93KSB7XG4gICAgaWYgKCFzdGF0ZS5kYXRhc2V0c1tkYXRhSWRdKSB7XG4gICAgICAvLyBpcyBub3QgeWV0IGxvYWRlZFxuICAgICAgdW5tZXJnZWRUb29sdGlwW2RhdGFJZF0gPSB0b29sdGlwQ29uZmlnLmZpZWxkc1RvU2hvd1tkYXRhSWRdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBpZiBkYXRhc2V0IGlzIGxvYWRlZFxuICAgICAgY29uc3QgYWxsRmllbGRzID0gc3RhdGUuZGF0YXNldHNbZGF0YUlkXS5maWVsZHMubWFwKGQgPT4gZC5uYW1lKTtcbiAgICAgIGNvbnN0IGZvdW5kRmllbGRzVG9TaG93ID0gdG9vbHRpcENvbmZpZy5maWVsZHNUb1Nob3dbZGF0YUlkXS5maWx0ZXIoZmllbGQgPT5cbiAgICAgICAgYWxsRmllbGRzLmluY2x1ZGVzKGZpZWxkLm5hbWUpXG4gICAgICApO1xuXG4gICAgICBtZXJnZWRUb29sdGlwW2RhdGFJZF0gPSBmb3VuZEZpZWxkc1RvU2hvdztcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge21lcmdlZFRvb2x0aXAsIHVubWVyZ2VkVG9vbHRpcH07XG59XG4vKipcbiAqIE1lcmdlIGxheWVyQmxlbmRpbmcgd2l0aCBzYXZlZFxuICpcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1tZXJnZXInKS5tZXJnZUxheWVyQmxlbmRpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZUxheWVyQmxlbmRpbmcoc3RhdGUsIGxheWVyQmxlbmRpbmcpIHtcbiAgaWYgKGxheWVyQmxlbmRpbmcgJiYgTEFZRVJfQkxFTkRJTkdTW2xheWVyQmxlbmRpbmddKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgbGF5ZXJCbGVuZGluZ1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gc3RhdGU7XG59XG5cbi8qKlxuICogTWVyZ2UgYW5pbWF0aW9uIGNvbmZpZ1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLW1lcmdlcicpLm1lcmdlQW5pbWF0aW9uQ29uZmlnfVxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VBbmltYXRpb25Db25maWcoc3RhdGUsIGFuaW1hdGlvbikge1xuICBpZiAoYW5pbWF0aW9uICYmIGFuaW1hdGlvbi5jdXJyZW50VGltZSkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGFuaW1hdGlvbkNvbmZpZzoge1xuICAgICAgICAuLi5zdGF0ZS5hbmltYXRpb25Db25maWcsXG4gICAgICAgIC4uLmFuaW1hdGlvbixcbiAgICAgICAgZG9tYWluOiBudWxsXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBzdGF0ZTtcbn1cblxuLyoqXG4gKiBWYWxpZGF0ZSBzYXZlZCBsYXllciBjb2x1bW5zIHdpdGggbmV3IGRhdGEsXG4gKiB1cGRhdGUgZmllbGRJZHggYmFzZWQgb24gbmV3IGZpZWxkc1xuICpcbiAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gZmllbGRzXG4gKiBAcGFyYW0ge09iamVjdH0gc2F2ZWRDb2xzXG4gKiBAcGFyYW0ge09iamVjdH0gZW1wdHlDb2xzXG4gKiBAcmV0dXJuIHtudWxsIHwgT2JqZWN0fSAtIHZhbGlkYXRlZCBjb2x1bW5zIG9yIG51bGxcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVTYXZlZExheWVyQ29sdW1ucyhmaWVsZHMsIHNhdmVkQ29scyA9IHt9LCBlbXB0eUNvbHMpIHtcbiAgLy8gUHJlcGFyZSBjb2x1bW5zIGZvciB0aGUgdmFsaWRhdG9yXG4gIGNvbnN0IGNvbHVtbnMgPSB7fTtcbiAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoZW1wdHlDb2xzKSkge1xuICAgIGNvbHVtbnNba2V5XSA9IHsuLi5lbXB0eUNvbHNba2V5XX07XG5cbiAgICBjb25zdCBzYXZlZCA9IHNhdmVkQ29sc1trZXldO1xuICAgIGlmIChzYXZlZCkge1xuICAgICAgY29uc3QgZmllbGRJZHggPSBmaWVsZHMuZmluZEluZGV4KCh7bmFtZX0pID0+IG5hbWUgPT09IHNhdmVkKTtcblxuICAgICAgaWYgKGZpZWxkSWR4ID4gLTEpIHtcbiAgICAgICAgLy8gdXBkYXRlIGZvdW5kIGNvbHVtbnNcbiAgICAgICAgY29sdW1uc1trZXldLmZpZWxkSWR4ID0gZmllbGRJZHg7XG4gICAgICAgIGNvbHVtbnNba2V5XS52YWx1ZSA9IHNhdmVkO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIGZpbmQgYWN0dWFsIGNvbHVtbiBmaWVsZElkeCwgaW4gY2FzZSBpdCBoYXMgY2hhbmdlZFxuICBjb25zdCBhbGxDb2xGb3VuZCA9IE9iamVjdC5rZXlzKGNvbHVtbnMpLmV2ZXJ5KGtleSA9PlxuICAgIHZhbGlkYXRlQ29sdW1uKGNvbHVtbnNba2V5XSwgY29sdW1ucywgZmllbGRzKVxuICApO1xuXG4gIGlmIChhbGxDb2xGb3VuZCkge1xuICAgIHJldHVybiBjb2x1bW5zO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUNvbHVtbihjb2x1bW4sIGNvbHVtbnMsIGFsbEZpZWxkcykge1xuICBpZiAoY29sdW1uLm9wdGlvbmFsIHx8IGNvbHVtbi52YWx1ZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChjb2x1bW4udmFsaWRhdG9yKSB7XG4gICAgcmV0dXJuIGNvbHVtbi52YWxpZGF0b3IoY29sdW1uLCBjb2x1bW5zLCBhbGxGaWVsZHMpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBWYWxpZGF0ZSBzYXZlZCB0ZXh0IGxhYmVsIGNvbmZpZyB3aXRoIG5ldyBkYXRhXG4gKiByZWZlciB0byB2aXMtc3RhdGUtc2NoZW1hLmpzIFRleHRMYWJlbFNjaGVtYVYxXG4gKlxuICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBmaWVsZHNcbiAqIEBwYXJhbSB7T2JqZWN0fSBzYXZlZFRleHRMYWJlbFxuICogQHJldHVybiB7T2JqZWN0fSAtIHZhbGlkYXRlZCB0ZXh0bGFiZWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlU2F2ZWRUZXh0TGFiZWwoZmllbGRzLCBbbGF5ZXJUZXh0TGFiZWxdLCBzYXZlZFRleHRMYWJlbCkge1xuICBjb25zdCBzYXZlZFRleHRMYWJlbHMgPSBBcnJheS5pc0FycmF5KHNhdmVkVGV4dExhYmVsKSA/IHNhdmVkVGV4dExhYmVsIDogW3NhdmVkVGV4dExhYmVsXTtcblxuICAvLyB2YWxpZGF0ZSBmaWVsZFxuICByZXR1cm4gc2F2ZWRUZXh0TGFiZWxzLm1hcCh0ZXh0TGFiZWwgPT4ge1xuICAgIGNvbnN0IGZpZWxkID0gdGV4dExhYmVsLmZpZWxkXG4gICAgICA/IGZpZWxkcy5maW5kKGZkID0+XG4gICAgICAgICAgT2JqZWN0LmtleXModGV4dExhYmVsLmZpZWxkKS5ldmVyeShrZXkgPT4gdGV4dExhYmVsLmZpZWxkW2tleV0gPT09IGZkW2tleV0pXG4gICAgICAgIClcbiAgICAgIDogbnVsbDtcblxuICAgIHJldHVybiBPYmplY3Qua2V5cyhsYXllclRleHRMYWJlbCkucmVkdWNlKFxuICAgICAgKGFjY3UsIGtleSkgPT4gKHtcbiAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgW2tleV06IGtleSA9PT0gJ2ZpZWxkJyA/IGZpZWxkIDogdGV4dExhYmVsW2tleV0gfHwgbGF5ZXJUZXh0TGFiZWxba2V5XVxuICAgICAgfSksXG4gICAgICB7fVxuICAgICk7XG4gIH0pO1xufVxuXG4vKipcbiAqIFZhbGlkYXRlIHNhdmVkIHZpc3VhbCBjaGFubmVscyBjb25maWcgd2l0aCBuZXcgZGF0YSxcbiAqIHJlZmVyIHRvIHZpcy1zdGF0ZS1zY2hlbWEuanMgVmlzdWFsQ2hhbm5lbFNjaGVtYVYxXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtbWVyZ2VyJykudmFsaWRhdGVTYXZlZFZpc3VhbENoYW5uZWxzfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVTYXZlZFZpc3VhbENoYW5uZWxzKGZpZWxkcywgbmV3TGF5ZXIsIHNhdmVkTGF5ZXIpIHtcbiAgT2JqZWN0LnZhbHVlcyhuZXdMYXllci52aXN1YWxDaGFubmVscykuZm9yRWFjaCgoe2ZpZWxkLCBzY2FsZSwga2V5fSkgPT4ge1xuICAgIGxldCBmb3VuZEZpZWxkO1xuICAgIGlmIChzYXZlZExheWVyLmNvbmZpZykge1xuICAgICAgaWYgKHNhdmVkTGF5ZXIuY29uZmlnW2ZpZWxkXSkge1xuICAgICAgICBmb3VuZEZpZWxkID0gZmllbGRzLmZpbmQoXG4gICAgICAgICAgZmQgPT4gc2F2ZWRMYXllci5jb25maWcgJiYgZmQubmFtZSA9PT0gc2F2ZWRMYXllci5jb25maWdbZmllbGRdLm5hbWVcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZm91bmRDaGFubmVsID0ge1xuICAgICAgICAuLi4oZm91bmRGaWVsZCA/IHtbZmllbGRdOiBmb3VuZEZpZWxkfSA6IHt9KSxcbiAgICAgICAgLi4uKHNhdmVkTGF5ZXIuY29uZmlnW3NjYWxlXSA/IHtbc2NhbGVdOiBzYXZlZExheWVyLmNvbmZpZ1tzY2FsZV19IDoge30pXG4gICAgICB9O1xuICAgICAgaWYgKE9iamVjdC5rZXlzKGZvdW5kQ2hhbm5lbCkubGVuZ3RoKSB7XG4gICAgICAgIG5ld0xheWVyLnVwZGF0ZUxheWVyQ29uZmlnKGZvdW5kQ2hhbm5lbCk7XG4gICAgICB9XG5cbiAgICAgIG5ld0xheWVyLnZhbGlkYXRlVmlzdWFsQ2hhbm5lbChrZXkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBuZXdMYXllcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlTGF5ZXJzQnlEYXRhc2V0cyhkYXRhc2V0cywgbGF5ZXJDbGFzc2VzLCBsYXllcnMpIHtcbiAgY29uc3QgdmFsaWRhdGVkID0gW107XG4gIGNvbnN0IGZhaWxlZCA9IFtdO1xuXG4gIGxheWVycy5mb3JFYWNoKGxheWVyID0+IHtcbiAgICBsZXQgdmFsaWRhdGVMYXllcjtcbiAgICBpZiAoIWxheWVyIHx8ICFsYXllci5jb25maWcpIHtcbiAgICAgIHZhbGlkYXRlTGF5ZXIgPSBudWxsO1xuICAgIH0gZWxzZSBpZiAoZGF0YXNldHNbbGF5ZXIuY29uZmlnLmRhdGFJZF0pIHtcbiAgICAgIC8vIGRhdGFzZXRzIGFyZSBhbHJlYWR5IGxvYWRlZFxuICAgICAgdmFsaWRhdGVMYXllciA9IHZhbGlkYXRlTGF5ZXJXaXRoRGF0YShkYXRhc2V0c1tsYXllci5jb25maWcuZGF0YUlkXSwgbGF5ZXIsIGxheWVyQ2xhc3Nlcyk7XG4gICAgfVxuXG4gICAgaWYgKHZhbGlkYXRlTGF5ZXIpIHtcbiAgICAgIHZhbGlkYXRlZC5wdXNoKHZhbGlkYXRlTGF5ZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBkYXRhc2V0cyBub3QgeWV0IGxvYWRlZFxuICAgICAgZmFpbGVkLnB1c2gobGF5ZXIpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHt2YWxpZGF0ZWQsIGZhaWxlZH07XG59XG4vKipcbiAqIFZhbGlkYXRlIHNhdmVkIGxheWVyIGNvbmZpZyB3aXRoIG5ldyBkYXRhLFxuICogdXBkYXRlIGZpZWxkSWR4IGJhc2VkIG9uIG5ldyBmaWVsZHNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1tZXJnZXInKS52YWxpZGF0ZUxheWVyV2l0aERhdGF9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUxheWVyV2l0aERhdGEoXG4gIHtmaWVsZHMsIGlkOiBkYXRhSWR9LFxuICBzYXZlZExheWVyLFxuICBsYXllckNsYXNzZXMsXG4gIG9wdGlvbnMgPSB7fVxuKSB7XG4gIGNvbnN0IHt0eXBlfSA9IHNhdmVkTGF5ZXI7XG4gIC8vIGxheWVyIGRvZXNudCBoYXZlIGEgdmFsaWQgdHlwZVxuICBpZiAoIXR5cGUgfHwgIWxheWVyQ2xhc3Nlcy5oYXNPd25Qcm9wZXJ0eSh0eXBlKSB8fCAhc2F2ZWRMYXllci5jb25maWcpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGxldCBuZXdMYXllciA9IG5ldyBsYXllckNsYXNzZXNbdHlwZV0oe1xuICAgIGlkOiBzYXZlZExheWVyLmlkLFxuICAgIGRhdGFJZCxcbiAgICBsYWJlbDogc2F2ZWRMYXllci5jb25maWcubGFiZWwsXG4gICAgY29sb3I6IHNhdmVkTGF5ZXIuY29uZmlnLmNvbG9yLFxuICAgIGlzVmlzaWJsZTogc2F2ZWRMYXllci5jb25maWcuaXNWaXNpYmxlLFxuICAgIGhpZGRlbjogc2F2ZWRMYXllci5jb25maWcuaGlkZGVuLFxuICAgIGhpZ2hsaWdodENvbG9yOiBzYXZlZExheWVyLmNvbmZpZy5oaWdobGlnaHRDb2xvclxuICB9KTtcblxuICAvLyBmaW5kIGNvbHVtbiBmaWVsZElkeFxuICBjb25zdCBjb2x1bW5Db25maWcgPSBuZXdMYXllci5nZXRMYXllckNvbHVtbnMoKTtcbiAgaWYgKE9iamVjdC5rZXlzKGNvbHVtbkNvbmZpZykubGVuZ3RoKSB7XG4gICAgY29uc3QgY29sdW1ucyA9IHZhbGlkYXRlU2F2ZWRMYXllckNvbHVtbnMoZmllbGRzLCBzYXZlZExheWVyLmNvbmZpZy5jb2x1bW5zLCBjb2x1bW5Db25maWcpO1xuICAgIGlmIChjb2x1bW5zKSB7XG4gICAgICBuZXdMYXllci51cGRhdGVMYXllckNvbmZpZyh7Y29sdW1uc30pO1xuICAgIH0gZWxzZSBpZiAoIW9wdGlvbnMuYWxsb3dFbXB0eUNvbHVtbikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgLy8gdmlzdWFsIGNoYW5uZWwgZmllbGQgaXMgc2F2ZWQgdG8gYmUge25hbWUsIHR5cGV9XG4gIC8vIGZpbmQgdmlzdWFsIGNoYW5uZWwgZmllbGQgYnkgbWF0Y2hpbmcgYm90aCBuYW1lIGFuZCB0eXBlXG4gIC8vIHJlZmVyIHRvIHZpcy1zdGF0ZS1zY2hlbWEuanMgVmlzdWFsQ2hhbm5lbFNjaGVtYVYxXG4gIG5ld0xheWVyID0gdmFsaWRhdGVTYXZlZFZpc3VhbENoYW5uZWxzKGZpZWxkcywgbmV3TGF5ZXIsIHNhdmVkTGF5ZXIpO1xuXG4gIGNvbnN0IHRleHRMYWJlbCA9XG4gICAgc2F2ZWRMYXllci5jb25maWcudGV4dExhYmVsICYmIG5ld0xheWVyLmNvbmZpZy50ZXh0TGFiZWxcbiAgICAgID8gdmFsaWRhdGVTYXZlZFRleHRMYWJlbChmaWVsZHMsIG5ld0xheWVyLmNvbmZpZy50ZXh0TGFiZWwsIHNhdmVkTGF5ZXIuY29uZmlnLnRleHRMYWJlbClcbiAgICAgIDogbmV3TGF5ZXIuY29uZmlnLnRleHRMYWJlbDtcblxuICAvLyBjb3B5IHZpc0NvbmZpZyBvdmVyIHRvIGVtcHR5TGF5ZXIgdG8gbWFrZSBzdXJlIGl0IGhhcyBhbGwgdGhlIHByb3BzXG4gIGNvbnN0IHZpc0NvbmZpZyA9IG5ld0xheWVyLmNvcHlMYXllckNvbmZpZyhcbiAgICBuZXdMYXllci5jb25maWcudmlzQ29uZmlnLFxuICAgIHNhdmVkTGF5ZXIuY29uZmlnLnZpc0NvbmZpZyB8fCB7fSxcbiAgICB7c2hhbGxvd0NvcHk6IFsnY29sb3JSYW5nZScsICdzdHJva2VDb2xvclJhbmdlJ119XG4gICk7XG5cbiAgbmV3TGF5ZXIudXBkYXRlTGF5ZXJDb25maWcoe1xuICAgIHZpc0NvbmZpZyxcbiAgICB0ZXh0TGFiZWxcbiAgfSk7XG5cbiAgcmV0dXJuIG5ld0xheWVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZE1lcmdlcihtZXJnZXIpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KG1lcmdlcikgJiYgdHlwZW9mIG1lcmdlci5tZXJnZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgbWVyZ2VyLnByb3AgPT09ICdzdHJpbmcnO1xufVxuXG5leHBvcnQgY29uc3QgVklTX1NUQVRFX01FUkdFUlMgPSBbXG4gIHttZXJnZTogbWVyZ2VMYXllcnMsIHByb3A6ICdsYXllcnMnLCB0b01lcmdlUHJvcDogJ2xheWVyVG9CZU1lcmdlZCd9LFxuICB7bWVyZ2U6IG1lcmdlRmlsdGVycywgcHJvcDogJ2ZpbHRlcnMnLCB0b01lcmdlUHJvcDogJ2ZpbHRlclRvQmVNZXJnZWQnfSxcbiAge21lcmdlOiBtZXJnZUludGVyYWN0aW9ucywgcHJvcDogJ2ludGVyYWN0aW9uQ29uZmlnJywgdG9NZXJnZVByb3A6ICdpbnRlcmFjdGlvblRvQmVNZXJnZWQnfSxcbiAge21lcmdlOiBtZXJnZUxheWVyQmxlbmRpbmcsIHByb3A6ICdsYXllckJsZW5kaW5nJ30sXG4gIHttZXJnZTogbWVyZ2VTcGxpdE1hcHMsIHByb3A6ICdzcGxpdE1hcHMnLCB0b01lcmdlUHJvcDogJ3NwbGl0TWFwc1RvQmVNZXJnZWQnfSxcbiAge21lcmdlOiBtZXJnZUFuaW1hdGlvbkNvbmZpZywgcHJvcDogJ2FuaW1hdGlvbkNvbmZpZyd9XG5dO1xuIl19