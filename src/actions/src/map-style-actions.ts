// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {createAction} from '@reduxjs/toolkit';
import {default as ActionTypes} from './action-types';
import {
  InputStyle,
  MapStyles,
  Merge,
  RGBColor,
  MapState,
  VisibleLayerGroups,
  LayerGroup
} from '@kepler.gl/types';

/**
 * Add map style from user input to reducer and set it to current style
 * This action is called when user click confirm after putting in a valid style url in the custom map style dialog.
 * It should not be called from outside kepler.gl without a valid `inputStyle` in the `mapStyle` reducer.
 * param {void}
 * @memberof mapStyleActions
 * @public
 */
export const addCustomMapStyle: () => {
  type: typeof ActionTypes.ADD_CUSTOM_MAP_STYLE;
} = createAction(ActionTypes.ADD_CUSTOM_MAP_STYLE);

export type RemoveCustomMapStyleUpdaterAction = {
  payload: {
    id: string;
  };
};

/**
 * Edit map style from user input to reducer.
 * This action is called when user clicks confirm after editing an existing custom style in the custom map style dialog.
 * It should not be called from outside kepler.gl without a valid `inputStyle` in the `mapStyle` reducer.
 * param {void}
 * @memberof mapStyleActions
 * @public
 */
export const editCustomMapStyle: () => {
  type: typeof ActionTypes.EDIT_CUSTOM_MAP_STYLE;
} = createAction(ActionTypes.EDIT_CUSTOM_MAP_STYLE);

/**
 * Remove a custom map style from `state.mapStyle.mapStyles`.
 * @param id
 * @memberof mapStyleActions
 * @public
 */
export const removeCustomMapStyle: ({
  id
}: RemoveCustomMapStyleUpdaterAction['payload']) => Merge<
  RemoveCustomMapStyleUpdaterAction,
  {type: typeof ActionTypes.REMOVE_CUSTOM_MAP_STYLE}
> = createAction(ActionTypes.REMOVE_CUSTOM_MAP_STYLE, ({id}) => {
  return {
    payload: {
      id
    }
  };
});

/** INPUT_MAP_STYLE */
export type InputMapStyleUpdaterAction = {
  payload: {
    inputStyle: Partial<InputStyle>;
    mapState?: MapState;
  };
};
/**
 * Input a custom map style object
 * @memberof mapStyleActions
 * @param inputStyle
 * @param inputStyle.url - style url e.g. `'mapbox://styles/heshan/xxxxxyyyyzzz'`
 * @param inputStyle.id - style id e.g. `'custom_style_1'`
 * @param inputStyle.style - actual mapbox style json
 * @param inputStyle.label - style name
 * @param inputStyle.accessToken - mapbox access token
 * @param inputStyle.icon - icon image data url
 * @param [mapState] - mapState is optional
 * @public
 */
export const inputMapStyle: (
  inputStyle: InputMapStyleUpdaterAction['payload']['inputStyle'],
  mapState?: InputMapStyleUpdaterAction['payload']['mapState']
) => Merge<InputMapStyleUpdaterAction, {type: typeof ActionTypes.INPUT_MAP_STYLE}> = createAction(
  ActionTypes.INPUT_MAP_STYLE,
  (
    inputStyle: InputMapStyleUpdaterAction['payload']['inputStyle'],
    mapState: InputMapStyleUpdaterAction['payload']['mapState']
  ) => ({
    payload: {
      inputStyle,
      mapState
    }
  })
);

/** MAP_CONFIG_CHANGE */
export type MapConfigChangeUpdaterAction = {
  payload: {
    visibleLayerGroups?: VisibleLayerGroups;
    topLayerGroups?: VisibleLayerGroups;
  };
};
/**
 * Update `visibleLayerGroups`to change layer group visibility
 * @memberof mapStyleActions
 * @param mapStyle new config `{visibleLayerGroups: {label: false, road: true, background: true}}`
 * @public
 */
export const mapConfigChange: (
  mapStyle: MapConfigChangeUpdaterAction['payload']
) => Merge<MapConfigChangeUpdaterAction, {type: typeof ActionTypes.MAP_CONFIG_CHANGE}> =
  createAction(
    ActionTypes.MAP_CONFIG_CHANGE,
    (mapStyle: MapConfigChangeUpdaterAction['payload']) => ({payload: mapStyle})
  );

type OnLoadMapStyleSuccessCallback = (payload: {styleType: string}) => any;

/** REQUEST_MAP_STYLES */
export type RequestMapStylesUpdaterAction = {
  payload: {
    mapStyles: {
      [key: string]: {
        id: string;
        label?: string;
        url: string;
        icon?: string;
        layerGroups?: LayerGroup[];
      };
    };
    onSuccess?: OnLoadMapStyleSuccessCallback;
  };
};
/**
 * Request map style style object based on style.url.
 * @memberof mapStyleActions
 * @public
 */
export const requestMapStyles: (
  mapStyles: RequestMapStylesUpdaterAction['payload']['mapStyles'],
  onSuccess?: RequestMapStylesUpdaterAction['payload']['onSuccess']
) => Merge<RequestMapStylesUpdaterAction, {type: typeof ActionTypes.REQUEST_MAP_STYLES}> =
  createAction(
    ActionTypes.REQUEST_MAP_STYLES,
    (
      mapStyles: RequestMapStylesUpdaterAction['payload']['mapStyles'],
      onSuccess?: RequestMapStylesUpdaterAction['payload']['onSuccess']
    ) => ({payload: {mapStyles, onSuccess}})
  );

