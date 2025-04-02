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
import {ColorRangeSchema} from '../color';

const BaseLineLayerConfigSchema = BaseLayerConfigSchema.extend({
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
        .optional(),
      elevationScale: z.number().gte(0).lte(1000).default(1)
    })
    .optional()
});

export const LineLayerSchema = BaseLayerSchema.extend({
  type: z.literal(LayerType.enum.line),
  config: z.union([
    BaseLineLayerConfigSchema.extend({
      columnMode: z.literal('points').default('points').describe('Column mode'),
      columns: z.object({
        lat0: z.string(),
        lng0: z.string(),
        lat1: z.string(),
        lng1: z.string(),
        alt0: z.string().optional().nullable(),
        alt1: z.string().optional().nullable()
      })
    }),
    BaseLineLayerConfigSchema.extend({
      columnMode: z.literal('neighbors').describe('Column mode'),
      columns: z.object({
        neighbors: z.string(),
        lat: z.string(),
        lng: z.string(),
        alt: z.string().optional()
      })
    })
  ]),
  visualChannels: z
    .object({
      colorField: VisualChannelFieldSchema.optional().nullable(),
      colorScale: ColorScale.optional().describe('Scale is based on colorField type.').optional(),
      sizeField: VisualChannelFieldSchema.nullable().optional().optional(),
      sizeScale: z
        .enum(['point', 'linear', 'sqrt', 'log'])
        .describe('Scale is based on sizeField type.')
        .optional()
    })
    .optional()
});

export type LineLayerSchema = z.infer<typeof LineLayerSchema>;
