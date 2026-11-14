// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';
import {AnnotationKind} from '@kepler.gl/constants';
import {FieldSchema, FeatureSchema, ObjectSchema, PositionSchema} from './common';
import {LayerSchema} from './layers';
import {FilterSchema} from './filter';
import {EffectSchema} from './effect';
import {InteractionConfigSchema} from './interaction-config';

export const AnimationConfigSchema = z.object({
  currentTime: z.number().nullish(),
  speed: z.number().optional(),
  timeFormat: z.string().nullish(),
  timezone: z.string().nullish()
});
export const EditorSchema = z.object({
  features: z.array(FeatureSchema).optional(),
  visible: z.boolean().optional()
});
export const CameraSnapshotSchema = z.object({
  longitude: z.number(),
  latitude: z.number(),
  zoom: z.number(),
  bearing: z.number(),
  pitch: z.number()
});
export const CameraBookmarkSchema = z.object({
  id: z.string(),
  name: z.string(),
  camera: CameraSnapshotSchema
});
export const CameraTourStopSchema = CameraBookmarkSchema.extend({
  holdDurationMs: z.number(),
  travelDurationMs: z.number()
});
export const CameraTourSchema = z.object({stops: z.array(CameraTourStopSchema)});

export const AnnotationSchema = z
  .object({
    id: z.string(),
    kind: z.enum(AnnotationKind),
    isVisible: z.boolean(),
    autoSize: z.boolean(),
    autoSizeY: z.boolean(),
    anchorPoint: PositionSchema,
    label: z.string(),
    editorState: ObjectSchema.nullable(),
    mapIndex: z.number().nullable(),
    lineColor: z.string(),
    lineWidth: z.number(),
    textWidth: z.number(),
    textHeight: z.number(),
    textVerticalAlign: z.enum(['top', 'middle', 'bottom']),
    textSide: z.enum(['left', 'right']),
    textVerticalPosition: z.enum(['above', 'below']),
    armLength: z.number().nullable(),
    angle: z.number().nullable(),
    radiusInMeters: z.number().nullable(),
    endPoint: PositionSchema,
    showCustomText: z.boolean(),
    showDistance: z.boolean()
  })
  .partial();
export const ChartAxisSchema = z.looseObject({
  field: FieldSchema.nullable(),
  aggregation: z.string().nullable(),
  title: z.string().nullish(),
  interval: z.string().nullish()
});
export const ChartSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    type: z.string(),
    dataId: z.string().nullable(),
    applyFilters: z.boolean(),
    pinned: z.boolean(),
    display: z.object({
      isConfigActive: z.boolean().optional(),
      isJsonEditorActive: z.boolean().optional()
    }),
    crossFilter: z.object({
      enabled: z.boolean(),
      filterId: z.string(),
      fieldNames: z.record(z.string(), z.string()),
      value: z.record(z.string(), z.union([z.string(), z.number()]))
    }),
    xAxis: ChartAxisSchema,
    yAxis: ChartAxisSchema,
    groupBy: ChartAxisSchema,
    value: ChartAxisSchema,
    axis: ChartAxisSchema,
    numGroups: z.number(),
    groupOthers: z.boolean(),
    colorBy: z.string(),
    chartDisplay: ObjectSchema,
    layerId: z.string(),
    layerChartType: z.string()
  })
  .partial();
export const SplitMapsSchema = z.array(
  z.looseObject({
    id: z.string().optional(),
    layers: z.record(
      z.string(),
      z.union([z.boolean(), z.object({isAvailable: z.boolean(), isVisible: z.boolean()})])
    )
  })
);
export type LayerOrderEntry =
  | string
  | {
      id: string;
      label?: string;
      isVisible?: boolean;
      isIncludedInLegend?: boolean;
      layerOrder: LayerOrderEntry[];
    };
export const LayerOrderSchema: z.ZodType<LayerOrderEntry[]> = z.lazy(() =>
  z.array(
    z.union([
      z.string(),
      z.object({
        id: z.string(),
        label: z.string().optional(),
        isVisible: z.boolean().optional(),
        layerOrder: LayerOrderSchema,
        isIncludedInLegend: z.boolean().optional()
      })
    ])
  )
);
export const VisStateSchema = z.object({
  cameraTour: CameraTourSchema.optional(),
  cameraBookmarks: z.array(CameraBookmarkSchema).optional(),
  filters: z.array(FilterSchema).optional(),
  layers: z.array(LayerSchema).optional(),
  effects: z.array(EffectSchema).optional(),
  charts: z.array(ChartSchema).optional(),
  annotations: z.array(AnnotationSchema).optional(),
  interactionConfig: InteractionConfigSchema.optional(),
  layerBlending: z.string().optional(),
  overlayBlending: z.string().optional(),
  splitMaps: SplitMapsSchema.optional(),
  animationConfig: AnimationConfigSchema.optional(),
  editor: EditorSchema.optional(),
  layerOrder: LayerOrderSchema.optional(),
  groupBys: z.array(ObjectSchema).optional(),
  joins: z.array(ObjectSchema).optional()
});
export type VisState = z.infer<typeof VisStateSchema>;
export type CameraTour = z.infer<typeof CameraTourSchema>;
export type Chart = z.infer<typeof ChartSchema>;
