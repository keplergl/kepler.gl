'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadFilesErrUpdater = exports.loadFilesUpdater = exports.toggleLayerForMapUpdater = exports.setVisibleLayersForMapUpdater = exports.toggleSplitMapUpdater = exports.mapClickUpdater = exports.layerClickUpdater = exports.layerHoverUpdater = exports.receiveMapConfigUpdater = exports.resetMapConfigUpdater = exports.updateVisDataUpdater = exports.showDatasetTableUpdater = exports.updateLayerBlendingUpdater = exports.removeDatasetUpdater = exports.reorderLayerUpdater = exports.removeLayerUpdater = exports.addLayerUpdater = exports.removeFilterUpdater = exports.enlargeFilterUpdater = exports.toggleFilterAnimationUpdater = exports.addFilterUpdater = exports.setFilterPlotUpdater = exports.INITIAL_VIS_STATE = undefined;

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends13 = require('babel-runtime/helpers/extends');

var _extends14 = _interopRequireDefault(_extends13);

exports.layerConfigChangeUpdater = layerConfigChangeUpdater;
exports.layerTypeChangeUpdater = layerTypeChangeUpdater;
exports.layerVisualChannelChangeUpdater = layerVisualChannelChangeUpdater;
exports.layerVisConfigChangeUpdater = layerVisConfigChangeUpdater;
exports.interactionConfigChangeUpdater = interactionConfigChangeUpdater;
exports.setFilterUpdater = setFilterUpdater;
exports.addDefaultLayers = addDefaultLayers;
exports.addDefaultTooltips = addDefaultTooltips;
exports.updateAllLayerDomainData = updateAllLayerDomainData;

var _lodash = require('lodash.clonedeep');

var _lodash2 = _interopRequireDefault(_lodash);

var _window = require('global/window');

var _reactPalm = require('react-palm');

var _tasks = require('../tasks/tasks');

var _visStateActions = require('../actions/vis-state-actions');

var _interactionUtils = require('../utils/interaction-utils');

var _utils = require('../utils/utils');

var _filterUtils = require('../utils/filter-utils');

var _datasetUtils = require('../utils/dataset-utils');

var _layerUtils = require('../utils/layer-utils/layer-utils');

var _fileHandler = require('../processor/file-handler');

var _dataUtils = require('../utils/data-utils');

var _visStateMerger = require('./vis-state-merger');

var _keplerglLayers = require('../keplergl-layers');

var KeplerGLLayers = _interopRequireWildcard(_keplerglLayers);

var _defaultSettings = require('../constants/default-settings');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Actions
var INITIAL_VIS_STATE = exports.INITIAL_VIS_STATE = {
  // layers
  layers: [],
  layerData: [],
  layerToBeMerged: [],
  layerOrder: [],

  // filters
  filters: [],
  filterToBeMerged: [],

  // a collection of multiple dataset
  datasets: {},
  editingDataset: undefined,

  interactionConfig: (0, _interactionUtils.getDefaultInteraction)(),
  interactionToBeMerged: undefined,

  layerBlending: 'normal',
  hoverInfo: undefined,
  clicked: undefined,

  fileLoading: false,
  fileLoadingErr: null,

  // this is used when user split maps
  splitMaps: [
    // this will contain a list of objects to
    // describe the state of layer availability and visibility for each map
    // [
    //   {
    //     layers: {
    //       layer_id: {
    //         isAvailable: true|false # this is driven by the left hand panel
    //         isVisible: true|false
    //       }
    //     }
    //   }
    // ]
  ]
};

// Utils


// Tasks


function updateStateWithLayerAndData(state, _ref) {
  var layerData = _ref.layerData,
      layer = _ref.layer,
      idx = _ref.idx;

  return (0, _extends14.default)({}, state, {
    layers: state.layers.map(function (lyr, i) {
      return i === idx ? layer : lyr;
    }),
    layerData: layerData ? state.layerData.map(function (d, i) {
      return i === idx ? layerData : d;
    }) : state.layerData
  });
}

/**
 * Called to update layer base config: dataId, label, column, isVisible
 *
 */
function layerConfigChangeUpdater(state, action) {
  var oldLayer = action.oldLayer;

  var idx = state.layers.findIndex(function (l) {
    return l.id === oldLayer.id;
  });
  var props = Object.keys(action.newConfig);

  var newLayer = oldLayer.updateLayerConfig(action.newConfig);
  if (newLayer.shouldCalculateLayerData(props)) {
    var oldLayerData = state.layerData[idx];

    var _calculateLayerData = (0, _layerUtils.calculateLayerData)(newLayer, state, oldLayerData, { sameData: true }),
        layerData = _calculateLayerData.layerData,
        layer = _calculateLayerData.layer;

    return updateStateWithLayerAndData(state, { layerData: layerData, layer: layer, idx: idx });
  }

  var newState = (0, _extends14.default)({}, state, {
    splitMaps: 'isVisible' in action.newConfig ? toggleLayerFromSplitMaps(state, newLayer) : state.splitMaps
  });

  return updateStateWithLayerAndData(newState, { layer: newLayer, idx: idx });
}

function layerTypeChangeUpdater(state, action) {
  var oldLayer = action.oldLayer,
      newType = action.newType;

  var oldId = oldLayer.id;
  var idx = state.layers.findIndex(function (l) {
    return l.id === oldId;
  });

  if (!_defaultSettings.LAYER_CLASSES[newType] || !KeplerGLLayers[_defaultSettings.LAYER_CLASSES[newType]]) {
    _window.console.error(newType + ' is not a valid layer type');
    return state;
  }

  // get a mint layer, with new id and type
  // because deck.gl uses id to match between new and old layer.
  // If type has changed but id is the same, it will break
  var LayerClass = KeplerGLLayers[_defaultSettings.LAYER_CLASSES[newType]];
  var newLayer = new LayerClass();

  newLayer.config = newLayer.assignConfigToLayer(newLayer.config, oldLayer.config);

  var _calculateLayerData2 = (0, _layerUtils.calculateLayerData)(newLayer, state),
      layerData = _calculateLayerData2.layerData,
      layer = _calculateLayerData2.layer;

  var newState = state;

  // update splitMap layer id
  if (state.splitMaps) {
    newState = (0, _extends14.default)({}, state, {
      splitMaps: state.splitMaps.map(function (settings) {
        var _extends2;

        var _settings$layers = settings.layers,
            oldLayerMap = _settings$layers[oldId],
            otherLayers = (0, _objectWithoutProperties3.default)(_settings$layers, [oldId]);

        return (0, _extends14.default)({}, settings, {
          layers: (0, _extends14.default)({}, otherLayers, (_extends2 = {}, _extends2[layer.id] = oldLayerMap, _extends2))
        });
      })
    });
  }

  return updateStateWithLayerAndData(newState, { layerData: layerData, layer: layer, idx: idx });
}

function layerVisualChannelChangeUpdater(state, action) {
  var oldLayer = action.oldLayer,
      newConfig = action.newConfig,
      channel = action.channel;
  var _state$datasets$oldLa = state.datasets[oldLayer.config.dataId],
      data = _state$datasets$oldLa.data,
      allData = _state$datasets$oldLa.allData;


  var idx = state.layers.findIndex(function (l) {
    return l.id === oldLayer.id;
  });
  var newLayer = oldLayer.updateLayerConfig(newConfig);

  newLayer.updateLayerVisualChannel({ data: data, allData: allData }, channel);

  var oldLayerData = state.layerData[idx];

  var _calculateLayerData3 = (0, _layerUtils.calculateLayerData)(newLayer, state, oldLayerData, { sameData: true }),
      layerData = _calculateLayerData3.layerData,
      layer = _calculateLayerData3.layer;

  return updateStateWithLayerAndData(state, { layerData: layerData, layer: layer, idx: idx });
}

function layerVisConfigChangeUpdater(state, action) {
  var oldLayer = action.oldLayer;

  var idx = state.layers.findIndex(function (l) {
    return l.id === oldLayer.id;
  });
  var props = Object.keys(action.newVisConfig);

  var newVisConfig = (0, _extends14.default)({}, oldLayer.config.visConfig, action.newVisConfig);

  var newLayer = oldLayer.updateLayerConfig({ visConfig: newVisConfig });

  if (newLayer.shouldCalculateLayerData(props)) {
    var oldLayerData = state.layerData[idx];

    var _calculateLayerData4 = (0, _layerUtils.calculateLayerData)(newLayer, state, oldLayerData, { sameData: true }),
        layerData = _calculateLayerData4.layerData,
        layer = _calculateLayerData4.layer;

    return updateStateWithLayerAndData(state, { layerData: layerData, layer: layer, idx: idx });
  }

  return updateStateWithLayerAndData(state, { layer: newLayer, idx: idx });
}

/* eslint-enable max-statements */

function interactionConfigChangeUpdater(state, action) {
  var _extends3;

  var config = action.config;


  var interactionConfig = (0, _extends14.default)({}, state.interactionConfig, (_extends3 = {}, _extends3[config.id] = config, _extends3));

  if (config.enabled && !state.interactionConfig[config.id].enabled) {
    // only enable one interaction at a time
    Object.keys(interactionConfig).forEach(function (k) {
      if (k !== config.id) {
        interactionConfig[k] = (0, _extends14.default)({}, interactionConfig[k], { enabled: false });
      }
    });
  }

  return (0, _extends14.default)({}, state, {
    interactionConfig: interactionConfig
  });
}

function setFilterUpdater(state, action) {
  var _extends4, _extends5, _extends6;

  var idx = action.idx,
      prop = action.prop,
      value = action.value;

  var newState = state;
  var newFilter = (0, _extends14.default)({}, state.filters[idx], (_extends4 = {}, _extends4[prop] = value, _extends4));

  var _newFilter = newFilter,
      dataId = _newFilter.dataId;

  if (!dataId) {
    return state;
  }
  var _state$datasets$dataI = state.datasets[dataId],
      fields = _state$datasets$dataI.fields,
      allData = _state$datasets$dataI.allData;


  switch (prop) {
    case 'dataId':
      // if trying to update filter dataId. create an empty new filter
      newFilter = (0, _filterUtils.getDefaultfilter)(dataId);
      break;

    case 'name':

      // find the field
      var fieldIdx = fields.findIndex(function (f) {
        return f.name === value;
      });
      var field = fields[fieldIdx];

      if (!field.filterProp) {

        // get filter domain from field
        // save filterProps: {domain, steps, value} to field, avoid recalculate
        field = (0, _extends14.default)({}, field, {
          filterProp: (0, _filterUtils.getFilterProps)(allData, field)
        });
      }

      newFilter = (0, _extends14.default)({}, newFilter, field.filterProp, {
        name: field.name,
        // can't edit dataId once name is selected
        freeze: true,
        fieldIdx: fieldIdx
      });

      newState = (0, _extends14.default)({}, state, {
        datasets: (0, _extends14.default)({}, state.datasets, (_extends5 = {}, _extends5[dataId] = (0, _extends14.default)({}, state.datasets[dataId], {
          fields: fields.map(function (d, i) {
            return i === fieldIdx ? field : d;
          })
        }), _extends5))
      });
      break;
    case 'value':
    default:
      break;
  }

  // save new filters to newState
  newState = (0, _extends14.default)({}, newState, {
    filters: state.filters.map(function (f, i) {
      return i === idx ? newFilter : f;
    })
  });

  // filter data
  newState = (0, _extends14.default)({}, newState, {
    datasets: (0, _extends14.default)({}, newState.datasets, (_extends6 = {}, _extends6[dataId] = (0, _extends14.default)({}, newState.datasets[dataId], (0, _filterUtils.filterData)(allData, dataId, newState.filters)), _extends6))
  });

  newState = updateAllLayerDomainData(newState, dataId);

  return newState;
}

var setFilterPlotUpdater = exports.setFilterPlotUpdater = function setFilterPlotUpdater(state, _ref2) {
  var idx = _ref2.idx,
      newProp = _ref2.newProp;

  var newFilter = (0, _extends14.default)({}, state.filters[idx], newProp);
  var prop = Object.keys(newProp)[0];
  if (prop === 'yAxis') {
    var plotType = (0, _filterUtils.getDefaultFilterPlotType)(newFilter);

    if (plotType) {
      newFilter = (0, _extends14.default)({}, newFilter, (0, _filterUtils.getFilterPlot)((0, _extends14.default)({}, newFilter, { plotType: plotType }), state.datasets[newFilter.dataId].allData), {
        plotType: plotType
      });
    }
  }

  return (0, _extends14.default)({}, state, {
    filters: state.filters.map(function (f, i) {
      return i === idx ? newFilter : f;
    })
  });
};

var addFilterUpdater = exports.addFilterUpdater = function addFilterUpdater(state, action) {
  return !action.dataId ? state : (0, _extends14.default)({}, state, {
    filters: [].concat(state.filters, [(0, _filterUtils.getDefaultfilter)(action.dataId)])
  });
};

var toggleFilterAnimationUpdater = exports.toggleFilterAnimationUpdater = function toggleFilterAnimationUpdater(state, action) {
  return (0, _extends14.default)({}, state, {
    filters: state.filters.map(function (f, i) {
      return i === action.idx ? (0, _extends14.default)({}, f, { isAnimating: !f.isAnimating }) : f;
    })
  });
};

var enlargeFilterUpdater = exports.enlargeFilterUpdater = function enlargeFilterUpdater(state, action) {
  var isEnlarged = state.filters[action.idx].enlarged;

  return (0, _extends14.default)({}, state, {
    filters: state.filters.map(function (f, i) {
      f.enlarged = !isEnlarged && i === action.idx;
      return f;
    })
  });
};

var removeFilterUpdater = exports.removeFilterUpdater = function removeFilterUpdater(state, action) {
  var _extends7;

  var idx = action.idx;
  var dataId = state.filters[idx].dataId;


  var newFilters = [].concat(state.filters.slice(0, idx), state.filters.slice(idx + 1, state.filters.length));

  var newState = (0, _extends14.default)({}, state, {
    datasets: (0, _extends14.default)({}, state.datasets, (_extends7 = {}, _extends7[dataId] = (0, _extends14.default)({}, state.datasets[dataId], (0, _filterUtils.filterData)(state.datasets[dataId].allData, dataId, newFilters)), _extends7)),
    filters: newFilters
  });

  return updateAllLayerDomainData(newState, dataId);
};

