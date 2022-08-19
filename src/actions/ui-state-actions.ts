// Copyright (c) 2022 Uber Technologies, Inc.
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

import {createAction} from '@reduxjs/toolkit';
import {default as ActionTypes} from './action-types';
import {Merge} from '@kepler.gl/types';
import {ExportImage} from '@kepler.gl/constants'

/** TOGGLE_SIDE_PANEL */
export type ToggleSidePanelUpdaterAction = {
  payload: string;
};
/**
 * Toggle active side panel
 * @memberof uiStateActions
 * @param id  id of side panel to be shown, one of `layer`, `filter`, `interaction`, `map`
 * @public
 */
export const toggleSidePanel: (
  id: string
) => Merge<
  ToggleSidePanelUpdaterAction,
  {type: typeof ActionTypes.TOGGLE_SIDE_PANEL}
> = createAction(ActionTypes.TOGGLE_SIDE_PANEL, (id: string) => ({payload: id}));

/** TOGGLE_MODAL */
export type ToggleModalUpdaterAction = {
  payload: string | null;
};
/**
 * Show and hide modal dialog
 * @memberof uiStateActions
 * @param id - id of modal to be shown, null to hide modals. One of:
 *  - [`DATA_TABLE_ID`](../constants/default-settings.md#data_table_id)
 *  - [`DELETE_DATA_ID`](../constants/default-settings.md#delete_data_id)
 *  - [`ADD_DATA_ID`](../constants/default-settings.md#add_data_id)
 *  - [`EXPORT_IMAGE_ID`](../constants/default-settings.md#export_image_id)
 *  - [`EXPORT_DATA_ID`](../constants/default-settings.md#export_data_id)
 *  - [`ADD_MAP_STYLE_ID`](../constants/default-settings.md#add_map_style_id)
 * @public
 */
export const toggleModal: (
  id: ToggleModalUpdaterAction['payload']
) => Merge<ToggleModalUpdaterAction, {type: typeof ActionTypes.TOGGLE_MODAL}> = createAction(
  ActionTypes.TOGGLE_MODAL,
  (id: ToggleModalUpdaterAction['payload']) => ({
    payload: id
  })
);

/** SHOW_EXPORT_DROPDOWN */
export type ShowExportDropdownUpdaterAction = {
  payload: string;
};
/**
 * Hide and show side panel header dropdown, activated by clicking the share link on top of the side panel
 * @memberof uiStateActions
 * @param id - id of the dropdown
 * @public
 */
export const showExportDropdown: (
  id: ShowExportDropdownUpdaterAction['payload']
) => Merge<
  ShowExportDropdownUpdaterAction,
  {type: typeof ActionTypes.SHOW_EXPORT_DROPDOWN}
> = createAction(
  ActionTypes.SHOW_EXPORT_DROPDOWN,
  (id: ShowExportDropdownUpdaterAction['payload']) => ({payload: id})
);

/**
 * Hide side panel header dropdown, activated by clicking the share link on top of the side panel
 * @memberof uiStateActions
 * @public
 */
export const hideExportDropdown: () => {
  type: typeof ActionTypes.HIDE_EXPORT_DROPDOWN;
} = createAction(ActionTypes.HIDE_EXPORT_DROPDOWN);

/** TOGGLE_MAP_CONTROL */
export type ToggleMapControlUpdaterAction = {
  payload: {
    panelId: string;
    index: number;
  };
};
/**
 * Toggle active map control panel
 * @memberof uiStateActions
 * @param panelId - map control panel id, one of the keys of: [`DEFAULT_MAP_CONTROLS`](#default_map_controls)
 * @public
 */
export const toggleMapControl: (
  panelId: ToggleMapControlUpdaterAction['payload']['panelId'],
  index: ToggleMapControlUpdaterAction['payload']['index']
) => Merge<
  ToggleMapControlUpdaterAction,
  {type: typeof ActionTypes.TOGGLE_MAP_CONTROL}
> = createAction(
  ActionTypes.TOGGLE_MAP_CONTROL,
  (
    panelId: ToggleMapControlUpdaterAction['payload']['panelId'],
    index: ToggleMapControlUpdaterAction['payload']['index']
  ) => ({
    payload: {
      panelId,
      index
    }
  })
);

