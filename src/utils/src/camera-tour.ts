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

/** Shared velocity at a waypoint, in camera units per millisecond. */
function velocityAtStop(stops: CameraTourStop[], index: number): CameraSnapshot {
  const velocity = {longitude: 0, latitude: 0, zoom: 0, bearing: 0, pitch: 0};
  const previous = stops[index - 1];
  const stop = stops[index];
  const next = stops[index + 1];
  if (
    !previous ||
    !next ||
    stop.holdDurationMs > 0 ||
    previous.travelDurationMs === 0 ||
    stop.travelDurationMs === 0
  )
    return velocity;

  const incoming = [
    shortestRotation(previous.camera.longitude, stop.camera.longitude),
    stop.camera.latitude - previous.camera.latitude
  ];
  const outgoing = [
    shortestRotation(stop.camera.longitude, next.camera.longitude),
    next.camera.latitude - stop.camera.latitude
  ];
  const incomingLength = Math.hypot(...incoming);
  const outgoingLength = Math.hypot(...outgoing);
  const speed = Math.min(
    incomingLength / previous.travelDurationMs,
    outgoingLength / stop.travelDurationMs
  );
  if (incomingLength > 0 && outgoingLength > 0 && Number.isFinite(speed)) {
    // Bisect the travel directions and cap speed at the slower neighboring leg.
    // Each equivalent Bezier handle stays within one third of its leg's length;
    // corners round gently, while coincident points and reversals cannot loop.
    velocity.longitude =
      (incoming[0] / incomingLength + outgoing[0] / outgoingLength) * (speed / 2);
    velocity.latitude = (incoming[1] / incomingLength + outgoing[1] / outgoingLength) * (speed / 2);
    // Keep both neighboring Bezier handles inside the valid latitude range.
    const latitudeDirection = Math.sign(velocity.latitude);
    velocity.latitude =
      latitudeDirection *
      Math.min(
        Math.abs(velocity.latitude),
        (3 * (90 - latitudeDirection * stop.camera.latitude)) / stop.travelDurationMs,
        (3 * (90 + latitudeDirection * stop.camera.latitude)) / previous.travelDurationMs
      );
  }

  for (const key of ['zoom', 'bearing', 'pitch'] as const) {
    const before =
      (key === 'bearing'
        ? shortestRotation(previous.camera[key], stop.camera[key])
        : stop.camera[key] - previous.camera[key]) / previous.travelDurationMs;
    const after =
      (key === 'bearing'
        ? shortestRotation(stop.camera[key], next.camera[key])
        : next.camera[key] - stop.camera[key]) / stop.travelDurationMs;
    // Scalar values must stay between their endpoints, including at reversals.
    const slope =
      Math.sign(before) === Math.sign(after)
        ? Math.sign(before) * Math.min(Math.abs(before), Math.abs(after))
        : 0;
    velocity[key] = Number.isFinite(slope) ? slope : 0;
  }
  return velocity;
}

/**
 * Evaluate an authored tour at elapsed milliseconds, without clocks or rendering state.
 * Holds precede travel; boundaries belong to the next stop and zero-length travel is a cut.
 * Bounded cubic travel shares velocity through zero-hold stops, easing to rest at holds,
 * cuts and tour endpoints. Longitude/bearing take the shortest rotation (180° ties go west).
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
      const startVelocity = velocityAtStop(stops, index);
      const endVelocity = velocityAtStop(stops, index + 1);
      const startWeight = fraction * (1 - fraction) ** 2 * stop.travelDurationMs;
      const endWeight = fraction ** 2 * (1 - fraction) * stop.travelDurationMs;
      const offset = (key: keyof CameraSnapshot) =>
        startVelocity[key] * startWeight - endVelocity[key] * endWeight;
      return {
        longitude:
          from.longitude +
          shortestRotation(from.longitude, to.longitude) * eased +
          offset('longitude'),
        latitude: from.latitude + (to.latitude - from.latitude) * eased + offset('latitude'),
        zoom: from.zoom * (1 - eased) + to.zoom * eased + offset('zoom'),
        bearing:
          from.bearing + shortestRotation(from.bearing, to.bearing) * eased + offset('bearing'),
        pitch: from.pitch + (to.pitch - from.pitch) * eased + offset('pitch')
      };
    }
    remaining -= stop.travelDurationMs;
  }
  return {...stops[stops.length - 1].camera};
}
