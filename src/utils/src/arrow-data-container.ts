// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ALL_FIELD_TYPES, GEOARROW_METADATA_KEY} from '@kepler.gl/constants';
import {GeoArrowBinaryData, ProtoDatasetField} from '@kepler.gl/types';
import * as arrow from 'apache-arrow';
import {console as globalConsole} from 'global/window';
import {DATA_TYPES as AnalyzerDATA_TYPES} from 'type-analyzer';

import {getApplicationConfig} from './application-config';
import {DataContainerInterface, RangeOptions} from './data-container-interface';
import {DataRow, SharedRowOptions} from './data-row';

type ArrowDataContainerInput = {
  cols: arrow.Vector[];
  fields?: ProtoDatasetField[];
  arrowTable?: arrow.Table;
  geoArrowBinaryData?: GeoArrowBinaryData;
};

type ArrowDataContainerUpdateOptions = {
  geoArrowBinaryData?: GeoArrowBinaryData;
};

/**
 * Check if table is an ArrowTable object.
 *
 * We use duck-typing instead of `instanceof arrow.Table` because DuckDB loads its own
 * bundled version of Apache Arrow. When DuckDB creates Arrow tables, they are instances
 * of DuckDB's Arrow.Table class, not the Arrow.Table class from our application's
 * apache-arrow package. This causes `instanceof` checks to fail even though the objects
 * are functionally equivalent Arrow tables.
 *
 * @param data - object to check
 * @returns true if data is an ArrowTable object (type guarded)
 */
export function isArrowTable(data: any): data is arrow.Table {
  return (
    typeof data === 'object' &&
    data !== null &&
    'schema' in data &&
    'getChildAt' in data &&
    typeof data.getChildAt === 'function' &&
    'batches' in data &&
    Array.isArray(data.batches)
  );
}

/**
 * Check if data is an ArrowVector object.
 * Uses duck-typing instead of `instanceof` to handle DuckDB's bundled Arrow version.
 *
 * @param data - object to check
 * @returns true if data is an ArrowVector object (type guarded)
 */
export function isArrowVector(data: any): data is arrow.Vector {
  return (
    typeof data === 'object' &&
    data !== null &&
    'type' in data &&
    'length' in data &&
    typeof data.length === 'number' &&
    'get' in data &&
    typeof data.get === 'function' &&
    'data' in data &&
    Array.isArray(data.data)
  );
}

/** Build an Arrow vector while letting Arrow infer the physical type from converted values. */
export function createArrowVector(values: unknown[]): arrow.Vector {
  return arrow.vectorFromArray(values as any[]);
}

/**
 * Check if data is an Arrow FixedSizeList DataType.
 * Uses duck-typing instead of `instanceof` to handle DuckDB's bundled Arrow version.
 *
 * @param data - object to check
 * @returns true if data is an Arrow FixedSizeList DataType (type guarded)
 */
export function isArrowFixedSizeList(data: any): data is arrow.FixedSizeList {
  return (
    typeof data === 'object' &&
    data !== null &&
    'typeId' in data &&
    'listSize' in data &&
    typeof data.listSize === 'number' &&
    'children' in data &&
    Array.isArray(data.children)
  );
}

/**
 * Check if data is an Arrow Struct DataType.
 * Uses duck-typing instead of `instanceof` to handle DuckDB's bundled Arrow version.
 *
 * @param data - object to check
 * @returns true if data is an Arrow Struct DataType (type guarded)
 */
export function isArrowStruct(data: any): data is arrow.Struct {
  return (
    typeof data === 'object' &&
    data !== null &&
    'typeId' in data &&
    'children' in data &&
    Array.isArray(data.children) &&
    !('listSize' in data)
  );
}

/**
 * @param dataContainer
 * @param sharedRow
 */
function* rowsIterator(dataContainer: DataContainerInterface, sharedRow: SharedRowOptions) {
  const numRows = dataContainer.numRows();
  for (let rowIndex = 0; rowIndex < numRows; ++rowIndex) {
    yield dataContainer.row(rowIndex, sharedRow);
  }
}

/**
 * @param dataContainer
 * @param columnIndex
 */
