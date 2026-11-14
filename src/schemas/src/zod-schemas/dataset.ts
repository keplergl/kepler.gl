// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';
import {RGBColorSchema, ObjectSchema} from './common';

export const DatasetFieldSchema = z.object({
  name: z.string(),
  type: z.string(),
  format: z.string().optional(),
  analyzerType: z.string().optional(),
  metadata: ObjectSchema.optional()
});
export const DatasetSchema = z.object({
  id: z.string(),
  label: z.string(),
  color: RGBColorSchema,
  // Cells can contain Date, GeoJSON, custom serializers and other dataset values.
  allData: z.array(z.array(z.unknown())),
  fields: z.array(DatasetFieldSchema),
  type: z.string().optional(),
  metadata: ObjectSchema.optional(),
  disableDataOperation: z.boolean().optional()
});
export const SavedDatasetSchema = z.object({version: z.literal('v1'), data: DatasetSchema});
export type Dataset = z.infer<typeof DatasetSchema>;
export type DatasetField = z.infer<typeof DatasetFieldSchema>;
