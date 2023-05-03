// Copyright (c) 2023 Uber Technologies, Inc.
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
import {cmpFilters, cmpSavedLayers} from 'test/helpers/comparison-utils';
import SchemaManager, {CURRENT_VERSION, visStateSchema} from '@kepler.gl/schemas';

import {
  StateWFiles,
  StateWFilesFiltersLayerColor,
  StateWTooltipFormat,
  expectedSavedLayer0,
  expectedLoadedLayer0,
  expectedSavedLayer1,
  expectedLoadedLayer1,
  expectedSavedLayer2,
  expectedLoadedLayer2,
  StateWTripGeojson,
  expectedSavedTripLayer,
  testCsvDataId,
  testGeoJsonDataId
} from 'test/helpers/mock-state';
import {keplerGlReducerCore as keplerGlReducer} from '@kepler.gl/reducers';
import {VisStateActions} from '@kepler.gl/actions';

const expectedVisStateEntries = [
  'filters',
  'layers',
  'interactionConfig',
  'layerBlending',
  'overlayBlending',
  'splitMaps',
  'animationConfig',
  'editor'
];

test('#visStateSchema -> v1 -> save layers', t => {
  const initialState = cloneDeep(StateWFilesFiltersLayerColor);

  // save state
  const vsToSave = SchemaManager.getConfigToSave(initialState).config.visState;

  t.deepEqual(
    Object.keys(vsToSave),
    expectedVisStateEntries,
    `visState should have all ${expectedVisStateEntries.length} entries`
  );

  const exptectedSavedLayers = [expectedSavedLayer0, expectedSavedLayer1, expectedSavedLayer2];

  const layersToSave = vsToSave.layers;

  cmpSavedLayers(t, exptectedSavedLayers, layersToSave);
  t.end();
});

test('#visStateSchema -> v1 -> load layers', t => {
  const initialState = cloneDeep(StateWFilesFiltersLayerColor);

  // save state
  const savedState = SchemaManager.getConfigToSave(initialState);
  const vsLoaded = SchemaManager.parseSavedConfig(savedState).visState;

  t.deepEqual(
    Object.keys(vsLoaded),
    expectedVisStateEntries,
    `visState should have all ${expectedVisStateEntries.length} entries`
  );

  const loadedLayers = vsLoaded.layers;

  const expectedLoadedLayers = [expectedLoadedLayer0, expectedLoadedLayer1, expectedLoadedLayer2];

  cmpSavedLayers(t, expectedLoadedLayers, loadedLayers, {id: true});
  t.end();
});

test('#visStateSchema -> v1 -> save load filters', t => {
  const initialState = cloneDeep(StateWFilesFiltersLayerColor);
  const savedState = SchemaManager.getConfigToSave(initialState);

  // save state
  const vsToSave = savedState.config.visState;
  const vsLoaded = SchemaManager.parseSavedConfig(savedState).visState;
  const loadedFilters = vsLoaded.filters;

  // test saved filters
  const filtersToSave = vsToSave.filters;

  const expectedSavedFilters = [
    {
      dataId: [testCsvDataId],
      id: 'hjpn8frza',
      enabled: true,
      name: ['time'],
      type: 'timeRange',
      value: [1474606800000, 1474617600000],
      view: 'enlarged',
      plotType: 'histogram',
      yAxis: null,
      animationWindow: 'free',
      speed: 4
    },
    {
      dataId: [testGeoJsonDataId],
      id: 'vpk2466o',
      enabled: true,
      name: ['RATE'],
      type: 'multiSelect',
      value: ['a'],
      view: 'side',
      plotType: 'histogram',
      yAxis: null,
      animationWindow: 'free',
      speed: 1
    }
  ];

  cmpFilters(t, expectedSavedFilters, filtersToSave);
  cmpFilters(t, expectedSavedFilters, loadedFilters);

  t.end();
});

test('#visStateSchema -> v1 -> save and validate filters', t => {
  const initialState = cloneDeep(StateWFilesFiltersLayerColor);

  // add empty filter
  const nextStte = keplerGlReducer(initialState, VisStateActions.addFilter(testCsvDataId));
  const savedState = SchemaManager.getConfigToSave(nextStte);

  t.equal(nextStte.visState.filters.length, 3, 'should have 3 filters');
  t.equal(savedState.config.visState.filters.length, 2, 'should only save 2 filters');

  t.end();
});

