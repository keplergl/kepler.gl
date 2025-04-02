// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';

import {RGBColorSchema} from '../color';

export const EffectTypeSchema = z.enum([
  'brightnessContrast',
  'colorHalftone',
  'dotScreen',
  'edgeWork',
  'hexagonalPixelate',
  'hueSaturation',
  'ink',
  'lightAndShadow',
  'magnify',
  'noise',
  'sepia',
  'tiltShift',
  'triangleBlur',
  'vibrance',
  'vignette',
  'zoomBlur'
]);
export type EffectTypeSchema = z.infer<typeof EffectTypeSchema>;

const BaseEffectSchema = z.object({
  id: z.string().describe('The id of the effect'),
  type: EffectTypeSchema.describe('The type of the effect'),
  isEnabled: z.boolean().default(true).describe('Whether the effect is enabled')
});
type BaseEffectSchema = z.infer<typeof BaseEffectSchema>;

const CenterPoint = z
  .tuple([z.number().min(0).max(1), z.number().min(0).max(1)])
  .default([0.5, 0.5])
  .describe('The center point of the effect');

const BaseLightAndShadowEffectParameters = z.object({
  shadowIntensity: z.number().describe('The intensity of the shadow'),
  shadowColor: RGBColorSchema.describe('The color of the shadow'),
  sunLightColor: RGBColorSchema.describe('The color of the sun light'),
  sunLightIntensity: z.number().describe('The intensity of the sun light'),
  ambientLightColor: RGBColorSchema.describe('The color of the ambient light'),
  ambientLightIntensity: z.number().describe('The intensity of the ambient light'),
  timeMode: z
    .enum(['pick', 'current', 'animation'])
    .default('pick')
    .describe(
      'Whether to use the selected time, the current time, or the animation time for the sun position'
    )
});

export const LightAndShadowEffectSchema = BaseEffectSchema.extend({
  type: z.literal(EffectTypeSchema.enum.lightAndShadow).describe('The type of the effect'),
  parameters: z.discriminatedUnion('timeMode', [
    BaseLightAndShadowEffectParameters.extend({
      timeMode: z.literal('pick'),
      timestamp: z.number().describe('The timestamp to use for the sun position'),
      timezone: z.string().default('UTC').describe('The time zone to use')
    }),
    BaseLightAndShadowEffectParameters.extend({
      timeMode: z.literal('current')
    }),
    BaseLightAndShadowEffectParameters.extend({
      timeMode: z.literal('animation')
    })
  ])
});
export type LightAndShadowEffectSchema = z.infer<typeof LightAndShadowEffectSchema>;

export const NoiseEffectSchema = BaseEffectSchema.extend({
  type: z.literal(EffectTypeSchema.enum.noise).describe('The type of the effect'),
  parameters: z.object({
    amount: z.number().min(0).max(1).default(0.5).describe('The amount of noise to apply.')
  })
});
export type NoiseEffectSchema = z.infer<typeof NoiseEffectSchema>;

export const HexagonalPixelateEffectSchema = BaseEffectSchema.extend({
  type: z.literal(EffectTypeSchema.enum.hexagonalPixelate).describe('The type of the effect'),
  parameters: z.object({
    center: CenterPoint,
    scale: z.number().min(0).max(50).default(10).describe('The scale (size) of the hexagons')
  })
});
export type HexagonalPixelateEffectSchema = z.infer<typeof HexagonalPixelateEffectSchema>;

export const InkEffectSchema = BaseEffectSchema.extend({
  type: z.literal(EffectTypeSchema.enum.ink).describe('The type of the effect'),
  parameters: z.object({
    strength: z.number().min(0).max(1).default(0.5).describe('The strength of the effect')
  })
});
export type InkEffectSchema = z.infer<typeof InkEffectSchema>;

