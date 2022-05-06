// Copyright (c) 2023 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import geoViewport from '@mapbox/geo-viewport';
import booleanWithin from '@turf/boolean-within';
import bboxPolygon from '@turf/bbox-polygon';
import {fitBounds} from '@math.gl/web-mercator';
import deepmerge from 'deepmerge';

import {getCenterAndZoomFromBounds, validateBounds, MAPBOX_TILE_SIZE} from '@kepler.gl/utils';
import {MapStateActions, ReceiveMapConfigPayload, ActionTypes} from '@kepler.gl/actions';
import {MapState, Bounds} from '@kepler.gl/types';

/**
 * Updaters for `mapState` reducer. Can be used in your root reducer to directly modify kepler.gl's state.
 * Read more about [Using updaters](../advanced-usage/using-updaters.md)
 * @public
 * @example
 *
 * import keplerGlReducer, {mapStateUpdaters} from 'kepler.gl/reducers';
 * // Root Reducer
 * const reducers = combineReducers({
 *  keplerGl: keplerGlReducer,
 *  app: appReducer
 * });
 *
 * const composedReducer = (state, action) => {
 *  switch (action.type) {
 *    // click button to close side panel
 *    case 'CLICK_BUTTON':
 *      return {
 *        ...state,
 *        keplerGl: {
 *          ...state.keplerGl,
 *          foo: {
 *             ...state.keplerGl.foo,
 *             mapState: mapStateUpdaters.fitBoundsUpdater(
 *               mapState, {payload: [127.34, 31.09, 127.56, 31.59]]}
 *             )
 *          }
 *        }
 *      };
 *  }
 *  return reducers(state, action);
 * };
 *
 * export default composedReducer;
 */
/* eslint-disable no-unused-vars */
// @ts-ignore
const mapStateUpdaters = null;
/* eslint-enable no-unused-vars */

/**
 * Default initial `mapState`
 * @memberof mapStateUpdaters
 * @constant
 * @property pitch Default: `0`
 * @property bearing Default: `0`
 * @property latitude Default: `37.75043`
 * @property longitude Default: `-122.34679`
 * @property zoom Default: `9`
 * @property dragRotate Default: `false`
 * @property width Default: `800`
 * @property height Default: `800`
 * @property isSplit Default: `false`
 * @public
 */
export const INITIAL_MAP_STATE: MapState = {
  pitch: 0,
  bearing: 0,
  latitude: 37.75043,
  longitude: -122.34679,
  zoom: 9,
  dragRotate: false,
  width: 800,
  height: 800,
  isSplit: false,
  minZoom: undefined,
  maxZoom: undefined,
  maxBounds: undefined
};

/* Updaters */
/**
 * Update map viewport
 * @memberof mapStateUpdaters
 * @public
 */
export const updateMapUpdater = (
  state: MapState,
  action: MapStateActions.UpdateMapUpdaterAction
): MapState => {
  let newMapState = {
    ...state,
    ...(action.payload || {})
  };

  // Make sure zoom level doesn't go bellow minZoom if defined
  if (newMapState.minZoom && newMapState.zoom < newMapState.minZoom) {
    newMapState.zoom = newMapState.minZoom;
  }
  // Make sure zoom level doesn't go above maxZoom if defined
  if (newMapState.maxZoom && newMapState.zoom > newMapState.maxZoom) {
    newMapState.zoom = newMapState.maxZoom;
  }
  // Limit viewport update based on maxBounds
  if (newMapState.maxBounds && validateBounds(newMapState.maxBounds)) {
    newMapState = updateViewportBasedOnBounds(state, newMapState);
  }
  return newMapState;
};

/**
 * Fit map viewport to bounds
 * @memberof mapStateUpdaters
 * @public
 */
export const fitBoundsUpdater = (
  state: MapState,
  action: MapStateActions.FitBoundsUpdaterAction
): MapState => {
  const centerAndZoom = getCenterAndZoomFromBounds(action.payload, {
    width: state.width,
    height: state.height
  });
  if (!centerAndZoom) {
    // bounds is invalid
    return state;
  }

  return {
    ...state,
    latitude: centerAndZoom.center[1],
    longitude: centerAndZoom.center[0],
    // For marginal or invalid bounds, zoom may be NaN. Make sure to provide a valid value in order
    // to avoid corrupt state and potential crashes as zoom is expected to be a number
    ...(Number.isFinite(centerAndZoom.zoom) ? {zoom: centerAndZoom.zoom} : {})
  };
};

/**
 * Toggle between 3d and 2d map.
 * @memberof mapStateUpdaters
 * @public
 */
