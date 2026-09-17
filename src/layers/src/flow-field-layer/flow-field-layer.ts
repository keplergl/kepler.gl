// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Flow Field / Streamlines kepler.gl layer.
// Ventusky-style animated streamlines over a lat/lng field from:
//   - u/v components, or
//   - speed + direction, or
//   - altitude / elevation (downhill gradient → u/v).
// Positions can come from lat/lng columns or GeoJSON feature centroids.
// Rendered with deck.gl TripsLayer.
//
// Not the origin–destination Flow layer, and not @deck.gl-community geo-layers
// ParticleLayer / WindLayer (those take a station WindField).

import {WebMercatorViewport} from '@deck.gl/core';
import {ClipExtension} from '@deck.gl/extensions';
import {PathLayer} from '@deck.gl/layers';
import {TripsLayer} from '@deck.gl/geo-layers';
import {GEOJSON_FIELDS, GEOARROW_METADATA_KEY, LAYER_TYPES} from '@kepler.gl/constants';
import {default as KeplerTable} from '@kepler.gl/table';
import {Field} from '@kepler.gl/types';
import {DATA_TYPES} from 'type-analyzer';
import Layer, {LayerBaseConfigPartial} from '../base-layer';
import {getCentroidFromGeometry, parseGeoJsonRawFeature} from '../geojson-layer/geojson-utils';
import {FindDefaultLayerPropsReturnValue} from '../layer-utils';
import FlowFieldLayerIcon from './flow-field-layer-icon';

type FlowPoint = {lat: number; lng: number; u: number; v: number; alt?: number};
/** Point with a scalar height used to derive downhill u/v. */
type AltitudePoint = {lat: number; lng: number; alt: number};
type FlowTrip = {path: number[][]; timestamps: number[]; speed: number};
type FlowGrid = {
  cols: number;
  rows: number;
  lngs: number[];
  lats: number[];
  u: Float32Array;
  v: Float32Array;
  /** Terrain / height in meters; used as path Z when present. */
  alt: Float32Array | null;
  filled: Uint8Array | null;
  minSpeed: number;
  maxSpeed: number;
};

// Animate currentTime inside deck.gl so we never call kepler's onRedrawNeeded.
// That callback dispatches updateMap({}) every frame, which MapViewStateContext
// treats as an external viewport change and snaps pan/zoom back.
class AnimatedTripsLayer extends TripsLayer<any, {cycleSeconds?: number; seamlessLoop?: boolean}> {
  draw(params: any) {
    // Skip until the PathLayer model exists. Calling PathLayer.draw without it
    // (or with empty/invalid geometry mid-update) can throw and disable the layer.
    if (!this.state.model) {
      this.setNeedsRedraw();
      return;
    }
    const cycle = Math.max(1, this.props.cycleSeconds || 20);
    const phase = (performance.now() / 1000 / cycle) % 1;
    const currentTime = this.props.seamlessLoop ? 1 + phase : phase;
    const {fadeTrail, trailLength} = this.props;
    this.state.model.shaderInputs.setProps({trips: {fadeTrail, trailLength, currentTime}});
    PathLayer.prototype.draw.call(this, params);
    this.setNeedsRedraw();
  }
}

AnimatedTripsLayer.layerName = 'AnimatedTripsLayer';

const clipExtension = new ClipExtension();

export const FlowFieldColumnMode = {
  UV: 'UV',
  SPEED_DIR: 'SPEED_DIR',
  ELEVATION: 'ELEVATION'
} as const;

/** Legacy GeoJSON-specific modes; normalized to the three modes above. */
const LEGACY_GEOJSON_COLUMN_MODE = {
  GEOJSON_UV: FlowFieldColumnMode.UV,
  GEOJSON_SPEED_DIR: FlowFieldColumnMode.SPEED_DIR,
  GEOJSON_ELEVATION: FlowFieldColumnMode.ELEVATION
} as const;

const SUPPORTED_ANALYZER_TYPES = {
  [DATA_TYPES.GEOMETRY]: true,
  [DATA_TYPES.GEOMETRY_FROM_STRING]: true,
  [DATA_TYPES.PAIR_GEOMETRY_FROM_STRING]: true
};

// Position source is chosen via Lat/Lng ↔ GeoJSON tabs (columnGroups).
const POSITION_COLUMN_GROUPS = [
  {key: 'latlng', label: 'Lat / Lng', columns: ['lat', 'lng']},
  {key: 'geojson', label: 'GeoJSON', columns: ['geojson']}
];

const SUPPORTED_COLUMN_MODES = [
  {
    key: FlowFieldColumnMode.UV,
    label: 'U / V components',
    requiredColumns: ['u', 'v'],
    optionalColumns: ['altitude'],
    columnGroups: POSITION_COLUMN_GROUPS
  },
  {
    key: FlowFieldColumnMode.SPEED_DIR,
    label: 'Speed / direction',
    requiredColumns: ['speed', 'direction'],
    optionalColumns: ['altitude'],
    columnGroups: POSITION_COLUMN_GROUPS
  },
  {
    key: FlowFieldColumnMode.ELEVATION,
    label: 'Altitude (downhill)',
    requiredColumns: ['altitude'],
    optionalColumns: [],
    columnGroups: POSITION_COLUMN_GROUPS
  }
];

const COLUMN_LABELS = {
  lat: 'Lat',
  lng: 'Lng',
  geojson: 'GeoJSON',
  u: 'U (Eastward)',
  v: 'V (Northward)',
  speed: 'Speed',
  direction: 'Direction (From)',
  altitude: 'Altitude'
};

function normalizeColumnMode(mode: string | undefined): string {
  if (!mode) {
    return FlowFieldColumnMode.UV;
  }
  return LEGACY_GEOJSON_COLUMN_MODE[mode as keyof typeof LEGACY_GEOJSON_COLUMN_MODE] || mode;
}

function hasGeojsonPosition(columns: {geojson?: {fieldIdx?: number; value?: unknown}}): boolean {
  const geo = columns?.geojson;
  return Boolean(geo && typeof geo.fieldIdx === 'number' && geo.fieldIdx > -1 && geo.value);
}

function hasLatLngPosition(columns: {
  lat?: {fieldIdx?: number; value?: unknown};
  lng?: {fieldIdx?: number; value?: unknown};
}): boolean {
  const {lat, lng} = columns || {};
  return Boolean(
    lat &&
      typeof lat.fieldIdx === 'number' &&
      lat.fieldIdx > -1 &&
      lat.value &&
      lng &&
      typeof lng.fieldIdx === 'number' &&
      lng.fieldIdx > -1 &&
      lng.value
  );
}

function isElevationMode(mode: string | undefined): boolean {
  return normalizeColumnMode(mode) === FlowFieldColumnMode.ELEVATION;
}

function isSpeedDirMode(mode: string | undefined): boolean {
  return normalizeColumnMode(mode) === FlowFieldColumnMode.SPEED_DIR;
}

// Auto-detect requires exact `u` / `v` column names.
const DEFAULT_U_FIELD_NAMES = ['u'];
const DEFAULT_V_FIELD_NAMES = ['v'];
const LAT_FIELD_NAMES = ['lat', 'latitude'];
const LNG_FIELD_NAMES = ['lon', 'lng', 'long', 'longitude'];
const ALT_FIELD_NAMES = ['altitude', 'alt', 'elevation', 'elev', 'elv', 'height', 'z'];

