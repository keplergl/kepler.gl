import ActionTypes from 'constants/action-types';
import {fitBoundsUpdater} from './map-state-updaters';
import {toggleModalUpdater} from './ui-state-updaters';
import {receiveMapConfigUpdater, updateVisDataUpdater} from './vis-state-updaters';
import {findMapBounds} from 'utils/data-utils';
// compose action to apply result multiple reducers, with the output of one

/**
 * Apply map bounds to mapState from received vis data
 * @param state
 * @param action
 * @returns {{visState, mapState: {latitude, longitude, zoom}}}
 */
const updateVisDataComposed = (state, action) => {
  // keep a copy of oldLayers
  const oldLayers = state.visState.layers.map(l => l.id);

  const visState = updateVisDataUpdater(state.visState, action);

  const defaultOptions = {centerMap: true};
  const options = {
    ...defaultOptions,
    ...action.options
  };

  let bounds;
  if (options.centerMap) {
    // find map bounds for new layers
    const newLayers = visState.layers.filter(l => !oldLayers.includes(l.id));
    bounds = findMapBounds(newLayers);
  }

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
