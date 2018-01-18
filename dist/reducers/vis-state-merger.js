'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

exports.mergeFilters = mergeFilters;
exports.mergeLayers = mergeLayers;
exports.mergeInteractions = mergeInteractions;
exports.mergeInteractionTooltipConfig = mergeInteractionTooltipConfig;
exports.mergeLayerBlending = mergeLayerBlending;
exports.validateSavedLayerColumns = validateSavedLayerColumns;
exports.validateSavedVisualChannels = validateSavedVisualChannels;
exports.validateLayerWithData = validateLayerWithData;
exports.validateFilterWithData = validateFilterWithData;

var _lodash = require('lodash.uniq');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.pick');

var _lodash4 = _interopRequireDefault(_lodash3);

var _keplerglLayers = require('../keplergl-layers');

var KeplerGLLayers = _interopRequireWildcard(_keplerglLayers);

var _filterUtils = require('../utils/filter-utils');

var _defaultSettings = require('../constants/default-settings');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Merge loaded filters with current state, if no fields or data are loaded
 * save it for later
 *
 * @param {Object} state
 * @param {Object[]} filtersToMerge
 * @return {Object} updatedState
 */
function mergeFilters(state, filtersToMerge) {
  var merged = [];
  var unmerged = [];
  var datasets = state.datasets;


  if (!Array.isArray(filtersToMerge) || !filtersToMerge.length) {
    return state;
  }

  // merge filters
  filtersToMerge.forEach(function (filter) {
    // match filter.dataId with current datesets id
    // uploaded data need to have the same dataId with the filter
    if (datasets[filter.dataId]) {
      // datasets is already loaded
      var validateFilter = validateFilterWithData(datasets[filter.dataId], filter);

      if (validateFilter) {
        merged.push(validateFilter);
      }
    } else {
      // datasets not yet loaded
      unmerged.push(filter);
    }
  });

  // filter data
  var updatedFilters = [].concat(state.filters || [], merged);
  var datasetToFilter = (0, _lodash2.default)(merged.map(function (d) {
    return d.dataId;
  }));

  var updatedDataset = datasetToFilter.reduce(function (accu, dataId) {
    var _extends2;

    return (0, _extends4.default)({}, accu, (_extends2 = {}, _extends2[dataId] = (0, _extends4.default)({}, datasets[dataId], (0, _filterUtils.filterData)(datasets[dataId].allData, dataId, updatedFilters)), _extends2));
  }, datasets);

  return (0, _extends4.default)({}, state, {
    filters: updatedFilters,
    datasets: updatedDataset,
    filterToBeMerged: unmerged
  });
}

/**
 * Merge layers from de-serialized state, if no fields or data are loaded
 * save it for later
 *
 * @param {object} state
 * @param {Object[]} layersToMerge
 * @return {Object} state
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
      var validateLayer = validateLayerWithData(datasets[layer.config.dataId], layer);

      if (validateLayer) {
        mergedLayer.push(validateLayer);
      }
    } else {
      // datasets not yet loaded
      unmerged.push(layer);
    }
  });

  var layers = [].concat(state.layers, mergedLayer);
  var newLayerOrder = mergedLayer.map(function (_, i) {
    return state.layers.length + i;
  });

  // put new layers in front of current layers
  var layerOrder = [].concat(newLayerOrder, state.layerOrder);

  return (0, _extends4.default)({}, state, {
    layers: layers,
    layerOrder: layerOrder,
    layerToBeMerged: unmerged
  });
}

/**
 * Merge interactions with saved config
 *
 * @param {object} state
 * @param {Object} interactionToBeMerged
 * @return {Object} mergedState
 */
function mergeInteractions(state, interactionToBeMerged) {
  var merged = {};
  var unmerged = {};

  if (interactionToBeMerged) {
    Object.keys(interactionToBeMerged).forEach(function (key) {
      if (!state.interactionConfig[key]) {
        return;
      }

      var _ref = interactionToBeMerged[key] || {},
          enabled = _ref.enabled,
          configSaved = (0, _objectWithoutProperties3.default)(_ref, ['enabled']);

      var configToMerge = configSaved;

      if (key === 'tooltip') {
        var _mergeInteractionTool = mergeInteractionTooltipConfig(state, configSaved),
            mergedTooltip = _mergeInteractionTool.mergedTooltip,
            unmergedTooltip = _mergeInteractionTool.unmergedTooltip;

        // merge new dataset tooltips with original dataset tooltips


        configToMerge = {
          fieldsToShow: (0, _extends4.default)({}, state.interactionConfig[key].config.fieldsToShow, mergedTooltip)
        };

        if (Object.keys(unmergedTooltip).length) {
          unmerged.tooltip = { fieldsToShow: unmergedTooltip, enabled: enabled };
        }
      }

      merged[key] = (0, _extends4.default)({}, state.interactionConfig[key], {
        enabled: enabled,
        config: (0, _lodash4.default)((0, _extends4.default)({}, state.interactionConfig[key].config, configToMerge), Object.keys(state.interactionConfig[key].config))
      });
    });
  }

  return (0, _extends4.default)({}, state, {
    interactionConfig: (0, _extends4.default)({}, state.interactionConfig, merged),
    interactionToBeMerged: unmerged
  });
}

/**
 * Merge interactionConfig.tooltip with saved config,
 * validate fieldsToShow
 *
 * @param {string} state
 * @param {Object} tooltipConfig
 * @return {Object} - {mergedTooltip: {}, unmergedTooltip: {}}
 */
function mergeInteractionTooltipConfig(state) {
  var tooltipConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var unmergedTooltip = {};
  var mergedTooltip = {};

  if (!tooltipConfig.fieldsToShow || !Object.keys(tooltipConfig.fieldsToShow).length) {
    return { mergedTooltip: mergedTooltip, unmergedTooltip: unmergedTooltip };
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
        var foundFieldsToShow = tooltipConfig.fieldsToShow[dataId].filter(function (name) {
          return allFields.includes(name);
        });

        mergedTooltip[dataId] = foundFieldsToShow;
      })();
    }
  }

  return { mergedTooltip: mergedTooltip, unmergedTooltip: unmergedTooltip };
}
/**
 * Merge layerBlending with saved
 *
 * @param {object} state
 * @param {string} layerBlending
 * @return {object} merged state
 */