/** SET_MAP_CONTROL_VISIBILITY */
export type setMapControlVisibilityUpdaterAction = {
  payload: {
    panelId: string;
    show: boolean;
  };
};
/**
 * Toggle active map control panel
 * @memberof uiStateActions
 * @param panelId - map control panel id, one of the keys of: [`DEFAULT_MAP_CONTROLS`](#default_map_controls)
 * @public
 */
export const setMapControlVisibility: (
  panelId: setMapControlVisibilityUpdaterAction['payload']['panelId'],
  show: setMapControlVisibilityUpdaterAction['payload']['show']
) => Merge<
  setMapControlVisibilityUpdaterAction,
  {type: typeof ActionTypes.SET_MAP_CONTROL_VISIBILITY}
> = createAction(
  ActionTypes.SET_MAP_CONTROL_VISIBILITY,
  (
    panelId: setMapControlVisibilityUpdaterAction['payload']['panelId'],
    show: setMapControlVisibilityUpdaterAction['payload']['show']
  ) => ({
    payload: {
      panelId,
      show
    }
  })
);

/** OPEN_DELETE_MODAL */
export type OpenDeleteModalUpdaterAction = {
  payload: string;
};
/**
 * Toggle active map control panel
 * @memberof uiStateActions
 * @param datasetId - `id` of the dataset to be deleted
 * @public
 */
export const openDeleteModal: (
  datasetId: OpenDeleteModalUpdaterAction['payload']
) => Merge<
  OpenDeleteModalUpdaterAction,
  {type: typeof ActionTypes.OPEN_DELETE_MODAL}
> = createAction(
  ActionTypes.OPEN_DELETE_MODAL,
  (datasetId: OpenDeleteModalUpdaterAction['payload']) => ({payload: datasetId})
);

/** ADD_NOTIFICATION */
export type AddNotificationUpdaterAction = {
  payload: object;
};
/**
 * Add a notification to be displayed.
 * Existing notification will be updated in case of matching id.
 * @memberof uiStateActions
 * @param notification - The `notification` object to be added or updated
 * @public
 */
export const addNotification: (
  notification: AddNotificationUpdaterAction['payload']
) => Merge<
  AddNotificationUpdaterAction,
  {
    type: typeof ActionTypes.ADD_NOTIFICATION;
  }
> = createAction(
  ActionTypes.ADD_NOTIFICATION,
  (notification: AddNotificationUpdaterAction['payload']) => ({payload: notification})
);

/** REMOVE_NOTIFICATION */
export type RemoveNotificationUpdaterAction = {
  payload: string;
};
/**
 * Remove a notification
 * @memberof uiStateActions
 * @param id - `id` of the notification to be removed
 * @public
 */
export const removeNotification: (
  id: RemoveNotificationUpdaterAction['payload']
) => Merge<
  RemoveNotificationUpdaterAction,
  {type: typeof ActionTypes.REMOVE_NOTIFICATION}
> = createAction(
  ActionTypes.REMOVE_NOTIFICATION,
  (id: RemoveNotificationUpdaterAction['payload']) => ({payload: id})
);

/** SET_EXPORT_IMAGE_SETTING */
export type SetExportImageSettingUpdaterAction = {
  payload: Partial<ExportImage>;
};
/**
 * Set `exportImage` settings: ratio, resolution, legend
 * @memberof uiStateActions
 * @param newSetting - {ratio: '1x'}
 * @public
 */
export const setExportImageSetting: (
  newSetting: SetExportImageSettingUpdaterAction['payload']
) => Merge<
  SetExportImageSettingUpdaterAction,
  {type: typeof ActionTypes.SET_EXPORT_IMAGE_SETTING}
> = createAction(
  ActionTypes.SET_EXPORT_IMAGE_SETTING,
  (newSetting: SetExportImageSettingUpdaterAction['payload']) => ({payload: newSetting})
);

/**
 * Start exporting image flow
 * @memberof uiStateActions
 * @public
 */
export const startExportingImage: (options?: {
  ratio?: string;
  resolution?: string;
  legend?: string;
  center?: boolean;
}) => Merge<
  SetExportImageSettingUpdaterAction,
  {type: typeof ActionTypes.START_EXPORTING_IMAGE}
