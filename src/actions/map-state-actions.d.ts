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
import {Bounds, Viewport} from '../reducers/map-state-updaters';

export type TogglePerspectiveUpdaterAction = {};
export function togglePerspective(): Merge<
  TogglePerspectiveUpdaterAction,
  {type: ActionTypes.TOGGLE_PERSPECTIVE}
>;

export type FitBoundsUpdaterAction = {payload: Bounds};
export function fitBounds(
  payload: Bounds
): Merge<FitBoundsUpdaterAction, {type: ActionTypes.FIT_BOUNDS}>;

export type UpdateMapUpdaterAction = {payload: Viewport};
export function updateMap(
  payload: Viewport
): Merge<UpdateMapUpdaterAction, {type: ActionTypes.UPDATE_MAP}>;

export type ToggleSplitMapUpdaterAction = {
  payload: number;
};
export function toggleSplitMap(
  payload: number
): Merge<ToggleSplitMapUpdaterAction, {type: ActionTypes.TOGGLE_SPLIT_MAP}>;
