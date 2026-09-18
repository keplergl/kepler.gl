// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {Loader} from '@loaders.gl/loader-utils';
import {REMOTE_FILE_FORMATS, type RemoteFileFormat} from '@kepler.gl/constants';
import {getApplicationConfig} from '@kepler.gl/utils';

import {KeplerCSVLoader} from './kepler-csv-loader';

export type KeplerLoaderEntry = {
  id: string;
  extensions: string[];
  mimeTypes: string[];
  load: () => Promise<Loader>;
};

type FileMetadata = {
  name?: string;
  type?: string;
};

function getFileExtension(fileName = ''): string {
  const match = fileName.match(/\.([a-z0-9]+)$/i);
  return match ? match[1].toLowerCase() : '';
}

const NDJSON_EXTENSIONS = ['ndjson', 'jsonl', 'ndgeojson', 'geojsonl', 'ldgeojson'];
const NDJSON_MIME_TYPES = [
  'application/x-ndjson',
  'application/jsonlines',
  'application/json-seq',
  'application/geo+x-ndjson',
  'application/geo+x-ldjson',
  'application/geo+json-seq'
];

const DEFAULT_LOADER_ENTRIES: KeplerLoaderEntry[] = [
  {
    id: 'csv',
    extensions: ['csv', 'tsv', 'dsv'],
    mimeTypes: ['text/csv', 'text/tab-separated-values', 'text/dsv'],
    load: async () => KeplerCSVLoader
  },
  {
    id: 'json',
    extensions: ['json', 'geojson'],
    mimeTypes: ['application/json', 'application/geo+json'],
    load: async () => (await import('@loaders.gl/json')).JSONLoader
  },
  {
    id: 'ndjson',
    extensions: NDJSON_EXTENSIONS,
    mimeTypes: NDJSON_MIME_TYPES,
    load: async () => {
      const {NDJSONLoader} = await import('@loaders.gl/json');
      return {
        ...NDJSONLoader,
        extensions: NDJSON_EXTENSIONS,
        mimeTypes: NDJSON_MIME_TYPES
      };
    }
  },
  {
    id: 'kml',
    extensions: ['kml'],
    mimeTypes: ['application/vnd.google-earth.kml+xml'],
    load: async () => (await import('@loaders.gl/kml')).KMLLoader
  },
  {
    id: 'gpx',
    extensions: ['gpx'],
    mimeTypes: ['application/gpx+xml'],
    load: async () => (await import('@loaders.gl/kml')).GPXLoader
  },
  {
    id: 'tcx',
    extensions: ['tcx'],
    mimeTypes: ['application/vnd.garmin.tcx+xml'],
    load: async () => (await import('@loaders.gl/kml')).TCXLoader
  },
  {
    id: 'arrow',
    extensions: ['arrow', 'feather'],
    mimeTypes: ['application/vnd.apache.arrow.file', 'application/vnd.apache.arrow.stream'],
    load: async () => (await import('@loaders.gl/arrow')).GeoArrowLoader
  },
  {
    id: 'parquet',
    extensions: ['parquet'],
    mimeTypes: ['application/vnd.apache.parquet'],
    load: async () => (await import('@loaders.gl/parquet')).ParquetArrowLoader
  },
  {
    id: 'shapefile',
    extensions: ['shp'],
    mimeTypes: ['application/octet-stream', 'application/x-esri-shapefile', 'application/shp'],
    load: async () => {
      const {ShapefileLoader} = await import('@loaders.gl/shapefile');
      // loaders.gl SHP magic also matches .shx sidecar files
      const loader = {...ShapefileLoader};
      delete (loader as {tests?: unknown}).tests;
      return loader;
    }
  },
  {
    id: 'excel',
    extensions: ['xlsx', 'xls', 'xlsm', 'xlsb'],
    mimeTypes: [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/vnd.ms-excel.sheet.macroenabled.12',
      'application/vnd.ms-excel.sheet.binary.macroenabled.12'
    ],
    load: async () => (await import('@loaders.gl/excel')).ExcelLoader
  },
  {
    id: 'flatgeobuf',
    extensions: ['fgb'],
    mimeTypes: ['application/x-flatgeobuf', 'application/flatgeobuf'],
    load: async () => (await import('@loaders.gl/flatgeobuf')).FlatGeobufLoader
  }
];

