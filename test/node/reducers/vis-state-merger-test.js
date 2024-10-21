// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import cloneDeep from 'lodash.clonedeep';
import Task, {withTask, drainTasksForTesting, succeedTaskInTest} from 'react-palm/tasks';

import keplerGlReducer, {
  mergeFilters,
  mergeLayers,
  mergeInteractions,
  mergeLayerBlending,
  mergeSplitMaps,
  insertLayerAtRightOrder,
  VIS_STATE_MERGERS,
  createLayerFromConfig,
  applyMergersUpdater,
  visStateReducer,
  keplerGlReducerCore as coreReducer,
  defaultInteractionConfig,
  getLayerOrderFromLayers
} from '@kepler.gl/reducers';

import SchemaManager, {CURRENT_VERSION, visStateSchema} from '@kepler.gl/schemas';
import {processKeplerglJSON} from '@kepler.gl/processors';
import {updateVisData, receiveMapConfig, addDataToMap, registerEntry} from '@kepler.gl/actions';

import {createDataContainer, findById} from '@kepler.gl/utils';

// fixtures
import {
  savedStateV0,
  mergedFilters as mergedFiltersV0,
  mergedLayers as mergedLayersV0,
  mergedInteractions as mergedInteractionsV0
} from 'test/fixtures/state-saved-v0';

import {
  savedStateV1,
  mergedFilters as mergedFiltersV1,
  mergedLayers as mergedLayersV1,
  mergedInteraction as MergedInteractionV1
} from 'test/fixtures/state-saved-v1-1';

import {
  savedStateV1 as savedStateV1Split,
  mergedLayers as mergedLayersV1Split,
  mergedSplitMaps as mergedSplitMapsV1
} from 'test/fixtures/state-saved-v1-3';

import {
  stateSavedV1 as savedStateV1Label,
  mergedLayers as mergedLayersV1Label
} from 'test/fixtures/state-saved-v1-4';

import {
  savedStateV1TripGeoJson,
  mergedLayer0 as mergedTripLayer
} from 'test/fixtures/state-saved-v1-5';

import {savedStateV1InteractionCoordinate} from 'test/fixtures/state-saved-v1-7';

import {savedStateWIthNonValidFilters as NonValidFilterState} from 'test/fixtures/state-saved-v1-6';

import {polygonFilterMap} from 'test/fixtures/polygon-filter-map';

// helpers
import {cmpFilters, cmpLayers, cmpDatasets} from 'test/helpers/comparison-utils';

// mock app state
import {
  InitialState,
  StateWFilters,
  StateWMultiFilters,
  StateWFilesFiltersLayerColor,
  StateWSyncedTimeFilter,
  StateWSplitMaps,
  testCsvDataId,
  testGeoJsonDataId,
  StateWFiles
} from 'test/helpers/mock-state';

import {
  testFields,
  testAllData,
  timeFilterProps,
  dateFilterProps,
  epochFilterProps,
  mergedTimeFilter,
  mergedDateFilter,
  mergedEpochFilter,
  expectedSyncedTsFilter
} from 'test/fixtures/test-csv-data';

import {
  fields,
  datasetAllData as testGeoJsonAllData,
  geoJsonRateFilterProps,
  geoJsonTripFilterProps,
  mergedTripFilter,
  mergedRateFilter
} from 'test/fixtures/geojson';
import {mockStateWithPolygonFilter} from '../../fixtures/points-with-polygon-filter-map';
import CloneDeep from 'lodash.clonedeep';

