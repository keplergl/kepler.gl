// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as d3ScaleChromatic from 'd3-scale-chromatic';
import {range} from 'd3-array';
import chroma from 'chroma-js';
import Console from 'global/console';
import {color as d3Color} from 'd3-color';
import {HexColor, MiniColorRange, ValueOf} from '@kepler.gl/types';

type GetColors = (steps: number) => HexColor[];
// linear interpolator
type GetLinear = () => (n: number) => string;

export type CategoricalPalette = {
  name: string;
  type: 'qualitative';
  category: ValueOf<typeof CATEGORIES>;
  colorBlindSafe: boolean;

  colors: GetColors;
  // categorical palette
  maxStep: number;
};

export type SequentialPalette = {
  name: string;
  type: 'sequential' | 'diverging' | 'cyclical';
  category: ValueOf<typeof CATEGORIES>;
  colorBlindSafe: boolean;
  colors: GetColors;
  // sequential palette
  linear: GetLinear;
};

export type ColorPalette = CategoricalPalette | SequentialPalette;

export const CATEGORIES = {
  COLORBREWER: 'ColorBrewer',
  D3: 'D3',
  UBER: 'Uber',
  COLORBLIND: 'ColorBlind'
};

export const PALETTE_TYPES: {
  SEQ: 'sequential';
  QUA: 'qualitative';
  DIV: 'diverging';
  CYC: 'cyclical';
} = {
  SEQ: 'sequential',
  QUA: 'qualitative',
  DIV: 'diverging',
  CYC: 'cyclical'
};

export const COLORBREWER_SCHEME = {
  [PALETTE_TYPES.SEQ]: [
    'BuGn',
    'BuPu',
    'GnBu',
    'OrRd',
    'PuBu',
    'PuBuGn',
    'PuRd',
    'RdPu',
    'YlGn',
    'YlGnBu',
    'YlOrBr',
    'YlOrRd',
    'Blues',
    'Greens',
    'Greys',
    'Oranges',
    'Purples',
    'Reds'
  ], // 18 + 9 + 8
  // singlehue: ['Blues', 'Greens', 'Greys', 'Oranges', 'Purples', 'Reds'],
  [PALETTE_TYPES.DIV]: [
    'BrBG',
    'PiYG',
    'PRGn',
    'PuOr',
    'RdBu',
    'RdGy',
    'RdYlBu',
    'RdYlGn',
    'Spectral'
  ],
  [PALETTE_TYPES.QUA]: ['Accent', 'Dark2', 'Paired', 'Pastel1', 'Pastel2', 'Set1', 'Set2', 'Set3']
};

// https://rdrr.io/cran/RColorBrewer/man/ColorBrewer.html
const COLOR_BLIND_SAFE_MAP = {
  // colorbrewer
  BrBG: true,
  PiYG: true,
  PRGn: true,
  PuOr: true,
  RdBu: true,
  RdGy: false,
  RdYlBu: true,
  RdYlGn: false,
  Spectral: false,
  Accent: false,
  Dark2: true,
  Paired: true,
  Pastel1: false,
  Pastel2: false,
  Set1: false,
  Set2: true,
  Set3: false,
  Blues: true,
  BuGn: true,
  BuPu: true,
  GnBu: true,
  Greens: true,
  Greys: true,
  Oranges: true,
  OrRd: true,
  PuBu: true,
  PuBuGn: true,
  PuRd: true,
  Purples: true,
  RdPu: true,
  Reds: true,
  YlGn: true,
  YlGnBu: true,
  YlOrBr: true,
  YlOrRd: true,

  // d3 scale chromatic
  Sinebow: true,
  Rainbow: false,
  Turbo: true,
  Viridis: true,
  Inferno: true,
  Magma: true,
  Plasma: true,
  Cividis: true,
  Warm: true,
  Cool: false,
  CubehelixDefault: true,
  Tableau10: false
};

