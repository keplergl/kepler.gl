// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export enum DatasetType {
  LOCAL = 'local',
  VECTOR_TILE = 'vectorTile'
}

export enum VectorTileType {
  REMOTE = 'remote',
  PMTILES = 'pmtiles'
}

export type VectorTileDatasetMetadata = {
  type: VectorTileType.REMOTE;
  tilesetDataUrl: string;
  tilesetMetadataUrl?: string;
};
