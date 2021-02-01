// Copyright (c) 2021 Uber Technologies, Inc.
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
import cloneDeep from 'lodash.clonedeep';
import {VizColorPalette} from 'constants/custom-color-ranges';
import {getInitialInputStyle} from 'reducers/map-style-updaters';

import keplerGlReducer from 'reducers/core';
import {addDataToMap} from 'actions/actions';
import {DEFAULT_TEXT_LABEL, DEFAULT_COLOR_RANGE, DEFAULT_LAYER_OPACITY} from 'layers/layer-factory';
import {DEFAULT_KEPLER_GL_PROPS} from 'components';
import * as VisStateActions from 'actions/vis-state-actions';
import * as MapStateActions from 'actions/map-state-actions';
import * as MapStyleActions from 'actions/map-style-actions';
import * as UIStateActions from 'actions/ui-state-actions';
import * as ProviderActions from 'actions/provider-actions';

// fixtures
import {dataId as csvDataId, testFields, testAllData} from 'test/fixtures/test-csv-data';
import testLayerData from 'test/fixtures/test-layer-data';

import {fields, rows, geoJsonDataId} from 'test/fixtures/geojson';
import {
  fields as tripFields,
  rows as tripRows,
  config as tripConfig,
  dataId as tripDataId
} from 'test/fixtures/test-trip-data';
import tripGeojson, {tripDataInfo} from 'test/fixtures/trip-geojson';
import {processCsvData, processGeojson} from 'processors/data-processor';
import {COMPARE_TYPES} from 'constants/tooltip';

const geojsonFields = cloneDeep(fields);
const geojsonRows = cloneDeep(rows);
export const testCsvDataId = csvDataId;
export const testGeoJsonDataId = geoJsonDataId;

export const csvInfo = {
  id: testCsvDataId,
  label: 'hello.csv',
  queryType: 'file',
  queryOption: 'csv',
  params: {file: null}
};

export const geojsonInfo = {
  id: testGeoJsonDataId,
  label: 'zip.geojson',
  queryType: 'file',
  queryOption: 'geojson',
  params: {file: null}
};

export function applyActions(reducer, initialState, actions) {
  const actionQ = Array.isArray(actions) ? actions : [actions];

  return actionQ.reduce(
    (updatedState, {action, payload}) => reducer(updatedState, action(...payload)),
    initialState
  );
}

export const InitialState = keplerGlReducer(undefined, {});

/**
 * Mock app state with uploaded geojson and csv file
 * @returns {Immutable} appState
 */
function mockStateWithFileUpload() {
  const initialState = cloneDeep(InitialState);

  // load csv and geojson
  const updatedState = applyActions(keplerGlReducer, initialState, [
    {
      action: VisStateActions.updateVisData,
      payload: [[{info: csvInfo, data: {fields: testFields, rows: testAllData}}]]
    },
    {
      action: VisStateActions.updateVisData,
      payload: [[{info: geojsonInfo, data: {fields: geojsonFields, rows: geojsonRows}}]]
    }
  ]);

  // replace layer id and color with controlled value for testing
  updatedState.visState.layers.forEach((l, i) => {
    l.id = `${l.type}-${i}`;
    l.config.color = [i, i, i];
    if (l.config.visConfig.strokeColor) {
      l.config.visConfig.strokeColor = [i + 10, i + 10, i + 10];
    }
  });

  test(t => {
    t.equal(updatedState.visState.layers.length, 2, 'should auto create 2 layers');
    t.end();
  });

  return updatedState;
}

function mockStateWithTripGeojson() {
  const initialState = cloneDeep(InitialState);

  // load csv and geojson
  const updatedState = applyActions(keplerGlReducer, initialState, [
    {
      action: VisStateActions.updateVisData,
      payload: [[{info: tripDataInfo, data: processGeojson(cloneDeep(tripGeojson))}]]
    }
  ]);

  // replace layer id and color with controlled value for testing
  updatedState.visState.layers.forEach((l, i) => {
    l.id = `${l.type}-${i}`;
    l.config.color = [i, i, i];
  });

  return updatedState;
}

