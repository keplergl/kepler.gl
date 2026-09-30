// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {deviation, mean, quantileSorted} from 'd3-array';

import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {Bin} from '@kepler.gl/types';

import {isNumber} from './data-utils';
import {histogramFromValues} from './plot';
import quickInsertionSort from './quick-insertion-sort';
import {DataContainerInterface} from './data-container-interface';

export const NUMERIC_BIN_COUNT = 20;

export enum ColumnStatsType {
  numeric = 'numeric',
  categorical = 'categorical',
  boolean = 'boolean',
  time = 'time',
  geo = 'geo',
  other = 'other'
}

export type Quantile = {label: string; value: number | null};

export type NumericColumnStats = {
  type: ColumnStatsType.numeric;
  bins: Bin[];
  quantiles: Quantile[];
  mean: number | null;
  std: number | null;
  percentNulls: number | null;
};

export type CategoricalColumnStats = {
  type: ColumnStatsType.categorical;
  uniqueValues: number;
  percentNulls: number | null;
};

export type TimeColumnStats = {
  type: ColumnStatsType.time;
  bins: Bin[];
  min: number | null;
  max: number | null;
  percentNulls: number | null;
};

export type BooleanColumnStats = {
  type: ColumnStatsType.boolean;
};

export type GeometryColumnStats = {
  type: ColumnStatsType.geo;
};

export type UnknownColumnStats = {
  type: ColumnStatsType.other;
};

export type ColumnStats =
  | NumericColumnStats
  | BooleanColumnStats
  | CategoricalColumnStats
  | TimeColumnStats
  | GeometryColumnStats
  | UnknownColumnStats;

const QUANTILE_STOPS = [0, 0.25, 0.5, 0.75, 1];

function percentNulls(total: number, valid: number): number | null {
  return total > 0 ? (total - valid) / total : null;
}

function getNumericStats(values: readonly unknown[]): NumericColumnStats {
  const filtered = values.filter(isNumber);
  quickInsertionSort(filtered);

  const quantiles = QUANTILE_STOPS.map(p => ({
    label: p === 0 ? 'Min' : p === 1 ? 'Max' : `${p * 100}%`,
    value: filtered.length ? quantileSorted(filtered, p) ?? null : null
  }));

  return {
    type: ColumnStatsType.numeric,
    bins: histogramFromValues(filtered, NUMERIC_BIN_COUNT),
    quantiles,
    percentNulls: percentNulls(values.length, filtered.length),
    mean: filtered.length ? mean(filtered) ?? null : null,
    std: filtered.length ? deviation(filtered) ?? null : null
  };
}

function isPresentCategoricalValue(v: unknown): boolean {
  return v !== null && v !== undefined && v !== '';
}

function getCategoricalStats(values: readonly unknown[]): CategoricalColumnStats {
  const filtered = values.filter(isPresentCategoricalValue);
  return {
    type: ColumnStatsType.categorical,
    uniqueValues: new Set(filtered).size,
    percentNulls: percentNulls(values.length, filtered.length)
  };
}

function getTimeStats(values: readonly unknown[]): TimeColumnStats {
  const filtered = values.filter(isNumber);
  const bins = histogramFromValues(filtered, NUMERIC_BIN_COUNT);

  return {
    type: ColumnStatsType.time,
    bins,
    min: filtered.length ? filtered.reduce((a, b) => (a < b ? a : b)) : null,
    max: filtered.length ? filtered.reduce((a, b) => (a > b ? a : b)) : null,
    percentNulls: percentNulls(values.length, filtered.length)
  };
}

export function collectColumnValues(
  dataContainer: DataContainerInterface,
  fieldIdx: number
): unknown[] {
  const n = dataContainer.numRows();
  const values = new Array(n);
  for (let i = 0; i < n; i++) {
    values[i] = dataContainer.valueAt(i, fieldIdx);
  }
  return values;
}

export function computeColumnStats(values: readonly unknown[], fieldType: string): ColumnStats {
  switch (fieldType) {
    case ALL_FIELD_TYPES.real:
    case ALL_FIELD_TYPES.integer:
      return getNumericStats(values);
    case ALL_FIELD_TYPES.string:
    case ALL_FIELD_TYPES.date:
    case ALL_FIELD_TYPES.boolean:
      return getCategoricalStats(values);
    case ALL_FIELD_TYPES.timestamp:
      return getTimeStats(values);
    default:
      return {type: ColumnStatsType.other};
  }
}

/**
 * Compute column statistics asynchronously so the UI can paint a loading state first.
 */
export function getColumnStatistics({
  values,
  fieldType
}: {
  values: readonly unknown[];
  fieldType: string;
}): Promise<ColumnStats> {
  return new Promise(resolve => {
    resolve(computeColumnStats(values, fieldType));
  });
}
