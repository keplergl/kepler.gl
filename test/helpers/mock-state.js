// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape-catch';
import cloneDeep from 'lodash.clonedeep';
import {drainTasksForTesting} from 'react-palm/tasks';

import {getInitialInputStyle, keplerGlReducerCore as keplerGlReducer} from '@kepler.gl/reducers';

import {
  VizColorPalette,
  COMPARE_TYPES,
  DEFAULT_LAYER_OPACITY,
  DEFAULT_TEXT_LABEL,
  DEFAULT_COLOR_RANGE,
  DEFAULT_HIGHLIGHT_COLOR,
  DEFAULT_LAYER_LABEL
} from '@kepler.gl/constants';
import {DEFAULT_KEPLER_GL_PROPS, getUpdateVisDataPayload} from '@kepler.gl/components';
import {
  addDataToMap,
  VisStateActions,
  MapStateActions,
  MapStyleActions,
  UIStateActions,
  ProviderActions
} from '@kepler.gl/actions';

// fixtures
import {
  dataId as csvDataId,
  testFields,
  testAllData,
  testCsvDataSlice1,
  testCsvDataSlice1Id,
  testCsvDataSlice2,
  testCsvDataSlice2Id,
  syncTimeFilterValue
} from '../fixtures/test-csv-data';
import testLayerData from '../fixtures/test-layer-data';

import {fields, rows, geoJsonDataId} from '../fixtures/geojson';
import {
  fields as tripFields,
  rows as tripRows,
  config as tripConfig,
  dataId as tripDataId
} from '../fixtures/test-trip-data';
import tripCsvData, {
  tripCsvDataInfo,
  expectedTripLayerConfig
} from '../fixtures/test-trip-csv-data';
import testArcData, {arcDataInfo, config as arcDataConfig} from '../fixtures/test-arc-data';
import tripGeojson, {tripDataInfo} from '../fixtures/trip-geojson';
import {processCsvData, processGeojson, processRowObject} from '@kepler.gl/processors';
import {MOCK_MAP_STYLE} from './mock-map-styles';

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

// TODO: need to be deleted and imported from raw-states
export const InitialState = keplerGlReducer(undefined, {});

/**
 * Mock app state with uploaded geojson and csv file
 * @returns {Immutable} appState
 */
export function mockStateWithFileUpload() {
  const initialState = cloneDeep(InitialState);

  // load csv and geojson
  const updatedState = applyActions(keplerGlReducer, initialState, [
    {
      action: MapStyleActions.loadMapStyles,
      payload: [{dark: MOCK_MAP_STYLE}]
    },
    {
      action: VisStateActions.updateVisData,
      payload: [[{info: csvInfo, data: {fields: testFields, rows: testAllData}}]]
    },
    {
      action: VisStateActions.updateVisData,
      payload: [[{info: geojsonInfo, data: {fields: geojsonFields, rows: geojsonRows}}]]
    }
  ]);
  // cleanup tasks created during loadMapStyles
  drainTasksForTesting();
  // replace layer id and color with controlled value for testing
  updatedState.visState.layers.forEach((l, i) => {
    const oldLayerId = l.id;
    l.id = `${l.type}-${i}`;
    l.config.color = [i, i, i];
    if (l.config.visConfig.strokeColor) {
      l.config.visConfig.strokeColor = [i + 10, i + 10, i + 10];
    }
    // update layerOrder with newly created IDs
    updatedState.visState.layerOrder = updatedState.visState.layerOrder.map(layerId =>
      layerId === oldLayerId ? l.id : layerId
    );
  });

  test(t => {
    t.equal(updatedState.visState.layers.length, 2, 'should auto create 2 layers');
    t.end();
  });

  return updatedState;
}

