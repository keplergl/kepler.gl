// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {drainTasksForTesting, succeedTaskWithValues, errorTaskInTest} from 'react-palm/tasks';

import {
  mapStyleReducer as reducer,
  INITIAL_MAP_STYLE,
  loadMapStylesUpdater,
  getInitialInputStyle
} from '@kepler.gl/reducers';
import {
  keplerGlInit,
  receiveMapConfig,
  loadMapStyles,
  mapConfigChange,
  mapStyleChange,
  inputMapStyle,
  editCustomMapStyle,
  removeCustomMapStyle
} from '@kepler.gl/actions';
import SchemaManager from '@kepler.gl/schemas';
import {DEFAULT_MAP_STYLES, DEFAULT_MAPBOX_API_URL, NO_MAP_ID} from '@kepler.gl/constants';

// helpers
import {
  StateWCustomMapStyleLegacy,
  StateWCustomMapStyleLocal,
  StateWCustomMapStyleManaged
} from 'test/helpers/mock-state';
import {MOCK_MAP_STYLE, MOCK_MAP_STYLE_LIGHT} from 'test/helpers/mock-map-styles';

const InitialMapStyle = reducer(undefined, {});

test('#mapStyleReducer', t => {
  const newState = reducer(undefined, {});

  t.deepEqual(
    newState,
    {
      ...INITIAL_MAP_STYLE,
      initialState: {}
    },
    'should return the initial map style'
  );

  t.end();
});

test('#mapStyleReducer -> INIT', t => {
  const initialState = reducer(InitialMapStyle, keplerGlInit());
  t.deepEqual(
    initialState,
    {
      ...INITIAL_MAP_STYLE,
      initialState: {}
    },
    'initialize map style with no argument'
  );

  const newState = reducer(
    InitialMapStyle,
    keplerGlInit({
      mapboxApiAccessToken: 'smoothies_secret_token',
      mapboxApiUrl: 'http://mydomain.com'
    })
  );

  t.deepEqual(
    newState,
    {
      ...INITIAL_MAP_STYLE,
      initialState: {},
      mapboxApiAccessToken: 'smoothies_secret_token',
      mapboxApiUrl: 'http://mydomain.com'
    },
    'initialize map style with mapboxApiAccessToken'
  );
  t.end();
});

test('#mapStyleReducer -> INIT & LOAD_MAP_STYLES', t => {
  const newState = reducer(
    InitialMapStyle,
    keplerGlInit({
      mapboxApiAccessToken: 'smoothies_secret_token'
    })
  );

  t.deepEqual(
    newState,
    {
      ...INITIAL_MAP_STYLE,
      initialState: {},
      mapboxApiAccessToken: 'smoothies_secret_token',
      mapboxApiUrl: DEFAULT_MAPBOX_API_URL
    },
    'initialize map style with mapboxApiAccessToken and mapStylesReplaceDefault; mapStyles empty'
  );

  const finalState = loadMapStylesUpdater(newState, {
    payload: {newStyles: INITIAL_MAP_STYLE.mapStyles}
  });

  // should start loading default dark style
  t.deepEqual(
    finalState,
    {
      ...newState,
      isLoading: {
        'dark-matter': true
      }
    },
    'user provided mapStyles are populated, defaults ignored'
  );

  const tasks = drainTasksForTesting();
  t.equal(tasks.length, 1, 'should dispatch request map style task');

  const expectedTask = {
    payload: [
      {
        id: 'dark-matter',
        url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
      }
    ]
  };

  t.deepEqual(tasks[0].payload, expectedTask.payload, 'should have correct load map style task');
  t.end();
});

