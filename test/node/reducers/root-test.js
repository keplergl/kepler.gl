// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import keplerGlReducer from '@kepler.gl/reducers';
import {
  registerEntry,
  resetMapConfig,
  receiveMapConfig,
  toggleSplitMap,
  toggleMapControl,
  layerTypeChange,
  addDataToMap,
  ActionTypes
} from '@kepler.gl/actions';
import {createAction, handleActions} from 'redux-actions';

test('keplerGlReducer.initialState', t => {
  const test1Reducer = keplerGlReducer.initialState({
    visState: {
      layerClasses: []
    },
    mapStyle: {
      styleType: 'light'
    }
  });

  const test1ReducerInitialState = test1Reducer(undefined, registerEntry({id: 'test'}));
  t.deepEqual(
    test1ReducerInitialState.test.visState.layerClasses,
    [],
    'should override initialState'
  );
  t.equal(
    test1ReducerInitialState.test.mapStyle.styleType,
    'light',
    'should override initialState'
  );
  t.deepEqual(
    test1ReducerInitialState.test.visState.initialState,
    {layerClasses: []},
    'should save initialState'
  );
  t.deepEqual(
    test1ReducerInitialState.test.mapStyle.initialState,
    {styleType: 'light'},
    'should save initialState'
  );

  // change it
  const newConfig = {
    visState: {layerBlending: 'additive'},
    mapStyle: {styleType: 'beautiful'}
  };

  const modifiedReducer = test1Reducer(test1ReducerInitialState, receiveMapConfig(newConfig));
  t.deepEqual(modifiedReducer.test.visState.layerBlending, 'additive', 'should apply config');
  t.equal(modifiedReducer.test.mapStyle.styleType, 'beautiful', 'should apply config');
  t.deepEqual(
    modifiedReducer.test.visState.initialState,
    {layerClasses: []},
    'should save initialState'
  );

  // reset reducer
  const restTestReducer = test1Reducer(modifiedReducer, resetMapConfig());
  t.deepEqual(restTestReducer.test.visState.layerClasses, [], 'should override initialState');
  t.equal(restTestReducer.test.mapStyle.styleType, 'light', 'should override initialState');
  t.deepEqual(
    restTestReducer.test.visState.initialState,
    {layerClasses: []},
    'should save initialState'
  );
  t.deepEqual(
    restTestReducer.test.mapStyle.initialState,
    {styleType: 'light'},
    'should save initialState'
  );

  t.end();
});

