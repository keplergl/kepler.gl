// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  bisectCenter,
  bisectLeft,
  bisectRight,
  extent,
  histogram as d3Histogram,
  ticks
} from 'd3-array';
import isEqual from 'es-toolkit/compat/isEqual';
import {
  getFilterMappedValue,
  getInitialInterval,
  getIntervalByTicks,
  intervalToFunction
} from './time';
import {
  Bin,
  TimeBins,
  Millisecond,
  TimeRangeFilter,
  RangeFilter,
  PlotType,
  PlotGroupBy,
  Filter,
  LineChart,
  LineChartGroupBy,
  LineChartSeries,
  Field,
  ValueOf,
  LineDatum,
  ColorRange,
  ColorUI
} from '@kepler.gl/types';
import {notNullorUndefined, toArray} from '@kepler.gl/common-utils';
import {
  ANIMATION_WINDOW,
  BINS,
  BINS_LARGE,
  FILTER_TYPES,
  TIME_AGGREGATION,
  AGGREGATION_TYPES,
  PLOT_TYPES,
  AggregationTypes,
  KEPLER_COLOR_PALETTES,
  colorPaletteToColorRange,
  DEFAULT_COLOR_UI,
  DEFAULT_CUSTOM_PALETTE
} from '@kepler.gl/constants';

import {isNumber, roundValToStep} from './data-utils';
import {aggregate, AGGREGATION_NAME} from './aggregation';
import {capitalizeFirstLetter} from './strings';
import {getDefaultTimeFormat} from './format';
import {rgbToHex} from './color-utils';
import {DataContainerInterface} from '.';
import {KeplerTableModel} from './types';

// TODO kepler-table module isn't accessible from utils. Add compatible interface to types
type Datasets = any;

/**
 * Merge per-layer polygon-filtered indices into a dataset-level index.
 * When any layers are polygon-filtered, take the union of their indices (a row is kept if it
 * is visible on at least one targeted layer), then intersect with the base index.
 * Used for filtered export and filter plots/histograms.
 */
export function mergePolygonLayerIndexes(
  baseIndex: number[],
  filteredIndexByLayer: Record<string, number[]> = {}
): number[] {
  const layerIndexes = Object.values(filteredIndexByLayer);
  if (!layerIndexes.length) {
    return baseIndex;
  }

  const union = new Set<number>();
  for (const indexes of layerIndexes) {
    for (const idx of indexes) {
      union.add(idx);
    }
  }

  return baseIndex.filter(i => union.has(i));
}

/**
 *
 * @param thresholds
 * @param values
 * @param indexes
 */
export function histogramFromThreshold(
  thresholds: number[],
  values: number[],
  valueAccessor?: (d: unknown) => number,
  filterEmptyBins = true
): Bin[] {
  const getBins = d3Histogram()
    .domain([thresholds[0], thresholds[thresholds.length - 1]])
    .thresholds(thresholds);

  if (valueAccessor) {
    getBins.value(valueAccessor);
  }

  // @ts-ignore
  const bins = getBins(values).map(bin => ({
    count: bin.length,
    indexes: bin,
    x0: bin.x0,
    x1: bin.x1
  }));

  // d3-histogram ignores threshold values outside the domain
  // The first bin.x0 is always equal to the minimum domain value, and the last bin.x1 is always equal to the maximum domain value.

  // bins[0].x0 = thresholds[0];
  // bins[bins.length - 1].x1 = thresholds[thresholds.length - 1];

  // @ts-ignore
  return filterEmptyBins ? bins.filter(b => b.count > 0) : bins;
}

/**
 *
 * @param values
 * @param numBins
 * @param valueAccessor
 */
export function histogramFromValues(
  values: (Millisecond | null | number)[],
  numBins: number,
  valueAccessor?: (d: number) => number
): Bin[] {
  const getBins = d3Histogram().thresholds(numBins);

  if (valueAccessor) {
    getBins.value(valueAccessor);
  }

  // @ts-ignore d3-array types doesn't match
  return getBins(values)
    .map(bin => ({
      count: bin.length,
      indexes: bin,
      x0: bin.x0,
      x1: bin.x1
    }))
    .filter(b => {
      const {x0, x1} = b;
      return isNumber(x0) && isNumber(x1);
    }) as Bin[];
}

export function histogramFromOrdinal(
  domain: [string],
  values: (Millisecond | null | number)[],
  valueAccessor?: (d: unknown) => string
): Bin[] {
  // @ts-expect-error to typed to expect strings
  const getBins = d3Histogram().thresholds(domain);
  if (valueAccessor) {
    // @ts-expect-error to typed to expect strings
    getBins.value(valueAccessor);
  }

  // @ts-expect-error null values aren't expected
  const bins = getBins(values);

  // @ts-ignore d3-array types doesn't match
  return bins.map(bin => ({
    count: bin.length,
    indexes: bin,
    x0: bin.x0,
    x1: bin.x0
  }));
}

/**
 * Bin rows by time interval overlap: a feature [start, end] is counted in every
 * bin whose range intersects that span. Null/undefined end is treated as still
 * active through the last threshold (open-ended).
 */
export function histogramFromTimeIntervals(
  thresholds: number[],
  indexes: number[],
  startAccessor: (idx: number) => number | null | undefined,
  endAccessor: (idx: number) => number | null | undefined
): Bin[] {
  if (!thresholds || thresholds.length < 2) {
    return [];
  }

  const nBins = thresholds.length - 1;
  const bins: Bin[] = [];
  for (let i = 0; i < nBins; i++) {
    bins.push({
      count: 0,
      indexes: [],
      x0: thresholds[i],
      x1: thresholds[i + 1]
    });
  }

  const lastThreshold = thresholds[nBins];

  for (const idx of indexes) {
    const start = startAccessor(idx);
    if (!notNullorUndefined(start) || Number.isNaN(start)) {
      continue;
    }
    const rawEnd = endAccessor(idx);
    if (notNullorUndefined(rawEnd) && !Number.isNaN(rawEnd) && rawEnd < start) {
      continue;
    }
    const end = notNullorUndefined(rawEnd) && !Number.isNaN(rawEnd) ? rawEnd : lastThreshold;

    let startBin = bisectRight(thresholds, start) - 1;
    let endBin = bisectRight(thresholds, end) - 1;

    if (startBin < 0) startBin = 0;
    if (startBin >= nBins && start === lastThreshold) startBin = nBins - 1;
    if (endBin >= nBins) endBin = nBins - 1;
    if (endBin < 0 || startBin >= nBins || endBin < startBin) {
      continue;
    }

    for (let i = startBin; i <= endBin; i++) {
      bins[i].indexes.push(idx);
      bins[i].count += 1;
    }
  }

  return bins.filter(b => b.count > 0);
}

