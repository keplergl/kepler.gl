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

import {combineReducers, createStore, applyMiddleware, compose} from 'redux';
import {routerReducer} from 'react-router-redux';
import {taskMiddleware} from 'react-palm/tasks';
import thunk from 'redux-thunk';
import {routerMiddleware} from 'react-router-redux';
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
