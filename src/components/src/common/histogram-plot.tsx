// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ReactElement, useMemo, useRef} from 'react';
import {scaleLinear} from 'd3-scale';
import {hcl} from 'd3-color';
import {min, max} from 'd3-array';
import styled from 'styled-components';

import {Bins} from '@kepler.gl/types';

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

const HistogramWrapper = styled.svg`
  overflow: visible;
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

interface HistogramPlotProps {
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
    breakLines
  }: HistogramPlotProps) => {
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

    if (groupKeys.length === 0) {
      return null;
    }

    const maskedHistogram = () => {
      return (
        <HistogramWrapper
          width={width}
          height={height}
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

    return isMasked ? (
      maskedHistogram()
    ) : (
      <HistogramWrapper
        width={width}
        height={height}
        style={{margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`}}
      >
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y="0" width={width} height={height} />
          </clipPath>
        </defs>
        <g transform={`translate(${isRanged ? 0 : fallbackBarWidth / 2}, 0)`}>{brushComponent}</g>
        <g clipPath={`url(#${clipId})`} style={{pointerEvents: 'none'}}>
          {groupKeys.map((key, i) => (
            <g key={key} className="histogram-bars">
              {histogramsByGroup[key].map((bar, idx, list) => {
                const inRange = isBarInRange(bar, idx, list, domain, value);

                const wRatio = inRange ? histogramStyle.highlightW : histogramStyle.unHighlightedW;
                const bx0 = x(undefinedToZero(bar.x0));
                const bx1 = x(undefinedToZero(bar.x1));
                const binW = Math.max(bx1 - bx0, 1);
                const perGroupW = isMasked ? binW : binW / groupKeys.length;
                const drawnWidth = perGroupW * wRatio;
                const groupOffset =
                  groupKeys.length > 1
                    ? perGroupW * i + (perGroupW - drawnWidth) / 2
                    : (binW - drawnWidth) / 2;
                const startX = bx0 + groupOffset;
                return (
                  <Bar
                    $isOverlay={false}
                    $inRange={inRange}
                    $color={colorsByGroup?.[key]}
                    key={`bar-${idx}`}
                    height={y(bar[countProp])}
                    width={drawnWidth}
                    x={startX}
                    rx={1}
                    ry={1}
                    y={height - y(bar[countProp])}
                  />
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
      </HistogramWrapper>
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
