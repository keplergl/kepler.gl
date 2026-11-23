// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {act, waitFor} from '@testing-library/react';
import KeplerTable from '../../src/table/src/kepler-table';
import {
  disposeVideoExportService,
  getVideoExportService,
  snapshotVideoMap
} from '../../examples/demo-app/src/kepler-video-export';

const mockRender = jest.fn();
const mockCapabilities = {
  available: true,
  formats: ['webm'],
  dimensions: [{width: 1920, height: 1080}],
  frameRates: [30]
};

jest.mock('@kepler.gl/mcp', () => jest.requireActual('../../src/mcp/src/video-export'));
jest.mock('@kepler.gl/components', () => ({
  getNativeVideoExportCapabilities: async () => mockCapabilities,
  ExportVideoModalFactory: () => props => {
    mockRender(props);
    return null;
  }
}));
jest.mock('@kepler.gl/reducers', () => ({
  DEFAULT_EXPORT_VIDEO: {durationMs: 10000, cameraPreset: 'Orbit'},
  visStateReducer: (state, action) => {
    if (action.type === 'filter-time') {
      return {
        ...state,
        filters: state.filters.map((filter, idx) =>
          idx === action.idx ? {...filter, [action.name]: action.value} : filter
        )
      };
    }
    return {...state, animationConfig: {...state.animationConfig, currentTime: action.value}};
  }
}));
jest.mock('@kepler.gl/actions', () => ({
  setFilterAnimationTime: (idx, name, value) => ({type: 'filter-time', idx, name, value}),
  setLayerAnimationTime: value => ({type: 'layer-time', value})
}));
jest.mock('@kepler.gl/styles', () => ({theme: {}}));
jest.mock('@kepler.gl/localization', () => ({messages: {en: {}}}));

const settings = {width: 1920, height: 1080, durationMs: 20000, frameRate: 30, format: 'webm'};
const stores = [];
function fixture() {
  const table = new KeplerTable({info: {id: 'data', label: 'Data'}, color: [0, 0, 0]});
  table.updateSchema({fields: [{name: 'value', type: 'integer'}], rows: [[1], [2], [3]]});
  table.filterRecord = {cpu: [], gpu: [], dynamicDomain: []};
  const layer = {
    config: {animation: {enabled: true}, visConfig: {opacity: 0.5}},
    meta: {bounds: [0, 1]},
    update() {
      this.config.visConfig.opacity = 0.9;
      this.meta.bounds[0] = 5;
    }
  };
  const effect = {
    config: {speed: 1},
    clone() {
      return {...this, config: {...this.config}};
    }
  };
  const map = {
    mapState: {longitude: 1, latitude: 2, zoom: 3},
    mapStyle: {styleType: 'dark', mapStyles: {dark: {url: 'style'}}},
    uiState: {exportVideo: {durationMs: 4000, resolution: '960x540'}},
    visState: {
      datasets: {data: table},
      layers: [layer],
      effects: [effect],
      filters: [{id: 'time', value: [0, 1]}],
      animationConfig: {currentTime: 0},
      cameraTour: {stops: [{camera: {zoom: 1}}, {camera: {zoom: 3}}]},
      annotations: [{text: 'Title'}],
      interactionConfig: {tooltip: {enabled: true}}
    }
  };
  const store = {getState: () => ({demo: {keplerGl: {map}}}), dispatch: jest.fn()};
  stores.push(store);
  return {map, store};
}
function latestProps() {
  return mockRender.mock.calls[mockRender.mock.calls.length - 1][0];
}
async function start(store, overrides = {}) {
  const service = getVideoExportService(store);
  let job;
  await act(async () => {
    job = await service.start({...settings, ...overrides});
  });
  await waitFor(() => expect(mockRender).toHaveBeenCalled());
  return {service, job};
}
async function finish(service, job, callback) {
  await act(async () => callback(latestProps().programmaticExport));
  await waitFor(() => expect(service.status(job.jobId).status).not.toBe('rendering'));
  expect(document.querySelector('[data-kepler-video-export]')).toBeNull();
}

beforeEach(() => {
  mockRender.mockClear();
  Object.defineProperty(crypto, 'randomUUID', {
    configurable: true,
    value: () => `export-${Math.random()}`
  });
});
afterEach(async () => {
  await act(async () => {
    stores.splice(0).forEach(disposeVideoExportService);
  });
});

