"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateStateOnLayerVisibilityChange = updateStateOnLayerVisibilityChange;
exports.layerConfigChangeUpdater = layerConfigChangeUpdater;
exports.layerTextLabelChangeUpdater = layerTextLabelChangeUpdater;
exports.layerTypeChangeUpdater = layerTypeChangeUpdater;
exports.layerVisualChannelChangeUpdater = layerVisualChannelChangeUpdater;
exports.layerVisConfigChangeUpdater = layerVisConfigChangeUpdater;
exports.setFilterUpdater = setFilterUpdater;
exports.interactionConfigChangeUpdater = interactionConfigChangeUpdater;
exports.loadNextFileUpdater = loadNextFileUpdater;
exports.makeLoadFileTask = makeLoadFileTask;
exports.addDefaultLayers = addDefaultLayers;
exports.addDefaultTooltips = addDefaultTooltips;
exports.updateAllLayerDomainData = updateAllLayerDomainData;
exports.updateAnimationDomain = updateAnimationDomain;
exports.setFeaturesUpdater = setFeaturesUpdater;
exports.deleteFeatureUpdater = deleteFeatureUpdater;
exports.setPolygonFilterLayerUpdater = setPolygonFilterLayerUpdater;
exports.sortTableColumnUpdater = sortTableColumnUpdater;
exports.pinTableColumnUpdater = pinTableColumnUpdater;
exports.copyTableColumnUpdater = copyTableColumnUpdater;
exports.toggleEditorVisibilityUpdater = toggleEditorVisibilityUpdater;
exports.setSelectedFeatureUpdater = exports.setEditorModeUpdater = exports.setMapInfoUpdater = exports.applyCPUFilterUpdater = exports.loadFilesErrUpdater = exports.loadFilesUpdater = exports.updateVisDataUpdater = exports.toggleLayerForMapUpdater = exports.toggleSplitMapUpdater = exports.mouseMoveUpdater = exports.mapClickUpdater = exports.layerClickUpdater = exports.layerHoverUpdater = exports.receiveMapConfigUpdater = exports.resetMapConfigUpdater = exports.showDatasetTableUpdater = exports.updateLayerBlendingUpdater = exports.removeDatasetUpdater = exports.reorderLayerUpdater = exports.removeLayerUpdater = exports.addLayerUpdater = exports.removeFilterUpdater = exports.toggleFilterFeatureUpdater = exports.enlargeFilterUpdater = exports.updateLayerAnimationSpeedUpdater = exports.updateAnimationTimeUpdater = exports.updateFilterAnimationSpeedUpdater = exports.toggleFilterAnimationUpdater = exports.layerColorUIChangeUpdater = exports.addFilterUpdater = exports.setFilterPlotUpdater = exports.INITIAL_VIS_STATE = exports.DEFAULT_EDITOR = exports.DEFAULT_ANIMATION_CONFIG = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _toArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _window = require("global/window");

var _tasks = require("react-palm/tasks");

var _lodash = _interopRequireDefault(require("lodash.clonedeep"));

var _lodash2 = _interopRequireDefault(require("lodash.uniq"));

var _lodash3 = _interopRequireDefault(require("lodash.get"));

var _lodash4 = _interopRequireDefault(require("lodash.xor"));

var _copyToClipboard = _interopRequireDefault(require("copy-to-clipboard"));

var _dataUtils = require("../utils/data-utils");

var _tasks2 = require("../tasks/tasks");

var _visStateActions = require("../actions/vis-state-actions");

var _interactionUtils = require("../utils/interaction-utils");

var _filterUtils = require("../utils/filter-utils");

var _gpuFilterUtils = require("../utils/gpu-filter-utils");

var _datasetUtils = require("../utils/dataset-utils");

var _utils = require("../utils/utils");

var _layerUtils = require("../utils/layer-utils/layer-utils");

var _visStateMerger = require("./vis-state-merger");

var _splitMapUtils = require("../utils/split-map-utils");

var _layers = require("../layers");

var _layerFactory = require("../layers/layer-factory");

var _defaultSettings = require("../constants/default-settings");

function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return (0, _typeof2["default"])(key) === "symbol" ? key : String(key); }

