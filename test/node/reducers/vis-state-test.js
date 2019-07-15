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

import test from 'tape-catch';
import CloneDeep from 'lodash.clonedeep';

import * as VisStateActions from 'actions/vis-state-actions';
import * as MapStateActions from 'actions/map-state-actions';
import reducer from 'reducers/vis-state';

import {INITIAL_VIS_STATE} from 'reducers/vis-state-updaters';

import {getLightSettingsFromBounds} from 'utils/layer-utils/layer-utils';
import {filterData, getDefaultFilter} from 'utils/filter-utils';
import {createNewDataEntry} from 'utils/dataset-utils';
import {processCsvData, processGeojson} from 'processors/data-processor';

import {Layer, KeplerGlLayers} from 'layers';
const {ArcLayer, PointLayer, GeojsonLayer, LineLayer} = KeplerGlLayers;
// fixtures
import testData, {testFields, testAllData} from 'test/fixtures/test-csv-data';
import {
  geojsonData,
  geoBounds,
  geoLghtSettings,
  fields as geojsonFields
} from 'test/fixtures/geojson';

// test helpers
import {
  cmpFilters,
  cmpLayers,
  cmpDatasets,
  cmpDataset
} from 'test/helpers/comparison-utils';
import {applyActions} from 'test/helpers/mock-state';
import {LAYER_VIS_CONFIGS} from 'layers/layer-factory';
import {getNextColorMakerValue} from 'test/helpers/layer-utils';

const mockData = {
  fields: [
    {
      name: 'start_point_lat',
      type: 'real'
    },
    {
      name: 'start_point_lng',
      type: 'real'
    },
    {
      name: 'end_point_lat',
      type: 'real'
    },
    {
      name: 'end_point_lng',
      type: 'real'
    }
  ],
  data: [
    [12.25, 37.75, 45.21, 100.12],
    [null, 35.2, 45.0, 21.3],
    [12.29, 37.64, 46.21, 99.127],
    [null, null, 33.1, 29.34]
  ]
};

const expectedFields = [
  {
    name: 'start_point_lat',
    id: 'start_point_lat',
    type: 'real',
    tableFieldIndex: 1
  },
  {
    name: 'start_point_lng',
    id: 'start_point_lng',
    type: 'real',
    tableFieldIndex: 2
  },
  {
    name: 'end_point_lat',
    id: 'end_point_lat',
    type: 'real',
    tableFieldIndex: 3
  },
  {
    name: 'end_point_lng',
    id: 'end_point_lng',
    type: 'real',
    tableFieldIndex: 4
  }
];

const mockFilter = {
  fieldIdx: 0,
  name: mockData.fields[0].name,
  type: 'range',
  fieldType: 'real',
  value: [12.25, 12.28]
};

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

const InitialVisState = reducer(undefined, {});
test('#visStateReducer', t => {
  reducer(undefined, {});

  t.deepEqual(
    reducer(undefined, {}),
    {...INITIAL_VIS_STATE, initialState: {}},
    'should return the initial state'
  );

  t.end();
});

test('#visStateReducer -> ADD_FILTER', t => {
  const dataId = 'kitten';
  const newFilter = getDefaultFilter(dataId);
  const newReducer = reducer(
    {filters: [mockFilter]},
    VisStateActions.addFilter(dataId)
  );

  const expectedReducer = {filters: [mockFilter, newFilter]};

  t.equal(
    newReducer.filters.length,
    expectedReducer.filters.length,
    'should add a default filter'
  );

  t.deepEqual(
    newReducer.filters[0],
    expectedReducer.filters[0],
    'should add a default filter'
  );

  cmpFilters(t, newReducer.filters[1], expectedReducer.filters[1]);
  t.end();
});

test('#visStateReducer -> ADD_LAYER.1', t => {
  const oldState = {
    ...InitialVisState,
    datasets: {
      puppy: {
        data: mockData.data,
        fields: mockData.fields
      }
    },
    layers: [{id: 'existing_layer'}],
    layerData: [[{data: [1, 2, 3]}, {data: [4, 5, 6]}]],
    layerOrder: [0],
    splitMaps: [{
      layers: {existing_layer: false}
    },{
      layers: {existing_layer: false}
    }]
  };

  const newReducer = reducer(oldState, VisStateActions.addLayer());
  const newId = newReducer.layers[1].id;
  const expectedSplitMaps = [
    {
      layers: {
        existing_layer:false,
        [newId]: true
      }
    },
    {
      layers: {
        existing_layer: false,
        [newId]: true
      }
    }
  ];

  t.equal(newReducer.layers.length, 2, 'should have 2 layers');
  t.equal(
    newReducer.layers[1].config.isVisible,
    true,
    'newLayer visibility should be set to true'
  );
  t.equal(
    newReducer.layers[1].config.isConfigActive,
    true,
    'newLayer isConfigActive should be set to true'
  );
  t.equal(
    newReducer.layers[1].config.dataId,
    'puppy',
    'newLayer dataId should be set to default'
  );
  t.deepEqual(
    newReducer.layerData,
    [oldState.layerData[0], {}],
    'newState should have empty layer datat'
  );
  t.deepEqual(newReducer.layerOrder, [0, 1], 'should add to layerOrder');
  t.deepEqual(
    newReducer.splitMaps,
    expectedSplitMaps,
    'should add to SplitMaps'
  );

  t.end();
});

test('#visStateReducer -> LAYER_TYPE_CHANGE.1', t => {
  const layer = new Layer({id: 'more_layer'});
  const oldState = {
    ...InitialVisState,
    datasets: {
      puppy: {
        data: mockData.data,
        fields: mockData.fields
      }
    },
    layers: [{id: 'existing_layer'}, layer],
    layerData: [[{data: [1, 2, 3]}, {data: [4, 5, 6]}]],
    layerOrder: [1, 0],
    splitMaps: [
      {
        layers: {
          existing_layer: false,
          more_layer: true
        }
      },
      {
        layers: {
          existing_layer: false,
          more_layer: false
        }
      }
    ]
  };

  const nextState = reducer(
    oldState,
    VisStateActions.layerTypeChange(layer, 'point')
  );
  const newId = nextState.layers[1].id;
  const expectedSplitMaps = [
    {
      layers: {
        existing_layer: false,
        [newId]: true
      }
    },
    {
      layers: {
        existing_layer: false,
        [newId]: false
      }
    }
  ];

  t.ok(nextState.layers[1].id !== 'more_layer', 'should update layer id');

  t.equal(nextState.layers[1].type, 'point', 'should update type to point');

  t.deepEqual(
    nextState.splitMaps,
    expectedSplitMaps,
    'should add newId to SplitMaps, and replace old id'
  );

  t.end();
});

