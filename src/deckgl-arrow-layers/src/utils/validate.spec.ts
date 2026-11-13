// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as arrow from 'apache-arrow';
import {validateAccessors, validateColorVector, validateVectorAccessors} from './validate';

const integers = (values: number[]) => arrow.vectorFromArray(values, new arrow.Int32());
const table = () => new arrow.Table({value: integers([10, 20]).concat(integers([30]))});
const colors = (size: number, type: arrow.DataType = new arrow.Uint8()) =>
  arrow.vectorFromArray(
    [Array.from({length: size}, (_, index) => index)],
    new arrow.FixedSizeList(size, new arrow.Field('channel', type))
  );

describe('GeoArrow vector accessor alignment', () => {
  test('accepts multiple accessors aligned with every record batch', () => {
    expect(() =>
      validateVectorAccessors(table(), [
        integers([1, 2]).concat(integers([3])),
        integers([4, 5]).concat(integers([6]))
      ])
    ).not.toThrow();
  });

  test('rejects a single chunk even when the total row count matches', () => {
    expect(() => validateVectorAccessors(table(), [integers([1, 2, 3])])).toThrow();
  });

  test('rejects different batch boundaries even when total rows and chunk count match', () => {
    expect(() =>
      validateVectorAccessors(table(), [integers([1]).concat(integers([2, 3]))])
    ).toThrow();
  });

  test('validates later accessors rather than only the first', () => {
    expect(() =>
      validateVectorAccessors(table(), [
        integers([1, 2]).concat(integers([3])),
        integers([4, 5]).concat(integers([6, 7]))
      ])
    ).toThrow();
  });
});

describe('GeoArrow color vector validation', () => {
  test.each([3, 4])('accepts %i-channel byte colors', size => {
    expect(() => validateColorVector(colors(size))).not.toThrow();
  });

  test.each([2, 5])('rejects %i-channel colors', size => {
    expect(() => validateColorVector(colors(size))).toThrow();
  });

  test('rejects variable-length lists and scalar vectors', () => {
    const list = arrow.vectorFromArray(
      [[1, 2, 3]],
      new arrow.List(new arrow.Field('channel', new arrow.Uint8()))
    );
    expect(() => validateColorVector(list)).toThrow();
    expect(() => validateColorVector(integers([1, 2, 3]))).toThrow();
  });

  test('rejects floating point and wider integer channels', () => {
    expect(() => validateColorVector(colors(3, new arrow.Float32()))).toThrow();
    expect(() => validateColorVector(colors(4, new arrow.Uint16()))).toThrow();
  });
});

describe('GeoArrow accessor property validation', () => {
  test('accepts scalar, array and function accessors without requiring Arrow chunks', () => {
    expect(() =>
      validateAccessors(
        {getRadius: 5, getColor: [255, 0, 0], getPosition: () => [0, 0], getElevation: null},
        table()
      )
    ).not.toThrow();
  });

  test('ignores non-accessor properties even when they contain unaligned vectors', () => {
    expect(() =>
      validateAccessors({data: integers([1]), highlightColor: integers([2])}, table())
    ).not.toThrow();
  });

  test('checks chunk alignment for ordinary vector accessors', () => {
    expect(() => validateAccessors({getRadius: integers([1, 2, 3])}, table())).toThrow();
  });

  test('checks color shape only for color accessors', () => {
    const singleBatch = new arrow.Table({value: integers([1])});
    expect(() => validateAccessors({getPosition: colors(2)}, singleBatch)).not.toThrow();
    expect(() => validateAccessors({getFillColor: colors(2)}, singleBatch)).toThrow();
    expect(() => validateAccessors({getFillColor: colors(3)}, singleBatch)).not.toThrow();
    expect(() => validateAccessors({getLineColor: colors(4)}, singleBatch)).not.toThrow();
  });
});
