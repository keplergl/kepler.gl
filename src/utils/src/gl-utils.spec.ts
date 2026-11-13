// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {getLayerBlendingParameters} from './gl-utils';

describe('getLayerBlendingParameters', () => {
  test('normal blending preserves separate color and alpha source factors', () => {
    expect(getLayerBlendingParameters('normal')).toEqual({
      blend: true,
      blendColorSrcFactor: 'src-alpha',
      blendColorDstFactor: 'one-minus-src-alpha',
      blendAlphaSrcFactor: 'one',
      blendAlphaDstFactor: 'one-minus-src-alpha',
      blendColorOperation: 'add',
      blendAlphaOperation: 'add'
    });
  });

  test('additive blending applies the two factors and shared equation to both channels', () => {
    expect(getLayerBlendingParameters('additive')).toEqual({
      blend: true,
      blendColorSrcFactor: 'src-alpha',
      blendColorDstFactor: 'dst-alpha',
      blendAlphaSrcFactor: 'src-alpha',
      blendAlphaDstFactor: 'dst-alpha',
      blendColorOperation: 'add',
      blendAlphaOperation: 'add'
    });
  });

  test('subtractive blending subtracts color while continuing to add alpha', () => {
    expect(getLayerBlendingParameters('subtractive')).toEqual({
      blend: true,
      blendColorSrcFactor: 'one',
      blendColorDstFactor: 'one-minus-dst',
      blendAlphaSrcFactor: 'src-alpha',
      blendAlphaDstFactor: 'dst-alpha',
      blendColorOperation: 'subtract',
      blendAlphaOperation: 'add'
    });
  });

  test.each(['', 'unsupported-blending'])('does not override deck parameters for %p', mode => {
    expect(getLayerBlendingParameters(mode)).toEqual({});
  });

  test('returns independent parameter objects for per-layer overrides', () => {
    const firstLayer = getLayerBlendingParameters('normal');
    const secondLayer = getLayerBlendingParameters('normal');

    firstLayer.blend = false;
    firstLayer.blendAlphaOperation = 'subtract';

    expect(secondLayer.blend).toBe(true);
    expect(secondLayer.blendAlphaOperation).toBe('add');
    expect(getLayerBlendingParameters('normal')).toEqual(secondLayer);
  });
});
