// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {addMetersToLngLat} from '@math.gl/web-mercator';
import {Annotation, AnnotationWithArm} from '@kepler.gl/types';
import {AnnotationKind, isAnnotationWithArm} from '@kepler.gl/constants';

export type MapViewport = {
  project: (lngLat: [number, number]) => [number, number];
  unproject: (xy: [number, number]) => [number, number];
  longitude: number;
  latitude: number;
  width: number;
  height: number;
  zoom: number;
};

export type BaseAnnotationMarker = {
  kind: AnnotationKind;
  x: number;
  y: number;
  tx: number;
  ty: number;
};

export type CircleAnnotationMarker = BaseAnnotationMarker & {
  kind: AnnotationKind.CIRCLE;
  ax: number;
  ay: number;
  r: number;
};

export type AnnotationMarker = BaseAnnotationMarker | CircleAnnotationMarker;

function degreesToRadians(degree: number): number {
  return degree * (Math.PI / 180);
}

function calcRadius(
  viewport: MapViewport,
  point: [number, number],
  radiusInMeters: number
): number {
  const [x, y] = viewport.project(point);
  const shifted = addMetersToLngLat(point, [radiusInMeters, 0, 0]) as [number, number];
  const [x1, y1] = viewport.project(shifted);
  const dx = x1 - x;
  const dy = y1 - y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function makeMarker(annotation: Annotation, viewport: MapViewport): AnnotationMarker {
  const {kind, anchorPoint} = annotation;
  const angle = isAnnotationWithArm(annotation) ? degreesToRadians(annotation.angle) : 0;
  const [x, y] = viewport.project(anchorPoint);

  switch (kind) {
    case AnnotationKind.CIRCLE: {
      const {armLength, radiusInMeters} = annotation;
      const r = calcRadius(viewport, anchorPoint, radiusInMeters);
      const [ax, ay] = [Math.cos(angle) * r, Math.sin(angle) * r];
      const [tx, ty] = [Math.cos(angle) * (r + armLength), Math.sin(angle) * (r + armLength)];
      return {kind, x, y, ax, ay, tx, ty, r} as CircleAnnotationMarker;
    }
    case AnnotationKind.ARROW:
    case AnnotationKind.POINT: {
      const {armLength} = annotation;
      const [tx, ty] = [Math.cos(angle) * armLength, Math.sin(angle) * armLength];
      return {kind, x, y, tx, ty};
    }
    case AnnotationKind.TEXT:
    default:
      return {kind, x, y, tx: 0, ty: 0};
  }
}

export function isLeftOriented(angle: number): boolean {
  return angle > 90 || angle < -90;
}

/** Great-circle angular distance between two lng/lat points, in degrees. */
function angularDistanceDeg(a: [number, number], b: [number, number]): number {
  const toRad = Math.PI / 180;
  const phi1 = a[1] * toRad;
  const phi2 = b[1] * toRad;
  const dLambda = (b[0] - a[0]) * toRad;
  const cosD =
    Math.sin(phi1) * Math.sin(phi2) + Math.cos(phi1) * Math.cos(phi2) * Math.cos(dLambda);
  return Math.acos(Math.min(1, Math.max(-1, cosD))) / toRad;
}

// Round-trip tolerance in degrees. Front-facing points round-trip back to
// themselves within numerical error; occluded points resolve to a different
// (front) surface point that is several degrees away.
const GLOBE_VISIBILITY_TOLERANCE_DEG = 0.5;

/**
 * Geometric occlusion test for a point on the globe.
 *
 * In globe mode `viewport.project()` still returns valid screen coordinates for
 * points on the far (back) side of the planet, so DOM overlays like annotations
 * keep rendering "through" the opaque globe. Rather than approximate with a
 * lng/lat box, we project the point to screen space and unproject it back:
 * deck's `GlobeViewport.unproject` returns the *nearest* (front-facing) point on
 * the sphere along that ray. If the point comes back to (approximately) itself
 * it is on the visible hemisphere; otherwise the ray hit the front of the globe
 * first and the point is occluded. This uses the real projection math, so it
 * follows the true horizon and adapts to zoom/altitude automatically.
 */
export function isPointVisibleOnGlobe(point: [number, number], viewport: MapViewport): boolean {
  const projected = viewport.project(point);
  if (!projected || !Number.isFinite(projected[0]) || !Number.isFinite(projected[1])) {
    return false;
  }
  const roundTrip = viewport.unproject([projected[0], projected[1]]);
  if (!roundTrip || !Number.isFinite(roundTrip[0]) || !Number.isFinite(roundTrip[1])) {
    return false;
  }
  return angularDistanceDeg(point, [roundTrip[0], roundTrip[1]]) < GLOBE_VISIBILITY_TOLERANCE_DEG;
}

export function movePoint(
  annotation: Annotation,
  delta: {x: number; y: number},
  viewport: MapViewport
): Partial<Annotation> {
  const {anchorPoint} = annotation;
  const [px, py] = viewport.project(anchorPoint);
  const [lon, lat] = viewport.unproject([px + delta.x, py + delta.y]);
  return {anchorPoint: [lon, lat]};
}

export function moveText(
  annotation: Annotation,
  delta: {x: number; y: number},
  viewport: MapViewport
): Partial<Annotation> {
  const marker = makeMarker(annotation, viewport);
  const {kind, tx, ty} = marker;

  if (kind === AnnotationKind.TEXT) {
    return movePoint(annotation, delta, viewport);
  }
  if (!isAnnotationWithArm(annotation)) {
    return {};
  }

  const [tx1, ty1] = [tx + delta.x, ty + delta.y];
  const nextAngle = radiansToDegrees(Math.atan2(ty1, tx1));
  let nextArm: number;

  switch (kind) {
    case AnnotationKind.ARROW:
    case AnnotationKind.POINT:
      nextArm = Math.sqrt(tx1 * tx1 + ty1 * ty1);
      break;
    case AnnotationKind.CIRCLE:
      nextArm = Math.sqrt(tx1 * tx1 + ty1 * ty1) - (marker as CircleAnnotationMarker).r;
      break;
    default:
      nextArm = (annotation as AnnotationWithArm).armLength;
  }
  return {angle: nextAngle, armLength: nextArm};
}

export function resizeCircle(
  annotation: Annotation,
  delta: {x: number; y: number},
  viewport: MapViewport
): Partial<Annotation> {
  if (annotation.kind !== AnnotationKind.CIRCLE) return {};
  const {anchorPoint, radiusInMeters} = annotation;
  const shifted = addMetersToLngLat(anchorPoint, [radiusInMeters, 0, 0]) as [number, number];
  const [x] = viewport.project(shifted);
  const newPoint = viewport.unproject([x + delta.x, viewport.project(anchorPoint)[1]]);
  const dx = newPoint[0] - anchorPoint[0];
  const currentRadius = shifted[0] - anchorPoint[0];
  const ratio = currentRadius !== 0 ? (currentRadius + dx) / currentRadius : 1;
  return {radiusInMeters: Math.max(0, radiusInMeters * ratio)};
}

function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}
