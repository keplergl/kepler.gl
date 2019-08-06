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

// vis-state-reducer
import ActionTypes from 'constants/action-types';

/**
 * Update layer base config: dataId, label, column, isVisible
 * @memberof visStateActions
 * @param {Object} oldLayer - layer to be updated
 * @param {Object} newConfig - new config
 * @returns {{type: ActionTypes.LAYER_CONFIG_CHANGE, oldLayer: oldLayer, newConfig: newConfig}}
 * @public
 */
export function layerConfigChange(oldLayer, newConfig) {
  return {
    type: ActionTypes.LAYER_CONFIG_CHANGE,
    oldLayer,
    newConfig
  };
}

/**
 * Update layer text label
 * @memberof visStateActions
 * @param {Object} oldLayer - layer to be updated
 * @param {Number} idx -`idx` of text label to be updated
 * @param {string} prop - `prop` of text label, e,g, `anchor`, `alignment`, `color`, `size`, `field`
 * @param {*} value - new value
 * @returns {{type: ActionTypes.LAYER_TEXT_LABEL_CHANGE, oldLayer: oldLayer, idx: idx, prop: prop, value:}}
 * @public
 */
export function layerTextLabelChange(oldLayer, idx, prop, value) {
  return {
    type: ActionTypes.LAYER_TEXT_LABEL_CHANGE,
    oldLayer,
    idx,
    prop,
    value
  };
}

/**
 * Update layer type. Previews layer config will be copied if applicable.
 * @memberof visStateActions
 * @param {Object} oldLayer - layer to be updated
 * @param {string} newType - new type
 * @returns {{type: ActionTypes.LAYER_TYPE_CHANGE, oldLayer: oldLayer, newType: newType}}
 * @public
 */
export function layerTypeChange(oldLayer, newType) {
  return {
    type: ActionTypes.LAYER_TYPE_CHANGE,
    oldLayer,
    newType
  };
}

/**
 * Update layer visual channel
 * @memberof visStateActions
 * @param {Object} oldLayer - layer to be updated
 * @param {Object} newConfig - new visual channel config
 * @param {string} channel - channel to be updated
 * @returns {{type: ActionTypes.LAYER_VISUAL_CHANNEL_CHANGE, oldLayer: oldLayer, newConfig: newConfig, channel: channel}}
 * @public
 */
export function layerVisualChannelConfigChange(oldLayer, newConfig, channel) {
  return {
    type: ActionTypes.LAYER_VISUAL_CHANNEL_CHANGE,
    oldLayer,
    newConfig,
    channel
  };
}

/**
 * Update layer `visConfig`
 * @memberof visStateActions
 * @param {Object} oldLayer - layer to be updated
 * @param {Object} newVisConfig - new visConfig as a key value map: e.g. `{opacity: 0.8}`
 * @returns {{type: ActionTypes.LAYER_VIS_CONFIG_CHANGE, oldLayer: oldLayer, newVisConfig: newVisConfig}}
 * @public
 */
export function layerVisConfigChange(oldLayer, newVisConfig) {
  return {
    type: ActionTypes.LAYER_VIS_CONFIG_CHANGE,
    oldLayer,
    newVisConfig
  };
}

/**
 * Update layer blending mode
 * @memberof visStateActions
 * @param {string} mode one of `additive`, `normal` and `subtractive`
 * @returns {{type: ActionTypes.UPDATE_LAYER_BLENDING, mode: mode}}
 * @public
 */
export function updateLayerBlending(mode) {
  return {
    type: ActionTypes.UPDATE_LAYER_BLENDING,
    mode
  };
}

/**
 * Update `interactionConfig`
 * @memberof visStateActions
 * @param {Object} config - new config as key value map: `{tooltip: {enabled: true}}`
 * @returns {{type: ActionTypes.INTERACTION_CONFIG_CHANGE, config: config}}
 * @public
 */
export function interactionConfigChange(config) {
  return {
    type: ActionTypes.INTERACTION_CONFIG_CHANGE,
    config
  };
}

/**
 * Update filter property
 * @memberof visStateActions
 * @param {Number} idx -`idx` of filter to be updated
 * @param {string} prop - `prop` of filter, e,g, `dataId`, `name`, `value`
 * @param {*} value - new value
 * @returns {{type: ActionTypes.SET_FILTER, idx: idx, prop: prop, value: value}}
 * @public
 */
export function setFilter(idx, prop, value) {
  return {
    type: ActionTypes.SET_FILTER,
    idx,
    prop,
    value
  };
}

/**
 * Add a new filter
 * @memberof visStateActions
 * @param {string} dataId - dataset `id` this new filter is associated with
 * @returns {{type: ActionTypes.ADD_FILTER, dataId: dataId}}
 * @public
 */
export function addFilter(dataId) {
  return {
    type: ActionTypes.ADD_FILTER,
    dataId
  };
}

