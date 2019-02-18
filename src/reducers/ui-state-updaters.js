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

import {
  DELETE_DATA_ID,
  ADD_DATA_ID,
  EXPORT_DATA_TYPE,
  RATIOS,
  RESOLUTIONS
} from 'constants/default-settings';
import {createNotification} from 'utils/notifications-utils';

export const DEFAULT_ACTIVE_SIDE_PANEL = 'layer';
export const DEFAULT_MODAL = ADD_DATA_ID;

/**
 * A list of map control visibilities and activeness.
 * @constant
 * @type {Object}
 * @property {Object} visibleLayers - Default: `{show: true, active: false}`
 * @property {Object} mapLegend - Default: `{show: true, active: false}`
 * @property {Object} toggle3d - Default: `{show: true}`
 * @property {Object} splitMap - Default: `{show: true}`
 * @public
 */
export const DEFAULT_MAP_CONTROLS = {
  visibleLayers: {
    show: true,
    active: false
  },
  mapLegend: {
    show: true,
    active: false
  },
  toggle3d: {
    show: true
  },
  splitMap: {
    show: true
  }
};

/**
 * Default image export config
 * @constant
 * @type {Object}
 * @property {string} ratio - Default: 'SCREEN',
 * @property {string} resolution - Default: 'ONE_X',
 * @property {boolean} legend - Default: false,
 * @property {string} imageDataUri - Default: '',
 * @property {boolean} exporting - Default: false
 * @public
 */
export const DEFAULT_EXPORT_IMAGE = {
  // user options
  ratio: RATIOS.SCREEN,
  resolution: RESOLUTIONS.ONE_X,
  legend: false,
  // exporting state
  imageDataUri: '',
  exporting: false
};

/**
 * @constant
 * @type {Object}
 * @property {string} selectedDataset - Default: '',
 * @property {string} dataType - Default: 'csv',
 * @property {boolean} filtered - Default: true,
 * @property {boolean} config - deprecated
 * @property {boolean} data - used in modal config expor. Default: falset
 * @public
 */
export const DEFAULT_EXPORT_DATA = {
  selectedDataset: '',
  dataType: EXPORT_DATA_TYPE.CSV,
  filtered: true,
  config: false, // no longer used, since we removed the option to export config from modal data export
  data: false // this is used in modal config export
};

export const DEFAULT_NOTIFICATIONS = [];

/**
 * Default initial `uiState`
 * @constant
 * @type {Object}
 * @property {boolean} readOnly - Default: false
 * @property {string} activeSidePanel - Default: 'layer'
 * @property {string|null} currentModal - Default: 'addData'
 * @property {string|null} datasetKeyToRemove - Default: null
 * @property {string|null} visibleDropdown - Default: null
 * @property {Object} exportImage - Default: [`DEFAULT_EXPORT_IMAGE`](#default_export_image)
 * @property {Object} exportData - Default: [`DEFAULT_EXPORT_DATA`](#default_export_data)
 * @property {Object} mapControls - Default: [`DEFAULT_MAP_CONTROLS`](#default_map_controls)
 * @public
 */
export const INITIAL_UI_STATE = {
  readOnly: false,
  activeSidePanel: DEFAULT_ACTIVE_SIDE_PANEL,
  currentModal: DEFAULT_MODAL,
  datasetKeyToRemove: null,
  visibleDropdown: null,
  // export image modal ui
  exportImage: DEFAULT_EXPORT_IMAGE,
  // export data modal ui
  exportData: DEFAULT_EXPORT_DATA,
  // map control panels
  mapControls: DEFAULT_MAP_CONTROLS,
  // ui notifications
  notifications: DEFAULT_NOTIFICATIONS
};

/* Updaters */
/**
 * Toggle active side panel
 * @mixin uiStateUpdaters.toggleSidePanelUpdater
 * @param {Object} state - `uiState`
 * @param {Object} action
 * @param {string} action.payload - id of side panel to be shown, one of `layer`, `filter`, `interaction`, `map`
 * @public
 */
export const toggleSidePanelUpdater = (state, {payload: id}) => {
  if (id === state.activeSidePanel) {
    return state;
  }

  return {
    ...state,
    activeSidePanel: id
  };
};

/**
 * Show and hide modal dialog
 * @mixin uiStateUpdaters.toggleModalUpdater
 * @param {Object} state - `uiState`
 * @param {Object} action
 * @param {string|null} action.payload - id of modal to be shown, null to hide modals. One of:
 *
 *  - [`DATA_TABLE_ID`](../constants/default-settings.md#data_table_id)
 *  - [`DELETE_DATA_ID`](../constants/default-settings.md#delete_data_id)
 *  - [`ADD_DATA_ID`](../constants/default-settings.md#add_data_id)
 *  - [`EXPORT_IMAGE_ID`](../constants/default-settings.md#export_image_id)
 *  - [`EXPORT_DATA_ID`](../constants/default-settings.md#export_data_id)
 *  - [`EXPORT_CONFIG_ID`](../constants/default-settings.md#export_config_id)
 *  - [`ADD_MAP_STYLE_ID`](../constants/default-settings.md#add_map_style_id)
 * @public
 */
export const toggleModalUpdater = (state, {payload: id}) => ({
  ...state,
  currentModal: id
});

/**
 * Hide and show side panel header dropdown, activated by clicking the share link on top of the side panel
 * @mixin uiStateUpdaters.showExportDropdownUpdater
 * @param {Object} state - `uiState`
 * @param {Object} action
 * @param {string} action.payload - id of the dropdown
 * @public
 */
