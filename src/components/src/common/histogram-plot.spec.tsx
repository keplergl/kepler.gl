// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {hcl} from 'd3-color';
import {theme} from '@kepler.gl/styles';
import {Bin} from '@kepler.gl/types';
import HistogramPlotFactory, {HistogramPlotProps, HISTOGRAM_MASK_MODE} from './histogram-plot';

const HistogramPlot = HistogramPlotFactory();
const bins: Bin[] = [
  {
    count: 4,
    indexes: [0, 1, 2, 3],
    x0: 0,
    x1: 1,
    segments: [
      {name: 'A', color: '#ff0000', count: 1},
      {name: 'B', color: '#0000ff', count: 3}
    ]
  },
  {
    count: 2,
    indexes: [4, 5],
    x0: 1,
    x1: 2,
    segments: [{name: 'A', color: '#ff0000', count: 1}]
  }
];
const histogramsByGroup = {data: bins};
const range = [0, 2];

function plot(overrides: Partial<HistogramPlotProps> = {}) {
  return (
    <ThemeProvider theme={theme}>
      <HistogramPlot
        width={200}
        height={100}
        margin={{top: 0, bottom: 0, left: 0, right: 0}}
        range={range}
        value={[0, 1]}
        histogramsByGroup={histogramsByGroup}
        isRanged
        isTime={false}
        brushComponent={<g className="test-brush" />}
        {...overrides}
      />
    </ThemeProvider>
  );
}

function setup(overrides: Partial<HistogramPlotProps> = {}) {
  return render(plot(overrides));
}

function geometry(rect: Element) {
  return Object.fromEntries(
    ['x', 'y', 'width', 'height'].map(name => [name, Number(rect.getAttribute(name))])
  );
}

function setPlotBounds(svg: SVGSVGElement, width = 400) {
  jest.spyOn(svg, 'getBoundingClientRect').mockReturnValue({
    x: 20,
    y: 30,
    left: 20,
    top: 30,
    right: 20 + width,
    bottom: 230,
    width,
    height: 200,
    toJSON: () => ({})
  });
}

function hover(target: Element, x: number, y = 75, buttons = 0) {
  fireEvent.mouseMove(target, {clientX: 20 + x * 2, clientY: 30 + y * 2, buttons});
}

async function expectNoTooltip() {
  await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
}