test('#visStateReducer -> LAYER_TYPE_CHANGE.2', t => {
  const pointLayer = new PointLayer({id: 'a', dataId: 'smoothie'});
  const mockColorRange = {
    name: 'abc',
    isReversed: true,
    colors: ['a', 'b', 'c']
  };
  const smoothie = createNewDataEntry({
    info: {id: 'smoothie'},
    data: {
      rows: testAllData,
      fields: testFields
    }
  });
  const oldState = {
    ...InitialVisState,
    datasets: smoothie,
    layers: [pointLayer],
    layerData: []
  };

  // set point layer colorField to a string field
  const stringField = testFields.find(f => f.type === 'string');
  let nextState = reducer(
    oldState,
    VisStateActions.layerVisualChannelConfigChange(
      pointLayer,
      {colorField: stringField},
      'color'
    )
  );
  nextState = reducer(
    nextState,
    VisStateActions.layerVisConfigChange(nextState.layers[0], {
      colorRange: mockColorRange
    })
  );
  const newLayer = nextState.layers[0];
  t.equal(newLayer.config.colorField, stringField, 'should update colorField');
  t.equal(newLayer.config.colorScale, 'ordinal', 'should scale to ordinal');
  t.deepEqual(
    newLayer.config.colorDomain,
    ['driver_analytics', 'driver_gps'],
    'should calculate color domain'
  );
  t.equal(
    newLayer.config.visConfig.colorRange,
    mockColorRange,
    'should update color range'
  );

  // set point layer sizeField to a int field
  const intField = testFields.find(f => f.type === 'integer');
  let nextState2 = reducer(
    nextState,
    VisStateActions.layerVisualChannelConfigChange(
      newLayer,
      {sizeField: intField},
      'size'
    )
  );
  nextState2 = reducer(
    nextState2,
    VisStateActions.layerVisConfigChange(nextState2.layers[0], {
      radiusRange: [5, 10]
    })
  );
  const newLayer2 = nextState2.layers[0];
  t.equal(newLayer2.config.sizeField, intField, 'should update sizeField');
  t.equal(newLayer2.config.sizeScale, 'sqrt', 'should scale to linear');
  t.deepEqual(
    newLayer2.config.sizeDomain,
    [1, 12124],
    'should calculate size domain'
  );
  t.deepEqual(
    newLayer2.config.visConfig.radiusRange,
    [5, 10],
    'should update size range'
  );

  // change point layer type to hexagon
  const nextState3 = reducer(
    nextState2,
    VisStateActions.layerTypeChange(newLayer2, 'hexagon')
  );

  const newLayer3 = nextState3.layers[0];
  t.equal(newLayer3.type, 'hexagon', 'should change type to hexagon');
  t.equal(
    newLayer3.config.colorField,
    stringField,
    'should keep colorField'
  );
  t.deepEqual(
    newLayer3.config.colorDomain,
    [0, 1],
    'should set colorDomain to default, it is calculated inside deck.gl layer'
  );
  t.equal(
    newLayer3.config.colorScale,
    'ordinal',
    'should set colorScale to ordinal'
  );
  t.equal(
    newLayer3.config.sizeScale,
    'linear',
    'should set sizeScale to default'
  );
  t.deepEqual(
    newLayer3.config.sizeDomain,
    [0, 1],
    'should set sizeDomain to default'
  );
  t.equal(newLayer3.config.sizeField, intField, 'should keep sizeField');
  t.notEqual(newLayer3.id, newLayer2.id, 'should change id');
  t.equal(
    newLayer3.config.visConfig.colorRange,
    mockColorRange,
    'should not deep copy colorRange'
  );
  t.equal(
    newLayer3.config.visConfig.sizeRange,
    LAYER_VIS_CONFIGS.elevationRange.defaultValue,
    'should set sizeRange back to default'
  );

  // change point layer type to icon
  const nextState4 = reducer(
    nextState2,
    VisStateActions.layerTypeChange(newLayer2, 'icon')
  );
  const newLayer4 = nextState4.layers[0];
  t.equal(newLayer4.type, 'icon', 'should change type to icon');
  t.notEqual(newLayer4.id, newLayer2.id, 'should change id');
  t.equal(newLayer4.config.colorField, stringField, 'should keep colorField');
  t.deepEqual(
    newLayer4.config.colorDomain,
    ['driver_analytics', 'driver_gps'],
    'should calculate color domain'
  );
  t.equal(newLayer4.config.colorScale, 'ordinal', 'should keep color scale');
  t.equal(newLayer4.config.sizeField, intField, 'should keep sizeField');
  t.equal(newLayer4.config.sizeScale, 'sqrt', 'should scale to linear');
  t.deepEqual(
    newLayer4.config.sizeDomain,
    [1, 12124],
    'should keep size domain'
  );
  t.deepEqual(
    newLayer4.config.visConfig.radiusRange,
    [5, 10],
    'should keep size range'
  );
  t.equal(
    newLayer4.config.visConfig.colorRange,
    mockColorRange,
    'should not deep copy colorRange'
  );
  t.end();
});

test('#visStateReducer -> REORDER_LAYER', t => {
  const newReducer = reducer(
    {layers: [], layerOrder: [0, 1, 2]},
    VisStateActions.reorderLayer([0, 2, 1])
  );

  t.deepEqual(
    newReducer,
    {layers: [], layerOrder: [0, 2, 1]},
    'should re order layers'
  );

  t.end();
});

test('#visStateReducer -> UPDATE_LAYER_BLENDING', t => {
  const newReducer = reducer(
    {layerBlending: 'none'},
    VisStateActions.updateLayerBlending('additive')
  );

  t.deepEqual(
    newReducer,
    {layerBlending: 'additive'},
    'should update layerBlending'
  );

  t.end();
});

test('#visStateReducer -> REMOVE_FILTER', t => {
  const currentFilters = [
    {
      fieldIdx: 0,
      dataId: 'smoothie',
      name: mockData.fields[0].name,
      type: 'range',
      value: [12.25, 12.29]
    },
    {
      fieldIdx: 1,
      dataId: 'milkshake',
      name: mockData.fields[1].name,
      type: 'range',
      value: [35.3, 37.75]
    }
  ];

  const oldState = {
    filters: currentFilters,
    datasets: {
      milkshake: {
        allData: mockData.data,
        ...filterData(mockData.data, 'milkshake', currentFilters)
      },
      smoothie: {
        allData: mockData.data,
        data: filterData(mockData.data, 'smoothie', currentFilters).data,
        ...filterData(mockData.data, 'smoothie', currentFilters)
      }
    },

    layers: [],
    layerData: []
  };

  // remove smoothie filter
  const newReducer = reducer(oldState, VisStateActions.removeFilter(0));

  t.deepEqual(
    newReducer,
    {
      filters: [
        {
          fieldIdx: 1,
          dataId: 'milkshake',
          name: mockData.fields[1].name,
          type: 'range',
          value: [35.3, 37.75]
        }
      ],
      datasets: {
        milkshake: {
          allData: mockData.data,
          data: [mockData.data[0], mockData.data[2]],
          filteredIndex: [0, 2],
          filteredIndexForDomain: [0, 2]
        },
        smoothie: {
          allData: mockData.data,
          data: mockData.data,
          filteredIndex: [0, 1, 2, 3],
          filteredIndexForDomain: [0, 1, 2, 3]
        }
      },

      layers: [],
      layerData: []
    },
    'should remove filter and recalculate data only for associated dataset'
  );

  t.end();
});

test('#visStateReducer -> REMOVE_LAYER', t => {
  const layer1 = new PointLayer({id: 'a'});
  const layer2 = new PointLayer({id: 'b'});
  const oldState = {
    layers: [layer1, layer2],
    layerData: [{data: 1}, {data: 2}],
    layerOrder: [1, 0],
    hoverInfo: {
      layer: {props: {id: 'b'}},
      picked: true
    },
    clicked: {
      layer: {props: {id: 'a'}},
      picked: true
    },
    splitMaps: []
  };

  const newReducer = reducer(oldState, VisStateActions.removeLayer(1));

  t.deepEqual(
    newReducer,
    {
      layers: [layer1],
      layerData: [{data: 1}],
      layerOrder: [0],
      hoverInfo: undefined,
      clicked: {
        layer: {props: {id: 'a'}},
        picked: true
      },
      splitMaps: []
    },
    'should remove layer and layerData'
  );

  t.end();
});

test('#visStateReducer -> UPDATE_VIS_DATA.1', t => {
  const oldState = {
    datasets: {},
    layers: [{name: 'a'}, {name: 'b'}],
    layerData: [{data: 1}, {data: 2}]
  };

  t.deepEqual(
    reducer(
      oldState,
      VisStateActions.updateVisData([{info: null, data: null}])
    ),
    oldState,
    'should return current state if no data'
  );

  t.deepEqual(
    reducer(
      oldState,
      VisStateActions.updateVisData([
        {
          data: {
            fields: null,
            rows: [1, 2]
          }
        }
      ])
    ),
    oldState,
    'should return current state if no fields'
  );

  t.deepEqual(
    reducer(
      oldState,
      VisStateActions.updateVisData([
        {
          data: {
            fields: [{name: 'a'}],
            rows: null
          }
        }
      ])
    ),
    oldState,
    'should return current state if no rows'
  );

  t.end();
});

