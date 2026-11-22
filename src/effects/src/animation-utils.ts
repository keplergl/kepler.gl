// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {
  Effect,
  EffectAnimation,
  EffectParameterAnimation,
  EffectParameterDescription
} from '@kepler.gl/types';

const NON_ANIMATABLE_PARAMETERS = new Set([
  'animateHeight',
  'heightEnd',
  'linearEasing',
  'shadowMapResolution'
]);
const MAX_DATE_TIMESTAMP = 8.64e15;

function isAnimatableParameter(description: EffectParameterDescription): boolean {
  const {name, type, min, max, defaultValue} = description;
  if (
    name.startsWith('_') ||
    NON_ANIMATABLE_PARAMETERS.has(name) ||
    !Number.isFinite(min) ||
    !Number.isFinite(max) ||
    min > max
  ) {
    return false;
  }
  if (type === 'array' || type === 'color') {
    return (
      Array.isArray(defaultValue) && defaultValue.length > 0 && defaultValue.every(Number.isFinite)
    );
  }
  return type === undefined || type === 'number';
}

export function getAnimatableEffectParameters(
  effect: Pick<Effect, 'getParameterDescriptions'>
): EffectParameterDescription[] {
  return effect.getParameterDescriptions().filter(isAnimatableParameter);
}

export function getEffectAnimationEntries(
  value: EffectAnimation[string] | undefined
): EffectParameterAnimation[] {
  return Array.isArray(value) ? value : value ? [value] : [];
}

/** Validate timed endpoints without creating animations for missing or invalid values. */
export function validateEffectAnimation(
  animation: unknown,
  descriptions: EffectParameterDescription[]
): EffectAnimation | undefined {
  if (!animation || typeof animation !== 'object' || Array.isArray(animation)) {
    return undefined;
  }

  const result: EffectAnimation = {};
  for (const description of descriptions.filter(isAnimatableParameter)) {
    const {name, type, min, max, defaultValue} = description;
    if (!Object.prototype.hasOwnProperty.call(animation, name)) continue;
    const entry = (
      animation as Record<
        string,
        {
          id?: unknown;
          startValue?: unknown;
          endValue?: unknown;
          easing?: unknown;
          startTimeMs?: unknown;
          endTimeMs?: unknown;
        }
      >
    )[name];
    if (Array.isArray(entry)) {
      const ids = new Set<string>();
      if (
        !entry.length ||
        !entry.every(block => {
          if (
            !block ||
            typeof block !== 'object' ||
            Array.isArray(block) ||
            typeof block.id !== 'string' ||
            !block.id.trim() ||
            ids.has(block.id) ||
            block.startValue === undefined ||
            block.startTimeMs === undefined ||
            block.endTimeMs === undefined
          )
            return false;
          ids.add(block.id);
          return true;
        })
      )
        continue;
      const blocks = entry.map(
        block => validateEffectAnimation({[name]: block}, [description])?.[name]
      );
      if (blocks.some(block => !block || Array.isArray(block))) continue;
      const sequence = (blocks as EffectParameterAnimation[]).sort(
        (a, b) => a.startTimeMs - b.startTimeMs || a.endTimeMs - b.endTimeMs
      );
      if (
        sequence.some(
          (block, index) => index > 0 && block.startTimeMs < sequence[index - 1].endTimeMs
        )
      )
        continue;
      result[name] = sequence;
      continue;
    }
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
    if (entry.id !== undefined && (typeof entry.id !== 'string' || !entry.id.trim())) continue;
    if (entry.easing !== 'linear' && entry.easing !== 'easeInOut') continue;
    if (
      typeof entry.startTimeMs !== 'number' ||
      !Number.isFinite(entry.startTimeMs) ||
      entry.startTimeMs < 0 ||
      typeof entry.endTimeMs !== 'number' ||
      !Number.isFinite(entry.endTimeMs) ||
      entry.endTimeMs < entry.startTimeMs
    ) {
      continue;
    }

    const clampValue = (value: number) => Math.max(min, Math.min(max, value));
    const validateValue = (value: unknown): number | number[] | undefined => {
      if (type === 'array' || type === 'color') {
        if (
          !Array.isArray(value) ||
          value.length !== (defaultValue as number[]).length ||
          !Array.from(value).every(Number.isFinite)
        ) {
          return undefined;
        }
        return value.map(clampValue);
      }
      if (
        typeof value !== 'number' ||
        !Number.isFinite(value) ||
        (name === 'timestamp' && Math.abs(value) > MAX_DATE_TIMESTAMP)
      ) {
        return undefined;
      }
      return clampValue(value);
    };
    const endValue = validateValue(entry.endValue);
    const hasStart = Object.prototype.hasOwnProperty.call(entry, 'startValue');
    const startValue = hasStart ? validateValue(entry.startValue) : undefined;
    if (endValue === undefined || (hasStart && startValue === undefined)) continue;
    result[name] = {
      ...(typeof entry.id === 'string' ? {id: entry.id} : {}),
      ...(hasStart ? {startValue} : {}),
      endValue,
      easing: entry.easing,
      startTimeMs: entry.startTimeMs,
      endTimeMs: entry.endTimeMs
    };
  }
  return Object.keys(result).length ? result : undefined;
}
