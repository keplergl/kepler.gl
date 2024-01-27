// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {getS2Center} from '@kepler.gl/layers';

test('Utils -> getS2Center', t => {
  const s2Toekn = '8085873c';
  t.deepEqual(getS2Center(s2Toekn), [-122.4637079795235, 37.78228912269449]);
  t.end();
});
