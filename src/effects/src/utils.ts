import {Effect as EffectInterface, EffectParamsPartial} from '@kepler.gl/types';
import {LIGHT_AND_SHADOW_EFFECT} from '@kepler.gl/constants';

import LightingEffect from './lighting-effect';
import PostProcessEffect from './post-processing-effect';

export function createDeckEffectFromConfig(params: Partial<EffectParamsPartial>): EffectInterface {
  if (params?.config?.type === LIGHT_AND_SHADOW_EFFECT.type) {
    return new LightingEffect(params);
  } else {
    return new PostProcessEffect(params);
  }
}
