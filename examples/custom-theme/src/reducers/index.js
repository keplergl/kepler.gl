// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import keplerGlReducer from '@kepler.gl/reducers';

import {INIT} from '../actions';

// INITIAL_APP_STATE
const initialAppState = {
  appName: 'example'
};

// App reducer
export const appReducer = handleActions(
  {
    [INIT]: state => ({
      ...state,
      loaded: true
    })
  },
  initialAppState
);

// export demoReducer to be combined in website app
export default combineReducers({
  // mount keplerGl reducer
  keplerGl: keplerGlReducer,
  app: appReducer
});
