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

import {
  ADD_DATA_ID,
  DEFAULT_NOTIFICATION_TOPICS,
  DELETE_DATA_ID,
  EXPORT_DATA_TYPE,
  EXPORT_HTML_MAP_MODES,
  EXPORT_IMG_RATIOS,
  EXPORT_MAP_FORMATS,
  RESOLUTIONS
} from 'constants/default-settings';
import {createNotification, errorNotification} from 'utils/notifications-utils';
import {calculateExportImageSize} from 'utils/export-utils';

export const DEFAULT_ACTIVE_SIDE_PANEL = 'layer';
export const DEFAULT_MODAL = ADD_DATA_ID;

/**
 * Updaters for `uiState` reducer. Can be used in your root reducer to directly modify kepler.gl's state.
 * Read more about [Using updaters](../advanced-usage/using-updaters.md)
 *
 * @public
 * @example
 *
 * import keplerGlReducer, {uiStateUpdaters} from 'kepler.gl/reducers';
 * // Root Reducer
 * const reducers = combineReducers({
 *  keplerGl: keplerGlReducer,
 *  app: appReducer
 * });
 *
 * const composedReducer = (state, action) => {
 *  switch (action.type) {
 *    // click button to close side panel
 *    case 'CLICK_BUTTON':
 *      return {
 *        ...state,
 *        keplerGl: {
 *          ...state.keplerGl,
 *          foo: {
 *             ...state.keplerGl.foo,
 *             uiState: uiStateUpdaters.toggleSidePanelUpdater(
 *               uiState, {payload: null}
 *             )
 *          }
 *        }
 *      };
 *  }
 *  return reducers(state, action);
 * };
 *
 * export default composedReducer;
 */
/* eslint-disable no-unused-vars */
const uiStateUpdaters = null;
/* eslint-enable no-unused-vars */

/**
 * A list of map control visibility and whether is it active.
 * @memberof uiStateUpdaters
 * @constant
 * @type {Object}
 * @property {Object} visibleLayers Default: `{show: true, active: false}`
 * @property {Object} mapLegend Default: `{show: true, active: false}`
 * @property {Object} toggle3d Default: `{show: true}`
 * @property {Object} splitMap Default: `{show: true}`
 * @public
 */
const DEFAULT_MAP_CONTROLS_FEATURES = {
  show: true,
  active: false,
  // defines which map index users are interacting with (through map controls)
  activeMapIndex: 0
};

export const DEFAULT_MAP_CONTROLS = [
  'visibleLayers',
  'mapLegend',
  'toggle3d',
  'splitMap',
  'mapDraw'
].reduce(
  (final, current) => ({
    ...final,
    [current]: DEFAULT_MAP_CONTROLS_FEATURES
  }),
  {}
);

/**
 * Default image export config
 * @memberof uiStateUpdaters
 * @constant
 * @type {Object}
 * @property {string} ratio Default: `'SCREEN'`,
 * @property {string} resolution Default: `'ONE_X'`,
 * @property {boolean} legend Default: `false`,
 * @property {string} imageDataUri Default: `''`,
 * @property {boolean} exporting Default: `false`
 * @property {boolean} error Default: `false`
 * @public
 */
export const DEFAULT_EXPORT_IMAGE = {
  // user options
  ratio: EXPORT_IMG_RATIOS.SCREEN,
  resolution: RESOLUTIONS.ONE_X,
  legend: false,
  mapH: 0,
  mapW: 0,
  imageSize: {
    zoomOffset: 0,
    scale: 1,
    imageW: 0,
    imageH: 0
  },
  // exporting state
  imageDataUri: '',
  exporting: false,
  error: false
};

export const DEFAULT_LOAD_FILES = {
  fileLoading: false
};

/**
 * Default initial `exportData` settings
 * @memberof uiStateUpdaters
 * @constant
 * @type {Object}
 * @property {string} selectedDataset Default: `''`,
 * @property {string} dataType Default: `'csv'`,
 * @property {boolean} filtered Default: `true`,
 * @property {boolean} config deprecated
 * @property {boolean} data used in modal config export. Default: `false`
 * @public
 */
