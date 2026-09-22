// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';

import {formatNumber} from './aggregation';

import {ChartBin, HeatmapCell, PivotTableResult} from './types';
import {ChartViewData} from './compute';

const ChartWrap = styled.div`
  width: 100%;
  padding: 8px 12px 12px;
  box-sizing: border-box;
`;

const EmptyState = styled.div`
  color: ${props => props.theme.subtextColor};
  font-size: 11px;
  padding: 12px 0;
`;

const BigNumberValue = styled.div`
  font-size: 28px;
  font-weight: 500;
  color: ${props => props.theme.textColor};
  line-height: 1.2;
`;

const BigNumberCaption = styled.div`
  font-size: 11px;
  color: ${props => props.theme.subtextColor};
  margin-top: 4px;
`;

const BarRow = styled.div<{$clickable?: boolean}>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 0;
  cursor: ${props => (props.$clickable ? 'pointer' : 'default')};
  &:focus-visible {
    outline: 1px solid ${props => props.theme.activeColor};
    outline-offset: 1px;
  }
`;

const BarLabel = styled.div`
  flex: 0 0 88px;
  font-size: 11px;
  color: ${props => props.theme.textColor};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const BarTrack = styled.div`
  flex: 1;
  height: 10px;
  background: ${props => props.theme.sliderBarBgd};
  border-radius: 2px;
  overflow: hidden;
`;

const BarFill = styled.div<{$color: string; $width: number; $active?: boolean}>`
  height: 100%;
  width: ${props => props.$width}%;
  background: ${props => props.$color};
  opacity: ${props => (props.$active ? 1 : 0.85)};
  outline: ${props => (props.$active ? `1px solid ${props.theme.activeColor}` : 'none')};
`;

const BarValue = styled.div`
  flex: 0 0 52px;
  font-size: 11px;
  text-align: right;
  color: ${props => props.theme.subtextColor};
`;

const HeatGrid = styled.div<{$cols: number}>`
  display: grid;
  grid-template-columns: 72px repeat(${props => props.$cols}, minmax(18px, 1fr));
  gap: 2px;
  font-size: 10px;
`;

const HeatCell = styled.div<{$bg: string; $clickable?: boolean}>`
  min-height: 18px;
  background: ${props => props.$bg};
  cursor: ${props => (props.$clickable ? 'pointer' : 'default')};
  &:focus-visible {
    outline: 1px solid ${props => props.theme.activeColor};
    outline-offset: 1px;
  }
`;

const HeatLabel = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${props => props.theme.subtextColor};
`;

const PivotTableEl = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
  color: ${props => props.theme.textColor};

  th,
  td {
    border: 1px solid ${props => props.theme.panelBorderColor};
    padding: 4px 6px;
    text-align: right;
    color: inherit;
  }
  th {
    color: ${props => props.theme.titleTextColor};
    font-weight: 500;
  }
  th:first-child,
  td:first-child {
    text-align: left;
  }
`;

const LineSvg = styled.svg`
  width: 100%;
  height: 120px;
  display: block;
`;

type ClickHandler = (key: string, extra?: Record<string, string>) => void;

function onActivateKey(event: React.KeyboardEvent, activate?: () => void): void {
  if (!activate) {
    return;
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    activate();
  }
}

function maxValue(bins: ChartBin[]): number {
  return Math.max(1, ...bins.map(bin => bin.value));
}

export function BigNumberView({
  value,
  caption
}: {
  value: number;
  caption?: string;
}): React.ReactElement {
  return (
    <ChartWrap>
      <BigNumberValue>{formatNumber(value)}</BigNumberValue>
      {caption ? <BigNumberCaption>{caption}</BigNumberCaption> : null}
    </ChartWrap>
  );
}

export function BarChartView({
  bins,
  horizontal = false,
  selectedKey,
  onSelect
}: {
  bins: ChartBin[];
  horizontal?: boolean;
  selectedKey?: string;
  onSelect?: ClickHandler;
}): React.ReactElement {
  if (!bins.length) {
    return (
      <ChartWrap>
        <EmptyState>Select a category field to plot this chart.</EmptyState>
      </ChartWrap>
    );
  }
  const max = maxValue(bins);
  return (
    <ChartWrap className={horizontal ? 'horizontal-bar-chart' : 'bar-chart'}>
      {bins.map(bin => {
        const activate = onSelect ? () => onSelect(String(bin.key)) : undefined;
        const selected = selectedKey === String(bin.key);
        return (
          <BarRow
            key={bin.key}
            $clickable={Boolean(activate)}
            role={activate ? 'button' : undefined}
            tabIndex={activate ? 0 : undefined}
            aria-pressed={activate ? selected : undefined}
            aria-label={`${bin.key}: ${formatNumber(bin.value)}`}
            onClick={activate}
            onKeyDown={event => onActivateKey(event, activate)}
            title={`${bin.key}: ${formatNumber(bin.value)}`}
          >
            <BarLabel>{bin.key}</BarLabel>
            <BarTrack>
              <BarFill $color={bin.color} $width={(bin.value / max) * 100} $active={selected} />
            </BarTrack>
            <BarValue>{formatNumber(bin.value)}</BarValue>
          </BarRow>
        );
      })}
    </ChartWrap>
  );
}