test('#mapStyleReducer -> INIT & LOAD_MAP_STYLES ->  mapStylesReplaceDefault: true', t => {
  const myMapStyle = {
    id: 'default dark v9',
    label: 'default dark v9',
    url: 'mapbox://styles/mapbox/dark-v9',
    icon: `images/light.png`,
    layerGroups: []
  };
  const newState = reducer(
    InitialMapStyle,
    keplerGlInit({
      mapboxApiAccessToken: 'smoothies_secret_token',
      mapStylesReplaceDefault: true
    })
  );

  t.deepEqual(
    newState,
    {
      ...INITIAL_MAP_STYLE,
      mapStyles: {},
      initialState: {},
      mapboxApiAccessToken: 'smoothies_secret_token',
      mapboxApiUrl: DEFAULT_MAPBOX_API_URL,
      mapStylesReplaceDefault: true
    },
    'initialize map style with mapboxApiAccessToken and mapStylesReplaceDefault; mapStyles empty'
  );

  const mapStyles = {
    [myMapStyle.id]: myMapStyle
  };

  const finalState = loadMapStylesUpdater(newState, {payload: {newStyles: mapStyles}});

  t.deepEqual(
    finalState,
    {...newState, mapStyles},
    'user provided mapStyles are populated, defaults ignored'
  );

  const tasks = drainTasksForTesting();
  t.equal(tasks.length, 0, 'should not dispatch request map style task');

  t.end();
});

test("#mapStyleReducer -> RECEIVE_MAP_CONFIG (custom: 'LOCAL')", t => {
  drainTasksForTesting();
  const stateWithToken = reducer(
    InitialMapStyle,
    keplerGlInit({mapboxApiAccessToken: 'smoothies_secret_token'})
  );

  const stateToSave = StateWCustomMapStyleLocal;

  // save state
  const savedState = SchemaManager.getConfigToSave(stateToSave);

  // load state
  const stateLoaded = SchemaManager.parseSavedConfig(savedState);

  const tmpStateWithConfig = reducer(stateWithToken, receiveMapConfig(stateLoaded));

  const defaultMapStyles = DEFAULT_MAP_STYLES.reduce(
    (accu, st) => ({
      ...accu,
      [st.id]: st
    }),
    {}
  );

  const expectedStateWithConfig = {
    styleType: 'smoothie_the_cat',
    visibleLayerGroups: {label: true, road: true},
    topLayerGroups: {},
    mapStyles: {
      smoothie_the_cat: {
        accessToken: 'secret_token',
        custom: 'LOCAL',
        icon: 'https://api.mapbox.com/styles/v1/shanhe/smoothie.the.cat/static/-122.3391,37.7922,9,0,0/400x300?access_token=secret_token&logo=false&attribution=false',
        id: 'smoothie_the_cat',
        label: 'Smoothie the Cat',
        url: 'mapbox://styles/shanhe/smoothie.the.cat'
      },
      ...defaultMapStyles
    },
    isLoading: {
      smoothie_the_cat: true
    },
    mapboxApiAccessToken: 'smoothies_secret_token',
    mapboxApiUrl: DEFAULT_MAPBOX_API_URL,
    mapStylesReplaceDefault: false,
    inputStyle: getInitialInputStyle(),
    threeDBuildingColor: [1, 2, 3],
    custom3DBuildingColor: true,
    backgroundColor: [0, 0, 0],
    initialState: {},
    bottomMapStyle: undefined,
    topMapStyle: undefined
  };

  t.deepEqual(tmpStateWithConfig, expectedStateWithConfig, 'should load saved map style config');
  Object.keys(tmpStateWithConfig).forEach(key => {
    t.deepEqual(
      tmpStateWithConfig[key],
      expectedStateWithConfig[key],
      'should load saved map style config'
    );
  });
  const [actionTask1, ...more1] = drainTasksForTesting();
  t.equal(more1.length, 0, 'should return 1 tasks');

  const expectedTask = {
    payload: [
      {
        id: 'smoothie_the_cat',
        url: 'https://api.mapbox.com/styles/v1/shanhe/smoothie.the.cat?pluginName=Keplergl&access_token=secret_token'
      }
    ]
  };

  t.deepEqual(actionTask1.payload, expectedTask.payload, 'should create task to load map styles');

  const resultState1 = reducer(
    tmpStateWithConfig,
    succeedTaskWithValues(actionTask1, [
      {id: 'smoothie_the_cat', style: {layers: [], name: 'smoothie_the_cat'}}
    ])
  );

  const expectedMapStyles = {
    smoothie_the_cat: {
      accessToken: 'secret_token',
      custom: 'LOCAL',
      icon: 'https://api.mapbox.com/styles/v1/shanhe/smoothie.the.cat/static/-122.3391,37.7922,9,0,0/400x300?access_token=secret_token&logo=false&attribution=false',
      id: 'smoothie_the_cat',
      label: 'Smoothie the Cat',
      url: 'mapbox://styles/shanhe/smoothie.the.cat',
      style: {layers: [], name: 'smoothie_the_cat'},
      layerGroups: []
    },
    ...defaultMapStyles
  };

  const expectedMapStyleState = {
    styleType: 'smoothie_the_cat',
    visibleLayerGroups: {},
    topLayerGroups: {},
    mapStyles: expectedMapStyles,
    mapboxApiAccessToken: 'smoothies_secret_token',
    mapboxApiUrl: DEFAULT_MAPBOX_API_URL,
    mapStylesReplaceDefault: false,
    inputStyle: getInitialInputStyle(),
    threeDBuildingColor: [1, 2, 3],
    custom3DBuildingColor: true,
    backgroundColor: [0, 0, 0],
    initialState: {},
    bottomMapStyle: {layers: [], name: 'smoothie_the_cat'},
    topMapStyle: null,
    editable: 0,
    isLoading: {
      smoothie_the_cat: false
    }
  };

  t.deepEqual(
    Object.keys(resultState1).sort(),
    Object.keys(expectedMapStyleState).sort(),
    'mapStyle state should have same keys'
  );

  Object.keys(resultState1).forEach(key => {
    t.deepEqual(
      resultState1[key],
      expectedMapStyleState[key],
      `should update state,${key} with loaded map styles`
    );
  });

  const savedConfig = SchemaManager.getConfigToSave({mapStyle: resultState1});
  const expectedSaved = {
    version: 'v1',
    config: {
      mapStyle: {
        styleType: 'smoothie_the_cat',
        topLayerGroups: {},
        visibleLayerGroups: {},
        threeDBuildingColor: [1, 2, 3],
        backgroundColor: [0, 0, 0],
        mapStyles: {
          smoothie_the_cat: {
            accessToken: 'secret_token',
            custom: 'LOCAL',
            icon: 'https://api.mapbox.com/styles/v1/shanhe/smoothie.the.cat/static/-122.3391,37.7922,9,0,0/400x300?access_token=secret_token&logo=false&attribution=false',
            id: 'smoothie_the_cat',
            label: 'Smoothie the Cat',
            url: 'mapbox://styles/shanhe/smoothie.the.cat'
          }
        }
      }
    }
  };

  t.deepEqual(
    Object.keys(savedConfig).sort(),
    Object.keys(expectedSaved).sort(),
    'mapStyle state saved should have same keys'
  );

  Object.keys(savedConfig).forEach(key => {
    t.deepEqual(savedConfig[key], expectedSaved[key], `should save state.${key} with correctly`);
  });

  t.end();
});

