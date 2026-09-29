// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export * from './types';
export * from './aggregations';
export * from './geometry';
export * from './table-helpers';
export * from './group-by';
export * from './join';
export * from './spatial-join';
export {makeResultProtoDataset} from './proto-dataset';

import {groupByDataset} from './group-by';
import {joinDatasets} from './join';
import {spatialJoinDatasets} from './spatial-join';
import {DatasetOpsEngine} from './types';

export const inMemoryDatasetOpsEngine: DatasetOpsEngine = {
  groupByDataset,
  joinDatasets,
  spatialJoinDatasets
};
