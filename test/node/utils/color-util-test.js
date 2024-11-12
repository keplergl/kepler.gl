// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  addCustomPaletteColor,
  createLinearGradient,
  removeCustomPaletteColor,
  sortCustomPaletteColor,
  updateCustomPaletteColor
} from '@kepler.gl/utils';
import test from 'tape';

test('createLinearGradient', t => {
  let colors = [[100, 100, 100]];

  t.deepEqual(
    createLinearGradient('bottom', colors),
    'linear-gradient(to bottom, rgba(100,100,100, 1) 0%, rgba(100,100,100, 1) 100%)',
    'Should create a solid gradient with 1 color'
  );

  colors = [
    [100, 100, 100],
    [200, 200, 200],
    [300, 300, 300]
  ];

  t.deepEqual(
    createLinearGradient('bottom', colors),
    'linear-gradient(to bottom, rgba(100,100,100, 1) 0%, rgba(100,100,100, 1) 33.33%,rgba(200,200,200, 1) 33.33%, rgba(200,200,200, 1) 66.66%,rgba(300,300,300, 1) 66.66%, rgba(300,300,300, 1) 99.99%)',
    'Should create a linear gradient'
  );

  colors = [
    [10, 10, 10],
    [20, 20, 20],
    [30, 30, 30],
    [40, 40, 40]
  ];

  t.deepEqual(
    createLinearGradient('bottom', colors),
    'linear-gradient(to bottom, rgba(10,10,10, 1) 0%, rgba(10,10,10, 1) 25%,rgba(20,20,20, 1) 25%, rgba(20,20,20, 1) 50%,rgba(30,30,30, 1) 50%, rgba(30,30,30, 1) 75%,rgba(40,40,40, 1) 75%, rgba(40,40,40, 1) 100%)',
    'Should create a linear gradient'
  );

  t.end();
});

const CUSTOM_PALETTE = {
  name: 'Custom Palette',
  type: 'custom',
  category: 'Custom',
  colors: ['#010101', '#030303', '#050505', '#070707'],
  colorMap: [
    [28, '#010101'],
    [33, '#030303'],
    [41, '#050505'],
    [null, '#070707']
  ],
  colorLegends: {
    '#010101': 'A',
    '#030303': 'B',
    '#050505': 'C',
    '#070707': 'D'
  }
};

const CUSTOM_PALETTE_1 = {
  name: 'Custom Palette',
  type: 'custom',
  category: 'Custom',
  colors: ['#010101', '#070707'],
  colorMap: [
    [28, '#010101'],
    [null, '#070707']
  ],
  colorLegends: {
    '#010101': 'A'
  }
};

test('ColorUtil -> addCustomPaletteColor', t => {
  const TEST_CASES = [
    {
      input: [CUSTOM_PALETTE, 0],
      expected: {
        ...CUSTOM_PALETTE,
        colors: ['#010101', '#020202', '#030303', '#050505', '#070707'],
        colorMap: [
          [28, '#010101'],
          [30.5, '#020202'],
          [33, '#030303'],
          [41, '#050505'],
          [null, '#070707']
        ]
      },
      msg: 'add 1 at index:0 should be correct'
    },
    {
      input: [CUSTOM_PALETTE, 3],
      expected: {
        ...CUSTOM_PALETTE,
        colors: ['#010101', '#030303', '#050505', '#070707', '#070707'],
        colorMap: [
          [28, '#010101'],
          [33, '#030303'],
          [41, '#050505'],
          [49, '#070707'],
          [null, '#070707']
        ]
      },
      msg: 'add 1 at end should be correct'
    },
    {
      input: [CUSTOM_PALETTE_1, 0],
      expected: {
        ...CUSTOM_PALETTE_1,
        colors: ['#010101', '#040404', '#070707'],
        colorMap: [
          [28, '#010101'],
          [28, '#040404'],
          [null, '#070707']
        ]
      },
      msg: 'add 1 at the beginning should be correct'
    },
    {
      input: [CUSTOM_PALETTE_1, 1],
      expected: {
        ...CUSTOM_PALETTE_1,
        colors: ['#010101', '#070707', '#070707'],
        colorMap: [
          [28, '#010101'],
          [28, '#070707'],
          [null, '#070707']
        ]
      },
      msg: 'add 1 at end should be correct'
    }
  ];

  TEST_CASES.forEach(tc => {
    t.deepEqual(addCustomPaletteColor(...tc.input), tc.expected, tc.msg);
  });

  t.end();
});

