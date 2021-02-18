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

import {createAction} from 'redux-actions';
import ActionTypes from 'constants/action-types';

/**
 * Toggle active side panel
 * @memberof uiStateActions
 * @param id  id of side panel to be shown, one of `layer`, `filter`, `interaction`, `map`
 * @type {typeof import('./ui-state-actions').toggleSidePanel}
 * @public
 */
export const toggleSidePanel = createAction(ActionTypes.TOGGLE_SIDE_PANEL, id => id);

/**
 * Show and hide modal dialog
 * @memberof uiStateActions
 * @param id - id of modal to be shown, null to hide modals. One of:
 *  - [`DATA_TABLE_ID`](../constants/default-settings.md#data_table_id)
 *  - [`DELETE_DATA_ID`](../constants/default-settings.md#delete_data_id)
 *  - [`ADD_DATA_ID`](../constants/default-settings.md#add_data_id)
 *  - [`EXPORT_IMAGE_ID`](../constants/default-settings.md#export_image_id)
 *  - [`EXPORT_DATA_ID`](../constants/default-settings.md#export_data_id)
 *  - [`ADD_MAP_STYLE_ID`](../constants/default-settings.md#add_map_style_id)
 * @type {typeof import('./ui-state-actions').toggleModal}
 * @public
 */
export const toggleModal = createAction(ActionTypes.TOGGLE_MODAL, id => id);

/**
 * Hide and show side panel header dropdown, activated by clicking the share link on top of the side panel
 * @memberof uiStateActions
 * @param id - id of the dropdown
 * @type {typeof import('./ui-state-actions').showExportDropdown}
 * @public
 */
export const showExportDropdown = createAction(ActionTypes.SHOW_EXPORT_DROPDOWN, id => id);

/**
 * Hide side panel header dropdown, activated by clicking the share link on top of the side panel
 * @memberof uiStateActions
 * @type {typeof import('./ui-state-actions').hideExportDropdown}
 * @public
 */
export const hideExportDropdown = createAction(ActionTypes.HIDE_EXPORT_DROPDOWN);

/**
 * Toggle active map control panel
 * @memberof uiStateActions
 * @param panelId - map control panel id, one of the keys of: [`DEFAULT_MAP_CONTROLS`](#default_map_controls)
 * @type {typeof import('./ui-state-actions').toggleMapControl}
 * @public
 */
export const toggleMapControl = createAction(ActionTypes.TOGGLE_MAP_CONTROL, (panelId, index) => ({
  panelId,
  index
}));

/**
 * Toggle active map control panel
 * @memberof uiStateActions
 * @param panelId - map control panel id, one of the keys of: [`DEFAULT_MAP_CONTROLS`](#default_map_controls)
 * @type {typeof import('./ui-state-actions').setMapControlVisibility}
 * @public
 */
export const setMapControlVisibility = createAction(
  ActionTypes.SET_MAP_CONTROL_VISIBILITY,
  (panelId, show) => ({
    panelId,
    show
  })
);

/**
 * Toggle active map control panel
 * @memberof uiStateActions
 * @param datasetId - `id` of the dataset to be deleted
 * @type {typeof import('./ui-state-actions').openDeleteModal}
 * @public
 */
export const openDeleteModal = createAction(ActionTypes.OPEN_DELETE_MODAL, datasetId => datasetId);

/**
 * Add a notification to be displayed.
 * Existing notification will be updated in case of matching id.
 * @memberof uiStateActions
 * @param notification - The `notification` object to be added or updated
 * @type {typeof import('./ui-state-actions').addNotification}
 * @public
 */
export const addNotification = createAction(
  ActionTypes.ADD_NOTIFICATION,
  notification => notification
);

/**
 * Remove a notification
 * @memberof uiStateActions
 * @param id - `id` of the notification to be removed
 * @type {typeof import('./ui-state-actions').removeNotification}
 * @public
 */
export const removeNotification = createAction(ActionTypes.REMOVE_NOTIFICATION, id => id);

/**
 * Set `exportImage` settings: ratio, resolution, legend
 * @memberof uiStateActions
 * @param newSetting - {ratio: '1x'}
 * @type {typeof import('./ui-state-actions').setExportImageSetting}
 * @public
 */
