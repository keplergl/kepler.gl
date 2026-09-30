// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {getA5Center} from '@kepler.gl/layers';

test('Utils -> getA5Center', t => {
  const token = '1ae2988000000000';
  const center = getA5Center(token);
  t.ok(center, 'should return a center');
  t.equal(center.length, 2, 'center should be [lng, lat]');
  t.ok(Math.abs(center[0] + 122.374) < 0.01, 'lng should be near SF');
  t.ok(Math.abs(center[1] - 37.783) < 0.01, 'lat should be near SF');
  t.equal(getA5Center('ZZZZ'), null, 'invalid token returns null');
  t.equal(getA5Center('0'), null, 'world cell returns null');
  t.end();
});