function getEndMappedValue(dataset, filter: TimeRangeFilter): (number | null)[] | null {
  const datasetIdx = toArray(filter.dataId).indexOf(dataset.id);
  const fromFilter = filter.endMappedValue?.[datasetIdx];
  if (Array.isArray(fromFilter)) {
    return fromFilter;
  }
  const endName = toArray(filter.endName)[datasetIdx];
  if (!endName || typeof dataset.getColumnField !== 'function') {
    return null;
  }
  const field = dataset.getColumnField(endName);
  return field?.filterProps?.mappedValue || null;
}

/**
 * @param domain
 * @param values
 * @param numBins
 * @param valueAccessor
 */
export function histogramFromDomain(
  domain: [number, number],
  values: (Millisecond | null | number)[],
  numBins: number,
  valueAccessor?: (d: unknown) => number
): Bin[] {
  const getBins = d3Histogram().thresholds(ticks(domain[0], domain[1], numBins)).domain(domain);
  if (valueAccessor) {
    getBins.value(valueAccessor);
  }

  // @ts-ignore d3-array types doesn't match
  return getBins(values).map(bin => ({
    count: bin.length,
    indexes: bin,
    x0: bin.x0,
    x1: bin.x1
  }));
}

const timeBinDomains = new WeakMap<TimeBins, number[]>();

/**
 * @param filter
 * @param datasets
 * @param interval
 */
export function getTimeBins(
  filter: TimeRangeFilter,
  datasets: Datasets,
  interval: PlotType['interval'],
  plotBaseIndexByDataId?: Record<string, number[]>
): TimeBins {
  interval = getTimeBinConfig(interval, filter.domain).interval;
  const cachedDomain = filter.timeBins && timeBinDomains.get(filter.timeBins);
  // Preserve caller-supplied caches; invalidate a domain change once it is known.
  let bins = cachedDomain && !isEqual(cachedDomain, filter.domain) ? {} : filter.timeBins || {};

  filter.dataId.forEach(dataId => {
    // reuse bins if filterData did not change
    if (bins[dataId] && bins[dataId][interval]) {
      return;
    }
    const dataset = datasets[dataId];

    // do not apply current filter
    const indexes = runGpuFilterForPlot(
      dataset,
      filter,
      undefined,
      plotBaseIndexByDataId?.[dataId]
    );

    bins = {
      ...bins,
      [dataId]: {
        ...bins[dataId],
        [interval]: binByTime(indexes, dataset, interval, filter)
      }
    };
  });

  timeBinDomains.set(bins, Array.isArray(filter.domain) ? filter.domain.slice(0, 2) : []);
  return bins;
}

export function binByTime(indexes, dataset, interval, filter) {
  // gpuFilters need to be apply to filteredIndex
  const mappedValue = getFilterMappedValue(dataset, filter);
  if (!mappedValue) {
    return null;
  }
  const intervalBins = getBinThresholds(interval, filter.domain);
  const endMapped = getEndMappedValue(dataset, filter);
  if (Array.isArray(endMapped)) {
    return histogramFromTimeIntervals(
      intervalBins,
      indexes,
      idx => mappedValue[idx],
      idx => endMapped[idx]
    );
  }
  const valueAccessor = idx => mappedValue[idx];
  const bins = histogramFromThreshold(intervalBins, indexes, valueAccessor);

  return bins;
}

export function getBinThresholds(interval: string, domain: number[]): number[] {
  return getTimeBinConfig(interval, domain).thresholds.slice();
}

const MAX_TIME_BINS = 2048;
// Weak keys keep validation local to live domains without retaining old filters.
const timeBinConfigs = new WeakMap<
  number[],
  {requestedInterval: string; domain: number[]; result: {interval: string; thresholds: number[]}}
>();

/** Resolve the interval and its complete domain together, never truncating a plot. */
function getTimeBinConfig(interval: string, domain: number[]) {
  if (
    !Array.isArray(domain) ||
    domain.length !== 2 ||
    !domain.every(value => Number.isFinite(value) && Number.isFinite(new Date(value).getTime())) ||
    domain[1] < domain[0]
  ) {
    return {interval, thresholds: [] as number[]};
  }
  const cached = timeBinConfigs.get(domain);
  if (
    cached &&
    isEqual(cached.domain, domain) &&
    (cached.requestedInterval === interval || cached.result.interval === interval)
  ) {
    return cached.result;
  }

  const build = (id: string): number[] | null => {
    const match = /^(\d+)-(millisecond|second|minute|hour|day|week|month|year)$/.exec(id);
    const step = Number(match?.[1]);
    if (!match || !Number.isSafeInteger(step) || step <= 0) return null;
    let timeInterval = intervalToFunction(id);
    if (!timeInterval) return null;
    // Filtered D3 intervals can loop internally after Date overflow. Near the
    // Date limits, walk at most one field cycle using the unfiltered interval.
    const period = {second: 60, minute: 60, hour: 24, day: 31, month: 12}[match[2]];
    if (step > 1 && period) {
      const base = intervalToFunction(`1-${match[2]}`);
      if (
        !Number.isFinite(Number(base.offset(domain[0], -period))) ||
        !Number.isFinite(Number(base.offset(domain[1], period)))
      ) {
        const field = {
          second: (date: Date) => date.getUTCSeconds(),
          minute: (date: Date) => date.getUTCMinutes(),
          hour: (date: Date) => date.getUTCHours(),
          day: (date: Date) => date.getUTCDate() - 1,
          month: (date: Date) => date.getUTCMonth()
        }[match[2]];
        if (!field) return null;
        const walk = (value: number, direction: number, includeCurrent = false) => {
          let date = base.floor(value);
          for (let index = 0; index < period; index++) {
            if (!includeCurrent || index) date = base.offset(date, direction);
            if (!Number.isFinite(Number(date))) return date;
            if (field(date) % step === 0) return date;
          }
          return new Date(NaN);
        };
        timeInterval = {
          floor: value => walk(value, -1, true),
          offset: value => walk(value, 1)
        };
      }
    }
    if (match[2] === 'week' && step > 1) {
      // D3's filtered week.offset walks every intervening week. Use the same
      // epoch alignment without an unbounded scan for large configured steps.
      const week = intervalToFunction('1-week');
      timeInterval = {
        floor(value) {
          const floor = week.floor(value);
          const remainder = ((week.count(0, floor) % step) + step) % step;
          return week.offset(floor, -remainder);
        },
        offset: value => week.offset(value, step)
      };
    }
    let boundary = Number(timeInterval.floor(domain[0]));
    const thresholds: number[] = [];
    // Include the first boundary strictly after max, even when max is aligned.
    // This preserves the existing inclusive maximum bin and calendar padding.
    for (let index = 0; index <= MAX_TIME_BINS; index++) {
      if (!Number.isFinite(boundary)) return null;
      thresholds.push(boundary);
      if (boundary > domain[1]) return thresholds;
      const next = Number(timeInterval.floor(timeInterval.offset(boundary)));
      if (!(next > boundary)) return null;
      boundary = next;
    }
    return null;
  };

  const requestedInterval = interval;
  let thresholds = build(interval);
  // Domain-only fallback avoids copying/sorting every timestamp on refresh.
  // Retry fewer ticks when the nearest interval still exceeds the cap.
  for (let target = BINS_LARGE; !thresholds && target >= 1; target /= 10) {
    interval = getIntervalByTicks(target, domain[0], domain[1]);
    thresholds = build(interval);
  }
  const result = {interval, thresholds: thresholds || []};
  timeBinConfigs.set(domain, {requestedInterval, domain: domain.slice(), result});
  return result;
}

