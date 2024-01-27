// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {combineReducers, createStore, applyMiddleware, compose} from 'redux';
import {routerReducer, routerMiddleware} from 'react-router-redux';
import {taskMiddleware} from 'react-palm/tasks';
import thunk from 'redux-thunk';

import {browserHistory} from 'react-router';
import appReducer from './app';
import demoReducer from '../../../examples/demo-app/src/reducers';
import analyticsMiddleware from './analytics';

const initialState = {};
const reducers = {
  demo: demoReducer,
  app: appReducer,
  routing: routerReducer
};

const combinedReducers = combineReducers(reducers);

export const middlewares = [
  taskMiddleware,
  thunk,
  routerMiddleware(browserHistory),
  analyticsMiddleware
];

export const enhancers = [applyMiddleware(...middlewares)];

const composeEnhancers = compose;
// add redux devtools
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(combinedReducers, initialState, composeEnhancers(...enhancers));
