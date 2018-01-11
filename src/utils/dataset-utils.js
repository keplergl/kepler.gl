import {hexToRgb} from './color-utils';

// apply a color for each dataset
// to use as label colors
const datasetColors = [
  '#355C7D',
  '#6C5B7B',
  '#C06C84',
  '#F8B195',
  '#547A82',
  '#3EACA8',
  '#A2D4AB'
];

/**
 * Random color generator
 */
function* generateColor() {
  let index = 0;
  while (index < datasetColors.length + 1) {
    if (index === datasetColors.length) {
      index = 0;
    }
    yield hexToRgb(datasetColors[index++]);
  }
}

export const datasetColorMaker = generateColor();