test('#visStateSchema -> v1 -> save load interaction', t => {
  const initialState = cloneDeep(StateWFilesFiltersLayerColor);
  const savedState = SchemaManager.getConfigToSave(initialState);

  // save state
  const interactionToSave = savedState.config.visState.interactionConfig;
  const interactionLoaded = SchemaManager.parseSavedConfig(savedState).visState.interactionConfig;

  const expectedSaved = {
    tooltip: {
      enabled: true,
      compareMode: false,
      compareType: 'absolute',
      fieldsToShow: {
        [testCsvDataId]: [
          {
            name: 'gps_data.utc_timestamp',
            format: null
          },
          {
            name: 'gps_data.types',
            format: null
          },
          {
            name: 'epoch',
            format: null
          },
          {
            name: 'has_result',
            format: null
          },
          {
            name: 'uid',
            format: null
          }
        ],
        [testGeoJsonDataId]: [
          {
            name: 'OBJECTID',
            format: null
          },
          {
            name: 'ZIP_CODE',
            format: null
          },
          {
            name: 'ID',
            format: null
          },
          {
            name: 'TRIPS',
            format: null
          },
          {
            name: 'RATE',
            format: null
          }
        ]
      }
    },
    brush: {
      enabled: false,
      size: 0.5
    },
    coordinate: {
      enabled: false
    },
    geocoder: {
      enabled: false
    }
  };

  t.deepEqual(interactionToSave, expectedSaved);
  t.deepEqual(interactionLoaded, expectedSaved);

  t.end();
});

test('#visStateSchema -> v1 -> save load interaction -> tooltip format', t => {
  const initialState = cloneDeep(StateWTooltipFormat);
  const savedState = SchemaManager.getConfigToSave(initialState);

  // save state
  const interactionToSave = savedState.config.visState.interactionConfig;
  const interactionLoaded = SchemaManager.parseSavedConfig(savedState).visState.interactionConfig;

  const expectedSaved = {
    tooltip: {
      enabled: true,
      compareMode: true,
      compareType: 'relative',
      fieldsToShow: {
        [testCsvDataId]: [{name: 'gps_data.utc_timestamp', format: 'LL'}],
        [testGeoJsonDataId]: [
          {
            name: 'OBJECTID',
            format: null
          },
          {
            name: 'ZIP_CODE',
            format: null
          },
          {
            name: 'ID',
            format: null
          },
          {
            name: 'TRIPS',
            format: '.3f'
          },
          {
            name: 'RATE',
            format: null
          }
        ]
      }
    },
    brush: {
      enabled: false,
      size: 0.5
    },
    coordinate: {
      enabled: false
    },
    geocoder: {
      enabled: false
    }
  };

  t.deepEqual(interactionToSave, expectedSaved);
  t.deepEqual(interactionLoaded, expectedSaved);

  t.end();
});

test('#visStateSchema -> v1 -> save load layerBlending', t => {
  const initialState = cloneDeep(StateWFilesFiltersLayerColor);
  const savedState = SchemaManager.getConfigToSave(initialState);

  // save state
  const layerBlendingToSave = savedState.config.visState.layerBlending;
  const layerBlendingLoaded = SchemaManager.parseSavedConfig(savedState).visState.layerBlending;

  const expectedSaved = 'normal';

  t.deepEqual(layerBlendingToSave, expectedSaved);
  t.deepEqual(layerBlendingLoaded, expectedSaved);

  t.end();
});

test('#visStateSchema -> v1 -> save animation', t => {
  const initialState = cloneDeep(StateWTripGeojson);

  // save state
  const vsToSave = SchemaManager.getConfigToSave(initialState).config.visState;

  t.deepEqual(
    Object.keys(vsToSave),
    expectedVisStateEntries,
    `visState should have all ${expectedVisStateEntries.length} entries`
  );

  const expectedSavedLayers = [expectedSavedTripLayer];
  const expectedAnimationConfig = {currentTime: 1565577261000, speed: 1};
  cmpSavedLayers(t, expectedSavedLayers, vsToSave.layers);

  t.deepEqual(vsToSave.animationConfig, expectedAnimationConfig, 'should save animationConfig');
  t.end();
});

test('visStateSchema -> saving with a null column value does not throw an error', t => {
  const testLayer = cloneDeep(StateWFiles).visState.layers[0];

  // set a column to null
  testLayer.config.columns.altitude = null;

  // test that it doesn't fail ColumnSchemaV1.save
  t.doesNotThrow(() => {
    visStateSchema[CURRENT_VERSION].save({
      layers: [testLayer],
      layerOrder: [testLayer.id]
    });
  }, 'saving with a null column value should not fail');

  t.end();
});
