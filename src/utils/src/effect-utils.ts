import {arrayMove} from '@dnd-kit/sortable';
import SunCalc from 'suncalc';

import {PostProcessEffect} from '@deck.gl/core/typed';

import {LIGHT_AND_SHADOW_EFFECT, LIGHT_AND_SHADOW_EFFECT_TIME_MODES} from '@kepler.gl/constants';
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

  const lightShadowEffect = effects.find(effect => effect.type === LIGHT_AND_SHADOW_EFFECT.type);
  if (lightShadowEffect) {
    const {timestamp, timeMode} = lightShadowEffect.config.params;

    if (timeMode === LIGHT_AND_SHADOW_EFFECT_TIME_MODES.current) {
      lightShadowEffect.deckEffect.directionalLights[0].timestamp = Date.now();
    } else if (timeMode === LIGHT_AND_SHADOW_EFFECT_TIME_MODES.animation) {
      // TODO: find an easy way to get current animation time
      const filter = visState.filters.find(filter => filter.fieldType === 'timestamp');
      if (filter) {
        lightShadowEffect.deckEffect.directionalLights[0].timestamp = filter.value?.[0] ?? 0;
      }
    }

    if (!isDaytime(mapState.latitude, mapState.longitude, timestamp)) {
      // TODO: interpolate for dusk/dawn
      // TODO: Should we avoid mutating the effect? (didn't work when tried defensive copying)
      lightShadowEffect.deckEffect.shadowColor[3] = 0;
    }
  }
  return effects.map(effect => effect.deckEffect);
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
