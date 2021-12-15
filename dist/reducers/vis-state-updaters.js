"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateStateWithLayerAndData = updateStateWithLayerAndData;
exports.updateStateOnLayerVisibilityChange = updateStateOnLayerVisibilityChange;
exports.layerConfigChangeUpdater = layerConfigChangeUpdater;
exports.layerTextLabelChangeUpdater = layerTextLabelChangeUpdater;
exports.layerDataIdChangeUpdater = layerDataIdChangeUpdater;
exports.layerTypeChangeUpdater = layerTypeChangeUpdater;
exports.layerVisualChannelChangeUpdater = layerVisualChannelChangeUpdater;
exports.layerVisConfigChangeUpdater = layerVisConfigChangeUpdater;
exports.setFilterAnimationTimeUpdater = setFilterAnimationTimeUpdater;
exports.setFilterAnimationWindowUpdater = setFilterAnimationWindowUpdater;
exports.setFilterUpdater = setFilterUpdater;
exports.interactionConfigChangeUpdater = interactionConfigChangeUpdater;
exports.renameDatasetUpdater = renameDatasetUpdater;
exports.loadFileStepSuccessUpdater = loadFileStepSuccessUpdater;
exports.loadNextFileUpdater = loadNextFileUpdater;
exports.makeLoadFileTask = makeLoadFileTask;
exports.processFileContentUpdater = processFileContentUpdater;
exports.parseProgress = parseProgress;
exports.addDefaultLayers = addDefaultLayers;
exports.addDefaultTooltips = addDefaultTooltips;
exports.initialFileLoadingProgress = initialFileLoadingProgress;
exports.updateFileLoadingProgressUpdater = updateFileLoadingProgressUpdater;
exports.updateAllLayerDomainData = updateAllLayerDomainData;
exports.updateAnimationDomain = updateAnimationDomain;
exports.setFeaturesUpdater = setFeaturesUpdater;
exports.deleteFeatureUpdater = deleteFeatureUpdater;
exports.setPolygonFilterLayerUpdater = setPolygonFilterLayerUpdater;
exports.sortTableColumnUpdater = sortTableColumnUpdater;
exports.pinTableColumnUpdater = pinTableColumnUpdater;
exports.copyTableColumnUpdater = copyTableColumnUpdater;
exports.toggleEditorVisibilityUpdater = toggleEditorVisibilityUpdater;
exports.setFilterAnimationTimeConfigUpdater = setFilterAnimationTimeConfigUpdater;
exports.setLayerAnimationTimeConfigUpdater = setLayerAnimationTimeConfigUpdater;
exports.setSelectedFeatureUpdater = exports.setEditorModeUpdater = exports.setMapInfoUpdater = exports.applyCPUFilterUpdater = exports.loadFilesErrUpdater = exports.nextFileBatchUpdater = exports.loadFilesUpdater = exports.updateVisDataUpdater = exports.toggleLayerForMapUpdater = exports.toggleSplitMapUpdater = exports.mouseMoveUpdater = exports.mapClickUpdater = exports.layerClickUpdater = exports.layerHoverUpdater = exports.receiveMapConfigUpdater = exports.resetMapConfigUpdater = exports.showDatasetTableUpdater = exports.updateLayerBlendingUpdater = exports.removeDatasetUpdater = exports.reorderLayerUpdater = exports.duplicateLayerUpdater = exports.removeLayerUpdater = exports.addLayerUpdater = exports.removeFilterUpdater = exports.toggleFilterFeatureUpdater = exports.enlargeFilterUpdater = exports.updateLayerAnimationSpeedUpdater = exports.setLayerAnimationTimeUpdater = exports.updateFilterAnimationSpeedUpdater = exports.toggleLayerAnimationControlUpdater = exports.toggleLayerAnimationUpdater = exports.toggleFilterAnimationUpdater = exports.layerColorUIChangeUpdater = exports.addFilterUpdater = exports.setFilterPlotUpdater = exports.INITIAL_VIS_STATE = exports.DEFAULT_EDITOR = exports.DEFAULT_ANIMATION_CONFIG = void 0;

var _toArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toArray"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

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

var _keplerTable = require("../utils/table-utils/kepler-table");

var _utils = require("../utils/utils");

var _layerUtils = require("../utils/layer-utils");

var _visStateMerger = require("./vis-state-merger");

var _splitMapUtils = require("../utils/split-map-utils");

var _layers = require("../layers");

var _layerFactory = require("../layers/layer-factory");

var _defaultSettings = require("../constants/default-settings");

var _composerHelpers = require("./composer-helpers");

