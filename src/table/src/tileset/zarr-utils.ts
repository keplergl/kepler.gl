// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {parseGeoZarrMetadata} from '@developmentseed/geozarr';
import * as zarr from 'zarrita';

import type {ZarrDatasetMetadata, ZarrDimensionInfo, ZarrVariableInfo} from '@kepler.gl/constants';

/** Dimension names treated as time when the store does not advertise CF units. */
const TIME_DIMENSION_NAMES = new Set(['time', 't', 'valid_time', 'datetime', 'date']);

/** CF calendars with a fixed-length day that map cleanly onto epoch milliseconds. */
const SUPPORTED_CALENDARS = new Set(['standard', 'gregorian', 'proleptic_gregorian', 'julian']);

/** Milliseconds per CF time unit. Months and years are omitted: they are not fixed length. */
const CF_UNIT_MS: Record<string, number> = {
  microsecond: 0.001,
  microseconds: 0.001,
  microsec: 0.001,
  us: 0.001,
  millisecond: 1,
  milliseconds: 1,
  millisec: 1,
  msec: 1,
  ms: 1,
  second: 1000,
  seconds: 1000,
  sec: 1000,
  secs: 1000,
  s: 1000,
  minute: 60_000,
  minutes: 60_000,
  min: 60_000,
  mins: 60_000,
  hour: 3_600_000,
  hours: 3_600_000,
  hr: 3_600_000,
  hrs: 3_600_000,
  h: 3_600_000,
  day: 86_400_000,
  days: 86_400_000,
  d: 86_400_000,
  week: 604_800_000,
  weeks: 604_800_000
};

/** Guard against walking an unbounded hierarchy when a store lists thousands of nodes. */
const MAX_VARIABLE_CANDIDATES = 200;

/**
 * Axis labels `@developmentseed/geozarr` accepts for the spatial dimensions.
 * Anything else cannot be rendered, so it is not worth deriving metadata for.
 */
const Y_AXIS_LABELS = new Set(['y', 'latitude', 'lat']);
const X_AXIS_LABELS = new Set(['x', 'longitude', 'lon']);

/** Variable names conventionally holding the CF grid mapping when none is named. */
const GRID_MAPPING_FALLBACK_NAMES = ['spatial_ref', 'crs', 'transverse_mercator', 'projection'];

/** Coordinate arrays longer than this are not worth materializing for a time slider. */
const MAX_COORDINATE_LENGTH = 20_000;

export type CfTimeUnits = {
  /** Milliseconds represented by one coordinate step. */
  stepMs: number;
  /** Epoch milliseconds of coordinate value zero. */
  originMs: number;
};

type AnyAttrs = Record<string, unknown>;

type StoreContents = {path: string; kind: 'array' | 'group'}[];

type ListableStore = zarr.Readable & {contents?: () => StoreContents};

/**
 * Node kinds by normalized path, built from the store's consolidated metadata.
 *
 * Zarr over plain HTTP has no directory listing, so without this every guess at
 * a coordinate or grid-mapping path costs a round trip that usually 404s. When
 * the store publishes a listing we consult it instead of probing. Null means
 * the store has no consolidated metadata and probing is the only option.
 */
type StoreIndex = Map<string, 'array' | 'group'> | null;

function normalizePath(path: string): string {
  return path.replace(/^\/+/, '').replace(/\/+$/, '');
}

function buildStoreIndex(store: ListableStore): StoreIndex {
  if (typeof store.contents !== 'function') {
    return null;
  }
  const index = new Map<string, 'array' | 'group'>();
  for (const entry of store.contents()) {
    index.set(normalizePath(entry.path), entry.kind);
  }
  return index;
}

/** True when the path is known to be absent, so opening it would only 404. */
function isKnownMissing(index: StoreIndex, path: string, kind?: 'array' | 'group'): boolean {
  if (!index) {
    return false;
  }
  const found = index.get(normalizePath(path));
  return kind ? found !== kind : found === undefined;
}

/**
 * Parse a CF `units` string of the form `"<unit> since <timestamp>"`.
 *
 * Returns null for units that are not fixed-length (months, years) or for a
 * timestamp the runtime cannot parse, so callers can fall back to treating the
 * dimension as non-temporal instead of producing nonsense dates.
 */
export function parseCfTimeUnits(units?: string | null): CfTimeUnits | null {
  if (typeof units !== 'string') {
    return null;
  }
  const match = units.trim().match(/^([a-zA-Z]+)\s+since\s+(.+)$/);
  if (!match) {
    return null;
  }
  const stepMs = CF_UNIT_MS[match[1].toLowerCase()];
  if (!stepMs) {
    return null;
  }
  const originMs = parseCfTimeOrigin(match[2]);
  if (originMs === null) {
    return null;
  }
  return {stepMs, originMs};
}

/**
 * CF reference dates come in many shapes: `1970-01-01`, `1970-1-1 0:0:0`,
 * `2020-01-01T00:00:00Z`, sometimes with a trailing offset. Normalize to
 * something `Date.parse` accepts and default to UTC when no zone is given.
 */
