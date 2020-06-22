"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setLocale = exports.setExportHTMLMapMode = exports.setExportMapFormat = exports.setUserMapboxAccessToken = exports.setExportData = exports.setExportFiltered = exports.setExportDataType = exports.setExportSelectedDataset = exports.cleanupExportImage = exports.setExportImageError = exports.setExportImageDataUri = exports.startExportingImage = exports.setExportImageSetting = exports.removeNotification = exports.addNotification = exports.openDeleteModal = exports.toggleMapControl = exports.hideExportDropdown = exports.showExportDropdown = exports.toggleModal = exports.toggleSidePanel = void 0;

var _reduxActions = require("redux-actions");

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

/**
 * Toggle active side panel
 * @memberof uiStateActions
 * @param id  id of side panel to be shown, one of `layer`, `filter`, `interaction`, `map`
 * @type {typeof import('./ui-state-actions').toggleSidePanel}
 * @public
 */
var toggleSidePanel = (0, _reduxActions.createAction)(_actionTypes["default"].TOGGLE_SIDE_PANEL, function (id) {
  return id;
});
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

exports.toggleSidePanel = toggleSidePanel;
var toggleModal = (0, _reduxActions.createAction)(_actionTypes["default"].TOGGLE_MODAL, function (id) {
  return id;
});
/**
 * Hide and show side panel header dropdown, activated by clicking the share link on top of the side panel
 * @memberof uiStateActions
 * @param id - id of the dropdown
 * @type {typeof import('./ui-state-actions').showExportDropdown}
 * @public
 */

exports.toggleModal = toggleModal;
var showExportDropdown = (0, _reduxActions.createAction)(_actionTypes["default"].SHOW_EXPORT_DROPDOWN, function (id) {
  return id;
});
/**
 * Hide side panel header dropdown, activated by clicking the share link on top of the side panel
 * @memberof uiStateActions
 * @type {typeof import('./ui-state-actions').hideExportDropdown}
 * @public
 */

exports.showExportDropdown = showExportDropdown;
var hideExportDropdown = (0, _reduxActions.createAction)(_actionTypes["default"].HIDE_EXPORT_DROPDOWN);
/**
 * Toggle active map control panel
 * @memberof uiStateActions
 * @param panelId - map control panel id, one of the keys of: [`DEFAULT_MAP_CONTROLS`](#default_map_controls)
 * @type {typeof import('./ui-state-actions').toggleMapControl}
 * @public
 */

exports.hideExportDropdown = hideExportDropdown;
var toggleMapControl = (0, _reduxActions.createAction)(_actionTypes["default"].TOGGLE_MAP_CONTROL, function (panelId, index) {
  return {
    panelId: panelId,
    index: index
  };
});
/**
 * Toggle active map control panel
 * @memberof uiStateActions
 * @param datasetId - `id` of the dataset to be deleted
 * @type {typeof import('./ui-state-actions').openDeleteModal}
 * @public
 */

exports.toggleMapControl = toggleMapControl;
var openDeleteModal = (0, _reduxActions.createAction)(_actionTypes["default"].OPEN_DELETE_MODAL, function (datasetId) {
  return datasetId;
});
/**
 * Add a notification to be displayed
 * @memberof uiStateActions
 * @param notification - The `notification` object to be added
 * @type {typeof import('./ui-state-actions').addNotification}
 * @public
 */

exports.openDeleteModal = openDeleteModal;
var addNotification = (0, _reduxActions.createAction)(_actionTypes["default"].ADD_NOTIFICATION, function (notification) {
  return notification;
});
/**
 * Remove a notification
 * @memberof uiStateActions
 * @param id - `id` of the notification to be removed
 * @type {typeof import('./ui-state-actions').removeNotification}
 * @public
 */

exports.addNotification = addNotification;
var removeNotification = (0, _reduxActions.createAction)(_actionTypes["default"].REMOVE_NOTIFICATION, function (id) {
  return id;
});
/**
 * Set `exportImage` settings: ratio, resolution, legend
 * @memberof uiStateActions
 * @param newSetting - {ratio: '1x'}
 * @type {typeof import('./ui-state-actions').setExportImageSetting}
 * @public
 */

exports.removeNotification = removeNotification;
var setExportImageSetting = (0, _reduxActions.createAction)(_actionTypes["default"].SET_EXPORT_IMAGE_SETTING, function (newSetting) {
  return newSetting;
});
/**
 * Set `exportImage.exporting` to true
 * @memberof uiStateActions
 * @type {typeof import('./ui-state-actions').startExportingImage}
 * @public
 */

exports.setExportImageSetting = setExportImageSetting;
var startExportingImage = (0, _reduxActions.createAction)(_actionTypes["default"].START_EXPORTING_IMAGE);
/**
 * Set `exportImage.setExportImageDataUri` to a dataUri
 * @memberof uiStateActions
 * @param dataUri - export image data uri
 * @type {typeof import('./ui-state-actions').setExportImageDataUri}
 * @public
 */

