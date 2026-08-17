// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';

export type Margin = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

export const STATS_WIDTH = 180;
export const STATS_MARGIN: Margin = {top: 10, left: 10, right: 10, bottom: 10};
export const HISTOGRAM_MARGIN: Margin = {top: 10, left: 0, right: 0, bottom: 10};
export const HISTOGRAM_HEIGHT = 50;

type ColumnStatisticsContainerProps = {
  width: number;
  margin: Margin;
};

export const ColumnStatisticsContainer = styled.div.withConfig({
  shouldForwardProp: prop => prop !== 'width' && prop !== 'margin'
})<ColumnStatisticsContainerProps>`
  width: 100%;
  box-sizing: border-box;
  padding-top: ${props => props.margin.top}px;
  padding-bottom: ${props => props.margin.bottom}px;
  padding-left: ${props => props.margin.left}px;
  padding-right: ${props => props.margin.right}px;
  hr {
    border: 0;
    border-top: 1px solid ${props => props.theme.cellBorderColor};
    margin: 8px 0;
  }
`;

export const StatisticRowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  column-gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
  font-size: ${props => props.theme.cellFontSize}px;
  line-height: 1.2;
  &:last-child {
    margin-bottom: 0;
  }
`;

type StyledStatsNameProps = {
  $isBad?: boolean;
};

export const StyledStatsName = styled.div<StyledStatsNameProps>`
  flex-shrink: 0;
  color: ${props =>
    props.$isBad ? props.theme.notificationColors?.error || '#f25138' : props.theme.subtextColor};
`;

export const StyledStatsValue = styled.div`
  color: ${props => props.theme.dataTableTextColor};
  white-space: nowrap;
  text-align: right;
  margin-left: auto;
`;

export const TopPlotContainer = styled.div`
  margin-bottom: 12px;
  height: ${HISTOGRAM_HEIGHT + HISTOGRAM_MARGIN.top + HISTOGRAM_MARGIN.bottom}px;
`;

type StatisticRowProps = {
  left: string;
  right: string | null;
  isBad?: boolean;
};

export const StatisticRow: React.FC<StatisticRowProps> = ({left, isBad, right}) => (
  <StatisticRowContainer>
    <StyledStatsName $isBad={isBad}>{left}</StyledStatsName>
    {typeof right === 'string' ? <StyledStatsValue>{right}</StyledStatsValue> : null}
  </StatisticRowContainer>
);

export function formatPercent(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}
