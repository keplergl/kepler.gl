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
  arrowSchema?: arrow.Schema;
  geoArrowBinaryData?: GeoArrowBinaryData;
};

type ArrowDataContainerUpdateOptions = {
  geoArrowBinaryData?: GeoArrowBinaryData;
  arrowSchema?: arrow.Schema;
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

/** Arrow visitors require local types, including when serializing DuckDB's Arrow data. */
function localArrowType(
  type: arrow.DataType,
  types: Map<arrow.DataType, arrow.DataType>
): arrow.DataType {
  if ((type as unknown) instanceof arrow.DataType) return type;
  const cached = types.get(type);
  if (cached) return cached;
  const local = cloneArrowType(type, types);
  types.set(type, local);
  return local;
}

function cloneArrowType(
  type: arrow.DataType,
  types: Map<arrow.DataType, arrow.DataType>
): arrow.DataType {
  const children = () =>
    type.children.map(
      field =>
        new arrow.Field(
          field.name,
          localArrowType(field.type, types),
          field.nullable,
          new Map(field.metadata)
        )
    );
  if (arrow.DataType.isNull(type)) return new arrow.Null();
  if (arrow.DataType.isInt(type)) return new arrow.Int(type.isSigned, type.bitWidth);
  if (arrow.DataType.isFloat(type)) return new arrow.Float(type.precision);
  if (arrow.DataType.isBinary(type)) return new arrow.Binary();
  if (arrow.DataType.isLargeBinary(type)) return new arrow.LargeBinary();
  if (arrow.DataType.isUtf8(type)) return new arrow.Utf8();
  if (arrow.DataType.isLargeUtf8(type)) return new arrow.LargeUtf8();
  if (arrow.DataType.isBool(type)) return new arrow.Bool();
  if (arrow.DataType.isDecimal(type))
    return new arrow.Decimal(type.scale, type.precision, type.bitWidth);
  if (arrow.DataType.isDate(type)) return new arrow.Date_(type.unit);
  if (arrow.DataType.isTime(type)) return new arrow.Time(type.unit, type.bitWidth);
  if (arrow.DataType.isTimestamp(type)) return new arrow.Timestamp(type.unit, type.timezone);
  if (arrow.DataType.isInterval(type)) return new arrow.Interval(type.unit);
  if (arrow.DataType.isDuration(type)) return new arrow.Duration(type.unit);
  if (arrow.DataType.isList(type)) return new arrow.List(children()[0]);
  if (arrow.DataType.isStruct(type)) return new arrow.Struct(children());
  if (arrow.DataType.isUnion(type)) return new arrow.Union(type.mode, type.typeIds, children());
  if (arrow.DataType.isFixedSizeBinary(type)) return new arrow.FixedSizeBinary(type.byteWidth);
  if (arrow.DataType.isFixedSizeList(type))
    return new arrow.FixedSizeList(type.listSize, children()[0]);
  if (arrow.DataType.isMap(type))
    return new arrow.Map_(children()[0] as (typeof type.children)[0], type.keysSorted);
  if (arrow.DataType.isDictionary(type))
    return new arrow.Dictionary(
      localArrowType(type.dictionary, types),
      localArrowType(type.indices, types) as typeof type.indices,
      type.id,
      type.isOrdered
    );
  throw new Error(`Unsupported Arrow type: ${type}`);
}

/** DuckDB can supply Data from a different Arrow build. Wrap it without copying buffers. */
function localArrowData(
  data: arrow.Data,
  types: Map<arrow.DataType, arrow.DataType>,
  chunks: Map<arrow.Data, arrow.Data>,
  dictionaries: Map<arrow.Vector, arrow.Vector>
): arrow.Data {
  if ((data as unknown) instanceof arrow.Data) return data;
  const cached = chunks.get(data);
  if (cached) return cached;
  const normalize = (child: arrow.Data) => localArrowData(child, types, chunks, dictionaries);
  let dictionary = data.dictionary && dictionaries.get(data.dictionary);
  if (data.dictionary && !dictionary) {
    dictionary = new arrow.Vector(data.dictionary.data.map(normalize));
    dictionaries.set(data.dictionary, dictionary);
  }
  const local = new arrow.Data(
    localArrowType(data.type, types),
    data.offset,
    data.length,
    data.nullCount,
    data.buffers,
    data.children.map(normalize),
    dictionary
  );
  chunks.set(data, local);
  return local;
}

/**
 * Rebuild a table by position, never by object keys: integer-like names must not
 * reorder columns. Chunk boundaries are aligned with Data slices (buffer views),
 * without reading cells or copying vectors. Short columns retain Arrow's null
 * padding behavior. Schema metadata is copied so callers can edit it independently.
 */
export function createArrowTable(
  columns: arrow.Vector[],
  fields: readonly {
    name: string;
    metadata?: Map<string, string> | Record<string, string>;
    nullable?: boolean;
  }[],
  sourceSchema?: arrow.Schema
): arrow.Table {
  const types = new Map<arrow.DataType, arrow.DataType>();
  const chunks = new Map<arrow.Data, arrow.Data>();
  const dictionaries = new Map<arrow.Vector, arrow.Vector>();
  const normalizeData = (data: arrow.Data) => localArrowData(data, types, chunks, dictionaries);
  const length = fields.reduce((max, _, i) => Math.max(max, columns[i].length), 0);
  const schema = new arrow.Schema(
    fields.map((field, i) => {
      const source = sourceSchema?.fields[i];
      const metadata = source?.metadata ?? field.metadata;
      return new arrow.Field(
        field.name,
        localArrowType(columns[i].type, types),
        columns[i].length < length || (source?.nullable ?? field.nullable ?? columns[i].nullable),
        new Map(metadata instanceof Map ? metadata : Object.entries(metadata ?? {}))
      );
    }),
    new Map(sourceSchema?.metadata)
  );
  const cursors = fields.map(() => ({chunk: 0, offset: 0}));
  const batches: arrow.RecordBatch[] = [];
  let row = 0;
  // Keep a typed record batch even for empty vectors (including dictionaries).
  do {
    let batchLength = length - row;
    const chunks = fields.map((_, i) => {
      const cursor = cursors[i];
      const data = columns[i].data;
      while (cursor.chunk < data.length && cursor.offset === data[cursor.chunk].length) {
        cursor.chunk++;
        cursor.offset = 0;
      }
      const chunk = data[cursor.chunk];
      if (chunk) batchLength = Math.min(batchLength, chunk.length - cursor.offset);
      return chunk;
    });
    const children = fields.map((_, i) => {
      const chunk = chunks[i];
      const cursor = cursors[i];
      if (!chunk) {
        return columns[i].data[0]?.length === 0 && batchLength === 0
          ? normalizeData(columns[i].data[0])
          : arrow.makeData({
              type: schema.fields[i].type,
              length: batchLength,
              nullCount: batchLength,
              nullBitmap: new Uint8Array(Math.ceil(batchLength / 64) * 8)
            });
      }
      const child =
        cursor.offset === 0 && batchLength === chunk.length
          ? chunk
          : chunk.slice(cursor.offset, batchLength);
      cursor.offset += batchLength;
      return normalizeData(child);
    });
    const batch = new arrow.RecordBatch(
      schema,
      arrow.makeData({
        type: new arrow.Struct(schema.fields),
        length: batchLength,
        nullCount: 0,
        children
      })
    );
    // Arrow 17 reconciles RecordBatch fields by name even with explicit Data.
    // Restore positional fields so duplicate names cannot merge types/metadata.
    schema.fields.forEach((field, i) => {
      batch.schema.fields[i] = field;
    });
    batches.push(batch);
    row += batchLength;
  } while (row < length);
  return new arrow.Table(schema, batches);
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
    const columns: arrow.Vector[] = [];
    const types = new Map<arrow.DataType, arrow.DataType>();
    for (let i = 0; i < table.numCols; i++) {
      const field = table.schema.fields[i];
      const column = table.getChildAt(i);
      if (!column) {
        return table;
      }
      columns.push(compactArrowVector(column, localArrowType(column.type || field.type, types)));
    }

    // Always build a kepler apache-arrow Table. Using `table.constructor` can
    // mix DuckDB's bundled Arrow Table with rebuilt vectors and drop schema
    // metadata (`geo`, ARROW:extension:name) that Kepler needs to create layers.
    const compacted = createArrowTable(columns, table.schema.fields, table.schema);

    // Independent builders can split a dictionary shared by multiple columns.
    // Keep the source if Arrow cannot serialize the rebuilt dictionary IDs.
    for (const batch of compacted.batches) {
      batch.dictionaries;
    }

    if (compacted?.batches?.length && compacted.batches.length < table.batches.length) {
      return compacted;
    }
  } catch {
    // Keep the original table if this Arrow build cannot combine chunks.
  }

  return table;
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
    const table = compactArrowTable(data.arrowTable || this._createTable(data.arrowSchema));
    this._arrowTable = table;
    if (table.numCols > 0) {
      this._assignTable(table);
    }
  }

  /**
   * Restores internal Arrow table from vectors.
   */
  private _createTable(schema = this._arrowTable?.schema) {
    return createArrowTable(this._cols, this._fields, schema);
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
      const table = this._createTable(options.arrowSchema);
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

  /**
   * Concat rows onto the Arrow table. Rejects the whole batch when any row is
   * the wrong width or a column type cannot be rebuilt from JS values
   * (nested, binary, geoarrow). Compacts after concat so batch count stays
   * under the hover/picking cap.
   */
  append(rows: any[][]): boolean {
    const extra = this._tableFromRows(rows, 'append');
    if (!extra) {
      return false;
    }
    try {
      this._commitColumns(this._cols.map((column, i) => column.concat(extra.getChildAt(i)!)));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Replace one row by slicing around it and concatenating a one-row table.
   * Same type restrictions as {@link append}.
   */
  replace(index: number, row: any[]): boolean {
    if (!Number.isInteger(index) || index < 0 || index >= this._numRows) {
      return false;
    }
    const extra = this._tableFromRows([row], 'replace');
    if (!extra) {
      return false;
    }
    try {
      this._commitColumns(
        this._cols.map((column, i) =>
          column.slice(0, index).concat(extra.getChildAt(i)!, column.slice(index + 1))
        )
      );
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Drop unique valid indexes by concatenating the kept slices. Works for any
   * Arrow type (including nested/geoarrow) because no JS values are rebuilt.
   * Any out-of-range or non-integer index rejects the whole call.
   */
  remove(indexes: number[]): boolean {
    if (!Array.isArray(indexes) || !indexes.length) {
      return false;
    }

    const numRows = this._numRows;
    const toRemove = new Set<number>();
    for (let i = 0; i < indexes.length; i++) {
      const index = indexes[i];
      if (!Number.isInteger(index) || index < 0 || index >= numRows) {
        return false;
      }
      toRemove.add(index);
    }

    if (toRemove.size === numRows) {
      this._commitColumns(this._cols.map(column => column.slice(0, 0)));
      return true;
    }

    try {
      const ranges: [number, number][] = [];
      let start = 0;
      const sorted = [...toRemove].sort((a, b) => a - b);
      for (let i = 0; i < sorted.length; i++) {
        const index = sorted[i];
        if (index > start) {
          ranges.push([start, index]);
        }
        start = index + 1;
      }
      if (start < numRows) {
        ranges.push([start, numRows]);
      }
      this._commitColumns(
        this._cols.map(column =>
          new arrow.Vector(ranges.flatMap(([begin, end]) => column.slice(begin, end).data))
        )
      );
      return true;
    } catch {
      return false;
    }
  }

  private _commitColumns(columns: arrow.Vector[]): void {
    const {schema} = this._arrowTable;
    this._assignTable(compactArrowTable(createArrowTable(columns, schema.fields, schema)));
    // Row edits change row and chunk offsets used by the worker geometry cache.
    this._geoArrowBinaryData = {};
  }

  private _unsupportedRowEditReason(): string | null {
    const fields = this._arrowTable?.schema?.fields || [];
    if (!fields.length) {
      return 'table has no columns';
    }
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const extension = field.metadata.get(GEOARROW_METADATA_KEY);
      if (typeof extension === 'string' && extension.startsWith('geoarrow')) {
        return `column "${field.name}" is geoarrow (${extension})`;
      }
      if (!isSupportedArrowRowEditType(field.type)) {
        return `column "${field.name}" has unsupported type ${field.type}`;
      }
    }
    return null;
  }

  /**
   * Build a same-schema table from JS rows, using each existing column's Arrow
   * type so dictionary/utf8/float concat does not coerce to nulls.
   */
  private _tableFromRows(rows: any[][], method: string): arrow.Table | null {
    if (!Array.isArray(rows) || !rows.length) {
      return null;
    }

    const numCols = this._arrowTable?.numCols || this._numColumns;
    if (!numCols) {
      return null;
    }
    for (let i = 0; i < rows.length; i++) {
      if (!Array.isArray(rows[i]) || rows[i].length !== numCols) {
        return null;
      }
    }

    const unsupported = this._unsupportedRowEditReason();
    if (unsupported) {
      globalConsole.warn(`ArrowDataContainer.${method}: ${unsupported}`);
      return null;
    }

    const columns: arrow.Vector[] = [];
    for (let i = 0; i < numCols; i++) {
      const field = this._arrowTable.schema.fields[i];
      const values = rows.map(row => row[i]);
      try {
        columns.push(arrow.vectorFromArray(values, field.type));
      } catch {
        globalConsole.warn(
          `ArrowDataContainer.${method}: could not encode column "${field.name}" as ${field.type}`
        );
        return null;
      }
    }

    try {
      return createArrowTable(columns, this._arrowTable.schema.fields, this._arrowTable.schema);
    } catch {
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
