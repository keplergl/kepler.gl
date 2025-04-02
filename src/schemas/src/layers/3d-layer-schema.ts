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
import {ColorRangeSchema} from '../color';

export const _3DLayerSchema = BaseLayerSchema.extend({
  type: z.literal(LayerType.enum['3D']),
  config: BaseLayerConfigSchema.extend({
    columns: z.object({
      lat: z.string(),
      lng: z.string(),
      altitude: z.string().nullable().optional()
    }),
    visConfig: z
      .object({
        opacity: OpacitySchema,
        colorRange: ColorRangeSchema.optional(),
        sizeScale: z.number().gte(0).lte(1000).default(10),
        angleX: z.number().gte(0).lte(360).default(0),
        angleY: z.number().gte(0).lte(360).default(0),
        angleZ: z.number().gte(0).lte(360).default(0),
        scenegraph: z.string().default('default-model'),
        scenegraphColorEnabled: z.boolean().default(false),
        scenegraphColor: z
          .array(z.union([z.number(), z.number(), z.number()]))
          .min(3)
          .max(3)
          .optional()
          .nullable(),
        scenegraphCustomModelUrl: z.string().default('')
      })

      .optional()
  }),
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