function parseCfTimeOrigin(origin: string): number | null {
  const trimmed = origin.trim();
  const match = trimmed.match(
    /^(\d{1,4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2}(?:\.\d+)?))?)?\s*(Z|UTC|GMT|[+-]\d{1,2}:?\d{0,2})?$/i
  );
  if (!match) {
    return null;
  }
  const [, year, month, day, hour = '0', minute = '0', second = '0', zone] = match;
  const seconds = Number.parseFloat(second);
  const base = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Math.trunc(seconds),
    Math.round((seconds % 1) * 1000)
  );
  if (!Number.isFinite(base)) {
    return null;
  }
  // Date.UTC maps years 0-99 into the 1900s, which is wrong for CF epochs like `0001-01-01`.
  const utc = Number(year) < 100 ? adjustLowYear(base, Number(year)) : base;
  return utc - parseUtcOffsetMs(zone);
}

function adjustLowYear(base: number, year: number): number {
  const date = new Date(base);
  date.setUTCFullYear(year);
  return date.getTime();
}

function parseUtcOffsetMs(zone?: string): number {
  if (!zone || /^(Z|UTC|GMT)$/i.test(zone)) {
    return 0;
  }
  const match = zone.match(/^([+-])(\d{1,2}):?(\d{0,2})$/);
  if (!match) {
    return 0;
  }
  const sign = match[1] === '-' ? -1 : 1;
  const hours = Number(match[2]);
  const minutes = match[3] ? Number(match[3]) : 0;
  return sign * (hours * 3_600_000 + minutes * 60_000);
}

/**
 * Decode CF-encoded time coordinates into epoch milliseconds.
 *
 * Returns null when the units are missing, not fixed-length, or the calendar is
 * one of the synthetic CF calendars (`360_day`, `noleap`, ...) that cannot be
 * represented on a real timeline.
 */
export function decodeCfTime(
  values: ArrayLike<number | bigint> | null | undefined,
  units?: string | null,
  calendar?: string | null
): number[] | null {
  if (!values || values.length === 0) {
    return null;
  }
  if (typeof calendar === 'string' && !SUPPORTED_CALENDARS.has(calendar.toLowerCase())) {
    return null;
  }
  const parsed = parseCfTimeUnits(units);
  if (!parsed) {
    return null;
  }
  const decoded: number[] = [];
  for (let i = 0; i < values.length; i++) {
    const raw = Number(values[i]);
    if (!Number.isFinite(raw)) {
      return null;
    }
    decoded.push(parsed.originMs + raw * parsed.stepMs);
  }
  return decoded;
}

/**
 * Animation domain for a decoded time dimension, or null when the dimension
 * carries fewer than two usable timestamps.
 */
export function getZarrTimeDomain(
  dimension?: ZarrDimensionInfo | null
): {domain: [number, number]; timeSteps: number[]} | null {
  const values = dimension?.values;
  if (!values || values.length < 2) {
    return null;
  }
  const timeSteps = [...new Set(values)].filter(Number.isFinite).sort((a, b) => a - b);
  if (timeSteps.length < 2) {
    return null;
  }
  return {domain: [timeSteps[0], timeSteps[timeSteps.length - 1]], timeSteps};
}

/** Find a variable by path, falling back to the dataset's active variable. */
export function getZarrVariable(
  metadata?: Partial<ZarrDatasetMetadata> | null,
  variablePath?: string
): ZarrVariableInfo | undefined {
  const variables = metadata?.variables;
  if (!variables || variables.length === 0) {
    return undefined;
  }
  const path = variablePath ?? metadata?.variable;
  return variables.find(variable => variable.path === path) ?? variables[0];
}

/**
 * Switch the active variable of an already-fetched dataset metadata. Pure, so
 * the layer can react to the variable dropdown without refetching the store.
 */
export function selectZarrVariable(
  metadata: ZarrDatasetMetadata,
  variablePath: string
): ZarrDatasetMetadata {
  const variable = getZarrVariable(metadata, variablePath);
  if (!variable) {
    return metadata;
  }
  return {
    ...metadata,
    variable: variable.path,
    nonSpatialDims: variable.nonSpatialDims,
    timeDimension: variable.timeDimension,
    dataRange: variable.dataRange,
    nodataValue: variable.nodataValue
  };
}

const storeCache = new Map<string, Promise<ListableStore>>();

/**
 * Open a Zarr store, preferring consolidated metadata so variable discovery
 * costs one request instead of one per node. Memoized per URL because the
 * Add Data form, the dataset refresh, and the layer all open the same store.
 */
export function openZarrStore(url: string): Promise<ListableStore> {
  const existing = storeCache.get(url);
  if (existing) {
    return existing;
  }
  const opening = (async () => {
    const store = new zarr.FetchStore(url);
    return (await zarr.withMaybeConsolidatedMetadata(store)) as ListableStore;
  })().catch((error: unknown) => {
    storeCache.delete(url);
    throw error;
  });
  storeCache.set(url, opening);
  return opening;
}

/**
 * Open the node that backs a variable: a multiscale group, or the array itself
 * for a single-resolution dataset. This is what `ZarrLayer` takes as its `node`
 * prop, already resolved so the layer does not need a `variable` path.
 */
