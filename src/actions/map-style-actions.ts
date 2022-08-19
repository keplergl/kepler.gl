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
import {Merge, RGBColor, MapState} from '@kepler.gl/types';
import {InputStyle, MapStyles, VisibleLayerGroups} from 'reducers/map-style-updaters';

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
) => Merge<
  MapConfigChangeUpdaterAction,
  {type: typeof ActionTypes.MAP_CONFIG_CHANGE}
> = createAction(
  ActionTypes.MAP_CONFIG_CHANGE,
  (mapStyle: MapConfigChangeUpdaterAction['payload']) => ({payload: mapStyle})
);

/** REQUEST_MAP_STYLES */
export type RequestMapStylesUpdaterAction = {
  payload: {
    [key: string]: {
      id: string;
      label?: string;
      url: string;
      icon?: string;
      layerGroups?: string;
    };
  };
};
/**
 * Request map style style object based on style.url.
 * @memberof mapStyleActions
 * @public
 */
export const requestMapStyles: (
  mapStyles: RequestMapStylesUpdaterAction['payload']
) => Merge<
  RequestMapStylesUpdaterAction,
  {type: typeof ActionTypes.REQUEST_MAP_STYLES}
> = createAction(
  ActionTypes.REQUEST_MAP_STYLES,
  (mapStyles: RequestMapStylesUpdaterAction['payload']) => ({payload: mapStyles})
);

/** LOAD_MAP_STYLES */
export type LoadMapStylesUpdaterAction = {
  payload: MapStyles;
};
/**
 * Callback when load map style success
 * @memberof mapStyleActions
 * @param newStyles a `{[id]: style}` mapping
 * @public
 */
export const loadMapStyles: (
  newStyles: LoadMapStylesUpdaterAction['payload']
) => Merge<
  LoadMapStylesUpdaterAction,
  {type: typeof ActionTypes.LOAD_MAP_STYLES}
> = createAction(
  ActionTypes.LOAD_MAP_STYLES,
  (newStyles: LoadMapStylesUpdaterAction['payload']) => ({payload: newStyles})
);

/** LOAD_MAP_STYLE_ERR */
export type LoadMapStyleErrUpdaterAction = {
  payload: Error;
};
/**
 * Callback when load map style error
 * @memberof mapStyleActions
 * @param error
 * @public
 */
export const loadMapStyleErr: (
  error: LoadMapStyleErrUpdaterAction['payload']
) => Merge<
  LoadMapStyleErrUpdaterAction,
  {type: typeof ActionTypes.LOAD_MAP_STYLE_ERR}
> = createAction(
  ActionTypes.LOAD_MAP_STYLE_ERR,
  (error: LoadMapStyleErrUpdaterAction['payload']) => ({payload: error})
);

/** MAP_STYLE_CHANGE */
export type MapStyleChangeUpdaterAction = {
  payload: string;
};
/**
 * Change to another map style. The selected style should already been loaded into `mapStyle.mapStyles`
 * @memberof mapStyleActions
 * @param styleType the style to change to
 * @public
 */
export const mapStyleChange: (
  styleType: MapStyleChangeUpdaterAction['payload']
) => Merge<
  MapStyleChangeUpdaterAction,
  {type: typeof ActionTypes.MAP_STYLE_CHANGE}
> = createAction(
  ActionTypes.MAP_STYLE_CHANGE,
  (styleType: MapStyleChangeUpdaterAction['payload']) => ({payload: styleType})
);

/** LOAD_CUSTOM_MAP_STYLE */
export type LoadCustomMapStyleUpdaterAction = {
  payload: {
    icon?: string;
    style?: object;
    error?: Error;
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
) => Merge<
  LoadCustomMapStyleUpdaterAction,
  {type: typeof ActionTypes.LOAD_CUSTOM_MAP_STYLE}
> = createAction(
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
) => Merge<
  Set3dBuildingColorUpdaterAction,
  {type: typeof ActionTypes.SET_3D_BUILDING_COLOR}
> = createAction(
  ActionTypes.SET_3D_BUILDING_COLOR,
  (color: Set3dBuildingColorUpdaterAction['payload']) => ({payload: color})
);

/**
 * Actions handled mostly by  `mapStyle` reducer.
 * They manage the display of base map, such as loading and receiving base map styles,
 * hiding and showing map layers, user input of custom map style url.
 *
 * @public
 */
/* eslint-disable no-unused-vars */
// @ts-ignore
const mapStyleActions = null;
/* eslint-enable no-unused-vars */
