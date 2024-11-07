// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {bisectLeft, bisector, extent, histogram as d3Histogram, ticks} from 'd3-array';
import {getFilterMappedValue, getInitialInterval, intervalToFunction} from './time';
import moment from 'moment';
import {
  Bin,
  TimeBins,
  Millisecond,
  TimeRangeFilter,
  RangeFilter,
  PlotType,
  Filter,
  LineChart,
  Field,
  ValueOf,
  LineDatum
} from '@kepler.gl/types';
import {
  ANIMATION_WINDOW,
  BINS,
  durationDay,
  TIME_AGGREGATION,
  AGGREGATION_TYPES,
  PLOT_TYPES,
  AggregationTypes
} from '@kepler.gl/constants';
import {VisState} from '@kepler.gl/schemas';

import {notNullOrUndefined, roundValToStep} from './data-utils';
import {aggregate, AGGREGATION_NAME} from './aggregation';
import {capitalizeFirstLetter} from './strings';
import {getDefaultTimeFormat} from './format';
import {rgbToHex} from './color-utils';
import {DataContainerInterface} from '.';
import {KeplerTableModel} from './types';

// TODO kepler-table module isn't accessible from utils. Add compatible interface to types
type Datasets = any;

/**
 *
 * @param thresholds
 * @param values
 * @param indexes
 */
export function histogramFromThreshold(
  thresholds: number[],
  values: number[],
  indexes: number[]
): Bin[] {
  const bins = d3Histogram()
    .value(idx => values[idx])
    .domain([thresholds[0], thresholds[thresholds.length - 1]])
    .thresholds(thresholds)(indexes)
    .map(bin => ({
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
  // filter out bins with 0 counts
  return bins.filter(b => b.count > 0);
  // return bins;
}

/**
 *
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

  filter.dataId.forEach((dataId, dataIdIdx) => {
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

  const bins = histogramFromThreshold(intervalBins, mappedValue, indexes);

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
 * @param filter
 */
export function runGpuFilterForPlot<K extends KeplerTableModel<K, L>, L>(
  dataset: K,
  filter?: Filter
): number[] {
  const skipIndexes = getSkipIndexes(dataset, filter);

  const {
    gpuFilter: {filterValueUpdateTriggers, filterRange, filterValueAccessor},
    filteredIndex
  } = dataset;
  const getFilterValue = filterValueAccessor(dataset.dataContainer)();

  const allChannels = Object.keys(filterValueUpdateTriggers)
    .map((_, i) => i)
    .filter(i => Object.values(filterValueUpdateTriggers)[i]);
  const skipAll = !allChannels.filter(i => !skipIndexes.includes(i)).length;
  if (skipAll) {
    return filteredIndex;
  }

  const filterData = getFilterDataFunc(
    filterRange,
    getFilterValue,
    dataset.dataContainer,
    skipIndexes
  );

  return filteredIndex.filter(filterData);
}

function getSkipIndexes(dataset, filter) {
  // array of gpu filter names
  if (!filter) {
    return [];
  }
  const gpuFilters = Object.values(dataset.gpuFilter.filterValueUpdateTriggers) as ({
    name: string;
  } | null)[];
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

const getAgregationAccessor = (field, dataContainer: DataContainerInterface, fields) => {
  if (isPercentField(field)) {
    const numeratorIdx = fields.findIndex(f => f.name === field.metadata.numerator);
    const denominatorIdx = fields.findIndex(f => f.name === field.metadata.denominator);

    return {
      getNumerator: i => dataContainer.valueAt(i, numeratorIdx),
      getDenominator: i => dataContainer.valueAt(i, denominatorIdx)
    };
  }

  return i => field.valueAccessor({index: i});
};

export const getValueAggrFunc = (field, aggregation, dataset) => {
  const {dataContainer, fields} = dataset;
  return field && aggregation
    ? bin =>
        aggregate(
          bin.indexes,
          getAgregationType(field, aggregation),
          // @ts-ignore
          getAgregationAccessor(field, dataContainer, fields)
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
  y: number,
  interval: PlotType['interval']
): Partial<LineDatum> {
  // if (WOW[interval]) return getWow(bins, y, interval);
  const lastBin = bins[bins.length - 1];

  return {
    delta: 'last',
    pct: lastBin ? getPctChange(y, lastBin.y) : null
  };
}

export function getPctChange(y, y0) {
  if (Number.isFinite(y) && Number.isFinite(y0) && y0 !== 0) {
    return (y - y0) / y0;
  }
  return null;
}

/**
 *
 * @param datasets
 * @param filter
 */
export function getLineChart(datasets: Datasets, filter: Filter): LineChart {
  const {dataId, yAxis, plotType} = filter;
  const {aggregation, interval} = plotType;

  if (
    filter.lineChart &&
    filter.lineChart.aggregation === aggregation &&
    filter.lineChart.interval === interval &&
    filter.lineChart.yAxis === yAxis?.name
  ) {
    // don't update lineChart if plotType hasn't change
    return filter.lineChart;
  }

  const seriesDataId = dataId[0];
  const dataset = datasets[seriesDataId];
  const getYValue = getValueAggrFunc(yAxis, aggregation, dataset);

  // @ts-expect-error do we expect TimeRangeFilter here?
  const bins = filter.timeBins[seriesDataId][interval];
  const init = [];
  const series = bins.reduce((accu, bin, i) => {
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
  const xDomain = [bins[0].x0, bins[bins.length - 1].x1];

  // treat missing data as another series
  const split = splitSeries(series);
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
    }
  };
}

// split into multiple series when see missing data
export function splitSeries(series) {
  const lines: any[] = [];
  let temp: any[] = [];
  for (let i = 0; i < series.length; i++) {
    const d = series[i];
    if (!notNullOrUndefined(d.y) && temp.length) {
      // ends temp
      lines.push(temp);
      temp = [];
    } else if (notNullOrUndefined(d.y)) {
      temp.push(d);
    }

    if (i === series.length - 1 && temp.length) {
      lines.push(temp);
    }
  }

  const markers = lines.length > 1 ? series.filter(d => notNullOrUndefined(d.y)) : [];

  return {lines, markers};
}

export function filterSeriesByRange(series, range) {
  if (!series) {
    return [];
  }
  const [start, end] = range;
  const inRange: any[] = [];

  for (const serie of series) {
    if (!serie.length) {
      // eslint-disable-next-line no-console, no-undef
      console.warn('Serie shouldnt be empty', series);
    }

    const i0 = bisector((s: {x: any}) => s.x).left(serie, start);
    const i1 = bisector((s: {x: any}) => s.x).right(serie, end);
    const sliced = serie.slice(i0, i1);
    if (sliced.length) inRange.push(sliced);
  }

  return inRange;
}

export function adjustValueToAnimationWindow(state: VisState, filter: TimeRangeFilter) {
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
  dataId?: string
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
  dataId?: string
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

export function getChartTitle(yAxis, plotType: {aggregation: string}) {
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
    aggregation: AGGREGATION_TYPES.sum
  };
}
