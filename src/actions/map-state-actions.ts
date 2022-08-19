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

import {createAction} from '@reduxjs/toolkit';
import {default as ActionTypes} from './action-types';
import {Bounds, Merge} from '@kepler.gl/types';
import {Viewport} from '../reducers/map-state-updaters';

export type TogglePerspectiveUpdaterAction = {};
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
) => Merge<
  FitBoundsUpdaterAction,
  {type: typeof ActionTypes.FIT_BOUNDS}
> = createAction(ActionTypes.FIT_BOUNDS, (bounds: Bounds) => ({payload: bounds}));

export type UpdateMapUpdaterAction = {payload: Viewport};
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
 * @public
 * @example
 * import {updateMap} from 'kepler.gl/actions';
 * this.props.dispatch(updateMap({latitude: 37.75043, longitude: -122.34679, width: 800, height: 1200}));
 */

export const updateMap: (
  payload: Viewport
) => Merge<
  UpdateMapUpdaterAction,
  {type: typeof ActionTypes.UPDATE_MAP}
> = createAction(ActionTypes.UPDATE_MAP, (viewport: Viewport) => ({payload: viewport}));

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
) => Merge<
  ToggleSplitMapUpdaterAction,
  {type: typeof ActionTypes.TOGGLE_SPLIT_MAP}
> = createAction(ActionTypes.TOGGLE_SPLIT_MAP, (index: number) => ({payload: index}));

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
/* eslint-disable no-unused-vars */
// @ts-ignore
const mapStateActions = null;
/* eslint-enable no-unused-vars */
