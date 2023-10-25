import {arrayMove} from '@dnd-kit/sortable';
import SunCalc from 'suncalc';

import {PostProcessEffect} from '@deck.gl/core/typed';

import {
  LIGHT_AND_SHADOW_EFFECT,
  LIGHT_AND_SHADOW_EFFECT_TIME_MODES,
  FILTER_TYPES,
  FILTER_VIEW_TYPES
} from '@kepler.gl/constants';
import {findById} from './utils';
import {VisState} from '@kepler.gl/schemas';
import {MapState, Effect} from '@kepler.gl/types';

export function computeDeckEffects({
  visState,
  mapState
}: {
  visState: VisState;
  mapState: MapState;
}): PostProcessEffect[] {
  // TODO: 1) deck effects per deck context 2) preserved between draws
  let effects = visState.effectOrder
    .map(effectId => {
      return findById(effectId)(visState.effects);
    })
    .filter(effect => Boolean(effect && effect.config.isEnabled && effect.deckEffect)) as Effect[];

  return effects.map(effect => {
    updateEffect({visState, mapState, effect});
    return effect.deckEffect;
  });
}

/**
 * Always keep light & shadow effect at the top
 */
export const fixEffectOrder = (effects: Effect[], effectOrder: string[]): string[] => {
  const lightShadowEffect = effects.find(effect => effect.type === LIGHT_AND_SHADOW_EFFECT.type);
  if (lightShadowEffect) {
    const ind = effectOrder.indexOf(lightShadowEffect.id);
    if (ind > 0) {
      effectOrder.splice(ind, 1);
      effectOrder.unshift(lightShadowEffect.id);
    }
  }
  return effectOrder;
};

export function reorderEffectOrder(
  effectOrder: string[],
  originEffectId: string,
  destinationEffectId: string
): string[] {
  const activeIndex = effectOrder.indexOf(originEffectId);
  const overIndex = effectOrder.indexOf(destinationEffectId);
  return arrayMove(effectOrder, activeIndex, overIndex);
}

/**
 * Check if the current time is daytime at the given location
 * @param {number} lat Latitude
 * @param {number} lon Longitude
 * @param {number} timestamp Milliseconds since the Unix Epoch
 * @returns boolean
 */
function isDaytime(lat, lon, timestamp) {
  const date = new Date(timestamp);
  const {sunrise, sunset} = SunCalc.getTimes(date, lat, lon);
  return date >= sunrise && date <= sunset;
}

/**
 * Update effect to match latest vis and map states
 */
function updateEffect({visState, mapState, effect}) {
  if (effect.type === LIGHT_AND_SHADOW_EFFECT.type) {
    let {timestamp, timeMode} = effect.config.params;
    const sunLight = effect.deckEffect.directionalLights[0];

    // set timestamp for shadow
    if (timeMode === LIGHT_AND_SHADOW_EFFECT_TIME_MODES.current) {
      timestamp = Date.now();
      sunLight.timestamp = timestamp;
    } else if (timeMode === LIGHT_AND_SHADOW_EFFECT_TIME_MODES.animation) {
      timestamp = visState.animationConfig.currentTime ?? 0;
      if (!timestamp) {
        const filter = visState.filters.find(
          filter =>
            filter.type === FILTER_TYPES.timeRange &&
            (filter.view === FILTER_VIEW_TYPES.enlarged || filter.syncedWithLayerTimeline)
        );
        if (filter) {
          timestamp = filter.value?.[0] ?? 0;
        }
      }
      sunLight.timestamp = timestamp;
    }

    // output uniform shadow during nighttime
    if (isDaytime(mapState.latitude, mapState.longitude, timestamp)) {
      effect.deckEffect.outputUniformShadow = false;
      sunLight.intensity = effect.config.params.sunLightIntensity;
    } else {
      effect.deckEffect.outputUniformShadow = true;
      sunLight.intensity = 0;
    }
  }
}
