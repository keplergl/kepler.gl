/**
 * Pure helpers shared by the map.* commands and the analysis shims. These are
 * dependency-light (apache-arrow only) and free of kepler-app state, so they
 * live in the map surface package and are re-exported for the analysis layer
 * (kepler-assistant) to import.
 */

import {Type} from 'apache-arrow';
import {LAYER_TYPES} from '@kepler.gl/constants';
import {arrowSchemaToFields} from '@kepler.gl/processors';
import type {Layer, VectorTileLayer} from '@kepler.gl/layers';
import type {Datasets} from '@kepler.gl/table';
import type {Field} from '@kepler.gl/types';

/** Type for a Redux dispatch function, used by tools that need to dispatch kepler actions */
export type KeplerDispatch = (action: any) => void;

/**
 * Deterministically convert a dataset name into a valid DuckDB table name.
 * Replaces non-alphanumeric characters (except underscores) with underscores,
 * collapses consecutive underscores, trims leading/trailing underscores,
 * lowercases the result, and prepends 'tbl_' to avoid reserved-word collisions.
 */
export function datasetNameToTableName(datasetName: string): string {
  const sanitized = datasetName
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase();
  return `tbl_${sanitized || 'unnamed'}`;
}

/**
 * Recursively convert an Arrow row (which uses proxy objects) into a plain JS
 * object. Handles nested toJSON(), arrays, and bigint values. Extracted from
 * query-tool.ts so the stock @sqlrooms/ai query tool wrapper can share it.
 */
export function convertArrowRowToObject(row: any): unknown {
  if (row === null || typeof row !== 'object') return row;

  if (typeof row.toJSON === 'function') {
    const json = row.toJSON();
    for (const key in json) {
      const val = json[key];
      if (val && typeof val === 'object' && typeof val.toJSON === 'function') {
        json[key] = convertArrowRowToObject(val);
      } else if (Array.isArray(val)) {
        json[key] = val.map(v => convertArrowRowToObject(v));
      } else if (typeof val === 'bigint') {
        json[key] = val.toString();
      }
    }
    return json;
  }

  if (Array.isArray(row)) {
    return row.map(convertArrowRowToObject) as any;
  }

  return row;
}

/**
 * Convert an Arrow DecimalBigNum (128-bit signed, stored as a Uint32Array of
 * words) to a JS number, applying the column's declared scale.
 *
 * Arrow's own `valueOf(scale)` divides the raw bigint by 10^scale and converts
 * the intermediate denominator with bigIntToNumber, which throws for scale >= 16
 * (10^16 > Number.MAX_SAFE_INTEGER). We instead reconstruct the bigint and
 * insert the decimal point via string manipulation, which avoids that throw and
 * is exact up to the final JS Number coercion — very large Decimal128 values can
 * still lose precision or overflow when converted to a Number.
 */
function decimalBigNumToNumber(v: any, scale: number): number {
  let big = 0n;
  for (let i = v.length - 1; i >= 0; i--) {
    big = (big << 32n) | BigInt(v[i] >>> 0);
  }
  // Two's complement sign (128-bit).
  if (v[v.length - 1] & 0x80000000) {
    big -= 1n << BigInt(32 * v.length);
  }
  const negative = big < 0n;
  if (negative) big = -big;
  let s = big.toString();
  if (scale > 0) {
    if (s.length <= scale) s = s.padStart(scale + 1, '0');
    s = `${s.slice(0, s.length - scale)}.${s.slice(s.length - scale)}`;
  }
  return Number(`${negative ? '-' : ''}${s}`);
}

/**
 * Convert an Arrow Table to an array of plain JS objects.
 *
 * Decimal columns are resolved to numbers using each column's declared scale.
 * `row.toJSON()` passes Decimal values through as opaque BigNum objects
 * ({0: low, 1: high, ...}), which kepler.gl then stores as `object`-typed
 * fields and downstream commands (e.g. `data.merge-tables`) choke on when they
 * try to re-materialize the dataset into DuckDB. The schema carries the scale,
 * so we resolve the value here.
 */
