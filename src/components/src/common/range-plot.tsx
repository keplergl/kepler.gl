// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo, useState, useEffect, CSSProperties} from 'react';
import styled, {withTheme} from 'styled-components';
import RangeBrushFactory, {OnBrush, RangeBrushProps} from './range-brush';
import HistogramPlotFactory from './histogram-plot';
import LineChartFactory, {HoverDP} from './line-chart';
import {hasMobileWidth, isTest} from '@kepler.gl/utils';
import {PLOT_TYPES} from '@kepler.gl/constants';
import LoadingSpinner from './loading-spinner';
import {breakPointValues} from '@kepler.gl/styles';
import {LineChart as LineChartType, Filter, Bins} from '@kepler.gl/types';
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
  plotType: {
    [key: string]: any;
  };
  lineChart?: LineChartType;
  bins?: Bins;

  isEnlarged?: boolean;
  isRanged?: boolean;
  theme: any;
  timeFormat?: string;
  timezone?: string | null;
  playbackControlWidth?: number;

  animationWindow?: string;
  filter?: Filter;
  datasets?: Datasets;

  invertTrendColor?: boolean;

  style: CSSProperties;
}

type WithPlotLoadingProps = RangePlotProps &
  Partial<RangeBrushProps> & {
    setFilterPlot: any;
  };

RangePlotFactory.deps = [RangeBrushFactory, HistogramPlotFactory, LineChartFactory];

const isHistogramPlot = plotType => plotType?.type === PLOT_TYPES.histogram;
const isLineChart = plotType => plotType?.type === PLOT_TYPES.lineChart;
const hasHistogram = (plotType, bins) => isHistogramPlot(plotType) && bins;
const hasLineChart = (plotType, lineChart) => isLineChart(plotType) && lineChart;

export default function RangePlotFactory(
  RangeBrush: ReturnType<typeof RangeBrushFactory>,
  HistogramPlot: ReturnType<typeof HistogramPlotFactory>,
  LineChartPlot: ReturnType<typeof LineChartFactory>
) {
  const RangePlot = ({
    bins,
    onBrush,
    range,
    value,
    width,
    plotType,
    lineChart,
    isEnlarged,
    isRanged,
    theme,
    ...chartProps
  }: RangePlotProps & Partial<RangeBrushProps>) => {
    const groupColors = useMemo(() => {
      const dataIds = bins ? Object.keys(bins) : [];
      return plotType.colorsByDataId
        ? dataIds.reduce((acc, dataId) => {
            acc[dataId] = plotType.colorsByDataId[dataId];
            return acc;
          }, {})
        : null;
    }, [bins, plotType.colorsByDataId]);

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

    return isLineChart(plotType) && lineChart ? (
      <LineChartPlot lineChart={lineChart} {...commonProps} />
    ) : (
      <HistogramPlot
        histogramsByGroup={bins}
        colorsByGroup={groupColors}
        range={range}
        {...commonProps}
      />
    );
  };

  const RangePlotWithTheme = withTheme(RangePlot);

  // a container to render spinner or message when the data is too big
  // to generate a plot
  const WithPlotLoading = ({
    lineChart,
    plotType,
    bins,
    setFilterPlot,
    isEnlarged,
    theme,
    ...otherProps
  }: WithPlotLoadingProps) => {
    const [isLoading, setIsLoading] = useState(false);
    // eslint-disable-next-line complexity
    useEffect(() => {
      if (!plotType && !isLoading) {
        // if plotType is undefined. this shouldn't happen
        setIsLoading(true);
        setFilterPlot({
          plotType: {
            type: PLOT_TYPES.histogram
          }
        });
      } else if (isHistogramPlot(plotType) && !bins && !isLoading) {
        setIsLoading(true);
        // load histogram
        setFilterPlot({
          plotType: {
            type: PLOT_TYPES.histogram
          }
        });
      } else if (isLineChart(plotType) && !lineChart && !isLoading) {
        // load line chart
        setIsLoading(true);
        setFilterPlot({
          plotType: {
            type: PLOT_TYPES.lineChart
          }
        });
      } else if (isLoading && (hasHistogram(plotType, bins) || hasLineChart(plotType, lineChart))) {
        setIsLoading(false);
      }
    }, [plotType, bins, lineChart, setFilterPlot, isLoading, setIsLoading]);

    const rangePlotStyle = useMemo(
      () => ({
        height: `${
          isEnlarged
            ? hasMobileWidth(breakPointValues)
              ? theme.rangePlotContainerHLargePalm
              : theme.rangePlotContainerHLarge
            : theme.rangePlotContainerH
        }px`
      }),
      [isEnlarged, theme]
    );

    return (
      <StyledRangePlot style={rangePlotStyle} className="kg-range-slider__plot">
        {isLoading ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%'
            }}
          >
            <LoadingSpinner borderColor="transparent" size={40} />
          </div>
        ) : (
          <RangePlotWithTheme
            lineChart={lineChart}
            bins={bins}
            plotType={plotType}
            isEnlarged={isEnlarged}
            theme={theme}
            {...otherProps}
          />
        )}
      </StyledRangePlot>
    );
  };

  return withTheme(WithPlotLoading);
}
