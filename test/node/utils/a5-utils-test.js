// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {getA5Center} from '@kepler.gl/layers';
import {a5TokenToPolygonGeo, normalizeA5Token} from '../../../src/layers/src/a5-layer/a5-utils';

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

test('Utils -> A5 1.0 cell IDs', t => {
  // This Sydney cell has a different ID in 0.x, unlike the SF fixture above.
  const token = '9ca4cf8000000000';
  const center = getA5Center(token);
  t.ok(Math.abs(center[0] - 151.17625731278906) < 1e-8, '1.0 longitude is in Sydney');
  t.ok(Math.abs(center[1] + 33.8782228122596) < 1e-8, '1.0 latitude is in Sydney');
  t.equal(normalizeA5Token('"9CA4CF8000000000"'), token, 'normalizes a quoted hex ID');
  t.equal(normalizeA5Token(BigInt(`0x${token}`)), token, 'normalizes a bigint ID');
  t.deepEqual(getA5Center(BigInt(`0x${token}`)), center, 'bigint and hex centers agree');

  const outline = a5TokenToPolygonGeo({token});
  const polygon = a5TokenToPolygonGeo({token}, {isClosed: true});
  t.equal(outline.geometry.type, 'LineString', 'outline is a line');
  t.equal(polygon.geometry.type, 'Polygon', 'closed feature is a polygon');
  const ring = polygon.geometry.coordinates[0];
  t.deepEqual(ring, outline.geometry.coordinates, 'polygon and outline use the same boundary');
  t.deepEqual(ring[0], ring[ring.length - 1], 'boundary is closed');
  t.ok(
    ring.every(([lng, lat]) => Math.abs(lng - center[0]) < 0.1 && Math.abs(lat - center[1]) < 0.1),
    'boundary surrounds the Sydney cell'
  );

  for (const invalid of ['', 'ZZZZ', '0', undefined]) {
    t.equal(getA5Center(invalid), null, 'missing or invalid center is null');
    t.equal(a5TokenToPolygonGeo({token: invalid}), null, 'missing or invalid boundary is null');
  }
  t.end();
});
