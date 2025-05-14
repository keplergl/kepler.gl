// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* eslint-disable max-statements */

import {drainTasksForTesting, succeedTaskWithValues} from 'react-palm/tasks';
import test from 'tape';

import {registerEntry} from '@kepler.gl/actions';
import {processCsvData} from '@kepler.gl/processors';
import keplerGlReducer, {
  addDataToMapUpdater,
  replaceDataInMapUpdater,
  fitBoundsUpdater,
  INITIAL_UI_STATE,
  visStateReducer,
  mapStateReducer
} from '@kepler.gl/reducers';
import {getTimeBins} from '@kepler.gl/utils';

import testCsvData, {sampleConfig, dataWithNulls} from 'test/fixtures/test-csv-data';
import testHexIdData, {
  hexIdDataConfig,
  mergedH3Layer,
  mergedFilters,
  expectedMergedDataset
} from 'test/fixtures/test-hex-id-data';
import {cmpLayers, cmpFilters, cmpDataset, cmpInteraction} from 'test/helpers/comparison-utils';
import {applyExistingDatasetTasks} from 'test/helpers/mock-state';

import {StateWSyncedTimeFilter} from '../../helpers/mock-state';
import {testCsvDataSlice1Id, testCsvDataSlice2Id} from '../../fixtures/test-csv-data';

const mockRawData = {
  fields: [
    {
      name: 'start_point_lat',
      id: 'start_point_lat',
      displayName: 'start_point_lat',
      type: 'real',
      fieldIdx: 0
    },
    {
      name: 'start_point_lng',
      id: 'start_point_lng',
      displayName: 'start_point_lng',
      type: 'real',
      fieldIdx: 2
    },
    {
      name: 'end_point_lat',
      id: 'end_point_lat',
      displayName: 'end_point_lat',
      type: 'real',
      fieldIdx: 3
    },
    {
      name: 'end_point_lng',
      id: 'end_point_lng',
      displayName: 'end_point_lng',
      type: 'real',
      fieldIdx: 4
    }
  ],
  rows: [
    [12.25, 37.75, 45.21, 100.12],
    [null, 35.2, 45.0, 21.3],
    [12.29, 37.64, 46.21, 99.127],
    [null, null, 33.1, 29.34]
  ]
};

test('#composerStateReducer - addDataToMapUpdater: mapStyle', t => {
  // init kepler.gl root and instance
  const state = keplerGlReducer(undefined, registerEntry({id: 'test'})).test;

  const newState = addDataToMapUpdater(state, {
    payload: {
      datasets: {
        data: mockRawData,
        info: {
          id: 'foo'
        }
      },
      options: null,
      config: {
        mapStyle: {
          styleType: 'light'
        }
      }
    }
  });

  drainTasksForTesting();

  t.equal(newState.mapStyle.styleType, 'light', 'Map style is set correctly');

  t.end();
});

test('#composerStateReducer - addDataToMapUpdater: mapState should be centered (after dataset tasts are completed)', t => {
  // init kepler.gl root and instance
  const state = keplerGlReducer({}, registerEntry({id: 'test'})).test;
  const mapStateProperties = {
    latitude: 33.88608913680742,
    longitude: -84.43459130456425
  };
  let newState = addDataToMapUpdater(state, {
    payload: {
      datasets: {
        data: mockRawData,
        info: {
          id: 'foo'
        }
      },
      options: {
        centerMap: true
      },
      config: {
        mapState: mapStateProperties
      }
    }
  });

  // create datasets from existing tasks, trigger auto create layers
  newState.visState = applyExistingDatasetTasks(visStateReducer, newState.visState);

  // layers should generate a fit bounds task
  const tasks = drainTasksForTesting();
  t.equal(tasks.length, 1, 'Should create one fit bounds task');

  newState.mapState = mapStateReducer(newState.mapState, succeedTaskWithValues(tasks[0], {}));

  t.equal(newState.mapState.latitude, 29.23, 'centerMap: true should override mapState config');
  t.equal(newState.mapState.longitude, 60.71, 'centerMap: true should override mapState config');

  t.end();
});

