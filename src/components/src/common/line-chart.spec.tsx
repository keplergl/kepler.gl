// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, render} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';
import {LineChart, LineChartSeries} from '@kepler.gl/types';
import LineChartFactory from './line-chart';

const Chart = LineChartFactory();
type Props = React.ComponentProps<typeof Chart>;
function requiredElement<T extends Element>(container: Element, selector: string): T {
  const element = container.querySelector<T>(selector);
  if (!element) throw new Error(`Missing chart element: ${selector}`);
  return element;
}
type TestPoint = {x: number; y: number | null};
const makeSeries = (
  lines: TestPoint[][],
  extra: Partial<LineChartSeries> = {}
): LineChartSeries => ({
  // Runtime gaps are handled by the chart even though LineDatum declares y as non-null.
  lines: lines.map(line =>
    line.map(point => ({...point, delta: '', pct: null}))
  ) as LineChartSeries['lines'],
  markers: [],
  ...extra
});
const chart = (lines: TestPoint[][], extra: Partial<LineChart> = {}): LineChart => ({
  series: makeSeries(lines),
  xDomain: [0, 100],
  yDomain: [0, 100],
  aggregation: 'sum',
  interval: null,
  yAxis: 'value',
  ...extra
});

function setup(overrides: Partial<Props> = {}) {
  let props: Props = {
    width: 200,
    height: 120,
    margin: {top: 0},
    isTime: false,
    enableChartHover: true,
    onMouseMove: jest.fn(),
    lineChart: chart([
      [
        {x: 20, y: 20},
        {x: 80, y: 80}
      ]
    ]),
    ...overrides
  };
  const view = () => (
    <ThemeProvider theme={theme}>
      <Chart {...props} />
    </ThemeProvider>
  );
  const result = render(view());
  return {
    ...result,
    onMouseMove: props.onMouseMove as jest.Mock,
    svg: requiredElement<SVGSVGElement>(result.container, 'svg'),
    update(updates: Partial<Props>) {
      props = {...props, ...updates};
      result.rerender(view());
    }
  };
}

afterEach(() => jest.restoreAllMocks());

describe('LineChart hover interactions', () => {
  test('chooses the nearest shared x across series, skipping nulls and anchoring the highest value', () => {
    const lines = [
      [
        {x: 20, y: 5},
        {x: 60, y: null}
      ],
      [
        {x: 25, y: 10},
        {x: 60, y: 30}
      ],
      [
        {x: 25, y: 40},
        {x: 60, y: 20}
      ],
      []
    ];
    const {svg, onMouseMove} = setup({
      lineChart: chart(lines, {
        series: makeSeries(lines, {colors: ['red', 'green', 'blue'], names: ['A', 'B', 'C']})
      })
    });
    jest.spyOn(svg, 'getBoundingClientRect').mockReturnValue({left: 100} as DOMRect);
    fireEvent.mouseMove(svg, {clientX: 152});
    expect(onMouseMove).toHaveBeenLastCalledWith({
      x: 25,
      y: 40,
      color: 'blue',
      name: 'C',
      points: [
        {x: 25, y: 10, color: 'green', name: 'B'},
        {x: 25, y: 40, color: 'blue', name: 'C'}
      ]
    });
    fireEvent.mouseMove(svg, {clientX: 219});
    expect(onMouseMove).toHaveBeenLastCalledWith(
      expect.objectContaining({
        x: 60,
        y: 30,
        points: [
          {x: 60, y: 30, color: 'green', name: 'B'},
          {x: 60, y: 20, color: 'blue', name: 'C'}
        ]
      })
    );
    fireEvent.mouseLeave(svg);
    expect(onMouseMove).toHaveBeenLastCalledWith(null);
  });

  test('uses the displayed time range and finds endpoint points outside the data extent', () => {
    const {svg, onMouseMove} = setup({isTime: true, range: [20, 80]});
    fireEvent.mouseMove(svg, {clientX: -10});
    expect(onMouseMove).toHaveBeenLastCalledWith(expect.objectContaining({x: 20, y: 20}));
    fireEvent.mouseMove(svg, {clientX: 190});
    expect(onMouseMove).toHaveBeenLastCalledWith(expect.objectContaining({x: 80, y: 80}));
  });

  test('suppresses hover while disabled or markers own interaction, and clears an empty chart', () => {
    const {svg, onMouseMove, update} = setup({enableChartHover: false});
    fireEvent.mouseMove(svg, {clientX: 50});
    expect(onMouseMove).not.toHaveBeenCalled();
    update({
      enableChartHover: true,
      lineChart: chart([], {
        series: makeSeries([[{x: 20, y: 20}]], {
          markers: [{x: 20, y: 20, delta: '', pct: null}]
        })
      })
    });
    fireEvent.mouseMove(svg, {clientX: 50});
    expect(onMouseMove).not.toHaveBeenCalled();
    update({lineChart: chart([[], [{x: 20, y: null}]])});
    fireEvent.mouseMove(svg, {clientX: 50});
    expect(onMouseMove).toHaveBeenLastCalledWith(null);
  });
});