var addLayerUpdater = exports.addLayerUpdater = function addLayerUpdater(state, action) {
  var defaultDataset = Object.keys(state.datasets)[0];

  var newLayer = new KeplerGLLayers.Layer({
    isVisible: true,
    isConfigActive: true,
    dataId: defaultDataset
  });

  return (0, _extends14.default)({}, state, {
    layers: [].concat(state.layers, [newLayer]),
    layerData: [].concat(state.layerData, [{}]),
    layerOrder: [].concat(state.layerOrder, [state.layerOrder.length]),
    splitMaps: addNewLayersToSplitMap(state.splitMaps, newLayer)
  });
};

var removeLayerUpdater = exports.removeLayerUpdater = function removeLayerUpdater(state, _ref3) {
  var idx = _ref3.idx;
  var layers = state.layers,
      layerData = state.layerData,
      clicked = state.clicked,
      hoverInfo = state.hoverInfo;

  var layerToRemove = state.layers[idx];
  var newMaps = removeLayerFromSplitMaps(state, layerToRemove);

  return (0, _extends14.default)({}, state, {
    layers: [].concat(layers.slice(0, idx), layers.slice(idx + 1, layers.length)),
    layerData: [].concat(layerData.slice(0, idx), layerData.slice(idx + 1, layerData.length)),
    layerOrder: state.layerOrder.filter(function (i) {
      return i !== idx;
    }).map(function (pid) {
      return pid > idx ? pid - 1 : pid;
    }),
    clicked: layerToRemove.isLayerHovered(clicked) ? undefined : clicked,
    hoverInfo: layerToRemove.isLayerHovered(hoverInfo) ? undefined : hoverInfo,
    splitMaps: newMaps
  });
};

var reorderLayerUpdater = exports.reorderLayerUpdater = function reorderLayerUpdater(state, _ref4) {
  var order = _ref4.order;
  return (0, _extends14.default)({}, state, {
    layerOrder: order
  });
};

var removeDatasetUpdater = function removeDatasetUpdater(state, action) {
  // extract dataset key
  var datasetKey = action.key;
  var datasets = state.datasets;

  // check if dataset is present

  if (!datasets[datasetKey]) {
    return state;
  }

  /* eslint-disable no-unused-vars */
  var layers = state.layers,
      _state$datasets = state.datasets,
      dataset = _state$datasets[datasetKey],
      newDatasets = (0, _objectWithoutProperties3.default)(_state$datasets, [datasetKey]);
  /* eslint-enable no-unused-vars */

  var indexes = layers.reduce(function (listOfIndexes, layer, index) {
    if (layer.config.dataId === datasetKey) {
      listOfIndexes.push(index);
    }
    return listOfIndexes;
  }, []);

  // remove layers and datasets

  var _indexes$reduce = indexes.reduce(function (_ref5, idx) {
    var currentState = _ref5.newState,
        indexCounter = _ref5.indexCounter;

    var currentIndex = idx - indexCounter;
    currentState = removeLayerUpdater(currentState, { idx: currentIndex });
    indexCounter++;
    return { newState: currentState, indexCounter: indexCounter };
  }, { newState: (0, _extends14.default)({}, state, { datasets: newDatasets }), indexCounter: 0 }),
      newState = _indexes$reduce.newState;

  // remove filters


  var filters = state.filters.filter(function (filter) {
    return filter.dataId !== datasetKey;
  });

  // update interactionConfig
  var interactionConfig = state.interactionConfig;
  var _interactionConfig = interactionConfig,
      tooltip = _interactionConfig.tooltip;

  if (tooltip) {
    var config = tooltip.config;
    /* eslint-disable no-unused-vars */

    var _config$fieldsToShow = config.fieldsToShow,
        fields = _config$fieldsToShow[datasetKey],
        fieldsToShow = (0, _objectWithoutProperties3.default)(_config$fieldsToShow, [datasetKey]);
    /* eslint-enable no-unused-vars */

    interactionConfig = (0, _extends14.default)({}, interactionConfig, { tooltip: (0, _extends14.default)({}, tooltip, { config: (0, _extends14.default)({}, config, { fieldsToShow: fieldsToShow }) }) });
  }

  return (0, _extends14.default)({}, newState, { filters: filters, interactionConfig: interactionConfig });
};

exports.removeDatasetUpdater = removeDatasetUpdater;
var updateLayerBlendingUpdater = exports.updateLayerBlendingUpdater = function updateLayerBlendingUpdater(state, action) {
  return (0, _extends14.default)({}, state, {
    layerBlending: action.mode
  });
};

var showDatasetTableUpdater = exports.showDatasetTableUpdater = function showDatasetTableUpdater(state, action) {
  return (0, _extends14.default)({}, state, {
    editingDataset: action.dataId
  });
};

/* eslint-disable max-statements */
var updateVisDataUpdater = exports.updateVisDataUpdater = function updateVisDataUpdater(state, action) {
  // datasets can be a single data entries or an array of multiple data entries
  var datasets = Array.isArray(action.datasets) ? action.datasets : [action.datasets];
  var _action$options = action.options,
      options = _action$options === undefined ? { centerMap: true } : _action$options;


  var newDateEntries = datasets.reduce(function (accu, _ref6) {
    var _ref6$info = _ref6.info,
        info = _ref6$info === undefined ? {} : _ref6$info,
        data = _ref6.data;
    return (0, _extends14.default)({}, accu, (0, _datasetUtils.createNewDataEntry)({ info: info, data: data }, state.datasets) || {});
  }, {});

  if (!Object.keys(newDateEntries).length) {
    return state;
  }

  var stateWithNewData = (0, _extends14.default)({}, state, {
    datasets: (0, _extends14.default)({}, state.datasets, newDateEntries)
  });

  // previously saved config before data loaded
  var _stateWithNewData$fil = stateWithNewData.filterToBeMerged,
      filterToBeMerged = _stateWithNewData$fil === undefined ? [] : _stateWithNewData$fil,
      _stateWithNewData$lay = stateWithNewData.layerToBeMerged,
      layerToBeMerged = _stateWithNewData$lay === undefined ? [] : _stateWithNewData$lay,
      _stateWithNewData$int = stateWithNewData.interactionToBeMerged,
      interactionToBeMerged = _stateWithNewData$int === undefined ? {} : _stateWithNewData$int;

  // keep a copy of oldLayers

  var oldLayers = state.layers.map(function (l) {
    return l.id;
  });

  // merge state with saved filters
  var mergedState = (0, _visStateMerger.mergeFilters)(stateWithNewData, filterToBeMerged);
  // merge state with saved layers
  mergedState = (0, _visStateMerger.mergeLayers)(mergedState, layerToBeMerged);

  if (mergedState.layers.length === state.layers.length) {
    // no layer merged, find defaults
    mergedState = addDefaultLayers(mergedState, newDateEntries);
  }

  if (mergedState.splitMaps.length) {
    var newLayers = mergedState.layers.filter(function (l) {
      return l.config.dataId in newDateEntries;
    });
    // if map is splited, add new layers to splitMaps
    mergedState = (0, _extends14.default)({}, mergedState, {
      splitMaps: addNewLayersToSplitMap(mergedState.splitMaps, newLayers)
    });
  }

  // merge state with saved interactions
  mergedState = (0, _visStateMerger.mergeInteractions)(mergedState, interactionToBeMerged);

  // if no tooltips merged add default tooltips
  Object.keys(newDateEntries).forEach(function (dataId) {
    var tooltipFields = mergedState.interactionConfig.tooltip.config.fieldsToShow[dataId];
    if (!Array.isArray(tooltipFields) || !tooltipFields.length) {
      mergedState = addDefaultTooltips(mergedState, newDateEntries[dataId]);
    }
  });

  var visState = updateAllLayerDomainData(mergedState, Object.keys(newDateEntries));

  var bounds = void 0;
  if (options.centerMap) {
    // find map bounds for new layers
    var _newLayers = visState.layers.filter(function (l) {
      return !oldLayers.includes(l.id);
    });
    bounds = (0, _dataUtils.findMapBounds)(_newLayers);
  }

  // action is being composed in the combine reducer level to further update map bounds
  return { visState: visState, bounds: bounds };
};
/* eslint-enable max-statements */

var resetMapConfigUpdater = exports.resetMapConfigUpdater = function resetMapConfigUpdater() {
  return (0, _lodash2.default)(INITIAL_VIS_STATE);
};

var receiveMapConfigUpdater = exports.receiveMapConfigUpdater = function receiveMapConfigUpdater(state, action) {
  if (!action.payload.visState) {
    return state;
  }

  var _action$payload$visSt = action.payload.visState,
      filters = _action$payload$visSt.filters,
      layers = _action$payload$visSt.layers,
      interactionConfig = _action$payload$visSt.interactionConfig,
      layerBlending = _action$payload$visSt.layerBlending,
      splitMaps = _action$payload$visSt.splitMaps;

  // always reset config when receive a new config

  var resetState = resetMapConfigUpdater();
  var mergedState = (0, _extends14.default)({}, resetState, {
    splitMaps: splitMaps || [] // maps doesn't require any logic
  });

  mergedState = (0, _visStateMerger.mergeFilters)(mergedState, filters);
  mergedState = (0, _visStateMerger.mergeLayers)(mergedState, layers);
  mergedState = (0, _visStateMerger.mergeInteractions)(mergedState, interactionConfig);
  mergedState = (0, _visStateMerger.mergeLayerBlending)(mergedState, layerBlending);

  return mergedState;
};

var layerHoverUpdater = exports.layerHoverUpdater = function layerHoverUpdater(state, action) {
  return (0, _extends14.default)({}, state, {
    hoverInfo: action.info
  });
};

var layerClickUpdater = exports.layerClickUpdater = function layerClickUpdater(state, action) {
  return (0, _extends14.default)({}, state, {
    clicked: action.info && action.info.picked ? action.info : null
  });
};

var mapClickUpdater = exports.mapClickUpdater = function mapClickUpdater(state, action) {
  return (0, _extends14.default)({}, state, {
    clicked: null
  });
};

var toggleSplitMapUpdater = exports.toggleSplitMapUpdater = function toggleSplitMapUpdater(state, action) {
  return state.splitMaps && state.splitMaps.length === 0 ? (0, _extends14.default)({}, state, {
    // maybe we should use an array to store state for a single map as well
    // if current maps length is equal to 0 it means that we are about to split the view
    splitMaps: computeSplitMapLayers(state.layers)
  }) : closeSpecificMapAtIndex(state, action);
};

/**
 * This is triggered when view is split into multiple maps.
 * It will only update layers that belong to the map layer dropdown
 * the user is interacting wit
 * @param state
 * @param action
 */
var setVisibleLayersForMapUpdater = exports.setVisibleLayersForMapUpdater = function setVisibleLayersForMapUpdater(state, action) {
  var mapIndex = action.mapIndex,
      layerIds = action.layerIds;

  if (!layerIds) {
    return state;
  }

  var _state$splitMaps = state.splitMaps,
      splitMaps = _state$splitMaps === undefined ? [] : _state$splitMaps;


  if (splitMaps.length === 0) {
    // we should never get into this state
    // because this action should only be triggered
    // when map view is split
    // but something may have happened
    return state;
  }

  // need to check if maps is populated otherwise will create
  var _splitMaps$mapIndex = splitMaps[mapIndex],
      map = _splitMaps$mapIndex === undefined ? {} : _splitMaps$mapIndex;


  var layers = map.layers || [];

  // we set visibility to true for all layers included in our input list
  var newLayers = (Object.keys(layers) || []).reduce(function (currentLayers, idx) {
    var _extends8;

    return (0, _extends14.default)({}, currentLayers, (_extends8 = {}, _extends8[idx] = (0, _extends14.default)({}, layers[idx], {
      isVisible: layerIds.includes(idx)
    }), _extends8));
  }, {});

  var newMaps = [].concat(splitMaps);

  newMaps[mapIndex] = (0, _extends14.default)({}, splitMaps[mapIndex], {
    layers: newLayers
  });

  return (0, _extends14.default)({}, state, {
    splitMaps: newMaps
  });
};

var toggleLayerForMapUpdater = exports.toggleLayerForMapUpdater = function toggleLayerForMapUpdater(state, action) {
  var _extends9;

  if (!state.splitMaps[action.mapIndex]) {
    return state;
  }

  var mapSettings = state.splitMaps[action.mapIndex];
  var layers = mapSettings.layers;

  if (!layers || !layers[action.layerId]) {
    return state;
  }

  var layer = layers[action.layerId];

  var newLayer = (0, _extends14.default)({}, layer, {
    isVisible: !layer.isVisible
  });

  var newLayers = (0, _extends14.default)({}, layers, (_extends9 = {}, _extends9[action.layerId] = newLayer, _extends9));

  // const splitMaps = state.splitMaps;
  var newSplitMaps = [].concat(state.splitMaps);
  newSplitMaps[action.mapIndex] = (0, _extends14.default)({}, mapSettings, {
    layers: newLayers
  });

  return (0, _extends14.default)({}, state, {
    splitMaps: newSplitMaps
  });
};

function generateLayerMetaForSplitViews(layer) {
  return {
    isAvailable: layer.config.isVisible,
    isVisible: layer.config.isVisible
  };
}

/**
 * This emthod will compute the default maps custom list
 * based on the current layers status
 * @param layers
 * @returns {[*,*]}
 */
function computeSplitMapLayers(layers) {
  var mapLayers = layers.reduce(function (newLayers, currentLayer) {
    var _extends10;

    return (0, _extends14.default)({}, newLayers, (_extends10 = {}, _extends10[currentLayer.id] = generateLayerMetaForSplitViews(currentLayer), _extends10));
  }, {});
  return [{
    layers: mapLayers
  }, {
    layers: mapLayers
  }];
}

/**
 * Remove an existing layers from custom map layer objects
 * @param state
 * @param layer
 * @returns {[*,*]} Maps of custom layer objects
 */
function removeLayerFromSplitMaps(state, layer) {
  return state.splitMaps.map(function (settings) {
    var layers = settings.layers;
    /* eslint-disable no-unused-vars */

    var _ = layers[layer.id],
        newLayers = (0, _objectWithoutProperties3.default)(layers, [layer.id]);
    /* eslint-enable no-unused-vars */

    return (0, _extends14.default)({}, settings, {
      layers: newLayers
    });
  });
}

/**
 * Add new layers to both existing maps
 * @param splitMaps
 * @param layers
 * @returns {[*,*]} new splitMaps
 */
