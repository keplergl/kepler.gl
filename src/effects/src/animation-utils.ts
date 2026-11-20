// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {Effect, EffectAnimation, EffectParameterDescription} from '@kepler.gl/types';

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

/** Validate optional endpoints without creating animations for missing or invalid values. */
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
      animation as Record<string, {startValue?: unknown; endValue?: unknown; easing?: unknown}>
    )[name];
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
    if (entry.easing !== 'linear' && entry.easing !== 'easeInOut') continue;

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
      ...(hasStart ? {startValue} : {}),
      endValue,
      easing: entry.easing
    };
  }
  return Object.keys(result).length ? result : undefined;
}
