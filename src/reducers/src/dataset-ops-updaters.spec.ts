// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {VisStateActions} from '@kepler.gl/actions';
import {KeplerTable} from '@kepler.gl/table';
import SchemaManager from '@kepler.gl/schemas';
import {drainTasksForTesting, succeedTaskWithValues} from '@kepler.gl/tasks';

import visStateReducer from './vis-state';
import {INITIAL_VIS_STATE} from './vis-state-updaters';

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

function flushCreateTableTasks(state: typeof INITIAL_VIS_STATE) {
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
    return visStateReducer(nextState, succeedTaskWithValues(task, tables));
  }, state);
}

describe('dataset ops vis-state', () => {
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
    let state = {
      ...INITIAL_VIS_STATE,
      datasets: {cities}
    };

    state = visStateReducer(state, VisStateActions.addGroupBy('cities'));
    expect(state.groupBys).toHaveLength(1);
    const opId = state.groupBys[0].id;

    state = visStateReducer(
      state,
      VisStateActions.setGroupByConfig(opId, {
        fieldName: 'region',
        aggregations: {pop: 'sum'}
      })
    );
    state = visStateReducer(state, VisStateActions.runGroupBy(opId));
    state = flushCreateTableTasks(state);

    const resultId = state.groupBys[0].resultId;
    expect(state.datasets[resultId]).toBeTruthy();
    expect(state.datasets[resultId].metadata.derivedDataset).toEqual({
      type: 'groupBy',
      sourceDataIds: ['cities'],
      operationId: opId
    });
    expect(state.datasets[resultId].dataContainer.numRows()).toBe(2);
  });

  test('delete parent keeps derived child snapshot', () => {
    const cities = makeTable(
      'cities',
      [
        {name: 'region', type: ALL_FIELD_TYPES.string},
        {name: 'pop', type: ALL_FIELD_TYPES.integer}
      ],
      [['west', 10]]
    );
    let state = {
      ...INITIAL_VIS_STATE,
      datasets: {cities}
    };
    state = visStateReducer(state, VisStateActions.addGroupBy('cities'));
    const op = state.groupBys[0];
    state = visStateReducer(
      state,
      VisStateActions.setGroupByConfig(op.id, {
        fieldName: 'region',
        aggregations: {pop: 'sum'}
      })
    );
    state = visStateReducer(state, VisStateActions.runGroupBy(op.id));
    state = flushCreateTableTasks(state);

    expect(Object.keys(state.datasets)).toHaveLength(2);
    state = visStateReducer(state, VisStateActions.removeDataset('cities'));
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
    let state = {
      ...INITIAL_VIS_STATE,
      datasets: {cities}
    };
    state = visStateReducer(state, VisStateActions.addGroupBy('cities'));
    expect(state.groupBys[0].resultLabel).toMatch(/^group-by-\d{2}$/);
  });

  test('addJoin uses a short random result name', () => {
    const cities = makeTable('cities', [{name: 'id', type: ALL_FIELD_TYPES.string}], [['1']]);
    let state = {
      ...INITIAL_VIS_STATE,
      datasets: {cities}
    };
    state = visStateReducer(state, VisStateActions.addJoin('cities'));
    expect(state.joins[0].resultLabel).toMatch(/^join-dataset-\d{2}$/);
  });

  test('setSpatialJoinConfig updates the predicate', () => {
    const polys = makeTable('polys', [{name: 'geom', type: ALL_FIELD_TYPES.geojson}], []);
    let state = {
      ...INITIAL_VIS_STATE,
      datasets: {polys}
    };
    state = visStateReducer(state, VisStateActions.addSpatialJoin('polys'));
    const op = state.joins[0];
    expect(state.joins[0].predicate).toBe('intersects');
    expect(state.joins[0].resultLabel).toBe(`spatial-join-${state.joins[0].resultId}`);
    state = visStateReducer(
      state,
      VisStateActions.setSpatialJoinConfig(op.id, {predicate: 'within'})
    );
    expect(state.joins[0].predicate).toBe('within');
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
    let state = {
      ...INITIAL_VIS_STATE,
      datasets: {polys, pts}
    };
    state = visStateReducer(state, VisStateActions.addSpatialJoin('polys'));
    const op = state.joins[0];
    state = visStateReducer(
      state,
      VisStateActions.setSpatialJoinConfig(op.id, {
        rightDataId: 'pts',
        leftGeo: {kind: 'geojson', fieldName: 'geom'},
        rightGeo: {kind: 'latlng', latField: 'lat', lngField: 'lng'},
        aggregations: {value: 'sum'}
      })
    );
    state = visStateReducer(state, VisStateActions.runSpatialJoin(op.id));
    state = flushCreateTableTasks(state);

    expect(state.datasets[op.resultId]).toBeTruthy();
    state = visStateReducer(state, VisStateActions.removeDataset('pts'));
    expect(state.datasets.pts).toBeUndefined();
    expect(state.datasets.polys).toBeTruthy();
    expect(state.datasets[op.resultId]).toBeTruthy();
    expect(state.joins).toHaveLength(0);
  });

  test('save/load roundtrip keeps derivedDataset metadata and drafts', () => {
    const cities = makeTable(
      'cities',
      [
        {name: 'region', type: ALL_FIELD_TYPES.string},
        {name: 'pop', type: ALL_FIELD_TYPES.integer}
      ],
      [['west', 10]]
    );
    let state = {
      ...INITIAL_VIS_STATE,
      datasets: {cities}
    };
    state = visStateReducer(state, VisStateActions.addGroupBy('cities'));
    const op = state.groupBys[0];
    state = visStateReducer(
      state,
      VisStateActions.setGroupByConfig(op.id, {
        fieldName: 'region',
        aggregations: {pop: 'sum'}
      })
    );
    state = visStateReducer(state, VisStateActions.runGroupBy(op.id));
    state = flushCreateTableTasks(state);

    const saved = SchemaManager.save({
      visState: state,
      mapState: {},
      mapStyle: {},
      uiState: {}
    });
    const derived = saved.datasets.find(dataset => dataset.data.id === op.resultId);
    expect(derived?.data.metadata.derivedDataset.type).toBe('groupBy');
    expect(saved.config.config.visState.groupBys[0].fieldName).toBe('region');
  });
});