function* columnIterator(dataContainer: DataContainerInterface, columnIndex: number) {
  const numRows = dataContainer.numRows();
  for (let rowIndex = 0; rowIndex < numRows; ++rowIndex) {
    yield dataContainer.valueAt(rowIndex, columnIndex);
  }
}

const DEFAULT_MAX_ARROW_BATCHES = 1;

/**
 * Collapse Arrow record batches into as few chunks as possible.
 *
 * Deck.gl picking encodes at most 255 pickable leaf layers. Kepler creates one
 * Deck layer per Arrow record batch (and GeoJsonLayer adds fill/stroke/point
 * sublayers), so parquet/DuckDB tables with hundreds of batches make hover and
 * click miss most of the data. Combining chunks keeps picking under that cap
 * without changing row values.
 *
 * apache-arrow JS does not expose Vector.combineChunks in the version Kepler
 * uses, so we rebuild each column through a Builder (one chunk per column).
 *
 * Compaction only runs when `table.batches.length` is greater than
 * `maxArrowBatches` from {@link getApplicationConfig} (default `1`) or the
 * optional override. Progressive Arrow loading does not compact on each
 * incoming batch; {@link ArrowDataContainer.update} assigns new chunks as-is
 * and the completed file is compacted once.
 */
export function compactArrowTable(table: arrow.Table, maxArrowBatches?: number): arrow.Table {
  const batchLimit =
    maxArrowBatches ?? getApplicationConfig().maxArrowBatches ?? DEFAULT_MAX_ARROW_BATCHES;

  if (!table || !Array.isArray(table.batches) || table.batches.length <= 1) {
    return table;
  }

  if (table.batches.length <= batchLimit) {
    return table;
  }

  try {
    const columns: Record<string, arrow.Vector> = {};
    const columnNames: string[] = [];
    const seenNames = new Map<string, number>();
    for (let i = 0; i < table.numCols; i++) {
      const field = table.schema.fields[i];
      const column = table.getChildAt(i);
      if (!column) {
        continue;
      }
      // Arrow schemas may repeat field names; object keys would drop earlier columns.
      const seen = seenNames.get(field.name) ?? 0;
      seenNames.set(field.name, seen + 1);
      const key = seen === 0 ? field.name : `${field.name}_${seen}`;
      columns[key] = compactArrowVector(column, column.type || field.type);
      columnNames.push(key);
    }

    // Always build a kepler apache-arrow Table. Using `table.constructor` can
    // mix DuckDB's bundled Arrow Table with rebuilt vectors and drop schema
    // metadata (`geo`, ARROW:extension:name) that Kepler needs to create layers.
    const compacted = tableFromCompactedColumns(table, columns, columnNames);

    if (compacted?.batches?.length && compacted.batches.length < table.batches.length) {
      return compacted;
    }
  } catch {
    // Keep the original table if this Arrow build cannot combine chunks.
  }

  return table;
}

function copyArrowSchemaMetadata(from?: arrow.Schema | null, to?: arrow.Schema | null): void {
  if (!from || !to) {
    return;
  }

  const fromMeta = from.metadata as Map<string, string> | undefined;
  const toMeta = to.metadata as Map<string, string> | undefined;
  if (
    fromMeta &&
    toMeta &&
    typeof fromMeta.forEach === 'function' &&
    typeof toMeta.set === 'function'
  ) {
    fromMeta.forEach((value, key) => {
      toMeta.set(key, value);
    });
  }

  const fromByName = new Map((from.fields || []).map(field => [field.name, field]));
  (to.fields || []).forEach((toField, index) => {
    const fromField = from.fields?.[index] || fromByName.get(toField.name);
    const src = fromField?.metadata as Map<string, string> | undefined;
    const dst = toField?.metadata as Map<string, string> | undefined;
    if (!src || !dst || typeof src.forEach !== 'function' || typeof dst.set !== 'function') {
      return;
    }
    src.forEach((value, key) => {
      dst.set(key, value);
    });
  });
}

