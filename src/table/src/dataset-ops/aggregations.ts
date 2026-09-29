// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {Field} from '@kepler.gl/types';
import {aggregate} from '@kepler.gl/utils';
import {notNullorUndefined} from '@kepler.gl/common-utils';

import {DATASET_OPS_AGGREGATIONS, DatasetOpAggregation} from './types';
import {mergeGeometries} from './geometry';

export const DATASET_OPS_AGGREGATION_OPTIONS: {id: DatasetOpAggregation; labelId: string}[] = [
  {id: DATASET_OPS_AGGREGATIONS.merge, labelId: 'datasetOps.aggregation.merge'},
  {id: DATASET_OPS_AGGREGATIONS.count, labelId: 'datasetOps.aggregation.count'},
  {id: DATASET_OPS_AGGREGATIONS.sum, labelId: 'datasetOps.aggregation.sum'},
  {id: DATASET_OPS_AGGREGATIONS.average, labelId: 'datasetOps.aggregation.average'},
  {id: DATASET_OPS_AGGREGATIONS.maximum, labelId: 'datasetOps.aggregation.maximum'},
  {id: DATASET_OPS_AGGREGATIONS.minimum, labelId: 'datasetOps.aggregation.minimum'},
  {id: DATASET_OPS_AGGREGATIONS.median, labelId: 'datasetOps.aggregation.median'},
  {id: DATASET_OPS_AGGREGATIONS.countUnique, labelId: 'datasetOps.aggregation.countUnique'}
];

const NUMERIC_FIELD_TYPES = new Set<string>([ALL_FIELD_TYPES.integer, ALL_FIELD_TYPES.real]);
const CATEGORICAL_FIELD_TYPES = new Set<string>([ALL_FIELD_TYPES.string, ALL_FIELD_TYPES.h3]);
const TIME_FIELD_TYPES = new Set<string>([ALL_FIELD_TYPES.timestamp, ALL_FIELD_TYPES.date]);

export function aggregationIdsForFieldType(type?: string): DatasetOpAggregation[] {
  if (type && NUMERIC_FIELD_TYPES.has(type)) {
    return [
      DATASET_OPS_AGGREGATIONS.count,
      DATASET_OPS_AGGREGATIONS.sum,
      DATASET_OPS_AGGREGATIONS.average,
      DATASET_OPS_AGGREGATIONS.maximum,
      DATASET_OPS_AGGREGATIONS.minimum,
      DATASET_OPS_AGGREGATIONS.median,
      DATASET_OPS_AGGREGATIONS.countUnique
    ];
  }
  if (type === ALL_FIELD_TYPES.boolean) {
    return [
      DATASET_OPS_AGGREGATIONS.count,
      DATASET_OPS_AGGREGATIONS.sum,
      DATASET_OPS_AGGREGATIONS.average,
      DATASET_OPS_AGGREGATIONS.countUnique
    ];
  }
  if (type && TIME_FIELD_TYPES.has(type)) {
    return [
      DATASET_OPS_AGGREGATIONS.count,
      DATASET_OPS_AGGREGATIONS.maximum,
      DATASET_OPS_AGGREGATIONS.minimum,
      DATASET_OPS_AGGREGATIONS.countUnique
    ];
  }
  if (type && CATEGORICAL_FIELD_TYPES.has(type)) {
    return [DATASET_OPS_AGGREGATIONS.count, DATASET_OPS_AGGREGATIONS.countUnique];
  }
  if (type === ALL_FIELD_TYPES.geojson || type === ALL_FIELD_TYPES.point) {
    return [
      DATASET_OPS_AGGREGATIONS.merge,
      DATASET_OPS_AGGREGATIONS.count,
      DATASET_OPS_AGGREGATIONS.countUnique
    ];
  }
  return [DATASET_OPS_AGGREGATIONS.count];
}

export function aggregationOptionsForField(field: {
  type?: string;
}): typeof DATASET_OPS_AGGREGATION_OPTIONS {
  const allowed = new Set(aggregationIdsForFieldType(field.type));
  return DATASET_OPS_AGGREGATION_OPTIONS.filter(option => allowed.has(option.id));
}

export function isDatasetOpsAggregationField(field: {type?: string}): boolean {
  return aggregationIdsForFieldType(field.type).length > 1;
}

export function defaultAggregationForField(field: Field): DatasetOpAggregation {
  const allowed = aggregationIdsForFieldType(field.type);
  if (field.type === ALL_FIELD_TYPES.integer || field.type === ALL_FIELD_TYPES.real) {
    return DATASET_OPS_AGGREGATIONS.average;
  }
  if (field.type === ALL_FIELD_TYPES.string || field.type === ALL_FIELD_TYPES.h3) {
    return DATASET_OPS_AGGREGATIONS.countUnique;
  }
  if (field.type === ALL_FIELD_TYPES.geojson || field.type === ALL_FIELD_TYPES.point) {
    return DATASET_OPS_AGGREGATIONS.merge;
  }
  return allowed[0];
}

export function defaultAggregationsForFields(
  fields: Field[],
  excludeNames: string[] = []
): Record<string, DatasetOpAggregation> {
  const excluded = new Set(excludeNames);
  const aggregations: Record<string, DatasetOpAggregation> = {};
  fields.forEach(field => {
    if (!excluded.has(field.name) && isDatasetOpsAggregationField(field)) {
      aggregations[field.name] = defaultAggregationForField(field);
    }
  });
  return aggregations;
}

export function aggregateValues(values: unknown[], technique: DatasetOpAggregation): unknown {
  if (technique === DATASET_OPS_AGGREGATIONS.merge) {
    return mergeGeometries(values);
  }
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
  if (technique === DATASET_OPS_AGGREGATIONS.merge) {
    return ALL_FIELD_TYPES.geojson;
  }
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
