// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {render, screen} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';
import {ColumnStatsType} from '@kepler.gl/utils';
import type {HistogramPlotProps} from '../histogram-plot';
import ColumnStatisticsNumericFactory, {
  ColumnStatisticsNumericProps
} from './column-statistics-numeric';
import ColumnStatisticsTimeFactory, {ColumnStatisticsTimeProps} from './column-statistics-time';
import ColumnStatisticsCategorical from './column-statistics-categoric';

function renderWithTheme(element: React.ReactElement) {
  return render(element, {
    wrapper: ({children}) => <ThemeProvider theme={theme}>{children}</ThemeProvider>
  });
}

const histogram = jest.fn((_props: HistogramPlotProps) => null);
const Numeric = ColumnStatisticsNumericFactory(histogram);
const Time = ColumnStatisticsTimeFactory(histogram);
const numeric: ColumnStatisticsNumericProps = {
  type: ColumnStatsType.numeric,
  bins: [],
  quantiles: [],
  mean: 0,
  std: 0,
  percentNulls: 0
};
const time: ColumnStatisticsTimeProps = {
  type: ColumnStatsType.time,
  bins: [],
  min: 0,
  max: 86400000,
  percentNulls: 0,
  format: 'YYYY-MM-DD HH:mm:ss'
};
const valueFor = (label: string) => screen.getByText(label).nextElementSibling?.textContent;
const histogramProps = () => histogram.mock.calls[histogram.mock.calls.length - 1][0];

beforeEach(() => histogram.mockClear());

test('numeric summaries preserve zero means, deviations and null percentages', () => {
  renderWithTheme(<Numeric {...numeric} />);
  expect(valueFor('Mean')).toBe('0');
  expect(valueFor('Std. Dev.')).toBe('0');
  expect(valueFor('Nulls')).toBe('0.0%');
});

test('missing numeric summaries do not masquerade as zero or NaN', () => {
  renderWithTheme(<Numeric {...numeric} mean={null} std={null} percentNulls={null} />);
  expect(valueFor('Mean')).toBeUndefined();
  expect(valueFor('Std. Dev.')).toBeUndefined();
  expect(valueFor('Nulls')).toBeUndefined();
  expect(screen.queryByText('NaN')).not.toBeInTheDocument();
});

test('quantiles preserve integers, round fractional values and omit absent values', () => {
  renderWithTheme(
    <Numeric
      {...numeric}
      quantiles={[
        {label: 'Minimum', value: -2},
        {label: 'Median', value: 0},
        {label: 'Upper quartile', value: 1.234567},
        {label: 'Maximum', value: null}
      ]}
    />
  );
  expect(valueFor('Minimum')).toBe('-2');
  expect(valueFor('Median')).toBe('0');
  expect(valueFor('Upper quartile')).toBe('1.2346');
  expect(valueFor('Maximum')).toBeUndefined();
});

test('refreshing numeric statistics replaces summaries and removed quantiles', () => {
  const view = renderWithTheme(<Numeric {...numeric} quantiles={[{label: 'Median', value: 3}]} />);
  view.rerender(<Numeric {...numeric} mean={12.5} std={2.5} percentNulls={0.125} quantiles={[]} />);
  expect(valueFor('Mean')).toBe('12.5');
  expect(valueFor('Std. Dev.')).toBe('2.5');
  expect(valueFor('Nulls')).toBe('12.5%');
  expect(screen.queryByText('Median')).not.toBeInTheDocument();
});

test('numeric histogram inputs remain stable for summary-only changes and update for new bins', () => {
  const view = renderWithTheme(<Numeric {...numeric} />);
  const initial = histogramProps().histogramsByGroup;
  expect(initial).toEqual({bins: numeric.bins});
  expect(histogramProps().value).toEqual([-Infinity, Infinity]);
  view.rerender(<Numeric {...numeric} mean={5} />);
  expect(histogramProps().histogramsByGroup).toBe(initial);
  const bins: ColumnStatisticsNumericProps['bins'] = [
    {x0: 0, x1: 1, count: 4, indexes: [0, 1, 2, 3]}
  ];
  view.rerender(<Numeric {...numeric} bins={bins} />);
  expect(histogramProps().histogramsByGroup).not.toBe(initial);
  expect(histogramProps().histogramsByGroup?.bins).toBe(bins);
});

test('time summaries render the Unix epoch and pre-epoch values in UTC', () => {
  renderWithTheme(<Time {...time} min={-1000} max={0} />);
  expect(valueFor('Start')).toBe('1969-12-31 23:59:59');
  expect(valueFor('End')).toBe('1970-01-01 00:00:00');
  expect(valueFor('Nulls')).toBe('0.0%');
});

test('changing a time display format refreshes both endpoints without rebuilding histogram data', () => {
  const view = renderWithTheme(<Time {...time} />);
  const initial = histogramProps().histogramsByGroup;
  view.rerender(<Time {...time} format="YYYY/MM/DD" />);
  expect(valueFor('Start')).toBe('1970/01/01');
  expect(valueFor('End')).toBe('1970/01/02');
  expect(histogramProps().histogramsByGroup).toBe(initial);
  expect(histogramProps().value).toEqual([-Infinity, Infinity]);
});

test('empty time statistics clear previously displayed date and null summaries', () => {
  const view = renderWithTheme(<Time {...time} />);
  view.rerender(<Time {...time} min={null} max={null} percentNulls={null} />);
  expect(valueFor('Start')).toBeUndefined();
  expect(valueFor('End')).toBeUndefined();
  expect(valueFor('Nulls')).toBeUndefined();
  expect(screen.queryByText('1970-01-01 00:00:00')).not.toBeInTheDocument();
});

test('categorical statistics update the distinct count and percentage after data changes', () => {
  const view = renderWithTheme(
    <ColumnStatisticsCategorical
      type={ColumnStatsType.categorical}
      uniqueValues={0}
      percentNulls={0}
    />
  );
  expect(screen.getByText('0')).toBeInTheDocument();
  expect(valueFor('Nulls')).toBe('0.0%');
  view.rerender(
    <ColumnStatisticsCategorical
      type={ColumnStatsType.categorical}
      uniqueValues={3}
      percentNulls={1 / 3}
    />
  );
  expect(screen.getByText('3')).toBeInTheDocument();
  expect(screen.queryByText('0')).not.toBeInTheDocument();
  expect(valueFor('Nulls')).toBe('33.3%');
});

test('categorical statistics distinguish unknown null counts from a fully null column', () => {
  const view = renderWithTheme(
    <ColumnStatisticsCategorical
      type={ColumnStatsType.categorical}
      uniqueValues={0}
      percentNulls={null}
    />
  );
  expect(valueFor('Nulls')).toBeUndefined();
  view.rerender(
    <ColumnStatisticsCategorical
      type={ColumnStatsType.categorical}
      uniqueValues={0}
      percentNulls={1}
    />
  );
  expect(valueFor('Nulls')).toBe('100.0%');
});