function tableFromCompactedColumns(
  source: arrow.Table,
  columns: Record<string, arrow.Vector>,
  columnNames: string[]
): arrow.Table {
  const ordered = new arrow.Table(columns).select(columnNames);
  let compacted: arrow.Table;
  try {
    compacted = new arrow.Table(
      source.schema,
      ordered.batches.map(batch => new arrow.RecordBatch(source.schema, batch.data))
    );
  } catch {
    compacted = ordered;
  }
  copyArrowSchemaMetadata(source.schema, compacted.schema);
  return compacted;
}

/**
 * Convert an Arrow cell from Vector.get() into a value makeBuilder.append accepts.
 * Nested GeoArrow (FixedSizeList / List) cells are Vectors, not arrays.
 */
function arrowCellToBuilderValue(value: unknown): unknown {
  if (value == null) {
    return null;
  }
  if (ArrayBuffer.isView(value)) {
    return Array.from(value as any);
  }

  const nested = value as {
    toArray?: () => ArrayLike<unknown>;
    numChildren?: number;
    get?: (index: number) => unknown;
    length?: number;
    isValid?: (index: number) => boolean;
  };

  // Primitive numeric child of a FixedSizeList (lng/lat).
  if (typeof nested.toArray === 'function' && nested.numChildren === 0) {
    return Array.from(nested.toArray());
  }

  if (typeof nested.get === 'function' && typeof nested.length === 'number') {
    const out: unknown[] = [];
    for (let i = 0; i < nested.length; i++) {
      const valid = typeof nested.isValid === 'function' ? nested.isValid(i) : true;
      out.push(valid ? arrowCellToBuilderValue(nested.get(i)) : null);
    }
    return out;
  }

  return value;
}

function compactArrowVector(
  column: arrow.Vector,
  type: arrow.DataType = column.type
): arrow.Vector {
  if (!column || !column.data || column.data.length <= 1) {
    return column;
  }

  const maybeCombine = (column as {combineChunks?: () => arrow.Vector}).combineChunks;
  if (typeof maybeCombine === 'function') {
    try {
      const combined = maybeCombine.call(column);
      if (combined?.data?.length <= 1) {
        return combined;
      }
    } catch {
      // fall through to Builder
    }
  }

  const builder = arrow.makeBuilder({type, nullValues: [null]});
  const length = column.length;
  for (let i = 0; i < length; i++) {
    const isValid =
      typeof (column as {isValid?: (index: number) => boolean}).isValid === 'function'
        ? (column as {isValid: (index: number) => boolean}).isValid(i)
        : true;
    // FixedSizeList/List .get() returns nested Vectors. Appending those
    // silently writes NaN (points) or throws (lines/polygons). Plain JS
    // arrays are what makeBuilder expects.
    builder.append(isValid ? arrowCellToBuilderValue(column.get(i)) : null);
  }
  const finished = builder.finish() as arrow.Vector | {toVector: () => arrow.Vector};
  if (finished instanceof arrow.Vector) {
    return finished;
  }
  if (typeof (finished as {toVector?: () => arrow.Vector}).toVector === 'function') {
    return (finished as {toVector: () => arrow.Vector}).toVector();
  }
  return column;
}

/**
 * Primitive (and dictionary-of-primitive) columns can be rebuilt from JS row
 * arrays via vectorFromArray. Nested, binary, and geoarrow columns cannot.
 */
function isSupportedArrowRowEditType(type: arrow.DataType): boolean {
  if (
    arrow.DataType.isUtf8(type) ||
    arrow.DataType.isNull(type) ||
    arrow.DataType.isInt(type) ||
    arrow.DataType.isFloat(type) ||
    arrow.DataType.isBool(type) ||
    arrow.DataType.isDate(type) ||
    arrow.DataType.isTimestamp(type) ||
    arrow.DataType.isTime(type)
  ) {
    return true;
  }
  if (arrow.DataType.isDictionary(type)) {
    const dictionary = (type as arrow.Dictionary).dictionary;
    return Boolean(dictionary && isSupportedArrowRowEditType(dictionary));
  }
  return false;
}

