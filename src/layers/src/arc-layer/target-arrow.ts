// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {COORDINATE_SYSTEM, MapView, Viewport} from '@deck.gl/core';
import {BrushingExtension, DataFilterExtension} from '@deck.gl/extensions';
import {worldToPixels} from '@math.gl/web-mercator';

import {ArrowHeadLayer, getArrowHeadGeometry, KeplerGlobeView} from '@kepler.gl/deckgl-layers';
import {MAX_GPU_FILTERS, PROPERTY_GROUPS} from '@kepler.gl/constants';
import {VisConfigBoolean, VisConfigNumber, VisConfigSelection} from '@kepler.gl/types';

export const TARGET_ARROW_SHAPES = ['chevron', 'triangle', 'stealth'] as const;

const ARC_NUM_SEGMENTS = 50;
const EARTH_RADIUS_METERS = 6370972;

const brushingExtension = new BrushingExtension();
const dataFilterExtension = new DataFilterExtension({
  filterSize: MAX_GPU_FILTERS,
  // The stroke layer already reports filtered counts.
  countItems: false
});

export const targetArrowVisConfigs: {
  targetArrowEnabled: VisConfigBoolean;
  targetArrowShape: VisConfigSelection;
  targetArrowSize: VisConfigNumber;
} = {
  targetArrowEnabled: {
    defaultValue: false,
    type: 'boolean',
    label: 'layerVisConfigs.targetArrow',
    description: 'layerVisConfigs.targetArrowDescription',
    group: PROPERTY_GROUPS.stroke,
    property: 'targetArrowEnabled'
  },
  targetArrowShape: {
    defaultValue: 'chevron',
    type: 'select',
    label: 'layerVisConfigs.targetArrowShape',
    group: PROPERTY_GROUPS.stroke,
    property: 'targetArrowShape',
    options: [...TARGET_ARROW_SHAPES]
  },
  targetArrowSize: {
    defaultValue: 16,
    type: 'number',
    label: 'layerVisConfigs.targetArrowSize',
    group: PROPERTY_GROUPS.stroke,
    property: 'targetArrowSize',
    isRanged: false,
    range: [4, 64],
    step: 1,
    allowCustomValue: false
  }
};

type LngLatZ = [number, number, number];

type StrokeRecord = {
  index: number;
  sourcePosition: number[];
  targetPosition: number[];
};

type ArrowHost = {
  id: string;
  config: {
    visConfig: {
      targetArrowEnabled?: boolean;
      targetArrowShape?: string;
      targetArrowSize?: number;
      opacity?: number;
    };
  };
  filteredIndex?: ArrayLike<number> | null;
  filteredIndexTrigger?: unknown;
  geoArrowVector0?: {length: number; get: (index: number) => unknown} | null;
  geoArrowVector1?: {length: number; get: (index: number) => unknown} | null;
};

export type TargetArrowOptions = {
  /** Great-circle stroke, used on the globe. */
  greatCircle: boolean;
  /** deck.gl ArcLayer getHeight. Straight lines use 0. */
  height: number;
  /** Multiplies endpoint altitude before the head is placed. */
  elevationScale: number;
};

const recordCache = new WeakMap<
  object,
  {source: unknown; target: unknown; filtered: unknown; records: StrokeRecord[]}
>();

function glslMod(x: number, y: number): number {
  return x - y * Math.floor(x / y);
}

/** Same longitude wrap as deck.gl ArcLayer's useShortestPath branch. */
function shortestPathEndpoints(source: LngLatZ, target: LngLatZ): [LngLatZ, LngLatZ] {
  let sourceLng = glslMod(source[0] + 180, 360) - 180;
  let targetLng = glslMod(target[0] + 180, 360) - 180;
  const deltaLng = targetLng - sourceLng;
  if (deltaLng > 180) targetLng -= 360;
  if (deltaLng < -180) sourceLng -= 360;
  return [
    [sourceLng, source[1], source[2]],
    [targetLng, target[1], target[2]]
  ];
}

