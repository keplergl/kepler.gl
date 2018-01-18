'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onFileUploadError = exports.onFileUpload = exports.toggleLayerForMap = exports.setVisibleLayersForMap = exports.handleSplitToggle = exports.handleMapClick = exports.handleLayerClick = exports.handleLayerHover = exports.handleReceiveMapConfig = exports.handleResetConfig = exports.receiveVisData = exports.showDatasetTable = exports.updateLayerBlending = exports.removeDataset = exports.reorderLayer = exports.removeLayer = exports.addLayer = exports.removeFilter = exports.enlargeFilter = exports.onToggleFilterAnimation = exports.addFilter = exports.updateFilterPlot = exports.INITIAL_VIS_STATE = undefined;

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends13 = require('babel-runtime/helpers/extends');

var _extends14 = _interopRequireDefault(_extends13);

exports.updateLayerConfig = updateLayerConfig;
exports.updateLayerType = updateLayerType;
exports.updateLayerVisualChannelConfig = updateLayerVisualChannelConfig;
exports.updateLayerVisConfig = updateLayerVisConfig;
exports.updateInteractionConfig = updateInteractionConfig;
exports.updateFilter = updateFilter;
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
function updateLayerConfig(state, action) {
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

function updateLayerType(state, action) {
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

function updateLayerVisualChannelConfig(state, action) {
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

function updateLayerVisConfig(state, action) {
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

function updateInteractionConfig(state, action) {
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

function updateFilter(state, action) {
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

var updateFilterPlot = exports.updateFilterPlot = function updateFilterPlot(state, _ref2) {
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

var addFilter = exports.addFilter = function addFilter(state, action) {
  return !action.dataId ? state : (0, _extends14.default)({}, state, {
    filters: [].concat(state.filters, [(0, _filterUtils.getDefaultfilter)(action.dataId)])
  });
};

var onToggleFilterAnimation = exports.onToggleFilterAnimation = function onToggleFilterAnimation(state, action) {
  return (0, _extends14.default)({}, state, {
    filters: state.filters.map(function (f, i) {
      return i === action.idx ? (0, _extends14.default)({}, f, { isAnimating: !f.isAnimating }) : f;
    })
  });
};

var enlargeFilter = exports.enlargeFilter = function enlargeFilter(state, action) {
  var isEnlarged = state.filters[action.idx].enlarged;

  return (0, _extends14.default)({}, state, {
    filters: state.filters.map(function (f, i) {
      f.enlarged = !isEnlarged && i === action.idx;
      return f;
    })
  });
};

var removeFilter = exports.removeFilter = function removeFilter(state, action) {
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

var addLayer = exports.addLayer = function addLayer(state, action) {
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

var removeLayer = exports.removeLayer = function removeLayer(state, _ref3) {
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

var reorderLayer = exports.reorderLayer = function reorderLayer(state, _ref4) {
  var order = _ref4.order;
  return (0, _extends14.default)({}, state, {
    layerOrder: order
  });
};

var removeDataset = function removeDataset(state, action) {
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
    currentState = removeLayer(currentState, { idx: currentIndex });
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

exports.removeDataset = removeDataset;
var updateLayerBlending = exports.updateLayerBlending = function updateLayerBlending(state, action) {
  return (0, _extends14.default)({}, state, {
    layerBlending: action.mode
  });
};

var showDatasetTable = exports.showDatasetTable = function showDatasetTable(state, action) {
  return (0, _extends14.default)({}, state, {
    editingDataset: action.dataId
  });
};

/* eslint-disable max-statements */
var receiveVisData = exports.receiveVisData = function receiveVisData(state, action) {
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

var handleResetConfig = exports.handleResetConfig = function handleResetConfig() {
  return (0, _lodash2.default)(INITIAL_VIS_STATE);
};

var handleReceiveMapConfig = exports.handleReceiveMapConfig = function handleReceiveMapConfig(state, action) {
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

  var resetState = handleResetConfig();
  var mergedState = (0, _extends14.default)({}, resetState, {
    splitMaps: splitMaps || [] // maps doesn't require any logic
  });

  mergedState = (0, _visStateMerger.mergeFilters)(mergedState, filters);
  mergedState = (0, _visStateMerger.mergeLayers)(mergedState, layers);
  mergedState = (0, _visStateMerger.mergeInteractions)(mergedState, interactionConfig);
  mergedState = (0, _visStateMerger.mergeLayerBlending)(mergedState, layerBlending);

  return mergedState;
};

var handleLayerHover = exports.handleLayerHover = function handleLayerHover(state, action) {
  return (0, _extends14.default)({}, state, {
    hoverInfo: action.info
  });
};

var handleLayerClick = exports.handleLayerClick = function handleLayerClick(state, action) {
  return (0, _extends14.default)({}, state, {
    clicked: action.info && action.info.picked ? action.info : null
  });
};

var handleMapClick = exports.handleMapClick = function handleMapClick(state, action) {
  return (0, _extends14.default)({}, state, {
    clicked: null
  });
};

var handleSplitToggle = exports.handleSplitToggle = function handleSplitToggle(state, action) {
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
var setVisibleLayersForMap = exports.setVisibleLayersForMap = function setVisibleLayersForMap(state, action) {
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

var toggleLayerForMap = exports.toggleLayerForMap = function toggleLayerForMap(state, action) {
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

var onFileUpload = exports.onFileUpload = function onFileUpload(state, action) {
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

var onFileUploadError = exports.onFileUploadError = function onFileUploadError(state, _ref7) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy92aXMtc3RhdGUtdXBkYXRlcnMuanMiXSwibmFtZXMiOlsidXBkYXRlTGF5ZXJDb25maWciLCJ1cGRhdGVMYXllclR5cGUiLCJ1cGRhdGVMYXllclZpc3VhbENoYW5uZWxDb25maWciLCJ1cGRhdGVMYXllclZpc0NvbmZpZyIsInVwZGF0ZUludGVyYWN0aW9uQ29uZmlnIiwidXBkYXRlRmlsdGVyIiwiYWRkRGVmYXVsdExheWVycyIsImFkZERlZmF1bHRUb29sdGlwcyIsInVwZGF0ZUFsbExheWVyRG9tYWluRGF0YSIsIktlcGxlckdMTGF5ZXJzIiwiSU5JVElBTF9WSVNfU1RBVEUiLCJsYXllcnMiLCJsYXllckRhdGEiLCJsYXllclRvQmVNZXJnZWQiLCJsYXllck9yZGVyIiwiZmlsdGVycyIsImZpbHRlclRvQmVNZXJnZWQiLCJkYXRhc2V0cyIsImVkaXRpbmdEYXRhc2V0IiwidW5kZWZpbmVkIiwiaW50ZXJhY3Rpb25Db25maWciLCJpbnRlcmFjdGlvblRvQmVNZXJnZWQiLCJsYXllckJsZW5kaW5nIiwiaG92ZXJJbmZvIiwiY2xpY2tlZCIsImZpbGVMb2FkaW5nIiwiZmlsZUxvYWRpbmdFcnIiLCJzcGxpdE1hcHMiLCJ1cGRhdGVTdGF0ZVdpdGhMYXllckFuZERhdGEiLCJzdGF0ZSIsImxheWVyIiwiaWR4IiwibWFwIiwibHlyIiwiaSIsImQiLCJhY3Rpb24iLCJvbGRMYXllciIsImZpbmRJbmRleCIsImwiLCJpZCIsInByb3BzIiwiT2JqZWN0Iiwia2V5cyIsIm5ld0NvbmZpZyIsIm5ld0xheWVyIiwic2hvdWxkQ2FsY3VsYXRlTGF5ZXJEYXRhIiwib2xkTGF5ZXJEYXRhIiwic2FtZURhdGEiLCJuZXdTdGF0ZSIsInRvZ2dsZUxheWVyRnJvbVNwbGl0TWFwcyIsIm5ld1R5cGUiLCJvbGRJZCIsImVycm9yIiwiTGF5ZXJDbGFzcyIsImNvbmZpZyIsImFzc2lnbkNvbmZpZ1RvTGF5ZXIiLCJzZXR0aW5ncyIsIm9sZExheWVyTWFwIiwib3RoZXJMYXllcnMiLCJjaGFubmVsIiwiZGF0YUlkIiwiZGF0YSIsImFsbERhdGEiLCJ1cGRhdGVMYXllclZpc3VhbENoYW5uZWwiLCJuZXdWaXNDb25maWciLCJ2aXNDb25maWciLCJlbmFibGVkIiwiZm9yRWFjaCIsImsiLCJwcm9wIiwidmFsdWUiLCJuZXdGaWx0ZXIiLCJmaWVsZHMiLCJmaWVsZElkeCIsImYiLCJuYW1lIiwiZmllbGQiLCJmaWx0ZXJQcm9wIiwiZnJlZXplIiwidXBkYXRlRmlsdGVyUGxvdCIsIm5ld1Byb3AiLCJwbG90VHlwZSIsImFkZEZpbHRlciIsIm9uVG9nZ2xlRmlsdGVyQW5pbWF0aW9uIiwiaXNBbmltYXRpbmciLCJlbmxhcmdlRmlsdGVyIiwiaXNFbmxhcmdlZCIsImVubGFyZ2VkIiwicmVtb3ZlRmlsdGVyIiwibmV3RmlsdGVycyIsInNsaWNlIiwibGVuZ3RoIiwiYWRkTGF5ZXIiLCJkZWZhdWx0RGF0YXNldCIsIkxheWVyIiwiaXNWaXNpYmxlIiwiaXNDb25maWdBY3RpdmUiLCJhZGROZXdMYXllcnNUb1NwbGl0TWFwIiwicmVtb3ZlTGF5ZXIiLCJsYXllclRvUmVtb3ZlIiwibmV3TWFwcyIsInJlbW92ZUxheWVyRnJvbVNwbGl0TWFwcyIsImZpbHRlciIsInBpZCIsImlzTGF5ZXJIb3ZlcmVkIiwicmVvcmRlckxheWVyIiwib3JkZXIiLCJyZW1vdmVEYXRhc2V0IiwiZGF0YXNldEtleSIsImtleSIsImRhdGFzZXQiLCJuZXdEYXRhc2V0cyIsImluZGV4ZXMiLCJyZWR1Y2UiLCJsaXN0T2ZJbmRleGVzIiwiaW5kZXgiLCJwdXNoIiwiY3VycmVudFN0YXRlIiwiaW5kZXhDb3VudGVyIiwiY3VycmVudEluZGV4IiwidG9vbHRpcCIsImZpZWxkc1RvU2hvdyIsInVwZGF0ZUxheWVyQmxlbmRpbmciLCJtb2RlIiwic2hvd0RhdGFzZXRUYWJsZSIsInJlY2VpdmVWaXNEYXRhIiwiQXJyYXkiLCJpc0FycmF5Iiwib3B0aW9ucyIsImNlbnRlck1hcCIsIm5ld0RhdGVFbnRyaWVzIiwiYWNjdSIsImluZm8iLCJzdGF0ZVdpdGhOZXdEYXRhIiwib2xkTGF5ZXJzIiwibWVyZ2VkU3RhdGUiLCJuZXdMYXllcnMiLCJ0b29sdGlwRmllbGRzIiwidmlzU3RhdGUiLCJib3VuZHMiLCJpbmNsdWRlcyIsImhhbmRsZVJlc2V0Q29uZmlnIiwiaGFuZGxlUmVjZWl2ZU1hcENvbmZpZyIsInBheWxvYWQiLCJyZXNldFN0YXRlIiwiaGFuZGxlTGF5ZXJIb3ZlciIsImhhbmRsZUxheWVyQ2xpY2siLCJwaWNrZWQiLCJoYW5kbGVNYXBDbGljayIsImhhbmRsZVNwbGl0VG9nZ2xlIiwiY29tcHV0ZVNwbGl0TWFwTGF5ZXJzIiwiY2xvc2VTcGVjaWZpY01hcEF0SW5kZXgiLCJzZXRWaXNpYmxlTGF5ZXJzRm9yTWFwIiwibWFwSW5kZXgiLCJsYXllcklkcyIsImN1cnJlbnRMYXllcnMiLCJ0b2dnbGVMYXllckZvck1hcCIsIm1hcFNldHRpbmdzIiwibGF5ZXJJZCIsIm5ld1NwbGl0TWFwcyIsImdlbmVyYXRlTGF5ZXJNZXRhRm9yU3BsaXRWaWV3cyIsImlzQXZhaWxhYmxlIiwibWFwTGF5ZXJzIiwiY3VycmVudExheWVyIiwiXyIsImluZGV4VG9SZXRyaWV2ZSIsIm1ldGFTZXR0aW5ncyIsIm9uRmlsZVVwbG9hZCIsImZpbGVzIiwiZmlsZXNUb0xvYWQiLCJmaWxlQmxvYiIsImxhYmVsIiwic2l6ZSIsImhhbmRsZXIiLCJsb2FkRmlsZVRhc2tzIiwiYWxsIiwiYmltYXAiLCJyZXN1bHRzIiwib25GaWxlVXBsb2FkRXJyb3IiLCJkZWZhdWx0TGF5ZXJzIiwidmFsdWVzIiwiZGF0YUlkcyIsIm5ld0xheWVyRGF0YXMiLCJ1cGRhdGVMYXllckRvbWFpbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O1FBa0dnQkEsaUIsR0FBQUEsaUI7UUFxQkFDLGUsR0FBQUEsZTtRQTBDQUMsOEIsR0FBQUEsOEI7UUFlQUMsb0IsR0FBQUEsb0I7UUF1QkFDLHVCLEdBQUFBLHVCO1FBdUJBQyxZLEdBQUFBLFk7UUF1b0JBQyxnQixHQUFBQSxnQjtRQXdCQUMsa0IsR0FBQUEsa0I7UUE0QkFDLHdCLEdBQUFBLHdCOztBQXo1QmhCOzs7O0FBQ0E7O0FBQ0E7O0FBR0E7O0FBR0E7O0FBR0E7O0FBQ0E7O0FBRUE7O0FBT0E7O0FBRUE7O0FBS0E7O0FBQ0E7O0FBRUE7O0FBT0E7O0lBQVlDLGM7O0FBQ1o7Ozs7OztBQWhDQTtBQWtDTyxJQUFNQyxnREFBb0I7QUFDL0I7QUFDQUMsVUFBUSxFQUZ1QjtBQUcvQkMsYUFBVyxFQUhvQjtBQUkvQkMsbUJBQWlCLEVBSmM7QUFLL0JDLGNBQVksRUFMbUI7O0FBTy9CO0FBQ0FDLFdBQVMsRUFSc0I7QUFTL0JDLG9CQUFrQixFQVRhOztBQVcvQjtBQUNBQyxZQUFVLEVBWnFCO0FBYS9CQyxrQkFBZ0JDLFNBYmU7O0FBZS9CQyxxQkFBbUIsOENBZlk7QUFnQi9CQyx5QkFBdUJGLFNBaEJROztBQWtCL0JHLGlCQUFlLFFBbEJnQjtBQW1CL0JDLGFBQVdKLFNBbkJvQjtBQW9CL0JLLFdBQVNMLFNBcEJzQjs7QUFzQi9CTSxlQUFhLEtBdEJrQjtBQXVCL0JDLGtCQUFnQixJQXZCZTs7QUF5Qi9CO0FBQ0FDLGFBQVc7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFaUztBQTFCb0IsQ0FBMUI7O0FBL0JQOzs7QUFOQTs7O0FBK0VBLFNBQVNDLDJCQUFULENBQXFDQyxLQUFyQyxRQUFxRTtBQUFBLE1BQXhCakIsU0FBd0IsUUFBeEJBLFNBQXdCO0FBQUEsTUFBYmtCLEtBQWEsUUFBYkEsS0FBYTtBQUFBLE1BQU5DLEdBQU0sUUFBTkEsR0FBTTs7QUFDbkUscUNBQ0tGLEtBREw7QUFFRWxCLFlBQVFrQixNQUFNbEIsTUFBTixDQUNMcUIsR0FESyxDQUNELFVBQUNDLEdBQUQsRUFBTUMsQ0FBTjtBQUFBLGFBQVlBLE1BQU1ILEdBQU4sR0FBWUQsS0FBWixHQUFvQkcsR0FBaEM7QUFBQSxLQURDLENBRlY7QUFJRXJCLGVBQVdBLFlBQVlpQixNQUFNakIsU0FBTixDQUNwQm9CLEdBRG9CLENBQ2hCLFVBQUNHLENBQUQsRUFBSUQsQ0FBSjtBQUFBLGFBQVVBLE1BQU1ILEdBQU4sR0FBWW5CLFNBQVosR0FBd0J1QixDQUFsQztBQUFBLEtBRGdCLENBQVosR0FFVE4sTUFBTWpCO0FBTlY7QUFRRDs7QUFFRDs7OztBQUlPLFNBQVNaLGlCQUFULENBQTJCNkIsS0FBM0IsRUFBa0NPLE1BQWxDLEVBQTBDO0FBQUEsTUFDeENDLFFBRHdDLEdBQzVCRCxNQUQ0QixDQUN4Q0MsUUFEd0M7O0FBRS9DLE1BQU1OLE1BQU1GLE1BQU1sQixNQUFOLENBQWEyQixTQUFiLENBQXVCO0FBQUEsV0FBS0MsRUFBRUMsRUFBRixLQUFTSCxTQUFTRyxFQUF2QjtBQUFBLEdBQXZCLENBQVo7QUFDQSxNQUFNQyxRQUFRQyxPQUFPQyxJQUFQLENBQVlQLE9BQU9RLFNBQW5CLENBQWQ7O0FBRUEsTUFBTUMsV0FBV1IsU0FBU3JDLGlCQUFULENBQTJCb0MsT0FBT1EsU0FBbEMsQ0FBakI7QUFDQSxNQUFJQyxTQUFTQyx3QkFBVCxDQUFrQ0wsS0FBbEMsQ0FBSixFQUE4QztBQUM1QyxRQUFNTSxlQUFlbEIsTUFBTWpCLFNBQU4sQ0FBZ0JtQixHQUFoQixDQUFyQjs7QUFENEMsOEJBRWpCLG9DQUFtQmMsUUFBbkIsRUFBNkJoQixLQUE3QixFQUFvQ2tCLFlBQXBDLEVBQWtELEVBQUNDLFVBQVUsSUFBWCxFQUFsRCxDQUZpQjtBQUFBLFFBRXJDcEMsU0FGcUMsdUJBRXJDQSxTQUZxQztBQUFBLFFBRTFCa0IsS0FGMEIsdUJBRTFCQSxLQUYwQjs7QUFHNUMsV0FBT0YsNEJBQTRCQyxLQUE1QixFQUFtQyxFQUFDakIsb0JBQUQsRUFBWWtCLFlBQVosRUFBbUJDLFFBQW5CLEVBQW5DLENBQVA7QUFDRDs7QUFFRCxNQUFNa0IsdUNBQ0RwQixLQURDO0FBRUpGLGVBQVcsZUFBZVMsT0FBT1EsU0FBdEIsR0FDVE0seUJBQXlCckIsS0FBekIsRUFBZ0NnQixRQUFoQyxDQURTLEdBQ21DaEIsTUFBTUY7QUFIaEQsSUFBTjs7QUFNQSxTQUFPQyw0QkFBNEJxQixRQUE1QixFQUFzQyxFQUFDbkIsT0FBT2UsUUFBUixFQUFrQmQsUUFBbEIsRUFBdEMsQ0FBUDtBQUNEOztBQUVNLFNBQVM5QixlQUFULENBQXlCNEIsS0FBekIsRUFBZ0NPLE1BQWhDLEVBQXdDO0FBQUEsTUFDdENDLFFBRHNDLEdBQ2pCRCxNQURpQixDQUN0Q0MsUUFEc0M7QUFBQSxNQUM1QmMsT0FENEIsR0FDakJmLE1BRGlCLENBQzVCZSxPQUQ0Qjs7QUFFN0MsTUFBTUMsUUFBUWYsU0FBU0csRUFBdkI7QUFDQSxNQUFNVCxNQUFNRixNQUFNbEIsTUFBTixDQUFhMkIsU0FBYixDQUF1QjtBQUFBLFdBQUtDLEVBQUVDLEVBQUYsS0FBU1ksS0FBZDtBQUFBLEdBQXZCLENBQVo7O0FBRUEsTUFBSSxDQUFDLCtCQUFjRCxPQUFkLENBQUQsSUFBMkIsQ0FBQzFDLGVBQWUsK0JBQWMwQyxPQUFkLENBQWYsQ0FBaEMsRUFBd0U7QUFDdEUsb0JBQVFFLEtBQVIsQ0FBaUJGLE9BQWpCO0FBQ0EsV0FBT3RCLEtBQVA7QUFDRDs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxNQUFNeUIsYUFBYTdDLGVBQWUsK0JBQWMwQyxPQUFkLENBQWYsQ0FBbkI7QUFDQSxNQUFNTixXQUFXLElBQUlTLFVBQUosRUFBakI7O0FBRUFULFdBQVNVLE1BQVQsR0FBa0JWLFNBQVNXLG1CQUFULENBQTZCWCxTQUFTVSxNQUF0QyxFQUE4Q2xCLFNBQVNrQixNQUF2RCxDQUFsQjs7QUFoQjZDLDZCQWtCbEIsb0NBQW1CVixRQUFuQixFQUE2QmhCLEtBQTdCLENBbEJrQjtBQUFBLE1Ba0J0Q2pCLFNBbEJzQyx3QkFrQnRDQSxTQWxCc0M7QUFBQSxNQWtCM0JrQixLQWxCMkIsd0JBa0IzQkEsS0FsQjJCOztBQW9CN0MsTUFBSW1CLFdBQVdwQixLQUFmOztBQUVBO0FBQ0EsTUFBSUEsTUFBTUYsU0FBVixFQUFxQjtBQUNuQnNCLDJDQUNLcEIsS0FETDtBQUVFRixpQkFBV0UsTUFBTUYsU0FBTixDQUFnQkssR0FBaEIsQ0FBb0Isb0JBQVk7QUFBQTs7QUFBQSwrQkFDTXlCLFNBQVM5QyxNQURmO0FBQUEsWUFDekIrQyxXQUR5QixvQkFDakNOLEtBRGlDO0FBQUEsWUFDVE8sV0FEUyw2REFDakNQLEtBRGlDOztBQUV6QywyQ0FDS0ssUUFETDtBQUVFOUMsOENBQ0tnRCxXQURMLDZCQUVHN0IsTUFBTVUsRUFGVCxJQUVja0IsV0FGZDtBQUZGO0FBT0QsT0FUVTtBQUZiO0FBYUQ7O0FBRUQsU0FBTzlCLDRCQUE0QnFCLFFBQTVCLEVBQXNDLEVBQUNyQyxvQkFBRCxFQUFZa0IsWUFBWixFQUFtQkMsUUFBbkIsRUFBdEMsQ0FBUDtBQUNEOztBQUVNLFNBQVM3Qiw4QkFBVCxDQUF3QzJCLEtBQXhDLEVBQStDTyxNQUEvQyxFQUF1RDtBQUFBLE1BQ3JEQyxRQURxRCxHQUNyQkQsTUFEcUIsQ0FDckRDLFFBRHFEO0FBQUEsTUFDM0NPLFNBRDJDLEdBQ3JCUixNQURxQixDQUMzQ1EsU0FEMkM7QUFBQSxNQUNoQ2dCLE9BRGdDLEdBQ3JCeEIsTUFEcUIsQ0FDaEN3QixPQURnQztBQUFBLDhCQUVwQy9CLE1BQU1aLFFBQU4sQ0FBZW9CLFNBQVNrQixNQUFULENBQWdCTSxNQUEvQixDQUZvQztBQUFBLE1BRXJEQyxJQUZxRCx5QkFFckRBLElBRnFEO0FBQUEsTUFFL0NDLE9BRitDLHlCQUUvQ0EsT0FGK0M7OztBQUk1RCxNQUFNaEMsTUFBTUYsTUFBTWxCLE1BQU4sQ0FBYTJCLFNBQWIsQ0FBdUI7QUFBQSxXQUFLQyxFQUFFQyxFQUFGLEtBQVNILFNBQVNHLEVBQXZCO0FBQUEsR0FBdkIsQ0FBWjtBQUNBLE1BQU1LLFdBQVdSLFNBQVNyQyxpQkFBVCxDQUEyQjRDLFNBQTNCLENBQWpCOztBQUVBQyxXQUFTbUIsd0JBQVQsQ0FBa0MsRUFBQ0YsVUFBRCxFQUFPQyxnQkFBUCxFQUFsQyxFQUFtREgsT0FBbkQ7O0FBRUEsTUFBTWIsZUFBZWxCLE1BQU1qQixTQUFOLENBQWdCbUIsR0FBaEIsQ0FBckI7O0FBVDRELDZCQVVqQyxvQ0FBbUJjLFFBQW5CLEVBQTZCaEIsS0FBN0IsRUFBb0NrQixZQUFwQyxFQUFrRCxFQUFDQyxVQUFVLElBQVgsRUFBbEQsQ0FWaUM7QUFBQSxNQVVyRHBDLFNBVnFELHdCQVVyREEsU0FWcUQ7QUFBQSxNQVUxQ2tCLEtBVjBDLHdCQVUxQ0EsS0FWMEM7O0FBWTVELFNBQU9GLDRCQUE0QkMsS0FBNUIsRUFBbUMsRUFBQ2pCLG9CQUFELEVBQVlrQixZQUFaLEVBQW1CQyxRQUFuQixFQUFuQyxDQUFQO0FBQ0Q7O0FBRU0sU0FBUzVCLG9CQUFULENBQThCMEIsS0FBOUIsRUFBcUNPLE1BQXJDLEVBQTZDO0FBQUEsTUFDM0NDLFFBRDJDLEdBQy9CRCxNQUQrQixDQUMzQ0MsUUFEMkM7O0FBRWxELE1BQU1OLE1BQU1GLE1BQU1sQixNQUFOLENBQWEyQixTQUFiLENBQXVCO0FBQUEsV0FBS0MsRUFBRUMsRUFBRixLQUFTSCxTQUFTRyxFQUF2QjtBQUFBLEdBQXZCLENBQVo7QUFDQSxNQUFNQyxRQUFRQyxPQUFPQyxJQUFQLENBQVlQLE9BQU82QixZQUFuQixDQUFkOztBQUVBLE1BQU1BLDJDQUNENUIsU0FBU2tCLE1BQVQsQ0FBZ0JXLFNBRGYsRUFFRDlCLE9BQU82QixZQUZOLENBQU47O0FBS0EsTUFBTXBCLFdBQVdSLFNBQVNyQyxpQkFBVCxDQUEyQixFQUFDa0UsV0FBV0QsWUFBWixFQUEzQixDQUFqQjs7QUFFQSxNQUFJcEIsU0FBU0Msd0JBQVQsQ0FBa0NMLEtBQWxDLENBQUosRUFBOEM7QUFDNUMsUUFBTU0sZUFBZWxCLE1BQU1qQixTQUFOLENBQWdCbUIsR0FBaEIsQ0FBckI7O0FBRDRDLCtCQUVqQixvQ0FBbUJjLFFBQW5CLEVBQTZCaEIsS0FBN0IsRUFBb0NrQixZQUFwQyxFQUFrRCxFQUFDQyxVQUFVLElBQVgsRUFBbEQsQ0FGaUI7QUFBQSxRQUVyQ3BDLFNBRnFDLHdCQUVyQ0EsU0FGcUM7QUFBQSxRQUUxQmtCLEtBRjBCLHdCQUUxQkEsS0FGMEI7O0FBRzVDLFdBQU9GLDRCQUE0QkMsS0FBNUIsRUFBbUMsRUFBQ2pCLG9CQUFELEVBQVlrQixZQUFaLEVBQW1CQyxRQUFuQixFQUFuQyxDQUFQO0FBQ0Q7O0FBRUQsU0FBT0gsNEJBQTRCQyxLQUE1QixFQUFtQyxFQUFDQyxPQUFPZSxRQUFSLEVBQWtCZCxRQUFsQixFQUFuQyxDQUFQO0FBQ0Q7O0FBRUQ7O0FBRU8sU0FBUzNCLHVCQUFULENBQWlDeUIsS0FBakMsRUFBd0NPLE1BQXhDLEVBQWdEO0FBQUE7O0FBQUEsTUFDOUNtQixNQUQ4QyxHQUNwQ25CLE1BRG9DLENBQzlDbUIsTUFEOEM7OztBQUdyRCxNQUFNbkMsZ0RBQ0RTLE1BQU1ULGlCQURMLDZCQUVDbUMsT0FBT2YsRUFGUixJQUVhZSxNQUZiLGFBQU47O0FBS0EsTUFBSUEsT0FBT1ksT0FBUCxJQUFrQixDQUFDdEMsTUFBTVQsaUJBQU4sQ0FBd0JtQyxPQUFPZixFQUEvQixFQUFtQzJCLE9BQTFELEVBQW1FO0FBQ2pFO0FBQ0F6QixXQUFPQyxJQUFQLENBQVl2QixpQkFBWixFQUErQmdELE9BQS9CLENBQXVDLGFBQUs7QUFDMUMsVUFBSUMsTUFBTWQsT0FBT2YsRUFBakIsRUFBcUI7QUFDbkJwQiwwQkFBa0JpRCxDQUFsQixnQ0FBMkJqRCxrQkFBa0JpRCxDQUFsQixDQUEzQixJQUFpREYsU0FBUyxLQUExRDtBQUNEO0FBQ0YsS0FKRDtBQUtEOztBQUVELHFDQUNLdEMsS0FETDtBQUVFVDtBQUZGO0FBSUQ7O0FBRU0sU0FBU2YsWUFBVCxDQUFzQndCLEtBQXRCLEVBQTZCTyxNQUE3QixFQUFxQztBQUFBOztBQUFBLE1BQ25DTCxHQURtQyxHQUNmSyxNQURlLENBQ25DTCxHQURtQztBQUFBLE1BQzlCdUMsSUFEOEIsR0FDZmxDLE1BRGUsQ0FDOUJrQyxJQUQ4QjtBQUFBLE1BQ3hCQyxLQUR3QixHQUNmbkMsTUFEZSxDQUN4Qm1DLEtBRHdCOztBQUUxQyxNQUFJdEIsV0FBV3BCLEtBQWY7QUFDQSxNQUFJMkMsd0NBQ0MzQyxNQUFNZCxPQUFOLENBQWNnQixHQUFkLENBREQsNkJBRUR1QyxJQUZDLElBRU1DLEtBRk4sYUFBSjs7QUFIMEMsbUJBUXpCQyxTQVJ5QjtBQUFBLE1BUW5DWCxNQVJtQyxjQVFuQ0EsTUFSbUM7O0FBUzFDLE1BQUksQ0FBQ0EsTUFBTCxFQUFhO0FBQ1gsV0FBT2hDLEtBQVA7QUFDRDtBQVh5Qyw4QkFZaEJBLE1BQU1aLFFBQU4sQ0FBZTRDLE1BQWYsQ0FaZ0I7QUFBQSxNQVluQ1ksTUFabUMseUJBWW5DQSxNQVptQztBQUFBLE1BWTNCVixPQVoyQix5QkFZM0JBLE9BWjJCOzs7QUFjMUMsVUFBUU8sSUFBUjtBQUNBLFNBQUssUUFBTDtBQUNFO0FBQ0FFLGtCQUFZLG1DQUFpQlgsTUFBakIsQ0FBWjtBQUNBOztBQUVGLFNBQUssTUFBTDs7QUFFRTtBQUNBLFVBQU1hLFdBQVdELE9BQU9uQyxTQUFQLENBQWlCO0FBQUEsZUFBTXFDLEVBQUVDLElBQUYsS0FBV0wsS0FBakI7QUFBQSxPQUFqQixDQUFqQjtBQUNBLFVBQUlNLFFBQVFKLE9BQU9DLFFBQVAsQ0FBWjs7QUFFQSxVQUFJLENBQUNHLE1BQU1DLFVBQVgsRUFBdUI7O0FBRXJCO0FBQ0E7QUFDQUQsNENBQ0tBLEtBREw7QUFFRUMsc0JBQVksaUNBQWVmLE9BQWYsRUFBd0JjLEtBQXhCO0FBRmQ7QUFJRDs7QUFFREwsOENBQ0tBLFNBREwsRUFFS0ssTUFBTUMsVUFGWDtBQUdFRixjQUFNQyxNQUFNRCxJQUhkO0FBSUU7QUFDQUcsZ0JBQVEsSUFMVjtBQU1FTDtBQU5GOztBQVNBekIsNkNBQ0twQixLQURMO0FBRUVaLDhDQUNLWSxNQUFNWixRQURYLDZCQUVHNEMsTUFGSCxnQ0FHT2hDLE1BQU1aLFFBQU4sQ0FBZTRDLE1BQWYsQ0FIUDtBQUlJWSxrQkFBUUEsT0FBT3pDLEdBQVAsQ0FBVyxVQUFDRyxDQUFELEVBQUlELENBQUo7QUFBQSxtQkFBVUEsTUFBTXdDLFFBQU4sR0FBaUJHLEtBQWpCLEdBQXlCMUMsQ0FBbkM7QUFBQSxXQUFYO0FBSlo7QUFGRjtBQVVBO0FBQ0YsU0FBSyxPQUFMO0FBQ0E7QUFDRTtBQTVDRjs7QUErQ0E7QUFDQWMseUNBQ0tBLFFBREw7QUFFRWxDLGFBQVNjLE1BQU1kLE9BQU4sQ0FBY2lCLEdBQWQsQ0FBa0IsVUFBQzJDLENBQUQsRUFBSXpDLENBQUo7QUFBQSxhQUFVQSxNQUFNSCxHQUFOLEdBQVl5QyxTQUFaLEdBQXdCRyxDQUFsQztBQUFBLEtBQWxCO0FBRlg7O0FBS0E7QUFDQTFCLHlDQUNLQSxRQURMO0FBRUVoQywwQ0FDS2dDLFNBQVNoQyxRQURkLDZCQUVHNEMsTUFGSCxnQ0FHT1osU0FBU2hDLFFBQVQsQ0FBa0I0QyxNQUFsQixDQUhQLEVBSU8sNkJBQVdFLE9BQVgsRUFBb0JGLE1BQXBCLEVBQTRCWixTQUFTbEMsT0FBckMsQ0FKUDtBQUZGOztBQVdBa0MsYUFBV3pDLHlCQUF5QnlDLFFBQXpCLEVBQW1DWSxNQUFuQyxDQUFYOztBQUVBLFNBQU9aLFFBQVA7QUFDRDs7QUFFTSxJQUFNK0IsOENBQW1CLFNBQW5CQSxnQkFBbUIsQ0FBQ25ELEtBQUQsU0FBMkI7QUFBQSxNQUFsQkUsR0FBa0IsU0FBbEJBLEdBQWtCO0FBQUEsTUFBYmtELE9BQWEsU0FBYkEsT0FBYTs7QUFDekQsTUFBSVQsd0NBQWdCM0MsTUFBTWQsT0FBTixDQUFjZ0IsR0FBZCxDQUFoQixFQUF1Q2tELE9BQXZDLENBQUo7QUFDQSxNQUFNWCxPQUFPNUIsT0FBT0MsSUFBUCxDQUFZc0MsT0FBWixFQUFxQixDQUFyQixDQUFiO0FBQ0EsTUFBSVgsU0FBUyxPQUFiLEVBQXNCO0FBQ3BCLFFBQU1ZLFdBQVcsMkNBQXlCVixTQUF6QixDQUFqQjs7QUFFQSxRQUFJVSxRQUFKLEVBQWM7QUFDWlYsOENBQ0tBLFNBREwsRUFFSyw0REFBa0JBLFNBQWxCLElBQTZCVSxrQkFBN0IsS0FBd0NyRCxNQUFNWixRQUFOLENBQWV1RCxVQUFVWCxNQUF6QixFQUFpQ0UsT0FBekUsQ0FGTDtBQUdFbUI7QUFIRjtBQUtEO0FBQ0Y7O0FBRUQscUNBQ0tyRCxLQURMO0FBRUVkLGFBQVNjLE1BQU1kLE9BQU4sQ0FBY2lCLEdBQWQsQ0FBa0IsVUFBQzJDLENBQUQsRUFBSXpDLENBQUo7QUFBQSxhQUFVQSxNQUFNSCxHQUFOLEdBQVl5QyxTQUFaLEdBQXdCRyxDQUFsQztBQUFBLEtBQWxCO0FBRlg7QUFJRCxDQW5CTTs7QUFxQkEsSUFBTVEsZ0NBQVksU0FBWkEsU0FBWSxDQUFDdEQsS0FBRCxFQUFRTyxNQUFSO0FBQUEsU0FBb0IsQ0FBQ0EsT0FBT3lCLE1BQVIsR0FBaUJoQyxLQUFqQiwrQkFDeENBLEtBRHdDO0FBRTNDZCx1QkFBYWMsTUFBTWQsT0FBbkIsR0FBNEIsbUNBQWlCcUIsT0FBT3lCLE1BQXhCLENBQTVCO0FBRjJDLElBQXBCO0FBQUEsQ0FBbEI7O0FBS0EsSUFBTXVCLDREQUEwQixTQUExQkEsdUJBQTBCLENBQUN2RCxLQUFELEVBQVFPLE1BQVI7QUFBQSxxQ0FDbENQLEtBRGtDO0FBRXJDZCxhQUFTYyxNQUFNZCxPQUFOLENBQ05pQixHQURNLENBQ0YsVUFBQzJDLENBQUQsRUFBSXpDLENBQUo7QUFBQSxhQUFVQSxNQUFNRSxPQUFPTCxHQUFiLCtCQUNUNEMsQ0FEUyxJQUNOVSxhQUFhLENBQUNWLEVBQUVVLFdBRFYsTUFDeUJWLENBRG5DO0FBQUEsS0FERTtBQUY0QjtBQUFBLENBQWhDOztBQU9BLElBQU1XLHdDQUFnQixTQUFoQkEsYUFBZ0IsQ0FBQ3pELEtBQUQsRUFBUU8sTUFBUixFQUFtQjtBQUM5QyxNQUFNbUQsYUFBYTFELE1BQU1kLE9BQU4sQ0FBY3FCLE9BQU9MLEdBQXJCLEVBQTBCeUQsUUFBN0M7O0FBRUEscUNBQ0szRCxLQURMO0FBRUVkLGFBQVNjLE1BQU1kLE9BQU4sQ0FBY2lCLEdBQWQsQ0FBa0IsVUFBQzJDLENBQUQsRUFBSXpDLENBQUosRUFBVTtBQUNuQ3lDLFFBQUVhLFFBQUYsR0FBYSxDQUFDRCxVQUFELElBQWVyRCxNQUFNRSxPQUFPTCxHQUF6QztBQUNBLGFBQU80QyxDQUFQO0FBQ0QsS0FIUTtBQUZYO0FBT0QsQ0FWTTs7QUFZQSxJQUFNYyxzQ0FBZSxTQUFmQSxZQUFlLENBQUM1RCxLQUFELEVBQVFPLE1BQVIsRUFBbUI7QUFBQTs7QUFBQSxNQUN0Q0wsR0FEc0MsR0FDL0JLLE1BRCtCLENBQ3RDTCxHQURzQztBQUFBLE1BRXRDOEIsTUFGc0MsR0FFNUJoQyxNQUFNZCxPQUFOLENBQWNnQixHQUFkLENBRjRCLENBRXRDOEIsTUFGc0M7OztBQUk3QyxNQUFNNkIsdUJBQ0Q3RCxNQUFNZCxPQUFOLENBQWM0RSxLQUFkLENBQW9CLENBQXBCLEVBQXVCNUQsR0FBdkIsQ0FEQyxFQUVERixNQUFNZCxPQUFOLENBQWM0RSxLQUFkLENBQW9CNUQsTUFBTSxDQUExQixFQUE2QkYsTUFBTWQsT0FBTixDQUFjNkUsTUFBM0MsQ0FGQyxDQUFOOztBQUlBLE1BQU0zQyx1Q0FDRHBCLEtBREM7QUFFSlosMENBQ0tZLE1BQU1aLFFBRFgsNkJBRUc0QyxNQUZILGdDQUdPaEMsTUFBTVosUUFBTixDQUFlNEMsTUFBZixDQUhQLEVBSU8sNkJBQVdoQyxNQUFNWixRQUFOLENBQWU0QyxNQUFmLEVBQXVCRSxPQUFsQyxFQUEyQ0YsTUFBM0MsRUFBbUQ2QixVQUFuRCxDQUpQLGNBRkk7QUFTSjNFLGFBQVMyRTtBQVRMLElBQU47O0FBWUEsU0FBT2xGLHlCQUF5QnlDLFFBQXpCLEVBQW1DWSxNQUFuQyxDQUFQO0FBQ0QsQ0FyQk07O0FBdUJBLElBQU1nQyw4QkFBVyxTQUFYQSxRQUFXLENBQUNoRSxLQUFELEVBQVFPLE1BQVIsRUFBbUI7QUFDekMsTUFBTTBELGlCQUFpQnBELE9BQU9DLElBQVAsQ0FBWWQsTUFBTVosUUFBbEIsRUFBNEIsQ0FBNUIsQ0FBdkI7O0FBRUEsTUFBTTRCLFdBQVcsSUFBSXBDLGVBQWVzRixLQUFuQixDQUF5QjtBQUN4Q0MsZUFBVyxJQUQ2QjtBQUV4Q0Msb0JBQWdCLElBRndCO0FBR3hDcEMsWUFBUWlDO0FBSGdDLEdBQXpCLENBQWpCOztBQU1BLHFDQUNLakUsS0FETDtBQUVFbEIsc0JBQVlrQixNQUFNbEIsTUFBbEIsR0FBMEJrQyxRQUExQixFQUZGO0FBR0VqQyx5QkFBZWlCLE1BQU1qQixTQUFyQixHQUFnQyxFQUFoQyxFQUhGO0FBSUVFLDBCQUFnQmUsTUFBTWYsVUFBdEIsR0FBa0NlLE1BQU1mLFVBQU4sQ0FBaUI4RSxNQUFuRCxFQUpGO0FBS0VqRSxlQUFXdUUsdUJBQXVCckUsTUFBTUYsU0FBN0IsRUFBd0NrQixRQUF4QztBQUxiO0FBT0QsQ0FoQk07O0FBa0JBLElBQU1zRCxvQ0FBYyxTQUFkQSxXQUFjLENBQUN0RSxLQUFELFNBQWtCO0FBQUEsTUFBVEUsR0FBUyxTQUFUQSxHQUFTO0FBQUEsTUFDcENwQixNQURvQyxHQUNLa0IsS0FETCxDQUNwQ2xCLE1BRG9DO0FBQUEsTUFDNUJDLFNBRDRCLEdBQ0tpQixLQURMLENBQzVCakIsU0FENEI7QUFBQSxNQUNqQlksT0FEaUIsR0FDS0ssS0FETCxDQUNqQkwsT0FEaUI7QUFBQSxNQUNSRCxTQURRLEdBQ0tNLEtBREwsQ0FDUk4sU0FEUTs7QUFFM0MsTUFBTTZFLGdCQUFnQnZFLE1BQU1sQixNQUFOLENBQWFvQixHQUFiLENBQXRCO0FBQ0EsTUFBTXNFLFVBQVVDLHlCQUF5QnpFLEtBQXpCLEVBQWdDdUUsYUFBaEMsQ0FBaEI7O0FBRUEscUNBQ0t2RSxLQURMO0FBRUVsQixzQkFBWUEsT0FBT2dGLEtBQVAsQ0FBYSxDQUFiLEVBQWdCNUQsR0FBaEIsQ0FBWixFQUFxQ3BCLE9BQU9nRixLQUFQLENBQWE1RCxNQUFNLENBQW5CLEVBQXNCcEIsT0FBT2lGLE1BQTdCLENBQXJDLENBRkY7QUFHRWhGLHlCQUFlQSxVQUFVK0UsS0FBVixDQUFnQixDQUFoQixFQUFtQjVELEdBQW5CLENBQWYsRUFBMkNuQixVQUFVK0UsS0FBVixDQUFnQjVELE1BQU0sQ0FBdEIsRUFBeUJuQixVQUFVZ0YsTUFBbkMsQ0FBM0MsQ0FIRjtBQUlFOUUsZ0JBQVllLE1BQU1mLFVBQU4sQ0FBaUJ5RixNQUFqQixDQUF3QjtBQUFBLGFBQUtyRSxNQUFNSCxHQUFYO0FBQUEsS0FBeEIsRUFBd0NDLEdBQXhDLENBQTRDO0FBQUEsYUFBT3dFLE1BQU16RSxHQUFOLEdBQVl5RSxNQUFNLENBQWxCLEdBQXNCQSxHQUE3QjtBQUFBLEtBQTVDLENBSmQ7QUFLRWhGLGFBQVM0RSxjQUFjSyxjQUFkLENBQTZCakYsT0FBN0IsSUFBd0NMLFNBQXhDLEdBQW9ESyxPQUwvRDtBQU1FRCxlQUFXNkUsY0FBY0ssY0FBZCxDQUE2QmxGLFNBQTdCLElBQTBDSixTQUExQyxHQUFzREksU0FObkU7QUFPRUksZUFBVzBFO0FBUGI7QUFTRCxDQWRNOztBQWdCQSxJQUFNSyxzQ0FBZSxTQUFmQSxZQUFlLENBQUM3RSxLQUFEO0FBQUEsTUFBUzhFLEtBQVQsU0FBU0EsS0FBVDtBQUFBLHFDQUN2QjlFLEtBRHVCO0FBRTFCZixnQkFBWTZGO0FBRmM7QUFBQSxDQUFyQjs7QUFLQSxJQUFNQyxnQkFBZ0IsU0FBaEJBLGFBQWdCLENBQUMvRSxLQUFELEVBQVFPLE1BQVIsRUFBbUI7QUFDOUM7QUFEOEMsTUFFbEN5RSxVQUZrQyxHQUVwQnpFLE1BRm9CLENBRXZDMEUsR0FGdUM7QUFBQSxNQUd2QzdGLFFBSHVDLEdBRzNCWSxLQUgyQixDQUd2Q1osUUFIdUM7O0FBSzlDOztBQUNBLE1BQUksQ0FBQ0EsU0FBUzRGLFVBQVQsQ0FBTCxFQUEyQjtBQUN6QixXQUFPaEYsS0FBUDtBQUNEOztBQUVEO0FBVjhDLE1BV3ZDbEIsTUFYdUMsR0FXc0JrQixLQVh0QixDQVd2Q2xCLE1BWHVDO0FBQUEsd0JBV3NCa0IsS0FYdEIsQ0FXL0JaLFFBWCtCO0FBQUEsTUFXTjhGLE9BWE0sbUJBV25CRixVQVhtQjtBQUFBLE1BV01HLFdBWE4sNERBV25CSCxVQVhtQjtBQVk5Qzs7QUFFQSxNQUFNSSxVQUFVdEcsT0FBT3VHLE1BQVAsQ0FBYyxVQUFDQyxhQUFELEVBQWdCckYsS0FBaEIsRUFBdUJzRixLQUF2QixFQUFpQztBQUM3RCxRQUFJdEYsTUFBTXlCLE1BQU4sQ0FBYU0sTUFBYixLQUF3QmdELFVBQTVCLEVBQXdDO0FBQ3RDTSxvQkFBY0UsSUFBZCxDQUFtQkQsS0FBbkI7QUFDRDtBQUNELFdBQU9ELGFBQVA7QUFDRCxHQUxlLEVBS2IsRUFMYSxDQUFoQjs7QUFPQTs7QUFyQjhDLHdCQXNCM0JGLFFBQVFDLE1BQVIsQ0FBZSxpQkFBeUNuRixHQUF6QyxFQUFpRDtBQUFBLFFBQXJDdUYsWUFBcUMsU0FBL0NyRSxRQUErQztBQUFBLFFBQXZCc0UsWUFBdUIsU0FBdkJBLFlBQXVCOztBQUNqRixRQUFNQyxlQUFlekYsTUFBTXdGLFlBQTNCO0FBQ0FELG1CQUFlbkIsWUFBWW1CLFlBQVosRUFBMEIsRUFBQ3ZGLEtBQUt5RixZQUFOLEVBQTFCLENBQWY7QUFDQUQ7QUFDQSxXQUFPLEVBQUN0RSxVQUFVcUUsWUFBWCxFQUF5QkMsMEJBQXpCLEVBQVA7QUFDRCxHQUxrQixFQUtoQixFQUFDdEUsc0NBQWNwQixLQUFkLElBQXFCWixVQUFVK0YsV0FBL0IsR0FBRCxFQUE4Q08sY0FBYyxDQUE1RCxFQUxnQixDQXRCMkI7QUFBQSxNQXNCdkN0RSxRQXRCdUMsbUJBc0J2Q0EsUUF0QnVDOztBQTZCOUM7OztBQUNBLE1BQU1sQyxVQUFVYyxNQUFNZCxPQUFOLENBQWN3RixNQUFkLENBQXFCO0FBQUEsV0FBVUEsT0FBTzFDLE1BQVAsS0FBa0JnRCxVQUE1QjtBQUFBLEdBQXJCLENBQWhCOztBQUVBO0FBaEM4QyxNQWlDekN6RixpQkFqQ3lDLEdBaUNwQlMsS0FqQ29CLENBaUN6Q1QsaUJBakN5QztBQUFBLDJCQWtDNUJBLGlCQWxDNEI7QUFBQSxNQWtDdkNxRyxPQWxDdUMsc0JBa0N2Q0EsT0FsQ3VDOztBQW1DOUMsTUFBSUEsT0FBSixFQUFhO0FBQUEsUUFDSmxFLE1BREksR0FDTWtFLE9BRE4sQ0FDSmxFLE1BREk7QUFFWDs7QUFGVywrQkFHcUNBLE9BQU9tRSxZQUg1QztBQUFBLFFBR1VqRCxNQUhWLHdCQUdIb0MsVUFIRztBQUFBLFFBR3FCYSxZQUhyQixpRUFHSGIsVUFIRztBQUlYOztBQUNBekYsb0RBQXdCQSxpQkFBeEIsSUFBMkNxRyxxQ0FBYUEsT0FBYixJQUFzQmxFLG9DQUFZQSxNQUFaLElBQW9CbUUsMEJBQXBCLEdBQXRCLEdBQTNDO0FBQ0Q7O0FBRUQscUNBQVd6RSxRQUFYLElBQXFCbEMsZ0JBQXJCLEVBQThCSyxvQ0FBOUI7QUFDRCxDQTVDTTs7O0FBOENBLElBQU11RyxvREFBc0IsU0FBdEJBLG1CQUFzQixDQUFDOUYsS0FBRCxFQUFRTyxNQUFSO0FBQUEscUNBQzlCUCxLQUQ4QjtBQUVqQ1AsbUJBQWVjLE9BQU93RjtBQUZXO0FBQUEsQ0FBNUI7O0FBS0EsSUFBTUMsOENBQW1CLFNBQW5CQSxnQkFBbUIsQ0FBQ2hHLEtBQUQsRUFBUU8sTUFBUixFQUFtQjtBQUNqRCxxQ0FDS1AsS0FETDtBQUVFWCxvQkFBZ0JrQixPQUFPeUI7QUFGekI7QUFJRCxDQUxNOztBQU9QO0FBQ08sSUFBTWlFLDBDQUFpQixTQUFqQkEsY0FBaUIsQ0FBQ2pHLEtBQUQsRUFBUU8sTUFBUixFQUFtQjtBQUMvQztBQUNBLE1BQU1uQixXQUFXOEcsTUFBTUMsT0FBTixDQUFjNUYsT0FBT25CLFFBQXJCLElBQWlDbUIsT0FBT25CLFFBQXhDLEdBQW1ELENBQUNtQixPQUFPbkIsUUFBUixDQUFwRTtBQUYrQyx3QkFHVG1CLE1BSFMsQ0FHeEM2RixPQUh3QztBQUFBLE1BR3hDQSxPQUh3QyxtQ0FHOUIsRUFBQ0MsV0FBVyxJQUFaLEVBSDhCOzs7QUFLL0MsTUFBTUMsaUJBQWlCbEgsU0FBU2lHLE1BQVQsQ0FBZ0IsVUFBQ2tCLElBQUQ7QUFBQSwyQkFBUUMsSUFBUjtBQUFBLFFBQVFBLElBQVIsOEJBQWUsRUFBZjtBQUFBLFFBQW1CdkUsSUFBbkIsU0FBbUJBLElBQW5CO0FBQUEsdUNBQ2xDc0UsSUFEa0MsRUFFakMsc0NBQW1CLEVBQUNDLFVBQUQsRUFBT3ZFLFVBQVAsRUFBbkIsRUFBaUNqQyxNQUFNWixRQUF2QyxLQUFvRCxFQUZuQjtBQUFBLEdBQWhCLEVBR25CLEVBSG1CLENBQXZCOztBQUtBLE1BQUksQ0FBQ3lCLE9BQU9DLElBQVAsQ0FBWXdGLGNBQVosRUFBNEJ2QyxNQUFqQyxFQUF5QztBQUN2QyxXQUFPL0QsS0FBUDtBQUNEOztBQUVELE1BQU15RywrQ0FDRHpHLEtBREM7QUFFSlosMENBQ0tZLE1BQU1aLFFBRFgsRUFFS2tILGNBRkw7QUFGSSxJQUFOOztBQVFBO0FBdEIrQyw4QkEyQjNDRyxnQkEzQjJDLENBd0I3Q3RILGdCQXhCNkM7QUFBQSxNQXdCN0NBLGdCQXhCNkMseUNBd0IxQixFQXhCMEI7QUFBQSw4QkEyQjNDc0gsZ0JBM0IyQyxDQXlCN0N6SCxlQXpCNkM7QUFBQSxNQXlCN0NBLGVBekI2Qyx5Q0F5QjNCLEVBekIyQjtBQUFBLDhCQTJCM0N5SCxnQkEzQjJDLENBMEI3Q2pILHFCQTFCNkM7QUFBQSxNQTBCN0NBLHFCQTFCNkMseUNBMEJyQixFQTFCcUI7O0FBNkIvQzs7QUFDQSxNQUFNa0gsWUFBWTFHLE1BQU1sQixNQUFOLENBQWFxQixHQUFiLENBQWlCO0FBQUEsV0FBS08sRUFBRUMsRUFBUDtBQUFBLEdBQWpCLENBQWxCOztBQUVBO0FBQ0EsTUFBSWdHLGNBQWMsa0NBQWFGLGdCQUFiLEVBQStCdEgsZ0JBQS9CLENBQWxCO0FBQ0E7QUFDQXdILGdCQUFjLGlDQUFZQSxXQUFaLEVBQXlCM0gsZUFBekIsQ0FBZDs7QUFFQSxNQUFJMkgsWUFBWTdILE1BQVosQ0FBbUJpRixNQUFuQixLQUE4Qi9ELE1BQU1sQixNQUFOLENBQWFpRixNQUEvQyxFQUF1RDtBQUNyRDtBQUNBNEMsa0JBQWNsSSxpQkFBaUJrSSxXQUFqQixFQUE4QkwsY0FBOUIsQ0FBZDtBQUNEOztBQUVELE1BQUlLLFlBQVk3RyxTQUFaLENBQXNCaUUsTUFBMUIsRUFBa0M7QUFDaEMsUUFBTTZDLFlBQVlELFlBQVk3SCxNQUFaLENBQW1CNEYsTUFBbkIsQ0FBMEI7QUFBQSxhQUFLaEUsRUFBRWdCLE1BQUYsQ0FBU00sTUFBVCxJQUFtQnNFLGNBQXhCO0FBQUEsS0FBMUIsQ0FBbEI7QUFDQTtBQUNBSyw4Q0FDS0EsV0FETDtBQUVFN0csaUJBQVd1RSx1QkFBdUJzQyxZQUFZN0csU0FBbkMsRUFBOEM4RyxTQUE5QztBQUZiO0FBSUQ7O0FBRUQ7QUFDQUQsZ0JBQWMsdUNBQWtCQSxXQUFsQixFQUErQm5ILHFCQUEvQixDQUFkOztBQUVBO0FBQ0FxQixTQUFPQyxJQUFQLENBQVl3RixjQUFaLEVBQTRCL0QsT0FBNUIsQ0FBb0Msa0JBQVU7QUFDNUMsUUFBTXNFLGdCQUFnQkYsWUFBWXBILGlCQUFaLENBQThCcUcsT0FBOUIsQ0FBc0NsRSxNQUF0QyxDQUE2Q21FLFlBQTdDLENBQTBEN0QsTUFBMUQsQ0FBdEI7QUFDQSxRQUFJLENBQUNrRSxNQUFNQyxPQUFOLENBQWNVLGFBQWQsQ0FBRCxJQUFpQyxDQUFDQSxjQUFjOUMsTUFBcEQsRUFBNEQ7QUFDMUQ0QyxvQkFBY2pJLG1CQUFtQmlJLFdBQW5CLEVBQWdDTCxlQUFldEUsTUFBZixDQUFoQyxDQUFkO0FBQ0Q7QUFDRixHQUxEOztBQU9BLE1BQU04RSxXQUFXbkkseUJBQXlCZ0ksV0FBekIsRUFBc0M5RixPQUFPQyxJQUFQLENBQVl3RixjQUFaLENBQXRDLENBQWpCOztBQUVBLE1BQUlTLGVBQUo7QUFDQSxNQUFJWCxRQUFRQyxTQUFaLEVBQXVCO0FBQ3JCO0FBQ0EsUUFBTU8sYUFBWUUsU0FBU2hJLE1BQVQsQ0FDZjRGLE1BRGUsQ0FDUjtBQUFBLGFBQUssQ0FBQ2dDLFVBQVVNLFFBQVYsQ0FBbUJ0RyxFQUFFQyxFQUFyQixDQUFOO0FBQUEsS0FEUSxDQUFsQjtBQUVBb0csYUFBUyw4QkFBY0gsVUFBZCxDQUFUO0FBQ0Q7O0FBRUQ7QUFDQSxTQUFPLEVBQUNFLGtCQUFELEVBQVdDLGNBQVgsRUFBUDtBQUNELENBMUVNO0FBMkVQOztBQUVPLElBQU1FLGdEQUFvQixTQUFwQkEsaUJBQW9CO0FBQUEsU0FBTSxzQkFBVXBJLGlCQUFWLENBQU47QUFBQSxDQUExQjs7QUFFQSxJQUFNcUksMERBQXlCLFNBQXpCQSxzQkFBeUIsQ0FBQ2xILEtBQUQsRUFBUU8sTUFBUixFQUFtQjtBQUN2RCxNQUFJLENBQUNBLE9BQU80RyxPQUFQLENBQWVMLFFBQXBCLEVBQThCO0FBQzVCLFdBQU85RyxLQUFQO0FBQ0Q7O0FBSHNELDhCQVduRE8sT0FBTzRHLE9BQVAsQ0FBZUwsUUFYb0M7QUFBQSxNQU1yRDVILE9BTnFELHlCQU1yREEsT0FOcUQ7QUFBQSxNQU9yREosTUFQcUQseUJBT3JEQSxNQVBxRDtBQUFBLE1BUXJEUyxpQkFScUQseUJBUXJEQSxpQkFScUQ7QUFBQSxNQVNyREUsYUFUcUQseUJBU3JEQSxhQVRxRDtBQUFBLE1BVXJESyxTQVZxRCx5QkFVckRBLFNBVnFEOztBQWF2RDs7QUFDQSxNQUFNc0gsYUFBYUgsbUJBQW5CO0FBQ0EsTUFBSU4sMENBQ0NTLFVBREQ7QUFFRnRILGVBQVdBLGFBQWEsRUFGdEIsQ0FFeUI7QUFGekIsSUFBSjs7QUFLQTZHLGdCQUFjLGtDQUFhQSxXQUFiLEVBQTBCekgsT0FBMUIsQ0FBZDtBQUNBeUgsZ0JBQWMsaUNBQVlBLFdBQVosRUFBeUI3SCxNQUF6QixDQUFkO0FBQ0E2SCxnQkFBYyx1Q0FBa0JBLFdBQWxCLEVBQStCcEgsaUJBQS9CLENBQWQ7QUFDQW9ILGdCQUFjLHdDQUFtQkEsV0FBbkIsRUFBZ0NsSCxhQUFoQyxDQUFkOztBQUVBLFNBQU9rSCxXQUFQO0FBQ0QsQ0ExQk07O0FBNEJBLElBQU1VLDhDQUFtQixTQUFuQkEsZ0JBQW1CLENBQUNySCxLQUFELEVBQVFPLE1BQVI7QUFBQSxxQ0FDM0JQLEtBRDJCO0FBRTlCTixlQUFXYSxPQUFPaUc7QUFGWTtBQUFBLENBQXpCOztBQUtBLElBQU1jLDhDQUFtQixTQUFuQkEsZ0JBQW1CLENBQUN0SCxLQUFELEVBQVFPLE1BQVI7QUFBQSxxQ0FDM0JQLEtBRDJCO0FBRTlCTCxhQUFTWSxPQUFPaUcsSUFBUCxJQUFlakcsT0FBT2lHLElBQVAsQ0FBWWUsTUFBM0IsR0FBb0NoSCxPQUFPaUcsSUFBM0MsR0FBa0Q7QUFGN0I7QUFBQSxDQUF6Qjs7QUFLQSxJQUFNZ0IsMENBQWlCLFNBQWpCQSxjQUFpQixDQUFDeEgsS0FBRCxFQUFRTyxNQUFSO0FBQUEscUNBQ3pCUCxLQUR5QjtBQUU1QkwsYUFBUztBQUZtQjtBQUFBLENBQXZCOztBQUtBLElBQU04SCxnREFBb0IsU0FBcEJBLGlCQUFvQixDQUFDekgsS0FBRCxFQUFRTyxNQUFSO0FBQUEsU0FBb0JQLE1BQU1GLFNBQU4sSUFBbUJFLE1BQU1GLFNBQU4sQ0FBZ0JpRSxNQUFoQixLQUEyQixDQUE5QywrQkFDaEQvRCxLQURnRDtBQUVuRDtBQUNBO0FBQ0FGLGVBQVc0SCxzQkFBc0IxSCxNQUFNbEIsTUFBNUI7QUFKd0MsT0FLakQ2SSx3QkFBd0IzSCxLQUF4QixFQUErQk8sTUFBL0IsQ0FMNkI7QUFBQSxDQUExQjs7QUFPUDs7Ozs7OztBQU9PLElBQU1xSCwwREFBeUIsU0FBekJBLHNCQUF5QixDQUFDNUgsS0FBRCxFQUFRTyxNQUFSLEVBQW1CO0FBQUEsTUFDaERzSCxRQURnRCxHQUMxQnRILE1BRDBCLENBQ2hEc0gsUUFEZ0Q7QUFBQSxNQUN0Q0MsUUFEc0MsR0FDMUJ2SCxNQUQwQixDQUN0Q3VILFFBRHNDOztBQUV2RCxNQUFJLENBQUNBLFFBQUwsRUFBZTtBQUNiLFdBQU85SCxLQUFQO0FBQ0Q7O0FBSnNELHlCQU05QkEsS0FOOEIsQ0FNaERGLFNBTmdEO0FBQUEsTUFNaERBLFNBTmdELG9DQU1wQyxFQU5vQzs7O0FBUXZELE1BQUlBLFVBQVVpRSxNQUFWLEtBQXFCLENBQXpCLEVBQTRCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBTy9ELEtBQVA7QUFDRDs7QUFFRDtBQWhCdUQsNEJBaUJ4QkYsU0FqQndCLENBaUIvQytILFFBakIrQztBQUFBLE1BaUJwQzFILEdBakJvQyx1Q0FpQjlCLEVBakI4Qjs7O0FBbUJ2RCxNQUFNckIsU0FBU3FCLElBQUlyQixNQUFKLElBQWMsRUFBN0I7O0FBRUE7QUFDQSxNQUFNOEgsWUFBWSxDQUFDL0YsT0FBT0MsSUFBUCxDQUFZaEMsTUFBWixLQUF1QixFQUF4QixFQUE0QnVHLE1BQTVCLENBQW1DLFVBQUMwQyxhQUFELEVBQWdCN0gsR0FBaEIsRUFBd0I7QUFBQTs7QUFDM0UsdUNBQ0s2SCxhQURMLDZCQUVHN0gsR0FGSCxnQ0FHT3BCLE9BQU9vQixHQUFQLENBSFA7QUFJSWlFLGlCQUFXMkQsU0FBU2QsUUFBVCxDQUFrQjlHLEdBQWxCO0FBSmY7QUFPRCxHQVJpQixFQVFmLEVBUmUsQ0FBbEI7O0FBVUEsTUFBTXNFLG9CQUFjMUUsU0FBZCxDQUFOOztBQUVBMEUsVUFBUXFELFFBQVIsZ0NBQ0svSCxVQUFVK0gsUUFBVixDQURMO0FBRUUvSSxZQUFROEg7QUFGVjs7QUFLQSxxQ0FDSzVHLEtBREw7QUFFRUYsZUFBVzBFO0FBRmI7QUFJRCxDQTNDTTs7QUE2Q0EsSUFBTXdELGdEQUFvQixTQUFwQkEsaUJBQW9CLENBQUNoSSxLQUFELEVBQVFPLE1BQVIsRUFBbUI7QUFBQTs7QUFDbEQsTUFBSSxDQUFDUCxNQUFNRixTQUFOLENBQWdCUyxPQUFPc0gsUUFBdkIsQ0FBTCxFQUF1QztBQUNyQyxXQUFPN0gsS0FBUDtBQUNEOztBQUVELE1BQU1pSSxjQUFjakksTUFBTUYsU0FBTixDQUFnQlMsT0FBT3NILFFBQXZCLENBQXBCO0FBTGtELE1BTTNDL0ksTUFOMkMsR0FNakNtSixXQU5pQyxDQU0zQ25KLE1BTjJDOztBQU9sRCxNQUFJLENBQUNBLE1BQUQsSUFBVyxDQUFDQSxPQUFPeUIsT0FBTzJILE9BQWQsQ0FBaEIsRUFBd0M7QUFDdEMsV0FBT2xJLEtBQVA7QUFDRDs7QUFFRCxNQUFNQyxRQUFRbkIsT0FBT3lCLE9BQU8ySCxPQUFkLENBQWQ7O0FBRUEsTUFBTWxILHVDQUNEZixLQURDO0FBRUprRSxlQUFXLENBQUNsRSxNQUFNa0U7QUFGZCxJQUFOOztBQUtBLE1BQU15Qyx3Q0FDRDlILE1BREMsNkJBRUh5QixPQUFPMkgsT0FGSixJQUVjbEgsUUFGZCxhQUFOOztBQUtBO0FBQ0EsTUFBTW1ILHlCQUFtQm5JLE1BQU1GLFNBQXpCLENBQU47QUFDQXFJLGVBQWE1SCxPQUFPc0gsUUFBcEIsZ0NBQ0tJLFdBREw7QUFFRW5KLFlBQVE4SDtBQUZWOztBQUtBLHFDQUNLNUcsS0FETDtBQUVFRixlQUFXcUk7QUFGYjtBQUlELENBbENNOztBQW9DUCxTQUFTQyw4QkFBVCxDQUF3Q25JLEtBQXhDLEVBQStDO0FBQzdDLFNBQU87QUFDTG9JLGlCQUFhcEksTUFBTXlCLE1BQU4sQ0FBYXlDLFNBRHJCO0FBRUxBLGVBQVdsRSxNQUFNeUIsTUFBTixDQUFheUM7QUFGbkIsR0FBUDtBQUlEOztBQUVEOzs7Ozs7QUFNQSxTQUFTdUQscUJBQVQsQ0FBK0I1SSxNQUEvQixFQUF1QztBQUNyQyxNQUFNd0osWUFBWXhKLE9BQU91RyxNQUFQLENBQWMsVUFBQ3VCLFNBQUQsRUFBWTJCLFlBQVo7QUFBQTs7QUFBQSx1Q0FDM0IzQixTQUQyQiwrQkFFN0IyQixhQUFhNUgsRUFGZ0IsSUFFWHlILCtCQUErQkcsWUFBL0IsQ0FGVztBQUFBLEdBQWQsRUFHZCxFQUhjLENBQWxCO0FBSUEsU0FBTyxDQUNMO0FBQ0V6SixZQUFRd0o7QUFEVixHQURLLEVBSUw7QUFDRXhKLFlBQVF3SjtBQURWLEdBSkssQ0FBUDtBQVFEOztBQUVEOzs7Ozs7QUFNQSxTQUFTN0Qsd0JBQVQsQ0FBa0N6RSxLQUFsQyxFQUF5Q0MsS0FBekMsRUFBZ0Q7QUFDOUMsU0FBT0QsTUFBTUYsU0FBTixDQUFnQkssR0FBaEIsQ0FBb0Isb0JBQVk7QUFBQSxRQUM5QnJCLE1BRDhCLEdBQ3BCOEMsUUFEb0IsQ0FDOUI5QyxNQUQ4QjtBQUVyQzs7QUFGcUMsUUFHbEIwSixDQUhrQixHQUdDMUosTUFIRCxDQUc3Qm1CLE1BQU1VLEVBSHVCO0FBQUEsUUFHWmlHLFNBSFksMENBR0M5SCxNQUhELEdBRzdCbUIsTUFBTVUsRUFIdUI7QUFJckM7O0FBQ0EsdUNBQ0tpQixRQURMO0FBRUU5QyxjQUFROEg7QUFGVjtBQUlELEdBVE0sQ0FBUDtBQVVEOztBQUVEOzs7Ozs7QUFNQSxTQUFTdkMsc0JBQVQsQ0FBZ0N2RSxTQUFoQyxFQUEyQ2hCLE1BQTNDLEVBQW1EO0FBQ2pELE1BQU04SCxZQUFZVixNQUFNQyxPQUFOLENBQWNySCxNQUFkLElBQXdCQSxNQUF4QixHQUFpQyxDQUFDQSxNQUFELENBQW5EOztBQUVBLE1BQUksQ0FBQ2dCLFNBQUQsSUFBYyxDQUFDQSxVQUFVaUUsTUFBekIsSUFBbUMsQ0FBQzZDLFVBQVU3QyxNQUFsRCxFQUEwRDtBQUN4RCxXQUFPakUsU0FBUDtBQUNEOztBQUVEO0FBQ0E7QUFDQSxTQUFPQSxVQUFVSyxHQUFWLENBQWM7QUFBQSx1Q0FDaEJ5QixRQURnQjtBQUVuQjlDLDBDQUNLOEMsU0FBUzlDLE1BRGQsRUFFSzhILFVBQVV2QixNQUFWLENBQWlCLFVBQUNrQixJQUFELEVBQU92RixRQUFQO0FBQUE7O0FBQUEsZUFBcUJBLFNBQVNVLE1BQVQsQ0FBZ0J5QyxTQUFoQiwrQkFDcENvQyxJQURvQywrQkFFdEN2RixTQUFTTCxFQUY2QixJQUV4QmlCLFNBQVM5QyxNQUFULENBQWdCa0MsU0FBU0wsRUFBekIsSUFBK0JpQixTQUFTOUMsTUFBVCxDQUFnQmtDLFNBQVNMLEVBQXpCLENBQS9CLEdBQ2J5SCwrQkFBK0JwSCxRQUEvQixDQUhxQyxpQkFJckN1RixJQUpnQjtBQUFBLE9BQWpCLEVBSVEsRUFKUixDQUZMO0FBRm1CO0FBQUEsR0FBZCxDQUFQO0FBV0Q7O0FBRUQ7Ozs7OztBQU1BLFNBQVNsRix3QkFBVCxDQUFrQ3JCLEtBQWxDLEVBQXlDQyxLQUF6QyxFQUFnRDtBQUM5QyxTQUFPRCxNQUFNRixTQUFOLENBQWdCSyxHQUFoQixDQUFvQixvQkFBWTtBQUFBOztBQUFBLFFBQzlCckIsTUFEOEIsR0FDcEI4QyxRQURvQixDQUM5QjlDLE1BRDhCOztBQUVyQyxRQUFNOEgsd0NBQ0Q5SCxNQURDLCtCQUVIbUIsTUFBTVUsRUFGSCxJQUVReUgsK0JBQStCbkksS0FBL0IsQ0FGUixjQUFOOztBQUtBLHVDQUNLMkIsUUFETDtBQUVFOUMsY0FBUThIO0FBRlY7QUFJRCxHQVhNLENBQVA7QUFZRDs7QUFFRDs7Ozs7Ozs7O0FBU0EsU0FBU2UsdUJBQVQsQ0FBaUMzSCxLQUFqQyxFQUF3Q08sTUFBeEMsRUFBZ0Q7QUFDOUM7QUFDQSxNQUFNa0ksa0JBQWtCLElBQUlsSSxPQUFPNEcsT0FBbkM7O0FBRUEsTUFBTXVCLGVBQWUxSSxNQUFNRixTQUFOLENBQWdCMkksZUFBaEIsQ0FBckI7QUFDQSxNQUFJLENBQUNDLFlBQUQsSUFBaUIsQ0FBQ0EsYUFBYTVKLE1BQW5DLEVBQTJDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBLHVDQUNLa0IsS0FETDtBQUVFRixpQkFBVztBQUZiO0FBSUQ7O0FBYjZDLE1BZXZDaEIsTUFmdUMsR0FlN0JrQixLQWY2QixDQWV2Q2xCLE1BZnVDOztBQWlCOUM7O0FBQ0EsTUFBTThILFlBQVk5SCxPQUFPcUIsR0FBUCxDQUFXO0FBQUEsV0FDM0JGLE1BQU05QixpQkFBTixDQUF3QixFQUFDZ0csV0FBV3VFLGFBQWE1SixNQUFiLENBQW9CbUIsTUFBTVUsRUFBMUIsSUFDbEMrSCxhQUFhNUosTUFBYixDQUFvQm1CLE1BQU1VLEVBQTFCLEVBQThCd0QsU0FESSxHQUNRbEUsTUFBTXlCLE1BQU4sQ0FBYXlDLFNBRGpDLEVBQXhCLENBRDJCO0FBQUEsR0FBWCxDQUFsQjs7QUFLQTtBQUNBLHFDQUNLbkUsS0FETDtBQUVFbEIsWUFBUThILFNBRlY7QUFHRTlHLGVBQVc7QUFIYjtBQUtEOztBQUVNLElBQU02SSxzQ0FBZSxTQUFmQSxZQUFlLENBQUMzSSxLQUFELEVBQVFPLE1BQVIsRUFBbUI7QUFBQSxNQUN0Q3FJLEtBRHNDLEdBQzdCckksTUFENkIsQ0FDdENxSSxLQURzQzs7QUFFN0MsTUFBTUMsY0FBY0QsTUFBTXpJLEdBQU4sQ0FBVTtBQUFBLFdBQWE7QUFDekMySSx3QkFEeUM7QUFFekN0QyxZQUFNO0FBQ0o3RixZQUFJLDJCQUFlLENBQWYsQ0FEQTtBQUVKb0ksZUFBT0QsU0FBUy9GLElBRlo7QUFHSmlHLGNBQU1GLFNBQVNFO0FBSFgsT0FGbUM7QUFPekNDLGVBQVMsaUNBQWVILFFBQWY7QUFQZ0MsS0FBYjtBQUFBLEdBQVYsQ0FBcEI7O0FBVUE7QUFDQSxNQUFNSSxnQkFBZ0IsQ0FDcEIsZ0JBQUtDLEdBQUwsQ0FDRU4sWUFBWTFJLEdBQVosdUJBREYsRUFFRWlKLEtBRkYsQ0FHRTtBQUFBLFdBQVcsb0NBQWNDLE9BQWQsRUFBdUIsRUFBQ2hELFdBQVcsSUFBWixFQUF2QixDQUFYO0FBQUEsR0FIRixFQUlFO0FBQUEsV0FBUyxtQ0FBYTdFLEtBQWIsQ0FBVDtBQUFBLEdBSkYsQ0FEb0IsQ0FBdEI7O0FBU0EsU0FBTyxxREFFQXhCLEtBRkE7QUFHSEosaUJBQWE7QUFIVixNQUtMc0osYUFMSyxDQUFQO0FBT0QsQ0E3Qk07O0FBK0JBLElBQU1JLGdEQUFvQixTQUFwQkEsaUJBQW9CLENBQUN0SixLQUFEO0FBQUEsTUFBU3dCLEtBQVQsU0FBU0EsS0FBVDtBQUFBLHFDQUM1QnhCLEtBRDRCO0FBRS9CSixpQkFBYSxLQUZrQjtBQUcvQkMsb0JBQWdCMkI7QUFIZTtBQUFBLENBQTFCOztBQU1QOzs7Ozs7O0FBT08sU0FBUy9DLGdCQUFULENBQTBCdUIsS0FBMUIsRUFBaUNaLFFBQWpDLEVBQTJDO0FBQ2hELE1BQU1tSyxnQkFBZ0IxSSxPQUFPMkksTUFBUCxDQUFjcEssUUFBZCxFQUF3QmlHLE1BQXhCLENBQStCLFVBQUNrQixJQUFELEVBQU9yQixPQUFQO0FBQUEscUJBQ2hEcUIsSUFEZ0QsRUFFL0Msa0NBQWlCckIsT0FBakIsS0FBNkIsRUFGa0I7QUFBQSxHQUEvQixFQUdsQixFQUhrQixDQUF0Qjs7QUFLQSxxQ0FDS2xGLEtBREw7QUFFRWxCLHNCQUFZa0IsTUFBTWxCLE1BQWxCLEVBQTZCeUssYUFBN0IsQ0FGRjtBQUdFdEssMEJBRUtzSyxjQUFjcEosR0FBZCxDQUFrQixVQUFDcUksQ0FBRCxFQUFJbkksQ0FBSjtBQUFBLGFBQVVMLE1BQU1sQixNQUFOLENBQWFpRixNQUFiLEdBQXNCMUQsQ0FBaEM7QUFBQSxLQUFsQixDQUZMLEVBR0tMLE1BQU1mLFVBSFg7QUFIRjtBQVNEOztBQUVEOzs7Ozs7O0FBT08sU0FBU1Asa0JBQVQsQ0FBNEJzQixLQUE1QixFQUFtQ2tGLE9BQW5DLEVBQTRDO0FBQ2pELE1BQU0yQixnQkFBZ0Isd0NBQWlCM0IsT0FBakIsQ0FBdEI7O0FBRUEscUNBQ0tsRixLQURMO0FBRUVULG1EQUNLUyxNQUFNVCxpQkFEWDtBQUVFcUcsMkNBQ0s1RixNQUFNVCxpQkFBTixDQUF3QnFHLE9BRDdCO0FBRUVsRSxnQkFBUTtBQUNOO0FBQ0FtRSxvREFDSzdGLE1BQU1ULGlCQUFOLENBQXdCcUcsT0FBeEIsQ0FBZ0NsRSxNQUFoQyxDQUF1Q21FLFlBRDVDLEVBRUtnQixhQUZMO0FBRk07QUFGVjtBQUZGO0FBRkY7QUFnQkQ7O0FBRUQ7Ozs7Ozs7QUFPTyxTQUFTbEksd0JBQVQsQ0FBa0NxQixLQUFsQyxFQUF5Q2dDLE1BQXpDLEVBQWlEO0FBQ3RELE1BQU15SCxVQUFVLE9BQU96SCxNQUFQLEtBQWtCLFFBQWxCLEdBQTZCLENBQUNBLE1BQUQsQ0FBN0IsR0FBd0NBLE1BQXhEO0FBQ0EsTUFBTTRFLFlBQVksRUFBbEI7QUFDQSxNQUFNOEMsZ0JBQWdCLEVBQXRCOztBQUVBMUosUUFBTWxCLE1BQU4sQ0FBYXlELE9BQWIsQ0FBcUIsVUFBQy9CLFFBQUQsRUFBV0gsQ0FBWCxFQUFpQjtBQUNwQyxRQUFJRyxTQUFTa0IsTUFBVCxDQUFnQk0sTUFBaEIsSUFBMEJ5SCxRQUFRekMsUUFBUixDQUFpQnhHLFNBQVNrQixNQUFULENBQWdCTSxNQUFqQyxDQUE5QixFQUF3RTs7QUFFdEUsVUFBTWhCLFdBQVdSLFNBQVNtSixpQkFBVCxDQUEyQjNKLE1BQU1aLFFBQU4sQ0FBZW9CLFNBQVNrQixNQUFULENBQWdCTSxNQUEvQixDQUEzQixDQUFqQjs7QUFGc0UsaUNBRzNDLG9DQUFtQmhCLFFBQW5CLEVBQTZCaEIsS0FBN0IsRUFBb0NBLE1BQU1qQixTQUFOLENBQWdCc0IsQ0FBaEIsQ0FBcEMsQ0FIMkM7QUFBQSxVQUcvRHRCLFNBSCtELHdCQUcvREEsU0FIK0Q7QUFBQSxVQUdwRGtCLEtBSG9ELHdCQUdwREEsS0FIb0Q7O0FBS3RFMkcsZ0JBQVVwQixJQUFWLENBQWV2RixLQUFmO0FBQ0F5SixvQkFBY2xFLElBQWQsQ0FBbUJ6RyxTQUFuQjtBQUNELEtBUEQsTUFPTztBQUNMNkgsZ0JBQVVwQixJQUFWLENBQWVoRixRQUFmO0FBQ0FrSixvQkFBY2xFLElBQWQsQ0FBbUJ4RixNQUFNakIsU0FBTixDQUFnQnNCLENBQWhCLENBQW5CO0FBQ0Q7QUFDRixHQVpEOztBQWNBLHFDQUNLTCxLQURMO0FBRUVsQixZQUFROEgsU0FGVjtBQUdFN0gsZUFBVzJLO0FBSGI7QUFLRCIsImZpbGUiOiJ2aXMtc3RhdGUtdXBkYXRlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xvbmVEZWVwIGZyb20gJ2xvZGFzaC5jbG9uZWRlZXAnO1xuaW1wb3J0IHtjb25zb2xlIGFzIENvbnNvbGV9IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuaW1wb3J0IHtUYXNrLCB3aXRoVGFza30gZnJvbSAncmVhY3QtcGFsbSdcblxuLy8gVGFza3NcbmltcG9ydCB7TE9BRF9GSUxFX1RBU0t9IGZyb20gJ3Rhc2tzL3Rhc2tzJztcblxuLy8gQWN0aW9uc1xuaW1wb3J0IHt1cGRhdGVWaXNEYXRhLCBsb2FkRmlsZXNFcnJ9IGZyb20gJ2FjdGlvbnMvdmlzLXN0YXRlLWFjdGlvbnMnO1xuXG4vLyBVdGlsc1xuaW1wb3J0IHtnZXREZWZhdWx0SW50ZXJhY3Rpb259IGZyb20gJ3V0aWxzL2ludGVyYWN0aW9uLXV0aWxzJztcbmltcG9ydCB7Z2VuZXJhdGVIYXNoSWR9IGZyb20gJ3V0aWxzL3V0aWxzJztcbmltcG9ydCB7ZmluZEZpZWxkc1RvU2hvd30gZnJvbSAndXRpbHMvaW50ZXJhY3Rpb24tdXRpbHMnO1xuaW1wb3J0IHtcbiAgZ2V0RGVmYXVsdGZpbHRlcixcbiAgZ2V0RmlsdGVyUHJvcHMsXG4gIGdldEZpbHRlclBsb3QsXG4gIGdldERlZmF1bHRGaWx0ZXJQbG90VHlwZSxcbiAgZmlsdGVyRGF0YVxufSBmcm9tICd1dGlscy9maWx0ZXItdXRpbHMnO1xuaW1wb3J0IHtjcmVhdGVOZXdEYXRhRW50cnl9IGZyb20gJ3V0aWxzL2RhdGFzZXQtdXRpbHMnO1xuXG5pbXBvcnQge1xuICBmaW5kRGVmYXVsdExheWVyLFxuICBjYWxjdWxhdGVMYXllckRhdGFcbn0gZnJvbSAndXRpbHMvbGF5ZXItdXRpbHMvbGF5ZXItdXRpbHMnO1xuXG5pbXBvcnQge2dldEZpbGVIYW5kbGVyfSBmcm9tICdwcm9jZXNzb3IvZmlsZS1oYW5kbGVyJztcbmltcG9ydCB7ZmluZE1hcEJvdW5kc30gZnJvbSAndXRpbHMvZGF0YS11dGlscyc7XG5cbmltcG9ydCB7XG4gIG1lcmdlRmlsdGVycyxcbiAgbWVyZ2VMYXllcnMsXG4gIG1lcmdlSW50ZXJhY3Rpb25zLFxuICBtZXJnZUxheWVyQmxlbmRpbmdcbn0gZnJvbSAnLi92aXMtc3RhdGUtbWVyZ2VyJztcblxuaW1wb3J0ICogYXMgS2VwbGVyR0xMYXllcnMgZnJvbSAna2VwbGVyZ2wtbGF5ZXJzJztcbmltcG9ydCB7TEFZRVJfQ0xBU1NFU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5leHBvcnQgY29uc3QgSU5JVElBTF9WSVNfU1RBVEUgPSB7XG4gIC8vIGxheWVyc1xuICBsYXllcnM6IFtdLFxuICBsYXllckRhdGE6IFtdLFxuICBsYXllclRvQmVNZXJnZWQ6IFtdLFxuICBsYXllck9yZGVyOiBbXSxcblxuICAvLyBmaWx0ZXJzXG4gIGZpbHRlcnM6IFtdLFxuICBmaWx0ZXJUb0JlTWVyZ2VkOiBbXSxcblxuICAvLyBhIGNvbGxlY3Rpb24gb2YgbXVsdGlwbGUgZGF0YXNldFxuICBkYXRhc2V0czoge30sXG4gIGVkaXRpbmdEYXRhc2V0OiB1bmRlZmluZWQsXG5cbiAgaW50ZXJhY3Rpb25Db25maWc6IGdldERlZmF1bHRJbnRlcmFjdGlvbigpLFxuICBpbnRlcmFjdGlvblRvQmVNZXJnZWQ6IHVuZGVmaW5lZCxcblxuICBsYXllckJsZW5kaW5nOiAnbm9ybWFsJyxcbiAgaG92ZXJJbmZvOiB1bmRlZmluZWQsXG4gIGNsaWNrZWQ6IHVuZGVmaW5lZCxcblxuICBmaWxlTG9hZGluZzogZmFsc2UsXG4gIGZpbGVMb2FkaW5nRXJyOiBudWxsLFxuXG4gIC8vIHRoaXMgaXMgdXNlZCB3aGVuIHVzZXIgc3BsaXQgbWFwc1xuICBzcGxpdE1hcHM6IFtcbiAgICAvLyB0aGlzIHdpbGwgY29udGFpbiBhIGxpc3Qgb2Ygb2JqZWN0cyB0b1xuICAgIC8vIGRlc2NyaWJlIHRoZSBzdGF0ZSBvZiBsYXllciBhdmFpbGFiaWxpdHkgYW5kIHZpc2liaWxpdHkgZm9yIGVhY2ggbWFwXG4gICAgLy8gW1xuICAgIC8vICAge1xuICAgIC8vICAgICBsYXllcnM6IHtcbiAgICAvLyAgICAgICBsYXllcl9pZDoge1xuICAgIC8vICAgICAgICAgaXNBdmFpbGFibGU6IHRydWV8ZmFsc2UgIyB0aGlzIGlzIGRyaXZlbiBieSB0aGUgbGVmdCBoYW5kIHBhbmVsXG4gICAgLy8gICAgICAgICBpc1Zpc2libGU6IHRydWV8ZmFsc2VcbiAgICAvLyAgICAgICB9XG4gICAgLy8gICAgIH1cbiAgICAvLyAgIH1cbiAgICAvLyBdXG4gIF1cbn07XG5cbmZ1bmN0aW9uIHVwZGF0ZVN0YXRlV2l0aExheWVyQW5kRGF0YShzdGF0ZSwge2xheWVyRGF0YSwgbGF5ZXIsIGlkeH0pIHtcbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBsYXllcnM6IHN0YXRlLmxheWVyc1xuICAgICAgLm1hcCgobHlyLCBpKSA9PiBpID09PSBpZHggPyBsYXllciA6IGx5ciksXG4gICAgbGF5ZXJEYXRhOiBsYXllckRhdGEgPyBzdGF0ZS5sYXllckRhdGFcbiAgICAgIC5tYXAoKGQsIGkpID0+IGkgPT09IGlkeCA/IGxheWVyRGF0YSA6IGQpIDpcbiAgICAgIHN0YXRlLmxheWVyRGF0YVxuICB9O1xufVxuXG4vKipcbiAqIENhbGxlZCB0byB1cGRhdGUgbGF5ZXIgYmFzZSBjb25maWc6IGRhdGFJZCwgbGFiZWwsIGNvbHVtbiwgaXNWaXNpYmxlXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlTGF5ZXJDb25maWcoc3RhdGUsIGFjdGlvbikge1xuICBjb25zdCB7b2xkTGF5ZXJ9ID0gYWN0aW9uO1xuICBjb25zdCBpZHggPSBzdGF0ZS5sYXllcnMuZmluZEluZGV4KGwgPT4gbC5pZCA9PT0gb2xkTGF5ZXIuaWQpO1xuICBjb25zdCBwcm9wcyA9IE9iamVjdC5rZXlzKGFjdGlvbi5uZXdDb25maWcpO1xuXG4gIGNvbnN0IG5ld0xheWVyID0gb2xkTGF5ZXIudXBkYXRlTGF5ZXJDb25maWcoYWN0aW9uLm5ld0NvbmZpZyk7XG4gIGlmIChuZXdMYXllci5zaG91bGRDYWxjdWxhdGVMYXllckRhdGEocHJvcHMpKSB7XG4gICAgY29uc3Qgb2xkTGF5ZXJEYXRhID0gc3RhdGUubGF5ZXJEYXRhW2lkeF07XG4gICAgY29uc3Qge2xheWVyRGF0YSwgbGF5ZXJ9ID0gY2FsY3VsYXRlTGF5ZXJEYXRhKG5ld0xheWVyLCBzdGF0ZSwgb2xkTGF5ZXJEYXRhLCB7c2FtZURhdGE6IHRydWV9KTtcbiAgICByZXR1cm4gdXBkYXRlU3RhdGVXaXRoTGF5ZXJBbmREYXRhKHN0YXRlLCB7bGF5ZXJEYXRhLCBsYXllciwgaWR4fSlcbiAgfVxuXG4gIGNvbnN0IG5ld1N0YXRlID0ge1xuICAgIC4uLnN0YXRlLFxuICAgIHNwbGl0TWFwczogJ2lzVmlzaWJsZScgaW4gYWN0aW9uLm5ld0NvbmZpZyA/XG4gICAgICB0b2dnbGVMYXllckZyb21TcGxpdE1hcHMoc3RhdGUsIG5ld0xheWVyKSA6IHN0YXRlLnNwbGl0TWFwc1xuICB9O1xuXG4gIHJldHVybiB1cGRhdGVTdGF0ZVdpdGhMYXllckFuZERhdGEobmV3U3RhdGUsIHtsYXllcjogbmV3TGF5ZXIsIGlkeH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlTGF5ZXJUeXBlKHN0YXRlLCBhY3Rpb24pIHtcbiAgY29uc3Qge29sZExheWVyLCBuZXdUeXBlfSA9IGFjdGlvbjtcbiAgY29uc3Qgb2xkSWQgPSBvbGRMYXllci5pZDtcbiAgY29uc3QgaWR4ID0gc3RhdGUubGF5ZXJzLmZpbmRJbmRleChsID0+IGwuaWQgPT09IG9sZElkKTtcblxuICBpZiAoIUxBWUVSX0NMQVNTRVNbbmV3VHlwZV0gfHwgIUtlcGxlckdMTGF5ZXJzW0xBWUVSX0NMQVNTRVNbbmV3VHlwZV1dKSB7XG4gICAgQ29uc29sZS5lcnJvcihgJHtuZXdUeXBlfSBpcyBub3QgYSB2YWxpZCBsYXllciB0eXBlYCk7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgLy8gZ2V0IGEgbWludCBsYXllciwgd2l0aCBuZXcgaWQgYW5kIHR5cGVcbiAgLy8gYmVjYXVzZSBkZWNrLmdsIHVzZXMgaWQgdG8gbWF0Y2ggYmV0d2VlbiBuZXcgYW5kIG9sZCBsYXllci5cbiAgLy8gSWYgdHlwZSBoYXMgY2hhbmdlZCBidXQgaWQgaXMgdGhlIHNhbWUsIGl0IHdpbGwgYnJlYWtcbiAgY29uc3QgTGF5ZXJDbGFzcyA9IEtlcGxlckdMTGF5ZXJzW0xBWUVSX0NMQVNTRVNbbmV3VHlwZV1dO1xuICBjb25zdCBuZXdMYXllciA9IG5ldyBMYXllckNsYXNzKCk7XG5cbiAgbmV3TGF5ZXIuY29uZmlnID0gbmV3TGF5ZXIuYXNzaWduQ29uZmlnVG9MYXllcihuZXdMYXllci5jb25maWcsIG9sZExheWVyLmNvbmZpZyk7XG5cbiAgY29uc3Qge2xheWVyRGF0YSwgbGF5ZXJ9ID0gY2FsY3VsYXRlTGF5ZXJEYXRhKG5ld0xheWVyLCBzdGF0ZSk7XG5cbiAgbGV0IG5ld1N0YXRlID0gc3RhdGU7XG5cbiAgLy8gdXBkYXRlIHNwbGl0TWFwIGxheWVyIGlkXG4gIGlmIChzdGF0ZS5zcGxpdE1hcHMpIHtcbiAgICBuZXdTdGF0ZSA9IHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgc3BsaXRNYXBzOiBzdGF0ZS5zcGxpdE1hcHMubWFwKHNldHRpbmdzID0+IHtcbiAgICAgICAgY29uc3Qge1tvbGRJZF06IG9sZExheWVyTWFwLCAuLi5vdGhlckxheWVyc30gPSBzZXR0aW5ncy5sYXllcnM7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uc2V0dGluZ3MsXG4gICAgICAgICAgbGF5ZXJzOiB7XG4gICAgICAgICAgICAuLi5vdGhlckxheWVycyxcbiAgICAgICAgICAgIFtsYXllci5pZF06IG9sZExheWVyTWFwXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH07XG4gIH1cblxuICByZXR1cm4gdXBkYXRlU3RhdGVXaXRoTGF5ZXJBbmREYXRhKG5ld1N0YXRlLCB7bGF5ZXJEYXRhLCBsYXllciwgaWR4fSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZyhzdGF0ZSwgYWN0aW9uKSB7XG4gIGNvbnN0IHtvbGRMYXllciwgbmV3Q29uZmlnLCBjaGFubmVsfSA9IGFjdGlvbjtcbiAgY29uc3Qge2RhdGEsIGFsbERhdGF9ID0gc3RhdGUuZGF0YXNldHNbb2xkTGF5ZXIuY29uZmlnLmRhdGFJZF07XG5cbiAgY29uc3QgaWR4ID0gc3RhdGUubGF5ZXJzLmZpbmRJbmRleChsID0+IGwuaWQgPT09IG9sZExheWVyLmlkKTtcbiAgY29uc3QgbmV3TGF5ZXIgPSBvbGRMYXllci51cGRhdGVMYXllckNvbmZpZyhuZXdDb25maWcpO1xuXG4gIG5ld0xheWVyLnVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbCh7ZGF0YSwgYWxsRGF0YX0sIGNoYW5uZWwpO1xuXG4gIGNvbnN0IG9sZExheWVyRGF0YSA9IHN0YXRlLmxheWVyRGF0YVtpZHhdO1xuICBjb25zdCB7bGF5ZXJEYXRhLCBsYXllcn0gPSBjYWxjdWxhdGVMYXllckRhdGEobmV3TGF5ZXIsIHN0YXRlLCBvbGRMYXllckRhdGEsIHtzYW1lRGF0YTogdHJ1ZX0pO1xuXG4gIHJldHVybiB1cGRhdGVTdGF0ZVdpdGhMYXllckFuZERhdGEoc3RhdGUsIHtsYXllckRhdGEsIGxheWVyLCBpZHh9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlTGF5ZXJWaXNDb25maWcoc3RhdGUsIGFjdGlvbikge1xuICBjb25zdCB7b2xkTGF5ZXJ9ID0gYWN0aW9uO1xuICBjb25zdCBpZHggPSBzdGF0ZS5sYXllcnMuZmluZEluZGV4KGwgPT4gbC5pZCA9PT0gb2xkTGF5ZXIuaWQpO1xuICBjb25zdCBwcm9wcyA9IE9iamVjdC5rZXlzKGFjdGlvbi5uZXdWaXNDb25maWcpO1xuXG4gIGNvbnN0IG5ld1Zpc0NvbmZpZyA9IHtcbiAgICAuLi5vbGRMYXllci5jb25maWcudmlzQ29uZmlnLFxuICAgIC4uLmFjdGlvbi5uZXdWaXNDb25maWdcbiAgfTtcblxuICBjb25zdCBuZXdMYXllciA9IG9sZExheWVyLnVwZGF0ZUxheWVyQ29uZmlnKHt2aXNDb25maWc6IG5ld1Zpc0NvbmZpZ30pO1xuXG4gIGlmIChuZXdMYXllci5zaG91bGRDYWxjdWxhdGVMYXllckRhdGEocHJvcHMpKSB7XG4gICAgY29uc3Qgb2xkTGF5ZXJEYXRhID0gc3RhdGUubGF5ZXJEYXRhW2lkeF07XG4gICAgY29uc3Qge2xheWVyRGF0YSwgbGF5ZXJ9ID0gY2FsY3VsYXRlTGF5ZXJEYXRhKG5ld0xheWVyLCBzdGF0ZSwgb2xkTGF5ZXJEYXRhLCB7c2FtZURhdGE6IHRydWV9KTtcbiAgICByZXR1cm4gdXBkYXRlU3RhdGVXaXRoTGF5ZXJBbmREYXRhKHN0YXRlLCB7bGF5ZXJEYXRhLCBsYXllciwgaWR4fSlcbiAgfVxuXG4gIHJldHVybiB1cGRhdGVTdGF0ZVdpdGhMYXllckFuZERhdGEoc3RhdGUsIHtsYXllcjogbmV3TGF5ZXIsIGlkeH0pXG59XG5cbi8qIGVzbGludC1lbmFibGUgbWF4LXN0YXRlbWVudHMgKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUludGVyYWN0aW9uQ29uZmlnKHN0YXRlLCBhY3Rpb24pIHtcbiAgY29uc3Qge2NvbmZpZ30gPSBhY3Rpb247XG5cbiAgY29uc3QgaW50ZXJhY3Rpb25Db25maWcgPSB7XG4gICAgLi4uc3RhdGUuaW50ZXJhY3Rpb25Db25maWcsXG4gICAgLi4ue1tjb25maWcuaWRdOiBjb25maWd9XG4gIH07XG5cbiAgaWYgKGNvbmZpZy5lbmFibGVkICYmICFzdGF0ZS5pbnRlcmFjdGlvbkNvbmZpZ1tjb25maWcuaWRdLmVuYWJsZWQpIHtcbiAgICAvLyBvbmx5IGVuYWJsZSBvbmUgaW50ZXJhY3Rpb24gYXQgYSB0aW1lXG4gICAgT2JqZWN0LmtleXMoaW50ZXJhY3Rpb25Db25maWcpLmZvckVhY2goayA9PiB7XG4gICAgICBpZiAoayAhPT0gY29uZmlnLmlkKSB7XG4gICAgICAgIGludGVyYWN0aW9uQ29uZmlnW2tdID0gey4uLmludGVyYWN0aW9uQ29uZmlnW2tdLCBlbmFibGVkOiBmYWxzZX07XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGludGVyYWN0aW9uQ29uZmlnXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVGaWx0ZXIoc3RhdGUsIGFjdGlvbikge1xuICBjb25zdCB7aWR4LCBwcm9wLCB2YWx1ZX0gPSBhY3Rpb247XG4gIGxldCBuZXdTdGF0ZSA9IHN0YXRlO1xuICBsZXQgbmV3RmlsdGVyID0ge1xuICAgIC4uLnN0YXRlLmZpbHRlcnNbaWR4XSxcbiAgICBbcHJvcF06IHZhbHVlXG4gIH07XG5cbiAgY29uc3Qge2RhdGFJZH0gPSBuZXdGaWx0ZXI7XG4gIGlmICghZGF0YUlkKSB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG4gIGNvbnN0IHtmaWVsZHMsIGFsbERhdGF9ID0gc3RhdGUuZGF0YXNldHNbZGF0YUlkXTtcblxuICBzd2l0Y2ggKHByb3ApIHtcbiAgY2FzZSAnZGF0YUlkJzpcbiAgICAvLyBpZiB0cnlpbmcgdG8gdXBkYXRlIGZpbHRlciBkYXRhSWQuIGNyZWF0ZSBhbiBlbXB0eSBuZXcgZmlsdGVyXG4gICAgbmV3RmlsdGVyID0gZ2V0RGVmYXVsdGZpbHRlcihkYXRhSWQpO1xuICAgIGJyZWFrO1xuXG4gIGNhc2UgJ25hbWUnOlxuXG4gICAgLy8gZmluZCB0aGUgZmllbGRcbiAgICBjb25zdCBmaWVsZElkeCA9IGZpZWxkcy5maW5kSW5kZXgoZiA9PiAoZi5uYW1lID09PSB2YWx1ZSkpO1xuICAgIGxldCBmaWVsZCA9IGZpZWxkc1tmaWVsZElkeF07XG5cbiAgICBpZiAoIWZpZWxkLmZpbHRlclByb3ApIHtcblxuICAgICAgLy8gZ2V0IGZpbHRlciBkb21haW4gZnJvbSBmaWVsZFxuICAgICAgLy8gc2F2ZSBmaWx0ZXJQcm9wczoge2RvbWFpbiwgc3RlcHMsIHZhbHVlfSB0byBmaWVsZCwgYXZvaWQgcmVjYWxjdWxhdGVcbiAgICAgIGZpZWxkID0ge1xuICAgICAgICAuLi5maWVsZCxcbiAgICAgICAgZmlsdGVyUHJvcDogZ2V0RmlsdGVyUHJvcHMoYWxsRGF0YSwgZmllbGQpXG4gICAgICB9O1xuICAgIH1cblxuICAgIG5ld0ZpbHRlciA9IHtcbiAgICAgIC4uLm5ld0ZpbHRlcixcbiAgICAgIC4uLmZpZWxkLmZpbHRlclByb3AsXG4gICAgICBuYW1lOiBmaWVsZC5uYW1lLFxuICAgICAgLy8gY2FuJ3QgZWRpdCBkYXRhSWQgb25jZSBuYW1lIGlzIHNlbGVjdGVkXG4gICAgICBmcmVlemU6IHRydWUsXG4gICAgICBmaWVsZElkeFxuICAgIH07XG5cbiAgICBuZXdTdGF0ZSA9IHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgZGF0YXNldHM6IHtcbiAgICAgICAgLi4uc3RhdGUuZGF0YXNldHMsXG4gICAgICAgIFtkYXRhSWRdOiB7XG4gICAgICAgICAgLi4uc3RhdGUuZGF0YXNldHNbZGF0YUlkXSxcbiAgICAgICAgICBmaWVsZHM6IGZpZWxkcy5tYXAoKGQsIGkpID0+IGkgPT09IGZpZWxkSWR4ID8gZmllbGQgOiBkKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBicmVhaztcbiAgY2FzZSAndmFsdWUnOlxuICBkZWZhdWx0OlxuICAgIGJyZWFrO1xuICB9XG5cbiAgLy8gc2F2ZSBuZXcgZmlsdGVycyB0byBuZXdTdGF0ZVxuICBuZXdTdGF0ZSA9IHtcbiAgICAuLi5uZXdTdGF0ZSxcbiAgICBmaWx0ZXJzOiBzdGF0ZS5maWx0ZXJzLm1hcCgoZiwgaSkgPT4gaSA9PT0gaWR4ID8gbmV3RmlsdGVyIDogZilcbiAgfTtcblxuICAvLyBmaWx0ZXIgZGF0YVxuICBuZXdTdGF0ZSA9IHtcbiAgICAuLi5uZXdTdGF0ZSxcbiAgICBkYXRhc2V0czoge1xuICAgICAgLi4ubmV3U3RhdGUuZGF0YXNldHMsXG4gICAgICBbZGF0YUlkXToge1xuICAgICAgICAuLi5uZXdTdGF0ZS5kYXRhc2V0c1tkYXRhSWRdLFxuICAgICAgICAuLi5maWx0ZXJEYXRhKGFsbERhdGEsIGRhdGFJZCwgbmV3U3RhdGUuZmlsdGVycylcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgbmV3U3RhdGUgPSB1cGRhdGVBbGxMYXllckRvbWFpbkRhdGEobmV3U3RhdGUsIGRhdGFJZCk7XG5cbiAgcmV0dXJuIG5ld1N0YXRlO1xufVxuXG5leHBvcnQgY29uc3QgdXBkYXRlRmlsdGVyUGxvdCA9IChzdGF0ZSwge2lkeCwgbmV3UHJvcH0pID0+IHtcbiAgbGV0IG5ld0ZpbHRlciA9IHsuLi5zdGF0ZS5maWx0ZXJzW2lkeF0sIC4uLm5ld1Byb3B9O1xuICBjb25zdCBwcm9wID0gT2JqZWN0LmtleXMobmV3UHJvcClbMF07XG4gIGlmIChwcm9wID09PSAneUF4aXMnKSB7XG4gICAgY29uc3QgcGxvdFR5cGUgPSBnZXREZWZhdWx0RmlsdGVyUGxvdFR5cGUobmV3RmlsdGVyKTtcblxuICAgIGlmIChwbG90VHlwZSkge1xuICAgICAgbmV3RmlsdGVyID0ge1xuICAgICAgICAuLi5uZXdGaWx0ZXIsXG4gICAgICAgIC4uLmdldEZpbHRlclBsb3Qoey4uLm5ld0ZpbHRlciwgcGxvdFR5cGV9LCBzdGF0ZS5kYXRhc2V0c1tuZXdGaWx0ZXIuZGF0YUlkXS5hbGxEYXRhKSxcbiAgICAgICAgcGxvdFR5cGVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGZpbHRlcnM6IHN0YXRlLmZpbHRlcnMubWFwKChmLCBpKSA9PiBpID09PSBpZHggPyBuZXdGaWx0ZXIgOiBmKVxuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IGFkZEZpbHRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiAoIWFjdGlvbi5kYXRhSWQgPyBzdGF0ZSA6IHtcbiAgLi4uc3RhdGUsXG4gIGZpbHRlcnM6IFsuLi5zdGF0ZS5maWx0ZXJzLCBnZXREZWZhdWx0ZmlsdGVyKGFjdGlvbi5kYXRhSWQpXVxufSk7XG5cbmV4cG9ydCBjb25zdCBvblRvZ2dsZUZpbHRlckFuaW1hdGlvbiA9IChzdGF0ZSwgYWN0aW9uKSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgZmlsdGVyczogc3RhdGUuZmlsdGVyc1xuICAgIC5tYXAoKGYsIGkpID0+IGkgPT09IGFjdGlvbi5pZHggP1xuICAgICAgey4uLmYsIGlzQW5pbWF0aW5nOiAhZi5pc0FuaW1hdGluZ30gOiBmKVxufSk7XG5cbmV4cG9ydCBjb25zdCBlbmxhcmdlRmlsdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgY29uc3QgaXNFbmxhcmdlZCA9IHN0YXRlLmZpbHRlcnNbYWN0aW9uLmlkeF0uZW5sYXJnZWQ7XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBmaWx0ZXJzOiBzdGF0ZS5maWx0ZXJzLm1hcCgoZiwgaSkgPT4ge1xuICAgICAgZi5lbmxhcmdlZCA9ICFpc0VubGFyZ2VkICYmIGkgPT09IGFjdGlvbi5pZHg7XG4gICAgICByZXR1cm4gZjtcbiAgICB9KVxuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IHJlbW92ZUZpbHRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIGNvbnN0IHtpZHh9ID0gYWN0aW9uO1xuICBjb25zdCB7ZGF0YUlkfSA9IHN0YXRlLmZpbHRlcnNbaWR4XTtcblxuICBjb25zdCBuZXdGaWx0ZXJzID0gW1xuICAgIC4uLnN0YXRlLmZpbHRlcnMuc2xpY2UoMCwgaWR4KSxcbiAgICAuLi5zdGF0ZS5maWx0ZXJzLnNsaWNlKGlkeCArIDEsIHN0YXRlLmZpbHRlcnMubGVuZ3RoKV07XG5cbiAgY29uc3QgbmV3U3RhdGUgPSB7XG4gICAgLi4uc3RhdGUsXG4gICAgZGF0YXNldHM6IHtcbiAgICAgIC4uLnN0YXRlLmRhdGFzZXRzLFxuICAgICAgW2RhdGFJZF06IHtcbiAgICAgICAgLi4uc3RhdGUuZGF0YXNldHNbZGF0YUlkXSxcbiAgICAgICAgLi4uZmlsdGVyRGF0YShzdGF0ZS5kYXRhc2V0c1tkYXRhSWRdLmFsbERhdGEsIGRhdGFJZCwgbmV3RmlsdGVycylcbiAgICAgIH1cbiAgICB9LFxuICAgIGZpbHRlcnM6IG5ld0ZpbHRlcnNcbiAgfTtcblxuICByZXR1cm4gdXBkYXRlQWxsTGF5ZXJEb21haW5EYXRhKG5ld1N0YXRlLCBkYXRhSWQpO1xufTtcblxuZXhwb3J0IGNvbnN0IGFkZExheWVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgY29uc3QgZGVmYXVsdERhdGFzZXQgPSBPYmplY3Qua2V5cyhzdGF0ZS5kYXRhc2V0cylbMF07XG5cbiAgY29uc3QgbmV3TGF5ZXIgPSBuZXcgS2VwbGVyR0xMYXllcnMuTGF5ZXIoe1xuICAgIGlzVmlzaWJsZTogdHJ1ZSxcbiAgICBpc0NvbmZpZ0FjdGl2ZTogdHJ1ZSxcbiAgICBkYXRhSWQ6IGRlZmF1bHREYXRhc2V0XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgbGF5ZXJzOiBbLi4uc3RhdGUubGF5ZXJzLCBuZXdMYXllcl0sXG4gICAgbGF5ZXJEYXRhOiBbLi4uc3RhdGUubGF5ZXJEYXRhLCB7fV0sXG4gICAgbGF5ZXJPcmRlcjogWy4uLnN0YXRlLmxheWVyT3JkZXIsIHN0YXRlLmxheWVyT3JkZXIubGVuZ3RoXSxcbiAgICBzcGxpdE1hcHM6IGFkZE5ld0xheWVyc1RvU3BsaXRNYXAoc3RhdGUuc3BsaXRNYXBzLCBuZXdMYXllcilcbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCByZW1vdmVMYXllciA9IChzdGF0ZSwge2lkeH0pID0+IHtcbiAgY29uc3Qge2xheWVycywgbGF5ZXJEYXRhLCBjbGlja2VkLCBob3ZlckluZm99ID0gc3RhdGU7XG4gIGNvbnN0IGxheWVyVG9SZW1vdmUgPSBzdGF0ZS5sYXllcnNbaWR4XTtcbiAgY29uc3QgbmV3TWFwcyA9IHJlbW92ZUxheWVyRnJvbVNwbGl0TWFwcyhzdGF0ZSwgbGF5ZXJUb1JlbW92ZSk7XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBsYXllcnM6IFsuLi5sYXllcnMuc2xpY2UoMCwgaWR4KSwgLi4ubGF5ZXJzLnNsaWNlKGlkeCArIDEsIGxheWVycy5sZW5ndGgpXSxcbiAgICBsYXllckRhdGE6IFsuLi5sYXllckRhdGEuc2xpY2UoMCwgaWR4KSwgLi4ubGF5ZXJEYXRhLnNsaWNlKGlkeCArIDEsIGxheWVyRGF0YS5sZW5ndGgpXSxcbiAgICBsYXllck9yZGVyOiBzdGF0ZS5sYXllck9yZGVyLmZpbHRlcihpID0+IGkgIT09IGlkeCkubWFwKHBpZCA9PiBwaWQgPiBpZHggPyBwaWQgLSAxIDogcGlkKSxcbiAgICBjbGlja2VkOiBsYXllclRvUmVtb3ZlLmlzTGF5ZXJIb3ZlcmVkKGNsaWNrZWQpID8gdW5kZWZpbmVkIDogY2xpY2tlZCxcbiAgICBob3ZlckluZm86IGxheWVyVG9SZW1vdmUuaXNMYXllckhvdmVyZWQoaG92ZXJJbmZvKSA/IHVuZGVmaW5lZCA6IGhvdmVySW5mbyxcbiAgICBzcGxpdE1hcHM6IG5ld01hcHNcbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCByZW9yZGVyTGF5ZXIgPSAoc3RhdGUsIHtvcmRlcn0pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBsYXllck9yZGVyOiBvcmRlclxufSk7XG5cbmV4cG9ydCBjb25zdCByZW1vdmVEYXRhc2V0ID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgLy8gZXh0cmFjdCBkYXRhc2V0IGtleVxuICBjb25zdCB7a2V5OiBkYXRhc2V0S2V5fSA9IGFjdGlvbjtcbiAgY29uc3Qge2RhdGFzZXRzfSA9IHN0YXRlO1xuXG4gIC8vIGNoZWNrIGlmIGRhdGFzZXQgaXMgcHJlc2VudFxuICBpZiAoIWRhdGFzZXRzW2RhdGFzZXRLZXldKSB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgY29uc3Qge2xheWVycywgZGF0YXNldHM6IHtbZGF0YXNldEtleV06IGRhdGFzZXQsIC4uLm5ld0RhdGFzZXRzfX0gPSBzdGF0ZTtcbiAgLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xuXG4gIGNvbnN0IGluZGV4ZXMgPSBsYXllcnMucmVkdWNlKChsaXN0T2ZJbmRleGVzLCBsYXllciwgaW5kZXgpID0+IHtcbiAgICBpZiAobGF5ZXIuY29uZmlnLmRhdGFJZCA9PT0gZGF0YXNldEtleSkge1xuICAgICAgbGlzdE9mSW5kZXhlcy5wdXNoKGluZGV4KTtcbiAgICB9XG4gICAgcmV0dXJuIGxpc3RPZkluZGV4ZXM7XG4gIH0sIFtdKTtcblxuICAvLyByZW1vdmUgbGF5ZXJzIGFuZCBkYXRhc2V0c1xuICBjb25zdCB7bmV3U3RhdGV9ID0gaW5kZXhlcy5yZWR1Y2UoKHtuZXdTdGF0ZTogY3VycmVudFN0YXRlLCBpbmRleENvdW50ZXJ9LCBpZHgpID0+IHtcbiAgICBjb25zdCBjdXJyZW50SW5kZXggPSBpZHggLSBpbmRleENvdW50ZXI7XG4gICAgY3VycmVudFN0YXRlID0gcmVtb3ZlTGF5ZXIoY3VycmVudFN0YXRlLCB7aWR4OiBjdXJyZW50SW5kZXh9KTtcbiAgICBpbmRleENvdW50ZXIrKztcbiAgICByZXR1cm4ge25ld1N0YXRlOiBjdXJyZW50U3RhdGUsIGluZGV4Q291bnRlcn07XG4gIH0sIHtuZXdTdGF0ZTogey4uLnN0YXRlLCBkYXRhc2V0czogbmV3RGF0YXNldHN9LCBpbmRleENvdW50ZXI6IDB9KTtcblxuICAvLyByZW1vdmUgZmlsdGVyc1xuICBjb25zdCBmaWx0ZXJzID0gc3RhdGUuZmlsdGVycy5maWx0ZXIoZmlsdGVyID0+IGZpbHRlci5kYXRhSWQgIT09IGRhdGFzZXRLZXkpO1xuXG4gIC8vIHVwZGF0ZSBpbnRlcmFjdGlvbkNvbmZpZ1xuICBsZXQge2ludGVyYWN0aW9uQ29uZmlnfSA9IHN0YXRlO1xuICBjb25zdCB7dG9vbHRpcH0gPSBpbnRlcmFjdGlvbkNvbmZpZztcbiAgaWYgKHRvb2x0aXApIHtcbiAgICBjb25zdCB7Y29uZmlnfSA9IHRvb2x0aXA7XG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgICBjb25zdCB7W2RhdGFzZXRLZXldOiBmaWVsZHMsIC4uLmZpZWxkc1RvU2hvd30gPSBjb25maWcuZmllbGRzVG9TaG93O1xuICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgICBpbnRlcmFjdGlvbkNvbmZpZyA9IHsuLi5pbnRlcmFjdGlvbkNvbmZpZywgdG9vbHRpcDogey4uLnRvb2x0aXAsIGNvbmZpZzogey4uLmNvbmZpZywgZmllbGRzVG9TaG93fX19O1xuICB9XG5cbiAgcmV0dXJuIHsuLi5uZXdTdGF0ZSwgZmlsdGVycywgaW50ZXJhY3Rpb25Db25maWd9O1xufTtcblxuZXhwb3J0IGNvbnN0IHVwZGF0ZUxheWVyQmxlbmRpbmcgPSAoc3RhdGUsIGFjdGlvbikgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGxheWVyQmxlbmRpbmc6IGFjdGlvbi5tb2RlXG59KTtcblxuZXhwb3J0IGNvbnN0IHNob3dEYXRhc2V0VGFibGUgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGVkaXRpbmdEYXRhc2V0OiBhY3Rpb24uZGF0YUlkXG4gIH1cbn07XG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1zdGF0ZW1lbnRzICovXG5leHBvcnQgY29uc3QgcmVjZWl2ZVZpc0RhdGEgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAvLyBkYXRhc2V0cyBjYW4gYmUgYSBzaW5nbGUgZGF0YSBlbnRyaWVzIG9yIGFuIGFycmF5IG9mIG11bHRpcGxlIGRhdGEgZW50cmllc1xuICBjb25zdCBkYXRhc2V0cyA9IEFycmF5LmlzQXJyYXkoYWN0aW9uLmRhdGFzZXRzKSA/IGFjdGlvbi5kYXRhc2V0cyA6IFthY3Rpb24uZGF0YXNldHNdO1xuICBjb25zdCB7b3B0aW9ucyA9IHtjZW50ZXJNYXA6IHRydWV9fSA9IGFjdGlvbjtcblxuICBjb25zdCBuZXdEYXRlRW50cmllcyA9IGRhdGFzZXRzLnJlZHVjZSgoYWNjdSwge2luZm8gPSB7fSwgZGF0YX0pID0+ICh7XG4gICAgLi4uYWNjdSxcbiAgICAuLi4oY3JlYXRlTmV3RGF0YUVudHJ5KHtpbmZvLCBkYXRhfSwgc3RhdGUuZGF0YXNldHMpIHx8IHt9KVxuICB9KSwge30pO1xuXG4gIGlmICghT2JqZWN0LmtleXMobmV3RGF0ZUVudHJpZXMpLmxlbmd0aCkge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIGNvbnN0IHN0YXRlV2l0aE5ld0RhdGEgPSB7XG4gICAgLi4uc3RhdGUsXG4gICAgZGF0YXNldHM6IHtcbiAgICAgIC4uLnN0YXRlLmRhdGFzZXRzLFxuICAgICAgLi4ubmV3RGF0ZUVudHJpZXNcbiAgICB9XG4gIH07XG5cbiAgLy8gcHJldmlvdXNseSBzYXZlZCBjb25maWcgYmVmb3JlIGRhdGEgbG9hZGVkXG4gIGNvbnN0IHtcbiAgICBmaWx0ZXJUb0JlTWVyZ2VkID0gW10sXG4gICAgbGF5ZXJUb0JlTWVyZ2VkID0gW10sXG4gICAgaW50ZXJhY3Rpb25Ub0JlTWVyZ2VkID0ge31cbiAgfSA9IHN0YXRlV2l0aE5ld0RhdGE7XG5cbiAgLy8ga2VlcCBhIGNvcHkgb2Ygb2xkTGF5ZXJzXG4gIGNvbnN0IG9sZExheWVycyA9IHN0YXRlLmxheWVycy5tYXAobCA9PiBsLmlkKTtcblxuICAvLyBtZXJnZSBzdGF0ZSB3aXRoIHNhdmVkIGZpbHRlcnNcbiAgbGV0IG1lcmdlZFN0YXRlID0gbWVyZ2VGaWx0ZXJzKHN0YXRlV2l0aE5ld0RhdGEsIGZpbHRlclRvQmVNZXJnZWQpO1xuICAvLyBtZXJnZSBzdGF0ZSB3aXRoIHNhdmVkIGxheWVyc1xuICBtZXJnZWRTdGF0ZSA9IG1lcmdlTGF5ZXJzKG1lcmdlZFN0YXRlLCBsYXllclRvQmVNZXJnZWQpO1xuXG4gIGlmIChtZXJnZWRTdGF0ZS5sYXllcnMubGVuZ3RoID09PSBzdGF0ZS5sYXllcnMubGVuZ3RoKSB7XG4gICAgLy8gbm8gbGF5ZXIgbWVyZ2VkLCBmaW5kIGRlZmF1bHRzXG4gICAgbWVyZ2VkU3RhdGUgPSBhZGREZWZhdWx0TGF5ZXJzKG1lcmdlZFN0YXRlLCBuZXdEYXRlRW50cmllcyk7XG4gIH1cblxuICBpZiAobWVyZ2VkU3RhdGUuc3BsaXRNYXBzLmxlbmd0aCkge1xuICAgIGNvbnN0IG5ld0xheWVycyA9IG1lcmdlZFN0YXRlLmxheWVycy5maWx0ZXIobCA9PiBsLmNvbmZpZy5kYXRhSWQgaW4gbmV3RGF0ZUVudHJpZXMpO1xuICAgIC8vIGlmIG1hcCBpcyBzcGxpdGVkLCBhZGQgbmV3IGxheWVycyB0byBzcGxpdE1hcHNcbiAgICBtZXJnZWRTdGF0ZSA9IHtcbiAgICAgIC4uLm1lcmdlZFN0YXRlLFxuICAgICAgc3BsaXRNYXBzOiBhZGROZXdMYXllcnNUb1NwbGl0TWFwKG1lcmdlZFN0YXRlLnNwbGl0TWFwcywgbmV3TGF5ZXJzKVxuICAgIH07XG4gIH1cblxuICAvLyBtZXJnZSBzdGF0ZSB3aXRoIHNhdmVkIGludGVyYWN0aW9uc1xuICBtZXJnZWRTdGF0ZSA9IG1lcmdlSW50ZXJhY3Rpb25zKG1lcmdlZFN0YXRlLCBpbnRlcmFjdGlvblRvQmVNZXJnZWQpO1xuXG4gIC8vIGlmIG5vIHRvb2x0aXBzIG1lcmdlZCBhZGQgZGVmYXVsdCB0b29sdGlwc1xuICBPYmplY3Qua2V5cyhuZXdEYXRlRW50cmllcykuZm9yRWFjaChkYXRhSWQgPT4ge1xuICAgIGNvbnN0IHRvb2x0aXBGaWVsZHMgPSBtZXJnZWRTdGF0ZS5pbnRlcmFjdGlvbkNvbmZpZy50b29sdGlwLmNvbmZpZy5maWVsZHNUb1Nob3dbZGF0YUlkXTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodG9vbHRpcEZpZWxkcykgfHwgIXRvb2x0aXBGaWVsZHMubGVuZ3RoKSB7XG4gICAgICBtZXJnZWRTdGF0ZSA9IGFkZERlZmF1bHRUb29sdGlwcyhtZXJnZWRTdGF0ZSwgbmV3RGF0ZUVudHJpZXNbZGF0YUlkXSk7XG4gICAgfVxuICB9KTtcblxuICBjb25zdCB2aXNTdGF0ZSA9IHVwZGF0ZUFsbExheWVyRG9tYWluRGF0YShtZXJnZWRTdGF0ZSwgT2JqZWN0LmtleXMobmV3RGF0ZUVudHJpZXMpKVxuXG4gIGxldCBib3VuZHM7XG4gIGlmIChvcHRpb25zLmNlbnRlck1hcCkge1xuICAgIC8vIGZpbmQgbWFwIGJvdW5kcyBmb3IgbmV3IGxheWVyc1xuICAgIGNvbnN0IG5ld0xheWVycyA9IHZpc1N0YXRlLmxheWVyc1xuICAgICAgLmZpbHRlcihsID0+ICFvbGRMYXllcnMuaW5jbHVkZXMobC5pZCkpO1xuICAgIGJvdW5kcyA9IGZpbmRNYXBCb3VuZHMobmV3TGF5ZXJzKTtcbiAgfVxuXG4gIC8vIGFjdGlvbiBpcyBiZWluZyBjb21wb3NlZCBpbiB0aGUgY29tYmluZSByZWR1Y2VyIGxldmVsIHRvIGZ1cnRoZXIgdXBkYXRlIG1hcCBib3VuZHNcbiAgcmV0dXJuIHt2aXNTdGF0ZSwgYm91bmRzfTtcbn07XG4vKiBlc2xpbnQtZW5hYmxlIG1heC1zdGF0ZW1lbnRzICovXG5cbmV4cG9ydCBjb25zdCBoYW5kbGVSZXNldENvbmZpZyA9ICgpID0+IGNsb25lRGVlcChJTklUSUFMX1ZJU19TVEFURSk7XG5cbmV4cG9ydCBjb25zdCBoYW5kbGVSZWNlaXZlTWFwQ29uZmlnID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgaWYgKCFhY3Rpb24ucGF5bG9hZC52aXNTdGF0ZSkge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIGNvbnN0IHtcbiAgICBmaWx0ZXJzLFxuICAgIGxheWVycyxcbiAgICBpbnRlcmFjdGlvbkNvbmZpZyxcbiAgICBsYXllckJsZW5kaW5nLFxuICAgIHNwbGl0TWFwc1xuICB9ID0gYWN0aW9uLnBheWxvYWQudmlzU3RhdGU7XG5cbiAgLy8gYWx3YXlzIHJlc2V0IGNvbmZpZyB3aGVuIHJlY2VpdmUgYSBuZXcgY29uZmlnXG4gIGNvbnN0IHJlc2V0U3RhdGUgPSBoYW5kbGVSZXNldENvbmZpZygpO1xuICBsZXQgbWVyZ2VkU3RhdGUgPSB7XG4gICAgLi4ucmVzZXRTdGF0ZSxcbiAgICBzcGxpdE1hcHM6IHNwbGl0TWFwcyB8fCBbXSAvLyBtYXBzIGRvZXNuJ3QgcmVxdWlyZSBhbnkgbG9naWNcbiAgfTtcblxuICBtZXJnZWRTdGF0ZSA9IG1lcmdlRmlsdGVycyhtZXJnZWRTdGF0ZSwgZmlsdGVycyk7XG4gIG1lcmdlZFN0YXRlID0gbWVyZ2VMYXllcnMobWVyZ2VkU3RhdGUsIGxheWVycyk7XG4gIG1lcmdlZFN0YXRlID0gbWVyZ2VJbnRlcmFjdGlvbnMobWVyZ2VkU3RhdGUsIGludGVyYWN0aW9uQ29uZmlnKTtcbiAgbWVyZ2VkU3RhdGUgPSBtZXJnZUxheWVyQmxlbmRpbmcobWVyZ2VkU3RhdGUsIGxheWVyQmxlbmRpbmcpO1xuXG4gIHJldHVybiBtZXJnZWRTdGF0ZTtcbn07XG5cbmV4cG9ydCBjb25zdCBoYW5kbGVMYXllckhvdmVyID0gKHN0YXRlLCBhY3Rpb24pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBob3ZlckluZm86IGFjdGlvbi5pbmZvXG59KTtcblxuZXhwb3J0IGNvbnN0IGhhbmRsZUxheWVyQ2xpY2sgPSAoc3RhdGUsIGFjdGlvbikgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGNsaWNrZWQ6IGFjdGlvbi5pbmZvICYmIGFjdGlvbi5pbmZvLnBpY2tlZCA/IGFjdGlvbi5pbmZvIDogbnVsbFxufSk7XG5cbmV4cG9ydCBjb25zdCBoYW5kbGVNYXBDbGljayA9IChzdGF0ZSwgYWN0aW9uKSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgY2xpY2tlZDogbnVsbFxufSk7XG5cbmV4cG9ydCBjb25zdCBoYW5kbGVTcGxpdFRvZ2dsZSA9IChzdGF0ZSwgYWN0aW9uKSA9PiAoc3RhdGUuc3BsaXRNYXBzICYmIHN0YXRlLnNwbGl0TWFwcy5sZW5ndGggPT09IDAgPyB7XG4gIC4uLnN0YXRlLFxuICAvLyBtYXliZSB3ZSBzaG91bGQgdXNlIGFuIGFycmF5IHRvIHN0b3JlIHN0YXRlIGZvciBhIHNpbmdsZSBtYXAgYXMgd2VsbFxuICAvLyBpZiBjdXJyZW50IG1hcHMgbGVuZ3RoIGlzIGVxdWFsIHRvIDAgaXQgbWVhbnMgdGhhdCB3ZSBhcmUgYWJvdXQgdG8gc3BsaXQgdGhlIHZpZXdcbiAgc3BsaXRNYXBzOiBjb21wdXRlU3BsaXRNYXBMYXllcnMoc3RhdGUubGF5ZXJzKVxufSA6IGNsb3NlU3BlY2lmaWNNYXBBdEluZGV4KHN0YXRlLCBhY3Rpb24pKTtcblxuLyoqXG4gKiBUaGlzIGlzIHRyaWdnZXJlZCB3aGVuIHZpZXcgaXMgc3BsaXQgaW50byBtdWx0aXBsZSBtYXBzLlxuICogSXQgd2lsbCBvbmx5IHVwZGF0ZSBsYXllcnMgdGhhdCBiZWxvbmcgdG8gdGhlIG1hcCBsYXllciBkcm9wZG93blxuICogdGhlIHVzZXIgaXMgaW50ZXJhY3Rpbmcgd2l0XG4gKiBAcGFyYW0gc3RhdGVcbiAqIEBwYXJhbSBhY3Rpb25cbiAqL1xuZXhwb3J0IGNvbnN0IHNldFZpc2libGVMYXllcnNGb3JNYXAgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCB7bWFwSW5kZXgsIGxheWVySWRzfSA9IGFjdGlvbjtcbiAgaWYgKCFsYXllcklkcykge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIGNvbnN0IHtzcGxpdE1hcHMgPSBbXX0gPSBzdGF0ZTtcblxuICBpZiAoc3BsaXRNYXBzLmxlbmd0aCA9PT0gMCkge1xuICAgIC8vIHdlIHNob3VsZCBuZXZlciBnZXQgaW50byB0aGlzIHN0YXRlXG4gICAgLy8gYmVjYXVzZSB0aGlzIGFjdGlvbiBzaG91bGQgb25seSBiZSB0cmlnZ2VyZWRcbiAgICAvLyB3aGVuIG1hcCB2aWV3IGlzIHNwbGl0XG4gICAgLy8gYnV0IHNvbWV0aGluZyBtYXkgaGF2ZSBoYXBwZW5lZFxuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIC8vIG5lZWQgdG8gY2hlY2sgaWYgbWFwcyBpcyBwb3B1bGF0ZWQgb3RoZXJ3aXNlIHdpbGwgY3JlYXRlXG4gIGNvbnN0IHtbbWFwSW5kZXhdOiBtYXAgPSB7fX0gPSBzcGxpdE1hcHM7XG5cbiAgY29uc3QgbGF5ZXJzID0gbWFwLmxheWVycyB8fCBbXTtcblxuICAvLyB3ZSBzZXQgdmlzaWJpbGl0eSB0byB0cnVlIGZvciBhbGwgbGF5ZXJzIGluY2x1ZGVkIGluIG91ciBpbnB1dCBsaXN0XG4gIGNvbnN0IG5ld0xheWVycyA9IChPYmplY3Qua2V5cyhsYXllcnMpIHx8IFtdKS5yZWR1Y2UoKGN1cnJlbnRMYXllcnMsIGlkeCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5jdXJyZW50TGF5ZXJzLFxuICAgICAgW2lkeF06IHtcbiAgICAgICAgLi4ubGF5ZXJzW2lkeF0sXG4gICAgICAgIGlzVmlzaWJsZTogbGF5ZXJJZHMuaW5jbHVkZXMoaWR4KVxuICAgICAgfVxuICAgIH1cbiAgfSwge30pO1xuXG4gIGNvbnN0IG5ld01hcHMgPSBbLi4uc3BsaXRNYXBzXTtcblxuICBuZXdNYXBzW21hcEluZGV4XSA9IHtcbiAgICAuLi5zcGxpdE1hcHNbbWFwSW5kZXhdLFxuICAgIGxheWVyczogbmV3TGF5ZXJzXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBzcGxpdE1hcHM6IG5ld01hcHNcbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCB0b2dnbGVMYXllckZvck1hcCA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIGlmICghc3RhdGUuc3BsaXRNYXBzW2FjdGlvbi5tYXBJbmRleF0pIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICBjb25zdCBtYXBTZXR0aW5ncyA9IHN0YXRlLnNwbGl0TWFwc1thY3Rpb24ubWFwSW5kZXhdO1xuICBjb25zdCB7bGF5ZXJzfSA9IG1hcFNldHRpbmdzO1xuICBpZiAoIWxheWVycyB8fCAhbGF5ZXJzW2FjdGlvbi5sYXllcklkXSkge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIGNvbnN0IGxheWVyID0gbGF5ZXJzW2FjdGlvbi5sYXllcklkXTtcblxuICBjb25zdCBuZXdMYXllciA9IHtcbiAgICAuLi5sYXllcixcbiAgICBpc1Zpc2libGU6ICFsYXllci5pc1Zpc2libGVcbiAgfTtcblxuICBjb25zdCBuZXdMYXllcnMgPSB7XG4gICAgLi4ubGF5ZXJzLFxuICAgIFthY3Rpb24ubGF5ZXJJZF06IG5ld0xheWVyXG4gIH07XG5cbiAgLy8gY29uc3Qgc3BsaXRNYXBzID0gc3RhdGUuc3BsaXRNYXBzO1xuICBjb25zdCBuZXdTcGxpdE1hcHMgPSBbLi4uc3RhdGUuc3BsaXRNYXBzXTtcbiAgbmV3U3BsaXRNYXBzW2FjdGlvbi5tYXBJbmRleF0gPSB7XG4gICAgLi4ubWFwU2V0dGluZ3MsXG4gICAgbGF5ZXJzOiBuZXdMYXllcnNcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIHNwbGl0TWFwczogbmV3U3BsaXRNYXBzXG4gIH07XG59O1xuXG5mdW5jdGlvbiBnZW5lcmF0ZUxheWVyTWV0YUZvclNwbGl0Vmlld3MobGF5ZXIpIHtcbiAgcmV0dXJuIHtcbiAgICBpc0F2YWlsYWJsZTogbGF5ZXIuY29uZmlnLmlzVmlzaWJsZSxcbiAgICBpc1Zpc2libGU6IGxheWVyLmNvbmZpZy5pc1Zpc2libGVcbiAgfTtcbn1cblxuLyoqXG4gKiBUaGlzIGVtdGhvZCB3aWxsIGNvbXB1dGUgdGhlIGRlZmF1bHQgbWFwcyBjdXN0b20gbGlzdFxuICogYmFzZWQgb24gdGhlIGN1cnJlbnQgbGF5ZXJzIHN0YXR1c1xuICogQHBhcmFtIGxheWVyc1xuICogQHJldHVybnMge1sqLCpdfVxuICovXG5mdW5jdGlvbiBjb21wdXRlU3BsaXRNYXBMYXllcnMobGF5ZXJzKSB7XG4gIGNvbnN0IG1hcExheWVycyA9IGxheWVycy5yZWR1Y2UoKG5ld0xheWVycywgY3VycmVudExheWVyKSA9PiAoe1xuICAgIC4uLm5ld0xheWVycyxcbiAgICBbY3VycmVudExheWVyLmlkXTogZ2VuZXJhdGVMYXllck1ldGFGb3JTcGxpdFZpZXdzKGN1cnJlbnRMYXllcilcbiAgfSksIHt9KTtcbiAgcmV0dXJuIFtcbiAgICB7XG4gICAgICBsYXllcnM6IG1hcExheWVyc1xuICAgIH0sXG4gICAge1xuICAgICAgbGF5ZXJzOiBtYXBMYXllcnNcbiAgICB9XG4gIF07XG59XG5cbi8qKlxuICogUmVtb3ZlIGFuIGV4aXN0aW5nIGxheWVycyBmcm9tIGN1c3RvbSBtYXAgbGF5ZXIgb2JqZWN0c1xuICogQHBhcmFtIHN0YXRlXG4gKiBAcGFyYW0gbGF5ZXJcbiAqIEByZXR1cm5zIHtbKiwqXX0gTWFwcyBvZiBjdXN0b20gbGF5ZXIgb2JqZWN0c1xuICovXG5mdW5jdGlvbiByZW1vdmVMYXllckZyb21TcGxpdE1hcHMoc3RhdGUsIGxheWVyKSB7XG4gIHJldHVybiBzdGF0ZS5zcGxpdE1hcHMubWFwKHNldHRpbmdzID0+IHtcbiAgICBjb25zdCB7bGF5ZXJzfSA9IHNldHRpbmdzO1xuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4gICAgY29uc3Qge1tsYXllci5pZF06IF8sIC4uLm5ld0xheWVyc30gPSBsYXllcnM7XG4gICAgLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zZXR0aW5ncyxcbiAgICAgIGxheWVyczogbmV3TGF5ZXJzXG4gICAgfTtcbiAgfSk7XG59XG5cbi8qKlxuICogQWRkIG5ldyBsYXllcnMgdG8gYm90aCBleGlzdGluZyBtYXBzXG4gKiBAcGFyYW0gc3BsaXRNYXBzXG4gKiBAcGFyYW0gbGF5ZXJzXG4gKiBAcmV0dXJucyB7WyosKl19IG5ldyBzcGxpdE1hcHNcbiAqL1xuZnVuY3Rpb24gYWRkTmV3TGF5ZXJzVG9TcGxpdE1hcChzcGxpdE1hcHMsIGxheWVycykge1xuICBjb25zdCBuZXdMYXllcnMgPSBBcnJheS5pc0FycmF5KGxheWVycykgPyBsYXllcnMgOiBbbGF5ZXJzXTtcblxuICBpZiAoIXNwbGl0TWFwcyB8fCAhc3BsaXRNYXBzLmxlbmd0aCB8fCAhbmV3TGF5ZXJzLmxlbmd0aCkge1xuICAgIHJldHVybiBzcGxpdE1hcHM7XG4gIH1cblxuICAvLyBhZGQgbmV3IGxheWVyIHRvIGJvdGggbWFwcyxcbiAgLy8gIGRvbid0IG92ZXJyaWRlLCBpZiBsYXllci5pZCBpcyBhbHJlYWR5IGluIHNwbGl0TWFwcy5zZXR0aW5ncy5sYXllcnNcbiAgcmV0dXJuIHNwbGl0TWFwcy5tYXAoc2V0dGluZ3MgPT4gKHtcbiAgICAuLi5zZXR0aW5ncyxcbiAgICBsYXllcnM6IHtcbiAgICAgIC4uLnNldHRpbmdzLmxheWVycyxcbiAgICAgIC4uLm5ld0xheWVycy5yZWR1Y2UoKGFjY3UsIG5ld0xheWVyKSA9PiAobmV3TGF5ZXIuY29uZmlnLmlzVmlzaWJsZSA/IHtcbiAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgW25ld0xheWVyLmlkXTogc2V0dGluZ3MubGF5ZXJzW25ld0xheWVyLmlkXSA/IHNldHRpbmdzLmxheWVyc1tuZXdMYXllci5pZF0gOlxuICAgICAgICAgIGdlbmVyYXRlTGF5ZXJNZXRhRm9yU3BsaXRWaWV3cyhuZXdMYXllcilcbiAgICAgIH0gOiBhY2N1KSwge30pXG4gICAgfVxuICB9KSk7XG59XG5cbi8qKlxuICogSGlkZSBhbiBleGlzdGluZyBsYXllcnMgZnJvbSBjdXN0b20gbWFwIGxheWVyIG9iamVjdHNcbiAqIEBwYXJhbSBzdGF0ZVxuICogQHBhcmFtIGxheWVyXG4gKiBAcmV0dXJucyB7WyosKl19IE1hcHMgb2YgY3VzdG9tIGxheWVyIG9iamVjdHNcbiAqL1xuZnVuY3Rpb24gdG9nZ2xlTGF5ZXJGcm9tU3BsaXRNYXBzKHN0YXRlLCBsYXllcikge1xuICByZXR1cm4gc3RhdGUuc3BsaXRNYXBzLm1hcChzZXR0aW5ncyA9PiB7XG4gICAgY29uc3Qge2xheWVyc30gPSBzZXR0aW5ncztcbiAgICBjb25zdCBuZXdMYXllcnMgPSB7XG4gICAgICAuLi5sYXllcnMsXG4gICAgICBbbGF5ZXIuaWRdOiBnZW5lcmF0ZUxheWVyTWV0YUZvclNwbGl0Vmlld3MobGF5ZXIpXG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi5zZXR0aW5ncyxcbiAgICAgIGxheWVyczogbmV3TGF5ZXJzXG4gICAgfTtcbiAgfSk7XG59XG5cbi8qKlxuICogV2hlbiBhIHVzZXIgY2xpY2tzIG9uIHRoZSBzcGVjaWZpYyBtYXAgY2xvc2luZyBpY29uXG4gKiB0aGUgYXBwbGljYXRpb24gd2lsbCBjbG9zZSB0aGUgc2VsZWN0ZWQgbWFwXG4gKiBhbmQgd2lsbCBtZXJnZSB0aGUgcmVtYWluaW5nIG9uZSB3aXRoIHRoZSBnbG9iYWwgc3RhdGVcbiAqIFRPRE86IGkgdGhpbmsgaW4gdGhlIGZ1dHVyZSB0aGlzIGFjdGlvbiBzaG91bGQgYmUgY2FsbGVkIG1lcmdlIG1hcCBsYXllcnMgd2l0aCBnbG9iYWwgc2V0dGluZ3NcbiAqIEBwYXJhbSBzdGF0ZVxuICogQHBhcmFtIGFjdGlvblxuICogQHJldHVybnMgeyp9XG4gKi9cbmZ1bmN0aW9uIGNsb3NlU3BlY2lmaWNNYXBBdEluZGV4KHN0YXRlLCBhY3Rpb24pIHtcbiAgLy8gcmV0cmlldmUgbGF5ZXJzIG1ldGEgZGF0YSBmcm9tIHRoZSByZW1haW5pbmcgbWFwIHRoYXQgd2UgbmVlZCB0byBrZWVwXG4gIGNvbnN0IGluZGV4VG9SZXRyaWV2ZSA9IDEgLSBhY3Rpb24ucGF5bG9hZDtcblxuICBjb25zdCBtZXRhU2V0dGluZ3MgPSBzdGF0ZS5zcGxpdE1hcHNbaW5kZXhUb1JldHJpZXZlXTtcbiAgaWYgKCFtZXRhU2V0dGluZ3MgfHwgIW1ldGFTZXR0aW5ncy5sYXllcnMpIHtcbiAgICAvLyBpZiB3ZSBjYW4ndCBmaW5kIHRoZSBtZXRhIHNldHRpbmdzIHdlIHNpbXBseSBjbGVhbiB1cCBzcGxpdE1hcHMgYW5kXG4gICAgLy8ga2VlcCBnbG9iYWwgc3RhdGUgYXMgaXQgaXNcbiAgICAvLyBidXQgd2h5IGRvZXMgdGhpcyBldmVyIGhhcHBlbj9cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBzcGxpdE1hcHM6IFtdXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IHtsYXllcnN9ID0gc3RhdGU7XG5cbiAgLy8gdXBkYXRlIGxheWVyIHZpc2liaWxpdHlcbiAgY29uc3QgbmV3TGF5ZXJzID0gbGF5ZXJzLm1hcChsYXllciA9PlxuICAgIGxheWVyLnVwZGF0ZUxheWVyQ29uZmlnKHtpc1Zpc2libGU6IG1ldGFTZXR0aW5ncy5sYXllcnNbbGF5ZXIuaWRdID9cbiAgICAgIG1ldGFTZXR0aW5ncy5sYXllcnNbbGF5ZXIuaWRdLmlzVmlzaWJsZSA6IGxheWVyLmNvbmZpZy5pc1Zpc2libGV9KVxuICApO1xuXG4gIC8vIGRlbGV0ZSBtYXBcbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBsYXllcnM6IG5ld0xheWVycyxcbiAgICBzcGxpdE1hcHM6IFtdXG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBvbkZpbGVVcGxvYWQgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCB7ZmlsZXN9ID0gYWN0aW9uO1xuICBjb25zdCBmaWxlc1RvTG9hZCA9IGZpbGVzLm1hcChmaWxlQmxvYiA9PiAoe1xuICAgIGZpbGVCbG9iLFxuICAgIGluZm86IHtcbiAgICAgIGlkOiBnZW5lcmF0ZUhhc2hJZCg0KSxcbiAgICAgIGxhYmVsOiBmaWxlQmxvYi5uYW1lLFxuICAgICAgc2l6ZTogZmlsZUJsb2Iuc2l6ZVxuICAgIH0sXG4gICAgaGFuZGxlcjogZ2V0RmlsZUhhbmRsZXIoZmlsZUJsb2IpXG4gIH0pKTtcblxuICAvLyByZWFkZXIgLT4gcGFyc2VyIC0+IGF1Z21lbnQgLT4gcmVjZWl2ZVZpc0RhdGFcbiAgY29uc3QgbG9hZEZpbGVUYXNrcyA9IFtcbiAgICBUYXNrLmFsbChcbiAgICAgIGZpbGVzVG9Mb2FkLm1hcChMT0FEX0ZJTEVfVEFTSylcbiAgICApLmJpbWFwKFxuICAgICAgcmVzdWx0cyA9PiB1cGRhdGVWaXNEYXRhKHJlc3VsdHMsIHtjZW50ZXJNYXA6IHRydWV9KSxcbiAgICAgIGVycm9yID0+IGxvYWRGaWxlc0VycihlcnJvcilcbiAgICApXG4gIF07XG5cbiAgcmV0dXJuIHdpdGhUYXNrKFxuICAgIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgZmlsZUxvYWRpbmc6IHRydWVcbiAgICB9LFxuICAgIGxvYWRGaWxlVGFza3NcbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBvbkZpbGVVcGxvYWRFcnJvciA9IChzdGF0ZSwge2Vycm9yfSkgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGZpbGVMb2FkaW5nOiBmYWxzZSxcbiAgZmlsZUxvYWRpbmdFcnI6IGVycm9yXG59KTtcblxuLyoqXG4gKiBoZWxwZXIgZnVuY3Rpb24gdG8gdXBkYXRlIEFsbCBsYXllciBkb21haW4gYW5kIGxheWVyIGRhdGEgb2Ygc3RhdGVcbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gc3RhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhc2V0c1xuICogQHJldHVybnMge29iamVjdH0gc3RhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZERlZmF1bHRMYXllcnMoc3RhdGUsIGRhdGFzZXRzKSB7XG4gIGNvbnN0IGRlZmF1bHRMYXllcnMgPSBPYmplY3QudmFsdWVzKGRhdGFzZXRzKS5yZWR1Y2UoKGFjY3UsIGRhdGFzZXQpID0+IChbXG4gICAgLi4uYWNjdSxcbiAgICAuLi4oZmluZERlZmF1bHRMYXllcihkYXRhc2V0KSB8fCBbXSlcbiAgXSksIFtdKTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGxheWVyczogWy4uLnN0YXRlLmxheWVycywgLi4uZGVmYXVsdExheWVyc10sXG4gICAgbGF5ZXJPcmRlcjogW1xuICAgICAgLy8gcHV0IG5ldyBsYXllcnMgb24gdG9wIG9mIG9sZCBvbmVzXG4gICAgICAuLi5kZWZhdWx0TGF5ZXJzLm1hcCgoXywgaSkgPT4gc3RhdGUubGF5ZXJzLmxlbmd0aCArIGkpLFxuICAgICAgLi4uc3RhdGUubGF5ZXJPcmRlclxuICAgIF1cbiAgfTtcbn1cblxuLyoqXG4gKiBoZWxwZXIgZnVuY3Rpb24gdG8gZmluZCBkZWZhdWx0IHRvb2x0aXBzXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHN0YXRlXG4gKiBAcGFyYW0ge29iamVjdH0gZGF0YXNldFxuICogQHJldHVybnMge29iamVjdH0gc3RhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZERlZmF1bHRUb29sdGlwcyhzdGF0ZSwgZGF0YXNldCkge1xuICBjb25zdCB0b29sdGlwRmllbGRzID0gZmluZEZpZWxkc1RvU2hvdyhkYXRhc2V0KTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGludGVyYWN0aW9uQ29uZmlnOiB7XG4gICAgICAuLi5zdGF0ZS5pbnRlcmFjdGlvbkNvbmZpZyxcbiAgICAgIHRvb2x0aXA6IHtcbiAgICAgICAgLi4uc3RhdGUuaW50ZXJhY3Rpb25Db25maWcudG9vbHRpcCxcbiAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgLy8gZmluZCBkZWZhdWx0IGZpZWxkcyB0byBzaG93IGluIHRvb2x0aXBcbiAgICAgICAgICBmaWVsZHNUb1Nob3c6IHtcbiAgICAgICAgICAgIC4uLnN0YXRlLmludGVyYWN0aW9uQ29uZmlnLnRvb2x0aXAuY29uZmlnLmZpZWxkc1RvU2hvdyxcbiAgICAgICAgICAgIC4uLnRvb2x0aXBGaWVsZHNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogaGVscGVyIGZ1bmN0aW9uIHRvIHVwZGF0ZSBsYXllciBkb21haW5zIGZvciBhbiBhcnJheSBvZiBkYXRzZXRzXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHN0YXRlXG4gKiBAcGFyYW0ge2FycmF5IHwgc3RyaW5nfSBkYXRhSWRcbiAqIEByZXR1cm5zIHtvYmplY3R9IHN0YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVBbGxMYXllckRvbWFpbkRhdGEoc3RhdGUsIGRhdGFJZCkge1xuICBjb25zdCBkYXRhSWRzID0gdHlwZW9mIGRhdGFJZCA9PT0gJ3N0cmluZycgPyBbZGF0YUlkXSA6IGRhdGFJZDtcbiAgY29uc3QgbmV3TGF5ZXJzID0gW107XG4gIGNvbnN0IG5ld0xheWVyRGF0YXMgPSBbXTtcblxuICBzdGF0ZS5sYXllcnMuZm9yRWFjaCgob2xkTGF5ZXIsIGkpID0+IHtcbiAgICBpZiAob2xkTGF5ZXIuY29uZmlnLmRhdGFJZCAmJiBkYXRhSWRzLmluY2x1ZGVzKG9sZExheWVyLmNvbmZpZy5kYXRhSWQpKSB7XG5cbiAgICAgIGNvbnN0IG5ld0xheWVyID0gb2xkTGF5ZXIudXBkYXRlTGF5ZXJEb21haW4oc3RhdGUuZGF0YXNldHNbb2xkTGF5ZXIuY29uZmlnLmRhdGFJZF0pO1xuICAgICAgY29uc3Qge2xheWVyRGF0YSwgbGF5ZXJ9ID0gY2FsY3VsYXRlTGF5ZXJEYXRhKG5ld0xheWVyLCBzdGF0ZSwgc3RhdGUubGF5ZXJEYXRhW2ldKTtcblxuICAgICAgbmV3TGF5ZXJzLnB1c2gobGF5ZXIpO1xuICAgICAgbmV3TGF5ZXJEYXRhcy5wdXNoKGxheWVyRGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld0xheWVycy5wdXNoKG9sZExheWVyKTtcbiAgICAgIG5ld0xheWVyRGF0YXMucHVzaChzdGF0ZS5sYXllckRhdGFbaV0pO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBsYXllcnM6IG5ld0xheWVycyxcbiAgICBsYXllckRhdGE6IG5ld0xheWVyRGF0YXNcbiAgfTtcbn1cbiJdfQ==