function _toPrimitive(input, hint) { if ((0, _typeof2["default"])(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if ((0, _typeof2["default"])(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// type imports

/** @typedef {import('./vis-state-updaters').Field} Field */

/** @typedef {import('./vis-state-updaters').Filter} Filter */

/** @typedef {import('./vis-state-updaters').Dataset} Dataset */

/** @typedef {import('./vis-state-updaters').VisState} VisState */

/** @typedef {import('./vis-state-updaters').Datasets} Datasets */

/** @typedef {import('./vis-state-updaters').AnimationConfig} AnimationConfig */

/** @typedef {import('./vis-state-updaters').Editor} Editor */
// react-palm
// disable capture exception for react-palm call to withTask
(0, _tasks.disableStackCapturing)();
/**
 * Updaters for `visState` reducer. Can be used in your root reducer to directly modify kepler.gl's state.
 * Read more about [Using updaters](../advanced-usage/using-updaters.md)
 *
 * @public
 * @example
 *
 * import keplerGlReducer, {visStateUpdaters} from 'kepler.gl/reducers';
 * // Root Reducer
 * const reducers = combineReducers({
 *  keplerGl: keplerGlReducer,
 *  app: appReducer
 * });
 *
 * const composedReducer = (state, action) => {
 *  switch (action.type) {
 *    case 'CLICK_BUTTON':
 *      return {
 *        ...state,
 *        keplerGl: {
 *          ...state.keplerGl,
 *          foo: {
 *             ...state.keplerGl.foo,
 *             visState: visStateUpdaters.enlargeFilterUpdater(
 *               state.keplerGl.foo.visState,
 *               {idx: 0}
 *             )
 *          }
 *        }
 *      };
 *  }
 *  return reducers(state, action);
 * };
 *
 * export default composedReducer;
 */

/* eslint-disable no-unused-vars */
// @ts-ignore

var visStateUpdaters = null;
/* eslint-enable no-unused-vars */

/** @type {AnimationConfig} */

var DEFAULT_ANIMATION_CONFIG = {
  domain: null,
  currentTime: null,
  speed: 1
};
/** @type {Editor} */

exports.DEFAULT_ANIMATION_CONFIG = DEFAULT_ANIMATION_CONFIG;
var DEFAULT_EDITOR = {
  mode: _defaultSettings.EDITOR_MODES.DRAW_POLYGON,
  features: [],
  selectedFeature: null,
  visible: true
};
/**
 * Default initial `visState`
 * @memberof visStateUpdaters
 * @constant
 * @type {VisState}
 * @public
 */

exports.DEFAULT_EDITOR = DEFAULT_EDITOR;
var INITIAL_VIS_STATE = {
  // map info
  mapInfo: {
    title: '',
    description: ''
  },
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
  mousePos: {},
  // this is used when user split maps
  splitMaps: [// this will contain a list of objects to
    // describe the state of layer availability and visibility for each map
    // [
    //   {
    //      layers: {layer_id: true | false}
    //   }
    // ]
  ],
  //
  // defaults layer classes
  layerClasses: _layers.LayerClasses,
  // default animation
  // time in unix timestamp (milliseconds) (the number of seconds since the Unix Epoch)
  animationConfig: DEFAULT_ANIMATION_CONFIG,
  editor: DEFAULT_EDITOR
};
/**
 * Update state with updated layer and layerData
 * @type {typeof import('./vis-state-updaters').updateStateWithLayerAndData}
 *
 */

exports.INITIAL_VIS_STATE = INITIAL_VIS_STATE;

function updateStateWithLayerAndData(state, _ref) {
  var layerData = _ref.layerData,
      layer = _ref.layer,
      idx = _ref.idx;
  return _objectSpread({}, state, {
    layers: state.layers.map(function (lyr, i) {
      return i === idx ? layer : lyr;
    }),
    layerData: layerData ? state.layerData.map(function (d, i) {
      return i === idx ? layerData : d;
    }) : state.layerData
  });
}

function updateStateOnLayerVisibilityChange(state, layer) {
  var newState = state;

  if (state.splitMaps.length) {
    newState = _objectSpread({}, state, {
      splitMaps: layer.config.isVisible ? (0, _splitMapUtils.addNewLayersToSplitMap)(state.splitMaps, layer) : (0, _splitMapUtils.removeLayerFromSplitMaps)(state.splitMaps, layer)
    });
  }

  if (layer.config.animation.enabled) {
    newState = updateAnimationDomain(state);
  }

  return newState;
}
/**
 * Update layer base config: dataId, label, column, isVisible
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').layerConfigChangeUpdater}
 * @returns nextState
 */


function layerConfigChangeUpdater(state, action) {
  var oldLayer = action.oldLayer;
  var idx = state.layers.findIndex(function (l) {
    return l.id === oldLayer.id;
  });
  var props = Object.keys(action.newConfig);
  var newLayer = oldLayer.updateLayerConfig(action.newConfig);
  var layerData; // let newLayer;

  if (newLayer.shouldCalculateLayerData(props)) {
    var oldLayerData = state.layerData[idx];
    var updateLayerDataResult = (0, _layerUtils.calculateLayerData)(newLayer, state, oldLayerData);
    layerData = updateLayerDataResult.layerData;
    newLayer = updateLayerDataResult.layer;
  }

  var newState = state;

  if ('isVisible' in action.newConfig) {
    newState = updateStateOnLayerVisibilityChange(state, newLayer);
  }

  return updateStateWithLayerAndData(newState, {
    layer: newLayer,
    layerData: layerData,
    idx: idx
  });
}

function addOrRemoveTextLabels(newFields, textLabel) {
  var newTextLabel = textLabel.slice();
  var currentFields = textLabel.map(function (tl) {
    return tl.field && tl.field.name;
  }).filter(function (d) {
    return d;
  });
  var addFields = newFields.filter(function (f) {
    return !currentFields.includes(f.name);
  });
  var deleteFields = currentFields.filter(function (f) {
    return !newFields.find(function (fd) {
      return fd.name === f;
    });
  }); // delete

  newTextLabel = newTextLabel.filter(function (tl) {
    return tl.field && !deleteFields.includes(tl.field.name);
  });
  newTextLabel = !newTextLabel.length ? [_layerFactory.DEFAULT_TEXT_LABEL] : newTextLabel; // add

  newTextLabel = [].concat((0, _toConsumableArray2["default"])(newTextLabel.filter(function (tl) {
    return tl.field;
  })), (0, _toConsumableArray2["default"])(addFields.map(function (af) {
    return _objectSpread({}, _layerFactory.DEFAULT_TEXT_LABEL, {
      field: af
    });
  })));
  return newTextLabel;
}

function updateTextLabelPropAndValue(idx, prop, value, textLabel) {
  if (!textLabel[idx].hasOwnProperty(prop)) {
    return textLabel;
  }

  var newTextLabel = textLabel.slice();

  if (prop && (value || textLabel.length === 1)) {
    newTextLabel = textLabel.map(function (tl, i) {
      return i === idx ? _objectSpread({}, tl, (0, _defineProperty2["default"])({}, prop, value)) : tl;
    });
  } else if (prop === 'field' && value === null && textLabel.length > 1) {
    // remove label when field value is set to null
    newTextLabel.splice(idx, 1);
  }

  return newTextLabel;
}
/**
 * Update layer base config: dataId, label, column, isVisible
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').layerTextLabelChangeUpdater}
 * @returns nextState
 */


function layerTextLabelChangeUpdater(state, action) {
  var oldLayer = action.oldLayer,
      idx = action.idx,
      prop = action.prop,
      value = action.value;
  var textLabel = oldLayer.config.textLabel;
  var newTextLabel = textLabel.slice();

  if (!textLabel[idx] && idx === textLabel.length) {
    // if idx is set to length, add empty text label
    newTextLabel = [].concat((0, _toConsumableArray2["default"])(textLabel), [_layerFactory.DEFAULT_TEXT_LABEL]);
  }

  if (idx === 'all' && prop === 'fields') {
    newTextLabel = addOrRemoveTextLabels(value, textLabel);
  } else {
    newTextLabel = updateTextLabelPropAndValue(idx, prop, value, newTextLabel);
  } // update text label prop and value


  return layerConfigChangeUpdater(state, {
    oldLayer: oldLayer,
    newConfig: {
      textLabel: newTextLabel
    }
  });
}
/**
 * Update layer type. Previews layer config will be copied if applicable.
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').layerTypeChangeUpdater}
 * @public
 */


function layerTypeChangeUpdater(state, action) {
  var oldLayer = action.oldLayer,
      newType = action.newType;

  if (!oldLayer) {
    return state;
  }

  var oldId = oldLayer.id;
  var idx = state.layers.findIndex(function (l) {
    return l.id === oldId;
  });

  if (!state.layerClasses[newType]) {
    _window.console.error("".concat(newType, " is not a valid layer type"));

    return state;
  } // get a mint layer, with new id and type
  // because deck.gl uses id to match between new and old layer.
  // If type has changed but id is the same, it will break


  var newLayer = new state.layerClasses[newType]();
  newLayer.assignConfigToLayer(oldLayer.config, oldLayer.visConfigSettings); // if (newLayer.config.dataId) {
  //   const dataset = state.datasets[newLayer.config.dataId];
  //   newLayer.updateLayerDomain(dataset);
  // }

  newLayer.updateLayerDomain(state.datasets);

  var _calculateLayerData = (0, _layerUtils.calculateLayerData)(newLayer, state),
      layerData = _calculateLayerData.layerData,
      layer = _calculateLayerData.layer;

  var newState = updateStateWithLayerAndData(state, {
    layerData: layerData,
    layer: layer,
    idx: idx
  });

  if (layer.config.animation.enabled || oldLayer.config.animation.enabled) {
    newState = updateAnimationDomain(newState);
  } // update splitMap layer id


  if (state.splitMaps.length) {
    newState = _objectSpread({}, newState, {
      splitMaps: newState.splitMaps.map(function (settings) {
        var _settings$layers = settings.layers,
            oldLayerMap = _settings$layers[oldId],
            otherLayers = (0, _objectWithoutProperties2["default"])(_settings$layers, [oldId].map(_toPropertyKey));
        return oldId in settings.layers ? _objectSpread({}, settings, {
          layers: _objectSpread({}, otherLayers, (0, _defineProperty2["default"])({}, layer.id, oldLayerMap))
        }) : settings;
      })
    });
  }

  return newState;
}
/**
 * Update layer visual channel
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').layerVisualChannelChangeUpdater}
 * @returns {Object} nextState
 * @public
 */


function layerVisualChannelChangeUpdater(state, action) {
  var oldLayer = action.oldLayer,
      newConfig = action.newConfig,
      channel = action.channel;

  if (!oldLayer.config.dataId) {
    return state;
  }

  var dataset = state.datasets[oldLayer.config.dataId];
  var idx = state.layers.findIndex(function (l) {
    return l.id === oldLayer.id;
  });
  var newLayer = oldLayer.updateLayerConfig(newConfig);
  newLayer.updateLayerVisualChannel(dataset, channel);
  var oldLayerData = state.layerData[idx];

  var _calculateLayerData2 = (0, _layerUtils.calculateLayerData)(newLayer, state, oldLayerData),
      layerData = _calculateLayerData2.layerData,
      layer = _calculateLayerData2.layer;

  return updateStateWithLayerAndData(state, {
    layerData: layerData,
    layer: layer,
    idx: idx
  });
}
/**
 * Update layer `visConfig`
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').layerVisConfigChangeUpdater}
 * @public
 */


function layerVisConfigChangeUpdater(state, action) {
  var oldLayer = action.oldLayer;
  var idx = state.layers.findIndex(function (l) {
    return l.id === oldLayer.id;
  });
  var props = Object.keys(action.newVisConfig);

  var newVisConfig = _objectSpread({}, oldLayer.config.visConfig, {}, action.newVisConfig);

  var newLayer = oldLayer.updateLayerConfig({
    visConfig: newVisConfig
  });

  if (newLayer.shouldCalculateLayerData(props)) {
    var oldLayerData = state.layerData[idx];

    var _calculateLayerData3 = (0, _layerUtils.calculateLayerData)(newLayer, state, oldLayerData),
        layerData = _calculateLayerData3.layerData,
        layer = _calculateLayerData3.layer;

    return updateStateWithLayerAndData(state, {
      layerData: layerData,
      layer: layer,
      idx: idx
    });
  }

  return updateStateWithLayerAndData(state, {
    layer: newLayer,
    idx: idx
  });
}
/**
 * Update filter property
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').setFilterUpdater}
 * @public
 */


function setFilterUpdater(state, action) {
  var idx = action.idx,
      prop = action.prop,
      value = action.value,
      _action$valueIndex = action.valueIndex,
      valueIndex = _action$valueIndex === void 0 ? 0 : _action$valueIndex;
  var oldFilter = state.filters[idx];
  var newFilter = (0, _utils.set)([prop], value, oldFilter);
  var newState = state;
  var _newFilter = newFilter,
      dataId = _newFilter.dataId; // Ensuring backward compatibility

  var datasetIds = (0, _utils.toArray)(dataId);

  switch (prop) {
    // TODO: Next PR for UI if we update dataId, we need to consider two cases:
    // 1. dataId is empty: create a default filter
    // 2. Add a new dataset id
    case _filterUtils.FILTER_UPDATER_PROPS.dataId:
      // if trying to update filter dataId. create an empty new filter
      newFilter = (0, _filterUtils.updateFilterDataId)(dataId);
      break;

    case _filterUtils.FILTER_UPDATER_PROPS.name:
      // we are supporting the current functionality
      // TODO: Next PR for UI filter name will only update filter name but it won't have side effects
      // we are gonna use pair of datasets and fieldIdx to update the filter
      var datasetId = newFilter.dataId[valueIndex];

      var _applyFilterFieldName = (0, _filterUtils.applyFilterFieldName)(newFilter, state.datasets[datasetId], value, valueIndex, {
        mergeDomain: false
      }),
          updatedFilter = _applyFilterFieldName.filter,
          newDataset = _applyFilterFieldName.dataset;

      if (!updatedFilter) {
        return state;
      }

      newFilter = updatedFilter;

      if (newFilter.gpu) {
        newFilter = (0, _gpuFilterUtils.setFilterGpuMode)(newFilter, state.filters);
        newFilter = (0, _gpuFilterUtils.assignGpuChannel)(newFilter, state.filters);
      }

      newState = (0, _utils.set)(['datasets', datasetId], newDataset, state); // only filter the current dataset

      break;

    case _filterUtils.FILTER_UPDATER_PROPS.layerId:
      // We need to update only datasetId/s if we have added/removed layers
      // - check for layerId changes (XOR works because of string values)
      // if no differences between layerIds, don't do any filtering
      // @ts-ignore
      var layerIdDifference = (0, _lodash4["default"])(newFilter.layerId, oldFilter.layerId);
      var layerDataIds = (0, _lodash2["default"])(layerIdDifference.map(function (lid) {
        return (0, _lodash3["default"])(state.layers.find(function (l) {
          return l.id === lid;
        }), ['config', 'dataId']);
      }).filter(function (d) {
        return d;
      })); // only filter datasetsIds

      datasetIds = layerDataIds; // Update newFilter dataIds

      var newDataIds = (0, _lodash2["default"])(newFilter.layerId.map(function (lid) {
        return (0, _lodash3["default"])(state.layers.find(function (l) {
          return l.id === lid;
        }), ['config', 'dataId']);
      }).filter(function (d) {
        return d;
      }));
      newFilter = _objectSpread({}, newFilter, {
        dataId: newDataIds
      });
      break;

    default:
      break;
  }

  var enlargedFilter = state.filters.find(function (f) {
    return f.enlarged;
  });

  if (enlargedFilter && enlargedFilter.id !== newFilter.id) {
    // there should be only one enlarged filter
    newFilter.enlarged = false;
  } // save new filters to newState


  newState = (0, _utils.set)(['filters', idx], newFilter, newState); // if we are currently setting a prop that only requires to filter the current
  // dataset we will pass only the current dataset to applyFiltersToDatasets and
  // updateAllLayerDomainData otherwise we pass the all list of datasets as defined in dataId

  var datasetIdsToFilter = _filterUtils.LIMITED_FILTER_EFFECT_PROPS[prop] ? [datasetIds[valueIndex]] : datasetIds; // filter data

  var filteredDatasets = (0, _filterUtils.applyFiltersToDatasets)(datasetIdsToFilter, newState.datasets, newState.filters, newState.layers);
  newState = (0, _utils.set)(['datasets'], filteredDatasets, newState); // dataId is an array
  // pass only the dataset we need to update

  newState = updateAllLayerDomainData(newState, datasetIdsToFilter, newFilter);
  return newState;
}
/**
 * Set the property of a filter plot
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').setFilterPlotUpdater}
 * @public
 */


var setFilterPlotUpdater = function setFilterPlotUpdater(state, _ref2) {
  var idx = _ref2.idx,
      newProp = _ref2.newProp,
      _ref2$valueIndex = _ref2.valueIndex,
      valueIndex = _ref2$valueIndex === void 0 ? 0 : _ref2$valueIndex;

  var newFilter = _objectSpread({}, state.filters[idx], {}, newProp);

  var prop = Object.keys(newProp)[0];

  if (prop === 'yAxis') {
    var plotType = (0, _filterUtils.getDefaultFilterPlotType)(newFilter); // TODO: plot is not supported in multi dataset filter for now

    if (plotType) {
      newFilter = _objectSpread({}, newFilter, {}, (0, _filterUtils.getFilterPlot)(_objectSpread({}, newFilter, {
        plotType: plotType
      }), state.datasets[newFilter.dataId[valueIndex]].allData), {
        plotType: plotType
      });
    }
  }

  return _objectSpread({}, state, {
    filters: state.filters.map(function (f, i) {
      return i === idx ? newFilter : f;
    })
  });
};
/**
 * Add a new filter
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').addFilterUpdater}
 * @public
 */


exports.setFilterPlotUpdater = setFilterPlotUpdater;

var addFilterUpdater = function addFilterUpdater(state, action) {
  return !action.dataId ? state : _objectSpread({}, state, {
    filters: [].concat((0, _toConsumableArray2["default"])(state.filters), [(0, _filterUtils.getDefaultFilter)(action.dataId)])
  });
};
/**
 * Set layer color palette ui state
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').layerColorUIChangeUpdater}
 */


exports.addFilterUpdater = addFilterUpdater;

var layerColorUIChangeUpdater = function layerColorUIChangeUpdater(state, _ref3) {
  var oldLayer = _ref3.oldLayer,
      prop = _ref3.prop,
      newConfig = _ref3.newConfig;
  var newLayer = oldLayer.updateLayerColorUI(prop, newConfig);
  return _objectSpread({}, state, {
    layers: state.layers.map(function (l) {
      return l.id === oldLayer.id ? newLayer : l;
    })
  });
};
/**
 * Start and end filter animation
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').toggleFilterAnimationUpdater}
 * @public
 */


exports.layerColorUIChangeUpdater = layerColorUIChangeUpdater;

var toggleFilterAnimationUpdater = function toggleFilterAnimationUpdater(state, action) {
  return _objectSpread({}, state, {
    filters: state.filters.map(function (f, i) {
      return i === action.idx ? _objectSpread({}, f, {
        isAnimating: !f.isAnimating
      }) : f;
    })
  });
};
/**
 * Change filter animation speed
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').updateFilterAnimationSpeedUpdater}
 * @public
 */


exports.toggleFilterAnimationUpdater = toggleFilterAnimationUpdater;

var updateFilterAnimationSpeedUpdater = function updateFilterAnimationSpeedUpdater(state, action) {
  return _objectSpread({}, state, {
    filters: state.filters.map(function (f, i) {
      return i === action.idx ? _objectSpread({}, f, {
        speed: action.speed
      }) : f;
    })
  });
};
/**
 * Reset animation config current time to a specified value
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').updateAnimationTimeUpdater}
 * @public
 *
 */


exports.updateFilterAnimationSpeedUpdater = updateFilterAnimationSpeedUpdater;

var updateAnimationTimeUpdater = function updateAnimationTimeUpdater(state, _ref4) {
  var value = _ref4.value;
  return _objectSpread({}, state, {
    animationConfig: _objectSpread({}, state.animationConfig, {
      currentTime: value
    })
  });
};
/**
 * Update animation speed with the vertical speed slider
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').updateLayerAnimationSpeedUpdater}
 * @public
 *
 */


exports.updateAnimationTimeUpdater = updateAnimationTimeUpdater;

var updateLayerAnimationSpeedUpdater = function updateLayerAnimationSpeedUpdater(state, _ref5) {
  var speed = _ref5.speed;
  return _objectSpread({}, state, {
    animationConfig: _objectSpread({}, state.animationConfig, {
      speed: speed
    })
  });
};
/**
 * Show larger time filter at bottom for time playback (apply to time filter only)
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').enlargeFilterUpdater}
 * @public
 */


exports.updateLayerAnimationSpeedUpdater = updateLayerAnimationSpeedUpdater;

var enlargeFilterUpdater = function enlargeFilterUpdater(state, action) {
  var isEnlarged = state.filters[action.idx].enlarged;
  return _objectSpread({}, state, {
    filters: state.filters.map(function (f, i) {
      f.enlarged = !isEnlarged && i === action.idx;
      return f;
    })
  });
};
/**
 * Toggles filter feature visibility
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').toggleFilterFeatureUpdater}
 */


exports.enlargeFilterUpdater = enlargeFilterUpdater;

var toggleFilterFeatureUpdater = function toggleFilterFeatureUpdater(state, action) {
  var filter = state.filters[action.idx];
  var isVisible = (0, _lodash3["default"])(filter, ['value', 'properties', 'isVisible']);

  var newFilter = _objectSpread({}, filter, {
    value: (0, _filterUtils.featureToFilterValue)(filter.value, filter.id, {
      isVisible: !isVisible
    })
  });

  return _objectSpread({}, state, {
    filters: Object.assign((0, _toConsumableArray2["default"])(state.filters), (0, _defineProperty2["default"])({}, action.idx, newFilter))
  });
};
/**
 * Remove a filter
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').removeFilterUpdater}
 * @public
 */


exports.toggleFilterFeatureUpdater = toggleFilterFeatureUpdater;

var removeFilterUpdater = function removeFilterUpdater(state, action) {
  var idx = action.idx;
  var _state$filters$idx = state.filters[idx],
      dataId = _state$filters$idx.dataId,
      id = _state$filters$idx.id;
  var newFilters = [].concat((0, _toConsumableArray2["default"])(state.filters.slice(0, idx)), (0, _toConsumableArray2["default"])(state.filters.slice(idx + 1, state.filters.length)));
  var filteredDatasets = (0, _filterUtils.applyFiltersToDatasets)(dataId, state.datasets, newFilters, state.layers);
  var newEditor = (0, _filterUtils.getFilterIdInFeature)(state.editor.selectedFeature) === id ? _objectSpread({}, state.editor, {
    selectedFeature: null
  }) : state.editor;
  var newState = (0, _utils.set)(['filters'], newFilters, state);
  newState = (0, _utils.set)(['datasets'], filteredDatasets, newState);
  newState = (0, _utils.set)(['editor'], newEditor, newState);
  return updateAllLayerDomainData(newState, dataId, undefined);
};
/**
 * Add a new layer
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').addLayerUpdater}
 * @public
 */


exports.removeFilterUpdater = removeFilterUpdater;

var addLayerUpdater = function addLayerUpdater(state, action) {
  var defaultDataset = Object.keys(state.datasets)[0];
  var newLayer = new _layers.Layer(_objectSpread({
    isVisible: true,
    isConfigActive: true,
    dataId: defaultDataset
  }, action.props));
  return _objectSpread({}, state, {
    layers: [].concat((0, _toConsumableArray2["default"])(state.layers), [newLayer]),
    layerData: [].concat((0, _toConsumableArray2["default"])(state.layerData), [{}]),
    layerOrder: [].concat((0, _toConsumableArray2["default"])(state.layerOrder), [state.layerOrder.length]),
    splitMaps: (0, _splitMapUtils.addNewLayersToSplitMap)(state.splitMaps, newLayer)
  });
};
/**
 * remove layer
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').removeLayerUpdater}
 * @public
 */


exports.addLayerUpdater = addLayerUpdater;

var removeLayerUpdater = function removeLayerUpdater(state, _ref6) {
  var idx = _ref6.idx;
  var layers = state.layers,
      layerData = state.layerData,
      clicked = state.clicked,
      hoverInfo = state.hoverInfo;
  var layerToRemove = state.layers[idx];
  var newMaps = (0, _splitMapUtils.removeLayerFromSplitMaps)(state.splitMaps, layerToRemove);

  var newState = _objectSpread({}, state, {
    layers: [].concat((0, _toConsumableArray2["default"])(layers.slice(0, idx)), (0, _toConsumableArray2["default"])(layers.slice(idx + 1, layers.length))),
    layerData: [].concat((0, _toConsumableArray2["default"])(layerData.slice(0, idx)), (0, _toConsumableArray2["default"])(layerData.slice(idx + 1, layerData.length))),
    layerOrder: state.layerOrder.filter(function (i) {
      return i !== idx;
    }).map(function (pid) {
      return pid > idx ? pid - 1 : pid;
    }),
    clicked: layerToRemove.isLayerHovered(clicked) ? undefined : clicked,
    hoverInfo: layerToRemove.isLayerHovered(hoverInfo) ? undefined : hoverInfo,
    splitMaps: newMaps // TODO: update filters, create helper to remove layer form filter (remove layerid and dataid) if mapped

  });

  return updateAnimationDomain(newState);
};
/**
 * Reorder layer
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').reorderLayerUpdater}
 * @public
 */


exports.removeLayerUpdater = removeLayerUpdater;

var reorderLayerUpdater = function reorderLayerUpdater(state, _ref7) {
  var order = _ref7.order;
  return _objectSpread({}, state, {
    layerOrder: order
  });
};
/**
 * Remove a dataset and all layers, filters, tooltip configs that based on it
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').removeDatasetUpdater}
 * @public
 */


exports.reorderLayerUpdater = reorderLayerUpdater;

var removeDatasetUpdater = function removeDatasetUpdater(state, action) {
  // extract dataset key
  var datasetKey = action.dataId;
  var datasets = state.datasets; // check if dataset is present

  if (!datasets[datasetKey]) {
    return state;
  }
  /* eslint-disable no-unused-vars */


  var layers = state.layers,
      _state$datasets = state.datasets,
      dataset = _state$datasets[datasetKey],
      newDatasets = (0, _objectWithoutProperties2["default"])(_state$datasets, [datasetKey].map(_toPropertyKey));
  /* eslint-enable no-unused-vars */

  var indexes = layers.reduce(function (listOfIndexes, layer, index) {
    if (layer.config.dataId === datasetKey) {
      listOfIndexes.push(index);
    }

    return listOfIndexes;
  }, []); // remove layers and datasets

  var _indexes$reduce = indexes.reduce(function (_ref8, idx) {
    var currentState = _ref8.newState,
        indexCounter = _ref8.indexCounter;
    var currentIndex = idx - indexCounter;
    currentState = removeLayerUpdater(currentState, {
      idx: currentIndex
    });
    indexCounter++;
    return {
      newState: currentState,
      indexCounter: indexCounter
    };
  }, {
    newState: _objectSpread({}, state, {
      datasets: newDatasets
    }),
    indexCounter: 0
  }),
      newState = _indexes$reduce.newState; // remove filters


  var filters = state.filters.filter(function (filter) {
    return !filter.dataId.includes(datasetKey);
  }); // update interactionConfig

  var interactionConfig = state.interactionConfig;
  var _interactionConfig = interactionConfig,
      tooltip = _interactionConfig.tooltip;

  if (tooltip) {
    var config = tooltip.config;
    /* eslint-disable no-unused-vars */

    var _config$fieldsToShow = config.fieldsToShow,
        fields = _config$fieldsToShow[datasetKey],
        fieldsToShow = (0, _objectWithoutProperties2["default"])(_config$fieldsToShow, [datasetKey].map(_toPropertyKey));
    /* eslint-enable no-unused-vars */

    interactionConfig = _objectSpread({}, interactionConfig, {
      tooltip: _objectSpread({}, tooltip, {
        config: _objectSpread({}, config, {
          fieldsToShow: fieldsToShow
        })
      })
    });
  }

  return _objectSpread({}, newState, {
    filters: filters,
    interactionConfig: interactionConfig
  });
};
/**
 * update layer blending mode
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').updateLayerBlendingUpdater}
 * @public
 */


exports.removeDatasetUpdater = removeDatasetUpdater;

var updateLayerBlendingUpdater = function updateLayerBlendingUpdater(state, action) {
  return _objectSpread({}, state, {
    layerBlending: action.mode
  });
};
/**
 * Display dataset table in a modal
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').showDatasetTableUpdater}
 * @public
 */


exports.updateLayerBlendingUpdater = updateLayerBlendingUpdater;

var showDatasetTableUpdater = function showDatasetTableUpdater(state, action) {
  return _objectSpread({}, state, {
    editingDataset: action.dataId
  });
};
/**
 * reset visState to initial State
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').resetMapConfigUpdater}
 * @public
 */


exports.showDatasetTableUpdater = showDatasetTableUpdater;

var resetMapConfigUpdater = function resetMapConfigUpdater(state) {
  return _objectSpread({}, INITIAL_VIS_STATE, {}, state.initialState, {
    initialState: state.initialState
  });
};
/**
 * Propagate `visState` reducer with a new configuration. Current config will be override.
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').receiveMapConfigUpdater}
 * @public
 */


exports.resetMapConfigUpdater = resetMapConfigUpdater;

var receiveMapConfigUpdater = function receiveMapConfigUpdater(state, _ref9) {
  var _ref9$payload = _ref9.payload,
      _ref9$payload$config = _ref9$payload.config,
      config = _ref9$payload$config === void 0 ? {} : _ref9$payload$config,
      _ref9$payload$options = _ref9$payload.options,
      options = _ref9$payload$options === void 0 ? {} : _ref9$payload$options;

  if (!config.visState) {
    return state;
  }

  var _config$visState = config.visState,
      filters = _config$visState.filters,
      layers = _config$visState.layers,
      interactionConfig = _config$visState.interactionConfig,
      layerBlending = _config$visState.layerBlending,
      splitMaps = _config$visState.splitMaps,
      animationConfig = _config$visState.animationConfig;
  var keepExistingConfig = options.keepExistingConfig; // reset config if keepExistingConfig is falsy

  var mergedState = !keepExistingConfig ? resetMapConfigUpdater(state) : state;
  mergedState = (0, _visStateMerger.mergeLayers)(mergedState, layers);
  mergedState = (0, _visStateMerger.mergeFilters)(mergedState, filters);
  mergedState = (0, _visStateMerger.mergeInteractions)(mergedState, interactionConfig);
  mergedState = (0, _visStateMerger.mergeLayerBlending)(mergedState, layerBlending);
  mergedState = (0, _visStateMerger.mergeSplitMaps)(mergedState, splitMaps);
  mergedState = (0, _visStateMerger.mergeAnimationConfig)(mergedState, animationConfig);
  return mergedState;
};
/**
 * Trigger layer hover event with hovered object
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').layerHoverUpdater}
 * @public
 */


exports.receiveMapConfigUpdater = receiveMapConfigUpdater;

var layerHoverUpdater = function layerHoverUpdater(state, action) {
  return _objectSpread({}, state, {
    hoverInfo: action.info
  });
};
/* eslint-enable max-statements */

/**
 * Update `interactionConfig`
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').interactionConfigChangeUpdater}
 * @public
 */


exports.layerHoverUpdater = layerHoverUpdater;

function interactionConfigChangeUpdater(state, action) {
  var config = action.config;

  var interactionConfig = _objectSpread({}, state.interactionConfig, {}, (0, _defineProperty2["default"])({}, config.id, config)); // Don't enable tooltip and brush at the same time
  // but coordinates can be shown at all time


  var contradict = ['brush', 'tooltip'];

  if (contradict.includes(config.id) && config.enabled && !state.interactionConfig[config.id].enabled) {
    // only enable one interaction at a time
    contradict.forEach(function (k) {
      if (k !== config.id) {
        interactionConfig[k] = _objectSpread({}, interactionConfig[k], {
          enabled: false
        });
      }
    });
  }

  var newState = _objectSpread({}, state, {
    interactionConfig: interactionConfig
  });

  if (config.id === 'geocoder' && !config.enabled) {
    return removeDatasetUpdater(newState, {
      dataId: 'geocoder_dataset'
    });
  }

  return newState;
}
/**
 * Trigger layer click event with clicked object
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').layerClickUpdater}
 * @public
 */


var layerClickUpdater = function layerClickUpdater(state, action) {
  return _objectSpread({}, state, {
    mousePos: state.interactionConfig.coordinate.enabled ? _objectSpread({}, state.mousePos, {
      pinned: state.mousePos.pinned ? null : (0, _lodash["default"])(state.mousePos)
    }) : state.mousePos,
    clicked: action.info && action.info.picked ? action.info : null
  });
};
/**
 * Trigger map click event, unselect clicked object
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').mapClickUpdater}
 * @public
 */


exports.layerClickUpdater = layerClickUpdater;

var mapClickUpdater = function mapClickUpdater(state) {
  return _objectSpread({}, state, {
    clicked: null
  });
};
/**
 * Trigger map move event
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').mouseMoveUpdater}
 * @public
 */


exports.mapClickUpdater = mapClickUpdater;

var mouseMoveUpdater = function mouseMoveUpdater(state, _ref10) {
  var evt = _ref10.evt;

  if (Object.values(state.interactionConfig).some(function (config) {
    return config.enabled;
  })) {
    return _objectSpread({}, state, {
      mousePos: _objectSpread({}, state.mousePos, {
        mousePosition: (0, _toConsumableArray2["default"])(evt.point),
        coordinate: (0, _toConsumableArray2["default"])(evt.lngLat)
      })
    });
  }

  return state;
};
/**
 * Toggle visibility of a layer for a split map
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').toggleSplitMapUpdater}
 * @public
 */


exports.mouseMoveUpdater = mouseMoveUpdater;

var toggleSplitMapUpdater = function toggleSplitMapUpdater(state, action) {
  return state.splitMaps && state.splitMaps.length === 0 ? _objectSpread({}, state, {
    // maybe we should use an array to store state for a single map as well
    // if current maps length is equal to 0 it means that we are about to split the view
    splitMaps: (0, _splitMapUtils.computeSplitMapLayers)(state.layers)
  }) : closeSpecificMapAtIndex(state, action);
};
/**
 * Toggle visibility of a layer in a split map
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').toggleLayerForMapUpdater}
 * @public
 */


exports.toggleSplitMapUpdater = toggleSplitMapUpdater;

var toggleLayerForMapUpdater = function toggleLayerForMapUpdater(state, _ref11) {
  var mapIndex = _ref11.mapIndex,
      layerId = _ref11.layerId;
  var splitMaps = state.splitMaps;
  return _objectSpread({}, state, {
    splitMaps: splitMaps.map(function (sm, i) {
      return i === mapIndex ? _objectSpread({}, splitMaps[i], {
        layers: _objectSpread({}, splitMaps[i].layers, (0, _defineProperty2["default"])({}, layerId, !splitMaps[i].layers[layerId]))
      }) : sm;
    })
  });
};
/**
 * Add new dataset to `visState`, with option to load a map config along with the datasets
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').updateVisDataUpdater}
 * @public
 */

/* eslint-disable max-statements */


exports.toggleLayerForMapUpdater = toggleLayerForMapUpdater;

var updateVisDataUpdater = function updateVisDataUpdater(state, action) {
  // datasets can be a single data entries or an array of multiple data entries
  var config = action.config,
      options = action.options;
  var datasets = (0, _utils.toArray)(action.datasets);
  var newDataEntries = datasets.reduce(function (accu, _ref12) {
    var _ref12$info = _ref12.info,
        info = _ref12$info === void 0 ? {} : _ref12$info,
        data = _ref12.data;
    return _objectSpread({}, accu, {}, (0, _datasetUtils.createNewDataEntry)({
      info: info,
      data: data
    }, state.datasets) || {});
  }, {});

  if (!Object.keys(newDataEntries).length) {
    return state;
  } // apply config if passed from action


  var previousState = config ? receiveMapConfigUpdater(state, {
    payload: {
      config: config,
      options: options
    }
  }) : state;

  var stateWithNewData = _objectSpread({}, previousState, {
    datasets: _objectSpread({}, previousState.datasets, {}, newDataEntries)
  }); // previously saved config before data loaded


  var _stateWithNewData$fil = stateWithNewData.filterToBeMerged,
      filterToBeMerged = _stateWithNewData$fil === void 0 ? [] : _stateWithNewData$fil,
      _stateWithNewData$lay = stateWithNewData.layerToBeMerged,
      layerToBeMerged = _stateWithNewData$lay === void 0 ? [] : _stateWithNewData$lay,
      _stateWithNewData$int = stateWithNewData.interactionToBeMerged,
      interactionToBeMerged = _stateWithNewData$int === void 0 ? {} : _stateWithNewData$int,
      _stateWithNewData$spl = stateWithNewData.splitMapsToBeMerged,
      splitMapsToBeMerged = _stateWithNewData$spl === void 0 ? [] : _stateWithNewData$spl; // We need to merge layers before filters because polygon filters requires layers to be loaded

  var mergedState = (0, _visStateMerger.mergeLayers)(stateWithNewData, layerToBeMerged);
  mergedState = (0, _visStateMerger.mergeFilters)(mergedState, filterToBeMerged); // merge state with saved splitMaps

  mergedState = (0, _visStateMerger.mergeSplitMaps)(mergedState, splitMapsToBeMerged);
  var newLayers = mergedState.layers.filter(function (l) {
    return l.config.dataId in newDataEntries;
  });

  if (!newLayers.length) {
    // no layer merged, find defaults
    var result = addDefaultLayers(mergedState, newDataEntries);
    mergedState = result.state;
    newLayers = result.newLayers;
  }

  if (mergedState.splitMaps.length) {
    // if map is split, add new layers to splitMaps
    newLayers = mergedState.layers.filter(function (l) {
      return l.config.dataId in newDataEntries;
    });
    mergedState = _objectSpread({}, mergedState, {
      splitMaps: (0, _splitMapUtils.addNewLayersToSplitMap)(mergedState.splitMaps, newLayers)
    });
  } // merge state with saved interactions


  mergedState = (0, _visStateMerger.mergeInteractions)(mergedState, interactionToBeMerged); // if no tooltips merged add default tooltips

  Object.keys(newDataEntries).forEach(function (dataId) {
    var tooltipFields = mergedState.interactionConfig.tooltip.config.fieldsToShow[dataId];

    if (!Array.isArray(tooltipFields) || !tooltipFields.length) {
      mergedState = addDefaultTooltips(mergedState, newDataEntries[dataId]);
    }
  });
  var updatedState = updateAllLayerDomainData(mergedState, Object.keys(newDataEntries), undefined); // register layer animation domain,
  // need to be called after layer data is calculated

  updatedState = updateAnimationDomain(updatedState);
  return updatedState;
};
/* eslint-enable max-statements */

/**
 * When a user clicks on the specific map closing icon
 * the application will close the selected map
 * and will merge the remaining one with the global state
 * TODO: i think in the future this action should be called merge map layers with global settings
 * @param {Object} state `visState`
 * @param {Object} action action
 * @returns {Object} nextState
 */


exports.updateVisDataUpdater = updateVisDataUpdater;

function closeSpecificMapAtIndex(state, action) {
  // retrieve layers meta data from the remaining map that we need to keep
  var indexToRetrieve = 1 - action.payload;
  var mapLayers = state.splitMaps[indexToRetrieve].layers;
  var layers = state.layers; // update layer visibility

  var newLayers = layers.map(function (layer) {
    return !mapLayers[layer.id] && layer.config.isVisible ? layer.updateLayerConfig({
      // if layer.id is not in mapLayers, it should be inVisible
      isVisible: false
    }) : layer;
  }); // delete map

  return _objectSpread({}, state, {
    layers: newLayers,
    splitMaps: []
  });
}
/**
 * Trigger file loading dispatch `addDataToMap` if succeed, or `loadFilesErr` if failed
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').loadFilesUpdater}
 * @public
 */


var loadFilesUpdater = function loadFilesUpdater(state, action) {
  var files = action.files,
      _action$onFinish = action.onFinish,
      onFinish = _action$onFinish === void 0 ? _visStateActions.loadFileSuccess : _action$onFinish;

  if (!files.length) {
    return state;
  }

  var fileCache = [];
  return (0, _tasks.withTask)(_objectSpread({}, state, {
    fileLoading: true,
    fileLoadingProgress: 0
  }), makeLoadFileTask(files.length, files, fileCache, onFinish));
};

exports.loadFilesUpdater = loadFilesUpdater;

function loadNextFileUpdater(state, action) {
  var fileCache = action.fileCache,
      filesToLoad = action.filesToLoad,
      totalCount = action.totalCount,
      onFinish = action.onFinish;
  var fileLoadingProgress = (totalCount - filesToLoad.length) / totalCount * 100;
  return (0, _tasks.withTask)(_objectSpread({}, state, {
    fileLoadingProgress: fileLoadingProgress
  }), makeLoadFileTask(totalCount, filesToLoad, fileCache, onFinish));
}

function makeLoadFileTask(totalCount, filesToLoad, fileCache, onFinish) {
  var _filesToLoad = (0, _toArray2["default"])(filesToLoad),
      file = _filesToLoad[0],
      remainingFilesToLoad = _filesToLoad.slice(1);

  return (0, _tasks2.LOAD_FILE_TASK)({
    file: file,
    fileCache: fileCache
  }).bimap( // success
  function (result) {
    return remainingFilesToLoad.length ? (0, _visStateActions.loadNextFile)({
      fileCache: result,
      filesToLoad: remainingFilesToLoad,
      totalCount: totalCount,
      onFinish: onFinish
    }) : onFinish(result);
  }, // error
  _visStateActions.loadFilesErr);
}
/**
 * Trigger loading file error
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').loadFilesErrUpdater}
 * @public
 */


var loadFilesErrUpdater = function loadFilesErrUpdater(state, _ref13) {
  var error = _ref13.error;
  return _objectSpread({}, state, {
    fileLoading: false,
    fileLoadingErr: error
  });
};
/**
 * When select dataset for export, apply cpu filter to selected dataset
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').applyCPUFilterUpdater}
 * @public
 */


exports.loadFilesErrUpdater = loadFilesErrUpdater;

var applyCPUFilterUpdater = function applyCPUFilterUpdater(state, _ref14) {
  var dataId = _ref14.dataId;
  // apply cpuFilter
  var dataIds = (0, _utils.toArray)(dataId);
  return dataIds.reduce(function (accu, id) {
    return (0, _filterUtils.filterDatasetCPU)(accu, id);
  }, state);
};
/**
 * User input to update the info of the map
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').setMapInfoUpdater}
 * @public
 */


exports.applyCPUFilterUpdater = applyCPUFilterUpdater;

var setMapInfoUpdater = function setMapInfoUpdater(state, action) {
  return _objectSpread({}, state, {
    mapInfo: _objectSpread({}, state.mapInfo, {}, action.info)
  });
};
/**
 * Helper function to update All layer domain and layer data of state
 * @type {typeof import('./vis-state-updaters').addDefaultLayers}
 */


exports.setMapInfoUpdater = setMapInfoUpdater;

function addDefaultLayers(state, datasets) {
  var defaultLayers = Object.values(datasets).reduce( // @ts-ignore
  function (accu, dataset) {
    return [].concat((0, _toConsumableArray2["default"])(accu), (0, _toConsumableArray2["default"])((0, _layerUtils.findDefaultLayer)(dataset, state.layerClasses) || []));
  }, []);
  return {
    state: _objectSpread({}, state, {
      layers: [].concat((0, _toConsumableArray2["default"])(state.layers), (0, _toConsumableArray2["default"])(defaultLayers)),
      layerOrder: [].concat((0, _toConsumableArray2["default"])(defaultLayers.map(function (_, i) {
        return state.layers.length + i;
      })), (0, _toConsumableArray2["default"])(state.layerOrder))
    }),
    newLayers: defaultLayers
  };
}
/**
 * helper function to find default tooltips
 * @param {Object} state
 * @param {Object} dataset
 * @returns {Object} nextState
 */


function addDefaultTooltips(state, dataset) {
  var tooltipFields = (0, _interactionUtils.findFieldsToShow)(dataset);

  var merged = _objectSpread({}, state.interactionConfig.tooltip.config.fieldsToShow, {}, tooltipFields);

  return (0, _utils.set)(['interactionConfig', 'tooltip', 'config', 'fieldsToShow'], merged, state);
}
/**
 * Helper function to update layer domains for an array of datasets
 * @type {typeof import('./vis-state-updaters').updateAllLayerDomainData}
 */


function updateAllLayerDomainData(state, dataId, updatedFilter) {
  var dataIds = typeof dataId === 'string' ? [dataId] : dataId;
  var newLayers = [];
  var newLayerData = [];
  state.layers.forEach(function (oldLayer, i) {
    if (oldLayer.config.dataId && dataIds.includes(oldLayer.config.dataId)) {
      // No need to recalculate layer domain if filter has fixed domain
      var newLayer = updatedFilter && updatedFilter.fixedDomain ? oldLayer : oldLayer.updateLayerDomain(state.datasets, updatedFilter);

      var _calculateLayerData4 = (0, _layerUtils.calculateLayerData)(newLayer, state, state.layerData[i]),
          layerData = _calculateLayerData4.layerData,
          layer = _calculateLayerData4.layer;

      newLayers.push(layer);
      newLayerData.push(layerData);
    } else {
      newLayers.push(oldLayer);
      newLayerData.push(state.layerData[i]);
    }
  });

  var newState = _objectSpread({}, state, {
    layers: newLayers,
    layerData: newLayerData
  });

  return newState;
}

function updateAnimationDomain(state) {
  // merge all animatable layer domain and update global config
  var animatableLayers = state.layers.filter(function (l) {
    return l.config.isVisible && l.config.animation && l.config.animation.enabled && Array.isArray(l.animationDomain);
  });

  if (!animatableLayers.length) {
    return _objectSpread({}, state, {
      animationConfig: DEFAULT_ANIMATION_CONFIG
    });
  }

  var mergedDomain = animatableLayers.reduce(function (accu, layer) {
    return [Math.min(accu[0], layer.animationDomain[0]), Math.max(accu[1], layer.animationDomain[1])];
  }, [Number(Infinity), -Infinity]);
  return _objectSpread({}, state, {
    animationConfig: _objectSpread({}, state.animationConfig, {
      currentTime: (0, _filterUtils.isInRange)(state.animationConfig.currentTime, mergedDomain) ? state.animationConfig.currentTime : mergedDomain[0],
      domain: mergedDomain
    })
  });
}
/**
 * Update the status of the editor
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').setEditorModeUpdater}
 */


var setEditorModeUpdater = function setEditorModeUpdater(state, _ref15) {
  var mode = _ref15.mode;
  return _objectSpread({}, state, {
    editor: _objectSpread({}, state.editor, {
      mode: mode,
      selectedFeature: null
    })
  });
}; // const featureToFilterValue = (feature) => ({...feature, id: feature.id});

/**
 * Update editor features
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').setFeaturesUpdater}
 */


exports.setEditorModeUpdater = setEditorModeUpdater;

function setFeaturesUpdater(state, _ref16) {
  var _ref16$features = _ref16.features,
      features = _ref16$features === void 0 ? [] : _ref16$features;
  var lastFeature = features.length && features[features.length - 1];

  var newState = _objectSpread({}, state, {
    editor: _objectSpread({}, state.editor, {
      // only save none filter features to editor
      features: features.filter(function (f) {
        return !(0, _filterUtils.getFilterIdInFeature)(f);
      }),
      mode: lastFeature && lastFeature.properties.isClosed ? _defaultSettings.EDITOR_MODES.EDIT : state.editor.mode
    })
  }); // Retrieve existing feature


  var selectedFeature = state.editor.selectedFeature; // If no feature is selected we can simply return since no operations

  if (!selectedFeature) {
    return newState;
  } // TODO: check if the feature has changed


  var feature = features.find(function (f) {
    return f.id === selectedFeature.id;
  }); // if feature is part of a filter

  var filterId = feature && (0, _filterUtils.getFilterIdInFeature)(feature);

  if (filterId && feature) {
    var featureValue = (0, _filterUtils.featureToFilterValue)(feature, filterId);
    var filterIdx = state.filters.findIndex(function (fil) {
      return fil.id === filterId;
    });
    return setFilterUpdater(newState, {
      idx: filterIdx,
      prop: 'value',
      value: featureValue
    });
  }

  return newState;
}
/**
 * Set the current selected feature
 * @memberof uiStateUpdaters
 * @type {typeof import('./vis-state-updaters').setSelectedFeatureUpdater}
 */


var setSelectedFeatureUpdater = function setSelectedFeatureUpdater(state, _ref17) {
  var feature = _ref17.feature;
  return _objectSpread({}, state, {
    editor: _objectSpread({}, state.editor, {
      selectedFeature: feature
    })
  });
};
/**
 * Delete existing feature from filters
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').deleteFeatureUpdater}
 */


exports.setSelectedFeatureUpdater = setSelectedFeatureUpdater;

function deleteFeatureUpdater(state, _ref18) {
  var feature = _ref18.feature;

  if (!feature) {
    return state;
  }

  var newState = _objectSpread({}, state, {
    editor: _objectSpread({}, state.editor, {
      selectedFeature: null
    })
  });

  if ((0, _filterUtils.getFilterIdInFeature)(feature)) {
    var filterIdx = newState.filters.findIndex(function (f) {
      return f.id === (0, _filterUtils.getFilterIdInFeature)(feature);
    });
    return filterIdx > -1 ? removeFilterUpdater(newState, {
      idx: filterIdx
    }) : newState;
  } // modify editor object


  var newEditor = _objectSpread({}, state.editor, {
    features: state.editor.features.filter(function (f) {
      return f.id !== feature.id;
    }),
    selectedFeature: null
  });

  return _objectSpread({}, state, {
    editor: newEditor
  });
}
/**
 * Toggle feature as layer filter
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').setPolygonFilterLayerUpdater}
 */


function setPolygonFilterLayerUpdater(state, payload) {
  var layer = payload.layer,
      feature = payload.feature;
  var filterId = (0, _filterUtils.getFilterIdInFeature)(feature); // let newFilter = null;

  var filterIdx;
  var newLayerId = [layer.id];
  var newState = state; // If polygon filter already exists, we need to find out if the current layer is already included

  if (filterId) {
    filterIdx = state.filters.findIndex(function (f) {
      return f.id === filterId;
    });

    if (!state.filters[filterIdx]) {
      // what if filter doesn't exist?... not possible.
      // because features in the editor is passed in from filters and editors.
      // but we will move this feature back to editor just in case
      var noneFilterFeature = _objectSpread({}, feature, {
        properties: _objectSpread({}, feature.properties, {
          filterId: null
        })
      });

      return _objectSpread({}, state, {
        editor: _objectSpread({}, state.editor, {
          features: [].concat((0, _toConsumableArray2["default"])(state.editor.features), [noneFilterFeature]),
          selectedFeature: noneFilterFeature
        })
      });
    }

    var filter = state.filters[filterIdx];
    var _filter$layerId = filter.layerId,
        layerId = _filter$layerId === void 0 ? [] : _filter$layerId;
    var isLayerIncluded = layerId.includes(layer.id);
    newLayerId = isLayerIncluded ? // if layer is included, remove it
    layerId.filter(function (l) {
      return l !== layer.id;
    }) : [].concat((0, _toConsumableArray2["default"])(layerId), [layer.id]);
  } else {
    // if we haven't create the polygon filter, create it
    var newFilter = (0, _filterUtils.generatePolygonFilter)([], feature);
    filterIdx = state.filters.length; // add feature, remove feature from eidtor

    newState = _objectSpread({}, state, {
      filters: [].concat((0, _toConsumableArray2["default"])(state.filters), [newFilter]),
      editor: _objectSpread({}, state.editor, {
        features: state.editor.features.filter(function (f) {
          return f.id !== feature.id;
        }),
        selectedFeature: newFilter.value
      })
    });
  }

  return setFilterUpdater(newState, {
    idx: filterIdx,
    prop: 'layerId',
    value: newLayerId
  });
}
/**
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').sortTableColumnUpdater}
 * @public
 */


function sortTableColumnUpdater(state, _ref19) {
  var dataId = _ref19.dataId,
      column = _ref19.column,
      mode = _ref19.mode;
  var dataset = state.datasets[dataId];

  if (!dataset) {
    return state;
  }

  if (!mode) {
    var currentMode = (0, _lodash3["default"])(dataset, ['sortColumn', column]);
    mode = currentMode ? Object.keys(_defaultSettings.SORT_ORDER).find(function (m) {
      return m !== currentMode;
    }) : _defaultSettings.SORT_ORDER.ASCENDING;
  }

  var sorted = (0, _datasetUtils.sortDatasetByColumn)(dataset, column, mode);
  return (0, _utils.set)(['datasets', dataId], sorted, state);
}
/**
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').pinTableColumnUpdater}
 * @public
 */


function pinTableColumnUpdater(state, _ref20) {
  var dataId = _ref20.dataId,
      column = _ref20.column;
  var dataset = state.datasets[dataId];

  if (!dataset) {
    return state;
  }

  var field = dataset.fields.find(function (f) {
    return f.name === column;
  });

  if (!field) {
    return state;
  }

  var pinnedColumns;

  if (Array.isArray(dataset.pinnedColumns) && dataset.pinnedColumns.includes(field.name)) {
    // unpin it
    pinnedColumns = dataset.pinnedColumns.filter(function (co) {
      return co !== field.name;
    });
  } else {
    pinnedColumns = (dataset.pinnedColumns || []).concat(field.name);
  }

  return (0, _utils.set)(['datasets', dataId, 'pinnedColumns'], pinnedColumns, state);
}
/**
 * Copy column content as strings
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').copyTableColumnUpdater}
 * @public
 */


function copyTableColumnUpdater(state, _ref21) {
  var dataId = _ref21.dataId,
      column = _ref21.column;
  var dataset = state.datasets[dataId];

  if (!dataset) {
    return state;
  }

  var fieldIdx = dataset.fields.findIndex(function (f) {
    return f.name === column;
  });

  if (fieldIdx < 0) {
    return state;
  }

  var type = dataset.fields[fieldIdx].type;
  var text = dataset.allData.map(function (d) {
    return (0, _dataUtils.parseFieldValue)(d[fieldIdx], type);
  }).join('\n');
  (0, _copyToClipboard["default"])(text);
  return state;
}
/**
 * Update editor
 * @type {typeof import('./vis-state-updaters').toggleEditorVisibilityUpdater}
 */


function toggleEditorVisibilityUpdater(state) {
  return _objectSpread({}, state, {
    editor: _objectSpread({}, state.editor, {
      visible: !state.editor.visible
    })
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy92aXMtc3RhdGUtdXBkYXRlcnMuanMiXSwibmFtZXMiOlsidmlzU3RhdGVVcGRhdGVycyIsIkRFRkFVTFRfQU5JTUFUSU9OX0NPTkZJRyIsImRvbWFpbiIsImN1cnJlbnRUaW1lIiwic3BlZWQiLCJERUZBVUxUX0VESVRPUiIsIm1vZGUiLCJFRElUT1JfTU9ERVMiLCJEUkFXX1BPTFlHT04iLCJmZWF0dXJlcyIsInNlbGVjdGVkRmVhdHVyZSIsInZpc2libGUiLCJJTklUSUFMX1ZJU19TVEFURSIsIm1hcEluZm8iLCJ0aXRsZSIsImRlc2NyaXB0aW9uIiwibGF5ZXJzIiwibGF5ZXJEYXRhIiwibGF5ZXJUb0JlTWVyZ2VkIiwibGF5ZXJPcmRlciIsImZpbHRlcnMiLCJmaWx0ZXJUb0JlTWVyZ2VkIiwiZGF0YXNldHMiLCJlZGl0aW5nRGF0YXNldCIsInVuZGVmaW5lZCIsImludGVyYWN0aW9uQ29uZmlnIiwiaW50ZXJhY3Rpb25Ub0JlTWVyZ2VkIiwibGF5ZXJCbGVuZGluZyIsImhvdmVySW5mbyIsImNsaWNrZWQiLCJtb3VzZVBvcyIsInNwbGl0TWFwcyIsImxheWVyQ2xhc3NlcyIsIkxheWVyQ2xhc3NlcyIsImFuaW1hdGlvbkNvbmZpZyIsImVkaXRvciIsInVwZGF0ZVN0YXRlV2l0aExheWVyQW5kRGF0YSIsInN0YXRlIiwibGF5ZXIiLCJpZHgiLCJtYXAiLCJseXIiLCJpIiwiZCIsInVwZGF0ZVN0YXRlT25MYXllclZpc2liaWxpdHlDaGFuZ2UiLCJuZXdTdGF0ZSIsImxlbmd0aCIsImNvbmZpZyIsImlzVmlzaWJsZSIsImFuaW1hdGlvbiIsImVuYWJsZWQiLCJ1cGRhdGVBbmltYXRpb25Eb21haW4iLCJsYXllckNvbmZpZ0NoYW5nZVVwZGF0ZXIiLCJhY3Rpb24iLCJvbGRMYXllciIsImZpbmRJbmRleCIsImwiLCJpZCIsInByb3BzIiwiT2JqZWN0Iiwia2V5cyIsIm5ld0NvbmZpZyIsIm5ld0xheWVyIiwidXBkYXRlTGF5ZXJDb25maWciLCJzaG91bGRDYWxjdWxhdGVMYXllckRhdGEiLCJvbGRMYXllckRhdGEiLCJ1cGRhdGVMYXllckRhdGFSZXN1bHQiLCJhZGRPclJlbW92ZVRleHRMYWJlbHMiLCJuZXdGaWVsZHMiLCJ0ZXh0TGFiZWwiLCJuZXdUZXh0TGFiZWwiLCJzbGljZSIsImN1cnJlbnRGaWVsZHMiLCJ0bCIsImZpZWxkIiwibmFtZSIsImZpbHRlciIsImFkZEZpZWxkcyIsImYiLCJpbmNsdWRlcyIsImRlbGV0ZUZpZWxkcyIsImZpbmQiLCJmZCIsIkRFRkFVTFRfVEVYVF9MQUJFTCIsImFmIiwidXBkYXRlVGV4dExhYmVsUHJvcEFuZFZhbHVlIiwicHJvcCIsInZhbHVlIiwiaGFzT3duUHJvcGVydHkiLCJzcGxpY2UiLCJsYXllclRleHRMYWJlbENoYW5nZVVwZGF0ZXIiLCJsYXllclR5cGVDaGFuZ2VVcGRhdGVyIiwibmV3VHlwZSIsIm9sZElkIiwiQ29uc29sZSIsImVycm9yIiwiYXNzaWduQ29uZmlnVG9MYXllciIsInZpc0NvbmZpZ1NldHRpbmdzIiwidXBkYXRlTGF5ZXJEb21haW4iLCJzZXR0aW5ncyIsIm9sZExheWVyTWFwIiwib3RoZXJMYXllcnMiLCJsYXllclZpc3VhbENoYW5uZWxDaGFuZ2VVcGRhdGVyIiwiY2hhbm5lbCIsImRhdGFJZCIsImRhdGFzZXQiLCJ1cGRhdGVMYXllclZpc3VhbENoYW5uZWwiLCJsYXllclZpc0NvbmZpZ0NoYW5nZVVwZGF0ZXIiLCJuZXdWaXNDb25maWciLCJ2aXNDb25maWciLCJzZXRGaWx0ZXJVcGRhdGVyIiwidmFsdWVJbmRleCIsIm9sZEZpbHRlciIsIm5ld0ZpbHRlciIsImRhdGFzZXRJZHMiLCJGSUxURVJfVVBEQVRFUl9QUk9QUyIsImRhdGFzZXRJZCIsIm1lcmdlRG9tYWluIiwidXBkYXRlZEZpbHRlciIsIm5ld0RhdGFzZXQiLCJncHUiLCJsYXllcklkIiwibGF5ZXJJZERpZmZlcmVuY2UiLCJsYXllckRhdGFJZHMiLCJsaWQiLCJuZXdEYXRhSWRzIiwiZW5sYXJnZWRGaWx0ZXIiLCJlbmxhcmdlZCIsImRhdGFzZXRJZHNUb0ZpbHRlciIsIkxJTUlURURfRklMVEVSX0VGRkVDVF9QUk9QUyIsImZpbHRlcmVkRGF0YXNldHMiLCJ1cGRhdGVBbGxMYXllckRvbWFpbkRhdGEiLCJzZXRGaWx0ZXJQbG90VXBkYXRlciIsIm5ld1Byb3AiLCJwbG90VHlwZSIsImFsbERhdGEiLCJhZGRGaWx0ZXJVcGRhdGVyIiwibGF5ZXJDb2xvclVJQ2hhbmdlVXBkYXRlciIsInVwZGF0ZUxheWVyQ29sb3JVSSIsInRvZ2dsZUZpbHRlckFuaW1hdGlvblVwZGF0ZXIiLCJpc0FuaW1hdGluZyIsInVwZGF0ZUZpbHRlckFuaW1hdGlvblNwZWVkVXBkYXRlciIsInVwZGF0ZUFuaW1hdGlvblRpbWVVcGRhdGVyIiwidXBkYXRlTGF5ZXJBbmltYXRpb25TcGVlZFVwZGF0ZXIiLCJlbmxhcmdlRmlsdGVyVXBkYXRlciIsImlzRW5sYXJnZWQiLCJ0b2dnbGVGaWx0ZXJGZWF0dXJlVXBkYXRlciIsImFzc2lnbiIsInJlbW92ZUZpbHRlclVwZGF0ZXIiLCJuZXdGaWx0ZXJzIiwibmV3RWRpdG9yIiwiYWRkTGF5ZXJVcGRhdGVyIiwiZGVmYXVsdERhdGFzZXQiLCJMYXllciIsImlzQ29uZmlnQWN0aXZlIiwicmVtb3ZlTGF5ZXJVcGRhdGVyIiwibGF5ZXJUb1JlbW92ZSIsIm5ld01hcHMiLCJwaWQiLCJpc0xheWVySG92ZXJlZCIsInJlb3JkZXJMYXllclVwZGF0ZXIiLCJvcmRlciIsInJlbW92ZURhdGFzZXRVcGRhdGVyIiwiZGF0YXNldEtleSIsIm5ld0RhdGFzZXRzIiwiaW5kZXhlcyIsInJlZHVjZSIsImxpc3RPZkluZGV4ZXMiLCJpbmRleCIsInB1c2giLCJjdXJyZW50U3RhdGUiLCJpbmRleENvdW50ZXIiLCJjdXJyZW50SW5kZXgiLCJ0b29sdGlwIiwiZmllbGRzVG9TaG93IiwiZmllbGRzIiwidXBkYXRlTGF5ZXJCbGVuZGluZ1VwZGF0ZXIiLCJzaG93RGF0YXNldFRhYmxlVXBkYXRlciIsInJlc2V0TWFwQ29uZmlnVXBkYXRlciIsImluaXRpYWxTdGF0ZSIsInJlY2VpdmVNYXBDb25maWdVcGRhdGVyIiwicGF5bG9hZCIsIm9wdGlvbnMiLCJ2aXNTdGF0ZSIsImtlZXBFeGlzdGluZ0NvbmZpZyIsIm1lcmdlZFN0YXRlIiwibGF5ZXJIb3ZlclVwZGF0ZXIiLCJpbmZvIiwiaW50ZXJhY3Rpb25Db25maWdDaGFuZ2VVcGRhdGVyIiwiY29udHJhZGljdCIsImZvckVhY2giLCJrIiwibGF5ZXJDbGlja1VwZGF0ZXIiLCJjb29yZGluYXRlIiwicGlubmVkIiwicGlja2VkIiwibWFwQ2xpY2tVcGRhdGVyIiwibW91c2VNb3ZlVXBkYXRlciIsImV2dCIsInZhbHVlcyIsInNvbWUiLCJtb3VzZVBvc2l0aW9uIiwicG9pbnQiLCJsbmdMYXQiLCJ0b2dnbGVTcGxpdE1hcFVwZGF0ZXIiLCJjbG9zZVNwZWNpZmljTWFwQXRJbmRleCIsInRvZ2dsZUxheWVyRm9yTWFwVXBkYXRlciIsIm1hcEluZGV4Iiwic20iLCJ1cGRhdGVWaXNEYXRhVXBkYXRlciIsIm5ld0RhdGFFbnRyaWVzIiwiYWNjdSIsImRhdGEiLCJwcmV2aW91c1N0YXRlIiwic3RhdGVXaXRoTmV3RGF0YSIsInNwbGl0TWFwc1RvQmVNZXJnZWQiLCJuZXdMYXllcnMiLCJyZXN1bHQiLCJhZGREZWZhdWx0TGF5ZXJzIiwidG9vbHRpcEZpZWxkcyIsIkFycmF5IiwiaXNBcnJheSIsImFkZERlZmF1bHRUb29sdGlwcyIsInVwZGF0ZWRTdGF0ZSIsImluZGV4VG9SZXRyaWV2ZSIsIm1hcExheWVycyIsImxvYWRGaWxlc1VwZGF0ZXIiLCJmaWxlcyIsIm9uRmluaXNoIiwibG9hZEZpbGVTdWNjZXNzIiwiZmlsZUNhY2hlIiwiZmlsZUxvYWRpbmciLCJmaWxlTG9hZGluZ1Byb2dyZXNzIiwibWFrZUxvYWRGaWxlVGFzayIsImxvYWROZXh0RmlsZVVwZGF0ZXIiLCJmaWxlc1RvTG9hZCIsInRvdGFsQ291bnQiLCJmaWxlIiwicmVtYWluaW5nRmlsZXNUb0xvYWQiLCJiaW1hcCIsImxvYWRGaWxlc0VyciIsImxvYWRGaWxlc0VyclVwZGF0ZXIiLCJmaWxlTG9hZGluZ0VyciIsImFwcGx5Q1BVRmlsdGVyVXBkYXRlciIsImRhdGFJZHMiLCJzZXRNYXBJbmZvVXBkYXRlciIsImRlZmF1bHRMYXllcnMiLCJfIiwibWVyZ2VkIiwibmV3TGF5ZXJEYXRhIiwiZml4ZWREb21haW4iLCJhbmltYXRhYmxlTGF5ZXJzIiwiYW5pbWF0aW9uRG9tYWluIiwibWVyZ2VkRG9tYWluIiwiTWF0aCIsIm1pbiIsIm1heCIsIk51bWJlciIsIkluZmluaXR5Iiwic2V0RWRpdG9yTW9kZVVwZGF0ZXIiLCJzZXRGZWF0dXJlc1VwZGF0ZXIiLCJsYXN0RmVhdHVyZSIsInByb3BlcnRpZXMiLCJpc0Nsb3NlZCIsIkVESVQiLCJmZWF0dXJlIiwiZmlsdGVySWQiLCJmZWF0dXJlVmFsdWUiLCJmaWx0ZXJJZHgiLCJmaWwiLCJzZXRTZWxlY3RlZEZlYXR1cmVVcGRhdGVyIiwiZGVsZXRlRmVhdHVyZVVwZGF0ZXIiLCJzZXRQb2x5Z29uRmlsdGVyTGF5ZXJVcGRhdGVyIiwibmV3TGF5ZXJJZCIsIm5vbmVGaWx0ZXJGZWF0dXJlIiwiaXNMYXllckluY2x1ZGVkIiwic29ydFRhYmxlQ29sdW1uVXBkYXRlciIsImNvbHVtbiIsImN1cnJlbnRNb2RlIiwiU09SVF9PUkRFUiIsIm0iLCJBU0NFTkRJTkciLCJzb3J0ZWQiLCJwaW5UYWJsZUNvbHVtblVwZGF0ZXIiLCJwaW5uZWRDb2x1bW5zIiwiY28iLCJjb25jYXQiLCJjb3B5VGFibGVDb2x1bW5VcGRhdGVyIiwiZmllbGRJZHgiLCJ0eXBlIiwidGV4dCIsImpvaW4iLCJ0b2dnbGVFZGl0b3JWaXNpYmlsaXR5VXBkYXRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFFQTs7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QWhCLENBQW9CLFVBQUFHLENBQUM7QUFBQSxXQUFJLGdDQUFnQkEsQ0FBQyxDQUFDcVAsUUFBRCxDQUFqQixFQUE2QkMsSUFBN0IsQ0FBSjtBQUFBLEdBQXJCLEVBQTZERSxJQUE3RCxDQUFrRSxJQUFsRSxDQUFiO0FBRUEsbUNBQUtELElBQUw7QUFFQSxTQUFPN1AsS0FBUDtBQUNEO0FBRUQ7Ozs7OztBQUlPLFNBQVMrUCw2QkFBVCxDQUF1Qy9QLEtBQXZDLEVBQThDO0FBQ25ELDJCQUNLQSxLQURMO0FBRUVGLElBQUFBLE1BQU0sb0JBQ0RFLEtBQUssQ0FBQ0YsTUFETDtBQUVKeEIsTUFBQUEsT0FBTyxFQUFFLENBQUMwQixLQUFLLENBQUNGLE1BQU4sQ0FBYXhCO0FBRm5CO0FBRlI7QUFPRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7Y29uc29sZSBhcyBDb25zb2xlfSBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCB7ZGlzYWJsZVN0YWNrQ2FwdHVyaW5nLCB3aXRoVGFza30gZnJvbSAncmVhY3QtcGFsbS90YXNrcyc7XG5pbXBvcnQgY2xvbmVEZWVwIGZyb20gJ2xvZGFzaC5jbG9uZWRlZXAnO1xuaW1wb3J0IHVuaXEgZnJvbSAnbG9kYXNoLnVuaXEnO1xuaW1wb3J0IGdldCBmcm9tICdsb2Rhc2guZ2V0JztcbmltcG9ydCB4b3IgZnJvbSAnbG9kYXNoLnhvcic7XG5pbXBvcnQgY29weSBmcm9tICdjb3B5LXRvLWNsaXBib2FyZCc7XG5pbXBvcnQge3BhcnNlRmllbGRWYWx1ZX0gZnJvbSAndXRpbHMvZGF0YS11dGlscyc7XG4vLyBUYXNrc1xuaW1wb3J0IHtMT0FEX0ZJTEVfVEFTS30gZnJvbSAndGFza3MvdGFza3MnO1xuLy8gQWN0aW9uc1xuaW1wb3J0IHtsb2FkRmlsZXNFcnIsIGxvYWRGaWxlU3VjY2VzcywgbG9hZE5leHRGaWxlfSBmcm9tICdhY3Rpb25zL3Zpcy1zdGF0ZS1hY3Rpb25zJztcbi8vIFV0aWxzXG5pbXBvcnQge2ZpbmRGaWVsZHNUb1Nob3csIGdldERlZmF1bHRJbnRlcmFjdGlvbn0gZnJvbSAndXRpbHMvaW50ZXJhY3Rpb24tdXRpbHMnO1xuaW1wb3J0IHtcbiAgYXBwbHlGaWx0ZXJGaWVsZE5hbWUsXG4gIGFwcGx5RmlsdGVyc1RvRGF0YXNldHMsXG4gIGZlYXR1cmVUb0ZpbHRlclZhbHVlLFxuICBGSUxURVJfVVBEQVRFUl9QUk9QUyxcbiAgZmlsdGVyRGF0YXNldENQVSxcbiAgZ2VuZXJhdGVQb2x5Z29uRmlsdGVyLFxuICBnZXREZWZhdWx0RmlsdGVyLFxuICBnZXREZWZhdWx0RmlsdGVyUGxvdFR5cGUsXG4gIGdldEZpbHRlcklkSW5GZWF0dXJlLFxuICBnZXRGaWx0ZXJQbG90LFxuICBpc0luUmFuZ2UsXG4gIExJTUlURURfRklMVEVSX0VGRkVDVF9QUk9QUyxcbiAgdXBkYXRlRmlsdGVyRGF0YUlkXG59IGZyb20gJ3V0aWxzL2ZpbHRlci11dGlscyc7XG5pbXBvcnQge2Fzc2lnbkdwdUNoYW5uZWwsIHNldEZpbHRlckdwdU1vZGV9IGZyb20gJ3V0aWxzL2dwdS1maWx0ZXItdXRpbHMnO1xuaW1wb3J0IHtjcmVhdGVOZXdEYXRhRW50cnksIHNvcnREYXRhc2V0QnlDb2x1bW59IGZyb20gJ3V0aWxzL2RhdGFzZXQtdXRpbHMnO1xuaW1wb3J0IHtzZXQsIHRvQXJyYXl9IGZyb20gJ3V0aWxzL3V0aWxzJztcblxuaW1wb3J0IHtjYWxjdWxhdGVMYXllckRhdGEsIGZpbmREZWZhdWx0TGF5ZXJ9IGZyb20gJ3V0aWxzL2xheWVyLXV0aWxzL2xheWVyLXV0aWxzJztcblxuaW1wb3J0IHtcbiAgbWVyZ2VBbmltYXRpb25Db25maWcsXG4gIG1lcmdlRmlsdGVycyxcbiAgbWVyZ2VJbnRlcmFjdGlvbnMsXG4gIG1lcmdlTGF5ZXJCbGVuZGluZyxcbiAgbWVyZ2VMYXllcnMsXG4gIG1lcmdlU3BsaXRNYXBzXG59IGZyb20gJy4vdmlzLXN0YXRlLW1lcmdlcic7XG5cbmltcG9ydCB7XG4gIGFkZE5ld0xheWVyc1RvU3BsaXRNYXAsXG4gIGNvbXB1dGVTcGxpdE1hcExheWVycyxcbiAgcmVtb3ZlTGF5ZXJGcm9tU3BsaXRNYXBzXG59IGZyb20gJ3V0aWxzL3NwbGl0LW1hcC11dGlscyc7XG5cbmltcG9ydCB7TGF5ZXIsIExheWVyQ2xhc3Nlc30gZnJvbSAnbGF5ZXJzJztcbmltcG9ydCB7REVGQVVMVF9URVhUX0xBQkVMfSBmcm9tICdsYXllcnMvbGF5ZXItZmFjdG9yeSc7XG5pbXBvcnQge0VESVRPUl9NT0RFUywgU09SVF9PUkRFUn0gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG4vLyB0eXBlIGltcG9ydHNcbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLkZpZWxkfSBGaWVsZCAqL1xuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykuRmlsdGVyfSBGaWx0ZXIgKi9cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLkRhdGFzZXR9IERhdGFzZXQgKi9cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLlZpc1N0YXRlfSBWaXNTdGF0ZSAqL1xuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykuRGF0YXNldHN9IERhdGFzZXRzICovXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5BbmltYXRpb25Db25maWd9IEFuaW1hdGlvbkNvbmZpZyAqL1xuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykuRWRpdG9yfSBFZGl0b3IgKi9cblxuLy8gcmVhY3QtcGFsbVxuLy8gZGlzYWJsZSBjYXB0dXJlIGV4Y2VwdGlvbiBmb3IgcmVhY3QtcGFsbSBjYWxsIHRvIHdpdGhUYXNrXG5kaXNhYmxlU3RhY2tDYXB0dXJpbmcoKTtcblxuLyoqXG4gKiBVcGRhdGVycyBmb3IgYHZpc1N0YXRlYCByZWR1Y2VyLiBDYW4gYmUgdXNlZCBpbiB5b3VyIHJvb3QgcmVkdWNlciB0byBkaXJlY3RseSBtb2RpZnkga2VwbGVyLmdsJ3Mgc3RhdGUuXG4gKiBSZWFkIG1vcmUgYWJvdXQgW1VzaW5nIHVwZGF0ZXJzXSguLi9hZHZhbmNlZC11c2FnZS91c2luZy11cGRhdGVycy5tZClcbiAqXG4gKiBAcHVibGljXG4gKiBAZXhhbXBsZVxuICpcbiAqIGltcG9ydCBrZXBsZXJHbFJlZHVjZXIsIHt2aXNTdGF0ZVVwZGF0ZXJzfSBmcm9tICdrZXBsZXIuZ2wvcmVkdWNlcnMnO1xuICogLy8gUm9vdCBSZWR1Y2VyXG4gKiBjb25zdCByZWR1Y2VycyA9IGNvbWJpbmVSZWR1Y2Vycyh7XG4gKiAga2VwbGVyR2w6IGtlcGxlckdsUmVkdWNlcixcbiAqICBhcHA6IGFwcFJlZHVjZXJcbiAqIH0pO1xuICpcbiAqIGNvbnN0IGNvbXBvc2VkUmVkdWNlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gKiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICogICAgY2FzZSAnQ0xJQ0tfQlVUVE9OJzpcbiAqICAgICAgcmV0dXJuIHtcbiAqICAgICAgICAuLi5zdGF0ZSxcbiAqICAgICAgICBrZXBsZXJHbDoge1xuICogICAgICAgICAgLi4uc3RhdGUua2VwbGVyR2wsXG4gKiAgICAgICAgICBmb286IHtcbiAqICAgICAgICAgICAgIC4uLnN0YXRlLmtlcGxlckdsLmZvbyxcbiAqICAgICAgICAgICAgIHZpc1N0YXRlOiB2aXNTdGF0ZVVwZGF0ZXJzLmVubGFyZ2VGaWx0ZXJVcGRhdGVyKFxuICogICAgICAgICAgICAgICBzdGF0ZS5rZXBsZXJHbC5mb28udmlzU3RhdGUsXG4gKiAgICAgICAgICAgICAgIHtpZHg6IDB9XG4gKiAgICAgICAgICAgICApXG4gKiAgICAgICAgICB9XG4gKiAgICAgICAgfVxuICogICAgICB9O1xuICogIH1cbiAqICByZXR1cm4gcmVkdWNlcnMoc3RhdGUsIGFjdGlvbik7XG4gKiB9O1xuICpcbiAqIGV4cG9ydCBkZWZhdWx0IGNvbXBvc2VkUmVkdWNlcjtcbiAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbi8vIEB0cy1pZ25vcmVcbmNvbnN0IHZpc1N0YXRlVXBkYXRlcnMgPSBudWxsO1xuLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xuXG4vKiogQHR5cGUge0FuaW1hdGlvbkNvbmZpZ30gKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX0FOSU1BVElPTl9DT05GSUcgPSB7XG4gIGRvbWFpbjogbnVsbCxcbiAgY3VycmVudFRpbWU6IG51bGwsXG4gIHNwZWVkOiAxXG59O1xuXG4vKiogQHR5cGUge0VkaXRvcn0gKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX0VESVRPUiA9IHtcbiAgbW9kZTogRURJVE9SX01PREVTLkRSQVdfUE9MWUdPTixcbiAgZmVhdHVyZXM6IFtdLFxuICBzZWxlY3RlZEZlYXR1cmU6IG51bGwsXG4gIHZpc2libGU6IHRydWVcbn07XG5cbi8qKlxuICogRGVmYXVsdCBpbml0aWFsIGB2aXNTdGF0ZWBcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtWaXNTdGF0ZX1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IElOSVRJQUxfVklTX1NUQVRFID0ge1xuICAvLyBtYXAgaW5mb1xuICBtYXBJbmZvOiB7XG4gICAgdGl0bGU6ICcnLFxuICAgIGRlc2NyaXB0aW9uOiAnJ1xuICB9LFxuICAvLyBsYXllcnNcbiAgbGF5ZXJzOiBbXSxcbiAgbGF5ZXJEYXRhOiBbXSxcbiAgbGF5ZXJUb0JlTWVyZ2VkOiBbXSxcbiAgbGF5ZXJPcmRlcjogW10sXG5cbiAgLy8gZmlsdGVyc1xuICBmaWx0ZXJzOiBbXSxcbiAgZmlsdGVyVG9CZU1lcmdlZDogW10sXG5cbiAgLy8gYSBjb2xsZWN0aW9uIG9mIG11bHRpcGxlIGRhdGFzZXRcbiAgZGF0YXNldHM6IHt9LFxuICBlZGl0aW5nRGF0YXNldDogdW5kZWZpbmVkLFxuXG4gIGludGVyYWN0aW9uQ29uZmlnOiBnZXREZWZhdWx0SW50ZXJhY3Rpb24oKSxcbiAgaW50ZXJhY3Rpb25Ub0JlTWVyZ2VkOiB1bmRlZmluZWQsXG5cbiAgbGF5ZXJCbGVuZGluZzogJ25vcm1hbCcsXG4gIGhvdmVySW5mbzogdW5kZWZpbmVkLFxuICBjbGlja2VkOiB1bmRlZmluZWQsXG4gIG1vdXNlUG9zOiB7fSxcblxuICAvLyB0aGlzIGlzIHVzZWQgd2hlbiB1c2VyIHNwbGl0IG1hcHNcbiAgc3BsaXRNYXBzOiBbXG4gICAgLy8gdGhpcyB3aWxsIGNvbnRhaW4gYSBsaXN0IG9mIG9iamVjdHMgdG9cbiAgICAvLyBkZXNjcmliZSB0aGUgc3RhdGUgb2YgbGF5ZXIgYXZhaWxhYmlsaXR5IGFuZCB2aXNpYmlsaXR5IGZvciBlYWNoIG1hcFxuICAgIC8vIFtcbiAgICAvLyAgIHtcbiAgICAvLyAgICAgIGxheWVyczoge2xheWVyX2lkOiB0cnVlIHwgZmFsc2V9XG4gICAgLy8gICB9XG4gICAgLy8gXVxuICBdLFxuICAvL1xuICAvLyBkZWZhdWx0cyBsYXllciBjbGFzc2VzXG4gIGxheWVyQ2xhc3NlczogTGF5ZXJDbGFzc2VzLFxuXG4gIC8vIGRlZmF1bHQgYW5pbWF0aW9uXG4gIC8vIHRpbWUgaW4gdW5peCB0aW1lc3RhbXAgKG1pbGxpc2Vjb25kcykgKHRoZSBudW1iZXIgb2Ygc2Vjb25kcyBzaW5jZSB0aGUgVW5peCBFcG9jaClcbiAgYW5pbWF0aW9uQ29uZmlnOiBERUZBVUxUX0FOSU1BVElPTl9DT05GSUcsXG5cbiAgZWRpdG9yOiBERUZBVUxUX0VESVRPUlxufTtcblxuLyoqXG4gKiBVcGRhdGUgc3RhdGUgd2l0aCB1cGRhdGVkIGxheWVyIGFuZCBsYXllckRhdGFcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLnVwZGF0ZVN0YXRlV2l0aExheWVyQW5kRGF0YX1cbiAqXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZVN0YXRlV2l0aExheWVyQW5kRGF0YShzdGF0ZSwge2xheWVyRGF0YSwgbGF5ZXIsIGlkeH0pIHtcbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBsYXllcnM6IHN0YXRlLmxheWVycy5tYXAoKGx5ciwgaSkgPT4gKGkgPT09IGlkeCA/IGxheWVyIDogbHlyKSksXG4gICAgbGF5ZXJEYXRhOiBsYXllckRhdGFcbiAgICAgID8gc3RhdGUubGF5ZXJEYXRhLm1hcCgoZCwgaSkgPT4gKGkgPT09IGlkeCA/IGxheWVyRGF0YSA6IGQpKVxuICAgICAgOiBzdGF0ZS5sYXllckRhdGFcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVN0YXRlT25MYXllclZpc2liaWxpdHlDaGFuZ2Uoc3RhdGUsIGxheWVyKSB7XG4gIGxldCBuZXdTdGF0ZSA9IHN0YXRlO1xuICBpZiAoc3RhdGUuc3BsaXRNYXBzLmxlbmd0aCkge1xuICAgIG5ld1N0YXRlID0ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBzcGxpdE1hcHM6IGxheWVyLmNvbmZpZy5pc1Zpc2libGVcbiAgICAgICAgPyBhZGROZXdMYXllcnNUb1NwbGl0TWFwKHN0YXRlLnNwbGl0TWFwcywgbGF5ZXIpXG4gICAgICAgIDogcmVtb3ZlTGF5ZXJGcm9tU3BsaXRNYXBzKHN0YXRlLnNwbGl0TWFwcywgbGF5ZXIpXG4gICAgfTtcbiAgfVxuXG4gIGlmIChsYXllci5jb25maWcuYW5pbWF0aW9uLmVuYWJsZWQpIHtcbiAgICBuZXdTdGF0ZSA9IHVwZGF0ZUFuaW1hdGlvbkRvbWFpbihzdGF0ZSk7XG4gIH1cblxuICByZXR1cm4gbmV3U3RhdGU7XG59XG5cbi8qKlxuICogVXBkYXRlIGxheWVyIGJhc2UgY29uZmlnOiBkYXRhSWQsIGxhYmVsLCBjb2x1bW4sIGlzVmlzaWJsZVxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLmxheWVyQ29uZmlnQ2hhbmdlVXBkYXRlcn1cbiAqIEByZXR1cm5zIG5leHRTdGF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gbGF5ZXJDb25maWdDaGFuZ2VVcGRhdGVyKHN0YXRlLCBhY3Rpb24pIHtcbiAgY29uc3Qge29sZExheWVyfSA9IGFjdGlvbjtcbiAgY29uc3QgaWR4ID0gc3RhdGUubGF5ZXJzLmZpbmRJbmRleChsID0+IGwuaWQgPT09IG9sZExheWVyLmlkKTtcbiAgY29uc3QgcHJvcHMgPSBPYmplY3Qua2V5cyhhY3Rpb24ubmV3Q29uZmlnKTtcbiAgbGV0IG5ld0xheWVyID0gb2xkTGF5ZXIudXBkYXRlTGF5ZXJDb25maWcoYWN0aW9uLm5ld0NvbmZpZyk7XG5cbiAgbGV0IGxheWVyRGF0YTtcblxuICAvLyBsZXQgbmV3TGF5ZXI7XG4gIGlmIChuZXdMYXllci5zaG91bGRDYWxjdWxhdGVMYXllckRhdGEocHJvcHMpKSB7XG4gICAgY29uc3Qgb2xkTGF5ZXJEYXRhID0gc3RhdGUubGF5ZXJEYXRhW2lkeF07XG4gICAgY29uc3QgdXBkYXRlTGF5ZXJEYXRhUmVzdWx0ID0gY2FsY3VsYXRlTGF5ZXJEYXRhKG5ld0xheWVyLCBzdGF0ZSwgb2xkTGF5ZXJEYXRhKTtcblxuICAgIGxheWVyRGF0YSA9IHVwZGF0ZUxheWVyRGF0YVJlc3VsdC5sYXllckRhdGE7XG4gICAgbmV3TGF5ZXIgPSB1cGRhdGVMYXllckRhdGFSZXN1bHQubGF5ZXI7XG4gIH1cblxuICBsZXQgbmV3U3RhdGUgPSBzdGF0ZTtcbiAgaWYgKCdpc1Zpc2libGUnIGluIGFjdGlvbi5uZXdDb25maWcpIHtcbiAgICBuZXdTdGF0ZSA9IHVwZGF0ZVN0YXRlT25MYXllclZpc2liaWxpdHlDaGFuZ2Uoc3RhdGUsIG5ld0xheWVyKTtcbiAgfVxuXG4gIHJldHVybiB1cGRhdGVTdGF0ZVdpdGhMYXllckFuZERhdGEobmV3U3RhdGUsIHtcbiAgICBsYXllcjogbmV3TGF5ZXIsXG4gICAgbGF5ZXJEYXRhLFxuICAgIGlkeFxuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkT3JSZW1vdmVUZXh0TGFiZWxzKG5ld0ZpZWxkcywgdGV4dExhYmVsKSB7XG4gIGxldCBuZXdUZXh0TGFiZWwgPSB0ZXh0TGFiZWwuc2xpY2UoKTtcblxuICBjb25zdCBjdXJyZW50RmllbGRzID0gdGV4dExhYmVsLm1hcCh0bCA9PiB0bC5maWVsZCAmJiB0bC5maWVsZC5uYW1lKS5maWx0ZXIoZCA9PiBkKTtcblxuICBjb25zdCBhZGRGaWVsZHMgPSBuZXdGaWVsZHMuZmlsdGVyKGYgPT4gIWN1cnJlbnRGaWVsZHMuaW5jbHVkZXMoZi5uYW1lKSk7XG4gIGNvbnN0IGRlbGV0ZUZpZWxkcyA9IGN1cnJlbnRGaWVsZHMuZmlsdGVyKGYgPT4gIW5ld0ZpZWxkcy5maW5kKGZkID0+IGZkLm5hbWUgPT09IGYpKTtcblxuICAvLyBkZWxldGVcbiAgbmV3VGV4dExhYmVsID0gbmV3VGV4dExhYmVsLmZpbHRlcih0bCA9PiB0bC5maWVsZCAmJiAhZGVsZXRlRmllbGRzLmluY2x1ZGVzKHRsLmZpZWxkLm5hbWUpKTtcbiAgbmV3VGV4dExhYmVsID0gIW5ld1RleHRMYWJlbC5sZW5ndGggPyBbREVGQVVMVF9URVhUX0xBQkVMXSA6IG5ld1RleHRMYWJlbDtcblxuICAvLyBhZGRcbiAgbmV3VGV4dExhYmVsID0gW1xuICAgIC4uLm5ld1RleHRMYWJlbC5maWx0ZXIodGwgPT4gdGwuZmllbGQpLFxuICAgIC4uLmFkZEZpZWxkcy5tYXAoYWYgPT4gKHtcbiAgICAgIC4uLkRFRkFVTFRfVEVYVF9MQUJFTCxcbiAgICAgIGZpZWxkOiBhZlxuICAgIH0pKVxuICBdO1xuXG4gIHJldHVybiBuZXdUZXh0TGFiZWw7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVRleHRMYWJlbFByb3BBbmRWYWx1ZShpZHgsIHByb3AsIHZhbHVlLCB0ZXh0TGFiZWwpIHtcbiAgaWYgKCF0ZXh0TGFiZWxbaWR4XS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgIHJldHVybiB0ZXh0TGFiZWw7XG4gIH1cblxuICBsZXQgbmV3VGV4dExhYmVsID0gdGV4dExhYmVsLnNsaWNlKCk7XG5cbiAgaWYgKHByb3AgJiYgKHZhbHVlIHx8IHRleHRMYWJlbC5sZW5ndGggPT09IDEpKSB7XG4gICAgbmV3VGV4dExhYmVsID0gdGV4dExhYmVsLm1hcCgodGwsIGkpID0+IChpID09PSBpZHggPyB7Li4udGwsIFtwcm9wXTogdmFsdWV9IDogdGwpKTtcbiAgfSBlbHNlIGlmIChwcm9wID09PSAnZmllbGQnICYmIHZhbHVlID09PSBudWxsICYmIHRleHRMYWJlbC5sZW5ndGggPiAxKSB7XG4gICAgLy8gcmVtb3ZlIGxhYmVsIHdoZW4gZmllbGQgdmFsdWUgaXMgc2V0IHRvIG51bGxcbiAgICBuZXdUZXh0TGFiZWwuc3BsaWNlKGlkeCwgMSk7XG4gIH1cblxuICByZXR1cm4gbmV3VGV4dExhYmVsO1xufVxuXG4vKipcbiAqIFVwZGF0ZSBsYXllciBiYXNlIGNvbmZpZzogZGF0YUlkLCBsYWJlbCwgY29sdW1uLCBpc1Zpc2libGVcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5sYXllclRleHRMYWJlbENoYW5nZVVwZGF0ZXJ9XG4gKiBAcmV0dXJucyBuZXh0U3RhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxheWVyVGV4dExhYmVsQ2hhbmdlVXBkYXRlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIGNvbnN0IHtvbGRMYXllciwgaWR4LCBwcm9wLCB2YWx1ZX0gPSBhY3Rpb247XG4gIGNvbnN0IHt0ZXh0TGFiZWx9ID0gb2xkTGF5ZXIuY29uZmlnO1xuXG4gIGxldCBuZXdUZXh0TGFiZWwgPSB0ZXh0TGFiZWwuc2xpY2UoKTtcbiAgaWYgKCF0ZXh0TGFiZWxbaWR4XSAmJiBpZHggPT09IHRleHRMYWJlbC5sZW5ndGgpIHtcbiAgICAvLyBpZiBpZHggaXMgc2V0IHRvIGxlbmd0aCwgYWRkIGVtcHR5IHRleHQgbGFiZWxcbiAgICBuZXdUZXh0TGFiZWwgPSBbLi4udGV4dExhYmVsLCBERUZBVUxUX1RFWFRfTEFCRUxdO1xuICB9XG5cbiAgaWYgKGlkeCA9PT0gJ2FsbCcgJiYgcHJvcCA9PT0gJ2ZpZWxkcycpIHtcbiAgICBuZXdUZXh0TGFiZWwgPSBhZGRPclJlbW92ZVRleHRMYWJlbHModmFsdWUsIHRleHRMYWJlbCk7XG4gIH0gZWxzZSB7XG4gICAgbmV3VGV4dExhYmVsID0gdXBkYXRlVGV4dExhYmVsUHJvcEFuZFZhbHVlKGlkeCwgcHJvcCwgdmFsdWUsIG5ld1RleHRMYWJlbCk7XG4gIH1cblxuICAvLyB1cGRhdGUgdGV4dCBsYWJlbCBwcm9wIGFuZCB2YWx1ZVxuICByZXR1cm4gbGF5ZXJDb25maWdDaGFuZ2VVcGRhdGVyKHN0YXRlLCB7XG4gICAgb2xkTGF5ZXIsXG4gICAgbmV3Q29uZmlnOiB7dGV4dExhYmVsOiBuZXdUZXh0TGFiZWx9XG4gIH0pO1xufVxuXG4vKipcbiAqIFVwZGF0ZSBsYXllciB0eXBlLiBQcmV2aWV3cyBsYXllciBjb25maWcgd2lsbCBiZSBjb3BpZWQgaWYgYXBwbGljYWJsZS5cbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5sYXllclR5cGVDaGFuZ2VVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gbGF5ZXJUeXBlQ2hhbmdlVXBkYXRlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIGNvbnN0IHtvbGRMYXllciwgbmV3VHlwZX0gPSBhY3Rpb247XG4gIGlmICghb2xkTGF5ZXIpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cbiAgY29uc3Qgb2xkSWQgPSBvbGRMYXllci5pZDtcbiAgY29uc3QgaWR4ID0gc3RhdGUubGF5ZXJzLmZpbmRJbmRleChsID0+IGwuaWQgPT09IG9sZElkKTtcblxuICBpZiAoIXN0YXRlLmxheWVyQ2xhc3Nlc1tuZXdUeXBlXSkge1xuICAgIENvbnNvbGUuZXJyb3IoYCR7bmV3VHlwZX0gaXMgbm90IGEgdmFsaWQgbGF5ZXIgdHlwZWApO1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIC8vIGdldCBhIG1pbnQgbGF5ZXIsIHdpdGggbmV3IGlkIGFuZCB0eXBlXG4gIC8vIGJlY2F1c2UgZGVjay5nbCB1c2VzIGlkIHRvIG1hdGNoIGJldHdlZW4gbmV3IGFuZCBvbGQgbGF5ZXIuXG4gIC8vIElmIHR5cGUgaGFzIGNoYW5nZWQgYnV0IGlkIGlzIHRoZSBzYW1lLCBpdCB3aWxsIGJyZWFrXG4gIGNvbnN0IG5ld0xheWVyID0gbmV3IHN0YXRlLmxheWVyQ2xhc3Nlc1tuZXdUeXBlXSgpO1xuXG4gIG5ld0xheWVyLmFzc2lnbkNvbmZpZ1RvTGF5ZXIob2xkTGF5ZXIuY29uZmlnLCBvbGRMYXllci52aXNDb25maWdTZXR0aW5ncyk7XG5cbiAgLy8gaWYgKG5ld0xheWVyLmNvbmZpZy5kYXRhSWQpIHtcbiAgLy8gICBjb25zdCBkYXRhc2V0ID0gc3RhdGUuZGF0YXNldHNbbmV3TGF5ZXIuY29uZmlnLmRhdGFJZF07XG4gIC8vICAgbmV3TGF5ZXIudXBkYXRlTGF5ZXJEb21haW4oZGF0YXNldCk7XG4gIC8vIH1cbiAgbmV3TGF5ZXIudXBkYXRlTGF5ZXJEb21haW4oc3RhdGUuZGF0YXNldHMpO1xuICBjb25zdCB7bGF5ZXJEYXRhLCBsYXllcn0gPSBjYWxjdWxhdGVMYXllckRhdGEobmV3TGF5ZXIsIHN0YXRlKTtcbiAgbGV0IG5ld1N0YXRlID0gdXBkYXRlU3RhdGVXaXRoTGF5ZXJBbmREYXRhKHN0YXRlLCB7bGF5ZXJEYXRhLCBsYXllciwgaWR4fSk7XG5cbiAgaWYgKGxheWVyLmNvbmZpZy5hbmltYXRpb24uZW5hYmxlZCB8fCBvbGRMYXllci5jb25maWcuYW5pbWF0aW9uLmVuYWJsZWQpIHtcbiAgICBuZXdTdGF0ZSA9IHVwZGF0ZUFuaW1hdGlvbkRvbWFpbihuZXdTdGF0ZSk7XG4gIH1cblxuICAvLyB1cGRhdGUgc3BsaXRNYXAgbGF5ZXIgaWRcbiAgaWYgKHN0YXRlLnNwbGl0TWFwcy5sZW5ndGgpIHtcbiAgICBuZXdTdGF0ZSA9IHtcbiAgICAgIC4uLm5ld1N0YXRlLFxuICAgICAgc3BsaXRNYXBzOiBuZXdTdGF0ZS5zcGxpdE1hcHMubWFwKHNldHRpbmdzID0+IHtcbiAgICAgICAgY29uc3Qge1tvbGRJZF06IG9sZExheWVyTWFwLCAuLi5vdGhlckxheWVyc30gPSBzZXR0aW5ncy5sYXllcnM7XG4gICAgICAgIHJldHVybiBvbGRJZCBpbiBzZXR0aW5ncy5sYXllcnNcbiAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgLi4uc2V0dGluZ3MsXG4gICAgICAgICAgICAgIGxheWVyczoge1xuICAgICAgICAgICAgICAgIC4uLm90aGVyTGF5ZXJzLFxuICAgICAgICAgICAgICAgIFtsYXllci5pZF06IG9sZExheWVyTWFwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICA6IHNldHRpbmdzO1xuICAgICAgfSlcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIG5ld1N0YXRlO1xufVxuXG4vKipcbiAqIFVwZGF0ZSBsYXllciB2aXN1YWwgY2hhbm5lbFxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLmxheWVyVmlzdWFsQ2hhbm5lbENoYW5nZVVwZGF0ZXJ9XG4gKiBAcmV0dXJucyB7T2JqZWN0fSBuZXh0U3RhdGVcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxheWVyVmlzdWFsQ2hhbm5lbENoYW5nZVVwZGF0ZXIoc3RhdGUsIGFjdGlvbikge1xuICBjb25zdCB7b2xkTGF5ZXIsIG5ld0NvbmZpZywgY2hhbm5lbH0gPSBhY3Rpb247XG4gIGlmICghb2xkTGF5ZXIuY29uZmlnLmRhdGFJZCkge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuICBjb25zdCBkYXRhc2V0ID0gc3RhdGUuZGF0YXNldHNbb2xkTGF5ZXIuY29uZmlnLmRhdGFJZF07XG5cbiAgY29uc3QgaWR4ID0gc3RhdGUubGF5ZXJzLmZpbmRJbmRleChsID0+IGwuaWQgPT09IG9sZExheWVyLmlkKTtcbiAgY29uc3QgbmV3TGF5ZXIgPSBvbGRMYXllci51cGRhdGVMYXllckNvbmZpZyhuZXdDb25maWcpO1xuXG4gIG5ld0xheWVyLnVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbChkYXRhc2V0LCBjaGFubmVsKTtcblxuICBjb25zdCBvbGRMYXllckRhdGEgPSBzdGF0ZS5sYXllckRhdGFbaWR4XTtcbiAgY29uc3Qge2xheWVyRGF0YSwgbGF5ZXJ9ID0gY2FsY3VsYXRlTGF5ZXJEYXRhKG5ld0xheWVyLCBzdGF0ZSwgb2xkTGF5ZXJEYXRhKTtcblxuICByZXR1cm4gdXBkYXRlU3RhdGVXaXRoTGF5ZXJBbmREYXRhKHN0YXRlLCB7bGF5ZXJEYXRhLCBsYXllciwgaWR4fSk7XG59XG5cbi8qKlxuICogVXBkYXRlIGxheWVyIGB2aXNDb25maWdgXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykubGF5ZXJWaXNDb25maWdDaGFuZ2VVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gbGF5ZXJWaXNDb25maWdDaGFuZ2VVcGRhdGVyKHN0YXRlLCBhY3Rpb24pIHtcbiAgY29uc3Qge29sZExheWVyfSA9IGFjdGlvbjtcbiAgY29uc3QgaWR4ID0gc3RhdGUubGF5ZXJzLmZpbmRJbmRleChsID0+IGwuaWQgPT09IG9sZExheWVyLmlkKTtcbiAgY29uc3QgcHJvcHMgPSBPYmplY3Qua2V5cyhhY3Rpb24ubmV3VmlzQ29uZmlnKTtcbiAgY29uc3QgbmV3VmlzQ29uZmlnID0ge1xuICAgIC4uLm9sZExheWVyLmNvbmZpZy52aXNDb25maWcsXG4gICAgLi4uYWN0aW9uLm5ld1Zpc0NvbmZpZ1xuICB9O1xuXG4gIGNvbnN0IG5ld0xheWVyID0gb2xkTGF5ZXIudXBkYXRlTGF5ZXJDb25maWcoe3Zpc0NvbmZpZzogbmV3VmlzQ29uZmlnfSk7XG5cbiAgaWYgKG5ld0xheWVyLnNob3VsZENhbGN1bGF0ZUxheWVyRGF0YShwcm9wcykpIHtcbiAgICBjb25zdCBvbGRMYXllckRhdGEgPSBzdGF0ZS5sYXllckRhdGFbaWR4XTtcbiAgICBjb25zdCB7bGF5ZXJEYXRhLCBsYXllcn0gPSBjYWxjdWxhdGVMYXllckRhdGEobmV3TGF5ZXIsIHN0YXRlLCBvbGRMYXllckRhdGEpO1xuICAgIHJldHVybiB1cGRhdGVTdGF0ZVdpdGhMYXllckFuZERhdGEoc3RhdGUsIHtsYXllckRhdGEsIGxheWVyLCBpZHh9KTtcbiAgfVxuXG4gIHJldHVybiB1cGRhdGVTdGF0ZVdpdGhMYXllckFuZERhdGEoc3RhdGUsIHtsYXllcjogbmV3TGF5ZXIsIGlkeH0pO1xufVxuXG4vKipcbiAqIFVwZGF0ZSBmaWx0ZXIgcHJvcGVydHlcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5zZXRGaWx0ZXJVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0RmlsdGVyVXBkYXRlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIGNvbnN0IHtpZHgsIHByb3AsIHZhbHVlLCB2YWx1ZUluZGV4ID0gMH0gPSBhY3Rpb247XG5cbiAgY29uc3Qgb2xkRmlsdGVyID0gc3RhdGUuZmlsdGVyc1tpZHhdO1xuICBsZXQgbmV3RmlsdGVyID0gc2V0KFtwcm9wXSwgdmFsdWUsIG9sZEZpbHRlcik7XG4gIGxldCBuZXdTdGF0ZSA9IHN0YXRlO1xuXG4gIGNvbnN0IHtkYXRhSWR9ID0gbmV3RmlsdGVyO1xuXG4gIC8vIEVuc3VyaW5nIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAgbGV0IGRhdGFzZXRJZHMgPSB0b0FycmF5KGRhdGFJZCk7XG5cbiAgc3dpdGNoIChwcm9wKSB7XG4gICAgLy8gVE9ETzogTmV4dCBQUiBmb3IgVUkgaWYgd2UgdXBkYXRlIGRhdGFJZCwgd2UgbmVlZCB0byBjb25zaWRlciB0d28gY2FzZXM6XG4gICAgLy8gMS4gZGF0YUlkIGlzIGVtcHR5OiBjcmVhdGUgYSBkZWZhdWx0IGZpbHRlclxuICAgIC8vIDIuIEFkZCBhIG5ldyBkYXRhc2V0IGlkXG4gICAgY2FzZSBGSUxURVJfVVBEQVRFUl9QUk9QUy5kYXRhSWQ6XG4gICAgICAvLyBpZiB0cnlpbmcgdG8gdXBkYXRlIGZpbHRlciBkYXRhSWQuIGNyZWF0ZSBhbiBlbXB0eSBuZXcgZmlsdGVyXG4gICAgICBuZXdGaWx0ZXIgPSB1cGRhdGVGaWx0ZXJEYXRhSWQoZGF0YUlkKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBGSUxURVJfVVBEQVRFUl9QUk9QUy5uYW1lOlxuICAgICAgLy8gd2UgYXJlIHN1cHBvcnRpbmcgdGhlIGN1cnJlbnQgZnVuY3Rpb25hbGl0eVxuICAgICAgLy8gVE9ETzogTmV4dCBQUiBmb3IgVUkgZmlsdGVyIG5hbWUgd2lsbCBvbmx5IHVwZGF0ZSBmaWx0ZXIgbmFtZSBidXQgaXQgd29uJ3QgaGF2ZSBzaWRlIGVmZmVjdHNcbiAgICAgIC8vIHdlIGFyZSBnb25uYSB1c2UgcGFpciBvZiBkYXRhc2V0cyBhbmQgZmllbGRJZHggdG8gdXBkYXRlIHRoZSBmaWx0ZXJcbiAgICAgIGNvbnN0IGRhdGFzZXRJZCA9IG5ld0ZpbHRlci5kYXRhSWRbdmFsdWVJbmRleF07XG4gICAgICBjb25zdCB7ZmlsdGVyOiB1cGRhdGVkRmlsdGVyLCBkYXRhc2V0OiBuZXdEYXRhc2V0fSA9IGFwcGx5RmlsdGVyRmllbGROYW1lKFxuICAgICAgICBuZXdGaWx0ZXIsXG4gICAgICAgIHN0YXRlLmRhdGFzZXRzW2RhdGFzZXRJZF0sXG4gICAgICAgIHZhbHVlLFxuICAgICAgICB2YWx1ZUluZGV4LFxuICAgICAgICB7bWVyZ2VEb21haW46IGZhbHNlfVxuICAgICAgKTtcbiAgICAgIGlmICghdXBkYXRlZEZpbHRlcikge1xuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICB9XG5cbiAgICAgIG5ld0ZpbHRlciA9IHVwZGF0ZWRGaWx0ZXI7XG5cbiAgICAgIGlmIChuZXdGaWx0ZXIuZ3B1KSB7XG4gICAgICAgIG5ld0ZpbHRlciA9IHNldEZpbHRlckdwdU1vZGUobmV3RmlsdGVyLCBzdGF0ZS5maWx0ZXJzKTtcbiAgICAgICAgbmV3RmlsdGVyID0gYXNzaWduR3B1Q2hhbm5lbChuZXdGaWx0ZXIsIHN0YXRlLmZpbHRlcnMpO1xuICAgICAgfVxuXG4gICAgICBuZXdTdGF0ZSA9IHNldChbJ2RhdGFzZXRzJywgZGF0YXNldElkXSwgbmV3RGF0YXNldCwgc3RhdGUpO1xuXG4gICAgICAvLyBvbmx5IGZpbHRlciB0aGUgY3VycmVudCBkYXRhc2V0XG4gICAgICBicmVhaztcbiAgICBjYXNlIEZJTFRFUl9VUERBVEVSX1BST1BTLmxheWVySWQ6XG4gICAgICAvLyBXZSBuZWVkIHRvIHVwZGF0ZSBvbmx5IGRhdGFzZXRJZC9zIGlmIHdlIGhhdmUgYWRkZWQvcmVtb3ZlZCBsYXllcnNcbiAgICAgIC8vIC0gY2hlY2sgZm9yIGxheWVySWQgY2hhbmdlcyAoWE9SIHdvcmtzIGJlY2F1c2Ugb2Ygc3RyaW5nIHZhbHVlcylcbiAgICAgIC8vIGlmIG5vIGRpZmZlcmVuY2VzIGJldHdlZW4gbGF5ZXJJZHMsIGRvbid0IGRvIGFueSBmaWx0ZXJpbmdcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGNvbnN0IGxheWVySWREaWZmZXJlbmNlID0geG9yKG5ld0ZpbHRlci5sYXllcklkLCBvbGRGaWx0ZXIubGF5ZXJJZCk7XG5cbiAgICAgIGNvbnN0IGxheWVyRGF0YUlkcyA9IHVuaXEoXG4gICAgICAgIGxheWVySWREaWZmZXJlbmNlXG4gICAgICAgICAgLm1hcChsaWQgPT5cbiAgICAgICAgICAgIGdldChcbiAgICAgICAgICAgICAgc3RhdGUubGF5ZXJzLmZpbmQobCA9PiBsLmlkID09PSBsaWQpLFxuICAgICAgICAgICAgICBbJ2NvbmZpZycsICdkYXRhSWQnXVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgICAuZmlsdGVyKGQgPT4gZClcbiAgICAgICk7XG5cbiAgICAgIC8vIG9ubHkgZmlsdGVyIGRhdGFzZXRzSWRzXG4gICAgICBkYXRhc2V0SWRzID0gbGF5ZXJEYXRhSWRzO1xuXG4gICAgICAvLyBVcGRhdGUgbmV3RmlsdGVyIGRhdGFJZHNcbiAgICAgIGNvbnN0IG5ld0RhdGFJZHMgPSB1bmlxKFxuICAgICAgICBuZXdGaWx0ZXIubGF5ZXJJZFxuICAgICAgICAgIC5tYXAobGlkID0+XG4gICAgICAgICAgICBnZXQoXG4gICAgICAgICAgICAgIHN0YXRlLmxheWVycy5maW5kKGwgPT4gbC5pZCA9PT0gbGlkKSxcbiAgICAgICAgICAgICAgWydjb25maWcnLCAnZGF0YUlkJ11cbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgICAgLmZpbHRlcihkID0+IGQpXG4gICAgICApO1xuXG4gICAgICBuZXdGaWx0ZXIgPSB7XG4gICAgICAgIC4uLm5ld0ZpbHRlcixcbiAgICAgICAgZGF0YUlkOiBuZXdEYXRhSWRzXG4gICAgICB9O1xuXG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgYnJlYWs7XG4gIH1cblxuICBjb25zdCBlbmxhcmdlZEZpbHRlciA9IHN0YXRlLmZpbHRlcnMuZmluZChmID0+IGYuZW5sYXJnZWQpO1xuXG4gIGlmIChlbmxhcmdlZEZpbHRlciAmJiBlbmxhcmdlZEZpbHRlci5pZCAhPT0gbmV3RmlsdGVyLmlkKSB7XG4gICAgLy8gdGhlcmUgc2hvdWxkIGJlIG9ubHkgb25lIGVubGFyZ2VkIGZpbHRlclxuICAgIG5ld0ZpbHRlci5lbmxhcmdlZCA9IGZhbHNlO1xuICB9XG5cbiAgLy8gc2F2ZSBuZXcgZmlsdGVycyB0byBuZXdTdGF0ZVxuICBuZXdTdGF0ZSA9IHNldChbJ2ZpbHRlcnMnLCBpZHhdLCBuZXdGaWx0ZXIsIG5ld1N0YXRlKTtcblxuICAvLyBpZiB3ZSBhcmUgY3VycmVudGx5IHNldHRpbmcgYSBwcm9wIHRoYXQgb25seSByZXF1aXJlcyB0byBmaWx0ZXIgdGhlIGN1cnJlbnRcbiAgLy8gZGF0YXNldCB3ZSB3aWxsIHBhc3Mgb25seSB0aGUgY3VycmVudCBkYXRhc2V0IHRvIGFwcGx5RmlsdGVyc1RvRGF0YXNldHMgYW5kXG4gIC8vIHVwZGF0ZUFsbExheWVyRG9tYWluRGF0YSBvdGhlcndpc2Ugd2UgcGFzcyB0aGUgYWxsIGxpc3Qgb2YgZGF0YXNldHMgYXMgZGVmaW5lZCBpbiBkYXRhSWRcbiAgY29uc3QgZGF0YXNldElkc1RvRmlsdGVyID0gTElNSVRFRF9GSUxURVJfRUZGRUNUX1BST1BTW3Byb3BdXG4gICAgPyBbZGF0YXNldElkc1t2YWx1ZUluZGV4XV1cbiAgICA6IGRhdGFzZXRJZHM7XG5cbiAgLy8gZmlsdGVyIGRhdGFcbiAgY29uc3QgZmlsdGVyZWREYXRhc2V0cyA9IGFwcGx5RmlsdGVyc1RvRGF0YXNldHMoXG4gICAgZGF0YXNldElkc1RvRmlsdGVyLFxuICAgIG5ld1N0YXRlLmRhdGFzZXRzLFxuICAgIG5ld1N0YXRlLmZpbHRlcnMsXG4gICAgbmV3U3RhdGUubGF5ZXJzXG4gICk7XG5cbiAgbmV3U3RhdGUgPSBzZXQoWydkYXRhc2V0cyddLCBmaWx0ZXJlZERhdGFzZXRzLCBuZXdTdGF0ZSk7XG4gIC8vIGRhdGFJZCBpcyBhbiBhcnJheVxuICAvLyBwYXNzIG9ubHkgdGhlIGRhdGFzZXQgd2UgbmVlZCB0byB1cGRhdGVcbiAgbmV3U3RhdGUgPSB1cGRhdGVBbGxMYXllckRvbWFpbkRhdGEobmV3U3RhdGUsIGRhdGFzZXRJZHNUb0ZpbHRlciwgbmV3RmlsdGVyKTtcblxuICByZXR1cm4gbmV3U3RhdGU7XG59XG5cbi8qKlxuICogU2V0IHRoZSBwcm9wZXJ0eSBvZiBhIGZpbHRlciBwbG90XG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykuc2V0RmlsdGVyUGxvdFVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBzZXRGaWx0ZXJQbG90VXBkYXRlciA9IChzdGF0ZSwge2lkeCwgbmV3UHJvcCwgdmFsdWVJbmRleCA9IDB9KSA9PiB7XG4gIGxldCBuZXdGaWx0ZXIgPSB7Li4uc3RhdGUuZmlsdGVyc1tpZHhdLCAuLi5uZXdQcm9wfTtcbiAgY29uc3QgcHJvcCA9IE9iamVjdC5rZXlzKG5ld1Byb3ApWzBdO1xuICBpZiAocHJvcCA9PT0gJ3lBeGlzJykge1xuICAgIGNvbnN0IHBsb3RUeXBlID0gZ2V0RGVmYXVsdEZpbHRlclBsb3RUeXBlKG5ld0ZpbHRlcik7XG4gICAgLy8gVE9ETzogcGxvdCBpcyBub3Qgc3VwcG9ydGVkIGluIG11bHRpIGRhdGFzZXQgZmlsdGVyIGZvciBub3dcbiAgICBpZiAocGxvdFR5cGUpIHtcbiAgICAgIG5ld0ZpbHRlciA9IHtcbiAgICAgICAgLi4ubmV3RmlsdGVyLFxuICAgICAgICAuLi5nZXRGaWx0ZXJQbG90KFxuICAgICAgICAgIHsuLi5uZXdGaWx0ZXIsIHBsb3RUeXBlfSxcbiAgICAgICAgICBzdGF0ZS5kYXRhc2V0c1tuZXdGaWx0ZXIuZGF0YUlkW3ZhbHVlSW5kZXhdXS5hbGxEYXRhXG4gICAgICAgICksXG4gICAgICAgIHBsb3RUeXBlXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgZmlsdGVyczogc3RhdGUuZmlsdGVycy5tYXAoKGYsIGkpID0+IChpID09PSBpZHggPyBuZXdGaWx0ZXIgOiBmKSlcbiAgfTtcbn07XG5cbi8qKlxuICogQWRkIGEgbmV3IGZpbHRlclxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLmFkZEZpbHRlclVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBhZGRGaWx0ZXJVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+XG4gICFhY3Rpb24uZGF0YUlkXG4gICAgPyBzdGF0ZVxuICAgIDoge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgZmlsdGVyczogWy4uLnN0YXRlLmZpbHRlcnMsIGdldERlZmF1bHRGaWx0ZXIoYWN0aW9uLmRhdGFJZCldXG4gICAgICB9O1xuXG4vKipcbiAqIFNldCBsYXllciBjb2xvciBwYWxldHRlIHVpIHN0YXRlXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykubGF5ZXJDb2xvclVJQ2hhbmdlVXBkYXRlcn1cbiAqL1xuZXhwb3J0IGNvbnN0IGxheWVyQ29sb3JVSUNoYW5nZVVwZGF0ZXIgPSAoc3RhdGUsIHtvbGRMYXllciwgcHJvcCwgbmV3Q29uZmlnfSkgPT4ge1xuICBjb25zdCBuZXdMYXllciA9IG9sZExheWVyLnVwZGF0ZUxheWVyQ29sb3JVSShwcm9wLCBuZXdDb25maWcpO1xuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGxheWVyczogc3RhdGUubGF5ZXJzLm1hcChsID0+IChsLmlkID09PSBvbGRMYXllci5pZCA/IG5ld0xheWVyIDogbCkpXG4gIH07XG59O1xuXG4vKipcbiAqIFN0YXJ0IGFuZCBlbmQgZmlsdGVyIGFuaW1hdGlvblxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLnRvZ2dsZUZpbHRlckFuaW1hdGlvblVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCB0b2dnbGVGaWx0ZXJBbmltYXRpb25VcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBmaWx0ZXJzOiBzdGF0ZS5maWx0ZXJzLm1hcCgoZiwgaSkgPT4gKGkgPT09IGFjdGlvbi5pZHggPyB7Li4uZiwgaXNBbmltYXRpbmc6ICFmLmlzQW5pbWF0aW5nfSA6IGYpKVxufSk7XG5cbi8qKlxuICogQ2hhbmdlIGZpbHRlciBhbmltYXRpb24gc3BlZWRcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS51cGRhdGVGaWx0ZXJBbmltYXRpb25TcGVlZFVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCB1cGRhdGVGaWx0ZXJBbmltYXRpb25TcGVlZFVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGZpbHRlcnM6IHN0YXRlLmZpbHRlcnMubWFwKChmLCBpKSA9PiAoaSA9PT0gYWN0aW9uLmlkeCA/IHsuLi5mLCBzcGVlZDogYWN0aW9uLnNwZWVkfSA6IGYpKVxufSk7XG5cbi8qKlxuICogUmVzZXQgYW5pbWF0aW9uIGNvbmZpZyBjdXJyZW50IHRpbWUgdG8gYSBzcGVjaWZpZWQgdmFsdWVcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS51cGRhdGVBbmltYXRpb25UaW1lVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqXG4gKi9cbmV4cG9ydCBjb25zdCB1cGRhdGVBbmltYXRpb25UaW1lVXBkYXRlciA9IChzdGF0ZSwge3ZhbHVlfSkgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGFuaW1hdGlvbkNvbmZpZzoge1xuICAgIC4uLnN0YXRlLmFuaW1hdGlvbkNvbmZpZyxcbiAgICBjdXJyZW50VGltZTogdmFsdWVcbiAgfVxufSk7XG5cbi8qKlxuICogVXBkYXRlIGFuaW1hdGlvbiBzcGVlZCB3aXRoIHRoZSB2ZXJ0aWNhbCBzcGVlZCBzbGlkZXJcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS51cGRhdGVMYXllckFuaW1hdGlvblNwZWVkVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqXG4gKi9cbmV4cG9ydCBjb25zdCB1cGRhdGVMYXllckFuaW1hdGlvblNwZWVkVXBkYXRlciA9IChzdGF0ZSwge3NwZWVkfSkgPT4ge1xuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGFuaW1hdGlvbkNvbmZpZzoge1xuICAgICAgLi4uc3RhdGUuYW5pbWF0aW9uQ29uZmlnLFxuICAgICAgc3BlZWRcbiAgICB9XG4gIH07XG59O1xuXG4vKipcbiAqIFNob3cgbGFyZ2VyIHRpbWUgZmlsdGVyIGF0IGJvdHRvbSBmb3IgdGltZSBwbGF5YmFjayAoYXBwbHkgdG8gdGltZSBmaWx0ZXIgb25seSlcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5lbmxhcmdlRmlsdGVyVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IGVubGFyZ2VGaWx0ZXJVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgY29uc3QgaXNFbmxhcmdlZCA9IHN0YXRlLmZpbHRlcnNbYWN0aW9uLmlkeF0uZW5sYXJnZWQ7XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBmaWx0ZXJzOiBzdGF0ZS5maWx0ZXJzLm1hcCgoZiwgaSkgPT4ge1xuICAgICAgZi5lbmxhcmdlZCA9ICFpc0VubGFyZ2VkICYmIGkgPT09IGFjdGlvbi5pZHg7XG4gICAgICByZXR1cm4gZjtcbiAgICB9KVxuICB9O1xufTtcblxuLyoqXG4gKiBUb2dnbGVzIGZpbHRlciBmZWF0dXJlIHZpc2liaWxpdHlcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS50b2dnbGVGaWx0ZXJGZWF0dXJlVXBkYXRlcn1cbiAqL1xuZXhwb3J0IGNvbnN0IHRvZ2dsZUZpbHRlckZlYXR1cmVVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgY29uc3QgZmlsdGVyID0gc3RhdGUuZmlsdGVyc1thY3Rpb24uaWR4XTtcbiAgY29uc3QgaXNWaXNpYmxlID0gZ2V0KGZpbHRlciwgWyd2YWx1ZScsICdwcm9wZXJ0aWVzJywgJ2lzVmlzaWJsZSddKTtcbiAgY29uc3QgbmV3RmlsdGVyID0ge1xuICAgIC4uLmZpbHRlcixcbiAgICB2YWx1ZTogZmVhdHVyZVRvRmlsdGVyVmFsdWUoZmlsdGVyLnZhbHVlLCBmaWx0ZXIuaWQsIHtcbiAgICAgIGlzVmlzaWJsZTogIWlzVmlzaWJsZVxuICAgIH0pXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBmaWx0ZXJzOiBPYmplY3QuYXNzaWduKFsuLi5zdGF0ZS5maWx0ZXJzXSwge1thY3Rpb24uaWR4XTogbmV3RmlsdGVyfSlcbiAgfTtcbn07XG5cbi8qKlxuICogUmVtb3ZlIGEgZmlsdGVyXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykucmVtb3ZlRmlsdGVyVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHJlbW92ZUZpbHRlclVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCB7aWR4fSA9IGFjdGlvbjtcbiAgY29uc3Qge2RhdGFJZCwgaWR9ID0gc3RhdGUuZmlsdGVyc1tpZHhdO1xuXG4gIGNvbnN0IG5ld0ZpbHRlcnMgPSBbXG4gICAgLi4uc3RhdGUuZmlsdGVycy5zbGljZSgwLCBpZHgpLFxuICAgIC4uLnN0YXRlLmZpbHRlcnMuc2xpY2UoaWR4ICsgMSwgc3RhdGUuZmlsdGVycy5sZW5ndGgpXG4gIF07XG5cbiAgY29uc3QgZmlsdGVyZWREYXRhc2V0cyA9IGFwcGx5RmlsdGVyc1RvRGF0YXNldHMoZGF0YUlkLCBzdGF0ZS5kYXRhc2V0cywgbmV3RmlsdGVycywgc3RhdGUubGF5ZXJzKTtcbiAgY29uc3QgbmV3RWRpdG9yID1cbiAgICBnZXRGaWx0ZXJJZEluRmVhdHVyZShzdGF0ZS5lZGl0b3Iuc2VsZWN0ZWRGZWF0dXJlKSA9PT0gaWRcbiAgICAgID8ge1xuICAgICAgICAgIC4uLnN0YXRlLmVkaXRvcixcbiAgICAgICAgICBzZWxlY3RlZEZlYXR1cmU6IG51bGxcbiAgICAgICAgfVxuICAgICAgOiBzdGF0ZS5lZGl0b3I7XG5cbiAgbGV0IG5ld1N0YXRlID0gc2V0KFsnZmlsdGVycyddLCBuZXdGaWx0ZXJzLCBzdGF0ZSk7XG4gIG5ld1N0YXRlID0gc2V0KFsnZGF0YXNldHMnXSwgZmlsdGVyZWREYXRhc2V0cywgbmV3U3RhdGUpO1xuICBuZXdTdGF0ZSA9IHNldChbJ2VkaXRvciddLCBuZXdFZGl0b3IsIG5ld1N0YXRlKTtcblxuICByZXR1cm4gdXBkYXRlQWxsTGF5ZXJEb21haW5EYXRhKG5ld1N0YXRlLCBkYXRhSWQsIHVuZGVmaW5lZCk7XG59O1xuXG4vKipcbiAqIEFkZCBhIG5ldyBsYXllclxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLmFkZExheWVyVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IGFkZExheWVyVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIGNvbnN0IGRlZmF1bHREYXRhc2V0ID0gT2JqZWN0LmtleXMoc3RhdGUuZGF0YXNldHMpWzBdO1xuICBjb25zdCBuZXdMYXllciA9IG5ldyBMYXllcih7XG4gICAgaXNWaXNpYmxlOiB0cnVlLFxuICAgIGlzQ29uZmlnQWN0aXZlOiB0cnVlLFxuICAgIGRhdGFJZDogZGVmYXVsdERhdGFzZXQsXG4gICAgLi4uYWN0aW9uLnByb3BzXG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgbGF5ZXJzOiBbLi4uc3RhdGUubGF5ZXJzLCBuZXdMYXllcl0sXG4gICAgbGF5ZXJEYXRhOiBbLi4uc3RhdGUubGF5ZXJEYXRhLCB7fV0sXG4gICAgbGF5ZXJPcmRlcjogWy4uLnN0YXRlLmxheWVyT3JkZXIsIHN0YXRlLmxheWVyT3JkZXIubGVuZ3RoXSxcbiAgICBzcGxpdE1hcHM6IGFkZE5ld0xheWVyc1RvU3BsaXRNYXAoc3RhdGUuc3BsaXRNYXBzLCBuZXdMYXllcilcbiAgfTtcbn07XG5cbi8qKlxuICogcmVtb3ZlIGxheWVyXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykucmVtb3ZlTGF5ZXJVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgcmVtb3ZlTGF5ZXJVcGRhdGVyID0gKHN0YXRlLCB7aWR4fSkgPT4ge1xuICBjb25zdCB7bGF5ZXJzLCBsYXllckRhdGEsIGNsaWNrZWQsIGhvdmVySW5mb30gPSBzdGF0ZTtcbiAgY29uc3QgbGF5ZXJUb1JlbW92ZSA9IHN0YXRlLmxheWVyc1tpZHhdO1xuICBjb25zdCBuZXdNYXBzID0gcmVtb3ZlTGF5ZXJGcm9tU3BsaXRNYXBzKHN0YXRlLnNwbGl0TWFwcywgbGF5ZXJUb1JlbW92ZSk7XG5cbiAgY29uc3QgbmV3U3RhdGUgPSB7XG4gICAgLi4uc3RhdGUsXG4gICAgbGF5ZXJzOiBbLi4ubGF5ZXJzLnNsaWNlKDAsIGlkeCksIC4uLmxheWVycy5zbGljZShpZHggKyAxLCBsYXllcnMubGVuZ3RoKV0sXG4gICAgbGF5ZXJEYXRhOiBbLi4ubGF5ZXJEYXRhLnNsaWNlKDAsIGlkeCksIC4uLmxheWVyRGF0YS5zbGljZShpZHggKyAxLCBsYXllckRhdGEubGVuZ3RoKV0sXG4gICAgbGF5ZXJPcmRlcjogc3RhdGUubGF5ZXJPcmRlci5maWx0ZXIoaSA9PiBpICE9PSBpZHgpLm1hcChwaWQgPT4gKHBpZCA+IGlkeCA/IHBpZCAtIDEgOiBwaWQpKSxcbiAgICBjbGlja2VkOiBsYXllclRvUmVtb3ZlLmlzTGF5ZXJIb3ZlcmVkKGNsaWNrZWQpID8gdW5kZWZpbmVkIDogY2xpY2tlZCxcbiAgICBob3ZlckluZm86IGxheWVyVG9SZW1vdmUuaXNMYXllckhvdmVyZWQoaG92ZXJJbmZvKSA/IHVuZGVmaW5lZCA6IGhvdmVySW5mbyxcbiAgICBzcGxpdE1hcHM6IG5ld01hcHNcbiAgICAvLyBUT0RPOiB1cGRhdGUgZmlsdGVycywgY3JlYXRlIGhlbHBlciB0byByZW1vdmUgbGF5ZXIgZm9ybSBmaWx0ZXIgKHJlbW92ZSBsYXllcmlkIGFuZCBkYXRhaWQpIGlmIG1hcHBlZFxuICB9O1xuXG4gIHJldHVybiB1cGRhdGVBbmltYXRpb25Eb21haW4obmV3U3RhdGUpO1xufTtcblxuLyoqXG4gKiBSZW9yZGVyIGxheWVyXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykucmVvcmRlckxheWVyVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHJlb3JkZXJMYXllclVwZGF0ZXIgPSAoc3RhdGUsIHtvcmRlcn0pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBsYXllck9yZGVyOiBvcmRlclxufSk7XG5cbi8qKlxuICogUmVtb3ZlIGEgZGF0YXNldCBhbmQgYWxsIGxheWVycywgZmlsdGVycywgdG9vbHRpcCBjb25maWdzIHRoYXQgYmFzZWQgb24gaXRcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5yZW1vdmVEYXRhc2V0VXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHJlbW92ZURhdGFzZXRVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgLy8gZXh0cmFjdCBkYXRhc2V0IGtleVxuICBjb25zdCB7ZGF0YUlkOiBkYXRhc2V0S2V5fSA9IGFjdGlvbjtcbiAgY29uc3Qge2RhdGFzZXRzfSA9IHN0YXRlO1xuXG4gIC8vIGNoZWNrIGlmIGRhdGFzZXQgaXMgcHJlc2VudFxuICBpZiAoIWRhdGFzZXRzW2RhdGFzZXRLZXldKSB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgY29uc3Qge1xuICAgIGxheWVycyxcbiAgICBkYXRhc2V0czoge1tkYXRhc2V0S2V5XTogZGF0YXNldCwgLi4ubmV3RGF0YXNldHN9XG4gIH0gPSBzdGF0ZTtcbiAgLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xuXG4gIGNvbnN0IGluZGV4ZXMgPSBsYXllcnMucmVkdWNlKChsaXN0T2ZJbmRleGVzLCBsYXllciwgaW5kZXgpID0+IHtcbiAgICBpZiAobGF5ZXIuY29uZmlnLmRhdGFJZCA9PT0gZGF0YXNldEtleSkge1xuICAgICAgbGlzdE9mSW5kZXhlcy5wdXNoKGluZGV4KTtcbiAgICB9XG4gICAgcmV0dXJuIGxpc3RPZkluZGV4ZXM7XG4gIH0sIFtdKTtcblxuICAvLyByZW1vdmUgbGF5ZXJzIGFuZCBkYXRhc2V0c1xuICBjb25zdCB7bmV3U3RhdGV9ID0gaW5kZXhlcy5yZWR1Y2UoXG4gICAgKHtuZXdTdGF0ZTogY3VycmVudFN0YXRlLCBpbmRleENvdW50ZXJ9LCBpZHgpID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IGlkeCAtIGluZGV4Q291bnRlcjtcbiAgICAgIGN1cnJlbnRTdGF0ZSA9IHJlbW92ZUxheWVyVXBkYXRlcihjdXJyZW50U3RhdGUsIHtpZHg6IGN1cnJlbnRJbmRleH0pO1xuICAgICAgaW5kZXhDb3VudGVyKys7XG4gICAgICByZXR1cm4ge25ld1N0YXRlOiBjdXJyZW50U3RhdGUsIGluZGV4Q291bnRlcn07XG4gICAgfSxcbiAgICB7bmV3U3RhdGU6IHsuLi5zdGF0ZSwgZGF0YXNldHM6IG5ld0RhdGFzZXRzfSwgaW5kZXhDb3VudGVyOiAwfVxuICApO1xuXG4gIC8vIHJlbW92ZSBmaWx0ZXJzXG4gIGNvbnN0IGZpbHRlcnMgPSBzdGF0ZS5maWx0ZXJzLmZpbHRlcihmaWx0ZXIgPT4gIWZpbHRlci5kYXRhSWQuaW5jbHVkZXMoZGF0YXNldEtleSkpO1xuXG4gIC8vIHVwZGF0ZSBpbnRlcmFjdGlvbkNvbmZpZ1xuICBsZXQge2ludGVyYWN0aW9uQ29uZmlnfSA9IHN0YXRlO1xuICBjb25zdCB7dG9vbHRpcH0gPSBpbnRlcmFjdGlvbkNvbmZpZztcbiAgaWYgKHRvb2x0aXApIHtcbiAgICBjb25zdCB7Y29uZmlnfSA9IHRvb2x0aXA7XG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgICBjb25zdCB7W2RhdGFzZXRLZXldOiBmaWVsZHMsIC4uLmZpZWxkc1RvU2hvd30gPSBjb25maWcuZmllbGRzVG9TaG93O1xuICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgICBpbnRlcmFjdGlvbkNvbmZpZyA9IHtcbiAgICAgIC4uLmludGVyYWN0aW9uQ29uZmlnLFxuICAgICAgdG9vbHRpcDogey4uLnRvb2x0aXAsIGNvbmZpZzogey4uLmNvbmZpZywgZmllbGRzVG9TaG93fX1cbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHsuLi5uZXdTdGF0ZSwgZmlsdGVycywgaW50ZXJhY3Rpb25Db25maWd9O1xufTtcblxuLyoqXG4gKiB1cGRhdGUgbGF5ZXIgYmxlbmRpbmcgbW9kZVxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLnVwZGF0ZUxheWVyQmxlbmRpbmdVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgdXBkYXRlTGF5ZXJCbGVuZGluZ1VwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGxheWVyQmxlbmRpbmc6IGFjdGlvbi5tb2RlXG59KTtcblxuLyoqXG4gKiBEaXNwbGF5IGRhdGFzZXQgdGFibGUgaW4gYSBtb2RhbFxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLnNob3dEYXRhc2V0VGFibGVVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3Qgc2hvd0RhdGFzZXRUYWJsZVVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGVkaXRpbmdEYXRhc2V0OiBhY3Rpb24uZGF0YUlkXG4gIH07XG59O1xuXG4vKipcbiAqIHJlc2V0IHZpc1N0YXRlIHRvIGluaXRpYWwgU3RhdGVcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5yZXNldE1hcENvbmZpZ1VwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCByZXNldE1hcENvbmZpZ1VwZGF0ZXIgPSBzdGF0ZSA9PiAoe1xuICAuLi5JTklUSUFMX1ZJU19TVEFURSxcbiAgLi4uc3RhdGUuaW5pdGlhbFN0YXRlLFxuICBpbml0aWFsU3RhdGU6IHN0YXRlLmluaXRpYWxTdGF0ZVxufSk7XG5cbi8qKlxuICogUHJvcGFnYXRlIGB2aXNTdGF0ZWAgcmVkdWNlciB3aXRoIGEgbmV3IGNvbmZpZ3VyYXRpb24uIEN1cnJlbnQgY29uZmlnIHdpbGwgYmUgb3ZlcnJpZGUuXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykucmVjZWl2ZU1hcENvbmZpZ1VwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCByZWNlaXZlTWFwQ29uZmlnVXBkYXRlciA9IChzdGF0ZSwge3BheWxvYWQ6IHtjb25maWcgPSB7fSwgb3B0aW9ucyA9IHt9fX0pID0+IHtcbiAgaWYgKCFjb25maWcudmlzU3RhdGUpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICBjb25zdCB7XG4gICAgZmlsdGVycyxcbiAgICBsYXllcnMsXG4gICAgaW50ZXJhY3Rpb25Db25maWcsXG4gICAgbGF5ZXJCbGVuZGluZyxcbiAgICBzcGxpdE1hcHMsXG4gICAgYW5pbWF0aW9uQ29uZmlnXG4gIH0gPSBjb25maWcudmlzU3RhdGU7XG5cbiAgY29uc3Qge2tlZXBFeGlzdGluZ0NvbmZpZ30gPSBvcHRpb25zO1xuXG4gIC8vIHJlc2V0IGNvbmZpZyBpZiBrZWVwRXhpc3RpbmdDb25maWcgaXMgZmFsc3lcbiAgbGV0IG1lcmdlZFN0YXRlID0gIWtlZXBFeGlzdGluZ0NvbmZpZyA/IHJlc2V0TWFwQ29uZmlnVXBkYXRlcihzdGF0ZSkgOiBzdGF0ZTtcbiAgbWVyZ2VkU3RhdGUgPSBtZXJnZUxheWVycyhtZXJnZWRTdGF0ZSwgbGF5ZXJzKTtcbiAgbWVyZ2VkU3RhdGUgPSBtZXJnZUZpbHRlcnMobWVyZ2VkU3RhdGUsIGZpbHRlcnMpO1xuICBtZXJnZWRTdGF0ZSA9IG1lcmdlSW50ZXJhY3Rpb25zKG1lcmdlZFN0YXRlLCBpbnRlcmFjdGlvbkNvbmZpZyk7XG4gIG1lcmdlZFN0YXRlID0gbWVyZ2VMYXllckJsZW5kaW5nKG1lcmdlZFN0YXRlLCBsYXllckJsZW5kaW5nKTtcbiAgbWVyZ2VkU3RhdGUgPSBtZXJnZVNwbGl0TWFwcyhtZXJnZWRTdGF0ZSwgc3BsaXRNYXBzKTtcbiAgbWVyZ2VkU3RhdGUgPSBtZXJnZUFuaW1hdGlvbkNvbmZpZyhtZXJnZWRTdGF0ZSwgYW5pbWF0aW9uQ29uZmlnKTtcblxuICByZXR1cm4gbWVyZ2VkU3RhdGU7XG59O1xuXG4vKipcbiAqIFRyaWdnZXIgbGF5ZXIgaG92ZXIgZXZlbnQgd2l0aCBob3ZlcmVkIG9iamVjdFxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLmxheWVySG92ZXJVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgbGF5ZXJIb3ZlclVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGhvdmVySW5mbzogYWN0aW9uLmluZm9cbn0pO1xuXG4vKiBlc2xpbnQtZW5hYmxlIG1heC1zdGF0ZW1lbnRzICovXG5cbi8qKlxuICogVXBkYXRlIGBpbnRlcmFjdGlvbkNvbmZpZ2BcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5pbnRlcmFjdGlvbkNvbmZpZ0NoYW5nZVVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnRlcmFjdGlvbkNvbmZpZ0NoYW5nZVVwZGF0ZXIoc3RhdGUsIGFjdGlvbikge1xuICBjb25zdCB7Y29uZmlnfSA9IGFjdGlvbjtcblxuICBjb25zdCBpbnRlcmFjdGlvbkNvbmZpZyA9IHtcbiAgICAuLi5zdGF0ZS5pbnRlcmFjdGlvbkNvbmZpZyxcbiAgICAuLi57W2NvbmZpZy5pZF06IGNvbmZpZ31cbiAgfTtcblxuICAvLyBEb24ndCBlbmFibGUgdG9vbHRpcCBhbmQgYnJ1c2ggYXQgdGhlIHNhbWUgdGltZVxuICAvLyBidXQgY29vcmRpbmF0ZXMgY2FuIGJlIHNob3duIGF0IGFsbCB0aW1lXG4gIGNvbnN0IGNvbnRyYWRpY3QgPSBbJ2JydXNoJywgJ3Rvb2x0aXAnXTtcblxuICBpZiAoXG4gICAgY29udHJhZGljdC5pbmNsdWRlcyhjb25maWcuaWQpICYmXG4gICAgY29uZmlnLmVuYWJsZWQgJiZcbiAgICAhc3RhdGUuaW50ZXJhY3Rpb25Db25maWdbY29uZmlnLmlkXS5lbmFibGVkXG4gICkge1xuICAgIC8vIG9ubHkgZW5hYmxlIG9uZSBpbnRlcmFjdGlvbiBhdCBhIHRpbWVcbiAgICBjb250cmFkaWN0LmZvckVhY2goayA9PiB7XG4gICAgICBpZiAoayAhPT0gY29uZmlnLmlkKSB7XG4gICAgICAgIGludGVyYWN0aW9uQ29uZmlnW2tdID0gey4uLmludGVyYWN0aW9uQ29uZmlnW2tdLCBlbmFibGVkOiBmYWxzZX07XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBjb25zdCBuZXdTdGF0ZSA9IHtcbiAgICAuLi5zdGF0ZSxcbiAgICBpbnRlcmFjdGlvbkNvbmZpZ1xuICB9O1xuXG4gIGlmIChjb25maWcuaWQgPT09ICdnZW9jb2RlcicgJiYgIWNvbmZpZy5lbmFibGVkKSB7XG4gICAgcmV0dXJuIHJlbW92ZURhdGFzZXRVcGRhdGVyKG5ld1N0YXRlLCB7ZGF0YUlkOiAnZ2VvY29kZXJfZGF0YXNldCd9KTtcbiAgfVxuXG4gIHJldHVybiBuZXdTdGF0ZTtcbn1cblxuLyoqXG4gKiBUcmlnZ2VyIGxheWVyIGNsaWNrIGV2ZW50IHdpdGggY2xpY2tlZCBvYmplY3RcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5sYXllckNsaWNrVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IGxheWVyQ2xpY2tVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBtb3VzZVBvczogc3RhdGUuaW50ZXJhY3Rpb25Db25maWcuY29vcmRpbmF0ZS5lbmFibGVkXG4gICAgPyB7XG4gICAgICAgIC4uLnN0YXRlLm1vdXNlUG9zLFxuICAgICAgICBwaW5uZWQ6IHN0YXRlLm1vdXNlUG9zLnBpbm5lZCA/IG51bGwgOiBjbG9uZURlZXAoc3RhdGUubW91c2VQb3MpXG4gICAgICB9XG4gICAgOiBzdGF0ZS5tb3VzZVBvcyxcbiAgY2xpY2tlZDogYWN0aW9uLmluZm8gJiYgYWN0aW9uLmluZm8ucGlja2VkID8gYWN0aW9uLmluZm8gOiBudWxsXG59KTtcblxuLyoqXG4gKiBUcmlnZ2VyIG1hcCBjbGljayBldmVudCwgdW5zZWxlY3QgY2xpY2tlZCBvYmplY3RcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5tYXBDbGlja1VwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBtYXBDbGlja1VwZGF0ZXIgPSBzdGF0ZSA9PiB7XG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgY2xpY2tlZDogbnVsbFxuICB9O1xufTtcblxuLyoqXG4gKiBUcmlnZ2VyIG1hcCBtb3ZlIGV2ZW50XG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykubW91c2VNb3ZlVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IG1vdXNlTW92ZVVwZGF0ZXIgPSAoc3RhdGUsIHtldnR9KSA9PiB7XG4gIGlmIChPYmplY3QudmFsdWVzKHN0YXRlLmludGVyYWN0aW9uQ29uZmlnKS5zb21lKGNvbmZpZyA9PiBjb25maWcuZW5hYmxlZCkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBtb3VzZVBvczoge1xuICAgICAgICAuLi5zdGF0ZS5tb3VzZVBvcyxcbiAgICAgICAgbW91c2VQb3NpdGlvbjogWy4uLmV2dC5wb2ludF0sXG4gICAgICAgIGNvb3JkaW5hdGU6IFsuLi5ldnQubG5nTGF0XVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICByZXR1cm4gc3RhdGU7XG59O1xuLyoqXG4gKiBUb2dnbGUgdmlzaWJpbGl0eSBvZiBhIGxheWVyIGZvciBhIHNwbGl0IG1hcFxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLnRvZ2dsZVNwbGl0TWFwVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHRvZ2dsZVNwbGl0TWFwVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PlxuICBzdGF0ZS5zcGxpdE1hcHMgJiYgc3RhdGUuc3BsaXRNYXBzLmxlbmd0aCA9PT0gMFxuICAgID8ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgLy8gbWF5YmUgd2Ugc2hvdWxkIHVzZSBhbiBhcnJheSB0byBzdG9yZSBzdGF0ZSBmb3IgYSBzaW5nbGUgbWFwIGFzIHdlbGxcbiAgICAgICAgLy8gaWYgY3VycmVudCBtYXBzIGxlbmd0aCBpcyBlcXVhbCB0byAwIGl0IG1lYW5zIHRoYXQgd2UgYXJlIGFib3V0IHRvIHNwbGl0IHRoZSB2aWV3XG4gICAgICAgIHNwbGl0TWFwczogY29tcHV0ZVNwbGl0TWFwTGF5ZXJzKHN0YXRlLmxheWVycylcbiAgICAgIH1cbiAgICA6IGNsb3NlU3BlY2lmaWNNYXBBdEluZGV4KHN0YXRlLCBhY3Rpb24pO1xuXG4vKipcbiAqIFRvZ2dsZSB2aXNpYmlsaXR5IG9mIGEgbGF5ZXIgaW4gYSBzcGxpdCBtYXBcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS50b2dnbGVMYXllckZvck1hcFVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCB0b2dnbGVMYXllckZvck1hcFVwZGF0ZXIgPSAoc3RhdGUsIHttYXBJbmRleCwgbGF5ZXJJZH0pID0+IHtcbiAgY29uc3Qge3NwbGl0TWFwc30gPSBzdGF0ZTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIHNwbGl0TWFwczogc3BsaXRNYXBzLm1hcCgoc20sIGkpID0+XG4gICAgICBpID09PSBtYXBJbmRleFxuICAgICAgICA/IHtcbiAgICAgICAgICAgIC4uLnNwbGl0TWFwc1tpXSxcbiAgICAgICAgICAgIGxheWVyczoge1xuICAgICAgICAgICAgICAuLi5zcGxpdE1hcHNbaV0ubGF5ZXJzLFxuICAgICAgICAgICAgICAvLyBpZiBsYXllcklkIG5vdCBpbiBsYXllcnMsIHNldCBpdCB0byB2aXNpYmxlXG4gICAgICAgICAgICAgIFtsYXllcklkXTogIXNwbGl0TWFwc1tpXS5sYXllcnNbbGF5ZXJJZF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIDogc21cbiAgICApXG4gIH07XG59O1xuXG4vKipcbiAqIEFkZCBuZXcgZGF0YXNldCB0byBgdmlzU3RhdGVgLCB3aXRoIG9wdGlvbiB0byBsb2FkIGEgbWFwIGNvbmZpZyBhbG9uZyB3aXRoIHRoZSBkYXRhc2V0c1xuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLnVwZGF0ZVZpc0RhdGFVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtc3RhdGVtZW50cyAqL1xuZXhwb3J0IGNvbnN0IHVwZGF0ZVZpc0RhdGFVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgLy8gZGF0YXNldHMgY2FuIGJlIGEgc2luZ2xlIGRhdGEgZW50cmllcyBvciBhbiBhcnJheSBvZiBtdWx0aXBsZSBkYXRhIGVudHJpZXNcbiAgY29uc3Qge2NvbmZpZywgb3B0aW9uc30gPSBhY3Rpb247XG5cbiAgY29uc3QgZGF0YXNldHMgPSB0b0FycmF5KGFjdGlvbi5kYXRhc2V0cyk7XG5cbiAgY29uc3QgbmV3RGF0YUVudHJpZXMgPSBkYXRhc2V0cy5yZWR1Y2UoXG4gICAgKGFjY3UsIHtpbmZvID0ge30sIGRhdGF9KSA9PiAoe1xuICAgICAgLi4uYWNjdSxcbiAgICAgIC4uLihjcmVhdGVOZXdEYXRhRW50cnkoe2luZm8sIGRhdGF9LCBzdGF0ZS5kYXRhc2V0cykgfHwge30pXG4gICAgfSksXG4gICAge31cbiAgKTtcblxuICBpZiAoIU9iamVjdC5rZXlzKG5ld0RhdGFFbnRyaWVzKS5sZW5ndGgpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICAvLyBhcHBseSBjb25maWcgaWYgcGFzc2VkIGZyb20gYWN0aW9uXG4gIGNvbnN0IHByZXZpb3VzU3RhdGUgPSBjb25maWdcbiAgICA/IHJlY2VpdmVNYXBDb25maWdVcGRhdGVyKHN0YXRlLCB7XG4gICAgICAgIHBheWxvYWQ6IHtjb25maWcsIG9wdGlvbnN9XG4gICAgICB9KVxuICAgIDogc3RhdGU7XG5cbiAgY29uc3Qgc3RhdGVXaXRoTmV3RGF0YSA9IHtcbiAgICAuLi5wcmV2aW91c1N0YXRlLFxuICAgIGRhdGFzZXRzOiB7XG4gICAgICAuLi5wcmV2aW91c1N0YXRlLmRhdGFzZXRzLFxuICAgICAgLi4ubmV3RGF0YUVudHJpZXNcbiAgICB9XG4gIH07XG5cbiAgLy8gcHJldmlvdXNseSBzYXZlZCBjb25maWcgYmVmb3JlIGRhdGEgbG9hZGVkXG4gIGNvbnN0IHtcbiAgICBmaWx0ZXJUb0JlTWVyZ2VkID0gW10sXG4gICAgbGF5ZXJUb0JlTWVyZ2VkID0gW10sXG4gICAgaW50ZXJhY3Rpb25Ub0JlTWVyZ2VkID0ge30sXG4gICAgc3BsaXRNYXBzVG9CZU1lcmdlZCA9IFtdXG4gIH0gPSBzdGF0ZVdpdGhOZXdEYXRhO1xuXG4gIC8vIFdlIG5lZWQgdG8gbWVyZ2UgbGF5ZXJzIGJlZm9yZSBmaWx0ZXJzIGJlY2F1c2UgcG9seWdvbiBmaWx0ZXJzIHJlcXVpcmVzIGxheWVycyB0byBiZSBsb2FkZWRcbiAgbGV0IG1lcmdlZFN0YXRlID0gbWVyZ2VMYXllcnMoc3RhdGVXaXRoTmV3RGF0YSwgbGF5ZXJUb0JlTWVyZ2VkKTtcblxuICBtZXJnZWRTdGF0ZSA9IG1lcmdlRmlsdGVycyhtZXJnZWRTdGF0ZSwgZmlsdGVyVG9CZU1lcmdlZCk7XG5cbiAgLy8gbWVyZ2Ugc3RhdGUgd2l0aCBzYXZlZCBzcGxpdE1hcHNcbiAgbWVyZ2VkU3RhdGUgPSBtZXJnZVNwbGl0TWFwcyhtZXJnZWRTdGF0ZSwgc3BsaXRNYXBzVG9CZU1lcmdlZCk7XG5cbiAgbGV0IG5ld0xheWVycyA9IG1lcmdlZFN0YXRlLmxheWVycy5maWx0ZXIobCA9PiBsLmNvbmZpZy5kYXRhSWQgaW4gbmV3RGF0YUVudHJpZXMpO1xuXG4gIGlmICghbmV3TGF5ZXJzLmxlbmd0aCkge1xuICAgIC8vIG5vIGxheWVyIG1lcmdlZCwgZmluZCBkZWZhdWx0c1xuICAgIGNvbnN0IHJlc3VsdCA9IGFkZERlZmF1bHRMYXllcnMobWVyZ2VkU3RhdGUsIG5ld0RhdGFFbnRyaWVzKTtcbiAgICBtZXJnZWRTdGF0ZSA9IHJlc3VsdC5zdGF0ZTtcbiAgICBuZXdMYXllcnMgPSByZXN1bHQubmV3TGF5ZXJzO1xuICB9XG5cbiAgaWYgKG1lcmdlZFN0YXRlLnNwbGl0TWFwcy5sZW5ndGgpIHtcbiAgICAvLyBpZiBtYXAgaXMgc3BsaXQsIGFkZCBuZXcgbGF5ZXJzIHRvIHNwbGl0TWFwc1xuICAgIG5ld0xheWVycyA9IG1lcmdlZFN0YXRlLmxheWVycy5maWx0ZXIobCA9PiBsLmNvbmZpZy5kYXRhSWQgaW4gbmV3RGF0YUVudHJpZXMpO1xuICAgIG1lcmdlZFN0YXRlID0ge1xuICAgICAgLi4ubWVyZ2VkU3RhdGUsXG4gICAgICBzcGxpdE1hcHM6IGFkZE5ld0xheWVyc1RvU3BsaXRNYXAobWVyZ2VkU3RhdGUuc3BsaXRNYXBzLCBuZXdMYXllcnMpXG4gICAgfTtcbiAgfVxuXG4gIC8vIG1lcmdlIHN0YXRlIHdpdGggc2F2ZWQgaW50ZXJhY3Rpb25zXG4gIG1lcmdlZFN0YXRlID0gbWVyZ2VJbnRlcmFjdGlvbnMobWVyZ2VkU3RhdGUsIGludGVyYWN0aW9uVG9CZU1lcmdlZCk7XG5cbiAgLy8gaWYgbm8gdG9vbHRpcHMgbWVyZ2VkIGFkZCBkZWZhdWx0IHRvb2x0aXBzXG4gIE9iamVjdC5rZXlzKG5ld0RhdGFFbnRyaWVzKS5mb3JFYWNoKGRhdGFJZCA9PiB7XG4gICAgY29uc3QgdG9vbHRpcEZpZWxkcyA9IG1lcmdlZFN0YXRlLmludGVyYWN0aW9uQ29uZmlnLnRvb2x0aXAuY29uZmlnLmZpZWxkc1RvU2hvd1tkYXRhSWRdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheSh0b29sdGlwRmllbGRzKSB8fCAhdG9vbHRpcEZpZWxkcy5sZW5ndGgpIHtcbiAgICAgIG1lcmdlZFN0YXRlID0gYWRkRGVmYXVsdFRvb2x0aXBzKG1lcmdlZFN0YXRlLCBuZXdEYXRhRW50cmllc1tkYXRhSWRdKTtcbiAgICB9XG4gIH0pO1xuXG4gIGxldCB1cGRhdGVkU3RhdGUgPSB1cGRhdGVBbGxMYXllckRvbWFpbkRhdGEobWVyZ2VkU3RhdGUsIE9iamVjdC5rZXlzKG5ld0RhdGFFbnRyaWVzKSwgdW5kZWZpbmVkKTtcblxuICAvLyByZWdpc3RlciBsYXllciBhbmltYXRpb24gZG9tYWluLFxuICAvLyBuZWVkIHRvIGJlIGNhbGxlZCBhZnRlciBsYXllciBkYXRhIGlzIGNhbGN1bGF0ZWRcbiAgdXBkYXRlZFN0YXRlID0gdXBkYXRlQW5pbWF0aW9uRG9tYWluKHVwZGF0ZWRTdGF0ZSk7XG5cbiAgcmV0dXJuIHVwZGF0ZWRTdGF0ZTtcbn07XG4vKiBlc2xpbnQtZW5hYmxlIG1heC1zdGF0ZW1lbnRzICovXG5cbi8qKlxuICogV2hlbiBhIHVzZXIgY2xpY2tzIG9uIHRoZSBzcGVjaWZpYyBtYXAgY2xvc2luZyBpY29uXG4gKiB0aGUgYXBwbGljYXRpb24gd2lsbCBjbG9zZSB0aGUgc2VsZWN0ZWQgbWFwXG4gKiBhbmQgd2lsbCBtZXJnZSB0aGUgcmVtYWluaW5nIG9uZSB3aXRoIHRoZSBnbG9iYWwgc3RhdGVcbiAqIFRPRE86IGkgdGhpbmsgaW4gdGhlIGZ1dHVyZSB0aGlzIGFjdGlvbiBzaG91bGQgYmUgY2FsbGVkIG1lcmdlIG1hcCBsYXllcnMgd2l0aCBnbG9iYWwgc2V0dGluZ3NcbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZSBgdmlzU3RhdGVgXG4gKiBAcGFyYW0ge09iamVjdH0gYWN0aW9uIGFjdGlvblxuICogQHJldHVybnMge09iamVjdH0gbmV4dFN0YXRlXG4gKi9cbmZ1bmN0aW9uIGNsb3NlU3BlY2lmaWNNYXBBdEluZGV4KHN0YXRlLCBhY3Rpb24pIHtcbiAgLy8gcmV0cmlldmUgbGF5ZXJzIG1ldGEgZGF0YSBmcm9tIHRoZSByZW1haW5pbmcgbWFwIHRoYXQgd2UgbmVlZCB0byBrZWVwXG4gIGNvbnN0IGluZGV4VG9SZXRyaWV2ZSA9IDEgLSBhY3Rpb24ucGF5bG9hZDtcbiAgY29uc3QgbWFwTGF5ZXJzID0gc3RhdGUuc3BsaXRNYXBzW2luZGV4VG9SZXRyaWV2ZV0ubGF5ZXJzO1xuICBjb25zdCB7bGF5ZXJzfSA9IHN0YXRlO1xuXG4gIC8vIHVwZGF0ZSBsYXllciB2aXNpYmlsaXR5XG4gIGNvbnN0IG5ld0xheWVycyA9IGxheWVycy5tYXAobGF5ZXIgPT5cbiAgICAhbWFwTGF5ZXJzW2xheWVyLmlkXSAmJiBsYXllci5jb25maWcuaXNWaXNpYmxlXG4gICAgICA/IGxheWVyLnVwZGF0ZUxheWVyQ29uZmlnKHtcbiAgICAgICAgICAvLyBpZiBsYXllci5pZCBpcyBub3QgaW4gbWFwTGF5ZXJzLCBpdCBzaG91bGQgYmUgaW5WaXNpYmxlXG4gICAgICAgICAgaXNWaXNpYmxlOiBmYWxzZVxuICAgICAgICB9KVxuICAgICAgOiBsYXllclxuICApO1xuXG4gIC8vIGRlbGV0ZSBtYXBcbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBsYXllcnM6IG5ld0xheWVycyxcbiAgICBzcGxpdE1hcHM6IFtdXG4gIH07XG59XG5cbi8qKlxuICogVHJpZ2dlciBmaWxlIGxvYWRpbmcgZGlzcGF0Y2ggYGFkZERhdGFUb01hcGAgaWYgc3VjY2VlZCwgb3IgYGxvYWRGaWxlc0VycmAgaWYgZmFpbGVkXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykubG9hZEZpbGVzVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IGxvYWRGaWxlc1VwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCB7ZmlsZXMsIG9uRmluaXNoID0gbG9hZEZpbGVTdWNjZXNzfSA9IGFjdGlvbjtcbiAgaWYgKCFmaWxlcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICBjb25zdCBmaWxlQ2FjaGUgPSBbXTtcbiAgcmV0dXJuIHdpdGhUYXNrKFxuICAgIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgZmlsZUxvYWRpbmc6IHRydWUsXG4gICAgICBmaWxlTG9hZGluZ1Byb2dyZXNzOiAwXG4gICAgfSxcbiAgICBtYWtlTG9hZEZpbGVUYXNrKGZpbGVzLmxlbmd0aCwgZmlsZXMsIGZpbGVDYWNoZSwgb25GaW5pc2gpXG4gICk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gbG9hZE5leHRGaWxlVXBkYXRlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIGNvbnN0IHtmaWxlQ2FjaGUsIGZpbGVzVG9Mb2FkLCB0b3RhbENvdW50LCBvbkZpbmlzaH0gPSBhY3Rpb247XG4gIGNvbnN0IGZpbGVMb2FkaW5nUHJvZ3Jlc3MgPSAoKHRvdGFsQ291bnQgLSBmaWxlc1RvTG9hZC5sZW5ndGgpIC8gdG90YWxDb3VudCkgKiAxMDA7XG5cbiAgcmV0dXJuIHdpdGhUYXNrKFxuICAgIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgZmlsZUxvYWRpbmdQcm9ncmVzc1xuICAgIH0sXG4gICAgbWFrZUxvYWRGaWxlVGFzayh0b3RhbENvdW50LCBmaWxlc1RvTG9hZCwgZmlsZUNhY2hlLCBvbkZpbmlzaClcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VMb2FkRmlsZVRhc2sodG90YWxDb3VudCwgZmlsZXNUb0xvYWQsIGZpbGVDYWNoZSwgb25GaW5pc2gpIHtcbiAgY29uc3QgW2ZpbGUsIC4uLnJlbWFpbmluZ0ZpbGVzVG9Mb2FkXSA9IGZpbGVzVG9Mb2FkO1xuXG4gIHJldHVybiBMT0FEX0ZJTEVfVEFTSyh7ZmlsZSwgZmlsZUNhY2hlfSkuYmltYXAoXG4gICAgLy8gc3VjY2Vzc1xuICAgIHJlc3VsdCA9PlxuICAgICAgcmVtYWluaW5nRmlsZXNUb0xvYWQubGVuZ3RoXG4gICAgICAgID8gbG9hZE5leHRGaWxlKHtcbiAgICAgICAgICAgIGZpbGVDYWNoZTogcmVzdWx0LFxuICAgICAgICAgICAgZmlsZXNUb0xvYWQ6IHJlbWFpbmluZ0ZpbGVzVG9Mb2FkLFxuICAgICAgICAgICAgdG90YWxDb3VudCxcbiAgICAgICAgICAgIG9uRmluaXNoXG4gICAgICAgICAgfSlcbiAgICAgICAgOiBvbkZpbmlzaChyZXN1bHQpLFxuICAgIC8vIGVycm9yXG4gICAgbG9hZEZpbGVzRXJyXG4gICk7XG59XG5cbi8qKlxuICogVHJpZ2dlciBsb2FkaW5nIGZpbGUgZXJyb3JcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5sb2FkRmlsZXNFcnJVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgbG9hZEZpbGVzRXJyVXBkYXRlciA9IChzdGF0ZSwge2Vycm9yfSkgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGZpbGVMb2FkaW5nOiBmYWxzZSxcbiAgZmlsZUxvYWRpbmdFcnI6IGVycm9yXG59KTtcblxuLyoqXG4gKiBXaGVuIHNlbGVjdCBkYXRhc2V0IGZvciBleHBvcnQsIGFwcGx5IGNwdSBmaWx0ZXIgdG8gc2VsZWN0ZWQgZGF0YXNldFxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLmFwcGx5Q1BVRmlsdGVyVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IGFwcGx5Q1BVRmlsdGVyVXBkYXRlciA9IChzdGF0ZSwge2RhdGFJZH0pID0+IHtcbiAgLy8gYXBwbHkgY3B1RmlsdGVyXG4gIGNvbnN0IGRhdGFJZHMgPSB0b0FycmF5KGRhdGFJZCk7XG5cbiAgcmV0dXJuIGRhdGFJZHMucmVkdWNlKChhY2N1LCBpZCkgPT4gZmlsdGVyRGF0YXNldENQVShhY2N1LCBpZCksIHN0YXRlKTtcbn07XG5cbi8qKlxuICogVXNlciBpbnB1dCB0byB1cGRhdGUgdGhlIGluZm8gb2YgdGhlIG1hcFxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLnNldE1hcEluZm9VcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3Qgc2V0TWFwSW5mb1VwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIG1hcEluZm86IHtcbiAgICAuLi5zdGF0ZS5tYXBJbmZvLFxuICAgIC4uLmFjdGlvbi5pbmZvXG4gIH1cbn0pO1xuLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb24gdG8gdXBkYXRlIEFsbCBsYXllciBkb21haW4gYW5kIGxheWVyIGRhdGEgb2Ygc3RhdGVcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLmFkZERlZmF1bHRMYXllcnN9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGREZWZhdWx0TGF5ZXJzKHN0YXRlLCBkYXRhc2V0cykge1xuICBjb25zdCBkZWZhdWx0TGF5ZXJzID0gT2JqZWN0LnZhbHVlcyhkYXRhc2V0cykucmVkdWNlKFxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICAoYWNjdSwgZGF0YXNldCkgPT4gWy4uLmFjY3UsIC4uLihmaW5kRGVmYXVsdExheWVyKGRhdGFzZXQsIHN0YXRlLmxheWVyQ2xhc3NlcykgfHwgW10pXSxcbiAgICBbXVxuICApO1xuXG4gIHJldHVybiB7XG4gICAgc3RhdGU6IHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgbGF5ZXJzOiBbLi4uc3RhdGUubGF5ZXJzLCAuLi5kZWZhdWx0TGF5ZXJzXSxcbiAgICAgIGxheWVyT3JkZXI6IFtcbiAgICAgICAgLy8gcHV0IG5ldyBsYXllcnMgb24gdG9wIG9mIG9sZCBvbmVzXG4gICAgICAgIC4uLmRlZmF1bHRMYXllcnMubWFwKChfLCBpKSA9PiBzdGF0ZS5sYXllcnMubGVuZ3RoICsgaSksXG4gICAgICAgIC4uLnN0YXRlLmxheWVyT3JkZXJcbiAgICAgIF1cbiAgICB9LFxuICAgIG5ld0xheWVyczogZGVmYXVsdExheWVyc1xuICB9O1xufVxuXG4vKipcbiAqIGhlbHBlciBmdW5jdGlvbiB0byBmaW5kIGRlZmF1bHQgdG9vbHRpcHNcbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZVxuICogQHBhcmFtIHtPYmplY3R9IGRhdGFzZXRcbiAqIEByZXR1cm5zIHtPYmplY3R9IG5leHRTdGF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkRGVmYXVsdFRvb2x0aXBzKHN0YXRlLCBkYXRhc2V0KSB7XG4gIGNvbnN0IHRvb2x0aXBGaWVsZHMgPSBmaW5kRmllbGRzVG9TaG93KGRhdGFzZXQpO1xuICBjb25zdCBtZXJnZWQgPSB7XG4gICAgLi4uc3RhdGUuaW50ZXJhY3Rpb25Db25maWcudG9vbHRpcC5jb25maWcuZmllbGRzVG9TaG93LFxuICAgIC4uLnRvb2x0aXBGaWVsZHNcbiAgfTtcblxuICByZXR1cm4gc2V0KFsnaW50ZXJhY3Rpb25Db25maWcnLCAndG9vbHRpcCcsICdjb25maWcnLCAnZmllbGRzVG9TaG93J10sIG1lcmdlZCwgc3RhdGUpO1xufVxuXG4vKipcbiAqIEhlbHBlciBmdW5jdGlvbiB0byB1cGRhdGUgbGF5ZXIgZG9tYWlucyBmb3IgYW4gYXJyYXkgb2YgZGF0YXNldHNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLnVwZGF0ZUFsbExheWVyRG9tYWluRGF0YX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUFsbExheWVyRG9tYWluRGF0YShzdGF0ZSwgZGF0YUlkLCB1cGRhdGVkRmlsdGVyKSB7XG4gIGNvbnN0IGRhdGFJZHMgPSB0eXBlb2YgZGF0YUlkID09PSAnc3RyaW5nJyA/IFtkYXRhSWRdIDogZGF0YUlkO1xuICBjb25zdCBuZXdMYXllcnMgPSBbXTtcbiAgY29uc3QgbmV3TGF5ZXJEYXRhID0gW107XG5cbiAgc3RhdGUubGF5ZXJzLmZvckVhY2goKG9sZExheWVyLCBpKSA9PiB7XG4gICAgaWYgKG9sZExheWVyLmNvbmZpZy5kYXRhSWQgJiYgZGF0YUlkcy5pbmNsdWRlcyhvbGRMYXllci5jb25maWcuZGF0YUlkKSkge1xuICAgICAgLy8gTm8gbmVlZCB0byByZWNhbGN1bGF0ZSBsYXllciBkb21haW4gaWYgZmlsdGVyIGhhcyBmaXhlZCBkb21haW5cbiAgICAgIGNvbnN0IG5ld0xheWVyID1cbiAgICAgICAgdXBkYXRlZEZpbHRlciAmJiB1cGRhdGVkRmlsdGVyLmZpeGVkRG9tYWluXG4gICAgICAgICAgPyBvbGRMYXllclxuICAgICAgICAgIDogb2xkTGF5ZXIudXBkYXRlTGF5ZXJEb21haW4oc3RhdGUuZGF0YXNldHMsIHVwZGF0ZWRGaWx0ZXIpO1xuXG4gICAgICBjb25zdCB7bGF5ZXJEYXRhLCBsYXllcn0gPSBjYWxjdWxhdGVMYXllckRhdGEobmV3TGF5ZXIsIHN0YXRlLCBzdGF0ZS5sYXllckRhdGFbaV0pO1xuXG4gICAgICBuZXdMYXllcnMucHVzaChsYXllcik7XG4gICAgICBuZXdMYXllckRhdGEucHVzaChsYXllckRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdMYXllcnMucHVzaChvbGRMYXllcik7XG4gICAgICBuZXdMYXllckRhdGEucHVzaChzdGF0ZS5sYXllckRhdGFbaV0pO1xuICAgIH1cbiAgfSk7XG5cbiAgY29uc3QgbmV3U3RhdGUgPSB7XG4gICAgLi4uc3RhdGUsXG4gICAgbGF5ZXJzOiBuZXdMYXllcnMsXG4gICAgbGF5ZXJEYXRhOiBuZXdMYXllckRhdGFcbiAgfTtcblxuICByZXR1cm4gbmV3U3RhdGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVBbmltYXRpb25Eb21haW4oc3RhdGUpIHtcbiAgLy8gbWVyZ2UgYWxsIGFuaW1hdGFibGUgbGF5ZXIgZG9tYWluIGFuZCB1cGRhdGUgZ2xvYmFsIGNvbmZpZ1xuICBjb25zdCBhbmltYXRhYmxlTGF5ZXJzID0gc3RhdGUubGF5ZXJzLmZpbHRlcihcbiAgICBsID0+XG4gICAgICBsLmNvbmZpZy5pc1Zpc2libGUgJiZcbiAgICAgIGwuY29uZmlnLmFuaW1hdGlvbiAmJlxuICAgICAgbC5jb25maWcuYW5pbWF0aW9uLmVuYWJsZWQgJiZcbiAgICAgIEFycmF5LmlzQXJyYXkobC5hbmltYXRpb25Eb21haW4pXG4gICk7XG5cbiAgaWYgKCFhbmltYXRhYmxlTGF5ZXJzLmxlbmd0aCkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGFuaW1hdGlvbkNvbmZpZzogREVGQVVMVF9BTklNQVRJT05fQ09ORklHXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IG1lcmdlZERvbWFpbiA9IGFuaW1hdGFibGVMYXllcnMucmVkdWNlKFxuICAgIChhY2N1LCBsYXllcikgPT4gW1xuICAgICAgTWF0aC5taW4oYWNjdVswXSwgbGF5ZXIuYW5pbWF0aW9uRG9tYWluWzBdKSxcbiAgICAgIE1hdGgubWF4KGFjY3VbMV0sIGxheWVyLmFuaW1hdGlvbkRvbWFpblsxXSlcbiAgICBdLFxuICAgIFtOdW1iZXIoSW5maW5pdHkpLCAtSW5maW5pdHldXG4gICk7XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBhbmltYXRpb25Db25maWc6IHtcbiAgICAgIC4uLnN0YXRlLmFuaW1hdGlvbkNvbmZpZyxcbiAgICAgIGN1cnJlbnRUaW1lOiBpc0luUmFuZ2Uoc3RhdGUuYW5pbWF0aW9uQ29uZmlnLmN1cnJlbnRUaW1lLCBtZXJnZWREb21haW4pXG4gICAgICAgID8gc3RhdGUuYW5pbWF0aW9uQ29uZmlnLmN1cnJlbnRUaW1lXG4gICAgICAgIDogbWVyZ2VkRG9tYWluWzBdLFxuICAgICAgZG9tYWluOiBtZXJnZWREb21haW5cbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogVXBkYXRlIHRoZSBzdGF0dXMgb2YgdGhlIGVkaXRvclxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLnNldEVkaXRvck1vZGVVcGRhdGVyfVxuICovXG5leHBvcnQgY29uc3Qgc2V0RWRpdG9yTW9kZVVwZGF0ZXIgPSAoc3RhdGUsIHttb2RlfSkgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGVkaXRvcjoge1xuICAgIC4uLnN0YXRlLmVkaXRvcixcbiAgICBtb2RlLFxuICAgIHNlbGVjdGVkRmVhdHVyZTogbnVsbFxuICB9XG59KTtcblxuLy8gY29uc3QgZmVhdHVyZVRvRmlsdGVyVmFsdWUgPSAoZmVhdHVyZSkgPT4gKHsuLi5mZWF0dXJlLCBpZDogZmVhdHVyZS5pZH0pO1xuLyoqXG4gKiBVcGRhdGUgZWRpdG9yIGZlYXR1cmVzXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykuc2V0RmVhdHVyZXNVcGRhdGVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0RmVhdHVyZXNVcGRhdGVyKHN0YXRlLCB7ZmVhdHVyZXMgPSBbXX0pIHtcbiAgY29uc3QgbGFzdEZlYXR1cmUgPSBmZWF0dXJlcy5sZW5ndGggJiYgZmVhdHVyZXNbZmVhdHVyZXMubGVuZ3RoIC0gMV07XG5cbiAgY29uc3QgbmV3U3RhdGUgPSB7XG4gICAgLi4uc3RhdGUsXG4gICAgZWRpdG9yOiB7XG4gICAgICAuLi5zdGF0ZS5lZGl0b3IsXG4gICAgICAvLyBvbmx5IHNhdmUgbm9uZSBmaWx0ZXIgZmVhdHVyZXMgdG8gZWRpdG9yXG4gICAgICBmZWF0dXJlczogZmVhdHVyZXMuZmlsdGVyKGYgPT4gIWdldEZpbHRlcklkSW5GZWF0dXJlKGYpKSxcbiAgICAgIG1vZGU6IGxhc3RGZWF0dXJlICYmIGxhc3RGZWF0dXJlLnByb3BlcnRpZXMuaXNDbG9zZWQgPyBFRElUT1JfTU9ERVMuRURJVCA6IHN0YXRlLmVkaXRvci5tb2RlXG4gICAgfVxuICB9O1xuXG4gIC8vIFJldHJpZXZlIGV4aXN0aW5nIGZlYXR1cmVcbiAgY29uc3Qge3NlbGVjdGVkRmVhdHVyZX0gPSBzdGF0ZS5lZGl0b3I7XG5cbiAgLy8gSWYgbm8gZmVhdHVyZSBpcyBzZWxlY3RlZCB3ZSBjYW4gc2ltcGx5IHJldHVybiBzaW5jZSBubyBvcGVyYXRpb25zXG4gIGlmICghc2VsZWN0ZWRGZWF0dXJlKSB7XG4gICAgcmV0dXJuIG5ld1N0YXRlO1xuICB9XG5cbiAgLy8gVE9ETzogY2hlY2sgaWYgdGhlIGZlYXR1cmUgaGFzIGNoYW5nZWRcbiAgY29uc3QgZmVhdHVyZSA9IGZlYXR1cmVzLmZpbmQoZiA9PiBmLmlkID09PSBzZWxlY3RlZEZlYXR1cmUuaWQpO1xuXG4gIC8vIGlmIGZlYXR1cmUgaXMgcGFydCBvZiBhIGZpbHRlclxuICBjb25zdCBmaWx0ZXJJZCA9IGZlYXR1cmUgJiYgZ2V0RmlsdGVySWRJbkZlYXR1cmUoZmVhdHVyZSk7XG4gIGlmIChmaWx0ZXJJZCAmJiBmZWF0dXJlKSB7XG4gICAgY29uc3QgZmVhdHVyZVZhbHVlID0gZmVhdHVyZVRvRmlsdGVyVmFsdWUoZmVhdHVyZSwgZmlsdGVySWQpO1xuICAgIGNvbnN0IGZpbHRlcklkeCA9IHN0YXRlLmZpbHRlcnMuZmluZEluZGV4KGZpbCA9PiBmaWwuaWQgPT09IGZpbHRlcklkKTtcbiAgICByZXR1cm4gc2V0RmlsdGVyVXBkYXRlcihuZXdTdGF0ZSwge1xuICAgICAgaWR4OiBmaWx0ZXJJZHgsXG4gICAgICBwcm9wOiAndmFsdWUnLFxuICAgICAgdmFsdWU6IGZlYXR1cmVWYWx1ZVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIG5ld1N0YXRlO1xufVxuXG4vKipcbiAqIFNldCB0aGUgY3VycmVudCBzZWxlY3RlZCBmZWF0dXJlXG4gKiBAbWVtYmVyb2YgdWlTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5zZXRTZWxlY3RlZEZlYXR1cmVVcGRhdGVyfVxuICovXG5leHBvcnQgY29uc3Qgc2V0U2VsZWN0ZWRGZWF0dXJlVXBkYXRlciA9IChzdGF0ZSwge2ZlYXR1cmV9KSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgZWRpdG9yOiB7XG4gICAgLi4uc3RhdGUuZWRpdG9yLFxuICAgIHNlbGVjdGVkRmVhdHVyZTogZmVhdHVyZVxuICB9XG59KTtcblxuLyoqXG4gKiBEZWxldGUgZXhpc3RpbmcgZmVhdHVyZSBmcm9tIGZpbHRlcnNcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5kZWxldGVGZWF0dXJlVXBkYXRlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZUZlYXR1cmVVcGRhdGVyKHN0YXRlLCB7ZmVhdHVyZX0pIHtcbiAgaWYgKCFmZWF0dXJlKSB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgY29uc3QgbmV3U3RhdGUgPSB7XG4gICAgLi4uc3RhdGUsXG4gICAgZWRpdG9yOiB7XG4gICAgICAuLi5zdGF0ZS5lZGl0b3IsXG4gICAgICBzZWxlY3RlZEZlYXR1cmU6IG51bGxcbiAgICB9XG4gIH07XG5cbiAgaWYgKGdldEZpbHRlcklkSW5GZWF0dXJlKGZlYXR1cmUpKSB7XG4gICAgY29uc3QgZmlsdGVySWR4ID0gbmV3U3RhdGUuZmlsdGVycy5maW5kSW5kZXgoZiA9PiBmLmlkID09PSBnZXRGaWx0ZXJJZEluRmVhdHVyZShmZWF0dXJlKSk7XG5cbiAgICByZXR1cm4gZmlsdGVySWR4ID4gLTEgPyByZW1vdmVGaWx0ZXJVcGRhdGVyKG5ld1N0YXRlLCB7aWR4OiBmaWx0ZXJJZHh9KSA6IG5ld1N0YXRlO1xuICB9XG5cbiAgLy8gbW9kaWZ5IGVkaXRvciBvYmplY3RcbiAgY29uc3QgbmV3RWRpdG9yID0ge1xuICAgIC4uLnN0YXRlLmVkaXRvcixcbiAgICBmZWF0dXJlczogc3RhdGUuZWRpdG9yLmZlYXR1cmVzLmZpbHRlcihmID0+IGYuaWQgIT09IGZlYXR1cmUuaWQpLFxuICAgIHNlbGVjdGVkRmVhdHVyZTogbnVsbFxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgZWRpdG9yOiBuZXdFZGl0b3JcbiAgfTtcbn1cblxuLyoqXG4gKiBUb2dnbGUgZmVhdHVyZSBhcyBsYXllciBmaWx0ZXJcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5zZXRQb2x5Z29uRmlsdGVyTGF5ZXJVcGRhdGVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0UG9seWdvbkZpbHRlckxheWVyVXBkYXRlcihzdGF0ZSwgcGF5bG9hZCkge1xuICBjb25zdCB7bGF5ZXIsIGZlYXR1cmV9ID0gcGF5bG9hZDtcbiAgY29uc3QgZmlsdGVySWQgPSBnZXRGaWx0ZXJJZEluRmVhdHVyZShmZWF0dXJlKTtcblxuICAvLyBsZXQgbmV3RmlsdGVyID0gbnVsbDtcbiAgbGV0IGZpbHRlcklkeDtcbiAgbGV0IG5ld0xheWVySWQgPSBbbGF5ZXIuaWRdO1xuICBsZXQgbmV3U3RhdGUgPSBzdGF0ZTtcbiAgLy8gSWYgcG9seWdvbiBmaWx0ZXIgYWxyZWFkeSBleGlzdHMsIHdlIG5lZWQgdG8gZmluZCBvdXQgaWYgdGhlIGN1cnJlbnQgbGF5ZXIgaXMgYWxyZWFkeSBpbmNsdWRlZFxuICBpZiAoZmlsdGVySWQpIHtcbiAgICBmaWx0ZXJJZHggPSBzdGF0ZS5maWx0ZXJzLmZpbmRJbmRleChmID0+IGYuaWQgPT09IGZpbHRlcklkKTtcblxuICAgIGlmICghc3RhdGUuZmlsdGVyc1tmaWx0ZXJJZHhdKSB7XG4gICAgICAvLyB3aGF0IGlmIGZpbHRlciBkb2Vzbid0IGV4aXN0Py4uLiBub3QgcG9zc2libGUuXG4gICAgICAvLyBiZWNhdXNlIGZlYXR1cmVzIGluIHRoZSBlZGl0b3IgaXMgcGFzc2VkIGluIGZyb20gZmlsdGVycyBhbmQgZWRpdG9ycy5cbiAgICAgIC8vIGJ1dCB3ZSB3aWxsIG1vdmUgdGhpcyBmZWF0dXJlIGJhY2sgdG8gZWRpdG9yIGp1c3QgaW4gY2FzZVxuICAgICAgY29uc3Qgbm9uZUZpbHRlckZlYXR1cmUgPSB7XG4gICAgICAgIC4uLmZlYXR1cmUsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAuLi5mZWF0dXJlLnByb3BlcnRpZXMsXG4gICAgICAgICAgZmlsdGVySWQ6IG51bGxcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGVkaXRvcjoge1xuICAgICAgICAgIC4uLnN0YXRlLmVkaXRvcixcbiAgICAgICAgICBmZWF0dXJlczogWy4uLnN0YXRlLmVkaXRvci5mZWF0dXJlcywgbm9uZUZpbHRlckZlYXR1cmVdLFxuICAgICAgICAgIHNlbGVjdGVkRmVhdHVyZTogbm9uZUZpbHRlckZlYXR1cmVcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gICAgY29uc3QgZmlsdGVyID0gc3RhdGUuZmlsdGVyc1tmaWx0ZXJJZHhdO1xuICAgIGNvbnN0IHtsYXllcklkID0gW119ID0gZmlsdGVyO1xuICAgIGNvbnN0IGlzTGF5ZXJJbmNsdWRlZCA9IGxheWVySWQuaW5jbHVkZXMobGF5ZXIuaWQpO1xuXG4gICAgbmV3TGF5ZXJJZCA9IGlzTGF5ZXJJbmNsdWRlZFxuICAgICAgPyAvLyBpZiBsYXllciBpcyBpbmNsdWRlZCwgcmVtb3ZlIGl0XG4gICAgICAgIGxheWVySWQuZmlsdGVyKGwgPT4gbCAhPT0gbGF5ZXIuaWQpXG4gICAgICA6IFsuLi5sYXllcklkLCBsYXllci5pZF07XG4gIH0gZWxzZSB7XG4gICAgLy8gaWYgd2UgaGF2ZW4ndCBjcmVhdGUgdGhlIHBvbHlnb24gZmlsdGVyLCBjcmVhdGUgaXRcbiAgICBjb25zdCBuZXdGaWx0ZXIgPSBnZW5lcmF0ZVBvbHlnb25GaWx0ZXIoW10sIGZlYXR1cmUpO1xuICAgIGZpbHRlcklkeCA9IHN0YXRlLmZpbHRlcnMubGVuZ3RoO1xuXG4gICAgLy8gYWRkIGZlYXR1cmUsIHJlbW92ZSBmZWF0dXJlIGZyb20gZWlkdG9yXG4gICAgbmV3U3RhdGUgPSB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGZpbHRlcnM6IFsuLi5zdGF0ZS5maWx0ZXJzLCBuZXdGaWx0ZXJdLFxuICAgICAgZWRpdG9yOiB7XG4gICAgICAgIC4uLnN0YXRlLmVkaXRvcixcbiAgICAgICAgZmVhdHVyZXM6IHN0YXRlLmVkaXRvci5mZWF0dXJlcy5maWx0ZXIoZiA9PiBmLmlkICE9PSBmZWF0dXJlLmlkKSxcbiAgICAgICAgc2VsZWN0ZWRGZWF0dXJlOiBuZXdGaWx0ZXIudmFsdWVcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHNldEZpbHRlclVwZGF0ZXIobmV3U3RhdGUsIHtcbiAgICBpZHg6IGZpbHRlcklkeCxcbiAgICBwcm9wOiAnbGF5ZXJJZCcsXG4gICAgdmFsdWU6IG5ld0xheWVySWRcbiAgfSk7XG59XG5cbi8qKlxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLnNvcnRUYWJsZUNvbHVtblVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzb3J0VGFibGVDb2x1bW5VcGRhdGVyKHN0YXRlLCB7ZGF0YUlkLCBjb2x1bW4sIG1vZGV9KSB7XG4gIGNvbnN0IGRhdGFzZXQgPSBzdGF0ZS5kYXRhc2V0c1tkYXRhSWRdO1xuICBpZiAoIWRhdGFzZXQpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cbiAgaWYgKCFtb2RlKSB7XG4gICAgY29uc3QgY3VycmVudE1vZGUgPSBnZXQoZGF0YXNldCwgWydzb3J0Q29sdW1uJywgY29sdW1uXSk7XG4gICAgbW9kZSA9IGN1cnJlbnRNb2RlXG4gICAgICA/IE9iamVjdC5rZXlzKFNPUlRfT1JERVIpLmZpbmQobSA9PiBtICE9PSBjdXJyZW50TW9kZSlcbiAgICAgIDogU09SVF9PUkRFUi5BU0NFTkRJTkc7XG4gIH1cblxuICBjb25zdCBzb3J0ZWQgPSBzb3J0RGF0YXNldEJ5Q29sdW1uKGRhdGFzZXQsIGNvbHVtbiwgbW9kZSk7XG4gIHJldHVybiBzZXQoWydkYXRhc2V0cycsIGRhdGFJZF0sIHNvcnRlZCwgc3RhdGUpO1xufVxuXG4vKipcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5waW5UYWJsZUNvbHVtblVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwaW5UYWJsZUNvbHVtblVwZGF0ZXIoc3RhdGUsIHtkYXRhSWQsIGNvbHVtbn0pIHtcbiAgY29uc3QgZGF0YXNldCA9IHN0YXRlLmRhdGFzZXRzW2RhdGFJZF07XG4gIGlmICghZGF0YXNldCkge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuICBjb25zdCBmaWVsZCA9IGRhdGFzZXQuZmllbGRzLmZpbmQoZiA9PiBmLm5hbWUgPT09IGNvbHVtbik7XG4gIGlmICghZmllbGQpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICBsZXQgcGlubmVkQ29sdW1ucztcbiAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YXNldC5waW5uZWRDb2x1bW5zKSAmJiBkYXRhc2V0LnBpbm5lZENvbHVtbnMuaW5jbHVkZXMoZmllbGQubmFtZSkpIHtcbiAgICAvLyB1bnBpbiBpdFxuICAgIHBpbm5lZENvbHVtbnMgPSBkYXRhc2V0LnBpbm5lZENvbHVtbnMuZmlsdGVyKGNvID0+IGNvICE9PSBmaWVsZC5uYW1lKTtcbiAgfSBlbHNlIHtcbiAgICBwaW5uZWRDb2x1bW5zID0gKGRhdGFzZXQucGlubmVkQ29sdW1ucyB8fCBbXSkuY29uY2F0KGZpZWxkLm5hbWUpO1xuICB9XG5cbiAgcmV0dXJuIHNldChbJ2RhdGFzZXRzJywgZGF0YUlkLCAncGlubmVkQ29sdW1ucyddLCBwaW5uZWRDb2x1bW5zLCBzdGF0ZSk7XG59XG5cbi8qKlxuICogQ29weSBjb2x1bW4gY29udGVudCBhcyBzdHJpbmdzXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykuY29weVRhYmxlQ29sdW1uVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvcHlUYWJsZUNvbHVtblVwZGF0ZXIoc3RhdGUsIHtkYXRhSWQsIGNvbHVtbn0pIHtcbiAgY29uc3QgZGF0YXNldCA9IHN0YXRlLmRhdGFzZXRzW2RhdGFJZF07XG4gIGlmICghZGF0YXNldCkge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuICBjb25zdCBmaWVsZElkeCA9IGRhdGFzZXQuZmllbGRzLmZpbmRJbmRleChmID0+IGYubmFtZSA9PT0gY29sdW1uKTtcbiAgaWYgKGZpZWxkSWR4IDwgMCkge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuICBjb25zdCB7dHlwZX0gPSBkYXRhc2V0LmZpZWxkc1tmaWVsZElkeF07XG4gIGNvbnN0IHRleHQgPSBkYXRhc2V0LmFsbERhdGEubWFwKGQgPT4gcGFyc2VGaWVsZFZhbHVlKGRbZmllbGRJZHhdLCB0eXBlKSkuam9pbignXFxuJyk7XG5cbiAgY29weSh0ZXh0KTtcblxuICByZXR1cm4gc3RhdGU7XG59XG5cbi8qKlxuICogVXBkYXRlIGVkaXRvclxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykudG9nZ2xlRWRpdG9yVmlzaWJpbGl0eVVwZGF0ZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b2dnbGVFZGl0b3JWaXNpYmlsaXR5VXBkYXRlcihzdGF0ZSkge1xuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGVkaXRvcjoge1xuICAgICAgLi4uc3RhdGUuZWRpdG9yLFxuICAgICAgdmlzaWJsZTogIXN0YXRlLmVkaXRvci52aXNpYmxlXG4gICAgfVxuICB9O1xufVxuIl19