function normalizeTimePlotType(
  plotType: TimeRangeFilter['plotType'],
  domain: number[]
): TimeRangeFilter['plotType'] {
  const {interval} = getTimeBinConfig(plotType.interval, domain);
  return interval === plotType.interval
    ? plotType
    : {...plotType, interval, defaultTimeFormat: getDefaultTimeFormat(interval)};
}

const MAX_NUMERIC_BINS = 2048;

function getNumericBinCount(domain: number[], interval: number): number {
  const [start, end] = domain;
  const rawCount = (end - start) / interval;
  const roundedCount = Math.round(rawCount);
  return Math.abs(rawCount - roundedCount) <= Number.EPSILON * Math.max(1, Math.abs(rawCount)) * 16
    ? roundedCount
    : Math.ceil(rawCount);
}

function normalizeNumericInterval(domain: number[], interval?: number): number | undefined {
  if (!Number.isFinite(interval) || !(Number(interval) > 0)) {
    return undefined;
  }
  if (
    Array.isArray(domain) &&
    domain.length >= 2 &&
    domain.every(Number.isFinite) &&
    domain[1] > domain[0] &&
    getNumericBinCount(domain, Number(interval)) > MAX_NUMERIC_BINS
  ) {
    return undefined;
  }
  return Number(interval);
}

/**
 * Build histogram thresholds in the numeric field's own units.
 * Unlike time intervals, numeric intervals are anchored to the filter domain
 * and never pass through calendar conversion.
 */
export function getNumericBinThresholds(
  domain: number[],
  interval?: number,
  numBins = BINS
): number[] {
  if (!Array.isArray(domain) || domain.length < 2 || !domain.every(Number.isFinite)) {
    return [];
  }

  const [start, end] = domain;
  if (!(end > start)) {
    return [start, end];
  }

  if (!Number.isFinite(interval) || !(Number(interval) > 0)) {
    const numericTicks = ticks(start, end, numBins).filter(value => value > start && value < end);
    return [start, ...numericTicks, end];
  }

  const width = Number(interval);
  const count = getNumericBinCount(domain, width);
  if (count > MAX_NUMERIC_BINS) {
    return getNumericBinThresholds(domain, undefined, numBins);
  }

  const thresholds = [start];
  for (let index = 1; index < count; index++) {
    const boundary = start + index * width;
    if (boundary > thresholds[thresholds.length - 1] && boundary < end) {
      thresholds.push(boundary);
    }
  }
  if (end > thresholds[thresholds.length - 1]) {
    thresholds.push(end);
  }
  return thresholds;
}

const float64View = new DataView(new ArrayBuffer(8));

function adjacentFloat(value: number, direction: -1 | 1): number {
  if (Number.isNaN(value) || value === direction * Infinity) {
    return value;
  }
  if (value === 0) {
    return direction > 0 ? Number.MIN_VALUE : -Number.MIN_VALUE;
  }

  float64View.setFloat64(0, value, false);
  let high = float64View.getUint32(0, false);
  let low = float64View.getUint32(4, false);
  const incrementBits = value > 0 === direction > 0;

  if (incrementBits) {
    low = (low + 1) >>> 0;
    if (low === 0) {
      high = (high + 1) >>> 0;
    }
  } else if (low === 0) {
    low = 0xffffffff;
    high = (high - 1) >>> 0;
  } else {
    low = (low - 1) >>> 0;
  }

  float64View.setUint32(0, high, false);
  float64View.setUint32(4, low, false);
  return float64View.getFloat64(0, false);
}

/** Return the next representable IEEE-754 number above value. */
export function nextUp(value: number): number {
  return adjacentFloat(value, 1);
}

/** Return the next representable IEEE-754 number below value. */
export function nextDown(value: number): number {
  return adjacentFloat(value, -1);
}

/**
 * Smallest useful range width across a numeric domain. It is large enough to
 * move either endpoint by one representable value and never exceeds the span.
 */
export function getNumericRangeMinimum(domain: number[]): number {
  if (!Array.isArray(domain) || domain.length < 2 || !domain.every(Number.isFinite)) {
    return 0;
  }
  const [start, end] = domain;
  const span = end - start;
  if (!(span > 0)) {
    return 0;
  }
  const startResolution = nextUp(start) - start;
  const endResolution = end - nextDown(end);
  return Math.min(span, Math.max(startResolution, endResolution));
}

/** Infer the regular numeric bin width, ignoring tiny padded edge bins. */
export function getNumericPlotInterval(filter: RangeFilter): number {
  if (Number.isFinite(filter.plotType?.numericInterval) && filter.plotType.numericInterval > 0) {
    return filter.plotType.numericInterval;
  }
  const bins = Object.values(filter.bins || {}).find(value => value?.length);
  const binWidths = (bins || [])
    .map(bin => bin.x1 - bin.x0)
    .filter(width => Number.isFinite(width) && width > 0)
    .sort((a, b) => a - b);
  const binWidth = binWidths.length ? binWidths[Math.floor(binWidths.length / 2)] : 0;
  if (binWidth > 0) {
    return Number(binWidth.toPrecision(10));
  }
  const span = filter.domain?.[1] - filter.domain?.[0];
  return span > 0 ? Number((span / BINS).toPrecision(10)) : filter.step;
}

