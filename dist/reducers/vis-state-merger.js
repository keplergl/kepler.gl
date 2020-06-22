"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeFilters = mergeFilters;
exports.mergeLayers = mergeLayers;
exports.mergeInteractions = mergeInteractions;
exports.mergeSplitMaps = mergeSplitMaps;
exports.mergeInteractionTooltipConfig = mergeInteractionTooltipConfig;
exports.mergeLayerBlending = mergeLayerBlending;
exports.mergeAnimationConfig = mergeAnimationConfig;
exports.validateSavedLayerColumns = validateSavedLayerColumns;
exports.validateSavedTextLabel = validateSavedTextLabel;
exports.validateSavedVisualChannels = validateSavedVisualChannels;
exports.validateLayerWithData = validateLayerWithData;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = _interopRequireDefault(require("lodash.uniq"));

var _lodash2 = _interopRequireDefault(require("lodash.pick"));

var _lodash3 = _interopRequireDefault(require("lodash.isequal"));

var _lodash4 = _interopRequireDefault(require("lodash.flattendeep"));

var _utils = require("../utils/utils");

var _filterUtils = require("../utils/filter-utils");

var _splitMapUtils = require("../utils/split-map-utils");

var _gpuFilterUtils = require("../utils/gpu-filter-utils");

var _defaultSettings = require("../constants/default-settings");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * Merge loaded filters with current state, if no fields or data are loaded
 * save it for later
 *
 * @type {typeof import('./vis-state-merger').mergeFilters}
 */
function mergeFilters(state, filtersToMerge) {
  var merged = [];
  var unmerged = [];
  var datasets = state.datasets;
  var updatedDatasets = datasets;

  if (!Array.isArray(filtersToMerge) || !filtersToMerge.length) {
    return state;
  } // merge filters


  filtersToMerge.forEach(function (filter) {
    // we can only look for datasets define in the filter dataId
    var datasetIds = (0, _utils.toArray)(filter.dataId); // we can merge a filter only if all datasets in filter.dataId are loaded

    if (datasetIds.every(function (d) {
      return datasets[d];
    })) {
      // all datasetIds in filter must be present the state datasets
      var _datasetIds$reduce = datasetIds.reduce(function (acc, datasetId) {
        var dataset = updatedDatasets[datasetId];
        var layers = state.layers.filter(function (l) {
          return l.config.dataId === dataset.id;
        });

        var _validateFilterWithDa = (0, _filterUtils.validateFilterWithData)(acc.augmentedDatasets[datasetId] || dataset, filter, layers),
            updatedFilter = _validateFilterWithDa.filter,
            updatedDataset = _validateFilterWithDa.dataset;

        if (updatedFilter) {
          return _objectSpread({}, acc, {
            // merge filter props
            filter: acc.filter ? _objectSpread({}, acc.filter, {}, (0, _filterUtils.mergeFilterDomainStep)(acc, updatedFilter)) : updatedFilter,
            applyToDatasets: [].concat((0, _toConsumableArray2["default"])(acc.applyToDatasets), [datasetId]),
            augmentedDatasets: _objectSpread({}, acc.augmentedDatasets, (0, _defineProperty2["default"])({}, datasetId, updatedDataset))
          });
        }

        return acc;
      }, {
        filter: null,
        applyToDatasets: [],
        augmentedDatasets: {}
      }),
          validatedFilter = _datasetIds$reduce.filter,
          applyToDatasets = _datasetIds$reduce.applyToDatasets,
          augmentedDatasets = _datasetIds$reduce.augmentedDatasets;

      if (validatedFilter && (0, _lodash3["default"])(datasetIds, applyToDatasets)) {
        merged.push(validatedFilter);
        updatedDatasets = _objectSpread({}, updatedDatasets, {}, augmentedDatasets);
      }
    } else {
      unmerged.push(filter);
    }
  }); // merge filter with existing

  var updatedFilters = [].concat((0, _toConsumableArray2["default"])(state.filters || []), merged);
  updatedFilters = (0, _gpuFilterUtils.resetFilterGpuMode)(updatedFilters);
  updatedFilters = (0, _gpuFilterUtils.assignGpuChannels)(updatedFilters); // filter data

  var datasetsToFilter = (0, _lodash["default"])((0, _lodash4["default"])(merged.map(function (f) {
    return f.dataId;
  })));
  var filtered = (0, _filterUtils.applyFiltersToDatasets)(datasetsToFilter, updatedDatasets, updatedFilters, state.layers);
  return _objectSpread({}, state, {
    filters: updatedFilters,
    datasets: filtered,
    filterToBeMerged: unmerged
  });
}
/**
 * Merge layers from de-serialized state, if no fields or data are loaded
 * save it for later
 *
 * @type {typeof import('./vis-state-merger').mergeLayers}
 */


