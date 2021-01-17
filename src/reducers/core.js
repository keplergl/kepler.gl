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

import {combineReducers} from 'redux';

import {visStateReducerFactory} from './vis-state';
import {mapStateReducerFactory} from './map-state';
import {mapStyleReducerFactory} from './map-style';
import {uiStateReducerFactory} from './ui-state';
import {providerStateReducerFactory} from './provider-state';

import composers from './composers';

/**
 * @type {typeof import('./core').combineReducers_}
 */
const combineReducers_ = combineReducers;

const combined = (initialState = {}) =>
  combineReducers_({
    visState: visStateReducerFactory(initialState.visState),
    mapState: mapStateReducerFactory(initialState.mapState),
    mapStyle: mapStyleReducerFactory(initialState.mapStyle),
    uiState: uiStateReducerFactory(initialState.uiState),
    providerState: providerStateReducerFactory(initialState.providerState)
  });

export const coreReducerFactory = (initialState = {}) => (state, action) => {
  if (composers[action.type]) {
    return composers[action.type](state, action);
  }
  return combined(initialState)(state, action);
};

export default coreReducerFactory();

/**
 * Connect subreducer `mapState`, used with `injectComponents`. Learn more at
 * [Replace UI Component](../advanced-usages/replace-ui-component.md#pass-custom-component-props)
 *
 * @param {*} reduxState
 * @public
 */
export const mapStateLens = reduxState => ({mapState: reduxState.mapState});

/**
 * Connect subreducer `mapStyle`, used with `injectComponents`. Learn more at
 * [Replace UI Component](../advanced-usages/replace-ui-component.md#pass-custom-component-props)
 *
 * @param {*} reduxState
 * @public
 */
export const mapStyleLens = reduxState => ({mapStyle: reduxState.mapStyle});

/**
 * Connect subreducer `visState`, used with `injectComponents`. Learn more at
 * [Replace UI Component](../advanced-usages/replace-ui-component.md#pass-custom-component-props)
 *
 * @param {*} reduxState
 * @public
 */
export const visStateLens = reduxState => ({visState: reduxState.visState});

/**
 * Connect subreducer `uiState`, used with `injectComponents`. Learn more at
 * [Replace UI Component](../advanced-usages/replace-ui-component.md#pass-custom-component-props)
 *
 * @param {*} reduxState
 * @public
 */
export const uiStateLens = reduxState => ({uiState: reduxState.uiState});

/**
 * Connect subreducer `providerState`, used with `injectComponents`. Learn more at
 * [Replace UI Component](../advanced-usages/replace-ui-component.md#pass-custom-component-props)
 *
 * @param {*} reduxState
 * @public
 */
export const providerStateLens = reduxState => ({providerState: reduxState.providerState});