/** LOAD_MAP_STYLES */
export type LoadMapStylesUpdaterAction = {
  payload: {
    newStyles: MapStyles;
    onSuccess?: OnLoadMapStyleSuccessCallback;
  };
};
/**
 * Callback when load map style success
 * @memberof mapStyleActions
 * @param newStyles a `{[id]: style}` mapping
 * @public
 */
export const loadMapStyles: (
  newStyles: LoadMapStylesUpdaterAction['payload']['newStyles'],
  onSuccess?: LoadMapStylesUpdaterAction['payload']['onSuccess']
) => Merge<LoadMapStylesUpdaterAction, {type: typeof ActionTypes.LOAD_MAP_STYLES}> = createAction(
  ActionTypes.LOAD_MAP_STYLES,
  (
    newStyles: LoadMapStylesUpdaterAction['payload']['newStyles'],
    onSuccess?: LoadMapStylesUpdaterAction['payload']['onSuccess']
  ) => ({payload: {newStyles, onSuccess}})
);

/** LOAD_MAP_STYLE_ERR */
export type LoadMapStyleErrUpdaterAction = {
  payload: {
    ids: string[];
    error: Error;
  };
};
/**
 * Callback when load map style error
 * @memberof mapStyleActions
 * @param ids
 * @param error
 * @public
 */
export const loadMapStyleErr: (
  ids: LoadMapStyleErrUpdaterAction['payload']['ids'],
  error: LoadMapStyleErrUpdaterAction['payload']['error']
) => Merge<LoadMapStyleErrUpdaterAction, {type: typeof ActionTypes.LOAD_MAP_STYLE_ERR}> =
  createAction(
    ActionTypes.LOAD_MAP_STYLE_ERR,
    (
      ids: LoadMapStyleErrUpdaterAction['payload']['ids'],
      error: LoadMapStyleErrUpdaterAction['payload']['error']
    ) => ({payload: {ids, error}})
  );

/** MAP_STYLE_CHANGE */
export type MapStyleChangeUpdaterAction = {
  payload: {
    styleType: string;
    onSuccess?: OnLoadMapStyleSuccessCallback;
  };
};
/**
 * Change to another map style. The selected style should already been loaded into `mapStyle.mapStyles`
 * @memberof mapStyleActions
 * @param styleType the style to change to
 * @param onSuccess optional success callback function when an asynchronous basemap syle has loaded
 * @public
 */
export const mapStyleChange: (
  styleType: MapStyleChangeUpdaterAction['payload']['styleType'],
  onSuccess?: MapStyleChangeUpdaterAction['payload']['onSuccess']
) => Merge<MapStyleChangeUpdaterAction, {type: typeof ActionTypes.MAP_STYLE_CHANGE}> = createAction(
  ActionTypes.MAP_STYLE_CHANGE,
  (
    styleType: MapStyleChangeUpdaterAction['payload']['styleType'],
    onSuccess?: MapStyleChangeUpdaterAction['payload']['onSuccess']
  ) => ({payload: {styleType, onSuccess}})
);

/** LOAD_CUSTOM_MAP_STYLE */
export type LoadCustomMapStyleUpdaterAction = {
  payload: {
    icon?: string;
    style?: object;
    error?: object | boolean;
  };
};
/**
 * Callback when a custom map style object is received
 * @memberof mapStyleActions
 * @param customMapStyle
 * @param customMapStyle.icon
 * @param customMapStyle.style
 * @param customMapStyle.error
 * @public
 */
export const loadCustomMapStyle: (
  customMapStyle: LoadCustomMapStyleUpdaterAction['payload']
) => Merge<LoadCustomMapStyleUpdaterAction, {type: typeof ActionTypes.LOAD_CUSTOM_MAP_STYLE}> =
  createAction(
    ActionTypes.LOAD_CUSTOM_MAP_STYLE,
    (customMapStyle: LoadCustomMapStyleUpdaterAction['payload']) => ({payload: customMapStyle})
  );

/** SET_3D_BUILDING_COLOR */
export type Set3dBuildingColorUpdaterAction = {
  payload: RGBColor;
};
// SET_3D_BUILDING_COLOR
/**
 * Set 3d building layer group color
 * @memberof mapStyleActions
 * @param color - [r, g, b]
 * @public
 */
export const set3dBuildingColor: (
  color: Set3dBuildingColorUpdaterAction['payload']
) => Merge<Set3dBuildingColorUpdaterAction, {type: typeof ActionTypes.SET_3D_BUILDING_COLOR}> =
  createAction(
    ActionTypes.SET_3D_BUILDING_COLOR,
    (color: Set3dBuildingColorUpdaterAction['payload']) => ({payload: color})
  );

/** SET_BACKGROUND_COLOR */
export type SetBackgroundColorUpdaterAction = {
  payload: RGBColor;
};

/**
 * Set background color
 * @memberof mapStyleActions
 * @param color - [r, g, b]
 * @public
 */
export const setBackgroundColor: (
  color: SetBackgroundColorUpdaterAction['payload']
) => Merge<SetBackgroundColorUpdaterAction, {type: typeof ActionTypes.SET_BACKGROUND_COLOR}> =
  createAction(ActionTypes.SET_BACKGROUND_COLOR, (color: RGBColor) => ({payload: color}));

/**
 * Actions handled mostly by  `mapStyle` reducer.
 * They manage the display of base map, such as loading and receiving base map styles,
 * hiding and showing map layers, user input of custom map style url.
 *
 * @public
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-ignore
const mapStyleActions = null;
/* eslint-enable @typescript-eslint/no-unused-vars */