exports.startExportingImage = startExportingImage;
var setExportImageDataUri = (0, _reduxActions.createAction)(_actionTypes["default"].SET_EXPORT_IMAGE_DATA_URI, function (dataUri) {
  return dataUri;
});
/**
 * Set Export image error
 * @memberof uiStateActions
 * @type {typeof import('./ui-state-actions').setExportImageError}
 * @public
 */

exports.setExportImageDataUri = setExportImageDataUri;
var setExportImageError = (0, _reduxActions.createAction)(_actionTypes["default"].SET_EXPORT_IMAGE_ERROR, function (error) {
  return error;
});
/**
 * Delete cached export image
 * @memberof uiStateActions
 * @type {typeof import('./ui-state-actions').cleanupExportImage}
 * @public
 */

exports.setExportImageError = setExportImageError;
var cleanupExportImage = (0, _reduxActions.createAction)(_actionTypes["default"].CLEANUP_EXPORT_IMAGE);
/**
 * Set selected dataset for export
 * @memberof uiStateActions
 * @param datasetId - dataset id
 * @type {typeof import('./ui-state-actions').setExportSelectedDataset}
 * @public
 */

exports.cleanupExportImage = cleanupExportImage;
var setExportSelectedDataset = (0, _reduxActions.createAction)(_actionTypes["default"].SET_EXPORT_SELECTED_DATASET, function (datasetId) {
  return datasetId;
});
/**
 * Set data format for exporting data
 * @memberof uiStateActions
 * @param dataType - one of `'text/csv'`
 * @type {typeof import('./ui-state-actions').setExportDataType}
 * @public
 */

exports.setExportSelectedDataset = setExportSelectedDataset;
var setExportDataType = (0, _reduxActions.createAction)(_actionTypes["default"].SET_EXPORT_DATA_TYPE, function (dataType) {
  return dataType;
});
/**
 * Whether to export filtered data, `true` or `false`
 * @memberof uiStateActions
 * @param payload - set `true` to ony export filtered data
 * @type {typeof import('./ui-state-actions').setExportFiltered}
 * @public
 */

exports.setExportDataType = setExportDataType;
var setExportFiltered = (0, _reduxActions.createAction)(_actionTypes["default"].SET_EXPORT_FILTERED, function (payload) {
  return payload;
});
/**
 * Whether to including data in map config, toggle between `true` or `false`
 * @memberof uiStateActions
 * @type {typeof import('./ui-state-actions').setExportData}
 * @public
 */

exports.setExportFiltered = setExportFiltered;
var setExportData = (0, _reduxActions.createAction)(_actionTypes["default"].SET_EXPORT_DATA);
/**
 * Whether we export a mapbox access token used to create a single map html file
 * @memberof uiStateActions
 * @param payload - mapbox access token
 * @type {typeof import('./ui-state-actions').setUserMapboxAccessToken}
 * @public
 */

exports.setExportData = setExportData;
var setUserMapboxAccessToken = (0, _reduxActions.createAction)(_actionTypes["default"].SET_USER_MAPBOX_ACCESS_TOKEN, function (payload) {
  return payload;
});
/**
 * Set the export map format (html, json)
 * @memberOf uiStateActions
 * @param payload - map format
 * @type {typeof import('./ui-state-actions').setExportMapFormat}
 * @public
 */

exports.setUserMapboxAccessToken = setUserMapboxAccessToken;
var setExportMapFormat = (0, _reduxActions.createAction)(_actionTypes["default"].SET_EXPORT_MAP_FORMAT, function (payload) {
  return payload;
});
/**
 * Set the HTML mode to use to export HTML mode
 * @memberOf uiStateActions
 * @param payload - map mode
 * @type {typeof import('./ui-state-actions').setExportHTMLMapMode}
 */

exports.setExportMapFormat = setExportMapFormat;
var setExportHTMLMapMode = (0, _reduxActions.createAction)(_actionTypes["default"].SET_EXPORT_MAP_HTML_MODE, function (payload) {
  return payload;
});
/**
 * Set `locale` value
 * @memberof uiStateActions
 * @param locale - locale of the UI
 * @type {typeof import('./ui-state-actions').setLocale}
 * @public
 */

exports.setExportHTMLMapMode = setExportHTMLMapMode;
var setLocale = (0, _reduxActions.createAction)(_actionTypes["default"].SET_LOCALE, function (locale) {
  return {
    locale: locale
  };
});
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

