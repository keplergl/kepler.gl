// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import bbox from '@turf/bbox';
import {console as Console} from 'global/window';
import {disableStackCapturing, withTask} from 'react-palm/tasks';
import cloneDeep from 'lodash.clonedeep';
import uniq from 'lodash.uniq';
import get from 'lodash.get';
import xor from 'lodash.xor';
import pick from 'lodash.pick';
import isEqual from 'lodash.isequal';
import copy from 'copy-to-clipboard';
import deepmerge from 'deepmerge';
// Tasks
import {LOAD_FILE_TASK, UNWRAP_TASK, PROCESS_FILE_DATA, DELAY_TASK} from '@kepler.gl/tasks';
// Actions
import {
  applyLayerConfig,
  layerConfigChange,
  layerTypeChange,
  layerVisConfigChange,
  layerVisualChannelConfigChange,
  loadFilesErr,
  loadFilesSuccess,
  loadFileStepSuccess,
  loadNextFile,
  nextFileBatch,
  ReceiveMapConfigPayload,
  VisStateActions,
  MapStateActions,
  processFileContent,
  ActionTypes
} from '@kepler.gl/actions';

// Utils
import {
  set,
  toArray,
  arrayInsert,
  generateHashId,
  isPlainObject,
  isObject,
  addNewLayersToSplitMap,
  computeSplitMapLayers,
  removeLayerFromSplitMaps,
  isRgbColor,
  parseFieldValue,
  applyFilterFieldName,
  applyFiltersToDatasets,
  featureToFilterValue,
  filterDatasetCPU,
  FILTER_UPDATER_PROPS,
  generatePolygonFilter,
  getDefaultFilter,
  getFilterIdInFeature,
  getTimeWidgetTitleFormatter,
  isInRange,
  LIMITED_FILTER_EFFECT_PROPS,
  updateFilterDataId,
  getFilterPlot,
  getDefaultFilterPlotType
} from '@kepler.gl/utils';

// Mergers
import {
  VIS_STATE_MERGERS,
  validateLayerWithData,
  createLayerFromConfig,
  serializeLayer,
  serializeVisState,
  parseLayerConfig
} from './vis-state-merger';
import {mergeStateFromMergers, isValidMerger} from './merger-handler';
import {Layer, LayerClasses, LAYER_ID_LENGTH} from '@kepler.gl/layers';
import {
  EDITOR_MODES,
  SORT_ORDER,
  FILTER_TYPES,
  FILTER_VIEW_TYPES,
  MAX_DEFAULT_TOOLTIPS,
  DEFAULT_TEXT_LABEL,
  COMPARE_TYPES
} from '@kepler.gl/constants';
import {
  pick_,
  merge_,
  swap_,
  apply_,
  compose_,
  removeElementAtIndex,
  filterOutById
} from './composer-helpers';

import KeplerGLSchema, {VisState, Merger, PostMergerPayload} from '@kepler.gl/schemas';

import {Filter, InteractionConfig, AnimationConfig, Editor, Field} from '@kepler.gl/types';
import {Loader} from '@loaders.gl/loader-utils';

import {calculateLayerData, findDefaultLayer, getLayerOrderFromLayers} from './layer-utils';
import {
  copyTableAndUpdate,
  Datasets,
  pinTableColumns,
  sortDatasetByColumn,
  assignGpuChannel,
  setFilterGpuMode,
  createNewDataEntry
} from '@kepler.gl/table';
import {findFieldsToShow} from './interaction-utils';
import {hasPropsToMerge, getPropValueToMerger} from './merger-handler';
import {mergeDatasetsByOrder} from './vis-state-merger';
import {fixEffectOrder} from '@kepler.gl/utils';
import {createEffect} from '@kepler.gl/effects';

// react-palm
// disable capture exception for react-palm call to withTask
disableStackCapturing();

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
const visStateUpdaters = null;
/* eslint-enable no-unused-vars */

export const defaultInteractionConfig: InteractionConfig = {
  tooltip: {
    id: 'tooltip',
    label: 'interactions.tooltip',
    enabled: true,
    config: {
      fieldsToShow: {},
      compareMode: false,
      compareType: COMPARE_TYPES.ABSOLUTE
    }
  },
  geocoder: {
    id: 'geocoder',
    label: 'interactions.geocoder',
    enabled: false,
    position: null
  },
  brush: {
    id: 'brush',
    label: 'interactions.brush',
    enabled: false,
    config: {
      // size is in km
      size: 0.5
    }
  },
  coordinate: {
    id: 'coordinate',
    label: 'interactions.coordinate',
    enabled: false,
    position: null
  }
};

export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  domain: null,
  currentTime: null,
  speed: 1,
  isAnimating: false,
  timeFormat: null,
  timezone: null,
  defaultTimeFormat: null,
  hideControl: false,
  duration: null
};

export const DEFAULT_EDITOR: Editor = {
  mode: EDITOR_MODES.DRAW_POLYGON,
  features: [],
  selectedFeature: null,
  visible: true
};

/**
 * Default initial `visState`
 * @memberof visStateUpdaters
 * @constant
 * @public
 */
export const INITIAL_VIS_STATE: VisState = {
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

  // effects
  effects: [],
  effectOrder: [],

  interactionConfig: defaultInteractionConfig,
  interactionToBeMerged: {},

  layerBlending: 'normal',
  overlayBlending: 'normal',
  hoverInfo: undefined,
  clicked: undefined,
  mousePos: {},
  maxDefaultTooltips: MAX_DEFAULT_TOOLTIPS,

  // this is used when user split maps
  splitMaps: [
    // this will contain a list of objects to
    // describe the state of layer availability and visibility for each map
    // [
    //   {
    //      layers: {layer_id: true | false}
    //   }
    // ]
  ],
  splitMapsToBeMerged: [],
  isMergingDatasets: {},
  // defaults layer classes
  layerClasses: LayerClasses,

  // default animation
  // time in unix timestamp (milliseconds) (the number of seconds since the Unix Epoch)
  animationConfig: DEFAULT_ANIMATION_CONFIG,

  editor: DEFAULT_EDITOR,

  fileLoading: false,
  fileLoadingProgress: {},

  loaders: [],
  loadOptions: {},

  // visStateMergers
  mergers: VIS_STATE_MERGERS,

  // kepler schemas
  schema: KeplerGLSchema
};

type UpdateStateWithLayerAndDataType = {
  layers: Layer[];
  layerData: any[];
};

/**
 * Update state with updated layer and layerData
 *
 */
export function updateStateWithLayerAndData<S extends UpdateStateWithLayerAndDataType>(
  state: S,
  {layerData, layer, idx}: {layerData?: any; layer: Layer; idx: number}
): S {
  return {
    ...state,
    layers: state.layers.map((lyr, i) => (i === idx ? layer : lyr)),
    layerData: layerData
      ? state.layerData.map((d, i) => (i === idx ? layerData : d))
      : state.layerData
  };
}

export function updateStateOnLayerVisibilityChange<S extends VisState>(state: S, layer: Layer): S {
  let newState = state;
  if (state.splitMaps.length) {
    newState = {
      ...state,
      splitMaps: layer.config.isVisible
        ? addNewLayersToSplitMap(state.splitMaps, layer)
        : removeLayerFromSplitMaps(state.splitMaps, layer)
    };
  }

  if (layer.config.animation.enabled) {
    newState = updateAnimationDomain(state);
  }

  return newState;
}

/**
 * Compares two objects (or arrays) and returns a new object with only the
 * properties that have changed between the two objects.
 */
function pickChangedProps<T>(prev: T, next: T): Partial<T> {
  const changedProps: Partial<T> = {};
  const pickPropsOf = obj => {
    Object.keys(obj).forEach(key => {
      if (!changedProps.hasOwnProperty(key) && !isEqual(prev[key], next[key])) {
        changedProps[key] = next[key];
      }
    });
  };
  pickPropsOf(prev);
  pickPropsOf(next);
  return changedProps;
}

const VISUAL_CHANNEL_PROP_TYPES = ['field', 'scale', 'domain', 'aggregation'];

/**
 * Apply layer config
 * @memberof visStateUpdaters
 * @returns nextState
 */
// eslint-disable-next-line complexity, max-statements
export function applyLayerConfigUpdater(
  state: VisState,
  action: VisStateActions.ApplyLayerConfigUpdaterAction
): VisState {
  const {oldLayerId, newLayerConfig, layerIndex} = action;
  const newParsedLayer =
    // will move visualChannels to the config prop
    parseLayerConfig(state.schema, newLayerConfig);
  const oldLayer = state.layers.find(l => l.id === oldLayerId);
  if (!oldLayer || !newParsedLayer) {
    return state;
  }
  if (layerIndex !== null && layerIndex !== undefined && state.layers[layerIndex] !== oldLayer) {
    // layerIndex is provided, but it doesn't match the oldLayer
    return state;
  }
  const dataset = state.datasets[newParsedLayer.config.dataId];
  if (!dataset) {
    return state;
  }
  // Make sure the layer is valid and convert it to Layer
  const newLayer = validateLayerWithData(dataset, newParsedLayer, state.layerClasses);
  if (!newLayer) {
    return state;
  }

  let nextState = state;

  if (newLayer.type && newLayer.type !== oldLayer.type) {
    const oldLayerIndex = state.layers.findIndex(l => l.id === oldLayerId);
    if (oldLayerIndex >= 0) {
      nextState = layerTypeChangeUpdater(nextState, layerTypeChange(oldLayer, newLayer.type));
      // layerTypeChangeUpdater changes the id of the layer, so we need to obtain the new id
      // but first make sure that the layer was not removed
      if (nextState.layers.length === state.layers.length) {
        const newLayerId = nextState.layers[oldLayerIndex].id;
        nextState = applyLayerConfigUpdater(
          nextState,
          applyLayerConfig(newLayerId, {...newLayerConfig, id: newLayerId})
        );
      }
    }
    return nextState;
  }

  // serializeLayer() might return null if the old layer is not valid,
  // we should still apply the changes in that case
  const serializedOldLayer = serializeLayer(oldLayer, state.schema) ?? {config: {}};
  const serializedNewLayer = serializeLayer(newLayer, state.schema);
  if (!serializedNewLayer) {
    return state;
  }
  if (!isEqual(serializedOldLayer, serializedNewLayer)) {
    const changed = pickChangedProps(serializedOldLayer.config, serializedNewLayer.config);

    if ('visConfig' in changed) {
      if (changed.visConfig) {
        nextState = layerVisConfigChangeUpdater(
          nextState,
          layerVisConfigChange(oldLayer, changed.visConfig)
        );
      }
      delete changed.visConfig;
    }

    Object.keys(oldLayer.visualChannels).forEach(channelName => {
      const channel = oldLayer.visualChannels[channelName];
      const channelPropNames = VISUAL_CHANNEL_PROP_TYPES.map(prop => channel[prop]);
      if (channelPropNames.some(prop => prop in changed)) {
        nextState = layerVisualChannelChangeUpdater(
          nextState,
          layerVisualChannelConfigChange(
            oldLayer,
            pick(newLayer.config, channelPropNames),
            channelName
          )
        );
        for (const prop of channelPropNames) {
          delete changed[prop];
        }
      }
    });

    if (Object.keys(changed).length > 0) {
      nextState = layerConfigChangeUpdater(
        nextState,
        layerConfigChange(oldLayer, pick(newLayer.config, Object.keys(changed)))
      );
    }
  }

  return nextState;
}

