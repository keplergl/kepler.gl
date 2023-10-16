import {
  PostProcessEffect,
  LightingEffect,
  AmbientLight,
  _SunLight as SunLight
} from '@deck.gl/core';
import {
  brightnessContrast,
  ink,
  triangleBlur,
  hueSaturation,
  vibrance,
  colorHalftone,
  dotScreen,
  edgeWork,
  noise,
  sepia,
  tiltShift,
  vignette,
  zoomBlur,
  magnify,
  hexagonalPixelate
} from '@luma.gl/shadertools';

import {generateHashId} from '@kepler.gl/utils';
import {
  LIGHT_AND_SHADOW_EFFECT,
  POSTPROCESSING_EFFECTS,
  EFFECT_DESCS,
  DEFAULT_LIGHT_AND_SHADOW_PROPS,
  DEFAULT_EFFECT_TYPE
} from '@kepler.gl/constants';
import {Effect as EffectInterface, EffectConfig, EffectParamsPartial} from '@kepler.gl/types';

const LIGHT_AND_SHADOW_EFFECT_DESC: {
  type: string;
  name: string;
  class: null;
} = {
  ...LIGHT_AND_SHADOW_EFFECT,
  class: null
};

const POSTPROCESSING_EFFECTS_DESCS = [
  {
    ...POSTPROCESSING_EFFECTS.ink,
    class: ink
  },
  {
    ...POSTPROCESSING_EFFECTS.brightnessContrast,
    class: brightnessContrast
  },
  {
    ...POSTPROCESSING_EFFECTS.hueSaturation,
    class: hueSaturation
  },
  {
    ...POSTPROCESSING_EFFECTS.vibrance,
    class: vibrance
  },
  {
    ...POSTPROCESSING_EFFECTS.sepia,
    class: sepia
  },
  {
    ...POSTPROCESSING_EFFECTS.dotScreen,
    class: dotScreen
  },
  {
    ...POSTPROCESSING_EFFECTS.colorHalftone,
    class: colorHalftone
  },
  {
    ...POSTPROCESSING_EFFECTS.noise,
    class: noise
  },
  {
    ...POSTPROCESSING_EFFECTS.triangleBlur,
    class: triangleBlur
  },
  {
    ...POSTPROCESSING_EFFECTS.zoomBlur,
    class: zoomBlur
  },
  {
    ...POSTPROCESSING_EFFECTS.tiltShift,
    class: tiltShift
  },
  {
    ...POSTPROCESSING_EFFECTS.edgeWork,
    class: edgeWork
  },
  {
    ...POSTPROCESSING_EFFECTS.vignette,
    class: vignette
  },
  {
    ...POSTPROCESSING_EFFECTS.magnify,
    class: magnify
  },
  {
    ...POSTPROCESSING_EFFECTS.hexagonalPixelate,
    class: hexagonalPixelate
  }
];

export function createDeckEffectFromConfig(params: Partial<EffectParamsPartial>): EffectInterface {
  return new Effect(params);
}

export class Effect implements EffectInterface {
  id: string;
  config: EffectConfig;
  deckEffect: PostProcessEffect | LightingEffect | null;

  constructor(props: EffectParamsPartial = {}) {
    this.id = props.id || `e_${generateHashId(6)}`;
    this.config = this.getDefaultEffectConfig(props.config);
    this.deckEffect = null;

    // TODO move to a separate class
    // Special case for shadow effect
    if (this.config.type === LIGHT_AND_SHADOW_EFFECT_DESC.type) {
      this._initializeLightAndShadowEffect();
    } else {
      this._initializePostProcessingEffect();
    }
  }

  _initializePostProcessingEffect() {
    // All other effects are PostProcessEffects
    const effectDesc = POSTPROCESSING_EFFECTS_DESCS.find(desc => desc.type === this.config.type);
    if (effectDesc) {
      this.deckEffect = new PostProcessEffect(effectDesc.class, this.config.params);

      // @ts-expect-error
      const uniforms = this.deckEffect?.module?.uniforms;
      if (uniforms) {
        // get default params
        const keys = Object.keys(uniforms);
        const defaultParams = {};
        keys.forEach(key => {
          defaultParams[key] = uniforms[key].value ?? uniforms[key];
        });
        this.config.params = {...defaultParams, ...this.config.params};
      }
    }
  }

  _initializeLightAndShadowEffect() {
    this.config.params = {...DEFAULT_LIGHT_AND_SHADOW_PROPS, ...this.config.params};

    const ambientLight = new AmbientLight({
      color: this.config.params.ambientLightColor,
      intensity: this.config.params.ambientLightIntensity
    });

    const sunLight = new SunLight({
      timestamp: this.config.params.timestamp,
      color: this.config.params.sunLightColor,
      intensity: this.config.params.sunLightIntensity,
      _shadow: true
    });

    this.deckEffect = new LightingEffect({
      ambientLight,
      sunLight
    });
    if (this.deckEffect) {
      // @ts-expect-error
      this.deckEffect.shadowColor[3] = this.config.params.shadowIntensity;
    }
  }

  getDefaultEffectConfig(config: Partial<EffectConfig> = {}) {
    const type = config.type || DEFAULT_EFFECT_TYPE;
    return {
      type,
      name: config.name || EFFECT_DESCS.find(desc => desc.type === type)?.name || 'Effect',
      isEnabled: config.isEnabled ?? true,
      isConfigActive: config.isConfigActive ?? true,
      params: {...(config.params || {})}
    };
  }

  updateConfig(config: Partial<EffectConfig>) {
    this.config = {
      ...this.config,
      ...config,
      params: {...this.config.params, ...(config.params || {})}
    };

    // any uniform updated?
    if (config.params) {
      const {params} = this.config;

      if (this.config.type === LIGHT_AND_SHADOW_EFFECT_DESC.type) {
        const effect = this.deckEffect as LightingEffect;
        if (effect) {
          // @ts-expect-error not typed
          effect.shadowColor[3] = params.shadowIntensity;
          // @ts-expect-error not typed
          effect.ambientLight.intensity = params.ambientLightIntensity;
          // @ts-expect-error not typed
          effect.ambientLight.color = params.ambientLightColor.slice();

          // @ts-expect-error not typed
          const sunLight = effect.directionalLights[0];
          if (sunLight) {
            sunLight.intensity = params.sunLightIntensity;
            sunLight.color = params.sunLightColor.slice();
            sunLight.timestamp = params.timestamp;
          }
        }
      } else {
        // @ts-expect-error not typed
        this.deckEffect?.setProps(params);
      }
    }
  }

  isValidToSave() {
    return Boolean(this.config.type && this.id && this.deckEffect);
  }

  get type() {
    return this.config.type;
  }
}

export default Effect;
