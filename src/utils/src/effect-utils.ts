// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import SunCalc from 'suncalc';
import cloneDeep from 'lodash/cloneDeep';

import type {Effect as DeckEffect} from '@deck.gl/core';

import {
  LIGHT_AND_SHADOW_EFFECT,
  LIGHT_AND_SHADOW_EFFECT_TIME_MODES,
  FILTER_TYPES,
  FILTER_VIEW_TYPES,
  DISTANCE_FOG_TYPE,
  SURFACE_FOG_TYPE
} from '@kepler.gl/constants';
import {arrayMove} from '@kepler.gl/common-utils';
import {MapState, Effect, EffectProps, EffectDescription} from '@kepler.gl/types';
import {findById} from './utils';
import {clamp} from './data-utils';
import {normalizeColor} from './color-utils';

// TODO isolate types - depends on @kepler.gl/schemas
type VisState = any;

// Retains the last LightingEffect deckEffect so we can keep it in the
// effects array (with shadows disabled) after the user removes the
// Light & Shadow effect from the UI. Without this, deck.gl calls
// cleanup() which removes the shadow shader module, but existing layer
// models still have shadow_uShadowMap bindings → texture errors.
let _lastLightingDeckEffect: any = null;

export function computeDeckEffects({
  visState,
  mapState,
  isExport
}: {
  visState: VisState;
  mapState: MapState;
  isExport?: boolean;
}): DeckEffect[] {
  // TODO: 1) deck effects per deck context 2) preserved between draws
  let hasLightingShadow = false;

  const deckEffects = visState.effectOrder
    .map(effectId => {
      const effect = findById(effectId)(visState.effects) as Effect | undefined;
      if (effect?.deckEffect) {
        if (effect.isEnabled) {
          // deck.gl's EffectManager matches effects by id and reuses old
          // instances (calling oldEffect.setProps(newEffect.props)) instead
          // of replacing them. When a lighting effect is removed and
          // re-added, the cached _lastLightingDeckEffect is the instance
          // that deck.gl will actually render with. Adopt it so that
          // parameter syncing in updateEffect targets the right object.
          if (
            !isExport &&
            effect.type === LIGHT_AND_SHADOW_EFFECT.type &&
            _lastLightingDeckEffect &&
            _lastLightingDeckEffect !== effect.deckEffect
          ) {
            effect.deckEffect = _lastLightingDeckEffect;
          }
          updateEffect({visState, mapState, effect});
        } else if (effect.type === LIGHT_AND_SHADOW_EFFECT.type) {
          // Keep lighting effects in the array even when disabled to avoid
          // removing the shadow shader module. Composite layer sublayers
          // don't regenerate models when default shader modules change,
          // leaving stale pipelines with shadow_uShadowMap bindings.
          // Disabling shadow on the lights avoids visual effects.
          disableLightingEffect(effect);
        }
        if (effect.isEnabled || effect.type === LIGHT_AND_SHADOW_EFFECT.type) {
          if (effect.type === LIGHT_AND_SHADOW_EFFECT.type) {
            hasLightingShadow = true;
            if (!isExport) {
              _lastLightingDeckEffect = effect.deckEffect;
            }
            if (effect.deckEffect) {
              effect.deckEffect.isExportMode = Boolean(isExport);
            }
          }
          return effect.deckEffect;
        }
      }
      return null;
    })
    .filter(effect => effect);

  if (!hasLightingShadow && _lastLightingDeckEffect) {
    disableDeckLightingEffect(_lastLightingDeckEffect);
    deckEffects.unshift(_lastLightingDeckEffect);
  }

  return deckEffects;
}