export const KEPLER_LOADER_ENTRIES = DEFAULT_LOADER_ENTRIES;

/** Maps user-facing format ids and extensions to a loader-registry id. */
const TOKEN_TO_LOADER_ID: Record<string, string> = {
  csv: 'csv',
  tsv: 'csv',
  dsv: 'csv',
  json: 'json',
  geojson: 'json',
  ndjson: 'ndjson',
  jsonl: 'ndjson',
  ndgeojson: 'ndjson',
  geojsonl: 'ndjson',
  ldgeojson: 'ndjson',
  kml: 'kml',
  gpx: 'gpx',
  tcx: 'tcx',
  arrow: 'arrow',
  feather: 'arrow',
  parquet: 'parquet',
  shp: 'shapefile',
  shapefile: 'shapefile',
  zip: 'shapefile',
  dbf: 'shapefile',
  shx: 'shapefile',
  prj: 'shapefile',
  cpg: 'shapefile',
  xlsx: 'excel',
  xls: 'excel',
  xlsm: 'excel',
  xlsb: 'excel',
  excel: 'excel',
  fgb: 'flatgeobuf',
  flatgeobuf: 'flatgeobuf'
};

const REMOTE_FORMAT_TO_LOADER_ID: Record<Exclude<RemoteFileFormat, 'auto'>, string> = {
  csv: 'csv',
  geojson: 'json',
  json: 'json',
  arrow: 'arrow',
  parquet: 'parquet',
  geojsonl: 'ndjson',
  ndjson: 'ndjson',
  kml: 'kml',
  gpx: 'gpx',
  tcx: 'tcx',
  shp: 'shapefile',
  xlsx: 'excel',
  fgb: 'flatgeobuf'
};

function getAcceptedLoaderIdSet(): Set<string> | null {
  const configured = getApplicationConfig().acceptedFileFormats;
  if (configured == null) {
    return null;
  }
  const ids = new Set<string>();
  for (const token of configured) {
    const id = TOKEN_TO_LOADER_ID[String(token).trim().toLowerCase()];
    if (id) {
      ids.add(id);
    }
  }
  return ids;
}

export function isKeplerFileFormatAccepted(token: string): boolean {
  const allowed = getAcceptedLoaderIdSet();
  if (!allowed) {
    return true;
  }
  const id = TOKEN_TO_LOADER_ID[token.trim().toLowerCase()];
  return Boolean(id && allowed.has(id));
}

export function getAcceptedKeplerLoaderEntries(): KeplerLoaderEntry[] {
  const allowed = getAcceptedLoaderIdSet();
  if (!allowed) {
    return KEPLER_LOADER_ENTRIES;
  }
  return KEPLER_LOADER_ENTRIES.filter(entry => allowed.has(entry.id));
}

export function getAcceptedRemoteFileFormats(): readonly RemoteFileFormat[] {
  const allowed = getAcceptedLoaderIdSet();
  if (!allowed) {
    return REMOTE_FILE_FORMATS;
  }
  return REMOTE_FILE_FORMATS.filter(
    format => format === 'auto' || allowed.has(REMOTE_FORMAT_TO_LOADER_ID[format])
  );
}

function matchesFile(entry: KeplerLoaderEntry, file: FileMetadata): boolean {
  const extension = getFileExtension(file.name);
  const mimeType = file.type?.split(';')[0].trim().toLowerCase();
  return Boolean(
    (extension && entry.extensions.includes(extension)) ||
      (mimeType && entry.mimeTypes.includes(mimeType))
  );
}

/**
 * Resolve the loaders needed for a file. Loader modules are imported only for
 * matching extensions/MIME types; extensionless or unknown files retain core's
 * content-based selection by loading all default candidates.
 */
export async function getKeplerLoaders(
  file: FileMetadata,
  customLoaders: Loader[] = []
): Promise<Loader[]> {
  const availableEntries = getAcceptedKeplerLoaderEntries();
  const matchingEntries = availableEntries.filter(entry => matchesFile(entry, file));
  const entries = matchingEntries.length ? matchingEntries : availableEntries;
  const defaultLoaders = await Promise.all(entries.map(entry => entry.load()));
  const customLoaderIds = new Set(customLoaders.map(loader => loader.id));

  return [...customLoaders, ...defaultLoaders.filter(loader => !customLoaderIds.has(loader.id))];
}
