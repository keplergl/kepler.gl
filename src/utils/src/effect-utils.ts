import {arrayMove} from '@dnd-kit/sortable';
import SunCalc from 'suncalc';

import {PostProcessEffect} from '@deck.gl/core/typed';

import {LIGHT_AND_SHADOW_EFFECT} from '@kepler.gl/constants';
import {findById} from './utils';
import {VisState} from '@kepler.gl/schemas';
import {MapState, EffectParams, Effect} from '@kepler.gl/types';

export function computeDeckEffects({
  visState,
  mapState
}: {
  visState: VisState;
  mapState: MapState;
}): PostProcessEffect[] {
  let effects = visState.effectOrder
    .map(effectId => {
      return findById(effectId)(visState.effects);
    })
    .filter(effect => Boolean(effect && effect.config.isEnabled && effect.deckEffect)) as Effect[];

  const lightShadowEffect = effects.find(effect => effect.type === LIGHT_AND_SHADOW_EFFECT.type);
  if (lightShadowEffect) {
    const {timestamp} = lightShadowEffect.config.params;
    if (!isDaytime(mapState.latitude, mapState.longitude, timestamp)) {
      // TODO: interpolate for dusk/dawn
      // TODO: Should we avoid mutating the effect? (didn't work when tried defensive copying)
      lightShadowEffect.deckEffect.shadowColor[3] = 0;
    }
  }
  return effects.map(effect => effect.deckEffect);
}

export function mergeEffectParams(
  params: Partial<EffectParams>,
  extraParams: Partial<EffectParams>
): Partial<EffectParams> {
  const p1 = params || {};
  const p2 = extraParams || {};
  return {
    ...p1,
    ...p2,
    // @ts-expect-error
    config: {
      ...(p1.config || {}),
      ...(p2.config || {})
    }
  };
}

/**
 * Always keep light & shadow effect at the top
 */
export const fixEffectOrder = (
  effects: Effect[],
  effectOrder: VisState['effectOrder']
): VisState['effectOrder'] => {
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
  effectOrder: VisState['effectOrder'],
  originEffectId: string,
  destinationEffectId: string
): VisState['effectOrder'] {
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