export const DEFAULT_EXPORT_DATA = {
  selectedDataset: '',
  dataType: EXPORT_DATA_TYPE.CSV,
  filtered: true
};

/**
 * @constant
 * @type {Array}
 */
export const DEFAULT_NOTIFICATIONS = [];

/**
 * @constant
 * @type {Object}
 * @property {string} exportMapboxAccessToken - Default: null, this is used when we provide a default mapbox token for users to take advantage of
 * @property {string} userMapboxToken - Default: '', mapbox token provided by user through input field
 * @public
 */
export const DEFAULT_EXPORT_HTML = {
  exportMapboxAccessToken: null,
  userMapboxToken: '',
  mode: EXPORT_HTML_MAP_MODES.READ
};

export const DEFAULT_EXPORT_JSON = {
  hasData: true
};

export const DEFAULT_EXPORT_MAP = {
  [EXPORT_MAP_FORMATS.HTML]: DEFAULT_EXPORT_HTML,
  [EXPORT_MAP_FORMATS.JSON]: DEFAULT_EXPORT_JSON,
  format: EXPORT_MAP_FORMATS.HTML
};

/**
 * Default initial `uiState`
 * @memberof uiStateUpdaters
 * @constant
 * @type {Object}
 * @property {boolean} readOnly Default: `false`
 * @property {string} activeSidePanel Default: `'layer'`
 * @property {string|null} currentModal Default: `'addData'`
 * @property {string|null} datasetKeyToRemove Default: `null`
 * @property {string|null} visibleDropdown Default: `null`
 * @property {Object} exportImage Default: [`DEFAULT_EXPORT_IMAGE`](#default_export_image)
 * @property {Object} exportData Default: [`DEFAULT_EXPORT_DATA`](#default_export_data)
 * @property {Object} mapControls Default: [`DEFAULT_MAP_CONTROLS`](#default_map_controls)
 * @property {number} activeMapIndex defines which map the user clicked on. Default: 0
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
  // html export
  exportMap: DEFAULT_EXPORT_MAP,
  // map control panels
  mapControls: DEFAULT_MAP_CONTROLS,
  // ui notifications
  notifications: DEFAULT_NOTIFICATIONS,
  // load files
  loadFiles: DEFAULT_LOAD_FILES
};

/* Updaters */
/**
 * Toggle active side panel
 * @memberof uiStateUpdaters
 * @param {Object} state `uiState`
 * @param {Object} action
 * @param {string|null} action.payload id of side panel to be shown, one of `layer`, `filter`, `interaction`, `map`. close side panel if `null`
 * @returns {Object} nextState
 * @public
 */
export const toggleSidePanelUpdater = (state, {payload: id}) => {
  return id === state.activeSidePanel
    ? state
    : {
        ...state,
        activeSidePanel: id
      };
};

/**
 * Show and hide modal dialog
 * @memberof uiStateUpdaters
 * @param {Object} state `uiState`
 * @param {Object} action
 * @param {string|null} action.payload id of modal to be shown, null to hide modals. One of:
 *
 *  - [`DATA_TABLE_ID`](../constants/default-settings.md#data_table_id)
 *  - [`DELETE_DATA_ID`](../constants/default-settings.md#delete_data_id)
 *  - [`ADD_DATA_ID`](../constants/default-settings.md#add_data_id)
 *  - [`EXPORT_IMAGE_ID`](../constants/default-settings.md#export_image_id)
 *  - [`EXPORT_DATA_ID`](../constants/default-settings.md#export_data_id)
 *  - [`ADD_MAP_STYLE_ID`](../constants/default-settings.md#add_map_style_id)
 * @returns {Object} nextState
 * @public
 */
export const toggleModalUpdater = (state, {payload: id}) => ({
  ...state,
  currentModal: id
});

/**
 * Hide and show side panel header dropdown, activated by clicking the share link on top of the side panel
 * @memberof uiStateUpdaters
 * @param {Object} state `uiState`
 * @param {Object} action
 * @param {string} action.payload id of the dropdown
 * @returns {Object} nextState
 * @public
 */