export const togglePerspectiveUpdater = (
  state: MapState,
  action: MapStateActions.TogglePerspectiveUpdaterAction
): MapState => ({
  ...state,
  ...{
    pitch: state.dragRotate ? 0 : 50,
    bearing: state.dragRotate ? 0 : 24
  },
  dragRotate: !state.dragRotate
});

/**
 * reset mapState to initial State
 * @memberof mapStateUpdaters
 * @public
 */
export const resetMapConfigUpdater = (state: MapState): MapState => ({
  ...INITIAL_MAP_STATE,
  ...state.initialState,
  initialState: state.initialState
});

// consider case where you have a split map and user wants to reset
/**
 * Update `mapState` to propagate a new config
 * @memberof mapStateUpdaters
 * @public
 */
export const receiveMapConfigUpdater = (
  state: MapState,
  {
    // @ts-expect-error
    payload: {config = {}, options = {}, bounds = null}
  }: {
    type?: typeof ActionTypes.RECEIVE_MAP_CONFIG;
    payload: ReceiveMapConfigPayload;
  }
): MapState => {
  const mapState: Partial<MapState> = (config || {}).mapState || {};
  // merged received mapState with previous state
  // state also may include properties that are new to an existing, saved project's mapState

  let mergedState = deepmerge(state, mapState, {
    // note: deepmerge by default will merge arrays by concatenating them
    // but we need to overwrite destination arrays with source arrays, if present
    // https://github.com/TehShrike/deepmerge#arraymerge-example-overwrite-target-array
    arrayMerge: (_destinationArray, sourceArray) => sourceArray
  });

  // if center map
  // center map will override mapState config
  if (options.centerMap && bounds) {
    mergedState = fitBoundsUpdater(mergedState, {
      payload: bounds
    });
  }

  return {
    ...mergedState,
    // update width if `isSplit` has changed
    ...getMapDimForSplitMap(mergedState.isSplit, state)
  };
};

/**
 * Toggle between one or split maps
 * @memberof mapStateUpdaters
 * @public
 */
export const toggleSplitMapUpdater = (
  state: MapState,
  action: MapStateActions.ToggleSplitMapUpdaterAction
): MapState => ({
  ...state,
  isSplit: !state.isSplit,
  ...getMapDimForSplitMap(!state.isSplit, state)
});

// Helpers
export function getMapDimForSplitMap(isSplit, state) {
  // cases:
  // 1. state split: true - isSplit: true
  // do nothing
  // 2. state split: false - isSplit: false
  // do nothing
  if (state.isSplit === isSplit) {
    return {};
  }

  const width =
    state.isSplit && !isSplit
      ? // 3. state split: true - isSplit: false
        // double width
        state.width * 2
      : // 4. state split: false - isSplit: true
        // split width
        state.width / 2;

  return {
    width
  };
}

function updateViewportBasedOnBounds(state: MapState, newMapState: MapState) {
  // Get the new viewport bounds
  const viewportBounds = geoViewport.bounds(
    [newMapState.longitude, newMapState.latitude],
    newMapState.zoom,
    [newMapState.width, newMapState.height],
    MAPBOX_TILE_SIZE
  );
  // Generate turf Polygon from bounds for comparison
  const viewportBoundsPolygon = bboxPolygon(viewportBounds);
  // @ts-ignore
  const newStateMaxBounds: Bounds = newMapState.maxBounds;
  // @ts-ignore
  const maxBoundsPolygon = bboxPolygon(newStateMaxBounds);

  // If maxBounds has changed reset the viewport to snap to bounds
  const hasMaxBoundsChanged =
    !state.maxBounds || !state.maxBounds.every((val, idx) => val === newStateMaxBounds[idx]);
  if (hasMaxBoundsChanged) {
    // Check if the newMapState viewport is within maxBounds
    if (!booleanWithin(viewportBoundsPolygon, maxBoundsPolygon)) {
      const {latitude, longitude, zoom} = fitBounds({
        width: newMapState.width,
        height: newMapState.width,
        bounds: [
          [newStateMaxBounds[0], newStateMaxBounds[1]],
          [newStateMaxBounds[2], newStateMaxBounds[3]]
        ]
      });

      newMapState = {
        ...newMapState,
        latitude,
        longitude,
        // For marginal or invalid bounds, zoom may be NaN. Make sure to provide a valid value in order
        // to avoid corrupt state and potential crashes as zoom is expected to be a number
        ...(Number.isFinite(zoom) ? {zoom} : {})
      };
    }
    return newMapState;
  }

  // Check if the newMapState viewport is within maxBounds
  if (!booleanWithin(viewportBoundsPolygon, maxBoundsPolygon)) {
    newMapState = {
      ...newMapState,
      longitude: state.longitude,
      latitude: state.latitude,
      zoom: state.zoom
    };
  }

  return newMapState;
}
