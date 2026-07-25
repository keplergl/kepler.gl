import interpolate from 'color-interpolate';
import {Feature} from 'geojson';
import {Layer, VectorTileLayer} from '@kepler.gl/layers';
import {Datasets, KeplerTable} from '@kepler.gl/table';
import {ALL_FIELD_TYPES, LAYER_TYPES} from '@kepler.gl/constants';
import {Field, ProtoDataset, ProtoDatasetField} from '@kepler.gl/types';
import {processFileData} from '@kepler.gl/processors';
import {createWasmDuckDbConnector, type DuckDbConnector} from '@sqlrooms/duckdb';
import {tableFromArrays} from 'apache-arrow';

// The kepler tools DuckDB connector. Prefer the store's DuckDB slice connector
// when wired via `setStoreConnectorProvider`, so skills (which materialize kepler
// datasets into DuckDB) and the main-agent `query` tool share ONE DuckDB
// instance. Without this, the two connectors diverge: skills write tables the
// query tool can't see, and vice versa. Falls back to a standalone
// WasmDuckDbConnector singleton when no store provider is wired (legacy path,
// e.g. unit tests that never construct the full store).
let connector: DuckDbConnector | null = null;
let storeConnectorProvider: (() => Promise<DuckDbConnector>) | null = null;

/**
 * Wire a resolver that returns the store's DuckDB connector. Called once at
 * store construction (see store.ts) so every `getConnector()` caller — tools,
 * skills, the wrapped query tool — reaches the same DuckDB instance.
 */
export function setStoreConnectorProvider(
  provider: (() => Promise<DuckDbConnector>) | null
): void {
  storeConnectorProvider = provider;
  // Invalidate the fallback singleton so a later re-wire picks up the store's
  // connector instead of a previously-created standalone instance.
  connector = null;
  // Invalidate the materialized-tables cache so datasets are re-materialized
  // against the new connector.
  resetMaterializedDatasets();
}

export async function getConnector(): Promise<DuckDbConnector> {
  if (storeConnectorProvider) {
    return storeConnectorProvider();
  }
  if (!connector) {
    connector = createWasmDuckDbConnector();
    await connector.initialize();
  }
  return connector;
}

let spatialExtensionLoaded = false;

export async function ensureSpatialExtension(): Promise<void> {
  if (spatialExtensionLoaded) return;
  const db = await getConnector();
  await db.execute(`INSTALL spatial; LOAD spatial;`);
  spatialExtensionLoaded = true;
}

export function interpolateColor(originalColors: string[], numberOfColors: number) {
  if (originalColors.length === numberOfColors) {
    return originalColors;
  }
  const interp = interpolate(originalColors);
  const colors = Array.from({length: numberOfColors}, (_, j) => interp(j / (numberOfColors - 1)));
  const hexColors = colors.map(color => {
    const rgb = color.match(/\d+/g);
    return `#${rgb?.map(c => parseInt(c).toString(16).padStart(2, '0')).join('')}`;
  });
  return hexColors;
}