/** Reinterpret timestamp storage for builders without rounding through JS milliseconds. */
function rowEditStorageType(type: arrow.DataType): arrow.DataType {
  if (arrow.DataType.isTimestamp(type)) return new arrow.Int64();
  if (arrow.DataType.isDictionary(type)) {
    return new arrow.Dictionary(
      rowEditStorageType(type.dictionary),
      type.indices,
      type.id,
      type.isOrdered
    );
  }
  return type;
}

function rowEditStorageVector(column: arrow.Vector, type: arrow.DataType): arrow.Vector {
  if (column.type === type) return column;
  return new arrow.Vector(
    column.data.map(data => {
      const copy = data.clone(type);
      if (arrow.DataType.isDictionary(type) && data.dictionary) {
        copy.dictionary = rowEditStorageVector(data.dictionary, type.dictionary);
      }
      return copy;
    })
  );
}

function containsTimestamp(type: arrow.DataType): boolean {
  return (
    arrow.DataType.isTimestamp(type) ||
    (arrow.DataType.isDictionary(type) && containsTimestamp(type.dictionary)) ||
    Boolean(type.children?.some(field => containsTimestamp(field.type)))
  );
}

function checkRowEditDictionaryCapacity(column: arrow.Vector): void {
  if (!arrow.DataType.isDictionary(column.type)) return;
  const {indices} = column.type;
  const capacity = 2 ** (indices.bitWidth - (indices.isSigned ? 1 : 0));
  if (column.data.some(data => (data.dictionary?.length || 0) > capacity)) {
    throw new Error('Row edit exceeds the Arrow dictionary index capacity');
  }
}

/** Compact only edited snapshots; progressive loading and other rebuilds keep their behavior. */
function compactRowEditColumns(columns: arrow.Vector[]): arrow.Vector[] {
  const result = columns.slice();
  const dictionaries = new Map<number, number[]>();
  columns.forEach((column, i) => {
    if (containsTimestamp(column.type) && !isSupportedArrowRowEditType(column.type)) {
      // Nested builders decode timestamp children into JS milliseconds. Keep
      // exact slices, as normal compaction does for unsupported builders.
    } else if (arrow.DataType.isDictionary(column.type)) {
      const group = dictionaries.get(column.type.id) || [];
      group.push(i);
      dictionaries.set(column.type.id, group);
    } else {
      const type = rowEditStorageType(column.type);
      result[i] = rowEditStorageVector(
        compactArrowVector(rowEditStorageVector(column, type), type),
        column.type
      );
    }
  });
  for (const group of dictionaries.values()) {
    // Put narrow index types first so their entries fit before wider columns
    // add dictionary values. Build once using the widest group's index type.
    const capacity = (i: number) => {
      const {indices} = columns[i].type as arrow.Dictionary;
      return 2 ** (indices.bitWidth - (indices.isSigned ? 1 : 0));
    };
    group.sort((a, b) => capacity(a) - capacity(b));
    const type = columns[group[group.length - 1]].type as arrow.Dictionary;
    if (
      group.some(
        i => String((columns[i].type as arrow.Dictionary).dictionary) !== String(type.dictionary)
      )
    ) {
      throw new Error('Shared Arrow dictionary value types must match');
    }
    const storageType = rowEditStorageType(type);
    const combined = new arrow.Vector(
      group.flatMap(i => rowEditStorageVector(columns[i], storageType).data)
    );
    const compacted = compactArrowVector(combined, storageType);
    checkRowEditDictionaryCapacity(compacted);
    const restored = rowEditStorageVector(compacted, type);
    let offset = 0;
    for (const i of group) {
      const columnType = columns[i].type as arrow.Dictionary;
      const data = restored.slice(offset, offset + columns[i].length).data.map(chunk => {
        for (let index = 0; index < chunk.length; index++) {
          if (chunk.getValid(index) && Number(chunk.values[index]) >= capacity(i)) {
            throw new Error('Row edit exceeds the Arrow dictionary index capacity');
          }
        }
        const buffers = chunk.buffers;
        buffers[arrow.BufferType.DATA] = new columnType.indices.ArrayType(chunk.values);
        return chunk.clone(columnType, chunk.offset, chunk.length, chunk.nullCount, buffers);
      });
      result[i] = new arrow.Vector(data);
      offset += columns[i].length;
    }
  }
  return result;
}

