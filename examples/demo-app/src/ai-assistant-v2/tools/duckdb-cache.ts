import {FeatureCollection} from 'geojson';
import {addDataToMap} from '@kepler.gl/actions';
import {processFileData} from '@kepler.gl/processors';
import {getConnector} from './utils';
import type {KeplerContext} from '../types';

let _cachedTableContext = '';

async function refreshTableContext(): Promise<void> {
  _cachedTableContext = await getDuckdbTableContext();
}

export function getDuckdbTableContextSync(): string {
  return _cachedTableContext;
}

/**
 * Save a GeoJSON FeatureCollection as a DuckDB table.
 * Each feature becomes a row with a `geometry` JSON string column plus all properties.
 */
export async function saveGeojsonToDuckdb(
  tableName: string,
  geojson: FeatureCollection
): Promise<void> {
  const db = await getConnector();
  await db.execute(`DROP TABLE IF EXISTS "${tableName}"`);

  const rows = geojson.features.map(feature => ({
    geometry: JSON.stringify(feature.geometry),
    ...(feature.properties ?? {})
  }));

  if (rows.length === 0) {
    await db.execute(`CREATE TABLE "${tableName}" (geometry VARCHAR)`);
  } else {
    await db.loadObjects(rows, tableName);
  }

  await refreshTableContext();
}

/**
 * Save row-oriented data (array of objects) as a DuckDB table.
 */
export async function saveRowsToDuckdb(
  tableName: string,
  rows: Record<string, unknown>[]
): Promise<void> {
  const db = await getConnector();
  await db.execute(`DROP TABLE IF EXISTS "${tableName}"`);

  if (rows.length > 0) {
    await db.loadObjects(rows, tableName);
  } else {
    await db.execute(`CREATE TABLE "${tableName}" (__empty BOOLEAN)`);
  }

  await refreshTableContext();
}

/**
 * Save column-oriented data as a DuckDB table.
 * Converts {col1: [...], col2: [...]} to row objects and stores as a table.
 */
export async function saveColumnsToDuckdb(
  tableName: string,
  columnData: Record<string, unknown[]>
): Promise<void> {
  const columnNames = Object.keys(columnData);
  if (columnNames.length === 0) return;

  const numRows = columnData[columnNames[0]].length;
  const rows: Record<string, unknown>[] = [];
  for (let i = 0; i < numRows; i++) {
    const row: Record<string, unknown> = {};
    for (const col of columnNames) {
      row[col] = columnData[col][i];
    }
    rows.push(row);
  }

  await saveRowsToDuckdb(tableName, rows);
}

/**
 * Unified save function. Accepts the legacy {type, content} format for backward
 * compatibility during migration, and dispatches to the correct storage method.
 */
export async function saveToDuckdb(
  tableName: string,
  entry: {type: string; content: any}
): Promise<void> {
  switch (entry.type) {
    case 'geojson':
      await saveGeojsonToDuckdb(tableName, entry.content as FeatureCollection);
      break;
    case 'columnData':
      await saveColumnsToDuckdb(tableName, entry.content as Record<string, unknown[]>);
      break;
    case 'rowObjects':
      await saveRowsToDuckdb(tableName, entry.content as Record<string, unknown>[]);
      break;
    default:
      throw new Error(`Unsupported entry type: ${entry.type}`);
  }
}

/**
 * Check whether a table exists in DuckDB.
 */
export async function tableExists(tableName: string): Promise<boolean> {
  const db = await getConnector();
  try {
    const result = await db.query(
      `SELECT 1 FROM information_schema.tables
       WHERE table_name = '${tableName.replace(/'/g, "''")}'
       LIMIT 1`
    );
    return result.toArray().length > 0;
  } catch {
    return false;
  }
}

/**
 * Drop a DuckDB table if it exists.
 */
export async function dropTable(tableName: string): Promise<void> {
  const db = await getConnector();
  await db.execute(`DROP TABLE IF EXISTS "${tableName}"`);
  await refreshTableContext();
}

// ---------------------------------------------------------------------------
// Introspection
// ---------------------------------------------------------------------------

export interface DuckdbTableInfo {
  name: string;
  columns: {name: string; type: string}[];
  rowCount: number;
}

/**
 * Return metadata for all user-created DuckDB tables (excludes internal
 * information_schema / system tables).
 */
