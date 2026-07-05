// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo, useRef} from 'react';
import {scaleTime, scaleLinear} from 'd3-scale';
import {LineChart} from '@kepler.gl/types';
import styled from 'styled-components';
import {datetimeFormatter} from '@kepler.gl/utils';

export interface LineSeriesPoint {
  x: number;
  y: number;
}

const LineChartWrapper = styled.div`
  position: relative;

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
  margin: 4px;
  padding: 3px 6px;
  pointer-events: none;
  user-select: none;
  position: absolute;
  white-space: nowrap;
`;

interface HintContentProps {
  x: number;
  y: number;
  format: (ts: number) => string;
}

const HintContent = ({x, y, format}: HintContentProps) => (
  <StyledHint>
    <div className="hint--x">{format(x)}</div>
    <div className="row">{y}</div>
  </StyledHint>
);

export interface HoverDP {
  x: number;
  y: number;
  color?: string | number;
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
    yAxisAutoRange
  }: LineChartProps) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const {yDomain, xDomain} = lineChart || {};
    // @ts-expect-error seems lineChart.series has ambiguous types. Requires refactoring.
    const series: {lines: any[]; markers: any[]} = lineChart?.series;

    const effectiveXDomain = useMemo(
      () => (range && range.length === 2 ? range : xDomain),
      [range, xDomain]
    );

    const filteredYDomain = useMemo(() => {
      if (!yAxisAutoRange || !series?.lines || !value || value.length < 2) return yDomain;
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
      return min !== undefined && max !== undefined ? [min, max] : yDomain;
    }, [series, value, yDomain, yAxisAutoRange]);

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

    const isHoveredDPVisible = hoveredDP
      ? !yAxisAutoRange ||
        !paddedYDomain ||
        paddedYDomain.length < 2 ||
        (hoveredDP.y >= paddedYDomain[0] && hoveredDP.y <= paddedYDomain[1])
      : false;

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

    const linePaths = useMemo(() => {
      if (!xScale || !yScale || !series?.lines) return [];
      return series.lines.map(lineData => {
        const points = lineData
          .filter(p => p.x != null && p.y != null)
          .map(p => `${xScale(new Date(p.x))},${yScale(p.y)}`);
        return points.length > 1 ? `M${points.join('L')}` : '';
      });
    }, [xScale, yScale, series]);

    const findNearestPoint = useCallback(
      (mouseX: number) => {
        if (!xScale || !series?.lines) return null;
        const xValue = xScale.invert(mouseX).getTime();
        let nearest: LineSeriesPoint | null = null;
        let minDist = Infinity;
        for (const line of series.lines) {
          for (const point of line) {
            const dist = Math.abs(point.x - xValue);
            if (dist < minDist) {
              minDist = dist;
              nearest = point;
            }
          }
        }
        return nearest;
      },
      [xScale, series]
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
      return {
        left: xScale(new Date(clampedHoveredDP.x)),
        top: yScale(clampedHoveredDP.y)
      };
    }, [clampedHoveredDP, xScale, yScale]);

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
          {linePaths.map((d, i) => (
            <path key={i} d={d} fill="none" stroke={color} strokeWidth={1.5} />
          ))}
          {isHoveredDPVisible && hoveredDP && xScale && yScale && (
            <circle
              cx={xScale(new Date(hoveredDP.x))}
              cy={yScale(hoveredDP.y)}
              r={4}
              fill={color}
            />
          )}
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
          {brushComponent && (
            <foreignObject x={0} y={0} width={width} height={height}>
              {brushComponent}
            </foreignObject>
          )}
        </svg>
        {clampedHoveredDP && enableChartHover && !brushing && hintPosition ? (
          <div style={{position: 'absolute', left: hintPosition.left, top: hintPosition.top}}>
            <HintContent {...hoveredDP!} format={hintFormatter} />
          </div>
        ) : null}
      </LineChartWrapper>
    );
  };
  return LineChartComponent;
}

export default LineChartFactory;
