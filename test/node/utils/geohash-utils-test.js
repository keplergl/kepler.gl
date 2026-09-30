// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {getGeohashCenter} from '@kepler.gl/layers';

test('Utils -> getGeohashCenter', t => {
  const token = '9q8yyk';
  const center = getGeohashCenter(token);
  t.ok(center, 'should return a center');
  t.equal(center.length, 2, 'center should be [lng, lat]');
  t.ok(Math.abs(center[0] + 122.415) < 0.01, 'lng should be near SF');
  t.ok(Math.abs(center[1] - 37.774) < 0.01, 'lat should be near SF');
  t.equal(getGeohashCenter('AAAA'), null, 'invalid token returns null');
  t.equal(getGeohashCenter(''), null, 'empty token returns null');
  t.equal(getGeohashCenter('ailo'), null, 'tokens with invalid base32 letters return null');
  t.deepEqual(
    getGeohashCenter("'9q8yyk'"),
    getGeohashCenter('9q8yyk'),
    'strips surrounding quotes'
  );
  t.deepEqual(getGeohashCenter('DR5RG'), getGeohashCenter('dr5rg'), 'geohash is case-insensitive');
  t.end();
});
