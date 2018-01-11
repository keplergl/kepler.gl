import test from 'tape';
import cloneDeep from 'lodash.clonedeep';

import {
  mergeFilters,
  mergeLayers,
  mergeInteractions,
  mergeLayerBlending
} from '../../../src/reducers/vis-state-merger';

import SchemaManager from '../../../../schemas/app-schema';
import visStateReducer from '../../../src/reducers/vis-state';
import {updateVisData} from '../../../src/actions/vis-state-actions';

// fixtures
import AppStateSavedV0 from '../../../../../test/schemas/fixtures/app-state-saved-v0.json';
import AppStateSavedV1 from '../../../../../test/schemas/fixtures/app-state-saved-v1.json';
import AppStateSavedV1Split from '../../../../../test/schemas/fixtures/app-state-saved-v1-split.json';

import {
  expectedMergedFilters,
  expectedMergedLayers,
  expectedMergedInteractions
} from '../../../../../test/schemas/fixtures/app-state-parsed';

import {
  mergedFiltersV1,
  mergedLayersV1,
  mergedInteractionV1
} from '../../../../../test/schemas/fixtures/app-state-parsed-v1';

import {
  mergedLayersV1Split,
  mergedSplitMapsV1
} from '../../../../../test/schemas/fixtures/app-state-parsed-v1-split';

// helpers
import {cmpFilters, cmpLayers} from '../../../../../test/util/comparison-utils';

// mock app state
import {
  InitialAppState,
  StateWFilters,
  StateWFilesFiltersLayerColor
} from '../../../../../test/util/mock-app-state';
import {receiveMapConfig} from "../../../../actions/app-thunk-actions";

