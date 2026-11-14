// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';

export const RGBColorSchema = z.tuple([z.number(), z.number(), z.number()]);
export const ColorSchema = z.union([
  RGBColorSchema,
  z.tuple([z.number(), z.number(), z.number(), z.number()])
]);
export const ColorRangeSchema = z.looseObject({
  name: z.string().optional(),
  type: z.string().optional(),
  category: z.string().optional(),
  colors: z.array(z.string()),
  reversed: z.boolean().optional(),
  colorMap: z
    .array(z.tuple([z.union([z.string(), z.number(), z.null(), z.array(z.string())]), z.string()]))
    .nullish(),
  colorLegends: z.record(z.string(), z.string()).optional()
});
export type ColorRange = z.infer<typeof ColorRangeSchema>;

export const FieldSchema = z.object({name: z.string(), type: z.string()});
export const NumberPairSchema = z.tuple([z.number(), z.number()]);
export const PositionSchema = z.union([
  NumberPairSchema,
  z.tuple([z.number(), z.number(), z.number()])
]);
export const ObjectSchema = z.record(z.string(), z.unknown());

// GeoJSON can contain GeometryCollections, foreign members and arbitrary properties.
export const GeometrySchema: z.ZodType<GeoJSON.Geometry> = z.lazy(() =>
  z.union([
    z.looseObject({type: z.literal('Point'), coordinates: z.array(z.number())}),
    z.looseObject({
      type: z.enum(['MultiPoint', 'LineString']),
      coordinates: z.array(z.array(z.number()))
    }),
    z.looseObject({
      type: z.enum(['MultiLineString', 'Polygon']),
      coordinates: z.array(z.array(z.array(z.number())))
    }),
    z.looseObject({
      type: z.literal('MultiPolygon'),
      coordinates: z.array(z.array(z.array(z.array(z.number()))))
    }),
    z.looseObject({type: z.literal('GeometryCollection'), geometries: z.array(GeometrySchema)})
  ])
);
export const FeatureSchema = z.looseObject({
  type: z.literal('Feature'),
  id: z.union([z.string(), z.number()]).optional(),
  properties: ObjectSchema.nullable(),
  geometry: GeometrySchema.nullable()
});