export const D3_COLOR_CHROMATIC_SCHEME = {
  [PALETTE_TYPES.CYC]: ['Sinebow', 'Rainbow'],
  [PALETTE_TYPES.SEQ]: [
    'Turbo',
    'Viridis',
    'Inferno',
    'Magma',
    'Plasma',
    'Cividis',
    'Warm',
    'Cool',
    'CubehelixDefault'
  ],
  [PALETTE_TYPES.QUA]: ['Tableau10']
};

export const DataVizColors = {
  aqua: '#12939A',
  tumbleweed: '#DDB27C',
  mule_fawn: '#88572C',
  tree_poppy: '#FF991F',
  flame: '#F15C17',
  sapphire: '#223F9A',
  orchid: '#DA70BF',
  chathams_blue: '#125C77',
  med_aquamarine: '#4DC19C',
  crocodile: '#776E57',
  java: '#17B8BE',
  chalky: '#F6D18A',
  light_taupe: '#B7885E',
  peach_orange: '#FFCB99',
  apricot: '#F89570',
  portage: '#829AE3',
  light_orchid: '#E79FD5',
  blue_green: '#1E96BE',
  bermuda: '#89DAC1',
  cloudy: '#B3AD9E'
};

const UberVizDiverging = {
  name: 'Uber Viz Diverging',
  category: CATEGORIES.UBER,
  type: PALETTE_TYPES.DIV,
  colors: ['#00939C', '#E6FAFA'],
  colors2: ['#FEEEE8', '#C22E00'],
  diverging: true,
  correctLightness: false,
  colorBlindSafe: true
};

const UberVizSequential = {
  name: 'Uber Viz Sequential',
  category: CATEGORIES.UBER,
  type: PALETTE_TYPES.SEQ,
  colors: ['#00939C', '#E6FAFA'],
  colorBlindSafe: true
};

const UberPool = {
  name: 'UberPool',
  type: PALETTE_TYPES.DIV,
  category: CATEGORIES.UBER,
  colors: ['#223F9A', '#CF1750', '#FAE300'],
  correctLightness: false,
  colorBlindSafe: true
};

const IceAndFire = {
  name: 'Ice And Fire',
  type: PALETTE_TYPES.DIV,
  category: CATEGORIES.UBER,
  colors: ['#0198BD', '#FAFEB3'],
  colors2: ['#FEEDB1', '#D50255'],
  diverging: true,
  colorBlindSafe: true
};

const GlobalWarming = {
  name: 'Global Warming',
  type: PALETTE_TYPES.SEQ,
  category: CATEGORIES.UBER,
  colors: ['#4C0035', '#AC1C17', '#FFC300'],
  colorBlindSafe: true
};

const Sunrise = {
  name: 'Sunrise',
  type: PALETTE_TYPES.SEQ,
  category: CATEGORIES.UBER,
  colors: ['#355C7D', '#C06C84', '#F8B195'],
  colorBlindSafe: true
};

const OceanGreen = {
  name: 'Ocean Green',
  type: PALETTE_TYPES.SEQ,
  category: CATEGORIES.UBER,
  colors: ['#37535E', '#3EACA8', '#E5EEC1'],
  colorBlindSafe: true
};

const PinkWine = {
  name: 'Pink Wine',
  type: PALETTE_TYPES.SEQ,
  category: CATEGORIES.UBER,
  colors: ['#2C1E3D', '#956485', '#EDD1CA'],
  colorBlindSafe: true
};

const PurpleBlueYellow = {
  name: 'Purple Blue Yellow',
  type: PALETTE_TYPES.SEQ,
  category: CATEGORIES.UBER,
  colors: ['#383C65', '#49838A', '#D6DEBF'],
  mode: 'hsl',
  colorBlindSafe: true
};