/**
 * Add a new layer
 * @memberof visStateActions
 * @param {Object} props - new layer props
 * @returns {{type: ActionTypes.ADD_LAYER, props: props}}
 * @public
 */
export function addLayer(props) {
  return {
    type: ActionTypes.ADD_LAYER,
    props
  };
}

/**
 * Reorder layer, order is an array of layer indexes, index 0 will be the one at the bottom
 * @memberof visStateActions
 * @param {Array<Number>} order an array of layer indexes
 * @returns {{type: ActionTypes.REORDER_LAYER, order: order}}
 * @public
 * @example
 *
 * // bring `layers[1]` below `layers[0]`, the sequence layers will be rendered is `1`, `0`, `2`, `3`.
 * // `1` will be at the bottom, `3` will be at the top.
 * this.props.dispatch(reorderLayer([1, 0, 2, 3]));
 */
export function reorderLayer(order) {
  return {
    type: ActionTypes.REORDER_LAYER,
    order
  };
}

/**
 * Remove a filter from `visState.filters`, once a filter is removed, data will be re-filtered and layer will be updated
 * @memberof visStateActions
 * @param {Number} idx idx of filter to be removed
 * @returns {{type: ActionTypes.REMOVE_FILTER, idx: idx}}
 * @public
 */
export function removeFilter(idx) {
  return {
    type: ActionTypes.REMOVE_FILTER,
    idx
  };
}

/**
 * Remove a layer
 * @memberof visStateActions
 * @param {Number} idx idx of layer to be removed
 * @returns {{type: ActionTypes.REMOVE_LAYER, idx: idx}}
 * @public
 */
export function removeLayer(idx) {
  return {
    type: ActionTypes.REMOVE_LAYER,
    idx
  };
}

/**
 * Remove a dataset and all layers, filters, tooltip configs that based on it
 * @memberof visStateActions
 * @param {string} key dataset id
 * @returns {{type: ActionTypes.REMOVE_DATASET, key: key}}
 * @public
 */
export function removeDataset(key) {
  return {
    type: ActionTypes.REMOVE_DATASET,
    key
  };
}

/**
 * Display dataset table in a modal
 * @memberof visStateActions
 * @param {string} dataId dataset id to show in table
 * @returns {{type: ActionTypes.SHOW_DATASET_TABLE, dataId: dataId}}
 * @public
 */
export function showDatasetTable(dataId) {
  return {
    type: ActionTypes.SHOW_DATASET_TABLE,
    dataId
  };
}

/**
 * Add new dataset to `visState`, with option to load a map config along with the datasets
 * @memberof visStateActions
 * @param {Array<Object>|Object} datasets - ***required** datasets can be a dataset or an array of datasets
 * Each dataset object needs to have `info` and `data` property.
 * @param {Object} datasets.info -info of a dataset
 * @param {string} datasets.info.id - id of this dataset. If config is defined, `id` should matches the `dataId` in config.
 * @param {string} datasets.info.label - A display name of this dataset
 * @param {Object} datasets.data - ***required** The data object, in a tabular format with 2 properties `fields` and `rows`
 * @param {Array<Object>} datasets.data.fields - ***required** Array of fields,
 * @param {string} datasets.data.fields.name - ***required** Name of the field,
 * @param {Array<Array>} datasets.data.rows - ***required** Array of rows, in a tabular format with `fields` and `rows`

 * @param {Object} options
 * @param {boolean} options.centerMap `default: true` if `centerMap` is set to `true` kepler.gl will
 * place the map view within the data points boundaries
 * @param {boolean} options.readOnly `default: false` if `readOnly` is set to `true`
 * the left setting panel will be hidden
 * @param {Object} config this object will contain the full kepler.gl instance configuration {mapState, mapStyle, visState}
 * @returns {{type: ActionTypes.UPDATE_VIS_DATA, datasets: datasets, options: options, config: config}}
 * @public
 */
export function updateVisData(datasets, options, config) {
  return {
    type: ActionTypes.UPDATE_VIS_DATA,
    datasets,
    options,
    config
  };
}

/**
 * Start and end filter animation
 * @memberof visStateActions
 * @param {Number} idx - idx of filter
 * @returns {{type: ActionTypes.TOGGLE_FILTER_ANIMATION, idx: idx}}
 * @public
 */
export function toggleAnimation(idx) {
  return {
    type: ActionTypes.TOGGLE_FILTER_ANIMATION,
    idx
  };
}

/**
 * Change filter animation speed
 * @memberof visStateActions
 * @param {Number} idx -  `idx` of filter
 * @param {Number} speed - `speed` to change it to. `speed` is a multiplier
 * @returns {{type: ActionTypes.UPDATE_FILTER_ANIMATION_SPEED, idx: idx, speed: speed}}
 * @public
 */