export const showExportDropdownUpdater = (state, {payload: id}) => ({
  ...state,
  visibleDropdown: id
});

/**
 * Hide side panel header dropdown, activated by clicking the share link on top of the side panel
 * @memberof uiStateUpdaters
 * @param {Object} state `uiState`
 * @returns {Object} nextState
 * @public
 */
export const hideExportDropdownUpdater = state => ({
  ...state,
  visibleDropdown: null
});

/**
 * Toggle active map control panel
 * @memberof uiStateUpdaters
 * @param {Object} state `uiState`
 * @param {Object} action action
 * @param {string} action.payload map control panel id, one of the keys of: [`DEFAULT_MAP_CONTROLS`](#default_map_controls)
 * @returns {Object} nextState
 * @public
 */
export const toggleMapControlUpdater = (state, {payload: {panelId, index = 0}}) => ({
  ...state,
  mapControls: {
    ...state.mapControls,
    [panelId]: {
      ...state.mapControls[panelId],
      // this handles split map interaction
      // Toggling from within the same map will simply toggle the active property
      // Toggling from within different maps we set the active property to true
      active:
        index === state.mapControls[panelId].activeMapIndex
          ? !state.mapControls[panelId].active
          : true,
      activeMapIndex: index
    }
  }
});

/**
 * Toggle active map control panel
 * @memberof uiStateUpdaters
 * @param {Object} state `uiState`
 * @param {Object} action
 * @param {string} action.payload dataset id
 * @returns {Object} nextState
 * @public
 */
export const openDeleteModalUpdater = (state, {payload: datasetKeyToRemove}) => ({
  ...state,
  currentModal: DELETE_DATA_ID,
  datasetKeyToRemove
});

/**
 * Set `exportImage.legend` to `true` or `false`
 * @memberof uiStateUpdaters
 * @param {Object} state `uiState`
 * @returns {Object} nextState
 * @public
 */
export const setExportImageSetting = (state, {payload: newSetting}) => {
  const updated = {...state.exportImage, ...newSetting};
  const imageSize = calculateExportImageSize(updated) || state.exportImage.imageSize;

  return {
    ...state,
    exportImage: {
      ...updated,
      imageSize
    }
  };
};

/**
 * Set `exportImage.exporting` to `true`
 * @memberof uiStateUpdaters
 * @param {Object} state `uiState`
 * @returns {Object} nextState
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
 * Set `exportImage.setExportImageDataUri` to a image dataUri
 * @memberof uiStateUpdaters
 * @param {Object} state `uiState`
 * @param {Object} action
 * @param {string} action.payload export image data uri
 * @returns {Object} nextState
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

export const setExportImageError = (state, {payload: error}) => ({
  ...state,
  exportImage: {
    ...state.exportImage,
    exporting: false,
    error
  }
});

/**
 * Delete cached export image
 * @memberof uiStateUpdaters
 * @param {Object} state `uiState`
 * @returns {Object} nextState
 * @public
 */
export const cleanupExportImage = state => ({
  ...state,
  exportImage: {
    ...state.exportImage,
    exporting: false,
    imageDataUri: '',
    error: false
  }
});

/**
 * Set selected dataset for export
 * @memberof uiStateUpdaters
 * @param {Object} state `uiState`
 * @param {Object} action
 * @param {string} action.payload dataset id
 * @returns {Object} nextState
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
 * Set data format for exporting data
 * @memberof uiStateUpdaters
 * @param {Object} state `uiState`
 * @param {Object} action
 * @param {string} action.payload one of `'text/csv'`
 * @returns {Object} nextState
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
 * Whether to export filtered data, `true` or `false`
 * @memberof uiStateUpdaters
 * @param {Object} state `uiState`
 * @param {Object} action
 * @param {boolean} action.payload
 * @returns {Object} nextState
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
 * Whether to including data in map config, toggle between `true` or `false`
 * @memberof uiStateUpdaters
 * @param {Object} state `uiState`
 * @returns {Object} nextState
 * @public
 */
