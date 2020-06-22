"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.layerConfigChange = layerConfigChange;
exports.layerTextLabelChange = layerTextLabelChange;
exports.layerTypeChange = layerTypeChange;
exports.layerVisualChannelConfigChange = layerVisualChannelConfigChange;
exports.layerVisConfigChange = layerVisConfigChange;
exports.layerColorUIChange = layerColorUIChange;
exports.updateLayerBlending = updateLayerBlending;
exports.interactionConfigChange = interactionConfigChange;
exports.setFilter = setFilter;
exports.addFilter = addFilter;
exports.addLayer = addLayer;
exports.reorderLayer = reorderLayer;
exports.removeFilter = removeFilter;
exports.removeLayer = removeLayer;
exports.removeDataset = removeDataset;
exports.showDatasetTable = showDatasetTable;
exports.sortTableColumn = sortTableColumn;
exports.pinTableColumn = pinTableColumn;
exports.copyTableColumn = copyTableColumn;
exports.updateVisData = updateVisData;
exports.toggleFilterAnimation = toggleFilterAnimation;
exports.updateFilterAnimationSpeed = updateFilterAnimationSpeed;
exports.updateAnimationTime = updateAnimationTime;
exports.updateLayerAnimationSpeed = updateLayerAnimationSpeed;
exports.enlargeFilter = enlargeFilter;
exports.toggleFilterFeature = toggleFilterFeature;
exports.onLayerHover = onLayerHover;
exports.onLayerClick = onLayerClick;
exports.onMapClick = onMapClick;
exports.onMouseMove = onMouseMove;
exports.toggleLayerForMap = toggleLayerForMap;
exports.setFilterPlot = setFilterPlot;
exports.setMapInfo = setMapInfo;
exports.loadFiles = loadFiles;
exports.loadNextFile = loadNextFile;
exports.loadFileSuccess = loadFileSuccess;
exports.loadFilesErr = loadFilesErr;
exports.setFeatures = setFeatures;
exports.setPolygonFilterLayer = setPolygonFilterLayer;
exports.setSelectedFeature = setSelectedFeature;
exports.deleteFeature = deleteFeature;
exports.setEditorMode = setEditorMode;
exports.applyCPUFilter = applyCPUFilter;
exports.toggleEditorVisibility = toggleEditorVisibility;

var _actionTypes = _interopRequireDefault(require("../constants/action-types"));

// Copyright (c) 2020 Uber Technologies, Inc.
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

/**
 * Update layer base config: dataId, label, column, isVisible
 * @param oldLayer - layer to be updated
 * @param newConfig - new config to be merged with old config
 * @returns action
 * @type {typeof import('./vis-state-actions').layerConfigChange}
 * @public
 */
function layerConfigChange(oldLayer, newConfig) {
  return {
    type: _actionTypes["default"].LAYER_CONFIG_CHANGE,
    oldLayer: oldLayer,
    newConfig: newConfig
  };
}
/**
 * Update layer text label
 * @param oldLayer - layer to be updated
 * @param idx -`idx` of text label to be updated
 * @param prop - `prop` of text label, e,g, `anchor`, `alignment`, `color`, `size`, `field`
 * @param value - new value
 * @returns action
 * @type {typeof import('./vis-state-actions').layerTextLabelChange}
 * @public
 */


function layerTextLabelChange(oldLayer, idx, prop, value) {
  return {
    type: _actionTypes["default"].LAYER_TEXT_LABEL_CHANGE,
    oldLayer: oldLayer,
    idx: idx,
    prop: prop,
    value: value
  };
}
/**
 * Update layer type. Previews layer config will be copied if applicable.
 * @param oldLayer - layer to be updated
 * @param newType - new type
 * @returns action
 * @type {typeof import('./vis-state-actions').layerTypeChange}
 * @public
 */


function layerTypeChange(oldLayer, newType) {
  return {
    type: _actionTypes["default"].LAYER_TYPE_CHANGE,
    oldLayer: oldLayer,
    newType: newType
  };
}
/**
 * Update layer visual channel
 * @memberof visStateActions
 * @param oldLayer - layer to be updated
 * @param newConfig - new visual channel config
 * @param channel - channel to be updated
 * @returns action
 * @type {typeof import('./vis-state-actions').layerVisualChannelConfigChange}
 * @public
 */


function layerVisualChannelConfigChange(oldLayer, newConfig, channel) {
  return {
    type: _actionTypes["default"].LAYER_VISUAL_CHANNEL_CHANGE,
    oldLayer: oldLayer,
    newConfig: newConfig,
    channel: channel
  };
}
/**
 * Update layer `visConfig`
 * @memberof visStateActions
 * @param oldLayer - layer to be updated
 * @param newVisConfig - new visConfig as a key value map: e.g. `{opacity: 0.8}`
 * @returns action
 * @type {typeof import('./vis-state-actions').layerVisConfigChange}
 * @public
 */


function layerVisConfigChange(oldLayer, newVisConfig) {
  return {
    type: _actionTypes["default"].LAYER_VIS_CONFIG_CHANGE,
    oldLayer: oldLayer,
    newVisConfig: newVisConfig
  };
}
/**
 * Set the color palette ui for layer color
 * @memberOf visStateActions
 * @param oldLayer - layer to be updated
 * @param prop - which color prop
 * @param newConfig - to be merged
 * @returns action
 * @type {typeof import('./vis-state-actions').layerColorUIChange}
 * @public
 */


function layerColorUIChange(oldLayer, prop, newConfig) {
  return {
    type: _actionTypes["default"].LAYER_COLOR_UI_CHANGE,
    oldLayer: oldLayer,
    prop: prop,
    newConfig: newConfig
  };
}
/**
 * Update layer blending mode
 * @memberof visStateActions
 * @param mode one of `additive`, `normal` and `subtractive`
 * @returns action
 * @type {typeof import('./vis-state-actions').updateLayerBlending}
 * @public
 */


function updateLayerBlending(mode) {
  return {
    type: _actionTypes["default"].UPDATE_LAYER_BLENDING,
    mode: mode
  };
}
/**
 * Update `interactionConfig`
 * @memberof visStateActions
 * @param config - new config as key value map: `{tooltip: {enabled: true}}`
 * @returns action
 * @type {typeof import('./vis-state-actions').interactionConfigChange}
 * @public
 */


function interactionConfigChange(config) {
  return {
    type: _actionTypes["default"].INTERACTION_CONFIG_CHANGE,
    config: config
  };
}
/**
 * Update filter property
 * @memberof visStateActions
 * @param idx -`idx` of filter to be updated
 * @param prop - `prop` of filter, e,g, `dataId`, `name`, `value`
 * @param value - new value
 * @param valueIndex - dataId index
 * @returns action
 * @type {typeof import('./vis-state-actions').setFilter}
 * @public
 */


function setFilter(idx, prop, value, valueIndex) {
  return {
    type: _actionTypes["default"].SET_FILTER,
    idx: idx,
    prop: prop,
    value: value,
    valueIndex: valueIndex
  };
}
/**
 * Add a new filter
 * @memberof visStateActions
 * @param dataId - dataset `id` this new filter is associated with
 * @returns action
 * @type {typeof import('./vis-state-actions').addFilter}
 * @public
 */


function addFilter(dataId) {
  return {
    type: _actionTypes["default"].ADD_FILTER,
    dataId: dataId
  };
}
/**
 * Add a new layer
 * @memberof visStateActions
 * @param props - new layer props
 * @returns action
 * @type {typeof import('./vis-state-actions').addLayer}
 * @public
 */


function addLayer(props) {
  return {
    type: _actionTypes["default"].ADD_LAYER,
    props: props
  };
}
/**
 * Reorder layer, order is an array of layer indexes, index 0 will be the one at the bottom
 * @memberof visStateActions
 * @param order an array of layer indexes
 * @returns action
 * @type {typeof import('./vis-state-actions').reorderLayer}
 * @public
 * @example
 *
 * // bring `layers[1]` below `layers[0]`, the sequence layers will be rendered is `1`, `0`, `2`, `3`.
 * // `1` will be at the bottom, `3` will be at the top.
 * this.props.dispatch(reorderLayer([1, 0, 2, 3]));
 */


function reorderLayer(order) {
  return {
    type: _actionTypes["default"].REORDER_LAYER,
    order: order
  };
}
/**
 * Remove a filter from `visState.filters`, once a filter is removed, data will be re-filtered and layer will be updated
 * @memberof visStateActions
 * @param idx idx of filter to be removed
 * @returns action
 * @type {typeof import('./vis-state-actions').removeFilter}
 * @public
 */