export async function getDuckdbTableNames(): Promise<DuckdbTableInfo[]> {
  const db = await getConnector();

  const tablesResult = await db.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'main'
    ORDER BY table_name
  `);

  const tableNames: string[] = tablesResult.toArray().map((row: any) => {
    const json = typeof row.toJSON === 'function' ? row.toJSON() : row;
    return String(json.table_name);
  });

  const results: DuckdbTableInfo[] = [];

  for (const name of tableNames) {
    try {
      const info = await db.query(
        `SELECT column_name, data_type
         FROM information_schema.columns
         WHERE table_name = '${name.replace(/'/g, "''")}'
         ORDER BY ordinal_position`
      );
      const columns = info.toArray().map((r: any) => {
        const j = typeof r.toJSON === 'function' ? r.toJSON() : r;
        return {name: String(j.column_name), type: String(j.data_type)};
      });

      const countResult = await db.query(`SELECT count(*) AS cnt FROM "${name}"`);
      const countRow = countResult.toArray()[0];
      const cnt =
        typeof countRow?.cnt === 'bigint' ? Number(countRow.cnt) : Number(countRow?.cnt ?? 0);

      results.push({name, columns, rowCount: cnt});
    } catch {
      // Table may have been dropped concurrently; skip
    }
  }

  return results;
}

/**
 * Build a human-readable summary of all DuckDB tables suitable for
 * injecting into an LLM system prompt.
 */
export async function getDuckdbTableContext(): Promise<string> {
  const tables = await getDuckdbTableNames();
  if (tables.length === 0) return '';

  const lines = tables.map(t => {
    const cols = t.columns.map(c => `${c.name} (${c.type})`).join(', ');
    return `- Table "${t.name}" [${t.rowCount} rows]: ${cols}`;
  });

  return `The following tables are available in DuckDB:\n${lines.join('\n')}`;
}

// ---------------------------------------------------------------------------
// Retrieval helpers
// ---------------------------------------------------------------------------

/**
 * Query a DuckDB table and return rows as plain objects.
 */
export async function queryTable(
  tableName: string,
  sql?: string
): Promise<Record<string, unknown>[]> {
  const db = await getConnector();
  const query = sql ?? `SELECT * FROM "${tableName}"`;
  const result = await db.query(query);
  return result
    .toArray()
    .map((row: any) => (typeof row.toJSON === 'function' ? row.toJSON() : row));
}

/**
 * Retrieve a GeoJSON FeatureCollection from a DuckDB table that has a
 * `geometry` column (VARCHAR containing JSON geometry).
 */
export async function getTableAsGeoJSON(tableName: string): Promise<FeatureCollection | null> {
  const exists = await tableExists(tableName);
  if (!exists) return null;

  const rows = await queryTable(tableName);
  if (rows.length === 0) return {type: 'FeatureCollection', features: []};

  if (!('geometry' in rows[0])) return null;

  const features = rows.map((row: any) => {
    const geometry = typeof row.geometry === 'string' ? JSON.parse(row.geometry) : row.geometry;
    const properties = {...row};
    delete properties.geometry;
    return {type: 'Feature' as const, geometry, properties};
  });

  return {type: 'FeatureCollection', features};
}

/**
 * Check whether a table has a geometry column (i.e. it represents spatial data).
 */
export async function hasGeometryColumn(tableName: string): Promise<boolean> {
  const db = await getConnector();
  try {
    const result = await db.query(
      `SELECT 1 FROM information_schema.columns
       WHERE table_name = '${tableName.replace(/'/g, "''")}'
         AND column_name = 'geometry'
       LIMIT 1`
    );
    return result.toArray().length > 0;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Kepler.gl integration — load a DuckDB table as a kepler.gl dataset
// ---------------------------------------------------------------------------

/**
 * Load a DuckDB table into kepler.gl as a dataset.
 * If the table has a `geometry` column, it reconstructs a GeoJSON FeatureCollection.
 * Otherwise, it passes the row data directly.
 */
export async function loadTableToKepler(
  ctx: KeplerContext,
  tableName: string,
  options?: {autoCreateLayers?: boolean; centerMap?: boolean}
): Promise<{success: boolean; error?: string}> {
  try {
    const exists = await tableExists(tableName);
    if (!exists) {
      return {success: false, error: `Table "${tableName}" not found in DuckDB.`};
    }

    const hasGeom = await hasGeometryColumn(tableName);
    let data: any;

    if (hasGeom) {
      data = await getTableAsGeoJSON(tableName);
    } else {
      data = await queryTable(tableName);
    }

    if (!data || (Array.isArray(data) && data.length === 0)) {
      return {success: false, error: `Table "${tableName}" is empty.`};
    }

    const parsedData = await processFileData({
      content: {data, fileName: tableName},
      fileCache: []
    });

    ctx.dispatch(
      addDataToMap({
        datasets: parsedData,
        options: {
          autoCreateLayers: options?.autoCreateLayers ?? true,
          centerMap: options?.centerMap ?? true
        }
      })
    );

    return {success: true};
  } catch (error) {
    return {
      success: false,
      error: `Failed to load table to kepler.gl: ${
        error instanceof Error ? error.message : String(error)
      }`
    };
  }
}
