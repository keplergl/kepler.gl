// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {AnnotationKind} from '@kepler.gl/constants';
import {
  makeMarker,
  movePoint,
  moveText,
  resizeCircle,
  isLeftOriented,
  isBelowOriented,
  getTextPlacement,
  getAnnotationTextBoxStyle,
  isPointVisibleOnGlobe
} from '@kepler.gl/components';

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

test('#isBelowOriented', t => {
  t.equal(isBelowOriented(-45), false, 'default -45 is above');
  t.equal(isBelowOriented(-90), false, '-90 (up) is above');
  t.equal(isBelowOriented(0), false, '0 (right) is not below');
  t.equal(isBelowOriented(45), true, '45 is below');
  t.equal(isBelowOriented(90), true, '90 (down) is below');
  t.equal(isBelowOriented(135), true, '135 is below');
  t.equal(isBelowOriented(180), false, '180 (left) is not below');

  t.end();
});

test('#getTextPlacement -> stored values win over angle', t => {
  const annotation = makePointAnnotation({
    angle: 0,
    textSide: 'left',
    textVerticalPosition: 'below'
  });
  t.deepEqual(
    getTextPlacement(annotation),
    {side: 'left', vertical: 'below'},
    'should use stored placement'
  );
  t.end();
});

test('#getTextPlacement -> derives from arm angle when unset', t => {
  t.deepEqual(
    getTextPlacement(makePointAnnotation({angle: -45})),
    {side: 'right', vertical: 'above'},
    'default angle is right + above'
  );
  t.deepEqual(
    getTextPlacement(makePointAnnotation({angle: 180})),
    {side: 'left', vertical: 'above'},
    '180 degrees is left + above'
  );
  t.deepEqual(
    getTextPlacement(makePointAnnotation({angle: 90})),
    {side: 'right', vertical: 'below'},
    '90 degrees is right + below'
  );
  t.end();
});

test('#getAnnotationTextBoxStyle -> right/above uses left + bottom', t => {
  const annotation = makePointAnnotation({
    autoSize: false,
    textWidth: 100,
    angle: 0,
    armLength: 50,
    textSide: 'right',
    textVerticalPosition: 'above'
  });
  const style = getAnnotationTextBoxStyle(annotation, mockViewport);

  t.equal(style.left, 550, 'text starts at arm endpoint x');
  t.equal(style.bottom, 300, 'text sits above the arm endpoint');
  t.ok(style.borderBottom, 'connector is on the bottom edge');
  t.notOk(style.right, 'should not set right when on the right');
  t.notOk(style.top, 'should not set top when above');

  t.end();
});

test('#getAnnotationTextBoxStyle -> left/below uses right + top', t => {
  const annotation = makePointAnnotation({
    autoSize: false,
    textWidth: 100,
    angle: 135,
    armLength: 50,
    textSide: 'left',
    textVerticalPosition: 'below'
  });
  const style = getAnnotationTextBoxStyle(annotation, mockViewport);

  t.ok(typeof style.right === 'number', 'text is anchored from the right');
  t.ok(typeof style.top === 'number', 'text sits below the arm endpoint');
  t.ok(style.borderTop, 'connector is on the top edge');
  t.notOk(style.left, 'should not set left when on the left');
  t.notOk(style.bottom, 'should not set bottom when below');

  t.end();
});

test('#getAnnotationTextBoxStyle -> TEXT without explicit side stays centered', t => {
  const annotation = makeTextAnnotation({autoSize: false, textWidth: 100});
  const style = getAnnotationTextBoxStyle(annotation, mockViewport);

  t.equal(style.left, 450, 'TEXT should be centered on the anchor (x - width/2)');
  t.equal(style.bottom, 300, 'TEXT should sit above the anchor');
  t.notOk(style.right, 'should not set right when centered');
  t.notOk(style.borderBottom, 'TEXT should not draw a leader');

  t.end();
});

test('#getAnnotationTextBoxStyle -> TEXT left uses right edge at the anchor', t => {
  const annotation = makeTextAnnotation({
    autoSize: false,
    textWidth: 100,
    textSide: 'left',
    textVerticalPosition: 'above'
  });
  const style = getAnnotationTextBoxStyle(annotation, mockViewport);

  t.equal(style.right, 500, 'left-placed TEXT is anchored from the right');
  t.notOk(style.left, 'should not set left when on the left');

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
  t.ok('textSide' in changes, 'should return textSide');
  t.ok('textVerticalPosition' in changes, 'should return textVerticalPosition');
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

test('#isPointVisibleOnGlobe -> front-facing point round-trips to itself', t => {
  // A GlobeViewport-like mock where project/unproject are inverses: any point
  // resolves back to itself, i.e. it is on the near (visible) hemisphere.
  const identityViewport = {
    project: ([lng, lat]) => [lng, lat],
    unproject: ([x, y]) => [x, y]
  };

  t.equal(isPointVisibleOnGlobe([0, 0], identityViewport), true, 'center point is visible');
  t.equal(isPointVisibleOnGlobe([30, -45], identityViewport), true, 'off-center point is visible');

  t.end();
});

test('#isPointVisibleOnGlobe -> occluded point resolves to a different surface point', t => {
  // Mock the far-side occlusion: unproject always returns the front-most point
  // ([0, 0]) regardless of pixel, as deck's GlobeViewport does for a ray that
  // hits the near hemisphere first.
  const occludingViewport = {
    project: ([lng, lat]) => [lng, lat],
    unproject: () => [0, 0]
  };

  t.equal(isPointVisibleOnGlobe([0, 0], occludingViewport), true, 'front point stays visible');
  t.equal(
    isPointVisibleOnGlobe([120, 0], occludingViewport),
    false,
    'point far from the resolved surface point is occluded'
  );

  t.end();
});

test('#isPointVisibleOnGlobe -> non-finite projection is treated as not visible', t => {
  const nanProjectViewport = {
    project: () => [NaN, NaN],
    unproject: ([x, y]) => [x, y]
  };
  const nanUnprojectViewport = {
    project: ([lng, lat]) => [lng, lat],
    unproject: () => [NaN, NaN]
  };

  t.equal(
    isPointVisibleOnGlobe([10, 10], nanProjectViewport),
    false,
    'non-finite project result is not visible'
  );
  t.equal(
    isPointVisibleOnGlobe([10, 10], nanUnprojectViewport),
    false,
    'non-finite unproject result is not visible'
  );

  t.end();
});
