// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {deviation, min, max, mean, median, sum, variance} from 'd3-array';
import {AGGREGATION_TYPES} from '@kepler.gl/constants';

export const getFrequency = data =>
  data.reduce(
    (uniques, val) => ({
      ...uniques,
      [val]: (uniques[val] || 0) + 1
    }),
    {}
  );

export const getMode = data => {
  const occur = getFrequency(data);
  return Object.keys(occur).reduce(
    (prev, key) => (occur[prev] >= occur[key] ? prev : key),
    Object.keys(occur)[0]
  );
};

export function aggregate(data, technique) {
  switch (technique) {
    case AGGREGATION_TYPES.average:
      return mean(data);
    case AGGREGATION_TYPES.countUnique:
      return Object.keys(
        data.reduce((uniques, val) => {
          uniques[val] = uniques[val] || 0;
          uniques[val] += 1;
          return uniques;
        }, {})
      ).length;
    case AGGREGATION_TYPES.mode:
      return getMode(data);

    case AGGREGATION_TYPES.maximum:
      return max(data);
    case AGGREGATION_TYPES.minimum:
      return min(data);
    case AGGREGATION_TYPES.median:
      return median(data);
    case AGGREGATION_TYPES.stdev:
      return deviation(data);
    case AGGREGATION_TYPES.sum:
      return sum(data);
    case AGGREGATION_TYPES.variance:
      return variance(data);
    default:
      return data.length;
  }
}
