// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// CONSTANTS
export const INIT = 'INIT';
export const SHOW_MODAL = 'SHOW_MODAL';

// ACTIONS
export const appInit = () => ({type: INIT});
export const showModal = id => ({type: SHOW_MODAL, payload: id});

// INITIAL_STATE
const initialState = {
  appName: 'example',
  loaded: false,
  modal: null
};

// REDUCER
const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case INIT:
      return {...state, loaded: true};
    case SHOW_MODAL:
      return {...state, modal: action.payload};
    default:
      return state;
  }
};

export default appReducer;
