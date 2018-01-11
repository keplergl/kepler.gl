import test from 'tape';

import {cmpFilters, cmpSavedLayers} from '../../../../../test/util/comparison-utils';
import SchemaManager from '../../../../schemas/app-schema';

import {StateWFilesFiltersLayerColor} from '../../../../../test/util/mock-app-state';

const expectedSavedLayer0 = {
  id: 'hexagon-2',
  type: 'hexagon',
  config: {
    dataId: '190vdll3di',
    label: 'new layer',
    color: [34, 63, 154],
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
      'hi-precision': false,
      colorAggregation: 'average',
      sizeAggregation: 'average',
      enable3d: false
    }
  },
  visualChannels: {
    colorField: null,
    colorScale: 'quantile',
    sizeField: null,
    sizeScale: 'linear'
  }
};

const expectedLoadedLayer0 = {
  id: 'hexagon-2',
  type: 'hexagon',
  config: {
    dataId: '190vdll3di',
    label: 'new layer',
    color: [
      34,
      63,
      154
    ],
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
      'hi-precision': false,
      colorAggregation: 'average',
      sizeAggregation: 'average',
      enable3d: false
    },
    colorField: null,
    colorScale: 'quantile',
    sizeField: null,
    sizeScale: 'linear'
  }
};

const expectedSavedLayer1 = {
  id: 'point-0',
  type: 'point',
  config: {
    dataId: '190vdll3di',
    label: 'gps data',
    color: [136, 87, 44],
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
        colors: [
          '#E6FAFA',
          '#AAD7DA',
          '#68B4BB',
          '#00939C'
        ]
      },
      radiusRange: [
        0,
        50
      ],
      'hi-precision': false
    }
  },
  visualChannels: {
    colorField: {
      name: 'gps_data.types',
      type: 'string'
    },
    colorScale: 'ordinal',
    sizeField: null,
    sizeScale: 'linear'
  }
};

const expectedLoadedLayer1 = {
  id: 'point-0',
  type: 'point',
  config: {
    dataId: '190vdll3di',
    label: 'gps data',
    color: [
      136,
      87,
      44
    ],
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
        colors: [
          '#E6FAFA',
          '#AAD7DA',
          '#68B4BB',
          '#00939C'
        ]
      },
      radiusRange: [0, 50],
      'hi-precision': false
    },
    colorField: {
      name: 'gps_data.types',
      type: 'string'
    },
    colorScale: 'ordinal',
    sizeField: null,
    sizeScale: 'linear'
  }
};

const expectedSavedLayer2 = {
  id :'geojson-1',
  type :'geojson',
  config :{
    dataId :'ieukmgne',
    label :'zip',
    color :[
      255,
      153,
      31
    ],
    columns :{
      geojson :'_geojson'
    },
    isVisible :true,
    visConfig :{
      opacity :0.8,
      thickness :2,
      colorRange :{
        name :'Global Warming',
        type :'sequential',
        category :'Uber',
        colors :[
          '#5A1846',
          '#900C3F',
          '#C70039',
          '#E3611C',
          '#F1920E',
          '#FFC300'
        ]
      },
      radius :10,
      sizeRange :[0, 10],
      radiusRange :[0, 50],
      heightRange :[0, 500],
      elevationScale :5,
      'hi-precision' :false,
      stroked :true,
      filled :false,
      enable3d :false,
      wireframe :false
    }
  },
  visualChannels :{
    colorField :null,
    colorScale :'quantile',
    sizeField :null,
    sizeScale :'linear',
    heightField :null,
    heightScale :'linear',
    radiusField :null,
    radiusScale :'linear'
  }
};

const expectedLoadedLayer2 = {
  id: 'geojson-1',
  type: 'geojson',
  config: {
    dataId: 'ieukmgne',
    label: 'zip',
    color: [255, 153, 31],
    columns: {
      geojson: '_geojson'
    },
    isVisible: true,
    visConfig: {
      opacity: 0.8,
      thickness: 2,
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
      radius: 10,
      sizeRange: [0, 10],
      radiusRange: [0, 50],
      heightRange: [0, 500],
      elevationScale: 5,
      'hi-precision': false,
      stroked: true,
      filled: false,
      enable3d: false,
      wireframe: false
    },
    colorField: null,
    colorScale: 'quantile',
    sizeField: null,
    sizeScale: 'linear',
    heightField: null,
    heightScale: 'linear',
    radiusField: null,
    radiusScale: 'linear'
  }
};

