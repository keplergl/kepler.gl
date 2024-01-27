// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import {
  HorizontalGridLines,
  LineSeries,
  XYPlot,
  CustomSVGSeries,
  Hint,
  YAxis,
  MarkSeries,
  LineSeriesPoint,
  RVNearestXData
} from 'react-vis';
import {LineChart} from '@kepler.gl/types';
import styled from 'styled-components';
import {datetimeFormatter} from '@kepler.gl/utils';

const LineChartWrapper = styled.div`
  .rv-xy-plot {
    /* important for rendering hint */
    position: relative;
  }
  .rv-xy-plot__inner {
    /* important to show axis */
    overflow: visible;
  }

  .rv-xy-plot__grid-lines__line {
    stroke: ${props => props.theme.histogramFillOutRange};
    stroke-dasharray: 1px 4px;
  }

  .rv-xy-plot__axis__tick__text {
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
  onMouseMove: (datapoint: LineSeriesPoint | null, data?: RVNearestXData<LineSeriesPoint>) => void;
  width: number;
  timezone?: string | null;
  timeFormat?: string;
}

const MARGIN = {top: 0, bottom: 0, left: 0, right: 0};
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
    width,
    timezone,
    timeFormat
  }: LineChartProps) => {
    const {series, yDomain} = lineChart || {};

    const brushData = useMemo(() => {
      return series && series[0] && series[0].x && yDomain && yDomain[1]
        ? [{x: series[0].x, y: yDomain[1], customComponent: () => brushComponent}]
        : [];
    }, [series, yDomain, brushComponent]);
    const hintFormatter = useMemo(() => datetimeFormatter(timezone)(timeFormat), [
      timezone,
      timeFormat
    ]);

    return (
      <LineChartWrapper style={{marginTop: `${margin.top}px`}}>
        <XYPlot
          xType="time"
          width={width}
          height={height}
          margin={MARGIN}
          onMouseLeave={() => {
            onMouseMove(null);
          }}
        >
          <HorizontalGridLines tickTotal={3} />
          <LineSeries
            style={{fill: 'none'}}
            color={color}
            data={series}
            onNearestX={enableChartHover ? onMouseMove : undefined}
          />
          <MarkSeries data={hoveredDP ? [hoveredDP] : []} color={color} />
          <CustomSVGSeries data={brushData} />
          {isEnlarged && <YAxis tickTotal={3} />}
          {hoveredDP && enableChartHover && !brushing ? (
            <Hint value={hoveredDP}>
              <HintContent {...hoveredDP} format={hintFormatter} />
            </Hint>
          ) : null}
        </XYPlot>
      </LineChartWrapper>
    );
  };
  return LineChartComponent;
}

export default LineChartFactory;
