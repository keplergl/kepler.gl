import {handleActions} from 'redux-actions';
import ActionTypes from '../constants/action-types';

export const INITIAL_MAP_STATE = {
  pitch: 0,
  bearing: 0,
  latitude: 37.75043,
  longitude: -122.34679,
  zoom: 9,
  dragRotate: false,
  width: 800,
  height: 800,
  isSplit: false,
  isFullScreen: false
};

import {
  closeMapAtIndexUpdater,
  fitBoundsUpdater,
  receiveMapConfigUpdater,
  toggleFullScreenUpdater,
  togglePerspectiveUpdater,
  toggleSplitMapUpdater,
  updateMapUpdater
} from './map-state-updaters';

/* Reducer */
const mapStateReducer = handleActions(
  {
    [ActionTypes.UPDATE_MAP]: updateMapUpdater,
    [ActionTypes.FIT_BOUNDS]: fitBoundsUpdater,
    [ActionTypes.TOGGLE_PERSPECTIVE]: togglePerspectiveUpdater,
    [ActionTypes.RECEIVE_MAP_CONFIG]: receiveMapConfigUpdater,
    [ActionTypes.TOGGLE_SPLIT_MAP]: toggleSplitMapUpdater,
    [ActionTypes.CLOSE_MAP_AT_INDEX]: closeMapAtIndexUpdater,
    [ActionTypes.TOGGLE_FULLSCREEN]: toggleFullScreenUpdater
  },
  INITIAL_MAP_STATE
);

export default mapStateReducer;
