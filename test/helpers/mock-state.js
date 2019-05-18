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

import Immutable from 'immutable';
import cloneDeep from 'lodash.clonedeep';
import {VizColorPalette} from 'constants/custom-color-ranges';
import {getInitialInputStyle} from 'reducers/map-style-updaters';

import keplerGlReducer from 'reducers/core';
import * as VisStateActions from 'actions/vis-state-actions';
import * as MapStyleActions from 'actions/map-style-actions';
import {DEFAULT_TEXT_LABEL} from 'layers/layer-factory';

// fixtures
import {testFields, testAllData} from 'test/fixtures/test-csv-data';
import {fields, rows} from 'test/fixtures/geojson';

const geojsonFields = cloneDeep(fields);
const geojsonRows = cloneDeep(rows);

const csvInfo = {
  id: '190vdll3di',
  label: 'hello.csv',
  queryType: 'file',
  queryOption: 'csv',
  params: {file: null}
};

const geojsonInfo = {
  id: 'ieukmgne',
  label: 'zip.geojson',
  queryType: 'file',
  queryOption: 'geojson',
  params: {file: null}
};

export function applyActions(reducer, initialState, actions) {
  const actionQ = Array.isArray(actions) ? actions : [actions];

  return actionQ.reduce(
    (updatedState, {action, payload}) =>
      reducer(updatedState, action(...payload)),
    initialState
  );
}

/**
 * Mock Initial App Sate
 * @returns {Immutable} appState
 */
export function mockInitialState() {
  const initialState = keplerGlReducer(undefined, {});
  return Immutable.fromJS(initialState);
}

export const InitialState = mockInitialState();

/**
 * Mock app state with uploaded geojson and csv file
 * @returns {Immutable} appState
 */
function mockStateWithFileUpload() {
  const initialState = InitialState.toJS();

  // load csv and geojson
  const updatedState = applyActions(keplerGlReducer, initialState, [
    {
      action: VisStateActions.updateVisData,
      payload: [
        [{info: csvInfo, data: {fields: testFields, rows: testAllData}}]
      ]
    },
    {
      action: VisStateActions.updateVisData,
      payload: [
        [{info: geojsonInfo, data: {fields: geojsonFields, rows: geojsonRows}}]
      ]
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

  return Immutable.fromJS(updatedState);
}

function mockStateWithFilters(state) {
  const initialState =
    (state && state.toJS()) || mockStateWithFileUpload().toJS();

  const prepareState = applyActions(keplerGlReducer, initialState, [
    // add filter
    {action: VisStateActions.addFilter, payload: ['190vdll3di']},

    // set filter to 'time'
    {action: VisStateActions.setFilter, payload: [0, 'name', 'time']},

    // set filter value
    {
      action: VisStateActions.setFilter,
      payload: [0, 'value', [1474606800000, 1474617600000]]
    },

    // add another filter
    {action: VisStateActions.addFilter, payload: ['ieukmgne']},

    // set filter to 'RATE'
    {action: VisStateActions.setFilter, payload: [1, 'name', 'RATE']},

    // set filter value
    {action: VisStateActions.setFilter, payload: [1, 'value', ['a']]}
  ]);

  // replace filter id with controlled value for easy testing
  prepareState.visState.filters.forEach((f, i) => {
    f.id = `${f.name}-${i}`;
  });

  return Immutable.fromJS(prepareState);
}

function mockStateWithLayerDimensions(state) {
  const initialState =
    (state && state.toJS()) || mockStateWithFileUpload().toJS();

  const layer0 = initialState.visState.layers.find(
    l => l.config.dataId === '190vdll3di' && l.type === 'point'
  );

  const colorField = initialState.visState.datasets['190vdll3di'].fields.find(
    f => f.name === 'gps_data.types'
  );

  const colorFieldPayload = [layer0, {colorField}, 'color'];

  const colorRangePayload = [
    layer0,
    {colorRange: VizColorPalette.find(c => c.name === 'Uber Viz Sequential 2')},
    'color'
  ];

  const textLabelField = initialState.visState.datasets['190vdll3di'].fields.find(
    f => f.name === 'date'
  );

  const textLabelPayload1 = [
    layer0,
    0,
    'field',
    textLabelField
  ];
  const textLabelPayload2 = [
    layer0,
    0,
    'color',
    [255, 0, 0]
  ];
  // layers = [ 'point', 'geojson', 'hexagon' ]
  const reorderPayload = [[2, 0, 1]];

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

    // add layer
    {
      action: VisStateActions.addLayer,
      payload: [{id: 'hexagon-2', color: [2, 2, 2]}]
    }
  ]);

  const newLayer = prepareState.visState.layers[2];

  // set new layer to hexagon
  const updateState = applyActions(keplerGlReducer, prepareState, [
    {action: VisStateActions.layerTypeChange, payload: [newLayer, 'hexagon']}
  ]);

  const hexagonLayer = updateState.visState.layers[2];
  hexagonLayer.id = 'hexagon-2';

  const updateLayerConfig = {
    dataId: '190vdll3di',
    columns: {
      lat: {value: 'gps_data.lat', fieldIdx: 1},
      lng: {value: 'gps_data.lng', fieldIdx: 2}
    },
    isConfigActive: false
  };

  const resultState = applyActions(keplerGlReducer, updateState, [
    // select hexagon layer columns
    {
      action: VisStateActions.layerConfigChange,
      payload: [hexagonLayer, updateLayerConfig]
    },

    // reorder Layer
    {action: VisStateActions.reorderLayer, payload: reorderPayload}
  ]);

  return Immutable.fromJS(resultState);
}

function mockStateWithCustomMapStyle(state) {
  const initialState = InitialState.toJS();
  const testCustomMapStyle = {
    ...getInitialInputStyle(),
    accessToken: 'secret_token',
    isValid: true,
    label: 'Smoothie the Cat',
    icon: 'data:image/png;base64,xyz',
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
    }
  ]);

  return Immutable.fromJS(updatedState);
}

