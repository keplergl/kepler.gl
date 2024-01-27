// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {extent} from 'd3-array';

import {notNullorUndefined, unique} from './data-utils';
import {DataContainerInterface} from './data-container-interface';

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
