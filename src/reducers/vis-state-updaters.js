// Copyright (c) 2019 Uber Technologies, Inc.
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
import Task, {disableStackCapturing, withTask} from 'react-palm/tasks';
import cloneDeep from 'lodash.clonedeep';

// Tasks
import {LOAD_FILE_TASK} from 'tasks/tasks';

// Actions
import {loadFilesErr} from 'actions/vis-state-actions';
import {addDataToMap} from 'actions';

// Utils
import {getDefaultInteraction, findFieldsToShow} from 'utils/interaction-utils';
import {
  getDefaultFilter,
  getFilterProps,
  getFilterPlot,
  getDefaultFilterPlotType,
  filterData
} from 'utils/filter-utils';
import {createNewDataEntry} from 'utils/dataset-utils';

import {
  findDefaultLayer,
  calculateLayerData,
  getTimeAnimationDomainForTripLayer
} from 'utils/layer-utils/layer-utils';

import {
  mergeFilters,
  mergeLayers,
  mergeInteractions,
  mergeLayerBlending
} from './vis-state-merger';

import {Layer, LayerClasses} from 'layers';
import {processFileToLoad} from '/utils/file-utils';
import {DEFAULT_TEXT_LABEL} from 'layers/layer-factory';

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
const visStateUpdaters = null;
/* eslint-enable no-unused-vars */

/**
 * Default initial `visState`
 * @memberof visStateUpdaters
 * @constant
 * @type {Object}
 * @property {Array} layers
 * @property {Array} layerData
 * @property {Array} layerToBeMerged
 * @property {Array} layerOrder
 * @property {Array} filters
 * @property {Array} filterToBeMerged
 * @property {Array} datasets
 * @property {string} editingDataset
 * @property {Object} interactionConfig
 * @property {Object} interactionToBeMerged
 * @property {string} layerBlending
 * @property {Object} hoverInfo
 * @property {Object} clicked
 * @property {boolean} fileLoading
 * @property {*} fileLoadingErr
 * @property {Array} splitMaps - a list of objects of layer availabilities and visibilities for each map
 * @public
 */
export const INITIAL_VIS_STATE = {
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

  interactionConfig: getDefaultInteraction(),
  interactionToBeMerged: undefined,

  layerBlending: 'normal',
  hoverInfo: undefined,
  clicked: undefined,
  mousePos: {},

  // TODO: not used anywhere, delete it
  fileLoading: false,
  fileLoadingErr: null,

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
  //
  // defaults layer classes
  layerClasses: LayerClasses,

  // default animation
  animationConfig: {
    domain: [null, null],
    currentTime: 0,
    duration: 10,
    speed: 1
  }
};

function updateStateWithLayerAndData(state, {layerData, layer, idx}) {
  return {
    ...state,
    layers: state.layers.map((lyr, i) => (i === idx ? layer : lyr)),
    layerData: layerData
      ? state.layerData.map((d, i) => (i === idx ? layerData : d))
      : state.layerData
  };
}

/**
 * Update layer base config: dataId, label, column, isVisible
 * @memberof visStateUpdaters
 * @param {Object} state `visState`
 * @param {Object} action action
 * @param {Object} action.oldLayer layer to be updated
 * @param {Object} action.newConfig new config
 * @returns {Object} nextState
 */
export function layerConfigChangeUpdater(state, action) {
  const {oldLayer} = action;
  const idx = state.layers.findIndex(l => l.id === oldLayer.id);
  const props = Object.keys(action.newConfig);
  const newLayer = oldLayer.updateLayerConfig(action.newConfig);
  if (newLayer.shouldCalculateLayerData(props)) {
    const oldLayerData = state.layerData[idx];
    const {layerData, layer} = calculateLayerData(newLayer, state, oldLayerData, {
      sameData: true
    });
    return updateStateWithLayerAndData(state, {layerData, layer, idx});
  }

  let newState = state;
  if ('isVisible' in action.newConfig && state.splitMaps.length) {
    newState = {
      ...state,
      splitMaps: action.newConfig.isVisible
        ? addNewLayersToSplitMap(state.splitMaps, newLayer)
        : removeLayerFromSplitMaps(state.splitMaps, newLayer)
    };
  }

  return updateStateWithLayerAndData(newState, {layer: newLayer, idx});
}

