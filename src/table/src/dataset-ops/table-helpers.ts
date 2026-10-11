// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {DatasetType} from '@kepler.gl/constants';
import {Field} from '@kepler.gl/types';

import {DatasetOpsTable} from './types';

const TABULAR_TYPES = new Set<string>([DatasetType.LOCAL, DatasetType.EXTERNALLY_HOSTED, '']);
// Remote tables are reloaded from their source URL, so a rename or delete would
// not survive refresh or the next map load.
const SCHEMA_MUTABLE_TYPES = new Set<string>([DatasetType.LOCAL, '']);

type DatasetOpTarget = {
  type?: string;
  disableDataOperation?: boolean;
} | null;

export function isTabularDatasetForOps(dataset?: DatasetOpTarget): boolean {
  if (!dataset || dataset.disableDataOperation) {
    return false;
  }
  const type = dataset.type ?? '';
  return TABULAR_TYPES.has(type);
}

export function canMutateDatasetSchema(dataset?: DatasetOpTarget): boolean {
  if (!isTabularDatasetForOps(dataset)) {
    return false;
  }
  return SCHEMA_MUTABLE_TYPES.has(dataset?.type ?? '');
}

export function findFieldByName(
  fields: Field[],
  name: string | null | undefined
): Field | undefined {
  if (!name) {
    return undefined;
  }
  return fields.find(field => field.name === name);
}

export function rowValue(dataset: DatasetOpsTable, rowIndex: number, field: Field): unknown {
  return dataset.dataContainer.valueAt(rowIndex, field.fieldIdx);
}

export function rowCount(dataset: DatasetOpsTable): number {
  return dataset.dataContainer.numRows();
}
