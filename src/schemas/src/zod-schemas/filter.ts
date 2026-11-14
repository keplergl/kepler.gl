// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';
import {FieldSchema, FeatureSchema, NumberPairSchema} from './common';

export const PlotTypeSchema = z.looseObject({
  type: z.string().optional(),
  interval: z.union([z.string(), z.number()]).nullish(),
  aggregation: z.string().nullish(),
  defaultTimeFormat: z.string().nullish()
});
export const FilterFieldsSchema = z.object({
  dataId: z.union([z.string(), z.array(z.string())]),
  id: z.string(),
  name: z.union([z.string(), z.array(z.string())]),
  type: z.string().nullable(),
  value: z.unknown(),
  enlarged: z.boolean().optional(),
  plotType: z.union([z.string(), PlotTypeSchema]).optional(),
  animationWindow: z.string().optional(),
  yAxis: FieldSchema.nullish(),
  view: z.enum(['side', 'enlarged', 'minified']).optional(),
  layerId: z.array(z.string()).optional(),
  speed: z.number().optional(),
  syncedWithLayerTimeline: z.boolean().optional(),
  syncTimelineMode: z.union([z.literal(0), z.literal(1)]).optional(),
  enabled: z.boolean().optional(),
  inverted: z.boolean().optional(),
  invertTrendColor: z.boolean().optional(),
  timezone: z.string().nullish(),
  endName: z.array(z.string().nullish()).optional()
});
export const RangeFilterSchema = FilterFieldsSchema.extend({
  type: z.literal('range'),
  value: NumberPairSchema.nullable()
});
export const TimeRangeFilterSchema = FilterFieldsSchema.extend({
  type: z.literal('timeRange'),
  value: NumberPairSchema.nullable()
});
export const SelectFilterSchema = FilterFieldsSchema.extend({
  type: z.literal('select'),
  value: z.boolean().nullable()
});
export const MultiSelectFilterSchema = FilterFieldsSchema.extend({
  type: z.literal('multiSelect'),
  value: z.array(z.string()).nullable()
});
export const PolygonFilterSchema = FilterFieldsSchema.extend({
  type: z.literal('polygon'),
  value: FeatureSchema.extend({
    geometry: z.union([
      z.object({type: z.literal('Polygon'), coordinates: z.array(z.array(z.array(z.number())))}),
      z.object({
        type: z.literal('MultiPolygon'),
        coordinates: z.array(z.array(z.array(z.array(z.number()))))
      })
    ])
  }).nullable()
});
export const FilterSchema = z.discriminatedUnion('type', [
  RangeFilterSchema,
  TimeRangeFilterSchema,
  SelectFilterSchema,
  MultiSelectFilterSchema,
  PolygonFilterSchema
]);
export type Filter = z.infer<typeof FilterSchema>;
export type TimeRangeFilter = z.infer<typeof TimeRangeFilterSchema>;
