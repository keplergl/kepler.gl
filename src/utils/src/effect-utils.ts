// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {arrayMove} from '@dnd-kit/sortable';
import SunCalc from 'suncalc';
import cloneDeep from 'lodash.clonedeep';

import {PostProcessEffect} from '@deck.gl/core/typed';

import {
  LIGHT_AND_SHADOW_EFFECT,
  LIGHT_AND_SHADOW_EFFECT_TIME_MODES,
  FILTER_TYPES,
  FILTER_VIEW_TYPES
} from '@kepler.gl/constants';
import {VisState} from '@kepler.gl/schemas';
import {MapState, Effect, EffectProps, EffectDescription} from '@kepler.gl/types';
import {findById} from './utils';
import {clamp} from './data-utils';

export function computeDeckEffects({
  visState,
  mapState
}: {
  visState: VisState;
  mapState: MapState;
}): PostProcessEffect[] {
  // TODO: 1) deck effects per deck context 2) preserved between draws
  return visState.effectOrder
    .map(effectId => {
      const effect = findById(effectId)(visState.effects) as Effect | undefined;
      if (effect?.isEnabled && effect.deckEffect) {
        updateEffect({visState, mapState, effect});
        return effect.deckEffect;
      }
      return null;
    })
    .filter(effect => effect);
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
    let {timestamp} = effect.parameters;
    const {timeMode} = effect.parameters;
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
      sunLight.intensity = effect.parameters.sunLightIntensity;
    } else {
      effect.deckEffect.outputUniformShadow = true;
      sunLight.intensity = 0;
    }
  }
}

/**
 * Validates parameters for an effect, clamps numbers to allowed ranges
 * or applies default values in case of wrong non-numeric values.
 * All unknown properties aren't modified.
 * @param parameters Parameters candidate for an effect.
 * @param effectDescription Description of an effect.
 * @returns
 */
export function validateEffectParameters(
  parameters: EffectProps['parameters'] = {},
  effectDescription: EffectDescription['parameters']
): EffectProps['parameters'] {
  const result = cloneDeep(parameters);
  effectDescription.forEach(description => {
    const {defaultValue, name, type, min, max} = description;

    if (!Object.prototype.hasOwnProperty.call(result, name)) return;
    const property = result[name];

    if (type === 'color' || type === 'array') {
      if (!Array.isArray(defaultValue)) return;
      if (property.length !== defaultValue?.length) {
        result[name] = defaultValue;
        return;
      }
      defaultValue.forEach((v, i) => {
        let value = property[i];
        value = Number.isFinite(value) ? clamp([min, max], value) : defaultValue[i] ?? min;
        if (value !== undefined) {
          property[i] = value;
        }
      });
      return;
    }

    const value = Number.isFinite(property) ? clamp([min, max], property) : defaultValue ?? min;

    if (value !== undefined) {
      result[name] = value;
    }
  });
  return result;
}
