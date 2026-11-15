// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ReactElement, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {scaleLinear} from 'd3-scale';
import {hcl} from 'd3-color';
import {bisector, min, max} from 'd3-array';
import {format} from 'd3-format';
import styled from 'styled-components';

import {Bin, Bins} from '@kepler.gl/types';
import {datetimeFormatter, formatNumber} from '@kepler.gl/utils';
import TippyTooltip from './tippy-tooltip';

// clipping mask constants
export const HISTOGRAM_MASK_MODE = {
  NoMask: 0,
  Mask: 1,
  MaskWithOverlay: 2
};
const HISTOGRAM_MASK_BGCOLOR = '#FFFFFF';
const HISTOGRAM_MASK_FGCOLOR = '#000000';

const histogramStyle = {
  highlightW: 0.7,
  unHighlightedW: 0.7
};

const HistogramWrapper = styled.svg<{$recessed?: boolean}>`
  overflow: visible;
  border-radius: 2px;
  background: ${props => (props.$recessed ? props.theme.rangePlotBgd : 'transparent')};
`;

const HistogramMaskRect = styled.rect`
  fill: ${props => props.theme.panelBackground};
`;

const HistogramBreakLine = styled.g`
  stroke: ${props => props.theme.histogramBreakLineColor};
  stroke-width: 1px;
  transform: translate(0, 0);
`;

const YAxisTick = styled.text`
  font-size: 9px;
  fill: ${props => props.theme.textColor};
`;

const BinDetails = styled.div`
  .histogram-tooltip__range,
  .histogram-tooltip__total {
    margin-bottom: 4px;
  }

  .histogram-tooltip__row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .histogram-tooltip__name {
    flex: 1;
    overflow-wrap: anywhere;
  }

  .histogram-tooltip__swatch {
    width: 8px;
    height: 8px;
    border-radius: 2px;
    flex: none;
    background: ${props => props.theme.histogramFillInRange};
  }

  .histogram-tooltip__number {
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
`;

const formatCount = format(',d');
const formatPercent = format('.1~%');
const bisectBin = bisector<Bin, number>(bin => bin.x0).right;

type HoveredBin = {dataId: string; index: number; bin: Bin; groupIndex: number};

type BarType = {
  $inRange: boolean;
  $isOverlay: boolean;
  $color?: string;
};
const BarUnmemoized = styled.rect<BarType>(
  ({theme, $inRange, $isOverlay, $color}) => `
  ${
    $isOverlay
      ? `fill: ${$color ?? theme.histogramOverlayColor};`
      : $inRange
      ? `fill: ${$color ?? theme.histogramFillInRange};`
      : `fill: ${$color ? hcl($color).darker() : theme.histogramFillOutRange};`
  }
`
);
const Bar = React.memo(BarUnmemoized);
Bar.displayName = 'Bar';

const isBarInRange = (
  bar: {x0: number; x1: number},
  _index: number,
  _list: any[],
  _filterDomain: any[],
  filterValue: any[]
) => bar.x1 > filterValue[0] && bar.x0 < filterValue[1];

export type HistogramMaskModeType = {
  NoMask: number;
  Mask: number;
  MaskWithOverlay: number;
};

const undefinedToZero = (v: number | undefined) => (v ? v : 0);

export interface HistogramPlotProps {
  width: number;
  height: number;
  margin: {top: number; bottom: number; left: number; right: number};
  isRanged?: boolean;
  isEnlarged?: boolean;
  value: number[];
  isMasked?: number;
  brushComponent?: ReactElement;
  histogramsByGroup: Bins;
  colorsByGroup?: null | {[dataId: string]: string};
  countProp?: string;
  range?: number[];
  breakLines?: number[];
  /** Dark plot surface for the range brush. Column histograms leave this off. */
  recessed?: boolean;
  // Timeline charts already supply these hover controls and axis formatters.
  enableChartHover?: boolean;
  brushing?: boolean;
  isTime?: boolean;
  timeFormat?: string;
  timezone?: string | null;
  datasets?: Record<string, {label?: string}>;
}

