// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import KeplerGlSchema from '@kepler.gl/schemas';

// CONSTANTS
export const INIT = 'INIT';
export const SET_MAP_CONFIG = 'SET_MAP_CONFIG';

// ACTIONS
export const appInit = () => ({type: INIT});
export const setMapConfig = payload => ({type: SET_MAP_CONFIG, payload});

// INITIAL_STATE
const initialState = {
  appName: 'example',
  loaded: false
};

// REDUCER
const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case INIT:
      return {...state, loaded: true};
    case SET_MAP_CONFIG:
      return {...state, mapConfig: KeplerGlSchema.getConfigToSave(action.payload)};
    default:
      return state;
  }
};

export default appReducer;
