// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';

const RGBColorComponent = z.number().min(0).max(255);

export const RGBColorSchema = z.union([
  z.tuple([RGBColorComponent, RGBColorComponent, RGBColorComponent]),
  z.tuple([RGBColorComponent, RGBColorComponent, RGBColorComponent, RGBColorComponent])
]);
export type RGBColorSchema = z.infer<typeof RGBColorSchema>;

export const HexColorSchema = z.coerce.string();
export type HexColorSchema = z.infer<typeof HexColorSchema>;

export const ColorMapSchema = z.array(
  z.tuple([z.union([z.string(), z.number(), z.null(), z.array(z.coerce.string())]), HexColorSchema])
);
export type ColorMapSchema = z.infer<typeof ColorMapSchema>;

export const ColorLegendsSchema = z.record(z.string(), z.string());
export type ColorLegendsSchema = z.infer<typeof ColorLegendsSchema>;

export enum ColorRangeType {
  sequential = 'sequential',
  qualitative = 'qualitative',
  diverging = 'diverging',
  cyclical = 'cyclical',
  custom = 'custom',
  ordinal = 'ordinal',
  customOrdinal = 'customOrdinal'
}

export const ColorRangeTypeZod = z.preprocess((type: any) => {
  if (type === 'singlehue') {
    type = ColorRangeType.sequential;
  }
  return type;
}, z.nativeEnum(ColorRangeType).default(ColorRangeType.sequential));
export type ColorRangeTypeZod = z.infer<typeof ColorRangeTypeZod>;

const COLOR_RANGE_TYPES = Object.values(ColorRangeType).join(', ');
const COLOR_RANGE_TYPE_DESC = `The type of the color range. Must be one of: ${COLOR_RANGE_TYPES}`;

export const ColorRangeSchema = z.preprocess(
  (colorRange: any) => {
    let next = colorRange;
    if (colorRange.colorMap === null) {
      next = {...next};
      delete next.colorMap;
    }
    return next;
  },
  z.object({
    name: z.string().describe('The name of the color range.').default('Unnamed'),
    type: ColorRangeTypeZod.describe(COLOR_RANGE_TYPE_DESC),
    category: z.string().default('Unnamed'),
    colors: z.array(HexColorSchema),
    reversed: z.boolean().optional(),
    colorMap: ColorMapSchema.optional(),
    colorLegends: ColorLegendsSchema.optional()
  })
);
export type ColorRangeSchema = z.infer<typeof ColorRangeSchema>;

export const DEFAULT_COLOR_RANGE: ColorRangeSchema = {
  name: 'Uber Viz Qualitative',
  type: ColorRangeType.qualitative,
  category: 'Uber',
  colors: [
    '#12939A',
    '#DDB27C',
    '#88572C',
    '#FF991F',
    '#F15C17',
    '#223F9A',
    '#DA70BF',
    '#125C77',
    '#4DC19C',
    '#776E57'
  ]
};
