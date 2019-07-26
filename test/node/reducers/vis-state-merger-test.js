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

import test from 'tape';
import cloneDeep from 'lodash.clonedeep';

import {
  mergeFilters,
  mergeLayers,
  mergeInteractions,
  mergeLayerBlending
} from 'reducers/vis-state-merger';
import {Messages, Crosshairs} from 'components/common/icons';

import SchemaManager from 'schemas';
import visStateReducer from 'reducers/vis-state';
import {updateVisData} from 'actions/vis-state-actions';
import {receiveMapConfig} from 'actions/actions';
import {getDefaultInteraction} from 'utils/interaction-utils';

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

// helpers
import {cmpFilters, cmpLayers} from 'test/helpers/comparison-utils';

// mock app state
import {
  InitialState,
  StateWFilters,
  StateWFilesFiltersLayerColor
} from 'test/helpers/mock-state';

test('VisStateMerger.v0 -> mergeFilters -> toEmptyState', t => {
  const savedConfig = cloneDeep(savedStateV0);
  const oldState = cloneDeep(InitialState);
  const oldVisState = oldState.visState;

  const parsedConfig = SchemaManager.parseSavedConfig(
    savedConfig.config,
    oldState
  );
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
  cmpFilters(t, mergedFiltersV0, stateWData.filters);
  t.end();
});

test('VisStateMerger.v1 -> mergeFilters -> toEmptyState', t => {
  const savedConfig = cloneDeep(savedStateV1);
  const oldState = cloneDeep(InitialState);
  const oldVisState = oldState.visState;
  const expectedMergedFilterV1 = mergedFiltersV1;

  const parsedConfig = SchemaManager.parseSavedConfig(
    savedConfig.config,
    oldState
  );
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
  cmpFilters(t, expectedMergedFilterV1, stateWData.filters);
  t.end();
});

test('VisStateMerger.v0 -> mergeFilters -> toWorkingState', t => {
  const savedConfig = cloneDeep(savedStateV0);
  const oldState = cloneDeep(StateWFilters);

  const oldVisState = oldState.visState;
  const oldFilters = [...oldState.visState.filters];

  const parsedConfig = SchemaManager.parseSavedConfig(
    savedConfig.config,
    oldState
  );
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
  cmpFilters(t, [...oldFilters, ...mergedFiltersV0], stateWData.filters);
  t.deepEqual(
    stateWData.filterToBeMerged,
    [],
    'should clear up filterToBeMerged'
  );

  // should filter data
  t.end();
});

test('VisStateMerger.v1 -> mergeFilters -> toWorkingState', t => {
  const savedConfig = cloneDeep(savedStateV1);
  const oldState = cloneDeep(StateWFilters);

  const oldVisState = oldState.visState;
  const oldFilters = [...oldState.visState.filters];

  const parsedConfig = SchemaManager.parseSavedConfig(
    savedConfig.config,
    oldState
  );
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
  const stateToSave = cloneDeep(StateWFilesFiltersLayerColor);
  const appStateToSave = SchemaManager.save(stateToSave);
  const configToSave = appStateToSave.config;
  const configParsed = SchemaManager.parseSavedConfig(configToSave);

  const oldState = cloneDeep(InitialState);
  const oldVisState = oldState.visState;

  const parsedLayers = configParsed.visState.layers;

  // mergeLayers
  const mergedState = mergeLayers(oldState.visState, parsedLayers);

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
  // console.log(stateWData.layers[1].config.textLabel)

  // test parsed layers
  const genericLayersByOrder = stateToSave.visState.layerOrder.map(
    idx => stateToSave.visState.layers[idx]
  );
  console.log(genericLayersByOrder[1].config.textLabel)
  cmpLayers(t, genericLayersByOrder, stateWData.layers, {id: true});
  t.end();
});

test('VisStateMerger.v1 -> mergeLayers -> toEmptyState', t => {
  const savedConfig = cloneDeep(savedStateV1);
  const parsedConfig = SchemaManager.parseSavedConfig(savedConfig.config);

  const oldState = cloneDeep(InitialState);
  const oldVisState = oldState.visState;

  const parsedLayers = parsedConfig.visState.layers;

  // mergeLayers
  const mergedState = mergeLayers(oldState.visState, parsedLayers);

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
  const mergedState = mergeLayers(oldState.visState, parsedLayers);

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
  const mergedState = visStateReducer(
    oldVisState,
    receiveMapConfig(parsedConfig)
  );
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
        expectedConfig,
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
  t.deepEqual(
    stateWData.splitMaps,
    expectedConfig,
    'should merge splitMaps'
  );

  // test parsed layers
  cmpLayers(t, mergedLayersV1Split, stateWData.layers, {id: true});
  t.end();
});

