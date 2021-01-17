// Copyright (c) 2021 Uber Technologies, Inc.
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

import colorbrewer from 'colorbrewer';
import {VizColorPalette} from './custom-color-ranges';

// Add colorbrewer color schemes (Data Science requirement)
// See http://colorbrewer2.org/

const colorBrewerMap = Object.entries(colorbrewer.schemeGroups).reduce(
  (accu, [type, palettes]) => ({
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

const colorRanges = [...VizColorPalette];

for (const [keyName, colorScheme] of Object.entries(colorbrewer)) {
  if (keyName !== 'schemeGroups') {
    for (const [lenKey, colors] of Object.entries(colorScheme)) {
      colorRanges.push({
        name: `ColorBrewer ${keyName}-${lenKey}`,
        type: colorBrewerMap[keyName],
        category: 'ColorBrewer',
        colors
      });
    }
  }
}

export const COLOR_RANGES = colorRanges;

export const DEFAULT_COLOR_RANGE = colorRanges.find(({name}) => name === 'Global Warming') || {
  name: 'Global Warming',
  type: 'SEQ',
  category: 'Uber',
  colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
};
