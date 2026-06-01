// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';

import {valueToPosition, positionToValue, createSliderScale} from '@kepler.gl/utils';

const HEATMAP_CONFIG = {focusRange: [0.001, 1], focusWeight: 0.6};

test('sliderScaleUtils -> createSliderScale', t => {
  t.equal(createSliderScale(), null, 'returns null when no args');
  t.equal(createSliderScale(undefined, 0.5), null, 'returns null when no focusRange');
  t.equal(createSliderScale([0, 1], undefined), null, 'returns null when no focusWeight');
  t.equal(createSliderScale([0, 1], 0), null, 'returns null when focusWeight is 0');
  t.equal(createSliderScale([0, 1], 1), null, 'returns null when focusWeight is 1');
  t.deepEqual(
    createSliderScale([0, 1], 0.6),
    {focusRange: [0, 1], focusWeight: 0.6},
    'returns config when valid'
  );
  t.end();
});

test('sliderScaleUtils -> valueToPosition boundary values (focus at start)', t => {
  const config = HEATMAP_CONFIG;

  // min value => position 0
  const posAtMin = valueToPosition(0.001, 0.001, 20, config);
  t.equal(posAtMin, 0, 'min value maps to position 0');

  // max value => position 1
  const posAtMax = valueToPosition(20, 0.001, 20, config);
  t.equal(posAtMax, 1, 'max value maps to position 1');

  // focus boundary value => position equals focusWeight
  // Since focusRange starts at min (0.001), beforeWeight = 0, so focusEnd = 0.6
  const posAtFocusBound = valueToPosition(1, 0.001, 20, config);
  t.ok(
    Math.abs(posAtFocusBound - 0.6) < 1e-10,
    'focus boundary maps to focusWeight position'
  );

  t.end();
});

test('sliderScaleUtils -> valueToPosition distributes space correctly (focus at start)', t => {
  const config = HEATMAP_CONFIG;

  // A value halfway through focus range should be at ~0.3 (half of 0.6)
  const midFocus = (0.001 + 1) / 2; // ~0.5005
  const posAtMidFocus = valueToPosition(midFocus, 0.001, 20, config);
  t.ok(
    Math.abs(posAtMidFocus - 0.3) < 0.01,
    'midpoint of focus range maps to ~half of focusWeight'
  );

  // A value halfway through rest range should be at ~0.8 (0.6 + half of 0.4)
  const midRest = (1 + 20) / 2; // 10.5
  const posAtMidRest = valueToPosition(midRest, 0.001, 20, config);
  t.ok(
    Math.abs(posAtMidRest - 0.8) < 0.01,
    'midpoint of rest range maps to ~0.8'
  );

  t.end();
});

test('sliderScaleUtils -> positionToValue boundary values (focus at start)', t => {
  const config = HEATMAP_CONFIG;

  // position 0 => min value
  const valAt0 = positionToValue(0, 0.001, 20, config);
  t.equal(valAt0, 0.001, 'position 0 maps to min value');

  // position 1 => max value
  const valAt1 = positionToValue(1, 0.001, 20, config);
  t.equal(valAt1, 20, 'position 1 maps to max value');

  // position at focusWeight => focus boundary
  const valAtWeight = positionToValue(0.6, 0.001, 20, config);
  t.ok(
    Math.abs(valAtWeight - 1) < 1e-10,
    'position at focusWeight maps to focus boundary'
  );

  t.end();
});

