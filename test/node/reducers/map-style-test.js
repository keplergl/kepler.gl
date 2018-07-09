// Copyright (c) 2018 Uber Technologies, Inc.
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

import reducer from 'reducers/map-style';
import {INITIAL_MAP_STYLE} from 'reducers/map-style-updaters';
import {keplerGlInit, receiveMapConfig} from 'actions/actions';
import SchemaManager from 'schemas';
import {
  drainTasksForTesting,
  succeedTaskInTest,
  errorTaskInTest
} from 'react-palm/tasks';

// helpers
import {StateWCustomMapStyle} from 'test/helpers/mock-state';

const InitialMapStyle = reducer(undefined, {});

test('#mapStyleReducer', t => {
  const newState = reducer(undefined, {});

  t.deepEqual(newState, {
    ...INITIAL_MAP_STYLE,
    initialState: {}
    }, 'should return the initial map style');

  t.end();
});

test('#mapStyleReducer -> INIT', t => {
  const newState = reducer(InitialMapStyle, keplerGlInit({mapboxApiAccessToken: 'smoothies_secret_token'}));

  t.deepEqual(newState, {
    ...INITIAL_MAP_STYLE,
    initialState: {},
    mapboxApiAccessToken: 'smoothies_secret_token'
  }, 'initialie map style with mapboxApiAccessToken');

  t.end();
});

test('#mapStyleReducer -> RECEIVE_MAP_CONFIG', t => {
  const stateWithToken = reducer(InitialMapStyle, keplerGlInit({mapboxApiAccessToken: 'smoothies_secret_token'}));

  const stateToSave = StateWCustomMapStyle.toJS();
  // save state
  const savedState = SchemaManager.getConfigToSave(stateToSave);

  // load state
  const stateLoaded = SchemaManager.parseSavedConfig(savedState);
  console.log(stateLoaded);

  const stateWithConfig= reducer(
    stateWithToken,
    receiveMapConfig(stateLoaded)
  );
  const [task1, ...more] = drainTasksForTesting();

  t.equal(more.length, 0, 'should return 1 task');

  // TODO: ask btford how to test Task.all

  t.end();
});
