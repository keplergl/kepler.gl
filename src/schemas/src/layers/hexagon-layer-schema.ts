// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';

import {
  BaseLayerSchema,
  LayerType,
  BaseLayerConfigSchema,
  OpacitySchema,
  PercentileSchema,
  ElevationPercentileSchema,
  AggregationModeSchema,
  VisualChannelFieldSchema,
  ColorScale
} from './common';
import {ColorRangeSchema} from '../color';

export const HexagonLayerSchema = BaseLayerSchema.extend({
  type: z.literal(LayerType.enum.hexagon),
  config: BaseLayerConfigSchema.extend({
    columns: z.object({lat: z.string(), lng: z.string()}),
    visConfig: z
      .object({
        opacity: OpacitySchema,
        worldUnitSize: z.number().gte(0).lte(500).default(1),
        resolution: z.number().gte(0).lte(13).default(8),
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
    sizeField: z
      .object({
        type: z.enum(['real', 'integer']).describe('Column type').optional(),
        name: z.string().describe('Column name').optional()
      })

      .nullable()
      .optional(),
    sizeScale: z
      .enum(['linear', 'sqrt', 'log'])
      .describe('Scale is based on sizeField type and undefined type.')
      .optional()
  })
});

export type HexagonLayerSchema = z.infer<typeof HexagonLayerSchema>;
