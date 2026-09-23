// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';

import {formatNumber} from './aggregation';

import {ChartBin, HeatmapCell, PivotTableResult} from './types';
import {ChartViewData} from './compute';

const ChartWrap = styled.div`
  width: 100%;
  padding: 8px 12px 8px;
  box-sizing: border-box;
  overflow: visible;
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
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: ${props => props.theme.subtextColor};
  margin-top: 4px;
`;

const BigNumberCaptionText = styled.span`
  min-width: 0;
`;

const BigNumberCaptionToggle = styled.button`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${props => props.theme.subtextColor};
  cursor: pointer;
  line-height: 0;

  &:hover {
    color: ${props => props.theme.textColor};
  }
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
  flex: 0 1 auto;
  max-width: 40%;
  min-width: 72px;
  font-size: 11px;
  color: ${props => props.theme.textColor};
  white-space: normal;
  overflow-wrap: anywhere;
  line-height: 1.2;
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
  flex: 0 0 auto;
  min-width: 52px;
  font-size: 11px;
  text-align: right;
  color: ${props => props.theme.subtextColor};
  white-space: nowrap;
`;

const VerticalBarChart = styled.div<{$padRight?: number; $gap?: number}>`
  display: flex;
  flex-direction: column;
  gap: ${props => props.$gap ?? 20}px;
  overflow: visible;
  padding-right: ${props => props.$padRight || 0}px;
  box-sizing: border-box;
`;

const VerticalBarBars = styled.div`
  display: flex;
  align-items: stretch;
  gap: 8px;
  height: 140px;
  min-height: 140px;
  overflow: visible;
`;

const VerticalBarCol = styled.div<{$clickable?: boolean}>`
  flex: 1 1 0;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  overflow: visible;
  cursor: ${props => (props.$clickable ? 'pointer' : 'default')};
  &:focus-visible {
    outline: 1px solid ${props => props.theme.activeColor};
    outline-offset: 1px;
  }
`;

const VerticalBarValue = styled.div`
  flex: 0 0 auto;
  font-size: 10px;
  line-height: 1.1;
  color: ${props => props.theme.subtextColor};
  white-space: nowrap;
  overflow: visible;
  text-align: center;
`;

const VerticalBarTrack = styled.div`
  flex: 1 1 auto;
  width: 100%;
  max-width: 32px;
  min-height: 0;
  display: flex;
  align-items: flex-end;
  background: ${props => props.theme.sliderBarBgd};
  border-radius: 2px;
  overflow: hidden;
`;

const VerticalBarFill = styled.div<{$color: string; $height: number; $active?: boolean}>`
  width: 100%;
  height: ${props => props.$height}%;
  background: ${props => props.$color};
  opacity: ${props => (props.$active ? 1 : 0.85)};
  outline: ${props => (props.$active ? `1px solid ${props.theme.activeColor}` : 'none')};
`;

const VerticalBarLabels = styled.div<{$height: number; $rotated?: boolean}>`
  display: flex;
  /* Top-align rotated labels so they hang down into the band instead of into the bars. */
  align-items: ${props => (props.$rotated ? 'flex-start' : 'center')};
  gap: 8px;
  height: ${props => props.$height}px;
  overflow: visible;
`;

const VerticalBarLabelCell = styled.div<{$rotated?: boolean}>`
  flex: 1 1 0;
  min-width: 0;
  height: 100%;
  display: flex;
  align-items: ${props => (props.$rotated ? 'flex-start' : 'center')};
  justify-content: ${props => (props.$rotated ? 'flex-start' : 'center')};
  overflow: visible;
`;

const VerticalBarLabel = styled.div<{$rotated?: boolean}>`
  font-size: 10px;
  color: ${props => props.theme.textColor};
  white-space: nowrap;
  overflow: visible;
  /* Clockwise so text hangs down-right from top-left into the label band (not up into bars). */
  transform: ${props => (props.$rotated ? `rotate(${LABEL_ROTATE_DEG}deg)` : 'none')};
  transform-origin: top left;
  line-height: 1.1;
  pointer-events: none;
`;