var _schemas = _interopRequireDefault(require("../schemas"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }

function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// type imports

/** @typedef {import('./vis-state-updaters').Field} Field */

/** @typedef {import('./vis-state-updaters').Filter} Filter */

/** @typedef {import('./vis-state-updaters').KeplerTable} KeplerTable */

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
  speed: 1,
  isAnimating: false,
  timeFormat: null,
  timezone: null,
  defaultTimeFormat: null
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
  splitMapsToBeMerged: [],
  // defaults layer classes
  layerClasses: _layers.LayerClasses,
  // default animation
  // time in unix timestamp (milliseconds) (the number of seconds since the Unix Epoch)
  animationConfig: DEFAULT_ANIMATION_CONFIG,
  editor: DEFAULT_EDITOR,
  fileLoading: false,
  fileLoadingProgress: {},
  loaders: [],
  loadOptions: {},
  // visStateMergers
  mergers: _visStateMerger.VIS_STATE_MERGERS,
  // kepler schemas
  schema: _schemas["default"]
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
  return _objectSpread(_objectSpread({}, state), {}, {
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
    newState = _objectSpread(_objectSpread({}, state), {}, {
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

  if (typeof action.newConfig.dataId === 'string') {
    var _action$newConfig = action.newConfig,
        dataId = _action$newConfig.dataId,
        restConfig = (0, _objectWithoutProperties2["default"])(_action$newConfig, ["dataId"]);
    var stateWithDataId = layerDataIdChangeUpdater(state, {
      oldLayer: oldLayer,
      newConfig: {
        dataId: dataId
      }
    });
    var nextLayer = stateWithDataId.layers.find(function (l) {
      return l.id === oldLayer.id;
    });
    return nextLayer && Object.keys(restConfig).length ? layerConfigChangeUpdater(stateWithDataId, {
      oldLayer: nextLayer,
      newConfig: restConfig
    }) : stateWithDataId;
  }

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
    return _objectSpread(_objectSpread({}, _layerFactory.DEFAULT_TEXT_LABEL), {}, {
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
      return i === idx ? _objectSpread(_objectSpread({}, tl), {}, (0, _defineProperty2["default"])({}, prop, value)) : tl;
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

function validateExistingLayerWithData(dataset, layerClasses, layer) {
  var loadedLayer = (0, _visStateMerger.serializeLayer)(layer);
  return (0, _visStateMerger.validateLayerWithData)(dataset, loadedLayer, layerClasses, {
    allowEmptyColumn: true
  });
}
/**
 * Update layer config dataId
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').layerDataIdChangeUpdater}
 * @returns nextState
 */


function layerDataIdChangeUpdater(state, action) {
  var oldLayer = action.oldLayer,
      newConfig = action.newConfig;
  var dataId = newConfig.dataId;

  if (!oldLayer || !state.datasets[dataId]) {
    return state;
  }

  var idx = state.layers.findIndex(function (l) {
    return l.id === oldLayer.id;
  });
  var newLayer = oldLayer.updateLayerConfig({
    dataId: dataId
  }); // this may happen when a layer is new (type: null and no columns) but it's not ready to be saved

  if (newLayer.isValidToSave()) {
    var validated = validateExistingLayerWithData(state.datasets[dataId], state.layerClasses, newLayer); // if cant validate it with data create a new one

    if (!validated) {
      newLayer = new state.layerClasses[oldLayer.type]({
        dataId: dataId,
        id: oldLayer.id
      });
    } else {
      newLayer = validated;
    }
  }

  newLayer = newLayer.updateLayerConfig({
    isVisible: oldLayer.config.isVisible,
    isConfigActive: true
  });
  newLayer.updateLayerDomain(state.datasets);

  var _calculateLayerData = (0, _layerUtils.calculateLayerData)(newLayer, state, undefined),
      layerData = _calculateLayerData.layerData,
      layer = _calculateLayerData.layer;

  return updateStateWithLayerAndData(state, {
    layerData: layerData,
    layer: layer,
    idx: idx
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
  newLayer.assignConfigToLayer(oldLayer.config, oldLayer.visConfigSettings);
  newLayer.updateLayerDomain(state.datasets);

  var _calculateLayerData2 = (0, _layerUtils.calculateLayerData)(newLayer, state),
      layerData = _calculateLayerData2.layerData,
      layer = _calculateLayerData2.layer;

  var newState = updateStateWithLayerAndData(state, {
    layerData: layerData,
    layer: layer,
    idx: idx
  });

  if (layer.config.animation.enabled || oldLayer.config.animation.enabled) {
    newState = updateAnimationDomain(newState);
  } // update splitMap layer id


  if (state.splitMaps.length) {
    newState = _objectSpread(_objectSpread({}, newState), {}, {
      splitMaps: newState.splitMaps.map(function (settings) {
        var _settings$layers = settings.layers,
            oldLayerMap = _settings$layers[oldId],
            otherLayers = (0, _objectWithoutProperties2["default"])(_settings$layers, [oldId].map(_toPropertyKey));
        return oldId in settings.layers ? _objectSpread(_objectSpread({}, settings), {}, {
          layers: _objectSpread(_objectSpread({}, otherLayers), {}, (0, _defineProperty2["default"])({}, layer.id, oldLayerMap))
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

  var _calculateLayerData3 = (0, _layerUtils.calculateLayerData)(newLayer, state, oldLayerData),
      layerData = _calculateLayerData3.layerData,
      layer = _calculateLayerData3.layer;

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

  var newVisConfig = _objectSpread(_objectSpread({}, oldLayer.config.visConfig), action.newVisConfig);

  var newLayer = oldLayer.updateLayerConfig({
    visConfig: newVisConfig
  });

  if (newLayer.shouldCalculateLayerData(props)) {
    var oldLayerData = state.layerData[idx];

    var _calculateLayerData4 = (0, _layerUtils.calculateLayerData)(newLayer, state, oldLayerData),
        layerData = _calculateLayerData4.layerData,
        layer = _calculateLayerData4.layer;

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
 * @type {typeof import('./vis-state-updaters').setFilterAnimationTimeUpdater}
 * @public
 */


function setFilterAnimationTimeUpdater(state, action) {
  return setFilterUpdater(state, action);
}
/**
 * Update filter animation window
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').setFilterAnimationWindowUpdater}
 * @public
 */


function setFilterAnimationWindowUpdater(state, _ref2) {
  var id = _ref2.id,
      animationWindow = _ref2.animationWindow;
  return _objectSpread(_objectSpread({}, state), {}, {
    filters: state.filters.map(function (f) {
      return f.id === id ? _objectSpread(_objectSpread({}, f), {}, {
        animationWindow: animationWindow
      }) : f;
    })
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

  if (!oldFilter) {
    _window.console.error("filters.".concat(idx, " is undefined"));

    return state;
  }

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
      newFilter = _objectSpread(_objectSpread({}, newFilter), {}, {
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


var setFilterPlotUpdater = function setFilterPlotUpdater(state, _ref3) {
  var idx = _ref3.idx,
      newProp = _ref3.newProp,
      _ref3$valueIndex = _ref3.valueIndex,
      valueIndex = _ref3$valueIndex === void 0 ? 0 : _ref3$valueIndex;

  var newFilter = _objectSpread(_objectSpread({}, state.filters[idx]), newProp);

  var prop = Object.keys(newProp)[0];

  if (prop === 'yAxis') {
    var plotType = (0, _filterUtils.getDefaultFilterPlotType)(newFilter); // TODO: plot is not supported in multi dataset filter for now

    if (plotType) {
      newFilter = _objectSpread(_objectSpread(_objectSpread({}, newFilter), (0, _filterUtils.getFilterPlot)(_objectSpread(_objectSpread({}, newFilter), {}, {
        plotType: plotType
      }), state.datasets[newFilter.dataId[valueIndex]])), {}, {
        plotType: plotType
      });
    }
  }

  return _objectSpread(_objectSpread({}, state), {}, {
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
  return !action.dataId ? state : _objectSpread(_objectSpread({}, state), {}, {
    filters: [].concat((0, _toConsumableArray2["default"])(state.filters), [(0, _filterUtils.getDefaultFilter)(action.dataId)])
  });
};
/**
 * Set layer color palette ui state
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').layerColorUIChangeUpdater}
 */


exports.addFilterUpdater = addFilterUpdater;

var layerColorUIChangeUpdater = function layerColorUIChangeUpdater(state, _ref4) {
  var oldLayer = _ref4.oldLayer,
      prop = _ref4.prop,
      newConfig = _ref4.newConfig;
  var oldVixConfig = oldLayer.config.visConfig[prop];
  var newLayer = oldLayer.updateLayerColorUI(prop, newConfig);
  var newVisConfig = newLayer.config.visConfig[prop];

  if (oldVixConfig !== newVisConfig) {
    return layerVisConfigChangeUpdater(state, {
      oldLayer: oldLayer,
      newVisConfig: (0, _defineProperty2["default"])({}, prop, newVisConfig)
    });
  }

  return _objectSpread(_objectSpread({}, state), {}, {
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
  return _objectSpread(_objectSpread({}, state), {}, {
    filters: state.filters.map(function (f, i) {
      return i === action.idx ? _objectSpread(_objectSpread({}, f), {}, {
        isAnimating: !f.isAnimating
      }) : f;
    })
  });
};
/**
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').toggleLayerAnimationUpdater}
 * @public
 */


exports.toggleFilterAnimationUpdater = toggleFilterAnimationUpdater;

var toggleLayerAnimationUpdater = function toggleLayerAnimationUpdater(state) {
  return _objectSpread(_objectSpread({}, state), {}, {
    animationConfig: _objectSpread(_objectSpread({}, state.animationConfig), {}, {
      isAnimating: !state.animationConfig.isAnimating
    })
  });
};
/**
 * Hide and show layer animation control
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').toggleLayerAnimationControlUpdater}
 * @public
 */


exports.toggleLayerAnimationUpdater = toggleLayerAnimationUpdater;

var toggleLayerAnimationControlUpdater = function toggleLayerAnimationControlUpdater(state) {
  return _objectSpread(_objectSpread({}, state), {}, {
    animationConfig: _objectSpread(_objectSpread({}, state.animationConfig), {}, {
      hideControl: !state.animationConfig.hideControl
    })
  });
};
/**
 * Change filter animation speed
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').updateFilterAnimationSpeedUpdater}
 * @public
 */


exports.toggleLayerAnimationControlUpdater = toggleLayerAnimationControlUpdater;

var updateFilterAnimationSpeedUpdater = function updateFilterAnimationSpeedUpdater(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    filters: state.filters.map(function (f, i) {
      return i === action.idx ? _objectSpread(_objectSpread({}, f), {}, {
        speed: action.speed
      }) : f;
    })
  });
};
/**
 * Reset animation config current time to a specified value
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').setLayerAnimationTimeUpdater}
 * @public
 *
 */


exports.updateFilterAnimationSpeedUpdater = updateFilterAnimationSpeedUpdater;

var setLayerAnimationTimeUpdater = function setLayerAnimationTimeUpdater(state, _ref5) {
  var value = _ref5.value;
  return _objectSpread(_objectSpread({}, state), {}, {
    animationConfig: _objectSpread(_objectSpread({}, state.animationConfig), {}, {
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


exports.setLayerAnimationTimeUpdater = setLayerAnimationTimeUpdater;

var updateLayerAnimationSpeedUpdater = function updateLayerAnimationSpeedUpdater(state, _ref6) {
  var speed = _ref6.speed;
  return _objectSpread(_objectSpread({}, state), {}, {
    animationConfig: _objectSpread(_objectSpread({}, state.animationConfig), {}, {
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
  return _objectSpread(_objectSpread({}, state), {}, {
    filters: state.filters.map(function (f, i) {
      return i === action.idx ? _objectSpread(_objectSpread({}, f), {}, {
        enlarged: !f.enlarged
      }) : f;
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

  var newFilter = _objectSpread(_objectSpread({}, filter), {}, {
    value: (0, _filterUtils.featureToFilterValue)(filter.value, filter.id, {
      isVisible: !isVisible
    })
  });

  return _objectSpread(_objectSpread({}, state), {}, {
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
  var newEditor = (0, _filterUtils.getFilterIdInFeature)(state.editor.selectedFeature) === id ? _objectSpread(_objectSpread({}, state.editor), {}, {
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
  var newLayer;
  var newLayerData;

  if (action.config) {
    newLayer = (0, _visStateMerger.createLayerFromConfig)(state, action.config);

    if (!newLayer) {
      _window.console.warn('Failed to create layer from config, it usually means the config is not be in correct format', action.config);

      return state;
    }

    var result = (0, _layerUtils.calculateLayerData)(newLayer, state);
    newLayer = result.layer;
    newLayerData = result.layerData;
  } else {
    // create an empty layer with the first available dataset
    var defaultDataset = Object.keys(state.datasets)[0];
    newLayer = new _layers.Layer({
      isVisible: true,
      isConfigActive: true,
      dataId: defaultDataset
    });
    newLayerData = {};
  }

  return _objectSpread(_objectSpread({}, state), {}, {
    layers: [].concat((0, _toConsumableArray2["default"])(state.layers), [newLayer]),
    layerData: [].concat((0, _toConsumableArray2["default"])(state.layerData), [newLayerData]),
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

var removeLayerUpdater = function removeLayerUpdater(state, _ref7) {
  var idx = _ref7.idx;
  var layers = state.layers,
      layerData = state.layerData,
      clicked = state.clicked,
      hoverInfo = state.hoverInfo;
  var layerToRemove = state.layers[idx];
  var newMaps = (0, _splitMapUtils.removeLayerFromSplitMaps)(state.splitMaps, layerToRemove);

  var newState = _objectSpread(_objectSpread({}, state), {}, {
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
 * duplicate layer
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').duplicateLayerUpdater}
 * @public
 */


exports.removeLayerUpdater = removeLayerUpdater;

var duplicateLayerUpdater = function duplicateLayerUpdater(state, _ref8) {
  var idx = _ref8.idx;
  var layers = state.layers;
  var original = state.layers[idx];
  var originalLayerOrderIdx = state.layerOrder.findIndex(function (i) {
    return i === idx;
  });

  if (!original) {
    _window.console.warn("layer.".concat(idx, " is undefined"));

    return state;
  }

  var newLabel = "Copy of ".concat(original.config.label);
  var postfix = 0; // eslint-disable-next-line no-loop-func

  while (layers.find(function (l) {
    return l.config.label === newLabel;
  })) {
    newLabel = "Copy of ".concat(original.config.label, " ").concat(++postfix);
  } // collect layer config from original


  var loadedLayer = (0, _visStateMerger.serializeLayer)(original); // assign new id and label to copied layer

  if (!loadedLayer.config) {
    return state;
  }

  loadedLayer.config.label = newLabel;
  loadedLayer.id = (0, _utils.generateHashId)(_layers.LAYER_ID_LENGTH); // add layer to state

  var nextState = addLayerUpdater(state, {
    config: loadedLayer
  }); // new added layer are at the end, move it to be on top of original layer

  var newLayerOrderIdx = nextState.layerOrder.length - 1;
  var newLayerOrder = (0, _utils.arrayInsert)(nextState.layerOrder.slice(0, newLayerOrderIdx), originalLayerOrderIdx, newLayerOrderIdx);
  nextState = _objectSpread(_objectSpread({}, nextState), {}, {
    layerOrder: newLayerOrder
  });
  return updateAnimationDomain(nextState);
};
/**
 * Reorder layer
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').reorderLayerUpdater}
 * @public
 */


exports.duplicateLayerUpdater = duplicateLayerUpdater;

var reorderLayerUpdater = function reorderLayerUpdater(state, _ref9) {
  var order = _ref9.order;
  return _objectSpread(_objectSpread({}, state), {}, {
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
      // @ts-ignore
      listOfIndexes.push(index);
    }

    return listOfIndexes;
  }, []); // remove layers and datasets

  var _indexes$reduce = indexes.reduce(function (_ref10, idx) {
    var currentState = _ref10.newState,
        indexCounter = _ref10.indexCounter;
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
    newState: _objectSpread(_objectSpread({}, state), {}, {
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

    interactionConfig = _objectSpread(_objectSpread({}, interactionConfig), {}, {
      tooltip: _objectSpread(_objectSpread({}, tooltip), {}, {
        config: _objectSpread(_objectSpread({}, config), {}, {
          fieldsToShow: fieldsToShow
        })
      })
    });
  }

  return _objectSpread(_objectSpread({}, newState), {}, {
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
  return _objectSpread(_objectSpread({}, state), {}, {
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
  return _objectSpread(_objectSpread({}, state), {}, {
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
  return _objectSpread(_objectSpread(_objectSpread({}, INITIAL_VIS_STATE), state.initialState), {}, {
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

var receiveMapConfigUpdater = function receiveMapConfigUpdater(state, _ref11) {
  var _ref11$payload = _ref11.payload,
      _ref11$payload$config = _ref11$payload.config,
      config = _ref11$payload$config === void 0 ? {} : _ref11$payload$config,
      _ref11$payload$option = _ref11$payload.options,
      options = _ref11$payload$option === void 0 ? {} : _ref11$payload$option;

  if (!config.visState) {
    return state;
  }

  var keepExistingConfig = options.keepExistingConfig; // reset config if keepExistingConfig is falsy

  var mergedState = !keepExistingConfig ? resetMapConfigUpdater(state) : state;

  var _iterator = _createForOfIteratorHelper(state.mergers),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var merger = _step.value;

      if ((0, _visStateMerger.isValidMerger)(merger) && config.visState[merger.prop]) {
        mergedState = merger.merge(mergedState, config.visState[merger.prop], true);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

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
  return _objectSpread(_objectSpread({}, state), {}, {
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

  var interactionConfig = _objectSpread(_objectSpread({}, state.interactionConfig), (0, _defineProperty2["default"])({}, config.id, config)); // Don't enable tooltip and brush at the same time
  // but coordinates can be shown at all time


  var contradict = ['brush', 'tooltip'];

  if (contradict.includes(config.id) && config.enabled && !state.interactionConfig[config.id].enabled) {
    // only enable one interaction at a time
    contradict.forEach(function (k) {
      if (k !== config.id) {
        interactionConfig[k] = _objectSpread(_objectSpread({}, interactionConfig[k]), {}, {
          enabled: false
        });
      }
    });
  }

  var newState = _objectSpread(_objectSpread({}, state), {}, {
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
  return _objectSpread(_objectSpread({}, state), {}, {
    mousePos: state.interactionConfig.coordinate.enabled ? _objectSpread(_objectSpread({}, state.mousePos), {}, {
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
  return _objectSpread(_objectSpread({}, state), {}, {
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

var mouseMoveUpdater = function mouseMoveUpdater(state, _ref12) {
  var evt = _ref12.evt;

  if (Object.values(state.interactionConfig).some(function (config) {
    return config.enabled;
  })) {
    return _objectSpread(_objectSpread({}, state), {}, {
      mousePos: _objectSpread(_objectSpread({}, state.mousePos), {}, {
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
  return state.splitMaps && state.splitMaps.length === 0 ? _objectSpread(_objectSpread({}, state), {}, {
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

var toggleLayerForMapUpdater = function toggleLayerForMapUpdater(state, _ref13) {
  var mapIndex = _ref13.mapIndex,
      layerId = _ref13.layerId;
  var splitMaps = state.splitMaps;
  return _objectSpread(_objectSpread({}, state), {}, {
    splitMaps: splitMaps.map(function (sm, i) {
      return i === mapIndex ? _objectSpread(_objectSpread({}, splitMaps[i]), {}, {
        layers: _objectSpread(_objectSpread({}, splitMaps[i].layers), {}, (0, _defineProperty2["default"])({}, layerId, !splitMaps[i].layers[layerId]))
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
// eslint-disable-next-line complexity


exports.toggleLayerForMapUpdater = toggleLayerForMapUpdater;

var updateVisDataUpdater = function updateVisDataUpdater(state, action) {
  // datasets can be a single data entries or an array of multiple data entries
  var config = action.config,
      options = action.options;
  var datasets = (0, _utils.toArray)(action.datasets);
  var newDataEntries = datasets.reduce(function (accu) {
    var _ref14 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref14$info = _ref14.info,
        info = _ref14$info === void 0 ? {} : _ref14$info,
        data = _ref14.data,
        metadata = _ref14.metadata;

    return _objectSpread(_objectSpread({}, accu), (0, _datasetUtils.createNewDataEntry)({
      info: info,
      data: data,
      metadata: metadata
    }, state.datasets) || {});
  }, {});
  var dataEmpty = Object.keys(newDataEntries).length < 1; // apply config if passed from action

  var previousState = config ? receiveMapConfigUpdater(state, {
    payload: {
      config: config,
      options: options
    }
  }) : state;

  var mergedState = _objectSpread(_objectSpread({}, previousState), {}, {
    datasets: _objectSpread(_objectSpread({}, previousState.datasets), newDataEntries)
  }); // merge state with config to be merged


  var _iterator2 = _createForOfIteratorHelper(mergedState.mergers),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var merger = _step2.value;

      if ((0, _visStateMerger.isValidMerger)(merger) && merger.toMergeProp && mergedState[merger.toMergeProp]) {
        var toMerge = mergedState[merger.toMergeProp];
        mergedState[merger.toMergeProp] = INITIAL_VIS_STATE[merger.toMergeProp];
        mergedState = merger.merge(mergedState, toMerge);
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  var newLayers = !dataEmpty ? mergedState.layers.filter(function (l) {
    return l.config.dataId && l.config.dataId in newDataEntries;
  }) : [];

  if (!newLayers.length && (options || {}).autoCreateLayers !== false) {
    // no layer merged, find defaults
    var result = addDefaultLayers(mergedState, newDataEntries);
    mergedState = result.state;
    newLayers = result.newLayers;
  }

  if (mergedState.splitMaps.length) {
    // if map is split, add new layers to splitMaps
    newLayers = mergedState.layers.filter(function (l) {
      return l.config.dataId && l.config.dataId in newDataEntries;
    });
    mergedState = _objectSpread(_objectSpread({}, mergedState), {}, {
      splitMaps: (0, _splitMapUtils.addNewLayersToSplitMap)(mergedState.splitMaps, newLayers)
    });
  } // if no tooltips merged add default tooltips


  Object.keys(newDataEntries).forEach(function (dataId) {
    var tooltipFields = mergedState.interactionConfig.tooltip.config.fieldsToShow[dataId];

    if (!Array.isArray(tooltipFields) || !tooltipFields.length) {
      mergedState = addDefaultTooltips(mergedState, newDataEntries[dataId]);
    }
  });
  var updatedState = updateAllLayerDomainData(mergedState, dataEmpty ? Object.keys(mergedState.datasets) : Object.keys(newDataEntries), undefined); // register layer animation domain,
  // need to be called after layer data is calculated

  updatedState = updateAnimationDomain(updatedState);
  return updatedState;
};
/* eslint-enable max-statements */

/**
 * Rename an existing dataset in `visState`
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').renameDatasetUpdater}
 * @public
 */


exports.updateVisDataUpdater = updateVisDataUpdater;

function renameDatasetUpdater(state, action) {
  var dataId = action.dataId,
      label = action.label;
  var datasets = state.datasets;
  var existing = datasets[dataId]; // @ts-ignore

  return existing ? _objectSpread(_objectSpread({}, state), {}, {
    datasets: _objectSpread(_objectSpread({}, datasets), {}, (0, _defineProperty2["default"])({}, dataId, _objectSpread(_objectSpread({}, existing), {}, {
      label: label
    })))
  }) : // No-op if the dataset doesn't exist
  state;
}
/**
 * When a user clicks on the specific map closing icon
 * the application will close the selected map
 * and will merge the remaining one with the global state
 * TODO: i think in the future this action should be called merge map layers with global settings
 * @param {Object} state `visState`
 * @param {Object} action action
 * @returns {Object} nextState
 */


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

  return _objectSpread(_objectSpread({}, state), {}, {
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
      onFinish = _action$onFinish === void 0 ? _visStateActions.loadFilesSuccess : _action$onFinish;

  if (!files.length) {
    return state;
  }

  var fileLoadingProgress = Array.from(files).reduce(function (accu, f, i) {
    return (0, _composerHelpers.merge_)(initialFileLoadingProgress(f, i))(accu);
  }, {});
  var fileLoading = {
    fileCache: [],
    filesToLoad: files,
    onFinish: onFinish
  };
  var nextState = (0, _composerHelpers.merge_)({
    fileLoadingProgress: fileLoadingProgress,
    fileLoading: fileLoading
  })(state);
  return loadNextFileUpdater(nextState);
};
/**
 * Sucessfully loaded one file, move on to the next one
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').loadFileStepSuccessUpdater}
 * @public
 */


exports.loadFilesUpdater = loadFilesUpdater;

function loadFileStepSuccessUpdater(state, action) {
  if (!state.fileLoading) {
    return state;
  }

  var fileName = action.fileName,
      fileCache = action.fileCache;
  var _state$fileLoading = state.fileLoading,
      filesToLoad = _state$fileLoading.filesToLoad,
      onFinish = _state$fileLoading.onFinish;
  var stateWithProgress = updateFileLoadingProgressUpdater(state, {
    fileName: fileName,
    progress: {
      percent: 1,
      message: 'Done'
    }
  }); // save processed file to fileCache

  var stateWithCache = (0, _composerHelpers.pick_)('fileLoading')((0, _composerHelpers.merge_)({
    fileCache: fileCache
  }))(stateWithProgress);
  return (0, _tasks.withTask)(stateWithCache, (0, _tasks2.DELAY_TASK)(200).map(filesToLoad.length ? _visStateActions.loadNextFile : function () {
    return onFinish(fileCache);
  }));
} // withTask<T>(state: T, task: any): T

/**
 *
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').loadNextFileUpdater}
 * @public
 */


function loadNextFileUpdater(state) {
  if (!state.fileLoading) {
    return state;
  }

  var filesToLoad = state.fileLoading.filesToLoad;

  var _filesToLoad = (0, _toArray2["default"])(filesToLoad),
      file = _filesToLoad[0],
      remainingFilesToLoad = _filesToLoad.slice(1); // save filesToLoad to state


  var nextState = (0, _composerHelpers.pick_)('fileLoading')((0, _composerHelpers.merge_)({
    filesToLoad: remainingFilesToLoad
  }))(state);
  var stateWithProgress = updateFileLoadingProgressUpdater(nextState, {
    fileName: file.name,
    progress: {
      percent: 0,
      message: 'loading...'
    }
  });
  var loaders = state.loaders,
      loadOptions = state.loadOptions;
  return (0, _tasks.withTask)(stateWithProgress, makeLoadFileTask(file, nextState.fileLoading.fileCache, loaders, loadOptions));
}

function makeLoadFileTask(file, fileCache) {
  var loaders = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var loadOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return (0, _tasks2.LOAD_FILE_TASK)({
    file: file,
    fileCache: fileCache,
    loaders: loaders,
    loadOptions: loadOptions
  }).bimap( // prettier ignore
  // success
  function (gen) {
    return (0, _visStateActions.nextFileBatch)({
      gen: gen,
      fileName: file.name,
      onFinish: function onFinish(result) {
        return (0, _visStateActions.processFileContent)({
          content: result,
          fileCache: fileCache
        });
      }
    });
  }, // error
  function (err) {
    return (0, _visStateActions.loadFilesErr)(file.name, err);
  });
}
/**
 *
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').processFileContentUpdater}
 * @public
 */


function processFileContentUpdater(state, action) {
  var _action$payload = action.payload,
      content = _action$payload.content,
      fileCache = _action$payload.fileCache;
  var stateWithProgress = updateFileLoadingProgressUpdater(state, {
    fileName: content.fileName,
    progress: {
      percent: 1,
      message: 'processing...'
    }
  });
  return (0, _tasks.withTask)(stateWithProgress, (0, _tasks2.PROCESS_FILE_DATA)({
    content: content,
    fileCache: fileCache
  }).bimap(function (result) {
    return (0, _visStateActions.loadFileStepSuccess)({
      fileName: content.fileName,
      fileCache: result
    });
  }, function (err) {
    return (0, _visStateActions.loadFilesErr)(content.fileName, err);
  }));
}

function parseProgress() {
  var prevProgress = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var progress = arguments.length > 1 ? arguments[1] : undefined;

  // This happens when receiving query metadata or other cases we don't
  // have an update for the user.
  if (!progress || !progress.percent) {
    return {};
  }

  return {
    percent: progress.percent
  };
}
/**
 * gets called with payload = AsyncGenerator<???>
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').nextFileBatchUpdater}
 * @public
 */


var nextFileBatchUpdater = function nextFileBatchUpdater(state, _ref15) {
  var _ref15$payload = _ref15.payload,
      gen = _ref15$payload.gen,
      fileName = _ref15$payload.fileName,
      progress = _ref15$payload.progress,
      accumulated = _ref15$payload.accumulated,
      onFinish = _ref15$payload.onFinish;
  var stateWithProgress = updateFileLoadingProgressUpdater(state, {
    fileName: fileName,
    progress: parseProgress(state.fileLoadingProgress[fileName], progress)
  });
  return (0, _tasks.withTask)(stateWithProgress, (0, _tasks2.UNWRAP_TASK)(gen.next()).bimap(function (_ref16) {
    var value = _ref16.value,
        done = _ref16.done;
    return done ? onFinish(accumulated) : (0, _visStateActions.nextFileBatch)({
      gen: gen,
      fileName: fileName,
      progress: value.progress,
      accumulated: value,
      onFinish: onFinish
    });
  }, function (err) {
    return (0, _visStateActions.loadFilesErr)(fileName, err);
  }));
};
/**
 * Trigger loading file error
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').loadFilesErrUpdater}
 * @public
 */


exports.nextFileBatchUpdater = nextFileBatchUpdater;

var loadFilesErrUpdater = function loadFilesErrUpdater(state, _ref17) {
  var error = _ref17.error,
      fileName = _ref17.fileName;

  // update ui with error message
  _window.console.warn(error);

  if (!state.fileLoading) {
    return state;
  }

  var _state$fileLoading2 = state.fileLoading,
      filesToLoad = _state$fileLoading2.filesToLoad,
      onFinish = _state$fileLoading2.onFinish,
      fileCache = _state$fileLoading2.fileCache;
  var nextState = updateFileLoadingProgressUpdater(state, {
    fileName: fileName,
    progress: {
      error: error
    }
  }); // kick off next file or finish

  return (0, _tasks.withTask)(nextState, (0, _tasks2.DELAY_TASK)(200).map(filesToLoad.length ? _visStateActions.loadNextFile : function () {
    return onFinish(fileCache);
  }));
};
/**
 * When select dataset for export, apply cpu filter to selected dataset
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').applyCPUFilterUpdater}
 * @public
 */


exports.loadFilesErrUpdater = loadFilesErrUpdater;

var applyCPUFilterUpdater = function applyCPUFilterUpdater(state, _ref18) {
  var dataId = _ref18.dataId;
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
  return _objectSpread(_objectSpread({}, state), {}, {
    mapInfo: _objectSpread(_objectSpread({}, state.mapInfo), action.info)
  });
};
/**
 * Helper function to update All layer domain and layer data of state
 * @type {typeof import('./vis-state-updaters').addDefaultLayers}
 */


exports.setMapInfoUpdater = setMapInfoUpdater;

function addDefaultLayers(state, datasets) {
  /** @type {Layer[]} */
  var empty = [];
  var defaultLayers = Object.values(datasets).reduce(function (accu, dataset) {
    var foundLayers = (0, _layerUtils.findDefaultLayer)(dataset, state.layerClasses);
    return foundLayers && foundLayers.length ? accu.concat(foundLayers) : accu;
  }, empty);
  return {
    state: _objectSpread(_objectSpread({}, state), {}, {
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

  var merged = _objectSpread(_objectSpread({}, state.interactionConfig.tooltip.config.fieldsToShow), tooltipFields);

  return (0, _utils.set)(['interactionConfig', 'tooltip', 'config', 'fieldsToShow'], merged, state);
}

function initialFileLoadingProgress(file, index) {
  var fileName = file.name || "Untitled File ".concat(index);
  return (0, _defineProperty2["default"])({}, fileName, {
    // percent of current file
    percent: 0,
    message: '',
    fileName: fileName,
    error: null
  });
}

function updateFileLoadingProgressUpdater(state, _ref20) {
  var fileName = _ref20.fileName,
      progress = _ref20.progress;
  return (0, _composerHelpers.pick_)('fileLoadingProgress')((0, _composerHelpers.pick_)(fileName)((0, _composerHelpers.merge_)(progress)))(state);
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

      var _calculateLayerData5 = (0, _layerUtils.calculateLayerData)(newLayer, state, state.layerData[i]),
          layerData = _calculateLayerData5.layerData,
          layer = _calculateLayerData5.layer;

      newLayers.push(layer);
      newLayerData.push(layerData);
    } else {
      newLayers.push(oldLayer);
      newLayerData.push(state.layerData[i]);
    }
  });

  var newState = _objectSpread(_objectSpread({}, state), {}, {
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
    return _objectSpread(_objectSpread({}, state), {}, {
      animationConfig: _objectSpread(_objectSpread({}, state.animationConfig), {}, {
        domain: null,
        defaultTimeFormat: null
      })
    });
  }

  var mergedDomain = animatableLayers.reduce(function (accu, layer) {
    return [Math.min(accu[0], layer.animationDomain[0]), Math.max(accu[1], layer.animationDomain[1])];
  }, [Number(Infinity), -Infinity]);
  var defaultTimeFormat = (0, _filterUtils.getTimeWidgetTitleFormatter)(mergedDomain);
  return _objectSpread(_objectSpread({}, state), {}, {
    animationConfig: _objectSpread(_objectSpread({}, state.animationConfig), {}, {
      currentTime: (0, _filterUtils.isInRange)(state.animationConfig.currentTime, mergedDomain) ? state.animationConfig.currentTime : mergedDomain[0],
      domain: mergedDomain,
      defaultTimeFormat: defaultTimeFormat
    })
  });
}
/**
 * Update the status of the editor
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').setEditorModeUpdater}
 */


var setEditorModeUpdater = function setEditorModeUpdater(state, _ref21) {
  var mode = _ref21.mode;
  return _objectSpread(_objectSpread({}, state), {}, {
    editor: _objectSpread(_objectSpread({}, state.editor), {}, {
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

function setFeaturesUpdater(state, _ref22) {
  var _ref22$features = _ref22.features,
      features = _ref22$features === void 0 ? [] : _ref22$features;
  var lastFeature = features.length && features[features.length - 1];

  var newState = _objectSpread(_objectSpread({}, state), {}, {
    editor: _objectSpread(_objectSpread({}, state.editor), {}, {
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


var setSelectedFeatureUpdater = function setSelectedFeatureUpdater(state, _ref23) {
  var feature = _ref23.feature;
  return _objectSpread(_objectSpread({}, state), {}, {
    editor: _objectSpread(_objectSpread({}, state.editor), {}, {
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

function deleteFeatureUpdater(state, _ref24) {
  var feature = _ref24.feature;

  if (!feature) {
    return state;
  }

  var newState = _objectSpread(_objectSpread({}, state), {}, {
    editor: _objectSpread(_objectSpread({}, state.editor), {}, {
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


  var newEditor = _objectSpread(_objectSpread({}, state.editor), {}, {
    features: state.editor.features.filter(function (f) {
      return f.id !== feature.id;
    }),
    selectedFeature: null
  });

  return _objectSpread(_objectSpread({}, state), {}, {
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
      var noneFilterFeature = _objectSpread(_objectSpread({}, feature), {}, {
        properties: _objectSpread(_objectSpread({}, feature.properties), {}, {
          filterId: null
        })
      });

      return _objectSpread(_objectSpread({}, state), {}, {
        editor: _objectSpread(_objectSpread({}, state.editor), {}, {
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

    newState = _objectSpread(_objectSpread({}, state), {}, {
      filters: [].concat((0, _toConsumableArray2["default"])(state.filters), [newFilter]),
      editor: _objectSpread(_objectSpread({}, state.editor), {}, {
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


function sortTableColumnUpdater(state, _ref25) {
  var dataId = _ref25.dataId,
      column = _ref25.column,
      mode = _ref25.mode;
  var dataset = state.datasets[dataId];

  if (!dataset) {
    return state;
  }

  var sortMode = mode;

  if (!sortMode) {
    var currentMode = (0, _lodash3["default"])(dataset, ['sortColumn', column]); // @ts-ignore - should be fixable in a TS file

    sortMode = currentMode ? Object.keys(_defaultSettings.SORT_ORDER).find(function (m) {
      return m !== currentMode;
    }) : _defaultSettings.SORT_ORDER.ASCENDING;
  }

  var sorted = (0, _keplerTable.sortDatasetByColumn)(dataset, column, sortMode);
  return (0, _utils.set)(['datasets', dataId], sorted, state);
}
/**
 * @memberof visStateUpdaters
 * @type {typeof import('./vis-state-updaters').pinTableColumnUpdater}
 * @public
 */


function pinTableColumnUpdater(state, _ref26) {
  var dataId = _ref26.dataId,
      column = _ref26.column;
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


function copyTableColumnUpdater(state, _ref27) {
  var dataId = _ref27.dataId,
      column = _ref27.column;
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
  return _objectSpread(_objectSpread({}, state), {}, {
    editor: _objectSpread(_objectSpread({}, state.editor), {}, {
      visible: !state.editor.visible
    })
  });
}

function setFilterAnimationTimeConfigUpdater(state, _ref28) {
  var idx = _ref28.idx,
      config = _ref28.config;
  var oldFilter = state.filters[idx];

  if (!oldFilter) {
    _window.console.error("filters.".concat(idx, " is undefined"));

    return state;
  }

  if (oldFilter.type !== _defaultSettings.FILTER_TYPES.timeRange) {
    _window.console.error("setFilterAnimationTimeConfig can only be called to update a time filter. check filter.type === 'timeRange'");

    return state;
  }

  var updates = checkTimeConfigArgs(config);
  return (0, _composerHelpers.pick_)('filters')((0, _composerHelpers.swap_)((0, _composerHelpers.merge_)(updates)(oldFilter)))(state);
}

function checkTimeConfigArgs(config) {
  var allowed = ['timeFormat', 'timezone'];
  return Object.keys(config).reduce(function (accu, prop) {
    if (!allowed.includes(prop)) {
      _window.console.error("setLayerAnimationTimeConfig takes timeFormat and/or timezone as options, found ".concat(prop));

      return accu;
    } // here we are NOT checking if timezone or timeFormat input is valid


    accu[prop] = config[prop];
    return accu;
  }, {});
}
/**
 * Update editor
 * @type {typeof import('./vis-state-updaters').setLayerAnimationTimeConfigUpdater}
 */


function setLayerAnimationTimeConfigUpdater(state, _ref29) {
  var config = _ref29.config;

  if (!config) {
    return state;
  }

  var updates = checkTimeConfigArgs(config);
  return (0, _composerHelpers.pick_)('animationConfig')((0, _composerHelpers.merge_)(updates))(state);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy92aXMtc3RhdGUtdXBkYXRlcnMuanMiXSwibmFtZXMiOlsidmlzU3RhdGVVcGRhdGVycyIsIkRFRkFVTFRfQU5JTUFUSU9OX0NPTkZJRyIsImRvbWFpbiIsImN1cnJlbnRUaW1lIiwic3BlZWQiLCJpc0FuaW1hdGluZyIsInRpbWVGb3JtYXQiLCJ0aW1lem9uZSIsImRlZmF1bHRUaW1lRm9ybWF0IiwiREVGQVVMVF9FRElUT1IiLCJtb2RlIiwiRURJVE9SX01PREVTIiwiRFJBV19QT0xZR09OIiwiZmVhdHVyZXMiLCJzZWxlY3RlZEZlYXR1cmUiLCJ2aXNpYmxlIiwiSU5JVElBTF9WSVNfU1RBVEUiLCJtYXBJbmZvIiwidGl0bGUiLCJkZXNjcmlwdGlvbiIsImxheWVycyIsImxheWVyRGF0YSIsImxheWVyVG9CZU1lcmdlZCIsImxheWVyT3JkZXIiLCJmaWx0ZXJzIiwiZmlsdGVyVG9CZU1lcmdlZCIsImRhdGFzZXRzIiwiZWRpdGluZ0RhdGFzZXQiLCJ1bmRlZmluZWQiLCJpbnRlcmFjdGlvbkNvbmZpZyIsImludGVyYWN0aW9uVG9CZU1lcmdlZCIsImxheWVyQmxlbmRpbmciLCJob3ZlckluZm8iLCJjbGlja2VkIiwibW91c2VQb3MiLCJzcGxpdE1hcHMiLCJzcGxpdE1hcHNUb0JlTWVyZ2VkIiwibGF5ZXJDbGFzc2VzIiwiTGF5ZXJDbGFzc2VzIiwiYW5pbWF0aW9uQ29uZmlnIiwiZWRpdG9yIiwiZmlsZUxvYWRpbmciLCJmaWxlTG9hZGluZ1Byb2dyZXNzIiwibG9hZGVycyIsImxvYWRPcHRpb25zIiwibWVyZ2VycyIsIlZJU19TVEFURV9NRVJHRVJTIiwic2NoZW1hIiwiS2VwbGVyR0xTY2hlbWEiLCJ1cGRhdGVTdGF0ZVdpdGhMYXllckFuZERhdGEiLCJzdGF0ZSIsImxheWVyIiwiaWR4IiwibWFwIiwibHlyIiwiaSIsImQiLCJ1cGRhdGVTdGF0ZU9uTGF5ZXJWaXNpYmlsaXR5Q2hhbmdlIiwibmV3U3RhdGUiLCJsZW5ndGgiLCJjb25maWciLCJpc1Zpc2libGUiLCJhbmltYXRpb24iLCJlbmFibGVkIiwidXBkYXRlQW5pbWF0aW9uRG9tYWluIiwibGF5ZXJDb25maWdDaGFuZ2VVcGRhdGVyIiwiYWN0aW9uIiwib2xkTGF5ZXIiLCJmaW5kSW5kZXgiLCJsIiwiaWQiLCJwcm9wcyIsIk9iamVjdCIsImtleXMiLCJuZXdDb25maWciLCJkYXRhSWQiLCJyZXN0Q29uZmlnIiwic3RhdGVXaXRoRGF0YUlkIiwibGF5ZXJEYXRhSWRDaGFuZ2VVcGRhdGVyIiwibmV4dExheWVyIiwiZmluZCIsIm5ld0xheWVyIiwidXBkYXRlTGF5ZXJDb25maWciLCJzaG91bGRDYWxjdWxhdGVMYXllckRhdGEiLCJvbGRMYXllckRhdGEiLCJ1cGRhdGVMYXllckRhdGFSZXN1bHQiLCJhZGRPclJlbW92ZVRleHRMYWJlbHMiLCJuZXdGaWVsZHMiLCJ0ZXh0TGFiZWwiLCJuZXdUZXh0TGFiZWwiLCJzbGljZSIsImN1cnJlbnRGaWVsZHMiLCJ0bCIsImZpZWxkIiwibmFtZSIsImZpbHRlciIsImFkZEZpZWxkcyIsImYiLCJpbmNsdWRlcyIsImRlbGV0ZUZpZWxkcyIsImZkIiwiREVGQVVMVF9URVhUX0xBQkVMIiwiYWYiLCJ1cGRhdGVUZXh0TGFiZWxQcm9wQW5kVmFsdWUiLCJwcm9wIiwidmFsdWUiLCJoYXNPd25Qcm9wZXJ0eSIsInNwbGljZSIsImxheWVyVGV4dExhYmVsQ2hhbmdlVXBkYXRlciIsInZhbGlkYXRlRXhpc3RpbmdMYXllcldpdGhEYXRhIiwiZGF0YXNldCIsImxvYWRlZExheWVyIiwiYWxsb3dFbXB0eUNvbHVtbiIsImlzVmFsaWRUb1NhdmUiLCJ2YWxpZGF0ZWQiLCJ0eXBlIiwiaXNDb25maWdBY3RpdmUiLCJ1cGRhdGVMYXllckRvbWFpbiIsImxheWVyVHlwZUNoYW5nZVVwZGF0ZXIiLCJuZXdUeXBlIiwib2xkSWQiLCJDb25zb2xlIiwiZXJyb3IiLCJhc3NpZ25Db25maWdUb0xheWVyIiwidmlzQ29uZmlnU2V0dGluZ3MiLCJzZXR0aW5ncyIsIm9sZExheWVyTWFwIiwib3RoZXJMYXllcnMiLCJsYXllclZpc3VhbENoYW5uZWxDaGFuZ2VVcGRhdGVyIiwiY2hhbm5lbCIsInVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbCIsImxheWVyVmlzQ29uZmlnQ2hhbmdlVXBkYXRlciIsIm5ld1Zpc0NvbmZpZyIsInZpc0NvbmZpZyIsInNldEZpbHRlckFuaW1hdGlvblRpbWVVcGRhdGVyIiwic2V0RmlsdGVyVXBkYXRlciIsInNldEZpbHRlckFuaW1hdGlvbldpbmRvd1VwZGF0ZXIiLCJhbmltYXRpb25XaW5kb3ciLCJ2YWx1ZUluZGV4Iiwib2xkRmlsdGVyIiwibmV3RmlsdGVyIiwiZGF0YXNldElkcyIsIkZJTFRFUl9VUERBVEVSX1BST1BTIiwiZGF0YXNldElkIiwibWVyZ2VEb21haW4iLCJ1cGRhdGVkRmlsdGVyIiwibmV3RGF0YXNldCIsImdwdSIsImxheWVySWQiLCJsYXllcklkRGlmZmVyZW5jZSIsImxheWVyRGF0YUlkcyIsImxpZCIsIm5ld0RhdGFJZHMiLCJlbmxhcmdlZEZpbHRlciIsImVubGFyZ2VkIiwiZGF0YXNldElkc1RvRmlsdGVyIiwiTElNSVRFRF9GSUxURVJfRUZGRUNUX1BST1BTIiwiZmlsdGVyZWREYXRhc2V0cyIsInVwZGF0ZUFsbExheWVyRG9tYWluRGF0YSIsInNldEZpbHRlclBsb3RVcGRhdGVyIiwibmV3UHJvcCIsInBsb3RUeXBlIiwiYWRkRmlsdGVyVXBkYXRlciIsImxheWVyQ29sb3JVSUNoYW5nZVVwZGF0ZXIiLCJvbGRWaXhDb25maWciLCJ1cGRhdGVMYXllckNvbG9yVUkiLCJ0b2dnbGVGaWx0ZXJBbmltYXRpb25VcGRhdGVyIiwidG9nZ2xlTGF5ZXJBbmltYXRpb25VcGRhdGVyIiwidG9nZ2xlTGF5ZXJBbmltYXRpb25Db250cm9sVXBkYXRlciIsImhpZGVDb250cm9sIiwidXBkYXRlRmlsdGVyQW5pbWF0aW9uU3BlZWRVcGRhdGVyIiwic2V0TGF5ZXJBbmltYXRpb25UaW1lVXBkYXRlciIsInVwZGF0ZUxheWVyQW5pbWF0aW9uU3BlZWRVcGRhdGVyIiwiZW5sYXJnZUZpbHRlclVwZGF0ZXIiLCJ0b2dnbGVGaWx0ZXJGZWF0dXJlVXBkYXRlciIsImFzc2lnbiIsInJlbW92ZUZpbHRlclVwZGF0ZXIiLCJuZXdGaWx0ZXJzIiwibmV3RWRpdG9yIiwiYWRkTGF5ZXJVcGRhdGVyIiwibmV3TGF5ZXJEYXRhIiwid2FybiIsInJlc3VsdCIsImRlZmF1bHREYXRhc2V0IiwiTGF5ZXIiLCJyZW1vdmVMYXllclVwZGF0ZXIiLCJsYXllclRvUmVtb3ZlIiwibmV3TWFwcyIsInBpZCIsImlzTGF5ZXJIb3ZlcmVkIiwiZHVwbGljYXRlTGF5ZXJVcGRhdGVyIiwib3JpZ2luYWwiLCJvcmlnaW5hbExheWVyT3JkZXJJZHgiLCJuZXdMYWJlbCIsImxhYmVsIiwicG9zdGZpeCIsIkxBWUVSX0lEX0xFTkdUSCIsIm5leHRTdGF0ZSIsIm5ld0xheWVyT3JkZXJJZHgiLCJuZXdMYXllck9yZGVyIiwicmVvcmRlckxheWVyVXBkYXRlciIsIm9yZGVyIiwicmVtb3ZlRGF0YXNldFVwZGF0ZXIiLCJkYXRhc2V0S2V5IiwibmV3RGF0YXNldHMiLCJpbmRleGVzIiwicmVkdWNlIiwibGlzdE9mSW5kZXhlcyIsImluZGV4IiwicHVzaCIsImN1cnJlbnRTdGF0ZSIsImluZGV4Q291bnRlciIsImN1cnJlbnRJbmRleCIsInRvb2x0aXAiLCJmaWVsZHNUb1Nob3ciLCJmaWVsZHMiLCJ1cGRhdGVMYXllckJsZW5kaW5nVXBkYXRlciIsInNob3dEYXRhc2V0VGFibGVVcGRhdGVyIiwicmVzZXRNYXBDb25maWdVcGRhdGVyIiwiaW5pdGlhbFN0YXRlIiwicmVjZWl2ZU1hcENvbmZpZ1VwZGF0ZXIiLCJwYXlsb2FkIiwib3B0aW9ucyIsInZpc1N0YXRlIiwia2VlcEV4aXN0aW5nQ29uZmlnIiwibWVyZ2VkU3RhdGUiLCJtZXJnZXIiLCJtZXJnZSIsImxheWVySG92ZXJVcGRhdGVyIiwiaW5mbyIsImludGVyYWN0aW9uQ29uZmlnQ2hhbmdlVXBkYXRlciIsImNvbnRyYWRpY3QiLCJmb3JFYWNoIiwiayIsImxheWVyQ2xpY2tVcGRhdGVyIiwiY29vcmRpbmF0ZSIsInBpbm5lZCIsInBpY2tlZCIsIm1hcENsaWNrVXBkYXRlciIsIm1vdXNlTW92ZVVwZGF0ZXIiLCJldnQiLCJ2YWx1ZXMiLCJzb21lIiwibW91c2VQb3NpdGlvbiIsInBvaW50IiwibG5nTGF0IiwidG9nZ2xlU3BsaXRNYXBVcGRhdGVyIiwiY2xvc2VTcGVjaWZpY01hcEF0SW5kZXgiLCJ0b2dnbGVMYXllckZvck1hcFVwZGF0ZXIiLCJtYXBJbmRleCIsInNtIiwidXBkYXRlVmlzRGF0YVVwZGF0ZXIiLCJuZXdEYXRhRW50cmllcyIsImFjY3UiLCJkYXRhIiwibWV0YWRhdGEiLCJkYXRhRW1wdHkiLCJwcmV2aW91c1N0YXRlIiwidG9NZXJnZVByb3AiLCJ0b01lcmdlIiwibmV3TGF5ZXJzIiwiYXV0b0NyZWF0ZUxheWVycyIsImFkZERlZmF1bHRMYXllcnMiLCJ0b29sdGlwRmllbGRzIiwiQXJyYXkiLCJpc0FycmF5IiwiYWRkRGVmYXVsdFRvb2x0aXBzIiwidXBkYXRlZFN0YXRlIiwicmVuYW1lRGF0YXNldFVwZGF0ZXIiLCJleGlzdGluZyIsImluZGV4VG9SZXRyaWV2ZSIsIm1hcExheWVycyIsImxvYWRGaWxlc1VwZGF0ZXIiLCJmaWxlcyIsIm9uRmluaXNoIiwibG9hZEZpbGVzU3VjY2VzcyIsImZyb20iLCJpbml0aWFsRmlsZUxvYWRpbmdQcm9ncmVzcyIsImZpbGVDYWNoZSIsImZpbGVzVG9Mb2FkIiwibG9hZE5leHRGaWxlVXBkYXRlciIsImxvYWRGaWxlU3RlcFN1Y2Nlc3NVcGRhdGVyIiwiZmlsZU5hbWUiLCJzdGF0ZVdpdGhQcm9ncmVzcyIsInVwZGF0ZUZpbGVMb2FkaW5nUHJvZ3Jlc3NVcGRhdGVyIiwicHJvZ3Jlc3MiLCJwZXJjZW50IiwibWVzc2FnZSIsInN0YXRlV2l0aENhY2hlIiwibG9hZE5leHRGaWxlIiwiZmlsZSIsInJlbWFpbmluZ0ZpbGVzVG9Mb2FkIiwibWFrZUxvYWRGaWxlVGFzayIsImJpbWFwIiwiZ2VuIiwiY29udGVudCIsImVyciIsInByb2Nlc3NGaWxlQ29udGVudFVwZGF0ZXIiLCJwYXJzZVByb2dyZXNzIiwicHJldlByb2dyZXNzIiwibmV4dEZpbGVCYXRjaFVwZGF0ZXIiLCJhY2N1bXVsYXRlZCIsIm5leHQiLCJkb25lIiwibG9hZEZpbGVzRXJyVXBkYXRlciIsImFwcGx5Q1BVRmlsdGVyVXBkYXRlciIsImRhdGFJZHMiLCJzZXRNYXBJbmZvVXBkYXRlciIsImVtcHR5IiwiZGVmYXVsdExheWVycyIsImZvdW5kTGF5ZXJzIiwiY29uY2F0IiwiXyIsIm1lcmdlZCIsImZpeGVkRG9tYWluIiwiYW5pbWF0YWJsZUxheWVycyIsImFuaW1hdGlvbkRvbWFpbiIsIm1lcmdlZERvbWFpbiIsIk1hdGgiLCJtaW4iLCJtYXgiLCJOdW1iZXIiLCJJbmZpbml0eSIsInNldEVkaXRvck1vZGVVcGRhdGVyIiwic2V0RmVhdHVyZXNVcGRhdGVyIiwibGFzdEZlYXR1cmUiLCJwcm9wZXJ0aWVzIiwiaXNDbG9zZWQiLCJFRElUIiwiZmVhdHVyZSIsImZpbHRlcklkIiwiZmVhdHVyZVZhbHVlIiwiZmlsdGVySWR4IiwiZmlsIiwic2V0U2VsZWN0ZWRGZWF0dXJlVXBkYXRlciIsImRlbGV0ZUZlYXR1cmVVcGRhdGVyIiwic2V0UG9seWdvbkZpbHRlckxheWVyVXBkYXRlciIsIm5ld0xheWVySWQiLCJub25lRmlsdGVyRmVhdHVyZSIsImlzTGF5ZXJJbmNsdWRlZCIsInNvcnRUYWJsZUNvbHVtblVwZGF0ZXIiLCJjb2x1bW4iLCJzb3J0TW9kZSIsImN1cnJlbnRNb2RlIiwiU09SVF9PUkRFUiIsIm0iLCJBU0NFTkRJTkciLCJzb3J0ZWQiLCJwaW5UYWJsZUNvbHVtblVwZGF0ZXIiLCJwaW5uZWRDb2x1bW5zIiwiY28iLCJjb3B5VGFibGVDb2x1bW5VcGRhdGVyIiwiZmllbGRJZHgiLCJ0ZXh0IiwiYWxsRGF0YSIsImpvaW4iLCJ0b2dnbGVFZGl0b3JWaXNpYmlsaXR5VXBkYXRlciIsInNldEZpbHRlckFuaW1hdGlvblRpbWVDb25maWdVcGRhdGVyIiwiRklMVEVSX1RZUEVTIiwidGltZVJhbmdlIiwidXBkYXRlcyIsImNoZWNrVGltZUNvbmZpZ0FyZ3MiLCJhbGxvd2VkIiwic2V0TGF5ZXJBbmltYXRpb25UaW1lQ29uZmlnVXBkYXRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFFQTs7QUFRQTs7QUFDQTs7QUFnQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBRUE7O0FBUUE7O0FBTUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBOztBQUNBLElBQU1BLGdCQUFnQixHQUFHLElBQXpCO0FBQ0E7O0FBRUE7O0FBQ08sSUFBTUMsd0JBQXdCLEdBQUc7QUFDdENDLEVBQUFBLE1BQU0sRUFBRSxJQUQ4QjtBQUV0Q0MsRUFBQUEsV0FBVyxFQUFFLElBRnlCO0FBR3RDQyxFQUFBQSxLQUFLLEVBQUUsQ0FIK0I7QUFJdENDLEVBQUFBLFdBQVcsRUFBRSxLQUp5QjtBQUt0Q0MsRUFBQUEsVUFBVSxFQUFFLElBTDBCO0FBTXRDQyxFQUFBQSxRQUFRLEVBQUUsSUFONEI7QUFPdENDLEVBQUFBLGlCQUFpQixFQUFF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QUksQ0FBQ0EsTUFBTCxFQUFhO0FBQ1gsV0FBT1YsS0FBUDtBQUNEOztBQUNELE1BQU1zVCxPQUFPLEdBQUdDLG1CQUFtQixDQUFDN1MsTUFBRCxDQUFuQztBQUNBLFNBQU8sNEJBQU0saUJBQU4sRUFBeUIsNkJBQU80UyxPQUFQLENBQXpCLEVBQTBDdFQsS0FBMUMsQ0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtjb25zb2xlIGFzIENvbnNvbGV9IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuaW1wb3J0IHtkaXNhYmxlU3RhY2tDYXB0dXJpbmcsIHdpdGhUYXNrfSBmcm9tICdyZWFjdC1wYWxtL3Rhc2tzJztcbmltcG9ydCBjbG9uZURlZXAgZnJvbSAnbG9kYXNoLmNsb25lZGVlcCc7XG5pbXBvcnQgdW5pcSBmcm9tICdsb2Rhc2gudW5pcSc7XG5pbXBvcnQgZ2V0IGZyb20gJ2xvZGFzaC5nZXQnO1xuaW1wb3J0IHhvciBmcm9tICdsb2Rhc2gueG9yJztcbmltcG9ydCBjb3B5IGZyb20gJ2NvcHktdG8tY2xpcGJvYXJkJztcbmltcG9ydCB7cGFyc2VGaWVsZFZhbHVlfSBmcm9tICd1dGlscy9kYXRhLXV0aWxzJztcbi8vIFRhc2tzXG5pbXBvcnQge0xPQURfRklMRV9UQVNLLCBVTldSQVBfVEFTSywgUFJPQ0VTU19GSUxFX0RBVEEsIERFTEFZX1RBU0t9IGZyb20gJ3Rhc2tzL3Rhc2tzJztcbi8vIEFjdGlvbnNcbmltcG9ydCB7XG4gIGxvYWRGaWxlc0VycixcbiAgbG9hZEZpbGVzU3VjY2VzcyxcbiAgbG9hZEZpbGVTdGVwU3VjY2VzcyxcbiAgbG9hZE5leHRGaWxlLFxuICBuZXh0RmlsZUJhdGNoXG59IGZyb20gJ2FjdGlvbnMvdmlzLXN0YXRlLWFjdGlvbnMnO1xuLy8gVXRpbHNcbmltcG9ydCB7ZmluZEZpZWxkc1RvU2hvdywgZ2V0RGVmYXVsdEludGVyYWN0aW9ufSBmcm9tICd1dGlscy9pbnRlcmFjdGlvbi11dGlscyc7XG5pbXBvcnQge1xuICBhcHBseUZpbHRlckZpZWxkTmFtZSxcbiAgYXBwbHlGaWx0ZXJzVG9EYXRhc2V0cyxcbiAgZmVhdHVyZVRvRmlsdGVyVmFsdWUsXG4gIEZJTFRFUl9VUERBVEVSX1BST1BTLFxuICBmaWx0ZXJEYXRhc2V0Q1BVLFxuICBnZW5lcmF0ZVBvbHlnb25GaWx0ZXIsXG4gIGdldERlZmF1bHRGaWx0ZXIsXG4gIGdldERlZmF1bHRGaWx0ZXJQbG90VHlwZSxcbiAgZ2V0RmlsdGVySWRJbkZlYXR1cmUsXG4gIGdldEZpbHRlclBsb3QsXG4gIGdldFRpbWVXaWRnZXRUaXRsZUZvcm1hdHRlcixcbiAgaXNJblJhbmdlLFxuICBMSU1JVEVEX0ZJTFRFUl9FRkZFQ1RfUFJPUFMsXG4gIHVwZGF0ZUZpbHRlckRhdGFJZFxufSBmcm9tICd1dGlscy9maWx0ZXItdXRpbHMnO1xuaW1wb3J0IHthc3NpZ25HcHVDaGFubmVsLCBzZXRGaWx0ZXJHcHVNb2RlfSBmcm9tICd1dGlscy9ncHUtZmlsdGVyLXV0aWxzJztcbmltcG9ydCB7Y3JlYXRlTmV3RGF0YUVudHJ5fSBmcm9tICd1dGlscy9kYXRhc2V0LXV0aWxzJztcbmltcG9ydCB7c29ydERhdGFzZXRCeUNvbHVtbn0gZnJvbSAndXRpbHMvdGFibGUtdXRpbHMva2VwbGVyLXRhYmxlJztcbmltcG9ydCB7c2V0LCB0b0FycmF5LCBhcnJheUluc2VydCwgZ2VuZXJhdGVIYXNoSWR9IGZyb20gJ3V0aWxzL3V0aWxzJztcblxuaW1wb3J0IHtjYWxjdWxhdGVMYXllckRhdGEsIGZpbmREZWZhdWx0TGF5ZXJ9IGZyb20gJ3V0aWxzL2xheWVyLXV0aWxzJztcblxuaW1wb3J0IHtcbiAgaXNWYWxpZE1lcmdlcixcbiAgVklTX1NUQVRFX01FUkdFUlMsXG4gIHZhbGlkYXRlTGF5ZXJXaXRoRGF0YSxcbiAgY3JlYXRlTGF5ZXJGcm9tQ29uZmlnLFxuICBzZXJpYWxpemVMYXllclxufSBmcm9tICcuL3Zpcy1zdGF0ZS1tZXJnZXInO1xuXG5pbXBvcnQge1xuICBhZGROZXdMYXllcnNUb1NwbGl0TWFwLFxuICBjb21wdXRlU3BsaXRNYXBMYXllcnMsXG4gIHJlbW92ZUxheWVyRnJvbVNwbGl0TWFwc1xufSBmcm9tICd1dGlscy9zcGxpdC1tYXAtdXRpbHMnO1xuXG5pbXBvcnQge0xheWVyLCBMYXllckNsYXNzZXMsIExBWUVSX0lEX0xFTkdUSH0gZnJvbSAnbGF5ZXJzJztcbmltcG9ydCB7REVGQVVMVF9URVhUX0xBQkVMfSBmcm9tICdsYXllcnMvbGF5ZXItZmFjdG9yeSc7XG5pbXBvcnQge0VESVRPUl9NT0RFUywgU09SVF9PUkRFUiwgRklMVEVSX1RZUEVTfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5pbXBvcnQge3BpY2tfLCBtZXJnZV8sIHN3YXBffSBmcm9tICcuL2NvbXBvc2VyLWhlbHBlcnMnO1xuaW1wb3J0IHtwcm9jZXNzRmlsZUNvbnRlbnR9IGZyb20gJ2FjdGlvbnMvdmlzLXN0YXRlLWFjdGlvbnMnO1xuXG5pbXBvcnQgS2VwbGVyR0xTY2hlbWEgZnJvbSAnc2NoZW1hcyc7XG5cbi8vIHR5cGUgaW1wb3J0c1xuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykuRmllbGR9IEZpZWxkICovXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5GaWx0ZXJ9IEZpbHRlciAqL1xuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykuS2VwbGVyVGFibGV9IEtlcGxlclRhYmxlICovXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5WaXNTdGF0ZX0gVmlzU3RhdGUgKi9cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLkRhdGFzZXRzfSBEYXRhc2V0cyAqL1xuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykuQW5pbWF0aW9uQ29uZmlnfSBBbmltYXRpb25Db25maWcgKi9cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLkVkaXRvcn0gRWRpdG9yICovXG5cbi8vIHJlYWN0LXBhbG1cbi8vIGRpc2FibGUgY2FwdHVyZSBleGNlcHRpb24gZm9yIHJlYWN0LXBhbG0gY2FsbCB0byB3aXRoVGFza1xuZGlzYWJsZVN0YWNrQ2FwdHVyaW5nKCk7XG5cbi8qKlxuICogVXBkYXRlcnMgZm9yIGB2aXNTdGF0ZWAgcmVkdWNlci4gQ2FuIGJlIHVzZWQgaW4geW91ciByb290IHJlZHVjZXIgdG8gZGlyZWN0bHkgbW9kaWZ5IGtlcGxlci5nbCdzIHN0YXRlLlxuICogUmVhZCBtb3JlIGFib3V0IFtVc2luZyB1cGRhdGVyc10oLi4vYWR2YW5jZWQtdXNhZ2UvdXNpbmctdXBkYXRlcnMubWQpXG4gKlxuICogQHB1YmxpY1xuICogQGV4YW1wbGVcbiAqXG4gKiBpbXBvcnQga2VwbGVyR2xSZWR1Y2VyLCB7dmlzU3RhdGVVcGRhdGVyc30gZnJvbSAna2VwbGVyLmdsL3JlZHVjZXJzJztcbiAqIC8vIFJvb3QgUmVkdWNlclxuICogY29uc3QgcmVkdWNlcnMgPSBjb21iaW5lUmVkdWNlcnMoe1xuICogIGtlcGxlckdsOiBrZXBsZXJHbFJlZHVjZXIsXG4gKiAgYXBwOiBhcHBSZWR1Y2VyXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBjb21wb3NlZFJlZHVjZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICogIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAqICAgIGNhc2UgJ0NMSUNLX0JVVFRPTic6XG4gKiAgICAgIHJldHVybiB7XG4gKiAgICAgICAgLi4uc3RhdGUsXG4gKiAgICAgICAga2VwbGVyR2w6IHtcbiAqICAgICAgICAgIC4uLnN0YXRlLmtlcGxlckdsLFxuICogICAgICAgICAgZm9vOiB7XG4gKiAgICAgICAgICAgICAuLi5zdGF0ZS5rZXBsZXJHbC5mb28sXG4gKiAgICAgICAgICAgICB2aXNTdGF0ZTogdmlzU3RhdGVVcGRhdGVycy5lbmxhcmdlRmlsdGVyVXBkYXRlcihcbiAqICAgICAgICAgICAgICAgc3RhdGUua2VwbGVyR2wuZm9vLnZpc1N0YXRlLFxuICogICAgICAgICAgICAgICB7aWR4OiAwfVxuICogICAgICAgICAgICAgKVxuICogICAgICAgICAgfVxuICogICAgICAgIH1cbiAqICAgICAgfTtcbiAqICB9XG4gKiAgcmV0dXJuIHJlZHVjZXJzKHN0YXRlLCBhY3Rpb24pO1xuICogfTtcbiAqXG4gKiBleHBvcnQgZGVmYXVsdCBjb21wb3NlZFJlZHVjZXI7XG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4vLyBAdHMtaWdub3JlXG5jb25zdCB2aXNTdGF0ZVVwZGF0ZXJzID0gbnVsbDtcbi8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cblxuLyoqIEB0eXBlIHtBbmltYXRpb25Db25maWd9ICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9BTklNQVRJT05fQ09ORklHID0ge1xuICBkb21haW46IG51bGwsXG4gIGN1cnJlbnRUaW1lOiBudWxsLFxuICBzcGVlZDogMSxcbiAgaXNBbmltYXRpbmc6IGZhbHNlLFxuICB0aW1lRm9ybWF0OiBudWxsLFxuICB0aW1lem9uZTogbnVsbCxcbiAgZGVmYXVsdFRpbWVGb3JtYXQ6IG51bGxcbn07XG5cbi8qKiBAdHlwZSB7RWRpdG9yfSAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfRURJVE9SID0ge1xuICBtb2RlOiBFRElUT1JfTU9ERVMuRFJBV19QT0xZR09OLFxuICBmZWF0dXJlczogW10sXG4gIHNlbGVjdGVkRmVhdHVyZTogbnVsbCxcbiAgdmlzaWJsZTogdHJ1ZVxufTtcblxuLyoqXG4gKiBEZWZhdWx0IGluaXRpYWwgYHZpc1N0YXRlYFxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEBjb25zdGFudFxuICogQHR5cGUge1Zpc1N0YXRlfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgSU5JVElBTF9WSVNfU1RBVEUgPSB7XG4gIC8vIG1hcCBpbmZvXG4gIG1hcEluZm86IHtcbiAgICB0aXRsZTogJycsXG4gICAgZGVzY3JpcHRpb246ICcnXG4gIH0sXG4gIC8vIGxheWVyc1xuICBsYXllcnM6IFtdLFxuICBsYXllckRhdGE6IFtdLFxuICBsYXllclRvQmVNZXJnZWQ6IFtdLFxuICBsYXllck9yZGVyOiBbXSxcblxuICAvLyBmaWx0ZXJzXG4gIGZpbHRlcnM6IFtdLFxuICBmaWx0ZXJUb0JlTWVyZ2VkOiBbXSxcblxuICAvLyBhIGNvbGxlY3Rpb24gb2YgbXVsdGlwbGUgZGF0YXNldFxuICBkYXRhc2V0czoge30sXG4gIGVkaXRpbmdEYXRhc2V0OiB1bmRlZmluZWQsXG5cbiAgaW50ZXJhY3Rpb25Db25maWc6IGdldERlZmF1bHRJbnRlcmFjdGlvbigpLFxuICBpbnRlcmFjdGlvblRvQmVNZXJnZWQ6IHVuZGVmaW5lZCxcblxuICBsYXllckJsZW5kaW5nOiAnbm9ybWFsJyxcbiAgaG92ZXJJbmZvOiB1bmRlZmluZWQsXG4gIGNsaWNrZWQ6IHVuZGVmaW5lZCxcbiAgbW91c2VQb3M6IHt9LFxuXG4gIC8vIHRoaXMgaXMgdXNlZCB3aGVuIHVzZXIgc3BsaXQgbWFwc1xuICBzcGxpdE1hcHM6IFtcbiAgICAvLyB0aGlzIHdpbGwgY29udGFpbiBhIGxpc3Qgb2Ygb2JqZWN0cyB0b1xuICAgIC8vIGRlc2NyaWJlIHRoZSBzdGF0ZSBvZiBsYXllciBhdmFpbGFiaWxpdHkgYW5kIHZpc2liaWxpdHkgZm9yIGVhY2ggbWFwXG4gICAgLy8gW1xuICAgIC8vICAge1xuICAgIC8vICAgICAgbGF5ZXJzOiB7bGF5ZXJfaWQ6IHRydWUgfCBmYWxzZX1cbiAgICAvLyAgIH1cbiAgICAvLyBdXG4gIF0sXG4gIHNwbGl0TWFwc1RvQmVNZXJnZWQ6IFtdLFxuXG4gIC8vIGRlZmF1bHRzIGxheWVyIGNsYXNzZXNcbiAgbGF5ZXJDbGFzc2VzOiBMYXllckNsYXNzZXMsXG5cbiAgLy8gZGVmYXVsdCBhbmltYXRpb25cbiAgLy8gdGltZSBpbiB1bml4IHRpbWVzdGFtcCAobWlsbGlzZWNvbmRzKSAodGhlIG51bWJlciBvZiBzZWNvbmRzIHNpbmNlIHRoZSBVbml4IEVwb2NoKVxuICBhbmltYXRpb25Db25maWc6IERFRkFVTFRfQU5JTUFUSU9OX0NPTkZJRyxcblxuICBlZGl0b3I6IERFRkFVTFRfRURJVE9SLFxuXG4gIGZpbGVMb2FkaW5nOiBmYWxzZSxcbiAgZmlsZUxvYWRpbmdQcm9ncmVzczoge30sXG5cbiAgbG9hZGVyczogW10sXG4gIGxvYWRPcHRpb25zOiB7fSxcblxuICAvLyB2aXNTdGF0ZU1lcmdlcnNcbiAgbWVyZ2VyczogVklTX1NUQVRFX01FUkdFUlMsXG5cbiAgLy8ga2VwbGVyIHNjaGVtYXNcbiAgc2NoZW1hOiBLZXBsZXJHTFNjaGVtYVxufTtcblxuLyoqXG4gKiBVcGRhdGUgc3RhdGUgd2l0aCB1cGRhdGVkIGxheWVyIGFuZCBsYXllckRhdGFcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLnVwZGF0ZVN0YXRlV2l0aExheWVyQW5kRGF0YX1cbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVTdGF0ZVdpdGhMYXllckFuZERhdGEoc3RhdGUsIHtsYXllckRhdGEsIGxheWVyLCBpZHh9KSB7XG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgbGF5ZXJzOiBzdGF0ZS5sYXllcnMubWFwKChseXIsIGkpID0+IChpID09PSBpZHggPyBsYXllciA6IGx5cikpLFxuICAgIGxheWVyRGF0YTogbGF5ZXJEYXRhXG4gICAgICA/IHN0YXRlLmxheWVyRGF0YS5tYXAoKGQsIGkpID0+IChpID09PSBpZHggPyBsYXllckRhdGEgOiBkKSlcbiAgICAgIDogc3RhdGUubGF5ZXJEYXRhXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVTdGF0ZU9uTGF5ZXJWaXNpYmlsaXR5Q2hhbmdlKHN0YXRlLCBsYXllcikge1xuICBsZXQgbmV3U3RhdGUgPSBzdGF0ZTtcbiAgaWYgKHN0YXRlLnNwbGl0TWFwcy5sZW5ndGgpIHtcbiAgICBuZXdTdGF0ZSA9IHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgc3BsaXRNYXBzOiBsYXllci5jb25maWcuaXNWaXNpYmxlXG4gICAgICAgID8gYWRkTmV3TGF5ZXJzVG9TcGxpdE1hcChzdGF0ZS5zcGxpdE1hcHMsIGxheWVyKVxuICAgICAgICA6IHJlbW92ZUxheWVyRnJvbVNwbGl0TWFwcyhzdGF0ZS5zcGxpdE1hcHMsIGxheWVyKVxuICAgIH07XG4gIH1cblxuICBpZiAobGF5ZXIuY29uZmlnLmFuaW1hdGlvbi5lbmFibGVkKSB7XG4gICAgbmV3U3RhdGUgPSB1cGRhdGVBbmltYXRpb25Eb21haW4oc3RhdGUpO1xuICB9XG5cbiAgcmV0dXJuIG5ld1N0YXRlO1xufVxuXG4vKipcbiAqIFVwZGF0ZSBsYXllciBiYXNlIGNvbmZpZzogZGF0YUlkLCBsYWJlbCwgY29sdW1uLCBpc1Zpc2libGVcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5sYXllckNvbmZpZ0NoYW5nZVVwZGF0ZXJ9XG4gKiBAcmV0dXJucyBuZXh0U3RhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxheWVyQ29uZmlnQ2hhbmdlVXBkYXRlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIGNvbnN0IHtvbGRMYXllcn0gPSBhY3Rpb247XG4gIGNvbnN0IGlkeCA9IHN0YXRlLmxheWVycy5maW5kSW5kZXgobCA9PiBsLmlkID09PSBvbGRMYXllci5pZCk7XG4gIGNvbnN0IHByb3BzID0gT2JqZWN0LmtleXMoYWN0aW9uLm5ld0NvbmZpZyk7XG4gIGlmICh0eXBlb2YgYWN0aW9uLm5ld0NvbmZpZy5kYXRhSWQgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uc3Qge2RhdGFJZCwgLi4ucmVzdENvbmZpZ30gPSBhY3Rpb24ubmV3Q29uZmlnO1xuICAgIGNvbnN0IHN0YXRlV2l0aERhdGFJZCA9IGxheWVyRGF0YUlkQ2hhbmdlVXBkYXRlcihzdGF0ZSwge1xuICAgICAgb2xkTGF5ZXIsXG4gICAgICBuZXdDb25maWc6IHtkYXRhSWR9XG4gICAgfSk7XG4gICAgY29uc3QgbmV4dExheWVyID0gc3RhdGVXaXRoRGF0YUlkLmxheWVycy5maW5kKGwgPT4gbC5pZCA9PT0gb2xkTGF5ZXIuaWQpO1xuICAgIHJldHVybiBuZXh0TGF5ZXIgJiYgT2JqZWN0LmtleXMocmVzdENvbmZpZykubGVuZ3RoXG4gICAgICA/IGxheWVyQ29uZmlnQ2hhbmdlVXBkYXRlcihzdGF0ZVdpdGhEYXRhSWQsIHtvbGRMYXllcjogbmV4dExheWVyLCBuZXdDb25maWc6IHJlc3RDb25maWd9KVxuICAgICAgOiBzdGF0ZVdpdGhEYXRhSWQ7XG4gIH1cblxuICBsZXQgbmV3TGF5ZXIgPSBvbGRMYXllci51cGRhdGVMYXllckNvbmZpZyhhY3Rpb24ubmV3Q29uZmlnKTtcblxuICBsZXQgbGF5ZXJEYXRhO1xuXG4gIC8vIGxldCBuZXdMYXllcjtcbiAgaWYgKG5ld0xheWVyLnNob3VsZENhbGN1bGF0ZUxheWVyRGF0YShwcm9wcykpIHtcbiAgICBjb25zdCBvbGRMYXllckRhdGEgPSBzdGF0ZS5sYXllckRhdGFbaWR4XTtcbiAgICBjb25zdCB1cGRhdGVMYXllckRhdGFSZXN1bHQgPSBjYWxjdWxhdGVMYXllckRhdGEobmV3TGF5ZXIsIHN0YXRlLCBvbGRMYXllckRhdGEpO1xuXG4gICAgbGF5ZXJEYXRhID0gdXBkYXRlTGF5ZXJEYXRhUmVzdWx0LmxheWVyRGF0YTtcbiAgICBuZXdMYXllciA9IHVwZGF0ZUxheWVyRGF0YVJlc3VsdC5sYXllcjtcbiAgfVxuXG4gIGxldCBuZXdTdGF0ZSA9IHN0YXRlO1xuICBpZiAoJ2lzVmlzaWJsZScgaW4gYWN0aW9uLm5ld0NvbmZpZykge1xuICAgIG5ld1N0YXRlID0gdXBkYXRlU3RhdGVPbkxheWVyVmlzaWJpbGl0eUNoYW5nZShzdGF0ZSwgbmV3TGF5ZXIpO1xuICB9XG5cbiAgcmV0dXJuIHVwZGF0ZVN0YXRlV2l0aExheWVyQW5kRGF0YShuZXdTdGF0ZSwge1xuICAgIGxheWVyOiBuZXdMYXllcixcbiAgICBsYXllckRhdGEsXG4gICAgaWR4XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRPclJlbW92ZVRleHRMYWJlbHMobmV3RmllbGRzLCB0ZXh0TGFiZWwpIHtcbiAgbGV0IG5ld1RleHRMYWJlbCA9IHRleHRMYWJlbC5zbGljZSgpO1xuXG4gIGNvbnN0IGN1cnJlbnRGaWVsZHMgPSB0ZXh0TGFiZWwubWFwKHRsID0+IHRsLmZpZWxkICYmIHRsLmZpZWxkLm5hbWUpLmZpbHRlcihkID0+IGQpO1xuXG4gIGNvbnN0IGFkZEZpZWxkcyA9IG5ld0ZpZWxkcy5maWx0ZXIoZiA9PiAhY3VycmVudEZpZWxkcy5pbmNsdWRlcyhmLm5hbWUpKTtcbiAgY29uc3QgZGVsZXRlRmllbGRzID0gY3VycmVudEZpZWxkcy5maWx0ZXIoZiA9PiAhbmV3RmllbGRzLmZpbmQoZmQgPT4gZmQubmFtZSA9PT0gZikpO1xuXG4gIC8vIGRlbGV0ZVxuICBuZXdUZXh0TGFiZWwgPSBuZXdUZXh0TGFiZWwuZmlsdGVyKHRsID0+IHRsLmZpZWxkICYmICFkZWxldGVGaWVsZHMuaW5jbHVkZXModGwuZmllbGQubmFtZSkpO1xuICBuZXdUZXh0TGFiZWwgPSAhbmV3VGV4dExhYmVsLmxlbmd0aCA/IFtERUZBVUxUX1RFWFRfTEFCRUxdIDogbmV3VGV4dExhYmVsO1xuXG4gIC8vIGFkZFxuICBuZXdUZXh0TGFiZWwgPSBbXG4gICAgLi4ubmV3VGV4dExhYmVsLmZpbHRlcih0bCA9PiB0bC5maWVsZCksXG4gICAgLi4uYWRkRmllbGRzLm1hcChhZiA9PiAoe1xuICAgICAgLi4uREVGQVVMVF9URVhUX0xBQkVMLFxuICAgICAgZmllbGQ6IGFmXG4gICAgfSkpXG4gIF07XG5cbiAgcmV0dXJuIG5ld1RleHRMYWJlbDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVGV4dExhYmVsUHJvcEFuZFZhbHVlKGlkeCwgcHJvcCwgdmFsdWUsIHRleHRMYWJlbCkge1xuICBpZiAoIXRleHRMYWJlbFtpZHhdLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgcmV0dXJuIHRleHRMYWJlbDtcbiAgfVxuXG4gIGxldCBuZXdUZXh0TGFiZWwgPSB0ZXh0TGFiZWwuc2xpY2UoKTtcblxuICBpZiAocHJvcCAmJiAodmFsdWUgfHwgdGV4dExhYmVsLmxlbmd0aCA9PT0gMSkpIHtcbiAgICBuZXdUZXh0TGFiZWwgPSB0ZXh0TGFiZWwubWFwKCh0bCwgaSkgPT4gKGkgPT09IGlkeCA/IHsuLi50bCwgW3Byb3BdOiB2YWx1ZX0gOiB0bCkpO1xuICB9IGVsc2UgaWYgKHByb3AgPT09ICdmaWVsZCcgJiYgdmFsdWUgPT09IG51bGwgJiYgdGV4dExhYmVsLmxlbmd0aCA+IDEpIHtcbiAgICAvLyByZW1vdmUgbGFiZWwgd2hlbiBmaWVsZCB2YWx1ZSBpcyBzZXQgdG8gbnVsbFxuICAgIG5ld1RleHRMYWJlbC5zcGxpY2UoaWR4LCAxKTtcbiAgfVxuXG4gIHJldHVybiBuZXdUZXh0TGFiZWw7XG59XG5cbi8qKlxuICogVXBkYXRlIGxheWVyIGJhc2UgY29uZmlnOiBkYXRhSWQsIGxhYmVsLCBjb2x1bW4sIGlzVmlzaWJsZVxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLmxheWVyVGV4dExhYmVsQ2hhbmdlVXBkYXRlcn1cbiAqIEByZXR1cm5zIG5leHRTdGF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gbGF5ZXJUZXh0TGFiZWxDaGFuZ2VVcGRhdGVyKHN0YXRlLCBhY3Rpb24pIHtcbiAgY29uc3Qge29sZExheWVyLCBpZHgsIHByb3AsIHZhbHVlfSA9IGFjdGlvbjtcbiAgY29uc3Qge3RleHRMYWJlbH0gPSBvbGRMYXllci5jb25maWc7XG5cbiAgbGV0IG5ld1RleHRMYWJlbCA9IHRleHRMYWJlbC5zbGljZSgpO1xuICBpZiAoIXRleHRMYWJlbFtpZHhdICYmIGlkeCA9PT0gdGV4dExhYmVsLmxlbmd0aCkge1xuICAgIC8vIGlmIGlkeCBpcyBzZXQgdG8gbGVuZ3RoLCBhZGQgZW1wdHkgdGV4dCBsYWJlbFxuICAgIG5ld1RleHRMYWJlbCA9IFsuLi50ZXh0TGFiZWwsIERFRkFVTFRfVEVYVF9MQUJFTF07XG4gIH1cblxuICBpZiAoaWR4ID09PSAnYWxsJyAmJiBwcm9wID09PSAnZmllbGRzJykge1xuICAgIG5ld1RleHRMYWJlbCA9IGFkZE9yUmVtb3ZlVGV4dExhYmVscyh2YWx1ZSwgdGV4dExhYmVsKTtcbiAgfSBlbHNlIHtcbiAgICBuZXdUZXh0TGFiZWwgPSB1cGRhdGVUZXh0TGFiZWxQcm9wQW5kVmFsdWUoaWR4LCBwcm9wLCB2YWx1ZSwgbmV3VGV4dExhYmVsKTtcbiAgfVxuICAvLyB1cGRhdGUgdGV4dCBsYWJlbCBwcm9wIGFuZCB2YWx1ZVxuICByZXR1cm4gbGF5ZXJDb25maWdDaGFuZ2VVcGRhdGVyKHN0YXRlLCB7XG4gICAgb2xkTGF5ZXIsXG4gICAgbmV3Q29uZmlnOiB7dGV4dExhYmVsOiBuZXdUZXh0TGFiZWx9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZUV4aXN0aW5nTGF5ZXJXaXRoRGF0YShkYXRhc2V0LCBsYXllckNsYXNzZXMsIGxheWVyKSB7XG4gIGNvbnN0IGxvYWRlZExheWVyID0gc2VyaWFsaXplTGF5ZXIobGF5ZXIpO1xuICByZXR1cm4gdmFsaWRhdGVMYXllcldpdGhEYXRhKGRhdGFzZXQsIGxvYWRlZExheWVyLCBsYXllckNsYXNzZXMsIHtcbiAgICBhbGxvd0VtcHR5Q29sdW1uOiB0cnVlXG4gIH0pO1xufVxuXG4vKipcbiAqIFVwZGF0ZSBsYXllciBjb25maWcgZGF0YUlkXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykubGF5ZXJEYXRhSWRDaGFuZ2VVcGRhdGVyfVxuICogQHJldHVybnMgbmV4dFN0YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsYXllckRhdGFJZENoYW5nZVVwZGF0ZXIoc3RhdGUsIGFjdGlvbikge1xuICBjb25zdCB7b2xkTGF5ZXIsIG5ld0NvbmZpZ30gPSBhY3Rpb247XG4gIGNvbnN0IHtkYXRhSWR9ID0gbmV3Q29uZmlnO1xuXG4gIGlmICghb2xkTGF5ZXIgfHwgIXN0YXRlLmRhdGFzZXRzW2RhdGFJZF0pIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cbiAgY29uc3QgaWR4ID0gc3RhdGUubGF5ZXJzLmZpbmRJbmRleChsID0+IGwuaWQgPT09IG9sZExheWVyLmlkKTtcblxuICBsZXQgbmV3TGF5ZXIgPSBvbGRMYXllci51cGRhdGVMYXllckNvbmZpZyh7ZGF0YUlkfSk7XG4gIC8vIHRoaXMgbWF5IGhhcHBlbiB3aGVuIGEgbGF5ZXIgaXMgbmV3ICh0eXBlOiBudWxsIGFuZCBubyBjb2x1bW5zKSBidXQgaXQncyBub3QgcmVhZHkgdG8gYmUgc2F2ZWRcbiAgaWYgKG5ld0xheWVyLmlzVmFsaWRUb1NhdmUoKSkge1xuICAgIGNvbnN0IHZhbGlkYXRlZCA9IHZhbGlkYXRlRXhpc3RpbmdMYXllcldpdGhEYXRhKFxuICAgICAgc3RhdGUuZGF0YXNldHNbZGF0YUlkXSxcbiAgICAgIHN0YXRlLmxheWVyQ2xhc3NlcyxcbiAgICAgIG5ld0xheWVyXG4gICAgKTtcbiAgICAvLyBpZiBjYW50IHZhbGlkYXRlIGl0IHdpdGggZGF0YSBjcmVhdGUgYSBuZXcgb25lXG4gICAgaWYgKCF2YWxpZGF0ZWQpIHtcbiAgICAgIG5ld0xheWVyID0gbmV3IHN0YXRlLmxheWVyQ2xhc3Nlc1tvbGRMYXllci50eXBlXSh7ZGF0YUlkLCBpZDogb2xkTGF5ZXIuaWR9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3TGF5ZXIgPSB2YWxpZGF0ZWQ7XG4gICAgfVxuICB9XG5cbiAgbmV3TGF5ZXIgPSBuZXdMYXllci51cGRhdGVMYXllckNvbmZpZyh7XG4gICAgaXNWaXNpYmxlOiBvbGRMYXllci5jb25maWcuaXNWaXNpYmxlLFxuICAgIGlzQ29uZmlnQWN0aXZlOiB0cnVlXG4gIH0pO1xuXG4gIG5ld0xheWVyLnVwZGF0ZUxheWVyRG9tYWluKHN0YXRlLmRhdGFzZXRzKTtcbiAgY29uc3Qge2xheWVyRGF0YSwgbGF5ZXJ9ID0gY2FsY3VsYXRlTGF5ZXJEYXRhKG5ld0xheWVyLCBzdGF0ZSwgdW5kZWZpbmVkKTtcblxuICByZXR1cm4gdXBkYXRlU3RhdGVXaXRoTGF5ZXJBbmREYXRhKHN0YXRlLCB7bGF5ZXJEYXRhLCBsYXllciwgaWR4fSk7XG59XG5cbi8qKlxuICogVXBkYXRlIGxheWVyIHR5cGUuIFByZXZpZXdzIGxheWVyIGNvbmZpZyB3aWxsIGJlIGNvcGllZCBpZiBhcHBsaWNhYmxlLlxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLmxheWVyVHlwZUNoYW5nZVVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsYXllclR5cGVDaGFuZ2VVcGRhdGVyKHN0YXRlLCBhY3Rpb24pIHtcbiAgY29uc3Qge29sZExheWVyLCBuZXdUeXBlfSA9IGFjdGlvbjtcbiAgaWYgKCFvbGRMYXllcikge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuICBjb25zdCBvbGRJZCA9IG9sZExheWVyLmlkO1xuICBjb25zdCBpZHggPSBzdGF0ZS5sYXllcnMuZmluZEluZGV4KGwgPT4gbC5pZCA9PT0gb2xkSWQpO1xuXG4gIGlmICghc3RhdGUubGF5ZXJDbGFzc2VzW25ld1R5cGVdKSB7XG4gICAgQ29uc29sZS5lcnJvcihgJHtuZXdUeXBlfSBpcyBub3QgYSB2YWxpZCBsYXllciB0eXBlYCk7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgLy8gZ2V0IGEgbWludCBsYXllciwgd2l0aCBuZXcgaWQgYW5kIHR5cGVcbiAgLy8gYmVjYXVzZSBkZWNrLmdsIHVzZXMgaWQgdG8gbWF0Y2ggYmV0d2VlbiBuZXcgYW5kIG9sZCBsYXllci5cbiAgLy8gSWYgdHlwZSBoYXMgY2hhbmdlZCBidXQgaWQgaXMgdGhlIHNhbWUsIGl0IHdpbGwgYnJlYWtcbiAgY29uc3QgbmV3TGF5ZXIgPSBuZXcgc3RhdGUubGF5ZXJDbGFzc2VzW25ld1R5cGVdKCk7XG5cbiAgbmV3TGF5ZXIuYXNzaWduQ29uZmlnVG9MYXllcihvbGRMYXllci5jb25maWcsIG9sZExheWVyLnZpc0NvbmZpZ1NldHRpbmdzKTtcblxuICBuZXdMYXllci51cGRhdGVMYXllckRvbWFpbihzdGF0ZS5kYXRhc2V0cyk7XG4gIGNvbnN0IHtsYXllckRhdGEsIGxheWVyfSA9IGNhbGN1bGF0ZUxheWVyRGF0YShuZXdMYXllciwgc3RhdGUpO1xuICBsZXQgbmV3U3RhdGUgPSB1cGRhdGVTdGF0ZVdpdGhMYXllckFuZERhdGEoc3RhdGUsIHtsYXllckRhdGEsIGxheWVyLCBpZHh9KTtcblxuICBpZiAobGF5ZXIuY29uZmlnLmFuaW1hdGlvbi5lbmFibGVkIHx8IG9sZExheWVyLmNvbmZpZy5hbmltYXRpb24uZW5hYmxlZCkge1xuICAgIG5ld1N0YXRlID0gdXBkYXRlQW5pbWF0aW9uRG9tYWluKG5ld1N0YXRlKTtcbiAgfVxuXG4gIC8vIHVwZGF0ZSBzcGxpdE1hcCBsYXllciBpZFxuICBpZiAoc3RhdGUuc3BsaXRNYXBzLmxlbmd0aCkge1xuICAgIG5ld1N0YXRlID0ge1xuICAgICAgLi4ubmV3U3RhdGUsXG4gICAgICBzcGxpdE1hcHM6IG5ld1N0YXRlLnNwbGl0TWFwcy5tYXAoc2V0dGluZ3MgPT4ge1xuICAgICAgICBjb25zdCB7W29sZElkXTogb2xkTGF5ZXJNYXAsIC4uLm90aGVyTGF5ZXJzfSA9IHNldHRpbmdzLmxheWVycztcbiAgICAgICAgcmV0dXJuIG9sZElkIGluIHNldHRpbmdzLmxheWVyc1xuICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAuLi5zZXR0aW5ncyxcbiAgICAgICAgICAgICAgbGF5ZXJzOiB7XG4gICAgICAgICAgICAgICAgLi4ub3RoZXJMYXllcnMsXG4gICAgICAgICAgICAgICAgW2xheWVyLmlkXTogb2xkTGF5ZXJNYXBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIDogc2V0dGluZ3M7XG4gICAgICB9KVxuICAgIH07XG4gIH1cblxuICByZXR1cm4gbmV3U3RhdGU7XG59XG5cbi8qKlxuICogVXBkYXRlIGxheWVyIHZpc3VhbCBjaGFubmVsXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykubGF5ZXJWaXN1YWxDaGFubmVsQ2hhbmdlVXBkYXRlcn1cbiAqIEByZXR1cm5zIHtPYmplY3R9IG5leHRTdGF0ZVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gbGF5ZXJWaXN1YWxDaGFubmVsQ2hhbmdlVXBkYXRlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIGNvbnN0IHtvbGRMYXllciwgbmV3Q29uZmlnLCBjaGFubmVsfSA9IGFjdGlvbjtcbiAgaWYgKCFvbGRMYXllci5jb25maWcuZGF0YUlkKSB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG4gIGNvbnN0IGRhdGFzZXQgPSBzdGF0ZS5kYXRhc2V0c1tvbGRMYXllci5jb25maWcuZGF0YUlkXTtcblxuICBjb25zdCBpZHggPSBzdGF0ZS5sYXllcnMuZmluZEluZGV4KGwgPT4gbC5pZCA9PT0gb2xkTGF5ZXIuaWQpO1xuICBjb25zdCBuZXdMYXllciA9IG9sZExheWVyLnVwZGF0ZUxheWVyQ29uZmlnKG5ld0NvbmZpZyk7XG5cbiAgbmV3TGF5ZXIudXBkYXRlTGF5ZXJWaXN1YWxDaGFubmVsKGRhdGFzZXQsIGNoYW5uZWwpO1xuXG4gIGNvbnN0IG9sZExheWVyRGF0YSA9IHN0YXRlLmxheWVyRGF0YVtpZHhdO1xuICBjb25zdCB7bGF5ZXJEYXRhLCBsYXllcn0gPSBjYWxjdWxhdGVMYXllckRhdGEobmV3TGF5ZXIsIHN0YXRlLCBvbGRMYXllckRhdGEpO1xuXG4gIHJldHVybiB1cGRhdGVTdGF0ZVdpdGhMYXllckFuZERhdGEoc3RhdGUsIHtsYXllckRhdGEsIGxheWVyLCBpZHh9KTtcbn1cblxuLyoqXG4gKiBVcGRhdGUgbGF5ZXIgYHZpc0NvbmZpZ2BcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5sYXllclZpc0NvbmZpZ0NoYW5nZVVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsYXllclZpc0NvbmZpZ0NoYW5nZVVwZGF0ZXIoc3RhdGUsIGFjdGlvbikge1xuICBjb25zdCB7b2xkTGF5ZXJ9ID0gYWN0aW9uO1xuICBjb25zdCBpZHggPSBzdGF0ZS5sYXllcnMuZmluZEluZGV4KGwgPT4gbC5pZCA9PT0gb2xkTGF5ZXIuaWQpO1xuICBjb25zdCBwcm9wcyA9IE9iamVjdC5rZXlzKGFjdGlvbi5uZXdWaXNDb25maWcpO1xuICBjb25zdCBuZXdWaXNDb25maWcgPSB7XG4gICAgLi4ub2xkTGF5ZXIuY29uZmlnLnZpc0NvbmZpZyxcbiAgICAuLi5hY3Rpb24ubmV3VmlzQ29uZmlnXG4gIH07XG5cbiAgY29uc3QgbmV3TGF5ZXIgPSBvbGRMYXllci51cGRhdGVMYXllckNvbmZpZyh7dmlzQ29uZmlnOiBuZXdWaXNDb25maWd9KTtcblxuICBpZiAobmV3TGF5ZXIuc2hvdWxkQ2FsY3VsYXRlTGF5ZXJEYXRhKHByb3BzKSkge1xuICAgIGNvbnN0IG9sZExheWVyRGF0YSA9IHN0YXRlLmxheWVyRGF0YVtpZHhdO1xuICAgIGNvbnN0IHtsYXllckRhdGEsIGxheWVyfSA9IGNhbGN1bGF0ZUxheWVyRGF0YShuZXdMYXllciwgc3RhdGUsIG9sZExheWVyRGF0YSk7XG4gICAgcmV0dXJuIHVwZGF0ZVN0YXRlV2l0aExheWVyQW5kRGF0YShzdGF0ZSwge2xheWVyRGF0YSwgbGF5ZXIsIGlkeH0pO1xuICB9XG5cbiAgcmV0dXJuIHVwZGF0ZVN0YXRlV2l0aExheWVyQW5kRGF0YShzdGF0ZSwge2xheWVyOiBuZXdMYXllciwgaWR4fSk7XG59XG5cbi8qKlxuICogVXBkYXRlIGZpbHRlciBwcm9wZXJ0eVxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLnNldEZpbHRlckFuaW1hdGlvblRpbWVVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0RmlsdGVyQW5pbWF0aW9uVGltZVVwZGF0ZXIoc3RhdGUsIGFjdGlvbikge1xuICByZXR1cm4gc2V0RmlsdGVyVXBkYXRlcihzdGF0ZSwgYWN0aW9uKTtcbn1cblxuLyoqXG4gKiBVcGRhdGUgZmlsdGVyIGFuaW1hdGlvbiB3aW5kb3dcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5zZXRGaWx0ZXJBbmltYXRpb25XaW5kb3dVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0RmlsdGVyQW5pbWF0aW9uV2luZG93VXBkYXRlcihzdGF0ZSwge2lkLCBhbmltYXRpb25XaW5kb3d9KSB7XG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgZmlsdGVyczogc3RhdGUuZmlsdGVycy5tYXAoZiA9PlxuICAgICAgZi5pZCA9PT0gaWRcbiAgICAgICAgPyB7XG4gICAgICAgICAgICAuLi5mLFxuICAgICAgICAgICAgYW5pbWF0aW9uV2luZG93XG4gICAgICAgICAgfVxuICAgICAgICA6IGZcbiAgICApXG4gIH07XG59XG4vKipcbiAqIFVwZGF0ZSBmaWx0ZXIgcHJvcGVydHlcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5zZXRGaWx0ZXJVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0RmlsdGVyVXBkYXRlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIGNvbnN0IHtpZHgsIHByb3AsIHZhbHVlLCB2YWx1ZUluZGV4ID0gMH0gPSBhY3Rpb247XG4gIGNvbnN0IG9sZEZpbHRlciA9IHN0YXRlLmZpbHRlcnNbaWR4XTtcblxuICBpZiAoIW9sZEZpbHRlcikge1xuICAgIENvbnNvbGUuZXJyb3IoYGZpbHRlcnMuJHtpZHh9IGlzIHVuZGVmaW5lZGApO1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuICBsZXQgbmV3RmlsdGVyID0gc2V0KFtwcm9wXSwgdmFsdWUsIG9sZEZpbHRlcik7XG4gIGxldCBuZXdTdGF0ZSA9IHN0YXRlO1xuXG4gIGNvbnN0IHtkYXRhSWR9ID0gbmV3RmlsdGVyO1xuXG4gIC8vIEVuc3VyaW5nIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAgbGV0IGRhdGFzZXRJZHMgPSB0b0FycmF5KGRhdGFJZCk7XG5cbiAgc3dpdGNoIChwcm9wKSB7XG4gICAgLy8gVE9ETzogTmV4dCBQUiBmb3IgVUkgaWYgd2UgdXBkYXRlIGRhdGFJZCwgd2UgbmVlZCB0byBjb25zaWRlciB0d28gY2FzZXM6XG4gICAgLy8gMS4gZGF0YUlkIGlzIGVtcHR5OiBjcmVhdGUgYSBkZWZhdWx0IGZpbHRlclxuICAgIC8vIDIuIEFkZCBhIG5ldyBkYXRhc2V0IGlkXG4gICAgY2FzZSBGSUxURVJfVVBEQVRFUl9QUk9QUy5kYXRhSWQ6XG4gICAgICAvLyBpZiB0cnlpbmcgdG8gdXBkYXRlIGZpbHRlciBkYXRhSWQuIGNyZWF0ZSBhbiBlbXB0eSBuZXcgZmlsdGVyXG4gICAgICBuZXdGaWx0ZXIgPSB1cGRhdGVGaWx0ZXJEYXRhSWQoZGF0YUlkKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBGSUxURVJfVVBEQVRFUl9QUk9QUy5uYW1lOlxuICAgICAgLy8gd2UgYXJlIHN1cHBvcnRpbmcgdGhlIGN1cnJlbnQgZnVuY3Rpb25hbGl0eVxuICAgICAgLy8gVE9ETzogTmV4dCBQUiBmb3IgVUkgZmlsdGVyIG5hbWUgd2lsbCBvbmx5IHVwZGF0ZSBmaWx0ZXIgbmFtZSBidXQgaXQgd29uJ3QgaGF2ZSBzaWRlIGVmZmVjdHNcbiAgICAgIC8vIHdlIGFyZSBnb25uYSB1c2UgcGFpciBvZiBkYXRhc2V0cyBhbmQgZmllbGRJZHggdG8gdXBkYXRlIHRoZSBmaWx0ZXJcbiAgICAgIGNvbnN0IGRhdGFzZXRJZCA9IG5ld0ZpbHRlci5kYXRhSWRbdmFsdWVJbmRleF07XG4gICAgICBjb25zdCB7ZmlsdGVyOiB1cGRhdGVkRmlsdGVyLCBkYXRhc2V0OiBuZXdEYXRhc2V0fSA9IGFwcGx5RmlsdGVyRmllbGROYW1lKFxuICAgICAgICBuZXdGaWx0ZXIsXG4gICAgICAgIHN0YXRlLmRhdGFzZXRzW2RhdGFzZXRJZF0sXG4gICAgICAgIHZhbHVlLFxuICAgICAgICB2YWx1ZUluZGV4LFxuICAgICAgICB7bWVyZ2VEb21haW46IGZhbHNlfVxuICAgICAgKTtcbiAgICAgIGlmICghdXBkYXRlZEZpbHRlcikge1xuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICB9XG5cbiAgICAgIG5ld0ZpbHRlciA9IHVwZGF0ZWRGaWx0ZXI7XG5cbiAgICAgIGlmIChuZXdGaWx0ZXIuZ3B1KSB7XG4gICAgICAgIG5ld0ZpbHRlciA9IHNldEZpbHRlckdwdU1vZGUobmV3RmlsdGVyLCBzdGF0ZS5maWx0ZXJzKTtcbiAgICAgICAgbmV3RmlsdGVyID0gYXNzaWduR3B1Q2hhbm5lbChuZXdGaWx0ZXIsIHN0YXRlLmZpbHRlcnMpO1xuICAgICAgfVxuXG4gICAgICBuZXdTdGF0ZSA9IHNldChbJ2RhdGFzZXRzJywgZGF0YXNldElkXSwgbmV3RGF0YXNldCwgc3RhdGUpO1xuXG4gICAgICAvLyBvbmx5IGZpbHRlciB0aGUgY3VycmVudCBkYXRhc2V0XG4gICAgICBicmVhaztcbiAgICBjYXNlIEZJTFRFUl9VUERBVEVSX1BST1BTLmxheWVySWQ6XG4gICAgICAvLyBXZSBuZWVkIHRvIHVwZGF0ZSBvbmx5IGRhdGFzZXRJZC9zIGlmIHdlIGhhdmUgYWRkZWQvcmVtb3ZlZCBsYXllcnNcbiAgICAgIC8vIC0gY2hlY2sgZm9yIGxheWVySWQgY2hhbmdlcyAoWE9SIHdvcmtzIGJlY2F1c2Ugb2Ygc3RyaW5nIHZhbHVlcylcbiAgICAgIC8vIGlmIG5vIGRpZmZlcmVuY2VzIGJldHdlZW4gbGF5ZXJJZHMsIGRvbid0IGRvIGFueSBmaWx0ZXJpbmdcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGNvbnN0IGxheWVySWREaWZmZXJlbmNlID0geG9yKG5ld0ZpbHRlci5sYXllcklkLCBvbGRGaWx0ZXIubGF5ZXJJZCk7XG5cbiAgICAgIGNvbnN0IGxheWVyRGF0YUlkcyA9IHVuaXEoXG4gICAgICAgIGxheWVySWREaWZmZXJlbmNlXG4gICAgICAgICAgLm1hcChsaWQgPT5cbiAgICAgICAgICAgIGdldChcbiAgICAgICAgICAgICAgc3RhdGUubGF5ZXJzLmZpbmQobCA9PiBsLmlkID09PSBsaWQpLFxuICAgICAgICAgICAgICBbJ2NvbmZpZycsICdkYXRhSWQnXVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgICAuZmlsdGVyKGQgPT4gZClcbiAgICAgICk7XG5cbiAgICAgIC8vIG9ubHkgZmlsdGVyIGRhdGFzZXRzSWRzXG4gICAgICBkYXRhc2V0SWRzID0gbGF5ZXJEYXRhSWRzO1xuXG4gICAgICAvLyBVcGRhdGUgbmV3RmlsdGVyIGRhdGFJZHNcbiAgICAgIGNvbnN0IG5ld0RhdGFJZHMgPSB1bmlxKFxuICAgICAgICBuZXdGaWx0ZXIubGF5ZXJJZFxuICAgICAgICAgIC5tYXAobGlkID0+XG4gICAgICAgICAgICBnZXQoXG4gICAgICAgICAgICAgIHN0YXRlLmxheWVycy5maW5kKGwgPT4gbC5pZCA9PT0gbGlkKSxcbiAgICAgICAgICAgICAgWydjb25maWcnLCAnZGF0YUlkJ11cbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgICAgLmZpbHRlcihkID0+IGQpXG4gICAgICApO1xuXG4gICAgICBuZXdGaWx0ZXIgPSB7XG4gICAgICAgIC4uLm5ld0ZpbHRlcixcbiAgICAgICAgZGF0YUlkOiBuZXdEYXRhSWRzXG4gICAgICB9O1xuXG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgYnJlYWs7XG4gIH1cblxuICBjb25zdCBlbmxhcmdlZEZpbHRlciA9IHN0YXRlLmZpbHRlcnMuZmluZChmID0+IGYuZW5sYXJnZWQpO1xuXG4gIGlmIChlbmxhcmdlZEZpbHRlciAmJiBlbmxhcmdlZEZpbHRlci5pZCAhPT0gbmV3RmlsdGVyLmlkKSB7XG4gICAgLy8gdGhlcmUgc2hvdWxkIGJlIG9ubHkgb25lIGVubGFyZ2VkIGZpbHRlclxuICAgIG5ld0ZpbHRlci5lbmxhcmdlZCA9IGZhbHNlO1xuICB9XG5cbiAgLy8gc2F2ZSBuZXcgZmlsdGVycyB0byBuZXdTdGF0ZVxuICBuZXdTdGF0ZSA9IHNldChbJ2ZpbHRlcnMnLCBpZHhdLCBuZXdGaWx0ZXIsIG5ld1N0YXRlKTtcblxuICAvLyBpZiB3ZSBhcmUgY3VycmVudGx5IHNldHRpbmcgYSBwcm9wIHRoYXQgb25seSByZXF1aXJlcyB0byBmaWx0ZXIgdGhlIGN1cnJlbnRcbiAgLy8gZGF0YXNldCB3ZSB3aWxsIHBhc3Mgb25seSB0aGUgY3VycmVudCBkYXRhc2V0IHRvIGFwcGx5RmlsdGVyc1RvRGF0YXNldHMgYW5kXG4gIC8vIHVwZGF0ZUFsbExheWVyRG9tYWluRGF0YSBvdGhlcndpc2Ugd2UgcGFzcyB0aGUgYWxsIGxpc3Qgb2YgZGF0YXNldHMgYXMgZGVmaW5lZCBpbiBkYXRhSWRcbiAgY29uc3QgZGF0YXNldElkc1RvRmlsdGVyID0gTElNSVRFRF9GSUxURVJfRUZGRUNUX1BST1BTW3Byb3BdXG4gICAgPyBbZGF0YXNldElkc1t2YWx1ZUluZGV4XV1cbiAgICA6IGRhdGFzZXRJZHM7XG5cbiAgLy8gZmlsdGVyIGRhdGFcbiAgY29uc3QgZmlsdGVyZWREYXRhc2V0cyA9IGFwcGx5RmlsdGVyc1RvRGF0YXNldHMoXG4gICAgZGF0YXNldElkc1RvRmlsdGVyLFxuICAgIG5ld1N0YXRlLmRhdGFzZXRzLFxuICAgIG5ld1N0YXRlLmZpbHRlcnMsXG4gICAgbmV3U3RhdGUubGF5ZXJzXG4gICk7XG5cbiAgbmV3U3RhdGUgPSBzZXQoWydkYXRhc2V0cyddLCBmaWx0ZXJlZERhdGFzZXRzLCBuZXdTdGF0ZSk7XG4gIC8vIGRhdGFJZCBpcyBhbiBhcnJheVxuICAvLyBwYXNzIG9ubHkgdGhlIGRhdGFzZXQgd2UgbmVlZCB0byB1cGRhdGVcbiAgbmV3U3RhdGUgPSB1cGRhdGVBbGxMYXllckRvbWFpbkRhdGEobmV3U3RhdGUsIGRhdGFzZXRJZHNUb0ZpbHRlciwgbmV3RmlsdGVyKTtcblxuICByZXR1cm4gbmV3U3RhdGU7XG59XG5cbi8qKlxuICogU2V0IHRoZSBwcm9wZXJ0eSBvZiBhIGZpbHRlciBwbG90XG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykuc2V0RmlsdGVyUGxvdFVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBzZXRGaWx0ZXJQbG90VXBkYXRlciA9IChzdGF0ZSwge2lkeCwgbmV3UHJvcCwgdmFsdWVJbmRleCA9IDB9KSA9PiB7XG4gIGxldCBuZXdGaWx0ZXIgPSB7Li4uc3RhdGUuZmlsdGVyc1tpZHhdLCAuLi5uZXdQcm9wfTtcbiAgY29uc3QgcHJvcCA9IE9iamVjdC5rZXlzKG5ld1Byb3ApWzBdO1xuICBpZiAocHJvcCA9PT0gJ3lBeGlzJykge1xuICAgIGNvbnN0IHBsb3RUeXBlID0gZ2V0RGVmYXVsdEZpbHRlclBsb3RUeXBlKG5ld0ZpbHRlcik7XG4gICAgLy8gVE9ETzogcGxvdCBpcyBub3Qgc3VwcG9ydGVkIGluIG11bHRpIGRhdGFzZXQgZmlsdGVyIGZvciBub3dcbiAgICBpZiAocGxvdFR5cGUpIHtcbiAgICAgIG5ld0ZpbHRlciA9IHtcbiAgICAgICAgLi4ubmV3RmlsdGVyLFxuICAgICAgICAuLi5nZXRGaWx0ZXJQbG90KHsuLi5uZXdGaWx0ZXIsIHBsb3RUeXBlfSwgc3RhdGUuZGF0YXNldHNbbmV3RmlsdGVyLmRhdGFJZFt2YWx1ZUluZGV4XV0pLFxuICAgICAgICBwbG90VHlwZVxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGZpbHRlcnM6IHN0YXRlLmZpbHRlcnMubWFwKChmLCBpKSA9PiAoaSA9PT0gaWR4ID8gbmV3RmlsdGVyIDogZikpXG4gIH07XG59O1xuXG4vKipcbiAqIEFkZCBhIG5ldyBmaWx0ZXJcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5hZGRGaWx0ZXJVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgYWRkRmlsdGVyVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PlxuICAhYWN0aW9uLmRhdGFJZFxuICAgID8gc3RhdGVcbiAgICA6IHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGZpbHRlcnM6IFsuLi5zdGF0ZS5maWx0ZXJzLCBnZXREZWZhdWx0RmlsdGVyKGFjdGlvbi5kYXRhSWQpXVxuICAgICAgfTtcblxuLyoqXG4gKiBTZXQgbGF5ZXIgY29sb3IgcGFsZXR0ZSB1aSBzdGF0ZVxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLmxheWVyQ29sb3JVSUNoYW5nZVVwZGF0ZXJ9XG4gKi9cbmV4cG9ydCBjb25zdCBsYXllckNvbG9yVUlDaGFuZ2VVcGRhdGVyID0gKHN0YXRlLCB7b2xkTGF5ZXIsIHByb3AsIG5ld0NvbmZpZ30pID0+IHtcbiAgY29uc3Qgb2xkVml4Q29uZmlnID0gb2xkTGF5ZXIuY29uZmlnLnZpc0NvbmZpZ1twcm9wXTtcbiAgY29uc3QgbmV3TGF5ZXIgPSBvbGRMYXllci51cGRhdGVMYXllckNvbG9yVUkocHJvcCwgbmV3Q29uZmlnKTtcbiAgY29uc3QgbmV3VmlzQ29uZmlnID0gbmV3TGF5ZXIuY29uZmlnLnZpc0NvbmZpZ1twcm9wXTtcbiAgaWYgKG9sZFZpeENvbmZpZyAhPT0gbmV3VmlzQ29uZmlnKSB7XG4gICAgcmV0dXJuIGxheWVyVmlzQ29uZmlnQ2hhbmdlVXBkYXRlcihzdGF0ZSwge1xuICAgICAgb2xkTGF5ZXIsXG4gICAgICBuZXdWaXNDb25maWc6IHtcbiAgICAgICAgW3Byb3BdOiBuZXdWaXNDb25maWdcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGxheWVyczogc3RhdGUubGF5ZXJzLm1hcChsID0+IChsLmlkID09PSBvbGRMYXllci5pZCA/IG5ld0xheWVyIDogbCkpXG4gIH07XG59O1xuXG4vKipcbiAqIFN0YXJ0IGFuZCBlbmQgZmlsdGVyIGFuaW1hdGlvblxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLnRvZ2dsZUZpbHRlckFuaW1hdGlvblVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCB0b2dnbGVGaWx0ZXJBbmltYXRpb25VcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBmaWx0ZXJzOiBzdGF0ZS5maWx0ZXJzLm1hcCgoZiwgaSkgPT4gKGkgPT09IGFjdGlvbi5pZHggPyB7Li4uZiwgaXNBbmltYXRpbmc6ICFmLmlzQW5pbWF0aW5nfSA6IGYpKVxufSk7XG5cbi8qKlxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLnRvZ2dsZUxheWVyQW5pbWF0aW9uVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHRvZ2dsZUxheWVyQW5pbWF0aW9uVXBkYXRlciA9IHN0YXRlID0+ICh7XG4gIC4uLnN0YXRlLFxuICBhbmltYXRpb25Db25maWc6IHtcbiAgICAuLi5zdGF0ZS5hbmltYXRpb25Db25maWcsXG4gICAgaXNBbmltYXRpbmc6ICFzdGF0ZS5hbmltYXRpb25Db25maWcuaXNBbmltYXRpbmdcbiAgfVxufSk7XG5cbi8qKlxuICogSGlkZSBhbmQgc2hvdyBsYXllciBhbmltYXRpb24gY29udHJvbFxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLnRvZ2dsZUxheWVyQW5pbWF0aW9uQ29udHJvbFVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCB0b2dnbGVMYXllckFuaW1hdGlvbkNvbnRyb2xVcGRhdGVyID0gc3RhdGUgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGFuaW1hdGlvbkNvbmZpZzoge1xuICAgIC4uLnN0YXRlLmFuaW1hdGlvbkNvbmZpZyxcbiAgICBoaWRlQ29udHJvbDogIXN0YXRlLmFuaW1hdGlvbkNvbmZpZy5oaWRlQ29udHJvbFxuICB9XG59KTtcblxuLyoqXG4gKiBDaGFuZ2UgZmlsdGVyIGFuaW1hdGlvbiBzcGVlZFxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLnVwZGF0ZUZpbHRlckFuaW1hdGlvblNwZWVkVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHVwZGF0ZUZpbHRlckFuaW1hdGlvblNwZWVkVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgZmlsdGVyczogc3RhdGUuZmlsdGVycy5tYXAoKGYsIGkpID0+IChpID09PSBhY3Rpb24uaWR4ID8gey4uLmYsIHNwZWVkOiBhY3Rpb24uc3BlZWR9IDogZikpXG59KTtcblxuLyoqXG4gKiBSZXNldCBhbmltYXRpb24gY29uZmlnIGN1cnJlbnQgdGltZSB0byBhIHNwZWNpZmllZCB2YWx1ZVxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLnNldExheWVyQW5pbWF0aW9uVGltZVVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKlxuICovXG5leHBvcnQgY29uc3Qgc2V0TGF5ZXJBbmltYXRpb25UaW1lVXBkYXRlciA9IChzdGF0ZSwge3ZhbHVlfSkgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGFuaW1hdGlvbkNvbmZpZzoge1xuICAgIC4uLnN0YXRlLmFuaW1hdGlvbkNvbmZpZyxcbiAgICBjdXJyZW50VGltZTogdmFsdWVcbiAgfVxufSk7XG5cbi8qKlxuICogVXBkYXRlIGFuaW1hdGlvbiBzcGVlZCB3aXRoIHRoZSB2ZXJ0aWNhbCBzcGVlZCBzbGlkZXJcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS51cGRhdGVMYXllckFuaW1hdGlvblNwZWVkVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqXG4gKi9cbmV4cG9ydCBjb25zdCB1cGRhdGVMYXllckFuaW1hdGlvblNwZWVkVXBkYXRlciA9IChzdGF0ZSwge3NwZWVkfSkgPT4ge1xuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGFuaW1hdGlvbkNvbmZpZzoge1xuICAgICAgLi4uc3RhdGUuYW5pbWF0aW9uQ29uZmlnLFxuICAgICAgc3BlZWRcbiAgICB9XG4gIH07XG59O1xuXG4vKipcbiAqIFNob3cgbGFyZ2VyIHRpbWUgZmlsdGVyIGF0IGJvdHRvbSBmb3IgdGltZSBwbGF5YmFjayAoYXBwbHkgdG8gdGltZSBmaWx0ZXIgb25seSlcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5lbmxhcmdlRmlsdGVyVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IGVubGFyZ2VGaWx0ZXJVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBmaWx0ZXJzOiBzdGF0ZS5maWx0ZXJzLm1hcCgoZiwgaSkgPT5cbiAgICAgIGkgPT09IGFjdGlvbi5pZHhcbiAgICAgICAgPyB7XG4gICAgICAgICAgICAuLi5mLFxuICAgICAgICAgICAgZW5sYXJnZWQ6ICFmLmVubGFyZ2VkXG4gICAgICAgICAgfVxuICAgICAgICA6IGZcbiAgICApXG4gIH07XG59O1xuXG4vKipcbiAqIFRvZ2dsZXMgZmlsdGVyIGZlYXR1cmUgdmlzaWJpbGl0eVxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLnRvZ2dsZUZpbHRlckZlYXR1cmVVcGRhdGVyfVxuICovXG5leHBvcnQgY29uc3QgdG9nZ2xlRmlsdGVyRmVhdHVyZVVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCBmaWx0ZXIgPSBzdGF0ZS5maWx0ZXJzW2FjdGlvbi5pZHhdO1xuICBjb25zdCBpc1Zpc2libGUgPSBnZXQoZmlsdGVyLCBbJ3ZhbHVlJywgJ3Byb3BlcnRpZXMnLCAnaXNWaXNpYmxlJ10pO1xuICBjb25zdCBuZXdGaWx0ZXIgPSB7XG4gICAgLi4uZmlsdGVyLFxuICAgIHZhbHVlOiBmZWF0dXJlVG9GaWx0ZXJWYWx1ZShmaWx0ZXIudmFsdWUsIGZpbHRlci5pZCwge1xuICAgICAgaXNWaXNpYmxlOiAhaXNWaXNpYmxlXG4gICAgfSlcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGZpbHRlcnM6IE9iamVjdC5hc3NpZ24oWy4uLnN0YXRlLmZpbHRlcnNdLCB7W2FjdGlvbi5pZHhdOiBuZXdGaWx0ZXJ9KVxuICB9O1xufTtcblxuLyoqXG4gKiBSZW1vdmUgYSBmaWx0ZXJcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5yZW1vdmVGaWx0ZXJVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgcmVtb3ZlRmlsdGVyVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIGNvbnN0IHtpZHh9ID0gYWN0aW9uO1xuICBjb25zdCB7ZGF0YUlkLCBpZH0gPSBzdGF0ZS5maWx0ZXJzW2lkeF07XG5cbiAgY29uc3QgbmV3RmlsdGVycyA9IFtcbiAgICAuLi5zdGF0ZS5maWx0ZXJzLnNsaWNlKDAsIGlkeCksXG4gICAgLi4uc3RhdGUuZmlsdGVycy5zbGljZShpZHggKyAxLCBzdGF0ZS5maWx0ZXJzLmxlbmd0aClcbiAgXTtcblxuICBjb25zdCBmaWx0ZXJlZERhdGFzZXRzID0gYXBwbHlGaWx0ZXJzVG9EYXRhc2V0cyhkYXRhSWQsIHN0YXRlLmRhdGFzZXRzLCBuZXdGaWx0ZXJzLCBzdGF0ZS5sYXllcnMpO1xuICBjb25zdCBuZXdFZGl0b3IgPVxuICAgIGdldEZpbHRlcklkSW5GZWF0dXJlKHN0YXRlLmVkaXRvci5zZWxlY3RlZEZlYXR1cmUpID09PSBpZFxuICAgICAgPyB7XG4gICAgICAgICAgLi4uc3RhdGUuZWRpdG9yLFxuICAgICAgICAgIHNlbGVjdGVkRmVhdHVyZTogbnVsbFxuICAgICAgICB9XG4gICAgICA6IHN0YXRlLmVkaXRvcjtcblxuICBsZXQgbmV3U3RhdGUgPSBzZXQoWydmaWx0ZXJzJ10sIG5ld0ZpbHRlcnMsIHN0YXRlKTtcbiAgbmV3U3RhdGUgPSBzZXQoWydkYXRhc2V0cyddLCBmaWx0ZXJlZERhdGFzZXRzLCBuZXdTdGF0ZSk7XG4gIG5ld1N0YXRlID0gc2V0KFsnZWRpdG9yJ10sIG5ld0VkaXRvciwgbmV3U3RhdGUpO1xuXG4gIHJldHVybiB1cGRhdGVBbGxMYXllckRvbWFpbkRhdGEobmV3U3RhdGUsIGRhdGFJZCwgdW5kZWZpbmVkKTtcbn07XG5cbi8qKlxuICogQWRkIGEgbmV3IGxheWVyXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykuYWRkTGF5ZXJVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgYWRkTGF5ZXJVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgbGV0IG5ld0xheWVyO1xuICBsZXQgbmV3TGF5ZXJEYXRhO1xuICBpZiAoYWN0aW9uLmNvbmZpZykge1xuICAgIG5ld0xheWVyID0gY3JlYXRlTGF5ZXJGcm9tQ29uZmlnKHN0YXRlLCBhY3Rpb24uY29uZmlnKTtcbiAgICBpZiAoIW5ld0xheWVyKSB7XG4gICAgICBDb25zb2xlLndhcm4oXG4gICAgICAgICdGYWlsZWQgdG8gY3JlYXRlIGxheWVyIGZyb20gY29uZmlnLCBpdCB1c3VhbGx5IG1lYW5zIHRoZSBjb25maWcgaXMgbm90IGJlIGluIGNvcnJlY3QgZm9ybWF0JyxcbiAgICAgICAgYWN0aW9uLmNvbmZpZ1xuICAgICAgKTtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBjYWxjdWxhdGVMYXllckRhdGEobmV3TGF5ZXIsIHN0YXRlKTtcbiAgICBuZXdMYXllciA9IHJlc3VsdC5sYXllcjtcbiAgICBuZXdMYXllckRhdGEgPSByZXN1bHQubGF5ZXJEYXRhO1xuICB9IGVsc2Uge1xuICAgIC8vIGNyZWF0ZSBhbiBlbXB0eSBsYXllciB3aXRoIHRoZSBmaXJzdCBhdmFpbGFibGUgZGF0YXNldFxuICAgIGNvbnN0IGRlZmF1bHREYXRhc2V0ID0gT2JqZWN0LmtleXMoc3RhdGUuZGF0YXNldHMpWzBdO1xuICAgIG5ld0xheWVyID0gbmV3IExheWVyKHtcbiAgICAgIGlzVmlzaWJsZTogdHJ1ZSxcbiAgICAgIGlzQ29uZmlnQWN0aXZlOiB0cnVlLFxuICAgICAgZGF0YUlkOiBkZWZhdWx0RGF0YXNldFxuICAgIH0pO1xuICAgIG5ld0xheWVyRGF0YSA9IHt9O1xuICB9XG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgbGF5ZXJzOiBbLi4uc3RhdGUubGF5ZXJzLCBuZXdMYXllcl0sXG4gICAgbGF5ZXJEYXRhOiBbLi4uc3RhdGUubGF5ZXJEYXRhLCBuZXdMYXllckRhdGFdLFxuICAgIGxheWVyT3JkZXI6IFsuLi5zdGF0ZS5sYXllck9yZGVyLCBzdGF0ZS5sYXllck9yZGVyLmxlbmd0aF0sXG4gICAgc3BsaXRNYXBzOiBhZGROZXdMYXllcnNUb1NwbGl0TWFwKHN0YXRlLnNwbGl0TWFwcywgbmV3TGF5ZXIpXG4gIH07XG59O1xuXG4vKipcbiAqIHJlbW92ZSBsYXllclxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLnJlbW92ZUxheWVyVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHJlbW92ZUxheWVyVXBkYXRlciA9IChzdGF0ZSwge2lkeH0pID0+IHtcbiAgY29uc3Qge2xheWVycywgbGF5ZXJEYXRhLCBjbGlja2VkLCBob3ZlckluZm99ID0gc3RhdGU7XG4gIGNvbnN0IGxheWVyVG9SZW1vdmUgPSBzdGF0ZS5sYXllcnNbaWR4XTtcbiAgY29uc3QgbmV3TWFwcyA9IHJlbW92ZUxheWVyRnJvbVNwbGl0TWFwcyhzdGF0ZS5zcGxpdE1hcHMsIGxheWVyVG9SZW1vdmUpO1xuXG4gIGNvbnN0IG5ld1N0YXRlID0ge1xuICAgIC4uLnN0YXRlLFxuICAgIGxheWVyczogWy4uLmxheWVycy5zbGljZSgwLCBpZHgpLCAuLi5sYXllcnMuc2xpY2UoaWR4ICsgMSwgbGF5ZXJzLmxlbmd0aCldLFxuICAgIGxheWVyRGF0YTogWy4uLmxheWVyRGF0YS5zbGljZSgwLCBpZHgpLCAuLi5sYXllckRhdGEuc2xpY2UoaWR4ICsgMSwgbGF5ZXJEYXRhLmxlbmd0aCldLFxuICAgIGxheWVyT3JkZXI6IHN0YXRlLmxheWVyT3JkZXIuZmlsdGVyKGkgPT4gaSAhPT0gaWR4KS5tYXAocGlkID0+IChwaWQgPiBpZHggPyBwaWQgLSAxIDogcGlkKSksXG4gICAgY2xpY2tlZDogbGF5ZXJUb1JlbW92ZS5pc0xheWVySG92ZXJlZChjbGlja2VkKSA/IHVuZGVmaW5lZCA6IGNsaWNrZWQsXG4gICAgaG92ZXJJbmZvOiBsYXllclRvUmVtb3ZlLmlzTGF5ZXJIb3ZlcmVkKGhvdmVySW5mbykgPyB1bmRlZmluZWQgOiBob3ZlckluZm8sXG4gICAgc3BsaXRNYXBzOiBuZXdNYXBzXG4gICAgLy8gVE9ETzogdXBkYXRlIGZpbHRlcnMsIGNyZWF0ZSBoZWxwZXIgdG8gcmVtb3ZlIGxheWVyIGZvcm0gZmlsdGVyIChyZW1vdmUgbGF5ZXJpZCBhbmQgZGF0YWlkKSBpZiBtYXBwZWRcbiAgfTtcblxuICByZXR1cm4gdXBkYXRlQW5pbWF0aW9uRG9tYWluKG5ld1N0YXRlKTtcbn07XG5cbi8qKlxuICogZHVwbGljYXRlIGxheWVyXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykuZHVwbGljYXRlTGF5ZXJVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgZHVwbGljYXRlTGF5ZXJVcGRhdGVyID0gKHN0YXRlLCB7aWR4fSkgPT4ge1xuICBjb25zdCB7bGF5ZXJzfSA9IHN0YXRlO1xuICBjb25zdCBvcmlnaW5hbCA9IHN0YXRlLmxheWVyc1tpZHhdO1xuICBjb25zdCBvcmlnaW5hbExheWVyT3JkZXJJZHggPSBzdGF0ZS5sYXllck9yZGVyLmZpbmRJbmRleChpID0+IGkgPT09IGlkeCk7XG5cbiAgaWYgKCFvcmlnaW5hbCkge1xuICAgIENvbnNvbGUud2FybihgbGF5ZXIuJHtpZHh9IGlzIHVuZGVmaW5lZGApO1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuICBsZXQgbmV3TGFiZWwgPSBgQ29weSBvZiAke29yaWdpbmFsLmNvbmZpZy5sYWJlbH1gO1xuICBsZXQgcG9zdGZpeCA9IDA7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1sb29wLWZ1bmNcbiAgd2hpbGUgKGxheWVycy5maW5kKGwgPT4gbC5jb25maWcubGFiZWwgPT09IG5ld0xhYmVsKSkge1xuICAgIG5ld0xhYmVsID0gYENvcHkgb2YgJHtvcmlnaW5hbC5jb25maWcubGFiZWx9ICR7Kytwb3N0Zml4fWA7XG4gIH1cblxuICAvLyBjb2xsZWN0IGxheWVyIGNvbmZpZyBmcm9tIG9yaWdpbmFsXG4gIGNvbnN0IGxvYWRlZExheWVyID0gc2VyaWFsaXplTGF5ZXIob3JpZ2luYWwpO1xuXG4gIC8vIGFzc2lnbiBuZXcgaWQgYW5kIGxhYmVsIHRvIGNvcGllZCBsYXllclxuICBpZiAoIWxvYWRlZExheWVyLmNvbmZpZykge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuICBsb2FkZWRMYXllci5jb25maWcubGFiZWwgPSBuZXdMYWJlbDtcbiAgbG9hZGVkTGF5ZXIuaWQgPSBnZW5lcmF0ZUhhc2hJZChMQVlFUl9JRF9MRU5HVEgpO1xuXG4gIC8vIGFkZCBsYXllciB0byBzdGF0ZVxuICBsZXQgbmV4dFN0YXRlID0gYWRkTGF5ZXJVcGRhdGVyKHN0YXRlLCB7Y29uZmlnOiBsb2FkZWRMYXllcn0pO1xuXG4gIC8vIG5ldyBhZGRlZCBsYXllciBhcmUgYXQgdGhlIGVuZCwgbW92ZSBpdCB0byBiZSBvbiB0b3Agb2Ygb3JpZ2luYWwgbGF5ZXJcbiAgY29uc3QgbmV3TGF5ZXJPcmRlcklkeCA9IG5leHRTdGF0ZS5sYXllck9yZGVyLmxlbmd0aCAtIDE7XG4gIGNvbnN0IG5ld0xheWVyT3JkZXIgPSBhcnJheUluc2VydChcbiAgICBuZXh0U3RhdGUubGF5ZXJPcmRlci5zbGljZSgwLCBuZXdMYXllck9yZGVySWR4KSxcbiAgICBvcmlnaW5hbExheWVyT3JkZXJJZHgsXG4gICAgbmV3TGF5ZXJPcmRlcklkeFxuICApO1xuXG4gIG5leHRTdGF0ZSA9IHtcbiAgICAuLi5uZXh0U3RhdGUsXG4gICAgbGF5ZXJPcmRlcjogbmV3TGF5ZXJPcmRlclxuICB9O1xuXG4gIHJldHVybiB1cGRhdGVBbmltYXRpb25Eb21haW4obmV4dFN0YXRlKTtcbn07XG5cbi8qKlxuICogUmVvcmRlciBsYXllclxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLnJlb3JkZXJMYXllclVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCByZW9yZGVyTGF5ZXJVcGRhdGVyID0gKHN0YXRlLCB7b3JkZXJ9KSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgbGF5ZXJPcmRlcjogb3JkZXJcbn0pO1xuXG4vKipcbiAqIFJlbW92ZSBhIGRhdGFzZXQgYW5kIGFsbCBsYXllcnMsIGZpbHRlcnMsIHRvb2x0aXAgY29uZmlncyB0aGF0IGJhc2VkIG9uIGl0XG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykucmVtb3ZlRGF0YXNldFVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCByZW1vdmVEYXRhc2V0VXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIC8vIGV4dHJhY3QgZGF0YXNldCBrZXlcbiAgY29uc3Qge2RhdGFJZDogZGF0YXNldEtleX0gPSBhY3Rpb247XG4gIGNvbnN0IHtkYXRhc2V0c30gPSBzdGF0ZTtcblxuICAvLyBjaGVjayBpZiBkYXRhc2V0IGlzIHByZXNlbnRcbiAgaWYgKCFkYXRhc2V0c1tkYXRhc2V0S2V5XSkge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4gIGNvbnN0IHtcbiAgICBsYXllcnMsXG4gICAgZGF0YXNldHM6IHtbZGF0YXNldEtleV06IGRhdGFzZXQsIC4uLm5ld0RhdGFzZXRzfVxuICB9ID0gc3RhdGU7XG4gIC8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cblxuICBjb25zdCBpbmRleGVzID0gbGF5ZXJzLnJlZHVjZSgobGlzdE9mSW5kZXhlcywgbGF5ZXIsIGluZGV4KSA9PiB7XG4gICAgaWYgKGxheWVyLmNvbmZpZy5kYXRhSWQgPT09IGRhdGFzZXRLZXkpIHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGxpc3RPZkluZGV4ZXMucHVzaChpbmRleCk7XG4gICAgfVxuICAgIHJldHVybiBsaXN0T2ZJbmRleGVzO1xuICB9LCBbXSk7XG5cbiAgLy8gcmVtb3ZlIGxheWVycyBhbmQgZGF0YXNldHNcbiAgY29uc3Qge25ld1N0YXRlfSA9IGluZGV4ZXMucmVkdWNlKFxuICAgICh7bmV3U3RhdGU6IGN1cnJlbnRTdGF0ZSwgaW5kZXhDb3VudGVyfSwgaWR4KSA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50SW5kZXggPSBpZHggLSBpbmRleENvdW50ZXI7XG4gICAgICBjdXJyZW50U3RhdGUgPSByZW1vdmVMYXllclVwZGF0ZXIoY3VycmVudFN0YXRlLCB7aWR4OiBjdXJyZW50SW5kZXh9KTtcbiAgICAgIGluZGV4Q291bnRlcisrO1xuICAgICAgcmV0dXJuIHtuZXdTdGF0ZTogY3VycmVudFN0YXRlLCBpbmRleENvdW50ZXJ9O1xuICAgIH0sXG4gICAge25ld1N0YXRlOiB7Li4uc3RhdGUsIGRhdGFzZXRzOiBuZXdEYXRhc2V0c30sIGluZGV4Q291bnRlcjogMH1cbiAgKTtcblxuICAvLyByZW1vdmUgZmlsdGVyc1xuICBjb25zdCBmaWx0ZXJzID0gc3RhdGUuZmlsdGVycy5maWx0ZXIoZmlsdGVyID0+ICFmaWx0ZXIuZGF0YUlkLmluY2x1ZGVzKGRhdGFzZXRLZXkpKTtcblxuICAvLyB1cGRhdGUgaW50ZXJhY3Rpb25Db25maWdcbiAgbGV0IHtpbnRlcmFjdGlvbkNvbmZpZ30gPSBzdGF0ZTtcbiAgY29uc3Qge3Rvb2x0aXB9ID0gaW50ZXJhY3Rpb25Db25maWc7XG4gIGlmICh0b29sdGlwKSB7XG4gICAgY29uc3Qge2NvbmZpZ30gPSB0b29sdGlwO1xuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4gICAgY29uc3Qge1tkYXRhc2V0S2V5XTogZmllbGRzLCAuLi5maWVsZHNUb1Nob3d9ID0gY29uZmlnLmZpZWxkc1RvU2hvdztcbiAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG4gICAgaW50ZXJhY3Rpb25Db25maWcgPSB7XG4gICAgICAuLi5pbnRlcmFjdGlvbkNvbmZpZyxcbiAgICAgIHRvb2x0aXA6IHsuLi50b29sdGlwLCBjb25maWc6IHsuLi5jb25maWcsIGZpZWxkc1RvU2hvd319XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7Li4ubmV3U3RhdGUsIGZpbHRlcnMsIGludGVyYWN0aW9uQ29uZmlnfTtcbn07XG5cbi8qKlxuICogdXBkYXRlIGxheWVyIGJsZW5kaW5nIG1vZGVcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS51cGRhdGVMYXllckJsZW5kaW5nVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHVwZGF0ZUxheWVyQmxlbmRpbmdVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBsYXllckJsZW5kaW5nOiBhY3Rpb24ubW9kZVxufSk7XG5cbi8qKlxuICogRGlzcGxheSBkYXRhc2V0IHRhYmxlIGluIGEgbW9kYWxcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5zaG93RGF0YXNldFRhYmxlVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHNob3dEYXRhc2V0VGFibGVVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBlZGl0aW5nRGF0YXNldDogYWN0aW9uLmRhdGFJZFxuICB9O1xufTtcblxuLyoqXG4gKiByZXNldCB2aXNTdGF0ZSB0byBpbml0aWFsIFN0YXRlXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykucmVzZXRNYXBDb25maWdVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgcmVzZXRNYXBDb25maWdVcGRhdGVyID0gc3RhdGUgPT4gKHtcbiAgLi4uSU5JVElBTF9WSVNfU1RBVEUsXG4gIC4uLnN0YXRlLmluaXRpYWxTdGF0ZSxcbiAgaW5pdGlhbFN0YXRlOiBzdGF0ZS5pbml0aWFsU3RhdGVcbn0pO1xuXG4vKipcbiAqIFByb3BhZ2F0ZSBgdmlzU3RhdGVgIHJlZHVjZXIgd2l0aCBhIG5ldyBjb25maWd1cmF0aW9uLiBDdXJyZW50IGNvbmZpZyB3aWxsIGJlIG92ZXJyaWRlLlxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLnJlY2VpdmVNYXBDb25maWdVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgcmVjZWl2ZU1hcENvbmZpZ1VwZGF0ZXIgPSAoc3RhdGUsIHtwYXlsb2FkOiB7Y29uZmlnID0ge30sIG9wdGlvbnMgPSB7fX19KSA9PiB7XG4gIGlmICghY29uZmlnLnZpc1N0YXRlKSB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgY29uc3Qge2tlZXBFeGlzdGluZ0NvbmZpZ30gPSBvcHRpb25zO1xuXG4gIC8vIHJlc2V0IGNvbmZpZyBpZiBrZWVwRXhpc3RpbmdDb25maWcgaXMgZmFsc3lcbiAgbGV0IG1lcmdlZFN0YXRlID0gIWtlZXBFeGlzdGluZ0NvbmZpZyA/IHJlc2V0TWFwQ29uZmlnVXBkYXRlcihzdGF0ZSkgOiBzdGF0ZTtcbiAgZm9yIChjb25zdCBtZXJnZXIgb2Ygc3RhdGUubWVyZ2Vycykge1xuICAgIGlmIChpc1ZhbGlkTWVyZ2VyKG1lcmdlcikgJiYgY29uZmlnLnZpc1N0YXRlW21lcmdlci5wcm9wXSkge1xuICAgICAgbWVyZ2VkU3RhdGUgPSBtZXJnZXIubWVyZ2UobWVyZ2VkU3RhdGUsIGNvbmZpZy52aXNTdGF0ZVttZXJnZXIucHJvcF0sIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBtZXJnZWRTdGF0ZTtcbn07XG5cbi8qKlxuICogVHJpZ2dlciBsYXllciBob3ZlciBldmVudCB3aXRoIGhvdmVyZWQgb2JqZWN0XG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykubGF5ZXJIb3ZlclVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBsYXllckhvdmVyVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgaG92ZXJJbmZvOiBhY3Rpb24uaW5mb1xufSk7XG5cbi8qIGVzbGludC1lbmFibGUgbWF4LXN0YXRlbWVudHMgKi9cblxuLyoqXG4gKiBVcGRhdGUgYGludGVyYWN0aW9uQ29uZmlnYFxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLmludGVyYWN0aW9uQ29uZmlnQ2hhbmdlVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludGVyYWN0aW9uQ29uZmlnQ2hhbmdlVXBkYXRlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIGNvbnN0IHtjb25maWd9ID0gYWN0aW9uO1xuXG4gIGNvbnN0IGludGVyYWN0aW9uQ29uZmlnID0ge1xuICAgIC4uLnN0YXRlLmludGVyYWN0aW9uQ29uZmlnLFxuICAgIC4uLntbY29uZmlnLmlkXTogY29uZmlnfVxuICB9O1xuXG4gIC8vIERvbid0IGVuYWJsZSB0b29sdGlwIGFuZCBicnVzaCBhdCB0aGUgc2FtZSB0aW1lXG4gIC8vIGJ1dCBjb29yZGluYXRlcyBjYW4gYmUgc2hvd24gYXQgYWxsIHRpbWVcbiAgY29uc3QgY29udHJhZGljdCA9IFsnYnJ1c2gnLCAndG9vbHRpcCddO1xuXG4gIGlmIChcbiAgICBjb250cmFkaWN0LmluY2x1ZGVzKGNvbmZpZy5pZCkgJiZcbiAgICBjb25maWcuZW5hYmxlZCAmJlxuICAgICFzdGF0ZS5pbnRlcmFjdGlvbkNvbmZpZ1tjb25maWcuaWRdLmVuYWJsZWRcbiAgKSB7XG4gICAgLy8gb25seSBlbmFibGUgb25lIGludGVyYWN0aW9uIGF0IGEgdGltZVxuICAgIGNvbnRyYWRpY3QuZm9yRWFjaChrID0+IHtcbiAgICAgIGlmIChrICE9PSBjb25maWcuaWQpIHtcbiAgICAgICAgaW50ZXJhY3Rpb25Db25maWdba10gPSB7Li4uaW50ZXJhY3Rpb25Db25maWdba10sIGVuYWJsZWQ6IGZhbHNlfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0IG5ld1N0YXRlID0ge1xuICAgIC4uLnN0YXRlLFxuICAgIGludGVyYWN0aW9uQ29uZmlnXG4gIH07XG5cbiAgaWYgKGNvbmZpZy5pZCA9PT0gJ2dlb2NvZGVyJyAmJiAhY29uZmlnLmVuYWJsZWQpIHtcbiAgICByZXR1cm4gcmVtb3ZlRGF0YXNldFVwZGF0ZXIobmV3U3RhdGUsIHtkYXRhSWQ6ICdnZW9jb2Rlcl9kYXRhc2V0J30pO1xuICB9XG5cbiAgcmV0dXJuIG5ld1N0YXRlO1xufVxuXG4vKipcbiAqIFRyaWdnZXIgbGF5ZXIgY2xpY2sgZXZlbnQgd2l0aCBjbGlja2VkIG9iamVjdFxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLmxheWVyQ2xpY2tVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgbGF5ZXJDbGlja1VwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIG1vdXNlUG9zOiBzdGF0ZS5pbnRlcmFjdGlvbkNvbmZpZy5jb29yZGluYXRlLmVuYWJsZWRcbiAgICA/IHtcbiAgICAgICAgLi4uc3RhdGUubW91c2VQb3MsXG4gICAgICAgIHBpbm5lZDogc3RhdGUubW91c2VQb3MucGlubmVkID8gbnVsbCA6IGNsb25lRGVlcChzdGF0ZS5tb3VzZVBvcylcbiAgICAgIH1cbiAgICA6IHN0YXRlLm1vdXNlUG9zLFxuICBjbGlja2VkOiBhY3Rpb24uaW5mbyAmJiBhY3Rpb24uaW5mby5waWNrZWQgPyBhY3Rpb24uaW5mbyA6IG51bGxcbn0pO1xuXG4vKipcbiAqIFRyaWdnZXIgbWFwIGNsaWNrIGV2ZW50LCB1bnNlbGVjdCBjbGlja2VkIG9iamVjdFxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLm1hcENsaWNrVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IG1hcENsaWNrVXBkYXRlciA9IHN0YXRlID0+IHtcbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBjbGlja2VkOiBudWxsXG4gIH07XG59O1xuXG4vKipcbiAqIFRyaWdnZXIgbWFwIG1vdmUgZXZlbnRcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5tb3VzZU1vdmVVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgbW91c2VNb3ZlVXBkYXRlciA9IChzdGF0ZSwge2V2dH0pID0+IHtcbiAgaWYgKE9iamVjdC52YWx1ZXMoc3RhdGUuaW50ZXJhY3Rpb25Db25maWcpLnNvbWUoY29uZmlnID0+IGNvbmZpZy5lbmFibGVkKSkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIG1vdXNlUG9zOiB7XG4gICAgICAgIC4uLnN0YXRlLm1vdXNlUG9zLFxuICAgICAgICBtb3VzZVBvc2l0aW9uOiBbLi4uZXZ0LnBvaW50XSxcbiAgICAgICAgY29vcmRpbmF0ZTogWy4uLmV2dC5sbmdMYXRdXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBzdGF0ZTtcbn07XG4vKipcbiAqIFRvZ2dsZSB2aXNpYmlsaXR5IG9mIGEgbGF5ZXIgZm9yIGEgc3BsaXQgbWFwXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykudG9nZ2xlU3BsaXRNYXBVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgdG9nZ2xlU3BsaXRNYXBVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+XG4gIHN0YXRlLnNwbGl0TWFwcyAmJiBzdGF0ZS5zcGxpdE1hcHMubGVuZ3RoID09PSAwXG4gICAgPyB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICAvLyBtYXliZSB3ZSBzaG91bGQgdXNlIGFuIGFycmF5IHRvIHN0b3JlIHN0YXRlIGZvciBhIHNpbmdsZSBtYXAgYXMgd2VsbFxuICAgICAgICAvLyBpZiBjdXJyZW50IG1hcHMgbGVuZ3RoIGlzIGVxdWFsIHRvIDAgaXQgbWVhbnMgdGhhdCB3ZSBhcmUgYWJvdXQgdG8gc3BsaXQgdGhlIHZpZXdcbiAgICAgICAgc3BsaXRNYXBzOiBjb21wdXRlU3BsaXRNYXBMYXllcnMoc3RhdGUubGF5ZXJzKVxuICAgICAgfVxuICAgIDogY2xvc2VTcGVjaWZpY01hcEF0SW5kZXgoc3RhdGUsIGFjdGlvbik7XG5cbi8qKlxuICogVG9nZ2xlIHZpc2liaWxpdHkgb2YgYSBsYXllciBpbiBhIHNwbGl0IG1hcFxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLnRvZ2dsZUxheWVyRm9yTWFwVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHRvZ2dsZUxheWVyRm9yTWFwVXBkYXRlciA9IChzdGF0ZSwge21hcEluZGV4LCBsYXllcklkfSkgPT4ge1xuICBjb25zdCB7c3BsaXRNYXBzfSA9IHN0YXRlO1xuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgc3BsaXRNYXBzOiBzcGxpdE1hcHMubWFwKChzbSwgaSkgPT5cbiAgICAgIGkgPT09IG1hcEluZGV4XG4gICAgICAgID8ge1xuICAgICAgICAgICAgLi4uc3BsaXRNYXBzW2ldLFxuICAgICAgICAgICAgbGF5ZXJzOiB7XG4gICAgICAgICAgICAgIC4uLnNwbGl0TWFwc1tpXS5sYXllcnMsXG4gICAgICAgICAgICAgIC8vIGlmIGxheWVySWQgbm90IGluIGxheWVycywgc2V0IGl0IHRvIHZpc2libGVcbiAgICAgICAgICAgICAgW2xheWVySWRdOiAhc3BsaXRNYXBzW2ldLmxheWVyc1tsYXllcklkXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgOiBzbVxuICAgIClcbiAgfTtcbn07XG5cbi8qKlxuICogQWRkIG5ldyBkYXRhc2V0IHRvIGB2aXNTdGF0ZWAsIHdpdGggb3B0aW9uIHRvIGxvYWQgYSBtYXAgY29uZmlnIGFsb25nIHdpdGggdGhlIGRhdGFzZXRzXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykudXBkYXRlVmlzRGF0YVVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG1heC1zdGF0ZW1lbnRzICovXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29tcGxleGl0eVxuZXhwb3J0IGNvbnN0IHVwZGF0ZVZpc0RhdGFVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgLy8gZGF0YXNldHMgY2FuIGJlIGEgc2luZ2xlIGRhdGEgZW50cmllcyBvciBhbiBhcnJheSBvZiBtdWx0aXBsZSBkYXRhIGVudHJpZXNcbiAgY29uc3Qge2NvbmZpZywgb3B0aW9uc30gPSBhY3Rpb247XG4gIGNvbnN0IGRhdGFzZXRzID0gdG9BcnJheShhY3Rpb24uZGF0YXNldHMpO1xuXG4gIGNvbnN0IG5ld0RhdGFFbnRyaWVzID0gZGF0YXNldHMucmVkdWNlKFxuICAgIChhY2N1LCB7aW5mbyA9IHt9LCBkYXRhLCBtZXRhZGF0YX0gPSB7fSkgPT4gKHtcbiAgICAgIC4uLmFjY3UsXG4gICAgICAuLi4oY3JlYXRlTmV3RGF0YUVudHJ5KHtpbmZvLCBkYXRhLCBtZXRhZGF0YX0sIHN0YXRlLmRhdGFzZXRzKSB8fCB7fSlcbiAgICB9KSxcbiAgICB7fVxuICApO1xuXG4gIGNvbnN0IGRhdGFFbXB0eSA9IE9iamVjdC5rZXlzKG5ld0RhdGFFbnRyaWVzKS5sZW5ndGggPCAxO1xuXG4gIC8vIGFwcGx5IGNvbmZpZyBpZiBwYXNzZWQgZnJvbSBhY3Rpb25cbiAgY29uc3QgcHJldmlvdXNTdGF0ZSA9IGNvbmZpZ1xuICAgID8gcmVjZWl2ZU1hcENvbmZpZ1VwZGF0ZXIoc3RhdGUsIHtcbiAgICAgICAgcGF5bG9hZDoge2NvbmZpZywgb3B0aW9uc31cbiAgICAgIH0pXG4gICAgOiBzdGF0ZTtcblxuICBsZXQgbWVyZ2VkU3RhdGUgPSB7XG4gICAgLi4ucHJldmlvdXNTdGF0ZSxcbiAgICBkYXRhc2V0czoge1xuICAgICAgLi4ucHJldmlvdXNTdGF0ZS5kYXRhc2V0cyxcbiAgICAgIC4uLm5ld0RhdGFFbnRyaWVzXG4gICAgfVxuICB9O1xuXG4gIC8vIG1lcmdlIHN0YXRlIHdpdGggY29uZmlnIHRvIGJlIG1lcmdlZFxuICBmb3IgKGNvbnN0IG1lcmdlciBvZiBtZXJnZWRTdGF0ZS5tZXJnZXJzKSB7XG4gICAgaWYgKGlzVmFsaWRNZXJnZXIobWVyZ2VyKSAmJiBtZXJnZXIudG9NZXJnZVByb3AgJiYgbWVyZ2VkU3RhdGVbbWVyZ2VyLnRvTWVyZ2VQcm9wXSkge1xuICAgICAgY29uc3QgdG9NZXJnZSA9IG1lcmdlZFN0YXRlW21lcmdlci50b01lcmdlUHJvcF07XG4gICAgICBtZXJnZWRTdGF0ZVttZXJnZXIudG9NZXJnZVByb3BdID0gSU5JVElBTF9WSVNfU1RBVEVbbWVyZ2VyLnRvTWVyZ2VQcm9wXTtcbiAgICAgIG1lcmdlZFN0YXRlID0gbWVyZ2VyLm1lcmdlKG1lcmdlZFN0YXRlLCB0b01lcmdlKTtcbiAgICB9XG4gIH1cblxuICBsZXQgbmV3TGF5ZXJzID0gIWRhdGFFbXB0eVxuICAgID8gbWVyZ2VkU3RhdGUubGF5ZXJzLmZpbHRlcihsID0+IGwuY29uZmlnLmRhdGFJZCAmJiBsLmNvbmZpZy5kYXRhSWQgaW4gbmV3RGF0YUVudHJpZXMpXG4gICAgOiBbXTtcblxuICBpZiAoIW5ld0xheWVycy5sZW5ndGggJiYgKG9wdGlvbnMgfHwge30pLmF1dG9DcmVhdGVMYXllcnMgIT09IGZhbHNlKSB7XG4gICAgLy8gbm8gbGF5ZXIgbWVyZ2VkLCBmaW5kIGRlZmF1bHRzXG4gICAgY29uc3QgcmVzdWx0ID0gYWRkRGVmYXVsdExheWVycyhtZXJnZWRTdGF0ZSwgbmV3RGF0YUVudHJpZXMpO1xuICAgIG1lcmdlZFN0YXRlID0gcmVzdWx0LnN0YXRlO1xuICAgIG5ld0xheWVycyA9IHJlc3VsdC5uZXdMYXllcnM7XG4gIH1cblxuICBpZiAobWVyZ2VkU3RhdGUuc3BsaXRNYXBzLmxlbmd0aCkge1xuICAgIC8vIGlmIG1hcCBpcyBzcGxpdCwgYWRkIG5ldyBsYXllcnMgdG8gc3BsaXRNYXBzXG4gICAgbmV3TGF5ZXJzID0gbWVyZ2VkU3RhdGUubGF5ZXJzLmZpbHRlcihcbiAgICAgIGwgPT4gbC5jb25maWcuZGF0YUlkICYmIGwuY29uZmlnLmRhdGFJZCBpbiBuZXdEYXRhRW50cmllc1xuICAgICk7XG4gICAgbWVyZ2VkU3RhdGUgPSB7XG4gICAgICAuLi5tZXJnZWRTdGF0ZSxcbiAgICAgIHNwbGl0TWFwczogYWRkTmV3TGF5ZXJzVG9TcGxpdE1hcChtZXJnZWRTdGF0ZS5zcGxpdE1hcHMsIG5ld0xheWVycylcbiAgICB9O1xuICB9XG5cbiAgLy8gaWYgbm8gdG9vbHRpcHMgbWVyZ2VkIGFkZCBkZWZhdWx0IHRvb2x0aXBzXG4gIE9iamVjdC5rZXlzKG5ld0RhdGFFbnRyaWVzKS5mb3JFYWNoKGRhdGFJZCA9PiB7XG4gICAgY29uc3QgdG9vbHRpcEZpZWxkcyA9IG1lcmdlZFN0YXRlLmludGVyYWN0aW9uQ29uZmlnLnRvb2x0aXAuY29uZmlnLmZpZWxkc1RvU2hvd1tkYXRhSWRdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheSh0b29sdGlwRmllbGRzKSB8fCAhdG9vbHRpcEZpZWxkcy5sZW5ndGgpIHtcbiAgICAgIG1lcmdlZFN0YXRlID0gYWRkRGVmYXVsdFRvb2x0aXBzKG1lcmdlZFN0YXRlLCBuZXdEYXRhRW50cmllc1tkYXRhSWRdKTtcbiAgICB9XG4gIH0pO1xuXG4gIGxldCB1cGRhdGVkU3RhdGUgPSB1cGRhdGVBbGxMYXllckRvbWFpbkRhdGEoXG4gICAgbWVyZ2VkU3RhdGUsXG4gICAgZGF0YUVtcHR5ID8gT2JqZWN0LmtleXMobWVyZ2VkU3RhdGUuZGF0YXNldHMpIDogT2JqZWN0LmtleXMobmV3RGF0YUVudHJpZXMpLFxuICAgIHVuZGVmaW5lZFxuICApO1xuXG4gIC8vIHJlZ2lzdGVyIGxheWVyIGFuaW1hdGlvbiBkb21haW4sXG4gIC8vIG5lZWQgdG8gYmUgY2FsbGVkIGFmdGVyIGxheWVyIGRhdGEgaXMgY2FsY3VsYXRlZFxuICB1cGRhdGVkU3RhdGUgPSB1cGRhdGVBbmltYXRpb25Eb21haW4odXBkYXRlZFN0YXRlKTtcblxuICByZXR1cm4gdXBkYXRlZFN0YXRlO1xufTtcbi8qIGVzbGludC1lbmFibGUgbWF4LXN0YXRlbWVudHMgKi9cblxuLyoqXG4gKiBSZW5hbWUgYW4gZXhpc3RpbmcgZGF0YXNldCBpbiBgdmlzU3RhdGVgXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykucmVuYW1lRGF0YXNldFVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW5hbWVEYXRhc2V0VXBkYXRlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIGNvbnN0IHtkYXRhSWQsIGxhYmVsfSA9IGFjdGlvbjtcbiAgY29uc3Qge2RhdGFzZXRzfSA9IHN0YXRlO1xuICBjb25zdCBleGlzdGluZyA9IGRhdGFzZXRzW2RhdGFJZF07XG4gIC8vIEB0cy1pZ25vcmVcbiAgcmV0dXJuIGV4aXN0aW5nXG4gICAgPyB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBkYXRhc2V0czoge1xuICAgICAgICAgIC4uLmRhdGFzZXRzLFxuICAgICAgICAgIFtkYXRhSWRdOiB7XG4gICAgICAgICAgICAuLi5leGlzdGluZyxcbiAgICAgICAgICAgIGxhYmVsXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgOiAvLyBOby1vcCBpZiB0aGUgZGF0YXNldCBkb2Vzbid0IGV4aXN0XG4gICAgICBzdGF0ZTtcbn1cblxuLyoqXG4gKiBXaGVuIGEgdXNlciBjbGlja3Mgb24gdGhlIHNwZWNpZmljIG1hcCBjbG9zaW5nIGljb25cbiAqIHRoZSBhcHBsaWNhdGlvbiB3aWxsIGNsb3NlIHRoZSBzZWxlY3RlZCBtYXBcbiAqIGFuZCB3aWxsIG1lcmdlIHRoZSByZW1haW5pbmcgb25lIHdpdGggdGhlIGdsb2JhbCBzdGF0ZVxuICogVE9ETzogaSB0aGluayBpbiB0aGUgZnV0dXJlIHRoaXMgYWN0aW9uIHNob3VsZCBiZSBjYWxsZWQgbWVyZ2UgbWFwIGxheWVycyB3aXRoIGdsb2JhbCBzZXR0aW5nc1xuICogQHBhcmFtIHtPYmplY3R9IHN0YXRlIGB2aXNTdGF0ZWBcbiAqIEBwYXJhbSB7T2JqZWN0fSBhY3Rpb24gYWN0aW9uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBuZXh0U3RhdGVcbiAqL1xuZnVuY3Rpb24gY2xvc2VTcGVjaWZpY01hcEF0SW5kZXgoc3RhdGUsIGFjdGlvbikge1xuICAvLyByZXRyaWV2ZSBsYXllcnMgbWV0YSBkYXRhIGZyb20gdGhlIHJlbWFpbmluZyBtYXAgdGhhdCB3ZSBuZWVkIHRvIGtlZXBcbiAgY29uc3QgaW5kZXhUb1JldHJpZXZlID0gMSAtIGFjdGlvbi5wYXlsb2FkO1xuICBjb25zdCBtYXBMYXllcnMgPSBzdGF0ZS5zcGxpdE1hcHNbaW5kZXhUb1JldHJpZXZlXS5sYXllcnM7XG4gIGNvbnN0IHtsYXllcnN9ID0gc3RhdGU7XG5cbiAgLy8gdXBkYXRlIGxheWVyIHZpc2liaWxpdHlcbiAgY29uc3QgbmV3TGF5ZXJzID0gbGF5ZXJzLm1hcChsYXllciA9PlxuICAgICFtYXBMYXllcnNbbGF5ZXIuaWRdICYmIGxheWVyLmNvbmZpZy5pc1Zpc2libGVcbiAgICAgID8gbGF5ZXIudXBkYXRlTGF5ZXJDb25maWcoe1xuICAgICAgICAgIC8vIGlmIGxheWVyLmlkIGlzIG5vdCBpbiBtYXBMYXllcnMsIGl0IHNob3VsZCBiZSBpblZpc2libGVcbiAgICAgICAgICBpc1Zpc2libGU6IGZhbHNlXG4gICAgICAgIH0pXG4gICAgICA6IGxheWVyXG4gICk7XG5cbiAgLy8gZGVsZXRlIG1hcFxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGxheWVyczogbmV3TGF5ZXJzLFxuICAgIHNwbGl0TWFwczogW11cbiAgfTtcbn1cblxuLyoqXG4gKiBUcmlnZ2VyIGZpbGUgbG9hZGluZyBkaXNwYXRjaCBgYWRkRGF0YVRvTWFwYCBpZiBzdWNjZWVkLCBvciBgbG9hZEZpbGVzRXJyYCBpZiBmYWlsZWRcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5sb2FkRmlsZXNVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgbG9hZEZpbGVzVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIGNvbnN0IHtmaWxlcywgb25GaW5pc2ggPSBsb2FkRmlsZXNTdWNjZXNzfSA9IGFjdGlvbjtcbiAgaWYgKCFmaWxlcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICBjb25zdCBmaWxlTG9hZGluZ1Byb2dyZXNzID0gQXJyYXkuZnJvbShmaWxlcykucmVkdWNlKFxuICAgIChhY2N1LCBmLCBpKSA9PiBtZXJnZV8oaW5pdGlhbEZpbGVMb2FkaW5nUHJvZ3Jlc3MoZiwgaSkpKGFjY3UpLFxuICAgIHt9XG4gICk7XG5cbiAgY29uc3QgZmlsZUxvYWRpbmcgPSB7XG4gICAgZmlsZUNhY2hlOiBbXSxcbiAgICBmaWxlc1RvTG9hZDogZmlsZXMsXG4gICAgb25GaW5pc2hcbiAgfTtcblxuICBjb25zdCBuZXh0U3RhdGUgPSBtZXJnZV8oe2ZpbGVMb2FkaW5nUHJvZ3Jlc3MsIGZpbGVMb2FkaW5nfSkoc3RhdGUpO1xuXG4gIHJldHVybiBsb2FkTmV4dEZpbGVVcGRhdGVyKG5leHRTdGF0ZSk7XG59O1xuXG4vKipcbiAqIFN1Y2Vzc2Z1bGx5IGxvYWRlZCBvbmUgZmlsZSwgbW92ZSBvbiB0byB0aGUgbmV4dCBvbmVcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5sb2FkRmlsZVN0ZXBTdWNjZXNzVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxvYWRGaWxlU3RlcFN1Y2Nlc3NVcGRhdGVyKHN0YXRlLCBhY3Rpb24pIHtcbiAgaWYgKCFzdGF0ZS5maWxlTG9hZGluZykge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuICBjb25zdCB7ZmlsZU5hbWUsIGZpbGVDYWNoZX0gPSBhY3Rpb247XG4gIGNvbnN0IHtmaWxlc1RvTG9hZCwgb25GaW5pc2h9ID0gc3RhdGUuZmlsZUxvYWRpbmc7XG4gIGNvbnN0IHN0YXRlV2l0aFByb2dyZXNzID0gdXBkYXRlRmlsZUxvYWRpbmdQcm9ncmVzc1VwZGF0ZXIoc3RhdGUsIHtcbiAgICBmaWxlTmFtZSxcbiAgICBwcm9ncmVzczoge3BlcmNlbnQ6IDEsIG1lc3NhZ2U6ICdEb25lJ31cbiAgfSk7XG5cbiAgLy8gc2F2ZSBwcm9jZXNzZWQgZmlsZSB0byBmaWxlQ2FjaGVcbiAgY29uc3Qgc3RhdGVXaXRoQ2FjaGUgPSBwaWNrXygnZmlsZUxvYWRpbmcnKShtZXJnZV8oe2ZpbGVDYWNoZX0pKShzdGF0ZVdpdGhQcm9ncmVzcyk7XG5cbiAgcmV0dXJuIHdpdGhUYXNrKFxuICAgIHN0YXRlV2l0aENhY2hlLFxuICAgIERFTEFZX1RBU0soMjAwKS5tYXAoZmlsZXNUb0xvYWQubGVuZ3RoID8gbG9hZE5leHRGaWxlIDogKCkgPT4gb25GaW5pc2goZmlsZUNhY2hlKSlcbiAgKTtcbn1cblxuLy8gd2l0aFRhc2s8VD4oc3RhdGU6IFQsIHRhc2s6IGFueSk6IFRcblxuLyoqXG4gKlxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLmxvYWROZXh0RmlsZVVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2FkTmV4dEZpbGVVcGRhdGVyKHN0YXRlKSB7XG4gIGlmICghc3RhdGUuZmlsZUxvYWRpbmcpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cbiAgY29uc3Qge2ZpbGVzVG9Mb2FkfSA9IHN0YXRlLmZpbGVMb2FkaW5nO1xuICBjb25zdCBbZmlsZSwgLi4ucmVtYWluaW5nRmlsZXNUb0xvYWRdID0gZmlsZXNUb0xvYWQ7XG5cbiAgLy8gc2F2ZSBmaWxlc1RvTG9hZCB0byBzdGF0ZVxuICBjb25zdCBuZXh0U3RhdGUgPSBwaWNrXygnZmlsZUxvYWRpbmcnKShtZXJnZV8oe2ZpbGVzVG9Mb2FkOiByZW1haW5pbmdGaWxlc1RvTG9hZH0pKShzdGF0ZSk7XG5cbiAgY29uc3Qgc3RhdGVXaXRoUHJvZ3Jlc3MgPSB1cGRhdGVGaWxlTG9hZGluZ1Byb2dyZXNzVXBkYXRlcihuZXh0U3RhdGUsIHtcbiAgICBmaWxlTmFtZTogZmlsZS5uYW1lLFxuICAgIHByb2dyZXNzOiB7cGVyY2VudDogMCwgbWVzc2FnZTogJ2xvYWRpbmcuLi4nfVxuICB9KTtcblxuICBjb25zdCB7bG9hZGVycywgbG9hZE9wdGlvbnN9ID0gc3RhdGU7XG4gIHJldHVybiB3aXRoVGFzayhcbiAgICBzdGF0ZVdpdGhQcm9ncmVzcyxcbiAgICBtYWtlTG9hZEZpbGVUYXNrKGZpbGUsIG5leHRTdGF0ZS5maWxlTG9hZGluZy5maWxlQ2FjaGUsIGxvYWRlcnMsIGxvYWRPcHRpb25zKVxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZUxvYWRGaWxlVGFzayhmaWxlLCBmaWxlQ2FjaGUsIGxvYWRlcnMgPSBbXSwgbG9hZE9wdGlvbnMgPSB7fSkge1xuICByZXR1cm4gTE9BRF9GSUxFX1RBU0soe2ZpbGUsIGZpbGVDYWNoZSwgbG9hZGVycywgbG9hZE9wdGlvbnN9KS5iaW1hcChcbiAgICAvLyBwcmV0dGllciBpZ25vcmVcbiAgICAvLyBzdWNjZXNzXG4gICAgZ2VuID0+XG4gICAgICBuZXh0RmlsZUJhdGNoKHtcbiAgICAgICAgZ2VuLFxuICAgICAgICBmaWxlTmFtZTogZmlsZS5uYW1lLFxuICAgICAgICBvbkZpbmlzaDogcmVzdWx0ID0+XG4gICAgICAgICAgcHJvY2Vzc0ZpbGVDb250ZW50KHtcbiAgICAgICAgICAgIGNvbnRlbnQ6IHJlc3VsdCxcbiAgICAgICAgICAgIGZpbGVDYWNoZVxuICAgICAgICAgIH0pXG4gICAgICB9KSxcblxuICAgIC8vIGVycm9yXG4gICAgZXJyID0+IGxvYWRGaWxlc0VycihmaWxlLm5hbWUsIGVycilcbiAgKTtcbn1cblxuLyoqXG4gKlxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLnByb2Nlc3NGaWxlQ29udGVudFVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcm9jZXNzRmlsZUNvbnRlbnRVcGRhdGVyKHN0YXRlLCBhY3Rpb24pIHtcbiAgY29uc3Qge2NvbnRlbnQsIGZpbGVDYWNoZX0gPSBhY3Rpb24ucGF5bG9hZDtcblxuICBjb25zdCBzdGF0ZVdpdGhQcm9ncmVzcyA9IHVwZGF0ZUZpbGVMb2FkaW5nUHJvZ3Jlc3NVcGRhdGVyKHN0YXRlLCB7XG4gICAgZmlsZU5hbWU6IGNvbnRlbnQuZmlsZU5hbWUsXG4gICAgcHJvZ3Jlc3M6IHtwZXJjZW50OiAxLCBtZXNzYWdlOiAncHJvY2Vzc2luZy4uLid9XG4gIH0pO1xuXG4gIHJldHVybiB3aXRoVGFzayhcbiAgICBzdGF0ZVdpdGhQcm9ncmVzcyxcbiAgICBQUk9DRVNTX0ZJTEVfREFUQSh7Y29udGVudCwgZmlsZUNhY2hlfSkuYmltYXAoXG4gICAgICByZXN1bHQgPT4gbG9hZEZpbGVTdGVwU3VjY2Vzcyh7ZmlsZU5hbWU6IGNvbnRlbnQuZmlsZU5hbWUsIGZpbGVDYWNoZTogcmVzdWx0fSksXG4gICAgICBlcnIgPT4gbG9hZEZpbGVzRXJyKGNvbnRlbnQuZmlsZU5hbWUsIGVycilcbiAgICApXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVByb2dyZXNzKHByZXZQcm9ncmVzcyA9IHt9LCBwcm9ncmVzcykge1xuICAvLyBUaGlzIGhhcHBlbnMgd2hlbiByZWNlaXZpbmcgcXVlcnkgbWV0YWRhdGEgb3Igb3RoZXIgY2FzZXMgd2UgZG9uJ3RcbiAgLy8gaGF2ZSBhbiB1cGRhdGUgZm9yIHRoZSB1c2VyLlxuICBpZiAoIXByb2dyZXNzIHx8ICFwcm9ncmVzcy5wZXJjZW50KSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBwZXJjZW50OiBwcm9ncmVzcy5wZXJjZW50XG4gIH07XG59XG5cbi8qKlxuICogZ2V0cyBjYWxsZWQgd2l0aCBwYXlsb2FkID0gQXN5bmNHZW5lcmF0b3I8Pz8/PlxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLm5leHRGaWxlQmF0Y2hVcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgbmV4dEZpbGVCYXRjaFVwZGF0ZXIgPSAoXG4gIHN0YXRlLFxuICB7cGF5bG9hZDoge2dlbiwgZmlsZU5hbWUsIHByb2dyZXNzLCBhY2N1bXVsYXRlZCwgb25GaW5pc2h9fVxuKSA9PiB7XG4gIGNvbnN0IHN0YXRlV2l0aFByb2dyZXNzID0gdXBkYXRlRmlsZUxvYWRpbmdQcm9ncmVzc1VwZGF0ZXIoc3RhdGUsIHtcbiAgICBmaWxlTmFtZSxcbiAgICBwcm9ncmVzczogcGFyc2VQcm9ncmVzcyhzdGF0ZS5maWxlTG9hZGluZ1Byb2dyZXNzW2ZpbGVOYW1lXSwgcHJvZ3Jlc3MpXG4gIH0pO1xuICByZXR1cm4gd2l0aFRhc2soXG4gICAgc3RhdGVXaXRoUHJvZ3Jlc3MsXG4gICAgVU5XUkFQX1RBU0soZ2VuLm5leHQoKSkuYmltYXAoXG4gICAgICAoe3ZhbHVlLCBkb25lfSkgPT4ge1xuICAgICAgICByZXR1cm4gZG9uZVxuICAgICAgICAgID8gb25GaW5pc2goYWNjdW11bGF0ZWQpXG4gICAgICAgICAgOiBuZXh0RmlsZUJhdGNoKHtcbiAgICAgICAgICAgICAgZ2VuLFxuICAgICAgICAgICAgICBmaWxlTmFtZSxcbiAgICAgICAgICAgICAgcHJvZ3Jlc3M6IHZhbHVlLnByb2dyZXNzLFxuICAgICAgICAgICAgICBhY2N1bXVsYXRlZDogdmFsdWUsXG4gICAgICAgICAgICAgIG9uRmluaXNoXG4gICAgICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBlcnIgPT4gbG9hZEZpbGVzRXJyKGZpbGVOYW1lLCBlcnIpXG4gICAgKVxuICApO1xufTtcblxuLyoqXG4gKiBUcmlnZ2VyIGxvYWRpbmcgZmlsZSBlcnJvclxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLmxvYWRGaWxlc0VyclVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBsb2FkRmlsZXNFcnJVcGRhdGVyID0gKHN0YXRlLCB7ZXJyb3IsIGZpbGVOYW1lfSkgPT4ge1xuICAvLyB1cGRhdGUgdWkgd2l0aCBlcnJvciBtZXNzYWdlXG4gIENvbnNvbGUud2FybihlcnJvcik7XG4gIGlmICghc3RhdGUuZmlsZUxvYWRpbmcpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cbiAgY29uc3Qge2ZpbGVzVG9Mb2FkLCBvbkZpbmlzaCwgZmlsZUNhY2hlfSA9IHN0YXRlLmZpbGVMb2FkaW5nO1xuXG4gIGNvbnN0IG5leHRTdGF0ZSA9IHVwZGF0ZUZpbGVMb2FkaW5nUHJvZ3Jlc3NVcGRhdGVyKHN0YXRlLCB7XG4gICAgZmlsZU5hbWUsXG4gICAgcHJvZ3Jlc3M6IHtlcnJvcn1cbiAgfSk7XG5cbiAgLy8ga2ljayBvZmYgbmV4dCBmaWxlIG9yIGZpbmlzaFxuICByZXR1cm4gd2l0aFRhc2soXG4gICAgbmV4dFN0YXRlLFxuICAgIERFTEFZX1RBU0soMjAwKS5tYXAoZmlsZXNUb0xvYWQubGVuZ3RoID8gbG9hZE5leHRGaWxlIDogKCkgPT4gb25GaW5pc2goZmlsZUNhY2hlKSlcbiAgKTtcbn07XG5cbi8qKlxuICogV2hlbiBzZWxlY3QgZGF0YXNldCBmb3IgZXhwb3J0LCBhcHBseSBjcHUgZmlsdGVyIHRvIHNlbGVjdGVkIGRhdGFzZXRcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5hcHBseUNQVUZpbHRlclVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBhcHBseUNQVUZpbHRlclVwZGF0ZXIgPSAoc3RhdGUsIHtkYXRhSWR9KSA9PiB7XG4gIC8vIGFwcGx5IGNwdUZpbHRlclxuICBjb25zdCBkYXRhSWRzID0gdG9BcnJheShkYXRhSWQpO1xuXG4gIHJldHVybiBkYXRhSWRzLnJlZHVjZSgoYWNjdSwgaWQpID0+IGZpbHRlckRhdGFzZXRDUFUoYWNjdSwgaWQpLCBzdGF0ZSk7XG59O1xuXG4vKipcbiAqIFVzZXIgaW5wdXQgdG8gdXBkYXRlIHRoZSBpbmZvIG9mIHRoZSBtYXBcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5zZXRNYXBJbmZvVXBkYXRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHNldE1hcEluZm9VcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBtYXBJbmZvOiB7XG4gICAgLi4uc3RhdGUubWFwSW5mbyxcbiAgICAuLi5hY3Rpb24uaW5mb1xuICB9XG59KTtcbi8qKlxuICogSGVscGVyIGZ1bmN0aW9uIHRvIHVwZGF0ZSBBbGwgbGF5ZXIgZG9tYWluIGFuZCBsYXllciBkYXRhIG9mIHN0YXRlXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5hZGREZWZhdWx0TGF5ZXJzfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkRGVmYXVsdExheWVycyhzdGF0ZSwgZGF0YXNldHMpIHtcbiAgLyoqIEB0eXBlIHtMYXllcltdfSAqL1xuICBjb25zdCBlbXB0eSA9IFtdO1xuICBjb25zdCBkZWZhdWx0TGF5ZXJzID0gT2JqZWN0LnZhbHVlcyhkYXRhc2V0cykucmVkdWNlKChhY2N1LCBkYXRhc2V0KSA9PiB7XG4gICAgY29uc3QgZm91bmRMYXllcnMgPSBmaW5kRGVmYXVsdExheWVyKGRhdGFzZXQsIHN0YXRlLmxheWVyQ2xhc3Nlcyk7XG4gICAgcmV0dXJuIGZvdW5kTGF5ZXJzICYmIGZvdW5kTGF5ZXJzLmxlbmd0aCA/IGFjY3UuY29uY2F0KGZvdW5kTGF5ZXJzKSA6IGFjY3U7XG4gIH0sIGVtcHR5KTtcblxuICByZXR1cm4ge1xuICAgIHN0YXRlOiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGxheWVyczogWy4uLnN0YXRlLmxheWVycywgLi4uZGVmYXVsdExheWVyc10sXG4gICAgICBsYXllck9yZGVyOiBbXG4gICAgICAgIC8vIHB1dCBuZXcgbGF5ZXJzIG9uIHRvcCBvZiBvbGQgb25lc1xuICAgICAgICAuLi5kZWZhdWx0TGF5ZXJzLm1hcCgoXywgaSkgPT4gc3RhdGUubGF5ZXJzLmxlbmd0aCArIGkpLFxuICAgICAgICAuLi5zdGF0ZS5sYXllck9yZGVyXG4gICAgICBdXG4gICAgfSxcbiAgICBuZXdMYXllcnM6IGRlZmF1bHRMYXllcnNcbiAgfTtcbn1cblxuLyoqXG4gKiBoZWxwZXIgZnVuY3Rpb24gdG8gZmluZCBkZWZhdWx0IHRvb2x0aXBzXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhc2V0XG4gKiBAcmV0dXJucyB7T2JqZWN0fSBuZXh0U3RhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZERlZmF1bHRUb29sdGlwcyhzdGF0ZSwgZGF0YXNldCkge1xuICBjb25zdCB0b29sdGlwRmllbGRzID0gZmluZEZpZWxkc1RvU2hvdyhkYXRhc2V0KTtcbiAgY29uc3QgbWVyZ2VkID0ge1xuICAgIC4uLnN0YXRlLmludGVyYWN0aW9uQ29uZmlnLnRvb2x0aXAuY29uZmlnLmZpZWxkc1RvU2hvdyxcbiAgICAuLi50b29sdGlwRmllbGRzXG4gIH07XG5cbiAgcmV0dXJuIHNldChbJ2ludGVyYWN0aW9uQ29uZmlnJywgJ3Rvb2x0aXAnLCAnY29uZmlnJywgJ2ZpZWxkc1RvU2hvdyddLCBtZXJnZWQsIHN0YXRlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxGaWxlTG9hZGluZ1Byb2dyZXNzKGZpbGUsIGluZGV4KSB7XG4gIGNvbnN0IGZpbGVOYW1lID0gZmlsZS5uYW1lIHx8IGBVbnRpdGxlZCBGaWxlICR7aW5kZXh9YDtcbiAgcmV0dXJuIHtcbiAgICBbZmlsZU5hbWVdOiB7XG4gICAgICAvLyBwZXJjZW50IG9mIGN1cnJlbnQgZmlsZVxuICAgICAgcGVyY2VudDogMCxcbiAgICAgIG1lc3NhZ2U6ICcnLFxuICAgICAgZmlsZU5hbWUsXG4gICAgICBlcnJvcjogbnVsbFxuICAgIH1cbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUZpbGVMb2FkaW5nUHJvZ3Jlc3NVcGRhdGVyKHN0YXRlLCB7ZmlsZU5hbWUsIHByb2dyZXNzfSkge1xuICByZXR1cm4gcGlja18oJ2ZpbGVMb2FkaW5nUHJvZ3Jlc3MnKShwaWNrXyhmaWxlTmFtZSkobWVyZ2VfKHByb2dyZXNzKSkpKHN0YXRlKTtcbn1cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9uIHRvIHVwZGF0ZSBsYXllciBkb21haW5zIGZvciBhbiBhcnJheSBvZiBkYXRhc2V0c1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykudXBkYXRlQWxsTGF5ZXJEb21haW5EYXRhfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQWxsTGF5ZXJEb21haW5EYXRhKHN0YXRlLCBkYXRhSWQsIHVwZGF0ZWRGaWx0ZXIpIHtcbiAgY29uc3QgZGF0YUlkcyA9IHR5cGVvZiBkYXRhSWQgPT09ICdzdHJpbmcnID8gW2RhdGFJZF0gOiBkYXRhSWQ7XG4gIGNvbnN0IG5ld0xheWVycyA9IFtdO1xuICBjb25zdCBuZXdMYXllckRhdGEgPSBbXTtcblxuICBzdGF0ZS5sYXllcnMuZm9yRWFjaCgob2xkTGF5ZXIsIGkpID0+IHtcbiAgICBpZiAob2xkTGF5ZXIuY29uZmlnLmRhdGFJZCAmJiBkYXRhSWRzLmluY2x1ZGVzKG9sZExheWVyLmNvbmZpZy5kYXRhSWQpKSB7XG4gICAgICAvLyBObyBuZWVkIHRvIHJlY2FsY3VsYXRlIGxheWVyIGRvbWFpbiBpZiBmaWx0ZXIgaGFzIGZpeGVkIGRvbWFpblxuICAgICAgY29uc3QgbmV3TGF5ZXIgPVxuICAgICAgICB1cGRhdGVkRmlsdGVyICYmIHVwZGF0ZWRGaWx0ZXIuZml4ZWREb21haW5cbiAgICAgICAgICA/IG9sZExheWVyXG4gICAgICAgICAgOiBvbGRMYXllci51cGRhdGVMYXllckRvbWFpbihzdGF0ZS5kYXRhc2V0cywgdXBkYXRlZEZpbHRlcik7XG5cbiAgICAgIGNvbnN0IHtsYXllckRhdGEsIGxheWVyfSA9IGNhbGN1bGF0ZUxheWVyRGF0YShuZXdMYXllciwgc3RhdGUsIHN0YXRlLmxheWVyRGF0YVtpXSk7XG5cbiAgICAgIG5ld0xheWVycy5wdXNoKGxheWVyKTtcbiAgICAgIG5ld0xheWVyRGF0YS5wdXNoKGxheWVyRGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld0xheWVycy5wdXNoKG9sZExheWVyKTtcbiAgICAgIG5ld0xheWVyRGF0YS5wdXNoKHN0YXRlLmxheWVyRGF0YVtpXSk7XG4gICAgfVxuICB9KTtcblxuICBjb25zdCBuZXdTdGF0ZSA9IHtcbiAgICAuLi5zdGF0ZSxcbiAgICBsYXllcnM6IG5ld0xheWVycyxcbiAgICBsYXllckRhdGE6IG5ld0xheWVyRGF0YVxuICB9O1xuXG4gIHJldHVybiBuZXdTdGF0ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUFuaW1hdGlvbkRvbWFpbihzdGF0ZSkge1xuICAvLyBtZXJnZSBhbGwgYW5pbWF0YWJsZSBsYXllciBkb21haW4gYW5kIHVwZGF0ZSBnbG9iYWwgY29uZmlnXG4gIGNvbnN0IGFuaW1hdGFibGVMYXllcnMgPSBzdGF0ZS5sYXllcnMuZmlsdGVyKFxuICAgIGwgPT5cbiAgICAgIGwuY29uZmlnLmlzVmlzaWJsZSAmJlxuICAgICAgbC5jb25maWcuYW5pbWF0aW9uICYmXG4gICAgICBsLmNvbmZpZy5hbmltYXRpb24uZW5hYmxlZCAmJlxuICAgICAgQXJyYXkuaXNBcnJheShsLmFuaW1hdGlvbkRvbWFpbilcbiAgKTtcblxuICBpZiAoIWFuaW1hdGFibGVMYXllcnMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgYW5pbWF0aW9uQ29uZmlnOiB7XG4gICAgICAgIC4uLnN0YXRlLmFuaW1hdGlvbkNvbmZpZyxcbiAgICAgICAgZG9tYWluOiBudWxsLFxuICAgICAgICBkZWZhdWx0VGltZUZvcm1hdDogbnVsbFxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBjb25zdCBtZXJnZWREb21haW4gPSBhbmltYXRhYmxlTGF5ZXJzLnJlZHVjZShcbiAgICAoYWNjdSwgbGF5ZXIpID0+IFtcbiAgICAgIE1hdGgubWluKGFjY3VbMF0sIGxheWVyLmFuaW1hdGlvbkRvbWFpblswXSksXG4gICAgICBNYXRoLm1heChhY2N1WzFdLCBsYXllci5hbmltYXRpb25Eb21haW5bMV0pXG4gICAgXSxcbiAgICBbTnVtYmVyKEluZmluaXR5KSwgLUluZmluaXR5XVxuICApO1xuICBjb25zdCBkZWZhdWx0VGltZUZvcm1hdCA9IGdldFRpbWVXaWRnZXRUaXRsZUZvcm1hdHRlcihtZXJnZWREb21haW4pO1xuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgYW5pbWF0aW9uQ29uZmlnOiB7XG4gICAgICAuLi5zdGF0ZS5hbmltYXRpb25Db25maWcsXG4gICAgICBjdXJyZW50VGltZTogaXNJblJhbmdlKHN0YXRlLmFuaW1hdGlvbkNvbmZpZy5jdXJyZW50VGltZSwgbWVyZ2VkRG9tYWluKVxuICAgICAgICA/IHN0YXRlLmFuaW1hdGlvbkNvbmZpZy5jdXJyZW50VGltZVxuICAgICAgICA6IG1lcmdlZERvbWFpblswXSxcbiAgICAgIGRvbWFpbjogbWVyZ2VkRG9tYWluLFxuICAgICAgZGVmYXVsdFRpbWVGb3JtYXRcbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogVXBkYXRlIHRoZSBzdGF0dXMgb2YgdGhlIGVkaXRvclxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLnNldEVkaXRvck1vZGVVcGRhdGVyfVxuICovXG5leHBvcnQgY29uc3Qgc2V0RWRpdG9yTW9kZVVwZGF0ZXIgPSAoc3RhdGUsIHttb2RlfSkgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGVkaXRvcjoge1xuICAgIC4uLnN0YXRlLmVkaXRvcixcbiAgICBtb2RlLFxuICAgIHNlbGVjdGVkRmVhdHVyZTogbnVsbFxuICB9XG59KTtcblxuLy8gY29uc3QgZmVhdHVyZVRvRmlsdGVyVmFsdWUgPSAoZmVhdHVyZSkgPT4gKHsuLi5mZWF0dXJlLCBpZDogZmVhdHVyZS5pZH0pO1xuLyoqXG4gKiBVcGRhdGUgZWRpdG9yIGZlYXR1cmVzXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykuc2V0RmVhdHVyZXNVcGRhdGVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0RmVhdHVyZXNVcGRhdGVyKHN0YXRlLCB7ZmVhdHVyZXMgPSBbXX0pIHtcbiAgY29uc3QgbGFzdEZlYXR1cmUgPSBmZWF0dXJlcy5sZW5ndGggJiYgZmVhdHVyZXNbZmVhdHVyZXMubGVuZ3RoIC0gMV07XG5cbiAgY29uc3QgbmV3U3RhdGUgPSB7XG4gICAgLi4uc3RhdGUsXG4gICAgZWRpdG9yOiB7XG4gICAgICAuLi5zdGF0ZS5lZGl0b3IsXG4gICAgICAvLyBvbmx5IHNhdmUgbm9uZSBmaWx0ZXIgZmVhdHVyZXMgdG8gZWRpdG9yXG4gICAgICBmZWF0dXJlczogZmVhdHVyZXMuZmlsdGVyKGYgPT4gIWdldEZpbHRlcklkSW5GZWF0dXJlKGYpKSxcbiAgICAgIG1vZGU6IGxhc3RGZWF0dXJlICYmIGxhc3RGZWF0dXJlLnByb3BlcnRpZXMuaXNDbG9zZWQgPyBFRElUT1JfTU9ERVMuRURJVCA6IHN0YXRlLmVkaXRvci5tb2RlXG4gICAgfVxuICB9O1xuXG4gIC8vIFJldHJpZXZlIGV4aXN0aW5nIGZlYXR1cmVcbiAgY29uc3Qge3NlbGVjdGVkRmVhdHVyZX0gPSBzdGF0ZS5lZGl0b3I7XG5cbiAgLy8gSWYgbm8gZmVhdHVyZSBpcyBzZWxlY3RlZCB3ZSBjYW4gc2ltcGx5IHJldHVybiBzaW5jZSBubyBvcGVyYXRpb25zXG4gIGlmICghc2VsZWN0ZWRGZWF0dXJlKSB7XG4gICAgcmV0dXJuIG5ld1N0YXRlO1xuICB9XG5cbiAgLy8gVE9ETzogY2hlY2sgaWYgdGhlIGZlYXR1cmUgaGFzIGNoYW5nZWRcbiAgY29uc3QgZmVhdHVyZSA9IGZlYXR1cmVzLmZpbmQoZiA9PiBmLmlkID09PSBzZWxlY3RlZEZlYXR1cmUuaWQpO1xuXG4gIC8vIGlmIGZlYXR1cmUgaXMgcGFydCBvZiBhIGZpbHRlclxuICBjb25zdCBmaWx0ZXJJZCA9IGZlYXR1cmUgJiYgZ2V0RmlsdGVySWRJbkZlYXR1cmUoZmVhdHVyZSk7XG4gIGlmIChmaWx0ZXJJZCAmJiBmZWF0dXJlKSB7XG4gICAgY29uc3QgZmVhdHVyZVZhbHVlID0gZmVhdHVyZVRvRmlsdGVyVmFsdWUoZmVhdHVyZSwgZmlsdGVySWQpO1xuICAgIGNvbnN0IGZpbHRlcklkeCA9IHN0YXRlLmZpbHRlcnMuZmluZEluZGV4KGZpbCA9PiBmaWwuaWQgPT09IGZpbHRlcklkKTtcbiAgICByZXR1cm4gc2V0RmlsdGVyVXBkYXRlcihuZXdTdGF0ZSwge1xuICAgICAgaWR4OiBmaWx0ZXJJZHgsXG4gICAgICBwcm9wOiAndmFsdWUnLFxuICAgICAgdmFsdWU6IGZlYXR1cmVWYWx1ZVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIG5ld1N0YXRlO1xufVxuXG4vKipcbiAqIFNldCB0aGUgY3VycmVudCBzZWxlY3RlZCBmZWF0dXJlXG4gKiBAbWVtYmVyb2YgdWlTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5zZXRTZWxlY3RlZEZlYXR1cmVVcGRhdGVyfVxuICovXG5leHBvcnQgY29uc3Qgc2V0U2VsZWN0ZWRGZWF0dXJlVXBkYXRlciA9IChzdGF0ZSwge2ZlYXR1cmV9KSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgZWRpdG9yOiB7XG4gICAgLi4uc3RhdGUuZWRpdG9yLFxuICAgIHNlbGVjdGVkRmVhdHVyZTogZmVhdHVyZVxuICB9XG59KTtcblxuLyoqXG4gKiBEZWxldGUgZXhpc3RpbmcgZmVhdHVyZSBmcm9tIGZpbHRlcnNcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5kZWxldGVGZWF0dXJlVXBkYXRlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZUZlYXR1cmVVcGRhdGVyKHN0YXRlLCB7ZmVhdHVyZX0pIHtcbiAgaWYgKCFmZWF0dXJlKSB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgY29uc3QgbmV3U3RhdGUgPSB7XG4gICAgLi4uc3RhdGUsXG4gICAgZWRpdG9yOiB7XG4gICAgICAuLi5zdGF0ZS5lZGl0b3IsXG4gICAgICBzZWxlY3RlZEZlYXR1cmU6IG51bGxcbiAgICB9XG4gIH07XG5cbiAgaWYgKGdldEZpbHRlcklkSW5GZWF0dXJlKGZlYXR1cmUpKSB7XG4gICAgY29uc3QgZmlsdGVySWR4ID0gbmV3U3RhdGUuZmlsdGVycy5maW5kSW5kZXgoZiA9PiBmLmlkID09PSBnZXRGaWx0ZXJJZEluRmVhdHVyZShmZWF0dXJlKSk7XG5cbiAgICByZXR1cm4gZmlsdGVySWR4ID4gLTEgPyByZW1vdmVGaWx0ZXJVcGRhdGVyKG5ld1N0YXRlLCB7aWR4OiBmaWx0ZXJJZHh9KSA6IG5ld1N0YXRlO1xuICB9XG5cbiAgLy8gbW9kaWZ5IGVkaXRvciBvYmplY3RcbiAgY29uc3QgbmV3RWRpdG9yID0ge1xuICAgIC4uLnN0YXRlLmVkaXRvcixcbiAgICBmZWF0dXJlczogc3RhdGUuZWRpdG9yLmZlYXR1cmVzLmZpbHRlcihmID0+IGYuaWQgIT09IGZlYXR1cmUuaWQpLFxuICAgIHNlbGVjdGVkRmVhdHVyZTogbnVsbFxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgZWRpdG9yOiBuZXdFZGl0b3JcbiAgfTtcbn1cblxuLyoqXG4gKiBUb2dnbGUgZmVhdHVyZSBhcyBsYXllciBmaWx0ZXJcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZVVwZGF0ZXJzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtdXBkYXRlcnMnKS5zZXRQb2x5Z29uRmlsdGVyTGF5ZXJVcGRhdGVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0UG9seWdvbkZpbHRlckxheWVyVXBkYXRlcihzdGF0ZSwgcGF5bG9hZCkge1xuICBjb25zdCB7bGF5ZXIsIGZlYXR1cmV9ID0gcGF5bG9hZDtcbiAgY29uc3QgZmlsdGVySWQgPSBnZXRGaWx0ZXJJZEluRmVhdHVyZShmZWF0dXJlKTtcblxuICAvLyBsZXQgbmV3RmlsdGVyID0gbnVsbDtcbiAgbGV0IGZpbHRlcklkeDtcbiAgbGV0IG5ld0xheWVySWQgPSBbbGF5ZXIuaWRdO1xuICBsZXQgbmV3U3RhdGUgPSBzdGF0ZTtcbiAgLy8gSWYgcG9seWdvbiBmaWx0ZXIgYWxyZWFkeSBleGlzdHMsIHdlIG5lZWQgdG8gZmluZCBvdXQgaWYgdGhlIGN1cnJlbnQgbGF5ZXIgaXMgYWxyZWFkeSBpbmNsdWRlZFxuICBpZiAoZmlsdGVySWQpIHtcbiAgICBmaWx0ZXJJZHggPSBzdGF0ZS5maWx0ZXJzLmZpbmRJbmRleChmID0+IGYuaWQgPT09IGZpbHRlcklkKTtcblxuICAgIGlmICghc3RhdGUuZmlsdGVyc1tmaWx0ZXJJZHhdKSB7XG4gICAgICAvLyB3aGF0IGlmIGZpbHRlciBkb2Vzbid0IGV4aXN0Py4uLiBub3QgcG9zc2libGUuXG4gICAgICAvLyBiZWNhdXNlIGZlYXR1cmVzIGluIHRoZSBlZGl0b3IgaXMgcGFzc2VkIGluIGZyb20gZmlsdGVycyBhbmQgZWRpdG9ycy5cbiAgICAgIC8vIGJ1dCB3ZSB3aWxsIG1vdmUgdGhpcyBmZWF0dXJlIGJhY2sgdG8gZWRpdG9yIGp1c3QgaW4gY2FzZVxuICAgICAgY29uc3Qgbm9uZUZpbHRlckZlYXR1cmUgPSB7XG4gICAgICAgIC4uLmZlYXR1cmUsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAuLi5mZWF0dXJlLnByb3BlcnRpZXMsXG4gICAgICAgICAgZmlsdGVySWQ6IG51bGxcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGVkaXRvcjoge1xuICAgICAgICAgIC4uLnN0YXRlLmVkaXRvcixcbiAgICAgICAgICBmZWF0dXJlczogWy4uLnN0YXRlLmVkaXRvci5mZWF0dXJlcywgbm9uZUZpbHRlckZlYXR1cmVdLFxuICAgICAgICAgIHNlbGVjdGVkRmVhdHVyZTogbm9uZUZpbHRlckZlYXR1cmVcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gICAgY29uc3QgZmlsdGVyID0gc3RhdGUuZmlsdGVyc1tmaWx0ZXJJZHhdO1xuICAgIGNvbnN0IHtsYXllcklkID0gW119ID0gZmlsdGVyO1xuICAgIGNvbnN0IGlzTGF5ZXJJbmNsdWRlZCA9IGxheWVySWQuaW5jbHVkZXMobGF5ZXIuaWQpO1xuXG4gICAgbmV3TGF5ZXJJZCA9IGlzTGF5ZXJJbmNsdWRlZFxuICAgICAgPyAvLyBpZiBsYXllciBpcyBpbmNsdWRlZCwgcmVtb3ZlIGl0XG4gICAgICAgIGxheWVySWQuZmlsdGVyKGwgPT4gbCAhPT0gbGF5ZXIuaWQpXG4gICAgICA6IFsuLi5sYXllcklkLCBsYXllci5pZF07XG4gIH0gZWxzZSB7XG4gICAgLy8gaWYgd2UgaGF2ZW4ndCBjcmVhdGUgdGhlIHBvbHlnb24gZmlsdGVyLCBjcmVhdGUgaXRcbiAgICBjb25zdCBuZXdGaWx0ZXIgPSBnZW5lcmF0ZVBvbHlnb25GaWx0ZXIoW10sIGZlYXR1cmUpO1xuICAgIGZpbHRlcklkeCA9IHN0YXRlLmZpbHRlcnMubGVuZ3RoO1xuXG4gICAgLy8gYWRkIGZlYXR1cmUsIHJlbW92ZSBmZWF0dXJlIGZyb20gZWlkdG9yXG4gICAgbmV3U3RhdGUgPSB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGZpbHRlcnM6IFsuLi5zdGF0ZS5maWx0ZXJzLCBuZXdGaWx0ZXJdLFxuICAgICAgZWRpdG9yOiB7XG4gICAgICAgIC4uLnN0YXRlLmVkaXRvcixcbiAgICAgICAgZmVhdHVyZXM6IHN0YXRlLmVkaXRvci5mZWF0dXJlcy5maWx0ZXIoZiA9PiBmLmlkICE9PSBmZWF0dXJlLmlkKSxcbiAgICAgICAgc2VsZWN0ZWRGZWF0dXJlOiBuZXdGaWx0ZXIudmFsdWVcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHNldEZpbHRlclVwZGF0ZXIobmV3U3RhdGUsIHtcbiAgICBpZHg6IGZpbHRlcklkeCxcbiAgICBwcm9wOiAnbGF5ZXJJZCcsXG4gICAgdmFsdWU6IG5ld0xheWVySWRcbiAgfSk7XG59XG5cbi8qKlxuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLnNvcnRUYWJsZUNvbHVtblVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzb3J0VGFibGVDb2x1bW5VcGRhdGVyKHN0YXRlLCB7ZGF0YUlkLCBjb2x1bW4sIG1vZGV9KSB7XG4gIGNvbnN0IGRhdGFzZXQgPSBzdGF0ZS5kYXRhc2V0c1tkYXRhSWRdO1xuICBpZiAoIWRhdGFzZXQpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cbiAgbGV0IHNvcnRNb2RlID0gbW9kZTtcbiAgaWYgKCFzb3J0TW9kZSkge1xuICAgIGNvbnN0IGN1cnJlbnRNb2RlID0gZ2V0KGRhdGFzZXQsIFsnc29ydENvbHVtbicsIGNvbHVtbl0pO1xuICAgIC8vIEB0cy1pZ25vcmUgLSBzaG91bGQgYmUgZml4YWJsZSBpbiBhIFRTIGZpbGVcbiAgICBzb3J0TW9kZSA9IGN1cnJlbnRNb2RlXG4gICAgICA/IE9iamVjdC5rZXlzKFNPUlRfT1JERVIpLmZpbmQobSA9PiBtICE9PSBjdXJyZW50TW9kZSlcbiAgICAgIDogU09SVF9PUkRFUi5BU0NFTkRJTkc7XG4gIH1cblxuICBjb25zdCBzb3J0ZWQgPSBzb3J0RGF0YXNldEJ5Q29sdW1uKGRhdGFzZXQsIGNvbHVtbiwgc29ydE1vZGUpO1xuICByZXR1cm4gc2V0KFsnZGF0YXNldHMnLCBkYXRhSWRdLCBzb3J0ZWQsIHN0YXRlKTtcbn1cblxuLyoqXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVVcGRhdGVyc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykucGluVGFibGVDb2x1bW5VcGRhdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gcGluVGFibGVDb2x1bW5VcGRhdGVyKHN0YXRlLCB7ZGF0YUlkLCBjb2x1bW59KSB7XG4gIGNvbnN0IGRhdGFzZXQgPSBzdGF0ZS5kYXRhc2V0c1tkYXRhSWRdO1xuICBpZiAoIWRhdGFzZXQpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cbiAgY29uc3QgZmllbGQgPSBkYXRhc2V0LmZpZWxkcy5maW5kKGYgPT4gZi5uYW1lID09PSBjb2x1bW4pO1xuICBpZiAoIWZpZWxkKSB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgbGV0IHBpbm5lZENvbHVtbnM7XG4gIGlmIChBcnJheS5pc0FycmF5KGRhdGFzZXQucGlubmVkQ29sdW1ucykgJiYgZGF0YXNldC5waW5uZWRDb2x1bW5zLmluY2x1ZGVzKGZpZWxkLm5hbWUpKSB7XG4gICAgLy8gdW5waW4gaXRcbiAgICBwaW5uZWRDb2x1bW5zID0gZGF0YXNldC5waW5uZWRDb2x1bW5zLmZpbHRlcihjbyA9PiBjbyAhPT0gZmllbGQubmFtZSk7XG4gIH0gZWxzZSB7XG4gICAgcGlubmVkQ29sdW1ucyA9IChkYXRhc2V0LnBpbm5lZENvbHVtbnMgfHwgW10pLmNvbmNhdChmaWVsZC5uYW1lKTtcbiAgfVxuXG4gIHJldHVybiBzZXQoWydkYXRhc2V0cycsIGRhdGFJZCwgJ3Bpbm5lZENvbHVtbnMnXSwgcGlubmVkQ29sdW1ucywgc3RhdGUpO1xufVxuXG4vKipcbiAqIENvcHkgY29sdW1uIGNvbnRlbnQgYXMgc3RyaW5nc1xuICogQG1lbWJlcm9mIHZpc1N0YXRlVXBkYXRlcnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLmNvcHlUYWJsZUNvbHVtblVwZGF0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb3B5VGFibGVDb2x1bW5VcGRhdGVyKHN0YXRlLCB7ZGF0YUlkLCBjb2x1bW59KSB7XG4gIGNvbnN0IGRhdGFzZXQgPSBzdGF0ZS5kYXRhc2V0c1tkYXRhSWRdO1xuICBpZiAoIWRhdGFzZXQpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cbiAgY29uc3QgZmllbGRJZHggPSBkYXRhc2V0LmZpZWxkcy5maW5kSW5kZXgoZiA9PiBmLm5hbWUgPT09IGNvbHVtbik7XG4gIGlmIChmaWVsZElkeCA8IDApIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cbiAgY29uc3Qge3R5cGV9ID0gZGF0YXNldC5maWVsZHNbZmllbGRJZHhdO1xuICBjb25zdCB0ZXh0ID0gZGF0YXNldC5hbGxEYXRhLm1hcChkID0+IHBhcnNlRmllbGRWYWx1ZShkW2ZpZWxkSWR4XSwgdHlwZSkpLmpvaW4oJ1xcbicpO1xuXG4gIGNvcHkodGV4dCk7XG5cbiAgcmV0dXJuIHN0YXRlO1xufVxuXG4vKipcbiAqIFVwZGF0ZSBlZGl0b3JcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS11cGRhdGVycycpLnRvZ2dsZUVkaXRvclZpc2liaWxpdHlVcGRhdGVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9nZ2xlRWRpdG9yVmlzaWJpbGl0eVVwZGF0ZXIoc3RhdGUpIHtcbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBlZGl0b3I6IHtcbiAgICAgIC4uLnN0YXRlLmVkaXRvcixcbiAgICAgIHZpc2libGU6ICFzdGF0ZS5lZGl0b3IudmlzaWJsZVxuICAgIH1cbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldEZpbHRlckFuaW1hdGlvblRpbWVDb25maWdVcGRhdGVyKHN0YXRlLCB7aWR4LCBjb25maWd9KSB7XG4gIGNvbnN0IG9sZEZpbHRlciA9IHN0YXRlLmZpbHRlcnNbaWR4XTtcbiAgaWYgKCFvbGRGaWx0ZXIpIHtcbiAgICBDb25zb2xlLmVycm9yKGBmaWx0ZXJzLiR7aWR4fSBpcyB1bmRlZmluZWRgKTtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cbiAgaWYgKG9sZEZpbHRlci50eXBlICE9PSBGSUxURVJfVFlQRVMudGltZVJhbmdlKSB7XG4gICAgQ29uc29sZS5lcnJvcihcbiAgICAgIGBzZXRGaWx0ZXJBbmltYXRpb25UaW1lQ29uZmlnIGNhbiBvbmx5IGJlIGNhbGxlZCB0byB1cGRhdGUgYSB0aW1lIGZpbHRlci4gY2hlY2sgZmlsdGVyLnR5cGUgPT09ICd0aW1lUmFuZ2UnYFxuICAgICk7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgY29uc3QgdXBkYXRlcyA9IGNoZWNrVGltZUNvbmZpZ0FyZ3MoY29uZmlnKTtcblxuICByZXR1cm4gcGlja18oJ2ZpbHRlcnMnKShzd2FwXyhtZXJnZV8odXBkYXRlcykob2xkRmlsdGVyKSkpKHN0YXRlKTtcbn1cblxuZnVuY3Rpb24gY2hlY2tUaW1lQ29uZmlnQXJncyhjb25maWcpIHtcbiAgY29uc3QgYWxsb3dlZCA9IFsndGltZUZvcm1hdCcsICd0aW1lem9uZSddO1xuICByZXR1cm4gT2JqZWN0LmtleXMoY29uZmlnKS5yZWR1Y2UoKGFjY3UsIHByb3ApID0+IHtcbiAgICBpZiAoIWFsbG93ZWQuaW5jbHVkZXMocHJvcCkpIHtcbiAgICAgIENvbnNvbGUuZXJyb3IoXG4gICAgICAgIGBzZXRMYXllckFuaW1hdGlvblRpbWVDb25maWcgdGFrZXMgdGltZUZvcm1hdCBhbmQvb3IgdGltZXpvbmUgYXMgb3B0aW9ucywgZm91bmQgJHtwcm9wfWBcbiAgICAgICk7XG4gICAgICByZXR1cm4gYWNjdTtcbiAgICB9XG5cbiAgICAvLyBoZXJlIHdlIGFyZSBOT1QgY2hlY2tpbmcgaWYgdGltZXpvbmUgb3IgdGltZUZvcm1hdCBpbnB1dCBpcyB2YWxpZFxuICAgIGFjY3VbcHJvcF0gPSBjb25maWdbcHJvcF07XG4gICAgcmV0dXJuIGFjY3U7XG4gIH0sIHt9KTtcbn1cbi8qKlxuICogVXBkYXRlIGVkaXRvclxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLXVwZGF0ZXJzJykuc2V0TGF5ZXJBbmltYXRpb25UaW1lQ29uZmlnVXBkYXRlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldExheWVyQW5pbWF0aW9uVGltZUNvbmZpZ1VwZGF0ZXIoc3RhdGUsIHtjb25maWd9KSB7XG4gIGlmICghY29uZmlnKSB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG4gIGNvbnN0IHVwZGF0ZXMgPSBjaGVja1RpbWVDb25maWdBcmdzKGNvbmZpZyk7XG4gIHJldHVybiBwaWNrXygnYW5pbWF0aW9uQ29uZmlnJykobWVyZ2VfKHVwZGF0ZXMpKShzdGF0ZSk7XG59XG4iXX0=