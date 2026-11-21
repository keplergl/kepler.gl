// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {LayerAnimatableProp, LayerPropertyTransition, RGBColor} from '@kepler.gl/types';

type PropertyTransitionConfig = {
  propertyTransitions?: Record<string, LayerPropertyTransition[]>;
};

type AnimatableLayer = {
  config: PropertyTransitionConfig & {isVisible: boolean};
  animatableProps?: readonly LayerAnimatableProp[];
};

export const DEFAULT_LAYER_ANIMATABLE_PROPS: readonly Extract<
  LayerAnimatableProp,
  {type?: 'number'}
>[] = [{name: 'opacity', label: 'Opacity', range: [0, 1], step: 0.01}];

const isSafePropertyName = (name: string): boolean =>
  name.trim().length > 0 && !['__proto__', 'constructor', 'prototype'].includes(name);

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const isRGBColor = (value: unknown): value is RGBColor =>
  Array.isArray(value) &&
  value.length === 3 &&
  [value[0], value[1], value[2]].every(
    channel => isFiniteNumber(channel) && channel >= 0 && channel <= 255
  );

/** Validate one ordered, non-overlapping track without changing its saved input. */
function normalizeTransitions(
  value: unknown,
  range?: readonly [number, number],
  type?: 'number' | 'color'
): LayerPropertyTransition[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const ids = new Set<string>();
  const transitions: LayerPropertyTransition[] = [];
  let trackType = type;
  for (const candidate of value) {
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return undefined;
    const {id, startTimeMs, endTimeMs, startValue, endValue} = candidate;
    const easing = candidate.easing === undefined ? 'easeInOut' : candidate.easing;
    const numeric = isFiniteNumber(startValue) && isFiniteNumber(endValue);
    const color = isRGBColor(startValue) && isRGBColor(endValue);
    const valueType = numeric ? 'number' : color ? 'color' : undefined;
    if (
      typeof id !== 'string' ||
      id.trim().length === 0 ||
      ids.has(id) ||
      ![startTimeMs, endTimeMs].every(
        time => typeof time === 'number' && Number.isFinite(time) && time >= 0
      ) ||
      endTimeMs < startTimeMs ||
      !valueType ||
      (trackType !== undefined && trackType !== valueType) ||
      (numeric &&
        range &&
        ![startValue, endValue].every(endpoint => endpoint >= range[0] && endpoint <= range[1])) ||
      (easing !== 'linear' && easing !== 'easeInOut')
    ) {
      return undefined;
    }
    trackType = valueType;
    ids.add(id);
    const endpoints = color
      ? {startValue: [...startValue] as RGBColor, endValue: [...endValue] as RGBColor}
      : {startValue: startValue as number, endValue: endValue as number};
    transitions.push({id, startTimeMs, endTimeMs, ...endpoints, easing});
  }
  // Cuts at an interval's start come first; equal-time cuts retain their authored order.
  transitions.sort((a, b) => a.startTimeMs - b.startTimeMs || a.endTimeMs - b.endTimeMs);
  if (
    transitions.some(
      (transition, index) => index > 0 && transition.startTimeMs < transitions[index - 1].endTimeMs
    )
  ) {
    return undefined;
  }
  return transitions;
}

/** Preserve unknown properties for forward compatibility, but never unsafe object keys. */
export function normalizeLayerPropertyTransitions(
  value: unknown
): Record<string, LayerPropertyTransition[]> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) return undefined;
  const result: Record<string, LayerPropertyTransition[]> = {};
  for (const [name, track] of Object.entries(value)) {
    if (!isSafePropertyName(name)) return undefined;
    const transitions =
      name === 'opacity'
        ? normalizeTransitions(track, [0, 1], 'number')
        : normalizeTransitions(track);
    if (!transitions) return undefined;
    result[name] = transitions;
  }
  return result;
}

export function getLayerPropertyTransitions(
  config: PropertyTransitionConfig,
  name: string,
  definition?: LayerAnimatableProp
): LayerPropertyTransition[] {
  if (!isSafePropertyName(name)) return [];
  if (name === 'opacity' && definition?.type === 'color') return [];
  let range: readonly [number, number] | undefined =
    definition?.type === 'color' ? undefined : definition?.range;
  const type = name === 'opacity' ? 'number' : definition ? definition.type ?? 'number' : undefined;
  if (
    range &&
    (!Array.isArray(range) ||
      range.length !== 2 ||
      !range.every(Number.isFinite) ||
      range[0] > range[1])
  ) {
    return [];
  }
  if (name === 'opacity') {
    range = range ? [Math.max(0, range[0]), Math.min(1, range[1])] : [0, 1];
  }
  const tracks = config.propertyTransitions;
  if (tracks && typeof tracks === 'object' && Object.prototype.hasOwnProperty.call(tracks, name)) {
    return normalizeTransitions(tracks[name], range, type) ?? [];
  }
  return [];
}

