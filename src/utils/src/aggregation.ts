// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {deviation, min, max, mean, median, sum, variance} from 'd3-array';
import {ValueOf} from '@kepler.gl/types';
import {AGGREGATION_TYPES, AggregationTypes} from '@kepler.gl/constants';
const identity = d => d;

export const getFrequency = (
  data: any[],
  accessor: (any: any) => any = identity
): {[key: string | number]: number} => {
  const occur = {};
  for (let i = 0; i < data.length; i++) {
    const val = accessor(data[i]);
    occur[val] = (occur[val] || 0) + 1;
  }
  return occur;
};

export const getMode = (data, accessor) => {
  const occur = getFrequency(data, accessor);
  return Object.keys(occur).reduce(
    (prev, key) => (occur[prev] >= occur[key] ? prev : key),
    Object.keys(occur)[0]
  );
};

export const countUnique = (data, accessor = identity) => {
  return Object.keys(
    data.reduce((uniques, d) => {
      const val = accessor(d);
      uniques[val] = uniques[val] || 0;
      uniques[val] += 1;
      return uniques;
    }, {})
  ).length;
};

export const percentMean = (data, accessor) => {
  const {getNumerator, getDenominator} = accessor;
  const denominator = aggregate(data, AGGREGATION_TYPES.sum, getDenominator);
  if (denominator <= 0) {
    return 0;
  }
  const result = aggregate(data, AGGREGATION_TYPES.sum, getNumerator) / denominator;
  return result;
};

export function aggregate(
  data: any[],
  technique: ValueOf<AggregationTypes>,
  accessor: (any: any) => any = identity
): any {
  switch (technique) {
    case AGGREGATION_TYPES.average:
      return mean(data, accessor);
    case 'mean_of_percent':
      return percentMean(data, accessor);
    case AGGREGATION_TYPES.countUnique:
      return countUnique(data, accessor);
    case AGGREGATION_TYPES.mode:
      return getMode(data, accessor);
    case AGGREGATION_TYPES.maximum:
      return max(data, accessor);
    case AGGREGATION_TYPES.minimum:
      return min(data, accessor);
    case AGGREGATION_TYPES.median:
      return median(data, accessor);
    case AGGREGATION_TYPES.stdev:
      return deviation(data, accessor);
    case AGGREGATION_TYPES.sum:
      return sum(data, accessor);
    case AGGREGATION_TYPES.variance:
      return variance(data, accessor);
    default:
      return data.length;
  }
}

export const AGGREGATION_NAME: {
  [key: string]: string;
} = {
  [AGGREGATION_TYPES.average]: 'Average',
  [AGGREGATION_TYPES.countUnique]: 'Number of Unique',
  [AGGREGATION_TYPES.mode]: 'Most Often',
  [AGGREGATION_TYPES.maximum]: 'Max',
  [AGGREGATION_TYPES.minimum]: 'Min',
  [AGGREGATION_TYPES.median]: 'Median',
  [AGGREGATION_TYPES.stdev]: 'Std Deviation',
  [AGGREGATION_TYPES.sum]: 'Total',
  [AGGREGATION_TYPES.variance]: 'Variance'
};

// ratio: both denominator & numerator precent
// average, min, max, median,