export function arrowTableToObjects(table: {
  toArray: () => any[];
  schema?: {fields: {name: string; type?: {typeId?: number; scale?: number}}[]};
}): Record<string, unknown>[] {
  const scaleByColumn = new Map<string, number>();
  for (const field of table.schema?.fields ?? []) {
    if (field.type?.typeId === Type.Decimal && typeof field.type.scale === 'number') {
      scaleByColumn.set(field.name, field.type.scale);
    }
  }
  return table.toArray().map((row: any) => {
    const json = row.toJSON();
    for (const [name, scale] of scaleByColumn) {
      const v = json[name];
      if (v && typeof v === 'object' && typeof v.valueOf === 'function') {
        json[name] = decimalBigNumToNumber(v, scale);
      }
    }
    for (const key in json) {
      const val = json[key];
      if (val && typeof val === 'object' && typeof val.toJSON === 'function') {
        json[key] = convertArrowRowToObject(val);
      } else if (typeof val === 'bigint') {
        json[key] = val.toString();
      }
    }
    return json;
  });
}

/**
 * Read a column's values from a kepler dataset (by dataset label + field name).
 * Vectors through the vector-tile layer when the dataset is a vector-tile
 * dataset (whose values live in the layer's tile set, not the kepler table).
 *
 * Moved in from kepler-assistant's `src/glue/utils.ts` so this package is
 * self-contained — the map.* commands that call this seam (via `KeplerContext`)
 * cannot import from kepler-assistant (that would be circular).
 */
export function getValuesFromDataset(
  datasets: Datasets,
  layers: Layer[],
  datasetName: string,
  variableName: string
): unknown[] {
  // Commands advertise accepting a dataset "name (label) or id", so match by
  // either — a caller using the dataset id must not fail here.
  const datasetId = Object.keys(datasets).find(
    dataId => dataId === datasetName || datasets[dataId].label === datasetName
  );
  if (!datasetId) {
    throw new Error(`Dataset ${datasetName} not found`);
  }
  const dataset = datasets[datasetId];
  if (dataset) {
    const field = dataset.fields.find(f => f.name === variableName);
    if (!field) {
      throw new Error(`Field ${variableName} not found in dataset ${datasetName}`);
    }
    if (dataset.type === 'vector-tile') {
      const vtField = dataset.fields.find(f => f.name === variableName);
      if (vtField) {
        return getValuesFromVectorTileLayer(datasetId, layers, vtField);
      }
    }
    return Array.from({length: dataset.length}, (_, i) => dataset.getValue(variableName, i));
  }
  return [];
}

export function isVectorTileLayer(layer: Layer): layer is VectorTileLayer {
  return layer.type === LAYER_TYPES.vectorTile;
}

export function getValuesFromVectorTileLayer(datasetId: string, layers: Layer[], field: Field) {
  const layerIndex = layers.findIndex(layer => layer.config.dataId === datasetId);
  if (layerIndex === -1) return [];
  const layer = layers[layerIndex];
  if (!isVectorTileLayer(layer)) return [];
  const accessor = layer.accessRowValue(field);
  const values: unknown[] = [];
  // Iterate the layer's tiles through the public `TileDataset.getTiles()` seam
  // (the same tile->features unwrap the layer itself uses in renderLayer) —
  // not the private `tileSet` field, which is an implementation detail that
  // can change with internal refactors. `tileDataset` is protected, so it
  // needs a cast, but `getTiles()` is a stable public method.
  const tiles = (layer as any).tileDataset?.getTiles?.() ?? [];
  for (const tile of tiles) {
    const content = (tile as any)?.content;
    const features = content?.shape === 'geojson-table' ? content.features : content;
    if (!Array.isArray(features)) continue;
    for (const row of features) {
      const value = accessor(field, row);
      // Nulls mean "skip this row" (as in kepler's own TileDataset iteration),
      // not "end of data" — breaking here would truncate the values array.
      if (value === null) continue;
      values.push(value);
    }
  }
  return values;
}

/**
 * Whether a column holds any non-null object value — e.g. the `_geojson` column,
 * which stores whole GeoJSON Feature objects. Such columns must NOT be handed to
 * `tableFromArrays` raw: Arrow infers ONE type per column from the first value,
 * and a dataset mixing Polygon (depth-3 `coordinates`) and MultiPolygon (depth-4)
 * features gets the shallower type, so the MultiPolygon coordinates come back as
 * `null` and the geometry disappears. Serialize them to JSON strings for the
 * DuckDB round-trip and restore with `restoreObjectColumns`.
 */
