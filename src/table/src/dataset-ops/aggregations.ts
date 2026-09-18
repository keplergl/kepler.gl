// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {Field} from '@kepler.gl/types';
import {aggregate} from '@kepler.gl/utils';
import {notNullorUndefined} from '@kepler.gl/common-utils';

import {DATASET_OPS_AGGREGATIONS, DatasetOpAggregation} from './types';

export const DATASET_OPS_AGGREGATION_OPTIONS: {id: DatasetOpAggregation; labelId: string}[] = [
  {id: DATASET_OPS_AGGREGATIONS.count, labelId: 'datasetOps.aggregation.count'},
  {id: DATASET_OPS_AGGREGATIONS.sum, labelId: 'datasetOps.aggregation.sum'},
  {id: DATASET_OPS_AGGREGATIONS.average, labelId: 'datasetOps.aggregation.average'},
  {id: DATASET_OPS_AGGREGATIONS.maximum, labelId: 'datasetOps.aggregation.maximum'},
  {id: DATASET_OPS_AGGREGATIONS.minimum, labelId: 'datasetOps.aggregation.minimum'},
  {id: DATASET_OPS_AGGREGATIONS.median, labelId: 'datasetOps.aggregation.median'},
  {id: DATASET_OPS_AGGREGATIONS.countUnique, labelId: 'datasetOps.aggregation.countUnique'}
];

export function defaultAggregationForField(field: Field): DatasetOpAggregation {
  if (field.type === ALL_FIELD_TYPES.integer || field.type === ALL_FIELD_TYPES.real) {
    return DATASET_OPS_AGGREGATIONS.average;
  }
  if (field.type === ALL_FIELD_TYPES.string) {
    return DATASET_OPS_AGGREGATIONS.countUnique;
  }
  return DATASET_OPS_AGGREGATIONS.count;
}

export function defaultAggregationsForFields(
  fields: Field[],
  excludeNames: string[] = []
): Record<string, DatasetOpAggregation> {
  const excluded = new Set(excludeNames);
  const aggregations: Record<string, DatasetOpAggregation> = {};
  fields.forEach(field => {
    if (!excluded.has(field.name)) {
      aggregations[field.name] = defaultAggregationForField(field);
    }
  });
  return aggregations;
}

export function aggregateValues(values: unknown[], technique: DatasetOpAggregation): unknown {
  const defined = values.filter(notNullorUndefined);
  if (technique === DATASET_OPS_AGGREGATIONS.count) {
    return values.length;
  }
  if (!defined.length) {
    return null;
  }
  return aggregate(defined, technique);
}

export function resultFieldType(technique: DatasetOpAggregation, sourceType?: string): string {
  if (
    technique === DATASET_OPS_AGGREGATIONS.count ||
    technique === DATASET_OPS_AGGREGATIONS.countUnique
  ) {
    return ALL_FIELD_TYPES.integer;
  }
  if (
    technique === DATASET_OPS_AGGREGATIONS.average ||
    technique === DATASET_OPS_AGGREGATIONS.median
  ) {
    return ALL_FIELD_TYPES.real;
  }
  return sourceType || ALL_FIELD_TYPES.real;
}
