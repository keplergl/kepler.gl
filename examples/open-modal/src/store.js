// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import keplerGlReducer, {enhanceReduxMiddleware} from '@kepler.gl/reducers';

import appReducer from './app-reducer';
import Window from 'global/window';

const reducers = combineReducers({
  keplerGl: keplerGlReducer,
  app: appReducer
});

const middlewares = enhanceReduxMiddleware([]);
const enhancers = [applyMiddleware(...middlewares)];

const initialState = {};

// add redux devtools
const composeEnhancers = Window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(reducers, initialState, composeEnhancers(...enhancers));
