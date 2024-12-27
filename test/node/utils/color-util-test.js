// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  addCustomPaletteColor,
  colorRangeBackwardCompatibility,
  createLinearGradient,
  removeCustomPaletteColor,
  sortCustomPaletteColor,
  updateCustomPaletteColor
} from '@kepler.gl/utils';
import test from 'tape';
import {KEPLER_COLOR_PALETTES, colorPaletteToColorRange} from '@kepler.gl/constants';

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
    },
    {
      input: [CUSTOM_PALETTE, 0],
      expected: {
        ...CUSTOM_PALETTE,
        colors: ['#030303', '#050505', '#070707'],
        colorMap: [
          [33, '#030303'],
          [41, '#050505'],
          [null, '#070707']
        ],
        colorLegends: {
          '#030303': 'B',
          '#050505': 'C',
          '#070707': 'D'
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

test('ColorUtil -> colorPaletteToColorRange', t => {
  const TEST_CASES = [
    {
      name: 'YlOrRd',
      steps: 8,
      colors: [
        '#FFFFCC',
        '#FFEA9A',
        '#FECD6A',
        '#FEA246',
        '#FC6932',
        '#E92A21',
        '#C00624',
        '#800026'
      ]
    },
    {name: 'Cividis', steps: 4, colors: ['#002051', '#575C6E', '#A49D78', '#FDEA45']},
    {name: 'Paired', steps: 4, colors: ['#A6CEE3', '#1F78B4', '#B2DF8A', '#33A02C']},
    {
      name: 'Accent',
      steps: 10,
      colors: [
        '#7FC97F',
        '#BEAED4',
        '#FDC086',
        '#FFFF99',
        '#386CB0',
        '#F0027F',
        '#BF5B17',
        '#666666'
      ]
    },
    {name: 'Uber Viz Sequential', steps: 4, colors: ['#00939C', '#6BB5B9', '#AAD7D9', '#E6FAFA']},
    {
      name: 'Uber Viz Diverging',
      steps: 8,
      colors: [
        '#00939C',
        '#5AACB2',
        '#8BC6C9',
        '#B9E0E1',
        '#F8C0AC',
        '#EB9373',
        '#D9653D',
        '#C22E00'
      ]
    },
    {
      name: 'Tol Vibrant',
      steps: 6,
      colors: ['#EE7733', '#0077BB', '#33BBEE', '#EE3377', '#CC3311', '#009988']
    }
  ];

  TEST_CASES.forEach(tc => {
    const colorRange = colorPaletteToColorRange(
      KEPLER_COLOR_PALETTES.find(p => p.name === tc.name),
      {steps: tc.steps}
    );

    t.deepEqual(colorRange.colors, tc.colors, `Should build correct palette: ${tc.name}`);
  });

  t.end();
});

test('ColorUtil -> colorRangeBackwardCompatibility', t => {
  const OLD_COLOR_RANGES_CUSTOM = [
    {
      savedColorRange: {
        name: 'Uber Viz Qualitative 0',
        type: 'qualitative',
        category: 'Uber',
        colors: ['#12939A', '#DDB27C']
      },
      loadedColorRange: {
        name: 'Uber Viz Qualitative',
        type: 'qualitative',
        category: 'Uber',
        colors: ['#12939A', '#DDB27C']
      }
    },
    {
      savedColorRange: {
        name: 'Uber Viz Diverging 0.5',
        type: 'sequential',
        category: 'Uber',
        colors: ['#000000', '#111111', '#222222']
      },
      loadedColorRange: {
        name: 'Uber Viz Diverging',
        type: 'diverging',
        category: 'Uber',
        colors: ['#000000', '#111111', '#222222']
      }
    },
    {
      savedColorRange: {
        name: 'Uber Viz Sequential 1',
        type: 'sequential',
        category: 'Uber',
        colors: ['#333333', '#444444', '#555555']
      },
      loadedColorRange: {
        name: 'Uber Viz Sequential',
        type: 'sequential',
        category: 'Uber',
        colors: ['#333333', '#444444', '#555555']
      }
    },
    {
      savedColorRange: {
        name: 'UberPool',
        type: 'sequential',
        category: 'Uber',
        colors: ['#AAAAAA', '#BBBBBB', '#CCCCCC']
      },
      loadedColorRange: {
        name: 'UberPool',
        type: 'diverging',
        category: 'Uber',
        colors: ['#AAAAAA', '#BBBBBB', '#CCCCCC']
      }
    },
    {
      savedColorRange: {
        name: 'UberPool 9',
        type: 'sequential',
        category: 'Uber',
        colors: ['#DDDDDD', '#EEEEEE', '#FFFFFF']
      },
      loadedColorRange: {
        name: 'UberPool',
        type: 'diverging',
        category: 'Uber',
        colors: ['#DDDDDD', '#EEEEEE', '#FFFFFF']
      }
    }
  ];

  const OLD_COLOR_RANGES_COLORBREWER = [
    {
      savedColorRange: {
        name: 'ColorBrewer YlGn-3',
        category: 'ColorBrewer',
        colors: ['#000000', '#1111111'],
        type: 'sequential'
      },
      loadedColorRange: {
        name: 'YlGn',
        category: 'ColorBrewer',
        colors: ['#000000', '#1111111'],
        type: 'sequential'
      }
    },
    {
      savedColorRange: {
        name: 'ColorBrewer RdYlBu-11',
        category: 'ColorBrewer',
        colors: ['#222222', '#333333'],
        type: 'diverging'
      },
      loadedColorRange: {
        name: 'RdYlBu',
        category: 'ColorBrewer',
        colors: ['#222222', '#333333'],
        type: 'diverging'
      }
    },
    {
      savedColorRange: {
        name: 'ColorBrewer Accent-3',
        category: 'ColorBrewer',
        colors: ['#444444', '#555555'],
        type: 'sequantial'
      },
      loadedColorRange: {
        name: 'Accent',
        category: 'ColorBrewer',
        colors: ['#444444', '#555555'],
        type: 'qualitative'
      }
    },
    {
      savedColorRange: {
        name: 'ColorBrewer Set3-4',
        category: 'ColorBrewer',
        colors: ['#666666', '#777777'],
        type: 'sequantial'
      },
      loadedColorRange: {
        name: 'Set3',
        category: 'ColorBrewer',
        colors: ['#666666', '#777777'],
        type: 'qualitative'
      }
    }
  ];

  const CUSTOM_COLOR_BREAK = [
    {
      savedColorRange: {
        category: 'Uber',
        colors: ['#2FA7AE', '#C22E00'],
        name: 'Uber Viz Diverging 3.5',
        reversed: false,
        type: 'diverging',
        colorMap: [
          [200500, '#2FA7AE'],
          [null, '#C22E00']
        ]
      },
      loadedColorRange: {
        category: 'Uber',
        colors: ['#2FA7AE', '#C22E00'],
        name: 'Uber Viz Diverging 3.5',
        reversed: false,
        type: 'diverging',
        colorMap: [
          [200500, '#2FA7AE'],
          [null, '#C22E00']
        ]
      }
    },
    {
      savedColorRange: {
        name: 'color.customPalette',
        type: 'custom',
        category: 'Custom',
        colors: ['#631C80', '#E6FAFA'],
        colorLegends: {'#631C80': 'purple'}
      },
      loadedColorRange: {
        name: 'color.customPalette',
        type: 'custom',
        category: 'Custom',
        colors: ['#631C80', '#E6FAFA'],
        colorLegends: {'#631C80': 'purple'}
      }
    }
  ];

  const CUSTOM_COLOR_LEGENDS = [
    {
      savedColorRange: {
        name: 'Ice And Fire 3',
        type: 'diverging',
        category: 'Uber',
        colors: ['#0198BD', '#FAFEB3', '#D50255'],
        colorLegends: {'#0198BD': 'hwllo'}
      },
      loadedColorRange: {
        name: 'Ice And Fire',
        type: 'diverging',
        category: 'Uber',
        colors: ['#0198BD', '#FAFEB3', '#D50255'],
        colorLegends: {'#0198BD': 'hwllo'}
      }
    }
  ];

  const NEW_COLOR_RANGES = [
    {
      name: 'Uber Viz Diverging',
      type: 'diverging',
      category: 'Uber',
      colors: ['#00939C', '#8BC6C9', '#EB9373', '#C22E00']
    },
    {
      name: 'Okabe Ito',
      type: 'qualitative',
      category: 'ColorBlind',
      colors: ['#E69F00', '#56B4E9', '#009E73', '#F0E442', '#0072B2'],
      colorLegends: {}
    },
    {
      name: 'PuBu',
      type: 'sequential',
      category: 'ColorBrewer',
      colors: ['#FFF7FB', '#CED1E6', '#72A8CF', '#0D72AD', '#023858'],
      colorLegends: {}
    }
  ];

  // load old color range
  [
    ...OLD_COLOR_RANGES_CUSTOM,
    ...OLD_COLOR_RANGES_COLORBREWER,
    ...CUSTOM_COLOR_BREAK,
    ...CUSTOM_COLOR_LEGENDS
  ].forEach(tc => {
    t.deepEqual(
      colorRangeBackwardCompatibility(tc.savedColorRange),
      tc.loadedColorRange,
      `should rename and load ${tc.savedColorRange.name} type ${tc.savedColorRange.type} as ${tc.loadedColorRange.name}`
    );
  });

  // load new color palettes
  NEW_COLOR_RANGES.forEach(tc => {
    t.deepEqual(
      colorRangeBackwardCompatibility(tc),
      tc,
      `should keep load new color palette ${tc.name}`
    );
  });

  t.end();
});
