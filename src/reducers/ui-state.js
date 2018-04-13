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

import {handleActions} from 'redux-actions';
import ActionTypes from 'constants/action-types';
import {
  ADD_DATA_ID,
  EXPORT_DATA_TYPE,
  RATIOS,
  RESOLUTIONS
} from 'constants/default-settings';
import {
  openDeleteModalUpdater,
  toggleModalUpdater,
  toggleSidePanelUpdater,
  // export image  
  cleanupExportImage,
  setExportImageDataUri,
  setRatioUpdater,
  setResolutionUpdater,
  startExportingImage,
  toggleLegendUpdater,
  // export data
  setExportSelectedDatasetUpdater,
  setExportDataTypeUpdater,
  setExportFilteredUpdater
} from './ui-state-updaters';

export const INITIAL_UI_STATE = {
  readOnly: false,
  activeSidePanel: 'layer',
  currentModal: ADD_DATA_ID,
  datasetKeyToRemove: null,

  // export image modal ui
  exportImage: {
    // user options
    ratio: RATIOS.SCREEN,
    resolution: RESOLUTIONS.ONE_X,
    legend: false,
    // exporting state
    imageDataUri: '',
    exporting: false
  },
  // export data modal ui
  exportData: {
    selectedDataset: '',
    dataType: EXPORT_DATA_TYPE.CSV,
    filtered: true
  }
};

const actionHandler = {
  [ActionTypes.TOGGLE_SIDE_PANEL]: toggleSidePanelUpdater,
  [ActionTypes.TOGGLE_MODAL]: toggleModalUpdater,
  [ActionTypes.OPEN_DELETE_MODAL]: openDeleteModalUpdater,

  [ActionTypes.SET_RATIO]: setRatioUpdater,
  [ActionTypes.SET_RESOLUTION]: setResolutionUpdater,
  [ActionTypes.TOGGLE_LEGEND]: toggleLegendUpdater,
  [ActionTypes.START_EXPORTING_IMAGE]: startExportingImage,
  [ActionTypes.SET_EXPORT_IMAGE_DATA_URI]: setExportImageDataUri,
  [ActionTypes.CLEANUP_EXPORT_IMAGE]: cleanupExportImage,

  [ActionTypes.SET_EXPORT_SELECTED_DATASET]: setExportSelectedDatasetUpdater,
  [ActionTypes.SET_EXPORT_DATA_TYPE]: setExportDataTypeUpdater,
  [ActionTypes.SET_EXPORT_FILTERED]: setExportFilteredUpdater
};

/* Reducer */
export const uiStateReducerFactory = (initialState = {}) =>
  handleActions(actionHandler, {...INITIAL_UI_STATE, ...initialState, initialState});

export default uiStateReducerFactory();
