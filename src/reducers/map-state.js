import {handleActions} from 'redux-actions';
import geoViewport from '@mapbox/geo-viewport';
import {DIMENSIONS} from "../constants/default-settings";
import ActionTypes from '../constants/action-types';

const {
  UPDATE_MAP,
  FIT_BOUNDS,
  TOGGLE_PERSPECTIVE,
  RECEIVE_MAP_CONFIG,
  TOGGLE_SPLIT_MAP,
  CLOSE_MAP_AT_INDEX,
  TOGGLE_FULLSCREEN
} = ActionTypes;

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

/* Transition Functions */
const onMapViewportChange = (state, action) => ({
  ...state,
  ...(action.payload || {})
});

export const fitMapBounds = (state, action) => {
  const bounds = action.payload;
  const {center, zoom} = geoViewport.viewport(
    bounds, [state.width, state.height]);

  return {
    ...state,
    latitude: center[1],
    longitude: center[0],
    zoom
  };
};

const onTogglePerspective = (state, action) => ({
  ...state,
  ...{
    pitch: state.dragRotate ? 0 : 50,
    bearing: state.dragRotate ? 0 : 24
  },
  dragRotate: !state.dragRotate
});

const onLocationChange = (state, action) => {
  const {isSplit = false} = action.payload.mapState || {};

  return {
    ...state,
    ...(action.payload.mapState || {}),
    isSplit,
    ...(isSplit ? getMapDimForSplitMap(isSplit, state) : {})
  };
};

const onSplitMap = (state, action) => ({
  ...state,
  isSplit: !state.isSplit,
  ...getMapDimForSplitMap(!state.isSplit, state)
});

const onToggleFullScreen = (state, action) => ({
  ...state,
  isFullScreen: !state.isFullScreen,
  ...getMapDimForFullScreen(!state.isFullScreen, state)
});

/* Reducer */
const mapStateReducer = handleActions({
  [UPDATE_MAP]: onMapViewportChange,
  [FIT_BOUNDS]: fitMapBounds,
  [TOGGLE_PERSPECTIVE]: onTogglePerspective,
  [RECEIVE_MAP_CONFIG]: onLocationChange,
  [TOGGLE_SPLIT_MAP]: onSplitMap,
  [CLOSE_MAP_AT_INDEX]: onSplitMap,
  [TOGGLE_FULLSCREEN]: onToggleFullScreen
}, INITIAL_MAP_STATE);

// Helpers
function getMapDimForSplitMap(isSplit, state) {
  return {
    width: isSplit ? (state.width / 2) : (state.width * 2)
  }
}

function getMapDimForFullScreen(isFullScreen, state) {
  return {
    height: state.height
      + (DIMENSIONS.qbHeight + DIMENSIONS.headerHeight) * Number(isFullScreen)
      - (DIMENSIONS.qbHeight + DIMENSIONS.headerHeight) * Number(!isFullScreen)
  }
}

export default mapStateReducer;
