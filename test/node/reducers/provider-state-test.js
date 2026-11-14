// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {drainTasksForTesting, succeedTaskInTest, errorTaskInTest} from '@kepler.gl/tasks';
import sinon from 'sinon';
import {default as Console} from 'global/console';

import {
  ActionTypes,
  exportFileToCloud,
  exportFileSuccess,
  exportFileError,
  loadCloudMap,
  loadCloudMapError,
  loadCloudMapSuccess,
  postSaveLoadSuccess,
  resetProviderStatus
} from '@kepler.gl/actions';
import {
  providerReducer as reducer,
  providerStateReducerFactory,
  INITIAL_PROVIDER_STATE
} from '@kepler.gl/reducers';
import MockProvider from 'test/helpers/mock-provider';
import {getApplicationConfig, initApplicationConfig} from '@kepler.gl/utils';
import {FILE_CONFLICT_MSG} from '@kepler.gl/cloud-providers';
import {OVERWRITE_MAP_ID} from '@kepler.gl/constants';

const runProviderTask = task =>
  new Promise((resolve, reject) => {
    task.run((effect, success, error) => effect(success, error), resolve, reject);
  });

test('#providerStateReducer', t => {
  t.deepEqual(
    reducer(undefined, {}),
    {...INITIAL_PROVIDER_STATE, initialState: {}},
    'should return the initial provider state'
  );
  t.end();
});

test('#providerStateReducerFactory', t => {
  const providerStateReducer = providerStateReducerFactory({
    currentProvider: 'taro'
  });

  t.deepEqual(
    providerStateReducer(undefined, {}),
    {
      ...INITIAL_PROVIDER_STATE,
      currentProvider: 'taro',
      initialState: {currentProvider: 'taro'}
    },
    'should return the initial state'
  );
  t.end();
});

test('#providerStateReducer -> EXPORT_FILE_TO_CLOUD', t => {
  const errSpy = sinon.spy(Console, 'error');
  drainTasksForTesting();
  // null
  reducer(undefined, exportFileToCloud({provider: null}));
  t.ok(errSpy.calledOnce, 'should call console.error if provider is undefined');
  t.equal(
    errSpy.getCall(0).args[0],
    'provider is not defined',
    'should warn when cannot find kepler.gl state'
  );
  reducer(undefined, exportFileToCloud({provider: {name: 'taro', hello: true}}));

  // uploadFile
  t.ok(errSpy.calledTwice, 'should call console.error if provider does not have uploadFile');
  t.equal(
    errSpy.getCall(1).args[0],
    'uploadMap is not a function of Cloud provider: taro',
    'should warn when cannot find uploadMap function'
  );

  // mapData
  const mockProvider = new MockProvider();
  const nextState = reducer(
    undefined,
    exportFileToCloud({
      mapData: {data: []},
      provider: mockProvider,
      options: {
        isPublic: false
      }
    })
  );

  const [task1, ...more] = drainTasksForTesting();

  t.ok(more.length === 0, 'should create 1 task');
  t.comment(JSON.stringify(nextState));
  t.deepEqual(
    nextState,
    {
      isProviderLoading: true,
      isCloudMapLoading: false,
      providerError: null,
      currentProvider: 'taro',
      successInfo: {},
      initialState: {},
      mapSaved: null,
      savedMapId: null,
      visualizations: []
    },
    'Should set isProviderLoading and current provider'
  );

  t.equal(task1.type, 'EXPORT_FILE_TO_CLOUD_TASK', 'should create export file tasks');
  t.deepEqual(
    task1.payload,
    {
      provider: mockProvider,
      payload: {
        mapData: {data: []},
        options: {
          isPublic: false
        }
      }
    },
    'should call upload file with correct payload'
  );

  // success
  const resultState1 = reducer(nextState, succeedTaskInTest(task1, {url: 'taro_and_blue'}));

  t.deepEqual(
    resultState1,
    {
      isProviderLoading: false,
      isCloudMapLoading: false,
      providerError: null,
      currentProvider: 'taro',
      initialState: {},
      mapSaved: 'taro',
      savedMapId: null,
      successInfo: {url: 'taro_and_blue'},
      visualizations: []
    },
    'Should set isProviderLoading to false and successInfo, mapSaved to taro'
  );
  const task2 = drainTasksForTesting();
  t.ok(task2.length === 0, 'should create 0 task');

  // error
  const resultState2 = reducer(nextState, errorTaskInTest(task1, new Error('hello')));
  t.deepEqual(
    resultState2,
    {
      isProviderLoading: false,
      isCloudMapLoading: false,
      providerError: 'hello',
      currentProvider: 'taro',
      initialState: {},
      mapSaved: null,
      savedMapId: null,
      successInfo: {},
      visualizations: []
    },
    'Should set isLoading to false and error'
  );

  errSpy.restore();
  t.end();
});

