// SPDX-License-Identifier: MIT
// Copyright SQLRooms Contributors and contributors to the kepler.gl project

import {getTableIdentity, type DataTable} from '@sqlrooms/duckdb-core';
import type {RGBColor} from '@kepler.gl/types';

const UNLOADED_TABLE_COLOR: RGBColor = [143, 149, 161];

/**
 * A database/schema pair that can be referred to by bare table name in Kepler
 * dataset ids.
 */
export type KeplerDbSchemaReference = {
  database?: string;
  schema?: string;
};

/**
 * One selectable entry in Kepler's Add Layer table-source dropdown.
 */
export type KeplerTableLayerOption = {
  label: string;
  value: string;
};

/**
 * Minimal loaded Kepler dataset shape needed to build table source options.
 */
export type KeplerSourceDataset = {
  id: string;
  label?: string;
  color?: RGBColor;
};

/**
 * One option in a Kepler table source picker.
 */
export type KeplerTableSourceOption = {
  value: string;
  label: string;
  color: RGBColor;
  isLoaded: boolean;
};

/**
 * Inputs for building source picker options from loaded Kepler datasets plus
 * the DuckDB table catalog.
 */
export type BuildKeplerTableSourceOptionsParams = {
  dbTables: DataTable[];
  datasets?: Record<string, KeplerSourceDataset | undefined>;
  /**
   * Set false when the picker should only show datasets already loaded into
   * Kepler, such as filter data-source selectors.
   */
  includeUnloadedTables?: boolean;
  loadedDatasetIds?: string[];
  tableSelection?: KeplerTableSelectionOptions;
};

/**
 * Policy hooks for deciding which DuckDB tables are exposed to Kepler and how
 * they are represented in saved Kepler layer config.
 */
export type KeplerTableSelectionOptions = {
  /**
   * Return false to hide a DuckDB table from the Add Layer menu and to skip
   * loading matching saved dataset ids during sync.
   *
   * Defaults to including every visible DuckDB table.
   */
  includeTable?: (table: DataTable) => boolean;

  /**
   * Database/schema whose tables may use bare dataset ids, such as `places`.
   *
   * Tables outside this database/schema use qualified SQL table references for their
   * dataset ids. The Kepler slice defaults this to its current DuckDB
   * database/schema; host apps can supply their own stable resolver when their
   * persistence model needs a different comparison point.
   */
  defaultDbSchema?: KeplerDbSchemaReference | (() => KeplerDbSchemaReference | undefined);

  /**
   * Override how new Kepler dataset ids are generated for DuckDB tables.
   *
   * Use this only when the default bare-or-qualified policy does not match the
   * host app's persistence model.
   */
  getDatasetIdForTable?: (table: DataTable) => string;

  /**
   * Override the display label shown for a DuckDB table in Kepler's Add Layer
   * table-source dropdown.
   *
   * This only changes presentation; dataset ids still come from
   * `getDatasetIdForTable` or the default bare-or-qualified policy.
   */
  getTableLabel?: (table: DataTable) => string;

  /**
   * Override how saved Kepler dataset ids are resolved back to DuckDB tables.
   *
   * The default resolver matches qualified table references first, then bare ids
   * within `defaultDbSchema`. Return the matching table independent of
   * `includeTable`; the shared helpers apply `includeTable` after matching so
   * excluded tables are handled consistently.
   */
  findTableForDatasetId?: (tables: DataTable[], datasetId: string) => DataTable | undefined;
};

function resolveDefaultDbSchema(
  options: KeplerTableSelectionOptions = {}
): KeplerDbSchemaReference | undefined {
  if (typeof options.defaultDbSchema === 'function') {
    return options.defaultDbSchema();
  }

  if (options.defaultDbSchema) {
    return options.defaultDbSchema;
  }

  return undefined;
}

function tableMatchesDbSchema(
  table: DataTable,
  reference: KeplerDbSchemaReference | undefined
): boolean {
  if (!reference) {
    return false;
  }

  if (!reference.database || !reference.schema) {
    return false;
  }

  return table.table.database === reference.database && table.table.schema === reference.schema;
}

