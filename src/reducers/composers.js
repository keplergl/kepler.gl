import ActionTypes from 'constants/action-types';
import {fitBoundsUpdater} from './map-state-updaters';
import {toggleModalUpdater} from './ui-state-updaters';
import {receiveMapConfigUpdater, updateVisDataUpdater} from './vis-state-updaters';

// compose action to apply result multiple reducers, with the output of one

/**
 * Apply map bounds to mapState from received vis data
 * @param state
 * @param action
 * @returns {{visState, mapState: {latitude, longitude, zoom}}}
 */
const updateVisDataComposed = (state, action) => {
  const {visState, bounds} = updateVisDataUpdater(state.visState, action);
  return {
    ...state,
    visState,
    mapState: bounds
      ? fitBoundsUpdater(state.mapState, {
          payload: bounds
        })
      : state.mapState,
    uiState: toggleModalUpdater(state.uiState, {payload: null})
  };
};

/**
 * Combine data and configuration update in a single action
 * @param state
 * @param action
 * @returns {{}}
 */
const updateVisDataAndConfigComposed = (state, action) => {
  const newCustomVisState = receiveMapConfigUpdater(state, {payload: {...action.appConfig}});

  const newState = {
    ...state,
    visState: newCustomVisState
  };

  return {
    ...newState,
    ...updateVisDataComposed(newState, {datasets: action.datasets})
  };
};

const compostedUpdaters = {
  [ActionTypes.UPDATE_VIS_DATA]: updateVisDataComposed,
  [ActionTypes.UPDATE_VIS_DATA_CONFIG]: updateVisDataAndConfigComposed
};

export default compostedUpdaters;