/**
 * Update layer base config: dataId, label, column, isVisible
 * @memberof visStateUpdaters
 * @returns nextState
 */
// eslint-disable-next-line complexity
export function layerConfigChangeUpdater(
  state: VisState,
  action: VisStateActions.LayerConfigChangeUpdaterAction
): VisState {
  const {oldLayer} = action;
  const idx = state.layers.findIndex(l => l.id === oldLayer.id);
  const props = Object.keys(action.newConfig);
  if (
    typeof action.newConfig.dataId === 'string' &&
    action.newConfig.dataId !== oldLayer.config.dataId
  ) {
    const {dataId, ...restConfig} = action.newConfig;
    const stateWithDataId = layerDataIdChangeUpdater(state, {
      oldLayer,
      newConfig: {dataId}
    });
    const nextLayer = stateWithDataId.layers.find(l => l.id === oldLayer.id);
    return nextLayer && Object.keys(restConfig).length
      ? layerConfigChangeUpdater(stateWithDataId, {oldLayer: nextLayer, newConfig: restConfig})
      : stateWithDataId;
  }

  let newLayer = oldLayer.updateLayerConfig(action.newConfig);

  let layerData;

  if (newLayer.shouldCalculateLayerData(props)) {
    const oldLayerData = state.layerData[idx];

    const updateLayerDataResult = calculateLayerData(newLayer, state, oldLayerData);
    newLayer = updateLayerDataResult.layer;
    layerData = updateLayerDataResult.layerData;
  }

  let newState = state;
  if ('isVisible' in action.newConfig) {
    newState = updateStateOnLayerVisibilityChange(state, newLayer);
  }

  return updateStateWithLayerAndData(newState, {
    layer: newLayer,
    layerData,
    idx
  });
}

/**
 * Updates isValid flag of a layer.
 * Updates isVisible based on the value of isValid.
 * Triggers update of data for the layer in order to get errors again during next update iteration.
 * @memberof visStateUpdaters
 * @returns nextState
 */
export function layerSetIsValidUpdater(
  state: VisState,
  action: VisStateActions.LayerSetIsValidUpdaterAction
): VisState {
  const {oldLayer, isValid} = action;

  const idx = state.layers.findIndex(l => l.id === oldLayer.id);
  const layerToUpdate = state.layers[idx];
  if (layerToUpdate) {
    let newLayer;
    let newData = null;

    if (isValid) {
      // Trigger data update in order to show errors again if present.
      const {layer, layerData} = calculateLayerData(layerToUpdate, state, undefined);
      newLayer = layer;
      newData = layerData;
    } else {
      newLayer = layerToUpdate.updateLayerConfig({
        isVisible: false
      });
      newLayer.isValid = false;
    }

    return updateStateWithLayerAndData(state, {idx, layer: newLayer, layerData: newData});
  }

  return state;
}

function addOrRemoveTextLabels(newFields, textLabel, defaultTextLabel = DEFAULT_TEXT_LABEL) {
  let newTextLabel = textLabel.slice();

  const currentFields = textLabel.map(tl => tl.field && tl.field.name).filter(d => d);

  const addFields = newFields.filter(f => !currentFields.includes(f.name));
  const deleteFields = currentFields.filter(f => !newFields.find(fd => fd.name === f));

  // delete
  newTextLabel = newTextLabel.filter(tl => tl.field && !deleteFields.includes(tl.field.name));
  newTextLabel = !newTextLabel.length ? [defaultTextLabel] : newTextLabel;

  // add
  newTextLabel = [
    ...newTextLabel.filter(tl => tl.field),
    ...addFields.map(af => ({
      ...defaultTextLabel,
      field: af
    }))
  ];

  return newTextLabel;
}

function updateTextLabelPropAndValue(idx, prop, value, textLabel) {
  if (!textLabel[idx].hasOwnProperty(prop)) {
    return textLabel;
  }

  let newTextLabel = textLabel.slice();

  if (prop === 'field' && value === null && textLabel.length > 1) {
    // remove label when field value is set to null
    newTextLabel.splice(idx, 1);
  } else if (prop) {
    newTextLabel = textLabel.map((tl, i) => (i === idx ? {...tl, [prop]: value} : tl));
  }

  return newTextLabel;
}

/**
 * Update layer base config: dataId, label, column, isVisible
 * @memberof visStateUpdaters
 * @returns nextState
 */
export function layerTextLabelChangeUpdater(
  state: VisState,
  action: VisStateActions.LayerTextLabelChangeUpdaterAction
): VisState {
  const {oldLayer, idx, prop, value} = action;
  const {textLabel} = oldLayer.config;

  // when adding a new empty text label,
  // rely on the layer's default config, or use the constant DEFAULT_TEXT_LABEL
  const defaultTextLabel =
    oldLayer.getDefaultLayerConfig({dataId: ''})?.textLabel?.[0] ?? DEFAULT_TEXT_LABEL;

  let newTextLabel = textLabel.slice();
  if (!textLabel[idx] && idx === textLabel.length) {
    // if idx is set to length, add empty text label
    newTextLabel = [...textLabel, defaultTextLabel];
  }

  if (idx === 'all' && prop === 'fields') {
    newTextLabel = addOrRemoveTextLabels(value, textLabel, defaultTextLabel);
  } else {
    newTextLabel = updateTextLabelPropAndValue(idx, prop, value, newTextLabel);
  }
  // update text label prop and value
  return layerConfigChangeUpdater(state, {
    oldLayer,
    newConfig: {textLabel: newTextLabel}
  });
}

function validateExistingLayerWithData(dataset, layerClasses, layer, schema) {
  const loadedLayer = serializeLayer(layer, schema);
  return loadedLayer
    ? validateLayerWithData(dataset, loadedLayer, layerClasses, {
        allowEmptyColumn: true
      })
    : null;
}

/**
 * Update layer config dataId
 * @memberof visStateUpdaters
 * @returns nextState
 */
export function layerDataIdChangeUpdater(
  state: VisState,
  action: {
    oldLayer: Layer;
    newConfig: {
      dataId: string;
    };
  }
): VisState {
  const {oldLayer, newConfig} = action;
  const {dataId} = newConfig;

  if (!oldLayer || !state.datasets[dataId]) {
    return state;
  }
  const idx = state.layers.findIndex(l => l.id === oldLayer.id);

  let newLayer = oldLayer.updateLayerConfig({dataId});
  // this may happen when a layer is new (type: null and no columns) but it's not ready to be saved
  if (newLayer.isValidToSave()) {
    const validated = validateExistingLayerWithData(
      state.datasets[dataId],
      state.layerClasses,
      newLayer,
      state.schema
    );
    // if cant validate it with data create a new one
    if (!validated) {
      // @ts-expect-error TODO: checking oldLayer.type !== null
      newLayer = new state.layerClasses[oldLayer.type]({dataId, id: oldLayer.id});
    } else {
      newLayer = validated;
    }
  }

  newLayer = newLayer.updateLayerConfig({
    isVisible: oldLayer.config.isVisible,
    isConfigActive: true
  });

  newLayer.updateLayerDomain(state.datasets);
  const {layerData, layer} = calculateLayerData(newLayer, state, undefined);

  return updateStateWithLayerAndData(state, {layerData, layer, idx});
}

export function setInitialLayerConfig(layer, datasets, layerClasses): Layer {
  let newLayer = layer;
  if (!Object.keys(datasets).length) {
    // no data is loaded
    return layer;
  }
  if (!layer.config.dataId) {
    // set layer dataId
    newLayer = layer.updateLayerConfig({dataId: Object.keys(datasets)[0]});
  }
  const dataset = datasets[newLayer.config.dataId];
  if (!dataset) {
    return layer;
  }

  // find defaut layer props
  const result =
    typeof layerClasses[newLayer.type].findDefaultLayerProps === 'function'
      ? layerClasses[newLayer.type].findDefaultLayerProps(dataset, [])
      : {props: []};

  // an array of possible props, use 1st one
  const props = Array.isArray(result) ? result : result.props || [];

  if (props.length) {
    newLayer = new layerClasses[layer.type]({
      ...props[0],
      label: newLayer.config.label,
      dataId: newLayer.config.dataId,
      isVisible: true,
      isConfigActive: newLayer.config.isConfigActive
    });

    return typeof newLayer.setInitialLayerConfig === 'function'
      ? newLayer.setInitialLayerConfig(dataset)
      : newLayer;
  }

  return newLayer;
}
/**
 * Update layer type. Previews layer config will be copied if applicable.
 * @memberof visStateUpdaters
 * @public
 */
export function layerTypeChangeUpdater(
  state: VisState,
  action: VisStateActions.LayerTypeChangeUpdaterAction
): VisState {
  const {oldLayer, newType} = action;
  if (!oldLayer) {
    return state;
  }
  const oldId = oldLayer.id;
  const idx = state.layers.findIndex(l => l.id === oldId);

  if (!state.layerClasses[newType]) {
    Console.error(`${newType} is not a valid layer type`);
    return state;
  }
  let newLayer = new state.layerClasses[newType]({
    // keep old layer lable and isConfigActive
    label: oldLayer.config.label,
    isConfigActive: oldLayer.config.isConfigActive,
    dataId: oldLayer.config.dataId
  });

  if (!oldLayer.type) {
    // if setting layer type on an empty layer
    newLayer = setInitialLayerConfig(newLayer, state.datasets, state.layerClasses);
  } else {
    // get a mint layer, with new id and type
    // because deck.gl uses id to match between new and old layer.
    // If type has changed but id is the same, it will break
    newLayer.assignConfigToLayer(oldLayer.config, oldLayer.visConfigSettings);
    newLayer.updateLayerDomain(state.datasets);
  }

  const {clicked, hoverInfo} = state;

  let newState = {
    ...state,
    clicked: oldLayer.isLayerHovered(clicked) ? undefined : clicked,
    hoverInfo: oldLayer.isLayerHovered(hoverInfo) ? undefined : hoverInfo
  };

  const {layerData, layer} = calculateLayerData(newLayer, newState);
  newState = updateStateWithLayerAndData(newState, {layerData, layer, idx});

  if (layer.config.animation.enabled || oldLayer.config.animation.enabled) {
    newState = updateAnimationDomain(newState);
  }

  // update splitMap layer id
  if (state.splitMaps.length) {
    newState = {
      ...newState,
      splitMaps: newState.splitMaps.map(settings => {
        const {[oldId]: oldLayerMap, ...otherLayers} = settings.layers;
        return oldId in settings.layers
          ? {
              ...settings,
              layers: {
                ...otherLayers,
                [layer.id]: oldLayerMap
              }
            }
          : settings;
      })
    };
  }

  // update layerOrder with new id
  newState = {
    ...newState,
    layerOrder: newState.layerOrder.map(layerId =>
      layerId === oldLayer.id ? newLayer.id : layerId
    )
  };

  return newState;
}

