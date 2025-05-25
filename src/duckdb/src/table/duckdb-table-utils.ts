// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// loaders.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

// Copied from loaders.gl/geoarrow

// TODO: Remove isGeoArrow* once Kepler.gl is upgraded to loaders.gl 4.4+

import * as arrow from 'apache-arrow';
import {DataType} from 'apache-arrow/type';
import {DuckDBDataProtocol} from '@duckdb/duckdb-wasm';

import {GEOARROW_EXTENSIONS, GEOARROW_METADATA_KEY} from '@kepler.gl/constants';
import {ProtoDatasetField} from '@kepler.gl/types';
import {DatabaseConnection, getApplicationConfig} from '@kepler.gl/utils';

export const SUPPORTED_DUCKDB_DROP_EXTENSIONS = ['arrow', 'csv', 'geojson', 'json', 'parquet'];

export type DuckDBColumnDesc = {name: string; type: string};

/**
 * Queries a DuckDB table for the schema description.
 * @param connection An active DuckDB connection.
 * @param tableName A name of DuckDB table to query.
 * @returns An array of column names and DuckDB types.
 */
export async function getDuckDBColumnTypes(
  connection: DatabaseConnection,
  tableName: string
): Promise<DuckDBColumnDesc[]> {
  const resDescribe = await connection.query(`DESCRIBE "${tableName}"`);

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
 * converting specified columns to Well-Known Binary (WKB) format using ST_AsWKB,
 * and casting BIGINT columns to DOUBLE if specified.
 * @param tableName The name of the table from which to select data.
 * @param columns An array of column descriptors, each with a type and name.
 * @param options Optional parameters to control the conversion behavior.
 * @returns The constructed SQL query.
 */
export function castDuckDBTypesForKepler(
  tableName: string,
  columns: DuckDBColumnDesc[],
  options = {geometryToWKB: true, bigIntToDouble: true}
): string {
  const modifiedColumns = columns.map(column => {
    const {name, type} = column;
    if (type === 'GEOMETRY' && options.geometryToWKB) {
      return `ST_AsWKB(${name}) as ${name}`;
    } else if (type === 'BIGINT' && options.bigIntToDouble) {
      return `CAST(${name} AS DOUBLE) as ${name}`;
    }
    return name;
  });

  return `SELECT ${modifiedColumns.join(', ')} FROM '${tableName}'`;
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

/**
 * Creates an arrow table from an array of arrow vectors and fields.
 * @param columns An array of arrow vectors.
 * @param fields An array of fields per arrow vector.
 * @param arrowSchema Optional arrow table schema when available.
 * @returns An arrow table.
 */
export const restoreArrowTable = (
  columns: arrow.Vector[],
  fields: ProtoDatasetField[],
  arrowSchema?: arrow.Schema
) => {
  const creaOpts = {};
  fields.map((field, index) => {
    creaOpts[field.name] = columns[index];
  });

  return arrowSchema ? new arrow.Table(arrowSchema, creaOpts) : new arrow.Table(creaOpts);
};

/**
 * DuckDb throws when geoarrow extensions are present in metadata.
 * @param table An arrow table to clear from extensions.
 * @returns A map of removed per field geoarrow extensions.
 */
export const removeUnsupportedExtensions = (table: arrow.Table): Record<string, string> => {
  const removedMetadata: Record<string, string> = {};
  table.schema.fields.forEach(field => {
    const extension = field.metadata.get(GEOARROW_METADATA_KEY);
    if (extension?.startsWith('geoarrow')) {
      removedMetadata[field.name] = extension;
      field.metadata.delete(GEOARROW_METADATA_KEY);
    }
  });
  return removedMetadata;
};

/**
 * Restore removed metadata extensions after a call to removeUnsupportedExtensions.
 * @param table An arrow table to restore geoarrow extensions.
 * @param removedExtensions A map of per field geoarrow extensions to restore.
 */
export const restoreUnsupportedExtensions = (
  table: arrow.Table,
  removedExtensions: Record<string, string>
) => {
  table.schema.fields.forEach(field => {
    const extension = removedExtensions[field.name];
    if (extension) {
      field.metadata.set(GEOARROW_METADATA_KEY, extension);
    }
  });
};

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

/**
 * Checks if the given SQL query is a SELECT query by using the EXPLAIN command.
 * @param connection The DuckDB connection instance.
 * @param query The SQL query to check.
 * @returns Resolves to `true` if the query is a SELECT statement, otherwise `false`.
 */
export async function checkIsSelectQuery(
  connection: DatabaseConnection,
  query: string
): Promise<boolean> {
  try {
    const result = await connection.query(`EXPLAIN (${query})`);
    return result.numRows > 0;
  } catch (error) {
    return false;
  }
}

/**
 * Split a string with potentially multiple SQL queries (separated as usual by ';') into an array of queries.
 * This implementation:
 *  - Handles single and double quoted strings with proper escaping
 *  - Ignores semicolons in line comments (--) and block comments (slash asterisk)
 *  - Trims whitespace from queries
 *  - Handles SQL-style escaped quotes ('' inside strings)
 *  - Returns only non-empty queries
 * @param input A string with potentially multiple SQL queries.
 * @returns An array of queries.
 */
export function splitSqlStatements(input: string): string[] {
  const queries: string[] = [];
  let currentQuery = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (inLineComment) {
      currentQuery += char;
      if (char === '\n') {
        inLineComment = false;
      }
      continue;
    }

    if (inBlockComment) {
      currentQuery += char;
      if (char === '*' && input[i + 1] === '/') {
        inBlockComment = false;
        currentQuery += input[++i]; // Consume '/'
      }
      continue;
    }

    if (inSingleQuote) {
      currentQuery += char;
      if (char === "'") {
        // Handle escaped single quotes in SQL
        if (i + 1 < input.length && input[i + 1] === "'") {
          currentQuery += input[++i];
        } else {
          inSingleQuote = false;
        }
      }
      continue;
    }

    if (inDoubleQuote) {
      currentQuery += char;
      if (char === '"') {
        // Handle escaped double quotes
        if (i + 1 < input.length && input[i + 1] === '"') {
          currentQuery += input[++i];
        } else {
          inDoubleQuote = false;
        }
      }
      continue;
    }

    // Check for comment starts
    if (char === '-' && input[i + 1] === '-') {
      inLineComment = true;
      currentQuery += char + input[++i];
      continue;
    }

    if (char === '/' && input[i + 1] === '*') {
      inBlockComment = true;
      currentQuery += char + input[++i];
      continue;
    }

    // Check for quote starts
    if (char === "'") {
      inSingleQuote = true;
      currentQuery += char;
      continue;
    }

    if (char === '"') {
      inDoubleQuote = true;
      currentQuery += char;
      continue;
    }

    // Handle query separator
    if (char === ';') {
      const trimmed = currentQuery.trim();
      if (trimmed.length > 0) {
        queries.push(trimmed);
      }
      currentQuery = '';
      continue;
    }

    currentQuery += char;
  }

  // Add the final query
  const trimmed = currentQuery.trim();
  if (trimmed.length > 0) {
    queries.push(trimmed);
  }

  return queries;
}

/**
 * Removes SQL comments from a given SQL string.
 * @param sql The SQL query string from which comments should be removed.
 * @returns The cleaned SQL string without comments.
 */
export function removeSQLComments(sql: string): string {
  // Remove multi-line comments (/* ... */)
  sql = sql.replace(/\/\*[\s\S]*?\*\//g, '');
  // Remove single-line comments (-- ...)
  sql = sql.replace(/--.*$/gm, '');
  return sql.trim();
}

/**
 * Drops a table if it exists in the DuckDB database.
 * @param connection The DuckDB connection instance.
 * @param tableName The name of the table to drop.
 * @returns A promise that resolves when the operation is complete.
 * @throws Logs an error if the table drop operation fails.
 */
export const dropTableIfExists = async (connection: DatabaseConnection, tableName: string) => {
  try {
    await connection.query(`DROP TABLE IF EXISTS "${tableName}";`);
  } catch (error) {
    console.error('Dropping table failed', tableName, error);
  }
};

/**
 * Imports a file into DuckDB as a table, supporting multiple formats from SUPPORTED_DUCKDB_DROP_EXTENSIONS.
 * @param file The file to be imported.
 * @returns A promise that resolves when the file has been processed into a DuckDB table.
 */
export async function tableFromFile(file: File | null): Promise<null | Error> {
  if (!file) return new Error('File Drag & Drop: No file');

  const fileExt = SUPPORTED_DUCKDB_DROP_EXTENSIONS.find(ext => file.name.endsWith(ext));
  if (!fileExt) {
    return new Error("File Drag & Drop: File extension isn't supported");
  }

  const db = await getApplicationConfig().database;
  if (!db) {
    return new Error('The database is not configured properly.');
  }
  const c = await db.connect();

  let error: Error | null = null;

  try {
    const tableName = sanitizeDuckDBTableName(file.name);
    const sourceName = 'temp_file_handle';

    c.query(`install spatial;
      load spatial;`);

    if (fileExt === 'arrow') {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const arrowTable = arrow.tableFromIPC(uint8Array);

      await c.insertArrowTable(arrowTable, {name: tableName});
    } else {
      await db.registerFileHandle(sourceName, file, DuckDBDataProtocol.BROWSER_FILEREADER, true);

      if (fileExt === 'csv') {
        await c.query(`
            CREATE TABLE '${tableName}' AS
            SELECT *
            FROM read_csv('${sourceName}', header = true, auto_detect = true, sample_size = -1);
          `);
      } else if (fileExt === 'json') {
        await c.query(`
            CREATE TABLE '${tableName}' AS
            SELECT *
            FROM read_json_auto('${sourceName}');
          `);
      } else if (fileExt === 'geojson') {
        await c.query(`
            CREATE TABLE '${tableName}' AS
            SELECT *
            FROM ST_READ('${sourceName}', keep_wkb = TRUE);
          `);
      } else if (fileExt === 'parquet') {
        await c.query(`
            CREATE TABLE '${tableName}' AS
            SELECT *
            FROM read_parquet('${sourceName}')
          `);
      }
    }
  } catch (errorData) {
    if (errorData instanceof Error) {
      const message = errorData.message || '';
      // output more readable errors for known issues
      if (message.includes('Arrow Type with extension name: geoarrow')) {
        error = new Error(
          'The GeoArrow extensions are not implemented in the connected DuckDB version.'
        );
      } else if (message.includes("Geoparquet column 'geometry' does not have geometry types")) {
        error = new Error(
          `Invalid Input Error: Geoparquet column 'geometry' does not have geometry types.
Possible reasons:
  - Old .parquet files that don't match the Parquet format specification.
  - Unsupported compression.`
        );
      }
    }

    if (!error) {
      error = errorData as Error;
    }
  }

  await c.close();

  return error;
}

/**
 * Sanitizes a file name to be a valid DuckDB table name.
 * @param fileName The input file name to be sanitized.
 * @returns A valid DuckDB table name.
 */
export function sanitizeDuckDBTableName(fileName: string): string {
  // Replace invalid characters with underscores
  let name = fileName.replace(/[^a-zA-Z0-9_]/g, '_');
  // Ensure it doesn't start with a digit
  if (/^\d/.test(name)) {
    name = `t_${name}`;
  }
  return name || 'default_table';
}
