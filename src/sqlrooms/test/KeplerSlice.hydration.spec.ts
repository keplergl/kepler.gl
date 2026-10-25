// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/** @jest-environment node */
// SPDX-License-Identifier: MIT
// Copyright SQLRooms Contributors and contributors to the kepler.gl project

// Saved-map fixtures below explicitly create the maps/configs asserted by each test.
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import {jest} from '@jest/globals';
import {addDataToMap, loadMapStyles, removeLayer} from '@kepler.gl/actions';
import type {KeplerSliceConfig} from '../src/config';
import {createStore} from 'zustand';
import {tableFromArrays, type Table} from 'apache-arrow';
import {createKeplerSlice, type KeplerSliceState} from '../src/KeplerSlice';
import type {DataTable} from '@sqlrooms/duckdb-core';
import {makeQualifiedTableName} from '@sqlrooms/duckdb-core';

// The slice only needs the store factory and theme lookup from these UI barrels.
// Keep the real factory, reducer, serializer, Arrow conversion, and task middleware.
jest.mock('@sqlrooms/room-shell', () =>
  jest.requireActual('@sqlrooms/room-store/dist/BaseRoomStore')
);
jest.mock('@sqlrooms/ui', () => ({getTheme: () => 'light'}));
// DuckDB WASM's browser bundle reads `Worker` at import time. This node suite
// never instantiates the adapter; it only needs the table-helper exports.
jest.mock('@duckdb/duckdb-wasm', () => ({
  DuckDBDataProtocol: {BROWSER_FILEREADER: 2}
}));

function table(name: string): DataTable {
  return {
    table: makeQualifiedTableName({
      database: 'test',
      schema: 'main',
      table: name
    }),
    database: 'test',
    schema: 'main',
    tableName: name,
    isView: false,
    columns: []
  };
}

function savedMap(id: string, dataIds: string[]): KeplerSliceConfig['maps'][number] {
  return {
    id,
    name: id,
    config: {
      version: 'v1',
      config: {
        visState: {
          layers: dataIds.map(dataId => ({
            id: `${id}-${dataId}`,
            type: 'point',
            config: {
              dataId,
              label: `Saved ${dataId}`,
              color: [255, 0, 0],
              isVisible: true,
              columns: {lat: 'lat', lng: 'lng'},
              visConfig: {}
            }
          }))
        },
        mapState: {},
        mapStyle: {},
        uiState: {}
      }
    }
  };
}

function createTestStore(config: KeplerSliceConfig = {maps: []}, tables: string[] = []) {
  // Only database query results are stubbed. The real addTableToMap path converts
  // Arrow data and dispatches through Kepler's reducer and react-palm middleware.
  const loadDataset = jest.fn<(query: string) => Promise<Table>>(async () =>
    tableFromArrays({
      lat: [47, 48],
      lng: [8, 9],
      value: [10, 20]
    })
  );
  const connector = {
    query: (query: string) => ({
      result: query.startsWith('PRAGMA')
        ? Promise.resolve(
            tableFromArrays({
              name: ['lat', 'lng', 'value'],
              type: ['DOUBLE', 'DOUBLE', 'DOUBLE']
            })
          )
        : loadDataset(query)
    })
  };
  const db = {
    getConnector: async () => connector,
    tables: tables.map(table),
    currentDatabase: 'test',
    currentSchema: 'main'
  };
  const store = createStore<KeplerSliceState & {db: typeof db}>()((set, get, api) => ({
    ...createKeplerSlice({
      config,
      // No network basemaps. Tests deliver the late style action explicitly.
      createInitialMapKeplerState: ({defaultInitialMapKeplerState}) => ({
        ...defaultInitialMapKeplerState,
        mapStyle: {
          ...defaultInitialMapKeplerState.mapStyle!,
          styleType: 'test',
          mapStyles: {}
        }
      })
    })(set, get, api),
    db
  }));
  return {store, db, loadDataset};
}

