// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {addMetersToLngLat} from '@math.gl/web-mercator';
import {
  Annotation,
  AnnotationWithArm,
  RulerAnnotation,
  AnnotationElevation,
  PointAnnotation
} from '@kepler.gl/types';
import {ELEVATION_UNIT_METERS, getElevationReferenceStatus} from '@kepler.gl/utils';
import {formatLineLengthLabel} from '@kepler.gl/layers';
import {point} from '@turf/helpers';
import distance from '@turf/distance';
import {normalizeRulerStyle} from '@kepler.gl/utils';
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
  projectPosition?: (lngLat: ReadonlyArray<number>) => number[];
  cameraPosition?: ReadonlyArray<number>;
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

export type PickElevation = (
  screen: [number, number],
  field: NonNullable<AnnotationElevation['field']>
) => {coordinate: ReadonlyArray<number>; value: number | null} | null;

/** A geographic vertical, not a screen-space line dropped straight down. */
export function getElevationGuide(
  annotation: PointAnnotation,
  viewport: MapViewport,
  globe = false
) {
  const elevation = annotation.elevation;
  if (!elevation || elevation.guide === 'none' || getElevationReferenceStatus(elevation))
    return null;
  const reference = elevation.reference!;
  const z =
    elevation.source === 'map'
      ? 0
      : reference.displayZ ?? reference.value * ELEVATION_UNIT_METERS[reference.unit];
  if (!Number.isFinite(z)) return null;
  const point: [number, number, number] = [annotation.anchorPoint[0], annotation.anchorPoint[1], z];
  if (globe && !isPointVisibleOnGlobe(point, viewport)) return null;
  const [x, y] = viewport.project(onNearestWorldCopy(annotation.anchorPoint, viewport));
  const [ex, ey] = viewport.project(onNearestWorldCopy(point, viewport));
  return [x, y, ex, ey].every(Number.isFinite) ? {ex: ex - x, ey: ey - y} : null;
}

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

export type RulerAnnotationMarker = BaseAnnotationMarker & {
  kind: AnnotationKind.RULER;
  /** Second endpoint and midpoint, relative to x/y. */
  ex: number;
  ey: number;
  mx: number;
  my: number;
  path?: string;
  labelAngle?: number;
  labelVisible?: boolean;
};

export function getRulerLabelAngle(marker: RulerAnnotationMarker): number {
  const angle = marker.labelAngle ?? (Math.atan2(marker.ey, marker.ex) * 180) / Math.PI;
  return angle >= 90 ? angle - 180 : angle < -90 ? angle + 180 : angle;
}

/** A screen-space translation of the projected line, including globe surface arcs. */
export function getRulerDimensionOffset(
  annotation: RulerAnnotation,
  marker: RulerAnnotationMarker
) {
  const style = normalizeRulerStyle(annotation.rulerStyle);
  const offset = style?.dimensionLine ? style.offset * (style.placement === 'below' ? 1 : -1) : 0;
  const angle = degreesToRadians(getRulerLabelAngle(marker));
  return {dx: -Math.sin(angle) * offset, dy: Math.cos(angle) * offset};
}

export type AnnotationMarker =
  | BaseAnnotationMarker
  | CircleAnnotationMarker
  | RulerAnnotationMarker;

function degreesToRadians(degree: number): number {
  return degree * (Math.PI / 180);
}

function offsetLngLatByMeters(point: LngLatAltitude, eastMeters: number): LngLatAltitude {
  const shifted = addMetersToLngLat(point, [eastMeters, 0, 0]);
  // addMetersToLngLat returns [lng, lat]; keep altitude so rim and center
  // project from the same height.
  const altitude = point[2];
  if (altitude !== undefined && Number.isFinite(altitude)) {
    return [shifted[0], shifted[1], altitude];
  }
  return [shifted[0], shifted[1]];
}