export function getValuesFromDataset(
  datasets: Datasets,
  layers: Layer[],
  datasetName: string,
  variableName: string
): unknown[] {
  const datasetId = Object.keys(datasets).find(dataId => datasets[dataId].label === datasetName);
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

function isVectorTileLayer(layer: Layer): layer is VectorTileLayer {
  return layer.type === LAYER_TYPES.vectorTile;
}

export function getValuesFromVectorTileLayer(datasetId: string, layers: Layer[], field: Field) {
  const layerIndex = layers.findIndex(layer => layer.config.dataId === datasetId);
  if (layerIndex === -1) return [];
  const layer = layers[layerIndex];
  if (!isVectorTileLayer(layer)) return [];
  const accessor = layer.accessRowValue(field);
  const values: unknown[] = [];
  // @ts-expect-error TODO fix this later in the vector-tile layer
  for (const row of layer.tileDataset.tileSet) {
    const value = accessor(field, row);
    if (value === null) break;
    values.push(value);
  }
  return values;
}

export function highlightRows(
  datasets: Datasets,
  layers: Layer[],
  datasetName: string,
  selectedRowIndices: number[],
  layerSetIsValid: (layer: Layer, isValid: boolean) => void
) {
  const datasetId = Object.keys(datasets).find(dataId => datasets[dataId].label === datasetName);
  if (!datasetId) return;
  const dataset = datasets[datasetId];
  if (dataset) {
    dataset.filteredIndex =
      selectedRowIndices.length === 0 ? dataset.allIndexes : selectedRowIndices;
    const selectLayers = layers.filter(layer => layer.config.dataId === dataset.id);
    selectLayers.forEach(layer => {
      layer.formatLayerData(datasets);
      layerSetIsValid(layer, true);
    });
  }
}

export function getDatasetContext(datasets?: Datasets, layers?: Layer[]) {
  if (!datasets || !layers) return '';
  const context =
    'Please remember the following datasets and layers for answering the user question:';
  const dataMeta = Object.values(datasets).map((dataset: KeplerTable) => ({
    datasetName: dataset.label,
    datasetId: dataset.id,
    fields: dataset.fields.map(field => ({[field.name]: field.type})),
    layers: layers
      .filter(layer => layer.config.dataId === dataset.id)
      .map(layer => ({
        id: layer.id,
        label: layer.config.label,
        type: layer.type,
        geometryMode: layer.config.columnMode,
        geometryColumns: Object.fromEntries(
          Object.entries(layer.config.columns)
            .filter(([, value]) => value !== null)
            .map(([key, value]) => [
              key,
              typeof value === 'object' && value !== null
                ? Object.fromEntries(Object.entries(value).filter(([, v]) => v !== null))
                : value
            ])
        )
      }))
  }));
  return `${context}\n${JSON.stringify(dataMeta)}`;
}

export type SpatialJoinGeometries = Feature[] | unknown[];

export function getGeometriesFromDataset(
  datasets: Datasets,
  layers: Layer[],
  layerData: any[],
  datasetName: string
): SpatialJoinGeometries {
  const datasetId = Object.keys(datasets).find(dataId => datasets[dataId].label === datasetName);
  if (!datasetId) {
    return [];
  }
  const dataset = datasets[datasetId];

  if (dataset.type === 'vector-tile') {
    const selected = layers.filter(layer => layer.config.dataId === dataset.id);
    const layer = selected.find(layer => layer.type === LAYER_TYPES.vectorTile);
    if (!layer) return [];
    const geometries: Feature[] = [];
    // @ts-expect-error TODO fix this later in the vector-tile layer
    for (const row of layer.tileDataset.tileSet) {
      geometries.push(row);
    }
    return geometries;
  }

  const selectedLayers = layers.filter(layer => layer.config.dataId === dataset.id);
  if (selectedLayers.length === 0) return [];

  const geojsonLayer = selectedLayers.find(layer => layer.type === LAYER_TYPES.geojson);
  const pointLayer = selectedLayers.find(layer => layer.type === LAYER_TYPES.point);
  const otherLayers = selectedLayers.filter(
    layer => layer.type !== LAYER_TYPES.geojson && layer.type !== LAYER_TYPES.point
  );

  const validLayer = geojsonLayer || pointLayer || otherLayers[0];
  if (validLayer) {
    const layerIndex = layers.findIndex(layer => layer.id === validLayer.id);
    const geometries = layerData[layerIndex];
    return geometries.data;
  }

  return [];
}

export function saveAsDataset(
  datasets: Datasets,
  layers: Layer[],
  datasetName: string,
  newDatasetName: string,
  data: Record<string, unknown[]>
) {
  const datasetId = Object.keys(datasets).find(dataId => datasets[dataId].label === datasetName);
  if (!datasetId) return;
  if (Object.keys(datasets).includes(newDatasetName)) return;

  const leftDataset = datasets[datasetId];
  let numRows = leftDataset.length;
  let geometries: Feature[];

  if (leftDataset.type === 'vector-tile') {
    geometries = getFeaturesFromVectorTile(leftDataset, layers) || [];
    numRows = geometries.length;
  }

  const fields: ProtoDatasetField[] = [
    ...Object.keys(data).map((fieldName, index) => ({
      name: fieldName,
      id: `${fieldName}_${index}`,
      displayName: fieldName,
      type: determineFieldType(data[fieldName][0])
    })),
    ...leftDataset.fields.map((field, index) => ({
      name: field.name,
      id: field.id || `${field.name}_${index}`,
      displayName: field.displayName,
      type: field.type
    })),
    ...(leftDataset.type === 'vector-tile'
      ? [{name: '_geojson', id: '_geojson', displayName: '_geojson', type: 'geojson'}]
      : [])
  ];

  const dataValues = Object.values(data);

  const rows = Array(numRows)
    .fill(null)
    .map((_, rowIdx) => [
      ...dataValues.map(col => col[rowIdx]),
      ...leftDataset.fields.map(field =>
        leftDataset.type === 'vector-tile'
          ? geometries[rowIdx].properties?.[field.name]
          : leftDataset.getValue(field.name, rowIdx)
      ),
      ...(leftDataset.type === 'vector-tile' ? [geometries[rowIdx]] : [])
    ]);

  const newDataset: ProtoDataset = {
    info: {id: newDatasetName, label: newDatasetName},
    data: {fields, rows}
  };

  return newDataset;
}

function determineFieldType(value: unknown): keyof typeof ALL_FIELD_TYPES {
  return typeof value === 'number'
    ? Number.isInteger(value)
      ? ALL_FIELD_TYPES.integer
      : ALL_FIELD_TYPES.real
    : ALL_FIELD_TYPES.string;
}

function getFeaturesFromVectorTile(leftDataset: KeplerTable, layers: Layer[]) {
  const layerIndex = layers.findIndex(layer => layer.config.dataId === leftDataset.id);
  if (layerIndex === -1) return;
  const layer = layers[layerIndex];
  if (!isVectorTileLayer(layer)) return;
  const features: Feature[] = [];
  // @ts-expect-error TODO fix this later in the vector-tile layer
  for (const row of layer.tileDataset.tileSet) {
    features.push(row);
  }
  return features;
}

export async function appendColumnsToDataset(
  datasets: Datasets,
  layers: Layer[],
  datasetName: string,
  result: Record<string, number>[],
  newDatasetName: string
) {
  const datasetId = Object.keys(datasets).find(dataId => datasets[dataId].label === datasetName);
  if (!datasetId) {
    throw new Error(`Dataset ${datasetName} not found`);
  }

  const originalDataset = datasets[datasetId];
  const fields = originalDataset.fields;
  const numRows = originalDataset.length || result.length;
  const rowObjects: Record<string, unknown>[] = [];

  if (originalDataset.type === 'vector-tile') {
    const columnData: Record<string, unknown[]> = {};
    for (const field of fields) {
      columnData[field.name] = getValuesFromVectorTileLayer(datasetId, layers, field);
    }
    for (let i = 0; i < numRows; i++) {
      const rowObject: Record<string, unknown> = {};
      for (const field of fields) {
        rowObject[field.name] = columnData[field.name][i];
      }
      rowObjects.push(rowObject);
    }
  } else {
    for (let i = 0; i < numRows; i++) {
      const rowObject: Record<string, unknown> = {};
      for (const field of fields) {
        const value = originalDataset.getValue(field.name, i);
        rowObject[field.name] = value;
      }
      rowObjects.push(rowObject);
    }
  }

  for (let i = 0; i < numRows; i++) {
    const queryRow = result[i];
    const rowObject = rowObjects[i];
    Object.keys(queryRow).forEach(key => {
      const value = queryRow[key];
      rowObject[key] = value;
    });
  }

  const processedData = await processFileData({
    content: {fileName: newDatasetName, data: rowObjects},
    fileCache: []
  });

  return processedData;
}

/** Type for a Redux dispatch function, used by tools that need to dispatch kepler actions */
export type KeplerDispatch = (action: any) => void;

export const FETCH_TIMEOUT_MS = 5_000;

export function combineSignals(
  timeoutMs: number,
  abortSignal?: AbortSignal
): {signal: AbortSignal; cleanup: () => void} {
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);
  const signals = [timeoutController.signal];
  if (abortSignal) signals.push(abortSignal);
  const combined = AbortSignal.any(signals);
  return {signal: combined, cleanup: () => clearTimeout(timeoutId)};
}

