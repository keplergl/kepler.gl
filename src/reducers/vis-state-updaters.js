// Copyright (c) 2018 Uber Technologies, Inc.
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

// Tasks
import {LOAD_FILE_TASK} from 'tasks/tasks';

// Actions
import {loadFilesErr} from 'actions/vis-state-actions';
import {addDataToMap} from 'actions';

// Utils
import {
  getDefaultInteraction,
  findFieldsToShow
} from 'utils/interaction-utils';
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
  calculateLayerData
} from 'utils/layer-utils/layer-utils';

import {
  mergeFilters,
  mergeLayers,
  mergeInteractions,
  mergeLayerBlending
} from './vis-state-merger';

// LayerClasses contain ES6 Class, do not instatiate in iso rendering
// const {LayerClasses} = isBrowser || isTesting ?
//   require('layers') : {
//     LayerClasses: {}
//   };

import {Layer, LayerClasses} from 'layers';
import {processFileToLoad} from '/utils/file-utils';

// react-palm
// disable capture exception for react-palm call to withTask
disableStackCapturing();

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
  ],

  // defaults layer classes
  layerClasses: LayerClasses
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
 * Called to update layer base config: dataId, label, column, isVisible
 *
 */
export function layerConfigChangeUpdater(state, action) {
  const {oldLayer} = action;
  const idx = state.layers.findIndex(l => l.id === oldLayer.id);
  const props = Object.keys(action.newConfig);

  const newLayer = oldLayer.updateLayerConfig(action.newConfig);
  if (newLayer.shouldCalculateLayerData(props)) {
    const oldLayerData = state.layerData[idx];
    const {layerData, layer} = calculateLayerData(
      newLayer,
      state,
      oldLayerData,
      {sameData: true}
    );
    return updateStateWithLayerAndData(state, {layerData, layer, idx});
  }

  const newState = {
    ...state,
    splitMaps:
      'isVisible' in action.newConfig
        ? toggleLayerFromSplitMaps(state, newLayer)
        : state.splitMaps
  };

  return updateStateWithLayerAndData(newState, {layer: newLayer, idx});
}

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
  if (state.splitMaps) {
    newState = {
      ...state,
      splitMaps: state.splitMaps.map(settings => {
        const {[oldId]: oldLayerMap, ...otherLayers} = settings.layers;
        return {
          ...settings,
          layers: {
            ...otherLayers,
            [layer.id]: oldLayerMap
          }
        };
      })
    };
  }

  return updateStateWithLayerAndData(newState, {layerData, layer, idx});
}

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
    const {layerData, layer} = calculateLayerData(
      newLayer,
      state,
      oldLayerData,
      {sameData: true}
    );
    return updateStateWithLayerAndData(state, {layerData, layer, idx});
  }

  return updateStateWithLayerAndData(state, {layer: newLayer, idx});
}

/* eslint-enable max-statements */

