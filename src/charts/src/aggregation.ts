// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  deviation,
  histogram,
  max as d3Max,
  mean,
  median,
  min as d3Min,
  sum,
  variance as d3Variance
} from 'd3-array';
import {utcDay, utcHour, utcMonth, utcWeek, utcYear} from 'd3-time';

import {
  CHART_COLORS,
  DEFAULT_NUM_GROUPS,
  OTHERS_KEY,
  TIME_FIELD_TYPES,
  NUMERIC_FIELD_TYPES
} from './constants';
import {BinType, SortType} from './constants';
import {
  ChartableDataset,
  ChartAggregation,
  ChartBin,
  ChartAxis,
  HeatmapCell,
  PivotTableResult
} from './types';

export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) {
    return '0';
  }
  if (Math.abs(n) >= 10000) {
    return n.toExponential(2);
  }
  if (Number.isInteger(n)) {
    return String(n);
  }
  return n.toLocaleString(undefined, {maximumFractionDigits: 4});
}

function modeValue(values: number[]): number {
  const counts = new Map<number, number>();
  let best = values[0];
  let bestCount = 0;
  for (const value of values) {
    const next = (counts.get(value) || 0) + 1;
    counts.set(value, next);
    if (next > bestCount) {
      best = value;
      bestCount = next;
    }
  }
  return best;
}

function aggregateValues(values: number[], technique: ChartAggregation | null | undefined): number {
  if (!values.length) {
    return 0;
  }
  switch (technique) {
    case 'sum':
      return sum(values) ?? 0;
    case 'average':
      return mean(values) ?? 0;
    case 'maximum':
      return d3Max(values) ?? 0;
    case 'minimum':
      return d3Min(values) ?? 0;
    case 'median':
      return median(values) ?? 0;
    case 'stdev':
      return deviation(values) ?? 0;
    case 'variance':
      return d3Variance(values) ?? 0;
    case 'mode':
      return modeValue(values);
    case 'countUnique':
      return new Set(values).size;
    case 'count':
    default:
      return values.length;
  }
}

export function getChartIndexes(dataset: ChartableDataset, applyFilters: boolean): number[] {
  return applyFilters ? dataset.filteredIndex : dataset.allIndexes;
}

export function colorAt(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}

