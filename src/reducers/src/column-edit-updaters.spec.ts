// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {VisStateActions} from '@kepler.gl/actions';
import {KeplerTable} from '@kepler.gl/table';
import SchemaManager, {VisState} from '@kepler.gl/schemas';

import visStateReducer from './vis-state';
import {INITIAL_VIS_STATE} from './vis-state-updaters';

const reduceVisState = visStateReducer as (state: VisState, action: unknown) => VisState;

function makeCities() {
  const table = new KeplerTable({
    info: {id: 'cities', label: 'cities', type: 'local'},
    color: [0, 0, 0]
  });
  table.updateSchema({
    fields: [
      {name: 'lat', type: ALL_FIELD_TYPES.real},
      {name: 'lng', type: ALL_FIELD_TYPES.real},
      {name: 'region', type: ALL_FIELD_TYPES.string},
      {name: 'pop', type: ALL_FIELD_TYPES.integer}
    ],
    rows: [
      [37.7, -122.4, 'west', 10],
      [40.7, -74.0, 'east', 40]
    ]
  });
  return table;
}

function withCities(): VisState {
  const cities = makeCities();
  let state: VisState = {
    ...INITIAL_VIS_STATE,
    datasets: {cities},
    interactionConfig: {
      ...INITIAL_VIS_STATE.interactionConfig,
      tooltip: {
        ...INITIAL_VIS_STATE.interactionConfig.tooltip,
        config: {
          ...INITIAL_VIS_STATE.interactionConfig.tooltip.config,
          fieldsToShow: {
            cities: [{name: 'region', format: null}]
          }
        }
      }
    }
  };

  state = reduceVisState(
    state,
    VisStateActions.addLayer({
      id: 'cities-layer',
      type: 'point',
      config: {
        dataId: 'cities',
        label: 'cities',
        color: [255, 0, 0],
        columns: {lat: 'lat', lng: 'lng'},
        colorField: {name: 'region', type: 'string'},
        textLabel: [{field: {name: 'region', type: 'string'}}]
      }
    })
  );
  state = reduceVisState(
    state,
    VisStateActions.createOrUpdateFilter(undefined, 'cities', 'region')
  );
  state = reduceVisState(state, VisStateActions.addGroupBy('cities'));
  state = reduceVisState(
    state,
    VisStateActions.setGroupByConfig(state.groupBys[0].id, {
      fieldName: 'region',
      aggregations: {pop: 'sum'}
    })
  );
  state = reduceVisState(state, VisStateActions.addJoin('cities'));
  state = reduceVisState(
    state,
    VisStateActions.setJoinConfig(state.joins[0].id, {
      leftField: 'region',
      leftColumns: ['region', 'pop']
    })
  );
  state = reduceVisState(
    state,
    VisStateActions.addChart({
      id: 'region-chart',
      title: 'Regions',
      type: 'barChart',
      dataId: 'cities',
      applyFilters: true,
      display: {},
      chartDisplay: {},
      xAxis: {field: {name: 'region', type: 'string'}, aggregation: null, title: 'region'},
      yAxis: {field: {name: 'pop', type: 'integer'}, aggregation: 'sum', title: 'Population'},
      crossFilter: {
        enabled: false,
        filterId: 'region-chart-filter',
        fieldNames: {xAxis: 'region'},
        value: {}
      }
    })
  );
  return state;
}

