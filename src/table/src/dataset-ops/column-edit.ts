// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Analyzer, DATA_TYPES as AnalyzerDataTypes} from 'type-analyzer';
import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {Field, ProtoDataset} from '@kepler.gl/types';
import {createArrowVector, DataContainerInterface} from '@kepler.gl/utils';

export type ColumnEditDataset = {
  fields: Field[];
  dataContainer: DataContainerInterface;
};

export type ColumnEditPayload = {
  data: ProtoDataset['data'];
  renames: Record<string, string>;
};

export const EDITABLE_FIELD_TYPES = [
  ALL_FIELD_TYPES.integer,
  ALL_FIELD_TYPES.real,
  ALL_FIELD_TYPES.string,
  ALL_FIELD_TYPES.timestamp
] as const;

export type EditableFieldType = (typeof EDITABLE_FIELD_TYPES)[number];

const EDITABLE_TARGET_TYPES: Record<EditableFieldType, readonly EditableFieldType[]> = {
  [ALL_FIELD_TYPES.integer]: [ALL_FIELD_TYPES.string, ALL_FIELD_TYPES.timestamp],
  [ALL_FIELD_TYPES.real]: [ALL_FIELD_TYPES.string, ALL_FIELD_TYPES.timestamp],
  [ALL_FIELD_TYPES.string]: [
    ALL_FIELD_TYPES.integer,
    ALL_FIELD_TYPES.real,
    ALL_FIELD_TYPES.timestamp
  ],
  [ALL_FIELD_TYPES.timestamp]: [ALL_FIELD_TYPES.integer, ALL_FIELD_TYPES.string]
};

function isEditableFieldType(type: string): type is EditableFieldType {
  return (EDITABLE_FIELD_TYPES as readonly string[]).includes(type);
}

export type ColumnTypeConversionError = {
  rowIndex: number;
  value: unknown;
  reason: string;
};

export type ChangeColumnTypeResult =
  | {payload: ColumnEditPayload; error?: never}
  | {payload?: never; error: ColumnTypeConversionError};

function columnValuePreview(value: unknown): string {
  let preview: string;
  try {
    preview = typeof value === 'string' ? value : JSON.stringify(value);
  } catch {
    preview = String(value);
  }
  if (preview === undefined) {
    preview = String(value);
  }
  return preview.length > 80 ? `${preview.slice(0, 77)}...` : preview;
}

export function formatColumnTypeConversionError(error: ColumnTypeConversionError): string {
  return `row ${error.rowIndex + 1} value “${columnValuePreview(error.value)}” ${error.reason}`;
}

const DECIMAL_NUMBER = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i;
const INTEGER = /^[+-]?\d+$/;
const MIN_ABSOLUTE_EPOCH = 100_000_000;
const MILLISECOND_EPOCH_THRESHOLD = 100_000_000_000;
const MAX_ABSOLUTE_EPOCH_MILLISECONDS = 9_999_999_999_999;

const ANALYZER_TYPE_BY_FIELD_TYPE: Record<string, string> = {
  [ALL_FIELD_TYPES.integer]: AnalyzerDataTypes.INT,
  [ALL_FIELD_TYPES.real]: AnalyzerDataTypes.FLOAT,
  [ALL_FIELD_TYPES.string]: AnalyzerDataTypes.STRING,
  [ALL_FIELD_TYPES.timestamp]: AnalyzerDataTypes.DATETIME
};

function analyzerMetadata(value: unknown): {type: string; format: string} | null {
  const metadata = Analyzer.computeColMeta([{value}])?.[0];
  return metadata ? {type: metadata.type, format: metadata.format || ''} : null;
}

type ColumnConversionState = {
  analyzerType: string;
  format: string;
};

function conversionState(type: EditableFieldType): ColumnConversionState {
  return {
    analyzerType: type === ALL_FIELD_TYPES.timestamp ? '' : ANALYZER_TYPE_BY_FIELD_TYPE[type],
    format: ''
  };
}

