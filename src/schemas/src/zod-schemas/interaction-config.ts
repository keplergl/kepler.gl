// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';
import {ColorSchema} from './common';

const enabled = z.object({enabled: z.boolean().optional()});
export const TooltipFieldSchema = z.object({name: z.string(), format: z.string().nullish()});
export const ZoomOpacityControllerSchema = z.object({
  id: z.string(),
  layerIds: z.array(z.string()),
  stops: z.object({appear: z.number(), full: z.number(), fade: z.number(), gone: z.number()})
});
export const InteractionConfigSchema = z.object({
  tooltip: enabled
    .extend({
      fieldsToShow: z
        .record(z.string(), z.array(z.union([z.string(), TooltipFieldSchema])))
        .optional(),
      compareMode: z.boolean().optional(),
      compareType: z.string().nullish(),
      timezone: z.string().nullish()
    })
    .optional(),
  legend: enabled.extend({hideInvisibleLayers: z.boolean().optional()}).optional(),
  brush: enabled.extend({size: z.number().optional()}).optional(),
  geocoder: enabled
    .extend({limitSearch: z.boolean().optional(), color: ColorSchema.optional()})
    .optional(),
  coordinate: enabled.optional(),
  annotation: enabled.optional(),
  zoomOpacity: enabled
    .extend({controllers: z.array(ZoomOpacityControllerSchema).optional()})
    .optional()
});
export type InteractionConfig = z.infer<typeof InteractionConfigSchema>;