function addNewLayersToSplitMap(splitMaps, layers) {
  var newLayers = Array.isArray(layers) ? layers : [layers];

  if (!splitMaps || !splitMaps.length || !newLayers.length) {
    return splitMaps;
  }

  // add new layer to both maps,
  //  don't override, if layer.id is already in splitMaps.settings.layers
  return splitMaps.map(function (settings) {
    return (0, _extends14.default)({}, settings, {
      layers: (0, _extends14.default)({}, settings.layers, newLayers.reduce(function (accu, newLayer) {
        var _extends11;

        return newLayer.config.isVisible ? (0, _extends14.default)({}, accu, (_extends11 = {}, _extends11[newLayer.id] = settings.layers[newLayer.id] ? settings.layers[newLayer.id] : generateLayerMetaForSplitViews(newLayer), _extends11)) : accu;
      }, {}))
    });
  });
}

/**
 * Hide an existing layers from custom map layer objects
 * @param state
 * @param layer
 * @returns {[*,*]} Maps of custom layer objects
 */
function toggleLayerFromSplitMaps(state, layer) {
  return state.splitMaps.map(function (settings) {
    var _extends12;

    var layers = settings.layers;

    var newLayers = (0, _extends14.default)({}, layers, (_extends12 = {}, _extends12[layer.id] = generateLayerMetaForSplitViews(layer), _extends12));

    return (0, _extends14.default)({}, settings, {
      layers: newLayers
    });
  });
}

/**
 * When a user clicks on the specific map closing icon
 * the application will close the selected map
 * and will merge the remaining one with the global state
 * TODO: i think in the future this action should be called merge map layers with global settings
 * @param state
 * @param action
 * @returns {*}
 */
function closeSpecificMapAtIndex(state, action) {
  // retrieve layers meta data from the remaining map that we need to keep
  var indexToRetrieve = 1 - action.payload;

  var metaSettings = state.splitMaps[indexToRetrieve];
  if (!metaSettings || !metaSettings.layers) {
    // if we can't find the meta settings we simply clean up splitMaps and
    // keep global state as it is
    // but why does this ever happen?
    return (0, _extends14.default)({}, state, {
      splitMaps: []
    });
  }

  var layers = state.layers;

  // update layer visibility

  var newLayers = layers.map(function (layer) {
    return layer.updateLayerConfig({ isVisible: metaSettings.layers[layer.id] ? metaSettings.layers[layer.id].isVisible : layer.config.isVisible });
  });

  // delete map
  return (0, _extends14.default)({}, state, {
    layers: newLayers,
    splitMaps: []
  });
}

// TODO: redo write handler to not use tasks
var loadFilesUpdater = exports.loadFilesUpdater = function loadFilesUpdater(state, action) {
  var files = action.files;

  var filesToLoad = files.map(function (fileBlob) {
    return {
      fileBlob: fileBlob,
      info: {
        id: (0, _utils.generateHashId)(4),
        label: fileBlob.name,
        size: fileBlob.size
      },
      handler: (0, _fileHandler.getFileHandler)(fileBlob)
    };
  });

  // reader -> parser -> augment -> receiveVisData
  var loadFileTasks = [_reactPalm.Task.all(filesToLoad.map(_tasks.LOAD_FILE_TASK)).bimap(function (results) {
    return (0, _visStateActions.updateVisData)(results, { centerMap: true });
  }, function (error) {
    return (0, _visStateActions.loadFilesErr)(error);
  })];

  return (0, _reactPalm.withTask)((0, _extends14.default)({}, state, {
    fileLoading: true
  }), loadFileTasks);
};

var loadFilesErrUpdater = exports.loadFilesErrUpdater = function loadFilesErrUpdater(state, _ref7) {
  var error = _ref7.error;
  return (0, _extends14.default)({}, state, {
    fileLoading: false,
    fileLoadingErr: error
  });
};

/**
 * helper function to update All layer domain and layer data of state
 *
 * @param {object} state
 * @param {string} datasets
 * @returns {object} state
 */
function addDefaultLayers(state, datasets) {
  var defaultLayers = Object.values(datasets).reduce(function (accu, dataset) {
    return [].concat(accu, (0, _layerUtils.findDefaultLayer)(dataset) || []);
  }, []);

  return (0, _extends14.default)({}, state, {
    layers: [].concat(state.layers, defaultLayers),
    layerOrder: [].concat(defaultLayers.map(function (_, i) {
      return state.layers.length + i;
    }), state.layerOrder)
  });
}

/**
 * helper function to find default tooltips
 *
 * @param {object} state
 * @param {object} dataset
 * @returns {object} state
 */
function addDefaultTooltips(state, dataset) {
  var tooltipFields = (0, _interactionUtils.findFieldsToShow)(dataset);

  return (0, _extends14.default)({}, state, {
    interactionConfig: (0, _extends14.default)({}, state.interactionConfig, {
      tooltip: (0, _extends14.default)({}, state.interactionConfig.tooltip, {
        config: {
          // find default fields to show in tooltip
          fieldsToShow: (0, _extends14.default)({}, state.interactionConfig.tooltip.config.fieldsToShow, tooltipFields)
        }
      })
    })
  });
}

/**
 * helper function to update layer domains for an array of datsets
 *
 * @param {object} state
 * @param {array | string} dataId
 * @returns {object} state
 */