test('keplerGlReducer.initialState.2', t => {
  const test1Reducer = keplerGlReducer.initialState({
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

  t.deepEqual(
    test2InitialState.test2.visState.layerClasses,
    [],
    'should keep previous initialState'
  );
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
  t.deepEqual(
    modifiedReducer2.test2.visState.initialState,
    {layerClasses: []},
    'should save initialState'
  );

  // reset reducer
  const restTestReducer2 = test2Reducer(modifiedReducer2, resetMapConfig());
  t.deepEqual(restTestReducer2.test2.visState.layerClasses, [], 'should reset initialState');
  t.equal(restTestReducer2.test2.mapStyle.styleType, 'smoothie', 'should reset initialState');
  t.equal(restTestReducer2.test2.mapState.dragRotate, true, 'should reset initialState');
  t.deepEqual(
    restTestReducer2.test2.visState.initialState,
    {layerClasses: []},
    'should save initialState'
  );
  t.deepEqual(
    restTestReducer2.test2.mapStyle.initialState,
    {styleType: 'smoothie', hello: 'kitty'},
    'should save initialState'
  );

  t.end();
});

test('keplerGlReducer.initialState extrareducers', t => {
  const INITIAL_STATE = {
    panels: []
  };

  const insightReducer = handleActions(
    {
      ADD_PANEL_TO_SECTION: state => ({
        ...state,
        panels: ['first']
      })
    },
    INITIAL_STATE
  );

  const addPanelToSectionAction = createAction('ADD_PANEL_TO_SECTION');

  const test1Reducer = keplerGlReducer.initialState(
    {
      visState: {
        layerClasses: []
      },
      mapStyle: {
        styleType: 'light'
      }
    },
    {
      insightState: insightReducer
    }
  );

  const test1ReducerInitialState = test1Reducer(undefined, registerEntry({id: 'test'}));

  t.deepEqual(test1ReducerInitialState.test.insightState.panels, [], 'should have extra state');

  const actionModifiedState = test1Reducer(test1ReducerInitialState, addPanelToSectionAction());

  t.deepEqual(
    actionModifiedState.test.insightState.panels,
    ['first'],
    'should have modified panels'
  );

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
      HIDE_AND_SHOW_SIDE_PANEL: state => ({
        ...state,
        uiState: {
          ...state.uiState,
          readOnly: !state.uiState.readOnly
        }
      })
    })
    .plugin(
      handleActions(
        {
          // 2. as reducer
          HIDE_MAP_CONTROLS: state => ({
            ...state,
            uiState: {
              ...state.uiState,
              mapControls: hiddenMapControl
            }
          })
        },
        {}
      )
    );

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

test('keplerGlReducer.plugin override', t => {
  // custom actions
  const mockRawData = {
    fields: [
      {
        name: 'start_point_lat',
        id: 'start_point_lat',
        displayName: 'start_point_lat',
        type: 'real',
        fieldIdx: 0
      },
      {
        name: 'start_point_lng',
        id: 'start_point_lng',
        displayName: 'start_point_lng',
        type: 'real',
        fieldIdx: 2
      },
      {
        name: 'end_point_lat',
        id: 'end_point_lat',
        displayName: 'end_point_lat',
        type: 'real',
        fieldIdx: 3
      },
      {
        name: 'end_point_lng',
        id: 'end_point_lng',
        displayName: 'end_point_lng',
        type: 'real',
        fieldIdx: 4
      }
    ],
    rows: [
      [12.25, 37.75, 45.21, 100.12],
      [null, 35.2, 45.0, 21.3],
      [12.29, 37.64, 46.21, 99.127],
      [null, null, 33.1, 29.34]
    ]
  };

  const testReducer = keplerGlReducer
    // 1. as reducer map
    .plugin(
      {
        [ActionTypes.LAYER_TYPE_CHANGE]: state => {
          return {
            ...state,
            visState: {
              ...state.visState,
              // do the default behavior and update layerOrder to empty
              layerOrder: []
            }
          };
        }
      },
      {override: {[ActionTypes.LAYER_TYPE_CHANGE]: true}}
    );

  let nextState = testReducer(undefined, registerEntry({id: 'test3'}));

  nextState = testReducer(
    nextState,
    addDataToMap({
      datasets: {
        data: mockRawData,
        info: {
          id: 'foo'
        }
      }
    })
  );

  t.equal(nextState.test3.visState.layers.length, 4, 'Should have 4 layer');

  nextState = testReducer(nextState, layerTypeChange(nextState.test3.visState.layers[0], 'arc'));
  t.equal(
    nextState.test3.visState.layers[0].type,
    'point',
    'Should have not changed layer type to arc'
  );
  t.deepEqual(nextState.test3.visState.layerOrder, [], 'Should have changed layerOrder to empty');

  t.end();
});

test('keplerGlReducer - splitMap and mapControl interaction', t => {
  // init kepler.gl root and instance
  let state = keplerGlReducer(undefined, registerEntry({id: 'test'}));

  state = keplerGlReducer(state, toggleMapControl('mapDraw'));

  t.equal(state.test.uiState.mapControls.mapDraw.active, true, 'Map draw should now be active');

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

  t.equal(state.test.mapState.isSplit, true, 'Should have split map');

  t.equal(state.test.uiState.mapControls.mapLegend.active, true, 'Should open map legend');

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
