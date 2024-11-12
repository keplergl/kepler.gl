// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {HexColor} from '@kepler.gl/types';
import colorbrewer from 'colorbrewer';
import {VizColorPalette} from './custom-color-ranges';

export type ColorMap = [string[] | string | number | null, HexColor][];
// Key is HexColor but as key we can use only string
export type ColorLegends = {[key: HexColor]: string};

export type ColorRange = {
  name?: string;
  type?: string;
  category?: string;
  colors: HexColor[];
  reversed?: boolean;
  colorMap?: ColorMap;
  colorLegends?: ColorLegends;
};

// Add colorbrewer color schemes (Data Science requirement)
// See http://colorbrewer2.org/

const colorBrewerMap = Object.entries(colorbrewer.schemeGroups).reduce(
  (accu, [type, palettes]: [string, any]) => ({
    ...accu,
    ...palettes.reduce(
      (group, name) => ({
        ...group,
        [name]: type
      }),
      {}
    )
  }),
  {}
);

const colorRanges: ColorRange[] = [...VizColorPalette];

for (const [keyName, colorScheme] of Object.entries(colorbrewer)) {
  if (keyName !== 'schemeGroups') {
    for (const [lenKey, colors] of Object.entries(colorScheme as any)) {
      colorRanges.push({
        name: `ColorBrewer ${keyName}-${lenKey}`,
        type: colorBrewerMap[keyName],
        category: 'ColorBrewer',
        colors: colors as HexColor[]
      });
    }
  }
}

export const COLOR_RANGES: ColorRange[] = colorRanges;

export const DEFAULT_COLOR_RANGE: ColorRange = colorRanges.find(
  ({name}) => name === 'Global Warming'
) || {
  name: 'Global Warming',
  type: 'SEQ',
  category: 'Uber',
  colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
};