test('ColorUtil -> sortCustomPaletteColor', t => {
  const TEST_CASES = [
    {
      input: [CUSTOM_PALETTE, 0, 2],
      expected: {
        ...CUSTOM_PALETTE,
        colors: ['#030303', '#050505', '#010101', '#070707'],
        colorMap: [
          [28, '#030303'],
          [33, '#050505'],
          [41, '#010101'],
          [null, '#070707']
        ],
        colorLegends: {
          '#030303': 'A',
          '#050505': 'B',
          '#010101': 'C',
          '#070707': 'D'
        }
      },
      msg: 'should sort customPalette correctly'
    }
  ];

  TEST_CASES.forEach(tc => {
    t.deepEqual(sortCustomPaletteColor(...tc.input), tc.expected, tc.msg);
  });

  t.end();
});

test('ColorUtil -> removeCustomPaletteColor', t => {
  const TEST_CASES = [
    {
      input: [CUSTOM_PALETTE, 1],
      expected: {
        ...CUSTOM_PALETTE,
        colors: ['#010101', '#050505', '#070707'],
        colorMap: [
          [28, '#010101'],
          [41, '#050505'],
          [null, '#070707']
        ],
        colorLegends: {
          '#010101': 'A',
          '#050505': 'C',
          '#070707': 'D'
        }
      },
      msg: 'Should remove 1 color'
    },
    {
      input: [CUSTOM_PALETTE, 3],
      expected: {
        ...CUSTOM_PALETTE,
        colors: ['#010101', '#030303', '#050505'],
        colorMap: [
          [28, '#010101'],
          [33, '#030303'],
          [41, '#050505']
        ],
        colorLegends: {
          '#010101': 'A',
          '#030303': 'B',
          '#050505': 'C'
        }
      },
      msg: 'Should remove 1 color at the end'
    }
  ];

  TEST_CASES.forEach(tc => {
    t.deepEqual(removeCustomPaletteColor(...tc.input), tc.expected, tc.msg);
  });

  t.end();
});

test('ColorUtil -> updateCustomPaletteColor', t => {
  const TEST_CASES = [
    {
      input: [CUSTOM_PALETTE, 1, '#FFFFFF'],
      expected: {
        ...CUSTOM_PALETTE,
        colors: ['#010101', '#FFFFFF', '#050505', '#070707'],
        colorMap: [
          [28, '#010101'],
          [33, '#FFFFFF'],
          [41, '#050505'],
          [null, '#070707']
        ],
        colorLegends: {
          '#010101': 'A',
          '#FFFFFF': 'B',
          '#050505': 'C',
          '#070707': 'D'
        }
      },
      msg: 'Should update 1 color'
    },
    {
      input: [
        {
          name: 'Custom Palette',
          type: 'custom',
          category: 'Custom',
          colors: ['#010101', '#030303', '#050505', '#070707']
        },
        1,
        '#FFFFFF'
      ],
      expected: {
        name: 'Custom Palette',
        type: 'custom',
        category: 'Custom',
        colors: ['#010101', '#FFFFFF', '#050505', '#070707']
      },
      msg: 'Should update 1 color'
    }
  ];

  TEST_CASES.forEach(tc => {
    t.deepEqual(updateCustomPaletteColor(...tc.input), tc.expected, tc.msg);
  });

  t.end();
});