export class RateLimiter {
  private lastCallTime = 0;
  private queue: Promise<void> = Promise.resolve();
  constructor(private minInterval: number = 1000) {}
  async waitForNextCall(): Promise<void> {
    this.queue = this.queue.then(async () => {
      const now = Date.now();
      const elapsed = now - this.lastCallTime;
      const waitTime = this.lastCallTime === 0 ? 0 : Math.max(0, this.minInterval - elapsed);
      if (waitTime > 0) {
        await new Promise(r => setTimeout(r, waitTime));
      }
      this.lastCallTime = Date.now();
    });
    return this.queue;
  }
}

export const mapboxRateLimiter = new RateLimiter(1000);
export const nominatimRateLimiter = new RateLimiter(1000);
export const overpassRateLimiter = new RateLimiter(1000);
export const githubRateLimiter = new RateLimiter(1000);

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
export function convertArrowRowToObject(row: any): Record<string, unknown> {
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
 * Convert an Arrow Table to an array of plain JS objects.
 */
export function arrowTableToObjects(table: {
  toArray: () => any[];
}): Record<string, unknown>[] {
  return table.toArray().map((row: any) => convertArrowRowToObject(row));
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

  for (const row of table) {
    const values = columns.map(col => truncateValue(row[col]));
    lines.push(`| ${values.join(' | ')} |`);

    const currentLength = lines.join('\n').length;
    if (currentLength > maxTotalLength - 100) {
      lines.push('...');
      break;
    }
  }

  let result = lines.join('\n');
  if (result.length > maxTotalLength) {
    result = result.slice(0, maxTotalLength) + '\n...';
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
  const rows = sliced.map((row: any) => convertArrowRowToObject(row));
  return tableToLLMResult(
    rows,
    options?.maxTotalLength ?? LLM_PREVIEW_MAX_TOTAL_LENGTH,
    options?.maxValueLength ?? LLM_PREVIEW_MAX_VALUE_LENGTH
  );
}

/**
 * Set of kepler dataset labels already materialized into DuckDB in this
 * session, so `ensureKeplerDatasetsMaterialized` is idempotent and cheap on
 * repeat calls. Cleared when the connector is rewired via
 * `setStoreConnectorProvider` (the new connector has no tables yet).
 */
const materializedDatasetLabels = new Set<string>();

/**
 * Eagerly materialize all currently-loaded kepler.gl datasets into DuckDB as
 * `tbl_<sanitized-label>` tables (via `datasetNameToTableName`), so the
 * main-agent `query` tool can `SHOW TABLES` / `DESCRIBE` / `SELECT` against
 * them even before any skill has run.
 *
 * Kepler datasets live in-memory in `visState.datasets`; without this step a
 * raw `DESCRIBE tbl_new_dataset` fails with "Table does not exist" because no
 * skill has lazily materialized it yet. This mirrors the lazy
 * `loadTableIntoDuckDB` in query-tool.ts but runs eagerly for every loaded
 * dataset, closing the kepler ↔ DuckDB gap.
 *
 * Idempotent: skips datasets already materialized in this session. Only
 * materializes non-vector-tile datasets (those whose fields can be read via
 * `getValuesFromDataset`). Errors per-dataset are swallowed and logged so one
 * bad dataset doesn't block the rest.
 *
 * @param datasets kepler `visState.datasets`
 * @param layers kepler `visState.layers` (needed by getValuesFromDataset for
 *               vector-tile field lookups)
 */
export async function ensureKeplerDatasetsMaterialized(
  datasets: Datasets,
  layers: Layer[]
): Promise<void> {
  if (!datasets) return;
  const db = await getConnector();

  for (const dataset of Object.values(datasets) as KeplerTable[]) {
    const label = dataset.label;
    if (!label || materializedDatasetLabels.has(label)) continue;
    // Skip vector-tile datasets — their fields can't be materialized as columns.
    if (dataset.type === 'vector-tile') continue;

    try {
      const dbTableName = datasetNameToTableName(label);
      const variableNames = dataset.fields.map(f => f.name);
      if (variableNames.length === 0) continue;

      const columnData: Record<string, unknown[]> = {};
      for (const varName of variableNames) {
        columnData[varName] = getValuesFromDataset(datasets, layers, label, varName);
      }
      const arrowTable = tableFromArrays(columnData);
      await db.execute(`DROP TABLE IF EXISTS "${dbTableName}"`);
      await db.loadArrow(arrowTable, dbTableName);
      materializedDatasetLabels.add(label);
    } catch (err) {
      // Don't let one bad dataset block the rest; the skill path can still
      // materialize it lazily later.
      console.warn(`[ensureKeplerDatasetsMaterialized] Failed for "${label}":`, err);
    }
  }
}

/**
 * Reset the materialization cache. Called when the connector is rewired (so
 * datasets are re-materialized against the new connector) or when kepler
 * datasets change (e.g. a new dataset is loaded).
 */
export function resetMaterializedDatasets(): void {
  materializedDatasetLabels.clear();
}
