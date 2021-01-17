// Copyright (c) 2021 Uber Technologies, Inc.
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
import ActionTypes from 'constants/action-types';
import * as mapStyleUpdaters from './map-style-updaters';

/**
 * Important: Do not rename `actionHandler` or the assignment pattern of property value.
 * It is used to generate documentation
 */
const actionHandler = {
  [ActionTypes.INIT]: mapStyleUpdaters.initMapStyleUpdater,
  [ActionTypes.INPUT_MAP_STYLE]: mapStyleUpdaters.inputMapStyleUpdater,
  [ActionTypes.MAP_CONFIG_CHANGE]: mapStyleUpdaters.mapConfigChangeUpdater,
  [ActionTypes.MAP_STYLE_CHANGE]: mapStyleUpdaters.mapStyleChangeUpdater,
  [ActionTypes.REQUEST_MAP_STYLES]: mapStyleUpdaters.requestMapStylesUpdater,
  [ActionTypes.LOAD_MAP_STYLES]: mapStyleUpdaters.loadMapStylesUpdater,
  [ActionTypes.LOAD_MAP_STYLE_ERR]: mapStyleUpdaters.loadMapStyleErrUpdater,
  [ActionTypes.RECEIVE_MAP_CONFIG]: mapStyleUpdaters.receiveMapConfigUpdater,
  [ActionTypes.LOAD_CUSTOM_MAP_STYLE]: mapStyleUpdaters.loadCustomMapStyleUpdater,
  [ActionTypes.ADD_CUSTOM_MAP_STYLE]: mapStyleUpdaters.addCustomMapStyleUpdater,
  [ActionTypes.RESET_MAP_CONFIG]: mapStyleUpdaters.resetMapConfigMapStyleUpdater,
  [ActionTypes.SET_3D_BUILDING_COLOR]: mapStyleUpdaters.set3dBuildingColorUpdater,
  [ActionTypes.RESET_MAP_CONFIG]: mapStyleUpdaters.resetMapConfigMapStyleUpdater
};

export const mapStyleReducerFactory = (initialState = {}) =>
  // @ts-ignore
  handleActions(actionHandler, {
    ...mapStyleUpdaters.INITIAL_MAP_STYLE,
    ...initialState,
    initialState
  });

export default mapStyleReducerFactory();
