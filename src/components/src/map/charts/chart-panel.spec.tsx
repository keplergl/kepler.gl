// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {act, fireEvent, render} from '@testing-library/react';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {ThemeProvider} from 'styled-components';
import {createIntl, IntlProvider} from 'react-intl';

import {ChartType, computeChart, createBarChart, createBigNumberChart} from '@kepler.gl/charts';
import {VisStateActions} from '@kepler.gl/actions';
import {INITIAL_VIS_STATE, visStateReducer, visStateUpdaters} from '@kepler.gl/reducers';
import {ChartsSchema, chartPropsV1, VisState} from '@kepler.gl/schemas';
import {KeplerTable} from '@kepler.gl/table';
import {theme} from '@kepler.gl/styles';
import {messages} from '@kepler.gl/localization';
import {renderWithTheme} from 'test/helpers/component-jest-utils';

import {ChartPanelContentFactory} from './chart-panel';
import ChartManagerFactory, {ChartManagerState} from './chart-manager';

jest.mock('@kepler.gl/charts', () => {
  const actual = jest.requireActual('@kepler.gl/charts');
  return {...actual, computeChart: jest.fn(actual.computeChart)};
});

jest.mock('../../side-panel/common/source-data-selector', () => {
  const SourceDataSelectorFactory = () => () => null;
  SourceDataSelectorFactory.deps = [];
  return {__esModule: true, default: SourceDataSelectorFactory};
});

const EmptyControl = () => null;
const ChartPanelContent = ChartPanelContentFactory(
  EmptyControl as any,
  EmptyControl as any,
  EmptyControl as any,
  EmptyControl as any
);
const chart = createBigNumberChart({id: 'chart-1', title: 'Rows', pinned: true});

function renderChartPanel(hidePinAction: boolean) {
  return renderWithTheme(
    <IntlProvider locale="en" messages={messages.en}>
      <ChartPanelContent
        charts={[chart]}
        datasets={{}}
        layers={[]}
        readOnly
        hidePinAction={hidePinAction}
      />
    </IntlProvider>
  );
}

describe('ChartPanelContent', () => {
  test('keeps ordinary pinned charts dismissible', () => {
    const {getByLabelText, getByText} = renderChartPanel(false);

    expect(getByLabelText('Unpin chart')).toBeInTheDocument();
    expect(getByText('Select a dataset to plot this chart.')).toBeInTheDocument();
  });

  test('renders immutable export charts without pin actions', () => {
    const {queryByLabelText, getByText} = renderChartPanel(true);

    expect(queryByLabelText('Unpin chart')).toBeNull();
    expect(getByText('Select a dataset to plot this chart.')).toBeInTheDocument();
  });
});

const intl = createIntl({locale: 'en', messages: messages.en});
const ChartManager = ChartManagerFactory(
  ChartPanelContent,
  (({children}) => <div>{children}</div>) as any,
  EmptyControl as any
);

function makeDataset(rows = [[1], [2], [3], [4]]) {
  const dataset = new KeplerTable({info: {id: 'd1'}, color: [0, 0, 0]});
  return dataset.updateSchema({
    fields: [
      {name: 'value', type: 'integer'},
      {name: 'group', type: 'string'}
    ] as any,
    rows: rows.map((row, index) => [...row, index % 2 ? 'B' : 'A'])
  });
}

function makeState(): VisState {
  const state = {
    ...INITIAL_VIS_STATE,
    datasets: {d1: makeDataset()},
    charts: [createBigNumberChart({id: 'c1', dataId: 'd1', title: 'Rows', pinned: true})]
  };
  return visStateUpdaters.createOrUpdateFilterUpdater(state, {
    id: 'range',
    dataId: 'd1',
    field: 'value',
    value: [1, 3]
  });
}

function renderManager(initialState = makeState(), initialProps: Partial<ChartManagerState> = {}) {
  const store = createStore(
    (state: {visState: VisState} = {visState: initialState}, action: any) => ({
      visState:
        action.type === 'replace' ? action.visState : visStateReducer(state.visState, action)
    })
  );
  const wrapper = ({children}) => (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <IntlProvider locale="en" messages={messages.en}>
          {children}
        </IntlProvider>
      </ThemeProvider>
    </Provider>
  );
  const result = render(<ChartManager intl={intl} {...initialProps} />, {wrapper});
  return {
    ...result,
    store,
    dispatch: action =>
      act(() => {
        store.dispatch(action);
      }),
    rerenderManager: (props: Partial<ChartManagerState>) =>
      result.rerender(<ChartManager intl={intl} {...props} />)
  };
}

