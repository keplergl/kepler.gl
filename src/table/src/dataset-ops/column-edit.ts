// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Field, ProtoDataset} from '@kepler.gl/types';
import {DataContainerInterface} from '@kepler.gl/utils';

export type ColumnEditDataset = {
  fields: Field[];
  dataContainer: DataContainerInterface;
};

export type ColumnEditPayload = {
  data: ProtoDataset['data'];
  renames: Record<string, string>;
};

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
    ...rest
  } = field;
  return {
    ...rest,
    name,
    id: name,
    displayName: name
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
