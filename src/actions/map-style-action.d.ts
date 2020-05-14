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

export function addCustomMapStyle(): {type: ActionTypes.ADD_CUSTOM_MAP_STYLE};

export function inputMapStyle(
  inputStyle,
  mapState
): {
  type: ActionTypes.INPUT_MAP_STYLE;
  payload: {
    inputStyle;
    mapState;
  };
};

export function mapConfigChange(
  mapStyle: object
): {type: ActionTypes.MAP_CONFIG_CHANGE; payload: object};

export function requestMapStyles(
  mapStyles: object
): {type: ActionTypes.REQUEST_MAP_STYLES; payload: object};

export function loadMapStyles(newStyles: {
  [id: string]: object;
}): {
  type: ActionTypes.LOAD_MAP_STYLES;
  payload: {[id: string]: object};
};

export function loadMapStyleErr(
  error: Error
): {type: ActionTypes.LOAD_MAP_STYLE_ERR; payload: Error};

export function mapStyleChange(
  styleType: string
): {type: ActionTypes.MAP_STYLE_CHANGE; payload: string};

export function loadCustomMapStyle(customMapStyle: {
  icon: string;
  style: object;
  error?: Error;
}): {
  type: ActionTypes.LOAD_CUSTOM_MAP_STYLE;
  payload: {icon: string; style: object; error?: Error};
};

export function set3dBuildingColor(
  color: [number, number, number]
): {
  type: ActionTypes.SET_3D_BUILDING_COLOR;
  payload: [number, number, number];
};
