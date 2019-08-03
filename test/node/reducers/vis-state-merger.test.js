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
/*
import {
  mergedFiltersV0,
  expectedMergedLayers,
  expectedMergedInteractions
} from 'test/fixtures/app-state-parsed';

import {
  mergedFiltersV1,
  mergedLayersV1,
  mergedInteractionV1
} from 'test/fixtures/app-state-parsed-v1';

import {
  mergedLayersV1Split,
  mergedSplitMapsV1
} from 'test/fixtures/app-state-parsed-v1-split';
*/

// helpers
import {cmpFilters, cmpLayers} from 'test/helpers/comparison-utils';

// mock app state
import {
  InitialState,
  StateWFilters,
  StateWFilesFiltersLayerColor
} from 'test/helpers/mock-state';

it('VisStateMerger.v0 -> mergeFilters -> toEmptyState', () => {
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
      expect(mergedState.filterToBeMerged).toEqual(parsedFilters);
    } else {
      expect(mergedState[key]).toEqual(oldVisState[key]);
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed filters
  cmpFilters(mergedFiltersV0, stateWData.filters);
});

it('VisStateMerger.v1 -> mergeFilters -> toEmptyState', () => {
  const savedConfig = cloneDeep(savedStateV1);
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
      expect(mergedState.filterToBeMerged).toEqual(parsedFilters);
    } else {
      expect(mergedState[key]).toEqual(oldVisState[key]);
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed filters
  cmpFilters(mergedFiltersV1, stateWData.filters);
});

it('VisStateMerger.v0 -> mergeFilters -> toWorkingState', () => {
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
      expect(mergedState.filterToBeMerged).toEqual(parsedFilters);
    } else {
      expect(mergedState[key]).toEqual(oldVisState[key]);
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed filters
  cmpFilters( [...oldFilters, ...mergedFiltersV0], stateWData.filters);
  expect(stateWData.filterToBeMerged).toEqual([]);
});

it('VisStateMerger.v1 -> mergeFilters -> toWorkingState', () => {
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
      expect(mergedState.filterToBeMerged).toEqual(parsedFilters);
    } else {
      expect(mergedState[key]).toEqual(oldVisState[key]);
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed filters
  cmpFilters([...oldFilters, ...mergedFiltersV1], stateWData.filters);
  expect(stateWData.filterToBeMerged).toEqual([]);
});

it('VisStateMerger.current -> mergeLayers -> toEmptyState', () => {
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
      expect(mergedState.layerToBeMerged).toEqual(parsedLayers);
    } else {
      expect(mergedState[key]).toEqual(oldVisState[key]);
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

  cmpLayers(genericLayersByOrder, stateWData.layers, {id: true});
});

