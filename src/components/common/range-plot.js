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

import React, {useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import styled, {withTheme} from 'styled-components';
import RangeBrushFactory from './range-brush';
import HistogramPlotFactory from './histogram-plot';
import LineChartFactory from './line-chart';
import {isTest} from 'utils/utils';

const StyledRangePlot = styled.div`
  margin-bottom: ${props => props.theme.sliderBarHeight}px;
  display: flex;
  position: 'relative';
`;

RangePlotFactory.deps = [RangeBrushFactory, HistogramPlotFactory, LineChartFactory];

export default function RangePlotFactory(RangeBrush, HistogramPlot, LineChart) {
  const RangePlot = ({
    onBrush,
    range,
    value,
    width,
    plotType,
    lineChart,
    histogram,
    isEnlarged,
    isRanged,
    theme,
    ...chartProps
  }) => {
    const [brushing, setBrushing] = useState(false);
    const [hoveredDP, onMouseMove] = useState(null);
    const [enableChartHover, setEnableChartHover] = useState(false);
    const height = isEnlarged ? theme.rangePlotHLarge : theme.rangePlotH;

    const onBrushStart = useCallback(() => {
      setBrushing(true);
      onMouseMove(null);
      setEnableChartHover(false);
    }, [setBrushing, onMouseMove, setEnableChartHover]);

    const onBrushEnd = useCallback(() => {
      setBrushing(false);
      setEnableChartHover(true);
    }, [setBrushing, setEnableChartHover]);

    const onMouseoverHandle = useCallback(() => {
      onMouseMove(null);
      setEnableChartHover(false);
    }, [onMouseMove, setEnableChartHover]);

    const onMouseoutHandle = useCallback(() => {
      setEnableChartHover(true);
    }, [setEnableChartHover]);

    // JsDom have limited support for SVG, d3 will fail
    const brushComponent = isTest() ? null : (
      <RangeBrush
        onBrush={onBrush}
        onBrushStart={onBrushStart}
        onBrushEnd={onBrushEnd}
        range={range}
        value={value}
        width={width}
        height={height}
        isRanged={isRanged}
        onMouseoverHandle={onMouseoverHandle}
        onMouseoutHandle={onMouseoutHandle}
        {...chartProps}
      />
    );

    const commonProps = {
      width,
      value,
      height,
      margin: isEnlarged ? theme.rangePlotMarginLarge : theme.rangePlotMargin,
      brushComponent,
      brushing,
      isEnlarged,
      enableChartHover,
      onMouseMove,
      hoveredDP,
      isRanged,
      ...chartProps
    };

    return (
      <StyledRangePlot
        style={{
          height: `${isEnlarged ? theme.rangePlotContainerHLarge : theme.rangePlotContainerH}px`
        }}
        className="kg-range-slider__plot"
      >
        {plotType === 'lineChart' && lineChart ? (
          <LineChart lineChart={lineChart} {...commonProps} />
        ) : (
          <HistogramPlot histogram={histogram} {...commonProps} />
        )}
      </StyledRangePlot>
    );
  };

  RangePlot.propTypes = {
    value: PropTypes.arrayOf(PropTypes.number).isRequired,
    histogram: PropTypes.arrayOf(
      PropTypes.shape({
        x0: PropTypes.number,
        x1: PropTypes.number
      })
    ),
    lineChart: PropTypes.object,
    plotType: PropTypes.string,
    isEnlarged: PropTypes.bool,
    onBlur: PropTypes.func,
    width: PropTypes.number.isRequired
  };
  return withTheme(RangePlot);
}