function removeFilter(idx) {
  return {
    type: _actionTypes["default"].REMOVE_FILTER,
    idx: idx
  };
}
/**
 * Remove a layer
 * @memberof visStateActions
 * @param idx idx of layer to be removed
 * @returns action
 * @type {typeof import('./vis-state-actions').removeLayer}
 * @public
 */


function removeLayer(idx) {
  return {
    type: _actionTypes["default"].REMOVE_LAYER,
    idx: idx
  };
}
/**
 * Remove a dataset and all layers, filters, tooltip configs that based on it
 * @memberof visStateActions
 * @param dataId dataset id
 * @returns action
 * @type {typeof import('./vis-state-actions').removeDataset}
 * @public
 */


function removeDataset(dataId) {
  return {
    type: _actionTypes["default"].REMOVE_DATASET,
    dataId: dataId
  };
}
/**
 * Display dataset table in a modal
 * @memberof visStateActions
 * @param dataId dataset id to show in table
 * @returns action
 * @type {typeof import('./vis-state-actions').showDatasetTable}
 * @public
 */


function showDatasetTable(dataId) {
  return {
    type: _actionTypes["default"].SHOW_DATASET_TABLE,
    dataId: dataId
  };
}
/**
 * Sort dataset column, for table display
 * @memberof visStateActions
 * @param dataId
 * @param column
 * @param mode
 * @returns action
 * @type {typeof import('./vis-state-actions').sortTableColumn}
 * @public
 */


function sortTableColumn(dataId, column, mode) {
  return {
    type: _actionTypes["default"].SORT_TABLE_COLUMN,
    dataId: dataId,
    column: column,
    mode: mode
  };
}
/**
 * Pin dataset column, for table display
 * @param dataId
 * @param column
 * @returns action
 * @type {typeof import('./vis-state-actions').pinTableColumn}
 * @public
 */


function pinTableColumn(dataId, column) {
  return {
    type: _actionTypes["default"].PIN_TABLE_COLUMN,
    dataId: dataId,
    column: column
  };
}
/**
 * Copy column, for table display
 * @param dataId
 * @param column
 * @returns action
 * @type {typeof import('./vis-state-actions').copyTableColumn}
 * @public
 */


function copyTableColumn(dataId, column) {
  return {
    type: _actionTypes["default"].COPY_TABLE_COLUMN,
    dataId: dataId,
    column: column
  };
} // * @param dataset.info -info of a dataset
// * @param dataset.info.id - id of this dataset. If config is defined, `id` should matches the `dataId` in config.
// * @param dataset.info.label - A display name of this dataset
// * @param dataset.data - ***required** The data object, in a tabular format with 2 properties `fields` and `rows`
// * @param dataset.data.fields - ***required** Array of fields,
// * @param dataset.data.fields.name - ***required** Name of the field,
// * @param dataset.data.rows - ***required** Array of rows, in a tabular format with `fields` and `rows`

/**
 * Add new dataset to `visState`, with option to load a map config along with the datasets
 * @memberof visStateActions
 * @param datasets - ***required** datasets can be a dataset or an array of datasets
 * Each dataset object needs to have `info` and `data` property.
 * @param {object} options
 * @param options.centerMap `default: true` if `centerMap` is set to `true` kepler.gl will
 * place the map view within the data points boundaries
 * @param options.readOnly `default: false` if `readOnly` is set to `true`
 * the left setting panel will be hidden
 * @param config this object will contain the full kepler.gl instance configuration {mapState, mapStyle, visState}
 * @returns action
 * @type {typeof import('./vis-state-actions').updateVisData}
 * @public
 */


function updateVisData(datasets, options, config) {
  return {
    type: _actionTypes["default"].UPDATE_VIS_DATA,
    datasets: datasets,
    options: options,
    config: config
  };
}
/**
 * Start and end filter animation
 * @memberof visStateActions
 * @param {Number} idx of filter
 * @type {typeof import('./vis-state-actions').toggleFilterAnimation}
 * @returns action
 * @public
 */


function toggleFilterAnimation(idx) {
  return {
    type: _actionTypes["default"].TOGGLE_FILTER_ANIMATION,
    idx: idx
  };
}
/**
 * Change filter animation speed
 * @memberof visStateActions
 * @param idx -  `idx` of filter
 * @param speed - `speed` to change it to. `speed` is a multiplier
 * @type {typeof import('./vis-state-actions').updateFilterAnimationSpeed}
 * @returns action
 * @public
 */


function updateFilterAnimationSpeed(idx, speed) {
  return {
    type: _actionTypes["default"].UPDATE_FILTER_ANIMATION_SPEED,
    idx: idx,
    speed: speed
  };
}
/**
 * Reset animation
 * @memberof visStateActions
 * @param value -  Current value of the slider
 * @type {typeof import('./vis-state-actions').updateAnimationTime}
 * @returns action
 * @public
 */


function updateAnimationTime(value) {
  return {
    type: _actionTypes["default"].UPDATE_ANIMATION_TIME,
    value: value
  };
}
/**
 * update trip layer animation speed
 * @memberof visStateActions
 * @param speed - `speed` to change it to. `speed` is a multiplier
 * @type {typeof import('./vis-state-actions').updateLayerAnimationSpeed}
 * @returns action
 * @public
 */


function updateLayerAnimationSpeed(speed) {
  return {
    type: _actionTypes["default"].UPDATE_LAYER_ANIMATION_SPEED,
    speed: speed
  };
}
/**
 * Show larger time filter at bottom for time playback (apply to time filter only)
 * @memberof visStateActions
 * @param idx - index of filter to enlarge
 * @type {typeof import('./vis-state-actions').enlargeFilter}
 * @returns action
 * @public
 */


function enlargeFilter(idx) {
  return {
    type: _actionTypes["default"].ENLARGE_FILTER,
    idx: idx
  };
}
/**
 * Show/hide filter feature on map
 * @memberof visStateActions
 * @param idx - index of filter feature to show/hide
 * @type {typeof import('./vis-state-actions').toggleFilterFeature}
 * @return action
 */


function toggleFilterFeature(idx) {
  return {
    type: _actionTypes["default"].TOGGLE_FILTER_FEATURE,
    idx: idx
  };
}
/**
 * Trigger layer hover event with hovered object
 * @memberof visStateActions
 * @param info - Object hovered, returned by deck.gl
 * @type {typeof import('./vis-state-actions').onLayerHover}
 * @returns action
 * @public
 */


function onLayerHover(info) {
  return {
    type: _actionTypes["default"].LAYER_HOVER,
    info: info
  };
}
/**
 * Trigger layer click event with clicked object
 * @memberof visStateActions
 * @param info - Object clicked, returned by deck.gl
 * @type {typeof import('./vis-state-actions').onLayerClick}
 * @returns action
 * @public
 */


function onLayerClick(info) {
  return {
    type: _actionTypes["default"].LAYER_CLICK,
    info: info
  };
}
/**
 * Trigger map click event, unselect clicked object
 * @memberof visStateActions
 * @type {typeof import('./vis-state-actions').onMapClick}
 * @returns action
 * @public
 */


function onMapClick() {
  return {
    type: _actionTypes["default"].MAP_CLICK
  };
}
/**
 * Trigger map mouse moveevent, payload would be
 * React-map-gl PointerEvent
 * https://uber.github.io/react-map-gl/#/documentation/api-reference/pointer-event
 *
 * @memberof visStateActions
 * @param evt - PointerEvent
 * @type {typeof import('./vis-state-actions').onMouseMove}
 * @returns action
 * @public
 */


function onMouseMove(evt) {
  return {
    type: _actionTypes["default"].MOUSE_MOVE,
    evt: evt
  };
}
/**
 * Toggle visibility of a layer in a split map
 * @memberof visStateActions
 * @param mapIndex - index of the split map
 * @param layerId - id of the layer
 * @type {typeof import('./vis-state-actions').toggleLayerForMap}
 * @returns action
 * @public
 */


function toggleLayerForMap(mapIndex, layerId) {
  return {
    type: _actionTypes["default"].TOGGLE_LAYER_FOR_MAP,
    mapIndex: mapIndex,
    layerId: layerId
  };
}
/**
 * Set the property of a filter plot
 * @memberof visStateActions
 * @param idx
 * @param newProp key value mapping of new prop `{yAxis: 'histogram'}`
 * @param valueIndex dataId index
 * @type {typeof import('./vis-state-actions').setFilterPlot}
 * @returns action
 * @public
 */


function setFilterPlot(idx, newProp, valueIndex) {
  return {
    type: _actionTypes["default"].SET_FILTER_PLOT,
    idx: idx,
    newProp: newProp,
    valueIndex: valueIndex
  };
}
/**
 * Set the property of a filter plot
 * @memberof visStateActions
 * @param info
 * @type {typeof import('./vis-state-actions').setMapInfo}
 * @returns action
 * @public
 */


