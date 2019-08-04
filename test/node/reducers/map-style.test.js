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

import {drainTasksForTesting, succeedTaskWithValues} from 'react-palm/tasks';

import reducer from 'reducers/map-style';
import {INITIAL_MAP_STYLE, loadMapStylesUpdater} from 'reducers/map-style-updaters';
import {keplerGlInit, receiveMapConfig} from 'actions/actions';
import SchemaManager from 'schemas';
import {DEFAULT_MAP_STYLES} from 'constants/default-settings';

// helpers
import {StateWCustomMapStyle} from 'test/helpers/mock-state';

const InitialMapStyle = reducer(undefined, {});

it('#mapStyleReducer', () => {
  const newState = reducer(undefined, {});

  expect(newState).toEqual({
      ...INITIAL_MAP_STYLE,
      initialState: {}
    });
});

it('#mapStyleReducer -> INIT', () => {
  const newState = reducer(
    InitialMapStyle,
    keplerGlInit({mapboxApiAccessToken: 'smoothies_secret_token'})
  );

  expect(newState).toEqual({
    ...INITIAL_MAP_STYLE,
    initialState: {},
    mapboxApiAccessToken: 'smoothies_secret_token',
    mapboxApiUrl: undefined
  });
});

it('#mapStyleReducer -> INIT & LOAD_MAP_STYLES', () => {
  const myMapStyle = {
    id    : 'default dark v9',
    label : 'default dark v9',
    url   : 'mapbox://styles/mapbox/dark-v9',
    icon  : `images/light.png`,
    layerGroups: []
  };

  const newState = reducer(
    InitialMapStyle,
    keplerGlInit({
      mapboxApiAccessToken: 'smoothies_secret_token',
      mapStylesReplaceDefault: true
    })
  );

  expect(newState).toEqual({
    ...INITIAL_MAP_STYLE,
    mapStyles: {},
    initialState: {},
    mapboxApiAccessToken: 'smoothies_secret_token',
    mapboxApiUrl: undefined,
    mapStylesReplaceDefault: true
  });

  const mapStyles = {
    [myMapStyle.id]: myMapStyle
  };

  const finalState = loadMapStylesUpdater(newState, { payload: mapStyles });

  expect(finalState).toEqual({...newState, mapStyles});
});

it('#mapStyleReducer -> RECEIVE_MAP_CONFIG', () => {
  const stateWithToken = reducer(
    InitialMapStyle,
    keplerGlInit({mapboxApiAccessToken: 'smoothies_secret_token'})
  );

  const stateToSave = StateWCustomMapStyle;

  // save state
  const savedState = SchemaManager.getConfigToSave(stateToSave);

  // load state
  const stateLoaded = SchemaManager.parseSavedConfig(savedState);

  const stateWithConfig = reducer(
    stateWithToken,
    receiveMapConfig(stateLoaded)
  );

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
        icon: 'data:image/png;base64,xyz',
        id: 'smoothie_the_cat',
        label: 'Smoothie the Cat',
        url: 'mapbox://styles/shanhe/smoothie.the.cat'
      },
      ...defaultMapStyles
    },
    mapboxApiAccessToken: 'smoothies_secret_token',
    mapboxApiUrl: undefined,
    mapStylesReplaceDefault: false,
    inputStyle: {
      accessToken: null,
      error: false,
      isValid: false,
      label: null,
      style: null,
      url: null,
      custom: true
    },
    threeDBuildingColor: [1, 2, 3],
    custom3DBuildingColor: true,
    initialState: {}
  };

  expect(stateWithConfig).toEqual(expectedStateWithConfig);

  const [task1, ...more] = drainTasksForTesting();

  expect(more.length).toBe(0);

  const expectedTask = {
    payload: [
      {
        id: 'smoothie_the_cat',
        url:
          'https://api.mapbox.com/styles/v1/shanhe/smoothie.the.cat?pluginName=Keplergl&access_token=secret_token'
      }
    ]
  };

  expect(task1.payload).toEqual(expectedTask.payload);

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
      icon: 'data:image/png;base64,xyz',
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
    mapboxApiUrl: undefined,
    mapStylesReplaceDefault: false,
    inputStyle: {
      accessToken: null,
      error: false,
      isValid: false,
      label: null,
      style: null,
      url: null,
      custom: true
    },
    threeDBuildingColor: [1, 2, 3],
    custom3DBuildingColor: true,
    initialState: {},
    bottomMapStyle: {layers: [], name: 'smoothie_the_cat'},
    topMapStyle: null,
    editable: 0
  };

  expect(Object.keys(resultState1).sort()).toEqual(Object.keys(expectedMapStyleState).sort());

  Object.keys(resultState1).forEach(key => {
    expect(resultState1[key]).toEqual(expectedMapStyleState[key]);
  });
});
