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
