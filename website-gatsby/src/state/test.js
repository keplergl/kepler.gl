// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// action creators

const TOGGLE_DARKMODE = 'TOGGLE_DARKMODE';

export const toggleDarkMode = () => ({
  type: TOGGLE_DARKMODE
});

// initial state

const initialState = {
  isDarkMode: false,
};

// reducer

export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_DARKMODE:
      return { ...state, isDarkMode: !state.isDarkMode };
    default:
      return state;
  }
};