/** Evaluate elapsed time independently of playback order, holding values between transitions. */
function evaluateTransitions(
  transitions: LayerPropertyTransition[],
  timeMs: number
): number | RGBColor {
  let value = transitions[0].startValue;
  for (const transition of transitions) {
    const {startTimeMs, endTimeMs, startValue, endValue, easing} = transition;
    if (timeMs < startTimeMs) return value;
    if (timeMs < endTimeMs) {
      const progress = (timeMs - startTimeMs) / (endTimeMs - startTimeMs);
      const t = easing === 'linear' ? progress : progress * progress * (3 - 2 * progress);
      return typeof startValue === 'number' && typeof endValue === 'number'
        ? startValue * (1 - t) + endValue * t
        : ((startValue as RGBColor).map(
            (channel, index) => channel * (1 - t) + (endValue as RGBColor)[index] * t
          ) as RGBColor);
    }
    value = endValue;
  }
  return value;
}

export function getLayerOpacityFactor(
  config: PropertyTransitionConfig,
  timeMs?: number | null
): number {
  if (typeof timeMs !== 'number' || !Number.isFinite(timeMs)) return 1;
  const transitions = getLayerPropertyTransitions(config, 'opacity');
  return transitions.length ? (evaluateTransitions(transitions, timeMs) as number) : 1;
}

export function getLayerAnimationTracks(
  layer: AnimatableLayer
): {property: LayerAnimatableProp; transitions: LayerPropertyTransition[]}[] {
  return (layer.animatableProps ?? DEFAULT_LAYER_ANIMATABLE_PROPS).flatMap(property => {
    const transitions = getLayerPropertyTransitions(layer.config, property.name, property);
    return transitions.length ? [{property, transitions}] : [];
  });
}

export function getLayerAnimationDuration(layers: readonly AnimatableLayer[]): number {
  return layers.reduce((duration, layer) => {
    if (!layer.config.isVisible) return duration;
    return getLayerAnimationTracks(layer).reduce(
      (latest, {transitions}) => Math.max(latest, transitions[transitions.length - 1].endTimeMs),
      duration
    );
  }, 0);
}

export function getLayerAnimationOpacityFactor(
  layer: AnimatableLayer,
  timeMs?: number | null
): number {
  if (typeof timeMs !== 'number' || !Number.isFinite(timeMs)) return 1;
  const track = getLayerAnimationTracks(layer).find(({property}) => property.name === 'opacity');
  return track ? (evaluateTransitions(track.transitions, timeMs) as number) : 1;
}

/** Overrides are transient; opacity remains a separate authored-opacity multiplier. */
export function getLayerAnimatedConfig(
  layer: AnimatableLayer,
  timeMs?: number | null
): {color?: RGBColor; visConfig?: Record<string, number | RGBColor>} {
  if (typeof timeMs !== 'number' || !Number.isFinite(timeMs)) return {};
  const result: {color?: RGBColor; visConfig?: Record<string, number | RGBColor>} = {};
  for (const {property, transitions} of getLayerAnimationTracks(layer)) {
    if (property.name !== 'opacity') {
      const value = evaluateTransitions(transitions, timeMs);
      if (property.name === 'color' && property.type === 'color') {
        if (Array.isArray(value)) result.color = value;
      } else {
        result.visConfig ??= {};
        result.visConfig[property.name] = value;
      }
    }
  }
  return result;
}

export function getLayerAnimatedVisConfig(
  layer: AnimatableLayer,
  timeMs?: number | null
): Record<string, number | RGBColor> {
  return getLayerAnimatedConfig(layer, timeMs).visConfig ?? {};
}

export function getAnnotationOpacityDuration(
  annotations: readonly (PropertyTransitionConfig & {isVisible: boolean})[]
): number {
  return annotations.reduce((duration, annotation) => {
    const transitions = annotation.isVisible
      ? getLayerPropertyTransitions(annotation, 'opacity')
      : undefined;
    return Math.max(duration, transitions?.[transitions.length - 1]?.endTimeMs ?? 0);
  }, 0);
}