function mergeLayers(state, layersToMerge) {
  var mergedLayer = [];
  var unmerged = [];
  var datasets = state.datasets;

  if (!Array.isArray(layersToMerge) || !layersToMerge.length) {
    return state;
  }

  layersToMerge.forEach(function (layer) {
    if (datasets[layer.config.dataId]) {
      // datasets are already loaded
      var validateLayer = validateLayerWithData(datasets[layer.config.dataId], layer, state.layerClasses);

      if (validateLayer) {
        mergedLayer.push(validateLayer);
      }
    } else {
      // datasets not yet loaded
      unmerged.push(layer);
    }
  });
  var layers = [].concat((0, _toConsumableArray2["default"])(state.layers), mergedLayer);
  var newLayerOrder = mergedLayer.map(function (_, i) {
    return state.layers.length + i;
  }); // put new layers in front of current layers

  var layerOrder = [].concat((0, _toConsumableArray2["default"])(newLayerOrder), (0, _toConsumableArray2["default"])(state.layerOrder));
  return _objectSpread({}, state, {
    layers: layers,
    layerOrder: layerOrder,
    layerToBeMerged: unmerged
  });
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
          fieldsToShow: _objectSpread({}, currentConfig.fieldsToShow, {}, mergedTooltip)
        };

        if (Object.keys(unmergedTooltip).length) {
          unmerged.tooltip = {
            fieldsToShow: unmergedTooltip,
            enabled: enabled
          };
        }
      }

      merged[key] = _objectSpread({}, state.interactionConfig[key], {
        enabled: enabled
      }, currentConfig ? {
        config: (0, _lodash2["default"])(_objectSpread({}, currentConfig, {}, configToMerge), Object.keys(currentConfig))
      } : {});
    });
  }

  return _objectSpread({}, state, {
    interactionConfig: _objectSpread({}, state.interactionConfig, {}, merged),
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
      pushTo[i].layers = _objectSpread({}, pushTo[i].layers, (0, _defineProperty2["default"])({}, id, value));
    });
  });
  return _objectSpread({}, state, {
    splitMaps: merged,
    splitMapsToBeMerged: unmerged
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
    return _objectSpread({}, state, {
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
    return _objectSpread({}, state, {
      animationConfig: _objectSpread({}, state.animationConfig, {}, animation, {
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


function validateSavedLayerColumns(fields, savedCols, emptyCols) {
  var colFound = {}; // find actual column fieldIdx, in case it has changed

  var allColFound = Object.keys(emptyCols).every(function (key) {
    var saved = savedCols[key];
    colFound[key] = _objectSpread({}, emptyCols[key]); // TODO: replace with new approach

    var fieldIdx = fields.findIndex(function (_ref4) {
      var name = _ref4.name;
      return name === saved;
    });

    if (fieldIdx > -1) {
      // update found columns
      colFound[key].fieldIdx = fieldIdx;
      colFound[key].value = saved;
      return true;
    } // if col is optional, allow null value


    return emptyCols[key].optional || false;
  });
  return allColFound && colFound;
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
      return _objectSpread({}, accu, (0, _defineProperty2["default"])({}, key, key === 'field' ? field : textLabel[key] || layerTextLabel[key]));
    }, {});
  });
}
/**
 * Validate saved visual channels config with new data,
 * refer to vis-state-schema.js VisualChannelSchemaV1
 *
 * @param {Array<Object>} fields
 * @param {Object} newLayer
 * @param {Object} savedLayer
 * @return {Object} - newLayer
 */


function validateSavedVisualChannels(fields, newLayer, savedLayer) {
  Object.values(newLayer.visualChannels).forEach(function (_ref7) {
    var field = _ref7.field,
        scale = _ref7.scale,
        key = _ref7.key;
    var foundField;

    if (savedLayer.config[field]) {
      foundField = fields.find(function (fd) {
        return Object.keys(savedLayer.config[field]).every(function (prop) {
          return savedLayer.config[field][prop] === fd[prop];
        });
      });
    }

    var foundChannel = _objectSpread({}, foundField ? (0, _defineProperty2["default"])({}, field, foundField) : {}, {}, savedLayer.config[scale] ? (0, _defineProperty2["default"])({}, scale, savedLayer.config[scale]) : {});

    if (Object.keys(foundChannel).length) {
      newLayer.updateLayerConfig(foundChannel);
      newLayer.validateVisualChannel(key);
    }
  });
  return newLayer;
}
/**
 * Validate saved layer config with new data,
 * update fieldIdx based on new fields
 * @param {object} dataset
 * @param {Array<Object>} dataset.fields
 * @param {string} dataset.id
 * @param {Object} savedLayer
 * @param {Object} layerClasses
 * @return {null | Object} - validated layer or null
 */


function validateLayerWithData(_ref10, savedLayer, layerClasses) {
  var fields = _ref10.fields,
      dataId = _ref10.id;
  var type = savedLayer.type; // layer doesnt have a valid type

  if (!layerClasses.hasOwnProperty(type) || !savedLayer.config || !savedLayer.config.columns) {
    return null;
  }

  var newLayer = new layerClasses[type]({
    id: savedLayer.id,
    dataId: dataId,
    label: savedLayer.config.label,
    color: savedLayer.config.color,
    isVisible: savedLayer.config.isVisible,
    hidden: savedLayer.config.hidden
  }); // find column fieldIdx

  var columns = validateSavedLayerColumns(fields, savedLayer.config.columns, newLayer.getLayerColumns());

  if (!columns) {
    return null;
  } // visual channel field is saved to be {name, type}
  // find visual channel field by matching both name and type
  // refer to vis-state-schema.js VisualChannelSchemaV1


  newLayer = validateSavedVisualChannels(fields, newLayer, savedLayer);
  var textLabel = savedLayer.config.textLabel && newLayer.config.textLabel ? validateSavedTextLabel(fields, newLayer.config.textLabel, savedLayer.config.textLabel) : newLayer.config.textLabel; // copy visConfig over to emptyLayer to make sure it has all the props

  var visConfig = newLayer.copyLayerConfig(newLayer.config.visConfig, savedLayer.config.visConfig || {}, {
    shallowCopy: ['colorRange', 'strokeColorRange']
  });
  newLayer.updateLayerConfig({
    columns: columns,
    visConfig: visConfig,
    textLabel: textLabel
  });
  return newLayer;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy92aXMtc3RhdGUtbWVyZ2VyLmpzIl0sIm5hbWVzIjpbIm1lcmdlRmlsdGVycyIsInN0YXRlIiwiZmlsdGVyc1RvTWVyZ2UiLCJtZXJnZWQiLCJ1bm1lcmdlZCIsImRhdGFzZXRzIiwidXBkYXRlZERhdGFzZXRzIiwiQXJyYXkiLCJpc0FycmF5IiwibGVuZ3RoIiwiZm9yRWFjaCIsImZpbHRlciIsImRhdGFzZXRJZHMiLCJkYXRhSWQiLCJldmVyeSIsImQiLCJyZWR1Y2UiLCJhY2MiLCJkYXRhc2V0SWQiLCJkYXRhc2V0IiwibGF5ZXJzIiwibCIsImNvbmZpZyIsImlkIiwiYXVnbWVudGVkRGF0YXNldHMiLCJ1cGRhdGVkRmlsdGVyIiwidXBkYXRlZERhdGFzZXQiLCJhcHBseVRvRGF0YXNldHMiLCJ2YWxpZGF0ZWRGaWx0ZXIiLCJwdXNoIiwidXBkYXRlZEZpbHRlcnMiLCJmaWx0ZXJzIiwiZGF0YXNldHNUb0ZpbHRlciIsIm1hcCIsImYiLCJmaWx0ZXJlZCIsImZpbHRlclRvQmVNZXJnZWQiLCJtZXJnZUxheWVycyIsImxheWVyc1RvTWVyZ2UiLCJtZXJnZWRMYXllciIsImxheWVyIiwidmFsaWRhdGVMYXllciIsInZhbGlkYXRlTGF5ZXJXaXRoRGF0YSIsImxheWVyQ2xhc3NlcyIsIm5ld0xheWVyT3JkZXIiLCJfIiwiaSIsImxheWVyT3JkZXIiLCJsYXllclRvQmVNZXJnZWQiLCJtZXJnZUludGVyYWN0aW9ucyIsImludGVyYWN0aW9uVG9CZU1lcmdlZCIsIk9iamVjdCIsImtleXMiLCJrZXkiLCJpbnRlcmFjdGlvbkNvbmZpZyIsImN1cnJlbnRDb25maWciLCJlbmFibGVkIiwiY29uZmlnU2F2ZWQiLCJjb25maWdUb01lcmdlIiwibWVyZ2VJbnRlcmFjdGlvblRvb2x0aXBDb25maWciLCJtZXJnZWRUb29sdGlwIiwidW5tZXJnZWRUb29sdGlwIiwiZmllbGRzVG9TaG93IiwidG9vbHRpcCIsIm1lcmdlU3BsaXRNYXBzIiwic3BsaXRNYXBzIiwic20iLCJlbnRyaWVzIiwidmFsdWUiLCJwdXNoVG8iLCJmaW5kIiwic3BsaXRNYXBzVG9CZU1lcmdlZCIsInRvb2x0aXBDb25maWciLCJhbGxGaWVsZHMiLCJmaWVsZHMiLCJuYW1lIiwiZm91bmRGaWVsZHNUb1Nob3ciLCJmaWVsZCIsImluY2x1ZGVzIiwibWVyZ2VMYXllckJsZW5kaW5nIiwibGF5ZXJCbGVuZGluZyIsIkxBWUVSX0JMRU5ESU5HUyIsIm1lcmdlQW5pbWF0aW9uQ29uZmlnIiwiYW5pbWF0aW9uIiwiY3VycmVudFRpbWUiLCJhbmltYXRpb25Db25maWciLCJkb21haW4iLCJ2YWxpZGF0ZVNhdmVkTGF5ZXJDb2x1bW5zIiwic2F2ZWRDb2xzIiwiZW1wdHlDb2xzIiwiY29sRm91bmQiLCJhbGxDb2xGb3VuZCIsInNhdmVkIiwiZmllbGRJZHgiLCJmaW5kSW5kZXgiLCJvcHRpb25hbCIsInZhbGlkYXRlU2F2ZWRUZXh0TGFiZWwiLCJzYXZlZFRleHRMYWJlbCIsImxheWVyVGV4dExhYmVsIiwic2F2ZWRUZXh0TGFiZWxzIiwidGV4dExhYmVsIiwiZmQiLCJhY2N1IiwidmFsaWRhdGVTYXZlZFZpc3VhbENoYW5uZWxzIiwibmV3TGF5ZXIiLCJzYXZlZExheWVyIiwidmFsdWVzIiwidmlzdWFsQ2hhbm5lbHMiLCJzY2FsZSIsImZvdW5kRmllbGQiLCJwcm9wIiwiZm91bmRDaGFubmVsIiwidXBkYXRlTGF5ZXJDb25maWciLCJ2YWxpZGF0ZVZpc3VhbENoYW5uZWwiLCJ0eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjb2x1bW5zIiwibGFiZWwiLCJjb2xvciIsImlzVmlzaWJsZSIsImhpZGRlbiIsImdldExheWVyQ29sdW1ucyIsInZpc0NvbmZpZyIsImNvcHlMYXllckNvbmZpZyIsInNoYWxsb3dDb3B5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBTUE7O0FBQ0E7O0FB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QUFDUSxpQkFBVCxDQUEyQjtBQUN6QkksSUFBQUEsT0FBTyxFQUFQQSxPQUR5QjtBQUV6Qk0sSUFBQUEsU0FBUyxFQUFUQSxTQUZ5QjtBQUd6QnRCLElBQUFBLFNBQVMsRUFBVEE7QUFIeUIsR0FBM0I7QUFNQSxTQUFPSSxRQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgdW5pcSBmcm9tICdsb2Rhc2gudW5pcSc7XG5pbXBvcnQgcGljayBmcm9tICdsb2Rhc2gucGljayc7XG5pbXBvcnQgaXNFcXVhbCBmcm9tICdsb2Rhc2guaXNlcXVhbCc7XG5pbXBvcnQgZmxhdHRlbkRlZXAgZnJvbSAnbG9kYXNoLmZsYXR0ZW5kZWVwJztcbmltcG9ydCB7dG9BcnJheX0gZnJvbSAndXRpbHMvdXRpbHMnO1xuXG5pbXBvcnQge1xuICBhcHBseUZpbHRlcnNUb0RhdGFzZXRzLFxuICBtZXJnZUZpbHRlckRvbWFpblN0ZXAsXG4gIHZhbGlkYXRlRmlsdGVyV2l0aERhdGFcbn0gZnJvbSAndXRpbHMvZmlsdGVyLXV0aWxzJztcblxuaW1wb3J0IHtnZXRJbml0aWFsTWFwTGF5ZXJzRm9yU3BsaXRNYXB9IGZyb20gJ3V0aWxzL3NwbGl0LW1hcC11dGlscyc7XG5pbXBvcnQge3Jlc2V0RmlsdGVyR3B1TW9kZSwgYXNzaWduR3B1Q2hhbm5lbHN9IGZyb20gJ3V0aWxzL2dwdS1maWx0ZXItdXRpbHMnO1xuXG5pbXBvcnQge0xBWUVSX0JMRU5ESU5HU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG4vKipcbiAqIE1lcmdlIGxvYWRlZCBmaWx0ZXJzIHdpdGggY3VycmVudCBzdGF0ZSwgaWYgbm8gZmllbGRzIG9yIGRhdGEgYXJlIGxvYWRlZFxuICogc2F2ZSBpdCBmb3IgbGF0ZXJcbiAqXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtbWVyZ2VyJykubWVyZ2VGaWx0ZXJzfVxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VGaWx0ZXJzKHN0YXRlLCBmaWx0ZXJzVG9NZXJnZSkge1xuICBjb25zdCBtZXJnZWQgPSBbXTtcbiAgY29uc3QgdW5tZXJnZWQgPSBbXTtcbiAgY29uc3Qge2RhdGFzZXRzfSA9IHN0YXRlO1xuICBsZXQgdXBkYXRlZERhdGFzZXRzID0gZGF0YXNldHM7XG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KGZpbHRlcnNUb01lcmdlKSB8fCAhZmlsdGVyc1RvTWVyZ2UubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgLy8gbWVyZ2UgZmlsdGVyc1xuICBmaWx0ZXJzVG9NZXJnZS5mb3JFYWNoKGZpbHRlciA9PiB7XG4gICAgLy8gd2UgY2FuIG9ubHkgbG9vayBmb3IgZGF0YXNldHMgZGVmaW5lIGluIHRoZSBmaWx0ZXIgZGF0YUlkXG4gICAgY29uc3QgZGF0YXNldElkcyA9IHRvQXJyYXkoZmlsdGVyLmRhdGFJZCk7XG5cbiAgICAvLyB3ZSBjYW4gbWVyZ2UgYSBmaWx0ZXIgb25seSBpZiBhbGwgZGF0YXNldHMgaW4gZmlsdGVyLmRhdGFJZCBhcmUgbG9hZGVkXG4gICAgaWYgKGRhdGFzZXRJZHMuZXZlcnkoZCA9PiBkYXRhc2V0c1tkXSkpIHtcbiAgICAgIC8vIGFsbCBkYXRhc2V0SWRzIGluIGZpbHRlciBtdXN0IGJlIHByZXNlbnQgdGhlIHN0YXRlIGRhdGFzZXRzXG4gICAgICBjb25zdCB7ZmlsdGVyOiB2YWxpZGF0ZWRGaWx0ZXIsIGFwcGx5VG9EYXRhc2V0cywgYXVnbWVudGVkRGF0YXNldHN9ID0gZGF0YXNldElkcy5yZWR1Y2UoXG4gICAgICAgIChhY2MsIGRhdGFzZXRJZCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGRhdGFzZXQgPSB1cGRhdGVkRGF0YXNldHNbZGF0YXNldElkXTtcbiAgICAgICAgICBjb25zdCBsYXllcnMgPSBzdGF0ZS5sYXllcnMuZmlsdGVyKGwgPT4gbC5jb25maWcuZGF0YUlkID09PSBkYXRhc2V0LmlkKTtcbiAgICAgICAgICBjb25zdCB7ZmlsdGVyOiB1cGRhdGVkRmlsdGVyLCBkYXRhc2V0OiB1cGRhdGVkRGF0YXNldH0gPSB2YWxpZGF0ZUZpbHRlcldpdGhEYXRhKFxuICAgICAgICAgICAgYWNjLmF1Z21lbnRlZERhdGFzZXRzW2RhdGFzZXRJZF0gfHwgZGF0YXNldCxcbiAgICAgICAgICAgIGZpbHRlcixcbiAgICAgICAgICAgIGxheWVyc1xuICAgICAgICAgICk7XG5cbiAgICAgICAgICBpZiAodXBkYXRlZEZpbHRlcikge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgLi4uYWNjLFxuICAgICAgICAgICAgICAvLyBtZXJnZSBmaWx0ZXIgcHJvcHNcbiAgICAgICAgICAgICAgZmlsdGVyOiBhY2MuZmlsdGVyXG4gICAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICAgIC4uLmFjYy5maWx0ZXIsXG4gICAgICAgICAgICAgICAgICAgIC4uLm1lcmdlRmlsdGVyRG9tYWluU3RlcChhY2MsIHVwZGF0ZWRGaWx0ZXIpXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgOiB1cGRhdGVkRmlsdGVyLFxuXG4gICAgICAgICAgICAgIGFwcGx5VG9EYXRhc2V0czogWy4uLmFjYy5hcHBseVRvRGF0YXNldHMsIGRhdGFzZXRJZF0sXG5cbiAgICAgICAgICAgICAgYXVnbWVudGVkRGF0YXNldHM6IHtcbiAgICAgICAgICAgICAgICAuLi5hY2MuYXVnbWVudGVkRGF0YXNldHMsXG4gICAgICAgICAgICAgICAgW2RhdGFzZXRJZF06IHVwZGF0ZWREYXRhc2V0XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZpbHRlcjogbnVsbCxcbiAgICAgICAgICBhcHBseVRvRGF0YXNldHM6IFtdLFxuICAgICAgICAgIGF1Z21lbnRlZERhdGFzZXRzOiB7fVxuICAgICAgICB9XG4gICAgICApO1xuXG4gICAgICBpZiAodmFsaWRhdGVkRmlsdGVyICYmIGlzRXF1YWwoZGF0YXNldElkcywgYXBwbHlUb0RhdGFzZXRzKSkge1xuICAgICAgICBtZXJnZWQucHVzaCh2YWxpZGF0ZWRGaWx0ZXIpO1xuICAgICAgICB1cGRhdGVkRGF0YXNldHMgPSB7XG4gICAgICAgICAgLi4udXBkYXRlZERhdGFzZXRzLFxuICAgICAgICAgIC4uLmF1Z21lbnRlZERhdGFzZXRzXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHVubWVyZ2VkLnB1c2goZmlsdGVyKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIG1lcmdlIGZpbHRlciB3aXRoIGV4aXN0aW5nXG4gIGxldCB1cGRhdGVkRmlsdGVycyA9IFsuLi4oc3RhdGUuZmlsdGVycyB8fCBbXSksIC4uLm1lcmdlZF07XG4gIHVwZGF0ZWRGaWx0ZXJzID0gcmVzZXRGaWx0ZXJHcHVNb2RlKHVwZGF0ZWRGaWx0ZXJzKTtcbiAgdXBkYXRlZEZpbHRlcnMgPSBhc3NpZ25HcHVDaGFubmVscyh1cGRhdGVkRmlsdGVycyk7XG4gIC8vIGZpbHRlciBkYXRhXG4gIGNvbnN0IGRhdGFzZXRzVG9GaWx0ZXIgPSB1bmlxKGZsYXR0ZW5EZWVwKG1lcmdlZC5tYXAoZiA9PiBmLmRhdGFJZCkpKTtcblxuICBjb25zdCBmaWx0ZXJlZCA9IGFwcGx5RmlsdGVyc1RvRGF0YXNldHMoXG4gICAgZGF0YXNldHNUb0ZpbHRlcixcbiAgICB1cGRhdGVkRGF0YXNldHMsXG4gICAgdXBkYXRlZEZpbHRlcnMsXG4gICAgc3RhdGUubGF5ZXJzXG4gICk7XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBmaWx0ZXJzOiB1cGRhdGVkRmlsdGVycyxcbiAgICBkYXRhc2V0czogZmlsdGVyZWQsXG4gICAgZmlsdGVyVG9CZU1lcmdlZDogdW5tZXJnZWRcbiAgfTtcbn1cblxuLyoqXG4gKiBNZXJnZSBsYXllcnMgZnJvbSBkZS1zZXJpYWxpemVkIHN0YXRlLCBpZiBubyBmaWVsZHMgb3IgZGF0YSBhcmUgbG9hZGVkXG4gKiBzYXZlIGl0IGZvciBsYXRlclxuICpcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1tZXJnZXInKS5tZXJnZUxheWVyc31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlTGF5ZXJzKHN0YXRlLCBsYXllcnNUb01lcmdlKSB7XG4gIGNvbnN0IG1lcmdlZExheWVyID0gW107XG4gIGNvbnN0IHVubWVyZ2VkID0gW107XG5cbiAgY29uc3Qge2RhdGFzZXRzfSA9IHN0YXRlO1xuXG4gIGlmICghQXJyYXkuaXNBcnJheShsYXllcnNUb01lcmdlKSB8fCAhbGF5ZXJzVG9NZXJnZS5sZW5ndGgpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICBsYXllcnNUb01lcmdlLmZvckVhY2gobGF5ZXIgPT4ge1xuICAgIGlmIChkYXRhc2V0c1tsYXllci5jb25maWcuZGF0YUlkXSkge1xuICAgICAgLy8gZGF0YXNldHMgYXJlIGFscmVhZHkgbG9hZGVkXG4gICAgICBjb25zdCB2YWxpZGF0ZUxheWVyID0gdmFsaWRhdGVMYXllcldpdGhEYXRhKFxuICAgICAgICBkYXRhc2V0c1tsYXllci5jb25maWcuZGF0YUlkXSxcbiAgICAgICAgbGF5ZXIsXG4gICAgICAgIHN0YXRlLmxheWVyQ2xhc3Nlc1xuICAgICAgKTtcblxuICAgICAgaWYgKHZhbGlkYXRlTGF5ZXIpIHtcbiAgICAgICAgbWVyZ2VkTGF5ZXIucHVzaCh2YWxpZGF0ZUxheWVyKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZGF0YXNldHMgbm90IHlldCBsb2FkZWRcbiAgICAgIHVubWVyZ2VkLnB1c2gobGF5ZXIpO1xuICAgIH1cbiAgfSk7XG5cbiAgY29uc3QgbGF5ZXJzID0gWy4uLnN0YXRlLmxheWVycywgLi4ubWVyZ2VkTGF5ZXJdO1xuICBjb25zdCBuZXdMYXllck9yZGVyID0gbWVyZ2VkTGF5ZXIubWFwKChfLCBpKSA9PiBzdGF0ZS5sYXllcnMubGVuZ3RoICsgaSk7XG5cbiAgLy8gcHV0IG5ldyBsYXllcnMgaW4gZnJvbnQgb2YgY3VycmVudCBsYXllcnNcbiAgY29uc3QgbGF5ZXJPcmRlciA9IFsuLi5uZXdMYXllck9yZGVyLCAuLi5zdGF0ZS5sYXllck9yZGVyXTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGxheWVycyxcbiAgICBsYXllck9yZGVyLFxuICAgIGxheWVyVG9CZU1lcmdlZDogdW5tZXJnZWRcbiAgfTtcbn1cblxuLyoqXG4gKiBNZXJnZSBpbnRlcmFjdGlvbnMgd2l0aCBzYXZlZCBjb25maWdcbiAqXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtbWVyZ2VyJykubWVyZ2VJbnRlcmFjdGlvbnN9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZUludGVyYWN0aW9ucyhzdGF0ZSwgaW50ZXJhY3Rpb25Ub0JlTWVyZ2VkKSB7XG4gIGNvbnN0IG1lcmdlZCA9IHt9O1xuICBjb25zdCB1bm1lcmdlZCA9IHt9O1xuXG4gIGlmIChpbnRlcmFjdGlvblRvQmVNZXJnZWQpIHtcbiAgICBPYmplY3Qua2V5cyhpbnRlcmFjdGlvblRvQmVNZXJnZWQpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGlmICghc3RhdGUuaW50ZXJhY3Rpb25Db25maWdba2V5XSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGN1cnJlbnRDb25maWcgPSBzdGF0ZS5pbnRlcmFjdGlvbkNvbmZpZ1trZXldLmNvbmZpZztcblxuICAgICAgY29uc3Qge2VuYWJsZWQsIC4uLmNvbmZpZ1NhdmVkfSA9IGludGVyYWN0aW9uVG9CZU1lcmdlZFtrZXldIHx8IHt9O1xuICAgICAgbGV0IGNvbmZpZ1RvTWVyZ2UgPSBjb25maWdTYXZlZDtcblxuICAgICAgaWYgKGtleSA9PT0gJ3Rvb2x0aXAnKSB7XG4gICAgICAgIGNvbnN0IHttZXJnZWRUb29sdGlwLCB1bm1lcmdlZFRvb2x0aXB9ID0gbWVyZ2VJbnRlcmFjdGlvblRvb2x0aXBDb25maWcoc3RhdGUsIGNvbmZpZ1NhdmVkKTtcblxuICAgICAgICAvLyBtZXJnZSBuZXcgZGF0YXNldCB0b29sdGlwcyB3aXRoIG9yaWdpbmFsIGRhdGFzZXQgdG9vbHRpcHNcbiAgICAgICAgY29uZmlnVG9NZXJnZSA9IHtcbiAgICAgICAgICBmaWVsZHNUb1Nob3c6IHtcbiAgICAgICAgICAgIC4uLmN1cnJlbnRDb25maWcuZmllbGRzVG9TaG93LFxuICAgICAgICAgICAgLi4ubWVyZ2VkVG9vbHRpcFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoT2JqZWN0LmtleXModW5tZXJnZWRUb29sdGlwKS5sZW5ndGgpIHtcbiAgICAgICAgICB1bm1lcmdlZC50b29sdGlwID0ge2ZpZWxkc1RvU2hvdzogdW5tZXJnZWRUb29sdGlwLCBlbmFibGVkfTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBtZXJnZWRba2V5XSA9IHtcbiAgICAgICAgLi4uc3RhdGUuaW50ZXJhY3Rpb25Db25maWdba2V5XSxcbiAgICAgICAgZW5hYmxlZCxcbiAgICAgICAgLi4uKGN1cnJlbnRDb25maWdcbiAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgY29uZmlnOiBwaWNrKFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIC4uLmN1cnJlbnRDb25maWcsXG4gICAgICAgICAgICAgICAgICAuLi5jb25maWdUb01lcmdlXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhjdXJyZW50Q29uZmlnKVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgOiB7fSlcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGludGVyYWN0aW9uQ29uZmlnOiB7XG4gICAgICAuLi5zdGF0ZS5pbnRlcmFjdGlvbkNvbmZpZyxcbiAgICAgIC4uLm1lcmdlZFxuICAgIH0sXG4gICAgaW50ZXJhY3Rpb25Ub0JlTWVyZ2VkOiB1bm1lcmdlZFxuICB9O1xufVxuXG4vKipcbiAqIE1lcmdlIHNwbGl0TWFwcyBjb25maWcgd2l0aCBjdXJyZW50IHZpc1N0ZXRlLlxuICogMS4gaWYgY3VycmVudCBtYXAgaXMgc3BsaXQsIGJ1dCBzcGxpdE1hcCBET0VTTk9UIGNvbnRhaW4gbWFwc1xuICogICAgOiBkb24ndCBtZXJnZSBhbnl0aGluZ1xuICogMi4gaWYgY3VycmVudCBtYXAgaXMgTk9UIHNwbGl0LCBidXQgc3BsaXRNYXBzIGNvbnRhaW4gbWFwc1xuICogICAgOiBhZGQgdG8gc3BsaXRNYXBzLCBhbmQgYWRkIGN1cnJlbnQgbGF5ZXJzIHRvIHNwbGl0TWFwc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLW1lcmdlcicpLm1lcmdlSW50ZXJhY3Rpb25zfVxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VTcGxpdE1hcHMoc3RhdGUsIHNwbGl0TWFwcyA9IFtdKSB7XG4gIGNvbnN0IG1lcmdlZCA9IFsuLi5zdGF0ZS5zcGxpdE1hcHNdO1xuICBjb25zdCB1bm1lcmdlZCA9IFtdO1xuICBzcGxpdE1hcHMuZm9yRWFjaCgoc20sIGkpID0+IHtcbiAgICBPYmplY3QuZW50cmllcyhzbS5sYXllcnMpLmZvckVhY2goKFtpZCwgdmFsdWVdKSA9PiB7XG4gICAgICAvLyBjaGVjayBpZiBsYXllciBleGlzdHNcbiAgICAgIGNvbnN0IHB1c2hUbyA9IHN0YXRlLmxheWVycy5maW5kKGwgPT4gbC5pZCA9PT0gaWQpID8gbWVyZ2VkIDogdW5tZXJnZWQ7XG5cbiAgICAgIC8vIGNyZWF0ZSBtYXAgcGFuZWwgaWYgY3VycmVudCBtYXAgaXMgbm90IHNwbGl0XG4gICAgICBwdXNoVG9baV0gPSBwdXNoVG9baV0gfHwge1xuICAgICAgICBsYXllcnM6IHB1c2hUbyA9PT0gbWVyZ2VkID8gZ2V0SW5pdGlhbE1hcExheWVyc0ZvclNwbGl0TWFwKHN0YXRlLmxheWVycykgOiBbXVxuICAgICAgfTtcbiAgICAgIHB1c2hUb1tpXS5sYXllcnMgPSB7XG4gICAgICAgIC4uLnB1c2hUb1tpXS5sYXllcnMsXG4gICAgICAgIFtpZF06IHZhbHVlXG4gICAgICB9O1xuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIHNwbGl0TWFwczogbWVyZ2VkLFxuICAgIHNwbGl0TWFwc1RvQmVNZXJnZWQ6IHVubWVyZ2VkXG4gIH07XG59XG5cbi8qKlxuICogTWVyZ2UgaW50ZXJhY3Rpb25Db25maWcudG9vbHRpcCB3aXRoIHNhdmVkIGNvbmZpZyxcbiAqIHZhbGlkYXRlIGZpZWxkc1RvU2hvd1xuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBzdGF0ZVxuICogQHBhcmFtIHtvYmplY3R9IHRvb2x0aXBDb25maWdcbiAqIEByZXR1cm4ge29iamVjdH0gLSB7bWVyZ2VkVG9vbHRpcDoge30sIHVubWVyZ2VkVG9vbHRpcDoge319XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZUludGVyYWN0aW9uVG9vbHRpcENvbmZpZyhzdGF0ZSwgdG9vbHRpcENvbmZpZyA9IHt9KSB7XG4gIGNvbnN0IHVubWVyZ2VkVG9vbHRpcCA9IHt9O1xuICBjb25zdCBtZXJnZWRUb29sdGlwID0ge307XG5cbiAgaWYgKCF0b29sdGlwQ29uZmlnLmZpZWxkc1RvU2hvdyB8fCAhT2JqZWN0LmtleXModG9vbHRpcENvbmZpZy5maWVsZHNUb1Nob3cpLmxlbmd0aCkge1xuICAgIHJldHVybiB7bWVyZ2VkVG9vbHRpcCwgdW5tZXJnZWRUb29sdGlwfTtcbiAgfVxuXG4gIGZvciAoY29uc3QgZGF0YUlkIGluIHRvb2x0aXBDb25maWcuZmllbGRzVG9TaG93KSB7XG4gICAgaWYgKCFzdGF0ZS5kYXRhc2V0c1tkYXRhSWRdKSB7XG4gICAgICAvLyBpcyBub3QgeWV0IGxvYWRlZFxuICAgICAgdW5tZXJnZWRUb29sdGlwW2RhdGFJZF0gPSB0b29sdGlwQ29uZmlnLmZpZWxkc1RvU2hvd1tkYXRhSWRdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBpZiBkYXRhc2V0IGlzIGxvYWRlZFxuICAgICAgY29uc3QgYWxsRmllbGRzID0gc3RhdGUuZGF0YXNldHNbZGF0YUlkXS5maWVsZHMubWFwKGQgPT4gZC5uYW1lKTtcbiAgICAgIGNvbnN0IGZvdW5kRmllbGRzVG9TaG93ID0gdG9vbHRpcENvbmZpZy5maWVsZHNUb1Nob3dbZGF0YUlkXS5maWx0ZXIoZmllbGQgPT5cbiAgICAgICAgYWxsRmllbGRzLmluY2x1ZGVzKGZpZWxkLm5hbWUpXG4gICAgICApO1xuXG4gICAgICBtZXJnZWRUb29sdGlwW2RhdGFJZF0gPSBmb3VuZEZpZWxkc1RvU2hvdztcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge21lcmdlZFRvb2x0aXAsIHVubWVyZ2VkVG9vbHRpcH07XG59XG4vKipcbiAqIE1lcmdlIGxheWVyQmxlbmRpbmcgd2l0aCBzYXZlZFxuICpcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1tZXJnZXInKS5tZXJnZUxheWVyQmxlbmRpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZUxheWVyQmxlbmRpbmcoc3RhdGUsIGxheWVyQmxlbmRpbmcpIHtcbiAgaWYgKGxheWVyQmxlbmRpbmcgJiYgTEFZRVJfQkxFTkRJTkdTW2xheWVyQmxlbmRpbmddKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgbGF5ZXJCbGVuZGluZ1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gc3RhdGU7XG59XG5cbi8qKlxuICogTWVyZ2UgYW5pbWF0aW9uIGNvbmZpZ1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLW1lcmdlcicpLm1lcmdlQW5pbWF0aW9uQ29uZmlnfVxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VBbmltYXRpb25Db25maWcoc3RhdGUsIGFuaW1hdGlvbikge1xuICBpZiAoYW5pbWF0aW9uICYmIGFuaW1hdGlvbi5jdXJyZW50VGltZSkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGFuaW1hdGlvbkNvbmZpZzoge1xuICAgICAgICAuLi5zdGF0ZS5hbmltYXRpb25Db25maWcsXG4gICAgICAgIC4uLmFuaW1hdGlvbixcbiAgICAgICAgZG9tYWluOiBudWxsXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBzdGF0ZTtcbn1cblxuLyoqXG4gKiBWYWxpZGF0ZSBzYXZlZCBsYXllciBjb2x1bW5zIHdpdGggbmV3IGRhdGEsXG4gKiB1cGRhdGUgZmllbGRJZHggYmFzZWQgb24gbmV3IGZpZWxkc1xuICpcbiAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gZmllbGRzXG4gKiBAcGFyYW0ge09iamVjdH0gc2F2ZWRDb2xzXG4gKiBAcGFyYW0ge09iamVjdH0gZW1wdHlDb2xzXG4gKiBAcmV0dXJuIHtudWxsIHwgT2JqZWN0fSAtIHZhbGlkYXRlZCBjb2x1bW5zIG9yIG51bGxcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVTYXZlZExheWVyQ29sdW1ucyhmaWVsZHMsIHNhdmVkQ29scywgZW1wdHlDb2xzKSB7XG4gIGNvbnN0IGNvbEZvdW5kID0ge307XG4gIC8vIGZpbmQgYWN0dWFsIGNvbHVtbiBmaWVsZElkeCwgaW4gY2FzZSBpdCBoYXMgY2hhbmdlZFxuICBjb25zdCBhbGxDb2xGb3VuZCA9IE9iamVjdC5rZXlzKGVtcHR5Q29scykuZXZlcnkoa2V5ID0+IHtcbiAgICBjb25zdCBzYXZlZCA9IHNhdmVkQ29sc1trZXldO1xuICAgIGNvbEZvdW5kW2tleV0gPSB7Li4uZW1wdHlDb2xzW2tleV19O1xuXG4gICAgLy8gVE9ETzogcmVwbGFjZSB3aXRoIG5ldyBhcHByb2FjaFxuICAgIGNvbnN0IGZpZWxkSWR4ID0gZmllbGRzLmZpbmRJbmRleCgoe25hbWV9KSA9PiBuYW1lID09PSBzYXZlZCk7XG5cbiAgICBpZiAoZmllbGRJZHggPiAtMSkge1xuICAgICAgLy8gdXBkYXRlIGZvdW5kIGNvbHVtbnNcbiAgICAgIGNvbEZvdW5kW2tleV0uZmllbGRJZHggPSBmaWVsZElkeDtcbiAgICAgIGNvbEZvdW5kW2tleV0udmFsdWUgPSBzYXZlZDtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIGlmIGNvbCBpcyBvcHRpb25hbCwgYWxsb3cgbnVsbCB2YWx1ZVxuICAgIHJldHVybiBlbXB0eUNvbHNba2V5XS5vcHRpb25hbCB8fCBmYWxzZTtcbiAgfSk7XG5cbiAgcmV0dXJuIGFsbENvbEZvdW5kICYmIGNvbEZvdW5kO1xufVxuXG4vKipcbiAqIFZhbGlkYXRlIHNhdmVkIHRleHQgbGFiZWwgY29uZmlnIHdpdGggbmV3IGRhdGFcbiAqIHJlZmVyIHRvIHZpcy1zdGF0ZS1zY2hlbWEuanMgVGV4dExhYmVsU2NoZW1hVjFcbiAqXG4gKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IGZpZWxkc1xuICogQHBhcmFtIHtPYmplY3R9IHNhdmVkVGV4dExhYmVsXG4gKiBAcmV0dXJuIHtPYmplY3R9IC0gdmFsaWRhdGVkIHRleHRsYWJlbFxuICovXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVTYXZlZFRleHRMYWJlbChmaWVsZHMsIFtsYXllclRleHRMYWJlbF0sIHNhdmVkVGV4dExhYmVsKSB7XG4gIGNvbnN0IHNhdmVkVGV4dExhYmVscyA9IEFycmF5LmlzQXJyYXkoc2F2ZWRUZXh0TGFiZWwpID8gc2F2ZWRUZXh0TGFiZWwgOiBbc2F2ZWRUZXh0TGFiZWxdO1xuXG4gIC8vIHZhbGlkYXRlIGZpZWxkXG4gIHJldHVybiBzYXZlZFRleHRMYWJlbHMubWFwKHRleHRMYWJlbCA9PiB7XG4gICAgY29uc3QgZmllbGQgPSB0ZXh0TGFiZWwuZmllbGRcbiAgICAgID8gZmllbGRzLmZpbmQoZmQgPT5cbiAgICAgICAgICBPYmplY3Qua2V5cyh0ZXh0TGFiZWwuZmllbGQpLmV2ZXJ5KGtleSA9PiB0ZXh0TGFiZWwuZmllbGRba2V5XSA9PT0gZmRba2V5XSlcbiAgICAgICAgKVxuICAgICAgOiBudWxsO1xuXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGxheWVyVGV4dExhYmVsKS5yZWR1Y2UoXG4gICAgICAoYWNjdSwga2V5KSA9PiAoe1xuICAgICAgICAuLi5hY2N1LFxuICAgICAgICBba2V5XToga2V5ID09PSAnZmllbGQnID8gZmllbGQgOiB0ZXh0TGFiZWxba2V5XSB8fCBsYXllclRleHRMYWJlbFtrZXldXG4gICAgICB9KSxcbiAgICAgIHt9XG4gICAgKTtcbiAgfSk7XG59XG5cbi8qKlxuICogVmFsaWRhdGUgc2F2ZWQgdmlzdWFsIGNoYW5uZWxzIGNvbmZpZyB3aXRoIG5ldyBkYXRhLFxuICogcmVmZXIgdG8gdmlzLXN0YXRlLXNjaGVtYS5qcyBWaXN1YWxDaGFubmVsU2NoZW1hVjFcbiAqXG4gKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IGZpZWxkc1xuICogQHBhcmFtIHtPYmplY3R9IG5ld0xheWVyXG4gKiBAcGFyYW0ge09iamVjdH0gc2F2ZWRMYXllclxuICogQHJldHVybiB7T2JqZWN0fSAtIG5ld0xheWVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVNhdmVkVmlzdWFsQ2hhbm5lbHMoZmllbGRzLCBuZXdMYXllciwgc2F2ZWRMYXllcikge1xuICBPYmplY3QudmFsdWVzKG5ld0xheWVyLnZpc3VhbENoYW5uZWxzKS5mb3JFYWNoKCh7ZmllbGQsIHNjYWxlLCBrZXl9KSA9PiB7XG4gICAgbGV0IGZvdW5kRmllbGQ7XG4gICAgaWYgKHNhdmVkTGF5ZXIuY29uZmlnW2ZpZWxkXSkge1xuICAgICAgZm91bmRGaWVsZCA9IGZpZWxkcy5maW5kKGZkID0+XG4gICAgICAgIE9iamVjdC5rZXlzKHNhdmVkTGF5ZXIuY29uZmlnW2ZpZWxkXSkuZXZlcnkoXG4gICAgICAgICAgcHJvcCA9PiBzYXZlZExheWVyLmNvbmZpZ1tmaWVsZF1bcHJvcF0gPT09IGZkW3Byb3BdXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgZm91bmRDaGFubmVsID0ge1xuICAgICAgLi4uKGZvdW5kRmllbGQgPyB7W2ZpZWxkXTogZm91bmRGaWVsZH0gOiB7fSksXG4gICAgICAuLi4oc2F2ZWRMYXllci5jb25maWdbc2NhbGVdID8ge1tzY2FsZV06IHNhdmVkTGF5ZXIuY29uZmlnW3NjYWxlXX0gOiB7fSlcbiAgICB9O1xuICAgIGlmIChPYmplY3Qua2V5cyhmb3VuZENoYW5uZWwpLmxlbmd0aCkge1xuICAgICAgbmV3TGF5ZXIudXBkYXRlTGF5ZXJDb25maWcoZm91bmRDaGFubmVsKTtcbiAgICAgIG5ld0xheWVyLnZhbGlkYXRlVmlzdWFsQ2hhbm5lbChrZXkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBuZXdMYXllcjtcbn1cblxuLyoqXG4gKiBWYWxpZGF0ZSBzYXZlZCBsYXllciBjb25maWcgd2l0aCBuZXcgZGF0YSxcbiAqIHVwZGF0ZSBmaWVsZElkeCBiYXNlZCBvbiBuZXcgZmllbGRzXG4gKiBAcGFyYW0ge29iamVjdH0gZGF0YXNldFxuICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBkYXRhc2V0LmZpZWxkc1xuICogQHBhcmFtIHtzdHJpbmd9IGRhdGFzZXQuaWRcbiAqIEBwYXJhbSB7T2JqZWN0fSBzYXZlZExheWVyXG4gKiBAcGFyYW0ge09iamVjdH0gbGF5ZXJDbGFzc2VzXG4gKiBAcmV0dXJuIHtudWxsIHwgT2JqZWN0fSAtIHZhbGlkYXRlZCBsYXllciBvciBudWxsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUxheWVyV2l0aERhdGEoe2ZpZWxkcywgaWQ6IGRhdGFJZH0sIHNhdmVkTGF5ZXIsIGxheWVyQ2xhc3Nlcykge1xuICBjb25zdCB7dHlwZX0gPSBzYXZlZExheWVyO1xuICAvLyBsYXllciBkb2VzbnQgaGF2ZSBhIHZhbGlkIHR5cGVcbiAgaWYgKCFsYXllckNsYXNzZXMuaGFzT3duUHJvcGVydHkodHlwZSkgfHwgIXNhdmVkTGF5ZXIuY29uZmlnIHx8ICFzYXZlZExheWVyLmNvbmZpZy5jb2x1bW5zKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBsZXQgbmV3TGF5ZXIgPSBuZXcgbGF5ZXJDbGFzc2VzW3R5cGVdKHtcbiAgICBpZDogc2F2ZWRMYXllci5pZCxcbiAgICBkYXRhSWQsXG4gICAgbGFiZWw6IHNhdmVkTGF5ZXIuY29uZmlnLmxhYmVsLFxuICAgIGNvbG9yOiBzYXZlZExheWVyLmNvbmZpZy5jb2xvcixcbiAgICBpc1Zpc2libGU6IHNhdmVkTGF5ZXIuY29uZmlnLmlzVmlzaWJsZSxcbiAgICBoaWRkZW46IHNhdmVkTGF5ZXIuY29uZmlnLmhpZGRlblxuICB9KTtcblxuICAvLyBmaW5kIGNvbHVtbiBmaWVsZElkeFxuICBjb25zdCBjb2x1bW5zID0gdmFsaWRhdGVTYXZlZExheWVyQ29sdW1ucyhcbiAgICBmaWVsZHMsXG4gICAgc2F2ZWRMYXllci5jb25maWcuY29sdW1ucyxcbiAgICBuZXdMYXllci5nZXRMYXllckNvbHVtbnMoKVxuICApO1xuXG4gIGlmICghY29sdW1ucykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gdmlzdWFsIGNoYW5uZWwgZmllbGQgaXMgc2F2ZWQgdG8gYmUge25hbWUsIHR5cGV9XG4gIC8vIGZpbmQgdmlzdWFsIGNoYW5uZWwgZmllbGQgYnkgbWF0Y2hpbmcgYm90aCBuYW1lIGFuZCB0eXBlXG4gIC8vIHJlZmVyIHRvIHZpcy1zdGF0ZS1zY2hlbWEuanMgVmlzdWFsQ2hhbm5lbFNjaGVtYVYxXG4gIG5ld0xheWVyID0gdmFsaWRhdGVTYXZlZFZpc3VhbENoYW5uZWxzKGZpZWxkcywgbmV3TGF5ZXIsIHNhdmVkTGF5ZXIpO1xuXG4gIGNvbnN0IHRleHRMYWJlbCA9XG4gICAgc2F2ZWRMYXllci5jb25maWcudGV4dExhYmVsICYmIG5ld0xheWVyLmNvbmZpZy50ZXh0TGFiZWxcbiAgICAgID8gdmFsaWRhdGVTYXZlZFRleHRMYWJlbChmaWVsZHMsIG5ld0xheWVyLmNvbmZpZy50ZXh0TGFiZWwsIHNhdmVkTGF5ZXIuY29uZmlnLnRleHRMYWJlbClcbiAgICAgIDogbmV3TGF5ZXIuY29uZmlnLnRleHRMYWJlbDtcblxuICAvLyBjb3B5IHZpc0NvbmZpZyBvdmVyIHRvIGVtcHR5TGF5ZXIgdG8gbWFrZSBzdXJlIGl0IGhhcyBhbGwgdGhlIHByb3BzXG4gIGNvbnN0IHZpc0NvbmZpZyA9IG5ld0xheWVyLmNvcHlMYXllckNvbmZpZyhcbiAgICBuZXdMYXllci5jb25maWcudmlzQ29uZmlnLFxuICAgIHNhdmVkTGF5ZXIuY29uZmlnLnZpc0NvbmZpZyB8fCB7fSxcbiAgICB7c2hhbGxvd0NvcHk6IFsnY29sb3JSYW5nZScsICdzdHJva2VDb2xvclJhbmdlJ119XG4gICk7XG5cbiAgbmV3TGF5ZXIudXBkYXRlTGF5ZXJDb25maWcoe1xuICAgIGNvbHVtbnMsXG4gICAgdmlzQ29uZmlnLFxuICAgIHRleHRMYWJlbFxuICB9KTtcblxuICByZXR1cm4gbmV3TGF5ZXI7XG59XG4iXX0=