test('#composerStateReducer - addDataToMapUpdater: uiState', t => {
  // init kepler.gl root and instance
  const state = keplerGlReducer(undefined, registerEntry({id: 'test'})).test;

  const newState = addDataToMapUpdater(state, {
    payload: {
      datasets: {
        data: mockRawData,
        info: {
          id: 'foo'
        }
      }
    }
  });

  drainTasksForTesting();

  const expectedUIState = {
    ...INITIAL_UI_STATE,
    initialState: {},
    readOnly: false,
    currentModal: null
  };

  t.deepEqual(
    newState.uiState,
    expectedUIState,
    'ui state should be set readOnly:false,currentModal: null'
  );

  t.end();
});

test('#composerStateReducer - addDataToMapUpdater: keepExistingConfig', t => {
  const data = processCsvData(testCsvData);

  const state = keplerGlReducer({}, registerEntry({id: 'test'})).test;

  // old state contain splitMaps
  let oldState = addDataToMapUpdater(state, {
    payload: {
      datasets: {
        data,
        info: {
          id: sampleConfig.dataId
        }
      },
      config: sampleConfig.config
    }
  });

  // create datasets from existing tasks, trigger auto create layers
  oldState = {...oldState, visState: applyExistingDatasetTasks(visStateReducer, oldState.visState)};

  const {
    layers: oldLayers,
    filters: oldFilters,
    datasets: oldDatasets,
    interactionConfig: oldInteractionConfig,
    splitMaps: oldSplitMaps
  } = oldState.visState;

  const hexData = processCsvData(testHexIdData);
  const hexDataId = hexIdDataConfig.dataId;

  // keepExistingConfig is not defined, default to false
  let nextState1 = addDataToMapUpdater(oldState, {
    payload: {
      datasets: {
        data: hexData,
        info: {
          id: hexDataId
        }
      },
      config: hexIdDataConfig.config
    }
  });

  // create datasets from existing tasks, trigger auto create layers
  nextState1 = {
    ...nextState1,
    visState: applyExistingDatasetTasks(visStateReducer, nextState1.visState)
  };

  t.deepEqual(nextState1.visState.layerOrder, ['avlgol'], 'Should contain nextState1 layer order');

  cmpDataset(t, expectedMergedDataset, nextState1.visState.datasets[hexDataId]);

  t.deepEqual(nextState1.visState.splitMaps, [], 'should clear out splitMaps');

  cmpLayers(t, [mergedH3Layer], nextState1.visState.layers);
  cmpFilters(t, mergedFilters, nextState1.visState.filters);

  // add data and config keep existing data and config
  let nextState2 = addDataToMapUpdater(oldState, {
    payload: {
      datasets: {
        data: hexData,
        info: {
          id: hexDataId
        }
      },
      config: hexIdDataConfig.config,
      options: {
        keepExistingConfig: true
      }
    }
  });

  // create datasets from existing tasks, trigger auto create layers
  nextState2 = {
    ...nextState2,
    visState: applyExistingDatasetTasks(visStateReducer, nextState2.visState)
  };

  const actualVisState = nextState2.visState;

  const newLayers = [...oldLayers, mergedH3Layer];
  const expectedVisState = {
    layers: newLayers,
    filters: [...oldFilters, ...mergedFilters],
    datasets: 'test seperate',
    interactionConfig: {
      ...oldInteractionConfig,
      tooltip: {
        ...oldInteractionConfig.tooltip,
        config: {
          compareMode: false,
          compareType: 'absolute',
          fieldsToShow: {
            ...oldInteractionConfig.tooltip.config.fieldsToShow,
            [hexDataId]: [
              {
                name: 'hex_id',
                format: null
              },
              {
                name: 'value',
                format: null
              }
            ]
          }
        }
      }
    },
    splitMaps: [
      {
        layers: {
          ...oldSplitMaps[0].layers,
          avlgol: true
        }
      },
      {
        layers: {
          ...oldSplitMaps[1].layers,
          avlgol: true
        }
      }
    ],
    layerOrder: [newLayers[2].id, newLayers[0].id, newLayers[1].id]
  };

  cmpLayers(t, expectedVisState.layers, actualVisState.layers);
  cmpFilters(t, expectedVisState.filters, actualVisState.filters);
  // test datasets
  t.deepEqual(
    Object.keys(actualVisState.datasets),
    [sampleConfig.dataId, hexDataId],
    'should save 2 datasets to state'
  );

  t.equal(
    actualVisState.datasets[sampleConfig.dataId],
    oldDatasets[sampleConfig.dataId],
    'should keep oldDataset same'
  );

  cmpDataset(
    t,
    expectedMergedDataset,
    actualVisState.datasets[hexDataId],
    'should merge and filter hexdata'
  );

  cmpInteraction(t, expectedVisState.interactionConfig, actualVisState.interactionConfig);
  t.deepEqual(
    expectedVisState.layerOrder,
    actualVisState.layerOrder,
    'Should create new layer, move it to the top'
  );

  t.deepEqual(
    expectedVisState.splitMaps,
    actualVisState.splitMaps,
    'Should keep existing splitMaps, add new layers to splitMaps'
  );

  t.end();
});