function lastChartValue() {
  const results = jest.mocked(computeChart).mock.results;
  return results[results.length - 1].value.value;
}

describe('ChartManager reactivity', () => {
  beforeEach(() => jest.mocked(computeChart).mockClear());

  test.each([true, false])('does not aggregate on pointer moves (panelActive=%s)', panelActive => {
    const state = makeState();
    const accessor = state.datasets.d1.gpuFilter.filterValueAccessor;
    const visitRow = jest.fn();
    state.datasets.d1.gpuFilter.filterValueAccessor =
      dc =>
      (...args) => {
        const getValue = accessor(dc)(...args);
        return (...valueArgs) => {
          visitRow();
          return getValue(...valueArgs);
        };
      };
    const {dispatch, store, getByText} = renderManager(state, {panelActive});
    expect(getByText('3')).toBeInTheDocument();
    expect(computeChart).toHaveBeenCalledTimes(1);
    expect(visitRow).toHaveBeenCalledTimes(4);
    for (let i = 0; i < 20; i++) {
      dispatch(VisStateActions.onMouseMove({point: [i, i], lngLat: [i, i]} as any));
    }
    expect(store.getState().visState.mousePos.mousePosition).toEqual([19, 19]);
    expect(computeChart).toHaveBeenCalledTimes(1);
    expect(visitRow).toHaveBeenCalledTimes(4);
    expect(getByText('3')).toBeInTheDocument();
  });

  test('updates GPU filters, playback values, chart options, and dataset replacement', () => {
    const {dispatch, store, getByText} = renderManager();
    expect(getByText('3')).toBeInTheDocument();
    dispatch(VisStateActions.setFilter(0, 'value', [2, 3]));
    expect(getByText('2')).toBeInTheDocument();
    dispatch(VisStateActions.setFilterAnimationTime(0, 'value', [3, 3]));
    expect(getByText('1')).toBeInTheDocument();
    dispatch(VisStateActions.updateChart('c1', {applyFilters: false}));
    expect(getByText('4')).toBeInTheDocument();
    dispatch({
      type: 'replace',
      visState: {...store.getState().visState, datasets: {d1: makeDataset([[5], [6]])}}
    });
    expect(getByText('2')).toBeInTheDocument();
    expect(computeChart).toHaveBeenCalledTimes(5);
  });

  test('updates CPU filters and layer-dependent filter inputs', () => {
    const {dispatch, store, getByText} = renderManager();
    dispatch(VisStateActions.createOrUpdateFilter('category', 'd1', 'group', ['A']));
    expect(getByText('2')).toBeInTheDocument();
    dispatch(VisStateActions.setFilter(1, 'value', ['B']));
    expect(getByText('1')).toBeInTheDocument();
    dispatch(VisStateActions.removeFilter(1));
    expect(getByText('3')).toBeInTheDocument();
    const calls = jest.mocked(computeChart).mock.calls.length;
    dispatch({type: 'replace', visState: {...store.getState().visState, layers: []}});
    expect(computeChart).toHaveBeenCalledTimes(calls + 1);
    expect(getByText('3')).toBeInTheDocument();
  });

  test('keeps pinned visibility, panel controls, and immutable export responsive', () => {
    const {dispatch, rerenderManager, getByLabelText, queryByText, getByText, queryByLabelText} =
      renderManager(makeState(), {panelActive: false});
    fireEvent.click(getByLabelText('Unpin chart'));
    expect(queryByText('Rows')).toBeNull();
    rerenderManager({panelActive: true});
    expect(getByLabelText('Pin chart')).toBeInTheDocument();
    fireEvent.click(getByLabelText('Pin chart'));
    expect(getByLabelText('Unpin chart')).toBeInTheDocument();
    rerenderManager({panelActive: false, isExport: true});
    expect(getByText('Rows')).toBeInTheDocument();
    expect(queryByLabelText('Unpin chart')).toBeNull();
    dispatch(VisStateActions.updateChart('c1', {title: 'Updated rows', pinned: false}));
    expect(getByText('Updated rows')).toBeInTheDocument();
    dispatch(VisStateActions.removeChart('c1'));
    expect(queryByText('Updated rows')).toBeNull();
  });

  test('ignores unrelated parent renders and store changes with explicit visState', () => {
    const visState = makeState();
    const {dispatch, rerenderManager, getByText} = renderManager(makeState(), {visState});
    expect(getByText('3')).toBeInTheDocument();
    rerenderManager({
      visState: {...visState, mousePos: {...visState.mousePos, mousePosition: [2, 3]}}
    });
    expect(computeChart).toHaveBeenCalledTimes(1);
    dispatch(VisStateActions.setFilter(0, 'value', [2, 3]));
    expect(computeChart).toHaveBeenCalledTimes(1);
    rerenderManager({visState: {...visState, datasets: {d1: makeDataset([[5], [6]])}}});
    expect(getByText('2')).toBeInTheDocument();
    expect(lastChartValue()).toBe(2);
  });

  test('handles missing state inputs and later hydration', () => {
    const {dispatch, store, getByText, queryByText} = renderManager({} as VisState, {
      panelActive: false
    });
    expect(queryByText('Rows')).toBeNull();
    dispatch({type: 'replace', visState: makeState()});
    expect(getByText('3')).toBeInTheDocument();
    dispatch({type: 'replace', visState: {...store.getState().visState, datasets: {}}});
    expect(getByText('Select a dataset to plot this chart.')).toBeInTheDocument();
  });
});