function findNamedField(fields: Field[], names: string[]) {
  const wanted = names.map(name => name.toLowerCase());
  for (const name of wanted) {
    const field = fields.find(f => String(f.name).toLowerCase() === name);
    if (field) {
      return field;
    }
  }
  return null;
}

function fieldToColumn(field: Field | null | undefined, fields: Field[] = []) {
  if (!field) {
    return null;
  }
  const fieldIdx = Number.isInteger(field.fieldIdx) ? field.fieldIdx : fields.indexOf(field);
  return {
    value: field.name,
    fieldIdx: fieldIdx > -1 ? fieldIdx : -1
  };
}

function latLngColumnsFromDataset(dataset: KeplerTable) {
  const pair = dataset.fieldPairs?.[0]?.pair;
  if (pair?.lat && pair?.lng) {
    return {
      lat: pair.lat,
      lng: pair.lng,
      altitude: pair.altitude || null
    };
  }
  const fields = dataset.fields || [];
  const lat = fieldToColumn(findNamedField(fields, LAT_FIELD_NAMES), fields);
  const lng = fieldToColumn(findNamedField(fields, LNG_FIELD_NAMES), fields);
  if (!lat || !lng) {
    return null;
  }
  return {lat, lng, altitude: null};
}

function geojsonFieldNames(fields: Field[]): string[] {
  return fields
    .filter(
      f =>
        (f.type === 'geojson' || f.type === 'geoarrow') &&
        f.analyzerType &&
        SUPPORTED_ANALYZER_TYPES[f.analyzerType]
    )
    .map(f => f.name);
}

function getGeoArrowEncoding(field: Field | undefined): string | undefined {
  if (!field?.metadata) {
    return undefined;
  }
  if (typeof (field.metadata as Map<string, string>).get === 'function') {
    return (field.metadata as Map<string, string>).get(GEOARROW_METADATA_KEY) || undefined;
  }
  return (field.metadata as Record<string, string>)[GEOARROW_METADATA_KEY];
}

/** Centroid [lng, lat] from a raw GeoJSON / WKT / WKB cell value. */
function centroidFromRawFeature(
  rawFeature: unknown,
  geoArrowEncoding?: string | null
): [number, number] | null {
  const feature = parseGeoJsonRawFeature(rawFeature, geoArrowEncoding);
  if (!feature?.geometry) {
    return null;
  }
  const centroid = getCentroidFromGeometry(feature.geometry);
  if (!centroid || !Number.isFinite(centroid[0]) || !Number.isFinite(centroid[1])) {
    return null;
  }
  return [centroid[0], centroid[1]];
}

export const flowFieldVisConfigs = {
  opacity: {
    type: 'number',
    defaultValue: 0.55,
    label: 'layerVisConfigs.opacity',
    isRanged: false,
    range: [0, 1],
    step: 0.01,
    property: 'opacity',
    allowCustomValue: false
  },
  linesPerScreen: {
    type: 'number',
    defaultValue: 7500,
    label: 'layerVisConfigs.flowField.linesPerScreen',
    description: 'layerVisConfigs.flowField.linesPerScreenDescription',
    isRanged: false,
    range: [10, 20000],
    step: 10,
    property: 'linesPerScreen'
  },
  zoomResponse: {
    type: 'number',
    defaultValue: 0.25,
    label: 'layerVisConfigs.flowField.zoomResponse',
    description: 'layerVisConfigs.flowField.zoomResponseDescription',
    isRanged: false,
    range: [0, 1],
    step: 0.01,
    property: 'zoomResponse'
  },
  strokeWidth: {
    type: 'number',
    defaultValue: 3,
    label: 'layerVisConfigs.flowField.strokeWidth',
    isRanged: false,
    range: [0.2, 50],
    step: 0.1,
    property: 'strokeWidth',
    allowCustomValue: false
  },
  colorBySpeed: {
    type: 'boolean',
    defaultValue: false,
    label: 'layerVisConfigs.flowField.colorBySpeed',
    description: 'layerVisConfigs.flowField.colorBySpeedDescription',
    property: 'colorBySpeed'
  },
  colorRange: 'colorRange',
  trailLength: {
    type: 'number',
    defaultValue: 22,
    label: 'layerVisConfigs.flowField.trailLength',
    isRanged: false,
    range: [1, 100],
    step: 1,
    property: 'trailLength'
  },
  cycleSeconds: {
    type: 'number',
    defaultValue: 20,
    label: 'layerVisConfigs.flowField.cycle',
    description: 'layerVisConfigs.flowField.cycleDescription',
    isRanged: false,
    range: [2, 180],
    step: 1,
    property: 'cycleSeconds'
  },
  lineLifetime: {
    type: 'number',
    defaultValue: 0.55,
    label: 'layerVisConfigs.flowField.lineLifetime',
    description: 'layerVisConfigs.flowField.lineLifetimeDescription',
    isRanged: false,
    range: [0.05, 1],
    step: 0.01,
    property: 'lineLifetime'
  },
  seamlessLoop: {
    type: 'boolean',
    defaultValue: true,
    label: 'layerVisConfigs.flowField.seamlessLoop',
    description: 'layerVisConfigs.flowField.seamlessLoopDescription',
    property: 'seamlessLoop'
  },
  smoothing: {
    type: 'number',
    defaultValue: 4,
    label: 'layerVisConfigs.flowField.smoothing',
    description: 'layerVisConfigs.flowField.smoothingDescription',
    isRanged: false,
    range: [0, 12],
    step: 1,
    property: 'smoothing'
  },
  gridResolution: {
    type: 'number',
    defaultValue: 64,
    label: 'layerVisConfigs.flowField.gridResolution',
    description: 'layerVisConfigs.flowField.gridResolutionDescription',
    isRanged: false,
    range: [16, 256],
    step: 8,
    property: 'gridResolution'
  },
  elevationMultiplier: {
    type: 'number',
    defaultValue: 1,
    label: 'layerVisConfigs.flowField.elevationMultiplier',
    description: 'layerVisConfigs.flowField.elevationMultiplierDescription',
    isRanged: false,
    range: [0, 1000],
    step: 1,
    property: 'elevationMultiplier',
    allowCustomValue: true,
    customInputLabel: 'layerVisConfigs.flowField.customElevation'
  }
};

const METERS_PER_DEG_LAT = 111320;
const MAX_STEPS = 96;
const FINE_CELL = 1 / 4096;
// Cap axis size so smoothing (O(cells * radius^2)) stays interactive on the main thread.
const MAX_GRID_AXIS = 512;
const SETTLE_MS = 180;

function degToStride(targetDeg) {
  return Math.max(1, Math.round(targetDeg / FINE_CELL));
}

function logMix(a, b, t) {
  const la = Math.log(Math.max(a, 1e-12));
  const lb = Math.log(Math.max(b, 1e-12));
  return Math.exp(la + (lb - la) * t);
}