/** ~px per character at 10px font; used to decide rotation + label band height. */
const LABEL_CHAR_WIDTH = 6;
const LABEL_ROTATE_DEG = 40;
/** Approximate chart plot width inside the panel (for fit checks). */
const VERTICAL_BAR_PLOT_WIDTH = 260;

function getVerticalBarLabelLayout(bins: ChartBin[]): {
  rotated: boolean;
  labelBand: number;
  padRight: number;
  gap: number;
} {
  const maxLen = Math.max(1, ...bins.map(bin => String(bin.key).length));
  const slotWidth = VERTICAL_BAR_PLOT_WIDTH / Math.max(1, bins.length);
  const labelWidth = maxLen * LABEL_CHAR_WIDTH;
  // Keep short labels horizontal (Studio-like); rotate when they won't fit in their slot.
  const rotated = labelWidth > slotWidth * 0.9 || maxLen > 8;
  if (!rotated) {
    return {rotated: false, labelBand: 5, padRight: 0, gap: 6};
  }
  const sin = Math.sin((LABEL_ROTATE_DEG * Math.PI) / 180);
  // Full downward projection of the angled label (origin is top-left, rotates clockwise).
  const projectedHeight = labelWidth * sin + 10;
  // Small fixed clearance under bars; length is absorbed by the label band below.
  return {
    rotated: true,
    labelBand: Math.max(24, Math.ceil(projectedHeight)),
    padRight: 2,
    gap: 8
  };
}

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
  height: 160px;
  display: block;
  overflow: visible;
  color: ${props => props.theme.textColor};