// eslint-disable-next-line max-statements
test('#providerStateReducer -> EXPORT_FILE_TO_CLOUD -> onSuccess : onError', t => {
  const mockResponse = {url: 'taro_and_blue'};
  const mockProvider = new MockProvider();
  const mockError = new Error('ooops');

  const testUpdaters = {
    [ActionTypes.TOGGLE_MODAL]: (state, action) => ({
      ...state,
      modalId: action.payload
    }),
    [ActionTypes.ADD_NOTIFICATION]: (state, action) => ({
      ...state,
      notification: action.payload
    }),
    [ActionTypes.REMOVE_NOTIFICATION]: state => ({
      ...state,
      remove: true
    })
  };

  const composedReducer = (state, action) => {
    if (testUpdaters[action.type]) {
      return testUpdaters[action.type](state, action);
    }
    return reducer(state, action);
  };

  const onSuccess = args => {
    t.deepEqual(
      args,
      {
        response: mockResponse,
        provider: mockProvider,
        options: {isPublic: false}
      },
      'should call onSuccess with arguments'
    );
    return {};
  };
  const onError = args => {
    t.deepEqual(args, mockError, 'should call onError with arguments');
    return {};
  };

  // mapData
  const state = reducer(
    undefined,
    exportFileToCloud({
      mapData: {data: []},
      provider: mockProvider,
      onSuccess,
      onError,
      closeModal: true,
      options: {
        isPublic: false
      }
    })
  );
  const [task1, ...more] = drainTasksForTesting();
  t.ok(more.length === 0, 'should create 1 task');
  t.equal(task1.type, 'EXPORT_FILE_TO_CLOUD_TASK', 'should create export file tasks');

  // success
  const nextState = reducer(state, succeedTaskInTest(task1, mockResponse));
  const [task2, task3, ...more2] = drainTasksForTesting();
  t.ok(more2.length === 0, 'should create 1 task');
  t.ok(task2.type === 'ACTION_TASK', 'should create 2 ACTION_TASK');
  t.ok(task3.type === 'ACTION_TASK', 'should create 2 ACTION_TASK');

  t.deepEqual(
    nextState,
    {
      isProviderLoading: false,
      isCloudMapLoading: false,
      providerError: null,
      currentProvider: 'taro',
      mapSaved: 'taro',
      savedMapId: null,
      initialState: {},
      successInfo: {url: 'taro_and_blue'},
      visualizations: []
    },
    'Should set isProviderLoading to false and successInfo'
  );

  const resultState1 = reducer(nextState, succeedTaskInTest(task2, undefined));
  const resultState2 = reducer(resultState1, succeedTaskInTest(task3, undefined));

  // saveToCloudSuccess
  const [task4, task5, task6, task7, ...more3] = drainTasksForTesting();
  t.ok(more3.length === 0, 'should create 4 tasks');

  t.ok(task4.type === 'ACTION_TASK', 'should create 3 ACTION_TASKS');
  t.ok(task5.type === 'ACTION_TASK', 'should create 3 ACTION_TASKS');
  t.ok(task6.type === 'ACTION_TASK', 'should create 3 ACTION_TASKS');
  t.ok(task7.type === 'DELAY_TASK', 'should create 1 DELAY_TASK');

  // toggleModal(null),
  const resultState3 = composedReducer(resultState2, succeedTaskInTest(task4, undefined));
  t.deepEqual(
    resultState3,
    {
      isProviderLoading: false,
      isCloudMapLoading: false,
      providerError: null,
      currentProvider: 'taro',
      mapSaved: 'taro',
      savedMapId: null,
      initialState: {},
      successInfo: {url: 'taro_and_blue'},
      modalId: null,
      visualizations: []
    },
    'Should call toggleModal(null'
  );

  const resultState4 = composedReducer(resultState3, succeedTaskInTest(task5, undefined));
  t.deepEqual(
    resultState4,
    {
      isProviderLoading: false,
      isCloudMapLoading: false,
      providerError: null,
      currentProvider: 'taro',
      mapSaved: 'taro',
      savedMapId: null,
      initialState: {},
      successInfo: {},
      modalId: null,
      visualizations: []
    },
    'Should call resetProviderStatus'
  );

  const resultState5 = composedReducer(resultState4, succeedTaskInTest(task6, undefined));
  t.equal(
    resultState5.notification.type,
    'success',
    'Should call addNotification with successNote'
  );

  const resultState6 = composedReducer(resultState5, succeedTaskInTest(task7, undefined));
  t.equal(resultState6.remove, true, 'Should call removeNotification');

  t.end();
});