function setMapInfo(info) {
  return {
    type: _actionTypes["default"].SET_MAP_INFO,
    info: info
  };
}
/**
 * Trigger file loading dispatch `addDataToMap` if succeed, or `loadFilesErr` if failed
 * @memberof visStateActions
 * @param files array of fileblob
 * @type {typeof import('./vis-state-actions').loadFiles}
 * @returns action
 * @public
 */


function loadFiles(files) {
  return {
    type: _actionTypes["default"].LOAD_FILES,
    files: files
  };
}
/**
 * Called with next file to load
 * @memberof visStateActions
 * @param payload
 * @type {typeof import('./vis-state-actions').loadNextFile}
 * @returns action
 * @public
 */


function loadNextFile(_ref) {
  var fileCache = _ref.fileCache,
      filesToLoad = _ref.filesToLoad,
      totalCount = _ref.totalCount,
      onFinish = _ref.onFinish;
  return {
    type: _actionTypes["default"].LOAD_NEXT_FILE,
    fileCache: fileCache,
    filesToLoad: filesToLoad,
    totalCount: totalCount,
    onFinish: onFinish
  };
}
/**
 * called when all files are processed and loaded
 * @memberof visStateActions
 * @param result
 * @type {typeof import('./vis-state-actions').loadFileSuccess}
 * @returns action
 */


function loadFileSuccess(result) {
  return {
    type: _actionTypes["default"].LOAD_FILES_SUCCESS,
    result: result
  };
}
/**
 * Trigger loading file error
 * @memberof visStateActions
 * @param  error
 * @type {typeof import('./vis-state-actions').loadFilesErr}
 * @returns action
 * @public
 */


function loadFilesErr(error) {
  return {
    type: _actionTypes["default"].LOAD_FILES_ERR,
    error: error
  };
}
/**
 * Store features to state
 * @memberof visStateActions
 * @param features
 * @type {typeof import('./vis-state-actions').setFeatures}
 * @returns action
 */


function setFeatures(features) {
  return {
    type: _actionTypes["default"].SET_FEATURES,
    features: features
  };
}
/**
 * It will apply the provide feature as filter to the given layer.
 * If the given feature is already applied as filter to the layer, it will remove the layer from the filter
 * @memberof visStateActions
 * @param layer
 * @param feature
 * @type {typeof import('./vis-state-actions').setPolygonFilterLayer}
 * @returns action
 */


function setPolygonFilterLayer(layer, feature) {
  return {
    type: _actionTypes["default"].SET_POLYGON_FILTER_LAYER,
    layer: layer,
    feature: feature
  };
}
/**
 * Set the current feature to be edited/deleted
 * @memberof visStateActions
 * @param feature
 * @type {typeof import('./vis-state-actions').setSelectedFeature}
 * @returns action
 */


function setSelectedFeature(feature) {
  return {
    type: _actionTypes["default"].SET_SELECTED_FEATURE,
    feature: feature
  };
}
/**
 * Delete the given feature
 * @memberof visStateActions
 * @param feature
 * @type {typeof import('./vis-state-actions').deleteFeature}
 * @returns action
 */


function deleteFeature(feature) {
  return {
    type: _actionTypes["default"].DELETE_FEATURE,
    feature: feature
  };
}
/** Set the map mode
 * @memberof visStateActions
 * @param mode one of EDITOR_MODES
 * @type {typeof import('./vis-state-actions').setEditorMode}
 * @returns action
 * @public
 * @example
 * import {setMapMode} from 'kepler.gl/actions';
 * import {EDITOR_MODES} from 'kepler.gl/constants';
 *
 * this.props.dispatch(setMapMode(EDITOR_MODES.DRAW_POLYGON));
 */


function setEditorMode(mode) {
  return {
    type: _actionTypes["default"].SET_EDITOR_MODE,
    mode: mode
  };
}
/**
 * Trigger CPU filter of selected dataset
 * @memberof visStateActions
 * @param dataId - single dataId or an array of dataIds
 * @type {typeof import('./vis-state-actions').applyCPUFilter}
 * @returns action
 * @public
 */


function applyCPUFilter(dataId) {
  return {
    type: _actionTypes["default"].APPLY_CPU_FILTER,
    dataId: dataId
  };
}
/**

 * Toggle editor layer visibility
 * @memberof visStateActions
 * @type {typeof import('./vis-state-actions').toggleEditorVisibility}
 * @return action
 */