/**
 * Update layer visual channel
 * @memberof visStateUpdaters
 * @returns {Object} nextState
 * @public
 */
export function layerVisualChannelChangeUpdater(
  state: VisState,
  action: VisStateActions.LayerVisualChannelConfigChangeUpdaterAction
): VisState {
  const {oldLayer, newConfig, channel} = action;
  if (!oldLayer.config.dataId) {
    return state;
  }
  const dataset = state.datasets[oldLayer.config.dataId];

  const idx = state.layers.findIndex(l => l.id === oldLayer.id);
  const newLayer = oldLayer.updateLayerConfig(newConfig);

  newLayer.updateLayerVisualChannel(dataset, channel);

  const oldLayerData = state.layerData[idx];
  const {layerData, layer} = calculateLayerData(newLayer, state, oldLayerData);

  return updateStateWithLayerAndData(state, {layerData, layer, idx});
}

/**
 * Update layer `visConfig`
 * @memberof visStateUpdaters
 * @public
 */
export function layerVisConfigChangeUpdater(
  state: VisState,
  action: VisStateActions.LayerVisConfigChangeUpdaterAction
): VisState {
  const {oldLayer} = action;
  const idx = state.layers.findIndex(l => l.id === oldLayer.id);
  const props = Object.keys(action.newVisConfig);
  const newVisConfig = {
    ...oldLayer.config.visConfig,
    ...action.newVisConfig
  };

  const newLayer = oldLayer.updateLayerConfig({visConfig: newVisConfig});

  if (newLayer.shouldCalculateLayerData(props)) {
    const oldLayerData = state.layerData[idx];
    const {layerData, layer} = calculateLayerData(newLayer, state, oldLayerData);
    return updateStateWithLayerAndData(state, {layerData, layer, idx});
  }

  return updateStateWithLayerAndData(state, {layer: newLayer, idx});
}

/**
 * Update filter property
 * @memberof visStateUpdaters
 * @public
 */
export function setFilterAnimationTimeUpdater(
  state: VisState,
  action: VisStateActions.SetFilterAnimationTimeUpdaterAction
): VisState {
  return setFilterUpdater(state, action);
}

/**
 * Update filter animation window
 * @memberof visStateUpdaters
 * @public
 */
export function setFilterAnimationWindowUpdater(
  state: VisState,
  {id, animationWindow}: VisStateActions.SetFilterAnimationWindowUpdaterAction
): VisState {
  return {
    ...state,
    filters: state.filters.map(f =>
      f.id === id
        ? {
            ...f,
            animationWindow
          }
        : f
    )
  };
}
/**
 * Update filter property
 * @memberof visStateUpdaters
 * @public
 */
export function setFilterUpdater(
  state: VisState,
  action: VisStateActions.SetFilterUpdaterAction
): VisState {
  const {idx, prop, value, valueIndex = 0} = action;
  const oldFilter = state.filters[idx];

  if (!oldFilter) {
    Console.error(`filters.${idx} is undefined`);
    return state;
  }
  let newFilter = set([prop], value, oldFilter);
  let newState = state;

  const {dataId} = newFilter;

  // Ensuring backward compatibility
  let datasetIds = toArray(dataId);

  switch (prop) {
    // TODO: Next PR for UI if we update dataId, we need to consider two cases:
    // 1. dataId is empty: create a default filter
    // 2. Add a new dataset id
    case FILTER_UPDATER_PROPS.dataId:
      // if trying to update filter dataId. create an empty new filter
      newFilter = updateFilterDataId(dataId);
      break;

    case FILTER_UPDATER_PROPS.name:
      // we are supporting the current functionality
      // TODO: Next PR for UI filter name will only update filter name but it won't have side effects
      // we are gonna use pair of datasets and fieldIdx to update the filter
      const datasetId = newFilter.dataId[valueIndex];
      const {filter: updatedFilter, dataset: newDataset} = applyFilterFieldName(
        newFilter,
        state.datasets[datasetId],
        value,
        valueIndex,
        {mergeDomain: false}
      );
      if (!updatedFilter) {
        return state;
      }

      newFilter = updatedFilter;

      if (newFilter.gpu) {
        newFilter = setFilterGpuMode(newFilter, state.filters);
        newFilter = assignGpuChannel(newFilter, state.filters);
      }

      newState = set(['datasets', datasetId], newDataset, state);

      // only filter the current dataset
      break;
    case FILTER_UPDATER_PROPS.layerId:
      // We need to update only datasetId/s if we have added/removed layers
      // - check for layerId changes (XOR works because of string values)
      // if no differences between layerIds, don't do any filtering
      // @ts-ignore
      const layerIdDifference = xor(newFilter.layerId, oldFilter.layerId);

      const layerDataIds = uniq<string>(
        layerIdDifference
          .map(lid =>
            get(
              state.layers.find(l => l.id === lid),
              ['config', 'dataId']
            )
          )
          .filter(d => d) as string[]
      );

      // only filter datasetsIds
      datasetIds = layerDataIds;

      // Update newFilter dataIds
      const newDataIds = uniq<string>(
        newFilter.layerId
          ?.map(lid =>
            get(
              state.layers.find(l => l.id === lid),
              ['config', 'dataId']
            )
          )
          .filter(d => d) as string[]
      );

      newFilter = {
        ...newFilter,
        dataId: newDataIds
      };

      break;
    default:
      break;
  }

  const enlargedFilter = state.filters.find(f => f.view === FILTER_VIEW_TYPES.enlarged);

  if (enlargedFilter && enlargedFilter.id !== newFilter.id) {
    // there should be only one enlarged filter
    newFilter.view = FILTER_VIEW_TYPES.side;
  }

  // save new filters to newState
  newState = set(['filters', idx], newFilter, newState);

  // if we are currently setting a prop that only requires to filter the current
  // dataset we will pass only the current dataset to applyFiltersToDatasets and
  // updateAllLayerDomainData otherwise we pass the all list of datasets as defined in dataId
  const datasetIdsToFilter = LIMITED_FILTER_EFFECT_PROPS[prop]
    ? [datasetIds[valueIndex]]
    : datasetIds;

  // filter data
  const filteredDatasets = applyFiltersToDatasets(
    datasetIdsToFilter,
    newState.datasets,
    newState.filters,
    newState.layers
  );

  newState = set(['datasets'], filteredDatasets, newState);
  // dataId is an array
  // pass only the dataset we need to update
  newState = updateAllLayerDomainData(newState, datasetIdsToFilter, newFilter);

  return newState;
}

/**
 * Set the property of a filter plot
 * @memberof visStateUpdaters
 * @public
 */
export const setFilterPlotUpdater = (
  state: VisState,
  {idx, newProp, valueIndex = 0}: VisStateActions.SetFilterPlotUpdaterAction
): VisState => {
  let newFilter = {...state.filters[idx], ...newProp};
  const prop = Object.keys(newProp)[0];
  if (prop === 'yAxis') {
    const plotType = getDefaultFilterPlotType(newFilter);
    // TODO: plot is not supported in multi dataset filter for now
    if (plotType) {
      newFilter = {
        ...newFilter,
        ...getFilterPlot({...newFilter, plotType}, state.datasets[newFilter.dataId[valueIndex]]),
        plotType
      };
    }
  }

  return {
    ...state,
    filters: state.filters.map((f, i) => (i === idx ? newFilter : f))
  };
};

/**
 * Add a new filter
 * @memberof visStateUpdaters
 * @public
 */
export const addFilterUpdater = (
  state: VisState,
  action: VisStateActions.AddFilterUpdaterAction
): VisState =>
  !action.dataId
    ? state
    : {
        ...state,
        filters: [...state.filters, getDefaultFilter({dataId: action.dataId, id: action.id})]
      };

/**
 * Set layer color palette ui state
 * @memberof visStateUpdaters
 */
export const layerColorUIChangeUpdater = (
  state: VisState,
  {oldLayer, prop, newConfig}: VisStateActions.LayerColorUIChangeUpdaterAction
): VisState => {
  const oldVixConfig = oldLayer.config.visConfig[prop];
  const newLayer = oldLayer.updateLayerColorUI(prop, newConfig);
  const newVisConfig = newLayer.config.visConfig[prop];
  if (oldVixConfig !== newVisConfig) {
    return layerVisConfigChangeUpdater(state, {
      oldLayer,
      newVisConfig: {
        [prop]: newVisConfig
      }
    });
  }
  return {
    ...state,
    layers: state.layers.map(l => (l.id === oldLayer.id ? newLayer : l))
  };
};

/**
 * Start and end filter animation
 * @memberof visStateUpdaters
 * @public
 */
export const toggleFilterAnimationUpdater = (
  state: VisState,
  action: VisStateActions.ToggleFilterAnimationUpdaterAction
): VisState => ({
  ...state,
  filters: state.filters.map((f, i) => (i === action.idx ? {...f, isAnimating: !f.isAnimating} : f))
});

/**
 * @memberof visStateUpdaters
 * @public
 */
export const toggleLayerAnimationUpdater = (
  state: VisState,
  action: VisStateActions.ToggleLayerAnimationUpdaterAction
): VisState => ({
  ...state,
  animationConfig: {
    ...state.animationConfig,
    isAnimating: !state.animationConfig.isAnimating
  }
});

/**
 * Hide and show layer animation control
 * @memberof visStateUpdaters
 * @public
 */
export const toggleLayerAnimationControlUpdater = (
  state: VisState,
  action: VisStateActions.ToggleLayerAnimationControlUpdaterAction
): VisState => ({
  ...state,
  animationConfig: {
    ...state.animationConfig,
    hideControl: !state.animationConfig.hideControl
  }
});