/**
 * A data container where all data is stored in raw Arrow table
 */
export class ArrowDataContainer implements DataContainerInterface {
  _cols: arrow.Vector[];
  _numColumns: number;
  _numRows: number;
  _fields: ProtoDatasetField[];
  _numChunks: number;
  _geoArrowBinaryData: GeoArrowBinaryData;
  // cache column data to make valueAt() faster
  // _colData: any[][];

  /** An arrow table recreated from vectors */
  _arrowTable: arrow.Table;

  constructor(data: ArrowDataContainerInput) {
    if (!data.cols) {
      throw Error('ArrowDataContainer: no columns provided');
    }

    if (!Array.isArray(data.cols)) {
      throw Error("ArrowDataContainer: columns object isn't an array");
    }

    this._fields = data.fields || [];
    this._cols = data.cols;
    this._numColumns = this._cols.length;
    this._numRows = this._cols[0]?.length ?? 0;
    this._numChunks = this._cols[0]?.data?.length ?? 0;
    this._geoArrowBinaryData = data.geoArrowBinaryData || {};
    const table = compactArrowTable(data.arrowTable || this._createTable());
    this._arrowTable = table;
    if (table.numCols > 0) {
      this._assignTable(table);
    }
  }

  /**
   * Restores internal Arrow table from vectors.
   * TODO: consider using original arrow table, as it could contain extra metadata, not passed to the fields.
   */
  private _createTable() {
    const creaOpts = {};
    this._fields.map((field, index) => {
      creaOpts[field.name] = this._cols[index];
    });
    return new arrow.Table(creaOpts).select(this._fields.map(field => field.name));
  }

  getTable() {
    return this._arrowTable;
  }

  private _assignTable(table: arrow.Table) {
    this._arrowTable = table;
    this._cols = Array.from(
      {length: table.numCols},
      (_, i) => table.getChildAt(i) as arrow.Vector
    ).filter(col => col);
    this._numColumns = this._cols.length;
    this._numRows = this._cols[0]?.length ?? 0;
    this._numChunks = this._cols[0]?.data?.length ?? 0;
  }

  update(
    updateData: arrow.Vector<any>[] | arrow.Table,
    options: ArrowDataContainerUpdateOptions = {}
  ) {
    // Incremental Arrow loads append batches here. Compacting on every update
    // would copy the growing table (Builder over every cell). Skip collapse;
    // processArrowBatches compact once when the file is fully loaded.
    const previousNumChunks = this._numChunks;
    const isArrow = isArrowTable(updateData);
    if (isArrow) {
      this._assignTable(updateData);
    } else {
      this._cols = updateData;
      const table = this._createTable();
      if (table.numCols > 0) {
        this._assignTable(table);
      } else {
        this._numColumns = this._cols.length;
        this._numRows = this._cols[0]?.length ?? 0;
        this._numChunks = this._cols[0]?.data?.length ?? 0;
        this._arrowTable = table;
      }
    }

    // Progressive snapshots add one record batch at a time, so keep already
    // parsed chunks and merge the new worker result. A compaction/replacement
    // resets chunk numbering and must replace the cache instead.
    if (this._numChunks > previousNumChunks) {
      Object.entries(options.geoArrowBinaryData || {}).forEach(([columnIndex, chunks]) => {
        this._geoArrowBinaryData[Number(columnIndex)] = {
          ...this._geoArrowBinaryData[Number(columnIndex)],
          ...chunks
        };
      });
    } else {
      this._geoArrowBinaryData = options.geoArrowBinaryData || {};
    }

    // cache column data to make valueAt() faster
    // this._colData = this._cols.map(c => c.toArray());
  }

  /** Append typed rows atomically while retaining the container and prior snapshots. */
  append(rows: any[][]): boolean {
    if (!Array.isArray(rows)) return false;
    return this.replaceRows(new Map(), rows);
  }

  replace(index: number, row: any[]): boolean {
    return this.replaceRows(new Map([[index, row]]), []);
  }

