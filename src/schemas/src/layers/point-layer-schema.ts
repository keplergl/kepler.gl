// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';

import {
  BaseLayerConfigSchema,
  BaseLayerSchema,
  ColorScale,
  LayerType,
  OpacitySchema,
  TextLabelSchema,
  VisualChannelFieldSchema
} from './common';
import {RGBColorSchema, ColorRangeSchema} from '../color';

const BasePointLayerConfigSchema = BaseLayerConfigSchema.extend({
  visConfig: z.object({
    radius: z.number().gte(0).lte(100).default(10),
    fixedRadius: z.boolean().default(false),
    opacity: OpacitySchema,
    outline: z.boolean().default(false),
    thickness: z.number().gte(0).lte(100).default(2),
    strokeColor: z.preprocess(
      (col: any) => col || null, // there are some empty strings in saved configs
      RGBColorSchema.optional().nullable().describe('Stroke color')
    ),
    colorRange: ColorRangeSchema.optional().nullable().describe('Color range'),
    strokeColorRange: ColorRangeSchema.optional().nullable().describe('Stroke color range'),
    radiusRange: z.array(z.coerce.number().gte(0).lte(500)).default([0, 50]),
    filled: z.boolean().default(true),
    billboard: z.boolean().default(false),
    allowHover: z.boolean().default(true),
    showNeighborOnHover: z.boolean().default(false),
    showHighlightColor: z.boolean().default(true)
  }),
  textLabel: z.array(TextLabelSchema).optional(),
  highlightColor: RGBColorSchema.optional().nullable().describe('Highlight color')
});

export const PointLayerSchema = BaseLayerSchema.extend({
  type: z.literal(LayerType.enum.point),
  config: z.preprocess(
    (config: any) => {
      let next = config;
      if (next && !next.columnMode) {
        if (next.columns?.geojson) {
          next = {...next, columnMode: 'geojson'};
        } else if (next.columns?.lat && next.columns?.lng) {
          next = {...next, columnMode: 'points'};
        }
      }
      return next;
    },
    z.discriminatedUnion('columnMode', [
      BasePointLayerConfigSchema.extend({
        columnMode: z.literal('geojson').describe('Column mode'),
        columns: z.object({geojson: z.string()})
      }),
      BasePointLayerConfigSchema.extend({
        columnMode: z.literal('points').describe('Column mode'),
        columns: z.object({
          lat: z.string(),
          lng: z.string(),
          altitude: z.string().nullable().optional(),
          neighbors: z.string().optional()
        })
      })
    ])
  ),
  visualChannels: z
    .object({
      colorField: VisualChannelFieldSchema.nullable().optional(),
      colorScale: ColorScale.nullable().optional().describe('Scale is based on colorField type.'),
      strokeColorField: VisualChannelFieldSchema.nullable().optional(),
      strokeColorScale: ColorScale.optional()
        .nullable()
        .describe('Scale is based on strokeColorField type.'),
      sizeField: VisualChannelFieldSchema.nullable().optional(),
      sizeScale: z
        .enum(['point', 'sqrt', 'linear'])
        .nullable()
        .optional()
        .describe('Scale is based on sizeField type. ')
    })

    .optional()
}).describe('Point layer configuration. This layer type is used to render point data on the map.');

export type PointLayerSchema = z.infer<typeof PointLayerSchema>;
