// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {scaleTime, scaleLinear} from 'd3-scale';
import {bisector} from 'd3-array';
import {LineChart} from '@kepler.gl/types';
import styled, {withTheme} from 'styled-components';
import {datetimeFormatter} from '@kepler.gl/utils';

export interface LineSeriesPoint {
  x: number;
  y: number;
  color?: string;
  name?: string;
  points?: LineSeriesPoint[];
}

const LineChartWrapper = styled.div`
  position: relative;
  border-radius: 2px;
  background: ${props => props.theme.rangePlotBgd};

  .line-chart__grid-line {
    stroke: ${props => props.theme.histogramFillOutRange};
    stroke-dasharray: 1px 4px;
  }

  .line-chart__axis-tick {
    font-size: 9px;
    fill: ${props => props.theme.textColor};
  }
`;

const StyledHint = styled.div`
  background-color: #d3d8e0;
  border-radius: 2px;
  color: ${props => props.theme.textColorLT};
  font-size: 9px;
  padding: 3px 6px;
  pointer-events: none;
  user-select: none;
  white-space: nowrap;

  .hint--series {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .hint--swatch {
    width: 8px;
    height: 8px;
    border-radius: 2px;
    flex: none;
  }
`;

const HINT_GAP = 6;

/** Keep the hover hint off the time axis. A tall hint grows upward. */
function placeLineChartHint(
  pointX: number,
  pointY: number,
  hintWidth: number,
  hintHeight: number,
  plotWidth: number,
  plotHeight: number
): {left: number; top: number} {
  let left = pointX + HINT_GAP;
  if (hintWidth && left + hintWidth > plotWidth) {
    left = pointX - hintWidth - HINT_GAP;
  }
  if (left < 0) {
    left = 0;
  }

  const above = pointY - hintHeight - HINT_GAP;
  const below = pointY + HINT_GAP;
  const fitsAbove = above >= 0;
  const fitsBelow = hintHeight > 0 && below + hintHeight <= plotHeight;
  let top = above;
  if (!fitsAbove && fitsBelow) {
    top = below;
  } else if (!fitsAbove && !fitsBelow && hintHeight > 0 && hintHeight <= plotHeight) {
    top = Math.max(0, plotHeight - hintHeight);
  }
  return {left, top};
}

interface HintContentProps {
  x: number;
  y: number;
  name?: string;
  points?: LineSeriesPoint[];
  format: (ts: number) => string;
}

const HintContent = ({x, y, name, points, format}: HintContentProps) => (
  <StyledHint>
    {points && points.length > 1 ? (
      <>
        <div className="hint--x">{format(x)}</div>
        {points.map((point, index) => (
          <div className="hint--series" key={`${point.name ?? 'series'}-${index}`}>
            <span
              className="hint--swatch"
              style={{backgroundColor: point.color || 'transparent'}}
            />
            {point.name ? <span className="hint--name">{point.name}</span> : null}
            <span className="row">{point.y}</span>
          </div>
        ))}
      </>
    ) : (
      <>
        {name ? <div className="hint--name">{name}</div> : null}
        <div className="hint--x">{format(x)}</div>
        <div className="row">{y}</div>
      </>
    )}
  </StyledHint>
);

export interface HoverDP {
  x: number;
  y: number;
  color?: string | number;
  name?: string;
  points?: LineSeriesPoint[];
  opacity?: string | number;
  stroke?: string | number;
  fill?: string | number;
  size?: string | number;
}

interface LineChartProps {
  brushComponent?: any;
  brushing?: boolean;
  color?: string;
  enableChartHover?: boolean;
  height: number;
  hoveredDP?: HoverDP | null;
  isEnlarged?: boolean;
  lineChart?: LineChart;
  margin: {top?: number; bottom?: number; left?: number; right?: number};
  onMouseMove: (datapoint: LineSeriesPoint | null) => void;
  value?: number[];
  width: number;
  timezone?: string | null;
  timeFormat?: string;
  range?: number[];
  yAxisAutoRange?: boolean;
  theme?: any;
}

