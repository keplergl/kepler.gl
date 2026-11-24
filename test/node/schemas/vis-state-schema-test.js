// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import cloneDeep from 'es-toolkit/compat/cloneDeep';
import {cmpFilters, cmpSavedLayers} from 'test/helpers/comparison-utils';
import SchemaManager, {CURRENT_VERSION, visStateSchema} from '@kepler.gl/schemas';

import {
  StateWArcNeighbors,
  StateWEffects,
  StateWFiles,
  StateWFilesFiltersLayerColor,
  StateWLayerCustomColorBreaks,
  StateWTooltipFormat,
  StateWTripGeojson,
  StateWTripTable,
  expectedSavedLayer0,
  expectedLoadedLayer0,
  expectedSavedLayer1,
  expectedLoadedLayer1,
  expectedSavedLayer2,
  expectedLoadedLayer2,
  expectedSavedTripLayer,
  mockColorRange,
  testCsvDataId,
  testGeoJsonDataId
} from 'test/helpers/mock-state';
import {keplerGlReducerCore as keplerGlReducer, validateLayerWithData} from '@kepler.gl/reducers';
import {VisStateActions} from '@kepler.gl/actions';
import {AnnotationKind, FILTER_VIEW_TYPES, SHADOW_MAP_RESOLUTIONS} from '@kepler.gl/constants';
import {createEffect} from '@kepler.gl/effects';
import {KeplerGlLayers} from '@kepler.gl/layers';

test('#visStateSchema -> cluster radius units preserve legacy pixel maps and round trip', t => {
  const state = cloneDeep(StateWFilesFiltersLayerColor);
  const layer = new KeplerGlLayers.ClusterLayer({id: 'cluster-units', dataId: testCsvDataId});
  layer.updateLayerConfig({columns: state.visState.layers[0].config.columns});
  layer.updateLayerVisConfig({clusterRadius: 75, clusterRadiusMeters: 250});
  state.visState.layers = [layer];
  state.visState.layerOrder = [layer.id];
  const rebuild = saved =>
    validateLayerWithData(
      state.visState.datasets[testCsvDataId],
      SchemaManager.parseSavedConfig(saved).visState.layers[0],
      state.visState.layerClasses
    );
  for (const clusterRadiusInMeters of [true, false]) {
    layer.updateLayerVisConfig({clusterRadiusInMeters});
    const saved = SchemaManager.getConfigToSave(state);
    const loaded = rebuild(saved);
    t.ok(loaded, 'saved cluster layer reconstructs');
    t.equal(
      loaded.config.visConfig.clusterRadiusInMeters,
      clusterRadiusInMeters,
      'unit choice round trips'
    );
    t.equal(loaded.config.visConfig.clusterRadius, 75, 'preserves pixel radius');
    t.equal(loaded.config.visConfig.clusterRadiusMeters, 250, 'preserves meter radius');
  }
  const legacy = SchemaManager.getConfigToSave(state);
  delete legacy.config.visState.layers[0].config.visConfig.clusterRadiusInMeters;
  delete legacy.config.visState.layers[0].config.visConfig.clusterRadiusMeters;
  const loaded = rebuild(legacy);
  t.equal(loaded.config.visConfig.clusterRadiusInMeters, false, 'old maps default to pixels');
  t.equal(loaded.config.visConfig.clusterRadius, 75, 'old pixel radius is not reinterpreted');
  t.equal(
    loaded.config.visConfig.clusterRadiusMeters,
    40,
    'missing meter radius receives its default'
  );
  t.end();
});

const expectedVisStateEntries = [
  'filters',
  'layers',
  'effects',
  'annotations',
  'interactionConfig',
  'layerBlending',
  'overlayBlending',
  'splitMaps',
  'animationConfig',
  'editor',
  'layerOrder',
  'groupBys',
  'joins'
];

test('#visStateSchema -> annotation opacity transitions round trip without changing old annotations', t => {
  const state = cloneDeep(StateWFilesFiltersLayerColor);
  const first = {
    id: 'first',
    startTimeMs: 1000,
    endTimeMs: 3000,
    startValue: 0,
    endValue: 0.8,
    easing: 'linear'
  };
  const last = {
    id: 'last',
    startTimeMs: 5000,
    endTimeMs: 7000,
    startValue: 0.8,
    endValue: 0,
    easing: 'easeInOut'
  };
  const annotation = {
    id: 'animated-note',
    kind: AnnotationKind.TEXT,
    isVisible: true,
    anchorPoint: [0, 0],
    label: 'Note',
    propertyTransitions: {opacity: [last, first], futureProperty: [{...first, endValue: 10}]}
  };
  state.visState.annotations = [annotation];
  const saved = SchemaManager.getConfigToSave(state);
  const savedAnnotation = saved.config.visState.annotations[0];
  t.deepEqual(
    savedAnnotation.propertyTransitions?.opacity,
    [first, last],
    'saves multiple normalized transitions'
  );
  t.notEqual(
    savedAnnotation.propertyTransitions?.opacity,
    annotation.propertyTransitions?.opacity,
    'saving clones the track'
  );
  t.notEqual(
    savedAnnotation.propertyTransitions?.opacity[0],
    first,
    'saving clones individual transitions'
  );
  const loaded = SchemaManager.parseSavedConfig(saved).visState.annotations[0];
  t.deepEqual(loaded.propertyTransitions?.opacity, [first, last], 'loads multiple transitions');
  t.deepEqual(
    loaded.propertyTransitions.futureProperty,
    [{...first, endValue: 10}],
    'preserves other property tracks'
  );
  loaded.propertyTransitions.opacity[0].endValue = 0.4;
  t.equal(
    savedAnnotation.propertyTransitions?.opacity[0].endValue,
    0.8,
    'loaded transitions do not alias the saved config'
  );
  t.equal(first.endValue, 0.8, 'round trip leaves authored values unchanged');
  t.equal(
    annotation.propertyTransitions?.opacity[0].id,
    'last',
    'saving does not reorder authored input'
  );

  annotation.propertyTransitions = {opacity: []};
  const cleared = SchemaManager.getConfigToSave(state);
  t.deepEqual(
    SchemaManager.parseSavedConfig(cleared).visState.annotations[0].propertyTransitions?.opacity,
    [],
    'explicit clear survives save/load'
  );
  delete annotation.propertyTransitions;
  const legacy = SchemaManager.getConfigToSave(state);
  t.notOk(
    'propertyTransitions' in legacy.config.visState.annotations[0],
    'old annotations omit animation metadata'
  );
  t.notOk(
    'propertyTransitions' in SchemaManager.parseSavedConfig(legacy).visState.annotations[0],
    'loading old annotations adds no animation metadata'
  );

  for (const invalid of [[{...first, endValue: 2}], [first, {...last, startTimeMs: 2000}]]) {
    annotation.propertyTransitions = {opacity: invalid};
    t.notOk(
      'propertyTransitions' in SchemaManager.getConfigToSave(state).config.visState.annotations[0],
      'save rejects invalid or overlapping transitions'
    );
    savedAnnotation.propertyTransitions = {opacity: invalid};
    t.notOk(
      'propertyTransitions' in SchemaManager.parseSavedConfig(saved).visState.annotations[0],
      'load rejects invalid or overlapping transitions'
    );
  }
  t.end();
});

