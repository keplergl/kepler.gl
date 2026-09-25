// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape-catch';

import {VisStateActions} from '@kepler.gl/actions';
import {ChartType, createBigNumberChart, createBarChart} from '@kepler.gl/charts';
import {
  visStateReducer as reducer,
  INITIAL_VIS_STATE,
  mergeCharts,
  prepareStateForDatasetReplace
} from '@kepler.gl/reducers';

test('#VisStateUpdater -> add/update/remove chart', t => {
  const chart = createBigNumberChart({id: 'c1', dataId: 'd1', title: 'Count'});
  let nextState = reducer(INITIAL_VIS_STATE, VisStateActions.addChart(chart));
  t.equal(nextState.charts.length, 1, 'should add a chart');
  t.equal(nextState.charts[0].id, 'c1');

  nextState = reducer(nextState, VisStateActions.addChart(chart));
  t.equal(nextState.charts.length, 1, 'should ignore duplicate chart ids');

  nextState = reducer(
    nextState,
    VisStateActions.updateChart('c1', {title: 'Updated', applyFilters: false})
  );
  t.equal(nextState.charts[0].title, 'Updated');
  t.equal(nextState.charts[0].applyFilters, false);

  nextState = reducer(nextState, VisStateActions.removeChart('c1'));
  t.equal(nextState.charts.length, 0, 'should remove the chart');
  t.end();
});

test('#VisStateUpdater -> removeDataset drops charts', t => {
  let nextState = {
    ...INITIAL_VIS_STATE,
    datasets: {
      d1: {id: 'd1', label: 'one'},
      d2: {id: 'd2', label: 'two'}
    },
    charts: [createBarChart({id: 'c1', dataId: 'd1'}), createBarChart({id: 'c2', dataId: 'd2'})]
  };
  nextState = reducer(nextState, VisStateActions.removeDataset('d1'));
  t.equal(nextState.charts.length, 1);
  t.equal(nextState.charts[0].id, 'c2');
  t.end();
});

test('#VisStateUpdater -> charts stay empty by default', t => {
  t.deepEqual(INITIAL_VIS_STATE.charts, []);
  t.equal(createBarChart().type, ChartType.barChart);
  t.equal(createBarChart().pinned, false, 'new charts are unpinned by default');
  t.end();
});

test('#VisStateUpdater -> updateChart can pin a chart', t => {
  const chart = createBarChart({id: 'c1', dataId: 'd1'});
  let nextState = reducer(INITIAL_VIS_STATE, VisStateActions.addChart(chart));
  t.equal(nextState.charts[0].pinned, false);
  nextState = reducer(nextState, VisStateActions.updateChart('c1', {pinned: true}));
  t.equal(nextState.charts[0].pinned, true);
  t.end();
});

test('#VisStateUpdater -> disabling cross-filter removes owned filter', t => {
  const chart = {
    ...createBarChart({id: 'c1', dataId: 'd1'}),
    crossFilter: {enabled: true, filterId: 'chart-c1-f', fieldNames: {x: 'cat'}, value: {x: 'A'}}
  };
  let nextState = {
    ...INITIAL_VIS_STATE,
    charts: [chart],
    filters: [{id: 'chart-c1-f', dataId: [], name: ['cat'], value: ['A']}]
  };
  nextState = reducer(
    nextState,
    VisStateActions.updateChart('c1', {
      crossFilter: {enabled: false, filterId: 'chart-c1-f', fieldNames: {x: 'cat'}, value: {}}
    })
  );
  t.equal(nextState.charts[0].crossFilter.enabled, false);
  t.equal(nextState.filters.length, 0, 'should drop the chart-owned filter');
  t.end();
});

function mockChartDataset(id, fields) {
  const dataset = {id, fields};
  dataset.filterTable = () => dataset;
  return dataset;
}