function getKeplerTableKey(table: DataTable | undefined): string | undefined {
  if (!table) {
    return undefined;
  }

  return [table.table.database ?? '', table.table.schema ?? '', table.table.table].join('.');
}

function getKeplerDatasetLabel(
  datasetId: string,
  dataset: KeplerSourceDataset | undefined,
  table: DataTable | undefined,
  tableSelection: KeplerTableSelectionOptions
): string {
  if (table) {
    return getKeplerTableLabel(table, tableSelection);
  }

  if (dataset?.label) {
    return dataset.label;
  }

  return datasetId;
}

function getKeplerDatasetColor(dataset: KeplerSourceDataset | undefined): RGBColor {
  return dataset?.color ?? UNLOADED_TABLE_COLOR;
}

function findMatchingKeplerTableForDatasetId(
  tables: DataTable[],
  datasetId: string,
  options: KeplerTableSelectionOptions = {}
): DataTable | undefined {
  if (options.findTableForDatasetId) {
    return options.findTableForDatasetId(tables, datasetId);
  }

  const defaultDbSchema = resolveDefaultDbSchema(options);
  for (const table of tables) {
    if (getTableIdentity(table.table) === datasetId) {
      return table;
    }

    if (tableMatchesDbSchema(table, defaultDbSchema) && table.table.table === datasetId) {
      return table;
    }
  }
  return undefined;
}

/**
 * Return whether a DuckDB table should be exposed as a Kepler layer source.
 *
 * This is the shared gate used by Add Layer table options and by host UIs that
 * offer their own "add table to map" actions.
 */
export function shouldIncludeKeplerTable(
  table: DataTable,
  options: KeplerTableSelectionOptions = {}
): boolean {
  if (!options.includeTable) {
    return true;
  }

  return options.includeTable(table);
}

/**
 * Choose the dataset id that should be written into new Kepler layer config.
 *
 * By default, tables in `defaultDbSchema` use bare ids (`places`) and all
 * other tables use qualified SQL references. Hosts can override this with
 * `getDatasetIdForTable`.
 */
export function getKeplerDatasetIdForTable(
  table: DataTable,
  options: KeplerTableSelectionOptions = {}
): string {
  if (options.getDatasetIdForTable) {
    return options.getDatasetIdForTable(table);
  }

  const defaultDbSchema = resolveDefaultDbSchema(options);
  if (tableMatchesDbSchema(table, defaultDbSchema)) {
    return table.table.table;
  }

  return getTableIdentity(table.table);
}

/**
 * Build a human-facing table label from raw catalog parts.
 *
 * Labels omit `defaultDbSchema` and do not include SQL identifier quotes.
 * They are display-only; option values still carry the stable dataset id.
 */
export function getKeplerTableLabel(
  table: DataTable,
  options: KeplerTableSelectionOptions = {}
): string {
  if (options.getTableLabel) {
    return options.getTableLabel(table);
  }

  const defaultDbSchema = resolveDefaultDbSchema(options);
  const labelParts: string[] = [];

  if (!defaultDbSchema && table.table.database) {
    labelParts.push(table.table.database);
  }

  if (
    defaultDbSchema &&
    table.table.database &&
    table.table.database !== defaultDbSchema.database
  ) {
    labelParts.push(table.table.database);
  }

  if (!defaultDbSchema && table.table.schema) {
    labelParts.push(table.table.schema);
  }

  if (defaultDbSchema && table.table.schema && table.table.schema !== defaultDbSchema.schema) {
    labelParts.push(table.table.schema);
  }

  labelParts.push(table.table.table);
  return labelParts.join('.');
}

/**
 * Resolve a saved Kepler dataset id back to the DuckDB table it should load.
 *
 * The default resolver accepts qualified table references and bare ids inside
 * `defaultDbSchema`. Tables rejected by `includeTable` are ignored.
 */
export function findKeplerTableForDatasetId(
  tables: DataTable[],
  datasetId: string,
  options: KeplerTableSelectionOptions = {}
): DataTable | undefined {
  const table = findMatchingKeplerTableForDatasetId(tables, datasetId, options);
  if (!table) {
    return undefined;
  }

  if (!shouldIncludeKeplerTable(table, options)) {
    return undefined;
  }

  return table;
}

