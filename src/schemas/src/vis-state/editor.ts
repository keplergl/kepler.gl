// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';

const GeoJsonFeaturesSchema = z.array(
  z.object({
    type: z.literal('Feature'),
    properties: z.object({}).optional(),
    geometry: z.object({
      type: z.string(),
      coordinates: z.array(z.any())
    })
  })
);

export const EditorSchema = z.object({
  features: GeoJsonFeaturesSchema.optional(),
  visible: z.boolean().optional()
});
