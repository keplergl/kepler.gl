// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {bisectLeft, bisectRight, extent, histogram as d3Histogram, ticks} from 'd3-array';
import isEqual from 'es-toolkit/compat/isEqual';
import {getFilterMappedValue, getInitialInterval, intervalToFunction} from './time';
import moment from 'moment';
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
  durationDay,
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

/**
 * @param filter
 * @param datasets
 * @param interval
 */
export function getTimeBins(
  filter: TimeRangeFilter,
  datasets: Datasets,
  interval: PlotType['interval']
): TimeBins {
  let bins = filter.timeBins || {};

  filter.dataId.forEach(dataId => {
    // reuse bins if filterData did not change
    if (bins[dataId] && bins[dataId][interval]) {
      return;
    }
    const dataset = datasets[dataId];

    // do not apply current filter
    const indexes = runGpuFilterForPlot(dataset, filter);

    bins = {
      ...bins,
      [dataId]: {
        ...bins[dataId],
        [interval]: binByTime(indexes, dataset, interval, filter)
      }
    };
  });

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
  const timeInterval = intervalToFunction(interval);
  const [t0, t1] = domain;
  const floor = timeInterval.floor(t0).getTime();
  const ceiling = timeInterval.ceil(t1).getTime();

  if (!timeInterval) {
    // if time interval is not defined
    // this should not happen
    return [t0, t0 + durationDay];
  }
  const binThresholds = timeInterval.range(floor, ceiling + 1).map(t => moment.utc(t).valueOf());
  const lastStep = binThresholds[binThresholds.length - 1];
  if (lastStep === t1) {
    // when last step equal to domain max, add one more step
    binThresholds.push(moment.utc(timeInterval.offset(lastStep)).valueOf());
  }

  return binThresholds;
}

/**
 * Run GPU filter on current filter result to generate indexes for ploting chart
 * Skip ruuning for the same field
 * @param dataset
 * @param filter Histogram filter whose dataId-paired column should be skipped
 * @param skipFieldNames Extra GPU field names to skip (charts cross-filter). Histogram callers omit this.
 */
