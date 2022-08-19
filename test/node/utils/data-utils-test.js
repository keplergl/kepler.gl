// Copyright (c) 2022 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import test from 'tape';

import {
  clamp,
  getRoundingDecimalFromStep,
  preciseRound,
  normalizeSliderValue,
  roundValToStep,
  snapToMarks,
  arrayMove,
  getFormatter,
  defaultFormatter
} from '../utils';
import {ALL_FIELD_TYPES} from 'constants';

test('dataUtils -> clamp', t => {
  t.equal(clamp([0, 1], 2), 1, 'should clamp 2 to 1 for [0,1]');
  t.equal(clamp([0, 1], 0.5), 0.5, 'should not clamp 0.5 for [0,1]');
  t.equal(clamp([-1, 1], -2), -1, 'should clamp -2 to -1 for [-1,1]');
  t.equal(clamp([0, 10], 11), 10, 'should clamp 11 to 10 for [0,10]');
  t.equal(clamp([0, 0], 1), 0, 'should clamp 1 to 0 for [0,0]');
  t.end();
});

test('dataUtils -> preciseRound', t => {
  t.equal(preciseRound(1.234, 2), '1.23', 'should round 1.234 correctly');
  t.equal(preciseRound(13.234, 0), '13', 'should round 13.234 correctly');
  t.equal(preciseRound(13, 2), '13.00', 'should round 13 correctly');
  t.equal(preciseRound(1.437, 2), '1.44', 'should round 1.437 correctly');
  t.equal(preciseRound(0.09999999999999987, 8), '0.10000000', 'should round 0.10000000 correctly');
  t.end();
});

test('dataUtils -> getRoundingDecimalFromStep', t => {
  t.equal(getRoundingDecimalFromStep(1), 0, 'decimal of step=int should be 0');
  t.equal(getRoundingDecimalFromStep(0.1), 1, 'decimal of step=0.1 should be 1');
  t.equal(getRoundingDecimalFromStep(0.01), 2, 'decimal of step=0.01 should be 2');
  t.equal(getRoundingDecimalFromStep(0.2), 1, 'decimal of step=0.2 should be 1');
  t.equal(getRoundingDecimalFromStep(0.001), 3, 'decimal of step=0.001 should be 3');
  t.equal(getRoundingDecimalFromStep(10), 0, 'decimal of step=10 should be 0');
  t.equal(getRoundingDecimalFromStep(0.5), 1, 'decimal of step=0.5 should be 0');
  t.equal(getRoundingDecimalFromStep(1.5), 1, 'decimal of step=1.5 should be 1');
  t.end();
});

test('dataUtils -> getRoundingDecimalFromStep', t => {
  t.equal(roundValToStep(0, 0.1, 0.11), 0.1, 'should round 0.11 to 0.1');
  t.equal(roundValToStep(0, 0.1, 0.1), 0.1, 'should round 0.1 to 0.1');
  t.equal(roundValToStep(1, 0.1, 1.16), 1.2, 'should round 1.16 to 1.2');
  t.equal(roundValToStep(1, 1, 1.6), 2, 'should round 1.6 to 2');
  t.equal(roundValToStep(1, 1, 1.32), 1, 'should round 1.32 to 1');
  t.equal(roundValToStep(1, 0.01, 1.435), 1.44, 'should round 1.435 to 1.44');
  t.equal(roundValToStep(1, 0.001, 1.4357), 1.436, 'should round 1.4357 to 1.436');
  t.equal(roundValToStep(0, 0.2, 1.5), 1.6, 'should round 1.5 to 1.6');
  t.equal(roundValToStep(0, 0.5, 20.25), 20.5, 'should round 20.25 to 20.5');
  t.equal(roundValToStep(0.3, 0.3, 12.77), 12.9, 'should round 12.77 to 12.9');
  t.equal(roundValToStep(-13, 0.1, -10.77), -10.8, 'should round -10.77 to -10.8');
  t.equal(roundValToStep(-30, 1, -14.5), -14, 'should round -14.5 to -14');
  t.end();
});