export const setExportImageSetting = createAction(
  ActionTypes.SET_EXPORT_IMAGE_SETTING,
  newSetting => newSetting
);

/**
 * Start exporting image flow
 * @memberof uiStateActions
 * @type {typeof import('./ui-state-actions').startExportingImage}
 * @public
 */
export const startExportingImage = createAction(ActionTypes.START_EXPORTING_IMAGE);

/**
 * Set `exportImage.setExportImageDataUri` to a dataUri
 * @memberof uiStateActions
 * @param dataUri - export image data uri
 * @type {typeof import('./ui-state-actions').setExportImageDataUri}
 * @public
 */
export const setExportImageDataUri = createAction(
  ActionTypes.SET_EXPORT_IMAGE_DATA_URI,
  dataUri => dataUri
);

/**
 * Set Export image error
 * @memberof uiStateActions
 * @type {typeof import('./ui-state-actions').setExportImageError}
 * @public
 */
export const setExportImageError = createAction(ActionTypes.SET_EXPORT_IMAGE_ERROR, error => error);

/**
 * Delete cached export image
 * @memberof uiStateActions
 * @type {typeof import('./ui-state-actions').cleanupExportImage}
 * @public
 */
export const cleanupExportImage = createAction(ActionTypes.CLEANUP_EXPORT_IMAGE);

/**
 * Set selected dataset for export
 * @memberof uiStateActions
 * @param datasetId - dataset id
 * @type {typeof import('./ui-state-actions').setExportSelectedDataset}
 * @public
 */
export const setExportSelectedDataset = createAction(
  ActionTypes.SET_EXPORT_SELECTED_DATASET,
  datasetId => datasetId
);

/**
 * Set data format for exporting data
 * @memberof uiStateActions
 * @param dataType - one of `'text/csv'`
 * @type {typeof import('./ui-state-actions').setExportDataType}
 * @public
 */
export const setExportDataType = createAction(
  ActionTypes.SET_EXPORT_DATA_TYPE,
  dataType => dataType
);

/**
 * Whether to export filtered data, `true` or `false`
 * @memberof uiStateActions
 * @param payload - set `true` to ony export filtered data
 * @type {typeof import('./ui-state-actions').setExportFiltered}
 * @public
 */
export const setExportFiltered = createAction(ActionTypes.SET_EXPORT_FILTERED, payload => payload);

/**
 * Whether to including data in map config, toggle between `true` or `false`
 * @memberof uiStateActions
 * @type {typeof import('./ui-state-actions').setExportData}
 * @public
 */
export const setExportData = createAction(ActionTypes.SET_EXPORT_DATA);

/**
 * Whether we export a mapbox access token used to create a single map html file
 * @memberof uiStateActions
 * @param payload - mapbox access token
 * @type {typeof import('./ui-state-actions').setUserMapboxAccessToken}
 * @public
 */
export const setUserMapboxAccessToken = createAction(
  ActionTypes.SET_USER_MAPBOX_ACCESS_TOKEN,
  payload => payload
);

/**
 * Set the export map format (html, json)
 * @memberOf uiStateActions
 * @param payload - map format
 * @type {typeof import('./ui-state-actions').setExportMapFormat}
 * @public
 */
export const setExportMapFormat = createAction(
  ActionTypes.SET_EXPORT_MAP_FORMAT,
  payload => payload
);

/**
 * Set the HTML mode to use to export HTML mode
 * @memberOf uiStateActions
 * @param payload - map mode
 * @type {typeof import('./ui-state-actions').setExportHTMLMapMode}
 */
export const setExportHTMLMapMode = createAction(
  ActionTypes.SET_EXPORT_MAP_HTML_MODE,
  payload => payload
);

/**
 * Set `locale` value
 * @memberof uiStateActions
 * @param locale - locale of the UI
 * @type {typeof import('./ui-state-actions').setLocale}
 * @public
 */
export const setLocale = createAction(ActionTypes.SET_LOCALE, locale => ({
  locale
}));

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
// @ts-ignore
const uiStateActions = null;
/* eslint-enable no-unused-vars */