function LineChartFactory() {
  const LineChartComponent = ({
    brushComponent,
    brushing,
    color,
    enableChartHover,
    height,
    hoveredDP,
    isEnlarged,
    lineChart,
    margin,
    onMouseMove,
    value,
    width,
    timezone,
    timeFormat,
    range,
    yAxisAutoRange,
    theme
  }: LineChartProps) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const hintRef = useRef<HTMLDivElement>(null);
    const clipIdRef = useRef(`line-chart-clip-${Math.random().toString(36).slice(2)}`);
    const clipId = clipIdRef.current;
    const [hintSize, setHintSize] = useState({width: 0, height: 0});
    const {yDomain, xDomain} = lineChart || {};
    const series =
      lineChart?.series && !Array.isArray(lineChart.series) ? lineChart.series : undefined;

    const lineColor = color || (theme && theme.activeColor) || '#3A414C';

    const computedYDomain = useMemo(() => {
      if (yDomain && yDomain[0] != null && yDomain[1] != null) return yDomain;
      if (!series?.lines) return undefined;
      let min: number | undefined;
      let max: number | undefined;
      for (const line of series.lines) {
        for (const point of line) {
          if (point.y != null) {
            if (min === undefined || point.y < min) min = point.y;
            if (max === undefined || point.y > max) max = point.y;
          }
        }
      }
      return min !== undefined && max !== undefined ? [min, max] : undefined;
    }, [yDomain, series]);

    const effectiveXDomain = useMemo(
      () => (range && range.length === 2 ? range : xDomain),
      [range, xDomain]
    );

    const filteredYDomain = useMemo(() => {
      if (!yAxisAutoRange || !series?.lines || !value || value.length < 2) return computedYDomain;
      let min: number | undefined;
      let max: number | undefined;
      for (const line of series.lines) {
        for (let i = 0; i < line.length; i++) {
          const point = line[i];
          const inRange = point.x >= value[0] && point.x <= value[1];
          const isAdjacentToRange =
            (!inRange && line[i + 1] && line[i + 1].x >= value[0] && line[i + 1].x <= value[1]) ||
            (!inRange && line[i - 1] && line[i - 1].x >= value[0] && line[i - 1].x <= value[1]);
          if ((inRange || isAdjacentToRange) && point.y != null) {
            if (min === undefined || point.y < min) min = point.y;
            if (max === undefined || point.y > max) max = point.y;
          }
        }
      }
      return min !== undefined && max !== undefined ? [min, max] : computedYDomain;
    }, [series, value, computedYDomain, yAxisAutoRange]);

    const paddedYDomain = useMemo(() => {
      if (!filteredYDomain || filteredYDomain[0] == null || filteredYDomain[1] == null) return [];
      const padding = (filteredYDomain[1] - filteredYDomain[0]) * 0.1;
      return [filteredYDomain[0] - padding, filteredYDomain[1] + padding];
    }, [filteredYDomain]);

    const xScale = useMemo(() => {
      if (!effectiveXDomain || effectiveXDomain.length < 2) return null;
      return scaleTime()
        .domain([new Date(effectiveXDomain[0]), new Date(effectiveXDomain[1])])
        .range([0, width]);
    }, [effectiveXDomain, width]);

    const yScale = useMemo(() => {
      if (!paddedYDomain || paddedYDomain.length < 2) return null;
      return scaleLinear().domain(paddedYDomain).range([height, 0]);
    }, [paddedYDomain, height]);

    const hintFormatter = useMemo(
      () => datetimeFormatter(timezone)(timeFormat),
      [timezone, timeFormat]
    );

    const clampedHoveredDP = useMemo(() => {
      if (!hoveredDP || !paddedYDomain || paddedYDomain.length < 2) return hoveredDP;
      return {
        ...hoveredDP,
        y: Math.max(paddedYDomain[0], Math.min(paddedYDomain[1], hoveredDP.y))
      };
    }, [hoveredDP, paddedYDomain]);

    const gridLines = useMemo(() => {
      if (!yScale) return [];
      return yScale.ticks(3);
    }, [yScale]);

    const yAxisTicks = useMemo(() => {
      if (!yScale) return [];
      return yScale.ticks(3);
    }, [yScale]);

    const lineMarks = useMemo(() => {
      const paths: {key: number; d: string; color: string}[] = [];
      const dots: {key: number; x: number; y: number; color: string}[] = [];
      if (!xScale || !yScale || !series?.lines) {
        return {paths, dots};
      }
      series.lines.forEach((lineData, index) => {
        const points = lineData.filter(point => point.x != null && point.y != null);
        const markColor = series.colors?.[index] || lineColor;
        if (points.length > 1) {
          paths.push({
            key: index,
            d: `M${points
              .map(point => `${xScale(new Date(point.x))},${yScale(point.y)}`)
              .join('L')}`,
            color: markColor
          });
        } else if (points.length === 1) {
          dots.push({
            key: index,
            x: xScale(new Date(points[0].x)),
            y: yScale(points[0].y),
            color: markColor
          });
        }
      });
      return {paths, dots};
    }, [xScale, yScale, series, lineColor]);

    const bisectX = useMemo(() => bisector<LineSeriesPoint, number>(d => d.x).left, []);

    const findNearestPoint = useCallback(
      (mouseX: number) => {
        if (!xScale || !series?.lines) return null;
        const xValue = xScale.invert(mouseX).getTime();
        let bestX: number | null = null;
        let minDist = Infinity;
        series.lines.forEach(line => {
          if (line.length === 0) return;
          const idx = bisectX(line, xValue);
          for (const i of [idx - 1, idx]) {
            const point = line[i];
            if (!point || point.y == null) continue;
            const dist = Math.abs(point.x - xValue);
            if (dist < minDist) {
              minDist = dist;
              bestX = point.x;
            }
          }
        });
        if (bestX == null) return null;

        const points: LineSeriesPoint[] = [];
        series.lines.forEach((line, lineIndex) => {
          if (line.length === 0) return;
          const idx = bisectX(line, bestX as number);
          for (const i of [idx - 1, idx, idx + 1]) {
            const point = line[i];
            if (point && point.x === bestX && point.y != null) {
              points.push({
                x: point.x,
                y: point.y,
                color: series.colors?.[lineIndex],
                name: series.names?.[lineIndex]
              });
              break;
            }
          }
        });
        if (!points.length) return null;
        const anchor = points.reduce((best, point) => (point.y > best.y ? point : best), points[0]);
        return points.length > 1 ? {...anchor, points} : anchor;
      },
      [xScale, series, bisectX]
    );

    const handleMouseMove = useCallback(
      (e: React.MouseEvent<SVGSVGElement>) => {
        if (!enableChartHover || series?.markers?.length) return;
        const svg = svgRef.current;
        if (!svg) return;
        const rect = svg.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const nearest = findNearestPoint(mouseX);
        onMouseMove(nearest);
      },
      [enableChartHover, series, findNearestPoint, onMouseMove]
    );

    const handleMouseLeave = useCallback(() => {
      onMouseMove(null);
    }, [onMouseMove]);

    const hintPosition = useMemo(() => {
      if (!clampedHoveredDP || !xScale || !yScale) return null;
      return placeLineChartHint(
        xScale(new Date(clampedHoveredDP.x)),
        yScale(clampedHoveredDP.y),
        hintSize.width,
        hintSize.height,
        width,
        height
      );
    }, [clampedHoveredDP, xScale, yScale, hintSize, width, height]);

    useLayoutEffect(() => {
      const node = hintRef.current;
      if (!node) {
        return;
      }
      const next = {width: node.offsetWidth, height: node.offsetHeight};
      setHintSize(prev => (prev.width === next.width && prev.height === next.height ? prev : next));
    }, [clampedHoveredDP, hintFormatter]);

    return (
      <LineChartWrapper style={{marginTop: `${margin.top}px`}}>
        <svg
          ref={svgRef}
          width={width}
          height={height}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{overflow: 'visible'}}
        >
          <defs>
            <clipPath id={clipId}>
              <rect x="0" y="0" width={width} height={height} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clipId})`}>
            {gridLines.map((tick, i) => (
              <line
                key={i}
                className="line-chart__grid-line"
                x1={0}
                x2={width}
                y1={yScale!(tick)}
                y2={yScale!(tick)}
              />
            ))}
            {lineMarks.paths.map(mark => (
              <path
                key={mark.key}
                d={mark.d}
                fill="none"
                stroke={mark.color}
                strokeWidth={series?.colors ? 1.5 : 1}
              />
            ))}
            {lineMarks.dots.map(mark => (
              <circle key={`dot-${mark.key}`} cx={mark.x} cy={mark.y} r={3} fill={mark.color} />
            ))}
            {xScale &&
              yScale &&
              (hoveredDP?.points?.length ? hoveredDP.points : hoveredDP ? [hoveredDP] : []).map(
                (point, index) =>
                  point.y == null ? null : (
                    <circle
                      key={`${point.name ?? 'series'}-${index}`}
                      cx={xScale(new Date(point.x))}
                      cy={yScale(point.y)}
                      r={4}
                      fill={String(point.color || lineColor)}
                    />
                  )
              )}
          </g>
          {isEnlarged &&
            yAxisTicks.map((tick, i) => (
              <text
                key={i}
                className="line-chart__axis-tick"
                x={-4}
                y={yScale!(tick)}
                textAnchor="end"
                dominantBaseline="middle"
              >
                {tick}
              </text>
            ))}
          {brushComponent}
        </svg>
        {clampedHoveredDP && enableChartHover && !brushing && hintPosition ? (
          <div
            ref={hintRef}
            style={{
              position: 'absolute',
              left: hintPosition.left,
              top: hintPosition.top,
              zIndex: 2,
              pointerEvents: 'none',
              visibility: hintSize.height ? 'visible' : 'hidden'
            }}
          >
            <HintContent {...hoveredDP!} format={hintFormatter} />
          </div>
        ) : null}
      </LineChartWrapper>
    );
  };
  return withTheme(LineChartComponent) as React.FC<Omit<LineChartProps, 'theme'>>;
}

export default LineChartFactory;
