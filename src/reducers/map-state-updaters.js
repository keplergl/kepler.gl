import geoViewport from '@mapbox/geo-viewport';

/* Updaters */
export const updateMapUpdater = (state, action) => ({
  ...state,
  ...(action.payload || {})
});

export const fitBoundsUpdater = (state, action) => {
  const bounds = action.payload;
  const {center, zoom} = geoViewport.viewport(bounds, [
    state.width,
    state.height
  ]);

  return {
    ...state,
    latitude: center[1],
    longitude: center[0],
    zoom
  };
};

export const togglePerspectiveUpdater = (state, action) => ({
  ...state,
  ...{
    pitch: state.dragRotate ? 0 : 50,
    bearing: state.dragRotate ? 0 : 24
  },
  dragRotate: !state.dragRotate
});

export const receiveMapConfigUpdater = (state, action) => {
  const {isSplit = false} = action.payload.mapState || {};

  return {
    ...state,
    ...(action.payload.mapState || {}),
    isSplit,
    ...(isSplit ? getMapDimForSplitMap(isSplit, state) : {})
  };
};

export const toggleSplitMapUpdater = (state, action) => ({
  ...state,
  isSplit: !state.isSplit,
  ...getMapDimForSplitMap(!state.isSplit, state)
});

export const toggleFullScreenUpdater = (state, action) => ({
  ...state,
  isFullScreen: !state.isFullScreen
});

export const closeMapAtIndexUpdater = (state, action) =>
  toggleSplitMapUpdater(state, action);

// Helpers
function getMapDimForSplitMap(isSplit, state) {
  return {
    width: isSplit ? state.width / 2 : state.width * 2
  };
}
