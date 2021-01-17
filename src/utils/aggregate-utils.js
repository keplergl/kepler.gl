// Copyright (c) 2021 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import {deviation, min, max, mean, median, sum, variance} from 'd3-array';
import {AGGREGATION_TYPES} from 'constants/default-settings';

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