function parseHexColor(hex) {
  const h = String(hex || '').replace('#', '');
  if (h.length < 6) {
    return [186, 233, 223];
  }
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function paletteRgb(colorRange) {
  const colors = colorRange?.colors || [];
  return colors.map(c => (Array.isArray(c) ? c.slice(0, 3) : parseHexColor(c)));
}

function speedToColor(speed, minSpeed, maxSpeed, colorRange, opacity) {
  const palette = paletteRgb(colorRange);
  const alpha = Math.round(opacity * 255);
  if (!palette.length) {
    return [186, 233, 223, alpha];
  }
  if (palette.length === 1) {
    return [...palette[0], alpha];
  }
  // Map over the actual speed domain so the first and last palette colors
  // are used at min and max (not 0 → absolute max, which rarely hits the ends).
  const span = Math.max(maxSpeed - minSpeed, 1e-6);
  const t = Math.max(0, Math.min(1, (speed - minSpeed) / span));
  // Discrete bands: each palette stop owns an equal share, including endpoints.
  const i = Math.min(palette.length - 1, Math.max(0, Math.floor(t * palette.length - 1e-9)));
  const c = palette[i] || palette[0];
  return [c[0], c[1], c[2], alpha];
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

/** TripsLayer crashes on undefined path points (reads position[0]). */
function isValidTrip(trip: FlowTrip | null | undefined): trip is FlowTrip {
  if (!trip?.path || !trip?.timestamps) {
    return false;
  }
  const {path, timestamps} = trip;
  if (!Array.isArray(path) || path.length < 2 || timestamps.length !== path.length) {
    return false;
  }
  for (let i = 0; i < path.length; i++) {
    const point = path[i];
    if (!point || point.length < 2 || !isFiniteNumber(point[0]) || !isFiniteNumber(point[1])) {
      return false;
    }
    if (!isFiniteNumber(timestamps[i])) {
      return false;
    }
  }
  return true;
}

function viewSignature(mapState) {
  return [
    Math.round(mapState.longitude * 1000),
    Math.round(mapState.latitude * 1000),
    Math.round(mapState.zoom * 40),
    Math.round(mapState.width || 0),
    Math.round(mapState.height || 0),
    Math.round(mapState.pitch || 0),
    Math.round(mapState.bearing || 0)
  ].join(':');
}

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function meteorologicalToUV(speed, directionDeg) {
  const rad = (directionDeg * Math.PI) / 180;
  return {
    u: -speed * Math.sin(rad),
    v: -speed * Math.cos(rad)
  };
}

function uniqueSorted(values: number[], epsilon: number) {
  const sorted = values.slice().sort((a, b) => a - b);
  const out: number[] = [];
  for (const value of sorted) {
    if (!out.length || Math.abs(value - out[out.length - 1]) > epsilon) {
      out.push(value);
    }
  }
  return out;
}

function medianSpacing(values: number[]) {
  if (values.length < 2) {
    return null;
  }
  const steps: number[] = [];
  for (let i = 1; i < values.length; i++) {
    const step = values[i] - values[i - 1];
    if (step > 0) {
      steps.push(step);
    }
  }
  if (!steps.length) {
    return null;
  }
  steps.sort((a, b) => a - b);
  return steps[Math.floor(steps.length / 2)];
}

function isRegularSpacing(values: number[], tol = 0.2) {
  const median = medianSpacing(values);
  if (median == null || !(median > 0) || values.length < 2) {
    return false;
  }
  for (let i = 1; i < values.length; i++) {
    const step = values[i] - values[i - 1];
    if (Math.abs(step - median) / median >= tol) {
      return false;
    }
  }
  return true;
}

// Rebuild a complete axis at the native cell size so missing rows/cols stay
// empty instead of collapsing the grid to only occupied coordinates.
function expandAxis(values: number[]) {
  const step = medianSpacing(values);
  if (step == null || !(step > 0) || values.length < 3) {
    return null;
  }
  const origin = values[0];
  const last = values[values.length - 1];
  const count = Math.round((last - origin) / step) + 1;
  if (count < 3 || count > MAX_GRID_AXIS) {
    return null;
  }
  let snapped = 0;
  for (const value of values) {
    const k = Math.round((value - origin) / step);
    if (Math.abs(value - (origin + k * step)) <= step * 0.25) {
      snapped++;
    }
  }
  if (snapped / values.length < 0.75) {
    return null;
  }
  return Array.from({length: count}, (_, i) => origin + i * step);
}

function snapToAxis(value, axis) {
  if (!axis || axis.length < 2) {
    return -1;
  }
  const step = axis[1] - axis[0];
  if (!(step > 0)) {
    return -1;
  }
  const k = Math.round((value - axis[0]) / step);
  if (k < 0 || k >= axis.length) {
    return -1;
  }
  if (Math.abs(value - axis[k]) > step * 0.35) {
    return -1;
  }
  return k;
}

function boxBlur(grid, radius) {
  if (radius <= 0) {
    return grid;
  }
  const {cols, rows, u, v, alt, filled} = grid;
  // Bound work: dense grids with large radius can freeze the UI on format.
  const cellCount = cols * rows;
  const maxRadius = cellCount > 120_000 ? 2 : cellCount > 40_000 ? 3 : 12;
  const r = Math.min(Math.max(1, Math.round(radius)), maxRadius);
  const nextU = new Float32Array(u.length);
  const nextV = new Float32Array(v.length);
  const nextAlt = alt ? new Float32Array(alt.length) : null;
  const nextFilled = filled ? new Uint8Array(filled) : null;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const i = row * cols + col;
      // Smooth existing samples only. Empty cells stay empty so the field
      // cannot grow into regions with no points.
      if (filled && !filled[i]) {
        continue;
      }
      let su = 0;
      let sv = 0;
      let sa = 0;
      let n = 0;
      for (let dy = -r; dy <= r; dy++) {
        const y = row + dy;
        if (y < 0 || y >= rows) continue;
        for (let dx = -r; dx <= r; dx++) {
          const x = col + dx;
          if (x < 0 || x >= cols) continue;
          const j = y * cols + x;
          if (filled && !filled[j]) continue;
          su += u[j];
          sv += v[j];
          if (alt) sa += alt[j];
          n++;
        }
      }
      if (n) {
        nextU[i] = su / n;
        nextV[i] = sv / n;
        if (nextAlt) nextAlt[i] = sa / n;
      }
    }
  }
  let minSpeed = Infinity;
  let maxSpeed = 0;
  const mask = nextFilled || filled;
  for (let i = 0; i < nextU.length; i++) {
    if (mask && !mask[i]) continue;
    const speed = Math.hypot(nextU[i], nextV[i]);
    minSpeed = Math.min(minSpeed, speed);
    maxSpeed = Math.max(maxSpeed, speed);
  }
  return {
    ...grid,
    u: nextU,
    v: nextV,
    alt: nextAlt || alt || null,
    filled: nextFilled || filled,
    minSpeed: Number.isFinite(minSpeed) ? minSpeed : 0,
    maxSpeed: maxSpeed || 1
  };
}

/**
 * Downhill flow from a gridded elevation field (same idea as the
 * scripts/flow-field-from-elevation helper): u = -∂z/∂x, v = -∂z/∂y.
 */