function toggleEditorVisibility() {
  return {
    type: _actionTypes["default"].TOGGLE_EDITOR_VISIBILITY
  };
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
// @ts-ignore


var visStateActions = null;
/* eslint-enable no-unused-vars */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL3Zpcy1zdGF0ZS1hY3Rpb25zLmpzIl0sIm5hbWVzIjpbImxheWVyQ29uZmlnQ2hhbmdlIiwib2xkTGF5ZXIiLCJuZXdDb25maWciLCJ0eXBlIiwiQWN0aW9uVHlwZXMiLCJMQVlFUl9DT05GSUdfQ0hBTkdFIiwibGF5ZXJUZXh0TGFiZWxDaGFuZ2UiLCJpZHgiLCJwcm9wIiwidmFsdWUiLCJMQVlFUl9URVhUX0xBQkVMX0NIQU5HRSIsImxheWVyVHlwZUNoYW5nZSIsIm5ld1R5cGUiLCJMQVlFUl9UWVBFX0NIQU5HRSIsImxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ0NoYW5nZSIsImNoYW5uZWwiLCJMQVlFUl9WSVNVQUxfQ0hBTk5FTF9DSEFOR0UiLCJsYXllclZpc0NvbmZpZ0NoYW5nZSIsIm5ld1Zpc0NvbmZpZyIsIkxBWUVSX1ZJU19DT05GSUdfQ0hBTkdFIiwibGF5ZXJDb2xvclVJQ2hhbmdlIiwiTEFZRVJfQ09MT1JfVUlfQ0hBTkdFIiwidXBkYXRlTGF5ZXJCbGVuZGluZyIsIm1vZGUiLCJVUERBVEVfTEFZRVJfQkxFTkRJTkciLCJpbnRlcmFjdGlvbkNvbmZpZ0NoYW5nZSIsImNvbmZpZyIsIklOVEVSQUNUSU9OX0NPTkZJR19DSEFOR0UiLCJzZXRGaWx0ZXIiLCJ2YWx1ZUluZGV4IiwiU0VUX0ZJTFRFUiIsImFkZEZpbHRlciIsImRhdGFJZCIsIkFERF9GSUxURVIiLCJhZGRMYXllciIsInByb3BzIiwiQUREX0xBWUVSIiwicmVvcmRlckxheWVyIiwib3JkZXIiLCJSRU9SREVSX0xBWUVSIiwicmVtb3ZlRmlsdGVyIiwiUkVNT1ZFX0ZJTFRFUiIsInJlbW92ZUxheWVyIiwiUkVNT1ZFX0xBWUVSIiwicmVtb3ZlRGF0YXNldCIsIlJFTU9WRV9EQVRBU0VUIiwic2hvd0RhdGFzZXRUYWJsZSIsIlNIT1dfREFUQVNFVF9UQUJMRSIsInNvcnRUYWJsZUNvbHVtbiIsImNvbHVtbiIsIlNPUlRfVEFCTEVfQ09MVU1OIiwicGluVGFibGVDb2x1bW4iLCJQSU5fVEFCTEVfQ09MVU1OIiwiY29weVRhYmxlQ29sdW1uIiwiQ09QWV9UQUJMRV9DT0xVTU4iLCJ1cGRhdGVWaXNEYXRhIiwiZGF0YXNldHMiLCJvcHRpb25zIiwiVVBEQVRFX1ZJU19EQVRBIiwidG9nZ2xlRmlsdGVyQW5pbWF0aW9uIiwiVE9HR0xFX0ZJTFRFUl9BTklNQVRJT04iLCJ1cGRhdGVGaWx0ZXJBbmltYXRpb25TcGVlZCIsInNwZWVkIiwiVVBEQVRFX0ZJTFRFUl9BTklNQVRJT05fU1BFRUQiLCJ1cGRhdGVBbmltYXRpb25UaW1lIiwiVVBEQVRFX0FOSU1BVElPTl9USU1FIiwidXBkYXRlTGF5ZXJBbmltYXRpb25TcGVlZCIsIlVQREFURV9MQVlFUl9BTklNQVRJT05fU1BFRUQiLCJlbmxhcmdlRmlsdGVyIiwiRU5MQVJHRV9GSUxURVIiLCJ0b2dnbGVGaWx0ZXJGZWF0dXJlIiwiVE9HR0xFX0ZJTFRFUl9GRUFUVVJFIiwib25MYXllckhvdmVyIiwiaW5mbyIsIkxBWUVSX0hPVkVSIiwib25MYXllckNsaWNrIiwiTEFZRVJfQ0xJQ0siLCJvbk1hcENsaWNrIiwiTUFQX0NMSUNLIiwib25Nb3VzZU1vdmUiLCJldnQiLCJNT1VTRV9NT1ZFIiwidG9nZ2xlTGF5ZXJGb3JNYXAiLCJtYXBJbmRleCIsImxheWVySWQiLCJUT0dHTEVfTEFZRVJfRk9SX01BUCIsInNldEZpbHRlclBsb3QiLCJuZXdQcm9wIiwiU0VUX0ZJTFRFUl9QTE9UIiwic2V0TWFwSW5mbyIsIlNFVF9NQVBfSU5GTyIsImxvYWRGaWxlcyIsImZpbGVzIiwiTE9BRF9GSUxFUyIsImxvYWROZXh0RmlsZSIsImZpbGVDYWNoZSIsImZpbGVzVG9Mb2FkIiwidG90YWxDb3VudCIsIm9uRmluaXNoIiwiTE9BRF9ORVhUX0ZJTEUiLCJsb2FkRmlsZVN1Y2Nlc3MiLCJyZXN1bHQiLCJMT0FEX0ZJTEVTX1NVQ0NFU1MiLCJsb2FkRmlsZXNFcnIiLCJlcnJvciIsIkxPQURfRklMRVNfRVJSIiwic2V0RmVhdHVyZXMiLCJmZWF0dXJlcyIsIlNFVF9GRUFUVVJFUyIsInNldFBvbHlnb25GaWx0ZXJMYXllciIsImxheWVyIiwiZmVhdHVyZSIsIlNFVF9QT0xZR09OX0ZJTFRFUl9MQVlFUiIsInNldFNlbGVjdGVkRmVhdHVyZSIsIlNFVF9TRUxFQ1RFRF9GRUFUVVJFIiwiZGVsZXRlRmVhdHVyZSIsIkRFTEVURV9GRUFUVVJFIiwic2V0RWRpdG9yTW9kZSIsIlNFVF9FRElUT1JfTU9ERSIsImFwcGx5Q1BVRmlsdGVyIiwiQVBQTFlfQ1BVX0ZJTFRFUiIsInRvZ2dsZUVkaXRvclZpc2liaWxpdHkiLCJUT0dHTEVfRURJVE9SX1ZJU0lCSUxJVFkiLCJ2aXNTdGF0ZUFjdGlvbnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQkE7O0FBckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBR0E7Ozs7Ozs7O0FBUU8sU0FBU0EsaUJBQVQsQ0FBMkJDLFFBQTNCLEVBQXFDQyxTQUFyQyxFQUFnRDtBQUNyRCxTQUFPO0FBQ0xDLElBQUFBLElBQUksRUFBRUMsd0JBQVlDLG1CQURiO0FBRUxKLElBQUFBLFFBQVEsRUFBUkEsUUFGSztBQUdMQyxJQUFBQSxTQUFTLEVBQVRBO0FBSEssR0FBUDtBQUtEO0FBRUQ7Ozs7Ozs7Ozs7OztBQVVPLFNBQVNJLG9CQUFULENBQThCTCxRQUE5QixFQUF3Q00sR0FBeEMsRUFBNkNDLElBQTdDLEVBQW1EQyxLQUFuRCxFQUEwRDtBQUMvRCxTQUFPO0FBQ0xOLElBQUFBLElBQUksRUFBRUMsd0JBQVlNLHVCQURiO0FBRUxULElBQUFBLFFBQVEsRUFBUkEsUUFGSztBQUdMTSxJQUFBQSxHQUFHLEVBQUhBLEdBSEs7QUFJTEMsSUFBQUEsSUFBSSxFQUFKQSxJQUpLO0FBS0xDLElBQUFB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LENBQXVCSixPQUF2QixFQUFnQztBQUNyQyxTQUFPO0FBQ0w1RyxJQUFBQSxJQUFJLEVBQUVDLHdCQUFZZ0gsY0FEYjtBQUVMTCxJQUFBQSxPQUFPLEVBQVBBO0FBRkssR0FBUDtBQUlEO0FBRUQ7Ozs7Ozs7Ozs7Ozs7O0FBWU8sU0FBU00sYUFBVCxDQUF1QjlGLElBQXZCLEVBQTZCO0FBQ2xDLFNBQU87QUFDTHBCLElBQUFBLElBQUksRUFBRUMsd0JBQVlrSCxlQURiO0FBRUwvRixJQUFBQSxJQUFJLEVBQUpBO0FBRkssR0FBUDtBQUlEO0FBRUQ7Ozs7Ozs7Ozs7QUFRTyxTQUFTZ0csY0FBVCxDQUF3QnZGLE1BQXhCLEVBQWdDO0FBQ3JDLFNBQU87QUFDTDdCLElBQUFBLElBQUksRUFBRUMsd0JBQVlvSCxnQkFEYjtBQUVMeEYsSUFBQUEsTUFBTSxFQUFOQTtBQUZLLEdBQVA7QUFJRDtBQUVEOzs7Ozs7Ozs7QUFPTyxTQUFTeUYsc0JBQVQsR0FBa0M7QUFDdkMsU0FBTztBQUNMdEgsSUFBQUEsSUFBSSxFQUFFQyx3QkFBWXNIO0FBRGIsR0FBUDtBQUdEO0FBRUQ7Ozs7QUFHQTs7Ozs7Ozs7QUFPQTtBQUNBOzs7QUFDQSxJQUFNQyxlQUFlLEdBQUcsSUFBeEI7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbi8vIHZpcy1zdGF0ZS1yZWR1Y2VyXG5pbXBvcnQgQWN0aW9uVHlwZXMgZnJvbSAnY29uc3RhbnRzL2FjdGlvbi10eXBlcyc7XG5cbi8qKlxuICogVXBkYXRlIGxheWVyIGJhc2UgY29uZmlnOiBkYXRhSWQsIGxhYmVsLCBjb2x1bW4sIGlzVmlzaWJsZVxuICogQHBhcmFtIG9sZExheWVyIC0gbGF5ZXIgdG8gYmUgdXBkYXRlZFxuICogQHBhcmFtIG5ld0NvbmZpZyAtIG5ldyBjb25maWcgdG8gYmUgbWVyZ2VkIHdpdGggb2xkIGNvbmZpZ1xuICogQHJldHVybnMgYWN0aW9uXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLmxheWVyQ29uZmlnQ2hhbmdlfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gbGF5ZXJDb25maWdDaGFuZ2Uob2xkTGF5ZXIsIG5ld0NvbmZpZykge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLkxBWUVSX0NPTkZJR19DSEFOR0UsXG4gICAgb2xkTGF5ZXIsXG4gICAgbmV3Q29uZmlnXG4gIH07XG59XG5cbi8qKlxuICogVXBkYXRlIGxheWVyIHRleHQgbGFiZWxcbiAqIEBwYXJhbSBvbGRMYXllciAtIGxheWVyIHRvIGJlIHVwZGF0ZWRcbiAqIEBwYXJhbSBpZHggLWBpZHhgIG9mIHRleHQgbGFiZWwgdG8gYmUgdXBkYXRlZFxuICogQHBhcmFtIHByb3AgLSBgcHJvcGAgb2YgdGV4dCBsYWJlbCwgZSxnLCBgYW5jaG9yYCwgYGFsaWdubWVudGAsIGBjb2xvcmAsIGBzaXplYCwgYGZpZWxkYFxuICogQHBhcmFtIHZhbHVlIC0gbmV3IHZhbHVlXG4gKiBAcmV0dXJucyBhY3Rpb25cbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1hY3Rpb25zJykubGF5ZXJUZXh0TGFiZWxDaGFuZ2V9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsYXllclRleHRMYWJlbENoYW5nZShvbGRMYXllciwgaWR4LCBwcm9wLCB2YWx1ZSkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLkxBWUVSX1RFWFRfTEFCRUxfQ0hBTkdFLFxuICAgIG9sZExheWVyLFxuICAgIGlkeCxcbiAgICBwcm9wLFxuICAgIHZhbHVlXG4gIH07XG59XG5cbi8qKlxuICogVXBkYXRlIGxheWVyIHR5cGUuIFByZXZpZXdzIGxheWVyIGNvbmZpZyB3aWxsIGJlIGNvcGllZCBpZiBhcHBsaWNhYmxlLlxuICogQHBhcmFtIG9sZExheWVyIC0gbGF5ZXIgdG8gYmUgdXBkYXRlZFxuICogQHBhcmFtIG5ld1R5cGUgLSBuZXcgdHlwZVxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLmxheWVyVHlwZUNoYW5nZX1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxheWVyVHlwZUNoYW5nZShvbGRMYXllciwgbmV3VHlwZSkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLkxBWUVSX1RZUEVfQ0hBTkdFLFxuICAgIG9sZExheWVyLFxuICAgIG5ld1R5cGVcbiAgfTtcbn1cblxuLyoqXG4gKiBVcGRhdGUgbGF5ZXIgdmlzdWFsIGNoYW5uZWxcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBvbGRMYXllciAtIGxheWVyIHRvIGJlIHVwZGF0ZWRcbiAqIEBwYXJhbSBuZXdDb25maWcgLSBuZXcgdmlzdWFsIGNoYW5uZWwgY29uZmlnXG4gKiBAcGFyYW0gY2hhbm5lbCAtIGNoYW5uZWwgdG8gYmUgdXBkYXRlZFxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLmxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ0NoYW5nZX1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ0NoYW5nZShvbGRMYXllciwgbmV3Q29uZmlnLCBjaGFubmVsKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuTEFZRVJfVklTVUFMX0NIQU5ORUxfQ0hBTkdFLFxuICAgIG9sZExheWVyLFxuICAgIG5ld0NvbmZpZyxcbiAgICBjaGFubmVsXG4gIH07XG59XG5cbi8qKlxuICogVXBkYXRlIGxheWVyIGB2aXNDb25maWdgXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gb2xkTGF5ZXIgLSBsYXllciB0byBiZSB1cGRhdGVkXG4gKiBAcGFyYW0gbmV3VmlzQ29uZmlnIC0gbmV3IHZpc0NvbmZpZyBhcyBhIGtleSB2YWx1ZSBtYXA6IGUuZy4gYHtvcGFjaXR5OiAwLjh9YFxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLmxheWVyVmlzQ29uZmlnQ2hhbmdlfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gbGF5ZXJWaXNDb25maWdDaGFuZ2Uob2xkTGF5ZXIsIG5ld1Zpc0NvbmZpZykge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLkxBWUVSX1ZJU19DT05GSUdfQ0hBTkdFLFxuICAgIG9sZExheWVyLFxuICAgIG5ld1Zpc0NvbmZpZ1xuICB9O1xufVxuXG4vKipcbiAqIFNldCB0aGUgY29sb3IgcGFsZXR0ZSB1aSBmb3IgbGF5ZXIgY29sb3JcbiAqIEBtZW1iZXJPZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBvbGRMYXllciAtIGxheWVyIHRvIGJlIHVwZGF0ZWRcbiAqIEBwYXJhbSBwcm9wIC0gd2hpY2ggY29sb3IgcHJvcFxuICogQHBhcmFtIG5ld0NvbmZpZyAtIHRvIGJlIG1lcmdlZFxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLmxheWVyQ29sb3JVSUNoYW5nZX1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxheWVyQ29sb3JVSUNoYW5nZShvbGRMYXllciwgcHJvcCwgbmV3Q29uZmlnKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuTEFZRVJfQ09MT1JfVUlfQ0hBTkdFLFxuICAgIG9sZExheWVyLFxuICAgIHByb3AsXG4gICAgbmV3Q29uZmlnXG4gIH07XG59XG5cbi8qKlxuICogVXBkYXRlIGxheWVyIGJsZW5kaW5nIG1vZGVcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBtb2RlIG9uZSBvZiBgYWRkaXRpdmVgLCBgbm9ybWFsYCBhbmQgYHN1YnRyYWN0aXZlYFxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLnVwZGF0ZUxheWVyQmxlbmRpbmd9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVMYXllckJsZW5kaW5nKG1vZGUpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5VUERBVEVfTEFZRVJfQkxFTkRJTkcsXG4gICAgbW9kZVxuICB9O1xufVxuXG4vKipcbiAqIFVwZGF0ZSBgaW50ZXJhY3Rpb25Db25maWdgXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gY29uZmlnIC0gbmV3IGNvbmZpZyBhcyBrZXkgdmFsdWUgbWFwOiBge3Rvb2x0aXA6IHtlbmFibGVkOiB0cnVlfX1gXG4gKiBAcmV0dXJucyBhY3Rpb25cbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1hY3Rpb25zJykuaW50ZXJhY3Rpb25Db25maWdDaGFuZ2V9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnRlcmFjdGlvbkNvbmZpZ0NoYW5nZShjb25maWcpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5JTlRFUkFDVElPTl9DT05GSUdfQ0hBTkdFLFxuICAgIGNvbmZpZ1xuICB9O1xufVxuXG4vKipcbiAqIFVwZGF0ZSBmaWx0ZXIgcHJvcGVydHlcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBpZHggLWBpZHhgIG9mIGZpbHRlciB0byBiZSB1cGRhdGVkXG4gKiBAcGFyYW0gcHJvcCAtIGBwcm9wYCBvZiBmaWx0ZXIsIGUsZywgYGRhdGFJZGAsIGBuYW1lYCwgYHZhbHVlYFxuICogQHBhcmFtIHZhbHVlIC0gbmV3IHZhbHVlXG4gKiBAcGFyYW0gdmFsdWVJbmRleCAtIGRhdGFJZCBpbmRleFxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLnNldEZpbHRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldEZpbHRlcihpZHgsIHByb3AsIHZhbHVlLCB2YWx1ZUluZGV4KSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuU0VUX0ZJTFRFUixcbiAgICBpZHgsXG4gICAgcHJvcCxcbiAgICB2YWx1ZSxcbiAgICB2YWx1ZUluZGV4XG4gIH07XG59XG5cbi8qKlxuICogQWRkIGEgbmV3IGZpbHRlclxuICogQG1lbWJlcm9mIHZpc1N0YXRlQWN0aW9uc1xuICogQHBhcmFtIGRhdGFJZCAtIGRhdGFzZXQgYGlkYCB0aGlzIG5ldyBmaWx0ZXIgaXMgYXNzb2NpYXRlZCB3aXRoXG4gKiBAcmV0dXJucyBhY3Rpb25cbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1hY3Rpb25zJykuYWRkRmlsdGVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkRmlsdGVyKGRhdGFJZCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLkFERF9GSUxURVIsXG4gICAgZGF0YUlkXG4gIH07XG59XG5cbi8qKlxuICogQWRkIGEgbmV3IGxheWVyXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gcHJvcHMgLSBuZXcgbGF5ZXIgcHJvcHNcbiAqIEByZXR1cm5zIGFjdGlvblxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLWFjdGlvbnMnKS5hZGRMYXllcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZExheWVyKHByb3BzKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuQUREX0xBWUVSLFxuICAgIHByb3BzXG4gIH07XG59XG5cbi8qKlxuICogUmVvcmRlciBsYXllciwgb3JkZXIgaXMgYW4gYXJyYXkgb2YgbGF5ZXIgaW5kZXhlcywgaW5kZXggMCB3aWxsIGJlIHRoZSBvbmUgYXQgdGhlIGJvdHRvbVxuICogQG1lbWJlcm9mIHZpc1N0YXRlQWN0aW9uc1xuICogQHBhcmFtIG9yZGVyIGFuIGFycmF5IG9mIGxheWVyIGluZGV4ZXNcbiAqIEByZXR1cm5zIGFjdGlvblxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLWFjdGlvbnMnKS5yZW9yZGVyTGF5ZXJ9XG4gKiBAcHVibGljXG4gKiBAZXhhbXBsZVxuICpcbiAqIC8vIGJyaW5nIGBsYXllcnNbMV1gIGJlbG93IGBsYXllcnNbMF1gLCB0aGUgc2VxdWVuY2UgbGF5ZXJzIHdpbGwgYmUgcmVuZGVyZWQgaXMgYDFgLCBgMGAsIGAyYCwgYDNgLlxuICogLy8gYDFgIHdpbGwgYmUgYXQgdGhlIGJvdHRvbSwgYDNgIHdpbGwgYmUgYXQgdGhlIHRvcC5cbiAqIHRoaXMucHJvcHMuZGlzcGF0Y2gocmVvcmRlckxheWVyKFsxLCAwLCAyLCAzXSkpO1xuICovXG5leHBvcnQgZnVuY3Rpb24gcmVvcmRlckxheWVyKG9yZGVyKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuUkVPUkRFUl9MQVlFUixcbiAgICBvcmRlclxuICB9O1xufVxuXG4vKipcbiAqIFJlbW92ZSBhIGZpbHRlciBmcm9tIGB2aXNTdGF0ZS5maWx0ZXJzYCwgb25jZSBhIGZpbHRlciBpcyByZW1vdmVkLCBkYXRhIHdpbGwgYmUgcmUtZmlsdGVyZWQgYW5kIGxheWVyIHdpbGwgYmUgdXBkYXRlZFxuICogQG1lbWJlcm9mIHZpc1N0YXRlQWN0aW9uc1xuICogQHBhcmFtIGlkeCBpZHggb2YgZmlsdGVyIHRvIGJlIHJlbW92ZWRcbiAqIEByZXR1cm5zIGFjdGlvblxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLWFjdGlvbnMnKS5yZW1vdmVGaWx0ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVGaWx0ZXIoaWR4KSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuUkVNT1ZFX0ZJTFRFUixcbiAgICBpZHhcbiAgfTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYSBsYXllclxuICogQG1lbWJlcm9mIHZpc1N0YXRlQWN0aW9uc1xuICogQHBhcmFtIGlkeCBpZHggb2YgbGF5ZXIgdG8gYmUgcmVtb3ZlZFxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLnJlbW92ZUxheWVyfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlTGF5ZXIoaWR4KSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuUkVNT1ZFX0xBWUVSLFxuICAgIGlkeFxuICB9O1xufVxuXG4vKipcbiAqIFJlbW92ZSBhIGRhdGFzZXQgYW5kIGFsbCBsYXllcnMsIGZpbHRlcnMsIHRvb2x0aXAgY29uZmlncyB0aGF0IGJhc2VkIG9uIGl0XG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gZGF0YUlkIGRhdGFzZXQgaWRcbiAqIEByZXR1cm5zIGFjdGlvblxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLWFjdGlvbnMnKS5yZW1vdmVEYXRhc2V0fVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRGF0YXNldChkYXRhSWQpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5SRU1PVkVfREFUQVNFVCxcbiAgICBkYXRhSWRcbiAgfTtcbn1cblxuLyoqXG4gKiBEaXNwbGF5IGRhdGFzZXQgdGFibGUgaW4gYSBtb2RhbFxuICogQG1lbWJlcm9mIHZpc1N0YXRlQWN0aW9uc1xuICogQHBhcmFtIGRhdGFJZCBkYXRhc2V0IGlkIHRvIHNob3cgaW4gdGFibGVcbiAqIEByZXR1cm5zIGFjdGlvblxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLWFjdGlvbnMnKS5zaG93RGF0YXNldFRhYmxlfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gc2hvd0RhdGFzZXRUYWJsZShkYXRhSWQpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5TSE9XX0RBVEFTRVRfVEFCTEUsXG4gICAgZGF0YUlkXG4gIH07XG59XG5cbi8qKlxuICogU29ydCBkYXRhc2V0IGNvbHVtbiwgZm9yIHRhYmxlIGRpc3BsYXlcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBkYXRhSWRcbiAqIEBwYXJhbSBjb2x1bW5cbiAqIEBwYXJhbSBtb2RlXG4gKiBAcmV0dXJucyBhY3Rpb25cbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1hY3Rpb25zJykuc29ydFRhYmxlQ29sdW1ufVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gc29ydFRhYmxlQ29sdW1uKGRhdGFJZCwgY29sdW1uLCBtb2RlKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuU09SVF9UQUJMRV9DT0xVTU4sXG4gICAgZGF0YUlkLFxuICAgIGNvbHVtbixcbiAgICBtb2RlXG4gIH07XG59XG5cbi8qKlxuICogUGluIGRhdGFzZXQgY29sdW1uLCBmb3IgdGFibGUgZGlzcGxheVxuICogQHBhcmFtIGRhdGFJZFxuICogQHBhcmFtIGNvbHVtblxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLnBpblRhYmxlQ29sdW1ufVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gcGluVGFibGVDb2x1bW4oZGF0YUlkLCBjb2x1bW4pIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5QSU5fVEFCTEVfQ09MVU1OLFxuICAgIGRhdGFJZCxcbiAgICBjb2x1bW5cbiAgfTtcbn1cblxuLyoqXG4gKiBDb3B5IGNvbHVtbiwgZm9yIHRhYmxlIGRpc3BsYXlcbiAqIEBwYXJhbSBkYXRhSWRcbiAqIEBwYXJhbSBjb2x1bW5cbiAqIEByZXR1cm5zIGFjdGlvblxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLWFjdGlvbnMnKS5jb3B5VGFibGVDb2x1bW59XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb3B5VGFibGVDb2x1bW4oZGF0YUlkLCBjb2x1bW4pIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5DT1BZX1RBQkxFX0NPTFVNTixcbiAgICBkYXRhSWQsXG4gICAgY29sdW1uXG4gIH07XG59XG5cbi8vICogQHBhcmFtIGRhdGFzZXQuaW5mbyAtaW5mbyBvZiBhIGRhdGFzZXRcbi8vICogQHBhcmFtIGRhdGFzZXQuaW5mby5pZCAtIGlkIG9mIHRoaXMgZGF0YXNldC4gSWYgY29uZmlnIGlzIGRlZmluZWQsIGBpZGAgc2hvdWxkIG1hdGNoZXMgdGhlIGBkYXRhSWRgIGluIGNvbmZpZy5cbi8vICogQHBhcmFtIGRhdGFzZXQuaW5mby5sYWJlbCAtIEEgZGlzcGxheSBuYW1lIG9mIHRoaXMgZGF0YXNldFxuLy8gKiBAcGFyYW0gZGF0YXNldC5kYXRhIC0gKioqcmVxdWlyZWQqKiBUaGUgZGF0YSBvYmplY3QsIGluIGEgdGFidWxhciBmb3JtYXQgd2l0aCAyIHByb3BlcnRpZXMgYGZpZWxkc2AgYW5kIGByb3dzYFxuLy8gKiBAcGFyYW0gZGF0YXNldC5kYXRhLmZpZWxkcyAtICoqKnJlcXVpcmVkKiogQXJyYXkgb2YgZmllbGRzLFxuLy8gKiBAcGFyYW0gZGF0YXNldC5kYXRhLmZpZWxkcy5uYW1lIC0gKioqcmVxdWlyZWQqKiBOYW1lIG9mIHRoZSBmaWVsZCxcbi8vICogQHBhcmFtIGRhdGFzZXQuZGF0YS5yb3dzIC0gKioqcmVxdWlyZWQqKiBBcnJheSBvZiByb3dzLCBpbiBhIHRhYnVsYXIgZm9ybWF0IHdpdGggYGZpZWxkc2AgYW5kIGByb3dzYFxuLyoqXG4gKiBBZGQgbmV3IGRhdGFzZXQgdG8gYHZpc1N0YXRlYCwgd2l0aCBvcHRpb24gdG8gbG9hZCBhIG1hcCBjb25maWcgYWxvbmcgd2l0aCB0aGUgZGF0YXNldHNcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBkYXRhc2V0cyAtICoqKnJlcXVpcmVkKiogZGF0YXNldHMgY2FuIGJlIGEgZGF0YXNldCBvciBhbiBhcnJheSBvZiBkYXRhc2V0c1xuICogRWFjaCBkYXRhc2V0IG9iamVjdCBuZWVkcyB0byBoYXZlIGBpbmZvYCBhbmQgYGRhdGFgIHByb3BlcnR5LlxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSBvcHRpb25zLmNlbnRlck1hcCBgZGVmYXVsdDogdHJ1ZWAgaWYgYGNlbnRlck1hcGAgaXMgc2V0IHRvIGB0cnVlYCBrZXBsZXIuZ2wgd2lsbFxuICogcGxhY2UgdGhlIG1hcCB2aWV3IHdpdGhpbiB0aGUgZGF0YSBwb2ludHMgYm91bmRhcmllc1xuICogQHBhcmFtIG9wdGlvbnMucmVhZE9ubHkgYGRlZmF1bHQ6IGZhbHNlYCBpZiBgcmVhZE9ubHlgIGlzIHNldCB0byBgdHJ1ZWBcbiAqIHRoZSBsZWZ0IHNldHRpbmcgcGFuZWwgd2lsbCBiZSBoaWRkZW5cbiAqIEBwYXJhbSBjb25maWcgdGhpcyBvYmplY3Qgd2lsbCBjb250YWluIHRoZSBmdWxsIGtlcGxlci5nbCBpbnN0YW5jZSBjb25maWd1cmF0aW9uIHttYXBTdGF0ZSwgbWFwU3R5bGUsIHZpc1N0YXRlfVxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLnVwZGF0ZVZpc0RhdGF9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVWaXNEYXRhKGRhdGFzZXRzLCBvcHRpb25zLCBjb25maWcpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5VUERBVEVfVklTX0RBVEEsXG4gICAgZGF0YXNldHMsXG4gICAgb3B0aW9ucyxcbiAgICBjb25maWdcbiAgfTtcbn1cblxuLyoqXG4gKiBTdGFydCBhbmQgZW5kIGZpbHRlciBhbmltYXRpb25cbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSB7TnVtYmVyfSBpZHggb2YgZmlsdGVyXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLnRvZ2dsZUZpbHRlckFuaW1hdGlvbn1cbiAqIEByZXR1cm5zIGFjdGlvblxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gdG9nZ2xlRmlsdGVyQW5pbWF0aW9uKGlkeCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLlRPR0dMRV9GSUxURVJfQU5JTUFUSU9OLFxuICAgIGlkeFxuICB9O1xufVxuXG4vKipcbiAqIENoYW5nZSBmaWx0ZXIgYW5pbWF0aW9uIHNwZWVkXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gaWR4IC0gIGBpZHhgIG9mIGZpbHRlclxuICogQHBhcmFtIHNwZWVkIC0gYHNwZWVkYCB0byBjaGFuZ2UgaXQgdG8uIGBzcGVlZGAgaXMgYSBtdWx0aXBsaWVyXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLnVwZGF0ZUZpbHRlckFuaW1hdGlvblNwZWVkfVxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVGaWx0ZXJBbmltYXRpb25TcGVlZChpZHgsIHNwZWVkKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuVVBEQVRFX0ZJTFRFUl9BTklNQVRJT05fU1BFRUQsXG4gICAgaWR4LFxuICAgIHNwZWVkXG4gIH07XG59XG5cbi8qKlxuICogUmVzZXQgYW5pbWF0aW9uXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gdmFsdWUgLSAgQ3VycmVudCB2YWx1ZSBvZiB0aGUgc2xpZGVyXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLnVwZGF0ZUFuaW1hdGlvblRpbWV9XG4gKiBAcmV0dXJucyBhY3Rpb25cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUFuaW1hdGlvblRpbWUodmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5VUERBVEVfQU5JTUFUSU9OX1RJTUUsXG4gICAgdmFsdWVcbiAgfTtcbn1cblxuLyoqXG4gKiB1cGRhdGUgdHJpcCBsYXllciBhbmltYXRpb24gc3BlZWRcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBzcGVlZCAtIGBzcGVlZGAgdG8gY2hhbmdlIGl0IHRvLiBgc3BlZWRgIGlzIGEgbXVsdGlwbGllclxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLWFjdGlvbnMnKS51cGRhdGVMYXllckFuaW1hdGlvblNwZWVkfVxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVMYXllckFuaW1hdGlvblNwZWVkKHNwZWVkKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuVVBEQVRFX0xBWUVSX0FOSU1BVElPTl9TUEVFRCxcbiAgICBzcGVlZFxuICB9O1xufVxuXG4vKipcbiAqIFNob3cgbGFyZ2VyIHRpbWUgZmlsdGVyIGF0IGJvdHRvbSBmb3IgdGltZSBwbGF5YmFjayAoYXBwbHkgdG8gdGltZSBmaWx0ZXIgb25seSlcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBpZHggLSBpbmRleCBvZiBmaWx0ZXIgdG8gZW5sYXJnZVxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLWFjdGlvbnMnKS5lbmxhcmdlRmlsdGVyfVxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlbmxhcmdlRmlsdGVyKGlkeCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLkVOTEFSR0VfRklMVEVSLFxuICAgIGlkeFxuICB9O1xufVxuXG4vKipcbiAqIFNob3cvaGlkZSBmaWx0ZXIgZmVhdHVyZSBvbiBtYXBcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBpZHggLSBpbmRleCBvZiBmaWx0ZXIgZmVhdHVyZSB0byBzaG93L2hpZGVcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1hY3Rpb25zJykudG9nZ2xlRmlsdGVyRmVhdHVyZX1cbiAqIEByZXR1cm4gYWN0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b2dnbGVGaWx0ZXJGZWF0dXJlKGlkeCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLlRPR0dMRV9GSUxURVJfRkVBVFVSRSxcbiAgICBpZHhcbiAgfTtcbn1cblxuLyoqXG4gKiBUcmlnZ2VyIGxheWVyIGhvdmVyIGV2ZW50IHdpdGggaG92ZXJlZCBvYmplY3RcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBpbmZvIC0gT2JqZWN0IGhvdmVyZWQsIHJldHVybmVkIGJ5IGRlY2suZ2xcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1hY3Rpb25zJykub25MYXllckhvdmVyfVxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvbkxheWVySG92ZXIoaW5mbykge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLkxBWUVSX0hPVkVSLFxuICAgIGluZm9cbiAgfTtcbn1cblxuLyoqXG4gKiBUcmlnZ2VyIGxheWVyIGNsaWNrIGV2ZW50IHdpdGggY2xpY2tlZCBvYmplY3RcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBpbmZvIC0gT2JqZWN0IGNsaWNrZWQsIHJldHVybmVkIGJ5IGRlY2suZ2xcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1hY3Rpb25zJykub25MYXllckNsaWNrfVxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvbkxheWVyQ2xpY2soaW5mbykge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLkxBWUVSX0NMSUNLLFxuICAgIGluZm9cbiAgfTtcbn1cblxuLyoqXG4gKiBUcmlnZ2VyIG1hcCBjbGljayBldmVudCwgdW5zZWxlY3QgY2xpY2tlZCBvYmplY3RcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1hY3Rpb25zJykub25NYXBDbGlja31cbiAqIEByZXR1cm5zIGFjdGlvblxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gb25NYXBDbGljaygpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5NQVBfQ0xJQ0tcbiAgfTtcbn1cblxuLyoqXG4gKiBUcmlnZ2VyIG1hcCBtb3VzZSBtb3ZlZXZlbnQsIHBheWxvYWQgd291bGQgYmVcbiAqIFJlYWN0LW1hcC1nbCBQb2ludGVyRXZlbnRcbiAqIGh0dHBzOi8vdWJlci5naXRodWIuaW8vcmVhY3QtbWFwLWdsLyMvZG9jdW1lbnRhdGlvbi9hcGktcmVmZXJlbmNlL3BvaW50ZXItZXZlbnRcbiAqXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gZXZ0IC0gUG9pbnRlckV2ZW50XG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLm9uTW91c2VNb3ZlfVxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvbk1vdXNlTW92ZShldnQpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5NT1VTRV9NT1ZFLFxuICAgIGV2dFxuICB9O1xufVxuXG4vKipcbiAqIFRvZ2dsZSB2aXNpYmlsaXR5IG9mIGEgbGF5ZXIgaW4gYSBzcGxpdCBtYXBcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBtYXBJbmRleCAtIGluZGV4IG9mIHRoZSBzcGxpdCBtYXBcbiAqIEBwYXJhbSBsYXllcklkIC0gaWQgb2YgdGhlIGxheWVyXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLnRvZ2dsZUxheWVyRm9yTWFwfVxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b2dnbGVMYXllckZvck1hcChtYXBJbmRleCwgbGF5ZXJJZCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLlRPR0dMRV9MQVlFUl9GT1JfTUFQLFxuICAgIG1hcEluZGV4LFxuICAgIGxheWVySWRcbiAgfTtcbn1cblxuLyoqXG4gKiBTZXQgdGhlIHByb3BlcnR5IG9mIGEgZmlsdGVyIHBsb3RcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBpZHhcbiAqIEBwYXJhbSBuZXdQcm9wIGtleSB2YWx1ZSBtYXBwaW5nIG9mIG5ldyBwcm9wIGB7eUF4aXM6ICdoaXN0b2dyYW0nfWBcbiAqIEBwYXJhbSB2YWx1ZUluZGV4IGRhdGFJZCBpbmRleFxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLWFjdGlvbnMnKS5zZXRGaWx0ZXJQbG90fVxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRGaWx0ZXJQbG90KGlkeCwgbmV3UHJvcCwgdmFsdWVJbmRleCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLlNFVF9GSUxURVJfUExPVCxcbiAgICBpZHgsXG4gICAgbmV3UHJvcCxcbiAgICB2YWx1ZUluZGV4XG4gIH07XG59XG5cbi8qKlxuICogU2V0IHRoZSBwcm9wZXJ0eSBvZiBhIGZpbHRlciBwbG90XG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gaW5mb1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLWFjdGlvbnMnKS5zZXRNYXBJbmZvfVxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRNYXBJbmZvKGluZm8pIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5TRVRfTUFQX0lORk8sXG4gICAgaW5mb1xuICB9O1xufVxuXG4vKipcbiAqIFRyaWdnZXIgZmlsZSBsb2FkaW5nIGRpc3BhdGNoIGBhZGREYXRhVG9NYXBgIGlmIHN1Y2NlZWQsIG9yIGBsb2FkRmlsZXNFcnJgIGlmIGZhaWxlZFxuICogQG1lbWJlcm9mIHZpc1N0YXRlQWN0aW9uc1xuICogQHBhcmFtIGZpbGVzIGFycmF5IG9mIGZpbGVibG9iXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLmxvYWRGaWxlc31cbiAqIEByZXR1cm5zIGFjdGlvblxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gbG9hZEZpbGVzKGZpbGVzKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuTE9BRF9GSUxFUyxcbiAgICBmaWxlc1xuICB9O1xufVxuXG4vKipcbiAqIENhbGxlZCB3aXRoIG5leHQgZmlsZSB0byBsb2FkXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gcGF5bG9hZFxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLWFjdGlvbnMnKS5sb2FkTmV4dEZpbGV9XG4gKiBAcmV0dXJucyBhY3Rpb25cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxvYWROZXh0RmlsZSh7ZmlsZUNhY2hlLCBmaWxlc1RvTG9hZCwgdG90YWxDb3VudCwgb25GaW5pc2h9KSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuTE9BRF9ORVhUX0ZJTEUsXG4gICAgZmlsZUNhY2hlLFxuICAgIGZpbGVzVG9Mb2FkLFxuICAgIHRvdGFsQ291bnQsXG4gICAgb25GaW5pc2hcbiAgfTtcbn1cblxuLyoqXG4gKiBjYWxsZWQgd2hlbiBhbGwgZmlsZXMgYXJlIHByb2Nlc3NlZCBhbmQgbG9hZGVkXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gcmVzdWx0XG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLmxvYWRGaWxlU3VjY2Vzc31cbiAqIEByZXR1cm5zIGFjdGlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gbG9hZEZpbGVTdWNjZXNzKHJlc3VsdCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLkxPQURfRklMRVNfU1VDQ0VTUyxcbiAgICByZXN1bHRcbiAgfTtcbn1cblxuLyoqXG4gKiBUcmlnZ2VyIGxvYWRpbmcgZmlsZSBlcnJvclxuICogQG1lbWJlcm9mIHZpc1N0YXRlQWN0aW9uc1xuICogQHBhcmFtICBlcnJvclxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLWFjdGlvbnMnKS5sb2FkRmlsZXNFcnJ9XG4gKiBAcmV0dXJucyBhY3Rpb25cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxvYWRGaWxlc0VycihlcnJvcikge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLkxPQURfRklMRVNfRVJSLFxuICAgIGVycm9yXG4gIH07XG59XG5cbi8qKlxuICogU3RvcmUgZmVhdHVyZXMgdG8gc3RhdGVcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBmZWF0dXJlc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLWFjdGlvbnMnKS5zZXRGZWF0dXJlc31cbiAqIEByZXR1cm5zIGFjdGlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0RmVhdHVyZXMoZmVhdHVyZXMpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5TRVRfRkVBVFVSRVMsXG4gICAgZmVhdHVyZXNcbiAgfTtcbn1cblxuLyoqXG4gKiBJdCB3aWxsIGFwcGx5IHRoZSBwcm92aWRlIGZlYXR1cmUgYXMgZmlsdGVyIHRvIHRoZSBnaXZlbiBsYXllci5cbiAqIElmIHRoZSBnaXZlbiBmZWF0dXJlIGlzIGFscmVhZHkgYXBwbGllZCBhcyBmaWx0ZXIgdG8gdGhlIGxheWVyLCBpdCB3aWxsIHJlbW92ZSB0aGUgbGF5ZXIgZnJvbSB0aGUgZmlsdGVyXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gbGF5ZXJcbiAqIEBwYXJhbSBmZWF0dXJlXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLnNldFBvbHlnb25GaWx0ZXJMYXllcn1cbiAqIEByZXR1cm5zIGFjdGlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0UG9seWdvbkZpbHRlckxheWVyKGxheWVyLCBmZWF0dXJlKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuU0VUX1BPTFlHT05fRklMVEVSX0xBWUVSLFxuICAgIGxheWVyLFxuICAgIGZlYXR1cmVcbiAgfTtcbn1cblxuLyoqXG4gKiBTZXQgdGhlIGN1cnJlbnQgZmVhdHVyZSB0byBiZSBlZGl0ZWQvZGVsZXRlZFxuICogQG1lbWJlcm9mIHZpc1N0YXRlQWN0aW9uc1xuICogQHBhcmFtIGZlYXR1cmVcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1hY3Rpb25zJykuc2V0U2VsZWN0ZWRGZWF0dXJlfVxuICogQHJldHVybnMgYWN0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRTZWxlY3RlZEZlYXR1cmUoZmVhdHVyZSkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLlNFVF9TRUxFQ1RFRF9GRUFUVVJFLFxuICAgIGZlYXR1cmVcbiAgfTtcbn1cblxuLyoqXG4gKiBEZWxldGUgdGhlIGdpdmVuIGZlYXR1cmVcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBmZWF0dXJlXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLmRlbGV0ZUZlYXR1cmV9XG4gKiBAcmV0dXJucyBhY3Rpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZUZlYXR1cmUoZmVhdHVyZSkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLkRFTEVURV9GRUFUVVJFLFxuICAgIGZlYXR1cmVcbiAgfTtcbn1cblxuLyoqIFNldCB0aGUgbWFwIG1vZGVcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBtb2RlIG9uZSBvZiBFRElUT1JfTU9ERVNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1hY3Rpb25zJykuc2V0RWRpdG9yTW9kZX1cbiAqIEByZXR1cm5zIGFjdGlvblxuICogQHB1YmxpY1xuICogQGV4YW1wbGVcbiAqIGltcG9ydCB7c2V0TWFwTW9kZX0gZnJvbSAna2VwbGVyLmdsL2FjdGlvbnMnO1xuICogaW1wb3J0IHtFRElUT1JfTU9ERVN9IGZyb20gJ2tlcGxlci5nbC9jb25zdGFudHMnO1xuICpcbiAqIHRoaXMucHJvcHMuZGlzcGF0Y2goc2V0TWFwTW9kZShFRElUT1JfTU9ERVMuRFJBV19QT0xZR09OKSk7XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRFZGl0b3JNb2RlKG1vZGUpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5TRVRfRURJVE9SX01PREUsXG4gICAgbW9kZVxuICB9O1xufVxuXG4vKipcbiAqIFRyaWdnZXIgQ1BVIGZpbHRlciBvZiBzZWxlY3RlZCBkYXRhc2V0XG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gZGF0YUlkIC0gc2luZ2xlIGRhdGFJZCBvciBhbiBhcnJheSBvZiBkYXRhSWRzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLmFwcGx5Q1BVRmlsdGVyfVxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhcHBseUNQVUZpbHRlcihkYXRhSWQpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5BUFBMWV9DUFVfRklMVEVSLFxuICAgIGRhdGFJZFxuICB9O1xufVxuXG4vKipcblxuICogVG9nZ2xlIGVkaXRvciBsYXllciB2aXNpYmlsaXR5XG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLnRvZ2dsZUVkaXRvclZpc2liaWxpdHl9XG4gKiBAcmV0dXJuIGFjdGlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9nZ2xlRWRpdG9yVmlzaWJpbGl0eSgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5UT0dHTEVfRURJVE9SX1ZJU0lCSUxJVFlcbiAgfTtcbn1cblxuLyoqXG4gKiBUaGlzIGRlY2xhcmF0aW9uIGlzIG5lZWRlZCB0byBncm91cCBhY3Rpb25zIGluIGRvY3NcbiAqL1xuLyoqXG4gKiBBY3Rpb25zIGhhbmRsZWQgbW9zdGx5IGJ5IGB2aXNTdGF0ZWAgcmVkdWNlci5cbiAqIFRoZXkgbWFuYWdlIGhvdyBkYXRhIGlzIHByb2Nlc3NlZCwgZmlsdGVyZWQgYW5kIGRpc3BsYXllZCBvbiB0aGUgbWFwIGJ5IG9wZXJhdGVzIG9uIGxheWVycyxcbiAqIGZpbHRlcnMgYW5kIGludGVyYWN0aW9uIHNldHRpbmdzLlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbi8vIEB0cy1pZ25vcmVcbmNvbnN0IHZpc1N0YXRlQWN0aW9ucyA9IG51bGw7XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG4iXX0=