test('VisStateMerger.v0 -> mergeFilters -> toEmptyState', t => {
  const savedConfig = cloneDeep(savedStateV0);
  const oldState = cloneDeep(InitialState);
  const oldVisState = oldState.visState;

  const parsedConfig = SchemaManager.parseSavedConfig(savedConfig.config, oldState);
  const parsedFilters = parsedConfig.visState.filters;
  const mergedState = mergeFilters(oldState.visState, parsedFilters);

  Object.keys(oldVisState).forEach(key => {
    if (key === 'filterToBeMerged') {
      t.deepEqual(
        mergedState.filterToBeMerged,
        parsedFilters,
        'Should save filters to filterToBeMerged before data loaded'
      );
    } else {
      t.deepEqual(mergedState[key], oldVisState[key], 'Should keep the rest of state same');
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed filters
  cmpFilters(t, mergedFiltersV0, stateWData.filters);

  t.end();
});

test('VisStateMerger.v1 -> mergeFilters -> toEmptyState', t => {
  const savedConfig = cloneDeep(savedStateV1);
  const oldState = cloneDeep(InitialState);
  const oldVisState = oldState.visState;
  const expectedMergedFilterV1 = mergedFiltersV1;

  const parsedConfig = SchemaManager.parseSavedConfig(savedConfig.config, oldState);
  const parsedFilters = parsedConfig.visState.filters;

  const mergedState = mergeFilters(oldState.visState, parsedFilters);
  Object.keys(oldVisState).forEach(key => {
    if (key === 'filterToBeMerged') {
      t.deepEqual(
        mergedState.filterToBeMerged,
        parsedFilters,
        'Should save filters to filterToBeMerged before data loaded'
      );
    } else {
      t.deepEqual(mergedState[key], oldVisState[key], 'Should keep the rest of state same');
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed filters
  cmpFilters(t, expectedMergedFilterV1, stateWData.filters);
  t.end();
});

test('VisStateMerger.v0 -> mergeFilters -> toWorkingState', t => {
  const savedConfig = cloneDeep(savedStateV0);
  const oldState = cloneDeep(StateWFilters);

  const oldVisState = oldState.visState;
  const oldFilters = [...oldState.visState.filters];

  const parsedConfig = SchemaManager.parseSavedConfig(savedConfig.config, oldState);
  const parsedFilters = parsedConfig.visState.filters;

  const mergedState = mergeFilters(oldState.visState, parsedFilters);

  Object.keys(oldVisState).forEach(key => {
    if (key === 'filterToBeMerged') {
      t.deepEqual(
        mergedState.filterToBeMerged,
        parsedFilters,
        'Should save filters to filterToBeMerged before data loaded'
      );
    } else {
      t.deepEqual(mergedState[key], oldVisState[key], 'Should keep the rest of state same');
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed filters
  cmpFilters(t, [...oldFilters, ...mergedFiltersV0], stateWData.filters);
  t.deepEqual(stateWData.filterToBeMerged, [], 'should clear up filterToBeMerged');

  // should filter data
  t.end();
});

test('VisStateMerger.v1 -> mergeFilters -> toWorkingState', t => {
  const savedConfig = cloneDeep(savedStateV1);
  const oldState = cloneDeep(StateWFilters);

  const oldVisState = oldState.visState;
  const oldFilters = [...oldState.visState.filters];

  const parsedConfig = SchemaManager.parseSavedConfig(savedConfig.config, oldState);
  const parsedFilters = parsedConfig.visState.filters;

  const mergedState = mergeFilters(oldState.visState, parsedFilters);

  Object.keys(oldVisState).forEach(key => {
    if (key === 'filterToBeMerged') {
      t.deepEqual(
        mergedState.filterToBeMerged,
        parsedFilters,
        'Should save filters to filterToBeMerged before data loaded'
      );
    } else {
      t.deepEqual(mergedState[key], oldVisState[key], 'Should keep the rest of state same');
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed filters
  cmpFilters(t, [...oldFilters, ...mergedFiltersV1], stateWData.filters);
  t.deepEqual(stateWData.filterToBeMerged, [], 'should clear up filterToBeMerged');

  // should filter data
  t.end();
});

test('VisStateMerger.v1 -> mergeFilters -> empty filter', t => {
  const savedConfig = cloneDeep(savedStateV1);
  // set an empty filter
  savedConfig.config.config.visState.filters[0].name = [];
  const oldState = cloneDeep(InitialState);

  const oldVisState = oldState.visState;
  const oldFilters = [...oldState.visState.filters];

  const parsedConfig = SchemaManager.parseSavedConfig(savedConfig.config, oldState);
  const parsedFilters = parsedConfig.visState.filters;

  const mergedState = mergeFilters(oldState.visState, parsedFilters);

  Object.keys(oldVisState).forEach(key => {
    if (key === 'filterToBeMerged') {
      t.deepEqual(
        mergedState.filterToBeMerged,
        parsedFilters,
        'Should save filters to filterToBeMerged before data loaded'
      );
    } else {
      t.deepEqual(mergedState[key], oldVisState[key], 'Should keep the rest of state same');
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed filters
  cmpFilters(t, oldFilters, stateWData.filters);
  t.deepEqual(
    stateWData.filterToBeMerged,
    parsedFilters,
    'should save filters failed to merge to filterToBeMerged'
  );

  // should filter data
  t.end();
});

test('VisStateMerger -> mergeLayers -> invalid layer config', t => {
  const oldState = cloneDeep(InitialState);
  const oldVisState = oldState.visState;

  const layers = [
    {id: 'abc'},
    {type: 'taro'}, // no type
    {type: 'point', id: 'yes'} // no config
  ];
  const mergedState = mergeLayers(oldVisState, layers, true);

  t.equal(mergedState.layers, oldVisState.layers, 'merge invalid layer should not error');
  t.deepEqual(mergedState.layerToBeMerged, layers, 'layerToBeMerged should contain invalid layers');
  t.end();
});

test('VisStateMerger.current -> mergeLayers -> toEmptyState', t => {
  const stateToSave = cloneDeep(StateWFilesFiltersLayerColor);
  const appStateToSave = SchemaManager.save(stateToSave);
  const configToSave = appStateToSave.config;
  const configParsed = SchemaManager.parseSavedConfig(configToSave);
  const oldState = cloneDeep(InitialState);
  const oldVisState = oldState.visState;

  const parsedLayers = configParsed.visState.layers;
  // mergeLayers
  const mergedState = mergeLayers(oldState.visState, parsedLayers, true);

  Object.keys(oldVisState).forEach(key => {
    if (key === 'layerToBeMerged') {
      t.deepEqual(
        mergedState.layerToBeMerged,
        parsedLayers,
        'Should save layers to layerToBeMerged before data loaded'
      );
    } else {
      t.deepEqual(mergedState[key], oldVisState[key], 'Should keep the rest of state same');
    }
  });
  const parsedData = SchemaManager.parseSavedData(appStateToSave.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed layers
  const genericLayersByOrder = stateToSave.visState.layerOrder.map(id =>
    findById(id)(stateToSave.visState.layers)
  );

  cmpLayers(t, genericLayersByOrder, stateWData.layers, {id: true});
  t.end();
});

test('visStateMerger -> mergeLayer -> incremental load', t => {
  const stateToSave = cloneDeep(StateWFilesFiltersLayerColor);
  const appStateToSave = SchemaManager.save(stateToSave);
  const {datasets, config} = appStateToSave;

  const [dataset1, dataset2] = datasets;
  // load config first
  const stateWithConfig = coreReducer(stateToSave, addDataToMap({config}));

  t.deepEqual(
    stateWithConfig.visState.preserveLayerOrder,
    ['hexagon-2', 'point-0', 'geojson-1'],
    'shoud preserve layer order'
  );

  t.deepEqual(
    stateWithConfig.visState.layerToBeMerged.map(l => l.id),
    ['hexagon-2', 'point-0', 'geojson-1'],
    'should save to layerToBeMerged'
  );

  // load dataset2
  const parsedData2 = SchemaManager.parseSavedData([dataset2]);
  const stateWithData2 = coreReducer(stateWithConfig, addDataToMap({datasets: parsedData2}));
  t.deepEqual(
    stateWithData2.visState.preserveLayerOrder,
    ['hexagon-2', 'point-0', 'geojson-1'],
    'shoud preserve layer order'
  );

  t.deepEqual(
    stateWithData2.visState.layers.map(l => l.id),
    ['geojson-1'],
    'shoud load geojeon layer'
  );

  t.deepEqual(
    stateWithData2.visState.layerOrder,
    [stateWithData2.visState.layers[0].id],
    'layerOrder should be correct'
  );
  t.deepEqual(
    stateWithData2.visState.layerToBeMerged.map(l => l.id),
    ['hexagon-2', 'point-0'],
    'should save to layerToBeMerged'
  );

  // load dataset1
  const parsedData1 = SchemaManager.parseSavedData([dataset1]);
  const stateWithData1 = coreReducer(stateWithData2, addDataToMap({datasets: parsedData1}));
  t.deepEqual(
    stateWithData1.visState.preserveLayerOrder,
    ['hexagon-2', 'point-0', 'geojson-1'],
    'shoud preserve layer order'
  );
  t.deepEqual(
    stateWithData1.visState.layers.map(l => l.id),
    ['geojson-1', 'hexagon-2', 'point-0'],
    'shoud load 2 layers'
  );
  t.deepEqual(
    stateWithData1.visState.layerOrder,
    [
      stateWithData1.visState.layers[1].id,
      stateWithData1.visState.layers[2].id,
      stateWithData1.visState.layers[0].id
    ],
    'layerOrder should be correct'
  );
  t.deepEqual(
    stateWithData1.visState.layerToBeMerged.map(l => l.id),
    [],
    'layerToBeMerged should be empty'
  );

  t.end();
});

test('VisStateMerger.v1 -> mergeLayers -> toEmptyState', t => {
  const savedConfig = cloneDeep(savedStateV1);
  const parsedConfig = SchemaManager.parseSavedConfig(savedConfig.config);

  const oldState = cloneDeep(InitialState);
  const oldVisState = oldState.visState;

  const parsedLayers = parsedConfig.visState.layers;

  // mergeLayers
  const mergedState = mergeLayers(oldState.visState, parsedLayers, true);

  Object.keys(oldVisState).forEach(key => {
    if (key === 'layerToBeMerged') {
      t.deepEqual(
        mergedState.layerToBeMerged,
        parsedLayers,
        'Should save layers to layerToBeMerged before data loaded'
      );
    } else {
      t.deepEqual(mergedState[key], oldVisState[key], 'Should keep the rest of state same');
    }
  });
  const parsedData = SchemaManager.parseSavedData(savedStateV1.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed layers
  cmpLayers(t, mergedLayersV1, stateWData.layers, {id: true, color: true});
  t.end();
});

test('VisStateMerger.v1.label -> mergeLayers -> toEmptyState', t => {
  const savedConfig = cloneDeep(savedStateV1Label);
  const parsedConfig = SchemaManager.parseSavedConfig(savedConfig.config);

  const oldState = cloneDeep(InitialState);
  const oldVisState = oldState.visState;

  const parsedLayers = parsedConfig.visState.layers;

  // mergeLayers
  const mergedState = mergeLayers(oldState.visState, parsedLayers, true);

  Object.keys(oldVisState).forEach(key => {
    if (key === 'layerToBeMerged') {
      t.deepEqual(
        mergedState.layerToBeMerged,
        parsedLayers,
        'Should save layers to layerToBeMerged before data loaded'
      );
    } else {
      t.deepEqual(mergedState[key], oldVisState[key], 'Should keep the rest of state same');
    }
  });
  const parsedData = SchemaManager.parseSavedData(savedStateV1Label.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed layers
  cmpLayers(t, mergedLayersV1Label, stateWData.layers, {id: true});
  t.end();
});

test('VisStateMerger.v1.split -> mergeLayers -> toEmptyState', t => {
  const savedConfig = cloneDeep(savedStateV1Split);
  const parsedConfig = SchemaManager.parseSavedConfig(savedConfig.config);
  const expectedConfig = mergedSplitMapsV1;
  const oldState = cloneDeep(InitialState);

  const oldVisState = oldState.visState;

  const parsedLayers = parsedConfig.visState.layers;

  // merge State
  const mergedState = visStateReducer(oldVisState, receiveMapConfig(parsedConfig));

  Object.keys(oldVisState).forEach(key => {
    if (key === 'layerToBeMerged') {
      t.deepEqual(
        mergedState.layerToBeMerged,
        parsedLayers,
        'Should save layers to layerToBeMerged before data loaded'
      );
    } else if (key === 'splitMaps') {
      t.deepEqual(mergedState.splitMaps, [], 'Should wait to merge splitMaps');
    } else if (key === 'splitMapsToBeMerged') {
      t.deepEqual(
        mergedState.splitMapsToBeMerged,
        expectedConfig,
        'Should save to splitMapsToBeMerged'
      );
    } else if (key === 'interactionToBeMerged') {
      t.deepEqual(
        mergedState.interactionToBeMerged,
        {tooltip: parsedConfig.visState.interactionConfig.tooltip},
        'Should save interactionConfig to interactionToBeMerged'
      );
    } else {
      t.deepEqual(mergedState[key], oldVisState[key], `Should keep ${key} the same`);
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test split Maps
  t.deepEqual(stateWData.splitMaps, expectedConfig, 'should merge splitMaps');

  // test parsed layers
  cmpLayers(t, mergedLayersV1Split, stateWData.layers, {id: true});
  t.end();
});

test('VisStateMerger.v0 -> mergeLayers -> toWorkingState', t => {
  const savedConfig = cloneDeep(savedStateV0);
  const parsedConfig = SchemaManager.parseSavedConfig(savedConfig.config);

  const oldState = cloneDeep(StateWFilesFiltersLayerColor);

  const oldVisState = oldState.visState;
  t.deepEqual(
    oldVisState.layerOrder,
    ['hexagon-2', 'point-0', 'geojson-1'],
    'layer order should be correct'
  );

  const oldLayers = [...oldVisState.layers];

  const parsedLayers = parsedConfig.visState.layers;

  // mergeLayers
  const mergedState = mergeLayers(oldState.visState, parsedLayers, true);

  Object.keys(oldVisState).forEach(key => {
    if (key === 'layerToBeMerged') {
      t.deepEqual(
        mergedState.layerToBeMerged,
        parsedLayers,
        'Should save layers to layerToBeMerged before data loaded'
      );
    } else {
      t.deepEqual(mergedState[key], oldVisState[key], 'Should keep the rest of state same');
    }
  });

  t.deepEqual(
    mergedState.layerOrder,
    ['hexagon-2', 'point-0', 'geojson-1'],
    'layer order should not change'
  );

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed layers
  cmpLayers(t, [...oldLayers, ...mergedLayersV0], stateWData.layers);

  t.deepEqual(
    stateWData.layerOrder,
    [...getLayerOrderFromLayers(mergedLayersV0), 'hexagon-2', 'point-0', 'geojson-1'],
    'should put new layers on top of old ones'
  );
  t.deepEqual(stateWData.layerToBeMerged, [], 'should clean up layer to be merged');
  t.equal(stateWData.layerData.length, 8, 'should calculate layer data');

  t.end();
});

test('VisStateMerger.v1 -> mergeLayers -> toWorkingState', t => {
  const savedConfig = cloneDeep(savedStateV1);
  const parsedConfig = SchemaManager.parseSavedConfig(savedConfig.config);

  const oldState = cloneDeep(StateWFilesFiltersLayerColor);
  const oldVisState = oldState.visState;
  t.deepEqual(
    oldVisState.layerOrder,
    ['hexagon-2', 'point-0', 'geojson-1'],
    'layer order should be correct'
  );
  const oldLayers = [...oldVisState.layers];

  const parsedLayers = parsedConfig.visState.layers;

  // mergeLayers
  const mergedState = mergeLayers(oldState.visState, parsedLayers, true);

  Object.keys(oldVisState).forEach(key => {
    if (key === 'layerToBeMerged') {
      t.deepEqual(
        mergedState.layerToBeMerged,
        parsedLayers,
        'Should save layers to layerToBeMerged before data loaded'
      );
    } else {
      t.deepEqual(mergedState[key], oldVisState[key], 'Should keep the rest of state same');
    }
  });

  t.deepEqual(
    mergedState.layerOrder,
    ['hexagon-2', 'point-0', 'geojson-1'],
    'layer order should not change'
  );

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed filters
  cmpLayers(t, [...oldLayers, ...mergedLayersV1], stateWData.layers);

  t.deepEqual(
    stateWData.layerOrder,
    [
      stateWData.layers[3].id,
      stateWData.layers[4].id,
      stateWData.layers[2].id,
      stateWData.layers[0].id,
      stateWData.layers[1].id
    ],
    'should put new layers on top of old ones'
  );
  t.deepEqual(stateWData.layerToBeMerged, [], 'should clean up layer to be merged');
  t.equal(stateWData.layerData.length, 5, 'should calculate layer data');

  t.end();
});

test('VisStateMerger.v0 -> mergeInteractions -> toEmptyState', t => {
  const savedConfig = cloneDeep(savedStateV0);
  const oldState = cloneDeep(InitialState);
  const oldVisState = oldState.visState;

  const parsedConfig = SchemaManager.parseSavedConfig(savedConfig.config, oldState);
  const parsedInteraction = parsedConfig.visState.interactionConfig;

  // merge interactions
  const mergedState = mergeInteractions(oldState.visState, parsedInteraction);

  Object.keys(oldVisState).forEach(key => {
    if (key === 'interactionToBeMerged') {
      t.deepEqual(
        mergedState.interactionToBeMerged,
        {
          tooltip: {
            fieldsToShow: {
              '9h10t7fyb': [
                {
                  name: 'int_range',
                  format: null
                },
                {
                  name: 'detail',
                  format: null
                },
                {
                  name: 'type_boolean',
                  format: null
                }
              ],
              v79816te8: [
                {
                  name: 'ID',
                  format: null
                },
                {
                  name: 'ZIP_CODE',
                  format: null
                }
              ]
            },
            enabled: true
          }
        },
        'Should save interactions to interactionToBeMerged before data loaded'
      );
    } else if (key === 'interactionConfig') {
      t.deepEqual(
        mergedState.interactionConfig,
        oldState.visState.interactionConfig,
        'Should disable interaction: null'
      );
    } else {
      t.deepEqual(mergedState[key], oldVisState[key], 'Should keep the rest of state same');
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed interactions
  t.deepEqual(stateWData.interactionConfig, mergedInteractionsV0, 'should merge interactionConfig');
  t.deepEqual(stateWData.interactionToBeMerged, {}, 'should clear interaction');

  t.end();
});

test('VisStateMerger.v0 -> mergeInteractions -> toWorkingState', t => {
  const savedConfig = cloneDeep(savedStateV0);
  const oldState = cloneDeep(StateWFilesFiltersLayerColor);
  const oldVisState = oldState.visState;

  const milkShake = [
    {
      name: 'have',
      format: null
    },
    {
      name: 'a',
      format: null
    },
    {
      name: 'good',
      format: null
    },
    {
      name: 'day',
      format: null
    }
  ];
  // add random items to interactionToBeMerged
  oldVisState.interactionToBeMerged = {
    ...oldVisState.interactionToBeMerged,
    tooltip: {
      fieldsToShow: {
        milkShake
      }
    }
  };

  const parsedConfig = SchemaManager.parseSavedConfig(savedConfig.config, oldState);

  const parsedInteraction = parsedConfig.visState.interactionConfig;

  // merge interactions
  const mergedState = mergeInteractions(oldState.visState, parsedInteraction);

  const expectedInteractionToBeMerged = {
    tooltip: {
      fieldsToShow: {
        milkShake,
        '9h10t7fyb': [
          {
            name: 'int_range',
            format: null
          },
          {
            name: 'detail',
            format: null
          },
          {
            name: 'type_boolean',
            format: null
          }
        ],
        v79816te8: [
          {
            name: 'ID',
            format: null
          },
          {
            name: 'ZIP_CODE',
            format: null
          }
        ]
      },
      enabled: true
    }
  };

  Object.keys(oldVisState).forEach(key => {
    if (key === 'interactionToBeMerged') {
      t.deepEqual(
        mergedState.interactionToBeMerged,
        expectedInteractionToBeMerged,
        'Should save interactions to interactionToBeMerged before data loaded'
      );
    } else {
      t.deepEqual(mergedState[key], oldVisState[key], 'Should keep the rest of state same');
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  const expectedInteractions = {
    ...defaultInteractionConfig,
    tooltip: {
      ...defaultInteractionConfig.tooltip,
      enabled: true,
      config: {
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
          ],
          '9h10t7fyb': [
            {
              name: 'int_range',
              format: null
            },
            {
              name: 'detail',
              format: null
            },
            {
              name: 'type_boolean',
              format: null
            }
          ],
          v79816te8: [
            {
              name: 'ID',
              format: null
            },
            {
              name: 'ZIP_CODE',
              format: null
            }
          ]
        }
      }
    }
  };

  // test parsed interactions
  t.deepEqual(stateWData.interactionConfig, expectedInteractions, 'should merge interactionconfig');
  t.deepEqual(
    stateWData.interactionToBeMerged,
    {
      tooltip: {
        fieldsToShow: {
          milkShake
        },
        enabled: true
      }
    },
    'should clear interaction'
  );

  t.end();
});

test('VisStateMerger.v1 -> mergeInteractions -> toEmptyState', t => {
  const savedConfig = cloneDeep(savedStateV1);
  const oldState = cloneDeep(InitialState);
  const oldVisState = oldState.visState;

  const parsedConfig = SchemaManager.parseSavedConfig(savedConfig.config, oldState);
  const parsedInteraction = parsedConfig.visState.interactionConfig;

  // merge interactions
  const mergedState = mergeInteractions(oldState.visState, parsedInteraction);

  Object.keys(oldVisState).forEach(key => {
    if (key === 'interactionToBeMerged') {
      t.deepEqual(
        mergedState.interactionToBeMerged,
        {
          tooltip: {
            fieldsToShow: {
              a5ybmwl2d: [
                {
                  name: 'a_zip',
                  format: null
                },
                {
                  name: 'str_type',
                  format: null
                },
                {
                  name: 'int_type',
                  format: null
                }
              ]
            },
            enabled: false
          }
        },
        'Should save nothing interactions to interactionToBeMerged before data loaded'
      );
    } else if (key === 'interactionConfig') {
      t.deepEqual(
        mergedState.interactionConfig,
        {
          ...defaultInteractionConfig,
          tooltip: {
            ...defaultInteractionConfig.tooltip,
            enabled: false,
            config: {
              fieldsToShow: {},
              compareMode: false,
              compareType: 'absolute'
            }
          },
          brush: {
            ...defaultInteractionConfig.brush,
            enabled: false,
            config: {
              size: 1
            }
          }
        },
        'Should disable tooltip'
      );
    } else {
      t.deepEqual(mergedState[key], oldVisState[key], 'Should keep the rest of state same');
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed interactions
  t.deepEqual(stateWData.interactionConfig, MergedInteractionV1, 'should merge interactionConfig');
  t.deepEqual(stateWData.interactionToBeMerged, {}, 'should clear interaction');

  t.end();
});

test('VisStateMerger.v1 -> mergeInteractions -> toWorkingState', t => {
  const savedConfig = cloneDeep(savedStateV1);
  const oldState = cloneDeep(StateWFilesFiltersLayerColor);
  const oldVisState = oldState.visState;

  const parsedConfig = SchemaManager.parseSavedConfig(savedConfig.config, oldState);

  const parsedInteraction = parsedConfig.visState.interactionConfig;

  // merge interactions
  const mergedState = mergeInteractions(oldState.visState, parsedInteraction);

  const expectedInteractionToBeMerged = {
    tooltip: {
      fieldsToShow: {
        a5ybmwl2d: [
          {
            name: 'a_zip',
            format: null
          },
          {
            name: 'str_type',
            format: null
          },
          {
            name: 'int_type',
            format: null
          }
        ]
      },
      enabled: false
    }
  };

  Object.keys(oldVisState).forEach(key => {
    if (key === 'interactionToBeMerged') {
      t.deepEqual(
        mergedState.interactionToBeMerged,
        expectedInteractionToBeMerged,
        'Should save interactions to interactionToBeMerged before data loaded'
      );
    } else if (key === 'interactionConfig') {
      t.deepEqual(
        mergedState.interactionConfig,
        {
          ...defaultInteractionConfig,
          tooltip: {
            ...defaultInteractionConfig.tooltip,
            enabled: false,
            config: {
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
            }
          },

          brush: {
            ...defaultInteractionConfig.brush,
            enabled: false,
            config: {
              size: 1
            }
          },

          coordinate: {
            ...defaultInteractionConfig.coordinate,
            enabled: false
          }
        },
        'Should disable interaction: null'
      );
    } else {
      t.deepEqual(mergedState[key], oldVisState[key], 'Should keep the rest of state same');
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  const expectedInteractions = {
    ...defaultInteractionConfig,
    tooltip: {
      ...defaultInteractionConfig.tooltip,
      enabled: false,
      config: {
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
          ],
          a5ybmwl2d: [
            {
              name: 'a_zip',
              format: null
            },
            {
              name: 'str_type',
              format: null
            },
            {
              name: 'int_type',
              format: null
            }
          ]
        }
      }
    },
    brush: {
      ...defaultInteractionConfig.brush,
      enabled: false,
      config: {size: 1}
    }
  };

  // test parsed interactions
  t.deepEqual(stateWData.interactionConfig, expectedInteractions, 'should merge interactionConfig');
  t.deepEqual(stateWData.interactionToBeMerged, {}, 'should clear interaction');

  t.end();
});

test('VisStateMerger.v1 -> mergeInteractions -> coordinate', t => {
  const savedConfig = cloneDeep(savedStateV1InteractionCoordinate);
  const oldState = cloneDeep(InitialState);
  const oldVisState = oldState.visState;

  const parsedConfig = SchemaManager.parseSavedConfig(savedConfig.config, oldState);

  const parsedInteraction = parsedConfig.visState.interactionConfig;

  // merge interactions
  const mergedState = mergeInteractions(oldState.visState, parsedInteraction);

  const expectedInteractionToBeMerged = {};

  Object.keys(oldVisState).forEach(key => {
    if (key === 'interactionToBeMerged') {
      t.deepEqual(
        mergedState.interactionToBeMerged,
        expectedInteractionToBeMerged,
        'Should save interactions to interactionToBeMerged before data loaded'
      );
    } else if (key === 'interactionConfig') {
      t.deepEqual(
        mergedState.interactionConfig,
        {
          ...defaultInteractionConfig,

          tooltip: {
            ...defaultInteractionConfig.tooltip,
            enabled: false
          },

          brush: {
            ...defaultInteractionConfig.brush,
            config: {
              size: 1
            }
          },

          coordinate: {
            ...defaultInteractionConfig.coordinate,
            enabled: true
          }
        },
        'Should disable interaction: null'
      );
    } else {
      t.deepEqual(mergedState[key], oldVisState[key], 'Should keep the rest of state same');
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  const expectedInteractions = {
    ...defaultInteractionConfig,
    tooltip: {
      ...defaultInteractionConfig.tooltip,
      enabled: false,
      config: {
        compareMode: false,
        compareType: 'absolute',
        fieldsToShow: {
          a5ybmwl2d: [
            {
              name: 'a_zip',
              format: null
            },
            {
              name: 'zip_area',
              format: null
            },
            {
              name: 'avg_number',
              format: null
            },
            {
              name: 'str_type',
              format: null
            },
            {
              name: 'int_type',
              format: null
            }
          ]
        }
      }
    },
    brush: {
      ...defaultInteractionConfig.brush,
      enabled: false,
      config: {size: 1}
    },
    coordinate: {
      ...defaultInteractionConfig.coordinate,
      enabled: true
    }
  };

  // test parsed interactions
  t.deepEqual(stateWData.interactionConfig, expectedInteractions, 'should merge interactionConfig');

  t.deepEqual(stateWData.interactionToBeMerged, {}, 'should clear interaction');

  t.end();
});

test('VisStateMerger - mergeLayerBlending', t => {
  const preState = {
    layerBlending: 'additive'
  };

  t.deepEqual(
    mergeLayerBlending(preState, 'normal'),
    {layerBlending: 'normal'},
    'should merge layerBlending'
  );
  t.deepEqual(
    mergeLayerBlending(preState, undefined),
    {layerBlending: 'additive'},
    'should merge layerBlending'
  );
  t.deepEqual(
    mergeLayerBlending(preState, 'not_exist'),
    {layerBlending: 'additive'},
    'should merge layerBlending'
  );
  t.deepEqual(
    mergeLayerBlending(preState, null),
    {layerBlending: 'additive'},
    'should merge layerBlending'
  );

  t.end();
});

test('VisStateMerger - mergeSplitMaps -> split to split', t => {
  // state with splitMaps
  const oldState = cloneDeep(StateWSplitMaps).visState;
  // saved config with splitMaps
  const savedConfig = cloneDeep(savedStateV1Split);
  const parsedConfig = SchemaManager.parseSavedConfig(savedConfig.config);

  // 1. merge State reset current splitMaps
  const mergedState = visStateReducer(oldState, receiveMapConfig(parsedConfig));

  const expectedToMerge = [
    {
      layers: {
        f24uw1: false,
        '9x77w7h': true
      }
    },
    {
      layers: {
        f24uw1: true,
        '9x77w7h': false
      }
    }
  ];

  const expectedToMergeAll = [
    {
      layers: {
        f24uw1: false,
        '9x77w7h': true,
        'point-0': false,
        'geojson-1': true
      }
    },
    {
      layers: {
        f24uw1: true,
        '9x77w7h': false,
        'point-0': true,
        'geojson-1': true
      }
    }
  ];
  t.deepEqual(mergedState.splitMaps, [], 'Should reset splitMaps');
  t.deepEqual(mergedState.splitMapsToBeMerged, expectedToMerge);

  // 2. merge State keep current splitMaps
  const mergedState2 = visStateReducer(
    oldState,
    receiveMapConfig(parsedConfig, {keepExistingConfig: true})
  );
  t.deepEqual(mergedState2.splitMaps, oldState.splitMaps, 'Should keep current splitMaps');
  t.deepEqual(
    mergedState2.splitMapsToBeMerged,
    expectedToMerge,
    'Should save unmerged to splitMapsToBeMerged'
  );

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);
  // 3. load data into reducer
  const mergedState3 = visStateReducer(mergedState2, updateVisData(parsedData));

  t.deepEqual(mergedState3.splitMaps, expectedToMergeAll, 'Should merge all splitMaps');
  t.deepEqual(mergedState3.splitMapsToBeMerged, [], 'Should empty splitMapsToBeMerged');

  t.end();
});

test('VisStateMerger - mergeSplitMaps', t => {
  const testState1 = {
    layers: [],
    splitMaps: [{layers: {a: true}}, {layers: {a: false}}],
    splitMapsToBeMerged: []
  };

  t.deepEqual(
    mergeSplitMaps(testState1, []),
    {...testState1, splitMapsToBeMerged: []},
    'should return empty'
  );

  const testSM = [{layers: {c: true}}, {layers: {c: false}}];

  t.deepEqual(
    mergeSplitMaps(testState1, testSM),
    {...testState1, splitMapsToBeMerged: testSM},
    'should save non-exist layers to splitMapsToBeMerged'
  );

  const testState2 = {
    layers: [{id: 'c', config: {isVisible: true}}],
    splitMaps: [{layers: {a: true}}, {layers: {a: false}}],
    splitMapsToBeMerged: []
  };

  t.deepEqual(
    mergeSplitMaps(testState2, testSM),
    {
      ...testState2,
      splitMaps: [{layers: {a: true, c: true}}, {layers: {a: false, c: false}}],
      splitMapsToBeMerged: []
    },
    'should merge split maps'
  );

  const testState3 = {
    layers: [{id: 'c', config: {isVisible: true}}],
    splitMaps: [],
    splitMapsToBeMerged: []
  };
  t.deepEqual(
    mergeSplitMaps(testState3, testSM),
    {
      ...testState3,
      splitMaps: [{layers: {c: true}}, {layers: {c: false}}],
      splitMapsToBeMerged: []
    },
    'should create split maps panel and merge split maps'
  );

  const testState4 = {
    layers: [
      {id: 'a', config: {isVisible: true}},
      {id: 'b', config: {isVisible: false}},
      {id: 'c', config: {isVisible: true}}
    ],
    splitMaps: [],
    splitMapsToBeMerged: []
  };
  t.deepEqual(
    mergeSplitMaps(testState4, testSM),
    {
      ...testState4,
      splitMaps: [{layers: {a: true, c: true}}, {layers: {a: true, c: false}}],
      splitMapsToBeMerged: []
    },
    'should create split maps panel, add current layer to splitMaps and merge split maps'
  );

  t.end();
});

test('VisStateMerger - mergeTripGeojson', t => {
  const initialState = cloneDeep(InitialState);

  // processKeplerglJSON
  const result = processKeplerglJSON(savedStateV1TripGeoJson);
  const updatedCore = coreReducer(initialState, addDataToMap(result));

  const mergedVieState = updatedCore.visState;

  t.equal(mergedVieState.layers.length, 1, 'should create 1 layer');
  const tripLayer = mergedVieState.layers[0];

  t.equal(tripLayer.type, 'trip', 'should create 1 trip layer');

  cmpLayers(t, mergedTripLayer, tripLayer, {id: true, color: true});

  t.deepEqual(
    tripLayer.dataToFeature,
    mergedTripLayer.dataToFeature,
    'dataToFeature should be correct'
  );

  t.deepEqual(
    tripLayer.dataToTimeStamp,
    mergedTripLayer.dataToTimeStamp,
    'dataToTimeStamp should be correct'
  );

  t.deepEqual(tripLayer.meta.bounds, mergedTripLayer.meta.bounds, 'meta.bounds should be correct');

  t.deepEqual(
    tripLayer.meta.featureTypes,
    mergedTripLayer.meta.featureTypes,
    'meta.featureTypes should be correct'
  );

  t.end();
});

test('VisStateMerger.v1 -> mergeFilters -> nonValidFilter', t => {
  const savedConfig = cloneDeep(NonValidFilterState);
  const oldState = cloneDeep(InitialState);
  const oldVisState = oldState.visState;

  const parsedConfig = SchemaManager.parseSavedConfig(savedConfig.config, oldState);
  const parsedFilters = parsedConfig.visState.filters;

  const mergedState = mergeFilters(oldState.visState, parsedFilters);

  Object.keys(oldVisState).forEach(key => {
    if (key === 'filterToBeMerged') {
      t.deepEqual(
        mergedState.filterToBeMerged,
        parsedFilters,
        'Should save filters to filterToBeMerged before data loaded'
      );
    } else {
      t.deepEqual(mergedState[key], oldVisState[key], 'Should keep the rest of state same');
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // parsed filters must be empty
  cmpFilters(t, [], stateWData.filters);
  t.end();
});

test('VisStateMerger.v1 -> mergeFilters -> multiFilters', t => {
  const stateToSave = cloneDeep(StateWMultiFilters);
  const oldCsvData = stateToSave.visState.datasets[testCsvDataId];
  const oldGeoJsonData = stateToSave.visState.datasets[testGeoJsonDataId];
  const appStateToSave = SchemaManager.save(stateToSave);
  const stateParsed = SchemaManager.load(appStateToSave);

  const oldState = cloneDeep(InitialState);
  const oldVisState = oldState.visState;

  const mergedState = visStateReducer(
    oldVisState,
    updateVisData(stateParsed.datasets, {}, stateParsed.config)
  );
  // check datasets is filtered
  // and field has filterProps

  const tFields0 = testFields.map(f => ({
    ...f,
    ...(f.name === 'time'
      ? {filterProps: timeFilterProps}
      : f.name === 'date'
      ? {filterProps: dateFilterProps}
      : f.name === 'epoch'
      ? {filterProps: epochFilterProps}
      : {})
  }));
  const dc0 = createDataContainer(testAllData, {fields: tFields0});

  const tFields1 = fields.map(f => ({
    ...f,
    ...(f.name === 'TRIPS'
      ? {filterProps: geoJsonTripFilterProps}
      : f.name === 'RATE'
      ? {filterProps: geoJsonRateFilterProps}
      : {})
  }));
  const dc1 = createDataContainer(testGeoJsonAllData, {fields: tFields1});

  const expectedDatasets = {
    [testCsvDataId]: {
      metadata: {
        id: testCsvDataId,
        label: 'hello.csv',
        format: ''
      },
      type: '',
      supportedFilterTypes: null,
      disableDataOperation: false,
      fields: tFields0,
      dataContainer: dc0,
      allIndexes: dc0.getPlainIndex(),
      id: testCsvDataId,
      label: 'hello.csv',
      color: 'donot test me',
      filteredIndex: [0, 1, 2, 3, 7, 8, 9, 10, 11, 12],
      filteredIndexForDomain: [0, 1, 2, 3, 7, 8, 9, 10, 11, 12],
      fieldPairs: oldCsvData.fieldPairs,
      filterRecord: {
        dynamicDomain: [mergedDateFilter],
        fixedDomain: [mergedTimeFilter, mergedEpochFilter],
        cpu: [mergedDateFilter],
        gpu: [mergedTimeFilter, mergedEpochFilter]
      },
      gpuFilter: {
        filterRange: [
          [1474606800000 - 1474588800000, 1474617600000 - 1474588800000],
          [1472700000000 - 1472688000000, 1472760000000 - 1472688000000],
          [0, 0],
          [0, 0]
        ],
        filterValueUpdateTriggers: {
          gpuFilter_0: {name: 'time', domain0: 1474588800000},
          gpuFilter_1: {name: 'epoch', domain0: 1472688000000},
          gpuFilter_2: null,
          gpuFilter_3: null
        },
        filterValueAccessor: {
          inputs: [
            {
              index: 1
            }
          ],
          result: [1474588800000 - 1474588800000, 1472688000000 - 1472688000000, 0, 0]
        }
      },
      changedFilters: {
        dynamicDomain: {'date-2': 'added'},
        fixedDomain: {'time-0': 'added', 'epoch-4': 'added'},
        cpu: {'date-2': 'added'},
        gpu: {'time-0': 'added', 'epoch-4': 'added'}
      }
    },
    [testGeoJsonDataId]: {
      metadata: {
        id: testGeoJsonDataId,
        label: 'zip.geojson',
        format: ''
      },
      type: '',
      supportedFilterTypes: null,
      disableDataOperation: false,
      fields: tFields1,
      filterRecord: {
        dynamicDomain: [mergedRateFilter, mergedTripFilter],
        fixedDomain: [],
        cpu: [mergedRateFilter],
        gpu: [mergedTripFilter]
      },
      gpuFilter: {
        filterRange: [
          [0, 8],
          [0, 0],
          [0, 0],
          [0, 0]
        ],
        filterValueUpdateTriggers: {
          gpuFilter_0: {name: 'TRIPS', domain0: 4},
          gpuFilter_1: null,
          gpuFilter_2: null,
          gpuFilter_3: null
        },
        filterValueAccessor: {
          inputs: [
            {
              index: 1
            }
          ],
          result: [0, 0, 0, 0]
        }
      },
      dataContainer: dc1,
      allIndexes: [0, 1, 2, 3, 4],
      id: testGeoJsonDataId,
      label: 'zip.geojson',
      color: 'donot test me',
      filteredIndex: [0],
      filteredIndexForDomain: [0],
      fieldPairs: oldGeoJsonData.fieldPairs,
      changedFilters: {
        dynamicDomain: {'RATE-1': 'added', 'TRIPS-3': 'added'},
        fixedDomain: null,
        cpu: {'RATE-1': 'added'},
        gpu: {'TRIPS-3': 'added'}
      }
    }
  };

  cmpDatasets(t, expectedDatasets, mergedState.datasets);

  const expectedFilters = [
    mergedTimeFilter,
    mergedRateFilter,
    mergedDateFilter,
    mergedTripFilter,
    mergedEpochFilter
  ];

  cmpFilters(t, expectedFilters, mergedState.filters);
  t.end();
});

test('VisStateMerger.v1 -> mergeFilters -> syncedFilters', t => {
  const stateToSave = cloneDeep(StateWSyncedTimeFilter);
  const appStateToSave = SchemaManager.save(stateToSave);
  const {datasets, config} = appStateToSave;
  t.equal(datasets.length, 2, 'should save 2 datasets');

  // load config to initial state
  const stateWithConfig = coreReducer(InitialState, addDataToMap({config}));

  t.equal(stateWithConfig.visState.filters.length, 0, 'should not load filter without data');
  t.equal(
    stateWithConfig.visState.filterToBeMerged.length,
    1,
    'should save filter to filterToBeMerged'
  );

  const parsedDatasets = SchemaManager.parseSavedData(datasets);

  // load data 1
  const stateWithData1 = coreReducer(stateWithConfig, addDataToMap({datasets: parsedDatasets[0]}));
  t.equal(Object.keys(stateWithData1.visState.datasets).length, 1, 'should load 1 dataset');
  t.equal(stateWithData1.visState.filters.length, 0, 'should not load filter without all datasets');

  // load data 2
  const stateWithData2 = coreReducer(stateWithData1, addDataToMap({datasets: parsedDatasets[1]}));
  t.equal(Object.keys(stateWithData2.visState.datasets).length, 2, 'should load 2 datasets');
  t.equal(
    stateWithData2.visState.filters.length,
    1,
    'should load filter when all datasets are ready'
  );

  cmpFilters(t, expectedSyncedTsFilter, stateWithData2.visState.filters[0]);

  t.end();
});

test('VisStateMerger -> import polygon filter map', t => {
  const oldState = cloneDeep(InitialState);
  const savedConfig = cloneDeep(polygonFilterMap);
  const oldVisState = oldState.visState;

  const parsedConfig = SchemaManager.parseSavedConfig(savedConfig.config, oldState);

  const parsedFilters = parsedConfig.visState.filters;

  const mergedState = mergeFilters(oldState.visState, parsedFilters);

  Object.keys(oldVisState).forEach(key => {
    if (key === 'filterToBeMerged') {
      t.deepEqual(
        mergedState.filterToBeMerged,
        parsedFilters,
        'Should save filters to filterToBeMerged before data loaded'
      );
    } else {
      t.deepEqual(mergedState[key], oldVisState[key], 'Should keep the rest of state same');
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // parsed filters must be empty
  cmpFilters(t, [], stateWData.filters);
  t.end();
});

test('VisStateMerger -> insertLayerAtRightOrder -> to empty config', t => {
  const testCases = [
    {
      preservedOrder: ['a', 'b', 'c', 'd'],
      batches: [
        {
          load: [{id: 'b'}],
          expectedLayers: [{id: 'b'}],
          expectedOrder: ['b']
        },
        {
          load: [{id: 'a'}, {id: 'c'}],
          expectedLayers: [{id: 'b'}, {id: 'a'}, {id: 'c'}],
          expectedOrder: ['a', 'b', 'c']
        },
        {
          load: [{id: 'd'}],
          expectedLayers: [{id: 'b'}, {id: 'a'}, {id: 'c'}, {id: 'd'}],
          expectedOrder: ['a', 'b', 'c', 'd']
        }
      ],
      expectedLayers: [{id: 'b'}, {id: 'a'}, {id: 'c'}, {id: 'd'}],
      expectedOrder: ['a', 'b', 'c', 'd']
    },
    {
      preservedOrder: ['x', 'm', 'e', 'p', 'w', '6', 'h'],
      batches: [
        {
          load: [{id: '6'}],
          expectedLayers: [{id: '6'}],
          expectedOrder: ['6']
        },
        {
          load: [{id: 'e'}],
          expectedLayers: [{id: '6'}, {id: 'e'}],
          expectedOrder: ['e', '6']
        },
        {
          load: [{id: 'x'}, {id: 'p'}, {id: 'w'}, {id: 'h'}],
          expectedLayers: [{id: '6'}, {id: 'e'}, {id: 'x'}, {id: 'p'}, {id: 'w'}, {id: 'h'}],
          expectedOrder: ['x', 'e', 'p', 'w', '6', 'h']
        },
        {
          load: [{id: 'm'}],
          expectedLayers: [
            {id: '6'},
            {id: 'e'},
            {id: 'x'},
            {id: 'p'},
            {id: 'w'},
            {id: 'h'},
            {id: 'm'}
          ],
          expectedOrder: ['x', 'm', 'e', 'p', 'w', '6', 'h']
        }
      ],
      expectedLayers: [{id: '6'}, {id: 'e'}, {id: 'x'}, {id: 'p'}, {id: 'w'}, {id: 'h'}, {id: 'm'}],
      expectedOrder: ['x', 'm', 'e', 'p', 'w', '6', 'h']
    },
    {
      preservedOrder: ['x', 'm', 'e', 'p', 'w', '6', 'h'],
      batches: [
        {
          load: [{id: 'x'}, {id: 'm'}],
          expectedLayers: [{id: 'x'}, {id: 'm'}],
          expectedOrder: ['x', 'm']
        },
        {
          load: [{id: 'w'}],
          expectedLayers: [{id: 'x'}, {id: 'm'}, {id: 'w'}],
          expectedOrder: ['x', 'm', 'w']
        },
        {
          load: [{id: 'p'}],
          expectedLayers: [{id: 'x'}, {id: 'm'}, {id: 'w'}, {id: 'p'}],
          expectedOrder: ['x', 'm', 'p', 'w']
        },
        {
          load: [{id: 'e'}, {id: 'h'}, {id: '6'}],
          expectedLayers: [
            {id: 'x'},
            {id: 'm'},
            {id: 'w'},
            {id: 'p'},
            {id: 'e'},
            {id: 'h'},
            {id: '6'}
          ],
          expectedOrder: ['x', 'm', 'e', 'p', 'w', '6', 'h']
        }
      ],
      expectedOrder: ['x', 'm', 'e', 'p', 'w', '6', 'h'],
      expectedLayers: [{id: 'x'}, {id: 'm'}, {id: 'w'}, {id: 'p'}, {id: 'e'}, {id: 'h'}, {id: '6'}]
    }
  ];

  testCases.forEach(({preservedOrder, batches, expectedOrder, expectedLayers}) => {
    let currentLayers = [];
    let currentOrder = [];

    // add layers in batch
    for (const batch of batches) {
      const {newLayerOrder, newLayers} = insertLayerAtRightOrder(
        currentLayers,
        batch.load,
        currentOrder,
        preservedOrder
      );
      currentLayers = newLayers;
      currentOrder = newLayerOrder;

      t.deepEqual(currentLayers, batch.expectedLayers, 'Should insert layer at correct Order');
      t.deepEqual(currentOrder, batch.expectedOrder, 'Should reconstruct layer order');
    }

    t.deepEqual(currentLayers, expectedLayers, 'Should insert layer at correct Order');
    t.deepEqual(currentOrder, expectedOrder, 'Should reconstruct layer order');
  });

  t.end();
});

test('VisStateMerger -> insertLayerAtRightOrder -> to empty config', t => {
  const preservedOrder = ['a', 'b', 'c', 'd'];

  const batches = [
    {load: [{id: 'b'}], expectedLayers: [{id: 'm'}, {id: 'b'}], expectedOrder: ['b', 'm']},
    {
      load: [{id: 'a'}, {id: 'c'}],
      expectedLayers: [{id: 'm'}, {id: 'b'}, {id: 'a'}, {id: 'c'}],
      expectedOrder: ['a', 'b', 'c', 'm']
    },
    {
      load: [{id: 'd'}],
      expectedLayers: [{id: 'm'}, {id: 'b'}, {id: 'a'}, {id: 'c'}, {id: 'd'}],
      expectedOrder: ['a', 'b', 'c', 'd', 'm']
    }
  ];

  let currentLayers = [{id: 'm'}];
  let currentOrder = ['m'];

  // add layers in batch
  for (const batch of batches) {
    const {newLayerOrder, newLayers} = insertLayerAtRightOrder(
      currentLayers,
      batch.load,
      currentOrder,
      preservedOrder
    );
    currentLayers = newLayers;
    currentOrder = newLayerOrder;

    t.deepEqual(currentLayers, batch.expectedLayers, 'Should insert layer at correct Order');
    t.deepEqual(currentOrder, batch.expectedOrder, 'Should reconstruct layer order');
  }

  t.end();
});

test('VisStateMerger -> load polygon filter map', t => {
  const oldState = mockStateWithPolygonFilter();

  const oldFilter = oldState.visState.filters[0];

  const appStateToSave = SchemaManager.save(oldState);
  const stateParsed = SchemaManager.load(appStateToSave);
  const initialState = cloneDeep(InitialState);
  const initialVisState = initialState.visState;

  const visState = visStateReducer(
    initialVisState,
    updateVisData(stateParsed.datasets, {}, stateParsed.config)
  );

  const newFilter = visState.filters[0];

  t.deepEqual(newFilter, oldFilter, 'Should have loaded the polygon filter correctly');
  t.end();
});

test('VisStateMerger -> createLayerFromConfig with Parsed Layer', t => {
  const oldState = CloneDeep(StateWFiles);

  t.equal(oldState.visState.layers.length, 2, 'Should have layers');

  // mock an exported layer config with visual channels
  const savedLayer = visStateSchema[CURRENT_VERSION].save({
    layers: [oldState.visState.layers[0]],
    layerOrder: [oldState.visState.layers[0].id]
  }).visState.layers[0];

  t.ok(savedLayer.visualChannels, 'Should have visualChannels');

  const addedLayer = createLayerFromConfig(oldState.visState, savedLayer);

  t.ok(addedLayer.visConfigSettings, 'Should have visConfig settings loaded correctly');

  t.end();
});

const MOCK_MERGE_TASK = Task.fromPromise(
  time => new Promise(resolve => window.setTimeout(resolve, time)),
  'MOCK_MERGE_TASK'
);
const mergeSuccess = payload => ({
  type: 'MERGE_SUCCESS',
  payload
});
const mergeError = payload => ({
  type: 'MERGE_ERROR',
  payload
});

function mockMergeSuccessUpdater(state, action) {
  const {mergerActionPayload, dataId} = action.payload;
  const nextState = {
    ...state,
    visState: {
      ...state.visState,
      isMergingDatasets: {
        ...state.isMergingDatasets,
        [dataId]: false
      }
    }
  };
  return {
    ...nextState,
    visState: applyMergersUpdater(nextState.visState, mergerActionPayload)
  };
}

function asyncMerger(
  state,
  {processToBeMerged, operationsToBeMerged},
  fromConfig,
  mergerActionPayload
) {
  if (!processToBeMerged) {
    return state;
  }
  const {dataId} = processToBeMerged;

  if (!state.datasets[dataId] && (processToBeMerged || operationsToBeMerged)) {
    return {
      ...state,
      processToBeMerged,
      operationsToBeMerged
    };
  }
  const nextState = {
    ...state,
    isMergingDatasets: {
      ...state.isMergingDatasets,
      [dataId]: true
    }
  };

  const mergeMergeTasks = MOCK_MERGE_TASK(100).bimap(
    () => mergeSuccess({mergerActionPayload, dataId}),
    err => mergeError({mergerActionPayload, dataId, err})
  );

  return withTask(nextState, mergeMergeTasks);
}
const mockMerger = {
  merge: asyncMerger,
  // test props being an array
  prop: ['process', 'operations'],
  toMergeProp: ['processToBeMerged', 'operationsToBeMerged'],
  waitToFinish: true
};

// prepare reducers
const mockReducer = keplerGlReducer
  .initialState({
    visState: {
      process: undefined,
      processToBeMerged: undefined,
      mergers: [mockMerger, ...VIS_STATE_MERGERS]
    }
  })
  .plugin({
    MERGE_SUCCESS: mockMergeSuccessUpdater,
    MERGE_ERROR: mockMergeSuccessUpdater
  });

// eslint-disable-next-line max-statements
test('VisStateMerger -> asyne mergers', t => {
  // adding mock process to state
  const stateToSave = cloneDeep(StateWMultiFilters);
  const appStateToSave = SchemaManager.save(stateToSave);
  const stateParsed = SchemaManager.load(appStateToSave);

  const configWithProcess = {
    ...stateParsed.config,
    visState: {
      ...stateParsed.config.visState,
      process: {dataId: testCsvDataId}
    }
  };
  drainTasksForTesting();
  const initialState = mockReducer(undefined, registerEntry({id: 'test'}));

  // apply config with process to merge
  const nextState = mockReducer(
    initialState,
    // add csv data first
    updateVisData(
      stateParsed.datasets.find(d => d.info.id === testCsvDataId),
      {},
      configWithProcess
    )
  );

  t.deepEqual(
    nextState.test.visState.isMergingDatasets,
    {[testCsvDataId]: true},
    'should set test dataId to true'
  );
  t.equal(nextState.test.visState.layers.length, 0, 'should not add any layers');
  t.equal(nextState.test.visState.filters.length, 0, 'should not add any filters');
  t.equal(
    nextState.test.visState.layerToBeMerged.length,
    2,
    'should have 2 layers waiting to be merged'
  );

  t.ok(nextState.test.visState.datasets[testCsvDataId], 'should add csv data');
  const tasks = drainTasksForTesting();
  t.equal(tasks.length, 1, 'should create 1 task');
  t.equal(tasks[0].type, 'MOCK_MERGE_TASK', 'should create merger task');

  // add another dataset will async merger is in process
  const nextState1 = mockReducer(
    nextState,
    // add geojson data
    updateVisData(stateParsed.datasets.find(d => d.info.id === testGeoJsonDataId))
  );

  t.ok(nextState1.test.visState.datasets[testGeoJsonDataId], 'should add geojson data');

  t.deepEqual(
    nextState1.test.visState.isMergingDatasets,
    {[testCsvDataId]: true},
    'isMergingDatasets of dataId is still true'
  );

  t.equal(nextState1.test.visState.layers.length, 1, 'should merge 1 layer');
  t.equal(
    nextState1.test.visState.layers[0].config.dataId,
    testGeoJsonDataId,
    'should only merge layer of geojson data'
  );

  t.equal(nextState1.test.visState.filters.length, 2, 'should merge 2 filters');
  t.deepEqual(
    nextState1.test.visState.filters.map(f => f.dataId),
    [[testGeoJsonDataId], [testGeoJsonDataId]],
    'should merge 2 filters of geojson data'
  );

  // async merge succeed
  const nextState2 = mockReducer(nextState1, succeedTaskInTest(tasks[0], undefined));
  t.deepEqual(
    nextState2.test.visState.isMergingDatasets,
    {[testCsvDataId]: false},
    'should set isMerging data to false'
  );

  t.equal(nextState2.test.visState.layers.length, 2, 'should merge 2 layers');
  t.equal(
    nextState2.test.visState.layers[1].config.dataId,
    testCsvDataId,
    'should merge layer of csv data'
  );
  t.equal(nextState2.test.visState.filters.length, 5, 'should merge 5 filters');

  t.end();
});
