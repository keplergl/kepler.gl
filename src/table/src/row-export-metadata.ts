// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ProtoDataset} from '@kepler.gl/types';
import {RowDataContainer} from '@kepler.gl/utils';

// Transport only: table-owned runtime hints never enter the saved schema.
export const ROW_EXPORT_METADATA = Symbol('rowExportMetadata');
export type RowExportMetadata = {
  rows: any[][];
  revision: number;
  columns: readonly (boolean | undefined)[];
};
export type RowExportData = ProtoDataset['data'] & {
  [ROW_EXPORT_METADATA]?: RowExportMetadata;
};

export function withRowExportMetadata(
  data: ProtoDataset['data'],
  columns?: readonly (boolean | undefined)[]
): RowExportData {
  if (!columns || data.cols) return data;
  const revision = RowDataContainer.getSnapshotRevision(data.rows);
  if (revision === undefined) return data;
  const checkedColumns = Array.from(columns);
  // Rows may be wider than the schema. Those extra cells remain unknown.
  for (const row of data.rows) {
    while (row && checkedColumns.length < row.length) checkedColumns.push(undefined);
  }
  return {
    ...data,
    [ROW_EXPORT_METADATA]: {rows: data.rows, revision, columns: checkedColumns}
  };
}

export function getRowExportMetadata(data: RowExportData): RowExportMetadata | undefined {
  const hints = data[ROW_EXPORT_METADATA];
  return hints &&
    !data.cols &&
    hints.rows === data.rows &&
    hints.revision === RowDataContainer.getSnapshotRevision(data.rows)
    ? hints
    : undefined;
}
