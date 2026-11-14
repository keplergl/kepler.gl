// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {SolidPolygonLayer, TextLayer} from '@deck.gl/layers';
import {Viewport, WebMercatorViewport, project} from '@deck.gl/core';
import {
  createWaterDomain,
  MAX_HEIGHT,
  MIN_HEIGHT,
  RESOLUTION,
  isWaterSurface,
  markWaterBoundary
} from './domain';

test('capture uses a north-up orthographic grid with known depth and meter scale', () => {
  const view = new WebMercatorViewport({
    width: 900,
    height: 600,
    longitude: 30.5,
    latitude: 50.4,
    zoom: 14,
    pitch: 45,
    bearing: 35
  });
  const domain = createWaterDomain(view);
  const capture = domain.viewport;
  const center = capture.unproject([RESOLUTION / 2, RESOLUTION / 2], {targetZ: 0});
  const top = capture.project([...center.slice(0, 2), MAX_HEIGHT]);
  const bottom = capture.project([...center.slice(0, 2), MIN_HEIGHT]);
  expect(top[0]).toBeCloseTo(RESOLUTION / 2);
  expect(top[1]).toBeCloseTo(bottom[1]);
  expect(top[2]).toBeCloseTo(-1);
  expect(bottom[2]).toBeCloseTo(1);
  expect(capture.unproject([128, 0])[1]).toBeGreaterThan(capture.unproject([128, 256])[1]);
  expect(domain.cellSize * RESOLUTION).toBeCloseTo(domain.span / domain.units);
  const before = [...capture.viewProjectionMatrix];
  createWaterDomain(new WebMercatorViewport({width: 400, height: 400, longitude: -122, zoom: 15}));
  expect(capture.viewProjectionMatrix).toEqual(before);
});

test('rejects non-map and excessively large domains', () => {
  expect(() => createWaterDomain(new Viewport())).toThrow('flat map');
  expect(() =>
    createWaterDomain(new WebMercatorViewport({width: 900, height: 600, zoom: 1}))
  ).toThrow('local area');
});

test.each([
  [64, 64],
  [512, 512],
  [1024, 1024],
  [300.4, 300],
  [0, 64],
  [2048, 1024],
  [NaN, RESOLUTION],
  [Infinity, RESOLUTION]
])('resolution %s produces a bounded integer grid of %s cells per side', (requested, expected) => {
  const view = new WebMercatorViewport({width: 900, height: 600, zoom: 14});
  const original = createWaterDomain(view);
  const domain = createWaterDomain(view, requested);
  expect(domain.resolution).toBe(expected);
  expect(domain.viewport.width).toBe(expected);
  expect(domain.viewport.height).toBe(expected);
  expect(domain.center).toEqual(original.center);
  expect(domain.span).toBe(original.span);
  expect(domain.cellSize * expected).toBeCloseTo(original.cellSize * RESOLUTION);
});

test('drainage follows exterior-connected gaps but leaves enclosed holes blocked', () => {
  const size = 7;
  const heights = new Float32Array(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const x = i % size;
    const y = Math.floor(i / size);
    heights[i * 4] = 100 + i;
    heights[i * 4 + 3] = x > 0 && x < 6 && y > 0 && y < 6 && i !== 24 ? 1 : 0;
  }
  const before = heights.slice();
  expect(markWaterBoundary(heights, size)).toBe(24);
  for (let i = 0; i < size * size; i++) {
    const x = i % size;
    const y = Math.floor(i / size);
    const edge = before[i * 4 + 3] && (x === 1 || x === 5 || y === 1 || y === 5);
    expect(heights[i * 4 + 1]).toBe(Number(Boolean(edge)));
    expect(heights[i * 4]).toBe(before[i * 4]);
    expect(heights[i * 4 + 3]).toBe(before[i * 4 + 3]);
  }
  // Opening a channel connects the hole to the exterior, making its banks outlets.
  heights[10 * 4 + 3] = heights[17 * 4 + 3] = 0;
  expect(markWaterBoundary(heights, size)).toBe(22);
  expect(heights[23 * 4 + 1]).toBe(1);
  expect(heights[25 * 4 + 1]).toBe(1);
  expect(heights[31 * 4 + 1]).toBe(1);
});

test('an empty capture has no terrain or drainage cells', () => {
  const heights = new Float32Array(5 * 5 * 4);
  expect(markWaterBoundary(heights, 5)).toBe(0);
  expect(heights.every(value => value === 0)).toBe(true);
});

test.each([11, 16, 20])('capture supplies finite polygon projection uniforms at zoom %s', zoom => {
  const view = new WebMercatorViewport({
    width: 900,
    height: 600,
    longitude: 30.5,
    latitude: 50.4,
    zoom
  });
  const {viewport} = createWaterDomain(view);
  // Exercise the real shader projection path used when drawing polygon layers.
  // At close zooms deck.gl derives a geographic origin from the viewport itself.
  const uniforms = project.getUniforms({viewport, coordinateSystem: 'lnglat'});
  const values = Object.values(uniforms).flatMap(value =>
    typeof value === 'boolean' ? [] : Array.from([value].flat())
  );
  expect(values.length).toBeGreaterThan(0);
  expect(values.every(Number.isFinite)).toBe(true);
});

test('captures polygon subclasses but excludes labels and other visual overlays', () => {
  class CustomPolygon extends SolidPolygonLayer {
    static layerName = 'CustomPolygon';
  }
  expect(isWaterSurface(new CustomPolygon({id: 'surface'}))).toBe(true);
  expect(isWaterSurface(new TextLayer({id: 'labels'}))).toBe(false);
});
