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
 * @memberof mapStyleActions
 * @public
 */
export const addCustomMapStyle = createAction(
  ActionTypes.ADD_CUSTOM_MAP_STYLE,
);

/**
 * Input a custom map style object
 * @memberof mapStyleActions
 * @param {Object} inputStyle
 * @param {string} inputStyle.url - style url e.g. `'mapbox://styles/heshan/xxxxxyyyyzzz'`
 * @param {string} inputStyle.id - style url e.g. `'custom_style_1'`
 * @param {Object} inputStyle.style - actual mapbox style json
 * @param {string} inputStyle.name - style name
 * @param {Object} inputStyle.layerGroups - layer groups that can be used to set map layer visibility
 * @param {Object} inputStyle.icon - icon image data url
 * @public
 */
export const inputMapStyle = createAction(
  ActionTypes.INPUT_MAP_STYLE,
  inputStyle => inputStyle
);

/**
 * Update `visibleLayerGroups`to change layer group visibility
 * @memberof mapStyleActions
 * @param {Object} mapStyle new config `{visibleLayerGroups: {label: false, road: true, background: true}}`
 * @public
 */
export const mapConfigChange = createAction(
  ActionTypes.MAP_CONFIG_CHANGE,
  mapStyle => mapStyle
);

/**
 * Request map style style object based on style.url.
 * @memberof mapStyleActions
 * @param {Array<Object>} mapStyles
 * @public
 */
export const requestMapStyles = createAction(
  ActionTypes.REQUEST_MAP_STYLES,
  mapStyles => mapStyles
);
/**
 * Callback when load map style success
 * @memberof mapStyleActions
 * @param {Object} newStyles a `{[id]: style}` mapping
 * @public
 */
export const loadMapStyles = createAction(
  ActionTypes.LOAD_MAP_STYLES,
  newStyles => newStyles
);

/**
 * Callback when load map style error
 * @memberof mapStyleActions
 * @param {*} error
 * @public
 */
export const loadMapStyleErr = createAction(
  ActionTypes.LOAD_MAP_STYLE_ERR,
  error => error
);

/**
 * Change to another map style. The selected style should already been loaded into `mapStyle.mapStyles`
 * @memberof mapStyleActions
 * @param {string} styleType the style to change to
 * @public
 */
export const mapStyleChange = createAction(
  ActionTypes.MAP_STYLE_CHANGE,
  styleType => styleType
);

/**
 * Callback when a custom map style object is received
 * @memberof mapStyleActions
 * @param {Object} customMapStyle
 * @param {string} customMapStyle.icon
 * @param {Object} customMapStyle.style
 * @param {*} customMapStyle.error
 * @public
 */
export const loadCustomMapStyle = createAction(
  ActionTypes.LOAD_CUSTOM_MAP_STYLE,
  customMapStyle => customMapStyle
);

/**
 * Actions handled mostly by  `mapStyle` reducer.
 * They manage the display of base map, such as loading and receiving base map styles,
 * hiding and showing map layers, user input of custom map style url.
 *
 * @public
 */
/* eslint-disable no-unused-vars */
const mapStyleActions = null
/* eslint-enable no-unused-vars */