  /** @internal Encode a complete edit batch before replacing any live columns. */
  replaceRows(replacements: Map<number, any[]>, appended: any[][]): boolean {
    for (const index of replacements.keys()) {
      if (!Number.isInteger(index) || index < 0 || index >= this._numRows) return false;
    }
    const incoming = this._columnsFromRows([...replacements.values(), ...appended]);
    if (!incoming) return false;
    const ordered = [...replacements.keys()]
      .map((index, incomingIndex) => ({index, incomingIndex}))
      .sort((a, b) => a.index - b.index);
    try {
      const columns = this._cols.map((column, i) => {
        const chunks: arrow.Data[] = [];
        let start = 0;
        for (const {index, incomingIndex} of ordered) {
          chunks.push(
            ...column.slice(start, index).data,
            ...incoming[i].slice(incomingIndex, incomingIndex + 1).data
          );
          start = index + 1;
        }
        chunks.push(...column.slice(start).data, ...incoming[i].slice(replacements.size).data);
        return new arrow.Vector(chunks);
      });
      this._commitColumns(columns);
      return true;
    } catch {
      return false;
    }
  }

  /** Delete unique valid indexes without decoding retained values. */
  remove(indexes: number[]): boolean {
    if (!Array.isArray(indexes) || !indexes.length) return false;
    if (indexes.some(index => !Number.isInteger(index) || index < 0 || index >= this._numRows))
      return false;
    const sorted = [...new Set(indexes)].sort((a, b) => a - b);
    try {
      const columns = this._cols.map(column => {
        const chunks: arrow.Data[] = [];
        let start = 0;
        for (const index of sorted) {
          if (start < index) chunks.push(...column.slice(start, index).data);
          start = index + 1;
        }
        if (start < this._numRows) chunks.push(...column.slice(start).data);
        return chunks.length ? new arrow.Vector(chunks) : column.slice(0, 0);
      });
      this._commitColumns(columns);
      return true;
    } catch {
      return false;
    }
  }

  private _commitColumns(columns: arrow.Vector[]): void {
    const {schema} = this._arrowTable;
    const compacted = compactRowEditColumns(columns);
    // Ordinal keys let Arrow align chunks without interpreting real column names.
    const ordered = new arrow.Table(Object.fromEntries(compacted.map((column, i) => [i, column])));
    const batches = ordered.batches.map(batch => {
      const result = new arrow.RecordBatch(schema, batch.data);
      // Arrow reconciles fields by name, even for positional input. Retain the
      // source fields when an external schema contains duplicate names.
      schema.fields.forEach((field, i) => {
        result.schema.fields[i] = field;
      });
      // Validate shared dictionary identities before publishing the snapshot.
      result.dictionaries;
      return result;
    });
    this._assignTable(new arrow.Table(schema, batches));
    this._geoArrowBinaryData = {};
  }

  private _columnsFromRows(rows: any[][]): arrow.Vector[] | null {
    const {fields} = this._arrowTable.schema;
    if (
      !rows.length ||
      !fields.length ||
      rows.some(row => !Array.isArray(row) || row.length !== fields.length)
    )
      return null;
    for (const field of fields) {
      if (
        field.metadata.get(GEOARROW_METADATA_KEY)?.startsWith('geoarrow') ||
        !isSupportedArrowRowEditType(field.type)
      ) {
        globalConsole.warn(
          `ArrowDataContainer: row edits do not support column "${field.name}" (${field.type})`
        );
        return null;
      }
    }
    try {
      return fields.map((field, i) => {
        const column = arrow.vectorFromArray(
          rows.map(row => row[i]),
          field.type
        );
        checkRowEditDictionaryCapacity(column);
        return column;
      });
    } catch {
      globalConsole.warn(
        'ArrowDataContainer: could not encode row edits using the existing column types'
      );
      return null;
    }
  }

  numChunks(): number {
    return this._numChunks;
  }