test("#mapStyleReducer -> RECEIVE_MAP_CONFIG (custom: 'MANAGED')", t => {
  drainTasksForTesting();
  const stateWithToken = reducer(
    InitialMapStyle,
    keplerGlInit({mapboxApiAccessToken: 'smoothies_secret_token'})
  );

  const stateToSave = StateWCustomMapStyleManaged;

  // save state
  const savedState = SchemaManager.getConfigToSave(stateToSave);

  // load state
  const stateLoaded = SchemaManager.parseSavedConfig(savedState);

  const tmpStateWithConfig = reducer(stateWithToken, receiveMapConfig(stateLoaded));

  const defaultMapStyles = DEFAULT_MAP_STYLES.reduce(
    (accu, st) => ({
      ...accu,
      [st.id]: st
    }),
    {}
  );

  const expectedStateWithConfig = {
    styleType: 'smoothie_the_cat',
    visibleLayerGroups: {label: true, road: true},
    topLayerGroups: {},
    mapStyles: {
      smoothie_the_cat: {
        accessToken: 'secret_token',
        custom: 'MANAGED',
        icon: 'https://api.mapbox.com/styles/v1/shanhe/smoothie.the.cat/static/-122.3391,37.7922,9,0,0/400x300?access_token=secret_token&logo=false&attribution=false',
        id: 'smoothie_the_cat',
        label: 'Smoothie the Cat',
        url: 'mapbox://styles/shanhe/smoothie.the.cat'
      },
      ...defaultMapStyles
    },
    isLoading: {
      smoothie_the_cat: true
    },
    mapboxApiAccessToken: 'smoothies_secret_token',
    mapboxApiUrl: DEFAULT_MAPBOX_API_URL,
    mapStylesReplaceDefault: false,
    inputStyle: getInitialInputStyle(),
    threeDBuildingColor: [1, 2, 3],
    custom3DBuildingColor: true,
    backgroundColor: [0, 0, 0],
    initialState: {},
    bottomMapStyle: undefined,
    topMapStyle: undefined
  };

  t.deepEqual(tmpStateWithConfig, expectedStateWithConfig, 'should load saved map style config');
  Object.keys(tmpStateWithConfig).forEach(key => {
    t.deepEqual(
      tmpStateWithConfig[key],
      expectedStateWithConfig[key],
      'should load saved map style config'
    );
  });

  const savedConfig = SchemaManager.getConfigToSave({mapStyle: stateToSave.mapStyle});
  const expectedSaved = {
    version: 'v1',
    config: {
      mapStyle: {
        styleType: 'smoothie_the_cat',
        topLayerGroups: {},
        visibleLayerGroups: {label: true, road: true},
        threeDBuildingColor: [1, 2, 3],
        backgroundColor: [0, 0, 0],
        mapStyles: {
          smoothie_the_cat: {
            accessToken: 'secret_token',
            custom: 'MANAGED',
            icon: 'https://api.mapbox.com/styles/v1/shanhe/smoothie.the.cat/static/-122.3391,37.7922,9,0,0/400x300?access_token=secret_token&logo=false&attribution=false',
            id: 'smoothie_the_cat',
            label: 'Smoothie the Cat',
            url: 'mapbox://styles/shanhe/smoothie.the.cat'
          }
        }
      }
    }
  };

  t.deepEqual(
    savedConfig.mapStyles,
    expectedSaved.mapStyles,
    'mapStyle state saved should have same keys in mapStyle.mapStyles'
  );

  Object.keys(savedConfig).forEach(key => {
    t.deepEqual(savedConfig[key], expectedSaved[key], `should save state.${key} with correctly`);
  });

  t.end();
});