export const StateWFiles = mockStateWithFileUpload();
export const StateWFilters = mockStateWithFilters();
export const StateWFilesFiltersLayerColor = mockStateWithLayerDimensions(
  StateWFilters
);

export const StateWCustomMapStyle = mockStateWithCustomMapStyle();

// saved hexagon layer
export const expectedSavedLayer0 = {
  id: 'hexagon-2',
  type: 'hexagon',
  config: {
    dataId: '190vdll3di',
    label: 'new layer',
    color: [2, 2, 2],
    columns: {
      lat: 'gps_data.lat',
      lng: 'gps_data.lng'
    },
    isVisible: true,
    visConfig: {
      opacity: 0.8,
      worldUnitSize: 1,
      resolution: 8,
      colorRange: {
        name: 'Global Warming',
        type: 'sequential',
        category: 'Uber',
        colors: [
          '#5A1846',
          '#900C3F',
          '#C70039',
          '#E3611C',
          '#F1920E',
          '#FFC300'
        ]
      },
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
  },
};

export const expectedLoadedLayer0 = {
  id: 'hexagon-2',
  type: 'hexagon',
  config: {
    dataId: '190vdll3di',
    label: 'new layer',
    color: [2, 2, 2],
    columns: {
      lat: 'gps_data.lat',
      lng: 'gps_data.lng'
    },
    isVisible: true,
    visConfig: {
      opacity: 0.8,
      worldUnitSize: 1,
      resolution: 8,
      colorRange: {
        name: 'Global Warming',
        type: 'sequential',
        category: 'Uber',
        colors: [
          '#5A1846',
          '#900C3F',
          '#C70039',
          '#E3611C',
          '#F1920E',
          '#FFC300'
        ]
      },
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
    dataId: '190vdll3di',
    label: 'gps data',
    color: [0, 0, 0],
    columns: {
      lat: 'gps_data.lat',
      lng: 'gps_data.lng',
      altitude: null
    },
    textLabel: [{
      ...DEFAULT_TEXT_LABEL,
      field: {
        name: 'date',
        type: 'date'
      },
      color: [255, 0, 0]
    }],
    isVisible: true,
    visConfig: {
      radius: 10,
      fixedRadius: false,
      opacity: 0.8,
      outline: false,
      filled: true,
      thickness: 2,
      colorRange: {
        name: 'Uber Viz Sequential 2',
        type: 'sequential',
        category: 'Uber',
        colors: ['#E6FAFA', '#AAD7DA', '#68B4BB', '#00939C']
      },
      strokeColorRange: {
        name: 'Global Warming',
        type: 'sequential',
        category: 'Uber',
        colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
      },
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
    dataId: '190vdll3di',
    label: 'gps data',
    color: [0, 0, 0],
    columns: {
      lat: 'gps_data.lat',
      lng: 'gps_data.lng',
      altitude: null
    },
    isVisible: true,
    visConfig: {
      radius: 10,
      fixedRadius: false,
      opacity: 0.8,
      outline: false,
      thickness: 2,
      colorRange: {
        name: 'Uber Viz Sequential 2',
        type: 'sequential',
        category: 'Uber',
        colors: ['#E6FAFA', '#AAD7DA', '#68B4BB', '#00939C']
      },
      strokeColorRange: {
        name: 'Global Warming',
        type: 'sequential',
        category: 'Uber',
        colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
      },
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
    textLabel: [{
      ...DEFAULT_TEXT_LABEL,
      field: {
        name: 'date',
        type: 'date'
      },
      color: [255, 0, 0]
    }]
  }
};

export const expectedSavedLayer2 = {
  id: 'geojson-1',
  type: 'geojson',
  config: {
    dataId: 'ieukmgne',
    label: 'zip',
    color: [1, 1, 1],
    columns: {
      geojson: '_geojson'
    },
    isVisible: true,
    visConfig: {
      opacity: 0.8,
      thickness: 0.5,
      colorRange: {
        name: 'Global Warming',
        type: 'sequential',
        category: 'Uber',
        colors: [
          '#5A1846',
          '#900C3F',
          '#C70039',
          '#E3611C',
          '#F1920E',
          '#FFC300'
        ]
      },
      strokeColorRange: {
        name: 'Global Warming',
        type: 'sequential',
        category: 'Uber',
        colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
      },
      strokeColor: [11, 11, 11],
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
    dataId: 'ieukmgne',
    label: 'zip',
    color: [1, 1, 1],
    columns: {
      geojson: '_geojson'
    },
    isVisible: true,
    visConfig: {
      opacity: 0.8,
      thickness: 0.5,
      colorRange: {
        name: 'Global Warming',
        type: 'sequential',
        category: 'Uber',
        colors: [
          '#5A1846',
          '#900C3F',
          '#C70039',
          '#E3611C',
          '#F1920E',
          '#FFC300'
        ]
      },
      strokeColorRange: {
        name: 'Global Warming',
        type: 'sequential',
        category: 'Uber',
        colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
      },
      strokeColor: [11, 11, 11],
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