it('VisStateMerger.v1 -> mergeLayers -> toEmptyState', () => {
  const savedConfig = cloneDeep(savedStateV1);
  const parsedConfig = SchemaManager.parseSavedConfig(savedConfig.config);

  const oldState = cloneDeep(InitialState);
  const oldVisState = oldState.visState;

  const parsedLayers = parsedConfig.visState.layers;

  // mergeLayers
  const mergedState = mergeLayers(oldState.visState, parsedLayers);

  Object.keys(oldVisState).forEach(key => {
    if (key === 'layerToBeMerged') {
      expect(mergedState.layerToBeMerged).toEqual(parsedLayers);
    } else {
      expect(mergedState[key]).toEqual(oldVisState[key]);
    }
  });
  const parsedData = SchemaManager.parseSavedData(savedStateV1.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed layers
  cmpLayers(mergedLayersV1, stateWData.layers, {id: true, color: true});
});

it('VisStateMerger.v1.label -> mergeLayers -> toEmptyState', () => {
  const savedConfig = cloneDeep(savedStateV1Label);
  const parsedConfig = SchemaManager.parseSavedConfig(savedConfig.config);

  const oldState = cloneDeep(InitialState);
  const oldVisState = oldState.visState;

  const parsedLayers = parsedConfig.visState.layers;

  // mergeLayers
  const mergedState = mergeLayers(oldState.visState, parsedLayers);

  Object.keys(oldVisState).forEach(key => {
    if (key === 'layerToBeMerged') {
      expect(mergedState.layerToBeMerged).toEqual(parsedLayers);
    } else {
      expect(mergedState[key]).toEqual(oldVisState[key]);
    }
  });
  const parsedData = SchemaManager.parseSavedData(savedStateV1Label.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed layers
  cmpLayers(mergedLayersV1Label, stateWData.layers, {id: true});
});

it('VisStateMerger.v1.split -> mergeLayers -> toEmptyState', () => {
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
      expect(mergedState.layerToBeMerged).toEqual(parsedLayers);
    } else if (key === 'splitMaps') {
      expect(mergedState.splitMaps).toEqual(expectedConfig);
    } else if (key === 'interactionToBeMerged') {
      expect(mergedState.interactionToBeMerged).toEqual({tooltip: parsedConfig.visState.interactionConfig.tooltip});
    } else {
      expect(mergedState[key]).toEqual(oldVisState[key]);
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test split Maps
  expect(stateWData.splitMaps).toEqual(expectedConfig);

  // test parsed layers
  cmpLayers(mergedLayersV1Split, stateWData.layers, {id: true});
});

it('VisStateMerger.v0 -> mergeLayers -> toWorkingState', () => {
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
      expect(mergedState.layerToBeMerged).toEqual(parsedLayers);
    } else {
      expect(mergedState[key]).toEqual(oldVisState[key]);
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed layers
  cmpLayers([...oldLayers, ...mergedLayersV0], stateWData.layers);

  expect(stateWData.layerOrder).toEqual([3, 4, 5, 6, 7, 2, 0, 1]);

  expect(stateWData.layerToBeMerged).toEqual([]);

  expect(stateWData.layerData.length).toBe(8);
});

it('VisStateMerger.v1 -> mergeLayers -> toWorkingState', () => {
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
      expect(mergedState.layerToBeMerged).toEqual(parsedLayers);
    } else {
      expect(mergedState[key]).toEqual(oldVisState[key]);
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed filters
  cmpLayers([...oldLayers, ...mergedLayersV1], stateWData.layers);

  expect(stateWData.layerOrder).toEqual([3, 4, 2, 0, 1]);
  expect(stateWData.layerToBeMerged).toEqual([]);
  expect(stateWData.layerData.length).toBe(5);
});

it('VisStateMerger.v0 -> mergeInteractions -> toEmptyState', () => {
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
      expect(mergedState.interactionToBeMerged).toEqual(
        {
          tooltip: {
            fieldsToShow: {
              '9h10t7fyb': ['int_range', 'detail', 'type_boolean'],
              v79816te8: ['ID', 'ZIP_CODE']
            },
            enabled: true
          }
        }
      );
    } else if (key === 'interactionConfig') {
      expect(mergedState.interactionConfig).toEqual(oldState.visState.interactionConfig);
    } else {
      expect(mergedState[key]).toEqual(oldVisState[key]);
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed interactions
  expect(stateWData.interactionConfig).toEqual(mergedInteractionsV0);
  expect(stateWData.interactionToBeMerged).toEqual({});
});

it('VisStateMerger.v0 -> mergeInteractions -> toWorkingState', () => {
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
      expect(mergedState.interactionToBeMerged).toEqual(expectedInteractionToBeMerged);
    } else {
      expect(mergedState[key]).toEqual(oldVisState[key]);
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
  expect(stateWData.interactionConfig).toEqual(expectedInteractions);
  expect(stateWData.interactionToBeMerged).toEqual({});
});

it('VisStateMerger.v1 -> mergeInteractions -> toEmptyState', () => {
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
      expect(mergedState.interactionToBeMerged).toEqual(
        {
          tooltip: {
            fieldsToShow: {
              a5ybmwl2d: ['a_zip', 'str_type', 'int_type']
            },
            enabled: false
          }
        }
      );
    } else if (key === 'interactionConfig') {
      expect(mergedState.interactionConfig).toEqual(
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
        }
      );
    } else {
      expect(mergedState[key]).toEqual(oldVisState[key]);
    }
  });

  const parsedData = SchemaManager.parseSavedData(savedConfig.datasets);

  // load data into reducer
  const stateWData = visStateReducer(mergedState, updateVisData(parsedData));

  // test parsed interactions
  expect(stateWData.interactionConfig).toEqual(MergedInteractionV1);
  expect(stateWData.interactionToBeMerged).toEqual({});
});

it('VisStateMerger.v1 -> mergeInteractions -> toWorkingState', () => {
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
      expect(mergedState.interactionToBeMerged).toEqual(expectedInteractionToBeMerged);
    } else if (key === 'interactionConfig') {
      expect(mergedState.interactionConfig).toEqual(
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
        }
      );
    } else {
      expect(mergedState[key]).toEqual(oldVisState[key],
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
  expect(stateWData.interactionConfig).toEqual(expectedInteractions);
  expect(stateWData.interactionToBeMerged).toEqual({});
});

it('VisStateMerger - mergeLayerBlending', () => {
  const preState = {
    layerBlending: 'additive'
  };

  expect(mergeLayerBlending(preState, 'normal')).toEqual({layerBlending: 'normal'});

  expect(mergeLayerBlending(preState, undefined)).toEqual({layerBlending: 'additive'});

  expect(mergeLayerBlending(preState, 'not_exist')).toEqual({layerBlending: 'additive'});

  expect(mergeLayerBlending(preState, null)).toEqual({layerBlending: 'additive'});
});
