// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';

import {
  BaseLayerSchema,
  LayerType,
  BaseLayerConfigSchema,
  OpacitySchema,
  AggregationModeSchema,
  VisualChannelFieldSchema,
  ColorScale
} from './common';
import {ColorRangeSchema} from '../color';

export const ClusterLayerSchema = BaseLayerSchema.extend({
  type: z.literal(LayerType.enum.cluster),
  config: BaseLayerConfigSchema.extend({
    columns: z.object({lat: z.string(), lng: z.string()}),
    visConfig: z
      .object({
        opacity: OpacitySchema,
        clusterRadius: z.number().gte(1).lte(500).default(40),
        colorRange: ColorRangeSchema.optional(),
        radiusRange: z.array(z.number().gte(0).lte(150)).default([1, 40]),
        colorAggregation: AggregationModeSchema.optional()
      })

      .optional()
  }),
  visualChannels: z.object({
    colorField: VisualChannelFieldSchema.optional().nullable(),
    colorScale: ColorScale.optional().describe('Scale is based on colorField type.').optional()
  })
});

export type ClusterLayerSchema = z.infer<typeof ClusterLayerSchema>;
