// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {FilterContext} from '@deck.gl/core';

import CollisionTextLayer from './collision-text-layer';

describe('CollisionTextLayer.filterSubLayer', () => {
  const filter = CollisionTextLayer.prototype.filterSubLayer;
  const ctx = (id: string, renderPass: string): FilterContext =>
    ({layer: {id}, renderPass} as FilterContext);

  test('collision pass draws only the background hit area', () => {
    const layer = {props: {collisionShowBackground: false}};
    expect(filter.call(layer, ctx('label-types-background', 'collision'))).toBe(true);
    expect(filter.call(layer, ctx('label-types-characters', 'collision'))).toBe(false);
  });

  test('color pass hides the forced collision background', () => {
    const layer = {props: {collisionShowBackground: false}};
    expect(filter.call(layer, ctx('label-types-background', 'screen'))).toBe(false);
    expect(filter.call(layer, ctx('label-types-characters', 'screen'))).toBe(true);
  });

  test('color pass keeps a user-configured background', () => {
    const layer = {props: {collisionShowBackground: true}};
    expect(filter.call(layer, ctx('label-types-background', 'screen'))).toBe(true);
    expect(filter.call(layer, ctx('label-types-characters', 'screen'))).toBe(true);
  });

  test('does not treat a label field named background as the hit-area sublayer', () => {
    const layer = {props: {collisionShowBackground: false}};
    expect(filter.call(layer, ctx('point-label-background-characters', 'screen'))).toBe(true);
    expect(filter.call(layer, ctx('point-label-background-characters', 'collision'))).toBe(false);
  });
});