export function interactionConfigChangeUpdater(state, action) {
  const {config} = action;

  const interactionConfig = {
    ...state.interactionConfig,
    ...{[config.id]: config}
  };

  if (config.enabled && !state.interactionConfig[config.id].enabled) {
    // only enable one interaction at a time
    Object.keys(interactionConfig).forEach(k => {
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

export const addFilterUpdater = (state, action) =>
  !action.dataId
    ? state
    : {
        ...state,
        filters: [...state.filters, getDefaultFilter(action.dataId)]
      };

export const toggleFilterAnimationUpdater = (state, action) => ({
  ...state,
  filters: state.filters.map(
    (f, i) => (i === action.idx ? {...f, isAnimating: !f.isAnimating} : f)
  )
});

export const updateAnimationSpeedUpdater = (state, action) => ({
  ...state,
  filters: state.filters.map(
    (f, i) => (i === action.idx ? {...f, speed: action.speed} : f)
  )
});

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

export const removeLayerUpdater = (state, {idx}) => {
  const {layers, layerData, clicked, hoverInfo} = state;
  const layerToRemove = state.layers[idx];
  const newMaps = removeLayerFromSplitMaps(state, layerToRemove);

  return {
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
};

export const reorderLayerUpdater = (state, {order}) => ({
  ...state,
  layerOrder: order
});

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

export const updateLayerBlendingUpdater = (state, action) => ({
  ...state,
  layerBlending: action.mode
});

export const showDatasetTableUpdater = (state, action) => {
  return {
    ...state,
    editingDataset: action.dataId
  };
};

export const resetMapConfigVisStateUpdater = (state, action) => ({
  ...INITIAL_VIS_STATE,
  ...state.initialState,
  initialState: state.initialState
});

/**
 * Loads custom configuration into state
 * @param state
 * @param action
 * @returns {*}
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

export const layerHoverUpdater = (state, action) => ({
  ...state,
  hoverInfo: action.info
});

export const layerClickUpdater = (state, action) => ({
  ...state,
  clicked: action.info && action.info.picked ? action.info : null
});

export const mapClickUpdater = (state, action) => ({
  ...state,
  clicked: null
});

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
 * This is triggered when view is split into multiple maps.
 * It will only update layers that belong to the map layer dropdown
 * the user is interacting wit
 * @param state
 * @param action
 */
export const setVisibleLayersForMapUpdater = (state, action) => {
  const {mapIndex, layerIds} = action;
  if (!layerIds) {
    return state;
  }

  const {splitMaps = []} = state;

  if (splitMaps.length === 0) {
    // we should never get into this state
    // because this action should only be triggered
    // when map view is split
    // but something may have happened
    return state;
  }

  // need to check if maps is populated otherwise will create
  const {[mapIndex]: map = {}} = splitMaps;

  const layers = map.layers || [];

  // we set visibility to true for all layers included in our input list
  const newLayers = (Object.keys(layers) || []).reduce((currentLayers, idx) => {
    return {
      ...currentLayers,
      [idx]: {
        ...layers[idx],
        isVisible: layerIds.includes(idx)
      }
    };
  }, {});

  const newMaps = [...splitMaps];

  newMaps[mapIndex] = {
    ...splitMaps[mapIndex],
    layers: newLayers
  };

  return {
    ...state,
    splitMaps: newMaps
  };
};

export const toggleLayerForMapUpdater = (state, action) => {
  if (!state.splitMaps[action.mapIndex]) {
    return state;
  }

  const mapSettings = state.splitMaps[action.mapIndex];
  const {layers} = mapSettings;
  if (!layers || !layers[action.layerId]) {
    return state;
  }

  const layer = layers[action.layerId];

  const newLayer = {
    ...layer,
    isVisible: !layer.isVisible
  };

  const newLayers = {
    ...layers,
    [action.layerId]: newLayer
  };

  // const splitMaps = state.splitMaps;
  const newSplitMaps = [...state.splitMaps];
  newSplitMaps[action.mapIndex] = {
    ...mapSettings,
    layers: newLayers
  };

  return {
    ...state,
    splitMaps: newSplitMaps
  };
};

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

  if (mergedState.splitMaps.length) {
    const newLayers = mergedState.layers.filter(
      l => l.config.dataId in newDateEntries
    );
    // if map is splited, add new layers to splitMaps
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
  const mapLayers = layers.reduce(
    (newLayers, currentLayer) => ({
      ...newLayers,
      [currentLayer.id]: generateLayerMetaForSplitViews(currentLayer)
    }),
    {}
  );
  return [
    {
      layers: mapLayers
    },
    {
      layers: mapLayers
    }
  ];
}

/**
 * Remove an existing layers from custom map layer objects
 * @param state
 * @param layer
 * @returns {[*,*]} Maps of custom layer objects
 */
function removeLayerFromSplitMaps(state, layer) {
  return state.splitMaps.map(settings => {
    const {layers} = settings;
    /* eslint-disable no-unused-vars */
    const {[layer.id]: _, ...newLayers} = layers;
    /* eslint-enable no-unused-vars */
    return {
      ...settings,
      layers: newLayers
    };
  });
}

/**
 * Add new layers to both existing maps
 * @param splitMaps
 * @param layers
 * @returns {[*,*]} new splitMaps
 */
function addNewLayersToSplitMap(splitMaps, layers) {
  const newLayers = Array.isArray(layers) ? layers : [layers];

  if (!splitMaps || !splitMaps.length || !newLayers.length) {
    return splitMaps;
  }

  // add new layer to both maps,
  //  don't override, if layer.id is already in splitMaps.settings.layers
  return splitMaps.map(settings => ({
    ...settings,
    layers: {
      ...settings.layers,
      ...newLayers.reduce(
        (accu, newLayer) =>
          newLayer.config.isVisible
            ? {
                ...accu,
                [newLayer.id]: settings.layers[newLayer.id]
                  ? settings.layers[newLayer.id]
                  : generateLayerMetaForSplitViews(newLayer)
              }
            : accu,
        {}
      )
    }
  }));
}

/**
 * Hide an existing layers from custom map layer objects
 * @param state
 * @param layer
 * @returns {[*,*]} Maps of custom layer objects
 */
function toggleLayerFromSplitMaps(state, layer) {
  return state.splitMaps.map(settings => {
    const {layers} = settings;
    const newLayers = {
      ...layers,
      [layer.id]: generateLayerMetaForSplitViews(layer)
    };

    return {
      ...settings,
      layers: newLayers
    };
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
  const indexToRetrieve = 1 - action.payload;

  const metaSettings = state.splitMaps[indexToRetrieve];
  if (!metaSettings || !metaSettings.layers) {
    // if we can't find the meta settings we simply clean up splitMaps and
    // keep global state as it is
    // but why does this ever happen?
    return {
      ...state,
      splitMaps: []
    };
  }

  const {layers} = state;

  // update layer visibility
  const newLayers = layers.map(layer =>
    layer.updateLayerConfig({
      isVisible: metaSettings.layers[layer.id]
        ? metaSettings.layers[layer.id].isVisible
        : layer.config.isVisible
    })
  );

  // delete map
  return {
    ...state,
    layers: newLayers,
    splitMaps: []
  };
}

// TODO: redo write handler to not use tasks
export const loadFilesUpdater = (state, action) => {
  const {files} = action;

  const filesToLoad = files.map(fileBlob => processFileToLoad(fileBlob));

  // reader -> parser -> augment -> receiveVisData
  const loadFileTasks = [
    Task.all(filesToLoad.map(LOAD_FILE_TASK)).bimap(
      results => {
        const data = results.reduce((f, c) => ({
          // using concat here because the current datasets could be an array or a single item
          datasets: f.datasets.concat(c.datasets),
          // we need to deep merge this thing unless we find a better solution
          // this case will only happen if we allow to load multiple keplergl json files
          config: {
            ...f.config,
            ...(c.config || {})
          }
        }), {datasets: [], config: {}, options: {centerMap: true}});
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

export const loadFilesErrUpdater = (state, {error}) => ({
  ...state,
  fileLoading: false,
  fileLoadingErr: error
});

/**
 * helper function to update All layer domain and layer data of state
 *
 * @param {object} state
 * @param {string} datasets
 * @returns {object} state
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
 *
 * @param {object} state
 * @param {object} dataset
 * @returns {object} state
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
 * helper function to update layer domains for an array of datsets
 *
 * @param {object} state
 * @param {array | string} dataId
 * @param {object} newFilter - if is called by setFilter, the filter that has changed
 * @returns {object} state
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

  return {
    ...state,
    layers: newLayers,
    layerData: newLayerDatas
  };
}