/* eslint-disable max-statements */
test('#visStateReducer -> UPDATE_VIS_DATA.2', t => {
  const oldState = InitialVisState;

  const testState1 = reducer(
    oldState,
    VisStateActions.updateVisData({
      data: mockRawData,
      info: {id: 'smoothie', label: 'exciting dataset 1'}
    })
  );

  t.deepEqual(
    Object.keys(testState1.datasets),
    ['smoothie'],
    'should save data to smoothie'
  );

  const newState = reducer(
    oldState,
    VisStateActions.updateVisData([
      {
        data: mockRawData,
        info: {id: 'smoothie', label: 'exciting dataset'}
      }
    ])
  );

  const newStateLayers = CloneDeep(newState.layers);

  const expectedDatasets = {
    smoothie: {
      fields: expectedFields,
      filteredIndex: mockRawData.rows.map((_, i) => i),
      filteredIndexForDomain: mockRawData.rows.map((_, i) => i),
      allData: mockRawData.rows,
      data: mockRawData.rows,
      color: 'donnot test me',
      id: 'smoothie',
      label: 'exciting dataset',
      fieldPairs: [
        {
          defaultName: 'start point',
          pair: {
            lat: {
              value: 'start_point_lat',
              fieldIdx: 0
            },
            lng: {
              value: 'start_point_lng',
              fieldIdx: 1
            }
          },
          suffix: ['lat', 'lng']
        },
        {
          defaultName: 'end point',
          pair: {
            lat: {
              value: 'end_point_lat',
              fieldIdx: 2
            },
            lng: {
              value: 'end_point_lng',
              fieldIdx: 3
            }
          },
          suffix: ['lat', 'lng']
        }
      ]
    }
  };

  const expectedArcLayer = new ArcLayer({
    dataId: 'smoothie',
    label: 'start point -> end point arc',
    columns: {
      lat0: {fieldIdx: 0, value: 'start_point_lat'},
      lng0: {fieldIdx: 1, value: 'start_point_lng'},
      lat1: {fieldIdx: 2, value: 'end_point_lat'},
      lng1: {fieldIdx: 3, value: 'end_point_lng'}
    }
  });

  const expectedLineLayer = new LineLayer({
    dataId: 'smoothie',
    label: 'start point -> end point line',
    columns: {
      lat0: {fieldIdx: 0, value: 'start_point_lat'},
      lng0: {fieldIdx: 1, value: 'start_point_lng'},
      lat1: {fieldIdx: 2, value: 'end_point_lat'},
      lng1: {fieldIdx: 3, value: 'end_point_lng'}
    }
  });

  const expectedPointLayer1 = new PointLayer({
    dataId: 'smoothie',
    label: 'start point',
    columns: {
      lat: {fieldIdx: 0, value: 'start_point_lat'},
      lng: {fieldIdx: 1, value: 'start_point_lng'},
      altitude: {fieldIdx: -1, value: null, optional: true}
    },
    isVisible: true
  });

  expectedPointLayer1.meta = {
    bounds: [35.2, 12.25, 37.75, 12.29],
    lightSettings: getLightSettingsFromBounds([35.2, 12.25, 37.75, 12.29])
  };

  const expectedPointLayer2 = new PointLayer({
    dataId: 'smoothie',
    label: 'end point',
    columns: {
      lat: {fieldIdx: 2, value: 'end_point_lat'},
      lng: {fieldIdx: 3, value: 'end_point_lng'},
      altitude: {fieldIdx: -1, value: null, optional: true}
    }
  });

  expectedPointLayer2.meta = {
    bounds: [21.3, 33.1, 100.12, 46.21],
    lightSettings: getLightSettingsFromBounds([21.3, 33.1, 100.12, 46.21])
  };

  const expectedLayers = [
    expectedPointLayer1,
    expectedPointLayer2,
    expectedArcLayer,
    expectedLineLayer
  ];
  t.deepEqual(
    Object.keys(newState.datasets),
    ['smoothie'],
    'should save data to smoothie'
  );

  cmpDatasets(t, expectedDatasets, newState.datasets);
  cmpLayers(t, expectedLayers, newStateLayers);

  t.equal(
    newState.layerData.length,
    expectedLayers.length,
    'should calculate layerdata'
  );
  t.deepEqual(newState.layerOrder, [0, 1, 2, 3], 'should calculate layerOrder');

  t.end();
});

test('#visStateReducer -> UPDATE_VIS_DATA.3', t => {
  const mockLayer = new PointLayer({
    dataId: 'snowflake',
    columns: {
      lat: {
        value: 'start_point_lat',
        fieldIdx: 0
      },
      lng: {
        value: 'start_point_lng',
        fieldIdx: 1
      }
    }
  });

  const oldState = {
    ...InitialVisState,
    layers: [mockLayer],
    layerData: [[1, 2], [3, 4], [5, 6], [7, 8]],
    datasets: {
      snowflake: {
        fields: [{id: 'a'}, {id: 'b'}],
        allData: [['something'], ['something_else']],
        data: [['something']]
      }
    },
    filters: [{name: 'hello'}, {name: 'world'}],
    interactionConfig: {
      tooltip: {
        id: 'tooltip',
        enabled: true,
        icon: 'messages',
        config: {
          fieldsToShow: {snowflake: ['a']}
        }
      }
    },
    layerOrder: [0],
    layerBlending: 'additive',
    splitMaps: []
  };

  const expectedDatasets = {
    snowflake: {
      fields: [{id: 'a'}, {id: 'b'}],
      allData: [['something'], ['something_else']],
      data: [['something']]
    },
    smoothie: {
      fields: expectedFields,
      allData: mockRawData.rows,
      data: mockRawData.rows,
      color: 'donnot test me',
      filteredIndex: mockRawData.rows.map((_, i) => i),
      filteredIndexForDomain: mockRawData.rows.map((_, i) => i),
      id: 'smoothie',
      label: 'smoothie and milkshake',
      fieldPairs: [
        {
          defaultName: 'start point',
          pair: {
            lat: {
              value: 'start_point_lat',
              fieldIdx: 0
            },
            lng: {
              value: 'start_point_lng',
              fieldIdx: 1
            }
          },
          suffix: ['lat', 'lng']
        },
        {
          defaultName: 'end point',
          pair: {
            lat: {
              value: 'end_point_lat',
              fieldIdx: 2
            },
            lng: {
              value: 'end_point_lng',
              fieldIdx: 3
            }
          },
          suffix: ['lat', 'lng']
        }
      ]
    }
  };

  const expectedInteractionTooltip = {
    fieldsToShow: {snowflake: ['a'], smoothie: []}
  };

  const newState = reducer(
    oldState,
    VisStateActions.updateVisData([
      {
        data: mockRawData,
        info: {id: 'smoothie', label: 'smoothie and milkshake'}
      }
    ])
  );

  Object.keys(expectedDatasets).forEach(key =>
    cmpDataset(t, expectedDatasets[key], newState.datasets[key])
  );
  t.equal(
    newState.layers.length,
    5,
    'should find 1 arc aline and 2 point layers'
  );
  t.deepEqual(
    newState.layerOrder,
    [1, 2, 3, 4, 0],
    'should add new layer index to layer order, put them on top'
  );
  t.equal(
    newState.layers[1].config.dataId,
    'smoothie',
    'should save dataId to layer'
  );
  t.equal(
    newState.layers[2].config.dataId,
    'smoothie',
    'should save dataId to layer'
  );
  t.equal(
    newState.layers[3].config.dataId,
    'smoothie',
    'should save dataId to layer'
  );
  t.equal(newState.layerData.length, 5, 'should calculate layerData');
  t.equal(newState.filters.length, 2, 'should keep original filters');
  t.deepEqual(
    newState.interactionConfig.tooltip.config,
    expectedInteractionTooltip,
    'should set interaction config back to default'
  );
  t.equal(newState.layerBlending, 'additive', 'should keep layerBlending');

  t.end();
});

