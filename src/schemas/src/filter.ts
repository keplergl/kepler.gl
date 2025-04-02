// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as z from 'zod';

import {
  AggregationKey,
  AggregationKeySchema,
  TIME_INTERVAL_DESC,
  TimeIntervalSchema
} from './common';

export const FilterTypesSchema = z.enum(['range', 'select', 'multiSelect', 'timeRange', 'polygon']);
export type FilterTypesSchema = z.infer<typeof FilterTypesSchema>;

export const GeoJsonPolygonSchema = z.object({
  type: z.literal('Feature'),
  properties: z.unknown().optional(),
  geometry: z.union([
    z.object({
      type: z.literal('Polygon'),
      coordinates: z.array(z.array(z.array(z.number())))
    }),
    z.object({
      type: z.literal('MultiPolygon'),
      coordinates: z.array(z.array(z.array(z.array(z.number()))))
    })
  ])
});
export type GeoJsonPolygonSchema = z.infer<typeof GeoJsonPolygonSchema>;

const CONVERT_LEGACY_AGGREGATIONS: Record<string, AggregationKey> = {
  average: AggregationKey.MEAN,
  maximum: AggregationKey.MAX,
  minimum: AggregationKey.MIN,
  stdev: AggregationKey.DEVIATION,
  count: AggregationKey.COUNT,
  median: AggregationKey.MEDIAN,
  sum: AggregationKey.SUM,
  variance: AggregationKey.VARIANCE,
  mode: AggregationKey.MODE,
  countUnique: AggregationKey.UNIQUE
} as const;

const PlotType = z.enum(['histogram', 'lineChart']);
export const PlotTypeSchema = z.preprocess(
  (plotType: any) => (typeof plotType === 'string' ? {type: plotType} : plotType),
  z.object({
    type: PlotType.default('histogram'),
    interval: TimeIntervalSchema.optional().describe(
      `Time interval for the time axis aggregation. ${TIME_INTERVAL_DESC}`
    ),
    aggregation: z
      .preprocess(
        (aggregation: any) =>
          aggregation in AggregationKey
            ? aggregation
            : CONVERT_LEGACY_AGGREGATIONS[aggregation] ?? AggregationKey.COUNT,
        AggregationKeySchema
      )
      .default(AggregationKeySchema.enum.SUM)
      .describe('Aggregation function for the time axis'),
    defaultTimeFormat: z
      .string()
      .optional()
      .describe(
        'Default time format for the time axis. For the syntax check these docs: ' +
          'https://momentjs.com/docs/#/displaying/format/'
      )
  })
);
export type PlotTypeSchema = z.infer<typeof PlotTypeSchema>;

export const AnimationWindowSchema = z.enum(['free', 'incremental', 'point', 'interval']);
export type AnimationWindowSchema = z.infer<typeof AnimationWindowSchema>;

export const FilterViewTypeSchema = z.enum(['side', 'enlarged', 'minified']);
export type FilterViewTypeSchema = z.infer<typeof FilterViewTypeSchema>;

export const SyncTimelineModeSchema = z.union([z.literal(0), z.literal(1)]);
export type SyncTimelineModeSchema = z.infer<typeof SyncTimelineModeSchema>;

export const DimensionFieldSchema = z.object({
  name: z.string().describe('Name of the field'),
  type: z.enum(['integer', 'real', 'string', 'boolean', 'date']).describe('Type of the field')
});
export type DimensionFieldSchema = z.infer<typeof DimensionFieldSchema>;

const BaseFilterSchema = z.object({
  id: z.string().describe('Unique id for this filter'),
  name: z
    .preprocess((name: any) => (!Array.isArray(name) ? [name] : name), z.array(z.string()))
    .describe('Names of the fields that this filter applies to (respectively to dataIds)'),
  type: FilterTypesSchema.describe('Type of filter'),
  dataId: z
    .preprocess((name: any) => (!Array.isArray(name) ? [name] : name), z.array(z.string()))
    .describe('Dataset ids that this filter applies to'),
  view: z
    .literal(FilterViewTypeSchema.enum.side)
    .default('side')
    .describe('Where the filter should be displayed: has to be side for non-timeRange filters')
});
type BaseFilterSchema = z.infer<typeof BaseFilterSchema>;

