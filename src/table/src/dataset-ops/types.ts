// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {AGGREGATION_TYPES} from '@kepler.gl/constants';
import {Field, ProtoDataset, RGBColor} from '@kepler.gl/types';
import {DataContainerInterface} from '@kepler.gl/utils';

export const DATASET_OPS_AGGREGATIONS = {
  count: AGGREGATION_TYPES.count,
  sum: AGGREGATION_TYPES.sum,
  average: AGGREGATION_TYPES.average,
  maximum: AGGREGATION_TYPES.maximum,
  minimum: AGGREGATION_TYPES.minimum,
  median: AGGREGATION_TYPES.median,
  countUnique: AGGREGATION_TYPES.countUnique,
  merge: 'merge'
} as const;

export type DatasetOpAggregation =
  (typeof DATASET_OPS_AGGREGATIONS)[keyof typeof DATASET_OPS_AGGREGATIONS];

export type DerivedDatasetType = 'groupBy' | 'join' | 'spatialJoin' | 'suitability';

export type DerivedDatasetMetadata = {
  type: DerivedDatasetType;
  sourceDataIds: string[];
  operationId: string;
};

export type DatasetOpsTable = {
  id: string;
  label: string;
  color: RGBColor;
  fields: Field[];
  dataContainer: DataContainerInterface;
  type?: string;
  disableDataOperation?: boolean;
  metadata?: Record<string, any>;
};

export type GroupByDatasetConfig = {
  fieldName: string;
  aggregations: Record<string, DatasetOpAggregation>;
  label?: string;
  resultId?: string;
  operationId?: string;
};

export type AttributeJoinType = 'LEFT' | 'INNER' | 'FULL';

export type JoinDatasetConfig = {
  leftField: string;
  rightField: string;
  type: AttributeJoinType;
  leftColumns?: string[];
  rightColumns?: string[];
  label?: string;
  resultId?: string;
  operationId?: string;
};

export type SpatialGeoSource =
  | {kind: 'geojson'; fieldName: string}
  | {kind: 'h3'; fieldName: string}
  | {kind: 'latlng'; latField: string; lngField: string};

export function fieldNamesForGeoSource(geo: SpatialGeoSource): string[] {
  return geo.kind === 'latlng' ? [geo.latField, geo.lngField] : [geo.fieldName];
}

export const SPATIAL_JOIN_PREDICATES = {
  intersects: 'intersects',
  equals: 'equals',
  crosses: 'crosses',
  overlaps: 'overlaps',
  within: 'within',
  touches: 'touches'
} as const;

export type SpatialJoinPredicate =
  (typeof SPATIAL_JOIN_PREDICATES)[keyof typeof SPATIAL_JOIN_PREDICATES];

export const SPATIAL_JOIN_PREDICATE_OPTIONS: {id: SpatialJoinPredicate; labelId: string}[] = [
  {id: 'intersects', labelId: 'datasetOps.predicateOption.intersects'},
  {id: 'equals', labelId: 'datasetOps.predicateOption.equals'},
  {id: 'crosses', labelId: 'datasetOps.predicateOption.crosses'},
  {id: 'overlaps', labelId: 'datasetOps.predicateOption.overlaps'},
  {id: 'within', labelId: 'datasetOps.predicateOption.within'},
  {id: 'touches', labelId: 'datasetOps.predicateOption.touches'}
];

export type SpatialJoinDatasetConfig = {
  leftGeo: SpatialGeoSource;
  rightGeo: SpatialGeoSource;
  aggregations: Record<string, DatasetOpAggregation>;
  leftColumns?: string[];
  predicate?: SpatialJoinPredicate;
  label?: string;
  resultId?: string;
  operationId?: string;
};

export type GroupByOp = {
  id: string;
  dataId: string;
  fieldName: string | null;
  aggregations: Record<string, DatasetOpAggregation>;
  resultId: string;
  resultLabel: string;
  isConfigActive: boolean;
  error?: string | null;
};

export type JoinImplementation = 'simple' | 'spatial';

export type JoinOp = {
  id: string;
  implementation: JoinImplementation;
  leftDataId: string;
  rightDataId: string | null;
  leftField: string | null;
  rightField: string | null;
  type: AttributeJoinType;
  leftColumns?: string[];
  rightColumns?: string[];
  leftGeo?: SpatialGeoSource | null;
  rightGeo?: SpatialGeoSource | null;
  predicate?: SpatialJoinPredicate;
  aggregations: Record<string, DatasetOpAggregation>;
  resultId: string;
  resultLabel: string;
  isConfigActive: boolean;
  error?: string | null;
};

export const WEIGHT_STANDARDIZATIONS = {
  raw: 'raw',
  normalize: 'normalize'
} as const;

export type WeightStandardization =
  (typeof WEIGHT_STANDARDIZATIONS)[keyof typeof WEIGHT_STANDARDIZATIONS];

export const WEIGHT_STANDARDIZATION_OPTIONS: {id: WeightStandardization; labelId: string}[] = [
  {id: 'normalize', labelId: 'datasetOps.weightStandardizationOption.normalize'},
  {id: 'raw', labelId: 'datasetOps.weightStandardizationOption.raw'}
];

export const DATA_STANDARDIZATIONS = {
  raw: 'raw',
  range: 'range',
  zScore: 'zScore'
} as const;

export type DataStandardization =
  (typeof DATA_STANDARDIZATIONS)[keyof typeof DATA_STANDARDIZATIONS];

export const DATA_STANDARDIZATION_OPTIONS: {id: DataStandardization; labelId: string}[] = [
  {id: 'range', labelId: 'datasetOps.dataStandardizationOption.range'},
  {id: 'zScore', labelId: 'datasetOps.dataStandardizationOption.zScore'},
  {id: 'raw', labelId: 'datasetOps.dataStandardizationOption.raw'}
];

export const DEFAULT_SUITABILITY_SCORE_FIELD = 'score';
export const DEFAULT_SUITABILITY_WEIGHT = 1;
export const SUITABILITY_WEIGHT_RANGE: [number, number] = [0, 1];

export type SuitabilityDatasetConfig = {
  /** Weight per source field name. Fields absent from this map are not scored. */
  weights: Record<string, number>;
  weightStandardization?: WeightStandardization;
  dataStandardization?: DataStandardization;
  outputFieldName?: string;
  columns?: string[];
  label?: string;
  resultId?: string;
  operationId?: string;
};

export type SuitabilityOp = {
  id: string;
  dataId: string;
  weights: Record<string, number>;
  weightStandardization: WeightStandardization;
  dataStandardization: DataStandardization;
  outputFieldName: string;
  columns?: string[];
  resultId: string;
  resultLabel: string;
  isConfigActive: boolean;
  error?: string | null;
};

export type DatasetOpsEngine = {
  groupByDataset: (dataset: DatasetOpsTable, config: GroupByDatasetConfig) => ProtoDataset;
  joinDatasets: (
    left: DatasetOpsTable,
    right: DatasetOpsTable,
    config: JoinDatasetConfig
  ) => ProtoDataset;
  spatialJoinDatasets: (
    left: DatasetOpsTable,
    right: DatasetOpsTable,
    config: SpatialJoinDatasetConfig
  ) => ProtoDataset;
  suitabilityDataset: (dataset: DatasetOpsTable, config: SuitabilityDatasetConfig) => ProtoDataset;
};