/**
 * Change filter animation speed
 * @memberof visStateUpdaters
 * @public
 */
export const updateFilterAnimationSpeedUpdater = (
  state: VisState,
  action: VisStateActions.UpdateFilterAnimationSpeedUpdaterAction
): VisState => ({
  ...state,
  filters: state.filters.map((f, i) => (i === action.idx ? {...f, speed: action.speed} : f))
});

/**
 * Reset animation config current time to a specified value
 * @memberof visStateUpdaters
 * @public
 *
 */
export const setLayerAnimationTimeUpdater = (
  state: VisState,
  {value}: VisStateActions.SetLayerAnimationTimeUpdaterAction
): VisState => ({
  ...state,
  animationConfig: {
    ...state.animationConfig,
    currentTime: value
  }
});

/**
 * Update animation speed with the vertical speed slider
 * @memberof visStateUpdaters
 * @public
 *
 */
export const updateLayerAnimationSpeedUpdater = (
  state: VisState,
  {speed}: VisStateActions.UpdateLayerAnimationSpeedUpdaterAction
): VisState => {
  return {
    ...state,
    animationConfig: {
      ...state.animationConfig,
      speed
    }
  };
};

/**
 * Show larger time filter at bottom for time playback (apply to time filter only)
 * @memberof visStateUpdaters
 * @public
 */
export const setFilterViewUpdater = (
  state: VisState,
  action: VisStateActions.SetFilterViewUpdaterAction
) => {
  const {view, idx} = action;
  const shouldResetOtherFiltersView = view === FILTER_VIEW_TYPES.enlarged;
  return {
    ...state,
    filters: state.filters.map((f, i) =>
      i === idx
        ? {
            ...f,
            view
          }
        : shouldResetOtherFiltersView
        ? {
            ...f,
            view: FILTER_VIEW_TYPES.side
          }
        : f
    )
  };
};

/**
 * Toggles filter feature visibility
 * @memberof visStateUpdaters
 */
export const toggleFilterFeatureUpdater = (
  state: VisState,
  action: VisStateActions.ToggleFilterFeatureUpdaterAction
): VisState => {
  const filter = state.filters[action.idx];
  const isVisible = get(filter, ['value', 'properties', 'isVisible']);

  let newState = setFilterUpdater(state, {
    idx: action.idx,
    prop: 'enabled',
    value: !isVisible
  });

  newState = setFilterUpdater(newState, {
    idx: action.idx,
    prop: 'value',
    value: featureToFilterValue(filter.value, filter.id, {
      isVisible: !isVisible
    })
  });

  return newState;
};

/**
 * Remove a filter
 * @memberof visStateUpdaters
 * @public
 */
export const removeFilterUpdater = (
  state: VisState,
  action: VisStateActions.RemoveFilterUpdaterAction
): VisState => {
  const {idx} = action;
  const {dataId, id} = state.filters[idx];

  const newFilters = [
    ...state.filters.slice(0, idx),
    ...state.filters.slice(idx + 1, state.filters.length)
  ];

  const filteredDatasets = applyFiltersToDatasets(dataId, state.datasets, newFilters, state.layers);
  const newEditor =
    getFilterIdInFeature(state.editor.selectedFeature) === id
      ? {
          ...state.editor,
          selectedFeature: null
        }
      : state.editor;

  let newState = set(['filters'], newFilters, state);
  newState = set(['datasets'], filteredDatasets, newState);
  newState = set(['editor'], newEditor, newState);

  return updateAllLayerDomainData(newState, dataId, undefined);
};

/**
 * Add a new layer
 * @memberof visStateUpdaters
 * @public
 */
export const addLayerUpdater = (
  state: VisState,
  action: VisStateActions.AddLayerUpdaterAction
): VisState => {
  let newLayer;
  let newLayerData;
  if (action.config) {
    newLayer = createLayerFromConfig(state, action.config);
    if (!newLayer) {
      Console.warn(
        'Failed to create layer from config, it usually means the config is not be in correct format',
        action.config
      );
      return state;
    }

    const result = calculateLayerData(newLayer, state);
    newLayer = result.layer;
    newLayerData = result.layerData;
  } else {
    // create an empty layer with a specific dataset or a default one
    const defaultDataset = action.datasetId ?? Object.keys(state.datasets)[0];
    newLayer = new Layer({
      isVisible: true,
      isConfigActive: true,
      dataId: defaultDataset
    });
    newLayerData = {};
  }

  let newState = {
    ...state,
    layers: [...state.layers, newLayer],
    layerData: [...state.layerData, newLayerData],
    // add new layer at the top
    layerOrder: [newLayer.id, ...state.layerOrder],
    splitMaps: addNewLayersToSplitMap(state.splitMaps, newLayer)
  };

  if (newLayer.config.animation.enabled) {
    newState = updateAnimationDomain(newState);
  }

  return newState;
};

/**
 * remove layer
 * @memberof visStateUpdaters
 * @public
 */
export function removeLayerUpdater<T extends VisState>(
  state: T,
  {id}: VisStateActions.RemoveLayerUpdaterAction
): T {
  const idx = Number.isFinite(id)
    ? // support older API, remove layer by idx
      Number(id)
    : state.layers.findIndex(l => l.id === id);
  if (idx < 0 || idx >= state.layers.length) {
    // invalid index
    Console.warn(`can not remove layer with invalid id|idx ${id}`);
    return state;
  }

  const {layers, layerData, layerOrder, clicked, hoverInfo} = state;
  const layerToRemove = layers[idx];
  const newState = {
    ...state,
    layers: filterOutById(layerToRemove.id)(layers),
    layerData: removeElementAtIndex(idx)(layerData),
    layerOrder: layerOrder.filter(layerId => layerId !== layerToRemove.id),
    clicked: layerToRemove.isLayerHovered(clicked) ? undefined : clicked,
    hoverInfo: layerToRemove.isLayerHovered(hoverInfo) ? undefined : hoverInfo,
    splitMaps: removeLayerFromSplitMaps(state.splitMaps, layerToRemove)
    // TODO: update filters, create helper to remove layer form filter (remove layerid and dataid) if mapped
  };

  return updateAnimationDomain(newState);
}

/**
 * Reorder layer
 * @memberof visStateUpdaters
 * @public
 */
export const reorderLayerUpdater = (
  state: VisState,
  {order}: VisStateActions.ReorderLayerUpdaterAction
): VisState => ({
  ...state,
  layerOrder: order
});

/**
 * duplicate layer
 * @memberof visStateUpdaters
 * @public
 */
export const duplicateLayerUpdater = (
  state: VisState,
  {id}: VisStateActions.DuplicateLayerUpdaterAction
): VisState => {
  const idx = Number.isFinite(id)
    ? // support older API, remove layer by idx
      Number(id)
    : state.layers.findIndex(l => l.id === id);
  if (idx < 0 || !state.layers[idx]) {
    Console.warn(`layer ${idx} not found in layerOrder`);
    return state;
  }

  const {layers} = state;
  const original = layers[idx];

  const originalLayerOrderIdx = state.layerOrder.findIndex(lid => lid === original.id);
  let newLabel = `Copy of ${original.config.label}`;
  let postfix = 0;
  // eslint-disable-next-line no-loop-func
  while (layers.find(l => l.config.label === newLabel)) {
    newLabel = `Copy of ${original.config.label} ${++postfix}`;
  }

  // collect layer config from original
  const loadedLayer = serializeLayer(original, state.schema);

  // assign new id and label to copied layer
  if (!loadedLayer?.config) {
    return state;
  }
  loadedLayer.config.label = newLabel;
  loadedLayer.id = generateHashId(LAYER_ID_LENGTH);

  // add layer to state
  let nextState = addLayerUpdater(state, {config: loadedLayer});
  // retrieve newly created layer
  const newLayer = nextState.layers[nextState.layers.length - 1];
  // update layer order with newLyaer.id
  const newLayerOrder = arrayInsert(
    nextState.layerOrder.slice(1, nextState.layerOrder.length),
    originalLayerOrderIdx,
    newLayer.id
  );

  nextState = reorderLayerUpdater(nextState, {order: newLayerOrder});

  return updateAnimationDomain(nextState);
};

/**
 * Add a new effect
 * @memberof visStateUpdaters
 * @public
 */
export const addEffectUpdater = (
  state: VisState,
  action: VisStateActions.AddEffectUpdaterAction
): VisState => {
  const newEffect = createEffect(action.config);

  // collapse configurators for other effects
  state.effects.forEach(effect => effect.setProps({isConfigActive: false}));

  const effects = [...state.effects, newEffect];
  const effectOrder = fixEffectOrder(effects, [newEffect.id, ...state.effectOrder]);

  return {
    ...state,
    effects,
    effectOrder
  };
};

/**
 * remove effect
 * @memberof visStateUpdaters
 * @public
 */
export const removeEffectUpdater = (
  state: VisState,
  {id}: VisStateActions.RemoveEffectUpdaterAction
): VisState => {
  const idx = state.effects.findIndex(l => l.id === id);
  if (idx < 0 || idx >= state.effects.length) {
    Console.warn(`can not remove effect with invalid id ${id}`);
    return state;
  }

  const {effects, effectOrder} = state;
  const effectToRemove = effects[idx];
  return {
    ...state,
    // @ts-expect-error fixed in ts
    effects: filterOutById(effectToRemove.id)(effects),
    effectOrder: effectOrder.filter(effectId => effectId !== effectToRemove.id)
  };
};

/**
 * Reorder effect
 * @memberof visStateUpdaters
 * @public
 */
export const reorderEffectUpdater = (
  state: VisState,
  {order}: VisStateActions.ReorderEffectUpdaterAction
): VisState => ({
  ...state,
  effectOrder: fixEffectOrder(state.effects, [...order])
});

/**
 * Update effect
 * @memberof visStateUpdaters
 * @public
 */
export const updateEffectUpdater = (
  state: VisState,
  {id, props}: VisStateActions.UpdateEffectUpdaterAction
): VisState => {
  const idx = state.effects.findIndex(l => l.id === id);
  if (idx < 0 || idx >= state.effects.length) {
    Console.warn(`can not update effect with invalid id ${id}`);
    return state;
  }

  let effectOrder = state.effectOrder;
  if (props.id !== undefined && props.id !== id) {
    const idx2 = state.effects.findIndex(l => l.id === props.id);
    if (idx2 >= 0) {
      Console.warn(`can not update effect with existing effect id ${id}`);
      return state;
    }

    effectOrder = effectOrder.map(effectOrderId =>
      effectOrderId === id ? (props.id as string) : effectOrderId
    );
  }

  const newEffects = [...state.effects];
  newEffects[idx].setProps(props);

  return {
    ...state,
    effects: newEffects,
    effectOrder
  };
};

