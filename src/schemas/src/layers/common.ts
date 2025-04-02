// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';

import {RGBColorSchema} from '../color';

export const LayerType = z.enum([
  'point',
  'line',
  'arc',
  'heatmap',
  'grid',
  'hexagon',
  'hexagonId',
  'hexTile',
  's2',
  'cluster',
  'icon',
  'geojson',
  'trip',
  '3D',
  'vectorTile'
]);

export const VisualChannelFieldSchema = z.object({
  type: z
    .enum(['string', 'real', 'timestamp', 'integer', 'boolean', 'date'])
    .describe('Column type')
    .optional(),
  name: z.string().describe('Column name').optional()
});
export const ColorScale = z.enum(['ordinal', 'quantize', 'quantile', 'custom', 'customOrdinal']);

export const AggregationModes = z.enum([
  'count',
  'average',
  'maximum',
  'minimum',
  'median',
  'stdev',
  'sum',
  'variance',
  'mode',
  'countUnique'
]);
export const AggregationModeSchema = z.preprocess((mode: any) => {
  if (mode === 'count unique') {
    // some older configs have 'count unique' instead of 'countUnique'
    mode = 'countUnique';
  }
  return mode;
}, AggregationModes);

export const TextLabelSchema = z.preprocess(
  (textLabel: any) => {
    let next = textLabel;
    // some older configs have textLabel.field as a string instead of an array
    // (before we added multi-field text labels)
    if (next.field && !Array.isArray(next.field)) {
      next = {...next, field: [next.field]};
    }
    return next;
  },
  z.object({
    size: z.number().gte(1).lte(100).default(18),
    color: RGBColorSchema,
    field: z
      .array(
        z.preprocess(
          (field: any) => {
            if (field && typeof field.field !== 'object' && typeof field?.name === 'string') {
              // some older configs have field as a string instead of an object
              field = {field};
            }
            return field;
          },
          z.object({
            field: z
              .object({name: z.string().optional(), type: z.string().optional()})
              .optional()
              .nullable(),
            format: z.string().optional().nullable()
          })
        )
      )
      .nullable()
      .optional(),
    offset: z.tuple([z.number(), z.number()]).default([0, 0]),
    anchor: z.enum(['start', 'middle', 'end']).default('start'),
    alignment: z.enum(['top', 'center', 'bottom']).default('center'),
    background: z.boolean().optional().describe('Show background for text label'),
    backgroundColor: RGBColorSchema.optional()
      .nullable()
      .describe('Background color for text label'),
    outlineColor: RGBColorSchema.optional().describe('Outline color for text label'),
    outlineWidth: z.number().gte(0).lte(1).optional().describe('Outline width for text label')
  })
);
export type TextLabelSchema = z.infer<typeof TextLabelSchema>;

export const RadiusByZoomSchema = z.object({
  enabled: z.boolean().optional(),
  stops: z.array(z.array(z.number())).nullable().optional()
});
export const OpacitySchema = z.number().gte(0).lte(1).default(0.8);
export const ElevationPercentileSchema = z
  .array(z.coerce.number().gte(0).lte(100))
  .default([0, 100]);
export const PercentileSchema = z.array(z.coerce.number().gte(0).lte(100)).default([0, 100]);

export const BaseLayerSchema = z.object({
  id: z.string().describe('Layer id, use a string without space')
});
export const BaseLayerConfigSchema = z.object({
  dataId: z.string().describe('The id of the dataset from which this layer was created'),
  label: z.string().describe('The displayed layer label').optional(),
  color: RGBColorSchema.describe('Layer color as RGB. e.g. `[255, 0, 0]`.').optional(),
  isVisible: z.boolean().describe('Layer visibility on the map.').optional(),
  hidden: z
    .boolean()
    .describe('Hide layer from the layer panel. This will prevent user from editing the layer.')
    .optional(),
  legend: z
    .object({
      isIncluded: z.boolean().describe('Display the layer in the legend.')
    })
    .optional()
});