export const DotScreenEffectSchema = BaseEffectSchema.extend({
  type: z.literal(EffectTypeSchema.enum.dotScreen).describe('The type of the effect'),
  parameters: z.object({
    center: CenterPoint,
    angle: z
      .number()
      .min(0)
      .max(Math.PI / 2)
      .default(1.1)
      .describe('The rotation angle of the grid'),
    size: z.number().min(0).max(100).default(3).describe('The size of the dots.')
  })
});
export type DotScreenEffectSchema = z.infer<typeof DotScreenEffectSchema>;

export const SepiaEffectSchema = BaseEffectSchema.extend({
  type: z.literal(EffectTypeSchema.enum.sepia).describe('The type of the effect'),
  parameters: z.object({
    amount: z.number().min(0).max(1).default(0.5).describe('The amount of the effect')
  })
});
export type SepiaEffectSchema = z.infer<typeof SepiaEffectSchema>;

export const VibranceEffectSchema = BaseEffectSchema.extend({
  type: z.literal(EffectTypeSchema.enum.vibrance).describe('The type of the effect'),
  parameters: z.object({
    amount: z.number().min(-1).max(1).default(0).describe('The amount of the effect')
  })
});
export type VibranceEffectSchema = z.infer<typeof VibranceEffectSchema>;

export const HueSaturationEffectSchema = BaseEffectSchema.extend({
  type: z.literal(EffectTypeSchema.enum.hueSaturation).describe('The type of the effect'),
  parameters: z.object({
    hue: z.number().min(-1).max(1).default(0).describe('The hue of the effect'),
    saturation: z.number().min(-1).max(1).default(0).describe('The saturation of the effect')
  })
});
export type HueSaturationEffectSchema = z.infer<typeof HueSaturationEffectSchema>;

export const BrightnessContrastEffectSchema = BaseEffectSchema.extend({
  type: z.literal(EffectTypeSchema.enum.brightnessContrast).describe('The type of the effect'),
  parameters: z.object({
    brightness: z.number().min(-1).max(1).default(0).describe('The brightness of the effect'),
    contrast: z.number().min(-1).max(1).default(0).describe('The contrast of the effect')
  })
});
export type BrightnessContrastEffectSchema = z.infer<typeof BrightnessContrastEffectSchema>;

export const ColorHalftoneEffectSchema = BaseEffectSchema.extend({
  type: z.literal(EffectTypeSchema.enum.colorHalftone).describe('The type of the effect'),
  parameters: z.object({
    center: CenterPoint,
    angle: z
      .number()
      .min(0)
      .max(Math.PI / 2)
      .default(1.1)
      .describe('The rotation angle of the grid'),
    size: z.number().min(0).max(100).default(4)
  })
});
export type ColorHalftoneEffectSchema = z.infer<typeof ColorHalftoneEffectSchema>;

export const TriangleBlurEffectSchema = BaseEffectSchema.extend({
  type: z.literal(EffectTypeSchema.enum.triangleBlur).describe('The type of the effect'),
  parameters: z.object({
    radius: z.number().min(0).max(100).default(20).describe('The radius of the blur'),
    delta: z
      .tuple([z.number().min(0).max(1), z.number().min(0).max(1)])
      .default([1, 0])
      .describe('The direction of the blur')
  })
});
export type TriangleBlurEffectSchema = z.infer<typeof TriangleBlurEffectSchema>;

export const ZoomBlurEffectSchema = BaseEffectSchema.extend({
  type: z.literal(EffectTypeSchema.enum.zoomBlur).describe('The type of the effect'),
  parameters: z.object({
    center: CenterPoint,
    strength: z.number().min(0).max(1).default(0.5).describe('The strength of the effect')
  })
});
export type ZoomBlurEffectSchema = z.infer<typeof ZoomBlurEffectSchema>;