/** Return the plotted bin boundaries for either a time or numeric range filter. */
export function getFilterBinThresholds(filter: TimeRangeFilter | RangeFilter): number[] {
  if (filter.type === FILTER_TYPES.timeRange) {
    return getBinThresholds(filter.plotType?.interval, filter.domain);
  }

  const firstBins = Object.values(filter.bins || {}).find(Boolean) || [];
  if (firstBins.length) {
    return [...firstBins.map(bin => bin.x0), firstBins[firstBins.length - 1].x1];
  }
  return getNumericBinThresholds(filter.domain, filter.plotType?.numericInterval);
}

/**
 * Run GPU filter on current filter result to generate indexes for ploting chart
 * Skip ruuning for the same field
 * @param dataset
 * @param filter Histogram filter whose dataId-paired column should be skipped
 * @param skipFieldNames Extra GPU field names to skip (charts cross-filter). Histogram callers omit this.
 * @param baseIndex CPU base that excludes the plotted filter and already includes polygon filters.
 */
export function runGpuFilterForPlot<K extends KeplerTableModel<K, L>, L>(
  dataset: K,
  filter?: Filter,
  skipFieldNames?: string[],
  baseIndex?: number[]
): number[] {
  const skipIndexes = getSkipIndexes(dataset, filter, skipFieldNames);

  const {
    gpuFilter: {filterValueUpdateTriggers, filterRange, filterValueAccessor},
    filteredIndex,
    filteredIndexByLayer
  } = dataset;
  // Cached polygon indexes were built after the current CPU filter. When that
  // filter is omitted, use the polygon-filtered base reconstructed by the caller.
  const plotFilteredIndex =
    baseIndex ?? mergePolygonLayerIndexes(filteredIndex, filteredIndexByLayer);
  const getFilterValue = filterValueAccessor(dataset.dataContainer)();

  const allChannels = Object.keys(filterValueUpdateTriggers)
    .map((_, i) => i)
    .filter(i => Object.values(filterValueUpdateTriggers)[i]);
  const skipAll = !allChannels.filter(i => !skipIndexes.includes(i)).length;
  if (skipAll) {
    return plotFilteredIndex;
  }

  const filterData = getFilterDataFunc(
    filterRange,
    getFilterValue,
    dataset.dataContainer,
    skipIndexes
  );

  return plotFilteredIndex.filter(filterData);
}

function getSkipIndexes(dataset, filter, skipFieldNames?: string[]) {
  // array of gpu filter names
  const gpuFilters = Object.values(dataset.gpuFilter.filterValueUpdateTriggers) as ({
    name: string;
  } | null)[];

  // Charts pass extra field names so a cross-filter does not hide its own bins.
  // Histogram plots never pass this list and keep the original dataId pairing.
  if (skipFieldNames?.length) {
    const skipNames = new Set(skipFieldNames.filter((name): name is string => Boolean(name)));
    return gpuFilters.reduce((accu, item, idx) => {
      if (item && skipNames.has(item.name)) {
        accu.push(idx);
      }
      return accu;
    }, [] as number[]);
  }

  if (!filter) {
    return [];
  }
  const valueIndex = filter.dataId.findIndex(id => id === dataset.id);
  // Channels identify the plotted GPU filter precisely when another filter uses the same field.
  if (filter.gpu && valueIndex >= 0) {
    const assignedChannels = [
      filter.gpuChannel?.[valueIndex],
      filter.gpuEndChannel?.[valueIndex]
    ].filter(Number.isFinite) as number[];

    if (assignedChannels.length) {
      return assignedChannels;
    }
  }
  // CPU filters are already omitted from baseIndex, so every GPU channel remains applicable.
  if (filter.gpu === false && valueIndex >= 0) {
    return [];
  }

  const filterColumn = filter.name[valueIndex];
  const filterEndColumn = filter.endName?.[valueIndex];

  return gpuFilters.reduce((accu, item, idx) => {
    if (item && (filterColumn === item.name || filterEndColumn === item.name)) {
      accu.push(idx);
    }
    return accu;
  }, [] as number[]);
}

export function getFilterDataFunc(
  filterRange,
  getFilterValue,
  dataContainer: DataContainerInterface,
  skips
) {
  return index =>
    getFilterValue({index}).every(
      (val, i) => skips.includes(i) || (val >= filterRange[i][0] && val <= filterRange[i][1])
    );
}

export function validBin(b) {
  return b.x0 !== undefined && b.x1 !== undefined;
}

/**
 * Turn a histogram brush or slider position into one bin.
 * Interval playback steps by bin, and the filter comparison is inclusive.
 * Time bins preserve their millisecond offset. Numeric bins use the immediate
 * representable predecessor of the next mark so their membership matches D3's
 * half-open bins; only the final numeric bin includes its upper boundary.
 */
export function intervalBinFromMarks(
  marks: number[],
  value: number,
  endOffset = 1
): [number, number] {
  if (!marks.length || !Number.isFinite(value)) {
    return [value, value];
  }
  if (marks.length === 1) {
    return [marks[0], marks[0]];
  }
  let idx = bisectCenter(marks, value);
  if (idx < 0) {
    idx = 0;
  }
  // The last mark closes the final bin. Keep a drag there on that bin.
  const lastBin = marks.length - 2;
  if (idx > lastBin) {
    idx = lastBin;
  }
  const start = marks[idx];
  const end = marks[idx + 1];
  if (endOffset === 0) {
    return [start, idx === lastBin ? end : Math.max(start, nextDown(end))];
  }
  const offset = Number.isFinite(endOffset) && endOffset > 0 ? Math.min(endOffset, end - start) : 0;
  return [start, Math.max(start, end - offset)];
}

export function snapToMarks(value: number, marks: number[]): number {
  // always use bin x0
  if (!marks.length) {
    // @ts-expect-error looking at the usage null return value isn't expected and requires extra handling in a lot of places
    return null;
  }
  const i = bisectLeft(marks, value);
  if (i === 0) {
    return marks[i];
  } else if (i === marks.length) {
    return marks[i - 1];
  }
  const idx = marks[i] - value < value - marks[i - 1] ? i : i - 1;
  return marks[idx];
}

export function normalizeValue(val, minValue, step, marks) {
  if (marks && marks.length) {
    return snapToMarks(val, marks);
  }

  return roundValToStep(minValue, step, val);
}

