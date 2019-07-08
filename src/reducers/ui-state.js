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

import {handleActions} from 'redux-actions';
import ActionTypes from 'constants/action-types';
import * as uiStateUpdaters from './ui-state-updaters';

/**
 * Important: Do not rename `actionHandler` or the assignment pattern of property value.
 * It is used to generate documentation
 */
const actionHandler = {
  [ActionTypes.TOGGLE_SIDE_PANEL]: uiStateUpdaters.toggleSidePanelUpdater,
  [ActionTypes.TOGGLE_MODAL]: uiStateUpdaters.toggleModalUpdater,
  [ActionTypes.SHOW_EXPORT_DROPDOWN]: uiStateUpdaters.showExportDropdownUpdater,
  [ActionTypes.HIDE_EXPORT_DROPDOWN]: uiStateUpdaters.hideExportDropdownUpdater,
  [ActionTypes.OPEN_DELETE_MODAL]: uiStateUpdaters.openDeleteModalUpdater,
  [ActionTypes.TOGGLE_MAP_CONTROL]: uiStateUpdaters.toggleMapControlUpdater,
  [ActionTypes.ADD_NOTIFICATION]: uiStateUpdaters.addNotificationUpdater,
  [ActionTypes.REMOVE_NOTIFICATION]: uiStateUpdaters.removeNotificationUpdater,

  [ActionTypes.SET_RATIO]: uiStateUpdaters.setRatioUpdater,
  [ActionTypes.SET_RESOLUTION]: uiStateUpdaters.setResolutionUpdater,
  [ActionTypes.TOGGLE_LEGEND]: uiStateUpdaters.toggleLegendUpdater,
  [ActionTypes.START_EXPORTING_IMAGE]: uiStateUpdaters.startExportingImage,
  [ActionTypes.SET_EXPORT_IMAGE_DATA_URI]: uiStateUpdaters.setExportImageDataUri,
  [ActionTypes.SET_EXPORT_IMAGE_ERROR]: uiStateUpdaters.setExportImageError,
  [ActionTypes.CLEANUP_EXPORT_IMAGE]: uiStateUpdaters.cleanupExportImage,

  [ActionTypes.SET_EXPORT_SELECTED_DATASET]: uiStateUpdaters.setExportSelectedDatasetUpdater,
  [ActionTypes.SET_EXPORT_DATA_TYPE]: uiStateUpdaters.setExportDataTypeUpdater,
  [ActionTypes.SET_EXPORT_FILTERED]: uiStateUpdaters.setExportFilteredUpdater,
  [ActionTypes.SET_EXPORT_DATA]: uiStateUpdaters.setExportDataUpdater,
  [ActionTypes.SET_USER_MAPBOX_ACCESS_TOKEN]: uiStateUpdaters.setUserMapboxAccessTokenUpdater,
  [ActionTypes.SET_EXPORT_MAP_FORMAT]: uiStateUpdaters.setExportMapFormat,
  [ActionTypes.SET_CUSTOM_PALETTE]: uiStateUpdaters.setCustomPaletteUpdater,
  [ActionTypes.TOGGLE_SKETCHER]: uiStateUpdaters.onToggleSketcherUpdater
};

/* Reducer */
export const uiStateReducerFactory = (initialState = {}) =>
  handleActions(actionHandler, {...uiStateUpdaters.INITIAL_UI_STATE, ...initialState, initialState});

export default uiStateReducerFactory();
