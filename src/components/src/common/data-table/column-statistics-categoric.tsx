// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import styled from 'styled-components';

import {CategoricalColumnStats, isNumber} from '@kepler.gl/utils';

import {
  ColumnStatisticsContainer,
  StatisticRowContainer,
  StatisticRow,
  StyledStatsName,
  TopPlotContainer,
  STATS_MARGIN,
  STATS_WIDTH,
  Margin,
  formatPercent
} from './column-statistics-components';

const StyledHighlightNumber = styled.div`
  font-size: 24px;
  color: ${props => props.theme.activeColorLT};
  width: 100%;
  text-align: center;
`;

export type ColumnStatisticsCategoricalProps = CategoricalColumnStats & {
  width?: number;
  margin?: Margin;
};

const ColumnStatisticsCategorical: React.FC<ColumnStatisticsCategoricalProps> = ({
  width = STATS_WIDTH,
  margin = STATS_MARGIN,
  uniqueValues,
  percentNulls
}) => {
  const nullsRight = useMemo(
    () => (isNumber(percentNulls) ? formatPercent(percentNulls) : null),
    [percentNulls]
  );
  return (
    <ColumnStatisticsContainer width={width} margin={margin}>
      <TopPlotContainer>
        <StatisticRowContainer>
          <StyledStatsName>Unique Values</StyledStatsName>
        </StatisticRowContainer>
        <StyledHighlightNumber>{uniqueValues}</StyledHighlightNumber>
      </TopPlotContainer>
      <StatisticRow
        left="Nulls"
        isBad={isNumber(percentNulls) && percentNulls > 0}
        right={nullsRight}
      />
    </ColumnStatisticsContainer>
  );
};

export default ColumnStatisticsCategorical;
