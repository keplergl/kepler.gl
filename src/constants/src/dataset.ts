// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export enum DatasetType {
  LOCAL = 'local',
  EXTERNALLY_HOSTED = 'externally-hosted',
  VECTOR_TILE = 'vector-tile',
  RASTER_TILE = 'raster-tile',
  WMS_TILE = 'wms-tile',
  TILE_3D = 'tile-3d',
  BITMAP = 'bitmap'
}

export const REMOTE_FILE_FORMATS = ['auto', 'csv', 'geojson', 'json', 'arrow', 'parquet'] as const;
export type RemoteFileFormat = (typeof REMOTE_FILE_FORMATS)[number];

export const REMOTE_FILE_MIME_TYPES: Record<Exclude<RemoteFileFormat, 'auto'>, string> = {
  csv: 'text/csv',
  geojson: 'application/geo+json',
  json: 'application/json',
  arrow: 'application/vnd.apache.arrow.file',
  parquet: 'application/vnd.apache.parquet'
};

export const REMOTE_FILE_EXTENSIONS: Record<Exclude<RemoteFileFormat, 'auto'>, string> = {
  csv: 'csv',
  geojson: 'geojson',
  json: 'json',
  arrow: 'arrow',
  parquet: 'parquet'
};

export const MIME_TO_REMOTE_FILE_EXTENSION: Record<string, string> = {
  'text/csv': 'csv',
  'text/tab-separated-values': 'tsv',
  'application/geo+json': 'geojson',
  'application/vnd.geo+json': 'geojson',
  'application/json': 'json',
  'application/vnd.apache.arrow.file': 'arrow',
  'application/vnd.apache.arrow.stream': 'arrow',
  'application/vnd.apache.parquet': 'parquet',
  'application/x-parquet': 'parquet'
};

export const DATASET_REFRESH_INTERVAL_OPTIONS: {value: number; labelId: string}[] = [
  {value: 0, labelId: 'datasetTitle.refreshOff'},
  {value: 10_000, labelId: 'datasetTitle.refresh10s'},
  {value: 15_000, labelId: 'datasetTitle.refresh15s'},
  {value: 60_000, labelId: 'datasetTitle.refresh1m'},
  {value: 300_000, labelId: 'datasetTitle.refresh5m'},
  {value: 900_000, labelId: 'datasetTitle.refresh15m'}
];

export type ExternalDatasetRefreshStatus = 'idle' | 'loading' | 'error';

export type ExternalDatasetMetadata = {
  /** Remote URL of the dataset file. */
  source: string;
  /** Optional format hint for extensionless URLs (SAS keys, etc). */
  format?: Exclude<RemoteFileFormat, 'auto'> | string;
  /** Last known size of the hosted resource, in bytes. */
  size?: number;
  /** Poll interval in ms. Omitted or 0 means manual refresh only. */
  refreshIntervalMs?: number;
};

/** Runtime copy of {@link ExternalDatasetMetadata} with `format` renamed to avoid colliding with DATASET_FORMATS. */
export type ExternalDatasetRuntimeMetadata = {
  source: string;
  sourceFormat?: Exclude<RemoteFileFormat, 'auto'> | string;
  size?: number;
  refreshIntervalMs?: number;
  etag?: string;
  lastModified?: string;
  lastFetchedAt?: number;
  refreshStatus?: ExternalDatasetRefreshStatus;
  refreshError?: string;
};

export function getDatasetRefreshIntervalMs(metadata?: {refreshIntervalMs?: unknown}): number {
  const value = metadata?.refreshIntervalMs;
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0;
}

export function getRemoteSourceFormat(metadata?: {
  sourceFormat?: unknown;
  format?: unknown;
}): string | undefined {
  const candidate =
    (typeof metadata?.sourceFormat === 'string' && metadata.sourceFormat) ||
    (typeof metadata?.format === 'string' && metadata.format) ||
    undefined;
  if (
    candidate &&
    candidate !== 'auto' &&
    Object.prototype.hasOwnProperty.call(REMOTE_FILE_EXTENSIONS, candidate)
  ) {
    return candidate;
  }
  return undefined;
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

export type WMSDatasetMetadata = {
  type: typeof REMOTE_TILE;
  remoteTileFormat: RemoteTileFormat.WMS;
  tilesetDataUrl: string;
  tilesetMetadataUrl: string;
  version: string;
  layers: {name: string; title: string; boundingBox: number[] | null}[];
  label?: string;
  attribution?: string;
};

export type Tile3DProviderAttribution = {
  title: string;
  url: string;
  logoUrl?: string;
  height?: number;
  bottom?: number;
};

export type Tile3DProvider = {
  name: string;
  urlKey: string;
  attribution?: Tile3DProviderAttribution;
};

export const TILE3D_PROVIDERS: Record<string, Tile3DProvider> = {
  google: {
    name: 'Google 3D Tiles',
    urlKey: 'google',
    attribution: {
      title: 'Built with Google Maps.',
      url: '',
      logoUrl:
        'https://studio-public-data.foursquare.com/statics/images/google-watermark-white.png',
      height: 17,
      bottom: 0
    }
  },
  cesium: {
    name: 'Cesium ion',
    urlKey: 'ion.cesium',
    attribution: {title: 'Cesium.', url: 'https://cesium.com/', height: 19, bottom: 0}
  },
  arcgis: {
    name: 'ArcGIS',
    urlKey: 'arcgis',
    attribution: {title: 'Powered by Esri.', url: 'https://arcgis.com/', height: 16}
  }
};

export type Tile3DDatasetMetadata = {
  tile3dUrl: string;
  tile3dAccessToken?: string;
  tile3dProvider?: string;
};

export type BitmapBounds =
  | [number, number, number, number]
  | [[number, number], [number, number], [number, number], [number, number]];

export type BitmapDatasetMetadata = {
  imageUrl: string;
  bounds: BitmapBounds;
  isDataUri?: boolean;
};
