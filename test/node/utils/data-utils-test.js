// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';

import {
  clamp,
  getRoundingDecimalFromStep,
  preciseRound,
  normalizeSliderValue,
  roundValToStep,
  snapToMarks,
  getFormatter,
  defaultFormatter,
  formatNumber,
  roundToFour
} from '@kepler.gl/utils';
import {processLayerBounds} from '@kepler.gl/reducers';
import {ALL_FIELD_TYPES} from '@kepler.gl/constants';

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

test('dataUtils -> roundToFour', t => {
  t.equal(roundToFour(1.2344), 1.2344, 'should round 1.2344 to 4 decimals correctly');
  t.equal(roundToFour(13.23445), 13.2345, 'should round 13.23445 to 4 decimals correctly');
  t.equal(roundToFour(13), 13, 'should round 13 to 4 decimals correctly');
  t.equal(roundToFour(1.437), 1.437, 'should round 1.437 to 4 decimals correctly');
  t.equal(
    roundToFour(0.09999999999999987),
    0.1,
    'should round 0.09999999999999987 to 4 decimals correctly'
  );
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
  t.equal(getRoundingDecimalFromStep(0.0000001), 7, 'decimal of step=1e-7 should be 7');
  t.equal(getRoundingDecimalFromStep(0.0000000000123), 13, 'decimal of step=1.23e-11 should be 13');
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
    },
    {
      input: ['L LT'],
      assert: ['2011-04-10 00:00', '04/10/2011 12:00 AM']
    },
    {
      input: ['L LT'],
      assert: [null, '']
    },
    {
      input: ['L LT'],
      assert: [undefined, '']
    },
    {
      input: ['L LT'],
      assert: ['', '']
    },
    {
      input: ['L'],
      assert: ['2011-04-10', '04/10/2011']
    },
    {
      input: ['L'],
      assert: [null, '']
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

test('dataUtils -> formatNumber', t => {
  const TEST_CASES = [
    {input: ['3.14'], output: '3.14', message: 'field type is not given'},
    {input: ['3.14123'], output: '3.141', message: 'field type is not given'},
    {input: ['3'], output: '3', message: 'field type is not given'},
    {input: ['331', 'integer'], output: '331', message: 'format integer'},
    {input: ['-33.1', 'integer'], output: '-33', message: 'format integer'},
    {input: ['1234', 'integer'], output: '1,234', message: 'format integer'},
    {input: ['123456', 'integer'], output: '123.5k', message: 'format integer'},
    {input: ['123456.2', 'real'], output: '123.5k', message: 'format real'},
    {input: ['123.23', 'real'], output: '123.2', message: 'format real'},
    {input: ['12.3', 'real'], output: '12.3', message: 'format real'},
    {input: ['12.345', 'real'], output: '12.35', message: 'format real'}
  ];

  TEST_CASES.forEach(tc => {
    const output = formatNumber(...tc.input);
    t.equal(output, tc.output, `formatNumber should be correct when ${tc.message}`);
  });

  t.end();
});

test('dataUtils -> validateBounds', t => {
  const TEST_CASES = [
    {
      input: [[10, -10, 20, -20]],
      output: [10, -10, 20, -20],
      message: 'should return the same bound for a single bound'
    },
    {
      input: [
        [10, -10, 20, -20],
        [15, -15, 25, -25]
      ],
      output: [10, -15, 25, -20],
      message: 'should return a combined bound for multiple bounds'
    },
    {
      input: [
        [10, -90, 20, -20],
        [10, -10, 90, -90]
      ],
      output: [10, -10, 90, -20],
      message: 'should handle latitude -90,90 correctly'
    },
    {
      input: [
        [-180, -90, 20, -20],
        [15, -190, 25, -25]
      ],
      output: [0, 0, 25, -20],
      message: 'should handle extreme longitude values'
    }
  ];

  TEST_CASES.forEach(tc => {
    const output = processLayerBounds(tc.input);
    t.deepEqual(output, tc.output, tc.message);
  });

  t.end();
});
