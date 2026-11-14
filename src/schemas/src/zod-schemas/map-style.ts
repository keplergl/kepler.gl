// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';
import {ColorSchema} from './common';

export const CustomMapStyleSchema = z
  .object({
    accessToken: z.string(),
    custom: z.union([z.boolean(), z.string()]),
    icon: z.string(),
    id: z.string(),
    label: z.string(),
    url: z.string()
  })
  .partial();
export const MapStyleSchema = z
  .object({
    styleType: z.string(),
    topLayerGroups: z.record(z.string(), z.boolean()),
    visibleLayerGroups: z.record(z.string(), z.boolean()),
    threeDBuildingColor: ColorSchema,
    backgroundColor: ColorSchema,
    mapStyles: z.record(z.string(), CustomMapStyleSchema)
  })
  .partial();
export type MapStyle = z.infer<typeof MapStyleSchema>;
