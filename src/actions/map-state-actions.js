import {createAction} from 'redux-actions';
import ActionTypes from '../constants/action-types';

// second argument of createAction is expected
// to be payloadCreator or undefined
const [
  togglePerspective,
  fitBounds,
  updateMap,
  toggleSplitMap,
  toggleFullScreen
] = [
  ActionTypes.TOGGLE_PERSPECTIVE,
  ActionTypes.FIT_BOUNDS,
  ActionTypes.UPDATE_MAP,
  ActionTypes.TOGGLE_SPLIT_MAP,
  ActionTypes.TOGGLE_FULLSCREEN
].map(action => createAction(action));

export {
  updateMap,
  fitBounds,
  togglePerspective,
  toggleSplitMap,
  toggleFullScreen
};
