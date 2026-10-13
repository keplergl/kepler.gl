// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {convertGeometryToWKB} from '@loaders.gl/gis';
import * as arrow from 'apache-arrow';
import type {FeatureCollection, Geometry} from 'geojson';

const GEOPARQUET_GEOMETRY_TYPES = new Set([
  'Point',
  'LineString',
  'Polygon',
  'MultiPoint',
  'MultiLineString',
  'MultiPolygon',
  'GeometryCollection'
]);

type ParquetWasm = typeof import('parquet-wasm');

/** Keep in sync with the parquet-wasm dependency in package.json. */
const PARQUET_WASM_URL = 'https://unpkg.com/parquet-wasm@0.6.1/esm/parquet_wasm_bg.wasm';

let parquetWasmPromise: Promise<ParquetWasm> | null = null;

async function importParquetWasm(): Promise<ParquetWasm> {
  // Jest uses the CommonJS build, which reads the wasm from disk. A literal
  // import of that build makes esbuild pull in Node's fs/path. The browser
  // bundle only keeps the ESM build below, because NODE_ENV is not "test".
  if (process.env.NODE_ENV === 'test') {
    const specifier = 'parquet-wasm/node';
    const imported = (await import(specifier)) as ParquetWasm;
    return (imported.Table ? imported : imported.default) as ParquetWasm;
  }
  const imported = await import('parquet-wasm');
  if (typeof imported.default === 'function') {
    await imported.default(PARQUET_WASM_URL);
  }
  return (imported.Table ? imported : imported.default) as ParquetWasm;
}

function loadParquetWasm(): Promise<ParquetWasm> {
  if (parquetWasmPromise) {
    return parquetWasmPromise;
  }
  const pending = importParquetWasm().catch(error => {
    parquetWasmPromise = null;
    throw error;
  });
  parquetWasmPromise = pending;
  return pending;
}

function wkbBytes(geometry: Geometry | null): Uint8Array | null {
  if (!geometry) {
    return null;
  }
  return new Uint8Array(convertGeometryToWKB(geometry));
}

function propertyVector(values: (string | number | boolean | null)[]): arrow.Vector {
  // tableFromArrays stores JS strings as Dictionary<Int32, Utf8>. Parquet import
  // rejects that type with "arrow type not supported: Dictionary".
  let kind: 'bool' | 'float' | 'string' = 'string';
  let seen = false;
  for (const value of values) {
    if (value == null) {
      continue;
    }
    let next: 'bool' | 'float' | 'string' = 'string';
    if (typeof value === 'boolean') {
      next = 'bool';
    } else if (typeof value === 'number') {
      next = 'float';
    }
    if (!seen) {
      kind = next;
      seen = true;
    } else if (kind !== next) {
      kind = 'string';
      break;
    }
  }
  if (kind === 'bool') {
    return arrow.vectorFromArray(values as (boolean | null)[], new arrow.Bool());
  }
  if (kind === 'float') {
    return arrow.vectorFromArray(values as (number | null)[], new arrow.Float64());
  }
  return arrow.vectorFromArray(
    values.map(value => (value == null ? null : String(value))),
    new arrow.Utf8()
  );
}

function parquetValue(value: unknown): string | number | boolean | null {
  if (value == null) {
    return null;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'boolean' || typeof value === 'string') {
    return value;
  }
  return JSON.stringify(value);
}

function propertyName(name: string, taken: Set<string>): string {
  let candidate = name === 'geometry' ? 'geometry_attr' : name;
  if (!candidate) {
    candidate = 'field';
  }
  let unique = candidate;
  let index = 1;
  while (taken.has(unique)) {
    unique = `${candidate}_${index}`;
    index += 1;
  }
  taken.add(unique);
  return unique;
}

/**
 * Write a GeoJSON FeatureCollection as GeoParquet 1.1 (WKB geometry, WGS84).
 */
export async function writeGeoParquet(geojson: FeatureCollection): Promise<Uint8Array> {
  const features = geojson.features ?? [];
  const taken = new Set<string>(['geometry']);
  const propertyKeys: {source: string; name: string}[] = [];
  const seen = new Set<string>();
  for (const feature of features) {
    for (const key of Object.keys(feature.properties ?? {})) {
      if (!seen.has(key)) {
        seen.add(key);
        propertyKeys.push({source: key, name: propertyName(key, taken)});
      }
    }
  }

  const columns: Record<string, arrow.Vector> = {
    geometry: arrow.vectorFromArray(
      features.map(feature => wkbBytes(feature.geometry)),
      new arrow.Binary()
    )
  };
  for (const key of propertyKeys) {
    columns[key.name] = propertyVector(
      features.map(feature => parquetValue(feature.properties?.[key.source]))
    );
  }

  const table = new arrow.Table(columns);
  const ipc = arrow.tableToIPC(table, 'stream');
  const parquetWasm = await loadParquetWasm();
  const wasmTable = parquetWasm.Table.fromIPCStream(ipc);
  const geometryTypes: string[] = [];
  for (const feature of features) {
    const type = feature.geometry?.type;
    if (type && GEOPARQUET_GEOMETRY_TYPES.has(type) && !geometryTypes.includes(type)) {
      geometryTypes.push(type);
    }
  }
  const geoMetadata = JSON.stringify({
    version: '1.1.0',
    primary_column: 'geometry',
    columns: {
      geometry: {
        encoding: 'WKB',
        ...(geometryTypes.length ? {geometry_types: geometryTypes} : {})
      }
    }
  });
  const properties = new parquetWasm.WriterPropertiesBuilder()
    .setKeyValueMetadata(new Map([['geo', geoMetadata]]))
    .build();
  // writeParquet takes ownership of both objects.
  const bytes = parquetWasm.writeParquet(wasmTable, properties);
  return new Uint8Array(bytes);
}