/**
 * Always keep light & shadow effect at the top, then distance fog and
 * surface fog right after it (before other post-processing effects).
 * Both fog effects read the depth buffer from renderBuffers[0];
 * subsequent effects clear depth during their render passes, so fog
 * must run before that happens.
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

  const distanceFogEffect = effects.find(effect => effect.type === DISTANCE_FOG_TYPE);
  if (distanceFogEffect) {
    const ind = effectOrder.indexOf(distanceFogEffect.id);
    const targetPos = lightShadowEffect ? 1 : 0;
    if (ind > targetPos) {
      effectOrder.splice(ind, 1);
      effectOrder.splice(targetPos, 0, distanceFogEffect.id);
    }
  }

  const surfaceFogEffect = effects.find(effect => effect.type === SURFACE_FOG_TYPE);
  if (surfaceFogEffect) {
    const ind = effectOrder.indexOf(surfaceFogEffect.id);
    let targetPos = 0;
    if (lightShadowEffect) targetPos++;
    if (distanceFogEffect) targetPos++;
    if (ind > targetPos) {
      effectOrder.splice(ind, 1);
      effectOrder.splice(targetPos, 0, surfaceFogEffect.id);
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
 * Disable shadow rendering on a lighting effect without removing it.
 * This keeps the shadow shader module registered and prevents stale
 * texture binding errors in composite layer sublayers.
 */
function disableLightingEffect(effect: Effect) {
  const deckEffect = effect.deckEffect;
  if (!deckEffect) return;
  disableDeckLightingEffect(deckEffect);
}

/**
 * Disable shadow rendering directly on a deck.gl LightingEffect instance.
 */
function disableDeckLightingEffect(deckEffect: any) {
  deckEffect.shadow = false;
  deckEffect.outputUniformShadow = false;
  for (const light of deckEffect.directionalLights || []) {
    light.shadow = false;
  }
}

/**
 * Update effect to match latest vis and map states.
 *
 * deck.gl's EffectManager compares effects by `id` and reuses the
 * existing (old) instance when a new one with the same id is supplied
 * (calling `oldEffect.setProps(newEffect.props)` instead of replacing).
 * LightingEffect.setProps only updates light sources, not shadowColor.
 * So we must sync ALL parameters here every frame to ensure the deck
 * effect always reflects the kepler-side state — even if deck.gl
 * silently swapped the instance under us.
 */
function updateEffect({visState, mapState, effect}) {
  if (effect.type === LIGHT_AND_SHADOW_EFFECT.type) {
    const deckEffect = effect.deckEffect;
    const {parameters} = effect;

    // Re-enable shadow rendering in case it was previously disabled
    for (const light of deckEffect.directionalLights || []) {
      light.shadow = true;
    }
    deckEffect.shadow = deckEffect.directionalLights?.some(l => l.shadow) ?? false;

    // Sync shadow color & intensity (not handled by deck.gl setProps)
    deckEffect.shadowColor = [
      ...normalizeColor(parameters.shadowColor),
      parameters.shadowIntensity
    ];

    // Sync ambient light
    if (deckEffect.ambientLight) {
      deckEffect.ambientLight.intensity = parameters.ambientLightIntensity;
      deckEffect.ambientLight.color = parameters.ambientLightColor.slice();
    }

    let {timestamp} = parameters;
    const {timeMode} = parameters;
    const sunLight = deckEffect.directionalLights[0];

    if (sunLight) {
      sunLight.color = parameters.sunLightColor.slice();
    }

    // set timestamp for shadow
    if (timeMode === LIGHT_AND_SHADOW_EFFECT_TIME_MODES.current) {
      timestamp = Date.now();
      if (sunLight) sunLight.timestamp = timestamp;
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
      if (sunLight) sunLight.timestamp = timestamp;
    }

    // output uniform shadow during nighttime
    if (isDaytime(mapState.latitude, mapState.longitude, timestamp)) {
      deckEffect.outputUniformShadow = false;
      if (sunLight) sunLight.intensity = parameters.sunLightIntensity;
    } else {
      deckEffect.outputUniformShadow = true;
      if (sunLight) sunLight.intensity = 0;
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

    if (type === 'checkbox') {
      result[name] = Boolean(property);
      return;
    }

    const value = Number.isFinite(property) ? clamp([min, max], property) : defaultValue ?? min;

    if (value !== undefined) {
      result[name] = value;
    }
  });
  return result;
}
