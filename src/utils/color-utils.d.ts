import {ColorRange} from '../layers/layer-factory';

export const hexToRgb: (hex: string) => [number, number, number];
export const createLinearGradient: (string: direction, colors: number[]) => string;
export const reverseColorRange: (reversed: boolean, colorRange: ColorRange) => object;
export const rgbToHex: (colors: [number, number, number]) => string;


export const getColorGroupByName: (ColorRange) => ColorRange;
