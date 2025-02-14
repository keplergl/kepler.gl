// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// loaders.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

// Copied from loaders.gl/geoarrow

// TODO: Remove isGeoArrow* once Kepler.gl is upgraded to loaders.gl 4.4+

import * as arrow from 'apache-arrow';
import {DataType} from 'apache-arrow/type';
import {AsyncDuckDBConnection} from '@duckdb/duckdb-wasm';

import {GEOARROW_EXTENSIONS, GEOARROW_METADATA_KEY} from '@kepler.gl/constants';

export type DuckDbColumnDesc = {name: string; type: string};

/**
 * Queries a table for description.
 * @param connection An active DuckDB connection.
 * @param tableName A name of DuckDB table to query.
 * @returns An array of column names and DuckDB types.
 */
export async function getDuckDBColumnTypes(
  connection: AsyncDuckDBConnection,
  tableName: string
): Promise<DuckDbColumnDesc[]> {
  const resDescribe = await connection.query(`DESCRIBE "${tableName}";`);

  const duckDbTypes: DuckDbColumnDesc[] = [];
  const numRows = resDescribe.numRows;
  for (let i = 0; i < numRows; ++i) {
    const columnName = resDescribe.getChildAt(0)?.get(i);
    const columnType = resDescribe.getChildAt(1)?.get(i);

    duckDbTypes.push({
      name: columnName,
      type: columnType
    });
  }

  return duckDbTypes;
}

export function getDuckDBColumnTypesMap(columns: DuckDbColumnDesc[]) {
  return columns.reduce((acc, value) => {
    acc[value.name] = value.type;
    return acc;
  }, {} as Record<string, string>);
}

export function constructST_asWKBQuery(tableName: string, columnsToConvertToWKB: string[]): string {
  // ST_AsWKB for GEOMETRY columns
  const exclude =
    columnsToConvertToWKB.length > 0 ? `EXCLUDE ${columnsToConvertToWKB.join(', ')}` : '';
  const asWKB =
    columnsToConvertToWKB.length > 0
      ? ', ' + columnsToConvertToWKB.map(column => `ST_AsWKB(${column}) as ${column}`).join(', ')
      : '';
  return `SELECT * ${exclude} ${asWKB} FROM '${tableName}';`;
}

export function getGeometryColumns(columns: DuckDbColumnDesc[]): string[] {
  const geometryColumns: string[] = [];
  columns.forEach(f => {
    if (f.type === 'GEOMETRY') {
      geometryColumns.push(f.name);
    }
  });
  return geometryColumns;
}

export function setGeoArrowWKBExtension(table: arrow.Table, columns: DuckDbColumnDesc[]) {
  table.schema.fields.forEach(field => {
    const info = columns.find(t => t.name === field.name);
    if (info?.type === 'GEOMETRY') {
      field.metadata.set(GEOARROW_METADATA_KEY, GEOARROW_EXTENSIONS.WKB);
    }
  });
}

/** Checks whether the given Apache Arrow JS type is a Point data type */
export function isGeoArrowPoint(type: DataType) {
  if (DataType.isFixedSizeList(type)) {
    // Check list size
    if (![2, 3, 4].includes(type.listSize)) {
      return false;
    }

    // Check child of FixedSizeList is floating type
    if (!DataType.isFloat(type.children[0])) {
      return false;
    }

    return true;
  }

  return false;
}

/** Checks whether the given Apache Arrow JS type is a Point data type */
export function isGeoArrowLineString(type: DataType) {
  // Check the outer type is a List
  if (!DataType.isList(type)) {
    return false;
  }

  // Check the child is a point type
  if (!isGeoArrowPoint(type.children[0].type)) {
    return false;
  }

  return true;
}

/** Checks whether the given Apache Arrow JS type is a Polygon data type */
export function isGeoArrowPolygon(type: DataType) {
  // Check the outer vector is a List
  if (!DataType.isList(type)) {
    return false;
  }

  // Check the child is a linestring vector
  if (!isGeoArrowLineString(type.children[0].type)) {
    return false;
  }

  return true;
}

/** Checks whether the given Apache Arrow JS type is a Polygon data type */
export function isGeoArrowMultiPoint(type: DataType) {
  // Check the outer vector is a List
  if (!DataType.isList(type)) {
    return false;
  }

  // Check the child is a point vector
  if (!isGeoArrowPoint(type.children[0].type)) {
    return false;
  }

  return true;
}

/** Checks whether the given Apache Arrow JS type is a Polygon data type */
export function isGeoArrowMultiLineString(type: DataType) {
  // Check the outer vector is a List
  if (!DataType.isList(type)) {
    return false;
  }

  // Check the child is a linestring vector
  if (!isGeoArrowLineString(type.children[0].type)) {
    return false;
  }

  return true;
}

/** Checks whether the given Apache Arrow JS type is a Polygon data type */
export function isGeoArrowMultiPolygon(type: DataType) {
  // Check the outer vector is a List
  if (!DataType.isList(type)) {
    return false;
  }

  // Check the child is a polygon vector
  if (!isGeoArrowPolygon(type.children[0].type)) {
    return false;
  }

  return true;
}
