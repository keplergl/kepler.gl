'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadFilesErrUpdater = exports.loadFilesUpdater = exports.updateVisDataUpdater = exports.toggleLayerForMapUpdater = exports.setVisibleLayersForMapUpdater = exports.toggleSplitMapUpdater = exports.mapClickUpdater = exports.layerClickUpdater = exports.layerHoverUpdater = exports.receiveMapConfigUpdater = exports.resetMapConfigUpdater = exports.showDatasetTableUpdater = exports.updateLayerBlendingUpdater = exports.removeDatasetUpdater = exports.reorderLayerUpdater = exports.removeLayerUpdater = exports.addLayerUpdater = exports.removeFilterUpdater = exports.enlargeFilterUpdater = exports.updateAnimationSpeedUpdater = exports.toggleFilterAnimationUpdater = exports.addFilterUpdater = exports.setFilterPlotUpdater = exports.INITIAL_VIS_STATE = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _visStateMerger = require('./vis-state-merger');

var _keplerglLayers = require('../keplergl-layers');

var KeplerGLLayers = _interopRequireWildcard(_keplerglLayers);

var _defaultSettings = require('../constants/default-settings');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Utils


// Tasks
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

// Actions


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
        var _settings$layers = settings.layers,
            oldLayerMap = _settings$layers[oldId],
            otherLayers = (0, _objectWithoutProperties3.default)(_settings$layers, [oldId]);

        return (0, _extends14.default)({}, settings, {
          layers: (0, _extends14.default)({}, otherLayers, (0, _defineProperty3.default)({}, layer.id, oldLayerMap))
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
  var config = action.config;


  var interactionConfig = (0, _extends14.default)({}, state.interactionConfig, (0, _defineProperty3.default)({}, config.id, config));

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
  var idx = action.idx,
      prop = action.prop,
      value = action.value;

  var newState = state;
  var newFilter = (0, _extends14.default)({}, state.filters[idx], (0, _defineProperty3.default)({}, prop, value));

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
        datasets: (0, _extends14.default)({}, state.datasets, (0, _defineProperty3.default)({}, dataId, (0, _extends14.default)({}, state.datasets[dataId], {
          fields: fields.map(function (d, i) {
            return i === fieldIdx ? field : d;
          })
        })))
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
    datasets: (0, _extends14.default)({}, newState.datasets, (0, _defineProperty3.default)({}, dataId, (0, _extends14.default)({}, newState.datasets[dataId], (0, _filterUtils.filterData)(allData, dataId, newState.filters))))
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
    filters: [].concat((0, _toConsumableArray3.default)(state.filters), [(0, _filterUtils.getDefaultfilter)(action.dataId)])
  });
};

var toggleFilterAnimationUpdater = exports.toggleFilterAnimationUpdater = function toggleFilterAnimationUpdater(state, action) {
  return (0, _extends14.default)({}, state, {
    filters: state.filters.map(function (f, i) {
      return i === action.idx ? (0, _extends14.default)({}, f, { isAnimating: !f.isAnimating }) : f;
    })
  });
};

