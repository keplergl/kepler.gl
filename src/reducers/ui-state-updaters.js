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

import {LAYER_CONFIG_ID, DELETE_DATA_ID} from 'constants/default-settings';

/* Updaters */
export const toggleSidePanelUpdater = (state, {payload: id}) => {
  if (id === state.activeSidePanel) {
    return state;
  }

  if (id === LAYER_CONFIG_ID) {
    return {
      ...state,
      currentModal: id
    };
  }

  return {
    ...state,
    activeSidePanel: id
  };
};

export const toggleModalUpdater = (state, {payload: id}) => ({
  ...state,
  currentModal: id
});

export const showExportDropdownUpdater = (state, {payload: id}) => ({
  ...state,
  visibleDropdown: id
});

export const hideExportDropdownUpdater = (state, {payload}) => ({
  ...state,
  visibleDropdown: null
});

export const toggleMapControlUpdater = (state, {payload: panelId}) => ({
  ...state,
  mapControls: {
    ...state.mapControls,
    [panelId]: {
      ...state.mapControls[panelId],
      active: !state.mapControls[panelId].active
    }
  }
});

export const openDeleteModalUpdater = (
  state,
  {payload: datasetKeyToRemove}
) => ({
  ...state,
  currentModal: DELETE_DATA_ID,
  datasetKeyToRemove
});

export const toggleLegendUpdater = state => ({
  ...state,
  exportImage: {
    ...state.exportImage,
    legend: !state.exportImage.legend
  }
});

export const setRatioUpdater = (state, {payload}) => ({
  ...state,
  exportImage: {
    ...state.exportImage,
    ratio: payload.ratio
  }
});

export const setResolutionUpdater = (state, {payload}) => ({
  ...state,
  exportImage: {
    ...state.exportImage,
    resolution: payload.resolution
  }
});

export const startExportingImage = state => ({
  ...state,
  exportImage: {
    ...state.exportImage,
    exporting: true,
    imageDataUri: ''
  }
});

export const setExportImageDataUri = (state, {payload}) => ({
  ...state,
  exportImage: {
    ...state.exportImage,
    exporting: false,
    imageDataUri: payload.dataUri
  }
});

export const cleanupExportImage = state => ({
  ...state,
  exportImage: {
    ...state.exportImage,
    exporting: false,
    imageDataUri: ''
  }
});

export const setExportSelectedDatasetUpdater = (state, {payload}) => ({
  ...state,
  exportData: {
    ...state.exportData,
    selectedDataset: payload.dataset
  }
});

export const setExportDataTypeUpdater = (state, {payload}) => ({
  ...state,
  exportData: {
    ...state.exportData,
    dataType: payload.dataType
  }
});

export const setExportFilteredUpdater = (state, {payload}) => ({
  ...state,
  exportData: {
    ...state.exportData,
    filtered: payload.filtered
  }
});

export const setExportConfigUpdater = (state, action) => ({
  ...state,
  exportData: {
    ...state.exportData,
    config: !state.exportData.config
  }
});

export const setExportDataUpdater = (state, action) => ({
  ...state,
  exportData: {
    ...state.exportData,
    data: !state.exportData.data
  }
});