/**
 * Remove a dataset and all layers, filters, tooltip configs that based on it
 * @memberof visStateUpdaters
 * @public
 */
export function removeDatasetUpdater<T extends VisState>(
  state: T,
  action: VisStateActions.RemoveDatasetUpdaterAction
): T {
  // extract dataset key
  const {dataId: datasetKey} = action;
  const {datasets} = state;

  // check if dataset is present
  if (!datasets[datasetKey]) {
    return state;
  }

  /* eslint-disable no-unused-vars */
  const {
    layers,
    datasets: {[datasetKey]: dataset, ...newDatasets}
  } = state;
  /* eslint-enable no-unused-vars */

  const layersToRemove = layers.filter(l => l.config.dataId === datasetKey).map(l => l.id);

  // remove layers and datasets
  let newState = layersToRemove.reduce((accu, id) => removeLayerUpdater(accu, {id}), {
    ...state,
    datasets: newDatasets
  });

  // remove filters
  const filters = newState.filters.filter(filter => !filter.dataId.includes(datasetKey));

  newState = {...newState, filters};

  return removeDatasetFromInteractionConfig(newState, {dataId: datasetKey});
}

function removeDatasetFromInteractionConfig(state, {dataId}) {
  let {interactionConfig} = state;
  const {tooltip} = interactionConfig;
  if (tooltip) {
    const {config} = tooltip;
    /* eslint-disable no-unused-vars */
    const {[dataId]: fields, ...fieldsToShow} = config.fieldsToShow;
    /* eslint-enable no-unused-vars */
    interactionConfig = {
      ...interactionConfig,
      tooltip: {...tooltip, config: {...config, fieldsToShow}}
    };
  }

  return {...state, interactionConfig};
}
/**
 * update layer blending mode
 * @memberof visStateUpdaters
 * @public
 */
export const updateLayerBlendingUpdater = (
  state: VisState,
  action: VisStateActions.UpdateLayerBlendingUpdaterAction
): VisState => ({
  ...state,
  layerBlending: action.mode
});

/**
 * update overlay blending mode
 * @memberof visStateUpdaters
 * @public
 */
export const updateOverlayBlendingUpdater = (
  state: VisState,
  action: VisStateActions.UpdateOverlayBlendingUpdaterAction
): VisState => ({
  ...state,
  overlayBlending: action.mode
});

/**
 * Display dataset table in a modal
 * @memberof visStateUpdaters
 * @public
 */
export const showDatasetTableUpdater = (
  state: VisState,
  action: VisStateActions.ShowDatasetTableUpdaterAction
): VisState => {
  return {
    ...state,
    editingDataset: action.dataId
  };
};

/**
 * Add custom color for datasets and layers
 * @memberof visStateUpdaters
 * @public
 */
export const updateTableColorUpdater = (
  state: VisState,
  action: VisStateActions.UpdateDatasetColorUpdater
): VisState => {
  return updateDatasetPropsUpdater(state, {dataId: action.dataId, props: {color: action.newColor}});
};

/**
 * reset visState to initial State
 * @memberof visStateUpdaters
 * @public
 */
export const resetMapConfigUpdater = (state: VisState): VisState => ({
  ...INITIAL_VIS_STATE,
  ...state.initialState,
  initialState: state.initialState
});

/**
 * Propagate `visState` reducer with a new configuration. Current config will be override.
 * @memberof visStateUpdaters
 * @public
 */
export const receiveMapConfigUpdater = (
  state: VisState,
  {
    payload: {config = {}, options = {}}
  }: {
    type?: typeof ActionTypes.RECEIVE_MAP_CONFIG;
    payload: ReceiveMapConfigPayload;
  }
): VisState => {
  if (!config.visState) {
    return state;
  }

  const {keepExistingConfig} = options;

  // reset config if keepExistingConfig is falsy
  let mergedState = !keepExistingConfig ? resetMapConfigUpdater(state) : state;
  for (const merger of state.mergers) {
    if (isValidMerger(merger) && hasPropsToMerge(config.visState, merger.prop)) {
      mergedState = merger.merge(
        mergedState,
        getPropValueToMerger(config.visState, merger.prop, merger.toMergeProp),
        // fromConfig
        true
      );
    }
  }

  return mergedState;
};

/**
 * Trigger layer hover event with hovered object
 * @memberof visStateUpdaters
 * @public
 */
export const layerHoverUpdater = (
  state: VisState,
  action: VisStateActions.OnLayerHoverUpdaterAction
): VisState => ({
  ...state,
  hoverInfo: {
    // deck.gl info is mutable
    ...action.info,
    ...(Number.isFinite(action.mapIndex) ? {mapIndex: action.mapIndex} : {})
  }
});

/* eslint-enable max-statements */

/**
 * Update `interactionConfig`
 * @memberof visStateUpdaters
 * @public
 */
export function interactionConfigChangeUpdater(
  state: VisState,
  action: VisStateActions.InteractionConfigChangeUpdaterAction
): VisState {
  const {config} = action;

  const interactionConfig = {
    ...state.interactionConfig,
    ...{[config.id]: config}
  };

  // Don't enable tooltip and brush at the same time
  // but coordinates can be shown at all time
  const contradict = ['brush', 'tooltip'];

  if (
    contradict.includes(config.id) &&
    config.enabled &&
    !state.interactionConfig[config.id].enabled
  ) {
    // only enable one interaction at a time
    contradict.forEach(k => {
      if (k !== config.id) {
        interactionConfig[k] = {...interactionConfig[k], enabled: false};
      }
    });
  }

  const newState = {
    ...state,
    interactionConfig
  };

  if (config.id === 'geocoder' && !config.enabled) {
    return removeDatasetUpdater(newState, {dataId: 'geocoder_dataset'});
  }

  return newState;
}

/**
 * Trigger layer click event with clicked object
 * @memberof visStateUpdaters
 * @public
 */
export const layerClickUpdater = (
  state: VisState,
  action: VisStateActions.OnLayerClickUpdaterAction
): VisState => ({
  ...state,
  mousePos: state.interactionConfig.coordinate.enabled
    ? {
        ...state.mousePos,
        pinned: state.mousePos.pinned ? null : cloneDeep(state.mousePos)
      }
    : state.mousePos,
  clicked: action.info && action.info.picked ? action.info : null
});

/**
 * Trigger map click event, unselect clicked object
 * @memberof visStateUpdaters
 * @public
 */
export const mapClickUpdater = (
  state: VisState,
  action: VisStateActions.OnMapClickUpdaterAction
): VisState => {
  return {
    ...state,
    clicked: null
  };
};

/**
 * Trigger map move event
 * @memberof visStateUpdaters
 * @public
 */
export const mouseMoveUpdater = (
  state: VisState,
  {evt}: VisStateActions.OnMouseMoveUpdaterAction
): VisState => {
  if (Object.values(state.interactionConfig).some(config => config.enabled)) {
    return {
      ...state,
      mousePos: {
        ...state.mousePos,
        ...(Array.isArray(evt.point) ? {mousePosition: [...evt.point]} : {}),
        ...(Array.isArray(evt.lngLat) ? {coordinate: [...evt.lngLat]} : {})
      }
    };
  }

  return state;
};
/**
 * Toggle visibility of a layer for a split map
 * @memberof visStateUpdaters
 * @public
 */
export const toggleSplitMapUpdater = (
  state: VisState,
  action: MapStateActions.ToggleSplitMapUpdaterAction
): VisState =>
  state.splitMaps && state.splitMaps.length === 0
    ? {
        ...state,
        // maybe we should use an array to store state for a single map as well
        // if current maps length is equal to 0 it means that we are about to split the view
        splitMaps: computeSplitMapLayers(state.layers, {duplicate: false})
      }
    : closeSpecificMapAtIndex(state, action);

/**
 * Toggle visibility of a layer in a split map
 * @memberof visStateUpdaters
 * @public
 */
export const toggleLayerForMapUpdater = (
  state: VisState,
  {mapIndex, layerId}: VisStateActions.ToggleLayerForMapUpdaterAction
): VisState => {
  const {splitMaps} = state;

  return {
    ...state,
    splitMaps: splitMaps.map((sm, i) =>
      i === mapIndex
        ? {
            ...splitMaps[i],
            layers: {
              ...splitMaps[i].layers,
              // if layerId not in layers, set it to visible
              [layerId]: !splitMaps[i].layers[layerId]
            }
          }
        : sm
    )
  };
};

/**
 * Add new dataset to `visState`, with option to load a map config along with the datasets
 * @memberof visStateUpdaters
 * @public
 */
// eslint-disable-next-line complexity
export const updateVisDataUpdater = (
  state: VisState,
  action: VisStateActions.UpdateVisDataUpdaterAction
): VisState => {
  // datasets can be a single data entries or an array of multiple data entries
  const {config, options} = action;

  // apply config if passed from action
  // TODO: we don't handle asyn mergers here yet
  const previousState = config
    ? receiveMapConfigUpdater(state, {
        payload: {config, options}
      })
    : state;

  const datasets = toArray(action.datasets);

  const newDataEntries = datasets.reduce(
    // @ts-expect-error  Type '{}' is missing the following properties from type 'ProtoDataset': data, info
    (accu, {info = {}, ...rest} = {}) => ({
      ...accu,
      ...(createNewDataEntry({info, ...rest}, state.datasets) || {})
    }),
    {}
  );

  // save new dataset entry to state
  const mergedState = {
    ...previousState,
    datasets: mergeDatasetsByOrder(previousState, newDataEntries)
  };

  // merge state with config to be merged
  const layerMergers = state.mergers.filter(m => m.waitForLayerData);
  const datasetMergers = state.mergers.filter(m => !layerMergers.includes(m));

  const newDataIds = Object.keys(newDataEntries);
  const postMergerPayload = {
    newDataIds,
    options,
    layerMergers
  };

  return applyMergersUpdater(mergedState, {mergers: datasetMergers, postMergerPayload});
};

/**
 * Add new dataset to `visState`, with option to load a map config along with the datasets
 */
export function applyMergersUpdater(
  state: VisState,
  action: {
    mergers: Merger<any>[];
    postMergerPayload: PostMergerPayload;
  }
): VisState {
  const {mergers, postMergerPayload} = action;

  // merge state with config to be merged
  const mergeStateResult = mergeStateFromMergers(
    state,
    {
      ...INITIAL_VIS_STATE,
      ...state.initialState
    },
    mergers,
    // newDataIds,
    postMergerPayload
  );

  // if all merged, kickup post merge process
  // if not wait
  return mergeStateResult.allMerged
    ? postMergeUpdater(mergeStateResult.mergedState, postMergerPayload)
    : mergeStateResult.mergedState;
}