var updateAnimationSpeedUpdater = exports.updateAnimationSpeedUpdater = function updateAnimationSpeedUpdater(state, action) {
  return (0, _extends14.default)({}, state, {
    filters: state.filters.map(function (f, i) {
      return i === action.idx ? (0, _extends14.default)({}, f, { speed: action.speed }) : f;
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
  var idx = action.idx;
  var dataId = state.filters[idx].dataId;


  var newFilters = [].concat((0, _toConsumableArray3.default)(state.filters.slice(0, idx)), (0, _toConsumableArray3.default)(state.filters.slice(idx + 1, state.filters.length)));

  var newState = (0, _extends14.default)({}, state, {
    datasets: (0, _extends14.default)({}, state.datasets, (0, _defineProperty3.default)({}, dataId, (0, _extends14.default)({}, state.datasets[dataId], (0, _filterUtils.filterData)(state.datasets[dataId].allData, dataId, newFilters)))),
    filters: newFilters
  });

  return updateAllLayerDomainData(newState, dataId);
};

var addLayerUpdater = exports.addLayerUpdater = function addLayerUpdater(state, action) {
  var defaultDataset = Object.keys(state.datasets)[0];
  var newLayer = new KeplerGLLayers.Layer((0, _extends14.default)({
    isVisible: true,
    isConfigActive: true,
    dataId: defaultDataset
  }, action.props));

  return (0, _extends14.default)({}, state, {
    layers: [].concat((0, _toConsumableArray3.default)(state.layers), [newLayer]),
    layerData: [].concat((0, _toConsumableArray3.default)(state.layerData), [{}]),
    layerOrder: [].concat((0, _toConsumableArray3.default)(state.layerOrder), [state.layerOrder.length]),
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
    layers: [].concat((0, _toConsumableArray3.default)(layers.slice(0, idx)), (0, _toConsumableArray3.default)(layers.slice(idx + 1, layers.length))),
    layerData: [].concat((0, _toConsumableArray3.default)(layerData.slice(0, idx)), (0, _toConsumableArray3.default)(layerData.slice(idx + 1, layerData.length))),
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

var resetMapConfigUpdater = exports.resetMapConfigUpdater = function resetMapConfigUpdater() {
  return (0, _lodash2.default)(INITIAL_VIS_STATE);
};

/**
 * Loads custom configuration into state
 * @param state
 * @param action
 * @returns {*}
 */
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

  // const newState ={
  //   ...resetState,
  //   ...mergeFilters(mergedState, filters),
  //   ...mergeLayers(mergedState, layers),
  //   ...mergeInteractions(mergedState, interactionConfig),
  //   ...mergeLayerBlending(mergedState, layerBlending)
  // };

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
    return (0, _extends14.default)({}, currentLayers, (0, _defineProperty3.default)({}, idx, (0, _extends14.default)({}, layers[idx], {
      isVisible: layerIds.includes(idx)
    })));
  }, {});

  var newMaps = [].concat((0, _toConsumableArray3.default)(splitMaps));

  newMaps[mapIndex] = (0, _extends14.default)({}, splitMaps[mapIndex], {
    layers: newLayers
  });

  return (0, _extends14.default)({}, state, {
    splitMaps: newMaps
  });
};

var toggleLayerForMapUpdater = exports.toggleLayerForMapUpdater = function toggleLayerForMapUpdater(state, action) {
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

  var newLayers = (0, _extends14.default)({}, layers, (0, _defineProperty3.default)({}, action.layerId, newLayer));

  // const splitMaps = state.splitMaps;
  var newSplitMaps = [].concat((0, _toConsumableArray3.default)(state.splitMaps));
  newSplitMaps[action.mapIndex] = (0, _extends14.default)({}, mapSettings, {
    layers: newLayers
  });

  return (0, _extends14.default)({}, state, {
    splitMaps: newSplitMaps
  });
};

/* eslint-disable max-statements */
var updateVisDataUpdater = exports.updateVisDataUpdater = function updateVisDataUpdater(state, action) {
  // datasets can be a single data entries or an array of multiple data entries
  var datasets = Array.isArray(action.datasets) ? action.datasets : [action.datasets];

  if (action.config) {
    // apply config if passed from action
    state = receiveMapConfigUpdater(state, { payload: { visState: action.config } });
  }

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

  return updateAllLayerDomainData(mergedState, Object.keys(newDateEntries));
};
/* eslint-enable max-statements */

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
    return (0, _extends14.default)({}, newLayers, (0, _defineProperty3.default)({}, currentLayer.id, generateLayerMetaForSplitViews(currentLayer)));
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
        return newLayer.config.isVisible ? (0, _extends14.default)({}, accu, (0, _defineProperty3.default)({}, newLayer.id, settings.layers[newLayer.id] ? settings.layers[newLayer.id] : generateLayerMetaForSplitViews(newLayer))) : accu;
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
    var layers = settings.layers;

    var newLayers = (0, _extends14.default)({}, layers, (0, _defineProperty3.default)({}, layer.id, generateLayerMetaForSplitViews(layer)));

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
    return [].concat((0, _toConsumableArray3.default)(accu), (0, _toConsumableArray3.default)((0, _layerUtils.findDefaultLayer)(dataset) || []));
  }, []);

  return (0, _extends14.default)({}, state, {
    layers: [].concat((0, _toConsumableArray3.default)(state.layers), (0, _toConsumableArray3.default)(defaultLayers)),
    layerOrder: [].concat((0, _toConsumableArray3.default)(defaultLayers.map(function (_, i) {
      return state.layers.length + i;
    })), (0, _toConsumableArray3.default)(state.layerOrder))
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy92aXMtc3RhdGUtdXBkYXRlcnMuanMiXSwibmFtZXMiOlsibGF5ZXJDb25maWdDaGFuZ2VVcGRhdGVyIiwibGF5ZXJUeXBlQ2hhbmdlVXBkYXRlciIsImxheWVyVmlzdWFsQ2hhbm5lbENoYW5nZVVwZGF0ZXIiLCJsYXllclZpc0NvbmZpZ0NoYW5nZVVwZGF0ZXIiLCJpbnRlcmFjdGlvbkNvbmZpZ0NoYW5nZVVwZGF0ZXIiLCJzZXRGaWx0ZXJVcGRhdGVyIiwiYWRkRGVmYXVsdExheWVycyIsImFkZERlZmF1bHRUb29sdGlwcyIsInVwZGF0ZUFsbExheWVyRG9tYWluRGF0YSIsIktlcGxlckdMTGF5ZXJzIiwiSU5JVElBTF9WSVNfU1RBVEUiLCJsYXllcnMiLCJsYXllckRhdGEiLCJsYXllclRvQmVNZXJnZWQiLCJsYXllck9yZGVyIiwiZmlsdGVycyIsImZpbHRlclRvQmVNZXJnZWQiLCJkYXRhc2V0cyIsImVkaXRpbmdEYXRhc2V0IiwidW5kZWZpbmVkIiwiaW50ZXJhY3Rpb25Db25maWciLCJpbnRlcmFjdGlvblRvQmVNZXJnZWQiLCJsYXllckJsZW5kaW5nIiwiaG92ZXJJbmZvIiwiY2xpY2tlZCIsImZpbGVMb2FkaW5nIiwiZmlsZUxvYWRpbmdFcnIiLCJzcGxpdE1hcHMiLCJ1cGRhdGVTdGF0ZVdpdGhMYXllckFuZERhdGEiLCJzdGF0ZSIsImxheWVyIiwiaWR4IiwibWFwIiwibHlyIiwiaSIsImQiLCJhY3Rpb24iLCJvbGRMYXllciIsImZpbmRJbmRleCIsImwiLCJpZCIsInByb3BzIiwiT2JqZWN0Iiwia2V5cyIsIm5ld0NvbmZpZyIsIm5ld0xheWVyIiwidXBkYXRlTGF5ZXJDb25maWciLCJzaG91bGRDYWxjdWxhdGVMYXllckRhdGEiLCJvbGRMYXllckRhdGEiLCJzYW1lRGF0YSIsIm5ld1N0YXRlIiwidG9nZ2xlTGF5ZXJGcm9tU3BsaXRNYXBzIiwibmV3VHlwZSIsIm9sZElkIiwiZXJyb3IiLCJMYXllckNsYXNzIiwiY29uZmlnIiwiYXNzaWduQ29uZmlnVG9MYXllciIsInNldHRpbmdzIiwib2xkTGF5ZXJNYXAiLCJvdGhlckxheWVycyIsImNoYW5uZWwiLCJkYXRhSWQiLCJkYXRhIiwiYWxsRGF0YSIsInVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbCIsIm5ld1Zpc0NvbmZpZyIsInZpc0NvbmZpZyIsImVuYWJsZWQiLCJmb3JFYWNoIiwiayIsInByb3AiLCJ2YWx1ZSIsIm5ld0ZpbHRlciIsImZpZWxkcyIsImZpZWxkSWR4IiwiZiIsIm5hbWUiLCJmaWVsZCIsImZpbHRlclByb3AiLCJmcmVlemUiLCJzZXRGaWx0ZXJQbG90VXBkYXRlciIsIm5ld1Byb3AiLCJwbG90VHlwZSIsImFkZEZpbHRlclVwZGF0ZXIiLCJ0b2dnbGVGaWx0ZXJBbmltYXRpb25VcGRhdGVyIiwiaXNBbmltYXRpbmciLCJ1cGRhdGVBbmltYXRpb25TcGVlZFVwZGF0ZXIiLCJzcGVlZCIsImVubGFyZ2VGaWx0ZXJVcGRhdGVyIiwiaXNFbmxhcmdlZCIsImVubGFyZ2VkIiwicmVtb3ZlRmlsdGVyVXBkYXRlciIsIm5ld0ZpbHRlcnMiLCJzbGljZSIsImxlbmd0aCIsImFkZExheWVyVXBkYXRlciIsImRlZmF1bHREYXRhc2V0IiwiTGF5ZXIiLCJpc1Zpc2libGUiLCJpc0NvbmZpZ0FjdGl2ZSIsImFkZE5ld0xheWVyc1RvU3BsaXRNYXAiLCJyZW1vdmVMYXllclVwZGF0ZXIiLCJsYXllclRvUmVtb3ZlIiwibmV3TWFwcyIsInJlbW92ZUxheWVyRnJvbVNwbGl0TWFwcyIsImZpbHRlciIsInBpZCIsImlzTGF5ZXJIb3ZlcmVkIiwicmVvcmRlckxheWVyVXBkYXRlciIsIm9yZGVyIiwicmVtb3ZlRGF0YXNldFVwZGF0ZXIiLCJkYXRhc2V0S2V5Iiwia2V5IiwiZGF0YXNldCIsIm5ld0RhdGFzZXRzIiwiaW5kZXhlcyIsInJlZHVjZSIsImxpc3RPZkluZGV4ZXMiLCJpbmRleCIsInB1c2giLCJjdXJyZW50U3RhdGUiLCJpbmRleENvdW50ZXIiLCJjdXJyZW50SW5kZXgiLCJ0b29sdGlwIiwiZmllbGRzVG9TaG93IiwidXBkYXRlTGF5ZXJCbGVuZGluZ1VwZGF0ZXIiLCJtb2RlIiwic2hvd0RhdGFzZXRUYWJsZVVwZGF0ZXIiLCJyZXNldE1hcENvbmZpZ1VwZGF0ZXIiLCJyZWNlaXZlTWFwQ29uZmlnVXBkYXRlciIsInBheWxvYWQiLCJ2aXNTdGF0ZSIsInJlc2V0U3RhdGUiLCJtZXJnZWRTdGF0ZSIsImxheWVySG92ZXJVcGRhdGVyIiwiaW5mbyIsImxheWVyQ2xpY2tVcGRhdGVyIiwicGlja2VkIiwibWFwQ2xpY2tVcGRhdGVyIiwidG9nZ2xlU3BsaXRNYXBVcGRhdGVyIiwiY29tcHV0ZVNwbGl0TWFwTGF5ZXJzIiwiY2xvc2VTcGVjaWZpY01hcEF0SW5kZXgiLCJzZXRWaXNpYmxlTGF5ZXJzRm9yTWFwVXBkYXRlciIsIm1hcEluZGV4IiwibGF5ZXJJZHMiLCJuZXdMYXllcnMiLCJjdXJyZW50TGF5ZXJzIiwiaW5jbHVkZXMiLCJ0b2dnbGVMYXllckZvck1hcFVwZGF0ZXIiLCJtYXBTZXR0aW5ncyIsImxheWVySWQiLCJuZXdTcGxpdE1hcHMiLCJ1cGRhdGVWaXNEYXRhVXBkYXRlciIsIkFycmF5IiwiaXNBcnJheSIsIm5ld0RhdGVFbnRyaWVzIiwiYWNjdSIsInN0YXRlV2l0aE5ld0RhdGEiLCJ0b29sdGlwRmllbGRzIiwiZ2VuZXJhdGVMYXllck1ldGFGb3JTcGxpdFZpZXdzIiwiaXNBdmFpbGFibGUiLCJtYXBMYXllcnMiLCJjdXJyZW50TGF5ZXIiLCJfIiwiaW5kZXhUb1JldHJpZXZlIiwibWV0YVNldHRpbmdzIiwibG9hZEZpbGVzVXBkYXRlciIsImZpbGVzIiwiZmlsZXNUb0xvYWQiLCJmaWxlQmxvYiIsImxhYmVsIiwic2l6ZSIsImhhbmRsZXIiLCJsb2FkRmlsZVRhc2tzIiwiYWxsIiwiYmltYXAiLCJyZXN1bHRzIiwiY2VudGVyTWFwIiwibG9hZEZpbGVzRXJyVXBkYXRlciIsImRlZmF1bHRMYXllcnMiLCJ2YWx1ZXMiLCJkYXRh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QUoyQztBQUFBLFVBSS9EdEIsU0FKK0Qsd0JBSS9EQSxTQUorRDtBQUFBLFVBSXBEa0IsS0FKb0Qsd0JBSXBEQSxLQUpvRDs7QUFVdEVvSCxnQkFBVTFCLElBQVYsQ0FBZTFGLEtBQWY7QUFDQXlKLG9CQUFjL0QsSUFBZCxDQUFtQjVHLFNBQW5CO0FBQ0QsS0FaRCxNQVlPO0FBQ0xzSSxnQkFBVTFCLElBQVYsQ0FBZW5GLFFBQWY7QUFDQWtKLG9CQUFjL0QsSUFBZCxDQUFtQjNGLE1BQU1qQixTQUFOLENBQWdCc0IsQ0FBaEIsQ0FBbkI7QUFDRDtBQUNGLEdBakJEOztBQW1CQSxxQ0FDS0wsS0FETDtBQUVFbEIsWUFBUXVJLFNBRlY7QUFHRXRJLGVBQVcySztBQUhiO0FBS0QiLCJmaWxlIjoidmlzLXN0YXRlLXVwZGF0ZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsb25lRGVlcCBmcm9tICdsb2Rhc2guY2xvbmVkZWVwJztcbmltcG9ydCB7Y29uc29sZSBhcyBDb25zb2xlfSBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCB7VGFzaywgd2l0aFRhc2t9IGZyb20gJ3JlYWN0LXBhbG0nO1xuXG4vLyBUYXNrc1xuaW1wb3J0IHtMT0FEX0ZJTEVfVEFTS30gZnJvbSAndGFza3MvdGFza3MnO1xuXG4vLyBBY3Rpb25zXG5pbXBvcnQge3VwZGF0ZVZpc0RhdGEsIGxvYWRGaWxlc0Vycn0gZnJvbSAnYWN0aW9ucy92aXMtc3RhdGUtYWN0aW9ucyc7XG5cbi8vIFV0aWxzXG5pbXBvcnQge2dldERlZmF1bHRJbnRlcmFjdGlvbn0gZnJvbSAndXRpbHMvaW50ZXJhY3Rpb24tdXRpbHMnO1xuaW1wb3J0IHtnZW5lcmF0ZUhhc2hJZH0gZnJvbSAndXRpbHMvdXRpbHMnO1xuaW1wb3J0IHtmaW5kRmllbGRzVG9TaG93fSBmcm9tICd1dGlscy9pbnRlcmFjdGlvbi11dGlscyc7XG5pbXBvcnQge1xuICBnZXREZWZhdWx0ZmlsdGVyLFxuICBnZXRGaWx0ZXJQcm9wcyxcbiAgZ2V0RmlsdGVyUGxvdCxcbiAgZ2V0RGVmYXVsdEZpbHRlclBsb3RUeXBlLFxuICBmaWx0ZXJEYXRhXG59IGZyb20gJ3V0aWxzL2ZpbHRlci11dGlscyc7XG5pbXBvcnQge2NyZWF0ZU5ld0RhdGFFbnRyeX0gZnJvbSAndXRpbHMvZGF0YXNldC11dGlscyc7XG5cbmltcG9ydCB7XG4gIGZpbmREZWZhdWx0TGF5ZXIsXG4gIGNhbGN1bGF0ZUxheWVyRGF0YVxufSBmcm9tICd1dGlscy9sYXllci11dGlscy9sYXllci11dGlscyc7XG5cbmltcG9ydCB7Z2V0RmlsZUhhbmRsZXJ9IGZyb20gJ3Byb2Nlc3Nvci9maWxlLWhhbmRsZXInO1xuXG5pbXBvcnQge1xuICBtZXJnZUZpbHRlcnMsXG4gIG1lcmdlTGF5ZXJzLFxuICBtZXJnZUludGVyYWN0aW9ucyxcbiAgbWVyZ2VMYXllckJsZW5kaW5nXG59IGZyb20gJy4vdmlzLXN0YXRlLW1lcmdlcic7XG5cbmltcG9ydCAqIGFzIEtlcGxlckdMTGF5ZXJzIGZyb20gJ2tlcGxlcmdsLWxheWVycyc7XG5pbXBvcnQge0xBWUVSX0NMQVNTRVN9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuZXhwb3J0IGNvbnN0IElOSVRJQUxfVklTX1NUQVRFID0ge1xuICAvLyBsYXllcnNcbiAgbGF5ZXJzOiBbXSxcbiAgbGF5ZXJEYXRhOiBbXSxcbiAgbGF5ZXJUb0JlTWVyZ2VkOiBbXSxcbiAgbGF5ZXJPcmRlcjogW10sXG5cbiAgLy8gZmlsdGVyc1xuICBmaWx0ZXJzOiBbXSxcbiAgZmlsdGVyVG9CZU1lcmdlZDogW10sXG5cbiAgLy8gYSBjb2xsZWN0aW9uIG9mIG11bHRpcGxlIGRhdGFzZXRcbiAgZGF0YXNldHM6IHt9LFxuICBlZGl0aW5nRGF0YXNldDogdW5kZWZpbmVkLFxuXG4gIGludGVyYWN0aW9uQ29uZmlnOiBnZXREZWZhdWx0SW50ZXJhY3Rpb24oKSxcbiAgaW50ZXJhY3Rpb25Ub0JlTWVyZ2VkOiB1bmRlZmluZWQsXG5cbiAgbGF5ZXJCbGVuZGluZzogJ25vcm1hbCcsXG4gIGhvdmVySW5mbzogdW5kZWZpbmVkLFxuICBjbGlja2VkOiB1bmRlZmluZWQsXG5cbiAgZmlsZUxvYWRpbmc6IGZhbHNlLFxuICBmaWxlTG9hZGluZ0VycjogbnVsbCxcblxuICAvLyB0aGlzIGlzIHVzZWQgd2hlbiB1c2VyIHNwbGl0IG1hcHNcbiAgc3BsaXRNYXBzOiBbXG4gICAgLy8gdGhpcyB3aWxsIGNvbnRhaW4gYSBsaXN0IG9mIG9iamVjdHMgdG9cbiAgICAvLyBkZXNjcmliZSB0aGUgc3RhdGUgb2YgbGF5ZXIgYXZhaWxhYmlsaXR5IGFuZCB2aXNpYmlsaXR5IGZvciBlYWNoIG1hcFxuICAgIC8vIFtcbiAgICAvLyAgIHtcbiAgICAvLyAgICAgbGF5ZXJzOiB7XG4gICAgLy8gICAgICAgbGF5ZXJfaWQ6IHtcbiAgICAvLyAgICAgICAgIGlzQXZhaWxhYmxlOiB0cnVlfGZhbHNlICMgdGhpcyBpcyBkcml2ZW4gYnkgdGhlIGxlZnQgaGFuZCBwYW5lbFxuICAgIC8vICAgICAgICAgaXNWaXNpYmxlOiB0cnVlfGZhbHNlXG4gICAgLy8gICAgICAgfVxuICAgIC8vICAgICB9XG4gICAgLy8gICB9XG4gICAgLy8gXVxuICBdXG59O1xuXG5mdW5jdGlvbiB1cGRhdGVTdGF0ZVdpdGhMYXllckFuZERhdGEoc3RhdGUsIHtsYXllckRhdGEsIGxheWVyLCBpZHh9KSB7XG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgbGF5ZXJzOiBzdGF0ZS5sYXllcnMubWFwKChseXIsIGkpID0+IChpID09PSBpZHggPyBsYXllciA6IGx5cikpLFxuICAgIGxheWVyRGF0YTogbGF5ZXJEYXRhXG4gICAgICA/IHN0YXRlLmxheWVyRGF0YS5tYXAoKGQsIGkpID0+IChpID09PSBpZHggPyBsYXllckRhdGEgOiBkKSlcbiAgICAgIDogc3RhdGUubGF5ZXJEYXRhXG4gIH07XG59XG5cbi8qKlxuICogQ2FsbGVkIHRvIHVwZGF0ZSBsYXllciBiYXNlIGNvbmZpZzogZGF0YUlkLCBsYWJlbCwgY29sdW1uLCBpc1Zpc2libGVcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsYXllckNvbmZpZ0NoYW5nZVVwZGF0ZXIoc3RhdGUsIGFjdGlvbikge1xuICBjb25zdCB7b2xkTGF5ZXJ9ID0gYWN0aW9uO1xuICBjb25zdCBpZHggPSBzdGF0ZS5sYXllcnMuZmluZEluZGV4KGwgPT4gbC5pZCA9PT0gb2xkTGF5ZXIuaWQpO1xuICBjb25zdCBwcm9wcyA9IE9iamVjdC5rZXlzKGFjdGlvbi5uZXdDb25maWcpO1xuXG4gIGNvbnN0IG5ld0xheWVyID0gb2xkTGF5ZXIudXBkYXRlTGF5ZXJDb25maWcoYWN0aW9uLm5ld0NvbmZpZyk7XG4gIGlmIChuZXdMYXllci5zaG91bGRDYWxjdWxhdGVMYXllckRhdGEocHJvcHMpKSB7XG4gICAgY29uc3Qgb2xkTGF5ZXJEYXRhID0gc3RhdGUubGF5ZXJEYXRhW2lkeF07XG4gICAgY29uc3Qge2xheWVyRGF0YSwgbGF5ZXJ9ID0gY2FsY3VsYXRlTGF5ZXJEYXRhKFxuICAgICAgbmV3TGF5ZXIsXG4gICAgICBzdGF0ZSxcbiAgICAgIG9sZExheWVyRGF0YSxcbiAgICAgIHtzYW1lRGF0YTogdHJ1ZX1cbiAgICApO1xuICAgIHJldHVybiB1cGRhdGVTdGF0ZVdpdGhMYXllckFuZERhdGEoc3RhdGUsIHtsYXllckRhdGEsIGxheWVyLCBpZHh9KTtcbiAgfVxuXG4gIGNvbnN0IG5ld1N0YXRlID0ge1xuICAgIC4uLnN0YXRlLFxuICAgIHNwbGl0TWFwczpcbiAgICAgICdpc1Zpc2libGUnIGluIGFjdGlvbi5uZXdDb25maWdcbiAgICAgICAgPyB0b2dnbGVMYXllckZyb21TcGxpdE1hcHMoc3RhdGUsIG5ld0xheWVyKVxuICAgICAgICA6IHN0YXRlLnNwbGl0TWFwc1xuICB9O1xuXG4gIHJldHVybiB1cGRhdGVTdGF0ZVdpdGhMYXllckFuZERhdGEobmV3U3RhdGUsIHtsYXllcjogbmV3TGF5ZXIsIGlkeH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGF5ZXJUeXBlQ2hhbmdlVXBkYXRlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIGNvbnN0IHtvbGRMYXllciwgbmV3VHlwZX0gPSBhY3Rpb247XG4gIGNvbnN0IG9sZElkID0gb2xkTGF5ZXIuaWQ7XG4gIGNvbnN0IGlkeCA9IHN0YXRlLmxheWVycy5maW5kSW5kZXgobCA9PiBsLmlkID09PSBvbGRJZCk7XG5cbiAgaWYgKCFMQVlFUl9DTEFTU0VTW25ld1R5cGVdIHx8ICFLZXBsZXJHTExheWVyc1tMQVlFUl9DTEFTU0VTW25ld1R5cGVdXSkge1xuICAgIENvbnNvbGUuZXJyb3IoYCR7bmV3VHlwZX0gaXMgbm90IGEgdmFsaWQgbGF5ZXIgdHlwZWApO1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIC8vIGdldCBhIG1pbnQgbGF5ZXIsIHdpdGggbmV3IGlkIGFuZCB0eXBlXG4gIC8vIGJlY2F1c2UgZGVjay5nbCB1c2VzIGlkIHRvIG1hdGNoIGJldHdlZW4gbmV3IGFuZCBvbGQgbGF5ZXIuXG4gIC8vIElmIHR5cGUgaGFzIGNoYW5nZWQgYnV0IGlkIGlzIHRoZSBzYW1lLCBpdCB3aWxsIGJyZWFrXG4gIGNvbnN0IExheWVyQ2xhc3MgPSBLZXBsZXJHTExheWVyc1tMQVlFUl9DTEFTU0VTW25ld1R5cGVdXTtcbiAgY29uc3QgbmV3TGF5ZXIgPSBuZXcgTGF5ZXJDbGFzcygpO1xuXG4gIG5ld0xheWVyLmNvbmZpZyA9IG5ld0xheWVyLmFzc2lnbkNvbmZpZ1RvTGF5ZXIoXG4gICAgbmV3TGF5ZXIuY29uZmlnLFxuICAgIG9sZExheWVyLmNvbmZpZ1xuICApO1xuXG4gIGNvbnN0IHtsYXllckRhdGEsIGxheWVyfSA9IGNhbGN1bGF0ZUxheWVyRGF0YShuZXdMYXllciwgc3RhdGUpO1xuXG4gIGxldCBuZXdTdGF0ZSA9IHN0YXRlO1xuXG4gIC8vIHVwZGF0ZSBzcGxpdE1hcCBsYXllciBpZFxuICBpZiAoc3RhdGUuc3BsaXRNYXBzKSB7XG4gICAgbmV3U3RhdGUgPSB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIHNwbGl0TWFwczogc3RhdGUuc3BsaXRNYXBzLm1hcChzZXR0aW5ncyA9PiB7XG4gICAgICAgIGNvbnN0IHtbb2xkSWRdOiBvbGRMYXllck1hcCwgLi4ub3RoZXJMYXllcnN9ID0gc2V0dGluZ3MubGF5ZXJzO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLnNldHRpbmdzLFxuICAgICAgICAgIGxheWVyczoge1xuICAgICAgICAgICAgLi4ub3RoZXJMYXllcnMsXG4gICAgICAgICAgICBbbGF5ZXIuaWRdOiBvbGRMYXllck1hcFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0pXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB1cGRhdGVTdGF0ZVdpdGhMYXllckFuZERhdGEobmV3U3RhdGUsIHtsYXllckRhdGEsIGxheWVyLCBpZHh9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxheWVyVmlzdWFsQ2hhbm5lbENoYW5nZVVwZGF0ZXIoc3RhdGUsIGFjdGlvbikge1xuICBjb25zdCB7b2xkTGF5ZXIsIG5ld0NvbmZpZywgY2hhbm5lbH0gPSBhY3Rpb247XG4gIGNvbnN0IHtkYXRhLCBhbGxEYXRhfSA9IHN0YXRlLmRhdGFzZXRzW29sZExheWVyLmNvbmZpZy5kYXRhSWRdO1xuXG4gIGNvbnN0IGlkeCA9IHN0YXRlLmxheWVycy5maW5kSW5kZXgobCA9PiBsLmlkID09PSBvbGRMYXllci5pZCk7XG4gIGNvbnN0IG5ld0xheWVyID0gb2xkTGF5ZXIudXBkYXRlTGF5ZXJDb25maWcobmV3Q29uZmlnKTtcblxuICBuZXdMYXllci51cGRhdGVMYXllclZpc3VhbENoYW5uZWwoe2RhdGEsIGFsbERhdGF9LCBjaGFubmVsKTtcblxuICBjb25zdCBvbGRMYXllckRhdGEgPSBzdGF0ZS5sYXllckRhdGFbaWR4XTtcbiAgY29uc3Qge2xheWVyRGF0YSwgbGF5ZXJ9ID0gY2FsY3VsYXRlTGF5ZXJEYXRhKG5ld0xheWVyLCBzdGF0ZSwgb2xkTGF5ZXJEYXRhLCB7XG4gICAgc2FtZURhdGE6IHRydWVcbiAgfSk7XG5cbiAgcmV0dXJuIHVwZGF0ZVN0YXRlV2l0aExheWVyQW5kRGF0YShzdGF0ZSwge2xheWVyRGF0YSwgbGF5ZXIsIGlkeH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGF5ZXJWaXNDb25maWdDaGFuZ2VVcGRhdGVyKHN0YXRlLCBhY3Rpb24pIHtcbiAgY29uc3Qge29sZExheWVyfSA9IGFjdGlvbjtcbiAgY29uc3QgaWR4ID0gc3RhdGUubGF5ZXJzLmZpbmRJbmRleChsID0+IGwuaWQgPT09IG9sZExheWVyLmlkKTtcbiAgY29uc3QgcHJvcHMgPSBPYmplY3Qua2V5cyhhY3Rpb24ubmV3VmlzQ29uZmlnKTtcblxuICBjb25zdCBuZXdWaXNDb25maWcgPSB7XG4gICAgLi4ub2xkTGF5ZXIuY29uZmlnLnZpc0NvbmZpZyxcbiAgICAuLi5hY3Rpb24ubmV3VmlzQ29uZmlnXG4gIH07XG5cbiAgY29uc3QgbmV3TGF5ZXIgPSBvbGRMYXllci51cGRhdGVMYXllckNvbmZpZyh7dmlzQ29uZmlnOiBuZXdWaXNDb25maWd9KTtcblxuICBpZiAobmV3TGF5ZXIuc2hvdWxkQ2FsY3VsYXRlTGF5ZXJEYXRhKHByb3BzKSkge1xuICAgIGNvbnN0IG9sZExheWVyRGF0YSA9IHN0YXRlLmxheWVyRGF0YVtpZHhdO1xuICAgIGNvbnN0IHtsYXllckRhdGEsIGxheWVyfSA9IGNhbGN1bGF0ZUxheWVyRGF0YShcbiAgICAgIG5ld0xheWVyLFxuICAgICAgc3RhdGUsXG4gICAgICBvbGRMYXllckRhdGEsXG4gICAgICB7c2FtZURhdGE6IHRydWV9XG4gICAgKTtcbiAgICByZXR1cm4gdXBkYXRlU3RhdGVXaXRoTGF5ZXJBbmREYXRhKHN0YXRlLCB7bGF5ZXJEYXRhLCBsYXllciwgaWR4fSk7XG4gIH1cblxuICByZXR1cm4gdXBkYXRlU3RhdGVXaXRoTGF5ZXJBbmREYXRhKHN0YXRlLCB7bGF5ZXI6IG5ld0xheWVyLCBpZHh9KTtcbn1cblxuLyogZXNsaW50LWVuYWJsZSBtYXgtc3RhdGVtZW50cyAqL1xuXG5leHBvcnQgZnVuY3Rpb24gaW50ZXJhY3Rpb25Db25maWdDaGFuZ2VVcGRhdGVyKHN0YXRlLCBhY3Rpb24pIHtcbiAgY29uc3Qge2NvbmZpZ30gPSBhY3Rpb247XG5cbiAgY29uc3QgaW50ZXJhY3Rpb25Db25maWcgPSB7XG4gICAgLi4uc3RhdGUuaW50ZXJhY3Rpb25Db25maWcsXG4gICAgLi4ue1tjb25maWcuaWRdOiBjb25maWd9XG4gIH07XG5cbiAgaWYgKGNvbmZpZy5lbmFibGVkICYmICFzdGF0ZS5pbnRlcmFjdGlvbkNvbmZpZ1tjb25maWcuaWRdLmVuYWJsZWQpIHtcbiAgICAvLyBvbmx5IGVuYWJsZSBvbmUgaW50ZXJhY3Rpb24gYXQgYSB0aW1lXG4gICAgT2JqZWN0LmtleXMoaW50ZXJhY3Rpb25Db25maWcpLmZvckVhY2goayA9PiB7XG4gICAgICBpZiAoayAhPT0gY29uZmlnLmlkKSB7XG4gICAgICAgIGludGVyYWN0aW9uQ29uZmlnW2tdID0gey4uLmludGVyYWN0aW9uQ29uZmlnW2tdLCBlbmFibGVkOiBmYWxzZX07XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGludGVyYWN0aW9uQ29uZmlnXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRGaWx0ZXJVcGRhdGVyKHN0YXRlLCBhY3Rpb24pIHtcbiAgY29uc3Qge2lkeCwgcHJvcCwgdmFsdWV9ID0gYWN0aW9uO1xuICBsZXQgbmV3U3RhdGUgPSBzdGF0ZTtcbiAgbGV0IG5ld0ZpbHRlciA9IHtcbiAgICAuLi5zdGF0ZS5maWx0ZXJzW2lkeF0sXG4gICAgW3Byb3BdOiB2YWx1ZVxuICB9O1xuXG4gIGNvbnN0IHtkYXRhSWR9ID0gbmV3RmlsdGVyO1xuICBpZiAoIWRhdGFJZCkge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuICBjb25zdCB7ZmllbGRzLCBhbGxEYXRhfSA9IHN0YXRlLmRhdGFzZXRzW2RhdGFJZF07XG5cbiAgc3dpdGNoIChwcm9wKSB7XG4gICAgY2FzZSAnZGF0YUlkJzpcbiAgICAgIC8vIGlmIHRyeWluZyB0byB1cGRhdGUgZmlsdGVyIGRhdGFJZC4gY3JlYXRlIGFuIGVtcHR5IG5ldyBmaWx0ZXJcbiAgICAgIG5ld0ZpbHRlciA9IGdldERlZmF1bHRmaWx0ZXIoZGF0YUlkKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnbmFtZSc6XG4gICAgICAvLyBmaW5kIHRoZSBmaWVsZFxuICAgICAgY29uc3QgZmllbGRJZHggPSBmaWVsZHMuZmluZEluZGV4KGYgPT4gZi5uYW1lID09PSB2YWx1ZSk7XG4gICAgICBsZXQgZmllbGQgPSBmaWVsZHNbZmllbGRJZHhdO1xuXG4gICAgICBpZiAoIWZpZWxkLmZpbHRlclByb3ApIHtcbiAgICAgICAgLy8gZ2V0IGZpbHRlciBkb21haW4gZnJvbSBmaWVsZFxuICAgICAgICAvLyBzYXZlIGZpbHRlclByb3BzOiB7ZG9tYWluLCBzdGVwcywgdmFsdWV9IHRvIGZpZWxkLCBhdm9pZCByZWNhbGN1bGF0ZVxuICAgICAgICBmaWVsZCA9IHtcbiAgICAgICAgICAuLi5maWVsZCxcbiAgICAgICAgICBmaWx0ZXJQcm9wOiBnZXRGaWx0ZXJQcm9wcyhhbGxEYXRhLCBmaWVsZClcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgbmV3RmlsdGVyID0ge1xuICAgICAgICAuLi5uZXdGaWx0ZXIsXG4gICAgICAgIC4uLmZpZWxkLmZpbHRlclByb3AsXG4gICAgICAgIG5hbWU6IGZpZWxkLm5hbWUsXG4gICAgICAgIC8vIGNhbid0IGVkaXQgZGF0YUlkIG9uY2UgbmFtZSBpcyBzZWxlY3RlZFxuICAgICAgICBmcmVlemU6IHRydWUsXG4gICAgICAgIGZpZWxkSWR4XG4gICAgICB9O1xuXG4gICAgICBuZXdTdGF0ZSA9IHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGRhdGFzZXRzOiB7XG4gICAgICAgICAgLi4uc3RhdGUuZGF0YXNldHMsXG4gICAgICAgICAgW2RhdGFJZF06IHtcbiAgICAgICAgICAgIC4uLnN0YXRlLmRhdGFzZXRzW2RhdGFJZF0sXG4gICAgICAgICAgICBmaWVsZHM6IGZpZWxkcy5tYXAoKGQsIGkpID0+IChpID09PSBmaWVsZElkeCA/IGZpZWxkIDogZCkpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAndmFsdWUnOlxuICAgIGRlZmF1bHQ6XG4gICAgICBicmVhaztcbiAgfVxuXG4gIC8vIHNhdmUgbmV3IGZpbHRlcnMgdG8gbmV3U3RhdGVcbiAgbmV3U3RhdGUgPSB7XG4gICAgLi4ubmV3U3RhdGUsXG4gICAgZmlsdGVyczogc3RhdGUuZmlsdGVycy5tYXAoKGYsIGkpID0+IChpID09PSBpZHggPyBuZXdGaWx0ZXIgOiBmKSlcbiAgfTtcblxuICAvLyBmaWx0ZXIgZGF0YVxuICBuZXdTdGF0ZSA9IHtcbiAgICAuLi5uZXdTdGF0ZSxcbiAgICBkYXRhc2V0czoge1xuICAgICAgLi4ubmV3U3RhdGUuZGF0YXNldHMsXG4gICAgICBbZGF0YUlkXToge1xuICAgICAgICAuLi5uZXdTdGF0ZS5kYXRhc2V0c1tkYXRhSWRdLFxuICAgICAgICAuLi5maWx0ZXJEYXRhKGFsbERhdGEsIGRhdGFJZCwgbmV3U3RhdGUuZmlsdGVycylcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgbmV3U3RhdGUgPSB1cGRhdGVBbGxMYXllckRvbWFpbkRhdGEobmV3U3RhdGUsIGRhdGFJZCk7XG5cbiAgcmV0dXJuIG5ld1N0YXRlO1xufVxuXG5leHBvcnQgY29uc3Qgc2V0RmlsdGVyUGxvdFVwZGF0ZXIgPSAoc3RhdGUsIHtpZHgsIG5ld1Byb3B9KSA9PiB7XG4gIGxldCBuZXdGaWx0ZXIgPSB7Li4uc3RhdGUuZmlsdGVyc1tpZHhdLCAuLi5uZXdQcm9wfTtcbiAgY29uc3QgcHJvcCA9IE9iamVjdC5rZXlzKG5ld1Byb3ApWzBdO1xuICBpZiAocHJvcCA9PT0gJ3lBeGlzJykge1xuICAgIGNvbnN0IHBsb3RUeXBlID0gZ2V0RGVmYXVsdEZpbHRlclBsb3RUeXBlKG5ld0ZpbHRlcik7XG5cbiAgICBpZiAocGxvdFR5cGUpIHtcbiAgICAgIG5ld0ZpbHRlciA9IHtcbiAgICAgICAgLi4ubmV3RmlsdGVyLFxuICAgICAgICAuLi5nZXRGaWx0ZXJQbG90KFxuICAgICAgICAgIHsuLi5uZXdGaWx0ZXIsIHBsb3RUeXBlfSxcbiAgICAgICAgICBzdGF0ZS5kYXRhc2V0c1tuZXdGaWx0ZXIuZGF0YUlkXS5hbGxEYXRhXG4gICAgICAgICksXG4gICAgICAgIHBsb3RUeXBlXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgZmlsdGVyczogc3RhdGUuZmlsdGVycy5tYXAoKGYsIGkpID0+IChpID09PSBpZHggPyBuZXdGaWx0ZXIgOiBmKSlcbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCBhZGRGaWx0ZXJVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+XG4gICFhY3Rpb24uZGF0YUlkXG4gICAgPyBzdGF0ZVxuICAgIDoge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgZmlsdGVyczogWy4uLnN0YXRlLmZpbHRlcnMsIGdldERlZmF1bHRmaWx0ZXIoYWN0aW9uLmRhdGFJZCldXG4gICAgICB9O1xuXG5leHBvcnQgY29uc3QgdG9nZ2xlRmlsdGVyQW5pbWF0aW9uVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgZmlsdGVyczogc3RhdGUuZmlsdGVycy5tYXAoXG4gICAgKGYsIGkpID0+IChpID09PSBhY3Rpb24uaWR4ID8gey4uLmYsIGlzQW5pbWF0aW5nOiAhZi5pc0FuaW1hdGluZ30gOiBmKVxuICApXG59KTtcblxuZXhwb3J0IGNvbnN0IHVwZGF0ZUFuaW1hdGlvblNwZWVkVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgZmlsdGVyczogc3RhdGUuZmlsdGVycy5tYXAoXG4gICAgKGYsIGkpID0+IChpID09PSBhY3Rpb24uaWR4ID8gey4uLmYsIHNwZWVkOiBhY3Rpb24uc3BlZWR9IDogZilcbiAgKVxufSk7XG5cbiAgZXhwb3J0IGNvbnN0IGVubGFyZ2VGaWx0ZXJVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgY29uc3QgaXNFbmxhcmdlZCA9IHN0YXRlLmZpbHRlcnNbYWN0aW9uLmlkeF0uZW5sYXJnZWQ7XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBmaWx0ZXJzOiBzdGF0ZS5maWx0ZXJzLm1hcCgoZiwgaSkgPT4ge1xuICAgICAgZi5lbmxhcmdlZCA9ICFpc0VubGFyZ2VkICYmIGkgPT09IGFjdGlvbi5pZHg7XG4gICAgICByZXR1cm4gZjtcbiAgICB9KVxuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IHJlbW92ZUZpbHRlclVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCB7aWR4fSA9IGFjdGlvbjtcbiAgY29uc3Qge2RhdGFJZH0gPSBzdGF0ZS5maWx0ZXJzW2lkeF07XG5cbiAgY29uc3QgbmV3RmlsdGVycyA9IFtcbiAgICAuLi5zdGF0ZS5maWx0ZXJzLnNsaWNlKDAsIGlkeCksXG4gICAgLi4uc3RhdGUuZmlsdGVycy5zbGljZShpZHggKyAxLCBzdGF0ZS5maWx0ZXJzLmxlbmd0aClcbiAgXTtcblxuICBjb25zdCBuZXdTdGF0ZSA9IHtcbiAgICAuLi5zdGF0ZSxcbiAgICBkYXRhc2V0czoge1xuICAgICAgLi4uc3RhdGUuZGF0YXNldHMsXG4gICAgICBbZGF0YUlkXToge1xuICAgICAgICAuLi5zdGF0ZS5kYXRhc2V0c1tkYXRhSWRdLFxuICAgICAgICAuLi5maWx0ZXJEYXRhKHN0YXRlLmRhdGFzZXRzW2RhdGFJZF0uYWxsRGF0YSwgZGF0YUlkLCBuZXdGaWx0ZXJzKVxuICAgICAgfVxuICAgIH0sXG4gICAgZmlsdGVyczogbmV3RmlsdGVyc1xuICB9O1xuXG4gIHJldHVybiB1cGRhdGVBbGxMYXllckRvbWFpbkRhdGEobmV3U3RhdGUsIGRhdGFJZCk7XG59O1xuXG5leHBvcnQgY29uc3QgYWRkTGF5ZXJVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgY29uc3QgZGVmYXVsdERhdGFzZXQgPSBPYmplY3Qua2V5cyhzdGF0ZS5kYXRhc2V0cylbMF07XG4gIGNvbnN0IG5ld0xheWVyID0gbmV3IEtlcGxlckdMTGF5ZXJzLkxheWVyKHtcbiAgICBpc1Zpc2libGU6IHRydWUsXG4gICAgaXNDb25maWdBY3RpdmU6IHRydWUsXG4gICAgZGF0YUlkOiBkZWZhdWx0RGF0YXNldCxcbiAgICAuLi5hY3Rpb24ucHJvcHNcbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBsYXllcnM6IFsuLi5zdGF0ZS5sYXllcnMsIG5ld0xheWVyXSxcbiAgICBsYXllckRhdGE6IFsuLi5zdGF0ZS5sYXllckRhdGEsIHt9XSxcbiAgICBsYXllck9yZGVyOiBbLi4uc3RhdGUubGF5ZXJPcmRlciwgc3RhdGUubGF5ZXJPcmRlci5sZW5ndGhdLFxuICAgIHNwbGl0TWFwczogYWRkTmV3TGF5ZXJzVG9TcGxpdE1hcChzdGF0ZS5zcGxpdE1hcHMsIG5ld0xheWVyKVxuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IHJlbW92ZUxheWVyVXBkYXRlciA9IChzdGF0ZSwge2lkeH0pID0+IHtcbiAgY29uc3Qge2xheWVycywgbGF5ZXJEYXRhLCBjbGlja2VkLCBob3ZlckluZm99ID0gc3RhdGU7XG4gIGNvbnN0IGxheWVyVG9SZW1vdmUgPSBzdGF0ZS5sYXllcnNbaWR4XTtcbiAgY29uc3QgbmV3TWFwcyA9IHJlbW92ZUxheWVyRnJvbVNwbGl0TWFwcyhzdGF0ZSwgbGF5ZXJUb1JlbW92ZSk7XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBsYXllcnM6IFsuLi5sYXllcnMuc2xpY2UoMCwgaWR4KSwgLi4ubGF5ZXJzLnNsaWNlKGlkeCArIDEsIGxheWVycy5sZW5ndGgpXSxcbiAgICBsYXllckRhdGE6IFtcbiAgICAgIC4uLmxheWVyRGF0YS5zbGljZSgwLCBpZHgpLFxuICAgICAgLi4ubGF5ZXJEYXRhLnNsaWNlKGlkeCArIDEsIGxheWVyRGF0YS5sZW5ndGgpXG4gICAgXSxcbiAgICBsYXllck9yZGVyOiBzdGF0ZS5sYXllck9yZGVyXG4gICAgICAuZmlsdGVyKGkgPT4gaSAhPT0gaWR4KVxuICAgICAgLm1hcChwaWQgPT4gKHBpZCA+IGlkeCA/IHBpZCAtIDEgOiBwaWQpKSxcbiAgICBjbGlja2VkOiBsYXllclRvUmVtb3ZlLmlzTGF5ZXJIb3ZlcmVkKGNsaWNrZWQpID8gdW5kZWZpbmVkIDogY2xpY2tlZCxcbiAgICBob3ZlckluZm86IGxheWVyVG9SZW1vdmUuaXNMYXllckhvdmVyZWQoaG92ZXJJbmZvKSA/IHVuZGVmaW5lZCA6IGhvdmVySW5mbyxcbiAgICBzcGxpdE1hcHM6IG5ld01hcHNcbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCByZW9yZGVyTGF5ZXJVcGRhdGVyID0gKHN0YXRlLCB7b3JkZXJ9KSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgbGF5ZXJPcmRlcjogb3JkZXJcbn0pO1xuXG5leHBvcnQgY29uc3QgcmVtb3ZlRGF0YXNldFVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAvLyBleHRyYWN0IGRhdGFzZXQga2V5XG4gIGNvbnN0IHtrZXk6IGRhdGFzZXRLZXl9ID0gYWN0aW9uO1xuICBjb25zdCB7ZGF0YXNldHN9ID0gc3RhdGU7XG5cbiAgLy8gY2hlY2sgaWYgZGF0YXNldCBpcyBwcmVzZW50XG4gIGlmICghZGF0YXNldHNbZGF0YXNldEtleV0pIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuICBjb25zdCB7bGF5ZXJzLCBkYXRhc2V0czoge1tkYXRhc2V0S2V5XTogZGF0YXNldCwgLi4ubmV3RGF0YXNldHN9fSA9IHN0YXRlO1xuICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG5cbiAgY29uc3QgaW5kZXhlcyA9IGxheWVycy5yZWR1Y2UoKGxpc3RPZkluZGV4ZXMsIGxheWVyLCBpbmRleCkgPT4ge1xuICAgIGlmIChsYXllci5jb25maWcuZGF0YUlkID09PSBkYXRhc2V0S2V5KSB7XG4gICAgICBsaXN0T2ZJbmRleGVzLnB1c2goaW5kZXgpO1xuICAgIH1cbiAgICByZXR1cm4gbGlzdE9mSW5kZXhlcztcbiAgfSwgW10pO1xuXG4gIC8vIHJlbW92ZSBsYXllcnMgYW5kIGRhdGFzZXRzXG4gIGNvbnN0IHtuZXdTdGF0ZX0gPSBpbmRleGVzLnJlZHVjZShcbiAgICAoe25ld1N0YXRlOiBjdXJyZW50U3RhdGUsIGluZGV4Q291bnRlcn0sIGlkeCkgPT4ge1xuICAgICAgY29uc3QgY3VycmVudEluZGV4ID0gaWR4IC0gaW5kZXhDb3VudGVyO1xuICAgICAgY3VycmVudFN0YXRlID0gcmVtb3ZlTGF5ZXJVcGRhdGVyKGN1cnJlbnRTdGF0ZSwge2lkeDogY3VycmVudEluZGV4fSk7XG4gICAgICBpbmRleENvdW50ZXIrKztcbiAgICAgIHJldHVybiB7bmV3U3RhdGU6IGN1cnJlbnRTdGF0ZSwgaW5kZXhDb3VudGVyfTtcbiAgICB9LFxuICAgIHtuZXdTdGF0ZTogey4uLnN0YXRlLCBkYXRhc2V0czogbmV3RGF0YXNldHN9LCBpbmRleENvdW50ZXI6IDB9XG4gICk7XG5cbiAgLy8gcmVtb3ZlIGZpbHRlcnNcbiAgY29uc3QgZmlsdGVycyA9IHN0YXRlLmZpbHRlcnMuZmlsdGVyKGZpbHRlciA9PiBmaWx0ZXIuZGF0YUlkICE9PSBkYXRhc2V0S2V5KTtcblxuICAvLyB1cGRhdGUgaW50ZXJhY3Rpb25Db25maWdcbiAgbGV0IHtpbnRlcmFjdGlvbkNvbmZpZ30gPSBzdGF0ZTtcbiAgY29uc3Qge3Rvb2x0aXB9ID0gaW50ZXJhY3Rpb25Db25maWc7XG4gIGlmICh0b29sdGlwKSB7XG4gICAgY29uc3Qge2NvbmZpZ30gPSB0b29sdGlwO1xuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4gICAgY29uc3Qge1tkYXRhc2V0S2V5XTogZmllbGRzLCAuLi5maWVsZHNUb1Nob3d9ID0gY29uZmlnLmZpZWxkc1RvU2hvdztcbiAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG4gICAgaW50ZXJhY3Rpb25Db25maWcgPSB7XG4gICAgICAuLi5pbnRlcmFjdGlvbkNvbmZpZyxcbiAgICAgIHRvb2x0aXA6IHsuLi50b29sdGlwLCBjb25maWc6IHsuLi5jb25maWcsIGZpZWxkc1RvU2hvd319XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7Li4ubmV3U3RhdGUsIGZpbHRlcnMsIGludGVyYWN0aW9uQ29uZmlnfTtcbn07XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVMYXllckJsZW5kaW5nVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgbGF5ZXJCbGVuZGluZzogYWN0aW9uLm1vZGVcbn0pO1xuXG5leHBvcnQgY29uc3Qgc2hvd0RhdGFzZXRUYWJsZVVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGVkaXRpbmdEYXRhc2V0OiBhY3Rpb24uZGF0YUlkXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgcmVzZXRNYXBDb25maWdVcGRhdGVyID0gKCkgPT4gY2xvbmVEZWVwKElOSVRJQUxfVklTX1NUQVRFKTtcblxuLyoqXG4gKiBMb2FkcyBjdXN0b20gY29uZmlndXJhdGlvbiBpbnRvIHN0YXRlXG4gKiBAcGFyYW0gc3RhdGVcbiAqIEBwYXJhbSBhY3Rpb25cbiAqIEByZXR1cm5zIHsqfVxuICovXG5leHBvcnQgY29uc3QgcmVjZWl2ZU1hcENvbmZpZ1VwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBpZiAoIWFjdGlvbi5wYXlsb2FkLnZpc1N0YXRlKSB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgY29uc3Qge1xuICAgIGZpbHRlcnMsXG4gICAgbGF5ZXJzLFxuICAgIGludGVyYWN0aW9uQ29uZmlnLFxuICAgIGxheWVyQmxlbmRpbmcsXG4gICAgc3BsaXRNYXBzXG4gIH0gPSBhY3Rpb24ucGF5bG9hZC52aXNTdGF0ZTtcblxuICAvLyBhbHdheXMgcmVzZXQgY29uZmlnIHdoZW4gcmVjZWl2ZSBhIG5ldyBjb25maWdcbiAgY29uc3QgcmVzZXRTdGF0ZSA9IHJlc2V0TWFwQ29uZmlnVXBkYXRlcigpO1xuICBsZXQgbWVyZ2VkU3RhdGUgPSB7XG4gICAgLi4ucmVzZXRTdGF0ZSxcbiAgICBzcGxpdE1hcHM6IHNwbGl0TWFwcyB8fCBbXSAvLyBtYXBzIGRvZXNuJ3QgcmVxdWlyZSBhbnkgbG9naWNcbiAgfTtcblxuICBtZXJnZWRTdGF0ZSA9IG1lcmdlRmlsdGVycyhtZXJnZWRTdGF0ZSwgZmlsdGVycyk7XG4gIG1lcmdlZFN0YXRlID0gbWVyZ2VMYXllcnMobWVyZ2VkU3RhdGUsIGxheWVycyk7XG4gIG1lcmdlZFN0YXRlID0gbWVyZ2VJbnRlcmFjdGlvbnMobWVyZ2VkU3RhdGUsIGludGVyYWN0aW9uQ29uZmlnKTtcbiAgbWVyZ2VkU3RhdGUgPSBtZXJnZUxheWVyQmxlbmRpbmcobWVyZ2VkU3RhdGUsIGxheWVyQmxlbmRpbmcpO1xuXG4gIC8vIGNvbnN0IG5ld1N0YXRlID17XG4gIC8vICAgLi4ucmVzZXRTdGF0ZSxcbiAgLy8gICAuLi5tZXJnZUZpbHRlcnMobWVyZ2VkU3RhdGUsIGZpbHRlcnMpLFxuICAvLyAgIC4uLm1lcmdlTGF5ZXJzKG1lcmdlZFN0YXRlLCBsYXllcnMpLFxuICAvLyAgIC4uLm1lcmdlSW50ZXJhY3Rpb25zKG1lcmdlZFN0YXRlLCBpbnRlcmFjdGlvbkNvbmZpZyksXG4gIC8vICAgLi4ubWVyZ2VMYXllckJsZW5kaW5nKG1lcmdlZFN0YXRlLCBsYXllckJsZW5kaW5nKVxuICAvLyB9O1xuXG4gIHJldHVybiBtZXJnZWRTdGF0ZTtcbn07XG5cbmV4cG9ydCBjb25zdCBsYXllckhvdmVyVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgaG92ZXJJbmZvOiBhY3Rpb24uaW5mb1xufSk7XG5cbmV4cG9ydCBjb25zdCBsYXllckNsaWNrVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgY2xpY2tlZDogYWN0aW9uLmluZm8gJiYgYWN0aW9uLmluZm8ucGlja2VkID8gYWN0aW9uLmluZm8gOiBudWxsXG59KTtcblxuZXhwb3J0IGNvbnN0IG1hcENsaWNrVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgY2xpY2tlZDogbnVsbFxufSk7XG5cbmV4cG9ydCBjb25zdCB0b2dnbGVTcGxpdE1hcFVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT5cbiAgc3RhdGUuc3BsaXRNYXBzICYmIHN0YXRlLnNwbGl0TWFwcy5sZW5ndGggPT09IDBcbiAgICA/IHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIC8vIG1heWJlIHdlIHNob3VsZCB1c2UgYW4gYXJyYXkgdG8gc3RvcmUgc3RhdGUgZm9yIGEgc2luZ2xlIG1hcCBhcyB3ZWxsXG4gICAgICAgIC8vIGlmIGN1cnJlbnQgbWFwcyBsZW5ndGggaXMgZXF1YWwgdG8gMCBpdCBtZWFucyB0aGF0IHdlIGFyZSBhYm91dCB0byBzcGxpdCB0aGUgdmlld1xuICAgICAgICBzcGxpdE1hcHM6IGNvbXB1dGVTcGxpdE1hcExheWVycyhzdGF0ZS5sYXllcnMpXG4gICAgICB9XG4gICAgOiBjbG9zZVNwZWNpZmljTWFwQXRJbmRleChzdGF0ZSwgYWN0aW9uKTtcblxuLyoqXG4gKiBUaGlzIGlzIHRyaWdnZXJlZCB3aGVuIHZpZXcgaXMgc3BsaXQgaW50byBtdWx0aXBsZSBtYXBzLlxuICogSXQgd2lsbCBvbmx5IHVwZGF0ZSBsYXllcnMgdGhhdCBiZWxvbmcgdG8gdGhlIG1hcCBsYXllciBkcm9wZG93blxuICogdGhlIHVzZXIgaXMgaW50ZXJhY3Rpbmcgd2l0XG4gKiBAcGFyYW0gc3RhdGVcbiAqIEBwYXJhbSBhY3Rpb25cbiAqL1xuZXhwb3J0IGNvbnN0IHNldFZpc2libGVMYXllcnNGb3JNYXBVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgY29uc3Qge21hcEluZGV4LCBsYXllcklkc30gPSBhY3Rpb247XG4gIGlmICghbGF5ZXJJZHMpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICBjb25zdCB7c3BsaXRNYXBzID0gW119ID0gc3RhdGU7XG5cbiAgaWYgKHNwbGl0TWFwcy5sZW5ndGggPT09IDApIHtcbiAgICAvLyB3ZSBzaG91bGQgbmV2ZXIgZ2V0IGludG8gdGhpcyBzdGF0ZVxuICAgIC8vIGJlY2F1c2UgdGhpcyBhY3Rpb24gc2hvdWxkIG9ubHkgYmUgdHJpZ2dlcmVkXG4gICAgLy8gd2hlbiBtYXAgdmlldyBpcyBzcGxpdFxuICAgIC8vIGJ1dCBzb21ldGhpbmcgbWF5IGhhdmUgaGFwcGVuZWRcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICAvLyBuZWVkIHRvIGNoZWNrIGlmIG1hcHMgaXMgcG9wdWxhdGVkIG90aGVyd2lzZSB3aWxsIGNyZWF0ZVxuICBjb25zdCB7W21hcEluZGV4XTogbWFwID0ge319ID0gc3BsaXRNYXBzO1xuXG4gIGNvbnN0IGxheWVycyA9IG1hcC5sYXllcnMgfHwgW107XG5cbiAgLy8gd2Ugc2V0IHZpc2liaWxpdHkgdG8gdHJ1ZSBmb3IgYWxsIGxheWVycyBpbmNsdWRlZCBpbiBvdXIgaW5wdXQgbGlzdFxuICBjb25zdCBuZXdMYXllcnMgPSAoT2JqZWN0LmtleXMobGF5ZXJzKSB8fCBbXSkucmVkdWNlKChjdXJyZW50TGF5ZXJzLCBpZHgpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uY3VycmVudExheWVycyxcbiAgICAgIFtpZHhdOiB7XG4gICAgICAgIC4uLmxheWVyc1tpZHhdLFxuICAgICAgICBpc1Zpc2libGU6IGxheWVySWRzLmluY2x1ZGVzKGlkeClcbiAgICAgIH1cbiAgICB9O1xuICB9LCB7fSk7XG5cbiAgY29uc3QgbmV3TWFwcyA9IFsuLi5zcGxpdE1hcHNdO1xuXG4gIG5ld01hcHNbbWFwSW5kZXhdID0ge1xuICAgIC4uLnNwbGl0TWFwc1ttYXBJbmRleF0sXG4gICAgbGF5ZXJzOiBuZXdMYXllcnNcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIHNwbGl0TWFwczogbmV3TWFwc1xuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IHRvZ2dsZUxheWVyRm9yTWFwVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIGlmICghc3RhdGUuc3BsaXRNYXBzW2FjdGlvbi5tYXBJbmRleF0pIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICBjb25zdCBtYXBTZXR0aW5ncyA9IHN0YXRlLnNwbGl0TWFwc1thY3Rpb24ubWFwSW5kZXhdO1xuICBjb25zdCB7bGF5ZXJzfSA9IG1hcFNldHRpbmdzO1xuICBpZiAoIWxheWVycyB8fCAhbGF5ZXJzW2FjdGlvbi5sYXllcklkXSkge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIGNvbnN0IGxheWVyID0gbGF5ZXJzW2FjdGlvbi5sYXllcklkXTtcblxuICBjb25zdCBuZXdMYXllciA9IHtcbiAgICAuLi5sYXllcixcbiAgICBpc1Zpc2libGU6ICFsYXllci5pc1Zpc2libGVcbiAgfTtcblxuICBjb25zdCBuZXdMYXllcnMgPSB7XG4gICAgLi4ubGF5ZXJzLFxuICAgIFthY3Rpb24ubGF5ZXJJZF06IG5ld0xheWVyXG4gIH07XG5cbiAgLy8gY29uc3Qgc3BsaXRNYXBzID0gc3RhdGUuc3BsaXRNYXBzO1xuICBjb25zdCBuZXdTcGxpdE1hcHMgPSBbLi4uc3RhdGUuc3BsaXRNYXBzXTtcbiAgbmV3U3BsaXRNYXBzW2FjdGlvbi5tYXBJbmRleF0gPSB7XG4gICAgLi4ubWFwU2V0dGluZ3MsXG4gICAgbGF5ZXJzOiBuZXdMYXllcnNcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIHNwbGl0TWFwczogbmV3U3BsaXRNYXBzXG4gIH07XG59O1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtc3RhdGVtZW50cyAqL1xuZXhwb3J0IGNvbnN0IHVwZGF0ZVZpc0RhdGFVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgLy8gZGF0YXNldHMgY2FuIGJlIGEgc2luZ2xlIGRhdGEgZW50cmllcyBvciBhbiBhcnJheSBvZiBtdWx0aXBsZSBkYXRhIGVudHJpZXNcbiAgY29uc3QgZGF0YXNldHMgPSBBcnJheS5pc0FycmF5KGFjdGlvbi5kYXRhc2V0cylcbiAgICA/IGFjdGlvbi5kYXRhc2V0c1xuICAgIDogW2FjdGlvbi5kYXRhc2V0c107XG5cbiAgaWYgKGFjdGlvbi5jb25maWcpIHtcbiAgICAvLyBhcHBseSBjb25maWcgaWYgcGFzc2VkIGZyb20gYWN0aW9uXG4gICAgc3RhdGUgPSByZWNlaXZlTWFwQ29uZmlnVXBkYXRlcihzdGF0ZSwge3BheWxvYWQ6IHt2aXNTdGF0ZTogYWN0aW9uLmNvbmZpZ319KVxuICB9XG5cbiAgY29uc3QgbmV3RGF0ZUVudHJpZXMgPSBkYXRhc2V0cy5yZWR1Y2UoXG4gICAgKGFjY3UsIHtpbmZvID0ge30sIGRhdGF9KSA9PiAoe1xuICAgICAgLi4uYWNjdSxcbiAgICAgIC4uLihjcmVhdGVOZXdEYXRhRW50cnkoe2luZm8sIGRhdGF9LCBzdGF0ZS5kYXRhc2V0cykgfHwge30pXG4gICAgfSksXG4gICAge31cbiAgKTtcblxuICBpZiAoIU9iamVjdC5rZXlzKG5ld0RhdGVFbnRyaWVzKS5sZW5ndGgpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICBjb25zdCBzdGF0ZVdpdGhOZXdEYXRhID0ge1xuICAgIC4uLnN0YXRlLFxuICAgIGRhdGFzZXRzOiB7XG4gICAgICAuLi5zdGF0ZS5kYXRhc2V0cyxcbiAgICAgIC4uLm5ld0RhdGVFbnRyaWVzXG4gICAgfVxuICB9O1xuXG4gIC8vIHByZXZpb3VzbHkgc2F2ZWQgY29uZmlnIGJlZm9yZSBkYXRhIGxvYWRlZFxuICBjb25zdCB7XG4gICAgZmlsdGVyVG9CZU1lcmdlZCA9IFtdLFxuICAgIGxheWVyVG9CZU1lcmdlZCA9IFtdLFxuICAgIGludGVyYWN0aW9uVG9CZU1lcmdlZCA9IHt9XG4gIH0gPSBzdGF0ZVdpdGhOZXdEYXRhO1xuXG4gIC8vIG1lcmdlIHN0YXRlIHdpdGggc2F2ZWQgZmlsdGVyc1xuICBsZXQgbWVyZ2VkU3RhdGUgPSBtZXJnZUZpbHRlcnMoc3RhdGVXaXRoTmV3RGF0YSwgZmlsdGVyVG9CZU1lcmdlZCk7XG4gIC8vIG1lcmdlIHN0YXRlIHdpdGggc2F2ZWQgbGF5ZXJzXG4gIG1lcmdlZFN0YXRlID0gbWVyZ2VMYXllcnMobWVyZ2VkU3RhdGUsIGxheWVyVG9CZU1lcmdlZCk7XG5cbiAgaWYgKG1lcmdlZFN0YXRlLmxheWVycy5sZW5ndGggPT09IHN0YXRlLmxheWVycy5sZW5ndGgpIHtcbiAgICAvLyBubyBsYXllciBtZXJnZWQsIGZpbmQgZGVmYXVsdHNcbiAgICBtZXJnZWRTdGF0ZSA9IGFkZERlZmF1bHRMYXllcnMobWVyZ2VkU3RhdGUsIG5ld0RhdGVFbnRyaWVzKTtcbiAgfVxuXG4gIGlmIChtZXJnZWRTdGF0ZS5zcGxpdE1hcHMubGVuZ3RoKSB7XG4gICAgY29uc3QgbmV3TGF5ZXJzID0gbWVyZ2VkU3RhdGUubGF5ZXJzLmZpbHRlcihcbiAgICAgIGwgPT4gbC5jb25maWcuZGF0YUlkIGluIG5ld0RhdGVFbnRyaWVzXG4gICAgKTtcbiAgICAvLyBpZiBtYXAgaXMgc3BsaXRlZCwgYWRkIG5ldyBsYXllcnMgdG8gc3BsaXRNYXBzXG4gICAgbWVyZ2VkU3RhdGUgPSB7XG4gICAgICAuLi5tZXJnZWRTdGF0ZSxcbiAgICAgIHNwbGl0TWFwczogYWRkTmV3TGF5ZXJzVG9TcGxpdE1hcChtZXJnZWRTdGF0ZS5zcGxpdE1hcHMsIG5ld0xheWVycylcbiAgICB9O1xuICB9XG5cbiAgLy8gbWVyZ2Ugc3RhdGUgd2l0aCBzYXZlZCBpbnRlcmFjdGlvbnNcbiAgbWVyZ2VkU3RhdGUgPSBtZXJnZUludGVyYWN0aW9ucyhtZXJnZWRTdGF0ZSwgaW50ZXJhY3Rpb25Ub0JlTWVyZ2VkKTtcblxuICAvLyBpZiBubyB0b29sdGlwcyBtZXJnZWQgYWRkIGRlZmF1bHQgdG9vbHRpcHNcbiAgT2JqZWN0LmtleXMobmV3RGF0ZUVudHJpZXMpLmZvckVhY2goZGF0YUlkID0+IHtcbiAgICBjb25zdCB0b29sdGlwRmllbGRzID1cbiAgICAgIG1lcmdlZFN0YXRlLmludGVyYWN0aW9uQ29uZmlnLnRvb2x0aXAuY29uZmlnLmZpZWxkc1RvU2hvd1tkYXRhSWRdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheSh0b29sdGlwRmllbGRzKSB8fCAhdG9vbHRpcEZpZWxkcy5sZW5ndGgpIHtcbiAgICAgIG1lcmdlZFN0YXRlID0gYWRkRGVmYXVsdFRvb2x0aXBzKG1lcmdlZFN0YXRlLCBuZXdEYXRlRW50cmllc1tkYXRhSWRdKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB1cGRhdGVBbGxMYXllckRvbWFpbkRhdGEoXG4gICAgbWVyZ2VkU3RhdGUsXG4gICAgT2JqZWN0LmtleXMobmV3RGF0ZUVudHJpZXMpXG4gICk7XG59O1xuLyogZXNsaW50LWVuYWJsZSBtYXgtc3RhdGVtZW50cyAqL1xuXG5mdW5jdGlvbiBnZW5lcmF0ZUxheWVyTWV0YUZvclNwbGl0Vmlld3MobGF5ZXIpIHtcbiAgcmV0dXJuIHtcbiAgICBpc0F2YWlsYWJsZTogbGF5ZXIuY29uZmlnLmlzVmlzaWJsZSxcbiAgICBpc1Zpc2libGU6IGxheWVyLmNvbmZpZy5pc1Zpc2libGVcbiAgfTtcbn1cblxuLyoqXG4gKiBUaGlzIGVtdGhvZCB3aWxsIGNvbXB1dGUgdGhlIGRlZmF1bHQgbWFwcyBjdXN0b20gbGlzdFxuICogYmFzZWQgb24gdGhlIGN1cnJlbnQgbGF5ZXJzIHN0YXR1c1xuICogQHBhcmFtIGxheWVyc1xuICogQHJldHVybnMge1sqLCpdfVxuICovXG5mdW5jdGlvbiBjb21wdXRlU3BsaXRNYXBMYXllcnMobGF5ZXJzKSB7XG4gIGNvbnN0IG1hcExheWVycyA9IGxheWVycy5yZWR1Y2UoXG4gICAgKG5ld0xheWVycywgY3VycmVudExheWVyKSA9PiAoe1xuICAgICAgLi4ubmV3TGF5ZXJzLFxuICAgICAgW2N1cnJlbnRMYXllci5pZF06IGdlbmVyYXRlTGF5ZXJNZXRhRm9yU3BsaXRWaWV3cyhjdXJyZW50TGF5ZXIpXG4gICAgfSksXG4gICAge31cbiAgKTtcbiAgcmV0dXJuIFtcbiAgICB7XG4gICAgICBsYXllcnM6IG1hcExheWVyc1xuICAgIH0sXG4gICAge1xuICAgICAgbGF5ZXJzOiBtYXBMYXllcnNcbiAgICB9XG4gIF07XG59XG5cbi8qKlxuICogUmVtb3ZlIGFuIGV4aXN0aW5nIGxheWVycyBmcm9tIGN1c3RvbSBtYXAgbGF5ZXIgb2JqZWN0c1xuICogQHBhcmFtIHN0YXRlXG4gKiBAcGFyYW0gbGF5ZXJcbiAqIEByZXR1cm5zIHtbKiwqXX0gTWFwcyBvZiBjdXN0b20gbGF5ZXIgb2JqZWN0c1xuICovXG5mdW5jdGlvbiByZW1vdmVMYXllckZyb21TcGxpdE1hcHMoc3RhdGUsIGxheWVyKSB7XG4gIHJldHVybiBzdGF0ZS5zcGxpdE1hcHMubWFwKHNldHRpbmdzID0+IHtcbiAgICBjb25zdCB7bGF5ZXJzfSA9IHNldHRpbmdzO1xuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4gICAgY29uc3Qge1tsYXllci5pZF06IF8sIC4uLm5ld0xheWVyc30gPSBsYXllcnM7XG4gICAgLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zZXR0aW5ncyxcbiAgICAgIGxheWVyczogbmV3TGF5ZXJzXG4gICAgfTtcbiAgfSk7XG59XG5cbi8qKlxuICogQWRkIG5ldyBsYXllcnMgdG8gYm90aCBleGlzdGluZyBtYXBzXG4gKiBAcGFyYW0gc3BsaXRNYXBzXG4gKiBAcGFyYW0gbGF5ZXJzXG4gKiBAcmV0dXJucyB7WyosKl19IG5ldyBzcGxpdE1hcHNcbiAqL1xuZnVuY3Rpb24gYWRkTmV3TGF5ZXJzVG9TcGxpdE1hcChzcGxpdE1hcHMsIGxheWVycykge1xuICBjb25zdCBuZXdMYXllcnMgPSBBcnJheS5pc0FycmF5KGxheWVycykgPyBsYXllcnMgOiBbbGF5ZXJzXTtcblxuICBpZiAoIXNwbGl0TWFwcyB8fCAhc3BsaXRNYXBzLmxlbmd0aCB8fCAhbmV3TGF5ZXJzLmxlbmd0aCkge1xuICAgIHJldHVybiBzcGxpdE1hcHM7XG4gIH1cblxuICAvLyBhZGQgbmV3IGxheWVyIHRvIGJvdGggbWFwcyxcbiAgLy8gIGRvbid0IG92ZXJyaWRlLCBpZiBsYXllci5pZCBpcyBhbHJlYWR5IGluIHNwbGl0TWFwcy5zZXR0aW5ncy5sYXllcnNcbiAgcmV0dXJuIHNwbGl0TWFwcy5tYXAoc2V0dGluZ3MgPT4gKHtcbiAgICAuLi5zZXR0aW5ncyxcbiAgICBsYXllcnM6IHtcbiAgICAgIC4uLnNldHRpbmdzLmxheWVycyxcbiAgICAgIC4uLm5ld0xheWVycy5yZWR1Y2UoXG4gICAgICAgIChhY2N1LCBuZXdMYXllcikgPT5cbiAgICAgICAgICBuZXdMYXllci5jb25maWcuaXNWaXNpYmxlXG4gICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAuLi5hY2N1LFxuICAgICAgICAgICAgICAgIFtuZXdMYXllci5pZF06IHNldHRpbmdzLmxheWVyc1tuZXdMYXllci5pZF1cbiAgICAgICAgICAgICAgICAgID8gc2V0dGluZ3MubGF5ZXJzW25ld0xheWVyLmlkXVxuICAgICAgICAgICAgICAgICAgOiBnZW5lcmF0ZUxheWVyTWV0YUZvclNwbGl0Vmlld3MobmV3TGF5ZXIpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDogYWNjdSxcbiAgICAgICAge31cbiAgICAgIClcbiAgICB9XG4gIH0pKTtcbn1cblxuLyoqXG4gKiBIaWRlIGFuIGV4aXN0aW5nIGxheWVycyBmcm9tIGN1c3RvbSBtYXAgbGF5ZXIgb2JqZWN0c1xuICogQHBhcmFtIHN0YXRlXG4gKiBAcGFyYW0gbGF5ZXJcbiAqIEByZXR1cm5zIHtbKiwqXX0gTWFwcyBvZiBjdXN0b20gbGF5ZXIgb2JqZWN0c1xuICovXG5mdW5jdGlvbiB0b2dnbGVMYXllckZyb21TcGxpdE1hcHMoc3RhdGUsIGxheWVyKSB7XG4gIHJldHVybiBzdGF0ZS5zcGxpdE1hcHMubWFwKHNldHRpbmdzID0+IHtcbiAgICBjb25zdCB7bGF5ZXJzfSA9IHNldHRpbmdzO1xuICAgIGNvbnN0IG5ld0xheWVycyA9IHtcbiAgICAgIC4uLmxheWVycyxcbiAgICAgIFtsYXllci5pZF06IGdlbmVyYXRlTGF5ZXJNZXRhRm9yU3BsaXRWaWV3cyhsYXllcilcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnNldHRpbmdzLFxuICAgICAgbGF5ZXJzOiBuZXdMYXllcnNcbiAgICB9O1xuICB9KTtcbn1cblxuLyoqXG4gKiBXaGVuIGEgdXNlciBjbGlja3Mgb24gdGhlIHNwZWNpZmljIG1hcCBjbG9zaW5nIGljb25cbiAqIHRoZSBhcHBsaWNhdGlvbiB3aWxsIGNsb3NlIHRoZSBzZWxlY3RlZCBtYXBcbiAqIGFuZCB3aWxsIG1lcmdlIHRoZSByZW1haW5pbmcgb25lIHdpdGggdGhlIGdsb2JhbCBzdGF0ZVxuICogVE9ETzogaSB0aGluayBpbiB0aGUgZnV0dXJlIHRoaXMgYWN0aW9uIHNob3VsZCBiZSBjYWxsZWQgbWVyZ2UgbWFwIGxheWVycyB3aXRoIGdsb2JhbCBzZXR0aW5nc1xuICogQHBhcmFtIHN0YXRlXG4gKiBAcGFyYW0gYWN0aW9uXG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuZnVuY3Rpb24gY2xvc2VTcGVjaWZpY01hcEF0SW5kZXgoc3RhdGUsIGFjdGlvbikge1xuICAvLyByZXRyaWV2ZSBsYXllcnMgbWV0YSBkYXRhIGZyb20gdGhlIHJlbWFpbmluZyBtYXAgdGhhdCB3ZSBuZWVkIHRvIGtlZXBcbiAgY29uc3QgaW5kZXhUb1JldHJpZXZlID0gMSAtIGFjdGlvbi5wYXlsb2FkO1xuXG4gIGNvbnN0IG1ldGFTZXR0aW5ncyA9IHN0YXRlLnNwbGl0TWFwc1tpbmRleFRvUmV0cmlldmVdO1xuICBpZiAoIW1ldGFTZXR0aW5ncyB8fCAhbWV0YVNldHRpbmdzLmxheWVycykge1xuICAgIC8vIGlmIHdlIGNhbid0IGZpbmQgdGhlIG1ldGEgc2V0dGluZ3Mgd2Ugc2ltcGx5IGNsZWFuIHVwIHNwbGl0TWFwcyBhbmRcbiAgICAvLyBrZWVwIGdsb2JhbCBzdGF0ZSBhcyBpdCBpc1xuICAgIC8vIGJ1dCB3aHkgZG9lcyB0aGlzIGV2ZXIgaGFwcGVuP1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIHNwbGl0TWFwczogW11cbiAgICB9O1xuICB9XG5cbiAgY29uc3Qge2xheWVyc30gPSBzdGF0ZTtcblxuICAvLyB1cGRhdGUgbGF5ZXIgdmlzaWJpbGl0eVxuICBjb25zdCBuZXdMYXllcnMgPSBsYXllcnMubWFwKGxheWVyID0+XG4gICAgbGF5ZXIudXBkYXRlTGF5ZXJDb25maWcoe1xuICAgICAgaXNWaXNpYmxlOiBtZXRhU2V0dGluZ3MubGF5ZXJzW2xheWVyLmlkXVxuICAgICAgICA/IG1ldGFTZXR0aW5ncy5sYXllcnNbbGF5ZXIuaWRdLmlzVmlzaWJsZVxuICAgICAgICA6IGxheWVyLmNvbmZpZy5pc1Zpc2libGVcbiAgICB9KVxuICApO1xuXG4gIC8vIGRlbGV0ZSBtYXBcbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBsYXllcnM6IG5ld0xheWVycyxcbiAgICBzcGxpdE1hcHM6IFtdXG4gIH07XG59XG5cbi8vIFRPRE86IHJlZG8gd3JpdGUgaGFuZGxlciB0byBub3QgdXNlIHRhc2tzXG5leHBvcnQgY29uc3QgbG9hZEZpbGVzVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIGNvbnN0IHtmaWxlc30gPSBhY3Rpb247XG4gIGNvbnN0IGZpbGVzVG9Mb2FkID0gZmlsZXMubWFwKGZpbGVCbG9iID0+ICh7XG4gICAgZmlsZUJsb2IsXG4gICAgaW5mbzoge1xuICAgICAgaWQ6IGdlbmVyYXRlSGFzaElkKDQpLFxuICAgICAgbGFiZWw6IGZpbGVCbG9iLm5hbWUsXG4gICAgICBzaXplOiBmaWxlQmxvYi5zaXplXG4gICAgfSxcbiAgICBoYW5kbGVyOiBnZXRGaWxlSGFuZGxlcihmaWxlQmxvYilcbiAgfSkpO1xuXG4gIC8vIHJlYWRlciAtPiBwYXJzZXIgLT4gYXVnbWVudCAtPiByZWNlaXZlVmlzRGF0YVxuICBjb25zdCBsb2FkRmlsZVRhc2tzID0gW1xuICAgIFRhc2suYWxsKGZpbGVzVG9Mb2FkLm1hcChMT0FEX0ZJTEVfVEFTSykpLmJpbWFwKFxuICAgICAgcmVzdWx0cyA9PiB1cGRhdGVWaXNEYXRhKHJlc3VsdHMsIHtjZW50ZXJNYXA6IHRydWV9KSxcbiAgICAgIGVycm9yID0+IGxvYWRGaWxlc0VycihlcnJvcilcbiAgICApXG4gIF07XG5cbiAgcmV0dXJuIHdpdGhUYXNrKFxuICAgIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgZmlsZUxvYWRpbmc6IHRydWVcbiAgICB9LFxuICAgIGxvYWRGaWxlVGFza3NcbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBsb2FkRmlsZXNFcnJVcGRhdGVyID0gKHN0YXRlLCB7ZXJyb3J9KSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgZmlsZUxvYWRpbmc6IGZhbHNlLFxuICBmaWxlTG9hZGluZ0VycjogZXJyb3Jcbn0pO1xuXG4vKipcbiAqIGhlbHBlciBmdW5jdGlvbiB0byB1cGRhdGUgQWxsIGxheWVyIGRvbWFpbiBhbmQgbGF5ZXIgZGF0YSBvZiBzdGF0ZVxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBzdGF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGFzZXRzXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBzdGF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkRGVmYXVsdExheWVycyhzdGF0ZSwgZGF0YXNldHMpIHtcbiAgY29uc3QgZGVmYXVsdExheWVycyA9IE9iamVjdC52YWx1ZXMoZGF0YXNldHMpLnJlZHVjZShcbiAgICAoYWNjdSwgZGF0YXNldCkgPT4gWy4uLmFjY3UsIC4uLihmaW5kRGVmYXVsdExheWVyKGRhdGFzZXQpIHx8IFtdKV0sXG4gICAgW11cbiAgKTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGxheWVyczogWy4uLnN0YXRlLmxheWVycywgLi4uZGVmYXVsdExheWVyc10sXG4gICAgbGF5ZXJPcmRlcjogW1xuICAgICAgLy8gcHV0IG5ldyBsYXllcnMgb24gdG9wIG9mIG9sZCBvbmVzXG4gICAgICAuLi5kZWZhdWx0TGF5ZXJzLm1hcCgoXywgaSkgPT4gc3RhdGUubGF5ZXJzLmxlbmd0aCArIGkpLFxuICAgICAgLi4uc3RhdGUubGF5ZXJPcmRlclxuICAgIF1cbiAgfTtcbn1cblxuLyoqXG4gKiBoZWxwZXIgZnVuY3Rpb24gdG8gZmluZCBkZWZhdWx0IHRvb2x0aXBzXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHN0YXRlXG4gKiBAcGFyYW0ge29iamVjdH0gZGF0YXNldFxuICogQHJldHVybnMge29iamVjdH0gc3RhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZERlZmF1bHRUb29sdGlwcyhzdGF0ZSwgZGF0YXNldCkge1xuICBjb25zdCB0b29sdGlwRmllbGRzID0gZmluZEZpZWxkc1RvU2hvdyhkYXRhc2V0KTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGludGVyYWN0aW9uQ29uZmlnOiB7XG4gICAgICAuLi5zdGF0ZS5pbnRlcmFjdGlvbkNvbmZpZyxcbiAgICAgIHRvb2x0aXA6IHtcbiAgICAgICAgLi4uc3RhdGUuaW50ZXJhY3Rpb25Db25maWcudG9vbHRpcCxcbiAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgLy8gZmluZCBkZWZhdWx0IGZpZWxkcyB0byBzaG93IGluIHRvb2x0aXBcbiAgICAgICAgICBmaWVsZHNUb1Nob3c6IHtcbiAgICAgICAgICAgIC4uLnN0YXRlLmludGVyYWN0aW9uQ29uZmlnLnRvb2x0aXAuY29uZmlnLmZpZWxkc1RvU2hvdyxcbiAgICAgICAgICAgIC4uLnRvb2x0aXBGaWVsZHNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogaGVscGVyIGZ1bmN0aW9uIHRvIHVwZGF0ZSBsYXllciBkb21haW5zIGZvciBhbiBhcnJheSBvZiBkYXRzZXRzXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHN0YXRlXG4gKiBAcGFyYW0ge2FycmF5IHwgc3RyaW5nfSBkYXRhSWRcbiAqIEByZXR1cm5zIHtvYmplY3R9IHN0YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVBbGxMYXllckRvbWFpbkRhdGEoc3RhdGUsIGRhdGFJZCkge1xuICBjb25zdCBkYXRhSWRzID0gdHlwZW9mIGRhdGFJZCA9PT0gJ3N0cmluZycgPyBbZGF0YUlkXSA6IGRhdGFJZDtcbiAgY29uc3QgbmV3TGF5ZXJzID0gW107XG4gIGNvbnN0IG5ld0xheWVyRGF0YXMgPSBbXTtcblxuICBzdGF0ZS5sYXllcnMuZm9yRWFjaCgob2xkTGF5ZXIsIGkpID0+IHtcbiAgICBpZiAob2xkTGF5ZXIuY29uZmlnLmRhdGFJZCAmJiBkYXRhSWRzLmluY2x1ZGVzKG9sZExheWVyLmNvbmZpZy5kYXRhSWQpKSB7XG4gICAgICBjb25zdCBuZXdMYXllciA9IG9sZExheWVyLnVwZGF0ZUxheWVyRG9tYWluKFxuICAgICAgICBzdGF0ZS5kYXRhc2V0c1tvbGRMYXllci5jb25maWcuZGF0YUlkXVxuICAgICAgKTtcbiAgICAgIGNvbnN0IHtsYXllckRhdGEsIGxheWVyfSA9IGNhbGN1bGF0ZUxheWVyRGF0YShcbiAgICAgICAgbmV3TGF5ZXIsXG4gICAgICAgIHN0YXRlLFxuICAgICAgICBzdGF0ZS5sYXllckRhdGFbaV1cbiAgICAgICk7XG5cbiAgICAgIG5ld0xheWVycy5wdXNoKGxheWVyKTtcbiAgICAgIG5ld0xheWVyRGF0YXMucHVzaChsYXllckRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdMYXllcnMucHVzaChvbGRMYXllcik7XG4gICAgICBuZXdMYXllckRhdGFzLnB1c2goc3RhdGUubGF5ZXJEYXRhW2ldKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgbGF5ZXJzOiBuZXdMYXllcnMsXG4gICAgbGF5ZXJEYXRhOiBuZXdMYXllckRhdGFzXG4gIH07XG59XG5cbiJdfQ==