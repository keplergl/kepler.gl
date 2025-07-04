// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {WMSCapabilities} from '@loaders.gl/wms';

import type {VectorTileMetadata} from '@kepler.gl/table';
import type {StacTypes} from '@kepler.gl/types';

export type DatasetCreationAttributes = {
  name: string;
  type: string;
  metadata: Record<string, any>;
};

export type MetaResponse = {
  metadata?: VectorTileMetadata | StacTypes.CompleteSTACObject | WMSCapabilities | null;
  dataset?: DatasetCreationAttributes | null;
  loading?: boolean;
  error?: Error | null;
};
