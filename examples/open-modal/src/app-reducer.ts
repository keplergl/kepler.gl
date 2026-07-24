// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {createAction, handleActions} from 'redux-actions';

// CONSTANTS
export const INIT = 'INIT';
export const SHOW_MODAL = 'SHOW_MODAL';

// ACTIONS
export const appInit = createAction(INIT);
export const showModal = createAction(SHOW_MODAL);

// INITIAL_STATE
const initialState: {appName: string; loaded: boolean; modal: unknown} = {
  appName: 'example',
  loaded: false,
  modal: null
};

// REDUCER
const appReducer = handleActions(
  {
    [INIT]: (state: any) => ({
      ...state,
      loaded: true
    }),

    [SHOW_MODAL]: (state: any, action: any) => ({
      ...state,
      modal: action.payload
    })
  },
  initialState
);

export default appReducer;