test('#providerStateReducer -> RESET_PROVIDER_STATUS', t => {
  const mockProvider = new MockProvider();
  const nextState = reducer(
    undefined,
    exportFileToCloud({
      mapData: {data: []},
      provider: mockProvider,
      options: {
        isPublic: false
      }
    })
  );
  const nextState1 = reducer(nextState, resetProviderStatus());

  t.deepEqual(
    nextState1,
    {
      isProviderLoading: false,
      isCloudMapLoading: false,
      providerError: null,
      currentProvider: 'taro',
      successInfo: {},
      initialState: {},
      mapSaved: null,
      savedMapId: null,
      visualizations: []
    },
    'Should resetProviderStatus'
  );

  t.end();
});

test('#providerStateReducer -> private saves retain identity while public shares do not replace it', t => {
  drainTasksForTesting();
  const provider = new MockProvider();
  const state = {...INITIAL_PROVIDER_STATE, mapSaved: 'old-provider', savedMapId: 'old-id'};
  const response = {info: {id: 'new-id'}, url: 'https://example.com/map'};
  const shared = reducer(state, exportFileSuccess({provider, response, options: {isPublic: true}}));
  t.equal(shared.mapSaved, 'old-provider', 'public sharing preserves the private save provider');
  t.equal(shared.savedMapId, 'old-id', 'public sharing preserves the private save id');
  t.equal(shared.successInfo, response, 'sharing still exposes the response');
  const saved = reducer(state, exportFileSuccess({provider, response}));
  t.equal(saved.mapSaved, provider.name, 'private save updates provider');
  t.equal(saved.savedMapId, 'new-id', 'private save captures response id');
  const noId = reducer(saved, exportFileSuccess({provider, response: {}}));
  t.equal(noId.savedMapId, null, 'a response without id clears stale identity');
  t.equal(state.savedMapId, 'old-id', 'source state remains unchanged');
  t.deepEqual(drainTasksForTesting(), [], 'no callback or modal task without opt-in');
  t.end();
});

test('#providerStateReducer -> conflicting saves offer overwrite instead of invoking error callback', t => {
  drainTasksForTesting();
  const provider = new MockProvider();
  const onError = sinon.spy(() => ({type: 'CUSTOM_ERROR'}));
  const state = {...INITIAL_PROVIDER_STATE, isProviderLoading: true};
  const next = reducer(
    state,
    exportFileError({provider, error: new Error(FILE_CONFLICT_MSG), onError})
  );
  t.equal(next.isProviderLoading, false, 'stops loading');
  t.equal(next.mapSaved, provider.name, 'retains provider for overwrite');
  t.equal(next.providerError, null, 'conflict is not a generic provider error');
  const tasks = drainTasksForTesting();
  t.equal(tasks.length, 1, 'only opens overwrite modal');
  t.deepEqual(
    succeedTaskInTest(tasks[0]),
    {type: ActionTypes.TOGGLE_MODAL, payload: OVERWRITE_MAP_ID},
    'opens overwrite modal'
  );
  t.equal(onError.callCount, 0, 'does not call generic error callback');
  t.end();
});

test('#providerStateReducer -> load validation does not schedule invalid provider requests', t => {
  drainTasksForTesting();
  const warn = sinon.stub(Console, 'warn');
  const error = sinon.stub(Console, 'error');
  const state = {...INITIAL_PROVIDER_STATE};
  try {
    for (const payload of [{}, {loadParams: {}}, {loadParams: {}, provider: {name: 'invalid'}}]) {
      t.equal(reducer(state, loadCloudMap(payload)), state, 'invalid request preserves state');
    }
    t.deepEqual(drainTasksForTesting(), [], 'invalid requests schedule no network work');
  } finally {
    warn.restore();
    error.restore();
  }
  t.end();
});