test('#visStateReducer -> UPDATE_VIS_DATA.4.Geojson', t => {
  const initialVisState = CloneDeep(INITIAL_VIS_STATE);

  const {fields, rows} = processGeojson(CloneDeep(geojsonData));

  const payload = [
    {
      info: {
        id: 'milkshake',
        label: 'king milkshake'
      },
      data: {fields, rows}
    }
  ];

  const [layer1Color, layer1StrokeColor] = getNextColorMakerValue(2);

  // receive data
  const initialState = reducer(
    initialVisState,
    VisStateActions.updateVisData(payload)
  );

  const expectedDatasets = {
    id: 'milkshake',
    label: 'king milkshake',
    color: 'donnot test me',
    allData: rows,
    data: rows,
    filteredIndex: rows.map((_, i) => i),
    filteredIndexForDomain: rows.map((_, i) => i),
    fields: fields.map(f => ({...f, id: f.name})),
    fieldPairs: []
  };

  const dataToFeature = geojsonData.features.reduce(
    (accu, f, i) => ({
      ...accu,
      [i]: {
        ...f,
        properties: {...f.properties, index: i}
      }
    }),
    {}
  );

  const expectedLayer = new GeojsonLayer({
    label: 'king milkshake',
    dataId: 'milkshake',
    columns: {geojson: {fieldIdx: 0, value: '_geojson'}},
    isVisible: true,
    color: layer1Color
  });

  expectedLayer.updateLayerVisConfig({stroked: true, filled: true, strokeColor: layer1StrokeColor});
  expectedLayer.dataToFeature = dataToFeature;
  expectedLayer.meta = {
    bounds: geoBounds,
    lightSettings: geoLghtSettings,
    fixedRadius: false,
    featureTypes: {
      polygon: true
    }
  };

  const expectedLayerData = {
    data: geojsonData.features.map((f, i) => ({
      ...f,
      properties: {...f.properties, index: i}
    }))
  };

  t.deepEqual(
    Object.keys(initialState.datasets),
    ['milkshake'],
    'should save geojson to datasets'
  );
  cmpDataset(
    t,
    expectedDatasets,
    initialState.datasets.milkshake,
    'should save correct geojson to datasets'
  );

  t.equal(initialState.layers.length, 1, 'should find 1 geojson layer');
  cmpLayers(
    t,
    expectedLayer,
    initialState.layers[0],
    'should save dataFeature to geojson layer'
  );

  t.deepEqual(
    initialState.layerData[0].data,
    expectedLayerData.data,
    'should save geojson to datasets'
  );

  t.end();
});

test('#visStateReducer -> UPDATE_VIS_DATA -> mergeFilters', t => {
  const oldState = CloneDeep(INITIAL_VIS_STATE);
  oldState.filterToBeMerged = [
    {
      dataId: 'smoothie',
      id: '38chejr',
      enlarged: true,
      name: mockFilter.name,
      type: mockFilter.type,
      value: mockFilter.value
    },
    {
      dataId: 'nothing_here',
      id: 'vuey55d',
      enlarged: true,
      name: 'test_test',
      type: 'select',
      value: true
    }
  ];

  const expectedFilter = {
    dataId: 'smoothie',
    domain: [12.25, 12.29],
    enlarged: true,
    fieldIdx: 0,
    id: '38chejr',
    fieldType: 'real',
    fixedDomain: false,
    freeze: true,
    plotType: 'histogram',
    yAxis: null,
    interval: null,
    histogram: [1],
    enlargedHistogram: [1],
    isAnimating: false,
    name: mockFilter.name,
    speed: 1,
    step: 0.001,
    type: mockFilter.type,
    typeOptions: ['range'],
    value: mockFilter.value
  };

  const filteredData = [mockData.data[0]];

  const newState = reducer(
    oldState,
    VisStateActions.updateVisData([
      {
        data: mockRawData,
        info: {id: 'smoothie', label: 'smoothie and milkshake'}
      }
    ])
  );

  const expectedDatasets = {
    smoothie: {
      fields: expectedFields,
      filteredIndex: [0],
      filteredIndexForDomain: [0],
      allData: mockRawData.rows,
      data: filteredData,
      color: 'donnot test me',
      id: 'smoothie',
      label: 'smoothie and milkshake',
      fieldPairs: [
        {
          defaultName: 'start point',
          pair: {
            lat: {
              value: 'start_point_lat',
              fieldIdx: 0
            },
            lng: {
              value: 'start_point_lng',
              fieldIdx: 1
            }
          },
          suffix: ['lat', 'lng']
        },
        {
          defaultName: 'end point',
          pair: {
            lat: {
              value: 'end_point_lat',
              fieldIdx: 2
            },
            lng: {
              value: 'end_point_lng',
              fieldIdx: 3
            }
          },
          suffix: ['lat', 'lng']
        }
      ]
    }
  };

  const expectedState = {
    filterToBeMerged: [
      {
        dataId: 'nothing_here',
        id: 'vuey55d',
        enlarged: true,
        name: 'test_test',
        type: 'select',
        value: true
      }
    ],
    filters: [expectedFilter],
    datasets: expectedDatasets
  };

  cmpFilters(t, expectedState.filters, newState.filters);

  t.deepEqual(
    newState.filterToBeMerged,
    expectedState.filterToBeMerged,
    'should saved unmerged filter to filterToBeMerged'
  );

  cmpDatasets(t, expectedState.datasets, newState.datasets);

  t.end();
});

test('#visStateReducer -> UPDATE_VIS_DATA.SPLIT_MAPS', t => {
  const layer0 = new PointLayer({
    dataId: 'snowflake',
    id: 'a',
    isVisible: true
  });

  const layer1 = new PointLayer({
    dataId: 'milkshake',
    id: 'b',
    isVisible: true
  });

  const layer2 = new PointLayer({
    dataId: 'milkshake',
    id: 'b',
    isVisible: false
  });

  const oldState = {
    ...InitialVisState,
    layers: [layer0, layer1, layer2],
    splitMaps: [
      {
        layers: {
          a: true,
          b: false
        }
      },
      {
        layers: {
          a: false,
          b: true
        }
      }
    ],
    interactionConfig: {
      tooltip: {
        config: {
          fieldsToShow: {
            milkshake: []
          }
        }
      }
    },
    layerData: [],
    layerOrder: [2, 1, 0]
  };

  const newState = reducer(
    oldState,
    VisStateActions.updateVisData([
      {
        data: mockRawData,
        info: {id: 'smoothie', label: 'smoothie and milkshake'}
      }
    ])
  );

  // first visible layer should be point
  const id1 = newState.layers[3].id;
  const expectedSplitMaps = [
    {
      layers: {
        a: true,
        b: false,
        [id1]: true
      }
    },
    {
      layers: {
        a: false,
        b: true,
        [id1]: true
      }
    }
  ];

  t.equal(
    newState.layers.length,
    7,
    'should create 1 arc 1 line and 2 point layers'
  );
  t.deepEqual(
    newState.layerOrder,
    [3, 4, 5, 6, 2, 1, 0],
    'should move new layers to front'
  );
  t.deepEqual(
    newState.splitMaps,
    expectedSplitMaps,
    'should add new layers to splitmaps'
  );

  t.end();
});

