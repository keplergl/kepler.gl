// vis-state-reducer
import ActionTypes from '../constants/action-types';

export function layerConfigChange(oldLayer, newConfig) {
  return {
    type: ActionTypes.LAYER_CONFIG_CHANGE,
    oldLayer,
    newConfig
  };
}

export function layerTypeChange(oldLayer, newType) {
  return {
    type: ActionTypes.LAYER_TYPE_CHANGE,
    oldLayer,
    newType
  };
}

export function layerVisualChannelConfigChange(oldLayer, newConfig, channel) {
  return {
    type: ActionTypes.LAYER_VISUAL_CHANNEL_CONFIG_CHANGE,
    oldLayer,
    newConfig,
    channel
  };
}

export function layerVisConfigChange(oldLayer, newVisConfig) {
  return {
    type: ActionTypes.LAYER_VIS_CONFIG_CHANGE,
    oldLayer,
    newVisConfig
  };
}

export function updateLayerBlending(mode) {
  return {
    type: ActionTypes.UPDATE_LAYER_BLENDING,
    mode
  };
}

export function interactionConfigChange(config) {
  return {
    type: ActionTypes.INTERACTION_CONFIG_CHANGE,
    config
  };
}

export function setFilter(idx, prop, value) {
  return {
    type: ActionTypes.SET_FILTER,
    idx, prop, value
  };
}

export function addFilter(dataId) {
  return {
    type: ActionTypes.ADD_FILTER,
    dataId
  };
}

export function addLayer() {
  return {
    type: ActionTypes.ADD_LAYER
  };
}

export function reorderLayer(order) {
  return {
    type: ActionTypes.REORDER_LAYER,
    order
  };
}

export function removeFilter(idx) {
  return {
    type: ActionTypes.REMOVE_FILTER,
    idx
  };
}

export function removeLayer(idx) {
  return {
    type: ActionTypes.REMOVE_LAYER,
    idx
  };
}

export function removeDataset(key) {
  return {
    type: ActionTypes.REMOVE_DATASET,
    key
  }
}

export function showDatasetTable(dataId) {
  return {
    type: ActionTypes.SHOW_DATASET_TABLE,
    dataId
  }
}

export function updateVisData(datasets, options) {
  return {
    type: ActionTypes.UPDATE_VIS_DATA,
    datasets,
    options
  };
}

export function toggleAnimation(idx) {
  return {
    type: ActionTypes.TOGGLE_FILTER_ANIMATION,
    idx
  };
}

export function enlargeFilter(idx) {
  return {
    type: ActionTypes.ENLARGE_FILTER,
    idx
  };
}

export function onLayerHover(info) {
  return {
    type: ActionTypes.LAYER_HOVER,
    info
  };
}

export function onLayerClick(info) {
  return {
    type: ActionTypes.LAYER_CLICK,
    info
  };
}

export function onMapClick() {
  return {
    type: ActionTypes.MAP_CLICK
  };
}

/**
 * Toggle a single layer for a give map
 * @param mapIndex
 * @param layerId
 * @returns {{type: *, mapIndex: *, layerId: *}}
 */
export function toggleLayerForMap(mapIndex, layerId) {
  return {
    type: ActionTypes.TOGGLE_LAYER_FOR_MAP,
    mapIndex,
    layerId
  };
}

/**
 * Toggle layer visibility on split views
 * @param layerIndex the layer we want to toggle visibility on
 * @param mapIndex the map index
 * @returns {{type: null, layerIndex: *, mapIndex: *}}
 */
export function setVisibleLayersForMap(mapIndex, layerIds) {
  return {
    type: ActionTypes.SET_VISIBLE_LAYERS_FOR_MAP,
    mapIndex,
    layerIds
  }
}

export function setFilterPlot(idx, newProp) {
  return {
    type: ActionTypes.SET_FILTER_PLOT,
    idx,
    newProp
  }
}

export function loadFiles(files) {
  return {
    type: ActionTypes.LOAD_FILES,
    files
  }
}

export function loadFilesErr(error) {
  return {
    type: ActionTypes.LOAD_FILES_ERR,
    error
  }
}
