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

import {createAction} from 'redux-actions';
import ActionTypes from 'constants/action-types';

/**
 * Add map style from user input to reducer and set it to current style
 * This action is called when user click confirm after putting in a valid style url in the custom map style dialog.
 * It should not be called from outside kepler.gl without a valid `inputStyle` in the `mapStyle` reducer.
 * param {void}
 * @public
 */
export const addCustomMapStyle = createAction(
  ActionTypes.ADD_CUSTOM_MAP_STYLE,
);

/**
 * Add map style from user input to reducer and set it to current style
 * This action is called when user click confirm after putting in a valid style url in the custom map style dialog.
 * It should not be called from outside kepler.gl without a valid `inputStyle` in the `mapStyle` reducer.
 * param {void}
 * @public
 */
export const inputMapStyle = createAction(
  ActionTypes.INPUT_MAP_STYLE,
  inputStyle => inputStyle
);

export const mapConfigChange = createAction(
  ActionTypes.MAP_CONFIG_CHANGE,
  mapStyle => mapStyle
);

export const loadMapStyles = createAction(
  ActionTypes.LOAD_MAP_STYLES,
  newStyles => newStyles
);

export const loadMapStyleErr = createAction(
  ActionTypes.LOAD_MAP_STYLE_ERR,
  error => error
);

export const mapStyleChange = createAction(
  ActionTypes.MAP_STYLE_CHANGE,
  styleType => styleType
);

export const loadCustomMapStyle = createAction(
  ActionTypes.LOAD_CUSTOM_MAP_STYLE,
  customMapStyle => customMapStyle
);
