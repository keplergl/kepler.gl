// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project
// Adapted from GeoLibre (https://github.com/opengeos/GeoLibre), MIT License.

import {convertGeometryToWKB} from '@loaders.gl/gis';
import type {FeatureCollection, Geometry, Position} from 'geojson';
import type {Database, SqlJsStatic} from 'sql.js';

import {loadSqlJs} from './sql-js';

/**
 * Write a GeoJSON FeatureCollection to an OGC GeoPackage (a single SQLite
 * database) entirely in the browser via sql.js.
 *
 * DuckDB-WASM cannot write the SQLite-backed GeoPackage format (its virtual
 * filesystem lacks the random-access seek/write the driver needs) and Pyodide's
 * bundled GDAL has no working GeoPackage write driver, so the file is assembled
 * directly here. Output carries one feature layer in WGS84 (EPSG:4326) with the
 * required `gpkg_*` metadata tables plus `gpkg_ogr_contents`, so it reopens in
 * GeoLibre, QGIS, and ArcGIS.
 */

// SQLite "application_id" for a GeoPackage: ASCII "GPKG" as a big-endian int32.
const GPKG_APPLICATION_ID = 0x47504b47;
// SQLite "user_version" for GeoPackage 1.3 (10300), per the spec's versioning.
const GPKG_USER_VERSION = 10300;
const SRS_ID = 4326;
const GEOMETRY_COLUMN = 'geom';
const FID_COLUMN = 'fid';

const WGS84_DEFINITION =
  'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,' +
  'AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],' +
  'PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],' +
  'UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],' +
  'AUTHORITY["EPSG","4326"]]';

type ColumnType = 'INTEGER' | 'REAL' | 'TEXT';

interface ColumnSpec {
  name: string;
  type: ColumnType;
}

interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

function emptyBoundingBox(): BoundingBox {
  return {minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity};
}

function extendBoundingBox(box: BoundingBox, geometry: Geometry): void {
  const visit = (position: Position) => {
    const x = Number(position[0]);
    const y = Number(position[1]);
    if (Number.isFinite(x)) {
      box.minX = Math.min(box.minX, x);
      box.maxX = Math.max(box.maxX, x);
    }
    if (Number.isFinite(y)) {
      box.minY = Math.min(box.minY, y);
      box.maxY = Math.max(box.maxY, y);
    }
  };
  const walk = (geom: Geometry) => {
    switch (geom.type) {
      case 'Point':
        visit(geom.coordinates);
        break;
      case 'LineString':
      case 'MultiPoint':
        geom.coordinates.forEach(visit);
        break;
      case 'Polygon':
      case 'MultiLineString':
        geom.coordinates.forEach(part => part.forEach(visit));
        break;
      case 'MultiPolygon':
        geom.coordinates.forEach(polygon => polygon.forEach(ring => ring.forEach(visit)));
        break;
      case 'GeometryCollection':
        geom.geometries.forEach(walk);
        break;
      default:
        break;
    }
  };
  walk(geometry);
}

