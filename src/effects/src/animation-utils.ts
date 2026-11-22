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
    const entries = (animation as Record<string, unknown>)[name];
    if (!Array.isArray(entries) || !entries.length) continue;

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
    const ids = new Set<string>();
    const blocks: EffectParameterAnimation[] = [];
    for (const entry of entries) {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) break;
      const {id, easing, startTimeMs, endTimeMs} = entry;
      if (
        typeof id !== 'string' ||
        !id.trim() ||
        ids.has(id) ||
        (easing !== 'linear' && easing !== 'easeInOut') ||
        typeof startTimeMs !== 'number' ||
        !Number.isFinite(startTimeMs) ||
        startTimeMs < 0 ||
        typeof endTimeMs !== 'number' ||
        !Number.isFinite(endTimeMs) ||
        endTimeMs < startTimeMs
      )
        break;
      const startValue = validateValue(entry.startValue);
      const endValue = validateValue(entry.endValue);
      if (startValue === undefined || endValue === undefined) break;
      ids.add(id);
      blocks.push({id, startValue, endValue, easing, startTimeMs, endTimeMs});
    }
    if (blocks.length !== entries.length) continue;
    blocks.sort((a, b) => a.startTimeMs - b.startTimeMs || a.endTimeMs - b.endTimeMs);
    if (blocks.some((block, index) => index > 0 && block.startTimeMs < blocks[index - 1].endTimeMs))
      continue;
    result[name] = blocks;
  }
  return Object.keys(result).length ? result : undefined;
}
