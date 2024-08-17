// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {createAction} from '@reduxjs/toolkit';
import {default as ActionTypes} from './action-types';
import {Bounds, Merge, Viewport} from '@kepler.gl/types';

export type TogglePerspectiveUpdaterAction = void;
/**
 *
 * Toggle between 3d and 2d map.
 * @memberof mapStateActions
 * @public
 * @example
 * import {togglePerspective} from 'kepler.gl/actions';
 * this.props.dispatch(togglePerspective());
 */
export const togglePerspective: () => Merge<
  TogglePerspectiveUpdaterAction,
  {type: typeof ActionTypes.TOGGLE_PERSPECTIVE}
> = createAction(ActionTypes.TOGGLE_PERSPECTIVE);

export type FitBoundsUpdaterAction = {payload: Bounds};
/**
 * Fit map viewport to bounds
 * @memberof mapStateActions
 * @param {Array<Number>} bounds as `[lngMin, latMin, lngMax, latMax]`
 * @public
 * @example
 * import {fitBounds} from 'kepler.gl/actions';
 * this.props.dispatch(fitBounds([-122.23, 37.127, -122.11, 37.456]));
 */
export const fitBounds: (
  payload: Bounds
) => Merge<FitBoundsUpdaterAction, {type: typeof ActionTypes.FIT_BOUNDS}> = createAction(
  ActionTypes.FIT_BOUNDS,
  (bounds: Bounds) => ({payload: bounds})
);

export type UpdateMapUpdaterAction = {payload: {viewport: Viewport; mapIndex?: number}};
/**
 * Update map viewport
 * @memberof mapStateActions
 * @param {Object} viewport viewport object container one or any of these properties `width`, `height`, `latitude` `longitude`, `zoom`, `pitch`, `bearing`, `dragRotate`
 * @param {Number} [viewport.width] Width of viewport
 * @param {Number} [viewport.height] Height of viewport
 * @param {Number} [viewport.zoom] Zoom of viewport
 * @param {Number} [viewport.pitch] Camera angle in degrees (0 is straight down)
 * @param {Number} [viewport.bearing] Map rotation in degrees (0 means north is up)
 * @param {Number} [viewport.latitude] Latitude center of viewport on map in mercator projection
 * @param {Number} [viewport.longitude] Longitude Center of viewport on map in mercator projection
 * @param {boolean} [viewport.dragRotate] Whether to enable drag and rotate map into perspective viewport
 * @param {number} mapIndex Index of which map to update the viewport of
 * @public
 * @example
 * import {updateMap} from 'kepler.gl/actions';
 * this.props.dispatch(updateMap({latitude: 37.75043, longitude: -122.34679, width: 800, height: 1200}, 0));
 */

export const updateMap: (
  viewport: Viewport,
  mapIndex?: number
) => Merge<UpdateMapUpdaterAction, {type: typeof ActionTypes.UPDATE_MAP}> = createAction(
  ActionTypes.UPDATE_MAP,
  (viewport: Viewport, mapIndex?: number) => ({
    payload: {
      viewport,
      mapIndex
    }
  })
);

export type ToggleSplitMapUpdaterAction = {
  payload: number;
};
/**
 * Toggle between single map or split maps
 * @memberof mapStateActions
 * @param {Number} [index] index is provided, close split map at index
 * @public
 * @example
 * import {toggleSplitMap} from 'kepler.gl/actions';
 * this.props.dispatch(toggleSplitMap());
 */
export const toggleSplitMap: (
  payload: number
) => Merge<ToggleSplitMapUpdaterAction, {type: typeof ActionTypes.TOGGLE_SPLIT_MAP}> = createAction(
  ActionTypes.TOGGLE_SPLIT_MAP,
  (index: number) => ({payload: index})
);

export type ToggleSplitMapViewportUpdaterAction = {
  payload: {
    isViewportSynced?: boolean;
    isZoomLocked?: boolean;
  };
};

/**
 * For split maps, toggle between having (un)synced viewports and (un)locked zooms
 * @memberof mapStateActions
 * @param {Object} syncInfo
 * @param {boolean} [syncInfo.isViewportSynced] Are the 2 split maps having synced viewports?
 * @param {boolean} [syncInfo.isZoomLocked] If split, are the zooms locked to each other or independent?
 */
export const toggleSplitMapViewport: (payload: {
  isViewportSynced?: boolean;
  isZoomLocked?: boolean;
}) => Merge<
  ToggleSplitMapViewportUpdaterAction,
  {type: typeof ActionTypes.TOGGLE_SPLIT_MAP_VIEWPORT}
> = createAction(
  ActionTypes.TOGGLE_SPLIT_MAP_VIEWPORT,
  (syncInfo: ToggleSplitMapViewportUpdaterAction['payload']) => ({payload: syncInfo})
);

/**
 * This declaration is needed to group actions in docs
 */
/**
 * Actions handled mostly by  `mapState` reducer.
 * They manage map viewport update, toggle between 2d and 3d map,
 * toggle between single and split maps.
 *
 * @public
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-ignore
const mapStateActions = null;
/* eslint-enable @typescript-eslint/no-unused-vars */