function mergeLayerBlending(state, layerBlending) {
  if (layerBlending && _defaultSettings.LAYER_BLENDINGS[layerBlending]) {
    return (0, _extends4.default)({}, state, {
      layerBlending: layerBlending
    });
  }

  return state;
}

/**
 * Validate saved layer columns with new data,
 * update fieldIdx based on new fields
 *
 * @param {Object[]} fields
 * @param {Object} savedCols
 * @param {Object} emptyCols
 * @return {null | Object} - validated columns or null
 */

function validateSavedLayerColumns(fields, savedCols, emptyCols) {
  var colFound = {};
  // find actual column fieldIdx, in case it has changed
  var allColFound = Object.keys(emptyCols).every(function (key) {
    var saved = savedCols[key];
    colFound[key] = (0, _extends4.default)({}, emptyCols[key]);

    var fieldIdx = fields.findIndex(function (_ref2) {
      var name = _ref2.name;
      return name === saved;
    });

    if (fieldIdx > -1) {
      // update found columns
      colFound[key].fieldIdx = fieldIdx;
      colFound[key].value = saved;
      return true;
    }

    // if col is optional, allow null value
    return emptyCols[key].optional || false;
  });

  return allColFound && colFound;
}

/**
 * Validate saved visual channels config with new data,
 * refer to vis-state-schema.js VisualChannelSchemaV1
 *
 * @param {Object[]} fields
 * @param {Object} visualChannels
 * @param {Object} savedLayer
 * @return {Object} - validated visual channel in config or {}
 */
function validateSavedVisualChannels(fields, visualChannels, savedLayer) {
  return Object.values(visualChannels).reduce(function (found, _ref3) {
    var _ref4, _ref5;

    var field = _ref3.field,
        scale = _ref3.scale;

    var foundField = void 0;
    if (savedLayer.config[field]) {
      foundField = fields.find(function (fd) {
        return Object.keys(savedLayer.config[field]).every(function (key) {
          return savedLayer.config[field][key] === fd[key];
        });
      });
    }

    return (0, _extends4.default)({}, found, foundField ? (_ref4 = {}, _ref4[field] = foundField, _ref4) : {}, savedLayer.config[scale] ? (_ref5 = {}, _ref5[scale] = savedLayer.config[scale], _ref5) : {});
  }, {});
}

/**
 * Validate saved layer config with new data,
 * update fieldIdx based on new fields
 *
 * @param {Object[]} fields
 * @param {String} dataId
 * @param {Object} savedLayer
 * @return {null | Object} - validated layer or null
 */
function validateLayerWithData(_ref6, savedLayer) {
  var fields = _ref6.fields,
      dataId = _ref6.id;
  var type = savedLayer.type;

  // layer doesnt have a valid type

  if (!_defaultSettings.LAYER_CLASSES.hasOwnProperty(type) || !savedLayer.config || !savedLayer.config.columns) {
    return null;
  }

  var LayerClass = KeplerGLLayers[_defaultSettings.LAYER_CLASSES[type]];
  var newLayer = new LayerClass({
    id: savedLayer.id,
    dataId: dataId,
    label: savedLayer.config.label,
    color: savedLayer.config.color,
    isVisible: savedLayer.config.isVisible
  });

  // find column fieldIdx
  var columns = validateSavedLayerColumns(fields, savedLayer.config.columns, newLayer.getLayerColumns());

  if (!columns) {
    return null;
  }

  // visual channel field is saved to be {name, type}
  // find visual channel field by matching both name and type
  // refer to vis-state-schema.js VisualChannelSchemaV1
  var foundVisualChannelConfigs = validateSavedVisualChannels(fields, newLayer.visualChannels, savedLayer);

  // copy visConfig over to emptyLayer to make sure it has all the props
  var visConfig = newLayer.assignConfigToLayer(newLayer.config.visConfig, savedLayer.config.visConfig || {});

  newLayer.updateLayerConfig((0, _extends4.default)({
    columns: columns,
    visConfig: visConfig
  }, foundVisualChannelConfigs));

  return newLayer;
}

/**
 * Validate saved filter config with new data,
 * calculate domain and fieldIdx based new fields and data
 *
 * @param {Object[]} dataset.fields
 * @param {Object[]} dataset.allData
 * @param {Object} filter - filter to be validate
 * @return {Object | null} - validated filter
 */
