// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {generateHashId} from '@kepler.gl/common-utils';
import {ALL_FIELD_TYPES, GEOARROW_EXTENSIONS, GEOARROW_METADATA_KEY} from '@kepler.gl/constants';
import {Field, ProtoDataset} from '@kepler.gl/types';
import {FIELD_DISPLAY_FORMAT, isArrowVector} from '@kepler.gl/utils';

import {copyFieldAs, makeResultProtoDataset, uniqueColumnName} from './proto-dataset';
import {findFieldByName, rowCount, rowValue} from './table-helpers';
import {DatasetOpsTable, JoinDatasetConfig} from './types';

function joinKey(value: unknown): string | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  return String(value);
}

// Native coordinates need their encoding before they leave Arrow containers.
// WKB/WKT are already readable by the row geometry parsers.
const NATIVE_COORDINATE_DEPTH: Record<string, number> = {
  [GEOARROW_EXTENSIONS.POINT]: 0,
  [GEOARROW_EXTENSIONS.MULTIPOINT]: 1,
  [GEOARROW_EXTENSIONS.LINESTRING]: 1,
  [GEOARROW_EXTENSIONS.POLYGON]: 2,
  [GEOARROW_EXTENSIONS.MULTILINESTRING]: 2,
  [GEOARROW_EXTENSIONS.MULTIPOLYGON]: 3
};

function needsGeometryConversion(field: Field): boolean {
  if (field.type !== ALL_FIELD_TYPES.geoarrow) return false;
  const encoding = field.metadata?.get?.(GEOARROW_METADATA_KEY);
  return encoding !== GEOARROW_EXTENSIONS.WKB && encoding !== 'geoarrow.wkt';
}

function validNativeCoordinates(value: unknown, depth: number): boolean {
  if (!isArrowVector(value) || (depth === 0 && (value.length < 2 || value.length > 4))) {
    return false;
  }
  for (let i = 0; i < value.length; i++) {
    const child = value.get(i);
    if (
      depth === 0
        ? typeof child !== 'number' || !Number.isFinite(child)
        : !validNativeCoordinates(child, depth - 1)
    ) {
      return false;
    }
  }
  return true;
}

function copyJoinField(field: Field, name: string) {
  return needsGeometryConversion(field)
    ? {name, type: ALL_FIELD_TYPES.geojson, analyzerType: 'GEOMETRY_FROM_STRING'}
    : copyFieldAs(field, name);
}

