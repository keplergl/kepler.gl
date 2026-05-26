// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {clamp} from '@kepler.gl/utils';
import {
  rangesEqual,
  clampRange,
  clampWindowToDomain
} from '../../../src/components/src/common/timeline-helpers';

test('Timeline Zoom Utils -> rangesEqual', t => {
  t.ok(rangesEqual([0, 100], [0, 100]), 'identical ranges should be equal');
  t.ok(rangesEqual([0, 100], [0.5, 99.5]), 'ranges within eps=1 should be equal');
  t.notOk(rangesEqual([0, 100], [2, 100]), 'ranges differing by more than eps should not be equal');
  t.notOk(rangesEqual(null, [0, 100]), 'null first arg should return false');
  t.notOk(rangesEqual([0, 100], null), 'null second arg should return false');
  t.notOk(rangesEqual(null, null), 'both null should return false');
  t.ok(rangesEqual([1000, 5000], [1000, 5000], 0), 'exact match with eps=0');
  t.notOk(rangesEqual([1000, 5000], [1001, 5000], 0), 'off by 1 with eps=0 should not match');
  t.end();
});

test('Timeline Zoom Utils -> clampRange', t => {
  t.deepEqual(
    clampRange([10, 90], [0, 100]),
    [10, 90],
    'range within domain stays unchanged'
  );

  t.deepEqual(
    clampRange([-50, 50], [0, 100]),
    [0, 50],
    'start below domain gets clamped to domain start'
  );

  t.deepEqual(
    clampRange([60, 150], [0, 100]),
    [60, 100],
    'end above domain gets clamped to domain end'
  );

  t.deepEqual(
    clampRange([-50, 200], [0, 100]),
    [0, 100],
    'both out of bounds get clamped to full domain'
  );

  const result = clampRange([80, 70], [0, 100]);
  t.ok(result[1] > result[0], 'inverted range produces valid range with end > start');

  t.end();
});

test('Timeline Zoom Utils -> clampWindowToDomain', t => {
  t.deepEqual(
    clampWindowToDomain(20, 60, [0, 100]),
    [20, 60],
    'window within domain stays unchanged'
  );

  t.deepEqual(
    clampWindowToDomain(-20, 20, [0, 100]),
    [0, 20],
    'window starting before domain gets clamped to start'
  );

  t.deepEqual(
    clampWindowToDomain(80, 120, [0, 100]),
    [80, 100],
    'window ending after domain gets clamped to end'
  );

  const [s, e] = clampWindowToDomain(50, 150, [0, 100]);
  t.ok(s >= 0, 'result start is within domain');
  t.ok(e <= 100, 'result end is within domain');
  t.ok(e > s, 'result end > start');

  t.deepEqual(
    clampWindowToDomain(0, 100, [0, 100]),
    [0, 100],
    'window equal to domain stays unchanged'
  );

  t.end();
});

test('Timeline Zoom Utils -> window zoom logic', t => {
  const fullDomain = [0, 1000];
  const filterStart = 200;
  const filterEnd = 400;

  // simulate zoom in (factor > 1)
  const factor = 1.08;
  const center = 300;
  const windowWidth = filterEnd - filterStart;
  const domainWidth = fullDomain[1] - fullDomain[0];
  const minWidth = Math.max(domainWidth / 100, 1);
  const nextWidth = clamp([minWidth, domainWidth], windowWidth / factor);

  t.ok(nextWidth < windowWidth, 'zoom in should reduce window width');
  t.ok(nextWidth >= minWidth, 'zoomed width should not go below minimum');

  // simulate zoom out (factor < 1)
  const factorOut = 1 / 1.08;
  const nextWidthOut = clamp([minWidth, domainWidth], windowWidth / factorOut);
  t.ok(nextWidthOut > windowWidth, 'zoom out should increase window width');
  t.ok(nextWidthOut <= domainWidth, 'zoomed width should not exceed domain');

  t.end();
});

test('Timeline Zoom Utils -> timeline domain zoom logic', t => {
  const fullDomain = [0, 1000];
  const timelineDomain = [200, 800];
  const fullWidth = fullDomain[1] - fullDomain[0];
  const baseWidth = timelineDomain[1] - timelineDomain[0];
  const minWidth = Math.max(fullWidth / 20, 1);

  // zoom in
  const factor = 1.02;
  const nextWidth = clamp([minWidth, fullWidth], baseWidth / factor);
  t.ok(nextWidth < baseWidth, 'zoom in narrows timeline domain');
  t.ok(nextWidth >= minWidth, 'timeline domain width stays above minimum (fullWidth/20)');

  // zoom out
  const factorOut = 1 / 1.02;
  const nextWidthOut = clamp([minWidth, fullWidth], baseWidth / factorOut);
  t.ok(nextWidthOut > baseWidth, 'zoom out widens timeline domain');
  t.ok(nextWidthOut <= fullWidth, 'timeline domain width stays below full width');

  // zoom out from full domain should stay at full
  const nextWidthFull = clamp([minWidth, fullWidth], fullWidth / factorOut);
  t.equal(nextWidthFull, fullWidth, 'cannot zoom out past full domain');

  t.end();
});

test('Timeline Zoom Utils -> keyboard panning step logic', t => {
  const filterStart = 200;
  const filterEnd = 400;
  const windowWidth = filterEnd - filterStart;
  const domainRange = [0, 1000];

  // right arrow: new start = filterEnd, new end = filterEnd + windowWidth
  let nextStart = filterEnd;
  let nextEnd = filterEnd + windowWidth;
  [nextStart, nextEnd] = clampWindowToDomain(nextStart, nextEnd, domainRange);
  t.equal(nextStart, 400, 'right arrow: new start equals old end');
  t.equal(nextEnd, 600, 'right arrow: new end equals old end + width');

  // left arrow: new start = filterStart - windowWidth, new end = filterStart
  nextStart = filterStart - windowWidth;
  nextEnd = filterStart;
  [nextStart, nextEnd] = clampWindowToDomain(nextStart, nextEnd, domainRange);
  t.equal(nextStart, 0, 'left arrow: new start equals old start - width');
  t.equal(nextEnd, 200, 'left arrow: new end equals old start');

  // right arrow at domain boundary
  const filterStart2 = 850;
  const filterEnd2 = 1000;
  const windowWidth2 = filterEnd2 - filterStart2;
  nextStart = filterEnd2;
  nextEnd = filterEnd2 + windowWidth2;
  [nextStart, nextEnd] = clampWindowToDomain(nextStart, nextEnd, domainRange);
  t.ok(nextEnd <= 1000, 'clamped end does not exceed domain');
  t.ok(nextStart >= 0, 'clamped start does not go below domain');

  // left arrow at domain boundary
  const filterStart3 = 0;
  const filterEnd3 = 150;
  const windowWidth3 = filterEnd3 - filterStart3;
  nextStart = filterStart3 - windowWidth3;
  nextEnd = filterStart3;
  [nextStart, nextEnd] = clampWindowToDomain(nextStart, nextEnd, domainRange);
  t.equal(nextStart, 0, 'at left boundary, start stays at 0');
  t.ok(nextEnd >= nextStart, 'end stays >= start');

  t.end();
});