export function updateAnimationSpeed(idx, speed) {
  return {
    type: ActionTypes.UPDATE_FILTER_ANIMATION_SPEED,
    idx,
    speed
  };
}

/**
 * Show larger time filter at bottom for time playback (apply to time filter only)
 * @memberof visStateActions
 * @param {Number} idx - index of filter to enlarge
 * @returns {{type: ActionTypes.ENLARGE_FILTER, idx: idx}}
 * @public
 */
export function enlargeFilter(idx) {
  return {
    type: ActionTypes.ENLARGE_FILTER,
    idx
  };
}

/**
 * Trigger layer hover event with hovered object
 * @memberof visStateActions
 * @param {Object} info - Object hovered, returned by deck.gl
 * @returns {{type: ActionTypes.LAYER_HOVER, info: info}}
 * @public
 */
export function onLayerHover(info) {
  return {
    type: ActionTypes.LAYER_HOVER,
    info
  };
}

/**
 * Trigger layer click event with clicked object
 * @memberof visStateActions
 * @param {Object} info - Object clicked, returned by deck.gl
 * @returns {{type: ActionTypes.LAYER_CLICK, info: info}}
 * @public
 */
export function onLayerClick(info) {
  return {
    type: ActionTypes.LAYER_CLICK,
    info
  };
}

/**
 * Trigger map click event, unselect clicked object
 * @memberof visStateActions
 * @returns {{type: ActionTypes.MAP_CLICK}}
 * @public
 */
export function onMapClick() {
  return {
    type: ActionTypes.MAP_CLICK
  };
}

/**
 * Trigger map mouse moveevent, payload would be
 * React-map-gl PointerEvent
 * https://uber.github.io/react-map-gl/#/documentation/api-reference/pointer-event
 *
 * @memberof visStateActions
 * @param {Object} evt - PointerEvent
 * @returns {{type: ActionTypes.MAP_CLICK}}
 * @public
 */
export function onMouseMove(evt) {
  return {
    type: ActionTypes.MOUSE_MOVE,
    evt
  };
}

/**
 * Toggle visibility of a layer in a split map
 * @memberof visStateActions
 * @param {Number} mapIndex - index of the split map
 * @param {string} layerId - id of the layer
 * @returns {{type: ActionTypes.TOGGLE_LAYER_FOR_MAP, mapIndex: *, layerId: *}}
 * @public
 */
export function toggleLayerForMap(mapIndex, layerId) {
  return {
    type: ActionTypes.TOGGLE_LAYER_FOR_MAP,
    mapIndex,
    layerId
  };
}

/**
 * Set the property of a filter plot
 * @memberof visStateActions
 * @param {Number} idx
 * @param {Object} newProp key value mapping of new prop `{yAxis: 'histogram'}`
 * @returns {{type: ActionTypes.SET_FILTER_PLOT, idx: *, newProp: *}}
 * @public
 */
export function setFilterPlot(idx, newProp) {
  return {
    type: ActionTypes.SET_FILTER_PLOT,
    idx,
    newProp
  };
}

/**
 * Trigger file loading dispatch `addDataToMap` if succeed, or `loadFilesErr` if failed
 * @memberof visStateActions
 * @param {Array<Object>} files array of fileblob
 * @returns {{type: ActionTypes.LOAD_FILES, files: *}}
 * @public
 */
export function loadFiles(files) {
  return {
    type: ActionTypes.LOAD_FILES,
    files
  };
}

/**
 * Trigger loading file error
 * @memberof visStateActions
 * @param {*} error
 * @returns {{type: ActionTypes.LOAD_FILES_ERR, error: Object}}
 * @public
 */
export function loadFilesErr(error) {
  return {
    type: ActionTypes.LOAD_FILES_ERR,
    error
  };
}

/**
 * Store features to state
 * @memberof visStateActions
 * @param {Array<Object>} features
 * @returns {{type: ActionTypes.SET_FEATURES, features: Object}}
 */
export function setFeatures(features) {
  return {
    type: ActionTypes.SET_FEATURES,
    features
  }
}

/**
 * It will apply the provide feature as filter to the given layer.
 * If the given feature is already applied as filter to the layer it  will remove it from  the filter list
 * @memberof visStateActions
 * @param {Object} feature
 * @param {Object} layer
 * @return {{feature: *, type: null, layer: *}}
 */
export function togglePolygonFilter(layer, featureId) {
  return {
    type: ActionTypes.TOGGLE_POLYGON_FILTER,
    layer,
    featureId
  }
}

/**
 * This declaration is needed to group actions in docs
 */
/**
 * Actions handled mostly by `visState` reducer.
 * They manage how data is processed, filtered and displayed on the map by operates on layers,
 * filters and interaction settings.
 *
 * @public
 */
/* eslint-disable no-unused-vars */
const visStateActions = null;
/* eslint-enable no-unused-vars */