describe('time chart bin selection', () => {
  const start = Date.UTC(2020, 0, 1);
  const schema = new ChartsSchema({version: 'v1', properties: chartPropsV1});

  function makeTimeState(horizontal: boolean): VisState {
    const dataset = new KeplerTable({info: {id: 'd1'}, color: [0, 0, 0]}).updateSchema({
      fields: [{name: 'time', type: 'timestamp'}] as any,
      rows: Array.from({length: 31}, (_, i) => [start + i * 1000])
    });
    const timeAxis = {field: {name: 'time', type: 'timestamp'}, aggregation: 'timeBin'} as const;
    const valueAxis = {field: null, aggregation: 'count'} as const;
    const bar = createBarChart({
      id: 'time-bars',
      dataId: 'd1',
      pinned: true,
      xAxis: horizontal ? valueAxis : timeAxis,
      yAxis: horizontal ? timeAxis : valueAxis
    });
    return {
      ...INITIAL_VIS_STATE,
      datasets: {d1: dataset},
      charts: [
        {...bar, type: horizontal ? ChartType.horizontalBar : ChartType.barChart},
        createBigNumberChart({id: 'count', dataId: 'd1', pinned: true})
      ]
    };
  }

  test.each([false, true])('selects and restores distinct ranges (horizontal=%s)', horizontal => {
    const {container, store, dispatch, getByText} = renderManager(makeTimeState(horizontal));
    const bars = () =>
      Array.from(
        container.querySelectorAll(
          '.bar-chart [role="button"], .horizontal-bar-chart [role="button"]'
        )
      );
    expect(bars()).toHaveLength(10);
    expect(getByText('31')).toBeInTheDocument();
    fireEvent.click(bars()[0]);
    let state = store.getState().visState;
    expect(state.filters[0].value).toEqual([start, start + 3000]);
    const firstKey = state.charts[0].crossFilter?.value?.x;
    expect(bars().filter(bar => bar.getAttribute('aria-pressed') === 'true')).toEqual([bars()[0]]);
    expect(bars()).toHaveLength(10);
    // Existing range filters include both endpoints; changing that is a separate issue.
    expect(lastChartValue()).toBe(4);

    fireEvent.click(bars()[1]);
    state = store.getState().visState;
    expect(state.filters).toHaveLength(1);
    expect(state.filters[0].value).toEqual([start + 3000, start + 6000]);
    expect(state.charts[0].crossFilter?.value?.x).not.toEqual(firstKey);
    expect(bars().filter(bar => bar.getAttribute('aria-pressed') === 'true')).toEqual([bars()[1]]);

    const saved = JSON.parse(JSON.stringify(schema.save(state.charts)));
    const loaded = schema.load(saved.charts).charts;
    expect(loaded[0].crossFilter).toEqual(state.charts[0].crossFilter);
    dispatch({type: 'replace', visState: {...state, charts: loaded}});
    expect(bars()[1]).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(bars()[1]);
    expect(store.getState().visState.filters).toHaveLength(0);
    expect(getByText('31')).toBeInTheDocument();

    fireEvent.click(bars()[9]);
    state = store.getState().visState;
    expect(state.charts[0].crossFilter?.value?.x).toBe('2020-01-01 00:00 – 2020-01-01 00:00');
    expect(state.filters[0].value).toEqual([start + 27000, start + 30000]);
    const legacy = schema.load(JSON.parse(JSON.stringify(schema.save(state.charts))).charts).charts;
    dispatch({type: 'replace', visState: {...state, charts: legacy}});
    expect(bars()[9]).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(bars()[9]);
    expect(store.getState().visState.filters).toHaveLength(0);
  });
});
