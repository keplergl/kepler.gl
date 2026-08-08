// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {combineReducers, createStore, applyMiddleware, compose} from 'redux';
import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';

import {enhanceReduxMiddleware} from '@kepler.gl/reducers';
import {getApplicationConfig} from '@kepler.gl/utils';

import demoReducer from './reducers/index';

const reducers = combineReducers({
  demo: demoReducer
});

export const middlewares = enhanceReduxMiddleware([thunk]);

// Actions suppressed at each log level. Each level is a superset of the one above.
// Set window.__KEPLER_LOG_FULL__ = true in the browser console to override and log everything.
const LEVEL1_ACTIONS = new Set([
  '@@kepler.gl/MOUSE_MOVE',
  '@@kepler.gl/LAYER_HOVER',
  '@@kepler.gl/SET_LOADING_INDICATOR',
  '@@openassistant/SET_MAP_BOUNDARY'
]);

const LEVEL2_ACTIONS = new Set([
  ...LEVEL1_ACTIONS,
  '@@kepler.gl/LOAD_MAP_STYLES',
  '@@kepler.gl/MAP_LOAD_STARTED',
  '@@kepler.gl/LAYER_VISUAL_CHANGE',
  '@@kepler.gl/UPDATE_MAP',
  '@@kepler.gl/ON_MAP_CLICK',
  '@@kepler.gl/FILTER_CHANGE'
]);

const SUPPRESSED_BY_LEVEL = [
  new Set(),          // 0 — log everything
  LEVEL1_ACTIONS,     // 1 — suppress UI noise (default)
  LEVEL2_ACTIONS      // 2 — suppress UI noise + map/layer chatter
];

if (NODE_ENV === 'local') {
  const level = getApplicationConfig().reduxLogLevel ?? 1;
  const suppressed = SUPPRESSED_BY_LEVEL[level] ?? LEVEL1_ACTIONS;

  const logger = createLogger({
    collapsed: () => true,
    predicate: (_getState, action) => window.__KEPLER_LOG_FULL__ || !suppressed.has(action.type)
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
  const level = getApplicationConfig().reduxLogLevel ?? 1;
  const suppressed = SUPPRESSED_BY_LEVEL[level] ?? LEVEL1_ACTIONS;
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    actionsBlacklist: [...suppressed]
  });
}

export default createStore(reducers, initialState, composeEnhancers(...enhancers));
