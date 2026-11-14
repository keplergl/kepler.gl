// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';
import {ColorSchema, NumberPairSchema, ObjectSchema} from './common';

export const EffectFieldsSchema = z.object({
  id: z.string(),
  type: z.string(),
  isEnabled: z.boolean().optional(),
  parameters: ObjectSchema
});
function effect<Type extends string, Parameters extends z.ZodRawShape>(
  type: Type,
  parameters: Parameters
) {
  return EffectFieldsSchema.extend({
    type: z.literal(type),
    parameters: z.looseObject(parameters).partial()
  });
}
export const LightAndShadowEffectSchema = effect('lightAndShadow', {
  shadowIntensity: z.number(),
  shadowColor: ColorSchema,
  sunLightColor: ColorSchema,
  sunLightIntensity: z.number(),
  ambientLightColor: ColorSchema,
  ambientLightIntensity: z.number(),
  timeMode: z.enum(['pick', 'current', 'animation']),
  timestamp: z.number(),
  timezone: z.string()
});
export const BrightnessContrastEffectSchema = effect('brightnessContrast', {
  brightness: z.number(),
  contrast: z.number()
});
export const ColorHalftoneEffectSchema = effect('colorHalftone', {
  center: NumberPairSchema,
  angle: z.number(),
  size: z.number()
});
export const DotScreenEffectSchema = effect('dotScreen', {
  center: NumberPairSchema,
  angle: z.number(),
  size: z.number()
});
export const EdgeWorkEffectSchema = effect('edgeWork', {
  radius: z.number(),
  delta: NumberPairSchema
});
export const HexagonalPixelateEffectSchema = effect('hexagonalPixelate', {
  center: NumberPairSchema,
  scale: z.number()
});
export const HueSaturationEffectSchema = effect('hueSaturation', {
  hue: z.number(),
  saturation: z.number()
});
export const InkEffectSchema = effect('ink', {strength: z.number()});
export const MagnifyEffectSchema = effect('magnify', {
  screenXY: NumberPairSchema,
  radiusPixels: z.number(),
  zoom: z.number(),
  borderWidthPixels: z.number(),
  borderColor: ColorSchema
});
export const NoiseEffectSchema = effect('noise', {amount: z.number()});
export const SepiaEffectSchema = effect('sepia', {amount: z.number()});
export const TiltShiftEffectSchema = effect('tiltShift', {
  blurRadius: z.number(),
  gradientRadius: z.number(),
  start: NumberPairSchema,
  end: NumberPairSchema,
  invert: z.union([z.boolean(), z.number()])
});
export const TriangleBlurEffectSchema = effect('triangleBlur', {
  radius: z.number(),
  delta: NumberPairSchema
});
export const VibranceEffectSchema = effect('vibrance', {amount: z.number()});
export const VignetteEffectSchema = effect('vignette', {radius: z.number(), amount: z.number()});
export const ZoomBlurEffectSchema = effect('zoomBlur', {
  center: NumberPairSchema,
  strength: z.number()
});
export const DistanceFogEffectSchema = effect('distanceFog', {
  density: z.number(),
  fogStart: z.number(),
  fogRange: z.number(),
  fogColor: ColorSchema
});
export const SurfaceFogEffectSchema = effect('surfaceFog', {
  density: z.number(),
  height: z.number(),
  animateHeight: z.boolean(),
  heightEnd: z.number(),
  linearEasing: z.boolean(),
  thickness: z.number(),
  fogColor: ColorSchema,
  pattern: z.boolean()
});
export const BuiltInEffectSchemas = {
  lightAndShadow: LightAndShadowEffectSchema,
  brightnessContrast: BrightnessContrastEffectSchema,
  colorHalftone: ColorHalftoneEffectSchema,
  dotScreen: DotScreenEffectSchema,
  edgeWork: EdgeWorkEffectSchema,
  hexagonalPixelate: HexagonalPixelateEffectSchema,
  hueSaturation: HueSaturationEffectSchema,
  ink: InkEffectSchema,
  magnify: MagnifyEffectSchema,
  noise: NoiseEffectSchema,
  sepia: SepiaEffectSchema,
  tiltShift: TiltShiftEffectSchema,
  triangleBlur: TriangleBlurEffectSchema,
  vibrance: VibranceEffectSchema,
  vignette: VignetteEffectSchema,
  zoomBlur: ZoomBlurEffectSchema,
  distanceFog: DistanceFogEffectSchema,
  surfaceFog: SurfaceFogEffectSchema
};
export const BuiltInEffectSchema = z.discriminatedUnion('type', [
  LightAndShadowEffectSchema,
  BrightnessContrastEffectSchema,
  ColorHalftoneEffectSchema,
  DotScreenEffectSchema,
  EdgeWorkEffectSchema,
  HexagonalPixelateEffectSchema,
  HueSaturationEffectSchema,
  InkEffectSchema,
  MagnifyEffectSchema,
  NoiseEffectSchema,
  SepiaEffectSchema,
  TiltShiftEffectSchema,
  TriangleBlurEffectSchema,
  VibranceEffectSchema,
  VignetteEffectSchema,
  ZoomBlurEffectSchema,
  DistanceFogEffectSchema,
  SurfaceFogEffectSchema
]);
export const EffectSchema = z.union([
  BuiltInEffectSchema,
  EffectFieldsSchema.extend({
    type: z
      .string()
      .refine(type => !Object.prototype.hasOwnProperty.call(BuiltInEffectSchemas, type))
  })
]);
export type Effect = z.infer<typeof EffectSchema>;
