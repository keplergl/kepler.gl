// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export enum DatasetType {
  LOCAL = 'local',
  VECTOR_TILE = 'vector-tile',
  RASTER_TILE = 'raster-tile',
  WMS_TILE = 'wms-tile'
}

export enum RemoteTileFormat {
  MVT = 'mvt',
  PMTILES = 'pmtiles',
  WMS = 'wms'
}

export enum PMTilesType {
  RASTER = 'raster',
  MVT = 'mvt'
}

export const REMOTE_TILE = 'remote';

export type VectorTileDatasetMetadata = {
  type: typeof REMOTE_TILE;
  remoteTileFormat: RemoteTileFormat;
  tilesetDataUrl: string;
  tilesetMetadataUrl?: string;
};

/**
 * Raster tileset metadata in STAC Item format. STAC version must be >= 1.0.0,
 * and the EO and Raster STAC extensions are required. This metadata shape can
 * be passed to the map to synchronously add a raster tileset.
 * @see https://github.com/radiantearth/stac-spec/blob/master/item-spec/item-spec.md
 */
export type RasterTileLocalMetadata = {
  type: 'Feature';

  /** URL for tileset metadata. */
  metadataUrl?: string;
  stac_version: string;
  stac_extensions: string[];
  assets: Record<string, any>;
};

/**
 * Raster tileset metadata with a remote metadata URL. This metadata can
 * be passed to the map to asynchronously load a raster tileset.
 */
export type RasterTileRemoteMetadata = {
  metadataUrl: string;
};

export enum RasterTileType {
  STAC = 'stac',
  PMTILES = 'pmtiles'
}

export type RasterTileMetadataSourceType = {
  pmtilesType?: PMTilesType;
};

/**
 * Raster tileset metadata.
 */
export type RasterTileDatasetMetadata = (RasterTileLocalMetadata | RasterTileRemoteMetadata) &
  RasterTileMetadataSourceType;
