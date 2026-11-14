// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';
import {VisStateSchema} from './vis-state';
import {MapStateSchema} from './map-state';
import {MapStyleSchema} from './map-style';
import {UiStateSchema} from './ui-state';
import {SavedDatasetSchema} from './dataset';

export * from './common';
export * from './layers';
export * from './filter';
export * from './effect';
export * from './interaction-config';
export * from './vis-state';
export * from './map-state';
export * from './map-style';
export * from './ui-state';
export * from './dataset';

/** Explicit validation of v1 saved configs; the manager also accepts legacy/partial inputs. */
export const ConfigSchema = z.object({
  visState: VisStateSchema.optional(),
  mapState: MapStateSchema.optional(),
  mapStyle: MapStyleSchema.optional(),
  uiState: UiStateSchema.optional()
});
export const SavedConfigSchema = z.object({version: z.literal('v1'), config: ConfigSchema});
export const MapInfoSchema = z.object({
  app: z.string(),
  created_at: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  source: z.string().optional(),
  appName: z.string().optional(),
  appWebsite: z.string().optional(),
  appIcon: z.string().optional(),
  appNameColor: z.string().optional()
});
export const SavedMapSchema = z.object({
  datasets: z.array(SavedDatasetSchema),
  config: SavedConfigSchema,
  info: MapInfoSchema
});
export type Config = z.infer<typeof ConfigSchema>;
export type SavedConfig = z.infer<typeof SavedConfigSchema>;
export type SavedMap = z.infer<typeof SavedMapSchema>;
