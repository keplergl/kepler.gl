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

  t.equal(newState.mapStyle.styleType, 'light', 'Map style is set correctly');

  t.end();
});

test('#composerStateReducer - addDataToMapUpdater: mapState should not be centered', t => {
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

  t.equal(
    newState.mapState.latitude,
    mapStateProperties.latitude,
    'mapstate latitude is set correctly'
  );
  t.equal(
    newState.mapState.longitude,
    mapStateProperties.longitude,
    'mapstate longitude is set correctly'
  );

  t.end();
});

test.only('#composerStateReducer - addDataToMapUpdater: keepExistingConfig', t => {
  const data = processCsvData(testCsvData);

  const state = keplerGlReducer({}, registerEntry({id: 'test'})).test;
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
  console.log(oldState.visState.splitMaps)

  const {
    layers: oldLayers,
    filters: oldFilters,
    datasets: oldDatasets,
    interactionConfig: oldInteractionConfig,
    splitMaps: oldSplitMaps
  } = oldState.visState;

  const hexData = processCsvData(testHexIdData);
  const hexDataId = hexIdDataConfig.dataId;

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

  t.equal(hexDataset.allData.length, hexData.rows.length, 'should have same length of allData');
  t.equal(hexDataset.fields.length, hexData.fields.length, 'should have same length of fields');
  t.equal(hexDataset.id, hexDataId, 'should have the id');

  cmpLayers(t, [mergedH3Layer], nextState1.visState.layers);
  cmpFilters(t, mergedFilters, nextState1.visState.filters);

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
        avlgol: {
          isAvailable: true,
          isVisible: true
        }
      }},
      {layers: {
        ...oldSplitMaps[0].layers,
        avlgol: {
          isAvailable: true,
          isVisible: true
        }
      }}
    ],
    layerOrder: [2, 0, 1]
  };

  cmpLayers(t, expectedVisState.layers, actualVisState.layers);
  cmpFilters(t, expectedVisState.filters, actualVisState.filters);
  cmpDatasets(t, expectedVisState.datasets, actualVisState.datasets);
  cmpInteraction(t, expectedVisState.interactionConfig, actualVisState.interactionConfig);
  t.deepEqual(expectedVisState.layerOrder, actualVisState.layerOrder, 'Should create new layer, move it to the top');
  t.deepEqual(expectedVisState.splitMaps, actualVisState.splitMaps, 'Should merge splitMaps');
  // const expectedState = {
  //   layerOrder: [1, 0]
  // };
  t.end();
});