test('#visStateReducer -> setFilter', t => {
  // get test data
  const {fields, rows} = processCsvData(testData);
  const payload = [
    {
      info: {
        id: 'smoothie',
        label: 'queen smoothie'
      },
      data: {fields, rows}
    }
  ];

  // receive data
  const initialState = reducer(
    INITIAL_VIS_STATE,
    VisStateActions.updateVisData(payload)
  );

  const expectedLayer1 = new PointLayer({
    isVisible: true,
    dataId: 'smoothie',
    label: 'gps data',
    columns: {
      lat: {value: 'gps_data.lat', fieldIdx: 1},
      lng: {value: 'gps_data.lng', fieldIdx: 2},
      altitude: {value: null, fieldIdx: -1, optional: true}
    }
  });

  expectedLayer1.meta = {
    bounds: [31.2148748, 29.9870074, 31.2590542, 30.0614122],
    lightSettings: getLightSettingsFromBounds([
      31.2148748,
      29.9870074,
      31.2590542,
      30.0614122
    ])
  };

  const expectedLayers = [expectedLayer1];
  // test default layer
  t.equal(initialState.layers.length, 1, 'should find two layers');

  cmpLayers(t, expectedLayers, initialState.layers);

  // add filter
  const stateWithFilter = reducer(
    initialState,
    VisStateActions.addFilter('smoothie')
  );

  const expectedFilter = {
    dataId: 'smoothie',
    freeze: false,
    id: 'donnot test me yet',
    name: null,
    type: null,
    fixedDomain: false,
    fieldIdx: null,
    domain: null,
    value: null,
    enlarged: false,
    isAnimating: false,
    plotType: 'histogram',
    yAxis: null,
    speed: 1,
    interval: null
  };

  cmpFilters(t, expectedFilter, stateWithFilter.filters[0]);
  const filterId = stateWithFilter.filters[0].id;

  // set filter 'name'
  const stateWithFilterName = reducer(
    stateWithFilter,
    VisStateActions.setFilter(0, 'name', 'date')
  );

  const expectedFilterWName = {
    dataId: 'smoothie',
    freeze: true,
    id: filterId,
    name: 'date',
    type: 'multiSelect',
    fieldIdx: 10,
    fixedDomain: false,
    domain: ['2016-09-23', '2016-09-24', '2016-10-10'],
    value: [],
    enlarged: false,
    isAnimating: false,
    fieldType: 'date',
    plotType: 'histogram',
    yAxis: null,
    speed: 1,
    interval: null
  };

  // test filter
  cmpFilters(t, expectedFilterWName, stateWithFilterName.filters[0]);

  const updatedField = {
    ...initialState.datasets.smoothie.fields[10],
    filterProp: {
      type: 'multiSelect',
      value: [],
      fieldType: 'date',
      domain: ['2016-09-23', '2016-09-24', '2016-10-10']
    }
  };

  const {allData} = initialState.datasets.smoothie;
  // test dataset
  const expectedDataset = {
    id: 'smoothie',
    label: 'queen smoothie',
    color: 'donnot test me',
    allData,
    data: [],
    fields: [
      ...initialState.datasets.smoothie.fields.slice(0, 10),
      updatedField
    ],
    filteredIndex: [],
    filteredIndexForDomain: [],
    fieldPairs: [
      {
        defaultName: 'gps data',
        pair: {
          lat: {
            value: 'gps_data.lat',
            fieldIdx: 1
          },
          lng: {
            value: 'gps_data.lng',
            fieldIdx: 2
          }
        },
        suffix: ['lat', 'lng']
      }
    ]
  };

  cmpDataset(t, expectedDataset, stateWithFilterName.datasets.smoothie);

  // set filter value
  const stateWithFilterValue = reducer(
    stateWithFilterName,
    VisStateActions.setFilter(0, 'value', ['2016-10-10'])
  );

  const expectedFilterWValue = {
    ...expectedFilterWName,
    value: ['2016-10-10']
  };

  // test filter
  cmpFilters(t, expectedFilterWValue, stateWithFilterValue.filters[0]);

  const expectedFilteredDataset = {
    ...expectedDataset,
    allData,
    data: [
      allData[17],
      allData[18],
      allData[19],
      allData[20],
      allData[21],
      allData[22]
    ],
    filteredIndex: [17, 18, 19, 20, 21, 22],
    filteredIndexForDomain: [17, 18, 19, 20, 21, 22]
  };

  const expectedLayerData1 = {
    data: [
      {
        data: [
          '2016-09-17 00:26:29',
          30.0538936,
          31.2165983,
          'driver_analytics',
          1472774400000,
          null,
          43,
          '2016-09-23T07:00:00.000Z',
          '2016-10-01 09:59:53+00:00',
          '2016-10-01 16:59:53+00:00',
          '2016-10-10'
        ]
      },
      {
        data: [
          '2016-09-17 00:27:31',
          30.060911,
          31.2148748,
          'driver_analytics',
          1472774400000,
          null,
          4,
          '2016-09-23T07:00:00.000Z',
          '2016-10-01 09:57:11+00:00',
          '2016-10-01 16:57:11+00:00',
          '2016-10-10'
        ]
      },
      {
        data: [
          '2016-09-17 00:28:35',
          30.060334,
          31.2212278,
          'driver_analytics',
          1472774400000,
          null,
          5,
          '2016-09-23T07:00:00.000Z',
          '2016-10-01 09:59:27+00:00',
          '2016-10-01 16:59:27+00:00',
          '2016-10-10'
        ]
      },
      {
        data: [
          '2016-09-17 00:29:40',
          30.0554663,
          31.2288985,
          'driver_analytics',
          1472774400000,
          true,
          null,
          '2016-09-23T07:00:00.000Z',
          '2016-10-01 09:46:36+00:00',
          '2016-10-01 16:46:36+00:00',
          '2016-10-10'
        ]
      },
      {
        data: [
          '2016-09-17 00:30:03',
          30.0614122,
          31.2187021,
          'driver_gps',
          1472774400000,
          true,
          6,
          '2016-09-23T08:00:00.000Z',
          '2016-10-01 09:54:31+00:00',
          '2016-10-01 16:54:31+00:00',
          '2016-10-10'
        ]
      },
      {
        data: [
          '2016-09-17 00:30:03',
          30.0612697,
          31.2191059,
          'driver_gps',
          1472774400000,
          true,
          7,
          '2016-09-23T08:00:00.000Z',
          '2016-10-01 09:53:35+00:00',
          '2016-10-01 16:53:35+00:00',
          '2016-10-10'
        ]
      }
    ],
    getPosition: () => {},
    getColor: () => {},
    getRadius: () => {}
  };

  cmpDataset(
    t,
    expectedFilteredDataset,
    stateWithFilterValue.datasets.smoothie
  );

  t.deepEqual(
    stateWithFilterValue.layerData[0].data,
    expectedLayerData1.data,
    'should format layer data correctly'
  );

  t.end();
});