function numericValue(value: unknown, integerOnly: boolean): number {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'bigint') {
    return Number(value);
  }
  if (typeof value !== 'string') {
    return Number.NaN;
  }
  const trimmed = value.trim();
  if (!(integerOnly ? INTEGER : DECIMAL_NUMBER).test(trimmed)) {
    return Number.NaN;
  }
  return Number(trimmed);
}

function exactIntegerFromDecimal(value: string): bigint | null {
  const trimmed = value.trim().toLowerCase();
  if (!DECIMAL_NUMBER.test(trimmed)) {
    return null;
  }

  const unsigned = trimmed.replace(/^[+-]/, '');
  const [mantissa, exponentString] = unsigned.split('e');
  const [whole, fraction = ''] = mantissa.split('.');
  const digits = `${whole || '0'}${fraction}`;
  if (BigInt(digits) === 0n) {
    return 0n;
  }
  const exponent = exponentString ? Number(exponentString) : 0;
  if (!Number.isSafeInteger(exponent)) {
    return null;
  }

  const decimalPlaces = fraction.length - exponent;
  let integerDigits: string;
  if (decimalPlaces <= 0) {
    integerDigits = `${digits}${'0'.repeat(-decimalPlaces)}`;
  } else {
    const fractionalTail = digits.slice(-decimalPlaces);
    if (decimalPlaces >= digits.length || /[1-9]/.test(fractionalTail)) {
      return null;
    }
    integerDigits = digits.slice(0, -decimalPlaces);
  }
  const integer = BigInt(integerDigits);
  return trimmed.startsWith('-') ? -integer : integer;
}

function losesIntegerPrecision(value: unknown, parsed: number): boolean {
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
    return false;
  }
  if (typeof value === 'bigint') {
    return BigInt(parsed) !== value;
  }
  if (typeof value === 'string') {
    const exactInteger = exactIntegerFromDecimal(value);
    return exactInteger !== null && BigInt(parsed) !== exactInteger;
  }
  return false;
}

function convertColumnValue(
  value: unknown,
  type: EditableFieldType,
  rowIndex: number,
  state: ColumnConversionState,
  output?: unknown[]
): ColumnTypeConversionError | null {
  if (value === null || value === undefined) {
    output?.push(null);
    return null;
  }

  switch (type) {
    case ALL_FIELD_TYPES.string: {
      try {
        const serialized =
          value instanceof Date
            ? value.toISOString()
            : typeof value === 'object'
            ? JSON.stringify(value)
            : String(value);
        output?.push(serialized ?? String(value));
        return null;
      } catch {
        return {rowIndex, value, reason: 'cannot be serialized as a string'};
      }
    }
    case ALL_FIELD_TYPES.integer:
    case ALL_FIELD_TYPES.real: {
      const integerOnly = type === ALL_FIELD_TYPES.integer;
      const parsed = numericValue(value, integerOnly);
      if (integerOnly ? !Number.isSafeInteger(parsed) : !Number.isFinite(parsed)) {
        return {
          rowIndex,
          value,
          reason: integerOnly ? 'is not a safe integer' : 'is not a finite number'
        };
      }
      if (!integerOnly && losesIntegerPrecision(value, parsed)) {
        return {rowIndex, value, reason: 'loses integer precision as a real number'};
      }
      output?.push(parsed);
      return null;
    }
    case ALL_FIELD_TYPES.timestamp: {
      const source = value instanceof Date ? value.toISOString() : value;
      const isNumeric =
        typeof source === 'number' ||
        typeof source === 'bigint' ||
        (typeof source === 'string' && DECIMAL_NUMBER.test(source.trim()));
      if (isNumeric) {
        const parsed = numericValue(source, false);
        const numericFormat = Math.abs(parsed) >= MILLISECOND_EPOCH_THRESHOLD ? 'X' : 'x';
        const milliseconds = numericFormat === 'x' ? parsed * 1000 : parsed;
        if (
          !Number.isFinite(parsed) ||
          Math.abs(parsed) < MIN_ABSOLUTE_EPOCH ||
          Math.abs(milliseconds) > MAX_ABSOLUTE_EPOCH_MILLISECONDS
        ) {
          return {rowIndex, value, reason: 'is not a plausible epoch timestamp'};
        }
        if (state.format && state.format !== numericFormat) {
          return {rowIndex, value, reason: 'uses a different timestamp format'};
        }
        state.analyzerType = AnalyzerDataTypes.TIME;
        state.format = numericFormat;
        output?.push(parsed);
        return null;
      }

      if (typeof source !== 'string') {
        return {rowIndex, value, reason: 'is not a timestamp'};
      }
      const metadata = analyzerMetadata(source);
      if (
        !metadata ||
        ![AnalyzerDataTypes.TIME, AnalyzerDataTypes.DATETIME].includes(metadata.type)
      ) {
        return {rowIndex, value, reason: 'is not a valid timestamp'};
      }
      if (
        (state.format && state.format !== metadata.format) ||
        (state.analyzerType && state.analyzerType !== metadata.type)
      ) {
        return {rowIndex, value, reason: 'uses a different timestamp format'};
      }
      state.analyzerType = metadata.type;
      state.format = metadata.format;
      output?.push(source);
      return null;
    }
    default:
      return {rowIndex, value, reason: `cannot be converted to ${type}`};
  }
}