test('#visStateSchema -> camera bookmarks are optional and persist only authored fields', t => {
  const camera = {longitude: 10, latitude: 20, zoom: 6, bearing: 30, pitch: 45};
  const bookmarks = [
    {id: 'second', name: 'Second', camera},
    {id: 'first', name: 'First', camera: {...camera, zoom: 8}}
  ];
  const state = cloneDeep(StateWFilesFiltersLayerColor);
  const empty = SchemaManager.getConfigToSave(state);
  t.notOk('cameraBookmarks' in empty.config.visState, 'omits unused bookmarks');
  t.notOk(
    'cameraBookmarks' in SchemaManager.parseSavedConfig(empty).visState,
    'old maps need no bookmarks'
  );
  state.visState.cameraBookmarks = bookmarks.map(bookmark => ({
    ...bookmark,
    selected: true,
    camera: {...bookmark.camera, width: 800, transitionDuration: 1000}
  }));
  const saved = SchemaManager.getConfigToSave(state);
  t.deepEqual(
    saved.config.visState.cameraBookmarks,
    bookmarks,
    'saves names/order and only camera values'
  );
  t.deepEqual(
    SchemaManager.parseSavedConfig(saved).visState.cameraBookmarks,
    bookmarks,
    'round trips'
  );
  saved.config.visState.cameraBookmarks.push(null, {id: 'invalid', camera: {}});
  t.deepEqual(
    SchemaManager.parseSavedConfig(saved).visState.cameraBookmarks,
    bookmarks,
    'ignores invalid entries'
  );
  t.end();
});

test('#visStateSchema -> camera tour is optional and excludes transient state', t => {
  const state = cloneDeep(StateWFilesFiltersLayerColor);
  t.notOk(
    'cameraTour' in SchemaManager.getConfigToSave(state).config.visState,
    'omits unused tours'
  );
  const stop = {
    id: 'first',
    name: 'First',
    camera: {longitude: 10, latitude: 20, zoom: 6, bearing: 30, pitch: 45},
    holdDurationMs: 2000,
    travelDurationMs: 3000
  };
  state.visState.cameraTour = {stops: [{...stop, selected: true}], elapsedMs: 1000, playing: true};
  const saved = SchemaManager.getConfigToSave(state);
  t.deepEqual(
    saved.config.visState.cameraTour,
    {stops: [stop]},
    'saves authored stops and timing only'
  );
  t.deepEqual(
    SchemaManager.parseSavedConfig(saved).visState.cameraTour,
    {stops: [stop]},
    'round trips the tour'
  );
  state.visState.cameraTour = {stops: []};
  t.notOk(
    'cameraTour' in SchemaManager.getConfigToSave(state).config.visState,
    'omits an empty tour'
  );
  t.end();
});

test('#visStateSchema -> v1 -> save layers', t => {
  const initialState = cloneDeep(StateWFilesFiltersLayerColor);

  // save state
  const vsToSave = SchemaManager.getConfigToSave(initialState).config.visState;

  t.deepEqual(
    Object.keys(vsToSave),
    expectedVisStateEntries,
    `visState should have all ${expectedVisStateEntries.length} entries`
  );

  const exptectedSavedLayers = [expectedSavedLayer0, expectedSavedLayer1, expectedSavedLayer2];

  const layersToSave = vsToSave.layers;

  cmpSavedLayers(t, exptectedSavedLayers, layersToSave);
  t.end();
});

test('#visStateSchema -> v1 -> load layers', t => {
  const initialState = cloneDeep(StateWFilesFiltersLayerColor);

  // save state
  const savedState = SchemaManager.getConfigToSave(initialState);
  const vsLoaded = SchemaManager.parseSavedConfig(savedState).visState;

  t.deepEqual(
    Object.keys(vsLoaded),
    expectedVisStateEntries,
    `visState should have all ${expectedVisStateEntries.length} entries`
  );

  const loadedLayers = vsLoaded.layers;

  const expectedLoadedLayers = [expectedLoadedLayer0, expectedLoadedLayer1, expectedLoadedLayer2];

  cmpSavedLayers(t, expectedLoadedLayers, loadedLayers, {id: true});
  t.end();
});

test('#visStateSchema -> filter playback loop is optional and survives save/load', t => {
  const state = cloneDeep(StateWFilesFiltersLayerColor);
  const legacy = SchemaManager.getConfigToSave(state);
  t.notOk(
    'animationLoop' in legacy.config.visState.filters[0],
    'legacy maps do not gain a loop setting'
  );
  t.equal(
    SchemaManager.parseSavedConfig(legacy).visState.filters[0].animationLoop,
    undefined,
    'legacy playback keeps its default'
  );
  for (const animationLoop of [false, true]) {
    state.visState.filters[0].animationLoop = animationLoop;
    const saved = SchemaManager.getConfigToSave(state);
    t.equal(
      saved.config.visState.filters[0].animationLoop,
      animationLoop,
      'saves explicit loop preference'
    );
    t.equal(
      SchemaManager.parseSavedConfig(saved).visState.filters[0].animationLoop,
      animationLoop,
      'loads explicit loop preference'
    );
  }
  t.end();
});