test('#mapStyleReducer -> RECEIVE_MAP_CONFIG (custom: true (legacy backwards support))', t => {
  drainTasksForTesting();
  const stateWithToken = reducer(
    InitialMapStyle,
    keplerGlInit({mapboxApiAccessToken: 'smoothies_secret_token'})
  );

  const stateToSave = StateWCustomMapStyleLegacy;

  // save state
  const savedState = SchemaManager.getConfigToSave(stateToSave);

  // load state
  const stateLoaded = SchemaManager.parseSavedConfig(savedState);

  const stateWithConfig = reducer(stateWithToken, receiveMapConfig(stateLoaded));

  const defaultMapStyles = DEFAULT_MAP_STYLES.reduce(
    (accu, st) => ({
      ...accu,
      [st.id]: st
    }),
    {}
  );

  const expectedStateWithConfig = {
    styleType: 'smoothie_the_cat',
    visibleLayerGroups: {label: true, road: true},
    topLayerGroups: {},
    mapStyles: {
      smoothie_the_cat: {
        accessToken: 'secret_token',
        custom: true,
        icon: 'https://api.mapbox.com/styles/v1/shanhe/smoothie.the.cat/static/-122.3391,37.7922,9,0,0/400x300?access_token=secret_token&logo=false&attribution=false',
        id: 'smoothie_the_cat',
        label: 'Smoothie the Cat',
        url: 'mapbox://styles/shanhe/smoothie.the.cat'
      },
      ...defaultMapStyles
    },
    isLoading: {
      smoothie_the_cat: true
    },
    mapboxApiAccessToken: 'smoothies_secret_token',
    mapboxApiUrl: DEFAULT_MAPBOX_API_URL,
    mapStylesReplaceDefault: false,
    inputStyle: getInitialInputStyle(),
    threeDBuildingColor: [1, 2, 3],
    custom3DBuildingColor: true,
    backgroundColor: [0, 0, 0],
    bottomMapStyle: undefined,
    topMapStyle: undefined,
    initialState: {}
  };

  t.deepEqual(stateWithConfig, expectedStateWithConfig, 'should load saved map style config');

  Object.keys(stateWithConfig).forEach(key => {
    t.deepEqual(
      stateWithConfig[key],
      expectedStateWithConfig[key],
      'should load saved map style config'
    );
  });
  const [task1, ...more1] = drainTasksForTesting();
  t.equal(more1.length, 0, 'should return 1 tasks');

  const expectedTask = {
    payload: [
      {
        id: 'smoothie_the_cat',
        url: 'https://api.mapbox.com/styles/v1/shanhe/smoothie.the.cat?pluginName=Keplergl&access_token=secret_token'
      }
    ]
  };

  t.deepEqual(task1.payload, expectedTask.payload, 'should create task to load map styles');

  const resultState1 = reducer(
    stateWithConfig,
    succeedTaskWithValues(task1, [
      {id: 'smoothie_the_cat', style: {layers: [], name: 'smoothie_the_cat'}}
    ])
  );

  const expectedMapStyles = {
    smoothie_the_cat: {
      accessToken: 'secret_token',
      custom: true,
      icon: 'https://api.mapbox.com/styles/v1/shanhe/smoothie.the.cat/static/-122.3391,37.7922,9,0,0/400x300?access_token=secret_token&logo=false&attribution=false',
      id: 'smoothie_the_cat',
      label: 'Smoothie the Cat',
      url: 'mapbox://styles/shanhe/smoothie.the.cat',
      style: {layers: [], name: 'smoothie_the_cat'},
      layerGroups: []
    },
    ...defaultMapStyles
  };

  const expectedMapStyleState = {
    styleType: 'smoothie_the_cat',
    visibleLayerGroups: {},
    topLayerGroups: {},
    mapStyles: expectedMapStyles,
    mapboxApiAccessToken: 'smoothies_secret_token',
    mapboxApiUrl: DEFAULT_MAPBOX_API_URL,
    mapStylesReplaceDefault: false,
    inputStyle: getInitialInputStyle(),
    threeDBuildingColor: [1, 2, 3],
    custom3DBuildingColor: true,
    backgroundColor: [0, 0, 0],
    initialState: {},
    bottomMapStyle: {layers: [], name: 'smoothie_the_cat'},
    topMapStyle: null,
    editable: 0,
    isLoading: {
      smoothie_the_cat: false
    }
  };

  t.deepEqual(
    Object.keys(resultState1).sort(),
    Object.keys(expectedMapStyleState).sort(),
    'mapStyle state should have same keys'
  );

  Object.keys(resultState1).forEach(key => {
    t.deepEqual(
      resultState1[key],
      expectedMapStyleState[key],
      `should update state,${key} with loaded map styles`
    );
  });

  const savedConfig = SchemaManager.getConfigToSave({mapStyle: resultState1});
  const expectedSaved = {
    version: 'v1',
    config: {
      mapStyle: {
        styleType: 'smoothie_the_cat',
        topLayerGroups: {},
        visibleLayerGroups: {},
        threeDBuildingColor: [1, 2, 3],
        backgroundColor: [0, 0, 0],
        mapStyles: {
          smoothie_the_cat: {
            accessToken: 'secret_token',
            custom: true,
            icon: 'https://api.mapbox.com/styles/v1/shanhe/smoothie.the.cat/static/-122.3391,37.7922,9,0,0/400x300?access_token=secret_token&logo=false&attribution=false',
            id: 'smoothie_the_cat',
            label: 'Smoothie the Cat',
            url: 'mapbox://styles/shanhe/smoothie.the.cat'
          }
        }
      }
    }
  };

  t.deepEqual(
    Object.keys(savedConfig).sort(),
    Object.keys(expectedSaved).sort(),
    'mapStyle state saved should have same keys'
  );

  Object.keys(savedConfig).forEach(key => {
    t.deepEqual(savedConfig[key], expectedSaved[key], `should save state.${key} with correctly`);
  });

  t.end();
});