export function joinDatasets(
  left: DatasetOpsTable,
  right: DatasetOpsTable,
  config: JoinDatasetConfig
): ProtoDataset {
  const leftField = findFieldByName(left.fields, config.leftField);
  const rightField = findFieldByName(right.fields, config.rightField);
  if (!leftField || !rightField) {
    throw new Error('Join key fields were not found on both datasets');
  }

  const leftColumnNames =
    config.leftColumns === undefined ? left.fields.map(f => f.name) : config.leftColumns;
  const rightColumnNames =
    config.rightColumns === undefined ? right.fields.map(f => f.name) : config.rightColumns;
  const leftColumns = leftColumnNames
    .map(name => findFieldByName(left.fields, name))
    .filter((field): field is NonNullable<typeof field> => Boolean(field));
  const rightColumns = rightColumnNames
    .map(name => findFieldByName(right.fields, name))
    .filter((field): field is NonNullable<typeof field> => Boolean(field));

  const usedNames = new Set<string>();
  const fields = [
    ...leftColumns.map(field => copyJoinField(field, uniqueColumnName(field.name, usedNames))),
    ...rightColumns.map(field =>
      copyJoinField(field, uniqueColumnName(`${right.label}_${field.name}`, usedNames))
    )
  ];

  const rightByKey = new Map<string, number[]>();
  const nRight = rowCount(right);
  for (let i = 0; i < nRight; i++) {
    const key = joinKey(rowValue(right, i, rightField));
    if (key === null) {
      continue;
    }
    const indexes = rightByKey.get(key);
    if (indexes) {
      indexes.push(i);
    } else {
      rightByKey.set(key, [i]);
    }
  }

  const matchedRight = new Set<number>();
  const rows: unknown[][] = [];
  const nLeft = rowCount(left);

  // Only visited geometry cells are cached, for this join invocation. Immutable
  // strings can be reused for duplicate matches without retaining source vectors.
  const geometryValues = new Map<DatasetOpsTable, Map<Field, Map<number, string | null>>>();
  const outputValue = (dataset: DatasetOpsTable, rowIndex: number, field: Field) => {
    if (!needsGeometryConversion(field)) {
      return rowValue(dataset, rowIndex, field);
    }
    let columns = geometryValues.get(dataset);
    if (!columns) {
      columns = new Map();
      geometryValues.set(dataset, columns);
    }
    let values = columns.get(field);
    if (!values) {
      values = new Map();
      columns.set(field, values);
    }
    if (values.has(rowIndex)) {
      return values.get(rowIndex);
    }
    const raw = rowValue(dataset, rowIndex, field);
    if (raw == null) {
      values.set(rowIndex, null);
      return null;
    }
    const encoding = field.metadata?.get?.(GEOARROW_METADATA_KEY);
    const depth = encoding ? NATIVE_COORDINATE_DEPTH[encoding] : undefined;
    // GeoArrow represents an empty Point with all-NaN coordinates. JSON would
    // turn those into null ordinates; keep it an empty Point instead.
    const emptyPoint =
      encoding === GEOARROW_EXTENSIONS.POINT &&
      isArrowVector(raw) &&
      raw.length >= 2 &&
      raw.length <= 4 &&
      Number.isNaN(raw.get(0)) &&
      Array.from(raw).every(Number.isNaN);
    if (depth === undefined || (!emptyPoint && !validNativeCoordinates(raw, depth))) {
      throw new Error(
        `Cannot join geometry column "${field.name}" at row ${
          rowIndex + 1
        }: unsupported or invalid native GeoArrow coordinates`
      );
    }
    const value = emptyPoint
      ? '{"type":"Point","coordinates":[]}'
      : FIELD_DISPLAY_FORMAT[ALL_FIELD_TYPES.geoarrow](raw, field);
    if (typeof value !== 'string' || value === 'null') {
      throw new Error(
        `Cannot join geometry column "${field.name}" at row ${
          rowIndex + 1
        }: native GeoArrow conversion failed`
      );
    }
    values.set(rowIndex, value);
    return value;
  };

  const leftValue = leftColumns.some(needsGeometryConversion) ? outputValue : rowValue;
  const rightValue = rightColumns.some(needsGeometryConversion) ? outputValue : rowValue;
  const pushRow = (leftIndex: number | null, rightIndex: number | null) => {
    const row: unknown[] = [];
    for (const field of leftColumns) {
      row.push(leftIndex === null ? null : leftValue(left, leftIndex, field));
    }
    for (const field of rightColumns) {
      row.push(rightIndex === null ? null : rightValue(right, rightIndex, field));
    }
    rows.push(row);
  };

  for (let i = 0; i < nLeft; i++) {
    const key = joinKey(rowValue(left, i, leftField));
    const matches = key === null ? undefined : rightByKey.get(key);
    if (!matches?.length) {
      if (config.type !== 'INNER') {
        pushRow(i, null);
      }
      continue;
    }
    for (const rightIndex of matches) {
      matchedRight.add(rightIndex);
      pushRow(i, rightIndex);
    }
  }

  if (config.type === 'FULL') {
    for (let i = 0; i < nRight; i++) {
      if (!matchedRight.has(i)) {
        pushRow(null, i);
      }
    }
  }

  return makeResultProtoDataset({
    source: left,
    extraSources: [right],
    type: 'join',
    operationId: config.operationId || generateHashId(6),
    label: config.label || `join-dataset-${config.resultId || generateHashId(6)}`,
    resultId: config.resultId,
    fields,
    rows
  });
}
