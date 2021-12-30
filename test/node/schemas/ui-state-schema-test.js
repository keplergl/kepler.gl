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

test('#uiStateSchema -> v1 -> save load uiState', t => {
  // mapLegend and locale in uiState should be saved and loaded
  const initialState = cloneDeep(InitialState);
  const savedState = SchemaManager.getConfigToSave(initialState);

  // save state
  const uiToSave = savedState.config.uiState;
  const uiLoaded = SchemaManager.parseSavedConfig(savedState).uiState;

  t.deepEqual(Object.keys(uiToSave), ['mapControls', 'locale'], 'uiState should have 2 entries');

  t.deepEqual(
    Object.keys(uiToSave.mapControls),
    ['visibleLayers', 'mapLegend', 'toggle3d', 'splitMap', 'mapDraw', 'mapLocale'],
    'uiState.mapControls should have 6 entries'
  );

  const expected = {
    mapControls: {
      visibleLayers: {
        show: true,
        active: false,
        disableClose: false,
        activeMapIndex: 0
      },
      mapLegend: {
        show: true,
        active: false,
        disableClose: false,
        activeMapIndex: 0
      },
      toggle3d: {
        show: true,
        active: false,
        disableClose: false,
        activeMapIndex: 0
      },
      splitMap: {
        show: true,
        active: false,
        disableClose: false,
        activeMapIndex: 0
      },
      mapDraw: {
        show: true,
        active: false,
        disableClose: false,
        activeMapIndex: 0
      },
      mapLocale: {
        show: true,
        active: false,
        disableClose: false,
        activeMapIndex: 0
      }
    },
    locale: 'en'
  };

  t.deepEqual(uiToSave, expected, 'save uiState should be current');
  t.deepEqual(uiLoaded, expected, 'load uiState should be current');

  t.end();
});
