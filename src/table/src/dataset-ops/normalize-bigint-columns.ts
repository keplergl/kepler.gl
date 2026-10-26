// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {ProtoDatasetField} from '@kepler.gl/types';
import {setRowBigIntColumns} from '@kepler.gl/utils';

// Runtime physical representation, preserved by field copies but omitted from
// saved schemas. Unlike Arrow Int64, JS BigInt storage has no 64-bit limit.
export const BIGINT_COLUMN = Symbol('bigintColumn');

/** Normalize newly built derived rows, never their source datasets. */
export function normalizeBigIntColumns(
  fields: ProtoDatasetField[],
  rows: any[][]
): ProtoDatasetField[] {
  const bigIntColumns: boolean[] = [];
  const normalizedFields = fields.map((field, column) => {
    const containsBigInt = rows.some(row => typeof row[column] === 'bigint');
    bigIntColumns.push(containsBigInt);
    if (
      (field.type !== ALL_FIELD_TYPES.integer && field.type !== ALL_FIELD_TYPES.real) ||
      !containsBigInt
    ) {
      return field;
    }

    for (const row of rows) {
      const value = row[column];
      // A BigInt column accepts exact safe integers (including -0 as 0n).
      // Fractions, unsafe Numbers and other incompatible values become missing.
      row[column] =
        typeof value === 'bigint'
          ? value
          : typeof value === 'number' && Number.isSafeInteger(value)
          ? BigInt(value)
          : null;
    }
    return {...field, [BIGINT_COLUMN]: true};
  });
  setRowBigIntColumns(rows, bigIntColumns);
  return normalizedFields;
}