  getGeoArrowBinaryData(columnIndex: number, chunkIndex?: number) {
    const columnData = this._geoArrowBinaryData[columnIndex];
    if (!columnData) {
      return undefined;
    }
    if (chunkIndex !== undefined) {
      return columnData[chunkIndex];
    }

    const chunks = Object.entries(columnData)
      .map(([index, data]) => ({index: Number(index), data}))
      .sort((a, b) => a.index - b.index);
    if (chunks.length !== this._numChunks) {
      return undefined;
    }

    const featureTypes = {point: false, line: false, polygon: false};
    const bounds: [number, number, number, number] = [Infinity, Infinity, -Infinity, -Infinity];
    const binaryGeometries: any[] = [];
    const meanCenters: Array<number[] | null> = [];
    let hasMeanCenters = true;

    chunks.forEach(({data}) => {
      data.binaryGeometries.forEach(geometry => binaryGeometries.push(geometry));
      featureTypes.point ||= data.featureTypes.point;
      featureTypes.line ||= data.featureTypes.line;
      featureTypes.polygon ||= data.featureTypes.polygon;
      bounds[0] = Math.min(bounds[0], data.bounds[0]);
      bounds[1] = Math.min(bounds[1], data.bounds[1]);
      bounds[2] = Math.max(bounds[2], data.bounds[2]);
      bounds[3] = Math.max(bounds[3], data.bounds[3]);
      if (data.meanCenters) {
        data.meanCenters.forEach(center => meanCenters.push(center));
      } else {
        hasMeanCenters = false;
      }
    });

    return {
      binaryGeometries,
      featureTypes,
      bounds,
      ...(hasMeanCenters ? {meanCenters} : {})
    };
  }

  numRows(): number {
    return this._numRows;
  }

  numColumns(): number {
    return this._numColumns;
  }

  valueAt(rowIndex: number, columnIndex: number): any {
    // return this._colData[columnIndex][rowIndex];
    return this._cols[columnIndex].get(rowIndex);
  }

  row(rowIndex: number, sharedRow?: SharedRowOptions): DataRow {
    const tSharedRow = DataRow.createSharedRow(sharedRow);
    if (tSharedRow) {
      tSharedRow.setSource(this, rowIndex);
      return tSharedRow;
    }

    return new DataRow(this, rowIndex);
  }

  rowAsArray(rowIndex: number): any[] {
    // return this._colData.map(col => col[rowIndex]);
    return this._cols.map(col => col.get(rowIndex));
  }

  rows(sharedRow: SharedRowOptions) {
    const tSharedRow = DataRow.createSharedRow(sharedRow);
    return rowsIterator(this, tSharedRow);
  }

  column(columnIndex: number) {
    return columnIterator(this, columnIndex);
  }

  getColumn(columnIndex: number): arrow.Vector {
    return this._cols[columnIndex];
  }

  getField(columnIndex: number): ProtoDatasetField {
    return this._fields[columnIndex];
  }

  flattenData(): any[][] {
    const data: any[][] = [];
    for (let i = 0; i < this._numRows; ++i) {
      data.push(this.rowAsArray(i));
    }
    return data;
  }

  getPlainIndex(): number[] {
    return [...Array(this._numRows).keys()];
  }

  map<T>(
    func: (row: DataRow, index: number) => T,
    sharedRow?: SharedRowOptions,
    options: RangeOptions = {}
  ): T[] {
    const tSharedRow = DataRow.createSharedRow(sharedRow);

    const {start = 0, end = this.numRows()} = options;
    const endRow = Math.min(this.numRows(), end);

    const out: T[] = [];
    for (let rowIndex = start; rowIndex < endRow; ++rowIndex) {
      const row = this.row(rowIndex, tSharedRow);
      out.push(func(row, rowIndex));
    }
    return out;
  }

  mapIndex<T>(func: ({index}, dc: DataContainerInterface) => T, options: RangeOptions = {}): T[] {
    const {start = 0, end = this.numRows()} = options;
    const endRow = Math.min(this.numRows(), end);

    const out: T[] = [];
    for (let rowIndex = start; rowIndex < endRow; ++rowIndex) {
      out.push(func({index: rowIndex}, this));
    }
    return out;
  }

  find(
    func: (row: DataRow, index: number) => boolean,
    sharedRow?: SharedRowOptions
  ): DataRow | undefined {
    const tSharedRow = DataRow.createSharedRow(sharedRow);

    for (let rowIndex = 0; rowIndex < this._numRows; ++rowIndex) {
      const row = this.row(rowIndex, tSharedRow);
      if (func(row, rowIndex)) {
        return row;
      }
    }
    return undefined;
  }