export const setExportDataUpdater = state => ({
  ...state,
  exportMap: {
    ...state.exportMap,
    [EXPORT_MAP_FORMATS.JSON]: {
      ...state.exportMap[EXPORT_MAP_FORMATS.JSON],
      hasData: !state.exportMap[EXPORT_MAP_FORMATS.JSON].hasData
    }
  }
});

/**
 * whether to export a mapbox access to HTML single page
 * @param {Object} state - `uiState`
 * @param {Object} action
 * @param {string} action.payload
 * @returns {Object} nextState
 * @public
 */
export const setUserMapboxAccessTokenUpdater = (state, {payload: userMapboxToken}) => ({
  ...state,
  exportMap: {
    ...state.exportMap,
    [EXPORT_MAP_FORMATS.HTML]: {
      ...state.exportMap[EXPORT_MAP_FORMATS.HTML],
      userMapboxToken
    }
  }
});

/**
 * Sets the export map format
 * @param {Object} state - `uiState`
 * @param {string} format to use to export the map onto
 * @return {Object} nextState
 */
export const setExportMapFormatUpdater = (state, {payload: format}) => ({
  ...state,
  exportMap: {
    ...state.exportMap,
    format
  }
});

/**
 * Set the export html map mode
 * @param {Object} state - `uiState`
 * @param {string} mode to be set (available modes: EXPORT_HTML_MAP_MODES)
 * @return {{[p: string]: *}}
 */
export const setExportMapHTMLMode = (state, {payload: mode}) => ({
  ...state,
  exportMap: {
    ...state.exportMap,
    [EXPORT_MAP_FORMATS.HTML]: {
      ...state.exportMap[EXPORT_MAP_FORMATS.HTML],
      mode
    }
  }
});

/**
 * Add a notification to be displayed
 * @memberof uiStateUpdaters
 * @param {Object} state `uiState`
 * @param {Object} action
 * @param {Object} action.payload
 * @returns {Object} nextState
 * @public
 */
export const addNotificationUpdater = (state, {payload}) => ({
  ...state,
  notifications: [...(state.notifications || []), createNotification(payload)]
});

/**
 * Remove a notification
 * @memberof uiStateUpdaters
 * @param {Object} state `uiState`
 * @param {Object} action
 * @param {String} action.payload id of the notification to be removed
 * @returns {Object} nextState
 * @public
 */
export const removeNotificationUpdater = (state, {payload: id}) => ({
  ...state,
  notifications: state.notifications.filter(n => n.id !== id)
});

/**
 * Fired when file loading begin
 * @memberof uiStateUpdaters
 * @param {Object} state `uiState`
 * @returns {Object} nextState
 * @public
 */
export const loadFilesUpdater = state => ({
  ...state,
  loadFiles: {
    ...state.loadFiles,
    fileLoading: true
  }
});

/**
 * Handles loading file success and set fileLoading property to false
 * @memberof uiStateUpdaters
 * @param {Object} state `uiState`
 * @returns {Object} nextState
 */
export const loadFilesSuccessUpdater = state => ({
  ...state,
  loadFiles: {
    ...state.loadFiles,
    fileLoading: false
  }
});

/**
 * Handles load file error and set fileLoading property to false
 * @memberof uiStateUpdaters
 * @param state
 * @param error
 * @returns {Object} nextState
 * @public
 */
export const loadFilesErrUpdater = (state, {error}) =>
  addNotificationUpdater(
    {
      ...state,
      loadFiles: {
        ...state.loadFiles,
        fileLoading: false
      }
    },
    {
      payload: errorNotification({
        message: (error || {}).message || 'Failed to upload files',
        topic: DEFAULT_NOTIFICATION_TOPICS.global
      })
    }
  );

/**
 * Handles toggle map split and reset all map control index to 0
 * @memberof uiStateUpdaters
 * @param state
 * @returns {Object} nextState
 * @public
 */
export const toggleSplitMapUpdater = state => ({
  ...state,
  mapControls: Object.entries(state.mapControls).reduce(
    (acc, entry) => ({
      ...acc,
      [entry[0]]: {
        ...entry[1],
        activeMapIndex: 0
      }
    }),
    {}
  )
});
