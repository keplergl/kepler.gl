// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';

import {
  BaseLayerSchema,
  LayerType,
  BaseLayerConfigSchema,
  OpacitySchema,
  TextLabelSchema,
  VisualChannelFieldSchema,
  ColorScale
} from './common';
import {ColorRangeSchema, RGBColorSchema} from '../color';

export const HexagonIdLayerSchema = BaseLayerSchema.extend({
  type: z.literal(LayerType.enum.hexagonId),
  config: BaseLayerConfigSchema.extend({
    columns: z.object({['hex_id']: z.string()}),
    visConfig: z
      .object({
        colorRange: ColorRangeSchema.optional(),
        filled: z.boolean().default(true),
        opacity: OpacitySchema,
        outline: z.boolean().default(false),
        strokeColor: RGBColorSchema.optional().nullable().describe('Stroke color'),
        strokeColorRange: ColorRangeSchema.optional().nullable().describe('Stroke color range'),
        strokeOpacity: OpacitySchema,
        thickness: z.number().gte(0).lte(100).default(2),
        coverage: z.number().gte(0).lte(1).default(1),
        enable3d: z.boolean().default(false),
        sizeRange: z.array(z.number().gte(0).lte(1000)).default([0, 500]),
        coverageRange: z.array(z.coerce.number().gte(0).lte(1)).default([0, 1]),
        elevationScale: z.number().gte(0).lte(1000).default(5),
        enableElevationZoomFactor: z.boolean().default(true),
        fixedHeight: z.boolean().default(false)
      })
      .optional(),
    textLabel: z.array(TextLabelSchema).optional(),
    highlightColor: RGBColorSchema.optional().nullable().describe('Highlight color')
  }),
  visualChannels: z.object({
    colorField: VisualChannelFieldSchema.optional().nullable(),
    colorScale: ColorScale.optional().describe('Scale is based on colorField type.'),
    strokeColorField: VisualChannelFieldSchema.optional().nullable(),
    strokeColorScale: ColorScale.optional().describe('Scale is based on colorField type.'),
    sizeField: VisualChannelFieldSchema.optional().nullable(),
    sizeScale: z
      .enum(['point', 'linear', 'sqrt', 'log'])
      .describe('Scale is based on sizeField type.')
      .optional(),
    coverageField: VisualChannelFieldSchema.optional().nullable(),
    coverageScale: z
      .enum(['point', 'sqrt', 'linear'])
      .describe('Scale is based on coverageField type.')
      .optional()
  })
});
export type HexagonIdLayerSchema = z.infer<typeof HexagonIdLayerSchema>;
