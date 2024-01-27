// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState, useCallback} from 'react';
import styled, {withTheme} from 'styled-components';
import RangeBrushFactory, {OnBrush, RangeBrushProps} from './range-brush';
import HistogramPlotFactory from './histogram-plot';
import LineChartFactory, {HoverDP} from './line-chart';
import {isTest, hasMobileWidth} from '@kepler.gl/utils';
import {breakPointValues} from '@kepler.gl/styles';
import {LineChart, Filter} from '@kepler.gl/types';
import {Datasets} from '@kepler.gl/table';

const StyledRangePlot = styled.div`
  margin-bottom: ${props => props.theme.sliderBarHeight}px;
  display: flex;
  position: 'relative';
`;

interface RangePlotProps {
  onBrush: OnBrush;
  range: number[];
  value: number[];
  width: number;
  plotType?: string;
  lineChart?: LineChart;
  histogram?: {x0: number; x1: number}[];
  isEnlarged?: boolean;
  isRanged?: boolean;
  theme: any;
  timeFormat?: string;
  timezone?: string | null;
  playbackControlWidth?: number;

  animationWindow?: string;
  filter?: Filter;
  datasets?: Datasets;
}

RangePlotFactory.deps = [RangeBrushFactory, HistogramPlotFactory, LineChartFactory];

export default function RangePlotFactory(
  RangeBrush: ReturnType<typeof RangeBrushFactory>,
  HistogramPlot: ReturnType<typeof HistogramPlotFactory>,
  LineChartPlot: ReturnType<typeof LineChartFactory>
) {
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
  }: RangePlotProps & Partial<RangeBrushProps>) => {
    const [brushing, setBrushing] = useState(false);
    const [hoveredDP, onMouseMove] = useState<HoverDP | null>(null);
    const [enableChartHover, setEnableChartHover] = useState(false);
    const height = isEnlarged
      ? hasMobileWidth(breakPointValues)
        ? theme.rangePlotHLargePalm
        : theme.rangePlotHLarge
      : theme.rangePlotH;

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
      onBrush,
      ...chartProps
    };

    return (
      <StyledRangePlot
        style={{
          height: `${
            isEnlarged
              ? hasMobileWidth(breakPointValues)
                ? theme.rangePlotContainerHLargePalm
                : theme.rangePlotContainerHLarge
              : theme.rangePlotContainerH
          }px`
        }}
        className="kg-range-slider__plot"
      >
        {plotType === 'lineChart' && lineChart ? (
          <LineChartPlot lineChart={lineChart} {...commonProps} />
        ) : (
          <HistogramPlot histogram={histogram} {...commonProps} />
        )}
      </StyledRangePlot>
    );
  };

  return withTheme(RangePlot);
}
