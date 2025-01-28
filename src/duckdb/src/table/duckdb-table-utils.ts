// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// loaders.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

// Copied from loaders.gl/geoarrow

// TODO: Remove once Kepler.gl is upgraded to loaders.gl 4.4+

import {DataType} from 'apache-arrow/type';
import {DuckDBDataProtocol} from '@duckdb/duckdb-wasm';

import {getDuckDB} from '../init';

export async function tableFromFile(file) {
  if (!file) return;

  const db = await getDuckDB();
  const c = await db.connect();

  try {
    await db.registerFileHandle(file.name, file, DuckDBDataProtocol.BROWSER_FILEREADER, true);

    const tableName = file.name;
    const sourceName = file.name;

    const fileExtensions = ['arrow', 'csv', 'geojson', 'json', 'parquet'];
    const fileExt = fileExtensions.find(ext => file.name.endsWith(ext));
    if (fileExt === 'csv') {
      const createTableSql = `
          CREATE TABLE '${tableName}' AS
          SELECT *
          FROM read_csv('${sourceName}', header = true, auto_detect = true, sample_size = -1);
        `;
      await c.query(createTableSql);
    } else if (fileExt === 'json') {
      const createTableSql = `
          CREATE TABLE '${tableName}' AS
          SELECT *
          FROM read_json_auto('${sourceName}');
        `;
      await c.query(createTableSql);
    } else if (fileExt === 'geojson') {
      const createTableSql = `
          install spatial;
          load spatial;
          CREATE TABLE '${tableName}' AS
          SELECT *
          FROM ST_READ('${sourceName}', keep_wkb = TRUE);
        `;
      await c.query(createTableSql);
    } else if (fileExt === 'parquet') {
      const createTableSql = `
          
          CREATE TABLE '${tableName}' AS
          SELECT *
          FROM read_parquet('${sourceName}')
        `;
      await c.query(createTableSql);
    } else if (fileExt === 'arrow') {
      // TODO - how to insert arrow file handle?
      /*
        const setupSql = `
          install spatial;
          load spatial;
        `;
        await c.query(setupSql);
        // ???
        await c.insertArrowTable(arrowTable, {name: this.label});
        */
    }

    // TODO - types like arrowSchemaToFields
  } catch (err) {}

  c.close();
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
