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

  var _calculateLayerData3 = (0, _layerUtils.calculateLayerData)(newLayer, state, oldLayerData, {
    sameData: true
  }),
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

    interactionConfig = (0, _extends14.default)({}, interactionConfig, {
      tooltip: (0, _extends14.default)({}, tooltip, { config: (0, _extends14.default)({}, config, { fieldsToShow: fieldsToShow }) })
    });
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
    return layer.updateLayerConfig({
      isVisible: metaSettings.layers[layer.id] ? metaSettings.layers[layer.id].isVisible : layer.config.isVisible
    });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy92aXMtc3RhdGUtdXBkYXRlcnMuanMiXSwibmFtZXMiOlsibGF5ZXJDb25maWdDaGFuZ2VVcGRhdGVyIiwibGF5ZXJUeXBlQ2hhbmdlVXBkYXRlciIsImxheWVyVmlzdWFsQ2hhbm5lbENoYW5nZVVwZGF0ZXIiLCJsYXllclZpc0NvbmZpZ0NoYW5nZVVwZGF0ZXIiLCJpbnRlcmFjdGlvbkNvbmZpZ0NoYW5nZVVwZGF0ZXIiLCJzZXRGaWx0ZXJVcGRhdGVyIiwiYWRkRGVmYXVsdExheWVycyIsImFkZERlZmF1bHRUb29sdGlwcyIsInVwZGF0ZUFsbExheWVyRG9tYWluRGF0YSIsIktlcGxlckdMTGF5ZXJzIiwiSU5JVElBTF9WSVNfU1RBVEUiLCJsYXllcnMiLCJsYXllckRhdGEiLCJsYXllclRvQmVNZXJnZWQiLCJsYXllck9yZGVyIiwiZmlsdGVycyIsImZpbHRlclRvQmVNZXJnZWQiLCJkYXRhc2V0cyIsImVkaXRpbmdEYXRhc2V0IiwidW5kZWZpbmVkIiwiaW50ZXJhY3Rpb25Db25maWciLCJpbnRlcmFjdGlvblRvQmVNZXJnZWQiLCJsYXllckJsZW5kaW5nIiwiaG92ZXJJbmZvIiwiY2xpY2tlZCIsImZpbGVMb2FkaW5nIiwiZmlsZUxvYWRpbmdFcnIiLCJzcGxpdE1hcHMiLCJ1cGRhdGVTdGF0ZVdpdGhMYXllckFuZERhdGEiLCJzdGF0ZSIsImxheWVyIiwiaWR4IiwibWFwIiwibHlyIiwiaSIsImQiLCJhY3Rpb24iLCJvbGRMYXllciIsImZpbmRJbmRleCIsImwiLCJpZCIsInByb3BzIiwiT2JqZWN0Iiwia2V5cyIsIm5ld0NvbmZpZyIsIm5ld0xheWVyIiwidXBkYXRlTGF5ZXJDb25maWciLCJzaG91bGRDYWxjdWxhdGVMYXllckRhdGEiLCJvbGRMYXllckRhdGEiLCJzYW1lRGF0YSIsIm5ld1N0YXRlIiwidG9nZ2xlTGF5ZXJGcm9tU3BsaXRNYXBzIiwibmV3VHlwZSIsIm9sZElkIiwiZXJyb3IiLCJMYXllckNsYXNzIiwiY29uZmlnIiwiYXNzaWduQ29uZmlnVG9MYXllciIsInNldHRpbmdzIiwib2xkTGF5ZXJNYXAiLCJvdGhlckxheWVycyIsImNoYW5uZWwiLCJkYXRhSWQiLCJkYXRhIiwiYWxsRGF0YSIsInVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbCIsIm5ld1Zpc0NvbmZpZyIsInZpc0NvbmZpZyIsImVuYWJsZWQiLCJmb3JFYWNoIiwiayIsInByb3AiLCJ2YWx1ZSIsIm5ld0ZpbHRlciIsImZpZWxkcyIsImZpZWxkSWR4IiwiZiIsIm5hbWUiLCJmaWVsZCIsImZpbHRlclByb3AiLCJmcmVlemUiLCJzZXRGaWx0ZXJQbG90VXBkYXRlciIsIm5ld1Byb3AiLCJwbG90VHlwZSIsImFkZEZpbHRlclVwZGF0ZXIiLCJ0b2dnbGVGaWx0ZXJBbmltYXRpb25VcGRhdGVyIiwiaXNBbmltYXRpbmciLCJlbmxhcmdlRmlsdGVyVXBkYXRlciIsImlzRW5sYXJnZWQiLCJlbmxhcmdlZCIsInJlbW92ZUZpbHRlclVwZGF0ZXIiLCJuZXdGaWx0ZXJzIiwic2xpY2UiLCJsZW5ndGgiLCJhZGRMYXllclVwZGF0ZXIiLCJkZWZhdWx0RGF0YXNldCIsIkxheWVyIiwiaXNWaXNpYmxlIiwiaXNDb25maWdBY3RpdmUiLCJhZGROZXdMYXllcnNUb1NwbGl0TWFwIiwicmVtb3ZlTGF5ZXJVcGRhdGVyIiwibGF5ZXJUb1JlbW92ZSIsIm5ld01hcHMiLCJyZW1vdmVMYXllckZyb21TcGxpdE1hcHMiLCJmaWx0ZXIiLCJwaWQiLCJpc0xheWVySG92ZXJlZCIsInJlb3JkZXJMYXllclVwZGF0ZXIiLCJvcmRlciIsInJlbW92ZURhdGFzZXRVcGRhdGVyIiwiZGF0YXNldEtleSIsImtleSIsImRhdGFzZXQiLCJuZXdEYXRhc2V0cyIsImluZGV4ZXMiLCJyZWR1Y2UiLCJsaXN0T2ZJbmRleGVzIiwiaW5kZXgiLCJwdXNoIiwiY3VycmVudFN0YXRlIiwiaW5kZXhDb3VudGVyIiwiY3VycmVudEluZGV4IiwidG9vbHRpcCIsImZpZWxkc1RvU2hvdyIsInVwZGF0ZUxheWVyQmxlbmRpbmdVcGRhdGVyIiwibW9kZSIsInNob3dEYXRhc2V0VGFibGVVcGRhdGVyIiwidXBkYXRlVmlzRGF0YVVwZGF0ZXIiLCJBcnJheSIsImlzQXJyYXkiLCJvcHRpb25zIiwiY2VudGVyTWFwIiwibmV3RGF0ZUVudHJpZXMiLCJhY2N1IiwiaW5mbyIsInN0YXRlV2l0aE5ld0RhdGEiLCJvbGRMYXllcnMiLCJtZXJnZWRTdGF0ZSIsIm5ld0xheWVycyIsInRvb2x0aXBGaWVsZHMiLCJ2aXNTdGF0ZSIsImJvdW5kcyIsImluY2x1ZGVzIiwicmVzZXRNYXBDb25maWdVcGRhdGVyIiwicmVjZWl2ZU1hcENvbmZpZ1VwZGF0ZXIiLCJwYXlsb2FkIiwicmVzZXRTdGF0ZSIsImxheWVySG92ZXJVcGRhdGVyIiwibGF5ZXJDbGlja1VwZGF0ZXIiLCJwaWNrZWQiLCJtYXBDbGlja1VwZGF0ZXIiLCJ0b2dnbGVTcGxpdE1hcFVwZGF0ZXIiLCJjb21wdXRlU3BsaXRNYXBMYXllcnMiLCJjbG9zZVNwZWNpZmljTWFwQXRJbmRleCIsInNldFZpc2libGVMYXllcnNGb3JNYXBVcGRhdGVyIiwibWFwSW5kZXgiLCJsYXllcklkcyIsImN1cnJlbnRMYXllcnMiLCJ0b2dnbGVMYXllckZvck1hcFVwZGF0ZXIiLCJtYXBTZXR0aW5ncyIsImxheWVySWQiLCJuZXdTcGxpdE1hcHMiLCJnZW5lcmF0ZUxheWVyTWV0YUZvclNwbGl0Vmlld3MiLCJpc0F2YWlsYWJsZSIsIm1hcExheWVycyIsImN1cnJlbnRMYXllciIsIl8iLCJpbmRleFRvUmV0cmlldmUiLCJtZXRhU2V0dGluZ3MiLCJsb2FkRmlsZXNVcGRhdGVyIiwiZmlsZXMiLCJmaWxlc1RvTG9hZCIsImZpbGVCbG9iIiwibGFiZWwiLCJzaXplIiwiaGFuZGxlciIsImxvYWRGaWxlVGFza3MiLCJhbGwiLCJiaW1hcCIsInJlc3VsdHMiLCJsb2FkRmlsZXNFcnJVcGRhdGVyIiwiZGVmYXVsdExheWVycyIsInZhbHVlcyIsImRhdGFJZHMiLCJu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QUd6QkEsTUFBTWpCLFNBQU4sQ0FBZ0JzQixDQUFoQixDQUh5QixDQUoyQztBQUFBLFVBSS9EdEIsU0FKK0Qsd0JBSS9EQSxTQUorRDtBQUFBLFVBSXBEa0IsS0FKb0Qsd0JBSXBEQSxLQUpvRDs7QUFVdEU0RyxnQkFBVXBCLElBQVYsQ0FBZXhGLEtBQWY7QUFDQTBKLG9CQUFjbEUsSUFBZCxDQUFtQjFHLFNBQW5CO0FBQ0QsS0FaRCxNQVlPO0FBQ0w4SCxnQkFBVXBCLElBQVYsQ0FBZWpGLFFBQWY7QUFDQW1KLG9CQUFjbEUsSUFBZCxDQUFtQnpGLE1BQU1qQixTQUFOLENBQWdCc0IsQ0FBaEIsQ0FBbkI7QUFDRDtBQUNGLEdBakJEOztBQW1CQSxxQ0FDS0wsS0FETDtBQUVFbEIsWUFBUStILFNBRlY7QUFHRTlILGVBQVc0SztBQUhiO0FBS0QiLCJmaWxlIjoidmlzLXN0YXRlLXVwZGF0ZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsb25lRGVlcCBmcm9tICdsb2Rhc2guY2xvbmVkZWVwJztcbmltcG9ydCB7Y29uc29sZSBhcyBDb25zb2xlfSBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCB7VGFzaywgd2l0aFRhc2t9IGZyb20gJ3JlYWN0LXBhbG0nO1xuXG4vLyBUYXNrc1xuaW1wb3J0IHtMT0FEX0ZJTEVfVEFTS30gZnJvbSAndGFza3MvdGFza3MnO1xuXG4vLyBBY3Rpb25zXG5pbXBvcnQge3VwZGF0ZVZpc0RhdGEsIGxvYWRGaWxlc0Vycn0gZnJvbSAnYWN0aW9ucy92aXMtc3RhdGUtYWN0aW9ucyc7XG5cbi8vIFV0aWxzXG5pbXBvcnQge2dldERlZmF1bHRJbnRlcmFjdGlvbn0gZnJvbSAndXRpbHMvaW50ZXJhY3Rpb24tdXRpbHMnO1xuaW1wb3J0IHtnZW5lcmF0ZUhhc2hJZH0gZnJvbSAndXRpbHMvdXRpbHMnO1xuaW1wb3J0IHtmaW5kRmllbGRzVG9TaG93fSBmcm9tICd1dGlscy9pbnRlcmFjdGlvbi11dGlscyc7XG5pbXBvcnQge1xuICBnZXREZWZhdWx0ZmlsdGVyLFxuICBnZXRGaWx0ZXJQcm9wcyxcbiAgZ2V0RmlsdGVyUGxvdCxcbiAgZ2V0RGVmYXVsdEZpbHRlclBsb3RUeXBlLFxuICBmaWx0ZXJEYXRhXG59IGZyb20gJ3V0aWxzL2ZpbHRlci11dGlscyc7XG5pbXBvcnQge2NyZWF0ZU5ld0RhdGFFbnRyeX0gZnJvbSAndXRpbHMvZGF0YXNldC11dGlscyc7XG5cbmltcG9ydCB7XG4gIGZpbmREZWZhdWx0TGF5ZXIsXG4gIGNhbGN1bGF0ZUxheWVyRGF0YVxufSBmcm9tICd1dGlscy9sYXllci11dGlscy9sYXllci11dGlscyc7XG5cbmltcG9ydCB7Z2V0RmlsZUhhbmRsZXJ9IGZyb20gJ3Byb2Nlc3Nvci9maWxlLWhhbmRsZXInO1xuaW1wb3J0IHtmaW5kTWFwQm91bmRzfSBmcm9tICd1dGlscy9kYXRhLXV0aWxzJztcblxuaW1wb3J0IHtcbiAgbWVyZ2VGaWx0ZXJzLFxuICBtZXJnZUxheWVycyxcbiAgbWVyZ2VJbnRlcmFjdGlvbnMsXG4gIG1lcmdlTGF5ZXJCbGVuZGluZ1xufSBmcm9tICcuL3Zpcy1zdGF0ZS1tZXJnZXInO1xuXG5pbXBvcnQgKiBhcyBLZXBsZXJHTExheWVycyBmcm9tICdrZXBsZXJnbC1sYXllcnMnO1xuaW1wb3J0IHtMQVlFUl9DTEFTU0VTfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbmV4cG9ydCBjb25zdCBJTklUSUFMX1ZJU19TVEFURSA9IHtcbiAgLy8gbGF5ZXJzXG4gIGxheWVyczogW10sXG4gIGxheWVyRGF0YTogW10sXG4gIGxheWVyVG9CZU1lcmdlZDogW10sXG4gIGxheWVyT3JkZXI6IFtdLFxuXG4gIC8vIGZpbHRlcnNcbiAgZmlsdGVyczogW10sXG4gIGZpbHRlclRvQmVNZXJnZWQ6IFtdLFxuXG4gIC8vIGEgY29sbGVjdGlvbiBvZiBtdWx0aXBsZSBkYXRhc2V0XG4gIGRhdGFzZXRzOiB7fSxcbiAgZWRpdGluZ0RhdGFzZXQ6IHVuZGVmaW5lZCxcblxuICBpbnRlcmFjdGlvbkNvbmZpZzogZ2V0RGVmYXVsdEludGVyYWN0aW9uKCksXG4gIGludGVyYWN0aW9uVG9CZU1lcmdlZDogdW5kZWZpbmVkLFxuXG4gIGxheWVyQmxlbmRpbmc6ICdub3JtYWwnLFxuICBob3ZlckluZm86IHVuZGVmaW5lZCxcbiAgY2xpY2tlZDogdW5kZWZpbmVkLFxuXG4gIGZpbGVMb2FkaW5nOiBmYWxzZSxcbiAgZmlsZUxvYWRpbmdFcnI6IG51bGwsXG5cbiAgLy8gdGhpcyBpcyB1c2VkIHdoZW4gdXNlciBzcGxpdCBtYXBzXG4gIHNwbGl0TWFwczogW1xuICAgIC8vIHRoaXMgd2lsbCBjb250YWluIGEgbGlzdCBvZiBvYmplY3RzIHRvXG4gICAgLy8gZGVzY3JpYmUgdGhlIHN0YXRlIG9mIGxheWVyIGF2YWlsYWJpbGl0eSBhbmQgdmlzaWJpbGl0eSBmb3IgZWFjaCBtYXBcbiAgICAvLyBbXG4gICAgLy8gICB7XG4gICAgLy8gICAgIGxheWVyczoge1xuICAgIC8vICAgICAgIGxheWVyX2lkOiB7XG4gICAgLy8gICAgICAgICBpc0F2YWlsYWJsZTogdHJ1ZXxmYWxzZSAjIHRoaXMgaXMgZHJpdmVuIGJ5IHRoZSBsZWZ0IGhhbmQgcGFuZWxcbiAgICAvLyAgICAgICAgIGlzVmlzaWJsZTogdHJ1ZXxmYWxzZVxuICAgIC8vICAgICAgIH1cbiAgICAvLyAgICAgfVxuICAgIC8vICAgfVxuICAgIC8vIF1cbiAgXVxufTtcblxuZnVuY3Rpb24gdXBkYXRlU3RhdGVXaXRoTGF5ZXJBbmREYXRhKHN0YXRlLCB7bGF5ZXJEYXRhLCBsYXllciwgaWR4fSkge1xuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGxheWVyczogc3RhdGUubGF5ZXJzLm1hcCgobHlyLCBpKSA9PiAoaSA9PT0gaWR4ID8gbGF5ZXIgOiBseXIpKSxcbiAgICBsYXllckRhdGE6IGxheWVyRGF0YVxuICAgICAgPyBzdGF0ZS5sYXllckRhdGEubWFwKChkLCBpKSA9PiAoaSA9PT0gaWR4ID8gbGF5ZXJEYXRhIDogZCkpXG4gICAgICA6IHN0YXRlLmxheWVyRGF0YVxuICB9O1xufVxuXG4vKipcbiAqIENhbGxlZCB0byB1cGRhdGUgbGF5ZXIgYmFzZSBjb25maWc6IGRhdGFJZCwgbGFiZWwsIGNvbHVtbiwgaXNWaXNpYmxlXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gbGF5ZXJDb25maWdDaGFuZ2VVcGRhdGVyKHN0YXRlLCBhY3Rpb24pIHtcbiAgY29uc3Qge29sZExheWVyfSA9IGFjdGlvbjtcbiAgY29uc3QgaWR4ID0gc3RhdGUubGF5ZXJzLmZpbmRJbmRleChsID0+IGwuaWQgPT09IG9sZExheWVyLmlkKTtcbiAgY29uc3QgcHJvcHMgPSBPYmplY3Qua2V5cyhhY3Rpb24ubmV3Q29uZmlnKTtcblxuICBjb25zdCBuZXdMYXllciA9IG9sZExheWVyLnVwZGF0ZUxheWVyQ29uZmlnKGFjdGlvbi5uZXdDb25maWcpO1xuICBpZiAobmV3TGF5ZXIuc2hvdWxkQ2FsY3VsYXRlTGF5ZXJEYXRhKHByb3BzKSkge1xuICAgIGNvbnN0IG9sZExheWVyRGF0YSA9IHN0YXRlLmxheWVyRGF0YVtpZHhdO1xuICAgIGNvbnN0IHtsYXllckRhdGEsIGxheWVyfSA9IGNhbGN1bGF0ZUxheWVyRGF0YShcbiAgICAgIG5ld0xheWVyLFxuICAgICAgc3RhdGUsXG4gICAgICBvbGRMYXllckRhdGEsXG4gICAgICB7c2FtZURhdGE6IHRydWV9XG4gICAgKTtcbiAgICByZXR1cm4gdXBkYXRlU3RhdGVXaXRoTGF5ZXJBbmREYXRhKHN0YXRlLCB7bGF5ZXJEYXRhLCBsYXllciwgaWR4fSk7XG4gIH1cblxuICBjb25zdCBuZXdTdGF0ZSA9IHtcbiAgICAuLi5zdGF0ZSxcbiAgICBzcGxpdE1hcHM6XG4gICAgICAnaXNWaXNpYmxlJyBpbiBhY3Rpb24ubmV3Q29uZmlnXG4gICAgICAgID8gdG9nZ2xlTGF5ZXJGcm9tU3BsaXRNYXBzKHN0YXRlLCBuZXdMYXllcilcbiAgICAgICAgOiBzdGF0ZS5zcGxpdE1hcHNcbiAgfTtcblxuICByZXR1cm4gdXBkYXRlU3RhdGVXaXRoTGF5ZXJBbmREYXRhKG5ld1N0YXRlLCB7bGF5ZXI6IG5ld0xheWVyLCBpZHh9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxheWVyVHlwZUNoYW5nZVVwZGF0ZXIoc3RhdGUsIGFjdGlvbikge1xuICBjb25zdCB7b2xkTGF5ZXIsIG5ld1R5cGV9ID0gYWN0aW9uO1xuICBjb25zdCBvbGRJZCA9IG9sZExheWVyLmlkO1xuICBjb25zdCBpZHggPSBzdGF0ZS5sYXllcnMuZmluZEluZGV4KGwgPT4gbC5pZCA9PT0gb2xkSWQpO1xuXG4gIGlmICghTEFZRVJfQ0xBU1NFU1tuZXdUeXBlXSB8fCAhS2VwbGVyR0xMYXllcnNbTEFZRVJfQ0xBU1NFU1tuZXdUeXBlXV0pIHtcbiAgICBDb25zb2xlLmVycm9yKGAke25ld1R5cGV9IGlzIG5vdCBhIHZhbGlkIGxheWVyIHR5cGVgKTtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICAvLyBnZXQgYSBtaW50IGxheWVyLCB3aXRoIG5ldyBpZCBhbmQgdHlwZVxuICAvLyBiZWNhdXNlIGRlY2suZ2wgdXNlcyBpZCB0byBtYXRjaCBiZXR3ZWVuIG5ldyBhbmQgb2xkIGxheWVyLlxuICAvLyBJZiB0eXBlIGhhcyBjaGFuZ2VkIGJ1dCBpZCBpcyB0aGUgc2FtZSwgaXQgd2lsbCBicmVha1xuICBjb25zdCBMYXllckNsYXNzID0gS2VwbGVyR0xMYXllcnNbTEFZRVJfQ0xBU1NFU1tuZXdUeXBlXV07XG4gIGNvbnN0IG5ld0xheWVyID0gbmV3IExheWVyQ2xhc3MoKTtcblxuICBuZXdMYXllci5jb25maWcgPSBuZXdMYXllci5hc3NpZ25Db25maWdUb0xheWVyKFxuICAgIG5ld0xheWVyLmNvbmZpZyxcbiAgICBvbGRMYXllci5jb25maWdcbiAgKTtcblxuICBjb25zdCB7bGF5ZXJEYXRhLCBsYXllcn0gPSBjYWxjdWxhdGVMYXllckRhdGEobmV3TGF5ZXIsIHN0YXRlKTtcblxuICBsZXQgbmV3U3RhdGUgPSBzdGF0ZTtcblxuICAvLyB1cGRhdGUgc3BsaXRNYXAgbGF5ZXIgaWRcbiAgaWYgKHN0YXRlLnNwbGl0TWFwcykge1xuICAgIG5ld1N0YXRlID0ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBzcGxpdE1hcHM6IHN0YXRlLnNwbGl0TWFwcy5tYXAoc2V0dGluZ3MgPT4ge1xuICAgICAgICBjb25zdCB7W29sZElkXTogb2xkTGF5ZXJNYXAsIC4uLm90aGVyTGF5ZXJzfSA9IHNldHRpbmdzLmxheWVycztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5zZXR0aW5ncyxcbiAgICAgICAgICBsYXllcnM6IHtcbiAgICAgICAgICAgIC4uLm90aGVyTGF5ZXJzLFxuICAgICAgICAgICAgW2xheWVyLmlkXTogb2xkTGF5ZXJNYXBcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9KVxuICAgIH07XG4gIH1cblxuICByZXR1cm4gdXBkYXRlU3RhdGVXaXRoTGF5ZXJBbmREYXRhKG5ld1N0YXRlLCB7bGF5ZXJEYXRhLCBsYXllciwgaWR4fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYXllclZpc3VhbENoYW5uZWxDaGFuZ2VVcGRhdGVyKHN0YXRlLCBhY3Rpb24pIHtcbiAgY29uc3Qge29sZExheWVyLCBuZXdDb25maWcsIGNoYW5uZWx9ID0gYWN0aW9uO1xuICBjb25zdCB7ZGF0YSwgYWxsRGF0YX0gPSBzdGF0ZS5kYXRhc2V0c1tvbGRMYXllci5jb25maWcuZGF0YUlkXTtcblxuICBjb25zdCBpZHggPSBzdGF0ZS5sYXllcnMuZmluZEluZGV4KGwgPT4gbC5pZCA9PT0gb2xkTGF5ZXIuaWQpO1xuICBjb25zdCBuZXdMYXllciA9IG9sZExheWVyLnVwZGF0ZUxheWVyQ29uZmlnKG5ld0NvbmZpZyk7XG5cbiAgbmV3TGF5ZXIudXBkYXRlTGF5ZXJWaXN1YWxDaGFubmVsKHtkYXRhLCBhbGxEYXRhfSwgY2hhbm5lbCk7XG5cbiAgY29uc3Qgb2xkTGF5ZXJEYXRhID0gc3RhdGUubGF5ZXJEYXRhW2lkeF07XG4gIGNvbnN0IHtsYXllckRhdGEsIGxheWVyfSA9IGNhbGN1bGF0ZUxheWVyRGF0YShuZXdMYXllciwgc3RhdGUsIG9sZExheWVyRGF0YSwge1xuICAgIHNhbWVEYXRhOiB0cnVlXG4gIH0pO1xuXG4gIHJldHVybiB1cGRhdGVTdGF0ZVdpdGhMYXllckFuZERhdGEoc3RhdGUsIHtsYXllckRhdGEsIGxheWVyLCBpZHh9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxheWVyVmlzQ29uZmlnQ2hhbmdlVXBkYXRlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIGNvbnN0IHtvbGRMYXllcn0gPSBhY3Rpb247XG4gIGNvbnN0IGlkeCA9IHN0YXRlLmxheWVycy5maW5kSW5kZXgobCA9PiBsLmlkID09PSBvbGRMYXllci5pZCk7XG4gIGNvbnN0IHByb3BzID0gT2JqZWN0LmtleXMoYWN0aW9uLm5ld1Zpc0NvbmZpZyk7XG5cbiAgY29uc3QgbmV3VmlzQ29uZmlnID0ge1xuICAgIC4uLm9sZExheWVyLmNvbmZpZy52aXNDb25maWcsXG4gICAgLi4uYWN0aW9uLm5ld1Zpc0NvbmZpZ1xuICB9O1xuXG4gIGNvbnN0IG5ld0xheWVyID0gb2xkTGF5ZXIudXBkYXRlTGF5ZXJDb25maWcoe3Zpc0NvbmZpZzogbmV3VmlzQ29uZmlnfSk7XG5cbiAgaWYgKG5ld0xheWVyLnNob3VsZENhbGN1bGF0ZUxheWVyRGF0YShwcm9wcykpIHtcbiAgICBjb25zdCBvbGRMYXllckRhdGEgPSBzdGF0ZS5sYXllckRhdGFbaWR4XTtcbiAgICBjb25zdCB7bGF5ZXJEYXRhLCBsYXllcn0gPSBjYWxjdWxhdGVMYXllckRhdGEoXG4gICAgICBuZXdMYXllcixcbiAgICAgIHN0YXRlLFxuICAgICAgb2xkTGF5ZXJEYXRhLFxuICAgICAge3NhbWVEYXRhOiB0cnVlfVxuICAgICk7XG4gICAgcmV0dXJuIHVwZGF0ZVN0YXRlV2l0aExheWVyQW5kRGF0YShzdGF0ZSwge2xheWVyRGF0YSwgbGF5ZXIsIGlkeH0pO1xuICB9XG5cbiAgcmV0dXJuIHVwZGF0ZVN0YXRlV2l0aExheWVyQW5kRGF0YShzdGF0ZSwge2xheWVyOiBuZXdMYXllciwgaWR4fSk7XG59XG5cbi8qIGVzbGludC1lbmFibGUgbWF4LXN0YXRlbWVudHMgKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGludGVyYWN0aW9uQ29uZmlnQ2hhbmdlVXBkYXRlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIGNvbnN0IHtjb25maWd9ID0gYWN0aW9uO1xuXG4gIGNvbnN0IGludGVyYWN0aW9uQ29uZmlnID0ge1xuICAgIC4uLnN0YXRlLmludGVyYWN0aW9uQ29uZmlnLFxuICAgIC4uLntbY29uZmlnLmlkXTogY29uZmlnfVxuICB9O1xuXG4gIGlmIChjb25maWcuZW5hYmxlZCAmJiAhc3RhdGUuaW50ZXJhY3Rpb25Db25maWdbY29uZmlnLmlkXS5lbmFibGVkKSB7XG4gICAgLy8gb25seSBlbmFibGUgb25lIGludGVyYWN0aW9uIGF0IGEgdGltZVxuICAgIE9iamVjdC5rZXlzKGludGVyYWN0aW9uQ29uZmlnKS5mb3JFYWNoKGsgPT4ge1xuICAgICAgaWYgKGsgIT09IGNvbmZpZy5pZCkge1xuICAgICAgICBpbnRlcmFjdGlvbkNvbmZpZ1trXSA9IHsuLi5pbnRlcmFjdGlvbkNvbmZpZ1trXSwgZW5hYmxlZDogZmFsc2V9O1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBpbnRlcmFjdGlvbkNvbmZpZ1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0RmlsdGVyVXBkYXRlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIGNvbnN0IHtpZHgsIHByb3AsIHZhbHVlfSA9IGFjdGlvbjtcbiAgbGV0IG5ld1N0YXRlID0gc3RhdGU7XG4gIGxldCBuZXdGaWx0ZXIgPSB7XG4gICAgLi4uc3RhdGUuZmlsdGVyc1tpZHhdLFxuICAgIFtwcm9wXTogdmFsdWVcbiAgfTtcblxuICBjb25zdCB7ZGF0YUlkfSA9IG5ld0ZpbHRlcjtcbiAgaWYgKCFkYXRhSWQpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cbiAgY29uc3Qge2ZpZWxkcywgYWxsRGF0YX0gPSBzdGF0ZS5kYXRhc2V0c1tkYXRhSWRdO1xuXG4gIHN3aXRjaCAocHJvcCkge1xuICAgIGNhc2UgJ2RhdGFJZCc6XG4gICAgICAvLyBpZiB0cnlpbmcgdG8gdXBkYXRlIGZpbHRlciBkYXRhSWQuIGNyZWF0ZSBhbiBlbXB0eSBuZXcgZmlsdGVyXG4gICAgICBuZXdGaWx0ZXIgPSBnZXREZWZhdWx0ZmlsdGVyKGRhdGFJZCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ25hbWUnOlxuICAgICAgLy8gZmluZCB0aGUgZmllbGRcbiAgICAgIGNvbnN0IGZpZWxkSWR4ID0gZmllbGRzLmZpbmRJbmRleChmID0+IGYubmFtZSA9PT0gdmFsdWUpO1xuICAgICAgbGV0IGZpZWxkID0gZmllbGRzW2ZpZWxkSWR4XTtcblxuICAgICAgaWYgKCFmaWVsZC5maWx0ZXJQcm9wKSB7XG4gICAgICAgIC8vIGdldCBmaWx0ZXIgZG9tYWluIGZyb20gZmllbGRcbiAgICAgICAgLy8gc2F2ZSBmaWx0ZXJQcm9wczoge2RvbWFpbiwgc3RlcHMsIHZhbHVlfSB0byBmaWVsZCwgYXZvaWQgcmVjYWxjdWxhdGVcbiAgICAgICAgZmllbGQgPSB7XG4gICAgICAgICAgLi4uZmllbGQsXG4gICAgICAgICAgZmlsdGVyUHJvcDogZ2V0RmlsdGVyUHJvcHMoYWxsRGF0YSwgZmllbGQpXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIG5ld0ZpbHRlciA9IHtcbiAgICAgICAgLi4ubmV3RmlsdGVyLFxuICAgICAgICAuLi5maWVsZC5maWx0ZXJQcm9wLFxuICAgICAgICBuYW1lOiBmaWVsZC5uYW1lLFxuICAgICAgICAvLyBjYW4ndCBlZGl0IGRhdGFJZCBvbmNlIG5hbWUgaXMgc2VsZWN0ZWRcbiAgICAgICAgZnJlZXplOiB0cnVlLFxuICAgICAgICBmaWVsZElkeFxuICAgICAgfTtcblxuICAgICAgbmV3U3RhdGUgPSB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBkYXRhc2V0czoge1xuICAgICAgICAgIC4uLnN0YXRlLmRhdGFzZXRzLFxuICAgICAgICAgIFtkYXRhSWRdOiB7XG4gICAgICAgICAgICAuLi5zdGF0ZS5kYXRhc2V0c1tkYXRhSWRdLFxuICAgICAgICAgICAgZmllbGRzOiBmaWVsZHMubWFwKChkLCBpKSA9PiAoaSA9PT0gZmllbGRJZHggPyBmaWVsZCA6IGQpKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3ZhbHVlJzpcbiAgICBkZWZhdWx0OlxuICAgICAgYnJlYWs7XG4gIH1cblxuICAvLyBzYXZlIG5ldyBmaWx0ZXJzIHRvIG5ld1N0YXRlXG4gIG5ld1N0YXRlID0ge1xuICAgIC4uLm5ld1N0YXRlLFxuICAgIGZpbHRlcnM6IHN0YXRlLmZpbHRlcnMubWFwKChmLCBpKSA9PiAoaSA9PT0gaWR4ID8gbmV3RmlsdGVyIDogZikpXG4gIH07XG5cbiAgLy8gZmlsdGVyIGRhdGFcbiAgbmV3U3RhdGUgPSB7XG4gICAgLi4ubmV3U3RhdGUsXG4gICAgZGF0YXNldHM6IHtcbiAgICAgIC4uLm5ld1N0YXRlLmRhdGFzZXRzLFxuICAgICAgW2RhdGFJZF06IHtcbiAgICAgICAgLi4ubmV3U3RhdGUuZGF0YXNldHNbZGF0YUlkXSxcbiAgICAgICAgLi4uZmlsdGVyRGF0YShhbGxEYXRhLCBkYXRhSWQsIG5ld1N0YXRlLmZpbHRlcnMpXG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIG5ld1N0YXRlID0gdXBkYXRlQWxsTGF5ZXJEb21haW5EYXRhKG5ld1N0YXRlLCBkYXRhSWQpO1xuXG4gIHJldHVybiBuZXdTdGF0ZTtcbn1cblxuZXhwb3J0IGNvbnN0IHNldEZpbHRlclBsb3RVcGRhdGVyID0gKHN0YXRlLCB7aWR4LCBuZXdQcm9wfSkgPT4ge1xuICBsZXQgbmV3RmlsdGVyID0gey4uLnN0YXRlLmZpbHRlcnNbaWR4XSwgLi4ubmV3UHJvcH07XG4gIGNvbnN0IHByb3AgPSBPYmplY3Qua2V5cyhuZXdQcm9wKVswXTtcbiAgaWYgKHByb3AgPT09ICd5QXhpcycpIHtcbiAgICBjb25zdCBwbG90VHlwZSA9IGdldERlZmF1bHRGaWx0ZXJQbG90VHlwZShuZXdGaWx0ZXIpO1xuXG4gICAgaWYgKHBsb3RUeXBlKSB7XG4gICAgICBuZXdGaWx0ZXIgPSB7XG4gICAgICAgIC4uLm5ld0ZpbHRlcixcbiAgICAgICAgLi4uZ2V0RmlsdGVyUGxvdChcbiAgICAgICAgICB7Li4ubmV3RmlsdGVyLCBwbG90VHlwZX0sXG4gICAgICAgICAgc3RhdGUuZGF0YXNldHNbbmV3RmlsdGVyLmRhdGFJZF0uYWxsRGF0YVxuICAgICAgICApLFxuICAgICAgICBwbG90VHlwZVxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGZpbHRlcnM6IHN0YXRlLmZpbHRlcnMubWFwKChmLCBpKSA9PiAoaSA9PT0gaWR4ID8gbmV3RmlsdGVyIDogZikpXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgYWRkRmlsdGVyVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PlxuICAhYWN0aW9uLmRhdGFJZFxuICAgID8gc3RhdGVcbiAgICA6IHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGZpbHRlcnM6IFsuLi5zdGF0ZS5maWx0ZXJzLCBnZXREZWZhdWx0ZmlsdGVyKGFjdGlvbi5kYXRhSWQpXVxuICAgICAgfTtcblxuZXhwb3J0IGNvbnN0IHRvZ2dsZUZpbHRlckFuaW1hdGlvblVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGZpbHRlcnM6IHN0YXRlLmZpbHRlcnMubWFwKFxuICAgIChmLCBpKSA9PiAoaSA9PT0gYWN0aW9uLmlkeCA/IHsuLi5mLCBpc0FuaW1hdGluZzogIWYuaXNBbmltYXRpbmd9IDogZilcbiAgKVxufSk7XG5cbmV4cG9ydCBjb25zdCBlbmxhcmdlRmlsdGVyVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIGNvbnN0IGlzRW5sYXJnZWQgPSBzdGF0ZS5maWx0ZXJzW2FjdGlvbi5pZHhdLmVubGFyZ2VkO1xuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgZmlsdGVyczogc3RhdGUuZmlsdGVycy5tYXAoKGYsIGkpID0+IHtcbiAgICAgIGYuZW5sYXJnZWQgPSAhaXNFbmxhcmdlZCAmJiBpID09PSBhY3Rpb24uaWR4O1xuICAgICAgcmV0dXJuIGY7XG4gICAgfSlcbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCByZW1vdmVGaWx0ZXJVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgY29uc3Qge2lkeH0gPSBhY3Rpb247XG4gIGNvbnN0IHtkYXRhSWR9ID0gc3RhdGUuZmlsdGVyc1tpZHhdO1xuXG4gIGNvbnN0IG5ld0ZpbHRlcnMgPSBbXG4gICAgLi4uc3RhdGUuZmlsdGVycy5zbGljZSgwLCBpZHgpLFxuICAgIC4uLnN0YXRlLmZpbHRlcnMuc2xpY2UoaWR4ICsgMSwgc3RhdGUuZmlsdGVycy5sZW5ndGgpXG4gIF07XG5cbiAgY29uc3QgbmV3U3RhdGUgPSB7XG4gICAgLi4uc3RhdGUsXG4gICAgZGF0YXNldHM6IHtcbiAgICAgIC4uLnN0YXRlLmRhdGFzZXRzLFxuICAgICAgW2RhdGFJZF06IHtcbiAgICAgICAgLi4uc3RhdGUuZGF0YXNldHNbZGF0YUlkXSxcbiAgICAgICAgLi4uZmlsdGVyRGF0YShzdGF0ZS5kYXRhc2V0c1tkYXRhSWRdLmFsbERhdGEsIGRhdGFJZCwgbmV3RmlsdGVycylcbiAgICAgIH1cbiAgICB9LFxuICAgIGZpbHRlcnM6IG5ld0ZpbHRlcnNcbiAgfTtcblxuICByZXR1cm4gdXBkYXRlQWxsTGF5ZXJEb21haW5EYXRhKG5ld1N0YXRlLCBkYXRhSWQpO1xufTtcblxuZXhwb3J0IGNvbnN0IGFkZExheWVyVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIGNvbnN0IGRlZmF1bHREYXRhc2V0ID0gT2JqZWN0LmtleXMoc3RhdGUuZGF0YXNldHMpWzBdO1xuXG4gIGNvbnN0IG5ld0xheWVyID0gbmV3IEtlcGxlckdMTGF5ZXJzLkxheWVyKHtcbiAgICBpc1Zpc2libGU6IHRydWUsXG4gICAgaXNDb25maWdBY3RpdmU6IHRydWUsXG4gICAgZGF0YUlkOiBkZWZhdWx0RGF0YXNldFxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGxheWVyczogWy4uLnN0YXRlLmxheWVycywgbmV3TGF5ZXJdLFxuICAgIGxheWVyRGF0YTogWy4uLnN0YXRlLmxheWVyRGF0YSwge31dLFxuICAgIGxheWVyT3JkZXI6IFsuLi5zdGF0ZS5sYXllck9yZGVyLCBzdGF0ZS5sYXllck9yZGVyLmxlbmd0aF0sXG4gICAgc3BsaXRNYXBzOiBhZGROZXdMYXllcnNUb1NwbGl0TWFwKHN0YXRlLnNwbGl0TWFwcywgbmV3TGF5ZXIpXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgcmVtb3ZlTGF5ZXJVcGRhdGVyID0gKHN0YXRlLCB7aWR4fSkgPT4ge1xuICBjb25zdCB7bGF5ZXJzLCBsYXllckRhdGEsIGNsaWNrZWQsIGhvdmVySW5mb30gPSBzdGF0ZTtcbiAgY29uc3QgbGF5ZXJUb1JlbW92ZSA9IHN0YXRlLmxheWVyc1tpZHhdO1xuICBjb25zdCBuZXdNYXBzID0gcmVtb3ZlTGF5ZXJGcm9tU3BsaXRNYXBzKHN0YXRlLCBsYXllclRvUmVtb3ZlKTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGxheWVyczogWy4uLmxheWVycy5zbGljZSgwLCBpZHgpLCAuLi5sYXllcnMuc2xpY2UoaWR4ICsgMSwgbGF5ZXJzLmxlbmd0aCldLFxuICAgIGxheWVyRGF0YTogW1xuICAgICAgLi4ubGF5ZXJEYXRhLnNsaWNlKDAsIGlkeCksXG4gICAgICAuLi5sYXllckRhdGEuc2xpY2UoaWR4ICsgMSwgbGF5ZXJEYXRhLmxlbmd0aClcbiAgICBdLFxuICAgIGxheWVyT3JkZXI6IHN0YXRlLmxheWVyT3JkZXJcbiAgICAgIC5maWx0ZXIoaSA9PiBpICE9PSBpZHgpXG4gICAgICAubWFwKHBpZCA9PiAocGlkID4gaWR4ID8gcGlkIC0gMSA6IHBpZCkpLFxuICAgIGNsaWNrZWQ6IGxheWVyVG9SZW1vdmUuaXNMYXllckhvdmVyZWQoY2xpY2tlZCkgPyB1bmRlZmluZWQgOiBjbGlja2VkLFxuICAgIGhvdmVySW5mbzogbGF5ZXJUb1JlbW92ZS5pc0xheWVySG92ZXJlZChob3ZlckluZm8pID8gdW5kZWZpbmVkIDogaG92ZXJJbmZvLFxuICAgIHNwbGl0TWFwczogbmV3TWFwc1xuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IHJlb3JkZXJMYXllclVwZGF0ZXIgPSAoc3RhdGUsIHtvcmRlcn0pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBsYXllck9yZGVyOiBvcmRlclxufSk7XG5cbmV4cG9ydCBjb25zdCByZW1vdmVEYXRhc2V0VXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIC8vIGV4dHJhY3QgZGF0YXNldCBrZXlcbiAgY29uc3Qge2tleTogZGF0YXNldEtleX0gPSBhY3Rpb247XG4gIGNvbnN0IHtkYXRhc2V0c30gPSBzdGF0ZTtcblxuICAvLyBjaGVjayBpZiBkYXRhc2V0IGlzIHByZXNlbnRcbiAgaWYgKCFkYXRhc2V0c1tkYXRhc2V0S2V5XSkge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4gIGNvbnN0IHtsYXllcnMsIGRhdGFzZXRzOiB7W2RhdGFzZXRLZXldOiBkYXRhc2V0LCAuLi5uZXdEYXRhc2V0c319ID0gc3RhdGU7XG4gIC8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cblxuICBjb25zdCBpbmRleGVzID0gbGF5ZXJzLnJlZHVjZSgobGlzdE9mSW5kZXhlcywgbGF5ZXIsIGluZGV4KSA9PiB7XG4gICAgaWYgKGxheWVyLmNvbmZpZy5kYXRhSWQgPT09IGRhdGFzZXRLZXkpIHtcbiAgICAgIGxpc3RPZkluZGV4ZXMucHVzaChpbmRleCk7XG4gICAgfVxuICAgIHJldHVybiBsaXN0T2ZJbmRleGVzO1xuICB9LCBbXSk7XG5cbiAgLy8gcmVtb3ZlIGxheWVycyBhbmQgZGF0YXNldHNcbiAgY29uc3Qge25ld1N0YXRlfSA9IGluZGV4ZXMucmVkdWNlKFxuICAgICh7bmV3U3RhdGU6IGN1cnJlbnRTdGF0ZSwgaW5kZXhDb3VudGVyfSwgaWR4KSA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50SW5kZXggPSBpZHggLSBpbmRleENvdW50ZXI7XG4gICAgICBjdXJyZW50U3RhdGUgPSByZW1vdmVMYXllclVwZGF0ZXIoY3VycmVudFN0YXRlLCB7aWR4OiBjdXJyZW50SW5kZXh9KTtcbiAgICAgIGluZGV4Q291bnRlcisrO1xuICAgICAgcmV0dXJuIHtuZXdTdGF0ZTogY3VycmVudFN0YXRlLCBpbmRleENvdW50ZXJ9O1xuICAgIH0sXG4gICAge25ld1N0YXRlOiB7Li4uc3RhdGUsIGRhdGFzZXRzOiBuZXdEYXRhc2V0c30sIGluZGV4Q291bnRlcjogMH1cbiAgKTtcblxuICAvLyByZW1vdmUgZmlsdGVyc1xuICBjb25zdCBmaWx0ZXJzID0gc3RhdGUuZmlsdGVycy5maWx0ZXIoZmlsdGVyID0+IGZpbHRlci5kYXRhSWQgIT09IGRhdGFzZXRLZXkpO1xuXG4gIC8vIHVwZGF0ZSBpbnRlcmFjdGlvbkNvbmZpZ1xuICBsZXQge2ludGVyYWN0aW9uQ29uZmlnfSA9IHN0YXRlO1xuICBjb25zdCB7dG9vbHRpcH0gPSBpbnRlcmFjdGlvbkNvbmZpZztcbiAgaWYgKHRvb2x0aXApIHtcbiAgICBjb25zdCB7Y29uZmlnfSA9IHRvb2x0aXA7XG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgICBjb25zdCB7W2RhdGFzZXRLZXldOiBmaWVsZHMsIC4uLmZpZWxkc1RvU2hvd30gPSBjb25maWcuZmllbGRzVG9TaG93O1xuICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgICBpbnRlcmFjdGlvbkNvbmZpZyA9IHtcbiAgICAgIC4uLmludGVyYWN0aW9uQ29uZmlnLFxuICAgICAgdG9vbHRpcDogey4uLnRvb2x0aXAsIGNvbmZpZzogey4uLmNvbmZpZywgZmllbGRzVG9TaG93fX1cbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHsuLi5uZXdTdGF0ZSwgZmlsdGVycywgaW50ZXJhY3Rpb25Db25maWd9O1xufTtcblxuZXhwb3J0IGNvbnN0IHVwZGF0ZUxheWVyQmxlbmRpbmdVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBsYXllckJsZW5kaW5nOiBhY3Rpb24ubW9kZVxufSk7XG5cbmV4cG9ydCBjb25zdCBzaG93RGF0YXNldFRhYmxlVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgZWRpdGluZ0RhdGFzZXQ6IGFjdGlvbi5kYXRhSWRcbiAgfTtcbn07XG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1zdGF0ZW1lbnRzICovXG5leHBvcnQgY29uc3QgdXBkYXRlVmlzRGF0YVVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAvLyBkYXRhc2V0cyBjYW4gYmUgYSBzaW5nbGUgZGF0YSBlbnRyaWVzIG9yIGFuIGFycmF5IG9mIG11bHRpcGxlIGRhdGEgZW50cmllc1xuICBjb25zdCBkYXRhc2V0cyA9IEFycmF5LmlzQXJyYXkoYWN0aW9uLmRhdGFzZXRzKVxuICAgID8gYWN0aW9uLmRhdGFzZXRzXG4gICAgOiBbYWN0aW9uLmRhdGFzZXRzXTtcbiAgY29uc3Qge29wdGlvbnMgPSB7Y2VudGVyTWFwOiB0cnVlfX0gPSBhY3Rpb247XG5cbiAgY29uc3QgbmV3RGF0ZUVudHJpZXMgPSBkYXRhc2V0cy5yZWR1Y2UoXG4gICAgKGFjY3UsIHtpbmZvID0ge30sIGRhdGF9KSA9PiAoe1xuICAgICAgLi4uYWNjdSxcbiAgICAgIC4uLihjcmVhdGVOZXdEYXRhRW50cnkoe2luZm8sIGRhdGF9LCBzdGF0ZS5kYXRhc2V0cykgfHwge30pXG4gICAgfSksXG4gICAge31cbiAgKTtcblxuICBpZiAoIU9iamVjdC5rZXlzKG5ld0RhdGVFbnRyaWVzKS5sZW5ndGgpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICBjb25zdCBzdGF0ZVdpdGhOZXdEYXRhID0ge1xuICAgIC4uLnN0YXRlLFxuICAgIGRhdGFzZXRzOiB7XG4gICAgICAuLi5zdGF0ZS5kYXRhc2V0cyxcbiAgICAgIC4uLm5ld0RhdGVFbnRyaWVzXG4gICAgfVxuICB9O1xuXG4gIC8vIHByZXZpb3VzbHkgc2F2ZWQgY29uZmlnIGJlZm9yZSBkYXRhIGxvYWRlZFxuICBjb25zdCB7XG4gICAgZmlsdGVyVG9CZU1lcmdlZCA9IFtdLFxuICAgIGxheWVyVG9CZU1lcmdlZCA9IFtdLFxuICAgIGludGVyYWN0aW9uVG9CZU1lcmdlZCA9IHt9XG4gIH0gPSBzdGF0ZVdpdGhOZXdEYXRhO1xuXG4gIC8vIGtlZXAgYSBjb3B5IG9mIG9sZExheWVyc1xuICBjb25zdCBvbGRMYXllcnMgPSBzdGF0ZS5sYXllcnMubWFwKGwgPT4gbC5pZCk7XG5cbiAgLy8gbWVyZ2Ugc3RhdGUgd2l0aCBzYXZlZCBmaWx0ZXJzXG4gIGxldCBtZXJnZWRTdGF0ZSA9IG1lcmdlRmlsdGVycyhzdGF0ZVdpdGhOZXdEYXRhLCBmaWx0ZXJUb0JlTWVyZ2VkKTtcbiAgLy8gbWVyZ2Ugc3RhdGUgd2l0aCBzYXZlZCBsYXllcnNcbiAgbWVyZ2VkU3RhdGUgPSBtZXJnZUxheWVycyhtZXJnZWRTdGF0ZSwgbGF5ZXJUb0JlTWVyZ2VkKTtcblxuICBpZiAobWVyZ2VkU3RhdGUubGF5ZXJzLmxlbmd0aCA9PT0gc3RhdGUubGF5ZXJzLmxlbmd0aCkge1xuICAgIC8vIG5vIGxheWVyIG1lcmdlZCwgZmluZCBkZWZhdWx0c1xuICAgIG1lcmdlZFN0YXRlID0gYWRkRGVmYXVsdExheWVycyhtZXJnZWRTdGF0ZSwgbmV3RGF0ZUVudHJpZXMpO1xuICB9XG5cbiAgaWYgKG1lcmdlZFN0YXRlLnNwbGl0TWFwcy5sZW5ndGgpIHtcbiAgICBjb25zdCBuZXdMYXllcnMgPSBtZXJnZWRTdGF0ZS5sYXllcnMuZmlsdGVyKFxuICAgICAgbCA9PiBsLmNvbmZpZy5kYXRhSWQgaW4gbmV3RGF0ZUVudHJpZXNcbiAgICApO1xuICAgIC8vIGlmIG1hcCBpcyBzcGxpdGVkLCBhZGQgbmV3IGxheWVycyB0byBzcGxpdE1hcHNcbiAgICBtZXJnZWRTdGF0ZSA9IHtcbiAgICAgIC4uLm1lcmdlZFN0YXRlLFxuICAgICAgc3BsaXRNYXBzOiBhZGROZXdMYXllcnNUb1NwbGl0TWFwKG1lcmdlZFN0YXRlLnNwbGl0TWFwcywgbmV3TGF5ZXJzKVxuICAgIH07XG4gIH1cblxuICAvLyBtZXJnZSBzdGF0ZSB3aXRoIHNhdmVkIGludGVyYWN0aW9uc1xuICBtZXJnZWRTdGF0ZSA9IG1lcmdlSW50ZXJhY3Rpb25zKG1lcmdlZFN0YXRlLCBpbnRlcmFjdGlvblRvQmVNZXJnZWQpO1xuXG4gIC8vIGlmIG5vIHRvb2x0aXBzIG1lcmdlZCBhZGQgZGVmYXVsdCB0b29sdGlwc1xuICBPYmplY3Qua2V5cyhuZXdEYXRlRW50cmllcykuZm9yRWFjaChkYXRhSWQgPT4ge1xuICAgIGNvbnN0IHRvb2x0aXBGaWVsZHMgPVxuICAgICAgbWVyZ2VkU3RhdGUuaW50ZXJhY3Rpb25Db25maWcudG9vbHRpcC5jb25maWcuZmllbGRzVG9TaG93W2RhdGFJZF07XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHRvb2x0aXBGaWVsZHMpIHx8ICF0b29sdGlwRmllbGRzLmxlbmd0aCkge1xuICAgICAgbWVyZ2VkU3RhdGUgPSBhZGREZWZhdWx0VG9vbHRpcHMobWVyZ2VkU3RhdGUsIG5ld0RhdGVFbnRyaWVzW2RhdGFJZF0pO1xuICAgIH1cbiAgfSk7XG5cbiAgY29uc3QgdmlzU3RhdGUgPSB1cGRhdGVBbGxMYXllckRvbWFpbkRhdGEoXG4gICAgbWVyZ2VkU3RhdGUsXG4gICAgT2JqZWN0LmtleXMobmV3RGF0ZUVudHJpZXMpXG4gICk7XG5cbiAgbGV0IGJvdW5kcztcbiAgaWYgKG9wdGlvbnMuY2VudGVyTWFwKSB7XG4gICAgLy8gZmluZCBtYXAgYm91bmRzIGZvciBuZXcgbGF5ZXJzXG4gICAgY29uc3QgbmV3TGF5ZXJzID0gdmlzU3RhdGUubGF5ZXJzLmZpbHRlcihsID0+ICFvbGRMYXllcnMuaW5jbHVkZXMobC5pZCkpO1xuICAgIGJvdW5kcyA9IGZpbmRNYXBCb3VuZHMobmV3TGF5ZXJzKTtcbiAgfVxuXG4gIC8vIGFjdGlvbiBpcyBiZWluZyBjb21wb3NlZCBpbiB0aGUgY29tYmluZSByZWR1Y2VyIGxldmVsIHRvIGZ1cnRoZXIgdXBkYXRlIG1hcCBib3VuZHNcbiAgcmV0dXJuIHt2aXNTdGF0ZSwgYm91bmRzfTtcbn07XG4vKiBlc2xpbnQtZW5hYmxlIG1heC1zdGF0ZW1lbnRzICovXG5cbmV4cG9ydCBjb25zdCByZXNldE1hcENvbmZpZ1VwZGF0ZXIgPSAoKSA9PiBjbG9uZURlZXAoSU5JVElBTF9WSVNfU1RBVEUpO1xuXG5leHBvcnQgY29uc3QgcmVjZWl2ZU1hcENvbmZpZ1VwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBpZiAoIWFjdGlvbi5wYXlsb2FkLnZpc1N0YXRlKSB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgY29uc3Qge1xuICAgIGZpbHRlcnMsXG4gICAgbGF5ZXJzLFxuICAgIGludGVyYWN0aW9uQ29uZmlnLFxuICAgIGxheWVyQmxlbmRpbmcsXG4gICAgc3BsaXRNYXBzXG4gIH0gPSBhY3Rpb24ucGF5bG9hZC52aXNTdGF0ZTtcblxuICAvLyBhbHdheXMgcmVzZXQgY29uZmlnIHdoZW4gcmVjZWl2ZSBhIG5ldyBjb25maWdcbiAgY29uc3QgcmVzZXRTdGF0ZSA9IHJlc2V0TWFwQ29uZmlnVXBkYXRlcigpO1xuICBsZXQgbWVyZ2VkU3RhdGUgPSB7XG4gICAgLi4ucmVzZXRTdGF0ZSxcbiAgICBzcGxpdE1hcHM6IHNwbGl0TWFwcyB8fCBbXSAvLyBtYXBzIGRvZXNuJ3QgcmVxdWlyZSBhbnkgbG9naWNcbiAgfTtcblxuICBtZXJnZWRTdGF0ZSA9IG1lcmdlRmlsdGVycyhtZXJnZWRTdGF0ZSwgZmlsdGVycyk7XG4gIG1lcmdlZFN0YXRlID0gbWVyZ2VMYXllcnMobWVyZ2VkU3RhdGUsIGxheWVycyk7XG4gIG1lcmdlZFN0YXRlID0gbWVyZ2VJbnRlcmFjdGlvbnMobWVyZ2VkU3RhdGUsIGludGVyYWN0aW9uQ29uZmlnKTtcbiAgbWVyZ2VkU3RhdGUgPSBtZXJnZUxheWVyQmxlbmRpbmcobWVyZ2VkU3RhdGUsIGxheWVyQmxlbmRpbmcpO1xuXG4gIHJldHVybiBtZXJnZWRTdGF0ZTtcbn07XG5cbmV4cG9ydCBjb25zdCBsYXllckhvdmVyVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgaG92ZXJJbmZvOiBhY3Rpb24uaW5mb1xufSk7XG5cbmV4cG9ydCBjb25zdCBsYXllckNsaWNrVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgY2xpY2tlZDogYWN0aW9uLmluZm8gJiYgYWN0aW9uLmluZm8ucGlja2VkID8gYWN0aW9uLmluZm8gOiBudWxsXG59KTtcblxuZXhwb3J0IGNvbnN0IG1hcENsaWNrVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgY2xpY2tlZDogbnVsbFxufSk7XG5cbmV4cG9ydCBjb25zdCB0b2dnbGVTcGxpdE1hcFVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT5cbiAgc3RhdGUuc3BsaXRNYXBzICYmIHN0YXRlLnNwbGl0TWFwcy5sZW5ndGggPT09IDBcbiAgICA/IHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIC8vIG1heWJlIHdlIHNob3VsZCB1c2UgYW4gYXJyYXkgdG8gc3RvcmUgc3RhdGUgZm9yIGEgc2luZ2xlIG1hcCBhcyB3ZWxsXG4gICAgICAgIC8vIGlmIGN1cnJlbnQgbWFwcyBsZW5ndGggaXMgZXF1YWwgdG8gMCBpdCBtZWFucyB0aGF0IHdlIGFyZSBhYm91dCB0byBzcGxpdCB0aGUgdmlld1xuICAgICAgICBzcGxpdE1hcHM6IGNvbXB1dGVTcGxpdE1hcExheWVycyhzdGF0ZS5sYXllcnMpXG4gICAgICB9XG4gICAgOiBjbG9zZVNwZWNpZmljTWFwQXRJbmRleChzdGF0ZSwgYWN0aW9uKTtcblxuLyoqXG4gKiBUaGlzIGlzIHRyaWdnZXJlZCB3aGVuIHZpZXcgaXMgc3BsaXQgaW50byBtdWx0aXBsZSBtYXBzLlxuICogSXQgd2lsbCBvbmx5IHVwZGF0ZSBsYXllcnMgdGhhdCBiZWxvbmcgdG8gdGhlIG1hcCBsYXllciBkcm9wZG93blxuICogdGhlIHVzZXIgaXMgaW50ZXJhY3Rpbmcgd2l0XG4gKiBAcGFyYW0gc3RhdGVcbiAqIEBwYXJhbSBhY3Rpb25cbiAqL1xuZXhwb3J0IGNvbnN0IHNldFZpc2libGVMYXllcnNGb3JNYXBVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgY29uc3Qge21hcEluZGV4LCBsYXllcklkc30gPSBhY3Rpb247XG4gIGlmICghbGF5ZXJJZHMpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICBjb25zdCB7c3BsaXRNYXBzID0gW119ID0gc3RhdGU7XG5cbiAgaWYgKHNwbGl0TWFwcy5sZW5ndGggPT09IDApIHtcbiAgICAvLyB3ZSBzaG91bGQgbmV2ZXIgZ2V0IGludG8gdGhpcyBzdGF0ZVxuICAgIC8vIGJlY2F1c2UgdGhpcyBhY3Rpb24gc2hvdWxkIG9ubHkgYmUgdHJpZ2dlcmVkXG4gICAgLy8gd2hlbiBtYXAgdmlldyBpcyBzcGxpdFxuICAgIC8vIGJ1dCBzb21ldGhpbmcgbWF5IGhhdmUgaGFwcGVuZWRcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICAvLyBuZWVkIHRvIGNoZWNrIGlmIG1hcHMgaXMgcG9wdWxhdGVkIG90aGVyd2lzZSB3aWxsIGNyZWF0ZVxuICBjb25zdCB7W21hcEluZGV4XTogbWFwID0ge319ID0gc3BsaXRNYXBzO1xuXG4gIGNvbnN0IGxheWVycyA9IG1hcC5sYXllcnMgfHwgW107XG5cbiAgLy8gd2Ugc2V0IHZpc2liaWxpdHkgdG8gdHJ1ZSBmb3IgYWxsIGxheWVycyBpbmNsdWRlZCBpbiBvdXIgaW5wdXQgbGlzdFxuICBjb25zdCBuZXdMYXllcnMgPSAoT2JqZWN0LmtleXMobGF5ZXJzKSB8fCBbXSkucmVkdWNlKChjdXJyZW50TGF5ZXJzLCBpZHgpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uY3VycmVudExheWVycyxcbiAgICAgIFtpZHhdOiB7XG4gICAgICAgIC4uLmxheWVyc1tpZHhdLFxuICAgICAgICBpc1Zpc2libGU6IGxheWVySWRzLmluY2x1ZGVzKGlkeClcbiAgICAgIH1cbiAgICB9O1xuICB9LCB7fSk7XG5cbiAgY29uc3QgbmV3TWFwcyA9IFsuLi5zcGxpdE1hcHNdO1xuXG4gIG5ld01hcHNbbWFwSW5kZXhdID0ge1xuICAgIC4uLnNwbGl0TWFwc1ttYXBJbmRleF0sXG4gICAgbGF5ZXJzOiBuZXdMYXllcnNcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIHNwbGl0TWFwczogbmV3TWFwc1xuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IHRvZ2dsZUxheWVyRm9yTWFwVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIGlmICghc3RhdGUuc3BsaXRNYXBzW2FjdGlvbi5tYXBJbmRleF0pIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICBjb25zdCBtYXBTZXR0aW5ncyA9IHN0YXRlLnNwbGl0TWFwc1thY3Rpb24ubWFwSW5kZXhdO1xuICBjb25zdCB7bGF5ZXJzfSA9IG1hcFNldHRpbmdzO1xuICBpZiAoIWxheWVycyB8fCAhbGF5ZXJzW2FjdGlvbi5sYXllcklkXSkge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIGNvbnN0IGxheWVyID0gbGF5ZXJzW2FjdGlvbi5sYXllcklkXTtcblxuICBjb25zdCBuZXdMYXllciA9IHtcbiAgICAuLi5sYXllcixcbiAgICBpc1Zpc2libGU6ICFsYXllci5pc1Zpc2libGVcbiAgfTtcblxuICBjb25zdCBuZXdMYXllcnMgPSB7XG4gICAgLi4ubGF5ZXJzLFxuICAgIFthY3Rpb24ubGF5ZXJJZF06IG5ld0xheWVyXG4gIH07XG5cbiAgLy8gY29uc3Qgc3BsaXRNYXBzID0gc3RhdGUuc3BsaXRNYXBzO1xuICBjb25zdCBuZXdTcGxpdE1hcHMgPSBbLi4uc3RhdGUuc3BsaXRNYXBzXTtcbiAgbmV3U3BsaXRNYXBzW2FjdGlvbi5tYXBJbmRleF0gPSB7XG4gICAgLi4ubWFwU2V0dGluZ3MsXG4gICAgbGF5ZXJzOiBuZXdMYXllcnNcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIHNwbGl0TWFwczogbmV3U3BsaXRNYXBzXG4gIH07XG59O1xuXG5mdW5jdGlvbiBnZW5lcmF0ZUxheWVyTWV0YUZvclNwbGl0Vmlld3MobGF5ZXIpIHtcbiAgcmV0dXJuIHtcbiAgICBpc0F2YWlsYWJsZTogbGF5ZXIuY29uZmlnLmlzVmlzaWJsZSxcbiAgICBpc1Zpc2libGU6IGxheWVyLmNvbmZpZy5pc1Zpc2libGVcbiAgfTtcbn1cblxuLyoqXG4gKiBUaGlzIGVtdGhvZCB3aWxsIGNvbXB1dGUgdGhlIGRlZmF1bHQgbWFwcyBjdXN0b20gbGlzdFxuICogYmFzZWQgb24gdGhlIGN1cnJlbnQgbGF5ZXJzIHN0YXR1c1xuICogQHBhcmFtIGxheWVyc1xuICogQHJldHVybnMge1sqLCpdfVxuICovXG5mdW5jdGlvbiBjb21wdXRlU3BsaXRNYXBMYXllcnMobGF5ZXJzKSB7XG4gIGNvbnN0IG1hcExheWVycyA9IGxheWVycy5yZWR1Y2UoXG4gICAgKG5ld0xheWVycywgY3VycmVudExheWVyKSA9PiAoe1xuICAgICAgLi4ubmV3TGF5ZXJzLFxuICAgICAgW2N1cnJlbnRMYXllci5pZF06IGdlbmVyYXRlTGF5ZXJNZXRhRm9yU3BsaXRWaWV3cyhjdXJyZW50TGF5ZXIpXG4gICAgfSksXG4gICAge31cbiAgKTtcbiAgcmV0dXJuIFtcbiAgICB7XG4gICAgICBsYXllcnM6IG1hcExheWVyc1xuICAgIH0sXG4gICAge1xuICAgICAgbGF5ZXJzOiBtYXBMYXllcnNcbiAgICB9XG4gIF07XG59XG5cbi8qKlxuICogUmVtb3ZlIGFuIGV4aXN0aW5nIGxheWVycyBmcm9tIGN1c3RvbSBtYXAgbGF5ZXIgb2JqZWN0c1xuICogQHBhcmFtIHN0YXRlXG4gKiBAcGFyYW0gbGF5ZXJcbiAqIEByZXR1cm5zIHtbKiwqXX0gTWFwcyBvZiBjdXN0b20gbGF5ZXIgb2JqZWN0c1xuICovXG5mdW5jdGlvbiByZW1vdmVMYXllckZyb21TcGxpdE1hcHMoc3RhdGUsIGxheWVyKSB7XG4gIHJldHVybiBzdGF0ZS5zcGxpdE1hcHMubWFwKHNldHRpbmdzID0+IHtcbiAgICBjb25zdCB7bGF5ZXJzfSA9IHNldHRpbmdzO1xuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4gICAgY29uc3Qge1tsYXllci5pZF06IF8sIC4uLm5ld0xheWVyc30gPSBsYXllcnM7XG4gICAgLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zZXR0aW5ncyxcbiAgICAgIGxheWVyczogbmV3TGF5ZXJzXG4gICAgfTtcbiAgfSk7XG59XG5cbi8qKlxuICogQWRkIG5ldyBsYXllcnMgdG8gYm90aCBleGlzdGluZyBtYXBzXG4gKiBAcGFyYW0gc3BsaXRNYXBzXG4gKiBAcGFyYW0gbGF5ZXJzXG4gKiBAcmV0dXJucyB7WyosKl19IG5ldyBzcGxpdE1hcHNcbiAqL1xuZnVuY3Rpb24gYWRkTmV3TGF5ZXJzVG9TcGxpdE1hcChzcGxpdE1hcHMsIGxheWVycykge1xuICBjb25zdCBuZXdMYXllcnMgPSBBcnJheS5pc0FycmF5KGxheWVycykgPyBsYXllcnMgOiBbbGF5ZXJzXTtcblxuICBpZiAoIXNwbGl0TWFwcyB8fCAhc3BsaXRNYXBzLmxlbmd0aCB8fCAhbmV3TGF5ZXJzLmxlbmd0aCkge1xuICAgIHJldHVybiBzcGxpdE1hcHM7XG4gIH1cblxuICAvLyBhZGQgbmV3IGxheWVyIHRvIGJvdGggbWFwcyxcbiAgLy8gIGRvbid0IG92ZXJyaWRlLCBpZiBsYXllci5pZCBpcyBhbHJlYWR5IGluIHNwbGl0TWFwcy5zZXR0aW5ncy5sYXllcnNcbiAgcmV0dXJuIHNwbGl0TWFwcy5tYXAoc2V0dGluZ3MgPT4gKHtcbiAgICAuLi5zZXR0aW5ncyxcbiAgICBsYXllcnM6IHtcbiAgICAgIC4uLnNldHRpbmdzLmxheWVycyxcbiAgICAgIC4uLm5ld0xheWVycy5yZWR1Y2UoXG4gICAgICAgIChhY2N1LCBuZXdMYXllcikgPT5cbiAgICAgICAgICBuZXdMYXllci5jb25maWcuaXNWaXNpYmxlXG4gICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAuLi5hY2N1LFxuICAgICAgICAgICAgICAgIFtuZXdMYXllci5pZF06IHNldHRpbmdzLmxheWVyc1tuZXdMYXllci5pZF1cbiAgICAgICAgICAgICAgICAgID8gc2V0dGluZ3MubGF5ZXJzW25ld0xheWVyLmlkXVxuICAgICAgICAgICAgICAgICAgOiBnZW5lcmF0ZUxheWVyTWV0YUZvclNwbGl0Vmlld3MobmV3TGF5ZXIpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDogYWNjdSxcbiAgICAgICAge31cbiAgICAgIClcbiAgICB9XG4gIH0pKTtcbn1cblxuLyoqXG4gKiBIaWRlIGFuIGV4aXN0aW5nIGxheWVycyBmcm9tIGN1c3RvbSBtYXAgbGF5ZXIgb2JqZWN0c1xuICogQHBhcmFtIHN0YXRlXG4gKiBAcGFyYW0gbGF5ZXJcbiAqIEByZXR1cm5zIHtbKiwqXX0gTWFwcyBvZiBjdXN0b20gbGF5ZXIgb2JqZWN0c1xuICovXG5mdW5jdGlvbiB0b2dnbGVMYXllckZyb21TcGxpdE1hcHMoc3RhdGUsIGxheWVyKSB7XG4gIHJldHVybiBzdGF0ZS5zcGxpdE1hcHMubWFwKHNldHRpbmdzID0+IHtcbiAgICBjb25zdCB7bGF5ZXJzfSA9IHNldHRpbmdzO1xuICAgIGNvbnN0IG5ld0xheWVycyA9IHtcbiAgICAgIC4uLmxheWVycyxcbiAgICAgIFtsYXllci5pZF06IGdlbmVyYXRlTGF5ZXJNZXRhRm9yU3BsaXRWaWV3cyhsYXllcilcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnNldHRpbmdzLFxuICAgICAgbGF5ZXJzOiBuZXdMYXllcnNcbiAgICB9O1xuICB9KTtcbn1cblxuLyoqXG4gKiBXaGVuIGEgdXNlciBjbGlja3Mgb24gdGhlIHNwZWNpZmljIG1hcCBjbG9zaW5nIGljb25cbiAqIHRoZSBhcHBsaWNhdGlvbiB3aWxsIGNsb3NlIHRoZSBzZWxlY3RlZCBtYXBcbiAqIGFuZCB3aWxsIG1lcmdlIHRoZSByZW1haW5pbmcgb25lIHdpdGggdGhlIGdsb2JhbCBzdGF0ZVxuICogVE9ETzogaSB0aGluayBpbiB0aGUgZnV0dXJlIHRoaXMgYWN0aW9uIHNob3VsZCBiZSBjYWxsZWQgbWVyZ2UgbWFwIGxheWVycyB3aXRoIGdsb2JhbCBzZXR0aW5nc1xuICogQHBhcmFtIHN0YXRlXG4gKiBAcGFyYW0gYWN0aW9uXG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuZnVuY3Rpb24gY2xvc2VTcGVjaWZpY01hcEF0SW5kZXgoc3RhdGUsIGFjdGlvbikge1xuICAvLyByZXRyaWV2ZSBsYXllcnMgbWV0YSBkYXRhIGZyb20gdGhlIHJlbWFpbmluZyBtYXAgdGhhdCB3ZSBuZWVkIHRvIGtlZXBcbiAgY29uc3QgaW5kZXhUb1JldHJpZXZlID0gMSAtIGFjdGlvbi5wYXlsb2FkO1xuXG4gIGNvbnN0IG1ldGFTZXR0aW5ncyA9IHN0YXRlLnNwbGl0TWFwc1tpbmRleFRvUmV0cmlldmVdO1xuICBpZiAoIW1ldGFTZXR0aW5ncyB8fCAhbWV0YVNldHRpbmdzLmxheWVycykge1xuICAgIC8vIGlmIHdlIGNhbid0IGZpbmQgdGhlIG1ldGEgc2V0dGluZ3Mgd2Ugc2ltcGx5IGNsZWFuIHVwIHNwbGl0TWFwcyBhbmRcbiAgICAvLyBrZWVwIGdsb2JhbCBzdGF0ZSBhcyBpdCBpc1xuICAgIC8vIGJ1dCB3aHkgZG9lcyB0aGlzIGV2ZXIgaGFwcGVuP1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIHNwbGl0TWFwczogW11cbiAgICB9O1xuICB9XG5cbiAgY29uc3Qge2xheWVyc30gPSBzdGF0ZTtcblxuICAvLyB1cGRhdGUgbGF5ZXIgdmlzaWJpbGl0eVxuICBjb25zdCBuZXdMYXllcnMgPSBsYXllcnMubWFwKGxheWVyID0+XG4gICAgbGF5ZXIudXBkYXRlTGF5ZXJDb25maWcoe1xuICAgICAgaXNWaXNpYmxlOiBtZXRhU2V0dGluZ3MubGF5ZXJzW2xheWVyLmlkXVxuICAgICAgICA/IG1ldGFTZXR0aW5ncy5sYXllcnNbbGF5ZXIuaWRdLmlzVmlzaWJsZVxuICAgICAgICA6IGxheWVyLmNvbmZpZy5pc1Zpc2libGVcbiAgICB9KVxuICApO1xuXG4gIC8vIGRlbGV0ZSBtYXBcbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBsYXllcnM6IG5ld0xheWVycyxcbiAgICBzcGxpdE1hcHM6IFtdXG4gIH07XG59XG5cbi8vIFRPRE86IHJlZG8gd3JpdGUgaGFuZGxlciB0byBub3QgdXNlIHRhc2tzXG5leHBvcnQgY29uc3QgbG9hZEZpbGVzVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIGNvbnN0IHtmaWxlc30gPSBhY3Rpb247XG4gIGNvbnN0IGZpbGVzVG9Mb2FkID0gZmlsZXMubWFwKGZpbGVCbG9iID0+ICh7XG4gICAgZmlsZUJsb2IsXG4gICAgaW5mbzoge1xuICAgICAgaWQ6IGdlbmVyYXRlSGFzaElkKDQpLFxuICAgICAgbGFiZWw6IGZpbGVCbG9iLm5hbWUsXG4gICAgICBzaXplOiBmaWxlQmxvYi5zaXplXG4gICAgfSxcbiAgICBoYW5kbGVyOiBnZXRGaWxlSGFuZGxlcihmaWxlQmxvYilcbiAgfSkpO1xuXG4gIC8vIHJlYWRlciAtPiBwYXJzZXIgLT4gYXVnbWVudCAtPiByZWNlaXZlVmlzRGF0YVxuICBjb25zdCBsb2FkRmlsZVRhc2tzID0gW1xuICAgIFRhc2suYWxsKGZpbGVzVG9Mb2FkLm1hcChMT0FEX0ZJTEVfVEFTSykpLmJpbWFwKFxuICAgICAgcmVzdWx0cyA9PiB1cGRhdGVWaXNEYXRhKHJlc3VsdHMsIHtjZW50ZXJNYXA6IHRydWV9KSxcbiAgICAgIGVycm9yID0+IGxvYWRGaWxlc0VycihlcnJvcilcbiAgICApXG4gIF07XG5cbiAgcmV0dXJuIHdpdGhUYXNrKFxuICAgIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgZmlsZUxvYWRpbmc6IHRydWVcbiAgICB9LFxuICAgIGxvYWRGaWxlVGFza3NcbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBsb2FkRmlsZXNFcnJVcGRhdGVyID0gKHN0YXRlLCB7ZXJyb3J9KSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgZmlsZUxvYWRpbmc6IGZhbHNlLFxuICBmaWxlTG9hZGluZ0VycjogZXJyb3Jcbn0pO1xuXG4vKipcbiAqIGhlbHBlciBmdW5jdGlvbiB0byB1cGRhdGUgQWxsIGxheWVyIGRvbWFpbiBhbmQgbGF5ZXIgZGF0YSBvZiBzdGF0ZVxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBzdGF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGFzZXRzXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBzdGF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkRGVmYXVsdExheWVycyhzdGF0ZSwgZGF0YXNldHMpIHtcbiAgY29uc3QgZGVmYXVsdExheWVycyA9IE9iamVjdC52YWx1ZXMoZGF0YXNldHMpLnJlZHVjZShcbiAgICAoYWNjdSwgZGF0YXNldCkgPT4gWy4uLmFjY3UsIC4uLihmaW5kRGVmYXVsdExheWVyKGRhdGFzZXQpIHx8IFtdKV0sXG4gICAgW11cbiAgKTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGxheWVyczogWy4uLnN0YXRlLmxheWVycywgLi4uZGVmYXVsdExheWVyc10sXG4gICAgbGF5ZXJPcmRlcjogW1xuICAgICAgLy8gcHV0IG5ldyBsYXllcnMgb24gdG9wIG9mIG9sZCBvbmVzXG4gICAgICAuLi5kZWZhdWx0TGF5ZXJzLm1hcCgoXywgaSkgPT4gc3RhdGUubGF5ZXJzLmxlbmd0aCArIGkpLFxuICAgICAgLi4uc3RhdGUubGF5ZXJPcmRlclxuICAgIF1cbiAgfTtcbn1cblxuLyoqXG4gKiBoZWxwZXIgZnVuY3Rpb24gdG8gZmluZCBkZWZhdWx0IHRvb2x0aXBzXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHN0YXRlXG4gKiBAcGFyYW0ge29iamVjdH0gZGF0YXNldFxuICogQHJldHVybnMge29iamVjdH0gc3RhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZERlZmF1bHRUb29sdGlwcyhzdGF0ZSwgZGF0YXNldCkge1xuICBjb25zdCB0b29sdGlwRmllbGRzID0gZmluZEZpZWxkc1RvU2hvdyhkYXRhc2V0KTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGludGVyYWN0aW9uQ29uZmlnOiB7XG4gICAgICAuLi5zdGF0ZS5pbnRlcmFjdGlvbkNvbmZpZyxcbiAgICAgIHRvb2x0aXA6IHtcbiAgICAgICAgLi4uc3RhdGUuaW50ZXJhY3Rpb25Db25maWcudG9vbHRpcCxcbiAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgLy8gZmluZCBkZWZhdWx0IGZpZWxkcyB0byBzaG93IGluIHRvb2x0aXBcbiAgICAgICAgICBmaWVsZHNUb1Nob3c6IHtcbiAgICAgICAgICAgIC4uLnN0YXRlLmludGVyYWN0aW9uQ29uZmlnLnRvb2x0aXAuY29uZmlnLmZpZWxkc1RvU2hvdyxcbiAgICAgICAgICAgIC4uLnRvb2x0aXBGaWVsZHNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogaGVscGVyIGZ1bmN0aW9uIHRvIHVwZGF0ZSBsYXllciBkb21haW5zIGZvciBhbiBhcnJheSBvZiBkYXRzZXRzXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHN0YXRlXG4gKiBAcGFyYW0ge2FycmF5IHwgc3RyaW5nfSBkYXRhSWRcbiAqIEByZXR1cm5zIHtvYmplY3R9IHN0YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVBbGxMYXllckRvbWFpbkRhdGEoc3RhdGUsIGRhdGFJZCkge1xuICBjb25zdCBkYXRhSWRzID0gdHlwZW9mIGRhdGFJZCA9PT0gJ3N0cmluZycgPyBbZGF0YUlkXSA6IGRhdGFJZDtcbiAgY29uc3QgbmV3TGF5ZXJzID0gW107XG4gIGNvbnN0IG5ld0xheWVyRGF0YXMgPSBbXTtcblxuICBzdGF0ZS5sYXllcnMuZm9yRWFjaCgob2xkTGF5ZXIsIGkpID0+IHtcbiAgICBpZiAob2xkTGF5ZXIuY29uZmlnLmRhdGFJZCAmJiBkYXRhSWRzLmluY2x1ZGVzKG9sZExheWVyLmNvbmZpZy5kYXRhSWQpKSB7XG4gICAgICBjb25zdCBuZXdMYXllciA9IG9sZExheWVyLnVwZGF0ZUxheWVyRG9tYWluKFxuICAgICAgICBzdGF0ZS5kYXRhc2V0c1tvbGRMYXllci5jb25maWcuZGF0YUlkXVxuICAgICAgKTtcbiAgICAgIGNvbnN0IHtsYXllckRhdGEsIGxheWVyfSA9IGNhbGN1bGF0ZUxheWVyRGF0YShcbiAgICAgICAgbmV3TGF5ZXIsXG4gICAgICAgIHN0YXRlLFxuICAgICAgICBzdGF0ZS5sYXllckRhdGFbaV1cbiAgICAgICk7XG5cbiAgICAgIG5ld0xheWVycy5wdXNoKGxheWVyKTtcbiAgICAgIG5ld0xheWVyRGF0YXMucHVzaChsYXllckRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdMYXllcnMucHVzaChvbGRMYXllcik7XG4gICAgICBuZXdMYXllckRhdGFzLnB1c2goc3RhdGUubGF5ZXJEYXRhW2ldKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgbGF5ZXJzOiBuZXdMYXllcnMsXG4gICAgbGF5ZXJEYXRhOiBuZXdMYXllckRhdGFzXG4gIH07XG59XG4iXX0=