test('#visStateSchema -> v1 -> save load filters', t => {
  const initialState = cloneDeep(StateWFilesFiltersLayerColor);
  initialState.visState.filters[0].inverted = true;
  const savedState = SchemaManager.getConfigToSave(initialState);

  // save state
  const vsToSave = savedState.config.visState;
  const vsLoaded = SchemaManager.parseSavedConfig(savedState).visState;
  const loadedFilters = vsLoaded.filters;

  // test saved filters
  const filtersToSave = vsToSave.filters;

  const expectedSavedFilters = [
    {
      dataId: [testCsvDataId],
      id: 'hjpn8frza',
      enabled: true,
      inverted: true,
      name: ['time'],
      type: 'timeRange',
      value: [1474606800000, 1474617600000],
      view: 'enlarged',
      plotType: {
        interval: '1-hour',
        defaultTimeFormat: 'L  H A',
        type: 'histogram',
        aggregation: 'average'
      },
      yAxis: null,
      animationWindow: 'free',
      speed: 4
    },
    {
      dataId: [testGeoJsonDataId],
      id: 'vpk2466o',
      enabled: true,
      name: ['RATE'],
      type: 'multiSelect',
      value: ['a'],
      view: 'side',
      plotType: {
        type: 'histogram'
      },
      yAxis: null,
      animationWindow: 'free',
      speed: 1
    }
  ];

  cmpFilters(t, expectedSavedFilters, filtersToSave);
  cmpFilters(t, expectedSavedFilters, loadedFilters);

  t.end();
});

test('#visStateSchema -> v1 -> persists timeline layer grouping and independent preferences', t => {
  const initialState = cloneDeep(StateWFilesFiltersLayerColor);
  const independent = {fieldName: 'gps_data.lat', numGroups: 3, groupOthers: true};
  const state = keplerGlReducer(
    initialState,
    VisStateActions.setFilterPlot(0, {
      plotType: {
        groupBy: {
          ...independent,
          source: 'layer',
          layerId: initialState.visState.layers[0].id
        }
      }
    })
  );
  const expected = state.visState.filters[0].plotType.groupBy;
  const savedState = SchemaManager.getConfigToSave(state);
  const loaded = SchemaManager.parseSavedConfig(savedState).visState;

  t.deepEqual(savedState.config.visState.filters[0].plotType.groupBy, expected, 'saves grouping');
  t.deepEqual(
    loaded.filters[0].plotType.groupBy,
    expected,
    'loads source and independent settings'
  );
  t.ok(
    loaded.layers.some(layer => layer.id === expected.layerId),
    'retains the referenced layer id across save and load'
  );
  const restored = keplerGlReducer(
    state,
    VisStateActions.setFilterPlot(0, {
      plotType: {groupBy: {source: 'independent'}}
    })
  ).visState.filters[0].plotType.groupBy;
  t.equal(restored.fieldName, independent.fieldName, 'restores independent field after unlinking');
  t.equal(restored.numGroups, independent.numGroups, 'restores independent group count');
  t.equal(restored.groupOthers, independent.groupOthers, 'restores independent Others option');
  t.end();
});

test('#visStateSchema -> v1 -> persists opt-in numeric timeline configuration', t => {
  let state = keplerGlReducer(
    cloneDeep(StateWFilesFiltersLayerColor),
    VisStateActions.setFilter(0, 'name', 'gps_data.lat')
  );
  state = keplerGlReducer(
    state,
    VisStateActions.setFilterPlot(0, {plotType: {numericInterval: 0.01}})
  );
  state = keplerGlReducer(state, VisStateActions.setFilterView(0, FILTER_VIEW_TYPES.enlarged));

  const savedState = SchemaManager.getConfigToSave(state);
  const savedFilter = savedState.config.visState.filters[0];
  const loadedFilter = SchemaManager.parseSavedConfig(savedState).visState.filters[0];

  t.equal(savedFilter.view, FILTER_VIEW_TYPES.enlarged, 'should save numeric timeline enablement');
  t.equal(savedFilter.plotType.numericInterval, 0.01, 'should save the numeric bin size');
  t.equal(loadedFilter.view, FILTER_VIEW_TYPES.enlarged, 'should restore numeric enablement');
  t.equal(loadedFilter.plotType.numericInterval, 0.01, 'should restore numeric binning');
  t.notOk(loadedFilter.timezone, 'should not load time-only configuration');
  t.end();
});

test('#visStateSchema -> v1 -> save and validate filters', t => {
  const initialState = cloneDeep(StateWFilesFiltersLayerColor);

  // add empty filter
  const nextStte = keplerGlReducer(initialState, VisStateActions.addFilter(testCsvDataId));
  const savedState = SchemaManager.getConfigToSave(nextStte);

  t.equal(nextStte.visState.filters.length, 3, 'should have 3 filters');
  t.equal(savedState.config.visState.filters.length, 2, 'should only save 2 filters');

  t.end();
});

test('#visStateSchema -> v1 -> save load interaction', t => {
  const initialState = cloneDeep(StateWFilesFiltersLayerColor);
  const savedState = SchemaManager.getConfigToSave(initialState);

  // save state
  const interactionToSave = savedState.config.visState.interactionConfig;
  const interactionLoaded = SchemaManager.parseSavedConfig(savedState).visState.interactionConfig;

  const expectedSaved = {
    tooltip: {
      enabled: true,
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
        ],
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
    },
    brush: {
      enabled: false,
      size: 2.5
    },
    coordinate: {
      enabled: false
    },
    geocoder: {
      enabled: false,
      limitSearch: false,
      color: [255, 0, 0]
    },
    legend: {
      enabled: false,
      hideInvisibleLayers: false
    },
    annotation: {
      enabled: false
    },
    zoomOpacity: {
      enabled: false,
      controllers: []
    }
  };

  t.deepEqual(interactionToSave, expectedSaved);
  t.deepEqual(interactionLoaded, expectedSaved);

  t.end();
});

