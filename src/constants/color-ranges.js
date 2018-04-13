// Copyright (c) 2018 Uber Technologies, Inc.
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
import {SEQ, QUA, DIV, VizColorPalette} from './custom-color-ranges';

const colorBrewerMap = {
  YlGn: SEQ,
  YlGnBu: SEQ,
  GnBu: SEQ,
  BuGn: SEQ,
  PuBuGn: SEQ,
  PuBu: SEQ,
  BuPu: SEQ,
  RdPu: SEQ,
  PuRd: SEQ,
  OrRd: SEQ,
  YlOrRd: SEQ,
  YlOrBr: SEQ,
  Purples: SEQ,
  Blues: SEQ,
  Greens: SEQ,
  Oranges: SEQ,
  Reds: SEQ,
  Greys: SEQ,
  PuOr: DIV,
  BrBG: DIV,
  PRGn: DIV,
  PiYG: DIV,
  RdBu: DIV,
  RdGy: DIV,
  RdYlBu: DIV,
  Spectral: DIV,
  RdYlGn: DIV,
  Accent: QUA,
  Dark2: QUA,
  Paired: QUA,
  Pastel1: QUA,
  Pastel2: QUA,
  Set1: QUA,
  Set2: QUA,
  Set3: QUA
};

const colorRanges = [...VizColorPalette];

// Add colorbrewer color schemes (Data Science requirement)
// See http://colorbrewer2.org/
function entries(obj) {
  return Object.keys(obj).map(k => [k, obj[k]]);
}

for (const [keyName, colorScheme] of entries(colorbrewer)) {
  for (const [lenKey, colors] of entries(colorScheme)) {
    colorRanges.push({
      name: `ColorBrewer ${keyName}-${lenKey}`,
      type: colorBrewerMap[keyName],
      category: 'ColorBrewer',
      colors
    });
  }
}

export const COLOR_RANGES = colorRanges;

export const DefaultColorRange = colorRanges.find(
  ({name}) => name === 'Global Warming'
);