export const RangeFilterSchema = BaseFilterSchema.extend({
  type: z
    .literal(FilterTypesSchema.enum.range)
    .describe('Range filter specifies sets min and max values for a numeric field'),
  value: z.tuple([z.number(), z.number()]).nullable().describe('Range of the filter')
});
export type RangeFilterSchema = z.infer<typeof RangeFilterSchema>;

export const TimeRangeFilterSchema = BaseFilterSchema.extend({
  type: z
    .literal(FilterTypesSchema.enum.timeRange)
    .describe('Time range filter specifies sets min and max values'),
  value: z.tuple([z.number(), z.number()]).nullable().describe('Range of the filter'),
  view: FilterViewTypeSchema.default('side').describe(
    'Where the filter should be displayed: side, enlarged or minified'
  ),
  animationWindow: AnimationWindowSchema.default('free').describe('Animation window type'),
  yAxis: DimensionFieldSchema.optional().nullable().describe('Dimension field for the y axis'),
  speed: z.number().default(1).describe('Speed of the animation'),
  syncedWithLayerTimeline: z
    .optional(z.boolean())
    .describe('Whether the filter should be synced with the layer timeline'),
  syncTimelineMode: SyncTimelineModeSchema.optional().describe(
    'Sync timeline mode: 0 (sync with range start) or 1 (sync with range end)'
  ),
  invertTrendColor: z.boolean().optional().describe('Whether the trend color should be inverted'),
  timezone: z
    .string()
    .optional()
    .describe('Timezone (TZ identifier) for displaying time, e.g. America/New_York'),
  plotType: PlotTypeSchema.describe(
    'Type of plot to show in the enlarged panel: histogram or lineChart'
  )
    .default({
      type: 'histogram'
    })
    .describe('Type of plot to show in the enlarged panel')
});

export type TimeRangeFilterSchema = z.infer<typeof TimeRangeFilterSchema>;

export const SelectFilterSchema = BaseFilterSchema.extend({
  type: z
    .literal(FilterTypesSchema.enum.select)
    .describe('Select filter with a single boolean value'),
  value: z.boolean().nullable().describe('Selected or not')
});
export type SelectFilterSchema = z.infer<typeof SelectFilterSchema>;

export const MultiSelectFilterSchema = BaseFilterSchema.extend({
  type: z
    .literal(FilterTypesSchema.enum.multiSelect)
    .describe('Multi select filter with a list of values'),
  value: z.array(z.coerce.string()).nullable().describe('List of selected values')
});
export type MultiSelectFilterSchema = z.infer<typeof MultiSelectFilterSchema>;

export const PolygonFilterSchema = BaseFilterSchema.extend({
  type: z.literal(FilterTypesSchema.enum.polygon).describe('Polygon selection on the map'),
  value: GeoJsonPolygonSchema.extend({
    id: z.string().optional().describe('Unique id of the polygon')
  })
    .nullable()
    .describe('Polygon selection on a map (GeoJSON format)'),
  layerId: z.array(z.string()).optional().describe('Layer ids that this filter applies to')
  // TODO: this prop doesn't seem to be needed to be saved
  // enabled: z.boolean().optional().describe('Whether the filter is enabled')
});
export type PolygonFilterSchema = z.infer<typeof PolygonFilterSchema>;

export const FilterSchema = z.preprocess((filter: any) => {
  if (filter && !filter.type) {
    // Filters may miss the type field
    filter = {...filter, type: FilterTypesSchema.enum.multiSelect};
  }
  if (filter.type === 'timeRange' && filter.enlarged !== undefined && filter.view === undefined) {
    // Field enlarged was deprecated renamed from  to view
    filter = {...filter, view: filter.enlarged ? 'enlarged' : 'side'};
  }
  return filter;
}, z.discriminatedUnion('type', [RangeFilterSchema, TimeRangeFilterSchema, SelectFilterSchema, MultiSelectFilterSchema, PolygonFilterSchema]));
export type FilterSchema = z.infer<typeof FilterSchema>;