test('#visStateSchema -> v1 -> save load interaction -> tooltip format', t => {
  const baseState = cloneDeep(StateWTooltipFormat);
  const tooltip = baseState.visState.interactionConfig.tooltip;
  const initialState = {
    ...baseState,
    visState: {
      ...baseState.visState,
      interactionConfig: {
        ...baseState.visState.interactionConfig,
        tooltip: {
          ...tooltip,
          config: {
            ...tooltip.config,
            timezone: 'America/Guayaquil'
          }
        }
      }
    }
  };
  const savedState = SchemaManager.getConfigToSave(initialState);

  // save state
  const interactionToSave = savedState.config.visState.interactionConfig;
  const interactionLoaded = SchemaManager.parseSavedConfig(savedState).visState.interactionConfig;

  const expectedSaved = {
    tooltip: {
      enabled: true,
      timezone: 'America/Guayaquil',
      compareMode: true,
      compareType: 'relative',
      fieldsToShow: {
        [testCsvDataId]: [{name: 'gps_data.utc_timestamp', format: 'LL'}],
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
            format: '.3f'
          },
          {
            name: 'RATE',
            format: null
          }
        ]
      }
    },
    brush: {
      enabled: false,
      size: 2.5
    },
    coordinate: {
      enabled: false
    },
    geocoder: {
      enabled: false,
      limitSearch: false,
      color: [255, 0, 0]
    },
    legend: {
      enabled: false,
      hideInvisibleLayers: false
    },
    annotation: {
      enabled: false
    },
    zoomOpacity: {
      enabled: false,
      controllers: []
    }
  };

  t.deepEqual(interactionToSave, expectedSaved);
  t.deepEqual(interactionLoaded, expectedSaved);

  t.end();
});

test('#visStateSchema -> v1 -> save load layerBlending', t => {
  const initialState = cloneDeep(StateWFilesFiltersLayerColor);
  const savedState = SchemaManager.getConfigToSave(initialState);

  // save state
  const layerBlendingToSave = savedState.config.visState.layerBlending;
  const layerBlendingLoaded = SchemaManager.parseSavedConfig(savedState).visState.layerBlending;

  const expectedSaved = 'normal';

  t.deepEqual(layerBlendingToSave, expectedSaved);
  t.deepEqual(layerBlendingLoaded, expectedSaved);

  t.end();
});

test('#visStateSchema -> v1 -> save animation', t => {
  const initialState = cloneDeep(StateWTripGeojson);

  // save state
  const vsToSave = SchemaManager.getConfigToSave(initialState).config.visState;

  t.deepEqual(
    Object.keys(vsToSave),
    expectedVisStateEntries,
    `visState should have all ${expectedVisStateEntries.length} entries`
  );

  const expectedSavedLayers = [expectedSavedTripLayer];
  const expectedAnimationConfig = {
    currentTime: 1565577261000,
    speed: 1,
    timeFormat: null,
    timezone: null
  };
  cmpSavedLayers(t, expectedSavedLayers, vsToSave.layers);

  t.deepEqual(vsToSave.animationConfig, expectedAnimationConfig, 'should save animationConfig');
  t.end();
});

test('visStateSchema -> saving with a null column value does not throw an error', t => {
  const testLayer = cloneDeep(StateWFiles).visState.layers[0];

  // set a column to null
  testLayer.config.columns.altitude = null;

  // test that it doesn't fail ColumnSchemaV1.save
  t.doesNotThrow(() => {
    visStateSchema[CURRENT_VERSION].save({
      layers: [testLayer],
      layerOrder: [testLayer.id]
    });
  }, 'saving with a null column value should not fail');

  t.end();
});

test('#visStateSchema -> v1 -> save load effects', t => {
  const expectedEffects = [
    {
      id: 'e_4',
      type: 'lightAndShadow',
      isEnabled: true,
      parameters: {
        timestamp: 100,
        timezone: 'UTC',
        timeMode: 'pick',
        shadowIntensity: 0.5,
        shadowColor: [0, 0, 0],
        sunLightColor: [255, 255, 255],
        sunLightIntensity: 1,
        ambientLightColor: [255, 255, 255],
        ambientLightIntensity: 1
      }
    },
    {
      id: 'e_3',
      type: 'magnify',
      isEnabled: true,
      parameters: {
        screenXY: [0.5, 0.5],
        radiusPixels: 200,
        zoom: 2,
        borderWidthPixels: 3,
        borderColor: [255, 255, 255, 255]
      }
    },
    {
      id: 'e_2',
      type: 'sepia',
      isEnabled: true,
      parameters: {amount: 0.5}
    },
    {
      id: 'e_1',
      type: 'ink',
      isEnabled: true,
      parameters: {strength: 0.25}
    }
  ];

  const initialState = cloneDeep(StateWEffects);

  const savedState = SchemaManager.getConfigToSave(initialState);
  const savedEffects = savedState.config.visState.effects;

  const loadedState = SchemaManager.parseSavedConfig(savedState);
  const loadedEffects = loadedState.visState.effects;

  t.deepEqual(savedEffects, expectedEffects, 'Effects should be saved as expected');
  t.deepEqual(loadedEffects, expectedEffects, 'Effects should be loaded as expected');

  t.end();
});

test('#visStateSchema -> v1 -> explicit shadow map resolution round trips', t => {
  const state = cloneDeep(StateWEffects);
  const effect = state.visState.effects.find(item => item.type === 'lightAndShadow');
  effect.setProps({parameters: {shadowMapResolution: SHADOW_MAP_RESOLUTIONS.high}});

  const saved = SchemaManager.getConfigToSave(state);
  const savedEffect = saved.config.visState.effects.find(item => item.id === effect.id);
  t.equal(
    savedEffect.parameters.shadowMapResolution,
    SHADOW_MAP_RESOLUTIONS.high,
    'saves an explicit shadow map resolution'
  );
  const loaded = SchemaManager.parseSavedConfig(saved);
  const loadedEffect = createEffect(loaded.visState.effects.find(item => item.id === effect.id));
  t.equal(
    loadedEffect.parameters.shadowMapResolution,
    SHADOW_MAP_RESOLUTIONS.high,
    'restores the chosen resolution'
  );
  t.end();
});