export function isObjectColumn(values: unknown[]): boolean {
  return values.some(v => v !== null && v !== undefined && typeof v === 'object');
}

/**
 * Serialize object values to JSON strings (nulls/primitives pass through
 * unchanged) so `tableFromArrays` never has to infer a nested-struct type.
 */
export function stringifyObjectColumn(values: unknown[]): unknown[] {
  if (!isObjectColumn(values)) return values;
  return values.map(v => {
    if (v === null || v === undefined) return null;
    return typeof v === 'object' ? JSON.stringify(v) : v;
  });
}

/**
 * Restore object-valued columns that `stringifyObjectColumn` serialized back to
 * their object form, in place. Used after a DuckDB query returns those columns
 * as JSON strings (e.g. `_geojson` after `SELECT *`).
 */
export function restoreObjectColumns(rows: Record<string, unknown>[], columnNames: string[]): void {
  if (columnNames.length === 0) return;
  for (const row of rows) {
    for (const name of columnNames) {
      const value = row[name];
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          // Only restore object/array values. A column may mix objects with
          // primitives (e.g. a string "1" alongside real objects), and
          // JSON-parsing those would coerce "1" → 1 / "true" → true, silently
          // changing their types. Leave primitives as the original string.
          if (parsed !== null && typeof parsed === 'object') {
            row[name] = parsed;
          }
        } catch {
          // Not JSON — leave the string as-is.
        }
      }
    }
  }
}

/**
 * Build an `updateDataset` payload that appends ONE new column to an existing
 * kepler dataset, keeping every existing column byte-for-byte identical.
 *
 * Existing columns are read straight from the kepler dataset (via
 * `getValuesFromDataset`) and NEVER round-tripped through Arrow/DuckDB. That
 * matters for `_geojson`: `tableFromArrays` infers a single Arrow type for the
 * whole column, and a dataset mixing Polygon and MultiPolygon features gets the
 * shallower type — the MultiPolygon's deeper coordinate nesting comes back as
 * nulls and the geometry disappears. Only the NEW column's values come from the
 * computation (DuckDB expression / copy, or geoda write-back).
 *
 * @param datasets kepler datasets (visState.datasets)
 * @param layers kepler layers (visState.layers) — needed for vector-tile datasets
 * @param datasetName the dataset label
 * @param newColumnName name of the column being appended
 * @param newColumnArrow single-column arrow table holding the new column's values
 * @returns an `updateDataset` `data` payload: `{rows, fields}`
 */
export function buildAddColumnPayload(
  datasets: Datasets,
  layers: Layer[],
  datasetName: string,
  newColumnName: string,
  newColumnArrow: any
): {rows: unknown[][]; fields: any[]} {
  // Match by id or label, consistent with getValuesFromDataset and the
  // commands' "name (label) or id" contract.
  const datasetId = Object.keys(datasets).find(
    id => id === datasetName || datasets[id].label === datasetName
  );
  if (!datasetId) {
    throw new Error(`Dataset "${datasetName}" not found.`);
  }
  const dataset = datasets[datasetId];
  const originalFields = dataset.fields;

  // The new column's values + field descriptor come from the computation's
  // arrow result (DuckDB expression / copy, or geoda write-back).
  const newColumnValues = arrowTableToObjects(newColumnArrow).map(o => o[newColumnName]);
  if (newColumnValues.length !== dataset.length) {
    throw new Error(
      `Computed column "${newColumnName}" produced ${newColumnValues.length} rows, but dataset ` +
        `"${datasetName}" has ${dataset.length} rows. The expression must produce exactly one ` +
        `value per row — check for filters, joins, or a non-1:1 query.`
    );
  }
  const newField = arrowSchemaToFields(newColumnArrow)[0];

  // Existing columns come from the original kepler dataset, never Arrow/DuckDB.
  const columns = originalFields.map(f => ({
    name: f.name,
    values: getValuesFromDataset(datasets, layers, datasetName, f.name)
  }));

  // RowDataContainer format: one array per row, indexed by field position.
  const rows = Array.from({length: dataset.length}, (_, i) => [
    ...columns.map(c => c.values[i]),
    newColumnValues[i]
  ]);

  const fields = [...originalFields, newField];
  return {rows, fields};
}

