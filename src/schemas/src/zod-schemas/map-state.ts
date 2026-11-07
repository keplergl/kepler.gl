// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';
import {MapSplitMode, MapViewMode} from '@kepler.gl/constants';
import {RGBColorSchema} from './common';

export const ViewportSchema = z
  .object({
    bearing: z.number(),
    dragRotate: z.boolean(),
    latitude: z.number(),
    longitude: z.number(),
    pitch: z.number(),
    zoom: z.number().nullable()
  })
  .partial();

export const GlobeConfigSchema = z
  .looseObject({
    atmosphere: z.boolean(),
    hugeHalo: z.boolean(),
    hugeHaloRadius: z.number(),
    hugeHaloOpacity: z.number(),
    azimuth: z.boolean(),
    azimuthAngle: z.number(),
    terminator: z.boolean(),
    terminatorOpacity: z.number(),
    basemap: z.boolean(),
    labels: z.boolean(),
    labelsColor: RGBColorSchema,
    adminLines: z.boolean(),
    adminLinesColor: RGBColorSchema,
    water: z.boolean(),
    waterColor: RGBColorSchema,
    surface: z.boolean(),
    surfaceColor: RGBColorSchema,
    backgroundColor: RGBColorSchema,
    stars: z.boolean()
  })
  .partial();

// No bounds/defaults: wrapped longitudes, null legacy zoom and partial viewports
// must not be rewritten to the UI's current slider ranges or default settings.
export const MapStateSchema = ViewportSchema.extend({
  isSplit: z.boolean().optional(),
  isViewportSynced: z.boolean().optional(),
  isZoomLocked: z.boolean().optional(),
  splitMapViewports: z.array(ViewportSchema).optional(),
  maxPitch: z.number().optional(),
  mapSplitMode: z.enum(MapSplitMode).optional(),
  swipeComparePercentage: z.number().optional(),
  mapViewMode: z.enum(MapViewMode).optional(),
  globe: z.object({enabled: z.boolean(), config: GlobeConfigSchema}).partial().optional()
});
export type MapState = z.infer<typeof MapStateSchema>;
