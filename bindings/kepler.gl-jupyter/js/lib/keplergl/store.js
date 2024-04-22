// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {applyMiddleware, compose, createStore} from 'redux';
import {combineReducers} from 'redux';
import {keplerGlReducer, enhanceReduxMiddleware} from '@kepler.gl/reducers';

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
