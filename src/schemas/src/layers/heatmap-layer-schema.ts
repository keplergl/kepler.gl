// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';

import {
  BaseLayerSchema,
  LayerType,
  BaseLayerConfigSchema,
  OpacitySchema,
  VisualChannelFieldSchema
} from './common';
import {ColorRangeSchema} from '../color';

export const HeatmapLayerSchema = BaseLayerSchema.extend({
  type: z.literal(LayerType.enum.heatmap),
  config: BaseLayerConfigSchema.extend({
    columns: z.object({lat: z.string(), lng: z.string()}),
    visConfig: z
      .object({
        opacity: OpacitySchema,
        intensity: z
          .number()
          .gte(0.01)
          .lte(20)
          .default(1)
          .describe(
            'Value that is multiplied with the total weight at a pixel to obtain the final weight. A value larger than 1 biases the output color towards the higher end of the spectrum, and a value less than 1 biases the output color towards the lower end of the spectrum.'
          ),
        threshold: z
          .number()
          .gte(0.01)
          .lte(1)
          .default(0.18)
          .describe(
            'A larger threshold smoothens the boundaries of color blobs, while making pixels with low weight harder to spot.'
          ),
        colorRange: ColorRangeSchema.optional(),
        radius: z.number().gte(0).lte(100).default(20)
      })

      .optional()
  }),
  visualChannels: z.object({
    weightField: VisualChannelFieldSchema.nullable().optional(),
    weightScale: z
      .enum(['point', 'linear', 'sqrt', 'log'])
      .describe('Calculate weight based on the selected field.')
      .optional()
  })
});

export type HeatmapLayerSchema = z.infer<typeof HeatmapLayerSchema>;
