// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export enum DatasetType {
  LOCAL = 'local',
  VECTOR_TILE = 'vector-tile'
}

export enum VectorTileType {
  MVT = 'mvt',
  PMTILES = 'pmtiles'
}

export const REMOTE_TILE = 'remote';

export type VectorTileDatasetMetadata = {
  type: typeof REMOTE_TILE;
  vectorTileType: VectorTileType;
  tilesetDataUrl: string;
  tilesetMetadataUrl?: string;
};