`;

const LINE_CHART_WIDTH = 320;
const LINE_CHART_HEIGHT = 160;
const LINE_MARGIN = {top: 12, right: 12, bottom: 40, left: 56};
const LINE_Y_AXIS_TITLE_X = 10;

type ClickHandler = (
  key: string,
  extra?: {filterValue?: Array<string | number>; x?: string; y?: string}
) => void;

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
  caption,
  formattedValue,
  showCaption = true,
  onToggleCaption,
  captionToggleIcon,
  captionToggleLabel
}: {
  value: number;
  caption?: string;
  formattedValue?: string;
  showCaption?: boolean;
  onToggleCaption?: () => void;
  captionToggleIcon?: React.ReactNode;
  captionToggleLabel?: string;
}): React.ReactElement {
  const captionVisible = showCaption !== false && Boolean(caption);
  const toggleLabel = captionToggleLabel || (captionVisible ? 'Hide caption' : 'Show caption');
  return (
    <ChartWrap>
      <BigNumberValue>{formattedValue ?? formatNumber(value)}</BigNumberValue>
      {captionVisible ? (
        <BigNumberCaption>
          <BigNumberCaptionText>{caption}</BigNumberCaptionText>
          {onToggleCaption && captionToggleIcon ? (
            <BigNumberCaptionToggle
              type="button"
              aria-label={toggleLabel}
              title={toggleLabel}
              onClick={event => {
                event.stopPropagation();
                onToggleCaption();
              }}
            >
              {captionToggleIcon}
            </BigNumberCaptionToggle>
          ) : null}
        </BigNumberCaption>
      ) : onToggleCaption && captionToggleIcon ? (
        <BigNumberCaption>
          <BigNumberCaptionToggle
            type="button"
            aria-label={toggleLabel}
            title={toggleLabel}
            onClick={event => {
              event.stopPropagation();
              onToggleCaption();
            }}
          >
            {captionToggleIcon}
          </BigNumberCaptionToggle>
        </BigNumberCaption>
      ) : null}
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

  if (!horizontal) {
    const {rotated, labelBand, padRight, gap} = getVerticalBarLabelLayout(bins);
    return (
      <ChartWrap className="bar-chart">
        <VerticalBarChart $padRight={padRight} $gap={gap}>
          <VerticalBarBars>
            {bins.map(bin => {
              const activate = onSelect
                ? () => onSelect(String(bin.key), {filterValue: bin.filterValue})
                : undefined;
              const selected = selectedKey === String(bin.key);
              return (
                <VerticalBarCol
                  key={bin.key}
                  $clickable={Boolean(activate)}
                  role={activate ? 'button' : undefined}
                  tabIndex={activate ? 0 : undefined}
                  aria-pressed={activate ? selected : undefined}
                  aria-label={`${bin.key}: ${formatNumber(bin.value)}`}
                  onClick={activate}
                  onKeyDown={event => onActivateKey(event, activate)}
                >
                  <VerticalBarValue>{formatNumber(bin.value)}</VerticalBarValue>
                  <VerticalBarTrack>
                    <VerticalBarFill
                      $color={bin.color}
                      $height={(bin.value / max) * 100}
                      $active={selected}
                    />
                  </VerticalBarTrack>
                </VerticalBarCol>
              );
            })}
          </VerticalBarBars>
          <VerticalBarLabels $height={labelBand} $rotated={rotated}>
            {bins.map(bin => (
              <VerticalBarLabelCell key={`label-${bin.key}`} $rotated={rotated}>
                <VerticalBarLabel $rotated={rotated}>{bin.key}</VerticalBarLabel>
              </VerticalBarLabelCell>
            ))}
          </VerticalBarLabels>
        </VerticalBarChart>
      </ChartWrap>
    );
  }

  return (
    <ChartWrap className="horizontal-bar-chart">
      {bins.map(bin => {
        const activate = onSelect
          ? () => onSelect(String(bin.key), {filterValue: bin.filterValue})
          : undefined;
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

function niceTicks(min: number, max: number, count = 4): number[] {
  if (!(max > min)) {
    return [min];
  }
  const span = max - min;
  const step = span / Math.max(1, count - 1);
  const ticks: number[] = [];
  for (let i = 0; i < count; i++) {
    ticks.push(min + step * i);
  }
  return ticks;
}

function sampleBinIndexes(length: number, count = 4): number[] {
  if (length <= 0) {
    return [];
  }
  if (length <= count) {
    return Array.from({length}, (_, i) => i);
  }
  const indexes = new Set<number>();
  for (let i = 0; i < count; i++) {
    indexes.add(Math.round((i * (length - 1)) / (count - 1)));
  }
  return Array.from(indexes).sort((a, b) => a - b);
}

function shortenAxisLabel(label: string, maxLen = 12): string {
  const text = String(label);
  if (text.length <= maxLen) {
    return text;
  }
  // Prefer date-looking prefixes when present.
  const dateMatch = text.match(/^\d{4}-\d{2}-\d{2}/);
  if (dateMatch) {
    return dateMatch[0];
  }
  return `${text.slice(0, maxLen - 1)}…`;
}

export function LineChartView({
  bins,
  xLabel,
  yLabel
}: {
  bins: ChartBin[];
  xLabel?: string;
  yLabel?: string;
}): React.ReactElement {
  if (bins.length < 2) {
    return (
      <ChartWrap>
        <EmptyState>Need at least two points for a line chart.</EmptyState>
      </ChartWrap>
    );
  }
  const values = bins.map(b => b.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = Math.max(1e-9, max - min);
  const plotW = LINE_CHART_WIDTH - LINE_MARGIN.left - LINE_MARGIN.right;
  const plotH = LINE_CHART_HEIGHT - LINE_MARGIN.top - LINE_MARGIN.bottom;
  const points = bins.map((bin, i) => {
    const x = LINE_MARGIN.left + (i / (bins.length - 1)) * plotW;
    const y = LINE_MARGIN.top + (1 - (bin.value - min) / span) * plotH;
    return `${x},${y}`;
  });
  const yTicks = niceTicks(min, max, 4);
  const xIndexes = sampleBinIndexes(bins.length, Math.min(4, bins.length));
  const stroke = bins[0].color || '#1F71C5';

  return (
    <ChartWrap>
      <LineSvg
        viewBox={`0 0 ${LINE_CHART_WIDTH} ${LINE_CHART_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Plot frame */}
        <rect
          x={LINE_MARGIN.left}
          y={LINE_MARGIN.top}
          width={plotW}
          height={plotH}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.15}
          strokeWidth={1}
        />
        {/* Y grid + ticks */}
        {yTicks.map(tick => {
          const y = LINE_MARGIN.top + (1 - (tick - min) / span) * plotH;
          return (
            <g key={`y-${tick}`}>
              <line
                x1={LINE_MARGIN.left}
                x2={LINE_MARGIN.left + plotW}
                y1={y}
                y2={y}
                stroke="currentColor"
                strokeOpacity={0.08}
                strokeWidth={1}
              />
              <text
                x={LINE_MARGIN.left - 4}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                fill="currentColor"
                opacity={0.9}
                fontSize={9}
              >
                {formatNumber(tick)}
              </text>
            </g>
          );
        })}
        {/* X ticks */}
        {xIndexes.map(index => {
          const x = LINE_MARGIN.left + (index / (bins.length - 1)) * plotW;
          return (
            <g key={`x-${index}`}>
              <line
                x1={x}
                x2={x}
                y1={LINE_MARGIN.top + plotH}
                y2={LINE_MARGIN.top + plotH + 4}
                stroke="currentColor"
                strokeOpacity={0.35}
                strokeWidth={1}
              />
              <text
                x={x}
                y={LINE_MARGIN.top + plotH + 14}
                textAnchor="middle"
                fill="currentColor"
                opacity={0.9}
                fontSize={9}
              >
                {shortenAxisLabel(String(bins[index].key))}
              </text>
            </g>
          );
        })}
        <polyline
          fill="none"
          stroke={stroke}
          strokeWidth={1.25}
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points.join(' ')}
        />
        {/* Axis names */}
        {yLabel ? (
          <text
            x={LINE_Y_AXIS_TITLE_X}
            y={LINE_MARGIN.top + plotH / 2}
            textAnchor="middle"
            fill="currentColor"
            opacity={1}
            fontSize={10}
            transform={`rotate(-90 ${LINE_Y_AXIS_TITLE_X} ${LINE_MARGIN.top + plotH / 2})`}
          >
            {shortenAxisLabel(yLabel, 18)}
          </text>
        ) : null}
        {xLabel ? (
          <text
            x={LINE_MARGIN.left + plotW / 2}
            y={LINE_CHART_HEIGHT - 4}
            textAnchor="middle"
            fill="currentColor"
            opacity={1}
            fontSize={10}
          >
            {shortenAxisLabel(xLabel, 24)}
          </text>
        ) : null}
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
  onSelect,
  showCaption,
  onToggleCaption,
  captionToggleIcon,
  captionToggleLabel
}: {
  data: ChartViewData;
  selectedKey?: string;
  onSelect?: ClickHandler;
  showCaption?: boolean;
  onToggleCaption?: () => void;
  captionToggleIcon?: React.ReactNode;
  captionToggleLabel?: string;
}): React.ReactElement {
  switch (data.kind) {
    case 'bigNumber':
      return (
        <BigNumberView
          value={data.value}
          caption={data.caption}
          formattedValue={data.formattedValue}
          showCaption={showCaption}
          onToggleCaption={onToggleCaption}
          captionToggleIcon={captionToggleIcon}
          captionToggleLabel={captionToggleLabel}
        />
      );
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
      return <LineChartView bins={data.bins} xLabel={data.xLabel} yLabel={data.yLabel} />;
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