test('#visStateSchema -> v1 -> save layers', t => {
  const initialState = StateWFilesFiltersLayerColor.toJS();

  // save state
  const vsToSave = SchemaManager.getAppConfigToSave(initialState).config.visState;

  t.deepEqual(Object.keys(vsToSave),
    ['filters', 'layers', 'interactionConfig', 'layerBlending', 'splitMaps'],
    'visState should have all 5 entries');

  const exptectedSavedLayers = [
    expectedSavedLayer0,
    expectedSavedLayer1,
    expectedSavedLayer2
  ];

  const layersToSave = vsToSave.layers;

  cmpSavedLayers(t, exptectedSavedLayers, layersToSave);
  t.end();
});

test('#visStateSchema -> v1 -> load layers', t => {
  const initialState = StateWFilesFiltersLayerColor.toJS();

  // save state
  const savedState = SchemaManager.getAppConfigToSave(initialState);
  const vsLoaded = SchemaManager.parseSavedConfig(savedState).visState;

  t.deepEqual(Object.keys(vsLoaded),
    ['filters', 'layers', 'interactionConfig', 'layerBlending', 'splitMaps'],
    'visState should have all 5 entries');

  const loadedLayers = vsLoaded.layers;

  const expectedLoadedLayers = [
    expectedLoadedLayer0,
    expectedLoadedLayer1,
    expectedLoadedLayer2
  ];

  cmpSavedLayers(t, expectedLoadedLayers, loadedLayers, {id: true});
  t.end();
});

test('#visStateSchema -> v1 -> save load filters', t => {
  const initialState = StateWFilesFiltersLayerColor.toJS();
  const savedState = SchemaManager.getAppConfigToSave(initialState);

  // save state
  const vsToSave = savedState.config.visState;
  const vsLoaded = SchemaManager.parseSavedConfig(savedState).visState;
  const loadedFilters = vsLoaded.filters;

  // test saved filters
  const filtersToSave = vsToSave.filters;

  const expectedSavedFilters = [{
    dataId: '190vdll3di',
    id: 'hjpn8frza',
    name: 'time',
    type: 'timeRange',
    value: [1474606800000, 1474617600000],
    enlarged: false,
    plotType: 'histogram',
    yAxis: null
  }, {
    dataId: 'ieukmgne',
    id: 'vpk2466o',
    name: 'RATE',
    type: 'multiSelect',
    value: ['a'],
    enlarged: false,
    plotType: 'histogram',
    yAxis: null
  }];

  cmpFilters(t, expectedSavedFilters, filtersToSave);
  cmpFilters(t, expectedSavedFilters, loadedFilters);

  t.end();
});

test('#visStateSchema -> v1 -> save load interaction', t => {
  const initialState = StateWFilesFiltersLayerColor.toJS();
  const savedState = SchemaManager.getAppConfigToSave(initialState);

  // save state
  const interactionToSave = savedState.config.visState.interactionConfig;
  const interactionLoaded = SchemaManager.parseSavedConfig(savedState).visState.interactionConfig;

  const expectedSaved = {
    tooltip: {
      enabled: true,
      fieldsToShow: {
        '190vdll3di': [
          'gps_data.utc_timestamp',
          'gps_data.types',
          'epoch',
          'has_driver_initiated_contact',
          'id'
        ],
        ieukmgne: [
          'OBJECTID', 'ZIP_CODE', 'ID', 'TRIPS', 'RATE'
        ]}},
    brush: {
      enabled: false,
      size: 0.5
    }
  };

  t.deepEqual(interactionToSave, expectedSaved);
  t.deepEqual(interactionLoaded, expectedSaved);

  t.end();
});

test('#visStateSchema -> v1 -> save load layerBlending', t => {
  const initialState = StateWFilesFiltersLayerColor.toJS();
  const savedState = SchemaManager.getAppConfigToSave(initialState);

  // save state
  const layerBlendingToSave = savedState.config.visState.layerBlending;
  const layerBlendingLoaded = SchemaManager.parseSavedConfig(savedState).visState.layerBlending;

  const expectedSaved = 'normal';

  t.deepEqual(layerBlendingToSave, expectedSaved);
  t.deepEqual(layerBlendingLoaded, expectedSaved);

  t.end();
});
