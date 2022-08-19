// Copyright (c) 2022 Uber Technologies, Inc.
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

import test from 'tape';
import {getFrequency, getMode, aggregate} from '../utils';
import {AGGREGATION_TYPES} from '@kepler.gl/constants';

test('AggregateUtils - GetFrequency', t => {
  t.deepEqual(
    getFrequency([2, 1, 2, 1]),
    {
      1: 2,
      2: 2
    },
    'Should compute frequency corerctly'
  );

  t.deepEqual(getFrequency([]), {}, 'Should return an empty object');

  t.end();
});

test('AggregateUtils - GetMode', t => {
  t.deepEqual(getMode([2, 1, 2, 1]), '1', 'should return 1 as Mode');

  t.end();
});

test('AggregateUtils - aggregate', t => {
  const data = [1, 2, 3, 1, 2, 3, 4, 3];
  const results = [8, 2.375, 4, 1, 2.5, 1.0606601717798212, 19, 1.125, '3', 8];
  Object.keys(AGGREGATION_TYPES).map((technique, index) => {
    t.equal(
      aggregate(data, technique),
      results[index],
      `Should compute the right aggregation using ${technique} - ${index}`
    );
  });

  t.end();
});
