// Copyright (c) 2022 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import {console as Console} from 'global/window';
import {disableStackCapturing, withTask} from 'react-palm/tasks';
import cloneDeep from 'lodash.clonedeep';
import uniq from 'lodash.uniq';
import get from 'lodash.get';
import xor from 'lodash.xor';
import copy from 'copy-to-clipboard';
// Tasks
import {LOAD_FILE_TASK, UNWRAP_TASK, PROCESS_FILE_DATA, DELAY_TASK} from '@kepler.gl/tasks';
// Actions
import {
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
  addNewLayersToSplitMap,
  computeSplitMapLayers,
  removeLayerFromSplitMaps,
  isRgbColor,
  parseFieldValue
} from '@kepler.gl/utils';

import {
  isValidMerger,
  VIS_STATE_MERGERS,
  validateLayerWithData,
  createLayerFromConfig,
  serializeLayer
} from './vis-state-merger';

import {Layer, LayerClasses, LAYER_ID_LENGTH} from '@kepler.gl/layers';
import {
  EDITOR_MODES,
  SORT_ORDER,
  FILTER_TYPES,
  MAX_DEFAULT_TOOLTIPS,
  DEFAULT_TEXT_LABEL,
  COMPARE_TYPES
} from '@kepler.gl/constants';
import {pick_, merge_, swap_} from './composer-helpers';

import KeplerGLSchema, {VisState} from '@kepler.gl/schemas';

import {Filter, InteractionConfig, AnimationConfig, Editor} from '@kepler.gl/types';
import {Loader} from '@loaders.gl/loader-utils';

import {copyTableAndUpdate, Datasets, pinTableColumns, sortDatasetByColumn} from '@kepler.gl/table';
import {calculateLayerData, findDefaultLayer} from './layer-utils';
import {
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
  assignGpuChannel,
  setFilterGpuMode,
  createNewDataEntry,
  getFilterPlot,
  getDefaultFilterPlotType
} from '@kepler.gl/table';
import {findFieldsToShow} from './interaction-utils';

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
  defaultTimeFormat: null
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

  interactionConfig: defaultInteractionConfig,
  interactionToBeMerged: undefined,

  layerBlending: 'normal',
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

/**
 * Update state with updated layer and layerData
 *
 */
