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
import ActionTypes from 'constants/action-types';

export const INITIAL_MAP_STATE = {
  pitch: 0,
  bearing: 0,
  latitude: 38.922427,
  longitude: -77.029705,
  zoom: 12,
  dragRotate: false,
  width: 800,
  height: 800,
  isSplit: false
};

import {
  fitBoundsUpdater,
  receiveMapConfigUpdater,
  togglePerspectiveUpdater,
  toggleSplitMapUpdater,
  updateMapUpdater
} from './map-state-updaters';

const actionHandler = {
  [ActionTypes.UPDATE_MAP]: updateMapUpdater,
  [ActionTypes.FIT_BOUNDS]: fitBoundsUpdater,
  [ActionTypes.TOGGLE_PERSPECTIVE]: togglePerspectiveUpdater,
  [ActionTypes.RECEIVE_MAP_CONFIG]: receiveMapConfigUpdater,
  [ActionTypes.TOGGLE_SPLIT_MAP]: toggleSplitMapUpdater
};

/* Reducer */
export const mapStateReducerFactory = (initialState = {}) => handleActions(
  actionHandler,
  {...INITIAL_MAP_STATE, ...initialState, initialState}
);

export default mapStateReducerFactory();
