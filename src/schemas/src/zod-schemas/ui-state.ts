// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';

export const PanelSettingsSchema = z.object({
  position: z
    .object({
      x: z.number(),
      y: z.number(),
      anchorX: z.enum(['left', 'right']),
      anchorY: z.enum(['top', 'bottom'])
    })
    .partial()
    .optional(),
  contentHeight: z.number().optional()
});
export const MapLegendSchema = z.object({
  active: z.boolean().optional(),
  settings: PanelSettingsSchema.optional()
});
export const ChartControlSchema = z.object({active: z.boolean().optional()});
export const CameraBookmarksControlSchema = z.object({
  show: z.boolean().optional(),
  settings: PanelSettingsSchema.optional()
});
export const MapInfoControlSchema = z.object({
  active: z.boolean().optional(),
  show: z.boolean().optional()
});
export const MapControlsSchema = z.object({
  mapLegend: MapLegendSchema.optional(),
  chart: ChartControlSchema.optional(),
  cameraBookmarks: CameraBookmarksControlSchema.optional(),
  mapInfo: MapInfoControlSchema.optional()
});
export const UiStateSchema = z.object({
  mapControls: MapControlsSchema.optional(),
  locale: z.string().optional(),
  theme: z.string().optional()
});
export type UiState = z.infer<typeof UiStateSchema>;
