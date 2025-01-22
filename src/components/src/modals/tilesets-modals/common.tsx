// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {VectorTileMetadata} from '@kepler.gl/table';

export type DatasetCreationAttributes = {
  name: string;
  type: string;
  metadata: Record<string, any>;
};

export type MetaResponse = {
  metadata?: VectorTileMetadata | null;
  dataset?: DatasetCreationAttributes | null;
  loading?: boolean;
  error?: Error | null;
};