function elevationFieldToUV(
  z: Float32Array,
  filled: Uint8Array,
  cols: number,
  rows: number,
  lngs: number[],
  lats: number[]
): {u: Float32Array; v: Float32Array; minSpeed: number; maxSpeed: number} {
  const u = new Float32Array(cols * rows);
  const v = new Float32Array(cols * rows);
  const outFilled = new Uint8Array(cols * rows);
  const dlat = rows > 1 ? lats[1] - lats[0] : 1;
  const dlng = cols > 1 ? lngs[1] - lngs[0] : 1;
  let minSpeed = Infinity;
  let maxSpeed = 0;

  for (let ri = 0; ri < rows; ri++) {
    const mEast = METERS_PER_DEG_LAT * Math.max(0.2, Math.cos((lats[ri] * Math.PI) / 180)) * dlng;
    const mNorth = METERS_PER_DEG_LAT * dlat;
    for (let ci = 0; ci < cols; ci++) {
      const i = ri * cols + ci;
      if (!filled[i] || !Number.isFinite(z[i])) continue;

      let dzDlng: number | null = null;
      if (ci > 0 && ci < cols - 1 && filled[i - 1] && filled[i + 1]) {
        dzDlng = (z[i + 1] - z[i - 1]) / (2 * mEast);
      } else if (ci < cols - 1 && filled[i + 1]) {
        dzDlng = (z[i + 1] - z[i]) / mEast;
      } else if (ci > 0 && filled[i - 1]) {
        dzDlng = (z[i] - z[i - 1]) / mEast;
      }

      let dzDlat: number | null = null;
      if (ri > 0 && ri < rows - 1 && filled[i - cols] && filled[i + cols]) {
        dzDlat = (z[i + cols] - z[i - cols]) / (2 * mNorth);
      } else if (ri < rows - 1 && filled[i + cols]) {
        dzDlat = (z[i + cols] - z[i]) / mNorth;
      } else if (ri > 0 && filled[i - cols]) {
        dzDlat = (z[i] - z[i - cols]) / mNorth;
      }

      if (dzDlng == null || dzDlat == null) continue;

      const uu = -dzDlng;
      const vv = -dzDlat;
      u[i] = uu;
      v[i] = vv;
      outFilled[i] = 1;
      const speed = Math.hypot(uu, vv);
      minSpeed = Math.min(minSpeed, speed);
      maxSpeed = Math.max(maxSpeed, speed);
    }
  }

  // Reuse filled mask: cells that had elevation but no gradient stay empty.
  for (let i = 0; i < filled.length; i++) {
    if (!outFilled[i]) {
      filled[i] = 0;
    }
  }

  return {
    u,
    v,
    minSpeed: Number.isFinite(minSpeed) ? minSpeed : 0,
    maxSpeed: maxSpeed || 1
  };
}

function computeBinCounts(
  minLng: number,
  maxLng: number,
  minLat: number,
  maxLat: number,
  gridResolution: number
) {
  const res = Math.max(16, Math.min(MAX_GRID_AXIS, Math.round(gridResolution || 64)));
  const lngSpan = Math.max(1e-9, maxLng - minLng);
  const latSpan = Math.max(1e-9, maxLat - minLat);
  if (lngSpan >= latSpan) {
    return {
      binsX: res,
      binsY: Math.max(16, Math.min(MAX_GRID_AXIS, Math.round((res * latSpan) / lngSpan)))
    };
  }
  return {
    binsX: Math.max(16, Math.min(MAX_GRID_AXIS, Math.round((res * lngSpan) / latSpan))),
    binsY: res
  };
}

function buildElevationScalarGrid(
  points: AltitudePoint[],
  gridResolution = 64
): {
  cols: number;
  rows: number;
  lngs: number[];
  lats: number[];
  z: Float32Array;
  filled: Uint8Array;
} | null {
  if (points.length < 4) {
    return null;
  }

  const lats = uniqueSorted(
    points.map(p => p.lat),
    1e-6
  );
  const lngs = uniqueSorted(
    points.map(p => p.lng),
    1e-6
  );

  const expandedLats = expandAxis(lats);
  const expandedLngs = expandAxis(lngs);
  const latAxis = expandedLats || (isRegularSpacing(lats) ? lats : null);
  const lngAxis = expandedLngs || (isRegularSpacing(lngs) ? lngs : null);
  const looksRegular = Boolean(
    latAxis &&
      lngAxis &&
      latAxis.length >= 2 &&
      lngAxis.length >= 2 &&
      (expandedLats || expandedLngs || latAxis.length * lngAxis.length <= points.length * 1.4)
  );

  // Keep the native regular grid when it is already coarser than the target.
  if (
    looksRegular &&
    latAxis &&
    lngAxis &&
    Math.max(latAxis.length, lngAxis.length) <= gridResolution
  ) {
    const rows = latAxis.length;
    const cols = lngAxis.length;
    const z = new Float32Array(cols * rows);
    const filled = new Uint8Array(cols * rows);
    for (const p of points) {
      const ri = snapToAxis(p.lat, latAxis);
      const ci = snapToAxis(p.lng, lngAxis);
      if (ri < 0 || ci < 0 || !Number.isFinite(p.alt)) continue;
      const i = ri * cols + ci;
      z[i] = p.alt;
      filled[i] = 1;
    }
    return {cols, rows, lngs: lngAxis, lats: latAxis, z, filled};
  }

  const minLng = Math.min(...points.map(p => p.lng));
  const maxLng = Math.max(...points.map(p => p.lng));
  const minLat = Math.min(...points.map(p => p.lat));
  const maxLat = Math.max(...points.map(p => p.lat));
  const {binsX, binsY} = computeBinCounts(minLng, maxLng, minLat, maxLat, gridResolution);
  const zSum = new Float32Array(binsX * binsY);
  const filled = new Uint8Array(binsX * binsY);
  const counts = new Uint16Array(binsX * binsY);
  for (const p of points) {
    if (!Number.isFinite(p.alt)) continue;
    const ci = Math.min(binsX - 1, Math.floor(((p.lng - minLng) / (maxLng - minLng || 1)) * binsX));
    const ri = Math.min(binsY - 1, Math.floor(((p.lat - minLat) / (maxLat - minLat || 1)) * binsY));
    const i = ri * binsX + ci;
    zSum[i] += p.alt;
    counts[i]++;
  }
  const z = new Float32Array(binsX * binsY);
  for (let i = 0; i < zSum.length; i++) {
    if (counts[i]) {
      z[i] = zSum[i] / counts[i];
      filled[i] = 1;
    }
  }
  const scatterLngs = Array.from(
    {length: binsX},
    (_, i) => minLng + ((maxLng - minLng) * i) / Math.max(1, binsX - 1)
  );
  const scatterLats = Array.from(
    {length: binsY},
    (_, i) => minLat + ((maxLat - minLat) * i) / Math.max(1, binsY - 1)
  );
  return {cols: binsX, rows: binsY, lngs: scatterLngs, lats: scatterLats, z, filled};
}

function buildGridFromAltitude(
  points: AltitudePoint[],
  smoothing: number,
  gridResolution = 64
): FlowGrid | null {
  const scalar = buildElevationScalarGrid(points, gridResolution);
  if (!scalar) {
    return null;
  }
  const {cols, rows, lngs, lats, z, filled} = scalar;
  const {u, v, minSpeed, maxSpeed} = elevationFieldToUV(z, filled, cols, rows, lngs, lats);
  return boxBlur(
    {
      cols,
      rows,
      lngs,
      lats,
      u,
      v,
      // Keep the height field so streamlines follow terrain in Z, not just slope in UV.
      alt: z,
      filled,
      minSpeed,
      maxSpeed
    },
    smoothing
  );
}

