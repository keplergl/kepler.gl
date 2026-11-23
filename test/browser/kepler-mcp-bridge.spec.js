// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {enhanceReduxMiddleware} from '@kepler.gl/reducers';
import {
  addDataToMap,
  clearStagedLoadedFiles,
  createNewDatasetSuccess,
  loadCloudMap,
  loadCloudMapError,
  loadFiles,
  loadFilesErr,
  loadFilesSuccess,
  registerEntry,
  wrapTo
} from '@kepler.gl/actions';
import {load} from '@loaders.gl/core';
import {processRowObject, processCsvData} from '@kepler.gl/processors';
import {KeplerTable} from '@kepler.gl/table';
import {getApplicationConfig, initApplicationConfig} from '@kepler.gl/utils';
import demoReducer, {appReducer} from '../../examples/demo-app/src/reducers';
import {loadSampleConfigurations, setLoadingMapStatus} from '../../examples/demo-app/src/actions';
import {act, cleanup, render, waitFor} from '@testing-library/react';
import {KeplerMcpBridge, getProjectStatus} from '../../examples/demo-app/src/kepler-mcp-bridge';
import {buildCatalog, buildKeplerContext} from '../../examples/demo-app/src/kepler-mcp-shared';

jest.mock('../../examples/demo-app/src/kepler-mcp-shared', () => ({
  buildCatalog: jest.fn(),
  buildKeplerContext: jest.fn(),
  toDescriptor: command => ({id: command.id})
}));

jest.mock('@openassistant/kepler-assistant', () => ({aiAssistantReducer: (state = {}) => state}), {
  virtual: true
});
jest.mock('../../examples/demo-app/src/utils/runtime-config', () => ({
  getRuntimeConfig: () => ({})
}));
jest.mock('@loaders.gl/core', () => ({...jest.requireActual('@loaders.gl/core'), load: jest.fn()}));

const thunk =
  ({dispatch, getState}) =>
  next =>
  action =>
    typeof action === 'function' ? action(dispatch, getState) : next(action);
const originalFetch = global.fetch;
const originalWebSocket = global.WebSocket;

function projectStore(initialState) {
  let state = initialState;
  const listeners = new Set();
  return {
    getState: () => state,
    subscribe: listener => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    update: next => {
      state = next;
      listeners.forEach(listener => listener());
    },
    listeners
  };
}

const emptyProject = {visState: {datasets: {}, layers: []}};

class MockWebSocket {
  static OPEN = 1;
  static instances = [];
  readyState = MockWebSocket.OPEN;
  send = jest.fn();
  close = jest.fn(() => {
    this.readyState = 3;
  });

  constructor() {
    MockWebSocket.instances.push(this);
  }

  receive(message) {
    return this.onmessage({data: JSON.stringify(message)});
  }
}

function deferred() {
  let resolve;
  const promise = new Promise(done => {
    resolve = done;
  });
  return {promise, resolve};
}

