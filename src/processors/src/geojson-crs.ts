// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import proj4 from 'proj4';
import definitions from 'proj4js-definitions/proj4js-definitions.json';
import {isPlainObject} from '@kepler.gl/utils';

// Keep definitions local: importing a file must not fetch a CRS URL or send its
// coordinates to a service. Resolve only the definitions used by that file.
const EPSG_DEFINITIONS = new Map(definitions as Array<[string, string]>);
const WGS84_NAMES = [
  /^(?:WGS ?84|(?:OGC:)?CRS84h?)$/i,
  /^urn:(?:x-)?ogc:def:crs:OGC:(?:(?:[\d.]*:)?CRS84h?|2:84)$/i,
  /^https?:\/\/www\.opengis\.net\/def\/crs\/OGC\/[\d.]+\/CRS84h?$/i
];

export type GeojsonCrsOptions = {
  /** Explicit approval for these unknown declarations in this file only. */
  assumeLongitudeLatitude?: readonly string[];
};

export class UnknownGeojsonCrsError extends Error {
  readonly identifiers: string[];
  /** Original bytes retained by the file importer for an explicit retry. */
  file?: File;

  constructor(identifiers: string[]) {
    super(
      `Unknown GeoJSON coordinate reference system: ${identifiers.join(', ')}. ` +
        'Only load as longitude/latitude if you know the coordinates are in degrees. ' +
        'The map may otherwise show incorrect locations.'
    );
    this.name = 'UnknownGeojsonCrsError';
    this.identifiers = identifiers;
  }
}

function unsupportedCrs(identifier: string): Error {
  return new Error(
    `Read File Failed: GeoJSON coordinate reference system "${identifier}" cannot be converted. ` +
      'Convert coordinates to WGS84 (EPSG:4326) before importing.'
  );
}

function canonicalCrs(identifier: string): string {
  if (WGS84_NAMES.some(pattern => pattern.test(identifier))) return 'EPSG:4326';
  const epsg = [
    /^EPSG:(\d+)$/i,
    /^urn:(?:x-)?ogc:def:crs:EPSG:(?:[\d.]*:)?(\d+)$/i,
    /^https?:\/\/www\.opengis\.net\/def\/crs\/EPSG\/[\d.]+\/(\d+)$/i,
    /^https?:\/\/www\.opengis\.net\/gml\/srs\/epsg\.xml#(\d+)$/i
  ]
    .map(pattern => identifier.match(pattern))
    .find(Boolean);
  return epsg ? `EPSG:${epsg[1]}` : identifier;
}

type Crs = {identifier: string; unknown?: boolean; project?: (position: number[]) => number[]};

