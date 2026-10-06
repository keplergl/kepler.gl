// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {_BrowserFileSystem, parse} from '@loaders.gl/core';

import {isLoadableDatasetExtension} from './loader-registry';

export const SHAPEFILE_SIDECAR_EXTENSIONS = ['dbf', 'shx', 'prj', 'cpg'] as const;
export const SHAPEFILE_SOURCE_EXTENSIONS = ['shp', 'zip'] as const;

type NamedFile = {name: string};

export function getDroppedFileExtension(fileName = ''): string {
  const match = fileName.match(/\.([a-z0-9]+)$/i);
  return match ? match[1].toLowerCase() : '';
}

export function isShapefileSidecarFileName(fileName: string): boolean {
  return (SHAPEFILE_SIDECAR_EXTENSIONS as readonly string[]).includes(
    getDroppedFileExtension(fileName)
  );
}

export function isZipFileName(fileName: string): boolean {
  return getDroppedFileExtension(fileName) === 'zip';
}

export function isShapefileSourceFileName(fileName: string): boolean {
  return (SHAPEFILE_SOURCE_EXTENSIONS as readonly string[]).includes(
    getDroppedFileExtension(fileName)
  );
}

/**
 * Sidecar files (.dbf, .shx, .prj, .cpg) are not datasets. Skip them when a
 * .shp or shapefile .zip is also present so they can be used as companions.
 */
export function getFilesToParse<T extends NamedFile>(files: T[]): T[] {
  const list = Array.from(files);
  const hasShapefileSource = list.some(file => isShapefileSourceFileName(file.name));
  if (!hasShapefileSource) {
    return list;
  }
  return list.filter(file => !isShapefileSidecarFileName(file.name));
}

export function createCompanionFetch(
  files?: File[]
): ((url: string) => Promise<Response>) | undefined {
  if (
    !files?.length ||
    typeof File === 'undefined' ||
    files.every(file => !(file instanceof File))
  ) {
    return undefined;
  }
  const fileSystem = new _BrowserFileSystem(files);
  return fileSystem.fetch.bind(fileSystem);
}

function fileNameFromArchivePath(path: string): string {
  const parts = path.split(/[/\\]/);
  return parts[parts.length - 1] || path;
}

/**
 * Top-level members of a zip. Nested folders are ignored. Directory entries
 * are skipped.
 */
async function listTopLevelZipFiles(zipFile: File): Promise<File[]> {
  const {ZipLoader} = await import('@loaders.gl/zip');
  const zipData = await zipFile.arrayBuffer();
  const archive = (await parse(zipData, ZipLoader, {worker: false})) as Record<string, ArrayBuffer>;
  const files: File[] = [];

  for (const [path, buffer] of Object.entries(archive || {})) {
    if (!path || path.endsWith('/') || path.includes('/')) {
      continue;
    }
    const name = fileNameFromArchivePath(path);
    if (!name) {
      continue;
    }
    files.push(new File([buffer], name));
  }

  return files;
}

/**
 * Unpack a zip that contains a shapefile. Only top-level .shp plus sidecars
 * are returned; nested folders are ignored.
 */
export async function unzipShapefileArchive(zipFile: File): Promise<File[]> {
  const files = (await listTopLevelZipFiles(zipFile)).filter(file => {
    const ext = getDroppedFileExtension(file.name);
    return ext === 'shp' || (SHAPEFILE_SIDECAR_EXTENSIONS as readonly string[]).includes(ext);
  });

  if (!files.some(file => getDroppedFileExtension(file.name) === 'shp')) {
    throw new Error('Zip archive does not contain a shapefile (.shp)');
  }

  return files;
}

export type ZipArchiveExpansion =
  | {
      /** One shapefile and no other datasets. The load keeps the zip's name. */
      kind: 'shapefile';
      shapefile: File;
      companions: File[];
    }
  | {
      /** One dataset per supported top-level file, named from that file. */
      kind: 'datasets';
      datasets: File[];
      companions: File[];
    };

/**
 * Split a zip into datasets. A single shapefile plus sidecars stays one
 * shapefile archive. Any other mix (CSV, GeoJSON, several shapefiles, …)
 * becomes one file per supported member. Sidecars are returned as companions
 * and are not datasets. Nested folders and unsupported files are skipped.
 */
export async function expandZipArchive(zipFile: File): Promise<ZipArchiveExpansion> {
  const entries = await listTopLevelZipFiles(zipFile);
  const companions: File[] = [];
  const datasets: File[] = [];

  for (const file of entries) {
    if (isShapefileSidecarFileName(file.name)) {
      companions.push(file);
      continue;
    }
    if (isLoadableDatasetExtension(getDroppedFileExtension(file.name))) {
      datasets.push(file);
    }
  }

  const shapefiles = datasets.filter(file => getDroppedFileExtension(file.name) === 'shp');
  if (shapefiles.length === 1 && datasets.length === 1) {
    return {kind: 'shapefile', shapefile: shapefiles[0], companions};
  }
  if (!datasets.length) {
    throw new Error('Zip archive does not contain a supported dataset');
  }
  return {kind: 'datasets', datasets, companions};
}
