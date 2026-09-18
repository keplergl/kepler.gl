// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape-catch';

import {VisStateActions} from '@kepler.gl/actions';
import {ChartType, createBigNumberChart, createBarChart} from '@kepler.gl/charts';
import {visStateReducer as reducer, INITIAL_VIS_STATE} from '@kepler.gl/reducers';

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
  t.end();
});