export async function openZarrNode(
  url: string,
  variablePath?: string
): Promise<zarr.Array<zarr.DataType, zarr.Readable> | zarr.Group<zarr.Readable>> {
  const store = await openZarrStore(url);
  return zarr.open(new zarr.Location(store, toAbsolutePath(variablePath ?? '')));
}

/** Drop a cached store so a refresh re-reads the consolidated metadata. */
export function clearZarrStoreCache(url?: string): void {
  if (url === undefined) {
    storeCache.clear();
  } else {
    storeCache.delete(url);
  }
}

function toAbsolutePath(path: string): `/${string}` {
  const trimmed = path.replace(/^\/+/, '').replace(/\/+$/, '');
  return (trimmed ? `/${trimmed}` : '/') as `/${string}`;
}

function getAttrs(node: {attrs?: AnyAttrs}): AnyAttrs {
  return (node.attrs ?? {}) as AnyAttrs;
}

function readNumber(attrs: AnyAttrs, keys: string[]): number | undefined {
  for (const key of keys) {
    const value = attrs[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'bigint') {
      return Number(value);
    }
  }
  return undefined;
}

function readString(attrs: AnyAttrs, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = attrs[key];
    if (typeof value === 'string' && value) {
      return value;
    }
  }
  return undefined;
}

function readDataRange(attrs: AnyAttrs): [number, number] | undefined {
  const range = attrs.actual_range ?? attrs.valid_range;
  if (Array.isArray(range) && range.length === 2) {
    const [min, max] = range.map(Number);
    if (Number.isFinite(min) && Number.isFinite(max) && min < max) {
      return [min, max];
    }
  }
  const min = readNumber(attrs, ['valid_min', 'vmin', 'min', 'minimum']);
  const max = readNumber(attrs, ['valid_max', 'vmax', 'max', 'maximum']);
  if (min !== undefined && max !== undefined && min < max) {
    return [min, max];
  }
  return undefined;
}

/**
 * Dimension names for a zarr array. Zarr v3 stores them in `dimension_names`;
 * xarray-written v2 stores put them in the `_ARRAY_DIMENSIONS` attribute.
 */
export function getZarrDimensionNames(arr: {
  dimensionNames?: (string | null)[];
  attrs?: AnyAttrs;
  shape: number[];
}): string[] | null {
  const fromMetadata = arr.dimensionNames;
  if (fromMetadata && fromMetadata.length === arr.shape.length) {
    const named = fromMetadata.filter((name): name is string => Boolean(name));
    if (named.length === fromMetadata.length) {
      return named;
    }
  }
  const fromAttrs = getAttrs(arr)._ARRAY_DIMENSIONS;
  if (Array.isArray(fromAttrs) && fromAttrs.length === arr.shape.length) {
    const named = fromAttrs.filter((name): name is string => typeof name === 'string' && !!name);
    if (named.length === fromAttrs.length) {
      return named;
    }
  }
  return null;
}

/**
 * Candidate locations for a coordinate array. Coordinates usually sit next to
 * the variable, but xarray and the GeoZarr examples also hoist shared
 * coordinates to the store root.
 */
function coordinateCandidates(variablePath: string, name: string): `/${string}`[] {
  const parent = variablePath.split('/').slice(0, -1).join('/');
  return [
    toAbsolutePath(`${variablePath}/${name}`),
    toAbsolutePath(`${parent}/${name}`),
    toAbsolutePath(name)
  ];
}

/**
 * Resolve a coordinate array to a concrete path using the store listing, with
 * no network access. Returns null when the store has no listing (the caller
 * must probe) or when no candidate exists.
 */
export function resolveCoordinatePath(
  index: StoreIndex,
  variablePath: string,
  name: string
): string | null {
  if (!index) {
    return null;
  }
  for (const path of new Set(coordinateCandidates(variablePath, name))) {
    if (index.get(normalizePath(path)) === 'array') {
      return path;
    }
  }
  return null;
}

/** Open a 1-D coordinate array for `name`, or null when there is not one. */
async function openCoordinateArray(
  store: ListableStore,
  index: StoreIndex,
  variablePath: string,
  name: string,
  size?: number
): Promise<zarr.Array<zarr.DataType, zarr.Readable> | null> {
  for (const path of new Set(coordinateCandidates(variablePath, name))) {
    if (isKnownMissing(index, path, 'array')) {
      continue;
    }
    try {
      const arr = await zarr.open(new zarr.Location(store, path), {kind: 'array'});
      if (arr.shape.length !== 1 || (size !== undefined && arr.shape[0] !== size)) {
        continue;
      }
      return arr;
    } catch {
      // Not every dimension has a coordinate array; try the next candidate.
    }
  }
  return null;
}

/**
 * GDAL writes its six-element `GeoTransform` as a space-separated string in
 * `[c, a, b, f, d, e]` order. `@developmentseed/affine` wants `[a, b, c, d, e, f]`.
 */
export function parseGdalGeoTransform(value: unknown): number[] | null {
  const parts =
    typeof value === 'string'
      ? value.trim().split(/\s+/).map(Number)
      : Array.isArray(value)
      ? value.map(Number)
      : null;
  if (!parts || parts.length !== 6 || !parts.every(Number.isFinite)) {
    return null;
  }
  const [c, a, b, f, d, e] = parts;
  return [a, b, c, d, e, f];
}