function validateFilterWithData(_ref7, filter) {
  var fields = _ref7.fields,
      allData = _ref7.allData;

  // match filter.name to field.name
  var fieldIdx = fields.findIndex(function (_ref8) {
    var name = _ref8.name;
    return name === filter.name;
  });

  if (fieldIdx < 0) {
    // if can't find field with same name, discharge filter
    return null;
  }

  var field = fields[fieldIdx];
  var value = filter.value;

  // return filter type, default value, fieldType and fieldDomain from field
  var filterPropsFromField = (0, _filterUtils.getFilterProps)(allData, field);

  var matchedFilter = (0, _extends4.default)({}, (0, _filterUtils.getDefaultfilter)(filter.dataId), filter, filterPropsFromField, {
    freeze: true,
    fieldIdx: fieldIdx
  });

  var _matchedFilter = matchedFilter,
      yAxis = _matchedFilter.yAxis;

  if (yAxis) {
    var matcheAxis = fields.find(function (_ref9) {
      var name = _ref9.name,
          type = _ref9.type;
      return name === yAxis.name && type === yAxis.type;
    });

    matchedFilter = matcheAxis ? (0, _extends4.default)({}, matchedFilter, {
      yAxis: matcheAxis
    }, (0, _filterUtils.getFilterPlot)((0, _extends4.default)({}, matchedFilter, { yAxis: matcheAxis }), allData)) : matchedFilter;
  }

  matchedFilter.value = (0, _filterUtils.adjustValueToFilterDomain)(value, matchedFilter);

  if (matchedFilter.value === null) {
    // cannt adjust saved value to filter
    return null;
  }

  return matchedFilter;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy92aXMtc3RhdGUtbWVyZ2VyLmpzIl0sIm5hbWVzIjpbIm1lcmdlRmlsdGVycyIsIm1lcmdlTGF5ZXJzIiwibWVyZ2VJbnRlcmFjdGlvbnMiLCJtZXJnZUludGVyYWN0aW9uVG9vbHRpcENvbmZpZyIsIm1lcmdlTGF5ZXJCbGVuZGluZyIsInZhbGlkYXRlU2F2ZWRMYXllckNvbHVtbnMiLCJ2YWxpZGF0ZVNhdmVkVmlzdWFsQ2hhbm5lbHMiLCJ2YWxpZGF0ZUxheWVyV2l0aERhdGEiLCJ2YWxpZGF0ZUZpbHRlcldpdGhEYXRhIiwiS2VwbGVyR0xMYXllcnMiLCJzdGF0ZSIsImZpbHRlcnNUb01lcmdlIiwibWVyZ2VkIiwidW5tZXJnZWQiLCJkYXRhc2V0cyIsIkFycmF5IiwiaXNBcnJheSIsImxlbmd0aCIsImZvckVhY2giLCJmaWx0ZXIiLCJkYXRhSWQiLCJ2YWxpZGF0ZUZpbHRlciIsInB1c2giLCJ1cGRhdGVkRmlsdGVycyIsImZpbHRlcnMiLCJkYXRhc2V0VG9GaWx0ZXIiLCJtYXAiLCJkIiwidXBkYXRlZERhdGFzZXQiLCJyZWR1Y2UiLCJhY2N1IiwiYWxsRGF0YSIsImZpbHRlclRvQmVNZXJnZWQiLCJsYXllcnNUb01lcmdlIiwibWVyZ2VkTGF5ZXIiLCJsYXllciIsImNvbmZpZyIsInZhbGlkYXRlTGF5ZXIiLCJsYXllcnMiLCJuZXdMYXllck9yZGVyIiwiXyIsImkiLCJsYXllck9yZGVyIiwibGF5ZXJUb0JlTWVyZ2VkIiwiaW50ZXJhY3Rpb25Ub0JlTWVyZ2VkIiwiT2JqZWN0Iiwia2V5cyIsImludGVyYWN0aW9uQ29uZmlnIiwia2V5IiwiZW5hYmxlZCIsImNvbmZpZ1NhdmVkIiwiY29uZmlnVG9NZXJnZSIsIm1lcmdlZFRvb2x0aXAiLCJ1bm1lcmdlZFRvb2x0aXAiLCJmaWVsZHNUb1Nob3ciLCJ0b29sdGlwIiwidG9vbHRpcENvbmZpZyIsImFsbEZpZWxkcyIsImZpZWxkcyIsIm5hbWUiLCJmb3VuZEZpZWxkc1RvU2hvdyIsImluY2x1ZGVzIiwibGF5ZXJCbGVuZGluZyIsInNhdmVkQ29scyIsImVtcHR5Q29scyIsImNvbEZvdW5kIiwiYWxsQ29sRm91bmQiLCJldmVyeSIsInNhdmVkIiwiZmllbGRJZHgiLCJmaW5kSW5kZXgiLCJ2YWx1ZSIsIm9wdGlvbmFsIiwidmlzdWFsQ2hhbm5lbHMiLCJzYXZlZExheWVyIiwidmFsdWVzIiwiZm91bmQiLCJmaWVsZCIsInNjYWxlIiwiZm91bmRGaWVsZCIsImZpbmQiLCJmZCIsImlkIiwidHlwZSIsImhhc093blByb3BlcnR5IiwiY29sdW1ucyIsIkxheWVyQ2xhc3MiLCJuZXdMYXllciIsImxhYmVsIiwiY29sb3IiLCJpc1Zpc2libGUiLCJnZXRMYXllckNvbHVtbnMiLCJmb3VuZFZpc3VhbENoYW5uZWxDb25maWdzIiwidmlzQ29uZmlnIiwiYXNzaWduQ29uZmlnVG9MYXllciIsInVwZGF0ZUxheWVyQ29uZmlnIiwiZmlsdGVyUHJvcHNGcm9tRmllbGQiLCJtYXRjaGVkRmlsdGVyIiwiZnJlZXplIiwieUF4aXMiLCJtYXRjaGVBeGlzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztRQXlCZ0JBLFksR0FBQUEsWTtRQTREQUMsVyxHQUFBQSxXO1FBZ0RBQyxpQixHQUFBQSxpQjtRQWlFQUMsNkIsR0FBQUEsNkI7UUFtQ0FDLGtCLEdBQUFBLGtCO1FBcUJBQyx5QixHQUFBQSx5QjtRQWdDQUMsMkIsR0FBQUEsMkI7UUFrQ0FDLHFCLEdBQUFBLHFCO1FBaUVBQyxzQixHQUFBQSxzQjs7QUFqWWhCOzs7O0FBQ0E7Ozs7QUFDQTs7SUFBWUMsYzs7QUFFWjs7QUFRQTs7Ozs7O0FBS0E7Ozs7Ozs7O0FBUU8sU0FBU1QsWUFBVCxDQUFzQlUsS0FBdEIsRUFBNkJDLGNBQTdCLEVBQTZDO0FBQ2xELE1BQU1DLFNBQVMsRUFBZjtBQUNBLE1BQU1DLFdBQVcsRUFBakI7QUFGa0QsTUFHM0NDLFFBSDJDLEdBRy9CSixLQUgrQixDQUczQ0ksUUFIMkM7OztBQUtsRCxNQUFJLENB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QXJCOztBQUVBO0FBQ0EsTUFBTXlCLHVCQUF1QixpQ0FBZWpFLE9BQWYsRUFBd0I4QyxLQUF4QixDQUE3Qjs7QUFFQSxNQUFJb0IsMkNBQ0MsbUNBQWlCOUUsT0FBT0MsTUFBeEIsQ0FERCxFQUVDRCxNQUZELEVBR0M2RSxvQkFIRDtBQUlGRSxZQUFRLElBSk47QUFLRjdCO0FBTEUsSUFBSjs7QUFmZ0UsdUJBdUJoRDRCLGFBdkJnRDtBQUFBLE1BdUJ6REUsS0F2QnlELGtCQXVCekRBLEtBdkJ5RDs7QUF3QmhFLE1BQUlBLEtBQUosRUFBVztBQUNULFFBQU1DLGFBQWExQyxPQUFPc0IsSUFBUCxDQUFZO0FBQUEsVUFBRXJCLElBQUYsU0FBRUEsSUFBRjtBQUFBLFVBQVF3QixJQUFSLFNBQVFBLElBQVI7QUFBQSxhQUM3QnhCLFNBQVN3QyxNQUFNeEMsSUFBZixJQUF1QndCLFNBQVNnQixNQUFNaEIsSUFEVDtBQUFBLEtBQVosQ0FBbkI7O0FBR0FjLG9CQUFnQkcsd0NBQ1hILGFBRFc7QUFFZEUsYUFBT0M7QUFGTyxPQUdYLDJEQUFrQkgsYUFBbEIsSUFBaUNFLE9BQU9DLFVBQXhDLEtBQXFEckUsT0FBckQsQ0FIVyxJQUlaa0UsYUFKSjtBQUtEOztBQUVEQSxnQkFBYzFCLEtBQWQsR0FBc0IsNENBQTBCQSxLQUExQixFQUFpQzBCLGFBQWpDLENBQXRCOztBQUVBLE1BQUlBLGNBQWMxQixLQUFkLEtBQXdCLElBQTVCLEVBQWtDO0FBQ2hDO0FBQ0EsV0FBTyxJQUFQO0FBQ0Q7O0FBRUQsU0FBTzBCLGFBQVA7QUFDRCIsImZpbGUiOiJ2aXMtc3RhdGUtbWVyZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHVuaXEgZnJvbSAnbG9kYXNoLnVuaXEnO1xuaW1wb3J0IHBpY2sgZnJvbSAnbG9kYXNoLnBpY2snO1xuaW1wb3J0ICogYXMgS2VwbGVyR0xMYXllcnMgZnJvbSAnLi4va2VwbGVyZ2wtbGF5ZXJzJztcblxuaW1wb3J0IHtcbiAgZ2V0RGVmYXVsdGZpbHRlcixcbiAgZ2V0RmlsdGVyUHJvcHMsXG4gIGdldEZpbHRlclBsb3QsXG4gIGZpbHRlckRhdGEsXG4gIGFkanVzdFZhbHVlVG9GaWx0ZXJEb21haW5cbn0gZnJvbSAnLi4vdXRpbHMvZmlsdGVyLXV0aWxzJztcblxuaW1wb3J0IHtcbiAgTEFZRVJfQkxFTkRJTkdTLFxuICBMQVlFUl9DTEFTU0VTXG59IGZyb20gJy4uL2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuLyoqXG4gKiBNZXJnZSBsb2FkZWQgZmlsdGVycyB3aXRoIGN1cnJlbnQgc3RhdGUsIGlmIG5vIGZpZWxkcyBvciBkYXRhIGFyZSBsb2FkZWRcbiAqIHNhdmUgaXQgZm9yIGxhdGVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHN0YXRlXG4gKiBAcGFyYW0ge09iamVjdFtdfSBmaWx0ZXJzVG9NZXJnZVxuICogQHJldHVybiB7T2JqZWN0fSB1cGRhdGVkU3RhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlRmlsdGVycyhzdGF0ZSwgZmlsdGVyc1RvTWVyZ2UpIHtcbiAgY29uc3QgbWVyZ2VkID0gW107XG4gIGNvbnN0IHVubWVyZ2VkID0gW107XG4gIGNvbnN0IHtkYXRhc2V0c30gPSBzdGF0ZTtcblxuICBpZiAoIUFycmF5LmlzQXJyYXkoZmlsdGVyc1RvTWVyZ2UpIHx8ICFmaWx0ZXJzVG9NZXJnZS5sZW5ndGgpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICAvLyBtZXJnZSBmaWx0ZXJzXG4gIGZpbHRlcnNUb01lcmdlLmZvckVhY2goZmlsdGVyID0+IHtcbiAgICAvLyBtYXRjaCBmaWx0ZXIuZGF0YUlkIHdpdGggY3VycmVudCBkYXRlc2V0cyBpZFxuICAgIC8vIHVwbG9hZGVkIGRhdGEgbmVlZCB0byBoYXZlIHRoZSBzYW1lIGRhdGFJZCB3aXRoIHRoZSBmaWx0ZXJcbiAgICBpZiAoZGF0YXNldHNbZmlsdGVyLmRhdGFJZF0pIHtcbiAgICAgIC8vIGRhdGFzZXRzIGlzIGFscmVhZHkgbG9hZGVkXG4gICAgICBjb25zdCB2YWxpZGF0ZUZpbHRlciA9IHZhbGlkYXRlRmlsdGVyV2l0aERhdGEoXG4gICAgICAgIGRhdGFzZXRzW2ZpbHRlci5kYXRhSWRdLFxuICAgICAgICBmaWx0ZXJcbiAgICAgICk7XG5cbiAgICAgIGlmICh2YWxpZGF0ZUZpbHRlcikge1xuICAgICAgICBtZXJnZWQucHVzaCh2YWxpZGF0ZUZpbHRlcik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGRhdGFzZXRzIG5vdCB5ZXQgbG9hZGVkXG4gICAgICB1bm1lcmdlZC5wdXNoKGZpbHRlcik7XG4gICAgfVxuICB9KTtcblxuICAvLyBmaWx0ZXIgZGF0YVxuICBjb25zdCB1cGRhdGVkRmlsdGVycyA9IFsuLi4oc3RhdGUuZmlsdGVycyB8fCBbXSksIC4uLm1lcmdlZF07XG4gIGNvbnN0IGRhdGFzZXRUb0ZpbHRlciA9IHVuaXEobWVyZ2VkLm1hcChkID0+IGQuZGF0YUlkKSk7XG5cbiAgY29uc3QgdXBkYXRlZERhdGFzZXQgPSBkYXRhc2V0VG9GaWx0ZXIucmVkdWNlKFxuICAgIChhY2N1LCBkYXRhSWQpID0+ICh7XG4gICAgICAuLi5hY2N1LFxuICAgICAgW2RhdGFJZF06IHtcbiAgICAgICAgLi4uZGF0YXNldHNbZGF0YUlkXSxcbiAgICAgICAgLi4uZmlsdGVyRGF0YShkYXRhc2V0c1tkYXRhSWRdLmFsbERhdGEsIGRhdGFJZCwgdXBkYXRlZEZpbHRlcnMpXG4gICAgICB9XG4gICAgfSksXG4gICAgZGF0YXNldHNcbiAgKTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGZpbHRlcnM6IHVwZGF0ZWRGaWx0ZXJzLFxuICAgIGRhdGFzZXRzOiB1cGRhdGVkRGF0YXNldCxcbiAgICBmaWx0ZXJUb0JlTWVyZ2VkOiB1bm1lcmdlZFxuICB9O1xufVxuXG4vKipcbiAqIE1lcmdlIGxheWVycyBmcm9tIGRlLXNlcmlhbGl6ZWQgc3RhdGUsIGlmIG5vIGZpZWxkcyBvciBkYXRhIGFyZSBsb2FkZWRcbiAqIHNhdmUgaXQgZm9yIGxhdGVyXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHN0YXRlXG4gKiBAcGFyYW0ge09iamVjdFtdfSBsYXllcnNUb01lcmdlXG4gKiBAcmV0dXJuIHtPYmplY3R9IHN0YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZUxheWVycyhzdGF0ZSwgbGF5ZXJzVG9NZXJnZSkge1xuICBjb25zdCBtZXJnZWRMYXllciA9IFtdO1xuICBjb25zdCB1bm1lcmdlZCA9IFtdO1xuXG4gIGNvbnN0IHtkYXRhc2V0c30gPSBzdGF0ZTtcblxuICBpZiAoIUFycmF5LmlzQXJyYXkobGF5ZXJzVG9NZXJnZSkgfHwgIWxheWVyc1RvTWVyZ2UubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgbGF5ZXJzVG9NZXJnZS5mb3JFYWNoKGxheWVyID0+IHtcbiAgICBpZiAoZGF0YXNldHNbbGF5ZXIuY29uZmlnLmRhdGFJZF0pIHtcbiAgICAgIC8vIGRhdGFzZXRzIGFyZSBhbHJlYWR5IGxvYWRlZFxuICAgICAgY29uc3QgdmFsaWRhdGVMYXllciA9IHZhbGlkYXRlTGF5ZXJXaXRoRGF0YShcbiAgICAgICAgZGF0YXNldHNbbGF5ZXIuY29uZmlnLmRhdGFJZF0sXG4gICAgICAgIGxheWVyXG4gICAgICApO1xuXG4gICAgICBpZiAodmFsaWRhdGVMYXllcikge1xuICAgICAgICBtZXJnZWRMYXllci5wdXNoKHZhbGlkYXRlTGF5ZXIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBkYXRhc2V0cyBub3QgeWV0IGxvYWRlZFxuICAgICAgdW5tZXJnZWQucHVzaChsYXllcik7XG4gICAgfVxuICB9KTtcblxuICBjb25zdCBsYXllcnMgPSBbLi4uc3RhdGUubGF5ZXJzLCAuLi5tZXJnZWRMYXllcl07XG4gIGNvbnN0IG5ld0xheWVyT3JkZXIgPSBtZXJnZWRMYXllci5tYXAoKF8sIGkpID0+IHN0YXRlLmxheWVycy5sZW5ndGggKyBpKTtcblxuICAvLyBwdXQgbmV3IGxheWVycyBpbiBmcm9udCBvZiBjdXJyZW50IGxheWVyc1xuICBjb25zdCBsYXllck9yZGVyID0gWy4uLm5ld0xheWVyT3JkZXIsIC4uLnN0YXRlLmxheWVyT3JkZXJdO1xuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgbGF5ZXJzLFxuICAgIGxheWVyT3JkZXIsXG4gICAgbGF5ZXJUb0JlTWVyZ2VkOiB1bm1lcmdlZFxuICB9O1xufVxuXG4vKipcbiAqIE1lcmdlIGludGVyYWN0aW9ucyB3aXRoIHNhdmVkIGNvbmZpZ1xuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBzdGF0ZVxuICogQHBhcmFtIHtPYmplY3R9IGludGVyYWN0aW9uVG9CZU1lcmdlZFxuICogQHJldHVybiB7T2JqZWN0fSBtZXJnZWRTdGF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VJbnRlcmFjdGlvbnMoc3RhdGUsIGludGVyYWN0aW9uVG9CZU1lcmdlZCkge1xuICBjb25zdCBtZXJnZWQgPSB7fTtcbiAgY29uc3QgdW5tZXJnZWQgPSB7fTtcblxuICBpZiAoaW50ZXJhY3Rpb25Ub0JlTWVyZ2VkKSB7XG4gICAgT2JqZWN0LmtleXMoaW50ZXJhY3Rpb25Ub0JlTWVyZ2VkKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBpZiAoIXN0YXRlLmludGVyYWN0aW9uQ29uZmlnW2tleV0pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB7ZW5hYmxlZCwgLi4uY29uZmlnU2F2ZWR9ID0gaW50ZXJhY3Rpb25Ub0JlTWVyZ2VkW2tleV0gfHwge307XG4gICAgICBsZXQgY29uZmlnVG9NZXJnZSA9IGNvbmZpZ1NhdmVkO1xuXG4gICAgICBpZiAoa2V5ID09PSAndG9vbHRpcCcpIHtcblxuICAgICAgICBjb25zdCB7bWVyZ2VkVG9vbHRpcCwgdW5tZXJnZWRUb29sdGlwfSA9IG1lcmdlSW50ZXJhY3Rpb25Ub29sdGlwQ29uZmlnKFxuICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgIGNvbmZpZ1NhdmVkXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gbWVyZ2UgbmV3IGRhdGFzZXQgdG9vbHRpcHMgd2l0aCBvcmlnaW5hbCBkYXRhc2V0IHRvb2x0aXBzXG4gICAgICAgIGNvbmZpZ1RvTWVyZ2UgPSB7XG4gICAgICAgICAgZmllbGRzVG9TaG93OiB7XG4gICAgICAgICAgICAuLi5zdGF0ZS5pbnRlcmFjdGlvbkNvbmZpZ1trZXldLmNvbmZpZy5maWVsZHNUb1Nob3csXG4gICAgICAgICAgICAuLi5tZXJnZWRUb29sdGlwXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyh1bm1lcmdlZFRvb2x0aXApLmxlbmd0aCkge1xuICAgICAgICAgIHVubWVyZ2VkLnRvb2x0aXAgPSB7ZmllbGRzVG9TaG93OiB1bm1lcmdlZFRvb2x0aXAsIGVuYWJsZWR9O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIG1lcmdlZFtrZXldID0ge1xuICAgICAgICAuLi5zdGF0ZS5pbnRlcmFjdGlvbkNvbmZpZ1trZXldLFxuICAgICAgICBlbmFibGVkLFxuICAgICAgICBjb25maWc6IHBpY2soXG4gICAgICAgICAge1xuICAgICAgICAgICAgLi4uc3RhdGUuaW50ZXJhY3Rpb25Db25maWdba2V5XS5jb25maWcsXG4gICAgICAgICAgICAuLi5jb25maWdUb01lcmdlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBPYmplY3Qua2V5cyhzdGF0ZS5pbnRlcmFjdGlvbkNvbmZpZ1trZXldLmNvbmZpZylcbiAgICAgICAgKVxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgaW50ZXJhY3Rpb25Db25maWc6IHtcbiAgICAgIC4uLnN0YXRlLmludGVyYWN0aW9uQ29uZmlnLFxuICAgICAgLi4ubWVyZ2VkXG4gICAgfSxcbiAgICBpbnRlcmFjdGlvblRvQmVNZXJnZWQ6IHVubWVyZ2VkXG4gIH07XG59XG5cbi8qKlxuICogTWVyZ2UgaW50ZXJhY3Rpb25Db25maWcudG9vbHRpcCB3aXRoIHNhdmVkIGNvbmZpZyxcbiAqIHZhbGlkYXRlIGZpZWxkc1RvU2hvd1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdGF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHRvb2x0aXBDb25maWdcbiAqIEByZXR1cm4ge09iamVjdH0gLSB7bWVyZ2VkVG9vbHRpcDoge30sIHVubWVyZ2VkVG9vbHRpcDoge319XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZUludGVyYWN0aW9uVG9vbHRpcENvbmZpZyhzdGF0ZSwgdG9vbHRpcENvbmZpZyA9IHt9KSB7XG4gIGNvbnN0IHVubWVyZ2VkVG9vbHRpcCA9IHt9O1xuICBjb25zdCBtZXJnZWRUb29sdGlwID0ge307XG5cbiAgaWYgKFxuICAgICF0b29sdGlwQ29uZmlnLmZpZWxkc1RvU2hvdyB8fFxuICAgICFPYmplY3Qua2V5cyh0b29sdGlwQ29uZmlnLmZpZWxkc1RvU2hvdykubGVuZ3RoXG4gICkge1xuICAgIHJldHVybiB7bWVyZ2VkVG9vbHRpcCwgdW5tZXJnZWRUb29sdGlwfTtcbiAgfVxuXG4gIGZvciAoY29uc3QgZGF0YUlkIGluIHRvb2x0aXBDb25maWcuZmllbGRzVG9TaG93KSB7XG4gICAgaWYgKCFzdGF0ZS5kYXRhc2V0c1tkYXRhSWRdKSB7XG4gICAgICAvLyBpcyBub3QgeWV0IGxvYWRlZFxuICAgICAgdW5tZXJnZWRUb29sdGlwW2RhdGFJZF0gPSB0b29sdGlwQ29uZmlnLmZpZWxkc1RvU2hvd1tkYXRhSWRdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBpZiBkYXRhc2V0IGlzIGxvYWRlZFxuICAgICAgY29uc3QgYWxsRmllbGRzID0gc3RhdGUuZGF0YXNldHNbZGF0YUlkXS5maWVsZHMubWFwKGQgPT4gZC5uYW1lKTtcbiAgICAgIGNvbnN0IGZvdW5kRmllbGRzVG9TaG93ID0gdG9vbHRpcENvbmZpZy5maWVsZHNUb1Nob3dbZGF0YUlkXS5maWx0ZXIoXG4gICAgICAgIG5hbWUgPT4gYWxsRmllbGRzLmluY2x1ZGVzKG5hbWUpXG4gICAgICApO1xuXG4gICAgICBtZXJnZWRUb29sdGlwW2RhdGFJZF0gPSBmb3VuZEZpZWxkc1RvU2hvdztcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge21lcmdlZFRvb2x0aXAsIHVubWVyZ2VkVG9vbHRpcH07XG59XG4vKipcbiAqIE1lcmdlIGxheWVyQmxlbmRpbmcgd2l0aCBzYXZlZFxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBzdGF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGxheWVyQmxlbmRpbmdcbiAqIEByZXR1cm4ge29iamVjdH0gbWVyZ2VkIHN0YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZUxheWVyQmxlbmRpbmcoc3RhdGUsIGxheWVyQmxlbmRpbmcpIHtcbiAgaWYgKGxheWVyQmxlbmRpbmcgJiYgTEFZRVJfQkxFTkRJTkdTW2xheWVyQmxlbmRpbmddKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgbGF5ZXJCbGVuZGluZ1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gc3RhdGU7XG59XG5cbi8qKlxuICogVmFsaWRhdGUgc2F2ZWQgbGF5ZXIgY29sdW1ucyB3aXRoIG5ldyBkYXRhLFxuICogdXBkYXRlIGZpZWxkSWR4IGJhc2VkIG9uIG5ldyBmaWVsZHNcbiAqXG4gKiBAcGFyYW0ge09iamVjdFtdfSBmaWVsZHNcbiAqIEBwYXJhbSB7T2JqZWN0fSBzYXZlZENvbHNcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbXB0eUNvbHNcbiAqIEByZXR1cm4ge251bGwgfCBPYmplY3R9IC0gdmFsaWRhdGVkIGNvbHVtbnMgb3IgbnVsbFxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVNhdmVkTGF5ZXJDb2x1bW5zKGZpZWxkcywgc2F2ZWRDb2xzLCBlbXB0eUNvbHMpIHtcbiAgY29uc3QgY29sRm91bmQgPSB7fTtcbiAgLy8gZmluZCBhY3R1YWwgY29sdW1uIGZpZWxkSWR4LCBpbiBjYXNlIGl0IGhhcyBjaGFuZ2VkXG4gIGNvbnN0IGFsbENvbEZvdW5kID0gT2JqZWN0LmtleXMoZW1wdHlDb2xzKS5ldmVyeShrZXkgPT4ge1xuICAgIGNvbnN0IHNhdmVkID0gc2F2ZWRDb2xzW2tleV07XG4gICAgY29sRm91bmRba2V5XSA9IHsuLi5lbXB0eUNvbHNba2V5XX07XG5cbiAgICBjb25zdCBmaWVsZElkeCA9IGZpZWxkcy5maW5kSW5kZXgoKHtuYW1lfSkgPT4gbmFtZSA9PT0gc2F2ZWQpO1xuXG4gICAgaWYgKGZpZWxkSWR4ID4gLTEpIHtcbiAgICAgIC8vIHVwZGF0ZSBmb3VuZCBjb2x1bW5zXG4gICAgICBjb2xGb3VuZFtrZXldLmZpZWxkSWR4ID0gZmllbGRJZHg7XG4gICAgICBjb2xGb3VuZFtrZXldLnZhbHVlID0gc2F2ZWQ7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBpZiBjb2wgaXMgb3B0aW9uYWwsIGFsbG93IG51bGwgdmFsdWVcbiAgICByZXR1cm4gZW1wdHlDb2xzW2tleV0ub3B0aW9uYWwgfHwgZmFsc2U7XG4gIH0pO1xuXG4gIHJldHVybiBhbGxDb2xGb3VuZCAmJiBjb2xGb3VuZDtcbn1cblxuLyoqXG4gKiBWYWxpZGF0ZSBzYXZlZCB2aXN1YWwgY2hhbm5lbHMgY29uZmlnIHdpdGggbmV3IGRhdGEsXG4gKiByZWZlciB0byB2aXMtc3RhdGUtc2NoZW1hLmpzIFZpc3VhbENoYW5uZWxTY2hlbWFWMVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0W119IGZpZWxkc1xuICogQHBhcmFtIHtPYmplY3R9IHZpc3VhbENoYW5uZWxzXG4gKiBAcGFyYW0ge09iamVjdH0gc2F2ZWRMYXllclxuICogQHJldHVybiB7T2JqZWN0fSAtIHZhbGlkYXRlZCB2aXN1YWwgY2hhbm5lbCBpbiBjb25maWcgb3Ige31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlU2F2ZWRWaXN1YWxDaGFubmVscyhcbiAgZmllbGRzLFxuICB2aXN1YWxDaGFubmVscyxcbiAgc2F2ZWRMYXllclxuKSB7XG4gIHJldHVybiBPYmplY3QudmFsdWVzKHZpc3VhbENoYW5uZWxzKS5yZWR1Y2UoKGZvdW5kLCB7ZmllbGQsIHNjYWxlfSkgPT4ge1xuICAgIGxldCBmb3VuZEZpZWxkO1xuICAgIGlmIChzYXZlZExheWVyLmNvbmZpZ1tmaWVsZF0pIHtcbiAgICAgIGZvdW5kRmllbGQgPSBmaWVsZHMuZmluZChmZCA9PlxuICAgICAgICBPYmplY3Qua2V5cyhzYXZlZExheWVyLmNvbmZpZ1tmaWVsZF0pLmV2ZXJ5KFxuICAgICAgICAgIGtleSA9PiBzYXZlZExheWVyLmNvbmZpZ1tmaWVsZF1ba2V5XSA9PT0gZmRba2V5XVxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAuLi5mb3VuZCxcbiAgICAgIC4uLihmb3VuZEZpZWxkID8ge1tmaWVsZF06IGZvdW5kRmllbGR9IDoge30pLFxuICAgICAgLi4uKHNhdmVkTGF5ZXIuY29uZmlnW3NjYWxlXVxuICAgICAgICA/IHtbc2NhbGVdOiBzYXZlZExheWVyLmNvbmZpZ1tzY2FsZV19XG4gICAgICAgIDoge30pXG4gICAgfTtcbiAgfSwge30pO1xufVxuXG4vKipcbiAqIFZhbGlkYXRlIHNhdmVkIGxheWVyIGNvbmZpZyB3aXRoIG5ldyBkYXRhLFxuICogdXBkYXRlIGZpZWxkSWR4IGJhc2VkIG9uIG5ldyBmaWVsZHNcbiAqXG4gKiBAcGFyYW0ge09iamVjdFtdfSBmaWVsZHNcbiAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhSWRcbiAqIEBwYXJhbSB7T2JqZWN0fSBzYXZlZExheWVyXG4gKiBAcmV0dXJuIHtudWxsIHwgT2JqZWN0fSAtIHZhbGlkYXRlZCBsYXllciBvciBudWxsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUxheWVyV2l0aERhdGEoe2ZpZWxkcywgaWQ6IGRhdGFJZH0sIHNhdmVkTGF5ZXIpIHtcbiAgY29uc3Qge3R5cGV9ID0gc2F2ZWRMYXllcjtcblxuICAvLyBsYXllciBkb2VzbnQgaGF2ZSBhIHZhbGlkIHR5cGVcbiAgaWYgKFxuICAgICFMQVlFUl9DTEFTU0VTLmhhc093blByb3BlcnR5KHR5cGUpIHx8XG4gICAgIXNhdmVkTGF5ZXIuY29uZmlnIHx8XG4gICAgIXNhdmVkTGF5ZXIuY29uZmlnLmNvbHVtbnNcbiAgKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBMYXllckNsYXNzID0gS2VwbGVyR0xMYXllcnNbTEFZRVJfQ0xBU1NFU1t0eXBlXV07XG4gIGNvbnN0IG5ld0xheWVyID0gbmV3IExheWVyQ2xhc3Moe1xuICAgIGlkOiBzYXZlZExheWVyLmlkLFxuICAgIGRhdGFJZCxcbiAgICBsYWJlbDogc2F2ZWRMYXllci5jb25maWcubGFiZWwsXG4gICAgY29sb3I6IHNhdmVkTGF5ZXIuY29uZmlnLmNvbG9yLFxuICAgIGlzVmlzaWJsZTogc2F2ZWRMYXllci5jb25maWcuaXNWaXNpYmxlXG4gIH0pO1xuXG4gIC8vIGZpbmQgY29sdW1uIGZpZWxkSWR4XG4gIGNvbnN0IGNvbHVtbnMgPSB2YWxpZGF0ZVNhdmVkTGF5ZXJDb2x1bW5zKFxuICAgIGZpZWxkcyxcbiAgICBzYXZlZExheWVyLmNvbmZpZy5jb2x1bW5zLFxuICAgIG5ld0xheWVyLmdldExheWVyQ29sdW1ucygpXG4gICk7XG5cbiAgaWYgKCFjb2x1bW5zKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyB2aXN1YWwgY2hhbm5lbCBmaWVsZCBpcyBzYXZlZCB0byBiZSB7bmFtZSwgdHlwZX1cbiAgLy8gZmluZCB2aXN1YWwgY2hhbm5lbCBmaWVsZCBieSBtYXRjaGluZyBib3RoIG5hbWUgYW5kIHR5cGVcbiAgLy8gcmVmZXIgdG8gdmlzLXN0YXRlLXNjaGVtYS5qcyBWaXN1YWxDaGFubmVsU2NoZW1hVjFcbiAgY29uc3QgZm91bmRWaXN1YWxDaGFubmVsQ29uZmlncyA9IHZhbGlkYXRlU2F2ZWRWaXN1YWxDaGFubmVscyhcbiAgICBmaWVsZHMsXG4gICAgbmV3TGF5ZXIudmlzdWFsQ2hhbm5lbHMsXG4gICAgc2F2ZWRMYXllclxuICApO1xuXG4gIC8vIGNvcHkgdmlzQ29uZmlnIG92ZXIgdG8gZW1wdHlMYXllciB0byBtYWtlIHN1cmUgaXQgaGFzIGFsbCB0aGUgcHJvcHNcbiAgY29uc3QgdmlzQ29uZmlnID0gbmV3TGF5ZXIuYXNzaWduQ29uZmlnVG9MYXllcihcbiAgICBuZXdMYXllci5jb25maWcudmlzQ29uZmlnLFxuICAgIHNhdmVkTGF5ZXIuY29uZmlnLnZpc0NvbmZpZyB8fCB7fVxuICApO1xuXG4gIG5ld0xheWVyLnVwZGF0ZUxheWVyQ29uZmlnKHtcbiAgICBjb2x1bW5zLFxuICAgIHZpc0NvbmZpZyxcbiAgICAuLi5mb3VuZFZpc3VhbENoYW5uZWxDb25maWdzXG4gIH0pO1xuXG4gIHJldHVybiBuZXdMYXllcjtcbn1cblxuLyoqXG4gKiBWYWxpZGF0ZSBzYXZlZCBmaWx0ZXIgY29uZmlnIHdpdGggbmV3IGRhdGEsXG4gKiBjYWxjdWxhdGUgZG9tYWluIGFuZCBmaWVsZElkeCBiYXNlZCBuZXcgZmllbGRzIGFuZCBkYXRhXG4gKlxuICogQHBhcmFtIHtPYmplY3RbXX0gZGF0YXNldC5maWVsZHNcbiAqIEBwYXJhbSB7T2JqZWN0W119IGRhdGFzZXQuYWxsRGF0YVxuICogQHBhcmFtIHtPYmplY3R9IGZpbHRlciAtIGZpbHRlciB0byBiZSB2YWxpZGF0ZVxuICogQHJldHVybiB7T2JqZWN0IHwgbnVsbH0gLSB2YWxpZGF0ZWQgZmlsdGVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUZpbHRlcldpdGhEYXRhKHtmaWVsZHMsIGFsbERhdGF9LCBmaWx0ZXIpIHtcbiAgLy8gbWF0Y2ggZmlsdGVyLm5hbWUgdG8gZmllbGQubmFtZVxuICBjb25zdCBmaWVsZElkeCA9IGZpZWxkcy5maW5kSW5kZXgoKHtuYW1lfSkgPT4gbmFtZSA9PT0gZmlsdGVyLm5hbWUpO1xuXG4gIGlmIChmaWVsZElkeCA8IDApIHtcbiAgICAvLyBpZiBjYW4ndCBmaW5kIGZpZWxkIHdpdGggc2FtZSBuYW1lLCBkaXNjaGFyZ2UgZmlsdGVyXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBmaWVsZCA9IGZpZWxkc1tmaWVsZElkeF07XG4gIGNvbnN0IHZhbHVlID0gZmlsdGVyLnZhbHVlO1xuXG4gIC8vIHJldHVybiBmaWx0ZXIgdHlwZSwgZGVmYXVsdCB2YWx1ZSwgZmllbGRUeXBlIGFuZCBmaWVsZERvbWFpbiBmcm9tIGZpZWxkXG4gIGNvbnN0IGZpbHRlclByb3BzRnJvbUZpZWxkID0gZ2V0RmlsdGVyUHJvcHMoYWxsRGF0YSwgZmllbGQpO1xuXG4gIGxldCBtYXRjaGVkRmlsdGVyID0ge1xuICAgIC4uLmdldERlZmF1bHRmaWx0ZXIoZmlsdGVyLmRhdGFJZCksXG4gICAgLi4uZmlsdGVyLFxuICAgIC4uLmZpbHRlclByb3BzRnJvbUZpZWxkLFxuICAgIGZyZWV6ZTogdHJ1ZSxcbiAgICBmaWVsZElkeFxuICB9O1xuXG4gIGNvbnN0IHt5QXhpc30gPSBtYXRjaGVkRmlsdGVyO1xuICBpZiAoeUF4aXMpIHtcbiAgICBjb25zdCBtYXRjaGVBeGlzID0gZmllbGRzLmZpbmQoKHtuYW1lLCB0eXBlfSkgPT5cbiAgICAgIG5hbWUgPT09IHlBeGlzLm5hbWUgJiYgdHlwZSA9PT0geUF4aXMudHlwZSk7XG5cbiAgICBtYXRjaGVkRmlsdGVyID0gbWF0Y2hlQXhpcyA/IHtcbiAgICAgIC4uLm1hdGNoZWRGaWx0ZXIsXG4gICAgICB5QXhpczogbWF0Y2hlQXhpcyxcbiAgICAgIC4uLmdldEZpbHRlclBsb3Qoey4uLm1hdGNoZWRGaWx0ZXIsIHlBeGlzOiBtYXRjaGVBeGlzfSwgYWxsRGF0YSlcbiAgICB9IDogbWF0Y2hlZEZpbHRlclxuICB9XG5cbiAgbWF0Y2hlZEZpbHRlci52YWx1ZSA9IGFkanVzdFZhbHVlVG9GaWx0ZXJEb21haW4odmFsdWUsIG1hdGNoZWRGaWx0ZXIpO1xuXG4gIGlmIChtYXRjaGVkRmlsdGVyLnZhbHVlID09PSBudWxsKSB7XG4gICAgLy8gY2FubnQgYWRqdXN0IHNhdmVkIHZhbHVlIHRvIGZpbHRlclxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIG1hdGNoZWRGaWx0ZXI7XG59XG4iXX0=