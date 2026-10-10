// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project
// Adapted from GeoLibre (https://github.com/opengeos/GeoLibre), MIT License.

import type {Feature, FeatureCollection, Geometry, Position} from 'geojson';

/**
 * Write a GeoJSON FeatureCollection to an ESRI Shapefile dataset (the .shp,
 * .shx, .dbf, .prj, and .cpg parts) entirely in the browser.
 *
 * DuckDB-WASM and Pyodide's bundled GDAL cannot write GDAL vector formats in the
 * browser, so the binary parts are assembled directly. The dataset is WGS84
 * (EPSG:4326). All geometries must share one shape family (point/line/polygon);
 * features whose geometry is null or of a different family are written as the
 * Shapefile "Null" shape so the record count still lines up with the .dbf.
 */

export interface ShapefileParts {
  shp: Uint8Array;
  shx: Uint8Array;
  dbf: Uint8Array;
  prj: Uint8Array;
  cpg: Uint8Array;
}

const SHAPE_NULL = 0;
const SHAPE_POINT = 1;
const SHAPE_POLYLINE = 3;
const SHAPE_POLYGON = 5;
const SHAPE_MULTIPOINT = 8;

const WGS84_PRJ =
  'GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",' +
  '6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],' +
  'UNIT["Degree",0.0174532925199433]]';

type Family = 'point' | 'line' | 'polygon';

function familyOf(geometry: Geometry): Family | null {
  switch (geometry.type) {
    case 'Point':
    case 'MultiPoint':
      return 'point';
    case 'LineString':
    case 'MultiLineString':
      return 'line';
    case 'Polygon':
    case 'MultiPolygon':
      return 'polygon';
    default:
      return null;
  }
}

/** Pick the single Shapefile shape type for the whole file. */
function fileShapeType(features: Feature[]): {type: number; family: Family} {
  let family: Family | null = null;
  let hasMultiPoint = false;
  for (const feature of features) {
    if (!feature.geometry) continue;
    const geomFamily = familyOf(feature.geometry);
    if (!geomFamily) continue;
    if (family === null) family = geomFamily;
    if (feature.geometry.type === 'MultiPoint') hasMultiPoint = true;
  }
  if (family === null) {
    throw new Error('The layer has no supported geometries to export.');
  }
  if (family === 'point') {
    return {type: hasMultiPoint ? SHAPE_MULTIPOINT : SHAPE_POINT, family};
  }
  return {type: family === 'line' ? SHAPE_POLYLINE : SHAPE_POLYGON, family};
}

/** Signed area of a ring; positive is counter-clockwise (screen coords, y up). */
function ringSignedArea(ring: Position[]): number {
  let area = 0;
  for (let i = 0; i < ring.length - 1; i += 1) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[i + 1];
    area += Number(x1) * Number(y2) - Number(x2) * Number(y1);
  }
  return area / 2;
}

/** Return a ring oriented clockwise (`wantClockwise`) or counter-clockwise.
 * Shapefile polygons require clockwise outer rings and counter-clockwise holes. */
function orientRing(ring: Position[], wantClockwise: boolean): Position[] {
  const isClockwise = ringSignedArea(ring) < 0;
  return isClockwise === wantClockwise ? ring : [...ring].reverse();
}

/** Flatten a geometry into Shapefile "parts" (rings/lines) of positions, with
 * polygon rings reoriented for the Shapefile convention. */
function geometryParts(geometry: Geometry, family: Family): Position[][] {
  if (family === 'line') {
    if (geometry.type === 'LineString') return [geometry.coordinates];
    if (geometry.type === 'MultiLineString') return geometry.coordinates;
    return [];
  }
  // polygon
  const polygons =
    geometry.type === 'Polygon'
      ? [geometry.coordinates]
      : geometry.type === 'MultiPolygon'
      ? geometry.coordinates
      : [];
  const parts: Position[][] = [];
  for (const rings of polygons) {
    rings.forEach((ring, index) => {
      // First ring of each polygon is the outer ring (clockwise); the rest are
      // holes (counter-clockwise).
      parts.push(orientRing(ring, index === 0));
    });
  }
  return parts;
}

function pointsOf(geometry: Geometry): Position[] {
  if (geometry.type === 'Point') return [geometry.coordinates];
  if (geometry.type === 'MultiPoint') return geometry.coordinates;
  return [];
}