const ViovetOcean = {
  name: 'ViovetOcean',
  type: PALETTE_TYPES.SEQ,
  category: CATEGORIES.UBER,
  colors: ['#7400B8', '#5E60CE', '#4EA8DE', '#56CFE1', '#72EFDD'],
  colorBlindSafe: false
};

const SummerSky = {
  name: 'SummerSky',
  type: PALETTE_TYPES.SEQ,
  category: CATEGORIES.UBER,
  colors: ['#184E77', '#168AAD', '#76C893', '#D9ED92'],
  colorBlindSafe: false
};

const UberVizQualitative = {
  name: 'Uber Viz Qualitative',
  type: PALETTE_TYPES.QUA,
  category: CATEGORIES.UBER,
  colors: Object.values(DataVizColors),
  colorBlindSafe: false
};

// https://personal.sron.nl/~pault/#sec:qualitative
// A set of Qualitative Colors designed by Paul Tol that are color blind friendly
const TolBright = {
  name: 'Tol Bright',
  type: PALETTE_TYPES.QUA,
  category: CATEGORIES.COLORBLIND,
  colors: ['#4477AA', '#EE6677', '#228833', '#CCBB44', '#66CCEE', '#AA3377', '#BBBBBB'],
  colorBlindSafe: true
};
// Bad Data: #BBBBBB

const TolVibrant = {
  name: 'Tol Vibrant',
  type: PALETTE_TYPES.QUA,
  category: CATEGORIES.COLORBLIND,
  colors: ['#EE7733', '#0077BB', '#33BBEE', '#EE3377', '#CC3311', '#009988', '#BBBBBB'],
  colorBlindSafe: true
};
// Bad Data: #BBBBBB

const TolMuted = {
  name: 'Tol Muted',
  type: PALETTE_TYPES.QUA,
  category: CATEGORIES.COLORBLIND,
  colors: [
    '#CC6677',
    '#332288',
    '#DDCC77',
    '#117733',
    '#88CCEE',
    '#882255',
    '#44AA99',
    '#999933',
    '#AA4499'
  ],
  colorBlindSafe: true
};
// Bad Data: #DDDDDD

const TolMediumContrast = {
  name: 'Tol Medium Contrast',
  type: PALETTE_TYPES.QUA,
  category: CATEGORIES.COLORBLIND,
  colors: ['#6699CC', '#004488', '#EECC66', '#994455', '#997700', '#EE99AA'],
  colorBlindSafe: true
};

const TolLight = {
  name: 'Tol Light',
  type: PALETTE_TYPES.QUA,
  category: CATEGORIES.COLORBLIND,
  colors: ['#77AADD', '#EE8866', '#EEDD88', '#FFAABB', '#99DDFF', '#44BB99', '#BBCC33', '#AAAA00'],
  colorBlindSafe: true
};

// https://jfly.uni-koeln.de/color/
const OkabeIto = {
  name: 'Okabe Ito',
  type: PALETTE_TYPES.QUA,
  category: CATEGORIES.COLORBLIND,
  colors: ['#E69F00', '#56B4E9', '#009E73', '#F0E442', '#0072B2', '#D55E00', '#CC79A7', '#000000'],
  colorBlindSafe: true
};
// Bad Data: #DDDDDD

const FSQBrand = {
  name: 'FSQ Brand',
  type: PALETTE_TYPES.QUA,
  category: CATEGORIES.COLORBLIND,
  colors: ['#3333FF', '#6166EB', '#2ED9C3', '#82E8DB', '#FCCC0A', '#FFDAAF', '#30A5D9', '#97DAF8'],
  colorBlindSafe: true
};

const FSQWarmTone = {
  name: 'FSQ Warm Tone',
  type: PALETTE_TYPES.QUA,
  category: CATEGORIES.COLORBLIND,
  colors: ['#C00B05', '#D150A5', '#E98ECA', '#FECE5A', '#FFDDBF', '#FFB4D3', '#EE5D86', '#D8D2D2'],
  colorBlindSafe: true
};