// eslint-disable-next-line max-statements
test('#mapStyleReducer -> MAP_STYLE_CHANGE', t => {
  const initialState = reducer(
    InitialMapStyle,
    keplerGlInit({
      mapboxApiAccessToken: 'smoothies_secret_token'
    })
  );

  // loadMapStyles
  const nextState = reducer(initialState, loadMapStyles({'dark-matter': MOCK_MAP_STYLE}));
  t.deepEqual(nextState.mapStyles['dark-matter'], MOCK_MAP_STYLE, 'should load map style');
  t.deepEqual(nextState.bottomMapStyle, MOCK_MAP_STYLE.style, 'bottomMapStyle should be set');
  t.equal(nextState.topMapStyle, null, 'topMapStyle should be set');
  t.equal(nextState.editable, 7, 'editable should be set');
  t.deepEqual(
    nextState.visibleLayerGroups,
    {
      label: true,
      road: true,
      border: false,
      building: true,
      water: true,
      land: true,
      '3d building': false
    },
    'should set visibleLayerGroups'
  );

  // move label to be on top
  const nextState1 = reducer(
    nextState,
    mapConfigChange({topLayerGroups: {label: true, road: true}})
  );
  const expectedTopStyle = {
    ...MOCK_MAP_STYLE.style,
    layers: [
      {
        id: 'road_path',
        type: 'line',
        source: 'carto',
        'source-layer': 'transportation'
      },
      {
        id: 'roadname_minor',
        minzoom: 13,
        source: 'carto',
        type: 'symbol',
        'source-layer': 'transportation_name'
      },
      {
        type: 'symbol',
        source: 'composite',
        id: 'country-label-sm',
        'source-layer': 'country_label'
      }
    ]
  };
  t.deepEqual(nextState1.topMapStyle, expectedTopStyle, 'topMapStyle should be set correctly');

  // hide road layer
  const nextState2 = reducer(
    nextState1,
    mapConfigChange({visibleLayerGroups: {...nextState1.visibleLayerGroups, road: false}})
  );

  const expectedTopStyle2 = {
    ...MOCK_MAP_STYLE.style,
    layers: [
      {
        type: 'symbol',
        source: 'composite',
        id: 'country-label-sm',
        'source-layer': 'country_label'
      }
    ]
  };

  t.deepEqual(nextState2.topMapStyle, expectedTopStyle2, 'topMapStyle should be set correctly');

  // set style type to light
  const nextState3 = reducer(nextState2, mapStyleChange('positron'));
  const tasks = drainTasksForTesting();
  t.equal(tasks.length, 1, 'should dispatch 1 request map style task');

  const expectedNextState3 = {
    ...nextState2,
    styleType: 'positron',
    isLoading: {
      positron: true
    }
  };
  const expectedTaskPayload = [
    {
      id: 'positron',
      url: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
    }
  ];
  t.deepEqual(nextState3, expectedNextState3, 'state should be correct');
  t.deepEqual(tasks[0].payload, expectedTaskPayload, 'should dispatch load light map style task');

  // successfully load light map style
  const succeedState = reducer(
    nextState3,
    succeedTaskWithValues(tasks[0], [{id: 'positron', style: MOCK_MAP_STYLE_LIGHT.style}])
  );

  const expectedMapStyles = {
    ...nextState3.mapStyles,
    positron: {
      ...nextState3.mapStyles.positron,
      style: MOCK_MAP_STYLE_LIGHT.style
    }
  };

  t.deepEqual(succeedState.mapStyles, expectedMapStyles, 'should save map styles');

  const expectedTopStyle3 = {
    ...MOCK_MAP_STYLE_LIGHT.style,
    layers: [
      {
        type: 'symbol',
        source: 'composite',
        id: 'admin-label-lg',
        'source-layer': 'country_label'
      }
    ]
  };

  t.deepEqual(succeedState.topMapStyle, expectedTopStyle3, 'topMapStyle should be set correctly');
  t.deepEqual(succeedState.isLoading, {positron: false}, 'should set isLoading correctly');
  t.deepEqual(
    succeedState.threeDBuildingColor,
    [237.4432283491836, 0, 0],
    'should set threeDBuildingColor correctly'
  );

  // error load light map style
  const erroredState = reducer(nextState3, errorTaskInTest(tasks[0], new Error('hello')));
  t.deepEqual(erroredState.isLoading, {positron: false}, 'should set isLoading correctly');

  t.end();
});

