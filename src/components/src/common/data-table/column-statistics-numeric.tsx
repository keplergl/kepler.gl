// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';

import {NumericColumnStats, formatNumber, isNumber, roundToFour} from '@kepler.gl/utils';

import HistogramPlotFactory, {HistogramPlotProps} from '../histogram-plot';
import {
  STATS_WIDTH,
  STATS_MARGIN,
  HISTOGRAM_MARGIN,
  HISTOGRAM_HEIGHT,
  TopPlotContainer,
  ColumnStatisticsContainer,
  StatisticRow,
  formatPercent
} from './column-statistics-components';

export type ColumnStatisticsNumericProps = NumericColumnStats & {
  width?: number;
  margin?: {top: number; left: number; right: number; bottom: number};
  type?: string;
};

const VALUE = [-Infinity, Infinity];

ColumnStatisticsNumericFactory.deps = [HistogramPlotFactory];
function ColumnStatisticsNumericFactory(
  HistogramPlot: React.FC<HistogramPlotProps>
): React.FC<ColumnStatisticsNumericProps> {
  const ColumnStatisticsNumeric: React.FC<ColumnStatisticsNumericProps> = ({
    bins,
    quantiles = [],
    mean,
    std,
    percentNulls,
    width = STATS_WIDTH,
    margin = STATS_MARGIN
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
    const meanRight = useMemo(() => (isNumber(mean) ? formatNumber(mean, 'real') : null), [mean]);
    const stdRight = useMemo(() => (isNumber(std) ? formatNumber(std, 'real') : null), [std]);
    const quantileDisplays = useMemo(
      () =>
        quantiles.map(row => ({
          label: row.label,
          value: isNumber(row.value)
            ? String(Number.isInteger(row.value) ? row.value : roundToFour(row.value))
            : null
        })),
      [quantiles]
    );

    return (
      <ColumnStatisticsContainer width={width} margin={margin}>
        <TopPlotContainer>
          <HistogramPlot
            histogramsByGroup={histogramsByGroup}
            margin={HISTOGRAM_MARGIN}
            width={histogramWidth}
            height={HISTOGRAM_HEIGHT}
            value={VALUE}
          />
        </TopPlotContainer>
        <StatisticRow
          left="Nulls"
          isBad={isNumber(percentNulls) && percentNulls > 0}
          right={nullsRight}
        />
        <StatisticRow left="Mean" right={meanRight} />
        <StatisticRow left="Std. Dev." right={stdRight} />
        <hr />
        <StatisticRow left="Quantiles" right={null} />
        {quantileDisplays.map((row, index) => (
          <StatisticRow left={row.label} right={row.value} key={index} />
        ))}
      </ColumnStatisticsContainer>
    );
  };

  return ColumnStatisticsNumeric;
}
export default ColumnStatisticsNumericFactory;
