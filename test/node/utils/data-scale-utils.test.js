// Copyright (c) 2019 Uber Technologies, Inc.
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

import {
  getOrdinalDomain,
  getQuantileDomain,
  getLinearDomain
} from 'utils/data-scale-utils';

function numberSort(a, b) {
  return a - b;
}

it('DataScaleUtils -> getOrdinalDomain', () => {
  const data = ['a', 'a', 'b', undefined, null, 0];
  function valueAccessor(d) {
    return d.value;
  }

  const values = [{value: 'a'}, {value: 'b'}, {value: 'b'}];

  expect(getOrdinalDomain(data)).toEqual([0, 'a', 'b']);

  expect(getOrdinalDomain(values, valueAccessor)).toEqual(['a', 'b']);
});

it('DataScaleUtils -> getQuantileDomain', () => {
  const data = ['a', 'b', 'c', 'b', undefined, null];
  const quanData = [1, 4, 2, 3, 1, undefined, null, 0];
  function valueAccessor(d) {
    return d.value;
  }

  const values = [{value: 'a'}, {value: 'b'}, {value: 'b'}];

  expect(getQuantileDomain(data, undefined, undefined)).toEqual(['a', 'b', 'b', 'c'])

  expect(getQuantileDomain(quanData, undefined, numberSort)).toEqual([0, 1, 1, 2, 3, 4])

  expect(getQuantileDomain(values, valueAccessor)).toEqual(['a', 'b', 'b'])
});

it('DataScaleUtils -> getLinearDomain', () => {
  const quanData = [1, 4, 2, 3, 1, undefined, null, 0];
  function valueAccessor(d) {
    return d.value;
  }

  const values = [{value: 1}, {value: 0}, {value: -3}];

  expect(getLinearDomain(quanData, undefined)).toEqual([0, 4]);

  expect(getLinearDomain([10, 10])).toEqual([10, 10]);

  expect(getLinearDomain([10, undefined])).toEqual([10, 10]);

  expect(getLinearDomain([undefined, undefined, null])).toEqual([0, 1]);

  expect(getLinearDomain(values, valueAccessor)).toEqual([-3, 1]);
});
