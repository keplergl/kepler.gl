// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {createAction, handleActions} from 'redux-actions';

// CONSTANTS
export const INIT = 'INIT';

// ACTIONS
export const appInit = createAction(INIT);

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
    })
  },
  initialState
);

export default appReducer;