test('dataUtils -> snapToMarks', t => {
  const marks = [0, 1, 3, 4.7, 5, 6.4, 10];
  t.equal(snapToMarks(0, marks), 0, 'should snap to nearest mark');
  t.equal(snapToMarks(-1, marks), 0, 'should snap to nearest mark');
  t.equal(snapToMarks(2.2, marks), 3, 'should snap to nearest mark');
  t.equal(snapToMarks(10, marks), 10, 'should snap to nearest mark');
  t.equal(snapToMarks(11, marks), 10, 'should snap to nearest mark');
  t.equal(snapToMarks(5, marks), 5, 'should snap to nearest mark');
  t.equal(snapToMarks(2, marks), 1, 'should snap to nearest mark');

  t.end();
});

test('dataUtils -> normalizeSliderValue', t => {
  t.equal(normalizeSliderValue(-1.1, 0, 1), -1, 'should normalize slider value based on step');
  t.equal(normalizeSliderValue(4.4, 0, 1), 4, 'should round Val To Step');
  t.equal(normalizeSliderValue(4.4, 0, 1, [1, 2, 3, 4.1, 5]), 4.1, 'should snap To Marks');
  t.equal(normalizeSliderValue(4.4, 0, undefined), 4.4, 'is step is not defined return value');
  t.equal(normalizeSliderValue(4.4, undefined, 1), 4.4, 'is minValue is not defined return value');

  t.end();
});

test('dataUtils -> arrayMove', t => {
  const arr = [4, 1, 9, 3, 11];
  t.deepEqual(arrayMove(arr, 2, 1), [4, 9, 1, 3, 11], 'should move array');
  t.deepEqual(arrayMove(arr, 2, 5), [4, 1, 3, 11, 9], 'should move array');
  t.deepEqual(arrayMove(arr, 2, -1), [4, 1, 3, 11, 9], 'should move array');
  t.end();
});

test('dataUtils -> defaultFormatter', t => {
  t.equal(defaultFormatter(1), '1', 'defaultFormatter should be correct');
  t.equal(defaultFormatter('a'), 'a', 'defaultFormatter should be correct');
  t.equal(defaultFormatter(undefined), '', 'defaultFormatter should be correct');
  t.equal(defaultFormatter(NaN), 'NaN', 'defaultFormatter should be correct');
  t.equal(defaultFormatter(null), '', 'defaultFormatter should be correct');

  t.end();
});

test('dataUtils -> getFormatter', t => {
  const TEST_CASES = [
    {
      input: [undefined],
      assert: formatter => {
        t.equal(formatter, defaultFormatter, 'should return defaultformatter');
      }
    },
    {
      input: ['.1s'],
      assert: [134, '100']
    },
    {
      input: ['~%'],
      assert: ['12.345', '12.35%']
    },
    {
      input: ['none exist'],
      assert: formatter => {
        t.equal(formatter, defaultFormatter, 'should return defaultformatter');
      }
    },
    {
      // custom format
      input: [
        'YYYY-MM-DD',
        {
          type: ALL_FIELD_TYPES.timestamp
        }
      ],
      assert: [1593724860289, '2020-07-02']
    },
    {
      // custom format
      input: [
        ',.2r',
        {
          type: ALL_FIELD_TYPES.integer
        }
      ],
      assert: [4223, '4,200']
    },
    {
      input: ['01'],
      assert: [true, '1']
    },
    {
      input: ['01'],
      assert: [false, '0']
    },
    {
      input: ['yn'],
      assert: [false, 'no']
    },
    {
      input: ['yn'],
      assert: [true, 'yes']
    }
  ];

  TEST_CASES.forEach(tc => {
    const formatter = getFormatter(...tc.input);
    if (typeof tc.assert === 'function') {
      tc.assert(formatter);
    } else {
      t.equal(formatter(tc.assert[0]), tc.assert[1], 'should return correct formatter');
    }
  });
  t.end();
});
