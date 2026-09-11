// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {test} = require('node:test');
const {transformSync} = require('@babel/core');
const {createStore} = require('zustand/vanilla');

// Exercise the adapter's state/middleware contract without loading WebGL or
// downloading DuckDB. The task runtime and Zustand store are the real modules.
function loadTypeScript(filename, dependencies = {}) {
  const {code} = transformSync(fs.readFileSync(filename, 'utf8'), {
    filename,
    babelrc: false,
    configFile: false,
    presets: [['@babel/preset-typescript', {allowDeclareFields: true}]],
    plugins: ['@babel/plugin-transform-modules-commonjs']
  });
  const module = {exports: {}};
  const load = id => {
    if (Object.hasOwn(dependencies, id)) return dependencies[id];
    return require(id);
  };
  new Function('require', 'module', 'exports', code)(load, module, module.exports);
  return module.exports;
}

const sourceDir = path.resolve(__dirname, '../src');
const tasks = loadTypeScript(path.resolve(sourceDir, '../../tasks-core/src/index.ts'));
const config = loadTypeScript(path.join(sourceDir, 'config/index.ts'));
const tableIdentity = table => `"${table.database}"."${table.schema}"."${table.table}"`;
const duckdbCore = {
  getTableIdentity: tableIdentity,
  getUnqualifiedSqlIdentifier: value => value.split('.').at(-1).replaceAll('"', '')
};
const tableSelection = loadTypeScript(path.join(sourceDir, 'keplerTableSelection.ts'), {
  '@sqlrooms/duckdb-core': duckdbCore
});
const wrapTo = (id, action) => {
  const wrap = input => ({...input, payload: {...input.payload, meta: {_id_: id}}});
  return action ? wrap(action) : wrap;
};
const actions = {
  ActionTypes: {LAYER_HOVER: 'hover', UPDATE_MAP: 'pan', MOUSE_MOVE: 'mouse'},
  wrapTo,
  registerEntry: payload => ({type: 'register', payload}),
  deleteEntry: id => ({type: 'delete', payload: {id}}),
  addDataToMap: payload => ({type: 'add-data', payload}),
  requestMapStyles: payload => ({type: 'styles', payload})
};

function emptyMap() {
  return {
    visState: {layers: [], filters: [], datasets: {}, layerToBeMerged: [], filterToBeMerged: []},
    mapState: {},
    mapStyle: {mapStyles: {}, styleType: 'positron'},
    uiState: {}
  };
}

function reducer(state = {}, action) {
  if (action.type === 'register') return {...state, [action.payload.id]: emptyMap()};
  if (action.type === 'delete') {
    const result = {...state};
    delete result[action.payload.id];
    return result;
  }
  const id = action.payload.meta._id_;
  const map = state[id];
  if (action.type === 'add-data') {
    let visState = {...map.visState};
    if (action.payload.config?.visState) {
      // Kepler keeps configurations waiting for datasets in these collections.
      visState.layerToBeMerged = action.payload.config.visState.layers ?? [];
      visState.filterToBeMerged = action.payload.config.visState.filters ?? [];
    }
    const dataset = action.payload.datasets;
    const nextState = {...state, [id]: {...map, visState}};
    if (!Array.isArray(dataset)) {
      const createDataset = tasks.fromPromise(
        () => new Promise(resolve => setTimeout(() => resolve(dataset), 15)),
        'CREATE_DATASET'
      )();
      // The real Kepler reducer combines dataset creation tasks this way.
      return tasks.withTask(
        nextState,
        tasks
          .allSettled([createDataset])
          .map(([result]) => ({type: 'dataset-ready', payload: {dataset: result.value}}))
      );
    }
    return nextState;
  }
  if (action.type === 'dataset-ready') {
    const dataset = action.payload.dataset;
    const datasets = {...map.visState.datasets, [dataset.info.id]: dataset};
    return {
      ...state,
      [id]: {
        ...map,
        visState: {
          ...map.visState,
          datasets,
          layers: map.visState.layerToBeMerged,
          filters: map.visState.filterToBeMerged,
          layerToBeMerged: [],
          filterToBeMerged: []
        }
      }
    };
  }
  return state;
}
reducer.initialState = () => reducer;

const {createKeplerSlice} = loadTypeScript(path.join(sourceDir, 'KeplerSlice.ts'), {
  '@kepler.gl/actions': actions,
  '@kepler.gl/constants': {ALL_FIELD_TYPES: {}},
  '@kepler.gl/duckdb': {
    getDuckDBColumnTypes: async () => [],
    getDuckDBColumnTypesMap: () => ({}),
    castDuckDBTypesForKepler: table => `SELECT * FROM ${table}`,
    setGeoArrowWKBExtension: () => {},
    restoreGeoarrowMetadata: () => {}
  },
  '@kepler.gl/processors': {arrowSchemaToFields: () => []},
  '@kepler.gl/reducers': {keplerGlReducer: reducer, INITIAL_UI_STATE: {mapControls: {}}},
  '@kepler.gl/schemas': {
    KeplerGLSchemaClass: class {
      parseSavedConfig(value) {
        return value.config;
      }
      getConfigToSave(map) {
        return {
          version: 'v1',
          config: {
            visState: {
              layers: [...map.visState.layers, ...map.visState.layerToBeMerged],
              filters: [...map.visState.filters, ...map.visState.filterToBeMerged]
            },
            mapState: map.mapState,
            mapStyle: map.mapStyle,
            uiState: map.uiState
          }
        };
      }
    }
  },
  '@kepler.gl/table': {KeplerTable: class {}},
  '@kepler.gl/utils': {initApplicationConfig: () => {}},
  '@kepler.gl/tasks-core': tasks,
  '@sqlrooms/room-shell': {createSlice: creator => creator},
  '@sqlrooms/ui': {getTheme: () => 'light'},
  '@sqlrooms/duckdb-core': duckdbCore,
  './config': config,
  './keplerTableSelection': tableSelection
});