test('#visStateReducer -> setFilter', t => {
  const {fields, rows} = processGeojson(CloneDeep(geojsonData));
  const payload = [
    {
      info: {
        id: 'milkshake',
        label: 'king milkshake'
      },
      data: {fields, rows}
    }
  ];

  // receive data
  const initialState = reducer(
    INITIAL_VIS_STATE,
    VisStateActions.updateVisData(payload)
  );

  // add filter
  const stateWithFilter = reducer(
    initialState,
    VisStateActions.addFilter('milkshake')
  );

  // set filter 'name'
  const stateWithFilterName = reducer(
    stateWithFilter,
    VisStateActions.setFilter(0, 'name', 'TRIPS')
  );

  const expectedHistogram = [
    {count: 1, x0: 4, x1: 4.5},
    {count: 0, x0: 4.5, x1: 5},
    {count: 0, x0: 5, x1: 5.5},
    {count: 0, x0: 5.5, x1: 6},
    {count: 0, x0: 6, x1: 6.5},
    {count: 0, x0: 6.5, x1: 7},
    {count: 0, x0: 7, x1: 7.5},
    {count: 0, x0: 7.5, x1: 8},
    {count: 0, x0: 8, x1: 8.5},
    {count: 0, x0: 8.5, x1: 9},
    {count: 0, x0: 9, x1: 9.5},
    {count: 0, x0: 9.5, x1: 10},
    {count: 0, x0: 10, x1: 10.5},
    {count: 0, x0: 10.5, x1: 11},
    {count: 1, x0: 11, x1: 11.5},
    {count: 0, x0: 11.5, x1: 12},
    {count: 0, x0: 12, x1: 12.5},
    {count: 0, x0: 12.5, x1: 13},
    {count: 0, x0: 13, x1: 13.5},
    {count: 0, x0: 13.5, x1: 14},
    {count: 0, x0: 14, x1: 14.5},
    {count: 0, x0: 14.5, x1: 15},
    {count: 0, x0: 15, x1: 15.5},
    {count: 0, x0: 15.5, x1: 16},
    {count: 0, x0: 16, x1: 16.5},
    {count: 0, x0: 16.5, x1: 17},
    {count: 0, x0: 17, x1: 17.5},
    {count: 0, x0: 17.5, x1: 18},
    {count: 0, x0: 18, x1: 18.5},
    {count: 0, x0: 18.5, x1: 19},
    {count: 0, x0: 19, x1: 19.5},
    {count: 0, x0: 19.5, x1: 20},
    {count: 1, x0: 20, x1: 20}
  ];

  const expectedEnlarged = [
    {count: 1, x0: 4, x1: 4.2},
    {count: 0, x0: 4.2, x1: 4.4},
    {count: 0, x0: 4.4, x1: 4.6},
    {count: 0, x0: 4.6, x1: 4.8},
    {count: 0, x0: 4.8, x1: 5},
    {count: 0, x0: 5, x1: 5.2},
    {count: 0, x0: 5.2, x1: 5.4},
    {count: 0, x0: 5.4, x1: 5.6},
    {count: 0, x0: 5.6, x1: 5.8},
    {count: 0, x0: 5.8, x1: 6},
    {count: 0, x0: 6, x1: 6.2},
    {count: 0, x0: 6.2, x1: 6.4},
    {count: 0, x0: 6.4, x1: 6.6},
    {count: 0, x0: 6.6, x1: 6.8},
    {count: 0, x0: 6.8, x1: 7},
    {count: 0, x0: 7, x1: 7.2},
    {count: 0, x0: 7.2, x1: 7.4},
    {count: 0, x0: 7.4, x1: 7.6},
    {count: 0, x0: 7.6, x1: 7.8},
    {count: 0, x0: 7.8, x1: 8},
    {count: 0, x0: 8, x1: 8.2},
    {count: 0, x0: 8.2, x1: 8.4},
    {count: 0, x0: 8.4, x1: 8.6},
    {count: 0, x0: 8.6, x1: 8.8},
    {count: 0, x0: 8.8, x1: 9},
    {count: 0, x0: 9, x1: 9.2},
    {count: 0, x0: 9.2, x1: 9.4},
    {count: 0, x0: 9.4, x1: 9.6},
    {count: 0, x0: 9.6, x1: 9.8},
    {count: 0, x0: 9.8, x1: 10},
    {count: 0, x0: 10, x1: 10.2},
    {count: 0, x0: 10.2, x1: 10.4},
    {count: 0, x0: 10.4, x1: 10.6},
    {count: 0, x0: 10.6, x1: 10.8},
    {count: 0, x0: 10.8, x1: 11},
    {count: 1, x0: 11, x1: 11.2},
    {count: 0, x0: 11.2, x1: 11.4},
    {count: 0, x0: 11.4, x1: 11.6},
    {count: 0, x0: 11.6, x1: 11.8},
    {count: 0, x0: 11.8, x1: 12},
    {count: 0, x0: 12, x1: 12.2},
    {count: 0, x0: 12.2, x1: 12.4},
    {count: 0, x0: 12.4, x1: 12.6},
    {count: 0, x0: 12.6, x1: 12.8},
    {count: 0, x0: 12.8, x1: 13},
    {count: 0, x0: 13, x1: 13.2},
    {count: 0, x0: 13.2, x1: 13.4},
    {count: 0, x0: 13.4, x1: 13.6},
    {count: 0, x0: 13.6, x1: 13.8},
    {count: 0, x0: 13.8, x1: 14},
    {count: 0, x0: 14, x1: 14.2},
    {count: 0, x0: 14.2, x1: 14.4},
    {count: 0, x0: 14.4, x1: 14.6},
    {count: 0, x0: 14.6, x1: 14.8},
    {count: 0, x0: 14.8, x1: 15},
    {count: 0, x0: 15, x1: 15.2},
    {count: 0, x0: 15.2, x1: 15.4},
    {count: 0, x0: 15.4, x1: 15.6},
    {count: 0, x0: 15.6, x1: 15.8},
    {count: 0, x0: 15.8, x1: 16},
    {count: 0, x0: 16, x1: 16.2},
    {count: 0, x0: 16.2, x1: 16.4},
    {count: 0, x0: 16.4, x1: 16.6},
    {count: 0, x0: 16.6, x1: 16.8},
    {count: 0, x0: 16.8, x1: 17},
    {count: 0, x0: 17, x1: 17.2},
    {count: 0, x0: 17.2, x1: 17.4},
    {count: 0, x0: 17.4, x1: 17.6},
    {count: 0, x0: 17.6, x1: 17.8},
    {count: 0, x0: 17.8, x1: 18},
    {count: 0, x0: 18, x1: 18.2},
    {count: 0, x0: 18.2, x1: 18.4},
    {count: 0, x0: 18.4, x1: 18.6},
    {count: 0, x0: 18.6, x1: 18.8},
    {count: 0, x0: 18.8, x1: 19},
    {count: 0, x0: 19, x1: 19.2},
    {count: 0, x0: 19.2, x1: 19.4},
    {count: 0, x0: 19.4, x1: 19.6},
    {count: 0, x0: 19.6, x1: 19.8},
    {count: 0, x0: 19.8, x1: 20},
    {count: 1, x0: 20, x1: 20}
  ];

  const expectedFilterWName = {
    dataId: 'milkshake',
    freeze: true,
    id: stateWithFilter.filters[0].id,
    name: 'TRIPS',
    type: 'range',
    fieldIdx: 4,
    domain: [4, 20],
    step: 0.01,
    value: [4, 20],
    enlarged: false,
    fixedDomain: false,
    histogram: [],
    enlargedHistogram: [],
    isAnimating: false,
    fieldType: 'integer',
    typeOptions: ['range'],
    plotType: 'histogram',
    yAxis: null,
    interval: null,
    speed: 1
  };

  // test filter
  cmpFilters(t, expectedFilterWName, stateWithFilterName.filters[0]);

  // set filter value
  const stateWithFilterValue = reducer(
    stateWithFilterName,
    VisStateActions.setFilter(0, 'value', [8, 20])
  );

  const expectedFilterWValue = {
    ...expectedFilterWName,
    value: [8, 20]
  };

  // test filter
  cmpFilters(t, expectedFilterWValue, stateWithFilterValue.filters[0]);

  const expectedFilteredDataset = {
    ...initialState.datasets.milkshake,
    data: [
      [
        {
          type: 'Feature',
          properties: {
            OBJECTID: 1,
            ZIP_CODE: 94107,
            ID: 94107,
            TRIPS: 11,
            RATE: 'a',
            index: 0
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-122.401159718585049, 37.782024266952142],
                [-122.400374366843309, 37.782644515545172],
                [-122.400019020063766, 37.782925153640136],
                [-122.399891477967842, 37.783025880124256],
                [-122.398930331092998, 37.783784933304034],
                [-122.397811613142864, 37.784666586003652],
                [-122.396705177550587, 37.785542130425938],
                [-122.395895701657864, 37.784896929203114],
                [-122.395160622349934, 37.78431101230386],
                [-122.394398389309941, 37.783701667981575],
                [-122.401159718585049, 37.782024266952142]
              ]
            ]
          }
        },
        1,
        94107,
        94107,
        11,
        'a'
      ],
      [
        {
          type: 'Feature',
          properties: {
            OBJECTID: 3,
            ZIP_CODE: 94109,
            ID: 94109,
            TRIPS: 20,
            index: 2
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-122.39249932896719, 37.793768814133983],
                [-122.391890260341384, 37.794278544568918],
                [-122.391788865572423, 37.794170982455135],
                [-122.39173429034625, 37.79420276052317],
                [-122.391666728649753, 37.794132425256194],
                [-122.391723034266192, 37.79410061945832],
                [-122.391673228351905, 37.794047854124599],
                [-122.391982015107928, 37.793871906128679],
                [-122.39249932896719, 37.793768814133983]
              ]
            ]
          }
        },
        3,
        94109,
        94109,
        20,
        null
      ]
    ],

    // receive Vis Data will add id to fields
    // filter will add filterProps to fields
    fields: geojsonFields.map(
      f =>
        f.name === 'TRIPS'
          ? {
              ...f,
              id: f.name,
              filterProp: {
                domain: [4, 20],
                fieldType: 'integer',
                histogram: expectedHistogram,
                enlargedHistogram: expectedEnlarged,
                step: 0.01,
                type: 'range',
                typeOptions: ['range'],
                value: [4, 20]
              }
            }
          : {...f, id: f.name}
    ),
    filteredIndex: [0, 2],
    filteredIndexForDomain: [0, 2]
  };

  const actualTripFeild = stateWithFilterValue.datasets.milkshake.fields[4];
  const expectetField = expectedFilteredDataset.fields[4];

  t.deepEqual(
    Object.keys(actualTripFeild).sort(),
    Object.keys(expectetField).sort(),
    'trip field keys should be same'
  );
  Object.keys(actualTripFeild).forEach(k => {
    t.deepEqual(
      actualTripFeild[k],
      expectetField[k],
      `trip field ${k} should be same`
    );
  });
  cmpDataset(
    t,
    expectedFilteredDataset,
    stateWithFilterValue.datasets.milkshake
  );

  t.end();
});
/* eslint-enable max-statements */

