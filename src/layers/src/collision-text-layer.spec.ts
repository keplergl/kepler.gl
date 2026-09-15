// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import CollisionTextLayer from './collision-text-layer';

describe('CollisionTextLayer.filterSubLayer', () => {
  const filter = CollisionTextLayer.prototype.filterSubLayer;

  test('collision pass draws only the background hit area', () => {
    const layer = {props: {collisionShowBackground: false}};
    expect(
      filter.call(layer, {layer: {id: 'label-types-background'}, renderPass: 'collision'})
    ).toBe(true);
    expect(
      filter.call(layer, {layer: {id: 'label-types-characters'}, renderPass: 'collision'})
    ).toBe(false);
  });

  test('color pass hides the forced collision background', () => {
    const layer = {props: {collisionShowBackground: false}};
    expect(filter.call(layer, {layer: {id: 'label-types-background'}, renderPass: 'screen'})).toBe(
      false
    );
    expect(filter.call(layer, {layer: {id: 'label-types-characters'}, renderPass: 'screen'})).toBe(
      true
    );
  });

  test('color pass keeps a user-configured background', () => {
    const layer = {props: {collisionShowBackground: true}};
    expect(filter.call(layer, {layer: {id: 'label-types-background'}, renderPass: 'screen'})).toBe(
      true
    );
    expect(filter.call(layer, {layer: {id: 'label-types-characters'}, renderPass: 'screen'})).toBe(
      true
    );
  });

  test('does not treat a label field named background as the hit-area sublayer', () => {
    const layer = {props: {collisionShowBackground: false}};
    expect(
      filter.call(layer, {layer: {id: 'point-label-background-characters'}, renderPass: 'screen'})
    ).toBe(true);
    expect(
      filter.call(layer, {
        layer: {id: 'point-label-background-characters'},
        renderPass: 'collision'
      })
    ).toBe(false);
  });
});
