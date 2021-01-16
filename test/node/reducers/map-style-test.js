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
import {drainTasksForTesting, succeedTaskWithValues} from 'react-palm/tasks';

import reducer from 'reducers/map-style';
import {
  INITIAL_MAP_STYLE,
  loadMapStylesUpdater,
  getInitialInputStyle
} from 'reducers/map-style-updaters';
import {keplerGlInit, receiveMapConfig} from 'actions/actions';
import SchemaManager from 'schemas';
import {DEFAULT_MAP_STYLES, DEFAULT_MAPBOX_API_URL} from 'constants/default-settings';

// helpers
import {StateWCustomMapStyle} from 'test/helpers/mock-state';

const InitialMapStyle = reducer(undefined, {});

test('#mapStyleReducer', t => {
  const newState = reducer(undefined, {});

  t.deepEqual(
    newState,
    {
      ...INITIAL_MAP_STYLE,
      initialState: {}
    },
    'should return the initial map style'
  );

  t.end();
});

test('#mapStyleReducer -> INIT', t => {
  const initialState = reducer(InitialMapStyle, keplerGlInit());
  t.deepEqual(
    initialState,
    {
      ...INITIAL_MAP_STYLE,
      initialState: {}
    },
    'initialize map style with no argument'
  );

  const newState = reducer(
    InitialMapStyle,
    keplerGlInit({
      mapboxApiAccessToken: 'smoothies_secret_token',
      mapboxApiUrl: 'http://mydomain.com'
    })
  );

  t.deepEqual(
    newState,
    {
      ...INITIAL_MAP_STYLE,
      initialState: {},
      mapboxApiAccessToken: 'smoothies_secret_token',
      mapboxApiUrl: 'http://mydomain.com'
    },
    'initialize map style with mapboxApiAccessToken'
  );
  t.end();
});

test('#mapStyleReducer -> INIT & LOAD_MAP_STYLES', t => {
  const myMapStyle = {
    id: 'default dark v9',
    label: 'default dark v9',
    url: 'mapbox://styles/mapbox/dark-v9',
    icon: `images/light.png`,
    layerGroups: []
  };
  const newState = reducer(
    InitialMapStyle,
    keplerGlInit({
      mapboxApiAccessToken: 'smoothies_secret_token',
      mapStylesReplaceDefault: true
    })
  );

  t.deepEqual(
    newState,
    {
      ...INITIAL_MAP_STYLE,
      mapStyles: {},
      initialState: {},
      mapboxApiAccessToken: 'smoothies_secret_token',
      mapboxApiUrl: DEFAULT_MAPBOX_API_URL,
      mapStylesReplaceDefault: true
    },
    'initialize map style with mapboxApiAccessToken and mapStylesReplaceDefault; mapStyles empty'
  );

  const mapStyles = {
    [myMapStyle.id]: myMapStyle
  };

  const finalState = loadMapStylesUpdater(newState, {payload: mapStyles});

  t.deepEqual(
    finalState,
    {...newState, mapStyles},
    'user provided mapStyles are populated, defaults ignored'
  );

  t.end();
});