function buildGrid(points: FlowPoint[], smoothing: number, gridResolution = 64): FlowGrid | null {
  if (points.length < 4) {
    return null;
  }

  const lats = uniqueSorted(
    points.map(p => p.lat),
    1e-6
  );
  const lngs = uniqueSorted(
    points.map(p => p.lng),
    1e-6
  );

  const expandedLats = expandAxis(lats);
  const expandedLngs = expandAxis(lngs);
  const latAxis = expandedLats || (isRegularSpacing(lats) ? lats : null);
  const lngAxis = expandedLngs || (isRegularSpacing(lngs) ? lngs : null);
  const looksRegular = Boolean(
    latAxis &&
      lngAxis &&
      latAxis.length >= 2 &&
      lngAxis.length >= 2 &&
      (expandedLats || expandedLngs || latAxis.length * lngAxis.length <= points.length * 1.4)
  );

  if (
    looksRegular &&
    latAxis &&
    lngAxis &&
    Math.max(latAxis.length, lngAxis.length) <= gridResolution
  ) {
    const rows = latAxis.length;
    const cols = lngAxis.length;
    const u = new Float32Array(cols * rows);
    const v = new Float32Array(cols * rows);
    const alt = new Float32Array(cols * rows);
    const filled = new Uint8Array(cols * rows);
    let minSpeed = Infinity;
    let maxSpeed = 0;
    let hasAlt = false;
    for (const p of points) {
      const ri = snapToAxis(p.lat, latAxis);
      const ci = snapToAxis(p.lng, lngAxis);
      if (ri < 0 || ci < 0) continue;
      const i = ri * cols + ci;
      u[i] = p.u;
      v[i] = p.v;
      if (Number.isFinite(p.alt)) {
        alt[i] = p.alt as number;
        hasAlt = true;
      }
      filled[i] = 1;
      const speed = Math.hypot(p.u, p.v);
      minSpeed = Math.min(minSpeed, speed);
      maxSpeed = Math.max(maxSpeed, speed);
    }
    return boxBlur(
      {
        cols,
        rows,
        lngs: lngAxis,
        lats: latAxis,
        u,
        v,
        alt: hasAlt ? alt : null,
        filled,
        minSpeed: Number.isFinite(minSpeed) ? minSpeed : 0,
        maxSpeed: maxSpeed || 1
      },
      smoothing
    );
  }

  // Scatter / downsample into a target-resolution grid.
  const minLng = Math.min(...points.map(p => p.lng));
  const maxLng = Math.max(...points.map(p => p.lng));
  const minLat = Math.min(...points.map(p => p.lat));
  const maxLat = Math.max(...points.map(p => p.lat));
  const {binsX, binsY} = computeBinCounts(minLng, maxLng, minLat, maxLat, gridResolution);
  const su = new Float32Array(binsX * binsY);
  const sv = new Float32Array(binsX * binsY);
  const sa = new Float32Array(binsX * binsY);
  const filled = new Uint8Array(binsX * binsY);
  const counts = new Uint16Array(binsX * binsY);
  let hasAlt = false;
  for (const p of points) {
    const ci = Math.min(binsX - 1, Math.floor(((p.lng - minLng) / (maxLng - minLng || 1)) * binsX));
    const ri = Math.min(binsY - 1, Math.floor(((p.lat - minLat) / (maxLat - minLat || 1)) * binsY));
    const i = ri * binsX + ci;
    su[i] += p.u;
    sv[i] += p.v;
    if (Number.isFinite(p.alt)) {
      sa[i] += p.alt as number;
      hasAlt = true;
    }
    counts[i]++;
  }
  let minSpeed = Infinity;
  let maxSpeed = 0;
  for (let i = 0; i < su.length; i++) {
    if (counts[i]) {
      su[i] /= counts[i];
      sv[i] /= counts[i];
      sa[i] /= counts[i];
      filled[i] = 1;
      const speed = Math.hypot(su[i], sv[i]);
      minSpeed = Math.min(minSpeed, speed);
      maxSpeed = Math.max(maxSpeed, speed);
    }
  }
  const scatterLngs = Array.from(
    {length: binsX},
    (_, i) => minLng + ((maxLng - minLng) * i) / Math.max(1, binsX - 1)
  );
  const scatterLats = Array.from(
    {length: binsY},
    (_, i) => minLat + ((maxLat - minLat) * i) / Math.max(1, binsY - 1)
  );
  return boxBlur(
    {
      cols: binsX,
      rows: binsY,
      lngs: scatterLngs,
      lats: scatterLats,
      u: su,
      v: sv,
      alt: hasAlt ? sa : null,
      filled,
      minSpeed: Number.isFinite(minSpeed) ? minSpeed : 0,
      maxSpeed: maxSpeed || 1
    },
    smoothing
  );
}

function findSpan(values, x) {
  let lo = 0;
  let hi = values.length - 1;
  if (hi < 1 || x < values[0] || x > values[hi]) {
    return -1;
  }
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (values[mid] <= x) lo = mid;
    else hi = mid;
  }
  return lo;
}

function sampleField(grid, lng, lat) {
  const {lngs, lats, cols, rows, u, v, alt, filled} = grid;
  const ci = findSpan(lngs, lng);
  const ri = findSpan(lats, lat);
  if (ci < 0 || ri < 0 || ci >= cols - 1 || ri >= rows - 1) {
    return null;
  }
  const i00 = ri * cols + ci;
  const i10 = ri * cols + ci + 1;
  const i01 = (ri + 1) * cols + ci;
  const i11 = (ri + 1) * cols + ci + 1;
  const lng0 = lngs[ci];
  const lng1 = lngs[ci + 1];
  const lat0 = lats[ri];
  const lat1 = lats[ri + 1];
  const tx = (lng - lng0) / (lng1 - lng0 || 1);
  const ty = (lat - lat0) / (lat1 - lat0 || 1);
  const corners = [
    {i: i00, w: (1 - tx) * (1 - ty)},
    {i: i10, w: tx * (1 - ty)},
    {i: i01, w: (1 - tx) * ty},
    {i: i11, w: tx * ty}
  ];
  // Prefer fully filled quads. For sparse scatter grids, fall back to the
  // filled corners of this cell (renormalized) so streamlines still appear.
  const usable = filled ? corners.filter(c => filled[c.i]) : corners;
  if (!usable.length) {
    return null;
  }
  let wSum = 0;
  let uu = 0;
  let vv = 0;
  let aa = 0;
  for (const c of usable) {
    wSum += c.w;
    uu += u[c.i] * c.w;
    vv += v[c.i] * c.w;
    if (alt) aa += alt[c.i] * c.w;
  }
  if (wSum < 1e-8) {
    const c = usable[0];
    return {u: u[c.i], v: v[c.i], alt: alt ? alt[c.i] : 0};
  }
  uu /= wSum;
  vv /= wSum;
  aa = alt ? aa / wSum : 0;
  if (!Number.isFinite(uu) || !Number.isFinite(vv)) {
    return null;
  }
  return {u: uu, v: vv, alt: Number.isFinite(aa) ? aa : 0};
}

function viewportBounds(mapState) {
  try {
    const viewport = new WebMercatorViewport({
      width: mapState.width || 800,
      height: mapState.height || 600,
      longitude: mapState.longitude,
      latitude: mapState.latitude,
      zoom: mapState.zoom,
      pitch: mapState.pitch || 0,
      bearing: mapState.bearing || 0
    });
    const [west, south, east, north] = viewport.getBounds();
    return {minLng: west, minLat: south, maxLng: east, maxLat: north};
  } catch {
    return {
      minLng: mapState.longitude - 10,
      minLat: mapState.latitude - 6,
      maxLng: mapState.longitude + 10,
      maxLat: mapState.latitude + 6
    };
  }
}

