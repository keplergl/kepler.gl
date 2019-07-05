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

import cloneDeep from 'lodash.clonedeep';
import {cmpFilters, cmpSavedLayers} from 'test/helpers/comparison-utils';
import SchemaManager from 'schemas';

import {StateWFilesFiltersLayerColor,
  expectedSavedLayer0,
  expectedLoadedLayer0,
  expectedSavedLayer1,
  expectedLoadedLayer1,
  expectedSavedLayer2,
  expectedLoadedLayer2
} from 'test/helpers/mock-state';

it('#visStateSchema -> v1 -> save layers', () => {
  const initialState = cloneDeep(StateWFilesFiltersLayerColor);

  // save state
  const vsToSave = SchemaManager.getConfigToSave(initialState).config.visState;

  expect(Object.keys(vsToSave)).toEqual(['filters', 'layers', 'interactionConfig', 'layerBlending', 'splitMaps']);

  const exptectedSavedLayers = [
    expectedSavedLayer0,
    expectedSavedLayer1,
    expectedSavedLayer2
  ];

  const layersToSave = vsToSave.layers;

  cmpSavedLayers(exptectedSavedLayers, layersToSave);
});

it('#visStateSchema -> v1 -> load layers', () => {
  const initialState = cloneDeep(StateWFilesFiltersLayerColor);

  // save state
  const savedState = SchemaManager.getConfigToSave(initialState);
  const vsLoaded = SchemaManager.parseSavedConfig(savedState).visState;

  expect(Object.keys(vsLoaded)).toEqual(['filters', 'layers', 'interactionConfig', 'layerBlending', 'splitMaps']);

  const loadedLayers = vsLoaded.layers;

  const expectedLoadedLayers = [
    expectedLoadedLayer0,
    expectedLoadedLayer1,
    expectedLoadedLayer2
  ];

  cmpSavedLayers(expectedLoadedLayers, loadedLayers, {id: true});

});

it('#visStateSchema -> v1 -> save load filters', () => {
  const initialState = cloneDeep(StateWFilesFiltersLayerColor);
  const savedState = SchemaManager.getConfigToSave(initialState);

  // save state
  const vsToSave = savedState.config.visState;
  const vsLoaded = SchemaManager.parseSavedConfig(savedState).visState;
  const loadedFilters = vsLoaded.filters;

  // test saved filters
  const filtersToSave = vsToSave.filters;

  const expectedSavedFilters = [{
    dataId: '190vdll3di',
    id: 'hjpn8frza',
    name: 'time',
    type: 'timeRange',
    value: [1474606800000, 1474617600000],
    enlarged: true,
    plotType: 'histogram',
    yAxis: null
  }, {
    dataId: 'ieukmgne',
    id: 'vpk2466o',
    name: 'RATE',
    type: 'multiSelect',
    value: ['a'],
    enlarged: false,
    plotType: 'histogram',
    yAxis: null
  }];

  cmpFilters(expectedSavedFilters, filtersToSave);
  cmpFilters(expectedSavedFilters, loadedFilters);
});

it('#visStateSchema -> v1 -> save load interaction', () => {
  const initialState = cloneDeep(StateWFilesFiltersLayerColor);
  const savedState = SchemaManager.getConfigToSave(initialState);

  // save state
  const interactionToSave = savedState.config.visState.interactionConfig;
  const interactionLoaded = SchemaManager.parseSavedConfig(savedState).visState.interactionConfig;

  const expectedSaved = {
    tooltip: {
      enabled: true,
      fieldsToShow: {
        '190vdll3di': [
          'gps_data.utc_timestamp',
          'gps_data.types',
          'epoch',
          'has_result',
          'id'
        ],
        ieukmgne: [
          'OBJECTID', 'ZIP_CODE', 'ID', 'TRIPS', 'RATE'
        ]}},
    brush: {
      enabled: false,
      size: 0.5
    }
  };

  expect(interactionToSave).toEqual(expectedSaved);
  expect(interactionLoaded).toEqual(expectedSaved);
});

it('#visStateSchema -> v1 -> save load layerBlending', () => {
  const initialState = cloneDeep(StateWFilesFiltersLayerColor);
  const savedState = SchemaManager.getConfigToSave(initialState);

  // save state
  const layerBlendingToSave = savedState.config.visState.layerBlending;
  const layerBlendingLoaded = SchemaManager.parseSavedConfig(savedState).visState.layerBlending;

  const expectedSaved = 'normal';

  expect(layerBlendingToSave).toEqual(expectedSaved);
  expect(layerBlendingLoaded).toEqual(expectedSaved);
});
