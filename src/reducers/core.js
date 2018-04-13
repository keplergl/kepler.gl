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

import {combineReducers} from 'redux';

import {visStateReducerFactory} from './vis-state';
import {mapStateReducerFactory} from './map-state';
import {mapStyleReducerFactory} from './map-style';
import {uiStateReducerFactory} from './ui-state';

import composers from './composers';

const combined = (initialState = {}) =>
  combineReducers({
    visState: visStateReducerFactory(initialState.visState),
    mapState: mapStateReducerFactory(initialState.mapState),
    mapStyle: mapStyleReducerFactory(initialState.mapStyle),
    uiState: uiStateReducerFactory(initialState.uiState)
  });

export const coreReducerFactory = (initialState = {}) => (state, action) => {
  if (composers[action.type]) {
    return composers[action.type](state, action);
  }
  return combined(initialState)(state, action);
};

export default coreReducerFactory();

export const mapStateLens = reduxState => ({mapState: reduxState.mapState});
export const mapStyleLens = reduxState => ({mapStyle: reduxState.mapStyle});
export const visStateLens = reduxState => ({visState: reduxState.visState});
export const uiStateLens = reduxState => ({uiState: reduxState.uiState});