type GridMapping = {crs?: AnyAttrs; transform?: number[]};

/**
 * Read the CF grid-mapping variable, which is where GDAL-written stores keep
 * the CRS (`crs_wkt` / `spatial_ref`) and the affine (`GeoTransform`).
 */
async function readGridMapping(
  store: ListableStore,
  index: StoreIndex,
  variablePath: string,
  arrayAttrs: AnyAttrs
): Promise<GridMapping | null> {
  const named = readString(arrayAttrs, ['grid_mapping']);
  const names = named ? [named, ...GRID_MAPPING_FALLBACK_NAMES] : GRID_MAPPING_FALLBACK_NAMES;
  const parent = variablePath.split('/').slice(0, -1).join('/');

  for (const name of new Set(names)) {
    for (const base of new Set([variablePath, parent, ''])) {
      const path = toAbsolutePath(`${base}/${name}`);
      if (isKnownMissing(index, path)) {
        continue;
      }
      let attrs: AnyAttrs;
      try {
        const node = await zarr.open(new zarr.Location(store, path));
        attrs = getAttrs(node);
      } catch {
        continue;
      }
      const wkt2 = readString(attrs, ['crs_wkt', 'spatial_ref', 'esri_pe_string']);
      const epsg = readNumber(attrs, ['epsg_code', 'EPSG_code']);
      const crs = epsg ? {'proj:code': `EPSG:${epsg}`} : wkt2 ? {'proj:wkt2': wkt2} : undefined;
      const transform = parseGdalGeoTransform(attrs.GeoTransform ?? attrs.geotransform);
      if (crs || transform) {
        return {crs, transform: transform ?? undefined};
      }
    }
  }
  return null;
}

/**
 * Derive the affine from 1-D coordinate arrays, which is how most CF stores
 * describe a regular grid. Coordinate values are cell centers, so the origin is
 * stepped back by half a cell to reach the outer edge the affine expects.
 *
 * Returns null for irregular spacing, which an affine cannot represent.
 */
async function deriveAffineFromCoordinates(
  store: ListableStore,
  index: StoreIndex,
  variablePath: string,
  yName: string,
  xName: string,
  height: number,
  width: number
): Promise<number[] | null> {
  const [yArr, xArr] = await Promise.all([
    openCoordinateArray(store, index, variablePath, yName, height),
    openCoordinateArray(store, index, variablePath, xName, width)
  ]);
  if (!yArr || !xArr) {
    return null;
  }
  const [yStats, xStats] = await Promise.all([readAxisSpacing(yArr), readAxisSpacing(xArr)]);
  if (!yStats || !xStats) {
    return null;
  }
  return affineFromCellCenters(xStats, yStats);
}

export type AxisSpacing = {first: number; step: number};

/**
 * Build an affine from the spacing of two cell-center axes. The affine maps the
 * outer edge of the first cell, so each origin is stepped back by half a cell.
 */
export function affineFromCellCenters(x: AxisSpacing, y: AxisSpacing): number[] {
  return [x.step, 0, x.first - x.step / 2, 0, y.step, y.first - y.step / 2];
}

/**
 * Derive a constant step from a cell-center coordinate array, rejecting any grid
 * the affine would misrepresent. Every coordinate is checked rather than just
 * the last, because an axis that drifts in the middle yet lands on the expected
 * endpoint would otherwise yield a silently wrong georeference.
 */
export function axisSpacingFromValues(raw: ArrayLike<number | bigint>): AxisSpacing | null {
  if (raw.length < 2) {
    return null;
  }
  const first = Number(raw[0]);
  const step = Number(raw[1]) - first;
  if (!Number.isFinite(first) || !Number.isFinite(step) || step === 0) {
    return null;
  }
  // The tolerance is generous because float32 coordinates accumulate error
  // across a long axis.
  const tolerance = Math.abs(step) * 0.5;
  for (let i = 2; i < raw.length; i++) {
    const value = Number(raw[i]);
    if (!Number.isFinite(value) || Math.abs(value - (first + step * i)) > tolerance) {
      return null;
    }
  }
  return {first, step};
}

async function readAxisSpacing(
  arr: zarr.Array<zarr.DataType, zarr.Readable>
): Promise<AxisSpacing | null> {
  if (arr.shape[0] < 2 || arr.shape[0] > MAX_COORDINATE_LENGTH) {
    return null;
  }
  const chunk = await zarr.get(arr, null);
  return axisSpacingFromValues(chunk.data as ArrayLike<number | bigint>);
}

/**
 * Synthesize GeoZarr-convention attributes for a store that does not declare
 * them, using the CF/GDAL metadata that real-world Zarr publishers actually
 * write: a grid-mapping variable and/or 1-D coordinate arrays.
 *
 * `ZarrLayer` re-parses whatever is passed as its `metadata` prop, so the
 * result is attributes rather than a parsed descriptor.
 */