test('#visStateSchema -> v1 -> optional effect animation round trips', t => {
  const state = cloneDeep(StateWEffects);
  const effect = state.visState.effects.find(item => item.type === 'sepia');
  const animation = {
    amount: [
      {
        id: 'amount-1',
        startValue: 0.25,
        endValue: 0,
        easing: 'linear',
        startTimeMs: 2000,
        endTimeMs: 6000
      }
    ]
  };
  effect.setProps({parameters: {amount: 0.7}});
  const parameters = {...effect.parameters};
  effect.setProps({animation});

  const saved = SchemaManager.getConfigToSave(state);
  const savedEffect = saved.config.visState.effects.find(item => item.id === effect.id);
  t.deepEqual(
    savedEffect.animation,
    animation,
    'saves optional animation, including zero endpoints and explicit elapsed times'
  );
  t.deepEqual(savedEffect.parameters, parameters, 'keeps static parameters separate from Start');
  t.deepEqual(effect.deckEffect.props, parameters, 'animation endpoints do not reach uniforms');
  const loaded = SchemaManager.parseSavedConfig(saved);
  const loadedEffect = createEffect(loaded.visState.effects.find(item => item.id === effect.id));
  t.deepEqual(loadedEffect.animation, animation, 'reconstructs animation after loading');
  t.deepEqual(loadedEffect.parameters, parameters, 'restores the separate static parameters');
  t.deepEqual(loadedEffect.deckEffect.props, parameters, 'loaded uniforms retain static values');

  effect.setProps({animation: {}});
  const cleared = SchemaManager.getConfigToSave(state);
  t.notOk(
    'animation' in cleared.config.visState.effects.find(item => item.id === effect.id),
    'removing endpoints omits animation from saved config'
  );
  t.end();
});

test('#visStateSchema -> v1 -> shadow timestamp animation round trips independently of static time', t => {
  const state = cloneDeep(StateWEffects);
  const effect = state.visState.effects.find(item => item.type === 'lightAndShadow');
  effect.setProps({
    parameters: {
      timestamp: Date.UTC(2024, 6, 1, 12),
      timezone: 'America/New_York',
      timeMode: 'animation'
    }
  });
  const parameters = {...effect.parameters};
  const animation = {
    timestamp: [
      {
        id: 'timestamp-1',
        startTimeMs: 0,
        endTimeMs: 10000,
        startValue: Date.UTC(2024, 0, 1, 6),
        endValue: Date.UTC(2024, 0, 1, 18),
        easing: 'linear'
      }
    ]
  };
  effect.setProps({animation});

  const saved = SchemaManager.getConfigToSave(state);
  const savedEffect = saved.config.visState.effects.find(item => item.id === effect.id);
  t.deepEqual(savedEffect.animation, animation, 'saves explicit UTC shadow time endpoints');
  t.deepEqual(
    savedEffect.parameters,
    parameters,
    'saves static timestamp, timezone and time mode unchanged'
  );
  const loaded = SchemaManager.parseSavedConfig(saved);
  const loadedEffect = createEffect(loaded.visState.effects.find(item => item.id === effect.id));
  t.deepEqual(loadedEffect.animation, animation, 'reconstructs validated timestamp animation');
  t.deepEqual(loadedEffect.parameters, parameters, 'restores the separate static time settings');
  t.equal(
    loadedEffect.deckEffect.directionalLights[0].timestamp,
    parameters.timestamp,
    'initializes loaded lighting from static time'
  );
  t.deepEqual(effect.parameters, parameters, 'saving does not change the original time settings');
  t.equal(
    effect.deckEffect.directionalLights[0].timestamp,
    parameters.timestamp,
    'saving does not apply endpoints to the original light'
  );
  t.end();
});

test('#visStateSchema -> v1 -> untimed experimental effects are discarded on load', t => {
  const state = cloneDeep(StateWEffects);
  const effect = state.visState.effects.find(item => item.type === 'sepia');
  const parameters = {...effect.parameters};
  const saved = SchemaManager.getConfigToSave(state);
  const savedEffect = saved.config.visState.effects.find(item => item.id === effect.id);
  savedEffect.animation = {
    amount: [{id: 'amount-1', startValue: 0, endValue: 1, easing: 'linear'}]
  };
  const loaded = SchemaManager.parseSavedConfig(saved);
  const loadedEffect = createEffect(loaded.visState.effects.find(item => item.id === effect.id));
  t.notOk(loadedEffect.animation, 'does not infer a duration for untimed metadata');
  t.deepEqual(loadedEffect.parameters, parameters, 'keeps the static effect parameters');
  t.deepEqual(loadedEffect.deckEffect.props, parameters, 'leaves the rendered effect static');
  t.end();
});

test('#visStateSchema -> v1 -> save load effects (deprecated beta config)', t => {
  const deprecatedEffects = [
    {
      id: 'e_5',
      config: {
        type: 'magnify',
        name: 'Magnify',
        isEnabled: false,
        isConfigActive: true,
        params: {
          screenXY: [0, 0],
          radiusPixels: 200,
          zoom: 2,
          borderWidthPixels: 0,
          borderColor: [255, 255, 255, 255]
        }
      }
    }
  ];

  const expectedLoadedEffects = [
    {
      id: 'e_5',
      type: 'magnify',
      isEnabled: false,
      parameters: {
        screenXY: [0, 0],
        radiusPixels: 200,
        zoom: 2,
        borderWidthPixels: 0,
        borderColor: [255, 255, 255, 255]
      }
    }
  ];

  const initialState = cloneDeep(StateWEffects);
  const deprecatedSavedState = SchemaManager.getConfigToSave(initialState);
  deprecatedSavedState.config.visState.effects = deprecatedEffects;
  deprecatedSavedState.config.visState.effectOrder = [deprecatedEffects[0].id];

  const loadedState = SchemaManager.parseSavedConfig(deprecatedSavedState);

  t.deepEqual(
    loadedState.visState.effects,
    expectedLoadedEffects,
    'Effects should be loaded as expected'
  );

  t.end();
});

test('#visStateSchema -> auto create layers', t => {
  const state = cloneDeep(StateWFiles);
  t.equal(state.visState.layers.length, 2, 'should auto create 2 layers');
  t.end();
});

