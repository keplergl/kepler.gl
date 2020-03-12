// Copyright (c) 2020 Uber Technologies, Inc.
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

import test from 'tape';
import {drainTasksForTesting, succeedTaskInTest, errorTaskInTest} from 'react-palm/tasks';
import sinon from 'sinon';
import {default as Console} from 'global/console';
import ActionTypes from 'constants/action-types';

import {exportFileToCloud, resetProviderStatus, setCloudProvider} from 'actions/provider-actions';
import reducer, {providerStateReducerFactory} from 'reducers/provider-state';
import {INITIAL_PROVIDER_STATE} from 'reducers/provider-state-updaters';
import MockProvider from 'test/helpers/mock-provider';

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
      mapSaved: null
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
      successInfo: {url: 'taro_and_blue'}
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
      successInfo: {}
    },
    'Should set isLoading to false and error'
  );
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
    [ActionTypes.REMOVE_NOTIFICATION]: (state, action) => ({
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
      initialState: {},
      successInfo: {url: 'taro_and_blue'}
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
      initialState: {},
      successInfo: {url: 'taro_and_blue'},
      modalId: null
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
      initialState: {},
      successInfo: {},
      modalId: null
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
      mapSaved: null
    },
    'Should resetProviderStatus'
  );

  t.end();
});

test('#providerStateReducer -> SET_CLOUD_PROVIDER', t => {
  const nextState = reducer(undefined, setCloudProvider('blue'));
  t.deepEqual(
    nextState,
    {
      isProviderLoading: false,
      isCloudMapLoading: false,
      providerError: null,
      currentProvider: 'blue',
      successInfo: {},
      mapSaved: null,
      initialState: {}
    },
    'Should setCloudProvider'
  );
  t.end();
});