function fieldBounds(grid) {
  if (!grid?.lngs?.length || !grid?.lats?.length) {
    return null;
  }
  return {
    minLng: grid.lngs[0],
    maxLng: grid.lngs[grid.cols - 1],
    minLat: grid.lats[0],
    maxLat: grid.lats[grid.rows - 1]
  };
}

function advance(grid, lng, lat, dt, sign) {
  const s0 = sampleField(grid, lng, lat);
  if (!s0) return null;
  if (Math.hypot(s0.u, s0.v) < 1e-6) return null;
  const metersPerDegLng = METERS_PER_DEG_LAT * Math.max(0.2, Math.cos((lat * Math.PI) / 180));
  const midLng = lng + (sign * s0.u * dt * 0.5) / metersPerDegLng;
  const midLat = lat + (sign * s0.v * dt * 0.5) / METERS_PER_DEG_LAT;
  const s1 = sampleField(grid, midLng, midLat);
  if (!s1) return null;
  const metersMid = METERS_PER_DEG_LAT * Math.max(0.2, Math.cos((midLat * Math.PI) / 180));
  const nextLng = lng + (sign * s1.u * dt) / metersMid;
  const nextLat = lat + (sign * s1.v * dt) / METERS_PER_DEG_LAT;
  if (!sampleField(grid, nextLng, nextLat)) return null;
  return {lng: nextLng, lat: nextLat};
}

function integrateDir(
  grid: FlowGrid,
  startLng: number,
  startLat: number,
  dt: number,
  sign: number,
  maxTravel: number
) {
  const path: number[][] = [];
  let lng = startLng;
  let lat = startLat;
  for (let step = 0; step < MAX_STEPS; step++) {
    if (!isFiniteNumber(lng) || !isFiniteNumber(lat)) break;
    const sample = sampleField(grid, lng, lat);
    if (!sample) break;
    path.push([lng, lat, sample.alt || 0]);
    const next = advance(grid, lng, lat, dt, sign);
    if (!next) break;
    if (!isFiniteNumber(next.lng) || !isFiniteNumber(next.lat)) break;
    // Stop before antimeridian jumps; wrapLongitude + TripsLayer is unsafe.
    if (Math.abs(next.lng - lng) > 180) break;
    if (Math.abs(next.lng - startLng) + Math.abs(next.lat - startLat) > maxTravel) break;
    lng = next.lng;
    lat = next.lat;
  }
  return path;
}

function integrate(grid, startLng, startLat, lifetime, maxTravel, stepDeg) {
  if (!grid?.lngs || grid.lngs.length < 2 || !grid?.lats || grid.lats.length < 2) {
    return null;
  }
  const gridStep = Math.min(
    Math.abs(grid.lngs[1] - grid.lngs[0]) || 0.5,
    Math.abs(grid.lats[1] - grid.lats[0]) || 0.5
  );
  const useStep = Math.max(1e-6, Math.min(gridStep * 0.55, stepDeg || gridStep));
  const dt = (useStep * METERS_PER_DEG_LAT) / Math.max(grid.maxSpeed, 1e-3);
  const travel = Math.max(maxTravel || useStep * 8, useStep * 4);
  const fwd = integrateDir(grid, startLng, startLat, dt, 1, travel);
  const bwd = integrateDir(grid, startLng, startLat, dt, -1, travel);
  const path = [...bwd.slice(1).reverse(), ...fwd];
  if (path.length < 4) {
    return null;
  }
  const timestamps = path.map((_, i) => (i / (path.length - 1)) * lifetime);
  return {path, timestamps};
}

function streamlineWindow(grid, mapState, visConfig) {
  const view = viewportBounds(mapState);
  const field = fieldBounds(grid);
  if (!field || ![field.minLng, field.maxLng, field.minLat, field.maxLat].every(isFiniteNumber)) {
    return {
      minCi: 0,
      maxCi: 0,
      minRi: 0,
      maxRi: 0,
      strideLng: 1,
      strideLat: 1,
      stepDeg: 1,
      maxTravel: 1,
      clipBounds: [view.minLng, view.minLat, view.maxLng, view.maxLat],
      rangeKey: 'empty'
    };
  }
  const count = Math.max(10, Math.round(visConfig.linesPerScreen));
  const n = Math.sqrt(count);
  const t = Math.max(0, Math.min(1, visConfig.zoomResponse));
  const viewLng = Math.max(1e-6, view.maxLng - view.minLng);
  const viewLat = Math.max(1e-6, view.maxLat - view.minLat);
  const fieldLng = Math.max(1e-6, field.maxLng - field.minLng);
  const fieldLat = Math.max(1e-6, field.maxLat - field.minLat);
  let targetLng = logMix(viewLng / n, fieldLng / n, t);
  let targetLat = logMix(viewLat / n, fieldLat / n, t);
  const minAxis = Math.max(6, Math.round(n * 0.2));
  targetLng = Math.min(targetLng, viewLng / minAxis);
  targetLat = Math.min(targetLat, viewLat / minAxis);
  const strideLng = degToStride(targetLng);
  const strideLat = degToStride(targetLat);

  const padLng = viewLng * 0.08;
  const padLat = viewLat * 0.08;
  const minLng = Math.max(field.minLng, view.minLng - padLng);
  const maxLng = Math.min(field.maxLng, view.maxLng + padLng);
  const minLat = Math.max(field.minLat, view.minLat - padLat);
  const maxLat = Math.min(field.maxLat, view.maxLat + padLat);

  const minCi = Math.floor(Math.floor(minLng / FINE_CELL) / strideLng) * strideLng;
  const maxCi = Math.ceil(maxLng / FINE_CELL);
  const minRi = Math.floor(Math.floor(minLat / FINE_CELL) / strideLat) * strideLat;
  const maxRi = Math.ceil(maxLat / FINE_CELL);

  return {
    minCi,
    maxCi,
    minRi,
    maxRi,
    strideLng,
    strideLat,
    stepDeg: Math.min(viewLng, viewLat) / 40,
    maxTravel: Math.min(viewLng, viewLat) * 0.7,
    clipBounds: [view.minLng, view.minLat, view.maxLng, view.maxLat],
    rangeKey: `${minCi}:${maxCi}:${minRi}:${maxRi}:${strideLng}:${strideLat}`
  };
}