test('#mapStyleReducer -> RECEIVE_MAP_CONFIG', t => {
  const stateWithToken = reducer(
    InitialMapStyle,
    keplerGlInit({mapboxApiAccessToken: 'smoothies_secret_token'})
  );

  const stateToSave = StateWCustomMapStyle;

  // save state
  const savedState = SchemaManager.getConfigToSave(stateToSave);

  // load state
  const stateLoaded = SchemaManager.parseSavedConfig(savedState);

  const stateWithConfig = reducer(stateWithToken, receiveMapConfig(stateLoaded));

  const defaultMapStyles = DEFAULT_MAP_STYLES.reduce(
    (accu, st) => ({
      ...accu,
      [st.id]: st
    }),
    {}
  );

  const expectedStateWithConfig = {
    styleType: 'smoothie_the_cat',
    visibleLayerGroups: {label: true, road: true},
    topLayerGroups: {},
    mapStyles: {
      smoothie_the_cat: {
        accessToken: 'secret_token',
        custom: true,
        icon:
          'https://api.mapbox.com/styles/v1/shanhe/smoothie.the.cat/static/-122.3391,37.7922,9,0,0/400x300?access_token=secret_token&logo=false&attribution=false',
        id: 'smoothie_the_cat',
        label: 'Smoothie the Cat',
        url: 'mapbox://styles/shanhe/smoothie.the.cat'
      },
      ...defaultMapStyles
    },
    mapboxApiAccessToken: 'smoothies_secret_token',
    mapboxApiUrl: DEFAULT_MAPBOX_API_URL,
    mapStylesReplaceDefault: false,
    inputStyle: getInitialInputStyle(),
    threeDBuildingColor: [1, 2, 3],
    custom3DBuildingColor: true,
    initialState: {}
  };

  t.deepEqual(stateWithConfig, expectedStateWithConfig, 'should load saved map style config');

  const [task1, ...more] = drainTasksForTesting();

  t.equal(more.length, 0, 'should return 1 task');

  const expectedTask = {
    payload: [
      {
        id: 'smoothie_the_cat',
        url:
          'https://api.mapbox.com/styles/v1/shanhe/smoothie.the.cat?pluginName=Keplergl&access_token=secret_token'
      }
    ]
  };

  t.deepEqual(task1.payload, expectedTask.payload, 'should create task to load map styles');

  const resultState1 = reducer(
    stateWithConfig,
    succeedTaskWithValues(task1, [
      {id: 'smoothie_the_cat', style: {layers: [], name: 'smoothie_the_cat'}}
    ])
  );

  const expectedMapStyles = {
    smoothie_the_cat: {
      accessToken: 'secret_token',
      custom: true,
      icon:
        'https://api.mapbox.com/styles/v1/shanhe/smoothie.the.cat/static/-122.3391,37.7922,9,0,0/400x300?access_token=secret_token&logo=false&attribution=false',
      id: 'smoothie_the_cat',
      label: 'Smoothie the Cat',
      url: 'mapbox://styles/shanhe/smoothie.the.cat',
      style: {layers: [], name: 'smoothie_the_cat'},
      layerGroups: []
    },
    ...defaultMapStyles
  };

  const expectedMapStyleState = {
    styleType: 'smoothie_the_cat',
    visibleLayerGroups: {},
    topLayerGroups: {},
    mapStyles: expectedMapStyles,
    mapboxApiAccessToken: 'smoothies_secret_token',
    mapboxApiUrl: DEFAULT_MAPBOX_API_URL,
    mapStylesReplaceDefault: false,
    inputStyle: getInitialInputStyle(),
    threeDBuildingColor: [1, 2, 3],
    custom3DBuildingColor: true,
    initialState: {},
    bottomMapStyle: {layers: [], name: 'smoothie_the_cat'},
    topMapStyle: null,
    editable: 0
  };

  t.deepEqual(
    Object.keys(resultState1).sort(),
    Object.keys(expectedMapStyleState).sort(),
    'mapStyle state should have same keys'
  );

  Object.keys(resultState1).forEach(key => {
    t.deepEqual(
      resultState1[key],
      expectedMapStyleState[key],
      `should update state,${key} with loaded map styles`
    );
  });

  const savedConfig = SchemaManager.getConfigToSave({mapStyle: resultState1});
  const expectedSaved = {
    version: 'v1',
    config: {
      mapStyle: {
        styleType: 'smoothie_the_cat',
        topLayerGroups: {},
        visibleLayerGroups: {},
        threeDBuildingColor: [1, 2, 3],
        mapStyles: {
          smoothie_the_cat: {
            accessToken: 'secret_token',
            custom: true,
            icon:
              'https://api.mapbox.com/styles/v1/shanhe/smoothie.the.cat/static/-122.3391,37.7922,9,0,0/400x300?access_token=secret_token&logo=false&attribution=false',
            id: 'smoothie_the_cat',
            label: 'Smoothie the Cat',
            url: 'mapbox://styles/shanhe/smoothie.the.cat'
          }
        }
      }
    }
  };

  t.deepEqual(
    Object.keys(savedConfig).sort(),
    Object.keys(expectedSaved).sort(),
    'mapStyle state saved should have same keys'
  );

  Object.keys(savedConfig).forEach(key => {
    t.deepEqual(savedConfig[key], expectedSaved[key], `should save state.${key} with correctly`);
  });

  t.end();
});
