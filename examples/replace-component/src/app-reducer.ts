// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {createAction, handleActions} from 'redux-actions';
import KeplerGlSchema from '@kepler.gl/schemas';

// CONSTANTS
export const INIT = 'INIT';
export const SET_MAP_CONFIG = 'SET_MAP_CONFIG';

// ACTIONS
export const appInit = createAction(INIT);
export const setMapConfig = createAction(SET_MAP_CONFIG);

// INITIAL_STATE
const initialState = {
  appName: 'example',
  loaded: false
};

// REDUCER
const appReducer = handleActions(
  {
    [INIT]: state => ({
      ...state,
      loaded: true
    }),
    [SET_MAP_CONFIG]: (state, action) => ({
      ...state,
      mapConfig: KeplerGlSchema.getConfigToSave(action.payload)
    })
  },
  initialState
);

export default appReducer;