export function isPercentField(field) {
  return field.metadata && field.metadata.numerator && field.metadata.denominator;
}

export function updateAggregationByField(field: Field, aggregation: ValueOf<AggregationTypes>) {
  // shouldn't apply sum to percent fiele type
  // default aggregation is average
  return field && isPercentField(field)
    ? AGGREGATION_TYPES.average
    : aggregation || AGGREGATION_TYPES.average;
}

const getAgregationType = (field, aggregation) => {
  if (isPercentField(field)) {
    return 'mean_of_percent';
  }
  return aggregation;
};

const getAggregationAccessor = (field, fields) => {
  if (isPercentField(field)) {
    const numeratorIdx = fields.findIndex(f => f.name === field.metadata.numerator);
    const denominatorIdx = fields.findIndex(f => f.name === field.metadata.denominator);

    return {
      getNumerator: i => fields[numeratorIdx].valueAccessor({index: i}),
      getDenominator: i => fields[denominatorIdx].valueAccessor({index: i})
    };
  }

  return i => field.valueAccessor({index: i});
};

export const getValueAggrFunc = (
  field: Field | string | null,
  aggregation: string,
  dataset: KeplerTableModel<any, any>
): ((bin: Bin) => number) => {
  const {fields} = dataset;

  // The passed-in field might not have all the fields set (e.g. valueAccessor)
  const datasetField = fields.find(
    f => field && (f.name === field || f.name === (field as Field).name)
  );

  return datasetField && aggregation
    ? bin =>
        aggregate(
          bin.indexes,
          getAgregationType(datasetField, aggregation),
          // @ts-expect-error can return {getNumerator, getDenominator}
          getAggregationAccessor(datasetField, fields)
        )
    : bin => bin.count;
};

export const getAggregationOptiosnBasedOnField = field => {
  if (isPercentField(field)) {
    // don't show sum
    return TIME_AGGREGATION.filter(({id}) => id !== AGGREGATION_TYPES.sum);
  }
  return TIME_AGGREGATION;
};

function getDelta(
  bins: LineDatum[],
  y: unknown,
  _interval: PlotType['interval'] | number | null
): Partial<LineDatum> & {delta: 'last'; pct: number | null} {
  // if (WOW[interval]) return getWow(bins, y, interval);
  const lastBin = bins[bins.length - 1];

  return {
    delta: 'last',
    pct: lastBin ? getPctChange(y, lastBin.y) : null
  };
}

export function getPctChange(y: unknown, y0: unknown): number | null {
  if (Number.isFinite(y) && Number.isFinite(y0) && y0 !== 0) {
    return ((y as number) - (y0 as number)) / (y0 as number);
  }
  return null;
}

export const PLOT_GROUP_OTHERS_NAME = 'Others';
export const PLOT_NUM_GROUPS_ALL = 'ALL' as const;
export const DEFAULT_PLOT_NUM_GROUPS = 10;
/** Qualitative palettes stop at 20. All uses this cap instead of one series per value. */
export const MAX_PLOT_NUM_GROUPS = 20;
export const PLOT_NUM_GROUPS_OPTIONS = [1, 3, 5, 7, 10, MAX_PLOT_NUM_GROUPS];

const DEFAULT_PLOT_GROUP_PALETTE = 'Uber Viz Qualitative';
const FALLBACK_SERIES_COLORS = ['#12939A', '#DDB27C', '#88572C', '#FF991F', '#F15C17', '#223F9A'];

export function plotGroupColorSteps(
  numGroups: number | typeof PLOT_NUM_GROUPS_ALL | undefined
): number {
  if (numGroups === PLOT_NUM_GROUPS_ALL || typeof numGroups !== 'number' || numGroups < 1) {
    return MAX_PLOT_NUM_GROUPS;
  }
  return Math.max(2, Math.min(numGroups, MAX_PLOT_NUM_GROUPS));
}

export function defaultPlotGroupColorRange(
  numGroups?: number | typeof PLOT_NUM_GROUPS_ALL
): ColorRange {
  const steps = plotGroupColorSteps(numGroups);
  const palette = KEPLER_COLOR_PALETTES.find(item => item.name === DEFAULT_PLOT_GROUP_PALETTE);
  if (!palette) {
    return {
      name: DEFAULT_PLOT_GROUP_PALETTE,
      type: 'qualitative',
      category: 'Uber',
      colors: FALLBACK_SERIES_COLORS
    };
  }
  return colorPaletteToColorRange(palette, {reversed: false, steps});
}

function defaultPlotGroupColorUI(
  numGroups: number | typeof PLOT_NUM_GROUPS_ALL,
  colorRange: ColorRange
): ColorUI {
  return {
    ...DEFAULT_COLOR_UI,
    colorRangeConfig: {
      ...DEFAULT_COLOR_UI.colorRangeConfig,
      type: 'qualitative',
      steps: plotGroupColorSteps(numGroups)
    },
    customPalette: {
      ...DEFAULT_CUSTOM_PALETTE,
      colors: colorRange.colors || []
    }
  };
}

function mergeGroupColorUI(
  prev: ColorUI | undefined,
  next: Partial<ColorUI> | null | undefined,
  numGroups: number | typeof PLOT_NUM_GROUPS_ALL,
  colorRange: ColorRange
): ColorUI {
  const base = prev ?? defaultPlotGroupColorUI(numGroups, colorRange);
  if (!next) {
    return base;
  }
  return {
    ...base,
    ...next,
    colorRangeConfig: {
      ...base.colorRangeConfig,
      ...(next.colorRangeConfig || {})
    },
    customPalette: next.customPalette
      ? {...base.customPalette, ...next.customPalette}
      : base.customPalette
  };
}

/**
 * Merge a partial timeline group-by onto the previous one.
 * `null` clears grouping. Missing fields keep the previous value, then defaults.
 */
export function mergePlotGroupBy(
  prev: PlotGroupBy | null | undefined,
  next: Partial<PlotGroupBy> | null | undefined
): PlotGroupBy | null {
  if (next === null) {
    return null;
  }
  if (!next && !prev) {
    return null;
  }
  const source = next || {};
  const numGroups = source.numGroups ?? prev?.numGroups ?? DEFAULT_PLOT_NUM_GROUPS;
  const colorRange = source.colorRange ?? prev?.colorRange ?? defaultPlotGroupColorRange(numGroups);
  return {
    fieldName: source.fieldName !== undefined ? source.fieldName : prev?.fieldName,
    numGroups,
    groupOthers: Boolean(source.groupOthers !== undefined ? source.groupOthers : prev?.groupOthers),
    colorRange,
    colorUI: mergeGroupColorUI(prev?.colorUI, source.colorUI, numGroups, colorRange)
  };
}

