// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';

import {
  BaseLayerSchema,
  LayerType,
  BaseLayerConfigSchema,
  OpacitySchema,
  VisualChannelFieldSchema,
  ColorScale
} from './common';
import {ColorRangeSchema, RGBColorSchema} from '../color';

export const S2LayerSchema = BaseLayerSchema.extend({
  type: z.literal(LayerType.enum.s2),
  config: BaseLayerConfigSchema.extend({
    columns: z.object({token: z.string()}),
    visConfig: z
      .object({
        opacity: OpacitySchema,
        colorRange: ColorRangeSchema.optional(),
        filled: z.boolean().default(true),
        thickness: z.number().gte(0).lte(100).default(0.5),
        strokeColor: RGBColorSchema.optional().nullable().describe('Stroke color'),
        strokeColorRange: ColorRangeSchema.optional().nullable().describe('Stroke color range'),
        sizeRange: z.array(z.number().gte(0).lte(200)).default([0, 10]),
        stroked: z.boolean().default(true),
        enable3d: z.boolean().default(false),
        elevationScale: z.number().gte(0).lte(1000).default(5),
        enableElevationZoomFactor: z.boolean().default(true),
        fixedHeight: z.boolean().default(false),
        heightRange: z.array(z.number().gte(0).lte(1000)).default([0, 500]),
        wireframe: z.boolean().default(false)
      })

      .optional()
  }),
  visualChannels: z.object({
    colorField: VisualChannelFieldSchema.optional().nullable(),
    colorScale: ColorScale.describe('Scale is based on colorField type.').optional(),
    sizeField: VisualChannelFieldSchema.nullable().optional(),
    sizeScale: z
      .enum(['point', 'linear', 'sqrt', 'log'])
      .describe('Scale is based on sizeField type.')
      .optional(),
    strokeColorField: VisualChannelFieldSchema.nullable().optional(),
    strokeColorScale: ColorScale.optional()
      .nullable()
      .describe('Scale is based on strokeColorField type.'),
    heightField: VisualChannelFieldSchema.optional().nullable(),
    heightScale: z
      .enum(['point', 'linear', 'sqrt', 'log'])
      .describe('Scale is based on heightField type.')
      .optional()
  })
});

export type S2LayerSchema = z.infer<typeof S2LayerSchema>;
