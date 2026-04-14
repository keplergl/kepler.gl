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
  // The export has its own WebGL context and its own cloned Effect
  // instances.  It must never touch _lastLightingDeckEffect or wrap
  // with Object.create (which would make EffectManager re-setup every
  // frame, destroying shadow passes and causing flicker).
  if (isExport) {
    return computeDeckEffectsForExport({visState, mapState});
  }

  // TODO: 1) deck effects per deck context 2) preserved between draws
  let hasLightingShadow = false;

  const deckEffects = visState.effectOrder
    .map(effectId => {
      const effect = findById(effectId)(visState.effects) as Effect | undefined;
      if (effect?.deckEffect) {
        if (effect.type === LIGHT_AND_SHADOW_EFFECT.type) {
          // When a retained deck effect exists, reuse it so that
          // deck.gl's EffectManager sees the same object reference and
          // avoids the setup→cleanup ordering problem (cleanup of the
          // old instance would remove the shadow module the new one
          // just added).  All parameters will be synced by updateEffect.
          if (_lastLightingDeckEffect && effect.deckEffect !== _lastLightingDeckEffect) {
            effect.deckEffect = _lastLightingDeckEffect;
          }
        }

        if (effect.isEnabled) {
          updateEffect({visState, mapState, effect});
        } else if (effect.type === LIGHT_AND_SHADOW_EFFECT.type) {
          disableLightingEffect(effect);
        }
        if (effect.isEnabled || effect.type === LIGHT_AND_SHADOW_EFFECT.type) {
          if (effect.type === LIGHT_AND_SHADOW_EFFECT.type) {
            hasLightingShadow = true;
            _lastLightingDeckEffect = effect.deckEffect;
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

  // deck.gl's EffectManager uses deepEqual(effects, prev, 1) to detect
  // changes. Since we mutate the existing deckEffect instances in place
  // (via updateEffect / setProps), the object references stay the same
  // and deepEqual considers them unchanged — so no redraw is triggered.
  // Wrapping each deckEffect in a prototypal proxy (Object.create) gives
  // each element a fresh identity while preserving full access to the
  // underlying instance's properties and methods.
  return deckEffects.map(de => Object.create(de));
}

/**
 * Separate code path for the export context. The export creates its own
 * cloned Effect instances with independent deckEffect objects and its own
 * WebGL context. We must not touch the module-level _lastLightingDeckEffect,
 * must not wrap with Object.create (which causes EffectManager to
 * setup/cleanup every frame), and must keep the logic minimal to avoid
 * cross-context interference.
 */
function computeDeckEffectsForExport({
  visState,
  mapState
}: {
  visState: VisState;
  mapState: MapState;
}): DeckEffect[] {
  const deckEffects = visState.effectOrder
    .map(effectId => {
      const effect = findById(effectId)(visState.effects) as Effect | undefined;
      if (effect?.deckEffect) {
        if (effect.isEnabled) {
          updateEffectForExport({visState, mapState, effect});
        }
        if (effect.isEnabled) {
          return effect.deckEffect;
        }
      }
      return null;
    })
    .filter(effect => effect);

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
 * Disable shadow rendering directly on a deck.gl LightingEffect instance
 * and neutralise its lights so that PBR materials still using lit shaders
 * render with an appearance that closely matches unlit (full white ambient,
 * zero directional intensity).  This avoids the need to force-regenerate
 * every cached 3D-tile sub-layer when the effect is merely retained for
 * its shadow shader module.
 */
function disableDeckLightingEffect(deckEffect: any) {
  deckEffect.shadow = false;
  deckEffect.outputUniformShadow = false;
  for (const light of deckEffect.directionalLights || []) {
    light.shadow = false;
    light.intensity = 0;
  }
  if (deckEffect.ambientLight) {
    deckEffect.ambientLight.color = [255, 255, 255];
    deckEffect.ambientLight.intensity = 1;
  }
}

/**
 * Update effect to match latest vis and map states.
 * Syncs all light parameters to the deck effect — essential when the
 * deck effect instance is reused across remove→re-add cycles.
 */
function updateEffect({visState, mapState, effect}) {
  if (effect.type === LIGHT_AND_SHADOW_EFFECT.type) {
    const deckEffect = effect.deckEffect;

    // Re-enable shadow rendering in case it was previously disabled
    for (const light of deckEffect.directionalLights || []) {
      light.shadow = true;
    }
    deckEffect.shadow = deckEffect.directionalLights?.some(l => l.shadow) ?? false;

    deckEffect.shadowColor = [
      ...normalizeColor(effect.parameters.shadowColor),
      effect.parameters.shadowIntensity
    ];
    if (deckEffect.ambientLight) {
      deckEffect.ambientLight.color = (
        effect.parameters.ambientLightColor || [255, 255, 255]
      ).slice();
      deckEffect.ambientLight.intensity = effect.parameters.ambientLightIntensity;
    }

    let {timestamp} = effect.parameters;
    const {timeMode} = effect.parameters;
    const sunLight = effect.deckEffect.directionalLights[0];
    if (sunLight) {
      sunLight.color = (effect.parameters.sunLightColor || [255, 255, 255]).slice();
    }

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
 * Minimal update for the export context. The export uses fresh cloned
 * effects with correctly initialized deckEffect instances, so it only
 * needs timestamp and intensity updates — not full parameter syncing.
 */
function updateEffectForExport({visState, mapState, effect}) {
  if (effect.type === LIGHT_AND_SHADOW_EFFECT.type) {
    const deckEffect = effect.deckEffect;
    for (const light of deckEffect.directionalLights || []) {
      light.shadow = true;
    }
    deckEffect.shadow = deckEffect.directionalLights?.some(l => l.shadow) ?? false;

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
