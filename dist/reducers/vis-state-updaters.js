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

  var newLayer = new KeplerGLLayers.Layer({
    isVisible: true,
    isConfigActive: true,
    dataId: defaultDataset
  });

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

  var defaultOptions = { centerMap: true };
  var options = (0, _extends14.default)({}, defaultOptions, action.options);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy92aXMtc3RhdGUtdXBkYXRlcnMuanMiXSwibmFtZXMiOlsibGF5ZXJDb25maWdDaGFuZ2VVcGRhdGVyIiwibGF5ZXJUeXBlQ2hhbmdlVXBkYXRlciIsImxheWVyVmlzdWFsQ2hhbm5lbENoYW5nZVVwZGF0ZXIiLCJsYXllclZpc0NvbmZpZ0NoYW5nZVVwZGF0ZXIiLCJpbnRlcmFjdGlvbkNvbmZpZ0NoYW5nZVVwZGF0ZXIiLCJzZXRGaWx0ZXJVcGRhdGVyIiwiYWRkRGVmYXVsdExheWVycyIsImFkZERlZmF1bHRUb29sdGlwcyIsInVwZGF0ZUFsbExheWVyRG9tYWluRGF0YSIsIktlcGxlckdMTGF5ZXJzIiwiSU5JVElBTF9WSVNfU1RBVEUiLCJsYXllcnMiLCJsYXllckRhdGEiLCJsYXllclRvQmVNZXJnZWQiLCJsYXllck9yZGVyIiwiZmlsdGVycyIsImZpbHRlclRvQmVNZXJnZWQiLCJkYXRhc2V0cyIsImVkaXRpbmdEYXRhc2V0IiwidW5kZWZpbmVkIiwiaW50ZXJhY3Rpb25Db25maWciLCJpbnRlcmFjdGlvblRvQmVNZXJnZWQiLCJsYXllckJsZW5kaW5nIiwiaG92ZXJJbmZvIiwiY2xpY2tlZCIsImZpbGVMb2FkaW5nIiwiZmlsZUxvYWRpbmdFcnIiLCJzcGxpdE1hcHMiLCJ1cGRhdGVTdGF0ZVdpdGhMYXllckFuZERhdGEiLCJzdGF0ZSIsImxheWVyIiwiaWR4IiwibWFwIiwibHlyIiwiaSIsImQiLCJhY3Rpb24iLCJvbGRMYXllciIsImZpbmRJbmRleCIsImwiLCJpZCIsInByb3BzIiwiT2JqZWN0Iiwia2V5cyIsIm5ld0NvbmZpZyIsIm5ld0xheWVyIiwidXBkYXRlTGF5ZXJDb25maWciLCJzaG91bGRDYWxjdWxhdGVMYXllckRhdGEiLCJvbGRMYXllckRhdGEiLCJzYW1lRGF0YSIsIm5ld1N0YXRlIiwidG9nZ2xlTGF5ZXJGcm9tU3BsaXRNYXBzIiwibmV3VHlwZSIsIm9sZElkIiwiZXJyb3IiLCJMYXllckNsYXNzIiwiY29uZmlnIiwiYXNzaWduQ29uZmlnVG9MYXllciIsInNldHRpbmdzIiwib2xkTGF5ZXJNYXAiLCJvdGhlckxheWVycyIsImNoYW5uZWwiLCJkYXRhSWQiLCJkYXRhIiwiYWxsRGF0YSIsInVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbCIsIm5ld1Zpc0NvbmZpZyIsInZpc0NvbmZpZyIsImVuYWJsZWQiLCJmb3JFYWNoIiwiayIsInByb3AiLCJ2YWx1ZSIsIm5ld0ZpbHRlciIsImZpZWxkcyIsImZpZWxkSWR4IiwiZiIsIm5hbWUiLCJmaWVsZCIsImZpbHRlclByb3AiLCJmcmVlemUiLCJzZXRGaWx0ZXJQbG90VXBkYXRlciIsIm5ld1Byb3AiLCJwbG90VHlwZSIsImFkZEZpbHRlclVwZGF0ZXIiLCJ0b2dnbGVGaWx0ZXJBbmltYXRpb25VcGRhdGVyIiwiaXNBbmltYXRpbmciLCJ1cGRhdGVBbmltYXRpb25TcGVlZFVwZGF0ZXIiLCJzcGVlZCIsImVubGFyZ2VGaWx0ZXJVcGRhdGVyIiwiaXNFbmxhcmdlZCIsImVubGFyZ2VkIiwicmVtb3ZlRmlsdGVyVXBkYXRlciIsIm5ld0ZpbHRlcnMiLCJzbGljZSIsImxlbmd0aCIsImFkZExheWVyVXBkYXRlciIsImRlZmF1bHREYXRhc2V0IiwiTGF5ZXIiLCJpc1Zpc2libGUiLCJpc0NvbmZpZ0FjdGl2ZSIsImFkZE5ld0xheWVyc1RvU3BsaXRNYXAiLCJyZW1vdmVMYXllclVwZGF0ZXIiLCJsYXllclRvUmVtb3ZlIiwibmV3TWFwcyIsInJlbW92ZUxheWVyRnJvbVNwbGl0TWFwcyIsImZpbHRlciIsInBpZCIsImlzTGF5ZXJIb3ZlcmVkIiwicmVvcmRlckxheWVyVXBkYXRlciIsIm9yZGVyIiwicmVtb3ZlRGF0YXNldFVwZGF0ZXIiLCJkYXRhc2V0S2V5Iiwia2V5IiwiZGF0YXNldCIsIm5ld0RhdGFzZXRzIiwiaW5kZXhlcyIsInJlZHVjZSIsImxpc3RPZkluZGV4ZXMiLCJpbmRleCIsInB1c2giLCJjdXJyZW50U3RhdGUiLCJpbmRleENvdW50ZXIiLCJjdXJyZW50SW5kZXgiLCJ0b29sdGlwIiwiZmllbGRzVG9TaG93IiwidXBkYXRlTGF5ZXJCbGVuZGluZ1VwZGF0ZXIiLCJtb2RlIiwic2hvd0RhdGFzZXRUYWJsZVVwZGF0ZXIiLCJyZXNldE1hcENvbmZpZ1VwZGF0ZXIiLCJyZWNlaXZlTWFwQ29uZmlnVXBkYXRlciIsInBheWxvYWQiLCJ2aXNTdGF0ZSIsInJlc2V0U3RhdGUiLCJtZXJnZWRTdGF0ZSIsImxheWVySG92ZXJVcGRhdGVyIiwiaW5mbyIsImxheWVyQ2xpY2tVcGRhdGVyIiwicGlja2VkIiwibWFwQ2xpY2tVcGRhdGVyIiwidG9nZ2xlU3BsaXRNYXBVcGRhdGVyIiwiY29tcHV0ZVNwbGl0TWFwTGF5ZXJzIiwiY2xvc2VTcGVjaWZpY01hcEF0SW5kZXgiLCJzZXRWaXNpYmxlTGF5ZXJzRm9yTWFwVXBkYXRlciIsIm1hcEluZGV4IiwibGF5ZXJJZHMiLCJuZXdMYXllcnMiLCJjdXJyZW50TGF5ZXJzIiwiaW5jbHVkZXMiLCJ0b2dnbGVMYXllckZvck1hcFVwZGF0ZXIiLCJtYXBTZXR0aW5ncyIsImxheWVySWQiLCJuZXdTcGxpdE1hcHMiLCJ1cGRhdGVWaXNEYXRhVXBkYXRlciIsIkFycmF5IiwiaXNBcnJheSIsImRlZmF1bHRPcHRpb25zIiwiY2VudGVyTWFwIiwib3B0aW9ucyIsIm5ld0RhdGVFbnRyaWVzIiwiYWNjdSIsInN0YXRlV2l0aE5ld0RhdGEiLCJvbGRMYXllcnMiLCJ0b29sdGlwRmllbGRzIiwiZ2VuZXJhdGVMYXllck1ldGFGb3JTcGxpdFZpZXdzIiwiaXNBdmFpbGFibGUiLCJtYXBMYXllcnMiLCJjdXJyZW50TGF5ZXIiLCJfIiwiaW5kZXhUb1JldHJpZXZlIiwibWV0YVNldHRpbmdzIiwibG9hZEZpbGVzVXBkYXRlciIsImZpbGVzIiwiZmlsZXNUb0xvYWQiLCJmaWxlQmxvYiIsImxhYmVsIiwic2l6ZSIsImhhbmRsZXIiLCJsb2FkRmlsZVRhc2tzIiwiYWxsIiwiYmltYXAiLCJyZXN1bHRzIiwibG9hZEZpbGVzRXJyVXBkYXRlciIsImRlZmF1bHRMYXllcnMiLCJ2YWx1ZXMiLCJkYXRhSWRzIiwibmV3TGF5ZXJEYXRhcyIsInVwZGF0ZUxheWVyRG9tYWluIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQWlHZ0JBLHdCLEdBQUFBLHdCO1FBNEJBQyxzQixHQUFBQSxzQjtRQTZDQUMsK0IsR0FBQUEsK0I7UUFpQkFDLDJCLEdBQUFBLDJCO1FBNEJBQyw4QixHQUFBQSw4QjtRQXVCQUMsZ0IsR0FBQUEsZ0I7UUFxc0JBQyxnQixHQUFBQSxnQjtRQXdCQUMsa0IsR0FBQUEsa0I7UUE0QkFDLHdCLEdBQUFBLHdCOztBQXYrQmhCOzs7O0FBQ0E7O0FBQ0E7O0FBR0E7O0FBR0E7O0FBR0E7O0FBQ0E7O0FBRUE7O0FBT0E7O0FBRUE7O0FBS0E7O0FBQ0E7O0FBRUE7O0FBT0E7O0lBQVlDLGM7O0FBQ1o7Ozs7OztBQWhDQTtBQWtDTyxJQUFNQyxnREFBb0I7QUFDL0I7QUFDQUMsVUFBUSxFQUZ1QjtBQUcvQkMsYUFBVyxFQUhvQjtBQUkvQkMsbUJBQWlCLEVBSmM7QUFLL0JDLGNBQVksRUFMbUI7O0FBTy9CO0FBQ0FDLFdBQVMsRUFSc0I7QUFTL0JDLG9CQUFrQixFQVRhOztBQVcvQjtBQUNBQyxZQUFVLEVBWnFCO0FBYS9CQyxrQkFBZ0JDLFNBYmU7O0FBZS9CQyxxQkFBbUIsOENBZlk7QUFnQi9CQyx5QkFBdUJGLFNBaEJROztBQWtCL0JHLGlCQUFlLFFBbEJnQjtBQW1CL0JDLGFBQVdKLFNBbkJvQjtBQW9CL0JLLFdBQVNMLFNBcEJzQjs7QUFzQi9CTSxlQUFhLEtBdEJrQjtBQXVCL0JDLGtCQUFnQixJQXZCZTs7QUF5Qi9CO0FBQ0FDLGFBQVc7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFaUztBQTFCb0IsQ0FBMUI7O0FBL0JQOzs7QUFOQTs7O0FBK0VBLFNBQVNDLDJCQUFULENBQXFDQyxLQUFyQyxRQUFxRTtBQUFBLE1BQXhCakIs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QVFyQyxRQUFSLENBQWlCL0csU0FBU21CLE1BQVQsQ0FBZ0JNLE1BQWpDLENBQTlCLEVBQXdFO0FBQ3RFLFVBQU1qQixXQUFXUixTQUFTc0osaUJBQVQsQ0FDZjlKLE1BQU1aLFFBQU4sQ0FBZW9CLFNBQVNtQixNQUFULENBQWdCTSxNQUEvQixDQURlLENBQWpCOztBQURzRSxpQ0FJM0Msb0NBQ3pCakIsUUFEeUIsRUFFekJoQixLQUZ5QixFQUd6QkEsTUFBTWpCLFNBQU4sQ0FBZ0JzQixDQUFoQixDQUh5QixDQUoyQztBQUFBLFVBSS9EdEIsU0FKK0Qsd0JBSS9EQSxTQUorRDtBQUFBLFVBSXBEa0IsS0FKb0Qsd0JBSXBEQSxLQUpvRDs7QUFVdEVvSCxnQkFBVTFCLElBQVYsQ0FBZTFGLEtBQWY7QUFDQTRKLG9CQUFjbEUsSUFBZCxDQUFtQjVHLFNBQW5CO0FBQ0QsS0FaRCxNQVlPO0FBQ0xzSSxnQkFBVTFCLElBQVYsQ0FBZW5GLFFBQWY7QUFDQXFKLG9CQUFjbEUsSUFBZCxDQUFtQjNGLE1BQU1qQixTQUFOLENBQWdCc0IsQ0FBaEIsQ0FBbkI7QUFDRDtBQUNGLEdBakJEOztBQW1CQSxxQ0FDS0wsS0FETDtBQUVFbEIsWUFBUXVJLFNBRlY7QUFHRXRJLGVBQVc4SztBQUhiO0FBS0QiLCJmaWxlIjoidmlzLXN0YXRlLXVwZGF0ZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsb25lRGVlcCBmcm9tICdsb2Rhc2guY2xvbmVkZWVwJztcbmltcG9ydCB7Y29uc29sZSBhcyBDb25zb2xlfSBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCB7VGFzaywgd2l0aFRhc2t9IGZyb20gJ3JlYWN0LXBhbG0nO1xuXG4vLyBUYXNrc1xuaW1wb3J0IHtMT0FEX0ZJTEVfVEFTS30gZnJvbSAndGFza3MvdGFza3MnO1xuXG4vLyBBY3Rpb25zXG5pbXBvcnQge3VwZGF0ZVZpc0RhdGEsIGxvYWRGaWxlc0Vycn0gZnJvbSAnYWN0aW9ucy92aXMtc3RhdGUtYWN0aW9ucyc7XG5cbi8vIFV0aWxzXG5pbXBvcnQge2dldERlZmF1bHRJbnRlcmFjdGlvbn0gZnJvbSAndXRpbHMvaW50ZXJhY3Rpb24tdXRpbHMnO1xuaW1wb3J0IHtnZW5lcmF0ZUhhc2hJZH0gZnJvbSAndXRpbHMvdXRpbHMnO1xuaW1wb3J0IHtmaW5kRmllbGRzVG9TaG93fSBmcm9tICd1dGlscy9pbnRlcmFjdGlvbi11dGlscyc7XG5pbXBvcnQge1xuICBnZXREZWZhdWx0ZmlsdGVyLFxuICBnZXRGaWx0ZXJQcm9wcyxcbiAgZ2V0RmlsdGVyUGxvdCxcbiAgZ2V0RGVmYXVsdEZpbHRlclBsb3RUeXBlLFxuICBmaWx0ZXJEYXRhXG59IGZyb20gJ3V0aWxzL2ZpbHRlci11dGlscyc7XG5pbXBvcnQge2NyZWF0ZU5ld0RhdGFFbnRyeX0gZnJvbSAndXRpbHMvZGF0YXNldC11dGlscyc7XG5cbmltcG9ydCB7XG4gIGZpbmREZWZhdWx0TGF5ZXIsXG4gIGNhbGN1bGF0ZUxheWVyRGF0YVxufSBmcm9tICd1dGlscy9sYXllci11dGlscy9sYXllci11dGlscyc7XG5cbmltcG9ydCB7Z2V0RmlsZUhhbmRsZXJ9IGZyb20gJ3Byb2Nlc3Nvci9maWxlLWhhbmRsZXInO1xuaW1wb3J0IHtmaW5kTWFwQm91bmRzfSBmcm9tICd1dGlscy9kYXRhLXV0aWxzJztcblxuaW1wb3J0IHtcbiAgbWVyZ2VGaWx0ZXJzLFxuICBtZXJnZUxheWVycyxcbiAgbWVyZ2VJbnRlcmFjdGlvbnMsXG4gIG1lcmdlTGF5ZXJCbGVuZGluZ1xufSBmcm9tICcuL3Zpcy1zdGF0ZS1tZXJnZXInO1xuXG5pbXBvcnQgKiBhcyBLZXBsZXJHTExheWVycyBmcm9tICdrZXBsZXJnbC1sYXllcnMnO1xuaW1wb3J0IHtMQVlFUl9DTEFTU0VTfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbmV4cG9ydCBjb25zdCBJTklUSUFMX1ZJU19TVEFURSA9IHtcbiAgLy8gbGF5ZXJzXG4gIGxheWVyczogW10sXG4gIGxheWVyRGF0YTogW10sXG4gIGxheWVyVG9CZU1lcmdlZDogW10sXG4gIGxheWVyT3JkZXI6IFtdLFxuXG4gIC8vIGZpbHRlcnNcbiAgZmlsdGVyczogW10sXG4gIGZpbHRlclRvQmVNZXJnZWQ6IFtdLFxuXG4gIC8vIGEgY29sbGVjdGlvbiBvZiBtdWx0aXBsZSBkYXRhc2V0XG4gIGRhdGFzZXRzOiB7fSxcbiAgZWRpdGluZ0RhdGFzZXQ6IHVuZGVmaW5lZCxcblxuICBpbnRlcmFjdGlvbkNvbmZpZzogZ2V0RGVmYXVsdEludGVyYWN0aW9uKCksXG4gIGludGVyYWN0aW9uVG9CZU1lcmdlZDogdW5kZWZpbmVkLFxuXG4gIGxheWVyQmxlbmRpbmc6ICdub3JtYWwnLFxuICBob3ZlckluZm86IHVuZGVmaW5lZCxcbiAgY2xpY2tlZDogdW5kZWZpbmVkLFxuXG4gIGZpbGVMb2FkaW5nOiBmYWxzZSxcbiAgZmlsZUxvYWRpbmdFcnI6IG51bGwsXG5cbiAgLy8gdGhpcyBpcyB1c2VkIHdoZW4gdXNlciBzcGxpdCBtYXBzXG4gIHNwbGl0TWFwczogW1xuICAgIC8vIHRoaXMgd2lsbCBjb250YWluIGEgbGlzdCBvZiBvYmplY3RzIHRvXG4gICAgLy8gZGVzY3JpYmUgdGhlIHN0YXRlIG9mIGxheWVyIGF2YWlsYWJpbGl0eSBhbmQgdmlzaWJpbGl0eSBmb3IgZWFjaCBtYXBcbiAgICAvLyBbXG4gICAgLy8gICB7XG4gICAgLy8gICAgIGxheWVyczoge1xuICAgIC8vICAgICAgIGxheWVyX2lkOiB7XG4gICAgLy8gICAgICAgICBpc0F2YWlsYWJsZTogdHJ1ZXxmYWxzZSAjIHRoaXMgaXMgZHJpdmVuIGJ5IHRoZSBsZWZ0IGhhbmQgcGFuZWxcbiAgICAvLyAgICAgICAgIGlzVmlzaWJsZTogdHJ1ZXxmYWxzZVxuICAgIC8vICAgICAgIH1cbiAgICAvLyAgICAgfVxuICAgIC8vICAgfVxuICAgIC8vIF1cbiAgXVxufTtcblxuZnVuY3Rpb24gdXBkYXRlU3RhdGVXaXRoTGF5ZXJBbmREYXRhKHN0YXRlLCB7bGF5ZXJEYXRhLCBsYXllciwgaWR4fSkge1xuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGxheWVyczogc3RhdGUubGF5ZXJzLm1hcCgobHlyLCBpKSA9PiAoaSA9PT0gaWR4ID8gbGF5ZXIgOiBseXIpKSxcbiAgICBsYXllckRhdGE6IGxheWVyRGF0YVxuICAgICAgPyBzdGF0ZS5sYXllckRhdGEubWFwKChkLCBpKSA9PiAoaSA9PT0gaWR4ID8gbGF5ZXJEYXRhIDogZCkpXG4gICAgICA6IHN0YXRlLmxheWVyRGF0YVxuICB9O1xufVxuXG4vKipcbiAqIENhbGxlZCB0byB1cGRhdGUgbGF5ZXIgYmFzZSBjb25maWc6IGRhdGFJZCwgbGFiZWwsIGNvbHVtbiwgaXNWaXNpYmxlXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gbGF5ZXJDb25maWdDaGFuZ2VVcGRhdGVyKHN0YXRlLCBhY3Rpb24pIHtcbiAgY29uc3Qge29sZExheWVyfSA9IGFjdGlvbjtcbiAgY29uc3QgaWR4ID0gc3RhdGUubGF5ZXJzLmZpbmRJbmRleChsID0+IGwuaWQgPT09IG9sZExheWVyLmlkKTtcbiAgY29uc3QgcHJvcHMgPSBPYmplY3Qua2V5cyhhY3Rpb24ubmV3Q29uZmlnKTtcblxuICBjb25zdCBuZXdMYXllciA9IG9sZExheWVyLnVwZGF0ZUxheWVyQ29uZmlnKGFjdGlvbi5uZXdDb25maWcpO1xuICBpZiAobmV3TGF5ZXIuc2hvdWxkQ2FsY3VsYXRlTGF5ZXJEYXRhKHByb3BzKSkge1xuICAgIGNvbnN0IG9sZExheWVyRGF0YSA9IHN0YXRlLmxheWVyRGF0YVtpZHhdO1xuICAgIGNvbnN0IHtsYXllckRhdGEsIGxheWVyfSA9IGNhbGN1bGF0ZUxheWVyRGF0YShcbiAgICAgIG5ld0xheWVyLFxuICAgICAgc3RhdGUsXG4gICAgICBvbGRMYXllckRhdGEsXG4gICAgICB7c2FtZURhdGE6IHRydWV9XG4gICAgKTtcbiAgICByZXR1cm4gdXBkYXRlU3RhdGVXaXRoTGF5ZXJBbmREYXRhKHN0YXRlLCB7bGF5ZXJEYXRhLCBsYXllciwgaWR4fSk7XG4gIH1cblxuICBjb25zdCBuZXdTdGF0ZSA9IHtcbiAgICAuLi5zdGF0ZSxcbiAgICBzcGxpdE1hcHM6XG4gICAgICAnaXNWaXNpYmxlJyBpbiBhY3Rpb24ubmV3Q29uZmlnXG4gICAgICAgID8gdG9nZ2xlTGF5ZXJGcm9tU3BsaXRNYXBzKHN0YXRlLCBuZXdMYXllcilcbiAgICAgICAgOiBzdGF0ZS5zcGxpdE1hcHNcbiAgfTtcblxuICByZXR1cm4gdXBkYXRlU3RhdGVXaXRoTGF5ZXJBbmREYXRhKG5ld1N0YXRlLCB7bGF5ZXI6IG5ld0xheWVyLCBpZHh9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxheWVyVHlwZUNoYW5nZVVwZGF0ZXIoc3RhdGUsIGFjdGlvbikge1xuICBjb25zdCB7b2xkTGF5ZXIsIG5ld1R5cGV9ID0gYWN0aW9uO1xuICBjb25zdCBvbGRJZCA9IG9sZExheWVyLmlkO1xuICBjb25zdCBpZHggPSBzdGF0ZS5sYXllcnMuZmluZEluZGV4KGwgPT4gbC5pZCA9PT0gb2xkSWQpO1xuXG4gIGlmICghTEFZRVJfQ0xBU1NFU1tuZXdUeXBlXSB8fCAhS2VwbGVyR0xMYXllcnNbTEFZRVJfQ0xBU1NFU1tuZXdUeXBlXV0pIHtcbiAgICBDb25zb2xlLmVycm9yKGAke25ld1R5cGV9IGlzIG5vdCBhIHZhbGlkIGxheWVyIHR5cGVgKTtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICAvLyBnZXQgYSBtaW50IGxheWVyLCB3aXRoIG5ldyBpZCBhbmQgdHlwZVxuICAvLyBiZWNhdXNlIGRlY2suZ2wgdXNlcyBpZCB0byBtYXRjaCBiZXR3ZWVuIG5ldyBhbmQgb2xkIGxheWVyLlxuICAvLyBJZiB0eXBlIGhhcyBjaGFuZ2VkIGJ1dCBpZCBpcyB0aGUgc2FtZSwgaXQgd2lsbCBicmVha1xuICBjb25zdCBMYXllckNsYXNzID0gS2VwbGVyR0xMYXllcnNbTEFZRVJfQ0xBU1NFU1tuZXdUeXBlXV07XG4gIGNvbnN0IG5ld0xheWVyID0gbmV3IExheWVyQ2xhc3MoKTtcblxuICBuZXdMYXllci5jb25maWcgPSBuZXdMYXllci5hc3NpZ25Db25maWdUb0xheWVyKFxuICAgIG5ld0xheWVyLmNvbmZpZyxcbiAgICBvbGRMYXllci5jb25maWdcbiAgKTtcblxuICBjb25zdCB7bGF5ZXJEYXRhLCBsYXllcn0gPSBjYWxjdWxhdGVMYXllckRhdGEobmV3TGF5ZXIsIHN0YXRlKTtcblxuICBsZXQgbmV3U3RhdGUgPSBzdGF0ZTtcblxuICAvLyB1cGRhdGUgc3BsaXRNYXAgbGF5ZXIgaWRcbiAgaWYgKHN0YXRlLnNwbGl0TWFwcykge1xuICAgIG5ld1N0YXRlID0ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBzcGxpdE1hcHM6IHN0YXRlLnNwbGl0TWFwcy5tYXAoc2V0dGluZ3MgPT4ge1xuICAgICAgICBjb25zdCB7W29sZElkXTogb2xkTGF5ZXJNYXAsIC4uLm90aGVyTGF5ZXJzfSA9IHNldHRpbmdzLmxheWVycztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5zZXR0aW5ncyxcbiAgICAgICAgICBsYXllcnM6IHtcbiAgICAgICAgICAgIC4uLm90aGVyTGF5ZXJzLFxuICAgICAgICAgICAgW2xheWVyLmlkXTogb2xkTGF5ZXJNYXBcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9KVxuICAgIH07XG4gIH1cblxuICByZXR1cm4gdXBkYXRlU3RhdGVXaXRoTGF5ZXJBbmREYXRhKG5ld1N0YXRlLCB7bGF5ZXJEYXRhLCBsYXllciwgaWR4fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYXllclZpc3VhbENoYW5uZWxDaGFuZ2VVcGRhdGVyKHN0YXRlLCBhY3Rpb24pIHtcbiAgY29uc3Qge29sZExheWVyLCBuZXdDb25maWcsIGNoYW5uZWx9ID0gYWN0aW9uO1xuICBjb25zdCB7ZGF0YSwgYWxsRGF0YX0gPSBzdGF0ZS5kYXRhc2V0c1tvbGRMYXllci5jb25maWcuZGF0YUlkXTtcblxuICBjb25zdCBpZHggPSBzdGF0ZS5sYXllcnMuZmluZEluZGV4KGwgPT4gbC5pZCA9PT0gb2xkTGF5ZXIuaWQpO1xuICBjb25zdCBuZXdMYXllciA9IG9sZExheWVyLnVwZGF0ZUxheWVyQ29uZmlnKG5ld0NvbmZpZyk7XG5cbiAgbmV3TGF5ZXIudXBkYXRlTGF5ZXJWaXN1YWxDaGFubmVsKHtkYXRhLCBhbGxEYXRhfSwgY2hhbm5lbCk7XG5cbiAgY29uc3Qgb2xkTGF5ZXJEYXRhID0gc3RhdGUubGF5ZXJEYXRhW2lkeF07XG4gIGNvbnN0IHtsYXllckRhdGEsIGxheWVyfSA9IGNhbGN1bGF0ZUxheWVyRGF0YShuZXdMYXllciwgc3RhdGUsIG9sZExheWVyRGF0YSwge1xuICAgIHNhbWVEYXRhOiB0cnVlXG4gIH0pO1xuXG4gIHJldHVybiB1cGRhdGVTdGF0ZVdpdGhMYXllckFuZERhdGEoc3RhdGUsIHtsYXllckRhdGEsIGxheWVyLCBpZHh9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxheWVyVmlzQ29uZmlnQ2hhbmdlVXBkYXRlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIGNvbnN0IHtvbGRMYXllcn0gPSBhY3Rpb247XG4gIGNvbnN0IGlkeCA9IHN0YXRlLmxheWVycy5maW5kSW5kZXgobCA9PiBsLmlkID09PSBvbGRMYXllci5pZCk7XG4gIGNvbnN0IHByb3BzID0gT2JqZWN0LmtleXMoYWN0aW9uLm5ld1Zpc0NvbmZpZyk7XG5cbiAgY29uc3QgbmV3VmlzQ29uZmlnID0ge1xuICAgIC4uLm9sZExheWVyLmNvbmZpZy52aXNDb25maWcsXG4gICAgLi4uYWN0aW9uLm5ld1Zpc0NvbmZpZ1xuICB9O1xuXG4gIGNvbnN0IG5ld0xheWVyID0gb2xkTGF5ZXIudXBkYXRlTGF5ZXJDb25maWcoe3Zpc0NvbmZpZzogbmV3VmlzQ29uZmlnfSk7XG5cbiAgaWYgKG5ld0xheWVyLnNob3VsZENhbGN1bGF0ZUxheWVyRGF0YShwcm9wcykpIHtcbiAgICBjb25zdCBvbGRMYXllckRhdGEgPSBzdGF0ZS5sYXllckRhdGFbaWR4XTtcbiAgICBjb25zdCB7bGF5ZXJEYXRhLCBsYXllcn0gPSBjYWxjdWxhdGVMYXllckRhdGEoXG4gICAgICBuZXdMYXllcixcbiAgICAgIHN0YXRlLFxuICAgICAgb2xkTGF5ZXJEYXRhLFxuICAgICAge3NhbWVEYXRhOiB0cnVlfVxuICAgICk7XG4gICAgcmV0dXJuIHVwZGF0ZVN0YXRlV2l0aExheWVyQW5kRGF0YShzdGF0ZSwge2xheWVyRGF0YSwgbGF5ZXIsIGlkeH0pO1xuICB9XG5cbiAgcmV0dXJuIHVwZGF0ZVN0YXRlV2l0aExheWVyQW5kRGF0YShzdGF0ZSwge2xheWVyOiBuZXdMYXllciwgaWR4fSk7XG59XG5cbi8qIGVzbGludC1lbmFibGUgbWF4LXN0YXRlbWVudHMgKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGludGVyYWN0aW9uQ29uZmlnQ2hhbmdlVXBkYXRlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIGNvbnN0IHtjb25maWd9ID0gYWN0aW9uO1xuXG4gIGNvbnN0IGludGVyYWN0aW9uQ29uZmlnID0ge1xuICAgIC4uLnN0YXRlLmludGVyYWN0aW9uQ29uZmlnLFxuICAgIC4uLntbY29uZmlnLmlkXTogY29uZmlnfVxuICB9O1xuXG4gIGlmIChjb25maWcuZW5hYmxlZCAmJiAhc3RhdGUuaW50ZXJhY3Rpb25Db25maWdbY29uZmlnLmlkXS5lbmFibGVkKSB7XG4gICAgLy8gb25seSBlbmFibGUgb25lIGludGVyYWN0aW9uIGF0IGEgdGltZVxuICAgIE9iamVjdC5rZXlzKGludGVyYWN0aW9uQ29uZmlnKS5mb3JFYWNoKGsgPT4ge1xuICAgICAgaWYgKGsgIT09IGNvbmZpZy5pZCkge1xuICAgICAgICBpbnRlcmFjdGlvbkNvbmZpZ1trXSA9IHsuLi5pbnRlcmFjdGlvbkNvbmZpZ1trXSwgZW5hYmxlZDogZmFsc2V9O1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBpbnRlcmFjdGlvbkNvbmZpZ1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0RmlsdGVyVXBkYXRlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIGNvbnN0IHtpZHgsIHByb3AsIHZhbHVlfSA9IGFjdGlvbjtcbiAgbGV0IG5ld1N0YXRlID0gc3RhdGU7XG4gIGxldCBuZXdGaWx0ZXIgPSB7XG4gICAgLi4uc3RhdGUuZmlsdGVyc1tpZHhdLFxuICAgIFtwcm9wXTogdmFsdWVcbiAgfTtcblxuICBjb25zdCB7ZGF0YUlkfSA9IG5ld0ZpbHRlcjtcbiAgaWYgKCFkYXRhSWQpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cbiAgY29uc3Qge2ZpZWxkcywgYWxsRGF0YX0gPSBzdGF0ZS5kYXRhc2V0c1tkYXRhSWRdO1xuXG4gIHN3aXRjaCAocHJvcCkge1xuICAgIGNhc2UgJ2RhdGFJZCc6XG4gICAgICAvLyBpZiB0cnlpbmcgdG8gdXBkYXRlIGZpbHRlciBkYXRhSWQuIGNyZWF0ZSBhbiBlbXB0eSBuZXcgZmlsdGVyXG4gICAgICBuZXdGaWx0ZXIgPSBnZXREZWZhdWx0ZmlsdGVyKGRhdGFJZCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ25hbWUnOlxuICAgICAgLy8gZmluZCB0aGUgZmllbGRcbiAgICAgIGNvbnN0IGZpZWxkSWR4ID0gZmllbGRzLmZpbmRJbmRleChmID0+IGYubmFtZSA9PT0gdmFsdWUpO1xuICAgICAgbGV0IGZpZWxkID0gZmllbGRzW2ZpZWxkSWR4XTtcblxuICAgICAgaWYgKCFmaWVsZC5maWx0ZXJQcm9wKSB7XG4gICAgICAgIC8vIGdldCBmaWx0ZXIgZG9tYWluIGZyb20gZmllbGRcbiAgICAgICAgLy8gc2F2ZSBmaWx0ZXJQcm9wczoge2RvbWFpbiwgc3RlcHMsIHZhbHVlfSB0byBmaWVsZCwgYXZvaWQgcmVjYWxjdWxhdGVcbiAgICAgICAgZmllbGQgPSB7XG4gICAgICAgICAgLi4uZmllbGQsXG4gICAgICAgICAgZmlsdGVyUHJvcDogZ2V0RmlsdGVyUHJvcHMoYWxsRGF0YSwgZmllbGQpXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIG5ld0ZpbHRlciA9IHtcbiAgICAgICAgLi4ubmV3RmlsdGVyLFxuICAgICAgICAuLi5maWVsZC5maWx0ZXJQcm9wLFxuICAgICAgICBuYW1lOiBmaWVsZC5uYW1lLFxuICAgICAgICAvLyBjYW4ndCBlZGl0IGRhdGFJZCBvbmNlIG5hbWUgaXMgc2VsZWN0ZWRcbiAgICAgICAgZnJlZXplOiB0cnVlLFxuICAgICAgICBmaWVsZElkeFxuICAgICAgfTtcblxuICAgICAgbmV3U3RhdGUgPSB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBkYXRhc2V0czoge1xuICAgICAgICAgIC4uLnN0YXRlLmRhdGFzZXRzLFxuICAgICAgICAgIFtkYXRhSWRdOiB7XG4gICAgICAgICAgICAuLi5zdGF0ZS5kYXRhc2V0c1tkYXRhSWRdLFxuICAgICAgICAgICAgZmllbGRzOiBmaWVsZHMubWFwKChkLCBpKSA9PiAoaSA9PT0gZmllbGRJZHggPyBmaWVsZCA6IGQpKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3ZhbHVlJzpcbiAgICBkZWZhdWx0OlxuICAgICAgYnJlYWs7XG4gIH1cblxuICAvLyBzYXZlIG5ldyBmaWx0ZXJzIHRvIG5ld1N0YXRlXG4gIG5ld1N0YXRlID0ge1xuICAgIC4uLm5ld1N0YXRlLFxuICAgIGZpbHRlcnM6IHN0YXRlLmZpbHRlcnMubWFwKChmLCBpKSA9PiAoaSA9PT0gaWR4ID8gbmV3RmlsdGVyIDogZikpXG4gIH07XG5cbiAgLy8gZmlsdGVyIGRhdGFcbiAgbmV3U3RhdGUgPSB7XG4gICAgLi4ubmV3U3RhdGUsXG4gICAgZGF0YXNldHM6IHtcbiAgICAgIC4uLm5ld1N0YXRlLmRhdGFzZXRzLFxuICAgICAgW2RhdGFJZF06IHtcbiAgICAgICAgLi4ubmV3U3RhdGUuZGF0YXNldHNbZGF0YUlkXSxcbiAgICAgICAgLi4uZmlsdGVyRGF0YShhbGxEYXRhLCBkYXRhSWQsIG5ld1N0YXRlLmZpbHRlcnMpXG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIG5ld1N0YXRlID0gdXBkYXRlQWxsTGF5ZXJEb21haW5EYXRhKG5ld1N0YXRlLCBkYXRhSWQpO1xuXG4gIHJldHVybiBuZXdTdGF0ZTtcbn1cblxuZXhwb3J0IGNvbnN0IHNldEZpbHRlclBsb3RVcGRhdGVyID0gKHN0YXRlLCB7aWR4LCBuZXdQcm9wfSkgPT4ge1xuICBsZXQgbmV3RmlsdGVyID0gey4uLnN0YXRlLmZpbHRlcnNbaWR4XSwgLi4ubmV3UHJvcH07XG4gIGNvbnN0IHByb3AgPSBPYmplY3Qua2V5cyhuZXdQcm9wKVswXTtcbiAgaWYgKHByb3AgPT09ICd5QXhpcycpIHtcbiAgICBjb25zdCBwbG90VHlwZSA9IGdldERlZmF1bHRGaWx0ZXJQbG90VHlwZShuZXdGaWx0ZXIpO1xuXG4gICAgaWYgKHBsb3RUeXBlKSB7XG4gICAgICBuZXdGaWx0ZXIgPSB7XG4gICAgICAgIC4uLm5ld0ZpbHRlcixcbiAgICAgICAgLi4uZ2V0RmlsdGVyUGxvdChcbiAgICAgICAgICB7Li4ubmV3RmlsdGVyLCBwbG90VHlwZX0sXG4gICAgICAgICAgc3RhdGUuZGF0YXNldHNbbmV3RmlsdGVyLmRhdGFJZF0uYWxsRGF0YVxuICAgICAgICApLFxuICAgICAgICBwbG90VHlwZVxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGZpbHRlcnM6IHN0YXRlLmZpbHRlcnMubWFwKChmLCBpKSA9PiAoaSA9PT0gaWR4ID8gbmV3RmlsdGVyIDogZikpXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgYWRkRmlsdGVyVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PlxuICAhYWN0aW9uLmRhdGFJZFxuICAgID8gc3RhdGVcbiAgICA6IHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGZpbHRlcnM6IFsuLi5zdGF0ZS5maWx0ZXJzLCBnZXREZWZhdWx0ZmlsdGVyKGFjdGlvbi5kYXRhSWQpXVxuICAgICAgfTtcblxuZXhwb3J0IGNvbnN0IHRvZ2dsZUZpbHRlckFuaW1hdGlvblVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGZpbHRlcnM6IHN0YXRlLmZpbHRlcnMubWFwKFxuICAgIChmLCBpKSA9PiAoaSA9PT0gYWN0aW9uLmlkeCA/IHsuLi5mLCBpc0FuaW1hdGluZzogIWYuaXNBbmltYXRpbmd9IDogZilcbiAgKVxufSk7XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVBbmltYXRpb25TcGVlZFVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGZpbHRlcnM6IHN0YXRlLmZpbHRlcnMubWFwKFxuICAgIChmLCBpKSA9PiAoaSA9PT0gYWN0aW9uLmlkeCA/IHsuLi5mLCBzcGVlZDogYWN0aW9uLnNwZWVkfSA6IGYpXG4gIClcbn0pO1xuXG4gIGV4cG9ydCBjb25zdCBlbmxhcmdlRmlsdGVyVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIGNvbnN0IGlzRW5sYXJnZWQgPSBzdGF0ZS5maWx0ZXJzW2FjdGlvbi5pZHhdLmVubGFyZ2VkO1xuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgZmlsdGVyczogc3RhdGUuZmlsdGVycy5tYXAoKGYsIGkpID0+IHtcbiAgICAgIGYuZW5sYXJnZWQgPSAhaXNFbmxhcmdlZCAmJiBpID09PSBhY3Rpb24uaWR4O1xuICAgICAgcmV0dXJuIGY7XG4gICAgfSlcbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCByZW1vdmVGaWx0ZXJVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgY29uc3Qge2lkeH0gPSBhY3Rpb247XG4gIGNvbnN0IHtkYXRhSWR9ID0gc3RhdGUuZmlsdGVyc1tpZHhdO1xuXG4gIGNvbnN0IG5ld0ZpbHRlcnMgPSBbXG4gICAgLi4uc3RhdGUuZmlsdGVycy5zbGljZSgwLCBpZHgpLFxuICAgIC4uLnN0YXRlLmZpbHRlcnMuc2xpY2UoaWR4ICsgMSwgc3RhdGUuZmlsdGVycy5sZW5ndGgpXG4gIF07XG5cbiAgY29uc3QgbmV3U3RhdGUgPSB7XG4gICAgLi4uc3RhdGUsXG4gICAgZGF0YXNldHM6IHtcbiAgICAgIC4uLnN0YXRlLmRhdGFzZXRzLFxuICAgICAgW2RhdGFJZF06IHtcbiAgICAgICAgLi4uc3RhdGUuZGF0YXNldHNbZGF0YUlkXSxcbiAgICAgICAgLi4uZmlsdGVyRGF0YShzdGF0ZS5kYXRhc2V0c1tkYXRhSWRdLmFsbERhdGEsIGRhdGFJZCwgbmV3RmlsdGVycylcbiAgICAgIH1cbiAgICB9LFxuICAgIGZpbHRlcnM6IG5ld0ZpbHRlcnNcbiAgfTtcblxuICByZXR1cm4gdXBkYXRlQWxsTGF5ZXJEb21haW5EYXRhKG5ld1N0YXRlLCBkYXRhSWQpO1xufTtcblxuZXhwb3J0IGNvbnN0IGFkZExheWVyVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIGNvbnN0IGRlZmF1bHREYXRhc2V0ID0gT2JqZWN0LmtleXMoc3RhdGUuZGF0YXNldHMpWzBdO1xuXG4gIGNvbnN0IG5ld0xheWVyID0gbmV3IEtlcGxlckdMTGF5ZXJzLkxheWVyKHtcbiAgICBpc1Zpc2libGU6IHRydWUsXG4gICAgaXNDb25maWdBY3RpdmU6IHRydWUsXG4gICAgZGF0YUlkOiBkZWZhdWx0RGF0YXNldFxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGxheWVyczogWy4uLnN0YXRlLmxheWVycywgbmV3TGF5ZXJdLFxuICAgIGxheWVyRGF0YTogWy4uLnN0YXRlLmxheWVyRGF0YSwge31dLFxuICAgIGxheWVyT3JkZXI6IFsuLi5zdGF0ZS5sYXllck9yZGVyLCBzdGF0ZS5sYXllck9yZGVyLmxlbmd0aF0sXG4gICAgc3BsaXRNYXBzOiBhZGROZXdMYXllcnNUb1NwbGl0TWFwKHN0YXRlLnNwbGl0TWFwcywgbmV3TGF5ZXIpXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgcmVtb3ZlTGF5ZXJVcGRhdGVyID0gKHN0YXRlLCB7aWR4fSkgPT4ge1xuICBjb25zdCB7bGF5ZXJzLCBsYXllckRhdGEsIGNsaWNrZWQsIGhvdmVySW5mb30gPSBzdGF0ZTtcbiAgY29uc3QgbGF5ZXJUb1JlbW92ZSA9IHN0YXRlLmxheWVyc1tpZHhdO1xuICBjb25zdCBuZXdNYXBzID0gcmVtb3ZlTGF5ZXJGcm9tU3BsaXRNYXBzKHN0YXRlLCBsYXllclRvUmVtb3ZlKTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGxheWVyczogWy4uLmxheWVycy5zbGljZSgwLCBpZHgpLCAuLi5sYXllcnMuc2xpY2UoaWR4ICsgMSwgbGF5ZXJzLmxlbmd0aCldLFxuICAgIGxheWVyRGF0YTogW1xuICAgICAgLi4ubGF5ZXJEYXRhLnNsaWNlKDAsIGlkeCksXG4gICAgICAuLi5sYXllckRhdGEuc2xpY2UoaWR4ICsgMSwgbGF5ZXJEYXRhLmxlbmd0aClcbiAgICBdLFxuICAgIGxheWVyT3JkZXI6IHN0YXRlLmxheWVyT3JkZXJcbiAgICAgIC5maWx0ZXIoaSA9PiBpICE9PSBpZHgpXG4gICAgICAubWFwKHBpZCA9PiAocGlkID4gaWR4ID8gcGlkIC0gMSA6IHBpZCkpLFxuICAgIGNsaWNrZWQ6IGxheWVyVG9SZW1vdmUuaXNMYXllckhvdmVyZWQoY2xpY2tlZCkgPyB1bmRlZmluZWQgOiBjbGlja2VkLFxuICAgIGhvdmVySW5mbzogbGF5ZXJUb1JlbW92ZS5pc0xheWVySG92ZXJlZChob3ZlckluZm8pID8gdW5kZWZpbmVkIDogaG92ZXJJbmZvLFxuICAgIHNwbGl0TWFwczogbmV3TWFwc1xuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IHJlb3JkZXJMYXllclVwZGF0ZXIgPSAoc3RhdGUsIHtvcmRlcn0pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBsYXllck9yZGVyOiBvcmRlclxufSk7XG5cbmV4cG9ydCBjb25zdCByZW1vdmVEYXRhc2V0VXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIC8vIGV4dHJhY3QgZGF0YXNldCBrZXlcbiAgY29uc3Qge2tleTogZGF0YXNldEtleX0gPSBhY3Rpb247XG4gIGNvbnN0IHtkYXRhc2V0c30gPSBzdGF0ZTtcblxuICAvLyBjaGVjayBpZiBkYXRhc2V0IGlzIHByZXNlbnRcbiAgaWYgKCFkYXRhc2V0c1tkYXRhc2V0S2V5XSkge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4gIGNvbnN0IHtsYXllcnMsIGRhdGFzZXRzOiB7W2RhdGFzZXRLZXldOiBkYXRhc2V0LCAuLi5uZXdEYXRhc2V0c319ID0gc3RhdGU7XG4gIC8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cblxuICBjb25zdCBpbmRleGVzID0gbGF5ZXJzLnJlZHVjZSgobGlzdE9mSW5kZXhlcywgbGF5ZXIsIGluZGV4KSA9PiB7XG4gICAgaWYgKGxheWVyLmNvbmZpZy5kYXRhSWQgPT09IGRhdGFzZXRLZXkpIHtcbiAgICAgIGxpc3RPZkluZGV4ZXMucHVzaChpbmRleCk7XG4gICAgfVxuICAgIHJldHVybiBsaXN0T2ZJbmRleGVzO1xuICB9LCBbXSk7XG5cbiAgLy8gcmVtb3ZlIGxheWVycyBhbmQgZGF0YXNldHNcbiAgY29uc3Qge25ld1N0YXRlfSA9IGluZGV4ZXMucmVkdWNlKFxuICAgICh7bmV3U3RhdGU6IGN1cnJlbnRTdGF0ZSwgaW5kZXhDb3VudGVyfSwgaWR4KSA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50SW5kZXggPSBpZHggLSBpbmRleENvdW50ZXI7XG4gICAgICBjdXJyZW50U3RhdGUgPSByZW1vdmVMYXllclVwZGF0ZXIoY3VycmVudFN0YXRlLCB7aWR4OiBjdXJyZW50SW5kZXh9KTtcbiAgICAgIGluZGV4Q291bnRlcisrO1xuICAgICAgcmV0dXJuIHtuZXdTdGF0ZTogY3VycmVudFN0YXRlLCBpbmRleENvdW50ZXJ9O1xuICAgIH0sXG4gICAge25ld1N0YXRlOiB7Li4uc3RhdGUsIGRhdGFzZXRzOiBuZXdEYXRhc2V0c30sIGluZGV4Q291bnRlcjogMH1cbiAgKTtcblxuICAvLyByZW1vdmUgZmlsdGVyc1xuICBjb25zdCBmaWx0ZXJzID0gc3RhdGUuZmlsdGVycy5maWx0ZXIoZmlsdGVyID0+IGZpbHRlci5kYXRhSWQgIT09IGRhdGFzZXRLZXkpO1xuXG4gIC8vIHVwZGF0ZSBpbnRlcmFjdGlvbkNvbmZpZ1xuICBsZXQge2ludGVyYWN0aW9uQ29uZmlnfSA9IHN0YXRlO1xuICBjb25zdCB7dG9vbHRpcH0gPSBpbnRlcmFjdGlvbkNvbmZpZztcbiAgaWYgKHRvb2x0aXApIHtcbiAgICBjb25zdCB7Y29uZmlnfSA9IHRvb2x0aXA7XG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgICBjb25zdCB7W2RhdGFzZXRLZXldOiBmaWVsZHMsIC4uLmZpZWxkc1RvU2hvd30gPSBjb25maWcuZmllbGRzVG9TaG93O1xuICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgICBpbnRlcmFjdGlvbkNvbmZpZyA9IHtcbiAgICAgIC4uLmludGVyYWN0aW9uQ29uZmlnLFxuICAgICAgdG9vbHRpcDogey4uLnRvb2x0aXAsIGNvbmZpZzogey4uLmNvbmZpZywgZmllbGRzVG9TaG93fX1cbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHsuLi5uZXdTdGF0ZSwgZmlsdGVycywgaW50ZXJhY3Rpb25Db25maWd9O1xufTtcblxuZXhwb3J0IGNvbnN0IHVwZGF0ZUxheWVyQmxlbmRpbmdVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBsYXllckJsZW5kaW5nOiBhY3Rpb24ubW9kZVxufSk7XG5cbmV4cG9ydCBjb25zdCBzaG93RGF0YXNldFRhYmxlVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgZWRpdGluZ0RhdGFzZXQ6IGFjdGlvbi5kYXRhSWRcbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCByZXNldE1hcENvbmZpZ1VwZGF0ZXIgPSAoKSA9PiBjbG9uZURlZXAoSU5JVElBTF9WSVNfU1RBVEUpO1xuXG4vKipcbiAqIExvYWRzIGN1c3RvbSBjb25maWd1cmF0aW9uIGludG8gc3RhdGVcbiAqIEBwYXJhbSBzdGF0ZVxuICogQHBhcmFtIGFjdGlvblxuICogQHJldHVybnMgeyp9XG4gKi9cbmV4cG9ydCBjb25zdCByZWNlaXZlTWFwQ29uZmlnVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIGlmICghYWN0aW9uLnBheWxvYWQudmlzU3RhdGUpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICBjb25zdCB7XG4gICAgZmlsdGVycyxcbiAgICBsYXllcnMsXG4gICAgaW50ZXJhY3Rpb25Db25maWcsXG4gICAgbGF5ZXJCbGVuZGluZyxcbiAgICBzcGxpdE1hcHNcbiAgfSA9IGFjdGlvbi5wYXlsb2FkLnZpc1N0YXRlO1xuXG4gIC8vIGFsd2F5cyByZXNldCBjb25maWcgd2hlbiByZWNlaXZlIGEgbmV3IGNvbmZpZ1xuICBjb25zdCByZXNldFN0YXRlID0gcmVzZXRNYXBDb25maWdVcGRhdGVyKCk7XG4gIGxldCBtZXJnZWRTdGF0ZSA9IHtcbiAgICAuLi5yZXNldFN0YXRlLFxuICAgIHNwbGl0TWFwczogc3BsaXRNYXBzIHx8IFtdIC8vIG1hcHMgZG9lc24ndCByZXF1aXJlIGFueSBsb2dpY1xuICB9O1xuXG4gIG1lcmdlZFN0YXRlID0gbWVyZ2VGaWx0ZXJzKG1lcmdlZFN0YXRlLCBmaWx0ZXJzKTtcbiAgbWVyZ2VkU3RhdGUgPSBtZXJnZUxheWVycyhtZXJnZWRTdGF0ZSwgbGF5ZXJzKTtcbiAgbWVyZ2VkU3RhdGUgPSBtZXJnZUludGVyYWN0aW9ucyhtZXJnZWRTdGF0ZSwgaW50ZXJhY3Rpb25Db25maWcpO1xuICBtZXJnZWRTdGF0ZSA9IG1lcmdlTGF5ZXJCbGVuZGluZyhtZXJnZWRTdGF0ZSwgbGF5ZXJCbGVuZGluZyk7XG5cbiAgLy8gY29uc3QgbmV3U3RhdGUgPXtcbiAgLy8gICAuLi5yZXNldFN0YXRlLFxuICAvLyAgIC4uLm1lcmdlRmlsdGVycyhtZXJnZWRTdGF0ZSwgZmlsdGVycyksXG4gIC8vICAgLi4ubWVyZ2VMYXllcnMobWVyZ2VkU3RhdGUsIGxheWVycyksXG4gIC8vICAgLi4ubWVyZ2VJbnRlcmFjdGlvbnMobWVyZ2VkU3RhdGUsIGludGVyYWN0aW9uQ29uZmlnKSxcbiAgLy8gICAuLi5tZXJnZUxheWVyQmxlbmRpbmcobWVyZ2VkU3RhdGUsIGxheWVyQmxlbmRpbmcpXG4gIC8vIH07XG5cbiAgcmV0dXJuIG1lcmdlZFN0YXRlO1xufTtcblxuZXhwb3J0IGNvbnN0IGxheWVySG92ZXJVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBob3ZlckluZm86IGFjdGlvbi5pbmZvXG59KTtcblxuZXhwb3J0IGNvbnN0IGxheWVyQ2xpY2tVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBjbGlja2VkOiBhY3Rpb24uaW5mbyAmJiBhY3Rpb24uaW5mby5waWNrZWQgPyBhY3Rpb24uaW5mbyA6IG51bGxcbn0pO1xuXG5leHBvcnQgY29uc3QgbWFwQ2xpY2tVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBjbGlja2VkOiBudWxsXG59KTtcblxuZXhwb3J0IGNvbnN0IHRvZ2dsZVNwbGl0TWFwVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PlxuICBzdGF0ZS5zcGxpdE1hcHMgJiYgc3RhdGUuc3BsaXRNYXBzLmxlbmd0aCA9PT0gMFxuICAgID8ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgLy8gbWF5YmUgd2Ugc2hvdWxkIHVzZSBhbiBhcnJheSB0byBzdG9yZSBzdGF0ZSBmb3IgYSBzaW5nbGUgbWFwIGFzIHdlbGxcbiAgICAgICAgLy8gaWYgY3VycmVudCBtYXBzIGxlbmd0aCBpcyBlcXVhbCB0byAwIGl0IG1lYW5zIHRoYXQgd2UgYXJlIGFib3V0IHRvIHNwbGl0IHRoZSB2aWV3XG4gICAgICAgIHNwbGl0TWFwczogY29tcHV0ZVNwbGl0TWFwTGF5ZXJzKHN0YXRlLmxheWVycylcbiAgICAgIH1cbiAgICA6IGNsb3NlU3BlY2lmaWNNYXBBdEluZGV4KHN0YXRlLCBhY3Rpb24pO1xuXG4vKipcbiAqIFRoaXMgaXMgdHJpZ2dlcmVkIHdoZW4gdmlldyBpcyBzcGxpdCBpbnRvIG11bHRpcGxlIG1hcHMuXG4gKiBJdCB3aWxsIG9ubHkgdXBkYXRlIGxheWVycyB0aGF0IGJlbG9uZyB0byB0aGUgbWFwIGxheWVyIGRyb3Bkb3duXG4gKiB0aGUgdXNlciBpcyBpbnRlcmFjdGluZyB3aXRcbiAqIEBwYXJhbSBzdGF0ZVxuICogQHBhcmFtIGFjdGlvblxuICovXG5leHBvcnQgY29uc3Qgc2V0VmlzaWJsZUxheWVyc0Zvck1hcFVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCB7bWFwSW5kZXgsIGxheWVySWRzfSA9IGFjdGlvbjtcbiAgaWYgKCFsYXllcklkcykge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIGNvbnN0IHtzcGxpdE1hcHMgPSBbXX0gPSBzdGF0ZTtcblxuICBpZiAoc3BsaXRNYXBzLmxlbmd0aCA9PT0gMCkge1xuICAgIC8vIHdlIHNob3VsZCBuZXZlciBnZXQgaW50byB0aGlzIHN0YXRlXG4gICAgLy8gYmVjYXVzZSB0aGlzIGFjdGlvbiBzaG91bGQgb25seSBiZSB0cmlnZ2VyZWRcbiAgICAvLyB3aGVuIG1hcCB2aWV3IGlzIHNwbGl0XG4gICAgLy8gYnV0IHNvbWV0aGluZyBtYXkgaGF2ZSBoYXBwZW5lZFxuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIC8vIG5lZWQgdG8gY2hlY2sgaWYgbWFwcyBpcyBwb3B1bGF0ZWQgb3RoZXJ3aXNlIHdpbGwgY3JlYXRlXG4gIGNvbnN0IHtbbWFwSW5kZXhdOiBtYXAgPSB7fX0gPSBzcGxpdE1hcHM7XG5cbiAgY29uc3QgbGF5ZXJzID0gbWFwLmxheWVycyB8fCBbXTtcblxuICAvLyB3ZSBzZXQgdmlzaWJpbGl0eSB0byB0cnVlIGZvciBhbGwgbGF5ZXJzIGluY2x1ZGVkIGluIG91ciBpbnB1dCBsaXN0XG4gIGNvbnN0IG5ld0xheWVycyA9IChPYmplY3Qua2V5cyhsYXllcnMpIHx8IFtdKS5yZWR1Y2UoKGN1cnJlbnRMYXllcnMsIGlkeCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5jdXJyZW50TGF5ZXJzLFxuICAgICAgW2lkeF06IHtcbiAgICAgICAgLi4ubGF5ZXJzW2lkeF0sXG4gICAgICAgIGlzVmlzaWJsZTogbGF5ZXJJZHMuaW5jbHVkZXMoaWR4KVxuICAgICAgfVxuICAgIH07XG4gIH0sIHt9KTtcblxuICBjb25zdCBuZXdNYXBzID0gWy4uLnNwbGl0TWFwc107XG5cbiAgbmV3TWFwc1ttYXBJbmRleF0gPSB7XG4gICAgLi4uc3BsaXRNYXBzW21hcEluZGV4XSxcbiAgICBsYXllcnM6IG5ld0xheWVyc1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgc3BsaXRNYXBzOiBuZXdNYXBzXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgdG9nZ2xlTGF5ZXJGb3JNYXBVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgaWYgKCFzdGF0ZS5zcGxpdE1hcHNbYWN0aW9uLm1hcEluZGV4XSkge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIGNvbnN0IG1hcFNldHRpbmdzID0gc3RhdGUuc3BsaXRNYXBzW2FjdGlvbi5tYXBJbmRleF07XG4gIGNvbnN0IHtsYXllcnN9ID0gbWFwU2V0dGluZ3M7XG4gIGlmICghbGF5ZXJzIHx8ICFsYXllcnNbYWN0aW9uLmxheWVySWRdKSB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgY29uc3QgbGF5ZXIgPSBsYXllcnNbYWN0aW9uLmxheWVySWRdO1xuXG4gIGNvbnN0IG5ld0xheWVyID0ge1xuICAgIC4uLmxheWVyLFxuICAgIGlzVmlzaWJsZTogIWxheWVyLmlzVmlzaWJsZVxuICB9O1xuXG4gIGNvbnN0IG5ld0xheWVycyA9IHtcbiAgICAuLi5sYXllcnMsXG4gICAgW2FjdGlvbi5sYXllcklkXTogbmV3TGF5ZXJcbiAgfTtcblxuICAvLyBjb25zdCBzcGxpdE1hcHMgPSBzdGF0ZS5zcGxpdE1hcHM7XG4gIGNvbnN0IG5ld1NwbGl0TWFwcyA9IFsuLi5zdGF0ZS5zcGxpdE1hcHNdO1xuICBuZXdTcGxpdE1hcHNbYWN0aW9uLm1hcEluZGV4XSA9IHtcbiAgICAuLi5tYXBTZXR0aW5ncyxcbiAgICBsYXllcnM6IG5ld0xheWVyc1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgc3BsaXRNYXBzOiBuZXdTcGxpdE1hcHNcbiAgfTtcbn07XG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1zdGF0ZW1lbnRzICovXG5leHBvcnQgY29uc3QgdXBkYXRlVmlzRGF0YVVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAvLyBkYXRhc2V0cyBjYW4gYmUgYSBzaW5nbGUgZGF0YSBlbnRyaWVzIG9yIGFuIGFycmF5IG9mIG11bHRpcGxlIGRhdGEgZW50cmllc1xuICBjb25zdCBkYXRhc2V0cyA9IEFycmF5LmlzQXJyYXkoYWN0aW9uLmRhdGFzZXRzKVxuICAgID8gYWN0aW9uLmRhdGFzZXRzXG4gICAgOiBbYWN0aW9uLmRhdGFzZXRzXTtcblxuICBjb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtjZW50ZXJNYXA6IHRydWV9O1xuICBjb25zdCBvcHRpb25zID0ge1xuICAgIC4uLmRlZmF1bHRPcHRpb25zLFxuICAgIC4uLmFjdGlvbi5vcHRpb25zXG4gIH07XG5cbiAgaWYgKGFjdGlvbi5jb25maWcpIHtcbiAgICAvLyBhcHBseSBjb25maWcgaWYgcGFzc2VkIGZyb20gYWN0aW9uXG4gICAgc3RhdGUgPSByZWNlaXZlTWFwQ29uZmlnVXBkYXRlcihzdGF0ZSwge3BheWxvYWQ6IHt2aXNTdGF0ZTogYWN0aW9uLmNvbmZpZ319KVxuICB9XG5cbiAgY29uc3QgbmV3RGF0ZUVudHJpZXMgPSBkYXRhc2V0cy5yZWR1Y2UoXG4gICAgKGFjY3UsIHtpbmZvID0ge30sIGRhdGF9KSA9PiAoe1xuICAgICAgLi4uYWNjdSxcbiAgICAgIC4uLihjcmVhdGVOZXdEYXRhRW50cnkoe2luZm8sIGRhdGF9LCBzdGF0ZS5kYXRhc2V0cykgfHwge30pXG4gICAgfSksXG4gICAge31cbiAgKTtcblxuICBpZiAoIU9iamVjdC5rZXlzKG5ld0RhdGVFbnRyaWVzKS5sZW5ndGgpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICBjb25zdCBzdGF0ZVdpdGhOZXdEYXRhID0ge1xuICAgIC4uLnN0YXRlLFxuICAgIGRhdGFzZXRzOiB7XG4gICAgICAuLi5zdGF0ZS5kYXRhc2V0cyxcbiAgICAgIC4uLm5ld0RhdGVFbnRyaWVzXG4gICAgfVxuICB9O1xuXG4gIC8vIHByZXZpb3VzbHkgc2F2ZWQgY29uZmlnIGJlZm9yZSBkYXRhIGxvYWRlZFxuICBjb25zdCB7XG4gICAgZmlsdGVyVG9CZU1lcmdlZCA9IFtdLFxuICAgIGxheWVyVG9CZU1lcmdlZCA9IFtdLFxuICAgIGludGVyYWN0aW9uVG9CZU1lcmdlZCA9IHt9XG4gIH0gPSBzdGF0ZVdpdGhOZXdEYXRhO1xuXG4gIC8vIGtlZXAgYSBjb3B5IG9mIG9sZExheWVyc1xuICBjb25zdCBvbGRMYXllcnMgPSBzdGF0ZS5sYXllcnMubWFwKGwgPT4gbC5pZCk7XG5cbiAgLy8gbWVyZ2Ugc3RhdGUgd2l0aCBzYXZlZCBmaWx0ZXJzXG4gIGxldCBtZXJnZWRTdGF0ZSA9IG1lcmdlRmlsdGVycyhzdGF0ZVdpdGhOZXdEYXRhLCBmaWx0ZXJUb0JlTWVyZ2VkKTtcbiAgLy8gbWVyZ2Ugc3RhdGUgd2l0aCBzYXZlZCBsYXllcnNcbiAgbWVyZ2VkU3RhdGUgPSBtZXJnZUxheWVycyhtZXJnZWRTdGF0ZSwgbGF5ZXJUb0JlTWVyZ2VkKTtcblxuICBpZiAobWVyZ2VkU3RhdGUubGF5ZXJzLmxlbmd0aCA9PT0gc3RhdGUubGF5ZXJzLmxlbmd0aCkge1xuICAgIC8vIG5vIGxheWVyIG1lcmdlZCwgZmluZCBkZWZhdWx0c1xuICAgIG1lcmdlZFN0YXRlID0gYWRkRGVmYXVsdExheWVycyhtZXJnZWRTdGF0ZSwgbmV3RGF0ZUVudHJpZXMpO1xuICB9XG5cbiAgaWYgKG1lcmdlZFN0YXRlLnNwbGl0TWFwcy5sZW5ndGgpIHtcbiAgICBjb25zdCBuZXdMYXllcnMgPSBtZXJnZWRTdGF0ZS5sYXllcnMuZmlsdGVyKFxuICAgICAgbCA9PiBsLmNvbmZpZy5kYXRhSWQgaW4gbmV3RGF0ZUVudHJpZXNcbiAgICApO1xuICAgIC8vIGlmIG1hcCBpcyBzcGxpdGVkLCBhZGQgbmV3IGxheWVycyB0byBzcGxpdE1hcHNcbiAgICBtZXJnZWRTdGF0ZSA9IHtcbiAgICAgIC4uLm1lcmdlZFN0YXRlLFxuICAgICAgc3BsaXRNYXBzOiBhZGROZXdMYXllcnNUb1NwbGl0TWFwKG1lcmdlZFN0YXRlLnNwbGl0TWFwcywgbmV3TGF5ZXJzKVxuICAgIH07XG4gIH1cblxuICAvLyBtZXJnZSBzdGF0ZSB3aXRoIHNhdmVkIGludGVyYWN0aW9uc1xuICBtZXJnZWRTdGF0ZSA9IG1lcmdlSW50ZXJhY3Rpb25zKG1lcmdlZFN0YXRlLCBpbnRlcmFjdGlvblRvQmVNZXJnZWQpO1xuXG4gIC8vIGlmIG5vIHRvb2x0aXBzIG1lcmdlZCBhZGQgZGVmYXVsdCB0b29sdGlwc1xuICBPYmplY3Qua2V5cyhuZXdEYXRlRW50cmllcykuZm9yRWFjaChkYXRhSWQgPT4ge1xuICAgIGNvbnN0IHRvb2x0aXBGaWVsZHMgPVxuICAgICAgbWVyZ2VkU3RhdGUuaW50ZXJhY3Rpb25Db25maWcudG9vbHRpcC5jb25maWcuZmllbGRzVG9TaG93W2RhdGFJZF07XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHRvb2x0aXBGaWVsZHMpIHx8ICF0b29sdGlwRmllbGRzLmxlbmd0aCkge1xuICAgICAgbWVyZ2VkU3RhdGUgPSBhZGREZWZhdWx0VG9vbHRpcHMobWVyZ2VkU3RhdGUsIG5ld0RhdGVFbnRyaWVzW2RhdGFJZF0pO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHVwZGF0ZUFsbExheWVyRG9tYWluRGF0YShcbiAgICBtZXJnZWRTdGF0ZSxcbiAgICBPYmplY3Qua2V5cyhuZXdEYXRlRW50cmllcylcbiAgKTtcbn07XG4vKiBlc2xpbnQtZW5hYmxlIG1heC1zdGF0ZW1lbnRzICovXG5cbmZ1bmN0aW9uIGdlbmVyYXRlTGF5ZXJNZXRhRm9yU3BsaXRWaWV3cyhsYXllcikge1xuICByZXR1cm4ge1xuICAgIGlzQXZhaWxhYmxlOiBsYXllci5jb25maWcuaXNWaXNpYmxlLFxuICAgIGlzVmlzaWJsZTogbGF5ZXIuY29uZmlnLmlzVmlzaWJsZVxuICB9O1xufVxuXG4vKipcbiAqIFRoaXMgZW10aG9kIHdpbGwgY29tcHV0ZSB0aGUgZGVmYXVsdCBtYXBzIGN1c3RvbSBsaXN0XG4gKiBiYXNlZCBvbiB0aGUgY3VycmVudCBsYXllcnMgc3RhdHVzXG4gKiBAcGFyYW0gbGF5ZXJzXG4gKiBAcmV0dXJucyB7WyosKl19XG4gKi9cbmZ1bmN0aW9uIGNvbXB1dGVTcGxpdE1hcExheWVycyhsYXllcnMpIHtcbiAgY29uc3QgbWFwTGF5ZXJzID0gbGF5ZXJzLnJlZHVjZShcbiAgICAobmV3TGF5ZXJzLCBjdXJyZW50TGF5ZXIpID0+ICh7XG4gICAgICAuLi5uZXdMYXllcnMsXG4gICAgICBbY3VycmVudExheWVyLmlkXTogZ2VuZXJhdGVMYXllck1ldGFGb3JTcGxpdFZpZXdzKGN1cnJlbnRMYXllcilcbiAgICB9KSxcbiAgICB7fVxuICApO1xuICByZXR1cm4gW1xuICAgIHtcbiAgICAgIGxheWVyczogbWFwTGF5ZXJzXG4gICAgfSxcbiAgICB7XG4gICAgICBsYXllcnM6IG1hcExheWVyc1xuICAgIH1cbiAgXTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYW4gZXhpc3RpbmcgbGF5ZXJzIGZyb20gY3VzdG9tIG1hcCBsYXllciBvYmplY3RzXG4gKiBAcGFyYW0gc3RhdGVcbiAqIEBwYXJhbSBsYXllclxuICogQHJldHVybnMge1sqLCpdfSBNYXBzIG9mIGN1c3RvbSBsYXllciBvYmplY3RzXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUxheWVyRnJvbVNwbGl0TWFwcyhzdGF0ZSwgbGF5ZXIpIHtcbiAgcmV0dXJuIHN0YXRlLnNwbGl0TWFwcy5tYXAoc2V0dGluZ3MgPT4ge1xuICAgIGNvbnN0IHtsYXllcnN9ID0gc2V0dGluZ3M7XG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgICBjb25zdCB7W2xheWVyLmlkXTogXywgLi4ubmV3TGF5ZXJzfSA9IGxheWVycztcbiAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnNldHRpbmdzLFxuICAgICAgbGF5ZXJzOiBuZXdMYXllcnNcbiAgICB9O1xuICB9KTtcbn1cblxuLyoqXG4gKiBBZGQgbmV3IGxheWVycyB0byBib3RoIGV4aXN0aW5nIG1hcHNcbiAqIEBwYXJhbSBzcGxpdE1hcHNcbiAqIEBwYXJhbSBsYXllcnNcbiAqIEByZXR1cm5zIHtbKiwqXX0gbmV3IHNwbGl0TWFwc1xuICovXG5mdW5jdGlvbiBhZGROZXdMYXllcnNUb1NwbGl0TWFwKHNwbGl0TWFwcywgbGF5ZXJzKSB7XG4gIGNvbnN0IG5ld0xheWVycyA9IEFycmF5LmlzQXJyYXkobGF5ZXJzKSA/IGxheWVycyA6IFtsYXllcnNdO1xuXG4gIGlmICghc3BsaXRNYXBzIHx8ICFzcGxpdE1hcHMubGVuZ3RoIHx8ICFuZXdMYXllcnMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHNwbGl0TWFwcztcbiAgfVxuXG4gIC8vIGFkZCBuZXcgbGF5ZXIgdG8gYm90aCBtYXBzLFxuICAvLyAgZG9uJ3Qgb3ZlcnJpZGUsIGlmIGxheWVyLmlkIGlzIGFscmVhZHkgaW4gc3BsaXRNYXBzLnNldHRpbmdzLmxheWVyc1xuICByZXR1cm4gc3BsaXRNYXBzLm1hcChzZXR0aW5ncyA9PiAoe1xuICAgIC4uLnNldHRpbmdzLFxuICAgIGxheWVyczoge1xuICAgICAgLi4uc2V0dGluZ3MubGF5ZXJzLFxuICAgICAgLi4ubmV3TGF5ZXJzLnJlZHVjZShcbiAgICAgICAgKGFjY3UsIG5ld0xheWVyKSA9PlxuICAgICAgICAgIG5ld0xheWVyLmNvbmZpZy5pc1Zpc2libGVcbiAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgIC4uLmFjY3UsXG4gICAgICAgICAgICAgICAgW25ld0xheWVyLmlkXTogc2V0dGluZ3MubGF5ZXJzW25ld0xheWVyLmlkXVxuICAgICAgICAgICAgICAgICAgPyBzZXR0aW5ncy5sYXllcnNbbmV3TGF5ZXIuaWRdXG4gICAgICAgICAgICAgICAgICA6IGdlbmVyYXRlTGF5ZXJNZXRhRm9yU3BsaXRWaWV3cyhuZXdMYXllcilcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgOiBhY2N1LFxuICAgICAgICB7fVxuICAgICAgKVxuICAgIH1cbiAgfSkpO1xufVxuXG4vKipcbiAqIEhpZGUgYW4gZXhpc3RpbmcgbGF5ZXJzIGZyb20gY3VzdG9tIG1hcCBsYXllciBvYmplY3RzXG4gKiBAcGFyYW0gc3RhdGVcbiAqIEBwYXJhbSBsYXllclxuICogQHJldHVybnMge1sqLCpdfSBNYXBzIG9mIGN1c3RvbSBsYXllciBvYmplY3RzXG4gKi9cbmZ1bmN0aW9uIHRvZ2dsZUxheWVyRnJvbVNwbGl0TWFwcyhzdGF0ZSwgbGF5ZXIpIHtcbiAgcmV0dXJuIHN0YXRlLnNwbGl0TWFwcy5tYXAoc2V0dGluZ3MgPT4ge1xuICAgIGNvbnN0IHtsYXllcnN9ID0gc2V0dGluZ3M7XG4gICAgY29uc3QgbmV3TGF5ZXJzID0ge1xuICAgICAgLi4ubGF5ZXJzLFxuICAgICAgW2xheWVyLmlkXTogZ2VuZXJhdGVMYXllck1ldGFGb3JTcGxpdFZpZXdzKGxheWVyKVxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc2V0dGluZ3MsXG4gICAgICBsYXllcnM6IG5ld0xheWVyc1xuICAgIH07XG4gIH0pO1xufVxuXG4vKipcbiAqIFdoZW4gYSB1c2VyIGNsaWNrcyBvbiB0aGUgc3BlY2lmaWMgbWFwIGNsb3NpbmcgaWNvblxuICogdGhlIGFwcGxpY2F0aW9uIHdpbGwgY2xvc2UgdGhlIHNlbGVjdGVkIG1hcFxuICogYW5kIHdpbGwgbWVyZ2UgdGhlIHJlbWFpbmluZyBvbmUgd2l0aCB0aGUgZ2xvYmFsIHN0YXRlXG4gKiBUT0RPOiBpIHRoaW5rIGluIHRoZSBmdXR1cmUgdGhpcyBhY3Rpb24gc2hvdWxkIGJlIGNhbGxlZCBtZXJnZSBtYXAgbGF5ZXJzIHdpdGggZ2xvYmFsIHNldHRpbmdzXG4gKiBAcGFyYW0gc3RhdGVcbiAqIEBwYXJhbSBhY3Rpb25cbiAqIEByZXR1cm5zIHsqfVxuICovXG5mdW5jdGlvbiBjbG9zZVNwZWNpZmljTWFwQXRJbmRleChzdGF0ZSwgYWN0aW9uKSB7XG4gIC8vIHJldHJpZXZlIGxheWVycyBtZXRhIGRhdGEgZnJvbSB0aGUgcmVtYWluaW5nIG1hcCB0aGF0IHdlIG5lZWQgdG8ga2VlcFxuICBjb25zdCBpbmRleFRvUmV0cmlldmUgPSAxIC0gYWN0aW9uLnBheWxvYWQ7XG5cbiAgY29uc3QgbWV0YVNldHRpbmdzID0gc3RhdGUuc3BsaXRNYXBzW2luZGV4VG9SZXRyaWV2ZV07XG4gIGlmICghbWV0YVNldHRpbmdzIHx8ICFtZXRhU2V0dGluZ3MubGF5ZXJzKSB7XG4gICAgLy8gaWYgd2UgY2FuJ3QgZmluZCB0aGUgbWV0YSBzZXR0aW5ncyB3ZSBzaW1wbHkgY2xlYW4gdXAgc3BsaXRNYXBzIGFuZFxuICAgIC8vIGtlZXAgZ2xvYmFsIHN0YXRlIGFzIGl0IGlzXG4gICAgLy8gYnV0IHdoeSBkb2VzIHRoaXMgZXZlciBoYXBwZW4/XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgc3BsaXRNYXBzOiBbXVxuICAgIH07XG4gIH1cblxuICBjb25zdCB7bGF5ZXJzfSA9IHN0YXRlO1xuXG4gIC8vIHVwZGF0ZSBsYXllciB2aXNpYmlsaXR5XG4gIGNvbnN0IG5ld0xheWVycyA9IGxheWVycy5tYXAobGF5ZXIgPT5cbiAgICBsYXllci51cGRhdGVMYXllckNvbmZpZyh7XG4gICAgICBpc1Zpc2libGU6IG1ldGFTZXR0aW5ncy5sYXllcnNbbGF5ZXIuaWRdXG4gICAgICAgID8gbWV0YVNldHRpbmdzLmxheWVyc1tsYXllci5pZF0uaXNWaXNpYmxlXG4gICAgICAgIDogbGF5ZXIuY29uZmlnLmlzVmlzaWJsZVxuICAgIH0pXG4gICk7XG5cbiAgLy8gZGVsZXRlIG1hcFxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGxheWVyczogbmV3TGF5ZXJzLFxuICAgIHNwbGl0TWFwczogW11cbiAgfTtcbn1cblxuLy8gVE9ETzogcmVkbyB3cml0ZSBoYW5kbGVyIHRvIG5vdCB1c2UgdGFza3NcbmV4cG9ydCBjb25zdCBsb2FkRmlsZXNVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgY29uc3Qge2ZpbGVzfSA9IGFjdGlvbjtcbiAgY29uc3QgZmlsZXNUb0xvYWQgPSBmaWxlcy5tYXAoZmlsZUJsb2IgPT4gKHtcbiAgICBmaWxlQmxvYixcbiAgICBpbmZvOiB7XG4gICAgICBpZDogZ2VuZXJhdGVIYXNoSWQoNCksXG4gICAgICBsYWJlbDogZmlsZUJsb2IubmFtZSxcbiAgICAgIHNpemU6IGZpbGVCbG9iLnNpemVcbiAgICB9LFxuICAgIGhhbmRsZXI6IGdldEZpbGVIYW5kbGVyKGZpbGVCbG9iKVxuICB9KSk7XG5cbiAgLy8gcmVhZGVyIC0+IHBhcnNlciAtPiBhdWdtZW50IC0+IHJlY2VpdmVWaXNEYXRhXG4gIGNvbnN0IGxvYWRGaWxlVGFza3MgPSBbXG4gICAgVGFzay5hbGwoZmlsZXNUb0xvYWQubWFwKExPQURfRklMRV9UQVNLKSkuYmltYXAoXG4gICAgICByZXN1bHRzID0+IHVwZGF0ZVZpc0RhdGEocmVzdWx0cywge2NlbnRlck1hcDogdHJ1ZX0pLFxuICAgICAgZXJyb3IgPT4gbG9hZEZpbGVzRXJyKGVycm9yKVxuICAgIClcbiAgXTtcblxuICByZXR1cm4gd2l0aFRhc2soXG4gICAge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBmaWxlTG9hZGluZzogdHJ1ZVxuICAgIH0sXG4gICAgbG9hZEZpbGVUYXNrc1xuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IGxvYWRGaWxlc0VyclVwZGF0ZXIgPSAoc3RhdGUsIHtlcnJvcn0pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBmaWxlTG9hZGluZzogZmFsc2UsXG4gIGZpbGVMb2FkaW5nRXJyOiBlcnJvclxufSk7XG5cbi8qKlxuICogaGVscGVyIGZ1bmN0aW9uIHRvIHVwZGF0ZSBBbGwgbGF5ZXIgZG9tYWluIGFuZCBsYXllciBkYXRhIG9mIHN0YXRlXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHN0YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0YXNldHNcbiAqIEByZXR1cm5zIHtvYmplY3R9IHN0YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGREZWZhdWx0TGF5ZXJzKHN0YXRlLCBkYXRhc2V0cykge1xuICBjb25zdCBkZWZhdWx0TGF5ZXJzID0gT2JqZWN0LnZhbHVlcyhkYXRhc2V0cykucmVkdWNlKFxuICAgIChhY2N1LCBkYXRhc2V0KSA9PiBbLi4uYWNjdSwgLi4uKGZpbmREZWZhdWx0TGF5ZXIoZGF0YXNldCkgfHwgW10pXSxcbiAgICBbXVxuICApO1xuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgbGF5ZXJzOiBbLi4uc3RhdGUubGF5ZXJzLCAuLi5kZWZhdWx0TGF5ZXJzXSxcbiAgICBsYXllck9yZGVyOiBbXG4gICAgICAvLyBwdXQgbmV3IGxheWVycyBvbiB0b3Agb2Ygb2xkIG9uZXNcbiAgICAgIC4uLmRlZmF1bHRMYXllcnMubWFwKChfLCBpKSA9PiBzdGF0ZS5sYXllcnMubGVuZ3RoICsgaSksXG4gICAgICAuLi5zdGF0ZS5sYXllck9yZGVyXG4gICAgXVxuICB9O1xufVxuXG4vKipcbiAqIGhlbHBlciBmdW5jdGlvbiB0byBmaW5kIGRlZmF1bHQgdG9vbHRpcHNcbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gc3RhdGVcbiAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhc2V0XG4gKiBAcmV0dXJucyB7b2JqZWN0fSBzdGF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkRGVmYXVsdFRvb2x0aXBzKHN0YXRlLCBkYXRhc2V0KSB7XG4gIGNvbnN0IHRvb2x0aXBGaWVsZHMgPSBmaW5kRmllbGRzVG9TaG93KGRhdGFzZXQpO1xuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgaW50ZXJhY3Rpb25Db25maWc6IHtcbiAgICAgIC4uLnN0YXRlLmludGVyYWN0aW9uQ29uZmlnLFxuICAgICAgdG9vbHRpcDoge1xuICAgICAgICAuLi5zdGF0ZS5pbnRlcmFjdGlvbkNvbmZpZy50b29sdGlwLFxuICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAvLyBmaW5kIGRlZmF1bHQgZmllbGRzIHRvIHNob3cgaW4gdG9vbHRpcFxuICAgICAgICAgIGZpZWxkc1RvU2hvdzoge1xuICAgICAgICAgICAgLi4uc3RhdGUuaW50ZXJhY3Rpb25Db25maWcudG9vbHRpcC5jb25maWcuZmllbGRzVG9TaG93LFxuICAgICAgICAgICAgLi4udG9vbHRpcEZpZWxkc1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4gKiBoZWxwZXIgZnVuY3Rpb24gdG8gdXBkYXRlIGxheWVyIGRvbWFpbnMgZm9yIGFuIGFycmF5IG9mIGRhdHNldHNcbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gc3RhdGVcbiAqIEBwYXJhbSB7YXJyYXkgfCBzdHJpbmd9IGRhdGFJZFxuICogQHJldHVybnMge29iamVjdH0gc3RhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUFsbExheWVyRG9tYWluRGF0YShzdGF0ZSwgZGF0YUlkKSB7XG4gIGNvbnN0IGRhdGFJZHMgPSB0eXBlb2YgZGF0YUlkID09PSAnc3RyaW5nJyA/IFtkYXRhSWRdIDogZGF0YUlkO1xuICBjb25zdCBuZXdMYXllcnMgPSBbXTtcbiAgY29uc3QgbmV3TGF5ZXJEYXRhcyA9IFtdO1xuXG4gIHN0YXRlLmxheWVycy5mb3JFYWNoKChvbGRMYXllciwgaSkgPT4ge1xuICAgIGlmIChvbGRMYXllci5jb25maWcuZGF0YUlkICYmIGRhdGFJZHMuaW5jbHVkZXMob2xkTGF5ZXIuY29uZmlnLmRhdGFJZCkpIHtcbiAgICAgIGNvbnN0IG5ld0xheWVyID0gb2xkTGF5ZXIudXBkYXRlTGF5ZXJEb21haW4oXG4gICAgICAgIHN0YXRlLmRhdGFzZXRzW29sZExheWVyLmNvbmZpZy5kYXRhSWRdXG4gICAgICApO1xuICAgICAgY29uc3Qge2xheWVyRGF0YSwgbGF5ZXJ9ID0gY2FsY3VsYXRlTGF5ZXJEYXRhKFxuICAgICAgICBuZXdMYXllcixcbiAgICAgICAgc3RhdGUsXG4gICAgICAgIHN0YXRlLmxheWVyRGF0YVtpXVxuICAgICAgKTtcblxuICAgICAgbmV3TGF5ZXJzLnB1c2gobGF5ZXIpO1xuICAgICAgbmV3TGF5ZXJEYXRhcy5wdXNoKGxheWVyRGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld0xheWVycy5wdXNoKG9sZExheWVyKTtcbiAgICAgIG5ld0xheWVyRGF0YXMucHVzaChzdGF0ZS5sYXllckRhdGFbaV0pO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBsYXllcnM6IG5ld0xheWVycyxcbiAgICBsYXllckRhdGE6IG5ld0xheWVyRGF0YXNcbiAgfTtcbn1cblxuIl19