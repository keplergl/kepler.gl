// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';

import {
  AggregationModeSchema,
  BaseLayerSchema,
  LayerType,
  BaseLayerConfigSchema,
  OpacitySchema,
  PercentileSchema,
  ElevationPercentileSchema,
  VisualChannelFieldSchema,
  ColorScale
} from './common';
import {ColorRangeSchema} from '../color';

export const GridLayerSchema = BaseLayerSchema.extend({
  type: z.literal(LayerType.enum.grid),
  config: BaseLayerConfigSchema.extend({
    columns: z.object({lat: z.string(), lng: z.string()}),
    visConfig: z
      .object({
        opacity: OpacitySchema,
        worldUnitSize: z.number().gte(0).lte(500).default(1),
        colorRange: ColorRangeSchema.optional(),
        coverage: z.number().gte(0).lte(1).default(1),
        sizeRange: z.array(z.number().gte(0).lte(1000)).default([0, 500]),
        percentile: PercentileSchema,
        elevationPercentile: ElevationPercentileSchema,
        elevationScale: z.number().gte(0).lte(1000).default(5),
        enableElevationZoomFactor: z.boolean().default(true),
        fixedHeight: z.boolean().default(false),
        colorAggregation: AggregationModeSchema.optional(),
        sizeAggregation: AggregationModeSchema.optional(),
        enable3d: z.boolean().default(false)
      })

      .optional()
  }),
  visualChannels: z.object({
    colorField: VisualChannelFieldSchema.optional().nullable(),
    colorScale: ColorScale.optional().describe('Scale is based on colorField type.').optional(),
    sizeField: VisualChannelFieldSchema.optional().nullable(),
    sizeScale: z
      .enum(['linear', 'sqrt', 'log'])
      .describe('Scale is based on sizeField type and undefined type.')
      .optional()
  })
});

export type GridLayerSchema = z.infer<typeof GridLayerSchema>;
