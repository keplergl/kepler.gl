// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {combineReducers, createStore, applyMiddleware, compose} from 'redux';
import {routerReducer, routerMiddleware} from 'react-router-redux';
import {browserHistory} from 'react-router';
import {enhanceReduxMiddleware} from '@kepler.gl/reducers';
import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';
import keplerGlDuckdbPlugin, {KeplerGlDuckDbTable} from 'keplergl-duckdb-plugin';
import {initApplicationConfig} from '@kepler.gl/utils';

// initialize kepler application with duckdb plugin
initApplicationConfig({
  plugins: [keplerGlDuckdbPlugin],
  table: KeplerGlDuckDbTable
});

// eslint-disable-next-line no-unused-vars
import window from 'global/window';

import demoReducer from './reducers/index';

const reducers = combineReducers({
  demo: demoReducer,
  routing: routerReducer
});

export const middlewares = enhanceReduxMiddleware([thunk, routerMiddleware(browserHistory)]);

// eslint-disable-next-line no-process-env
if (NODE_ENV === 'local') {
  // Redux logger
  const logger = createLogger({
    collapsed: () => true // Collapse all actions for more compact log
  });
  middlewares.push(logger);
}

export const enhancers = [applyMiddleware(...middlewares)];

const initialState = {};

// eslint-disable-next-line prefer-const
let composeEnhancers = compose;

/**
 * comment out code below to enable Redux Devtools
 */

if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    actionsBlacklist: [
      '@@kepler.gl/MOUSE_MOVE',
      '@@kepler.gl/UPDATE_MAP',
      '@@kepler.gl/LAYER_HOVER'
    ]
  });
}

export default createStore(reducers, initialState, composeEnhancers(...enhancers));
