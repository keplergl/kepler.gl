import {PostProcessEffect as DeckPostProcessEffect} from '@deck.gl/core';
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

import {
  POSTPROCESSING_EFFECTS,
  EFFECT_DESCS,
  DEFAULT_POST_PROCESSING_EFFECT_TYPE
} from '@kepler.gl/constants';
import {EffectConfig, EffectParamsPartial} from '@kepler.gl/types';

import Effect from './effect';

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

class PostProcessingEffect extends Effect {
  // deckEffect: PostProcessEffect | LightingEffect | null;

  constructor(props: EffectParamsPartial) {
    super(props);
  }

  _initializeEffect() {
    const effectDesc = POSTPROCESSING_EFFECTS_DESCS.find(desc => desc.type === this.config.type);
    if (effectDesc) {
      this.deckEffect = new DeckPostProcessEffect(effectDesc.class, this.config.params);

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

  _getDefaultEffectConfig(config: Partial<EffectConfig> = {}) {
    const type = config.type || DEFAULT_POST_PROCESSING_EFFECT_TYPE;
    return {
      type,
      name: config.name || EFFECT_DESCS.find(desc => desc.type === type)?.name || 'Effect',
      isEnabled: config.isEnabled ?? true,
      isConfigActive: config.isConfigActive ?? true,
      params: {...(config.params || {})}
    };
  }

  updateConfig(config: Partial<EffectConfig>) {
    super.updateConfig(config);

    // any uniform updated?
    if (config.params) {
      this.deckEffect?.setProps(this.config.params);
    }
  }
}

export default PostProcessingEffect;
