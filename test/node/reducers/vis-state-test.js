// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* eslint-disable max-statements */
import test from 'tape-catch';
import sinon from 'sinon';
import * as arrow from 'apache-arrow';
import {console as Console} from 'global/window';

import {drainTasksForTesting, succeedTaskInTest, errorTaskInTest} from '@kepler.gl/tasks';
import CloneDeep from 'es-toolkit/compat/cloneDeep';

import SchemaManager from '@kepler.gl/schemas';
import {VisStateActions, MapStateActions} from '@kepler.gl/actions';
import {
  visStateReducer as reducer,
  INITIAL_VIS_STATE,
  INITIAL_MAP_STATE,
  DEFAULT_ANIMATION_CONFIG,
  serializeLayer,
  addDefaultLayers,
  validateLayerWithData,
  defaultInteractionConfig,
  prepareStateForDatasetReplace,
  syncTimeFilterWithLayerTimelineUpdater,
  setTimeFilterTimelineModeUpdater,
  setFilterAnimationTimeUpdater,
  setFilterAnimationWindowUpdater,
  calculateLayerData
} from '@kepler.gl/reducers';

import {
  processCsvData,
  processGeojson,
  processArrowBatches,
  loadExternallyHostedDataset,
  remoteDatasetFromUrl
} from '@kepler.gl/processors';
import {
  Layer,
  KeplerGlLayers,
  LayerClasses,
  COLUMN_MODE_TABLE,
  createPointCountLabelField
} from '@kepler.gl/layers';
import {copyTableAndUpdate, findPointFieldPairs, maybeToDate, KeplerTable} from '@kepler.gl/table';
import {
  createDataContainer,
  applyFilterFieldName,
  getAnimatableVisibleLayers,
  getBinThresholds,
  getFilterBinThresholds,
  getDefaultTimeFormat,
  getNumericPlotInterval,
  intervalBinFromMarks,
  getDefaultFilter,
  histogramFromDomain,
  LayerTimeInterval,
  getApplicationConfig,
  initApplicationConfig
} from '@kepler.gl/utils';
import {
  ALL_FIELD_TYPES,
  TIME_INTERVALS,
  DatasetType,
  EDITOR_MODES,
  LAYER_VIS_CONFIGS,
  DEFAULT_TEXT_LABEL,
  DEFAULT_COLOR_UI,
  FILTER_VIEW_TYPES,
  LIGHT_AND_SHADOW_EFFECT,
  ANIMATION_WINDOW,
  BINS,
  INTERVAL,
  LAYER_TYPES,
  MAX_GPU_FILTERS,
  SYNC_TIMELINE_MODES,
  GEOCODER_DATASET_NAME,
  GEOCODER_ICON_COLOR,
  GEOCODER_LAYER_ID,
  KEPLER_COLOR_PALETTES,
  colorPaletteToColorRange
} from '@kepler.gl/constants';

const {ArcLayer, PointLayer, GeojsonLayer, IconLayer, LineLayer, TripLayer} = KeplerGlLayers;

// fixtures
import testData, {
  mergedTimeFilter,
  testFields,
  testAllData,
  expectedSyncedTsFilter,
  testCsvFieldPairs
} from 'test/fixtures/test-csv-data';
import {
  geojsonData,
  geoJsonTripFilterProps,
  expectedDataToFeature,
  updatedGeoJsonLayer,
  fields as geojsonFields,
  rows as geojsonRows
} from 'test/fixtures/geojson';
import tripCsvData, {tripCsvDataInfo, expectedCoordinates} from 'test/fixtures/test-trip-csv-data';
import tripGeojson, {timeStampDomain, tripDataInfo} from 'test/fixtures/trip-geojson';
import {
  mockPolygonFeature,
  mockPolygonFeature2,
  mockPolygonData,
  mockDualLonLatRows,
  mockStartRegionPolygon,
  mockEndRegionPolygon,
  mockEastOverlapPolygon,
  mockWestOnlyPolygon,
  mockEastOnlyPolygon
} from 'test/fixtures/polygon';

// test helpers
import {
  cmpFilters,
  cmpLayers,
  cmpEffects,
  cmpDatasets,
  cmpDataset,
  cmpObjectKeys,
  cmpField,
  assertDatasetIsTable
} from 'test/helpers/comparison-utils';
import {
  applyActions,
  applyExistingDatasetTasks,
  StateWTripGeojson,
  StateWSplitMaps,
  StateWFilters,
  StateWFiles,
  StateWFilesFiltersLayerColor,
  StateWSyncedTimeFilter,
  StateWH3Layer,
  testCsvDataId,
  testGeoJsonDataId,
  InitialState,
  stateWithTimeFilterAndTripLayer
} from 'test/helpers/mock-state';
import {getNextColorMakerValue} from 'test/helpers/layer-utils';
import {expectedTripLayerConfig} from '../../fixtures/test-trip-csv-data';
import {
  testCsvDataSlice1,
  testCsvDataSlice2,
  testCsvDataSlice1Id,
  testCsvDataSlice2Id
} from '../../fixtures/test-csv-data';
import {mockStateWithSyncedFilterAndTripLayer} from '../../fixtures/synced-filter-with-trip-layer';
import {createNewDataEntryMock} from 'test/helpers/table-utils';

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
    displayName: 'start_point_lat',
    id: 'start_point_lat',
    type: 'real',
    fieldIdx: 0,
    analyzerType: 'FLOAT',
    format: '',
    valueAccessor: values => values[1]
  },
  {
    name: 'start_point_lng',
    displayName: 'start_point_lng',
    id: 'start_point_lng',
    type: 'real',
    fieldIdx: 1,
    analyzerType: 'FLOAT',
    format: '',
    valueAccessor: values => values[1]
  },
  {
    name: 'end_point_lat',
    displayName: 'end_point_lat',
    id: 'end_point_lat',
    type: 'real',
    fieldIdx: 2,
    analyzerType: 'FLOAT',
    format: '',
    valueAccessor: values => values[2]
  },
  {
    name: 'end_point_lng',
    displayName: 'end_point_lng',
    id: 'end_point_lng',
    type: 'real',
    fieldIdx: 3,
    analyzerType: 'FLOAT',
    format: '',
    valueAccessor: values => values[3]
  }
];

const expectedFieldParis = [
  {
    defaultName: 'start_point',
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
    defaultName: 'end_point',
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
];
const mockFilter = {
  fieldIdx: 0,
  name: mockData.fields[0].name,
  displayName: mockData.fields[0].name,
  id: mockData.fields[0].name,
  type: 'range',
  fieldType: 'real',
  value: [12.25, 12.28]
};

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
      fieldIdx: 1
    },
    {
      name: 'end_point_lat',
      id: 'end_point_lat',
      displayName: 'end_point_lat',
      type: 'real',
      fieldIdx: 2
    },
    {
      name: 'end_point_lng',
      id: 'end_point_lng',
      displayName: 'end_point_lng',
      type: 'real',
      fieldIdx: 3
    }
  ],
  rows: [
    [12.25, 37.75, 45.21, 100.12],
    [null, 35.2, 45.0, 21.3],
    [12.29, 37.64, 46.21, 99.127],
    [null, null, 33.1, 29.34]
  ]
};

test('#visStateReducer', t => {
  t.deepEqual(
    reducer(undefined, {}),
    {...INITIAL_VIS_STATE, initialState: {}},
    'should return the initial state'
  );

  t.end();
});

test('#visStateReducer -> ADD_FILTER', t => {
  const dataId = 'kitten';
  const newFilter = getDefaultFilter({dataId});
  const newReducer = reducer({filters: [mockFilter]}, VisStateActions.addFilter(dataId));

  const expectedReducer = {filters: [mockFilter, newFilter]};

  t.equal(newReducer.filters.length, expectedReducer.filters.length, 'should add a default filter');

  t.deepEqual(newReducer.filters[0], expectedReducer.filters[0], 'should add a default filter');

  cmpFilters(t, newReducer.filters[1], expectedReducer.filters[1]);
  t.end();
});

function autoLayers(dataset, layerClasses = LayerClasses) {
  return addDefaultLayers({...INITIAL_VIS_STATE, layerClasses}, {[dataset.id]: dataset}).newLayers;
}

test('#visStateReducer -> addDefaultLayers: icons replace only fully covered points', t => {
  const fields = ['lat', 'lon', 'icon', 'altitude'].map((name, fieldIdx) => ({
    name,
    fieldIdx,
    type: name === 'icon' ? 'string' : 'real'
  }));
  const fieldPairs = findPointFieldPairs(fields);
  const validRow = [37.77, -122.42, 'place', 0];
  const cases = [
    {name: 'valid icon', rows: [validRow], expected: ['icon']},
    {name: 'custom icon name', rows: [[37.77, -122.42, 'custom-icon', 0]], expected: ['icon']},
    {name: 'empty dataset', rows: [], expected: ['point', 'icon']},
    {name: 'missing data', rows: [validRow], noData: true, expected: ['point', 'icon']},
    {name: 'missing icon value', rows: [[37.77, -122.42, null, 0]], expected: ['point', 'icon']},
    ...[null, undefined, '', '  ', 123, false, {}].map(icon => ({
      name: `incomplete icon coverage: ${String(icon)}`,
      rows: [validRow, [37.78, -122.43, icon, 0]],
      expected: ['point', 'icon']
    })),
    {
      name: 'filtered-out row still needs its point when filters are cleared',
      rows: [validRow, [37.78, -122.43, null, 0]],
      filteredIndex: [0],
      expected: ['point', 'icon']
    },
    {
      name: 'missing coordinates do not need icon coverage',
      rows: [validRow, [null, -122.43, null, 0]],
      expected: ['icon']
    },
    {
      name: 'invalid altitude does not need icon coverage',
      rows: [validRow, [37.78, -122.43, null, NaN]],
      expected: ['icon']
    },
    {
      name: 'no renderable coordinates',
      rows: [[NaN, -122.43, 'place', 0]],
      expected: ['point', 'icon']
    }
  ];

  cases.forEach(({name, rows, noData, filteredIndex, expected}) => {
    const dataset = noData
      ? {id: 'icon-precedence', fields, fieldPairs}
      : new KeplerTable({info: {id: 'icon-precedence'}}).updateSchema({fields, rows});
    if (filteredIndex) {
      dataset.filteredIndex = filteredIndex;
    }
    const layers = autoLayers(dataset);
    t.deepEqual(
      layers.map(layer => layer.type),
      expected,
      name
    );
    if (expected.length === 1) {
      t.ok(layers[0].config.isVisible, `${name}: replacement icon is visible`);
    }
  });
  t.end();
});

test('#visStateReducer -> addDefaultLayers: icon precedence preserves other point pairs and icon columns', t => {
  const fields = ['one_lat', 'one_lon', 'two_lat', 'two_lon', 'icon', 'other_icon'].map(
    (name, fieldIdx) => ({name, fieldIdx, type: name.includes('icon') ? 'string' : 'real'})
  );
  const rows = [[37.77, -122.42, 38, -123, 'place', 'custom-icon']];
  const dataset = new KeplerTable({info: {id: 'multiple-icon-columns'}}).updateSchema({
    fields,
    rows
  });
  const layers = autoLayers(dataset);
  t.deepEqual(
    layers.map(layer => [layer.type, layer.config.isVisible]),
    [
      ['point', true],
      ['arc', false],
      ['line', false],
      ['icon', true],
      ['icon', true]
    ],
    'preserves the remaining candidate order and Arc/Line visibility'
  );
  const points = layers.filter(layer => layer.type === 'point');
  const icons = layers.filter(layer => layer.type === 'icon');
  t.equal(points.length, 1, 'only the covered coordinate pair loses its automatic point');
  t.equal(points[0].config.columns.lat.value, 'two_lat', 'keeps the other coordinate pair');
  t.equal(icons.length, 2, 'preserves both automatically detected icon columns');
  t.ok(
    icons.every(layer => layer.config.isVisible),
    'both icons remain visible'
  );

  const incompleteRows = [
    [37.77, -122.42, 38, -123, 'place', null],
    [37.78, -122.43, 39, -124, null, 'custom-icon']
  ];
  dataset.updateSchema({fields, rows: incompleteRows});
  const incompleteLayers = autoLayers(dataset);
  t.equal(
    incompleteLayers.filter(layer => layer.type === 'point').length,
    2,
    'retains points when neither icon column covers all coordinate rows'
  );
  dataset.updateSchema({
    fields,
    rows: [
      [37.77, -122.42, 38, -123, null, 'place'],
      [37.78, -122.43, 39, -124, null, 'custom-icon']
    ]
  });
  const coveredLayers = autoLayers(dataset);
  t.equal(
    coveredLayers.filter(layer => layer.type === 'point').length,
    1,
    'a later icon column can provide complete coverage'
  );
  t.equal(
    coveredLayers.filter(layer => layer.type === 'icon').length,
    2,
    'keeps both icon columns'
  );
  t.end();
});

test('#visStateReducer -> addDefaultLayers: icon precedence preserves explicitly configured layers', t => {
  const {fields, rows} = processCsvData('lat,lon,icon\n37.77,-122.42,place');
  const dataset = new KeplerTable({info: {id: 'explicit-icons'}}).updateSchema({fields, rows});
  const explicitLayers = ['point', 'icon'].map(type =>
    validateLayerWithData(
      dataset,
      {
        id: `saved-${type}`,
        type,
        config: {
          dataId: dataset.id,
          label: type,
          isVisible: true,
          columns: {lat: 'lat', lng: 'lon', ...(type === 'icon' ? {icon: 'icon'} : {})}
        }
      },
      LayerClasses
    )
  );
  t.deepEqual(
    explicitLayers.map(layer => layer?.type),
    ['point', 'icon'],
    'restores both saved layers'
  );
  const {state, newLayers} = addDefaultLayers(
    {
      layers: explicitLayers,
      layerOrder: explicitLayers.map(layer => layer.id),
      layerClasses: LayerClasses
    },
    {[dataset.id]: dataset}
  );
  t.equal(state.layers[0], explicitLayers[0], 'keeps the existing point layer');
  t.equal(state.layers[1], explicitLayers[1], 'keeps the existing icon layer');
  t.deepEqual(
    newLayers.map(layer => layer.type),
    ['icon'],
    'applies precedence only to new automatic layers'
  );
  t.end();
});

test('#visStateReducer -> addDefaultLayers: icon precedence is independent of registry order', t => {
  const dataset = new KeplerTable({info: {id: 'icon-order'}}).updateSchema(
    processCsvData('lat,lon,icon\n37.77,-122.42,place')
  );
  const {point, icon, ...others} = LayerClasses;
  for (const layerClasses of [LayerClasses, {icon, point, ...others}]) {
    t.deepEqual(
      autoLayers(dataset, layerClasses).map(layer => layer.type),
      ['icon'],
      'automatically adds only Icon regardless of detector order'
    );
  }
  t.end();
});

test('#visStateReducer -> addDefaultLayers: preserves custom types and canonical replacements', t => {
  const dataset = new KeplerTable({info: {id: 'custom-icons'}}).updateSchema(
    processCsvData('lat,lon,icon\n37.77,-122.42,place')
  );
  class CustomPoint extends PointLayer {}
  class CustomIcon extends IconLayer {}
  const cases = [
    {classes: {...LayerClasses, point: CustomPoint}, expected: [CustomPoint, IconLayer]},
    {classes: {...LayerClasses, icon: CustomIcon}, expected: [PointLayer, CustomIcon]},
    {classes: {...LayerClasses, customPoint: CustomPoint}, expected: [IconLayer, CustomPoint]},
    {classes: {point: PointLayer}, expected: [PointLayer]},
    {classes: {icon: IconLayer}, expected: [IconLayer]}
  ];
  cases.forEach(({classes, expected}) => {
    t.deepEqual(
      autoLayers(dataset, classes).map(layer => layer.constructor),
      expected,
      'limits precedence to the registered built-in Point and Icon classes'
    );
  });
  t.end();
});

test('#visStateReducer -> addDefaultLayers: matches altitude as well as latitude and longitude', t => {
  const dataset = new KeplerTable({info: {id: 'icon-altitude'}}).updateSchema(
    processCsvData('lat,lon,altitude,other_altitude,icon\n37.77,-122.42,10,20,place')
  );
  const pair = dataset.fieldPairs[0];
  const otherAltitude = {value: 'other_altitude', fieldIdx: 3};
  dataset.fieldPairs = [pair, {...pair, pair: {...pair.pair, altitude: otherAltitude}}];
  const points = autoLayers(dataset).filter(layer => layer.type === 'point');
  t.equal(points.length, 1, 'keeps the point at a different altitude');
  t.equal(
    points[0].config.columns.altitude.value,
    'other_altitude',
    'matches all three coordinates'
  );
  t.end();
});

test('#visStateReducer -> addDefaultLayers: keeps other layer defaults and dataset boundaries', t => {
  const withIcons = new KeplerTable({info: {id: 'with-icons'}}).updateSchema(
    processCsvData('lat,lon,icon\n37.77,-122.42,place')
  );
  const withoutIcons = new KeplerTable({info: {id: 'without-icons'}}).updateSchema(
    processCsvData('lat,lon\n37.77,-122.42')
  );
  const {newLayers} = addDefaultLayers(INITIAL_VIS_STATE, {
    [withIcons.id]: withIcons,
    [withoutIcons.id]: withoutIcons
  });
  t.deepEqual(
    newLayers.map(layer => [layer.type, layer.config.dataId]),
    [
      ['icon', withIcons.id],
      ['point', withoutIcons.id]
    ],
    'an icon in one dataset does not suppress points in another'
  );
  const geoTrip = new KeplerTable({info: tripDataInfo}).updateSchema(processGeojson(tripGeojson));
  t.deepEqual(
    autoLayers(geoTrip).map(layer => layer.type),
    ['trip'],
    'keeps existing Trip over GeoJSON precedence'
  );
  const tableTrip = new KeplerTable({info: tripCsvDataInfo}).updateSchema(
    processCsvData(tripCsvData.replace(',name,', ',id,'))
  );
  t.deepEqual(
    autoLayers(tableTrip).map(layer => layer.type),
    ['point', 'trip'],
    'keeps table Trip and Point defaults together'
  );
  t.end();
});

test('#visStateReducer -> ADD_LAYER.1', t => {
  const oldState = {
    ...INITIAL_VIS_STATE,
    datasets: {
      puppy: {
        data: mockData.data,
        fields: mockData.fields
      }
    },
    layers: [{id: 'existing_layer'}],
    layerData: [[{data: [1, 2, 3]}, {data: [4, 5, 6]}]],
    layerOrder: ['existing_layer'],
    splitMaps: [
      {
        layers: {existing_layer: false}
      },
      {
        layers: {existing_layer: false}
      }
    ]
  };

  const newReducer = reducer(oldState, VisStateActions.addLayer());
  const newId = newReducer.layers[1].id;
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
        [newId]: true
      }
    }
  ];

  t.equal(newReducer.layers.length, 2, 'should have 2 layers');
  t.equal(newReducer.layers[1].config.isVisible, true, 'newLayer visibility should be set to true');
  t.equal(
    newReducer.layers[1].config.isConfigActive,
    true,
    'newLayer isConfigActive should be set to true'
  );
  t.equal(newReducer.layers[1].config.dataId, 'puppy', 'newLayer dataId should be set to default');
  t.deepEqual(
    newReducer.layerData,
    [oldState.layerData[0], {}],
    'newState should have empty layer datat'
  );
  t.deepEqual(
    newReducer.layerOrder,
    [newReducer.layers[1].id, newReducer.layers[0].id],
    'should add to layerOrder'
  );
  t.deepEqual(newReducer.splitMaps, expectedSplitMaps, 'should add to SplitMaps');

  t.end();
});

test('#visStateReducer -> LAYER_TYPE_CHANGE.0', t => {
  const layer = new Layer({id: 'blue'});

  const oldState = {
    ...INITIAL_VIS_STATE
  };

  const nextState = reducer(oldState, VisStateActions.layerTypeChange());

  t.equal(oldState, nextState, 'should return state when no argument is given');

  const nextState2 = reducer(oldState, VisStateActions.layerTypeChange(layer, 'no_type'));
  t.equal(oldState, nextState2, 'should return state when pass a none existing type');

  t.end();
});

test('#visStateReducer -> LAYER_TYPE_CHANGE.1', async t => {
  const layer = new Layer({id: 'more_layer'});
  const oldState = {
    ...INITIAL_VIS_STATE,
    datasets: await createNewDataEntryMock({
      info: {id: 'puppy', label: 'puppy'},
      data: {
        rows: mockData.data,
        fields: mockData.fields
      }
    }),
    layers: [{id: 'existing_layer'}, layer],
    layerData: [[{data: [1, 2, 3]}, {data: [4, 5, 6]}]],
    layerOrder: ['more_layer', 'existing_layer'],
    hoverInfo: {
      layer: {props: {id: 'more_layer'}},
      picked: true
    },
    clicked: {
      layer: {props: {id: 'more_layer'}},
      picked: true
    },
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

  const nextState = reducer(oldState, VisStateActions.layerTypeChange(layer, 'point'));
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

  t.ok(!nextState.clicked, 'should reset clicked');
  t.ok(!nextState.hoverInfo, 'should reset hoverInfo');

  t.end();
});

test('#visStateReducer -> LAYER_TYPE_CHANGE fit bounds on manual layer', async t => {
  const datasets = await createNewDataEntryMock({
    info: {id: 'puppy', label: 'puppy'},
    data: {
      rows: mockData.data,
      fields: mockData.fields
    }
  });

  const makeEmptyLayerState = () => {
    const layer = new Layer({id: 'manual-layer', dataId: 'puppy', isVisible: true});
    return {
      state: {
        ...INITIAL_VIS_STATE,
        datasets,
        layers: [layer],
        layerData: [{}],
        layerOrder: [layer.id]
      },
      layer
    };
  };

  drainTasksForTesting();
  const previousFitBounds = getApplicationConfig().enableFitBoundsOnManualLayer;

  try {
    initApplicationConfig({enableFitBoundsOnManualLayer: false});
    const disabled = makeEmptyLayerState();
    reducer(
      disabled.state,
      VisStateActions.layerTypeChange(disabled.layer, 'point', {fitBounds: true})
    );
    t.equal(
      drainTasksForTesting().length,
      0,
      'should not fit bounds when enableFitBoundsOnManualLayer is off'
    );

    initApplicationConfig({enableFitBoundsOnManualLayer: true});
    const programmatic = makeEmptyLayerState();
    reducer(programmatic.state, VisStateActions.layerTypeChange(programmatic.layer, 'point'));
    t.equal(
      drainTasksForTesting().length,
      0,
      'should not fit bounds for a programmatic layerTypeChange'
    );

    const enabled = makeEmptyLayerState();
    const nextState = reducer(
      enabled.state,
      VisStateActions.layerTypeChange(enabled.layer, 'point', {fitBounds: true})
    );
    const [fitTask, ...extra] = drainTasksForTesting();
    t.equal(extra.length, 0, 'should schedule one fit-bounds task');
    t.equal(fitTask.label, 'ACTION_TASK_FIT_BOUNDS', 'should schedule ACTION_TASK_FIT_BOUNDS');

    const fitAction = succeedTaskInTest(fitTask, null);
    t.equal(fitAction.type, '@@kepler.gl/FIT_BOUNDS', 'task should dispatch FIT_BOUNDS');
    t.deepEqual(
      fitAction.payload,
      nextState.layers[0].meta.bounds,
      'should fit to the new layer bounds'
    );
    t.ok(nextState.layers[0].meta.bounds, 'new layer should have bounds');

    const typedLayer = nextState.layers[0];
    reducer(nextState, VisStateActions.layerTypeChange(typedLayer, 'hexagon', {fitBounds: true}));
    t.equal(
      drainTasksForTesting().length,
      0,
      'should not fit bounds when changing the type of an existing layer'
    );
  } finally {
    initApplicationConfig({enableFitBoundsOnManualLayer: previousFitBounds});
    drainTasksForTesting();
  }

  t.end();
});

test('#visStateReducer -> LAYER_TYPE_CHANGE.2', async t => {
  const pointLayer = new PointLayer({id: 'a', dataId: 'smoothie'});
  const mockColorRange = {
    name: 'abc',
    isReversed: true,
    colors: ['a', 'b', 'c']
  };
  const datasets = await createNewDataEntryMock({
    info: {id: 'smoothie'},
    data: {
      rows: testAllData,
      fields: testFields
    }
  });
  const oldState = {
    ...INITIAL_VIS_STATE,
    datasets,
    layers: [pointLayer],
    layerData: []
  };

  // set point layer colorField to a string field
  let stringField = testFields.find(f => f.type === 'string');
  stringField = {
    ...stringField,
    valueAccessor: stringField.valueAccessor(datasets.smoothie.dataContainer)
  };

  let nextState = reducer(
    oldState,
    VisStateActions.layerVisualChannelConfigChange(pointLayer, {colorField: stringField}, 'color')
  );

  nextState = reducer(
    nextState,
    VisStateActions.layerVisConfigChange(nextState.layers[0], {
      colorRange: mockColorRange
    })
  );
  const newLayer = nextState.layers[0];
  t.equal(newLayer.config.colorField.name, stringField.name, 'should update colorField');
  t.equal(newLayer.config.colorScale, 'ordinal', 'should scale to ordinal');
  t.deepEqual(
    newLayer.config.colorDomain,
    ['driver_analytics', 'driver_analytics_0', 'driver_gps'],
    'should calculate color domain'
  );
  t.equal(newLayer.config.visConfig.colorRange, mockColorRange, 'should update color range');

  // set point layer sizeField to a int field
  let intField = testFields.find(f => f.type === 'integer');
  intField = {...intField, valueAccessor: intField.valueAccessor(datasets.smoothie.dataContainer)};
  let nextState2 = reducer(
    nextState,
    VisStateActions.layerVisualChannelConfigChange(newLayer, {sizeField: intField}, 'size')
  );
  nextState2 = reducer(
    nextState2,
    VisStateActions.layerVisConfigChange(nextState2.layers[0], {
      radiusRange: [5, 10]
    })
  );
  const newLayer2 = nextState2.layers[0];
  t.equal(newLayer2.config.sizeField.name, intField.name, 'should update sizeField');
  t.equal(newLayer2.config.sizeScale, 'sqrt', 'should scale to sqrt');
  t.deepEqual(newLayer2.config.sizeDomain, [1, 12124], 'should calculate size domain');
  t.deepEqual(newLayer2.config.visConfig.radiusRange, [5, 10], 'should update size range');

  // change point layer type to hexagon
  const nextState3 = reducer(nextState2, VisStateActions.layerTypeChange(newLayer2, 'hexagon'));

  const newLayer3 = nextState3.layers[0];
  t.equal(newLayer3.type, 'hexagon', 'should change type to hexagon');
  t.equal(newLayer3.config.colorField.name, stringField.name, 'should keep colorField');
  t.deepEqual(
    newLayer3.config.colorDomain,
    [0, 1],
    'should set colorDomain to default, it is calculated inside deck.gl layer'
  );
  t.equal(newLayer3.config.colorScale, 'ordinal', 'should set colorScale to ordinal');
  t.equal(newLayer3.config.sizeScale, 'sqrt', 'should set sizeScale to default');
  t.deepEqual(newLayer3.config.sizeDomain, [0, 1], 'should set sizeDomain to default');
  t.equal(newLayer3.config.sizeField.name, intField.name, 'should keep sizeField');
  t.notEqual(newLayer3.id, newLayer2.id, 'should change id');
  t.equal(newLayer3.config.visConfig.colorRange, mockColorRange, 'should not deep copy colorRange');
  t.equal(
    newLayer3.config.visConfig.sizeRange,
    LAYER_VIS_CONFIGS.elevationRange.defaultValue,
    'should set sizeRange back to default'
  );

  // change point layer type to icon
  const nextState4 = reducer(nextState2, VisStateActions.layerTypeChange(newLayer2, 'icon'));
  const newLayer4 = nextState4.layers[0];
  t.equal(newLayer4.type, 'icon', 'should change type to icon');
  t.notEqual(newLayer4.id, newLayer2.id, 'should change id');
  t.equal(newLayer4.config.colorField.name, stringField.name, 'should keep colorField');
  t.deepEqual(
    newLayer4.config.colorDomain,
    ['driver_analytics', 'driver_analytics_0', 'driver_gps'],
    'should calculate color domain'
  );
  t.equal(newLayer4.config.colorScale, 'ordinal', 'should keep color scale');
  t.equal(newLayer4.config.sizeField.name, intField.name, 'should keep sizeField');
  t.equal(newLayer4.config.sizeScale, 'sqrt', 'should scale to linear');
  t.deepEqual(newLayer4.config.sizeDomain, [1, 12124], 'should keep size domain');
  t.deepEqual(newLayer4.config.visConfig.radiusRange, [5, 10], 'should keep size range');
  t.equal(newLayer4.config.visConfig.colorRange, mockColorRange, 'should not deep copy colorRange');
  t.end();
});

test('#visStateReducer -> LAYER_TYPE_CHANGE.3 -> animationConfig', async t => {
  const layer = new GeojsonLayer({
    label: 'taro and blue',
    dataId: 'taro',
    columns: {geojson: {fieldIdx: 0, value: '_geojson'}},
    isVisible: true,
    color: [1, 1, 1],
    id: 'taro'
  });

  const dataset = await createNewDataEntryMock({
    info: {id: 'taro'},
    data: processGeojson(tripGeojson)
  });

  const oldState = {
    ...INITIAL_VIS_STATE,
    datasets: dataset,
    layers: [layer],
    layerData: [{}],
    layerOrder: [0]
  };

  // change GeoJson layer to Trip layer
  const nextState = reducer(oldState, VisStateActions.layerTypeChange(layer, 'trip'));

  const foundLayer = nextState.layers[0];
  const foundLayerId = foundLayer.id;
  t.ok(foundLayerId !== 'taro', 'should update layer id');
  t.equal(foundLayer.type, 'trip', 'should update type to trip');
  t.deepEqual(
    foundLayer.config.animation,
    {enabled: true, domain: timeStampDomain},
    'should set correct animation domain'
  );

  t.deepEqual(
    nextState.animationConfig,
    {
      ...DEFAULT_ANIMATION_CONFIG,
      domain: timeStampDomain,
      currentTime: timeStampDomain[0],
      duration: null,
      timeSteps: null,
      defaultTimeFormat: 'L LTS'
    },
    'should update visState.animationConfig'
  );

  // change Trip layer to Geojson layer
  const nextState2 = reducer(oldState, VisStateActions.layerTypeChange(foundLayer, 'geojson'));
  const foundLayer2 = nextState2.layers[0];
  t.ok(foundLayer2.id !== foundLayerId, 'should update layer id');
  t.equal(foundLayer2.type, 'geojson', 'should update type to trip');

  t.deepEqual(
    foundLayer2.config.animation,
    {enabled: false},
    'should set correct animation domain fro Geojson layer'
  );

  t.deepEqual(
    nextState2.animationConfig,
    DEFAULT_ANIMATION_CONFIG,
    'should set animationConfig to default'
  );

  t.end();
});

test('#visStateReducer -> LAYER_CONFIG_CHANGE -> isVisible -> animationConfig', t => {
  const initialState = StateWTripGeojson;
  const layer = initialState.visState.layers[0];

  // change Trip layer isVisible
  const nextState = reducer(
    StateWTripGeojson.visState,
    VisStateActions.layerConfigChange(layer, {isVisible: false})
  );

  t.deepEqual(
    nextState.animationConfig,
    {
      ...DEFAULT_ANIMATION_CONFIG,
      domain: null,
      currentTime: 1565577261000,
      speed: 1,
      isAnimating: false,
      duration: null,
      timeSteps: null,
      defaultTimeFormat: null,
      timeFormat: null,
      timezone: null
    },
    'should set animationConfig to default'
  );

  const nextState2 = reducer(
    nextState,
    VisStateActions.layerConfigChange(nextState.layers[0], {isVisible: true})
  );

  t.deepEqual(
    nextState2.animationConfig,
    {
      ...nextState2.animationConfig,
      domain: timeStampDomain,
      currentTime: timeStampDomain[0],
      duration: null,
      timeSteps: null,
      defaultTimeFormat: 'L LTS'
    },
    'should set animationConfig domain and currentTime'
  );

  t.end();
});

test('#visStateReducer -> LAYER_CONFIG_CHANGE -> isVisible -> splitMaps', t => {
  const initialState = StateWSplitMaps.visState;
  const layer = initialState.layers[0];

  const initialSplitMaps = [
    {layers: {'point-0': false, 'geojson-1': true}},
    {layers: {'point-0': true, 'geojson-1': true}}
  ];
  const expectedSplitMaps = [{layers: {'geojson-1': true}}, {layers: {'geojson-1': true}}];
  t.deepEqual(initialState.splitMaps, initialSplitMaps, 'should has the same initial splitMaps');

  const nextState = reducer(
    initialState,
    VisStateActions.layerConfigChange(layer, {isVisible: false})
  );

  t.equal(nextState.layers[0].config.isVisible, false, 'should set layer 0 visibility to false');
  t.equal(initialState.layerData[0], nextState.layerData[0], 'should not update layerData');
  t.deepEqual(nextState.splitMaps, expectedSplitMaps, 'should remove layer from splitMaps');

  const nextState2 = reducer(
    nextState,
    VisStateActions.layerConfigChange(layer, {isVisible: true})
  );

  const initialSplitMaps2 = [
    {layers: {'point-0': true, 'geojson-1': true}},
    {layers: {'point-0': true, 'geojson-1': true}}
  ];
  t.deepEqual(nextState2.splitMaps, initialSplitMaps2, 'should add layer to splitMaps');

  t.end();
});

test('#visStateReducer -> LAYER_CONFIG_CHANGE -> columnMode', t => {
  const initialState = InitialState.visState;
  // const initialState = cloneDeep(state || InitialState);
  const updatedState = applyActions(reducer, initialState, [
    {
      action: VisStateActions.updateVisData,
      payload: [{info: tripCsvDataInfo, data: processCsvData(tripCsvData)}]
    }
  ]);

  const pointLayer = updatedState.layers[0];
  // change layer type to trip
  const updatedState2 = reducer(updatedState, VisStateActions.layerTypeChange(pointLayer, 'trip'));
  // trip Layer
  const tripLayer = updatedState2.layers[0];

  // update trip layer column mode
  const nextState = reducer(
    updatedState2,
    VisStateActions.layerConfigChange(tripLayer, {
      columnMode: COLUMN_MODE_TABLE
    })
  );

  const expectedLayerConfigColumns = {
    geojson: {value: null, fieldIdx: -1},
    id: {value: null, fieldIdx: -1},
    lat: {value: 'location-lat', fieldIdx: 2},
    lng: {value: 'location-lng', fieldIdx: 1},
    timestamp: {value: null, fieldIdx: -1},
    altitude: {value: 'location-alt', fieldIdx: 6, optional: true}
  };
  t.deepEqual(
    nextState.layers[0].config.columns,
    expectedLayerConfigColumns,
    'should update layer columns'
  );
  t.equal(
    nextState.layers[0].config.columnMode,
    COLUMN_MODE_TABLE,
    'should update layer columnMode'
  );

  t.deepEqual(nextState.layerData[0], {}, 'should not format layer data without all columns');
  // update trip layer column mode and columns id, timestap
  const nextState1 = reducer(
    nextState,
    VisStateActions.layerConfigChange(nextState.layers[0], {
      columns: {
        ...expectedLayerConfigColumns,
        timestamp: {value: 'timestamp', fieldIdx: 0},
        id: {value: 'name', fieldIdx: 5}
      }
    })
  );
  t.ok(nextState1.layerData[0].data, 'should format layer data with columns');
  t.equal(nextState1.layerData[0].data.length, 2, 'Should format 2 geojson features');

  t.deepEqual(
    nextState1.layerData[0].data[0].geometry.coordinates.slice(0, 2),
    expectedCoordinates,
    'feature[0] coordinates should be correct'
  );
  t.deepEqual(
    nextState1.layerData[0].data[0].properties.index,
    0,
    'feature[0] properties index should be correct'
  );
  t.deepEqual(
    nextState1.layerData[0].data[0].properties.values.length,
    8,
    'feature[0] properties values should have correct length'
  );
  const stateToSave = SchemaManager.save({visState: nextState1});
  const savedTripLayer = stateToSave.config.config.visState.layers[0];
  t.equal(savedTripLayer.config.columnMode, COLUMN_MODE_TABLE, 'should save columnMode');
  t.deepEqual(
    savedTripLayer.config.columns,
    expectedTripLayerConfig.config.columns,
    'should save trip layer config columns'
  );

  // console.log(JSON.stringify(stateToSave.config.config.visState.layers[0], null, 2));
  t.end();
});

test('visStateReducer -> layerDataIdChangeUpdater', t => {
  const initialState = CloneDeep(StateWFilesFiltersLayerColor).visState;
  const pointLayer = initialState.layers[0];

  const nextState = reducer(
    initialState,
    VisStateActions.layerConfigChange(pointLayer, {
      dataId: testGeoJsonDataId
    })
  );
  const updatedLayer = nextState.layers[0];

  t.equal(updatedLayer.config.dataId, testGeoJsonDataId, 'should update point layer dataId');
  const expectedLayerColumns = new PointLayer({}).config.columns;
  t.deepEqual(updatedLayer.config.columns, expectedLayerColumns, 'should reset point layer column');
  t.equal(updatedLayer.config.colorField, null, 'should not assign point layer colorField');

  // add layer
  const nextState1 = reducer(nextState, VisStateActions.addLayer());
  const newLayer = nextState1.layers[nextState1.layers.length - 1];

  const nextState2 = reducer(
    nextState1,
    VisStateActions.layerConfigChange(newLayer, {
      dataId: testGeoJsonDataId,
      color: [1, 2, 3]
    })
  );

  t.equal(
    nextState2.layers[nextState1.layers.length - 1].config.dataId,
    testGeoJsonDataId,
    'should update new layer dataId'
  );
  t.deepEqual(
    nextState2.layers[nextState1.layers.length - 1].config.color,
    [1, 2, 3],
    'should update new layer color'
  );

  t.end();
});

test('visStateReducer -> layerDataIdChangeUpdater -> geojson', t => {
  const initialState = CloneDeep(StateWFilesFiltersLayerColor).visState;
  const nextState = applyActions(reducer, initialState, [
    // add another geojson
    {
      action: VisStateActions.updateVisData,
      payload: [
        [
          {
            info: {id: 'geojson2', label: 'Some Geojson'},
            data: {fields: geojsonFields, rows: geojsonRows.slice(0, 3)}
          }
        ]
      ]
    }
  ]);

  // find geojson layer
  const index = nextState.layers.findIndex(l => l.type === 'geojson');
  const geojsonLayer = nextState.layers[index];
  const id = geojsonLayer.id;
  // change dataId
  const nextState1 = reducer(
    nextState,
    VisStateActions.layerConfigChange(geojsonLayer, {
      dataId: 'geojson2'
    })
  );

  const neextGeojsonLayer = nextState1.layers.find(l => l.id === id);

  t.equal(neextGeojsonLayer.config.dataId, 'geojson2', 'should update layer dataId');
  t.equal(neextGeojsonLayer.dataToFeature.length, 3, 'should calculate dataToFeature');
  t.equal(nextState1.layerData[index].data.length, 3, 'should calculate layerData');

  t.end();
});

test('visStateReducer -> layerDataIdChangeUpdater -> validation', t => {
  const initialState = CloneDeep(StateWFilesFiltersLayerColor).visState;
  const pointLayer = initialState.layers[0];
  const textField = pointLayer.config.textLabel[0].field;

  const newDataInfo = {
    id: 'new-data-csv',
    label: 'new Data'
  };
  const fieldIdx = testFields.findIndex(f => f.name === textField.name);

  // remove 1 field from sample data
  const fields = testFields.filter(f => f.name !== textField.name);
  const rows = testAllData.map(row => [
    ...row.slice(0, fieldIdx),
    ...row.slice(fieldIdx + 1, row.length)
  ]);
  // add another dataset
  const nextState = applyActions(reducer, initialState, [
    {
      action: VisStateActions.updateVisData,
      payload: [[{info: newDataInfo, data: {fields, rows}}]]
    }
  ]);

  const nextState1 = reducer(
    nextState,
    VisStateActions.layerConfigChange(pointLayer, {
      dataId: 'new-data-csv'
    })
  );

  const updatedLayer = nextState1.layers[0];
  t.equal(updatedLayer.config.dataId, 'new-data-csv', 'should update point layer dataId');
  t.equal(
    updatedLayer.config.colorField.name,
    'gps_data.types',
    'should update point layer colorField'
  );

  t.deepEqual(
    updatedLayer.config.columns,
    {
      altitude: {value: null, fieldIdx: -1, optional: true},
      lat: {value: 'gps_data.lat', fieldIdx: 1},
      lng: {value: 'gps_data.lng', fieldIdx: 2},
      neighbors: {value: null, fieldIdx: -1, optional: true},
      geojson: {value: null, fieldIdx: -1},
      geoarrow: {value: null, fieldIdx: -1}
    },
    'should update point layer column'
  );

  t.equal(
    updatedLayer.config.textLabel[0].field,
    undefined,
    'should assign fields not exists to undefined'
  );
  t.end();
});

test('visStateReducer -> layerDataIdChangeUpdater -> not valid to save layer remaps fields', t => {
  const initialState = CloneDeep(StateWFilesFiltersLayerColor).visState;
  const pointLayer = initialState.layers[0];

  // Verify precondition: layer has colorField set
  t.ok(pointLayer.config.colorField, 'point layer should have colorField set');
  t.equal(
    pointLayer.config.colorField.name,
    'gps_data.types',
    'colorField should be gps_data.types'
  );

  // Add a new dataset with fewer rows but containing the same colorField name
  const newFields = [
    {name: 'lat', type: 'real', format: '', analyzerType: 'FLOAT'},
    {name: 'lng', type: 'real', format: '', analyzerType: 'FLOAT'},
    {name: 'gps_data.types', type: 'string', format: '', analyzerType: 'STRING'}
  ];
  const newRows = [
    ['30.0', '-80.0', 'type_a'],
    ['31.0', '-81.0', 'type_b']
  ];

  const stateWithNewData = applyActions(reducer, initialState, [
    {
      action: VisStateActions.updateVisData,
      payload: [
        [
          {
            info: {id: 'small-dataset', label: 'Small Data'},
            data: {fields: newFields, rows: newRows}
          }
        ]
      ]
    }
  ]);

  t.ok(stateWithNewData.datasets['small-dataset'], 'should have small-dataset in state');

  // Now make the layer not valid to save by clearing a required column
  const layer0 = stateWithNewData.layers[0];
  const invalidLayer = layer0.updateLayerConfig({
    columns: {
      ...layer0.config.columns,
      lat: {value: null, fieldIdx: -1}
    }
  });

  t.notOk(invalidLayer.isValidToSave(), 'layer should not be valid to save');

  // Replace the layer in state
  const stateWithInvalidLayer = {
    ...stateWithNewData,
    layers: [invalidLayer, ...stateWithNewData.layers.slice(1)]
  };

  // Switch dataset on the invalid layer
  const nextState = reducer(
    stateWithInvalidLayer,
    VisStateActions.layerConfigChange(invalidLayer, {
      dataId: 'small-dataset'
    })
  );

  const updatedLayer = nextState.layers[0];
  t.equal(updatedLayer.config.dataId, 'small-dataset', 'should update layer dataId');
  // colorField should be remapped to the new dataset's field (same name exists)
  t.ok(updatedLayer.config.colorField, 'colorField should be remapped');
  t.equal(
    updatedLayer.config.colorField.name,
    'gps_data.types',
    'colorField should match by name in new dataset'
  );

  // Now test clearing: switch to a dataset without the colorField name
  const noMatchFields = [
    {name: 'latitude', type: 'real', format: '', analyzerType: 'FLOAT'},
    {name: 'longitude', type: 'real', format: '', analyzerType: 'FLOAT'}
  ];
  const noMatchRows = [['32.0', '-82.0']];

  const stateWithNoMatch = applyActions(reducer, nextState, [
    {
      action: VisStateActions.updateVisData,
      payload: [
        [
          {
            info: {id: 'no-match-dataset', label: 'No Match'},
            data: {fields: noMatchFields, rows: noMatchRows}
          }
        ]
      ]
    }
  ]);

  // The layer in the state after updateVisData
  const layer2 = stateWithNoMatch.layers[0];
  // layer is still not valid to save (columns are not set for the current dataset)
  t.notOk(layer2.isValidToSave(), 'layer should still not be valid to save');

  const finalState = reducer(
    stateWithNoMatch,
    VisStateActions.layerConfigChange(layer2, {
      dataId: 'no-match-dataset'
    })
  );

  const finalLayer = finalState.layers[0];
  t.equal(finalLayer.config.dataId, 'no-match-dataset', 'should update dataId to no-match-dataset');
  t.equal(
    finalLayer.config.colorField,
    null,
    'colorField should be null when no matching field in new dataset'
  );

  t.end();
});

test('#visStateReducer -> LAYER_VIS_CONFIG_CHANGE -> opacity', t => {
  const initialState = StateWFiles.visState;
  const layer = initialState.layers[0];

  const nextState = reducer(
    initialState,
    VisStateActions.layerVisConfigChange(layer, {opacity: 0.3})
  );

  t.equal(nextState.layers[0].config.visConfig.opacity, 0.3, 'should update layer opacity');
  t.end();
});

test('#visStateReducer -> LAYER_TEXT_LABEL_CHANGE', t => {
  const initialState = StateWFiles.visState;
  // point layer
  const layer = initialState.layers[0];

  t.deepEqual(layer.config.textLabel, [DEFAULT_TEXT_LABEL], 'should set initial textLabel');

  const nextState = reducer(
    initialState,
    VisStateActions.layerTextLabelChange(layer, 0, 'random', 1)
  );

  t.equal(
    nextState.layers[0].config.textLabel,
    layer.config.textLabel,
    'should not update textLabel if prop is not in textLabel'
  );

  const nextState2 = reducer(
    nextState,
    VisStateActions.layerTextLabelChange(nextState.layers[0], 0, 'anchor', 'start')
  );

  t.deepEqual(
    nextState2.layers[0].config.textLabel[0],
    {...DEFAULT_TEXT_LABEL, anchor: 'start'},
    'should start text label prop'
  );

  const valueAccessor = () => 1;
  const expectedField = {
    name: 'taro',
    valueAccessor
  };

  // set text label field
  const nextState3 = reducer(
    nextState2,
    VisStateActions.layerTextLabelChange(nextState2.layers[0], 0, 'field', expectedField)
  );

  const expectedTextLabel1 = {
    ...DEFAULT_TEXT_LABEL,
    anchor: 'start',
    field: expectedField
  };

  t.deepEqual(
    nextState3.layers[0].config.textLabel[0],
    expectedTextLabel1,
    'should set text field'
  );

  // add empty field
  const nextState4 = reducer(
    nextState3,
    VisStateActions.layerTextLabelChange(nextState3.layers[0], 1)
  );

  t.deepEqual(
    nextState4.layers[0].config.textLabel,
    [expectedTextLabel1, DEFAULT_TEXT_LABEL],
    'should add text label'
  );

  // add or remove labels
  const nextState5 = reducer(
    nextState4,
    VisStateActions.layerTextLabelChange(nextState4.layers[0], 'all', 'fields', [
      {name: 'blue', valueAccessor},
      {name: 'taro', valueAccessor}
    ])
  );

  const expected5 = [
    expectedTextLabel1,
    {...DEFAULT_TEXT_LABEL, field: {name: 'blue', valueAccessor}}
  ];
  t.deepEqual(nextState5.layers[0].config.textLabel, expected5, 'should add text label taro');

  // // add 1 more label
  const nextState6 = reducer(
    nextState5,
    VisStateActions.layerTextLabelChange(nextState5.layers[0], 2, 'field', {
      name: 'cat',
      valueAccessor
    })
  );
  const expected6 = [
    expectedTextLabel1,
    {...DEFAULT_TEXT_LABEL, field: {name: 'blue', valueAccessor}},
    {...DEFAULT_TEXT_LABEL, field: {name: 'cat', valueAccessor}}
  ];
  t.deepEqual(nextState6.layers[0].config.textLabel, expected6, 'should add text label cat');

  // remove label
  const nextState7 = reducer(
    nextState6,
    VisStateActions.layerTextLabelChange(nextState6.layers[0], 2, 'field', null)
  );
  const expected7 = [
    expectedTextLabel1,
    {...DEFAULT_TEXT_LABEL, field: {name: 'blue', valueAccessor}}
  ];
  t.deepEqual(nextState7.layers[0].config.textLabel, expected7, 'should remove text label cat');

  // remove label with all
  const nextState8 = reducer(
    nextState7,
    VisStateActions.layerTextLabelChange(nextState7.layers[0], 'all', 'fields', [
      {name: 'blue', valueAccessor}
    ])
  );
  const expected8 = [{...DEFAULT_TEXT_LABEL, field: {name: 'blue', valueAccessor}}];
  t.deepEqual(nextState8.layers[0].config.textLabel, expected8, 'should remove text label blue');

  // enable GPU collision filtering for all labels
  const nextState9 = reducer(
    nextState8,
    VisStateActions.layerTextLabelChange(nextState8.layers[0], 'all', 'collisionEnabled', true)
  );
  t.equal(
    nextState9.layers[0].config.textLabel[0].collisionEnabled,
    true,
    'should enable collision filtering on all text labels'
  );

  t.end();
});

test('#visStateReducer -> LAYER_TEXT_LABEL_CHANGE -> cluster point count is added once', t => {
  const initialState = StateWFiles.visState;
  const pointLayer = initialState.layers.find(l => l.type === 'point');
  const resetState = reducer(
    initialState,
    VisStateActions.layerConfigChange(pointLayer, {
      textLabel: [{...DEFAULT_TEXT_LABEL}]
    })
  );
  const resetPoint = resetState.layers.find(l => l.id === pointLayer.id);
  const clusterState = reducer(resetState, VisStateActions.layerTypeChange(resetPoint, 'cluster'));
  const clusterLayer = clusterState.layers.find(l => l.type === 'cluster');

  t.equal(clusterLayer.config.textLabel.length, 1, 'type change keeps one label slot');
  t.equal(clusterLayer.config.textLabel[0].field, null, 'copied point label has no field');

  const pointCountField = createPointCountLabelField();
  const selectedState = reducer(
    clusterState,
    VisStateActions.layerTextLabelChange(clusterLayer, 'all', 'fields', [pointCountField])
  );
  const selectedLayer = selectedState.layers.find(l => l.type === 'cluster');
  const selected = selectedLayer.config.textLabel;

  t.equal(selected.length, 1, 'picking Point Count adds one label');
  t.equal(selected[0].field.name, 'pointCount');
  t.equal(selected[0].field.fieldIdx, -1);
  t.equal(selected[0].anchor, 'middle');
  t.equal(selected[0].alignment, 'center');
  t.equal(selected[0].collisionEnabled, true);
  t.equal(selected[0].outlineWidth, 1);

  const again = reducer(
    selectedState,
    VisStateActions.layerTextLabelChange(selectedLayer, 'all', 'fields', [pointCountField])
  );
  t.equal(
    again.layers.find(l => l.type === 'cluster').config.textLabel.length,
    1,
    'picking Point Count again keeps one label'
  );

  const added = reducer(
    selectedState,
    VisStateActions.layerTextLabelChange(selectedLayer, selected.length)
  );
  const addedLabels = added.layers.find(l => l.type === 'cluster').config.textLabel;
  t.equal(addedLabels.length, 2, 'add more label appends a slot');
  t.equal(addedLabels[1].field, null, 'the extra slot does not clone Point Count');

  const pointState = reducer(
    selectedState,
    VisStateActions.layerTypeChange(selectedLayer, 'point')
  );
  const convertedPointLayer = pointState.layers.find(l => l.type === 'point');
  t.equal(convertedPointLayer.config.textLabel.length, 1, 'type change keeps one label slot');
  t.equal(
    convertedPointLayer.config.textLabel[0].field,
    null,
    'type change clears the synthetic Point Count field'
  );

  t.end();
});

test('#visStateReducer -> SET_COLUMN_DISPLAY_FORMAT updates text labels', t => {
  const initialState = CloneDeep(StateWFiles.visState);
  const otherDataId = 'other-data';
  const otherDataset = copyTableAndUpdate(initialState.datasets[testCsvDataId], {
    id: otherDataId
  });
  const layerIndex = initialState.layers.findIndex(layer => layer.config.dataId === testCsvDataId);
  const field = initialState.datasets[testCsvDataId].fields.find(
    ({name}) => name === 'gps_data.utc_timestamp'
  );
  const otherField = otherDataset.fields.find(({name}) => name === 'gps_data.utc_timestamp');
  const layer = CloneDeep(initialState.layers[layerIndex]).updateLayerConfig({
    textLabel: [{...DEFAULT_TEXT_LABEL, field}]
  });
  const otherLayer = CloneDeep(initialState.layers[layerIndex]).updateLayerConfig({
    dataId: otherDataId,
    textLabel: [{...DEFAULT_TEXT_LABEL, field: otherField}]
  });
  otherLayer.id = `${otherLayer.id}-other`;
  const stateWithOtherDataset = {
    ...initialState,
    datasets: {...initialState.datasets, [otherDataId]: otherDataset}
  };
  const {layerData: oldLayerData} = calculateLayerData(layer, stateWithOtherDataset);
  const {layerData: otherLayerData} = calculateLayerData(otherLayer, stateWithOtherDataset);
  const layers = stateWithOtherDataset.layers.slice();
  const layerData = stateWithOtherDataset.layerData.slice();
  layers[layerIndex] = layer;
  layerData[layerIndex] = oldLayerData;
  const otherLayerIndex = layers.push(otherLayer) - 1;
  layerData.push(otherLayerData);
  const stateWithTextLabel = {
    ...stateWithOtherDataset,
    layers,
    layerData
  };

  const nextState = reducer(
    stateWithTextLabel,
    VisStateActions.setColumnDisplayFormat(testCsvDataId, {
      'gps_data.utc_timestamp': 'YYYY'
    })
  );
  const updatedLayer = nextState.layers[layerIndex];

  t.equal(
    updatedLayer.config.textLabel[0].field.displayFormat,
    'YYYY',
    'should update the display format stored in the text label field'
  );
  t.equal(
    nextState.layerData[layerIndex].textLabels[0].getText({index: 0}),
    '2016',
    'should immediately rebuild cached text labels with the updated display format'
  );
  t.equal(
    nextState.layers[otherLayerIndex],
    otherLayer,
    'should not update a layer belonging to another dataset with the same field name'
  );
  t.equal(
    nextState.layers[otherLayerIndex].config.textLabel[0].field.displayFormat,
    undefined,
    'should leave the other dataset label format unchanged'
  );
  t.equal(
    nextState.layerData[otherLayerIndex],
    otherLayerData,
    'should not rebuild layer data belonging to another dataset'
  );
  t.end();
});

test('#visStateReducer -> REORDER_LAYER', t => {
  const newReducer = reducer(
    {layers: [], layerOrder: [0, 1, 2]},
    VisStateActions.reorderLayer([0, 2, 1])
  );

  t.deepEqual(newReducer, {layers: [], layerOrder: [0, 2, 1]}, 'should re order layers');

  t.end();
});

test('#visStateReducer -> UPDATE_LAYER_BLENDING', t => {
  const newReducer = reducer(
    {layerBlending: 'none'},
    VisStateActions.updateLayerBlending('additive')
  );

  t.deepEqual(newReducer, {layerBlending: 'additive'}, 'should update layerBlending');

  t.end();
});

test('#visStateReducer -> REMOVE_FILTER', t => {
  const initialState = CloneDeep(StateWFilters.visState);
  // filter[0]: 'time' testCsvData
  // filter[1]: 'RATE' testGeoJsonData

  const dataset0 = initialState.datasets[testCsvDataId];
  const dataset1 = initialState.datasets[testGeoJsonDataId];

  const expectedData0 = {
    ...dataset0,
    gpuFilter: {
      filterRange: [
        [1474606800000 - 1474588800000, 1474617600000 - 1474588800000],
        [0, 0],
        [0, 0],
        [0, 0]
      ],
      filterValueUpdateTriggers: {
        gpuFilter_0: {name: 'time', domain0: 1474588800000},
        gpuFilter_1: null,
        gpuFilter_2: null,
        gpuFilter_3: null
      },
      filterValueAccessor: {
        inputs: [
          {
            index: 0
          }
        ],
        result: [0, 0, 0, 0]
      }
    },
    filterRecord: {
      dynamicDomain: [],
      fixedDomain: [initialState.filters[0]],
      cpu: [],
      gpu: [initialState.filters[0]]
    }
  };

  const expectedData1 = {
    ...dataset1,
    filteredIndex: dataset1.allIndexes,
    filteredIndexForDomain: dataset1.allIndexes,
    changedFilters: {
      dynamicDomain: {'RATE-1': 'deleted'},
      fixedDomain: null,
      cpu: {'RATE-1': 'deleted'},
      gpu: null
    },
    filterRecord: {
      dynamicDomain: [],
      fixedDomain: [],
      cpu: [],
      gpu: []
    }
  };

  const expectedFilters = [mergedTimeFilter];

  // remove smoothie filter - gpu: true, fixedDomain: false
  const newReducer = reducer(initialState, VisStateActions.removeFilter(1));

  const expectedLayerData1 = {data: dataset1.dataContainer.mapIndex(d => d)};
  const expectedState = {
    ...initialState,
    filters: expectedFilters,
    datasets: {
      [testCsvDataId]: expectedData0,
      [testGeoJsonDataId]: expectedData1
    },
    layerData: [initialState.layerData[0], expectedLayerData1]
  };

  cmpObjectKeys(t, expectedState, newReducer, 'After removing filter, visState');

  Object.keys(newReducer).forEach(key => {
    switch (key) {
      case 'datasets':
        cmpDatasets(t, expectedState.datasets, newReducer.datasets);
        break;
      case 'filters':
        cmpFilters(t, expectedState.filters, newReducer.filters);
        break;
      case 'layers':
        cmpLayers(t, expectedState.layers, newReducer.layers);
        break;
      case 'layerData':
        // only compare length

        t.equal(
          expectedState.layerData.length,
          newReducer.layerData.length,
          'should have same number of layerData'
        );
        newReducer.layerData.forEach((ld, i) => {
          t.equal(
            expectedState.layerData[i].data.length,
            newReducer.layerData[i].data.length,
            'layerData.data should have same length'
          );
        });
        break;
      default:
        t.deepEqual(
          newReducer[key],
          expectedState[key],
          `visState.${key} should be correct after removing filter`
        );
        break;
    }
  });

  t.end();
});

test('#visStateReducer -> REMOVE_LAYER', t => {
  const layer1 = new PointLayer({id: 'a'});
  const layer2 = new PointLayer({id: 'b'});
  const oldState = {
    layers: [layer1, layer2],
    layerData: [{data: 1}, {data: 2}],
    layerOrder: ['b', 'a'],
    hoverInfo: {
      layer: {props: {id: 'b'}},
      picked: true
    },
    clicked: {
      layer: {props: {id: 'a'}},
      picked: true
    },
    splitMaps: [],
    animationConfig: DEFAULT_ANIMATION_CONFIG
  };

  const newReducer = reducer(oldState, VisStateActions.removeLayer('b'));

  t.deepEqual(
    newReducer,
    {
      layers: [layer1],
      layerData: [{data: 1}],
      layerOrder: ['a'],
      hoverInfo: undefined,
      clicked: {
        layer: {props: {id: 'a'}},
        picked: true
      },
      splitMaps: [],
      animationConfig: DEFAULT_ANIMATION_CONFIG
    },
    'should remove layer and layerData'
  );

  // test remove
  t.end();
});

test('#visStateReducer -> DUPLICATE_LAYER', t => {
  const oldState = CloneDeep(StateWFilesFiltersLayerColor.visState);
  // layers: ['point-0', 'geojson-1', 'hexagon-2'],
  const layerToCopy = serializeLayer(oldState.layers[0], oldState.schema);
  t.equal(oldState.layers.length, 3, 'should have 3 layers to begin');
  t.deepEqual(
    oldState.layerOrder,
    [oldState.layers[2].id, oldState.layers[0].id, oldState.layers[1].id],
    'should have 3 layers to begin'
  );

  const nextState = reducer(oldState, VisStateActions.duplicateLayer(0));
  t.equal(nextState.layers.length, 4, 'should add 1 layer');
  const layerCopied = serializeLayer(nextState.layers[3], nextState.schema);

  const expectedLayer = {
    ...layerToCopy,
    id: layerCopied.id,
    config: {
      ...layerToCopy.config,
      label: 'Copy of gps_data'
    }
  };

  t.deepEqual(layerCopied, expectedLayer, 'should copy layer config correctly');
  t.deepEqual(
    nextState.layerData[3].data,
    nextState.layerData[0].data,
    'should copy layer data correctly'
  );
  t.deepEqual(
    nextState.layerOrder,
    [
      nextState.layers[2].id,
      nextState.layers[3].id,
      nextState.layers[0].id,
      nextState.layers[1].id
    ],
    'should insert copied layer in front of older layer'
  );

  // copy again
  const nextState1 = reducer(nextState, VisStateActions.duplicateLayer(0));
  t.equal(nextState1.layers.length, 5, 'should add 1 layer');
  const layerCopied1 = serializeLayer(nextState1.layers[4], nextState1.schema);

  const expectedLayer1 = {
    ...layerToCopy,
    id: layerCopied1.id,
    config: {
      ...layerToCopy.config,
      label: 'Copy of gps_data 1'
    }
  };
  t.deepEqual(layerCopied1, expectedLayer1, 'should copy layer config correctly');
  t.deepEqual(
    nextState1.layerData[4].data,
    nextState1.layerData[0].data,
    'should copy layer data correctly'
  );
  t.deepEqual(
    nextState1.layerOrder,
    [
      nextState1.layers[2].id,
      nextState1.layers[3].id,
      nextState1.layers[4].id,
      nextState1.layers[0].id,
      nextState1.layers[1].id
    ],
    'should insert copied layer in front of older layer'
  );

  // copy again
  const nextState2 = reducer(nextState1, VisStateActions.duplicateLayer(0));
  t.equal(nextState2.layers.length, 6, 'should add 1 layer');
  const layerCopied2 = serializeLayer(nextState2.layers[5], nextState2.schema);

  const expectedLayer2 = {
    ...layerToCopy,
    id: layerCopied2.id,
    config: {
      ...layerToCopy.config,
      label: 'Copy of gps_data 2'
    }
  };
  t.deepEqual(layerCopied2, expectedLayer2, 'should copy layer config correctly');

  // test remove
  t.end();
});

test('#visStateReducer -> UPDATE_VIS_DATA.1 -> No data', t => {
  const oldState = CloneDeep(InitialState).visState;
  const nextState1 = reducer(oldState, VisStateActions.updateVisData([{info: null, data: null}]));
  t.deepEqual(nextState1, oldState, 'should return current state if no data');

  const nextState2 = reducer(
    oldState,
    VisStateActions.updateVisData([
      {
        data: {
          fields: null,
          rows: [1, 2]
        }
      }
    ])
  );
  t.deepEqual(nextState2, oldState, 'should return current state if no fields');

  Object.keys(oldState).forEach(prop => {
    t.deepEqual(nextState2[prop], oldState[prop], `${prop} should be the same`);
  });
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

test('#visStateReducer -> UPDATE_VIS_DATA.2 -> to empty state', t => {
  const oldState = INITIAL_VIS_STATE;

  const newState = applyActions(reducer, oldState, [
    {
      action: VisStateActions.updateVisData,
      payload: [
        [
          {
            data: mockRawData,
            info: {id: 'smoothie', label: 'exciting dataset'},
            metadata: {album: 'taro_and_blue'}
          }
        ]
      ]
    }
  ]);

  const expectedDatasets = {
    smoothie: {
      fields: expectedFields,
      filteredIndex: mockRawData.rows.map((_, i) => i),
      filteredIndexForDomain: mockRawData.rows.map((_, i) => i),
      allIndexes: mockRawData.rows.map((_, i) => i),
      dataContainer: createDataContainer(mockRawData.rows, {fields: mockRawData.fields}),
      gpuFilter: {
        filterRange: [
          [0, 0],
          [0, 0],
          [0, 0],
          [0, 0]
        ],
        filterValueUpdateTriggers: {
          gpuFilter_0: null,
          gpuFilter_1: null,
          gpuFilter_2: null,
          gpuFilter_3: null
        },
        filterValueAccessor: {
          inputs: ['a', 'b', 'c', 'd', 'e'],
          result: [0, 0, 0, 0]
        }
      },
      color: 'donnot test me',
      id: 'smoothie',
      label: 'exciting dataset',
      fieldPairs: expectedFieldParis,
      metadata: {id: 'smoothie', label: 'exciting dataset', album: 'taro_and_blue', format: ''},
      type: '',
      supportedFilterTypes: null,
      disableDataOperation: false
    }
  };

  t.deepEqual(Object.keys(newState.datasets), ['smoothie'], 'should save data to smoothie');

  cmpDatasets(t, expectedDatasets, newState.datasets);

  const expectedArcLayer = new ArcLayer({
    dataId: 'smoothie',
    label: 'start_point -> end_point arc',
    isVisible: false,
    columns: {
      lat0: {fieldIdx: 0, value: 'start_point_lat'},
      lng0: {fieldIdx: 1, value: 'start_point_lng'},
      lat1: {fieldIdx: 2, value: 'end_point_lat'},
      lng1: {fieldIdx: 3, value: 'end_point_lng'}
    }
  });

  const expectedLineLayer = new LineLayer({
    dataId: 'smoothie',
    label: 'start_point -> end_point line',
    isVisible: false,
    columns: {
      lat0: {fieldIdx: 0, value: 'start_point_lat'},
      lng0: {fieldIdx: 1, value: 'start_point_lng'},
      lat1: {fieldIdx: 2, value: 'end_point_lat'},
      lng1: {fieldIdx: 3, value: 'end_point_lng'},
      alt0: {
        value: null,
        fieldIdx: -1,
        optional: true
      },
      alt1: {
        value: null,
        fieldIdx: -1,
        optional: true
      }
    }
  });

  const expectedPointLayer1 = new PointLayer({
    dataId: 'smoothie',
    label: 'start_point',
    columns: {
      lat: {fieldIdx: 0, value: 'start_point_lat'},
      lng: {fieldIdx: 1, value: 'start_point_lng'},
      altitude: {fieldIdx: -1, value: null, optional: true}
    }
  });

  expectedPointLayer1.meta = {
    bounds: [35.2, 12.25, 37.75, 12.29]
  };

  const expectedPointLayer2 = new PointLayer({
    dataId: 'smoothie',
    label: 'end_point',
    columns: {
      lat: {fieldIdx: 2, value: 'end_point_lat'},
      lng: {fieldIdx: 3, value: 'end_point_lng'},
      altitude: {fieldIdx: -1, value: null, optional: true}
    }
  });

  expectedPointLayer2.meta = {
    bounds: [21.3, 33.1, 100.12, 46.21]
  };

  const expectedLayers = [
    expectedPointLayer1,
    expectedPointLayer2,
    expectedArcLayer,
    expectedLineLayer
  ];

  const newStateLayers = CloneDeep(newState.layers);

  cmpLayers(t, expectedLayers, newStateLayers);

  t.equal(newState.layerData.length, expectedLayers.length, 'should calculate layerdata');
  t.deepEqual(
    newState.layerOrder,
    [newStateLayers[0].id, newStateLayers[1].id, newStateLayers[2].id, newStateLayers[3].id],
    'should calculate layerOrder'
  );

  t.end();
});

test('#visStateReducer -> UPDATE_VIS_DATA.3 -> merge w/ existing state', t => {
  const oldState = {
    ...StateWFiles.visState,
    layerBlending: 'additive'
  };

  const expectedDatasets = {
    ...StateWFiles.visState.datasets,
    smoothie: {
      metadata: {
        id: 'smoothie',
        label: 'smoothie and milkshake',
        format: ''
      },
      type: '',
      supportedFilterTypes: null,
      disableDataOperation: false,
      fields: expectedFields,
      dataContainer: createDataContainer(mockRawData.rows, {fields: mockRawData.fields}),
      color: 'donnot test me',
      filteredIndex: mockRawData.rows.map((_, i) => i),
      filteredIndexForDomain: mockRawData.rows.map((_, i) => i),
      allIndexes: mockRawData.rows.map((_, i) => i),
      gpuFilter: {
        filterRange: [
          [0, 0],
          [0, 0],
          [0, 0],
          [0, 0]
        ],
        filterValueUpdateTriggers: {
          gpuFilter_0: null,
          gpuFilter_1: null,
          gpuFilter_2: null,
          gpuFilter_3: null
        },
        filterValueAccessor: {
          inputs: [{data: mockData.data[0], index: 0}],
          result: [0, 0, 0, 0]
        }
      },
      id: 'smoothie',
      label: 'smoothie and milkshake',
      fieldPairs: expectedFieldParis
    }
  };

  const expectedTooltip = {
    ...oldState.interactionConfig.tooltip.config.fieldsToShow,
    smoothie: []
  };

  const newState = applyActions(reducer, oldState, [
    {
      action: VisStateActions.updateVisData,
      payload: [
        [
          {
            data: mockRawData,
            info: {id: 'smoothie', label: 'smoothie and milkshake'}
          }
        ]
      ]
    }
  ]);

  Object.keys(expectedDatasets).forEach(key =>
    cmpDataset(t, expectedDatasets[key], newState.datasets[key])
  );
  t.equal(newState.layers.length, 6, 'should find 1 arc 1 line and 2 point layers');
  t.deepEqual(
    newState.layerOrder,
    [
      newState.layers[2].id,
      newState.layers[3].id,
      newState.layers[4].id,
      newState.layers[5].id,
      newState.layers[1].id,
      newState.layers[0].id
    ],
    'should add new layer index to layer order, put them on top'
  );
  t.equal(newState.layers[2].config.dataId, 'smoothie', 'should save dataId to layer');
  t.equal(newState.layers[3].config.dataId, 'smoothie', 'should save dataId to layer');
  t.equal(newState.layers[4].config.dataId, 'smoothie', 'should save dataId to layer');
  t.equal(newState.layers[5].config.dataId, 'smoothie', 'should save dataId to layer');
  t.equal(newState.layerData.length, 6, 'should calculate layerData');

  t.deepEqual(
    newState.interactionConfig.tooltip.config.fieldsToShow,
    expectedTooltip,
    'should set interaction config back to default'
  );
  t.equal(newState.layerBlending, 'additive', 'should keep layerBlending');

  t.end();
});

test('#visStateReducer -> UPDATE_VIS_DATA.4.Geojson -> geojson data', t => {
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
  const initialState = applyActions(reducer, initialVisState, [
    {
      action: VisStateActions.updateVisData,
      payload: [payload]
    }
  ]);

  const expectedDatasets = {
    metadata: {
      id: 'milkshake',
      label: 'king milkshake',
      format: ''
    },
    type: '',
    supportedFilterTypes: null,
    disableDataOperation: false,
    id: 'milkshake',
    label: 'king milkshake',
    color: 'donnot test me',
    dataContainer: createDataContainer(rows, {fields}),
    filteredIndex: rows.map((_, i) => i),
    filteredIndexForDomain: rows.map((_, i) => i),
    allIndexes: rows.map((_, i) => i),
    fields,
    fieldPairs: [],
    gpuFilter: {
      filterRange: [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
      ],
      filterValueUpdateTriggers: {
        gpuFilter_0: null,
        gpuFilter_1: null,
        gpuFilter_2: null,
        gpuFilter_3: null
      },
      filterValueAccessor: {
        inputs: [{data: mockData.data[0], index: 0}],
        result: [0, 0, 0, 0]
      }
    }
  };

  const expectedLayer = new GeojsonLayer({
    label: 'king milkshake',
    dataId: 'milkshake',
    columns: {geojson: {fieldIdx: 0, value: '_geojson'}},
    isVisible: true,
    color: layer1Color
  });

  expectedLayer.updateLayerVisConfig({
    stroked: true,
    filled: true,
    strokeColor: layer1StrokeColor
  });
  expectedLayer.dataToFeature = expectedDataToFeature;
  expectedLayer.meta = updatedGeoJsonLayer.meta;

  const expectedLayerData = {
    data: geojsonData.features.map((f, i) => ({
      ...f,
      properties: {...f.properties, TRIPS: f.properties.TRIPS || null, index: i}
    }))
  };

  t.deepEqual(Object.keys(initialState.datasets), ['milkshake'], 'should save geojson to datasets');
  cmpDataset(
    t,
    expectedDatasets,
    initialState.datasets.milkshake,
    'should save correct geojson to datasets'
  );

  t.equal(initialState.layers.length, 1, 'should find 1 geojson layer');
  cmpLayers(t, expectedLayer, initialState.layers[0], 'should save dataFeature to geojson layer');

  t.deepEqual(
    initialState.layerData[0].data,
    expectedLayerData.data,
    'should save geojson to layer data'
  );

  t.end();
});

test('#visStateReducer -> UPDATE_VIS_DATA.4.Geojson -> with config', t => {
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

  // receive data
  const initialState = applyActions(reducer, initialVisState, [
    {
      action: VisStateActions.updateVisData,
      payload: [payload]
    }
  ]);

  t.equal(initialState.layers.length, 1, 'should create 1 layer');

  // add data and config again

  // data
  const datasets = [
    {
      info: {
        id: 'milkshake2',
        label: 'king milkshake'
      },
      data: {fields, rows}
    }
  ];

  const config = {
    visState: {
      layers: [
        {
          id: 'test_layer_2',
          type: 'geojson',
          config: {
            dataId: 'milkshake2',
            columns: {
              geojson: '_geojson'
            }
          }
        }
      ]
    }
  };

  const testState = applyActions(reducer, initialState, [
    {
      action: VisStateActions.updateVisData,
      payload: [datasets, {}, config]
    }
  ]);

  t.deepEqual(
    Object.keys(testState.datasets),
    ['milkshake2'],
    'should reset state, and load dataset'
  );
  t.equal(testState.layers.length, 1, 'should create 1 layer');
  t.equal(testState.layers[0].id, 'test_layer_2', 'should merge 1 layer from config');

  t.end();
});

test('#visStateReducer -> UPDATE_VIS_DATA -> mergeFilters', t => {
  const oldState = CloneDeep(INITIAL_VIS_STATE);
  oldState.filterToBeMerged = [
    {
      dataId: 'smoothie',
      id: '38chejr',
      view: FILTER_VIEW_TYPES.enlarged,
      name: mockFilter.name,
      type: mockFilter.type,
      value: mockFilter.value
    },
    {
      dataId: 'nothing_here',
      id: 'vuey55d',
      view: FILTER_VIEW_TYPES.enlarged,
      name: 'test_test',
      type: 'select',
      value: true
    }
  ];

  const expectedFilterProps = {
    domain: [12.249990000000002, 12.290000000000001],
    step: 0.00001,
    fieldType: 'real',
    view: FILTER_VIEW_TYPES.side,
    type: mockFilter.type,
    gpu: true,
    typeOptions: ['range'],
    value: [12.249990000000002, 12.290000000000001]
  };

  const expectedFilter = {
    ...expectedFilterProps,
    animationWindow: 'free',
    dataId: ['smoothie'],
    fieldIdx: [0],
    id: '38chejr',
    fixedDomain: false,
    view: FILTER_VIEW_TYPES.enlarged,
    plotType: {type: 'histogram'},
    yAxis: null,
    gpu: true,
    gpuChannel: [0],
    name: [mockFilter.name],
    speed: 1,
    isAnimating: false,
    typeOptions: ['range'],
    value: mockFilter.value
  };

  const newState = applyActions(reducer, oldState, [
    {
      action: VisStateActions.updateVisData,
      payload: [
        [
          {
            data: mockRawData,
            info: {id: 'smoothie', label: 'smoothie and milkshake'}
          }
        ]
      ]
    }
  ]);

  const dc = createDataContainer(mockRawData.rows, {fields: mockRawData.fields});
  const allIndexes = dc.getPlainIndex();

  const expectedDatasets = {
    smoothie: {
      metadata: {
        id: 'smoothie',
        label: 'smoothie and milkshake',
        format: ''
      },
      type: '',
      supportedFilterTypes: null,
      disableDataOperation: false,
      fields: expectedFields.map(f =>
        f.name === mockFilter.name
          ? {
              ...f,
              filterProps: expectedFilterProps
            }
          : f
      ),
      // gpu filter in place, filteredIndex should not be updated
      filteredIndex: allIndexes,
      filteredIndexForDomain: [0],
      filterRecord: {
        dynamicDomain: [newState.filters.find(f => f.id === '38chejr')],
        fixedDomain: [],
        cpu: [],
        gpu: [newState.filters.find(f => f.id === '38chejr')]
      },
      gpuFilter: {
        filterRange: [
          [
            mockFilter.value[0] - expectedFilter.domain[0],
            mockFilter.value[1] - expectedFilter.domain[0]
          ],
          [0, 0],
          [0, 0],
          [0, 0]
        ],
        filterValueUpdateTriggers: {
          gpuFilter_0: {
            name: mockFilter.name,
            domain0: 12.249990000000002
          },
          gpuFilter_1: null,
          gpuFilter_2: null,
          gpuFilter_3: null
        },
        filterValueAccessor: {
          inputs: [{index: 0}],
          result: [12.25 - expectedFilter.domain[0], 0, 0, 0]
        }
      },
      allIndexes,
      dataContainer: dc,
      color: 'donot test me',
      id: 'smoothie',
      label: 'smoothie and milkshake',
      fieldPairs: expectedFieldParis,
      changedFilters: {
        dynamicDomain: {'38chejr': 'added'},
        fixedDomain: null,
        cpu: null,
        gpu: {'38chejr': 'added'}
      }
    }
  };

  const expectedState = {
    filterToBeMerged: [oldState.filterToBeMerged[1]],
    filters: [expectedFilter],
    datasets: expectedDatasets
  };

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
    id: 'c',
    isVisible: false
  });

  const layer3 = new PointLayer({
    dataId: 'milkshake',
    id: 'd',
    isVisible: false
  });

  const layers = [layer0, layer1, layer2, layer3];

  const oldState = {
    ...INITIAL_VIS_STATE,
    layers: [layer0, layer1, layer2, layer3],
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
    layerOrder: [layers[2].id, layers[1].id, layers[0].id, layers[3].id]
  };

  const newState = applyActions(reducer, oldState, [
    {
      action: VisStateActions.updateVisData,
      payload: [
        [
          {
            data: mockRawData,
            info: {id: 'smoothie', label: 'smoothie and milkshake'}
          }
        ]
      ]
    }
  ]);

  // first visible layer should be point
  const id1 = newState.layers[4].id;
  // 2nd visible layer
  const id2 = newState.layers[5].id;
  const expectedSplitMaps = [
    {
      layers: {
        a: true,
        b: false,
        [id1]: true,
        [id2]: true
      }
    },
    {
      layers: {
        a: false,
        b: true,
        [id1]: true,
        [id2]: true
      }
    }
  ];

  t.equal(newState.layers.length, 8, 'should create 1 arc 1 line and 2 point layers');
  t.deepEqual(
    newState.layerOrder,
    [
      newState.layers[4].id,
      newState.layers[5].id,
      newState.layers[6].id,
      newState.layers[7].id,
      newState.layers[2].id,
      newState.layers[1].id,
      newState.layers[0].id,
      newState.layers[3].id
    ],
    'should move new layers to front'
  );
  t.deepEqual(newState.splitMaps, expectedSplitMaps, 'should add new layers to split maps');

  t.end();
});

test('#visStateReducer -> setFilter.dynamicDomain & cpu', t => {
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
  const initialState = applyActions(reducer, INITIAL_VIS_STATE, [
    {
      action: VisStateActions.updateVisData,
      payload: [payload]
    }
  ]);

  const expectedLayer1 = new PointLayer({
    isVisible: true,
    dataId: 'smoothie',
    columnMode: 'points',
    label: 'gps_data',
    columns: {
      lat: {value: 'gps_data.lat', fieldIdx: 1},
      lng: {value: 'gps_data.lng', fieldIdx: 2},
      altitude: {value: null, fieldIdx: -1, optional: true},
      neighbors: {value: null, fieldIdx: -1, optional: true}
    }
  });

  expectedLayer1.meta = {
    bounds: [31.2148748, 29.9870074, 31.2590542, 30.0614122]
  };

  const expectedLayers = [expectedLayer1];
  // test default layer
  t.equal(initialState.layers.length, 1, 'should find one layer');

  cmpLayers(t, expectedLayers, initialState.layers);

  // add filter
  const stateWithFilter = reducer(initialState, VisStateActions.addFilter('smoothie'));

  const expectedFilter = {
    dataId: ['smoothie'],
    id: 'donnot test me yet',
    enabled: true,
    name: [],
    type: null,
    fixedDomain: false,
    domain: null,
    value: null,
    view: FILTER_VIEW_TYPES.side,
    isAnimating: false,
    animationWindow: 'free',
    plotType: {type: 'histogram'},
    yAxis: null,
    speed: 1,
    gpu: false,
    fieldIdx: []
  };

  cmpFilters(t, expectedFilter, stateWithFilter.filters[0]);
  const filterId = stateWithFilter.filters[0].id;

  // set filter 'name'
  const stateWithFilterName = reducer(
    stateWithFilter,
    VisStateActions.setFilter(0, 'name', 'date')
  );

  const expectedFilterWName = {
    dataId: ['smoothie'],
    id: filterId,
    enabled: true,
    name: ['date'],
    type: 'multiSelect',
    fieldIdx: [10],
    fixedDomain: false,
    domain: ['2016-09-23', '2016-09-24', '2016-10-10'],
    value: [],
    view: FILTER_VIEW_TYPES.side,
    isAnimating: false,
    animationWindow: 'free',
    fieldType: 'date',
    plotType: {type: 'histogram'},
    yAxis: null,
    speed: 1,
    gpu: false
  };

  // test filter
  cmpFilters(t, expectedFilterWName, stateWithFilterName.filters[0]);

  const updatedField = {
    ...initialState.datasets.smoothie.fields[10],
    filterProps: {
      type: 'multiSelect',
      value: [],
      fieldType: 'date',
      domain: ['2016-09-23', '2016-09-24', '2016-10-10'],
      gpu: false,
      view: FILTER_VIEW_TYPES.side
    }
  };

  const fieldsEx = [...initialState.datasets.smoothie.fields.slice(0, 10), updatedField];
  const {dataContainer} = initialState.datasets.smoothie;

  // test dataset
  const expectedDataset = {
    metadata: {
      id: 'smoothie',
      label: 'queen smoothie',
      format: ''
    },
    type: '',
    supportedFilterTypes: null,
    disableDataOperation: false,
    id: 'smoothie',
    label: 'queen smoothie',
    color: 'donnot test me',
    dataContainer,
    fields: fieldsEx,
    filteredIndex: dataContainer.getPlainIndex(),
    filteredIndexForDomain: dataContainer.getPlainIndex(),
    allIndexes: dataContainer.getPlainIndex(),
    filterRecord: {
      dynamicDomain: [],
      fixedDomain: [],
      cpu: [],
      gpu: []
    },
    gpuFilter: {
      filterRange: [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
      ],
      filterValueUpdateTriggers: {
        gpuFilter_0: null,
        gpuFilter_1: null,
        gpuFilter_2: null,
        gpuFilter_3: null
      },
      filterValueAccessor: {
        inputs: [{index: 0}],
        result: [0, 0, 0, 0]
      }
    },
    fieldPairs: testCsvFieldPairs,
    changedFilters: {dynamicDomain: null, fixedDomain: null, cpu: null, gpu: null}
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

  const updatedFilterWValue = stateWithFilterValue.filters[0];
  const expectedFilteredDataset = {
    ...expectedDataset,
    filterRecord: {
      dynamicDomain: [updatedFilterWValue],
      fixedDomain: [],
      cpu: [updatedFilterWValue],
      gpu: []
    },
    dataContainer,
    filteredIndex: [17, 18, 19, 20, 21, 22],
    filteredIndexForDomain: [17, 18, 19, 20, 21, 22],
    changedFilters: {
      dynamicDomain: {[updatedFilterWValue.id]: 'added'},
      fixedDomain: null,
      cpu: {[updatedFilterWValue.id]: 'added'},
      gpu: null
    },
    type: '',
    supportedFilterTypes: null,
    disableDataOperation: false
  };

  cmpDataset(t, expectedFilteredDataset, stateWithFilterValue.datasets.smoothie);

  const expectedLayerData1 = {
    data: [
      {index: 17, position: [31.2165983, 30.0538936, 0]},
      {index: 18, position: [31.2148748, 30.060911, 0]},
      {index: 19, position: [31.2212278, 30.060334, 0]},
      {index: 20, position: [31.2288985, 30.0554663, 0]},
      {index: 21, position: [31.2187021, 30.0614122, 0]},
      {index: 22, position: [31.2191059, 30.0612697, 0]}
    ],
    getPosition: () => {},
    getColor: () => {},
    getRadius: () => {}
  };

  t.deepEqual(
    stateWithFilterValue.layerData[0].data,
    expectedLayerData1.data,
    'should format layer data correctly'
  );

  t.end();
});

test('#visStateReducer -> RENAME_DATASET', t => {
  const initialState = StateWTripGeojson.visState;

  t.equal(
    initialState.datasets[tripDataInfo.id].label,
    tripDataInfo.label,
    'Initial label as expected'
  );

  const newLabel = 'New label!!!11';
  const updated = reducer(initialState, VisStateActions.renameDataset(tripDataInfo.id, newLabel));

  assertDatasetIsTable(t, updated.datasets[tripDataInfo.id]);
  t.equal(updated.datasets[tripDataInfo.id].label, newLabel, 'Updated label as expected');

  t.end();
});

test('#visStateReducer -> UPDATE_COLOR_TABLE', t => {
  const initialState = StateWTripGeojson.visState;

  t.deepEqual(
    initialState.datasets[tripDataInfo.id].color,
    [192, 108, 132],
    'Initial color as expected'
  );

  const newColor = [255, 255, 255];
  const updated = reducer(
    initialState,
    VisStateActions.updateTableColor(tripDataInfo.id, newColor)
  );

  assertDatasetIsTable(t, updated.datasets[tripDataInfo.id]);
  t.equal(updated.datasets[tripDataInfo.id].color, newColor, 'Updated color as expected');

  t.end();
});

test('#visStateReducer -> UPDATE_TABLE_PROPS', t => {
  const initialState = StateWTripGeojson.visState;

  // update label
  t.equal(
    initialState.datasets[tripDataInfo.id].label,
    tripDataInfo.label,
    'Initial label as expected'
  );

  const newLabel = 'New label!!!11';
  let updated = reducer(
    initialState,
    VisStateActions.updateDatasetProps(tripDataInfo.id, {label: newLabel})
  );

  assertDatasetIsTable(t, updated.datasets[tripDataInfo.id]);
  t.equal(updated.datasets[tripDataInfo.id].label, newLabel, 'Updated label as expected');

  // update color
  t.deepEqual(
    updated.datasets[tripDataInfo.id].color,
    [192, 108, 132],
    'Initial color as expected'
  );

  const newColor = [255, 255, 255];
  updated = reducer(
    updated,
    VisStateActions.updateDatasetProps(tripDataInfo.id, {color: newColor})
  );
  assertDatasetIsTable(t, updated.datasets[tripDataInfo.id]);
  t.equal(updated.datasets[tripDataInfo.id].label, newLabel, 'Updated color as expected');

  // update meta
  updated = reducer(
    updated,
    VisStateActions.updateDatasetProps(tripDataInfo.id, {metadata: {test: true}})
  );
  assertDatasetIsTable(t, updated.datasets[tripDataInfo.id]);
  t.deepEqual(
    updated.datasets[tripDataInfo.id].metadata,
    {
      ...updated.datasets[tripDataInfo.id].metadata,
      test: true
    },
    'Updated color as expected'
  );

  t.end();
});

test('#visStateReducer -> SET_FILTER.name', t => {
  const oldState = CloneDeep(StateWFilters.visState);
  const oldFilter0 = oldState.filters[0];
  // change filter name from RATE to ZIP_CODE
  const updated = reducer(oldState, VisStateActions.setFilter(1, 'name', 'ZIP_CODE', 0));

  const expectedFilter0 = oldFilter0;
  const expectedFilter1 = {
    dataId: [testGeoJsonDataId],
    id: 'RATE-1',
    enabled: true,
    fixedDomain: false,
    view: FILTER_VIEW_TYPES.side,
    isAnimating: false,
    animationWindow: 'free',
    speed: 1,
    name: ['ZIP_CODE'],
    type: 'range',
    fieldIdx: [2],
    domain: [94105, 94111],
    value: [94105, 94111],
    plotType: {type: 'histogram'},
    yAxis: null,
    fieldType: 'integer',
    step: 0.01,
    typeOptions: ['range'],
    gpu: true,
    gpuChannel: [0],
    bins: {
      [testGeoJsonDataId]: histogramFromDomain(
        [94105, 94111],
        geojsonRows.map(d => d[2]),
        BINS
      )
    }
  };

  cmpFilters(t, [expectedFilter0, expectedFilter1], updated.filters);

  t.end();
});

test('#visStateReducer -> SET_FILTER.name merges synced domains when changing first field', async t => {
  const firstDataset = await createNewDataEntryMock({
    info: {id: 'first', label: 'first'},
    data: {
      fields: [
        {name: 'initial', type: ALL_FIELD_TYPES.integer},
        {name: 'replacement', type: ALL_FIELD_TYPES.integer}
      ],
      rows: [
        [0, 0],
        [10, 20]
      ]
    }
  });
  const secondDataset = await createNewDataEntryMock({
    info: {id: 'second', label: 'second'},
    data: {
      fields: [{name: 'amount', type: ALL_FIELD_TYPES.real}],
      rows: [[100], [100.5]]
    }
  });
  let state = {
    ...INITIAL_VIS_STATE,
    datasets: {...firstDataset, ...secondDataset}
  };

  state = reducer(state, VisStateActions.addFilter('first'));
  state = reducer(state, VisStateActions.setFilter(0, 'name', 'initial'));
  state = reducer(state, VisStateActions.setFilter(0, ['dataId', 'name'], ['second', 'amount'], 1));
  state = reducer(state, VisStateActions.setFilter(0, 'name', 'replacement', 0));

  t.deepEqual(state.filters[0].domain, [0, 100.5], 'keeps both synced datasets in the domain');
  t.equal(state.filters[0].step, 0.0001, 'keeps the finest synced dataset step');
  t.end();
});

test('#visStateReducer -> SET_FILTER.inverted', t => {
  const oldState = CloneDeep(StateWFilters.visState);
  const dataId = testGeoJsonDataId;
  const allCount = oldState.datasets[dataId].dataContainer.numRows();
  const keptIn = oldState.datasets[dataId].filteredIndex.length;

  t.ok(keptIn > 0 && keptIn < allCount, 'fixture keeps a subset of rows');

  let next = reducer(oldState, VisStateActions.setFilter(1, 'inverted', true));
  let filter = next.filters[1];
  t.equal(filter.inverted, true, 'stores filter out');
  t.equal(filter.type, 'multiSelect', 'category filter stays a multi select');
  t.equal(
    next.datasets[dataId].filteredIndex.length + keptIn,
    allCount,
    'filter out keeps the rows filter in would hide'
  );

  next = reducer(next, VisStateActions.setFilter(1, 'name', 'ZIP_CODE', 0));
  filter = next.filters[1];
  t.equal(filter.type, 'range', 'numeric field becomes a range filter');
  t.equal(filter.inverted, true, 'filter out survives a field change');
  t.equal(filter.gpu, false, 'an inverted range filter does not use the GPU');

  next = reducer(next, VisStateActions.setFilter(1, 'inverted', false));
  filter = next.filters[1];
  t.equal(filter.inverted, false, 'filter in is the default again');
  t.equal(filter.gpu, true, 'range filters return to the GPU');
  t.deepEqual(filter.gpuChannel, [0], 'a GPU channel is assigned again');

  next.datasets[dataId].disableDataOperation = true;
  next = reducer(next, VisStateActions.setFilter(1, 'inverted', true));
  filter = next.filters[1];
  t.equal(filter.inverted, false, 'GPU-only datasets reject unsupported filter out');
  t.equal(filter.gpu, true, 'GPU-only datasets keep their working GPU filter');

  t.end();
});

test('#visStateReducer -> SET_FILTER.dataId', t => {
  const oldState = CloneDeep(StateWFilters.visState);
  const oldFilter = {...oldState.filters[1]};
  let newState = reducer(oldState, VisStateActions.setFilter(1, 'dataId', testCsvDataId));

  let newFilter = newState.filters[1];
  let expectedFilter = getDefaultFilter({dataId: testCsvDataId, id: oldFilter.id});

  t.deepEqual(newFilter, expectedFilter, 'Should create a new filter using the provided dataId');

  // Using an array of dataId
  newState = reducer(newState, VisStateActions.setFilter(1, 'dataId', testCsvDataId, 0));

  newFilter = newState.filters[1];

  expectedFilter = getDefaultFilter({dataId: testCsvDataId, id: newFilter.id});

  t.deepEqual(
    newFilter,
    expectedFilter,
    'Should create a new filter using the provided list of dataId'
  );

  t.end();
});

test('#visStateReducer -> SET_FILTER.dataId replaces synced datasets in place', async t => {
  const firstDataset = await createNewDataEntryMock({
    info: {id: 'first', label: 'first'},
    data: {
      fields: [{name: 'value', type: ALL_FIELD_TYPES.integer}],
      rows: [[0], [10]]
    }
  });
  const secondDataset = await createNewDataEntryMock({
    info: {id: 'second', label: 'second'},
    data: {
      fields: [{name: 'value', type: ALL_FIELD_TYPES.integer}],
      rows: [[20], [30]]
    }
  });
  const replacementDataset = await createNewDataEntryMock({
    info: {id: 'replacement', label: 'replacement'},
    data: {
      fields: [
        {name: 'other', type: ALL_FIELD_TYPES.integer},
        {name: 'value', type: ALL_FIELD_TYPES.integer}
      ],
      rows: [
        [400, 40],
        [500, 50]
      ]
    }
  });
  let state = {
    ...INITIAL_VIS_STATE,
    datasets: {...firstDataset, ...secondDataset, ...replacementDataset}
  };

  state = reducer(state, VisStateActions.addFilter('first'));
  state = reducer(state, VisStateActions.setFilter(0, 'name', 'value'));
  state = reducer(state, VisStateActions.setFilter(0, ['dataId', 'name'], ['second', 'value'], 1));
  state = reducer(state, VisStateActions.addFilter('replacement'));
  state = reducer(state, VisStateActions.setFilter(1, 'name', 'other'));

  const replaceFirstState = reducer(
    state,
    VisStateActions.setFilter(0, 'dataId', 'replacement', 0)
  );
  const replaceFirst = replaceFirstState.filters[0];
  t.deepEqual(replaceFirst.dataId, ['replacement', 'second'], 'replaces the first dataset');
  t.deepEqual(replaceFirst.name, ['value', 'value'], 'keeps field names aligned');
  t.deepEqual(replaceFirst.fieldIdx, [1, 0], 'rebinds the first field index by name');
  t.deepEqual(replaceFirst.gpuChannel, [1, 0], 'reallocates the replaced GPU channel');
  t.equal(
    replaceFirstState.datasets.replacement.gpuFilter.filterValueUpdateTriggers.gpuFilter_0.name,
    'other',
    'keeps the existing replacement-dataset GPU filter'
  );
  t.equal(
    replaceFirstState.datasets.replacement.gpuFilter.filterValueUpdateTriggers.gpuFilter_1.name,
    'value',
    'adds the rebound filter on a free GPU channel'
  );
  t.deepEqual(
    replaceFirst.domain,
    [20, 50],
    'rebuilds the domain after replacing the first dataset'
  );

  const replaceSecond = reducer(state, VisStateActions.setFilter(0, 'dataId', 'replacement', 1))
    .filters[0];
  t.deepEqual(replaceSecond.dataId, ['first', 'replacement'], 'replaces a later dataset');
  t.deepEqual(replaceSecond.name, ['value', 'value'], 'keeps later field names aligned');
  t.deepEqual(replaceSecond.fieldIdx, [0, 1], 'rebinds a later field index by name');
  t.deepEqual(replaceSecond.gpuChannel, [0, 1], 'reallocates a later GPU channel');
  t.deepEqual(replaceSecond.domain, [0, 50], 'rebuilds the domain after replacing a later dataset');

  t.end();
});

test('#visStateReducer -> SET_FILTER.dataId rebinds interval fields on replacement', async t => {
  const makeDataset = async (id, csv) => {
    const {fields, rows} = processCsvData(csv);
    return createNewDataEntryMock({info: {id, label: id}, data: {fields, rows}});
  };
  const firstDataset = await makeDataset(
    'first',
    'start,end\n2020-01-01 00:00:00,2020-01-01 00:30:00\n2020-01-01 01:00:00,2020-01-01 01:30:00'
  );
  const secondDataset = await makeDataset(
    'second',
    'start,end\n2020-01-02 00:00:00,2020-01-02 00:30:00\n2020-01-02 01:00:00,2020-01-02 01:30:00'
  );
  const replacementDataset = await makeDataset(
    'replacement',
    'other,end,start\n1,2020-01-03 00:30:00,2020-01-03 00:00:00\n2,2020-01-03 01:30:00,2020-01-03 01:00:00'
  );
  const missingEndDataset = await makeDataset(
    'missing-end',
    'other,start\n1,2020-01-04 00:00:00\n2,2020-01-04 01:00:00'
  );
  let state = {
    ...INITIAL_VIS_STATE,
    datasets: {
      ...firstDataset,
      ...secondDataset,
      ...replacementDataset,
      ...missingEndDataset
    }
  };

  state = reducer(state, VisStateActions.addFilter('first'));
  state = reducer(state, VisStateActions.setFilter(0, 'name', 'start'));
  state = reducer(state, VisStateActions.setFilter(0, 'endName', 'end'));
  state = reducer(state, VisStateActions.setFilter(0, ['dataId', 'name'], ['second', 'start'], 1));
  state = reducer(state, VisStateActions.setFilter(0, 'endName', 'end', 1));
  state = reducer(state, VisStateActions.addFilter('replacement'));
  state = reducer(state, VisStateActions.setFilter(1, 'name', 'other'));

  const replaced = reducer(state, VisStateActions.setFilter(0, 'dataId', 'replacement', 1))
    .filters[0];
  const replacementEndProps = replacementDataset.replacement.getColumnFilterProps('end');
  t.deepEqual(replaced.fieldIdx, [0, 2], 'rebinds the interval start field index');
  t.deepEqual(replaced.endFieldIdx, [1, 1], 'rebinds the interval end field index');
  t.deepEqual(
    replaced.endMappedValue[1],
    replacementEndProps.mappedValue,
    'rebuilds the replacement interval end values'
  );
  t.deepEqual(replaced.gpuChannel, [0, 1], 'allocates a free replacement start channel');
  t.deepEqual(replaced.gpuEndChannel, [1, 2], 'allocates a free replacement end channel');

  const missingEnd = reducer(state, VisStateActions.setFilter(0, 'dataId', 'missing-end', 1))
    .filters[0];
  t.equal(missingEnd.name[1], 'start', 'keeps an available start selection');
  t.equal(missingEnd.endName[1], null, 'clears a missing end selection');
  t.equal(missingEnd.endFieldIdx[1], null, 'clears a missing end field index');
  t.equal(missingEnd.endMappedValue[1], null, 'clears missing interval values');
  t.equal(missingEnd.gpuEndChannel[1], undefined, 'clears the missing end GPU channel');

  t.end();
});

test('#visStateReducer -> SET_FILTER.dataId leaves missing replacement fields empty', async t => {
  const firstDataset = await createNewDataEntryMock({
    info: {id: 'first', label: 'first'},
    data: {
      fields: [{name: 'value', type: ALL_FIELD_TYPES.integer}],
      rows: [[0], [10]]
    }
  });
  const secondDataset = await createNewDataEntryMock({
    info: {id: 'second', label: 'second'},
    data: {
      fields: [{name: 'value', type: ALL_FIELD_TYPES.integer}],
      rows: [[20], [30]]
    }
  });
  const replacementDataset = await createNewDataEntryMock({
    info: {id: 'replacement', label: 'replacement'},
    data: {
      fields: [{name: 'other', type: ALL_FIELD_TYPES.integer}],
      rows: [[100], [200]]
    }
  });
  let state = {
    ...INITIAL_VIS_STATE,
    datasets: {...firstDataset, ...secondDataset, ...replacementDataset}
  };

  state = reducer(state, VisStateActions.addFilter('first'));
  state = reducer(state, VisStateActions.setFilter(0, 'name', 'value'));
  state = reducer(state, VisStateActions.setFilter(0, ['dataId', 'name'], ['second', 'value'], 1));
  state = reducer(state, VisStateActions.setFilter(0, 'value', [5, 15]));
  state = reducer(state, VisStateActions.setFilter(0, 'dataId', 'replacement', 1));

  t.deepEqual(state.filters[0].name, ['value', ''], 'leaves the unavailable field unselected');
  t.deepEqual(state.filters[0].fieldIdx, [0, -1], 'clears the unavailable field index');
  t.equal(state.filters[0].gpu, false, 'uses CPU filtering while a selection is missing');
  t.equal(state.filters[0].gpuChannel[1], undefined, 'clears the replaced GPU channel');
  t.equal(
    state.datasets.replacement.filteredIndex.length,
    2,
    'does not apply the synced filter until a replacement field is selected'
  );

  t.end();
});

test('#visStateReducer -> SET_FILTER.dataId falls back to CPU when GPU channels are exhausted', async t => {
  const createDataset = (id, rows) =>
    createNewDataEntryMock({
      info: {id, label: id},
      data: {fields: [{name: 'value', type: ALL_FIELD_TYPES.integer}], rows}
    });
  const firstDataset = await createDataset('first', [[0], [10]]);
  const secondDataset = await createDataset('second', [[20], [30]]);
  const replacementDataset = await createDataset('replacement', [[0], [10], [20]]);
  let state = {
    ...INITIAL_VIS_STATE,
    datasets: {...firstDataset, ...secondDataset, ...replacementDataset}
  };

  state = reducer(state, VisStateActions.addFilter('first'));
  state = reducer(state, VisStateActions.setFilter(0, 'name', 'value'));
  state = reducer(state, VisStateActions.setFilter(0, ['dataId', 'name'], ['second', 'value'], 1));
  state = reducer(state, VisStateActions.setFilter(0, 'value', [5, 15]));
  for (let i = 0; i < MAX_GPU_FILTERS; i++) {
    state = reducer(state, VisStateActions.addFilter('replacement'));
    state = reducer(state, VisStateActions.setFilter(i + 1, 'name', 'value'));
  }

  state = reducer(state, VisStateActions.setFilter(0, 'dataId', 'replacement', 1));

  t.equal(state.filters[0].gpu, false, 'falls back to CPU filtering');
  t.equal(state.filters[0].gpuChannel[1], undefined, 'does not retain a conflicting channel');
  t.ok(
    state.datasets.replacement.filterRecord.cpu.some(filter => filter.id === state.filters[0].id),
    'records the replaced filter as a CPU filter'
  );
  t.equal(
    state.datasets.replacement.filteredIndex.length,
    1,
    'applies the replacement filter on CPU'
  );

  t.end();
});

test('#visStateReducer -> SET_FILTER shares a filter with a dataset whose GPU channels are full', async t => {
  const createDataset = id =>
    createNewDataEntryMock({
      info: {id, label: id},
      data: {
        fields: [{name: 'value', type: ALL_FIELD_TYPES.integer}],
        rows: [[10], [20]]
      }
    });
  let state = {
    ...INITIAL_VIS_STATE,
    datasets: {...(await createDataset('first')), ...(await createDataset('second'))}
  };

  state = reducer(state, VisStateActions.addFilter('first'));
  state = reducer(state, VisStateActions.setFilter(0, 'name', 'value'));
  state = reducer(state, VisStateActions.setFilter(0, 'value', [10, 10]));
  for (let i = 0; i < MAX_GPU_FILTERS; i++) {
    state = reducer(state, VisStateActions.addFilter('second'));
    state = reducer(state, VisStateActions.setFilter(i + 1, 'name', 'value'));
  }
  t.deepEqual(
    state.filters.slice(1).map(filter => filter.gpuChannel[0]),
    [0, 1, 2, 3],
    'the target dataset has four occupied GPU channels'
  );

  state = reducer(state, VisStateActions.setFilter(0, ['dataId', 'name'], ['second', 'value'], 1));

  t.equal(state.filters[0].gpu, false, 'falls back to CPU for the whole shared filter');
  for (const dataId of ['first', 'second']) {
    const dataset = state.datasets[dataId];
    const {filterRange, filterValueAccessor} = dataset.gpuFilter;
    const getFilterValue = filterValueAccessor(dataset.dataContainer)();
    const visibleRows = dataset.filteredIndex.filter(index =>
      getFilterValue({index}).every(
        (value, channel) => value >= filterRange[channel][0] && value <= filterRange[channel][1]
      )
    );
    t.deepEqual(visibleRows, [0], `${dataId}: only row 10 remains visible`);
    t.ok(
      dataset.filterRecord.cpu.some(filter => filter.id === state.filters[0].id),
      `${dataId}: records the shared filter on CPU`
    );
    t.deepEqual(dataset.filteredIndex, [0], `${dataId}: updates the cached CPU row indexes`);
    const cpuDataset = copyTableAndUpdate(dataset).filterTableCPU(state.filters, state.layers);
    t.deepEqual(visibleRows, cpuDataset.filteredIdxCPU, `${dataId}: matches CPU-only filtering`);
  }

  state = reducer(state, VisStateActions.setFilter(0, 'value', [20, 20]));
  t.deepEqual(
    state.datasets.first.filteredIndex,
    [1],
    'updates the original dataset after fallback'
  );
  t.deepEqual(state.datasets.second.filteredIndex, [1], 'updates the added dataset after fallback');
  t.end();
});

test('#visStateReducer -> SET_FILTER synced', t => {
  const initialState = StateWSyncedTimeFilter.visState;
  const oldFilter = {...initialState.filters[0]};
  const filterId = oldFilter.id;

  // test synced filter
  expectedSyncedTsFilter.id = filterId;

  const expectedFilteredDataset1 = {
    ...initialState.datasets[testCsvDataSlice1Id],
    changedFilters: {
      dynamicDomain: null,
      fixedDomain: {
        [filterId]: 'value_changed'
      },
      cpu: null,
      gpu: {
        [filterId]: 'value_changed'
      }
    },
    filterRecord: {
      cpu: [],
      dynamicDomain: [],
      fixedDomain: [
        // filterRecord cmparison util only check the name
        {
          name: ['gps_data.utc_timestamp', 'gps_data.utc_timestamp']
        }
      ],
      gpu: [
        // filterRecord cmparison util only check the name
        {
          name: ['gps_data.utc_timestamp', 'gps_data.utc_timestamp']
        }
      ]
    },
    gpuFilter: {
      filterRange: [
        [121000, 1193000],
        [0, 0],
        [0, 0],
        [0, 0]
      ],
      filterValueAccessor: {
        inputs: [
          {
            data: testCsvDataSlice1[1],
            index: 1
          }
        ],
        result: [1474071056000 - 1474070995000, 0, 0, 0]
      },
      filterValueUpdateTriggers: {
        gpuFilter_0: {
          name: 'gps_data.utc_timestamp',
          domain0: 1474070995000
        },
        gpuFilter_1: null,
        gpuFilter_2: null,
        gpuFilter_3: null
      }
    }
  };

  const expectedFilteredDataset2 = {
    ...initialState.datasets[testCsvDataSlice2Id],
    changedFilters: {
      dynamicDomain: null,
      fixedDomain: {
        [filterId]: 'value_changed'
      },
      cpu: null,
      gpu: {
        [filterId]: 'value_changed'
      }
    },
    filterRecord: {
      cpu: [],
      dynamicDomain: [],
      fixedDomain: [
        // filterRecord cmparison util only check the name
        {
          name: ['gps_data.utc_timestamp', 'gps_data.utc_timestamp']
        }
      ],
      gpu: [
        // filterRecord cmparison util only check the name
        {
          name: ['gps_data.utc_timestamp', 'gps_data.utc_timestamp']
        }
      ]
    },
    gpuFilter: {
      filterRange: [
        [121000, 1193000],
        [0, 0],
        [0, 0],
        [0, 0]
      ],
      filterValueAccessor: {
        inputs: [
          {
            data: testCsvDataSlice2[1],
            index: 1
          }
        ],
        // 1474071056000
        result: [1474071363000 - 1474070995000, 0, 0, 0]
      },
      filterValueUpdateTriggers: {
        gpuFilter_0: {
          name: 'gps_data.utc_timestamp',
          domain0: 1474070995000
        },
        gpuFilter_1: null,
        gpuFilter_2: null,
        gpuFilter_3: null
      }
    }
  };
  cmpFilters(t, expectedSyncedTsFilter, initialState.filters[0]);
  cmpDataset(t, expectedFilteredDataset1, initialState.datasets[testCsvDataSlice1Id]);
  cmpDataset(t, expectedFilteredDataset2, initialState.datasets[testCsvDataSlice2Id]);

  t.end();
});

test('#visStateReducer -> SET_FILTER synced -> remove 1', t => {
  const initialState = StateWSyncedTimeFilter.visState;
  const oldFilter = {...initialState.filters[0]};
  const filterId = oldFilter.id;
  // remove dataset at filter
  const resultState = reducer(initialState, VisStateActions.setFilter(0, 'dataId', null, 0));
  const expectedFilter = {
    ...expectedSyncedTsFilter,
    id: oldFilter.id,
    dataId: ['test-csv-data-2'],
    name: ['gps_data.utc_timestamp'],
    fieldIdx: [0],
    // reset domain
    domain: [1474071301000, 1474072208000],
    // adjust value
    value: [1474071301000, 1474072188000],
    gpuChannel: [0],
    timeBins: {
      'test-csv-data-2': expectedSyncedTsFilter.timeBins['test-csv-data-2']
    }
  };

  const expectedFilteredDataset1 = {
    ...initialState.datasets[testCsvDataSlice1Id],
    changedFilters: {
      dynamicDomain: null,
      fixedDomain: {
        [filterId]: 'deleted'
      },
      cpu: null,
      gpu: {
        [filterId]: 'deleted'
      }
    },
    filterRecord: {
      cpu: [],
      dynamicDomain: [],
      fixedDomain: [],
      gpu: []
    },
    gpuFilter: {
      filterRange: [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
      ],
      filterValueAccessor: {
        inputs: [
          {
            data: testCsvDataSlice1[1],
            index: 1
          }
        ],
        result: [0, 0, 0, 0]
      },
      filterValueUpdateTriggers: {
        gpuFilter_0: null,
        gpuFilter_1: null,
        gpuFilter_2: null,
        gpuFilter_3: null
      }
    }
  };

  const expectedFilteredDataset2 = {
    ...initialState.datasets[testCsvDataSlice2Id],
    changedFilters: {
      dynamicDomain: null,
      fixedDomain: {
        [filterId]: 'dataId_changed'
      },
      cpu: null,
      gpu: {
        [filterId]: 'dataId_changed'
      }
    },
    filterRecord: {
      cpu: [],
      dynamicDomain: [],
      fixedDomain: [
        // filterRecord cmparison util only check the name
        {
          name: ['gps_data.utc_timestamp']
        }
      ],
      gpu: [
        // filterRecord cmparison util only check the name
        {
          name: ['gps_data.utc_timestamp']
        }
      ]
    },
    gpuFilter: {
      filterRange: [
        [0, 887000],
        [0, 0],
        [0, 0],
        [0, 0]
      ],
      filterValueAccessor: {
        inputs: [
          {
            data: testCsvDataSlice2[1],
            index: 1
          }
        ],
        // 1474071056000
        result: [1474071363000 - 1474071301000, 0, 0, 0]
      },
      filterValueUpdateTriggers: {
        gpuFilter_0: {
          name: 'gps_data.utc_timestamp',
          domain0: 1474071301000
        },
        gpuFilter_1: null,
        gpuFilter_2: null,
        gpuFilter_3: null
      }
    }
  };

  cmpFilters(t, expectedFilter, resultState.filters[0]);
  cmpDataset(t, expectedFilteredDataset1, resultState.datasets[testCsvDataSlice1Id]);
  cmpDataset(t, expectedFilteredDataset2, resultState.datasets[testCsvDataSlice2Id]);

  t.end();
});

function testSetFilterDynamicDomainGPU(t, setFilter) {
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
  const initialState = applyActions(reducer, INITIAL_VIS_STATE, [
    {
      action: VisStateActions.updateVisData,
      payload: [payload]
    }
  ]);

  // add filter
  const stateWithFilter = reducer(initialState, VisStateActions.addFilter('milkshake'));

  // set filter 'name'
  const stateWithFilterName = reducer(stateWithFilter, setFilter(0, 'name', 'TRIPS'));

  const expectedFilterWName = {
    dataId: ['milkshake'],
    enabled: true,
    id: stateWithFilter.filters[0].id,
    name: ['TRIPS'],
    type: 'range',
    fieldIdx: [4],
    domain: [4, 20],
    step: 0.01,
    value: [4, 20],
    view: FILTER_VIEW_TYPES.side,
    fixedDomain: false,
    isAnimating: false,
    animationWindow: 'free',
    fieldType: 'integer',
    typeOptions: ['range'],
    plotType: {type: 'histogram'},
    yAxis: null,
    speed: 1,
    gpu: true,
    gpuChannel: [0],
    bins: {
      milkshake: [
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
      ]
    }
  };
  // test filter
  cmpFilters(t, expectedFilterWName, stateWithFilterName.filters[0]);

  // set filter value
  const stateWithFilterValue = reducer(stateWithFilterName, setFilter(0, 'value', [8, 20]));
  const filterId = stateWithFilterName.filters[0].id;
  const expectedFilterWValue = {
    ...expectedFilterWName,
    value: [8, 20]
  };

  // test filter
  cmpFilters(t, expectedFilterWValue, stateWithFilterValue.filters[0]);

  const expectedFilteredDataset = {
    ...initialState.datasets.milkshake,

    // receive Vis Data will add id to fields
    // filter will add filterProps to fields
    fields: geojsonFields.map((f, i) => ({
      ...f,
      valueAccessor: maybeToDate.bind(
        null,
        // is time
        f.type === ALL_FIELD_TYPES.timestamp,
        i,
        f.format,
        initialState.datasets.milkshake.dataContainer
      ),
      ...(f.name === 'TRIPS' ? {filterProps: geoJsonTripFilterProps} : {})
    })),
    gpuFilter: {
      filterRange: [
        [4, 16],
        [0, 0],
        [0, 0],
        [0, 0]
      ],
      filterValueUpdateTriggers: {
        gpuFilter_0: {name: 'TRIPS', domain0: 4},
        gpuFilter_1: null,
        gpuFilter_2: null,
        gpuFilter_3: null
      },
      filterValueAccessor: {
        inputs: [{index: 0}],
        result: [7, 0, 0, 0]
      }
    },
    filterRecord: {
      dynamicDomain: [stateWithFilterValue.filters[0]],
      fixedDomain: [],
      cpu: [],
      gpu: [stateWithFilterValue.filters[0]]
    },
    filteredIndex: geojsonData.features.map((_, i) => i),
    filteredIndexForDomain: [0, 2],
    allIndexes: geojsonData.features.map((_, i) => i),
    changedFilters: {
      dynamicDomain: {[filterId]: 'value_changed'},
      fixedDomain: null,
      cpu: null,
      gpu: {[filterId]: 'value_changed'}
    },
    type: '',
    supportedFilterTypes: null,
    disableDataOperation: false
  };

  const actualTripField = stateWithFilterValue.datasets.milkshake.fields[4];
  const expectedField = expectedFilteredDataset.fields[4];

  cmpField(t, expectedField, actualTripField, 'trip field should be same');
  cmpDataset(t, expectedFilteredDataset, stateWithFilterValue.datasets.milkshake);
}
test('#visStateReducer -> setFilter.dynamicDomain & gpu', t => {
  testSetFilterDynamicDomainGPU(t, VisStateActions.setFilter);
  t.end();
});

test('#visStateReducer -> SET_FILTER_ANIMATION_TIME', t => {
  testSetFilterDynamicDomainGPU(t, VisStateActions.setFilterAnimationTime);
  t.end();
});

test('#visStateReducer -> SET_FILTER_ANIMATION_WINDOW', t => {
  const initialState = CloneDeep(StateWFilters.visState);
  const nextState = reducer(
    initialState,
    VisStateActions.setFilterAnimationWindow({
      id: initialState.filters[0].id,
      animationWindow: 'incremental'
    })
  );

  t.equal(nextState.filters[0].animationWindow, 'incremental', 'should update ANIMATIONWINDOW');

  t.end();
});

test('#visStateReducer -> SET_FILTER_ANIMATION_WINDOW interval snaps to one histogram bin', t => {
  const initialState = CloneDeep(StateWFilters.visState);
  const filter = initialState.filters[0];

  const nextState = reducer(
    initialState,
    VisStateActions.setFilterAnimationWindow({
      id: filter.id,
      animationWindow: ANIMATION_WINDOW.interval
    })
  );

  const updated = nextState.filters[0];
  t.equal(updated.animationWindow, ANIMATION_WINDOW.interval, 'should set interval window');
  t.ok(updated.plotType.interval, 'should keep a histogram interval');

  const thresholds = getBinThresholds(updated.plotType.interval, updated.domain);
  t.ok(thresholds.includes(updated.value[0]), 'bin start should be a histogram threshold');
  const idx = thresholds.indexOf(updated.value[0]);
  t.ok(idx > -1 && idx < thresholds.length - 1, 'should land on a bin, not the domain end');
  t.equal(
    updated.value[1],
    thresholds[idx + 1] - 1,
    'bin end should stop before the next histogram threshold'
  );

  const backToFree = reducer(
    nextState,
    VisStateActions.setFilterAnimationWindow({
      id: filter.id,
      animationWindow: ANIMATION_WINDOW.free
    })
  );
  const freed = backToFree.filters[0];
  t.equal(freed.animationWindow, ANIMATION_WINDOW.free, 'should leave interval mode');
  t.ok(freed.value[1] > freed.value[0], 'should widen back to a range of at least one bin');

  t.end();
});

test('#visStateReducer -> sparse datetime interval uses the cached bin end', t => {
  const initialState = CloneDeep(StateWFilters.visState);
  const filter = initialState.filters[0];
  const dataId = filter.dataId[0];
  const interval = '1-minute';
  filter.domain = [0, 180000];
  filter.value = [0, 0];
  filter.animationWindow = ANIMATION_WINDOW.free;
  filter.plotType = {...filter.plotType, interval};
  filter.timeBins = {
    [dataId]: {
      [interval]: [
        {count: 1, indexes: [0], x0: 0, x1: 60000},
        {count: 1, indexes: [1], x0: 120000, x1: 180000}
      ]
    }
  };

  const nextState = reducer(
    initialState,
    VisStateActions.setFilterAnimationWindow({
      id: filter.id,
      animationWindow: ANIMATION_WINDOW.interval
    })
  );

  t.deepEqual(
    nextState.filters[0].value,
    [0, 59999],
    'should stop at the selected cached calendar bin instead of the next non-empty bin'
  );
  t.end();
});

test('#visStateReducer -> numeric filter timeline uses numeric bins and no time-only state', t => {
  let state = CloneDeep(StateWFilters.visState);
  state = reducer(state, VisStateActions.setFilter(0, 'name', 'gps_data.lat'));

  t.equal(state.filters[0].type, 'range', 'should switch the selected X field to a range filter');
  t.equal(
    state.filters[0].view,
    FILTER_VIEW_TYPES.side,
    'should keep the numeric timeline disabled by default'
  );

  state = reducer(state, VisStateActions.setFilterPlot(0, {plotType: {numericInterval: 0.01}}));
  state = reducer(state, VisStateActions.setFilterView(0, FILTER_VIEW_TYPES.enlarged));
  state = reducer(state, VisStateActions.setFilter(0, 'name', 'gps_data.lng'));
  t.equal(
    state.filters[0].view,
    FILTER_VIEW_TYPES.enlarged,
    'should keep an opted-in numeric timeline open when changing numeric fields'
  );
  state = reducer(state, VisStateActions.setFilter(0, 'name', 'gps_data.lat'));
  state = reducer(
    state,
    VisStateActions.setFilterAnimationWindow({
      id: state.filters[0].id,
      animationWindow: ANIMATION_WINDOW.interval
    })
  );

  const filter = state.filters[0];
  const marks = getFilterBinThresholds(filter);
  const markIndex = marks.indexOf(filter.value[0]);
  t.ok(markIndex >= 0 && markIndex < marks.length - 1, 'should snap to a numeric histogram bin');
  t.equal(
    filter.value[1],
    intervalBinFromMarks(marks, filter.value[0], 0)[1],
    'should match the selected histogram bin without sharing its next boundary'
  );
  t.equal(filter.plotType.numericInterval, 0.01, 'should persist the numeric bin size');
  t.notOk(filter.timeBins, 'should not create calendar time bins');
  t.notOk(filter.timezone, 'should not add a timezone');
  t.notOk(
    Object.prototype.hasOwnProperty.call(filter, 'syncTimelineMode'),
    'should not apply time timeline synchronization state'
  );

  const yAxis = state.datasets[filter.dataId[0]].fields.find(
    field => field.name === 'gps_data.lng'
  );
  state = reducer(state, VisStateActions.setFilterPlot(0, {yAxis}));
  state = reducer(state, VisStateActions.setFilterPlot(0, {plotType: {aggregation: 'sum'}}));
  t.equal(state.filters[0].plotType.type, 'lineChart', 'should enable the Y-axis line chart');
  t.ok(state.filters[0].lineChart?.series, 'should aggregate the selected Y field by numeric bins');

  state = reducer(state, VisStateActions.setFilter(0, 'name', 'time'));
  t.equal(state.filters[0].type, 'timeRange', 'should switch back to datetime behavior');
  t.notOk(
    state.filters[0].plotType.numericInterval,
    'should not apply the numeric bin size to datetime'
  );
  t.ok(state.filters[0].plotType.interval, 'should restore a calendar interval for datetime');
  state = reducer(
    state,
    VisStateActions.setFilterAnimationTimeConfig(0, {timezone: 'America/New_York'})
  );
  state = reducer(state, VisStateActions.setFilter(0, 'name', 'gps_data.lat'));
  t.equal(state.filters[0].type, 'range', 'should switch back to numeric behavior');
  t.notOk(state.filters[0].timezone, 'should clear timezone state from a numeric filter');
  t.notOk(state.filters[0].plotType.interval, 'should clear calendar binning from numeric mode');

  t.end();
});

test('#visStateReducer -> oversized numeric intervals use coherent automatic bins', t => {
  const {fields, rows} = processCsvData(`x
0
100`);
  const payload = [
    {
      info: {id: 'numeric-bin-limit', label: 'numeric bin limit'},
      data: {fields, rows}
    }
  ];
  let state = applyActions(reducer, INITIAL_VIS_STATE, [
    {
      action: VisStateActions.updateVisData,
      payload: [payload]
    }
  ]);
  state = reducer(state, VisStateActions.addFilter('numeric-bin-limit'));
  state = reducer(state, VisStateActions.setFilter(0, 'name', 'x'));
  state = reducer(state, VisStateActions.setFilterPlot(0, {plotType: {numericInterval: 10}}));
  t.equal(state.filters[0].plotType.numericInterval, 10, 'should keep a valid numeric interval');

  state = reducer(state, VisStateActions.setFilterPlot(0, {plotType: {numericInterval: 0.01}}));

  const filter = state.filters[0];
  const effectiveInterval = getNumericPlotInterval(filter);
  t.notOk(
    Object.prototype.hasOwnProperty.call(filter.plotType, 'numericInterval'),
    'should discard an interval that exceeds the numeric bin limit'
  );
  t.ok(effectiveInterval > 0.01, 'should report the effective automatic bin width');
  t.equal(
    effectiveInterval,
    filter.bins['numeric-bin-limit'][0].x1 - filter.bins['numeric-bin-limit'][0].x0,
    'the displayed interval should match the bins used by the filter plot'
  );

  t.end();
});

test('#visStateReducer -> numeric interval playback refilters exact bins', t => {
  const {fields, rows} = processCsvData(`x
-1.5
-1
-0.75
0
0.25
0.5
1`);
  const payload = [
    {
      info: {id: 'numeric-interval', label: 'numeric interval'},
      data: {fields, rows}
    }
  ];
  let state = applyActions(reducer, INITIAL_VIS_STATE, [
    {
      action: VisStateActions.updateVisData,
      payload: [payload]
    }
  ]);
  state = reducer(state, VisStateActions.addFilter('numeric-interval'));
  state = reducer(state, VisStateActions.setFilter(0, 'name', 'x'));
  state = reducer(state, VisStateActions.setFilter(0, 'value', [-1.5, -1]));
  state = reducer(state, VisStateActions.setFilterPlot(0, {plotType: {numericInterval: 1.5}}));
  state = reducer(
    state,
    VisStateActions.setFilterAnimationWindow({
      id: state.filters[0].id,
      animationWindow: ANIMATION_WINDOW.interval
    })
  );

  let filter = state.filters[0];
  let dataset = state.datasets['numeric-interval'];
  let marks = getFilterBinThresholds(filter);
  t.deepEqual(
    filter.value,
    intervalBinFromMarks(marks, marks[0], 0),
    'entering interval mode snaps the paused selection to one numeric bin'
  );
  t.ok(
    dataset.filterRecord.cpu.some(candidate => candidate.id === filter.id),
    'numeric interval membership uses the exact CPU filtering path'
  );
  t.notOk(
    dataset.filterRecord.gpu.some(candidate => candidate.id === filter.id),
    'numeric interval membership does not use inclusive Float32 GPU bounds'
  );
  t.deepEqual(
    dataset.filteredIndex,
    [0, 1, 2],
    'the first bin excludes the exact boundary assigned to the next bin'
  );

  state = reducer(state, VisStateActions.setFilterPlot(0, {plotType: {numericInterval: 0.5}}));
  filter = state.filters[0];
  dataset = state.datasets['numeric-interval'];
  marks = getFilterBinThresholds(filter);
  const selectedMark = marks.indexOf(filter.value[0]);
  t.ok(selectedMark >= 0 && selectedMark < marks.length - 1, 'uses a new histogram mark');
  t.deepEqual(
    filter.value,
    intervalBinFromMarks(marks, filter.value[0], 0),
    'changing the numeric bin size resnaps a paused interval to one new bin'
  );
  t.deepEqual(
    dataset.filteredIndex,
    [3, 4],
    'changing the numeric bin size immediately reapplies the resnapped selection'
  );

  state = reducer(
    state,
    VisStateActions.setFilterAnimationWindow({
      id: filter.id,
      animationWindow: ANIMATION_WINDOW.free
    })
  );
  filter = state.filters[0];
  dataset = state.datasets['numeric-interval'];
  t.ok(
    dataset.filterRecord.gpu.some(candidate => candidate.id === filter.id),
    'leaving interval playback restores ordinary numeric GPU filtering'
  );

  t.end();
});

test('#visStateReducer -> visible numeric side charts refresh after sibling filters', t => {
  const {fields, rows} = processCsvData(`x,category,value
0,A,10
0.05,A,20
0.075,B,30
0.1,B,40`);
  const payload = [
    {
      info: {id: 'numeric-shared', label: 'numeric shared'},
      data: {fields, rows}
    }
  ];

  let state = applyActions(reducer, INITIAL_VIS_STATE, [
    {
      action: VisStateActions.updateVisData,
      payload: [payload]
    }
  ]);
  state = reducer(state, VisStateActions.addFilter('numeric-shared'));
  state = reducer(state, VisStateActions.setFilter(0, 'name', 'x'));
  state = reducer(state, VisStateActions.setFilterPlot(0, {plotType: {numericInterval: 0.05}}));
  state = reducer(state, VisStateActions.addFilter('numeric-shared'));
  state = reducer(state, VisStateActions.setFilter(1, 'name', 'category'));
  const cachedHistogram = state.filters[0];
  state = reducer(state, VisStateActions.setFilter(1, 'value', ['A']));
  t.equal(
    state.filters[0],
    cachedHistogram,
    'an unconfigured numeric side histogram stays cached after sibling filtering'
  );
  state = reducer(state, VisStateActions.removeFilter(1));

  const yAxis = state.datasets['numeric-shared'].fields.find(field => field.name === 'value');
  state = reducer(state, VisStateActions.setFilterPlot(0, {yAxis}));
  state = reducer(state, VisStateActions.setFilterView(0, FILTER_VIEW_TYPES.enlarged));

  t.deepEqual(state.filters[0].lineChart.yDomain, [10, 40], 'open plot starts with all rows');

  state = reducer(state, VisStateActions.setFilterView(0, FILTER_VIEW_TYPES.side));
  state = reducer(state, VisStateActions.addFilter('numeric-shared'));
  state = reducer(state, VisStateActions.setFilter(1, 'name', 'category'));
  state = reducer(state, VisStateActions.setFilter(1, 'value', ['A']));

  t.deepEqual(
    state.filters[0].lineChart.yDomain,
    [10, 20],
    'visible side chart rebuilds its Y domain after sibling filtering'
  );
  t.equal(
    state.filters[0].lineChart.allTime.value,
    15,
    'visible side chart rebuilds its Y aggregate after sibling filtering'
  );
  t.deepEqual(
    state.filters[0].bins['numeric-shared'].map(bin => bin.count),
    [1, 1, 0],
    'visible side chart rebuilds bin counts after sibling filtering'
  );

  state = reducer(state, VisStateActions.removeFilter(1));
  t.deepEqual(
    state.filters[0].lineChart.yDomain,
    [10, 40],
    'removing the sibling filter restores the visible side chart Y domain'
  );
  t.equal(
    state.filters[0].lineChart.allTime.value,
    25,
    'removing the sibling filter restores the visible side chart aggregate'
  );

  t.end();
});

test('#visStateReducer -> UPDATE_FILTER_ANIMATION_SPEED', t => {
  const initialState = CloneDeep(StateWFilters.visState);

  const nextState = reducer(initialState, VisStateActions.updateFilterAnimationSpeed(0, 4));

  t.equal(nextState.filters[0].speed, 4, 'should update filter animation speed');

  t.end();
});

test('#visStateReducer -> setFilter.fixedDomain & DynamicDomain & gpu & cpu', async t => {
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

  const datasetSmoothie = (
    await createNewDataEntryMock({
      info: {id: 'smoothie', label: 'queen smoothie'},
      data: {
        rows: testAllData,
        fields: testFields
      }
    })
  ).smoothie;

  // add fixedDomain & gpu filter
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

  const filterId = stateWidthTsFilter.filters[0].id;

  const expectedFilterTs = {
    dataId: ['smoothie'],
    fixedDomain: true,
    id: filterId,
    name: ['gps_data.utc_timestamp'],
    type: 'timeRange',
    fieldIdx: [0],
    domain: [1474070995000, 1474072208000],
    value: [1474071425000, 1474071740000],
    step: 1000,
    plotType: {
      type: 'histogram',
      interval: '15-second',
      aggregation: 'average',
      defaultTimeFormat: 'L  LTS'
    },
    yAxis: null,
    speed: 1,
    mappedValue: [
      1474070995000, 1474071056000, 1474071116000, 1474071178000, 1474071240000, 1474071301000,
      1474071363000, 1474071425000, 1474071489000, 1474071552000, 1474071567000, 1474071614000,
      1474071677000, 1474071740000, 1474071802000, 1474071864000, 1474071928000, 1474071989000,
      1474072051000, 1474072115000, 1474072180000, 1474072203000, 1474072203000, 1474072208000
    ],
    view: FILTER_VIEW_TYPES.enlarged,
    isAnimating: false,
    animationWindow: 'free',
    fieldType: 'timestamp',
    gpu: true,
    gpuChannel: [0],
    defaultTimeFormat: 'L LTS',
    timeBins: {
      smoothie: {
        '15-second': [
          {
            count: 1,
            x0: 1474070985000,
            x1: 1474071000000
          },
          {
            count: 1,
            x0: 1474071045000,
            x1: 1474071060000
          },
          {
            count: 1,
            x0: 1474071105000,
            x1: 1474071120000
          },
          {
            count: 1,
            x0: 1474071165000,
            x1: 1474071180000
          },
          {
            count: 1,
            x0: 1474071240000,
            x1: 1474071255000
          },
          {
            count: 1,
            x0: 1474071300000,
            x1: 1474071315000
          },
          {
            count: 1,
            x0: 1474071360000,
            x1: 1474071375000
          },
          {
            count: 1,
            x0: 1474071420000,
            x1: 1474071435000
          },
          {
            count: 1,
            x0: 1474071480000,
            x1: 1474071495000
          },
          {
            count: 1,
            x0: 1474071540000,
            x1: 1474071555000
          },
          {
            count: 1,
            x0: 1474071555000,
            x1: 1474071570000
          },
          {
            count: 1,
            x0: 1474071600000,
            x1: 1474071615000
          },
          {
            count: 1,
            x0: 1474071675000,
            x1: 1474071690000
          },
          {
            count: 1,
            x0: 1474071735000,
            x1: 1474071750000
          },
          {
            count: 1,
            x0: 1474071795000,
            x1: 1474071810000
          },
          {
            count: 1,
            x0: 1474071855000,
            x1: 1474071870000
          },
          {
            count: 1,
            x0: 1474071915000,
            x1: 1474071930000
          },
          {
            count: 1,
            x0: 1474071975000,
            x1: 1474071990000
          },
          {
            count: 1,
            x0: 1474072050000,
            x1: 1474072065000
          },
          {
            count: 1,
            x0: 1474072110000,
            x1: 1474072125000
          },
          {
            count: 1,
            x0: 1474072170000,
            x1: 1474072185000
          },
          {
            count: 3,
            x0: 1474072200000,
            x1: 1474072215000
          }
        ]
      }
    }
  };

  // cmpFilters(t, expectedFilterTs, stateWidthTsFilter.filters[0]);

  const expectedDatasetSmoothie = {
    ...datasetSmoothie,
    // add filter prop to fields
    fields: datasetSmoothie.fields.map(f =>
      f.name === 'gps_data.utc_timestamp'
        ? {
            ...f,
            filterProps: {
              domain: [1474070995000, 1474072208000],
              step: 1000,
              mappedValue: expectedFilterTs.mappedValue,
              fieldType: 'timestamp',
              type: 'timeRange',
              view: FILTER_VIEW_TYPES.enlarged,
              fixedDomain: true,
              plotType: {},
              value: [1474070995000, 1474072208000],
              gpu: true,
              defaultTimeFormat: 'L LTS'
            }
          }
        : f
    ),
    filterRecord: {
      dynamicDomain: [],
      fixedDomain: [stateWidthTsFilter.filters[0]],
      cpu: [],
      gpu: [stateWidthTsFilter.filters[0]]
    },
    gpuFilter: {
      filterRange: [
        [1474071425000 - 1474070995000, 1474071740000 - 1474070995000],
        [0, 0],
        [0, 0],
        [0, 0]
      ],
      filterValueUpdateTriggers: {
        gpuFilter_0: {name: 'gps_data.utc_timestamp', domain0: 1474070995000},
        gpuFilter_1: null,
        gpuFilter_2: null,
        gpuFilter_3: null
      },
      filterValueAccessor: {
        inputs: [{index: 1}],
        result: [61000, 0, 0, 0]
      }
    },
    // copy everything
    filteredIndex: datasetSmoothie.dataContainer.getPlainIndex(),
    filteredIndexForDomain: datasetSmoothie.dataContainer.getPlainIndex(),
    changedFilters: {
      dynamicDomain: null,
      fixedDomain: {[filterId]: 'value_changed'},
      cpu: null,
      gpu: {[filterId]: 'value_changed'}
    },
    type: '',
    supportedFilterTypes: null,
    disableDataOperation: false
  };

  // check filter by ts
  cmpDataset(t, expectedDatasetSmoothie, stateWidthTsFilter.datasets.smoothie);

  const stateWidthTsAndNameFilter = applyActions(reducer, stateWidthTsFilter, [
    // add ordinal filter
    {action: VisStateActions.addFilter, payload: ['smoothie']},

    // set ordinal filter name
    {
      action: VisStateActions.setFilter,
      payload: [1, 'name', 'date']
    },

    // set ordinal filter value
    {
      action: VisStateActions.setFilter,
      payload: [1, 'value', ['2016-09-24', '2016-10-10']]
    }
  ]);

  const filterId1 = stateWidthTsAndNameFilter.filters[1].id;

  const expectedFilteredDataset = {
    ...stateWidthTsFilter.datasets.smoothie,
    fields: stateWidthTsFilter.datasets.smoothie.fields.map(f =>
      f.name === 'date'
        ? {
            ...f,
            filterProps: {
              domain: ['2016-09-23', '2016-09-24', '2016-10-10'],
              fieldType: 'date',
              type: 'multiSelect',
              value: [],
              gpu: false,
              view: FILTER_VIEW_TYPES.side
            }
          }
        : f
    ),
    gpuFilter: {
      filterRange: [
        [1474071425000 - 1474070995000, 1474071740000 - 1474070995000],
        [0, 0],
        [0, 0],
        [0, 0]
      ],
      filterValueUpdateTriggers: {
        gpuFilter_0: {name: 'gps_data.utc_timestamp', domain0: 1474070995000},
        gpuFilter_1: null,
        gpuFilter_2: null,
        gpuFilter_3: null
      },
      filterValueAccessor: {
        inputs: [{index: 1}],
        result: [61000, 0, 0, 0]
      }
    },
    filterRecord: {
      dynamicDomain: [stateWidthTsAndNameFilter.filters[1]],
      fixedDomain: [stateWidthTsAndNameFilter.filters[0]],
      cpu: [stateWidthTsAndNameFilter.filters[1]],
      gpu: [stateWidthTsAndNameFilter.filters[0]]
    },
    filteredIndex: [7, 8, 9, 10, 11, 12, 17, 18, 19, 20, 21, 22],
    filteredIndexForDomain: [7, 8, 9, 10, 11, 12, 17, 18, 19, 20, 21, 22],
    changedFilters: {
      dynamicDomain: {[filterId1]: 'added'},
      fixedDomain: null,
      cpu: {[filterId1]: 'added'},
      gpu: null
    },
    type: '',
    supportedFilterTypes: null,
    disableDataOperation: false
  };

  cmpDataset(t, expectedFilteredDataset, stateWidthTsAndNameFilter.datasets.smoothie);

  t.end();
});

test('#visStateReducer -> SET_FILTER_PLOT.yAxis', t => {
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
  const initialState = applyActions(reducer, INITIAL_VIS_STATE, [
    {
      action: VisStateActions.updateVisData,
      payload: [payload]
    }
  ]);

  // add filter
  const stateWithFilter = reducer(initialState, VisStateActions.addFilter('smoothie'));
  const filterId = stateWithFilter.filters[0].id;

  // set filter 'name' to timestamp field
  const stateWithFilterName = reducer(
    stateWithFilter,
    VisStateActions.setFilter(0, 'name', 'gps_data.utc_timestamp')
  );

  // find id which is an integer field
  const yAxisField = stateWithFilterName.datasets.smoothie.fields.find(f => f.name === 'uid');

  // set filterPlot yAxis
  const stateWithFilterPlotYAxis = reducer(
    stateWithFilterName,
    VisStateActions.setFilterPlot(0, {yAxis: yAxisField})
  );

  // set aggregation to sum
  const stateWithFilterPlot = reducer(
    stateWithFilterPlotYAxis,
    VisStateActions.setFilterPlot(0, {plotType: {aggregation: 'sum'}})
  );

  const bins = [
    {
      count: 1,
      x0: 1474070985000,
      x1: 1474071000000
    },
    {
      count: 1,
      x0: 1474071045000,
      x1: 1474071060000
    },
    {
      count: 1,
      x0: 1474071105000,
      x1: 1474071120000
    },
    {
      count: 1,
      x0: 1474071165000,
      x1: 1474071180000
    },
    {
      count: 1,
      x0: 1474071240000,
      x1: 1474071255000
    },
    {
      count: 1,
      x0: 1474071300000,
      x1: 1474071315000
    },
    {
      count: 1,
      x0: 1474071360000,
      x1: 1474071375000
    },
    {
      count: 1,
      x0: 1474071420000,
      x1: 1474071435000
    },
    {
      count: 1,
      x0: 1474071480000,
      x1: 1474071495000
    },
    {
      count: 1,
      x0: 1474071540000,
      x1: 1474071555000
    },
    {
      count: 1,
      x0: 1474071555000,
      x1: 1474071570000
    },
    {
      count: 1,
      x0: 1474071600000,
      x1: 1474071615000
    },
    {
      count: 1,
      x0: 1474071675000,
      x1: 1474071690000
    },
    {
      count: 1,
      x0: 1474071735000,
      x1: 1474071750000
    },
    {
      count: 1,
      x0: 1474071795000,
      x1: 1474071810000
    },
    {
      count: 1,
      x0: 1474071855000,
      x1: 1474071870000
    },
    {
      count: 1,
      x0: 1474071915000,
      x1: 1474071930000
    },
    {
      count: 1,
      x0: 1474071975000,
      x1: 1474071990000
    },
    {
      count: 1,
      x0: 1474072050000,
      x1: 1474072065000
    },
    {
      count: 1,
      x0: 1474072110000,
      x1: 1474072125000
    },
    {
      count: 1,
      x0: 1474072170000,
      x1: 1474072185000
    },
    {
      count: 3,
      x0: 1474072200000,
      x1: 1474072215000
    }
  ];

  const expectedFilterWName = {
    ...getDefaultFilter({dataId: 'smoothie', id: filterId}),
    fixedDomain: true,
    name: ['gps_data.utc_timestamp'],
    type: 'timeRange',
    fieldIdx: [0],
    domain: [1474070995000, 1474072208000],
    value: [1474070995000, 1474072208000],
    step: 1000,
    plotType: {
      interval: '15-second',
      defaultTimeFormat: 'L  LTS',
      type: 'lineChart',
      aggregation: 'sum'
    },
    yAxis: yAxisField,
    lineChart: {
      yDomain: [0, 12124],
      xDomain: [1474070985000, 1474072215000],
      interval: '15-second',
      aggregation: 'sum',
      series: {
        lines: [
          [
            {x: 1474070985000, y: 1, delta: 'last', pct: null},
            {x: 1474071045000, y: 2, delta: 'last', pct: 1},
            {x: 1474071105000, y: 3, delta: 'last', pct: 0.5},
            {x: 1474071165000, y: 4, delta: 'last', pct: 0.3333333333333333},
            {x: 1474071240000, y: 5, delta: 'last', pct: 0.25},
            {x: 1474071300000, y: 12124, delta: 'last', pct: 2423.8},
            {x: 1474071360000, y: 222, delta: 'last', pct: -0.9816892114813592},
            {x: 1474071420000, y: 345, delta: 'last', pct: 0.5540540540540541},
            {x: 1474071480000, y: 0, delta: 'last', pct: -1},
            {x: 1474071540000, y: 0, delta: 'last', pct: null},
            {x: 1474071555000, y: 0, delta: 'last', pct: null},
            {x: 1474071600000, y: 0, delta: 'last', pct: null},
            {x: 1474071675000, y: 0, delta: 'last', pct: null},
            {x: 1474071735000, y: 0, delta: 'last', pct: null},
            {x: 1474071795000, y: 0, delta: 'last', pct: null},
            {x: 1474071855000, y: 1, delta: 'last', pct: null},
            {x: 1474071915000, y: 0, delta: 'last', pct: -1},
            {x: 1474071975000, y: 43, delta: 'last', pct: null},
            {x: 1474072050000, y: 4, delta: 'last', pct: -0.9069767441860465},
            {x: 1474072110000, y: 5, delta: 'last', pct: 0.25},
            {x: 1474072170000, y: 0, delta: 'last', pct: -1},
            {x: 1474072200000, y: 13, delta: 'last', pct: null}
          ]
        ],
        markers: []
      },
      yAxis: 'uid',
      title: 'Total of uid',
      fieldType: 'integer',
      allTime: {title: 'All Time Average', value: 580.5454545454545},
      bins
    },
    speed: 1,
    mappedValue: [
      1474070995000, 1474071056000, 1474071116000, 1474071178000, 1474071240000, 1474071301000,
      1474071363000, 1474071425000, 1474071489000, 1474071552000, 1474071567000, 1474071614000,
      1474071677000, 1474071740000, 1474071802000, 1474071864000, 1474071928000, 1474071989000,
      1474072051000, 1474072115000, 1474072180000, 1474072203000, 1474072203000, 1474072208000
    ],
    view: FILTER_VIEW_TYPES.enlarged,
    isAnimating: false,
    animationWindow: 'free',
    fieldType: 'timestamp',
    gpu: true,
    gpuChannel: [0],
    defaultTimeFormat: 'L LTS',
    timeBins: {
      smoothie: {
        '15-second': bins
      }
    }
  };

  t.deepEqual(
    stateWithFilterPlot.filters[0].lineChart.bins,
    stateWithFilterPlot.filters[0].timeBins.smoothie['15-second'],
    'Timebins and lineChart bins should have the same value'
  );

  // stateWithFilterPlot.filters[0].lineChart.bins = [];
  // expectedFilterWName.lineChart.bins = [];
  // test filter
  cmpFilters(t, expectedFilterWName, stateWithFilterPlot.filters[0]);

  // set filterPlot yAxis again
  // const yAxisField2 = stateWithFilterName.datasets.smoothie.fields.find(
  //   f => f.name === 'gps_data.lat'
  // );
  // const stateWithFilterPlot2 = reducer(
  //   stateWithFilterPlot,
  //   VisStateActions.setFilterPlot(0, {yAxis: yAxisField2})
  // );
  // const expectedFilterWName2 = {
  //   ...expectedFilterWName,
  //   yAxis: yAxisField2,
  //   lineChart: {
  //     yDomain: [29.9870074, 90.18377960000001],
  //     xDomain: [1474070985000, 1474072215000],
  //     interval: '15-second',
  //     aggregation: 'sum',
  //     series: {
  //       lines: [
  //         [
  //           {x: 1474070985000, y: 29.9900937, delta: 'last', pct: null},
  //           {x: 1474071045000, y: 29.9927699, delta: 'last', pct: 0.00008923613333024682},
  //           {x: 1474071105000, y: 29.9907261, delta: 'last', pct: -0.00006814308937832221},
  //           {x: 1474071165000, y: 29.9870074, delta: 'last', pct: -0.0001239949972401734},
  //           {x: 1474071240000, y: 29.9923041, delta: 'last', pct: 0.00017663316413490536},
  //           {x: 1474071300000, y: 29.9968249, delta: 'last', pct: 0.00015073200061350596},
  //           {x: 1474071360000, y: 30.0037217, delta: 'last', pct: 0.0002299176670528158},
  //           {x: 1474071420000, y: 30.0116207, delta: 'last', pct: 0.00026326733993142846},
  //           {x: 1474071480000, y: 30.0208925, delta: 'last', pct: 0.0003089403299035078},
  //           {x: 1474071540000, y: 30.0218999, delta: 'last', pct: 0.000033556630603251856},
  //           {x: 1474071555000, y: 30.0229344, delta: 'last', pct: 0.00003445817897751978},
  //           {x: 1474071600000, y: 30.0264237, delta: 'last', pct: 0.0001162211512542309},
  //           {x: 1474071675000, y: 30.0292134, delta: 'last', pct: 0.00009290816741525582},
  //           {x: 1474071735000, y: 30.034391, delta: 'last', pct: 0.00017241876871805346},
  //           {x: 1474071795000, y: 30.0352752, delta: 'last', pct: 0.000029439584774718954},
  //           {x: 1474071855000, y: 30.0395918, delta: 'last', pct: 0.00014371767767252643},
  //           {x: 1474071915000, y: 30.0497387, delta: 'last', pct: 0.00033778421716099144},
  //           {x: 1474071975000, y: 30.0538936, delta: 'last', pct: 0.00013826742526714978},
  //           {x: 1474072050000, y: 30.060911, delta: 'last', pct: 0.0002334938724878657},
  //           {x: 1474072110000, y: 30.060334, delta: 'last', pct: -0.000019194361741060598},
  //           {x: 1474072170000, y: 30.0554663, delta: 'last', pct: -0.0001619310018312477},
  //           {x: 1474072200000, y: 90.18377960000001, delta: 'last', pct: 2.0005782874844305}
  //         ]
  //       ],
  //       markers: []
  //     },
  //     yAxis: 'gps_data.lat',
  //     title: 'Total of gps_data.lat',
  //     fieldType: 'real',
  //     allTime: {title: 'All Time Average', value: 32.757264254545454}
  //   }
  // };
  // // gps_data.lat
  // cmpFilters(t, expectedFilterWName2, stateWithFilterPlot2.filters[0]);
  //
  // // set filterPlot type
  // const stateWithFilterPlotHistogram = reducer(
  //   stateWithFilterPlot2,
  //   VisStateActions.setFilterPlot(0, {plotType: {type: 'histogram'}})
  // );
  // t.deepEqual(
  //   stateWithFilterPlotHistogram.filters[0].plotType,
  //   {interval: '15-second', defaultTimeFormat: 'L  LTS', type: 'histogram', aggregation: 'sum'},
  //   'should set filter plotType to histogram'
  // );

  t.end();
});

test('#visStateReducer -> filter changes refresh other time filter plots', t => {
  const {fields, rows} = processCsvData(`event_time,category,value
2020-01-01 00:00:00,A,10
2020-01-01 01:00:00,A,20
2020-01-01 02:00:00,B,30
2020-01-01 03:00:00,B,40`);
  const payload = [
    {
      info: {id: 'shared', label: 'shared'},
      data: {fields, rows}
    }
  ];

  let state = applyActions(reducer, INITIAL_VIS_STATE, [
    {
      action: VisStateActions.updateVisData,
      payload: [payload]
    }
  ]);
  state = reducer(state, VisStateActions.addFilter('shared'));
  state = reducer(state, VisStateActions.setFilter(0, 'name', 'event_time'));
  state = reducer(state, VisStateActions.addFilter('shared'));
  state = reducer(state, VisStateActions.setFilter(1, 'name', 'event_time'));

  const yAxis = state.datasets.shared.fields.find(field => field.name === 'value');
  state = reducer(state, VisStateActions.setFilterPlot(0, {yAxis}));

  t.deepEqual(state.filters[0].lineChart.yDomain, [10, 40], 'plot starts with all rows');

  const nextState = reducer(
    state,
    VisStateActions.setFilter(1, 'value', [1577836800000, 1577840400000])
  );

  t.deepEqual(
    nextState.filters[0].lineChart.yDomain,
    [10, 20],
    'other time filter plot uses the newly filtered rows'
  );
  t.equal(
    nextState.filters[0].lineChart.allTime.value,
    15,
    'other time filter plot rebuilds its aggregate'
  );

  const restoredState = reducer(nextState, VisStateActions.removeFilter(1));
  t.deepEqual(
    restoredState.filters[0].lineChart.yDomain,
    [10, 40],
    'time filter plot refreshes after removing the other filter'
  );
  t.equal(
    restoredState.filters[0].lineChart.allTime.value,
    25,
    'time filter plot restores its aggregate after removing the other filter'
  );

  const emptyState = reducer(
    nextState,
    VisStateActions.setFilter(1, 'value', [1577837700000, 1577839500000])
  );
  t.deepEqual(
    emptyState.filters[0].lineChart.xDomain,
    [],
    'other time filter plot handles an empty filtered result'
  );

  let categoryState = reducer(restoredState, VisStateActions.addFilter('shared'));
  categoryState = reducer(categoryState, VisStateActions.setFilter(1, 'name', 'category'));
  categoryState = reducer(categoryState, VisStateActions.setFilter(1, 'value', ['A']));
  t.deepEqual(
    categoryState.filters[0].lineChart.yDomain,
    [10, 20],
    'time filter plot refreshes after a CPU category filter changes'
  );

  const categoryRestoredState = reducer(categoryState, VisStateActions.removeFilter(1));
  t.deepEqual(
    categoryRestoredState.filters[0].lineChart.yDomain,
    [10, 40],
    'time filter plot refreshes after removing a CPU category filter'
  );

  let invertedState = reducer(
    categoryRestoredState,
    VisStateActions.setFilter(0, 'inverted', true)
  );
  invertedState = reducer(invertedState, VisStateActions.addFilter('shared'));
  invertedState = reducer(invertedState, VisStateActions.setFilter(1, 'name', 'event_time'));
  invertedState = reducer(
    invertedState,
    VisStateActions.setFilter(1, 'value', [1577836800000, 1577840400000])
  );
  t.deepEqual(
    invertedState.filters[0].lineChart.yDomain,
    [10, 20],
    'inverted CPU time plot still applies a same-field GPU sibling filter'
  );
  t.end();
});

test('#visStateReducer -> sibling changes keep interval time plots self-excluded', t => {
  const {fields, rows} = processCsvData(`start_time,end_time,category,value
2020-01-01 00:00:00,2020-01-01 00:30:00,A,10
2020-01-01 01:00:00,2020-01-01 01:30:00,A,20
2020-01-01 02:00:00,2020-01-01 02:30:00,B,30
2020-01-01 03:00:00,2020-01-01 03:30:00,B,40`);
  const payload = [
    {
      info: {id: 'intervals', label: 'intervals'},
      data: {fields, rows}
    }
  ];

  let state = applyActions(reducer, INITIAL_VIS_STATE, [
    {
      action: VisStateActions.updateVisData,
      payload: [payload]
    }
  ]);
  state = reducer(state, VisStateActions.addFilter('intervals'));
  state = reducer(state, VisStateActions.setFilter(0, 'name', 'start_time'));
  state = reducer(state, VisStateActions.setFilter(0, 'endName', 'end_time'));

  const yAxis = state.datasets.intervals.fields.find(field => field.name === 'value');
  state = reducer(state, VisStateActions.setFilterPlot(0, {yAxis}));
  state = reducer(state, VisStateActions.setFilter(0, 'value', [1577844000000, 1577849400000]));
  t.deepEqual(
    state.filters[0].lineChart.yDomain,
    [10, 40],
    'interval plot excludes both of its own filter channels'
  );

  state = reducer(state, VisStateActions.addFilter('intervals'));
  state = reducer(state, VisStateActions.setFilter(1, 'name', 'category'));
  state = reducer(state, VisStateActions.setFilter(1, 'value', ['A']));
  t.deepEqual(
    state.filters[0].lineChart.yDomain,
    [10, 20],
    'refresh applies the sibling filter without applying the interval filter itself'
  );

  t.end();
});

test('#visStateReducer -> TOGGLE_FILTER_ANIMATION', t => {
  const initialState = CloneDeep(StateWFilters.visState);

  const nextState = reducer(initialState, VisStateActions.toggleFilterAnimation(0));
  t.equal(nextState.filters[0].isAnimating, true, 'should set filter to isAnimating: true');

  t.end();
});

test('#visStateReducer -> SET_FILTER_VIEW', t => {
  const initialState = CloneDeep(StateWFilters.visState);

  const nextState = reducer(initialState, VisStateActions.setFilterView(0, FILTER_VIEW_TYPES.side));

  t.equal(
    nextState.filters[0].view,
    FILTER_VIEW_TYPES.side,
    'should toggle time filter view to be side'
  );

  const nextState2 = reducer(
    nextState,
    VisStateActions.setFilterView(0, FILTER_VIEW_TYPES.enlarged)
  );

  t.equal(
    nextState2.filters[0].view,
    FILTER_VIEW_TYPES.enlarged,
    'should toggle time filter view to be bottom'
  );

  t.end();
});

test('#visStateReducer -> REMOVE_DATASET', t => {
  const initialState = CloneDeep(StateWFilters.visState);
  const nextState = reducer(initialState, VisStateActions.removeDataset('not_me'));

  t.equal(initialState, nextState, 'should return state if datasetKey doesnot exist');
  t.end();
});

test('#visStateReducer -> REMOVE_DATASET w filter and layer', t => {
  const oldState = CloneDeep(StateWFilters.visState);

  const expectedState = {
    ...oldState,
    layers: [oldState.layers[1]],
    filters: [oldState.filters[1]],
    layerData: [oldState.layerData[1]],
    layerOrder: [oldState.layers[1].id],
    datasets: {
      [testGeoJsonDataId]: oldState.datasets[testGeoJsonDataId]
    },
    effects: [],
    effectOrder: [],

    interactionConfig: {
      ...oldState.interactionConfig,
      tooltip: {
        id: 'tooltip',
        label: 'interactions.tooltip',
        enabled: true,
        config: {
          timezone: null,
          compareMode: false,
          compareType: 'absolute',
          fieldsToShow: {
            [testGeoJsonDataId]: [
              {
                name: 'OBJECTID',
                format: null
              },
              {
                name: 'ZIP_CODE',
                format: null
              },
              {
                name: 'ID',
                format: null
              },
              {
                name: 'TRIPS',
                format: null
              },
              {
                name: 'RATE',
                format: null
              }
            ]
          }
        }
      }
    }
  };

  const newReducer = reducer(oldState, VisStateActions.removeDataset(testCsvDataId));

  t.deepEqual(
    Object.keys(newReducer).sort(),
    Object.keys(expectedState).sort(),
    `visState should have same keys`
  );
  Object.keys(expectedState).forEach(key => {
    t.deepEqual(newReducer[key], expectedState[key], `newReducer.${key} should be correct`);
  });

  t.end();
});

test('#visStateReducer -> REMOVE_DATASET w synced filter', t => {
  const initialState = CloneDeep(StateWSyncedTimeFilter.visState);
  const oldFilter = {...initialState.filters[0]};

  const resultState = reducer(initialState, VisStateActions.removeDataset(testCsvDataSlice1Id));

  t.equal(resultState.filters.length, 1, 'should still have 1 filter');
  const expectedFilter = {
    ...expectedSyncedTsFilter,
    id: oldFilter.id,
    dataId: ['test-csv-data-2'],
    name: ['gps_data.utc_timestamp'],
    fieldIdx: [0],
    // reset domain
    domain: [1474071301000, 1474072208000],
    // adjust value
    value: [1474071301000, 1474072188000],
    gpuChannel: [0],
    timeBins: {
      'test-csv-data-2': expectedSyncedTsFilter.timeBins['test-csv-data-2']
    }
  };
  cmpFilters(t, expectedFilter, resultState.filters[0]);

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
      {layers: {}}
    ],
    'should split map'
  );

  t.end();
});

test('#visStateReducer -> SPLIT_MAP: REMOVE_LAYER', t => {
  const layer1 = new PointLayer({id: 'a'});
  const layer2 = new PointLayer({id: 'b'});
  const layers = [layer1, layer2];
  const oldState = {
    layers,
    layerData: [{data: 1}, {data: 2}],
    layerOrder: [layers[1].id, layers[0].id],
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
    ],
    animationConfig: DEFAULT_ANIMATION_CONFIG
  };

  const newReducer = reducer(oldState, VisStateActions.removeLayer('b'));

  t.deepEqual(
    newReducer,
    {
      layers: [layer1],
      layerData: [{data: 1}],
      layerOrder: [layer1.id],
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
      ],
      animationConfig: DEFAULT_ANIMATION_CONFIG
    },
    'should remove layer and layerData in split mode'
  );

  t.end();
});

test('#visStateReducer -> SPLIT_MAP: REMOVE_LAYER. set animation domain', t => {
  const layer1 = new PointLayer({id: 'a'});
  const layer2 = new PointLayer({id: 'b'});
  const layer3 = new TripLayer({id: 't1', isVisible: true});
  const layer4 = new TripLayer({id: 't2', isVisible: true});

  layer3.updateAnimationDomain([1568502710000, 1568502960000]);
  layer4.updateAnimationDomain([1568502810000, 1568503060000]);

  const oldState = {
    layers: [layer1, layer2, layer3, layer4],
    layerData: [{data: 1}, {data: 2}, {data: 3}, {data: 4}],
    layerOrder: [1, 0, 2, 3],
    hoverInfo: null,
    clicked: null,
    splitMaps: [],
    animationConfig: {
      domain: [1568502710000, 1568503060000],
      currentTime: 1568502970000,
      duration: null,
      timeSteps: null
    }
  };

  const newReducer = reducer(oldState, VisStateActions.removeLayer('t1'));
  const expectedAnimationConfig = {
    domain: [1568502810000, 1568503060000],
    currentTime: 1568502970000,
    duration: null,
    timeSteps: null,
    defaultTimeFormat: 'L LTS'
  };

  t.deepEqual(
    newReducer.animationConfig,
    expectedAnimationConfig,
    'should remove animation layer and adjust animation domain'
  );

  const newReducer2 = reducer(oldState, VisStateActions.removeLayer('t2'));
  const expectedAnimationConfig2 = {
    domain: [1568502710000, 1568502960000],
    currentTime: 1568502710000,
    duration: null,
    timeSteps: null,
    defaultTimeFormat: 'L LTS'
  };
  t.deepEqual(
    newReducer2.animationConfig,
    expectedAnimationConfig2,
    'should remove animation layer and adjust animation domain'
  );

  const newReducer3 = reducer(newReducer2, VisStateActions.removeLayer('t1'));
  t.deepEqual(
    newReducer3.animationConfig,
    {
      domain: null,
      currentTime: 1568502710000,
      isAnimating: false,
      duration: null,
      timeSteps: null,
      defaultTimeFormat: null
    },
    'remove last animation layer and set animation config to default'
  );

  t.end();
});

test('#visStateReducer -> SPLIT_MAP: REMOVE_DATASET', t => {
  const oldState = StateWSplitMaps.visState;

  const expectedState = {
    ...oldState,
    layers: [oldState.layers[0]],
    layerData: [oldState.layerData[0]],
    layerOrder: [oldState.layers[0].id],
    datasets: {
      [testCsvDataId]: oldState.datasets[testCsvDataId]
    },
    filters: [],
    effects: [],
    effectOrder: [],
    interactionConfig: {
      ...oldState.interactionConfig,
      tooltip: {
        id: 'tooltip',
        label: 'interactions.tooltip',
        enabled: true,
        config: {
          timezone: null,
          compareMode: false,
          compareType: 'absolute',
          fieldsToShow: {
            [testCsvDataId]: [
              {
                name: 'gps_data.utc_timestamp',
                format: 'L LTS'
              },
              {
                name: 'gps_data.types',
                format: null
              },
              {
                name: 'epoch',
                format: 'L LTS'
              },
              {
                name: 'has_result',
                format: null
              },
              {
                name: 'uid',
                format: null
              }
            ]
          }
        }
      }
    },
    splitMaps: [{layers: {'point-0': false}}, {layers: {'point-0': true}}]
  };

  const newReducer = reducer(oldState, VisStateActions.removeDataset(testGeoJsonDataId));

  t.deepEqual(
    Object.keys(newReducer).sort(),
    Object.keys(expectedState).sort(),
    `visState should have same keys`
  );
  Object.keys(expectedState).forEach(key => {
    t.deepEqual(newReducer[key], expectedState[key], `newReducer.${key} should be correct`);
  });

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

  t.equal(newReducer.layers[1].config.isVisible, true, 'newLayer visibility should be set to true');
  t.equal(
    newReducer.layers[1].config.isConfigActive,
    true,
    'newLayer isConfigActive should be set to true'
  );
  t.equal(newReducer.layers[1].config.dataId, 'puppy', 'newLayer dataId should be set to default');
  t.equal(newReducer.splitMaps.length, 2, 'newLayer was added into splitMaps layers');
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

test('#visStateReducer -> SET_LAYER_ANIMATION_TIME', t => {
  const initialState = StateWTripGeojson.visState;
  const newState = reducer(initialState, VisStateActions.setLayerAnimationTime(1000));

  t.equal(newState.animationConfig.currentTime, 1000, 'should update animation time');
  t.end();
});

test('#visStateReducer -> UPDATE_LAYER_ANIMATION_SPEED', t => {
  const initialState = StateWTripGeojson.visState;
  const newState = reducer(initialState, VisStateActions.updateLayerAnimationSpeed(1.23));

  t.equal(newState.animationConfig.speed, 1.23, 'should update animation speed');

  t.end();
});

test('#visStateReducer -> TOGGLE_LAYER_ANIMATION', t => {
  const initialState = StateWTripGeojson.visState;
  const newState = reducer(initialState, VisStateActions.toggleLayerAnimation());
  t.equal(newState.animationConfig.isAnimating, true, 'should update animationConfig');
  t.end();
});

test('#visStateReducer -> INTERACTION_CONFIG_CHANGE', t => {
  const brushConfig = {
    ...defaultInteractionConfig.brush,
    enabled: true
  };

  const expectedConfig = {
    ...defaultInteractionConfig,
    brush: brushConfig,
    tooltip: {
      ...defaultInteractionConfig.tooltip,
      enabled: false
    },
    geocoder: {
      ...defaultInteractionConfig.geocoder,
      enabled: false
    }
  };

  const nextState = reducer(
    INITIAL_VIS_STATE,
    VisStateActions.interactionConfigChange(brushConfig)
  );

  t.deepEqual(nextState.interactionConfig, expectedConfig, 'should disable tooltip');

  t.end();
});

test('#visStateReducer -> INTERACTION_CONFIG_CHANGE updates geocoder pin color', t => {
  const geocoderLayer = new IconLayer({
    id: GEOCODER_LAYER_ID,
    dataId: GEOCODER_DATASET_NAME,
    color: GEOCODER_ICON_COLOR
  });
  const initialState = {
    ...INITIAL_VIS_STATE,
    layers: [geocoderLayer],
    layerData: [{}]
  };
  const color = [0, 128, 255];
  const geocoderConfig = {
    ...defaultInteractionConfig.geocoder,
    enabled: true,
    config: {
      ...defaultInteractionConfig.geocoder.config,
      color
    }
  };

  const nextState = reducer(initialState, VisStateActions.interactionConfigChange(geocoderConfig));

  t.deepEqual(nextState.interactionConfig.geocoder.config.color, color, 'should store pin color');
  t.deepEqual(nextState.layers[0].config.color, color, 'should update an existing geocoder pin');
  t.end();
});

test('#visStateReducer -> SHOW_DATASET_TABLE', t => {
  const initialState = StateWFiles.visState;
  const nextState = reducer(initialState, VisStateActions.showDatasetTable('abc'));

  t.equal(nextState.editingDataset, 'abc', 'should set editingDataset');
  t.end();
});

test('#visStateReducer -> MAP_CLICK', t => {
  const initialState = StateWFiles.visState;
  const nextState = reducer(
    initialState,
    VisStateActions.onLayerClick({picked: true, object: 'he'})
  );

  t.deepEqual(
    nextState,
    {...nextState, clicked: {picked: true, object: 'he'}},
    'should set clicked'
  );

  const nextState2 = reducer(nextState, VisStateActions.onMapClick());

  t.equal(nextState2.clicked, null, 'should unset clicked');

  t.end();
});

test('#visStateReducer -> MOUSE_MOVE', t => {
  const initialState = StateWFiles.visState;
  const evt = {
    point: [10, 20],
    lngLat: [37, -122]
  };

  const nextState = reducer(initialState, VisStateActions.onMouseMove(evt));

  t.deepEqual(
    nextState.mousePos,
    {
      ...initialState.mousePos,
      mousePosition: [10, 20],
      coordinate: [37, -122]
    },
    'should set mousePos'
  );

  // disable tooltip
  const tooltipConfig = {
    ...defaultInteractionConfig.tooltip,
    enabled: false
  };

  const nextState1 = reducer(nextState, VisStateActions.interactionConfigChange(tooltipConfig));

  const nextState2 = reducer(
    nextState1,
    VisStateActions.onMouseMove({point: [1, 2], lngLat: [90, 90]})
  );

  t.deepEqual(
    nextState2.mousePos,
    {
      ...initialState.mousePos,
      mousePosition: [10, 20],
      coordinate: [37, -122]
    },
    'should not set mousePos'
  );

  t.end();
});

test('#visStateReducer -> LAYER_COLOR_UI_CHANGE. show dropdown', t => {
  const initialState = CloneDeep(StateWFilesFiltersLayerColor.visState);
  const pointLayer = initialState.layers[0];

  const oldColorRange = CloneDeep(pointLayer.config.visConfig.colorRange);
  // show dropdown
  const nextState = reducer(
    initialState,
    VisStateActions.layerColorUIChange(pointLayer, 'color', {
      showDropdown: 0
    })
  );

  const expectedColorUI = {
    color: {
      ...DEFAULT_COLOR_UI,
      showDropdown: 0
    },
    colorRange: DEFAULT_COLOR_UI,
    strokeColorRange: DEFAULT_COLOR_UI
  };

  t.deepEqual(
    nextState.layers[0].config.colorUI,
    expectedColorUI,
    'should update colorUI.showDropdown'
  );
  t.deepEqual(
    nextState.layers[0].config.visConfig.colorRange,
    oldColorRange,
    'should not change colorRange'
  );

  const nextState1 = reducer(
    nextState,
    VisStateActions.layerColorUIChange(pointLayer, 'color', {
      showDropdown: false
    })
  );
  t.deepEqual(
    nextState1.layers[0].config.colorUI,
    {color: DEFAULT_COLOR_UI, colorRange: DEFAULT_COLOR_UI, strokeColorRange: DEFAULT_COLOR_UI},
    'should update colorUI.showDropdown'
  );

  const nextState2 = reducer(
    nextState1,
    VisStateActions.layerColorUIChange(pointLayer, 'colorRange', {
      showDropdown: 0
    })
  );

  const expectedColorUI2 = {
    color: DEFAULT_COLOR_UI,
    strokeColorRange: DEFAULT_COLOR_UI,
    colorRange: {
      ...DEFAULT_COLOR_UI,
      showDropdown: 0,
      colorRangeConfig: {
        colorBlindSafe: false,
        type: 'all',
        steps: 4,
        reversed: false,
        custom: false,
        customBreaks: false
      }
    }
  };
  t.deepEqual(
    nextState2.layers[0].config.colorUI,
    expectedColorUI2,
    'should update colorUI.showDropdown, set colorRangeConfig step and reversed'
  );

  t.end();
});

test('#visStateReducer -> LAYER_COLOR_UI_CHANGE. colorRangeConfig.step', t => {
  const initialState = CloneDeep(StateWFilesFiltersLayerColor.visState);
  const pointLayer = initialState.layers[0];
  const oldColorRange = CloneDeep(pointLayer.config.visConfig.colorRange);

  t.equal(oldColorRange.colors.length, 4, 'old color range should have 4 colors');
  // show dropdown
  const prepareState = reducer(
    initialState,
    VisStateActions.layerColorUIChange(pointLayer, 'colorRange', {
      showDropdown: 0
    })
  );

  // set color range steps
  const nextState = reducer(
    prepareState,
    VisStateActions.layerColorUIChange(pointLayer, 'colorRange', {
      colorRangeConfig: {steps: 6}
    })
  );

  const expectedColorUI = {
    color: DEFAULT_COLOR_UI,
    strokeColorRange: DEFAULT_COLOR_UI,
    colorRange: {
      ...DEFAULT_COLOR_UI,
      showDropdown: 0,
      colorRangeConfig: {
        colorBlindSafe: false,
        type: 'all',
        steps: 6,
        reversed: false,
        custom: false,
        customBreaks: false
      }
    }
  };

  const expectedColorRange = colorPaletteToColorRange(
    KEPLER_COLOR_PALETTES.find(({name}) => name === 'Uber Viz Sequential'),
    {steps: 6, reversed: false}
  );

  t.deepEqual(
    nextState.layers[0].config.colorUI,
    expectedColorUI,
    'should update colorUI.colorRangeConfig.steps'
  );
  t.deepEqual(
    nextState.layers[0].config.visConfig.colorRange,
    expectedColorRange,
    'should update visConfig.colorRange based on step'
  );

  // set color range reverse
  const nextState2 = reducer(
    nextState,
    VisStateActions.layerColorUIChange(nextState.layers[0], 'colorRange', {
      colorRangeConfig: {reversed: true}
    })
  );

  const expectedColorUI2 = {
    color: DEFAULT_COLOR_UI,
    strokeColorRange: DEFAULT_COLOR_UI,
    colorRange: {
      ...DEFAULT_COLOR_UI,
      showDropdown: 0,
      colorRangeConfig: {
        colorBlindSafe: false,
        type: 'all',
        steps: 6,
        reversed: true,
        custom: false,
        customBreaks: false
      }
    }
  };

  const expectedColorRange2 = colorPaletteToColorRange(
    KEPLER_COLOR_PALETTES.find(({name}) => name === 'Uber Viz Sequential'),
    {steps: 6, reversed: true}
  );

  t.deepEqual(
    nextState2.layers[0].config.colorUI,
    expectedColorUI2,
    'should update colorUI.colorRangeConfig.reversed'
  );
  t.deepEqual(
    nextState2.layers[0].config.visConfig.colorRange,
    expectedColorRange2,
    'should update visConfig.colorRange based on reversed'
  );

  // update step when reversed is true
  const nextState3 = reducer(
    nextState,
    VisStateActions.layerColorUIChange(nextState2.layers[0], 'colorRange', {
      colorRangeConfig: {steps: 8}
    })
  );

  const expectedColorUI3 = {
    color: DEFAULT_COLOR_UI,
    strokeColorRange: DEFAULT_COLOR_UI,
    colorRange: {
      ...DEFAULT_COLOR_UI,
      showDropdown: 0,
      colorRangeConfig: {
        colorBlindSafe: false,
        type: 'all',
        steps: 8,
        reversed: true,
        custom: false,
        customBreaks: false
      }
    }
  };

  const expectedColorRange3 = colorPaletteToColorRange(
    KEPLER_COLOR_PALETTES.find(({name}) => name === 'Uber Viz Sequential'),
    {steps: 8, reversed: true}
  );

  t.deepEqual(
    nextState3.layers[0].config.colorUI,
    expectedColorUI3,
    'should update colorUI.colorRangeConfig.steps'
  );
  t.deepEqual(
    nextState3.layers[0].config.visConfig.colorRange,
    expectedColorRange3,
    'should update visConfig.colorRange based on match and set reversed'
  );

  // set to a step that has no match
  const nextState4 = reducer(
    nextState,
    VisStateActions.layerColorUIChange(nextState3.layers[0], 'colorRange', {
      colorRangeConfig: {type: 'diverging'}
    })
  );

  const expectedColorUI4 = {
    color: DEFAULT_COLOR_UI,
    strokeColorRange: DEFAULT_COLOR_UI,
    colorRange: {
      ...DEFAULT_COLOR_UI,
      showDropdown: 0,
      colorRangeConfig: {
        colorBlindSafe: false,
        type: 'diverging',
        steps: 8,
        reversed: true,
        custom: false,
        customBreaks: false
      }
    }
  };
  const expectedColorRange8 = colorPaletteToColorRange(
    KEPLER_COLOR_PALETTES.find(({name}) => name === 'Uber Viz Diverging'),
    {steps: 8, reversed: true}
  );

  t.deepEqual(
    nextState4.layers[0].config.colorUI,
    expectedColorUI4,
    'should update colorUI.colorRangeConfig to step 11'
  );
  t.deepEqual(
    nextState4.layers[0].config.visConfig.colorRange,
    expectedColorRange8,
    'should get first valid visConfig.colorRange when no match'
  );

  t.end();
});

test('#visStateReducer -> LAYER_COLOR_UI_CHANGE. custom Palette', t => {
  const initialState = CloneDeep(StateWFilesFiltersLayerColor.visState);
  const pointLayer = initialState.layers[0];

  const oldColorRange = CloneDeep(pointLayer.config.visConfig.colorRange);
  // show dropdown
  const prepareState = reducer(
    initialState,
    VisStateActions.layerColorUIChange(pointLayer, 'colorRange', {
      showDropdown: 0
    })
  );

  // enable custom
  const nextState = reducer(
    prepareState,
    VisStateActions.layerColorUIChange(pointLayer, 'colorRange', {
      colorRangeConfig: {custom: true}
    })
  );

  const expectedColorUI = {
    color: DEFAULT_COLOR_UI,
    strokeColorRange: DEFAULT_COLOR_UI,
    colorRange: {
      ...DEFAULT_COLOR_UI,
      customPalette: {
        name: 'color.customPalette',
        type: 'custom',
        category: 'Custom',
        colors: oldColorRange.colors
      },
      showDropdown: 0,
      colorRangeConfig: {
        colorBlindSafe: false,
        type: 'all',
        steps: 4,
        reversed: false,
        custom: true,
        customBreaks: false
      }
    }
  };

  t.deepEqual(
    nextState.layers[0].config.colorUI,
    expectedColorUI,
    'should update colorUI.customPalette with current colorRange colors'
  );

  const nextState2 = reducer(
    prepareState,
    VisStateActions.layerColorUIChange(pointLayer, 'colorRange', {
      customPalette: {colors: ['aaa', 'bbb', 'ccc']}
    })
  );

  const expectedColorUI2 = {
    color: DEFAULT_COLOR_UI,
    strokeColorRange: DEFAULT_COLOR_UI,
    colorRange: {
      ...DEFAULT_COLOR_UI,
      customPalette: {
        name: 'color.customPalette',
        type: 'custom',
        category: 'Custom',
        colors: ['aaa', 'bbb', 'ccc']
      },
      showDropdown: 0,
      colorRangeConfig: {
        colorBlindSafe: false,
        type: 'all',
        steps: 4,
        reversed: false,
        custom: true,
        customBreaks: false
      }
    }
  };

  t.deepEqual(
    nextState2.layers[0].config.colorUI,
    expectedColorUI2,
    'should update colorUI.customPalette colors'
  );

  // show sketcher
  const nextState3 = reducer(
    nextState2,
    VisStateActions.layerColorUIChange(pointLayer, 'colorRange', {
      showSketcher: 1
    })
  );

  const expectedColorUI3 = {
    color: DEFAULT_COLOR_UI,
    strokeColorRange: DEFAULT_COLOR_UI,
    colorRange: {
      ...DEFAULT_COLOR_UI,
      showSketcher: 1,
      customPalette: {
        name: 'color.customPalette',
        type: 'custom',
        category: 'Custom',
        colors: ['aaa', 'bbb', 'ccc']
      },
      showDropdown: 0,
      colorRangeConfig: {
        colorBlindSafe: false,
        type: 'all',
        steps: 4,
        reversed: false,
        custom: true,
        customBreaks: false
      }
    }
  };

  t.deepEqual(nextState3.layers[0].config.colorUI, expectedColorUI3, 'should set showSketcher: 1');

  // edit color
  const nextState4 = reducer(
    nextState3,
    VisStateActions.layerColorUIChange(pointLayer, 'colorRange', {
      customPalette: {
        colors: ['bbb', 'ccc', 'aaa']
      }
    })
  );

  const expectedColorUI4 = {
    color: DEFAULT_COLOR_UI,
    strokeColorRange: DEFAULT_COLOR_UI,
    colorRange: {
      ...DEFAULT_COLOR_UI,
      showSketcher: 1,
      customPalette: {
        name: 'color.customPalette',
        type: 'custom',
        category: 'Custom',
        colors: ['bbb', 'ccc', 'aaa']
      },
      showDropdown: 0,
      colorRangeConfig: {
        colorBlindSafe: false,
        type: 'all',
        steps: 4,
        reversed: false,
        custom: true,
        customBreaks: false
      }
    }
  };

  t.deepEqual(
    nextState4.layers[0].config.colorUI,
    expectedColorUI4,
    'should update colorUI.customPalette colors'
  );

  // apply color
  const nextState5 = reducer(
    nextState4,
    VisStateActions.layerVisConfigChange(nextState4.layers[0], {
      colorRange: {
        name: 'color.customPalette',
        type: 'custom',
        category: 'Custom',
        colors: ['bbb', 'ccc', 'aaa']
      }
    })
  );

  // close custom palette
  const nextState6 = reducer(
    nextState5,
    VisStateActions.layerColorUIChange(nextState5.layers[0], 'colorRange', {
      colorRangeConfig: {
        custom: false
      }
    })
  );

  const expectedColorUI6 = {
    color: DEFAULT_COLOR_UI,
    strokeColorRange: DEFAULT_COLOR_UI,
    colorRange: {
      ...DEFAULT_COLOR_UI,
      showSketcher: 1,
      // keep the customPalette
      customPalette: {
        name: 'color.customPalette',
        type: 'custom',
        category: 'Custom',
        colors: ['bbb', 'ccc', 'aaa']
      },
      showDropdown: 0,
      colorRangeConfig: {
        colorBlindSafe: false,
        type: 'all',
        steps: 4,
        reversed: false,
        custom: false,
        customBreaks: false
      }
    }
  };

  t.deepEqual(
    nextState6.layers[0].config.colorUI,
    expectedColorUI6,
    'should set colorRangeConfig.custom false'
  );

  t.deepEqual(
    nextState6.layers[0].config.visConfig.colorRange,
    {
      name: 'color.customPalette',
      type: 'custom',
      category: 'Custom',
      colors: ['bbb', 'ccc', 'aaa']
    },
    'should set visConfig.colorRange'
  );

  // color colorMap and colorLegends to colorRange
  nextState6.layers[0].config.visConfig.colorRange = {
    ...nextState6.layers[0].config.visConfig.colorRange,
    colorLegends: {
      bbb: 'custom legend'
    },
    colorMap: [
      [1, 'bbb'],
      [2, 'ccc'],
      [null, 'aaa']
    ]
  };

  // open it again
  const nextState7 = reducer(
    nextState6,
    VisStateActions.layerColorUIChange(pointLayer, 'colorRange', {
      colorRangeConfig: {
        custom: true
      }
    })
  );

  const expectedColorUI7 = {
    color: DEFAULT_COLOR_UI,
    strokeColorRange: DEFAULT_COLOR_UI,
    colorRange: {
      showSketcher: 1,
      // keep the customPalette
      customPalette: {
        name: 'color.customPalette',
        type: 'custom',
        category: 'Custom',
        colors: ['bbb', 'ccc', 'aaa'],
        colorLegends: {
          bbb: 'custom legend'
        },
        colorMap: [
          [1, 'bbb'],
          [2, 'ccc'],
          [null, 'aaa']
        ]
      },
      showDropdown: 0,
      showColorChart: false,
      colorRangeConfig: {
        colorBlindSafe: false,
        type: 'all',
        steps: 4,
        reversed: false,
        custom: true,
        customBreaks: false
      }
    }
  };

  t.deepEqual(
    nextState7.layers[0].config.colorUI,
    expectedColorUI7,
    'should set colorRangeConfig.custom true'
  );
  t.end();
});

test('#visStateReducer -> LAYER_COLOR_UI_CHANGE. custom breaks', t => {
  const initialState = CloneDeep(StateWFilesFiltersLayerColor.visState);
  const pointLayer = initialState.layers[0];

  const nextState = reducer(
    initialState,
    VisStateActions.layerColorUIChange(pointLayer, 'colorRange', {
      colorRangeConfig: {customBreaks: true}
    })
  );

  // Explain: with redesigned color range using chormajs/d3, create customBreaks
  // will lead to customPalette, which won't be overrided by predefined colorPalette
  const expectedColorUI = {
    color: DEFAULT_COLOR_UI,
    strokeColorRange: DEFAULT_COLOR_UI,
    colorRange: {
      ...DEFAULT_COLOR_UI,
      customPalette: {
        name: 'color.customPalette',
        type: 'custom',
        category: 'Custom',
        colors: ['#00939C', '#6BB5B9', '#AAD7D9', '#E6FAFA'],
        colorMap: [
          ['driver_analytics', '#00939C'],
          ['driver_analytics_0', '#6BB5B9'],
          ['driver_gps', '#AAD7D9']
        ]
      },
      colorRangeConfig: {
        type: 'all',
        colorBlindSafe: false,
        steps: 6,
        reversed: false,
        custom: false,
        customBreaks: true
      }
    }
  };

  t.deepEqual(
    nextState.layers[0].config.colorUI,
    expectedColorUI,
    'should set customBreaks: true and update colorUI.customPalette with default colorMap'
  );

  t.end();
});

test('#visStateReducer -> setFeatures/delete', t => {
  const expectedFeatures = [mockPolygonFeature];
  let newReducer = reducer(INITIAL_VIS_STATE, VisStateActions.setFeatures([mockPolygonFeature]));

  t.deepEqual(newReducer.editor.features, expectedFeatures, 'should add new feature');

  newReducer = reducer(newReducer, VisStateActions.deleteFeature(mockPolygonFeature));

  t.deepEqual(newReducer.editor.features, [], 'Should not have features');

  t.end();
});

test('#visStateReducer -> POLYGON: Add/Remove new polygon feature', t => {
  const expectedFeatures = [mockPolygonFeature];
  let newReducer = reducer(INITIAL_VIS_STATE, VisStateActions.setFeatures([mockPolygonFeature]));

  t.deepEqual(newReducer.editor.features, expectedFeatures, 'should add new feature');

  newReducer = reducer(newReducer, VisStateActions.setSelectedFeature(mockPolygonFeature));

  const updatedFeature = {
    ...mockPolygonFeature,
    geometry: {
      ...mockPolygonFeature.geometry,
      coordinates: [
        [
          [12.0, 30.0],
          [12.0, 36.0],
          [12.5, 36.0],
          [12.0, 30.0]
        ]
      ]
    }
  };

  newReducer = reducer(newReducer, VisStateActions.setFeatures([updatedFeature]));

  t.deepEqual(
    newReducer.editor.selectedFeature.id,
    mockPolygonFeature.id,
    'should set selected feature'
  );

  newReducer = reducer(newReducer, VisStateActions.deleteFeature(mockPolygonFeature));

  t.deepEqual(
    newReducer.editor,
    {
      features: [],
      selectedFeature: null,
      selectionContext: undefined,
      visible: true,
      mode: 'EDIT_VERTEX'
    },
    'Should remove existing feature and set selected feature to null'
  );

  t.end();
});

test('#visStateReducer -> POLYGON: Create polygon filter', t => {
  const state = {
    ...INITIAL_VIS_STATE
  };

  const datasets = [
    {
      data: {
        fields: [
          {
            name: 'start_point_lat',
            format: '',
            fieldIdx: 0,
            type: 'real',
            analyzerType: 'FLOAT'
          },
          {
            name: 'start_point_lng',
            format: '',
            fieldIdx: 1,
            type: 'real',
            analyzerType: 'FLOAT'
          },
          {
            name: 'end_point_lat',
            format: '',
            fieldIdx: 2,
            type: 'real',
            analyzerType: 'FLOAT'
          },
          {
            name: 'end_point_lng',
            format: '',
            fieldIdx: 3,
            type: 'real',
            analyzerType: 'FLOAT'
          }
        ],
        rows: mockPolygonData.data
      },
      info: {
        label: 'test.csv',
        size: 144
      }
    }
  ];

  const options = {
    centerMap: true,
    keepExistingConfig: false
  };

  // visStateUpdateVisDataUpdater - creates 4 layers
  let newReducer = applyActions(reducer, state, [
    {
      action: VisStateActions.updateVisData,
      payload: [datasets, options, {}]
    }
  ]);

  // add new polygon feature
  newReducer = reducer(newReducer, VisStateActions.setFeatures([mockPolygonFeature]));

  // set selected feature
  newReducer = reducer(newReducer, VisStateActions.setSelectedFeature(mockPolygonFeature));

  // set it as filter
  newReducer = reducer(
    newReducer,
    VisStateActions.setPolygonFilterLayer(newReducer.layers[0], mockPolygonFeature)
  );

  const newFilter = newReducer.filters[0];

  const firstDataset = Object.keys(newReducer.datasets)[0];
  const expectedFilter = {
    id: newFilter.id,
    dataId: [firstDataset],
    enabled: true,
    fixedDomain: true,
    view: FILTER_VIEW_TYPES.side,
    isAnimating: false,
    animationWindow: 'free',
    speed: 1,
    name: [],
    type: 'polygon',
    fieldIdx: [],
    domain: null,
    value: {
      ...mockPolygonFeature,
      properties: {
        ...mockPolygonFeature.properties,
        isVisible: true,
        filterId: newFilter.id
      }
    },
    plotType: {type: 'histogram'},
    yAxis: null,
    layerId: [newReducer.layers[0].id],
    gpu: false
  };

  t.deepEqual(newFilter, expectedFilter, 'Should have created a polygon filter');

  t.equal(newReducer.layerData[0].data.length, 2, 'Layer Point 1 should only show 2 points');

  t.equal(
    newReducer.layerData[1].data.length,
    4,
    'Layer Point 2 should show all 4 points (not targeted by filter)'
  );

  const filterFeature = newReducer.filters[0].value;

  // set polygon filter for the second layer
  newReducer = reducer(
    newReducer,
    VisStateActions.setPolygonFilterLayer(newReducer.layers[1], filterFeature)
  );

  t.equal(newReducer.filters.length, 1, 'Should still have 1 polygon filter');

  t.equal(newReducer.filters[0].layerId.length, 2, 'Should have two values in filter.layerId');

  t.equal(
    newReducer.layerData[0].data.length,
    2,
    'Layer Point 1 should show 2 points (filtered by its own position)'
  );

  t.equal(
    newReducer.layerData[1].data.length,
    0,
    'Layer Point 2 should show 0 points (end positions are outside polygon)'
  );

  // Adding a new dataset - creates extra 4 layers
  newReducer = applyActions(reducer, newReducer, [
    {
      action: VisStateActions.updateVisData,
      payload: [datasets, options, {}]
    }
  ]);

  t.equal(newReducer.layerData[4].data.length, 4, 'Layer Point 5 should full data');

  // Set polygon for a different dataset layer
  newReducer = reducer(
    newReducer,
    VisStateActions.setPolygonFilterLayer(newReducer.layers[4], filterFeature)
  );

  t.equal(newReducer.filters[0].layerId.length, 3, 'Should 3 values in filter.layerId');

  t.equal(newReducer.filters[0].dataId.length, 2, 'Should have two values in filter.dataId');

  t.equal(newReducer.layerData[4].data.length, 2, 'Layer Point 5 should 2 points because filtered');

  // Remove second layer from filter
  newReducer = reducer(
    newReducer,
    VisStateActions.setPolygonFilterLayer(newReducer.layers[1], filterFeature)
  );

  t.equal(newReducer.filters[0].layerId.length, 2, 'Should 3 values in filter.layerId');

  t.equal(newReducer.filters[0].dataId.length, 2, 'Should have two values in filter.dataId');

  t.equal(
    newReducer.layerData[0].data.length,
    2,
    'Layer Point 1 show 2 points because it is still filtered'
  );

  t.equal(newReducer.layerData[4].data.length, 2, 'Layer Point 5 should 2 points because filtered');

  t.equal(
    newReducer.layerData[1].data.length,
    4,
    'Layer Point 2 should show full data because it was removed from filter'
  );

  t.end();
});

test('#visStateReducer -> POLYGON: native GeoArrow MultiPoint membership', async t => {
  const previousMaxBatches = getApplicationConfig().maxArrowBatches;
  const polygon = {
    type: 'Feature',
    id: 'east',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-98, 39],
          [-95, 39],
          [-95, 41],
          [-98, 41],
          [-98, 39]
        ]
      ]
    }
  };
  const coordinates = [
    [
      [-103, 40],
      [-102, 40]
    ], // outside
    [],
    [
      [-110, 40],
      [-97, 40]
    ], // only the second point is inside
    [
      [-97, 40],
      [-96, 40]
    ], // both inside, in the later batch
    [
      [NaN, 40],
      [Infinity, 40]
    ],
    null
  ];
  const values = [10, 50, 20, 90, 30, 40];
  const pointType = new arrow.FixedSizeList(2, new arrow.Field('xy', new arrow.Float64()));
  const multiPointType = new arrow.List(new arrow.Field('points', pointType));
  const makeTable = (rows, numbers, type, extension) => {
    const table = new arrow.Table({
      geometry: arrow.vectorFromArray(rows, type),
      value: arrow.vectorFromArray(numbers, new arrow.Float64())
    });
    table.schema.fields[0].metadata.set('ARROW:extension:name', extension);
    return table;
  };
  const multiPointTable = (rows, numbers) =>
    makeTable(rows, numbers, multiPointType, 'geoarrow.multipoint');
  const cases = [
    {
      name: 'single batch MultiPoint',
      table: multiPointTable(coordinates, values),
      batches: [6],
      expected: [2, 3]
    },
    {
      name: 'multiple batch MultiPoint',
      table: multiPointTable(coordinates.slice(0, 3), values.slice(0, 3)).concat(
        multiPointTable(coordinates.slice(3), values.slice(3))
      ),
      batches: [3, 3],
      expected: [2, 3]
    },
    {
      name: 'separated-coordinate MultiPoint',
      table: makeTable(
        coordinates.map(points => points?.map(([x, y]) => ({x, y})) ?? null),
        values,
        new arrow.List(
          new arrow.Field(
            'points',
            new arrow.Struct([
              new arrow.Field('x', new arrow.Float64()),
              new arrow.Field('y', new arrow.Float64())
            ])
          )
        ),
        'geoarrow.multipoint'
      ),
      batches: [6],
      expected: [2, 3]
    },
    {
      name: 'native Point control',
      table: makeTable(
        [
          [-103, 40],
          [-97, 40]
        ],
        [10, 90],
        pointType,
        'geoarrow.point'
      ),
      batches: [2],
      expected: [1]
    },
    {
      name: 'GeoJSON MultiPoint control',
      data: processGeojson({
        type: 'FeatureCollection',
        features: coordinates.slice(0, 4).map((coords, index) => ({
          type: 'Feature',
          properties: {value: values[index]},
          geometry: {type: 'MultiPoint', coordinates: coords}
        }))
      }),
      expected: [2, 3]
    }
  ];
  initApplicationConfig({maxArrowBatches: 2});
  try {
    for (const fixture of cases) {
      const dataset = new KeplerTable({info: {id: 'points'}, color: [0, 0, 0]});
      // Round-trip IPC, then use the same processor/table import as a file upload.
      const table = fixture.table && arrow.tableFromIPC(arrow.tableToIPC(fixture.table, 'file'));
      await dataset.importData({data: table ? processArrowBatches(table.batches) : fixture.data});
      const columnMode = table ? 'geoarrow' : 'geojson';
      const layer = new PointLayer({id: 'points-layer', dataId: 'points', columnMode});
      const geometryField = dataset.fields.find(field => field.type === columnMode);
      layer.config.columns[columnMode] = {
        value: geometryField.name,
        fieldIdx: geometryField.fieldIdx
      };
      const datasets = {points: dataset};
      layer.updateLayerDomain(datasets);
      const initialData = layer.formatLayerData(datasets);
      const readSource = () =>
        table
          ? Array.from(arrow.tableToIPC(dataset.dataContainer.getTable(), 'file'))
          : CloneDeep(dataset.dataContainer.flattenData());
      const originalValues = readSource();
      const allRows = dataset.dataContainer.getPlainIndex();
      let state = {
        ...INITIAL_VIS_STATE,
        datasets,
        layers: [layer],
        layerData: [initialData],
        layerOrder: [layer.id]
      };
      if (table) {
        t.deepEqual(
          dataset.dataContainer.getTable().batches.map(batch => batch.numRows),
          fixture.batches,
          `${fixture.name}: retains input batches`
        );
      }
      state = reducer(state, VisStateActions.setPolygonFilterLayer(layer, polygon));
      t.deepEqual(
        state.datasets.points.filteredIndexByLayer[layer.id],
        fixture.expected,
        `${fixture.name}: retains any valid inside point, rejects outside/empty/invalid rows`
      );
      t.deepEqual(state.datasets.points.filteredIndex, allRows, 'polygon membership is per layer');
      if (table) {
        // Test the layer's row mask independently of the separate #3879 exploded-batch fix.
        t.deepEqual(
          Array.from(state.layers[0].filteredIndex),
          allRows.map(index => Number(fixture.expected.includes(index))),
          `${fixture.name}: sends matching row mask to the Arrow layer`
        );
      } else {
        t.deepEqual(
          state.layerData[0].data.map(point => point.index),
          [2, 2, 3, 3],
          'GeoJSON control retains both points of a partially matching feature'
        );
      }
      state = reducer(state, VisStateActions.removeFilter(0));
      t.deepEqual(state.datasets.points.filteredIndexByLayer, {}, 'clearing removes layer filter');
      if (table) {
        t.deepEqual(
          Array.from(state.layers[0].filteredIndex),
          allRows.map(() => 1),
          'restores all rows'
        );
      } else {
        t.equal(state.layerData[0].data.length, 6, 'restores all nonempty GeoJSON points');
      }
      t.deepEqual(readSource(), originalValues, 'source values are unchanged');
    }
  } finally {
    initApplicationConfig({maxArrowBatches: previousMaxBatches});
  }
  t.end();
});

test('#visStateReducer -> POLYGON: unselecting all layers returns sketch', t => {
  const initialState = CloneDeep(StateWFiles.visState);
  const layer = initialState.layers[0];
  let state = reducer(initialState, VisStateActions.setFeatures([mockPolygonFeature]));
  state = reducer(state, VisStateActions.setSelectedFeature(mockPolygonFeature));
  state = reducer(state, VisStateActions.setPolygonFilterLayer(layer, mockPolygonFeature));

  t.equal(state.filters.length, 1, 'Should create a polygon filter');
  t.equal(state.editor.features.length, 0, 'Sketch should move into the filter');

  const filterFeature = state.filters[0].value;
  state = reducer(state, VisStateActions.setPolygonFilterLayer(layer, filterFeature));

  t.equal(state.filters.length, 0, 'Should remove the filter when no layers remain');
  t.equal(state.editor.features.length, 1, 'Should return the polygon to sketches');
  t.notOk(state.editor.features[0].properties.filterId, 'Returned sketch should not be a filter');
  t.equal(
    state.editor.selectedFeature.id,
    mockPolygonFeature.id,
    'Should keep the polygon selected'
  );
  t.end();
});

test('#visStateReducer -> POLYGON: Toggle filter feature', t => {
  const state = {
    ...INITIAL_VIS_STATE
  };

  const datasets = [
    {
      data: {
        fields: [
          {
            name: 'start_point_lat',
            format: '',
            fieldIdx: 0,
            type: 'real',
            analyzerType: 'FLOAT'
          },
          {
            name: 'start_point_lng',
            format: '',
            fieldIdx: 1,
            type: 'real',
            analyzerType: 'FLOAT'
          },
          {
            name: 'end_point_lat',
            format: '',
            fieldIdx: 2,
            type: 'real',
            analyzerType: 'FLOAT'
          },
          {
            name: 'end_point_lng',
            format: '',
            fieldIdx: 3,
            type: 'real',
            analyzerType: 'FLOAT'
          }
        ],
        rows: mockPolygonData.data
      },
      info: {
        label: 'test.csv',
        size: 144,
        id: 'puppy'
      }
    },
    {
      data: {
        fields: [
          {
            name: 'start_point_lat',
            format: '',
            fieldIdx: 0,
            type: 'real',
            analyzerType: 'FLOAT'
          },
          {
            name: 'start_point_lng',
            format: '',
            fieldIdx: 1,
            type: 'real',
            analyzerType: 'FLOAT'
          },
          {
            name: 'end_point_lat',
            format: '',
            fieldIdx: 2,
            type: 'real',
            analyzerType: 'FLOAT'
          },
          {
            name: 'end_point_lng',
            format: '',
            fieldIdx: 3,
            type: 'real',
            analyzerType: 'FLOAT'
          }
        ],
        rows: mockPolygonData.data
      },
      info: {
        label: 'test.csv',
        size: 144,
        id: 'cat'
      }
    }
  ];

  const options = {
    centerMap: true,
    keepExistingConfig: false
  };

  // visStateUpdateVisDataUpdater - creates 4 layers
  let newReducer = applyActions(reducer, state, [
    {
      action: VisStateActions.updateVisData,
      payload: [datasets, options, {}]
    }
  ]);

  newReducer = reducer(newReducer, VisStateActions.addLayer());

  t.equal(newReducer.layers.length, 9, 'Should have created a new layer');

  // add new polygon feature
  newReducer = reducer(newReducer, VisStateActions.setFeatures([mockPolygonFeature]));

  // set selected feature
  newReducer = reducer(newReducer, VisStateActions.setSelectedFeature(mockPolygonFeature));

  // set it as filter
  newReducer = reducer(
    newReducer,
    VisStateActions.setPolygonFilterLayer(newReducer.layers[0], mockPolygonFeature)
  );

  const newFilter = newReducer.filters[0];

  const expectedFilter = {
    id: newFilter.id,
    dataId: ['puppy'],
    enabled: true,
    fixedDomain: true,
    view: FILTER_VIEW_TYPES.side,
    isAnimating: false,
    animationWindow: 'free',
    speed: 1,
    name: [],
    type: 'polygon',
    fieldIdx: [],
    domain: null,
    value: {
      ...mockPolygonFeature,
      properties: {
        ...mockPolygonFeature.properties,
        isVisible: true,
        filterId: newFilter.id
      }
    },
    plotType: {type: 'histogram'},
    yAxis: null,
    layerId: [newReducer.layers[0].id],
    gpu: false
  };

  t.deepEqual(newFilter, expectedFilter, 'Should have created a polygon filter');

  let filterFeature = newReducer.filters[0].value;

  t.deepEqual(
    filterFeature.properties.isVisible,
    true,
    'Should have feature visibility set to true'
  );
  t.deepEqual(
    newReducer.datasets.puppy.filteredIndex,
    [0, 1, 2, 3],
    'The dataset filteredIndex should not be affected by polygon filters'
  );
  t.deepEqual(
    newReducer.datasets.puppy.filteredIndexByLayer[newReducer.layers[0].id],
    [0, 2],
    'Should have per-layer polygon filtered index'
  );
  t.equal(
    newReducer.layerData[0].data.length,
    2,
    'Targeted layer should show polygon-filtered points'
  );

  newReducer = reducer(newReducer, VisStateActions.toggleFilterFeature(0));

  filterFeature = newReducer.filters[0].value;
  t.deepEqual(filterFeature.properties.isVisible, false, 'Should hide filter feature');
  t.deepEqual(newReducer.filters[0].enabled, false, 'Should disable the filter');
  t.deepEqual(
    newReducer.datasets.puppy.filteredIndex,
    [0, 1, 2, 3],
    "The polygon filter shouldn't be applied"
  );
  t.deepEqual(
    newReducer.datasets.puppy.filteredIndexByLayer,
    {},
    'Per-layer polygon filtered index should be cleared when filter is disabled'
  );
  t.equal(
    newReducer.layerData[0].data.length,
    4,
    'Targeted layer should restore full data when polygon filter is disabled'
  );

  t.end();
});

test('#visStateReducer -> APPLY_CPU_FILTER with polygon filter', t => {
  const state = {
    ...INITIAL_VIS_STATE
  };

  const datasets = [
    {
      data: {
        fields: [
          {
            name: 'start_point_lat',
            format: '',
            fieldIdx: 0,
            type: 'real',
            analyzerType: 'FLOAT'
          },
          {
            name: 'start_point_lng',
            format: '',
            fieldIdx: 1,
            type: 'real',
            analyzerType: 'FLOAT'
          },
          {
            name: 'end_point_lat',
            format: '',
            fieldIdx: 2,
            type: 'real',
            analyzerType: 'FLOAT'
          },
          {
            name: 'end_point_lng',
            format: '',
            fieldIdx: 3,
            type: 'real',
            analyzerType: 'FLOAT'
          }
        ],
        rows: mockPolygonData.data
      },
      info: {
        label: 'test.csv',
        size: 144,
        id: 'puppy'
      }
    }
  ];

  let newReducer = applyActions(reducer, state, [
    {
      action: VisStateActions.updateVisData,
      payload: [datasets, {centerMap: true, keepExistingConfig: false}, {}]
    }
  ]);

  newReducer = reducer(newReducer, VisStateActions.setFeatures([mockPolygonFeature]));
  newReducer = reducer(newReducer, VisStateActions.setSelectedFeature(mockPolygonFeature));
  newReducer = reducer(
    newReducer,
    VisStateActions.setPolygonFilterLayer(newReducer.layers[0], mockPolygonFeature)
  );

  const layerId = newReducer.layers[0].id;
  t.deepEqual(
    newReducer.datasets.puppy.filteredIndex,
    [0, 1, 2, 3],
    'dataset filteredIndex should ignore polygon filters'
  );
  t.deepEqual(
    newReducer.datasets.puppy.filteredIndexByLayer[layerId],
    [0, 2],
    'per-layer index should keep rows inside the polygon'
  );

  newReducer = reducer(newReducer, VisStateActions.applyCPUFilter('puppy'));

  t.deepEqual(
    newReducer.datasets.puppy.filteredIdxCPU,
    [0, 2],
    'filtered export should apply polygon filters via per-layer indices'
  );

  // Targeting a second layer whose positions are outside the polygon:
  // export should be the union of both layers' visible rows.
  newReducer = reducer(
    newReducer,
    VisStateActions.setPolygonFilterLayer(newReducer.layers[1], mockPolygonFeature)
  );
  newReducer = reducer(newReducer, VisStateActions.applyCPUFilter('puppy'));

  t.deepEqual(
    newReducer.datasets.puppy.filteredIndexByLayer[newReducer.layers[1].id],
    [],
    'second layer should have no rows inside the polygon'
  );
  t.deepEqual(
    newReducer.datasets.puppy.filteredIdxCPU,
    [0, 2],
    'filtered export should keep the union of polygon-visible rows across targeted layers'
  );

  t.end();
});

test('#visStateReducer -> POLYGON: delete polygon filter', t => {
  const state = {
    ...INITIAL_VIS_STATE
  };

  const datasets = [
    {
      data: {
        fields: [
          {
            name: 'start_point_lat',
            format: '',
            fieldIdx: 0,
            type: 'real',
            analyzerType: 'FLOAT'
          },
          {
            name: 'start_point_lng',
            format: '',
            fieldIdx: 1,
            type: 'real',
            analyzerType: 'FLOAT'
          },
          {
            name: 'end_point_lat',
            format: '',
            fieldIdx: 2,
            type: 'real',
            analyzerType: 'FLOAT'
          },
          {
            name: 'end_point_lng',
            format: '',
            fieldIdx: 3,
            type: 'real',
            analyzerType: 'FLOAT'
          }
        ],
        rows: mockPolygonData.data
      },
      info: {
        label: 'test.csv',
        size: 144,
        id: 'puppy'
      }
    },
    {
      data: {
        fields: [
          {
            name: 'start_point_lat',
            format: '',
            fieldIdx: 0,
            type: 'real',
            analyzerType: 'FLOAT'
          },
          {
            name: 'start_point_lng',
            format: '',
            fieldIdx: 1,
            type: 'real',
            analyzerType: 'FLOAT'
          },
          {
            name: 'end_point_lat',
            format: '',
            fieldIdx: 2,
            type: 'real',
            analyzerType: 'FLOAT'
          },
          {
            name: 'end_point_lng',
            format: '',
            fieldIdx: 3,
            type: 'real',
            analyzerType: 'FLOAT'
          }
        ],
        rows: mockPolygonData.data
      },
      info: {
        label: 'test.csv',
        size: 144,
        id: 'cat'
      }
    }
  ];

  const options = {
    centerMap: true,
    keepExistingConfig: false
  };

  // visStateUpdateVisDataUpdater - creates 4 layers
  let newReducer = applyActions(reducer, state, [
    {
      action: VisStateActions.updateVisData,
      payload: [datasets, options, {}]
    }
  ]);

  newReducer = reducer(newReducer, VisStateActions.addLayer());

  t.equal(newReducer.layers.length, 9, 'Should have created a new layer');

  // add new polygon feature
  newReducer = reducer(newReducer, VisStateActions.setFeatures([mockPolygonFeature]));

  // set selected feature
  newReducer = reducer(newReducer, VisStateActions.setSelectedFeature(mockPolygonFeature));

  // set it as filter
  newReducer = reducer(
    newReducer,
    VisStateActions.setPolygonFilterLayer(newReducer.layers[0], mockPolygonFeature)
  );

  // Update filters using setFilter
  newReducer = reducer(newReducer, VisStateActions.setFilter(0, 'layerId', []));

  t.deepEqual(newReducer.filters[0].layerId, [], 'Should have removed layers from filter');

  t.deepEqual(newReducer.filters[0].dataId, [], 'Should have removed datasets from filter');

  // unset it as filter
  newReducer = reducer(newReducer, VisStateActions.removeFilter(0));

  t.deepEqual(newReducer.filters, [], 'Should have removed the created polygon filter');

  // deleting the filter will also delete the feature
  t.deepEqual(newReducer.editor.features.length, 0, 'Should have removed the feature');

  t.end();
});

test('#visStateReducer -> POLYGON: reload saved geojson map keeps filtered layer data', t => {
  const appState = CloneDeep(StateWFiles);
  const geojsonLayer = appState.visState.layers.find(l => l.type === 'geojson');
  t.ok(geojsonLayer, 'should have a geojson layer');

  const bounds = geojsonLayer.meta.bounds || [-122.5, 37.7, -122.3, 37.9];
  const pad = 1;
  const coveringPolygon = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [bounds[0] - pad, bounds[1] - pad],
          [bounds[0] - pad, bounds[3] + pad],
          [bounds[2] + pad, bounds[3] + pad],
          [bounds[2] + pad, bounds[1] - pad],
          [bounds[0] - pad, bounds[1] - pad]
        ]
      ]
    },
    properties: {
      renderType: 'Polygon',
      isClosed: true,
      isVisible: true
    },
    id: 'reload-polygon-filter'
  };

  const filteredState = reducer(
    appState.visState,
    VisStateActions.setPolygonFilterLayer(geojsonLayer, coveringPolygon)
  );

  const layerIdx = filteredState.layers.findIndex(l => l.id === geojsonLayer.id);
  const expectedCount = filteredState.layerData[layerIdx].data.length;
  t.ok(expectedCount > 0, 'geojson layer should have polygon-filtered features before save');

  const saved = SchemaManager.save({...appState, visState: filteredState});
  const loaded = SchemaManager.load(saved);

  const reloaded = applyActions(reducer, INITIAL_VIS_STATE, [
    {action: VisStateActions.updateVisData, payload: [loaded.datasets, {}, loaded.config]}
  ]);

  const reloadedIdx = reloaded.layers.findIndex(l => l.id === geojsonLayer.id);
  t.ok(
    reloaded.filters.some(f => f.type === 'polygon'),
    'should restore the polygon filter'
  );
  t.equal(
    reloaded.layerData[reloadedIdx].data.length,
    expectedCount,
    'reloaded geojson layer should show polygon-filtered features without toggling the filter'
  );
  t.equal(
    reloaded.datasets[geojsonLayer.config.dataId].filteredIndexByLayer[geojsonLayer.id].length,
    expectedCount,
    'reloaded per-layer polygon index should match layer data'
  );

  t.end();
});

test('#visStateReducer -> POLYGON: setPolygonFilterLayer: H3', t => {
  const initialState = CloneDeep(StateWH3Layer).visState;
  const newState = reducer(
    initialState,
    VisStateActions.setPolygonFilterLayer(initialState.layers[0], mockPolygonFeature2)
  );

  const expectedFilteredIndex = [1, 3, 5, 8];
  t.deepEqual(
    newState.datasets['190vdll3di'].filteredIndexByLayer[newState.layers[0].id],
    expectedFilteredIndex,
    'should have per-layer polygon filtered index for h3 layer'
  );
  t.deepEqual(
    newState.layerData[0].data.map(d => d.index),
    [1, 3, 5, 8],
    'should filter layer data'
  );
  t.end();
});

function loadDualLonLatPolygonState() {
  const datasets = [
    {
      data: {
        fields: [
          {
            name: 'start_point_lat',
            format: '',
            fieldIdx: 0,
            type: 'real',
            analyzerType: 'FLOAT'
          },
          {
            name: 'start_point_lng',
            format: '',
            fieldIdx: 1,
            type: 'real',
            analyzerType: 'FLOAT'
          },
          {
            name: 'end_point_lat',
            format: '',
            fieldIdx: 2,
            type: 'real',
            analyzerType: 'FLOAT'
          },
          {
            name: 'end_point_lng',
            format: '',
            fieldIdx: 3,
            type: 'real',
            analyzerType: 'FLOAT'
          }
        ],
        rows: mockDualLonLatRows
      },
      info: {
        label: 'trips.csv',
        size: 144,
        id: 'trips'
      }
    }
  ];

  return applyActions(reducer, {...INITIAL_VIS_STATE}, [
    {
      action: VisStateActions.updateVisData,
      payload: [datasets, {centerMap: true, keepExistingConfig: false}, {}]
    }
  ]);
}

function pointLayerByLat(state, latField) {
  return state.layers.find(l => l.type === 'point' && l.config.columns?.lat?.value === latField);
}

function layerDataIndexes(state, layer) {
  return state.layerData[state.layers.indexOf(layer)].data.map(d => d.index);
}

test('#visStateReducer -> POLYGON: independent polygons on two layers', t => {
  let state = loadDualLonLatPolygonState();
  const startLayer = pointLayerByLat(state, 'start_point_lat');
  const endLayer = pointLayerByLat(state, 'end_point_lat');

  state = reducer(
    state,
    VisStateActions.setFeatures([mockStartRegionPolygon, mockEndRegionPolygon])
  );
  state = reducer(state, VisStateActions.setSelectedFeature(mockStartRegionPolygon));
  state = reducer(state, VisStateActions.setPolygonFilterLayer(startLayer, mockStartRegionPolygon));
  state = reducer(state, VisStateActions.setSelectedFeature(mockEndRegionPolygon));
  state = reducer(state, VisStateActions.setPolygonFilterLayer(endLayer, mockEndRegionPolygon));

  t.equal(state.filters.length, 2, 'Should create one polygon filter per feature');
  t.deepEqual(
    state.datasets.trips.filteredIndex,
    [0, 1, 2, 3],
    'dataset filteredIndex should ignore polygon filters'
  );
  t.deepEqual(
    state.datasets.trips.filteredIndexByLayer[startLayer.id],
    [0, 1],
    'start layer should keep only points inside the start-region polygon'
  );
  t.deepEqual(
    state.datasets.trips.filteredIndexByLayer[endLayer.id],
    [1, 2],
    'end layer should keep only points inside the end-region polygon'
  );
  t.deepEqual(
    layerDataIndexes(state, startLayer),
    [0, 1],
    'start layer data should match its per-layer polygon index'
  );
  t.deepEqual(
    layerDataIndexes(state, endLayer),
    [1, 2],
    'end layer data should match its per-layer polygon index'
  );

  state = reducer(state, VisStateActions.applyCPUFilter('trips'));
  t.deepEqual(
    state.datasets.trips.filteredIdxCPU,
    [0, 1, 2],
    'filtered export should be the union of independently visible rows'
  );

  t.end();
});

test('#visStateReducer -> POLYGON: intersecting polygons AND on the same layer', t => {
  let state = loadDualLonLatPolygonState();
  const startLayer = pointLayerByLat(state, 'start_point_lat');
  const endLayer = pointLayerByLat(state, 'end_point_lat');

  state = reducer(
    state,
    VisStateActions.setFeatures([mockStartRegionPolygon, mockEastOverlapPolygon])
  );
  state = reducer(state, VisStateActions.setSelectedFeature(mockStartRegionPolygon));
  state = reducer(state, VisStateActions.setPolygonFilterLayer(startLayer, mockStartRegionPolygon));
  state = reducer(state, VisStateActions.setSelectedFeature(mockEastOverlapPolygon));
  state = reducer(state, VisStateActions.setPolygonFilterLayer(startLayer, mockEastOverlapPolygon));

  t.equal(state.filters.length, 2, 'Should create two polygon filters on the same layer');
  t.deepEqual(
    state.filters.map(f => f.layerId),
    [[startLayer.id], [startLayer.id]],
    'Both polygons should target only the start layer'
  );
  t.deepEqual(
    state.datasets.trips.filteredIndexByLayer[startLayer.id],
    [1],
    'start layer should keep only the intersection of both polygons'
  );
  t.deepEqual(
    layerDataIndexes(state, startLayer),
    [1],
    'start layer data should show only the intersecting point'
  );
  t.equal(
    state.datasets.trips.filteredIndexByLayer[endLayer.id],
    undefined,
    'untargeted end layer should not have a per-layer polygon index'
  );
  t.deepEqual(
    layerDataIndexes(state, endLayer),
    [0, 1, 2, 3],
    'untargeted end layer should keep all points'
  );

  state = reducer(state, VisStateActions.toggleFilterFeature(1));
  t.deepEqual(
    state.datasets.trips.filteredIndexByLayer[startLayer.id],
    [0, 1],
    'disabling one polygon should restore the remaining polygon filter'
  );
  t.deepEqual(
    layerDataIndexes(state, startLayer),
    [0, 1],
    'start layer data should match the remaining polygon'
  );

  t.end();
});

test('#visStateReducer -> POLYGON: inverted polygon AND another polygon on the same layer', t => {
  let state = loadDualLonLatPolygonState();
  const startLayer = pointLayerByLat(state, 'start_point_lat');

  state = reducer(
    state,
    VisStateActions.setFeatures([mockStartRegionPolygon, mockEastOverlapPolygon])
  );
  state = reducer(state, VisStateActions.setSelectedFeature(mockStartRegionPolygon));
  state = reducer(state, VisStateActions.setPolygonFilterLayer(startLayer, mockStartRegionPolygon));
  state = reducer(state, VisStateActions.setFilter(0, 'inverted', true));

  t.deepEqual(
    state.datasets.trips.filteredIndexByLayer[startLayer.id],
    [2, 3],
    'inverted polygon should keep points outside its region'
  );
  t.deepEqual(
    layerDataIndexes(state, startLayer),
    [2, 3],
    'layer data should use the inverted polygon complement'
  );

  state = reducer(state, VisStateActions.setSelectedFeature(mockEastOverlapPolygon));
  state = reducer(state, VisStateActions.setPolygonFilterLayer(startLayer, mockEastOverlapPolygon));

  t.deepEqual(
    state.datasets.trips.filteredIndexByLayer[startLayer.id],
    [2],
    'inverted polygon should be ANDed with another polygon on the same layer'
  );
  t.deepEqual(
    layerDataIndexes(state, startLayer),
    [2],
    'layer data should match the combined polygon filters'
  );

  t.end();
});

test('#visStateReducer -> POLYGON: disjoint polygons AND on the same layer', t => {
  let state = loadDualLonLatPolygonState();
  const startLayer = pointLayerByLat(state, 'start_point_lat');

  state = reducer(state, VisStateActions.setFeatures([mockWestOnlyPolygon, mockEastOnlyPolygon]));
  state = reducer(state, VisStateActions.setSelectedFeature(mockWestOnlyPolygon));
  state = reducer(state, VisStateActions.setPolygonFilterLayer(startLayer, mockWestOnlyPolygon));
  state = reducer(state, VisStateActions.setSelectedFeature(mockEastOnlyPolygon));
  state = reducer(state, VisStateActions.setPolygonFilterLayer(startLayer, mockEastOnlyPolygon));

  t.deepEqual(
    state.datasets.trips.filteredIndexByLayer[startLayer.id],
    [],
    'start layer should keep no points when two polygons do not overlap'
  );
  t.deepEqual(
    layerDataIndexes(state, startLayer),
    [],
    'start layer data should be empty when polygon filters have no intersection'
  );

  t.end();
});

test('#uiStateReducer -> SET_EDITOR_MODE', t => {
  const newState = reducer(INITIAL_VIS_STATE, VisStateActions.setEditorMode(EDITOR_MODES.EDIT));

  t.equal(newState.editor.mode, EDITOR_MODES.EDIT, 'Editor mode should be set to vertex');

  t.end();
});

test('#uiStateReducer -> TOGGLE_EDITOR_VISIBILITY', t => {
  let newState = reducer(INITIAL_VIS_STATE, VisStateActions.toggleEditorVisibility());

  t.equal(newState.editor.visible, false, 'Should set editor visibility to false');

  newState = reducer(newState, VisStateActions.toggleEditorVisibility());

  t.equal(newState.editor.visible, true, 'Should set editor visibility to true');

  t.end();
});

test('#visStateReducer -> APPLY_CPU_FILTER. no filter', t => {
  const initialState = CloneDeep(StateWFiles.visState);
  const dataId = testCsvDataId;
  const previousDataset = initialState.datasets[dataId];

  const nextState = reducer(initialState, VisStateActions.applyCPUFilter(dataId));

  const expectedDataset = {
    ...previousDataset,
    filteredIdxCPU: previousDataset.allIndexes,
    filterRecordCPU: {
      dynamicDomain: [],
      fixedDomain: [],
      cpu: [],
      gpu: []
    }
  };

  cmpDataset(t, expectedDataset, nextState.datasets[dataId]);
  t.end();
});

test('#visStateReducer -> APPLY_CPU_FILTER has gpu filter', t => {
  const initialState = CloneDeep(StateWFilters.visState);
  // dataset has gpu filter
  const dataId = testCsvDataId;
  const previousDataset = initialState.datasets[dataId];
  const gpuFilter = initialState.filters[0];

  const nextState = reducer(initialState, VisStateActions.applyCPUFilter(dataId));

  const expectedDataset = {
    ...previousDataset,
    filteredIdxCPU: [5, 6, 9, 10, 13, 14, 16, 17, 18, 19, 20, 21, 22, 23],
    filterRecordCPU: {
      dynamicDomain: [],
      fixedDomain: [gpuFilter],
      cpu: [gpuFilter],
      gpu: []
    }
  };

  cmpDataset(t, expectedDataset, nextState.datasets[dataId]);

  // calling it again
  const nextState2 = reducer(nextState, VisStateActions.applyCPUFilter(dataId));

  t.equal(
    nextState.datasets[dataId].filteredIdxCPU,
    nextState2.datasets[dataId].filteredIdxCPU,
    'should directly copy filter result when filter has not changed'
  );
  t.end();
});

test('#visStateReducer -> APPLY_CPU_FILTER has cpu filter', t => {
  const initialState = CloneDeep(StateWFilters.visState);
  // dataset has gpu filter
  const dataId = testGeoJsonDataId;
  const previousDataset2 = initialState.datasets[dataId];
  const ordinalFilter = initialState.filters[1];

  const nextState = reducer(initialState, VisStateActions.applyCPUFilter(dataId));

  const expectedDataset = {
    ...previousDataset2,
    filteredIdxCPU: [0],
    filterRecordCPU: {
      dynamicDomain: [],
      fixedDomain: [ordinalFilter],
      cpu: [ordinalFilter],
      gpu: []
    }
  };

  cmpDataset(t, expectedDataset, nextState.datasets[dataId]);

  const nextState2 = reducer(nextState, VisStateActions.applyCPUFilter(dataId));

  t.equal(
    nextState.datasets[dataId].filteredIdxCPU,
    nextState2.datasets[dataId].filteredIdxCPU,
    'should directly copy filter result when filter has not changed'
  );

  t.end();
});

test('#uiStateReducer -> SET_FEATURES/SET_SELECTED_FEATURE/DELETE_FEATURE', t => {
  let newState = reducer(INITIAL_VIS_STATE, VisStateActions.setFeatures([]));

  t.deepEqual(
    newState,
    INITIAL_VIS_STATE,
    'Editor should not have features and return the same state'
  );

  newState = reducer(
    INITIAL_VIS_STATE,
    VisStateActions.setFeatures([
      {
        ...mockPolygonFeature,
        properties: {
          ...mockPolygonFeature.properties,
          isClosed: false
        }
      }
    ])
  );

  t.equal(
    newState.editor.mode,
    INITIAL_VIS_STATE.editor.mode,
    'Editor mode should not change because feature is not closed'
  );

  newState = reducer(
    newState,
    VisStateActions.setFeatures([
      {
        ...mockPolygonFeature,
        properties: {
          ...mockPolygonFeature.properties,
          isClosed: false
        }
      },
      mockPolygonFeature
    ])
  );

  t.equal(newState.editor.mode, EDITOR_MODES.EDIT, 'Editor mode should be set to edit_vertex');
  t.end();
});

test('#visStateReducer -> SET_FEATURES line keeps draw mode', t => {
  let state = reducer(
    INITIAL_VIS_STATE,
    VisStateActions.setEditorMode(EDITOR_MODES.DRAW_LINESTRING)
  );
  state = reducer(
    state,
    VisStateActions.setFeatures([
      {
        type: 'Feature',
        id: 'line-1',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [0, 0],
            [1, 1]
          ]
        }
      }
    ])
  );

  t.equal(
    state.editor.mode,
    EDITOR_MODES.DRAW_LINESTRING,
    'Line sketches should stay in line drawing mode'
  );
  t.equal(state.editor.features.length, 1, 'Should store the line sketch');
  t.end();
});

test('#visStateReducer -> SET_FEATURES closed circle switches to edit', t => {
  let state = reducer(INITIAL_VIS_STATE, VisStateActions.setEditorMode(EDITOR_MODES.DRAW_CIRCLE));
  state = reducer(
    state,
    VisStateActions.setFeatures([
      {
        type: 'Feature',
        id: 'circle-1',
        properties: {
          isClosed: true,
          shape: 'Circle'
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [0, 1],
              [1, 0],
              [0, -1],
              [-1, 0],
              [0, 1]
            ]
          ]
        }
      }
    ])
  );

  t.equal(state.editor.mode, EDITOR_MODES.EDIT, 'Closed circle sketches should switch to select');
  t.equal(state.editor.features.length, 1, 'Should store the circle sketch');
  t.end();
});

test('#visStateReducer -> CONVERT_EDITOR_FEATURES_TO_LAYER', t => {
  const emptyState = reducer(INITIAL_VIS_STATE, VisStateActions.convertEditorFeaturesToLayer());
  t.equal(emptyState, INITIAL_VIS_STATE, 'Should no-op when there are no sketch features');

  const lineFeature = {
    type: 'Feature',
    id: 'line-1',
    properties: {isClosed: false},
    geometry: {
      type: 'LineString',
      coordinates: [
        [0, 0],
        [1, 1]
      ]
    }
  };

  let state = {
    ...INITIAL_VIS_STATE,
    editor: {
      ...INITIAL_VIS_STATE.editor,
      features: [lineFeature],
      selectedFeature: lineFeature,
      mode: EDITOR_MODES.DRAW_LINESTRING
    }
  };

  state = reducer(state, VisStateActions.convertEditorFeaturesToLayer());
  t.deepEqual(state.editor.features, [], 'Should clear sketch features after convert');
  t.equal(state.editor.selectedFeature, null, 'Should clear selected feature after convert');
  t.equal(state.editor.mode, EDITOR_MODES.EDIT, 'Should switch to select mode after convert');

  const tasks = drainTasksForTesting();
  t.ok(
    /Drawn Geometry \d{2}/.test(JSON.stringify(tasks)),
    'Converted layer should be named Drawn Geometry plus a two-digit number'
  );
  t.end();
});

test('#visStateReducer -> EXTRACT_DATA_FROM_FEATURE', t => {
  const datasets = [
    {
      data: {
        fields: [
          {name: 'start_point_lat', format: '', fieldIdx: 0, type: 'real', analyzerType: 'FLOAT'},
          {name: 'start_point_lng', format: '', fieldIdx: 1, type: 'real', analyzerType: 'FLOAT'},
          {name: 'end_point_lat', format: '', fieldIdx: 2, type: 'real', analyzerType: 'FLOAT'},
          {name: 'end_point_lng', format: '', fieldIdx: 3, type: 'real', analyzerType: 'FLOAT'}
        ],
        rows: mockPolygonData.data
      },
      info: {
        label: 'test.csv',
        size: 144
      }
    }
  ];

  let state = applyActions(reducer, INITIAL_VIS_STATE, [
    {
      action: VisStateActions.updateVisData,
      payload: [datasets, {centerMap: true, keepExistingConfig: false}, {}]
    }
  ]);

  const pointLayer = state.layers.find(layer => layer.type === 'point');
  t.ok(pointLayer, 'Should create a point layer from lat/lng columns');

  state = reducer(state, VisStateActions.setFeatures([mockPolygonFeature]));
  state = reducer(state, VisStateActions.setSelectedFeature(mockPolygonFeature));

  const sourceDataId = pointLayer.config.dataId;
  const sourceRowCount = state.datasets[sourceDataId].dataContainer.numRows();
  const layerCount = state.layers.length;

  state = applyExistingDatasetTasks(
    reducer,
    reducer(state, VisStateActions.extractDataFromFeature({layerId: pointLayer.id}))
  );

  const extractedIds = Object.keys(state.datasets).filter(id => id !== sourceDataId);
  t.equal(extractedIds.length, 1, 'Should create one extracted dataset');

  const extracted = state.datasets[extractedIds[0]];
  t.equal(extracted.dataContainer.numRows(), 2, 'Should copy the two points inside the polygon');
  t.ok(extracted.label.startsWith('Extracted '), 'Extracted dataset should use Extracted prefix');
  t.equal(
    state.datasets[sourceDataId].dataContainer.numRows(),
    sourceRowCount,
    'Source dataset should stay unchanged'
  );
  t.equal(state.editor.features.length, 1, 'Should keep the drawing after extract');
  t.ok(state.layers.length > layerCount, 'Should auto-create a layer for the extracted dataset');

  const emptyState = reducer(
    state,
    VisStateActions.extractDataFromFeature({layerId: 'missing-layer'})
  );
  t.equal(emptyState, state, 'Should no-op when the layer id is unknown');

  t.end();
});

test('#visStateReducer -> EXTRACT_DATA_FROM_FEATURE respects GPU range filter', t => {
  const datasets = [
    {
      data: {
        fields: [
          {name: 'start_point_lat', format: '', fieldIdx: 0, type: 'real', analyzerType: 'FLOAT'},
          {name: 'start_point_lng', format: '', fieldIdx: 1, type: 'real', analyzerType: 'FLOAT'},
          {name: 'end_point_lat', format: '', fieldIdx: 2, type: 'real', analyzerType: 'FLOAT'},
          {name: 'end_point_lng', format: '', fieldIdx: 3, type: 'real', analyzerType: 'FLOAT'}
        ],
        rows: mockPolygonData.data
      },
      info: {
        label: 'test.csv'
      }
    }
  ];

  let state = applyActions(reducer, INITIAL_VIS_STATE, [
    {
      action: VisStateActions.updateVisData,
      payload: [datasets, {centerMap: false, keepExistingConfig: false}, {}]
    }
  ]);

  const pointLayer = state.layers.find(layer => layer.type === 'point');
  t.ok(pointLayer, 'Should create a point layer from lat/lng columns');
  const sourceDataId = pointLayer.config.dataId;

  state = reducer(state, VisStateActions.addFilter(sourceDataId));
  state = reducer(state, VisStateActions.setFilter(0, 'name', 'start_point_lat'));
  state = reducer(state, VisStateActions.setFilter(0, 'value', [12, 12.5]));

  t.equal(state.filters[0].gpu, true, 'Range filter should be GPU-backed');
  t.equal(
    state.datasets[sourceDataId].filteredIndex.length,
    state.datasets[sourceDataId].dataContainer.numRows(),
    'GPU filter should not shrink filteredIndex'
  );

  state = reducer(state, VisStateActions.setFeatures([mockPolygonFeature]));
  state = reducer(state, VisStateActions.setSelectedFeature(mockPolygonFeature));

  state = applyExistingDatasetTasks(
    reducer,
    reducer(state, VisStateActions.extractDataFromFeature({layerId: pointLayer.id}))
  );

  const extractedIds = Object.keys(state.datasets).filter(id => id !== sourceDataId);
  t.equal(extractedIds.length, 1, 'Should create one extracted dataset');
  t.equal(
    state.datasets[extractedIds[0]].dataContainer.numRows(),
    1,
    'Should keep only the in-polygon row that also passes the range filter'
  );

  t.end();
});

test('#visStateReducer -> EXTRACT_DATA_FROM_FEATURE empty polygon', t => {
  const datasets = [
    {
      data: {
        fields: [
          {name: 'start_point_lat', format: '', fieldIdx: 0, type: 'real', analyzerType: 'FLOAT'},
          {name: 'start_point_lng', format: '', fieldIdx: 1, type: 'real', analyzerType: 'FLOAT'},
          {name: 'end_point_lat', format: '', fieldIdx: 2, type: 'real', analyzerType: 'FLOAT'},
          {name: 'end_point_lng', format: '', fieldIdx: 3, type: 'real', analyzerType: 'FLOAT'}
        ],
        rows: mockPolygonData.data
      },
      info: {
        label: 'test.csv'
      }
    }
  ];

  let state = applyActions(reducer, INITIAL_VIS_STATE, [
    {
      action: VisStateActions.updateVisData,
      payload: [datasets, {centerMap: false, keepExistingConfig: false}, {}]
    }
  ]);

  const farAwayPolygon = {
    type: 'Feature',
    id: 'far-away',
    properties: {isClosed: true},
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
          [0, 0]
        ]
      ]
    }
  };

  const pointLayer = state.layers.find(layer => layer.type === 'point');
  state = reducer(state, VisStateActions.setFeatures([farAwayPolygon]));
  state = reducer(state, VisStateActions.setSelectedFeature(farAwayPolygon));
  const datasetCount = Object.keys(state.datasets).length;

  state = reducer(state, VisStateActions.extractDataFromFeature({layerId: pointLayer.id}));
  t.equal(
    Object.keys(state.datasets).length,
    datasetCount,
    'Should not create a dataset when no rows fall inside the drawing'
  );
  drainTasksForTesting();

  t.end();
});

test('#visStateReducer -> EXTRACT_DATA_FROM_FEATURE raster awaits clip download', t => {
  drainTasksForTesting();
  const layer = {
    id: 'raster-extract',
    type: LAYER_TYPES.rasterTile,
    config: {dataId: 'stac-data', label: 'Africa Farms'},
    extractInsideFeature: () => ({
      kind: 'geojson',
      features: [
        {
          type: 'Feature',
          geometry: mockPolygonFeature.geometry,
          properties: {pixel_count: 1}
        }
      ],
      rowCount: 1
    }),
    downloadClip: () => Promise.resolve({png: true, json: true})
  };
  const startState = {
    ...INITIAL_VIS_STATE,
    layers: [layer],
    datasets: {
      'stac-data': {
        id: 'stac-data',
        fields: [],
        dataContainer: createDataContainer([])
      }
    },
    editor: {
      ...INITIAL_VIS_STATE.editor,
      selectedFeature: mockPolygonFeature
    }
  };

  const pendingState = reducer(
    startState,
    VisStateActions.extractDataFromFeature({layerId: layer.id})
  );
  const downloadTasks = drainTasksForTesting();
  t.equal(downloadTasks.length, 1, 'Should wait on downloadClip instead of toasting immediately');

  const successAction = succeedTaskInTest(downloadTasks[0], {png: true, json: true});
  t.ok(
    JSON.stringify(successAction).includes('Downloaded raster clip image'),
    'Should toast success after a PNG is produced'
  );
  reducer(pendingState, successAction);
  drainTasksForTesting();

  const pendingFailState = reducer(
    startState,
    VisStateActions.extractDataFromFeature({layerId: layer.id})
  );
  const failDownloadTasks = drainTasksForTesting();
  const failAction = succeedTaskInTest(failDownloadTasks[0], {png: false, json: true});
  t.ok(
    JSON.stringify(failAction).includes('Failed to download raster clip image'),
    'Should toast an error when no PNG is produced'
  );
  reducer(pendingFailState, failAction);
  drainTasksForTesting();
  t.end();
});

test('#visStateReducer -> CONVERT_EDITOR_FEATURES_TO_LAYER disabled by config', t => {
  initApplicationConfig({enableDrawOnMapSketches: false});

  try {
    const lineFeature = {
      type: 'Feature',
      id: 'line-1',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [0, 0],
          [1, 1]
        ]
      }
    };
    const startState = {
      ...INITIAL_VIS_STATE,
      editor: {
        ...INITIAL_VIS_STATE.editor,
        features: [lineFeature],
        selectedFeature: lineFeature
      }
    };

    const nextState = reducer(startState, VisStateActions.convertEditorFeaturesToLayer());
    t.equal(nextState, startState, 'Should no-op convert when draw-on-map sketches are disabled');

    const ignoredMode = reducer(startState, VisStateActions.setEditorMode(EDITOR_MODES.DRAW_POINT));
    t.equal(
      ignoredMode.editor.mode,
      startState.editor.mode,
      'Should ignore point draw mode when sketches are disabled'
    );

    const circleMode = reducer(startState, VisStateActions.setEditorMode(EDITOR_MODES.DRAW_CIRCLE));
    t.equal(
      circleMode.editor.mode,
      EDITOR_MODES.DRAW_CIRCLE,
      'Should allow circle draw mode when sketches are disabled'
    );

    const ignoredProperties = reducer(
      startState,
      VisStateActions.setEditorFeatureProperties(lineFeature, {name: 'route'})
    );
    t.equal(
      ignoredProperties,
      startState,
      'Should ignore edit properties when sketches are disabled'
    );
  } finally {
    initApplicationConfig({enableDrawOnMapSketches: true});
  }

  t.end();
});

test('#visStateReducer -> SET_EDITOR_FEATURE_PROPERTIES', t => {
  const pointFeature = {
    type: 'Feature',
    id: 'point-1',
    properties: {isClosed: false},
    geometry: {type: 'Point', coordinates: [0, 0]}
  };

  let state = {
    ...INITIAL_VIS_STATE,
    editor: {
      ...INITIAL_VIS_STATE.editor,
      features: [pointFeature],
      selectedFeature: pointFeature
    }
  };

  state = reducer(
    state,
    VisStateActions.setEditorFeatureProperties(pointFeature, {
      name: 'Stop',
      filterId: 'nope',
      isClosed: true
    })
  );

  t.equal(state.editor.features[0].properties.name, 'Stop', 'Should store user properties');
  t.equal(
    state.editor.selectedFeature.properties.name,
    'Stop',
    'Should keep the selected feature in sync'
  );
  t.equal(
    state.editor.features[0].properties.isClosed,
    false,
    'Should preserve editor-only properties'
  );
  t.notOk(
    state.editor.features[0].properties.filterId,
    'Should ignore reserved keys from the payload'
  );

  state = reducer(state, VisStateActions.setEditorFeatureProperties(pointFeature, {}));
  t.notOk(state.editor.features[0].properties.name, 'Should remove user properties when cleared');
  t.equal(
    state.editor.features[0].properties.isClosed,
    false,
    'Should keep editor-only properties'
  );

  t.end();
});

test('#visStateReducer -> APPLY_CPU_FILTER has multi datasets', t => {
  const initialState = CloneDeep(StateWFilters.visState);
  const previousDataset1 = initialState.datasets[testCsvDataId];
  const previousDataset2 = initialState.datasets[testGeoJsonDataId];
  const gpuFilter = initialState.filters[0];
  const ordinalFilter = initialState.filters[1];

  const nextState = reducer(
    initialState,
    VisStateActions.applyCPUFilter([testCsvDataId, testGeoJsonDataId])
  );

  const expectedDataset1 = {
    ...previousDataset1,
    filteredIdxCPU: [5, 6, 9, 10, 13, 14, 16, 17, 18, 19, 20, 21, 22, 23],
    filterRecordCPU: {
      dynamicDomain: [],
      fixedDomain: [gpuFilter],
      cpu: [gpuFilter],
      gpu: []
    }
  };

  const expectedDataset2 = {
    ...previousDataset2,
    filteredIdxCPU: [0],
    filterRecordCPU: {
      dynamicDomain: [],
      fixedDomain: [ordinalFilter],
      cpu: [ordinalFilter],
      gpu: []
    }
  };

  const expectedDatasets = {
    [testCsvDataId]: expectedDataset1,
    [testGeoJsonDataId]: expectedDataset2
  };

  cmpDatasets(t, expectedDatasets, nextState.datasets);

  t.end();
});

test('#visStateReducer -> SORT_TABLE_COLUMN', t => {
  const initialState = CloneDeep(StateWFiles.visState);

  // sort with default mode
  const nextState = reducer(initialState, VisStateActions.sortTableColumn());
  t.equal(nextState, initialState, 'state should not change when input is given');

  // sort with
  const nextState2 = reducer(
    initialState,
    VisStateActions.sortTableColumn(testCsvDataId, 'gps_data.lat')
  );
  t.ok(nextState2.datasets[testCsvDataId].sortOrder, 'should create sortOrder');

  const expectedOrder = [
    3, 0, 2, 4, 1, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20, 19, 18, 23, 22, 21
  ];
  t.deepEqual(nextState2.datasets[testCsvDataId].sortOrder, expectedOrder, 'should sort correctly');
  t.deepEqual(
    nextState2.datasets[testCsvDataId].sortColumn,
    {'gps_data.lat': 'ASCENDING'},
    'should save sortOrder'
  );

  // sort again
  const nextState3 = reducer(
    nextState2,
    VisStateActions.sortTableColumn(testCsvDataId, 'gps_data.lat')
  );

  const expectedOrder3 = [...expectedOrder].reverse();

  t.deepEqual(
    nextState3.datasets[testCsvDataId].sortOrder,
    expectedOrder3,
    'should sort correctly'
  );
  t.deepEqual(
    nextState3.datasets[testCsvDataId].sortColumn,
    {'gps_data.lat': 'DESCENDING'},
    'should correctly sort'
  );

  // unsort
  const nextState4 = reducer(
    nextState3,
    VisStateActions.sortTableColumn(testCsvDataId, 'gps_data.lat', 'UNSORT')
  );
  t.deepEqual(nextState4.datasets[testCsvDataId].sortOrder, null, 'should reset sortOrder');
  t.deepEqual(nextState4.datasets[testCsvDataId].sortColumn, {}, 'should reset sortColumn');

  // sort with mode
  const nextState5 = reducer(
    nextState4,
    VisStateActions.sortTableColumn(testCsvDataId, 'gps_data.lat', 'DESCENDING')
  );

  t.deepEqual(
    nextState5.datasets[testCsvDataId].sortOrder,
    expectedOrder3,
    'should sort correctly'
  );
  t.deepEqual(
    nextState5.datasets[testCsvDataId].sortColumn,
    {'gps_data.lat': 'DESCENDING'},
    'should correctly sort'
  );
  assertDatasetIsTable(t, nextState5.datasets[testCsvDataId]);

  t.end();
});

test('#visStateReducer -> LOAD_COLUMN_STATS', t => {
  drainTasksForTesting();
  const initialState = CloneDeep(StateWFiles.visState);

  const noOpState = reducer(
    initialState,
    VisStateActions.loadColumnStats('missing', 'gps_data.lat')
  );
  t.equal(noOpState, initialState, 'state should not change when dataset is missing');

  const nextState = reducer(
    initialState,
    VisStateActions.loadColumnStats(testCsvDataId, 'gps_data.lat')
  );
  const loadingField = nextState.datasets[testCsvDataId].fields.find(
    f => f.name === 'gps_data.lat'
  );
  t.equal(loadingField.isLoadingStats, true, 'should set isLoadingStats while loading');

  const tasks = drainTasksForTesting();
  t.equal(tasks.length, 1, 'should create a column stats task');

  const result = {
    type: 'numeric',
    mean: 30,
    std: 1,
    percentNulls: 0,
    bins: [],
    quantiles: [
      {label: 'Min', value: 29},
      {label: 'Max', value: 31}
    ]
  };
  const successState = reducer(
    nextState,
    VisStateActions.loadColumnStatsSuccess(testCsvDataId, 'gps_data.lat', result, {})
  );
  const successField = successState.datasets[testCsvDataId].fields.find(
    f => f.name === 'gps_data.lat'
  );
  t.equal(successField.isLoadingStats, false, 'should clear isLoadingStats on success');
  t.deepEqual(
    successField.filterProps.columnStats,
    result,
    'should store columnStats on filterProps'
  );

  const errorState = reducer(
    nextState,
    VisStateActions.loadColumnStatsError(testCsvDataId, 'gps_data.lat', new Error('stats failed'))
  );
  const errorField = errorState.datasets[testCsvDataId].fields.find(f => f.name === 'gps_data.lat');
  t.equal(errorField.isLoadingStats, false, 'should clear isLoadingStats on error');

  drainTasksForTesting();
  t.end();
});

test('#visStateReducer -> PIN_TABLE_COLUMN', t => {
  const initialState = CloneDeep(StateWFiles.visState);

  // pin with empty arg
  const nextState = reducer(initialState, VisStateActions.pinTableColumn());
  t.equal(nextState, initialState, 'state should not change when input is not given');

  // pin gps_data.lat
  const nextState1 = reducer(
    nextState,
    VisStateActions.pinTableColumn(testCsvDataId, 'gps_data.lat')
  );

  assertDatasetIsTable(t, nextState1.datasets[testCsvDataId]);

  t.deepEqual(
    nextState1.datasets[testCsvDataId].pinnedColumns,
    ['gps_data.lat'],
    'should add to pinned columns'
  );

  // unpin
  const nextState2 = reducer(
    nextState1,
    VisStateActions.pinTableColumn(testCsvDataId, 'gps_data.lat')
  );
  assertDatasetIsTable(t, nextState2.datasets[testCsvDataId]);

  t.deepEqual(
    nextState2.datasets[testCsvDataId].pinnedColumns,
    [],
    'should remove from pinned columns'
  );

  t.end();
});

test('#visStateReducer -> TOGGLE_TABLE_COLUMN_HIDDEN and SHOW_ALL_TABLE_COLUMNS', t => {
  const initialState = CloneDeep(StateWFiles.visState);

  const hiddenState = reducer(
    initialState,
    VisStateActions.toggleTableColumnHidden(testCsvDataId, 'gps_data.lat')
  );
  assertDatasetIsTable(t, hiddenState.datasets[testCsvDataId]);
  t.deepEqual(
    hiddenState.datasets[testCsvDataId].hiddenColumns,
    ['gps_data.lat'],
    'should hide a table column through the reducer'
  );

  const shownState = reducer(
    hiddenState,
    VisStateActions.toggleTableColumnHidden(testCsvDataId, 'gps_data.lat')
  );
  t.deepEqual(shownState.datasets[testCsvDataId].hiddenColumns, [], 'should show a hidden column');

  const allShownState = reducer(hiddenState, VisStateActions.showAllTableColumns(testCsvDataId));
  t.deepEqual(allShownState.datasets[testCsvDataId].hiddenColumns, [], 'should show all columns');

  const unknownColumnState = reducer(
    initialState,
    VisStateActions.toggleTableColumnHidden(testCsvDataId, 'missing')
  );
  t.equal(
    unknownColumnState.datasets[testCsvDataId].hiddenColumns,
    undefined,
    'should ignore an unknown column'
  );
  t.equal(
    reducer(initialState, VisStateActions.toggleTableColumnHidden('missing', 'gps_data.lat')),
    initialState,
    'should ignore an unknown dataset'
  );

  t.end();
});

test('#visStateReducer -> LOAD_FILES', async t => {
  drainTasksForTesting();

  const loadFilesSuccessSpy = sinon.spy(VisStateActions, 'loadFilesSuccess');
  const loadFileErrSpy = sinon.spy(Console, 'warn');
  const initialState = CloneDeep(InitialState).visState;
  const mockResults = {
    data: [
      {value1: 'a', value2: 1},
      {value1: 'b', value2: 2}
    ]
  };
  const mockFiles = [
    {type: 'text/csv', name: 'test-file.csv'},
    {type: 'text/csv', name: 'test-file-2.csv'}
  ];
  // mock async generator
  async function* run(fileName) {
    // Sleep for 100ms, see: https://masteringjs.io/tutorials/fundamentals/sleep
    let percent = 0;
    await new Promise(resolve => setTimeout(resolve, 100));
    while (percent < 1) {
      percent += 1;
      yield {progress: {percent}, fileName, ...mockResults};
    }
  }

  const nextState = reducer(initialState, VisStateActions.loadFiles(mockFiles));

  const tasks = drainTasksForTesting();
  t.equal(tasks.length, 1, 'should create 1 task');
  const task1 = tasks[0];

  const expectedTask1 = {
    type: 'LOAD_FILE_TASK',
    payload: {
      file: {type: 'text/csv', name: 'test-file.csv'},
      fileCache: [],
      loaders: [],
      loadOptions: {},
      companionFiles: mockFiles
    }
  };

  t.comment(JSON.stringify(task1));
  t.equal(task1.type, expectedTask1.type, 'should create LOAD_FILE_TASK task');
  t.deepEqual(task1.payload, expectedTask1.payload, 'should create LOAD_FILE_TASK correct payload');

  const expectedFileLoading = {
    fileCache: [],
    filesToLoad: [{type: 'text/csv', name: 'test-file-2.csv'}],
    companionFiles: mockFiles,
    onFinish: VisStateActions.loadFilesSuccess
  };
  const expectedFileLoadingProgress = {
    'test-file.csv': {percent: 0, message: 'loading...', fileName: 'test-file.csv', error: null},
    'test-file-2.csv': {percent: 0, message: '', fileName: 'test-file-2.csv', error: null}
  };

  t.deepEqual(
    nextState.fileLoading,
    {...expectedFileLoading, loadId: nextState.fileLoading.loadId},
    'should save fileLoading in state'
  );
  t.equal(typeof nextState.fileLoading.loadId, 'number', 'should assign a load session');
  t.deepEqual(
    nextState.fileLoadingProgress,
    expectedFileLoadingProgress,
    'should save fileLoadingProgress in state'
  );

  const asyncIterator = run('test-file.csv');

  // test nextFileBatchUpdater
  const nextState2 = reducer(nextState, succeedTaskInTest(task1, asyncIterator));
  // test LOAD_FILE_TASK success
  const [task2, ...more2] = drainTasksForTesting();
  t.equal(more2.length, 0, 'should ceate 1 task');
  t.equal(task2.type, 'UNWRAP', 'should return an UNWRAP task');
  t.ok(task2.payload instanceof Promise, 'task 2 payload should be a Promise');

  t.equal(
    nextState2.fileLoading,
    nextState.fileLoading,
    'fileLoading should not change for the first batch'
  );
  t.deepEqual(
    nextState2.fileLoadingProgress,
    nextState.fileLoadingProgress,
    'fileLoadingProgress should not change for the first batch'
  );

  // test LOAD_FILE_TASK error
  const err1 = {message: 'error 1'};
  const nextState2Err = reducer(nextState, errorTaskInTest(task1, err1));
  const [task2Err, ...more2err] = drainTasksForTesting();
  t.equal(more2err.length, 0, 'should ceate 1 task');
  const expectedErrProgress = {
    'test-file.csv': {percent: 0, message: 'loading...', fileName: 'test-file.csv', error: err1},
    'test-file-2.csv': {percent: 0, message: '', fileName: 'test-file-2.csv', error: null}
  };
  t.deepEqual(
    nextState2Err.fileLoadingProgress,
    expectedErrProgress,
    'should save error to fileLoadingProgress'
  );
  loadFileErrSpy.calledWith(err1);

  t.equal(
    task2Err.type,
    'DELAY_TASK',
    'should create a DELAY_TASK task when loadFileErr is triggered'
  );
  const nextState3Err = reducer(nextState2Err, succeedTaskInTest(task2Err));
  const [task3Err, ...more3err] = drainTasksForTesting();
  t.equal(more3err.length, 0, 'should ceate 1 task');
  t.equal(task3Err.type, 'LOAD_FILE_TASK', 'should return an LOAD_FILE_TASK');
  t.deepEqual(
    task3Err.payload,
    {
      file: {type: 'text/csv', name: 'test-file-2.csv'},
      fileCache: [],
      loaders: [],
      loadOptions: {},
      companionFiles: mockFiles
    },
    'should return an LOAD_FILE_TASK with 2nd file to load'
  );
  const expectedErrFileLoadingProgress = {
    'test-file.csv': {percent: 0, message: 'loading...', fileName: 'test-file.csv', error: err1},
    'test-file-2.csv': {percent: 0, message: 'loading...', fileName: 'test-file-2.csv', error: null}
  };
  t.deepEqual(
    nextState3Err.fileLoadingProgress,
    expectedErrFileLoadingProgress,
    'fileLoadingProgress should update whe calling loadNextfileUpdater'
  );
  t.deepEqual(
    nextState3Err.fileLoading,
    {
      loadId: nextState.fileLoading.loadId,
      fileCache: [],
      filesToLoad: [],
      companionFiles: mockFiles,
      onFinish: VisStateActions.loadFilesSuccess
    },
    'fileLoading should not add result to fileCache when error'
  );

  // UNWRAP Task success
  const unwrapSuccess = await task2.payload;
  const resultState3 = reducer(nextState2, succeedTaskInTest(task2, unwrapSuccess));

  // should return another unwrap task
  const [task3, ...more3] = drainTasksForTesting();
  t.equal(more3.length, 0, 'should ceate 1 task');
  t.equal(task3.type, 'UNWRAP', 'should return an UNWRAP task');
  t.ok(task3.payload instanceof Promise, 'task 3 payload should be a Promise');
  const expectedFileLoadingProgress3 = {
    'test-file.csv': {percent: 1, message: 'loading...', fileName: 'test-file.csv', error: null},
    'test-file-2.csv': {percent: 0, message: '', fileName: 'test-file-2.csv', error: null}
  };
  t.equal(
    resultState3.fileLoading,
    nextState2.fileLoading,
    'fileLoading should not change when loadingis not finished'
  );
  t.deepEqual(
    resultState3.fileLoadingProgress,
    expectedFileLoadingProgress3,
    'fileLoadingProgress should update with percent'
  );

  // calling UNWRAP_TASK sucess to create File Process task
  const unwrapSuccess3 = await task3.payload;
  const resultState4 = reducer(resultState3, succeedTaskInTest(task3, unwrapSuccess3));
  const [task4, ...more4] = drainTasksForTesting();

  const expectedFileLoadingProgress4 = {
    'test-file.csv': {percent: 1, message: 'processing...', fileName: 'test-file.csv', error: null},
    'test-file-2.csv': {percent: 0, message: '', fileName: 'test-file-2.csv', error: null}
  };
  t.equal(resultState3.fileLoading, resultState4.fileLoading, 'fileLoading should be the same');
  t.deepEqual(
    resultState4.fileLoadingProgress,
    expectedFileLoadingProgress4,
    'fileLoadingProgress should update to reflect processing'
  );

  t.equal(more4.length, 0, 'should ceate 1 task');
  const expectedpayload = {
    content: {progress: {percent: 1}, fileName: 'test-file.csv', ...mockResults},
    fileCache: []
  };
  t.equal(task4.type, 'PROCESS_FILE_CONTENT', 'should return an PROCESS_FILE_CONTENT task');
  t.deepEqual(
    task4.payload,
    expectedpayload,
    'PROCESS_FILE_CONTENT task payload should be correct'
  );

  const fileProcessResult = [
    {
      data: [],
      info: {
        label: 'test_data.csv',
        format: 'csv'
      }
    }
  ];

  // calling loadFileStepSuccess with file process result
  const resultState5 = reducer(resultState4, succeedTaskInTest(task4, fileProcessResult));

  const expectedFileLoadingProgress5 = {
    'test-file.csv': {percent: 1, message: 'Done', fileName: 'test-file.csv', error: null},
    'test-file-2.csv': {percent: 0, message: '', fileName: 'test-file-2.csv', error: null}
  };
  t.deepEqual(
    resultState5.fileLoadingProgress,
    expectedFileLoadingProgress5,
    'fileLoadingProgress should update to show finish'
  );
  t.deepEqual(
    resultState5.fileLoading,
    {
      loadId: nextState.fileLoading.loadId,
      fileCache: fileProcessResult,
      filesToLoad: [{type: 'text/csv', name: 'test-file-2.csv'}],
      companionFiles: mockFiles,
      onFinish: VisStateActions.loadFilesSuccess
    },
    'fileLoading should update to add result to fileCache 1'
  );
  const [task5, ...more5] = drainTasksForTesting();
  t.equal(more5.length, 0, 'should ceate 1 task');
  t.equal(task5.type, 'DELAY_TASK', 'should return an DELAY_TASK');

  // calling delayed task succeed to trigger load next file
  const resultState6 = reducer(resultState5, succeedTaskInTest(task5));
  const [task6, ...more6] = drainTasksForTesting();
  t.equal(more6.length, 0, 'should ceate 1 task');
  t.equal(task6.type, 'LOAD_FILE_TASK', 'should return an LOAD_FILE_TASK');
  t.deepEqual(
    task6.payload,
    {
      file: {type: 'text/csv', name: 'test-file-2.csv'},
      fileCache: fileProcessResult,
      loaders: [],
      loadOptions: {},
      companionFiles: mockFiles
    },
    'should return an LOAD_FILE_TASK with 2nd file to load 2'
  );
  const expectedFileLoadingProgress6 = {
    'test-file.csv': {percent: 1, message: 'Done', fileName: 'test-file.csv', error: null},
    'test-file-2.csv': {percent: 0, message: 'loading...', fileName: 'test-file-2.csv', error: null}
  };
  t.deepEqual(
    resultState6.fileLoadingProgress,
    expectedFileLoadingProgress6,
    'fileLoadingProgress should update whe calling loadNextfileUpdater'
  );
  t.deepEqual(
    resultState6.fileLoading,
    {
      loadId: nextState.fileLoading.loadId,
      fileCache: fileProcessResult,
      filesToLoad: [],
      companionFiles: mockFiles,
      onFinish: VisStateActions.loadFilesSuccess
    },
    'fileLoading should update to add result to fileCache 3'
  );
  // fast forward so we can test final result
  const asyncIterator2 = run('test-file-2.csv');
  const resultState7 = reducer(resultState6, succeedTaskInTest(task6, asyncIterator2));
  const [task7] = drainTasksForTesting();

  const unwrapSuccess7 = await task7.payload;
  const resultState8 = reducer(resultState7, succeedTaskInTest(task7, unwrapSuccess7));
  const [task8] = drainTasksForTesting();
  const unwrapSuccess8 = await task8.payload;
  const resultState9 = reducer(resultState8, succeedTaskInTest(task8, unwrapSuccess8));
  // process task
  const [task9] = drainTasksForTesting();
  const file2ProcessResult = [
    ...fileProcessResult,
    {
      data: [{value: 1}],
      info: {
        label: 'test_data_2.csv',
        format: 'csv'
      }
    }
  ];
  const resultState10 = reducer(resultState9, succeedTaskInTest(task9, file2ProcessResult));

  const expectedFileLoadingProgress10 = {
    'test-file.csv': {percent: 1, message: 'Done', fileName: 'test-file.csv', error: null},
    'test-file-2.csv': {percent: 1, message: 'Done', fileName: 'test-file-2.csv', error: null}
  };
  t.deepEqual(
    resultState10.fileLoadingProgress,
    expectedFileLoadingProgress10,
    'fileLoadingProgress should update to show finish both files'
  );
  t.deepEqual(
    resultState10.fileLoading,
    {
      loadId: nextState.fileLoading.loadId,
      fileCache: file2ProcessResult,
      filesToLoad: [],
      companionFiles: mockFiles,
      onFinish: VisStateActions.loadFilesSuccess
    },
    'fileLoading should update to add 2nd file result to fileCache'
  );
  const [task10, ...more10] = drainTasksForTesting();
  t.equal(more10.length, 0, 'should ceate 1 task');
  t.equal(task10.type, 'DELAY_TASK', 'should return an DELAY_TASK for onFinish');

  // calling delayed task succeed to trigger load next file
  const resultState11 = reducer(resultState10, succeedTaskInTest(task10));
  const [task11, ...more11] = drainTasksForTesting();
  t.equal(more11.length, 0, 'should create 1 task');
  t.equal(task11.type, 'ACTION_TASK', 'an empty queue finishes the load');
  reducer(resultState11, succeedTaskInTest(task11));

  t.ok(loadFilesSuccessSpy.calledOnce);
  const expectedArgs = [
    {data: [], info: {label: 'test_data.csv', format: 'csv'}},
    {data: [{value: 1}], info: {label: 'test_data_2.csv', format: 'csv'}}
  ];
  t.ok(loadFilesSuccessSpy.calledWith(expectedArgs));
  loadFilesSuccessSpy.restore();

  loadFileErrSpy.restore();
  t.end();
});

test('#visStateReducer -> LOAD_FILES expands a mixed zip into datasets', t => {
  drainTasksForTesting();

  const initialState = CloneDeep(InitialState).visState;
  const zipFile = {type: 'application/zip', name: 'bundle.zip'};
  const extraFile = {type: 'text/csv', name: 'extra.csv'};
  const nextState = reducer(initialState, VisStateActions.loadFiles([zipFile, extraFile]));
  const [expandTask] = drainTasksForTesting();

  t.equal(expandTask.type, 'EXPAND_ZIP_TASK', 'a zip is unpacked before it is parsed');
  t.equal(expandTask.payload.file, zipFile, 'the expand task receives the zip');
  t.deepEqual(expandTask.payload.extensions, [], 'built-in formats need no extra extensions');
  t.deepEqual(
    nextState.fileLoading.filesToLoad.map(file => file.name),
    ['extra.csv'],
    'the zip leaves the queue while it is unpacked'
  );

  const places = {type: 'text/csv', name: 'places.csv'};
  const neighborhoods = {type: 'application/geo+json', name: 'neighborhoods.geojson'};
  const expanded = reducer(
    nextState,
    succeedTaskInTest(expandTask, {
      kind: 'datasets',
      datasets: [places, neighborhoods],
      companions: []
    })
  );
  const [loadTask] = drainTasksForTesting();

  t.equal(loadTask.type, 'LOAD_FILE_TASK', 'the first unzipped dataset starts loading');
  t.equal(loadTask.payload.file, places);
  t.equal(loadTask.payload.fileName, undefined, 'mixed members keep their own file names');
  t.deepEqual(
    expanded.fileLoading.filesToLoad.map(file => file.name),
    ['neighborhoods.geojson', 'extra.csv'],
    'remaining members stay queued after the file that was dropped beside the zip'
  );
  t.equal(
    expanded.fileLoadingProgress['bundle.zip'],
    undefined,
    'the zip progress row is replaced'
  );
  t.equal(expanded.fileLoadingProgress['places.csv'].message, 'loading...');
  t.ok(expanded.fileLoadingProgress['neighborhoods.geojson']);
  t.ok(expanded.fileLoadingProgress['extra.csv']);
  t.end();
});

test('#visStateReducer -> LOAD_FILES keeps a single shapefile zip name', t => {
  drainTasksForTesting();

  const initialState = CloneDeep(InitialState).visState;
  const zipFile = {type: 'application/zip', name: 'places.zip'};
  const nextState = reducer(initialState, VisStateActions.loadFiles([zipFile]));
  const [expandTask] = drainTasksForTesting();
  const shapefile = {name: 'places.shp'};
  const dbf = {name: 'places.dbf'};
  const expanded = reducer(
    nextState,
    succeedTaskInTest(expandTask, {
      kind: 'shapefile',
      shapefile,
      companions: [dbf]
    })
  );
  const [loadTask] = drainTasksForTesting();

  t.equal(loadTask.type, 'LOAD_FILE_TASK');
  t.equal(loadTask.payload.file, shapefile, 'the shapefile inside the zip is parsed');
  t.equal(
    loadTask.payload.fileName,
    'places.zip',
    'progress and the dataset label stay the zip name'
  );
  t.deepEqual(
    loadTask.payload.companionFiles.map(file => file.name),
    ['places.shp', 'places.dbf', 'places.zip'],
    'sidecars are available while the shapefile parses'
  );
  t.equal(expanded.fileLoading.filesToLoad.length, 0);
  t.equal(expanded.fileLoadingProgress['places.zip'].message, 'loading...');
  t.equal(expanded.fileLoadingProgress['places.shp'], undefined);
  t.end();
});

test('#visStateReducer -> LOAD_FILES passes custom loader extensions into a zip', t => {
  drainTasksForTesting();

  const initialState = {
    ...CloneDeep(InitialState).visState,
    loaders: [{extensions: ['.custom']}]
  };
  const zipFile = {type: 'application/zip', name: 'bundle.zip'};
  reducer(initialState, VisStateActions.loadFiles([zipFile]));
  const [expandTask] = drainTasksForTesting();

  t.deepEqual(
    expandTask.payload,
    {file: zipFile, extensions: ['custom']},
    'custom loader extensions are unpacked with the zip'
  );
  t.end();
});

test('#visStateReducer -> LOAD_FILES ignores a stale zip error', t => {
  drainTasksForTesting();

  const initialState = CloneDeep(InitialState).visState;
  const first = reducer(initialState, VisStateActions.loadFiles([{name: 'first.zip'}]));
  const [expandTask] = drainTasksForTesting();
  const second = reducer(first, VisStateActions.loadFiles([{name: 'second.csv'}]));
  drainTasksForTesting();

  const errored = reducer(second, errorTaskInTest(expandTask, new Error('bad zip')));
  t.equal(errored, second, 'a zip error from the previous load does not touch the new one');
  t.equal(drainTasksForTesting().length, 0, 'the stale error does not advance the new queue');
  t.end();
});

test('#visStateReducer -> LOAD_FILES autoCreateLayers option', t => {
  drainTasksForTesting();

  const initialState = CloneDeep(InitialState).visState;
  const mockFiles = [{type: 'text/csv', name: 'test-file.csv'}];
  const nextState = reducer(
    initialState,
    VisStateActions.loadFiles(mockFiles, undefined, {autoCreateLayers: false})
  );

  t.equal(
    nextState.fileLoading.options.autoCreateLayers,
    false,
    'should keep autoCreateLayers on the in-progress file load'
  );

  drainTasksForTesting();
  t.end();
});

test('#visStateReducer -> LOAD_FILES deferAddToMap', t => {
  drainTasksForTesting();

  const initialState = CloneDeep(InitialState).visState;
  const mockFiles = [{type: 'text/csv', name: 'test-file.csv'}];
  const nextState = reducer(
    initialState,
    VisStateActions.loadFiles(mockFiles, VisStateActions.stageLoadedFiles, {deferAddToMap: true})
  );

  t.equal(
    nextState.fileLoading.onFinish,
    VisStateActions.stageLoadedFiles,
    'should stage instead of adding'
  );
  t.equal(
    nextState.fileLoading.options.deferAddToMap,
    true,
    'should keep deferAddToMap on the load'
  );

  const alreadyStaged = [{info: {label: 'points.csv'}}];
  const withStaged = {...initialState, stagedToAdd: alreadyStaged};
  const deferred = reducer(
    withStaged,
    VisStateActions.loadFiles(mockFiles, VisStateActions.stageLoadedFiles, {deferAddToMap: true})
  );
  t.equal(deferred.stagedToAdd, alreadyStaged, 'should keep files already staged for Add Data');

  const replaced = reducer(withStaged, VisStateActions.loadFiles(mockFiles));
  t.equal(replaced.stagedToAdd, null, 'should clear staged files when adding them immediately');

  drainTasksForTesting();
  const remote = remoteDatasetFromUrl('https://example.com/quakes.csv');
  const hydrating = reducer(
    CloneDeep(InitialState).visState,
    VisStateActions.updateVisData([remote])
  );
  t.equal(
    hydrating.loadingProgress[remote.info.id],
    0,
    'adding a staged remote url should start the remote download'
  );
  t.equal(
    hydrating.datasets[remote.info.id],
    undefined,
    'should not insert rows before the download'
  );
  drainTasksForTesting();

  const queued = reducer(
    nextState,
    VisStateActions.loadFiles(
      [{type: 'text/csv', name: 'extra.csv'}],
      VisStateActions.stageLoadedFiles,
      {
        deferAddToMap: true
      }
    )
  );
  t.deepEqual(
    queued.fileLoading.filesToLoad.map(file => file.name),
    ['extra.csv'],
    'a second drop waits behind the file already parsing'
  );
  t.equal(
    queued.fileLoading.fileCache,
    nextState.fileLoading.fileCache,
    'should keep the in-progress cache'
  );
  t.ok(queued.fileLoadingProgress['test-file.csv'], 'should keep progress for the first file');
  t.ok(queued.fileLoadingProgress['extra.csv'], 'should show progress for the queued file');

  const readyToFinish = {
    ...nextState,
    fileLoading: {
      ...nextState.fileLoading,
      filesToLoad: [],
      fileCache: [{info: {label: 'test-file.csv'}}]
    }
  };
  const droppedDuringPause = reducer(
    readyToFinish,
    VisStateActions.loadFiles(
      [{type: 'text/csv', name: 'late.csv'}],
      VisStateActions.stageLoadedFiles,
      {deferAddToMap: true}
    )
  );
  const continued = reducer(droppedDuringPause, VisStateActions.loadNextFile());
  t.equal(
    continued.fileLoadingProgress['late.csv'].message,
    'loading...',
    'a file dropped during the finish pause starts parsing'
  );
  t.equal(
    continued.fileLoading.fileCache,
    readyToFinish.fileLoading.fileCache,
    'should keep the parsed files while the queued file loads'
  );

  const canceled = reducer(readyToFinish, VisStateActions.clearStagedLoadedFiles());
  drainTasksForTesting();
  const ignored = reducer(canceled, VisStateActions.loadNextFile(readyToFinish.fileLoading.loadId));
  t.equal(ignored.fileLoading, false, 'a canceled load is not resumed');
  t.equal(ignored.stagedToAdd, null, 'cancel stays discarded');
  t.equal(drainTasksForTesting().length, 0, 'a canceled pause does not stage files');

  const restarted = reducer(
    canceled,
    VisStateActions.loadFiles(
      [{type: 'text/csv', name: 'fresh.csv'}],
      VisStateActions.stageLoadedFiles,
      {deferAddToMap: true}
    )
  );
  drainTasksForTesting();
  const stale = reducer(restarted, VisStateActions.loadNextFile(readyToFinish.fileLoading.loadId));
  t.equal(stale.fileLoading, restarted.fileLoading, 'a stale pause does not replace the new load');
  t.equal(drainTasksForTesting().length, 0, 'a stale pause does not stage or parse');

  const cleared = reducer(nextState, VisStateActions.clearStagedLoadedFiles());
  t.equal(cleared.fileLoading, false, 'cancel should stop the in-progress load');
  t.equal(cleared.stagedToAdd, null, 'cancel should drop staged files');

  drainTasksForTesting();
  t.end();
});

test('#visStateReducer -> local dataset is not blocked by a remote download', t => {
  drainTasksForTesting();
  const local = {
    info: {id: 'local-points', label: 'points.csv'},
    data: processCsvData('lat,lng\n1,2')
  };
  const remote = remoteDatasetFromUrl('https://example.com/slow.csv');
  const nextState = reducer(
    CloneDeep(InitialState).visState,
    VisStateActions.updateVisData([local, remote])
  );
  const tasks = drainTasksForTesting();
  const ready = tasks.find(
    task => task.label.includes('CREATE_TABLE_TASK') && !task.label.includes('HYDRATE')
  );
  const remoteTask = tasks.find(task =>
    task.label.includes('HYDRATE_EXTERNALLY_HOSTED_DATASET_TASK')
  );

  t.ok(ready, 'should commit the parsed dataset on its own');
  t.ok(remoteTask, 'should download the remote dataset separately');
  t.equal(
    nextState.datasets['local-points'],
    undefined,
    'parsed rows are inserted by the ready task'
  );
  t.equal(nextState.loadingProgress[remote.info.id], 0, 'remote download stays in progress');

  ready.run(
    (effect, resolve, reject, ctx) => effect(resolve, reject, ctx),
    action => {
      const added = reducer(nextState, action);
      t.equal(
        added.datasets['local-points'].id,
        'local-points',
        'local dataset is added before the remote download'
      );
      t.equal(added.datasets[remote.info.id], undefined, 'remote dataset is still absent');
      t.equal(
        added.loadingIndicatorValue > 0,
        true,
        'loading indicator stays up for the remote download'
      );
      t.end();
    },
    err => {
      t.error(err);
      t.end();
    }
  );
});

test('#visStateReducer -> deferred empty queue stages the parsed files', t => {
  drainTasksForTesting();
  const onFinish = sinon.spy(VisStateActions.stageLoadedFiles);
  const initialState = CloneDeep(InitialState).visState;
  const loading = reducer(
    initialState,
    VisStateActions.loadFiles([{type: 'text/csv', name: 'points.csv'}], onFinish, {
      deferAddToMap: true
    })
  );
  drainTasksForTesting();
  const cache = [{info: {label: 'points.csv', format: 'csv'}, data: []}];
  const ready = {
    ...loading,
    fileLoading: {
      ...loading.fileLoading,
      filesToLoad: [],
      fileCache: cache
    }
  };
  reducer(ready, VisStateActions.loadNextFile());
  const [task, ...rest] = drainTasksForTesting();
  t.equal(rest.length, 0, 'should create 1 task');
  t.equal(task.type, 'ACTION_TASK', 'an empty deferred queue finishes the load');
  const action = succeedTaskInTest(task);
  t.equal(onFinish.calledOnce, true, 'should stage the parsed files');
  t.deepEqual(onFinish.lastCall.args[0], cache, 'should stage the parsed cache');
  t.deepEqual(
    onFinish.lastCall.args[1],
    {deferAddToMap: true},
    'should keep the deferred load options'
  );
  t.equal(action.loadId, ready.fileLoading.loadId, 'the finish belongs to this load');
  t.end();
});

test('#visStateReducer -> deferred arrow batches are not added early', t => {
  drainTasksForTesting();
  const previousProgressiveLoading = getApplicationConfig().useArrowProgressiveLoading;
  const batch = {
    gen: {next: () => Promise.resolve({done: true, value: null})},
    fileName: 'data.arrow',
    progress: {percent: 0.4},
    accumulated: {data: [{value: 1}], fileName: 'data.arrow'},
    onFinish: VisStateActions.stageLoadedFiles
  };
  try {
    reducer(
      CloneDeep(InitialState).visState,
      VisStateActions.nextFileBatch({...batch, options: {deferAddToMap: true}})
    );
    const deferredTasks = drainTasksForTesting();
    t.equal(
      deferredTasks.some(task => task.type === 'PROCESS_FILE_CONTENT'),
      false,
      'a deferred arrow file waits until parsing finishes'
    );

    initApplicationConfig({useArrowProgressiveLoading: false});
    reducer(CloneDeep(InitialState).visState, VisStateActions.nextFileBatch(batch));
    const disabledTasks = drainTasksForTesting();
    t.equal(
      disabledTasks.some(task => task.type === 'PROCESS_FILE_CONTENT'),
      false,
      'an arrow file waits until parsing finishes when progressive loading is disabled'
    );

    initApplicationConfig({useArrowProgressiveLoading: true});
    reducer(CloneDeep(InitialState).visState, VisStateActions.nextFileBatch(batch));
    const immediateTasks = drainTasksForTesting();
    t.equal(
      immediateTasks.some(task => task.type === 'PROCESS_FILE_CONTENT'),
      true,
      'an arrow file still adds each batch when it is not deferred'
    );
  } finally {
    initApplicationConfig({useArrowProgressiveLoading: previousProgressiveLoading});
  }
  t.end();
});

test('#visStateReducer -> setLayerAnimationTimeConfig', t => {
  // change Trip layer isVisible
  const nextState = reducer(
    StateWTripGeojson.visState,
    VisStateActions.setLayerAnimationTimeConfig({
      timezone: 'America/New_York',
      timeFormat: 'YYYY-MM-DD',
      random: 1
    })
  );

  t.equal(
    nextState.animationConfig.timezone,
    'America/New_York',
    'should set animationConfig timezone'
  );
  t.equal(
    nextState.animationConfig.timeFormat,
    'YYYY-MM-DD',
    'should set animationConfig timeFormat'
  );
  t.equal(nextState.animationConfig.random, undefined, 'should not set unknown key');
  t.end();
});

test('#visStateReducer -> setFilterAnimationTimeConfig', t => {
  // change Trip layer isVisible
  const nextState = reducer(
    StateWFilters.visState,
    VisStateActions.setFilterAnimationTimeConfig(1, {timezone: 'America/New_York'})
  );

  t.equal(nextState, StateWFilters.visState, 'should not change if is not time filter');

  const nextState1 = reducer(
    StateWFilters.visState,
    VisStateActions.setFilterAnimationTimeConfig(0, {timezone: 'America/New_York'})
  );
  t.equal(nextState1.filters[0].timezone, 'America/New_York', 'should set filter timeFormat');
  t.end();
});

test('#visStateReducer -> layerFilteredItemsChange', t => {
  const mockEvent = {
    id: 'point-layer-1',
    count: 100
  };
  const layer = StateWFiles.visState.layers[0];
  const _nextState = reducer(
    StateWFiles.visState,
    VisStateActions.layerFilteredItemsChange(layer, mockEvent)
  );
  const expected = {'point-layer-1': 100};

  t.deepEqual(layer.filteredItemCount, expected, 'should set filteredItemCount on layer');

  t.end();
});

test('#visStateReducer -> applyFilterFieldName', t => {
  const stateToSave = CloneDeep(StateWFilters);

  const oldFilter = stateToSave.visState.filters[0];
  const datasets = stateToSave.visState.datasets;
  const {filter: newFilter} = applyFilterFieldName(
    oldFilter,
    datasets,
    oldFilter.dataId,
    oldFilter.name[0]
  );
  t.deepEqual(
    oldFilter.plotType,
    newFilter.plotType,
    'Should not overwrite plotType (by the default empty object)'
  );

  t.end();
});

function mockStateWithFilterAndIntervalBasedAnimationLayer() {
  let visState = stateWithTimeFilterAndTripLayer().visState;
  visState = reducer(visState, VisStateActions.addLayer());
  const mockedMetaData = {
    minZoom: 0,
    maxZoom: 4,
    fields: [
      {
        id: 'Fires',
        name: 'Fires',
        type: 'real',
        analyzerType: 'FLOAT',
        format: '',
        filterProps: {
          fieldType: 'real',
          domain: [1, 400],
          domainStops: {
            z: [0, 1, 2, 3],
            stops: [
              [1, 100],
              [1, 200],
              [1, 300],
              [1, 400]
            ],
            interpolation: 'interpolate'
          },
          domainQuantiles: {
            z: [0, 1, 2, 3],
            quantiles: Array.from({length: 4}).map(() => [0, 10])
          },
          histogram: null,
          value: [1, 400],
          type: 'range',
          typeOptions: ['range'],
          gpu: true,
          step: 1
        },
        indexBy: {
          format: 'x',
          type: 'timestamp',
          mappedValue: {
            1580515200000: 'Fires|1580515200000',
            1583020800000: 'Fires|1583020800000',
            1585699200000: 'Fires|1585699200000',
            1588291200000: 'Fires|1588291200000'
          },
          timeDomain: {
            domain: [1580515200000, 1588291200000],
            timeSteps: [1580515200000, 1583020800000, 1585699200000, 1588291200000],
            duration: 1000
          }
        }
      }
    ],
    resolutionOffset: 4,
    targetTimeInterval: LayerTimeInterval.DAY,
    tilesetIndex: undefined,
    zipUrl: undefined
  };

  const lastLayerIndex = visState.layers.length - 1;
  const layer = visState.layers[lastLayerIndex];
  layer.meta = mockedMetaData;
  layer.config = {
    ...visState.layers[lastLayerIndex].config,
    animation: {
      domain: visState.animationConfig.domain,
      timeSteps: visState.animationConfig.domain,
      duration: 1000,
      enabled: true,
      startTime: visState.animationConfig.domain[0]
    }
  };

  visState.layers[lastLayerIndex] = layer;

  return visState;
}

test('#visStateReducer -> sync with time filter with trip layer', t => {
  let visState = mockStateWithSyncedFilterAndTripLayer().visState;

  const animatableLayers = getAnimatableVisibleLayers(visState.layers);
  t.equal(animatableLayers.length, 1, 'Should find 1 animatable layer');
  t.equal(animatableLayers[0].type, LAYER_TYPES.trip, 'Should find 1 animatable trip layer');

  const originalDomain = [...visState.filters[0].domain];

  // ============
  // Enable sync
  // ============
  visState = syncTimeFilterWithLayerTimelineUpdater(visState, {
    idx: 0,
    enable: true
  });

  let newFilter = visState.filters[0];

  // check syncedWithLayerTimeline
  t.equal(
    newFilter.syncedWithLayerTimeline,
    true,
    'Should have set syncedWithLayerTimeline to true'
  );

  // check animation window wasn't updated
  t.equal(newFilter.animationWindow, visState.filters[0].animationWindow);

  // check syncTimelineMode
  t.equal(
    newFilter.syncTimelineMode,
    SYNC_TIMELINE_MODES.end,
    'Should have set syncTimelineMode to SYNC_TIMELINE_MODES.end'
  );

  // check filter domains
  t.deepEqual(newFilter.domain, originalDomain, 'Should not change the domain value');

  // check filter value
  t.deepEqual(
    newFilter.value,
    [1564174363000, 1564184336370],
    'Should have set filter value by combining filter and animationConfig domains'
  );

  // check animationConfig value
  t.equal(
    visState.animationConfig.currentTime,
    newFilter.value[newFilter.syncTimelineMode],
    'Should have set animationConfig value to filter value[0]'
  );

  visState = setFilterAnimationTimeUpdater(visState, {
    idx: 0,
    prop: 'value',
    value: [1474588800000, 1474588800010]
  });

  newFilter = visState.filters[0];
  t.equal(
    visState.animationConfig.currentTime,
    newFilter.value[newFilter.syncTimelineMode],
    'Animation config current time value should match the filter value newFilter.syncTimelineMode=SYNC_TIMELINE_MODES.end'
  );

  // update syncTimelineMode
  visState = setTimeFilterTimelineModeUpdater(visState, {
    id: newFilter.id,
    mode: SYNC_TIMELINE_MODES.start
  });

  newFilter = visState.filters[0];

  // check syncTimelineMode
  t.equal(
    newFilter.syncTimelineMode,
    SYNC_TIMELINE_MODES.start,
    'Should have set syncTimelineMode to SYNC_TIMELINE_MODES.start'
  );
  // check animation config new value
  t.equal(
    visState.animationConfig.currentTime,
    newFilter.value[newFilter.syncTimelineMode],
    'Animation config current time value should match the filter value newFilter.syncTimelineMode=SYNC_TIMELINE_MODES.start'
  );

  // update filter animation window to INCREMENTAL
  visState = setFilterAnimationWindowUpdater(visState, {
    id: newFilter.id,
    animationWindow: ANIMATION_WINDOW.incremental
  });
  newFilter = visState.filters[0];

  // check syncTimelineMode is back to SYNC_TIMELINE_MODES.end
  t.equal(
    newFilter.syncTimelineMode,
    SYNC_TIMELINE_MODES.end,
    'SyncTimelineMode should be set to SYNC_TIMELINE_MODES.end when we switch to incremental mode'
  );

  // check animationConfig currentTime should be set to filter.value[filter.syncTimelineMode]
  t.equal(
    visState.animationConfig.currentTime,
    newFilter.value[newFilter.syncTimelineMode],
    'SyncTimelineMode should be set to SYNC_TIMELINE_MODES.end when we switch to incremental mode'
  );

  // update filter animation window to INCREMENTAL
  visState = setFilterAnimationWindowUpdater(visState, {
    id: newFilter.id,
    animationWindow: ANIMATION_WINDOW.interval
  });
  newFilter = visState.filters[0];

  // check syncTimelineMode should stay the same
  t.equal(
    newFilter.syncTimelineMode,
    SYNC_TIMELINE_MODES.end,
    'SyncTimelineMode should be set to SYNC_TIMELINE_MODES.end when we switch to incremental mode'
  );

  // check animationConfig currentTime value should stay the same
  t.equal(
    visState.animationConfig.currentTime,
    newFilter.value[newFilter.syncTimelineMode],
    'SyncTimelineMode should remain the same with interval mode'
  );

  // ============
  // Disable sync
  // ============

  visState = syncTimeFilterWithLayerTimelineUpdater(visState, {
    idx: 0,
    enable: false
  });

  newFilter = visState.filters[0];

  t.equal(
    newFilter.animationWindow,
    ANIMATION_WINDOW.interval,
    'Should keep the same filter animationWindow value'
  );

  // check syncedWithLayerTimeline
  t.equal(
    newFilter.syncedWithLayerTimeline,
    false,
    'Should have set syncedWithLayerTimeline to false'
  );

  // check syncTimelineMode
  t.equal(
    newFilter.syncTimelineMode,
    SYNC_TIMELINE_MODES.end,
    'Should have set syncTimelineMode to end (1)'
  );

  // check filter domains
  t.deepEqual(newFilter.domain, originalDomain, 'Should not change the domain value');

  // check filter value
  t.deepEqual(newFilter.value, newFilter.domain, 'Should have set filter value to match domain');

  // check animationConfig value
  t.equal(
    visState.animationConfig.currentTime,
    visState.animationConfig.domain[0],
    'Should have set animationConfig value to filter value[0]'
  );

  t.end();
});

test('#visStateReducer -> sync with time filter with interval-based animation layer', t => {
  let visState = mockStateWithFilterAndIntervalBasedAnimationLayer();
  const animatableLayers = getAnimatableVisibleLayers(visState.layers);
  t.equal(animatableLayers.length, 2, 'Should find 1 animatable layer');
  t.equal(animatableLayers[0].type, LAYER_TYPES.trip, 'Should find 1 animatable trip layer');

  const originalDomain = [...visState.filters[0].domain];

  // ============
  // Enable sync
  // ============
  visState = syncTimeFilterWithLayerTimelineUpdater(visState, {
    idx: 0,
    enable: true
  });

  let newFilter = visState.filters[0];

  // check syncedWithLayerTimeline
  t.equal(
    newFilter.syncedWithLayerTimeline,
    true,
    'Should have set syncedWithLayerTimeline to true'
  );

  // check syncTimelineMode
  t.equal(
    newFilter.syncTimelineMode,
    SYNC_TIMELINE_MODES.end,
    'Should have set syncTimelineMode to SYNC_TIMELINE_MODES.end (1)'
  );

  // check animation window to interval
  t.equal(
    newFilter.animationWindow,
    ANIMATION_WINDOW.interval,
    'Should have set filter animation window to interval'
  );

  // check plotType interval to match the layer time interval
  t.equal(
    newFilter.plotType.interval,
    INTERVAL['1-day'],
    'Should have set plotType interval to 1-day'
  );

  // check filter domains
  t.deepEqual(newFilter.domain, originalDomain, 'Should not change the domain value');

  // check filter value
  t.deepEqual(
    newFilter.value,
    [1421348739000, 1421348739000],
    'Should have set filter value to the first interval step'
  );

  // check animationConfig value
  t.equal(
    visState.animationConfig.currentTime,
    newFilter.value[newFilter.syncTimelineMode],
    'Should have set animationConfig value to filter value[0]'
  );

  // ============
  // Disable sync
  // ============
  visState = syncTimeFilterWithLayerTimelineUpdater(visState, {
    idx: 0,
    enable: false
  });

  newFilter = visState.filters[0];

  // check syncedWithLayerTimeline
  t.equal(
    newFilter.syncedWithLayerTimeline,
    false,
    'Should have set syncedWithLayerTimeline to false'
  );

  // check syncTimelineMode
  t.equal(
    newFilter.syncTimelineMode,
    SYNC_TIMELINE_MODES.end,
    'Should have set syncTimelineMode to end (1)'
  );

  // check filter domains
  t.deepEqual(newFilter.domain, originalDomain, 'Should not change the domain value');

  // check filter value
  t.deepEqual(newFilter.value, newFilter.domain, 'Should have set filter value to match domain');

  // check animationConfig value
  t.equal(
    visState.animationConfig.currentTime,
    visState.animationConfig.domain[0],
    'Should have set animationConfig value to filter value[0]'
  );

  t.end();
});

test('VisStateUpdater -> prepareStateForDatasetReplace', t => {
  const oldTooltipConfigFields =
    StateWFilters.visState.interactionConfig.tooltip.config.fieldsToShow;
  const dataIdToUse = 'taro_and_blue';
  const nextState = prepareStateForDatasetReplace(
    StateWFilters.visState,
    testCsvDataId,
    dataIdToUse
  );

  // layers
  t.equal(nextState.layers.length, 1, 'should keep 1 layer');
  t.equal(nextState.layers[0], StateWFilters.visState.layers[1], 'should keep 1 layer');
  t.equal(nextState.layerToBeMerged.length, 1, 'should move 1 layer to layerToBeMerged');
  t.equal(
    nextState.layerToBeMerged[0].id,
    StateWFilters.visState.layers[0].id,
    'should move 1 layer to layerToBeMerged'
  );
  t.equal(nextState.layerToBeMerged[0].config.dataId, dataIdToUse, 'should replace layer dataId');

  // filers
  t.equal(nextState.filters.length, 1, 'should keep 1 filter');
  t.equal(nextState.filters[0], StateWFilters.visState.filters[1], 'should keep 1 filter');
  t.equal(nextState.filterToBeMerged.length, 1, 'should move 1 filter to filterToBeMerged');
  t.equal(
    nextState.filterToBeMerged[0].id,
    StateWFilters.visState.filters[0].id,
    'should move 1 filter to filterToBeMerged'
  );

  t.deepEqual(nextState.filterToBeMerged[0].dataId, [dataIdToUse], 'should replace filter dataId');

  // preserveLayerOrder
  t.deepEqual(
    nextState.layerOrder,
    ['geojson-1', 'point-0'],
    'should not remove layer from layer order'
  );
  t.deepEqual(
    nextState.preserveLayerOrder,
    ['geojson-1', 'point-0'],
    'should save preserved layer order'
  );

  // interactionConfig
  t.deepEqual(
    nextState.interactionConfig.tooltip.config.fieldsToShow,
    {[testGeoJsonDataId]: oldTooltipConfigFields[testGeoJsonDataId]},
    'Should only keep geojson dataset tooltip'
  );
  t.deepEqual(
    nextState.interactionToBeMerged,
    {
      tooltip: {enabled: true, fieldsToShow: {[dataIdToUse]: oldTooltipConfigFields[testCsvDataId]}}
    },
    'should move tooltip config to interactionToBeMerged'
  );

  // preserveDatasetOrder
  t.deepEqual(
    nextState.preserveDatasetOrder,
    [dataIdToUse, testGeoJsonDataId],
    'should save dataset id to preserveDatasetOrder'
  );

  // preserveFilterOrder
  t.deepEqual(
    nextState.preserveFilterOrder,
    ['time-0', 'RATE-1'],
    'should save filter id to preserveFilterOrder'
  );

  t.end();
});

test('VisStateUpdater -> addLayer with empty column', t => {
  const initialState = StateWFiles.visState;
  const oldLayers = initialState.layers;
  let nextState;
  t.doesNotThrow(() => {
    nextState = reducer(
      initialState,
      VisStateActions.addLayer({
        type: 'point',
        id: 'taro-xxx',
        config: {
          dataId: testCsvDataId
          // no column
        }
      })
    );
  }, 'should not throw error when add layer with empty column');

  t.equal(nextState.layers.length, oldLayers.length + 1, 'should create 1 layer');
  const newLayer = nextState.layers[nextState.layers.length - 1];

  t.equal(newLayer.id, 'taro-xxx', 'newlayer should have correct id');
  t.equal(newLayer.type, 'point', 'newlayer should have correct type');
  t.deepEqual(
    newLayer.config.columns.lat,
    {value: null, fieldIdx: -1},
    'newlayer column should be value: null'
  );

  t.deepEqual(
    nextState.layerData[nextState.layerData.length - 1],
    {},
    'newlayer layerData should be empty'
  );

  t.end();
});

test('VisStateUpdater -> applyLayerConfig', t => {
  const initialState = StateWFiles.visState;
  const oldLayers = initialState.layers;

  const oldLayerIndex = 0;
  const oldLayer = oldLayers[oldLayerIndex];
  const oldLayerId = oldLayer.id;
  const {schema} = initialState;
  const layerToJson = layer =>
    schema.getConfigToSave({
      visState: {layers: [layer], layerOrder: [layer.id]}
    }).config.visState.layers?.[0];
  const oldLayerDataset = initialState.datasets[oldLayer.config.dataId];
  const transformConfig = transform => transform(layerToJson(oldLayer, schema));
  const getUpdatedLayerJson = state => layerToJson(state.layers[oldLayerIndex], schema);

  let nextState;

  nextState = reducer(
    initialState,
    VisStateActions.applyLayerConfig(
      oldLayerId,
      transformConfig(layer => {
        layer.config.isVisible = false;
        layer.config.label = 'New label';
        return layer;
      })
    )
  );
  t.equal(getUpdatedLayerJson(nextState).config.isVisible, false, 'should change isVisible');
  t.equal(getUpdatedLayerJson(nextState).config.label, 'New label', 'should change label');

  nextState = reducer(
    initialState,
    VisStateActions.applyLayerConfig(
      oldLayerId,
      transformConfig(layer => {
        layer.config.columns = {
          lng: 'gps_data.lat',
          lat: 'gps_data.lng'
        };
        return layer;
      })
    )
  );
  t.equal(
    getUpdatedLayerJson(nextState).config.columns.lng,
    'gps_data.lat',
    'should change lng column'
  );
  t.equal(
    getUpdatedLayerJson(nextState).config.columns.lat,
    'gps_data.lng',
    'should change lat column'
  );

  nextState = reducer(
    initialState,
    VisStateActions.applyLayerConfig(
      oldLayerId,
      transformConfig(layer => {
        layer.config.textLabel = {field: {name: 'gps_data.types', type: 'string'}};
        return layer;
      })
    )
  );
  t.equal(
    getUpdatedLayerJson(nextState).config.textLabel?.[0]?.field?.name,
    'gps_data.types',
    'should change text label'
  );

  nextState = reducer(
    initialState,
    VisStateActions.applyLayerConfig(
      oldLayerId,
      transformConfig(layer => {
        layer.visualChannels.colorField = {name: 'gps_data.lat', type: 'real'};
        layer.visualChannels.colorScale = 'quantize';
        return layer;
      })
    )
  );
  t.equal(
    getUpdatedLayerJson(nextState).visualChannels.colorField?.name,
    'gps_data.lat',
    'should change visualChannel colorField'
  );
  t.equal(
    getUpdatedLayerJson(nextState).visualChannels.colorScale,
    'quantize',
    'should change visualChannel colorScale'
  );

  t.throws(() => {
    validateLayerWithData(
      oldLayerDataset,
      transformConfig(layer => {
        layer.config.textLabel = {field: {name: 'INVALID', type: 'string'}};
        return layer;
      }),
      initialState.layerClasses,
      {throwOnError: true}
    );
  }, 'validation should throw error for invalid text label');

  t.throws(() => {
    validateLayerWithData(
      oldLayerDataset,
      transformConfig(layer => {
        layer.config.columns = {
          lng: 'INVALID COLUMN'
        };
        return layer;
      }),
      initialState.layerClasses,
      {throwOnError: true}
    );
  }, 'validation should throw error for invalid columns');

  nextState = reducer(
    initialState,
    VisStateActions.applyLayerConfig(
      oldLayerId,
      transformConfig(layer => {
        layer.config.dataId = 'INVALID DATA ID';
        return layer;
      })
    )
  );
  t.equal(
    getUpdatedLayerJson(nextState).config.dataId,
    oldLayer.config.dataId,
    'should not change data id to invalid one'
  );
  t.deepEqual(
    getUpdatedLayerJson(nextState),
    layerToJson(oldLayer, schema),
    'should not change on invalid data id'
  );

  nextState = reducer(
    initialState,
    VisStateActions.applyLayerConfig(
      oldLayerId,
      transformConfig(layer => {
        layer.type = '3D';
        return layer;
      })
    )
  );
  t.equal(getUpdatedLayerJson(nextState).type, '3D', 'should change layer type');

  nextState = reducer(
    initialState,
    VisStateActions.applyLayerConfig(
      oldLayerId,
      transformConfig(layer => {
        layer.visualChannels.colorField = {name: 'gps_data.lat', type: 'real'};
        layer.visualChannels.colorScale = 'quantile';
        return layer;
      })
    )
  );
  t.equal(
    getUpdatedLayerJson(nextState).visualChannels.colorField?.name,
    'gps_data.lat',
    'should set colorField'
  );

  const parsedLayer = serializeLayer(nextState.layers[oldLayerIndex], schema);
  const parsedWithRadius = CloneDeep(parsedLayer);
  parsedWithRadius.config.visConfig.radius = 25;
  const afterParsedRadius = reducer(
    nextState,
    VisStateActions.applyLayerConfig(oldLayerId, parsedWithRadius)
  );
  t.equal(
    getUpdatedLayerJson(afterParsedRadius).visualChannels.colorField?.name,
    'gps_data.lat',
    'parsed-format radius change should keep colorField'
  );
  t.equal(
    getUpdatedLayerJson(afterParsedRadius).config.visConfig.radius,
    25,
    'parsed-format radius change should update radius'
  );

  t.end();
});

test('#VisStateUpdater -> addEffect', t => {
  const initialState = InitialState.visState;

  let nextState = reducer(initialState, VisStateActions.addEffect({}));

  t.equal(nextState.effects.length, 1, 'should add a default effect');

  const expectedEffect = {
    type: 'ink',
    isEnabled: true,
    isConfigActive: true,
    parameters: {strength: 0.25}
  };

  cmpEffects(t, expectedEffect, nextState.effects[0]);

  nextState = reducer(
    nextState,
    VisStateActions.addEffect({
      id: 'e_shadow',
      type: LIGHT_AND_SHADOW_EFFECT.type,
      parameters: {timestamp: 1689280466362, timezone: 'UTC'}
    })
  );

  t.equal(nextState.effects.length, 2, 'should add second effect');

  nextState = reducer(
    nextState,
    VisStateActions.addEffect({
      type: LIGHT_AND_SHADOW_EFFECT.type
    })
  );

  t.equal(
    nextState.effects.length,
    2,
    `shouldn't add second ${LIGHT_AND_SHADOW_EFFECT.name} effect`
  );

  const expectedEffect2 = {
    id: 'e_shadow',
    type: 'lightAndShadow',
    isConfigActive: true,
    isEnabled: true,
    parameters: {
      timestamp: 1689280466362,
      timezone: 'UTC',
      timeMode: 'pick',
      shadowIntensity: 0.5,
      shadowColor: [0, 0, 0],
      sunLightColor: [255, 255, 255],
      sunLightIntensity: 1,
      ambientLightColor: [255, 255, 255],
      ambientLightIntensity: 1
    }
  };

  cmpEffects(t, expectedEffect2, nextState.effects[1], {id: true});

  t.equal(
    nextState.effects[0].isConfigActive,
    false,
    "first effect's configurator should be collapsed"
  );

  nextState = reducer(nextState, VisStateActions.addEffect({}));

  t.equal(nextState.effectOrder.length, 3, 'should be 3 ids in effectOrder');

  t.equal(nextState.effectOrder[0], 'e_shadow', 'shadow effect should stay as first effect');

  t.end();
});

test('#VisStateUpdater -> updateEffect', t => {
  const initialState = InitialState.visState;

  let nextState = reducer(initialState, VisStateActions.addEffect({id: 'e_1'}));
  nextState = reducer(nextState, VisStateActions.addEffect({}));
  nextState = reducer(nextState, VisStateActions.addEffect({id: 'e_3'}));

  const expectedEffect = {
    id: 'e_1',
    type: 'ink',
    isEnabled: false,
    isConfigActive: false,
    parameters: {
      strength: 0.06
    }
  };

  nextState = reducer(nextState, VisStateActions.updateEffect('e_1', expectedEffect));

  cmpEffects(t, expectedEffect, nextState.effects[0], {id: true});

  // non-existing id, shouldn't fail
  nextState = reducer(nextState, VisStateActions.updateEffect('fake_id', {}));

  // update effect id
  nextState = reducer(nextState, VisStateActions.updateEffect('e_1', {id: 'e_2'}));
  cmpEffects(t, {...expectedEffect, id: 'e_2'}, nextState.effects[0], {id: true});
  t.equal(nextState.effectOrder[2], 'e_2', 'Effect id should be updated');

  // update effect to an existing effect id
  nextState = reducer(nextState, VisStateActions.updateEffect('e_2', {id: 'e_3'}));
  cmpEffects(t, {...expectedEffect, id: 'e_2'}, nextState.effects[0], {id: true});
  t.equal(nextState.effectOrder[2], 'e_2', "Effect id shouldn't be updated");

  t.end();
});

test('#VisStateUpdater -> updateEffect: skip no-op timestamp', t => {
  const initialState = InitialState.visState;
  let nextState = reducer(
    initialState,
    VisStateActions.addEffect({id: 'e_shadow', type: LIGHT_AND_SHADOW_EFFECT.type})
  );
  const shadow = nextState.effects.find(e => e.id === 'e_shadow');
  const timestamp = shadow.parameters.timestamp;

  const afterSameTimestamp = reducer(
    nextState,
    VisStateActions.updateEffect('e_shadow', {parameters: {timestamp}})
  );
  t.equal(
    afterSameTimestamp,
    nextState,
    'timestamp-only no-op should return the same visState reference'
  );

  const afterNewTimestamp = reducer(
    nextState,
    VisStateActions.updateEffect('e_shadow', {parameters: {timestamp: timestamp + 60000}})
  );
  t.notEqual(afterNewTimestamp, nextState, 'a new timestamp should still produce a new visState');
  t.equal(
    afterNewTimestamp.effects.find(e => e.id === 'e_shadow').parameters.timestamp,
    timestamp + 60000,
    'timestamp should update when the value actually changes'
  );

  t.end();
});

test('#VisStateUpdater -> addEffect: invalid effect parameters', t => {
  const initialState = InitialState.visState;

  const nextState = reducer(
    initialState,
    VisStateActions.addEffect({
      id: 'e_1',
      type: 'lightAndShadow',
      parameters: {
        timestamp: 'x',
        shadowIntensity: 2,
        sunLightIntensity: [0, 1],
        shadowColor: [0, 1],
        sunLightColor: 2,
        ambientLightColor: [300, 128, 128],
        timezone: 'Not a timezone'
      }
    })
  );

  const expectedEffect = {
    id: 'e_1',
    type: 'lightAndShadow',
    parameters: {
      timestamp: 0,
      timeMode: 'pick',
      shadowIntensity: 1,
      sunLightIntensity: 1,
      shadowColor: [0, 0, 0],
      sunLightColor: [255, 255, 255],
      ambientLightColor: [255, 128, 128],
      ambientLightIntensity: 1,
      timezone: 'Not a timezone'
    }
  };

  cmpEffects(t, expectedEffect, nextState.effects[0], {id: true});

  t.end();
});

test('#VisStateUpdater -> reorderEffect', t => {
  const initialState = InitialState.visState;

  let nextState = reducer(initialState, VisStateActions.addEffect({id: 'e_1'}));
  nextState = reducer(nextState, VisStateActions.addEffect({id: 'e_2'}));
  nextState = reducer(nextState, VisStateActions.addEffect({id: 'e_3'}));

  t.deepEqual(nextState.effectOrder, ['e_3', 'e_2', 'e_1'], 'effect order should be correct order');

  nextState = reducer(nextState, VisStateActions.reorderEffect(['e_2', 'e_1', 'e_3']));

  t.deepEqual(
    nextState.effectOrder,
    ['e_2', 'e_1', 'e_3'],
    'effect order should be correct after '
  );

  t.end();
});

test('#VisStateUpdater -> removeEffect', t => {
  const initialState = InitialState.visState;

  let nextState = reducer(initialState, VisStateActions.addEffect({id: 'e_1'}));
  nextState = reducer(nextState, VisStateActions.addEffect({id: 'e_2'}));
  nextState = reducer(nextState, VisStateActions.addEffect({id: 'e_3'}));

  nextState = reducer(nextState, VisStateActions.removeEffect('e_2'));

  t.deepEqual(nextState.effects.length, 2, 'effect should be removed');

  t.deepEqual(nextState.effects[0].id, 'e_1', 'e_1 effect should be available');
  t.deepEqual(nextState.effects[1].id, 'e_3', 'e_3 effect should be available');

  // bad id, shouldn't fail
  nextState = reducer(nextState, VisStateActions.removeEffect('e_2'));

  t.equal(nextState.effectOrder.length, 2, 'should be 2 ids in effectOrder');

  t.end();
});

test('#visStateReducer -> LAYER_COLOR_UI_CHANGE. enable custom palette', t => {
  const initialState = CloneDeep(StateWFilesFiltersLayerColor.visState);
  const pointLayer = initialState.layers[0];

  const nextState = reducer(
    initialState,
    VisStateActions.layerColorUIChange(pointLayer, 'colorRange', {
      colorRangeConfig: {custom: true}
    })
  );

  const expectedColorUI = {
    color: DEFAULT_COLOR_UI,
    strokeColorRange: DEFAULT_COLOR_UI,
    colorRange: {
      ...DEFAULT_COLOR_UI,
      customPalette: {
        name: 'color.customPalette',
        type: 'custom',
        category: 'Custom',
        colors: ['#00939C', '#6BB5B9', '#AAD7D9', '#E6FAFA']
      },
      colorRangeConfig: {
        type: 'all',
        colorBlindSafe: false,
        steps: 6,
        reversed: false,
        custom: true,
        customBreaks: false
      }
    }
  };

  t.deepEqual(
    nextState.layers[0].config.colorUI,
    expectedColorUI,
    'should set customPalette when one clicks Custom Palette and Confirm button'
  );

  t.end();
});

test('#visStateReducer -> LAYER_COLOR_UI_CHANGE. custom palette - delete color item', t => {
  const initialState = CloneDeep(StateWFilesFiltersLayerColor.visState);
  const pointLayer = initialState.layers[0];

  const customPalette = {
    customPalette: {
      colors: ['#6BB5B9', '#AAD7D9', '#E6FAFA'],
      name: 'color.customPalette',
      type: 'custom',
      category: 'Custom'
    }
  };

  const nextState = reducer(
    initialState,
    VisStateActions.layerColorUIChange(pointLayer, 'colorRange', {
      colorRangeConfig: {custom: true}
    })
  );

  const deleteState = reducer(
    nextState,
    VisStateActions.layerColorUIChange(pointLayer, 'colorRange', customPalette)
  );

  const expectedColorUI = {
    color: DEFAULT_COLOR_UI,
    strokeColorRange: DEFAULT_COLOR_UI,
    colorRange: {
      ...DEFAULT_COLOR_UI,
      customPalette: {
        name: 'color.customPalette',
        type: 'custom',
        category: 'Custom',
        colors: ['#6BB5B9', '#AAD7D9', '#E6FAFA']
      },
      colorRangeConfig: {
        type: 'all',
        colorBlindSafe: false,
        steps: 3,
        reversed: false,
        custom: true,
        customBreaks: false
      }
    }
  };

  t.deepEqual(
    deleteState.layers[0].config.colorUI,
    expectedColorUI,
    'should set customPalette when one deletes a color item from Custom Palette'
  );

  let confirmState = reducer(
    deleteState,
    VisStateActions.layerColorUIChange(pointLayer, 'colorRange', {
      colorRangeConfig: {custom: false}
    })
  );

  // simulate Confirm button action
  confirmState = reducer(
    confirmState,
    VisStateActions.layerVisConfigChange(pointLayer, {
      colorRange: {
        name: 'color.customPalette',
        type: 'custom',
        category: 'Custom',
        colors: ['#6BB5B9', '#AAD7D9', '#E6FAFA']
      }
    })
  );

  const reverseState = reducer(
    confirmState,
    VisStateActions.layerColorUIChange(pointLayer, 'colorRange', {
      colorRangeConfig: {reversed: true}
    })
  );

  const expectedReversedColorUI = {
    ...expectedColorUI,
    colorRange: {
      ...expectedColorUI.colorRange,
      colorRangeConfig: {
        type: 'all',
        colorBlindSafe: false,
        steps: 3,
        reversed: true,
        custom: false,
        customBreaks: false
      }
    }
  };

  t.deepEqual(
    reverseState.layers[0].config.colorUI,
    expectedReversedColorUI,
    'should set customPalette when one deletes a color item from Custom Palette and reverse it'
  );

  const expectedReversedVisConfigColorRange = {
    category: 'Custom',
    colors: ['#E6FAFA', '#AAD7D9', '#6BB5B9'],
    name: 'color.customPalette',
    reversed: true,
    type: 'custom'
  };

  t.deepEqual(
    reverseState.layers[0].config.visConfig.colorRange,
    expectedReversedVisConfigColorRange,
    'should set visConfig.ColorRange when one deletes a color item from Custom Palette and reverse it'
  );

  t.end();
});

test('#visStateReducer -> LAYER_COLOR_UI_CHANGE. custom palette - select new steps', t => {
  const initialState = CloneDeep(StateWFilesFiltersLayerColor.visState);
  const pointLayer = initialState.layers[0];

  const customPalette = {
    customPalette: {
      colors: ['#6BB5B9', '#AAD7D9', '#E6FAFA'],
      name: 'color.customPalette',
      type: 'custom',
      category: 'Custom'
    }
  };

  const nextState = reducer(
    initialState,
    VisStateActions.layerColorUIChange(pointLayer, 'colorRange', {
      colorRangeConfig: {custom: true}
    })
  );

  const deleteState = reducer(
    nextState,
    VisStateActions.layerColorUIChange(pointLayer, 'colorRange', customPalette)
  );

  let confirmState = reducer(
    deleteState,
    VisStateActions.layerColorUIChange(pointLayer, 'colorRange', {
      colorRangeConfig: {custom: false}
    })
  );

  // simulate Confirm button action
  confirmState = reducer(
    confirmState,
    VisStateActions.layerVisConfigChange(pointLayer, {
      colorRange: {
        name: 'color.customPalette',
        type: 'custom',
        category: 'Custom',
        colors: ['#6BB5B9', '#AAD7D9', '#E6FAFA']
      }
    })
  );

  const stepsState = reducer(
    confirmState,
    VisStateActions.layerColorUIChange(pointLayer, 'colorRange', {
      colorRangeConfig: {steps: 4}
    })
  );

  const expectedColorUI = {
    color: DEFAULT_COLOR_UI,
    strokeColorRange: DEFAULT_COLOR_UI,
    colorRange: {
      ...DEFAULT_COLOR_UI,
      customPalette: {
        name: 'color.customPalette',
        type: 'custom',
        category: 'Custom',
        colors: ['#6BB5B9', '#AAD7D9', '#E6FAFA']
      },
      colorRangeConfig: {
        type: 'all',
        colorBlindSafe: false,
        steps: 4,
        reversed: false,
        custom: false,
        customBreaks: false
      }
    }
  };

  const expectedVisConfigColorRange = {
    colors: ['#00939C', '#8BC6C9', '#EB9373', '#C22E00'],
    name: 'Uber Viz Diverging',
    type: 'diverging',
    category: 'Uber'
  };

  t.deepEqual(
    stepsState.layers[0].config.colorUI,
    expectedColorUI,
    'should set correct step in colorRangeConfig when one deletes a color item from Custom Palette and select new steps'
  );

  t.deepEqual(
    stepsState.layers[0].config.visConfig.colorRange,
    expectedVisConfigColorRange,
    'should set predefined palette in visConfig.colorRange when one deletes a color item from Custom Palette and select new steps'
  );

  t.end();
});

test('VisStateUpdater -> refreshDataset', async t => {
  drainTasksForTesting();
  const initialData = processCsvData('lat,lng\n1,2\n3,4');
  const datasets = await createNewDataEntryMock({
    info: {id: 'remote-1', type: DatasetType.EXTERNALLY_HOSTED, label: 'quakes.csv'},
    data: initialData,
    metadata: {source: 'https://example.com/quakes.csv', sourceFormat: 'csv'}
  });

  const state = {
    ...INITIAL_VIS_STATE,
    datasets
  };

  t.equal(state.datasets['remote-1'].dataContainer.numRows(), 2, 'starts with 2 rows');

  const loadingState = reducer(state, VisStateActions.refreshDataset('remote-1'));
  t.equal(
    loadingState.datasets['remote-1'].metadata.refreshStatus,
    'loading',
    'should mark the dataset as loading'
  );

  const skipped = reducer(loadingState, VisStateActions.refreshDataset('remote-1'));
  t.equal(skipped, loadingState, 'should ignore a second refresh while loading');

  const [task, ...more] = drainTasksForTesting();
  t.equal(more.length, 0, 'should create one refresh task');
  t.equal(task.type, 'REFRESH_EXTERNALLY_HOSTED_DATASET_TASK', 'should fetch the remote file');

  const refreshed = processCsvData('lat,lng\n10,20\n30,40\n50,60');

  const successState = reducer(
    loadingState,
    succeedTaskInTest(task, {
      data: refreshed,
      notModified: false,
      etag: '"v2"',
      lastModified: 'Wed, 21 Oct 2015 07:28:00 GMT',
      size: 32
    })
  );

  t.equal(successState.datasets['remote-1'].dataContainer.numRows(), 3, 'should replace rows');
  t.equal(successState.datasets['remote-1'].metadata.refreshStatus, 'idle', 'should clear loading');
  t.equal(successState.datasets['remote-1'].metadata.etag, '"v2"', 'should store etag');
  t.equal(
    successState.datasets['remote-1'].metadata.lastModified,
    'Wed, 21 Oct 2015 07:28:00 GMT',
    'should store Last-Modified'
  );
  t.ok(successState.datasets['remote-1'].metadata.lastFetchedAt, 'should record lastFetchedAt');
  t.equal(
    successState.datasets['remote-1'].metadata.refreshProgress,
    undefined,
    'should clear refresh progress'
  );

  const loadingAgain = reducer(successState, VisStateActions.refreshDataset('remote-1'));
  const [taskAgain] = drainTasksForTesting();
  const clearedValidators = reducer(
    loadingAgain,
    succeedTaskInTest(taskAgain, {
      data: processCsvData('lat,lng\n7,8'),
      notModified: false
    })
  );
  t.equal(
    clearedValidators.datasets['remote-1'].metadata.etag,
    undefined,
    'a 200 without ETag should drop the previous validator'
  );
  t.equal(
    clearedValidators.datasets['remote-1'].metadata.lastModified,
    undefined,
    'a 200 without Last-Modified should drop the previous validator'
  );

  t.end();
});

test('VisStateUpdater -> CSV refresh preserves layers and filters through 100, 1, 0 and 100 rows', async t => {
  const originalFetch = global.fetch;
  const source = 'https://example.com/live.csv';
  const populated = `lat,lng,value\n${Array.from(
    {length: 100},
    (_, i) => `${37 + i / 1000},${-122 - i / 1000},${i}`
  ).join('\n')}\n`;
  let body = populated;
  global.fetch = async () => new Response(body, {headers: {'content-type': 'text/csv'}});
  const refresh = async state => {
    drainTasksForTesting();
    state = reducer(state, VisStateActions.refreshDataset('remote-csv'));
    const [task] = drainTasksForTesting();
    const action = await new Promise(resolve => {
      task.run((effect, succeed, fail, ctx) => effect(succeed, fail, ctx), resolve, resolve, {
        onProgress: progress => {
          state = reducer(state, progress);
        }
      });
    });
    return reducer(state, action);
  };
  try {
    for (const gpu of [false, true]) {
      const inverted = !gpu;
      body = populated;
      const loaded = await loadExternallyHostedDataset({source, format: 'csv'});
      const datasets = await createNewDataEntryMock({
        info: {id: 'remote-csv', type: DatasetType.EXTERNALLY_HOSTED},
        data: loaded.data,
        metadata: {source, sourceFormat: 'csv'}
      });
      const {props} = PointLayer.findDefaultLayerProps(datasets['remote-csv']);
      const point = new PointLayer({id: 'csv-point', dataId: 'remote-csv', ...props[0]});
      point.updateLayerVisConfig({opacity: 0.37, radius: 9});
      let state = {...INITIAL_VIS_STATE, datasets, layers: [point], layerData: [{}]};
      const initial = calculateLayerData(point, state);
      state = {...state, layers: [initial.layer], layerData: [initial.layerData]};
      const style = {...state.layers[0].config.visConfig};
      const types = datasets['remote-csv'].fields.map(field => field.type);
      state = reducer(state, VisStateActions.addFilter('remote-csv'));
      state = reducer(state, VisStateActions.setFilter(0, 'name', 'value'));
      state = reducer(state, VisStateActions.setFilter(0, 'value', [20, 80]));
      state = reducer(state, VisStateActions.setFilter(0, 'inverted', inverted));
      state = reducer(state, VisStateActions.setFilter(0, 'gpu', gpu));
      const filterId = state.filters[0].id;

      for (const [text, count] of [
        [`lat,lng,value\n40.5,-125.5,${gpu ? 50 : 10}\n`, 1],
        ['lat,lng,value\n', 0],
        [populated, 100]
      ]) {
        body = text;
        state = await refresh(state);
        const ds = state.datasets['remote-csv'];
        t.equal(ds.metadata.refreshStatus, 'idle', 'refresh succeeds');
        t.equal(ds.dataContainer.numRows(), count, 'replaces all rows');
        t.deepEqual(
          ds.fields.map(field => field.type),
          types,
          'preserves established types'
        );
        t.equal(state.layers.length, 1, 'keeps the configured layer');
        t.equal(state.layers[0].id, 'csv-point', 'keeps layer identity');
        t.equal(state.layers[0].isValid, true, 'keeps the layer valid');
        t.deepEqual(state.layers[0].config.visConfig, style, 'keeps user styling');
        t.equal(state.filters[0].id, filterId, 'keeps filter identity');
        t.deepEqual(state.filters[0].value, [20, 80], 'keeps selected range');
        t.equal(state.filters[0].inverted, inverted, 'keeps Filter out');
        t.equal(state.filters[0].gpu, gpu, 'keeps evaluation mode');
        ds.filterTableCPU(state.filters, state.layers);
        const expected = ds.allIndexes.filter(i => {
          const value = ds.dataContainer.valueAt(i, 2);
          return inverted ? value < 20 || value > 80 : value >= 20 && value <= 80;
        });
        t.deepEqual(ds.filteredIdxCPU, expected, 'export filtering uses the new snapshot');
        t.equal(
          state.layerData[0].data.length,
          gpu ? count : expected.length,
          'rebuilds layer data'
        );
        if (count === 1) {
          t.deepEqual(
            state.layerData[0].data[0].position.slice(0, 2),
            [-125.5, 40.5],
            'updates coordinates'
          );
        }
      }
      for (const invalid of ['', 'lat,lng,"value', 'value,lng,lat\n']) {
        body = invalid;
        const previous = state.datasets['remote-csv'].dataContainer;
        const layerData = state.layerData[0];
        state = await refresh(state);
        t.equal(
          state.datasets['remote-csv'].metadata.refreshStatus,
          'error',
          'unsupported refresh fails'
        );
        t.equal(state.datasets['remote-csv'].dataContainer, previous, 'failure retains the rows');
        t.equal(state.layerData[0], layerData, 'failure retains rendered data');
        t.deepEqual(state.filters[0].value, [20, 80], 'failure retains the selection');
      }
    }
  } finally {
    global.fetch = originalFetch;
    drainTasksForTesting();
  }
  t.end();
});

test('VisStateUpdater -> refreshDataset keeps Arrow point layers valid through empty snapshots', async t => {
  const snapshot = values => {
    const table = arrow.tableFromArrays({
      value: Float64Array.from(values),
      lat: Float64Array.from(values, (_, i) => 37.77 + i / 100),
      lng: Float64Array.from(values, (_, i) => -122.42 - i / 100)
    });
    return processArrowBatches(arrow.tableFromIPC(arrow.tableToIPC(table, 'file')).batches);
  };

  for (const withFilter of [false, true]) {
    drainTasksForTesting();
    const dataId = `empty-arrow-${withFilter}`;
    const datasets = await createNewDataEntryMock({
      info: {id: dataId, type: DatasetType.EXTERNALLY_HOSTED},
      data: snapshot([1, 2, 3]),
      metadata: {source: 'https://example.com/live.arrow', sourceFormat: 'arrow'}
    });
    const {props} = PointLayer.findDefaultLayerProps(datasets[dataId]);
    const point = new PointLayer({id: `point-${dataId}`, dataId, ...props[0]});
    let state = {...INITIAL_VIS_STATE, datasets, layers: [point], layerData: [{}]};
    const initial = calculateLayerData(point, state);
    state = {...state, layers: [initial.layer], layerData: [initial.layerData]};
    t.equal(state.layers[0].isValid, true, 'initial point layer is valid');
    if (withFilter) {
      state = reducer(state, VisStateActions.addFilter(dataId));
      state = reducer(state, VisStateActions.setFilter(0, 'name', 'value'));
      state = reducer(state, VisStateActions.setFilter(0, 'value', [2, 3]));
      state = reducer(state, VisStateActions.setFilter(0, 'inverted', true));
    }
    const schema = datasets[dataId].fields.map(({name, type}) => ({name, type}));

    for (const values of [[], [3, 2, 1], [], [1]]) {
      const loading = reducer(state, VisStateActions.refreshDataset(dataId));
      const progressed = reducer(loading, VisStateActions.refreshDatasetProgress(dataId, 50));
      const [task] = drainTasksForTesting();
      state = reducer(
        progressed,
        succeedTaskInTest(task, {data: snapshot(values), notModified: false})
      );
      const layer = state.layers[0];
      t.equal(layer.isValid, true, `refresh to ${values.length} rows keeps the point layer valid`);
      t.equal(layer.errorMessage, null, 'refresh does not report a layer exception');
      t.equal(layer.config.isVisible, true, 'refresh keeps the layer visible');
      t.equal(state.layerData[0].data?.numRows, values.length, 'layer data follows the snapshot');
      t.equal(layer.geoArrowVector.length, values.length, 'coordinate vector follows the snapshot');
      t.deepEqual(
        state.datasets[dataId].fields.map(({name, type}) => ({name, type})),
        schema,
        'empty IPC snapshots preserve the schema'
      );
      if (values.length) {
        t.deepEqual(
          Array.from(layer.geoArrowVector.get(0)),
          [-122.42, 37.77, 0],
          'restores positions'
        );
      }
      const expected = values.flatMap((value, index) =>
        !withFilter || value < 2 || value > 3 ? [index] : []
      );
      t.deepEqual(
        state.datasets[dataId].filteredIndex,
        expected,
        'refresh reapplies active filters'
      );
      t.deepEqual(
        values.flatMap((_, index) => (state.layerData[0].getFiltered({index}) ? [index] : [])),
        expected,
        'point layer visibility follows the refreshed filter result'
      );
      state.datasets[dataId].filterTableCPU(state.filters, state.layers);
      t.deepEqual(
        state.datasets[dataId].filteredIdxCPU,
        expected,
        'CPU/export evaluation uses the refreshed filtered rows'
      );
      if (withFilter) {
        t.deepEqual(state.filters[0].value, [2, 3], 'refresh preserves the filter selection');
        t.equal(state.filters[0].enabled, true, 'refresh keeps the filter enabled');
        t.equal(state.filters[0].inverted, true, 'refresh preserves Filter out mode');
      }
    }
  }
  t.end();
});

test('VisStateUpdater -> refreshDataset reapplies active filters to Arrow snapshots', async t => {
  drainTasksForTesting();
  const dataId = 'remote-arrow';
  const snapshot = values => {
    const arrowTable = arrow.tableFromArrays({value: new Float64Array(values)});
    return {
      fields: [{name: 'value', type: ALL_FIELD_TYPES.real, analyzerType: 'FLOAT'}],
      rows: [],
      cols: [arrowTable.getChildAt(0)],
      arrowTable
    };
  };
  const datasets = await createNewDataEntryMock({
    info: {id: dataId, type: DatasetType.EXTERNALLY_HOSTED},
    data: snapshot([1, 2, 3]),
    metadata: {source: 'https://example.com/live.arrow', sourceFormat: 'arrow'}
  });
  let state = reducer({...INITIAL_VIS_STATE, datasets}, VisStateActions.addFilter(dataId));
  state = reducer(state, VisStateActions.setFilter(0, 'name', 'value'));
  state = reducer(state, VisStateActions.setFilter(0, 'value', [2, 3]));
  state = reducer(state, VisStateActions.setFilter(0, 'inverted', true));
  t.deepEqual(state.datasets[dataId].filteredIndex, [0], 'Filter out 2–3 initially keeps only 1');
  t.equal(state.filters[0].gpu, false, 'inverted filtering runs on the CPU');

  for (const [values, expected] of [
    [[1, 2, 3], [0]],
    [[3, 1, 2], [1]],
    [
      [2, 1, 3, 4],
      [1, 3]
    ],
    [[], []],
    [[3, 2, 1], [2]],
    [[2], []]
  ]) {
    const loading = reducer(state, VisStateActions.refreshDataset(dataId));
    const progressed = reducer(loading, VisStateActions.refreshDatasetProgress(dataId, 50));
    const [task] = drainTasksForTesting();
    const data = snapshot(values);
    state = reducer(progressed, succeedTaskInTest(task, {data, notModified: false}));
    const table = state.datasets[dataId];
    t.deepEqual(table.filteredIndex, expected, `refresh filters snapshot [${values}]`);
    t.deepEqual(table.filteredIndexForDomain, expected, 'domain uses the same filtered snapshot');
    table.filterTableCPU(state.filters, state.layers);
    t.deepEqual(table.filteredIdxCPU, expected, 'CPU/export evaluation keeps the filtered rows');
    t.deepEqual(state.filters[0].value, [2, 3], 'refresh preserves the selected range');
    t.equal(state.filters[0].enabled, true, 'refresh keeps the filter enabled');
    t.equal(state.filters[0].inverted, true, 'refresh preserves Filter out');
    t.deepEqual(Array.from(data.arrowTable.getChildAt(0)), values, 'source values are unchanged');
  }
  t.end();
});

test('VisStateUpdater -> timestamp refresh updates point filtering and export', async t => {
  const firstTime = Date.UTC(2024, 1, 1);
  const lastTime = firstTime + 86400000;
  const snapshot = (values, rowBacked) => {
    const source = new arrow.Table({
      time: arrow.vectorFromArray(
        values.map(value => new Date(value)),
        new arrow.TimestampMillisecond('UTC')
      ),
      lat: arrow.vectorFromArray(
        values.map(() => 37.77),
        new arrow.Float64()
      ),
      lng: arrow.vectorFromArray(
        values.map(() => -122.42),
        new arrow.Float64()
      )
    });
    const data = processArrowBatches(arrow.tableFromIPC(arrow.tableToIPC(source, 'file')).batches);
    return rowBacked
      ? {fields: data.fields, rows: values.map(value => [value, 37.77, -122.42])}
      : data;
  };

  for (const rowBacked of [false, true]) {
    for (const gpu of [false, true]) {
      drainTasksForTesting();
      const dataId = 'remote-timestamps';
      const datasets = await createNewDataEntryMock({
        info: {id: dataId, type: DatasetType.EXTERNALLY_HOSTED},
        data: snapshot([firstTime, lastTime], rowBacked),
        metadata: {source: 'https://example.com/time.arrow', sourceFormat: 'arrow'}
      });
      const {props} = PointLayer.findDefaultLayerProps(datasets[dataId]);
      const point = new PointLayer({id: 'timestamp-point', dataId, ...props[0]});
      let state = {...INITIAL_VIS_STATE, datasets, layers: [point], layerData: [{}]};
      const initial = calculateLayerData(point, state);
      state = {...state, layers: [initial.layer], layerData: [initial.layerData]};
      state = reducer(state, VisStateActions.addFilter(dataId));
      state = reducer(state, VisStateActions.setFilter(0, 'name', 'time'));
      state = reducer(
        state,
        VisStateActions.setFilter(0, 'value', [firstTime, firstTime + 3600000])
      );
      state = reducer(state, VisStateActions.setFilter(0, 'gpu', gpu));
      const selection = state.filters[0];

      for (const values of [[lastTime, firstTime], [], [lastTime, firstTime]]) {
        state = reducer(state, VisStateActions.refreshDataset(dataId));
        state = reducer(state, VisStateActions.refreshDatasetProgress(dataId, 50));
        const [task] = drainTasksForTesting();
        state = reducer(
          state,
          succeedTaskInTest(task, {data: snapshot(values, rowBacked), notModified: false})
        );
        const table = state.datasets[dataId];
        const expected = values.length ? [1] : [];
        table.filterTableCPU(state.filters, state.layers);
        t.deepEqual(table.filteredIdxCPU, expected, 'export uses refreshed timestamp values');
        const renderIndexes = rowBacked
          ? state.layerData[0].data.map(datum => datum.index)
          : table.allIndexes;
        const visible = renderIndexes.filter(index => {
          if (!state.layerData[0].getFiltered({index})) return false;
          const value = state.layerData[0].getFilterValue({index})[0];
          const [min, max] = table.gpuFilter.filterRange[0];
          return value >= min && value <= max;
        });
        t.deepEqual(visible, expected, 'point rendering uses refreshed timestamp values');
        t.equal(state.layers[0].isValid, true, 'empty snapshots keep the point layer valid');
        t.deepEqual(state.filters[0].value, selection.value, 'refresh retains the selected range');
        t.equal(state.filters[0].id, selection.id, 'refresh retains filter identity');
        t.equal(state.filters[0].gpu, gpu, 'refresh retains GPU mode');
        t.equal(state.filters[0].enabled, true, 'refresh keeps the filter enabled');
      }
    }
  }
  t.end();
});

test('VisStateUpdater -> refreshDataset rebuilds filter domains and preserves selections', async t => {
  drainTasksForTesting();
  const dataId = 'remote-filter';
  const datasets = await createNewDataEntryMock({
    info: {id: dataId, type: DatasetType.EXTERNALLY_HOSTED, label: 'values.csv'},
    data: processCsvData('value\n10\n20'),
    metadata: {source: 'https://example.com/values.csv', sourceFormat: 'csv'}
  });
  let state = {...INITIAL_VIS_STATE, datasets};
  state = reducer(state, VisStateActions.addFilter(dataId));
  state = reducer(state, VisStateActions.setFilter(0, 'name', 'value'));
  state = reducer(state, VisStateActions.setFilter(0, 'value', [10, 15]));
  state = reducer(state, VisStateActions.setFilter(0, 'gpu', false));
  const filterId = state.filters[0].id;
  t.deepEqual(state.filters[0].domain, [10, 20], 'starts with the original domain');

  for (const maximum of [50, 30]) {
    state = reducer(state, VisStateActions.refreshDataset(dataId));
    state = reducer(state, VisStateActions.refreshDatasetProgress(dataId, 50));
    const [task] = drainTasksForTesting();
    const data = processCsvData(`value\n10\n${maximum}`);
    state = reducer(state, succeedTaskInTest(task, {data, notModified: false}));

    t.equal(state.filters[0].id, filterId, 'keeps the existing filter');
    t.deepEqual(state.filters[0].domain, [10, maximum], 'rebuilds expanded and contracted domains');
    t.deepEqual(state.filters[0].value, [10, 15], 'preserves the chosen selection');
    t.equal(state.filters[0].gpu, false, 'preserves CPU filtering');
    t.deepEqual(state.datasets[dataId].filteredIndex, [0], 'keeps CPU filtering active');
    t.deepEqual(
      state.filters[0].bins[dataId],
      histogramFromDomain([10, maximum], [0, 1], BINS, index => [10, maximum][index]),
      'rebuilds the histogram for the refreshed domain and rows'
    );
    const table = state.datasets[dataId].filterTableCPU(state.filters, state.layers);
    t.deepEqual(table.filteredIdxCPU, [0], 'applies the selection to refreshed rows');
    t.deepEqual(
      table.dataContainer.rowAsArray(1),
      [maximum],
      'keeps the refreshed source value unchanged'
    );
  }

  state = reducer(state, VisStateActions.setFilter(0, 'value', [25, 30]));
  t.deepEqual(state.filters[0].value, [25, 30], 'allows selecting newly available values');
  t.deepEqual(
    state.datasets[dataId].filterTableCPU(state.filters, state.layers).filteredIdxCPU,
    [1],
    'filters using the newly selected range'
  );

  for (const result of [{notModified: true}, {notModified: false}]) {
    const filters = state.filters;
    state = reducer(state, VisStateActions.refreshDataset(dataId));
    const [task] = drainTasksForTesting();
    state = reducer(state, succeedTaskInTest(task, result));
    t.equal(state.filters, filters, 'keeps filters when refresh has no replacement data');
  }
  t.end();
});

test('VisStateUpdater -> refreshDataset bounds timeline bins without changing the selection', async t => {
  const start = Date.UTC(2020, 0, 1);
  const end = start + 86400000;
  // Protect this regression even when run against unfixed code: fail before
  // D3 can allocate an oversized range, never reproduce the original OOM.
  const every = TIME_INTERVALS.millisecond.every;
  const stub = sinon.stub(TIME_INTERVALS.millisecond, 'every').callsFake(step => {
    const interval = every(step);
    return {
      ...interval,
      range(from, to) {
        const requested = Math.ceil((to - from) / step);
        if (requested > 2049)
          throw new Error(`Intercepted unsafe allocation of ${requested} Dates`);
        return interval.range(from, to);
      }
    };
  });
  try {
    for (const mode of ['auto', 'manual', 'safe', 'end-field']) {
      const dataId = `timeline-${mode}`;
      const datasets = await createNewDataEntryMock({
        info: {id: dataId},
        data: processCsvData(`start_time,end_time,value
2020-01-01T00:00:00.000Z,2020-01-01T00:00:00.001Z,10
2020-01-01T00:00:00.001Z,,20`)
      });
      let state = {...INITIAL_VIS_STATE, datasets};
      state = reducer(state, VisStateActions.addFilter(dataId));
      state = reducer(state, VisStateActions.setFilter(0, 'name', 'start_time'));
      if (mode === 'end-field')
        state = reducer(state, VisStateActions.setFilter(0, 'endName', 'end_time'));
      if (mode === 'manual' || mode === 'safe') {
        state = reducer(
          state,
          VisStateActions.setFilterPlot(0, {
            plotType: {interval: mode === 'safe' ? '1-hour' : '1-millisecond'}
          })
        );
      }
      state = reducer(state, VisStateActions.setFilter(0, 'gpu', false));
      state = reducer(state, VisStateActions.setFilter(0, 'value', [start, start + 1]));
      const yAxis = state.datasets[dataId].fields.find(field => field.name === 'value');
      state = reducer(state, VisStateActions.setFilterPlot(0, {yAxis}));
      const previous = state.filters[0];
      const data = processCsvData(`start_time,end_time,value
2020-01-01T00:00:00.000Z,2020-01-01T00:00:00.001Z,30
2020-01-02T00:00:00.000Z,,40`);
      state = reducer(
        state,
        VisStateActions.refreshDatasetSuccess(dataId, {data, notModified: false})
      );
      const filter = state.filters[0];
      const effectiveInterval = mode === 'safe' ? '1-hour' : '15-minute';
      t.equal(
        filter.plotType.interval,
        effectiveInterval,
        `${mode}: should preserve safe intervals and coarsen unsafe ones`
      );
      t.deepEqual(filter.domain, [start, end], `${mode}: should retain the full refreshed domain`);
      t.deepEqual(filter.value, previous.value, `${mode}: should preserve the selected range`);
      t.equal(filter.id, previous.id, `${mode}: should preserve filter identity`);
      t.equal(filter.gpu, false, `${mode}: should preserve CPU filtering`);
      t.deepEqual(
        state.datasets[dataId].filteredIndex,
        [0],
        `${mode}: should apply the unchanged selection`
      );
      t.equal(
        filter.plotType.aggregation,
        previous.plotType.aggregation,
        `${mode}: should preserve aggregation`
      );
      t.equal(filter.yAxis.name, 'value', `${mode}: should preserve the Y field`);
      if (mode !== 'safe') {
        t.equal(
          filter.plotType.defaultTimeFormat,
          getDefaultTimeFormat(effectiveInterval),
          `${mode}: should update automatic labels`
        );
        t.notOk(
          filter.timeBins[dataId]['1-millisecond'],
          `${mode}: should remove the obsolete cache`
        );
      }
      const marks = getFilterBinThresholds(filter);
      const bins = filter.timeBins[dataId][effectiveInterval];
      t.ok(marks.length <= 2049, `${mode}: should bound playback marks`);
      t.ok(
        bins.every(bin => marks.includes(bin.x0) && marks.includes(bin.x1)),
        `${mode}: should align histogram and playback boundaries`
      );
      t.equal(
        filter.lineChart.interval,
        effectiveInterval,
        `${mode}: should use the effective interval for the line chart`
      );
      t.deepEqual(
        filter.lineChart.yDomain,
        [30, 40],
        `${mode}: should include both refreshed rows in chart aggregation`
      );
      // A saved/API interval that bypasses the UI must be normalized too.
      state = reducer(
        state,
        VisStateActions.setFilterPlot(0, {plotType: {interval: '1-millisecond'}})
      );
      t.equal(
        state.filters[0].plotType.interval,
        '15-minute',
        `${mode}: should bound an unsafe API interval`
      );
      t.deepEqual(
        state.filters[0].value,
        previous.value,
        `${mode}: API coarsening should not move the selection`
      );
      const configured = state.filters[0];
      state = reducer(
        state,
        VisStateActions.applyFilterConfig(configured.id, {
          ...configured,
          plotType: {...configured.plotType, interval: '1-millisecond'}
        })
      );
      t.equal(
        state.filters[0].plotType.interval,
        '15-minute',
        `${mode}: should bound an unsafe configured interval`
      );
      t.deepEqual(
        state.filters[0].value,
        previous.value,
        `${mode}: configured coarsening should preserve selection`
      );
    }
  } catch (error) {
    t.fail(error.message);
  } finally {
    stub.restore();
  }
  t.end();
});

test('VisStateUpdater -> refreshDataset rebuilds synced and categorical domains in place', async t => {
  drainTasksForTesting();
  const remote = await createNewDataEntryMock({
    info: {id: 'remote-filter', type: DatasetType.EXTERNALLY_HOSTED, label: 'values.csv'},
    data: processCsvData('value,category\n10,north\n20,south'),
    metadata: {source: 'https://example.com/values.csv', sourceFormat: 'csv'}
  });
  const local = await createNewDataEntryMock({
    info: {id: 'local-filter', label: 'local'},
    data: processCsvData('value\n0\n100')
  });
  let state = {...INITIAL_VIS_STATE, datasets: {...remote, ...local}};
  state = reducer(state, VisStateActions.addFilter('local-filter'));
  state = reducer(state, VisStateActions.setFilter(0, 'name', 'value'));
  state = reducer(state, VisStateActions.addFilter('remote-filter'));
  state = reducer(state, VisStateActions.setFilter(1, 'name', 'value'));
  state = reducer(
    state,
    VisStateActions.setFilter(1, ['dataId', 'name'], ['local-filter', 'value'], 1)
  );
  state = reducer(state, VisStateActions.setFilter(1, 'value', [10, 15]));
  state = reducer(state, VisStateActions.addFilter('remote-filter'));
  state = reducer(state, VisStateActions.setFilter(2, 'name', 'category'));
  state = reducer(state, VisStateActions.setFilter(2, 'value', ['north']));
  state = reducer(state, VisStateActions.addFilter('remote-filter'));
  const unrelated = state.filters[0];
  const unconfigured = state.filters[3];
  const filterIds = state.filters.map(filter => filter.id);

  for (const maximum of [150, 50]) {
    state = reducer(state, VisStateActions.refreshDataset('remote-filter'));
    const [task] = drainTasksForTesting();
    state = reducer(
      state,
      succeedTaskInTest(task, {
        data: processCsvData(`value,category\n10,north\n${maximum},east`),
        notModified: false
      })
    );
    const domain = [0, Math.max(100, maximum)];
    t.deepEqual(
      state.filters.map(filter => filter.id),
      filterIds,
      'preserves filter order'
    );
    t.equal(state.filters[0], unrelated, 'leaves unrelated filters unchanged');
    t.equal(state.filters[3], unconfigured, 'keeps an unconfigured filter');
    t.deepEqual(state.filters[1].domain, domain, 'merges current domains from both datasets');
    t.deepEqual(state.filters[1].value, [10, 15], 'preserves the synced selection');
    t.deepEqual(
      state.filters[1].bins['local-filter'],
      histogramFromDomain(domain, [0, 1], BINS, index => [0, 100][index]),
      'rebuilds synced histogram bins when the shared domain changes'
    );
    t.deepEqual(
      state.filters[2].domain.slice().sort(),
      ['east', 'north'],
      'replaces category options'
    );
    t.deepEqual(state.filters[2].value, ['north'], 'preserves the category selection');
  }
  t.end();
});

test('VisStateUpdater -> refreshDataset rebuilds point layer positions', async t => {
  drainTasksForTesting();
  const initialData = processCsvData('lat,lng\n37.77,-122.42');
  const datasets = await createNewDataEntryMock({
    info: {id: 'remote-1', type: DatasetType.EXTERNALLY_HOSTED, label: 'live.csv'},
    data: initialData,
    metadata: {source: 'https://example.com/live.csv', sourceFormat: 'csv'}
  });
  const {props} = PointLayer.findDefaultLayerProps(datasets['remote-1']);
  const pointLayer = new PointLayer({
    id: 'p1',
    dataId: 'remote-1',
    isVisible: true,
    ...props[0]
  });
  const stateWithLayer = {
    ...INITIAL_VIS_STATE,
    datasets,
    layers: [pointLayer],
    layerData: [{}]
  };
  const {layerData: initialLayerData, layer} = calculateLayerData(
    pointLayer,
    stateWithLayer,
    undefined
  );
  const state = {
    ...stateWithLayer,
    layers: [layer],
    layerData: [initialLayerData]
  };

  t.ok(initialLayerData.data?.[0]?.position, 'should format an initial point');
  const firstPos = initialLayerData.data[0].position.slice();

  const loadingState = reducer(state, VisStateActions.refreshDataset('remote-1'));
  const progressed = reducer(loadingState, VisStateActions.refreshDatasetProgress('remote-1', 50));
  t.notEqual(
    progressed.datasets['remote-1'],
    loadingState.datasets['remote-1'],
    'progress should copy the table'
  );

  const [task] = drainTasksForTesting();
  const refreshed = processCsvData('lat,lng\n10,20');
  t.equal(
    progressed.datasets['remote-1'].dataContainer.numRows(),
    1,
    'progress must not apply the snapshot'
  );

  const successState = reducer(
    progressed,
    succeedTaskInTest(task, {
      data: refreshed,
      notModified: false,
      etag: '"v2"'
    })
  );

  const nextPos = successState.layerData[0].data[0].position;
  t.notDeepEqual(nextPos, firstPos, 'should rebuild point positions after refresh');
  t.deepEqual(nextPos.slice(0, 2), [20, 10], 'should use the new lng/lat');

  t.end();
});

test('VisStateUpdater -> refreshDataset rebuilds GeoJSON geometry with the same row count', async t => {
  drainTasksForTesting();
  const pointData = coordinates =>
    processGeojson({
      type: 'FeatureCollection',
      features: [{type: 'Feature', properties: {}, geometry: {type: 'Point', coordinates}}]
    });
  const datasets = await createNewDataEntryMock({
    info: {id: 'remote-geojson', type: DatasetType.EXTERNALLY_HOSTED, label: 'live.geojson'},
    data: pointData([1, 2]),
    metadata: {source: 'https://example.com/live.geojson', sourceFormat: 'geojson'}
  });
  const {props} = GeojsonLayer.findDefaultLayerProps(datasets['remote-geojson']);
  const geojsonLayer = new GeojsonLayer({
    id: 'live-geojson',
    dataId: 'remote-geojson',
    ...props[0]
  });
  geojsonLayer.setInitialLayerConfig(datasets['remote-geojson']);
  geojsonLayer.updateLayerVisConfig({opacity: 0.37, radius: 13});
  const {layerData, layer} = calculateLayerData(
    geojsonLayer,
    {...INITIAL_VIS_STATE, datasets, layers: [geojsonLayer], layerData: [{}]},
    undefined
  );
  const state = {...INITIAL_VIS_STATE, datasets, layers: [layer], layerData: [layerData]};
  const style = {...layer.config.visConfig};
  t.deepEqual(layerData.data[0].geometry.coordinates, [1, 2], 'starts at the old point');

  const loading = reducer(state, VisStateActions.refreshDataset('remote-geojson'));
  const progressed = reducer(loading, VisStateActions.refreshDatasetProgress('remote-geojson', 50));
  const [task] = drainTasksForTesting();
  t.equal(task.type, 'REFRESH_EXTERNALLY_HOSTED_DATASET_TASK', 'uses the remote refresh task');
  const refreshed = reducer(
    progressed,
    succeedTaskInTest(task, {data: pointData([30, 40]), notModified: false})
  );
  const dataset = refreshed.datasets['remote-geojson'];
  const refreshedLayer = refreshed.layers[0];
  const refreshedData = refreshed.layerData[0];
  t.equal(dataset.dataContainer.numRows(), 1, 'keeps the same row count');
  t.deepEqual(
    dataset.dataContainer.valueAt(0, refreshedLayer.config.columns.geojson.fieldIdx).geometry
      .coordinates,
    [30, 40],
    'stores the refreshed point'
  );
  t.deepEqual(refreshedData.data[0].geometry.coordinates, [30, 40], 'renders the refreshed point');
  t.deepEqual(refreshedLayer.centroids, [[30, 40]], 'rebuilds centroids for spatial filtering');
  t.deepEqual(refreshedLayer.meta.bounds, [30, 40, 30, 40], 'rebuilds layer bounds');
  t.deepEqual(refreshedData.getPosition({index: 0}), [30, 40], 'moves the text label position');
  t.deepEqual(refreshedLayer.config.visConfig, style, 'preserves user styling');
  const polygon = {
    type: 'Feature',
    id: 'refresh-polygon',
    properties: {renderType: 'Polygon', isClosed: true, isVisible: true},
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [29, 39],
          [31, 39],
          [31, 41],
          [29, 41],
          [29, 39]
        ]
      ]
    }
  };
  let filtered = reducer(refreshed, VisStateActions.setPolygonFilterLayer(refreshedLayer, polygon));
  t.equal(filtered.layerData[0].data.length, 1, 'starts inside an active polygon filter');
  for (const [coordinates, visibleCount] of [
    [[70, 80], 0],
    [[30, 40], 1]
  ]) {
    const filteringRefresh = reducer(filtered, VisStateActions.refreshDataset('remote-geojson'));
    const [filteringTask] = drainTasksForTesting();
    filtered = reducer(
      filteringRefresh,
      succeedTaskInTest(filteringTask, {data: pointData(coordinates), notModified: false})
    );
    t.equal(filtered.layerData[0].data.length, visibleCount, 'filters using refreshed centroids');
  }
  t.end();
});

test('VisStateUpdater -> refreshDataset rebinds or drops layers when field names change', async t => {
  drainTasksForTesting();
  const initialData = processCsvData('lat,lng\n37.77,-122.42');
  const datasets = await createNewDataEntryMock({
    info: {id: 'remote-1', type: DatasetType.EXTERNALLY_HOSTED, label: 'live.csv'},
    data: initialData,
    metadata: {source: 'https://example.com/live.csv', sourceFormat: 'csv'}
  });
  const {props} = PointLayer.findDefaultLayerProps(datasets['remote-1']);
  const pointLayer = new PointLayer({
    id: 'p1',
    dataId: 'remote-1',
    isVisible: true,
    ...props[0]
  });
  const {layerData, layer} = calculateLayerData(
    pointLayer,
    {...INITIAL_VIS_STATE, datasets, layers: [pointLayer], layerData: [{}]},
    undefined
  );
  const state = {
    ...INITIAL_VIS_STATE,
    datasets,
    layers: [layer],
    layerData: [layerData],
    layerOrder: [layer.id]
  };

  const loadingCompatible = reducer(state, VisStateActions.refreshDataset('remote-1'));
  const [compatibleTask] = drainTasksForTesting();
  const withExtraColumn = processCsvData('lat,lng,value\n10,20,3');
  const kept = reducer(
    loadingCompatible,
    succeedTaskInTest(compatibleTask, {data: withExtraColumn, notModified: false})
  );
  t.equal(kept.layers.length, 1, 'should keep the point layer when lat/lng still exist');
  t.equal(kept.layers[0].id, 'p1', 'should keep the same layer id');
  t.equal(kept.datasets['remote-1'].fields.length, 3, 'should load the extra column');

  const loadingIncompatible = reducer(kept, VisStateActions.refreshDataset('remote-1'));
  const [incompatibleTask] = drainTasksForTesting();
  const renamed = processCsvData('foo,bar\n1,2');
  const dropped = reducer(
    loadingIncompatible,
    succeedTaskInTest(incompatibleTask, {data: renamed, notModified: false})
  );
  t.equal(dropped.layers.length, 0, 'should drop the point layer when lat/lng are gone');
  t.deepEqual(dropped.layerOrder, [], 'should remove the layer from layerOrder');
  t.equal(dropped.datasets['remote-1'].fields[0].name, 'foo', 'should still apply the snapshot');

  t.end();
});

test('VisStateUpdater -> refreshDatasetProgress', async t => {
  drainTasksForTesting();
  const initialData = processCsvData('lat,lng\n1,2');
  const datasets = await createNewDataEntryMock({
    info: {id: 'remote-1', type: DatasetType.EXTERNALLY_HOSTED, label: 'quakes.csv'},
    data: initialData,
    metadata: {source: 'https://example.com/quakes.csv', sourceFormat: 'csv'}
  });
  const state = {...INITIAL_VIS_STATE, datasets};
  const loadingState = reducer(state, VisStateActions.refreshDataset('remote-1'));
  drainTasksForTesting();

  const progressed = reducer(loadingState, VisStateActions.refreshDatasetProgress('remote-1', 42));
  t.equal(
    progressed.datasets['remote-1'].metadata.refreshProgress,
    42,
    'should store download percent'
  );

  const same = reducer(progressed, VisStateActions.refreshDatasetProgress('remote-1', 42));
  t.equal(same, progressed, 'should skip redundant progress updates');

  const idle = reducer(state, VisStateActions.refreshDatasetProgress('remote-1', 50));
  t.equal(idle, state, 'should ignore progress when not loading');

  t.end();
});

test('VisStateUpdater -> hydrate remote dataset loading progress', t => {
  drainTasksForTesting();
  const proto = {
    info: {id: 'remote-1', type: DatasetType.EXTERNALLY_HOSTED, label: 'quakes.csv'},
    data: {fields: [], rows: []},
    metadata: {source: 'https://example.com/quakes.csv', sourceFormat: 'csv'}
  };

  const loadingState = reducer(INITIAL_VIS_STATE, VisStateActions.updateVisData([proto]));
  t.equal(loadingState.loadingIndicatorValue, 1, 'should show the map loading indicator');
  t.equal(loadingState.loadingProgress['remote-1'], 0, 'should seed hydrate progress');

  const progressed = reducer(loadingState, VisStateActions.setLoadingProgress('remote-1', 42));
  t.equal(progressed.loadingProgress['remote-1'], 42, 'should store download percent');

  const processing = reducer(
    progressed,
    VisStateActions.setLoadingProgress('remote-1', 100, 'processing')
  );
  t.equal(processing.loadingProcessing['remote-1'], true, 'should mark the dataset as processing');
  t.equal(processing.loadingIndicatorValue, 1, 'should keep the indicator up while processing');

  const same = reducer(progressed, VisStateActions.setLoadingProgress('remote-1', 42));
  t.equal(same, progressed, 'should skip redundant progress updates');

  const idle = reducer(INITIAL_VIS_STATE, VisStateActions.setLoadingProgress('remote-1', 50));
  t.equal(idle, INITIAL_VIS_STATE, 'should ignore progress when nothing is loading');

  const [task] = drainTasksForTesting();
  t.ok(task, 'should schedule a hydrate/create task');

  const cleared = reducer(processing, VisStateActions.setLoadingIndicator({change: -1}));
  t.equal(cleared.loadingIndicatorValue, 0, 'should hide the loading indicator');
  t.deepEqual(cleared.loadingProgress, {}, 'should clear hydrate progress');
  t.deepEqual(cleared.loadingProcessing, {}, 'should clear the processing flag');

  t.end();
});

test('VisStateUpdater -> refreshDataset 304 and error', async t => {
  drainTasksForTesting();
  const initialData = processCsvData('lat,lng\n1,2');
  const datasets = await createNewDataEntryMock({
    info: {id: 'remote-1', type: DatasetType.EXTERNALLY_HOSTED, label: 'quakes.csv'},
    data: initialData,
    metadata: {source: 'https://example.com/quakes.csv'}
  });
  const state = {...INITIAL_VIS_STATE, datasets};

  const loadingState = reducer(state, VisStateActions.refreshDataset('remote-1'));
  const [task] = drainTasksForTesting();

  const notModified = reducer(
    loadingState,
    succeedTaskInTest(task, {data: null, notModified: true, etag: '"same"'})
  );
  t.equal(notModified.datasets['remote-1'].dataContainer.numRows(), 1, '304 keeps existing rows');
  t.equal(notModified.datasets['remote-1'].metadata.refreshStatus, 'idle');
  t.equal(notModified.datasets['remote-1'].metadata.etag, '"same"');

  const loadingAgain = reducer(notModified, VisStateActions.refreshDataset('remote-1'));
  const [errorTask] = drainTasksForTesting();
  const failed = reducer(loadingAgain, errorTaskInTest(errorTask, new Error('network down')));
  t.equal(failed.datasets['remote-1'].metadata.refreshStatus, 'error');
  t.ok(
    String(failed.datasets['remote-1'].metadata.refreshError).includes('network down'),
    'should store the error message'
  );
  t.equal(failed.datasets['remote-1'].dataContainer.numRows(), 1, 'error keeps existing rows');
  drainTasksForTesting();

  const ignored = reducer(state, VisStateActions.refreshDataset('missing'));
  t.equal(ignored, state, 'unknown dataset is a no-op');

  t.end();
});

test('VisStateUpdater -> addToDataset appends rows and keeps layers', async t => {
  const initialData = processCsvData('lat,lng\n37.77,-122.42');
  const datasets = await createNewDataEntryMock({
    info: {id: 'live', label: 'live.csv'},
    data: initialData
  });
  const {props} = PointLayer.findDefaultLayerProps(datasets['live']);
  const pointLayer = new PointLayer({
    id: 'p1',
    dataId: 'live',
    isVisible: true,
    ...props[0]
  });
  const {layerData, layer} = calculateLayerData(
    pointLayer,
    {...INITIAL_VIS_STATE, datasets, layers: [pointLayer], layerData: [{}]},
    undefined
  );
  const state = {
    ...INITIAL_VIS_STATE,
    datasets,
    layers: [layer],
    layerData: [layerData],
    layerOrder: [layer.id]
  };

  const revisionBefore = state.datasets.live.dataRevision;
  const appended = reducer(
    state,
    VisStateActions.addToDataset('live', [
      [10, 20],
      [30, 40]
    ])
  );

  t.equal(appended.datasets.live.dataContainer.numRows(), 3, 'should append both rows');
  t.deepEqual(appended.datasets.live.allIndexes, [0, 1, 2], 'should extend allIndexes');
  t.notEqual(appended.datasets.live.dataRevision, revisionBefore, 'should bump dataRevision');
  t.notEqual(appended.datasets.live, state.datasets.live, 'should copy the table for Redux');
  t.equal(appended.layers.length, 1, 'should not create extra layers');
  t.equal(appended.layers[0].id, 'p1', 'should keep the same layer id');
  t.equal(appended.layerOrder[0], 'p1', 'should keep layerOrder');
  t.equal(appended.layerData[0].data.length, 3, 'should rebuild layer data for the new rows');
  t.deepEqual(
    appended.layerData[0].data[1].position.slice(0, 2),
    [20, 10],
    'should plot the first appended point'
  );

  const asObjects = reducer(appended, VisStateActions.addToDataset('live', {lat: 11, lng: 22}));
  t.equal(asObjects.datasets.live.dataContainer.numRows(), 4, 'should append a field-name record');
  t.equal(asObjects.datasets.live.dataContainer.valueAt(3, 0), 11, 'should map lat by field name');
  t.equal(asObjects.layers[0].id, 'p1', 'object rows should not restyle layers');

  const missingKeys = reducer(asObjects, VisStateActions.addToDataset('live', {lat: 99}));
  t.equal(
    missingKeys.datasets.live.dataContainer.numRows(),
    5,
    'should accept a partial object row'
  );
  t.equal(
    missingKeys.datasets.live.dataContainer.valueAt(4, 1),
    null,
    'missing object keys should become null'
  );

  t.end();
});

test('VisStateUpdater -> addToDataset object rows ignore prototype keys', async t => {
  const initialData = processCsvData('lat,lng\n1,2');
  const datasets = await createNewDataEntryMock({
    info: {id: 'live', label: 'live.csv'},
    data: initialData
  });
  const state = {...INITIAL_VIS_STATE, datasets};

  const inheritedLng = Object.assign(Object.create({lng: 999}), {lat: 50});
  const missing = reducer(state, VisStateActions.addToDataset('live', inheritedLng));
  t.equal(missing.datasets.live.dataContainer.numRows(), 2, 'should append the object row');
  t.equal(missing.datasets.live.dataContainer.valueAt(1, 0), 50, 'own lat should be copied');
  t.equal(
    missing.datasets.live.dataContainer.valueAt(1, 1),
    null,
    'inherited lng should become null'
  );

  const own = reducer(missing, VisStateActions.addToDataset('live', {lat: 7, lng: 8}));
  t.equal(own.datasets.live.dataContainer.valueAt(2, 1), 8, 'own lng should still be copied');

  t.end();
});

test('VisStateUpdater -> addToDataset no-ops', async t => {
  const initialData = processCsvData('lat,lng\n1,2');
  const datasets = await createNewDataEntryMock({
    info: {id: 'live', label: 'live.csv'},
    data: initialData
  });
  const state = {...INITIAL_VIS_STATE, datasets};

  t.equal(
    reducer(state, VisStateActions.addToDataset('missing', [1, 2])),
    state,
    'unknown dataset is a no-op'
  );
  t.equal(
    reducer(state, VisStateActions.addToDataset('live', [1])),
    state,
    'wrong column count is a no-op'
  );
  t.equal(
    reducer(state, VisStateActions.addToDataset('live', [])),
    state,
    'empty row list is a no-op'
  );

  datasets.live.dataContainer.append = undefined;
  const warn = sinon.stub(console, 'warn');
  t.equal(
    reducer(state, VisStateActions.addToDataset('live', [3, 4])),
    state,
    'tables without append are a no-op'
  );
  t.ok(warn.called, 'should warn that in-place row edits are not implemented');
  warn.restore();
  t.equal(state.datasets.live.dataContainer.numRows(), 1, 'no-op must not mutate rows');

  t.end();
});

test('VisStateUpdater -> addToDataset reapplies filters', async t => {
  const initialData = processCsvData('lat,lng,value\n37.77,-122.42,10\n37.78,-122.43,20');
  const datasets = await createNewDataEntryMock({
    info: {id: 'live', label: 'live.csv'},
    data: initialData
  });
  const withFilter = reducer({...INITIAL_VIS_STATE, datasets}, VisStateActions.addFilter('live'));
  const named = reducer(withFilter, VisStateActions.setFilter(0, 'name', 'value'));
  const filtered = reducer(named, VisStateActions.setFilter(0, 'value', [0, 15]));

  t.deepEqual(
    filtered.datasets.live.filteredIndexForDomain,
    [0],
    'range filter should hide the out-of-range seed row'
  );

  const appended = reducer(
    filtered,
    VisStateActions.addToDataset('live', [
      [37.79, -122.44, 12],
      [37.8, -122.45, 99]
    ])
  );

  t.equal(
    appended.datasets.live.dataContainer.numRows(),
    4,
    'should still store both appended rows'
  );
  t.deepEqual(
    appended.datasets.live.filteredIndexForDomain,
    [0, 2],
    'should keep in-range rows and hide the out-of-range append'
  );
  t.equal(appended.filters.length, 1, 'should keep the existing filter');

  t.end();
});

test('VisStateUpdater -> removeFromDataset deletes rows and keeps layers', async t => {
  const initialData = processCsvData('lat,lng\n1,2\n3,4\n5,6\n7,8');
  const datasets = await createNewDataEntryMock({
    info: {id: 'live', label: 'live.csv'},
    data: initialData
  });
  const {props} = PointLayer.findDefaultLayerProps(datasets['live']);
  const pointLayer = new PointLayer({
    id: 'p1',
    dataId: 'live',
    isVisible: true,
    ...props[0]
  });
  const {layerData, layer} = calculateLayerData(
    pointLayer,
    {...INITIAL_VIS_STATE, datasets, layers: [pointLayer], layerData: [{}]},
    undefined
  );
  const state = {
    ...INITIAL_VIS_STATE,
    datasets,
    layers: [layer],
    layerData: [layerData],
    layerOrder: [layer.id]
  };

  const removed = reducer(state, VisStateActions.removeFromDataset('live', [0, 2]));
  t.equal(removed.datasets.live.dataContainer.numRows(), 2, 'should drop both indexes');
  t.deepEqual(removed.datasets.live.allIndexes, [0, 1], 'should rebuild contiguous indexes');
  t.equal(removed.datasets.live.dataContainer.valueAt(0, 0), 3, 'should keep the former row 1');
  t.equal(removed.datasets.live.dataContainer.valueAt(1, 0), 7, 'should keep the former row 3');
  t.equal(removed.layers.length, 1, 'should not create extra layers');
  t.equal(removed.layers[0].id, 'p1', 'should keep the same layer id');
  t.equal(removed.layerData[0].data.length, 2, 'should rebuild layer data');

  const oneIndex = reducer(removed, VisStateActions.removeFromDataset('live', 0));
  t.equal(oneIndex.datasets.live.dataContainer.numRows(), 1, 'should accept a single index');
  t.equal(
    oneIndex.datasets.live.dataContainer.valueAt(0, 0),
    7,
    'should keep the last remaining row'
  );

  t.equal(
    reducer(oneIndex, VisStateActions.removeFromDataset('missing', 0)),
    oneIndex,
    'unknown dataset is a no-op'
  );
  t.equal(
    reducer(oneIndex, VisStateActions.removeFromDataset('live', 99)),
    oneIndex,
    'out-of-range index is a no-op'
  );

  oneIndex.datasets.live.dataContainer.remove = undefined;
  const warn = sinon.stub(console, 'warn');
  t.equal(
    reducer(oneIndex, VisStateActions.removeFromDataset('live', 0)),
    oneIndex,
    'tables without remove are a no-op'
  );
  t.ok(warn.called, 'should warn that in-place deletes are not implemented');
  warn.restore();

  t.end();
});

test('VisStateUpdater -> addToDataset rebuilds timestamp mappedValue', async t => {
  const initialData = processCsvData(
    'lat,lng,ts\n37.77,-122.42,2016-09-17 00:09:55\n37.78,-122.43,2016-09-17 00:10:55'
  );
  const datasets = await createNewDataEntryMock({
    info: {id: 'live', label: 'live.csv'},
    data: initialData
  });
  const withFilter = reducer({...INITIAL_VIS_STATE, datasets}, VisStateActions.addFilter('live'));
  const filtered = reducer(withFilter, VisStateActions.setFilter(0, 'name', 'ts'));
  const tsField = filtered.datasets.live.fields.find(f => f.name === 'ts');
  t.equal(
    tsField.filterProps.mappedValue.length,
    2,
    'time filter should cache mappedValue per row'
  );

  const appended = reducer(
    filtered,
    VisStateActions.addToDataset('live', [37.79, -122.44, '2016-09-17 00:11:55'])
  );
  const nextTs = appended.datasets.live.fields.find(f => f.name === 'ts');
  t.equal(
    nextTs.filterProps.mappedValue.length,
    3,
    'mappedValue should cover the appended timestamp row'
  );
  t.ok(
    nextTs.filterProps.mappedValue[2] > nextTs.filterProps.mappedValue[1],
    'appended timestamp should parse into mappedValue'
  );

  const removed = reducer(appended, VisStateActions.removeFromDataset('live', 0));
  const afterRemove = removed.datasets.live.fields.find(f => f.name === 'ts');
  t.equal(
    afterRemove.filterProps.mappedValue.length,
    2,
    'mappedValue should shrink after a row is removed'
  );

  t.end();
});

test('VisStateUpdater -> addToDataset upserts by key', async t => {
  const initialData = processCsvData('id,lat,lng\na,1,2\nb,3,4');
  const datasets = await createNewDataEntryMock({
    info: {id: 'live', label: 'live.csv'},
    data: initialData
  });
  const state = {...INITIAL_VIS_STATE, datasets};

  const upserted = reducer(
    state,
    VisStateActions.addToDataset(
      'live',
      [
        {id: 'b', lat: 30, lng: 40},
        {id: 'c', lat: 5, lng: 6},
        {id: 'b', lat: 33, lng: 44}
      ],
      {upsertBy: 'id'}
    )
  );

  t.equal(upserted.datasets.live.dataContainer.numRows(), 3, 'should append only the new key');
  t.equal(upserted.datasets.live.dataContainer.valueAt(0, 0), 'a', 'should keep unmatched rows');
  t.equal(
    upserted.datasets.live.dataContainer.valueAt(1, 1),
    33,
    'should replace the matching key with the last incoming row'
  );
  t.equal(upserted.datasets.live.dataContainer.valueAt(2, 0), 'c', 'should append the new key');
  t.equal(upserted.layers.length, 0, 'upsert should not create layers');

  t.end();
});

test('VisStateUpdater -> removeFromDataset by field values', async t => {
  const initialData = processCsvData('id,lat,lng\na,1,2\nb,3,4\nc,5,6\nb,7,8');
  const datasets = await createNewDataEntryMock({
    info: {id: 'live', label: 'live.csv'},
    data: initialData
  });
  const state = {...INITIAL_VIS_STATE, datasets};

  const removed = reducer(
    state,
    VisStateActions.removeFromDataset('live', {field: 'id', values: ['b', 'missing']})
  );
  t.equal(removed.datasets.live.dataContainer.numRows(), 2, 'should drop every row with that id');
  t.equal(removed.datasets.live.dataContainer.valueAt(0, 0), 'a', 'should keep unmatched ids');
  t.equal(
    removed.datasets.live.dataContainer.valueAt(1, 0),
    'c',
    'should keep later unmatched ids'
  );

  const none = reducer(
    removed,
    VisStateActions.removeFromDataset('live', {field: 'id', values: 'zzz'})
  );
  t.equal(none, removed, 'unknown values are a no-op');

  t.end();
});

test('VisStateUpdater -> addToDataset and removeFromDataset clear table sort', async t => {
  const initialData = processCsvData('lat,lng\n1,2\n3,4\n5,6');
  const datasets = await createNewDataEntryMock({
    info: {id: 'live', label: 'live.csv'},
    data: initialData
  });
  const unsorted = {...INITIAL_VIS_STATE, datasets};
  const sorted = reducer(unsorted, VisStateActions.sortTableColumn('live', 'lat'));
  t.ok(sorted.datasets.live.sortOrder, 'should have a sort permutation before mutate');
  t.ok(sorted.datasets.live.sortColumn, 'should have sortColumn before mutate');

  const appended = reducer(sorted, VisStateActions.addToDataset('live', [7, 8]));
  t.equal(appended.datasets.live.sortOrder, null, 'append should drop sortOrder');
  t.equal(appended.datasets.live.sortColumn, undefined, 'append should drop sortColumn');

  const sortedAgain = reducer(appended, VisStateActions.sortTableColumn('live', 'lat'));
  t.ok(sortedAgain.datasets.live.sortOrder, 'should be able to sort again after append');

  const removed = reducer(sortedAgain, VisStateActions.removeFromDataset('live', 0));
  t.equal(removed.datasets.live.sortOrder, null, 'remove should drop sortOrder');
  t.equal(removed.datasets.live.sortColumn, undefined, 'remove should drop sortColumn');

  t.end();
});

async function createArrowLiveDatasets(rows) {
  const table = rows instanceof arrow.Table ? rows : arrow.tableFromJSON(rows);
  return createNewDataEntryMock({
    info: {id: 'live', label: 'live.arrow'},
    data: processArrowBatches(table.batches)
  });
}

test('VisStateUpdater -> addToDataset and removeFromDataset on Arrow tables', async t => {
  const datasets = await createArrowLiveDatasets([{lat: 37.77, lng: -122.42}]);
  t.ok(
    typeof datasets.live.dataContainer.append === 'function',
    'Arrow dataset should expose append'
  );

  const {props} = PointLayer.findDefaultLayerProps(datasets.live);
  const pointLayer = new PointLayer({
    id: 'p1',
    dataId: 'live',
    isVisible: true,
    ...props[0]
  });
  const {layerData, layer} = calculateLayerData(
    pointLayer,
    {...INITIAL_VIS_STATE, datasets, layers: [pointLayer], layerData: [{}]},
    undefined
  );
  const state = {
    ...INITIAL_VIS_STATE,
    datasets,
    layers: [layer],
    layerData: [layerData],
    layerOrder: [layer.id]
  };

  const appended = reducer(
    state,
    VisStateActions.addToDataset('live', [
      [10, 20],
      [30, 40]
    ])
  );
  t.equal(appended.datasets.live.dataContainer.numRows(), 3, 'should append both Arrow rows');
  t.equal(appended.layers[0].id, 'p1', 'should keep the same layer id');
  t.equal(
    appended.layerData[0].data.numRows,
    3,
    'should rebuild Arrow layer data with the new row count'
  );
  t.notEqual(
    appended.layerData[0].data,
    state.layerData[0].data,
    'should replace the previous Arrow table snapshot'
  );

  const keyed = await createArrowLiveDatasets([
    {id: 'a', lat: 1, lng: 2},
    {id: 'b', lat: 3, lng: 4}
  ]);
  const upserted = reducer(
    {...INITIAL_VIS_STATE, datasets: keyed},
    VisStateActions.addToDataset(
      'live',
      [
        {id: 'b', lat: 30, lng: 40},
        {id: 'c', lat: 5, lng: 6}
      ],
      {upsertBy: 'id'}
    )
  );
  t.equal(
    upserted.datasets.live.dataContainer.numRows(),
    3,
    'should append only the new Arrow key'
  );
  t.equal(
    upserted.datasets.live.dataContainer.valueAt(1, 1),
    30,
    'should replace the matching Arrow key'
  );
  t.equal(
    upserted.datasets.live.dataContainer.valueAt(2, 0),
    'c',
    'should append the new Arrow key'
  );

  const removed = reducer(
    upserted,
    VisStateActions.removeFromDataset('live', {field: 'id', values: ['b']})
  );
  t.equal(removed.datasets.live.dataContainer.numRows(), 2, 'should drop the matching Arrow id');
  t.equal(
    removed.datasets.live.dataContainer.valueAt(0, 0),
    'a',
    'should keep unmatched Arrow ids'
  );
  t.equal(
    removed.datasets.live.dataContainer.valueAt(1, 0),
    'c',
    'should keep later unmatched Arrow ids'
  );

  t.end();
});

test('VisStateUpdater -> rejected Arrow upserts leave all rows and derived state unchanged', async t => {
  const datasets = await createArrowLiveDatasets(
    new arrow.Table({
      id: arrow.vectorFromArray(['a', 'b'], new arrow.Utf8()),
      amount: arrow.vectorFromArray([1n, 2n], new arrow.Int64())
    })
  );
  const state = reducer(
    {...INITIAL_VIS_STATE, datasets},
    VisStateActions.sortTableColumn('live', 'amount')
  );
  const dataset = state.datasets.live;
  const container = dataset.dataContainer;
  const snapshot = container.getTable();
  const revision = dataset.dataRevision;
  const indexes = dataset.allIndexes;
  const sortOrder = dataset.sortOrder;
  const warn = sinon.stub(Console, 'warn');
  try {
    for (const lastKey of ['b', 'c']) {
      const result = reducer(
        state,
        VisStateActions.addToDataset(
          'live',
          [
            ['a', 10n],
            [lastKey, 'invalid-int64']
          ],
          {
            upsertBy: 'id'
          }
        )
      );
      t.equal(result, state, 'encoding failure is a reducer no-op');
      t.equal(container.getTable(), snapshot, 'no partial Arrow snapshot is committed');
      t.deepEqual(
        container.flattenData(),
        [
          ['a', 1n],
          ['b', 2n]
        ],
        'no earlier replacement leaks'
      );
      t.equal(dataset.dataRevision, revision, 'revision stays unchanged');
      t.equal(dataset.allIndexes, indexes, 'indexes stay unchanged');
      t.equal(dataset.sortOrder, sortOrder, 'sorting stays unchanged');
    }
  } finally {
    warn.restore();
  }
  t.end();
});

test('VisStateUpdater -> Arrow upserts preserve accessors and last incoming values', async t => {
  const datasets = await createArrowLiveDatasets([
    {id: 'a', value: 1},
    {id: 'b', value: 2},
    {id: 'c', value: 3}
  ]);
  let state = {...INITIAL_VIS_STATE, datasets};
  const container = datasets.live.dataContainer;
  const snapshot = container.getTable();
  const accessor = datasets.live.fields[1].valueAccessor;
  const revision = datasets.live.dataRevision;
  state = reducer(
    state,
    VisStateActions.addToDataset(
      'live',
      [
        ['c', 30],
        ['e', 5],
        ['a', 10],
        ['d', 4],
        ['c', 33],
        ['e', 55]
      ],
      {upsertBy: 'id'}
    )
  );
  t.equal(state.datasets.live.dataContainer, container, 'keeps the original container');
  t.deepEqual(
    container.flattenData(),
    [
      ['a', 10],
      ['b', 2],
      ['c', 33],
      ['e', 55],
      ['d', 4]
    ],
    'replacements keep positions and new keys keep first incoming order'
  );
  t.equal(accessor({index: 2}), 33, 'existing accessors read updated values');
  t.equal(snapshot.getChildAt(1).get(2), 3, 'previous Arrow snapshots stay unchanged');
  t.equal(state.datasets.live.dataRevision, revision + 1, 'one revision for the whole batch');
  t.deepEqual(state.datasets.live.allIndexes, [0, 1, 2, 3, 4], 'indexes include appended rows');

  state = reducer(state, VisStateActions.addToDataset('live', [['b', null]], {upsertBy: 'id'}));
  t.equal(container.numRows(), 5, 'replacement-only upsert keeps row count');
  t.equal(container.valueAt(1, 1), null, 'replacement-only upsert accepts null values');
  state = reducer(state, VisStateActions.addToDataset('live', [['f', 6]], {upsertBy: 'id'}));
  t.deepEqual(container.rowAsArray(5), ['f', 6], 'append-only upsert preserves values');

  state = reducer(state, VisStateActions.removeFromDataset('live', [0, 1, 2, 3, 4, 5]));
  state = reducer(state, VisStateActions.addToDataset('live', [['g', 7]], {upsertBy: 'id'}));
  t.deepEqual(
    container.flattenData(),
    [['g', 7]],
    'upsert retains the schema after deleting all rows'
  );
  t.end();
});

test('VisStateUpdater -> Arrow nested deletion preserves list values and IPC', async t => {
  for (const [type, values] of [
    [
      new arrow.Int32(),
      [
        [1, null, 3],
        [4, 5, 6],
        [7, null, 9]
      ]
    ],
    [
      new arrow.Float16(),
      [
        [1.5, 2.5],
        [3, 4],
        [5.5, 6.5]
      ]
    ]
  ]) {
    for (const structWrapped of [false, true]) {
      const list = arrow.vectorFromArray(
        values,
        new arrow.List(new arrow.Field('item', type, true))
      );
      const column = structWrapped
        ? arrow.makeVector({
            type: new arrow.Struct([new arrow.Field('items', list.type, true)]),
            length: values.length,
            children: list.data
          })
        : list;
      const source = new arrow.Table({
        id: arrow.vectorFromArray([1, 2, 3], new arrow.Int32()),
        values: column
      });
      const datasets = await createArrowLiveDatasets(source);
      const state = {...INITIAL_VIS_STATE, datasets};
      const readValues = table =>
        Array.from(table.getChildAt(1), value => Array.from(structWrapped ? value.items : value));

      const removed = reducer(
        state,
        VisStateActions.removeFromDataset('live', {field: 'id', values: [2]})
      );
      const edited = removed.datasets.live.dataContainer.getTable();
      t.notEqual(removed, state, `${column.type} deletion succeeds`);
      t.deepEqual(readValues(edited), [values[0], values[2]], 'retained list values are unchanged');
      t.deepEqual(
        readValues(arrow.tableFromIPC(arrow.tableToIPC(edited))),
        [values[0], values[2]],
        'IPC preserves the retained logical values and nulls'
      );
      t.deepEqual(readValues(source), values, 'the original Arrow snapshot stays unchanged');
    }
  }
  t.end();
});

test('VisStateUpdater -> Arrow nested deletion preserves shared dictionaries and IPC', async t => {
  const dictionary = arrow.vectorFromArray(['a', 'b', 'c'], new arrow.Utf8());
  const dictionaryType = new arrow.Dictionary(dictionary.type, new arrow.Int8(), 17);
  const column = arrow.makeVector({
    type: new arrow.List(new arrow.Field('item', dictionaryType, true)),
    valueOffsets: new Int32Array([0, 1, 2, 3]),
    child: arrow.makeData({
      type: dictionaryType,
      data: new Int8Array([0, 1, 2]),
      dictionary
    })
  });
  const source = new arrow.Table({left: column, right: column});
  const datasets = await createArrowLiveDatasets(source);
  const state = {...INITIAL_VIS_STATE, datasets};
  const removed = reducer(state, VisStateActions.removeFromDataset('live', [1]));
  const edited = removed.datasets.live.dataContainer.getTable();
  const readValues = table =>
    table.schema.fields.map((_, i) => Array.from(table.getChildAt(i), value => Array.from(value)));
  const expected = [
    [['a'], ['c']],
    [['a'], ['c']]
  ];

  t.notEqual(removed, state, 'deletion succeeds for columns sharing a nested dictionary');
  t.deepEqual(readValues(edited), expected, 'both columns retain their unmatched values');
  for (const batch of edited.batches) {
    t.equal(
      batch.getChildAt(0).data[0].children[0].dictionary,
      batch.getChildAt(1).data[0].children[0].dictionary,
      'the shared dictionary id retains one dictionary'
    );
  }
  t.deepEqual(
    readValues(arrow.tableFromIPC(arrow.tableToIPC(edited))),
    expected,
    'IPC preserves both nested dictionary columns'
  );
  t.deepEqual(
    readValues(source),
    [
      [['a'], ['b'], ['c']],
      [['a'], ['b'], ['c']]
    ],
    'the original Arrow snapshot stays unchanged'
  );
  t.end();
});

test('VisStateUpdater -> Arrow nested deletion keeps exact timestamps and point rendering', async t => {
  for (const [type, values] of [
    [
      new arrow.TimestampNanosecond('UTC'),
      [1700000000000000123n, 1700000000000000456n, 1700000000000000789n]
    ],
    [
      new arrow.TimestampMicrosecond('UTC'),
      [1700000000000123n, 1700000000000456n, 1700000000000789n]
    ]
  ]) {
    for (const listWrapped of [false, true]) {
      const timestamps = arrow.makeVector({type, data: new BigInt64Array(values)});
      const child = listWrapped
        ? arrow.makeVector({
            type: new arrow.List(new arrow.Field('item', type, true)),
            valueOffsets: new Int32Array([0, 1, 2, 3]),
            child: timestamps.data[0]
          })
        : timestamps;
      const history = arrow.makeVector({
        type: new arrow.Struct([new arrow.Field('time', child.type, true)]),
        length: values.length,
        children: child.data
      });
      const source = new arrow.Table({
        lat: arrow.vectorFromArray([37, 38, 39], new arrow.Float64()),
        lng: arrow.vectorFromArray([-122, -123, -124], new arrow.Float64()),
        history
      });
      const datasets = await createArrowLiveDatasets(source);
      const point = new PointLayer({
        id: 'points',
        dataId: 'live',
        isVisible: true,
        ...PointLayer.findDefaultLayerProps(datasets.live).props[0]
      });
      const initial = {
        ...INITIAL_VIS_STATE,
        datasets,
        layers: [point],
        layerData: [{}],
        layerOrder: [point.id]
      };
      const {layer, layerData} = calculateLayerData(point, initial, undefined);
      const state = {...initial, layers: [layer], layerData: [layerData]};
      const renderPoints = current => {
        const dataset = current.datasets.live;
        return current.layers[0]
          .renderLayer({
            data: current.layerData[0],
            dataset,
            idx: 0,
            layerInteraction: {},
            mapState: INITIAL_MAP_STATE,
            gpuFilter: dataset.gpuFilter,
            interactionConfig: current.interactionConfig,
            visible: true,
            layerCallbacks: {}
          })[0]
          .renderLayers();
      };
      t.equal(
        renderPoints(state).reduce((count, rendered) => count + rendered.props.data.length, 0),
        3,
        'the original point layer renders all rows'
      );

      const removed = reducer(state, VisStateActions.removeFromDataset('live', [1]));
      const edited = removed.datasets.live.dataContainer.getTable();
      const rawTimestamps = table =>
        listWrapped
          ? Array.from(table.getChildAt(2), value => value.time.toArray()[0])
          : Array.from(
              new arrow.Vector(table.getChildAt(2).data.map(data => data.children[0])).toArray()
            );
      t.notEqual(removed, state, `${history.type} deletion succeeds`);
      t.equal(edited.numRows, 2, 'only the requested row is deleted');
      t.deepEqual(
        rawTimestamps(edited),
        [values[0], values[2]],
        'retained timestamp storage is exact'
      );
      t.deepEqual(
        rawTimestamps(arrow.tableFromIPC(arrow.tableToIPC(edited))),
        [values[0], values[2]],
        'IPC preserves exact nested timestamp storage'
      );
      t.deepEqual(rawTimestamps(source), values, 'the original timestamp snapshot stays unchanged');
      let rendered;
      t.doesNotThrow(() => {
        rendered = renderPoints(removed);
      }, 'the ordinary lat/lng point layer still renders after deletion');
      if (rendered) {
        t.equal(
          rendered.reduce((count, sublayer) => count + sublayer.props.data.length, 0),
          2,
          'the rendered point layer contains both retained rows'
        );
      }
    }
  }
  t.end();
});

test('VisStateUpdater -> Arrow Int64 upserts match JSON keys and reject invalid batches', async t => {
  const largeId = 9007199254740993n;
  const source = new arrow.Table({
    id: arrow.vectorFromArray([1n, largeId], new arrow.Int64()),
    value: arrow.vectorFromArray([1, 2], new arrow.Int32())
  });
  const datasets = await createArrowLiveDatasets(source);
  let state = {...INITIAL_VIS_STATE, datasets};
  state = reducer(
    state,
    VisStateActions.addToDataset('live', [{id: String(largeId), value: 20}], {upsertBy: 'id'})
  );
  const container = state.datasets.live.dataContainer;
  t.deepEqual(
    container.flattenData(),
    [
      [1n, 1],
      [largeId, 20]
    ],
    'a decimal string replaces its exact existing Int64 key without adding a duplicate'
  );

  state = reducer(
    state,
    VisStateActions.addToDataset(
      'live',
      [
        {id: '01', value: 11},
        {id: '2', value: 21},
        {id: 1n, value: 12},
        {id: '02', value: 22},
        {id: '1', value: 13},
        {id: 2n, value: 23}
      ],
      {upsertBy: 'id'}
    )
  );
  const expected = [
    [1n, 13],
    [largeId, 20],
    [2n, 23]
  ];
  t.deepEqual(
    container.flattenData(),
    expected,
    'accepted key representations share last-wins matching'
  );
  const restored = arrow.tableFromIPC(arrow.tableToIPC(container.getTable()));
  t.deepEqual(
    Array.from(restored.getChildAt(0)),
    [1n, largeId, 2n],
    'IPC keeps exact unique Int64 keys'
  );

  const snapshot = container.getTable();
  const beforeRejectedRows = container.flattenData();
  const revision = state.datasets.live.dataRevision;
  const indexes = state.datasets.live.allIndexes;
  const warn = sinon.stub(Console, 'warn');
  try {
    const rejected = reducer(
      state,
      VisStateActions.addToDataset(
        'live',
        [
          {id: String(largeId), value: 30},
          {id: 'invalid-int64', value: 40}
        ],
        {upsertBy: 'id'}
      )
    );
    t.equal(rejected, state, 'an invalid key rejects the entire public-action batch');
    t.equal(container.getTable(), snapshot, 'a rejected batch retains the Arrow snapshot');
    t.deepEqual(
      container.flattenData(),
      beforeRejectedRows,
      'a rejected batch cannot leak an earlier replacement'
    );
    t.equal(state.datasets.live.dataRevision, revision, 'a rejected batch preserves the revision');
    t.equal(state.datasets.live.allIndexes, indexes, 'a rejected batch preserves row indexes');
  } finally {
    warn.restore();
  }
  t.deepEqual(Array.from(source.getChildAt(0)), [1n, largeId], 'source keys remain unchanged');
  t.deepEqual(Array.from(source.getChildAt(1)), [1, 2], 'source values remain unchanged');
  t.end();
});