/** Validate every candidate in one pass without allocating converted columns. */
export function getCompatibleColumnTypes(
  dataContainer: DataContainerInterface,
  fieldIndex: number,
  currentType: string
): EditableFieldType[] {
  if (
    fieldIndex < 0 ||
    fieldIndex >= dataContainer.numColumns() ||
    !isEditableFieldType(currentType)
  ) {
    return [];
  }

  const candidates = new Map<EditableFieldType, ColumnConversionState>();
  for (const type of EDITABLE_TARGET_TYPES[currentType]) {
    candidates.set(type, conversionState(type));
  }

  const rowCount = dataContainer.numRows();
  for (let rowIndex = 0; rowIndex < rowCount && candidates.size; rowIndex++) {
    const value = dataContainer.valueAt(rowIndex, fieldIndex);
    for (const [type, state] of candidates) {
      if (convertColumnValue(value, type, rowIndex, state)) {
        candidates.delete(type);
      }
    }
  }

  return EDITABLE_FIELD_TYPES.filter(type => type === currentType || candidates.has(type));
}

/**
 * Field descriptor for `updateDataset`, with accessors and per-column stats
 * stripped so the table rebuilds them against the new container.
 */
export function schemaField(field: Field, name: string): ProtoDataset['data']['fields'][number] {
  const {
    valueAccessor: _valueAccessor,
    fieldIdx: _fieldIdx,
    filterProps: _filterProps,
    isLoadingStats: _isLoadingStats,
    columnStatsRequestId: _columnStatsRequestId,
    ...rest
  } = field;
  return {
    ...rest,
    name,
    id: name,
    // A rename replaces the visible label. Other columns keep theirs.
    displayName: name === field.name ? field.displayName || name : name
  };
}

/**
 * Project a dataset down to `columns`, preserving Arrow vectors when the
 * container exposes them so a rename does not round-trip typed columns
 * through plain rows.
 */
export function projectDatasetColumns(
  dataset: ColumnEditDataset,
  columns: {sourceIndex: number; name: string}[]
): ProtoDataset['data'] {
  const fields = columns.map(({sourceIndex, name}) =>
    schemaField(dataset.fields[sourceIndex], name)
  );
  const dataContainer = dataset.dataContainer;
  if (typeof dataContainer.getColumn === 'function' && dataContainer.numRows() > 0) {
    const cols = columns.map(({sourceIndex}) => dataContainer.getColumn?.(sourceIndex));
    if (cols.length && cols.every(Boolean)) {
      return {fields, rows: [], cols};
    }
  }

  const rowCount = dataContainer.numRows();
  const rows: unknown[][] = new Array(rowCount);
  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    const source = dataContainer.rowAsArray(rowIndex);
    rows[rowIndex] = columns.map(({sourceIndex}) => source[sourceIndex]);
  }
  return {fields, rows};
}

