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

export type DuckDBColumnDesc = {name: string; type: string};

/**
 * Queries a DuckDB table for the schema description.
 * @param connection An active DuckDB connection.
 * @param tableName A name of DuckDB table to query.
 * @returns An array of column names and DuckDB types.
 */
export async function getDuckDBColumnTypes(
  connection: AsyncDuckDBConnection,
  tableName: string
): Promise<DuckDBColumnDesc[]> {
  const resDescribe = await connection.query(`DESCRIBE "${tableName}";`);

  const duckDbTypes: DuckDBColumnDesc[] = [];
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

/**
 * Generates a mapping of column names to their corresponding DuckDB data types.
 * @param columns An array of column descriptions from DuckDB. Check getDuckDBColumnTypes.
 * @returns A record where keys are column names and values are their data types.
 */
export function getDuckDBColumnTypesMap(columns: DuckDBColumnDesc[]) {
  return columns.reduce((acc, value) => {
    acc[value.name] = value.type;
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Constructs an SQL query to select all columns from a given table,
 * converting specified columns to Well-Known Binary (WKB) format using ST_AsWKB.
 * @param tableName The name of the table from which to select data.
 * @param columnsToConvertToWKB An array of column names that should be converted to WKB format.
 * @returns The constructed SQL query.
 */
export function constructST_asWKBQuery(tableName: string, columnsToConvertToWKB: string[]): string {
  const exclude =
    columnsToConvertToWKB.length > 0 ? `EXCLUDE ${columnsToConvertToWKB.join(', ')}` : '';
  const asWKB =
    columnsToConvertToWKB.length > 0
      ? ', ' + columnsToConvertToWKB.map(column => `ST_AsWKB(${column}) as ${column}`).join(', ')
      : '';
  return `SELECT * ${exclude} ${asWKB} FROM '${tableName}';`;
}

/**
 * Finds the names of columns that have a GEOMETRY type.
 * @param columns An array of column descriptors from a DuckDB table.
 * @returns An array of column names that are of type GEOMETRY.
 */
export function getGeometryColumns(columns: DuckDBColumnDesc[]): string[] {
  return columns.filter(column => column.type === 'GEOMETRY').map(column => column.name);
}

/**
 * Sets the GeoArrow WKB extension metadata for columns of type GEOMETRY in an Arrow table.
 * @param table The Apache Arrow table whose schema fields will be modified.
 * @param columns An array of column descriptors from a DuckDB table.
 */
export function setGeoArrowWKBExtension(table: arrow.Table, columns: DuckDBColumnDesc[]) {
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