function mockStateWithFilters(state) {
  const initialState = state || mockStateWithFileUpload();

  const prepareState = applyActions(keplerGlReducer, initialState, [
    // add filter
    {action: VisStateActions.addFilter, payload: [testCsvDataId]},

    // set filter to 'time'
    {action: VisStateActions.setFilter, payload: [0, 'name', 'time']},

    // set filter value
    {
      action: VisStateActions.setFilter,
      payload: [0, 'value', [1474606800000, 1474617600000]]
    },

    // set filter animation speed
    {
      action: VisStateActions.updateFilterAnimationSpeed,
      payload: [0, 4]
    },

    // add another filter
    {action: VisStateActions.addFilter, payload: [testGeoJsonDataId]},

    // set filter to 'RATE'
    {action: VisStateActions.setFilter, payload: [1, 'name', 'RATE']},

    // set filter value
    {action: VisStateActions.setFilter, payload: [1, 'value', ['a']]}
  ]);

  // replace filter id with controlled value for easy testing
  prepareState.visState.filters.forEach((f, i) => {
    f.id = `${f.name}-${i}`;
  });

  return prepareState;
}

function mockStateWithMultiFilters() {
  const initialState = mockStateWithFilters();

  const prepareState = applyActions(keplerGlReducer, initialState, [
    // add filter
    {action: VisStateActions.addFilter, payload: [testCsvDataId]},

    // set filter to 'time'
    {action: VisStateActions.setFilter, payload: [2, 'name', 'date']},

    // set filter value
    {
      action: VisStateActions.setFilter,
      payload: [2, 'value', ['2016-09-24', '2016-09-23']]
    },

    // add another filter
    {action: VisStateActions.addFilter, payload: [testGeoJsonDataId]},

    // set filter to 'RATE'
    {action: VisStateActions.setFilter, payload: [3, 'name', 'TRIPS']},

    // set filter value
    {action: VisStateActions.setFilter, payload: [3, 'value', [4, 12]]},

    // add another gpu filter
    {action: VisStateActions.addFilter, payload: [testCsvDataId]},

    // set filter to 'time'
    {action: VisStateActions.setFilter, payload: [4, 'name', 'epoch']},

    // set filter value
    {
      action: VisStateActions.setFilter,
      payload: [4, 'value', [1472700000000, 1472760000000]]
    }
  ]);

  // replace filter id with controlled value for easy testing
  prepareState.visState.filters.forEach((f, i) => {
    f.id = `${f.name}-${i}`;
  });

  return prepareState;
}

function mockStateWithH3Layer() {
  const initialState = cloneDeep(InitialState);

  const prepareState = applyActions(keplerGlReducer, initialState, [
    {
      action: addDataToMap,
      payload: [
        {
          datasets: {
            info: {id: csvDataId},
            data: processCsvData(testLayerData)
          },
          config: {
            version: 'v1',
            config: {
              visState: {
                layers: [
                  {
                    id: 'h3-layer',
                    type: 'hexagonId',
                    config: {
                      dataId: csvDataId,
                      label: 'H3 Hexagon',
                      color: [255, 153, 31],
                      columns: {hex_id: 'hex_id'},
                      isVisible: true
                    }
                  }
                ]
              }
            }
          }
        }
      ]
    }
  ]);
  return prepareState;
}
/**
 * Mock state will contain 1 heatmap, 1 point and 1 arc layer, 1 hexbin layer and 1 time filter
 * @param {*} state
 */
function mockStateWithTripData() {
  const initialState = cloneDeep(InitialState);

  return keplerGlReducer(
    initialState,
    addDataToMap({
      datasets: {
        info: {
          label: 'Sample Trips',
          id: tripDataId
        },
        data: {fields: tripFields, rows: tripRows}
      },
      config: tripConfig
    })
  );
}