test('#visStateSchema -> color properties', t => {
  const state = cloneDeep(StateWLayerCustomColorBreaks);
  t.equal(state.visState.layers.length, 1, 'should load 1 layer');
  t.deepEqual(
    state.visState.layers[0].config.visConfig.colorRange,
    mockColorRange,
    'should load layer colorRange correctly'
  );
  t.deepEqual(
    state.visState.layers[0].config.colorScale,
    'custom',
    'should load layer color Scale correctly'
  );

  t.deepEqual(
    state.visState.layers[0].config.colorField.name,
    'uid',
    'should load colorField correctly'
  );

  t.end();
});

test('#visStateSchema -> create trip layers', t => {
  const state = cloneDeep(StateWTripTable);
  t.equal(state.visState.layers.length, 1, 'should create 1 trip layer');
  t.equal(state.visState.layers[0].type, 'trip', 'should create trip layer');
  t.end();
});

test('#visStateSchema -> create point and arc layers', t => {
  const state = cloneDeep(StateWArcNeighbors);
  t.equal(state.visState.layers.length, 3, 'should create 3 layers');
  t.equal(state.visState.layers[0].type, 'point', 'should create point layer');
  t.equal(state.visState.layers[1].type, 'arc', 'should create arc layer');
  t.equal(state.visState.layers[2].type, 'arc', 'should create arc layer');
  t.end();
});

test('#visStateSchema -> v1 -> charts are optional', t => {
  const initialState = cloneDeep(StateWFiles);
  const vsToSave = SchemaManager.getConfigToSave(initialState).config.visState;
  t.false('charts' in vsToSave, 'should omit empty charts from saved config');

  const stateWithChart = {
    ...initialState,
    visState: {
      ...initialState.visState,
      charts: [
        {
          id: 'c1',
          type: 'bigNumber',
          title: 'Count',
          dataId: testCsvDataId,
          applyFilters: true,
          display: {isConfigActive: true, isJsonEditorActive: true}
        }
      ]
    }
  };
  const savedConfig = SchemaManager.getConfigToSave(stateWithChart);
  const savedWithChart = savedConfig.config.visState;
  t.equal(savedWithChart.charts.length, 1, 'should persist charts when present');
  t.equal(savedWithChart.charts[0].id, 'c1');
  t.equal(
    savedWithChart.charts[0].display.isConfigActive,
    false,
    'should collapse chart config on save'
  );
  t.equal(
    savedWithChart.charts[0].display.isJsonEditorActive,
    false,
    'should collapse chart JSON editor on save'
  );

  const loaded = SchemaManager.parseSavedConfig(savedConfig).visState;
  t.equal(loaded.charts.length, 1, 'should load saved charts');
  t.end();
});

test('#visStateSchema -> v1 -> save load layer isIncludedInLegend', t => {
  const initialState = cloneDeep(StateWFilesFiltersLayerColor);
  const layer = initialState.visState.layers[0];
  layer.config.isIncludedInLegend = false;

  const savedState = SchemaManager.getConfigToSave(initialState);
  const savedLayers = savedState.config.visState.layers;
  const savedLayer = savedLayers.find(item => item.id === layer.id);
  t.equal(savedLayer.config.isIncludedInLegend, false, 'should persist legend exclusion');

  const untouched = savedLayers.find(item => item.id !== layer.id);
  t.equal(
    Object.prototype.hasOwnProperty.call(untouched.config, 'isIncludedInLegend'),
    false,
    'layers left at the default should omit the flag'
  );

  const loadedLayer = SchemaManager.parseSavedConfig(savedState).visState.layers.find(
    item => item.id === layer.id
  );
  t.equal(loadedLayer.config.isIncludedInLegend, false, 'should load legend exclusion');

  const dataset = initialState.visState.datasets[layer.config.dataId];
  const instance = validateLayerWithData(dataset, loadedLayer, initialState.visState.layerClasses);
  t.ok(instance, 'should rebuild the layer');
  t.equal(instance.config.isIncludedInLegend, false, 'rebuilt layer stays out of the legend');
  t.equal(instance.config.isVisible, true, 'legend exclusion does not hide the layer on the map');
  t.end();
});

test('#visStateSchema -> v1 -> layer opacity transitions preserve explicit empty and multiple tracks', t => {
  const state = cloneDeep(StateWFilesFiltersLayerColor);
  const layer = state.visState.layers[0];
  const transitions = [
    {
      id: 'appear',
      startTimeMs: 1000,
      endTimeMs: 3000,
      startValue: 0,
      endValue: 0.6,
      easing: 'linear'
    },
    {
      id: 'fade',
      startTimeMs: 5000,
      endTimeMs: 8000,
      startValue: 0.6,
      endValue: 0.2,
      easing: 'easeInOut'
    }
  ];
  layer.updateLayerConfig({propertyTransitions: {opacity: transitions}});
  t.notEqual(
    layer.config.propertyTransitions?.opacity,
    transitions,
    'copies the incoming track array'
  );
  t.notEqual(
    layer.config.propertyTransitions?.opacity[0],
    transitions[0],
    'copies individual transition objects'
  );
  const saved = SchemaManager.getConfigToSave(state);
  const savedLayer = saved.config.visState.layers.find(item => item.id === layer.id);
  t.deepEqual(
    savedLayer.config.propertyTransitions?.opacity,
    transitions,
    'saves each transition with times, values and easing'
  );
  const untouched = saved.config.visState.layers.find(item => item.id !== layer.id);
  t.notOk('propertyTransitions' in untouched.config, 'existing static maps omit the new field');
  const parsed = SchemaManager.parseSavedConfig(saved).visState.layers.find(
    item => item.id === layer.id
  );
  const dataset = state.visState.datasets[layer.config.dataId];
  const rebuilt = validateLayerWithData(dataset, parsed, state.visState.layerClasses);
  t.deepEqual(
    rebuilt.config.propertyTransitions?.opacity,
    transitions,
    'reconstructed layers retain all transitions'
  );
  t.notEqual(
    rebuilt.config.propertyTransitions?.opacity[0],
    parsed.config.propertyTransitions?.opacity[0],
    'reconstruction does not retain saved object references'
  );

  const overlapping = [transitions[0], {...transitions[1], startTimeMs: 2000}];
  savedLayer.config.propertyTransitions = {opacity: overlapping};
  const invalid = SchemaManager.parseSavedConfig(saved).visState.layers.find(
    item => item.id === layer.id
  );
  t.notOk('propertyTransitions' in invalid.config, 'invalid imported overlaps are ignored');
  layer.config.propertyTransitions = {opacity: overlapping};
  const invalidSaved = SchemaManager.getConfigToSave(state).config.visState.layers.find(
    item => item.id === layer.id
  );
  t.notOk('propertyTransitions' in invalidSaved.config, 'invalid tracks cannot be saved');

  layer.updateLayerConfig({propertyTransitions: {opacity: []}});
  const cleared = SchemaManager.getConfigToSave(state);
  const clearedLayer = SchemaManager.parseSavedConfig(cleared).visState.layers.find(
    item => item.id === layer.id
  );
  t.deepEqual(
    clearedLayer.config.propertyTransitions?.opacity,
    [],
    'an explicit empty track survives save/load'
  );
  layer.updateLayerConfig({propertyTransitions: undefined});
  t.notOk(
    'propertyTransitions' in layer.config,
    'removing the optional track restores the original config shape'
  );

  t.end();
});

