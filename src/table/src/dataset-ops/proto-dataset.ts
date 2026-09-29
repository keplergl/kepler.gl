// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {generateHashId} from '@kepler.gl/common-utils';
import {ProtoDataset, ProtoDatasetField} from '@kepler.gl/types';

import {DatasetOpsTable, DerivedDatasetMetadata} from './types';

export function uniqueColumnName(name: string, used: Set<string>): string {
  if (!used.has(name)) {
    used.add(name);
    return name;
  }
  let i = 1;
  let next = `${name}_${i}`;
  while (used.has(next)) {
    i += 1;
    next = `${name}_${i}`;
  }
  used.add(next);
  return next;
}

export function makeResultProtoDataset({
  source,
  extraSources = [],
  type,
  operationId,
  label,
  resultId,
  fields,
  rows
}: {
  source: DatasetOpsTable;
  extraSources?: DatasetOpsTable[];
  type: DerivedDatasetMetadata['type'];
  operationId: string;
  label: string;
  resultId?: string;
  fields: ProtoDatasetField[];
  rows: any[][];
}): ProtoDataset {
  const id = resultId || generateHashId(6);
  return {
    info: {
      id,
      label
    },
    data: {fields, rows},
    metadata: {
      derivedDataset: {
        type,
        sourceDataIds: [source.id, ...extraSources.map(table => table.id)],
        operationId
      }
    }
  };
}

export function copyFieldAs(
  field: {name: string; type: string; analyzerType?: string},
  name: string
): ProtoDatasetField {
  return {
    name,
    type: field.type,
    analyzerType: field.analyzerType || field.type || ALL_FIELD_TYPES.string
  };
}