function resolveCrs(identifier: string): Crs {
  const name = canonicalCrs(identifier);
  if (name === 'EPSG:4326') return {identifier};
  const registered = proj4.defs(name);
  const definition =
    (registered && typeof registered === 'object' && registered.projName
      ? registered
      : undefined) ||
    EPSG_DEFINITIONS.get(name) ||
    (/(?:^|\s)\+proj=/i.test(name) ||
    /^(?:GEOGCS|GEOGCRS|GEODCRS|PROJCS|PROJCRS|BOUNDCRS|COMPD_CS|COMPOUNDCRS|GEOCCS)\s*\[/i.test(
      name
    )
      ? name
      : undefined);
  if (!definition) return {identifier, unknown: true};
  try {
    // Proj4 exposes these parsed fields at runtime but omits them from its
    // Projection declaration.
    const source: InstanceType<typeof proj4.Proj> & {projName?: string; nadgrids?: string} =
      new proj4.Proj(definition);
    // Horizontal GeoJSON import cannot supply vertical coordinates or datum
    // grids. Do not silently fall back when a known transformation needs them.
    if (
      source.projName === 'geocent' ||
      /^(?:COMPD_CS|COMPOUNDCRS)\s*\[/i.test(name) ||
      (source.nadgrids &&
        source.nadgrids.split(',').some(grid => !['null', '@null'].includes(grid)))
    ) {
      throw unsupportedCrs(identifier);
    }
    const projection = proj4(source, 'EPSG:4326');
    return {identifier, project: position => projection.forward(position)};
  } catch {
    // A definition was found, so this is an unsupported transformation, not an
    // unknown label that the user may override.
    throw unsupportedCrs(identifier);
  }
}

function declaredCrs(value: Record<string, any>): string | undefined {
  const {crs} = value;
  if (!isPlainObject(crs) || !isPlainObject(crs.properties)) return undefined;
  const identifier =
    crs.type === 'name'
      ? crs.properties.name
      : crs.type === 'link'
      ? crs.properties.href
      : undefined;
  return typeof identifier === 'string' && identifier.trim() ? identifier.trim() : undefined;
}

/** Resolve inherited declarations and transform geometry before it reaches a layer. */
export function normalizeGeojsonCrs(rawData: unknown, options: GeojsonCrsOptions = {}): unknown {
  const resolved = new Map<string, Crs>();
  const unknown = new Set<string>();
  const approved = new Set(options.assumeLongitudeLatitude);
  let hasDeclaration = false;
  let needsBoundsRefresh = false;

  const coordinates = (value: unknown, crs: Crs): unknown => {
    if (!Array.isArray(value) || !value.length) return value;
    if (!crs.unknown && !crs.project) return value;
    if (Array.isArray(value[0])) return value.map(child => coordinates(child, crs));
    const [x, y] = value;
    if (!Number.isFinite(x) || !Number.isFinite(y)) throw unsupportedCrs(crs.identifier);
    if (crs.unknown) {
      // This validates the user's proposed interpretation; it does not infer a
      // CRS from coordinate ranges. Known projected definitions never use it.
      if (Math.abs(x) > 180 || Math.abs(y) > 90) throw unsupportedCrs(crs.identifier);
      return value;
    }
    if (!crs.project) return value;
    let projected: number[];
    try {
      projected = crs.project([x, y]);
    } catch {
      throw unsupportedCrs(crs.identifier);
    }
    if (
      !Number.isFinite(projected[0]) ||
      !Number.isFinite(projected[1]) ||
      Math.abs(projected[1]) > 90
    ) {
      throw unsupportedCrs(crs.identifier);
    }
    // Reproject horizontal coordinates only; preserve altitude and measures.
    return [...projected.slice(0, 2), ...value.slice(2)];
  };

  const visit = (value: unknown, inherited?: Crs): unknown => {
    if (!isPlainObject(value)) return value;
    const identifier = declaredCrs(value);
    let crs = inherited;
    if (identifier) {
      hasDeclaration = true;
      if (!resolved.has(identifier)) resolved.set(identifier, resolveCrs(identifier));
      crs = resolved.get(identifier);
      if (crs?.unknown && !approved.has(identifier)) unknown.add(identifier);
      needsBoundsRefresh ||= Boolean(crs?.unknown || crs?.project);
    }
    const result = {...value};
    if (value.type === 'Feature') {
      if (isPlainObject(value.properties)) result.properties = {...value.properties};
      result.geometry = visit(value.geometry, crs);
    } else if (value.type === 'FeatureCollection' && Array.isArray(value.features)) {
      result.features = value.features.map(feature => visit(feature, crs));
    } else if (value.type === 'GeometryCollection' && Array.isArray(value.geometries)) {
      result.geometries = value.geometries.map(geometry => visit(geometry, crs));
    } else if (crs && 'coordinates' in value) {
      result.coordinates = coordinates(value.coordinates, crs);
    }
    // A parent bbox can also describe descendants with a different CRS.
    // Geometry-derived bounds are recalculated from the resulting coordinates.
    delete result.crs;
    if (needsBoundsRefresh) delete result.bbox;
    return result;
  };

  // Build a separate tree so an unknown/unsupported nested CRS cannot leave
  // partially reprojected input behind when the user retries the import.
  const result = visit(rawData);
  if (unknown.size) throw new UnknownGeojsonCrsError([...unknown]);
  return hasDeclaration ? result : rawData;
}