describe('LineChart viewport scaling', () => {
  const lines = [
    [
      {x: 0, y: 1000},
      {x: 20, y: 10},
      {x: 40, y: 20},
      {x: 60, y: 30},
      {x: 80, y: 2000}
    ]
  ];

  test('auto range includes adjacent segment endpoints but excludes distant outliers', () => {
    const {container, update} = setup({
      lineChart: chart(lines, {yDomain: [0, 2000]}),
      value: [39, 41],
      yAxisAutoRange: true,
      isEnlarged: true
    });
    const ticks = () =>
      Array.from(container.querySelectorAll('.line-chart__axis-tick'), n => Number(n.textContent));
    expect(ticks()).toEqual([10, 20, 30]);
    update({value: [90, 100]});
    expect(ticks()).toEqual([0, 1000, 2000]);
    update({value: [39, 41], yAxisAutoRange: false});
    expect(ticks()).toEqual([0, 1000, 2000]);
  });

  test('derives a missing domain from non-null values and renders isolated points', () => {
    const {container} = setup({
      lineChart: chart([[{x: 20, y: null}], [{x: 40, y: 10}], [{x: 60, y: 30}]], {yDomain: []}),
      isEnlarged: true
    });
    expect(
      Array.from(container.querySelectorAll('.line-chart__axis-tick'), n => Number(n.textContent))
    ).toEqual([10, 20, 30]);
    expect(container.querySelectorAll('path')).toHaveLength(0);
    expect(container.querySelectorAll('circle')).toHaveLength(2);
  });
});

describe('LineChart hover hint', () => {
  test('shows every series value and hides the hint during brushing or when hover is disabled', () => {
    jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(80);
    jest.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(40);
    const points = [
      {x: 80, y: 20, name: 'A', color: 'red'},
      {x: 80, y: 80, name: 'B', color: 'blue'}
    ];
    const {container, update} = setup({hoveredDP: {...points[1], points}});
    expect(Array.from(container.querySelectorAll('.hint--series'), n => n.textContent)).toEqual([
      'A20',
      'B80'
    ]);
    expect(container.querySelectorAll('circle[r="4"]')).toHaveLength(2);
    const hint = requiredElement<HTMLElement>(container, 'div[style*="position: absolute"]');
    // Near the right edge and top: flip left and below to keep the hint inside the plot.
    expect(hint.style.left).toBe('74px');
    expect(hint.style.top).toBe('36px');
    update({brushing: true});
    expect(container.querySelector('.hint--x')).toBeNull();
    update({brushing: false, enableChartHover: false});
    expect(container.querySelector('.hint--x')).toBeNull();
    update({enableChartHover: true, hoveredDP: null});
    expect(container.querySelectorAll('circle[r="4"]')).toHaveLength(0);
    expect(container.querySelector('.hint--x')).toBeNull();
  });

  test('clamps an out-of-range anchor without changing the displayed value', () => {
    jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(250);
    jest.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(118);
    const {container} = setup({hoveredDP: {x: 5, y: 500, name: 'Peak'}});
    expect(requiredElement(container, '.row').textContent).toBe('500');
    const hint = requiredElement<HTMLElement>(container, 'div[style*="position: absolute"]');
    expect(hint.style.left).toBe('0px');
    expect(hint.style.top).toBe('2px');
  });
});