/* Fixed in #618
test('VisStateMerger.v0 -> mergeLayers -> toWorkingState', t => {
  const savedConfig = cloneDeep(savedStateV0);
  const parsedConfig = SchemaManager.parseSavedConfig(
    savedConfig.config
  );

  const oldState = cloneDeep(StateWFilesFiltersLayerColor);
  const oldVisState = oldState.visState;
  const oldLayers = [...oldVisState.layers];

  const parsedLayers = parsedConfig.visState.layers;

  // mergeLayers
  const mergedState = mergeLayers(oldState.visState, parsedLayers);

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
  cmpLayers(t, [...oldLayers, ...mergedLayersV0], stateWData.layers);

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
*/
test('VisStateMerger.v1 -> mergeLayers -> toWorkingState', t => {
  const savedConfig = cloneDeep(savedStateV1);
  const parsedConfig = SchemaManager.parseSavedConfig(
    savedConfig.config
  );

  const oldState = cloneDeep(StateWFilesFiltersLayerColor);
  const oldVisState = oldState.visState;
  const oldLayers = [...oldVisState.layers];

  const parsedLayers = parsedConfig.visState.layers;

  // mergeLayers
  const mergedState = mergeLayers(oldState.visState, parsedLayers);

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
  const savedConfig = cloneDeep(savedStateV0);
  const oldState = cloneDeep(InitialState);
  const oldVisState = oldState.visState;

  const parsedConfig = SchemaManager.parseSavedConfig(
    savedConfig.config,
    oldState
  );
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
              '9h10t7fyb': ['int_range', 'detail', 'type_boolean'],
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
        oldState.visState.interactionConfig,
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
    mergedInteractionsV0,
    'should merge interactionConfig'
  );
  t.deepEqual(stateWData.interactionToBeMerged, {}, 'should clear interaction');

  t.end();
});

test('VisStateMerger.v0 -> mergeInteractions -> toWorkingState', t => {
  const savedConfig = cloneDeep(savedStateV0);
  const oldState = cloneDeep(StateWFilesFiltersLayerColor);
  const oldVisState = oldState.visState;

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
    savedConfig.config,
    oldState
  );

  const parsedInteraction = parsedConfig.visState.interactionConfig;

  // merge interactions
  const mergedState = mergeInteractions(oldState.visState, parsedInteraction);

  const expectedInteractionToBeMerged = {
    tooltip: {
      fieldsToShow: {
        '9h10t7fyb': ['int_range', 'detail', 'type_boolean'],
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
  const defaultInteraction = getDefaultInteraction();

  const expectedInteractions = {
    ...defaultInteraction,
    tooltip: {
      ...defaultInteraction.tooltip,
      enabled: true,
      config: {
        fieldsToShow: {
          '190vdll3di': [
            'gps_data.utc_timestamp',
            'gps_data.types',
            'epoch',
            'has_result',
            'id'
          ],
          ieukmgne: ['OBJECTID', 'ZIP_CODE', 'ID', 'TRIPS', 'RATE'],
          '9h10t7fyb': ['int_range', 'detail', 'type_boolean'],
          v79816te8: ['ID', 'ZIP_CODE']
        }
      }
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
  const savedConfig = cloneDeep(savedStateV1);
  const oldState = cloneDeep(InitialState);
  const oldVisState = oldState.visState;

  const parsedConfig = SchemaManager.parseSavedConfig(
    savedConfig.config,
    oldState
  );
  const parsedInteraction = parsedConfig.visState.interactionConfig;

  // merge interactions
  const mergedState = mergeInteractions(oldState.visState, parsedInteraction);
  const defaultInteraction = getDefaultInteraction();

  Object.keys(oldVisState).forEach(key => {
    if (key === 'interactionToBeMerged') {
      t.deepEqual(
        mergedState.interactionToBeMerged,
        {
          tooltip: {
            fieldsToShow: {
              a5ybmwl2d: ['a_zip', 'str_type', 'int_type']
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
          ...defaultInteraction,
          tooltip: {
            ...defaultInteraction.tooltip,
            enabled: false,
            config: {
              fieldsToShow: {}
            }
          },
          brush: {
            ...defaultInteraction.brush,
            enabled: false,
            config: {
              size: 1
            }
          }
        },

        'Should disable tooltip'
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
    MergedInteractionV1,
    'should merge interactionConfig'
  );
  t.deepEqual(stateWData.interactionToBeMerged, {}, 'should clear interaction');

  t.end();
});

test('VisStateMerger.v1 -> mergeInteractions -> toWorkingState', t => {
  const savedConfig = cloneDeep(savedStateV1);
  const oldState = cloneDeep(StateWFilesFiltersLayerColor);
  const oldVisState = oldState.visState;

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
    savedConfig.config,
    oldState
  );

  const parsedInteraction = parsedConfig.visState.interactionConfig;

  // merge interactions
  const mergedState = mergeInteractions(oldState.visState, parsedInteraction);
  const defaultInteraction = getDefaultInteraction();

  const expectedInteractionToBeMerged = {
    tooltip: {
      fieldsToShow: {
        a5ybmwl2d: ['a_zip', 'str_type', 'int_type']
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
          ...defaultInteraction,
          tooltip: {
            ...defaultInteraction.tooltip,
            enabled: false,
            config: {
              fieldsToShow: {
                '190vdll3di': [
                  'gps_data.utc_timestamp',
                  'gps_data.types',
                  'epoch',
                  'has_result',
                  'id'
                ],
                ieukmgne: ['OBJECTID', 'ZIP_CODE', 'ID', 'TRIPS', 'RATE']
              }
            }
          },

          brush: {
            ...defaultInteraction.brush,
            enabled: false,
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
    ...defaultInteraction,
    tooltip: {
      ...defaultInteraction.tooltip,
      enabled: false,
      config: {
        fieldsToShow: {
          '190vdll3di': [
            'gps_data.utc_timestamp',
            'gps_data.types',
            'epoch',
            'has_result',
            'id'
          ],
          ieukmgne: ['OBJECTID', 'ZIP_CODE', 'ID', 'TRIPS', 'RATE'],
          a5ybmwl2d: ['a_zip', 'str_type', 'int_type']
        }
      }
    },
    brush: {
      ...defaultInteraction.brush,
      enabled: false,
      config: {size: 1}
    }
  };

  // test parsed interactions
  t.deepEqual(
    stateWData.interactionConfig,
    expectedInteractions,
    'should merge interactionConfig'
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
