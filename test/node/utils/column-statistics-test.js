// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';

import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {ColumnStatsType, computeColumnStats, getColumnStatistics} from '@kepler.gl/utils';

test('columnStatistics -> numeric', t => {
  const stats = computeColumnStats([1, 2, 3, 4, null], ALL_FIELD_TYPES.integer);

  t.equal(stats.type, ColumnStatsType.numeric, 'should return numeric stats');
  if (stats.type === ColumnStatsType.numeric) {
    t.equal(stats.mean, 2.5, 'should compute mean from valid numbers');
    t.equal(stats.percentNulls, 0.2, 'should compute percent nulls');
    t.equal(stats.quantiles[0].label, 'Min', 'should include min quantile');
    t.equal(stats.quantiles[0].value, 1, 'min should be 1');
    t.equal(stats.quantiles[stats.quantiles.length - 1].value, 4, 'max should be 4');
    t.ok(stats.bins.length > 0, 'should compute histogram bins');
  }
  t.end();
});

test('columnStatistics -> categorical', t => {
  const stats = computeColumnStats(['a', 'b', 'a', '', null], ALL_FIELD_TYPES.string);

  t.equal(stats.type, ColumnStatsType.categorical, 'should return categorical stats');
  if (stats.type === ColumnStatsType.categorical) {
    t.equal(stats.uniqueValues, 2, 'should count unique non-empty strings');
    t.equal(stats.percentNulls, 0.4, 'should treat empty string and null as nulls');
  }
  t.end();
});

test('columnStatistics -> boolean as categorical', t => {
  const stats = computeColumnStats([true, false, true, null], ALL_FIELD_TYPES.boolean);

  t.equal(stats.type, ColumnStatsType.categorical, 'should treat boolean as categorical');
  if (stats.type === ColumnStatsType.categorical) {
    t.equal(stats.uniqueValues, 2, 'should count true and false as unique values');
    t.equal(stats.percentNulls, 0.25, 'should compute percent nulls');
  }
  t.end();
});

test('columnStatistics -> timestamp', t => {
  const stats = computeColumnStats([1000, 3000, 2000], ALL_FIELD_TYPES.timestamp);

  t.equal(stats.type, ColumnStatsType.time, 'should return time stats');
  if (stats.type === ColumnStatsType.time) {
    t.equal(stats.min, 1000, 'should compute min timestamp');
    t.equal(stats.max, 3000, 'should compute max timestamp');
    t.equal(stats.percentNulls, 0, 'should have no nulls');
    t.ok(stats.bins.length > 0, 'should compute histogram bins');
  }
  t.end();
});

test('columnStatistics -> other', t => {
  const stats = computeColumnStats(['{"type":"Point"}'], ALL_FIELD_TYPES.geojson);
  t.equal(stats.type, ColumnStatsType.other, 'should return other for geojson');
  t.end();
});

test('columnStatistics -> getColumnStatistics is async', async t => {
  const stats = await getColumnStatistics({
    values: [1, 2, 3],
    fieldType: ALL_FIELD_TYPES.real
  });
  t.equal(stats.type, ColumnStatsType.numeric, 'should resolve numeric stats');
  t.end();
});
