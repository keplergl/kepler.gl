// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';

import {
  BaseLayerSchema,
  LayerType,
  BaseLayerConfigSchema,
  OpacitySchema,
  RadiusByZoomSchema,
  VisualChannelFieldSchema,
  ColorScale
} from './common';
import {RGBColorSchema, ColorRangeSchema} from '../color';

export const VectorTileLayerSchema = BaseLayerSchema.extend({
  type: z.literal(LayerType.enum.vectorTile),
  config: BaseLayerConfigSchema.extend({
    dataId: BaseLayerConfigSchema.shape.dataId.nullable(),

    visConfig: z.preprocess(
      (visConfig: any) => {
        let next = visConfig;
        if (visConfig && visConfig.stroked === undefined) {
          // 1) old layer configs had no stroked prop, but strokes were visible.
          // 2) strokeOpacity was ignored and opacity was used instead.
          next = {
            ...next,
            stroked: true,
            strokeWidth: 0.5,
            strokeOpacity: visConfig.opacity ?? 0.8
          };
        }
        return next;
      },
      z
        .object({
          tileUrl: z.string().optional(),
          stroked: z.boolean().optional(),
          strokeColor: RGBColorSchema.optional().nullable().describe('Stroke color'),
          strokeOpacity: OpacitySchema,
          strokeWidth: z.number().gte(0).lte(100).default(0.5),
          radius: z.number().gte(0).lte(1000).default(50),
          enable3d: z.boolean().default(false),
          transition: z.boolean().default(false),
          heightRange: z.array(z.number().gte(0).lte(1000)).default([0, 500]),
          elevationScale: z.number().gte(0).lte(1000).default(5),
          opacity: OpacitySchema,
          colorRange: ColorRangeSchema.optional(),
          strokeColorRange: ColorRangeSchema.optional().nullable(),
          radiusByZoom: RadiusByZoomSchema.optional().nullable(),
          dynamicColor: z.boolean().optional()
        })
        .optional()
    )
  }),
  visualChannels: z.object({
    colorField: VisualChannelFieldSchema.optional().nullable(),
    colorScale: ColorScale.describe('Scale is based on colorField type.').optional(),
    strokeColorField: VisualChannelFieldSchema.optional().nullable(),
    strokeColorScale: ColorScale.optional().describe('Scale is based on strokeColorField type.'),
    heightField: VisualChannelFieldSchema.optional().nullable(),
    heightScale: z
      .enum(['point', 'linear', 'sqrt', 'log'])
      .describe('Scale is based on heightField type.')
      .optional()
  })
});

export type VectorTileLayerSchema = z.infer<typeof VectorTileLayerSchema>;