describe('MCP browser bridge cancellation', () => {
  let execute;

  beforeEach(() => {
    MockWebSocket.instances = [];
    global.WebSocket = MockWebSocket;
    sessionStorage.clear();
    window.history.replaceState({}, '', '/?mcp=test-token');
    buildKeplerContext.mockReturnValue({});
    execute = jest.fn();
    buildCatalog.mockReturnValue([{id: 'map.load-data', execute}]);
  });

  afterEach(() => {
    cleanup();
    global.WebSocket = originalWebSocket;
    global.fetch = originalFetch;
    load.mockReset();
    sessionStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  function call(socket, callId) {
    return socket.receive({type: 'call', callId, tool: 'map.load-data', input: {url: '/data.csv'}});
  }

  it('passes a live signal to the command and returns a completed result', async () => {
    const result = {success: true, commandId: 'map.load-data', data: {datasetId: 'imported'}};
    execute.mockResolvedValue(result);
    render(<KeplerMcpBridge reduxStore={{}} />);
    const socket = MockWebSocket.instances[0];

    await call(socket, 'load');

    const [context, input] = execute.mock.calls[0];
    expect(context.signal).toBeInstanceOf(AbortSignal);
    expect(context.signal.aborted).toBe(false);
    expect(input).toEqual({url: '/data.csv'});
    expect(JSON.parse(socket.send.mock.calls[0][0])).toEqual({
      type: 'result',
      callId: 'load',
      result
    });
  });

  it('cancels only the requested call and suppresses its late result', async () => {
    const first = deferred();
    const second = deferred();
    execute.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    render(<KeplerMcpBridge reduxStore={{}} />);
    const socket = MockWebSocket.instances[0];
    const firstCall = call(socket, 'first');
    const secondCall = call(socket, 'second');

    await socket.receive({type: 'cancel', callId: 'first'});

    expect(execute.mock.calls[0][0].signal.aborted).toBe(true);
    expect(execute.mock.calls[1][0].signal.aborted).toBe(false);
    first.resolve({success: true});
    second.resolve({success: true});
    await Promise.all([firstCall, secondCall]);
    expect(socket.send).toHaveBeenCalledTimes(1);
    expect(JSON.parse(socket.send.mock.calls[0][0]).callId).toBe('second');
  });

  it.each(['disconnect', 'unmount'])('aborts every pending call on %s', async event => {
    const pending = deferred();
    execute.mockReturnValue(pending.promise);
    const view = render(<KeplerMcpBridge reduxStore={{}} />);
    const socket = MockWebSocket.instances[0];
    const calls = [call(socket, 'first'), call(socket, 'second')];

    if (event === 'disconnect') {
      // Invalid-token close does not schedule a reconnect.
      socket.onclose({code: 1008});
    } else {
      view.unmount();
    }

    expect(execute.mock.calls.map(([context]) => context.signal.aborted)).toEqual([true, true]);
    pending.resolve({success: true});
    await Promise.all(calls);
    expect(socket.send).not.toHaveBeenCalled();
  });
});

describe('MCP project readiness', () => {
  beforeEach(() => {
    MockWebSocket.instances = [];
    global.WebSocket = MockWebSocket;
    sessionStorage.clear();
    window.history.replaceState({}, '', '/?mcp=secret-token');
    buildKeplerContext.mockReturnValue({});
    buildCatalog.mockReturnValue([]);
  });

  afterEach(() => {
    cleanup();
    global.WebSocket = originalWebSocket;
    global.fetch = originalFetch;
    load.mockReset();
    sessionStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('advertises an initialized empty project as ready and identifies the app', () => {
    const reduxStore = projectStore({demo: {keplerGl: {map: emptyProject}}});
    render(<KeplerMcpBridge reduxStore={reduxStore} />);
    const socket = MockWebSocket.instances[0];
    socket.onopen();
    expect(JSON.parse(socket.send.mock.calls[0][0])).toEqual({
      type: 'hello',
      commands: [],
      app: {name: 'kepler.gl demo', version: expect.any(String)},
      project: {state: 'ready'}
    });
  });

  it('publishes ready only after delayed project data is installed, allowing the first lookup', async () => {
    const reduxStore = createStore(
      combineReducers({demo: demoReducer}),
      applyMiddleware(...enhanceReduxMiddleware([thunk]))
    );
    reduxStore.dispatch(registerEntry({id: 'map'}));
    const catalog = deferred();
    const data = deferred();
    load.mockReturnValue(data.promise);
    global.fetch = jest.fn().mockReturnValue(catalog.promise);
    const opening = reduxStore.dispatch(loadSampleConfigurations('delayed'));

    const lookup = jest.fn(async () => ({
      success: true,
      data: reduxStore.getState().demo.keplerGl.map.visState.layers[0]
    }));
    buildCatalog.mockReturnValue([{id: 'map.get-layer-options', execute: lookup}]);
    const view = render(<KeplerMcpBridge reduxStore={reduxStore} />);
    const socket = MockWebSocket.instances[0];
    socket.onopen();
    expect(JSON.parse(socket.send.mock.calls[0][0]).project).toEqual({state: 'loading'});

    let firstLookup;
    let layerAtReady;
    socket.send.mockImplementation(json => {
      const message = JSON.parse(json);
      if (message.type === 'status' && message.project.state === 'ready') {
        // Inspect the store immediately: a later act() flush would hide a ready
        // notification sent before the asynchronous table install completes.
        layerAtReady = reduxStore.getState().demo.keplerGl.map.visState.layers[0];
        firstLookup = socket.receive({
          type: 'call',
          callId: 'first-lookup',
          tool: 'map.get-layer-options'
        });
      }
    });

    catalog.resolve({
      ok: true,
      json: async () => [{id: 'delayed', dataUrl: 'https://example.test/data.csv'}]
    });
    await opening;
    expect(load).toHaveBeenCalledTimes(1);
    expect(socket.send).toHaveBeenCalledTimes(1);
    await act(async () => {
      data.resolve({shape: 'object-row-table', data: [{lat: 1, lng: 2}]});
    });
    await waitFor(() => expect(getProjectStatus(reduxStore)).toEqual({state: 'ready'}));
    const knownLayer = reduxStore.getState().demo.keplerGl.map.visState.layers[0];
    expect(knownLayer.config.dataId).toBe('delayed');
    expect(layerAtReady).toBe(knownLayer);
    expect(JSON.parse(socket.send.mock.calls[1][0])).toEqual({
      type: 'status',
      project: {state: 'ready'}
    });
    await firstLookup;
    expect(lookup).toHaveBeenCalledTimes(1);
    expect(JSON.parse(socket.send.mock.calls[2][0]).result.data.id).toBe(knownLayer.id);
    view.unmount();
  });

  it('stays loading between real progressive Arrow snapshots and becomes ready after the final one', async () => {
    const reduxStore = createStore(
      combineReducers({demo: demoReducer}),
      applyMiddleware(...enhanceReduxMiddleware([thunk]))
    );
    reduxStore.dispatch(registerEntry({id: 'map'}));
    const rows = [
      {lat: 1, lng: 2},
      {lat: 3, lng: 4},
      {lat: 5, lng: 6}
    ];
    const progressiveData = rows.map((_, index) => processRowObject(rows.slice(0, index + 1)));
    const observed = [];
    reduxStore.subscribe(() => {
      const visState = reduxStore.getState().demo.keplerGl.map.visState;
      observed.push({
        state: getProjectStatus(reduxStore).state,
        rows: visState.datasets['progressive-arrow']?.length ?? 0,
        loadingIndicatorValue: visState.loadingIndicatorValue
      });
    });
    await reduxStore.dispatch(
      loadFilesSuccess(
        [
          {
            info: {id: 'progressive-arrow', label: 'progressive.arrow', format: 'arrow'},
            data: progressiveData[2],
            progressiveData
          }
        ],
        {autoCreateLayers: false, centerMap: false}
      )
    );

    expect(observed).toContainEqual({state: 'loading', rows: 1, loadingIndicatorValue: 0});
    expect(observed).toContainEqual({state: 'loading', rows: 2, loadingIndicatorValue: 0});
    expect(observed.filter(event => event.state === 'ready').map(event => event.rows)).toEqual([3]);
    expect(getProjectStatus(reduxStore)).toEqual({state: 'ready'});
  });

  it.each([
    ['cancel', clearStagedLoadedFiles()],
    ['file retry', loadFiles([])],
    ['sample retry', setLoadingMapStatus(true)]
  ])('clears a queued progressive continuation on %s', (_event, action) => {
    const queued = createNewDatasetSuccess({
      results: [],
      onFinish: {...loadFilesSuccess([]), progressiveSteps: []}
    });
    const waiting = appReducer(undefined, queued);
    const read = app =>
      getProjectStatus(projectStore({demo: {app, keplerGl: {map: emptyProject}}}));
    expect(read(waiting)).toEqual({state: 'loading'});
    // Ending the new sample request must not reveal a stale replay flag.
    const reset = appReducer(appReducer(waiting, action), setLoadingMapStatus(false));
    expect(read(reset)).toEqual({state: 'ready'});
  });

  it('does not latch readiness for an unrelated dataset completion callback', () => {
    const app = appReducer(
      undefined,
      createNewDatasetSuccess({
        results: [],
        onFinish: {type: 'unrelated'}
      })
    );
    expect(getProjectStatus(projectStore({demo: {app, keplerGl: {map: emptyProject}}}))).toEqual({
      state: 'ready'
    });
  });

  it.each(['missing sample', 'fetch failure', 'processing failure'])(
    'reports %s as failed and clears the error on retry',
    async failure => {
      const reduxStore = createStore(
        combineReducers({demo: demoReducer}),
        applyMiddleware(...enhanceReduxMiddleware([thunk]))
      );
      reduxStore.dispatch(registerEntry({id: 'map'}));
      global.fetch = jest.fn().mockImplementation(async () => {
        if (failure === 'fetch failure') throw new Error('Failed to fetch private URL');
        return {
          ok: true,
          json: async () =>
            failure === 'missing sample'
              ? []
              : [{id: 'delayed', dataUrl: 'https://example.test/data.csv'}]
        };
      });
      load.mockResolvedValue({shape: 'object-row-table', data: null});
      await reduxStore.dispatch(loadSampleConfigurations('delayed'));
      await waitFor(() => expect(getProjectStatus(reduxStore)).toEqual({state: 'failed'}));
      reduxStore.dispatch(setLoadingMapStatus(true));
      expect(getProjectStatus(reduxStore)).toEqual({state: 'loading'});
    }
  );

  it('reports asynchronous sample installation failures instead of remaining loading', async () => {
    const reduxStore = createStore(
      combineReducers({demo: demoReducer}),
      applyMiddleware(...enhanceReduxMiddleware([thunk]))
    );
    reduxStore.dispatch(registerEntry({id: 'map'}));
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: 'invalid-config',
            dataUrl: 'https://example.test/data.csv',
            configUrl: 'https://example.test/config.json'
          }
        ]
      })
      .mockResolvedValueOnce({ok: true, json: async () => ({version: 'v1', config: null})});
    load.mockResolvedValue({shape: 'object-row-table', data: [{lat: 1, lng: 2}]});

    await reduxStore.dispatch(loadSampleConfigurations('invalid-config'));
    await waitFor(() => expect(getProjectStatus(reduxStore)).toEqual({state: 'failed'}));
    expect(reduxStore.getState().demo.app.isMapLoading).toBe(false);
    expect(reduxStore.getState().demo.keplerGl.map.visState.layers).toEqual([]);
  });

  it('finishes a valid empty cloud project without an onSuccess callback', async () => {
    const reduxStore = createStore(
      combineReducers({demo: demoReducer}),
      applyMiddleware(...enhanceReduxMiddleware([thunk]))
    );
    reduxStore.dispatch(registerEntry({id: 'map'}));
    const opening = reduxStore.dispatch(
      loadCloudMap({
        provider: {
          name: 'cloud',
          downloadMap: async () => ({format: 'csv', map: {datasets: [], config: {}}})
        },
        loadParams: {id: 'empty'}
      })
    );
    expect(getProjectStatus(reduxStore)).toEqual({state: 'loading'});
    await waitFor(() => expect(getProjectStatus(reduxStore)).toEqual({state: 'ready'}));
    expect(reduxStore.getState().demo.keplerGl.map.visState.datasets).toEqual({});
    expect(reduxStore.getState().demo.keplerGl.map.visState.layers).toEqual([]);
    await opening;
  });

  it('keeps a cloud project loading through delayed dataset installation without a callback', async () => {
    const previousTable = getApplicationConfig().table;
    initApplicationConfig({table: KeplerTable});
    const installation = deferred();
    const importData = KeplerTable.prototype.importData;
    const importing = jest
      .spyOn(KeplerTable.prototype, 'importData')
      .mockImplementationOnce(async function (...args) {
        await installation.promise;
        return importData.apply(this, args);
      });
    const reduxStore = createStore(
      combineReducers({demo: demoReducer}),
      applyMiddleware(...enhanceReduxMiddleware([thunk]))
    );
    reduxStore.dispatch(registerEntry({id: 'map'}));
    let opening;
    try {
      opening = reduxStore.dispatch(
        loadCloudMap({
          provider: {
            name: 'cloud',
            downloadMap: async () => ({
              format: 'csv',
              map: {
                datasets: [{info: {id: 'cloud'}, data: 'lat,lng\n1,2'}],
                config: {}
              }
            })
          },
          loadParams: {id: 'cloud'}
        })
      );
      render(<KeplerMcpBridge reduxStore={reduxStore} />);
      const socket = MockWebSocket.instances[0];
      socket.onopen();
      let layerAtReady;
      socket.send.mockImplementation(json => {
        const message = JSON.parse(json);
        if (message.type === 'status' && message.project.state === 'ready') {
          layerAtReady = reduxStore
            .getState()
            .demo.keplerGl.map.visState.layers.find(layer => layer.config.dataId === 'cloud');
        }
      });
      await waitFor(() => expect(importing).toHaveBeenCalledTimes(1));
      expect(getProjectStatus(reduxStore)).toEqual({state: 'loading'});
      expect(reduxStore.getState().demo.keplerGl.map.visState.datasets.cloud).toBeUndefined();
      expect(socket.send.mock.calls.map(([json]) => JSON.parse(json).project?.state)).not.toContain(
        'ready'
      );
      await act(async () => installation.resolve());
      await waitFor(() => expect(getProjectStatus(reduxStore)).toEqual({state: 'ready'}));
      expect(layerAtReady).toBeDefined();
      expect(layerAtReady.config.dataId).toBe('cloud');
      await opening;
    } finally {
      installation.resolve();
      await opening;
      importing.mockRestore();
      initApplicationConfig({table: previousTable});
    }
  });

  it.each([null, {}, {map: {config: {}}}])(
    'reports malformed cloud response %j as failed after core loading flags clear',
    async response => {
      const reduxStore = createStore(
        combineReducers({demo: demoReducer}),
        applyMiddleware(...enhanceReduxMiddleware([thunk]))
      );
      reduxStore.dispatch(registerEntry({id: 'map'}));
      await reduxStore.dispatch(
        loadCloudMap({
          provider: {name: 'cloud', downloadMap: async () => response},
          loadParams: {id: 'malformed'}
        })
      );
      expect(reduxStore.getState().demo.keplerGl.map.providerState).toMatchObject({
        isProviderLoading: false,
        isCloudMapLoading: false
      });
      expect(getProjectStatus(reduxStore)).toEqual({state: 'failed'});
      expect(reduxStore.getState().demo.keplerGl.map.visState.layers).toEqual([]);
    }
  );

  it('clears a failed MCP dataset installation when ADD_DATA_TO_MAP is retried', async () => {
    const reduxStore = createStore(
      combineReducers({demo: demoReducer}),
      applyMiddleware(...enhanceReduxMiddleware([thunk]))
    );
    reduxStore.dispatch(registerEntry({id: 'map'}));
    const dataset = {
      info: {id: 'retried', label: 'Retried dataset'},
      data: processCsvData('lat,lng\n37,-122')
    };
    const importData = jest
      .spyOn(KeplerTable.prototype, 'importData')
      .mockRejectedValueOnce(new Error('Import allocation failed'));
    const log = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const install = () =>
      reduxStore.dispatch(
        wrapTo(
          'map',
          addDataToMap({
            datasets: [dataset],
            options: {autoCreateLayers: false, centerMap: false}
          })
        )
      );

    try {
      await install();
      expect(getProjectStatus(reduxStore)).toEqual({state: 'failed'});
      expect(reduxStore.getState().demo.keplerGl.map.visState.datasets.retried).toBeUndefined();

      await install();
      expect(getProjectStatus(reduxStore)).toEqual({state: 'ready'});
      expect(reduxStore.getState().demo.app.error).toBeNull();
      expect(reduxStore.getState().demo.keplerGl.map.visState.datasets.retried).toBeDefined();
    } finally {
      importData.mockRestore();
      log.mockRestore();
    }
  });

  it('retains cloud load failures after core loading flags clear', async () => {
    const reduxStore = createStore(
      combineReducers({demo: demoReducer}),
      applyMiddleware(...enhanceReduxMiddleware([thunk]))
    );
    reduxStore.dispatch(registerEntry({id: 'map'}));
    await reduxStore.dispatch(loadCloudMapError({error: new Error('Private URL failed')}));
    expect(getProjectStatus(reduxStore)).toEqual({state: 'failed'});
  });

  it('retains accepted file errors after progress cleanup, ignores stale errors, and resets on retry', async () => {
    const reduxStore = createStore(
      combineReducers({demo: demoReducer}),
      applyMiddleware(...enhanceReduxMiddleware([thunk]))
    );
    reduxStore.dispatch(registerEntry({id: 'map'}));
    // Model an active file queue; the real task middleware drains it after the error.
    const initial = reduxStore.getState();
    initial.demo.keplerGl.map.visState.fileLoading = {
      loadId: 'active',
      filesToLoad: [],
      fileCache: [],
      options: {},
      onFinish: loadFilesSuccess
    };
    await reduxStore.dispatch(wrapTo('map', loadFilesErr('data.csv', new Error('stale'), 'old')));
    expect(reduxStore.getState().demo.app.error).toBeNull();
    await reduxStore.dispatch(
      wrapTo('map', loadFilesErr('data.csv', new Error('failed'), 'active'))
    );
    expect(reduxStore.getState().demo.keplerGl.map.visState.fileLoadingProgress).toEqual({});
    expect(getProjectStatus(reduxStore)).toEqual({state: 'failed'});
    await reduxStore.dispatch(loadFiles([]));
    expect(reduxStore.getState().demo.app.error).toBeNull();
  });

  it('retains rejected dataset installation and clears it when a cloud load starts', async () => {
    const reduxStore = createStore(
      combineReducers({demo: demoReducer}),
      applyMiddleware(...enhanceReduxMiddleware([thunk]))
    );
    reduxStore.dispatch(registerEntry({id: 'map'}));
    await reduxStore.dispatch(
      wrapTo(
        'map',
        createNewDatasetSuccess({
          results: [{status: 'rejected', reason: 'Private source failed'}],
          addToMapOptions: {}
        })
      )
    );
    expect(getProjectStatus(reduxStore)).toEqual({state: 'failed'});
    const pending = deferred();
    reduxStore.dispatch(
      loadCloudMap({
        provider: {name: 'test', downloadMap: () => pending.promise},
        loadParams: {}
      })
    );
    expect(getProjectStatus(reduxStore)).toEqual({state: 'loading'});
    expect(reduxStore.getState().demo.app.error).toBeNull();
  });

  it('reports failure without source URLs and recovers when a new load starts', () => {
    const reduxStore = projectStore({demo: {keplerGl: {map: emptyProject}}});
    render(<KeplerMcpBridge reduxStore={reduxStore} />);
    const socket = MockWebSocket.instances[0];
    socket.onopen();
    reduxStore.update({demo: {app: {error: 'https://private/?token=secret'}}});
    reduxStore.update({demo: {app: {isMapLoading: true, error: null}}});
    expect(socket.send.mock.calls.slice(1).map(([json]) => JSON.parse(json))).toEqual([
      {type: 'status', project: {state: 'failed'}},
      {type: 'status', project: {state: 'loading'}}
    ]);
    expect(socket.send.mock.calls.flat().join('')).not.toContain('secret');
  });

  it.each([
    [{}, 'unknown'],
    [{visState: {fileLoading: {}}}, 'loading'],
    [{visState: {loadingIndicatorValue: 1}}, 'loading'],
    [{visState: {loadingIndicatorValue: 0}}, 'ready'],
    [{uiState: {loadFiles: {fileLoading: true}}}, 'loading'],
    [{providerState: {isCloudMapLoading: true}}, 'loading'],
    [{visState: {fileLoadingProgress: {data: {error: 'private-url'}}}}, 'failed']
  ])('reports core map loading state %j as %s', (map, expected) => {
    const reduxStore = projectStore({demo: {keplerGl: {map}}});
    expect(getProjectStatus(reduxStore)).toEqual({state: expected});
  });
});