async function deriveGeoZarrAttrs(
  store: ListableStore,
  index: StoreIndex,
  variablePath: string,
  arr: zarr.Array<zarr.DataType, zarr.Readable>,
  dimensionNames: string[]
): Promise<AnyAttrs | null> {
  if (dimensionNames.length < 2) {
    return null;
  }
  const yName = dimensionNames[dimensionNames.length - 2];
  const xName = dimensionNames[dimensionNames.length - 1];
  // The renderer requires the spatial dims last, in [y, x] order, and labeled
  // with names the GeoZarr parser recognizes.
  if (!Y_AXIS_LABELS.has(yName.toLowerCase()) || !X_AXIS_LABELS.has(xName.toLowerCase())) {
    return null;
  }

  const height = arr.shape[arr.shape.length - 2];
  const width = arr.shape[arr.shape.length - 1];
  const gridMapping = await readGridMapping(store, index, variablePath, getAttrs(arr));

  const transform =
    gridMapping?.transform ??
    (await deriveAffineFromCoordinates(store, index, variablePath, yName, xName, height, width));
  if (!transform) {
    return null;
  }

  // Lat/lon axis names imply geographic coordinates when nothing declares a CRS.
  const isGeographic = yName.toLowerCase() !== 'y' && xName.toLowerCase() !== 'x';
  const crs = gridMapping?.crs ?? (isGeographic ? {'proj:code': 'EPSG:4326'} : null);
  if (!crs) {
    return null;
  }

  return {
    'spatial:dimensions': [yName, xName],
    'spatial:transform': transform,
    'spatial:shape': [height, width],
    ...crs
  };
}

/**
 * Level paths of an OME-NGFF style `multiscales` attribute, finest first.
 *
 * `ndpyramid` and `xarray-multiscale` write a pyramid this way: a list of
 * multiscale descriptors, each holding a `datasets` array of child paths. The
 * zarr-conventions form the GeoZarr parser reads is instead an object with a
 * `layout`, so the two have to be told apart and the OME form rewritten.
 */
export function parseOmeMultiscaleLevels(attrs: AnyAttrs): string[] | null {
  const raw = attrs.multiscales;
  const entry = Array.isArray(raw) ? raw[0] : raw;
  if (!entry || typeof entry !== 'object') {
    return null;
  }
  const datasets = (entry as {datasets?: unknown}).datasets;
  if (!Array.isArray(datasets) || datasets.length === 0) {
    return null;
  }
  const paths: string[] = [];
  for (const dataset of datasets) {
    const path = (dataset as {path?: unknown})?.path;
    if (typeof path !== 'string' || !normalizePath(path)) {
      return null;
    }
    paths.push(normalizePath(path));
  }
  return paths;
}

/**
 * Whether `multiscales` describes a web-mercator tile pyramid.
 *
 * This is what `ndpyramid`'s `pyramid_reproject` writes and what CarbonPlan
 * publishes: every level is reprojected to EPSG:3857 and covers the whole world
 * in `pixels_per_tile * 2 ** level` pixels. Knowing that lets the renderer tie
 * the level it draws to the map zoom, which is how such a pyramid is meant to
 * be read.
 */
export function isWebMercatorPyramid(attrs: AnyAttrs): boolean {
  const raw = attrs?.multiscales;
  const entry = Array.isArray(raw) ? raw[0] : raw;
  const datasets = (entry as {datasets?: unknown})?.datasets;
  if (!Array.isArray(datasets) || datasets.length < 2) {
    return false;
  }
  return datasets.every(dataset => {
    const {crs, pixels_per_tile: pixelsPerTile} = (dataset ?? {}) as {
      crs?: unknown;
      pixels_per_tile?: unknown;
    };
    return crs === 'EPSG:3857' && typeof pixelsPerTile === 'number' && pixelsPerTile > 0;
  });
}

/**
 * Order pyramid levels finest first, which is what the renderer expects.
 *
 * OME-NGFF asks for that order in the declaration, but a web-mercator pyramid —
 * what `ndpyramid`'s `pyramid_reproject` writes, and what CarbonPlan publishes —
 * numbers its levels by zoom, so `0` is the coarsest. Sorting by resolution
 * rather than trusting the declared order reads either convention right.
 */
export function orderLevelsFinestFirst<T extends {shape: number[]}>(levels: T[]): T[] {
  return [...levels].sort((a, b) => b.shape[0] * b.shape[1] - a.shape[0] * a.shape[1]);
}

/**
 * Names of the data arrays a pyramid level holds.
 *
 * An OME-NGFF level path points straight at the array, so there is nothing to
 * name and the result is a single empty string. `ndpyramid` instead writes an
 * xarray dataset per level, so the level is a group and each array inside it is
 * a separate variable sharing the same pyramid.
 */
export function multiscaleVariableNames(index: StoreIndex, levelPath: string): string[] {
  if (!index) {
    return [];
  }
  const normalized = normalizePath(levelPath);
  if (index.get(normalized) === 'array') {
    return [''];
  }
  const prefix = `${normalized}/`;
  const names: string[] = [];
  for (const [path, kind] of index) {
    if (kind !== 'array' || !path.startsWith(prefix)) {
      continue;
    }
    const rest = path.slice(prefix.length);
    if (!rest.includes('/')) {
      names.push(rest);
    }
  }
  return names;
}

/**
 * Rewrite per-level grids into the `multiscales.layout` the GeoZarr parser
 * reads. Levels stay finest-first, which is the order it expects.
 */