function groupByCacheValue(plotType: Filter['plotType']): LineChartGroupBy | null {
  const groupBy = plotType?.groupBy as PlotGroupBy | null | undefined;
  if (!groupBy?.fieldName) {
    return null;
  }
  return {
    fieldName: groupBy.fieldName,
    numGroups: groupBy.numGroups ?? DEFAULT_PLOT_NUM_GROUPS,
    groupOthers: Boolean(groupBy.groupOthers),
    colors: groupBy.colorRange?.colors ?? null,
    colorMap: groupBy.colorRange?.colorMap ?? null
  };
}

function toGroupKey(value: unknown): string | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  return String(value);
}

function mappedSeriesColor(colorRange: ColorRange | undefined, key: string): string | null {
  const colorMap = colorRange?.colorMap;
  if (!Array.isArray(colorMap)) {
    return null;
  }
  for (const entry of colorMap) {
    const domain = entry?.[0];
    const color = entry?.[1];
    if (!color) {
      continue;
    }
    if (Array.isArray(domain)) {
      if (domain.map(item => String(item)).includes(key)) {
        return color;
      }
    } else if (domain !== null && domain !== undefined && String(domain) === key) {
      return color;
    }
  }
  return null;
}

function seriesColor(colorRange: ColorRange | undefined, key: string, index: number): string {
  const mapped = mappedSeriesColor(colorRange, key);
  if (mapped) {
    return mapped;
  }
  const colors = colorRange?.colors;
  if (colors?.length) {
    return colors[index % colors.length];
  }
  return FALLBACK_SERIES_COLORS[index % FALLBACK_SERIES_COLORS.length];
}

const OTHERS_SERIES_COLOR = '#A0A7B4';

function defaultQualitativeColors(): string[] {
  const palette = KEPLER_COLOR_PALETTES.find(item => item.name === DEFAULT_PLOT_GROUP_PALETTE);
  if (palette?.type === 'qualitative') {
    return palette.colors(palette.maxStep);
  }
  return FALLBACK_SERIES_COLORS;
}

/** Others must not wrap onto a color already used by a kept group. */
function othersSeriesColor(colorRange: ColorRange | undefined, used: string[]): string {
  const mapped = mappedSeriesColor(colorRange, PLOT_GROUP_OTHERS_NAME);
  if (mapped) {
    return mapped;
  }
  const usedSet = new Set(used.map(color => color.toLowerCase()));
  const candidates = [
    ...(colorRange?.colors ?? []),
    ...defaultQualitativeColors(),
    ...FALLBACK_SERIES_COLORS,
    OTHERS_SERIES_COLOR
  ];
  return candidates.find(color => !usedSet.has(color.toLowerCase())) ?? OTHERS_SERIES_COLOR;
}

function groupValueAccessor(dataset, fieldName: string): ((index: number) => unknown) | null {
  const field = dataset?.fields?.find(item => item.name === fieldName);
  if (!field?.valueAccessor) {
    return null;
  }
  return index => field.valueAccessor({index});
}

function groupLimit(numGroups: number | typeof PLOT_NUM_GROUPS_ALL): number {
  if (numGroups === PLOT_NUM_GROUPS_ALL) {
    return MAX_PLOT_NUM_GROUPS;
  }
  if (typeof numGroups !== 'number' || !(numGroups > 0)) {
    return DEFAULT_PLOT_NUM_GROUPS;
  }
  return Math.min(numGroups, MAX_PLOT_NUM_GROUPS);
}

/**
 * Split time bins into one line per group-by value.
 * Groups keep first-seen order, then the list is capped at numGroups.
 * Remaining values fold into an Others series when groupOthers is set.
 */
function buildGroupedLineSeries({
  bins,
  dataset,
  plotType,
  getYValue,
  interval
}: {
  bins: Bin[];
  dataset: Datasets[string];
  plotType: Filter['plotType'];
  getYValue: (bin: Bin) => number;
  interval: PlotType['interval'] | number | null;
}): {series: LineChartSeries; points: LineDatum[]} | null {
  const cache = groupByCacheValue(plotType);
  if (!cache) {
    return null;
  }
  const getGroup = groupValueAccessor(dataset, cache.fieldName);
  if (!getGroup) {
    return null;
  }

  const order: string[] = [];
  const seen = new Set<string>();
  for (const bin of bins) {
    for (const idx of bin.indexes || []) {
      const key = toGroupKey(getGroup(idx));
      if (key === null || seen.has(key)) {
        continue;
      }
      seen.add(key);
      order.push(key);
    }
  }
  if (!order.length) {
    return null;
  }

  const limit = groupLimit(cache.numGroups);
  const keep = order.slice(0, limit);
  const rest = order.slice(keep.length);
  const includeOthers = Boolean(cache.groupOthers) && rest.length > 0;
  const colorRange = (plotType?.groupBy as PlotGroupBy | undefined)?.colorRange;
  const groups = keep.map((key, index) => ({
    name: key,
    keys: new Set([key]),
    color: seriesColor(colorRange, key, index)
  }));
  if (includeOthers) {
    groups.push({
      name: PLOT_GROUP_OTHERS_NAME,
      keys: new Set(rest),
      color: othersSeriesColor(
        colorRange,
        groups.map(group => group.color)
      )
    });
  }

  const keyToGroup = new Map<string, number>();
  groups.forEach((group, index) => {
    group.keys.forEach(key => keyToGroup.set(key, index));
  });

  const lines: LineDatum[][] = [];
  const colors: string[] = [];
  const names: string[] = [];
  const points: LineDatum[] = [];

  groups.forEach((group, groupIndex) => {
    const seriesPoints: LineDatum[] = [];
    bins.forEach(bin => {
      const indexes: number[] = [];
      for (const idx of bin.indexes || []) {
        const key = toGroupKey(getGroup(idx));
        if (key !== null && keyToGroup.get(key) === groupIndex) {
          indexes.push(idx);
        }
      }
      const y = indexes.length ? getYValue({...bin, indexes, count: indexes.length}) : undefined;
      const delta = getDelta(seriesPoints, y, interval);
      const point = {
        x: bin.x0,
        y,
        ...delta
      } as LineDatum;
      seriesPoints.push(point);
      points.push(point);
    });

    const split = splitSeries(seriesPoints);
    split.lines.forEach(line => {
      lines.push(line);
      colors.push(group.color);
      names.push(group.name);
    });
  });

  return {
    series: {lines, markers: [], colors, names},
    points
  };
}