test('#visStateSchema -> v1 -> numeric property tracks round trip independently', t => {
  const state = cloneDeep(StateWFilesFiltersLayerColor);
  const layer = state.visState.layers[0];
  const first = {
    id: 'first',
    startTimeMs: 1000,
    endTimeMs: 3000,
    startValue: 10,
    endValue: 50,
    easing: 'linear'
  };
  const last = {
    ...first,
    id: 'last',
    startTimeMs: 5000,
    endTimeMs: 6000,
    startValue: 50,
    endValue: 20
  };
  const propertyTransitions = {
    radius: [last, first],
    opacity: [],
    futureProperty: [{...first, startValue: -50, endValue: 200}]
  };
  layer.updateLayerConfig({propertyTransitions});
  t.notEqual(
    layer.config.propertyTransitions,
    propertyTransitions,
    'updates clone the property map'
  );
  t.notEqual(layer.config.propertyTransitions.radius[0], first, 'updates clone transition objects');
  const saved = SchemaManager.getConfigToSave(state);
  const savedLayer = saved.config.visState.layers.find(item => item.id === layer.id);
  const expected = {...propertyTransitions, radius: [first, last]};
  t.deepEqual(
    savedLayer.config.propertyTransitions,
    expected,
    'saves sorted numeric and unknown tracks with an explicit empty opacity track'
  );
  t.deepEqual(propertyTransitions.radius, [last, first], 'saving does not reorder authored input');
  t.notEqual(
    savedLayer.config.propertyTransitions.radius[0],
    layer.config.propertyTransitions.radius[0],
    'saving clones nested transitions'
  );
  const untouched = saved.config.visState.layers.find(item => item.id !== layer.id);
  t.notOk(
    'propertyTransitions' in untouched.config,
    'existing static maps omit property transitions'
  );
  const parsed = SchemaManager.parseSavedConfig(saved).visState.layers.find(
    item => item.id === layer.id
  );
  t.deepEqual(parsed.config.propertyTransitions, expected, 'load preserves all numeric tracks');
  t.notEqual(
    parsed.config.propertyTransitions.radius[0],
    savedLayer.config.propertyTransitions.radius[0],
    'loading clones nested transitions'
  );
  const rebuilt = validateLayerWithData(
    state.visState.datasets[layer.config.dataId],
    parsed,
    state.visState.layerClasses
  );
  t.deepEqual(
    rebuilt.config.propertyTransitions,
    expected,
    'reconstructed layers retain every property track'
  );
  t.notEqual(
    rebuilt.config.propertyTransitions.radius[0],
    parsed.config.propertyTransitions.radius[0],
    'reconstruction clones transitions'
  );
  for (const invalid of [
    {radius: [first, {...last, startTimeMs: 2000}]},
    {radius: [{...first, endValue: Infinity}]},
    JSON.parse('{"__proto__":[]}')
  ]) {
    savedLayer.config.propertyTransitions = invalid;
    const loaded = SchemaManager.parseSavedConfig(saved).visState.layers.find(
      item => item.id === layer.id
    );
    t.notOk(
      'propertyTransitions' in loaded.config,
      'invalid or unsafe property maps are omitted on load'
    );
    layer.config.propertyTransitions = invalid;
    const invalidSaved = SchemaManager.getConfigToSave(state).config.visState.layers.find(
      item => item.id === layer.id
    );
    t.notOk(
      'propertyTransitions' in invalidSaved.config,
      'invalid or unsafe property maps are omitted on save'
    );
  }
  layer.updateLayerConfig({propertyTransitions: {}});
  const cleared = SchemaManager.getConfigToSave(state);
  t.deepEqual(
    SchemaManager.parseSavedConfig(cleared).visState.layers.find(item => item.id === layer.id)
      .config.propertyTransitions,
    {},
    'empty property maps survive save/load'
  );
  layer.updateLayerConfig({propertyTransitions: undefined});
  t.notOk(
    'propertyTransitions' in layer.config,
    'removing optional property tracks restores the original shape'
  );
  t.end();
});

test('#visStateSchema -> v1 -> save load hideInvisibleLayers', t => {
  const initialState = cloneDeep(StateWFilesFiltersLayerColor);
  initialState.visState.interactionConfig.legend.config.hideInvisibleLayers = true;

  const savedState = SchemaManager.getConfigToSave(initialState);
  t.equal(
    savedState.config.visState.interactionConfig.legend.hideInvisibleLayers,
    true,
    'should persist hideInvisibleLayers'
  );

  const loaded = SchemaManager.parseSavedConfig(savedState).visState.interactionConfig;
  t.equal(loaded.legend.hideInvisibleLayers, true, 'should load hideInvisibleLayers');
  t.end();
});

