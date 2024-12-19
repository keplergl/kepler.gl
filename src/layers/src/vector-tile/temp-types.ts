// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Analyzer, DATA_TYPES} from 'type-analyzer';

import {FilterProps} from '@kepler.gl/table';
import {Field} from '@kepler.gl/types';

/**
 * Type for transformRequest returned parameters.
 */
export type RequestParameters = {
  /** The URL to be requested. */
  url: string;
  /** Search parameters to be added onto the URL. */
  searchParams: URLSearchParams;
  /** Options passed to fetch. */
  options: RequestInit;
};

export const getLoaderOptions = () => {
  return {
    mvt: {
      workerUrl: `https://unpkg.com/@loaders.gl/mvt/dist/mvt-worker.js`
    }
  };
};

export const isMobile = () => {
  return false;
};

export type ZoomStops = number[][];

export type DomainStops = {
  z: number[];
  stops: ZoomStops;
  interpolation: 'interpolate';
};

export type VectorTileField = {
  analyzerType: string;
  name: string;
  id: string;
  format: string;
  type: string;
  filterProps?: FilterProps;
};

export type VectorTileMetadata = {
  metaJson: any | null;
  bounds: number[] | null;
  center: number[] | null;
  maxZoom: number | null;
  minZoom: number | null;
  name?: string;
  description?: string;
  fields: VectorTileField[];
};

/**
 * Whether an input is a valid number (finite, not NaN)
 */
export const isValidNumber = (n?: unknown): n is number => Number.isFinite(n);

/**
 * Remove null/0 values from the bottom of the quantiles. If the column has many nulls
 * or 0s at the bottom of the quantiles, it will wash out color scales and produce
 * meaningless "no value" legend entries. We want to keep the first 0 and no others.
 * Operates in place.
 */
export function pruneQuantiles(quantiles: number[]): void {
  const firstNonZeroIdx = quantiles.findIndex(d => d !== null && d !== 0);
  if (firstNonZeroIdx > 0) {
    quantiles.splice(0, firstNonZeroIdx - 1);
  }
}

/**
 * Check whether geojson linestring's 4th coordinate is 1) not timestamp 2) unix time stamp 3) real date time
 * @param {array} timestamps array to be tested if its elements are timestamp
 * @returns {Field | null} the type of timestamp: unix/datetime/invalid(not timestamp)
 */
export function containValidTime(timestamps: string[]): Field | null {
  const formattedTimeStamps = timestamps.map(ts => ({ts}));
  const ignoredDataTypes = Object.keys(DATA_TYPES).filter(
    type => ![DATA_TYPES.TIME, DATA_TYPES.DATETIME, DATA_TYPES.DATE].includes(type)
  );

  // ignore all types but TIME to improve performance
  const analyzedType = Analyzer.computeColMeta(formattedTimeStamps, [], {ignoredDataTypes})[0];

  if (!analyzedType || analyzedType.category !== 'TIME') {
    return null;
  }
  return analyzedType;
}

/**
 * Allows to break down a url into multiple params
 * from http://blog.stevenlevithan.com/archives/parseuri
 */
export function parseUri(str: string): {[key: string]: any} {
  const o = parseUri.options;
  const m = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str);
  const uri = {};
  let i = 14;

  // @ts-expect-error TS2531: Object is possibly 'null'.
  while (i--) uri[o.key[i]] = m[i] || '';

  uri[o.q.name] = {};
  uri[o.key[12]].replace(o.q.parser, ($0, $1, $2) => {
    if ($1) uri[o.q.name][$1] = $2;
  });

  return uri;
}

parseUri.options = {
  strictMode: false,
  key: [
    'source',
    'protocol',
    'authority',
    'userInfo',
    'user',
    'password',
    'host',
    'port',
    'relative',
    'path',
    'directory',
    'file',
    'query',
    'anchor'
  ],
  q: {
    name: 'queryKey',
    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
  },
  parser: {
    strict:
      // eslint-disable-next-line no-useless-escape
      /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
    loose:
      // eslint-disable-next-line no-useless-escape
      /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
};