const FSQCoolTone = {
  name: 'FSQ Cool Tone',
  type: PALETTE_TYPES.QUA,
  category: CATEGORIES.COLORBLIND,
  colors: ['#11439F', '#297EE8', '#95C6C9', '#FECE5A', '#FFDDBF', '#9FB1B7', '#5281B5', '#B9D0FB'],
  colorBlindSafe: true
};

/**
 * Build Categorical color palette
 */
export function buildCategoricalPalette({
  name,
  category,
  colors,
  colorBlindSafe
}: {
  name: string;
  category: ValueOf<typeof CATEGORIES>;
  colors?: HexColor[];
  colorBlindSafe?: boolean;
}): CategoricalPalette {
  let allColors;
  // find d3 color scheme
  const scheme = d3ScaleChromatic[`scheme${name}`];

  if (!scheme && !colors) {
    Console.warn(`scheme${name} cant not be found in d3 scale chromatic, needs to provide colors`);
    allColors = ['#DDDDDD'];
  } else if (!scheme) {
    // build from colors
    allColors = colors;
  } else {
    allColors = scheme;
  }

  if (!allColors.length) {
    Console.warn('Needs to provide valid d3 color scheme name or an array of colors');
  }

  return {
    name,
    category,
    type: PALETTE_TYPES.QUA,
    colorBlindSafe: colorBlindSafe ?? COLOR_BLIND_SAFE_MAP[name],
    maxStep: allColors.length,
    colors: numColors => {
      // if numColors > maxSteps,  will return allColors
      return allColors.slice(0, numColors).map(_colorToUppercase);
    }
  };
}

function _colorToUppercase(c) {
  return d3Color(c).formatHex().toUpperCase();
}
/**
 * All sequantial palette is based on palette in d3-scale-chromatic
 * https://github.com/d3/d3-scale-chromatic/blob/main/src/index.js
 */
function buildSequentialPalette({name, type, category}) {
  if (!Object.prototype.hasOwnProperty.call(COLOR_BLIND_SAFE_MAP, name)) {
    Console.warn(`${name} does not exists in COLOR_BLIND_SAFE_MAP`);
  }
  const interpolator = d3ScaleChromatic[`interpolate${name}`];

  return {
    name,
    type,
    category,
    colorBlindSafe: COLOR_BLIND_SAFE_MAP[name],
    colors: numColors => {
      return range(0, numColors, 1)
        .map(d => interpolator(d / (numColors - 1)))
        .map(_colorToUppercase);
    },
    linear: () => {
      return interpolator;
    }
  };
}

function buildCustomPalette({
  colors,
  colors2 = [],
  correctLightness = true,
  bezier = false,
  diverging = false,
  mode = 'lch',
  name,
  type,
  category,
  colorBlindSafe
}: {
  colors: HexColor[];
  colors2?: HexColor[];
  correctLightness?: boolean;
  bezier?: boolean;
  diverging?: boolean;
  mode?: string;
  name: string;
  type: SequentialPalette['type'];
  category: ValueOf<typeof CATEGORIES>;
  colorBlindSafe: boolean;
}): SequentialPalette | undefined {
  const palette: SequentialPalette = {
    name,
    type,
    category,
    colorBlindSafe,
    colors: () => [],
    linear: () => () => ''
  };

  if (!colors.length) {
    Console.error('colors has to be an array of colors');
    return;
  }

  const scaleLeft = chroma
    .scale(bezier && colors.length > 1 ? chroma.bezier(colors) : colors)
    .mode(mode)
    .correctLightness(correctLightness);
  let scaleRight;
  let scaleFull;
  if (diverging) {
    if (!colors.length) {
      Console.error('colors2 has to be an array of colors when diverging = true');
      return;
    }
    scaleRight = chroma
      .scale(bezier && colors2.length > 1 ? chroma.bezier(colors2) : colors2)
      .mode(mode)
      .correctLightness(correctLightness);

    scaleFull = chroma
      .scale(bezier ? chroma.bezier(colors.concat(colors2)) : colors.concat(colors2))
      .mode(mode)
      .correctLightness(correctLightness);
  }

  // return numColors => (scaleLeft ? stepsLeft.colors(numColors) : []);

  // given number of colors return color steps
  palette.colors = numColors => {
    if (diverging) {
      const even = numColors % 2 === 0;

      const numColorsLeft = Math.ceil(numColors / 2) + (even ? 1 : 0);
      const numColorsRight = Math.ceil(numColors / 2) + (even ? 1 : 0);

      const colorsLeft = scaleLeft ? scaleLeft.colors(numColorsLeft) : [];
      const colorsRight = scaleRight ? scaleRight.colors(numColorsRight) : [];
      const steps = (even ? colorsLeft.slice(0, colorsLeft.length - 1) : colorsLeft)
        .concat(colorsRight.slice(1))
        .map(_colorToUppercase);

      return steps;
    }

    return scaleLeft ? scaleLeft.colors(numColors).map(_colorToUppercase) : [];
  };

  palette.linear = () => {
    return diverging ? scaleFull : scaleLeft;
  };

  return palette;
}

