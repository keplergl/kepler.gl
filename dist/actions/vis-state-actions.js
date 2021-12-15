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
exports.setFilterAnimationTime = setFilterAnimationTime;
exports.setFilterAnimationWindow = setFilterAnimationWindow;
exports.addFilter = addFilter;
exports.addLayer = addLayer;
exports.reorderLayer = reorderLayer;
exports.removeFilter = removeFilter;
exports.removeLayer = removeLayer;
exports.duplicateLayer = duplicateLayer;
exports.removeDataset = removeDataset;
exports.showDatasetTable = showDatasetTable;
exports.sortTableColumn = sortTableColumn;
exports.pinTableColumn = pinTableColumn;
exports.copyTableColumn = copyTableColumn;
exports.updateVisData = updateVisData;
exports.renameDataset = renameDataset;
exports.toggleFilterAnimation = toggleFilterAnimation;
exports.updateFilterAnimationSpeed = updateFilterAnimationSpeed;
exports.setLayerAnimationTime = setLayerAnimationTime;
exports.updateLayerAnimationSpeed = updateLayerAnimationSpeed;
exports.toggleLayerAnimation = toggleLayerAnimation;
exports.toggleLayerAnimationControl = toggleLayerAnimationControl;
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
exports.loadFilesSuccess = loadFilesSuccess;
exports.loadFileStepSuccess = loadFileStepSuccess;
exports.loadFilesErr = loadFilesErr;
exports.setFeatures = setFeatures;
exports.setPolygonFilterLayer = setPolygonFilterLayer;
exports.setSelectedFeature = setSelectedFeature;
exports.deleteFeature = deleteFeature;
exports.setEditorMode = setEditorMode;
exports.applyCPUFilter = applyCPUFilter;
exports.toggleEditorVisibility = toggleEditorVisibility;
exports.nextFileBatch = nextFileBatch;
exports.processFileContent = processFileContent;
exports.setLayerAnimationTimeConfig = setLayerAnimationTimeConfig;
exports.setFilterAnimationTimeConfig = setFilterAnimationTimeConfig;

var _actionTypes = _interopRequireDefault(require("../constants/action-types"));

// Copyright (c) 2021 Uber Technologies, Inc.
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
 * Same as Update filter
 * @memberof visStateActions
 * @param idx -`idx` of filter to be updated
 * @param prop - `prop` of filter, e,g, `dataId`, `name`, `value`
 * @param value - new value
 * @param valueIndex - dataId index
 * @returns action
 * @type {typeof import('./vis-state-actions').setFilterAnimationTime}
 * @public
 */


function setFilterAnimationTime(idx, prop, value, valueIndex) {
  return {
    type: _actionTypes["default"].SET_FILTER_ANIMATION_TIME,
    idx: idx,
    prop: prop,
    value: value,
    valueIndex: valueIndex
  };
}
/**
 * Same as Update filter
 * @memberof visStateActions
 * @type {typeof import('./vis-state-actions').setFilterAnimationWindow}
 * @public
 */


