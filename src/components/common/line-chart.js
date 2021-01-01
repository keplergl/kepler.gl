// Copyright (c) 2021 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {useMemo} from 'react';
import {
  HorizontalGridLines,
  LineSeries,
  XYPlot,
  CustomSVGSeries,
  Hint,
  YAxis,
  MarkSeries
} from 'react-vis';
import styled from 'styled-components';
import {datetimeFormatter} from 'utils/data-utils';

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

const HintContent = ({x, y, format}) => (
  <StyledHint>
    <div className="hint--x">{format(x)}</div>
    <div className="row">{y}</div>
  </StyledHint>
);

const MARGIN = {top: 0, bottom: 0, left: 0, right: 0};
function LineChartFactory() {
  const LineChart = ({
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
  }) => {
    const {series, yDomain} = lineChart;

    const brushData = useMemo(() => {
      return [{x: series[0].x, y: yDomain[1], customComponent: () => brushComponent}];
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
            strokeWidth={2}
            color={color}
            data={series}
            onNearestX={enableChartHover ? onMouseMove : null}
          />
          <MarkSeries data={hoveredDP ? [hoveredDP] : []} color={color} size={3} />
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
  return LineChart;
}

export default LineChartFactory;
