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

import {notNullorUndefined, unique} from './data-utils';
import {extent} from 'd3-array';
import {DataContainerInterface} from 'reducers/table-utils/data-container-interface';

type dataValueAccessor = <T>(param: T) => T;
type dataContainerValueAccessor = (d: {index: number}, dc: DataContainerInterface) => any;
type sort = (a: any, b: any) => any;
/**
 * return quantile domain for an array of data
 */
export function getQuantileDomain(
  data: any[],
  valueAccessor?: dataValueAccessor,
  sortFunc?: sort
): number[] {
  const values = typeof valueAccessor === 'function' ? data.map(valueAccessor) : data;

  return values.filter(notNullorUndefined).sort(sortFunc);
}

/**
 * return ordinal domain for a data container
 */
export function getOrdinalDomain(
  dataContainer: DataContainerInterface,
  valueAccessor: dataContainerValueAccessor
): string[] {
  const values = dataContainer.mapIndex(valueAccessor);

  return unique(values)
    .filter(notNullorUndefined)
    .sort();
}

/**
 * return linear domain for an array of data
 */
export function getLinearDomain(
  data: number[],
  valueAccessor?: dataValueAccessor
): [number, number] {
  const range = typeof valueAccessor === 'function' ? extent(data, valueAccessor) : extent(data);
  return range.map((d: undefined | number, i: number) => (d === undefined ? i : d)) as [
    number,
    number
  ];
}

/**
 * return linear domain for an array of data. A log scale domain cannot contain 0
 */
export function getLogDomain(data: any[], valueAccessor: dataValueAccessor): [number, number] {
  const [d0, d1] = getLinearDomain(data, valueAccessor);
  return [d0 === 0 ? 1e-5 : d0, d1];
}
