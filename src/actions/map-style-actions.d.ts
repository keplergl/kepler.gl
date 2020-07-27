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

import ActionTypes from 'constants/action-types';
import {Merge, RGBColor} from '../reducers/types';
import {
  InputStyle,
  MapStyles,
  VisibleLayerGroups,
  MapStyles
} from '../reducers/map-style-updaters';
import {MapState} from '../reducers/map-state-updaters';

export function addCustomMapStyle(): {type: ActionTypes.ADD_CUSTOM_MAP_STYLE};

/** INPUT_MAP_STYLE */
export type InputMapStyleUpdaterAction = {
  payload: {
    inputStyle: Partial<InputStyle>;
    mapState?: MapState
  }
};

export function inputMapStyle(
  inputStyle: InputMapStyleUpdaterAction['payload']['inputStyle'],
  mapState?: InputMapStyleUpdaterAction['payload']['mapState']
): Merge<InputMapStyleUpdaterAction, {type: ActionTypes.INPUT_MAP_STYLE}>;

/** MAP_CONFIG_CHANGE */
export type MapConfigChangeUpdaterAction = {
  payload: {
    visibleLayerGroups?: VisibleLayerGroups;
    topLayerGroups?: VisibleLayerGroups;
  };
};

export function mapConfigChange(
  mapStyle: MapConfigChangeUpdaterAction['payload']
): Merge<MapConfigChangeUpdaterAction, {type: ActionTypes.MAP_CONFIG_CHANGE}>;

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
export function requestMapStyles(
  mapStyles: RequestMapStylesUpdaterAction['payload']
): Merge<RequestMapStylesUpdaterAction, {type: ActionTypes.REQUEST_MAP_STYLES}>;

/** LOAD_MAP_STYLES */
export type LoadMapStylesUpdaterAction = {
  payload: MapStyles;
};
export function loadMapStyles(
  newStyles: LoadMapStylesUpdaterAction['payload']
): Merge<LoadMapStylesUpdaterAction, {type: ActionTypes.LOAD_MAP_STYLES}>;

/** LOAD_MAP_STYLE_ERR */
export type LoadMapStyleErrUpdaterAction = {
  payload: Error;
};
export function loadMapStyleErr(
  error: LoadMapStyleErrUpdaterAction['payload']
): Merge<LoadMapStyleErrUpdaterAction, {type: ActionTypes.LOAD_MAP_STYLE_ERR}>;

/** MAP_STYLE_CHANGE */
export type MapStyleChangeUpdaterAction = {
  payload: string;
};
export function mapStyleChange(
  styleType: MapStyleChangeUpdaterAction['payload']
): Merge<MapStyleChangeUpdaterAction, {type: ActionTypes.MAP_STYLE_CHANGE}>;

/** LOAD_CUSTOM_MAP_STYLE */
export type LoadCustomMapStyleUpdaterAction = {
  payload: {
    icon?: string;
    style?: object;
    error?: Error;
  };
};
export function loadCustomMapStyle(
  customMapStyle: LoadCustomMapStyleUpdaterAction['payload']
): Merge<LoadCustomMapStyleUpdaterAction, {type: ActionTypes.LOAD_CUSTOM_MAP_STYLE}>;

/** SET_3D_BUILDING_COLOR */
export type Set3dBuildingColorUpdaterAction = {
  payload: RGBColor;
};
export function set3dBuildingColor(
  color: Set3dBuildingColorUpdaterAction['payload']
): Merge<Set3dBuildingColorUpdaterAction, {type: ActionTypes.SET_3D_BUILDING_COLOR}>;
