// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, render} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';
import {Bin, LineChart, LineChartSeries} from '@kepler.gl/types';
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

describe('LineChart time-bin endpoints', () => {
  const bins = (bounds: number[][]): Bin[] =>
    bounds.map(([x0, x1]) => ({x0, x1, count: 1, indexes: [0]}));

  test('extends the final aggregate to its bin end without changing hover observations or source data', () => {
    const source = chart(
      [
        [
          {x: 20, y: 20},
          {x: 80, y: 80}
        ]
      ],
      {
        bins: bins([
          [20, 80],
          [80, 100]
        ])
      }
    );
    const original = JSON.stringify(source);
    const {container, svg, onMouseMove} = setup({
      isTime: true,
      width: 240,
      range: [0, 120],
      lineChart: source
    });
    // The bin ends at x=100 (200px), before the viewport ends at x=120 (240px).
    expect(requiredElement(container, 'path').getAttribute('d')).toBe('M40,90L160,30L200,30');
    fireEvent.mouseMove(svg, {clientX: 205});
    expect(onMouseMove).toHaveBeenLastCalledWith(expect.objectContaining({x: 80, y: 80}));
    expect(JSON.stringify(source)).toBe(original);
  });

  test('extends grouped segments independently without filling missing bins, including a single-bin segment', () => {
    const lines = [
      [
        {x: 0, y: 20},
        {x: 20, y: 30}
      ],
      [{x: 60, y: 40}],
      [{x: 40, y: 60}],
      [],
      [{x: 80, y: null}]
    ];
    const {container} = setup({
      isTime: true,
      lineChart: chart(lines, {
        bins: bins([
          [0, 20],
          [20, 40],
          [40, 60],
          [60, 80],
          [80, 100]
        ]),
        series: makeSeries(lines, {colors: ['red', 'red', 'blue'], names: ['A', 'A', 'B']})
      })
    });
    const paths = Array.from(container.querySelectorAll('path'));
    expect(paths.map(path => path.getAttribute('stroke'))).toEqual(['red', 'red', 'blue']);
    const expected = [
      [
        [0, 90],
        [40, 80],
        [80, 80]
      ],
      [
        [120, 70],
        [160, 70]
      ],
      [
        [80, 50],
        [120, 50]
      ]
    ];
    paths.forEach((path, index) => {
      const points = path
        .getAttribute('d')!
        .slice(1)
        .split('L')
        .map(point => point.split(',').map(Number));
      expect(points.map(point => point[0])).toEqual(expected[index].map(point => point[0]));
      points.forEach((point, pointIndex) =>
        expect(point[1]).toBeCloseTo(expected[index][pointIndex][1])
      );
    });
    expect(container.querySelectorAll('circle')).toHaveLength(0);
  });

  test('does not extend a segment whose terminal value is null', () => {
    const {container} = setup({
      isTime: true,
      lineChart: chart(
        [
          [
            {x: 20, y: 20},
            {x: 80, y: null}
          ]
        ],
        {
          bins: bins([
            [20, 80],
            [80, 100]
          ])
        }
      )
    });
    expect(container.querySelectorAll('path')).toHaveLength(0);
    const dot = requiredElement(container, 'circle');
    expect(dot.getAttribute('cx')).toBe('40');
    expect(dot.getAttribute('cy')).toBe('90');
  });

  test.each<{name: string; isTime: boolean; bins?: LineChart['bins']}>([
    {name: 'numeric charts', isTime: false, bins: bins([[80, 100]])},
    {name: 'unbinned time charts', isTime: true},
    {name: 'empty bins', isTime: true, bins: []},
    {name: 'dataset-keyed bins', isTime: true, bins: {data: bins([[80, 100]])}},
    {name: 'unmatched bins', isTime: true, bins: bins([[60, 80]])},
    {name: 'nonfinite bin ends', isTime: true, bins: bins([[80, Infinity]])},
    {name: 'non-increasing bins', isTime: true, bins: bins([[80, 80]])}
  ])('preserves endpoints for $name', ({isTime, bins: sourceBins}) => {
    const {container} = setup({
      isTime,
      lineChart: chart(
        [
          [
            {x: 20, y: 20},
            {x: 80, y: 80}
          ]
        ],
        {bins: sourceBins}
      )
    });
    expect(requiredElement(container, 'path').getAttribute('d')).toBe('M40,90L160,30');
  });

  test('auto-ranges Y to the final aggregate when the selection lies inside its bin', () => {
    const {container, update} = setup({
      isTime: true,
      isEnlarged: true,
      yAxisAutoRange: true,
      value: [85, 95],
      lineChart: chart(
        [
          [
            {x: 0, y: 2000},
            {x: 40, y: 10},
            {x: 80, y: 20}
          ]
        ],
        {
          bins: bins([
            [0, 40],
            [40, 80],
            [80, 100]
          ]),
          yDomain: [0, 2000]
        }
      )
    });
    const ticks = () =>
      Array.from(container.querySelectorAll('.line-chart__axis-tick'), tick =>
        Number(tick.textContent)
      );
    expect(ticks()).toEqual([20]);
    update({isTime: false});
    expect(ticks()).toEqual([0, 1000, 2000]);
  });

  test('Fit Y keeps grouped segments visible when the selection lies between their endpoints', () => {
    const lines = [
      [{x: 0, y: 10}],
      [{x: 0, y: 20}],
      [
        {x: 0, y: 100},
        {x: 20, y: 120}
      ]
    ];
    const {container} = setup({
      isTime: true,
      isEnlarged: true,
      yAxisAutoRange: true,
      range: [0, 40],
      value: [5, 15],
      lineChart: chart(lines, {
        xDomain: [0, 40],
        yDomain: [10, 120],
        bins: bins([
          [0, 20],
          [20, 40]
        ]),
        series: makeSeries(lines, {colors: ['red', 'orange', 'blue'], names: ['A', 'C', 'B']})
      })
    });
    expect(
      Array.from(container.querySelectorAll('.line-chart__axis-tick'), tick =>
        Number(tick.textContent)
      )
    ).toEqual([0, 50, 100]);
    const points = requiredElement(container, 'path[stroke="blue"]')
      .getAttribute('d')!
      .slice(1)
      .split('L')
      .map(point => point.split(',').map(Number));
    for (const [, y] of points) {
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(120);
    }
  });

  test.each([
    {name: 'a selection inside a bin', value: [25, 35], ticks: [10, 15, 20]},
    {name: 'a selection starting at a bin boundary', value: [20, 39], ticks: [10, 15, 20]},
    {name: 'a point selection at a bin boundary', value: [20, 20], ticks: [10, 15, 20]},
    {name: 'a selection ending at a real observation', value: [20, 40], ticks: [0, 500, 1000]}
  ])('Fit Y uses the correct grouped segments for $name', ({value, ticks}) => {
    const lines = [[{x: 20, y: 10}], [{x: 20, y: 20}], [{x: 0, y: 1000}], [{x: 40, y: 1000}]];
    const {container} = setup({
      isTime: true,
      isEnlarged: true,
      yAxisAutoRange: true,
      value,
      lineChart: chart(lines, {
        yDomain: [10, 1000],
        bins: bins([
          [0, 20],
          [20, 40],
          [40, 60]
        ]),
        series: makeSeries(lines, {
          colors: ['red', 'orange', 'blue', 'blue'],
          names: ['A', 'C', 'B', 'B']
        })
      })
    });
    expect(
      Array.from(container.querySelectorAll('.line-chart__axis-tick'), tick =>
        Number(tick.textContent)
      )
    ).toEqual(ticks);
  });
});

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
