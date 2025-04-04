// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';

import {
  BaseLayerConfigSchema,
  BaseLayerSchema,
  ColorScale,
  LayerType,
  OpacitySchema,
  TextLabelSchema,
  VisualChannelFieldSchema
} from './common';
import {ColorRangeSchema} from '../color';

const BaseTripLayerConfigSchema = BaseLayerConfigSchema.extend({
  visConfig: z
    .preprocess(
      // eslint-disable-next-line complexity
      (visConfig: any) => {
        let next = visConfig;
        // xyz props were used initially but were then renamed into more descriptive pitch, roll, yaw
        if (visConfig.angleX !== undefined && visConfig.fixedRoll === undefined) {
          next = {...next, adjustRoll: visConfig.angleX};
          delete next.angleX;
        }
        if (visConfig.angleY !== undefined && visConfig.fixedPitch === undefined) {
          next = {...next, adjustPitch: visConfig.angleY};
          delete next.angleY;
        }
        if (visConfig.angleZ !== undefined && visConfig.fixedYaw === undefined) {
          next = {...next, adjustYaw: visConfig.angleZ};
          delete next.angleZ;
        }
        if (visConfig.fixedAngleX !== undefined && visConfig.fixedRoll === undefined) {
          next = {...next, fixedRoll: visConfig.fixedAngleX};
          delete next.fixedAngleX;
        }
        if (visConfig.fixedAngleY !== undefined && visConfig.fixedPitch === undefined) {
          next = {...next, fixedPitch: visConfig.fixedAngleY};
          delete next.fixedAngleY;
        }
        if (visConfig.fixedAngleZ !== undefined && visConfig.fixedYaw === undefined) {
          next = {...next, fixedYaw: visConfig.fixedAngleZ};
          delete next.fixedAngleZ;
        }
        return next;
      },
      z.object({
        opacity: OpacitySchema,
        thickness: z.number().gte(0).lte(100).default(0.5),
        colorRange: ColorRangeSchema.optional(),
        trailLength: z.number().gte(1).lte(1000).default(180),
        fadeTrail: z.boolean().default(true),
        billboard: z.boolean().default(false),
        sizeRange: z.array(z.number().gte(0).lte(200)).default([0, 10]),
        sizeScale: z.preprocess((scale: any) => {
          // Some early saved configs weren't using the same scale, and so might be out of range
          if (scale > 10) return 10;
          if (scale < -10) return -10;
          return scale;
        }, z.number().gte(-10).lte(10).default(1)),
        scenegraph: z.string().nullable().optional(),
        scenegraphEnabled: z.boolean().default(false),
        scenegraphColorEnabled: z.boolean().default(false),
        scenegraphUseTrailColor: z.boolean().default(false),
        scenegraphColor: z
          .array(z.union([z.number(), z.number(), z.number()]))
          .min(3)
          .max(3)
          .optional()
          .nullable(),
        scenegraphCustomModelUrl: z.string().default(''),
        adjustRoll: z.number().gte(-180).lte(180).default(0),
        adjustPitch: z.number().gte(-180).lte(180).default(0),
        adjustYaw: z.number().gte(-180).lte(180).default(0),
        invertRoll: z.boolean().default(false),
        invertPitch: z.boolean().default(false),
        invertYaw: z.boolean().default(false),
        fixedRoll: z.boolean().default(true),
        fixedPitch: z.boolean().default(true),
        fixedYaw: z.boolean().default(true)
      })
    )
    .optional(),
  textLabel: z.array(TextLabelSchema).optional()
});

export const TripLayerSchema = BaseLayerSchema.extend({
  type: z.literal(LayerType.enum.trip),
  config: z.union([
    BaseTripLayerConfigSchema.extend({
      columnMode: z.literal('geojson').default('geojson').describe('Column mode'),
      columns: z.object({geojson: z.string()})
    }),
    BaseTripLayerConfigSchema.extend({
      columnMode: z.literal('table').describe('Column mode'),
      columns: z.object({
        id: z.string(),
        lat: z.string(),
        lng: z.string(),
        timestamp: z.string(),
        altitude: z.string().optional().nullable()
      })
    })
  ]),
  visualChannels: z.object({
    colorField: VisualChannelFieldSchema.optional().nullable(),
    colorScale: ColorScale.optional(),
    sizeField: VisualChannelFieldSchema.optional().nullable(),
    sizeScale: z
      .enum(['point', 'linear', 'sqrt', 'log'])
      .describe('Scale is based on sizeField type.')
      .optional(),
    rollField: z
      .object({
        type: z.enum(['real', 'timestamp', 'integer']).describe('Column type').optional(),
        name: z.string().describe('Column name').optional()
      })
      .nullable()
      .optional(),
    rollScale: z.literal('linear').describe('Scale is based on rollField type.').optional(),
    pitchField: z
      .object({
        type: z.enum(['real', 'timestamp', 'integer']).describe('Column type').optional(),
        name: z.string().describe('Column name').optional()
      })
      .nullable()
      .optional(),
    pitchScale: z.literal('linear').describe('Scale is based on pitchField type.').optional(),
    yawField: z
      .object({
        type: z.enum(['real', 'timestamp', 'integer']).describe('Column type').optional(),
        name: z.string().describe('Column name').optional()
      })
      .nullable()
      .optional(),
    yawScale: z.literal('linear').describe('Scale is based on yawField type.').optional()
  })
});

export type TripLayerSchema = z.infer<typeof TripLayerSchema>;
