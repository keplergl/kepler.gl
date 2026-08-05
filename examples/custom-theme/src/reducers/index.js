// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {combineReducers} from 'redux';

import keplerGlReducer from '@kepler.gl/reducers';

const initialAppState = {
  appName: 'example'
};

function appReducer(state = initialAppState, action) {
  switch (action.type) {
    case 'INIT':
      return {...state, loaded: true};
    default:
      return state;
  }
}

export default combineReducers({
  keplerGl: keplerGlReducer,
  app: appReducer
});