function mockStateWithLayerDimensions(state) {
  const initialState = state || mockStateWithFileUpload();

  const layer0 = initialState.visState.layers.find(
    l => l.config.dataId === testCsvDataId && l.type === 'point'
  );

  const colorField = initialState.visState.datasets[testCsvDataId].fields.find(
    f => f.name === 'gps_data.types'
  );

  const colorFieldPayload = [layer0, {colorField}, 'color'];

  const colorRangePayload = [
    layer0,
    {colorRange: VizColorPalette.find(c => c.name === 'Uber Viz Sequential 2')},
    'color'
  ];

  const textLabelField = initialState.visState.datasets[testCsvDataId].fields.find(
    f => f.name === 'date'
  );

  const textLabelPayload1 = [layer0, 0, 'field', textLabelField];
  const textLabelPayload2 = [layer0, 0, 'color', [255, 0, 0]];

  const prepareState = applyActions(keplerGlReducer, initialState, [
    // change colorField
    {
      action: VisStateActions.layerVisualChannelConfigChange,
      payload: colorFieldPayload
    },

    // change colorRange
    {action: VisStateActions.layerVisConfigChange, payload: colorRangePayload},

    // change textLabel
    {action: VisStateActions.layerTextLabelChange, payload: textLabelPayload1},
    {action: VisStateActions.layerTextLabelChange, payload: textLabelPayload2},

    // add layer from config
    {
      action: VisStateActions.addLayer,
      payload: [
        {
          id: 'hexagon-2',
          type: 'hexagon',
          config: {
            color: [2, 2, 2],
            isVisible: true,
            dataId: testCsvDataId,
            columns: {
              lat: 'gps_data.lat',
              lng: 'gps_data.lng'
            }
          }
        }
      ]
    }
  ]);

  const reorderPayload = [[2, 0, 1]];

  const resultState = applyActions(keplerGlReducer, prepareState, [
    // reorder Layer
    {action: VisStateActions.reorderLayer, payload: reorderPayload}
  ]);

  return resultState;
}

function mockStateWithCustomMapStyle() {
  const initialState = cloneDeep(InitialState);
  const testCustomMapStyle = {
    ...getInitialInputStyle(),
    accessToken: 'secret_token',
    isValid: true,
    label: 'Smoothie the Cat',
    style: {
      version: 'v8',
      id: 'smoothie_the_cat',
      layers: [{id: 'background'}, {id: 'road'}, {id: 'label'}],
      name: 'Smoothie the Cat'
    },
    url: 'mapbox://styles/shanhe/smoothie.the.cat'
  };

  // add custom map style
  const updatedState = applyActions(keplerGlReducer, initialState, [
    {
      action: MapStyleActions.inputMapStyle,
      payload: [testCustomMapStyle]
    },
    {
      action: MapStyleActions.loadCustomMapStyle,
      payload: [
        {
          style: testCustomMapStyle.style
        }
      ]
    },
    {
      action: MapStyleActions.addCustomMapStyle,
      payload: [{}]
    },
    {
      action: MapStyleActions.set3dBuildingColor,
      payload: [[1, 2, 3]]
    }
  ]);

  return updatedState;
}

function mockStateWithSplitMaps(state) {
  const initialState = state || mockStateWithFileUpload();

  const firstLayer = initialState.visState.layers[0];

  const prepareState = applyActions(keplerGlReducer, initialState, [
    // toggle splitMaps
    {action: MapStateActions.toggleSplitMap, payload: []},

    // toggleLayerForMap
    {action: VisStateActions.toggleLayerForMap, payload: [0, firstLayer.id]}
  ]);

  return prepareState;
}

function mockStateWithTooltipFormat() {
  const initialState = mockStateWithFileUpload();

  const oldConfig = initialState.visState.interactionConfig.tooltip;
  const newConfig = {
    ...oldConfig,
    config: {
      ...oldConfig.config,
      compareMode: true,
      compareType: COMPARE_TYPES.RELATIVE,
      fieldsToShow: {
        ...oldConfig.config.fieldsToShow,
        [testCsvDataId]: [{name: 'gps_data.utc_timestamp', format: 'LL'}],
        [testGeoJsonDataId]: [
          {name: 'OBJECTID', format: null},
          {name: 'ZIP_CODE', format: null},
          {name: 'ID', format: null},
          {name: 'TRIPS', format: '.3f'},
          {name: 'RATE', format: null}
        ]
      }
    }
  };

  const prepareState = applyActions(keplerGlReducer, initialState, [
    {action: VisStateActions.interactionConfigChange, payload: [newConfig]}
  ]);

  return prepareState;
}