function calcRadius(viewport: MapViewport, point: LngLatAltitude, radiusInMeters: number): number {
  const [x, y] = viewport.project(point);
  const [x1, y1] = viewport.project(offsetLngLatByMeters(point, radiusInMeters));
  const dx = x1 - x;
  const dy = y1 - y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Choose the geographically closest wrapped world copy before projecting. A
 * distant copy can appear closer on screen under perspective projection.
 */
function projectClosestEndpoint(
  viewport: MapViewport,
  startPoint: LngLatAltitude,
  endPoint: LngLatAltitude
): [number, number] {
  const altitude = endPoint[2];
  const nearestWrap = Math.round((startPoint[0] - endPoint[0]) / 360);
  const wrappedPoint = [endPoint[0] + nearestWrap * 360, endPoint[1]];
  if (altitude !== undefined) wrappedPoint.push(altitude);
  const [x, y] = viewport.project(wrappedPoint);
  if (Number.isFinite(x) && Number.isFinite(y)) return [x, y];
  const [sx, sy] = viewport.project(startPoint);
  return [sx, sy];
}

/**
 * The copy of a point on the world nearest the view's centre. The map repeats the world past
 * ±180°, and a centre that crosses the antimeridian comes back within ±180°: projected as it is,
 * a point at 178° seen from a centre at -176° lands a whole world away, off screen.
 */
function onNearestWorldCopy(point: LngLatAltitude, viewport: MapViewport): LngLatAltitude {
  const shift = Math.round((viewport.longitude - point[0]) / 360) * 360;
  if (!shift || !Number.isFinite(shift)) return point;
  return point.length === 3 ? [point[0] + shift, point[1], point[2]] : [point[0] + shift, point[1]];
}

/** Sample the shortest surface arc, with at most 90 segments (two degrees each). */
function projectRulerArc(start: LngLatAltitude, end: LngLatAltitude, viewport: MapViewport) {
  const radians = Math.PI / 180;
  const lat = start[1] * radians;
  const endLat = end[1] * radians;
  const deltaLon = (end[0] - start[0]) * radians;
  const angle = angularDistanceDeg(start, end) * radians;
  const bearing = Math.atan2(
    Math.sin(deltaLon) * Math.cos(endLat),
    Math.cos(lat) * Math.sin(endLat) - Math.sin(lat) * Math.cos(endLat) * Math.cos(deltaLon)
  );
  // An even count includes the geographic midpoint exactly.
  const segments = Math.max(2, 2 * Math.ceil(angle / (4 * radians)));
  const pointAt = (fraction: number): LngLatAltitude => {
    if (fraction === 0) return start;
    if (fraction === 1) return end;
    const step = angle * fraction;
    const latitude = Math.asin(
      Math.max(
        -1,
        Math.min(
          1,
          Math.sin(lat) * Math.cos(step) + Math.cos(lat) * Math.sin(step) * Math.cos(bearing)
        )
      )
    );
    // Cancel the common cos(lat) factor before atan2 to avoid 0/0 and
    // cancellation at and near either pole.
    const longitude =
      start[0] * radians +
      Math.atan2(
        Math.sin(bearing) * Math.sin(step),
        Math.cos(lat) * Math.cos(step) - Math.sin(lat) * Math.sin(step) * Math.cos(bearing)
      );
    return [
      longitude / radians,
      latitude / radians,
      (start[2] || 0) + ((end[2] || 0) - (start[2] || 0)) * fraction
    ];
  };
  const points = Array.from({length: segments + 1}, (_, index) =>
    viewport.project(pointAt(index / segments))
  );
  const startVisible = isPointVisibleOnGlobe(start, viewport);
  const endVisible = isPointVisibleOnGlobe(end, viewport);
  if (startVisible === endVisible) {
    return {points, pathPoints: startVisible ? points : [], labelVisible: startVisible};
  }
  // Only partial rulers need clipping. Bisect the spherical arc, not its screen
  // chord, and keep the visible side of the horizon. Work is bounded per ruler.
  let visible = startVisible ? 0 : 1;
  let hidden = startVisible ? 1 : 0;
  for (let i = 0; i < 12; i++) {
    const middle = (visible + hidden) / 2;
    if (isPointVisibleOnGlobe(pointAt(middle), viewport)) visible = middle;
    else hidden = middle;
  }
  const pathPoints = points.filter((_, index) =>
    startVisible ? index / segments < visible : index / segments > visible
  );
  const boundary = viewport.project(pointAt(visible));
  if (startVisible) pathPoints.push(boundary);
  else pathPoints.unshift(boundary);
  return {
    points,
    pathPoints,
    labelVisible: startVisible ? 0.5 <= visible : 0.5 >= visible
  };
}

export function makeMarker(
  annotation: Annotation,
  viewport: MapViewport,
  isGlobeEnabled = false
): AnnotationMarker {
  const {kind} = annotation;
  const anchorPoint = onNearestWorldCopy(annotation.anchorPoint, viewport);
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
    case AnnotationKind.RULER: {
      const [endX, endY] = projectClosestEndpoint(viewport, anchorPoint, annotation.endPoint);
      const ex = endX - x;
      const ey = endY - y;
      if (isGlobeEnabled) {
        const {points, pathPoints, labelVisible} = projectRulerArc(
          anchorPoint,
          annotation.endPoint,
          viewport
        );
        const middle = (points.length - 1) / 2;
        const mx = points[middle][0] - x;
        const my = points[middle][1] - y;
        const before = points[middle - 1];
        const after = points[middle + 1];
        return {
          kind,
          x,
          y,
          tx: mx,
          ty: my,
          ex,
          ey,
          mx,
          my,
          labelVisible,
          path: pathPoints
            .map(([px, py], index) => `${index ? 'L' : 'M'}${px - x},${py - y}`)
            .join(' '),
          labelAngle: (Math.atan2(after[1] - before[1], after[0] - before[0]) * 180) / Math.PI
        };
      }
      const mx = ex / 2;
      const my = ey / 2;
      return {kind, x, y, tx: mx, ty: my, ex, ey, mx, my};
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
  display?: 'none';
  minWidth?: number;
  width?: number | 'max-content';
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  borderTop?: string;
  borderBottom?: string;
  transform?: string;
  transformOrigin?: string;
  maxWidth?: number;
  maxHeight?: number;
  overflow?: 'hidden';
  boxSizing?: 'border-box';
};

export function getAnnotationTextBoxStyle(
  annotation: Annotation,
  viewport: MapViewport,
  isGlobeEnabled = false
): AnnotationTextBoxStyle {
  const {textWidth, lineColor, lineWidth, autoSize, kind} = annotation;
  if (kind === AnnotationKind.TEXT && annotation.viewport) {
    const {anchor, margin} = annotation.viewport;
    const x = Math.max(0, Math.min(margin[0], viewport.width / 2));
    const y = Math.max(0, Math.min(margin[1], viewport.height / 2));
    const maxWidth = Math.max(0, viewport.width - 2 * x);
    const maxHeight = Math.max(0, viewport.height - 2 * y);
    return {
      width: autoSize ? 'max-content' : textWidth || 120,
      maxWidth,
      maxHeight,
      boxSizing: 'border-box',
      overflow: 'hidden',
      ...(!maxWidth || !maxHeight ? {display: 'none' as const} : {}),
      ...(anchor.includes('left')
        ? {left: x}
        : anchor.includes('right')
        ? {right: x}
        : {left: viewport.width / 2, transform: 'translateX(-50%)'}),
      ...(anchor.includes('top')
        ? {top: y}
        : anchor.includes('bottom')
        ? {bottom: y}
        : {top: viewport.height / 2, transform: 'translateY(-50%)'})
    };
  }
  const marker = makeMarker(annotation, viewport, isGlobeEnabled);
  const {x, y, tx, ty} = marker;
  const {side, vertical} = getTextPlacement(annotation);
  const px = x + tx;
  const py = y + ty;
  const style: AnnotationTextBoxStyle = autoSize
    ? {minWidth: 80, width: 'max-content'}
    : {width: textWidth || 120};

  if (kind === AnnotationKind.RULER) {
    if ((marker as RulerAnnotationMarker).labelVisible === false) style.display = 'none';
    style.left = px;
    style.top = py;
    // Follow the projected line (including map bearing/pitch), but never turn
    // the label upside down when the endpoints are reversed.
    const uprightAngle = getRulerLabelAngle(marker as RulerAnnotationMarker);
    const rulerStyle = normalizeRulerStyle(annotation.rulerStyle);
    const below = rulerStyle?.placement === 'below';
    const gap = Math.max(0, lineWidth) / 2 + 4 + (rulerStyle?.offset ?? 0);
    style.transformOrigin = below ? '50% 0%' : '50% 100%';
    style.transform = `translate(-50%, ${
      below ? '0%' : '-100%'
    }) rotate(${uprightAngle}deg) translateY(${below ? '' : '-'}${gap}px)`;
    return style;
  }

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
 * follows the true horizon and adapts to zoom automatically. Elevated points
 * instead need a segment test: their line of sight can miss the sphere, or hit
 * the sphere at a different longitude/latitude behind the annotation.
 */
export function isPointVisibleOnGlobe(
  point: ReadonlyArray<number>,
  viewport: MapViewport
): boolean {
  const projected = viewport.project(point);
  if (!projected || !Number.isFinite(projected[0]) || !Number.isFinite(projected[1])) {
    return false;
  }
  const [longitude, latitude, altitude = 0] = point;
  if (altitude > 0 && viewport.cameraPosition && viewport.projectPosition) {
    // Perspective projection can return finite screen coordinates behind the eye.
    if (projected[2] > 1) return false;
    const [cx, cy, cz] = viewport.cameraPosition;
    const [x, y, z] = viewport.projectPosition(point);
    const [sx, sy, sz] = viewport.projectPosition([longitude, latitude]);
    const radiusSquared = sx * sx + sy * sy + sz * sz;
    const dx = x - cx;
    const dy = y - cy;
    const dz = z - cz;
    const lengthSquared = dx * dx + dy * dy + dz * dz;
    if (lengthSquared === 0) return false;
    // A ray intersection beyond the annotation cannot occlude it. Measure
    // the closest point to Earth's center on the finite sightline instead.
    const t = Math.min(1, Math.max(0, -(cx * dx + cy * dy + cz * dz) / lengthSquared));
    const px = cx + t * dx;
    const py = cy + t * dy;
    const pz = cz + t * dz;
    return px * px + py * py + pz * pz >= radiusSquared * (1 - 1e-12);
  }
  const roundTrip = viewport.unproject([projected[0], projected[1]]);
  if (!roundTrip || !Number.isFinite(roundTrip[0]) || !Number.isFinite(roundTrip[1])) {
    return false;
  }
  return angularDistanceDeg(point, [roundTrip[0], roundTrip[1]]) < GLOBE_VISIBILITY_TOLERANCE_DEG;
}

/** Partially visible rulers are clipped by their renderer; other annotations use the anchor. */
export function isAnnotationVisibleOnGlobe(annotation: Annotation, viewport: MapViewport): boolean {
  if (annotation.kind === AnnotationKind.TEXT && annotation.viewport) return true;
  return (
    isPointVisibleOnGlobe(annotation.anchorPoint, viewport) ||
    (annotation.kind === AnnotationKind.RULER &&
      isPointVisibleOnGlobe(annotation.endPoint, viewport))
  );
}

function moveCoordinate(
  point: LngLatAltitude,
  delta: {x: number; y: number},
  viewport: MapViewport,
  pickWorldPosition?: PickWorldPosition,
  projectedPoint?: [number, number]
): LngLatAltitude {
  const [px, py] = projectedPoint ?? viewport.project(onNearestWorldCopy(point, viewport));
  const screen: [number, number] = [px + delta.x, py + delta.y];
  const picked = normalizeAnchorPoint(pickWorldPosition?.(screen));
  if (picked) {
    return picked;
  }
  const [lon, lat] = viewport.unproject(screen);
  return Number.isFinite(lon) && Number.isFinite(lat) ? [lon, lat] : point;
}

function normalizeRulerLongitude(point: LngLatAltitude): LngLatAltitude {
  const longitude = ((((point[0] + 180) % 360) + 360) % 360) - 180;
  return point.length === 3 ? [longitude, point[1], point[2]] : [longitude, point[1]];
}

export function movePoint(
  annotation: Annotation,
  delta: {x: number; y: number},
  viewport: MapViewport,
  pickWorldPosition?: PickWorldPosition,
  pickElevation?: PickElevation
): Partial<Annotation> {
  if (
    annotation.kind === AnnotationKind.POINT &&
    annotation.elevation?.source !== 'map' &&
    annotation.elevation?.field
  ) {
    const [x, y] = viewport.project(onNearestWorldCopy(annotation.anchorPoint, viewport));
    const picked = pickElevation?.([x + delta.x, y + delta.y], annotation.elevation.field);
    const anchorPoint =
      normalizeAnchorPoint(picked?.coordinate) ??
      moveCoordinate(annotation.anchorPoint, delta, viewport, pickWorldPosition);
    return {
      anchorPoint,
      elevation: {...annotation.elevation, value: picked?.value ?? null}
    };
  }
  return {
    anchorPoint: moveCoordinate(annotation.anchorPoint, delta, viewport, pickWorldPosition)
  };
}

export function moveRulerEndpoint(
  annotation: Annotation,
  endpoint: 'start' | 'end',
  delta: {x: number; y: number},
  viewport: MapViewport,
  pickWorldPosition?: PickWorldPosition
): Partial<RulerAnnotation> {
  if (annotation.kind !== AnnotationKind.RULER) return {};
  if (endpoint === 'start') {
    return {
      // The start is the ruler's screen-space origin. Keep its unwrapped
      // longitude so dragging across the dateline stays on the visible world
      // copy; makeMarker wraps only the second endpoint relative to it.
      anchorPoint: moveCoordinate(annotation.anchorPoint, delta, viewport, pickWorldPosition)
    };
  }
  const marker = makeMarker(annotation, viewport) as RulerAnnotationMarker;
  const projectedEndPoint: [number, number] = [marker.x + marker.ex, marker.y + marker.ey];
  return {
    endPoint: normalizeRulerLongitude(
      moveCoordinate(annotation.endPoint, delta, viewport, pickWorldPosition, projectedEndPoint)
    )
  };
}

/** Live horizontal geodesic distance; omitted style retains the legacy editor format. */
export function getRulerDistanceLabel(annotation: Annotation): string {
  if (annotation.kind !== AnnotationKind.RULER) return '';
  if (
    ![annotation.anchorPoint, annotation.endPoint].every(
      coordinate =>
        Array.isArray(coordinate) && coordinate.length >= 2 && coordinate.every(Number.isFinite)
    )
  )
    return '';
  const lengthKm = distance(point(annotation.anchorPoint), point(annotation.endPoint));
  const style = normalizeRulerStyle(annotation.rulerStyle);
  if (style) {
    const unit = style.unit === 'auto' ? (lengthKm < 1 ? 'm' : 'km') : style.unit;
    const value = unit === 'm' ? lengthKm * 1000 : lengthKm;
    return `${style.prefix}${value.toFixed(style.precision)} ${unit}${style.suffix}`;
  }
  return formatLineLengthLabel(lengthKm);
}

export function moveText(
  annotation: Annotation,
  delta: {x: number; y: number},
  viewport: MapViewport,
  pickWorldPosition?: PickWorldPosition
): Partial<Annotation> {
  if (annotation.kind === AnnotationKind.TEXT && annotation.viewport) {
    const {anchor, margin} = annotation.viewport;
    return {
      viewport: {
        anchor,
        margin: [
          Math.max(
            0,
            Math.min(
              viewport.width / 2,
              margin[0] +
                (anchor.includes('left') ? delta.x : anchor.includes('right') ? -delta.x : 0)
            )
          ),
          Math.max(
            0,
            Math.min(
              viewport.height / 2,
              margin[1] +
                (anchor.includes('top') ? delta.y : anchor.includes('bottom') ? -delta.y : 0)
            )
          )
        ]
      }
    };
  }
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
  // Scale by the on-screen radius at the anchor's altitude. Unprojecting onto
  // the ground plane would change radius with pitch even when delta.x is 0.
  const currentScreenRadius = calcRadius(viewport, anchorPoint, radiusInMeters);
  if (!(currentScreenRadius > 0)) {
    return {radiusInMeters: Math.max(0, radiusInMeters)};
  }
  const ratio = (currentScreenRadius + delta.x) / currentScreenRadius;
  return {radiusInMeters: Math.max(0, radiusInMeters * ratio)};
}

function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}
