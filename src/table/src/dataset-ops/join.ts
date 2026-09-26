// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {generateHashId} from '@kepler.gl/common-utils';
import {ProtoDataset} from '@kepler.gl/types';

import {copyFieldAs, makeResultProtoDataset, uniqueColumnName} from './proto-dataset';
import {findFieldByName, rowCount, rowValue} from './table-helpers';
import {DatasetOpsTable, JoinDatasetConfig} from './types';

function joinKey(value: unknown): string | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  return String(value);
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
    ...leftColumns.map(field => copyFieldAs(field, uniqueColumnName(field.name, usedNames))),
    ...rightColumns.map(field =>
      copyFieldAs(field, uniqueColumnName(`${right.label}_${field.name}`, usedNames))
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

  const pushRow = (leftIndex: number | null, rightIndex: number | null) => {
    const row: unknown[] = [];
    for (const field of leftColumns) {
      row.push(leftIndex === null ? null : rowValue(left, leftIndex, field));
    }
    for (const field of rightColumns) {
      row.push(rightIndex === null ? null : rowValue(right, rightIndex, field));
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
