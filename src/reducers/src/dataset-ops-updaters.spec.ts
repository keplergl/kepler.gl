// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {VisStateActions} from '@kepler.gl/actions';
import {KeplerTable} from '@kepler.gl/table';
import {processArrowTable, processCsvData, processKeplerglJSON} from '@kepler.gl/processors';
import {Int64, Table, vectorFromArray} from 'apache-arrow';
import {ProtoDataset} from '@kepler.gl/types';
import {exportMapToHTML, exportToJsonString, validateInputData} from '@kepler.gl/utils';
import SchemaManager, {VisState} from '@kepler.gl/schemas';
import {drainTasksForTesting, succeedTaskWithValues} from '@kepler.gl/tasks';
import {Response} from 'node-fetch';

import visStateReducer from './vis-state';
import {INITIAL_VIS_STATE} from './vis-state-updaters';

const reduceVisState = visStateReducer as (state: VisState, action: unknown) => VisState;

function makeTable(id: string, fields: {name: string; type: string}[], rows: any[][]) {
  const table = new KeplerTable({
    info: {id, label: id, type: 'local'},
    color: [0, 0, 0]
  });
  table.updateSchema({
    fields: fields.map(field => ({
      name: field.name,
      type: field.type,
      analyzerType: field.type
    })),
    rows
  });
  return table;
}

function flushCreateTableTasks(state: VisState) {
  const tasks = drainTasksForTesting();
  return tasks.reduce((nextState, task) => {
    if (!String(task.label || '').includes('CREATE_TABLE_TASK')) {
      return nextState;
    }
    const tables = (Array.isArray(task.payload) ? task.payload : [task.payload]).map(payload => {
      const table = new KeplerTable({info: payload.info, color: payload.color, ...payload.opts});
      table.updateSchema(payload.data);
      return table;
    });
    return reduceVisState(nextState, succeedTaskWithValues(task, tables));
  }, state);
}

