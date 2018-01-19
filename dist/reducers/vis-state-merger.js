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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy92aXMtc3RhdGUtbWVyZ2VyLmpzIl0sIm5hbWVzIjpbIm1lcmdlRmlsdGVycyIsIm1lcmdlTGF5ZXJzIiwibWVyZ2VJbnRlcmFjdGlvbnMiLCJtZXJnZUludGVyYWN0aW9uVG9vbHRpcENvbmZpZyIsIm1lcmdlTGF5ZXJCbGVuZGluZyIsInZhbGlkYXRlU2F2ZWRMYXllckNvbHVtbnMiLCJ2YWxpZGF0ZVNhdmVkVmlzdWFsQ2hhbm5lbHMiLCJ2YWxpZGF0ZUxheWVyV2l0aERhdGEiLCJ2YWxpZGF0ZUZpbHRlcldpdGhEYXRhIiwiS2VwbGVyR0xMYXllcnMiLCJzdGF0ZSIsImZpbHRlcnNUb01lcmdlIiwibWVyZ2VkIiwidW5tZXJnZWQiLCJkYXRhc2V0cyIsIkFycmF5IiwiaXNBcnJheSIsImxlbmd0aCIsImZvckVhY2giLCJmaWx0ZXIiLCJkYXRhSWQiLCJ2YWxpZGF0ZUZpbHRlciIsInB1c2giLCJ1cGRhdGVkRmlsdGVycyIsImZpbHRlcnMiLCJkYXRhc2V0VG9GaWx0ZXIiLCJtYXAiLCJkIiwidXBkYXRlZERhdGFzZXQiLCJyZWR1Y2UiLCJhY2N1IiwiYWxsRGF0YSIsImZpbHRlclRvQmVNZXJnZWQiLCJsYXllcnNUb01lcmdlIiwibWVyZ2VkTGF5ZXIiLCJsYXllciIsImNvbmZpZyIsInZhbGlkYXRlTGF5ZXIiLCJsYXllcnMiLCJuZXdMYXllck9yZGVyIiwiXyIsImkiLCJsYXllck9yZGVyIiwibGF5ZXJUb0JlTWVyZ2VkIiwiaW50ZXJhY3Rpb25Ub0JlTWVyZ2VkIiwiT2JqZWN0Iiwia2V5cyIsImludGVyYWN0aW9uQ29uZmlnIiwia2V5IiwiZW5hYmxlZCIsImNvbmZpZ1NhdmVkIiwiY29uZmlnVG9NZXJnZSIsIm1lcmdlZFRvb2x0aXAiLCJ1bm1lcmdlZFRvb2x0aXAiLCJmaWVsZHNUb1Nob3ciLCJ0b29sdGlwIiwidG9vbHRpcENvbmZpZyIsImFsbEZpZWxkcyIsImZpZWxkcyIsIm5hbWUiLCJmb3VuZEZpZWxkc1RvU2hvdyIsImluY2x1ZGVzIiwibGF5ZXJCbGVuZGluZyIsInNhdmVkQ29scyIsImVtcHR5Q29scyIsImNvbEZvdW5kIiwiYWxsQ29sRm91bmQiLCJldmVyeSIsInNhdmVkIiwiZmllbGRJZHgiLCJmaW5kSW5kZXgiLCJ2YWx1ZSIsIm9wdGlvbmFsIiwidmlzdWFsQ2hhbm5lbHMiLCJzYXZlZExheWVyIiwidmFsdWVzIiwiZm91bmQiLCJmaWVsZCIsInNjYWxlIiwiZm91bmRGaWVsZCIsImZpbmQiLCJmZCIsImlkIiwidHlwZSIsImhhc093blByb3BlcnR5IiwiY29sdW1ucyIsIkxheWVyQ2xhc3MiLCJuZXdMYXllciIsImxhYmVsIiwiY29sb3IiLCJpc1Zpc2libGUiLCJnZXRMYXllckNvbHVtbnMiLCJmb3VuZFZpc3VhbENoYW5uZWxDb25maWdzIiwidmlzQ29uZmlnIiwiYXNzaWduQ29uZmlnVG9MYXllciIsInVwZGF0ZUxheWVyQ29uZmlnIiwiZmlsdGVyUHJvcHNGcm9tRmllbGQiLCJtYXRjaGVkRmlsdGVyIiwiZnJlZXplIiwieUF4aXMiLCJtYXRjaGVBeGlzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztRQXNCZ0JBLFksR0FBQUEsWTtRQTREQUMsVyxHQUFBQSxXO1FBZ0RBQyxpQixHQUFBQSxpQjtRQWdFQUMsNkIsR0FBQUEsNkI7UUFtQ0FDLGtCLEdBQUFBLGtCO1FBcUJBQyx5QixHQUFBQSx5QjtRQWdDQUMsMkIsR0FBQUEsMkI7UUFnQ0FDLHFCLEdBQUFBLHFCO1FBaUVBQyxzQixHQUFBQSxzQjs7QUEzWGhCOzs7O0FBQ0E7Ozs7QUFDQTs7SUFBWUMsYzs7QUFFWjs7QUFRQTs7Ozs7O0FBRUE7Ozs7Ozs7O0FBUU8sU0FBU1QsWUFBVCxDQUFzQlUsS0FBdEIsRUFBNkJDLGNBQTdCLEVBQTZDO0FBQ2xELE1BQU1DLFNBQVMsRUFBZjtBQUNBLE1BQU1DLFdBQVcsRUFBakI7QUFGa0QsTUFHM0NDLFFBSDJDLEdBRy9CSixLQUgrQixDQUczQ0ksUUFIMkM7OztBQUtsRCxNQUFJLENB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LEtBQXJCOztBQUVBO0FBQ0EsTUFBTXlCLHVCQUF1QixpQ0FBZWpFLE9BQWYsRUFBd0I4QyxLQUF4QixDQUE3Qjs7QUFFQSxNQUFJb0IsMkNBQ0MsbUNBQWlCOUUsT0FBT0MsTUFBeEIsQ0FERCxFQUVDRCxNQUZELEVBR0M2RSxvQkFIRDtBQUlGRSxZQUFRLElBSk47QUFLRjdCO0FBTEUsSUFBSjs7QUFmZ0UsdUJBdUJoRDRCLGFBdkJnRDtBQUFBLE1BdUJ6REUsS0F2QnlELGtCQXVCekRBLEtBdkJ5RDs7QUF3QmhFLE1BQUlBLEtBQUosRUFBVztBQUNULFFBQU1DLGFBQWExQyxPQUFPc0IsSUFBUCxDQUNqQjtBQUFBLFVBQUVyQixJQUFGLFNBQUVBLElBQUY7QUFBQSxVQUFRd0IsSUFBUixTQUFRQSxJQUFSO0FBQUEsYUFBa0J4QixTQUFTd0MsTUFBTXhDLElBQWYsSUFBdUJ3QixTQUFTZ0IsTUFBTWhCLElBQXhEO0FBQUEsS0FEaUIsQ0FBbkI7O0FBSUFjLG9CQUFnQkcsd0NBRVBILGFBRk87QUFHVkUsYUFBT0M7QUFIRyxPQUlQLDJEQUFrQkgsYUFBbEIsSUFBaUNFLE9BQU9DLFVBQXhDLEtBQXFEckUsT0FBckQsQ0FKTyxJQU1aa0UsYUFOSjtBQU9EOztBQUVEQSxnQkFBYzFCLEtBQWQsR0FBc0IsNENBQTBCQSxLQUExQixFQUFpQzBCLGFBQWpDLENBQXRCOztBQUVBLE1BQUlBLGNBQWMxQixLQUFkLEtBQXdCLElBQTVCLEVBQWtDO0FBQ2hDO0FBQ0EsV0FBTyxJQUFQO0FBQ0Q7O0FBRUQsU0FBTzBCLGFBQVA7QUFDRCIsImZpbGUiOiJ2aXMtc3RhdGUtbWVyZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHVuaXEgZnJvbSAnbG9kYXNoLnVuaXEnO1xuaW1wb3J0IHBpY2sgZnJvbSAnbG9kYXNoLnBpY2snO1xuaW1wb3J0ICogYXMgS2VwbGVyR0xMYXllcnMgZnJvbSAnLi4va2VwbGVyZ2wtbGF5ZXJzJztcblxuaW1wb3J0IHtcbiAgZ2V0RGVmYXVsdGZpbHRlcixcbiAgZ2V0RmlsdGVyUHJvcHMsXG4gIGdldEZpbHRlclBsb3QsXG4gIGZpbHRlckRhdGEsXG4gIGFkanVzdFZhbHVlVG9GaWx0ZXJEb21haW5cbn0gZnJvbSAnLi4vdXRpbHMvZmlsdGVyLXV0aWxzJztcblxuaW1wb3J0IHtMQVlFUl9CTEVORElOR1MsIExBWUVSX0NMQVNTRVN9IGZyb20gJy4uL2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuLyoqXG4gKiBNZXJnZSBsb2FkZWQgZmlsdGVycyB3aXRoIGN1cnJlbnQgc3RhdGUsIGlmIG5vIGZpZWxkcyBvciBkYXRhIGFyZSBsb2FkZWRcbiAqIHNhdmUgaXQgZm9yIGxhdGVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHN0YXRlXG4gKiBAcGFyYW0ge09iamVjdFtdfSBmaWx0ZXJzVG9NZXJnZVxuICogQHJldHVybiB7T2JqZWN0fSB1cGRhdGVkU3RhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlRmlsdGVycyhzdGF0ZSwgZmlsdGVyc1RvTWVyZ2UpIHtcbiAgY29uc3QgbWVyZ2VkID0gW107XG4gIGNvbnN0IHVubWVyZ2VkID0gW107XG4gIGNvbnN0IHtkYXRhc2V0c30gPSBzdGF0ZTtcblxuICBpZiAoIUFycmF5LmlzQXJyYXkoZmlsdGVyc1RvTWVyZ2UpIHx8ICFmaWx0ZXJzVG9NZXJnZS5sZW5ndGgpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICAvLyBtZXJnZSBmaWx0ZXJzXG4gIGZpbHRlcnNUb01lcmdlLmZvckVhY2goZmlsdGVyID0+IHtcbiAgICAvLyBtYXRjaCBmaWx0ZXIuZGF0YUlkIHdpdGggY3VycmVudCBkYXRlc2V0cyBpZFxuICAgIC8vIHVwbG9hZGVkIGRhdGEgbmVlZCB0byBoYXZlIHRoZSBzYW1lIGRhdGFJZCB3aXRoIHRoZSBmaWx0ZXJcbiAgICBpZiAoZGF0YXNldHNbZmlsdGVyLmRhdGFJZF0pIHtcbiAgICAgIC8vIGRhdGFzZXRzIGlzIGFscmVhZHkgbG9hZGVkXG4gICAgICBjb25zdCB2YWxpZGF0ZUZpbHRlciA9IHZhbGlkYXRlRmlsdGVyV2l0aERhdGEoXG4gICAgICAgIGRhdGFzZXRzW2ZpbHRlci5kYXRhSWRdLFxuICAgICAgICBmaWx0ZXJcbiAgICAgICk7XG5cbiAgICAgIGlmICh2YWxpZGF0ZUZpbHRlcikge1xuICAgICAgICBtZXJnZWQucHVzaCh2YWxpZGF0ZUZpbHRlcik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGRhdGFzZXRzIG5vdCB5ZXQgbG9hZGVkXG4gICAgICB1bm1lcmdlZC5wdXNoKGZpbHRlcik7XG4gICAgfVxuICB9KTtcblxuICAvLyBmaWx0ZXIgZGF0YVxuICBjb25zdCB1cGRhdGVkRmlsdGVycyA9IFsuLi4oc3RhdGUuZmlsdGVycyB8fCBbXSksIC4uLm1lcmdlZF07XG4gIGNvbnN0IGRhdGFzZXRUb0ZpbHRlciA9IHVuaXEobWVyZ2VkLm1hcChkID0+IGQuZGF0YUlkKSk7XG5cbiAgY29uc3QgdXBkYXRlZERhdGFzZXQgPSBkYXRhc2V0VG9GaWx0ZXIucmVkdWNlKFxuICAgIChhY2N1LCBkYXRhSWQpID0+ICh7XG4gICAgICAuLi5hY2N1LFxuICAgICAgW2RhdGFJZF06IHtcbiAgICAgICAgLi4uZGF0YXNldHNbZGF0YUlkXSxcbiAgICAgICAgLi4uZmlsdGVyRGF0YShkYXRhc2V0c1tkYXRhSWRdLmFsbERhdGEsIGRhdGFJZCwgdXBkYXRlZEZpbHRlcnMpXG4gICAgICB9XG4gICAgfSksXG4gICAgZGF0YXNldHNcbiAgKTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGZpbHRlcnM6IHVwZGF0ZWRGaWx0ZXJzLFxuICAgIGRhdGFzZXRzOiB1cGRhdGVkRGF0YXNldCxcbiAgICBmaWx0ZXJUb0JlTWVyZ2VkOiB1bm1lcmdlZFxuICB9O1xufVxuXG4vKipcbiAqIE1lcmdlIGxheWVycyBmcm9tIGRlLXNlcmlhbGl6ZWQgc3RhdGUsIGlmIG5vIGZpZWxkcyBvciBkYXRhIGFyZSBsb2FkZWRcbiAqIHNhdmUgaXQgZm9yIGxhdGVyXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHN0YXRlXG4gKiBAcGFyYW0ge09iamVjdFtdfSBsYXllcnNUb01lcmdlXG4gKiBAcmV0dXJuIHtPYmplY3R9IHN0YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZUxheWVycyhzdGF0ZSwgbGF5ZXJzVG9NZXJnZSkge1xuICBjb25zdCBtZXJnZWRMYXllciA9IFtdO1xuICBjb25zdCB1bm1lcmdlZCA9IFtdO1xuXG4gIGNvbnN0IHtkYXRhc2V0c30gPSBzdGF0ZTtcblxuICBpZiAoIUFycmF5LmlzQXJyYXkobGF5ZXJzVG9NZXJnZSkgfHwgIWxheWVyc1RvTWVyZ2UubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgbGF5ZXJzVG9NZXJnZS5mb3JFYWNoKGxheWVyID0+IHtcbiAgICBpZiAoZGF0YXNldHNbbGF5ZXIuY29uZmlnLmRhdGFJZF0pIHtcbiAgICAgIC8vIGRhdGFzZXRzIGFyZSBhbHJlYWR5IGxvYWRlZFxuICAgICAgY29uc3QgdmFsaWRhdGVMYXllciA9IHZhbGlkYXRlTGF5ZXJXaXRoRGF0YShcbiAgICAgICAgZGF0YXNldHNbbGF5ZXIuY29uZmlnLmRhdGFJZF0sXG4gICAgICAgIGxheWVyXG4gICAgICApO1xuXG4gICAgICBpZiAodmFsaWRhdGVMYXllcikge1xuICAgICAgICBtZXJnZWRMYXllci5wdXNoKHZhbGlkYXRlTGF5ZXIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBkYXRhc2V0cyBub3QgeWV0IGxvYWRlZFxuICAgICAgdW5tZXJnZWQucHVzaChsYXllcik7XG4gICAgfVxuICB9KTtcblxuICBjb25zdCBsYXllcnMgPSBbLi4uc3RhdGUubGF5ZXJzLCAuLi5tZXJnZWRMYXllcl07XG4gIGNvbnN0IG5ld0xheWVyT3JkZXIgPSBtZXJnZWRMYXllci5tYXAoKF8sIGkpID0+IHN0YXRlLmxheWVycy5sZW5ndGggKyBpKTtcblxuICAvLyBwdXQgbmV3IGxheWVycyBpbiBmcm9udCBvZiBjdXJyZW50IGxheWVyc1xuICBjb25zdCBsYXllck9yZGVyID0gWy4uLm5ld0xheWVyT3JkZXIsIC4uLnN0YXRlLmxheWVyT3JkZXJdO1xuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgbGF5ZXJzLFxuICAgIGxheWVyT3JkZXIsXG4gICAgbGF5ZXJUb0JlTWVyZ2VkOiB1bm1lcmdlZFxuICB9O1xufVxuXG4vKipcbiAqIE1lcmdlIGludGVyYWN0aW9ucyB3aXRoIHNhdmVkIGNvbmZpZ1xuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBzdGF0ZVxuICogQHBhcmFtIHtPYmplY3R9IGludGVyYWN0aW9uVG9CZU1lcmdlZFxuICogQHJldHVybiB7T2JqZWN0fSBtZXJnZWRTdGF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VJbnRlcmFjdGlvbnMoc3RhdGUsIGludGVyYWN0aW9uVG9CZU1lcmdlZCkge1xuICBjb25zdCBtZXJnZWQgPSB7fTtcbiAgY29uc3QgdW5tZXJnZWQgPSB7fTtcblxuICBpZiAoaW50ZXJhY3Rpb25Ub0JlTWVyZ2VkKSB7XG4gICAgT2JqZWN0LmtleXMoaW50ZXJhY3Rpb25Ub0JlTWVyZ2VkKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBpZiAoIXN0YXRlLmludGVyYWN0aW9uQ29uZmlnW2tleV0pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB7ZW5hYmxlZCwgLi4uY29uZmlnU2F2ZWR9ID0gaW50ZXJhY3Rpb25Ub0JlTWVyZ2VkW2tleV0gfHwge307XG4gICAgICBsZXQgY29uZmlnVG9NZXJnZSA9IGNvbmZpZ1NhdmVkO1xuXG4gICAgICBpZiAoa2V5ID09PSAndG9vbHRpcCcpIHtcbiAgICAgICAgY29uc3Qge21lcmdlZFRvb2x0aXAsIHVubWVyZ2VkVG9vbHRpcH0gPSBtZXJnZUludGVyYWN0aW9uVG9vbHRpcENvbmZpZyhcbiAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICBjb25maWdTYXZlZFxuICAgICAgICApO1xuXG4gICAgICAgIC8vIG1lcmdlIG5ldyBkYXRhc2V0IHRvb2x0aXBzIHdpdGggb3JpZ2luYWwgZGF0YXNldCB0b29sdGlwc1xuICAgICAgICBjb25maWdUb01lcmdlID0ge1xuICAgICAgICAgIGZpZWxkc1RvU2hvdzoge1xuICAgICAgICAgICAgLi4uc3RhdGUuaW50ZXJhY3Rpb25Db25maWdba2V5XS5jb25maWcuZmllbGRzVG9TaG93LFxuICAgICAgICAgICAgLi4ubWVyZ2VkVG9vbHRpcFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoT2JqZWN0LmtleXModW5tZXJnZWRUb29sdGlwKS5sZW5ndGgpIHtcbiAgICAgICAgICB1bm1lcmdlZC50b29sdGlwID0ge2ZpZWxkc1RvU2hvdzogdW5tZXJnZWRUb29sdGlwLCBlbmFibGVkfTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBtZXJnZWRba2V5XSA9IHtcbiAgICAgICAgLi4uc3RhdGUuaW50ZXJhY3Rpb25Db25maWdba2V5XSxcbiAgICAgICAgZW5hYmxlZCxcbiAgICAgICAgY29uZmlnOiBwaWNrKFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIC4uLnN0YXRlLmludGVyYWN0aW9uQ29uZmlnW2tleV0uY29uZmlnLFxuICAgICAgICAgICAgLi4uY29uZmlnVG9NZXJnZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgT2JqZWN0LmtleXMoc3RhdGUuaW50ZXJhY3Rpb25Db25maWdba2V5XS5jb25maWcpXG4gICAgICAgIClcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGludGVyYWN0aW9uQ29uZmlnOiB7XG4gICAgICAuLi5zdGF0ZS5pbnRlcmFjdGlvbkNvbmZpZyxcbiAgICAgIC4uLm1lcmdlZFxuICAgIH0sXG4gICAgaW50ZXJhY3Rpb25Ub0JlTWVyZ2VkOiB1bm1lcmdlZFxuICB9O1xufVxuXG4vKipcbiAqIE1lcmdlIGludGVyYWN0aW9uQ29uZmlnLnRvb2x0aXAgd2l0aCBzYXZlZCBjb25maWcsXG4gKiB2YWxpZGF0ZSBmaWVsZHNUb1Nob3dcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSB0b29sdGlwQ29uZmlnXG4gKiBAcmV0dXJuIHtPYmplY3R9IC0ge21lcmdlZFRvb2x0aXA6IHt9LCB1bm1lcmdlZFRvb2x0aXA6IHt9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VJbnRlcmFjdGlvblRvb2x0aXBDb25maWcoc3RhdGUsIHRvb2x0aXBDb25maWcgPSB7fSkge1xuICBjb25zdCB1bm1lcmdlZFRvb2x0aXAgPSB7fTtcbiAgY29uc3QgbWVyZ2VkVG9vbHRpcCA9IHt9O1xuXG4gIGlmIChcbiAgICAhdG9vbHRpcENvbmZpZy5maWVsZHNUb1Nob3cgfHxcbiAgICAhT2JqZWN0LmtleXModG9vbHRpcENvbmZpZy5maWVsZHNUb1Nob3cpLmxlbmd0aFxuICApIHtcbiAgICByZXR1cm4ge21lcmdlZFRvb2x0aXAsIHVubWVyZ2VkVG9vbHRpcH07XG4gIH1cblxuICBmb3IgKGNvbnN0IGRhdGFJZCBpbiB0b29sdGlwQ29uZmlnLmZpZWxkc1RvU2hvdykge1xuICAgIGlmICghc3RhdGUuZGF0YXNldHNbZGF0YUlkXSkge1xuICAgICAgLy8gaXMgbm90IHlldCBsb2FkZWRcbiAgICAgIHVubWVyZ2VkVG9vbHRpcFtkYXRhSWRdID0gdG9vbHRpcENvbmZpZy5maWVsZHNUb1Nob3dbZGF0YUlkXTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaWYgZGF0YXNldCBpcyBsb2FkZWRcbiAgICAgIGNvbnN0IGFsbEZpZWxkcyA9IHN0YXRlLmRhdGFzZXRzW2RhdGFJZF0uZmllbGRzLm1hcChkID0+IGQubmFtZSk7XG4gICAgICBjb25zdCBmb3VuZEZpZWxkc1RvU2hvdyA9IHRvb2x0aXBDb25maWcuZmllbGRzVG9TaG93W2RhdGFJZF0uZmlsdGVyKFxuICAgICAgICBuYW1lID0+IGFsbEZpZWxkcy5pbmNsdWRlcyhuYW1lKVxuICAgICAgKTtcblxuICAgICAgbWVyZ2VkVG9vbHRpcFtkYXRhSWRdID0gZm91bmRGaWVsZHNUb1Nob3c7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHttZXJnZWRUb29sdGlwLCB1bm1lcmdlZFRvb2x0aXB9O1xufVxuLyoqXG4gKiBNZXJnZSBsYXllckJsZW5kaW5nIHdpdGggc2F2ZWRcbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gc3RhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBsYXllckJsZW5kaW5nXG4gKiBAcmV0dXJuIHtvYmplY3R9IG1lcmdlZCBzdGF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VMYXllckJsZW5kaW5nKHN0YXRlLCBsYXllckJsZW5kaW5nKSB7XG4gIGlmIChsYXllckJsZW5kaW5nICYmIExBWUVSX0JMRU5ESU5HU1tsYXllckJsZW5kaW5nXSkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGxheWVyQmxlbmRpbmdcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHN0YXRlO1xufVxuXG4vKipcbiAqIFZhbGlkYXRlIHNhdmVkIGxheWVyIGNvbHVtbnMgd2l0aCBuZXcgZGF0YSxcbiAqIHVwZGF0ZSBmaWVsZElkeCBiYXNlZCBvbiBuZXcgZmllbGRzXG4gKlxuICogQHBhcmFtIHtPYmplY3RbXX0gZmllbGRzXG4gKiBAcGFyYW0ge09iamVjdH0gc2F2ZWRDb2xzXG4gKiBAcGFyYW0ge09iamVjdH0gZW1wdHlDb2xzXG4gKiBAcmV0dXJuIHtudWxsIHwgT2JqZWN0fSAtIHZhbGlkYXRlZCBjb2x1bW5zIG9yIG51bGxcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVTYXZlZExheWVyQ29sdW1ucyhmaWVsZHMsIHNhdmVkQ29scywgZW1wdHlDb2xzKSB7XG4gIGNvbnN0IGNvbEZvdW5kID0ge307XG4gIC8vIGZpbmQgYWN0dWFsIGNvbHVtbiBmaWVsZElkeCwgaW4gY2FzZSBpdCBoYXMgY2hhbmdlZFxuICBjb25zdCBhbGxDb2xGb3VuZCA9IE9iamVjdC5rZXlzKGVtcHR5Q29scykuZXZlcnkoa2V5ID0+IHtcbiAgICBjb25zdCBzYXZlZCA9IHNhdmVkQ29sc1trZXldO1xuICAgIGNvbEZvdW5kW2tleV0gPSB7Li4uZW1wdHlDb2xzW2tleV19O1xuXG4gICAgY29uc3QgZmllbGRJZHggPSBmaWVsZHMuZmluZEluZGV4KCh7bmFtZX0pID0+IG5hbWUgPT09IHNhdmVkKTtcblxuICAgIGlmIChmaWVsZElkeCA+IC0xKSB7XG4gICAgICAvLyB1cGRhdGUgZm91bmQgY29sdW1uc1xuICAgICAgY29sRm91bmRba2V5XS5maWVsZElkeCA9IGZpZWxkSWR4O1xuICAgICAgY29sRm91bmRba2V5XS52YWx1ZSA9IHNhdmVkO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gaWYgY29sIGlzIG9wdGlvbmFsLCBhbGxvdyBudWxsIHZhbHVlXG4gICAgcmV0dXJuIGVtcHR5Q29sc1trZXldLm9wdGlvbmFsIHx8IGZhbHNlO1xuICB9KTtcblxuICByZXR1cm4gYWxsQ29sRm91bmQgJiYgY29sRm91bmQ7XG59XG5cbi8qKlxuICogVmFsaWRhdGUgc2F2ZWQgdmlzdWFsIGNoYW5uZWxzIGNvbmZpZyB3aXRoIG5ldyBkYXRhLFxuICogcmVmZXIgdG8gdmlzLXN0YXRlLXNjaGVtYS5qcyBWaXN1YWxDaGFubmVsU2NoZW1hVjFcbiAqXG4gKiBAcGFyYW0ge09iamVjdFtdfSBmaWVsZHNcbiAqIEBwYXJhbSB7T2JqZWN0fSB2aXN1YWxDaGFubmVsc1xuICogQHBhcmFtIHtPYmplY3R9IHNhdmVkTGF5ZXJcbiAqIEByZXR1cm4ge09iamVjdH0gLSB2YWxpZGF0ZWQgdmlzdWFsIGNoYW5uZWwgaW4gY29uZmlnIG9yIHt9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVNhdmVkVmlzdWFsQ2hhbm5lbHMoXG4gIGZpZWxkcyxcbiAgdmlzdWFsQ2hhbm5lbHMsXG4gIHNhdmVkTGF5ZXJcbikge1xuICByZXR1cm4gT2JqZWN0LnZhbHVlcyh2aXN1YWxDaGFubmVscykucmVkdWNlKChmb3VuZCwge2ZpZWxkLCBzY2FsZX0pID0+IHtcbiAgICBsZXQgZm91bmRGaWVsZDtcbiAgICBpZiAoc2F2ZWRMYXllci5jb25maWdbZmllbGRdKSB7XG4gICAgICBmb3VuZEZpZWxkID0gZmllbGRzLmZpbmQoZmQgPT5cbiAgICAgICAgT2JqZWN0LmtleXMoc2F2ZWRMYXllci5jb25maWdbZmllbGRdKS5ldmVyeShcbiAgICAgICAgICBrZXkgPT4gc2F2ZWRMYXllci5jb25maWdbZmllbGRdW2tleV0gPT09IGZkW2tleV1cbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uZm91bmQsXG4gICAgICAuLi4oZm91bmRGaWVsZCA/IHtbZmllbGRdOiBmb3VuZEZpZWxkfSA6IHt9KSxcbiAgICAgIC4uLihzYXZlZExheWVyLmNvbmZpZ1tzY2FsZV0gPyB7W3NjYWxlXTogc2F2ZWRMYXllci5jb25maWdbc2NhbGVdfSA6IHt9KVxuICAgIH07XG4gIH0sIHt9KTtcbn1cblxuLyoqXG4gKiBWYWxpZGF0ZSBzYXZlZCBsYXllciBjb25maWcgd2l0aCBuZXcgZGF0YSxcbiAqIHVwZGF0ZSBmaWVsZElkeCBiYXNlZCBvbiBuZXcgZmllbGRzXG4gKlxuICogQHBhcmFtIHtPYmplY3RbXX0gZmllbGRzXG4gKiBAcGFyYW0ge1N0cmluZ30gZGF0YUlkXG4gKiBAcGFyYW0ge09iamVjdH0gc2F2ZWRMYXllclxuICogQHJldHVybiB7bnVsbCB8IE9iamVjdH0gLSB2YWxpZGF0ZWQgbGF5ZXIgb3IgbnVsbFxuICovXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVMYXllcldpdGhEYXRhKHtmaWVsZHMsIGlkOiBkYXRhSWR9LCBzYXZlZExheWVyKSB7XG4gIGNvbnN0IHt0eXBlfSA9IHNhdmVkTGF5ZXI7XG5cbiAgLy8gbGF5ZXIgZG9lc250IGhhdmUgYSB2YWxpZCB0eXBlXG4gIGlmIChcbiAgICAhTEFZRVJfQ0xBU1NFUy5oYXNPd25Qcm9wZXJ0eSh0eXBlKSB8fFxuICAgICFzYXZlZExheWVyLmNvbmZpZyB8fFxuICAgICFzYXZlZExheWVyLmNvbmZpZy5jb2x1bW5zXG4gICkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgTGF5ZXJDbGFzcyA9IEtlcGxlckdMTGF5ZXJzW0xBWUVSX0NMQVNTRVNbdHlwZV1dO1xuICBjb25zdCBuZXdMYXllciA9IG5ldyBMYXllckNsYXNzKHtcbiAgICBpZDogc2F2ZWRMYXllci5pZCxcbiAgICBkYXRhSWQsXG4gICAgbGFiZWw6IHNhdmVkTGF5ZXIuY29uZmlnLmxhYmVsLFxuICAgIGNvbG9yOiBzYXZlZExheWVyLmNvbmZpZy5jb2xvcixcbiAgICBpc1Zpc2libGU6IHNhdmVkTGF5ZXIuY29uZmlnLmlzVmlzaWJsZVxuICB9KTtcblxuICAvLyBmaW5kIGNvbHVtbiBmaWVsZElkeFxuICBjb25zdCBjb2x1bW5zID0gdmFsaWRhdGVTYXZlZExheWVyQ29sdW1ucyhcbiAgICBmaWVsZHMsXG4gICAgc2F2ZWRMYXllci5jb25maWcuY29sdW1ucyxcbiAgICBuZXdMYXllci5nZXRMYXllckNvbHVtbnMoKVxuICApO1xuXG4gIGlmICghY29sdW1ucykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gdmlzdWFsIGNoYW5uZWwgZmllbGQgaXMgc2F2ZWQgdG8gYmUge25hbWUsIHR5cGV9XG4gIC8vIGZpbmQgdmlzdWFsIGNoYW5uZWwgZmllbGQgYnkgbWF0Y2hpbmcgYm90aCBuYW1lIGFuZCB0eXBlXG4gIC8vIHJlZmVyIHRvIHZpcy1zdGF0ZS1zY2hlbWEuanMgVmlzdWFsQ2hhbm5lbFNjaGVtYVYxXG4gIGNvbnN0IGZvdW5kVmlzdWFsQ2hhbm5lbENvbmZpZ3MgPSB2YWxpZGF0ZVNhdmVkVmlzdWFsQ2hhbm5lbHMoXG4gICAgZmllbGRzLFxuICAgIG5ld0xheWVyLnZpc3VhbENoYW5uZWxzLFxuICAgIHNhdmVkTGF5ZXJcbiAgKTtcblxuICAvLyBjb3B5IHZpc0NvbmZpZyBvdmVyIHRvIGVtcHR5TGF5ZXIgdG8gbWFrZSBzdXJlIGl0IGhhcyBhbGwgdGhlIHByb3BzXG4gIGNvbnN0IHZpc0NvbmZpZyA9IG5ld0xheWVyLmFzc2lnbkNvbmZpZ1RvTGF5ZXIoXG4gICAgbmV3TGF5ZXIuY29uZmlnLnZpc0NvbmZpZyxcbiAgICBzYXZlZExheWVyLmNvbmZpZy52aXNDb25maWcgfHwge31cbiAgKTtcblxuICBuZXdMYXllci51cGRhdGVMYXllckNvbmZpZyh7XG4gICAgY29sdW1ucyxcbiAgICB2aXNDb25maWcsXG4gICAgLi4uZm91bmRWaXN1YWxDaGFubmVsQ29uZmlnc1xuICB9KTtcblxuICByZXR1cm4gbmV3TGF5ZXI7XG59XG5cbi8qKlxuICogVmFsaWRhdGUgc2F2ZWQgZmlsdGVyIGNvbmZpZyB3aXRoIG5ldyBkYXRhLFxuICogY2FsY3VsYXRlIGRvbWFpbiBhbmQgZmllbGRJZHggYmFzZWQgbmV3IGZpZWxkcyBhbmQgZGF0YVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0W119IGRhdGFzZXQuZmllbGRzXG4gKiBAcGFyYW0ge09iamVjdFtdfSBkYXRhc2V0LmFsbERhdGFcbiAqIEBwYXJhbSB7T2JqZWN0fSBmaWx0ZXIgLSBmaWx0ZXIgdG8gYmUgdmFsaWRhdGVcbiAqIEByZXR1cm4ge09iamVjdCB8IG51bGx9IC0gdmFsaWRhdGVkIGZpbHRlclxuICovXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVGaWx0ZXJXaXRoRGF0YSh7ZmllbGRzLCBhbGxEYXRhfSwgZmlsdGVyKSB7XG4gIC8vIG1hdGNoIGZpbHRlci5uYW1lIHRvIGZpZWxkLm5hbWVcbiAgY29uc3QgZmllbGRJZHggPSBmaWVsZHMuZmluZEluZGV4KCh7bmFtZX0pID0+IG5hbWUgPT09IGZpbHRlci5uYW1lKTtcblxuICBpZiAoZmllbGRJZHggPCAwKSB7XG4gICAgLy8gaWYgY2FuJ3QgZmluZCBmaWVsZCB3aXRoIHNhbWUgbmFtZSwgZGlzY2hhcmdlIGZpbHRlclxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgZmllbGQgPSBmaWVsZHNbZmllbGRJZHhdO1xuICBjb25zdCB2YWx1ZSA9IGZpbHRlci52YWx1ZTtcblxuICAvLyByZXR1cm4gZmlsdGVyIHR5cGUsIGRlZmF1bHQgdmFsdWUsIGZpZWxkVHlwZSBhbmQgZmllbGREb21haW4gZnJvbSBmaWVsZFxuICBjb25zdCBmaWx0ZXJQcm9wc0Zyb21GaWVsZCA9IGdldEZpbHRlclByb3BzKGFsbERhdGEsIGZpZWxkKTtcblxuICBsZXQgbWF0Y2hlZEZpbHRlciA9IHtcbiAgICAuLi5nZXREZWZhdWx0ZmlsdGVyKGZpbHRlci5kYXRhSWQpLFxuICAgIC4uLmZpbHRlcixcbiAgICAuLi5maWx0ZXJQcm9wc0Zyb21GaWVsZCxcbiAgICBmcmVlemU6IHRydWUsXG4gICAgZmllbGRJZHhcbiAgfTtcblxuICBjb25zdCB7eUF4aXN9ID0gbWF0Y2hlZEZpbHRlcjtcbiAgaWYgKHlBeGlzKSB7XG4gICAgY29uc3QgbWF0Y2hlQXhpcyA9IGZpZWxkcy5maW5kKFxuICAgICAgKHtuYW1lLCB0eXBlfSkgPT4gbmFtZSA9PT0geUF4aXMubmFtZSAmJiB0eXBlID09PSB5QXhpcy50eXBlXG4gICAgKTtcblxuICAgIG1hdGNoZWRGaWx0ZXIgPSBtYXRjaGVBeGlzXG4gICAgICA/IHtcbiAgICAgICAgICAuLi5tYXRjaGVkRmlsdGVyLFxuICAgICAgICAgIHlBeGlzOiBtYXRjaGVBeGlzLFxuICAgICAgICAgIC4uLmdldEZpbHRlclBsb3Qoey4uLm1hdGNoZWRGaWx0ZXIsIHlBeGlzOiBtYXRjaGVBeGlzfSwgYWxsRGF0YSlcbiAgICAgICAgfVxuICAgICAgOiBtYXRjaGVkRmlsdGVyO1xuICB9XG5cbiAgbWF0Y2hlZEZpbHRlci52YWx1ZSA9IGFkanVzdFZhbHVlVG9GaWx0ZXJEb21haW4odmFsdWUsIG1hdGNoZWRGaWx0ZXIpO1xuXG4gIGlmIChtYXRjaGVkRmlsdGVyLnZhbHVlID09PSBudWxsKSB7XG4gICAgLy8gY2FubnQgYWRqdXN0IHNhdmVkIHZhbHVlIHRvIGZpbHRlclxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIG1hdGNoZWRGaWx0ZXI7XG59XG4iXX0=