export function runGpuFilterForPlot<K extends KeplerTableModel<K, L>, L>(
  dataset: K,
  filter?: Filter,
  skipFieldNames?: string[]
): number[] {
  const skipIndexes = getSkipIndexes(dataset, filter, skipFieldNames);

  const {
    gpuFilter: {filterValueUpdateTriggers, filterRange, filterValueAccessor},
    filteredIndex,
    filteredIndexByLayer
  } = dataset;
  // Polygon filters are per-layer; plots use the union of targeted layer indices
  const plotFilteredIndex = mergePolygonLayerIndexes(filteredIndex, filteredIndexByLayer);
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
  const filterColumn = filter.name[valueIndex];

  return gpuFilters.reduce((accu, item, idx) => {
    if (item && filterColumn === item.name) {
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
 * Use in slider, given a number and an array of numbers, return the nears number from the array.
 * Takes a value, timesteps and return the actual step.
 * @param value
 * @param marks
 */
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
  _interval: PlotType['interval']
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
export const PLOT_NUM_GROUPS_OPTIONS: Array<number | typeof PLOT_NUM_GROUPS_ALL> = [
  1,
  3,
  5,
  7,
  10,
  20,
  PLOT_NUM_GROUPS_ALL
];

const DEFAULT_PLOT_GROUP_PALETTE = 'Uber Viz Qualitative';
const FALLBACK_SERIES_COLORS = ['#12939A', '#DDB27C', '#88572C', '#FF991F', '#F15C17', '#223F9A'];

export function plotGroupColorSteps(
  numGroups: number | typeof PLOT_NUM_GROUPS_ALL | undefined
): number {
  if (numGroups === PLOT_NUM_GROUPS_ALL || typeof numGroups !== 'number' || numGroups < 1) {
    return 20;
  }
  return Math.max(2, Math.min(numGroups, 20));
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

function seriesColor(colorRange: ColorRange | undefined, key: string, index: number): string {
  const colorMap = colorRange?.colorMap;
  if (Array.isArray(colorMap)) {
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
  }
  const colors = colorRange?.colors;
  if (colors?.length) {
    return colors[index % colors.length];
  }
  return FALLBACK_SERIES_COLORS[index % FALLBACK_SERIES_COLORS.length];
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
    return Number.POSITIVE_INFINITY;
  }
  if (typeof numGroups !== 'number' || !(numGroups > 0)) {
    return DEFAULT_PLOT_NUM_GROUPS;
  }
  return numGroups;
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
  interval: PlotType['interval'];
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
      color: seriesColor(colorRange, PLOT_GROUP_OTHERS_NAME, keep.length)
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
  const {aggregation, interval} = plotType;
  const seriesDataId = dataId[0];
  const bins = (filter as TimeRangeFilter).timeBins?.[seriesDataId]?.[interval];
  const groupBy = groupByCacheValue(plotType);

  if (
    lineChart &&
    lineChart.aggregation === aggregation &&
    lineChart.interval === interval &&
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
      ? buildGroupedLineSeries({bins, dataset, plotType, getYValue, interval})
      : null;

  const init: LineDatum[] = [];
  const series = grouped
    ? grouped.points
    : (bins || []).reduce((accu, bin) => {
        const y = getYValue(bin);
        const delta = getDelta(accu, y, interval);
        accu.push({
          x: bin.x0,
          y,
          ...delta
        });
        return accu;
      }, init);

  const yDomain = extent<{y: any}>(series, d => d.y);
  const xDomain = bins ? [bins[0].x0, bins[bins.length - 1].x1] : [];

  // treat missing data as another series
  const split = grouped ? grouped.series : splitSeries(series);
  const aggrName = AGGREGATION_NAME[aggregation];

  return {
    // @ts-ignore
    yDomain,
    // @ts-ignore
    xDomain,
    interval,
    aggregation,
    // @ts-ignore
    series: split,
    title: `${aggrName}${' of '}${yAxis ? yAxis.name : 'Count'}`,
    fieldType: yAxis ? yAxis.type : 'integer',
    yAxis: yAxis ? yAxis.name : null,
    allTime: {
      title: `All Time Average`,
      value: aggregate(series, AGGREGATION_TYPES.average, d => d.y)
    },
    // @ts-expect-error bins is Bins[], not a Bins map. Refactor to use correct types.
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
  filter: TimeRangeFilter
) {
  const {
    plotType,
    value: [value0, value1],
    animationWindow
  } = filter;

  const interval = plotType.interval || getInitialInterval(filter, state.datasets);
  const bins = getTimeBins(filter, state.datasets, interval);
  const datasetBins = bins && Object.keys(bins).length && Object.values(bins)[0][interval];
  const thresholds = (datasetBins || []).map(b => b.x0);

  let val0 = value0;
  let val1 = value1;
  let idx;
  if (animationWindow === ANIMATION_WINDOW.interval) {
    val0 = snapToMarks(value1, thresholds);
    idx = thresholds.indexOf(val0);
    val1 = idx > -1 ? datasetBins[idx].x1 : NaN;
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

  const updatedFilter = {
    ...filter,
    plotType: {
      ...filter.plotType,
      interval
    },
    timeBins: bins,
    value: [val0, val1]
  };

  return updatedFilter;
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
  _dataId?: string
): TimeRangeFilter {
  let nextFilter = filter;
  let nextPlotType = plotType;
  if (typeof nextPlotType !== 'object' || !nextPlotType.aggregation || !nextPlotType.interval) {
    nextPlotType = getDefaultPlotType(filter, datasets);
  }

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

  const bins = getTimeBins(nextFilter, datasets, nextPlotType.interval);

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

export function getRangeFilterBins(filter, datasets, numBins) {
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
        const indexes = runGpuFilterForPlot(dataset, filter);
        const valueAccessor = index => field.valueAccessor({index});
        acc[dataId] = histogramFromDomain(domain, indexes, numBins, valueAccessor);
      }
    }
    return acc;
  }, {});
}

export function updateRangeFilterPlotType(
  filter: RangeFilter,
  plotType: RangeFilter['plotType'],
  datasets: Datasets,
  _dataId?: string
): RangeFilter {
  const nextFilter = {
    ...filter,
    plotType
  };

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

  return {
    ...filter,
    plotType,
    bins: getRangeFilterBins(nextFilter, datasets, BINS)
  };
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
