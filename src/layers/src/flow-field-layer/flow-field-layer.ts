// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Flow Field / Streamlines kepler.gl layer.
// Ventusky-style animated streamlines over a lat/lng + u/v (or speed/direction)
// field. Rendered with deck.gl TripsLayer.
//
// Not the origin–destination Flow layer, and not @deck.gl-community geo-layers
// ParticleLayer / WindLayer (those take a station WindField).

import {WebMercatorViewport} from '@deck.gl/core';
import {ClipExtension} from '@deck.gl/extensions';
import {PathLayer} from '@deck.gl/layers';
import {TripsLayer} from '@deck.gl/geo-layers';
import {LAYER_TYPES} from '@kepler.gl/constants';
import {default as KeplerTable} from '@kepler.gl/table';
import {Field} from '@kepler.gl/types';
import Layer, {LayerBaseConfigPartial} from '../base-layer';
import {FindDefaultLayerPropsReturnValue} from '../layer-utils';
import FlowFieldLayerIcon from './flow-field-layer-icon';

type FlowPoint = {lat: number; lng: number; u: number; v: number; alt?: number};
type FlowTrip = {path: number[][]; timestamps: number[]; speed: number};
type FlowGrid = {
  cols: number;
  rows: number;
  lngs: number[];
  lats: number[];
  u: Float32Array;
  v: Float32Array;
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
  SPEED_DIR: 'SPEED_DIR'
} as const;

const SUPPORTED_COLUMN_MODES = [
  {
    key: FlowFieldColumnMode.UV,
    label: 'U / V components',
    requiredColumns: ['lat', 'lng', 'u', 'v'],
    optionalColumns: ['altitude']
  },
  {
    key: FlowFieldColumnMode.SPEED_DIR,
    label: 'Speed / direction',
    requiredColumns: ['lat', 'lng', 'speed', 'direction'],
    optionalColumns: ['altitude']
  }
];

const COLUMN_LABELS = {
  lat: 'Lat',
  lng: 'Lng',
  u: 'U (Eastward)',
  v: 'V (Northward)',
  speed: 'Speed',
  direction: 'Direction (From)',
  altitude: 'Altitude'
};

// Default UV names are exact `u` / `v`. Aliases are fallbacks only.
const DEFAULT_U_FIELD_NAMES = ['u'];
const DEFAULT_V_FIELD_NAMES = ['v'];
const U_FIELD_ALIASES = ['ugrd', 'eastward'];
const V_FIELD_ALIASES = ['vgrd', 'northward'];
const LAT_FIELD_NAMES = ['lat', 'latitude'];
const LNG_FIELD_NAMES = ['lon', 'lng', 'long', 'longitude'];
const SPEED_FIELD_NAMES = ['speed', 'wind_speed', 'wspd'];
const DIRECTION_FIELD_NAMES = ['direction', 'dir', 'wind_dir', 'wdir'];
const ALT_FIELD_NAMES = ['altitude', 'alt', 'elevation', 'elv'];

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

export const flowFieldVisConfigs = {
  opacity: {
    type: 'number',
    defaultValue: 0.55,
    label: 'layerVisConfigs.opacity',
    description: 'layerVisConfigs.flowField.opacityDescription',
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
    description: 'layerVisConfigs.flowField.strokeWidthDescription',
    isRanged: false,
    range: [0.2, 8],
    step: 0.1,
    property: 'strokeWidth',
    allowCustomValue: true
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
    description: 'layerVisConfigs.flowField.trailLengthDescription',
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
  }
};

const METERS_PER_DEG_LAT = 111320;
const MAX_STEPS = 96;
const FINE_CELL = 1 / 4096;
const MAX_GRID_AXIS = 2048;
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
    Math.round(mapState.zoom * 40)
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
  if (median == null || !(median > 0) || values.length < 3) {
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
  const {cols, rows, u, v, filled} = grid;
  const nextU = new Float32Array(u.length);
  const nextV = new Float32Array(v.length);
  const nextFilled = filled ? new Uint8Array(filled) : null;
  const r = Math.max(1, Math.round(radius));
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
          n++;
        }
      }
      if (n) {
        nextU[i] = su / n;
        nextV[i] = sv / n;
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
    filled: nextFilled || filled,
    minSpeed: Number.isFinite(minSpeed) ? minSpeed : 0,
    maxSpeed: maxSpeed || 1
  };
}

