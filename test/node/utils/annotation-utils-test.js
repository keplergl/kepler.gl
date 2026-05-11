// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {AnnotationKind} from '@kepler.gl/constants';
import {makeMarker, movePoint, moveText, resizeCircle, isLeftOriented} from '@kepler.gl/components';

const mockViewport = {
  project: ([lng, lat]) => [lng * 10 + 500, lat * -10 + 300],
  unproject: ([x, y]) => [(x - 500) / 10, (y - 300) / -10],
  longitude: 0,
  latitude: 0,
  width: 1000,
  height: 600,
  zoom: 10
};

const makePointAnnotation = (overrides = {}) => ({
  id: 'test-point',
  kind: AnnotationKind.POINT,
  isVisible: true,
  autoSize: true,
  autoSizeY: true,
  anchorPoint: [0, 0],
  label: 'Test',
  lineColor: '#FFFFFF',
  lineWidth: 2,
  textWidth: 100,
  textHeight: 30,
  armLength: 50,
  angle: 0,
  ...overrides
});

const makeTextAnnotation = (overrides = {}) => ({
  id: 'test-text',
  kind: AnnotationKind.TEXT,
  isVisible: true,
  autoSize: true,
  autoSizeY: true,
  anchorPoint: [0, 0],
  label: 'Test',
  lineColor: '#FFFFFF',
  lineWidth: 2,
  textWidth: 100,
  textHeight: 30,
  ...overrides
});

const makeCircleAnnotation = (overrides = {}) => ({
  id: 'test-circle',
  kind: AnnotationKind.CIRCLE,
  isVisible: true,
  autoSize: true,
  autoSizeY: true,
  anchorPoint: [0, 0],
  label: 'Circle',
  lineColor: '#FFFFFF',
  lineWidth: 2,
  textWidth: 100,
  textHeight: 30,
  armLength: 50,
  angle: 0,
  radiusInMeters: 1000,
  ...overrides
});

test('#isLeftOriented', t => {
  t.equal(isLeftOriented(0), false, '0 degrees is right-oriented');
  t.equal(isLeftOriented(45), false, '45 degrees is right-oriented');
  t.equal(isLeftOriented(90), false, '90 degrees is right-oriented');
  t.equal(isLeftOriented(91), true, '91 degrees is left-oriented');
  t.equal(isLeftOriented(180), true, '180 degrees is left-oriented');
  t.equal(isLeftOriented(-90), false, '-90 degrees is right-oriented');
  t.equal(isLeftOriented(-91), true, '-91 degrees is left-oriented');
  t.equal(isLeftOriented(-180), true, '-180 degrees is left-oriented');

  t.end();
});

test('#makeMarker -> POINT annotation', t => {
  const annotation = makePointAnnotation({anchorPoint: [10, 20], armLength: 50, angle: 0});
  const marker = makeMarker(annotation, mockViewport);

  t.equal(marker.kind, AnnotationKind.POINT, 'should return POINT kind');
  t.ok(isFinite(marker.x), 'should have numeric x');
  t.ok(isFinite(marker.y), 'should have numeric y');
  t.ok(isFinite(marker.tx), 'should have numeric tx');
  t.ok(isFinite(marker.ty), 'should have numeric ty');
  t.equal(marker.tx, 50, 'tx should equal armLength when angle is 0');
  t.ok(Math.abs(marker.ty) < 0.001, 'ty should be ~0 when angle is 0');

  t.end();
});

test('#makeMarker -> TEXT annotation', t => {
  const annotation = makeTextAnnotation({anchorPoint: [5, 10]});
  const marker = makeMarker(annotation, mockViewport);

  t.equal(marker.kind, AnnotationKind.TEXT, 'should return TEXT kind');
  t.equal(marker.tx, 0, 'TEXT should have tx = 0');
  t.equal(marker.ty, 0, 'TEXT should have ty = 0');

  t.end();
});

test('#makeMarker -> POINT with non-zero angle', t => {
  const annotation = makePointAnnotation({armLength: 100, angle: 90});
  const marker = makeMarker(annotation, mockViewport);

  t.ok(Math.abs(marker.tx) < 0.001, 'tx should be ~0 at 90 degrees');
  t.ok(Math.abs(marker.ty - 100) < 0.001, 'ty should be ~100 at 90 degrees');

  t.end();
});

test('#movePoint -> should compute new anchorPoint from delta', t => {
  const annotation = makePointAnnotation({anchorPoint: [0, 0]});
  const delta = {x: 10, y: -5};

  const changes = movePoint(annotation, delta, mockViewport);

  t.ok(changes.anchorPoint, 'should return anchorPoint');
  t.equal(changes.anchorPoint.length, 2, 'anchorPoint should be [lon, lat]');
  // With our mock viewport: unproject([500 + 10, 300 + (-5)]) = [(510-500)/10, (295-300)/-10] = [1, 0.5]
  t.equal(changes.anchorPoint[0], 1, 'longitude should shift by delta.x / scale');
  t.equal(
    changes.anchorPoint[1],
    0.5,
    'latitude should increase when moving up (negative y delta)'
  );

  t.end();
});

test('#movePoint -> zero delta returns same position', t => {
  const annotation = makePointAnnotation({anchorPoint: [5, 10]});
  const delta = {x: 0, y: 0};

  const changes = movePoint(annotation, delta, mockViewport);

  t.deepEqual(changes.anchorPoint, [5, 10], 'should return same anchorPoint for zero delta');

  t.end();
});

test('#moveText -> TEXT annotation delegates to movePoint', t => {
  const annotation = makeTextAnnotation({anchorPoint: [0, 0]});
  const delta = {x: 20, y: 10};

  const changes = moveText(annotation, delta, mockViewport);

  t.ok(changes.anchorPoint, 'TEXT moveText should return anchorPoint');
  t.notOk(changes.angle, 'TEXT moveText should not return angle');
  t.notOk(changes.armLength, 'TEXT moveText should not return armLength');

  t.end();
});

test('#moveText -> POINT annotation changes angle and armLength', t => {
  const annotation = makePointAnnotation({armLength: 50, angle: 0});
  const delta = {x: 10, y: 10};

  const changes = moveText(annotation, delta, mockViewport);

  t.ok('angle' in changes, 'should return angle');
  t.ok('armLength' in changes, 'should return armLength');
  t.notOk('anchorPoint' in changes, 'should not return anchorPoint');

  t.end();
});

test('#resizeCircle -> non-circle returns empty', t => {
  const annotation = makePointAnnotation();
  const delta = {x: 10, y: 0};

  const changes = resizeCircle(annotation, delta, mockViewport);

  t.deepEqual(changes, {}, 'should return empty object for non-circle');

  t.end();
});

test('#resizeCircle -> circle returns radiusInMeters', t => {
  const annotation = makeCircleAnnotation({radiusInMeters: 1000});
  const delta = {x: 5, y: 0};

  const changes = resizeCircle(annotation, delta, mockViewport);

  t.ok('radiusInMeters' in changes, 'should return radiusInMeters');
  t.ok(changes.radiusInMeters > 0, 'radius should be positive');

  t.end();
});

test('#resizeCircle -> radius cannot go below 0', t => {
  const annotation = makeCircleAnnotation({radiusInMeters: 10});
  const delta = {x: -99999, y: 0};

  const changes = resizeCircle(annotation, delta, mockViewport);

  t.ok(changes.radiusInMeters >= 0, 'radius should not be negative');

  t.end();
});