export const TiltShiftEffectSchema = BaseEffectSchema.extend({
  type: z.literal(EffectTypeSchema.enum.tiltShift).describe('The type of the effect'),
  parameters: z.object({
    blurRadius: z.number().min(0).max(50).default(20).describe('The radius of the blur'),
    gradientRadius: z.number().min(0).max(400).default(20).describe('The radius of the gradient'),
    start: z
      .tuple([z.number().min(0).max(1), z.number().min(0).max(1)])
      .default([0, 0])
      .describe('The start of the gradient'),
    end: z
      .tuple([z.number().min(0).max(1), z.number().min(0).max(1)])
      .default([1, 1])
      .describe('The end of the gradient'),
    invert: z.boolean().default(false).describe('Whether to invert the gradient')
  })
});
export type TiltShiftEffectSchema = z.infer<typeof TiltShiftEffectSchema>;

export const EdgeWorkEffectSchema = BaseEffectSchema.extend({
  type: z.literal(EffectTypeSchema.enum.edgeWork).describe('The type of the effect'),
  parameters: z.object({
    radius: z.number().min(0).max(100).default(2).describe('The radius of the blur'),
    delta: z
      .tuple([z.number().min(0).max(1), z.number().min(0).max(1)])
      .default([1, 0])
      .describe('The direction of the blur')
  })
});
export type EdgeWorkEffectSchema = z.infer<typeof EdgeWorkEffectSchema>;

export const VignetteEffectSchema = BaseEffectSchema.extend({
  type: z.literal(EffectTypeSchema.enum.vignette).describe('The type of the effect'),
  parameters: z.object({
    radius: z.number().min(0).max(1).default(0.5).describe('The radius of the vignette'),
    amount: z.number().min(0).max(1).default(0.5).describe('The amount of vignette to apply')
  })
});
export type VignetteEffectSchema = z.infer<typeof VignetteEffectSchema>;

export const MagnifyEffectSchema = BaseEffectSchema.extend({
  type: z.literal(EffectTypeSchema.enum.magnify).describe('The type of the effect'),
  parameters: z.object({
    screenXY: z
      .tuple([z.number().min(0).max(1), z.number().min(0).max(1)])
      .default([0.5, 0.5])
      .describe('The screen position of the magnifier'),
    radiusPixels: z
      .number()
      .min(0)
      .max(500)
      .default(200)
      .describe('The radius of the magnify effect'),
    zoom: z.number().min(0).max(500).default(2).describe('The zoom level of the magnify effect'),
    borderWidthPixels: z.number().min(0).default(0).describe('The width of the border'),
    borderColor: RGBColorSchema.default([255, 255, 255, 255]).describe('The color of the border')
  })
});
export type MagnifyEffectSchema = z.infer<typeof MagnifyEffectSchema>;

export const EffectSchema = z.preprocess((effect: any) => {
  let nextEffect = effect;

  // Old beta effect configs have different layouts
  if (effect?.config) {
    // properly transform useCurrentTime to timeMode
    let nextParams = effect.config.params;
    if (nextParams && effect.config.type === 'lightAndShadow') {
      nextParams = {
        ...nextParams,
        ...(nextParams.useCurrentTime
          ? {timeMode: 'current'}
          : {
              timeMode: 'pick',
              timestamp: nextParams.timestamp ?? Date.now()
            })
      };
    }

    // flatten config
    nextEffect = {
      id: effect.id,
      type: effect.config.type,
      isEnabled: effect.config.isEnabled,
      parameters: nextParams
    };
  }

  return nextEffect;
}, z.discriminatedUnion('type', [BrightnessContrastEffectSchema, ColorHalftoneEffectSchema, DotScreenEffectSchema, EdgeWorkEffectSchema, HexagonalPixelateEffectSchema, HueSaturationEffectSchema, InkEffectSchema, LightAndShadowEffectSchema, MagnifyEffectSchema, NoiseEffectSchema, SepiaEffectSchema, TiltShiftEffectSchema, TriangleBlurEffectSchema, VibranceEffectSchema, VignetteEffectSchema, ZoomBlurEffectSchema]));
export type EffectSchema = z.infer<typeof EffectSchema>;