export function LineChartView({bins}: {bins: ChartBin[]}): React.ReactElement {
  if (bins.length < 2) {
    return (
      <ChartWrap>
        <EmptyState>Need at least two points for a line chart.</EmptyState>
      </ChartWrap>
    );
  }
  const max = maxValue(bins);
  const min = Math.min(0, ...bins.map(b => b.value));
  const span = Math.max(1, max - min);
  const points = bins
    .map((bin, i) => {
      const x = (i / (bins.length - 1)) * 100;
      const y = 100 - ((bin.value - min) / span) * 100;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <ChartWrap>
      <LineSvg viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline fill="none" stroke={bins[0].color} strokeWidth="2" points={points} />
      </LineSvg>
    </ChartWrap>
  );
}

function heatColor(value: number, max: number): string {
  const t = max <= 0 ? 0 : value / max;
  const r = Math.round(18 + t * 237);
  const g = Math.round(63 + (1 - t) * 80);
  const b = Math.round(90 + (1 - t) * 60);
  return `rgb(${r}, ${g}, ${b})`;
}

export function HeatmapView({
  cells,
  onSelect
}: {
  cells: HeatmapCell[];
  onSelect?: ClickHandler;
}): React.ReactElement {
  if (!cells.length) {
    return (
      <ChartWrap>
        <EmptyState>Select X and Y fields to plot this heatmap.</EmptyState>
      </ChartWrap>
    );
  }
  const xs = Array.from(new Set(cells.map(c => c.x)));
  const ys = Array.from(new Set(cells.map(c => c.y)));
  const max = Math.max(1, ...cells.map(c => c.value));
  const lookup = new Map(cells.map(c => [`${c.x}|${c.y}`, c]));
  return (
    <ChartWrap>
      <HeatGrid $cols={xs.length}>
        <div />
        {xs.map(x => (
          <HeatLabel key={`h-${x}`} title={x}>
            {x}
          </HeatLabel>
        ))}
        {ys.map(y => (
          <React.Fragment key={`r-${y}`}>
            <HeatLabel title={y}>{y}</HeatLabel>
            {xs.map(x => {
              const cell = lookup.get(`${x}|${y}`);
              const value = cell?.value ?? 0;
              const activate = onSelect ? () => onSelect(x, {x, y}) : undefined;
              return (
                <HeatCell
                  key={`${x}|${y}`}
                  $bg={heatColor(value, max)}
                  $clickable={Boolean(activate)}
                  role={activate ? 'button' : undefined}
                  tabIndex={activate ? 0 : undefined}
                  aria-label={`${x} / ${y}: ${formatNumber(value)}`}
                  title={`${x} / ${y}: ${formatNumber(value)}`}
                  onClick={activate}
                  onKeyDown={event => onActivateKey(event, activate)}
                />
              );
            })}
          </React.Fragment>
        ))}
      </HeatGrid>
    </ChartWrap>
  );
}

export function PivotTableView({table}: {table: PivotTableResult}): React.ReactElement {
  if (!table.rowKeys.length || !table.columnKeys.length) {
    return (
      <ChartWrap>
        <EmptyState>Select row and column fields for the pivot table.</EmptyState>
      </ChartWrap>
    );
  }
  return (
    <ChartWrap>
      <PivotTableEl>
        <thead>
          <tr>
            <th />
            {table.columnKeys.map(col => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rowKeys.map(row => (
            <tr key={row}>
              <td>{row}</td>
              {table.columnKeys.map(col => (
                <td key={col}>{formatNumber(table.values[row]?.[col] ?? 0)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </PivotTableEl>
    </ChartWrap>
  );
}

export function ChartRenderer({
  data,
  selectedKey,
  onSelect
}: {
  data: ChartViewData;
  selectedKey?: string;
  onSelect?: ClickHandler;
}): React.ReactElement {
  switch (data.kind) {
    case 'bigNumber':
      return <BigNumberView value={data.value} caption={data.caption} />;
    case 'bars':
      return (
        <BarChartView
          bins={data.bins}
          horizontal={data.horizontal}
          selectedKey={selectedKey}
          onSelect={onSelect}
        />
      );
    case 'line':
      return <LineChartView bins={data.bins} />;
    case 'heatmap':
      return <HeatmapView cells={data.cells} onSelect={onSelect} />;
    case 'pivot':
      return <PivotTableView table={data.table} />;
    case 'empty':
    default:
      return (
        <ChartWrap>
          <EmptyState>{data.kind === 'empty' ? data.message : undefined}</EmptyState>
        </ChartWrap>
      );
  }
}

export {EmptyState, ChartWrap};