describe('dataset ops vis-state', () => {
  const originalResponse = globalThis.Response;
  beforeAll(() => {
    globalThis.Response = Response as any;
  });
  afterAll(() => {
    globalThis.Response = originalResponse;
  });

  beforeEach(() => {
    drainTasksForTesting();
  });

  test('runGroupBy adds a derived dataset', () => {
    const cities = makeTable(
      'cities',
      [
        {name: 'region', type: ALL_FIELD_TYPES.string},
        {name: 'pop', type: ALL_FIELD_TYPES.integer}
      ],
      [
        ['west', 10],
        ['west', 20],
        ['east', 40]
      ]
    );
    let state: VisState = {
      ...INITIAL_VIS_STATE,
      datasets: {cities}
    };

    state = reduceVisState(state, VisStateActions.addGroupBy('cities'));
    expect(state.groupBys).toHaveLength(1);
    const opId = state.groupBys[0].id;

    state = reduceVisState(
      state,
      VisStateActions.setGroupByConfig(opId, {
        fieldName: 'region',
        aggregations: {pop: 'sum'}
      })
    );
    const resultId = state.groupBys[0].resultId;
    state = reduceVisState(state, VisStateActions.runGroupBy(opId));
    state = flushCreateTableTasks(state);

    expect(state.groupBys).toHaveLength(0);
    expect(state.datasets[resultId]).toBeTruthy();
    expect(state.datasets[resultId].metadata.derivedDataset).toEqual({
      type: 'groupBy',
      sourceDataIds: ['cities'],
      operationId: opId
    });
    expect(state.datasets[resultId].dataContainer.numRows()).toBe(2);
  });

  test.each([false, true])(
    'joined BigInts filter and save after source removal (mixed: %s)',
    mixed => {
      const arrow = new Table({
        key: vectorFromArray(['a', 'b', null]),
        pop: vectorFromArray([10n, 20n, null], new Int64())
      });
      const arrowData = processArrowTable({shape: 'arrow-table', data: arrow});
      if (!arrowData) throw new Error('Invalid Arrow fixture');
      const left = new KeplerTable({info: {id: 'left'}, color: [0, 0, 0]}).updateSchema(
        mixed
          ? {
              fields: arrowData.fields,
              rows: [
                ['a', 10n],
                ['b', 20],
                [null, 0.5]
              ]
            }
          : arrowData
      );
      const right = makeTable('right', [{name: 'key', type: 'string'}], [['a'], ['b']]);
      let state: VisState = {...INITIAL_VIS_STATE, datasets: {left, right}};
      state = reduceVisState(state, VisStateActions.addJoin('left'));
      const op = state.joins[0];
      state = reduceVisState(
        state,
        VisStateActions.setJoinConfig(op.id, {
          rightDataId: 'right',
          leftField: 'key',
          rightField: 'key',
          rightColumns: []
        })
      );
      state = flushCreateTableTasks(reduceVisState(state, VisStateActions.runJoin(op.id)));
      state = reduceVisState(state, VisStateActions.addFilter(op.resultId));
      state = reduceVisState(state, VisStateActions.setFilter(0, 'name', 'pop'));
      expect(state.filters[0].domain).toEqual([10, 20]);
      state = reduceVisState(state, VisStateActions.setFilter(0, 'gpu', false));
      state = reduceVisState(state, VisStateActions.setFilter(0, 'value', [15, 20]));
      expect(state.datasets[op.resultId].filteredIndex).toEqual([1]);

      for (const removeSources of [false, true]) {
        if (removeSources) {
          state = reduceVisState(state, VisStateActions.removeDataset('left'));
          state = reduceVisState(state, VisStateActions.removeDataset('right'));
          expect(Object.keys(state.datasets)).toEqual([op.resultId]);
        }
        const saved = SchemaManager.save({visState: state});
        const json = JSON.parse(exportToJsonString(saved));
        const embedded = JSON.parse(
          exportMapToHTML(saved).match(/const datasets = (.*);/)?.[1] || ''
        );
        expect(embedded).toEqual(json.datasets);
        const parsed: ProtoDataset | undefined = processKeplerglJSON(json)?.datasets?.find(
          dataset => dataset.info.id === op.resultId
        );
        if (!parsed) throw new Error('Missing derived dataset after reload');
        const data = validateInputData(parsed.data);
        if (!data) throw new Error('Invalid derived dataset after reload');
        const reloaded = new KeplerTable({
          info: parsed.info,
          metadata: parsed.metadata,
          color: [0, 0, 0]
        }).updateSchema(data);
        expect(reloaded.getColumnFilterProps('pop')?.domain).toEqual([10, 20]);
        expect(reloaded.dataContainer.flattenData()).toEqual([
          ['a', 10],
          ['b', 20],
          [null, null]
        ]);
        expect(state.datasets[op.resultId].dataContainer.flattenData()).toEqual([
          ['a', 10n],
          ['b', 20n],
          [null, null]
        ]);
      }
      expect([0, 1, 2].map(index => arrow.getChild('pop')?.get(index))).toEqual([10n, 20n, null]);
      expect([0, 1, 2].map(index => left.dataContainer.valueAt(index, 1))).toEqual(
        mixed ? [10n, 20, 0.5] : [10n, 20n, null]
      );
    }
  );

  test.each(['minimum', 'maximum'] as const)(
    'runGroupBy selects chronological %s from recognized CSV timestamps',
    technique => {
      const december = '12/31/2025 10:00:00';
      const january = '01/01/2026 10:00:00';
      const data = processCsvData(
        `group,time\nwest,${december}\nwest,${january}\neast,${january}\neast,${december}\nmissing,`
      );
      if (!data) throw new Error('CSV import failed');
      expect(data.fields[1]).toMatchObject({type: 'timestamp', format: 'M/D/YYYY H:m:s'});
      const times = makeTable('times', [], []);
      times.updateSchema(data);
      let state: VisState = {...INITIAL_VIS_STATE, datasets: {times}};
      state = reduceVisState(state, VisStateActions.addGroupBy('times'));
      const op = state.groupBys[0];
      state = reduceVisState(
        state,
        VisStateActions.setGroupByConfig(op.id, {
          fieldName: 'group',
          aggregations: {time: technique}
        })
      );
      state = flushCreateTableTasks(reduceVisState(state, VisStateActions.runGroupBy(op.id)));
      const result = state.datasets[op.resultId];
      const expected = technique === 'minimum' ? december : january;
      expect(
        result.dataContainer.getPlainIndex().map(i => result.dataContainer.rowAsArray(i))
      ).toEqual([
        ['west', expected],
        ['east', expected],
        ['missing', null]
      ]);
      expect(result.fields[1]).toMatchObject({type: 'timestamp', format: data.fields[1].format});
      expect(times.dataContainer.valueAt(0, 1)).toBe(december);
      expect(times.dataContainer.valueAt(1, 1)).toBe(january);
    }
  );

  test('delete parent keeps derived child snapshot', () => {
    const cities = makeTable(
      'cities',
      [
        {name: 'region', type: ALL_FIELD_TYPES.string},
        {name: 'pop', type: ALL_FIELD_TYPES.integer}
      ],
      [['west', 10]]
    );
    let state: VisState = {
      ...INITIAL_VIS_STATE,
      datasets: {cities}
    };
    state = reduceVisState(state, VisStateActions.addGroupBy('cities'));
    const op = state.groupBys[0];
    state = reduceVisState(
      state,
      VisStateActions.setGroupByConfig(op.id, {
        fieldName: 'region',
        aggregations: {pop: 'sum'}
      })
    );
    state = reduceVisState(state, VisStateActions.runGroupBy(op.id));
    state = flushCreateTableTasks(state);

    expect(state.groupBys).toHaveLength(0);
    expect(Object.keys(state.datasets)).toHaveLength(2);
    state = reduceVisState(state, VisStateActions.removeDataset('cities'));
    expect(state.datasets.cities).toBeUndefined();
    expect(state.datasets[op.resultId]).toBeTruthy();
    expect(state.groupBys).toHaveLength(0);
  });

  test('addGroupBy uses a short random result name', () => {
    const cities = makeTable(
      'cities',
      [{name: 'region', type: ALL_FIELD_TYPES.string}],
      [['west']]
    );
    let state: VisState = {
      ...INITIAL_VIS_STATE,
      datasets: {cities}
    };
    state = reduceVisState(state, VisStateActions.addGroupBy('cities'));
    expect(state.groupBys[0].resultLabel).toMatch(/^group-by-\d{2}$/);
  });

  test('addJoin uses a short random result name', () => {
    const cities = makeTable('cities', [{name: 'id', type: ALL_FIELD_TYPES.string}], [['1']]);
    let state: VisState = {
      ...INITIAL_VIS_STATE,
      datasets: {cities}
    };
    state = reduceVisState(state, VisStateActions.addJoin('cities'));
    expect(state.joins[0].resultLabel).toMatch(/^join-dataset-\d{2}$/);
  });

  test('setSpatialJoinConfig updates the predicate', () => {
    const polys = makeTable('polys', [{name: 'geom', type: ALL_FIELD_TYPES.geojson}], []);
    let state: VisState = {
      ...INITIAL_VIS_STATE,
      datasets: {polys}
    };
    state = reduceVisState(state, VisStateActions.addSpatialJoin('polys'));
    const op = state.joins[0];
    expect(state.joins[0].predicate).toBe('intersects');
    expect(state.joins[0].resultLabel).toBe(`spatial-join-${state.joins[0].resultId}`);
    state = reduceVisState(
      state,
      VisStateActions.setSpatialJoinConfig(op.id, {predicate: 'within'})
    );
    expect(state.joins[0].predicate).toBe('within');
  });

  test('spatial joins imported WKT after repeated runs and source reloads without changing it', () => {
    const polygon = 'POLYGON ((-10 -10, 10 -10, 10 10, -10 10, -10 -10))';
    const polys = makeTable('polys', [], []);
    const pts = makeTable('pts', [], []);
    let state: VisState = {...INITIAL_VIS_STATE, datasets: {polys, pts}};

    for (const lng of [0, 0, 30]) {
      const polygonData = processCsvData(`geom\n"${polygon}"`);
      const point = `POINT (${lng} 0)`;
      const pointData = processCsvData(`geom,value\n"${point}",10`);
      if (!polygonData || !pointData) throw new Error('WKT CSV import failed');
      polys.updateSchema(polygonData);
      pts.updateSchema(pointData);
      expect(polys.fields[0].type).toBe(ALL_FIELD_TYPES.geojson);
      expect(pts.fields[0].type).toBe(ALL_FIELD_TYPES.geojson);

      state = reduceVisState(state, VisStateActions.addSpatialJoin('polys'));
      const op = state.joins[0];
      state = reduceVisState(
        state,
        VisStateActions.setSpatialJoinConfig(op.id, {
          rightDataId: 'pts',
          leftGeo: {kind: 'geojson', fieldName: 'geom'},
          rightGeo: {kind: 'geojson', fieldName: 'geom'},
          aggregations: {value: 'sum'}
        })
      );
      state = reduceVisState(state, VisStateActions.runSpatialJoin(op.id));
      state = flushCreateTableTasks(state);

      expect(state.joins).toHaveLength(0);
      expect(state.datasets[op.resultId].dataContainer.rowAsArray(0)).toEqual([
        polygon,
        lng === 0 ? 1 : 0,
        lng === 0 ? 10 : null
      ]);
      expect(polys.dataContainer.valueAt(0, 0)).toBe(polygon);
      expect(pts.dataContainer.valueAt(0, 0)).toBe(point);
    }
  });

  test('delete spatial join source keeps result snapshot', () => {
    const polygon = {
      type: 'Polygon',
      coordinates: [
        [
          [-10, -10],
          [10, -10],
          [10, 10],
          [-10, 10],
          [-10, -10]
        ]
      ]
    };
    const polys = makeTable(
      'polys',
      [
        {name: 'name', type: ALL_FIELD_TYPES.string},
        {name: 'geom', type: ALL_FIELD_TYPES.geojson}
      ],
      [['west', polygon]]
    );
    const pts = makeTable(
      'pts',
      [
        {name: 'lat', type: ALL_FIELD_TYPES.real},
        {name: 'lng', type: ALL_FIELD_TYPES.real},
        {name: 'value', type: ALL_FIELD_TYPES.integer}
      ],
      [[0, 0, 10]]
    );
    let state: VisState = {
      ...INITIAL_VIS_STATE,
      datasets: {polys, pts}
    };
    state = reduceVisState(state, VisStateActions.addSpatialJoin('polys'));
    const op = state.joins[0];
    state = reduceVisState(
      state,
      VisStateActions.setSpatialJoinConfig(op.id, {
        rightDataId: 'pts',
        leftGeo: {kind: 'geojson', fieldName: 'geom'},
        rightGeo: {kind: 'latlng', latField: 'lat', lngField: 'lng'},
        aggregations: {value: 'sum'}
      })
    );
    state = reduceVisState(state, VisStateActions.runSpatialJoin(op.id));
    state = flushCreateTableTasks(state);

    expect(state.joins).toHaveLength(0);
    expect(state.datasets[op.resultId]).toBeTruthy();
    state = reduceVisState(state, VisStateActions.removeDataset('pts'));
    expect(state.datasets.pts).toBeUndefined();
    expect(state.datasets.polys).toBeTruthy();
    expect(state.datasets[op.resultId]).toBeTruthy();
    expect(state.joins).toHaveLength(0);
  });

  test('save/load roundtrip keeps the derived dataset and drops the finished group by', () => {
    const cities = makeTable(
      'cities',
      [
        {name: 'region', type: ALL_FIELD_TYPES.string},
        {name: 'pop', type: ALL_FIELD_TYPES.integer}
      ],
      [['west', 10]]
    );
    let state: VisState = {
      ...INITIAL_VIS_STATE,
      datasets: {cities}
    };
    state = reduceVisState(state, VisStateActions.addGroupBy('cities'));
    const op = state.groupBys[0];
    state = reduceVisState(
      state,
      VisStateActions.setGroupByConfig(op.id, {
        fieldName: 'region',
        aggregations: {pop: 'sum'}
      })
    );
    state = reduceVisState(state, VisStateActions.runGroupBy(op.id));
    state = flushCreateTableTasks(state);

    const saved = SchemaManager.save({
      visState: state,
      mapState: {},
      mapStyle: {},
      uiState: {}
    });
    const derived = saved.datasets.find(dataset => dataset.data.id === op.resultId);
    const derivedMeta = derived?.data.metadata as
      | {derivedDataset?: {type?: string} | null}
      | undefined;
    expect(derivedMeta?.derivedDataset?.type).toBe('groupBy');
    expect(saved.config.config.visState.groupBys ?? []).toHaveLength(0);
  });
});

