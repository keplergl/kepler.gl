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

export type VectorTileDatasetMetadata = {
  type: 'remote';
  vectorTileType: VectorTileType;
  tilesetDataUrl: string;
  tilesetMetadataUrl?: string;
};
