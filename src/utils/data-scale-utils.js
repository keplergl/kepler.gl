import {notNullorUndefined, unique} from './data-utils';
import {extent} from 'd3-array';

/**
 * return quantile domain for an array of data
 * @param {array} data
 * @param {function | undefined} valueAccessor
 * @param {function | undefined} sortFunc
 * @returns {array} domain
 */
export function getQuantileDomain(data, valueAccessor, sortFunc) {
  const values = typeof valueAccessor === 'function' ?
    data.map(valueAccessor) : data;

  return values
    .filter(notNullorUndefined)
    .sort(sortFunc);
}

/**
 * return ordinal domain for an array of data
 * @param {array} data
 * @param {function} valueAccessor
 * @returns {array} domain
 */
export function getOrdinalDomain(data, valueAccessor) {
  const values = typeof valueAccessor === 'function' ?
    data.map(valueAccessor) : data;

  return unique(values)
    .filter(notNullorUndefined);
}

/**
 * return linear domain for an array of data
 * @param {Array} data
 * @param {function} valueAccessor
 * @returns {Array} domain
 */
export function getLinearDomain(data, valueAccessor) {

  const range = typeof valueAccessor === 'function' ?
    extent(data, valueAccessor) : extent(data);

  return range.map((d, i) => d === undefined ? i : d);
}