interface Box {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

function emptyBox(): Box {
  return {minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity};
}

function extend(box: Box, x: number, y: number): void {
  if (Number.isFinite(x)) {
    box.minX = Math.min(box.minX, x);
    box.maxX = Math.max(box.maxX, x);
  }
  if (Number.isFinite(y)) {
    box.minY = Math.min(box.minY, y);
    box.maxY = Math.max(box.maxY, y);
  }
}

function safeBox(box: Box): Box {
  return Number.isFinite(box.minX) ? box : {minX: 0, minY: 0, maxX: 0, maxY: 0};
}

/** Encode one geometry's Shapefile record content (without the 8-byte record
 * header). Returns the content bytes and accumulates into the file bbox. */
function encodeShape(
  geometry: Geometry | null,
  shapeType: number,
  family: Family,
  fileBox: Box
): Uint8Array {
  if (!geometry || familyOf(geometry) !== family) {
    // Null shape: just the int32 little-endian shape type 0.
    const nullShape = new Uint8Array(4);
    new DataView(nullShape.buffer).setInt32(0, SHAPE_NULL, true);
    return nullShape;
  }

  if (shapeType === SHAPE_POINT) {
    const [x, y] = pointsOf(geometry)[0] ?? [0, 0];
    extend(fileBox, Number(x), Number(y));
    const content = new Uint8Array(20);
    const view = new DataView(content.buffer);
    view.setInt32(0, SHAPE_POINT, true);
    view.setFloat64(4, Number(x), true);
    view.setFloat64(12, Number(y), true);
    return content;
  }

  if (shapeType === SHAPE_MULTIPOINT) {
    const points = pointsOf(geometry);
    const box = emptyBox();
    for (const [x, y] of points) extend(box, Number(x), Number(y));
    const drawn = safeBox(box);
    extend(fileBox, drawn.minX, drawn.minY);
    extend(fileBox, drawn.maxX, drawn.maxY);
    const content = new Uint8Array(4 + 32 + 4 + points.length * 16);
    const view = new DataView(content.buffer);
    view.setInt32(0, SHAPE_MULTIPOINT, true);
    view.setFloat64(4, drawn.minX, true);
    view.setFloat64(12, drawn.minY, true);
    view.setFloat64(20, drawn.maxX, true);
    view.setFloat64(28, drawn.maxY, true);
    view.setInt32(36, points.length, true);
    let offset = 40;
    for (const [x, y] of points) {
      view.setFloat64(offset, Number(x), true);
      view.setFloat64(offset + 8, Number(y), true);
      offset += 16;
    }
    return content;
  }

  // PolyLine (3) or Polygon (5): identical record layout.
  const parts = geometryParts(geometry, family);
  const numParts = parts.length;
  const flatPoints: Position[] = parts.flat();
  const box = emptyBox();
  for (const [x, y] of flatPoints) extend(box, Number(x), Number(y));
  const drawn = safeBox(box);
  extend(fileBox, drawn.minX, drawn.minY);
  extend(fileBox, drawn.maxX, drawn.maxY);

  const content = new Uint8Array(4 + 32 + 4 + 4 + numParts * 4 + flatPoints.length * 16);
  const view = new DataView(content.buffer);
  view.setInt32(0, shapeType, true);
  view.setFloat64(4, drawn.minX, true);
  view.setFloat64(12, drawn.minY, true);
  view.setFloat64(20, drawn.maxX, true);
  view.setFloat64(28, drawn.maxY, true);
  view.setInt32(36, numParts, true);
  view.setInt32(40, flatPoints.length, true);
  let offset = 44;
  let runningIndex = 0;
  for (const part of parts) {
    view.setInt32(offset, runningIndex, true);
    offset += 4;
    runningIndex += part.length;
  }
  for (const [x, y] of flatPoints) {
    view.setFloat64(offset, Number(x), true);
    view.setFloat64(offset + 8, Number(y), true);
    offset += 16;
  }
  return content;
}

/** Write the 100-byte .shp/.shx header. `fileWords` is the file length in
 * 16-bit words; `box` the dataset bounding box. */
function writeMainHeader(target: Uint8Array, shapeType: number, fileWords: number, box: Box): void {
  const view = new DataView(target.buffer, target.byteOffset, 100);
  view.setInt32(0, 9994, false); // file code (big-endian)
  view.setInt32(24, fileWords, false); // file length in words (big-endian)
  view.setInt32(28, 1000, true); // version (little-endian)
  view.setInt32(32, shapeType, true);
  const drawn = safeBox(box);
  view.setFloat64(36, drawn.minX, true);
  view.setFloat64(44, drawn.minY, true);
  view.setFloat64(52, drawn.maxX, true);
  view.setFloat64(60, drawn.maxY, true);
  // Z and M ranges remain zero (2D output).
}

// ----- DBF (attribute table) -----

type DbfFieldType = 'C' | 'N' | 'L';

interface DbfField {
  key: string;
  name: string;
  type: DbfFieldType;
  length: number;
  decimals: number;
}

const TEXT_ENCODER = new TextEncoder();

/** Encode `text` to UTF-8, truncated to at most `maxBytes` without splitting a
 * multi-byte code point (so non-ASCII attribute values stay valid). */
function encodeUtf8Truncated(text: string, maxBytes: number): Uint8Array {
  const full = TEXT_ENCODER.encode(text);
  if (full.length <= maxBytes) return full;
  let length = 0;
  for (const char of text) {
    const size = TEXT_ENCODER.encode(char).length;
    if (length + size > maxBytes) break;
    length += size;
  }
  return full.subarray(0, length);
}

function dbfFieldName(key: string, taken: Set<string>): string {
  // DBF field names are at most 10 characters; truncate and de-duplicate.
  const base = key.replace(/[^0-9A-Za-z_]/g, '_').slice(0, 10) || 'field';
  if (!taken.has(base.toUpperCase())) {
    taken.add(base.toUpperCase());
    return base;
  }
  for (let i = 1; i < 1000; i += 1) {
    const suffix = String(i);
    const candidate = `${base.slice(0, 10 - suffix.length)}${suffix}`;
    if (!taken.has(candidate.toUpperCase())) {
      taken.add(candidate.toUpperCase());
      return candidate;
    }
  }
  // Falling through means >999 fields share one 10-char prefix; returning a
  // name already in `taken` would write a duplicate DBF column. Fail loudly
  // instead of silently corrupting the file.
  throw new Error(`Cannot generate a unique DBF field name for "${key}" (>999 collisions).`);
}

function decimalPlaces(value: number): number {
  if (Number.isInteger(value)) return 0;
  const text = String(value);
  const dot = text.indexOf('.');
  if (dot < 0) return 0;
  return Math.min(15, text.length - dot - 1);
}

function planField(key: string, name: string, values: unknown[]): DbfField {
  let sawNumber = false;
  let sawNonNumber = false;
  let sawBoolean = false;
  let sawNonBoolean = false;
  for (const value of values) {
    if (value == null) continue;
    if (typeof value === 'boolean') {
      sawBoolean = true;
    } else {
      sawNonBoolean = true;
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
      sawNumber = true;
    } else {
      sawNonNumber = true;
    }
  }

  if (sawBoolean && !sawNonBoolean) {
    return {key, name, type: 'L', length: 1, decimals: 0};
  }

  if (sawNumber && !sawNonNumber) {
    let decimals = 0;
    for (const value of values) {
      if (typeof value === 'number' && Number.isFinite(value)) {
        decimals = Math.max(decimals, decimalPlaces(value));
      }
    }
    let length = 1;
    for (const value of values) {
      if (typeof value !== 'number' || !Number.isFinite(value)) continue;
      const text = decimals > 0 ? value.toFixed(decimals) : String(value);
      length = Math.max(length, text.length);
    }
    return {key, name, type: 'N', length: Math.min(length, 33), decimals};
  }

  // Fall back to text for everything else (strings, mixed types, objects).
  let length = 1;
  for (const value of values) {
    if (value == null) continue;
    const text = typeof value === 'object' ? JSON.stringify(value) : String(value);
    length = Math.max(length, TEXT_ENCODER.encode(text).length);
  }
  return {key, name, type: 'C', length: Math.min(length, 254), decimals: 0};
}

function encodeDbfValue(value: unknown, field: DbfField): Uint8Array {
  const cell = new Uint8Array(field.length).fill(0x20); // space-padded
  if (value == null) return cell;

  if (field.type === 'L') {
    cell[0] = value ? 0x54 : 0x46; // 'T' / 'F'
    return cell;
  }

  if (field.type === 'N') {
    if (typeof value !== 'number' || !Number.isFinite(value)) return cell;
    let text = field.decimals > 0 ? value.toFixed(field.decimals) : String(value);
    if (text.length > field.length) text = text.slice(0, field.length);
    // Numbers are right-justified in DBF.
    const bytes = TEXT_ENCODER.encode(text);
    cell.set(bytes, field.length - bytes.length);
    return cell;
  }

  // Text: left-justified, truncated to the field byte length on a code-point
  // boundary so multi-byte characters are never cut mid-sequence.
  const text = typeof value === 'object' ? JSON.stringify(value) : String(value);
  cell.set(encodeUtf8Truncated(text, field.length), 0);
  return cell;
}

function buildDbf(features: Feature[], fields: DbfField[]): Uint8Array {
  const recordLength = 1 + fields.reduce((total, field) => total + field.length, 0);
  const headerLength = 32 + fields.length * 32 + 1;
  // Both are serialized as uint16; too many or too-wide attributes would
  // overflow and silently corrupt the .dbf, so fail fast instead.
  if (recordLength > 0xffff || headerLength > 0xffff) {
    throw new Error('Too many or too-wide attributes for the DBF format limits.');
  }
  const total = headerLength + features.length * recordLength + 1; // +1 EOF
  const buffer = new Uint8Array(total);
  const view = new DataView(buffer.buffer);

  buffer[0] = 0x03; // dBASE III without memo
  const now = new Date();
  buffer[1] = now.getFullYear() - 1900;
  buffer[2] = now.getMonth() + 1;
  buffer[3] = now.getDate();
  view.setUint32(4, features.length, true);
  view.setUint16(8, headerLength, true);
  view.setUint16(10, recordLength, true);

  let offset = 32;
  for (const field of fields) {
    const nameBytes = TEXT_ENCODER.encode(field.name).subarray(0, 11);
    buffer.set(nameBytes, offset); // remaining name bytes stay 0 (null-padded)
    buffer[offset + 11] = field.type.charCodeAt(0);
    buffer[offset + 16] = field.length;
    buffer[offset + 17] = field.decimals;
    offset += 32;
  }
  buffer[offset] = 0x0d; // field descriptor terminator
  offset += 1;

  for (const feature of features) {
    buffer[offset] = 0x20; // record not deleted
    offset += 1;
    for (const field of fields) {
      const cell = encodeDbfValue(feature.properties?.[field.key], field);
      buffer.set(cell, offset);
      offset += field.length;
    }
  }
  buffer[offset] = 0x1a; // end-of-file marker
  return buffer;
}

/**
 * Assemble the parts of an ESRI Shapefile from a FeatureCollection.
 *
 * Args:
 *   geojson: Features to write (assumed WGS84).
 *
 * Returns:
 *   The .shp/.shx/.dbf/.prj/.cpg byte buffers (the caller names and zips them).
 */
export function writeShapefile(geojson: FeatureCollection): ShapefileParts {
  const features = geojson.features ?? [];
  if (features.length === 0) {
    throw new Error('The layer has no features to export.');
  }
  const {type: shapeType, family} = fileShapeType(features);

  const fileBox = emptyBox();
  const contents = features.map(feature =>
    encodeShape(feature.geometry, shapeType, family, fileBox)
  );

  // .shp: 100-byte header + per-record (8-byte header + content).
  const shpSize = 100 + contents.reduce((total, content) => total + 8 + content.length, 0);
  const shp = new Uint8Array(shpSize);
  const shpView = new DataView(shp.buffer);
  const shxSize = 100 + contents.length * 8;
  const shx = new Uint8Array(shxSize);
  const shxView = new DataView(shx.buffer);

  writeMainHeader(shp, shapeType, shpSize / 2, fileBox);
  writeMainHeader(shx, shapeType, shxSize / 2, fileBox);

  let shpOffset = 100;
  let shxOffset = 100;
  contents.forEach((content, index) => {
    const contentWords = content.length / 2;
    const recordOffsetWords = shpOffset / 2;
    // Record header (big-endian): 1-based record number + content length.
    shpView.setInt32(shpOffset, index + 1, false);
    shpView.setInt32(shpOffset + 4, contentWords, false);
    shp.set(content, shpOffset + 8);
    shpOffset += 8 + content.length;
    // .shx entry (big-endian): record offset + content length, both in words.
    shxView.setInt32(shxOffset, recordOffsetWords, false);
    shxView.setInt32(shxOffset + 4, contentWords, false);
    shxOffset += 8;
  });

  // DBF fields from the union of property keys across all features.
  const keys: string[] = [];
  const seen = new Set<string>();
  for (const feature of features) {
    for (const key of Object.keys(feature.properties ?? {})) {
      if (!seen.has(key)) {
        seen.add(key);
        keys.push(key);
      }
    }
  }
  const takenNames = new Set<string>();
  const fields = keys.map(key =>
    planField(
      key,
      dbfFieldName(key, takenNames),
      features.map(feature => feature.properties?.[key])
    )
  );
  const dbf = buildDbf(features, fields);

  return {
    shp,
    shx,
    dbf,
    prj: TEXT_ENCODER.encode(WGS84_PRJ),
    cpg: TEXT_ENCODER.encode('UTF-8')
  };
}