test('#providerStateReducer -> download failure clears loading and creates persistent error notification', t => {
  drainTasksForTesting();
  const warn = sinon.stub(Console, 'warn');
  const provider = {name: 'cloud', downloadMap: async () => ({})};
  const loadParams = {id: 'map-id'};
  try {
    const loading = reducer(undefined, loadCloudMap({provider, loadParams}));
    t.equal(loading.isProviderLoading, true, 'provider starts loading');
    t.equal(loading.isCloudMapLoading, true, 'map starts loading');
    const [download] = drainTasksForTesting();
    t.deepEqual(
      download.payload,
      {provider, payload: loadParams},
      'forwards provider request parameters'
    );
    const failed = reducer(loading, errorTaskInTest(download, new Error('download failed')));
    t.equal(failed.isProviderLoading, false, 'provider stops loading');
    t.equal(failed.isCloudMapLoading, false, 'map stops loading');
    const tasks = drainTasksForTesting();
    t.equal(tasks.length, 1, 'error has no automatic dismissal task');
    const notification = succeedTaskInTest(tasks[0]);
    t.equal(notification.type, ActionTypes.ADD_NOTIFICATION, 'dispatches a notification');
    t.equal(notification.payload.type, 'error', 'notification is an error');
    t.equal(notification.payload.message, 'download failed', 'preserves failure message');
  } finally {
    warn.restore();
  }
  t.end();
});

test('#providerStateReducer -> malformed download responses report errors without parsing', t => {
  drainTasksForTesting();
  const provider = {name: 'cloud'};
  for (const response of [null, [], {}, {map: []}, {map: {config: {}}}, {map: {datasets: []}}]) {
    const onError = sinon.spy(() => ({type: 'CUSTOM_ERROR'}));
    const state = {...INITIAL_PROVIDER_STATE, isProviderLoading: true};
    const next = reducer(state, loadCloudMapSuccess({provider, response, onError}));
    t.equal(next.isProviderLoading, false, 'invalid response stops provider loading');
    t.ok(next.providerError, 'invalid response produces an error');
    const tasks = drainTasksForTesting();
    t.equal(tasks.length, 1, 'only callback task is scheduled');
    t.deepEqual(succeedTaskInTest(tasks[0]), {type: 'CUSTOM_ERROR'}, 'dispatches callback result');
    t.equal(onError.firstCall.args[0].provider, provider, 'callback receives provider');
    t.ok(onError.firstCall.args[0].error instanceof Error, 'callback receives validation error');
  }
  t.end();
});

test('#providerStateReducer -> async dataset processors preserve order and load metadata', async t => {
  drainTasksForTesting();
  const table = getApplicationConfig().table;
  const provider = {name: 'cloud', downloadMap: async () => response};
  const loadParams = {id: 'saved-map'};
  const datasets = [
    {info: {id: 'a'}, data: 'first'},
    {info: {id: 'b'}, data: 'second'}
  ];
  const response = {
    format: 'custom',
    map: {datasets, config: {version: 'v1'}, info: {title: 'Saved map'}}
  };
  const onSuccess = sinon.spy(() => ({type: 'CUSTOM_SUCCESS'}));
  let resolveFirst;
  const processor = sinon.spy(value =>
    value === 'first'
      ? new Promise(resolve => {
          resolveFirst = resolve;
        })
      : Promise.resolve({rows: [[2]]})
  );
  initApplicationConfig({table: {getFileProcessor: () => ({processor})}});
  try {
    const loading = reducer(undefined, loadCloudMap({provider, loadParams, onSuccess}));
    const [download] = drainTasksForTesting();
    const parsed = reducer(loading, await runProviderTask(download));
    const [parse] = drainTasksForTesting();
    const pending = runProviderTask(parse);
    await Promise.resolve();
    resolveFirst({rows: [[1]]});
    const loaded = reducer(parsed, await pending);
    t.equal(loaded.isCloudMapLoading, false, 'load finishes after parsing');
    t.equal(loaded.isProviderLoading, false, 'provider finishes after parsing');
    t.equal(loaded.mapSaved, 'cloud', 'records loaded provider');
    const tasks = drainTasksForTesting();
    const addData = succeedTaskInTest(tasks[0]);
    t.equal(addData.type, ActionTypes.ADD_DATA_TO_MAP, 'loads processed datasets');
    t.deepEqual(
      addData.payload.datasets,
      [
        {info: {id: 'a'}, data: {rows: [[1]]}},
        {info: {id: 'b'}, data: {rows: [[2]]}}
      ],
      'dataset order and identity survive asynchronous processing'
    );
    t.deepEqual(
      addData.payload.info,
      {title: 'Saved map', provider: 'cloud', loadParams},
      'preserves map metadata and source'
    );
    t.deepEqual(addData.payload.config, response.map.config, 'preserves saved config');
    t.equal(addData.payload.options.centerMap, false, 'does not override saved viewport');
    t.deepEqual(succeedTaskInTest(tasks[1]), {type: 'CUSTOM_SUCCESS'}, 'dispatches custom success');
    t.deepEqual(
      onSuccess.firstCall.args[0],
      {response, loadParams, provider},
      'success callback receives original response'
    );
    t.equal(
      succeedTaskInTest(tasks[2]).type,
      postSaveLoadSuccess('Map from cloud loaded').type,
      'requests post-load cleanup'
    );
  } finally {
    initApplicationConfig({table});
    drainTasksForTesting();
  }
  t.end();
});