export function buildRenameColumnData(
  dataset: ColumnEditDataset,
  fieldName: string,
  newName: string
): ColumnEditPayload | null {
  const nextName = newName.trim();
  if (!nextName || nextName === fieldName) {
    return null;
  }
  const sourceIndex = dataset.fields.findIndex(field => field.name === fieldName);
  if (sourceIndex < 0) {
    return null;
  }
  if (dataset.fields.some(field => field.name === nextName)) {
    return null;
  }

  const columns = dataset.fields.map((field, index) => ({
    sourceIndex: index,
    name: field.name === fieldName ? nextName : field.name
  }));
  return {
    data: projectDatasetColumns(dataset, columns),
    renames: {[fieldName]: nextName}
  };
}

export function buildDeleteColumnData(
  dataset: ColumnEditDataset,
  fieldName: string
): ColumnEditPayload | null {
  const sourceIndex = dataset.fields.findIndex(field => field.name === fieldName);
  if (sourceIndex < 0 || dataset.fields.length < 2) {
    return null;
  }
  const columns = dataset.fields.flatMap((field, index) =>
    field.name === fieldName ? [] : [{sourceIndex: index, name: field.name}]
  );
  return {
    data: projectDatasetColumns(dataset, columns),
    renames: {}
  };
}

/**
 * Convert an entire column before returning an update payload. A failed value
 * returns its row and leaves the source dataset untouched.
 */
export function buildChangeColumnTypeData(
  dataset: ColumnEditDataset,
  fieldName: string,
  newType: string
): ChangeColumnTypeResult | null {
  if (!isEditableFieldType(newType)) {
    return null;
  }
  const fieldIndex = dataset.fields.findIndex(field => field.name === fieldName);
  const currentType = dataset.fields[fieldIndex]?.type;
  if (
    fieldIndex < 0 ||
    !isEditableFieldType(currentType) ||
    !EDITABLE_TARGET_TYPES[currentType].includes(newType)
  ) {
    return null;
  }

  const state = conversionState(newType);
  const values: unknown[] = [];
  const rowCount = dataset.dataContainer.numRows();
  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    const error = convertColumnValue(
      dataset.dataContainer.valueAt(rowIndex, fieldIndex),
      newType,
      rowIndex,
      state,
      values
    );
    if (error) {
      return {error};
    }
  }

  const fields = dataset.fields.map((field, index) => {
    if (index !== fieldIndex) {
      return schemaField(field, field.name);
    }
    const {
      displayFormat: _displayFormat,
      indexBy: _indexBy,
      ...fieldWithoutTypeSpecificMetadata
    } = field;
    return {
      ...schemaField(fieldWithoutTypeSpecificMetadata, field.name),
      type: newType,
      analyzerType: state.analyzerType || ANALYZER_TYPE_BY_FIELD_TYPE[newType],
      format: state.format
    };
  });

  if (typeof dataset.dataContainer.getColumn === 'function') {
    const cols = dataset.fields.map((_, index) => dataset.dataContainer.getColumn?.(index));
    if (cols.every(Boolean)) {
      cols[fieldIndex] = createArrowVector(values);
      return {payload: {data: {fields, rows: [], cols}, renames: {}}};
    }
  }

  const rows: unknown[][] = new Array(rowCount);
  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    const row = Array.from(dataset.dataContainer.rowAsArray(rowIndex));
    row[fieldIndex] = values[rowIndex];
    rows[rowIndex] = row;
  }

  return {payload: {data: {fields, rows}, renames: {}}};
}