function collectStreamlines(
  grid: FlowGrid,
  visConfig: any,
  cache: Map<string, FlowTrip | null>,
  seedWindow: any
) {
  const {minCi, maxCi, minRi, maxRi, strideLng, strideLat, maxTravel, stepDeg} = seedWindow;
  const travelKey = Math.round(maxTravel * 50);

  const lines: FlowTrip[] = [];
  const needed = new Set<string>();
  for (let ri = minRi; ri < maxRi; ri += strideLat) {
    for (let ci = minCi; ci < maxCi; ci += strideLng) {
      const key = `${ci}:${ri}:${travelKey}`;
      needed.add(key);
      let line = cache.get(key);
      if (line === undefined) {
        const rand = mulberry32(hashString(`${ci}:${ri}`));
        const lng = (ci + 0.18 + rand() * 0.64) * FINE_CELL;
        const lat = (ri + 0.18 + rand() * 0.64) * FINE_CELL;
        if (!sampleField(grid, lng, lat)) {
          cache.set(key, null);
        } else {
          const pathLifetime = visConfig.seamlessLoop ? 1 : visConfig.lineLifetime;
          const built = integrate(grid, lng, lat, pathLifetime, maxTravel, stepDeg);
          if (!built) {
            cache.set(key, null);
          } else {
            const sample = sampleField(grid, lng, lat);
            const speed = sample ? Math.hypot(sample.u, sample.v) : 0;
            const phase = rand();
            const trip: FlowTrip = {
              path: built.path,
              timestamps: built.timestamps.map(ts => ts + phase),
              speed
            };
            cache.set(key, isValidTrip(trip) ? trip : null);
          }
        }
      }
      line = cache.get(key);
      if (line && isValidTrip(line)) {
        lines.push(line);
        // A second trip on the same vertices, not a concatenated polyline.
        // Joining end→start would draw a straight segment against the flow.
        if (visConfig.seamlessLoop) {
          const looped: FlowTrip = {
            path: line.path,
            timestamps: line.timestamps.map(ts => ts + 1),
            speed: line.speed
          };
          if (isValidTrip(looped)) {
            lines.push(looped);
          }
        }
      }
    }
  }

  if (cache.size > needed.size * 4) {
    for (const key of [...cache.keys()]) {
      if (!needed.has(key)) {
        cache.delete(key);
      }
    }
  }

  return lines;
}

export default class FlowFieldLayer extends Layer {
  declare _streamlines: FlowTrip[];
  declare _streamlinesKey: string;
  declare _lineCache: Map<string, FlowTrip | null>;
  declare _cacheMeta: string;
  declare _viewSig: string;
  declare _moving: boolean;
  declare _settleTimer: ReturnType<typeof setTimeout> | number;
  declare _clipBounds: number[] | null;
  declare _onRedrawNeeded: (() => void) | null | undefined;

  constructor(props: any) {
    super(props);
    this.registerVisConfig(flowFieldVisConfigs);
    this._streamlines = [];
    this._streamlinesKey = '';
    this._lineCache = new Map();
    this._cacheMeta = '';
    this._viewSig = '';
    this._moving = false;
    this._settleTimer = 0;
    this._clipBounds = null;
    this._onRedrawNeeded = null;
  }

  get type(): string {
    return LAYER_TYPES.flowField;
  }

  get name() {
    return 'Flow Field';
  }

  get layerIcon() {
    return FlowFieldLayerIcon;
  }

  get columnLabels() {
    return COLUMN_LABELS;
  }

  get columnPairs() {
    return this.defaultPointColumnPairs;
  }

  get supportedColumnModes() {
    return SUPPORTED_COLUMN_MODES;
  }

  get noneLayerDataAffectingProps() {
    return [
      ...super.noneLayerDataAffectingProps,
      'strokeWidth',
      'trailLength',
      'cycleSeconds',
      'lineLifetime',
      'seamlessLoop',
      'linesPerScreen',
      'zoomResponse',
      'colorBySpeed',
      'colorRange',
      'elevationMultiplier'
    ];
  }

  hasAllColumns(): boolean {
    if (!super.hasAllColumns()) {
      return false;
    }
    // Position: either lat+lng or a GeoJSON geometry column.
    return hasLatLngPosition(this.config.columns) || hasGeojsonPosition(this.config.columns);
  }

  getDefaultLayerConfig(config: LayerBaseConfigPartial = {} as LayerBaseConfigPartial) {
    const rawMode = (config as any).columnMode;
    return {
      ...super.getDefaultLayerConfig(config),
      columnMode: normalizeColumnMode(rawMode) || FlowFieldColumnMode.UV,
      color: config.color ?? [255, 255, 255]
    };
  }

  static findDefaultLayerProps(
    dataset: KeplerTable,
    foundLayers?: any[]
  ): FindDefaultLayerPropsReturnValue {
    const {fields = [], label} = dataset;
    // Auto-create only for explicit `u` / `v` (not aliases) plus lat/lng or GeoJSON.
    // Speed/direction and elevation modes stay manual.
    const uField = findNamedField(fields, DEFAULT_U_FIELD_NAMES);
    const vField = findNamedField(fields, DEFAULT_V_FIELD_NAMES);
    if (!uField || !vField) {
      return {props: [], foundLayers};
    }

    const latLng = latLngColumnsFromDataset(dataset);
    const foundGeojson = this.findDefaultColumnField(
      {geojson: [...(GEOJSON_FIELDS.geojson || []), ...geojsonFieldNames(fields)]},
      fields
    );
    const geoColumn = foundGeojson?.[0]?.geojson || null;
    const positionColumns = latLng
      ? {lat: latLng.lat, lng: latLng.lng}
      : geoColumn
      ? {geojson: geoColumn}
      : null;

    if (!positionColumns) {
      return {props: [], foundLayers};
    }

    const baseLabel = (typeof label === 'string' && label.replace(/\.[^/.]+$/, '')) || 'Flow Field';
    const altField = findNamedField(fields, ALT_FIELD_NAMES);
    const altColumn = latLng?.altitude || fieldToColumn(altField, fields);
    const uvColumns = {
      u: fieldToColumn(uField, fields)!,
      v: fieldToColumn(vField, fields)!,
      ...(altColumn ? {altitude: altColumn} : {})
    };

    const props = [
      {
        label: baseLabel,
        color: [255, 255, 255],
        isVisible: true,
        columnMode: FlowFieldColumnMode.UV,
        columns: {
          ...positionColumns,
          ...uvColumns
        }
      }
    ];

    // When lat/lng is primary, also offer a GeoJSON-backed alt config for layer-type switches.
    const altProps =
      latLng && geoColumn
        ? [
            {
              label: baseLabel,
              color: [255, 255, 255],
              isVisible: true,
              columnMode: FlowFieldColumnMode.UV,
              columns: {
                geojson: geoColumn,
                ...uvColumns,
                ...(fieldToColumn(altField, fields)
                  ? {altitude: fieldToColumn(altField, fields)!}
                  : {})
              }
            }
          ]
        : [];

    return {props, altProps, foundLayers};
  }

