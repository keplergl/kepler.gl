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
import {InitialState} from 'test/helpers/mock-state';

test('#mapStateSchema -> v1 -> save load mapState', t => {
  const initialState = cloneDeep(InitialState);
  const savedState = SchemaManager.getConfigToSave(initialState);

  // save state
  const msToSave = savedState.config.mapState;
  const msLoaded = SchemaManager.parseSavedConfig(savedState).mapState;

  t.deepEqual(
    Object.keys(msToSave),
    ['bearing', 'dragRotate', 'latitude', 'longitude', 'pitch', 'zoom', 'isSplit'],
    'mapState should have all 6 entries'
  );

  const expected = {
    pitch: 0,
    bearing: 0,
    latitude: 37.75043,
    longitude: -122.34679,
    zoom: 9,
    dragRotate: false,
    isSplit: false
  };

  t.deepEqual(msToSave, expected, 'save mapState should be current');
  t.deepEqual(msLoaded, expected, 'load mapState should be current');

  t.end();
});
