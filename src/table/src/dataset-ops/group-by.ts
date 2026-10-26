// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {generateHashId} from '@kepler.gl/common-utils';
import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {ProtoDataset} from '@kepler.gl/types';
import {timeToUnixMilli} from '@kepler.gl/utils';

import {aggregateValues, resultFieldType} from './aggregations';
import {copyFieldAs, makeResultProtoDataset, uniqueColumnName} from './proto-dataset';
import {findFieldByName, rowCount, rowValue} from './table-helpers';
import {DatasetOpsTable, GroupByDatasetConfig} from './types';

const NULL_GROUP_KEY = Symbol('dataset-ops-null-group');

function groupMapKey(key: unknown): string | symbol {
  return key === null || key === undefined ? NULL_GROUP_KEY : String(key);
}

export function groupByDataset(
  dataset: DatasetOpsTable,
  config: GroupByDatasetConfig
): ProtoDataset {
  const groupField = findFieldByName(dataset.fields, config.fieldName);
  if (!groupField) {
    throw new Error(`Group-by field "${config.fieldName}" was not found`);
  }

  const aggregationEntries = Object.entries(config.aggregations).filter(
    ([fieldName]) => fieldName !== groupField.name
  );
  const grouped = new Map<string | symbol, {key: unknown; indexes: number[]}>();
  const n = rowCount(dataset);

  for (let i = 0; i < n; i++) {
    const key = rowValue(dataset, i, groupField);
    const mapKey = groupMapKey(key);
    const existing = grouped.get(mapKey);
    if (existing) {
      existing.indexes.push(i);
    } else {
      grouped.set(mapKey, {key: key ?? null, indexes: [i]});
    }
  }

  const usedNames = new Set<string>();
  const fields = [copyFieldAs(groupField, uniqueColumnName(groupField.name, usedNames))];
  const aggMeta = aggregationEntries.map(([fieldName, technique]) => {
    const sourceField = findFieldByName(dataset.fields, fieldName);
    if (!sourceField) {
      throw new Error(`Aggregation field "${fieldName}" was not found`);
    }
    const name = uniqueColumnName(`${fieldName}_${technique}`, usedNames);
    const isTimeExtremum =
      (technique === 'minimum' || technique === 'maximum') &&
      (sourceField.type === ALL_FIELD_TYPES.timestamp || sourceField.type === ALL_FIELD_TYPES.date);
    fields.push({
      name,
      ...(isTimeExtremum ? {format: sourceField.format} : {}),
      type: resultFieldType(technique, sourceField.type),
      analyzerType:
        technique === 'count' || technique === 'countUnique'
          ? ALL_FIELD_TYPES.integer
          : sourceField.analyzerType || sourceField.type
    });
    return {sourceField, technique, isTimeExtremum};
  });

  const rows = Array.from(grouped.values()).map(({key, indexes}) => {
    const row: unknown[] = [key];
    for (const {sourceField, technique, isTimeExtremum} of aggMeta) {
      if (isTimeExtremum) {
        let selectedValue: unknown = null;
        let selectedTime: number | null = null;
        for (const index of indexes) {
          const value = rowValue(dataset, index, sourceField);
          const time = timeToUnixMilli(value as string | number | Date, sourceField.format || '');
          if (
            time !== null &&
            Number.isFinite(time) &&
            (selectedTime === null ||
              (technique === 'minimum' ? time < selectedTime : time > selectedTime))
          ) {
            // Compare normalized instants, preserving the first original value on ties.
            selectedValue = value;
            selectedTime = time;
          }
        }
        row.push(selectedValue);
        continue;
      }
      const values = indexes.map(index => rowValue(dataset, index, sourceField));
      row.push(aggregateValues(values, technique));
    }
    return row;
  });

  return makeResultProtoDataset({
    source: dataset,
    type: 'groupBy',
    operationId: config.operationId || generateHashId(6),
    label: config.label || `group-by-${config.resultId || generateHashId(6)}`,
    resultId: config.resultId,
    fields,
    rows
  });
}
