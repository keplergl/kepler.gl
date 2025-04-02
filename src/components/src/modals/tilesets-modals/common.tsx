// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {VectorTileMetadata, RasterTileMetadata} from '@kepler.gl/table';

export type DatasetCreationAttributes = {
  name: string;
  type: string;
  metadata: Record<string, any>;
};

export type MetaResponse = {
  metadata?: VectorTileMetadata | RasterTileMetadata | null;
  dataset?: DatasetCreationAttributes | null;
  loading?: boolean;
  error?: Error | null;
};

export const isPMTilesUrl = (url?: string | null) => url?.includes('.pmtiles');