export function lineChartSeriesLegend(
  lineChart?: LineChart | null
): {name: string; color: string}[] {
  const series = lineChart?.series;
  if (!series || Array.isArray(series) || !series.names || !series.colors) {
    return [];
  }
  const seen = new Map<string, string>();
  series.names.forEach((name, index) => {
    if (name && !seen.has(name)) {
      seen.set(name, series.colors?.[index] || FALLBACK_SERIES_COLORS[0]);
    }
  });
  return Array.from(seen, ([name, color]) => ({name, color}));
}

/**
 *
 * @param datasets
 * @param filter
 */
export function getLineChart(datasets: Datasets, filter: Filter): LineChart {
  const {dataId, yAxis, plotType, lineChart} = filter;
  const {interval} = plotType;
  const aggregation = plotType.aggregation || AGGREGATION_TYPES.average;
  const seriesDataId = dataId[0];
  const isNumericFilter = filter.type === FILTER_TYPES.range;
  const binning = isNumericFilter ? plotType.numericInterval ?? null : interval;
  const bins = isNumericFilter
    ? (filter as RangeFilter).bins?.[seriesDataId]
    : (filter as TimeRangeFilter).timeBins?.[seriesDataId]?.[interval];
  const groupBy = groupByCacheValue(plotType);

  if (
    lineChart &&
    lineChart.aggregation === aggregation &&
    lineChart.interval === binning &&
    lineChart.yAxis === yAxis?.name &&
    isEqual(lineChart.groupBy ?? null, groupBy) &&
    // we need to make sure we validate bins because of cross filter data changes
    isEqual(bins, lineChart?.bins)
  ) {
    // don't update lineChart if plotType hasn't change
    return lineChart;
  }

  const dataset = datasets[seriesDataId];
  const getYValue = getValueAggrFunc(yAxis, aggregation, dataset);
  const grouped =
    groupBy && bins?.length
      ? buildGroupedLineSeries({bins, dataset, plotType, getYValue, interval: binning})
      : null;

  const init: LineDatum[] = [];
  const series = grouped
    ? grouped.points
    : (bins || []).reduce((accu, bin) => {
        const y = getYValue(bin);
        const delta = getDelta(accu, y, binning);
        accu.push({
          x: bin.x0,
          y,
          ...delta
        });
        return accu;
      }, init);

  const yDomain = extent<{y: any}>(series, d => d.y);
  const xDomain = bins?.length ? [bins[0].x0, bins[bins.length - 1].x1] : [];

  // treat missing data as another series
  const split = grouped ? grouped.series : splitSeries(series);
  const aggrName = AGGREGATION_NAME[aggregation];

  return {
    // @ts-ignore
    yDomain,
    // @ts-ignore
    xDomain,
    interval: binning,
    aggregation,
    // @ts-ignore
    series: split,
    title: `${aggrName}${' of '}${yAxis ? yAxis.name : 'Count'}`,
    fieldType: yAxis ? yAxis.type : 'integer',
    yAxis: yAxis ? yAxis.name : null,
    allTime: {
      title: isNumericFilter ? `All Range Average` : `All Time Average`,
      value: aggregate(series, AGGREGATION_TYPES.average, d => d.y)
    },
    bins,
    ...(groupBy ? {groupBy} : {})
  };
}

// split into multiple series when see missing data
export function splitSeries(series) {
  const lines: any[] = [];
  let temp: any[] = [];
  for (let i = 0; i < series.length; i++) {
    const d = series[i];
    if (!notNullorUndefined(d.y) && temp.length) {
      // ends temp
      lines.push(temp);
      temp = [];
    } else if (notNullorUndefined(d.y)) {
      temp.push(d);
    }

    if (i === series.length - 1 && temp.length) {
      lines.push(temp);
    }
  }

  const markers = lines.length > 1 ? series.filter(d => notNullorUndefined(d.y)) : [];

  return {lines, markers};
}

type MinVisStateForAnimationWindow = {
  datasets: Datasets;
};

export function adjustValueToAnimationWindow<S extends MinVisStateForAnimationWindow>(
  state: S,
  filter: TimeRangeFilter | RangeFilter,
  plotBaseIndexByDataId?: Record<string, number[]>
) {
  const {
    plotType,
    value: [value0, value1],
    animationWindow
  } = filter;

  const isTimeFilter = filter.type === FILTER_TYPES.timeRange;
  const timePlotType = isTimeFilter
    ? normalizeTimePlotType(
        {...plotType, interval: plotType.interval || getInitialInterval(filter, state.datasets)},
        filter.domain
      )
    : plotType;
  const interval = isTimeFilter ? timePlotType.interval : undefined;
  const bins = isTimeFilter
    ? getTimeBins(filter, state.datasets, interval, plotBaseIndexByDataId)
    : getRangeFilterBins(filter, state.datasets, BINS, plotBaseIndexByDataId);
  const firstBins = bins && Object.keys(bins).length ? Object.values(bins)[0] : null;
  const datasetBins = isTimeFilter ? firstBins?.[interval] : firstBins;
  const thresholds = (datasetBins || []).map(b => b.x0);
  const numericIntervalMarks = datasetBins?.length
    ? [...thresholds, datasetBins[datasetBins.length - 1].x1]
    : thresholds;

  let val0 = value0;
  let val1 = value1;
  let idx;
  if (animationWindow === ANIMATION_WINDOW.interval) {
    val0 = snapToMarks(value1, thresholds);
    idx = thresholds.indexOf(val0);
    if (isTimeFilter) {
      // Time histograms discard empty bins. Use the selected cached bin's
      // actual end instead of the next non-empty bin's start so sparse
      // calendar intervals do not absorb the empty gap between them.
      const binEnd = idx > -1 ? datasetBins?.[idx]?.x1 : NaN;
      val1 =
        Number.isFinite(binEnd) && binEnd > val0
          ? Math.max(val0, binEnd - Math.min(1, binEnd - val0))
          : binEnd;
    } else {
      [, val1] = intervalBinFromMarks(numericIntervalMarks, val0, 0);
    }
  } else {
    // fit current value to window
    val0 = snapToMarks(value0, thresholds);
    val1 = snapToMarks(value1, thresholds);

    if (val0 === val1) {
      idx = thresholds.indexOf(val0);
      if (idx === thresholds.length - 1) {
        val0 = thresholds[idx - 1];
      } else {
        val1 = thresholds[idx + 1];
      }
    }
  }

  return {
    ...filter,
    ...(isTimeFilter
      ? {
          plotType: timePlotType,
          timeBins: bins
        }
      : {bins}),
    value: [val0, val1]
  };
}

