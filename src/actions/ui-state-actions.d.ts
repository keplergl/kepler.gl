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

export function toggleSidePanel(id: string): {type: ActionTypes.TOGGLE_SIDE_PANEL, payload: string;};

export function toggleModal(id: string | null): {type: ActionTypes.TOGGLE_MODAL, payload: string | null;};

export function showExportDropdown(id: string): {type: ActionTypes.SHOW_EXPORT_DROPDOWN; payload: string;};

export function hideExportDropdown(): {type: ActionTypes.HIDE_EXPORT_DROPDOWN};

export function toggleMapControl(panelId, index): {type: ActionTypes.TOGGLE_MAP_CONTROL; payload: {
  panelId: string;
  index: number;
}};

export function openDeleteModal(datasetId: string): {type: ActionTypes.OPEN_DELETE_MODAL; payload: string};

export function addNotification(notification: object): {
  type: ActionTypes.ADD_NOTIFICATION;
  payload: object;
};

export function removeNotification(id: string): {type: ActionTypes.REMOVE_NOTIFICATION; payload: string;};

export function setExportImageSetting(newSetting: {ratio?: string; resolution?: string; legend?: string}): {
  type: ActionTypes.SET_EXPORT_IMAGE_SETTING;
  payload: object;
};

export function startExportingImage(): {type: ActionTypes.START_EXPORTING_IMAGE};

export function setExportImageDataUri(): {
  type: ActionTypes.SET_EXPORT_IMAGE_DATA_URI;
  payload: string;
};

export function setExportImageError(error: Error): {type: ActionTypes.SET_EXPORT_IMAGE_ERROR; payload: Error;};

export function cleanupExportImage(): {type: ActionTypes.CLEANUP_EXPORT_IMAGE};

export function setExportSelectedDataset(datasetId: string): {
  type: ActionTypes.SET_EXPORT_SELECTED_DATASET;
  payload: string;
};

export function setExportDataType(dataType: string): {
  type: ActionTypes.SET_EXPORT_DATA_TYPE;
  payload: string
};

export function setExportFiltered(exportFiltered: boolean): {
  type: ActionTypes.SET_EXPORT_FILTERED;
  payload: boolean;
};

export function setExportData(): {type: ActionTypes.SET_EXPORT_DATA};

export function setUserMapboxAccessToken(): {
  type: ActionTypes.SET_USER_MAPBOX_ACCESS_TOKEN;
  payload: string;
};

export function setExportMapFormat(mapFormat: string): {
  type: ActionTypes.SET_EXPORT_MAP_FORMAT;
  payload: string
};

export function setExportHTMLMapMode(mode: string): {
  type: ActionTypes.SET_EXPORT_MAP_HTML_MODE;
  payload: string;
};