test('#mapStyleReducer -> MAP_STYLE_CHANGE -> dark basemap to no basemap', t => {
  const initialState = reducer(
    InitialMapStyle,
    keplerGlInit({
      mapboxApiAccessToken: 'smoothies_secret_token'
    })
  );

  // loadMapStyles
  const nextState = reducer(initialState, loadMapStyles({dark: MOCK_MAP_STYLE}));

  t.deepEqual(
    initialState.backgroundColor,
    nextState.backgroundColor,
    'backgroundColor should remain the same when NOT switching to the no basemap option'
  );

  // set style type to no basemap
  const nextState2 = reducer(nextState, mapStyleChange(NO_MAP_ID));

  const expectedNextState2 = {
    ...nextState2,
    styleType: NO_MAP_ID
  };

  t.deepEqual(
    nextState2,
    expectedNextState2,
    'state should be correct when switching to no basemap option'
  );

  t.end();
});

test('#mapStyleReducer -> EDIT_CUSTOM_MAP_STYLE', t => {
  drainTasksForTesting();
  const stateWithToken = reducer(
    InitialMapStyle,
    keplerGlInit({
      mapboxApiAccessToken: 'smoothies_secret_token'
    })
  );

  // state with custom style
  let nextState = reducer(stateWithToken, receiveMapConfig(StateWCustomMapStyleLocal));

  const styleIdToEdit = 'smoothie_the_cat';
  const {label: originalLabel, url, accessToken, icon, custom} = nextState.mapStyles[styleIdToEdit];
  const inputMapStyleToEdit = {
    id: styleIdToEdit,
    label: 'Smoothie the Super Cool Cat',
    url,
    accessToken,
    icon,
    custom
  };

  // set input custom map style and provide an edited label property
  nextState = reducer(nextState, inputMapStyle(inputMapStyleToEdit));

  t.deepEqual(
    nextState.inputStyle,
    {...inputMapStyleToEdit, error: false, isValid: false, style: null, uploadedFile: null},
    'should set the inputStyle'
  );

  // edit custom map style
  nextState = reducer(nextState, editCustomMapStyle());

  t.notEqual(
    nextState.mapStyles[styleIdToEdit].label,
    originalLabel,
    'should commit edit to the label property for custom style with id "smoothie_the_cat"'
  );

  t.equal(
    nextState.mapStyles[styleIdToEdit].id,
    styleIdToEdit,
    'should not make any changes to the id property of the custom style after committing label property edits'
  );

  t.deepEqual(
    nextState.inputStyle,
    getInitialInputStyle(),
    'should reset the inputStyle after committing edits'
  );

  t.end();
});

