// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {MapView} from '@deck.gl/core';
import {worldToPixels} from '@math.gl/web-mercator';

import {KeplerGlobeView} from '@kepler.gl/deckgl-layers';

import {targetArrowAngle} from './target-arrow';

function mercatorViewport(overrides = {}) {
  const viewport = new MapView({farZMultiplier: 1.2}).makeViewport({
    width: 800,
    height: 800,
    viewState: {
      latitude: 37.8,
      longitude: -122.4,
      zoom: 10,
      pitch: 0,
      bearing: 0,
      ...overrides
    }
  });
  if (!viewport) {
    throw new Error('expected a viewport');
  }
  return viewport;
}

describe('targetArrowAngle', () => {
  const source = [-122.45, 37.75, 0];
  const straight = {greatCircle: false, height: 0};

  test('points along the screen axes on a north-up map', () => {
    const viewport = mercatorViewport();
    expect(targetArrowAngle(viewport, source, [-122.45, 37.85, 0], straight)).toBeCloseTo(0, 0);
    expect(targetArrowAngle(viewport, source, [-122.35, 37.75, 0], straight)).toBeCloseTo(90, 0);
    expect(targetArrowAngle(viewport, source, [-122.55, 37.75, 0], straight)).toBeCloseTo(-90, 0);
    const south = targetArrowAngle(viewport, source, [-122.45, 37.65, 0], straight);
    expect(Math.abs(Math.abs(south) - 180)).toBeLessThan(1);
  });

  test('rotates with map bearing', () => {
    const flat = targetArrowAngle(mercatorViewport(), source, [-122.35, 37.75, 0], straight);
    const turned = targetArrowAngle(
      mercatorViewport({bearing: 90}),
      source,
      [-122.35, 37.75, 0],
      straight
    );
    const delta = Math.abs(turned - flat);
    expect(Math.min(delta, 360 - delta)).toBeCloseTo(90, 0);
  });

  test('uses the short crossing at the antimeridian', () => {
    const viewport = mercatorViewport({longitude: 180, latitude: 0, zoom: 3});
    expect(targetArrowAngle(viewport, [170, 0, 0], [-170, 0, 0], straight)).toBeCloseTo(90, 0);
  });

  test('a raised arc meets its target at a different angle than the chord when pitched', () => {
    const viewport = mercatorViewport({pitch: 50, zoom: 8});
    const from = [-122.5, 37.7, 0];
    const to = [-122.3, 37.9, 0];
    const chord = targetArrowAngle(viewport, from, to, straight);
    const arc = targetArrowAngle(viewport, from, to, {greatCircle: false, height: 1});
    expect(Math.abs(arc - chord)).toBeGreaterThan(15);
  });

  test('returns 0 when the segment has no direction', () => {
    const viewport = mercatorViewport();
    expect(targetArrowAngle(viewport, source, source, straight)).toBe(0);
    expect(targetArrowAngle(viewport, [Number.NaN, 0, 0], source, straight)).toBe(0);
  });

  test('common-space projection uses the same pixel axes as viewport.project', () => {
    const viewport = mercatorViewport();
    const projected = viewport.project([-122.4, 37.8, 0]);
    const common = worldToPixels(
      viewport.projectPosition([-122.4, 37.8, 0]),
      viewport.pixelProjectionMatrix
    );
    expect(common[0]).toBeCloseTo(projected[0], 3);
    expect(common[1]).toBeCloseTo(projected[1], 3);
  });

  test('a northbound globe segment at the view center points up', () => {
    const viewport = new KeplerGlobeView({resolution: 5}).makeViewport({
      width: 800,
      height: 800,
      viewState: {latitude: 20, longitude: 0, zoom: 2, pitch: 0, bearing: 0}
    });
    if (!viewport) {
      throw new Error('expected a globe viewport');
    }
    const angle = targetArrowAngle(viewport, [0, 20, 0], [0, 22, 0], {
      greatCircle: true,
      height: 0
    });
    expect(Math.abs(angle)).toBeLessThan(10);
  });
});
