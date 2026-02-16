// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';

export const ViewportSchema = z.object({
  latitude: z.number().gte(-90).lte(90),
  longitude: z.number().gte(-180).lte(180),
  zoom: z.preprocess(
    // Some old configs have null zoom, so we need to convert it to 0
    (zoom: any) => zoom ?? 0,
    z.number().gte(0).lte(25).default(0)
  ),
  bearing: z.number().optional(),
  pitch: z.number().gte(0).lt(90),
  dragRotate: z.boolean().optional()
});
export type ViewportSchema = z.infer<typeof ViewportSchema>;

const MapViewMode = z.enum(['MODE_2D', 'MODE_3D']);
const MapSplitMode = z.enum(['SINGLE_MAP', 'DUAL_MAP']);

const BaseMapSplitModeSchema = z.union([
  ViewportSchema.extend({
    mapSplitMode: z.literal(MapSplitMode.enum.SINGLE_MAP),
    isSplit: z.literal(false).default(false)
  }),
  ViewportSchema.extend({
    mapSplitMode: z.literal(MapSplitMode.enum.DUAL_MAP),
    isSplit: z.literal(true).default(true),
    isViewportSynced: z.literal(true).default(true)
  }),
  ViewportSchema.extend({
    mapSplitMode: z.literal(MapSplitMode.enum.DUAL_MAP),
    isSplit: z.literal(true).default(true),
    isViewportSynced: z.literal(false).default(false),
    isZoomLocked: z.boolean().default(false),
    splitMapViewports: z.array(ViewportSchema)
  })
]);

const BaseMapViewModeStateSchema = z.discriminatedUnion('mapViewMode', [
  z.object({mapViewMode: z.literal(MapViewMode.enum.MODE_2D)}),
  z.object({mapViewMode: z.literal(MapViewMode.enum.MODE_3D)})
]);

export const MapStateSchema = z.preprocess((state: any) => {
  let next = state;
  if (!next.mapViewMode) {
    // Old configs didn't have mapViewMode, so we need to infer it from the other fields
    if (next.bearing || next.pitch) {
      next = {...next, mapViewMode: MapViewMode.enum.MODE_3D};
    } else {
      next = {...next, mapViewMode: MapViewMode.enum.MODE_2D};
    }
  }
  if (!next.mapSplitMode) {
    // Old configs didn't have mapSplitMode, so we need to infer it from isSplit
    if (next.isSplit) {
      next = {...next, mapSplitMode: MapSplitMode.enum.DUAL_MAP};
    } else {
      next = {...next, mapSplitMode: MapSplitMode.enum.SINGLE_MAP};
    }
  }
  return next;
}, z.intersection(BaseMapSplitModeSchema, BaseMapViewModeStateSchema));

export type MapStateSchema = z.infer<typeof MapStateSchema>;