describe('column edits', () => {
  test('rename changes the field identity stored in layers, filters, and saved maps', () => {
    let state = withCities();
    expect(state.layers).toHaveLength(1);
    expect(state.filters[0].name).toEqual(['region']);

    state = reduceVisState(state, VisStateActions.renameTableColumn('cities', 'region', 'area'));

    const region = state.datasets.cities.fields.find(field => field.name === 'area');
    expect(region?.name).toBe('area');
    expect(region?.id).toBe('area');
    expect(region?.displayName).toBe('area');
    expect(state.datasets.cities.fields.map(field => field.name)).toEqual([
      'lat',
      'lng',
      'area',
      'pop'
    ]);
    expect(state.datasets.cities.dataContainer.rowAsArray(0)[2]).toBe('west');

    const layer = state.layers[0];
    expect(layer.config.columns.lat.value).toBe('lat');
    expect(layer.config.columns.lng.value).toBe('lng');
    expect(layer.config.colorField?.name).toBe('area');
    expect(layer.config.textLabel[0].field?.name).toBe('area');
    expect(state.filters[0].name).toEqual(['area']);
    expect(state.groupBys[0].fieldName).toBe('area');
    expect(state.groupBys[0].aggregations).toEqual({pop: 'sum'});
    expect(state.joins[0].leftField).toBe('area');
    expect(state.joins[0].leftColumns).toEqual(['area', 'pop']);
    expect(state.charts[0].xAxis?.field?.name).toBe('area');
    expect(state.charts[0].yAxis?.field?.name).toBe('pop');
    expect(state.charts[0].crossFilter?.fieldNames).toEqual({xAxis: 'area'});
    expect(state.interactionConfig.tooltip.config.fieldsToShow.cities[0].name).toBe('area');

    const saved = SchemaManager.save({
      visState: state,
      mapState: {},
      mapStyle: {},
      uiState: {}
    });
    const savedVisState = saved.config.config.visState;
    expect(savedVisState.layers?.[0].visualChannels?.colorField).toEqual({
      name: 'area',
      type: 'string'
    });
    expect(savedVisState.layers?.[0].config.columns.lat).toBe('lat');
    expect(savedVisState.layers?.[0].config.textLabel?.[0].field?.name).toBe('area');
    expect(JSON.stringify(savedVisState.filters)).toContain('area');
    expect(JSON.stringify(savedVisState.filters)).not.toContain('region');
    expect(savedVisState.groupBys?.[0].fieldName).toBe('area');
    expect(savedVisState.joins?.[0].leftField).toBe('area');
    expect(savedVisState.charts?.[0].xAxis?.field?.name).toBe('area');
  });

  test('delete drops references and refuses the last column', () => {
    let state = withCities();
    state = reduceVisState(state, VisStateActions.deleteTableColumn('cities', 'pop'));

    expect(state.datasets.cities.fields.map(field => field.name)).toEqual(['lat', 'lng', 'region']);
    expect(state.layers).toHaveLength(1);
    expect(state.filters).toHaveLength(1);
    expect(state.groupBys[0].aggregations).toEqual({});
    expect(state.charts[0].yAxis?.field).toBeNull();
    expect(state.joins[0].leftColumns).toEqual(['region']);

    state = reduceVisState(state, VisStateActions.deleteTableColumn('cities', 'lat'));
    expect(state.layers).toHaveLength(0);
    expect(state.datasets.cities.fields.map(field => field.name)).toEqual(['lng', 'region']);

    const only = new KeplerTable({
      info: {id: 'only', label: 'only', type: 'local'},
      color: [0, 0, 0]
    });
    only.updateSchema({
      fields: [{name: 'region', type: ALL_FIELD_TYPES.string}],
      rows: [['west']]
    });
    const single: VisState = {...INITIAL_VIS_STATE, datasets: {only}};
    const kept = reduceVisState(single, VisStateActions.deleteTableColumn('only', 'region'));
    expect(kept.datasets.only.fields.map(field => field.name)).toEqual(['region']);
  });

  test('duplicate rename and non-tabular datasets are ignored', () => {
    const state = withCities();
    const duplicate = reduceVisState(
      state,
      VisStateActions.renameTableColumn('cities', 'region', 'pop')
    );
    expect(duplicate).toBe(state);

    const tiles = new KeplerTable({
      info: {id: 'tiles', label: 'tiles', type: 'vector-tile'},
      color: [0, 0, 0]
    });
    tiles.updateSchema({
      fields: [
        {name: 'region', type: ALL_FIELD_TYPES.string},
        {name: 'pop', type: ALL_FIELD_TYPES.integer}
      ],
      rows: [['west', 1]]
    });
    const tiled: VisState = {...INITIAL_VIS_STATE, datasets: {tiles}};
    const unchanged = reduceVisState(
      tiled,
      VisStateActions.renameTableColumn('tiles', 'region', 'area')
    );
    expect(unchanged).toBe(tiled);
    expect(reduceVisState(tiled, VisStateActions.deleteTableColumn('tiles', 'pop'))).toBe(tiled);
  });
});
