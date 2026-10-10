// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {applyZarrColormap, estimateZarrDataRange} from './zarr-colormap';

const BLACK_TO_WHITE = ['#000000', '#ffffff'];

function pixelAt(data: Uint8ClampedArray, index: number): number[] {
  const offset = index * 4;
  return [data[offset], data[offset + 1], data[offset + 2], data[offset + 3]];
}

describe('applyZarrColormap', () => {
  it('maps the rescale range onto the full ramp', () => {
    const {data, width, height} = applyZarrColormap([0, 0.5, 1], 3, 1, {
      rescale: [0, 1],
      colors: BLACK_TO_WHITE
    });

    expect(width).toBe(3);
    expect(height).toBe(1);
    expect(pixelAt(data, 0)).toEqual([0, 0, 0, 255]);
    expect(pixelAt(data, 1)).toEqual([128, 128, 128, 255]);
    expect(pixelAt(data, 2)).toEqual([255, 255, 255, 255]);
  });

  it('clamps values outside the rescale range', () => {
    const {data} = applyZarrColormap([-10, 10], 2, 1, {
      rescale: [0, 1],
      colors: BLACK_TO_WHITE
    });

    expect(pixelAt(data, 0)).toEqual([0, 0, 0, 255]);
    expect(pixelAt(data, 1)).toEqual([255, 255, 255, 255]);
  });

  it('renders NaN and the nodata value transparent', () => {
    const {data} = applyZarrColormap([Number.NaN, -9999, 1], 3, 1, {
      rescale: [0, 1],
      colors: BLACK_TO_WHITE,
      nodataValue: -9999
    });

    expect(pixelAt(data, 0)).toEqual([0, 0, 0, 0]);
    expect(pixelAt(data, 1)).toEqual([0, 0, 0, 0]);
    expect(pixelAt(data, 2)).toEqual([255, 255, 255, 255]);
  });

  it('puts every value at the bottom of the ramp for a degenerate range', () => {
    const {data} = applyZarrColormap([3, 3, 3], 3, 1, {
      rescale: [3, 3],
      colors: BLACK_TO_WHITE
    });

    expect(pixelAt(data, 0)).toEqual([0, 0, 0, 255]);
    expect(pixelAt(data, 2)).toEqual([0, 0, 0, 255]);
  });

  it('snaps to the containing band when interpolate is off', () => {
    const {data} = applyZarrColormap([0, 0.9], 2, 1, {
      rescale: [0, 1],
      colors: BLACK_TO_WHITE,
      interpolate: false
    });

    expect(pixelAt(data, 0)).toEqual([0, 0, 0, 255]);
    expect(pixelAt(data, 1)).toEqual([255, 255, 255, 255]);
  });

  it('leaves pixels transparent when the ramp is empty', () => {
    const {data} = applyZarrColormap([0.5], 1, 1, {rescale: [0, 1], colors: []});

    expect(pixelAt(data, 0)).toEqual([0, 0, 0, 0]);
  });

  it('leaves trailing pixels transparent when the chunk is short', () => {
    const {data} = applyZarrColormap([1], 2, 1, {rescale: [0, 1], colors: BLACK_TO_WHITE});

    expect(pixelAt(data, 0)).toEqual([255, 255, 255, 255]);
    expect(pixelAt(data, 1)).toEqual([0, 0, 0, 0]);
  });

  it('reads BigInt chunks', () => {
    const {data} = applyZarrColormap(new BigInt64Array([0n, 10n]), 2, 1, {
      rescale: [0, 10],
      colors: BLACK_TO_WHITE
    });

    expect(pixelAt(data, 0)).toEqual([0, 0, 0, 255]);
    expect(pixelAt(data, 1)).toEqual([255, 255, 255, 255]);
  });
});

describe('estimateZarrDataRange', () => {
  it('returns the min and max of the finite values', () => {
    expect(estimateZarrDataRange([3, -1, 7, 2])).toEqual([-1, 7]);
  });

  it('ignores NaN and nodata', () => {
    expect(estimateZarrDataRange([Number.NaN, -9999, 4, 8], -9999)).toEqual([4, 8]);
  });

  it('returns null when nothing usable is left', () => {
    expect(estimateZarrDataRange([])).toBeNull();
    expect(estimateZarrDataRange([Number.NaN, Number.NaN])).toBeNull();
    expect(estimateZarrDataRange([-9999, -9999], -9999)).toBeNull();
  });

  it('returns null for a constant chunk so the caller can keep its own range', () => {
    expect(estimateZarrDataRange([5, 5, 5])).toBeNull();
  });
});