function addOrRemoveTextLabels(newFields, textLabel) {
  let newTextLabel = textLabel.slice();

  const currentFields = textLabel
    .map(tl => tl.field && tl.field.name)
    .filter(d => d);

  const addFields = newFields.filter(f => !currentFields.includes(f.name));
  const deleteFields = currentFields.filter(
    f => !newFields.find(fd => fd.name === f)
  );

  // delete
  newTextLabel = newTextLabel.filter(
    tl => tl.field && !deleteFields.includes(tl.field.name)
  );
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
  let newTextLabel = textLabel.slice();

  if (prop && (value || textLabel.length === 1)) {
    newTextLabel = textLabel.map((tl, i) =>
      i === idx ? {...tl, [prop]: value} : tl
    );
  } else if (prop === 'field' && value === null && textLabel.length > 1) {
    // remove label when field value is set to null
    newTextLabel.splice(idx, 1);
  }

  return newTextLabel;
}

export function layerTextLabelChangeUpdater(state, action) {
  const {oldLayer, idx, prop, value} = action;
  const {textLabel} = oldLayer.config;

  let newTextLabel = textLabel.slice();

  if (idx === 'all' && prop === 'fields') {
    newTextLabel = addOrRemoveTextLabels(value, textLabel);
  }

  // if idx is set to length, add empty text label
  if (!textLabel[idx] && idx === textLabel.length) {
    newTextLabel = [...textLabel, DEFAULT_TEXT_LABEL];
  }

  // update text label prop and value
  newTextLabel = updateTextLabelPropAndValue(idx, prop, value, newTextLabel);

  return layerConfigChangeUpdater(state, {
    oldLayer,
    newConfig: {textLabel: newTextLabel}
  });
}

/**
 * Update layer type. Previews layer config will be copied if applicable.
 * @memberof visStateUpdaters
 * @param {Object} state `visState`
 * @param {Object} action action
 * @param {Object} action.oldLayer layer to be updated
 * @param {string} action.newType new type
 * @returns {Object} nextState
 * @public
 */