/**
 * Default number of first rows to format and return to the LLM as a preview.
 * Mirrors spatial-agent's NUMBER_OF_ROWS_RETURN_TO_LLM.
 */
export const NUMBER_OF_ROWS_RETURN_TO_LLM = 5;

/**
 * Default total character budget for the LLM-facing preview. Capped at ~1000
 * chars so the preview stays small in context, matching spatial-agent's
 * formatResultsForLLM default.
 */
export const LLM_PREVIEW_MAX_TOTAL_LENGTH = 1000;
export const LLM_PREVIEW_MAX_VALUE_LENGTH = 80;

/**
 * Format a query result table as a pipe-delimited string suitable for LLM
 * consumption. Truncates individual cell values and total output to stay within
 * a token budget. Shared by the stock @sqlrooms/ai query tool wrapper and the
 * skill executeApi data.query path.
 */
export function tableToLLMResult(
  table: Record<string, unknown>[],
  maxTotalLength: number = LLM_PREVIEW_MAX_TOTAL_LENGTH,
  maxValueLength: number = LLM_PREVIEW_MAX_VALUE_LENGTH
): string {
  if (table.length === 0) return 'No rows returned';

  const truncateValue = (value: unknown): string => {
    if (value === null || value === undefined) return '';
    let str: string;
    if (typeof value === 'bigint') {
      str = value.toString();
    } else if (ArrayBuffer.isView(value) || value instanceof ArrayBuffer) {
      const byteLen =
        value instanceof ArrayBuffer ? value.byteLength : (value as ArrayBufferView).byteLength;
      str = `<${byteLen} bytes>`;
    } else if (Array.isArray(value)) {
      str = value.map(v => (typeof v === 'string' ? v : String(v))).join(', ');
    } else if (typeof value === 'object') {
      try {
        str = JSON.stringify(value, (_k, v) => (typeof v === 'bigint' ? v.toString() : v));
      } catch {
        str = String(value);
      }
    } else {
      str = String(value);
    }
    return str.length > maxValueLength ? `${str.slice(0, maxValueLength)}...` : str;
  };

  const columns = Object.keys(table[0] || {});
  const headerRow = `| ${columns.join(' | ')} |`;
  const separatorRow = `| ${columns.map(() => '---').join(' | ')} |`;
  const lines = [headerRow, separatorRow];
  // Track the joined length incrementally instead of re-joining the whole
  // array on every row (O(n²) in the number of preview rows).
  let currentLength = headerRow.length + separatorRow.length + 1; // +1 for the '\n' between them

  for (const row of table) {
    const values = columns.map(col => truncateValue(row[col]));
    const line = `| ${values.join(' | ')} |`;
    lines.push(line);
    currentLength += line.length + 1; // +1 for the '\n' separator

    if (currentLength > maxTotalLength - 100) {
      lines.push('...');
      break;
    }
  }

  let result = lines.join('\n');
  if (result.length > maxTotalLength) {
    result = `${result.slice(0, maxTotalLength)}\n...`;
  }
  return result;
}

/**
 * Format the first N rows of an Arrow result as a pipe-delimited string for the
 * LLM, capped at maxTotalLength chars. Convenience wrapper combining
 * arrowTableToObjects + tableToLLMResult.
 */
export function formatResultsForLLM(
  result: {toArray: () => any[]},
  numberOfRows: number = NUMBER_OF_ROWS_RETURN_TO_LLM,
  options?: {maxTotalLength?: number; maxValueLength?: number}
): string {
  const sliced = result.toArray().slice(0, numberOfRows);
  const rows = sliced.map(
    (row: any) => convertArrowRowToObject(row) as Record<string, unknown>
  );
  return tableToLLMResult(
    rows,
    options?.maxTotalLength ?? LLM_PREVIEW_MAX_TOTAL_LENGTH,
    options?.maxValueLength ?? LLM_PREVIEW_MAX_VALUE_LENGTH
  );
}