test('#visStateReducer -> setFilter.fixedDomain', t => {
  // get test data
  const {fields, rows} = processCsvData(testData);
  const payload = [
    {
      info: {
        id: 'smoothie',
        label: 'queen smoothie'
      },
      data: {fields, rows}
    }
  ];

  const datasetSmoothie = createNewDataEntry({
    info: {id: 'smoothie', label: 'queen smoothie'},
    data: {
      rows: testAllData,
      fields: testFields
    }
  }).smoothie;

  const stateWidthTsFilter = applyActions(reducer, INITIAL_VIS_STATE, [
    // receive data
    {action: VisStateActions.updateVisData, payload: [payload]},

    // add ts filter
    {action: VisStateActions.addFilter, payload: ['smoothie']},

    // set ts filter name
    {
      action: VisStateActions.setFilter,
      payload: [0, 'name', 'gps_data.utc_timestamp']
    },

    // set ts filter value
    {
      action: VisStateActions.setFilter,
      payload: [0, 'value', [1474071425000, 1474071740000]]
    }
  ]);

  const expectedFilterTs = {
    dataId: 'smoothie',
    freeze: true,
    fixedDomain: true,
    id: 'dont test me',
    name: 'gps_data.utc_timestamp',
    type: 'timeRange',
    fieldIdx: 0,
    domain: [1474070995000, 1474072208000],
    value: [1474071425000, 1474071740000],
    step: 1000,
    plotType: 'histogram',
    yAxis: null,
    interval: null,
    speed: 1,
    mappedValue: [
      1474070995000,
      1474071056000,
      1474071116000,
      1474071178000,
      1474071240000,
      1474071301000,
      1474071363000,
      1474071425000,
      1474071489000,
      1474071552000,
      1474071567000,
      1474071614000,
      1474071677000,
      1474071740000,
      1474071802000,
      1474071864000,
      1474071928000,
      1474071989000,
      1474072051000,
      1474072115000,
      1474072180000,
      1474072203000,
      1474072203000,
      1474072208000
    ],
    histogram: [],
    enlargedHistogram: [],
    enlarged: true,
    isAnimating: false,
    fieldType: 'timestamp'
  };

  cmpFilters(t, expectedFilterTs, stateWidthTsFilter.filters[0]);

  const expectedDatasetSmoothie = {
    ...datasetSmoothie,
    // add filter prop to fields
    fields: datasetSmoothie.fields.map(
      f =>
        f.name === 'gps_data.utc_timestamp'
          ? {
              ...f,
              filterProp: {
                domain: [1474070995000, 1474072208000],
                step: 1000,
                mappedValue: expectedFilterTs.mappedValue,
                histogram: stateWidthTsFilter.filters[0].histogram,
                enlargedHistogram: stateWidthTsFilter.filters[0].enlargedHistogram,
                fieldType: 'timestamp',
                type: 'timeRange',
                enlarged: true,
                fixedDomain: true,
                value: [1474070995000, 1474072208000]
              }
            }
          : f
    ),
    data: [7, 8, 9, 10, 11, 12, 13].map(i => datasetSmoothie.allData[i]),
    filteredIndex: [7, 8, 9, 10, 11, 12, 13],
    filteredIndexForDomain: datasetSmoothie.allData.map((d, i) => i)
  };

  // check filter by ts
  cmpDataset(t, expectedDatasetSmoothie, stateWidthTsFilter.datasets.smoothie);

  const stateWidthTsAndNameFilter = applyActions(reducer, stateWidthTsFilter, [
    // add ts filter
    {action: VisStateActions.addFilter, payload: ['smoothie']},

    // set ts filter name
    {
      action: VisStateActions.setFilter,
      payload: [1, 'name', 'date']
    },

    // set ts filter value
    {
      action: VisStateActions.setFilter,
      payload: [1, 'value', ['2016-09-24', '2016-10-10']]
    }
  ]);

  const expectedFilteredDataset = {
    ...stateWidthTsFilter.datasets.smoothie,
    fields: stateWidthTsFilter.datasets.smoothie.fields.map(
      f =>
        f.name === 'date'
          ? {
            ...f,
            filterProp: {
              domain: ['2016-09-23', '2016-09-24', '2016-10-10'],
              fieldType: 'date',
              type: 'multiSelect',
              value: []
            }
          }
          : f
    ),
    data: [7, 8, 9, 10, 11, 12].map(i => datasetSmoothie.allData[i]),
    filteredIndex: [7, 8, 9, 10, 11, 12],
    filteredIndexForDomain: [7, 8, 9, 10, 11, 12, 17, 18, 19, 20, 21, 22]
  };

  cmpDataset(t, expectedFilteredDataset, stateWidthTsAndNameFilter.datasets.smoothie);

  t.end();
});

test('#visStateReducer -> setFilterPlot', t => {
  // get test data
  const {fields, rows} = processCsvData(testData);
  const payload = [
    {
      info: {
        id: 'smoothie',
        label: 'queen smoothie'
      },
      data: {fields, rows}
    }
  ];

  // receive data
  const initialState = reducer(
    INITIAL_VIS_STATE,
    VisStateActions.updateVisData(payload)
  );

  // add filter
  const stateWithFilter = reducer(
    initialState,
    VisStateActions.addFilter('smoothie')
  );
  const filterId = stateWithFilter.filters[0].id;

  // set filter 'name' to timestamp field
  const stateWithFilterName = reducer(
    stateWithFilter,
    VisStateActions.setFilter(0, 'name', 'gps_data.utc_timestamp')
  );

  // find id which is an integer field
  const yAxisField = stateWithFilterName.datasets.smoothie.fields.find(
    f => f.id === 'id'
  );

  // set filterPlot yAxis
  const stateWithFilterPlot = reducer(
    stateWithFilterName,
    VisStateActions.setFilterPlot(0, {yAxis: yAxisField})
  );

  const expectedFilterWName = {
    dataId: 'smoothie',
    freeze: true,
    fixedDomain: true,
    id: filterId,
    name: 'gps_data.utc_timestamp',
    type: 'timeRange',
    fieldIdx: 0,
    domain: [1474070995000, 1474072208000],
    value: [1474070995000, 1474072208000],
    step: 1000,
    plotType: 'lineChart',
    yAxis: {
      type: 'integer',
      name: 'id',
      id: 'id',
      format: '',
      tableFieldIndex: 7
    },
    interval: null,
    lineChart: {
      series: [
        {x: 1474070995000, y: 1},
        {x: 1474071056000, y: 2},
        {x: 1474071116000, y: 3},
        {x: 1474071178000, y: 4},
        {x: 1474071240000, y: 5},
        {x: 1474071301000, y: 12124},
        {x: 1474071363000, y: 222},
        {x: 1474071425000, y: 345},
        {x: 1474071864000, y: 1},
        {x: 1474071989000, y: 43},
        {x: 1474072051000, y: 4},
        {x: 1474072115000, y: 5},
        {x: 1474072203000, y: 6},
        {x: 1474072203000, y: 7}
      ],
      yDomain: [1, 12124],
      xDomain: [1474070995000, 1474072203000]
    },
    speed: 1,
    mappedValue: [
      1474070995000,
      1474071056000,
      1474071116000,
      1474071178000,
      1474071240000,
      1474071301000,
      1474071363000,
      1474071425000,
      1474071489000,
      1474071552000,
      1474071567000,
      1474071614000,
      1474071677000,
      1474071740000,
      1474071802000,
      1474071864000,
      1474071928000,
      1474071989000,
      1474072051000,
      1474072115000,
      1474072180000,
      1474072203000,
      1474072203000,
      1474072208000
    ],
    histogram: [],
    enlargedHistogram: [],
    enlarged: true,
    isAnimating: false,
    fieldType: 'timestamp'
  };

  // test filter
  cmpFilters(t, expectedFilterWName, stateWithFilterPlot.filters[0]);
  t.end();
});

test('#visStateReducer -> REMOVE_DATASET', t => {
  const layer0 = new ArcLayer({id: 'a', dataId: 'puppy_0'});
  const layer1 = new PointLayer({id: 'b', dataId: 'puppy_0'});
  const layer2 = new GeojsonLayer({id: 'c', dataId: 'puppy_1'});
  const layer3 = new PointLayer({id: 'd', dataId: 'puppy_2'});

  const oldState = {
    datasets: {
      puppy_0: {},
      puppy_1: {},
      puppy_2: {}
    },
    layers: [layer0, layer1, layer2, layer3],
    layerData: [{data: 1}, {data: 2}, {data: 3}, {data: 4}],
    layerOrder: [2, 3, 1, 0],
    filters: [{dataId: 'puppy_0'}, {dataId: 'puppy_1'}, {dataId: 'puppy_2'}],
    interactionConfig: {
      tooltip: {
        config: {
          fieldsToShow: {
            puppy_0: {},
            puppy_1: {},
            puppy_2: {}
          }
        }
      }
    },
    hoverInfo: undefined,
    clicked: undefined,
    splitMaps: []
  };

  const newReducer = reducer(
    oldState,
    VisStateActions.removeDataset('puppy_1')
  );

  t.deepEqual(
    newReducer,
    {
      datasets: {
        puppy_0: {},
        puppy_2: {}
      },
      layers: [layer0, layer1, layer3],
      layerData: [{data: 1}, {data: 2}, {data: 4}],
      layerOrder: [2, 1, 0],
      filters: [{dataId: 'puppy_0'}, {dataId: 'puppy_2'}],
      interactionConfig: {
        tooltip: {
          config: {
            fieldsToShow: {
              puppy_0: {},
              puppy_2: {}
            }
          }
        }
      },
      hoverInfo: undefined,
      clicked: undefined,
      splitMaps: []
    },
    'should remove dataset, layer and layerData'
  );

  t.end();
});