/**
 * Add new dataset to `visState`, with option to load a map config along with the datasets
 */
function postMergeUpdater(mergedState: VisState, postMergerPayload: PostMergerPayload): VisState {
  const {newDataIds, options, layerMergers} = postMergerPayload;
  const newFilters = mergedState.filters.filter(f =>
    f.dataId.find(fDataId => newDataIds.includes(fDataId))
  );
  const datasetFiltered: string[] = uniq(
    newFilters.reduce((accu, f) => [...accu, ...f.dataId], [] as string[])
  );
  const dataEmpty = newDataIds.length < 1;

  let newLayers = !dataEmpty
    ? mergedState.layers.filter(l => l.config.dataId && newDataIds.includes(l.config.dataId))
    : [];

  const newDataEntries = newDataIds.reduce(
    (accu, id) => ({
      ...accu,
      [id]: mergedState.datasets[id]
    }),
    {}
  );

  if (!newLayers.length && (options || {}).autoCreateLayers !== false) {
    // no layer merged, find defaults
    const result = addDefaultLayers(mergedState, newDataEntries);
    mergedState = result.state;
    newLayers = result.newLayers;
  }

  if (mergedState.splitMaps.length) {
    // if map is split, add new layers to splitMaps
    newLayers = mergedState.layers.filter(
      l => l.config.dataId && newDataIds.includes(l.config.dataId)
    );
    mergedState = {
      ...mergedState,
      splitMaps: addNewLayersToSplitMap(mergedState.splitMaps, newLayers)
    };
  }

  // if no tooltips merged add default tooltips
  newDataIds.forEach(dataId => {
    const tooltipFields = mergedState.interactionConfig.tooltip.config.fieldsToShow[dataId];
    // loading dataset: autoCreateTooltips is false and we don't want to run addDefaultTooltips when tooltipFields is empty
    if (
      options?.autoCreateTooltips !== false &&
      (!Array.isArray(tooltipFields) || !tooltipFields.length)
    ) {
      // adding dataset: autoCreateTooltips is true
      mergedState = addDefaultTooltips(mergedState, newDataEntries[dataId]);
    }
  });

  const updatedDatasets = dataEmpty
    ? Object.keys(mergedState.datasets)
    : uniq(Object.keys(newDataEntries).concat(datasetFiltered));

  let updatedState = updateAllLayerDomainData(mergedState, updatedDatasets, undefined);

  // register layer animation domain,
  // need to be called after layer data is calculated
  updatedState = updateAnimationDomain(updatedState);

  // try to process layerMergers after dataset+datasetMergers
  return layerMergers && layerMergers.length > 0
    ? applyMergersUpdater(updatedState, {
        mergers: layerMergers,
        postMergerPayload: {...postMergerPayload, layerMergers: []}
      })
    : updatedState;
}

/**
 * Rename an existing dataset in `visState`
 * @memberof visStateUpdaters
 * @public
 */
export function renameDatasetUpdater(
  state: VisState,
  action: VisStateActions.RenameDatasetUpdaterAction
): VisState {
  return updateDatasetPropsUpdater(state, {dataId: action.dataId, props: {label: action.label}});
}

const ALLOWED_UPDATE_DATASET_PROPS = ['label', 'color', 'metadata'];

/**
 * Validates properties before updating the dataset.
 * Makes sure each property is in the allowed list
 * Makes sure color value is RGB
 * Performs deep merge when updating metadata
 */
const validateDatasetUpdateProps = (props, dataset) => {
  const validatedProps = Object.entries(props).reduce((acc, entry) => {
    const [key, value] = entry;
    // is it allowed ?
    if (!ALLOWED_UPDATE_DATASET_PROPS.includes(key)) {
      return acc;
    }

    // if we are adding a color but it is not RGB we don't accept the value
    // in the future as we add more props we should change this if into a switch
    if (key === 'color' && !isRgbColor(value)) {
      return acc;
    }

    // do we need deep merge ?
    return {...acc, [key]: isPlainObject(value) ? deepmerge(dataset[key] || {}, value) : value};
  }, {});

  return validatedProps;
};

/**
 * Update Dataset props (label, color, meta). Do not use to update data or any related properties
 * @memberof visStateUpdaters
 * @public
 */