test('sliderScaleUtils -> roundtrip: valueToPosition and positionToValue are inverses', t => {
  const config = HEATMAP_CONFIG;
  const testValues = [0.001, 0.1, 0.5, 1, 2, 5, 10, 15, 20];

  testValues.forEach(val => {
    const pos = valueToPosition(val, 0.001, 20, config);
    const recovered = positionToValue(pos, 0.001, 20, config);
    t.ok(
      Math.abs(recovered - val) < 1e-10,
      `roundtrip for value ${val}: got ${recovered}`
    );
  });

  const testPositions = [0, 0.1, 0.3, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
  testPositions.forEach(pos => {
    const val = positionToValue(pos, 0.001, 20, config);
    const recoveredPos = valueToPosition(val, 0.001, 20, config);
    t.ok(
      Math.abs(recoveredPos - pos) < 1e-10,
      `roundtrip for position ${pos}: got ${recoveredPos}`
    );
  });

  t.end();
});

test('sliderScaleUtils -> mid-range focus: focusRange in the middle of the range', t => {
  // range [0, 100], focus on [30, 50] with 60% weight
  const config = {focusRange: [30, 50], focusWeight: 0.6};

  // Boundaries:
  //   beforeSpan = 30, afterSpan = 50, nonFocusSpan = 80
  //   beforeWeight = (30/80) * 0.4 = 0.15
  //   focusEnd = 0.15 + 0.6 = 0.75

  const posAtMin = valueToPosition(0, 0, 100, config);
  t.equal(posAtMin, 0, 'min value maps to 0');

  const posAtMax = valueToPosition(100, 0, 100, config);
  t.equal(posAtMax, 1, 'max value maps to 1');

  const posAtFocusMin = valueToPosition(30, 0, 100, config);
  t.ok(Math.abs(posAtFocusMin - 0.15) < 1e-10, 'focusMin (30) maps to beforeEnd (0.15)');

  const posAtFocusMax = valueToPosition(50, 0, 100, config);
  t.ok(Math.abs(posAtFocusMax - 0.75) < 1e-10, 'focusMax (50) maps to focusEnd (0.75)');

  // Mid of focus range (40) should map to middle of focus zone: (0.15+0.75)/2 = 0.45
  const posAtMidFocus = valueToPosition(40, 0, 100, config);
  t.ok(Math.abs(posAtMidFocus - 0.45) < 1e-10, 'mid focus (40) maps to 0.45');

  // Mid of before zone (15) maps to 0.075
  const posAtMidBefore = valueToPosition(15, 0, 100, config);
  t.ok(Math.abs(posAtMidBefore - 0.075) < 1e-10, 'mid before (15) maps to 0.075');

  // Mid of after zone (75) maps to (0.75 + 1)/2 = 0.875
  const posAtMidAfter = valueToPosition(75, 0, 100, config);
  t.ok(Math.abs(posAtMidAfter - 0.875) < 1e-10, 'mid after (75) maps to 0.875');

  t.end();
});

test('sliderScaleUtils -> mid-range focus: positionToValue inverse', t => {
  const config = {focusRange: [30, 50], focusWeight: 0.6};
  const testValues = [0, 10, 15, 30, 35, 40, 50, 60, 75, 100];

  testValues.forEach(val => {
    const pos = valueToPosition(val, 0, 100, config);
    const recovered = positionToValue(pos, 0, 100, config);
    t.ok(
      Math.abs(recovered - val) < 1e-10,
      `mid-range roundtrip for value ${val}: got ${recovered}`
    );
  });

  t.end();
});

test('sliderScaleUtils -> focus range at the end of the range', t => {
  // range [0, 100], focus on [80, 100] with 0.5 weight
  const config = {focusRange: [80, 100], focusWeight: 0.5};

  // beforeSpan = 80, afterSpan = 0, nonFocusSpan = 80
  // beforeWeight = (80/80) * 0.5 = 0.5
  // focusEnd = 0.5 + 0.5 = 1.0

  const posAt0 = valueToPosition(0, 0, 100, config);
  t.equal(posAt0, 0, 'min maps to 0');

  const posAt80 = valueToPosition(80, 0, 100, config);
  t.ok(Math.abs(posAt80 - 0.5) < 1e-10, 'focusMin (80) maps to 0.5');

  const posAt100 = valueToPosition(100, 0, 100, config);
  t.ok(Math.abs(posAt100 - 1) < 1e-10, 'max (100) maps to 1');

  const posAt90 = valueToPosition(90, 0, 100, config);
  t.ok(Math.abs(posAt90 - 0.75) < 1e-10, 'mid focus (90) maps to 0.75');

  // Roundtrip
  const testValues = [0, 20, 40, 60, 80, 85, 90, 95, 100];
  testValues.forEach(val => {
    const pos = valueToPosition(val, 0, 100, config);
    const recovered = positionToValue(pos, 0, 100, config);
    t.ok(
      Math.abs(recovered - val) < 1e-10,
      `end-focus roundtrip for value ${val}: got ${recovered}`
    );
  });

  t.end();
});

test('sliderScaleUtils -> handles edge cases', t => {
  const config = {focusRange: [0, 5], focusWeight: 0.5};

  // equal min and max
  t.equal(valueToPosition(5, 5, 5, config), 0, 'returns 0 when min equals max');
  t.equal(positionToValue(0.5, 5, 5, config), 5, 'returns min when min equals max');

  // values clamped to range
  t.equal(valueToPosition(-1, 0, 10, config), 0, 'clamps below-min values to 0');
  t.equal(valueToPosition(15, 0, 10, config), 1, 'clamps above-max values to 1');

  // positions clamped to [0,1]
  t.equal(positionToValue(-0.5, 0, 10, config), 0, 'clamps negative positions');
  t.equal(positionToValue(1.5, 0, 10, config), 10, 'clamps positions above 1');

  t.end();
});

test('sliderScaleUtils -> focusRange covers entire slider span (degenerates to linear)', t => {
  // When focusRange === [min, max], there's no before/after zone
  const config = {focusRange: [0, 100], focusWeight: 0.6};

  // Should behave linearly: position = (value - min) / (max - min)
  t.equal(valueToPosition(0, 0, 100, config), 0, 'min maps to 0');
  t.equal(valueToPosition(100, 0, 100, config), 1, 'max maps to 1');
  t.equal(valueToPosition(50, 0, 100, config), 0.5, 'midpoint maps to 0.5');
  t.equal(valueToPosition(25, 0, 100, config), 0.25, '25 maps to 0.25');

  t.equal(positionToValue(0, 0, 100, config), 0, 'position 0 maps to min');
  t.equal(positionToValue(1, 0, 100, config), 100, 'position 1 maps to max');
  t.equal(positionToValue(0.5, 0, 100, config), 50, 'position 0.5 maps to midpoint');

  t.end();
});

test('sliderScaleUtils -> createSliderScale rejects non-finite inputs', t => {
  t.equal(createSliderScale([NaN, 1], 0.5), null, 'rejects NaN in focusRange[0]');
  t.equal(createSliderScale([0, NaN], 0.5), null, 'rejects NaN in focusRange[1]');
  t.equal(createSliderScale([0, 1], NaN), null, 'rejects NaN focusWeight');
  t.equal(createSliderScale([0, Infinity], 0.5), null, 'rejects Infinity in focusRange');
  t.equal(createSliderScale([0, 1], Infinity), null, 'rejects Infinity focusWeight');
  t.deepEqual(
    createSliderScale([0, 1], 0.5),
    {focusRange: [0, 1], focusWeight: 0.5},
    'accepts valid finite inputs'
  );
  t.end();
});
