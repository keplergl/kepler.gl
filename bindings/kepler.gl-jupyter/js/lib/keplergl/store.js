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

import {applyMiddleware, compose, createStore} from 'redux';
import {combineReducers} from 'redux';
import {keplerGlReducer} from 'kepler.gl/reducers';

// TODO: remove this after added middleware to files
import {enhanceReduxMiddleware} from 'kepler.gl/middleware';

const customizedKeplerGlReducer = keplerGlReducer.initialState({
  uiState: {
    currentModal: null,
    activeSidePanel: null
  }
});

const reducers = combineReducers({
  // mount keplerGl reducer
  keplerGl: customizedKeplerGlReducer
});

const createAppStore = onChangeHandler => {
  const updatesMiddleware = store => next => action => {
    // exclude some actions
    // Call the next dispatch method in the middleware chain.

    /* eslint-disable callback-return */
    const returnValue = next(action);
    /* eslint-enable callback-return */

    // state after dispatch
    if (typeof onChangeHandler === 'function') {
      onChangeHandler(action, store);
    }

    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue;
  };

  const middlewares = enhanceReduxMiddleware([updatesMiddleware]);
  const enhancers = [applyMiddleware(...middlewares)];

  const store = createStore(reducers, {}, compose(...enhancers));

  return store;
};

export default createAppStore;
