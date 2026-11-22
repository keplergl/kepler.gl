// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {useCallback, useEffect, useMemo} from 'react';
import type {RefObject} from 'react';
import {
  LIGHT_AND_SHADOW_EFFECT,
  LIGHT_AND_SHADOW_EFFECT_TIME_MODES,
  SURFACE_FOG_TYPE
} from '@kepler.gl/constants';
import {getEffectAnimationEntries, validateEffectAnimation} from '@kepler.gl/effects';
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
  id?: string;
  name: string;
  start: number | number[];
  end: number | number[];
  original: number | number[];
  easing: 'linear' | 'easeInOut';
  startTimeMs?: number;
  endTimeMs?: number;
};

function getPlaybackTime(state?: PlaybackState): {progress: number; elapsedMs: number} | null {
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
  const elapsedMs = Math.max(0, (time as number) - (start as number));
  return {progress: Math.min(elapsedMs / duration, 1), elapsedMs};
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
    const parameters = Object.entries(validated || {}).flatMap<ParameterTrack>(([name, entries]) =>
      getEffectAnimationEntries(entries).flatMap<ParameterTrack>(entry => {
        const current = effect.parameters[name];
        const original = Array.isArray(current) ? current.slice() : current;
        const start = entry.startValue ?? current;
        const end = entry.endValue;
        const timing =
          entry.startTimeMs !== undefined
            ? {startTimeMs: entry.startTimeMs, endTimeMs: entry.endTimeMs}
            : {};
        const identity = entry.id ? {id: entry.id} : {};
        if (Array.isArray(start) && Array.isArray(end)) {
          if (start.length !== end.length || !start.every(Number.isFinite)) return [];
          return [
            {
              name,
              start: start.slice(),
              end,
              original,
              easing: entry.easing,
              ...timing,
              ...identity
            }
          ];
        }
        if (!Number.isFinite(start) || Array.isArray(end)) return [];
        return [
          {
            name,
            start: start as number,
            end,
            original,
            easing: entry.easing,
            ...timing,
            ...identity
          }
        ];
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
      track.parameters.reduce(
        (end, parameter) => Math.max(end, parameter.endTimeMs ?? 0),
        duration
      ),
    0
  );
}

export function applyEffectAnimation(
  tracks: ReturnType<typeof getEffectAnimationTracks>,
  progress: number,
  elapsedMs?: number
): void {
  for (const track of tracks) {
    if (!track.effect.isEnabled) continue;
    const parameters: Effect['parameters'] = {};
    for (const {name, start, end, easing, startTimeMs, endTimeMs} of track.parameters) {
      // Later blocks do not override the held value until their start time.
      if (
        Object.prototype.hasOwnProperty.call(parameters, name) &&
        startTimeMs !== undefined &&
        elapsedMs !== undefined &&
        elapsedMs < startTimeMs
      )
        continue;
      const localProgress =
        startTimeMs !== undefined && endTimeMs !== undefined && Number.isFinite(elapsedMs)
          ? endTimeMs === startTimeMs
            ? Number((elapsedMs as number) >= endTimeMs)
            : Math.max(
                0,
                Math.min(1, ((elapsedMs as number) - startTimeMs) / (endTimeMs - startTimeMs))
              )
          : progress;
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
  }, [tracks, onLightingTimeChange]);

  useEffect(() => restore, [restore]);

  return useCallback(() => {
    const time = getPlaybackTime(containerRef.current?.state);
    if (time === null) {
      restore();
      return;
    }
    applyEffectAnimation(tracks, time.progress, time.elapsedMs);
    if (tracks.some(track => track.animatesTimestamp)) onLightingTimeChange?.();
  }, [containerRef, restore, tracks, onLightingTimeChange]);
}