exports.setLocale = setLocale;
var uiStateActions = null;
/* eslint-enable no-unused-vars */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL3VpLXN0YXRlLWFjdGlvbnMuanMiXSwibmFtZXMiOlsidG9nZ2xlU2lkZVBhbmVsIiwiQWN0aW9uVHlwZXMiLCJUT0dHTEVfU0lERV9QQU5FTCIsImlkIiwidG9nZ2xlTW9kYWwiLCJUT0dHTEVfTU9EQUwiLCJzaG93RXhwb3J0RHJvcGRvd24iLCJTSE9XX0VYUE9SVF9EUk9QRE9XTiIsImhpZGVFeHBvcnREcm9wZG93biIsIkhJREVfRVhQT1JUX0RST1BET1dOIiwidG9nZ2xlTWFwQ29udHJvbCIsIlRPR0dMRV9NQVBfQ09OVFJPTCIsInBhbmVsSWQiLCJpbmRleCIsIm9wZW5EZWxldGVNb2RhbCIsIk9QRU5fREVMRVRFX01PREFMIiwiZGF0YXNldElkIiwiYWRkTm90aWZpY2F0aW9uIiwiQUREX05PVElGSUNBVElPTiIsIm5vdGlmaWNhdGlvbiIsInJlbW92ZU5vdGlmaWNhdGlvbiIsIlJFTU9WRV9OT1RJRklDQVRJT04iLCJzZXRFeHBvcnRJbWFnZVNldHRpbmciLCJTRVRfRVhQT1JUX0lNQUdFX1NFVFRJTkciLCJuZXdTZXR0aW5nIiwic3RhcnRFeHBvcnRpbmdJbWFnZSIsIlNUQVJUX0VYUE9SVElOR19JTUFHRSIsInNldEV4cG9ydEltYWdlRGF0YVVyaSIsIlNFVF9FWFBPUlRfSU1BR0VfREFUQV9VUkkiLCJkYXRhVXJpIiwic2V0RXhwb3J0SW1hZ2VFcnJvciIsIlNFVF9FWFBPUlRfSU1BR0VfRVJST1IiLCJlcnJvciIsImNsZWFudXBFeHBvcnRJbWFnZSIsIkNMRUFOVVBfRVhQT1JUX0lNQUdFIiwic2V0RXhwb3J0U2VsZWN0ZWREYXRhc2V0IiwiU0VUX0VYUE9SVF9TRUxFQ1RFRF9EQVRBU0VUIiwic2V0RXhwb3J0RGF0YVR5cGUiLCJTRVRfRVhQT1JUX0RBVEFfVFlQRSIsImRhdGFUeXBlIiwic2V0RXhwb3J0RmlsdGVyZWQiLCJTRVRfRVhQT1JUX0ZJTFRFUkVEIiwicGF5bG9hZCIsInNldEV4cG9ydERhdGEiLCJTRVRfRVhQT1JUX0RBVEEiLCJzZXRVc2VyTWFwYm94QWNjZXNzVG9rZW4iLCJTRVRfVVNFUl9NQVBCT1hfQUNDRVNTX1RPS0VOIiwic2V0RXhwb3J0TWFwRm9ybWF0IiwiU0VUX0VYUE9SVF9NQVBfRk9STUFUIiwic2V0RXhwb3J0SFRNTE1hcE1vZGUiLCJTRVRfRVhQT1JUX01BUF9IVE1MX01PREUiLCJzZXRMb2NhbGUiLCJTRVRfTE9DQUxFIiwibG9jYWxlIiwidWlTdGF0ZUFjdGlvbnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBS0E7Ozs7Ozs7QUFPTyxJQUFNQSxlQUFlLEdBQUcsZ0NBQWFDLHdCQUFZQyxpQkFBekIsRUFBNEMsVUFBQUMsRUFBRTtBQUFBLFNBQUlBLEVBQUo7QUFBQSxDQUE5QyxDQUF4QjtBQUVQOzs7Ozs7Ozs7Ozs7Ozs7QUFhTyxJQUFNQyxXQUFXLEdBQUcsZ0NBQWFILHdCQUFZSSxZQUF6QixFQUF1QyxVQUFBRixFQUFFO0FBQUEsU0FBSUEsRUFBSjtBQUFBLENBQXpDLENBQXBCO0FBRVA7Ozs7Ozs7OztBQU9PLElBQU1HLGtCQUFrQixHQUFHLGdDQUFhTCx3QkFBWU0sb0JBQXpCLEVBQStDLFVBQUFKLEVBQUU7QUFBQSxTQUFJQSxFQUFKO0FBQUEsQ0FBakQsQ0FBM0I7QUFFUDs7Ozs7Ozs7QUFNTyxJQUFNSyxrQkFBa0IsR0FBRyxnQ0FBYVAsd0JBQVlRLG9CQUF6QixDQUEzQjtBQUVQOzs7Ozs7Ozs7QUFPTyxJQUFNQyxnQkFBZ0IsR0FBRyxnQ0FBYVQsd0JBQVlVLGtCQUF6QixFQUE2QyxVQUFDQyxPQUFELEVBQVVDLEtBQVY7QUFBQSxTQUFxQjtBQUNoR0QsSUFBQUEsT0FBTyxFQUFQQSxPQURnRztBQUVoR0MsSUFBQUEsS0FBSyxFQUFMQTtBQUZnRyxHQUFyQjtBQUFBLENBQTdDLENBQXpCO0FBS1A7Ozs7Ozs7OztBQU9PLElBQU1DLGVBQWUsR0FBRyxnQ0FBYWIsd0JBQVljLGlCQUF6QixFQUE0QyxVQUFBQyxTQUFTO0FBQUEsU0FBSUEsU0FBSjtBQUFBLENBQXJELENBQXhCO0FBRVA7Ozs7Ozs7OztBQU9PLElBQU1DLGVBQWUsR0FBRyxnQ0FDN0JoQix3QkFBWWlCLGdCQURpQixFQUU3QixVQUFBQyxZQUFZO0FBQUEsU0FBSUEsWUFBSjtBQUFBLENBRmlCLENBQXhCO0FBS1A7Ozs7Ozs7OztBQU9PLElBQU1DLGtCQUFrQixHQUFHLGdDQUFhbkIsd0JBQVlvQixtQkFBekIsRUFBOEMsVUFBQWxCLEVBQUU7QUFBQSxTQUFJQSxFQUFKO0FBQUEsQ0FBaEQsQ0FBM0I7QUFFUDs7Ozs7Ozs7O0FBT08sSUFBTW1CLHFCQUFxQixHQUFHLGdDQUNuQ3JCLHdCQUFZc0Isd0JBRHVCLEVBRW5DLFVBQUFDLFVBQVU7QUFBQSxTQUFJQSxVQUFKO0FBQUEsQ0FGeUIsQ0FBOUI7QUFLUDs7Ozs7Ozs7QUFNTyxJQUFNQyxtQkFBbUIsR0FBRyxnQ0FBYXhCLHdCQUFZeUIscUJBQXpCLENBQTVCO0FBRVA7Ozs7Ozs7OztBQU9PLElBQU1DLHFCQUFxQixHQUFHLGdDQUNuQzFCLHdCQUFZMkIseUJBRHVCLEVBRW5DLFVBQUFDLE9BQU87QUFBQSxTQUFJQSxPQUFKO0FBQUEsQ0FGNEIsQ0FBOUI7QUFLUDs7Ozs7Ozs7QUFNTyxJQUFNQyxtQkFBbUIsR0FBRyxnQ0FBYTdCLHdCQUFZOEIsc0JBQXpCLEVBQWlELFVBQUFDLEtBQUs7QUFBQSxTQUFJQSxLQUFKO0FBQUEsQ0FBdEQsQ0FBNUI7QUFFUDs7Ozs7Ozs7QUFNTyxJQUFNQyxrQkFBa0IsR0FBRyxnQ0FBYWhDLHdCQUFZaUMsb0JBQXpCLENBQTNCO0FBRVA7Ozs7Ozs7OztBQU9PLElBQU1DLHdCQUF3QixHQUFHLGdDQUN0Q2xDLHdCQUFZbUMsMkJBRDBCLEVBRXRDLFVBQUFwQixTQUFTO0FBQUEsU0FBSUEsU0FBSjtBQUFBLENBRjZCLENBQWpDO0FBS1A7Ozs7Ozs7OztBQU9PLElBQU1xQixpQkFBaUIsR0FBRyxnQ0FDL0JwQyx3QkFBWXFDLG9CQURtQixFQUUvQixVQUFBQyxRQUFRO0FBQUEsU0FBSUEsUUFBSjtBQUFBLENBRnVCLENBQTFCO0FBS1A7Ozs7Ozs7OztBQU9PLElBQU1DLGlCQUFpQixHQUFHLGdDQUFhdkMsd0JBQVl3QyxtQkFBekIsRUFBOEMsVUFBQUMsT0FBTztBQUFBLFNBQUlBLE9BQUo7QUFBQSxDQUFyRCxDQUExQjtBQUVQOzs7Ozs7OztBQU1PLElBQU1DLGFBQWEsR0FBRyxnQ0FBYTFDLHdCQUFZMkMsZUFBekIsQ0FBdEI7QUFFUDs7Ozs7Ozs7O0FBT08sSUFBTUMsd0JBQXdCLEdBQUcsZ0NBQ3RDNUMsd0JBQVk2Qyw0QkFEMEIsRUFFdEMsVUFBQUosT0FBTztBQUFBLFNBQUlBLE9BQUo7QUFBQSxDQUYrQixDQUFqQztBQUtQOzs7Ozs7Ozs7QUFPTyxJQUFNSyxrQkFBa0IsR0FBRyxnQ0FDaEM5Qyx3QkFBWStDLHFCQURvQixFQUVoQyxVQUFBTixPQUFPO0FBQUEsU0FBSUEsT0FBSjtBQUFBLENBRnlCLENBQTNCO0FBS1A7Ozs7Ozs7O0FBTU8sSUFBTU8sb0JBQW9CLEdBQUcsZ0NBQ2xDaEQsd0JBQVlpRCx3QkFEc0IsRUFFbEMsVUFBQVIsT0FBTztBQUFBLFNBQUlBLE9BQUo7QUFBQSxDQUYyQixDQUE3QjtBQUtQOzs7Ozs7Ozs7QUFPTyxJQUFNUyxTQUFTLEdBQUcsZ0NBQWFsRCx3QkFBWW1ELFVBQXpCLEVBQXFDLFVBQUFDLE1BQU07QUFBQSxTQUFLO0FBQ3ZFQSxJQUFBQSxNQUFNLEVBQU5BO0FBRHVFLEdBQUw7QUFBQSxDQUEzQyxDQUFsQjtBQUlQOzs7O0FBR0E7Ozs7Ozs7OztBQVFBO0FBQ0E7OztBQUNBLElBQU1DLGNBQWMsR0FBRyxJQUF2QjtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtjcmVhdGVBY3Rpb259IGZyb20gJ3JlZHV4LWFjdGlvbnMnO1xuaW1wb3J0IEFjdGlvblR5cGVzIGZyb20gJ2NvbnN0YW50cy9hY3Rpb24tdHlwZXMnO1xuXG4vKipcbiAqIFRvZ2dsZSBhY3RpdmUgc2lkZSBwYW5lbFxuICogQG1lbWJlcm9mIHVpU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gaWQgIGlkIG9mIHNpZGUgcGFuZWwgdG8gYmUgc2hvd24sIG9uZSBvZiBgbGF5ZXJgLCBgZmlsdGVyYCwgYGludGVyYWN0aW9uYCwgYG1hcGBcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3VpLXN0YXRlLWFjdGlvbnMnKS50b2dnbGVTaWRlUGFuZWx9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCB0b2dnbGVTaWRlUGFuZWwgPSBjcmVhdGVBY3Rpb24oQWN0aW9uVHlwZXMuVE9HR0xFX1NJREVfUEFORUwsIGlkID0+IGlkKTtcblxuLyoqXG4gKiBTaG93IGFuZCBoaWRlIG1vZGFsIGRpYWxvZ1xuICogQG1lbWJlcm9mIHVpU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gaWQgLSBpZCBvZiBtb2RhbCB0byBiZSBzaG93biwgbnVsbCB0byBoaWRlIG1vZGFscy4gT25lIG9mOlxuICogIC0gW2BEQVRBX1RBQkxFX0lEYF0oLi4vY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MubWQjZGF0YV90YWJsZV9pZClcbiAqICAtIFtgREVMRVRFX0RBVEFfSURgXSguLi9jb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncy5tZCNkZWxldGVfZGF0YV9pZClcbiAqICAtIFtgQUREX0RBVEFfSURgXSguLi9jb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncy5tZCNhZGRfZGF0YV9pZClcbiAqICAtIFtgRVhQT1JUX0lNQUdFX0lEYF0oLi4vY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MubWQjZXhwb3J0X2ltYWdlX2lkKVxuICogIC0gW2BFWFBPUlRfREFUQV9JRGBdKC4uL2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzLm1kI2V4cG9ydF9kYXRhX2lkKVxuICogIC0gW2BBRERfTUFQX1NUWUxFX0lEYF0oLi4vY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MubWQjYWRkX21hcF9zdHlsZV9pZClcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3VpLXN0YXRlLWFjdGlvbnMnKS50b2dnbGVNb2RhbH1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHRvZ2dsZU1vZGFsID0gY3JlYXRlQWN0aW9uKEFjdGlvblR5cGVzLlRPR0dMRV9NT0RBTCwgaWQgPT4gaWQpO1xuXG4vKipcbiAqIEhpZGUgYW5kIHNob3cgc2lkZSBwYW5lbCBoZWFkZXIgZHJvcGRvd24sIGFjdGl2YXRlZCBieSBjbGlja2luZyB0aGUgc2hhcmUgbGluayBvbiB0b3Agb2YgdGhlIHNpZGUgcGFuZWxcbiAqIEBtZW1iZXJvZiB1aVN0YXRlQWN0aW9uc1xuICogQHBhcmFtIGlkIC0gaWQgb2YgdGhlIGRyb3Bkb3duXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi91aS1zdGF0ZS1hY3Rpb25zJykuc2hvd0V4cG9ydERyb3Bkb3dufVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3Qgc2hvd0V4cG9ydERyb3Bkb3duID0gY3JlYXRlQWN0aW9uKEFjdGlvblR5cGVzLlNIT1dfRVhQT1JUX0RST1BET1dOLCBpZCA9PiBpZCk7XG5cbi8qKlxuICogSGlkZSBzaWRlIHBhbmVsIGhlYWRlciBkcm9wZG93biwgYWN0aXZhdGVkIGJ5IGNsaWNraW5nIHRoZSBzaGFyZSBsaW5rIG9uIHRvcCBvZiB0aGUgc2lkZSBwYW5lbFxuICogQG1lbWJlcm9mIHVpU3RhdGVBY3Rpb25zXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi91aS1zdGF0ZS1hY3Rpb25zJykuaGlkZUV4cG9ydERyb3Bkb3dufVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgaGlkZUV4cG9ydERyb3Bkb3duID0gY3JlYXRlQWN0aW9uKEFjdGlvblR5cGVzLkhJREVfRVhQT1JUX0RST1BET1dOKTtcblxuLyoqXG4gKiBUb2dnbGUgYWN0aXZlIG1hcCBjb250cm9sIHBhbmVsXG4gKiBAbWVtYmVyb2YgdWlTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBwYW5lbElkIC0gbWFwIGNvbnRyb2wgcGFuZWwgaWQsIG9uZSBvZiB0aGUga2V5cyBvZjogW2BERUZBVUxUX01BUF9DT05UUk9MU2BdKCNkZWZhdWx0X21hcF9jb250cm9scylcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3VpLXN0YXRlLWFjdGlvbnMnKS50b2dnbGVNYXBDb250cm9sfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgdG9nZ2xlTWFwQ29udHJvbCA9IGNyZWF0ZUFjdGlvbihBY3Rpb25UeXBlcy5UT0dHTEVfTUFQX0NPTlRST0wsIChwYW5lbElkLCBpbmRleCkgPT4gKHtcbiAgcGFuZWxJZCxcbiAgaW5kZXhcbn0pKTtcblxuLyoqXG4gKiBUb2dnbGUgYWN0aXZlIG1hcCBjb250cm9sIHBhbmVsXG4gKiBAbWVtYmVyb2YgdWlTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBkYXRhc2V0SWQgLSBgaWRgIG9mIHRoZSBkYXRhc2V0IHRvIGJlIGRlbGV0ZWRcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3VpLXN0YXRlLWFjdGlvbnMnKS5vcGVuRGVsZXRlTW9kYWx9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBvcGVuRGVsZXRlTW9kYWwgPSBjcmVhdGVBY3Rpb24oQWN0aW9uVHlwZXMuT1BFTl9ERUxFVEVfTU9EQUwsIGRhdGFzZXRJZCA9PiBkYXRhc2V0SWQpO1xuXG4vKipcbiAqIEFkZCBhIG5vdGlmaWNhdGlvbiB0byBiZSBkaXNwbGF5ZWRcbiAqIEBtZW1iZXJvZiB1aVN0YXRlQWN0aW9uc1xuICogQHBhcmFtIG5vdGlmaWNhdGlvbiAtIFRoZSBgbm90aWZpY2F0aW9uYCBvYmplY3QgdG8gYmUgYWRkZWRcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3VpLXN0YXRlLWFjdGlvbnMnKS5hZGROb3RpZmljYXRpb259XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBhZGROb3RpZmljYXRpb24gPSBjcmVhdGVBY3Rpb24oXG4gIEFjdGlvblR5cGVzLkFERF9OT1RJRklDQVRJT04sXG4gIG5vdGlmaWNhdGlvbiA9PiBub3RpZmljYXRpb25cbik7XG5cbi8qKlxuICogUmVtb3ZlIGEgbm90aWZpY2F0aW9uXG4gKiBAbWVtYmVyb2YgdWlTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBpZCAtIGBpZGAgb2YgdGhlIG5vdGlmaWNhdGlvbiB0byBiZSByZW1vdmVkXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi91aS1zdGF0ZS1hY3Rpb25zJykucmVtb3ZlTm90aWZpY2F0aW9ufVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgcmVtb3ZlTm90aWZpY2F0aW9uID0gY3JlYXRlQWN0aW9uKEFjdGlvblR5cGVzLlJFTU9WRV9OT1RJRklDQVRJT04sIGlkID0+IGlkKTtcblxuLyoqXG4gKiBTZXQgYGV4cG9ydEltYWdlYCBzZXR0aW5nczogcmF0aW8sIHJlc29sdXRpb24sIGxlZ2VuZFxuICogQG1lbWJlcm9mIHVpU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gbmV3U2V0dGluZyAtIHtyYXRpbzogJzF4J31cbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3VpLXN0YXRlLWFjdGlvbnMnKS5zZXRFeHBvcnRJbWFnZVNldHRpbmd9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBzZXRFeHBvcnRJbWFnZVNldHRpbmcgPSBjcmVhdGVBY3Rpb24oXG4gIEFjdGlvblR5cGVzLlNFVF9FWFBPUlRfSU1BR0VfU0VUVElORyxcbiAgbmV3U2V0dGluZyA9PiBuZXdTZXR0aW5nXG4pO1xuXG4vKipcbiAqIFNldCBgZXhwb3J0SW1hZ2UuZXhwb3J0aW5nYCB0byB0cnVlXG4gKiBAbWVtYmVyb2YgdWlTdGF0ZUFjdGlvbnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3VpLXN0YXRlLWFjdGlvbnMnKS5zdGFydEV4cG9ydGluZ0ltYWdlfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3Qgc3RhcnRFeHBvcnRpbmdJbWFnZSA9IGNyZWF0ZUFjdGlvbihBY3Rpb25UeXBlcy5TVEFSVF9FWFBPUlRJTkdfSU1BR0UpO1xuXG4vKipcbiAqIFNldCBgZXhwb3J0SW1hZ2Uuc2V0RXhwb3J0SW1hZ2VEYXRhVXJpYCB0byBhIGRhdGFVcmlcbiAqIEBtZW1iZXJvZiB1aVN0YXRlQWN0aW9uc1xuICogQHBhcmFtIGRhdGFVcmkgLSBleHBvcnQgaW1hZ2UgZGF0YSB1cmlcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3VpLXN0YXRlLWFjdGlvbnMnKS5zZXRFeHBvcnRJbWFnZURhdGFVcml9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBzZXRFeHBvcnRJbWFnZURhdGFVcmkgPSBjcmVhdGVBY3Rpb24oXG4gIEFjdGlvblR5cGVzLlNFVF9FWFBPUlRfSU1BR0VfREFUQV9VUkksXG4gIGRhdGFVcmkgPT4gZGF0YVVyaVxuKTtcblxuLyoqXG4gKiBTZXQgRXhwb3J0IGltYWdlIGVycm9yXG4gKiBAbWVtYmVyb2YgdWlTdGF0ZUFjdGlvbnNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3VpLXN0YXRlLWFjdGlvbnMnKS5zZXRFeHBvcnRJbWFnZUVycm9yfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3Qgc2V0RXhwb3J0SW1hZ2VFcnJvciA9IGNyZWF0ZUFjdGlvbihBY3Rpb25UeXBlcy5TRVRfRVhQT1JUX0lNQUdFX0VSUk9SLCBlcnJvciA9PiBlcnJvcik7XG5cbi8qKlxuICogRGVsZXRlIGNhY2hlZCBleHBvcnQgaW1hZ2VcbiAqIEBtZW1iZXJvZiB1aVN0YXRlQWN0aW9uc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdWktc3RhdGUtYWN0aW9ucycpLmNsZWFudXBFeHBvcnRJbWFnZX1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IGNsZWFudXBFeHBvcnRJbWFnZSA9IGNyZWF0ZUFjdGlvbihBY3Rpb25UeXBlcy5DTEVBTlVQX0VYUE9SVF9JTUFHRSk7XG5cbi8qKlxuICogU2V0IHNlbGVjdGVkIGRhdGFzZXQgZm9yIGV4cG9ydFxuICogQG1lbWJlcm9mIHVpU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gZGF0YXNldElkIC0gZGF0YXNldCBpZFxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdWktc3RhdGUtYWN0aW9ucycpLnNldEV4cG9ydFNlbGVjdGVkRGF0YXNldH1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHNldEV4cG9ydFNlbGVjdGVkRGF0YXNldCA9IGNyZWF0ZUFjdGlvbihcbiAgQWN0aW9uVHlwZXMuU0VUX0VYUE9SVF9TRUxFQ1RFRF9EQVRBU0VULFxuICBkYXRhc2V0SWQgPT4gZGF0YXNldElkXG4pO1xuXG4vKipcbiAqIFNldCBkYXRhIGZvcm1hdCBmb3IgZXhwb3J0aW5nIGRhdGFcbiAqIEBtZW1iZXJvZiB1aVN0YXRlQWN0aW9uc1xuICogQHBhcmFtIGRhdGFUeXBlIC0gb25lIG9mIGAndGV4dC9jc3YnYFxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdWktc3RhdGUtYWN0aW9ucycpLnNldEV4cG9ydERhdGFUeXBlfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3Qgc2V0RXhwb3J0RGF0YVR5cGUgPSBjcmVhdGVBY3Rpb24oXG4gIEFjdGlvblR5cGVzLlNFVF9FWFBPUlRfREFUQV9UWVBFLFxuICBkYXRhVHlwZSA9PiBkYXRhVHlwZVxuKTtcblxuLyoqXG4gKiBXaGV0aGVyIHRvIGV4cG9ydCBmaWx0ZXJlZCBkYXRhLCBgdHJ1ZWAgb3IgYGZhbHNlYFxuICogQG1lbWJlcm9mIHVpU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gcGF5bG9hZCAtIHNldCBgdHJ1ZWAgdG8gb255IGV4cG9ydCBmaWx0ZXJlZCBkYXRhXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi91aS1zdGF0ZS1hY3Rpb25zJykuc2V0RXhwb3J0RmlsdGVyZWR9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBzZXRFeHBvcnRGaWx0ZXJlZCA9IGNyZWF0ZUFjdGlvbihBY3Rpb25UeXBlcy5TRVRfRVhQT1JUX0ZJTFRFUkVELCBwYXlsb2FkID0+IHBheWxvYWQpO1xuXG4vKipcbiAqIFdoZXRoZXIgdG8gaW5jbHVkaW5nIGRhdGEgaW4gbWFwIGNvbmZpZywgdG9nZ2xlIGJldHdlZW4gYHRydWVgIG9yIGBmYWxzZWBcbiAqIEBtZW1iZXJvZiB1aVN0YXRlQWN0aW9uc1xuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vdWktc3RhdGUtYWN0aW9ucycpLnNldEV4cG9ydERhdGF9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBzZXRFeHBvcnREYXRhID0gY3JlYXRlQWN0aW9uKEFjdGlvblR5cGVzLlNFVF9FWFBPUlRfREFUQSk7XG5cbi8qKlxuICogV2hldGhlciB3ZSBleHBvcnQgYSBtYXBib3ggYWNjZXNzIHRva2VuIHVzZWQgdG8gY3JlYXRlIGEgc2luZ2xlIG1hcCBodG1sIGZpbGVcbiAqIEBtZW1iZXJvZiB1aVN0YXRlQWN0aW9uc1xuICogQHBhcmFtIHBheWxvYWQgLSBtYXBib3ggYWNjZXNzIHRva2VuXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi91aS1zdGF0ZS1hY3Rpb25zJykuc2V0VXNlck1hcGJveEFjY2Vzc1Rva2VufVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3Qgc2V0VXNlck1hcGJveEFjY2Vzc1Rva2VuID0gY3JlYXRlQWN0aW9uKFxuICBBY3Rpb25UeXBlcy5TRVRfVVNFUl9NQVBCT1hfQUNDRVNTX1RPS0VOLFxuICBwYXlsb2FkID0+IHBheWxvYWRcbik7XG5cbi8qKlxuICogU2V0IHRoZSBleHBvcnQgbWFwIGZvcm1hdCAoaHRtbCwganNvbilcbiAqIEBtZW1iZXJPZiB1aVN0YXRlQWN0aW9uc1xuICogQHBhcmFtIHBheWxvYWQgLSBtYXAgZm9ybWF0XG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi91aS1zdGF0ZS1hY3Rpb25zJykuc2V0RXhwb3J0TWFwRm9ybWF0fVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3Qgc2V0RXhwb3J0TWFwRm9ybWF0ID0gY3JlYXRlQWN0aW9uKFxuICBBY3Rpb25UeXBlcy5TRVRfRVhQT1JUX01BUF9GT1JNQVQsXG4gIHBheWxvYWQgPT4gcGF5bG9hZFxuKTtcblxuLyoqXG4gKiBTZXQgdGhlIEhUTUwgbW9kZSB0byB1c2UgdG8gZXhwb3J0IEhUTUwgbW9kZVxuICogQG1lbWJlck9mIHVpU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0gcGF5bG9hZCAtIG1hcCBtb2RlXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi91aS1zdGF0ZS1hY3Rpb25zJykuc2V0RXhwb3J0SFRNTE1hcE1vZGV9XG4gKi9cbmV4cG9ydCBjb25zdCBzZXRFeHBvcnRIVE1MTWFwTW9kZSA9IGNyZWF0ZUFjdGlvbihcbiAgQWN0aW9uVHlwZXMuU0VUX0VYUE9SVF9NQVBfSFRNTF9NT0RFLFxuICBwYXlsb2FkID0+IHBheWxvYWRcbik7XG5cbi8qKlxuICogU2V0IGBsb2NhbGVgIHZhbHVlXG4gKiBAbWVtYmVyb2YgdWlTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSBsb2NhbGUgLSBsb2NhbGUgb2YgdGhlIFVJXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi91aS1zdGF0ZS1hY3Rpb25zJykuc2V0TG9jYWxlfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3Qgc2V0TG9jYWxlID0gY3JlYXRlQWN0aW9uKEFjdGlvblR5cGVzLlNFVF9MT0NBTEUsIGxvY2FsZSA9PiAoe1xuICBsb2NhbGVcbn0pKTtcblxuLyoqXG4gKiBUaGlzIGRlY2xhcmF0aW9uIGlzIG5lZWRlZCB0byBncm91cCBhY3Rpb25zIGluIGRvY3NcbiAqL1xuLyoqXG4gKiBBY3Rpb25zIGhhbmRsZWQgbW9zdGx5IGJ5ICBgdWlTdGF0ZWAgcmVkdWNlci5cbiAqIFRoZXkgbWFuYWdlIFVJIGNoYW5nZXMgaW4gdGhhIGFwcCwgc3VjaCBhcyBvcGVuIGFuZCBjbG9zZSBzaWRlIHBhbmVsLFxuICogc3dpdGNoIGJldHdlZW4gdGFicyBpbiB0aGUgc2lkZSBwYW5lbCwgb3BlbiBhbmQgY2xvc2UgbW9kYWwgZGlhbG9nIGZvciBleHBvcnRpbmcgZGF0YSAvIGltYWdlcyBldGMuXG4gKiBJdCBhbHNvIG1hbmdlcyB3aGljaCBzZXR0aW5ncyBhcmUgc2VsZWN0ZWQgZHVyaW5nIGltYWdlIGFuZCBtYXAgZXhwb3J0XG4gKlxuICogQHB1YmxpY1xuICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuLy8gQHRzLWlnbm9yZVxuY29uc3QgdWlTdGF0ZUFjdGlvbnMgPSBudWxsO1xuLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xuIl19