test('#VisStateUpdater -> switching chart dataId drops fields missing from the new dataset', t => {
  const chart = createBarChart({
    id: 'c1',
    dataId: 'd1',
    xAxis: {field: {name: 'Join_Count', type: 'integer'}, aggregation: 'uniqueBin'},
    yAxis: {field: {name: 'Join_Count', type: 'integer'}, aggregation: 'sum'}
  });
  let nextState = {
    ...INITIAL_VIS_STATE,
    datasets: {
      d1: mockChartDataset('d1', [{name: 'Join_Count'}]),
      d2: mockChartDataset('d2', [{name: 'mag'}, {name: 'place'}])
    },
    charts: [chart],
    filters: [{id: 'chart-c1-f', dataId: ['d1'], name: ['Join_Count'], value: [1]}]
  };
  nextState.charts[0] = {
    ...nextState.charts[0],
    crossFilter: {
      enabled: true,
      filterId: 'chart-c1-f',
      fieldNames: {x: 'Join_Count'},
      value: {x: 1}
    }
  };
  nextState = reducer(nextState, VisStateActions.updateChart('c1', {dataId: 'd2'}));
  t.equal(nextState.charts[0].dataId, 'd2');
  t.equal(nextState.charts[0].xAxis.field, null, 'stale x field should be cleared');
  t.equal(nextState.charts[0].yAxis.field, null, 'stale y field should be cleared');
  t.equal(nextState.charts[0].crossFilter.enabled, false);
  t.equal(nextState.filters.length, 0, 'owned cross-filter should be removed');
  t.end();
});

test('#VisStateUpdater -> mergeCharts skips duplicate ids in the loaded array', t => {
  const first = createBarChart({id: 'dup', dataId: 'd1', title: 'First'});
  const second = createBarChart({id: 'dup', dataId: 'd1', title: 'Second'});
  const other = createBarChart({id: 'other', dataId: 'd1', title: 'Other'});
  const state = {
    ...INITIAL_VIS_STATE,
    datasets: {d1: {id: 'd1', fields: []}}
  };
  const nextState = mergeCharts(state, [first, second, other], true);
  t.equal(nextState.charts.length, 2);
  t.equal(nextState.charts[0].id, 'dup');
  t.equal(nextState.charts[0].title, 'First');
  t.equal(nextState.charts[1].id, 'other');
  t.end();
});

test('#VisStateUpdater -> mergeCharts parks charts until the dataset exists', t => {
  const chart = createBarChart({id: 'c1', dataId: 'd1', title: 'Pending'});
  const parked = mergeCharts(INITIAL_VIS_STATE, [chart], true);
  t.equal(parked.charts.length, 0, 'should not add a chart for a missing dataset');
  t.equal(parked.chartsToBeMerged.length, 1);
  t.equal(parked.chartsToBeMerged[0].id, 'c1');

  const withDataset = {
    ...parked,
    datasets: {d1: {id: 'd1', fields: []}}
  };
  const merged = mergeCharts(withDataset, withDataset.chartsToBeMerged);
  t.equal(merged.charts.length, 1);
  t.equal(merged.charts[0].id, 'c1');
  t.equal(merged.chartsToBeMerged.length, 0, 'should clear parked charts after merge');
  t.end();
});

test('#VisStateUpdater -> prepareStateForDatasetReplace remaps charts', t => {
  const chartMove = createBarChart({id: 'c-move', dataId: 'old'});
  const chartKeep = createBarChart({id: 'c-keep', dataId: 'other'});
  const state = {
    ...INITIAL_VIS_STATE,
    datasets: {
      old: {id: 'old', fields: [{name: 'a'}]},
      other: {id: 'other', fields: [{name: 'b'}]}
    },
    charts: [chartMove, chartKeep]
  };
  const next = prepareStateForDatasetReplace(state, 'old', 'new');
  t.equal(next.charts.length, 1, 'should keep charts of other datasets');
  t.equal(next.charts[0].id, 'c-keep');
  t.equal(next.chartsToBeMerged.length, 1, 'should park remapped charts');
  t.equal(next.chartsToBeMerged[0].id, 'c-move');
  t.equal(next.chartsToBeMerged[0].dataId, 'new', 'should replace chart dataId');

  const restored = mergeCharts(
    {
      ...next,
      datasets: {
        ...next.datasets,
        new: {id: 'new', fields: [{name: 'a'}]}
      }
    },
    next.chartsToBeMerged
  );
  t.equal(restored.charts.length, 2, 'should restore remapped charts after the new dataset lands');
  t.equal(restored.charts.find(chart => chart.id === 'c-move')?.dataId, 'new');
  t.equal(restored.chartsToBeMerged.length, 0);
  t.end();
});
