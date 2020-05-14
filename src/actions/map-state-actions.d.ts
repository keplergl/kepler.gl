// Copyright (c) 2020 Uber Technologies, Inc.
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

import ActionTypes from 'constants/action-types';
import {ValueOf, Merge} from '../reducers/types';

export type TogglePerspectiveUpdaterAction = {};
export function togglePerspective(): Merge<
  TogglePerspectiveUpdaterAction,
  {type: ActionTypes.TOGGLE_PERSPECTIVE}
>;

type FitBoundsUpdaterAction = {payload: readonly number[]};
export function fitBounds(
  payload: readonly number[]
): Merge<FitBoundsUpdaterAction, {type: ActionTypes.FIT_BOUNDS}>;

/** Width of viewport */
type Viewport = {
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
  dragRotate?: number;
};

type UpdateMapUpdaterAction = {payload: Viewport};
export function updateMap(
  payload: Viewport
): Merge<UpdateMapUpdaterAction, {type: ActionTypes.UPDATE_MAP}>;

type ToggleSplitMapUpdaterAction = {
  payload: number;
};
export function toggleSplitMap(
  payload: number
): Merge<ToggleSplitMapUpdaterAction, {type: ActionTypes.TOGGLE_SPLIT_MAP}>;
