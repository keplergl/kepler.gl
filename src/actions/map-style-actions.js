// Copyright (c) 2018 Uber Technologies, Inc.
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

const {
  ADD_CUSTOM_MAP_STYLE,
  INPUT_MAP_STYLE,
  MAP_CONFIG_CHANGE,
  MAP_STYLE_CHANGE,
  LOAD_MAP_STYLES,
  LOAD_MAP_STYLE_ERR,
  LOAD_CUSTOM_MAP_STYLE
} = ActionTypes;

// second argument of createAction is expected to be payloadCreator or undefined
const [
  addCustomMapStyle,
  inputMapStyle,
  mapConfigChange,
  loadMapStyles,
  loadMapStyleErr,
  mapStyleChange,
  loadCustomMapStyle
] = [
  ADD_CUSTOM_MAP_STYLE,
  INPUT_MAP_STYLE,
  MAP_CONFIG_CHANGE,
  LOAD_MAP_STYLES,
  LOAD_MAP_STYLE_ERR,
  MAP_STYLE_CHANGE,
  LOAD_CUSTOM_MAP_STYLE
].map(a => createAction(a));

export {
  addCustomMapStyle,
  inputMapStyle,
  mapConfigChange,
  mapStyleChange,
  loadMapStyles,
  loadMapStyleErr,
  loadCustomMapStyle
};
