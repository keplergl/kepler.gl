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

import keplerGlReducer from 'reducers';
import {addDataToMapUpdater} from 'reducers/combined-updaters';
import {registerEntry} from 'actions/identity-actions';
import {processCsvData} from 'processors/data-processor';

import testCsvData, {sampleConfig} from 'test/fixtures/test-csv-data';
import testHexIdData, {hexIdDataConfig, mergedH3Layer, mergedFilters} from 'test/fixtures/test-hex-id-data';
import {cmpLayers, cmpFilters, cmpDatasets, cmpInteraction} from 'test/helpers/comparison-utils';

const mockRawData = {
  fields: [
    {
      name: 'start_point_lat',
      type: 'real',
      tableFieldIndex: 1
    },
    {
      name: 'start_point_lng',
      type: 'real',
      tableFieldIndex: 3
    },
    {
      name: 'end_point_lat',
      type: 'real',
      tableFieldIndex: 4
    },
    {
      name: 'end_point_lng',
      type: 'real',
      tableFieldIndex: 2
    }
  ],
  rows: [
    [12.25, 37.75, 45.21, 100.12],
    [null, 35.2, 45.0, 21.3],
    [12.29, 37.64, 46.21, 99.127],
    [null, null, 33.1, 29.34]
  ]
};

it('#composerStateReducer - addDataToMapUpdater: mapStyle', () => {
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

  expect(newState.mapStyle.styleType).toBe('light');
});

it('#composerStateReducer - addDataToMapUpdater: mapState should not be centered', () => {
  // init kepler.gl root and instance
  const state = keplerGlReducer({}, registerEntry({id: 'test'})).test;
  const mapStateProperties = {
    latitude: 33.88608913680742,
    longitude: -84.43459130456425
  };

  const newState = addDataToMapUpdater(state, {
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

  expect(newState.mapState.latitude).toBe(29.23);
  expect(newState.mapState.longitude).toBe(60.71);
});

it('#composerStateReducer - addDataToMapUpdater: keepExistingConfig', () => {
  const data = processCsvData(testCsvData);

  const state = keplerGlReducer({}, registerEntry({id: 'test'})).test;

  // old state contain splitMaps
  const oldState = addDataToMapUpdater(state, {
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
  const nextState1 = addDataToMapUpdater(oldState, {
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

  const hexDataset = nextState1.visState.datasets[hexDataId];

  expect(hexDataset.allData.length).toBe(hexData.rows.length);
  expect(hexDataset.fields.length).toBe(hexData.fields.length);
  expect(hexDataset.id).toBe(hexDataId);
  expect(nextState1.visState.splitMaps).toEqual([]);

  // should only create 1 layer and clear out others
  cmpLayers([mergedH3Layer], nextState1.visState.layers);
  cmpFilters(mergedFilters, nextState1.visState.filters);

  // add data and config keep existing data and config
  const nextState2 = addDataToMapUpdater(oldState, {
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

  const actualVisState = nextState2.visState;

  const expectedVisState = {
    layers: [...oldLayers, mergedH3Layer],
    filters: [...oldFilters, ...mergedFilters],
    datasets: {
      ...oldDatasets,
      [hexDataId]: hexDataset
    },
    interactionConfig: {
      ...oldInteractionConfig,
      tooltip: {
        ...oldInteractionConfig.tooltip,
        config: {
          fieldsToShow: {
            ...oldInteractionConfig.tooltip.config.fieldsToShow,
            [hexDataId]: ['hex_id', 'value']
          }
        }
      }
    },
    splitMaps: [
      {layers: {
        ...oldSplitMaps[0].layers,
        avlgol: true
      }},
      {layers: {
        ...oldSplitMaps[1].layers,
        avlgol: true
      }}
    ],
    layerOrder: [2, 0, 1]
  };

  cmpLayers(expectedVisState.layers, actualVisState.layers);
  cmpFilters(expectedVisState.filters, actualVisState.filters);
  cmpDatasets(expectedVisState.datasets, actualVisState.datasets);
  cmpInteraction(expectedVisState.interactionConfig, actualVisState.interactionConfig);
  expect(expectedVisState.layerOrder).toEqual(actualVisState.layerOrder);
  expect(expectedVisState.splitMaps).toEqual(actualVisState.splitMaps);
});
