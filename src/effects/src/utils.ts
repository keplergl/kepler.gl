// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Effect as EffectInterface, EffectPropsPartial} from '@kepler.gl/types';
import {
  LIGHT_AND_SHADOW_EFFECT,
  DISTANCE_FOG_TYPE,
  SURFACE_FOG_TYPE,
  WATER_SIMULATION_TYPE
} from '@kepler.gl/constants';

import LightingEffect from './lighting-effect';
import PostProcessEffect from './post-processing-effect';
import DistanceFogEffect from './distance-fog-effect';
import SurfaceFogEffect from './surface-fog-effect';
import WaterSimulationEffect from './water-simulation-effect';

export function createEffect(params: EffectPropsPartial): EffectInterface {
  if (params?.type === LIGHT_AND_SHADOW_EFFECT.type) {
    return new LightingEffect(params);
  }
  if (params?.type === DISTANCE_FOG_TYPE) {
    return new DistanceFogEffect(params);
  }
  if (params?.type === SURFACE_FOG_TYPE) {
    return new SurfaceFogEffect(params);
  }
  if (params?.type === WATER_SIMULATION_TYPE) {
    return new WaterSimulationEffect(params);
  }
  return new PostProcessEffect(params);
}