export function updateStateWithLayerAndData<S extends VisState>(
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
 * Update layer base config: dataId, label, column, isVisible
 * @memberof visStateUpdaters
 * @returns nextState
 */
export function layerConfigChangeUpdater<S extends VisState>(
  state: S,
  action: VisStateActions.LayerConfigChangeUpdaterAction
): S {
  const {oldLayer} = action;
  const idx = state.layers.findIndex(l => l.id === oldLayer.id);
  const props = Object.keys(action.newConfig);
  if (typeof action.newConfig.dataId === 'string') {
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

  // let newLayer;
  if (newLayer.shouldCalculateLayerData(props)) {
    const oldLayerData = state.layerData[idx];
    const updateLayerDataResult = calculateLayerData(newLayer, state, oldLayerData);

    layerData = updateLayerDataResult.layerData;
    newLayer = updateLayerDataResult.layer;
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

function addOrRemoveTextLabels(newFields, textLabel) {
  let newTextLabel = textLabel.slice();

  const currentFields = textLabel.map(tl => tl.field && tl.field.name).filter(d => d);

  const addFields = newFields.filter(f => !currentFields.includes(f.name));
  const deleteFields = currentFields.filter(f => !newFields.find(fd => fd.name === f));

  // delete
  newTextLabel = newTextLabel.filter(tl => tl.field && !deleteFields.includes(tl.field.name));
  newTextLabel = !newTextLabel.length ? [DEFAULT_TEXT_LABEL] : newTextLabel;

  // add
  newTextLabel = [
    ...newTextLabel.filter(tl => tl.field),
    ...addFields.map(af => ({
      ...DEFAULT_TEXT_LABEL,
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

  if (prop && (value || textLabel.length === 1)) {
    newTextLabel = textLabel.map((tl, i) => (i === idx ? {...tl, [prop]: value} : tl));
  } else if (prop === 'field' && value === null && textLabel.length > 1) {
    // remove label when field value is set to null
    newTextLabel.splice(idx, 1);
  }

  return newTextLabel;
}

/**
 * Update layer base config: dataId, label, column, isVisible
 * @memberof visStateUpdaters
 * @returns nextState
 */
export function layerTextLabelChangeUpdater<S extends VisState>(
  state: S,
  action: VisStateActions.LayerTextLabelChangeUpdaterAction
): S {
  const {oldLayer, idx, prop, value} = action;
  const {textLabel} = oldLayer.config;

  let newTextLabel = textLabel.slice();
  if (!textLabel[idx] && idx === textLabel.length) {
    // if idx is set to length, add empty text label
    newTextLabel = [...textLabel, DEFAULT_TEXT_LABEL];
  }

  if (idx === 'all' && prop === 'fields') {
    newTextLabel = addOrRemoveTextLabels(value, textLabel);
  } else {
    newTextLabel = updateTextLabelPropAndValue(idx, prop, value, newTextLabel);
  }
  // update text label prop and value
  return layerConfigChangeUpdater(state, {
    oldLayer,
    newConfig: {textLabel: newTextLabel}
  });
}

function validateExistingLayerWithData(dataset, layerClasses, layer) {
  const loadedLayer = serializeLayer(layer);
  return validateLayerWithData(dataset, loadedLayer, layerClasses, {
    allowEmptyColumn: true
  });
}

/**
 * Update layer config dataId
 * @memberof visStateUpdaters
 * @returns nextState
 */
export function layerDataIdChangeUpdater<S extends VisState>(
  state: S,
  action: {
    oldLayer: Layer;
    newConfig: {
      dataId: string;
    };
  }
): S {
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
      newLayer
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

function setInitialLayerConfig(layer, datasets, layerClasses) {
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
      isVisible: true
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
export function layerTypeChangeUpdater<S extends VisState>(
  state: S,
  action: VisStateActions.LayerTypeChangeUpdaterAction
): S {
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
    label: oldLayer.config.label
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

  return newState;
}

/**
 * Update layer visual channel
 * @memberof visStateUpdaters
 * @returns {Object} nextState
 * @public
 */
export function layerVisualChannelChangeUpdater<S extends VisState>(
  state: S,
  action: VisStateActions.LayerVisualChannelConfigChangeUpdaterAction
): S {
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
export function layerVisConfigChangeUpdater<S extends VisState>(
  state: S,
  action: VisStateActions.LayerVisConfigChangeUpdaterAction
): S {
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
export function setFilterAnimationTimeUpdater<S extends VisState>(
  state: S,
  action: VisStateActions.SetFilterAnimationTimeUpdaterAction
): S {
  return setFilterUpdater(state, action);
}

/**
 * Update filter animation window
 * @memberof visStateUpdaters
 * @public
 */
export function setFilterAnimationWindowUpdater<S extends VisState>(
  state: S,
  {id, animationWindow}: VisStateActions.SetFilterAnimationWindowUpdaterAction
): S {
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
export function setFilterUpdater<S extends VisState>(
  state: S,
  action: VisStateActions.SetFilterUpdaterAction
): S {
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

      const layerDataIds = uniq(
        layerIdDifference
          .map(lid =>
            get(
              state.layers.find(l => l.id === lid),
              ['config', 'dataId']
            )
          )
          .filter(d => d)
      );

      // only filter datasetsIds
      datasetIds = layerDataIds;

      // Update newFilter dataIds
      const newDataIds = uniq(
        newFilter.layerId
          .map(lid =>
            get(
              state.layers.find(l => l.id === lid),
              ['config', 'dataId']
            )
          )
          .filter(d => d)
      );

      newFilter = {
        ...newFilter,
        dataId: newDataIds
      };

      break;
    default:
      break;
  }

  const enlargedFilter = state.filters.find(f => f.enlarged);

  if (enlargedFilter && enlargedFilter.id !== newFilter.id) {
    // there should be only one enlarged filter
    newFilter.enlarged = false;
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
export const setFilterPlotUpdater = <S extends VisState>(
  state: S,
  {idx, newProp, valueIndex = 0}: VisStateActions.SetFilterPlotUpdaterAction
): S => {
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
export const addFilterUpdater = <S extends VisState>(
  state: S,
  action: VisStateActions.AddFilterUpdaterAction
): S =>
  !action.dataId
    ? state
    : {
        ...state,
        filters: [...state.filters, getDefaultFilter(action.dataId)]
      };

/**
 * Set layer color palette ui state
 * @memberof visStateUpdaters
 */
export const layerColorUIChangeUpdater = <S extends VisState>(
  state: S,
  {oldLayer, prop, newConfig}: VisStateActions.LayerColorUIChangeUpdaterAction
): S => {
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
export const toggleFilterAnimationUpdater = <S extends VisState>(
  state: S,
  action: VisStateActions.ToggleFilterAnimationUpdaterAction
): S => ({
  ...state,
  filters: state.filters.map((f, i) => (i === action.idx ? {...f, isAnimating: !f.isAnimating} : f))
});

/**
 * @memberof visStateUpdaters
 * @public
 */
export const toggleLayerAnimationUpdater = <S extends VisState>(
  state: S,
  action: VisStateActions.ToggleLayerAnimationUpdaterAction
): S => ({
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
export const toggleLayerAnimationControlUpdater = <S extends VisState>(
  state: S,
  action: VisStateActions.ToggleLayerAnimationControlUpdaterAction
): S => ({
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
export const updateFilterAnimationSpeedUpdater = <S extends VisState>(
  state: S,
  action: VisStateActions.UpdateFilterAnimationSpeedUpdaterAction
): S => ({
  ...state,
  filters: state.filters.map((f, i) => (i === action.idx ? {...f, speed: action.speed} : f))
});

/**
 * Reset animation config current time to a specified value
 * @memberof visStateUpdaters
 * @public
 *
 */
export const setLayerAnimationTimeUpdater = <S extends VisState>(
  state: S,
  {value}: VisStateActions.SetLayerAnimationTimeUpdaterAction
): S => ({
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
export const updateLayerAnimationSpeedUpdater = <S extends VisState>(
  state: S,
  {speed}: VisStateActions.UpdateLayerAnimationSpeedUpdaterAction
): S => {
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
export const enlargeFilterUpdater = <S extends VisState>(
  state: S,
  action: VisStateActions.EnlargeFilterUpdaterAction
): S => {
  return {
    ...state,
    filters: state.filters.map((f, i) =>
      i === action.idx
        ? {
            ...f,
            enlarged: !f.enlarged
          }
        : f
    )
  };
};

/**
 * Toggles filter feature visibility
 * @memberof visStateUpdaters
 */
export const toggleFilterFeatureUpdater = <S extends VisState>(
  state: S,
  action: VisStateActions.ToggleFilterFeatureUpdaterAction
): S => {
  const filter = state.filters[action.idx];
  const isVisible = get(filter, ['value', 'properties', 'isVisible']);
  const newFilter = {
    ...filter,
    value: featureToFilterValue(filter.value, filter.id, {
      isVisible: !isVisible
    })
  };

  return {
    ...state,
    filters: Object.assign([...state.filters], {[action.idx]: newFilter})
  };
};

/**
 * Remove a filter
 * @memberof visStateUpdaters
 * @public
 */
export const removeFilterUpdater = <S extends VisState>(
  state: S,
  action: VisStateActions.RemoveFilterUpdaterAction
): S => {
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
export const addLayerUpdater = <S extends VisState>(
  state: S,
  action: VisStateActions.AddLayerUpdaterAction
): S => {
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
  return {
    ...state,
    layers: [...state.layers, newLayer],
    layerData: [...state.layerData, newLayerData],
    layerOrder: [...state.layerOrder, state.layerOrder.length],
    splitMaps: addNewLayersToSplitMap(state.splitMaps, newLayer)
  };
};

/**
 * remove layer
 * @memberof visStateUpdaters
 * @public
 */
export const removeLayerUpdater = <S extends VisState>(
  state: S,
  {idx}: VisStateActions.RemoveLayerUpdaterAction
): S => {
  const {layers, layerData, clicked, hoverInfo} = state;
  const layerToRemove = state.layers[idx];
  const newMaps = removeLayerFromSplitMaps(state.splitMaps, layerToRemove);

  const newState = {
    ...state,
    layers: [...layers.slice(0, idx), ...layers.slice(idx + 1, layers.length)],
    layerData: [...layerData.slice(0, idx), ...layerData.slice(idx + 1, layerData.length)],
    layerOrder: state.layerOrder.filter(i => i !== idx).map(pid => (pid > idx ? pid - 1 : pid)),
    clicked: layerToRemove.isLayerHovered(clicked) ? undefined : clicked,
    hoverInfo: layerToRemove.isLayerHovered(hoverInfo) ? undefined : hoverInfo,
    splitMaps: newMaps
    // TODO: update filters, create helper to remove layer form filter (remove layerid and dataid) if mapped
  };

  return updateAnimationDomain(newState);
};

/**
 * duplicate layer
 * @memberof visStateUpdaters
 * @public
 */
export const duplicateLayerUpdater = <S extends VisState>(
  state: S,
  {idx}: VisStateActions.DuplicateLayerUpdaterAction
): S => {
  const {layers} = state;
  const original = state.layers[idx];
  const originalLayerOrderIdx = state.layerOrder.findIndex(i => i === idx);

  if (!original) {
    Console.warn(`layer.${idx} is undefined`);
    return state;
  }
  let newLabel = `Copy of ${original.config.label}`;
  let postfix = 0;
  // eslint-disable-next-line no-loop-func
  while (layers.find(l => l.config.label === newLabel)) {
    newLabel = `Copy of ${original.config.label} ${++postfix}`;
  }

  // collect layer config from original
  const loadedLayer = serializeLayer(original);

  // assign new id and label to copied layer
  if (!loadedLayer?.config) {
    return state;
  }
  loadedLayer.config.label = newLabel;
  loadedLayer.id = generateHashId(LAYER_ID_LENGTH);

  // add layer to state
  let nextState = addLayerUpdater(state, {config: loadedLayer});

  // new added layer are at the end, move it to be on top of original layer
  const newLayerOrderIdx = nextState.layerOrder.length - 1;
  const newLayerOrder = arrayInsert(
    nextState.layerOrder.slice(0, newLayerOrderIdx),
    originalLayerOrderIdx,
    newLayerOrderIdx
  );

  nextState = {
    ...nextState,
    layerOrder: newLayerOrder
  };

  return updateAnimationDomain(nextState);
};

/**
 * Reorder layer
 * @memberof visStateUpdaters
 * @public
 */
export const reorderLayerUpdater = <S extends VisState>(
  state: S,
  {order}: VisStateActions.ReorderLayerUpdaterAction
): S => ({
  ...state,
  layerOrder: order
});

/**
 * Remove a dataset and all layers, filters, tooltip configs that based on it
 * @memberof visStateUpdaters
 * @public
 */
export const removeDatasetUpdater = <S extends VisState>(
  state: S,
  action: VisStateActions.RemoveDatasetUpdaterAction
): S => {
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

  const indexes = layers.reduce((listOfIndexes, layer, index) => {
    if (layer.config.dataId === datasetKey) {
      // @ts-ignore
      listOfIndexes.push(index);
    }
    return listOfIndexes;
  }, []);

  // remove layers and datasets
  const {newState} = indexes.reduce(
    ({newState: currentState, indexCounter}, idx) => {
      const currentIndex = idx - indexCounter;
      currentState = removeLayerUpdater(currentState, {idx: currentIndex});
      indexCounter++;
      return {newState: currentState, indexCounter};
    },
    {newState: {...state, datasets: newDatasets}, indexCounter: 0}
  );

  // remove filters
  const filters = state.filters.filter(filter => !filter.dataId.includes(datasetKey));

  // update interactionConfig
  let {interactionConfig} = state;
  const {tooltip} = interactionConfig;
  if (tooltip) {
    const {config} = tooltip;
    /* eslint-disable no-unused-vars */
    const {[datasetKey]: fields, ...fieldsToShow} = config.fieldsToShow;
    /* eslint-enable no-unused-vars */
    interactionConfig = {
      ...interactionConfig,
      tooltip: {...tooltip, config: {...config, fieldsToShow}}
    };
  }

  return {...newState, filters, interactionConfig};
};

/**
 * update layer blending mode
 * @memberof visStateUpdaters
 * @public
 */
export const updateLayerBlendingUpdater = <S extends VisState>(
  state: S,
  action: VisStateActions.UpdateLayerBlendingUpdaterAction
): S => ({
  ...state,
  layerBlending: action.mode
});

/**
 * Display dataset table in a modal
 * @memberof visStateUpdaters
 * @public
 */
export const showDatasetTableUpdater = <S extends VisState>(
  state: S,
  action: VisStateActions.ShowDatasetTableUpdaterAction
): S => {
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
  const {dataId, newColor} = action;
  const {datasets} = state;

  if (isRgbColor(newColor)) {
    const existing = datasets[dataId];
    existing.updateTableColor(newColor);

    return {
      ...state,
      datasets: {
        ...state.datasets,
        [dataId]: copyTableAndUpdate(existing, {})
      }
    };
  }
  return state;
};

/**
 * reset visState to initial State
 * @memberof visStateUpdaters
 * @public
 */
export const resetMapConfigUpdater = <S extends VisState>(state: S): S =>
  ({
    ...INITIAL_VIS_STATE,
    ...state.initialState,
    initialState: state.initialState
  } as S);

/**
 * Propagate `visState` reducer with a new configuration. Current config will be override.
 * @memberof visStateUpdaters
 * @public
 */
export const receiveMapConfigUpdater = <S extends VisState>(
  state: S,
  {
    payload: {config = {version: ''}, options = {}}
  }: {
    type?: typeof ActionTypes.RECEIVE_MAP_CONFIG;
    payload: ReceiveMapConfigPayload;
  }
): S => {
  if (!config.visState) {
    return state;
  }

  const {keepExistingConfig} = options;

  // reset config if keepExistingConfig is falsy
  let mergedState = !keepExistingConfig ? resetMapConfigUpdater(state) : state;
  for (const merger of state.mergers) {
    if (isValidMerger(merger) && config.visState[merger.prop]) {
      mergedState = merger.merge(mergedState, config.visState[merger.prop], true);
    }
  }

  return mergedState;
};

/**
 * Trigger layer hover event with hovered object
 * @memberof visStateUpdaters
 * @public
 */
export const layerHoverUpdater = <S extends VisState>(
  state: S,
  action: VisStateActions.OnLayerHoverUpdaterAction
): S => ({
  ...state,
  hoverInfo: {
    // deck.gl info is mutable
    ...action.info
  }
});

/* eslint-enable max-statements */

/**
 * Update `interactionConfig`
 * @memberof visStateUpdaters
 * @public
 */
export function interactionConfigChangeUpdater<S extends VisState>(
  state: S,
  action: VisStateActions.InteractionConfigChangeUpdaterAction
): S {
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
export const layerClickUpdater = <S extends VisState>(
  state: S,
  action: VisStateActions.OnLayerClickUpdaterAction
): S => ({
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
export const mapClickUpdater = <S extends VisState>(
  state: S,
  action: VisStateActions.OnMapClickUpdaterAction
): S => {
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
export const mouseMoveUpdater = <S extends VisState>(
  state: S,
  {evt}: VisStateActions.OnMouseMoveUpdaterAction
): S => {
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
export const toggleSplitMapUpdater = <S extends VisState>(
  state: S,
  action: MapStateActions.ToggleSplitMapUpdaterAction
): S =>
  state.splitMaps && state.splitMaps.length === 0
    ? {
        ...state,
        // maybe we should use an array to store state for a single map as well
        // if current maps length is equal to 0 it means that we are about to split the view
        splitMaps: computeSplitMapLayers(state.layers)
      }
    : closeSpecificMapAtIndex(state, action);

/**
 * Toggle visibility of a layer in a split map
 * @memberof visStateUpdaters
 * @public
 */
export const toggleLayerForMapUpdater = <S extends VisState>(
  state: S,
  {mapIndex, layerId}: VisStateActions.ToggleLayerForMapUpdaterAction
): S => {
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
/* eslint-disable max-statements */
// eslint-disable-next-line complexity
export const updateVisDataUpdater = <S extends VisState>(
  state: S,
  action: VisStateActions.UpdateVisDataUpdaterAction
): S => {
  // datasets can be a single data entries or an array of multiple data entries
  const {config, options} = action;
  const datasets = toArray(action.datasets);

  const newDataEntries = datasets.reduce(
    (accu, {info = {}, ...rest} = {}) => ({
      ...accu,
      ...(createNewDataEntry({info, ...rest}, state.datasets) || {})
    }),
    {}
  );

  const dataEmpty = Object.keys(newDataEntries).length < 1;

  // apply config if passed from action
  const previousState = config
    ? receiveMapConfigUpdater(state, {
        payload: {config, options}
      })
    : state;

  let mergedState = {
    ...previousState,
    datasets: {
      ...previousState.datasets,
      ...newDataEntries
    }
  };

  // merge state with config to be merged
  for (const merger of mergedState.mergers) {
    if (isValidMerger(merger) && merger.toMergeProp && mergedState[merger.toMergeProp]) {
      const toMerge = mergedState[merger.toMergeProp];
      mergedState[merger.toMergeProp] = INITIAL_VIS_STATE[merger.toMergeProp];
      mergedState = merger.merge(mergedState, toMerge);
    }
  }

  let newLayers = !dataEmpty
    ? mergedState.layers.filter(l => l.config.dataId && l.config.dataId in newDataEntries)
    : [];

  if (!newLayers.length && (options || {}).autoCreateLayers !== false) {
    // no layer merged, find defaults
    const result = addDefaultLayers(mergedState, newDataEntries);
    mergedState = result.state;
    newLayers = result.newLayers;
  }

  if (mergedState.splitMaps.length) {
    // if map is split, add new layers to splitMaps
    newLayers = mergedState.layers.filter(
      l => l.config.dataId && l.config.dataId in newDataEntries
    );
    mergedState = {
      ...mergedState,
      splitMaps: addNewLayersToSplitMap(mergedState.splitMaps, newLayers)
    };
  }

  // if no tooltips merged add default tooltips
  Object.keys(newDataEntries).forEach(dataId => {
    const tooltipFields = mergedState.interactionConfig.tooltip.config.fieldsToShow[dataId];
    if (!Array.isArray(tooltipFields) || !tooltipFields.length) {
      mergedState = addDefaultTooltips(mergedState, newDataEntries[dataId]);
    }
  });

  let updatedState = updateAllLayerDomainData(
    mergedState,
    dataEmpty ? Object.keys(mergedState.datasets) : Object.keys(newDataEntries),
    undefined
  );

  // register layer animation domain,
  // need to be called after layer data is calculated
  updatedState = updateAnimationDomain(updatedState);

  return updatedState;
};
/* eslint-enable max-statements */

/**
 * Rename an existing dataset in `visState`
 * @memberof visStateUpdaters
 * @public
 */
export function renameDatasetUpdater<S extends VisState>(
  state: S,
  action: VisStateActions.RenameDatasetUpdaterAction
): S {
  const {dataId, label} = action;
  const {datasets} = state;
  const existing = datasets[dataId];

  if (existing) {
    const newDataset = copyTableAndUpdate(existing, {label});
    return {
      ...state,
      datasets: {
        ...datasets,
        [dataId]: newDataset
      }
    };
  }

  // No-op if the dataset doesn't exist
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
export const loadFilesUpdater = <S extends VisState>(
  state: S,
  action: VisStateActions.LoadFilesUpdaterAction
): S => {
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
export function loadFileStepSuccessUpdater<S extends VisState>(
  state: S,
  action: VisStateActions.LoadFileStepSuccessAction
): S {
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
export function loadNextFileUpdater<S extends VisState>(state: S): S {
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
export function processFileContentUpdater<S extends VisState>(
  state: S,
  action: VisStateActions.ProcessFileContentUpdaterAction
): S {
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
export const nextFileBatchUpdater = <S extends VisState>(
  state: S,
  {
    payload: {gen, fileName, progress, accumulated, onFinish}
  }: VisStateActions.NextFileBatchUpdaterAction
): S => {
  const stateWithProgress = updateFileLoadingProgressUpdater(state, {
    fileName,
    progress: parseProgress(state.fileLoadingProgress[fileName], progress)
  });
  return withTask(
    stateWithProgress,
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
  );
};

/**
 * Trigger loading file error
 * @memberof visStateUpdaters
 * @public
 */
export const loadFilesErrUpdater = <S extends VisState>(
  state: S,
  {error, fileName}: VisStateActions.LoadFilesErrUpdaterAction
): S => {
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
export const applyCPUFilterUpdater = <S extends VisState>(
  state: S,
  {dataId}: VisStateActions.ApplyCPUFilterUpdaterAction
): S => {
  // apply cpuFilter
  const dataIds = toArray(dataId);

  return dataIds.reduce((accu, id) => filterDatasetCPU(accu, id), state);
};

/**
 * User input to update the info of the map
 * @memberof visStateUpdaters
 * @public
 */
export const setMapInfoUpdater = <S extends VisState>(
  state: S,
  action: VisStateActions.SetMapInfoUpdaterAction
): S => ({
  ...state,
  mapInfo: {
    ...state.mapInfo,
    ...action.info
  }
});
/**
 * Helper function to update All layer domain and layer data of state
 */
export function addDefaultLayers<S extends VisState>(
  state: S,
  datasets: Datasets
): {state: S; newLayers: Layer[]} {
  const empty: Layer[] = [];
  const defaultLayers = Object.values(datasets).reduce((accu, dataset) => {
    const foundLayers = findDefaultLayer(dataset, state.layerClasses);
    return foundLayers && foundLayers.length ? accu.concat(foundLayers) : accu;
  }, empty);

  return {
    state: {
      ...state,
      layers: [...state.layers, ...defaultLayers],
      layerOrder: [
        // put new layers on top of old ones
        ...defaultLayers.map((_, i) => state.layers.length + i),
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
export function updateAllLayerDomainData<S extends VisState>(
  state: S,
  dataId: string | string[],
  updatedFilter?: Filter
): S {
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
export const setEditorModeUpdater = <S extends VisState>(
  state: S,
  {mode}: VisStateActions.SetEditorModeUpdaterAction
): S => ({
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
export function setFeaturesUpdater<S extends VisState>(
  state: S,
  {features = []}: VisStateActions.SetFeaturesUpdaterAction
): S {
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
export const setSelectedFeatureUpdater = <S extends VisState>(
  state: S,
  {feature}: VisStateActions.SetSelectedFeatureUpdaterAction
): S => ({
  ...state,
  editor: {
    ...state.editor,
    selectedFeature: feature
  }
});

/**
 * Delete existing feature from filters
 * @memberof visStateUpdaters
 */
export function deleteFeatureUpdater<S extends VisState>(
  state: S,
  {feature}: VisStateActions.DeleteFeatureUpdaterAction
): S {
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
export function setPolygonFilterLayerUpdater<S extends VisState>(
  state: S,
  payload: VisStateActions.SetPolygonFilterLayerUpdaterAction
): S {
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
export function sortTableColumnUpdater<S extends VisState>(
  state: S,
  {dataId, column, mode}: VisStateActions.SortTableColumnUpdaterAction
): S {
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
export function pinTableColumnUpdater<S extends VisState>(
  state: S,
  {dataId, column}: VisStateActions.PinTableColumnUpdaterAction
): S {
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
export function copyTableColumnUpdater<S extends VisState>(
  state: S,
  {dataId, column}: VisStateActions.CopyTableColumnUpdaterAction
): S {
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
 * Update editor
 */
export function toggleEditorVisibilityUpdater<S extends VisState>(
  state: S,
  action: VisStateActions.ToggleEditorVisibilityUpdaterAction
): S {
  return {
    ...state,
    editor: {
      ...state.editor,
      visible: !state.editor.visible
    }
  };
}

export function setFilterAnimationTimeConfigUpdater<S extends VisState>(
  state: S,
  {idx, config}: VisStateActions.SetFilterAnimationTimeConfigAction
): S {
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
export function setLayerAnimationTimeConfigUpdater<S extends VisState>(
  state: S,
  {config}: VisStateActions.SetLayerAnimationTimeConfigAction
): S {
  if (!config) {
    return state;
  }
  const updates = checkTimeConfigArgs(config);
  return pick_('animationConfig')(merge_(updates))(state);
}
