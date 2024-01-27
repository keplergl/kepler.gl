// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import { combineReducers } from 'redux';
import test from './test';
import app from './app';
// import analytics from './analytics';

export default combineReducers({
  test,
  app
  // analytics
});
