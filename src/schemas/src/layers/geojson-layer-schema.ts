// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';

import {
  BaseLayerConfigSchema,
  OpacitySchema,
  TextLabelSchema,
  BaseLayerSchema,
  LayerType,
  VisualChannelFieldSchema,
  ColorScale
} from './common';
import {RGBColorSchema, ColorRangeSchema} from '../color';

const BaseGeojsonLayerConfigSchema = BaseLayerConfigSchema.extend({
  visConfig: z
    .object({
      opacity: OpacitySchema,
      strokeOpacity: z.preprocess(
        (opacity: any) =>
          // some older saved configs have null strokeOpacity
          opacity === null ? 0.8 : opacity,
        z.number().gte(0).lte(1).default(0.8)
      ),
      thickness: z.number().gte(0).lte(100).default(0.5),
      strokeColor: z.preprocess(
        // there are some empty arrays in saved configs
        (col: any) => (Array.isArray(col) && col.length === 0 ? [0, 0, 0] : col),
        RGBColorSchema.optional().nullable().describe('Stroke color')
      ),
      colorRange: ColorRangeSchema.optional(),
      strokeColorRange: z.preprocess(
        // there are some empty objects in saved configs
        (range: any) => (range && range.colors ? range : null),
        ColorRangeSchema.optional().nullable()
      ),
      radius: z.number().gte(0).lte(100).default(10),
      sizeRange: z.array(z.number().gte(0).lte(200)).default([0, 10]),
      radiusRange: z.array(z.number().gte(0).lte(500)).default([0, 50]),
      heightRange: z.array(z.number().gte(0).lte(1000)).default([0, 500]),
      elevationScale: z.number().gte(0).lte(1000).default(5),
      stroked: z.boolean().default(true),
      filled: z.boolean().default(false),
      enable3d: z.boolean().default(false),
      wireframe: z.boolean().default(false),
      fixedHeight: z.boolean().default(false)
    })
    .optional(),
  textLabel: z.array(TextLabelSchema).optional(),
  highlightColor: RGBColorSchema.optional().nullable().describe('Highlight color')
});

export const GeojsonLayerSchema = BaseLayerSchema.extend({
  type: z.literal(LayerType.enum.geojson),
  config: z.preprocess(
    (config: any) => {
      let next = config;
      if (next && !['geojson', 'polygon'].includes(next.columnMode)) {
        // older saved configs were missing columnMode
        if (next.columns?.geojson) {
          next = {...next, columnMode: 'geojson'};
        } else if (next.columns?.lat && next.columns?.lng) {
          next = {...next, columnMode: 'polygon'};
        }
      }
      return next;
    },
    z.discriminatedUnion('columnMode', [
      BaseGeojsonLayerConfigSchema.extend({
        columnMode: z.literal('geojson').describe('Column mode'),
        columns: z.object({geojson: z.string()})
      }),
      BaseGeojsonLayerConfigSchema.extend({
        columnMode: z.literal('polygon').describe('Column mode'),
        columns: z.object({
          id: z.string(),
          lat: z.string(),
          lng: z.string(),
          altitude: z.string().optional().nullable(),
          sortBy: z.string().optional()
        })
      })
    ])
  ),
  visualChannels: z.object({
    colorField: VisualChannelFieldSchema.optional().nullable(),
    colorScale: ColorScale.optional().describe('Scale is based on colorField type.'),
    strokeColorField: VisualChannelFieldSchema.optional().nullable(),
    strokeColorScale: ColorScale.optional().describe('Scale is based on strokeColorField type.'),
    sizeField: VisualChannelFieldSchema.nullable().optional(),
    sizeScale: z
      .enum(['point', 'linear', 'sqrt', 'log'])
      .describe('Scale is based on sizeField type.')
      .optional(),
    heightField: VisualChannelFieldSchema.optional().nullable(),
    heightScale: z
      .enum(['point', 'linear', 'sqrt', 'log'])
      .describe('Scale is based on heightField type.')
      .optional(),
    radiusField: VisualChannelFieldSchema.optional().nullable(),
    radiusScale: z
      .enum(['point', 'sqrt', 'linear'])
      .describe('Scale is based on radiusField type.')
      .optional()
  })
});

export type GeojsonLayerSchema = z.infer<typeof GeojsonLayerSchema>;
