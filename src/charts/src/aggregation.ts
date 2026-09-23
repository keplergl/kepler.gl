// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  deviation,
  histogram,
  max as d3Max,
  mean,
  median,
  min as d3Min,
  quantile,
  sum,
  variance as d3Variance
} from 'd3-array';
import {utcDay, utcHour, utcMonth, utcWeek, utcYear} from 'd3-time';

import {
  CHART_COLORS,
  DEFAULT_NUM_GROUPS,
  MAX_CHART_POINTS,
  OTHERS_KEY,
  TIME_FIELD_TYPES
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

const PERCENTILE_AGGREGATIONS: Partial<Record<ChartAggregation, number>> = {
  p05: 0.05,
  p25: 0.25,
  p50: 0.5,
  p75: 0.75,
  p95: 0.95
};

/**
 * Format chart values for display. Prefer compact SI suffixes for large
 * magnitudes so Big Number (and other chart labels) never fall back to
 * scientific notation like `7.67e+5`.
 */
export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) {
    return '0';
  }

  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';

  const compact = (value: number, suffix: string, digits: number): string => {
    const scaled =
      value / (suffix === 'k' ? 1e3 : suffix === 'M' ? 1e6 : suffix === 'G' ? 1e9 : 1e12);
    const rounded = Number(scaled.toFixed(digits));
    return `${sign}${rounded}${suffix}`;
  };

  if (abs >= 1e12) {
    return compact(abs, 'T', 2);
  }
  if (abs >= 1e9) {
    return compact(abs, 'G', 2);
  }
  if (abs >= 1e6) {
    return compact(abs, 'M', 2);
  }
  if (abs >= 10000) {
    return compact(abs, 'k', 1);
  }
  if (abs >= 1000) {
    return `${sign}${Math.round(abs).toLocaleString('en-US')}`;
  }
  if (Number.isInteger(n)) {
    return String(n);
  }
  return Number(n.toPrecision(4)).toString();
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
    case 'p05':
    case 'p25':
    case 'p50':
    case 'p75':
    case 'p95':
      return quantile(values, PERCENTILE_AGGREGATIONS[technique] as number) ?? 0;
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
  // Count unique / mode should consider raw field values (incl. categorical),
  // not only values that coerce to numbers.
  if (technique === 'countUnique') {
    const keys = new Set<string>();
    for (const idx of indexes) {
      const key = toKey(dataset.getValue(valueField, idx));
      if (key) {
        keys.add(key);
      }
    }
    return keys.size;
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

/**
 * Build interior thresholds for exactly `numBins` equal-width bins over [min, max].
 * d3.bin treats a numeric thresholds() argument as a *hint* (nice ticks), which can
 * yield fewer/more bins than requested — pass an explicit array instead.
 */
function exactBinThresholds(min: number, max: number, numBins: number): number[] {
  const n = Math.max(2, numBins);
  if (!(Number.isFinite(min) && Number.isFinite(max)) || !(max > min)) {
    return [];
  }
  const step = (max - min) / n;
  const thresholds: number[] = [];
  for (let i = 1; i < n; i++) {
    thresholds.push(min + step * i);
  }
  return thresholds;
}

function numericGroupMap(
  indexes: number[],
  dataset: ChartableDataset,
  fieldName: string,
  numBins: number
): {groups: Map<string, number[]>; filterValues: Map<string, Array<string | number>>} {
  const values = indexes
    .map(idx => ({idx, value: toNumber(dataset.getValue(fieldName, idx))}))
    .filter((d): d is {idx: number; value: number} => d.value !== null);
  if (!values.length) {
    return {groups: new Map(), filterValues: new Map()};
  }
  const min = d3Min(values, d => d.value);
  const max = d3Max(values, d => d.value);
  if (min === undefined || max === undefined) {
    return {groups: new Map(), filterValues: new Map()};
  }
  const binCount = Math.max(2, numBins > 0 ? numBins : DEFAULT_NUM_GROUPS);
  const hist = histogram<{idx: number; value: number}, number>()
    .value(d => d.value)
    .domain([min, max])
    .thresholds(exactBinThresholds(min, max, binCount));
  const bins = hist(values);
  const groups = new Map<string, number[]>();
  const filterValues = new Map<string, Array<string | number>>();
  bins.forEach(bin => {
    const x0 = bin.x0 ?? 0;
    const x1 = bin.x1 ?? x0;
    const key = `${formatNumber(x0)} – ${formatNumber(x1)}`;
    groups.set(
      key,
      bin.map(d => d.idx)
    );
    filterValues.set(key, [x0, x1]);
  });
  return {groups, filterValues};
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

function getTimeOffset(interval: string | undefined, startDate: Date): Date {
  switch (interval) {
    case 'year':
      return utcYear.offset(startDate, 1);
    case 'month':
      return utcMonth.offset(startDate, 1);
    case 'week':
      return utcWeek.offset(startDate, 1);
    case 'hour':
      return utcHour.offset(startDate, 1);
    case 'day':
    default:
      return utcDay.offset(startDate, 1);
  }
}

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;
const MONTH_MS = 30 * DAY_MS;
const YEAR_MS = 365 * DAY_MS;
/** Soft target for auto period selection; hard cap is MAX_CHART_POINTS. */
const TARGET_TIME_BUCKETS = 200;

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function formatUtcDate(ms: number): string {
  const date = new Date(ms);
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
}

function formatUtcDateTime(ms: number): string {
  const date = new Date(ms);
  return `${formatUtcDate(ms)} ${pad2(date.getUTCHours())}:${pad2(date.getUTCMinutes())}`;
}

/** Label a time bin; omit clock time when the bin spans a day or more. */
function formatTimeBinRange(x0: number, x1: number): string {
  const span = Math.max(0, x1 - x0);
  const crossesDay = formatUtcDate(x0) !== formatUtcDate(x1);
  if (span >= DAY_MS || crossesDay) {
    return `${formatUtcDate(x0)} – ${formatUtcDate(x1)}`;
  }
  return `${formatUtcDateTime(x0)} – ${formatUtcDateTime(x1)}`;
}

function formatTimePeriodLabel(ms: number, interval?: string): string {
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) {
    return String(ms);
  }
  switch (interval) {
    case 'year':
      return String(date.getUTCFullYear());
    case 'month':
      return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}`;
    case 'week':
      return `Week of ${formatUtcDate(ms)}`;
    case 'day':
      return formatUtcDate(ms);
    case 'hour':
    default:
      return formatUtcDateTime(ms);
  }
}

/**
 * Pick a time period so the [min, max] span yields about `targetBuckets` buckets.
 */
function chooseTimeInterval(spanMs: number, targetBuckets = TARGET_TIME_BUCKETS): string {
  if (!(spanMs > 0)) {
    return 'day';
  }
  const candidates: Array<[string, number]> = [
    ['hour', HOUR_MS],
    ['day', DAY_MS],
    ['week', WEEK_MS],
    ['month', MONTH_MS],
    ['year', YEAR_MS]
  ];
  for (const [name, size] of candidates) {
    if (spanMs / size <= targetBuckets) {
      return name;
    }
  }
  return 'year';
}

function equalWidthTimeBins(
  points: Array<{idx: number; t: number}>,
  min: number,
  max: number,
  binCount: number
): {groups: Map<string, number[]>; filterValues: Map<string, Array<string | number>>} {
  const hist = histogram<{idx: number; t: number}, number>()
    .value(d => d.t)
    .domain([min, max])
    .thresholds(exactBinThresholds(min, max, binCount));
  const bins = hist(points);
  const groups = new Map<string, number[]>();
  const filterValues = new Map<string, Array<string | number>>();
  bins.forEach(bin => {
    const x0 = bin.x0 ?? min;
    const x1 = bin.x1 ?? max;
    const key = formatTimeBinRange(x0, x1);
    groups.set(
      key,
      bin.map(d => d.idx)
    );
    filterValues.set(key, [x0, x1]);
  });
  return {groups, filterValues};
}

function timeGroupMap(
  indexes: number[],
  dataset: ChartableDataset,
  fieldName: string,
  interval?: string,
  numBins = 0
): {groups: Map<string, number[]>; filterValues: Map<string, Array<string | number>>} {
  const points = indexes
    .map(idx => {
      const raw = dataset.getValue(fieldName, idx);
      const date = raw instanceof Date ? raw : new Date(raw);
      const t = date.getTime();
      return Number.isNaN(t) ? null : {idx, t};
    })
    .filter((d): d is {idx: number; t: number} => d !== null);

  if (!points.length) {
    return {groups: new Map(), filterValues: new Map()};
  }

  const min = d3Min(points, d => d.t);
  const max = d3Max(points, d => d.t);
  if (min === undefined || max === undefined) {
    return {groups: new Map(), filterValues: new Map()};
  }

  // Bar charts: split the full [min, max] domain into exactly numBins equal ranges.
  if (numBins > 0) {
    return equalWidthTimeBins(points, min, max, Math.max(2, numBins));
  }

  // Line / full series: period-group by interval (auto-chosen from span when unset).
  // When Auto, coarsen hour → day → week → month → year until under the point cap.
  const INTERVAL_ORDER = ['hour', 'day', 'week', 'month', 'year'];
  const autoInterval = !interval;
  let resolvedInterval = interval || chooseTimeInterval(max - min, TARGET_TIME_BUCKETS);
  let groups = new Map<string, number[]>();
  let keyStarts = new Map<string, number>();

  const buildPeriodGroups = (period: string) => {
    const floor = getTimeFloor(period);
    const nextGroups = new Map<string, number[]>();
    const nextStarts = new Map<string, number>();
    for (const point of points) {
      const start = floor(new Date(point.t)).getTime();
      const key = formatTimePeriodLabel(start, period);
      const list = nextGroups.get(key);
      if (list) {
        list.push(point.idx);
      } else {
        nextGroups.set(key, [point.idx]);
        nextStarts.set(key, start);
      }
    }
    return {nextGroups, nextStarts};
  };

  for (;;) {
    const built = buildPeriodGroups(resolvedInterval);
    groups = built.nextGroups;
    keyStarts = built.nextStarts;
    if (groups.size <= MAX_CHART_POINTS) {
      break;
    }
    // Too dense for this period: coarsen when Auto, otherwise equal-width cap.
    if (!autoInterval) {
      return equalWidthTimeBins(points, min, max, MAX_CHART_POINTS);
    }
    const idx = INTERVAL_ORDER.indexOf(resolvedInterval);
    if (idx < 0 || idx >= INTERVAL_ORDER.length - 1) {
      return equalWidthTimeBins(points, min, max, MAX_CHART_POINTS);
    }
    resolvedInterval = INTERVAL_ORDER[idx + 1];
  }

  const filterValues = new Map<string, Array<string | number>>();
  const ordered = new Map<string, number[]>();
  Array.from(groups.keys())
    .sort(
      (a, b) =>
        (keyStarts.get(a) || 0) - (keyStarts.get(b) || 0) || String(a).localeCompare(String(b))
    )
    .forEach(key => {
      const floored = keyStarts.get(key) || 0;
      ordered.set(key, groups.get(key) || []);
      filterValues.set(key, [
        floored,
        getTimeOffset(resolvedInterval, new Date(floored)).getTime()
      ]);
    });
  return {groups: ordered, filterValues};
}

function uniqueGroupFilterValues(
  groups: Map<string, number[]>,
  fieldType?: string
): Map<string, Array<string | number>> {
  const filterValues = new Map<string, Array<string | number>>();
  const numeric = fieldType === 'real' || fieldType === 'integer';
  groups.forEach((_, key) => {
    if (numeric) {
      const n = Number(key);
      filterValues.set(key, Number.isFinite(n) ? [n, n] : [key]);
    } else {
      filterValues.set(key, [key]);
    }
  });
  return filterValues;
}

export function groupIndexes(
  indexes: number[],
  dataset: ChartableDataset,
  axis: ChartAxis | undefined,
  numBins = DEFAULT_NUM_GROUPS
): {groups: Map<string, number[]>; filterValues: Map<string, Array<string | number>>} {
  const fieldName = axis?.field?.name;
  if (!fieldName) {
    return {
      groups: new Map([['All', indexes]]),
      filterValues: new Map([['All', ['All']]])
    };
  }
  const fieldType = axis.field?.type;
  const aggregation = axis.aggregation;

  // Time fields → time bins (unless explicitly forced to unique categories)
  if (
    (aggregation === BinType.timeBin || TIME_FIELD_TYPES.includes(fieldType || '')) &&
    aggregation !== BinType.uniqueBin &&
    aggregation !== BinType.numericBin
  ) {
    return timeGroupMap(indexes, dataset, fieldName, axis.interval || undefined, numBins);
  }

  // Continuous reals (and explicit numericBin) → histogram across the full domain.
  // uniqueBin on floats only shows a few clustered values after top-N truncation.
  if (aggregation === BinType.numericBin || fieldType === 'real') {
    return numericGroupMap(indexes, dataset, fieldName, numBins);
  }

  // Integers: prefer unique categories, but fall back to a histogram when cardinality
  // exceeds the chart's group budget.
  if (fieldType === 'integer') {
    if (aggregation === BinType.numericBin) {
      return numericGroupMap(indexes, dataset, fieldName, numBins);
    }
    const uniques = uniqueGroupMap(indexes, dataset, fieldName);
    if (numBins > 0 && uniques.size > numBins) {
      return numericGroupMap(indexes, dataset, fieldName, numBins);
    }
    return {groups: uniques, filterValues: uniqueGroupFilterValues(uniques, fieldType)};
  }

  const groups = uniqueGroupMap(indexes, dataset, fieldName);
  return {groups, filterValues: uniqueGroupFilterValues(groups, fieldType)};
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
  color,
  colors,
  truncate = true
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
  /** Single color applied to every bin. */
  color?: string;
  /** Palette used to color bins by category when `color` is not set. */
  colors?: string[];
  /** When false, keep every bin (used for numeric/time domain bins). */
  truncate?: boolean;
}): ChartBin[] {
  const indexes = indexesOverride || getChartIndexes(dataset, applyFilters);
  const {groups, filterValues} = groupIndexes(indexes, dataset, binAxis, numGroups);
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
            color: colors?.length ? colors[seriesIdx % colors.length] : colorAt(seriesIdx)
          })
        )
      : undefined;
    bins.push({
      key,
      value: series
        ? series.reduce((sum, item) => sum + item.value, 0)
        : aggregateIndexes(groupIndexesList, dataset, valueField, aggregation),
      count: groupIndexesList.length,
      color:
        color ||
        (colors?.length ? colors[colorIndex % colors.length] : undefined) ||
        colorAt(colorIndex),
      filterValue: filterValues.get(key) || [key],
      series
    });
    colorIndex += 1;
  });

  bins = sortBins(bins, sort);
  if (!truncate || numGroups <= 0) {
    // Line charts pass numGroups=0 (no categorical top-N); still hard-cap points.
    return bins.length > MAX_CHART_POINTS ? bins.slice(0, MAX_CHART_POINTS) : bins;
  }
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
  const {groups, filterValues} = timeGroupMap(indexes, dataset, xAxis.field.name, interval);
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
      color: CHART_COLORS[0],
      filterValue: filterValues.get(key) || [key]
    });
  });
  // Preserve chronological order from timeGroupMap (period labels are not ISO strings).
  return bins;
}

export {toKey};
