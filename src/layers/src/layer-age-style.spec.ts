// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ageStyleColorAccessor, isLayerAgeStyle, LayerAgeStyle} from './layer-age-style';

const day = 86400000;
const style: LayerAgeStyle = {
  timeField: 'observed',
  stops: [
    {ageMs: 0, opacity: 1, color: [255, 0, 0]},
    {ageMs: 14 * day, opacity: 0.5},
    {ageMs: 35 * day, color: [0, 0, 255], opacity: 0.2}
  ]
};
const base = [10, 20, 30, 200];
const field = (time: unknown) => () => time;

test.each([0, Date.UTC(2026, 10, 1)])(
  'age bands use exact boundaries and seek backward from %s',
  timestamp => {
    const samples: [number, number[]][] = [
      [0, [255, 0, 0, 200]],
      [14 * day - 1, [255, 0, 0, 200]],
      [14 * day, [10, 20, 30, 100]],
      [35 * day - 1, [10, 20, 30, 100]],
      [35 * day, [0, 0, 255, 40]],
      [100 * day, [0, 0, 255, 40]],
      [14 * day, [10, 20, 30, 100]],
      [0, [255, 0, 0, 200]]
    ];
    for (const [age, expected] of samples) {
      expect(
        ageStyleColorAccessor(base, style, field(timestamp), timestamp + age)({index: 0})
      ).toEqual(expected);
    }
    expect(base).toEqual([10, 20, 30, 200]);
  }
);

test('combines RGB, alpha and hover color without depending on previous frames', () => {
  const valueAccessor = jest.fn(({index}) => index * day);
  const getColor = jest.fn(() => [5, 10, 15]);
  const getStyled = ageStyleColorAccessor(getColor, style, valueAccessor, 36 * day);
  expect(getStyled({index: 2})).toEqual([5, 10, 15, 127.5]);
  expect(valueAccessor).toHaveBeenCalledWith({index: 2});
  expect(getColor).toHaveBeenCalledWith({index: 2});
  expect(ageStyleColorAccessor(base, style, field(0), 35 * day, true)({index: 0})).toEqual([
    10, 20, 30, 40
  ]);
  expect(
    ageStyleColorAccessor(
      base,
      {timeField: 'observed', stops: [{ageMs: 0, color: [1, 2, 3]}]},
      field(0),
      0
    )({index: 0})
  ).toEqual([1, 2, 3, 200]);
});

test.each([null, undefined, NaN, Infinity, -Infinity, '0', 1])(
  'missing, invalid and future timestamps are transparent: %s',
  timestamp => {
    expect(ageStyleColorAccessor(base, style, field(timestamp), 0)({index: 0})).toEqual([
      10, 20, 30, 0
    ]);
  }
);

test('invalid saved styles are ignored rather than crashing rendering', () => {
  for (const candidate of [
    null,
    {},
    {timeField: 'observed'},
    {...style, stops: []},
    {...style, stops: [null]},
    {...style, stops: [{ageMs: 0}]},
    {...style, stops: [{ageMs: 0, opacity: -1}]},
    {...style, stops: [{ageMs: 0, color: [256, 0, 0]}]},
    {...style, stops: [...style.stops].reverse()}
  ]) {
    expect(isLayerAgeStyle(candidate as any)).toBe(false);
  }
  expect(isLayerAgeStyle(style)).toBe(true);
});