function smoothstep(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

function segmentRatio(index: number): number {
  return smoothstep(index / (ARC_NUM_SEGMENTS - 1));
}

/** deck.gl arc-layer paraboloid. `height` is ArcLayer getHeight. */
function paraboloid(
  distance: number,
  sourceZ: number,
  targetZ: number,
  ratio: number,
  height: number
): number {
  const deltaZ = targetZ - sourceZ;
  const dh = distance * height;
  if (dh === 0) {
    return sourceZ + deltaZ * ratio;
  }
  const unitZ = deltaZ / dh;
  const p2 = unitZ * unitZ + 1;
  // step(deltaZ, 0) is 1 when deltaZ <= 0.
  const descending = deltaZ <= 0;
  const z0 = descending ? targetZ : sourceZ;
  const r = descending ? 1 - ratio : ratio;
  const inside = r * (p2 - r);
  if (inside <= 0) {
    return z0;
  }
  return Math.sqrt(inside) * dh + z0;
}

function interpolateFlat(source: LngLatZ, target: LngLatZ, ratio: number, height: number): LngLatZ {
  const distance = Math.hypot(source[0] - target[0], source[1] - target[1]);
  const z = paraboloid(distance, source[2], target[2], ratio, height);
  return [
    source[0] + (target[0] - source[0]) * ratio,
    source[1] + (target[1] - source[1]) * ratio,
    z
  ];
}

function angularDistance(source: LngLatZ, target: LngLatZ): number {
  const sourceLng = (source[0] * Math.PI) / 180;
  const sourceLat = (source[1] * Math.PI) / 180;
  const targetLng = (target[0] * Math.PI) / 180;
  const targetLat = (target[1] * Math.PI) / 180;
  const dLng = Math.sin((sourceLng - targetLng) / 2);
  const dLat = Math.sin((sourceLat - targetLat) / 2);
  const a = dLat * dLat + Math.cos(sourceLat) * Math.cos(targetLat) * dLng * dLng;
  return 2 * Math.asin(Math.min(1, Math.sqrt(Math.max(0, a))));
}

/** project_globe_ (z = 0) swizzled to .yxz, matching the arc shader. */
function globeDirectionYxz(lng: number, lat: number): LngLatZ {
  const lambda = (lng * Math.PI) / 180;
  const phi = (lat * Math.PI) / 180;
  const cosPhi = Math.cos(phi);
  const x = Math.sin(lambda) * cosPhi;
  const y = -Math.cos(lambda) * cosPhi;
  const z = Math.sin(phi);
  return [y, x, z];
}

function greatCirclePoint(
  source: LngLatZ,
  target: LngLatZ,
  ratio: number,
  height: number
): LngLatZ {
  const distance = angularDistance(source, target);
  let lng = target[0];
  let lat = target[1];
  if (distance >= 1e-8 && Math.abs(distance - Math.PI) < 0.001) {
    lng = (1 - ratio) * source[0] + ratio * target[0];
    lat = (1 - ratio) * source[1] + ratio * target[1];
  } else if (distance >= 1e-8) {
    const a = Math.sin((1 - ratio) * distance);
    const b = Math.sin(ratio * distance);
    const sourceDir = globeDirectionYxz(source[0], source[1]);
    const targetDir = globeDirectionYxz(target[0], target[1]);
    const mixed: LngLatZ = [
      sourceDir[0] * a + targetDir[0] * b,
      sourceDir[1] * a + targetDir[1] * b,
      sourceDir[2] * a + targetDir[2] * b
    ];
    lng = (Math.atan2(mixed[1], -mixed[0]) * 180) / Math.PI;
    lat = (Math.atan2(mixed[2], Math.hypot(mixed[0], mixed[1])) * 180) / Math.PI;
  }
  const z = paraboloid(distance * EARTH_RADIUS_METERS, source[2], target[2], ratio, height);
  return [lng, lat, z];
}

function asLngLatZ(position: number[]): LngLatZ {
  return [position[0], position[1], position[2] || 0];
}

function scaleAltitude(position: number[], elevationScale: number): LngLatZ {
  const [lng, lat, alt] = asLngLatZ(position);
  return [lng, lat, alt * elevationScale];
}

/**
 * Icon/mesh angle in degrees. 0 points up, positive turns clockwise on screen,
 * which matches a y-down pixel delta of (dx, dy) via atan2(dx, -dy).
 */
function screenAngle(from: number[], to: number[]): number | null {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  if (!Number.isFinite(dx) || !Number.isFinite(dy) || dx * dx + dy * dy < 1e-6) {
    return null;
  }
  return (Math.atan2(dx, -dy) * 180) / Math.PI;
}

function projectCommon(viewport: Viewport, position: LngLatZ): [number, number] {
  const pixels = worldToPixels(position, viewport.pixelProjectionMatrix);
  return [pixels[0], pixels[1]];
}

function flatCurvePixel(
  viewport: Viewport,
  source: LngLatZ,
  target: LngLatZ,
  ratio: number,
  height: number
): [number, number] {
  const [sourceLngLat, targetLngLat] = shortestPathEndpoints(source, target);
  const common = interpolateFlat(
    viewport.projectPosition(sourceLngLat),
    viewport.projectPosition(targetLngLat),
    ratio,
    height
  );
  return projectCommon(viewport, common);
}

/**
 * Screen direction of the last segment of an arc or line, in ArrowHeadLayer degrees.
 * Flat arcs follow deck.gl's paraboloid in common space. Globe strokes follow the
 * great-circle branch. Straight lines (height 0, not a great circle) use the
 * projected endpoints.
 */
export function targetArrowAngle(
  viewport: Viewport,
  sourceIn: number[],
  targetIn: number[],
  {greatCircle, height}: {greatCircle: boolean; height: number}
): number {
  const source = asLngLatZ(sourceIn);
  const target = asLngLatZ(targetIn);
  if (![...source, ...target].every(Number.isFinite)) {
    return 0;
  }

  if (!greatCircle && height === 0) {
    const [sourceLngLat, targetLngLat] = shortestPathEndpoints(source, target);
    return screenAngle(viewport.project(sourceLngLat), viewport.project(targetLngLat)) ?? 0;
  }

  const prevRatio = segmentRatio(ARC_NUM_SEGMENTS - 2);
  const endRatio = segmentRatio(ARC_NUM_SEGMENTS - 1);
  const from = greatCircle
    ? viewport.project(greatCirclePoint(source, target, prevRatio, height))
    : flatCurvePixel(viewport, source, target, prevRatio, height);
  const to = greatCircle
    ? viewport.project(greatCirclePoint(source, target, endRatio, height))
    : flatCurvePixel(viewport, source, target, endRatio, height);
  return screenAngle(from, to) ?? 0;
}

function readArrowPoint(value: unknown): LngLatZ | null {
  if (!value) {
    return null;
  }
  const point = value as {
    get?: (index: number) => number;
    length?: number;
    [index: number]: number;
  };
  const lng = typeof point.get === 'function' ? point.get(0) : point[0];
  const lat = typeof point.get === 'function' ? point.get(1) : point[1];
  const rawAlt =
    typeof point.get === 'function'
      ? point.length && point.length > 2
        ? point.get(2)
        : 0
      : point[2];
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
    return null;
  }
  return [lng, lat, Number.isFinite(rawAlt) ? rawAlt : 0];
}