/**
 * Build source picker options from loaded Kepler datasets plus unloaded DuckDB
 * tables that are allowed by the table-selection policy.
 *
 * Loaded Kepler datasets keep their existing dataset ids so selecting them does
 * not duplicate data. Unloaded tables use `getKeplerDatasetIdForTable`.
 */
export function buildKeplerTableSourceOptions({
  dbTables,
  datasets = {},
  includeUnloadedTables = true,
  loadedDatasetIds,
  tableSelection = {}
}: BuildKeplerTableSourceOptionsParams): KeplerTableSourceOption[] {
  const optionsByValue = new Map<string, KeplerTableSourceOption>();
  const loadedTableKeys = new Set<string>();
  const loadedIds = loadedDatasetIds ?? Object.keys(datasets);

  for (const datasetId of loadedIds) {
    const table = findMatchingKeplerTableForDatasetId(dbTables, datasetId, tableSelection);
    const tableKey = getKeplerTableKey(table);
    if (tableKey) {
      loadedTableKeys.add(tableKey);
    }
  }

  for (const [datasetId, dataset] of Object.entries(datasets)) {
    const table = findMatchingKeplerTableForDatasetId(dbTables, datasetId, tableSelection);
    if (table && !shouldIncludeKeplerTable(table, tableSelection)) {
      continue;
    }

    const label = getKeplerDatasetLabel(datasetId, dataset, table, tableSelection);

    optionsByValue.set(datasetId, {
      value: datasetId,
      label,
      color: getKeplerDatasetColor(dataset),
      isLoaded: true
    });
  }

  if (includeUnloadedTables) {
    for (const table of dbTables) {
      if (!shouldIncludeKeplerTable(table, tableSelection)) {
        continue;
      }

      const tableKey = getKeplerTableKey(table);
      if (tableKey && loadedTableKeys.has(tableKey)) {
        continue;
      }

      const value = getKeplerDatasetIdForTable(table, tableSelection);
      if (optionsByValue.has(value)) {
        continue;
      }

      optionsByValue.set(value, {
        value,
        label: getKeplerTableLabel(table, tableSelection),
        color: UNLOADED_TABLE_COLOR,
        isLoaded: false
      });
    }
  }

  return Array.from(optionsByValue.values()).sort(
    (left, right) => left.label.localeCompare(right.label) || left.value.localeCompare(right.value)
  );
}

/**
 * Build Add Layer dropdown options from DuckDB tables plus datasets that are
 * already loaded into Kepler.
 *
 * `includeTable` controls which DuckDB tables are exposed. Already-loaded
 * dataset ids are included unless they resolve to an excluded table or duplicate
 * an exposed table option.
 */
export function buildKeplerTableLayerOptions(
  dbTables: DataTable[],
  keplerDatasetIds: string[],
  options: KeplerTableSelectionOptions = {}
): KeplerTableLayerOption[] {
  const optionsByValue = new Map<string, string>();

  for (const table of dbTables) {
    if (!shouldIncludeKeplerTable(table, options)) {
      continue;
    }

    const value = getKeplerDatasetIdForTable(table, options);
    const label = getKeplerTableLabel(table, options);

    optionsByValue.set(value, label);
  }

  for (const id of keplerDatasetIds) {
    const table = findMatchingKeplerTableForDatasetId(dbTables, id, options);
    if (table) {
      if (!shouldIncludeKeplerTable(table, options)) {
        continue;
      }

      const value = getKeplerDatasetIdForTable(table, options);
      // Avoid showing both a table option and an already-loaded dataset alias
      // for the same DuckDB table.
      if (optionsByValue.has(value)) {
        continue;
      }
    }

    if (!optionsByValue.has(id)) {
      optionsByValue.set(id, id);
    }
  }

  return Array.from(optionsByValue, ([value, label]) => ({
    label,
    value
  })).sort(
    (left, right) => left.label.localeCompare(right.label) || left.value.localeCompare(right.value)
  );
}