function setFilterAnimationWindow(_ref) {
  var id = _ref.id,
      animationWindow = _ref.animationWindow;
  return {
    type: _actionTypes["default"].SET_FILTER_ANIMATION_WINDOW,
    id: id,
    animationWindow: animationWindow
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
 * @param config - new layer config
 * @returns action
 * @type {typeof import('./vis-state-actions').addLayer}
 * @public
 */


function addLayer(config) {
  return {
    type: _actionTypes["default"].ADD_LAYER,
    config: config
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
 * Duplicate a layer
 * @memberof visStateActions
 * @param idx idx of layer to be duplicated
 * @returns action
 * @type {typeof import('./vis-state-actions').duplicateLayer}
 * @public
 */


function duplicateLayer(idx) {
  return {
    type: _actionTypes["default"].DUPLICATE_LAYER,
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
 * Rename an existing dataset in `visState`
 * @memberof visStateActions
 * @param dataId - ***required** Id of the dataset to update
 * @param label - ***required** New name for the dataset
 * @returns action
 * @type {typeof import('./vis-state-actions').renameDataset}
 * @public
 */


function renameDataset(dataId, label) {
  return {
    type: _actionTypes["default"].RENAME_DATASET,
    dataId: dataId,
    label: label
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
 * @type {typeof import('./vis-state-actions').setLayerAnimationTime}
 * @returns action
 * @public
 */


function setLayerAnimationTime(value) {
  return {
    type: _actionTypes["default"].SET_LAYER_ANIMATION_TIME,
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
 * start end end layer animation
 * @memberof visStateActions
 * @type {typeof import('./vis-state-actions').toggleLayerAnimation}
 * @returns action
 * @public
 */


function toggleLayerAnimation() {
  return {
    type: _actionTypes["default"].TOGGLE_LAYER_ANIMATION
  };
}
/**
 * hide and show layer animation control
 * @memberof visStateActions
 * @type {typeof import('./vis-state-actions').toggleLayerAnimationControl}
 * @returns action
 * @public
 */


function toggleLayerAnimationControl() {
  return {
    type: _actionTypes["default"].TOGGLE_LAYER_ANIMATION_CONTROL
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


function loadFiles(files, onFinish) {
  return {
    type: _actionTypes["default"].LOAD_FILES,
    files: files,
    onFinish: onFinish
  };
}
/**
 * Called with next file to load
 * @memberof visStateActions
 * @type {typeof import('./vis-state-actions').loadNextFile}
 * @returns action
 * @public
 */


function loadNextFile() {
  return {
    type: _actionTypes["default"].LOAD_NEXT_FILE
  };
}
/**
 * called when all files are processed and loaded
 * @memberof visStateActions
 * @param result
 * @type {typeof import('./vis-state-actions').loadFilesSuccess}
 * @returns action
 */


function loadFilesSuccess(result) {
  return {
    type: _actionTypes["default"].LOAD_FILES_SUCCESS,
    result: result
  };
}
/**
 * called when successfully loaded one file, ready to move on to the next one
 * @memberof visStateActions
 * @param result
 * @type {typeof import('./vis-state-actions').loadFileStepSuccess}
 * @returns action
 */


function loadFileStepSuccess(_ref2) {
  var fileName = _ref2.fileName,
      fileCache = _ref2.fileCache;
  return {
    type: _actionTypes["default"].LOAD_FILE_STEP_SUCCESS,
    fileName: fileName,
    fileCache: fileCache
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


function loadFilesErr(fileName, error) {
  return {
    type: _actionTypes["default"].LOAD_FILES_ERR,
    fileName: fileName,
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
 * Process the next file batch
 * @memberof visStateActions
 * @param payload - batch payload
 * @type {typeof import('./vis-state-actions').nextFileBatch}
 * @return action
 */


function nextFileBatch(payload) {
  return {
    type: _actionTypes["default"].NEXT_FILE_BATCH,
    payload: payload
  };
}
/**
 * Process the file content
 * @memberof visStateActions
 * @param payload - the file content
 * @type {typeof import('./vis-state-actions').processFileContent}
 * @return action
 */


function processFileContent(payload) {
  return {
    type: _actionTypes["default"].PROCESS_FILE_CONTENT,
    payload: payload
  };
}
/**
 * Set layer animation time format and timezone
 * @memberof visStateActions
 * @param config - {timeFormat: string, timezone: string}
 * @type {typeof import('./vis-state-actions').setLayerAnimationTimeConfig}
 * @return action
 */


function setLayerAnimationTimeConfig(config) {
  return {
    type: _actionTypes["default"].SET_LAYER_ANIMATION_TIME_CONFIG,
    config: config
  };
}
/**
 * Set Filter animation time format and timezone
 * @memberof visStateActions
 * @param idx
 * @param config
 * @type {typeof import('./vis-state-actions').setFilterAnimationTimeConfig}
 * @return action
 */


function setFilterAnimationTimeConfig(idx, config) {
  return {
    type: _actionTypes["default"].SET_FILTER_ANIMATION_TIME_CONFIG,
    idx: idx,
    config: config
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL3Zpcy1zdGF0ZS1hY3Rpb25zLmpzIl0sIm5hbWVzIjpbImxheWVyQ29uZmlnQ2hhbmdlIiwib2xkTGF5ZXIiLCJuZXdDb25maWciLCJ0eXBlIiwiQWN0aW9uVHlwZXMiLCJMQVlFUl9DT05GSUdfQ0hBTkdFIiwibGF5ZXJUZXh0TGFiZWxDaGFuZ2UiLCJpZHgiLCJwcm9wIiwidmFsdWUiLCJMQVlFUl9URVhUX0xBQkVMX0NIQU5HRSIsImxheWVyVHlwZUNoYW5nZSIsIm5ld1R5cGUiLCJMQVlFUl9UWVBFX0NIQU5HRSIsImxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ0NoYW5nZSIsImNoYW5uZWwiLCJMQVlFUl9WSVNVQUxfQ0hBTk5FTF9DSEFOR0UiLCJsYXllclZpc0NvbmZpZ0NoYW5nZSIsIm5ld1Zpc0NvbmZpZyIsIkxBWUVSX1ZJU19DT05GSUdfQ0hBTkdFIiwibGF5ZXJDb2xvclVJQ2hhbmdlIiwiTEFZRVJfQ09MT1JfVUlfQ0hBTkdFIiwidXBkYXRlTGF5ZXJCbGVuZGluZyIsIm1vZGUiLCJVUERBVEVfTEFZRVJfQkxFTkRJTkciLCJpbnRlcmFjdGlvbkNvbmZpZ0NoYW5nZSIsImNvbmZpZyIsIklOVEVSQUNUSU9OX0NPTkZJR19DSEFOR0UiLCJzZXRGaWx0ZXIiLCJ2YWx1ZUluZGV4IiwiU0VUX0ZJTFRFUiIsInNldEZpbHRlckFuaW1hdGlvblRpbWUiLCJTRVRfRklMVEVSX0FOSU1BVElPTl9USU1FIiwic2V0RmlsdGVyQW5pbWF0aW9uV2luZG93IiwiaWQiLCJhbmltYXRpb25XaW5kb3ciLCJTRVRfRklMVEVSX0FOSU1BVElPTl9XSU5ET1ciLCJhZGRGaWx0ZXIiLCJkYXRhSWQiLCJBRERfRklMVEVSIiwiYWRkTGF5ZXIiLCJBRERfTEFZRVIiLCJyZW9yZGVyTGF5ZXIiLCJvcmRlciIsIlJFT1JERVJfTEFZRVIiLCJyZW1vdmVGaWx0ZXIiLCJSRU1PVkVfRklMVEVSIiwicmVtb3ZlTGF5ZXIiLCJSRU1PVkVfTEFZRVIiLCJkdXBsaWNhdGVMYXllciIsIkRVUExJQ0FURV9MQVlFUiIsInJlbW92ZURhdGFzZXQiLCJSRU1PVkVfREFUQVNFVCIsInNob3dEYXRhc2V0VGFibGUiLCJTSE9XX0RBVEFTRVRfVEFCTEUiLCJzb3J0VGFibGVDb2x1bW4iLCJjb2x1bW4iLCJTT1JUX1RBQkxFX0NPTFVNTiIsInBpblRhYmxlQ29sdW1uIiwiUElOX1RBQkxFX0NPTFVNTiIsImNvcHlUYWJsZUNvbHVtbiIsIkNPUFlfVEFCTEVfQ09MVU1OIiwidXBkYXRlVmlzRGF0YSIsImRhdGFzZXRzIiwib3B0aW9ucyIsIlVQREFURV9WSVNfREFUQSIsInJlbmFtZURhdGFzZXQiLCJsYWJlbCIsIlJFTkFNRV9EQVRBU0VUIiwidG9nZ2xlRmlsdGVyQW5pbWF0aW9uIiwiVE9HR0xFX0ZJTFRFUl9BTklNQVRJT04iLCJ1cGRhdGVGaWx0ZXJBbmltYXRpb25TcGVlZCIsInNwZWVkIiwiVVBEQVRFX0ZJTFRFUl9BTklNQVRJT05fU1BFRUQiLCJzZXRMYXllckFuaW1hdGlvblRpbWUiLCJTRVRfTEFZRVJfQU5JTUFUSU9OX1RJTUUiLCJ1cGRhdGVMYXllckFuaW1hdGlvblNwZWVkIiwiVVBEQVRFX0xBWUVSX0FOSU1BVElPTl9TUEVFRCIsInRvZ2dsZUxheWVyQW5pbWF0aW9uIiwiVE9HR0xFX0xBWUVSX0FOSU1BVElPTiIsInRvZ2dsZUxheWVyQW5pbWF0aW9uQ29udHJvbCIsIlRPR0dMRV9MQVlFUl9BTklNQVRJT05fQ09OVFJPTCIsImVubGFyZ2VGaWx0ZXIiLCJFTkxBUkdFX0ZJTFRFUiIsInRvZ2dsZUZpbHRlckZlYXR1cmUiLCJUT0dHTEVfRklMVEVSX0ZFQVRVUkUiLCJvbkxheWVySG92ZXIiLCJpbmZvIiwiTEFZRVJfSE9WRVIiLCJvbkxheWVyQ2xpY2siLCJMQVlFUl9DTElDSyIsIm9uTWFwQ2xpY2siLCJNQVBfQ0xJQ0siLCJvbk1vdXNlTW92ZSIsImV2dCIsIk1PVVNFX01PVkUiLCJ0b2dnbGVMYXllckZvck1hcCIsIm1hcEluZGV4IiwibGF5ZXJJZCIsIlRPR0dMRV9MQVlFUl9GT1JfTUFQIiwic2V0RmlsdGVyUGxvdCIsIm5ld1Byb3AiLCJTRVRfRklMVEVSX1BMT1QiLCJzZXRNYXBJbmZvIiwiU0VUX01BUF9JTkZPIiwibG9hZEZpbGVzIiwiZmlsZXMiLCJvbkZpbmlzaCIsIkxPQURfRklMRVMiLCJsb2FkTmV4dEZpbGUiLCJMT0FEX05FWFRfRklMRSIsImxvYWRGaWxlc1N1Y2Nlc3MiLCJyZXN1bHQiLCJMT0FEX0ZJTEVTX1NVQ0NFU1MiLCJsb2FkRmlsZVN0ZXBTdWNjZXNzIiwiZmlsZU5hbWUiLCJmaWxlQ2FjaGUiLCJMT0FEX0ZJTEVfU1RFUF9TVUNDRVNTIiwibG9hZEZpbGVzRXJyIiwiZXJyb3IiLCJMT0FEX0ZJTEVTX0VSUiIsInNldEZlYXR1cmVzIiwiZmVhdHVyZXMiLCJTRVRfRkVBVFVSRVMiLCJzZXRQb2x5Z29uRmlsdGVyTGF5ZXIiLCJsYXllciIsImZlYXR1cmUiLCJTRVRfUE9MWUdPTl9GSUxURVJfTEFZRVIiLCJzZXRTZWxlY3RlZEZlYXR1cmUiLCJTRVRfU0VMRUNURURfRkVBVFVSRSIsImRlbGV0ZUZlYXR1cmUiLCJERUxFVEVfRkVBVFVSRSIsInNldEVkaXRvck1vZGUiLCJTRVRfRURJVE9SX01PREUiLCJhcHBseUNQVUZpbHRlciIsIkFQUExZX0NQVV9GSUxURVIiLCJ0b2dnbGVFZGl0b3JWaXNpYmlsaXR5IiwiVE9HR0xFX0VESVRPUl9WSVNJQklMSVRZIiwibmV4dEZpbGVCYXRjaCIsInBheWxvYWQiLCJORVhUX0ZJTEVfQkFUQ0giLCJwcm9jZXNzRmlsZUNvbnRlbnQiLCJQUk9DRVNTX0ZJTEVfQ09OVEVOVCIsInNldExheWVyQW5pbWF0aW9uVGltZUNvbmZpZyIsIlNFVF9MQVlFUl9BTklNQVRJT05fVElNRV9DT05GSUciLCJzZXRGaWx0ZXJBbmltYXRpb25UaW1lQ29uZmlnIiwiU0VUX0ZJTFRFUl9BTklNQVRJT05fVElNRV9DT05GSUciLCJ2aXNTdGF0ZUFjdGlvbnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFCQTs7QUFyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sU0FBU0EsaUJBQVQsQ0FBMkJDLFFBQTNCLEVBQXFDQyxTQUFyQyxFQUFnRDtBQUNyRCxTQUFPO0FBQ0xDLElBQUFBLElBQUksRUFBRUMsd0JBQVlDLG1CQURiO0FBRUxKLElBQUFBLFFBQVEsRUFBUkEsUUFGSztBQUdMQyxJQUFBQSxTQUFTLEVBQVRBO0FBSEssR0FBUDtBQUtEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNJLG9CQUFULENBQThCTCxRQUE5QixFQUF3Q00sR0FBeEMsRUFBNkNDLElBQTdDLEVBQW1EQyxLQUFuRCxFQUEwRDtBQUMvRCxTQUFPO0FBQ0xOLElBQUFBLElBQUksRUFBRUMsd0JBQVlNLHVCQURiO0FBRUxULElBQUFBLFFBQVEsRUFBUkEsUUFGSztBQUdMTSxJQUFBQSxHQUFHLEVBQUhBLEdBSEs7QUFJTEMsSUFBQUEsSUFBSSxFQUFKQSxJQUpLO0FBS0xDLElBQUFBLEtBQUssRUFBTEE7QUFMSyxHQUFQO0FBT0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTRSxlQUFULENBQXlCVixRQUF6QixFQUFtQ1csT0FBbkMsRUFBNEM7QUFDakQsU0FBTztBQUNMVCxJQUFBQSxJQUFJLEVBQUVDLHdCQUFZUyxpQkFEYjtBQUVMWixJQUFBQSxRQUFRLEVBQVJBLFFBRks7QUFHTFcsSUFBQUEsT0FBTyxFQUFQQTtBQUhLLEdBQVA7QUFLRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTRSw4QkFBVCxDQUF3Q2IsUUFBeEMsRUFBa0RDLFNBQWxELEVBQTZEYSxPQUE3RCxFQUFzRTtBQUMzRSxTQUFPO0FBQ0xaLElBQUFBLElBQUksRUFBRUMsd0JBQVlZLDJCQURiO0FBRUxmLElBQUFBLFFBQVEsRUFBUkEsUUFGSztBQUdMQyxJQUFBQSxTQUFTLEVBQVRBLFNBSEs7QUFJTGEsSUFBQUEsT0FBTyxFQUFQQTtBQUpLLEdBQVA7QUFNRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU0Usb0JBQVQsQ0FBOEJoQixRQUE5QixFQUF3Q2lCLFlBQXhDLEVBQXNEO0FBQzNELFNBQU87QUFDTGYsSUFBQUEsSUFBSSxFQUFFQyx3QkFBWWUsdUJBRGI7QUFFTGxCLElBQUFBLFFBQVEsRUFBUkEsUUFGSztBQUdMaUIsSUFBQUEsWUFBWSxFQUFaQTtBQUhLLEdBQVA7QUFLRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTRSxrQkFBVCxDQUE0Qm5CLFFBQTVCLEVBQXNDTyxJQUF0QyxFQUE0Q04sU0FBNUMsRUFBdUQ7QUFDNUQsU0FBTztBQUNMQyxJQUFBQSxJQUFJLEVBQUVDLHdCQUFZaUIscUJBRGI7QUFFTHBCLElBQUFBLFFBQVEsRUFBUkEsUUFGSztBQUdMTyxJQUFBQSxJQUFJLEVBQUpBLElBSEs7QUFJTE4sSUFBQUEsU0FBUyxFQUFUQTtBQUpLLEdBQVA7QUFNRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNvQixtQkFBVCxDQUE2QkMsSUFBN0IsRUFBbUM7QUFDeEMsU0FBTztBQUNMcEIsSUFBQUEsSUFBSSxFQUFFQyx3QkFBWW9CLHFCQURiO0FBRUxELElBQUFBLElBQUksRUFBSkE7QUFGSyxHQUFQO0FBSUQ7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTRSx1QkFBVCxDQUFpQ0MsTUFBakMsRUFBeUM7QUFDOUMsU0FBTztBQUNMdkIsSUFBQUEsSUFBSSxFQUFFQyx3QkFBWXVCLHlCQURiO0FBRUxELElBQUFBLE1BQU0sRUFBTkE7QUFGSyxHQUFQO0FBSUQ7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTRSxTQUFULENBQW1CckIsR0FBbkIsRUFBd0JDLElBQXhCLEVBQThCQyxLQUE5QixFQUFxQ29CLFVBQXJDLEVBQWlEO0FBQ3RELFNBQU87QUFDTDFCLElBQUFBLElBQUksRUFBRUMsd0JBQVkwQixVQURiO0FBRUx2QixJQUFBQSxHQUFHLEVBQUhBLEdBRks7QUFHTEMsSUFBQUEsSUFBSSxFQUFKQSxJQUhLO0FBSUxDLElBQUFBLEtBQUssRUFBTEEsS0FKSztBQUtMb0IsSUFBQUEsVUFBVSxFQUFWQTtBQUxLLEdBQVA7QUFPRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNFLHNCQUFULENBQWdDeEIsR0FBaEMsRUFBcUNDLElBQXJDLEVBQTJDQyxLQUEzQyxFQUFrRG9CLFVBQWxELEVBQThEO0FBQ25FLFNBQU87QUFDTDFCLElBQUFBLElBQUksRUFBRUMsd0JBQVk0Qix5QkFEYjtBQUVMekIsSUFBQUEsR0FBRyxFQUFIQSxHQUZLO0FBR0xDLElBQUFBLElBQUksRUFBSkEsSUFISztBQUlMQyxJQUFBQSxLQUFLLEVBQUxBLEtBSks7QUFLTG9CLElBQUFBLFVBQVUsRUFBVkE7QUFMSyxHQUFQO0FBT0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNJLHdCQUFULE9BQXlEO0FBQUEsTUFBdEJDLEVBQXNCLFFBQXRCQSxFQUFzQjtBQUFBLE1BQWxCQyxlQUFrQixRQUFsQkEsZUFBa0I7QUFDOUQsU0FBTztBQUNMaEMsSUFBQUEsSUFBSSxFQUFFQyx3QkFBWWdDLDJCQURiO0FBRUxGLElBQUFBLEVBQUUsRUFBRkEsRUFGSztBQUdMQyxJQUFBQSxlQUFlLEVBQWZBO0FBSEssR0FBUDtBQUtEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU0UsU0FBVCxDQUFtQkMsTUFBbkIsRUFBMkI7QUFDaEMsU0FBTztBQUNMbkMsSUFBQUEsSUFBSSxFQUFFQyx3QkFBWW1DLFVBRGI7QUFFTEQsSUFBQUEsTUFBTSxFQUFOQTtBQUZLLEdBQVA7QUFJRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNFLFFBQVQsQ0FBa0JkLE1BQWxCLEVBQTBCO0FBQy9CLFNBQU87QUFDTHZCLElBQUFBLElBQUksRUFBRUMsd0JBQVlxQyxTQURiO0FBRUxmLElBQUFBLE1BQU0sRUFBTkE7QUFGSyxHQUFQO0FBSUQ7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU2dCLFlBQVQsQ0FBc0JDLEtBQXRCLEVBQTZCO0FBQ2xDLFNBQU87QUFDTHhDLElBQUFBLElBQUksRUFBRUMsd0JBQVl3QyxhQURiO0FBRUxELElBQUFBLEtBQUssRUFBTEE7QUFGSyxHQUFQO0FBSUQ7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTRSxZQUFULENBQXNCdEMsR0FBdEIsRUFBMkI7QUFDaEMsU0FBTztBQUNMSixJQUFBQSxJQUFJLEVBQUVDLHdCQUFZMEMsYUFEYjtBQUVMdkMsSUFBQUEsR0FBRyxFQUFIQTtBQUZLLEdBQVA7QUFJRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVN3QyxXQUFULENBQXFCeEMsR0FBckIsRUFBMEI7QUFDL0IsU0FBTztBQUNMSixJQUFBQSxJQUFJLEVBQUVDLHdCQUFZNEMsWUFEYjtBQUVMekMsSUFBQUEsR0FBRyxFQUFIQTtBQUZLLEdBQVA7QUFJRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVMwQyxjQUFULENBQXdCMUMsR0FBeEIsRUFBNkI7QUFDbEMsU0FBTztBQUNMSixJQUFBQSxJQUFJLEVBQUVDLHdCQUFZOEMsZUFEYjtBQUVMM0MsSUFBQUEsR0FBRyxFQUFIQTtBQUZLLEdBQVA7QUFJRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVM0QyxhQUFULENBQXVCYixNQUF2QixFQUErQjtBQUNwQyxTQUFPO0FBQ0xuQyxJQUFBQSxJQUFJLEVBQUVDLHdCQUFZZ0QsY0FEYjtBQUVMZCxJQUFBQSxNQUFNLEVBQU5BO0FBRkssR0FBUDtBQUlEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU2UsZ0JBQVQsQ0FBMEJmLE1BQTFCLEVBQWtDO0FBQ3ZDLFNBQU87QUFDTG5DLElBQUFBLElBQUksRUFBRUMsd0JBQVlrRCxrQkFEYjtBQUVMaEIsSUFBQUEsTUFBTSxFQUFOQTtBQUZLLEdBQVA7QUFJRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTaUIsZUFBVCxDQUF5QmpCLE1BQXpCLEVBQWlDa0IsTUFBakMsRUFBeUNqQyxJQUF6QyxFQUErQztBQUNwRCxTQUFPO0FBQ0xwQixJQUFBQSxJQUFJLEVBQUVDLHdCQUFZcUQsaUJBRGI7QUFFTG5CLElBQUFBLE1BQU0sRUFBTkEsTUFGSztBQUdMa0IsSUFBQUEsTUFBTSxFQUFOQSxNQUhLO0FBSUxqQyxJQUFBQSxJQUFJLEVBQUpBO0FBSkssR0FBUDtBQU1EO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU21DLGNBQVQsQ0FBd0JwQixNQUF4QixFQUFnQ2tCLE1BQWhDLEVBQXdDO0FBQzdDLFNBQU87QUFDTHJELElBQUFBLElBQUksRUFBRUMsd0JBQVl1RCxnQkFEYjtBQUVMckIsSUFBQUEsTUFBTSxFQUFOQSxNQUZLO0FBR0xrQixJQUFBQSxNQUFNLEVBQU5BO0FBSEssR0FBUDtBQUtEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU0ksZUFBVCxDQUF5QnRCLE1BQXpCLEVBQWlDa0IsTUFBakMsRUFBeUM7QUFDOUMsU0FBTztBQUNMckQsSUFBQUEsSUFBSSxFQUFFQyx3QkFBWXlELGlCQURiO0FBRUx2QixJQUFBQSxNQUFNLEVBQU5BLE1BRks7QUFHTGtCLElBQUFBLE1BQU0sRUFBTkE7QUFISyxHQUFQO0FBS0QsQyxDQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU00sYUFBVCxDQUF1QkMsUUFBdkIsRUFBaUNDLE9BQWpDLEVBQTBDdEMsTUFBMUMsRUFBa0Q7QUFDdkQsU0FBTztBQUNMdkIsSUFBQUEsSUFBSSxFQUFFQyx3QkFBWTZELGVBRGI7QUFFTEYsSUFBQUEsUUFBUSxFQUFSQSxRQUZLO0FBR0xDLElBQUFBLE9BQU8sRUFBUEEsT0FISztBQUlMdEMsSUFBQUEsTUFBTSxFQUFOQTtBQUpLLEdBQVA7QUFNRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU3dDLGFBQVQsQ0FBdUI1QixNQUF2QixFQUErQjZCLEtBQS9CLEVBQXNDO0FBQzNDLFNBQU87QUFDTGhFLElBQUFBLElBQUksRUFBRUMsd0JBQVlnRSxjQURiO0FBRUw5QixJQUFBQSxNQUFNLEVBQU5BLE1BRks7QUFHTDZCLElBQUFBLEtBQUssRUFBTEE7QUFISyxHQUFQO0FBS0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTRSxxQkFBVCxDQUErQjlELEdBQS9CLEVBQW9DO0FBQ3pDLFNBQU87QUFDTEosSUFBQUEsSUFBSSxFQUFFQyx3QkFBWWtFLHVCQURiO0FBRUwvRCxJQUFBQSxHQUFHLEVBQUhBO0FBRkssR0FBUDtBQUlEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTZ0UsMEJBQVQsQ0FBb0NoRSxHQUFwQyxFQUF5Q2lFLEtBQXpDLEVBQWdEO0FBQ3JELFNBQU87QUFDTHJFLElBQUFBLElBQUksRUFBRUMsd0JBQVlxRSw2QkFEYjtBQUVMbEUsSUFBQUEsR0FBRyxFQUFIQSxHQUZLO0FBR0xpRSxJQUFBQSxLQUFLLEVBQUxBO0FBSEssR0FBUDtBQUtEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU0UscUJBQVQsQ0FBK0JqRSxLQUEvQixFQUFzQztBQUMzQyxTQUFPO0FBQ0xOLElBQUFBLElBQUksRUFBRUMsd0JBQVl1RSx3QkFEYjtBQUVMbEUsSUFBQUEsS0FBSyxFQUFMQTtBQUZLLEdBQVA7QUFJRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNtRSx5QkFBVCxDQUFtQ0osS0FBbkMsRUFBMEM7QUFDL0MsU0FBTztBQUNMckUsSUFBQUEsSUFBSSxFQUFFQyx3QkFBWXlFLDRCQURiO0FBRUxMLElBQUFBLEtBQUssRUFBTEE7QUFGSyxHQUFQO0FBSUQ7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU00sb0JBQVQsR0FBZ0M7QUFDckMsU0FBTztBQUNMM0UsSUFBQUEsSUFBSSxFQUFFQyx3QkFBWTJFO0FBRGIsR0FBUDtBQUdEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNDLDJCQUFULEdBQXVDO0FBQzVDLFNBQU87QUFDTDdFLElBQUFBLElBQUksRUFBRUMsd0JBQVk2RTtBQURiLEdBQVA7QUFHRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNDLGFBQVQsQ0FBdUIzRSxHQUF2QixFQUE0QjtBQUNqQyxTQUFPO0FBQ0xKLElBQUFBLElBQUksRUFBRUMsd0JBQVkrRSxjQURiO0FBRUw1RSxJQUFBQSxHQUFHLEVBQUhBO0FBRkssR0FBUDtBQUlEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVM2RSxtQkFBVCxDQUE2QjdFLEdBQTdCLEVBQWtDO0FBQ3ZDLFNBQU87QUFDTEosSUFBQUEsSUFBSSxFQUFFQyx3QkFBWWlGLHFCQURiO0FBRUw5RSxJQUFBQSxHQUFHLEVBQUhBO0FBRkssR0FBUDtBQUlEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBUytFLFlBQVQsQ0FBc0JDLElBQXRCLEVBQTRCO0FBQ2pDLFNBQU87QUFDTHBGLElBQUFBLElBQUksRUFBRUMsd0JBQVlvRixXQURiO0FBRUxELElBQUFBLElBQUksRUFBSkE7QUFGSyxHQUFQO0FBSUQ7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTRSxZQUFULENBQXNCRixJQUF0QixFQUE0QjtBQUNqQyxTQUFPO0FBQ0xwRixJQUFBQSxJQUFJLEVBQUVDLHdCQUFZc0YsV0FEYjtBQUVMSCxJQUFBQSxJQUFJLEVBQUpBO0FBRkssR0FBUDtBQUlEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNJLFVBQVQsR0FBc0I7QUFDM0IsU0FBTztBQUNMeEYsSUFBQUEsSUFBSSxFQUFFQyx3QkFBWXdGO0FBRGIsR0FBUDtBQUdEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU0MsV0FBVCxDQUFxQkMsR0FBckIsRUFBMEI7QUFDL0IsU0FBTztBQUNMM0YsSUFBQUEsSUFBSSxFQUFFQyx3QkFBWTJGLFVBRGI7QUFFTEQsSUFBQUEsR0FBRyxFQUFIQTtBQUZLLEdBQVA7QUFJRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU0UsaUJBQVQsQ0FBMkJDLFFBQTNCLEVBQXFDQyxPQUFyQyxFQUE4QztBQUNuRCxTQUFPO0FBQ0wvRixJQUFBQSxJQUFJLEVBQUVDLHdCQUFZK0Ysb0JBRGI7QUFFTEYsSUFBQUEsUUFBUSxFQUFSQSxRQUZLO0FBR0xDLElBQUFBLE9BQU8sRUFBUEE7QUFISyxHQUFQO0FBS0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU0UsYUFBVCxDQUF1QjdGLEdBQXZCLEVBQTRCOEYsT0FBNUIsRUFBcUN4RSxVQUFyQyxFQUFpRDtBQUN0RCxTQUFPO0FBQ0wxQixJQUFBQSxJQUFJLEVBQUVDLHdCQUFZa0csZUFEYjtBQUVML0YsSUFBQUEsR0FBRyxFQUFIQSxHQUZLO0FBR0w4RixJQUFBQSxPQUFPLEVBQVBBLE9BSEs7QUFJTHhFLElBQUFBLFVBQVUsRUFBVkE7QUFKSyxHQUFQO0FBTUQ7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTMEUsVUFBVCxDQUFvQmhCLElBQXBCLEVBQTBCO0FBQy9CLFNBQU87QUFDTHBGLElBQUFBLElBQUksRUFBRUMsd0JBQVlvRyxZQURiO0FBRUxqQixJQUFBQSxJQUFJLEVBQUpBO0FBRkssR0FBUDtBQUlEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU2tCLFNBQVQsQ0FBbUJDLEtBQW5CLEVBQTBCQyxRQUExQixFQUFvQztBQUN6QyxTQUFPO0FBQ0x4RyxJQUFBQSxJQUFJLEVBQUVDLHdCQUFZd0csVUFEYjtBQUVMRixJQUFBQSxLQUFLLEVBQUxBLEtBRks7QUFHTEMsSUFBQUEsUUFBUSxFQUFSQTtBQUhLLEdBQVA7QUFLRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTRSxZQUFULEdBQXdCO0FBQzdCLFNBQU87QUFDTDFHLElBQUFBLElBQUksRUFBRUMsd0JBQVkwRztBQURiLEdBQVA7QUFHRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTQyxnQkFBVCxDQUEwQkMsTUFBMUIsRUFBa0M7QUFDdkMsU0FBTztBQUNMN0csSUFBQUEsSUFBSSxFQUFFQyx3QkFBWTZHLGtCQURiO0FBRUxELElBQUFBLE1BQU0sRUFBTkE7QUFGSyxHQUFQO0FBSUQ7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU0UsbUJBQVQsUUFBb0Q7QUFBQSxNQUF0QkMsUUFBc0IsU0FBdEJBLFFBQXNCO0FBQUEsTUFBWkMsU0FBWSxTQUFaQSxTQUFZO0FBQ3pELFNBQU87QUFDTGpILElBQUFBLElBQUksRUFBRUMsd0JBQVlpSCxzQkFEYjtBQUVMRixJQUFBQSxRQUFRLEVBQVJBLFFBRks7QUFHTEMsSUFBQUEsU0FBUyxFQUFUQTtBQUhLLEdBQVA7QUFLRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNFLFlBQVQsQ0FBc0JILFFBQXRCLEVBQWdDSSxLQUFoQyxFQUF1QztBQUM1QyxTQUFPO0FBQ0xwSCxJQUFBQSxJQUFJLEVBQUVDLHdCQUFZb0gsY0FEYjtBQUVMTCxJQUFBQSxRQUFRLEVBQVJBLFFBRks7QUFHTEksSUFBQUEsS0FBSyxFQUFMQTtBQUhLLEdBQVA7QUFLRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTRSxXQUFULENBQXFCQyxRQUFyQixFQUErQjtBQUNwQyxTQUFPO0FBQ0x2SCxJQUFBQSxJQUFJLEVBQUVDLHdCQUFZdUgsWUFEYjtBQUVMRCxJQUFBQSxRQUFRLEVBQVJBO0FBRkssR0FBUDtBQUlEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTRSxxQkFBVCxDQUErQkMsS0FBL0IsRUFBc0NDLE9BQXRDLEVBQStDO0FBQ3BELFNBQU87QUFDTDNILElBQUFBLElBQUksRUFBRUMsd0JBQVkySCx3QkFEYjtBQUVMRixJQUFBQSxLQUFLLEVBQUxBLEtBRks7QUFHTEMsSUFBQUEsT0FBTyxFQUFQQTtBQUhLLEdBQVA7QUFLRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTRSxrQkFBVCxDQUE0QkYsT0FBNUIsRUFBcUM7QUFDMUMsU0FBTztBQUNMM0gsSUFBQUEsSUFBSSxFQUFFQyx3QkFBWTZILG9CQURiO0FBRUxILElBQUFBLE9BQU8sRUFBUEE7QUFGSyxHQUFQO0FBSUQ7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU0ksYUFBVCxDQUF1QkosT0FBdkIsRUFBZ0M7QUFDckMsU0FBTztBQUNMM0gsSUFBQUEsSUFBSSxFQUFFQyx3QkFBWStILGNBRGI7QUFFTEwsSUFBQUEsT0FBTyxFQUFQQTtBQUZLLEdBQVA7QUFJRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU00sYUFBVCxDQUF1QjdHLElBQXZCLEVBQTZCO0FBQ2xDLFNBQU87QUFDTHBCLElBQUFBLElBQUksRUFBRUMsd0JBQVlpSSxlQURiO0FBRUw5RyxJQUFBQSxJQUFJLEVBQUpBO0FBRkssR0FBUDtBQUlEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBUytHLGNBQVQsQ0FBd0JoRyxNQUF4QixFQUFnQztBQUNyQyxTQUFPO0FBQ0xuQyxJQUFBQSxJQUFJLEVBQUVDLHdCQUFZbUksZ0JBRGI7QUFFTGpHLElBQUFBLE1BQU0sRUFBTkE7QUFGSyxHQUFQO0FBSUQ7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNrRyxzQkFBVCxHQUFrQztBQUN2QyxTQUFPO0FBQ0xySSxJQUFBQSxJQUFJLEVBQUVDLHdCQUFZcUk7QUFEYixHQUFQO0FBR0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU0MsYUFBVCxDQUF1QkMsT0FBdkIsRUFBZ0M7QUFDckMsU0FBTztBQUNMeEksSUFBQUEsSUFBSSxFQUFFQyx3QkFBWXdJLGVBRGI7QUFFTEQsSUFBQUEsT0FBTyxFQUFQQTtBQUZLLEdBQVA7QUFJRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTRSxrQkFBVCxDQUE0QkYsT0FBNUIsRUFBcUM7QUFDMUMsU0FBTztBQUNMeEksSUFBQUEsSUFBSSxFQUFFQyx3QkFBWTBJLG9CQURiO0FBRUxILElBQUFBLE9BQU8sRUFBUEE7QUFGSyxHQUFQO0FBSUQ7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU0ksMkJBQVQsQ0FBcUNySCxNQUFyQyxFQUE2QztBQUNsRCxTQUFPO0FBQ0x2QixJQUFBQSxJQUFJLEVBQUVDLHdCQUFZNEksK0JBRGI7QUFFTHRILElBQUFBLE1BQU0sRUFBTkE7QUFGSyxHQUFQO0FBSUQ7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTdUgsNEJBQVQsQ0FBc0MxSSxHQUF0QyxFQUEyQ21CLE1BQTNDLEVBQW1EO0FBQ3hELFNBQU87QUFDTHZCLElBQUFBLElBQUksRUFBRUMsd0JBQVk4SSxnQ0FEYjtBQUVMM0ksSUFBQUEsR0FBRyxFQUFIQSxHQUZLO0FBR0xtQixJQUFBQSxNQUFNLEVBQU5BO0FBSEssR0FBUDtBQUtEO0FBRUQ7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7OztBQUNBLElBQU15SCxlQUFlLEdBQUcsSUFBeEI7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbi8vIHZpcy1zdGF0ZS1yZWR1Y2VyXG5pbXBvcnQgQWN0aW9uVHlwZXMgZnJvbSAnY29uc3RhbnRzL2FjdGlvbi10eXBlcyc7XG5cbi8qKlxuICogVXBkYXRlIGxheWVyIGJhc2UgY29uZmlnOiBkYXRhSWQsIGxhYmVsLCBjb2x1bW4sIGlzVmlzaWJsZVxuICogQHBhcmFtIG9sZExheWVyIC0gbGF5ZXIgdG8gYmUgdXBkYXRlZFxuICogQHBhcmFtIG5ld0NvbmZpZyAtIG5ldyBjb25maWcgdG8gYmUgbWVyZ2VkIHdpdGggb2xkIGNvbmZpZ1xuICogQHJldHVybnMgYWN0aW9uXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLmxheWVyQ29uZmlnQ2hhbmdlfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gbGF5ZXJDb25maWdDaGFuZ2Uob2xkTGF5ZXIsIG5ld0NvbmZpZykge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLkxBWUVSX0NPTkZJR19DSEFOR0UsXG4gICAgb2xkTGF5ZXIsXG4gICAgbmV3Q29uZmlnXG4gIH07XG59XG5cbi8qKlxuICogVXBkYXRlIGxheWVyIHRleHQgbGFiZWxcbiAqIEBwYXJhbSBvbGRMYXllciAtIGxheWVyIHRvIGJlIHVwZGF0ZWRcbiAqIEBwYXJhbSBpZHggLWBpZHhgIG9mIHRleHQgbGFiZWwgdG8gYmUgdXBkYXRlZFxuICogQHBhcmFtIHByb3AgLSBgcHJvcGAgb2YgdGV4dCBsYWJlbCwgZSxnLCBgYW5jaG9yYCwgYGFsaWdubWVudGAsIGBjb2xvcmAsIGBzaXplYCwgYGZpZWxkYFxuICogQHBhcmFtIHZhbHVlIC0gbmV3IHZhbHVlXG4gKiBAcmV0dXJucyBhY3Rpb25cbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1hY3Rpb25zJykubGF5ZXJUZXh0TGFiZWxDaGFuZ2V9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsYXllclRleHRMYWJlbENoYW5nZShvbGRMYXllciwgaWR4LCBwcm9wLCB2YWx1ZSkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLkxBWUVSX1RFWFRfTEFCRUxfQ0hBTkdFLFxuICAgIG9sZExheWVyLFxuICAgIGlkeCxcbiAgICBwcm9wLFxuICAgIHZhbHVlXG4gIH07XG59XG5cbi8qKlxuICogVXBkYXRlIGxheWVyIHR5cGUuIFByZXZpZXdzIGxheWVyIGNvbmZpZyB3aWxsIGJlIGNvcGllZCBpZiBhcHBsaWNhYmxlLlxuICogQHBhcmFtIG9sZExheWVyIC0gbGF5ZXIgdG8gYmUgdXBkYXRlZFxuICogQHBhcmFtIG5ld1R5cGUgLSBuZXcgdHlwZVxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLmxheWVyVHlwZUNoYW5nZX1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxheWVyVHlwZUNoYW5nZShvbGRMYXllciwgbmV3VHlwZSkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLkxBWUVSX1RZUEVfQ0hBTkdFLFxuICAgIG9sZExheWVyLFxuICAgIG5ld1R5cGVcbiAgfTtcbn1cblxuLyoqXG4gKiBVcGRhdGUgbGF5ZXIgdmlzdWFsIGNoYW5uZWxcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBvbGRMYXllciAtIGxheWVyIHRvIGJlIHVwZGF0ZWRcbiAqIEBwYXJhbSBuZXdDb25maWcgLSBuZXcgdmlzdWFsIGNoYW5uZWwgY29uZmlnXG4gKiBAcGFyYW0gY2hhbm5lbCAtIGNoYW5uZWwgdG8gYmUgdXBkYXRlZFxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLmxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ0NoYW5nZX1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ0NoYW5nZShvbGRMYXllciwgbmV3Q29uZmlnLCBjaGFubmVsKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuTEFZRVJfVklTVUFMX0NIQU5ORUxfQ0hBTkdFLFxuICAgIG9sZExheWVyLFxuICAgIG5ld0NvbmZpZyxcbiAgICBjaGFubmVsXG4gIH07XG59XG5cbi8qKlxuICogVXBkYXRlIGxheWVyIGB2aXNDb25maWdgXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gb2xkTGF5ZXIgLSBsYXllciB0byBiZSB1cGRhdGVkXG4gKiBAcGFyYW0gbmV3VmlzQ29uZmlnIC0gbmV3IHZpc0NvbmZpZyBhcyBhIGtleSB2YWx1ZSBtYXA6IGUuZy4gYHtvcGFjaXR5OiAwLjh9YFxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLmxheWVyVmlzQ29uZmlnQ2hhbmdlfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gbGF5ZXJWaXNDb25maWdDaGFuZ2Uob2xkTGF5ZXIsIG5ld1Zpc0NvbmZpZykge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLkxBWUVSX1ZJU19DT05GSUdfQ0hBTkdFLFxuICAgIG9sZExheWVyLFxuICAgIG5ld1Zpc0NvbmZpZ1xuICB9O1xufVxuXG4vKipcbiAqIFNldCB0aGUgY29sb3IgcGFsZXR0ZSB1aSBmb3IgbGF5ZXIgY29sb3JcbiAqIEBtZW1iZXJPZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBvbGRMYXllciAtIGxheWVyIHRvIGJlIHVwZGF0ZWRcbiAqIEBwYXJhbSBwcm9wIC0gd2hpY2ggY29sb3IgcHJvcFxuICogQHBhcmFtIG5ld0NvbmZpZyAtIHRvIGJlIG1lcmdlZFxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLmxheWVyQ29sb3JVSUNoYW5nZX1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxheWVyQ29sb3JVSUNoYW5nZShvbGRMYXllciwgcHJvcCwgbmV3Q29uZmlnKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuTEFZRVJfQ09MT1JfVUlfQ0hBTkdFLFxuICAgIG9sZExheWVyLFxuICAgIHByb3AsXG4gICAgbmV3Q29uZmlnXG4gIH07XG59XG5cbi8qKlxuICogVXBkYXRlIGxheWVyIGJsZW5kaW5nIG1vZGVcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBtb2RlIG9uZSBvZiBgYWRkaXRpdmVgLCBgbm9ybWFsYCBhbmQgYHN1YnRyYWN0aXZlYFxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLnVwZGF0ZUxheWVyQmxlbmRpbmd9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVMYXllckJsZW5kaW5nKG1vZGUpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5VUERBVEVfTEFZRVJfQkxFTkRJTkcsXG4gICAgbW9kZVxuICB9O1xufVxuXG4vKipcbiAqIFVwZGF0ZSBgaW50ZXJhY3Rpb25Db25maWdgXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gY29uZmlnIC0gbmV3IGNvbmZpZyBhcyBrZXkgdmFsdWUgbWFwOiBge3Rvb2x0aXA6IHtlbmFibGVkOiB0cnVlfX1gXG4gKiBAcmV0dXJucyBhY3Rpb25cbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1hY3Rpb25zJykuaW50ZXJhY3Rpb25Db25maWdDaGFuZ2V9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnRlcmFjdGlvbkNvbmZpZ0NoYW5nZShjb25maWcpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5JTlRFUkFDVElPTl9DT05GSUdfQ0hBTkdFLFxuICAgIGNvbmZpZ1xuICB9O1xufVxuXG4vKipcbiAqIFVwZGF0ZSBmaWx0ZXIgcHJvcGVydHlcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBpZHggLWBpZHhgIG9mIGZpbHRlciB0byBiZSB1cGRhdGVkXG4gKiBAcGFyYW0gcHJvcCAtIGBwcm9wYCBvZiBmaWx0ZXIsIGUsZywgYGRhdGFJZGAsIGBuYW1lYCwgYHZhbHVlYFxuICogQHBhcmFtIHZhbHVlIC0gbmV3IHZhbHVlXG4gKiBAcGFyYW0gdmFsdWVJbmRleCAtIGRhdGFJZCBpbmRleFxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLnNldEZpbHRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldEZpbHRlcihpZHgsIHByb3AsIHZhbHVlLCB2YWx1ZUluZGV4KSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuU0VUX0ZJTFRFUixcbiAgICBpZHgsXG4gICAgcHJvcCxcbiAgICB2YWx1ZSxcbiAgICB2YWx1ZUluZGV4XG4gIH07XG59XG5cbi8qKlxuICogU2FtZSBhcyBVcGRhdGUgZmlsdGVyXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gaWR4IC1gaWR4YCBvZiBmaWx0ZXIgdG8gYmUgdXBkYXRlZFxuICogQHBhcmFtIHByb3AgLSBgcHJvcGAgb2YgZmlsdGVyLCBlLGcsIGBkYXRhSWRgLCBgbmFtZWAsIGB2YWx1ZWBcbiAqIEBwYXJhbSB2YWx1ZSAtIG5ldyB2YWx1ZVxuICogQHBhcmFtIHZhbHVlSW5kZXggLSBkYXRhSWQgaW5kZXhcbiAqIEByZXR1cm5zIGFjdGlvblxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLWFjdGlvbnMnKS5zZXRGaWx0ZXJBbmltYXRpb25UaW1lfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0RmlsdGVyQW5pbWF0aW9uVGltZShpZHgsIHByb3AsIHZhbHVlLCB2YWx1ZUluZGV4KSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuU0VUX0ZJTFRFUl9BTklNQVRJT05fVElNRSxcbiAgICBpZHgsXG4gICAgcHJvcCxcbiAgICB2YWx1ZSxcbiAgICB2YWx1ZUluZGV4XG4gIH07XG59XG5cbi8qKlxuICogU2FtZSBhcyBVcGRhdGUgZmlsdGVyXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLnNldEZpbHRlckFuaW1hdGlvbldpbmRvd31cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldEZpbHRlckFuaW1hdGlvbldpbmRvdyh7aWQsIGFuaW1hdGlvbldpbmRvd30pIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5TRVRfRklMVEVSX0FOSU1BVElPTl9XSU5ET1csXG4gICAgaWQsXG4gICAgYW5pbWF0aW9uV2luZG93XG4gIH07XG59XG4vKipcbiAqIEFkZCBhIG5ldyBmaWx0ZXJcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBkYXRhSWQgLSBkYXRhc2V0IGBpZGAgdGhpcyBuZXcgZmlsdGVyIGlzIGFzc29jaWF0ZWQgd2l0aFxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLmFkZEZpbHRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZEZpbHRlcihkYXRhSWQpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5BRERfRklMVEVSLFxuICAgIGRhdGFJZFxuICB9O1xufVxuXG4vKipcbiAqIEFkZCBhIG5ldyBsYXllclxuICogQG1lbWJlcm9mIHZpc1N0YXRlQWN0aW9uc1xuICogQHBhcmFtIGNvbmZpZyAtIG5ldyBsYXllciBjb25maWdcbiAqIEByZXR1cm5zIGFjdGlvblxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLWFjdGlvbnMnKS5hZGRMYXllcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZExheWVyKGNvbmZpZykge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLkFERF9MQVlFUixcbiAgICBjb25maWdcbiAgfTtcbn1cblxuLyoqXG4gKiBSZW9yZGVyIGxheWVyLCBvcmRlciBpcyBhbiBhcnJheSBvZiBsYXllciBpbmRleGVzLCBpbmRleCAwIHdpbGwgYmUgdGhlIG9uZSBhdCB0aGUgYm90dG9tXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gb3JkZXIgYW4gYXJyYXkgb2YgbGF5ZXIgaW5kZXhlc1xuICogQHJldHVybnMgYWN0aW9uXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLnJlb3JkZXJMYXllcn1cbiAqIEBwdWJsaWNcbiAqIEBleGFtcGxlXG4gKlxuICogLy8gYnJpbmcgYGxheWVyc1sxXWAgYmVsb3cgYGxheWVyc1swXWAsIHRoZSBzZXF1ZW5jZSBsYXllcnMgd2lsbCBiZSByZW5kZXJlZCBpcyBgMWAsIGAwYCwgYDJgLCBgM2AuXG4gKiAvLyBgMWAgd2lsbCBiZSBhdCB0aGUgYm90dG9tLCBgM2Agd2lsbCBiZSBhdCB0aGUgdG9wLlxuICogdGhpcy5wcm9wcy5kaXNwYXRjaChyZW9yZGVyTGF5ZXIoWzEsIDAsIDIsIDNdKSk7XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW9yZGVyTGF5ZXIob3JkZXIpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5SRU9SREVSX0xBWUVSLFxuICAgIG9yZGVyXG4gIH07XG59XG5cbi8qKlxuICogUmVtb3ZlIGEgZmlsdGVyIGZyb20gYHZpc1N0YXRlLmZpbHRlcnNgLCBvbmNlIGEgZmlsdGVyIGlzIHJlbW92ZWQsIGRhdGEgd2lsbCBiZSByZS1maWx0ZXJlZCBhbmQgbGF5ZXIgd2lsbCBiZSB1cGRhdGVkXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gaWR4IGlkeCBvZiBmaWx0ZXIgdG8gYmUgcmVtb3ZlZFxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLnJlbW92ZUZpbHRlcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUZpbHRlcihpZHgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5SRU1PVkVfRklMVEVSLFxuICAgIGlkeFxuICB9O1xufVxuXG4vKipcbiAqIFJlbW92ZSBhIGxheWVyXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gaWR4IGlkeCBvZiBsYXllciB0byBiZSByZW1vdmVkXG4gKiBAcmV0dXJucyBhY3Rpb25cbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1hY3Rpb25zJykucmVtb3ZlTGF5ZXJ9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVMYXllcihpZHgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5SRU1PVkVfTEFZRVIsXG4gICAgaWR4XG4gIH07XG59XG5cbi8qKlxuICogRHVwbGljYXRlIGEgbGF5ZXJcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBpZHggaWR4IG9mIGxheWVyIHRvIGJlIGR1cGxpY2F0ZWRcbiAqIEByZXR1cm5zIGFjdGlvblxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLWFjdGlvbnMnKS5kdXBsaWNhdGVMYXllcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGR1cGxpY2F0ZUxheWVyKGlkeCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLkRVUExJQ0FURV9MQVlFUixcbiAgICBpZHhcbiAgfTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYSBkYXRhc2V0IGFuZCBhbGwgbGF5ZXJzLCBmaWx0ZXJzLCB0b29sdGlwIGNvbmZpZ3MgdGhhdCBiYXNlZCBvbiBpdFxuICogQG1lbWJlcm9mIHZpc1N0YXRlQWN0aW9uc1xuICogQHBhcmFtIGRhdGFJZCBkYXRhc2V0IGlkXG4gKiBAcmV0dXJucyBhY3Rpb25cbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1hY3Rpb25zJykucmVtb3ZlRGF0YXNldH1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZURhdGFzZXQoZGF0YUlkKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuUkVNT1ZFX0RBVEFTRVQsXG4gICAgZGF0YUlkXG4gIH07XG59XG5cbi8qKlxuICogRGlzcGxheSBkYXRhc2V0IHRhYmxlIGluIGEgbW9kYWxcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBkYXRhSWQgZGF0YXNldCBpZCB0byBzaG93IGluIHRhYmxlXG4gKiBAcmV0dXJucyBhY3Rpb25cbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1hY3Rpb25zJykuc2hvd0RhdGFzZXRUYWJsZX1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNob3dEYXRhc2V0VGFibGUoZGF0YUlkKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuU0hPV19EQVRBU0VUX1RBQkxFLFxuICAgIGRhdGFJZFxuICB9O1xufVxuXG4vKipcbiAqIFNvcnQgZGF0YXNldCBjb2x1bW4sIGZvciB0YWJsZSBkaXNwbGF5XG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gZGF0YUlkXG4gKiBAcGFyYW0gY29sdW1uXG4gKiBAcGFyYW0gbW9kZVxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLnNvcnRUYWJsZUNvbHVtbn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNvcnRUYWJsZUNvbHVtbihkYXRhSWQsIGNvbHVtbiwgbW9kZSkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLlNPUlRfVEFCTEVfQ09MVU1OLFxuICAgIGRhdGFJZCxcbiAgICBjb2x1bW4sXG4gICAgbW9kZVxuICB9O1xufVxuXG4vKipcbiAqIFBpbiBkYXRhc2V0IGNvbHVtbiwgZm9yIHRhYmxlIGRpc3BsYXlcbiAqIEBwYXJhbSBkYXRhSWRcbiAqIEBwYXJhbSBjb2x1bW5cbiAqIEByZXR1cm5zIGFjdGlvblxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLWFjdGlvbnMnKS5waW5UYWJsZUNvbHVtbn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBpblRhYmxlQ29sdW1uKGRhdGFJZCwgY29sdW1uKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuUElOX1RBQkxFX0NPTFVNTixcbiAgICBkYXRhSWQsXG4gICAgY29sdW1uXG4gIH07XG59XG5cbi8qKlxuICogQ29weSBjb2x1bW4sIGZvciB0YWJsZSBkaXNwbGF5XG4gKiBAcGFyYW0gZGF0YUlkXG4gKiBAcGFyYW0gY29sdW1uXG4gKiBAcmV0dXJucyBhY3Rpb25cbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1hY3Rpb25zJykuY29weVRhYmxlQ29sdW1ufVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gY29weVRhYmxlQ29sdW1uKGRhdGFJZCwgY29sdW1uKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuQ09QWV9UQUJMRV9DT0xVTU4sXG4gICAgZGF0YUlkLFxuICAgIGNvbHVtblxuICB9O1xufVxuXG4vLyAqIEBwYXJhbSBkYXRhc2V0LmluZm8gLWluZm8gb2YgYSBkYXRhc2V0XG4vLyAqIEBwYXJhbSBkYXRhc2V0LmluZm8uaWQgLSBpZCBvZiB0aGlzIGRhdGFzZXQuIElmIGNvbmZpZyBpcyBkZWZpbmVkLCBgaWRgIHNob3VsZCBtYXRjaGVzIHRoZSBgZGF0YUlkYCBpbiBjb25maWcuXG4vLyAqIEBwYXJhbSBkYXRhc2V0LmluZm8ubGFiZWwgLSBBIGRpc3BsYXkgbmFtZSBvZiB0aGlzIGRhdGFzZXRcbi8vICogQHBhcmFtIGRhdGFzZXQuZGF0YSAtICoqKnJlcXVpcmVkKiogVGhlIGRhdGEgb2JqZWN0LCBpbiBhIHRhYnVsYXIgZm9ybWF0IHdpdGggMiBwcm9wZXJ0aWVzIGBmaWVsZHNgIGFuZCBgcm93c2Bcbi8vICogQHBhcmFtIGRhdGFzZXQuZGF0YS5maWVsZHMgLSAqKipyZXF1aXJlZCoqIEFycmF5IG9mIGZpZWxkcyxcbi8vICogQHBhcmFtIGRhdGFzZXQuZGF0YS5maWVsZHMubmFtZSAtICoqKnJlcXVpcmVkKiogTmFtZSBvZiB0aGUgZmllbGQsXG4vLyAqIEBwYXJhbSBkYXRhc2V0LmRhdGEucm93cyAtICoqKnJlcXVpcmVkKiogQXJyYXkgb2Ygcm93cywgaW4gYSB0YWJ1bGFyIGZvcm1hdCB3aXRoIGBmaWVsZHNgIGFuZCBgcm93c2Bcbi8qKlxuICogQWRkIG5ldyBkYXRhc2V0IHRvIGB2aXNTdGF0ZWAsIHdpdGggb3B0aW9uIHRvIGxvYWQgYSBtYXAgY29uZmlnIGFsb25nIHdpdGggdGhlIGRhdGFzZXRzXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gZGF0YXNldHMgLSAqKipyZXF1aXJlZCoqIGRhdGFzZXRzIGNhbiBiZSBhIGRhdGFzZXQgb3IgYW4gYXJyYXkgb2YgZGF0YXNldHNcbiAqIEVhY2ggZGF0YXNldCBvYmplY3QgbmVlZHMgdG8gaGF2ZSBgaW5mb2AgYW5kIGBkYXRhYCBwcm9wZXJ0eS5cbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0gb3B0aW9ucy5jZW50ZXJNYXAgYGRlZmF1bHQ6IHRydWVgIGlmIGBjZW50ZXJNYXBgIGlzIHNldCB0byBgdHJ1ZWAga2VwbGVyLmdsIHdpbGxcbiAqIHBsYWNlIHRoZSBtYXAgdmlldyB3aXRoaW4gdGhlIGRhdGEgcG9pbnRzIGJvdW5kYXJpZXNcbiAqIEBwYXJhbSBvcHRpb25zLnJlYWRPbmx5IGBkZWZhdWx0OiBmYWxzZWAgaWYgYHJlYWRPbmx5YCBpcyBzZXQgdG8gYHRydWVgXG4gKiB0aGUgbGVmdCBzZXR0aW5nIHBhbmVsIHdpbGwgYmUgaGlkZGVuXG4gKiBAcGFyYW0gY29uZmlnIHRoaXMgb2JqZWN0IHdpbGwgY29udGFpbiB0aGUgZnVsbCBrZXBsZXIuZ2wgaW5zdGFuY2UgY29uZmlndXJhdGlvbiB7bWFwU3RhdGUsIG1hcFN0eWxlLCB2aXNTdGF0ZX1cbiAqIEByZXR1cm5zIGFjdGlvblxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLWFjdGlvbnMnKS51cGRhdGVWaXNEYXRhfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlVmlzRGF0YShkYXRhc2V0cywgb3B0aW9ucywgY29uZmlnKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuVVBEQVRFX1ZJU19EQVRBLFxuICAgIGRhdGFzZXRzLFxuICAgIG9wdGlvbnMsXG4gICAgY29uZmlnXG4gIH07XG59XG5cbi8qKlxuICogUmVuYW1lIGFuIGV4aXN0aW5nIGRhdGFzZXQgaW4gYHZpc1N0YXRlYFxuICogQG1lbWJlcm9mIHZpc1N0YXRlQWN0aW9uc1xuICogQHBhcmFtIGRhdGFJZCAtICoqKnJlcXVpcmVkKiogSWQgb2YgdGhlIGRhdGFzZXQgdG8gdXBkYXRlXG4gKiBAcGFyYW0gbGFiZWwgLSAqKipyZXF1aXJlZCoqIE5ldyBuYW1lIGZvciB0aGUgZGF0YXNldFxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLnJlbmFtZURhdGFzZXR9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW5hbWVEYXRhc2V0KGRhdGFJZCwgbGFiZWwpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5SRU5BTUVfREFUQVNFVCxcbiAgICBkYXRhSWQsXG4gICAgbGFiZWxcbiAgfTtcbn1cblxuLyoqXG4gKiBTdGFydCBhbmQgZW5kIGZpbHRlciBhbmltYXRpb25cbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSB7TnVtYmVyfSBpZHggb2YgZmlsdGVyXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLnRvZ2dsZUZpbHRlckFuaW1hdGlvbn1cbiAqIEByZXR1cm5zIGFjdGlvblxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gdG9nZ2xlRmlsdGVyQW5pbWF0aW9uKGlkeCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLlRPR0dMRV9GSUxURVJfQU5JTUFUSU9OLFxuICAgIGlkeFxuICB9O1xufVxuXG4vKipcbiAqIENoYW5nZSBmaWx0ZXIgYW5pbWF0aW9uIHNwZWVkXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gaWR4IC0gIGBpZHhgIG9mIGZpbHRlclxuICogQHBhcmFtIHNwZWVkIC0gYHNwZWVkYCB0byBjaGFuZ2UgaXQgdG8uIGBzcGVlZGAgaXMgYSBtdWx0aXBsaWVyXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLnVwZGF0ZUZpbHRlckFuaW1hdGlvblNwZWVkfVxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVGaWx0ZXJBbmltYXRpb25TcGVlZChpZHgsIHNwZWVkKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuVVBEQVRFX0ZJTFRFUl9BTklNQVRJT05fU1BFRUQsXG4gICAgaWR4LFxuICAgIHNwZWVkXG4gIH07XG59XG5cbi8qKlxuICogUmVzZXQgYW5pbWF0aW9uXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gdmFsdWUgLSAgQ3VycmVudCB2YWx1ZSBvZiB0aGUgc2xpZGVyXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLnNldExheWVyQW5pbWF0aW9uVGltZX1cbiAqIEByZXR1cm5zIGFjdGlvblxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0TGF5ZXJBbmltYXRpb25UaW1lKHZhbHVlKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuU0VUX0xBWUVSX0FOSU1BVElPTl9USU1FLFxuICAgIHZhbHVlXG4gIH07XG59XG5cbi8qKlxuICogdXBkYXRlIHRyaXAgbGF5ZXIgYW5pbWF0aW9uIHNwZWVkXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gc3BlZWQgLSBgc3BlZWRgIHRvIGNoYW5nZSBpdCB0by4gYHNwZWVkYCBpcyBhIG11bHRpcGxpZXJcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1hY3Rpb25zJykudXBkYXRlTGF5ZXJBbmltYXRpb25TcGVlZH1cbiAqIEByZXR1cm5zIGFjdGlvblxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlTGF5ZXJBbmltYXRpb25TcGVlZChzcGVlZCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLlVQREFURV9MQVlFUl9BTklNQVRJT05fU1BFRUQsXG4gICAgc3BlZWRcbiAgfTtcbn1cblxuLyoqXG4gKiBzdGFydCBlbmQgZW5kIGxheWVyIGFuaW1hdGlvblxuICogQG1lbWJlcm9mIHZpc1N0YXRlQWN0aW9uc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLWFjdGlvbnMnKS50b2dnbGVMYXllckFuaW1hdGlvbn1cbiAqIEByZXR1cm5zIGFjdGlvblxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gdG9nZ2xlTGF5ZXJBbmltYXRpb24oKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuVE9HR0xFX0xBWUVSX0FOSU1BVElPTlxuICB9O1xufVxuXG4vKipcbiAqIGhpZGUgYW5kIHNob3cgbGF5ZXIgYW5pbWF0aW9uIGNvbnRyb2xcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1hY3Rpb25zJykudG9nZ2xlTGF5ZXJBbmltYXRpb25Db250cm9sfVxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b2dnbGVMYXllckFuaW1hdGlvbkNvbnRyb2woKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuVE9HR0xFX0xBWUVSX0FOSU1BVElPTl9DT05UUk9MXG4gIH07XG59XG5cbi8qKlxuICogU2hvdyBsYXJnZXIgdGltZSBmaWx0ZXIgYXQgYm90dG9tIGZvciB0aW1lIHBsYXliYWNrIChhcHBseSB0byB0aW1lIGZpbHRlciBvbmx5KVxuICogQG1lbWJlcm9mIHZpc1N0YXRlQWN0aW9uc1xuICogQHBhcmFtIGlkeCAtIGluZGV4IG9mIGZpbHRlciB0byBlbmxhcmdlXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLmVubGFyZ2VGaWx0ZXJ9XG4gKiBAcmV0dXJucyBhY3Rpb25cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVubGFyZ2VGaWx0ZXIoaWR4KSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuRU5MQVJHRV9GSUxURVIsXG4gICAgaWR4XG4gIH07XG59XG5cbi8qKlxuICogU2hvdy9oaWRlIGZpbHRlciBmZWF0dXJlIG9uIG1hcFxuICogQG1lbWJlcm9mIHZpc1N0YXRlQWN0aW9uc1xuICogQHBhcmFtIGlkeCAtIGluZGV4IG9mIGZpbHRlciBmZWF0dXJlIHRvIHNob3cvaGlkZVxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLWFjdGlvbnMnKS50b2dnbGVGaWx0ZXJGZWF0dXJlfVxuICogQHJldHVybiBhY3Rpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvZ2dsZUZpbHRlckZlYXR1cmUoaWR4KSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuVE9HR0xFX0ZJTFRFUl9GRUFUVVJFLFxuICAgIGlkeFxuICB9O1xufVxuXG4vKipcbiAqIFRyaWdnZXIgbGF5ZXIgaG92ZXIgZXZlbnQgd2l0aCBob3ZlcmVkIG9iamVjdFxuICogQG1lbWJlcm9mIHZpc1N0YXRlQWN0aW9uc1xuICogQHBhcmFtIGluZm8gLSBPYmplY3QgaG92ZXJlZCwgcmV0dXJuZWQgYnkgZGVjay5nbFxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLWFjdGlvbnMnKS5vbkxheWVySG92ZXJ9XG4gKiBAcmV0dXJucyBhY3Rpb25cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9uTGF5ZXJIb3ZlcihpbmZvKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuTEFZRVJfSE9WRVIsXG4gICAgaW5mb1xuICB9O1xufVxuXG4vKipcbiAqIFRyaWdnZXIgbGF5ZXIgY2xpY2sgZXZlbnQgd2l0aCBjbGlja2VkIG9iamVjdFxuICogQG1lbWJlcm9mIHZpc1N0YXRlQWN0aW9uc1xuICogQHBhcmFtIGluZm8gLSBPYmplY3QgY2xpY2tlZCwgcmV0dXJuZWQgYnkgZGVjay5nbFxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLWFjdGlvbnMnKS5vbkxheWVyQ2xpY2t9XG4gKiBAcmV0dXJucyBhY3Rpb25cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9uTGF5ZXJDbGljayhpbmZvKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuTEFZRVJfQ0xJQ0ssXG4gICAgaW5mb1xuICB9O1xufVxuXG4vKipcbiAqIFRyaWdnZXIgbWFwIGNsaWNrIGV2ZW50LCB1bnNlbGVjdCBjbGlja2VkIG9iamVjdFxuICogQG1lbWJlcm9mIHZpc1N0YXRlQWN0aW9uc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLWFjdGlvbnMnKS5vbk1hcENsaWNrfVxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvbk1hcENsaWNrKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLk1BUF9DTElDS1xuICB9O1xufVxuXG4vKipcbiAqIFRyaWdnZXIgbWFwIG1vdXNlIG1vdmVldmVudCwgcGF5bG9hZCB3b3VsZCBiZVxuICogUmVhY3QtbWFwLWdsIFBvaW50ZXJFdmVudFxuICogaHR0cHM6Ly91YmVyLmdpdGh1Yi5pby9yZWFjdC1tYXAtZ2wvIy9kb2N1bWVudGF0aW9uL2FwaS1yZWZlcmVuY2UvcG9pbnRlci1ldmVudFxuICpcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBldnQgLSBQb2ludGVyRXZlbnRcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1hY3Rpb25zJykub25Nb3VzZU1vdmV9XG4gKiBAcmV0dXJucyBhY3Rpb25cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9uTW91c2VNb3ZlKGV2dCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLk1PVVNFX01PVkUsXG4gICAgZXZ0XG4gIH07XG59XG5cbi8qKlxuICogVG9nZ2xlIHZpc2liaWxpdHkgb2YgYSBsYXllciBpbiBhIHNwbGl0IG1hcFxuICogQG1lbWJlcm9mIHZpc1N0YXRlQWN0aW9uc1xuICogQHBhcmFtIG1hcEluZGV4IC0gaW5kZXggb2YgdGhlIHNwbGl0IG1hcFxuICogQHBhcmFtIGxheWVySWQgLSBpZCBvZiB0aGUgbGF5ZXJcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1hY3Rpb25zJykudG9nZ2xlTGF5ZXJGb3JNYXB9XG4gKiBAcmV0dXJucyBhY3Rpb25cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvZ2dsZUxheWVyRm9yTWFwKG1hcEluZGV4LCBsYXllcklkKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuVE9HR0xFX0xBWUVSX0ZPUl9NQVAsXG4gICAgbWFwSW5kZXgsXG4gICAgbGF5ZXJJZFxuICB9O1xufVxuXG4vKipcbiAqIFNldCB0aGUgcHJvcGVydHkgb2YgYSBmaWx0ZXIgcGxvdFxuICogQG1lbWJlcm9mIHZpc1N0YXRlQWN0aW9uc1xuICogQHBhcmFtIGlkeFxuICogQHBhcmFtIG5ld1Byb3Aga2V5IHZhbHVlIG1hcHBpbmcgb2YgbmV3IHByb3AgYHt5QXhpczogJ2hpc3RvZ3JhbSd9YFxuICogQHBhcmFtIHZhbHVlSW5kZXggZGF0YUlkIGluZGV4XG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLnNldEZpbHRlclBsb3R9XG4gKiBAcmV0dXJucyBhY3Rpb25cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldEZpbHRlclBsb3QoaWR4LCBuZXdQcm9wLCB2YWx1ZUluZGV4KSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuU0VUX0ZJTFRFUl9QTE9ULFxuICAgIGlkeCxcbiAgICBuZXdQcm9wLFxuICAgIHZhbHVlSW5kZXhcbiAgfTtcbn1cblxuLyoqXG4gKiBTZXQgdGhlIHByb3BlcnR5IG9mIGEgZmlsdGVyIHBsb3RcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBpbmZvXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLnNldE1hcEluZm99XG4gKiBAcmV0dXJucyBhY3Rpb25cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldE1hcEluZm8oaW5mbykge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLlNFVF9NQVBfSU5GTyxcbiAgICBpbmZvXG4gIH07XG59XG5cbi8qKlxuICogVHJpZ2dlciBmaWxlIGxvYWRpbmcgZGlzcGF0Y2ggYGFkZERhdGFUb01hcGAgaWYgc3VjY2VlZCwgb3IgYGxvYWRGaWxlc0VycmAgaWYgZmFpbGVkXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gZmlsZXMgYXJyYXkgb2YgZmlsZWJsb2JcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1hY3Rpb25zJykubG9hZEZpbGVzfVxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2FkRmlsZXMoZmlsZXMsIG9uRmluaXNoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuTE9BRF9GSUxFUyxcbiAgICBmaWxlcyxcbiAgICBvbkZpbmlzaFxuICB9O1xufVxuXG4vKipcbiAqIENhbGxlZCB3aXRoIG5leHQgZmlsZSB0byBsb2FkXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLmxvYWROZXh0RmlsZX1cbiAqIEByZXR1cm5zIGFjdGlvblxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gbG9hZE5leHRGaWxlKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLkxPQURfTkVYVF9GSUxFXG4gIH07XG59XG5cbi8qKlxuICogY2FsbGVkIHdoZW4gYWxsIGZpbGVzIGFyZSBwcm9jZXNzZWQgYW5kIGxvYWRlZFxuICogQG1lbWJlcm9mIHZpc1N0YXRlQWN0aW9uc1xuICogQHBhcmFtIHJlc3VsdFxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLWFjdGlvbnMnKS5sb2FkRmlsZXNTdWNjZXNzfVxuICogQHJldHVybnMgYWN0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2FkRmlsZXNTdWNjZXNzKHJlc3VsdCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLkxPQURfRklMRVNfU1VDQ0VTUyxcbiAgICByZXN1bHRcbiAgfTtcbn1cblxuLyoqXG4gKiBjYWxsZWQgd2hlbiBzdWNjZXNzZnVsbHkgbG9hZGVkIG9uZSBmaWxlLCByZWFkeSB0byBtb3ZlIG9uIHRvIHRoZSBuZXh0IG9uZVxuICogQG1lbWJlcm9mIHZpc1N0YXRlQWN0aW9uc1xuICogQHBhcmFtIHJlc3VsdFxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLWFjdGlvbnMnKS5sb2FkRmlsZVN0ZXBTdWNjZXNzfVxuICogQHJldHVybnMgYWN0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2FkRmlsZVN0ZXBTdWNjZXNzKHtmaWxlTmFtZSwgZmlsZUNhY2hlfSkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLkxPQURfRklMRV9TVEVQX1NVQ0NFU1MsXG4gICAgZmlsZU5hbWUsXG4gICAgZmlsZUNhY2hlXG4gIH07XG59XG5cbi8qKlxuICogVHJpZ2dlciBsb2FkaW5nIGZpbGUgZXJyb3JcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSAgZXJyb3JcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1hY3Rpb25zJykubG9hZEZpbGVzRXJyfVxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2FkRmlsZXNFcnIoZmlsZU5hbWUsIGVycm9yKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuTE9BRF9GSUxFU19FUlIsXG4gICAgZmlsZU5hbWUsXG4gICAgZXJyb3JcbiAgfTtcbn1cblxuLyoqXG4gKiBTdG9yZSBmZWF0dXJlcyB0byBzdGF0ZVxuICogQG1lbWJlcm9mIHZpc1N0YXRlQWN0aW9uc1xuICogQHBhcmFtIGZlYXR1cmVzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLnNldEZlYXR1cmVzfVxuICogQHJldHVybnMgYWN0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRGZWF0dXJlcyhmZWF0dXJlcykge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLlNFVF9GRUFUVVJFUyxcbiAgICBmZWF0dXJlc1xuICB9O1xufVxuXG4vKipcbiAqIEl0IHdpbGwgYXBwbHkgdGhlIHByb3ZpZGUgZmVhdHVyZSBhcyBmaWx0ZXIgdG8gdGhlIGdpdmVuIGxheWVyLlxuICogSWYgdGhlIGdpdmVuIGZlYXR1cmUgaXMgYWxyZWFkeSBhcHBsaWVkIGFzIGZpbHRlciB0byB0aGUgbGF5ZXIsIGl0IHdpbGwgcmVtb3ZlIHRoZSBsYXllciBmcm9tIHRoZSBmaWx0ZXJcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBsYXllclxuICogQHBhcmFtIGZlYXR1cmVcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1hY3Rpb25zJykuc2V0UG9seWdvbkZpbHRlckxheWVyfVxuICogQHJldHVybnMgYWN0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRQb2x5Z29uRmlsdGVyTGF5ZXIobGF5ZXIsIGZlYXR1cmUpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5TRVRfUE9MWUdPTl9GSUxURVJfTEFZRVIsXG4gICAgbGF5ZXIsXG4gICAgZmVhdHVyZVxuICB9O1xufVxuXG4vKipcbiAqIFNldCB0aGUgY3VycmVudCBmZWF0dXJlIHRvIGJlIGVkaXRlZC9kZWxldGVkXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gZmVhdHVyZVxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLWFjdGlvbnMnKS5zZXRTZWxlY3RlZEZlYXR1cmV9XG4gKiBAcmV0dXJucyBhY3Rpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldFNlbGVjdGVkRmVhdHVyZShmZWF0dXJlKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuU0VUX1NFTEVDVEVEX0ZFQVRVUkUsXG4gICAgZmVhdHVyZVxuICB9O1xufVxuXG4vKipcbiAqIERlbGV0ZSB0aGUgZ2l2ZW4gZmVhdHVyZVxuICogQG1lbWJlcm9mIHZpc1N0YXRlQWN0aW9uc1xuICogQHBhcmFtIGZlYXR1cmVcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1hY3Rpb25zJykuZGVsZXRlRmVhdHVyZX1cbiAqIEByZXR1cm5zIGFjdGlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlRmVhdHVyZShmZWF0dXJlKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuREVMRVRFX0ZFQVRVUkUsXG4gICAgZmVhdHVyZVxuICB9O1xufVxuXG4vKiogU2V0IHRoZSBtYXAgbW9kZVxuICogQG1lbWJlcm9mIHZpc1N0YXRlQWN0aW9uc1xuICogQHBhcmFtIG1vZGUgb25lIG9mIEVESVRPUl9NT0RFU1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLWFjdGlvbnMnKS5zZXRFZGl0b3JNb2RlfVxuICogQHJldHVybnMgYWN0aW9uXG4gKiBAcHVibGljXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHtzZXRNYXBNb2RlfSBmcm9tICdrZXBsZXIuZ2wvYWN0aW9ucyc7XG4gKiBpbXBvcnQge0VESVRPUl9NT0RFU30gZnJvbSAna2VwbGVyLmdsL2NvbnN0YW50cyc7XG4gKlxuICogdGhpcy5wcm9wcy5kaXNwYXRjaChzZXRNYXBNb2RlKEVESVRPUl9NT0RFUy5EUkFXX1BPTFlHT04pKTtcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldEVkaXRvck1vZGUobW9kZSkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLlNFVF9FRElUT1JfTU9ERSxcbiAgICBtb2RlXG4gIH07XG59XG5cbi8qKlxuICogVHJpZ2dlciBDUFUgZmlsdGVyIG9mIHNlbGVjdGVkIGRhdGFzZXRcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBkYXRhSWQgLSBzaW5nbGUgZGF0YUlkIG9yIGFuIGFycmF5IG9mIGRhdGFJZHNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1hY3Rpb25zJykuYXBwbHlDUFVGaWx0ZXJ9XG4gKiBAcmV0dXJucyBhY3Rpb25cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5Q1BVRmlsdGVyKGRhdGFJZCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLkFQUExZX0NQVV9GSUxURVIsXG4gICAgZGF0YUlkXG4gIH07XG59XG5cbi8qKlxuICogVG9nZ2xlIGVkaXRvciBsYXllciB2aXNpYmlsaXR5XG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi92aXMtc3RhdGUtYWN0aW9ucycpLnRvZ2dsZUVkaXRvclZpc2liaWxpdHl9XG4gKiBAcmV0dXJuIGFjdGlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9nZ2xlRWRpdG9yVmlzaWJpbGl0eSgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5UT0dHTEVfRURJVE9SX1ZJU0lCSUxJVFlcbiAgfTtcbn1cblxuLyoqXG4gKiBQcm9jZXNzIHRoZSBuZXh0IGZpbGUgYmF0Y2hcbiAqIEBtZW1iZXJvZiB2aXNTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBwYXlsb2FkIC0gYmF0Y2ggcGF5bG9hZFxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLWFjdGlvbnMnKS5uZXh0RmlsZUJhdGNofVxuICogQHJldHVybiBhY3Rpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5leHRGaWxlQmF0Y2gocGF5bG9hZCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLk5FWFRfRklMRV9CQVRDSCxcbiAgICBwYXlsb2FkXG4gIH07XG59XG5cbi8qKlxuICogUHJvY2VzcyB0aGUgZmlsZSBjb250ZW50XG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gcGF5bG9hZCAtIHRoZSBmaWxlIGNvbnRlbnRcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1hY3Rpb25zJykucHJvY2Vzc0ZpbGVDb250ZW50fVxuICogQHJldHVybiBhY3Rpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NGaWxlQ29udGVudChwYXlsb2FkKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuUFJPQ0VTU19GSUxFX0NPTlRFTlQsXG4gICAgcGF5bG9hZFxuICB9O1xufVxuXG4vKipcbiAqIFNldCBsYXllciBhbmltYXRpb24gdGltZSBmb3JtYXQgYW5kIHRpbWV6b25lXG4gKiBAbWVtYmVyb2YgdmlzU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gY29uZmlnIC0ge3RpbWVGb3JtYXQ6IHN0cmluZywgdGltZXpvbmU6IHN0cmluZ31cbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3Zpcy1zdGF0ZS1hY3Rpb25zJykuc2V0TGF5ZXJBbmltYXRpb25UaW1lQ29uZmlnfVxuICogQHJldHVybiBhY3Rpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldExheWVyQW5pbWF0aW9uVGltZUNvbmZpZyhjb25maWcpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5TRVRfTEFZRVJfQU5JTUFUSU9OX1RJTUVfQ09ORklHLFxuICAgIGNvbmZpZ1xuICB9O1xufVxuXG4vKipcbiAqIFNldCBGaWx0ZXIgYW5pbWF0aW9uIHRpbWUgZm9ybWF0IGFuZCB0aW1lem9uZVxuICogQG1lbWJlcm9mIHZpc1N0YXRlQWN0aW9uc1xuICogQHBhcmFtIGlkeFxuICogQHBhcmFtIGNvbmZpZ1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdmlzLXN0YXRlLWFjdGlvbnMnKS5zZXRGaWx0ZXJBbmltYXRpb25UaW1lQ29uZmlnfVxuICogQHJldHVybiBhY3Rpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldEZpbHRlckFuaW1hdGlvblRpbWVDb25maWcoaWR4LCBjb25maWcpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5TRVRfRklMVEVSX0FOSU1BVElPTl9USU1FX0NPTkZJRyxcbiAgICBpZHgsXG4gICAgY29uZmlnXG4gIH07XG59XG5cbi8qKlxuICogVGhpcyBkZWNsYXJhdGlvbiBpcyBuZWVkZWQgdG8gZ3JvdXAgYWN0aW9ucyBpbiBkb2NzXG4gKi9cbi8qKlxuICogQWN0aW9ucyBoYW5kbGVkIG1vc3RseSBieSBgdmlzU3RhdGVgIHJlZHVjZXIuXG4gKiBUaGV5IG1hbmFnZSBob3cgZGF0YSBpcyBwcm9jZXNzZWQsIGZpbHRlcmVkIGFuZCBkaXNwbGF5ZWQgb24gdGhlIG1hcCBieSBvcGVyYXRlcyBvbiBsYXllcnMsXG4gKiBmaWx0ZXJzIGFuZCBpbnRlcmFjdGlvbiBzZXR0aW5ncy5cbiAqXG4gKiBAcHVibGljXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4vLyBAdHMtaWdub3JlXG5jb25zdCB2aXNTdGF0ZUFjdGlvbnMgPSBudWxsO1xuLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xuIl19