// saved hexagon layer
export const expectedSavedLayer0 = {
  id: 'hexagon-2',
  type: 'hexagon',
  config: {
    dataId: testCsvDataId,
    label: 'new layer',
    color: [2, 2, 2],
    columns: {
      lat: 'gps_data.lat',
      lng: 'gps_data.lng'
    },
    hidden: false,
    isVisible: true,
    visConfig: {
      opacity: DEFAULT_LAYER_OPACITY,
      worldUnitSize: 1,
      resolution: 8,
      colorRange: DEFAULT_COLOR_RANGE,
      coverage: 1,
      sizeRange: [0, 500],
      percentile: [0, 100],
      elevationPercentile: [0, 100],
      elevationScale: 5,
      colorAggregation: 'count',
      sizeAggregation: 'count',
      enable3d: false
    },
    textLabel: [DEFAULT_TEXT_LABEL]
  },
  visualChannels: {
    colorField: null,
    colorScale: 'quantile',
    sizeField: null,
    sizeScale: 'linear'
  }
};

export const expectedLoadedLayer0 = {
  id: 'hexagon-2',
  type: 'hexagon',
  config: {
    dataId: testCsvDataId,
    label: 'new layer',
    color: [2, 2, 2],
    columns: {
      lat: 'gps_data.lat',
      lng: 'gps_data.lng'
    },
    hidden: false,
    isVisible: true,
    visConfig: {
      opacity: DEFAULT_LAYER_OPACITY,
      worldUnitSize: 1,
      resolution: 8,
      colorRange: DEFAULT_COLOR_RANGE,
      coverage: 1,
      sizeRange: [0, 500],
      percentile: [0, 100],
      elevationPercentile: [0, 100],
      elevationScale: 5,
      colorAggregation: 'count',
      sizeAggregation: 'count',
      enable3d: false
    },
    colorField: null,
    colorScale: 'quantile',
    sizeField: null,
    sizeScale: 'linear',
    textLabel: [DEFAULT_TEXT_LABEL]
  }
};

export const expectedSavedLayer1 = {
  id: 'point-0',
  type: 'point',
  config: {
    dataId: testCsvDataId,
    label: 'gps data',
    color: [0, 0, 0],
    columns: {
      lat: 'gps_data.lat',
      lng: 'gps_data.lng',
      altitude: null
    },
    textLabel: [
      {
        ...DEFAULT_TEXT_LABEL,
        field: {
          name: 'date',
          type: 'date'
        },
        color: [255, 0, 0]
      }
    ],
    hidden: false,
    isVisible: true,
    visConfig: {
      radius: 10,
      fixedRadius: false,
      opacity: DEFAULT_LAYER_OPACITY,
      outline: false,
      filled: true,
      thickness: 2,
      colorRange: {
        name: 'Uber Viz Sequential 2',
        type: 'sequential',
        category: 'Uber',
        colors: ['#E6FAFA', '#AAD7DA', '#68B4BB', '#00939C']
      },
      strokeColorRange: DEFAULT_COLOR_RANGE,
      strokeColor: null,
      radiusRange: [0, 50]
    }
  },
  visualChannels: {
    colorField: {
      name: 'gps_data.types',
      type: 'string'
    },
    colorScale: 'ordinal',
    sizeField: null,
    sizeScale: 'linear',
    strokeColorField: null,
    strokeColorScale: 'quantile'
  }
};

export const expectedLoadedLayer1 = {
  id: 'point-0',
  type: 'point',
  config: {
    dataId: testCsvDataId,
    label: 'gps data',
    color: [0, 0, 0],
    columns: {
      lat: 'gps_data.lat',
      lng: 'gps_data.lng',
      altitude: null
    },
    hidden: false,
    isVisible: true,
    visConfig: {
      radius: 10,
      fixedRadius: false,
      opacity: DEFAULT_LAYER_OPACITY,
      outline: false,
      thickness: 2,
      colorRange: {
        name: 'Uber Viz Sequential 2',
        type: 'sequential',
        category: 'Uber',
        colors: ['#E6FAFA', '#AAD7DA', '#68B4BB', '#00939C']
      },
      strokeColorRange: DEFAULT_COLOR_RANGE,
      filled: true,
      strokeColor: null,
      radiusRange: [0, 50]
    },
    colorField: {
      name: 'gps_data.types',
      type: 'string'
    },
    colorScale: 'ordinal',
    strokeColorField: null,
    strokeColorScale: 'quantile',
    sizeField: null,
    sizeScale: 'linear',
    textLabel: [
      {
        ...DEFAULT_TEXT_LABEL,
        field: {
          name: 'date',
          type: 'date'
        },
        color: [255, 0, 0]
      }
    ]
  }
};

