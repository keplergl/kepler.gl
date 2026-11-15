// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {render} from '@testing-library/react';
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

function setup(overrides: Partial<HistogramPlotProps> = {}) {
  return render(
    <ThemeProvider theme={theme}>
      <HistogramPlot
        width={200}
        height={100}
        margin={{top: 0, bottom: 0, left: 0, right: 0}}
        range={[0, 2]}
        value={[0, 1]}
        histogramsByGroup={{data: bins}}
        isRanged
        brushComponent={<g className="test-brush" />}
        {...overrides}
      />
    </ThemeProvider>
  );
}

function geometry(rect: Element) {
  return Object.fromEntries(
    ['x', 'y', 'width', 'height'].map(name => [name, Number(rect.getAttribute(name))])
  );
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
