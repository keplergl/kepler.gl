import ActionTypes from 'constants/action-types';
import {fitMapBounds} from './map-state';
import {closeAddDataModel} from './ui-state';
import {receiveVisData} from './vis-state-updaters';

// compose action to apply result multiple reducers, with the output of one

/**
 * Apply map bounds to mapState from received vis data
 * @param state
 * @param action
 * @returns {{visState, mapState: {latitude, longitude, zoom}}}
 */
const updateVisDataComposed = (state, action) => {
  const {visState, bounds} = receiveVisData(state.visState, action);
  return {
    ...state,
    visState,
    mapState: bounds ? fitMapBounds(state.mapState, {
      payload: bounds
    }) : state.mapState,
    uiState: closeAddDataModel(state.uiState)
  };
};

const compostedUpdaters = {
  [ActionTypes.UPDATE_VIS_DATA]: updateVisDataComposed
};

export default compostedUpdaters