/**
 * Create or update colors for a filter plot
 * @param filter
 * @param datasets
 * @param oldColorsByDataId
 */
function getFilterPlotColorsByDataId(filter, datasets, oldColorsByDataId) {
  let colorsByDataId = oldColorsByDataId || {};
  for (const dataId of filter.dataId) {
    if (!colorsByDataId[dataId] && datasets[dataId]) {
      colorsByDataId = {
        ...colorsByDataId,
        [dataId]: rgbToHex(datasets[dataId].color)
      };
    }
  }
  return colorsByDataId;
}

/**
 *
 * @param filter
 * @param plotType
 * @param datasets
 * @param dataId
 */
export function updateTimeFilterPlotType(
  filter: TimeRangeFilter,
  plotType: TimeRangeFilter['plotType'],
  datasets: Datasets,
  _dataId?: string,
  plotBaseIndexByDataId?: Record<string, number[]>
): TimeRangeFilter {
  let nextFilter = filter;
  let nextPlotType = plotType;
  if (typeof nextPlotType !== 'object' || !nextPlotType.aggregation || !nextPlotType.interval) {
    nextPlotType = getDefaultPlotType(filter, datasets);
  }
  const normalizedPlotType = normalizeTimePlotType(nextPlotType, filter.domain);
  if (normalizedPlotType.interval !== nextPlotType.interval) {
    nextFilter = {...filter, timeBins: undefined, lineChart: undefined};
  }
  nextPlotType = normalizedPlotType;

  if (filter.dataId.length > 1) {
    nextPlotType = {
      ...nextPlotType,
      colorsByDataId: getFilterPlotColorsByDataId(filter, datasets, nextPlotType.colorsByDataId)
    };
  }
  nextFilter = {
    ...nextFilter,
    plotType: nextPlotType
  };

  const bins = getTimeBins(nextFilter, datasets, nextPlotType.interval, plotBaseIndexByDataId);

  nextFilter = {
    ...nextFilter,
    timeBins: bins
  };

  if (plotType.type === PLOT_TYPES.histogram) {
    // Histogram is calculated and memoized in the chart itself
  } else if (plotType.type === PLOT_TYPES.lineChart) {
    // we should be able to move this into its own component so react will do the shallow comparison for us.
    nextFilter = {
      ...nextFilter,
      lineChart: getLineChart(datasets, nextFilter)
    };
  }

  return nextFilter;
}

export function getRangeFilterBins(
  filter,
  datasets,
  numBins,
  plotBaseIndexByDataId?: Record<string, number[]>
) {
  const {domain} = filter;
  if (!filter.dataId) return null;

  return filter.dataId.reduce((acc, dataId, datasetIdx) => {
    if (filter.bins?.[dataId]) {
      // don't recalculate bins
      acc[dataId] = filter.bins[dataId];
      return acc;
    }
    const fieldName = filter.name[datasetIdx];
    if (dataId && fieldName) {
      const dataset = datasets[dataId];
      const field = dataset?.getColumnField(fieldName);
      if (dataset && field) {
        const indexes = runGpuFilterForPlot(
          dataset,
          filter,
          undefined,
          plotBaseIndexByDataId?.[dataId]
        );
        const valueAccessor = index => field.valueAccessor({index});
        const numericInterval = filter.plotType?.numericInterval;
        acc[dataId] =
          Number.isFinite(numericInterval) && numericInterval > 0
            ? histogramFromThreshold(
                getNumericBinThresholds(domain, numericInterval, numBins),
                indexes,
                valueAccessor,
                false
              )
            : histogramFromDomain(domain, indexes, numBins, valueAccessor);
      }
    }
    return acc;
  }, {});
}

export function updateRangeFilterPlotType(
  filter: RangeFilter,
  plotType: RangeFilter['plotType'],
  datasets: Datasets,
  _dataId?: string,
  plotBaseIndexByDataId?: Record<string, number[]>
): RangeFilter {
  // if (dataId) {
  //   // clear bins
  //   nextFilter = {
  //     ...nextFilter,
  //     bins: {
  //       ...nextFilter.bins,
  //       [dataId]: null
  //     }
  //   };
  // }

  const configuredNumericInterval = plotType?.numericInterval;
  const numericInterval = normalizeNumericInterval(filter.domain, configuredNumericInterval);
  const shouldUseAutomaticBins =
    configuredNumericInterval !== undefined && numericInterval === undefined;
  let nextPlotType = plotType;
  if (shouldUseAutomaticBins) {
    const {numericInterval: _numericInterval, ...automaticPlotType} = nextPlotType || {};
    nextPlotType = automaticPlotType;
  }
  if (filter.dataId.length > 1) {
    nextPlotType = {
      ...nextPlotType,
      colorsByDataId: getFilterPlotColorsByDataId(filter, datasets, nextPlotType.colorsByDataId)
    };
  }

  const nextFilter = {
    ...filter,
    ...(shouldUseAutomaticBins ? {bins: undefined, lineChart: undefined} : {}),
    plotType: nextPlotType
  };

  let updatedFilter = {
    ...nextFilter,
    bins: getRangeFilterBins(nextFilter, datasets, BINS, plotBaseIndexByDataId)
  };
  if (nextPlotType.type === PLOT_TYPES.lineChart) {
    updatedFilter = {...updatedFilter, lineChart: getLineChart(datasets, updatedFilter)};
  }
  return updatedFilter;
}

export function getChartTitle(yAxis: Field, plotType: PlotType): string {
  const yAxisName = yAxis?.displayName;
  const {aggregation} = plotType;

  if (yAxisName) {
    return capitalizeFirstLetter(`${aggregation} ${yAxisName} over Time`);
  }

  return `Count of Rows over Time`;
}

export function getDefaultPlotType(filter, datasets) {
  const interval = getInitialInterval(filter, datasets);
  const defaultTimeFormat = getDefaultTimeFormat(interval);
  return {
    interval,
    defaultTimeFormat,
    type: PLOT_TYPES.histogram,
    aggregation: AGGREGATION_TYPES.average
  };
}
