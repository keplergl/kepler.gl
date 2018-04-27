// Copyright (c) 2019 Uber Technologies, Inc.
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

import {createAction} from 'redux-actions';
import ActionTypes from 'constants/action-types';

/**
 *
 * Toggle between 3d and 2d map.
 * @public
 * @example
 * import {togglePerspective} from 'kepler.gl/actions';
 * this.props.dispatch(togglePerspective());
 */
export const togglePerspective = createAction(
  ActionTypes.TOGGLE_PERSPECTIVE
);

/**
 * Fit map viewport to bounds
 * @param {number[]} - bounds as `[lngMin, latMin, lngMax, latMax]`
 * @public
 * @example
 * import {fitBounds} from 'kepler.gl/actions';
 * this.props.dispatch(fitBounds([-122.23, 37.127, -122.11, 37.456]));
 */
export const fitBounds =  createAction(
  ActionTypes.FIT_BOUNDS,
  bounds => bounds
);

/**
 * Update map viewport
 * @param {Object} viewport - viewport object container one or any of these properties `width`, `height`, `latitude` `longitude`, `zoom`, `pitch`, `bearing`, `dragRotate`
 * @param {number} [viewport.width] - Width of viewport
 * @param {number} [viewport.height] - Height of viewport
 * @param {number} [viewport.zoom] - Zoom of viewport
 * @param {number} [viewport.pitch] - Camera angle in degrees (0 is straight down)
 * @param {number} [viewport.bearing] - Map rotation in degrees (0 means north is up)
 * @param {number} [viewport.latitude] - Latitude center of viewport on map in mercator projection
 * @param {number} [viewport.longitude] - Longitude Center of viewport on map in mercator projection
 * @param {boolean} [viewport.dragRotate] - Whether to enable drag and rotate map into perspective viewport
 * @public
 * @example
 * import {updateMap} from 'kepler.gl/actions';
 * this.props.dispatch(updateMap({latitude: 37.75043, longitude: -122.34679, width: 800, height: 1200}));
 */
export const updateMap = createAction(
  ActionTypes.UPDATE_MAP,
  viewport => viewport
);

/**
 * Toggle between one or split maps
 * @public
 * @example
 * import {toggleSplitMap} from 'kepler.gl/actions';
 * this.props.dispatch(toggleSplitMap());
 */
export const toggleSplitMap = createAction(
  ActionTypes.TOGGLE_SPLIT_MAP
);