test('#composerStateReducer - addDataToMapUpdater: readOnly', t => {
  const datasets = {
    data: processCsvData(testCsvData),
    info: {
      id: sampleConfig.dataId
    }
  };
  const state = keplerGlReducer({}, registerEntry({id: 'test'})).test;

  // old state contain splitMaps
  const nextState = addDataToMapUpdater(state, {
    payload: {
      datasets,
      options: {
        readOnly: true
      }
    }
  });
  t.equal(nextState.uiState.readOnly, true, 'should set readonly to be true');

  const nextState1 = addDataToMapUpdater(state, {
    payload: {
      datasets
    }
  });
  t.equal(nextState1.uiState.readOnly, false, 'should set readonly to be false');

  const nextState2 = addDataToMapUpdater(state, {
    payload: {
      datasets,
      options: {
        readOnly: false
      }
    }
  });
  t.equal(nextState2.uiState.readOnly, false, 'should set readonly to be false');
  t.end();
});

test('#composerStateReducer - addDataToMapUpdater: autoCreateLayers', t => {
  const datasets = {
    data: processCsvData(testCsvData),
    info: {
      id: sampleConfig.dataId
    }
  };
  const state = keplerGlReducer({}, registerEntry({id: 'test'})).test;

  // old state contain splitMaps
  const nextState = addDataToMapUpdater(state, {
    payload: {
      datasets,
      options: {
        autoCreateLayers: false
      }
    }
  });
  t.equal(nextState.visState.layers.length, 0, 'should not create layers');

  t.end();
});

test('#composerStateReducer - replaceDataInMapUpdater', t => {
  const dataIdToReplace = 'dataset_to_replace';
  const datasets = {
    data: processCsvData(testCsvData),
    info: {
      id: sampleConfig.dataId
    }
  };
  const datasetToUse = {
    data: processCsvData(dataWithNulls),
    info: {
      id: dataIdToReplace
    }
  };
  const state = keplerGlReducer({}, registerEntry({id: 'test'})).test;

  // old state contain splitMaps
  let oldState = addDataToMapUpdater(state, {
    payload: {
      datasets,
      config: sampleConfig.config
    }
  });

  // create datasets from existing tasks, trigger auto create layers
  oldState = {...oldState, visState: applyExistingDatasetTasks(visStateReducer, oldState.visState)};

  const oldSavedConfig = state.visState.schema.getConfigToSave(oldState).config;
  let nextState = replaceDataInMapUpdater(oldState, {
    payload: {
      datasetToReplaceId: sampleConfig.dataId,
      datasetToUse
    }
  });
  // create datasets from existing tasks, trigger auto create layers
  nextState = {
    ...nextState,
    visState: applyExistingDatasetTasks(visStateReducer, nextState.visState)
  };

  // layers should generate a fit bounds task
  const tasks = drainTasksForTesting();
  t.equal(tasks.length, 1, 'Should create one fit bounds task');
  nextState = {
    ...nextState,
    mapState: mapStateReducer(nextState.mapState, succeedTaskWithValues(tasks[0], {}))
  };

  const nextSavedConfig = nextState.visState.schema.getConfigToSave(nextState).config;

  const expectedLayers = oldSavedConfig.visState.layers.map(l => ({
    ...l,
    config: {
      ...l.config,
      dataId: dataIdToReplace
    }
  }));

  const bounds = nextState.visState.layers[0].meta.bounds;
  const expectedMapState = fitBoundsUpdater(oldState.mapState, {payload: bounds});

  const expectedInteractionConfig = {
    ...oldSavedConfig.visState.interactionConfig,
    tooltip: {
      ...oldSavedConfig.visState.interactionConfig.tooltip,
      fieldsToShow: {
        [dataIdToReplace]:
          oldSavedConfig.visState.interactionConfig.tooltip.fieldsToShow[sampleConfig.dataId]
      }
    }
  };

  // dataWithNulls gps_data.utc_timestamp domain
  const expectedFilterDomain = [1474071056000, 1474071677000];
  const expectedFilter = {
    ...oldSavedConfig.visState.filters[0],
    dataId: [dataIdToReplace],
    // reset vaue to bonded by domain
    value: expectedFilterDomain
  };

  t.deepEqual(
    nextState.visState.filters[0].domain,
    expectedFilterDomain,
    'Should set corect filter domain'
  );
  // compare replaced state with old state
  Object.keys(oldSavedConfig).forEach(key => {
    if (key === 'mapState') {
      // should center map
      t.deepEqual(nextState.mapState, expectedMapState, 'should center map to new layer;');
    } else if (key === 'visState') {
      Object.keys(oldSavedConfig.visState).forEach(prop => {
        if (prop === 'layers') {
          t.deepEqual(
            nextSavedConfig.visState.layers,
            expectedLayers,
            'should replace layer dataId'
          );
        } else if (prop === 'filters') {
          t.deepEqual(
            nextSavedConfig.visState.filters,
            [expectedFilter],
            'should replace filter dataId and reset value'
          );
        } else if (prop === 'interactionConfig') {
          t.deepEqual(
            nextSavedConfig.visState.interactionConfig,
            expectedInteractionConfig,
            'should replace interactionConfig dataId'
          );
        } else {
          t.deepEqual(
            nextSavedConfig.visState[prop],
            oldSavedConfig.visState[prop],
            `visState.${prop} should not change`
          );
        }
      });
    } else {
      // mapStyle
      t.deepEqual(nextSavedConfig[key], oldSavedConfig[key], 'mapStyle should not change');
    }
  });

  t.deepEqual(nextState.visState.layerToBeMerged, [], 'should reset layerToBeMerged');
  t.deepEqual(nextState.visState.filterToBeMerged, [], 'should reset filterToBeMerged');
  t.deepEqual(nextState.visState.interactionToBeMerged, {}, 'should reset interactionToBeMerged');
  t.deepEqual(nextState.visState.splitMapsToBeMerged, [], 'should reset splitMapsToBeMerged');
  t.end();
});