test('VisStateMerger.v0 -> mergeFilters -> toEmptyState', t => {
  const savedConfig = cloneDeep(AppStateSavedV0);
  const oldAppState = InitialAppState.toJS();
  const oldVisState = oldAppState.visState;

  const parsedConfig = SchemaManager.parseSavedConfig(
    savedConfig.config.appConfig,
    oldAppState
  );
  const parsedFilters = parsedConfig.visState.filters;

  const mergedState = mergeFilters(oldAppState.visState, parsedFilters);

  Object.keys(oldVisState).forEach(key => {
    if (key === 'filterToBeMerged') {
      t.deepEqual(
        mergedState.filterToBeMerged,
        parsedFilters,
        'Should save filters to filterToBeMerged before data loaded'
      );
    } else {
      t.deepEqual(
        mergedState[key],
        oldVisState[key],
        'Should keep the rest of state same'
      );
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed filters
  cmpFilters(t, expectedMergedFilters, stateWData.filters);
  t.end();
});

test('VisStateMerger.v1 -> mergeFilters -> toEmptyState', t => {
  const savedConfig = cloneDeep(AppStateSavedV1);
  const oldAppState = InitialAppState.toJS();
  const oldVisState = oldAppState.visState;

  const parsedConfig = SchemaManager.parseSavedConfig(
    savedConfig.config.appConfig,
    oldAppState
  );
  const parsedFilters = parsedConfig.visState.filters;

  const mergedState = mergeFilters(oldAppState.visState, parsedFilters);

  Object.keys(oldVisState).forEach(key => {
    if (key === 'filterToBeMerged') {
      t.deepEqual(
        mergedState.filterToBeMerged,
        parsedFilters,
        'Should save filters to filterToBeMerged before data loaded'
      );
    } else {
      t.deepEqual(
        mergedState[key],
        oldVisState[key],
        'Should keep the rest of state same'
      );
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed filters
  cmpFilters(t, mergedFiltersV1, stateWData.filters);
  t.end();
});

test('VisStateMerger.v0 -> mergeFilters -> toWorkingState', t => {
  const savedConfig = cloneDeep(AppStateSavedV0);
  const oldAppState = StateWFilters.toJS();

  const oldVisState = oldAppState.visState;
  const oldFilters = [...oldAppState.visState.filters];

  const parsedConfig = SchemaManager.parseSavedConfig(
    savedConfig.config.appConfig,
    oldAppState
  );
  const parsedFilters = parsedConfig.visState.filters;

  const mergedState = mergeFilters(oldAppState.visState, parsedFilters);

  Object.keys(oldVisState).forEach(key => {
    if (key === 'filterToBeMerged') {
      t.deepEqual(
        mergedState.filterToBeMerged,
        parsedFilters,
        'Should save filters to filterToBeMerged before data loaded'
      );
    } else {
      t.deepEqual(
        mergedState[key],
        oldVisState[key],
        'Should keep the rest of state same'
      );
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed filters
  cmpFilters(t, [...oldFilters, ...expectedMergedFilters], stateWData.filters);
  t.deepEqual(
    stateWData.filterToBeMerged,
    [],
    'should clear up filterToBeMerged'
  );

  // should filter data
  t.end();
});

test('VisStateMerger.v1 -> mergeFilters -> toWorkingState', t => {
  const savedConfig = cloneDeep(AppStateSavedV1);
  const oldAppState = StateWFilters.toJS();

  const oldVisState = oldAppState.visState;
  const oldFilters = [...oldAppState.visState.filters];

  const parsedConfig = SchemaManager.parseSavedConfig(
    savedConfig.config.appConfig,
    oldAppState
  );
  const parsedFilters = parsedConfig.visState.filters;

  const mergedState = mergeFilters(oldAppState.visState, parsedFilters);

  Object.keys(oldVisState).forEach(key => {
    if (key === 'filterToBeMerged') {
      t.deepEqual(
        mergedState.filterToBeMerged,
        parsedFilters,
        'Should save filters to filterToBeMerged before data loaded'
      );
    } else {
      t.deepEqual(
        mergedState[key],
        oldVisState[key],
        'Should keep the rest of state same'
      );
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed filters
  cmpFilters(t, [...oldFilters, ...mergedFiltersV1], stateWData.filters);
  t.deepEqual(
    stateWData.filterToBeMerged,
    [],
    'should clear up filterToBeMerged'
  );

  // should filter data
  t.end();
});

test('VisStateMerger.current -> mergeLayers -> toEmptyState', t => {
  const stateToSave = StateWFilesFiltersLayerColor.toJS();
  const appStateToSave = SchemaManager.getAppStateToSave(stateToSave);
  const configToSave = appStateToSave.config.appConfig;
  const configParsed = SchemaManager.parseSavedConfig(configToSave);

  const oldAppState = InitialAppState.toJS();
  const oldVisState = oldAppState.visState;

  const parsedLayers = configParsed.visState.layers;

  // mergeLayers
  const mergedState = mergeLayers(oldAppState.visState, parsedLayers);

  Object.keys(oldVisState).forEach(key => {
    if (key === 'layerToBeMerged') {
      t.deepEqual(
        mergedState.layerToBeMerged,
        parsedLayers,
        'Should save layers to layerToBeMerged before data loaded'
      );
    } else {
      t.deepEqual(
        mergedState[key],
        oldVisState[key],
        'Should keep the rest of state same'
      );
    }
  });
  const parsedData = SchemaManager.parseSavedData(appStateToSave.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed layers
  const genericLayersByOrder = stateToSave.visState.layerOrder.map(
    idx => stateToSave.visState.layers[idx]
  );
  cmpLayers(t, genericLayersByOrder, stateWData.layers, {id: true});
  t.end();
});

test('VisStateMerger.v1 -> mergeLayers -> toEmptyState', t => {
  const savedConfig = cloneDeep(AppStateSavedV1);
  const parsedConfig = SchemaManager.parseSavedConfig(
    savedConfig.config.appConfig
  );

  const oldAppState = InitialAppState.toJS();
  const oldVisState = oldAppState.visState;

  const parsedLayers = parsedConfig.visState.layers;

  // mergeLayers
  const mergedState = mergeLayers(oldAppState.visState, parsedLayers);

  Object.keys(oldVisState).forEach(key => {
    if (key === 'layerToBeMerged') {
      t.deepEqual(
        mergedState.layerToBeMerged,
        parsedLayers,
        'Should save layers to layerToBeMerged before data loaded'
      );
    } else {
      t.deepEqual(
        mergedState[key],
        oldVisState[key],
        'Should keep the rest of state same'
      );
    }
  });
  const parsedData = SchemaManager.parseSavedData(AppStateSavedV1.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed layers
  cmpLayers(t, mergedLayersV1, stateWData.layers, {id: true});
  t.end();
});

test('VisStateMerger.v1 -> mergeLayers -> toEmptyState', t => {
  const savedConfig = cloneDeep(AppStateSavedV1Split);
  const parsedConfig = SchemaManager.parseSavedConfig(
    savedConfig.config.appConfig
  );
  const oldAppState = InitialAppState.toJS();
  const oldVisState = oldAppState.visState;

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
      t.deepEqual(
        mergedState.splitMaps,
        mergedSplitMapsV1,
        'Should merge splitMaps'
      );
    } else if (key === 'interactionToBeMerged') {
      t.deepEqual(
        mergedState.interactionToBeMerged,
        {tooltip: parsedConfig.visState.interactionConfig.tooltip},
        'Should save interactionConfig to interactionToBeMerged'
      );
    } else {
      t.deepEqual(
        mergedState[key],
        oldVisState[key],
        `Should keep ${key} the same`
      );
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test split Maps
  t.deepEqual(stateWData.splitMaps, mergedSplitMapsV1, 'should merge splitMaps');

  // test parsed layers
  cmpLayers(t, mergedLayersV1Split, stateWData.layers, {id: true});
  t.end();
});

test('VisStateMerger.v0 -> mergeLayers -> toWorkingState', t => {
  const savedConfig = cloneDeep(AppStateSavedV0);
  const parsedConfig = SchemaManager.parseSavedConfig(
    savedConfig.config.appConfig
  );

  const oldAppState = StateWFilesFiltersLayerColor.toJS();
  const oldVisState = oldAppState.visState;
  const oldLayers = [...oldVisState.layers];

  const parsedLayers = parsedConfig.visState.layers;

  // mergeLayers
  const mergedState = mergeLayers(oldAppState.visState, parsedLayers);

  Object.keys(oldVisState).forEach(key => {
    if (key === 'layerToBeMerged') {
      t.deepEqual(
        mergedState.layerToBeMerged,
        parsedLayers,
        'Should save layers to layerToBeMerged before data loaded'
      );
    } else {
      t.deepEqual(
        mergedState[key],
        oldVisState[key],
        'Should keep the rest of state same'
      );
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed layers
  cmpLayers(t, [...oldLayers, ...expectedMergedLayers], stateWData.layers);

  t.deepEqual(
    stateWData.layerOrder,
    [3, 4, 5, 6, 7, 2, 0, 1],
    'should put new layers on top of old ones'
  );
  t.deepEqual(
    stateWData.layerToBeMerged,
    [],
    'should clean up layer to be merged'
  );
  t.equal(stateWData.layerData.length, 8, 'should calculate layer data');

  t.end();
});

test('VisStateMerger.v1 -> mergeLayers -> toWorkingState', t => {
  const savedConfig = cloneDeep(AppStateSavedV1);
  const parsedConfig = SchemaManager.parseSavedConfig(
    savedConfig.config.appConfig
  );

  const oldAppState = StateWFilesFiltersLayerColor.toJS();
  const oldVisState = oldAppState.visState;
  const oldLayers = [...oldVisState.layers];

  const parsedLayers = parsedConfig.visState.layers;

  // mergeLayers
  const mergedState = mergeLayers(oldAppState.visState, parsedLayers);

  Object.keys(oldVisState).forEach(key => {
    if (key === 'layerToBeMerged') {
      t.deepEqual(
        mergedState.layerToBeMerged,
        parsedLayers,
        'Should save layers to layerToBeMerged before data loaded'
      );
    } else {
      t.deepEqual(
        mergedState[key],
        oldVisState[key],
        'Should keep the rest of state same'
      );
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed filters
  cmpLayers(t, [...oldLayers, ...mergedLayersV1], stateWData.layers);

  t.deepEqual(
    stateWData.layerOrder,
    [3, 4, 2, 0, 1],
    'should put new layers on top of old ones'
  );
  t.deepEqual(
    stateWData.layerToBeMerged,
    [],
    'should clean up layer to be merged'
  );
  t.equal(stateWData.layerData.length, 5, 'should calculate layer data');

  t.end();
});

test('VisStateMerger.v0 -> mergeInteractions -> toEmptyState', t => {
  const savedConfig = cloneDeep(AppStateSavedV0);
  const oldAppState = InitialAppState.toJS();
  const oldVisState = oldAppState.visState;

  const parsedConfig = SchemaManager.parseSavedConfig(
    savedConfig.config.appConfig,
    oldAppState
  );
  const parsedInteraction = parsedConfig.visState.interactionConfig;

  // merge interactions
  const mergedState = mergeInteractions(
    oldAppState.visState,
    parsedInteraction
  );

  Object.keys(oldVisState).forEach(key => {
    if (key === 'interactionToBeMerged') {
      t.deepEqual(
        mergedState.interactionToBeMerged,
        {
          tooltip: {
            fieldsToShow: {
              '9h10t7fyb': ['eta', 'device', 'has_destination'],
              v79816te8: ['ID', 'ZIP_CODE']
            },
            enabled: true
          }
        },
        'Should save interactions to interactionToBeMerged before data loaded'
      );
    } else if (key === 'interactionConfig') {
      t.deepEqual(
        mergedState.interactionConfig,
        {
          tooltip: {
            id: 'tooltip',
            icon: 'messages',
            enabled: true,
            config: {
              fieldsToShow: {}
            }
          },
          brush: {
            id: 'brush',
            enabled: false,
            icon: 'crosshairs',
            config: {
              size: 0.5
            }
          }
        },

        'Should disable interaction: null'
      );
    } else {
      t.deepEqual(
        mergedState[key],
        oldVisState[key],
        'Should keep the rest of state same'
      );
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed interactions
  t.deepEqual(
    stateWData.interactionConfig,
    expectedMergedInteractions,
    'should merge interactionconfig'
  );
  t.deepEqual(stateWData.interactionToBeMerged, {}, 'should clear interaction');

  t.end();
});

test('VisStateMerger.v0 -> mergeInteractions -> toWorkingState', t => {
  const savedConfig = cloneDeep(AppStateSavedV0);
  const oldAppState = StateWFilesFiltersLayerColor.toJS();
  const oldVisState = oldAppState.visState;

  // add random items to interactionToBeMerged
  oldVisState.interactionToBeMerged = {
    ...oldVisState.interactionToBeMerged,
    tooltip: {
      fieldsToShow: {
        milkshake: ['have', 'a', 'good', 'day']
      }
    }
  };

  const parsedConfig = SchemaManager.parseSavedConfig(
    savedConfig.config.appConfig,
    oldAppState
  );

  const parsedInteraction = parsedConfig.visState.interactionConfig;

  // merge interactions
  const mergedState = mergeInteractions(
    oldAppState.visState,
    parsedInteraction
  );

  const expectedInteractionToBeMerged = {
    tooltip: {
      fieldsToShow: {
        '9h10t7fyb': ['eta', 'device', 'has_destination'],
        v79816te8: ['ID', 'ZIP_CODE']
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
      t.deepEqual(
        mergedState[key],
        oldVisState[key],
        'Should keep the rest of state same'
      );
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  const expectedInteractions = {
    tooltip: {
      id: 'tooltip',
      enabled: true,
      icon: 'messages',
      config: {
        fieldsToShow: {
          '190vdll3di': [
            'gps_data.utc_timestamp',
            'gps_data.types',
            'epoch',
            'has_driver_initiated_contact',
            'id'
          ],
          ieukmgne: ['OBJECTID', 'ZIP_CODE', 'ID', 'TRIPS', 'RATE'],
          '9h10t7fyb': ['eta', 'device', 'has_destination'],
          v79816te8: ['ID', 'ZIP_CODE']
        }
      }
    },
    brush: {
      id: 'brush',
      enabled: false,
      icon: 'crosshairs',
      config: {size: 0.5}
    }
  };

  // test parsed interactions
  t.deepEqual(
    stateWData.interactionConfig,
    expectedInteractions,
    'should merge interactionconfig'
  );
  t.deepEqual(stateWData.interactionToBeMerged, {}, 'should clear interaction');

  t.end();
});

test('VisStateMerger.v1 -> mergeInteractions -> toEmptyState', t => {
  const savedConfig = cloneDeep(AppStateSavedV1);
  const oldAppState = InitialAppState.toJS();
  const oldVisState = oldAppState.visState;

  const parsedConfig = SchemaManager.parseSavedConfig(
    savedConfig.config.appConfig,
    oldAppState
  );
  const parsedInteraction = parsedConfig.visState.interactionConfig;

  // merge interactions
  const mergedState = mergeInteractions(
    oldAppState.visState,
    parsedInteraction
  );

  Object.keys(oldVisState).forEach(key => {
    if (key === 'interactionToBeMerged') {
      t.deepEqual(
        mergedState.interactionToBeMerged,
        {
          tooltip: {
            fieldsToShow: {
              a5ybmwl2d: ['a_zip', 'c_zip_type', 'c_billing_zip']
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
          tooltip: {
            id: 'tooltip',
            icon: 'messages',
            enabled: false,
            config: {
              fieldsToShow: {}
            }
          },
          brush: {
            id: 'brush',
            enabled: false,
            icon: 'crosshairs',
            config: {
              size: 1
            }
          }
        },

        'Should disable interaction: null'
      );
    } else {
      t.deepEqual(
        mergedState[key],
        oldVisState[key],
        'Should keep the rest of state same'
      );
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed interactions
  t.deepEqual(
    stateWData.interactionConfig,
    mergedInteractionV1,
    'should merge interactionconfig'
  );
  t.deepEqual(stateWData.interactionToBeMerged, {}, 'should clear interaction');

  t.end();
});

test('VisStateMerger.v1 -> mergeInteractions -> toWorkingState', t => {
  const savedConfig = cloneDeep(AppStateSavedV1);
  const oldAppState = StateWFilesFiltersLayerColor.toJS();
  const oldVisState = oldAppState.visState;

  // add random items to interactionToBeMerged
  oldVisState.interactionToBeMerged = {
    ...oldVisState.interactionToBeMerged,
    tooltip: {
      fieldsToShow: {
        milkshake: ['have', 'a', 'good', 'day']
      }
    }
  };

  const parsedConfig = SchemaManager.parseSavedConfig(
    savedConfig.config.appConfig,
    oldAppState
  );

  const parsedInteraction = parsedConfig.visState.interactionConfig;

  // merge interactions
  const mergedState = mergeInteractions(
    oldAppState.visState,
    parsedInteraction
  );

  const expectedInteractionToBeMerged = {
    tooltip: {
      fieldsToShow: {
        a5ybmwl2d: ['a_zip', 'c_zip_type', 'c_billing_zip']
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
          tooltip: {
            id: 'tooltip',
            icon: 'messages',
            enabled: false,
            config: {
              fieldsToShow: {
                '190vdll3di': [
                  'gps_data.utc_timestamp',
                  'gps_data.types',
                  'epoch',
                  'has_driver_initiated_contact',
                  'id'
                ],
                ieukmgne: ['OBJECTID', 'ZIP_CODE', 'ID', 'TRIPS', 'RATE']
              }
            }
          },
          brush: {
            id: 'brush',
            enabled: false,
            icon: 'crosshairs',
            config: {
              size: 1
            }
          }
        },

        'Should disable interaction: null'
      );
    } else {
      t.deepEqual(
        mergedState[key],
        oldVisState[key],
        'Should keep the rest of state same'
      );
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  const expectedInteractions = {
    tooltip: {
      id: 'tooltip',
      enabled: false,
      icon: 'messages',
      config: {
        fieldsToShow: {
          '190vdll3di': [
            'gps_data.utc_timestamp',
            'gps_data.types',
            'epoch',
            'has_driver_initiated_contact',
            'id'
          ],
          ieukmgne: ['OBJECTID', 'ZIP_CODE', 'ID', 'TRIPS', 'RATE'],
          a5ybmwl2d: ['a_zip', 'c_zip_type', 'c_billing_zip']
        }
      }
    },
    brush: {
      id: 'brush',
      enabled: false,
      icon: 'crosshairs',
      config: {size: 1}
    }
  };

  // test parsed interactions
  t.deepEqual(
    stateWData.interactionConfig,
    expectedInteractions,
    'should merge interactionconfig'
  );
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