  reduce<T>(
    func: (acc: T, row: DataRow, index: number) => T,
    initialValue: T,
    sharedRow?: SharedRowOptions
  ): T {
    const tSharedRow = DataRow.createSharedRow(sharedRow);

    for (let rowIndex = 0; rowIndex < this._numRows; ++rowIndex) {
      const row = this.row(rowIndex, tSharedRow);
      initialValue = func(initialValue, row, rowIndex);
    }
    return initialValue;
  }
}

/**
 * Convert arrow data type to kepler.gl field types
 *
 * @param arrowType the arrow data type
 * @returns corresponding type in `ALL_FIELD_TYPES`
 */
export function arrowDataTypeToFieldType(arrowType: arrow.DataType): string {
  // Note: this function doesn't return ALL_FIELD_TYPES.geojson or ALL_FIELD_TYPES.array, which
  // should be further detected by caller
  if (arrow.DataType.isDate(arrowType)) {
    return ALL_FIELD_TYPES.date;
  } else if (arrow.DataType.isTimestamp(arrowType) || arrow.DataType.isTime(arrowType)) {
    return ALL_FIELD_TYPES.timestamp;
  } else if (arrow.DataType.isFloat(arrowType)) {
    return ALL_FIELD_TYPES.real;
  } else if (arrow.DataType.isInt(arrowType)) {
    return ALL_FIELD_TYPES.integer;
  } else if (arrow.DataType.isBool(arrowType)) {
    return ALL_FIELD_TYPES.boolean;
  } else if (arrow.DataType.isUtf8(arrowType) || arrow.DataType.isNull(arrowType)) {
    return ALL_FIELD_TYPES.string;
  } else if (
    arrow.DataType.isBinary(arrowType) ||
    arrow.DataType.isDictionary(arrowType) ||
    arrow.DataType.isFixedSizeBinary(arrowType) ||
    arrow.DataType.isFixedSizeList(arrowType) ||
    arrow.DataType.isList(arrowType) ||
    arrow.DataType.isMap(arrowType) ||
    arrow.DataType.isStruct(arrowType)
  ) {
    return ALL_FIELD_TYPES.object;
  }
  globalConsole.warn(`Unsupported arrow type: ${arrowType}`);
  return ALL_FIELD_TYPES.string;
}

/**
 * Convert arrow data type to analyzer type
 *
 * @param arrowType the arrow data type
 * @returns corresponding type in `AnalyzerDATA_TYPES`
 */
export function arrowDataTypeToAnalyzerDataType(
  arrowType: arrow.DataType
): typeof AnalyzerDATA_TYPES {
  if (arrow.DataType.isDate(arrowType)) {
    return AnalyzerDATA_TYPES.DATE;
  } else if (arrow.DataType.isTimestamp(arrowType) || arrow.DataType.isTime(arrowType)) {
    return AnalyzerDATA_TYPES.DATETIME;
  } else if (arrow.DataType.isFloat(arrowType)) {
    return AnalyzerDATA_TYPES.FLOAT;
  } else if (arrow.DataType.isInt(arrowType)) {
    return AnalyzerDATA_TYPES.INT;
  } else if (arrow.DataType.isBool(arrowType)) {
    return AnalyzerDATA_TYPES.BOOLEAN;
  } else if (arrow.DataType.isUtf8(arrowType) || arrow.DataType.isNull(arrowType)) {
    return AnalyzerDATA_TYPES.STRING;
  } else if (
    arrow.DataType.isBinary(arrowType) ||
    arrow.DataType.isDictionary(arrowType) ||
    arrow.DataType.isFixedSizeBinary(arrowType) ||
    arrow.DataType.isFixedSizeList(arrowType) ||
    arrow.DataType.isList(arrowType) ||
    arrow.DataType.isMap(arrowType) ||
    arrow.DataType.isStruct(arrowType)
  ) {
    return AnalyzerDATA_TYPES.OBJECT;
  }
  globalConsole.warn(`Unsupported arrow type: ${arrowType}`);
  return AnalyzerDATA_TYPES.STRING;
}
