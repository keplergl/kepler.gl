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

import ActionTypes from 'constants/action-types';
import {createAction} from 'redux-actions';

// create actions
const {ADD_DATA_TO_MAP, INIT, RECEIVE_MAP_CONFIG, RESET_MAP_CONFIG} = ActionTypes;

// kepler.gl actions accessible outside component
export * from './vis-state-actions';
export * from './ui-state-actions';
export * from './map-state-actions';
export * from './map-style-actions';

export * from './identity-actions';

export const [receiveMapConfig, resetMapConfig, keplerGlInit, addDataToMap] = [
  RECEIVE_MAP_CONFIG,
  RESET_MAP_CONFIG,
  INIT,
  ADD_DATA_TO_MAP
].map(a => createAction(a));