export function rgbToCss(rgb?: [number, number, number]): string {
  if (!rgb) {
    return CHART_COLORS[0];
  }
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function toKey(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return String(value);
}

function aggregateIndexes(
  indexes: number[],
  dataset: ChartableDataset,
  valueField: string | undefined,
  aggregation: ChartAggregation | null | undefined
): number {
  if (!indexes.length) {
    return 0;
  }
  const technique = aggregation || 'count';
  if (technique === 'count' || !valueField) {
    return indexes.length;
  }
  const values = indexes
    .map(idx => toNumber(dataset.getValue(valueField, idx)))
    .filter((v): v is number => v !== null);
  if (!values.length) {
    return 0;
  }
  return aggregateValues(values, technique);
}

function sortBins(bins: ChartBin[], sort?: SortType): ChartBin[] {
  const next = [...bins];
  switch (sort) {
    case SortType.ascending:
      next.sort((a, b) => a.value - b.value);
      break;
    case SortType.descending:
      next.sort((a, b) => b.value - a.value);
      break;
    case SortType.alphaAsc:
      next.sort((a, b) => String(a.key).localeCompare(String(b.key)));
      break;
    case SortType.alphaDesc:
      next.sort((a, b) => String(b.key).localeCompare(String(a.key)));
      break;
    default:
      break;
  }
  return next;
}

function truncateBins(bins: ChartBin[], numGroups: number, groupOthers: boolean): ChartBin[] {
  if (numGroups <= 0 || bins.length <= numGroups) {
    return bins;
  }
  const head = bins.slice(0, numGroups);
  if (!groupOthers) {
    return head;
  }
  const rest = bins.slice(numGroups);
  const other: ChartBin = {
    key: OTHERS_KEY,
    value: rest.reduce((sum, bin) => sum + bin.value, 0),
    count: rest.reduce((sum, bin) => sum + bin.count, 0),
    color: colorAt(numGroups)
  };
  return [...head, other];
}

function uniqueGroupMap(
  indexes: number[],
  dataset: ChartableDataset,
  fieldName: string
): Map<string, number[]> {
  const groups = new Map<string, number[]>();
  for (const idx of indexes) {
    const key = toKey(dataset.getValue(fieldName, idx));
    if (!key) {
      continue;
    }
    const list = groups.get(key);
    if (list) {
      list.push(idx);
    } else {
      groups.set(key, [idx]);
    }
  }
  return groups;
}

function numericGroupMap(
  indexes: number[],
  dataset: ChartableDataset,
  fieldName: string,
  numBins: number
): Map<string, number[]> {
  const values = indexes
    .map(idx => ({idx, value: toNumber(dataset.getValue(fieldName, idx))}))
    .filter((d): d is {idx: number; value: number} => d.value !== null);
  if (!values.length) {
    return new Map();
  }
  const hist = histogram<{idx: number; value: number}, number>()
    .value(d => d.value)
    .thresholds(Math.max(2, numBins));
  const bins = hist(values);
  const groups = new Map<string, number[]>();
  bins.forEach(bin => {
    const x0 = bin.x0 ?? 0;
    const x1 = bin.x1 ?? x0;
    const key = `${formatNumber(x0)} – ${formatNumber(x1)}`;
    groups.set(
      key,
      bin.map(d => d.idx)
    );
  });
  return groups;
}

function getTimeFloor(interval?: string) {
  switch (interval) {
    case 'year':
      return utcYear.floor;
    case 'month':
      return utcMonth.floor;
    case 'week':
      return utcWeek.floor;
    case 'hour':
      return utcHour.floor;
    case 'day':
    default:
      return utcDay.floor;
  }
}

function timeGroupMap(
  indexes: number[],
  dataset: ChartableDataset,
  fieldName: string,
  interval?: string
): Map<string, number[]> {
  const floor = getTimeFloor(interval);
  const groups = new Map<string, number[]>();
  for (const idx of indexes) {
    const raw = dataset.getValue(fieldName, idx);
    const date = raw instanceof Date ? raw : new Date(raw);
    if (Number.isNaN(date.getTime())) {
      continue;
    }
    const key = floor(date).toISOString();
    const list = groups.get(key);
    if (list) {
      list.push(idx);
    } else {
      groups.set(key, [idx]);
    }
  }
  return groups;
}

export function groupIndexes(
  indexes: number[],
  dataset: ChartableDataset,
  axis: ChartAxis | undefined,
  numBins = DEFAULT_NUM_GROUPS
): Map<string, number[]> {
  const fieldName = axis?.field?.name;
  if (!fieldName) {
    return new Map([['All', indexes]]);
  }
  const fieldType = axis.field?.type;
  const aggregation = axis.aggregation;
  if (aggregation === BinType.numericBin || NUMERIC_FIELD_TYPES.includes(fieldType || '')) {
    if (aggregation === BinType.numericBin) {
      return numericGroupMap(indexes, dataset, fieldName, numBins);
    }
  }
  if (aggregation === BinType.timeBin || TIME_FIELD_TYPES.includes(fieldType || '')) {
    if (aggregation === BinType.timeBin || TIME_FIELD_TYPES.includes(fieldType || '')) {
      return timeGroupMap(indexes, dataset, fieldName, (axis as any).interval);
    }
  }
  return uniqueGroupMap(indexes, dataset, fieldName);
}

export function buildGroupedBins({
  dataset,
  applyFilters,
  indexes: indexesOverride,
  binAxis,
  valueAxis,
  groupByAxis,
  numGroups = DEFAULT_NUM_GROUPS,
  groupOthers = false,
  sort,
  color
}: {
  dataset: ChartableDataset;
  applyFilters: boolean;
  indexes?: number[];
  binAxis?: ChartAxis;
  valueAxis?: ChartAxis;
  groupByAxis?: ChartAxis;
  numGroups?: number;
  groupOthers?: boolean;
  sort?: SortType;
  color?: string;
}): ChartBin[] {
  const indexes = indexesOverride || getChartIndexes(dataset, applyFilters);
  const groups = groupIndexes(indexes, dataset, binAxis, numGroups);
  const valueField = valueAxis?.field?.name;
  const aggregation = (valueAxis?.aggregation as ChartAggregation) || 'count';
  const groupByField = groupByAxis?.field?.name;

  let bins: ChartBin[] = [];
  let colorIndex = 0;
  groups.forEach((groupIndexesList, key) => {
    const series = groupByField
      ? Array.from(uniqueGroupMap(groupIndexesList, dataset, groupByField).entries()).map(
          ([seriesKey, seriesIndexes], seriesIdx) => ({
            key: seriesKey,
            value: aggregateIndexes(seriesIndexes, dataset, valueField, aggregation),
            count: seriesIndexes.length,
            color: colorAt(seriesIdx)
          })
        )
      : undefined;
    bins.push({
      key,
      value: series
        ? series.reduce((sum, item) => sum + item.value, 0)
        : aggregateIndexes(groupIndexesList, dataset, valueField, aggregation),
      count: groupIndexesList.length,
      color: color || colorAt(colorIndex),
      series
    });
    colorIndex += 1;
  });

  bins = sortBins(bins, sort);
  return truncateBins(bins, numGroups, groupOthers);
}

export function buildBigNumber({
  dataset,
  applyFilters,
  axis
}: {
  dataset: ChartableDataset;
  applyFilters: boolean;
  axis?: ChartAxis;
}): {value: number; count: number} {
  const indexes = getChartIndexes(dataset, applyFilters);
  return {
    count: indexes.length,
    value: aggregateIndexes(
      indexes,
      dataset,
      axis?.field?.name,
      (axis?.aggregation as ChartAggregation) || 'count'
    )
  };
}

export function buildHeatmapCells({
  dataset,
  applyFilters,
  xAxis,
  yAxis,
  valueAxis,
  numGroups = DEFAULT_NUM_GROUPS
}: {
  dataset: ChartableDataset;
  applyFilters: boolean;
  xAxis?: ChartAxis;
  yAxis?: ChartAxis;
  valueAxis?: ChartAxis;
  numGroups?: number;
}): HeatmapCell[] {
  const indexes = getChartIndexes(dataset, applyFilters);
  const xField = xAxis?.field?.name;
  const yField = yAxis?.field?.name;
  if (!xField || !yField) {
    return [];
  }
  const nested = new Map<string, Map<string, number[]>>();
  for (const idx of indexes) {
    const x = toKey(dataset.getValue(xField, idx));
    const y = toKey(dataset.getValue(yField, idx));
    if (!x || !y) {
      continue;
    }
    if (!nested.has(x)) {
      nested.set(x, new Map());
    }
    const yMap = nested.get(x) as Map<string, number[]>;
    const list = yMap.get(y);
    if (list) {
      list.push(idx);
    } else {
      yMap.set(y, [idx]);
    }
  }

  const xKeys = Array.from(nested.keys()).slice(0, numGroups);
  const cells: HeatmapCell[] = [];
  xKeys.forEach(x => {
    const yMap = nested.get(x);
    if (!yMap) {
      return;
    }
    Array.from(yMap.keys())
      .slice(0, numGroups)
      .forEach(y => {
        const idxs = yMap.get(y) || [];
        cells.push({
          x,
          y,
          value: aggregateIndexes(
            idxs,
            dataset,
            valueAxis?.field?.name,
            (valueAxis?.aggregation as ChartAggregation) || 'count'
          )
        });
      });
  });
  return cells;
}

export function buildPivotTable({
  dataset,
  applyFilters,
  rowField,
  columnField,
  valueAxis,
  numGroups = DEFAULT_NUM_GROUPS
}: {
  dataset: ChartableDataset;
  applyFilters: boolean;
  rowField?: string;
  columnField?: string;
  valueAxis?: ChartAxis;
  numGroups?: number;
}): PivotTableResult {
  const empty: PivotTableResult = {rowKeys: [], columnKeys: [], values: {}};
  if (!rowField || !columnField) {
    return empty;
  }
  const indexes = getChartIndexes(dataset, applyFilters);
  const nested = new Map<string, Map<string, number[]>>();
  for (const idx of indexes) {
    const row = toKey(dataset.getValue(rowField, idx));
    const col = toKey(dataset.getValue(columnField, idx));
    if (!row || !col) {
      continue;
    }
    if (!nested.has(row)) {
      nested.set(row, new Map());
    }
    const colMap = nested.get(row) as Map<string, number[]>;
    const list = colMap.get(col);
    if (list) {
      list.push(idx);
    } else {
      colMap.set(col, [idx]);
    }
  }
  const rowKeys = Array.from(nested.keys()).slice(0, numGroups);
  const columnKeySet = new Set<string>();
  nested.forEach(colMap => {
    colMap.forEach((_v, col) => columnKeySet.add(col));
  });
  const columnKeys = Array.from(columnKeySet).slice(0, numGroups);
  const values: Record<string, Record<string, number>> = {};
  rowKeys.forEach(row => {
    values[row] = {};
    columnKeys.forEach(col => {
      const idxs = nested.get(row)?.get(col) || [];
      values[row][col] = aggregateIndexes(
        idxs,
        dataset,
        valueAxis?.field?.name,
        (valueAxis?.aggregation as ChartAggregation) || 'count'
      );
    });
  });
  return {rowKeys, columnKeys, values};
}

export function buildTimeSeries({
  dataset,
  indexes,
  xAxis,
  yAxis,
  interval
}: {
  dataset: ChartableDataset;
  indexes: number[];
  xAxis?: ChartAxis;
  yAxis?: ChartAxis;
  interval?: string;
}): ChartBin[] {
  if (!xAxis?.field?.name) {
    return [];
  }
  const groups = timeGroupMap(indexes, dataset, xAxis.field.name, interval);
  const bins: ChartBin[] = [];
  groups.forEach((groupIndexes, key) => {
    bins.push({
      key,
      value: aggregateIndexes(
        groupIndexes,
        dataset,
        yAxis?.field?.name,
        (yAxis?.aggregation as ChartAggregation) || 'count'
      ),
      count: groupIndexes.length,
      color: CHART_COLORS[0]
    });
  });
  return bins.sort((a, b) => String(a.key).localeCompare(String(b.key)));
}

export {toKey};