function HistogramPlotFactory() {
  const HistogramPlot = ({
    width,
    height,
    histogramsByGroup,
    colorsByGroup,
    isMasked = HISTOGRAM_MASK_MODE.NoMask,
    isEnlarged,
    countProp = 'count',
    margin,
    isRanged,
    range,
    value,
    brushComponent,
    breakLines,
    recessed,
    enableChartHover,
    brushing,
    isTime = true,
    timeFormat,
    timezone,
    datasets
  }: HistogramPlotProps) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [hoveredBin, setHoveredBin] = useState<HoveredBin | null>(null);
    const groupKeys = useMemo(
      () =>
        Object.keys(histogramsByGroup)
          // only keep non-empty groups
          .filter(key => histogramsByGroup[key]?.length > 0),
      [histogramsByGroup]
    );

    const domain = useMemo(
      () =>
        range ?? [
          min(groupKeys, key => histogramsByGroup[key][0].x0) ?? 0,
          max(groupKeys, key => histogramsByGroup[key][histogramsByGroup[key].length - 1].x1) ?? 0
        ],
      [range, histogramsByGroup, groupKeys]
    );

    const numBins = useMemo(() => {
      if (groupKeys.length === 0) return 0;
      const maxGroup = groupKeys.reduce((accu, key, _idx) => {
        if (histogramsByGroup[key].length > accu.length) {
          return histogramsByGroup[key];
        }
        return accu;
      }, histogramsByGroup[groupKeys[0]]);
      return maxGroup.length;
    }, [histogramsByGroup, groupKeys]);

    const x = useMemo(() => scaleLinear().domain(domain).range([0, width]), [domain, width]);

    const fallbackBarWidth = useMemo(() => {
      if (numBins === 0) return 0;
      return width / numBins;
    }, [numBins, width]);

    const y = useMemo(
      () =>
        scaleLinear()
          .domain([
            0,
            Math.max(
              Number(max(groupKeys, key => max(histogramsByGroup[key], d => d[countProp]))),
              1
            )
          ])
          .range([0, height]),
      [histogramsByGroup, groupKeys, height, countProp]
    );

    const yAxisTicks = useMemo(() => {
      if (!isEnlarged) return null;
      const yMax = Math.max(
        Number(max(groupKeys, key => max(histogramsByGroup[key], d => d[countProp]))),
        1
      );
      const tickCount = 3;
      const ticks = scaleLinear().domain([0, yMax]).ticks(tickCount);
      return ticks;
    }, [isEnlarged, groupKeys, histogramsByGroup, countProp]);

    const clipIdRef = useRef(`histogram-clip-${Math.random().toString(36).slice(2)}`);
    const clipId = clipIdRef.current;

    const getBarBounds = useCallback(
      (bar: Bin, groupIndex: number) => {
        const inRange = isBarInRange(bar, 0, [], domain, value);
        const wRatio = inRange ? histogramStyle.highlightW : histogramStyle.unHighlightedW;
        const bx0 = x(undefinedToZero(bar.x0));
        const binW = Math.max(x(undefinedToZero(bar.x1)) - bx0, 1);
        const perGroupW = binW / groupKeys.length;
        const drawnWidth = perGroupW * wRatio;
        return {
          x: bx0 + perGroupW * groupIndex + (perGroupW - drawnWidth) / 2,
          y: height - y(bar[countProp]),
          width: drawnWidth,
          height: y(bar[countProp])
        };
      },
      [countProp, domain, groupKeys.length, height, value, x, y]
    );

    const clearHover = useCallback(() => setHoveredBin(null), []);
    useEffect(clearHover, [
      clearHover,
      histogramsByGroup,
      range,
      brushing,
      enableChartHover,
      width,
      height
    ]);

    const handleMouseMove = useCallback(
      (event: React.MouseEvent<SVGSVGElement>) => {
        if (!enableChartHover || brushing || event.buttons || !width || !height) {
          clearHover();
          return;
        }
        svgRef.current = event.currentTarget;
        const rect = event.currentTarget.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const mouseX = ((event.clientX - rect.left) * width) / rect.width;
        const mouseY = ((event.clientY - rect.top) * height) / rect.height;
        if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
          clearHover();
          return;
        }
        const valueX = x.invert(mouseX);
        const overlapStart = x.invert(mouseX - 1);
        // Minimum-width bars can overlap later intervals. Follow reverse SVG paint order.
        for (let groupIndex = groupKeys.length - 1; groupIndex >= 0; groupIndex--) {
          const dataId = groupKeys[groupIndex];
          const bins = histogramsByGroup[dataId];
          // Include the interval containing the lower bound for ordinary wider bars.
          const firstIndex = Math.max(0, bisectBin(bins, overlapStart) - 1);
          for (let index = bisectBin(bins, valueX) - 1; index >= firstIndex; index--) {
            const bin = bins[index];
            const bounds = getBarBounds(bin, groupIndex);
            if (
              bounds.height > 0 &&
              mouseX >= bounds.x &&
              mouseX <= bounds.x + bounds.width &&
              mouseY >= bounds.y &&
              mouseY <= height
            ) {
              setHoveredBin(previous =>
                previous?.bin === bin && previous.dataId === dataId
                  ? previous
                  : {dataId, index, bin, groupIndex}
              );
              return;
            }
          }
        }
        clearHover();
      },
      [
        brushing,
        clearHover,
        enableChartHover,
        getBarBounds,
        groupKeys,
        height,
        histogramsByGroup,
        width,
        x
      ]
    );

    const activeHover =
      enableChartHover &&
      !brushing &&
      width > 0 &&
      height > 0 &&
      hoveredBin &&
      histogramsByGroup[hoveredBin.dataId]?.[hoveredBin.index] === hoveredBin.bin
        ? hoveredBin
        : null;
    const getReferenceClientRect = useCallback(() => {
      const rect = svgRef.current?.getBoundingClientRect();
      let left = 0;
      let right = 0;
      let top = 0;
      let bottom = 0;
      if (rect && activeHover) {
        const bounds = getBarBounds(activeHover.bin, activeHover.groupIndex);
        left = rect.left + (Math.max(0, bounds.x) * rect.width) / width;
        right = rect.left + (Math.min(width, bounds.x + bounds.width) * rect.width) / width;
        top = rect.top + (Math.max(0, bounds.y) * rect.height) / height;
        bottom = rect.bottom;
      }
      const bounds = {
        x: left,
        y: top,
        left,
        right,
        top,
        bottom,
        width: right - left,
        height: bottom - top
      };
      return {...bounds, toJSON: () => bounds};
    }, [activeHover, getBarBounds, height, width]);
    const formatBoundary = useMemo(
      () => (isTime ? datetimeFormatter(timezone)(timeFormat) : formatNumber),
      [isTime, timeFormat, timezone]
    );

    if (groupKeys.length === 0) {
      return null;
    }

    const maskedHistogram = () => {
      return (
        <HistogramWrapper
          width={width}
          height={height}
          $recessed={recessed}
          style={{margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`}}
        >
          <defs>
            <clipPath id={`${clipId}-mask`}>
              <rect x="0" y="0" width={width} height={height + margin.bottom} />
            </clipPath>
            <mask id="histogram-mask">
              <rect
                x="0"
                y="0"
                width={width}
                height={height + margin.bottom}
                fill={HISTOGRAM_MASK_BGCOLOR}
              />
              <g key="filtered-bins" className="histogram-bars">
                {histogramsByGroup.filteredBins.map((bar, idx, list) => {
                  const inRange = isBarInRange(bar, idx, list, domain, value);
                  const wRatio = inRange
                    ? histogramStyle.highlightW
                    : histogramStyle.unHighlightedW;
                  const bx0 = x(undefinedToZero(bar.x0));
                  const bx1 = x(undefinedToZero(bar.x1));
                  const binW = Math.max(bx1 - bx0, 1);
                  const drawnW = binW * wRatio;
                  return (
                    <Bar
                      $isOverlay={false}
                      $inRange={inRange}
                      $color={HISTOGRAM_MASK_FGCOLOR}
                      key={`mask-${idx}`}
                      height={y(bar[countProp])}
                      width={drawnW}
                      x={bx0 + (binW - drawnW) / 2}
                      y={height - y(bar[countProp])}
                    />
                  );
                })}
              </g>
            </mask>
          </defs>
          <g transform="translate(0,0)">
            <HistogramMaskRect
              x="0"
              y="0"
              width="100%"
              height={height + margin.bottom}
              mask="url(#histogram-mask)"
            />
          </g>
          {isMasked === HISTOGRAM_MASK_MODE.MaskWithOverlay && (
            <g
              key="bins"
              transform="translate(0,0)"
              className="overlay-histogram-bars"
              clipPath={`url(#${clipId}-mask)`}
            >
              {histogramsByGroup.bins.map((bar, idx, list) => {
                const filterBar = histogramsByGroup.filteredBins[idx];
                const maskHeight = filterBar
                  ? y(bar[countProp]) - y(filterBar[countProp])
                  : y(bar[countProp]);
                const inRange = isBarInRange(bar, idx, list, domain, value);
                const wRatio = inRange ? histogramStyle.highlightW : histogramStyle.unHighlightedW;
                const bx0 = x(undefinedToZero(bar.x0));
                const bx1 = x(undefinedToZero(bar.x1));
                const binW = Math.max(bx1 - bx0, 1);
                const drawnW = binW * wRatio;
                return (
                  <Bar
                    $inRange={inRange}
                    $isOverlay={true}
                    key={`bar-${idx}`}
                    height={maskHeight}
                    width={drawnW}
                    x={bx0 + (binW - drawnW) / 2}
                    y={height - y(bar[countProp])}
                  />
                );
              })}
            </g>
          )}
          <HistogramBreakLine>
            {(breakLines ?? []).map((pos, idx) => {
              return (
                <path key={`mask-line-${idx}`} strokeDasharray="4,4" d={`M${pos}, 0 l0 100`} />
              );
            })}
          </HistogramBreakLine>
          <g transform={`translate(${isRanged ? 0 : fallbackBarWidth / 2}, 0)`}>{brushComponent}</g>
        </HistogramWrapper>
      );
    };

    if (isMasked) return maskedHistogram();

    const histogram = (
      <HistogramWrapper
        width={width}
        height={height}
        $recessed={recessed}
        onMouseMove={enableChartHover === undefined ? undefined : handleMouseMove}
        onMouseLeave={enableChartHover === undefined ? undefined : clearHover}
        onMouseDown={enableChartHover === undefined ? undefined : clearHover}
        style={{margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`}}
      >
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y="0" width={width} height={height} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`} style={{pointerEvents: 'none'}}>
          {groupKeys.map((key, i) => (
            <g key={key} className="histogram-bars">
              {histogramsByGroup[key].map((bar, idx, list) => {
                const inRange = isBarInRange(bar, idx, list, domain, value);

                const {x: startX, width: drawnWidth} = getBarBounds(bar, i);
                const remainder =
                  countProp === 'count'
                    ? Math.max(
                        bar.count -
                          (bar.segments?.reduce((sum, segment) => sum + segment.count, 0) || 0),
                        0
                      )
                    : bar[countProp];
                let stackedCount = 0;
                return (
                  <React.Fragment key={`bar-${idx}`}>
                    <Bar
                      $isOverlay={false}
                      $inRange={inRange}
                      $color={colorsByGroup?.[key]}
                      height={y(remainder)}
                      width={drawnWidth}
                      x={startX}
                      rx={1}
                      ry={1}
                      y={height - y(bar[countProp])}
                    />
                    {countProp === 'count'
                      ? bar.segments?.map((segment, segmentIndex) => {
                          stackedCount += segment.count;
                          return (
                            <Bar
                              className="histogram-segment"
                              $isOverlay={false}
                              $inRange={inRange}
                              $color={segment.color}
                              key={segmentIndex}
                              height={y(segment.count)}
                              width={drawnWidth}
                              x={startX}
                              y={height - y(stackedCount)}
                            >
                              <title>{`${segment.name}: ${segment.count}`}</title>
                            </Bar>
                          );
                        })
                      : null}
                  </React.Fragment>
                );
              })}
            </g>
          ))}
        </g>
        {yAxisTicks ? (
          <g className="histogram-y-axis">
            {yAxisTicks.map(tick => (
              <YAxisTick
                key={tick}
                x={-4}
                y={height - y(tick)}
                textAnchor="end"
                dominantBaseline="middle"
              >
                {tick}
              </YAxisTick>
            ))}
          </g>
        ) : null}
        <g transform={`translate(${isRanged ? 0 : fallbackBarWidth / 2}, 0)`}>{brushComponent}</g>
      </HistogramWrapper>
    );

    // Other histogram consumers keep their existing SVG and interactions.
    if (enableChartHover === undefined) return histogram;
    const bin = activeHover?.bin;
    const segments = bin?.segments || [];
    const remainder = bin?.segments
      ? Math.max(bin.count - segments.reduce((sum, segment) => sum + segment.count, 0), 0)
      : 0;
    const rows = remainder
      ? [
          ...segments,
          {name: 'Other / missing', count: remainder, color: colorsByGroup?.[activeHover!.dataId]}
        ]
      : segments;

    return (
      <TippyTooltip
        visible={Boolean(activeHover)}
        duration={0}
        placement="top"
        getReferenceClientRect={getReferenceClientRect}
        render={() =>
          bin ? (
            <BinDetails className="histogram-tooltip" role="tooltip">
              {groupKeys.length > 1 ? (
                <div>{datasets?.[activeHover!.dataId]?.label || activeHover!.dataId}</div>
              ) : null}
              <div className="histogram-tooltip__range">
                {formatBoundary(bin.x0)} – {formatBoundary(bin.x1)}
              </div>
              <div className="histogram-tooltip__total">Count: {formatCount(bin.count)}</div>
              {rows.map((segment, index) => (
                <div className="histogram-tooltip__row" key={index}>
                  <span
                    className="histogram-tooltip__swatch"
                    style={{backgroundColor: segment.color}}
                  />
                  <span className="histogram-tooltip__name">{segment.name}</span>
                  <span className="histogram-tooltip__number">{formatCount(segment.count)}</span>
                  <span className="histogram-tooltip__number">
                    {formatPercent(segment.count / bin.count)}
                  </span>
                </div>
              ))}
            </BinDetails>
          ) : null
        }
      >
        {histogram}
      </TippyTooltip>
    );
  };

  const HistogramPlotWithGroups = props => {
    const groups = useMemo(
      () => (props.histogramsByGroup ? Object.keys(props.histogramsByGroup) : null),
      [props.histogramsByGroup]
    );

    if (!groups?.length) {
      return null;
    }

    return <HistogramPlot {...props} />;
  };

  return HistogramPlotWithGroups;
}
export default HistogramPlotFactory;