function buildPaletteBySchemeGroups(
  schemeGroups: typeof COLORBREWER_SCHEME | typeof D3_COLOR_CHROMATIC_SCHEME,
  category: ValueOf<typeof CATEGORIES>
): ColorPalette[] {
  return Object.entries(schemeGroups).reduce((accu, [type, palettes]) => {
    return [
      ...accu,
      ...palettes.reduce((group, name) => {
        const colorPalette =
          type === PALETTE_TYPES.QUA
            ? buildCategoricalPalette({name, category})
            : // @ts-ignore jsdoc cant figure out type of 'type'
              buildSequentialPalette({name, type, category});
        // @ts-ignore type is not assignable to never[]
        group.push(colorPalette);
        return group;
      }, [])
    ];
  }, []);
}

const COLORBREWER_PALETTES = buildPaletteBySchemeGroups(COLORBREWER_SCHEME, CATEGORIES.COLORBREWER);
const D3_COLOR_PALETTES = buildPaletteBySchemeGroups(D3_COLOR_CHROMATIC_SCHEME, CATEGORIES.D3);
const BRANDED_PALETTES: ColorPalette[] = [
  UberVizDiverging,
  UberVizSequential,
  UberPool,
  IceAndFire,
  GlobalWarming,
  Sunrise,
  OceanGreen,
  PinkWine,
  PurpleBlueYellow,
  ViovetOcean,
  SummerSky,
  UberVizQualitative,
  TolBright,
  TolVibrant,
  TolMuted,
  TolMediumContrast,
  TolLight,
  OkabeIto,
  FSQBrand,
  FSQWarmTone,
  FSQCoolTone
]
  .map(recipe =>
    recipe.type === PALETTE_TYPES.QUA ? buildCategoricalPalette(recipe) : buildCustomPalette(recipe)
  )
  .filter(Boolean) as ColorPalette[];

export const KEPLER_COLOR_PALETTES: ColorPalette[] = [
  ...BRANDED_PALETTES,
  ...COLORBREWER_PALETTES,
  ...D3_COLOR_PALETTES
];

/**
 * create color range from palette, with steps and reversed as config
 */
export function colorPaletteToColorRange(
  colorPalette: ColorPalette,
  colorConfig: {
    reversed: boolean;
    steps: number;
  }
): MiniColorRange {
  const {steps, reversed} = colorConfig;
  const colors = colorPalette.colors(steps).slice();
  if (reversed) {
    colors.reverse();
  }

  return {
    name: colorPalette.name,
    type: colorPalette.type,
    category: colorPalette.category,
    colors,
    ...(reversed ? {reversed} : {})
  };
}
