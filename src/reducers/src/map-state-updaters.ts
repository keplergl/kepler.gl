// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import geoViewport from '@mapbox/geo-viewport';
import booleanWithin from '@turf/boolean-within';
import bboxPolygon from '@turf/bbox-polygon';
import {fitBounds} from '@math.gl/web-mercator';
import deepmerge from 'deepmerge';
import pick from 'lodash.pick';

import {getCenterAndZoomFromBounds, validateBounds, MAPBOX_TILE_SIZE} from '@kepler.gl/utils';
import {MapStateActions, ReceiveMapConfigPayload, ActionTypes} from '@kepler.gl/actions';
import {MapState, Bounds, Viewport} from '@kepler.gl/types';

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

/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-ignore
const mapStateUpdaters = null;
/* eslint-enable @typescript-eslint/no-unused-vars */
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
 * @property minZoom: `undefined`,
 * @property maxZoom: `undefined`,
 * @property maxBounds: `undefined`,
 * @property isSplit: `false`,
 * @property isViewportSynced: `true`,
 * @property isZoomLocked: `false`,
 * @property splitMapViewports: `[]`
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
  minZoom: undefined,
  maxZoom: undefined,
  maxBounds: undefined,
  isSplit: false,
  isViewportSynced: true,
  isZoomLocked: false,
  splitMapViewports: []
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
  const {viewport, mapIndex = 0} = action.payload;

  if (state.isViewportSynced) {
    // The `updateViewport` function is typed as (Viewport, Viewport) -> Viewport but here the
    // expected typing is (MapState, Viewport) -> MapState.
    // this could be a potential bug as we treat Viewport and MapState as equal seemingly
    // @ts-expect-error Type 'Viewport' is missing the following properties from type 'MapState': isSplit, isViewportSynced, isZoomLocked, splitMapViewports
    return updateViewport(state, viewport);
  }

  let otherViewportMapIndex = -1;
  const splitMapViewports = state.splitMapViewports.map((currentViewport, i) => {
    if (i === mapIndex) {
      // update the matching viewport with the newViewport info in the action payload
      return updateViewport(currentViewport, viewport);
    }

    otherViewportMapIndex = i;
    // make no changes to the other viewport (yet)
    return currentViewport;
  });

  // make conditional updates to the other viewport not matching this payload's `mapIndex`
  if (Number.isFinite(otherViewportMapIndex) && otherViewportMapIndex > -1) {
    // width and height are a special case and are always updated
    splitMapViewports[otherViewportMapIndex] = {
      ...splitMapViewports[otherViewportMapIndex],
      width: splitMapViewports[mapIndex].width,
      height: splitMapViewports[mapIndex].height
    };

    if (state.isZoomLocked) {
      // update the other viewport with the new zoom from the split viewport that was updated with this payload's `mapIndex`
      splitMapViewports[otherViewportMapIndex] = {
        ...splitMapViewports[otherViewportMapIndex],
        zoom: splitMapViewports[mapIndex].zoom
      };
    }
  }

  return {
    // update the top-level mapState viewport with the most recently interacted-with split viewport
    // WHY? this avoids zoom and bounds "jumping" due to a "stale" top-level mapState viewport when:
    //  1. toggling off the unsynced viewports mode to switch to the synced viewports mode
    //  2. toggling on the zoom lock during an unsynced viewports mode
    ...state,
    ...splitMapViewports[mapIndex],
    // update the mapState with the new array of split viewports
    splitMapViewports
  };
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

  const newState = {
    ...state,
    latitude: centerAndZoom.center[1],
    longitude: centerAndZoom.center[0],
    // For marginal or invalid bounds, zoom may be NaN. Make sure to provide a valid value in order
    // to avoid corrupt state and potential crashes as zoom is expected to be a number
    ...(Number.isFinite(centerAndZoom.zoom) ? {zoom: centerAndZoom.zoom} : {})
  };

  // if fitting to bounds while split and unsynced
  // copy the new latitude, longitude, and zoom values to each split viewport
  if (newState.splitMapViewports.length) {
    newState.splitMapViewports = newState.splitMapViewports.map(currentViewport => ({
      ...currentViewport,
      latitude: newState.latitude,
      longitude: newState.longitude,
      zoom: newState.zoom
    }));
  }

  return newState;
};

/**
 * Toggle between 3d and 2d map.
 * @memberof mapStateUpdaters
 * @public
 */
