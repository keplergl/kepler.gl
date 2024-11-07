// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  ADD_DATA_ID,
  DATA_TABLE_ID,
  DEFAULT_NOTIFICATION_TOPICS,
  DELETE_DATA_ID,
  EXPORT_DATA_TYPE,
  EXPORT_HTML_MAP_MODES,
  EXPORT_IMG_RATIOS,
  EXPORT_MAP_FORMATS,
  RESOLUTIONS,
  MAP_CONTROLS,
  ExportImage
} from '@kepler.gl/constants';
import {LOCALE_CODES} from '@kepler.gl/localization';
import {createNotification, errorNotification, calculateExportImageSize} from '@kepler.gl/utils';
import {payload_, apply_, compose_} from './composer-helpers';

import {
  ActionTypes,
  KeplerGlInitPayload,
  LoadFilesErrUpdaterAction,
  UIStateActions
} from '@kepler.gl/actions';
import {
  ExportData,
  ExportHtml,
  ExportJson,
  ExportMap,
  MapControlItem,
  MapControls,
  UiState
} from '@kepler.gl/types';

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
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-ignore
const uiStateUpdaters = null;
/* eslint-enable @typescript-eslint/no-unused-vars */

const DEFAULT_MAP_CONTROLS_FEATURES: MapControlItem = {
  show: true,
  active: false,
  disableClose: false,
  // defines which map index users are interacting with (through map controls)
  activeMapIndex: 0
};

const DEFAULT_MAP_LEGEND_CONTROL = {
  ...DEFAULT_MAP_CONTROLS_FEATURES,
  disableEdit: false
};
/**
 * A list of map control visibility and whether is it active.
 * @memberof uiStateUpdaters
 * @constant
 * @property visibleLayers Default: `{show: true, active: false}`
 * @property mapLegend Default: `{show: true, active: false}`
 * @property toggle3d Default: `{show: true}`
 * @property splitMap Default: `{show: true}`
 * @property mapDraw Default: `{show: true, active: false}`
 * @property mapLocale Default: `{show: false, active: false}`
 * @public
 */
export const DEFAULT_MAP_CONTROLS: MapControls = (
  Object.keys(MAP_CONTROLS) as Array<keyof typeof MAP_CONTROLS>
).reduce(
  (final, current) => ({
    ...final,
    [current]:
      current === MAP_CONTROLS.mapLegend
        ? DEFAULT_MAP_LEGEND_CONTROL
        : DEFAULT_MAP_CONTROLS_FEATURES
  }),
  {} as MapControls
);

/**
 * Default image export config
 * @memberof uiStateUpdaters
 * @constant
 * @property ratio Default: `'SCREEN'`,
 * @property resolution Default: `'ONE_X'`,
 * @property legend Default: `false`,
 * @property mapH Default: 0,
 * @property mapW Default: 0,
 * @property imageSize Default: {zoomOffset: 0, scale: 1, imageW: 0, imageH: 0},
 * @property imageDataUri Default: `''`,
 * @property exporting Default: `false`
 * @property error Default: `false`
 * @property escapeXhtmlForWebpack Default: `true`
 * @public
 */
export const DEFAULT_EXPORT_IMAGE: ExportImage = {
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
  // when this is set to true, the mock map viewport will move to the center of data
  center: false,
  // exporting state
  imageDataUri: '',
  // exporting: used to attach plot-container to dom
  exporting: false,
  // processing: used as loading indicator when export image is being produced
  processing: false,
  error: false,
  // whether to apply fix for uglify error in dom-to-image (should be true for webpack builds)
  escapeXhtmlForWebpack: true
};

export const DEFAULT_LOAD_FILES = {
  fileLoading: false
};

/**
 * Default initial `exportData` settings
 * @memberof uiStateUpdaters
 * @constant
 * @property selectedDataset Default: `''`,
 * @property dataType Default: `'csv'`,
 * @property filtered Default: `true`,
 * @public
 */
export const DEFAULT_EXPORT_DATA: ExportData = {
  selectedDataset: '',
  dataType: EXPORT_DATA_TYPE.CSV,
  filtered: true
};

/**
 * @constant
 */
export const DEFAULT_NOTIFICATIONS = [];

/**
 * @constant
 * @property exportMapboxAccessToken - Default: null, this is used when we provide a default mapbox token for users to take advantage of
 * @property userMapboxToken - Default: '', mapbox token provided by user through input field
 * @property mode - Default: 'READ', read only or editable
 * @public
 */
export const DEFAULT_EXPORT_HTML: ExportHtml = {
  exportMapboxAccessToken: null,
  userMapboxToken: '',
  mode: EXPORT_HTML_MAP_MODES.READ
};

/**
 * @constant
 * @property hasData - Default: 'true',
 * @public
 */
export const DEFAULT_EXPORT_JSON: ExportJson = {
  hasData: true
};