export function updateDatasetPropsUpdater(
  state: VisState,
  action: VisStateActions.UpdateDatasetPropsUpdaterAction
): VisState {
  const {dataId, props} = action;
  const {datasets} = state;
  const existing = datasets[dataId];

  if (existing) {
    const validatedProps = validateDatasetUpdateProps(props, existing);
    //  validate props: just color for now
    //  we only allow label, color and meta to be updated
    // const newTable = copyTableAndUpdate(existing, validatedProps);
    return {
      ...state,
      datasets: {
        ...datasets,
        [dataId]: copyTableAndUpdate(existing, validatedProps)
      }
    };
  }

  return state;
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
export function closeSpecificMapAtIndex<S extends VisState>(
  state: S,
  action: MapStateActions.ToggleSplitMapUpdaterAction
): S {
  // retrieve layers meta data from the remaining map that we need to keep
  const indexToRetrieve = 1 - action.payload;
  const mapLayers = state.splitMaps[indexToRetrieve]?.layers;
  const {layers} = state;

  // update layer visibility
  const newLayers = layers.map(layer =>
    mapLayers && !mapLayers[layer.id] && layer.config.isVisible
      ? layer.updateLayerConfig({
          // if layer.id is not in mapLayers, it should be inVisible
          isVisible: false
        })
      : layer
  );

  // delete map
  return {
    ...state,
    layers: newLayers,
    splitMaps: []
  };
}

/**
 * Trigger file loading dispatch `addDataToMap` if succeed, or `loadFilesErr` if failed
 * @memberof visStateUpdaters
 * @public
 */
export const loadFilesUpdater = (
  state: VisState,
  action: VisStateActions.LoadFilesUpdaterAction
): VisState => {
  const {files, onFinish = loadFilesSuccess} = action;
  if (!files.length) {
    return state;
  }

  const fileLoadingProgress = Array.from(files).reduce(
    (accu, f, i) => merge_(initialFileLoadingProgress(f, i))(accu),
    {}
  );

  const fileLoading = {
    fileCache: [],
    filesToLoad: files,
    onFinish
  };

  const nextState = merge_({fileLoadingProgress, fileLoading})(state);

  return loadNextFileUpdater(nextState);
};

/**
 * Sucessfully loaded one file, move on to the next one
 * @memberof visStateUpdaters
 * @public
 */
export function loadFileStepSuccessUpdater(
  state: VisState,
  action: VisStateActions.LoadFileStepSuccessAction
): VisState {
  if (!state.fileLoading) {
    return state;
  }
  const {fileName, fileCache} = action;
  const {filesToLoad, onFinish} = state.fileLoading;
  const stateWithProgress = updateFileLoadingProgressUpdater(state, {
    fileName,
    progress: {percent: 1, message: 'Done'}
  });

  // save processed file to fileCache
  const stateWithCache = pick_('fileLoading')(merge_({fileCache}))(stateWithProgress);

  return withTask(
    stateWithCache,
    DELAY_TASK(200).map(filesToLoad.length ? loadNextFile : () => onFinish(fileCache))
  );
}

// withTask<T>(state: T, task: any): T

/**
 *
 * @memberof visStateUpdaters
 * @public
 */
export function loadNextFileUpdater(state: VisState): VisState {
  if (!state.fileLoading) {
    return state;
  }
  const {filesToLoad} = state.fileLoading;
  const [file, ...remainingFilesToLoad] = filesToLoad;

  // save filesToLoad to state
  const nextState = pick_('fileLoading')(merge_({filesToLoad: remainingFilesToLoad}))(state);

  const stateWithProgress = updateFileLoadingProgressUpdater(nextState, {
    fileName: file.name,
    progress: {percent: 0, message: 'loading...'}
  });

  const {loaders, loadOptions} = state;
  return withTask(
    stateWithProgress,
    makeLoadFileTask(
      file,
      nextState.fileLoading && nextState.fileLoading.fileCache,
      loaders,
      loadOptions
    )
  );
}

export function makeLoadFileTask(file, fileCache, loaders: Loader[] = [], loadOptions = {}) {
  return LOAD_FILE_TASK({file, fileCache, loaders, loadOptions}).bimap(
    // prettier ignore
    // success
    gen =>
      nextFileBatch({
        gen,
        fileName: file.name,
        onFinish: result =>
          processFileContent({
            content: result,
            fileCache
          })
      }),

    // error
    err => loadFilesErr(file.name, err)
  );
}

/**
 *
 * @memberof visStateUpdaters
 * @public
 */
export function processFileContentUpdater(
  state: VisState,
  action: VisStateActions.ProcessFileContentUpdaterAction
): VisState {
  const {content, fileCache} = action.payload;

  const stateWithProgress = updateFileLoadingProgressUpdater(state, {
    fileName: content.fileName,
    progress: {percent: 1, message: 'processing...'}
  });

  return withTask(
    stateWithProgress,
    PROCESS_FILE_DATA({content, fileCache}).bimap(
      result => loadFileStepSuccess({fileName: content.fileName, fileCache: result}),
      err => loadFilesErr(content.fileName, err)
    )
  );
}

export function parseProgress(prevProgress = {}, progress) {
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
 * @public
 */
export const nextFileBatchUpdater = (
  state: VisState,
  {
    payload: {gen, fileName, progress, accumulated, onFinish}
  }: VisStateActions.NextFileBatchUpdaterAction
): VisState => {
  const stateWithProgress = updateFileLoadingProgressUpdater(state, {
    fileName,
    progress: parseProgress(state.fileLoadingProgress[fileName], progress)
  });

  return withTask(stateWithProgress, [
    ...(fileName.endsWith('arrow') && accumulated?.data?.length > 0
      ? [
          PROCESS_FILE_DATA({content: accumulated, fileCache: []}).bimap(
            result => loadFilesSuccess(result),
            err => loadFilesErr(fileName, err)
          )
        ]
      : []),
    UNWRAP_TASK(gen.next()).bimap(
      ({value, done}) => {
        return done
          ? onFinish(accumulated)
          : nextFileBatch({
              gen,
              fileName,
              progress: value.progress,
              accumulated: value,
              onFinish
            });
      },
      err => loadFilesErr(fileName, err)
    )
  ]);
};

/**
 * Trigger loading file error
 * @memberof visStateUpdaters
 * @public
 */
export const loadFilesErrUpdater = (
  state: VisState,
  {error, fileName}: VisStateActions.LoadFilesErrUpdaterAction
): VisState => {
  // update ui with error message
  Console.warn(error);
  if (!state.fileLoading) {
    return state;
  }
  const {filesToLoad, onFinish, fileCache} = state.fileLoading;

  const nextState = updateFileLoadingProgressUpdater(state, {
    fileName,
    progress: {error}
  });

  // kick off next file or finish
  return withTask(
    nextState,
    DELAY_TASK(200).map(filesToLoad.length ? loadNextFile : () => onFinish(fileCache))
  );
};

/**
 * When select dataset for export, apply cpu filter to selected dataset
 * @memberof visStateUpdaters
 * @public
 */
export const applyCPUFilterUpdater = (
  state: VisState,
  {dataId}: VisStateActions.ApplyCPUFilterUpdaterAction
): VisState => {
  // apply cpuFilter
  const dataIds = toArray(dataId);

  return dataIds.reduce((accu, id) => filterDatasetCPU(accu, id), state);
};

/**
 * User input to update the info of the map
 * @memberof visStateUpdaters
 * @public
 */
export const setMapInfoUpdater = (
  state: VisState,
  action: VisStateActions.SetMapInfoUpdaterAction
): VisState => ({
  ...state,
  mapInfo: {
    ...state.mapInfo,
    ...action.info
  }
});
/**
 * Helper function to update All layer domain and layer data of state
 */
export function addDefaultLayers(
  state: VisState,
  datasets: Datasets
): {state: VisState; newLayers: Layer[]} {
  const empty: Layer[] = [];
  const defaultLayers = Object.values(datasets).reduce((accu: Layer[], dataset) => {
    const foundLayers = findDefaultLayer(dataset, state.layerClasses);
    return foundLayers && foundLayers.length ? accu.concat(foundLayers) : accu;
  }, empty);

  return {
    state: {
      ...state,
      layers: [...state.layers, ...defaultLayers],
      layerOrder: [
        // put new layers on top of old ones in reverse
        ...getLayerOrderFromLayers(defaultLayers),
        ...state.layerOrder
      ]
    },
    newLayers: defaultLayers
  };
}

/**
 * helper function to find default tooltips
 * @param {Object} state
 * @param {Object} dataset
 * @returns {Object} nextState
 */
export function addDefaultTooltips(state, dataset) {
  const tooltipFields = findFieldsToShow({
    ...dataset,
    maxDefaultTooltips: state.maxDefaultTooltips
  });
  const merged = {
    ...state.interactionConfig.tooltip.config.fieldsToShow,
    ...tooltipFields
  };

  return set(['interactionConfig', 'tooltip', 'config', 'fieldsToShow'], merged, state);
}

export function initialFileLoadingProgress(file, index) {
  const fileName = file.name || `Untitled File ${index}`;
  return {
    [fileName]: {
      // percent of current file
      percent: 0,
      message: '',
      fileName,
      error: null
    }
  };
}

export function updateFileLoadingProgressUpdater(state, {fileName, progress}) {
  // @ts-expect-error
  return pick_('fileLoadingProgress')(pick_(fileName)(merge_(progress)))(state);
}
/**
 * Helper function to update layer domains for an array of datasets
 */
export function updateAllLayerDomainData(
  state: VisState,
  dataId: string | string[],
  updatedFilter?: Filter
): VisState {
  const dataIds = typeof dataId === 'string' ? [dataId] : dataId;
  const newLayers: Layer[] = [];
  const newLayerData: any[] = [];

  state.layers.forEach((oldLayer, i) => {
    if (oldLayer.config.dataId && dataIds.includes(oldLayer.config.dataId)) {
      // No need to recalculate layer domain if filter has fixed domain
      const newLayer =
        updatedFilter && updatedFilter.fixedDomain
          ? oldLayer
          : oldLayer.updateLayerDomain(state.datasets, updatedFilter);

      const {layerData, layer} = calculateLayerData(newLayer, state, state.layerData[i]);

      newLayers.push(layer);
      newLayerData.push(layerData);
    } else {
      newLayers.push(oldLayer);
      newLayerData.push(state.layerData[i]);
    }
  });

  const newState = {
    ...state,
    layers: newLayers,
    layerData: newLayerData
  };

  return newState;
}

export function updateAnimationDomain<S extends VisState>(state: S): S {
  // merge all animatable layer domain and update global config
  const animatableLayers = state.layers.filter(
    l =>
      l.config.isVisible &&
      l.config.animation &&
      l.config.animation.enabled &&
      // @ts-expect-error trip-layer-only
      Array.isArray(l.animationDomain)
  );

  if (!animatableLayers.length) {
    return {
      ...state,
      animationConfig: {
        ...state.animationConfig,
        domain: null,
        defaultTimeFormat: null
      }
    };
  }

  const mergedDomain: [number, number] = animatableLayers.reduce(
    (accu, layer) => [
      // @ts-expect-error trip-layer-only
      Math.min(accu[0], layer.animationDomain[0]),
      // @ts-expect-error trip-layer-only
      Math.max(accu[1], layer.animationDomain[1])
    ],
    [Number(Infinity), -Infinity]
  );
  const defaultTimeFormat = getTimeWidgetTitleFormatter(mergedDomain);

  return {
    ...state,
    animationConfig: {
      ...state.animationConfig,
      currentTime: isInRange(state.animationConfig.currentTime, mergedDomain)
        ? state.animationConfig.currentTime
        : mergedDomain[0],
      domain: mergedDomain,
      defaultTimeFormat
    }
  };
}

/**
 * Update the status of the editor
 * @memberof visStateUpdaters
 */
export const setEditorModeUpdater = (
  state: VisState,
  {mode}: VisStateActions.SetEditorModeUpdaterAction
): VisState => ({
  ...state,
  editor: {
    ...state.editor,
    mode,
    selectedFeature: null
  }
});

// const featureToFilterValue = (feature) => ({...feature, id: feature.id});
/**
 * Update editor features
 * @memberof visStateUpdaters
 */
export function setFeaturesUpdater(
  state: VisState,
  {features = []}: VisStateActions.SetFeaturesUpdaterAction
): VisState {
  const lastFeature = features.length && features[features.length - 1];

  const newState = {
    ...state,
    editor: {
      ...state.editor,
      // only save none filter features to editor
      features: features.filter(f => !getFilterIdInFeature(f)),
      mode: lastFeature && lastFeature.properties.isClosed ? EDITOR_MODES.EDIT : state.editor.mode
    }
  };

  // Retrieve existing feature
  const {selectedFeature} = state.editor;

  // If no feature is selected we can simply return since no operations
  if (!selectedFeature) {
    return newState;
  }

  // TODO: check if the feature has changed
  const feature = features.find(f => f.id === selectedFeature.id);

  // if feature is part of a filter
  const filterId = feature && getFilterIdInFeature(feature);
  if (filterId && feature) {
    // add bbox for polygon filter to speed up filtering
    if (feature.properties) feature.properties.bbox = bbox(feature);
    const featureValue = featureToFilterValue(feature, filterId);
    const filterIdx = state.filters.findIndex(fil => fil.id === filterId);
    // @ts-ignore
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
 */
export const setSelectedFeatureUpdater = (
  state: VisState,
  {feature, selectionContext}: VisStateActions.SetSelectedFeatureUpdaterAction
): VisState => {
  // add bbox for polygon filter to speed up filtering
   if (feature && feature.properties) feature.properties.bbox = bbox(feature);
  return {
    ...state,
    editor: {
      ...state.editor,
      selectedFeature: feature,
      selectionContext
    }
  };
};

/**
 * Delete existing feature from filters
 * @memberof visStateUpdaters
 */
export function deleteFeatureUpdater(
  state: VisState,
  {feature}: VisStateActions.DeleteFeatureUpdaterAction
): VisState {
  if (!feature) {
    return state;
  }

  const newState = {
    ...state,
    editor: {
      ...state.editor,
      selectedFeature: null
    }
  };

  if (getFilterIdInFeature(feature)) {
    const filterIdx = newState.filters.findIndex(f => f.id === getFilterIdInFeature(feature));

    return filterIdx > -1 ? removeFilterUpdater(newState, {idx: filterIdx}) : newState;
  }

  // modify editor object
  const newEditor = {
    ...state.editor,
    features: state.editor.features.filter(f => f.id !== feature.id),
    selectedFeature: null
  };

  return {
    ...state,
    editor: newEditor
  };
}

/**
 * Toggle feature as layer filter
 * @memberof visStateUpdaters
 */
export function setPolygonFilterLayerUpdater(
  state: VisState,
  payload: VisStateActions.SetPolygonFilterLayerUpdaterAction
): VisState {
  const {layer, feature} = payload;
  const filterId = getFilterIdInFeature(feature);

  // let newFilter = null;
  let filterIdx;
  let newLayerId = [layer.id];
  let newState = state;
  // If polygon filter already exists, we need to find out if the current layer is already included
  if (filterId) {
    filterIdx = state.filters.findIndex(f => f.id === filterId);

    if (!state.filters[filterIdx]) {
      // what if filter doesn't exist?... not possible.
      // because features in the editor is passed in from filters and editors.
      // but we will move this feature back to editor just in case
      const noneFilterFeature = {
        ...feature,
        properties: {
          ...feature.properties,
          filterId: null
        }
      };

      return {
        ...state,
        editor: {
          ...state.editor,
          features: [...state.editor.features, noneFilterFeature],
          selectedFeature: noneFilterFeature
        }
      };
    }
    const filter = state.filters[filterIdx];
    const {layerId = []} = filter;
    const isLayerIncluded = layerId.includes(layer.id);

    newLayerId = isLayerIncluded
      ? // if layer is included, remove it
        layerId.filter(l => l !== layer.id)
      : [...layerId, layer.id];
  } else {
    // if we haven't create the polygon filter, create it
    const newFilter = generatePolygonFilter([], feature);
    filterIdx = state.filters.length;

    // add feature, remove feature from eidtor
    newState = {
      ...state,
      filters: [...state.filters, newFilter],
      editor: {
        ...state.editor,
        features: state.editor.features.filter(f => f.id !== feature.id),
        selectedFeature: newFilter.value
      }
    };
  }

  return setFilterUpdater(newState, {
    idx: filterIdx,
    prop: 'layerId',
    value: newLayerId
  });
}

/**
 * @memberof visStateUpdaters
 * @public
 */
export function sortTableColumnUpdater(
  state: VisState,
  {dataId, column, mode}: VisStateActions.SortTableColumnUpdaterAction
): VisState {
  const dataset = state.datasets[dataId];
  if (!dataset) {
    return state;
  }
  let sortMode = mode;
  if (!sortMode) {
    const currentMode = get(dataset, ['sortColumn', column]);
    // @ts-ignore - should be fixable in a TS file
    sortMode = currentMode
      ? Object.keys(SORT_ORDER).find(m => m !== currentMode)
      : SORT_ORDER.ASCENDING;
  }

  const sorted = sortDatasetByColumn(dataset, column, sortMode);
  return set(['datasets', dataId], sorted, state);
}

/**
 * @memberof visStateUpdaters
 * @public
 */
export function pinTableColumnUpdater(
  state: VisState,
  {dataId, column}: VisStateActions.PinTableColumnUpdaterAction
): VisState {
  const dataset = state.datasets[dataId];
  if (!dataset) {
    return state;
  }
  const newDataset = pinTableColumns(dataset, column);

  return set(['datasets', dataId], newDataset, state);
}

/**
 * Copy column content as strings
 * @memberof visStateUpdaters
 * @public
 */
export function copyTableColumnUpdater(
  state: VisState,
  {dataId, column}: VisStateActions.CopyTableColumnUpdaterAction
): VisState {
  const dataset = state.datasets[dataId];
  if (!dataset) {
    return state;
  }
  const fieldIdx = dataset.fields.findIndex(f => f.name === column);
  if (fieldIdx < 0) {
    return state;
  }
  const {type} = dataset.fields[fieldIdx];
  const text = dataset.dataContainer
    .map(row => parseFieldValue(row.valueAt(fieldIdx), type), true)
    .join('\n');

  copy(text);

  return state;
}

/**
 * Set display format from columns from user selection
 * @memberof visStateUpdaters
 * @public
 */
export function setColumnDisplayFormatUpdater(
  state: VisState,
  {dataId, formats}: VisStateActions.SetColumnDisplayFormatUpdaterAction
): VisState {
  const dataset = state.datasets[dataId];
  if (!dataset) {
    return state;
  }
  let newFields = dataset.fields;
  Object.keys(formats).forEach(column => {
    const fieldIdx = dataset.fields.findIndex(f => f.name === column);
    if (fieldIdx >= 0) {
      const displayFormat = formats[column];
      const field = newFields[fieldIdx];
      newFields = swap_(merge_({displayFormat})(field) as {id: string})(
        newFields as {id: string}[]
      ) as Field[];
    }
  });

  const newDataset = copyTableAndUpdate(dataset, {fields: newFields as Field[]});
  return pick_('datasets')(merge_({[dataId]: newDataset}))(state);
}

/**
 * Update editor
 */
export function toggleEditorVisibilityUpdater(
  state: VisState,
  action: VisStateActions.ToggleEditorVisibilityUpdaterAction
): VisState {
  return {
    ...state,
    editor: {
      ...state.editor,
      visible: !state.editor.visible
    }
  };
}

export function setFilterAnimationTimeConfigUpdater(
  state: VisState,
  {idx, config}: VisStateActions.SetFilterAnimationTimeConfigAction
): VisState {
  const oldFilter = state.filters[idx];
  if (!oldFilter) {
    Console.error(`filters.${idx} is undefined`);
    return state;
  }
  if (oldFilter.type !== FILTER_TYPES.timeRange) {
    Console.error(
      `setFilterAnimationTimeConfig can only be called to update a time filter. check filter.type === 'timeRange'`
    );
    return state;
  }

  const updates = checkTimeConfigArgs(config);

  return pick_('filters')(swap_(merge_(updates)(oldFilter)))(state);
}

function checkTimeConfigArgs(config) {
  const allowed = ['timeFormat', 'timezone'];
  return Object.keys(config).reduce((accu, prop) => {
    if (!allowed.includes(prop)) {
      Console.error(
        `setLayerAnimationTimeConfig takes timeFormat and/or timezone as options, found ${prop}`
      );
      return accu;
    }

    // here we are NOT checking if timezone or timeFormat input is valid
    accu[prop] = config[prop];
    return accu;
  }, {});
}
/**
 * Update editor
 */
export function setLayerAnimationTimeConfigUpdater(
  state: VisState,
  {config}: VisStateActions.SetLayerAnimationTimeConfigAction
): VisState {
  if (!config) {
    return state;
  }
  const updates = checkTimeConfigArgs(config);
  return pick_('animationConfig')(merge_(updates))(state);
}

// Find dataId from a saved visState property:
// layers, filters, interactions, layerBlending, overlayBlending, splitMaps, animationConfig, editor
// replace it with another dataId
function defaultReplaceParentDatasetIds(value: any, dataId: string, dataIdToReplace: string) {
  if (Array.isArray(value)) {
    // for layers, filters, call defaultReplaceParentDatasetIds on each item in array
    const replaced = value
      .map(v => defaultReplaceParentDatasetIds(v, dataId, dataIdToReplace))
      .filter(d => d);
    return replaced.length ? replaced : null;
  }
  if (typeof value.dataId === 'string' && value.dataId === dataId) {
    // others
    return {
      ...value,
      dataId: dataIdToReplace
    };
  } else if (Array.isArray(value.dataId) && value.dataId.includes(dataId)) {
    // filter
    return {
      ...value,
      dataId: value.dataId.map(d => (d === dataId ? dataIdToReplace : d))
    };
  } else if (value.config?.dataId && value.config?.dataId === dataId) {
    // layer
    return {
      ...value,
      config: {
        ...value.config,
        dataId: dataIdToReplace
      }
    };
  } else if (isObject(value) && value.hasOwnProperty(dataId)) {
    // for value saved as {[dataId]: {...}}
    return {[dataIdToReplace]: value[dataId]};
  }

  return null;
}

// Find datasetIds derived a saved visState Property;
function findChildDatasetIds(value) {
  if (Array.isArray(value)) {
    // for layers, filters, call defaultReplaceParentDatasetIds on each item in array
    const childDataIds = value.map(findChildDatasetIds).filter(d => d);
    return childDataIds.length ? childDataIds : null;
  }

  // child data id usually stores in the derived dataset info
  return value?.newDataset?.info.id || null;
}

// moved unmerged layers, filters, interactions
function moveValueToBeMerged(state, propValues, {prop, toMergeProp, saveUnmerged}) {
  // remove prop value from state
  // TODO: should we add remove updater to merger as well?
  if (!propValues) {
    return state;
  }
  const stateRemoved =
    prop === 'layers'
      ? propValues.reduce((accu, propValue) => removeLayerUpdater(accu, {id: propValue.id}), state)
      : Array.isArray(state[prop])
      ? {
          ...state,
          [prop]: state[prop].filter(p => !propValues.find(propValue => p.id === propValue.id))
        }
      : // if not array, we won't remove it, remove dataset should handle it
        state;

  // move to stateToBeMerged
  const toBeMerged = {
    [toMergeProp]: saveUnmerged
      ? // call merge saveUnmerged method
        saveUnmerged(stateRemoved, propValues)
      : // if toMergeProp is araay, append to it
      Array.isArray(stateRemoved[toMergeProp])
      ? [...stateRemoved[toMergeProp], ...propValues]
      : // save propValues to toMerge
      isObject(stateRemoved[toMergeProp])
      ? {
          ...stateRemoved[toMergeProp],
          ...propValues
        }
      : stateRemoved[toMergeProp]
  };

  return {
    ...stateRemoved,
    ...toBeMerged
  };
}

function replaceDatasetAndDeps<T extends VisState>(
  state: T,
  dataId: string,
  dataIdToUse: string
): T {
  return compose_<T>([
    apply_(replaceDatasetDepsInState, {dataId, dataIdToUse}),
    apply_(removeDatasetUpdater, {dataId})
  ])(state);
}

export function prepareStateForDatasetReplace<T extends VisState>(
  state: T,
  dataId: string,
  dataIdToUse: string
): T {
  const serializedState = serializeVisState(state, state.schema);
  const nextState = replaceDatasetAndDeps(state, dataId, dataIdToUse);
  // make a copy of layerOrder, because layer id will be removed from it by calling removeLayerUpdater
  const preserveLayerOrder = [...state.layerOrder];

  // preserve dataset order
  nextState.preserveDatasetOrder = Object.keys(state.datasets).map(d =>
    d === dataId ? dataIdToUse : d
  );

  // preserveLayerOrder
  if (nextState.layerToBeMerged?.length) {
    // copy split maps to be merged, because it will be reset in remove layer
    nextState.splitMapsToBeMerged = serializedState?.splitMaps ?? [];
    nextState.layerOrder = [...preserveLayerOrder];
  }

  return nextState;
}

export function replaceDatasetDepsInState<T extends VisState>(
  state: T,
  {dataId, dataIdToUse}: {dataId: string; dataIdToUse: string}
): T {
  const serializedState = serializeVisState(state, state.schema);

  const nextState = state.mergers.reduce(
    (
      accuState,
      {prop, toMergeProp, replaceParentDatasetIds, getChildDatasetIds, saveUnmerged, preserveOrder}
    ) => {
      // get dataset ids that are depends on this dataset
      const props = toArray(prop);
      const toMergeProps = toArray(toMergeProp);
      const savedProps = serializedState ? props.map(p => serializedState[p]) : [];

      let replacedState = accuState;
      savedProps.forEach((propValue, i) => {
        const mergerOptions = {
          prop: props[i],
          toMergeProp: toMergeProps[i],
          getChildDatasetIds,
          saveUnmerged
        };

        const replacedItem =
          replaceParentDatasetIds?.(propValue, dataId, dataIdToUse) ||
          defaultReplaceParentDatasetIds(propValue, dataId, dataIdToUse);
        replacedState = replacedItem
          ? replacePropValueInState(replacedState, replacedItem, mergerOptions)
          : replacedState;

        if (
          mergerOptions.toMergeProp !== undefined &&
          replacedState[mergerOptions.toMergeProp]?.length &&
          preserveOrder
        ) {
          replacedState[preserveOrder] = propValue.map(item => item.id);
        }
      });

      return replacedState;
    },
    state
  );

  return nextState;
}

function replacePropValueInState(
  state,
  replacedItem,
  {prop, toMergeProp, getChildDatasetIds, saveUnmerged}
) {
  // prop is depends on the dataset to be replaced
  // remove prop from state, and move it to toBeMerged
  let nextState = moveValueToBeMerged(state, replacedItem, {prop, toMergeProp, saveUnmerged});
  const childDataIds = getChildDatasetIds?.(replacedItem) || findChildDatasetIds(replacedItem);

  if (childDataIds) {
    nextState = toArray(childDataIds).reduce((accu, childDataId) => {
      // shouldn't need to change child dataset id,
      // but still need to move out of state and merge back in
      return replaceDatasetAndDeps(accu, childDataId, childDataId);
    }, nextState);
  }
  return nextState;
}
