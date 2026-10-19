// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {CameraSnapshot, CameraTour, CameraTourStop} from '@kepler.gl/types';
import {getCameraSnapshot} from './camera-utils';

const validDuration = (value: unknown): value is number =>
  typeof value === 'number' &&
  Number.isFinite(value) &&
  value >= 0 &&
  value <= Number.MAX_SAFE_INTEGER;

const durationOfStops = (stops: CameraTourStop[]) =>
  stops.reduce(
    (total, stop, index) =>
      total + stop.holdDurationMs + (index < stops.length - 1 ? stop.travelDurationMs : 0),
    0
  );

/** Validate imported stops and copy authored fields, omitting empty or unsafe tours. */
export function normalizeCameraTour(value: unknown): CameraTour | null {
  if (!value || typeof value !== 'object' || !Array.isArray((value as CameraTour).stops))
    return null;
  const ids = new Set<string>();
  const stops: CameraTourStop[] = [];
  for (const stop of (value as CameraTour).stops) {
    if (
      !stop ||
      typeof stop.id !== 'string' ||
      !stop.id.trim() ||
      ids.has(stop.id) ||
      typeof stop.name !== 'string' ||
      !validDuration(stop.holdDurationMs) ||
      !validDuration(stop.travelDurationMs)
    )
      continue;
    const camera = getCameraSnapshot(stop.camera);
    if (!camera) continue;
    ids.add(stop.id);
    stops.push({
      id: stop.id,
      name: stop.name,
      camera,
      holdDurationMs: stop.holdDurationMs,
      travelDurationMs: stop.travelDurationMs
    });
  }
  return stops.length && durationOfStops(stops) <= Number.MAX_SAFE_INTEGER ? {stops} : null;
}

export function getCameraTourDuration(tour: CameraTour | null | undefined): number {
  return durationOfStops(normalizeCameraTour(tour)?.stops || []);
}

const shortestRotation = (from: number, to: number) =>
  (((((to % 360) - (from % 360) + 540) % 360) + 360) % 360) - 180;

/**
 * Evaluate an authored tour at elapsed milliseconds, without clocks or rendering state.
 * Holds precede travel; boundaries belong to the next stop and zero-length travel is a cut.
 * Travel uses smoothstep easing and the shortest longitude/bearing rotation (180° ties go west).
 * Time clamps to the tour; NaN means its start. The final hold contributes to duration.
 */
export function evaluateCameraTour(
  tour: CameraTour | null | undefined,
  elapsedMs: number
): CameraSnapshot | null {
  const normalized = normalizeCameraTour(tour);
  if (!normalized) return null;
  const {stops} = normalized;
  let remaining = Number.isNaN(elapsedMs) ? 0 : Math.max(0, elapsedMs);
  for (let index = 0; index < stops.length - 1; index++) {
    const stop = stops[index];
    if (remaining < stop.holdDurationMs) return {...stop.camera};
    remaining -= stop.holdDurationMs;
    if (remaining < stop.travelDurationMs) {
      const fraction = remaining / stop.travelDurationMs;
      const eased = fraction * fraction * (3 - 2 * fraction);
      const from = stop.camera;
      const to = stops[index + 1].camera;
      return {
        longitude: from.longitude + shortestRotation(from.longitude, to.longitude) * eased,
        latitude: from.latitude + (to.latitude - from.latitude) * eased,
        zoom: from.zoom * (1 - eased) + to.zoom * eased,
        bearing: from.bearing + shortestRotation(from.bearing, to.bearing) * eased,
        pitch: from.pitch + (to.pitch - from.pitch) * eased
      };
    }
    remaining -= stop.travelDurationMs;
  }
  return {...stops[stops.length - 1].camera};
}