const table = {table: {database: 'memory', schema: 'main', table: 'earthquakes'}};
function savedConfig() {
  return {
    maps: [
      {
        id: 'map',
        name: 'Saved map',
        config: {
          version: 'v1',
          config: {
            visState: {
              layers: [{id: 'points', config: {dataId: 'earthquakes'}}],
              filters: [{id: 'magnitude', dataId: ['earthquakes']}]
            },
            mapState: {zoom: 4},
            mapStyle: {},
            uiState: {}
          }
        }
      }
    ]
  };
}
function makeStore(initialConfig = {maps: [{id: 'map', name: 'Map'}]}) {
  tasks.drainTasksForTesting();
  const queriedTables = [];
  const store = createStore((set, get, api) => ({
    db: {
      tables: [table],
      currentDatabase: 'memory',
      currentSchema: 'main',
      getConnector: async () => ({
        query: sql => {
          queriedTables.push(sql);
          return {result: Promise.resolve({numCols: 0})};
        }
      })
    },
    ...createKeplerSlice({config: initialConfig})(set, get, api)
  }));
  return {store, queriedTables};
}

test('addTableToMap resolves after tasks-core has installed the dataset', async () => {
  const {store} = makeStore();
  await store.getState().kepler.initialize();
  await store.getState().kepler.addTableToMap('map', 'earthquakes');
  assert.ok(store.getState().kepler.map.map.visState.datasets.earthquakes);
});

test('initial saved config restores pending layers and filters from DuckDB', async () => {
  const {store, queriedTables} = makeStore(savedConfig());
  await store.getState().kepler.initialize();
  const state = store.getState().kepler;
  assert.equal(queriedTables.length, 1);
  assert.ok(state.map.map.visState.datasets.earthquakes);
  assert.equal(state.map.map.visState.layers[0].id, 'points');
  assert.equal(state.map.map.visState.filters[0].id, 'magnitude');
  assert.equal(state.isRestoringConfig, false);
  assert.deepEqual(state.config, savedConfig());
});

test('setConfig and waitForConfigRestore wait for pending dataset tasks', async () => {
  const {store} = makeStore();
  await store.getState().kepler.initialize();
  store.getState().kepler.setConfig(savedConfig());
  await store.getState().kepler.waitForConfigRestore();
  assert.ok(store.getState().kepler.map.map.visState.datasets.earthquakes);
  assert.equal(store.getState().kepler.map.map.visState.layers[0].id, 'points');
  assert.equal(store.getState().kepler.isRestoringConfig, false);
});

test('saved filter references restore a table without any map layers', async () => {
  const initialConfig = savedConfig();
  initialConfig.maps[0].config.config.visState.layers = [];
  const {store} = makeStore(initialConfig);
  await store.getState().kepler.initialize();
  assert.ok(store.getState().kepler.map.map.visState.datasets.earthquakes);
  assert.equal(store.getState().kepler.map.map.visState.filters[0].id, 'magnitude');
});

test('Redux facade dispatch runs task middleware and notifies subscribers', async () => {
  const {store} = makeStore();
  await store.getState().kepler.initialize();
  const redux = store.getState().kepler.__reduxProviderStore;
  let changes = 0;
  const unsubscribe = redux.subscribe(() => changes++);
  await redux.dispatch(
    wrapTo(
      'map',
      actions.addDataToMap({
        datasets: {info: {id: 'direct'}, data: {}}
      })
    )
  );
  assert.ok(redux.getState().map.visState.datasets.direct);
  assert.ok(changes >= 2);
  unsubscribe();
  const previousChanges = changes;
  await store.getState().kepler.addTableToMap('map', 'earthquakes');
  assert.equal(changes, previousChanges);
});

test('task middleware waits for callback task error actions', async () => {
  tasks.drainTasksForTesting();
  const task = tasks
    .fromCallback((_arg, done) => {
      setTimeout(() => done(new Error('Dataset unavailable')), 15);
    }, 'CALLBACK_DATASET')()
    .bimap(
      () => ({type: 'success'}),
      error => ({type: 'failure', message: error.message})
    );
  const received = [];
  const dispatch = tasks.taskMiddleware({dispatch: action => dispatch(action)})(action => {
    if (action.type === 'start') tasks.withTask({}, task);
    else received.push(action);
  });
  await dispatch({type: 'start'});
  assert.deepEqual(received, [{type: 'failure', message: 'Dataset unavailable'}]);
});

test('task middleware rejects when an asynchronous mapper throws', {timeout: 1000}, async () => {
  tasks.drainTasksForTesting();
  const task = tasks
    .fromPromise(async () => null, 'THROWING_MAPPER')()
    .map(() => {
      throw new Error('Invalid dataset result');
    });
  const dispatch = tasks.taskMiddleware({dispatch: action => dispatch(action)})(action => {
    if (action.type === 'start') tasks.withTask({}, task);
  });
  await assert.rejects(dispatch({type: 'start'}), /Invalid dataset result/);
});

test('parallel task simulation remains synchronous', () => {
  const create = tasks.fromPromise(async () => 'unused', 'SIMULATED_TASK');
  const combined = tasks.allSettled([create(), create()]);
  assert.deepEqual(tasks.succeedTaskInTest(combined, 'fixture'), [
    {status: 'fulfilled', value: 'fixture'},
    {status: 'fulfilled', value: 'fixture'}
  ]);
});
