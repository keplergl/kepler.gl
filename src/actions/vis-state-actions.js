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

// vis-state-reducer
import ActionTypes from 'constants/action-types';

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
    type: ActionTypes.LAYER_VISUAL_CHANNEL_CHANGE,
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
    idx,
    prop,
    value
  };
}

export function addFilter(dataId) {
  return {
    type: ActionTypes.ADD_FILTER,
    dataId
  };
}

export function addLayer(props) {
  return {
    type: ActionTypes.ADD_LAYER,
    props
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
  };
}

export function showDatasetTable(dataId) {
  return {
    type: ActionTypes.SHOW_DATASET_TABLE,
    dataId
  };
}

/**
 *
 * @param datasets - Array of datasets :
 * {info: {id: '', color: hex, label: '']}, data: {fields: [], rows: []}}
 * @param options {centerMap, readOnly}
 * @param config {visState, mapState, mapStyle}
 * @returns {{type: null, datasets: *, options: *}}
 */
export function updateVisData(datasets, options, config) {
  return {
    type: ActionTypes.UPDATE_VIS_DATA,
    datasets,
    options,
    config
  };
}

export function toggleAnimation(idx) {
  return {
    type: ActionTypes.TOGGLE_FILTER_ANIMATION,
    idx
  };
}

export function updateAnimationSpeed(idx, speed) {
  return {
    type: ActionTypes.UPDATE_FILTER_ANIMATION_SPEED,
    idx,
    speed
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
  };
}

export function setFilterPlot(idx, newProp) {
  return {
    type: ActionTypes.SET_FILTER_PLOT,
    idx,
    newProp
  };
}

export function loadFiles(files) {
  return {
    type: ActionTypes.LOAD_FILES,
    files
  };
}

export function loadFilesErr(error) {
  return {
    type: ActionTypes.LOAD_FILES_ERR,
    error
  };
}
