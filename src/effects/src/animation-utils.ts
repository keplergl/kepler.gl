// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {Effect, EffectAnimation, EffectParameterDescription} from '@kepler.gl/types';

const NON_ANIMATABLE_PARAMETERS = new Set([
  'timestamp',
  'animateHeight',
  'heightEnd',
  'linearEasing'
]);

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
    const entry = (animation as Record<string, {endValue?: unknown; easing?: unknown}>)[name];
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
    if (entry.easing !== 'linear' && entry.easing !== 'easeInOut') continue;

    const clampValue = (value: number) => Math.max(min, Math.min(max, value));
    if (type === 'array' || type === 'color') {
      if (
        !Array.isArray(entry.endValue) ||
        entry.endValue.length !== (defaultValue as number[]).length ||
        !Array.from(entry.endValue).every(Number.isFinite)
      ) {
        continue;
      }
      result[name] = {endValue: entry.endValue.map(clampValue), easing: entry.easing};
    } else if (typeof entry.endValue === 'number' && Number.isFinite(entry.endValue)) {
      result[name] = {endValue: clampValue(entry.endValue), easing: entry.easing};
    }
  }
  return Object.keys(result).length ? result : undefined;
}