function strokeRecords(layer: ArrowHost, formattedData: {data?: unknown}): StrokeRecord[] {
  const rows = formattedData?.data;
  if (Array.isArray(rows)) {
    return rows as StrokeRecord[];
  }

  const source = layer.geoArrowVector0;
  const target = layer.geoArrowVector1;
  if (!source || !target) {
    return [];
  }
  const filtered = layer.filteredIndexTrigger;
  const cached = recordCache.get(layer);
  if (
    cached &&
    cached.source === source &&
    cached.target === target &&
    cached.filtered === filtered
  ) {
    return cached.records;
  }

  const records: StrokeRecord[] = [];
  const count = Math.min(source.length, target.length);
  for (let index = 0; index < count; index++) {
    if (layer.filteredIndex && !layer.filteredIndex[index]) {
      continue;
    }
    const sourcePosition = readArrowPoint(source.get(index));
    const targetPosition = readArrowPoint(target.get(index));
    if (!sourcePosition || !targetPosition) {
      continue;
    }
    records.push({index, sourcePosition, targetPosition});
  }
  recordCache.set(layer, {source, target, filtered, records});
  return records;
}

function hoverRecord(
  layer: ArrowHost,
  formattedData: {data?: unknown},
  hoveredObject?: {
    index?: number;
    sourcePosition?: number[];
    targetPosition?: number[];
  } | null
): StrokeRecord | null {
  if (!hoveredObject) {
    return null;
  }
  // Neighbor arcs share a row index, so the picked object identifies the stroke.
  if (Array.isArray(hoveredObject.sourcePosition) && Array.isArray(hoveredObject.targetPosition)) {
    return {
      index: hoveredObject.index ?? 0,
      sourcePosition: hoveredObject.sourcePosition,
      targetPosition: hoveredObject.targetPosition
    };
  }
  if (!Number.isFinite(hoveredObject.index)) {
    return null;
  }
  return (
    strokeRecords(layer, formattedData).find(record => record.index === hoveredObject.index) ?? null
  );
}

function viewportFromMapState(mapState): Viewport | null {
  if (!mapState?.width || !mapState?.height) {
    return null;
  }
  const view = mapState.globe?.enabled
    ? new KeplerGlobeView({resolution: 5})
    : new MapView({farZMultiplier: 1.2});
  return view.makeViewport({
    width: mapState.width,
    height: mapState.height,
    viewState: mapState
  });
}