export function buildMultiscaleAttrs(
  base: AnyAttrs,
  levels: {asset: string; transform: number[]; shape: number[]}[]
): AnyAttrs {
  // The finest grid stays at the top level as well, because the convention
  // allows per-level values to be omitted and falls back to it.
  return {
    ...base,
    multiscales: {
      layout: levels.map(level => ({
        asset: level.asset,
        'spatial:transform': level.transform,
        'spatial:shape': level.shape
      }))
    }
  };
}

type CoordinateResult = {dimension: ZarrDimensionInfo; isCfTime: boolean};

/**
 * Coordinate arrays are shared across the variables of a store, and a time axis
 * can run to thousands of values. Read each one once per metadata fetch.
 */
type CoordinateCache = Map<string, Promise<CoordinateResult>>;

function readCoordinateDimension(
  store: ListableStore,
  index: StoreIndex,
  variablePath: string,
  name: string,
  size: number,
  cache: CoordinateCache
): Promise<CoordinateResult> {
  const resolved = resolveCoordinatePath(index, variablePath, name);
  if (index && !resolved) {
    // The listing says this dimension has no coordinate array; do not probe.
    return Promise.resolve({dimension: {name, size}, isCfTime: false});
  }
  const key = `${resolved ?? variablePath}|${name}|${size}`;
  const cached = cache.get(key);
  if (cached) {
    return cached;
  }
  const pending = loadCoordinateDimension(store, index, variablePath, name, size);
  cache.set(key, pending);
  return pending;
}

async function loadCoordinateDimension(
  store: ListableStore,
  index: StoreIndex,
  variablePath: string,
  name: string,
  size: number
): Promise<CoordinateResult> {
  const dimension: ZarrDimensionInfo = {name, size};
  if (size > MAX_COORDINATE_LENGTH) {
    return {dimension, isCfTime: false};
  }

  const arr = await openCoordinateArray(store, index, variablePath, name, size);
  if (!arr) {
    return {dimension, isCfTime: false};
  }

  try {
    const chunk = await zarr.get(arr, null);
    const raw = chunk.data as ArrayLike<number | bigint>;
    const attrs = getAttrs(arr);
    const decoded = decodeCfTime(
      raw,
      readString(attrs, ['units']),
      readString(attrs, ['calendar'])
    );
    if (decoded) {
      return {dimension: {...dimension, values: decoded}, isCfTime: true};
    }
    const values: number[] = [];
    for (let i = 0; i < raw.length; i++) {
      values.push(Number(raw[i]));
    }
    return {
      dimension: {...dimension, values: values.every(Number.isFinite) ? values : undefined},
      isCfTime: false
    };
  } catch {
    return {dimension, isCfTime: false};
  }
}

/**
 * A dimension decoded through CF units is temporal regardless of its name.
 * Otherwise fall back to the conventional time dimension names.
 */
function isTimeDimension(dimension: ZarrDimensionInfo, decodedFromCf: boolean): boolean {
  if (!dimension.values || dimension.values.length < 2) {
    return false;
  }
  return decodedFromCf || TIME_DIMENSION_NAMES.has(dimension.name.toLowerCase());
}

async function buildVariableInfo(
  store: ListableStore,
  index: StoreIndex,
  path: string,
  geoAttrs: AnyAttrs,
  cache: CoordinateCache,
  options: {preopened?: zarr.Array<zarr.DataType, zarr.Readable>; nodePath?: string} = {}
): Promise<ZarrVariableInfo | null> {
  const geo = parseGeoZarrMetadata(geoAttrs);
  const spatialDims = [geo.axes[geo.yAxisIndex], geo.axes[geo.xAxisIndex]];

  const nodePath = options.nodePath ?? path;
  const basePath = toAbsolutePath(nodePath);
  const finest = geo.levels[0];
  const arrayPath =
    !finest || finest.path === '.' ? basePath : toAbsolutePath(`${nodePath}/${finest.path}`);
  const arr =
    options.preopened ?? (await zarr.open(new zarr.Location(store, arrayPath), {kind: 'array'}));

  const dimensionNames = getZarrDimensionNames(arr);
  if (!dimensionNames) {
    throw new Error(
      `Zarr array "${arrayPath}" does not name every dimension. ` +
        'Rendering requires zarr v3 `dimension_names` or an `_ARRAY_DIMENSIONS` attribute.'
    );
  }

  const nonSpatialDims: ZarrDimensionInfo[] = [];
  let timeDimension: ZarrDimensionInfo | undefined;
  for (let i = 0; i < dimensionNames.length; i++) {
    const name = dimensionNames[i];
    if (spatialDims.includes(name)) {
      continue;
    }
    // Coordinates live beside the array, which for a pyramid is inside the
    // finest level rather than next to the node the layer is handed.
    const {dimension, isCfTime} = await readCoordinateDimension(
      store,
      index,
      arrayPath,
      name,
      arr.shape[i],
      cache
    );
    nonSpatialDims.push(dimension);
    if (!timeDimension && isTimeDimension(dimension, isCfTime)) {
      timeDimension = dimension;
    }
  }

  const arrayAttrs = getAttrs(arr);
  const fillValue = arr.fillValue;

  const name = path.split('/').filter(Boolean).pop() || path || 'data';

  return {
    path,
    ...(options.nodePath !== undefined && {nodePath: options.nodePath}),
    name,
    // Qualified later, once every sibling variable is known.
    displayName: name,
    geoAttrs,
    shape: [...arr.shape],
    chunks: [...arr.chunks],
    dtype: String(arr.dtype),
    nonSpatialDims,
    timeDimension,
    dataRange: readDataRange(arrayAttrs) ?? readDataRange(geoAttrs),
    nodataValue:
      readNumber(arrayAttrs, ['_FillValue', 'missing_value', 'nodata']) ??
      (typeof fillValue === 'number' && Number.isFinite(fillValue) ? fillValue : undefined),
    unit: readString(arrayAttrs, ['units', 'unit'])
  };
}

