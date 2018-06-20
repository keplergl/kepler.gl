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

import {createAction} from 'redux-actions';
import ActionTypes from 'constants/action-types';

const {
  CLEANUP_EXPORT_IMAGE,
  OPEN_DELETE_MODAL,
  SET_EXPORT_DATA_TYPE,
  SET_EXPORT_FILTERED,
  SET_EXPORT_IMAGE_DATA_URI,
  SET_EXPORT_CONFIG,
  SET_EXPORT_DATA,
  SET_EXPORT_SELECTED_DATASET,
  SET_RATIO,
  SET_RESOLUTION,
  START_EXPORTING_IMAGE,
  TOGGLE_LEGEND,
  TOGGLE_MODAL,
  SHOW_EXPORT_DROPDOWN,
  HIDE_EXPORT_DROPDOWN,
  TOGGLE_SIDE_PANEL,
  TOGGLE_MAP_CONTROL
} = ActionTypes;

// second argument of createAction is expected to be payloadCreator or undefined
const [
  toggleSidePanel,
  toggleModal,
  showExportDropdown,
  hideExportDropdown,
  toggleMapControl,
  openDeleteModal,
  // export image
  setRatio,
  setResolution,
  toggleLegend,
  startExportingImage,
  setExportImageDataUri,
  cleanupExportImage,
  // export data
  setExportSelectedDataset,
  setExportDataType,
  setExportFiltered,
  setExportConfig,
  setExportData
] = [
  TOGGLE_SIDE_PANEL,
  TOGGLE_MODAL,
  SHOW_EXPORT_DROPDOWN,
  HIDE_EXPORT_DROPDOWN,
  TOGGLE_MAP_CONTROL,
  OPEN_DELETE_MODAL,
  SET_RATIO,
  SET_RESOLUTION,
  TOGGLE_LEGEND,
  START_EXPORTING_IMAGE,
  SET_EXPORT_IMAGE_DATA_URI,
  CLEANUP_EXPORT_IMAGE,
  SET_EXPORT_SELECTED_DATASET,
  SET_EXPORT_DATA_TYPE,
  SET_EXPORT_FILTERED,
  SET_EXPORT_CONFIG,
  SET_EXPORT_DATA
].map(a => createAction(a));

export {
  toggleSidePanel, toggleModal, showExportDropdown, hideExportDropdown, toggleMapControl, openDeleteModal, setExportConfig, setExportData,
  setRatio, setResolution, toggleLegend, startExportingImage, setExportImageDataUri, cleanupExportImage,
  setExportSelectedDataset, setExportDataType, setExportFiltered
};
