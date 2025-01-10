// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export enum DatasetType {
  LOCAL = 'local',
  VECTOR_TILE = 'vectorTile'
}

export enum TileType {
  VECTOR_TILE = 'vectorTile'
}

export enum VectorTileType {
  MVT = 'mvt',
  PMTILES = 'pmtiles'
}

export type VectorTileDatasetMetadata = {
  type: VectorTileType;
  tilesetDataUrl: string;
  tilesetMetadataUrl?: string;
};
