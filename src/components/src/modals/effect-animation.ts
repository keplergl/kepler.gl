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
  id: string;
  name: string;
  start: number | number[];
  end: number | number[];
  original: number | number[];
  easing: 'linear' | 'easeInOut';
  startTimeMs: number;
  endTimeMs: number;
};

function getPlaybackTime(state?: PlaybackState): number | null {
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
  return Math.max(0, (time as number) - (start as number));
}

export function setAnimatedParameters(effect: Effect, parameters: Effect['parameters']) {
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

/** Keep procedural water on the same clock even without any parameter tracks. */
export function setSurfaceWaterAnimationTime(effects: Effect[], elapsedMs: number): void {
  for (const effect of effects) {
    if (effect.type === SURFACE_FOG_TYPE) {
      effect.deckEffect?.setProps?.({animationTimeMs: elapsedMs});
    }
  }
}

/** Collect playable endpoints without changing effects or their saved start values. */
export function getEffectAnimationTracks(effects: Effect[]) {
  return effects.flatMap(effect => {
    if (!effect.isEnabled || !effect.animation) return [];
    const validated = validateEffectAnimation(effect.animation, effect.getParameterDescriptions());
    const parameters = Object.entries(validated || {}).flatMap<ParameterTrack>(([name, entries]) =>
      entries.map(entry => {
        const current = effect.parameters[name];
        return {
          id: entry.id,
          name,
          start: entry.startValue,
          end: entry.endValue,
          original: Array.isArray(current) ? current.slice() : current,
          easing: entry.easing,
          startTimeMs: entry.startTimeMs,
          endTimeMs: entry.endTimeMs
        };
      })
    );
    const animatesTimestamp =
      effect.type === LIGHT_AND_SHADOW_EFFECT.type &&
      parameters.some(parameter => parameter.name === 'timestamp');
    return parameters.length
      ? [
          {
            effect,
            parameters,
            animatesTimestamp,
            originalTimeMode: effect.parameters.timeMode,
            modified: false
          }
        ]
      : [];
  });
}

/** Latest explicit endpoint among enabled, playable effect transitions. */
export function getEffectAnimationDuration(effects: Effect[]): number {
  return getEffectAnimationTracks(effects).reduce(
    (duration, track) =>
      track.parameters.reduce((end, parameter) => Math.max(end, parameter.endTimeMs), duration),
    0
  );
}

export function applyEffectAnimation(
  tracks: ReturnType<typeof getEffectAnimationTracks>,
  elapsedMs: number
): void {
  for (const track of tracks) {
    if (!track.effect.isEnabled) continue;
    const parameters: Effect['parameters'] = {};
    for (const {name, start, end, easing, startTimeMs, endTimeMs} of track.parameters) {
      // Later blocks do not override the held value until their start time.
      if (Object.prototype.hasOwnProperty.call(parameters, name) && elapsedMs < startTimeMs)
        continue;
      const localProgress =
        endTimeMs === startTimeMs
          ? Number(elapsedMs >= endTimeMs)
          : Math.max(0, Math.min(1, (elapsedMs - startTimeMs) / (endTimeMs - startTimeMs)));
      const t =
        easing === 'linear'
          ? localProgress
          : localProgress * localProgress * (3 - 2 * localProgress);
      const value = Array.isArray(start)
        ? start.map((value, index) => value + ((end as number[])[index] - value) * t)
        : start + ((end as number) - start) * t;
      parameters[name] = value;
    }
    setAnimatedParameters(track.effect, {
      ...parameters,
      ...(track.animatesTimestamp ? {timeMode: LIGHT_AND_SHADOW_EFFECT_TIME_MODES.pick} : {})
    });
    track.modified = true;
  }
}

/** Apply optional effect endpoints before drawing an export frame, using export clones only. */
export function useEffectAnimation(
  videoEffects: Effect[],
  containerRef: RefObject<{state?: PlaybackState} | null>,
  onLightingTimeChange?: () => void
): () => void {
  const tracks = useMemo(() => getEffectAnimationTracks(videoEffects), [videoEffects]);

  const restore = useCallback(() => {
    setSurfaceWaterAnimationTime(videoEffects, 0);
    let restoredTimestamp = false;
    for (const track of tracks) {
      if (!track.modified) continue;
      setAnimatedParameters(track.effect, {
        ...Object.fromEntries(track.parameters.map(({name, original}) => [name, original])),
        ...(track.animatesTimestamp ? {timeMode: track.originalTimeMode} : {})
      });
      restoredTimestamp ||= track.animatesTimestamp;
      track.modified = false;
    }
    if (restoredTimestamp) onLightingTimeChange?.();
  }, [tracks, videoEffects, onLightingTimeChange]);

  useEffect(() => restore, [restore]);

  return useCallback(() => {
    const time = getPlaybackTime(containerRef.current?.state);
    if (time === null) {
      restore();
      return;
    }
    applyEffectAnimation(tracks, time);
    setSurfaceWaterAnimationTime(videoEffects, time);
    if (tracks.some(track => track.animatesTimestamp)) onLightingTimeChange?.();
  }, [containerRef, restore, tracks, videoEffects, onLightingTimeChange]);
}