function quoteIdentifier(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

/** Strip characters a SQLite identifier should not carry and avoid collisions
 * with the reserved fid/geom columns. */
function sanitizeColumnName(name: string, taken: Set<string>): string {
  let cleaned = name.replace(/[^\p{L}\p{N}_]+/gu, '_').replace(/^_+/, '');
  if (!cleaned) cleaned = 'field';
  if (cleaned.toLowerCase() === FID_COLUMN || cleaned.toLowerCase() === GEOMETRY_COLUMN) {
    cleaned = `${cleaned}_`;
  }
  let candidate = cleaned;
  let index = 1;
  while (taken.has(candidate.toLowerCase())) {
    candidate = `${cleaned}_${index}`;
    index += 1;
  }
  taken.add(candidate.toLowerCase());
  return candidate;
}

/** Infer a SQLite column type from a property's values across all features. */
function inferColumnType(values: unknown[]): ColumnType {
  let sawNumber = false;
  let allInteger = true;
  for (const value of values) {
    if (value == null) continue;
    if (typeof value === 'number' && Number.isFinite(value)) {
      sawNumber = true;
      if (!Number.isInteger(value)) allInteger = false;
    } else if (typeof value === 'boolean') {
      sawNumber = true; // store booleans as 0/1 integers
    } else {
      return 'TEXT';
    }
  }
  if (!sawNumber) return 'TEXT';
  return allInteger ? 'INTEGER' : 'REAL';
}

/** Coerce a property value to what a SQLite bind expects for `type`. */
function coerceValue(value: unknown, type: ColumnType): number | string | null {
  if (value == null) return null;
  if (type === 'TEXT') {
    return typeof value === 'object' ? JSON.stringify(value) : String(value);
  }
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  return null;
}

/**
 * Build the GeoPackage geometry blob: the "GP" header (version, flags, srs_id)
 * followed by the standard WKB. Flags `0x01` mean little-endian header fields
 * and no envelope. Returns null for a null/empty geometry so the row's geom
 * column is SQL NULL.
 */
function geoPackageBlob(geometry: Geometry | null): Uint8Array | null {
  if (!geometry) return null;
  const wkb = new Uint8Array(convertGeometryToWKB(geometry));
  const header = new Uint8Array(8);
  const view = new DataView(header.buffer);
  header[0] = 0x47; // 'G'
  header[1] = 0x50; // 'P'
  header[2] = 0x00; // version 0
  header[3] = 0x01; // flags: little-endian, no envelope, standard, non-empty
  view.setInt32(4, SRS_ID, true);
  const blob = new Uint8Array(header.length + wkb.length);
  blob.set(header, 0);
  blob.set(wkb, header.length);
  return blob;
}

function geometryTypeName(types: Set<string>): string {
  if (types.size === 1) {
    return [...types][0].toUpperCase();
  }
  return 'GEOMETRY';
}

function createMetadataTables(db: Database): void {
  db.run(`PRAGMA application_id = ${GPKG_APPLICATION_ID};`);
  db.run(`PRAGMA user_version = ${GPKG_USER_VERSION};`);
  db.run(
    `CREATE TABLE gpkg_spatial_ref_sys (
      srs_name TEXT NOT NULL,
      srs_id INTEGER NOT NULL PRIMARY KEY,
      organization TEXT NOT NULL,
      organization_coordsys_id INTEGER NOT NULL,
      definition TEXT NOT NULL,
      description TEXT
    );`
  );
  const srs = db.prepare(`INSERT INTO gpkg_spatial_ref_sys VALUES (?, ?, ?, ?, ?, ?);`);
  try {
    srs.run(['Undefined cartesian SRS', -1, 'NONE', -1, 'undefined', null]);
    srs.run(['Undefined geographic SRS', 0, 'NONE', 0, 'undefined', null]);
    srs.run(['WGS 84 geodetic', SRS_ID, 'EPSG', SRS_ID, WGS84_DEFINITION, null]);
  } finally {
    srs.free();
  }

  db.run(
    `CREATE TABLE gpkg_contents (
      table_name TEXT NOT NULL PRIMARY KEY,
      data_type TEXT NOT NULL,
      identifier TEXT UNIQUE,
      description TEXT DEFAULT '',
      last_change DATETIME NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      min_x DOUBLE,
      min_y DOUBLE,
      max_x DOUBLE,
      max_y DOUBLE,
      srs_id INTEGER,
      CONSTRAINT fk_gc_r_srs_id FOREIGN KEY (srs_id)
        REFERENCES gpkg_spatial_ref_sys(srs_id)
    );`
  );
  db.run(
    `CREATE TABLE gpkg_geometry_columns (
      table_name TEXT NOT NULL,
      column_name TEXT NOT NULL,
      geometry_type_name TEXT NOT NULL,
      srs_id INTEGER NOT NULL,
      z TINYINT NOT NULL,
      m TINYINT NOT NULL,
      CONSTRAINT pk_geom_cols PRIMARY KEY (table_name, column_name),
      CONSTRAINT uk_gc_table_name UNIQUE (table_name),
      CONSTRAINT fk_gc_tn FOREIGN KEY (table_name)
        REFERENCES gpkg_contents(table_name),
      CONSTRAINT fk_gc_srs FOREIGN KEY (srs_id)
        REFERENCES gpkg_spatial_ref_sys(srs_id)
    );`
  );
  db.run(
    `CREATE TABLE gpkg_ogr_contents (
      table_name TEXT NOT NULL PRIMARY KEY,
      feature_count INTEGER DEFAULT NULL
    );`
  );
}

/**
 * Synchronous core of {@link writeGeoPackage}, separated so it can be unit-tested
 * with an already-initialised sql.js factory (the async wrapper resolves the
 * factory through a Vite `?url` import that only works in the browser).
 *
 * Args:
 *   SQL: An initialised sql.js factory.
 *   geojson: Features to write (assumed WGS84).
 *   layerName: Name of the single feature table / layer in the GeoPackage.
 *
 * Returns:
 *   The GeoPackage file as bytes.
 */
export function writeGeoPackageSync(
  SQL: SqlJsStatic,
  geojson: FeatureCollection,
  layerName: string
): Uint8Array {
  const features = geojson.features ?? [];
  if (features.length === 0) {
    throw new Error('The layer has no features to export.');
  }

  const tableName = sanitizeColumnName(layerName, new Set());

  // Collect the union of property keys (features may carry different keys).
  const propertyKeys: string[] = [];
  const seenKeys = new Set<string>();
  for (const feature of features) {
    for (const key of Object.keys(feature.properties ?? {})) {
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        propertyKeys.push(key);
      }
    }
  }

  const takenColumns = new Set<string>([FID_COLUMN, GEOMETRY_COLUMN]);
  const columns: (ColumnSpec & {key: string})[] = propertyKeys.map(key => ({
    key,
    name: sanitizeColumnName(key, takenColumns),
    type: inferColumnType(features.map(f => f.properties?.[key]))
  }));

  const box: BoundingBox = emptyBoundingBox();
  const geometryTypes = new Set<string>();
  for (const feature of features) {
    if (feature.geometry) {
      geometryTypes.add(feature.geometry.type);
      extendBoundingBox(box, feature.geometry);
    }
  }

  const db = new SQL.Database();
  try {
    createMetadataTables(db);

    const columnDefs = columns
      .map(column => `${quoteIdentifier(column.name)} ${column.type}`)
      .join(', ');
    db.run(
      `CREATE TABLE ${quoteIdentifier(tableName)} (
        ${quoteIdentifier(FID_COLUMN)} INTEGER PRIMARY KEY AUTOINCREMENT,
        ${quoteIdentifier(GEOMETRY_COLUMN)} BLOB${columnDefs ? `, ${columnDefs}` : ''}
      );`
    );

    const insertColumns = [GEOMETRY_COLUMN, ...columns.map(column => column.name)];
    const placeholders = insertColumns.map(() => '?').join(', ');
    const insert = db.prepare(
      `INSERT INTO ${quoteIdentifier(tableName)} (${insertColumns
        .map(quoteIdentifier)
        .join(', ')}) VALUES (${placeholders});`
    );
    try {
      db.run('BEGIN;');
      for (const feature of features) {
        const row: (number | string | Uint8Array | null)[] = [geoPackageBlob(feature.geometry)];
        for (const column of columns) {
          row.push(coerceValue(feature.properties?.[column.key], column.type));
        }
        insert.run(row);
      }
      db.run('COMMIT;');
    } finally {
      insert.free();
    }

    const finiteBox = Number.isFinite(box.minX) && Number.isFinite(box.minY);
    const contents = db.prepare(
      `INSERT INTO gpkg_contents
        (table_name, data_type, identifier, description, min_x, min_y, max_x, max_y, srs_id)
       VALUES (?, 'features', ?, '', ?, ?, ?, ?, ?);`
    );
    try {
      contents.run([
        tableName,
        tableName,
        finiteBox ? box.minX : null,
        finiteBox ? box.minY : null,
        finiteBox ? box.maxX : null,
        finiteBox ? box.maxY : null,
        SRS_ID
      ]);
    } finally {
      contents.free();
    }

    db.run(`INSERT INTO gpkg_geometry_columns VALUES (?, ?, ?, ?, 0, 0);`, [
      tableName,
      GEOMETRY_COLUMN,
      geometryTypeName(geometryTypes),
      SRS_ID
    ]);
    db.run(`INSERT INTO gpkg_ogr_contents (table_name, feature_count) VALUES (?, ?);`, [
      tableName,
      features.length
    ]);

    // sql.js always exports an ArrayBuffer-backed Uint8Array.
    return db.export();
  } finally {
    db.close();
  }
}

/**
 * Write a GeoJSON FeatureCollection to a GeoPackage (loads sql.js, then defers
 * to {@link writeGeoPackageSync}).
 *
 * Args:
 *   geojson: Features to write (assumed WGS84).
 *   layerName: Name of the single feature table / layer in the GeoPackage.
 *
 * Returns:
 *   The GeoPackage file as bytes.
 */
export async function writeGeoPackage(
  geojson: FeatureCollection,
  layerName: string
): Promise<Uint8Array> {
  const SQL = await loadSqlJs();
  return writeGeoPackageSync(SQL, geojson, layerName);
}
