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

import keplerGlReducer from 'reducers';
import {registerEntry, resetMapConfig, receiveMapConfig} from 'actions';
import {createAction, handleActions} from 'redux-actions';

it('keplerGlReducer.initialState', () => {
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
  expect(test1ReducerInitialState.test.visState.layerClasses).toEqual([]);
  expect(test1ReducerInitialState.test.mapStyle.styleType).toBe('light');
  expect(test1ReducerInitialState.test.visState.initialState).toEqual({layerClasses: []});
  expect(test1ReducerInitialState.test.mapStyle.initialState).toEqual({styleType: 'light'});

  // change it
  const newConfig = {
    visState: {layerBlending: 'additive'},
    mapStyle: {styleType: 'beautiful'}
  };

  const modifiedReducer = test1Reducer(test1ReducerInitialState, receiveMapConfig(newConfig));
  expect(modifiedReducer.test.visState.layerBlending).toBe('additive');
  expect(modifiedReducer.test.mapStyle.styleType).toBe('beautiful');
  expect(modifiedReducer.test.visState.initialState).toEqual({layerClasses: []});

  // reset reducer
  const restTestReducer = test1Reducer(modifiedReducer, resetMapConfig());
  expect(restTestReducer.test.visState.layerClasses).toEqual([]);
  expect(restTestReducer.test.mapStyle.styleType).toBe('light');
  expect(restTestReducer.test.visState.initialState).toEqual({layerClasses: []});
  expect(restTestReducer.test.mapStyle.initialState).toEqual({styleType: 'light'});
});

it('keplerGlReducer.initialState.2', () => {
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

  expect(test2InitialState.test2.visState.layerClasses).toEqual([]);
  expect(test2InitialState.test2.mapStyle.styleType).toBe('smoothie');
  expect(test2InitialState.test2.mapStyle.hello).toBe('kitty');
  expect(test2InitialState.test2.mapState.dragRotate).toBe(true);

  // change it
  const newConfig2 = {
    visState: {layerBlending: 'subtractive'},
    mapStyle: {styleType: 'earth'}
  };

  const modifiedReducer2 = test2Reducer(test2InitialState, receiveMapConfig(newConfig2));

  expect(modifiedReducer2.test2.visState.layerBlending).toEqual('subtractive');
  expect(modifiedReducer2.test2.mapStyle.styleType).toBe('earth');
  expect(modifiedReducer2.test2.visState.initialState).toEqual({layerClasses: []});

  // reset reducer
  const restTestReducer2 = test2Reducer(modifiedReducer2, resetMapConfig());
  expect(restTestReducer2.test2.visState.layerClasses).toEqual([]);
  expect(restTestReducer2.test2.mapStyle.styleType).toBe('smoothie');
  expect(restTestReducer2.test2.mapState.dragRotate).toBe(true);
  expect(restTestReducer2.test2.visState.initialState).toEqual({layerClasses: []});
  expect(restTestReducer2.test2.mapStyle.initialState).toEqual({styleType: 'smoothie', hello: 'kitty'});
});

it('keplerGlReducer.plugin', () => {
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
  expect(updatedState.test3.uiState.readOnly).toBe(!previousValue);

  // dispatch action 2
  const updatedState2 = testReducer(testInitialState, hideMapControls());
  expect(updatedState2.test3.uiState.mapControls).toBe(hiddenMapControl);
});