test('#visStateReducer -> SPLIT_MAP: TOGGLE', t => {
  const layer0 = new ArcLayer({id: 'a', dataId: 'puppy_0', isVisible: true});
  const layer1 = new ArcLayer({id: 'b', dataId: 'puppy_0', isVisible: false});

  const oldState = {
    layers: [layer0, layer1],
    splitMaps: []
  };

  const newReducer = reducer(oldState, MapStateActions.toggleSplitMap());

  t.deepEqual(
    newReducer.splitMaps,
    [
      {
        layers: {
          a: true
        }
      },
      {
        layers: {
          a: true
        }
      }
    ],
    'should split map'
  );

  t.end();
});

test('#visStateReducer -> SPLIT_MAP: REMOVE_LAYER', t => {
  const layer1 = new PointLayer({id: 'a'});
  const layer2 = new PointLayer({id: 'b'});
  const oldState = {
    layers: [layer1, layer2],
    layerData: [{data: 1}, {data: 2}],
    layerOrder: [1, 0],
    hoverInfo: {
      layer: {props: {id: 'b'}},
      picked: true
    },
    clicked: {
      layer: {props: {id: 'a'}},
      picked: true
    },
    splitMaps: [
      {
        layers: {
          a: true,
          b: true
        }
      },
      {
        layers: {
          a: true,
          b: true
        }
      }
    ]
  };

  const newReducer = reducer(oldState, VisStateActions.removeLayer(1));

  t.deepEqual(
    newReducer,
    {
      layers: [layer1],
      layerData: [{data: 1}],
      layerOrder: [0],
      hoverInfo: undefined,
      clicked: {
        layer: {props: {id: 'a'}},
        picked: true
      },
      splitMaps: [
        {
          layers: {
            a: true
          }
        },
        {
          layers: {
            a: true
          }
        }
      ]
    },
    'should remove layer and layerData in split mode'
  );

  t.end();
});

test('#visStateReducer -> SPLIT_MAP: REMOVE_DATASET', t => {
  const layer0 = new ArcLayer({id: 'a', dataId: 'puppy_0'});
  const layer1 = new PointLayer({id: 'b', dataId: 'puppy_0'});
  const layer2 = new GeojsonLayer({id: 'c', dataId: 'puppy_1'});
  const layer3 = new PointLayer({id: 'd', dataId: 'puppy_2'});

  const oldState = {
    datasets: {
      puppy_0: {},
      puppy_1: {},
      puppy_2: {}
    },
    layers: [layer0, layer1, layer2, layer3],
    layerData: [{data: 1}, {data: 2}, {data: 3}, {data: 4}],
    layerOrder: [2, 3, 1, 0],
    filters: [{dataId: 'puppy_0'}, {dataId: 'puppy_1'}, {dataId: 'puppy_2'}],
    interactionConfig: {
      tooltip: {
        config: {
          fieldsToShow: {
            puppy_0: {},
            puppy_1: {},
            puppy_2: {}
          }
        }
      }
    },
    hoverInfo: undefined,
    clicked: undefined,
    splitMaps: [
      {
        layers: {
          a: true,
          b: true,
          c: true,
          d: true
        }
      },
      {
        layers: {
          a: true,
          b: true,
          c: true,
          d: true
        }
      }
    ]
  };

  const newReducer = reducer(
    oldState,
    VisStateActions.removeDataset('puppy_1')
  );

  const expectedState = {
    datasets: {
      puppy_0: {},
      puppy_2: {}
    },
    layers: [layer0, layer1, layer3],
    layerData: [{data: 1}, {data: 2}, {data: 4}],
    layerOrder: [2, 1, 0],
    filters: [{dataId: 'puppy_0'}, {dataId: 'puppy_2'}],
    interactionConfig: {
      tooltip: {
        config: {
          fieldsToShow: {
            puppy_0: {},
            puppy_2: {}
          }
        }
      }
    },
    hoverInfo: undefined,
    clicked: undefined,
    splitMaps: [
      {
        layers: {
          a: true,
          b: true,
          d: true
        }
      },
      {
        layers: {
          a: true,
          b: true,
          d: true
        }
      }
    ]
  };

  t.deepEqual(
    newReducer,
    expectedState,
    'should remove dataset, layer and layerData in split mode'
  );

  t.end();
});

test('#visStateReducer -> SPLIT_MAP: ADD_LAYER', t => {
  const oldState = {
    datasets: {
      puppy: {
        data: mockData.data,
        fields: mockData.fields
      }
    },
    layers: [{id: 'existing_layer'}],
    layerData: [[{data: [1, 2, 3]}, {data: [4, 5, 6]}]],
    layerOrder: [0],
    splitMaps: [
      {
        layers: {
          existing_layer: true
        }
      },
      {
        layers: {
          existing_layer: true
        }
      }
    ]
  };

  const newReducer = reducer(oldState, VisStateActions.addLayer());

  t.equal(
    newReducer.layers[1].config.isVisible,
    true,
    'newLayer visibility should be set to true'
  );
  t.equal(
    newReducer.layers[1].config.isConfigActive,
    true,
    'newLayer isConfigActive should be set to true'
  );
  t.equal(
    newReducer.layers[1].config.dataId,
    'puppy',
    'newLayer dataId should be set to default'
  );
  t.equal(
    newReducer.splitMaps.length,
    2,
    'newLayer was added into splitMaps layers'
  );
  t.deepEqual(
    newReducer.splitMaps[0],
    {
      layers: {
        existing_layer: true,
        [newReducer.layers[1].id]: true
      }
    },
    'newLayer map meta data settings are correct'
  );
  t.deepEqual(
    newReducer.splitMaps[1],
    {
      layers: {
        existing_layer: true,
        [newReducer.layers[1].id]: true
      }
    },
    'newLayer map meta data settings are correct'
  );

  t.end();
});

test('#visStateReducer -> SPLIT_MAP: TOGGLE_SPLIT_MAP', t => {
  const layer0 = new ArcLayer({id: 'a', dataId: 'puppy_0', isVisible: true});
  const layer1 = new PointLayer({id: 'b', dataId: 'puppy_0', isVisible: true});

  const oldState = {
    layers: [layer0, layer1],
    splitMaps: [
      {
        layers: {
          a: true,
          b: true
        }
      },
      {
        layers: {
          a: true,
          b: false
        }
      }
    ]
  };

  const newReducer = reducer(oldState, MapStateActions.toggleSplitMap(0));

  t.equal(newReducer.layers.length, 2, 'should have 2 global layers');
  t.equal(
    newReducer.layers[0].config.isVisible,
    true,
    'global layer should have changed to reflect specific map meta info'
  );
  t.equal(
    newReducer.layers[1].config.isVisible,
    false,
    'global layer should have changed to reflect specific map meta info'
  );
  t.end();
});

test('#visStateReducer -> SPLIT_MAP: HIDE LAYER', t => {

  const oldState = {
    splitMaps: [
      {
        layers: {
          a: true,
          b: true
        }
      },
      {
        layers: {
          a: true,
          b: false
        }
      }
    ]
  };

  const newState = reducer(oldState, VisStateActions.toggleLayerForMap(1, 'a'));

  const expectedState = {
    splitMaps: [
      {
        layers: {
          a: true,
          b: true
        }
      },
      {
        layers: {
          a: false,
          b: false
        }
      }
    ]
  };

  t.deepEqual(newState.splitMaps, expectedState.splitMaps, 'should hide layer B in split map');

  t.end();
});
