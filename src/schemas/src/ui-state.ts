// Copyright 2022 Foursquare Labs, Inc. All Rights Reserved.

import {z} from 'zod';

export const UiStateSchema = z.object({
  mapControls: z
    .object({
      mapLegend: z
        .object({
          active: z.boolean().optional(),
          settings: z
            .object({
              position: z
                .object({
                  anchorX: z.enum(['left', 'right']).optional(),
                  anchorY: z.enum(['top', 'bottom']).optional(),
                  x: z.number().optional(),
                  y: z.number().optional()
                })
                .optional(),
              contentHeight: z.number().optional()
            })
            .optional()
        })
        .optional()
    })
    .optional(),
  exportImage: z
    .object({
      ratio: z.string(),
      resolution: z.string(),
      legend: z.boolean(),
      customMapState: z
        .object({
          latitude: z.number(),
          longitude: z.number(),
          zoom: z.number(),
          bearing: z.number(),
          pitch: z.number()
        })
        .optional()
    })
    .optional()
});

export type UiStateSchema = z.infer<typeof UiStateSchema>;