export const showExportDropdownUpdater = (state, {payload: id}) => ({
  ...state,
  visibleDropdown: id
});

/**
 * Hide side panel header dropdown, activated by clicking the share link on top of the side panel
 * @mixin uiStateUpdaters.hideExportDropdownUpdater
 * @param {Object} state - `uiState`
 * @param {*} action
 * @public
 */
export const hideExportDropdownUpdater = (state, action) => ({
  ...state,
  visibleDropdown: null
});

/**
 * Toggle active map control panel
 * @mixin uiStateUpdaters.toggleMapControlUpdater
 * @param {Object} state - `uiState`
 * @param {Object} action
 * @param {string} action.payload - map control panel id, one of the keys of: [`DEFAULT_MAP_CONTROLS`](#default_map_controls)
 * @public
 */
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

/**
 * Toggle active map control panel
 * @mixin uiStateUpdaters.openDeleteModalUpdater
 * @param {Object} state - `uiState`
 * @param {Object} action
 * @param {string} action.payload - map control panel id, one of the keys of: [`DEFAULT_MAP_CONTROLS`](#default_map_controls)
 * @public
 */
export const openDeleteModalUpdater = (
  state,
  {payload: datasetKeyToRemove}
) => ({
  ...state,
  currentModal: DELETE_DATA_ID,
  datasetKeyToRemove
});

/**
 * set exportImage.legend to true or false
 * @mixin uiStateUpdaters.toggleLegendUpdater
 * @param {Object} state - `uiState`
 * @public
 */
export const toggleLegendUpdater = state => ({
  ...state,
  exportImage: {
    ...state.exportImage,
    legend: !state.exportImage.legend
  }
});

/**
 * set `exportImage.ratio`
 * @mixin uiStateUpdaters.setRatioUpdater
 * @param {Object} state - `uiState`
 * @param {Object} action
 * @param {string} action.payload - one of `'SCREEN'`, `'FOUR_BY_THREE'` and `'SIXTEEN_BY_NINE'`
 * @public
 */
export const setRatioUpdater = (state, {payload}) => ({
  ...state,
  exportImage: {
    ...state.exportImage,
    ratio: payload.ratio
  }
});

/**
 * set `exportImage.resolution`
 * @mixin uiStateUpdaters.setResolutionUpdater
 * @param {Object} state - `uiState`
 * @param {Object} action
 * @param {string} action.payload - one of `'ONE_X'`, `'TWO_X'`
 * @public
 */
export const setResolutionUpdater = (state, {payload}) => ({
  ...state,
  exportImage: {
    ...state.exportImage,
    resolution: payload.resolution
  }
});

/**
 * set `exportImage.exporting` to true
 * @mixin uiStateUpdaters.setResolutionUpdater
 * @param {Object} state - `uiState`
 * @public
 */
export const startExportingImage = state => ({
  ...state,
  exportImage: {
    ...state.exportImage,
    exporting: true,
    imageDataUri: ''
  }
});

/**
 * set `exportImage.setExportImageDataUri` to a dataUri
 * @mixin uiStateUpdaters.setResolutionUpdater
 * @param {Object} state - `uiState`
 * @param {Object} action
 * @param {string} action.payload - export image data uri
 * @public
 */
export const setExportImageDataUri = (state, {payload: dataUri}) => ({
  ...state,
  exportImage: {
    ...state.exportImage,
    exporting: false,
    imageDataUri: dataUri
  }
});

/**
 * cleanup export image
 * @mixin uiStateUpdaters.cleanupExportImage
 * @param {Object} state - `uiState`
 * @public
 */
export const cleanupExportImage = state => ({
  ...state,
  exportImage: {
    ...state.exportImage,
    exporting: false,
    imageDataUri: ''
  }
});

/**
 * set selected dataset to export
 * @mixin uiStateUpdaters.setExportSelectedDatasetUpdater
 * @param {Object} state - `uiState`
 * @param {Object} action
 * @param {string} action.payload - dataset id
 * @public
 */
export const setExportSelectedDatasetUpdater = (state, {payload: dataset}) => ({
  ...state,
  exportData: {
    ...state.exportData,
    selectedDataset: dataset
  }
});

/**
 * set selected dataset to export
 * @mixin uiStateUpdaters.setExportDataTypeUpdater
 * @param {Object} state - `uiState`
 * @param {Object} action
 * @param {string} action.payload - dataset id
 * @public
 */
export const setExportDataTypeUpdater = (state, {payload: dataType}) => ({
  ...state,
  exportData: {
    ...state.exportData,
    dataType
  }
});

/**
 * whether to export filtered data, `true` or `false`
 * @mixin uiStateUpdaters.setExportFilteredUpdater
 * @param {Object} state - `uiState`
 * @param {Object} action
 * @param {bollean} action.payload
 * @public
 */
export const setExportFilteredUpdater = (state, {payload: filtered}) => ({
  ...state,
  exportData: {
    ...state.exportData,
    filtered
  }
});

/**
 * whether to including data data in map config, toggle between `true` or `false`
 * @mixin uiStateUpdaters.setExportConfigUpdater
 * @param {Object} state - `uiState`
 * @public
 */
export const setExportDataUpdater = (state, action) => ({
  ...state,
  exportData: {
    ...state.exportData,
    data: !state.exportData.data
  }
});

export const addNotificationUpdater = (state, {payload}) => ({
  ...state,
  notifications: [
    ...(state.notifications || []),
    createNotification(payload)
  ]
});

export const removeNotificationUpdater = (state, {payload}) => ({
  ...state,
  notifications: state.notifications.filter(n => n.id !== payload)
});
