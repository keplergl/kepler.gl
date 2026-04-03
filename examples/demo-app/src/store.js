// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {combineReducers, createStore, applyMiddleware, compose} from 'redux';
import {routerReducer, routerMiddleware} from 'react-router-redux';
import {browserHistory} from 'react-router';
import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';

import {enhanceReduxMiddleware} from '@kepler.gl/reducers';

// eslint-disable-next-line no-unused-vars
import Window from 'global/window';

import demoReducer from './reducers/index';

const reducers = combineReducers({
  demo: demoReducer,
  routing: routerReducer
});

export const middlewares = enhanceReduxMiddleware([thunk, routerMiddleware(browserHistory)]);

const NOISY_ACTIONS = new Set(['@@kepler.gl/MOUSE_MOVE', '@@kepler.gl/LAYER_HOVER']);

// Set window.__KEPLER_LOG_FULL__ = true in the console to include
// high-frequency actions (MOUSE_MOVE, LAYER_HOVER, UPDATE_MAP).
if (NODE_ENV === 'local') {
  const logger = createLogger({
    collapsed: () => true,
    predicate: (_getState, action) => Window.__KEPLER_LOG_FULL__ || !NOISY_ACTIONS.has(action.type)
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

if (Window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
  composeEnhancers = Window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    actionsBlacklist: [...NOISY_ACTIONS]
  });
}

export default createStore(reducers, initialState, composeEnhancers(...enhancers));
