// Copyright (c) 2022 Uber Technologies, Inc.
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

import {getCenterAndZoomFromBounds} from '../utils';
import * as MapStateActions from 'actions/map-state-actions';
import {ReceiveMapConfigPayload} from '../actions/actions';
import {ActionTypes} from 'actions';
import {MapState} from '@kepler.gl/types';

export type Bounds = [number, number, number, number];
/** Width of viewport */
export type Viewport = {
  /**  Width of viewport */
  width?: number;
  /**  Height of viewport */
  height?: number;
  /**  Zoom of viewport */
  zoom?: number;
  /**  Camera angle in degrees (0 is straight down) */
  pitch?: number;
  /**  Map rotation in degrees (0 means north is up) */
  bearing?: number;
  /**  Latitude center of viewport on map in mercator projection */
  latitude?: number;
  /**  Longitude Center of viewport on map in mercator projection */
  longitude?: number;
  /**  Whether to enable drag and rotate map into perspective viewport */
  dragRotate?: boolean;
};

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
  isSplit: false
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
): MapState => ({
  ...state,
  ...(action.payload || {})
});

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
  const {mapState} = config || {};

  // merged received mapstate with previous state
  let mergedState = {...state, ...mapState};

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