function mockStateWithLayerCustomColorBreaksLegends() {
  const initialState = cloneDeep(InitialState);
  const mockColorRange = {
    colors: ['#FF000', '#00FF00', '#0000FF'],
    colorMap: [
      [1, '#FF0000'],
      [3, '#00FF00'],
      [5, '#0000FF']
    ],
    colorLegends: {
      '#FF0000': 'hello'
    }
  };
  // load csv and geojson
  const updatedState = applyActions(keplerGlReducer, initialState, [
    {
      action: MapStyleActions.loadMapStyles,
      payload: [{dark: MOCK_MAP_STYLE}]
    },
    {
      action: addDataToMap,
      payload: [
        {
          datasets: [
            {
              info: csvInfo,
              data: {fields: testFields, rows: testAllData}
            }
          ],
          config: {
            version: 'v1',
            config: {
              visState: {
                layers: [
                  {
                    type: 'point',
                    id: 'point-layer-0',
                    config: {
                      dataId: csvInfo.id,
                      columns: {
                        lat: 'gps_data.lat',
                        lng: 'gps_data.lng'
                      },
                      color: [255, 0, 0],
                      label: 'pickup',
                      isVisible: true,
                      visConfig: {
                        colorRange: mockColorRange
                      }
                    },
                    visualChannels: {
                      colorField: {
                        name: 'uid',
                        type: 'integer'
                      },
                      colorScale: 'custom'
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

  // cleanup tasks created during loadMapStyles
  drainTasksForTesting();

  test(t => {
    t.equal(updatedState.visState.layers.length, 1, 'should load 1 layer');
    t.deepEqual(
      updatedState.visState.layers[0].config.visConfig.colorRange,
      mockColorRange,
      'should load layer colorRange correctly'
    );
    t.deepEqual(
      updatedState.visState.layers[0].config.colorScale,
      'custom',
      'should load layer color Scale correctly'
    );

    t.deepEqual(
      updatedState.visState.layers[0].config.colorField.name,
      'uid',
      'should load colorField correctly'
    );

    t.end();
  });

  return updatedState;
}

function mockStateWithSyncedTimeFilter() {
  const initialState = cloneDeep(InitialState);
  // load 2 csv data
  const updatedState = applyActions(keplerGlReducer, initialState, [
    {
      action: MapStyleActions.loadMapStyles,
      payload: [{dark: MOCK_MAP_STYLE}]
    },
    {
      action: VisStateActions.updateVisData,
      payload: [
        [
          {
            info: {
              id: testCsvDataSlice1Id,
              label: 'hello.csv',
              color: [255, 0, 0]
            },
            data: {fields: testFields, rows: testCsvDataSlice1}
          }
        ]
      ]
    },
    {
      action: VisStateActions.updateVisData,
      payload: [
        [
          {
            info: {
              id: testCsvDataSlice2Id,
              label: 'world.csv',
              color: [0, 255, 0]
            },
            data: {fields: testFields, rows: testCsvDataSlice2}
          }
        ]
      ]
    },
    // add 1 filter
    {action: VisStateActions.addFilter, payload: ['test-csv-data-1']},

    // set filter name to 'time', and value
    {
      action: VisStateActions.setFilter,
      // ['2016-09-17 00:11:56', '2016-09-17 00:21:17']
      payload: [0, ['name', 'value'], ['gps_data.utc_timestamp', [1474071116000, 1474071677000]]]
    },

    // set filter name and dataId and index 1
    {
      action: VisStateActions.setFilter,
      payload: [0, ['dataId', 'name'], ['test-csv-data-2', 'gps_data.utc_timestamp'], 1]
    },

    // set filter name to 'time', and value
    {
      action: VisStateActions.setFilter,
      // ['2016-09-17 00:11:56', '2016-09-17 00:21:17']
      payload: [0, ['value'], [syncTimeFilterValue]]
    }
  ]);

  return updatedState;
}

export function mockStateWithTripGeojson(state) {
  const initialState = cloneDeep(state || InitialState);

  // load csv and geojson
  const updatedState = applyActions(keplerGlReducer, initialState, [
    {
      action: VisStateActions.updateVisData,
      payload: [[{info: tripDataInfo, data: processGeojson(cloneDeep(tripGeojson))}]]
    }
  ]);

  // replace layer id and color with controlled value for testing
  updatedState.visState.layers.forEach((l, i) => {
    const oldLayerId = l.id;
    l.id = `${l.type}-${i}`;
    l.config.color = [i, i, i];
    // update layerOrder with newly created IDs
    updatedState.visState.layerOrder = updatedState.visState.layerOrder.map(layerId =>
      layerId === oldLayerId ? l.id : layerId
    );
  });

  return updatedState;
}

export function mockStateWithTripTable(state) {
  const initialState = cloneDeep(state || InitialState);
  const updatedState = applyActions(keplerGlReducer, initialState, [
    {
      action: addDataToMap,
      payload: [
        {
          datasets: {info: tripCsvDataInfo, data: processCsvData(tripCsvData)},
          config: {
            version: 'v1',
            config: {
              visState: {
                layers: [expectedTripLayerConfig]
              }
            }
          }
        }
      ]
    }
  ]);

  test(t => {
    t.equal(updatedState.visState.layers.length, 1, 'should create 1 trip layer');
    t.equal(updatedState.visState.layers[0].type, 'trip', 'should create trip layer');
    t.end();
  });

  return updatedState;
}

export function mockStateWithArcNeighbors(state) {
  const initialState = cloneDeep(state || InitialState);
  const updatedState = applyActions(keplerGlReducer, initialState, [
    {
      action: addDataToMap,
      payload: [
        {
          datasets: {info: arcDataInfo, data: processRowObject(testArcData)},
          config: arcDataConfig
        }
      ]
    }
  ]);

  test(t => {
    t.equal(updatedState.visState.layers.length, 3, 'should create 3 layers');
    t.equal(updatedState.visState.layers[0].type, 'point', 'should create point layer');
    t.equal(updatedState.visState.layers[1].type, 'arc', 'should create arc layer');
    t.equal(updatedState.visState.layers[2].type, 'arc', 'should create arc layer');
    t.end();
  });

  return updatedState;
}

export function mockStateWithFilters(state) {
  const initialState = state || mockStateWithFileUpload();

  const prepareState = applyActions(keplerGlReducer, initialState, [
    // add filter
    {action: VisStateActions.addFilter, payload: [testCsvDataId]},

    // set filter name to 'time', and value
    {
      action: VisStateActions.setFilter,
      payload: [0, ['name', 'value'], ['time', [1474606800000, 1474617600000]]]
    },

    // set filter animation speed
    {
      action: VisStateActions.updateFilterAnimationSpeed,
      payload: [0, 4]
    },

    // add another filter
    {action: VisStateActions.addFilter, payload: [testGeoJsonDataId]},

    // set filter to 'RATE'
    {action: VisStateActions.setFilter, payload: [1, ['name', 'value'], ['RATE', ['a']]]}
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

    // set filter to 'TRIPS'
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

function mockStateWithEffects() {
  const initialState = cloneDeep(InitialState);

  const prepareState = applyActions(keplerGlReducer, initialState, [
    {
      action: VisStateActions.addEffect,
      payload: [{id: 'e_1'}]
    },
    {
      action: VisStateActions.addEffect,
      payload: [{id: 'e_2', type: 'sepia'}]
    },
    {
      action: VisStateActions.addEffect,
      payload: [{id: 'e_3', type: 'magnify'}]
    },
    {
      action: VisStateActions.addEffect,
      payload: [{id: 'e_4', type: 'lightAndShadow', parameters: {timestamp: 100, timezone: 'UTC'}}]
    }
  ]);
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

export function mockStateWithMultipleH3Layers() {
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
                    id: 'h3-layer-1',
                    type: 'hexagonId',
                    config: {
                      dataId: csvDataId,
                      label: 'H3 Hexagon 1',
                      color: [255, 153, 31],
                      columns: {hex_id: 'hex_id'},
                      isVisible: true
                    }
                  },
                  {
                    id: 'h3-layer-2',
                    type: 'hexagonId',
                    config: {
                      dataId: csvDataId,
                      label: 'H3 Hexagon 2',
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

export function mockStateWithLayerDimensions(state) {
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

  const reorderPayload = [['hexagon-2', 'point-0', 'geojson-1']];

  const resultState = applyActions(keplerGlReducer, prepareState, [
    // reorder Layer
    {action: VisStateActions.reorderLayer, payload: reorderPayload}
  ]);

  return resultState;
}

function mockStateWithCustomMapStyle(customType = 'LOCAL') {
  const initialState = cloneDeep(InitialState);
  const testCustomMapStyle = {
    ...getInitialInputStyle(),
    id: 'smoothie_the_cat',
    accessToken: 'secret_token',
    isValid: true,
    label: 'Smoothie the Cat',
    style: {
      version: 'v8',
      id: 'smoothie_the_cat',
      layers: [{id: 'background'}, {id: 'road'}, {id: 'label'}],
      name: 'Smoothie the Cat'
    },
    url: 'mapbox://styles/shanhe/smoothie.the.cat',
    icon: 'https://api.mapbox.com/styles/v1/shanhe/smoothie.the.cat/static/-122.3391,37.7922,9,0,0/400x300?access_token=secret_token&logo=false&attribution=false',
    custom: customType
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
  const secondLayer = initialState.visState.layers[1];
  const prepareState = applyActions(keplerGlReducer, initialState, [
    // toggle splitMaps
    {action: MapStateActions.toggleSplitMap, payload: []},

    // toggleLayerForMap
    {action: VisStateActions.toggleLayerForMap, payload: [0, firstLayer.id]},

    // open geojson layer
    {action: VisStateActions.toggleLayerForMap, payload: [1, secondLayer.id]},

    {action: VisStateActions.toggleLayerForMap, payload: [1, firstLayer.id]}
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

function mockStateWithGeocoderDataset() {
  const initialState = cloneDeep(InitialState);

  const oldInteractionConfig = initialState.visState.interactionConfig.tooltip;
  const newInteractionConfig = {
    ...oldInteractionConfig,
    config: {
      ...oldInteractionConfig.config,
      fieldsToShow: {
        ...oldInteractionConfig.config.fieldsToShow,
        geocoder_dataset: [
          {
            name: 'lt',
            format: null
          },
          {
            name: 'ln',
            format: null
          },
          {
            name: 'icon',
            format: null
          },
          {
            name: 'text',
            format: null
          }
        ]
      },
      compareMode: false,
      compareType: COMPARE_TYPES.ABSOLUTE
    }
  };
  const geocoderDataset = getUpdateVisDataPayload(48.85658, 2.35183, 'Paris');

  const prepareState = applyActions(keplerGlReducer, initialState, [
    {
      action: VisStateActions.updateVisData,
      payload: geocoderDataset
    },
    {action: VisStateActions.interactionConfigChange, payload: [newInteractionConfig]}
  ]);

  return prepareState;
}

function mockStateWithLayerStyling() {
  const initialState = mockStateWithFileUpload();
  const layer0 = initialState.visState.layers.find(
    l => l.config.dataId === testCsvDataId && l.type === 'point'
  );
  const mapCenter = {
    longitude: 31.2369645,
    latitude: 30.0242098,
    zoom: 13
  };

  const prepareState = applyActions(keplerGlReducer, initialState, [
    // make radius bigger
    {
      action: VisStateActions.layerVisConfigChange,
      payload: [layer0, {radius: 100}]
    },
    // center map
    {
      action: MapStateActions.updateMap,
      payload: [mapCenter]
    }
  ]);

  return prepareState;
}

// saved hexagon layer
export const expectedSavedLayer0 = {
  id: 'hexagon-2',
  type: 'hexagon',
  config: {
    dataId: testCsvDataId,
    label: DEFAULT_LAYER_LABEL,
    highlightColor: DEFAULT_HIGHLIGHT_COLOR,
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
      enableElevationZoomFactor: true,
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
    label: DEFAULT_LAYER_LABEL,
    highlightColor: DEFAULT_HIGHLIGHT_COLOR,
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
      enableElevationZoomFactor: true,
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
    label: 'gps_data',
    columnMode: 'points',
    highlightColor: DEFAULT_HIGHLIGHT_COLOR,
    color: [0, 0, 0],
    columns: {
      lat: 'gps_data.lat',
      lng: 'gps_data.lng'
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
      billboard: false,
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
      radiusRange: [0, 50],
      allowHover: true,
      showNeighborOnHover: false,
      showHighlightColor: true
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
    label: 'gps_data',
    columnMode: 'points',
    highlightColor: DEFAULT_HIGHLIGHT_COLOR,
    color: [0, 0, 0],
    columns: {
      lat: 'gps_data.lat',
      lng: 'gps_data.lng'
    },
    hidden: false,
    isVisible: true,
    visConfig: {
      radius: 10,
      billboard: false,
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
      radiusRange: [0, 50],
      allowHover: true,
      showNeighborOnHover: false,
      showHighlightColor: true
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
    highlightColor: DEFAULT_HIGHLIGHT_COLOR,
    color: [1, 1, 1],
    columns: {
      geojson: '_geojson'
    },
    columnMode: 'geojson',
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
      fixedHeight: false,
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
    highlightColor: DEFAULT_HIGHLIGHT_COLOR,
    color: [1, 1, 1],
    columns: {
      geojson: '_geojson'
    },
    columnMode: 'geojson',
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
      fixedHeight: false,
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
export const StateWEffects = mockStateWithEffects();
export const StateWFilesFiltersLayerColor = mockStateWithLayerDimensions(StateWFilters);
export const StateWMultiFilters = mockStateWithMultiFilters();

export const StateWCustomMapStyleLegacy = mockStateWithCustomMapStyle(true);
export const StateWCustomMapStyleLocal = mockStateWithCustomMapStyle('LOCAL');
export const StateWCustomMapStyleManaged = mockStateWithCustomMapStyle('MANAGED');
export const StateWSplitMaps = mockStateWithSplitMaps();
export const StateWTrips = mockStateWithTripData();
export const StateWTripGeojson = mockStateWithTripGeojson();
export const StateWTooltipFormat = mockStateWithTooltipFormat();
export const StateWH3Layer = mockStateWithH3Layer();
export const StateWMultiH3Layers = mockStateWithMultipleH3Layers();
export const StateWithGeocoderDataset = mockStateWithGeocoderDataset();
export const StateWLayerStyle = mockStateWithLayerStyling();
export const StateWLayerCustomColorBreaks = mockStateWithLayerCustomColorBreaksLegends();
export const StateWTripTable = mockStateWithTripTable();
export const StateWArcNeighbors = mockStateWithArcNeighbors();
export const StateWSyncedTimeFilter = mockStateWithSyncedTimeFilter();

export const expectedSavedTripLayer = {
  id: 'trip-0',
  type: 'trip',
  config: {
    dataId: 'trip_data',
    label: 'Trip Data',
    highlightColor: DEFAULT_HIGHLIGHT_COLOR,
    color: [0, 0, 0],
    columnMode: 'geojson',
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
      fadeTrail: true,
      billboard: false,
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

export function mockKeplerPropsWithState({
  state,
  keplerProps = DEFAULT_KEPLER_GL_PROPS,
  visStateActions = {},
  mapStateActions = {},
  mapStyleActions = {},
  uiStateActions = {},
  providerActions = {}
}) {
  return {
    ...state,
    ...keplerProps,
    visStateActions: {
      ...VisStateActions,
      ...visStateActions
    },
    mapStateActions: {
      ...MapStateActions,
      ...mapStateActions
    },
    mapStyleActions: {
      ...MapStyleActions,
      ...mapStyleActions
    },
    uiStateActions: {
      ...UIStateActions,
      ...uiStateActions
    },
    providerActions: {
      ...ProviderActions,
      ...providerActions
    }
  };
}

export const mockKeplerProps = mockKeplerPropsWithState({state: StateWLayerStyle});

// mount map with mockKeplerProps
// hover over data index 15
// tested in map-container-test
export const expectedLayerHoverProp = {
  data: mockKeplerProps.visState.datasets[testCsvDataId].dataContainer.row(15),
  fields: mockKeplerProps.visState.datasets[testCsvDataId].fields,
  fieldsToShow:
    mockKeplerProps.visState.interactionConfig.tooltip.config.fieldsToShow[testCsvDataId],
  layer: mockKeplerProps.visState.layers[0]
};

export const expectedGeojsonLayerHoverProp = {
  data: mockKeplerProps.visState.datasets[testGeoJsonDataId].dataContainer.row(0),
  fields: mockKeplerProps.visState.datasets[testGeoJsonDataId].fields,
  fieldsToShow:
    mockKeplerProps.visState.interactionConfig.tooltip.config.fieldsToShow[testGeoJsonDataId],
  layer: mockKeplerProps.visState.layers[1]
};
