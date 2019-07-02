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

import {createAction} from 'redux-actions';
import ActionTypes from 'constants/action-types';

/**
 * Toggle active side panel
 * @memberof uiStateActions
 * @param {string} id  id of side panel to be shown, one of `layer`, `filter`, `interaction`, `map`
 * @public
 */
export const toggleSidePanel = createAction(
  ActionTypes.TOGGLE_SIDE_PANEL,
  id => id
);

/**
 * Show and hide modal dialog
 * @memberof uiStateActions
 * @param {string|null} id - id of modal to be shown, null to hide modals. One of:
 *
 *  - [`DATA_TABLE_ID`](../constants/default-settings.md#data_table_id)
 *  - [`DELETE_DATA_ID`](../constants/default-settings.md#delete_data_id)
 *  - [`ADD_DATA_ID`](../constants/default-settings.md#add_data_id)
 *  - [`EXPORT_IMAGE_ID`](../constants/default-settings.md#export_image_id)
 *  - [`EXPORT_DATA_ID`](../constants/default-settings.md#export_data_id)
 *  - [`ADD_MAP_STYLE_ID`](../constants/default-settings.md#add_map_style_id)
 * @public
 */
export const toggleModal = createAction(
  ActionTypes.TOGGLE_MODAL,
  id => id
);

/**
 * Hide and show side panel header dropdown, activated by clicking the share link on top of the side panel
 * @memberof uiStateActions
 * @param {string} id - id of the dropdown
 * @public
 */
export const showExportDropdown = createAction(
  ActionTypes.SHOW_EXPORT_DROPDOWN,
  id => id
);

/**
 * Hide side panel header dropdown, activated by clicking the share link on top of the side panel
 * @memberof uiStateActions
 * @public
 */
export const hideExportDropdown = createAction(
  ActionTypes.HIDE_EXPORT_DROPDOWN
);

/**
 * Toggle active map control panel
 * @memberof uiStateActions
 * @param {string} panelId - map control panel id, one of the keys of: [`DEFAULT_MAP_CONTROLS`](#default_map_controls)
 * @public
 */
export const toggleMapControl = createAction(
  ActionTypes.TOGGLE_MAP_CONTROL,
  panelId => panelId
);

/**
 * Toggle active map control panel
 * @memberof uiStateActions
 * @param {string} datasetId - `id` of the dataset to be deleted
 * @public
 */
export const openDeleteModal = createAction(
  ActionTypes.OPEN_DELETE_MODAL,
  datasetId => datasetId
);

/**
 * Add a notification to be displayed
 * @memberof uiStateActions
 * @param {Object} notification - The `notification` object to be added
 * @public
 */
export const addNotification = createAction(
  ActionTypes.ADD_NOTIFICATION,
  notification => notification
);

/**
 * Remove a notification
 * @memberof uiStateActions
 * @param {string} id - `id` of the notification to be removed
 * @public
 */
export const removeNotification = createAction(
  ActionTypes.REMOVE_NOTIFICATION,
  id => id
);

/**
 * Set `exportImage.ratio`
 * @memberof uiStateActions
 * @param {string} ratio - one of `'SCREEN'`, `'FOUR_BY_THREE'` and `'SIXTEEN_BY_NINE'`
 * @public
 */
export const setRatio = createAction(
  ActionTypes.SET_RATIO,
  ratio => ratio
);

/**
 * Set `exportImage.resolution`
 * @memberof uiStateActions
 * @param {string} resolution - one of `'ONE_X'`, `'TWO_X'`
 * @public
 */
export const setResolution = createAction(
  ActionTypes.SET_RESOLUTION,
  resolution => resolution
);

/**
 * Set `exportImage.legend` to true or false
 * @memberof uiStateActions
 * @public
 */
export const toggleLegend = createAction(
  ActionTypes.TOGGLE_LEGEND
);

/**
 * Set `exportImage.exporting` to true
 * @memberof uiStateActions
 * @public
 */
export const startExportingImage = createAction(
  ActionTypes.START_EXPORTING_IMAGE
);

/**
 * Set `exportImage.setExportImageDataUri` to a dataUri
 * @memberof uiStateActions
 * @param {string} dataUri - export image data uri
 * @public
 */
export const setExportImageDataUri = createAction(
  ActionTypes.SET_EXPORT_IMAGE_DATA_URI,
  dataUri => dataUri
);

export const setExportImageError = createAction(
  ActionTypes.SET_EXPORT_IMAGE_ERROR,
  error => error
);

/**
 * Delete cached export image
 * @memberof uiStateActions
 * @public
 */
export const cleanupExportImage = createAction(
  ActionTypes.CLEANUP_EXPORT_IMAGE
);

/**
 * Set selected dataset for export
 * @memberof uiStateActions
 * @param {string} datasetId - dataset id
 * @public
 */
export const setExportSelectedDataset = createAction(
  ActionTypes.SET_EXPORT_SELECTED_DATASET,
  datasetId => datasetId
);

/**
 * Set data format for exporting data
 * @memberof uiStateActions
 * @param {string} dataType - one of `'text/csv'`
 * @public
 */
export const setExportDataType = createAction(
  ActionTypes.SET_EXPORT_DATA_TYPE,
  dataType => dataType
);

/**
 * Whether to export filtered data, `true` or `false`
 * @memberof uiStateActions
 * @param {boolean} payload - set `true` to ony export filtered data
 * @public
 */
export const setExportFiltered = createAction(
  ActionTypes.SET_EXPORT_FILTERED,
  payload => payload
);

/**
 * Whether to including data in map config, toggle between `true` or `false`
 * @memberof uiStateActions
 * @public
 */
export const setExportData = createAction(
  ActionTypes.SET_EXPORT_DATA
);

/**
 * Whether we export a mapbox access token used to create a single map html file
 * @memberof uiStateActions
 * @param {string} payload - mapbox access token
 * @public
 */
export const setUserMapboxAccessToken = createAction(
  ActionTypes.SET_USER_MAPBOX_ACCESS_TOKEN,
  payload => payload
);

/**
 * Set the expor tmap format (html, json)
 * @memberOf uiStateActions
 * @param {string} payload - map format
 * @public
 */
export const setExportMapFormat = createAction(
  ActionTypes.SET_EXPORT_MAP_FORMAT,
  payload => payload
);

/**
 * Set the map mode
 * @memberof main
 * @param {string} mode one of EDITOR_MODES
 * @public
 * @example
 * import {setMapMode} from 'kepler.gl/actions';
 * import {EDITOR_MODES} from 'kepler.gl/constants';
 *
 * this.props.dispatch(setMapMode(EDITOR_MODES.DRAW_POLYGON));
 */
export const setEditorMode = createAction(
  ActionTypes.SET_EDITOR_MODE,
  mode => mode
);

export const setSelectedFeature = createAction(
  ActionTypes.SET_SELECTED_FEATURE,
  selectedFeature => selectedFeature
);

export const deleteFeature = createAction(
  ActionTypes.DELETE_FEATURE,
  featureId => featureId
);

/**
 * This declaration is needed to group actions in docs
 */
/**
 * Actions handled mostly by  `uiState` reducer.
 * They manage UI changes in tha app, such as open and close side panel,
 * switch between tabs in the side panel, open and close modal dialog for exporting data / images etc.
 * It also manges which settings are selected during image and map export
 *
 * @public
 */
/* eslint-disable no-unused-vars */
const uiStateActions = null;
/* eslint-enable no-unused-vars */