type TestStore = ReturnType<typeof createTestStore>['store'];
const savedLayers = (store: TestStore, mapId: string) =>
  store.getState().kepler.config.maps.find(m => m.id === mapId)?.config?.config.visState.layers;
const runtimeLayers = (store: TestStore, mapId: string) =>
  store.getState().kepler.map[mapId]!.visState.layers.map(l => l.id);

async function settle(work?: Promise<unknown>) {
  await jest.runAllTimersAsync();
  await work;
}

async function hydrate(store: TestStore, maps: KeplerSliceConfig['maps']) {
  store.getState().kepler.setConfig({maps});
  await settle(store.getState().kepler.waitForConfigRestore());
}

async function lateAutosaves(store: TestStore, mapId: string) {
  expect(store.getState().kepler.isRestoringConfig).toBe(false);
  // Intentionally arrive well after the old two-tick / 2.5-second workarounds.
  setTimeout(() => {
    store.getState().kepler.dispatchAction(mapId, loadMapStyles({}));
    store.getState().kepler.dispatchAction(
      mapId,
      addDataToMap({
        datasets: [],
        options: {autoCreateLayers: false, centerMap: false}
      })
    );
  }, 10_000);
  await settle();
}

describe('Kepler config hydration', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('exposes reactive pending status per map through missing data and retry', async () => {
    const {store, db} = createTestStore({maps: []}, ['available']);
    await settle(store.getState().kepler.initialize());
    const statuses = [store.getState().kepler.isMapConfigPending('hidden')];
    const unsubscribe = store.subscribe(state => {
      const pending = state.kepler.isMapConfigPending('hidden');
      if (statuses.at(-1) !== pending) statuses.push(pending);
    });
    try {
      await hydrate(store, [savedMap('ready', ['available']), savedMap('hidden', ['missing'])]);
      expect(store.getState().kepler.isRestoringConfig).toBe(false);
      expect(store.getState().kepler.isMapConfigPending('ready')).toBe(false);
      expect(store.getState().kepler.isMapConfigPending('hidden')).toBe(true);
      await lateAutosaves(store, 'hidden');
      expect(store.getState().kepler.isMapConfigPending('hidden')).toBe(true);

      db.tables.push(table('missing'));
      await settle(store.getState().kepler.syncKeplerDatasets());
      expect(store.getState().kepler.isMapConfigPending('hidden')).toBe(false);
      expect(runtimeLayers(store, 'hidden')).toEqual(['hidden-missing']);
      expect(statuses).toEqual([false, true, false]);
    } finally {
      unsubscribe();
    }
  });

  it('distinguishes pending map config from registration and persistence pauses', async () => {
    const {store} = createTestStore({maps: [savedMap('map', ['missing'])]});
    expect(store.getState().kepler.isMapConfigPending('map')).toBe(false);
    expect(store.getState().kepler.isMapConfigPending('unknown')).toBe(false);
    await settle(store.getState().kepler.initialize());
    expect(store.getState().kepler.isMapConfigPending('map')).toBe(true);
    store.getState().kepler.deleteMap('map');
    expect(store.getState().kepler.isMapConfigPending('map')).toBe(false);

    await hydrate(store, [savedMap('empty', [])]);
    await settle(
      store.getState().kepler.withConfigPersistencePaused(() => {
        expect(store.getState().kepler.isRestoringConfig).toBe(true);
        expect(store.getState().kepler.isMapConfigPending('empty')).toBe(false);
      })
    );
  });

  it('restores all maps after initialization without mounting any map component', async () => {
    const {store, loadDataset} = createTestStore({maps: []}, ['points']);
    await settle(store.getState().kepler.initialize());
    await hydrate(store, [savedMap('visible', ['points']), savedMap('hidden', ['points'])]);

    expect(loadDataset).toHaveBeenCalledTimes(2);
    for (const id of ['visible', 'hidden']) {
      expect(runtimeLayers(store, id)).toEqual([`${id}-points`]);
      await lateAutosaves(store, id);
      expect(savedLayers(store, id)).toEqual([expect.objectContaining({id: `${id}-points`})]);
    }
  });

  it('restores configs supplied before initialization too', async () => {
    const {store} = createTestStore({maps: [savedMap('initial', ['points'])]}, ['points']);
    await settle(store.getState().kepler.initialize());
    await lateAutosaves(store, 'initial');
    expect(runtimeLayers(store, 'initial')).toEqual(['initial-points']);
    expect(savedLayers(store, 'initial')).toEqual([
      expect.objectContaining({id: 'initial-points'})
    ]);
  });

  it.each(['before sync starts', 'after the empty sync pass'])(
    'restores maps when setConfig interleaves initialize %s',
    async timing => {
      const {store, loadDataset} = createTestStore({maps: []}, ['points', 'other']);
      const initializing = store.getState().kepler.initialize();
      if (timing === 'after the empty sync pass') await Promise.resolve();
      store.getState().kepler.setConfig({
        maps: [savedMap('a', ['points']), savedMap('b', ['other'])]
      });

      await settle(initializing);
      await settle(store.getState().kepler.waitForConfigRestore());

      expect(loadDataset).toHaveBeenCalledTimes(2);
      for (const [mapId, dataId] of [
        ['a', 'points'],
        ['b', 'other']
      ] as const) {
        expect(runtimeLayers(store, mapId)).toEqual([`${mapId}-${dataId}`]);
        await lateAutosaves(store, mapId);
        expect(savedLayers(store, mapId)).toEqual([
          expect.objectContaining({id: `${mapId}-${dataId}`})
        ]);
      }
    }
  );

  it('preserves an unavailable map through late actions and replay, then retries when its table appears', async () => {
    const {store, db} = createTestStore();
    await settle(store.getState().kepler.initialize());
    const map = savedMap('hidden', ['missing']);
    await hydrate(store, [map]);
    await lateAutosaves(store, 'hidden');
    expect(savedLayers(store, 'hidden')).toEqual(map.config!.config.visState.layers);

    // A second restore must not replay an already-overwritten empty config.
    await hydrate(store, structuredClone(store.getState().kepler.config.maps));
    db.tables.push(table('missing'));
    await settle(store.getState().kepler.syncKeplerDatasets());
    expect(runtimeLayers(store, 'hidden')).toEqual(['hidden-missing']);
  });

  it('preserves all saved layers when only one of two datasets is available', async () => {
    const {store, db} = createTestStore({maps: []}, ['available']);
    await settle(store.getState().kepler.initialize());
    const map = savedMap('partial', ['available', 'missing']);
    await hydrate(store, [map]);
    expect(runtimeLayers(store, 'partial')).toEqual(['partial-available']);
    await lateAutosaves(store, 'partial');
    expect(savedLayers(store, 'partial')).toEqual(map.config!.config.visState.layers);

    db.tables.push(table('missing'));
    await settle(store.getState().kepler.syncKeplerDatasets());
    expect(runtimeLayers(store, 'partial')).toEqual(['partial-available', 'partial-missing']);
    expect(savedLayers(store, 'partial')).toHaveLength(2);
  });

  it('preserves saved config on a dataset query failure and allows a later retry', async () => {
    const {store, loadDataset} = createTestStore({maps: []}, ['points']);
    await settle(store.getState().kepler.initialize());
    const errorLog = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    loadDataset.mockRejectedValueOnce(new Error('Temporary query failure'));
    const map = savedMap('retry', ['points']);
    await hydrate(store, [map]);
    expect(errorLog).toHaveBeenCalled();
    await lateAutosaves(store, 'retry');
    expect(savedLayers(store, 'retry')).toEqual(map.config!.config.visState.layers);
    await settle(store.getState().kepler.syncKeplerDatasets());
    expect(runtimeLayers(store, 'retry')).toEqual(['retry-points']);
  });

  it('duplicates a map during an in-flight restore without losing its saved layer', async () => {
    const {store, loadDataset} = createTestStore({maps: []}, ['points']);
    await settle(store.getState().kepler.initialize());
    let releaseLoad!: (result: Table) => void;
    loadDataset.mockImplementationOnce(
      () => new Promise<Table>(resolve => (releaseLoad = resolve))
    );
    const source = savedMap('source', ['points']);
    store.getState().kepler.setConfig({maps: [source]});
    await jest.runAllTimersAsync();
    expect(store.getState().kepler.isRestoringConfig).toBe(true);

    expect(await store.getState().kepler.duplicateMap('source')).toMatchObject({
      success: true
    });
    const copy = store.getState().kepler.config.maps.find(m => m.id !== 'source')!;
    expect(copy.config).toEqual(source.config);
    expect(copy.config).not.toBe(store.getState().kepler.config.maps[0]!.config);

    releaseLoad(tableFromArrays({lat: [47], lng: [8], value: [10]}));
    await settle(store.getState().kepler.waitForConfigRestore());
    expect(runtimeLayers(store, copy.id)).toEqual(['source-points']);
    await lateAutosaves(store, copy.id);
    expect(savedLayers(store, copy.id)).toHaveLength(1);
  });

  it('duplicates unavailable layers and settings, then restores the copy when data returns', async () => {
    const {store, db} = createTestStore();
    await settle(store.getState().kepler.initialize());
    const source = savedMap('source', ['points']);
    source.config!.config.visState.filters = [
      {
        id: 'saved-filter',
        dataId: ['points'],
        name: ['value'],
        type: 'range',
        value: [10, 20],
        enlarged: false
      }
    ];
    source.config!.config.visState.interactionConfig = {
      tooltip: {
        enabled: true,
        fieldsToShow: {points: [{name: 'value', format: ''}]}
      }
    };
    source.config!.config.visState.splitMaps = [
      {layers: {'source-points': true}},
      {layers: {'source-points': false}}
    ];
    await hydrate(store, [source]);
    expect(await store.getState().kepler.duplicateMap('source')).toMatchObject({
      success: true
    });
    const copy = store.getState().kepler.config.maps.find(m => m.id !== 'source')!;
    await lateAutosaves(store, copy.id);
    expect(store.getState().kepler.config.maps.find(m => m.id === copy.id)!.config).toEqual(
      source.config
    );

    db.tables.push(table('points'));
    await settle(store.getState().kepler.syncKeplerDatasets());
    const vis = store.getState().kepler.map[copy.id]!.visState;
    expect(runtimeLayers(store, copy.id)).toEqual(['source-points']);
    expect(vis.filters.map(filter => filter.id)).toEqual(['saved-filter']);
    expect(vis.splitMaps).toEqual(source.config!.config.visState.splitMaps);
    expect(vis.interactionConfig.tooltip.config.fieldsToShow.points).toEqual([
      {name: 'value', format: ''}
    ]);
  });

  it('duplicates current runtime edits on a ready map even while persistence is paused', async () => {
    const {store} = createTestStore({maps: []}, ['points']);
    await settle(store.getState().kepler.initialize());
    await hydrate(store, [savedMap('source', ['points'])]);
    const work = store.getState().kepler.withConfigPersistencePaused(async () => {
      store.getState().kepler.dispatchAction('source', removeLayer('source-points'));
      return store.getState().kepler.duplicateMap('source');
    });
    await settle(work);
    expect(await work).toMatchObject({success: true});
    const copy = store.getState().kepler.config.maps.find(m => m.id !== 'source')!;
    expect(savedLayers(store, 'source')).toHaveLength(1);
    expect(savedLayers(store, copy.id)).toEqual([]);
  });

  it('refuses to duplicate pending config without a preserved saved config', async () => {
    const {store} = createTestStore({maps: [{id: 'source', name: 'Source'}]});
    await settle(store.getState().kepler.initialize());
    store.getState().kepler.addConfigToMap('source', savedMap('source', ['points']).config!);
    expect(await store.getState().kepler.duplicateMap('source')).toMatchObject({
      success: false,
      code: 'source-map-config-pending'
    });
    expect(store.getState().kepler.config.maps).toHaveLength(1);
  });

  it('saves intentional last-layer deletion while another map is still pending', async () => {
    const {store} = createTestStore({maps: []}, ['available']);
    await settle(store.getState().kepler.initialize());
    const hidden = savedMap('hidden', ['missing']);
    await hydrate(store, [savedMap('ready', ['available']), hidden]);
    expect(runtimeLayers(store, 'ready')).toEqual(['ready-available']);
    store.getState().kepler.dispatchAction('ready', removeLayer('ready-available'));
    await settle();
    expect(savedLayers(store, 'ready')).toEqual([]);
    expect(savedLayers(store, 'hidden')).toEqual(hidden.config!.config.visState.layers);
    store.getState().kepler.removeDatasetFromMaps('available');
    await settle();
    expect(Object.keys(store.getState().kepler.map.ready!.visState.datasets)).toEqual([]);
    expect(savedLayers(store, 'ready')).toEqual([]);
  });

  it('keeps the newer config when hydration overlaps an in-flight dataset load', async () => {
    const {store, loadDataset} = createTestStore({maps: []}, ['old', 'obsolete', 'new']);
    await settle(store.getState().kepler.initialize());
    const originalLoader = loadDataset.getMockImplementation()!;
    let releaseLoad!: () => void;
    loadDataset.mockImplementationOnce(
      params =>
        new Promise<Awaited<ReturnType<typeof originalLoader>>>(resolve => {
          releaseLoad = () => {
            void originalLoader(params).then(resolve);
          };
        })
    );
    store.getState().kepler.setConfig({maps: [savedMap('map', ['old', 'obsolete'])]});
    await jest.runAllTimersAsync();
    store.getState().kepler.setConfig({maps: [savedMap('map', ['new'])]});
    releaseLoad();
    await settle(store.getState().kepler.waitForConfigRestore());
    await lateAutosaves(store, 'map');
    expect(runtimeLayers(store, 'map')).toEqual(['map-new']);
    expect(Object.keys(store.getState().kepler.map.map!.visState.datasets)).toEqual(['new']);
    expect(savedLayers(store, 'map')).toEqual([expect.objectContaining({id: 'map-new'})]);
  });

  it('finishes an explicit table load when another map is restored', async () => {
    const unchanged = savedMap('unchanged', []);
    const {store, loadDataset} = createTestStore({maps: [unchanged, savedMap('changed', [])]}, [
      'points',
      'other'
    ]);
    await settle(store.getState().kepler.initialize());
    const originalLoader = loadDataset.getMockImplementation()!;
    let releaseLoad!: () => void;
    loadDataset.mockImplementationOnce(
      query =>
        new Promise<Table>(resolve => {
          releaseLoad = () => {
            void originalLoader(query).then(resolve);
          };
        })
    );
    const addTable = store.getState().kepler.addTableToMap({
      mapId: 'unchanged',
      tableName: 'points',
      options: {autoCreateLayers: true, centerMap: false}
    });
    await jest.runAllTimersAsync();

    await hydrate(store, [unchanged, savedMap('changed', ['other'])]);
    releaseLoad();
    await settle(addTable);
    await lateAutosaves(store, 'unchanged');

    expect(Object.keys(store.getState().kepler.map.unchanged!.visState.datasets)).toEqual([
      'points'
    ]);
    expect(savedLayers(store, 'unchanged')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          config: expect.objectContaining({dataId: 'points'})
        })
      ])
    );
    expect(runtimeLayers(store, 'changed')).toEqual(['changed-other']);
  });

  it.each(['object', 'positional'] as const)(
    'honors cancellation of an in-flight %s add-table call',
    async signature => {
      const {store, loadDataset} = createTestStore({maps: [savedMap('map', [])]}, ['points']);
      await settle(store.getState().kepler.initialize());
      const controller = new AbortController();
      let releaseLoad!: (result: Table) => void;
      loadDataset.mockImplementationOnce(
        () => new Promise<Table>(resolve => (releaseLoad = resolve))
      );
      const addTableToMap = store.getState().kepler.addTableToMap;
      const work =
        signature === 'object'
          ? addTableToMap({
              mapId: 'map',
              tableName: 'points',
              signal: controller.signal
            })
          : addTableToMap(
              'map',
              'points',
              {},
              {},
              {
                signal: controller.signal
              }
            );
      await jest.runAllTimersAsync();
      controller.abort();
      releaseLoad(tableFromArrays({lat: [47], lng: [8]}));
      await settle(work);
      await lateAutosaves(store, 'map');

      expect(loadDataset).toHaveBeenCalledTimes(1);
      expect(store.getState().kepler.map.map!.visState.datasets).toEqual({});
      expect(savedLayers(store, 'map')).toEqual([]);
    }
  );

  it('restores a filter-only dataset and preserves the filter while it is unavailable', async () => {
    const {store, db} = createTestStore();
    await settle(store.getState().kepler.initialize());
    const map = savedMap('filters', []);
    map.config!.config.visState.filters = [
      {
        id: 'saved-filter',
        dataId: ['points'],
        name: ['value'],
        type: 'range',
        value: [10, 20],
        enlarged: false
      }
    ];
    await hydrate(store, [map]);
    await lateAutosaves(store, 'filters');
    expect(store.getState().kepler.config.maps[0]!.config!.config.visState.filters).toEqual(
      map.config!.config.visState.filters
    );
    db.tables.push(table('points'));
    await settle(store.getState().kepler.syncKeplerDatasets());
    expect(store.getState().kepler.map.filters!.visState.filters.map(f => f.id)).toEqual([
      'saved-filter'
    ]);
  });

  it('preserves pending tooltip and split-map settings until their data arrives', async () => {
    const {store, db} = createTestStore();
    await settle(store.getState().kepler.initialize());
    const map = savedMap('split', ['points']);
    map.config!.config.visState.interactionConfig = {
      tooltip: {
        enabled: true,
        fieldsToShow: {points: [{name: 'value', format: ''}]}
      }
    };
    map.config!.config.visState.splitMaps = [
      {layers: {'split-points': true}},
      {layers: {'split-points': false}}
    ];
    await hydrate(store, [map]);
    await lateAutosaves(store, 'split');
    expect(store.getState().kepler.config.maps[0]!.config).toEqual(map.config);
    db.tables.push(table('points'));
    await settle(store.getState().kepler.syncKeplerDatasets());
    const vis = store.getState().kepler.map.split!.visState;
    expect(vis.splitMaps).toEqual([
      {layers: {'split-points': true}},
      {layers: {'split-points': false}}
    ]);
    expect(vis.interactionConfig.tooltip.config.fieldsToShow.points).toEqual([
      {name: 'value', format: ''}
    ]);
    expect(vis.interactionToBeMerged).toEqual({});
    expect(vis.splitMapsToBeMerged).toEqual([]);
  });

  it('preserves and loads data referenced only by a pending tooltip', async () => {
    const {store, db} = createTestStore();
    await settle(store.getState().kepler.initialize());
    const map = savedMap('tooltip', []);
    map.config!.config.visState.interactionConfig = {
      tooltip: {
        enabled: true,
        fieldsToShow: {points: [{name: 'value', format: ''}]}
      }
    };
    await hydrate(store, [map]);
    await lateAutosaves(store, 'tooltip');
    expect(store.getState().kepler.config.maps[0]!.config).toEqual(map.config);
    db.tables.push(table('points'));
    await settle(store.getState().kepler.syncKeplerDatasets());
    expect(Object.keys(store.getState().kepler.map.tooltip!.visState.datasets)).toEqual(['points']);
    expect(store.getState().kepler.map.tooltip!.visState.interactionToBeMerged).toEqual({});
  });
});
