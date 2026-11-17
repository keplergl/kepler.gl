// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {useCallback, useEffect, useMemo} from 'react';
import type {RefObject} from 'react';
import {
  LIGHT_AND_SHADOW_EFFECT,
  LIGHT_AND_SHADOW_EFFECT_TIME_MODES,
  SURFACE_FOG_TYPE
} from '@kepler.gl/constants';
import {validateEffectAnimation} from '@kepler.gl/effects';
import type {Effect} from '@kepler.gl/types';

type PlaybackState = {
  previewing?: boolean;
  rendering?: boolean;
  currentTimeMs?: number;
  durationMs?: number;
  adapter?: {
    videoCapture?: {timeMs: number; timecode?: {start: number; duration: number} | null};
  };
};

type ParameterTrack = {
  name: string;
  start: number | number[];
  end: number | number[];
  original: number | number[];
  easing: 'linear' | 'easeInOut';
};

function getProgress(state?: PlaybackState): number | null {
  if (!state || !(state.previewing || state.rendering)) return null;

  // Globe/swipe own their capture loop; standard Hubble export owns VideoCapture.
  const capture = state.adapter?.videoCapture;
  const customClock = state.currentTimeMs !== undefined;
  const time = customClock ? state.currentTimeMs : capture?.timeMs;
  const start = customClock ? 0 : capture?.timecode?.start;
  const duration = customClock ? state.durationMs : capture?.timecode?.duration;
  if (
    !Number.isFinite(time) ||
    !Number.isFinite(start) ||
    !Number.isFinite(duration) ||
    !duration ||
    duration < 0
  ) {
    return null;
  }
  return Math.min(Math.max(((time as number) - (start as number)) / duration, 0), 1);
}

export function setAnimatedParameters(
  effect: Effect,
  parameters: Record<string, number | number[]>
) {
  const sunLight =
    effect.type === LIGHT_AND_SHADOW_EFFECT.type ? effect.deckEffect?.directionalLights?.[0] : null;
  const timestamp = sunLight?.timestamp;
  effect.setProps({parameters});

  // LightingEffect.setProps also writes the saved timestamp/intensity. Preserve
  // the current timeline and nighttime decisions already made by computeDeckEffects.
  if (sunLight) {
    if (
      effect.parameters.timeMode === LIGHT_AND_SHADOW_EFFECT_TIME_MODES.current ||
      effect.parameters.timeMode === LIGHT_AND_SHADOW_EFFECT_TIME_MODES.animation
    ) {
      sunLight.timestamp = timestamp;
    }
    if (effect.deckEffect.outputUniformShadow) sunLight.intensity = 0;
  }
}

/** Collect playable endpoints without changing effects or their saved start values. */
export function getEffectAnimationTracks(effects: Effect[]) {
  return effects.flatMap(effect => {
    if (!effect.isEnabled) return [];
    const animation = {...effect.animation};
    // Keep existing saved fog animations playable. An explicit generic height wins.
    if (
      effect.type === SURFACE_FOG_TYPE &&
      effect.parameters.animateHeight &&
      !Object.prototype.hasOwnProperty.call(animation, 'height')
    ) {
      animation.height = {
        endValue: effect.parameters.heightEnd,
        easing: effect.parameters.linearEasing ? 'linear' : 'easeInOut'
      };
    }
    if (!Object.keys(animation).length) return [];

    const validated = validateEffectAnimation(animation, effect.getParameterDescriptions());
    const parameters = Object.entries(validated || {}).flatMap<ParameterTrack>(([name, entry]) => {
      const current = effect.parameters[name];
      const original = Array.isArray(current) ? current.slice() : current;
      const start = entry.startValue ?? current;
      const end = entry.endValue;
      if (Array.isArray(start) && Array.isArray(end)) {
        if (start.length !== end.length || !start.every(Number.isFinite)) return [];
        return [{name, start: start.slice(), end, original, easing: entry.easing}];
      }
      if (!Number.isFinite(start) || Array.isArray(end)) return [];
      return [{name, start: start as number, end, original, easing: entry.easing}];
    });
    return parameters.length ? [{effect, parameters, modified: false}] : [];
  });
}

export function applyEffectAnimation(
  tracks: ReturnType<typeof getEffectAnimationTracks>,
  progress: number
): void {
  for (const track of tracks) {
    if (!track.effect.isEnabled) continue;
    const parameters = Object.fromEntries(
      track.parameters.map(({name, start, end, easing}) => {
        const t = easing === 'linear' ? progress : progress * progress * (3 - 2 * progress);
        const value = Array.isArray(start)
          ? start.map((value, index) => value + ((end as number[])[index] - value) * t)
          : start + ((end as number) - start) * t;
        return [name, value];
      })
    );
    setAnimatedParameters(track.effect, parameters);
    track.modified = true;
  }
}

/** Apply optional effect endpoints before drawing an export frame, using export clones only. */
export function useEffectAnimation(
  videoEffects: Effect[],
  containerRef: RefObject<{state?: PlaybackState} | null>
): () => void {
  const tracks = useMemo(() => getEffectAnimationTracks(videoEffects), [videoEffects]);

  const restore = useCallback(() => {
    for (const track of tracks) {
      if (!track.modified) continue;
      setAnimatedParameters(
        track.effect,
        Object.fromEntries(track.parameters.map(({name, original}) => [name, original]))
      );
      track.modified = false;
    }
  }, [tracks]);

  useEffect(() => restore, [restore]);

  return useCallback(() => {
    const progress = getProgress(containerRef.current?.state);
    if (progress === null) {
      restore();
      return;
    }
    applyEffectAnimation(tracks, progress);
  }, [containerRef, restore, tracks]);
}