> = createAction(ActionTypes.START_EXPORTING_IMAGE, (payload: any) => ({payload}));

/** SET_EXPORT_IMAGE_DATA_URI */
export type SetExportImageDataUriUpdaterAction = {
  payload: string;
};
/**
 * Set `exportImage.setExportImageDataUri` to a dataUri
 * @memberof uiStateActions
 * @param dataUri - export image data uri
 * @public
 */
export const setExportImageDataUri: (
  dataUri: SetExportImageDataUriUpdaterAction['payload']
) => Merge<
  SetExportImageDataUriUpdaterAction,
  {type: typeof ActionTypes.SET_EXPORT_IMAGE_DATA_URI}
> = createAction(
  ActionTypes.SET_EXPORT_IMAGE_DATA_URI,
  (dataUri: SetExportImageDataUriUpdaterAction['payload']) => ({payload: dataUri})
);

/** SET_EXPORT_IMAGE_ERROR */
export type SetExportImageErrorUpdaterAction = {
  payload: Error;
};
/**
 * Set Export image error
 * @memberof uiStateActions
 * @public
 */
export const setExportImageError: (
  error: SetExportImageErrorUpdaterAction['payload']
) => Merge<
  SetExportImageErrorUpdaterAction,
  {type: typeof ActionTypes.SET_EXPORT_IMAGE_ERROR}
> = createAction(
  ActionTypes.SET_EXPORT_IMAGE_ERROR,
  (error: SetExportImageErrorUpdaterAction['payload']) => ({payload: error})
);

/**
 * Delete cached export image
 * @memberof uiStateActions
 * @public
 */
export const cleanupExportImage: () => {
  type: typeof ActionTypes.CLEANUP_EXPORT_IMAGE;
} = createAction(ActionTypes.CLEANUP_EXPORT_IMAGE);

/** SET_EXPORT_SELECTED_DATASET */
export type SetExportSelectedDatasetUpdaterAction = {
  payload: string;
};
/**
 * Set selected dataset for export
 * @memberof uiStateActions
 * @param datasetId - dataset id
 * @public
 */
export const setExportSelectedDataset: (
  datasetId: SetExportSelectedDatasetUpdaterAction['payload']
) => Merge<
  SetExportSelectedDatasetUpdaterAction,
  {type: typeof ActionTypes.SET_EXPORT_SELECTED_DATASET}
> = createAction(
  ActionTypes.SET_EXPORT_SELECTED_DATASET,
  (datasetId: SetExportSelectedDatasetUpdaterAction['payload']) => ({payload: datasetId})
);

/** SET_EXPORT_DATA_TYPE */
export type SetExportDataTypeUpdaterAction = {
  payload: string;
};
/**
 * Set data format for exporting data
 * @memberof uiStateActions
 * @param dataType - one of `'text/csv'`
 * @public
 */
export const setExportDataType: (
  dataType: SetExportDataTypeUpdaterAction['payload']
) => Merge<
  SetExportDataTypeUpdaterAction,
  {type: typeof ActionTypes.SET_EXPORT_DATA_TYPE}
> = createAction(
  ActionTypes.SET_EXPORT_DATA_TYPE,
  (dataType: SetExportDataTypeUpdaterAction['payload']) => ({payload: dataType})
);

/** SET_EXPORT_FILTERED */
export type SetExportFilteredUpdaterAction = {
  payload: boolean;
};
/**
 * Whether to export filtered data, `true` or `false`
 * @memberof uiStateActions
 * @param payload - set `true` to ony export filtered data
 * @public
 */
export const setExportFiltered: (
  exportFiltered: SetExportFilteredUpdaterAction['payload']
) => Merge<
  SetExportFilteredUpdaterAction,
  {type: typeof ActionTypes.SET_EXPORT_FILTERED}
> = createAction(
  ActionTypes.SET_EXPORT_FILTERED,
  (payload: SetExportFilteredUpdaterAction['payload']) => ({payload})
);

/**
 * Whether to including data in map config, toggle between `true` or `false`
 * @memberof uiStateActions
 * @public
 */
