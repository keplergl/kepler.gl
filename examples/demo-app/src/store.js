// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {configureStore} from '@reduxjs/toolkit';
import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';
import {enhanceReduxMiddleware} from '@kepler.gl/reducers';
import demoReducer from './reducers/index';
import {NAVIGATE_TO} from './actions';

/**
 * Middleware to handle navigation actions
 * Uses window.location.href for navigation to support both internal and external URLs
 */
const navigationMiddleware = () => next => action => {
  if (action.type === NAVIGATE_TO && action.payload) {
    // Support both absolute and relative URLs
    const url = action.payload.startsWith('http')
      ? action.payload
      : `${window.location.origin}${action.payload}`;
    window.location.href = url;
  }
  return next(action);
};

const middlewares = enhanceReduxMiddleware([thunk, navigationMiddleware]);

if (NODE_ENV === 'local') {
  middlewares.push(
    createLogger({
      collapsed: true
    })
  );
}

export default configureStore({
  reducer: {
    demo: demoReducer
  },
  middleware: () => middlewares,
  devTools: true
});