test('#composerStateReducer - replaceDataInMapUpdater: same dataId', t => {
  const datasets = {
    data: processCsvData(testCsvData),
    info: {
      id: sampleConfig.dataId
    }
  };
  const datasetToUse = {
    data: processCsvData(dataWithNulls),
    info: {
      id: sampleConfig.dataId
    }
  };
  const state = keplerGlReducer({}, registerEntry({id: 'test'})).test;

  // old state contain splitMaps
  let oldState = addDataToMapUpdater(state, {
    payload: {
      datasets,
      config: sampleConfig.config
    }
  });
  // create datasets from existing tasks, trigger auto create layers
  oldState = {...oldState, visState: applyExistingDatasetTasks(visStateReducer, oldState.visState)};

  const oldSavedConfig = state.visState.schema.getConfigToSave(oldState).config;

  let nextState = replaceDataInMapUpdater(oldState, {
    payload: {
      datasetToReplaceId: sampleConfig.dataId,
      datasetToUse
    }
  });
  // create datasets from existing tasks, trigger auto create layers
  nextState = {
    ...nextState,
    visState: applyExistingDatasetTasks(visStateReducer, nextState.visState)
  };

  // dataset should be replaced
  t.ok(nextState.visState.datasets[sampleConfig.dataId], ' dataset should be replaced');
  const nextSavedConfig = nextState.visState.schema.getConfigToSave(nextState).config;

  const expectedLayers = oldSavedConfig.visState.layers.map(l => ({
    ...l,
    config: {
      ...l.config,
      dataId: sampleConfig.dataId
    }
  }));
  t.deepEqual(nextSavedConfig.visState.layers, expectedLayers, 'should replace layer dataId');
  t.end();
});

