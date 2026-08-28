// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';

import {TimeColumnStats, datetimeFormatter, isNumber} from '@kepler.gl/utils';

import HistogramPlotFactory, {HistogramPlotProps} from '../histogram-plot';
import {
  STATS_WIDTH,
  STATS_MARGIN,
  HISTOGRAM_MARGIN,
  HISTOGRAM_HEIGHT,
  StatisticRow,
  ColumnStatisticsContainer,
  TopPlotContainer,
  formatPercent
} from './column-statistics-components';

export type ColumnStatisticsTimeProps = TimeColumnStats & {
  width?: number;
  margin?: {top: number; left: number; right: number; bottom: number};
  type?: string;
  format?: string;
};

const HISTOGRAM_VALUE = [-Infinity, Infinity];

ColumnStatisticsTimeFactory.deps = [HistogramPlotFactory];
function ColumnStatisticsTimeFactory(
  HistogramPlot: React.FC<HistogramPlotProps>
): React.FC<ColumnStatisticsTimeProps> {
  const ColumnStatisticsTime: React.FC<ColumnStatisticsTimeProps> = ({
    bins,
    min,
    max,
    percentNulls,
    width = STATS_WIDTH,
    margin = STATS_MARGIN,
    format
  }) => {
    const histogramWidth = width - margin.left - margin.right;
    const histogramsByGroup = useMemo(
      () => ({
        bins
      }),
      [bins]
    );

    const nullsRight = useMemo(
      () => (isNumber(percentNulls) ? formatPercent(percentNulls) : null),
      [percentNulls]
    );
    const startRight = useMemo(
      () => (isNumber(min) ? datetimeFormatter(null)(format)(min) : null),
      [min, format]
    );
    const endRight = useMemo(
      () => (isNumber(max) ? datetimeFormatter(null)(format)(max) : null),
      [max, format]
    );
    return (
      <ColumnStatisticsContainer width={width} margin={margin}>
        <TopPlotContainer>
          <HistogramPlot
            histogramsByGroup={histogramsByGroup}
            margin={HISTOGRAM_MARGIN}
            width={histogramWidth}
            height={HISTOGRAM_HEIGHT}
            value={HISTOGRAM_VALUE}
          />
        </TopPlotContainer>
        <StatisticRow
          left="Nulls"
          isBad={isNumber(percentNulls) && percentNulls > 0}
          right={nullsRight}
        />
        <StatisticRow left="Start" right={startRight} />
        <StatisticRow left="End" right={endRight} />
      </ColumnStatisticsContainer>
    );
  };

  return ColumnStatisticsTime;
}
export default ColumnStatisticsTimeFactory;
