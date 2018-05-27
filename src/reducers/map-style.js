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

import {handleActions} from 'redux-actions';

// Actions
import ActionTypes from 'constants/action-types';

import {
  inputMapStyleUpdater,
  mapConfigChangeUpdater,
  mapStyleChangeUpdater,
  loadMapStylesUpdater,
  loadMapStyleErrUpdater,
  receiveMapConfigUpdater,
  loadCustomMapStyleUpdater,
  addCustomMapStyleUpdater
} from './map-style-updaters';

// bedrock browserInit flattens our immutable object into a plain object
// we have to recreate the state after the app is loaded
const getDefaultState = () => {
  const visibleLayerGroups = {};
  const styleType = 'dark';
  const topLayerGroups = {};

  return {
    styleType,
    visibleLayerGroups,
    topLayerGroups,
    mapStyles: {},

    inputStyle: {
      accessToken: null,
      error: false,
      isValid: false,
      label: null,
      style: null,
      url: null
    }
  };
};

export const INITIAL_MAP_STYLE = getDefaultState();

const actionHandler = {
  [ActionTypes.INPUT_MAP_STYLE]: inputMapStyleUpdater,
  [ActionTypes.MAP_CONFIG_CHANGE]: mapConfigChangeUpdater,
  [ActionTypes.MAP_STYLE_CHANGE]: mapStyleChangeUpdater,
  [ActionTypes.LOAD_MAP_STYLES]: loadMapStylesUpdater,
  [ActionTypes.LOAD_MAP_STYLE_ERR]: loadMapStyleErrUpdater,
  [ActionTypes.RECEIVE_MAP_CONFIG]: receiveMapConfigUpdater,
  [ActionTypes.LOAD_CUSTOM_MAP_STYLE]: loadCustomMapStyleUpdater,
  [ActionTypes.ADD_CUSTOM_MAP_STYLE]: addCustomMapStyleUpdater
};

export const mapStyleReducerFactory = (initialState = {}) =>
  handleActions(actionHandler, {...INITIAL_MAP_STYLE, ...initialState, initialState});

export default mapStyleReducerFactory();
