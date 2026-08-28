// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// CONSTANTS
export const INIT = 'INIT';

// INITIAL STATE
const initialState = {
  appName: 'example',
  loaded: false
};

// REDUCER
const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case INIT:
      return {...state, loaded: true};
    default:
      return state;
  }
};

export default appReducer;
