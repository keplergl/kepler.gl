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

export const IconLayerSchema = BaseLayerSchema.extend({
  type: z.literal(LayerType.enum.icon),
  config: BaseLayerConfigSchema.extend({
    columns: z.object({
      lat: z.string(),
      lng: z.string(),
      icon: z.string(),
      altitude: z.string().nullable().optional()
    }),
    visConfig: z
      .object({
        radius: z.number().gte(0).lte(100).default(10),
        fixedRadius: z.boolean().default(false),
        opacity: OpacitySchema,
        colorRange: ColorRangeSchema.optional(),
        radiusRange: z.array(z.number().gte(0).lte(500)).default([0, 50]),
        billboard: z.boolean().default(false)
      })

      .optional(),
    highlightColor: RGBColorSchema.optional().nullable().describe('Highlight color')
  }),
  visualChannels: z.object({
    colorField: VisualChannelFieldSchema.optional().nullable(),
    colorScale: ColorScale.optional().describe('Scale is based on colorField type.').optional(),
    sizeField: VisualChannelFieldSchema.optional().nullable(),
    sizeScale: z
      .enum(['point', 'sqrt', 'linear'])
      .describe('Scale is based on sizeField type.')
      .optional()
  })
});

export type IconLayerSchema = z.infer<typeof IconLayerSchema>;