export function createTargetArrowLayer({
  layer,
  formattedData,
  defaultLayerProps,
  mapState,
  interactionConfig,
  greatCircle,
  height,
  elevationScale,
  getColor,
  hoveredObject,
  highlightColor,
  highlight = false
}: {
  layer: ArrowHost;
  formattedData: {data?: unknown; getFilterValue?: (d: StrokeRecord) => number[]};
  defaultLayerProps: {visible?: boolean; filterRange?: unknown; hidden?: boolean};
  mapState: {
    width?: number;
    height?: number;
    latitude?: number;
    longitude?: number;
    zoom?: number;
    pitch?: number;
    bearing?: number;
    globe?: {enabled?: boolean};
    layerParameters?: object;
  };
  interactionConfig?: {brush?: {enabled?: boolean; config?: {size?: number}}};
  greatCircle: boolean;
  height: number;
  elevationScale: number;
  getColor: any;
  hoveredObject?: {
    index?: number;
    sourcePosition?: number[];
    targetPosition?: number[];
  } | null;
  highlightColor?: number[];
  /** One head, painted in highlightColor over the hovered stroke. */
  highlight?: boolean;
}): ArrowHeadLayer | null {
  const {visConfig} = layer.config;
  if (!visConfig.targetArrowEnabled) {
    return null;
  }
  const records = highlight
    ? hoverRecord(layer, formattedData, hoveredObject)
    : strokeRecords(layer, formattedData);
  const data = Array.isArray(records) ? records : records ? [records] : [];
  if (!data.length) {
    return null;
  }
  const viewport = viewportFromMapState(mapState);
  if (!viewport) {
    return null;
  }

  const shape = visConfig.targetArrowShape || 'chevron';
  const size = Number.isFinite(visConfig.targetArrowSize) ? visConfig.targetArrowSize : 16;
  const scale = Number.isFinite(elevationScale) ? elevationScale : 1;
  const brush = interactionConfig?.brush;
  const color = highlight ? highlightColor || getColor : getColor;

  return new ArrowHeadLayer({
    id: `${layer.id}-arrow-head-${shape}${highlight ? '-hovered' : ''}`,
    data,
    coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
    pickable: false,
    wrapLongitude: true,
    visible: defaultLayerProps.visible,
    hidden: defaultLayerProps.hidden,
    opacity: highlight ? 1 : visConfig.opacity,
    parameters: {
      depthTest: true,
      depthMask: false,
      cull: false,
      ...(mapState.layerParameters || {})
    },
    billboard: true,
    stroked: false,
    filled: true,
    antialiasing: false,
    radiusUnits: 'pixels',
    radiusScale: 1,
    radiusMinPixels: 0,
    radiusMaxPixels: 256,
    getPosition: (d: StrokeRecord) => [
      d.targetPosition[0],
      d.targetPosition[1],
      (d.targetPosition[2] || 0) * scale
    ],
    getSourcePosition: (d: StrokeRecord): LngLatZ => [
      d.sourcePosition[0],
      d.sourcePosition[1],
      d.sourcePosition[2] || 0
    ],
    getTargetPosition: (d: StrokeRecord): LngLatZ => [
      d.targetPosition[0],
      d.targetPosition[1],
      d.targetPosition[2] || 0
    ],
    getRadius: size,
    getAngle: (d: any) =>
      targetArrowAngle(
        viewport,
        scaleAltitude(d.sourcePosition, scale),
        scaleAltitude(d.targetPosition, scale),
        {greatCircle, height}
      ),
    getFillColor: color,
    iconGeometry: getArrowHeadGeometry(shape),
    ...(highlight
      ? {}
      : {
          extensions: [dataFilterExtension, brushingExtension],
          filterRange: defaultLayerProps.filterRange,
          getFilterValue: formattedData.getFilterValue,
          brushingEnabled: Boolean(brush?.enabled),
          brushingRadius: (brush?.config?.size || 0) * 1000,
          brushingTarget: 'source_target'
        }),
    updateTriggers: {
      getAngle: [
        mapState.longitude,
        mapState.latitude,
        mapState.zoom,
        mapState.pitch,
        mapState.bearing,
        mapState.width,
        mapState.height,
        greatCircle,
        height,
        scale
      ],
      getFillColor: color,
      getRadius: size,
      getFilterValue: formattedData.getFilterValue,
      getPosition: scale,
      getSourcePosition: scale,
      getTargetPosition: scale
    }
  });
}

/** The stroke heads, plus a highlight head when a row of this layer is hovered. */
export function createTargetArrowLayers(
  args: Parameters<typeof createTargetArrowLayer>[0]
): ArrowHeadLayer[] {
  const arrowLayer = createTargetArrowLayer(args);
  if (!arrowLayer) {
    return [];
  }
  if (!args.hoveredObject) {
    return [arrowLayer];
  }
  const hoveredArrowLayer = createTargetArrowLayer({
    ...args,
    highlight: true,
    getColor: args.highlightColor || args.getColor
  });
  return hoveredArrowLayer ? [arrowLayer, hoveredArrowLayer] : [arrowLayer];
}
