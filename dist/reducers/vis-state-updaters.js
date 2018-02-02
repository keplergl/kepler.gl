'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadFilesErrUpdater = exports.loadFilesUpdater = exports.toggleLayerForMapUpdater = exports.setVisibleLayersForMapUpdater = exports.toggleSplitMapUpdater = exports.mapClickUpdater = exports.layerClickUpdater = exports.layerHoverUpdater = exports.receiveMapConfigUpdater = exports.resetMapConfigUpdater = exports.updateVisDataUpdater = exports.showDatasetTableUpdater = exports.updateLayerBlendingUpdater = exports.removeDatasetUpdater = exports.reorderLayerUpdater = exports.removeLayerUpdater = exports.addLayerUpdater = exports.removeFilterUpdater = exports.enlargeFilterUpdater = exports.updateAnimationSpeedUpdater = exports.toggleFilterAnimationUpdater = exports.addFilterUpdater = exports.setFilterPlotUpdater = exports.INITIAL_VIS_STATE = undefined;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy92aXMtc3RhdGUtdXBkYXRlcnMuanMiXSwibmFtZXMiOlsibGF5ZXJDb25maWdDaGFuZ2VVcGRhdGVyIiwibGF5ZXJUeXBlQ2hhbmdlVXBkYXRlciIsImxheWVyVmlzdWFsQ2hhbm5lbENoYW5nZVVwZGF0ZXIiLCJsYXllclZpc0NvbmZpZ0NoYW5nZVVwZGF0ZXIiLCJpbnRlcmFjdGlvbkNvbmZpZ0NoYW5nZVVwZGF0ZXIiLCJzZXRGaWx0ZXJVcGRhdGVyIiwiYWRkRGVmYXVsdExheWVycyIsImFkZERlZmF1bHRUb29sdGlwcyIsInVwZGF0ZUFsbExheWVyRG9tYWluRGF0YSIsIktlcGxlckdMTGF5ZXJzIiwiSU5JVElBTF9WSVNfU1RBVEUiLCJsYXllcnMiLCJsYXllckRhdGEiLCJsYXllclRvQmVNZXJnZWQiLCJsYXllck9yZGVyIiwiZmlsdGVycyIsImZpbHRlclRvQmVNZXJnZWQiLCJkYXRhc2V0cyIsImVkaXRpbmdEYXRhc2V0IiwidW5kZWZpbmVkIiwiaW50ZXJhY3Rpb25Db25maWciLCJpbnRlcmFjdGlvblRvQmVNZXJnZWQiLCJsYXllckJsZW5kaW5nIiwiaG92ZXJJbmZvIiwiY2xpY2tlZCIsImZpbGVMb2FkaW5nIiwiZmlsZUxvYWRpbmdFcnIiLCJzcGxpdE1hcHMiLCJ1cGRhdGVTdGF0ZVdpdGhMYXllckFuZERhdGEiLCJzdGF0ZSIsImxheWVyIiwiaWR4IiwibWFwIiwibHlyIiwiaSIsImQiLCJhY3Rpb24iLCJvbGRMYXllciIsImZpbmRJbmRleCIsImwiLCJpZCIsInByb3BzIiwiT2JqZWN0Iiwia2V5cyIsIm5ld0NvbmZpZyIsIm5ld0xheWVyIiwidXBkYXRlTGF5ZXJDb25maWciLCJzaG91bGRDYWxjdWxhdGVMYXllckRhdGEiLCJvbGRMYXllckRhdGEiLCJzYW1lRGF0YSIsIm5ld1N0YXRlIiwidG9nZ2xlTGF5ZXJGcm9tU3BsaXRNYXBzIiwibmV3VHlwZSIsIm9sZElkIiwiZXJyb3IiLCJMYXllckNsYXNzIiwiY29uZmlnIiwiYXNzaWduQ29uZmlnVG9MYXllciIsInNldHRpbmdzIiwib2xkTGF5ZXJNYXAiLCJvdGhlckxheWVycyIsImNoYW5uZWwiLCJkYXRhSWQiLCJkYXRhIiwiYWxsRGF0YSIsInVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbCIsIm5ld1Zpc0NvbmZpZyIsInZpc0NvbmZpZyIsImVuYWJsZWQiLCJmb3JFYWNoIiwiayIsInByb3AiLCJ2YWx1ZSIsIm5ld0ZpbHRlciIsImZpZWxkcyIsImZpZWxkSWR4IiwiZiIsIm5hbWUiLCJmaWVsZCIsImZpbHRlclByb3AiLCJmcmVlemUiLCJzZXRGaWx0ZXJQbG90VXBkYXRlciIsIm5ld1Byb3AiLCJwbG90VHlwZSIsImFkZEZpbHRlclVwZGF0ZXIiLCJ0b2dnbGVGaWx0ZXJBbmltYXRpb25VcGRhdGVyIiwiaXNBbmltYXRpbmciLCJ1cGRhdGVBbmltYXRpb25TcGVlZFVwZGF0ZXIiLCJzcGVlZCIsImVubGFyZ2VGaWx0ZXJVcGRhdGVyIiwiaXNFbmxhcmdlZCIsImVubGFyZ2VkIiwicmVtb3ZlRmlsdGVyVXBkYXRlciIsIm5ld0ZpbHRlcnMiLCJzbGljZSIsImxlbmd0aCIsImFkZExheWVyVXBkYXRlciIsImRlZmF1bHREYXRhc2V0IiwiTGF5ZXIiLCJpc1Zpc2libGUiLCJpc0NvbmZpZ0FjdGl2ZSIsImFkZE5ld0xheWVyc1RvU3BsaXRNYXAiLCJyZW1vdmVMYXllclVwZGF0ZXIiLCJsYXllclRvUmVtb3ZlIiwibmV3TWFwcyIsInJlbW92ZUxheWVyRnJvbVNwbGl0TWFwcyIsImZpbHRlciIsInBpZCIsImlzTGF5ZXJIb3ZlcmVkIiwicmVvcmRlckxheWVyVXBkYXRlciIsIm9yZGVyIiwicmVtb3ZlRGF0YXNldFVwZGF0ZXIiLCJkYXRhc2V0S2V5Iiwia2V5IiwiZGF0YXNldCIsIm5ld0RhdGFzZXRzIiwiaW5kZXhlcyIsInJlZHVjZSIsImxpc3RPZkluZGV4ZXMiLCJpbmRleCIsInB1c2giLCJjdXJyZW50U3RhdGUiLCJpbmRleENvdW50ZXIiLCJjdXJyZW50SW5kZXgiLCJ0b29sdGlwIiwiZmllbGRzVG9TaG93IiwidXBkYXRlTGF5ZXJCbGVuZGluZ1VwZGF0ZXIiLCJtb2RlIiwic2hvd0RhdGFzZXRUYWJsZVVwZGF0ZXIiLCJ1cGRhdGVWaXNEYXRhVXBkYXRlciIsIkFycmF5IiwiaXNBcnJheSIsImRlZmF1bHRPcHRpb25zIiwiY2VudGVyTWFwIiwib3B0aW9ucyIsInJlY2VpdmVNYXBDb25maWdVcGRhdGVyIiwicGF5bG9hZCIsInZpc1N0YXRlIiwibmV3RGF0ZUVudHJpZXMiLCJhY2N1IiwiaW5mbyIsInN0YXRlV2l0aE5ld0RhdGEiLCJvbGRMYXllcnMiLCJtZXJnZWRTdGF0ZSIsIm5ld0xheWVycyIsInRvb2x0aXBGaWVsZHMiLCJib3VuZHMiLCJpbmNsdWRlcyIsInJlc2V0TWFwQ29uZmlnVXBkYXRlciIsInJlc2V0U3RhdGUiLCJsYXllckhvdmVyVXBkYXRlciIsImxheWVyQ2xpY2tVcGRhdGVyIiwicGlja2VkIiwibWFwQ2xpY2tVcGRhdGVyIiwidG9nZ2xlU3BsaXRNYXBVcGRhdGVyIiwiY29tcHV0ZVNwbGl0TWFwTGF5ZXJzIiwiY2xvc2VTcGVjaWZpY01hcEF0SW5kZXgiLCJzZXRWaXNpYmxlTGF5ZXJzRm9yTWFwVXBkYXRlciIsIm1hcEluZGV4IiwibGF5ZXJJZHMiLCJjdXJyZW50TGF5ZXJzIiwidG9nZ2xlTGF5ZXJGb3JNYXBVcGRhdGVyIiwibWFwU2V0dGluZ3MiLCJsYXllcklkIiwibmV3U3BsaXRNYXBzIiwiZ2VuZXJhdGVMYXllck1ldGFGb3JTcGxpdFZpZXdzIiwiaXNBdmFpbGFibGUiLCJtYXBMYXllcnMiLCJjdXJyZW50TGF5ZXIiLCJfIiwiaW5kZXhUb1JldHJpZXZlIiwibWV0YVNldHRpbmdzIiwibG9hZEZpbGVzVXBkYXRlciIsImZpbGVzIiwiZmlsZXNUb0xvYWQiLCJmaWxlQmxvYiIsImxhYmVsIiwic2l6ZSIsImhhbmRsZXIiLCJsb2FkRmlsZVRhc2tzIiwiYWxsIiwiYmltYXAiLCJyZXN1bHRzIiwibG9hZEZpbGVzRXJyVXBkYXRlciIsImRlZmF1bHRMYXllcnMiLCJ2YWx1ZXMiLCJkYXRhSWRzIiwibmV3TGF5ZXJEYXRhcyIsInVwZGF0ZUxheWVyRG9tYWluIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7UUFpR2dCQSx3QixHQUFBQSx3QjtRQTRCQUMsc0IsR0FBQUEsc0I7UUE2Q0FDLCtCLEdBQUFBLCtCO1FBaUJBQywyQixHQUFBQSwyQjtRQTRCQUMsOEIsR0FBQUEsOEI7UUF1QkFDLGdCLEdBQUFBLGdCO1FBZ3RCQUMsZ0IsR0FBQUEsZ0I7UUF3QkFDLGtCLEdBQUFBLGtCO1FBNEJBQyx3QixHQUFBQSx3Qjs7QUFsL0JoQjs7OztBQUNBOztBQUNBOztBQUdBOztBQUdBOztBQUdBOztBQUNBOztBQUVBOztBQU9BOztBQUVBOztBQUtBOztBQUNBOztBQUVBOztBQU9BOztJQUFZQyxjOztBQUNaOzs7Ozs7QUFoQ0E7QUFrQ08sSUFBTUMsZ0RBQW9CO0FBQy9CO0FBQ0FDLFVBQVEsRUFGdUI7QUFHL0JDLGFBQVcsRUFIb0I7QUFJL0JDLG1CQUFpQixFQUpjO0FBSy9CQyxjQUFZLEVBTG1COztBQU8vQjtBQUNBQyxXQUFTLEVBUnNCO0FBUy9CQyxvQkFBa0IsRUFUYTs7QUFXL0I7QUFDQUMsWUFBVSxFQVpxQjtBQWEvQkMsa0JBQWdCQyxTQWJlOztBQWUvQkMscUJBQW1CLDhDQWZZO0FBZ0IvQkMseUJBQXVCRixTQWhCUTs7QUFrQi9CRyxpQkFBZSxRQWxCZ0I7QUFtQi9CQyxhQUFXSixTQW5Cb0I7QUFvQi9CSyxXQUFTTCxTQXBCc0I7O0FBc0IvQk0sZUFBYSxLQXRCa0I7QUF1Qi9CQyxrQkFBZ0IsSUF2QmU7O0FBeUIvQjtBQUNBQyxhQUFXO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBWlM7QUExQm9CLENBQTFCOztBQS9CUDs7O0FBTkE7OztBQStFQSxTQUFTQywyQkFBVCxDQUFxQ0MsS0FBckMsUUFBcUU7QUFBQSxNQUF4QmpC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IjpbImltcG9ydCBjbG9uZURlZXAgZnJvbSAnbG9kYXNoLmNsb25lZGVlcCc7XG5pbXBvcnQge2NvbnNvbGUgYXMgQ29uc29sZX0gZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQge1Rhc2ssIHdpdGhUYXNrfSBmcm9tICdyZWFjdC1wYWxtJztcblxuLy8gVGFza3NcbmltcG9ydCB7TE9BRF9GSUxFX1RBU0t9IGZyb20gJ3Rhc2tzL3Rhc2tzJztcblxuLy8gQWN0aW9uc1xuaW1wb3J0IHt1cGRhdGVWaXNEYXRhLCBsb2FkRmlsZXNFcnJ9IGZyb20gJ2FjdGlvbnMvdmlzLXN0YXRlLWFjdGlvbnMnO1xuXG4vLyBVdGlsc1xuaW1wb3J0IHtnZXREZWZhdWx0SW50ZXJhY3Rpb259IGZyb20gJ3V0aWxzL2ludGVyYWN0aW9uLXV0aWxzJztcbmltcG9ydCB7Z2VuZXJhdGVIYXNoSWR9IGZyb20gJ3V0aWxzL3V0aWxzJztcbmltcG9ydCB7ZmluZEZpZWxkc1RvU2hvd30gZnJvbSAndXRpbHMvaW50ZXJhY3Rpb24tdXRpbHMnO1xuaW1wb3J0IHtcbiAgZ2V0RGVmYXVsdGZpbHRlcixcbiAgZ2V0RmlsdGVyUHJvcHMsXG4gIGdldEZpbHRlclBsb3QsXG4gIGdldERlZmF1bHRGaWx0ZXJQbG90VHlwZSxcbiAgZmlsdGVyRGF0YVxufSBmcm9tICd1dGlscy9maWx0ZXItdXRpbHMnO1xuaW1wb3J0IHtjcmVhdGVOZXdEYXRhRW50cnl9IGZyb20gJ3V0aWxzL2RhdGFzZXQtdXRpbHMnO1xuXG5pbXBvcnQge1xuICBmaW5kRGVmYXVsdExheWVyLFxuICBjYWxjdWxhdGVMYXllckRhdGFcbn0gZnJvbSAndXRpbHMvbGF5ZXItdXRpbHMvbGF5ZXItdXRpbHMnO1xuXG5pbXBvcnQge2dldEZpbGVIYW5kbGVyfSBmcm9tICdwcm9jZXNzb3IvZmlsZS1oYW5kbGVyJztcbmltcG9ydCB7ZmluZE1hcEJvdW5kc30gZnJvbSAndXRpbHMvZGF0YS11dGlscyc7XG5cbmltcG9ydCB7XG4gIG1lcmdlRmlsdGVycyxcbiAgbWVyZ2VMYXllcnMsXG4gIG1lcmdlSW50ZXJhY3Rpb25zLFxuICBtZXJnZUxheWVyQmxlbmRpbmdcbn0gZnJvbSAnLi92aXMtc3RhdGUtbWVyZ2VyJztcblxuaW1wb3J0ICogYXMgS2VwbGVyR0xMYXllcnMgZnJvbSAna2VwbGVyZ2wtbGF5ZXJzJztcbmltcG9ydCB7TEFZRVJfQ0xBU1NFU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5leHBvcnQgY29uc3QgSU5JVElBTF9WSVNfU1RBVEUgPSB7XG4gIC8vIGxheWVyc1xuICBsYXllcnM6IFtdLFxuICBsYXllckRhdGE6IFtdLFxuICBsYXllclRvQmVNZXJnZWQ6IFtdLFxuICBsYXllck9yZGVyOiBbXSxcblxuICAvLyBmaWx0ZXJzXG4gIGZpbHRlcnM6IFtdLFxuICBmaWx0ZXJUb0JlTWVyZ2VkOiBbXSxcblxuICAvLyBhIGNvbGxlY3Rpb24gb2YgbXVsdGlwbGUgZGF0YXNldFxuICBkYXRhc2V0czoge30sXG4gIGVkaXRpbmdEYXRhc2V0OiB1bmRlZmluZWQsXG5cbiAgaW50ZXJhY3Rpb25Db25maWc6IGdldERlZmF1bHRJbnRlcmFjdGlvbigpLFxuICBpbnRlcmFjdGlvblRvQmVNZXJnZWQ6IHVuZGVmaW5lZCxcblxuICBsYXllckJsZW5kaW5nOiAnbm9ybWFsJyxcbiAgaG92ZXJJbmZvOiB1bmRlZmluZWQsXG4gIGNsaWNrZWQ6IHVuZGVmaW5lZCxcblxuICBmaWxlTG9hZGluZzogZmFsc2UsXG4gIGZpbGVMb2FkaW5nRXJyOiBudWxsLFxuXG4gIC8vIHRoaXMgaXMgdXNlZCB3aGVuIHVzZXIgc3BsaXQgbWFwc1xuICBzcGxpdE1hcHM6IFtcbiAgICAvLyB0aGlzIHdpbGwgY29udGFpbiBhIGxpc3Qgb2Ygb2JqZWN0cyB0b1xuICAgIC8vIGRlc2NyaWJlIHRoZSBzdGF0ZSBvZiBsYXllciBhdmFpbGFiaWxpdHkgYW5kIHZpc2liaWxpdHkgZm9yIGVhY2ggbWFwXG4gICAgLy8gW1xuICAgIC8vICAge1xuICAgIC8vICAgICBsYXllcnM6IHtcbiAgICAvLyAgICAgICBsYXllcl9pZDoge1xuICAgIC8vICAgICAgICAgaXNBdmFpbGFibGU6IHRydWV8ZmFsc2UgIyB0aGlzIGlzIGRyaXZlbiBieSB0aGUgbGVmdCBoYW5kIHBhbmVsXG4gICAgLy8gICAgICAgICBpc1Zpc2libGU6IHRydWV8ZmFsc2VcbiAgICAvLyAgICAgICB9XG4gICAgLy8gICAgIH1cbiAgICAvLyAgIH1cbiAgICAvLyBdXG4gIF1cbn07XG5cbmZ1bmN0aW9uIHVwZGF0ZVN0YXRlV2l0aExheWVyQW5kRGF0YShzdGF0ZSwge2xheWVyRGF0YSwgbGF5ZXIsIGlkeH0pIHtcbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBsYXllcnM6IHN0YXRlLmxheWVycy5tYXAoKGx5ciwgaSkgPT4gKGkgPT09IGlkeCA/IGxheWVyIDogbHlyKSksXG4gICAgbGF5ZXJEYXRhOiBsYXllckRhdGFcbiAgICAgID8gc3RhdGUubGF5ZXJEYXRhLm1hcCgoZCwgaSkgPT4gKGkgPT09IGlkeCA/IGxheWVyRGF0YSA6IGQpKVxuICAgICAgOiBzdGF0ZS5sYXllckRhdGFcbiAgfTtcbn1cblxuLyoqXG4gKiBDYWxsZWQgdG8gdXBkYXRlIGxheWVyIGJhc2UgY29uZmlnOiBkYXRhSWQsIGxhYmVsLCBjb2x1bW4sIGlzVmlzaWJsZVxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxheWVyQ29uZmlnQ2hhbmdlVXBkYXRlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIGNvbnN0IHtvbGRMYXllcn0gPSBhY3Rpb247XG4gIGNvbnN0IGlkeCA9IHN0YXRlLmxheWVycy5maW5kSW5kZXgobCA9PiBsLmlkID09PSBvbGRMYXllci5pZCk7XG4gIGNvbnN0IHByb3BzID0gT2JqZWN0LmtleXMoYWN0aW9uLm5ld0NvbmZpZyk7XG5cbiAgY29uc3QgbmV3TGF5ZXIgPSBvbGRMYXllci51cGRhdGVMYXllckNvbmZpZyhhY3Rpb24ubmV3Q29uZmlnKTtcbiAgaWYgKG5ld0xheWVyLnNob3VsZENhbGN1bGF0ZUxheWVyRGF0YShwcm9wcykpIHtcbiAgICBjb25zdCBvbGRMYXllckRhdGEgPSBzdGF0ZS5sYXllckRhdGFbaWR4XTtcbiAgICBjb25zdCB7bGF5ZXJEYXRhLCBsYXllcn0gPSBjYWxjdWxhdGVMYXllckRhdGEoXG4gICAgICBuZXdMYXllcixcbiAgICAgIHN0YXRlLFxuICAgICAgb2xkTGF5ZXJEYXRhLFxuICAgICAge3NhbWVEYXRhOiB0cnVlfVxuICAgICk7XG4gICAgcmV0dXJuIHVwZGF0ZVN0YXRlV2l0aExheWVyQW5kRGF0YShzdGF0ZSwge2xheWVyRGF0YSwgbGF5ZXIsIGlkeH0pO1xuICB9XG5cbiAgY29uc3QgbmV3U3RhdGUgPSB7XG4gICAgLi4uc3RhdGUsXG4gICAgc3BsaXRNYXBzOlxuICAgICAgJ2lzVmlzaWJsZScgaW4gYWN0aW9uLm5ld0NvbmZpZ1xuICAgICAgICA/IHRvZ2dsZUxheWVyRnJvbVNwbGl0TWFwcyhzdGF0ZSwgbmV3TGF5ZXIpXG4gICAgICAgIDogc3RhdGUuc3BsaXRNYXBzXG4gIH07XG5cbiAgcmV0dXJuIHVwZGF0ZVN0YXRlV2l0aExheWVyQW5kRGF0YShuZXdTdGF0ZSwge2xheWVyOiBuZXdMYXllciwgaWR4fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYXllclR5cGVDaGFuZ2VVcGRhdGVyKHN0YXRlLCBhY3Rpb24pIHtcbiAgY29uc3Qge29sZExheWVyLCBuZXdUeXBlfSA9IGFjdGlvbjtcbiAgY29uc3Qgb2xkSWQgPSBvbGRMYXllci5pZDtcbiAgY29uc3QgaWR4ID0gc3RhdGUubGF5ZXJzLmZpbmRJbmRleChsID0+IGwuaWQgPT09IG9sZElkKTtcblxuICBpZiAoIUxBWUVSX0NMQVNTRVNbbmV3VHlwZV0gfHwgIUtlcGxlckdMTGF5ZXJzW0xBWUVSX0NMQVNTRVNbbmV3VHlwZV1dKSB7XG4gICAgQ29uc29sZS5lcnJvcihgJHtuZXdUeXBlfSBpcyBub3QgYSB2YWxpZCBsYXllciB0eXBlYCk7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgLy8gZ2V0IGEgbWludCBsYXllciwgd2l0aCBuZXcgaWQgYW5kIHR5cGVcbiAgLy8gYmVjYXVzZSBkZWNrLmdsIHVzZXMgaWQgdG8gbWF0Y2ggYmV0d2VlbiBuZXcgYW5kIG9sZCBsYXllci5cbiAgLy8gSWYgdHlwZSBoYXMgY2hhbmdlZCBidXQgaWQgaXMgdGhlIHNhbWUsIGl0IHdpbGwgYnJlYWtcbiAgY29uc3QgTGF5ZXJDbGFzcyA9IEtlcGxlckdMTGF5ZXJzW0xBWUVSX0NMQVNTRVNbbmV3VHlwZV1dO1xuICBjb25zdCBuZXdMYXllciA9IG5ldyBMYXllckNsYXNzKCk7XG5cbiAgbmV3TGF5ZXIuY29uZmlnID0gbmV3TGF5ZXIuYXNzaWduQ29uZmlnVG9MYXllcihcbiAgICBuZXdMYXllci5jb25maWcsXG4gICAgb2xkTGF5ZXIuY29uZmlnXG4gICk7XG5cbiAgY29uc3Qge2xheWVyRGF0YSwgbGF5ZXJ9ID0gY2FsY3VsYXRlTGF5ZXJEYXRhKG5ld0xheWVyLCBzdGF0ZSk7XG5cbiAgbGV0IG5ld1N0YXRlID0gc3RhdGU7XG5cbiAgLy8gdXBkYXRlIHNwbGl0TWFwIGxheWVyIGlkXG4gIGlmIChzdGF0ZS5zcGxpdE1hcHMpIHtcbiAgICBuZXdTdGF0ZSA9IHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgc3BsaXRNYXBzOiBzdGF0ZS5zcGxpdE1hcHMubWFwKHNldHRpbmdzID0+IHtcbiAgICAgICAgY29uc3Qge1tvbGRJZF06IG9sZExheWVyTWFwLCAuLi5vdGhlckxheWVyc30gPSBzZXR0aW5ncy5sYXllcnM7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uc2V0dGluZ3MsXG4gICAgICAgICAgbGF5ZXJzOiB7XG4gICAgICAgICAgICAuLi5vdGhlckxheWVycyxcbiAgICAgICAgICAgIFtsYXllci5pZF06IG9sZExheWVyTWFwXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSlcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHVwZGF0ZVN0YXRlV2l0aExheWVyQW5kRGF0YShuZXdTdGF0ZSwge2xheWVyRGF0YSwgbGF5ZXIsIGlkeH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGF5ZXJWaXN1YWxDaGFubmVsQ2hhbmdlVXBkYXRlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIGNvbnN0IHtvbGRMYXllciwgbmV3Q29uZmlnLCBjaGFubmVsfSA9IGFjdGlvbjtcbiAgY29uc3Qge2RhdGEsIGFsbERhdGF9ID0gc3RhdGUuZGF0YXNldHNbb2xkTGF5ZXIuY29uZmlnLmRhdGFJZF07XG5cbiAgY29uc3QgaWR4ID0gc3RhdGUubGF5ZXJzLmZpbmRJbmRleChsID0+IGwuaWQgPT09IG9sZExheWVyLmlkKTtcbiAgY29uc3QgbmV3TGF5ZXIgPSBvbGRMYXllci51cGRhdGVMYXllckNvbmZpZyhuZXdDb25maWcpO1xuXG4gIG5ld0xheWVyLnVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbCh7ZGF0YSwgYWxsRGF0YX0sIGNoYW5uZWwpO1xuXG4gIGNvbnN0IG9sZExheWVyRGF0YSA9IHN0YXRlLmxheWVyRGF0YVtpZHhdO1xuICBjb25zdCB7bGF5ZXJEYXRhLCBsYXllcn0gPSBjYWxjdWxhdGVMYXllckRhdGEobmV3TGF5ZXIsIHN0YXRlLCBvbGRMYXllckRhdGEsIHtcbiAgICBzYW1lRGF0YTogdHJ1ZVxuICB9KTtcblxuICByZXR1cm4gdXBkYXRlU3RhdGVXaXRoTGF5ZXJBbmREYXRhKHN0YXRlLCB7bGF5ZXJEYXRhLCBsYXllciwgaWR4fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYXllclZpc0NvbmZpZ0NoYW5nZVVwZGF0ZXIoc3RhdGUsIGFjdGlvbikge1xuICBjb25zdCB7b2xkTGF5ZXJ9ID0gYWN0aW9uO1xuICBjb25zdCBpZHggPSBzdGF0ZS5sYXllcnMuZmluZEluZGV4KGwgPT4gbC5pZCA9PT0gb2xkTGF5ZXIuaWQpO1xuICBjb25zdCBwcm9wcyA9IE9iamVjdC5rZXlzKGFjdGlvbi5uZXdWaXNDb25maWcpO1xuXG4gIGNvbnN0IG5ld1Zpc0NvbmZpZyA9IHtcbiAgICAuLi5vbGRMYXllci5jb25maWcudmlzQ29uZmlnLFxuICAgIC4uLmFjdGlvbi5uZXdWaXNDb25maWdcbiAgfTtcblxuICBjb25zdCBuZXdMYXllciA9IG9sZExheWVyLnVwZGF0ZUxheWVyQ29uZmlnKHt2aXNDb25maWc6IG5ld1Zpc0NvbmZpZ30pO1xuXG4gIGlmIChuZXdMYXllci5zaG91bGRDYWxjdWxhdGVMYXllckRhdGEocHJvcHMpKSB7XG4gICAgY29uc3Qgb2xkTGF5ZXJEYXRhID0gc3RhdGUubGF5ZXJEYXRhW2lkeF07XG4gICAgY29uc3Qge2xheWVyRGF0YSwgbGF5ZXJ9ID0gY2FsY3VsYXRlTGF5ZXJEYXRhKFxuICAgICAgbmV3TGF5ZXIsXG4gICAgICBzdGF0ZSxcbiAgICAgIG9sZExheWVyRGF0YSxcbiAgICAgIHtzYW1lRGF0YTogdHJ1ZX1cbiAgICApO1xuICAgIHJldHVybiB1cGRhdGVTdGF0ZVdpdGhMYXllckFuZERhdGEoc3RhdGUsIHtsYXllckRhdGEsIGxheWVyLCBpZHh9KTtcbiAgfVxuXG4gIHJldHVybiB1cGRhdGVTdGF0ZVdpdGhMYXllckFuZERhdGEoc3RhdGUsIHtsYXllcjogbmV3TGF5ZXIsIGlkeH0pO1xufVxuXG4vKiBlc2xpbnQtZW5hYmxlIG1heC1zdGF0ZW1lbnRzICovXG5cbmV4cG9ydCBmdW5jdGlvbiBpbnRlcmFjdGlvbkNvbmZpZ0NoYW5nZVVwZGF0ZXIoc3RhdGUsIGFjdGlvbikge1xuICBjb25zdCB7Y29uZmlnfSA9IGFjdGlvbjtcblxuICBjb25zdCBpbnRlcmFjdGlvbkNvbmZpZyA9IHtcbiAgICAuLi5zdGF0ZS5pbnRlcmFjdGlvbkNvbmZpZyxcbiAgICAuLi57W2NvbmZpZy5pZF06IGNvbmZpZ31cbiAgfTtcblxuICBpZiAoY29uZmlnLmVuYWJsZWQgJiYgIXN0YXRlLmludGVyYWN0aW9uQ29uZmlnW2NvbmZpZy5pZF0uZW5hYmxlZCkge1xuICAgIC8vIG9ubHkgZW5hYmxlIG9uZSBpbnRlcmFjdGlvbiBhdCBhIHRpbWVcbiAgICBPYmplY3Qua2V5cyhpbnRlcmFjdGlvbkNvbmZpZykuZm9yRWFjaChrID0+IHtcbiAgICAgIGlmIChrICE9PSBjb25maWcuaWQpIHtcbiAgICAgICAgaW50ZXJhY3Rpb25Db25maWdba10gPSB7Li4uaW50ZXJhY3Rpb25Db25maWdba10sIGVuYWJsZWQ6IGZhbHNlfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgaW50ZXJhY3Rpb25Db25maWdcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldEZpbHRlclVwZGF0ZXIoc3RhdGUsIGFjdGlvbikge1xuICBjb25zdCB7aWR4LCBwcm9wLCB2YWx1ZX0gPSBhY3Rpb247XG4gIGxldCBuZXdTdGF0ZSA9IHN0YXRlO1xuICBsZXQgbmV3RmlsdGVyID0ge1xuICAgIC4uLnN0YXRlLmZpbHRlcnNbaWR4XSxcbiAgICBbcHJvcF06IHZhbHVlXG4gIH07XG5cbiAgY29uc3Qge2RhdGFJZH0gPSBuZXdGaWx0ZXI7XG4gIGlmICghZGF0YUlkKSB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG4gIGNvbnN0IHtmaWVsZHMsIGFsbERhdGF9ID0gc3RhdGUuZGF0YXNldHNbZGF0YUlkXTtcblxuICBzd2l0Y2ggKHByb3ApIHtcbiAgICBjYXNlICdkYXRhSWQnOlxuICAgICAgLy8gaWYgdHJ5aW5nIHRvIHVwZGF0ZSBmaWx0ZXIgZGF0YUlkLiBjcmVhdGUgYW4gZW1wdHkgbmV3IGZpbHRlclxuICAgICAgbmV3RmlsdGVyID0gZ2V0RGVmYXVsdGZpbHRlcihkYXRhSWQpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICduYW1lJzpcbiAgICAgIC8vIGZpbmQgdGhlIGZpZWxkXG4gICAgICBjb25zdCBmaWVsZElkeCA9IGZpZWxkcy5maW5kSW5kZXgoZiA9PiBmLm5hbWUgPT09IHZhbHVlKTtcbiAgICAgIGxldCBmaWVsZCA9IGZpZWxkc1tmaWVsZElkeF07XG5cbiAgICAgIGlmICghZmllbGQuZmlsdGVyUHJvcCkge1xuICAgICAgICAvLyBnZXQgZmlsdGVyIGRvbWFpbiBmcm9tIGZpZWxkXG4gICAgICAgIC8vIHNhdmUgZmlsdGVyUHJvcHM6IHtkb21haW4sIHN0ZXBzLCB2YWx1ZX0gdG8gZmllbGQsIGF2b2lkIHJlY2FsY3VsYXRlXG4gICAgICAgIGZpZWxkID0ge1xuICAgICAgICAgIC4uLmZpZWxkLFxuICAgICAgICAgIGZpbHRlclByb3A6IGdldEZpbHRlclByb3BzKGFsbERhdGEsIGZpZWxkKVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBuZXdGaWx0ZXIgPSB7XG4gICAgICAgIC4uLm5ld0ZpbHRlcixcbiAgICAgICAgLi4uZmllbGQuZmlsdGVyUHJvcCxcbiAgICAgICAgbmFtZTogZmllbGQubmFtZSxcbiAgICAgICAgLy8gY2FuJ3QgZWRpdCBkYXRhSWQgb25jZSBuYW1lIGlzIHNlbGVjdGVkXG4gICAgICAgIGZyZWV6ZTogdHJ1ZSxcbiAgICAgICAgZmllbGRJZHhcbiAgICAgIH07XG5cbiAgICAgIG5ld1N0YXRlID0ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgZGF0YXNldHM6IHtcbiAgICAgICAgICAuLi5zdGF0ZS5kYXRhc2V0cyxcbiAgICAgICAgICBbZGF0YUlkXToge1xuICAgICAgICAgICAgLi4uc3RhdGUuZGF0YXNldHNbZGF0YUlkXSxcbiAgICAgICAgICAgIGZpZWxkczogZmllbGRzLm1hcCgoZCwgaSkgPT4gKGkgPT09IGZpZWxkSWR4ID8gZmllbGQgOiBkKSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlICd2YWx1ZSc6XG4gICAgZGVmYXVsdDpcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgLy8gc2F2ZSBuZXcgZmlsdGVycyB0byBuZXdTdGF0ZVxuICBuZXdTdGF0ZSA9IHtcbiAgICAuLi5uZXdTdGF0ZSxcbiAgICBmaWx0ZXJzOiBzdGF0ZS5maWx0ZXJzLm1hcCgoZiwgaSkgPT4gKGkgPT09IGlkeCA/IG5ld0ZpbHRlciA6IGYpKVxuICB9O1xuXG4gIC8vIGZpbHRlciBkYXRhXG4gIG5ld1N0YXRlID0ge1xuICAgIC4uLm5ld1N0YXRlLFxuICAgIGRhdGFzZXRzOiB7XG4gICAgICAuLi5uZXdTdGF0ZS5kYXRhc2V0cyxcbiAgICAgIFtkYXRhSWRdOiB7XG4gICAgICAgIC4uLm5ld1N0YXRlLmRhdGFzZXRzW2RhdGFJZF0sXG4gICAgICAgIC4uLmZpbHRlckRhdGEoYWxsRGF0YSwgZGF0YUlkLCBuZXdTdGF0ZS5maWx0ZXJzKVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBuZXdTdGF0ZSA9IHVwZGF0ZUFsbExheWVyRG9tYWluRGF0YShuZXdTdGF0ZSwgZGF0YUlkKTtcblxuICByZXR1cm4gbmV3U3RhdGU7XG59XG5cbmV4cG9ydCBjb25zdCBzZXRGaWx0ZXJQbG90VXBkYXRlciA9IChzdGF0ZSwge2lkeCwgbmV3UHJvcH0pID0+IHtcbiAgbGV0IG5ld0ZpbHRlciA9IHsuLi5zdGF0ZS5maWx0ZXJzW2lkeF0sIC4uLm5ld1Byb3B9O1xuICBjb25zdCBwcm9wID0gT2JqZWN0LmtleXMobmV3UHJvcClbMF07XG4gIGlmIChwcm9wID09PSAneUF4aXMnKSB7XG4gICAgY29uc3QgcGxvdFR5cGUgPSBnZXREZWZhdWx0RmlsdGVyUGxvdFR5cGUobmV3RmlsdGVyKTtcblxuICAgIGlmIChwbG90VHlwZSkge1xuICAgICAgbmV3RmlsdGVyID0ge1xuICAgICAgICAuLi5uZXdGaWx0ZXIsXG4gICAgICAgIC4uLmdldEZpbHRlclBsb3QoXG4gICAgICAgICAgey4uLm5ld0ZpbHRlciwgcGxvdFR5cGV9LFxuICAgICAgICAgIHN0YXRlLmRhdGFzZXRzW25ld0ZpbHRlci5kYXRhSWRdLmFsbERhdGFcbiAgICAgICAgKSxcbiAgICAgICAgcGxvdFR5cGVcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBmaWx0ZXJzOiBzdGF0ZS5maWx0ZXJzLm1hcCgoZiwgaSkgPT4gKGkgPT09IGlkeCA/IG5ld0ZpbHRlciA6IGYpKVxuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IGFkZEZpbHRlclVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT5cbiAgIWFjdGlvbi5kYXRhSWRcbiAgICA/IHN0YXRlXG4gICAgOiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBmaWx0ZXJzOiBbLi4uc3RhdGUuZmlsdGVycywgZ2V0RGVmYXVsdGZpbHRlcihhY3Rpb24uZGF0YUlkKV1cbiAgICAgIH07XG5cbmV4cG9ydCBjb25zdCB0b2dnbGVGaWx0ZXJBbmltYXRpb25VcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBmaWx0ZXJzOiBzdGF0ZS5maWx0ZXJzLm1hcChcbiAgICAoZiwgaSkgPT4gKGkgPT09IGFjdGlvbi5pZHggPyB7Li4uZiwgaXNBbmltYXRpbmc6ICFmLmlzQW5pbWF0aW5nfSA6IGYpXG4gIClcbn0pO1xuXG5leHBvcnQgY29uc3QgdXBkYXRlQW5pbWF0aW9uU3BlZWRVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBmaWx0ZXJzOiBzdGF0ZS5maWx0ZXJzLm1hcChcbiAgICAoZiwgaSkgPT4gKGkgPT09IGFjdGlvbi5pZHggPyB7Li4uZiwgc3BlZWQ6IGFjdGlvbi5zcGVlZH0gOiBmKVxuICApXG59KTtcblxuICBleHBvcnQgY29uc3QgZW5sYXJnZUZpbHRlclVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCBpc0VubGFyZ2VkID0gc3RhdGUuZmlsdGVyc1thY3Rpb24uaWR4XS5lbmxhcmdlZDtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGZpbHRlcnM6IHN0YXRlLmZpbHRlcnMubWFwKChmLCBpKSA9PiB7XG4gICAgICBmLmVubGFyZ2VkID0gIWlzRW5sYXJnZWQgJiYgaSA9PT0gYWN0aW9uLmlkeDtcbiAgICAgIHJldHVybiBmO1xuICAgIH0pXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgcmVtb3ZlRmlsdGVyVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIGNvbnN0IHtpZHh9ID0gYWN0aW9uO1xuICBjb25zdCB7ZGF0YUlkfSA9IHN0YXRlLmZpbHRlcnNbaWR4XTtcblxuICBjb25zdCBuZXdGaWx0ZXJzID0gW1xuICAgIC4uLnN0YXRlLmZpbHRlcnMuc2xpY2UoMCwgaWR4KSxcbiAgICAuLi5zdGF0ZS5maWx0ZXJzLnNsaWNlKGlkeCArIDEsIHN0YXRlLmZpbHRlcnMubGVuZ3RoKVxuICBdO1xuXG4gIGNvbnN0IG5ld1N0YXRlID0ge1xuICAgIC4uLnN0YXRlLFxuICAgIGRhdGFzZXRzOiB7XG4gICAgICAuLi5zdGF0ZS5kYXRhc2V0cyxcbiAgICAgIFtkYXRhSWRdOiB7XG4gICAgICAgIC4uLnN0YXRlLmRhdGFzZXRzW2RhdGFJZF0sXG4gICAgICAgIC4uLmZpbHRlckRhdGEoc3RhdGUuZGF0YXNldHNbZGF0YUlkXS5hbGxEYXRhLCBkYXRhSWQsIG5ld0ZpbHRlcnMpXG4gICAgICB9XG4gICAgfSxcbiAgICBmaWx0ZXJzOiBuZXdGaWx0ZXJzXG4gIH07XG5cbiAgcmV0dXJuIHVwZGF0ZUFsbExheWVyRG9tYWluRGF0YShuZXdTdGF0ZSwgZGF0YUlkKTtcbn07XG5cbmV4cG9ydCBjb25zdCBhZGRMYXllclVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCBkZWZhdWx0RGF0YXNldCA9IE9iamVjdC5rZXlzKHN0YXRlLmRhdGFzZXRzKVswXTtcblxuICBjb25zdCBuZXdMYXllciA9IG5ldyBLZXBsZXJHTExheWVycy5MYXllcih7XG4gICAgaXNWaXNpYmxlOiB0cnVlLFxuICAgIGlzQ29uZmlnQWN0aXZlOiB0cnVlLFxuICAgIGRhdGFJZDogZGVmYXVsdERhdGFzZXRcbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBsYXllcnM6IFsuLi5zdGF0ZS5sYXllcnMsIG5ld0xheWVyXSxcbiAgICBsYXllckRhdGE6IFsuLi5zdGF0ZS5sYXllckRhdGEsIHt9XSxcbiAgICBsYXllck9yZGVyOiBbLi4uc3RhdGUubGF5ZXJPcmRlciwgc3RhdGUubGF5ZXJPcmRlci5sZW5ndGhdLFxuICAgIHNwbGl0TWFwczogYWRkTmV3TGF5ZXJzVG9TcGxpdE1hcChzdGF0ZS5zcGxpdE1hcHMsIG5ld0xheWVyKVxuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IHJlbW92ZUxheWVyVXBkYXRlciA9IChzdGF0ZSwge2lkeH0pID0+IHtcbiAgY29uc3Qge2xheWVycywgbGF5ZXJEYXRhLCBjbGlja2VkLCBob3ZlckluZm99ID0gc3RhdGU7XG4gIGNvbnN0IGxheWVyVG9SZW1vdmUgPSBzdGF0ZS5sYXllcnNbaWR4XTtcbiAgY29uc3QgbmV3TWFwcyA9IHJlbW92ZUxheWVyRnJvbVNwbGl0TWFwcyhzdGF0ZSwgbGF5ZXJUb1JlbW92ZSk7XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBsYXllcnM6IFsuLi5sYXllcnMuc2xpY2UoMCwgaWR4KSwgLi4ubGF5ZXJzLnNsaWNlKGlkeCArIDEsIGxheWVycy5sZW5ndGgpXSxcbiAgICBsYXllckRhdGE6IFtcbiAgICAgIC4uLmxheWVyRGF0YS5zbGljZSgwLCBpZHgpLFxuICAgICAgLi4ubGF5ZXJEYXRhLnNsaWNlKGlkeCArIDEsIGxheWVyRGF0YS5sZW5ndGgpXG4gICAgXSxcbiAgICBsYXllck9yZGVyOiBzdGF0ZS5sYXllck9yZGVyXG4gICAgICAuZmlsdGVyKGkgPT4gaSAhPT0gaWR4KVxuICAgICAgLm1hcChwaWQgPT4gKHBpZCA+IGlkeCA/IHBpZCAtIDEgOiBwaWQpKSxcbiAgICBjbGlja2VkOiBsYXllclRvUmVtb3ZlLmlzTGF5ZXJIb3ZlcmVkKGNsaWNrZWQpID8gdW5kZWZpbmVkIDogY2xpY2tlZCxcbiAgICBob3ZlckluZm86IGxheWVyVG9SZW1vdmUuaXNMYXllckhvdmVyZWQoaG92ZXJJbmZvKSA/IHVuZGVmaW5lZCA6IGhvdmVySW5mbyxcbiAgICBzcGxpdE1hcHM6IG5ld01hcHNcbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCByZW9yZGVyTGF5ZXJVcGRhdGVyID0gKHN0YXRlLCB7b3JkZXJ9KSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgbGF5ZXJPcmRlcjogb3JkZXJcbn0pO1xuXG5leHBvcnQgY29uc3QgcmVtb3ZlRGF0YXNldFVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAvLyBleHRyYWN0IGRhdGFzZXQga2V5XG4gIGNvbnN0IHtrZXk6IGRhdGFzZXRLZXl9ID0gYWN0aW9uO1xuICBjb25zdCB7ZGF0YXNldHN9ID0gc3RhdGU7XG5cbiAgLy8gY2hlY2sgaWYgZGF0YXNldCBpcyBwcmVzZW50XG4gIGlmICghZGF0YXNldHNbZGF0YXNldEtleV0pIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuICBjb25zdCB7bGF5ZXJzLCBkYXRhc2V0czoge1tkYXRhc2V0S2V5XTogZGF0YXNldCwgLi4ubmV3RGF0YXNldHN9fSA9IHN0YXRlO1xuICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG5cbiAgY29uc3QgaW5kZXhlcyA9IGxheWVycy5yZWR1Y2UoKGxpc3RPZkluZGV4ZXMsIGxheWVyLCBpbmRleCkgPT4ge1xuICAgIGlmIChsYXllci5jb25maWcuZGF0YUlkID09PSBkYXRhc2V0S2V5KSB7XG4gICAgICBsaXN0T2ZJbmRleGVzLnB1c2goaW5kZXgpO1xuICAgIH1cbiAgICByZXR1cm4gbGlzdE9mSW5kZXhlcztcbiAgfSwgW10pO1xuXG4gIC8vIHJlbW92ZSBsYXllcnMgYW5kIGRhdGFzZXRzXG4gIGNvbnN0IHtuZXdTdGF0ZX0gPSBpbmRleGVzLnJlZHVjZShcbiAgICAoe25ld1N0YXRlOiBjdXJyZW50U3RhdGUsIGluZGV4Q291bnRlcn0sIGlkeCkgPT4ge1xuICAgICAgY29uc3QgY3VycmVudEluZGV4ID0gaWR4IC0gaW5kZXhDb3VudGVyO1xuICAgICAgY3VycmVudFN0YXRlID0gcmVtb3ZlTGF5ZXJVcGRhdGVyKGN1cnJlbnRTdGF0ZSwge2lkeDogY3VycmVudEluZGV4fSk7XG4gICAgICBpbmRleENvdW50ZXIrKztcbiAgICAgIHJldHVybiB7bmV3U3RhdGU6IGN1cnJlbnRTdGF0ZSwgaW5kZXhDb3VudGVyfTtcbiAgICB9LFxuICAgIHtuZXdTdGF0ZTogey4uLnN0YXRlLCBkYXRhc2V0czogbmV3RGF0YXNldHN9LCBpbmRleENvdW50ZXI6IDB9XG4gICk7XG5cbiAgLy8gcmVtb3ZlIGZpbHRlcnNcbiAgY29uc3QgZmlsdGVycyA9IHN0YXRlLmZpbHRlcnMuZmlsdGVyKGZpbHRlciA9PiBmaWx0ZXIuZGF0YUlkICE9PSBkYXRhc2V0S2V5KTtcblxuICAvLyB1cGRhdGUgaW50ZXJhY3Rpb25Db25maWdcbiAgbGV0IHtpbnRlcmFjdGlvbkNvbmZpZ30gPSBzdGF0ZTtcbiAgY29uc3Qge3Rvb2x0aXB9ID0gaW50ZXJhY3Rpb25Db25maWc7XG4gIGlmICh0b29sdGlwKSB7XG4gICAgY29uc3Qge2NvbmZpZ30gPSB0b29sdGlwO1xuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4gICAgY29uc3Qge1tkYXRhc2V0S2V5XTogZmllbGRzLCAuLi5maWVsZHNUb1Nob3d9ID0gY29uZmlnLmZpZWxkc1RvU2hvdztcbiAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG4gICAgaW50ZXJhY3Rpb25Db25maWcgPSB7XG4gICAgICAuLi5pbnRlcmFjdGlvbkNvbmZpZyxcbiAgICAgIHRvb2x0aXA6IHsuLi50b29sdGlwLCBjb25maWc6IHsuLi5jb25maWcsIGZpZWxkc1RvU2hvd319XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7Li4ubmV3U3RhdGUsIGZpbHRlcnMsIGludGVyYWN0aW9uQ29uZmlnfTtcbn07XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVMYXllckJsZW5kaW5nVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgbGF5ZXJCbGVuZGluZzogYWN0aW9uLm1vZGVcbn0pO1xuXG5leHBvcnQgY29uc3Qgc2hvd0RhdGFzZXRUYWJsZVVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGVkaXRpbmdEYXRhc2V0OiBhY3Rpb24uZGF0YUlkXG4gIH07XG59O1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtc3RhdGVtZW50cyAqL1xuZXhwb3J0IGNvbnN0IHVwZGF0ZVZpc0RhdGFVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgLy8gZGF0YXNldHMgY2FuIGJlIGEgc2luZ2xlIGRhdGEgZW50cmllcyBvciBhbiBhcnJheSBvZiBtdWx0aXBsZSBkYXRhIGVudHJpZXNcbiAgY29uc3QgZGF0YXNldHMgPSBBcnJheS5pc0FycmF5KGFjdGlvbi5kYXRhc2V0cylcbiAgICA/IGFjdGlvbi5kYXRhc2V0c1xuICAgIDogW2FjdGlvbi5kYXRhc2V0c107XG5cbiAgY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7Y2VudGVyTWFwOiB0cnVlfTtcbiAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAuLi5kZWZhdWx0T3B0aW9ucyxcbiAgICAuLi5hY3Rpb24ub3B0aW9uc1xuICB9O1xuXG4gIGlmIChhY3Rpb24uY29uZmlnKSB7XG4gICAgLy8gYXBwbHkgY29uZmlnIGlmIHBhc3NlZCBmcm9tIGFjdGlvblxuICAgIHN0YXRlID0gcmVjZWl2ZU1hcENvbmZpZ1VwZGF0ZXIoc3RhdGUsIHtwYXlsb2FkOiB7dmlzU3RhdGU6IGFjdGlvbi5jb25maWd9fSlcbiAgfVxuXG4gIGNvbnN0IG5ld0RhdGVFbnRyaWVzID0gZGF0YXNldHMucmVkdWNlKFxuICAgIChhY2N1LCB7aW5mbyA9IHt9LCBkYXRhfSkgPT4gKHtcbiAgICAgIC4uLmFjY3UsXG4gICAgICAuLi4oY3JlYXRlTmV3RGF0YUVudHJ5KHtpbmZvLCBkYXRhfSwgc3RhdGUuZGF0YXNldHMpIHx8IHt9KVxuICAgIH0pLFxuICAgIHt9XG4gICk7XG5cbiAgaWYgKCFPYmplY3Qua2V5cyhuZXdEYXRlRW50cmllcykubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgY29uc3Qgc3RhdGVXaXRoTmV3RGF0YSA9IHtcbiAgICAuLi5zdGF0ZSxcbiAgICBkYXRhc2V0czoge1xuICAgICAgLi4uc3RhdGUuZGF0YXNldHMsXG4gICAgICAuLi5uZXdEYXRlRW50cmllc1xuICAgIH1cbiAgfTtcblxuICAvLyBwcmV2aW91c2x5IHNhdmVkIGNvbmZpZyBiZWZvcmUgZGF0YSBsb2FkZWRcbiAgY29uc3Qge1xuICAgIGZpbHRlclRvQmVNZXJnZWQgPSBbXSxcbiAgICBsYXllclRvQmVNZXJnZWQgPSBbXSxcbiAgICBpbnRlcmFjdGlvblRvQmVNZXJnZWQgPSB7fVxuICB9ID0gc3RhdGVXaXRoTmV3RGF0YTtcblxuICAvLyBrZWVwIGEgY29weSBvZiBvbGRMYXllcnNcbiAgY29uc3Qgb2xkTGF5ZXJzID0gc3RhdGUubGF5ZXJzLm1hcChsID0+IGwuaWQpO1xuXG4gIC8vIG1lcmdlIHN0YXRlIHdpdGggc2F2ZWQgZmlsdGVyc1xuICBsZXQgbWVyZ2VkU3RhdGUgPSBtZXJnZUZpbHRlcnMoc3RhdGVXaXRoTmV3RGF0YSwgZmlsdGVyVG9CZU1lcmdlZCk7XG4gIC8vIG1lcmdlIHN0YXRlIHdpdGggc2F2ZWQgbGF5ZXJzXG4gIG1lcmdlZFN0YXRlID0gbWVyZ2VMYXllcnMobWVyZ2VkU3RhdGUsIGxheWVyVG9CZU1lcmdlZCk7XG5cbiAgaWYgKG1lcmdlZFN0YXRlLmxheWVycy5sZW5ndGggPT09IHN0YXRlLmxheWVycy5sZW5ndGgpIHtcbiAgICAvLyBubyBsYXllciBtZXJnZWQsIGZpbmQgZGVmYXVsdHNcbiAgICBtZXJnZWRTdGF0ZSA9IGFkZERlZmF1bHRMYXllcnMobWVyZ2VkU3RhdGUsIG5ld0RhdGVFbnRyaWVzKTtcbiAgfVxuXG4gIGlmIChtZXJnZWRTdGF0ZS5zcGxpdE1hcHMubGVuZ3RoKSB7XG4gICAgY29uc3QgbmV3TGF5ZXJzID0gbWVyZ2VkU3RhdGUubGF5ZXJzLmZpbHRlcihcbiAgICAgIGwgPT4gbC5jb25maWcuZGF0YUlkIGluIG5ld0RhdGVFbnRyaWVzXG4gICAgKTtcbiAgICAvLyBpZiBtYXAgaXMgc3BsaXRlZCwgYWRkIG5ldyBsYXllcnMgdG8gc3BsaXRNYXBzXG4gICAgbWVyZ2VkU3RhdGUgPSB7XG4gICAgICAuLi5tZXJnZWRTdGF0ZSxcbiAgICAgIHNwbGl0TWFwczogYWRkTmV3TGF5ZXJzVG9TcGxpdE1hcChtZXJnZWRTdGF0ZS5zcGxpdE1hcHMsIG5ld0xheWVycylcbiAgICB9O1xuICB9XG5cbiAgLy8gbWVyZ2Ugc3RhdGUgd2l0aCBzYXZlZCBpbnRlcmFjdGlvbnNcbiAgbWVyZ2VkU3RhdGUgPSBtZXJnZUludGVyYWN0aW9ucyhtZXJnZWRTdGF0ZSwgaW50ZXJhY3Rpb25Ub0JlTWVyZ2VkKTtcblxuICAvLyBpZiBubyB0b29sdGlwcyBtZXJnZWQgYWRkIGRlZmF1bHQgdG9vbHRpcHNcbiAgT2JqZWN0LmtleXMobmV3RGF0ZUVudHJpZXMpLmZvckVhY2goZGF0YUlkID0+IHtcbiAgICBjb25zdCB0b29sdGlwRmllbGRzID1cbiAgICAgIG1lcmdlZFN0YXRlLmludGVyYWN0aW9uQ29uZmlnLnRvb2x0aXAuY29uZmlnLmZpZWxkc1RvU2hvd1tkYXRhSWRdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheSh0b29sdGlwRmllbGRzKSB8fCAhdG9vbHRpcEZpZWxkcy5sZW5ndGgpIHtcbiAgICAgIG1lcmdlZFN0YXRlID0gYWRkRGVmYXVsdFRvb2x0aXBzKG1lcmdlZFN0YXRlLCBuZXdEYXRlRW50cmllc1tkYXRhSWRdKTtcbiAgICB9XG4gIH0pO1xuXG4gIGNvbnN0IHZpc1N0YXRlID0gdXBkYXRlQWxsTGF5ZXJEb21haW5EYXRhKFxuICAgIG1lcmdlZFN0YXRlLFxuICAgIE9iamVjdC5rZXlzKG5ld0RhdGVFbnRyaWVzKVxuICApO1xuXG4gIGxldCBib3VuZHM7XG4gIGlmIChvcHRpb25zLmNlbnRlck1hcCkge1xuICAgIC8vIGZpbmQgbWFwIGJvdW5kcyBmb3IgbmV3IGxheWVyc1xuICAgIGNvbnN0IG5ld0xheWVycyA9IHZpc1N0YXRlLmxheWVycy5maWx0ZXIobCA9PiAhb2xkTGF5ZXJzLmluY2x1ZGVzKGwuaWQpKTtcbiAgICBib3VuZHMgPSBmaW5kTWFwQm91bmRzKG5ld0xheWVycyk7XG4gIH1cblxuICAvLyBhY3Rpb24gaXMgYmVpbmcgY29tcG9zZWQgaW4gdGhlIGNvbWJpbmUgcmVkdWNlciBsZXZlbCB0byBmdXJ0aGVyIHVwZGF0ZSBtYXAgYm91bmRzXG4gIHJldHVybiB7dmlzU3RhdGUsIGJvdW5kc307XG59O1xuLyogZXNsaW50LWVuYWJsZSBtYXgtc3RhdGVtZW50cyAqL1xuXG5leHBvcnQgY29uc3QgcmVzZXRNYXBDb25maWdVcGRhdGVyID0gKCkgPT4gY2xvbmVEZWVwKElOSVRJQUxfVklTX1NUQVRFKTtcblxuLyoqXG4gKiBMb2FkcyBjdXN0b20gY29uZmlndXJhdGlvbiBpbnRvIHN0YXRlXG4gKiBAcGFyYW0gc3RhdGVcbiAqIEBwYXJhbSBhY3Rpb25cbiAqIEByZXR1cm5zIHsqfVxuICovXG5leHBvcnQgY29uc3QgcmVjZWl2ZU1hcENvbmZpZ1VwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBpZiAoIWFjdGlvbi5wYXlsb2FkLnZpc1N0YXRlKSB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgY29uc3Qge1xuICAgIGZpbHRlcnMsXG4gICAgbGF5ZXJzLFxuICAgIGludGVyYWN0aW9uQ29uZmlnLFxuICAgIGxheWVyQmxlbmRpbmcsXG4gICAgc3BsaXRNYXBzXG4gIH0gPSBhY3Rpb24ucGF5bG9hZC52aXNTdGF0ZTtcblxuICAvLyBhbHdheXMgcmVzZXQgY29uZmlnIHdoZW4gcmVjZWl2ZSBhIG5ldyBjb25maWdcbiAgY29uc3QgcmVzZXRTdGF0ZSA9IHJlc2V0TWFwQ29uZmlnVXBkYXRlcigpO1xuICBsZXQgbWVyZ2VkU3RhdGUgPSB7XG4gICAgLi4ucmVzZXRTdGF0ZSxcbiAgICBzcGxpdE1hcHM6IHNwbGl0TWFwcyB8fCBbXSAvLyBtYXBzIGRvZXNuJ3QgcmVxdWlyZSBhbnkgbG9naWNcbiAgfTtcblxuICBtZXJnZWRTdGF0ZSA9IG1lcmdlRmlsdGVycyhtZXJnZWRTdGF0ZSwgZmlsdGVycyk7XG4gIG1lcmdlZFN0YXRlID0gbWVyZ2VMYXllcnMobWVyZ2VkU3RhdGUsIGxheWVycyk7XG4gIG1lcmdlZFN0YXRlID0gbWVyZ2VJbnRlcmFjdGlvbnMobWVyZ2VkU3RhdGUsIGludGVyYWN0aW9uQ29uZmlnKTtcbiAgbWVyZ2VkU3RhdGUgPSBtZXJnZUxheWVyQmxlbmRpbmcobWVyZ2VkU3RhdGUsIGxheWVyQmxlbmRpbmcpO1xuXG5cbiAgLy8gY29uc3QgbmV3U3RhdGUgPXtcbiAgLy8gICAuLi5yZXNldFN0YXRlLFxuICAvLyAgIC4uLm1lcmdlRmlsdGVycyhtZXJnZWRTdGF0ZSwgZmlsdGVycyksXG4gIC8vICAgLi4ubWVyZ2VMYXllcnMobWVyZ2VkU3RhdGUsIGxheWVycyksXG4gIC8vICAgLi4ubWVyZ2VJbnRlcmFjdGlvbnMobWVyZ2VkU3RhdGUsIGludGVyYWN0aW9uQ29uZmlnKSxcbiAgLy8gICAuLi5tZXJnZUxheWVyQmxlbmRpbmcobWVyZ2VkU3RhdGUsIGxheWVyQmxlbmRpbmcpXG4gIC8vIH07XG5cbiAgcmV0dXJuIG1lcmdlZFN0YXRlO1xufTtcblxuZXhwb3J0IGNvbnN0IGxheWVySG92ZXJVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBob3ZlckluZm86IGFjdGlvbi5pbmZvXG59KTtcblxuZXhwb3J0IGNvbnN0IGxheWVyQ2xpY2tVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBjbGlja2VkOiBhY3Rpb24uaW5mbyAmJiBhY3Rpb24uaW5mby5waWNrZWQgPyBhY3Rpb24uaW5mbyA6IG51bGxcbn0pO1xuXG5leHBvcnQgY29uc3QgbWFwQ2xpY2tVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBjbGlja2VkOiBudWxsXG59KTtcblxuZXhwb3J0IGNvbnN0IHRvZ2dsZVNwbGl0TWFwVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PlxuICBzdGF0ZS5zcGxpdE1hcHMgJiYgc3RhdGUuc3BsaXRNYXBzLmxlbmd0aCA9PT0gMFxuICAgID8ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgLy8gbWF5YmUgd2Ugc2hvdWxkIHVzZSBhbiBhcnJheSB0byBzdG9yZSBzdGF0ZSBmb3IgYSBzaW5nbGUgbWFwIGFzIHdlbGxcbiAgICAgICAgLy8gaWYgY3VycmVudCBtYXBzIGxlbmd0aCBpcyBlcXVhbCB0byAwIGl0IG1lYW5zIHRoYXQgd2UgYXJlIGFib3V0IHRvIHNwbGl0IHRoZSB2aWV3XG4gICAgICAgIHNwbGl0TWFwczogY29tcHV0ZVNwbGl0TWFwTGF5ZXJzKHN0YXRlLmxheWVycylcbiAgICAgIH1cbiAgICA6IGNsb3NlU3BlY2lmaWNNYXBBdEluZGV4KHN0YXRlLCBhY3Rpb24pO1xuXG4vKipcbiAqIFRoaXMgaXMgdHJpZ2dlcmVkIHdoZW4gdmlldyBpcyBzcGxpdCBpbnRvIG11bHRpcGxlIG1hcHMuXG4gKiBJdCB3aWxsIG9ubHkgdXBkYXRlIGxheWVycyB0aGF0IGJlbG9uZyB0byB0aGUgbWFwIGxheWVyIGRyb3Bkb3duXG4gKiB0aGUgdXNlciBpcyBpbnRlcmFjdGluZyB3aXRcbiAqIEBwYXJhbSBzdGF0ZVxuICogQHBhcmFtIGFjdGlvblxuICovXG5leHBvcnQgY29uc3Qgc2V0VmlzaWJsZUxheWVyc0Zvck1hcFVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCB7bWFwSW5kZXgsIGxheWVySWRzfSA9IGFjdGlvbjtcbiAgaWYgKCFsYXllcklkcykge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIGNvbnN0IHtzcGxpdE1hcHMgPSBbXX0gPSBzdGF0ZTtcblxuICBpZiAoc3BsaXRNYXBzLmxlbmd0aCA9PT0gMCkge1xuICAgIC8vIHdlIHNob3VsZCBuZXZlciBnZXQgaW50byB0aGlzIHN0YXRlXG4gICAgLy8gYmVjYXVzZSB0aGlzIGFjdGlvbiBzaG91bGQgb25seSBiZSB0cmlnZ2VyZWRcbiAgICAvLyB3aGVuIG1hcCB2aWV3IGlzIHNwbGl0XG4gICAgLy8gYnV0IHNvbWV0aGluZyBtYXkgaGF2ZSBoYXBwZW5lZFxuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIC8vIG5lZWQgdG8gY2hlY2sgaWYgbWFwcyBpcyBwb3B1bGF0ZWQgb3RoZXJ3aXNlIHdpbGwgY3JlYXRlXG4gIGNvbnN0IHtbbWFwSW5kZXhdOiBtYXAgPSB7fX0gPSBzcGxpdE1hcHM7XG5cbiAgY29uc3QgbGF5ZXJzID0gbWFwLmxheWVycyB8fCBbXTtcblxuICAvLyB3ZSBzZXQgdmlzaWJpbGl0eSB0byB0cnVlIGZvciBhbGwgbGF5ZXJzIGluY2x1ZGVkIGluIG91ciBpbnB1dCBsaXN0XG4gIGNvbnN0IG5ld0xheWVycyA9IChPYmplY3Qua2V5cyhsYXllcnMpIHx8IFtdKS5yZWR1Y2UoKGN1cnJlbnRMYXllcnMsIGlkeCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5jdXJyZW50TGF5ZXJzLFxuICAgICAgW2lkeF06IHtcbiAgICAgICAgLi4ubGF5ZXJzW2lkeF0sXG4gICAgICAgIGlzVmlzaWJsZTogbGF5ZXJJZHMuaW5jbHVkZXMoaWR4KVxuICAgICAgfVxuICAgIH07XG4gIH0sIHt9KTtcblxuICBjb25zdCBuZXdNYXBzID0gWy4uLnNwbGl0TWFwc107XG5cbiAgbmV3TWFwc1ttYXBJbmRleF0gPSB7XG4gICAgLi4uc3BsaXRNYXBzW21hcEluZGV4XSxcbiAgICBsYXllcnM6IG5ld0xheWVyc1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgc3BsaXRNYXBzOiBuZXdNYXBzXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgdG9nZ2xlTGF5ZXJGb3JNYXBVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgaWYgKCFzdGF0ZS5zcGxpdE1hcHNbYWN0aW9uLm1hcEluZGV4XSkge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIGNvbnN0IG1hcFNldHRpbmdzID0gc3RhdGUuc3BsaXRNYXBzW2FjdGlvbi5tYXBJbmRleF07XG4gIGNvbnN0IHtsYXllcnN9ID0gbWFwU2V0dGluZ3M7XG4gIGlmICghbGF5ZXJzIHx8ICFsYXllcnNbYWN0aW9uLmxheWVySWRdKSB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgY29uc3QgbGF5ZXIgPSBsYXllcnNbYWN0aW9uLmxheWVySWRdO1xuXG4gIGNvbnN0IG5ld0xheWVyID0ge1xuICAgIC4uLmxheWVyLFxuICAgIGlzVmlzaWJsZTogIWxheWVyLmlzVmlzaWJsZVxuICB9O1xuXG4gIGNvbnN0IG5ld0xheWVycyA9IHtcbiAgICAuLi5sYXllcnMsXG4gICAgW2FjdGlvbi5sYXllcklkXTogbmV3TGF5ZXJcbiAgfTtcblxuICAvLyBjb25zdCBzcGxpdE1hcHMgPSBzdGF0ZS5zcGxpdE1hcHM7XG4gIGNvbnN0IG5ld1NwbGl0TWFwcyA9IFsuLi5zdGF0ZS5zcGxpdE1hcHNdO1xuICBuZXdTcGxpdE1hcHNbYWN0aW9uLm1hcEluZGV4XSA9IHtcbiAgICAuLi5tYXBTZXR0aW5ncyxcbiAgICBsYXllcnM6IG5ld0xheWVyc1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgc3BsaXRNYXBzOiBuZXdTcGxpdE1hcHNcbiAgfTtcbn07XG5cbmZ1bmN0aW9uIGdlbmVyYXRlTGF5ZXJNZXRhRm9yU3BsaXRWaWV3cyhsYXllcikge1xuICByZXR1cm4ge1xuICAgIGlzQXZhaWxhYmxlOiBsYXllci5jb25maWcuaXNWaXNpYmxlLFxuICAgIGlzVmlzaWJsZTogbGF5ZXIuY29uZmlnLmlzVmlzaWJsZVxuICB9O1xufVxuXG4vKipcbiAqIFRoaXMgZW10aG9kIHdpbGwgY29tcHV0ZSB0aGUgZGVmYXVsdCBtYXBzIGN1c3RvbSBsaXN0XG4gKiBiYXNlZCBvbiB0aGUgY3VycmVudCBsYXllcnMgc3RhdHVzXG4gKiBAcGFyYW0gbGF5ZXJzXG4gKiBAcmV0dXJucyB7WyosKl19XG4gKi9cbmZ1bmN0aW9uIGNvbXB1dGVTcGxpdE1hcExheWVycyhsYXllcnMpIHtcbiAgY29uc3QgbWFwTGF5ZXJzID0gbGF5ZXJzLnJlZHVjZShcbiAgICAobmV3TGF5ZXJzLCBjdXJyZW50TGF5ZXIpID0+ICh7XG4gICAgICAuLi5uZXdMYXllcnMsXG4gICAgICBbY3VycmVudExheWVyLmlkXTogZ2VuZXJhdGVMYXllck1ldGFGb3JTcGxpdFZpZXdzKGN1cnJlbnRMYXllcilcbiAgICB9KSxcbiAgICB7fVxuICApO1xuICByZXR1cm4gW1xuICAgIHtcbiAgICAgIGxheWVyczogbWFwTGF5ZXJzXG4gICAgfSxcbiAgICB7XG4gICAgICBsYXllcnM6IG1hcExheWVyc1xuICAgIH1cbiAgXTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYW4gZXhpc3RpbmcgbGF5ZXJzIGZyb20gY3VzdG9tIG1hcCBsYXllciBvYmplY3RzXG4gKiBAcGFyYW0gc3RhdGVcbiAqIEBwYXJhbSBsYXllclxuICogQHJldHVybnMge1sqLCpdfSBNYXBzIG9mIGN1c3RvbSBsYXllciBvYmplY3RzXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUxheWVyRnJvbVNwbGl0TWFwcyhzdGF0ZSwgbGF5ZXIpIHtcbiAgcmV0dXJuIHN0YXRlLnNwbGl0TWFwcy5tYXAoc2V0dGluZ3MgPT4ge1xuICAgIGNvbnN0IHtsYXllcnN9ID0gc2V0dGluZ3M7XG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgICBjb25zdCB7W2xheWVyLmlkXTogXywgLi4ubmV3TGF5ZXJzfSA9IGxheWVycztcbiAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnNldHRpbmdzLFxuICAgICAgbGF5ZXJzOiBuZXdMYXllcnNcbiAgICB9O1xuICB9KTtcbn1cblxuLyoqXG4gKiBBZGQgbmV3IGxheWVycyB0byBib3RoIGV4aXN0aW5nIG1hcHNcbiAqIEBwYXJhbSBzcGxpdE1hcHNcbiAqIEBwYXJhbSBsYXllcnNcbiAqIEByZXR1cm5zIHtbKiwqXX0gbmV3IHNwbGl0TWFwc1xuICovXG5mdW5jdGlvbiBhZGROZXdMYXllcnNUb1NwbGl0TWFwKHNwbGl0TWFwcywgbGF5ZXJzKSB7XG4gIGNvbnN0IG5ld0xheWVycyA9IEFycmF5LmlzQXJyYXkobGF5ZXJzKSA/IGxheWVycyA6IFtsYXllcnNdO1xuXG4gIGlmICghc3BsaXRNYXBzIHx8ICFzcGxpdE1hcHMubGVuZ3RoIHx8ICFuZXdMYXllcnMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHNwbGl0TWFwcztcbiAgfVxuXG4gIC8vIGFkZCBuZXcgbGF5ZXIgdG8gYm90aCBtYXBzLFxuICAvLyAgZG9uJ3Qgb3ZlcnJpZGUsIGlmIGxheWVyLmlkIGlzIGFscmVhZHkgaW4gc3BsaXRNYXBzLnNldHRpbmdzLmxheWVyc1xuICByZXR1cm4gc3BsaXRNYXBzLm1hcChzZXR0aW5ncyA9PiAoe1xuICAgIC4uLnNldHRpbmdzLFxuICAgIGxheWVyczoge1xuICAgICAgLi4uc2V0dGluZ3MubGF5ZXJzLFxuICAgICAgLi4ubmV3TGF5ZXJzLnJlZHVjZShcbiAgICAgICAgKGFjY3UsIG5ld0xheWVyKSA9PlxuICAgICAgICAgIG5ld0xheWVyLmNvbmZpZy5pc1Zpc2libGVcbiAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgIC4uLmFjY3UsXG4gICAgICAgICAgICAgICAgW25ld0xheWVyLmlkXTogc2V0dGluZ3MubGF5ZXJzW25ld0xheWVyLmlkXVxuICAgICAgICAgICAgICAgICAgPyBzZXR0aW5ncy5sYXllcnNbbmV3TGF5ZXIuaWRdXG4gICAgICAgICAgICAgICAgICA6IGdlbmVyYXRlTGF5ZXJNZXRhRm9yU3BsaXRWaWV3cyhuZXdMYXllcilcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgOiBhY2N1LFxuICAgICAgICB7fVxuICAgICAgKVxuICAgIH1cbiAgfSkpO1xufVxuXG4vKipcbiAqIEhpZGUgYW4gZXhpc3RpbmcgbGF5ZXJzIGZyb20gY3VzdG9tIG1hcCBsYXllciBvYmplY3RzXG4gKiBAcGFyYW0gc3RhdGVcbiAqIEBwYXJhbSBsYXllclxuICogQHJldHVybnMge1sqLCpdfSBNYXBzIG9mIGN1c3RvbSBsYXllciBvYmplY3RzXG4gKi9cbmZ1bmN0aW9uIHRvZ2dsZUxheWVyRnJvbVNwbGl0TWFwcyhzdGF0ZSwgbGF5ZXIpIHtcbiAgcmV0dXJuIHN0YXRlLnNwbGl0TWFwcy5tYXAoc2V0dGluZ3MgPT4ge1xuICAgIGNvbnN0IHtsYXllcnN9ID0gc2V0dGluZ3M7XG4gICAgY29uc3QgbmV3TGF5ZXJzID0ge1xuICAgICAgLi4ubGF5ZXJzLFxuICAgICAgW2xheWVyLmlkXTogZ2VuZXJhdGVMYXllck1ldGFGb3JTcGxpdFZpZXdzKGxheWVyKVxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc2V0dGluZ3MsXG4gICAgICBsYXllcnM6IG5ld0xheWVyc1xuICAgIH07XG4gIH0pO1xufVxuXG4vKipcbiAqIFdoZW4gYSB1c2VyIGNsaWNrcyBvbiB0aGUgc3BlY2lmaWMgbWFwIGNsb3NpbmcgaWNvblxuICogdGhlIGFwcGxpY2F0aW9uIHdpbGwgY2xvc2UgdGhlIHNlbGVjdGVkIG1hcFxuICogYW5kIHdpbGwgbWVyZ2UgdGhlIHJlbWFpbmluZyBvbmUgd2l0aCB0aGUgZ2xvYmFsIHN0YXRlXG4gKiBUT0RPOiBpIHRoaW5rIGluIHRoZSBmdXR1cmUgdGhpcyBhY3Rpb24gc2hvdWxkIGJlIGNhbGxlZCBtZXJnZSBtYXAgbGF5ZXJzIHdpdGggZ2xvYmFsIHNldHRpbmdzXG4gKiBAcGFyYW0gc3RhdGVcbiAqIEBwYXJhbSBhY3Rpb25cbiAqIEByZXR1cm5zIHsqfVxuICovXG5mdW5jdGlvbiBjbG9zZVNwZWNpZmljTWFwQXRJbmRleChzdGF0ZSwgYWN0aW9uKSB7XG4gIC8vIHJldHJpZXZlIGxheWVycyBtZXRhIGRhdGEgZnJvbSB0aGUgcmVtYWluaW5nIG1hcCB0aGF0IHdlIG5lZWQgdG8ga2VlcFxuICBjb25zdCBpbmRleFRvUmV0cmlldmUgPSAxIC0gYWN0aW9uLnBheWxvYWQ7XG5cbiAgY29uc3QgbWV0YVNldHRpbmdzID0gc3RhdGUuc3BsaXRNYXBzW2luZGV4VG9SZXRyaWV2ZV07XG4gIGlmICghbWV0YVNldHRpbmdzIHx8ICFtZXRhU2V0dGluZ3MubGF5ZXJzKSB7XG4gICAgLy8gaWYgd2UgY2FuJ3QgZmluZCB0aGUgbWV0YSBzZXR0aW5ncyB3ZSBzaW1wbHkgY2xlYW4gdXAgc3BsaXRNYXBzIGFuZFxuICAgIC8vIGtlZXAgZ2xvYmFsIHN0YXRlIGFzIGl0IGlzXG4gICAgLy8gYnV0IHdoeSBkb2VzIHRoaXMgZXZlciBoYXBwZW4/XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgc3BsaXRNYXBzOiBbXVxuICAgIH07XG4gIH1cblxuICBjb25zdCB7bGF5ZXJzfSA9IHN0YXRlO1xuXG4gIC8vIHVwZGF0ZSBsYXllciB2aXNpYmlsaXR5XG4gIGNvbnN0IG5ld0xheWVycyA9IGxheWVycy5tYXAobGF5ZXIgPT5cbiAgICBsYXllci51cGRhdGVMYXllckNvbmZpZyh7XG4gICAgICBpc1Zpc2libGU6IG1ldGFTZXR0aW5ncy5sYXllcnNbbGF5ZXIuaWRdXG4gICAgICAgID8gbWV0YVNldHRpbmdzLmxheWVyc1tsYXllci5pZF0uaXNWaXNpYmxlXG4gICAgICAgIDogbGF5ZXIuY29uZmlnLmlzVmlzaWJsZVxuICAgIH0pXG4gICk7XG5cbiAgLy8gZGVsZXRlIG1hcFxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGxheWVyczogbmV3TGF5ZXJzLFxuICAgIHNwbGl0TWFwczogW11cbiAgfTtcbn1cblxuLy8gVE9ETzogcmVkbyB3cml0ZSBoYW5kbGVyIHRvIG5vdCB1c2UgdGFza3NcbmV4cG9ydCBjb25zdCBsb2FkRmlsZXNVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgY29uc3Qge2ZpbGVzfSA9IGFjdGlvbjtcbiAgY29uc3QgZmlsZXNUb0xvYWQgPSBmaWxlcy5tYXAoZmlsZUJsb2IgPT4gKHtcbiAgICBmaWxlQmxvYixcbiAgICBpbmZvOiB7XG4gICAgICBpZDogZ2VuZXJhdGVIYXNoSWQoNCksXG4gICAgICBsYWJlbDogZmlsZUJsb2IubmFtZSxcbiAgICAgIHNpemU6IGZpbGVCbG9iLnNpemVcbiAgICB9LFxuICAgIGhhbmRsZXI6IGdldEZpbGVIYW5kbGVyKGZpbGVCbG9iKVxuICB9KSk7XG5cbiAgLy8gcmVhZGVyIC0+IHBhcnNlciAtPiBhdWdtZW50IC0+IHJlY2VpdmVWaXNEYXRhXG4gIGNvbnN0IGxvYWRGaWxlVGFza3MgPSBbXG4gICAgVGFzay5hbGwoZmlsZXNUb0xvYWQubWFwKExPQURfRklMRV9UQVNLKSkuYmltYXAoXG4gICAgICByZXN1bHRzID0+IHVwZGF0ZVZpc0RhdGEocmVzdWx0cywge2NlbnRlck1hcDogdHJ1ZX0pLFxuICAgICAgZXJyb3IgPT4gbG9hZEZpbGVzRXJyKGVycm9yKVxuICAgIClcbiAgXTtcblxuICByZXR1cm4gd2l0aFRhc2soXG4gICAge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBmaWxlTG9hZGluZzogdHJ1ZVxuICAgIH0sXG4gICAgbG9hZEZpbGVUYXNrc1xuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IGxvYWRGaWxlc0VyclVwZGF0ZXIgPSAoc3RhdGUsIHtlcnJvcn0pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBmaWxlTG9hZGluZzogZmFsc2UsXG4gIGZpbGVMb2FkaW5nRXJyOiBlcnJvclxufSk7XG5cbi8qKlxuICogaGVscGVyIGZ1bmN0aW9uIHRvIHVwZGF0ZSBBbGwgbGF5ZXIgZG9tYWluIGFuZCBsYXllciBkYXRhIG9mIHN0YXRlXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHN0YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0YXNldHNcbiAqIEByZXR1cm5zIHtvYmplY3R9IHN0YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGREZWZhdWx0TGF5ZXJzKHN0YXRlLCBkYXRhc2V0cykge1xuICBjb25zdCBkZWZhdWx0TGF5ZXJzID0gT2JqZWN0LnZhbHVlcyhkYXRhc2V0cykucmVkdWNlKFxuICAgIChhY2N1LCBkYXRhc2V0KSA9PiBbLi4uYWNjdSwgLi4uKGZpbmREZWZhdWx0TGF5ZXIoZGF0YXNldCkgfHwgW10pXSxcbiAgICBbXVxuICApO1xuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgbGF5ZXJzOiBbLi4uc3RhdGUubGF5ZXJzLCAuLi5kZWZhdWx0TGF5ZXJzXSxcbiAgICBsYXllck9yZGVyOiBbXG4gICAgICAvLyBwdXQgbmV3IGxheWVycyBvbiB0b3Agb2Ygb2xkIG9uZXNcbiAgICAgIC4uLmRlZmF1bHRMYXllcnMubWFwKChfLCBpKSA9PiBzdGF0ZS5sYXllcnMubGVuZ3RoICsgaSksXG4gICAgICAuLi5zdGF0ZS5sYXllck9yZGVyXG4gICAgXVxuICB9O1xufVxuXG4vKipcbiAqIGhlbHBlciBmdW5jdGlvbiB0byBmaW5kIGRlZmF1bHQgdG9vbHRpcHNcbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gc3RhdGVcbiAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhc2V0XG4gKiBAcmV0dXJucyB7b2JqZWN0fSBzdGF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkRGVmYXVsdFRvb2x0aXBzKHN0YXRlLCBkYXRhc2V0KSB7XG4gIGNvbnN0IHRvb2x0aXBGaWVsZHMgPSBmaW5kRmllbGRzVG9TaG93KGRhdGFzZXQpO1xuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgaW50ZXJhY3Rpb25Db25maWc6IHtcbiAgICAgIC4uLnN0YXRlLmludGVyYWN0aW9uQ29uZmlnLFxuICAgICAgdG9vbHRpcDoge1xuICAgICAgICAuLi5zdGF0ZS5pbnRlcmFjdGlvbkNvbmZpZy50b29sdGlwLFxuICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAvLyBmaW5kIGRlZmF1bHQgZmllbGRzIHRvIHNob3cgaW4gdG9vbHRpcFxuICAgICAgICAgIGZpZWxkc1RvU2hvdzoge1xuICAgICAgICAgICAgLi4uc3RhdGUuaW50ZXJhY3Rpb25Db25maWcudG9vbHRpcC5jb25maWcuZmllbGRzVG9TaG93LFxuICAgICAgICAgICAgLi4udG9vbHRpcEZpZWxkc1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4gKiBoZWxwZXIgZnVuY3Rpb24gdG8gdXBkYXRlIGxheWVyIGRvbWFpbnMgZm9yIGFuIGFycmF5IG9mIGRhdHNldHNcbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gc3RhdGVcbiAqIEBwYXJhbSB7YXJyYXkgfCBzdHJpbmd9IGRhdGFJZFxuICogQHJldHVybnMge29iamVjdH0gc3RhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUFsbExheWVyRG9tYWluRGF0YShzdGF0ZSwgZGF0YUlkKSB7XG4gIGNvbnN0IGRhdGFJZHMgPSB0eXBlb2YgZGF0YUlkID09PSAnc3RyaW5nJyA/IFtkYXRhSWRdIDogZGF0YUlkO1xuICBjb25zdCBuZXdMYXllcnMgPSBbXTtcbiAgY29uc3QgbmV3TGF5ZXJEYXRhcyA9IFtdO1xuXG4gIHN0YXRlLmxheWVycy5mb3JFYWNoKChvbGRMYXllciwgaSkgPT4ge1xuICAgIGlmIChvbGRMYXllci5jb25maWcuZGF0YUlkICYmIGRhdGFJZHMuaW5jbHVkZXMob2xkTGF5ZXIuY29uZmlnLmRhdGFJZCkpIHtcbiAgICAgIGNvbnN0IG5ld0xheWVyID0gb2xkTGF5ZXIudXBkYXRlTGF5ZXJEb21haW4oXG4gICAgICAgIHN0YXRlLmRhdGFzZXRzW29sZExheWVyLmNvbmZpZy5kYXRhSWRdXG4gICAgICApO1xuICAgICAgY29uc3Qge2xheWVyRGF0YSwgbGF5ZXJ9ID0gY2FsY3VsYXRlTGF5ZXJEYXRhKFxuICAgICAgICBuZXdMYXllcixcbiAgICAgICAgc3RhdGUsXG4gICAgICAgIHN0YXRlLmxheWVyRGF0YVtpXVxuICAgICAgKTtcblxuICAgICAgbmV3TGF5ZXJzLnB1c2gobGF5ZXIpO1xuICAgICAgbmV3TGF5ZXJEYXRhcy5wdXNoKGxheWVyRGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld0xheWVycy5wdXNoKG9sZExheWVyKTtcbiAgICAgIG5ld0xheWVyRGF0YXMucHVzaChzdGF0ZS5sYXllckRhdGFbaV0pO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBsYXllcnM6IG5ld0xheWVycyxcbiAgICBsYXllckRhdGE6IG5ld0xheWVyRGF0YXNcbiAgfTtcbn1cblxuIl19