test('#providerStateReducer -> custom saved-map processors receive the whole map', async t => {
  drainTasksForTesting();
  const table = getApplicationConfig().table;
  const map = {datasets: [{id: 'source'}], config: {version: 'v1'}};
  const datasets = [{info: {id: 'processed'}, data: {rows: [[1]]}}];
  const processor = sinon.spy(async () => ({datasets}));
  initApplicationConfig({table: {getFileProcessor: () => ({processor})}});
  try {
    reducer(
      undefined,
      loadCloudMapSuccess({
        provider: {name: 'cloud'},
        response: {format: 'keplergl', map},
        loadParams: {id: 'map'}
      })
    );
    const [task] = drainTasksForTesting();
    const action = await runProviderTask(task);
    t.equal(processor.callCount, 1, 'whole map is processed once');
    t.equal(processor.firstCall.args[0], map, 'plugin receives map rather than dataset fragments');
    t.deepEqual(action.payload.datasetsPayload.datasets, datasets, 'uses plugin datasets');
  } finally {
    initApplicationConfig({table});
    drainTasksForTesting();
  }
  t.end();
});

test('#providerStateReducer -> missing and unsupported formats use CSV fallback', async t => {
  drainTasksForTesting();
  const table = getApplicationConfig().table;
  const warn = sinon.stub(Console, 'warn');
  try {
    for (const format of [undefined, 'unsupported']) {
      for (const tableClass of [{}, {getFileProcessor: () => ({processor: null})}]) {
        initApplicationConfig({table: tableClass});
        reducer(
          undefined,
          loadCloudMapSuccess({
            provider: {name: 'cloud'},
            response: {
              format,
              map: {datasets: {info: {id: 'csv'}, data: 'value\n12\n'}, config: {}}
            },
            loadParams: {id: 'map'}
          })
        );
        const [task] = drainTasksForTesting();
        const action = await runProviderTask(task);
        const [dataset] = action.payload.datasetsPayload.datasets;
        t.equal(dataset.info.id, 'csv', 'preserves dataset id');
        t.equal(dataset.data.fields[0].name, 'value', 'fallback parses CSV fields');
        t.deepEqual(dataset.data.rows, [[12]], 'fallback parses numeric CSV values');
      }
    }
  } finally {
    initApplicationConfig({table});
    warn.restore();
    drainTasksForTesting();
  }
  t.end();
});

test('#providerStateReducer -> rejected async processors dispatch load failure and settle loading', async t => {
  drainTasksForTesting();
  const table = getApplicationConfig().table;
  const warn = sinon.stub(Console, 'warn');
  const error = new Error('invalid cloud dataset');
  initApplicationConfig({
    table: {
      getFileProcessor: () => ({
        processor: async () => {
          throw error;
        }
      })
    }
  });
  try {
    const provider = {name: 'cloud'};
    const state = {...INITIAL_PROVIDER_STATE, isProviderLoading: true, isCloudMapLoading: true};
    const parsing = reducer(
      state,
      loadCloudMapSuccess({
        provider,
        response: {format: 'custom', map: {datasets: [{data: 'bad'}], config: {}}},
        loadParams: {id: 'saved'}
      })
    );
    const [parse] = drainTasksForTesting();
    const failure = await runProviderTask(parse).catch(action => action);
    t.equal(
      failure.type,
      loadCloudMapError({error, provider}).type,
      'task returns a Redux action, not provider state'
    );
    t.equal(failure.payload.error, error, 'preserves parsing failure');
    const failed = reducer(parsing, failure);
    t.equal(failed.isCloudMapLoading, false, 'map loading settles');
    t.equal(failed.isProviderLoading, false, 'provider loading settles');
    const [notification] = drainTasksForTesting();
    t.equal(
      succeedTaskInTest(notification).payload.message,
      error.message,
      'shows the parsing error'
    );
  } finally {
    initApplicationConfig({table});
    warn.restore();
    drainTasksForTesting();
  }
  t.end();
});
