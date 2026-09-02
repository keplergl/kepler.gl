// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {Loader} from '@loaders.gl/loader-utils';

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
  }
];

export const KEPLER_LOADER_ENTRIES = DEFAULT_LOADER_ENTRIES;

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
  const matchingEntries = KEPLER_LOADER_ENTRIES.filter(entry => matchesFile(entry, file));
  const entries = matchingEntries.length ? matchingEntries : KEPLER_LOADER_ENTRIES;
  const defaultLoaders = await Promise.all(entries.map(entry => entry.load()));
  const customLoaderIds = new Set(customLoaders.map(loader => loader.id));

  return [...customLoaders, ...defaultLoaders.filter(loader => !customLoaderIds.has(loader.id))];
}
