// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {addMetersToLngLat} from '@math.gl/web-mercator';
import {Annotation, AnnotationWithArm} from '@kepler.gl/types';
import {
  AnnotationKind,
  AnnotationTextSide,
  AnnotationTextVerticalPosition,
  ANNOTATION_ANGLE_BY_PLACEMENT,
  isAnnotationWithArm,
  isLeftOriented,
  isBelowOriented,
  textPlacementFromAngle
} from '@kepler.gl/constants';

export type LngLatAltitude = [number, number] | [number, number, number];

export type MapViewport = {
  project: (lngLat: ReadonlyArray<number>) => number[];
  unproject: (xy: ReadonlyArray<number>) => number[];
  longitude: number;
  latitude: number;
  width: number;
  height: number;
  zoom: number;
};

/** Screen-space pick that returns a world position, optionally with altitude. */
export type PickWorldPosition = (
  screen: [number, number]
) => ReadonlyArray<number> | null | undefined;

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

function calcRadius(viewport: MapViewport, point: LngLatAltitude, radiusInMeters: number): number {
  const [x, y] = viewport.project(point);
  const shifted = addMetersToLngLat(point, [radiusInMeters, 0, 0]);
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

export {isLeftOriented, isBelowOriented, textPlacementFromAngle};

export type AnnotationTextPlacement = {
  side: AnnotationTextSide;
  vertical: AnnotationTextVerticalPosition;
};

export function getTextPlacement(annotation: Annotation): AnnotationTextPlacement {
  const side: AnnotationTextSide =
    annotation.textSide ??
    (isAnnotationWithArm(annotation) && isLeftOriented(annotation.angle) ? 'left' : 'right');
  const vertical: AnnotationTextVerticalPosition =
    annotation.textVerticalPosition ??
    (isAnnotationWithArm(annotation) && isBelowOriented(annotation.angle) ? 'below' : 'above');
  return {side, vertical};
}

export function angleForTextPlacement(
  side: AnnotationTextSide,
  vertical: AnnotationTextVerticalPosition
): number {
  return ANNOTATION_ANGLE_BY_PLACEMENT[`${side}-${vertical}`];
}

export type AnnotationTextBoxStyle = {
  minWidth?: number;
  width?: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  borderTop?: string;
  borderBottom?: string;
};

export function getAnnotationTextBoxStyle(
  annotation: Annotation,
  viewport: MapViewport
): AnnotationTextBoxStyle {
  const {textWidth, lineColor, lineWidth, autoSize, kind} = annotation;
  const {x, y, tx, ty} = makeMarker(annotation, viewport);
  const {side, vertical} = getTextPlacement(annotation);
  const px = x + tx;
  const py = y + ty;
  const style: AnnotationTextBoxStyle = autoSize ? {minWidth: 80} : {width: textWidth || 120};

  if (vertical === 'below') {
    style.top = py;
    if (kind !== AnnotationKind.TEXT) {
      style.borderTop = `${lineWidth}px solid ${lineColor}`;
    }
  } else {
    style.bottom = viewport.height - py;
    if (kind !== AnnotationKind.TEXT) {
      style.borderBottom = `${lineWidth}px solid ${lineColor}`;
    }
  }

  if (kind === AnnotationKind.TEXT && side !== 'left') {
    // TEXT has no leader; keep the box centered on the anchor unless it is
    // explicitly placed on the left (matches pre-placement TEXT rendering).
    style.left = px - (textWidth || 80) / 2;
  } else if (side === 'left') {
    style.right = viewport.width - px;
  } else {
    style.left = px;
  }

  return style;
}

export function normalizeAnchorPoint(
  coord: ReadonlyArray<number> | null | undefined
): LngLatAltitude | null {
  if (!coord || coord.length < 2 || !Number.isFinite(coord[0]) || !Number.isFinite(coord[1])) {
    return null;
  }
  if (coord.length >= 3 && Number.isFinite(coord[2])) {
    return [coord[0], coord[1], coord[2]];
  }
  return [coord[0], coord[1]];
}

/** Great-circle angular distance between two lng/lat points, in degrees. */
function angularDistanceDeg(a: ReadonlyArray<number>, b: ReadonlyArray<number>): number {
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
export function isPointVisibleOnGlobe(
  point: ReadonlyArray<number>,
  viewport: MapViewport
): boolean {
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
  viewport: MapViewport,
  pickWorldPosition?: PickWorldPosition
): Partial<Annotation> {
  const {anchorPoint} = annotation;
  const [px, py] = viewport.project(anchorPoint);
  const screen: [number, number] = [px + delta.x, py + delta.y];
  const picked = normalizeAnchorPoint(pickWorldPosition?.(screen));
  if (picked) {
    return {anchorPoint: picked};
  }
  const [lon, lat] = viewport.unproject(screen);
  return {anchorPoint: Number.isFinite(lon) && Number.isFinite(lat) ? [lon, lat] : anchorPoint};
}

export function moveText(
  annotation: Annotation,
  delta: {x: number; y: number},
  viewport: MapViewport,
  pickWorldPosition?: PickWorldPosition
): Partial<Annotation> {
  const marker = makeMarker(annotation, viewport);
  const {kind, tx, ty} = marker;

  if (kind === AnnotationKind.TEXT) {
    return movePoint(annotation, delta, viewport, pickWorldPosition);
  }
  if (!isAnnotationWithArm(annotation)) {
    return {};
  }

  const [tx1, ty1] = [tx + delta.x, ty + delta.y];
  const nextAngle = radiansToDegrees(Math.atan2(ty1, tx1));
  const {side, vertical} = textPlacementFromAngle(nextAngle);
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
  return {
    angle: nextAngle,
    armLength: nextArm,
    textSide: side,
    textVerticalPosition: vertical
  };
}

export function resizeCircle(
  annotation: Annotation,
  delta: {x: number; y: number},
  viewport: MapViewport
): Partial<Annotation> {
  if (annotation.kind !== AnnotationKind.CIRCLE) return {};
  const {anchorPoint, radiusInMeters} = annotation;
  const shifted = addMetersToLngLat(anchorPoint, [radiusInMeters, 0, 0]);
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
