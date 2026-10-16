// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  ALL_FIELD_TYPES,
  ANIMATION_WINDOW,
  FILTER_TYPES,
  PLOT_TYPES,
  SORT_ORDER
} from '@kepler.gl/constants';
import {VisStateActions} from '@kepler.gl/actions';
import {KeplerTable} from '@kepler.gl/table';
import SchemaManager, {VisState} from '@kepler.gl/schemas';
import {drainTasksForTesting, succeedTaskInTest} from '@kepler.gl/tasks';
import type {PolygonFilter, TimeRangeFilter} from '@kepler.gl/types';

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
  beforeEach(() => {
    drainTasksForTesting();
  });

  test('rename changes the field identity stored in layers, filters, and saved maps', () => {
    let state = withCities();
    state.datasets.cities.hiddenColumns = ['region', 'pop'];
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
    expect(state.charts[0].xAxis?.field?.name).toBe('area');
    expect(state.charts[0].yAxis?.field?.name).toBe('pop');
    expect(state.charts[0].crossFilter?.fieldNames).toEqual({xAxis: 'area'});
    expect(state.interactionConfig.tooltip.config.fieldsToShow.cities[0].name).toBe('area');
    expect(state.datasets.cities.hiddenColumns).toEqual(['area', 'pop']);

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
    expect(savedVisState.charts?.[0].xAxis?.field?.name).toBe('area');
  });

  test('delete drops references and refuses the last column', () => {
    let state = withCities();
    state.datasets.cities.hiddenColumns = ['region', 'pop'];
    state = reduceVisState(state, VisStateActions.deleteTableColumn('cities', 'pop'));

    expect(state.datasets.cities.fields.map(field => field.name)).toEqual(['lat', 'lng', 'region']);
    expect(state.layers).toHaveLength(1);
    expect(state.filters).toHaveLength(1);
    expect(state.charts[0].yAxis?.field).toBeNull();
    expect(state.datasets.cities.hiddenColumns).toEqual(['region']);

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

  test('type change converts values and reconciles incompatible references', () => {
    let state = withCities();
    state = reduceVisState(
      state,
      VisStateActions.addLayer({
        id: 'cities-heatmap',
        type: 'heatmap',
        config: {
          dataId: 'cities',
          label: 'cities heatmap',
          color: [255, 0, 0],
          columns: {lat: 'lat', lng: 'lng'},
          weightField: {name: 'pop', type: 'integer'},
          textLabel: [{field: {name: 'pop', type: 'integer'}}]
        }
      })
    );
    state = reduceVisState(
      state,
      VisStateActions.changeTableColumnType('cities', 'pop', ALL_FIELD_TYPES.string)
    );

    const pop = state.datasets.cities.fields.find(field => field.name === 'pop');
    expect(pop).toMatchObject({type: ALL_FIELD_TYPES.string, analyzerType: 'STRING', format: ''});
    expect(state.datasets.cities.dataContainer.rowAsArray(0)[3]).toBe('10');
    expect(state.layers).toHaveLength(2);
    expect(
      (state.layers.find(layer => layer.id === 'cities-heatmap')?.config as {weightField?: unknown})
        .weightField
    ).toBeNull();
    expect(
      state.layers.find(layer => layer.id === 'cities-heatmap')?.config.textLabel[0].field
    ).toMatchObject({name: 'pop', type: 'string'});
    expect(state.charts[0].yAxis?.field).toEqual({name: 'pop', type: 'string'});
  });

  test('type change preserves polygon filters targeting the dataset', () => {
    let state = withCities();
    const polygonFilter: PolygonFilter = {
      id: 'polygon-filter',
      dataId: ['cities'],
      enabled: true,
      fixedDomain: true,
      view: 'side',
      isAnimating: false,
      speed: 1,
      name: [],
      type: FILTER_TYPES.polygon,
      fieldIdx: [],
      domain: null,
      value: {
        type: 'Feature',
        id: 'polygon-selection',
        properties: {filterId: 'polygon-filter'},
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-123, 37],
              [-122, 37],
              [-122, 38],
              [-123, 37]
            ]
          ]
        }
      },
      plotType: {type: PLOT_TYPES.histogram},
      yAxis: null,
      layerId: ['cities-layer'],
      gpu: false
    };

    state = {...state, filters: [...state.filters, polygonFilter]};
    state = reduceVisState(
      state,
      VisStateActions.changeTableColumnType('cities', 'pop', ALL_FIELD_TYPES.string)
    );

    expect(state.filters.find(filter => filter.id === polygonFilter.id)).toBe(polygonFilter);

    state = reduceVisState(state, VisStateActions.deleteTableColumn('cities', 'lat'));

    expect(state.layers).toHaveLength(0);
    expect(state.filters.find(filter => filter.id === polygonFilter.id)).toBeUndefined();
    expect(state.datasets.cities.filterRecord?.gpu).not.toContainEqual(
      expect.objectContaining({id: polygonFilter.id})
    );
    expect(state.datasets.cities.filterRecord?.cpu).not.toContainEqual(
      expect.objectContaining({id: polygonFilter.id})
    );
  });

  test('type change preserves an existing sort on another column', () => {
    let state = withCities();
    state = reduceVisState(
      state,
      VisStateActions.sortTableColumn('cities', 'region', SORT_ORDER.ASCENDING)
    );
    expect(state.datasets.cities.sortColumn).toEqual({region: SORT_ORDER.ASCENDING});
    expect(state.datasets.cities.sortOrder).toEqual([1, 0]);

    state = reduceVisState(
      state,
      VisStateActions.changeTableColumnType('cities', 'pop', ALL_FIELD_TYPES.string)
    );

    expect(state.datasets.cities.sortColumn).toEqual({region: SORT_ORDER.ASCENDING});
    expect(state.datasets.cities.sortOrder).toEqual([1, 0]);
  });

  test('type change clears timeline state when a time filter becomes non-time', () => {
    const events = new KeplerTable({
      info: {id: 'events', label: 'events', type: 'local'},
      color: [0, 0, 0]
    });
    events.updateSchema({
      fields: [
        {name: 'start', type: ALL_FIELD_TYPES.timestamp, analyzerType: 'DATETIME'},
        {name: 'amount', type: ALL_FIELD_TYPES.integer}
      ],
      rows: [
        ['2024-01-01T00:00:00Z', 10],
        ['2024-01-02T00:00:00Z', 20]
      ]
    });
    let state: VisState = {...INITIAL_VIS_STATE, datasets: {events}};
    state = reduceVisState(
      state,
      VisStateActions.createOrUpdateFilter(undefined, 'events', 'start')
    );
    state = {
      ...state,
      filters: [
        {
          ...(state.filters[0] as TimeRangeFilter),
          syncedWithLayerTimeline: true,
          syncTimelineMode: 1 as const,
          isAnimating: true,
          animationWindow: ANIMATION_WINDOW.interval,
          timeBins: {events: {day: []}},
          lineChart: {
            series: [],
            yDomain: [0, 1],
            xDomain: [0, 1],
            aggregation: 'sum',
            interval: 'day',
            yAxis: 'amount'
          },
          timezone: 'UTC',
          invertTrendColor: true,
          showTimeDisplay: true,
          yAxis: state.datasets.events.fields[1],
          plotType: {type: PLOT_TYPES.lineChart, interval: 'day', aggregation: 'sum'}
        }
      ]
    };

    state = reduceVisState(
      state,
      VisStateActions.changeTableColumnType('events', 'start', ALL_FIELD_TYPES.string)
    );

    const filter = state.filters[0];
    expect(filter.type).toBe('multiSelect');
    expect(filter).not.toHaveProperty('syncedWithLayerTimeline');
    expect(filter).not.toHaveProperty('syncTimelineMode');
    expect(filter).not.toHaveProperty('timeBins');
    expect(filter).not.toHaveProperty('lineChart');
    expect(filter).not.toHaveProperty('timezone');
    expect(filter).not.toHaveProperty('invertTrendColor');
    expect(filter).not.toHaveProperty('showTimeDisplay');
    expect(filter).toMatchObject({
      fixedDomain: false,
      isAnimating: false,
      animationWindow: ANIMATION_WINDOW.free,
      yAxis: null,
      plotType: {type: PLOT_TYPES.histogram}
    });
  });

  test('type change detaches an incompatible synced filter member and refilters its dataset', () => {
    const primary = new KeplerTable({
      info: {id: 'primary', label: 'primary', type: 'local'},
      color: [0, 0, 0]
    });
    primary.updateSchema({
      fields: [{name: 'value', type: ALL_FIELD_TYPES.integer}],
      rows: [[1], [2]]
    });
    const secondary = new KeplerTable({
      info: {id: 'secondary', label: 'secondary', type: 'local'},
      color: [0, 0, 0]
    });
    secondary.updateSchema({
      fields: [{name: 'value', type: ALL_FIELD_TYPES.integer}],
      rows: [[1], [3]]
    });

    let state: VisState = {...INITIAL_VIS_STATE, datasets: {primary, secondary}};
    state = reduceVisState(
      state,
      VisStateActions.createOrUpdateFilter(undefined, 'primary', 'value')
    );
    state = reduceVisState(
      state,
      VisStateActions.setFilter(0, ['dataId', 'name'], ['secondary', 'value'], 1)
    );
    expect(state.filters[0].dataId).toEqual(['primary', 'secondary']);
    expect(state.datasets.secondary.filterRecord?.gpu).toHaveLength(1);

    state = reduceVisState(
      state,
      VisStateActions.changeTableColumnType('secondary', 'value', ALL_FIELD_TYPES.string)
    );

    expect(state.filters[0].dataId).toEqual(['primary']);
    expect(state.filters[0].name).toEqual(['value']);
    expect(state.filters[0].type).toBe('range');
    expect(state.datasets.secondary.filterRecord).toMatchObject({
      dynamicDomain: [],
      fixedDomain: [],
      cpu: [],
      gpu: []
    });
  });

  test('changing a synced secondary dataset does not reconcile the primary plot axis', () => {
    const makeEvents = (id: string) => {
      const table = new KeplerTable({
        info: {id, label: id, type: 'local'},
        color: [0, 0, 0]
      });
      table.updateSchema({
        fields: [
          {name: 'start', type: ALL_FIELD_TYPES.timestamp, analyzerType: 'TIME', format: 'x'},
          {name: 'amount', type: ALL_FIELD_TYPES.integer}
        ],
        rows: [
          [1_700_000_000, 10],
          [1_700_000_020, 20]
        ]
      });
      return table;
    };
    const primary = makeEvents('primary');
    const secondary = makeEvents('secondary');
    let state: VisState = {...INITIAL_VIS_STATE, datasets: {primary, secondary}};
    state = reduceVisState(
      state,
      VisStateActions.createOrUpdateFilter(undefined, 'primary', 'start')
    );
    state = reduceVisState(
      state,
      VisStateActions.setFilter(0, ['dataId', 'name'], ['secondary', 'start'], 1)
    );
    state = reduceVisState(
      state,
      VisStateActions.setFilterPlot(0, {yAxis: state.datasets.primary.fields[1]})
    );

    state = reduceVisState(
      state,
      VisStateActions.changeTableColumnType('secondary', 'amount', ALL_FIELD_TYPES.string)
    );

    expect(state.filters[0].dataId).toEqual(['primary', 'secondary']);
    expect(state.filters[0].yAxis).toMatchObject({name: 'amount', type: 'integer'});
    expect(state.filters[0].plotType.type).toBe('lineChart');
  });

  test('detaching a synced primary dataset rebuilds the plot for the new primary', () => {
    const primary = new KeplerTable({
      info: {id: 'primary', label: 'primary', type: 'local'},
      color: [0, 0, 0]
    });
    primary.updateSchema({
      fields: [
        {name: 'start', type: ALL_FIELD_TYPES.timestamp, analyzerType: 'TIME', format: 'x'},
        {name: 'amount', type: ALL_FIELD_TYPES.integer}
      ],
      rows: [
        [1_700_000_000, 10],
        [1_700_000_020, 20]
      ]
    });
    const secondary = new KeplerTable({
      info: {id: 'secondary', label: 'secondary', type: 'local'},
      color: [0, 0, 0]
    });
    secondary.updateSchema({
      fields: [{name: 'start', type: ALL_FIELD_TYPES.timestamp, analyzerType: 'TIME', format: 'x'}],
      rows: [[1_700_000_040], [1_700_000_060]]
    });
    let state: VisState = {...INITIAL_VIS_STATE, datasets: {primary, secondary}};
    state = reduceVisState(
      state,
      VisStateActions.createOrUpdateFilter(undefined, 'primary', 'start')
    );
    state = reduceVisState(
      state,
      VisStateActions.setFilter(0, ['dataId', 'name'], ['secondary', 'start'], 1)
    );
    state = reduceVisState(
      state,
      VisStateActions.setFilterPlot(0, {yAxis: state.datasets.primary.fields[1]})
    );
    expect(state.filters[0].lineChart).toBeDefined();

    state = reduceVisState(
      state,
      VisStateActions.changeTableColumnType('primary', 'start', ALL_FIELD_TYPES.string)
    );

    expect(state.filters[0].dataId).toEqual(['secondary']);
    expect(state.filters[0].name).toEqual(['start']);
    expect(state.filters[0].type).toBe('timeRange');
    expect(state.filters[0].yAxis).toBeNull();
    expect(state.filters[0].plotType.type).toBe('histogram');
    expect(state.filters[0].lineChart).toBeUndefined();
  });

  test('type change rebuilds grouped timeline series when group values collapse', () => {
    const events = new KeplerTable({
      info: {id: 'events', label: 'events', type: 'local'},
      color: [0, 0, 0]
    });
    events.updateSchema({
      fields: [
        {name: 'start', type: ALL_FIELD_TYPES.timestamp, analyzerType: 'TIME', format: 'x'},
        {name: 'group', type: ALL_FIELD_TYPES.string},
        {name: 'amount', type: ALL_FIELD_TYPES.integer}
      ],
      rows: [
        [1_700_000_000, '01', 10],
        [1_700_000_020, '1', 20]
      ]
    });
    let state: VisState = {...INITIAL_VIS_STATE, datasets: {events}};
    state = reduceVisState(
      state,
      VisStateActions.createOrUpdateFilter(undefined, 'events', 'start')
    );
    state = reduceVisState(
      state,
      VisStateActions.setFilterPlot(0, {yAxis: state.datasets.events.fields[2]})
    );
    state = reduceVisState(
      state,
      VisStateActions.setFilterPlot(0, {
        plotType: {groupBy: {fieldName: 'group', numGroups: 'ALL', groupOthers: false}}
      })
    );
    const namesBefore = (state.filters[0].lineChart?.series as {names?: string[]}).names;
    expect(new Set(namesBefore)).toEqual(new Set(['01', '1']));

    state = reduceVisState(
      state,
      VisStateActions.changeTableColumnType('events', 'group', ALL_FIELD_TYPES.integer)
    );

    const namesAfter = (state.filters[0].lineChart?.series as {names?: string[]}).names;
    expect(new Set(namesAfter)).toEqual(new Set(['1']));
  });

  test('type change clears an interval end field that is no longer a timestamp', () => {
    const events = new KeplerTable({
      info: {id: 'events', label: 'events', type: 'local'},
      color: [0, 0, 0]
    });
    events.updateSchema({
      fields: [
        {name: 'start', type: ALL_FIELD_TYPES.timestamp, analyzerType: 'TIME', format: 'x'},
        {name: 'end', type: ALL_FIELD_TYPES.timestamp, analyzerType: 'TIME', format: 'x'},
        {name: 'value', type: ALL_FIELD_TYPES.integer}
      ],
      rows: [
        [1_700_000_000, 1_700_086_400, 10],
        [1_700_000_020, 1_700_172_800, 20]
      ]
    });
    let state: VisState = {...INITIAL_VIS_STATE, datasets: {events}};
    state = reduceVisState(
      state,
      VisStateActions.addChart({
        id: 'events-chart',
        title: 'Events',
        type: 'barChart',
        dataId: 'events',
        applyFilters: true,
        display: {},
        chartDisplay: {},
        xAxis: {
          field: {name: 'end', type: 'timestamp'},
          aggregation: 'timeBin',
          interval: 'day',
          title: 'end'
        },
        yAxis: {field: {name: 'value', type: 'integer'}, aggregation: 'sum', title: 'value'}
      })
    );
    state = reduceVisState(
      state,
      VisStateActions.createOrUpdateFilter(undefined, 'events', 'start')
    );
    state = reduceVisState(state, VisStateActions.setFilter(0, 'endName', 'end', 0));
    state = reduceVisState(
      state,
      VisStateActions.setFilterPlot(0, {yAxis: state.datasets.events.fields[2]})
    );
    expect(state.filters[0].endName).toEqual(['end']);
    expect(state.filters[0].yAxis?.name).toBe('value');

    state = reduceVisState(
      state,
      VisStateActions.changeTableColumnType('events', 'value', ALL_FIELD_TYPES.string)
    );
    expect(state.filters[0].yAxis).toBeNull();
    expect(state.filters[0].plotType.type).toBe('histogram');
    expect(state.filters[0].endName).toEqual(['end']);
    expect(state.charts[0].yAxis).toMatchObject({
      field: {name: 'value', type: 'string'},
      aggregation: 'sum'
    });
    let timeFilter = state.filters[0] as TimeRangeFilter;
    const interval = timeFilter.plotType.interval;
    const intervalBins = timeFilter.timeBins?.events?.[interval];
    expect(intervalBins?.reduce((sum, bin) => sum + bin.count, 0)).toBeGreaterThan(2);

    state = reduceVisState(
      state,
      VisStateActions.changeTableColumnType('events', 'end', ALL_FIELD_TYPES.string)
    );
    expect(state.filters[0].type).toBe('timeRange');
    expect(state.filters[0].endName).toBeUndefined();
    expect(state.filters[0].endFieldIdx).toBeUndefined();
    timeFilter = state.filters[0] as TimeRangeFilter;
    const bins = timeFilter.timeBins?.events?.[interval];
    expect(bins?.reduce((sum, bin) => sum + bin.count, 0)).toBe(2);
    expect(state.charts[0].xAxis).toMatchObject({
      field: {name: 'end', type: 'string'},
      aggregation: 'uniqueBin'
    });
    expect(state.charts[0].xAxis?.interval).toBeUndefined();
  });

  test('invalid type change is atomic and schedules a precise error', () => {
    const state = withCities();
    const next = reduceVisState(
      state,
      VisStateActions.changeTableColumnType('cities', 'region', ALL_FIELD_TYPES.integer)
    );

    expect(next.datasets.cities).toBe(state.datasets.cities);
    expect(next.datasets.cities.fields.find(field => field.name === 'region')?.type).toBe(
      ALL_FIELD_TYPES.string
    );
    expect(next.datasets.cities.dataContainer.rowAsArray(0)[2]).toBe('west');

    const tasks = drainTasksForTesting();
    expect(tasks).toHaveLength(1);
    const notification = succeedTaskInTest(tasks[0], undefined);
    expect(notification.payload.message).toContain(
      'Cannot change “region” to integer: row 1 value “west” is not a safe integer'
    );
    expect(notification.payload.message).toContain('No values were changed.');
  });

  test('late column statistics cannot overwrite a changed column', () => {
    let state = withCities();
    state = reduceVisState(state, VisStateActions.loadColumnStats('cities', 'pop'));
    const requestRevision = state.datasets.cities.dataRevision;
    const [task] = drainTasksForTesting();
    const result = {type: 'numeric', mean: 25};
    const staleSuccess = succeedTaskInTest(task, {
      result,
      filterProps: {type: FILTER_TYPES.range}
    });
    expect(staleSuccess).toMatchObject({
      dataRevision: requestRevision,
      fieldType: ALL_FIELD_TYPES.integer
    });

    state = reduceVisState(
      state,
      VisStateActions.changeTableColumnType('cities', 'pop', ALL_FIELD_TYPES.string)
    );
    expect(state.datasets.cities.dataRevision).toBe(requestRevision + 1);
    const changedState = state;

    state = reduceVisState(state, staleSuccess);

    expect(state).toBe(changedState);
    const changedField = state.datasets.cities.fields.find(field => field.name === 'pop');
    expect(changedField).toMatchObject({type: ALL_FIELD_TYPES.string});
    expect(changedField).not.toHaveProperty('isLoadingStats');
    expect(
      state.datasets.cities.fields.find(field => field.name === 'pop')?.filterProps?.columnStats
    ).not.toBe(result);
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
    expect(
      reduceVisState(
        tiled,
        VisStateActions.changeTableColumnType('tiles', 'pop', ALL_FIELD_TYPES.string)
      )
    ).toBe(tiled);
  });

  test('externally hosted datasets ignore rename and delete', () => {
    const remote = new KeplerTable({
      info: {id: 'remote', label: 'remote', type: 'externally-hosted'},
      color: [0, 0, 0]
    });
    remote.updateSchema({
      fields: [
        {name: 'region', type: ALL_FIELD_TYPES.string, displayName: 'Region'},
        {name: 'pop', type: ALL_FIELD_TYPES.integer}
      ],
      rows: [['west', 1]]
    });
    const state: VisState = {...INITIAL_VIS_STATE, datasets: {remote}};

    expect(
      reduceVisState(state, VisStateActions.renameTableColumn('remote', 'region', 'area'))
    ).toBe(state);
    expect(reduceVisState(state, VisStateActions.deleteTableColumn('remote', 'pop'))).toBe(state);
    expect(
      reduceVisState(
        state,
        VisStateActions.changeTableColumnType('remote', 'pop', ALL_FIELD_TYPES.string)
      )
    ).toBe(state);
    expect(state.datasets.remote.fields[0].displayName).toBe('Region');
  });
});