/**
 * Build one variable per data array of an OME-NGFF style pyramid.
 *
 * Each level holds the same arrays at a lower resolution, so a variable's
 * identity is the group plus the array name while the node handed to the
 * renderer is the group itself. A level whose grid cannot be derived ends the
 * pyramid rather than discarding it, leaving the finer levels usable.
 */
async function buildPyramidVariables(
  store: ListableStore,
  index: StoreIndex,
  groupPath: string,
  levelPaths: string[],
  cache: CoordinateCache
): Promise<ZarrVariableInfo[]> {
  const base = normalizePath(groupPath);
  const resolve = (rest: string) => (base ? `${base}/${rest}` : rest);
  const names = multiscaleVariableNames(index, resolve(levelPaths[0]));
  const variables: ZarrVariableInfo[] = [];

  for (const name of names.slice(0, MAX_VARIABLE_CANDIDATES)) {
    const asset = (level: string) => (name ? `${level}/${name}` : level);
    const collected: {
      asset: string;
      transform: number[];
      shape: number[];
      arr: zarr.Array<zarr.DataType, zarr.Readable>;
      attrs: AnyAttrs;
    }[] = [];

    for (const level of levelPaths) {
      const levelPath = resolve(asset(level));
      if (isKnownMissing(index, levelPath, 'array')) {
        break;
      }
      let arr: zarr.Array<zarr.DataType, zarr.Readable>;
      try {
        arr = await zarr.open(new zarr.Location(store, toAbsolutePath(levelPath)), {kind: 'array'});
      } catch {
        break;
      }
      const dimensionNames = getZarrDimensionNames(arr);
      const attrs = dimensionNames
        ? await deriveGeoZarrAttrs(store, index, levelPath, arr, dimensionNames)
        : null;
      if (!attrs) {
        break;
      }
      collected.push({
        asset: asset(level),
        transform: attrs['spatial:transform'] as number[],
        shape: attrs['spatial:shape'] as number[],
        arr,
        attrs
      });
    }

    if (!collected.length) {
      continue;
    }
    const ordered = orderLevelsFinestFirst(collected);
    const finest = ordered[0];
    const variable = await buildVariableInfo(
      store,
      index,
      name ? resolve(name) : base,
      buildMultiscaleAttrs(
        finest.attrs,
        ordered.map(({asset: a, transform, shape}) => ({asset: a, transform, shape}))
      ),
      cache,
      {preopened: finest.arr, nodePath: base}
    );
    if (variable) {
      variables.push(variable);
    }
  }
  return variables;
}

function pathSuffix(path: string, depth: number): string {
  return path.split('/').filter(Boolean).slice(-depth).join('/');
}

/**
 * Stores often repeat a variable across scenario groups, e.g. `FUTUR/evap_total`
 * and `HISTO/evap_total`. Listing those by array name alone shows the same label
 * several times, so prepend the fewest leading path segments that tell them
 * apart. Names that are already unique are left alone.
 */
export function assignVariableDisplayNames<
  T extends {path: string; name: string; displayName: string}
>(variables: T[]): T[] {
  const byName = new Map<string, T[]>();
  for (const variable of variables) {
    const group = byName.get(variable.name);
    if (group) {
      group.push(variable);
    } else {
      byName.set(variable.name, [variable]);
    }
  }

  const labels = new Map<T, string>();
  for (const group of byName.values()) {
    if (group.length < 2) {
      continue;
    }
    const maxDepth = Math.max(
      ...group.map(variable => variable.path.split('/').filter(Boolean).length)
    );
    let depth = 2;
    let candidates = group.map(variable => pathSuffix(variable.path, depth));
    while (new Set(candidates).size < group.length && depth < maxDepth) {
      depth += 1;
      candidates = group.map(variable => pathSuffix(variable.path, depth));
    }
    group.forEach((variable, i) => labels.set(variable, candidates[i] || variable.name));
  }

  return variables.map(variable => {
    const label = labels.get(variable);
    return label ? {...variable, displayName: label} : variable;
  });
}

/**
 * Prefix matching everything below a matched node, so its resolution levels are
 * not offered as variables of their own. When the root matched, every remaining
 * path is one of its children.
 */
export function childPrefix(path: string): string {
  const normalized = normalizePath(path);
  return normalized ? `${normalized}/` : '';
}