test('snapshots mutable tables, fields, layer configuration and effects without copying raw data', () => {
  const {map} = fixture();
  const copy = snapshotVideoMap(map);
  const originalTable = map.visState.datasets.data;
  const copiedTable = copy.visState.datasets.data;
  expect(copiedTable).toBeInstanceOf(KeplerTable);
  expect(copiedTable).not.toBe(originalTable);
  expect(copiedTable.dataContainer).toBe(originalTable.dataContainer);
  const originalGpu = originalTable.gpuFilter;
  copiedTable.filterTable([], []);
  copiedTable.fields[0].displayName = 'Export only';
  copy.visState.layers[0].update();
  copy.visState.effects[0].config.speed = 10;
  copy.visState.filters[0].value[0] = 10;
  copy.mapStyle.mapStyles.dark.url = 'different';
  expect(originalTable.fields[0].displayName).toBe('value');
  expect(originalTable.gpuFilter).toBe(originalGpu);
  expect(map.visState.layers[0].config.visConfig.opacity).toBe(0.5);
  expect(map.visState.layers[0].meta.bounds).toEqual([0, 1]);
  expect(map.visState.effects[0].config.speed).toBe(1);
  expect(map.visState.filters[0].value).toEqual([0, 1]);
  expect(map.mapStyle.mapStyles.dark.url).toBe('style');
});

test('shares a single service per store and creates a fresh one after teardown', async () => {
  const {store} = fixture();
  const service = getVideoExportService(store);
  expect(getVideoExportService(store)).toBe(service);
  disposeVideoExportService(store);
  await expect(service.getCapabilities()).rejects.toThrow(/disconnected/);
  expect(getVideoExportService(store)).not.toBe(service);
});

test('uses explicit export settings and advances private animation state without dispatching to the map', async () => {
  const {store, map} = fixture();
  const {service, job} = await start(store);
  expect(latestProps().exportVideo).toMatchObject({
    resolution: '1920x1080',
    durationMs: 20000,
    mediaType: 'webm',
    cameraPreset: 'Camera Animation'
  });
  await act(async () => {
    latestProps().visStateActions.setFilterAnimationTime(0, 'value', [2, 3]);
    latestProps().visStateActions.setLayerAnimationTime(50);
  });
  expect(latestProps().visState.filters[0].value).toEqual([2, 3]);
  expect(latestProps().visState.animationConfig.currentTime).toBe(50);
  expect(map.visState.filters[0].value).toEqual([0, 1]);
  expect(map.visState.animationConfig.currentTime).toBe(0);
  expect(store.dispatch).not.toHaveBeenCalled();
  await finish(service, job, hooks => hooks.onComplete(new Blob(['video'], {type: 'video/webm'})));
  expect(service.status(job.jobId)).toMatchObject({status: 'succeeded', artifact: {size: 5}});
});

test('disabling data and camera animation holds the project state throughout rendering', async () => {
  const {store} = fixture();
  const {service, job} = await start(store, {dataAnimation: false, cameraAnimation: false});
  await act(async () => {
    latestProps().visStateActions.setFilterAnimationTime(0, 'value', [2, 3]);
    latestProps().visStateActions.setLayerAnimationTime(50);
  });
  expect(latestProps().visState.filters[0].value).toEqual([0, 1]);
  expect(latestProps().visState.animationConfig.currentTime).toBe(0);
  expect(latestProps().cameraAnimationEnabled).toBe(false);
  expect(latestProps().exportVideo.cameraPreset).toBe('None');
  await finish(service, job, hooks => hooks.onComplete(new Blob(['video'])));
});

test('cleans up the render root and reports renderer failures', async () => {
  const {store} = fixture();
  const {service, job} = await start(store);
  await finish(service, job, hooks => hooks.onError(new Error('The basemap could not load.')));
  expect(service.status(job.jobId)).toMatchObject({
    status: 'failed',
    error: 'The basemap could not load.'
  });
});

test('cancellation unmounts the isolated renderer and suppresses late files', async () => {
  const {store} = fixture();
  const {service, job} = await start(store);
  const hooks = latestProps().programmaticExport;
  await act(async () => {
    service.cancel(job.jobId);
  });
  await waitFor(() => expect(document.querySelector('[data-kepler-video-export]')).toBeNull());
  expect(hooks.signal.aborted).toBe(true);
  hooks.onComplete(new Blob(['late video']));
  expect(service.status(job.jobId)).toMatchObject({status: 'cancelled'});
  expect(service.status(job.jobId).artifact).toBeUndefined();
});

test('rejects an uninitialized map before mounting a renderer', async () => {
  const store = {getState: () => ({})};
  stores.push(store);
  const service = getVideoExportService(store);
  const job = await service.start(settings);
  await waitFor(() => expect(service.status(job.jobId).status).toBe('failed'));
  expect(service.status(job.jobId).error).toMatch(/Load a project/);
  expect(mockRender).not.toHaveBeenCalled();
  expect(document.querySelector('[data-kepler-video-export]')).toBeNull();
});