export const expectedSavedLayer2 = {
  id: 'geojson-1',
  type: 'geojson',
  config: {
    dataId: testGeoJsonDataId,
    label: 'zip',
    color: [1, 1, 1],
    columns: {
      geojson: '_geojson'
    },
    hidden: false,
    isVisible: true,
    visConfig: {
      opacity: DEFAULT_LAYER_OPACITY,
      thickness: 0.5,
      colorRange: DEFAULT_COLOR_RANGE,
      strokeColorRange: DEFAULT_COLOR_RANGE,
      strokeColor: [11, 11, 11],
      radius: 10,
      sizeRange: [0, 10],
      radiusRange: [0, 50],
      heightRange: [0, 500],
      elevationScale: 5,
      stroked: true,
      filled: true,
      enable3d: false,
      wireframe: false,
      strokeOpacity: 0.8
    },
    textLabel: [DEFAULT_TEXT_LABEL]
  },
  visualChannels: {
    colorField: null,
    colorScale: 'quantile',
    strokeColorField: null,
    strokeColorScale: 'quantile',
    sizeField: null,
    sizeScale: 'linear',
    heightField: null,
    heightScale: 'linear',
    radiusField: null,
    radiusScale: 'linear'
  }
};

export const expectedLoadedLayer2 = {
  id: 'geojson-1',
  type: 'geojson',
  config: {
    dataId: testGeoJsonDataId,
    label: 'zip',
    color: [1, 1, 1],
    columns: {
      geojson: '_geojson'
    },
    hidden: false,
    isVisible: true,
    visConfig: {
      opacity: DEFAULT_LAYER_OPACITY,
      thickness: 0.5,
      colorRange: DEFAULT_COLOR_RANGE,
      strokeColorRange: DEFAULT_COLOR_RANGE,
      strokeColor: [11, 11, 11],
      strokeOpacity: 0.8,
      radius: 10,
      sizeRange: [0, 10],
      radiusRange: [0, 50],
      heightRange: [0, 500],
      elevationScale: 5,
      stroked: true,
      filled: true,
      enable3d: false,
      wireframe: false
    },
    colorField: null,
    colorScale: 'quantile',
    strokeColorField: null,
    strokeColorScale: 'quantile',
    sizeField: null,
    sizeScale: 'linear',
    heightField: null,
    heightScale: 'linear',
    radiusField: null,
    radiusScale: 'linear',
    textLabel: [DEFAULT_TEXT_LABEL]
  }
};

export const StateWFiles = mockStateWithFileUpload();
export const StateWFilters = mockStateWithFilters();
export const StateWFilesFiltersLayerColor = mockStateWithLayerDimensions(StateWFilters);
export const StateWMultiFilters = mockStateWithMultiFilters();

export const StateWCustomMapStyle = mockStateWithCustomMapStyle();
export const StateWSplitMaps = mockStateWithSplitMaps();
export const StateWTrips = mockStateWithTripData();
export const StateWTripGeojson = mockStateWithTripGeojson();
export const StateWTooltipFormat = mockStateWithTooltipFormat();
export const StateWH3Layer = mockStateWithH3Layer();

export const expectedSavedTripLayer = {
  id: 'trip-0',
  type: 'trip',
  config: {
    dataId: 'trip_data',
    label: 'Trip Data',
    color: [0, 0, 0],
    columns: {
      geojson: '_geojson'
    },
    hidden: false,
    isVisible: true,
    visConfig: {
      opacity: DEFAULT_LAYER_OPACITY,
      thickness: 0.5,
      colorRange: DEFAULT_COLOR_RANGE,
      trailLength: 180,
      sizeRange: [0, 10]
    },
    textLabel: [DEFAULT_TEXT_LABEL]
  },
  visualChannels: {
    colorField: null,
    colorScale: 'quantile',
    sizeField: null,
    sizeScale: 'linear'
  }
};

export const mockKeplerProps = {
  ...StateWFiles,
  ...DEFAULT_KEPLER_GL_PROPS,
  visStateActions: VisStateActions,
  mapStateActions: MapStateActions,
  mapStyleActions: MapStyleActions,
  uiStateActions: UIStateActions,
  providerActions: ProviderActions
};
