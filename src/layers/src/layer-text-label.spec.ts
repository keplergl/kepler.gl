// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {textLabelDeckLayerId} from './layer-text-label';

describe('textLabelDeckLayerId', () => {
  const pointCount = {field: {name: 'pointCount'}};

  test('keeps the single-label id used by collision sublayers', () => {
    expect(textLabelDeckLayerId('jaca149', [pointCount], 0, true)).toBe(
      'jaca149-label-pointCount-collision'
    );
    expect(textLabelDeckLayerId('jaca149', [pointCount], 0, false)).toBe(
      'jaca149-label-pointCount'
    );
  });

  test('suffixes the index when the same field is labeled twice', () => {
    const labels = [pointCount, pointCount];
    expect(textLabelDeckLayerId('jaca149', labels, 0, true)).toBe(
      'jaca149-label-pointCount-0-collision'
    );
    expect(textLabelDeckLayerId('jaca149', labels, 1, true)).toBe(
      'jaca149-label-pointCount-1-collision'
    );
  });
});