describe('HistogramPlot categorical bins', () => {
  test('stacks category counts proportionally while retaining the total bin height', () => {
    const original = JSON.stringify(bins);
    const {container} = setup();
    const bars = container.querySelectorAll('.histogram-bars > rect');
    const segments = container.querySelectorAll('.histogram-segment');

    expect(geometry(bars[0])).toEqual({x: 15, y: 0, width: 70, height: 0});
    expect(geometry(segments[0])).toEqual({x: 15, y: 75, width: 70, height: 25});
    expect(geometry(segments[1])).toEqual({x: 15, y: 0, width: 70, height: 75});
    // The second bin retains a neutral remainder for an uncategorized row.
    expect(geometry(bars[3])).toEqual({x: 115, y: 50, width: 70, height: 25});
    expect(geometry(segments[2])).toEqual({x: 115, y: 75, width: 70, height: 25});
    expect(Array.from(segments, segment => segment.textContent)).toEqual(['A: 1', 'B: 3', 'A: 1']);
    expect(JSON.stringify(bins)).toBe(original);
  });

  test('does not paint dataset color underneath transparent category segments', () => {
    const {container} = setup({
      histogramsByGroup: {
        data: [
          {
            count: 4,
            indexes: [0, 1, 2, 3],
            x0: 0,
            x1: 1,
            segments: [
              {name: 'Unmapped', color: 'rgba(0, 0, 0, 0)', count: 2},
              {name: 'A', color: '#ff0000', count: 1}
            ]
          }
        ]
      },
      colorsByGroup: {data: '#0000ff'}
    });
    const base = container.querySelector('.histogram-bars > rect:not(.histogram-segment)')!;
    const transparent = container.querySelector('.histogram-segment')!;
    expect(getComputedStyle(transparent).fill).toBe('rgba(0, 0, 0, 0)');
    expect(geometry(base)).toEqual({x: 15, y: 0, width: 70, height: 25});
    expect(geometry(transparent)).toEqual({x: 15, y: 50, width: 70, height: 50});
    expect(geometry(base).y + geometry(base).height).toBeLessThanOrEqual(geometry(transparent).y);
  });

  test('uses category colors and dims categories outside the selected range', () => {
    const {container} = setup();
    const segments = container.querySelectorAll('.histogram-segment');
    expect(getComputedStyle(segments[0]).fill).toBe('#ff0000');
    expect(getComputedStyle(segments[1]).fill).toBe('#0000ff');
    expect(getComputedStyle(segments[2]).fill).toBe(hcl('#ff0000').darker().toString());
  });

  test('keeps linked datasets side by side and paints the brush above clipped stacks', () => {
    const {container} = setup({histogramsByGroup: {first: bins, second: bins}});
    const groups = container.querySelectorAll('.histogram-bars');
    const first = geometry(groups[0].querySelector('.histogram-segment')!);
    const second = geometry(groups[1].querySelector('.histogram-segment')!);
    expect(first).toEqual({x: 7.5, y: 75, width: 35, height: 25});
    expect(second).toEqual({x: 57.5, y: 75, width: 35, height: 25});
    const clip = groups[0].parentElement!;
    expect(clip.getAttribute('clip-path')).toMatch(/^url\(#histogram-clip-/);
    const svgChildren = Array.from(container.querySelector('svg')!.children);
    const brushIndex = svgChildren.findIndex(child => child.querySelector('.test-brush'));
    expect(brushIndex).toBeGreaterThan(svgChildren.indexOf(clip));
  });

  test('keeps ungrouped and masked histograms unchanged and renders no empty plot', () => {
    const ungrouped = bins.map(({segments, ...bin}) => bin);
    const view = setup({histogramsByGroup: {data: ungrouped}});
    expect(view.container.querySelectorAll('.histogram-bars > rect')).toHaveLength(2);
    expect(view.container.querySelectorAll('.histogram-segment')).toHaveLength(0);
    view.unmount();

    const masked = setup({
      histogramsByGroup: {bins, filteredBins: bins},
      isMasked: HISTOGRAM_MASK_MODE.MaskWithOverlay
    });
    expect(masked.container.querySelectorAll('.histogram-segment')).toHaveLength(0);
    expect(masked.container.querySelectorAll('.overlay-histogram-bars > rect')).toHaveLength(2);
    masked.unmount();

    const empty = setup({histogramsByGroup: {data: []}});
    expect(empty.container.querySelector('svg')).toBeNull();
  });
});

describe('HistogramPlot bin tooltips', () => {
  test('shows the hovered interval, total, category counts and percentages through the brush', async () => {
    const {container} = setup({enableChartHover: true});
    const svg = container.querySelector('svg')!;
    setPlotBounds(svg);

    hover(container.querySelector('.test-brush')!, 50);

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip.querySelector('.histogram-tooltip__range')).toHaveTextContent(/0.+1/);
    expect(tooltip.querySelector('.histogram-tooltip__total')).toHaveTextContent('Count: 4');
    const rows = tooltip.querySelectorAll('.histogram-tooltip__row');
    expect(rows).toHaveLength(2);
    expect(within(rows[0] as HTMLElement).getByText('A')).toBeInTheDocument();
    expect(within(rows[0] as HTMLElement).getByText('1')).toBeInTheDocument();
    expect(within(rows[0] as HTMLElement).getByText('25%')).toBeInTheDocument();
    expect(within(rows[1] as HTMLElement).getByText('B')).toBeInTheDocument();
    expect(within(rows[1] as HTMLElement).getByText('3')).toBeInTheDocument();
    expect(within(rows[1] as HTMLElement).getByText('75%')).toBeInTheDocument();

    hover(svg, 150);
    expect(tooltip.querySelector('.histogram-tooltip__range')).toHaveTextContent(/1.+2/);
    expect(tooltip.querySelector('.histogram-tooltip__total')).toHaveTextContent('Count: 2');
    const remainder = within(tooltip)
      .getByText('Other / missing')
      .closest('.histogram-tooltip__row')!;
    expect(within(remainder as HTMLElement).getByText('1')).toBeInTheDocument();
    expect(within(remainder as HTMLElement).getByText('50%')).toBeInTheDocument();
  });

  test('shows totals without category rows for plain bins and rounds category percentages', async () => {
    const plainBins = bins.map(({segments, ...bin}) => bin);
    const view = setup({enableChartHover: true, histogramsByGroup: {data: plainBins}});
    setPlotBounds(view.container.querySelector('svg')!);
    hover(view.container.querySelector('svg')!, 50);
    const plainTooltip = await screen.findByRole('tooltip');
    expect(plainTooltip.querySelector('.histogram-tooltip__total')).toHaveTextContent('Count: 4');
    expect(plainTooltip.querySelectorAll('.histogram-tooltip__row')).toHaveLength(0);
    view.unmount();

    const thirds = setup({
      enableChartHover: true,
      histogramsByGroup: {
        data: [{...bins[0], count: 3, segments: [{name: 'A', color: '#ff0000', count: 1}]}]
      }
    });
    setPlotBounds(thirds.container.querySelector('svg')!);
    hover(thirds.container.querySelector('svg')!, 50);
    const groupedTooltip = await screen.findByRole('tooltip');
    expect(within(groupedTooltip).getByText('33.3%')).toBeInTheDocument();
    expect(within(groupedTooltip).getByText('66.7%')).toBeInTheDocument();
  });

  test('identifies the drawn bar and dataset with offset and scaled SVG bounds', async () => {
    const {container} = setup({
      enableChartHover: true,
      histogramsByGroup: {first: bins, second: [{...bins[0], count: 8, segments: undefined}]},
      datasets: {first: {label: 'First dataset'}, second: {label: 'Second dataset'}}
    });
    const svg = container.querySelector('svg')!;
    setPlotBounds(svg);

    hover(svg, 25);
    let tooltip = await screen.findByRole('tooltip');
    expect(within(tooltip).getByText('First dataset')).toBeInTheDocument();
    expect(tooltip.querySelector('.histogram-tooltip__total')).toHaveTextContent('Count: 4');

    hover(svg, 75);
    tooltip = await screen.findByRole('tooltip');
    expect(within(tooltip).getByText('Second dataset')).toBeInTheDocument();
    expect(tooltip.querySelector('.histogram-tooltip__total')).toHaveTextContent('Count: 8');

    hover(svg, 50);
    await expectNoTooltip();
    hover(svg, 25, 25);
    await expectNoTooltip();
  });

  test('finds the last painted visible bar when dense bins overlap several intervals', async () => {
    const denseBins = Array.from({length: 200}, (_, index) => ({
      x0: index,
      x1: index + 1,
      count: index === 0 ? 10 : (index % 10) + 1,
      indexes: []
    }));
    const {container} = setup({
      enableChartHover: true,
      width: 20,
      range: [0, 200],
      value: [0, 200],
      histogramsByGroup: {data: denseBins}
    });
    const svg = container.querySelector('svg')!;
    setPlotBounds(svg, 40);

    // The pointer's interval is bin 5, but bin 3 is the last bar painted here.
    hover(svg, 0.5);
    let tooltip = await screen.findByRole('tooltip');
    expect(tooltip.querySelector('.histogram-tooltip__range')).toHaveTextContent('3 – 4');
    expect(tooltip.querySelector('.histogram-tooltip__total')).toHaveTextContent('Count: 4');

    // Above the shorter bars, the earlier, taller bin remains visible.
    hover(svg, 0.5, 20);
    tooltip = await screen.findByRole('tooltip');
    expect(tooltip.querySelector('.histogram-tooltip__range')).toHaveTextContent('0 – 1');
    expect(tooltip.querySelector('.histogram-tooltip__total')).toHaveTextContent('Count: 10');
  });

  test('respects linked dataset paint order and heights when narrow bars overlap', async () => {
    const linkedBins = Array.from({length: 200}, (_, index) => ({
      x0: index,
      x1: index + 1,
      count: 8,
      indexes: []
    }));
    const {container} = setup({
      enableChartHover: true,
      width: 20,
      range: [0, 200],
      value: [0, 200],
      histogramsByGroup: {
        first: linkedBins,
        second: linkedBins.map(bin => ({...bin, count: 4}))
      },
      datasets: {first: {label: 'First dataset'}, second: {label: 'Second dataset'}}
    });
    const svg = container.querySelector('svg')!;
    setPlotBounds(svg, 40);

    // First dataset/bin 9 and second dataset/bin 4 overlap at their group offsets.
    hover(svg, 1);
    let tooltip = await screen.findByRole('tooltip');
    expect(within(tooltip).getByText('Second dataset')).toBeInTheDocument();
    expect(tooltip.querySelector('.histogram-tooltip__range')).toHaveTextContent('4 – 5');
    expect(tooltip.querySelector('.histogram-tooltip__total')).toHaveTextContent('Count: 4');

    hover(svg, 1, 25);
    tooltip = await screen.findByRole('tooltip');
    expect(within(tooltip).getByText('First dataset')).toBeInTheDocument();
    expect(tooltip.querySelector('.histogram-tooltip__range')).toHaveTextContent('9 – 10');
    expect(tooltip.querySelector('.histogram-tooltip__total')).toHaveTextContent('Count: 8');
  });

  test('formats temporal intervals with the configured format and timezone', async () => {
    const start = Date.UTC(2020, 0, 1);
    const end = start + 60 * 60 * 1000;
    const {container} = setup({
      enableChartHover: true,
      isTime: true,
      timeFormat: 'YYYY-MM-DD HH:mm',
      timezone: 'America/New_York',
      range: [start, end],
      value: [start, end],
      histogramsByGroup: {data: [{...bins[0], x0: start, x1: end}]}
    });
    const svg = container.querySelector('svg')!;
    setPlotBounds(svg);
    hover(svg, 50);

    const tooltip = await screen.findByRole('tooltip');
    const interval = tooltip.querySelector('.histogram-tooltip__range');
    expect(interval).toHaveTextContent('2019-12-31 19:00');
    expect(interval).toHaveTextContent('2019-12-31 20:00');
  });

  test('clears on leave or press and suppresses hover while dragging or brushing', async () => {
    const onBrushMouseDown = jest.fn();
    const view = setup({
      enableChartHover: true,
      brushComponent: <g className="test-brush" onMouseDown={onBrushMouseDown} />
    });
    const svg = view.container.querySelector('svg')!;
    setPlotBounds(svg);
    hover(svg, 50);
    await screen.findByRole('tooltip');
    fireEvent.mouseLeave(svg);
    await expectNoTooltip();

    hover(svg, 50);
    await screen.findByRole('tooltip');
    fireEvent.mouseDown(view.container.querySelector('.test-brush')!, {buttons: 1});
    expect(onBrushMouseDown).toHaveBeenCalledTimes(1);
    await expectNoTooltip();
    hover(svg, 50, 75, 1);
    await expectNoTooltip();

    hover(svg, 50);
    await screen.findByRole('tooltip');
    view.rerender(plot({enableChartHover: true, brushing: true}));
    await expectNoTooltip();
    hover(svg, 50);
    await expectNoTooltip();
  });

  test.each(['data', 'range', 'disabled'] as const)(
    'clears stale hover after %s changes',
    async change => {
      const view = setup({enableChartHover: true});
      const svg = view.container.querySelector('svg')!;
      setPlotBounds(svg);
      hover(svg, 50);
      await screen.findByRole('tooltip');

      const overrides: Partial<HistogramPlotProps> =
        change === 'data'
          ? {histogramsByGroup: {data: [{...bins[0], count: 9}]}}
          : change === 'range'
          ? {range: [0, 4]}
          : {enableChartHover: false};
      view.rerender(plot({enableChartHover: true, ...overrides}));
      await expectNoTooltip();
      if (change === 'data') {
        hover(svg, 50);
        const tooltip = await screen.findByRole('tooltip');
        expect(tooltip.querySelector('.histogram-tooltip__total')).toHaveTextContent('Count: 9');
      } else if (change === 'disabled') {
        hover(svg, 50);
        await expectNoTooltip();
      }
    }
  );

  test('leaves hover disabled by default and ignores empty or zero-count bins', async () => {
    const view = setup();
    const svg = view.container.querySelector('svg')!;
    setPlotBounds(svg);
    hover(svg, 50);
    await expectNoTooltip();

    view.rerender(
      plot({
        enableChartHover: true,
        histogramsByGroup: {data: [{count: 0, indexes: [], x0: 0, x1: 1}]}
      })
    );
    hover(view.container.querySelector('svg')!, 50, 100);
    await expectNoTooltip();
    view.rerender(plot({enableChartHover: true, histogramsByGroup: {data: []}}));
    expect(view.container.querySelector('svg')).toBeNull();
    await expectNoTooltip();
  });
});
