// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';

export const InteractionConfigSchema = z.object({
  tooltip: z.object({
    fieldsToShow: z.record(z.string(), z.array(z.string())).optional(),
    compareMode: z.boolean().default(false),
    compareType: z.enum(['absolute', 'percent']).default('absolute'),
    enabled: z.boolean().default(true)
  }),
  brush: z.object({
    size: z.number().min(0).max(5).default(0.5),
    enabled: z.boolean().default(false)
  }),
  geocoder: z.object({
    enabled: z.boolean().default(false)
  }),
  coordinate: z.object({
    enabled: z.boolean().default(false)
  })
});