describe('suitability vis-state', () => {
  beforeEach(() => {
    drainTasksForTesting();
  });

  function siteState(): VisState {
    const sites = makeTable(
      'sites',
      [
        {name: 'name', type: ALL_FIELD_TYPES.string},
        {name: 'lat', type: ALL_FIELD_TYPES.real},
        {name: 'lng', type: ALL_FIELD_TYPES.real},
        {name: 'access', type: ALL_FIELD_TYPES.integer},
        {name: 'cost', type: ALL_FIELD_TYPES.integer}
      ],
      [
        ['a', 0, 0, 0, 100],
        ['b', 1, 1, 5, 200],
        ['c', 2, 2, 10, 300]
      ]
    );
    return {...INITIAL_VIS_STATE, datasets: {sites}};
  }

  test('addSuitability seeds numeric weights and a short random result name', () => {
    const state = reduceVisState(siteState(), VisStateActions.addSuitability('sites'));

    expect(state.suitabilities).toHaveLength(1);
    const op = state.suitabilities[0];
    expect(op.weights).toEqual({lat: 1, lng: 1, access: 1, cost: 1});
    expect(op.weightStandardization).toBe('normalize');
    expect(op.dataStandardization).toBe('range');
    expect(op.outputFieldName).toBe('score');
    expect(op.resultLabel).toMatch(/^suitability-\d{2}$/);
  });

  test('opening a suitability op closes an open group by', () => {
    let state = reduceVisState(siteState(), VisStateActions.addGroupBy('sites'));
    expect(state.groupBys[0].isConfigActive).toBe(true);

    state = reduceVisState(state, VisStateActions.addSuitability('sites'));
    expect(state.groupBys[0].isConfigActive).toBe(false);
    expect(state.suitabilities[0].isConfigActive).toBe(true);

    state = reduceVisState(state, VisStateActions.addGroupBy('sites'));
    expect(state.suitabilities[0].isConfigActive).toBe(false);
  });

  test('runSuitability adds a scored dataset and a default layer', () => {
    let state = reduceVisState(siteState(), VisStateActions.addSuitability('sites'));
    const op = state.suitabilities[0];

    state = reduceVisState(
      state,
      VisStateActions.setSuitabilityConfig(op.id, {weights: {access: 1, cost: 1}})
    );
    state = reduceVisState(state, VisStateActions.runSuitability(op.id));
    state = flushCreateTableTasks(state);

    const result = state.datasets[op.resultId];
    expect(result).toBeTruthy();
    expect(result.metadata.derivedDataset).toEqual({
      type: 'suitability',
      sourceDataIds: ['sites'],
      operationId: op.id
    });
    expect(result.fields.map(field => field.name)).toContain('score');
    expect(state.suitabilities[0].isConfigActive).toBe(false);

    const layer = state.layers.find(item => item.config.dataId === op.resultId);
    expect(layer).toBeTruthy();
    expect(layer?.config.colorField?.name).toBe('score');
  });

  test('running without a weighted field surfaces an error instead of a dataset', () => {
    let state = reduceVisState(siteState(), VisStateActions.addSuitability('sites'));
    const op = state.suitabilities[0];

    state = reduceVisState(state, VisStateActions.setSuitabilityConfig(op.id, {weights: {}}));
    state = reduceVisState(state, VisStateActions.runSuitability(op.id));

    expect(state.suitabilities[0].error).toBe('Select at least one field to score');
    expect(state.suitabilities[0].isConfigActive).toBe(true);
    expect(state.datasets[op.resultId]).toBeUndefined();
  });

  test('deleting the source dataset drops the op but keeps the scored snapshot', () => {
    let state = reduceVisState(siteState(), VisStateActions.addSuitability('sites'));
    const op = state.suitabilities[0];
    state = reduceVisState(state, VisStateActions.runSuitability(op.id));
    state = flushCreateTableTasks(state);

    expect(state.datasets[op.resultId]).toBeTruthy();
    state = reduceVisState(state, VisStateActions.removeDataset('sites'));
    expect(state.datasets.sites).toBeUndefined();
    expect(state.datasets[op.resultId]).toBeTruthy();
    expect(state.suitabilities).toHaveLength(0);
  });

  test('the op config stays out of saved maps while the derived dataset persists', () => {
    let state = reduceVisState(siteState(), VisStateActions.addSuitability('sites'));
    const op = state.suitabilities[0];
    state = reduceVisState(state, VisStateActions.runSuitability(op.id));
    state = flushCreateTableTasks(state);

    const saved = SchemaManager.save({
      visState: state,
      mapState: {},
      mapStyle: {},
      uiState: {}
    });

    expect(saved.config.config.visState).not.toHaveProperty('suitabilities');
    const derived = saved.datasets.find(dataset => dataset.data.id === op.resultId);
    const derivedMeta = derived?.data.metadata as
      | {derivedDataset?: {type?: string} | null}
      | undefined;
    expect(derivedMeta?.derivedDataset?.type).toBe('suitability');
  });
});
