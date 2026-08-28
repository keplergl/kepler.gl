// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {combineReducers, createStore, applyMiddleware, compose} from 'redux';
import {enhanceReduxMiddleware} from '@kepler.gl/reducers';

import demoReducer from './reducers/index';

const reducers = combineReducers({
  demo: demoReducer
});

const middlewares = enhanceReduxMiddleware([]);
const enhancers = applyMiddleware(...middlewares);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(reducers, {}, composeEnhancers(enhancers));
