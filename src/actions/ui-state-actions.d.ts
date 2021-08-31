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

import ActionTypes from 'constants/action-types';
import {Merge} from '../reducers/types';
import {ExportImage} from '../reducers/ui-state-updaters';

/** TOGGLE_SIDE_PANEL */
export type ToggleSidePanelUpdaterAction = {
  payload: string;
};
export function toggleSidePanel(
  id: string
): Merge<ToggleSidePanelUpdaterAction, {type: ActionTypes.TOGGLE_SIDE_PANEL}>;

/** TOGGLE_MODAL */
export type ToggleModalUpdaterAction = {
  payload: string | null;
};
export function toggleModal(
  id: string | null
): Merge<ToggleModalUpdaterAction, {type: ActionTypes.TOGGLE_MODAL}>;

/** SHOW_EXPORT_DROPDOWN */
export type ShowExportDropdownUpdaterAction = {
  payload: string;
};
export function showExportDropdown(
  id: string
): Merge<ShowExportDropdownUpdaterAction, {type: ActionTypes.SHOW_EXPORT_DROPDOWN}>;

/** HIDE_EXPORT_DROPDOWN */
export function hideExportDropdown(): {type: ActionTypes.HIDE_EXPORT_DROPDOWN};

/** TOGGLE_MAP_CONTROL */
export type ToggleMapControlUpdaterAction = {
  payload: {
    panelId: string;
    index: number;
  };
};
export function toggleMapControl(
  panelId: string,
  index: number
): Merge<ToggleMapControlUpdaterAction, {type: ActionTypes.TOGGLE_MAP_CONTROL}>;


/** SET_MAP_CONTROL_VISIBILITY */
export type setMapControlVisibilityUpdaterAction = {
  payload: {
    panelId: string;
    show: boolean;
  };
};
export function setMapControlVisibility(
  panelId: string,
  show: boolean
): Merge<setMapControlVisibilityUpdaterAction, {type: ActionTypes.SET_MAP_CONTROL_VISIBILITY}>;

/** OPEN_DELETE_MODAL */
export type OpenDeleteModalUpdaterAction = {
  payload: string;
};
export function openDeleteModal(
  datasetId: string
): Merge<OpenDeleteModalUpdaterAction, {type: ActionTypes.OPEN_DELETE_MODAL}>;

/** ADD_NOTIFICATION */
export type AddNotificationUpdaterAction = {
  payload: object;
};
export function addNotification(
  notification: object
): Merge<
  AddNotificationUpdaterAction,
  {
    type: ActionTypes.ADD_NOTIFICATION;
  }
>;

/** REMOVE_NOTIFICATION */
export type RemoveNotificationUpdaterAction = {
  payload: string;
};
export function removeNotification(
  id: string
): Merge<RemoveNotificationUpdaterAction, {type: ActionTypes.REMOVE_NOTIFICATION}>;

/** SET_EXPORT_IMAGE_SETTING */
export type SetExportImageSettingUpdaterAction = {
  payload: Partial<ExportImage>;
};
export function setExportImageSetting(
  newSetting: SetExportImageSettingUpdaterAction['payload']
): Merge<SetExportImageSettingUpdaterAction, {type: ActionTypes.SET_EXPORT_IMAGE_SETTING}>;

/** START_EXPORTING_IMAGE */
export function startExportingImage(options?: {
  ratio?: string;
  resolution?: string;
  legend?: string;
  center?: boolean;
}): Merge<SetExportImageSettingUpdaterAction, {type: ActionTypes.START_EXPORT_IMAGE}>;

/** SET_EXPORT_IMAGE_DATA_URI */
export type SetExportImageDataUriUpdaterAction = {
  payload: string;
};
export function setExportImageDataUri(): Merge<
  SetExportImageDataUriUpdaterAction,
  {type: ActionTypes.SET_EXPORT_IMAGE_DATA_URI}
>;

/** SET_EXPORT_IMAGE_ERROR */
export type SetExportImageErrorUpdaterAction = {
  payload: Error;
};
export function setExportImageError(
  error: Error
): Merge<SetExportImageErrorUpdaterAction, {type: ActionTypes.SET_EXPORT_IMAGE_ERROR}>;

/** CLEANUP_EXPORT_IMAGE */
export function cleanupExportImage(): {type: ActionTypes.CLEANUP_EXPORT_IMAGE};

/** SET_EXPORT_SELECTED_DATASET */
export type SetExportSelectedDatasetUpdaterAction = {
  payload: string;
};
export function setExportSelectedDataset(
  datasetId: string
): Merge<SetExportSelectedDatasetUpdaterAction, {type: ActionTypes.SET_EXPORT_SELECTED_DATASET}>;

/** SET_EXPORT_DATA_TYPE */
export type SetExportDataTypeUpdaterAction = {
  payload: string;
};
export function setExportDataType(
  dataType: string
): Merge<SetExportDataTypeUpdaterAction, {type: ActionTypes.SET_EXPORT_DATA_TYPE}>;

/** SET_EXPORT_FILTERED */
export type SetExportFilteredUpdaterAction = {
  payload: boolean;
};
export function setExportFiltered(
  exportFiltered: boolean
): Merge<SetExportFilteredUpdaterAction, {type: ActionTypes.SET_EXPORT_FILTERED}>;

/** SET_EXPORT_DATA */
export function setExportData(): {type: ActionTypes.SET_EXPORT_DATA};

/** SET_USER_MAPBOX_ACCESS_TOKEN */
export type SetUserMapboxAccessTokenUpdaterAction = {
  payload: string;
};
export function setUserMapboxAccessToken(): Merge<
  SetUserMapboxAccessTokenUpdaterAction,
  {type: ActionTypes.SET_USER_MAPBOX_ACCESS_TOKEN}
>;

/** SET_EXPORT_MAP_FORMAT */
export type SetExportMapFormatUpdaterAction = {
  payload: string;
};
export function setExportMapFormat(
  mapFormat: string
): Merge<SetExportMapFormatUpdaterAction, {type: ActionTypes.SET_EXPORT_MAP_FORMAT}>;

/** SET_EXPORT_MAP_HTML_MODE */
export type SetExportHTMLMapModeUpdaterAction = {
  payload: string;
};
export function setExportHTMLMapMode(
  mode: string
): Merge<SetExportHTMLMapModeUpdaterAction, {type: ActionTypes.SET_EXPORT_MAP_HTML_MODE}>;

/** SET_LOCALE */
export type SetLocaleUpdaterAction = {
  payload: {locale: string};
};
export function setLocale(
  locale: string
): Merge<SetLocaleUpdaterAction, {type: ActionTypes.SET_LOCALE}>;
