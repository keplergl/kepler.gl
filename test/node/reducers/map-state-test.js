// Copyright (c) 2021 Uber Technologies, Inc.
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

import test from 'tape';

import {updateMap, togglePerspective, fitBounds, toggleSplitMap} from 'actions/map-state-actions';

import {receiveMapConfig} from 'actions/actions';

import reducer, {mapStateReducerFactory} from 'reducers/map-state';
import {INITIAL_MAP_STATE} from 'reducers/map-state-updaters';

const InitialMapState = reducer(undefined, {});
test('#mapStateReducer', t => {
  const newState = reducer(undefined, {});

  t.deepEqual(
    newState,
    {...INITIAL_MAP_STATE, initialState: {}},
    'should return the initial state'
  );

  t.end();
});

test('#mapStateReducerFactory', t => {
  const mapStateReducer = mapStateReducerFactory({dragRotate: true});
  const newState = mapStateReducer(undefined, {});

  t.deepEqual(
    newState,
    {...INITIAL_MAP_STATE, dragRotate: true, initialState: {dragRotate: true}},
    'should return the initial state'
  );

  t.end();
});

test('#mapStateReducer -> UPDATE_MAP', t => {
  const mapUpdate = {
    latitude: 24.123,
    longitude: 120.839,
    zoom: 2.3
  };
  const expectedState = {...InitialMapState, ...mapUpdate};

  const newState = reducer(undefined, updateMap(mapUpdate));

  t.deepEqual(newState, expectedState, 'should update map longitude and latitude');

  t.end();
});

test('#mapStateReducer -> TOGGLE_PERSPECTIVE', t => {
  const newState = reducer(undefined, {});
  t.equal(newState.dragRotate, false, 'dragRotate should default to false');

  const newState2 = reducer(undefined, togglePerspective());
  t.equal(newState2.dragRotate, true, 'dragRotate toggle should set it to true');
  t.equal(newState2.pitch, 50, 'pitch should set to default');
  t.equal(newState2.bearing, 24, 'bearing should set to default');

  const newState3 = reducer(newState2, togglePerspective());
  t.equal(newState3.dragRotate, false, 'dragRotate 2nd toggle should set it to false');
  t.equal(newState3.pitch, 0, 'pitch should set to zero');
  t.equal(newState3.bearing, 0, 'bearing should set to zero');

  t.end();
});

test('#mapStateReducer -> FIT_BOUNDS', t => {
  // default input and output in @mapbox/geo-viewport
  // https://github.com/mapbox/geo-viewport

  const bounds = [5.668343999999995, 45.111511000000014, 5.852471999999996, 45.26800200000002];

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

  t.equal(updatedState.latitude, expected.center[1], 'should fit latitude');
  t.equal(updatedState.longitude, expected.center[0], 'should fit longitude');
  t.equal(updatedState.zoom, expected.zoom, 'should fit zoom');

  t.end();
});

test('#mapStateReducer -> FIT_BOUNDS.invalid', t => {
  // default input and output in @mapbox/geo-viewport
  // https://github.com/mapbox/geo-viewport

  const mapUpdate = {
    width: 640,
    height: 480
  };

  const stateWidthMapDimension = reducer(undefined, updateMap(mapUpdate));
  const updatedState = reducer(stateWidthMapDimension, fitBounds(null));
  t.equal(updatedState, stateWidthMapDimension, 'should not update state when bounds is invalid');
  const updatedState2 = reducer(stateWidthMapDimension, fitBounds([500, -100, 322, 9]));
  t.equal(updatedState2, stateWidthMapDimension, 'should not update state when bounds is invalid');

  t.end();
});

test('#mapStateReducer -> SPLIT_MAP: toggle', t => {
  let newState = reducer(INITIAL_MAP_STATE, toggleSplitMap());

  const expectedState = {
    ...INITIAL_MAP_STATE,
    isSplit: true,
    width: 400
  };

  // validate the first split
  t.deepEqual(newState, expectedState, 'should validate toggle split view');

  // go back to single view
  newState = reducer(newState, toggleSplitMap());
  t.deepEqual(newState, INITIAL_MAP_STATE, 'should validate toggle back from split view');

  t.end();
});

test('#mapStateReducer -> SPLIT_MAP: upload mapState config to update split map state', t => {
  let state = {
    ...INITIAL_MAP_STATE,
    isSplit: true,
    width: 400
  };

  // cases:

  // 1. state split: true - isSplit: true
  // do nothing
  let newState = reducer(state, receiveMapConfig({mapState: {isSplit: true}}));
  t.deepEqual(
    newState,
    state,
    'setting isSplit to true when state is already split should not change the state'
  );

  // 2. state split: false - isSplit: false
  // do nothing
  state = {
    ...state,
    isSplit: false,
    width: 800
  };
  newState = reducer(state, receiveMapConfig({mapState: {isSplit: false}}));
  t.deepEqual(
    newState,
    state,
    'setting isSplit to false when state is not split should not change the state'
  );

  // 3. state split: true - isSplit: false
  // double width
  state = {
    ...state,
    isSplit: true,
    width: 400
  };
  newState = reducer(state, receiveMapConfig({mapState: {isSplit: false}}));
  t.deepEqual(
    newState,
    {
      ...state,
      width: 800,
      isSplit: false
    },
    'setting isSplit to false when state is already split should double width'
  );

  // 4. state split: false - isSplit: true
  // split width
  state = {
    ...state,
    isSplit: false,
    width: 800
  };
  newState = reducer(state, receiveMapConfig({mapState: {isSplit: true}}));
  t.deepEqual(
    newState,
    {
      ...state,
      width: 400,
      isSplit: true
    },
    'setting isSplit to true when state is already split should reduce width by half'
  );

  t.end();
});

test('#mapStateReducer -> SPLIT_MAP: close map at specific point', t => {
  let newState = reducer(INITIAL_MAP_STATE, toggleSplitMap());

  const expectedState = {
    ...INITIAL_MAP_STATE,
    isSplit: true,
    width: 400
  };

  // validate the first split
  t.deepEqual(newState, expectedState, 'should validate toggle split view');

  // go back to single view
  newState = reducer(newState, toggleSplitMap(1));
  t.deepEqual(newState, INITIAL_MAP_STATE, 'should validate toggle back from split view');

  t.end();
});