/**
 * Export Map Config
 * @constant
 * @property HTML - Default: 'DEFAULT_EXPORT_HTML',
 * @property JSON - Default: 'DEFAULT_EXPORT_JSON',
 * @property format - Default: 'HTML',
 * @public
 */
export const DEFAULT_EXPORT_MAP: ExportMap = {
  [EXPORT_MAP_FORMATS.HTML]: DEFAULT_EXPORT_HTML,
  [EXPORT_MAP_FORMATS.JSON]: DEFAULT_EXPORT_JSON,
  format: EXPORT_MAP_FORMATS.HTML
};

/**
 * Default initial `uiState`
 * @memberof uiStateUpdaters
 * @constant
 * @property readOnly Default: `false`
 * @property activeSidePanel Default: `'layer'`
 * @property currentModal Default: `'addData'`
 * @property datasetKeyToRemove Default: `null`
 * @property visibleDropdown Default: `null`
 * @property exportImage Default: [`DEFAULT_EXPORT_IMAGE`](#default_export_image)
 * @property exportData Default: [`DEFAULT_EXPORT_DATA`](#default_export_data)
 * @property exportMap Default: [`DEFAULT_EXPORT_MAP`](#default_export_map)
 * @property mapControls Default: [`DEFAULT_MAP_CONTROLS`](#default_map_controls)
 * @property notifications Default: `[]`
 * @property notifications Default: `[]`
 * @property loadFiles
 * @property isSidePanelCloseButtonVisible Default: `true`
 * @public
 */
export const INITIAL_UI_STATE: UiState = {
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
  loadFiles: DEFAULT_LOAD_FILES,
  // Locale of the UI
  locale: LOCALE_CODES.en,
  layerPanelListView: 'list',
  filterPanelListView: 'list',
  isSidePanelCloseButtonVisible: true
};

/* Updaters */
/**
 * @memberof uiStateUpdaters
 */
export const initUiStateUpdater = (
  state: UiState,
  action: {
    type?: (typeof ActionTypes)['INIT'];
    payload: KeplerGlInitPayload;
  }
): UiState => ({
  ...state,
  ...(action.payload || {}).initialUiState
});

/**
 * Toggle active side panel
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @param action
 * @param action.payload id of side panel to be shown, one of `layer`, `filter`, `interaction`, `map`. close side panel if `null`
 * @returns nextState
 * @public
 */