  formatLayerData(datasets: any) {
    if (this.config.dataId === null) {
      return {};
    }
    const dataset = datasets[this.config.dataId];
    if (!dataset) {
      return {};
    }
    const {dataContainer, filteredIndex, fields} = dataset;
    const {lat, lng, geojson, u, v, speed, direction, altitude} = this.config.columns;
    const mode = normalizeColumnMode(this.config.columnMode);
    // Prefer lat/lng when both are set; GeoJSON is the fallback position source.
    const useGeojson =
      hasGeojsonPosition(this.config.columns) && !hasLatLngPosition(this.config.columns);
    const altitudeMode = isElevationMode(mode);
    const speedMode = isSpeedDirMode(mode);

    if (useGeojson) {
      if (!geojson || geojson.fieldIdx < 0) {
        return {};
      }
    } else if (!lat || lat.fieldIdx < 0 || !lng || lng.fieldIdx < 0) {
      return {};
    }

    const geoEncoding = useGeojson ? getGeoArrowEncoding(fields?.[geojson.fieldIdx]) : undefined;

    const readLatLng = (idx: number): {lat: number; lng: number} | null => {
      if (useGeojson) {
        const centroid = centroidFromRawFeature(
          dataContainer.valueAt(idx, geojson.fieldIdx),
          geoEncoding
        );
        if (!centroid) {
          return null;
        }
        return {lng: centroid[0], lat: centroid[1]};
      }
      const latVal = dataContainer.valueAt(idx, lat.fieldIdx);
      const lngVal = dataContainer.valueAt(idx, lng.fieldIdx);
      if (!Number.isFinite(latVal) || !Number.isFinite(lngVal)) {
        return null;
      }
      return {lat: latVal, lng: lngVal};
    };

    if (altitudeMode) {
      if (!altitude || altitude.fieldIdx < 0) {
        return {};
      }
      const altPoints: AltitudePoint[] = [];
      for (let i = 0; i < filteredIndex.length; i++) {
        const idx = filteredIndex[i];
        const pos = readLatLng(idx);
        const altVal = dataContainer.valueAt(idx, altitude.fieldIdx);
        if (!pos || !Number.isFinite(altVal)) {
          continue;
        }
        altPoints.push({lat: pos.lat, lng: pos.lng, alt: altVal});
      }
      this._streamlinesKey = '';
      this._cacheMeta = '';
      this._lineCache = new Map();
      this._clipBounds = null;
      this._viewSig = '';
      this._moving = false;
      const grid = buildGridFromAltitude(
        altPoints,
        this.config.visConfig.smoothing,
        this.config.visConfig.gridResolution
      );
      return {data: altPoints, grid};
    }

    if (!speedMode && (u.fieldIdx < 0 || v.fieldIdx < 0)) {
      return {};
    }
    if (speedMode && (speed.fieldIdx < 0 || direction.fieldIdx < 0)) {
      return {};
    }

    const points: FlowPoint[] = [];
    for (let i = 0; i < filteredIndex.length; i++) {
      const idx = filteredIndex[i];
      const pos = readLatLng(idx);
      if (!pos) continue;
      let uu;
      let vv;
      if (speedMode) {
        const converted = meteorologicalToUV(
          dataContainer.valueAt(idx, speed.fieldIdx),
          dataContainer.valueAt(idx, direction.fieldIdx)
        );
        uu = converted.u;
        vv = converted.v;
      } else {
        uu = dataContainer.valueAt(idx, u.fieldIdx);
        vv = dataContainer.valueAt(idx, v.fieldIdx);
      }
      if (!Number.isFinite(uu) || !Number.isFinite(vv)) continue;
      const altVal =
        altitude?.fieldIdx > -1 ? dataContainer.valueAt(idx, altitude.fieldIdx) : undefined;
      points.push({
        lat: pos.lat,
        lng: pos.lng,
        u: uu,
        v: vv,
        ...(Number.isFinite(altVal) ? {alt: altVal} : {})
      });
    }

    this._streamlinesKey = '';
    this._cacheMeta = '';
    this._lineCache = new Map();
    this._clipBounds = null;
    this._viewSig = '';
    this._moving = false;
    const grid = buildGrid(
      points,
      this.config.visConfig.smoothing,
      this.config.visConfig.gridResolution
    );
    return {data: points, grid};
  }

  renderLayer(opts: any) {
    const {data, mapState, layerCallbacks, visible} = opts;
    const {visConfig, isVisible, color} = this.config;
    // Honor split-map visibility from renderDeckGlLayer (`visible`), not only config.
    if (!isVisible || visible === false || !data?.grid) {
      return [];
    }

    this._onRedrawNeeded = layerCallbacks?.onRedrawNeeded;

    const meta = [
      visConfig.linesPerScreen,
      visConfig.zoomResponse,
      visConfig.lineLifetime,
      visConfig.seamlessLoop ? 1 : 0
    ].join(':');

    if (this._cacheMeta !== meta) {
      this._lineCache = new Map();
      this._cacheMeta = meta;
      this._streamlinesKey = '';
      this._moving = false;
    }

    const viewSig = viewSignature(mapState);
    if (this._viewSig && this._viewSig !== viewSig) {
      this._moving = true;
      if (this._settleTimer) {
        clearTimeout(this._settleTimer);
      }
      this._settleTimer = setTimeout(() => {
        this._moving = false;
        this._streamlinesKey = '';
        this._onRedrawNeeded?.();
      }, SETTLE_MS);
    }
    this._viewSig = viewSig;

    if (!this._moving) {
      let seedWindow = streamlineWindow(data.grid, mapState, visConfig);
      if (this._streamlinesKey !== seedWindow.rangeKey) {
        this._streamlines = collectStreamlines(data.grid, visConfig, this._lineCache, seedWindow);
        if (!this._streamlines.length) {
          seedWindow = streamlineWindow(data.grid, mapState, {...visConfig, zoomResponse: 0});
          this._streamlines = collectStreamlines(data.grid, visConfig, this._lineCache, seedWindow);
        }
        this._streamlinesKey = seedWindow.rangeKey;
        this._clipBounds = seedWindow.clipBounds;
      }
    }

    const trips = (this._streamlines || []).filter(isValidTrip);
    if (!trips.length) {
      return [];
    }

    const opacity = Math.max(0, Math.min(1, visConfig.opacity ?? 0.85));
    const [r, g, b] = color || [186, 233, 223];
    const view = viewportBounds(mapState);
    const clipBounds = this._clipBounds || [view.minLng, view.minLat, view.maxLng, view.maxLat];
    if (!clipBounds.every(isFiniteNumber)) {
      return [];
    }
    const minSpeed = data.grid.minSpeed || 0;
    const maxSpeed = data.grid.maxSpeed || 1;
    const getColor = (
      visConfig.colorBySpeed
        ? (d: FlowTrip) =>
            speedToColor(d.speed || 0, minSpeed, maxSpeed, visConfig.colorRange, opacity)
        : [r, g, b, Math.round(opacity * 255)]
    ) as any;

    const hasAltitude = Boolean(data.grid?.alt);
    const elevationMultiplier = Math.max(0, visConfig.elevationMultiplier ?? 1);
    const blendingParameters = mapState?.layerParameters ?? {};

    return [
      new AnimatedTripsLayer({
        id: this.id,
        data: trips,
        getPath:
          elevationMultiplier === 1
            ? d => d.path
            : d => d.path.map(p => [p[0], p[1], (p[2] || 0) * elevationMultiplier]),
        getTimestamps: d => d.timestamps,
        getColor,
        updateTriggers: {
          getPath: elevationMultiplier,
          getColor: visConfig.colorBySpeed
            ? [true, visConfig.colorRange, opacity, minSpeed, maxSpeed]
            : [false, r, g, b, opacity]
        },
        getWidth: visConfig.strokeWidth,
        widthUnits: 'pixels',
        capRounded: true,
        jointRounded: true,
        fadeTrail: true,
        trailLength: visConfig.trailLength / 100,
        cycleSeconds: visConfig.cycleSeconds,
        seamlessLoop: visConfig.seamlessLoop,
        pickable: false,
        // wrapLongitude splits paths in PathLayer but not TripsLayer timestamps,
        // which can throw during attribute update (reading undefined[0]).
        wrapLongitude: false,
        parameters: {
          depthTest: Boolean(mapState.dragRotate) || (hasAltitude && elevationMultiplier > 0),
          ...blendingParameters
        },
        extensions: [clipExtension],
        clipByInstance: false,
        clipBounds
      } as any)
    ];
  }
}
