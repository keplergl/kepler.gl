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

import {
  updateMap,
  togglePerspective,
  fitBounds,
  toggleSplitMap
} from 'actions/map-state-actions';

import {receiveMapConfig} from 'actions/actions';

import reducer, {mapStateReducerFactory} from 'reducers/map-state';
import {INITIAL_MAP_STATE} from 'reducers/map-state-updaters';

const InitialMapState = reducer(undefined, {});
it('#mapStateReducer', () => {
  const newState = reducer(undefined, {});

  expect(newState).toEqual({...INITIAL_MAP_STATE, initialState: {}});
});

it('#mapStateReducerFactory', () => {
  const mapStateReducer = mapStateReducerFactory({dragRotate: true});
  const newState = mapStateReducer(undefined, {});

  expect(newState).toEqual({...INITIAL_MAP_STATE, dragRotate: true, initialState: {dragRotate: true}});
});

it('#mapStateReducer -> UPDATE_MAP', () => {
  const mapUpdate = {
    latitude: 24.123,
    longitude: 120.839,
    zoom: 2.3
  };
  const expectedState = {...InitialMapState, ...mapUpdate};

  const newState = reducer(undefined, updateMap(mapUpdate));

  expect(newState).toEqual(expectedState);
});

it('#mapStateReducer -> TOGGLE_PERSPECTIVE', () => {
  const newState = reducer(undefined, {});
  expect(newState.dragRotate).toBe(false);

  const newState2 = reducer(undefined, togglePerspective());
  expect(newState2.dragRotate).toBe(true);
  expect(newState2.pitch).toBe(50);
  expect(newState2.bearing).toBe(24);

  const newState3 = reducer(newState2, togglePerspective());
  expect(newState3.dragRotate).toBe(false);
  expect(newState3.pitch).toBe(0);
  expect(newState3.bearing).toBe(0);
});

it('#mapStateReducer -> FIT_BOUNDS', () => {
  // default input and output in @mapbox/geo-viewport
  // https://github.com/mapbox/geo-viewport

  const bounds = [
    5.668343999999995,
    45.111511000000014,
    5.852471999999996,
    45.26800200000002
  ];

  const mapUpdate = {
    width: 640,
    height: 480
  };

  const expected = {
    center: [5.7604079999999955, 45.189756500000016],
    zoom: 11
  };

  const stateWidthMapDimension = reducer(undefined, updateMap(mapUpdate));
  const updatedState = reducer(stateWidthMapDimension, fitBounds(bounds));

  expect(updatedState.latitude).toBe(expected.center[1]);
  expect(updatedState.longitude).toBe(expected.center[0]);
  expect(updatedState.zoom).toBe(expected.zoom);
});

it('#mapStateReducer -> SPLIT_MAP: toggle', () => {
  let newState = reducer(INITIAL_MAP_STATE, toggleSplitMap());

  const expectedState = {
    ...INITIAL_MAP_STATE,
    isSplit: true,
    width: 400
  };

  // validate the first split
  expect(newState).toEqual(expectedState);

  // go back to single view
  newState = reducer(newState, toggleSplitMap());
  expect(newState).toEqual(INITIAL_MAP_STATE);

});

it('#mapStateReducer -> SPLIT_MAP: upload mapState config to update split map state', () => {
  let state = {
    ...INITIAL_MAP_STATE,
    isSplit: true,
    width: 400
  };

  // cases:

  // 1. state split: true - isSplit: true
  // do nothing
  let newState = reducer(state, receiveMapConfig({mapState: {isSplit: true}}));
  expect(newState).toEqual(state);

  // 2. state split: false - isSplit: false
  // do nothing
  state = {
    ...state,
    isSplit: false,
    width: 800
  };
  newState = reducer(state, receiveMapConfig({mapState: {isSplit: false}}));
  expect(newState).toEqual(state);

  // 3. state split: true - isSplit: false
  // double width
  state = {
    ...state,
    isSplit: true,
    width: 400
  };
  newState = reducer(state, receiveMapConfig({mapState: {isSplit: false}}));
  expect(newState).toEqual({
    ...state,
    width: 800,
    isSplit: false
  });

  // 4. state split: false - isSplit: true
  // split width
  state = {
    ...state,
    isSplit: false,
    width: 800
  };
  newState = reducer(state, receiveMapConfig({mapState: {isSplit: true}}));
  expect(newState).toEqual({
    ...state,
    width: 400,
    isSplit: true
  });
});

it('#mapStateReducer -> SPLIT_MAP: close map at specific point', () => {
  let newState = reducer(INITIAL_MAP_STATE, toggleSplitMap());

  const expectedState = {
    ...INITIAL_MAP_STATE,
    isSplit: true,
    width: 400
  };

  // validate the first split
  expect(newState).toEqual(expectedState);

  // go back to single view
  newState = reducer(newState, toggleSplitMap(1));
  expect(newState).toEqual(INITIAL_MAP_STATE);
});