export function layerTypeChangeUpdater(state, action) {
  const {oldLayer, newType} = action;
  const oldId = oldLayer.id;
  const idx = state.layers.findIndex(l => l.id === oldId);

  if (!state.layerClasses[newType]) {
    Console.error(`${newType} is not a valid layer type`);
    return state;
  }

  // get a mint layer, with new id and type
  // because deck.gl uses id to match between new and old layer.
  // If type has changed but id is the same, it will break
  const newLayer = new state.layerClasses[newType]();

  newLayer.assignConfigToLayer(oldLayer.config, oldLayer.visConfigSettings);

  if (newLayer.config.dataId) {
    const dataset = state.datasets[newLayer.config.dataId];
    newLayer.updateLayerDomain(dataset);
  }

  const {layerData, layer} = calculateLayerData(newLayer, state);

  let newState = state;

  // update splitMap layer id
  if (state.splitMaps.length) {
    newState = {
      ...state,
      splitMaps: state.splitMaps.map(settings => {
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

  return updateStateWithLayerAndData(newState, {layerData, layer, idx});
}

/**
 * Update layer visual channel
 * @memberof visStateUpdaters
 * @param {Object} state `visState`
 * @param {Object} action action
 * @param {Object} action.oldLayer layer to be updated
 * @param {Object} action.newConfig new visual channel config
 * @param {string} action.channel channel to be updated
 * @returns {Object} nextState
 * @public
 */
export function layerVisualChannelChangeUpdater(state, action) {
  const {oldLayer, newConfig, channel} = action;
  const dataset = state.datasets[oldLayer.config.dataId];

  const idx = state.layers.findIndex(l => l.id === oldLayer.id);
  const newLayer = oldLayer.updateLayerConfig(newConfig);

  newLayer.updateLayerVisualChannel(dataset, channel);

  const oldLayerData = state.layerData[idx];
  const {layerData, layer} = calculateLayerData(newLayer, state, oldLayerData, {
    sameData: true
  });

  return updateStateWithLayerAndData(state, {layerData, layer, idx});
}

/**
 * Update layer `visConfig`
 * @memberof visStateUpdaters
 * @param {Object} state `visState`
 * @param {Object} action action
 * @param {Object} action.oldLayer layer to be updated
 * @param {Object} action.newVisConfig new visConfig as a key value map: e.g. `{opacity: 0.8}`
 * @returns {Object} nextState
 * @public
 */
export function layerVisConfigChangeUpdater(state, action) {
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
    const {layerData, layer} = calculateLayerData(newLayer, state, oldLayerData, {
      sameData: true
    });
    return updateStateWithLayerAndData(state, {layerData, layer, idx});
  }

  return updateStateWithLayerAndData(state, {layer: newLayer, idx});
}

/* eslint-enable max-statements */

/**
 * Update `interactionConfig`
 * @memberof visStateUpdaters
 * @param {Object} state `visState`
 * @param {Object} action action
 * @param {Object} action.config new config as key value map: `{tooltip: {enabled: true}}`
 * @returns {Object} nextState
 * @public
 */
export function interactionConfigChangeUpdater(state, action) {
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

  return {
    ...state,
    interactionConfig
  };
}

/**
 * Update filter property
 * @memberof visStateUpdaters
 * @param {Object} state `visState`
 * @param {Object} action action
 * @param {Number} action.idx `idx` of filter to be updated
 * @param {string} action.prop `prop` of filter, e,g, `dataId`, `name`, `value`
 * @param {*} action.value new value
 * @returns {Object} nextState
 * @public
 */
export function setFilterUpdater(state, action) {
  const {idx, prop, value} = action;
  let newState = state;
  let newFilter = {
    ...state.filters[idx],
    [prop]: value
  };

  const {dataId} = newFilter;
  if (!dataId) {
    return state;
  }
  const {fields, allData} = state.datasets[dataId];

  switch (prop) {
    case 'dataId':
      // if trying to update filter dataId. create an empty new filter
      newFilter = getDefaultFilter(dataId);
      break;

    case 'name':
      // find the field
      const fieldIdx = fields.findIndex(f => f.name === value);
      let field = fields[fieldIdx];

      if (!field.filterProp) {
        // get filter domain from field
        // save filterProps: {domain, steps, value} to field, avoid recalculate
        field = {
          ...field,
          filterProp: getFilterProps(allData, field)
        };
      }

      newFilter = {
        ...newFilter,
        ...field.filterProp,
        name: field.name,
        // can't edit dataId once name is selected
        freeze: true,
        fieldIdx
      };
      const enlargedFilterIdx = state.filters.findIndex(f => f.enlarged);
      if (enlargedFilterIdx > -1 && enlargedFilterIdx !== idx) {
        // there should be only one enlarged filter
        newFilter.enlarged = false;
      }

      newState = {
        ...state,
        datasets: {
          ...state.datasets,
          [dataId]: {
            ...state.datasets[dataId],
            fields: fields.map((d, i) => (i === fieldIdx ? field : d))
          }
        }
      };
      break;
    case 'value':
    default:
      break;
  }

  // save new filters to newState
  newState = {
    ...newState,
    filters: state.filters.map((f, i) => (i === idx ? newFilter : f))
  };

  // filter data
  newState = {
    ...newState,
    datasets: {
      ...newState.datasets,
      [dataId]: {
        ...newState.datasets[dataId],
        ...filterData(allData, dataId, newState.filters)
      }
    }
  };

  newState = updateAllLayerDomainData(newState, dataId, newFilter);

  return newState;
}

/**
 * Set the property of a filter plot
 * @memberof visStateUpdaters
 * @param {Object} state `visState`
 * @param {Object} action action
 * @param {Number} action.idx
 * @param {Object} action.newProp key value mapping of new prop `{yAxis: 'histogram'}`
 * @returns {Object} nextState
 * @public
 */
export const setFilterPlotUpdater = (state, {idx, newProp}) => {
  let newFilter = {...state.filters[idx], ...newProp};
  const prop = Object.keys(newProp)[0];
  if (prop === 'yAxis') {
    const plotType = getDefaultFilterPlotType(newFilter);

    if (plotType) {
      newFilter = {
        ...newFilter,
        ...getFilterPlot(
          {...newFilter, plotType},
          state.datasets[newFilter.dataId].allData
        ),
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
 * @param {Object} state `visState`
 * @param {Object} action action
 * @param {string} action.dataId dataset `id` this new filter is associated with
 * @returns {Object} nextState
 * @public
 */
export const addFilterUpdater = (state, action) =>
  !action.dataId
    ? state
    : {
        ...state,
        filters: [...state.filters, getDefaultFilter(action.dataId)]
      };

/**
 * Start and end filter animation
 * @memberof visStateUpdaters
 * @param {Object} state `visState`
 * @param {Object} action action
 * @param {Number} action.idx idx of filter
 * @returns {Object} nextState
 * @public
 */
export const toggleFilterAnimationUpdater = (state, action) => ({
  ...state,
  filters: state.filters.map((f, i) =>
    i === action.idx ? {...f, isAnimating: !f.isAnimating} : f
  )
});

/**
 * Change filter animation speed
 * @memberof visStateUpdaters
 * @param {Object} state `visState`
 * @param {Object} action action
 * @param {Number} action.idx  `idx` of filter
 * @param {Number} action.speed `speed` to change it to. `speed` is a multiplier
 * @returns {Object} nextState
 * @public
 */
export const updateAnimationSpeedUpdater = (state, action) => ({
  ...state,
  filters: state.filters.map((f, i) =>
    i === action.idx ? {...f, speed: action.speed} : f
  )
});

/**
 * Update animation config current time
 * @memberof visStateUpdaters
 * @param {Object} state `visState`
 * @param {Object} action action
 * @param {Number} action.speed current speed of animation
 * @returns {Object} nextState
 * @public
 *
 */

export const playAnimationUpdater = (state, { speed }) => {
  const timeRange = state.animationConfig.domain[1] - state.animationConfig.domain[0]
  const baseSpeed = Math.floor(timeRange / 500)
  return {
    ...state,
    animationConfig: {
      ...state.animationConfig,
      currentTime: state.animationConfig.currentTime + speed * baseSpeed
    }
  }
}

/**
 * Reset animation config current time to a specified value
 * @memberof visStateUpdaters
 * @param {Object} state `visState`
 * @param {Object} action action
 * @param {Number} action.value the value current time will be set to
 * @returns {Object} nextState
 * @public
 *
 */

export const resetAnimationUpdater = (state, {value}) => ({
  ...state,
  animationConfig: {
    ...state.animationConfig,
    currentTime: value
  }
});

function updateAnimationDomain(state) {
  // merge all animatable layer domain calculate the union
  // state.layers.config.animation.domain
  // take state.layer
  const animatableLayers = state.layers.filter(l => l.config.animation.enabled);

  const mergedDomain = animatableLayers.reduce((accu, layer) => (
    [
      Math.min(accu[0], layer.config.animation.domain[0]),
      Math.max(accu[1], layer.config.animation.domain[1])
    ]
  ), [Number(Infinity), -Infinity]);

  return {
    ...state,
    animationConfig: {
      ...state.animationConfig,
      currentTime: mergedDomain[0],
      domain: mergedDomain
    }
  };
}

/**
 * Set animation domain with the min and max of timestamps from geojson
 * Enable multi-layer domain range
 * @memberof visStateUpdaters
 * @param {Object} state `visState`
 * @param {Object} action action
 *  @param {Object} action.oldLayer the layer object to be updated
 * @returns {Object} nextState
 * @public
 *
 */

export const enableLayerAnimationUpdater = (state, oldLayer) => {
  // calculate animation domain for the layer enabled
  // layer.config.animation.domain
  // update newLayer into the state.layers
  // merge all animatable layer domain calculate the union
  const domain = getTimeAnimationDomainForTripLayer(
    oldLayer[0],
    state.datasets
  );

  const newLayer = oldLayer[0].updateLayerConfig({
    animation: {
      ...oldLayer[0].config.animation,
      domain
    }
  });

  const idx = state.layers.findIndex(l => l.id === oldLayer.id);
  const oldLayerData = state.layerData[idx];
  const {layerData, layer} = calculateLayerData(newLayer, state, oldLayerData, {
    sameData: true
  });

  const newState = updateStateWithLayerAndData(state, {layerData, layer, idx});

  return updateAnimationDomain(newState);
};

/**
 * Update animation speed with the vertical speed slider
 * @memberof visStateUpdaters
 * @param {Object} state `visState`
 * @param {Object} action action
 * @param {Number} action.value the speed of the animation
 * @returns {Object} nextState
 * @public
 *
 */

export const updateSpeedUpdater = (state, {speed}) => {
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
 * @param {Object} state `visState`
 * @param {Object} action action
 * @param {Number} action.idx index of filter to enlarge
 * @returns {Object} nextState
 * @public
 */
export const enlargeFilterUpdater = (state, action) => {
  const isEnlarged = state.filters[action.idx].enlarged;

  return {
    ...state,
    filters: state.filters.map((f, i) => {
      f.enlarged = !isEnlarged && i === action.idx;
      return f;
    })
  };
};

/**
 * Remove a filter
 * @memberof visStateUpdaters
 * @param {Object} state `visState`
 * @param {Object} action action
 * @param {Number} action.idx index of filter to b e removed
 * @returns {Object} nextState
 * @public
 */
export const removeFilterUpdater = (state, action) => {
  const {idx} = action;
  const {dataId} = state.filters[idx];

  const newFilters = [
    ...state.filters.slice(0, idx),
    ...state.filters.slice(idx + 1, state.filters.length)
  ];

  const newState = {
    ...state,
    datasets: {
      ...state.datasets,
      [dataId]: {
        ...state.datasets[dataId],
        ...filterData(state.datasets[dataId].allData, dataId, newFilters)
      }
    },
    filters: newFilters
  };

  return updateAllLayerDomainData(newState, dataId);
};

/**
 * Add a new layer
 * @memberof visStateUpdaters
 * @param {Object} state `visState`
 * @param {Object} action action
 * @param {Object} action.props - new layer props
 * @returns {Object} nextState
 * @public
 */
export const addLayerUpdater = (state, action) => {
  const defaultDataset = Object.keys(state.datasets)[0];
  const newLayer = new Layer({
    isVisible: true,
    isConfigActive: true,
    dataId: defaultDataset,
    ...action.props
  });

  return {
    ...state,
    layers: [...state.layers, newLayer],
    layerData: [...state.layerData, {}],
    layerOrder: [...state.layerOrder, state.layerOrder.length],
    splitMaps: addNewLayersToSplitMap(state.splitMaps, newLayer)
  };
};

/**
 * remove layer
 * @memberof visStateUpdaters
 * @param {Object} state `visState`
 * @param {Object} action action
 * @param {Number} action.idx index of layer to b e removed
 * @returns {Object} nextState
 * @public
 */
export const removeLayerUpdater = (state, {idx}) => {
  const {layers, layerData, clicked, hoverInfo} = state;
  const layerToRemove = state.layers[idx];
  const newMaps = removeLayerFromSplitMaps(state.splitMaps, layerToRemove);

  const newState = {
    ...state,
    layers: [...layers.slice(0, idx), ...layers.slice(idx + 1, layers.length)],
    layerData: [
      ...layerData.slice(0, idx),
      ...layerData.slice(idx + 1, layerData.length)
    ],
    layerOrder: state.layerOrder
      .filter(i => i !== idx)
      .map(pid => (pid > idx ? pid - 1 : pid)),
    clicked: layerToRemove.isLayerHovered(clicked) ? undefined : clicked,
    hoverInfo: layerToRemove.isLayerHovered(hoverInfo) ? undefined : hoverInfo,
    splitMaps: newMaps
  };

  return updateAnimationDomain(newState);
};

/**
 * Reorder layer
 * @memberof visStateUpdaters
 * @param {Object} state `visState`
 * @param {Object} action action
 * @param {Array<Number>} action.order an array of layer indexes
 * @returns {Object} nextState
 * @public
 */
export const reorderLayerUpdater = (state, {order}) => ({
  ...state,
  layerOrder: order
});

/**
 * Remove a dataset and all layers, filters, tooltip configs that based on it
 * @memberof visStateUpdaters
 * @param {Object} state `visState`
 * @param {Object} action action
 * @param {string} action.key dataset id
 * @returns {Object} nextState
 * @public
 */
export const removeDatasetUpdater = (state, action) => {
  // extract dataset key
  const {key: datasetKey} = action;
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
  const filters = state.filters.filter(filter => filter.dataId !== datasetKey);

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
 * @param {Object} state `visState`
 * @param {Object} action action
 * @param {string} action.mode one of `additive`, `normal` and `subtractive`
 * @returns {Object} nextState
 * @public
 */
export const updateLayerBlendingUpdater = (state, action) => ({
  ...state,
  layerBlending: action.mode
});

/**
 * Display dataset table in a modal
 * @memberof visStateUpdaters
 * @param {Object} state `visState`
 * @param {Object} action action
 * @param {string} action.dataId dataset id to show in table
 * @returns {Object} nextState
 * @public
 */
export const showDatasetTableUpdater = (state, action) => {
  return {
    ...state,
    editingDataset: action.dataId
  };
};

/**
 * reset visState to initial State
 * @memberof visStateUpdaters
 * @param {Object} state `visState`
 * @returns {Object} nextState
 * @public
 */
export const resetMapConfigVisStateUpdater = state => ({
  ...INITIAL_VIS_STATE,
  ...state.initialState,
  initialState: state.initialState
});

/**
 * Propagate `visState` reducer with a new configuration. Current config will be override.
 * @memberof visStateUpdaters
 * @param {Object} state `visState`
 * @param {Object} action action
 * @param {Object} action.payload map config to be propagated
 * @returns {Object} nextState
 * @public
 */
export const receiveMapConfigUpdater = (state, action) => {
  if (!action.payload.visState) {
    return state;
  }

  const {
    filters,
    layers,
    interactionConfig,
    layerBlending,
    splitMaps
  } = action.payload.visState;

  // always reset config when receive a new config
  const resetState = resetMapConfigVisStateUpdater(state);
  let mergedState = {
    ...resetState,
    splitMaps: splitMaps || [] // maps doesn't require any logic
  };

  mergedState = mergeFilters(mergedState, filters);
  mergedState = mergeLayers(mergedState, layers);
  mergedState = mergeInteractions(mergedState, interactionConfig);
  mergedState = mergeLayerBlending(mergedState, layerBlending);

  return mergedState;
};

/**
 * Trigger layer hover event with hovered object
 * @memberof visStateUpdaters
 * @param {Object} state `visState`
 * @param {Object} action action
 * @param {Object} action.info Object hovered, returned by deck.gl
 * @returns {Object} nextState
 * @public
 */
export const layerHoverUpdater = (state, action) => ({
  ...state,
  hoverInfo: action.info
});

/**
 * Trigger layer click event with clicked object
 * @memberof visStateUpdaters
 * @param {Object} state `visState`
 * @param {Object} action action
 * @param {Object} action.info Object clicked, returned by deck.gl
 * @returns {Object} nextState
 * @public
 */
export const layerClickUpdater = (state, action) => ({
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
 * @param {Object} state `visState`
 * @returns {Object} nextState
 * @public
 */
export const mapClickUpdater = state => {
  return {
    ...state,
    clicked: null
  };
};

export const mouseMoveUpdater = (state, {evt}) => {
  if (Object.values(state.interactionConfig).some(config => config.enabled)) {
    return {
      ...state,
      mousePos: {
        ...state.mousePos,
        mousePosition: [...evt.point],
        coordinate: [...evt.lngLat]
      }
    };
  }

  return state;
};
/**
 * Toggle visibility of a layer for a split map
 * @memberof visStateUpdaters
 * @param {Object} state `visState`
 * @param {Object} action action
 * @param {Number|undefined} action.payload index of the split map
 * @returns {Object} nextState
 * @public
 */
export const toggleSplitMapUpdater = (state, action) =>
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
 * @param {Object} state
 * @param {Object} action
 * @param {Number} action.mapIndex index of the split map
 * @param {string} action.layerId id of the layer
 * @returns {Object} nextState
 * @public
 */
export const toggleLayerForMapUpdater = (state, {mapIndex, layerId}) => {
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
 * @param {Object} state `visState`
 * @param {Object} action action
 * @param {Array<Object>|Object} action.datasets - ***required** datasets can be a dataset or an array of datasets
 * Each dataset object needs to have `info` and `data` property.
 * @param {Object} action.datasets.info -info of a dataset
 * @param {string} action.datasets.info.id - id of this dataset. If config is defined, `id` should matches the `dataId` in config.
 * @param {string} action.datasets.info.label - A display name of this dataset
 * @param {Object} action.datasets.data - ***required** The data object, in a tabular format with 2 properties `fields` and `rows`
 * @param {Array<Object>} action.datasets.data.fields - ***required** Array of fields,
 * @param {string} action.datasets.data.fields.name - ***required** Name of the field,
 * @param {Array<Array>} action.datasets.data.rows - ***required** Array of rows, in a tabular format with `fields` and `rows`
 * @param {Object} action.options option object `{centerMap: true}`
 * @param {Object} action.config map config
 * @returns {Object} nextState
 * @public
 */
/* eslint-disable max-statements */
export const updateVisDataUpdater = (state, action) => {
  // datasets can be a single data entries or an array of multiple data entries
  const datasets = Array.isArray(action.datasets)
    ? action.datasets
    : [action.datasets];
  if (action.config) {
    // apply config if passed from action
    state = receiveMapConfigUpdater(state, {
      payload: {visState: action.config}
    });
  }

  const newDateEntries = datasets.reduce(
    (accu, {info = {}, data}) => ({
      ...accu,
      ...(createNewDataEntry({info, data}, state.datasets) || {})
    }),
    {}
  );
  if (!Object.keys(newDateEntries).length) {
    return state;
  }

  const stateWithNewData = {
    ...state,
    datasets: {
      ...state.datasets,
      ...newDateEntries
    }
  };

  // previously saved config before data loaded
  const {
    filterToBeMerged = [],
    layerToBeMerged = [],
    interactionToBeMerged = {}
  } = stateWithNewData;

  // merge state with saved filters
  let mergedState = mergeFilters(stateWithNewData, filterToBeMerged);
  // merge state with saved layers
  mergedState = mergeLayers(mergedState, layerToBeMerged);

  if (mergedState.layers.length === state.layers.length) {
    // no layer merged, find defaults
    mergedState = addDefaultLayers(mergedState, newDateEntries);
  }

  const newLayers = mergedState.layers.filter(
    l => l.config.dataId in newDateEntries
  );

  newLayers.forEach(l => {
    if (l.config.animation.enabled) {
      mergedState = enableLayerAnimationUpdater(mergedState, [l]);
    }
  });

  if (mergedState.splitMaps.length) {
    // if map is split, add new layers to splitMaps
    mergedState = {
      ...mergedState,
      splitMaps: addNewLayersToSplitMap(mergedState.splitMaps, newLayers)
    };
  }

  // merge state with saved interactions
  mergedState = mergeInteractions(mergedState, interactionToBeMerged);

  // if no tooltips merged add default tooltips
  Object.keys(newDateEntries).forEach(dataId => {
    const tooltipFields =
      mergedState.interactionConfig.tooltip.config.fieldsToShow[dataId];
    if (!Array.isArray(tooltipFields) || !tooltipFields.length) {
      mergedState = addDefaultTooltips(mergedState, newDateEntries[dataId]);
    }
  });

  return updateAllLayerDomainData(mergedState, Object.keys(newDateEntries));
};
/* eslint-enable max-statements */

/**
 * This method will compute the default maps layer settings
 * based on the current layers visibility
 * @param {Array<Object>} layers
 * @returns {Array<Object>} split map settings
 */
function computeSplitMapLayers(layers) {
  const mapLayers = layers
    .filter(layer => layer.config.isVisible)
    .reduce(
      (newLayers, currentLayer) => ({
        ...newLayers,
        [currentLayer.id]: currentLayer.config.isVisible
      }),
      {}
    );

  return [{layers: mapLayers}, {layers: cloneDeep(mapLayers)}];
}

/**
 * Remove an existing layer from split map settings
 * @param {Object} splitMaps
 * @param {Object} layer
 * @returns {Object} Maps of custom layer objects
 */
function removeLayerFromSplitMaps(splitMaps, layer) {
  if (!splitMaps.length) {
    return splitMaps;
  }
  return splitMaps.map(settings => {
    // eslint-disable-next-line no-unused-vars
    const {[layer.id]: _, ...newLayers} = settings.layers;
    return {
      ...settings,
      layers: newLayers
    };
  });
}

/**
 * Add new layers to both existing maps
 * @param {Object} splitMaps
 * @param {Object|Array<Object>} layers
 * @returns {Array<Object>} new splitMaps
 */
function addNewLayersToSplitMap(splitMaps, layers) {
  const newLayers = Array.isArray(layers) ? layers : [layers];

  if (!splitMaps.length || !newLayers.length) {
    return splitMaps;
  }

  // add new layer to both maps,
  // don't override, if layer.id is already in splitMaps
  return splitMaps.map(settings => ({
    ...settings,
    layers: {
      ...settings.layers,
      ...newLayers.reduce(
        (accu, newLayer) =>
          [newLayer.id] in settings.layers || !newLayer.config.isVisible
            ? accu
            : {
                ...accu,
                [newLayer.id]: newLayer.config.isVisible
              },
        {}
      )
    }
  }));
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
  const indexToRetrieve = 1 - action.payload;
  const mapLayers = state.splitMaps[indexToRetrieve].layers;
  const {layers} = state;

  // update layer visibility
  const newLayers = layers.map(layer =>
    !mapLayers[layer.id] && layer.config.isVisible
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
 * @param {Object} state `visState`
 * @param {Object} action action
 * @param {Array<Object>} action.files array of fileblob
 * @returns {Object} nextState
 * @public
 */
export const loadFilesUpdater = (state, action) => {
  const {files} = action;

  const filesToLoad = files.map(fileBlob => processFileToLoad(fileBlob));

  // reader -> parser -> augment -> receiveVisData
  const loadFileTasks = [
    Task.all(filesToLoad.map(LOAD_FILE_TASK)).bimap(
      results => {
        const data = results.reduce(
          (f, c) => ({
            // using concat here because the current datasets could be an array or a single item
            datasets: f.datasets.concat(c.datasets),
            // we need to deep merge this thing unless we find a better solution
            // this case will only happen if we allow to load multiple keplergl json files
            config: {
              ...f.config,
              ...(c.config || {})
            }
          }),
          {datasets: [], config: {}, options: {centerMap: true}}
        );
        return addDataToMap(data);
      },
      error => loadFilesErr(error)
    )
  ];

  return withTask(
    {
      ...state,
      fileLoading: true
    },
    loadFileTasks
  );
};

/**
 * Trigger loading file error
 * @memberof visStateUpdaters
 * @param {Object} state `visState`
 * @param {Object} action action
 * @param {*} action.error
 * @returns {Object} nextState
 * @public
 */
export const loadFilesErrUpdater = (state, {error}) => ({
  ...state,
  fileLoading: false,
  fileLoadingErr: error
});

/**
 * Helper function to update All layer domain and layer data of state
 * @memberof visStateUpdaters
 * @param {Object} state `visState`
 * @param {Array<string>} datasets
 * @returns {Object} nextState
 */
export function addDefaultLayers(state, datasets) {
  const defaultLayers = Object.values(datasets).reduce(
    (accu, dataset) => [
      ...accu,
      ...(findDefaultLayer(dataset, state.layerClasses) || [])
    ],
    []
  );

  return {
    ...state,
    layers: [...state.layers, ...defaultLayers],
    layerOrder: [
      // put new layers on top of old ones
      ...defaultLayers.map((_, i) => state.layers.length + i),
      ...state.layerOrder
    ]
  };
}

/**
 * helper function to find default tooltips
 * @param {Object} state
 * @param {Object} dataset
 * @returns {Object} nextState
 */
export function addDefaultTooltips(state, dataset) {
  const tooltipFields = findFieldsToShow(dataset);

  return {
    ...state,
    interactionConfig: {
      ...state.interactionConfig,
      tooltip: {
        ...state.interactionConfig.tooltip,
        config: {
          // find default fields to show in tooltip
          fieldsToShow: {
            ...state.interactionConfig.tooltip.config.fieldsToShow,
            ...tooltipFields
          }
        }
      }
    }
  };
}

/**
 * Helper function to update layer domains for an array of datsets
 * @param {Object} state
 * @param {Array|Array<string>} dataId dataset id or array of dataset ids
 * @param {Object} newFilter if is called by setFilter, the filter that has changed
 * @returns {Object} nextState
 */
export function updateAllLayerDomainData(state, dataId, newFilter) {
  const dataIds = typeof dataId === 'string' ? [dataId] : dataId;
  const newLayers = [];
  const newLayerDatas = [];

  state.layers.forEach((oldLayer, i) => {
    if (oldLayer.config.dataId && dataIds.includes(oldLayer.config.dataId)) {
      // No need to recalculate layer domain if filter has fixed domain
      const newLayer =
        newFilter && newFilter.fixedDomain
          ? oldLayer
          : oldLayer.updateLayerDomain(
              state.datasets[oldLayer.config.dataId],
              newFilter
            );

      const {layerData, layer} = calculateLayerData(
        newLayer,
        state,
        state.layerData[i]
      );

      newLayers.push(layer);
      newLayerDatas.push(layerData);
    } else {
      newLayers.push(oldLayer);
      newLayerDatas.push(state.layerData[i]);
    }
  });

  const newState = {
    ...state,
    layers: newLayers,
    layerData: newLayerDatas
  };

  return newState;

}