test('#composerStateReducer - replaceDataInMapUpdater: syncedTimeFilter & match', t => {
  const oldState = StateWSyncedTimeFilter;
  const dataIdToReplace = 'dataset_to_replace';

  const datasetToUse = {
    data: processCsvData(dataWithNulls),
    info: {
      id: dataIdToReplace
    }
  };

  let nextState = replaceDataInMapUpdater(oldState, {
    payload: {
      datasetToReplaceId: testCsvDataSlice1Id,
      datasetToUse
    }
  });
  // create datasets from existing tasks, trigger auto create layers
  nextState = {
    ...nextState,
    visState: applyExistingDatasetTasks(visStateReducer, nextState.visState)
  };

  const oldFilter = oldState.visState.filters[0];
  const expectedFilter = {
    ...oldState.visState.filters[0],
    dataId: [dataIdToReplace, testCsvDataSlice2Id],
    // union [147407 1056000, 147407 1677000]; [147407 1301000, 1474072208000];
    domain: [1474071056000, 1474072208000],
    // value [1474071116000, 1474072188000] is still within so it doesnt change
    value: oldState.visState.filters[0].value,
    timeBins: {},
    plotType: {
      ...oldState.visState.filters[0].plotType,
      colorsByDataId: {
        [dataIdToReplace]: '#FF0000',
        'test-csv-data-2': '#00FF00'
      }
    }
  };

  // should recalculate timeBins based on new datasets
  expectedFilter.timeBins = getTimeBins(
    expectedFilter,
    nextState.visState.datasets,
    oldFilter.plotType.interval
  );

  t.deepEqual(
    nextState.visState.filters,
    [expectedFilter],
    'should replace dataset with syncd filter'
  );
  const expectedDomain0 = 1474071056000;
  const expectedGpuFilter = {
    filterRange: [
      [expectedFilter.value[0] - expectedDomain0, expectedFilter.value[1] - expectedDomain0],
      [0, 0],
      [0, 0],
      [0, 0]
    ],
    filterValueUpdateTriggers: {
      gpuFilter_0: {name: 'gps_data.utc_timestamp', domain0: expectedDomain0},
      gpuFilter_1: null,
      gpuFilter_2: null,
      gpuFilter_3: null
    },
    filterValueAccessor: 'dont test me'
  };
  t.deepEqual(
    nextState.visState.datasets[dataIdToReplace].gpuFilter.filterRange,
    expectedGpuFilter.filterRange,
    'gpu filterRange should be correct'
  );
  t.deepEqual(
    nextState.visState.datasets[dataIdToReplace].gpuFilter.filterValueUpdateTriggers,
    expectedGpuFilter.filterValueUpdateTriggers,
    'gpu filterValueUpdateTriggers should be correct'
  );
  t.deepEqual(
    nextState.visState.datasets[testCsvDataSlice2Id].gpuFilter.filterRange,
    expectedGpuFilter.filterRange,
    'gpu filterRange should be correct'
  );
  t.deepEqual(
    nextState.visState.datasets[testCsvDataSlice2Id].gpuFilter.filterValueUpdateTriggers,
    expectedGpuFilter.filterValueUpdateTriggers,
    'gpu filterValueUpdateTriggers should be correct'
  );

  t.end();
});

test('#composerStateReducer - replaceDataInMapUpdater: syncedTimeFilter & no match', t => {
  const oldState = StateWSyncedTimeFilter;
  const dataIdToReplace = 'dataset_to_replace';

  const datasetToUse = {
    // a different dataset with no match
    data: processCsvData(testHexIdData),
    info: {
      id: dataIdToReplace
    }
  };

  let nextState = replaceDataInMapUpdater(oldState, {
    payload: {
      datasetToReplaceId: testCsvDataSlice1Id,
      datasetToUse
    }
  });
  // create datasets from existing tasks, trigger auto create layers
  nextState = {
    ...nextState,
    visState: applyExistingDatasetTasks(visStateReducer, nextState.visState)
  };

  t.equal(nextState.visState.filters.length, 0, 'should not merge filter if no match');
  t.equal(
    nextState.visState.layers.length,
    1,
    'should only keep 1 layer (not able to merge the other)'
  );

  t.deepEqual(oldState.visState.layers[1], nextState.visState.layers[0], 'should keep 1 layer');

  t.equal(nextState.visState.layerToBeMerged.length, 1, 'should keep unmerged in layerToBeMerged');
  t.equal(
    nextState.visState.filterToBeMerged.length,
    1,
    'should keep unmerged in filterToBeMerged'
  );

  t.deepEqual(nextState.visState.interactionToBeMerged, {}, 'should reset interactionToBeMerged');
  t.deepEqual(nextState.visState.splitMapsToBeMerged, [], 'should reset splitMapsToBeMerged');
  t.end();
});