function buildGrid(points: FlowPoint[], smoothing: number): FlowGrid | null {
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
      latAxis.length >= 3 &&
      lngAxis.length >= 3 &&
      (expandedLats || expandedLngs || latAxis.length * lngAxis.length <= points.length * 1.4)
  );

  if (looksRegular && latAxis && lngAxis) {
    const rows = latAxis.length;
    const cols = lngAxis.length;
    const u = new Float32Array(cols * rows);
    const v = new Float32Array(cols * rows);
    const filled = new Uint8Array(cols * rows);
    let minSpeed = Infinity;
    let maxSpeed = 0;
    for (const p of points) {
      const ri = snapToAxis(p.lat, latAxis);
      const ci = snapToAxis(p.lng, lngAxis);
      if (ri < 0 || ci < 0) continue;
      const i = ri * cols + ci;
      u[i] = p.u;
      v[i] = p.v;
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
        filled,
        minSpeed: Number.isFinite(minSpeed) ? minSpeed : 0,
        maxSpeed: maxSpeed || 1
      },
      smoothing
    );
  }

  // Scatter: bin into a dense grid. Empty bins stay masked so streamlines
  // cannot fill the bounding box around an irregular point field.
  const binsX = Math.min(512, Math.max(24, Math.round(Math.sqrt(points.length) * 2.2)));
  const binsY = Math.min(384, Math.max(24, Math.round(binsX * 0.75)));
  const minLng = Math.min(...points.map(p => p.lng));
  const maxLng = Math.max(...points.map(p => p.lng));
  const minLat = Math.min(...points.map(p => p.lat));
  const maxLat = Math.max(...points.map(p => p.lat));
  const su = new Float32Array(binsX * binsY);
  const sv = new Float32Array(binsX * binsY);
  const filled = new Uint8Array(binsX * binsY);
  const counts = new Uint16Array(binsX * binsY);
  for (const p of points) {
    const ci = Math.min(binsX - 1, Math.floor(((p.lng - minLng) / (maxLng - minLng || 1)) * binsX));
    const ri = Math.min(binsY - 1, Math.floor(((p.lat - minLat) / (maxLat - minLat || 1)) * binsY));
    const i = ri * binsX + ci;
    su[i] += p.u;
    sv[i] += p.v;
    counts[i]++;
  }
  let minSpeed = Infinity;
  let maxSpeed = 0;
  for (let i = 0; i < su.length; i++) {
    if (counts[i]) {
      su[i] /= counts[i];
      sv[i] /= counts[i];
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
  const {lngs, lats, cols, rows, u, v, filled} = grid;
  const ci = findSpan(lngs, lng);
  const ri = findSpan(lats, lat);
  if (ci < 0 || ri < 0 || ci >= cols - 1 || ri >= rows - 1) {
    return null;
  }
  const i00 = ri * cols + ci;
  const i10 = ri * cols + ci + 1;
  const i01 = (ri + 1) * cols + ci;
  const i11 = (ri + 1) * cols + ci + 1;
  // Only interpolate inside quads whose four corners are real samples.
  // Mixing in empty (zero) cells bleeds flow into holes and past the point field.
  if (filled && !(filled[i00] && filled[i10] && filled[i01] && filled[i11])) {
    return null;
  }
  const lng0 = lngs[ci];
  const lng1 = lngs[ci + 1];
  const lat0 = lats[ri];
  const lat1 = lats[ri + 1];
  const tx = (lng - lng0) / (lng1 - lng0 || 1);
  const ty = (lat - lat0) / (lat1 - lat0 || 1);
  const uu =
    u[i00] * (1 - tx) * (1 - ty) +
    u[i10] * tx * (1 - ty) +
    u[i01] * (1 - tx) * ty +
    u[i11] * tx * ty;
  const vv =
    v[i00] * (1 - tx) * (1 - ty) +
    v[i10] * tx * (1 - ty) +
    v[i01] * (1 - tx) * ty +
    v[i11] * tx * ty;
  if (!Number.isFinite(uu) || !Number.isFinite(vv)) {
    return null;
  }
  return {u: uu, v: vv};
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
  z: number,
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
    path.push([lng, lat, z]);
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
  const fwd = integrateDir(grid, startLng, startLat, 0, dt, 1, travel);
  const bwd = integrateDir(grid, startLng, startLat, 0, dt, -1, travel);
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
          const built = integrate(grid, lng, lat, visConfig.lineLifetime, maxTravel, stepDeg);
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
      'colorRange'
    ];
  }

  getDefaultLayerConfig(config: LayerBaseConfigPartial = {} as LayerBaseConfigPartial) {
    return {
      ...super.getDefaultLayerConfig(config),
      columnMode: (config as any).columnMode ?? FlowFieldColumnMode.UV,
      color: config.color ?? [255, 255, 255]
    };
  }

  static findDefaultLayerProps(
    dataset: KeplerTable,
    foundLayers?: any[]
  ): FindDefaultLayerPropsReturnValue {
    const {fields = [], label} = dataset;
    const latLng = latLngColumnsFromDataset(dataset);
    const uField = findNamedField(fields, [...DEFAULT_U_FIELD_NAMES, ...U_FIELD_ALIASES]);
    const vField = findNamedField(fields, [...DEFAULT_V_FIELD_NAMES, ...V_FIELD_ALIASES]);
    const speedField = findNamedField(fields, SPEED_FIELD_NAMES);
    const directionField = findNamedField(fields, DIRECTION_FIELD_NAMES);
    const altField = findNamedField(fields, ALT_FIELD_NAMES);
    const hasUV = Boolean(uField && vField);
    const hasSpeed = Boolean(speedField && directionField);

    if (!latLng || (!hasUV && !hasSpeed)) {
      return {props: [], foundLayers};
    }

    return {
      props: [
        {
          label: (typeof label === 'string' && label.replace(/\.[^/.]+$/, '')) || 'Flow Field',
          color: [255, 255, 255],
          isVisible: true,
          columnMode: hasUV ? FlowFieldColumnMode.UV : FlowFieldColumnMode.SPEED_DIR,
          columns: {
            lat: latLng.lat,
            lng: latLng.lng,
            ...(uField ? {u: fieldToColumn(uField, fields)!} : {}),
            ...(vField ? {v: fieldToColumn(vField, fields)!} : {}),
            ...(speedField ? {speed: fieldToColumn(speedField, fields)!} : {}),
            ...(directionField ? {direction: fieldToColumn(directionField, fields)!} : {}),
            ...(latLng.altitude || fieldToColumn(altField, fields)
              ? {altitude: (latLng.altitude || fieldToColumn(altField, fields))!}
              : {})
          }
        }
      ],
      foundLayers
    };
  }

  formatLayerData(datasets: any) {
    if (this.config.dataId === null) {
      return {};
    }
    const dataset = datasets[this.config.dataId];
    if (!dataset) {
      return {};
    }
    const {dataContainer, filteredIndex} = dataset;
    const {lat, lng, u, v, speed, direction, altitude} = this.config.columns;
    const uvMode = this.config.columnMode !== FlowFieldColumnMode.SPEED_DIR;
    if (lat.fieldIdx < 0 || lng.fieldIdx < 0) {
      return {};
    }
    if (uvMode && (u.fieldIdx < 0 || v.fieldIdx < 0)) {
      return {};
    }
    if (!uvMode && (speed.fieldIdx < 0 || direction.fieldIdx < 0)) {
      return {};
    }

    const points: FlowPoint[] = [];
    for (let i = 0; i < filteredIndex.length; i++) {
      const idx = filteredIndex[i];
      const latVal = dataContainer.valueAt(idx, lat.fieldIdx);
      const lngVal = dataContainer.valueAt(idx, lng.fieldIdx);
      if (!Number.isFinite(latVal) || !Number.isFinite(lngVal)) continue;
      let uu;
      let vv;
      if (uvMode) {
        uu = dataContainer.valueAt(idx, u.fieldIdx);
        vv = dataContainer.valueAt(idx, v.fieldIdx);
      } else {
        const converted = meteorologicalToUV(
          dataContainer.valueAt(idx, speed.fieldIdx),
          dataContainer.valueAt(idx, direction.fieldIdx)
        );
        uu = converted.u;
        vv = converted.v;
      }
      if (!Number.isFinite(uu) || !Number.isFinite(vv)) continue;
      points.push({
        lat: latVal,
        lng: lngVal,
        u: uu,
        v: vv,
        alt: altitude?.fieldIdx > -1 ? dataContainer.valueAt(idx, altitude.fieldIdx) : 0
      });
    }

    this._streamlinesKey = '';
    this._cacheMeta = '';
    this._lineCache = new Map();
    this._clipBounds = null;
    this._viewSig = '';
    this._moving = false;
    const grid = buildGrid(points, this.config.visConfig.smoothing);
    return {data: points, grid};
  }

  renderLayer(opts: any) {
    const {data, mapState, layerCallbacks} = opts;
    const {visConfig, isVisible, color} = this.config;
    if (!isVisible || !data?.grid) {
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

    return [
      new AnimatedTripsLayer({
        id: this.id,
        data: trips,
        getPath: d => d.path,
        getTimestamps: d => d.timestamps,
        getColor,
        updateTriggers: {
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
        parameters: {depthTest: Boolean(mapState.dragRotate)},
        extensions: [clipExtension],
        clipByInstance: false,
        clipBounds
      } as any)
    ];
  }
}
