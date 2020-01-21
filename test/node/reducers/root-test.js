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

import test from 'tape';
import keplerGlReducer from 'reducers';
import {registerEntry, resetMapConfig, receiveMapConfig, toggleSplitMap, toggleMapControl} from 'actions';
import {createAction, handleActions} from 'redux-actions';

test('keplerGlReducer.initialState', t => {

  const test1Reducer = keplerGlReducer
    .initialState({
      visState: {
        layerClasses: []
      },
      mapStyle: {
        styleType: 'light'
      }
    });

  const test1ReducerInitialState = test1Reducer(undefined, registerEntry({id: 'test'}));
  t.deepEqual(test1ReducerInitialState.test.visState.layerClasses, [], 'should override initialState');
  t.equal(test1ReducerInitialState.test.mapStyle.styleType, 'light', 'should override initialState');
  t.deepEqual(test1ReducerInitialState.test.visState.initialState, {layerClasses: []}, 'should save initialState');
  t.deepEqual(test1ReducerInitialState.test.mapStyle.initialState, {styleType: 'light'}, 'should save initialState');

  // change it
  const newConfig = {
    visState: {layerBlending: 'additive'},
    mapStyle: {styleType: 'beautiful'}
  };

  const modifiedReducer = test1Reducer(test1ReducerInitialState, receiveMapConfig(newConfig));
  t.deepEqual(modifiedReducer.test.visState.layerBlending, 'additive', 'should apply config');
  t.equal(modifiedReducer.test.mapStyle.styleType, 'beautiful', 'should apply config');
  t.deepEqual(modifiedReducer.test.visState.initialState, {layerClasses: []}, 'should save initialState');

  // reset reducer
  const restTestReducer = test1Reducer(modifiedReducer, resetMapConfig());
  t.deepEqual(restTestReducer.test.visState.layerClasses, [], 'should override initialState');
  t.equal(restTestReducer.test.mapStyle.styleType, 'light', 'should override initialState');
  t.deepEqual(restTestReducer.test.visState.initialState, {layerClasses: []}, 'should save initialState');
  t.deepEqual(restTestReducer.test.mapStyle.initialState, {styleType: 'light'}, 'should save initialState');

  t.end();
});

test('keplerGlReducer.initialState.2', t => {
  const test1Reducer = keplerGlReducer
  .initialState({
    visState: {
      layerClasses: []
    },
    mapStyle: {
      styleType: 'light'
    }
  });

  // call initialState one more time
  const test2Reducer = test1Reducer.initialState({
    mapStyle: {
      styleType: 'smoothie',
      hello: 'kitty'
    },
    mapState: {
      dragRotate: true
    }
  });

  const test2InitialState = test2Reducer(undefined, registerEntry({id: 'test2'}));

  t.deepEqual(test2InitialState.test2.visState.layerClasses, [], 'should keep previous initialState');
  t.equal(test2InitialState.test2.mapStyle.styleType, 'smoothie', 'should overide initialState');
  t.equal(test2InitialState.test2.mapStyle.hello, 'kitty', 'should provide initialState');
  t.equal(test2InitialState.test2.mapState.dragRotate, true, 'should provide initialState');

  // change it
  const newConfig2 = {
    visState: {layerBlending: 'subtractive'},
    mapStyle: {styleType: 'earth'}
  };

  const modifiedReducer2 = test2Reducer(test2InitialState, receiveMapConfig(newConfig2));

  t.deepEqual(modifiedReducer2.test2.visState.layerBlending, 'subtractive', 'should apply config');
  t.equal(modifiedReducer2.test2.mapStyle.styleType, 'earth', 'should apply config');
  t.deepEqual(modifiedReducer2.test2.visState.initialState, {layerClasses: []}, 'should save initialState');

  // reset reducer
  const restTestReducer2 = test2Reducer(modifiedReducer2, resetMapConfig());
  t.deepEqual(restTestReducer2.test2.visState.layerClasses, [], 'should reset initialState');
  t.equal(restTestReducer2.test2.mapStyle.styleType, 'smoothie', 'should reset initialState');
  t.equal(restTestReducer2.test2.mapState.dragRotate, true, 'should reset initialState');
  t.deepEqual(restTestReducer2.test2.visState.initialState, {layerClasses: []}, 'should save initialState');
  t.deepEqual(restTestReducer2.test2.mapStyle.initialState, {styleType: 'smoothie', hello: 'kitty'}, 'should save initialState');

  t.end();
});

test('keplerGlReducer.plugin', t => {
  // custom actions
  const hideAndShowSidePanel = createAction('HIDE_AND_SHOW_SIDE_PANEL');
  const hideMapControls = createAction('HIDE_MAP_CONTROLS');

  const hiddenMapControl = {
    visibleLayers: {
      show: false,
      active: false
    },
    mapLegend: {
      show: false,
      active: false
    },
    toggle3d: {
      show: false
    },
    splitMap: {
      show: false
    }
  };

  // plugin 2 actions
  const testReducer = keplerGlReducer
  // 1. as reducer map
  .plugin({
    'HIDE_AND_SHOW_SIDE_PANEL': (state, action) => ({
      ...state,
      uiState: {
        ...state.uiState,
        readOnly: !state.uiState.readOnly
      }
    }),
  })
  .plugin(handleActions({
    // 2. as reducer
    'HIDE_MAP_CONTROLS': (state, action) => ({
      ...state,
      uiState: {
        ...state.uiState,
        mapControls: hiddenMapControl
      }
    })
  }, {}));

  const testInitialState = testReducer(undefined, registerEntry({id: 'test3'}));
  const previousValue = testInitialState.test3.uiState.readOnly;

  // dispatch action
  const updatedState = testReducer(testInitialState, hideAndShowSidePanel());
  t.equal(updatedState.test3.uiState.readOnly, !previousValue, 'should call hideAndShowSidePanel');

  // dispatch action 2
  const updatedState2 = testReducer(testInitialState, hideMapControls());
  t.equal(updatedState2.test3.uiState.mapControls, hiddenMapControl, 'should call hideMapControls');

  t.end();
});

test('keplerGlReducer - splitMap and mapControl interaction', t => {
  // init kepler.gl root and instance
  let state = keplerGlReducer(undefined, registerEntry({id: 'test'}));

  state = keplerGlReducer(state, toggleMapControl('mapDraw'));

  t.equal(
    state.test.uiState.mapControls.mapDraw.active,
    true,
    'Map draw should now be active'
  );

  t.equal(
    state.test.uiState.mapControls.mapDraw.activeMapIndex,
    0,
    'Map draw split index should be 0'
  );

  state = keplerGlReducer(state, toggleMapControl('mapDraw'));

  t.equal(
    state.test.uiState.mapControls.mapDraw.active,
    false,
    'Map draw should now be non active'
  );

  state = keplerGlReducer(state, toggleSplitMap());

  t.equal(
    state.test.mapState.isSplit,
    true,
    'Should have split map'
  );

  state = keplerGlReducer(state, toggleMapControl('mapDraw', 1));

  t.equal(
    state.test.uiState.mapControls.mapDraw.active,
    true,
    'Split View - Map draw should now be active'
  );

  t.equal(
    state.test.uiState.mapControls.mapDraw.activeMapIndex,
    1,
    'Split View - Map draw split index should be 1'
  );

  t.end();
});
