// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {handleActions} from 'redux-actions';
import {ActionTypes} from '@kepler.gl/actions';
import * as uiStateUpdaters from './ui-state-updaters';

/**
 * Important: Do not rename `actionHandler` or the assignment pattern of property value.
 * It is used to generate documentation
 */
const actionHandler = {
  [ActionTypes.INIT]: uiStateUpdaters.initUiStateUpdater,
  [ActionTypes.TOGGLE_SIDE_PANEL]: uiStateUpdaters.toggleSidePanelUpdater,
  [ActionTypes.TOGGLE_MODAL]: uiStateUpdaters.toggleModalUpdater,
  [ActionTypes.SHOW_EXPORT_DROPDOWN]: uiStateUpdaters.showExportDropdownUpdater,
  [ActionTypes.HIDE_EXPORT_DROPDOWN]: uiStateUpdaters.hideExportDropdownUpdater,
  [ActionTypes.TOGGLE_SIDE_PANEL_CLOSE_BUTTON]: uiStateUpdaters.toggleSidePanelCloseButtonUpdater,
  [ActionTypes.OPEN_DELETE_MODAL]: uiStateUpdaters.openDeleteModalUpdater,
  [ActionTypes.TOGGLE_MAP_CONTROL]: uiStateUpdaters.toggleMapControlUpdater,
  [ActionTypes.SET_MAP_CONTROL_VISIBILITY]: uiStateUpdaters.setMapControlVisibilityUpdater,
  [ActionTypes.ADD_NOTIFICATION]: uiStateUpdaters.addNotificationUpdater,
  [ActionTypes.REMOVE_NOTIFICATION]: uiStateUpdaters.removeNotificationUpdater,

  [ActionTypes.SET_EXPORT_IMAGE_SETTING]: uiStateUpdaters.setExportImageSettingUpdater,
  [ActionTypes.SET_EXPORT_IMAGE_DATA_URI]: uiStateUpdaters.setExportImageDataUriUpdater,
  [ActionTypes.SET_EXPORT_IMAGE_ERROR]: uiStateUpdaters.setExportImageErrorUpdater,
  [ActionTypes.CLEANUP_EXPORT_IMAGE]: uiStateUpdaters.cleanupExportImageUpdater,
  [ActionTypes.START_EXPORTING_IMAGE]: uiStateUpdaters.startExportingImageUpdater,

  [ActionTypes.SET_EXPORT_SELECTED_DATASET]: uiStateUpdaters.setExportSelectedDatasetUpdater,
  [ActionTypes.SET_EXPORT_DATA_TYPE]: uiStateUpdaters.setExportDataTypeUpdater,
  [ActionTypes.SET_EXPORT_FILTERED]: uiStateUpdaters.setExportFilteredUpdater,
  [ActionTypes.SET_EXPORT_DATA]: uiStateUpdaters.setExportDataUpdater,
  [ActionTypes.SET_USER_MAPBOX_ACCESS_TOKEN]: uiStateUpdaters.setUserMapboxAccessTokenUpdater,

  [ActionTypes.SET_EXPORT_MAP_FORMAT]: uiStateUpdaters.setExportMapFormatUpdater,

  [ActionTypes.SET_EXPORT_MAP_HTML_MODE]: uiStateUpdaters.setExportMapHTMLModeUpdater,
  [ActionTypes.LOAD_FILES]: uiStateUpdaters.loadFilesUpdater,
  [ActionTypes.LOAD_FILES_ERR]: uiStateUpdaters.loadFilesErrUpdater,

  [ActionTypes.TOGGLE_SPLIT_MAP]: uiStateUpdaters.toggleSplitMapUpdater,
  [ActionTypes.SHOW_DATASET_TABLE]: uiStateUpdaters.showDatasetTableUpdater,
  [ActionTypes.SET_LOCALE]: uiStateUpdaters.setLocaleUpdater,
  [ActionTypes.TOGGLE_PANEL_LIST_VIEW]: uiStateUpdaters.togglePanelListViewUpdater
};

/* Reducer */
export const uiStateReducerFactory = (initialState = {}) =>
  // @ts-expect-error
  handleActions(actionHandler, {
    ...uiStateUpdaters.INITIAL_UI_STATE,
    ...initialState,
    // @ts-ignore
    initialState
  });

export default uiStateReducerFactory();