test('#mapStyleReducer -> REMOVE_CUSTOM_MAP_STYLE -> removal of currently selected custom style', t => {
  drainTasksForTesting();
  const stateWithToken = reducer(
    InitialMapStyle,
    keplerGlInit({
      mapboxApiAccessToken: 'smoothies_secret_token'
    })
  );

  // state with custom style which is also the active styleType
  let nextState = reducer(stateWithToken, receiveMapConfig(StateWCustomMapStyleLocal));

  t.equal(
    nextState.styleType,
    'smoothie_the_cat',
    'active styleType is currently the custom style'
  );

  // remove custom map style
  nextState = reducer(
    nextState,
    removeCustomMapStyle({
      id: 'smoothie_the_cat'
    })
  );

  t.equal(
    nextState.mapStyles.smoothie_the_cat,
    undefined,
    'should remove custom style with id "smoothie_the_cat"'
  );

  t.equal(
    nextState.styleType,
    'dark-matter',
    'should change active styleType to default "dark-matter" when removing a custom style that was the active styleType'
  );

  t.end();
});

test('#mapStyleReducer -> REMOVE_CUSTOM_MAP_STYLE -> removal of not currently selected custom style', t => {
  drainTasksForTesting();
  const stateWithToken = reducer(
    InitialMapStyle,
    keplerGlInit({
      mapboxApiAccessToken: 'smoothies_secret_token'
    })
  );

  // state with custom style
  let nextState = reducer(stateWithToken, receiveMapConfig(StateWCustomMapStyleLocal));

  // set style type to no basemap
  nextState = reducer(nextState, mapStyleChange(NO_MAP_ID));

  t.equal(nextState.styleType, NO_MAP_ID, 'active styleType is currently the no basemap style');

  // remove custom map style
  nextState = reducer(
    nextState,
    removeCustomMapStyle({
      id: 'smoothie_the_cat'
    })
  );

  t.equal(
    nextState.mapStyles.smoothie_the_cat,
    undefined,
    'should remove custom style with id "smoothie_the_cat"'
  );

  t.equal(
    nextState.styleType,
    NO_MAP_ID,
    'should not change the active styleType when removing a custom style that was not the active styleType'
  );

  t.end();
});
