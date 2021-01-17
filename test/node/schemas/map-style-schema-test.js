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
import cloneDeep from 'lodash.clonedeep';
import SchemaManager from 'schemas';
import {InitialState, StateWCustomMapStyle} from 'test/helpers/mock-state';

test('#mapStyleSchema -> v1 -> save load mapStyle', t => {
  const initialState = cloneDeep(InitialState);
  const savedState = SchemaManager.getConfigToSave(initialState);

  // save state
  const msToSave = savedState.config.mapStyle;
  const msLoaded = SchemaManager.parseSavedConfig(savedState).mapStyle;

  t.deepEqual(
    Object.keys(msToSave),
    ['styleType', 'topLayerGroups', 'visibleLayerGroups', 'threeDBuildingColor', 'mapStyles'],
    'mapStyle should have all 4 entries'
  );

  const expectedSaved = {
    styleType: 'dark',
    topLayerGroups: {},
    visibleLayerGroups: {},
    mapStyles: {},
    threeDBuildingColor: [209, 206, 199]
  };

  const expectedLoaded = {
    styleType: 'dark',
    topLayerGroups: {},
    visibleLayerGroups: {},
    threeDBuildingColor: [209, 206, 199]
  };

  t.deepEqual(msToSave, expectedSaved, 'saved mapStyle should be current');
  t.deepEqual(msLoaded, expectedLoaded, 'loaded mapStyle should be current');
  t.end();
});

test('#mapStyleSchema -> v1 -> save load mapStyle with custom style', t => {
  const initialState = cloneDeep(StateWCustomMapStyle);
  const savedState = SchemaManager.getConfigToSave(initialState);

  // save state
  const msToSave = savedState.config.mapStyle;
  const msLoaded = SchemaManager.parseSavedConfig(savedState).mapStyle;

  const expectedSaved = {
    styleType: 'smoothie_the_cat',
    topLayerGroups: {},
    visibleLayerGroups: {
      label: true,
      road: true
    },
    threeDBuildingColor: [1, 2, 3],
    mapStyles: {
      smoothie_the_cat: {
        id: 'smoothie_the_cat',
        accessToken: 'secret_token',
        label: 'Smoothie the Cat',
        icon:
          'https://api.mapbox.com/styles/v1/shanhe/smoothie.the.cat/static/-122.3391,37.7922,9,0,0/400x300?access_token=secret_token&logo=false&attribution=false',
        custom: true,
        url: 'mapbox://styles/shanhe/smoothie.the.cat'
      }
    }
  };

  t.deepEqual(msToSave, expectedSaved, 'saved mapStyle should be current');
  t.deepEqual(msLoaded, expectedSaved, 'loaded mapStyle should be current');
  t.end();
});