export const toggleSidePanelUpdater = (
  state: UiState,
  {payload: id}: UIStateActions.ToggleSidePanelUpdaterAction
): UiState => {
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
 * @param state `uiState`
 * @param action
 * @paramaction.payload id of modal to be shown, null to hide modals. One of:
 *  - [`DATA_TABLE_ID`](../constants/default-settings.md#data_table_id)
 *  - [`DELETE_DATA_ID`](../constants/default-settings.md#delete_data_id)
 *  - [`ADD_DATA_ID`](../constants/default-settings.md#add_data_id)
 *  - [`EXPORT_IMAGE_ID`](../constants/default-settings.md#export_image_id)
 *  - [`EXPORT_DATA_ID`](../constants/default-settings.md#export_data_id)
 *  - [`ADD_MAP_STYLE_ID`](../constants/default-settings.md#add_map_style_id)
 * @returns nextState
 * @public
 */
export const toggleModalUpdater = (
  state: UiState,
  {payload: id}: UIStateActions.ToggleModalUpdaterAction
): UiState => ({
  ...state,
  currentModal: id
});

/**
 * Hide and show side panel header dropdown, activated by clicking the share link on top of the side panel
 * @memberof uiStateUpdaters
 * @public
 */
export const showExportDropdownUpdater = (
  state: UiState,
  {payload: id}: UIStateActions.ShowExportDropdownUpdaterAction
): UiState => ({
  ...state,
  visibleDropdown: id
});

/**
 * Hide side panel header dropdown, activated by clicking the share link on top of the side panel
 * @memberof uiStateUpdaters
 * @public
 */
export const hideExportDropdownUpdater = (state: UiState): UiState => ({
  ...state,
  visibleDropdown: null
});

/**
 * Toggle side panel close button on top left of the side panel
 * @memberof uiStateUpdaters
 * @public
 */
export const toggleSidePanelCloseButtonUpdater = (
  state: UiState,
  {payload: {show}}: UIStateActions.ToggleSidePanelCloseButtonUpdaterAction
): UiState => ({
  ...state,
  isSidePanelCloseButtonVisible: show
});

/**
 * Toggle active map control panel
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @param action action
 * @param action.payload map control panel id, one of the keys of: [`DEFAULT_MAP_CONTROLS`](#default_map_controls)
 * @returns nextState
 * @public
 */
export const toggleMapControlUpdater = (
  state: UiState,
  {payload: {panelId, index = 0}}: UIStateActions.ToggleMapControlUpdaterAction
): UiState => ({
  ...state,
  mapControls: {
    ...state.mapControls,
    [panelId]: {
      ...state.mapControls[panelId],
      active: !state.mapControls[panelId].active,
      activeMapIndex: index
    }
  }
});

/**
 * Toggle map control visibility
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @param action action
 * @param action.payload map control panel id, one of the keys of: [`DEFAULT_MAP_CONTROLS`](#default_map_controls)
 * @returns nextState
 * @public
 */
export const setMapControlVisibilityUpdater = (
  state: UiState,
  {payload: {panelId, show}}: UIStateActions.setMapControlVisibilityUpdaterAction
): UiState => {
  if (!state.mapControls?.[panelId]) {
    return state;
  }

  return {
    ...state,
    mapControls: {
      ...state.mapControls,
      [panelId]: {
        ...state.mapControls[panelId],
        show: Boolean(show)
      }
    }
  };
};

/**
 * Toggle active map control panel
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @param action
 * @param action.payload dataset id
 * @returns nextState
 * @public
 */
export const openDeleteModalUpdater = (
  state: UiState,
  {payload: datasetKeyToRemove}: UIStateActions.OpenDeleteModalUpdaterAction
): UiState => ({
  ...state,
  currentModal: DELETE_DATA_ID,
  datasetKeyToRemove
});

/**
 * Set `exportImage.legend` to `true` or `false`
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @returns nextState
 * @public
 */
export const setExportImageSettingUpdater = (
  state: UiState,
  {payload: newSetting}: UIStateActions.SetExportImageSettingUpdaterAction
): UiState => {
  const updated = {...state.exportImage, ...newSetting};
  const imageSize = calculateExportImageSize(updated) || state.exportImage.imageSize;

  return {
    ...state,
    exportImage: {
      ...updated,
      // @ts-expect-error
      // TODO: calculateExportImageSize does not return imageSize.zoomOffset,
      // do we need take this value from current state, or return defaul value = 0
      imageSize
    }
  };
};

/**
 * Set `exportImage.setExportImageDataUri` to a image dataUri
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @param action
 * @param action.payload export image data uri
 * @returns nextState
 * @public
 */
export const setExportImageDataUriUpdater = (
  state: UiState,
  {payload: dataUri}: UIStateActions.SetExportImageDataUriUpdaterAction
): UiState => ({
  ...state,
  exportImage: {
    ...state.exportImage,
    processing: false,
    imageDataUri: dataUri
  }
});

/**
 * @memberof uiStateUpdaters
 * @public
 */
export const setExportImageErrorUpdater = (
  state: UiState,
  {payload: error}: UIStateActions.SetExportImageErrorUpdaterAction
): UiState => ({
  ...state,
  exportImage: {
    ...state.exportImage,
    processing: false,
    error
  }
});

/**
 * Delete cached export image
 * @memberof uiStateUpdaters
 * @public
 */
export const cleanupExportImageUpdater = (state: UiState): UiState => ({
  ...state,
  exportImage: {
    ...state.exportImage,
    exporting: false,
    imageDataUri: '',
    error: false,
    processing: false,
    center: false
  }
});

/**
 * Start image exporting flow
 * @memberof uiStateUpdaters
 * @param state
 * @param options
 * @returns {UiState}
 * @public
 */
export const startExportingImageUpdater = (
  state: UiState,
  {payload: options = {}}: {payload: Partial<ExportImage>}
): UiState => {
  const imageSettings = {
    ...options,
    exporting: true
  };

  return compose_([
    cleanupExportImageUpdater,
    apply_(setExportImageSettingUpdater, payload_(imageSettings))
  ])(state);
};

/**
 * Set selected dataset for export
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @param action
 * @param action.payload dataset id
 * @returns nextState
 * @public
 */
export const setExportSelectedDatasetUpdater = (
  state: UiState,
  {payload: dataset}: UIStateActions.SetExportSelectedDatasetUpdaterAction
): UiState => ({
  ...state,
  exportData: {
    ...state.exportData,
    selectedDataset: dataset
  }
});

/**
 * Set data format for exporting data
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @param action
 * @param action.payload one of `'text/csv'`
 * @returns nextState
 * @public
 */
export const setExportDataTypeUpdater = (
  state: UiState,
  {payload: dataType}: UIStateActions.SetExportDataTypeUpdaterAction
): UiState => ({
  ...state,
  exportData: {
    ...state.exportData,
    dataType
  }
});

/**
 * Whether to export filtered data, `true` or `false`
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @param action
 * @param action.payload
 * @returns nextState
 * @public
 */
export const setExportFilteredUpdater = (
  state: UiState,
  {payload: filtered}: UIStateActions.SetExportFilteredUpdaterAction
): UiState => ({
  ...state,
  exportData: {
    ...state.exportData,
    filtered
  }
});

/**
 * Whether to including data in map config, toggle between `true` or `false`
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @returns nextState
 * @public
 */
export const setExportDataUpdater = (state: UiState): UiState => ({
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
 * @param state - `uiState`
 * @param action
 * @param action.payload
 * @returns nextState
 * @public
 */
export const setUserMapboxAccessTokenUpdater = (
  state: UiState,
  {payload: userMapboxToken}: UIStateActions.SetUserMapboxAccessTokenUpdaterAction
): UiState => ({
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
 * @param state - `uiState`
 * @param action
 * @param action.payload format to use to export the map into
 * @return nextState
 */
export const setExportMapFormatUpdater = (
  state: UiState,
  {payload: format}: UIStateActions.SetExportMapFormatUpdaterAction
): UiState => ({
  ...state,
  exportMap: {
    ...state.exportMap,
    // @ts-expect-error
    format
  }
});

/**
 * Set the export html map mode
 * @param state - `uiState`
 * @param action
 * @param action.payload to be set (available modes: EXPORT_HTML_MAP_MODES)
 * @return nextState
 */
export const setExportMapHTMLModeUpdater = (
  state: UiState,
  {payload: mode}: UIStateActions.SetExportHTMLMapModeUpdaterAction
): UiState => ({
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
 * Adds a new notification.
 * Updates a notification in case of matching ids.
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @param action
 * @param action.payload Params of a notification
 * @returns nextState
 * @public
 */
export const addNotificationUpdater = (
  state: UiState,
  {payload}: UIStateActions.AddNotificationUpdaterAction
): UiState => {
  const oldNotifications = state.notifications || [];
  // @ts-expect-error
  const payloadId = payload?.id;
  const notificationToUpdate = payloadId ? oldNotifications.find(n => n.id === payloadId) : null;

  let notifications;
  if (notificationToUpdate) {
    notifications = oldNotifications.map(n =>
      n.id === payloadId ? createNotification({...payload, count: n.count + 1}) : n
    );
  } else {
    notifications = [...oldNotifications, createNotification(payload)];
  }

  return {...state, notifications};
};

/**
 * Remove a notification
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @param action
 * @param action.payload id of the notification to be removed
 * @returns nextState
 * @public
 */
export const removeNotificationUpdater = (
  state: UiState,
  {payload: id}: UIStateActions.RemoveNotificationUpdaterAction
): UiState => ({
  ...state,
  notifications: state.notifications.filter(n => n.id !== id)
});

/**
 * Fired when file loading begin
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @returns nextState
 * @public
 */
export const loadFilesUpdater = (state: UiState): UiState => ({
  ...state,
  loadFiles: {
    ...state.loadFiles,
    fileLoading: true
  }
});

/**
 * Handles loading file success and set fileLoading property to false
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @returns nextState
 */
export const loadFilesSuccessUpdater = (state: UiState): UiState => ({
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
 * @param action
 * @param action.error
 * @returns nextState
 * @public
 */
export const loadFilesErrUpdater = (state: UiState, {error}: LoadFilesErrUpdaterAction): UiState =>
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
 * @returns nextState
 * @public
 */
export const toggleSplitMapUpdater = (state: UiState): UiState => ({
  ...state,
  mapControls: Object.entries(state.mapControls).reduce(
    (acc, entry) => ({
      ...acc,
      [entry[0]]: {
        ...entry[1],
        activeMapIndex: 0
      }
    }),
    {} as MapControls
  )
});

/**
 * Toggle modal data
 * @memberof uiStateUpdaters
 * @param state
 * @returns nextState
 * @public
 */
export const showDatasetTableUpdater = (state: UiState): UiState =>
  toggleModalUpdater(state, {payload: DATA_TABLE_ID});

/**
 * Set the locale of the UI
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @param action
 * @param action.payload
 * @param action.payload.locale locale
 * @returns nextState
 * @public
 */
export const setLocaleUpdater = (
  state: UiState,
  {payload: {locale}}: UIStateActions.SetLocaleUpdaterAction
): UiState => ({
  ...state,
  locale
});

/**
 * Toggle layer panel list view
 * @memberof uiStateUpdaters
 * @param state `uiState`
 * @param action
 * @param action.payload layer panel listView value. Can be 'list' or 'sortByDataset'
 * @returns nextState
 * @public
 */
export const togglePanelListViewUpdater = (
  state: UiState,
  {payload: {panelId, listView}}: UIStateActions.TogglePanelListViewAction
): UiState => {
  const stateProp =
    panelId === 'layer'
      ? 'layerPanelListView'
      : panelId === 'filter'
      ? 'filterPanelListView'
      : null;
  if (!stateProp || state[stateProp] === listView) {
    return state;
  }
  return {
    ...state,
    [stateProp]: listView
  };
};