async function listCandidatePaths(store: ListableStore): Promise<string[]> {
  if (typeof store.contents !== 'function') {
    return [''];
  }
  const contents = store.contents();
  const paths = contents
    .filter(entry => entry.kind === 'group' || entry.kind === 'array')
    .map(entry => entry.path.replace(/^\/+/, ''))
    // Shallow nodes first so a multiscale parent is matched before its levels.
    .sort((a, b) => a.split('/').length - b.split('/').length || a.localeCompare(b));
  return paths.length ? paths : [''];
}

/**
 * Discover every renderable variable in a store.
 *
 * Nodes that declare the GeoZarr `spatial` and `geo-proj` conventions are used
 * as-is. Very little published data does yet, so an array that does not declare
 * them is still accepted when its CF/GDAL metadata is enough to derive the same
 * information. Children of a matched node are skipped so resolution levels are
 * not offered as separate variables.
 */
export async function getZarrMetadata(
  url: string,
  options: {variable?: string} = {}
): Promise<ZarrDatasetMetadata> {
  const store = await openZarrStore(url);
  const index = buildStoreIndex(store);
  const paths = await listCandidatePaths(store);

  const variables: ZarrVariableInfo[] = [];
  const coordinateCache: CoordinateCache = new Map();
  const geoByPath = new Map<string, ReturnType<typeof parseGeoZarrMetadata>>();
  const matchedPrefixes: string[] = [];
  const errors: string[] = [];
  let webMercatorPyramid = false;

  for (const path of paths.slice(0, MAX_VARIABLE_CANDIDATES)) {
    if (matchedPrefixes.some(prefix => path.startsWith(prefix))) {
      continue;
    }
    let node: Awaited<ReturnType<typeof zarr.open>>;
    try {
      node = await zarr.open(new zarr.Location(store, toAbsolutePath(path)));
    } catch {
      continue;
    }

    const declared = getAttrs(node);

    // A pyramid written in the OME-NGFF style has to be rewritten before the
    // GeoZarr parser can read it, and yields one variable per array in a level.
    const levelPaths = 'shape' in node ? null : parseOmeMultiscaleLevels(declared);
    if (levelPaths) {
      try {
        const pyramid = await buildPyramidVariables(
          store,
          index,
          path,
          levelPaths,
          coordinateCache
        );
        if (pyramid.length) {
          for (const variable of pyramid) {
            variables.push(variable);
            geoByPath.set(variable.path, parseGeoZarrMetadata(variable.geoAttrs as AnyAttrs));
          }
          webMercatorPyramid = webMercatorPyramid || isWebMercatorPyramid(declared);
          matchedPrefixes.push(childPrefix(path));
          continue;
        }
      } catch (error) {
        errors.push(error instanceof Error ? error.message : String(error));
      }
    }

    let geoAttrs: AnyAttrs | null = null;
    let preopened: zarr.Array<zarr.DataType, zarr.Readable> | undefined;
    try {
      parseGeoZarrMetadata(declared);
      geoAttrs = declared;
    } catch {
      // Not a declared GeoZarr node. Most nodes in a store are not, so fall
      // back to deriving the spatial metadata from a data array's own attrs.
      if ('shape' in node) {
        const arr = node as zarr.Array<zarr.DataType, zarr.Readable>;
        const dimensionNames = getZarrDimensionNames(arr);
        geoAttrs = dimensionNames
          ? await deriveGeoZarrAttrs(store, index, path, arr, dimensionNames)
          : null;
        preopened = arr;
      }
    }
    if (!geoAttrs) {
      continue;
    }

    try {
      const variable = await buildVariableInfo(store, index, path, geoAttrs, coordinateCache, {
        preopened
      });
      if (variable) {
        variables.push(variable);
        geoByPath.set(path, parseGeoZarrMetadata(geoAttrs));
        matchedPrefixes.push(childPrefix(path));
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  if (variables.length === 0) {
    if (errors.length) {
      throw new Error(errors[0]);
    }
    // Zarr over plain HTTP cannot be listed, so without consolidated metadata
    // only the node the URL points at is reachable.
    throw new Error(
      index
        ? 'No renderable variables found. The store must either declare the GeoZarr `spatial` ' +
          'and `geo-proj` conventions, or expose a data array whose last two dimensions are ' +
          'named y/x (or lat/lon) with coordinate arrays or a CF grid mapping.'
        : 'This store has no consolidated metadata, so its variables cannot be listed. Point ' +
          'the URL directly at a data array, or use a store written with consolidated metadata.'
    );
  }

  const labeled = assignVariableDisplayNames(variables);
  const active =
    labeled.find(variable => variable.path === options.variable) ??
    (labeled[0] as ZarrVariableInfo);
  const geo = geoByPath.get(active.path);

  return {
    url,
    variable: active.path,
    crs: geo?.crs,
    axes: geo?.axes ?? [],
    xAxisIndex: geo?.xAxisIndex ?? -1,
    yAxisIndex: geo?.yAxisIndex ?? -1,
    levels: (geo?.levels ?? []).map(level => ({
      path: level.path,
      shape: [level.arrayHeight, level.arrayWidth],
      chunks: active.chunks.slice(-2)
    })),
    variables: labeled,
    nonSpatialDims: active.nonSpatialDims,
    timeDimension: active.timeDimension,
    dataRange: active.dataRange,
    nodataValue: active.nodataValue,
    ...(webMercatorPyramid && {webMercatorPyramid})
  };
}
