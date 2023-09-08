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

import {POSTPROCESSING_EFFECTS, DEFAULT_POST_PROCESSING_EFFECT_TYPE} from '@kepler.gl/constants';
import {EffectPropsPartial} from '@kepler.gl/types';

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

/**
 * Temp. Get custom default values from effect description
 */
const getDefaultValueForParameter = (name, effectDescription) => {
  const rec = effectDescription.filter(param => param.name === name);
  if (rec.length === 1) return rec[0].defaultValue;
  else if (rec.length === 2) return [rec[0].defaultValue, rec[1].defaultValue];
};

class PostProcessingEffect extends Effect {
  // deckEffect: PostProcessEffect | LightingEffect | null;

  constructor(props: EffectPropsPartial) {
    super(props);
  }

  _initializeEffect() {
    const effectDesc = POSTPROCESSING_EFFECTS_DESCS.find(desc => desc.type === this.type);
    if (effectDesc) {
      this.deckEffect = new DeckPostProcessEffect(effectDesc.class, this.parameters);

      const uniforms = this.deckEffect?.module?.uniforms;
      if (uniforms) {
        // get default parameters
        const keys = Object.keys(uniforms);
        const defaultParameters = {};
        keys.forEach(key => {
          defaultParameters[key] =
            getDefaultValueForParameter(key, this._uiConfig) ??
            uniforms[key].value ??
            uniforms[key];
        });
        this.parameters = {...defaultParameters, ...this.parameters};
        this.deckEffect?.setProps(this.parameters);
      }
    }
  }

  getDefaultProps(props: EffectPropsPartial = {}) {
    return super.getDefaultProps({type: DEFAULT_POST_PROCESSING_EFFECT_TYPE, ...props});
  }

  setProps(props: EffectPropsPartial) {
    super.setProps(props);

    // any uniform updated?
    if (props.parameters) {
      this.deckEffect?.setProps(this.parameters);
    }
  }
}

export default PostProcessingEffect;
