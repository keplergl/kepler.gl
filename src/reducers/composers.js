import ActionTypes from 'constants/action-types';
import {fitBoundsUpdater} from './map-state-updaters';
import {toggleModalUpdater} from './ui-state-updaters';
import {updateVisDataUpdater} from './vis-state-updaters';

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

const compostedUpdaters = {
  [ActionTypes.UPDATE_VIS_DATA]: updateVisDataComposed
};

export default compostedUpdaters;
