// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';

import {
  BaseLayerConfigSchema,
  OpacitySchema,
  BaseLayerSchema,
  LayerType,
  VisualChannelFieldSchema,
  ColorScale
} from './common';
import {ColorRangeSchema, RGBColorSchema} from '../color';

const BaseArcLayerConfigSchema = BaseLayerConfigSchema.extend({
  visConfig: z
    .object({
      opacity: OpacitySchema,
      thickness: z.number().gte(0).lte(100).default(2),
      colorRange: ColorRangeSchema.optional(),
      sizeRange: z.array(z.number().gte(0).lte(200)).default([0, 10]),
      targetColor: z
        .array(z.union([z.number(), z.number(), z.number()]))
        .min(3)
        .max(3)
        .nullable()
        .optional()
    })
    .optional(),
  highlightColor: RGBColorSchema.optional().nullable().describe('Highlight color')
});

export const ArcLayerSchema = BaseLayerSchema.extend({
  type: z.literal(LayerType.enum.arc),
  config: z.union([
    BaseArcLayerConfigSchema.extend({
      columnMode: z.literal('points').default('points').describe('Column mode'),
      columns: z.object({
        lat0: z.string(),
        lng0: z.string(),
        lat1: z.string(),
        lng1: z.string()
      })
    }),
    BaseArcLayerConfigSchema.extend({
      columnMode: z.literal('neighbors').describe('Column mode'),
      columns: z.object({
        lat: z.string(),
        lng: z.string(),
        neighbors: z.string()
      })
    })
  ]),
  visualChannels: z.object({
    colorField: VisualChannelFieldSchema.optional().nullable(),
    colorScale: ColorScale.optional().describe('Scale is based on colorField type.').optional(),
    sizeField: VisualChannelFieldSchema.optional().nullable(),
    sizeScale: z
      .enum(['point', 'linear', 'sqrt', 'log'])
      .describe('Scale is based on sizeField type.')
      .optional()
  })
});
export type ArcLayerSchema = z.infer<typeof ArcLayerSchema>;
