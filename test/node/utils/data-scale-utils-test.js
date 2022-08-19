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
import {
  getOrdinalDomain,
  getQuantileDomain,
  getLinearDomain,
  getLogDomain
} from '@kepler.gl/layers';

import {createDataContainer} from 'reducers/table-utils';

function numberSort(a, b) {
  return a - b;
}

test('DataScaleUtils -> getOrdinalDomain', t => {
  const data = [['a'], ['a'], ['b'], [undefined], [null], [0], null];

  function valueAccessor(d, dc) {
    return dc.valueAt(d.index, 0);
  }

  t.deepEqual(
    getOrdinalDomain(createDataContainer(data), valueAccessor),
    [0, 'a', 'b'],
    'should get correct ordinal domain'
  );

  t.end();
});

test('DataScaleUtils -> getQuantileDomain', t => {
  const data = ['a', 'b', 'c', 'b', undefined, null];
  const quanData = [1, 4, 2, 3, 1, undefined, null, 0];
  function valueAccessor(d) {
    return d.value;
  }

  const values = [{value: 'a'}, {value: 'b'}, {value: 'b'}];

  t.deepEqual(
    getQuantileDomain(data, undefined, undefined),
    ['a', 'b', 'b', 'c'],
    'should get correct quantile domain'
  );

  t.deepEqual(
    getQuantileDomain(quanData, undefined, numberSort),
    [0, 1, 1, 2, 3, 4],
    'should get correct quantile domain'
  );

  t.deepEqual(
    getQuantileDomain(values, valueAccessor),
    ['a', 'b', 'b'],
    'should get correct quantile domain'
  );

  t.end();
});

test('DataScaleUtils -> getLinearDomain', t => {
  const quanData = [1, 4, 2, 3, 1, undefined, null, 0];
  function valueAccessor(d) {
    return d.value;
  }

  const values = [{value: 1}, {value: 0}, {value: -3}];

  t.deepEqual(getLinearDomain(quanData, undefined), [0, 4], 'should get correct Linear domain');

  t.deepEqual(getLinearDomain([10, 10]), [10, 10], 'should get correct Linear domain');

  t.deepEqual(getLinearDomain([10, undefined]), [10, 10], 'should get correct Linear domain');

  t.deepEqual(
    getLinearDomain([undefined, undefined, null]),
    [0, 1],
    'should get correct Linear domain'
  );

  t.deepEqual(getLinearDomain(values, valueAccessor), [-3, 1], 'should get correct Linear domain');

  t.end();
});

test('DataScaleUtils -> getLogDomain', t => {
  function valueAccessor(d) {
    return d.value;
  }

  t.deepEqual(
    getLogDomain([{value: 1}, {value: 0}, {value: -3}], valueAccessor),
    [-3, 1],
    'should get correct Log domain with negative numbers'
  );

  t.deepEqual(
    getLogDomain([{value: 1}, {value: 0}, {value: 3}], valueAccessor),
    [0.00001, 3],
    'should not contain a 0 in domain'
  );

  t.deepEqual(
    getLogDomain([], valueAccessor),
    [0.00001, 1],
    'should have undefined domain for empty set'
  );

  t.end();
});
