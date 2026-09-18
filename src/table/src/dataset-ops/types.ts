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
  countUnique: AGGREGATION_TYPES.countUnique
} as const;

export type DatasetOpAggregation =
  (typeof DATASET_OPS_AGGREGATIONS)[keyof typeof DATASET_OPS_AGGREGATIONS];

export type DerivedDatasetType = 'groupBy' | 'join' | 'spatialJoin';

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

export type SpatialJoinDatasetConfig = {
  leftGeo: SpatialGeoSource;
  rightGeo: SpatialGeoSource;
  aggregations: Record<string, DatasetOpAggregation>;
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
  aggregations: Record<string, DatasetOpAggregation>;
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
};