test('#visStateSchema -> v1 -> save load zoomOpacity controllers', t => {
  const initialState = cloneDeep(StateWFilesFiltersLayerColor);
  const layerId = initialState.visState.layers[0].id;
  const controllers = [
    {
      id: 'c1',
      layerIds: [layerId],
      stops: {appear: 2, full: 4, fade: 9, gone: 14}
    }
  ];
  initialState.visState.interactionConfig.zoomOpacity.enabled = true;
  initialState.visState.interactionConfig.zoomOpacity.config.controllers = controllers;

  const savedState = SchemaManager.getConfigToSave(initialState);
  const savedZoom = savedState.config.visState.interactionConfig.zoomOpacity;
  t.deepEqual(savedZoom, {enabled: true, controllers}, 'should persist fade-on-zoom controllers');

  const loaded = SchemaManager.parseSavedConfig(savedState).visState.interactionConfig.zoomOpacity;
  t.deepEqual(loaded, {enabled: true, controllers}, 'should load fade-on-zoom controllers');
  t.end();
});

test('#visStateSchema -> v1 -> layer color tracks round trip with independent endpoint arrays', t => {
  const state = cloneDeep(StateWFilesFiltersLayerColor);
  const layer = state.visState.layers[0];
  const first = {
    id: 'color-first',
    startTimeMs: 1000,
    endTimeMs: 3000,
    startValue: [0, 20, 40],
    endValue: [100, 120, 200],
    easing: 'linear'
  };
  const last = {
    ...first,
    id: 'color-last',
    startTimeMs: 5000,
    endTimeMs: 6000,
    startValue: [100, 120, 200],
    endValue: [255, 10.5, 0],
    easing: 'easeInOut'
  };
  const numeric = {...first, id: 'radius', startValue: 5, endValue: 20};
  const propertyTransitions = {color: [last, first], strokeColor: [first], radius: [numeric]};
  const expected = {...propertyTransitions, color: [first, last]};
  const staticColor = [...layer.config.color];
  layer.updateLayerConfig({propertyTransitions});
  t.notEqual(
    layer.config.propertyTransitions.color[0].startValue,
    first.startValue,
    'updating clones color endpoints'
  );
  const saved = SchemaManager.getConfigToSave(state);
  const savedLayer = saved.config.visState.layers.find(item => item.id === layer.id);
  t.deepEqual(
    savedLayer.config.propertyTransitions,
    expected,
    'saves ordered RGB and numeric tracks concurrently'
  );
  t.deepEqual(savedLayer.config.color, staticColor, 'keeps authored static color separate');
  t.notEqual(
    savedLayer.config.propertyTransitions.color[0].startValue,
    layer.config.propertyTransitions.color[0].startValue,
    'saving clones endpoint arrays'
  );
  const parsed = SchemaManager.parseSavedConfig(saved).visState.layers.find(
    item => item.id === layer.id
  );
  t.deepEqual(
    parsed.config.propertyTransitions,
    expected,
    'loads RGB endpoints and fractional channels without changing numeric tracks'
  );
  t.notEqual(
    parsed.config.propertyTransitions.color[0].endValue,
    savedLayer.config.propertyTransitions.color[0].endValue,
    'loading clones endpoint arrays'
  );
  const rebuilt = validateLayerWithData(
    state.visState.datasets[layer.config.dataId],
    parsed,
    state.visState.layerClasses
  );
  t.deepEqual(
    rebuilt.config.propertyTransitions,
    expected,
    'reconstructed layer preserves every track'
  );
  t.notEqual(
    rebuilt.config.propertyTransitions.color[0].startValue,
    parsed.config.propertyTransitions.color[0].startValue,
    'reconstruction clones endpoint arrays'
  );
  rebuilt.config.propertyTransitions.color[0].startValue[0] = 99;
  t.equal(
    savedLayer.config.propertyTransitions.color[0].startValue[0],
    0,
    'editing reconstructed colors cannot mutate saved configs'
  );
  t.deepEqual(
    propertyTransitions.color,
    [last, first],
    'normalization does not mutate authored order or endpoints'
  );
  for (const invalid of [
    {color: [{...first, endValue: [0, 20, 256]}]},
    {color: [{...first, startValue: 0}]},
    {color: [{...first, endValue: [0, 20]}]},
    {color: [first, {...numeric, id: 'mixed', startTimeMs: 5000, endTimeMs: 6000}]}
  ]) {
    savedLayer.config.propertyTransitions = invalid;
    const loaded = SchemaManager.parseSavedConfig(saved).visState.layers.find(
      item => item.id === layer.id
    );
    t.notOk(
      'propertyTransitions' in loaded.config,
      'invalid RGB values or mixed track kinds are omitted on load'
    );
    layer.config.propertyTransitions = invalid;
    const invalidSaved = SchemaManager.getConfigToSave(state).config.visState.layers.find(
      item => item.id === layer.id
    );
    t.notOk(
      'propertyTransitions' in invalidSaved.config,
      'invalid RGB values or mixed track kinds are omitted on save'
    );
  }
  t.end();
});

test('#visStateSchema -> v1 -> multiple effect animation blocks round trip', t => {
  const state = cloneDeep(StateWEffects);
  const effect = state.visState.effects.find(item => item.type === 'sepia');
  const animation = {
    amount: [
      {
        id: 'first',
        startValue: 0.25,
        endValue: 0.75,
        easing: 'linear',
        startTimeMs: 1000,
        endTimeMs: 3000
      },
      {
        id: 'hold',
        startValue: 0.75,
        endValue: 0.75,
        easing: 'linear',
        startTimeMs: 5000,
        endTimeMs: 6000
      }
    ]
  };
  effect.setProps({animation});
  const parameters = {...effect.parameters};
  const saved = SchemaManager.getConfigToSave(state);
  const savedEffect = saved.config.visState.effects.find(item => item.id === effect.id);
  t.deepEqual(savedEffect.animation, animation, 'saves block identities, timing and held values');
  const loaded = SchemaManager.parseSavedConfig(saved);
  const restored = createEffect(loaded.visState.effects.find(item => item.id === effect.id));
  t.deepEqual(restored.animation, animation, 'restores every timed block');
  t.deepEqual(restored.parameters, parameters, 'preserves static parameters');
  t.deepEqual(restored.deckEffect.props, parameters, 'keeps block metadata out of shader uniforms');
  t.end();
});