export const setExportData: () => {type: typeof ActionTypes.SET_EXPORT_DATA} = createAction(
  ActionTypes.SET_EXPORT_DATA
);

/** SET_USER_MAPBOX_ACCESS_TOKEN */
export type SetUserMapboxAccessTokenUpdaterAction = {
  payload: string;
};
/**
 * Whether we export a mapbox access token used to create a single map html file
 * @memberof uiStateActions
 * @param payload - mapbox access token
 * @public
 */
export const setUserMapboxAccessToken: (
  payload: SetUserMapboxAccessTokenUpdaterAction['payload']
) => Merge<
  SetUserMapboxAccessTokenUpdaterAction,
  {type: typeof ActionTypes.SET_USER_MAPBOX_ACCESS_TOKEN}
> = createAction(
  ActionTypes.SET_USER_MAPBOX_ACCESS_TOKEN,
  (payload: SetUserMapboxAccessTokenUpdaterAction['payload']) => ({payload})
);

/** SET_EXPORT_MAP_FORMAT */
export type SetExportMapFormatUpdaterAction = {
  payload: string;
};
/**
 * Set the export map format (html, json)
 * @memberOf uiStateActions
 * @param payload - map format
 * @public
 */
export const setExportMapFormat: (
  mapFormat: SetExportMapFormatUpdaterAction['payload']
) => Merge<
  SetExportMapFormatUpdaterAction,
  {type: typeof ActionTypes.SET_EXPORT_MAP_FORMAT}
> = createAction(
  ActionTypes.SET_EXPORT_MAP_FORMAT,
  (payload: SetExportMapFormatUpdaterAction['payload']) => ({payload})
);

/** SET_EXPORT_MAP_HTML_MODE */
export type SetExportHTMLMapModeUpdaterAction = {
  payload: string;
};
/**
 * Set the HTML mode to use to export HTML mode
 * @memberOf uiStateActions
 * @param payload - map mode
 */
export const setExportHTMLMapMode: (
  mode: SetExportHTMLMapModeUpdaterAction['payload']
) => Merge<
  SetExportHTMLMapModeUpdaterAction,
  {type: typeof ActionTypes.SET_EXPORT_MAP_HTML_MODE}
> = createAction(
  ActionTypes.SET_EXPORT_MAP_HTML_MODE,
  (payload: SetExportHTMLMapModeUpdaterAction['payload']) => ({payload})
);

/** SET_LOCALE */
export type SetLocaleUpdaterAction = {
  payload: {locale: string};
};
/**
 * Set `locale` value
 * @memberof uiStateActions
 * @param locale - locale of the UI
 * @public
 */
export const setLocale: (
  locale: SetLocaleUpdaterAction['payload']['locale']
) => Merge<SetLocaleUpdaterAction, {type: typeof ActionTypes.SET_LOCALE}> = createAction(
  ActionTypes.SET_LOCALE,
  (locale: SetLocaleUpdaterAction['payload']['locale']) => ({
    payload: {
      locale
    }
  })
);

/** TOGGLE_LAYER_PANEL_LIST_VIEW */
export type ToggleLayerPanelListViewAction = {
  payload: string;
};
/**
 * Toggle layer panel list view
 * @memberof uiStateActions
 * @param listView layer panel listView value. Can be 'list' or 'sortByDataset'
 * @public
 */
export const toggleLayerPanelListView: (
  listView: ToggleLayerPanelListViewAction['payload']
) => Merge<
  ToggleLayerPanelListViewAction,
  {type: typeof ActionTypes.TOGGLE_LAYER_PANEL_LIST_VIEW}
> = createAction(
  ActionTypes.TOGGLE_LAYER_PANEL_LIST_VIEW,
  (listView: ToggleLayerPanelListViewAction['payload']) => ({payload: listView})
);

/**
 * This declaration is needed to group actions in docs
 */
/**
 * Actions handled mostly by  `uiState` reducer.
 * They manage UI changes in tha app, such as open and close side panel,
 * switch between tabs in the side panel, open and close modal dialog for exporting data / images etc.
 * It also manges which settings are selected during image and map export
 *
 * @public
 */
/* eslint-disable no-unused-vars */
// @ts-ignore
const uiStateActions = null;
/* eslint-enable no-unused-vars */
