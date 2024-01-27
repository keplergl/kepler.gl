// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {handleActions} from 'redux-actions';
import {ActionTypes} from '@kepler.gl/actions';
import * as mapStateUpdaters from './map-state-updaters';

/**
 * Important: Do not rename `actionHandler` or the assignment pattern of property value.
 * It is used to generate documentation
 */
const actionHandler = {
  [ActionTypes.UPDATE_MAP]: mapStateUpdaters.updateMapUpdater,
  [ActionTypes.FIT_BOUNDS]: mapStateUpdaters.fitBoundsUpdater,
  [ActionTypes.TOGGLE_PERSPECTIVE]: mapStateUpdaters.togglePerspectiveUpdater,
  [ActionTypes.RECEIVE_MAP_CONFIG]: mapStateUpdaters.receiveMapConfigUpdater,
  [ActionTypes.RESET_MAP_CONFIG]: mapStateUpdaters.resetMapConfigUpdater,
  [ActionTypes.TOGGLE_SPLIT_MAP]: mapStateUpdaters.toggleSplitMapUpdater,
  [ActionTypes.TOGGLE_SPLIT_MAP_VIEWPORT]: mapStateUpdaters.toggleSplitMapViewportUpdater
};

/* Reducer */
export const mapStateReducerFactory = (initialState = {}) =>
  // @ts-expect-error
  handleActions(actionHandler, {
    ...mapStateUpdaters.INITIAL_MAP_STATE,
    ...initialState,
    initialState
  });

export default mapStateReducerFactory();