export const togglePerspectiveUpdater = (state: MapState): MapState => {
  const newState = {
    ...state,
    ...{
      pitch: state.dragRotate ? 0 : 50,
      bearing: state.dragRotate ? 0 : 24
    },
    dragRotate: !state.dragRotate
  };

  // if toggling 3d and 2d while split and unsynced
  // copy the new pitch, bearing, and dragRotate values to each split viewport
  if (newState.splitMapViewports.length) {
    newState.splitMapViewports = newState.splitMapViewports.map(currentViewport => ({
      ...currentViewport,
      pitch: newState.pitch,
      bearing: newState.bearing,
      dragRotate: newState.dragRotate
    }));
  }

  return newState;
};

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
  /**
   * @type {Partial<MapState>}
   */
  const mapState = (config || {}).mapState || {};
  // merged received mapState with previous state
  // state also may include properties that are new to an existing, saved project's mapState

  let mergedState = deepmerge<MapState>(state, mapState, {
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
export const toggleSplitMapUpdater = (state: MapState): MapState => ({
  ...state,
  ...getMapDimForSplitMap(!state.isSplit, state),
  isSplit: !state.isSplit,
  ...(!state.isSplit === false
    ? {
        // if toggling to no longer split (single mode) then reset a few properties
        isViewportSynced: true,
        isZoomLocked: false,
        splitMapViewports: []
      }
    : {})
});

/**
 * Toggle between locked and unlocked split viewports
 * @memberof mapStateUpdaters
 * @public
 */
export const toggleSplitMapViewportUpdater = (
  state: MapState,
  action: MapStateActions.ToggleSplitMapViewportUpdaterAction
) => {
  // new map state immediately gets the new, optional payload values for isViewportSynced and/or isZoomLocked
  const newMapState = {
    ...state,
    ...(action.payload || {})
  };

  if (newMapState.isViewportSynced) {
    // switching from unsynced to synced viewports
    newMapState.splitMapViewports = [];
  } else {
    // switching from synced to unsynced viewports
    // or already in unsynced mode and toggling locked zoom

    if (state.isZoomLocked && !newMapState.isZoomLocked) {
      // switching off locked zoom while unsynced
      // don't copy the mapStates to left and right viewports because there will be zoom "jumping"
      return newMapState;
    }

    if (!state.isZoomLocked && newMapState.isZoomLocked) {
      // switching on locked zoom while unsynced
      // only copy zoom viewport property from the most recently interacted-with viewport to the other
      // TODO: do we want to check for a match a different way, such as a combo of `latitude` and `longitude`?
      const lastUpdatedViewportIndex = newMapState.splitMapViewports.findIndex(
        v => newMapState.zoom === v.zoom
      );

      const splitMapViewports = newMapState.splitMapViewports.map((currentViewport, i) => {
        if (i === lastUpdatedViewportIndex) {
          // no zoom to modify here
          return currentViewport;
        }
        // the other viewport gets the most recently interacted-with viewport's zoom
        // WHY? the viewport the user was last interacting with will set zoom across the board for smooth UX
        return {
          ...currentViewport,
          zoom: newMapState.splitMapViewports[lastUpdatedViewportIndex].zoom
        };
      });

      newMapState.splitMapViewports = splitMapViewports;

      return newMapState;
    }

    // if current viewport is synced, and we are unsyncing it
    // or already in unsynced mode and NOT toggling locked zoom
    // make a fresh copy of the current viewport object, assign it to splitMapViewports[]
    // pickViewportPropsFromMapState is called twice to avoid memory allocation conflicts
    const leftViewport = pickViewportPropsFromMapState(newMapState);
    const rightViewport = pickViewportPropsFromMapState(newMapState);
    newMapState.splitMapViewports = [leftViewport, rightViewport];
  }

  // return new state
  return newMapState;
};

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

export function pickViewportPropsFromMapState(state: MapState): Viewport {
  return pick(state, [
    'width',
    'height',
    'zoom',
    'pitch',
    'bearing',
    'latitude',
    'longitude',
    'dragRotate',
    'minZoom',
    'maxZoom',
    'maxBounds'
  ]);
}

/** Select items from object whose value is not undefined */
const definedProps = obj =>
  Object.entries(obj).reduce(
    (accu, [k, v]) => ({...accu, ...(v !== undefined ? {[k]: v} : {})}),
    {}
  );

function updateViewport(originalViewport: Viewport, viewportUpdates: Viewport): Viewport {
  let newViewport = {
    ...originalViewport,
    ...(definedProps(viewportUpdates) || {})
  };

  // Make sure zoom level doesn't go bellow minZoom if defined
  if (newViewport.minZoom && newViewport.zoom && newViewport.zoom < newViewport.minZoom) {
    newViewport.zoom = newViewport.minZoom;
  }
  // Make sure zoom level doesn't go above maxZoom if defined
  if (newViewport.maxZoom && newViewport.zoom && newViewport.zoom > newViewport.maxZoom) {
    newViewport.zoom = newViewport.maxZoom;
  }
  // Limit viewport update based on maxBounds
  if (newViewport.maxBounds && validateBounds(newViewport.maxBounds)) {
    // @ts-expect-error Type 'Viewport' is missing the following properties from type 'MapState': isSplit, isViewportSynced, isZoomLocked, splitMapViewports
    newViewport = updateViewportBasedOnBounds(originalViewport, newViewport);
  }

  return newViewport;
}