function updateAllLayerDomainData(state, dataId) {
  var dataIds = typeof dataId === 'string' ? [dataId] : dataId;
  var newLayers = [];
  var newLayerDatas = [];

  state.layers.forEach(function (oldLayer, i) {
    if (oldLayer.config.dataId && dataIds.includes(oldLayer.config.dataId)) {

      var newLayer = oldLayer.updateLayerDomain(state.datasets[oldLayer.config.dataId]);

      var _calculateLayerData5 = (0, _layerUtils.calculateLayerData)(newLayer, state, state.layerData[i]),
          layerData = _calculateLayerData5.layerData,
          layer = _calculateLayerData5.layer;

      newLayers.push(layer);
      newLayerDatas.push(layerData);
    } else {
      newLayers.push(oldLayer);
      newLayerDatas.push(state.layerData[i]);
    }
  });

  return (0, _extends14.default)({}, state, {
    layers: newLayers,
    layerData: newLayerDatas
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy92aXMtc3RhdGUtdXBkYXRlcnMuanMiXSwibmFtZXMiOlsibGF5ZXJDb25maWdDaGFuZ2VVcGRhdGVyIiwibGF5ZXJUeXBlQ2hhbmdlVXBkYXRlciIsImxheWVyVmlzdWFsQ2hhbm5lbENoYW5nZVVwZGF0ZXIiLCJsYXllclZpc0NvbmZpZ0NoYW5nZVVwZGF0ZXIiLCJpbnRlcmFjdGlvbkNvbmZpZ0NoYW5nZVVwZGF0ZXIiLCJzZXRGaWx0ZXJVcGRhdGVyIiwiYWRkRGVmYXVsdExheWVycyIsImFkZERlZmF1bHRUb29sdGlwcyIsInVwZGF0ZUFsbExheWVyRG9tYWluRGF0YSIsIktlcGxlckdMTGF5ZXJzIiwiSU5JVElBTF9WSVNfU1RBVEUiLCJsYXllcnMiLCJsYXllckRhdGEiLCJsYXllclRvQmVNZXJnZWQiLCJsYXllck9yZGVyIiwiZmlsdGVycyIsImZpbHRlclRvQmVNZXJnZWQiLCJkYXRhc2V0cyIsImVkaXRpbmdEYXRhc2V0IiwidW5kZWZpbmVkIiwiaW50ZXJhY3Rpb25Db25maWciLCJpbnRlcmFjdGlvblRvQmVNZXJnZWQiLCJsYXllckJsZW5kaW5nIiwiaG92ZXJJbmZvIiwiY2xpY2tlZCIsImZpbGVMb2FkaW5nIiwiZmlsZUxvYWRpbmdFcnIiLCJzcGxpdE1hcHMiLCJ1cGRhdGVTdGF0ZVdpdGhMYXllckFuZERhdGEiLCJzdGF0ZSIsImxheWVyIiwiaWR4IiwibWFwIiwibHlyIiwiaSIsImQiLCJhY3Rpb24iLCJvbGRMYXllciIsImZpbmRJbmRleCIsImwiLCJpZCIsInByb3BzIiwiT2JqZWN0Iiwia2V5cyIsIm5ld0NvbmZpZyIsIm5ld0xheWVyIiwidXBkYXRlTGF5ZXJDb25maWciLCJzaG91bGRDYWxjdWxhdGVMYXllckRhdGEiLCJvbGRMYXllckRhdGEiLCJzYW1lRGF0YSIsIm5ld1N0YXRlIiwidG9nZ2xlTGF5ZXJGcm9tU3BsaXRNYXBzIiwibmV3VHlwZSIsIm9sZElkIiwiZXJyb3IiLCJMYXllckNsYXNzIiwiY29uZmlnIiwiYXNzaWduQ29uZmlnVG9MYXllciIsInNldHRpbmdzIiwib2xkTGF5ZXJNYXAiLCJvdGhlckxheWVycyIsImNoYW5uZWwiLCJkYXRhSWQiLCJkYXRhIiwiYWxsRGF0YSIsInVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbCIsIm5ld1Zpc0NvbmZpZyIsInZpc0NvbmZpZyIsImVuYWJsZWQiLCJmb3JFYWNoIiwiayIsInByb3AiLCJ2YWx1ZSIsIm5ld0ZpbHRlciIsImZpZWxkcyIsImZpZWxkSWR4IiwiZiIsIm5hbWUiLCJmaWVsZCIsImZpbHRlclByb3AiLCJmcmVlemUiLCJzZXRGaWx0ZXJQbG90VXBkYXRlciIsIm5ld1Byb3AiLCJwbG90VHlwZSIsImFkZEZpbHRlclVwZGF0ZXIiLCJ0b2dnbGVGaWx0ZXJBbmltYXRpb25VcGRhdGVyIiwiaXNBbmltYXRpbmciLCJlbmxhcmdlRmlsdGVyVXBkYXRlciIsImlzRW5sYXJnZWQiLCJlbmxhcmdlZCIsInJlbW92ZUZpbHRlclVwZGF0ZXIiLCJuZXdGaWx0ZXJzIiwic2xpY2UiLCJsZW5ndGgiLCJhZGRMYXllclVwZGF0ZXIiLCJkZWZhdWx0RGF0YXNldCIsIkxheWVyIiwiaXNWaXNpYmxlIiwiaXNDb25maWdBY3RpdmUiLCJhZGROZXdMYXllcnNUb1NwbGl0TWFwIiwicmVtb3ZlTGF5ZXJVcGRhdGVyIiwibGF5ZXJUb1JlbW92ZSIsIm5ld01hcHMiLCJyZW1vdmVMYXllckZyb21TcGxpdE1hcHMiLCJmaWx0ZXIiLCJwaWQiLCJpc0xheWVySG92ZXJlZCIsInJlb3JkZXJMYXllclVwZGF0ZXIiLCJvcmRlciIsInJlbW92ZURhdGFzZXRVcGRhdGVyIiwiZGF0YXNldEtleSIsImtleSIsImRhdGFzZXQiLCJuZXdEYXRhc2V0cyIsImluZGV4ZXMiLCJyZWR1Y2UiLCJsaXN0T2ZJbmRleGVzIiwiaW5kZXgiLCJwdXNoIiwiY3VycmVudFN0YXRlIiwiaW5kZXhDb3VudGVyIiwiY3VycmVudEluZGV4IiwidG9vbHRpcCIsImZpZWxkc1RvU2hvdyIsInVwZGF0ZUxheWVyQmxlbmRpbmdVcGRhdGVyIiwibW9kZSIsInNob3dEYXRhc2V0VGFibGVVcGRhdGVyIiwidXBkYXRlVmlzRGF0YVVwZGF0ZXIiLCJBcnJheSIsImlzQXJyYXkiLCJvcHRpb25zIiwiY2VudGVyTWFwIiwibmV3RGF0ZUVudHJpZXMiLCJhY2N1IiwiaW5mbyIsInN0YXRlV2l0aE5ld0RhdGEiLCJvbGRMYXllcnMiLCJtZXJnZWRTdGF0ZSIsIm5ld0xheWVycyIsInRvb2x0aXBGaWVsZHMiLCJ2aXNTdGF0ZSIsImJvdW5kcyIsImluY2x1ZGVzIiwicmVzZXRNYXBDb25maWdVcGRhdGVyIiwicmVjZWl2ZU1hcENvbmZpZ1VwZGF0ZXIiLCJwYXlsb2FkIiwicmVzZXRTdGF0ZSIsImxheWVySG92ZXJVcGRhdGVyIiwibGF5ZXJDbGlja1VwZGF0ZXIiLCJwaWNrZWQiLCJtYXBDbGlja1VwZGF0ZXIiLCJ0b2dnbGVTcGxpdE1hcFVwZGF0ZXIiLCJjb21wdXRlU3BsaXRNYXBMYXllcnMiLCJjbG9zZVNwZWNpZmljTWFwQXRJbmRleCIsInNldFZpc2libGVMYXllcnNGb3JNYXBVcGRhdGVyIiwibWFwSW5kZXgiLCJsYXllcklkcyIsImN1cnJlbnRMYXllcnMiLCJ0b2dnbGVMYXllckZvck1hcFVwZGF0ZXIiLCJtYXBTZXR0aW5ncyIsImxheWVySWQiLCJuZXdTcGxpdE1hcHMiLCJnZW5lcmF0ZUxheWVyTWV0YUZvclNwbGl0Vmlld3MiLCJpc0F2YWlsYWJsZSIsIm1hcExheWVycyIsImN1cnJlbnRMYXllciIsIl8iLCJpbmRleFRvUmV0cmlldmUiLCJtZXRhU2V0dGluZ3MiLCJsb2FkRmlsZXNVcGRhdGVyIiwiZmlsZXMiLCJmaWxlc1RvTG9hZCIsImZpbGVCbG9iIiwibGFiZWwiLCJzaXplIiwiaGFuZGxlciIsImxvYWRGaWxlVGFza3MiLCJhbGwiLCJiaW1hcCIsInJlc3VsdHMiLCJsb2FkRmlsZXNFcnJVcGRhdGVyIiwiZGVmYXVsdExheWVycyIsInZhbHVlcyIsImRhdGFJZHMiLCJu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c0UsaUNBRzNDLG9DQUFtQmpCLFFBQW5CLEVBQTZCaEIsS0FBN0IsRUFBb0NBLE1BQU1qQixTQUFOLENBQWdCc0IsQ0FBaEIsQ0FBcEMsQ0FIMkM7QUFBQSxVQUcvRHRCLFNBSCtELHdCQUcvREEsU0FIK0Q7QUFBQSxVQUdwRGtCLEtBSG9ELHdCQUdwREEsS0FIb0Q7O0FBS3RFNEcsZ0JBQVVwQixJQUFWLENBQWV4RixLQUFmO0FBQ0EwSixvQkFBY2xFLElBQWQsQ0FBbUIxRyxTQUFuQjtBQUNELEtBUEQsTUFPTztBQUNMOEgsZ0JBQVVwQixJQUFWLENBQWVqRixRQUFmO0FBQ0FtSixvQkFBY2xFLElBQWQsQ0FBbUJ6RixNQUFNakIsU0FBTixDQUFnQnNCLENBQWhCLENBQW5CO0FBQ0Q7QUFDRixHQVpEOztBQWNBLHFDQUNLTCxLQURMO0FBRUVsQixZQUFRK0gsU0FGVjtBQUdFOUgsZUFBVzRLO0FBSGI7QUFLRCIsImZpbGUiOiJ2aXMtc3RhdGUtdXBkYXRlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xvbmVEZWVwIGZyb20gJ2xvZGFzaC5jbG9uZWRlZXAnO1xuaW1wb3J0IHtjb25zb2xlIGFzIENvbnNvbGV9IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuaW1wb3J0IHtUYXNrLCB3aXRoVGFza30gZnJvbSAncmVhY3QtcGFsbSdcblxuLy8gVGFza3NcbmltcG9ydCB7TE9BRF9GSUxFX1RBU0t9IGZyb20gJ3Rhc2tzL3Rhc2tzJztcblxuLy8gQWN0aW9uc1xuaW1wb3J0IHt1cGRhdGVWaXNEYXRhLCBsb2FkRmlsZXNFcnJ9IGZyb20gJ2FjdGlvbnMvdmlzLXN0YXRlLWFjdGlvbnMnO1xuXG4vLyBVdGlsc1xuaW1wb3J0IHtnZXREZWZhdWx0SW50ZXJhY3Rpb259IGZyb20gJ3V0aWxzL2ludGVyYWN0aW9uLXV0aWxzJztcbmltcG9ydCB7Z2VuZXJhdGVIYXNoSWR9IGZyb20gJ3V0aWxzL3V0aWxzJztcbmltcG9ydCB7ZmluZEZpZWxkc1RvU2hvd30gZnJvbSAndXRpbHMvaW50ZXJhY3Rpb24tdXRpbHMnO1xuaW1wb3J0IHtcbiAgZ2V0RGVmYXVsdGZpbHRlcixcbiAgZ2V0RmlsdGVyUHJvcHMsXG4gIGdldEZpbHRlclBsb3QsXG4gIGdldERlZmF1bHRGaWx0ZXJQbG90VHlwZSxcbiAgZmlsdGVyRGF0YVxufSBmcm9tICd1dGlscy9maWx0ZXItdXRpbHMnO1xuaW1wb3J0IHtjcmVhdGVOZXdEYXRhRW50cnl9IGZyb20gJ3V0aWxzL2RhdGFzZXQtdXRpbHMnO1xuXG5pbXBvcnQge1xuICBmaW5kRGVmYXVsdExheWVyLFxuICBjYWxjdWxhdGVMYXllckRhdGFcbn0gZnJvbSAndXRpbHMvbGF5ZXItdXRpbHMvbGF5ZXItdXRpbHMnO1xuXG5pbXBvcnQge2dldEZpbGVIYW5kbGVyfSBmcm9tICdwcm9jZXNzb3IvZmlsZS1oYW5kbGVyJztcbmltcG9ydCB7ZmluZE1hcEJvdW5kc30gZnJvbSAndXRpbHMvZGF0YS11dGlscyc7XG5cbmltcG9ydCB7XG4gIG1lcmdlRmlsdGVycyxcbiAgbWVyZ2VMYXllcnMsXG4gIG1lcmdlSW50ZXJhY3Rpb25zLFxuICBtZXJnZUxheWVyQmxlbmRpbmdcbn0gZnJvbSAnLi92aXMtc3RhdGUtbWVyZ2VyJztcblxuaW1wb3J0ICogYXMgS2VwbGVyR0xMYXllcnMgZnJvbSAna2VwbGVyZ2wtbGF5ZXJzJztcbmltcG9ydCB7TEFZRVJfQ0xBU1NFU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5leHBvcnQgY29uc3QgSU5JVElBTF9WSVNfU1RBVEUgPSB7XG4gIC8vIGxheWVyc1xuICBsYXllcnM6IFtdLFxuICBsYXllckRhdGE6IFtdLFxuICBsYXllclRvQmVNZXJnZWQ6IFtdLFxuICBsYXllck9yZGVyOiBbXSxcblxuICAvLyBmaWx0ZXJzXG4gIGZpbHRlcnM6IFtdLFxuICBmaWx0ZXJUb0JlTWVyZ2VkOiBbXSxcblxuICAvLyBhIGNvbGxlY3Rpb24gb2YgbXVsdGlwbGUgZGF0YXNldFxuICBkYXRhc2V0czoge30sXG4gIGVkaXRpbmdEYXRhc2V0OiB1bmRlZmluZWQsXG5cbiAgaW50ZXJhY3Rpb25Db25maWc6IGdldERlZmF1bHRJbnRlcmFjdGlvbigpLFxuICBpbnRlcmFjdGlvblRvQmVNZXJnZWQ6IHVuZGVmaW5lZCxcblxuICBsYXllckJsZW5kaW5nOiAnbm9ybWFsJyxcbiAgaG92ZXJJbmZvOiB1bmRlZmluZWQsXG4gIGNsaWNrZWQ6IHVuZGVmaW5lZCxcblxuICBmaWxlTG9hZGluZzogZmFsc2UsXG4gIGZpbGVMb2FkaW5nRXJyOiBudWxsLFxuXG4gIC8vIHRoaXMgaXMgdXNlZCB3aGVuIHVzZXIgc3BsaXQgbWFwc1xuICBzcGxpdE1hcHM6IFtcbiAgICAvLyB0aGlzIHdpbGwgY29udGFpbiBhIGxpc3Qgb2Ygb2JqZWN0cyB0b1xuICAgIC8vIGRlc2NyaWJlIHRoZSBzdGF0ZSBvZiBsYXllciBhdmFpbGFiaWxpdHkgYW5kIHZpc2liaWxpdHkgZm9yIGVhY2ggbWFwXG4gICAgLy8gW1xuICAgIC8vICAge1xuICAgIC8vICAgICBsYXllcnM6IHtcbiAgICAvLyAgICAgICBsYXllcl9pZDoge1xuICAgIC8vICAgICAgICAgaXNBdmFpbGFibGU6IHRydWV8ZmFsc2UgIyB0aGlzIGlzIGRyaXZlbiBieSB0aGUgbGVmdCBoYW5kIHBhbmVsXG4gICAgLy8gICAgICAgICBpc1Zpc2libGU6IHRydWV8ZmFsc2VcbiAgICAvLyAgICAgICB9XG4gICAgLy8gICAgIH1cbiAgICAvLyAgIH1cbiAgICAvLyBdXG4gIF1cbn07XG5cbmZ1bmN0aW9uIHVwZGF0ZVN0YXRlV2l0aExheWVyQW5kRGF0YShzdGF0ZSwge2xheWVyRGF0YSwgbGF5ZXIsIGlkeH0pIHtcbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBsYXllcnM6IHN0YXRlLmxheWVyc1xuICAgICAgLm1hcCgobHlyLCBpKSA9PiBpID09PSBpZHggPyBsYXllciA6IGx5ciksXG4gICAgbGF5ZXJEYXRhOiBsYXllckRhdGEgPyBzdGF0ZS5sYXllckRhdGFcbiAgICAgIC5tYXAoKGQsIGkpID0+IGkgPT09IGlkeCA/IGxheWVyRGF0YSA6IGQpIDpcbiAgICAgIHN0YXRlLmxheWVyRGF0YVxuICB9O1xufVxuXG4vKipcbiAqIENhbGxlZCB0byB1cGRhdGUgbGF5ZXIgYmFzZSBjb25maWc6IGRhdGFJZCwgbGFiZWwsIGNvbHVtbiwgaXNWaXNpYmxlXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gbGF5ZXJDb25maWdDaGFuZ2VVcGRhdGVyKHN0YXRlLCBhY3Rpb24pIHtcbiAgY29uc3Qge29sZExheWVyfSA9IGFjdGlvbjtcbiAgY29uc3QgaWR4ID0gc3RhdGUubGF5ZXJzLmZpbmRJbmRleChsID0+IGwuaWQgPT09IG9sZExheWVyLmlkKTtcbiAgY29uc3QgcHJvcHMgPSBPYmplY3Qua2V5cyhhY3Rpb24ubmV3Q29uZmlnKTtcblxuICBjb25zdCBuZXdMYXllciA9IG9sZExheWVyLnVwZGF0ZUxheWVyQ29uZmlnKGFjdGlvbi5uZXdDb25maWcpO1xuICBpZiAobmV3TGF5ZXIuc2hvdWxkQ2FsY3VsYXRlTGF5ZXJEYXRhKHByb3BzKSkge1xuICAgIGNvbnN0IG9sZExheWVyRGF0YSA9IHN0YXRlLmxheWVyRGF0YVtpZHhdO1xuICAgIGNvbnN0IHtsYXllckRhdGEsIGxheWVyfSA9IGNhbGN1bGF0ZUxheWVyRGF0YShuZXdMYXllciwgc3RhdGUsIG9sZExheWVyRGF0YSwge3NhbWVEYXRhOiB0cnVlfSk7XG4gICAgcmV0dXJuIHVwZGF0ZVN0YXRlV2l0aExheWVyQW5kRGF0YShzdGF0ZSwge2xheWVyRGF0YSwgbGF5ZXIsIGlkeH0pXG4gIH1cblxuICBjb25zdCBuZXdTdGF0ZSA9IHtcbiAgICAuLi5zdGF0ZSxcbiAgICBzcGxpdE1hcHM6ICdpc1Zpc2libGUnIGluIGFjdGlvbi5uZXdDb25maWcgP1xuICAgICAgdG9nZ2xlTGF5ZXJGcm9tU3BsaXRNYXBzKHN0YXRlLCBuZXdMYXllcikgOiBzdGF0ZS5zcGxpdE1hcHNcbiAgfTtcblxuICByZXR1cm4gdXBkYXRlU3RhdGVXaXRoTGF5ZXJBbmREYXRhKG5ld1N0YXRlLCB7bGF5ZXI6IG5ld0xheWVyLCBpZHh9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxheWVyVHlwZUNoYW5nZVVwZGF0ZXIoc3RhdGUsIGFjdGlvbikge1xuICBjb25zdCB7b2xkTGF5ZXIsIG5ld1R5cGV9ID0gYWN0aW9uO1xuICBjb25zdCBvbGRJZCA9IG9sZExheWVyLmlkO1xuICBjb25zdCBpZHggPSBzdGF0ZS5sYXllcnMuZmluZEluZGV4KGwgPT4gbC5pZCA9PT0gb2xkSWQpO1xuXG4gIGlmICghTEFZRVJfQ0xBU1NFU1tuZXdUeXBlXSB8fCAhS2VwbGVyR0xMYXllcnNbTEFZRVJfQ0xBU1NFU1tuZXdUeXBlXV0pIHtcbiAgICBDb25zb2xlLmVycm9yKGAke25ld1R5cGV9IGlzIG5vdCBhIHZhbGlkIGxheWVyIHR5cGVgKTtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICAvLyBnZXQgYSBtaW50IGxheWVyLCB3aXRoIG5ldyBpZCBhbmQgdHlwZVxuICAvLyBiZWNhdXNlIGRlY2suZ2wgdXNlcyBpZCB0byBtYXRjaCBiZXR3ZWVuIG5ldyBhbmQgb2xkIGxheWVyLlxuICAvLyBJZiB0eXBlIGhhcyBjaGFuZ2VkIGJ1dCBpZCBpcyB0aGUgc2FtZSwgaXQgd2lsbCBicmVha1xuICBjb25zdCBMYXllckNsYXNzID0gS2VwbGVyR0xMYXllcnNbTEFZRVJfQ0xBU1NFU1tuZXdUeXBlXV07XG4gIGNvbnN0IG5ld0xheWVyID0gbmV3IExheWVyQ2xhc3MoKTtcblxuICBuZXdMYXllci5jb25maWcgPSBuZXdMYXllci5hc3NpZ25Db25maWdUb0xheWVyKG5ld0xheWVyLmNvbmZpZywgb2xkTGF5ZXIuY29uZmlnKTtcblxuICBjb25zdCB7bGF5ZXJEYXRhLCBsYXllcn0gPSBjYWxjdWxhdGVMYXllckRhdGEobmV3TGF5ZXIsIHN0YXRlKTtcblxuICBsZXQgbmV3U3RhdGUgPSBzdGF0ZTtcblxuICAvLyB1cGRhdGUgc3BsaXRNYXAgbGF5ZXIgaWRcbiAgaWYgKHN0YXRlLnNwbGl0TWFwcykge1xuICAgIG5ld1N0YXRlID0ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBzcGxpdE1hcHM6IHN0YXRlLnNwbGl0TWFwcy5tYXAoc2V0dGluZ3MgPT4ge1xuICAgICAgICBjb25zdCB7W29sZElkXTogb2xkTGF5ZXJNYXAsIC4uLm90aGVyTGF5ZXJzfSA9IHNldHRpbmdzLmxheWVycztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5zZXR0aW5ncyxcbiAgICAgICAgICBsYXllcnM6IHtcbiAgICAgICAgICAgIC4uLm90aGVyTGF5ZXJzLFxuICAgICAgICAgICAgW2xheWVyLmlkXTogb2xkTGF5ZXJNYXBcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB1cGRhdGVTdGF0ZVdpdGhMYXllckFuZERhdGEobmV3U3RhdGUsIHtsYXllckRhdGEsIGxheWVyLCBpZHh9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbGF5ZXJWaXN1YWxDaGFubmVsQ2hhbmdlVXBkYXRlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIGNvbnN0IHtvbGRMYXllciwgbmV3Q29uZmlnLCBjaGFubmVsfSA9IGFjdGlvbjtcbiAgY29uc3Qge2RhdGEsIGFsbERhdGF9ID0gc3RhdGUuZGF0YXNldHNbb2xkTGF5ZXIuY29uZmlnLmRhdGFJZF07XG5cbiAgY29uc3QgaWR4ID0gc3RhdGUubGF5ZXJzLmZpbmRJbmRleChsID0+IGwuaWQgPT09IG9sZExheWVyLmlkKTtcbiAgY29uc3QgbmV3TGF5ZXIgPSBvbGRMYXllci51cGRhdGVMYXllckNvbmZpZyhuZXdDb25maWcpO1xuXG4gIG5ld0xheWVyLnVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbCh7ZGF0YSwgYWxsRGF0YX0sIGNoYW5uZWwpO1xuXG4gIGNvbnN0IG9sZExheWVyRGF0YSA9IHN0YXRlLmxheWVyRGF0YVtpZHhdO1xuICBjb25zdCB7bGF5ZXJEYXRhLCBsYXllcn0gPSBjYWxjdWxhdGVMYXllckRhdGEobmV3TGF5ZXIsIHN0YXRlLCBvbGRMYXllckRhdGEsIHtzYW1lRGF0YTogdHJ1ZX0pO1xuXG4gIHJldHVybiB1cGRhdGVTdGF0ZVdpdGhMYXllckFuZERhdGEoc3RhdGUsIHtsYXllckRhdGEsIGxheWVyLCBpZHh9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbGF5ZXJWaXNDb25maWdDaGFuZ2VVcGRhdGVyKHN0YXRlLCBhY3Rpb24pIHtcbiAgY29uc3Qge29sZExheWVyfSA9IGFjdGlvbjtcbiAgY29uc3QgaWR4ID0gc3RhdGUubGF5ZXJzLmZpbmRJbmRleChsID0+IGwuaWQgPT09IG9sZExheWVyLmlkKTtcbiAgY29uc3QgcHJvcHMgPSBPYmplY3Qua2V5cyhhY3Rpb24ubmV3VmlzQ29uZmlnKTtcblxuICBjb25zdCBuZXdWaXNDb25maWcgPSB7XG4gICAgLi4ub2xkTGF5ZXIuY29uZmlnLnZpc0NvbmZpZyxcbiAgICAuLi5hY3Rpb24ubmV3VmlzQ29uZmlnXG4gIH07XG5cbiAgY29uc3QgbmV3TGF5ZXIgPSBvbGRMYXllci51cGRhdGVMYXllckNvbmZpZyh7dmlzQ29uZmlnOiBuZXdWaXNDb25maWd9KTtcblxuICBpZiAobmV3TGF5ZXIuc2hvdWxkQ2FsY3VsYXRlTGF5ZXJEYXRhKHByb3BzKSkge1xuICAgIGNvbnN0IG9sZExheWVyRGF0YSA9IHN0YXRlLmxheWVyRGF0YVtpZHhdO1xuICAgIGNvbnN0IHtsYXllckRhdGEsIGxheWVyfSA9IGNhbGN1bGF0ZUxheWVyRGF0YShuZXdMYXllciwgc3RhdGUsIG9sZExheWVyRGF0YSwge3NhbWVEYXRhOiB0cnVlfSk7XG4gICAgcmV0dXJuIHVwZGF0ZVN0YXRlV2l0aExheWVyQW5kRGF0YShzdGF0ZSwge2xheWVyRGF0YSwgbGF5ZXIsIGlkeH0pXG4gIH1cblxuICByZXR1cm4gdXBkYXRlU3RhdGVXaXRoTGF5ZXJBbmREYXRhKHN0YXRlLCB7bGF5ZXI6IG5ld0xheWVyLCBpZHh9KVxufVxuXG4vKiBlc2xpbnQtZW5hYmxlIG1heC1zdGF0ZW1lbnRzICovXG5cbmV4cG9ydCBmdW5jdGlvbiBpbnRlcmFjdGlvbkNvbmZpZ0NoYW5nZVVwZGF0ZXIoc3RhdGUsIGFjdGlvbikge1xuICBjb25zdCB7Y29uZmlnfSA9IGFjdGlvbjtcblxuICBjb25zdCBpbnRlcmFjdGlvbkNvbmZpZyA9IHtcbiAgICAuLi5zdGF0ZS5pbnRlcmFjdGlvbkNvbmZpZyxcbiAgICAuLi57W2NvbmZpZy5pZF06IGNvbmZpZ31cbiAgfTtcblxuICBpZiAoY29uZmlnLmVuYWJsZWQgJiYgIXN0YXRlLmludGVyYWN0aW9uQ29uZmlnW2NvbmZpZy5pZF0uZW5hYmxlZCkge1xuICAgIC8vIG9ubHkgZW5hYmxlIG9uZSBpbnRlcmFjdGlvbiBhdCBhIHRpbWVcbiAgICBPYmplY3Qua2V5cyhpbnRlcmFjdGlvbkNvbmZpZykuZm9yRWFjaChrID0+IHtcbiAgICAgIGlmIChrICE9PSBjb25maWcuaWQpIHtcbiAgICAgICAgaW50ZXJhY3Rpb25Db25maWdba10gPSB7Li4uaW50ZXJhY3Rpb25Db25maWdba10sIGVuYWJsZWQ6IGZhbHNlfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgaW50ZXJhY3Rpb25Db25maWdcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldEZpbHRlclVwZGF0ZXIoc3RhdGUsIGFjdGlvbikge1xuICBjb25zdCB7aWR4LCBwcm9wLCB2YWx1ZX0gPSBhY3Rpb247XG4gIGxldCBuZXdTdGF0ZSA9IHN0YXRlO1xuICBsZXQgbmV3RmlsdGVyID0ge1xuICAgIC4uLnN0YXRlLmZpbHRlcnNbaWR4XSxcbiAgICBbcHJvcF06IHZhbHVlXG4gIH07XG5cbiAgY29uc3Qge2RhdGFJZH0gPSBuZXdGaWx0ZXI7XG4gIGlmICghZGF0YUlkKSB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG4gIGNvbnN0IHtmaWVsZHMsIGFsbERhdGF9ID0gc3RhdGUuZGF0YXNldHNbZGF0YUlkXTtcblxuICBzd2l0Y2ggKHByb3ApIHtcbiAgY2FzZSAnZGF0YUlkJzpcbiAgICAvLyBpZiB0cnlpbmcgdG8gdXBkYXRlIGZpbHRlciBkYXRhSWQuIGNyZWF0ZSBhbiBlbXB0eSBuZXcgZmlsdGVyXG4gICAgbmV3RmlsdGVyID0gZ2V0RGVmYXVsdGZpbHRlcihkYXRhSWQpO1xuICAgIGJyZWFrO1xuXG4gIGNhc2UgJ25hbWUnOlxuXG4gICAgLy8gZmluZCB0aGUgZmllbGRcbiAgICBjb25zdCBmaWVsZElkeCA9IGZpZWxkcy5maW5kSW5kZXgoZiA9PiAoZi5uYW1lID09PSB2YWx1ZSkpO1xuICAgIGxldCBmaWVsZCA9IGZpZWxkc1tmaWVsZElkeF07XG5cbiAgICBpZiAoIWZpZWxkLmZpbHRlclByb3ApIHtcblxuICAgICAgLy8gZ2V0IGZpbHRlciBkb21haW4gZnJvbSBmaWVsZFxuICAgICAgLy8gc2F2ZSBmaWx0ZXJQcm9wczoge2RvbWFpbiwgc3RlcHMsIHZhbHVlfSB0byBmaWVsZCwgYXZvaWQgcmVjYWxjdWxhdGVcbiAgICAgIGZpZWxkID0ge1xuICAgICAgICAuLi5maWVsZCxcbiAgICAgICAgZmlsdGVyUHJvcDogZ2V0RmlsdGVyUHJvcHMoYWxsRGF0YSwgZmllbGQpXG4gICAgICB9O1xuICAgIH1cblxuICAgIG5ld0ZpbHRlciA9IHtcbiAgICAgIC4uLm5ld0ZpbHRlcixcbiAgICAgIC4uLmZpZWxkLmZpbHRlclByb3AsXG4gICAgICBuYW1lOiBmaWVsZC5uYW1lLFxuICAgICAgLy8gY2FuJ3QgZWRpdCBkYXRhSWQgb25jZSBuYW1lIGlzIHNlbGVjdGVkXG4gICAgICBmcmVlemU6IHRydWUsXG4gICAgICBmaWVsZElkeFxuICAgIH07XG5cbiAgICBuZXdTdGF0ZSA9IHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgZGF0YXNldHM6IHtcbiAgICAgICAgLi4uc3RhdGUuZGF0YXNldHMsXG4gICAgICAgIFtkYXRhSWRdOiB7XG4gICAgICAgICAgLi4uc3RhdGUuZGF0YXNldHNbZGF0YUlkXSxcbiAgICAgICAgICBmaWVsZHM6IGZpZWxkcy5tYXAoKGQsIGkpID0+IGkgPT09IGZpZWxkSWR4ID8gZmllbGQgOiBkKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBicmVhaztcbiAgY2FzZSAndmFsdWUnOlxuICBkZWZhdWx0OlxuICAgIGJyZWFrO1xuICB9XG5cbiAgLy8gc2F2ZSBuZXcgZmlsdGVycyB0byBuZXdTdGF0ZVxuICBuZXdTdGF0ZSA9IHtcbiAgICAuLi5uZXdTdGF0ZSxcbiAgICBmaWx0ZXJzOiBzdGF0ZS5maWx0ZXJzLm1hcCgoZiwgaSkgPT4gaSA9PT0gaWR4ID8gbmV3RmlsdGVyIDogZilcbiAgfTtcblxuICAvLyBmaWx0ZXIgZGF0YVxuICBuZXdTdGF0ZSA9IHtcbiAgICAuLi5uZXdTdGF0ZSxcbiAgICBkYXRhc2V0czoge1xuICAgICAgLi4ubmV3U3RhdGUuZGF0YXNldHMsXG4gICAgICBbZGF0YUlkXToge1xuICAgICAgICAuLi5uZXdTdGF0ZS5kYXRhc2V0c1tkYXRhSWRdLFxuICAgICAgICAuLi5maWx0ZXJEYXRhKGFsbERhdGEsIGRhdGFJZCwgbmV3U3RhdGUuZmlsdGVycylcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgbmV3U3RhdGUgPSB1cGRhdGVBbGxMYXllckRvbWFpbkRhdGEobmV3U3RhdGUsIGRhdGFJZCk7XG5cbiAgcmV0dXJuIG5ld1N0YXRlO1xufVxuXG5leHBvcnQgY29uc3Qgc2V0RmlsdGVyUGxvdFVwZGF0ZXIgPSAoc3RhdGUsIHtpZHgsIG5ld1Byb3B9KSA9PiB7XG4gIGxldCBuZXdGaWx0ZXIgPSB7Li4uc3RhdGUuZmlsdGVyc1tpZHhdLCAuLi5uZXdQcm9wfTtcbiAgY29uc3QgcHJvcCA9IE9iamVjdC5rZXlzKG5ld1Byb3ApWzBdO1xuICBpZiAocHJvcCA9PT0gJ3lBeGlzJykge1xuICAgIGNvbnN0IHBsb3RUeXBlID0gZ2V0RGVmYXVsdEZpbHRlclBsb3RUeXBlKG5ld0ZpbHRlcik7XG5cbiAgICBpZiAocGxvdFR5cGUpIHtcbiAgICAgIG5ld0ZpbHRlciA9IHtcbiAgICAgICAgLi4ubmV3RmlsdGVyLFxuICAgICAgICAuLi5nZXRGaWx0ZXJQbG90KHsuLi5uZXdGaWx0ZXIsIHBsb3RUeXBlfSwgc3RhdGUuZGF0YXNldHNbbmV3RmlsdGVyLmRhdGFJZF0uYWxsRGF0YSksXG4gICAgICAgIHBsb3RUeXBlXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBmaWx0ZXJzOiBzdGF0ZS5maWx0ZXJzLm1hcCgoZiwgaSkgPT4gaSA9PT0gaWR4ID8gbmV3RmlsdGVyIDogZilcbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCBhZGRGaWx0ZXJVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+ICghYWN0aW9uLmRhdGFJZCA/IHN0YXRlIDoge1xuICAuLi5zdGF0ZSxcbiAgZmlsdGVyczogWy4uLnN0YXRlLmZpbHRlcnMsIGdldERlZmF1bHRmaWx0ZXIoYWN0aW9uLmRhdGFJZCldXG59KTtcblxuZXhwb3J0IGNvbnN0IHRvZ2dsZUZpbHRlckFuaW1hdGlvblVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGZpbHRlcnM6IHN0YXRlLmZpbHRlcnNcbiAgICAubWFwKChmLCBpKSA9PiBpID09PSBhY3Rpb24uaWR4ID9cbiAgICAgIHsuLi5mLCBpc0FuaW1hdGluZzogIWYuaXNBbmltYXRpbmd9IDogZilcbn0pO1xuXG5leHBvcnQgY29uc3QgZW5sYXJnZUZpbHRlclVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCBpc0VubGFyZ2VkID0gc3RhdGUuZmlsdGVyc1thY3Rpb24uaWR4XS5lbmxhcmdlZDtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGZpbHRlcnM6IHN0YXRlLmZpbHRlcnMubWFwKChmLCBpKSA9PiB7XG4gICAgICBmLmVubGFyZ2VkID0gIWlzRW5sYXJnZWQgJiYgaSA9PT0gYWN0aW9uLmlkeDtcbiAgICAgIHJldHVybiBmO1xuICAgIH0pXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgcmVtb3ZlRmlsdGVyVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIGNvbnN0IHtpZHh9ID0gYWN0aW9uO1xuICBjb25zdCB7ZGF0YUlkfSA9IHN0YXRlLmZpbHRlcnNbaWR4XTtcblxuICBjb25zdCBuZXdGaWx0ZXJzID0gW1xuICAgIC4uLnN0YXRlLmZpbHRlcnMuc2xpY2UoMCwgaWR4KSxcbiAgICAuLi5zdGF0ZS5maWx0ZXJzLnNsaWNlKGlkeCArIDEsIHN0YXRlLmZpbHRlcnMubGVuZ3RoKV07XG5cbiAgY29uc3QgbmV3U3RhdGUgPSB7XG4gICAgLi4uc3RhdGUsXG4gICAgZGF0YXNldHM6IHtcbiAgICAgIC4uLnN0YXRlLmRhdGFzZXRzLFxuICAgICAgW2RhdGFJZF06IHtcbiAgICAgICAgLi4uc3RhdGUuZGF0YXNldHNbZGF0YUlkXSxcbiAgICAgICAgLi4uZmlsdGVyRGF0YShzdGF0ZS5kYXRhc2V0c1tkYXRhSWRdLmFsbERhdGEsIGRhdGFJZCwgbmV3RmlsdGVycylcbiAgICAgIH1cbiAgICB9LFxuICAgIGZpbHRlcnM6IG5ld0ZpbHRlcnNcbiAgfTtcblxuICByZXR1cm4gdXBkYXRlQWxsTGF5ZXJEb21haW5EYXRhKG5ld1N0YXRlLCBkYXRhSWQpO1xufTtcblxuZXhwb3J0IGNvbnN0IGFkZExheWVyVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIGNvbnN0IGRlZmF1bHREYXRhc2V0ID0gT2JqZWN0LmtleXMoc3RhdGUuZGF0YXNldHMpWzBdO1xuXG4gIGNvbnN0IG5ld0xheWVyID0gbmV3IEtlcGxlckdMTGF5ZXJzLkxheWVyKHtcbiAgICBpc1Zpc2libGU6IHRydWUsXG4gICAgaXNDb25maWdBY3RpdmU6IHRydWUsXG4gICAgZGF0YUlkOiBkZWZhdWx0RGF0YXNldFxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGxheWVyczogWy4uLnN0YXRlLmxheWVycywgbmV3TGF5ZXJdLFxuICAgIGxheWVyRGF0YTogWy4uLnN0YXRlLmxheWVyRGF0YSwge31dLFxuICAgIGxheWVyT3JkZXI6IFsuLi5zdGF0ZS5sYXllck9yZGVyLCBzdGF0ZS5sYXllck9yZGVyLmxlbmd0aF0sXG4gICAgc3BsaXRNYXBzOiBhZGROZXdMYXllcnNUb1NwbGl0TWFwKHN0YXRlLnNwbGl0TWFwcywgbmV3TGF5ZXIpXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgcmVtb3ZlTGF5ZXJVcGRhdGVyID0gKHN0YXRlLCB7aWR4fSkgPT4ge1xuICBjb25zdCB7bGF5ZXJzLCBsYXllckRhdGEsIGNsaWNrZWQsIGhvdmVySW5mb30gPSBzdGF0ZTtcbiAgY29uc3QgbGF5ZXJUb1JlbW92ZSA9IHN0YXRlLmxheWVyc1tpZHhdO1xuICBjb25zdCBuZXdNYXBzID0gcmVtb3ZlTGF5ZXJGcm9tU3BsaXRNYXBzKHN0YXRlLCBsYXllclRvUmVtb3ZlKTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGxheWVyczogWy4uLmxheWVycy5zbGljZSgwLCBpZHgpLCAuLi5sYXllcnMuc2xpY2UoaWR4ICsgMSwgbGF5ZXJzLmxlbmd0aCldLFxuICAgIGxheWVyRGF0YTogWy4uLmxheWVyRGF0YS5zbGljZSgwLCBpZHgpLCAuLi5sYXllckRhdGEuc2xpY2UoaWR4ICsgMSwgbGF5ZXJEYXRhLmxlbmd0aCldLFxuICAgIGxheWVyT3JkZXI6IHN0YXRlLmxheWVyT3JkZXIuZmlsdGVyKGkgPT4gaSAhPT0gaWR4KS5tYXAocGlkID0+IHBpZCA+IGlkeCA/IHBpZCAtIDEgOiBwaWQpLFxuICAgIGNsaWNrZWQ6IGxheWVyVG9SZW1vdmUuaXNMYXllckhvdmVyZWQoY2xpY2tlZCkgPyB1bmRlZmluZWQgOiBjbGlja2VkLFxuICAgIGhvdmVySW5mbzogbGF5ZXJUb1JlbW92ZS5pc0xheWVySG92ZXJlZChob3ZlckluZm8pID8gdW5kZWZpbmVkIDogaG92ZXJJbmZvLFxuICAgIHNwbGl0TWFwczogbmV3TWFwc1xuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IHJlb3JkZXJMYXllclVwZGF0ZXIgPSAoc3RhdGUsIHtvcmRlcn0pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBsYXllck9yZGVyOiBvcmRlclxufSk7XG5cbmV4cG9ydCBjb25zdCByZW1vdmVEYXRhc2V0VXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIC8vIGV4dHJhY3QgZGF0YXNldCBrZXlcbiAgY29uc3Qge2tleTogZGF0YXNldEtleX0gPSBhY3Rpb247XG4gIGNvbnN0IHtkYXRhc2V0c30gPSBzdGF0ZTtcblxuICAvLyBjaGVjayBpZiBkYXRhc2V0IGlzIHByZXNlbnRcbiAgaWYgKCFkYXRhc2V0c1tkYXRhc2V0S2V5XSkge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4gIGNvbnN0IHtsYXllcnMsIGRhdGFzZXRzOiB7W2RhdGFzZXRLZXldOiBkYXRhc2V0LCAuLi5uZXdEYXRhc2V0c319ID0gc3RhdGU7XG4gIC8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cblxuICBjb25zdCBpbmRleGVzID0gbGF5ZXJzLnJlZHVjZSgobGlzdE9mSW5kZXhlcywgbGF5ZXIsIGluZGV4KSA9PiB7XG4gICAgaWYgKGxheWVyLmNvbmZpZy5kYXRhSWQgPT09IGRhdGFzZXRLZXkpIHtcbiAgICAgIGxpc3RPZkluZGV4ZXMucHVzaChpbmRleCk7XG4gICAgfVxuICAgIHJldHVybiBsaXN0T2ZJbmRleGVzO1xuICB9LCBbXSk7XG5cbiAgLy8gcmVtb3ZlIGxheWVycyBhbmQgZGF0YXNldHNcbiAgY29uc3Qge25ld1N0YXRlfSA9IGluZGV4ZXMucmVkdWNlKCh7bmV3U3RhdGU6IGN1cnJlbnRTdGF0ZSwgaW5kZXhDb3VudGVyfSwgaWR4KSA9PiB7XG4gICAgY29uc3QgY3VycmVudEluZGV4ID0gaWR4IC0gaW5kZXhDb3VudGVyO1xuICAgIGN1cnJlbnRTdGF0ZSA9IHJlbW92ZUxheWVyVXBkYXRlcihjdXJyZW50U3RhdGUsIHtpZHg6IGN1cnJlbnRJbmRleH0pO1xuICAgIGluZGV4Q291bnRlcisrO1xuICAgIHJldHVybiB7bmV3U3RhdGU6IGN1cnJlbnRTdGF0ZSwgaW5kZXhDb3VudGVyfTtcbiAgfSwge25ld1N0YXRlOiB7Li4uc3RhdGUsIGRhdGFzZXRzOiBuZXdEYXRhc2V0c30sIGluZGV4Q291bnRlcjogMH0pO1xuXG4gIC8vIHJlbW92ZSBmaWx0ZXJzXG4gIGNvbnN0IGZpbHRlcnMgPSBzdGF0ZS5maWx0ZXJzLmZpbHRlcihmaWx0ZXIgPT4gZmlsdGVyLmRhdGFJZCAhPT0gZGF0YXNldEtleSk7XG5cbiAgLy8gdXBkYXRlIGludGVyYWN0aW9uQ29uZmlnXG4gIGxldCB7aW50ZXJhY3Rpb25Db25maWd9ID0gc3RhdGU7XG4gIGNvbnN0IHt0b29sdGlwfSA9IGludGVyYWN0aW9uQ29uZmlnO1xuICBpZiAodG9vbHRpcCkge1xuICAgIGNvbnN0IHtjb25maWd9ID0gdG9vbHRpcDtcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuICAgIGNvbnN0IHtbZGF0YXNldEtleV06IGZpZWxkcywgLi4uZmllbGRzVG9TaG93fSA9IGNvbmZpZy5maWVsZHNUb1Nob3c7XG4gICAgLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xuICAgIGludGVyYWN0aW9uQ29uZmlnID0gey4uLmludGVyYWN0aW9uQ29uZmlnLCB0b29sdGlwOiB7Li4udG9vbHRpcCwgY29uZmlnOiB7Li4uY29uZmlnLCBmaWVsZHNUb1Nob3d9fX07XG4gIH1cblxuICByZXR1cm4gey4uLm5ld1N0YXRlLCBmaWx0ZXJzLCBpbnRlcmFjdGlvbkNvbmZpZ307XG59O1xuXG5leHBvcnQgY29uc3QgdXBkYXRlTGF5ZXJCbGVuZGluZ1VwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGxheWVyQmxlbmRpbmc6IGFjdGlvbi5tb2RlXG59KTtcblxuZXhwb3J0IGNvbnN0IHNob3dEYXRhc2V0VGFibGVVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBlZGl0aW5nRGF0YXNldDogYWN0aW9uLmRhdGFJZFxuICB9XG59O1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtc3RhdGVtZW50cyAqL1xuZXhwb3J0IGNvbnN0IHVwZGF0ZVZpc0RhdGFVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgLy8gZGF0YXNldHMgY2FuIGJlIGEgc2luZ2xlIGRhdGEgZW50cmllcyBvciBhbiBhcnJheSBvZiBtdWx0aXBsZSBkYXRhIGVudHJpZXNcbiAgY29uc3QgZGF0YXNldHMgPSBBcnJheS5pc0FycmF5KGFjdGlvbi5kYXRhc2V0cykgPyBhY3Rpb24uZGF0YXNldHMgOiBbYWN0aW9uLmRhdGFzZXRzXTtcbiAgY29uc3Qge29wdGlvbnMgPSB7Y2VudGVyTWFwOiB0cnVlfX0gPSBhY3Rpb247XG5cbiAgY29uc3QgbmV3RGF0ZUVudHJpZXMgPSBkYXRhc2V0cy5yZWR1Y2UoKGFjY3UsIHtpbmZvID0ge30sIGRhdGF9KSA9PiAoe1xuICAgIC4uLmFjY3UsXG4gICAgLi4uKGNyZWF0ZU5ld0RhdGFFbnRyeSh7aW5mbywgZGF0YX0sIHN0YXRlLmRhdGFzZXRzKSB8fCB7fSlcbiAgfSksIHt9KTtcblxuICBpZiAoIU9iamVjdC5rZXlzKG5ld0RhdGVFbnRyaWVzKS5sZW5ndGgpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICBjb25zdCBzdGF0ZVdpdGhOZXdEYXRhID0ge1xuICAgIC4uLnN0YXRlLFxuICAgIGRhdGFzZXRzOiB7XG4gICAgICAuLi5zdGF0ZS5kYXRhc2V0cyxcbiAgICAgIC4uLm5ld0RhdGVFbnRyaWVzXG4gICAgfVxuICB9O1xuXG4gIC8vIHByZXZpb3VzbHkgc2F2ZWQgY29uZmlnIGJlZm9yZSBkYXRhIGxvYWRlZFxuICBjb25zdCB7XG4gICAgZmlsdGVyVG9CZU1lcmdlZCA9IFtdLFxuICAgIGxheWVyVG9CZU1lcmdlZCA9IFtdLFxuICAgIGludGVyYWN0aW9uVG9CZU1lcmdlZCA9IHt9XG4gIH0gPSBzdGF0ZVdpdGhOZXdEYXRhO1xuXG4gIC8vIGtlZXAgYSBjb3B5IG9mIG9sZExheWVyc1xuICBjb25zdCBvbGRMYXllcnMgPSBzdGF0ZS5sYXllcnMubWFwKGwgPT4gbC5pZCk7XG5cbiAgLy8gbWVyZ2Ugc3RhdGUgd2l0aCBzYXZlZCBmaWx0ZXJzXG4gIGxldCBtZXJnZWRTdGF0ZSA9IG1lcmdlRmlsdGVycyhzdGF0ZVdpdGhOZXdEYXRhLCBmaWx0ZXJUb0JlTWVyZ2VkKTtcbiAgLy8gbWVyZ2Ugc3RhdGUgd2l0aCBzYXZlZCBsYXllcnNcbiAgbWVyZ2VkU3RhdGUgPSBtZXJnZUxheWVycyhtZXJnZWRTdGF0ZSwgbGF5ZXJUb0JlTWVyZ2VkKTtcblxuICBpZiAobWVyZ2VkU3RhdGUubGF5ZXJzLmxlbmd0aCA9PT0gc3RhdGUubGF5ZXJzLmxlbmd0aCkge1xuICAgIC8vIG5vIGxheWVyIG1lcmdlZCwgZmluZCBkZWZhdWx0c1xuICAgIG1lcmdlZFN0YXRlID0gYWRkRGVmYXVsdExheWVycyhtZXJnZWRTdGF0ZSwgbmV3RGF0ZUVudHJpZXMpO1xuICB9XG5cbiAgaWYgKG1lcmdlZFN0YXRlLnNwbGl0TWFwcy5sZW5ndGgpIHtcbiAgICBjb25zdCBuZXdMYXllcnMgPSBtZXJnZWRTdGF0ZS5sYXllcnMuZmlsdGVyKGwgPT4gbC5jb25maWcuZGF0YUlkIGluIG5ld0RhdGVFbnRyaWVzKTtcbiAgICAvLyBpZiBtYXAgaXMgc3BsaXRlZCwgYWRkIG5ldyBsYXllcnMgdG8gc3BsaXRNYXBzXG4gICAgbWVyZ2VkU3RhdGUgPSB7XG4gICAgICAuLi5tZXJnZWRTdGF0ZSxcbiAgICAgIHNwbGl0TWFwczogYWRkTmV3TGF5ZXJzVG9TcGxpdE1hcChtZXJnZWRTdGF0ZS5zcGxpdE1hcHMsIG5ld0xheWVycylcbiAgICB9O1xuICB9XG5cbiAgLy8gbWVyZ2Ugc3RhdGUgd2l0aCBzYXZlZCBpbnRlcmFjdGlvbnNcbiAgbWVyZ2VkU3RhdGUgPSBtZXJnZUludGVyYWN0aW9ucyhtZXJnZWRTdGF0ZSwgaW50ZXJhY3Rpb25Ub0JlTWVyZ2VkKTtcblxuICAvLyBpZiBubyB0b29sdGlwcyBtZXJnZWQgYWRkIGRlZmF1bHQgdG9vbHRpcHNcbiAgT2JqZWN0LmtleXMobmV3RGF0ZUVudHJpZXMpLmZvckVhY2goZGF0YUlkID0+IHtcbiAgICBjb25zdCB0b29sdGlwRmllbGRzID0gbWVyZ2VkU3RhdGUuaW50ZXJhY3Rpb25Db25maWcudG9vbHRpcC5jb25maWcuZmllbGRzVG9TaG93W2RhdGFJZF07XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHRvb2x0aXBGaWVsZHMpIHx8ICF0b29sdGlwRmllbGRzLmxlbmd0aCkge1xuICAgICAgbWVyZ2VkU3RhdGUgPSBhZGREZWZhdWx0VG9vbHRpcHMobWVyZ2VkU3RhdGUsIG5ld0RhdGVFbnRyaWVzW2RhdGFJZF0pO1xuICAgIH1cbiAgfSk7XG5cbiAgY29uc3QgdmlzU3RhdGUgPSB1cGRhdGVBbGxMYXllckRvbWFpbkRhdGEobWVyZ2VkU3RhdGUsIE9iamVjdC5rZXlzKG5ld0RhdGVFbnRyaWVzKSlcblxuICBsZXQgYm91bmRzO1xuICBpZiAob3B0aW9ucy5jZW50ZXJNYXApIHtcbiAgICAvLyBmaW5kIG1hcCBib3VuZHMgZm9yIG5ldyBsYXllcnNcbiAgICBjb25zdCBuZXdMYXllcnMgPSB2aXNTdGF0ZS5sYXllcnNcbiAgICAgIC5maWx0ZXIobCA9PiAhb2xkTGF5ZXJzLmluY2x1ZGVzKGwuaWQpKTtcbiAgICBib3VuZHMgPSBmaW5kTWFwQm91bmRzKG5ld0xheWVycyk7XG4gIH1cblxuICAvLyBhY3Rpb24gaXMgYmVpbmcgY29tcG9zZWQgaW4gdGhlIGNvbWJpbmUgcmVkdWNlciBsZXZlbCB0byBmdXJ0aGVyIHVwZGF0ZSBtYXAgYm91bmRzXG4gIHJldHVybiB7dmlzU3RhdGUsIGJvdW5kc307XG59O1xuLyogZXNsaW50LWVuYWJsZSBtYXgtc3RhdGVtZW50cyAqL1xuXG5leHBvcnQgY29uc3QgcmVzZXRNYXBDb25maWdVcGRhdGVyID0gKCkgPT4gY2xvbmVEZWVwKElOSVRJQUxfVklTX1NUQVRFKTtcblxuZXhwb3J0IGNvbnN0IHJlY2VpdmVNYXBDb25maWdVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgaWYgKCFhY3Rpb24ucGF5bG9hZC52aXNTdGF0ZSkge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIGNvbnN0IHtcbiAgICBmaWx0ZXJzLFxuICAgIGxheWVycyxcbiAgICBpbnRlcmFjdGlvbkNvbmZpZyxcbiAgICBsYXllckJsZW5kaW5nLFxuICAgIHNwbGl0TWFwc1xuICB9ID0gYWN0aW9uLnBheWxvYWQudmlzU3RhdGU7XG5cbiAgLy8gYWx3YXlzIHJlc2V0IGNvbmZpZyB3aGVuIHJlY2VpdmUgYSBuZXcgY29uZmlnXG4gIGNvbnN0IHJlc2V0U3RhdGUgPSByZXNldE1hcENvbmZpZ1VwZGF0ZXIoKTtcbiAgbGV0IG1lcmdlZFN0YXRlID0ge1xuICAgIC4uLnJlc2V0U3RhdGUsXG4gICAgc3BsaXRNYXBzOiBzcGxpdE1hcHMgfHwgW10gLy8gbWFwcyBkb2Vzbid0IHJlcXVpcmUgYW55IGxvZ2ljXG4gIH07XG5cbiAgbWVyZ2VkU3RhdGUgPSBtZXJnZUZpbHRlcnMobWVyZ2VkU3RhdGUsIGZpbHRlcnMpO1xuICBtZXJnZWRTdGF0ZSA9IG1lcmdlTGF5ZXJzKG1lcmdlZFN0YXRlLCBsYXllcnMpO1xuICBtZXJnZWRTdGF0ZSA9IG1lcmdlSW50ZXJhY3Rpb25zKG1lcmdlZFN0YXRlLCBpbnRlcmFjdGlvbkNvbmZpZyk7XG4gIG1lcmdlZFN0YXRlID0gbWVyZ2VMYXllckJsZW5kaW5nKG1lcmdlZFN0YXRlLCBsYXllckJsZW5kaW5nKTtcblxuICByZXR1cm4gbWVyZ2VkU3RhdGU7XG59O1xuXG5leHBvcnQgY29uc3QgbGF5ZXJIb3ZlclVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGhvdmVySW5mbzogYWN0aW9uLmluZm9cbn0pO1xuXG5leHBvcnQgY29uc3QgbGF5ZXJDbGlja1VwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGNsaWNrZWQ6IGFjdGlvbi5pbmZvICYmIGFjdGlvbi5pbmZvLnBpY2tlZCA/IGFjdGlvbi5pbmZvIDogbnVsbFxufSk7XG5cbmV4cG9ydCBjb25zdCBtYXBDbGlja1VwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGNsaWNrZWQ6IG51bGxcbn0pO1xuXG5leHBvcnQgY29uc3QgdG9nZ2xlU3BsaXRNYXBVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IChzdGF0ZS5zcGxpdE1hcHMgJiYgc3RhdGUuc3BsaXRNYXBzLmxlbmd0aCA9PT0gMCA/IHtcbiAgLi4uc3RhdGUsXG4gIC8vIG1heWJlIHdlIHNob3VsZCB1c2UgYW4gYXJyYXkgdG8gc3RvcmUgc3RhdGUgZm9yIGEgc2luZ2xlIG1hcCBhcyB3ZWxsXG4gIC8vIGlmIGN1cnJlbnQgbWFwcyBsZW5ndGggaXMgZXF1YWwgdG8gMCBpdCBtZWFucyB0aGF0IHdlIGFyZSBhYm91dCB0byBzcGxpdCB0aGUgdmlld1xuICBzcGxpdE1hcHM6IGNvbXB1dGVTcGxpdE1hcExheWVycyhzdGF0ZS5sYXllcnMpXG59IDogY2xvc2VTcGVjaWZpY01hcEF0SW5kZXgoc3RhdGUsIGFjdGlvbikpO1xuXG4vKipcbiAqIFRoaXMgaXMgdHJpZ2dlcmVkIHdoZW4gdmlldyBpcyBzcGxpdCBpbnRvIG11bHRpcGxlIG1hcHMuXG4gKiBJdCB3aWxsIG9ubHkgdXBkYXRlIGxheWVycyB0aGF0IGJlbG9uZyB0byB0aGUgbWFwIGxheWVyIGRyb3Bkb3duXG4gKiB0aGUgdXNlciBpcyBpbnRlcmFjdGluZyB3aXRcbiAqIEBwYXJhbSBzdGF0ZVxuICogQHBhcmFtIGFjdGlvblxuICovXG5leHBvcnQgY29uc3Qgc2V0VmlzaWJsZUxheWVyc0Zvck1hcFVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCB7bWFwSW5kZXgsIGxheWVySWRzfSA9IGFjdGlvbjtcbiAgaWYgKCFsYXllcklkcykge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIGNvbnN0IHtzcGxpdE1hcHMgPSBbXX0gPSBzdGF0ZTtcblxuICBpZiAoc3BsaXRNYXBzLmxlbmd0aCA9PT0gMCkge1xuICAgIC8vIHdlIHNob3VsZCBuZXZlciBnZXQgaW50byB0aGlzIHN0YXRlXG4gICAgLy8gYmVjYXVzZSB0aGlzIGFjdGlvbiBzaG91bGQgb25seSBiZSB0cmlnZ2VyZWRcbiAgICAvLyB3aGVuIG1hcCB2aWV3IGlzIHNwbGl0XG4gICAgLy8gYnV0IHNvbWV0aGluZyBtYXkgaGF2ZSBoYXBwZW5lZFxuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIC8vIG5lZWQgdG8gY2hlY2sgaWYgbWFwcyBpcyBwb3B1bGF0ZWQgb3RoZXJ3aXNlIHdpbGwgY3JlYXRlXG4gIGNvbnN0IHtbbWFwSW5kZXhdOiBtYXAgPSB7fX0gPSBzcGxpdE1hcHM7XG5cbiAgY29uc3QgbGF5ZXJzID0gbWFwLmxheWVycyB8fCBbXTtcblxuICAvLyB3ZSBzZXQgdmlzaWJpbGl0eSB0byB0cnVlIGZvciBhbGwgbGF5ZXJzIGluY2x1ZGVkIGluIG91ciBpbnB1dCBsaXN0XG4gIGNvbnN0IG5ld0xheWVycyA9IChPYmplY3Qua2V5cyhsYXllcnMpIHx8IFtdKS5yZWR1Y2UoKGN1cnJlbnRMYXllcnMsIGlkeCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5jdXJyZW50TGF5ZXJzLFxuICAgICAgW2lkeF06IHtcbiAgICAgICAgLi4ubGF5ZXJzW2lkeF0sXG4gICAgICAgIGlzVmlzaWJsZTogbGF5ZXJJZHMuaW5jbHVkZXMoaWR4KVxuICAgICAgfVxuICAgIH1cbiAgfSwge30pO1xuXG4gIGNvbnN0IG5ld01hcHMgPSBbLi4uc3BsaXRNYXBzXTtcblxuICBuZXdNYXBzW21hcEluZGV4XSA9IHtcbiAgICAuLi5zcGxpdE1hcHNbbWFwSW5kZXhdLFxuICAgIGxheWVyczogbmV3TGF5ZXJzXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBzcGxpdE1hcHM6IG5ld01hcHNcbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCB0b2dnbGVMYXllckZvck1hcFVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBpZiAoIXN0YXRlLnNwbGl0TWFwc1thY3Rpb24ubWFwSW5kZXhdKSB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgY29uc3QgbWFwU2V0dGluZ3MgPSBzdGF0ZS5zcGxpdE1hcHNbYWN0aW9uLm1hcEluZGV4XTtcbiAgY29uc3Qge2xheWVyc30gPSBtYXBTZXR0aW5ncztcbiAgaWYgKCFsYXllcnMgfHwgIWxheWVyc1thY3Rpb24ubGF5ZXJJZF0pIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICBjb25zdCBsYXllciA9IGxheWVyc1thY3Rpb24ubGF5ZXJJZF07XG5cbiAgY29uc3QgbmV3TGF5ZXIgPSB7XG4gICAgLi4ubGF5ZXIsXG4gICAgaXNWaXNpYmxlOiAhbGF5ZXIuaXNWaXNpYmxlXG4gIH07XG5cbiAgY29uc3QgbmV3TGF5ZXJzID0ge1xuICAgIC4uLmxheWVycyxcbiAgICBbYWN0aW9uLmxheWVySWRdOiBuZXdMYXllclxuICB9O1xuXG4gIC8vIGNvbnN0IHNwbGl0TWFwcyA9IHN0YXRlLnNwbGl0TWFwcztcbiAgY29uc3QgbmV3U3BsaXRNYXBzID0gWy4uLnN0YXRlLnNwbGl0TWFwc107XG4gIG5ld1NwbGl0TWFwc1thY3Rpb24ubWFwSW5kZXhdID0ge1xuICAgIC4uLm1hcFNldHRpbmdzLFxuICAgIGxheWVyczogbmV3TGF5ZXJzXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBzcGxpdE1hcHM6IG5ld1NwbGl0TWFwc1xuICB9O1xufTtcblxuZnVuY3Rpb24gZ2VuZXJhdGVMYXllck1ldGFGb3JTcGxpdFZpZXdzKGxheWVyKSB7XG4gIHJldHVybiB7XG4gICAgaXNBdmFpbGFibGU6IGxheWVyLmNvbmZpZy5pc1Zpc2libGUsXG4gICAgaXNWaXNpYmxlOiBsYXllci5jb25maWcuaXNWaXNpYmxlXG4gIH07XG59XG5cbi8qKlxuICogVGhpcyBlbXRob2Qgd2lsbCBjb21wdXRlIHRoZSBkZWZhdWx0IG1hcHMgY3VzdG9tIGxpc3RcbiAqIGJhc2VkIG9uIHRoZSBjdXJyZW50IGxheWVycyBzdGF0dXNcbiAqIEBwYXJhbSBsYXllcnNcbiAqIEByZXR1cm5zIHtbKiwqXX1cbiAqL1xuZnVuY3Rpb24gY29tcHV0ZVNwbGl0TWFwTGF5ZXJzKGxheWVycykge1xuICBjb25zdCBtYXBMYXllcnMgPSBsYXllcnMucmVkdWNlKChuZXdMYXllcnMsIGN1cnJlbnRMYXllcikgPT4gKHtcbiAgICAuLi5uZXdMYXllcnMsXG4gICAgW2N1cnJlbnRMYXllci5pZF06IGdlbmVyYXRlTGF5ZXJNZXRhRm9yU3BsaXRWaWV3cyhjdXJyZW50TGF5ZXIpXG4gIH0pLCB7fSk7XG4gIHJldHVybiBbXG4gICAge1xuICAgICAgbGF5ZXJzOiBtYXBMYXllcnNcbiAgICB9LFxuICAgIHtcbiAgICAgIGxheWVyczogbWFwTGF5ZXJzXG4gICAgfVxuICBdO1xufVxuXG4vKipcbiAqIFJlbW92ZSBhbiBleGlzdGluZyBsYXllcnMgZnJvbSBjdXN0b20gbWFwIGxheWVyIG9iamVjdHNcbiAqIEBwYXJhbSBzdGF0ZVxuICogQHBhcmFtIGxheWVyXG4gKiBAcmV0dXJucyB7WyosKl19IE1hcHMgb2YgY3VzdG9tIGxheWVyIG9iamVjdHNcbiAqL1xuZnVuY3Rpb24gcmVtb3ZlTGF5ZXJGcm9tU3BsaXRNYXBzKHN0YXRlLCBsYXllcikge1xuICByZXR1cm4gc3RhdGUuc3BsaXRNYXBzLm1hcChzZXR0aW5ncyA9PiB7XG4gICAgY29uc3Qge2xheWVyc30gPSBzZXR0aW5ncztcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuICAgIGNvbnN0IHtbbGF5ZXIuaWRdOiBfLCAuLi5uZXdMYXllcnN9ID0gbGF5ZXJzO1xuICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc2V0dGluZ3MsXG4gICAgICBsYXllcnM6IG5ld0xheWVyc1xuICAgIH07XG4gIH0pO1xufVxuXG4vKipcbiAqIEFkZCBuZXcgbGF5ZXJzIHRvIGJvdGggZXhpc3RpbmcgbWFwc1xuICogQHBhcmFtIHNwbGl0TWFwc1xuICogQHBhcmFtIGxheWVyc1xuICogQHJldHVybnMge1sqLCpdfSBuZXcgc3BsaXRNYXBzXG4gKi9cbmZ1bmN0aW9uIGFkZE5ld0xheWVyc1RvU3BsaXRNYXAoc3BsaXRNYXBzLCBsYXllcnMpIHtcbiAgY29uc3QgbmV3TGF5ZXJzID0gQXJyYXkuaXNBcnJheShsYXllcnMpID8gbGF5ZXJzIDogW2xheWVyc107XG5cbiAgaWYgKCFzcGxpdE1hcHMgfHwgIXNwbGl0TWFwcy5sZW5ndGggfHwgIW5ld0xheWVycy5sZW5ndGgpIHtcbiAgICByZXR1cm4gc3BsaXRNYXBzO1xuICB9XG5cbiAgLy8gYWRkIG5ldyBsYXllciB0byBib3RoIG1hcHMsXG4gIC8vICBkb24ndCBvdmVycmlkZSwgaWYgbGF5ZXIuaWQgaXMgYWxyZWFkeSBpbiBzcGxpdE1hcHMuc2V0dGluZ3MubGF5ZXJzXG4gIHJldHVybiBzcGxpdE1hcHMubWFwKHNldHRpbmdzID0+ICh7XG4gICAgLi4uc2V0dGluZ3MsXG4gICAgbGF5ZXJzOiB7XG4gICAgICAuLi5zZXR0aW5ncy5sYXllcnMsXG4gICAgICAuLi5uZXdMYXllcnMucmVkdWNlKChhY2N1LCBuZXdMYXllcikgPT4gKG5ld0xheWVyLmNvbmZpZy5pc1Zpc2libGUgPyB7XG4gICAgICAgIC4uLmFjY3UsXG4gICAgICAgIFtuZXdMYXllci5pZF06IHNldHRpbmdzLmxheWVyc1tuZXdMYXllci5pZF0gPyBzZXR0aW5ncy5sYXllcnNbbmV3TGF5ZXIuaWRdIDpcbiAgICAgICAgICBnZW5lcmF0ZUxheWVyTWV0YUZvclNwbGl0Vmlld3MobmV3TGF5ZXIpXG4gICAgICB9IDogYWNjdSksIHt9KVxuICAgIH1cbiAgfSkpO1xufVxuXG4vKipcbiAqIEhpZGUgYW4gZXhpc3RpbmcgbGF5ZXJzIGZyb20gY3VzdG9tIG1hcCBsYXllciBvYmplY3RzXG4gKiBAcGFyYW0gc3RhdGVcbiAqIEBwYXJhbSBsYXllclxuICogQHJldHVybnMge1sqLCpdfSBNYXBzIG9mIGN1c3RvbSBsYXllciBvYmplY3RzXG4gKi9cbmZ1bmN0aW9uIHRvZ2dsZUxheWVyRnJvbVNwbGl0TWFwcyhzdGF0ZSwgbGF5ZXIpIHtcbiAgcmV0dXJuIHN0YXRlLnNwbGl0TWFwcy5tYXAoc2V0dGluZ3MgPT4ge1xuICAgIGNvbnN0IHtsYXllcnN9ID0gc2V0dGluZ3M7XG4gICAgY29uc3QgbmV3TGF5ZXJzID0ge1xuICAgICAgLi4ubGF5ZXJzLFxuICAgICAgW2xheWVyLmlkXTogZ2VuZXJhdGVMYXllck1ldGFGb3JTcGxpdFZpZXdzKGxheWVyKVxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc2V0dGluZ3MsXG4gICAgICBsYXllcnM6IG5ld0xheWVyc1xuICAgIH07XG4gIH0pO1xufVxuXG4vKipcbiAqIFdoZW4gYSB1c2VyIGNsaWNrcyBvbiB0aGUgc3BlY2lmaWMgbWFwIGNsb3NpbmcgaWNvblxuICogdGhlIGFwcGxpY2F0aW9uIHdpbGwgY2xvc2UgdGhlIHNlbGVjdGVkIG1hcFxuICogYW5kIHdpbGwgbWVyZ2UgdGhlIHJlbWFpbmluZyBvbmUgd2l0aCB0aGUgZ2xvYmFsIHN0YXRlXG4gKiBUT0RPOiBpIHRoaW5rIGluIHRoZSBmdXR1cmUgdGhpcyBhY3Rpb24gc2hvdWxkIGJlIGNhbGxlZCBtZXJnZSBtYXAgbGF5ZXJzIHdpdGggZ2xvYmFsIHNldHRpbmdzXG4gKiBAcGFyYW0gc3RhdGVcbiAqIEBwYXJhbSBhY3Rpb25cbiAqIEByZXR1cm5zIHsqfVxuICovXG5mdW5jdGlvbiBjbG9zZVNwZWNpZmljTWFwQXRJbmRleChzdGF0ZSwgYWN0aW9uKSB7XG4gIC8vIHJldHJpZXZlIGxheWVycyBtZXRhIGRhdGEgZnJvbSB0aGUgcmVtYWluaW5nIG1hcCB0aGF0IHdlIG5lZWQgdG8ga2VlcFxuICBjb25zdCBpbmRleFRvUmV0cmlldmUgPSAxIC0gYWN0aW9uLnBheWxvYWQ7XG5cbiAgY29uc3QgbWV0YVNldHRpbmdzID0gc3RhdGUuc3BsaXRNYXBzW2luZGV4VG9SZXRyaWV2ZV07XG4gIGlmICghbWV0YVNldHRpbmdzIHx8ICFtZXRhU2V0dGluZ3MubGF5ZXJzKSB7XG4gICAgLy8gaWYgd2UgY2FuJ3QgZmluZCB0aGUgbWV0YSBzZXR0aW5ncyB3ZSBzaW1wbHkgY2xlYW4gdXAgc3BsaXRNYXBzIGFuZFxuICAgIC8vIGtlZXAgZ2xvYmFsIHN0YXRlIGFzIGl0IGlzXG4gICAgLy8gYnV0IHdoeSBkb2VzIHRoaXMgZXZlciBoYXBwZW4/XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgc3BsaXRNYXBzOiBbXVxuICAgIH07XG4gIH1cblxuICBjb25zdCB7bGF5ZXJzfSA9IHN0YXRlO1xuXG4gIC8vIHVwZGF0ZSBsYXllciB2aXNpYmlsaXR5XG4gIGNvbnN0IG5ld0xheWVycyA9IGxheWVycy5tYXAobGF5ZXIgPT5cbiAgICBsYXllci51cGRhdGVMYXllckNvbmZpZyh7aXNWaXNpYmxlOiBtZXRhU2V0dGluZ3MubGF5ZXJzW2xheWVyLmlkXSA/XG4gICAgICBtZXRhU2V0dGluZ3MubGF5ZXJzW2xheWVyLmlkXS5pc1Zpc2libGUgOiBsYXllci5jb25maWcuaXNWaXNpYmxlfSlcbiAgKTtcblxuICAvLyBkZWxldGUgbWFwXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgbGF5ZXJzOiBuZXdMYXllcnMsXG4gICAgc3BsaXRNYXBzOiBbXVxuICB9O1xufVxuXG4vLyBUT0RPOiByZWRvIHdyaXRlIGhhbmRsZXIgdG8gbm90IHVzZSB0YXNrc1xuZXhwb3J0IGNvbnN0IGxvYWRGaWxlc1VwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCB7ZmlsZXN9ID0gYWN0aW9uO1xuICBjb25zdCBmaWxlc1RvTG9hZCA9IGZpbGVzLm1hcChmaWxlQmxvYiA9PiAoe1xuICAgIGZpbGVCbG9iLFxuICAgIGluZm86IHtcbiAgICAgIGlkOiBnZW5lcmF0ZUhhc2hJZCg0KSxcbiAgICAgIGxhYmVsOiBmaWxlQmxvYi5uYW1lLFxuICAgICAgc2l6ZTogZmlsZUJsb2Iuc2l6ZVxuICAgIH0sXG4gICAgaGFuZGxlcjogZ2V0RmlsZUhhbmRsZXIoZmlsZUJsb2IpXG4gIH0pKTtcblxuICAvLyByZWFkZXIgLT4gcGFyc2VyIC0+IGF1Z21lbnQgLT4gcmVjZWl2ZVZpc0RhdGFcbiAgY29uc3QgbG9hZEZpbGVUYXNrcyA9IFtcbiAgICBUYXNrLmFsbChcbiAgICAgIGZpbGVzVG9Mb2FkLm1hcChMT0FEX0ZJTEVfVEFTSylcbiAgICApLmJpbWFwKFxuICAgICAgcmVzdWx0cyA9PiB1cGRhdGVWaXNEYXRhKHJlc3VsdHMsIHtjZW50ZXJNYXA6IHRydWV9KSxcbiAgICAgIGVycm9yID0+IGxvYWRGaWxlc0VycihlcnJvcilcbiAgICApXG4gIF07XG5cbiAgcmV0dXJuIHdpdGhUYXNrKFxuICAgIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgZmlsZUxvYWRpbmc6IHRydWVcbiAgICB9LFxuICAgIGxvYWRGaWxlVGFza3NcbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBsb2FkRmlsZXNFcnJVcGRhdGVyID0gKHN0YXRlLCB7ZXJyb3J9KSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgZmlsZUxvYWRpbmc6IGZhbHNlLFxuICBmaWxlTG9hZGluZ0VycjogZXJyb3Jcbn0pO1xuXG4vKipcbiAqIGhlbHBlciBmdW5jdGlvbiB0byB1cGRhdGUgQWxsIGxheWVyIGRvbWFpbiBhbmQgbGF5ZXIgZGF0YSBvZiBzdGF0ZVxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBzdGF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGFzZXRzXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBzdGF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkRGVmYXVsdExheWVycyhzdGF0ZSwgZGF0YXNldHMpIHtcbiAgY29uc3QgZGVmYXVsdExheWVycyA9IE9iamVjdC52YWx1ZXMoZGF0YXNldHMpLnJlZHVjZSgoYWNjdSwgZGF0YXNldCkgPT4gKFtcbiAgICAuLi5hY2N1LFxuICAgIC4uLihmaW5kRGVmYXVsdExheWVyKGRhdGFzZXQpIHx8IFtdKVxuICBdKSwgW10pO1xuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgbGF5ZXJzOiBbLi4uc3RhdGUubGF5ZXJzLCAuLi5kZWZhdWx0TGF5ZXJzXSxcbiAgICBsYXllck9yZGVyOiBbXG4gICAgICAvLyBwdXQgbmV3IGxheWVycyBvbiB0b3Agb2Ygb2xkIG9uZXNcbiAgICAgIC4uLmRlZmF1bHRMYXllcnMubWFwKChfLCBpKSA9PiBzdGF0ZS5sYXllcnMubGVuZ3RoICsgaSksXG4gICAgICAuLi5zdGF0ZS5sYXllck9yZGVyXG4gICAgXVxuICB9O1xufVxuXG4vKipcbiAqIGhlbHBlciBmdW5jdGlvbiB0byBmaW5kIGRlZmF1bHQgdG9vbHRpcHNcbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gc3RhdGVcbiAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhc2V0XG4gKiBAcmV0dXJucyB7b2JqZWN0fSBzdGF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkRGVmYXVsdFRvb2x0aXBzKHN0YXRlLCBkYXRhc2V0KSB7XG4gIGNvbnN0IHRvb2x0aXBGaWVsZHMgPSBmaW5kRmllbGRzVG9TaG93KGRhdGFzZXQpO1xuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgaW50ZXJhY3Rpb25Db25maWc6IHtcbiAgICAgIC4uLnN0YXRlLmludGVyYWN0aW9uQ29uZmlnLFxuICAgICAgdG9vbHRpcDoge1xuICAgICAgICAuLi5zdGF0ZS5pbnRlcmFjdGlvbkNvbmZpZy50b29sdGlwLFxuICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAvLyBmaW5kIGRlZmF1bHQgZmllbGRzIHRvIHNob3cgaW4gdG9vbHRpcFxuICAgICAgICAgIGZpZWxkc1RvU2hvdzoge1xuICAgICAgICAgICAgLi4uc3RhdGUuaW50ZXJhY3Rpb25Db25maWcudG9vbHRpcC5jb25maWcuZmllbGRzVG9TaG93LFxuICAgICAgICAgICAgLi4udG9vbHRpcEZpZWxkc1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4gKiBoZWxwZXIgZnVuY3Rpb24gdG8gdXBkYXRlIGxheWVyIGRvbWFpbnMgZm9yIGFuIGFycmF5IG9mIGRhdHNldHNcbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gc3RhdGVcbiAqIEBwYXJhbSB7YXJyYXkgfCBzdHJpbmd9IGRhdGFJZFxuICogQHJldHVybnMge29iamVjdH0gc3RhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUFsbExheWVyRG9tYWluRGF0YShzdGF0ZSwgZGF0YUlkKSB7XG4gIGNvbnN0IGRhdGFJZHMgPSB0eXBlb2YgZGF0YUlkID09PSAnc3RyaW5nJyA/IFtkYXRhSWRdIDogZGF0YUlkO1xuICBjb25zdCBuZXdMYXllcnMgPSBbXTtcbiAgY29uc3QgbmV3TGF5ZXJEYXRhcyA9IFtdO1xuXG4gIHN0YXRlLmxheWVycy5mb3JFYWNoKChvbGRMYXllciwgaSkgPT4ge1xuICAgIGlmIChvbGRMYXllci5jb25maWcuZGF0YUlkICYmIGRhdGFJZHMuaW5jbHVkZXMob2xkTGF5ZXIuY29uZmlnLmRhdGFJZCkpIHtcblxuICAgICAgY29uc3QgbmV3TGF5ZXIgPSBvbGRMYXllci51cGRhdGVMYXllckRvbWFpbihzdGF0ZS5kYXRhc2V0c1tvbGRMYXllci5jb25maWcuZGF0YUlkXSk7XG4gICAgICBjb25zdCB7bGF5ZXJEYXRhLCBsYXllcn0gPSBjYWxjdWxhdGVMYXllckRhdGEobmV3TGF5ZXIsIHN0YXRlLCBzdGF0ZS5sYXllckRhdGFbaV0pO1xuXG4gICAgICBuZXdMYXllcnMucHVzaChsYXllcik7XG4gICAgICBuZXdMYXllckRhdGFzLnB1c2gobGF5ZXJEYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3TGF5ZXJzLnB1c2gob2xkTGF5ZXIpO1xuICAgICAgbmV3TGF5ZXJEYXRhcy5wdXNoKHN0YXRlLmxheWVyRGF0YVtpXSk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGxheWVyczogbmV3TGF5ZXJzLFxuICAgIGxheWVyRGF0YTogbmV3TGF5ZXJEYXRhc1xuICB9O1xufVxuIl19