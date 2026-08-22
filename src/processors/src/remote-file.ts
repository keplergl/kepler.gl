// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {parseUri} from '@kepler.gl/common-utils';
import {
  MIME_TO_REMOTE_FILE_EXTENSION,
  REMOTE_FILE_EXTENSIONS,
  REMOTE_FILE_MIME_TYPES,
  RemoteFileFormat
} from '@kepler.gl/constants';
import {ProcessorResult} from '@kepler.gl/types';

import {processFileData, ProcessFileDataContent, readFileInBatches} from './file-handler';

export type KeplerRemoteFile = File & {
  keplerSourceUrl?: string;
  keplerFormat?: string;
};

function getPathFileName(url: string): string {
  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split('/').filter(Boolean);
    const last = segments.length ? decodeURIComponent(segments[segments.length - 1]) : '';
    return last.split('?')[0];
  } catch {
    const {file} = parseUri(url);
    return decodeURIComponent(String(file || '')).split('?')[0];
  }
}

export function getExtensionFromUrl(url: string): string {
  const file = getPathFileName(url);
  const match = file.match(/\.([a-z0-9]+)$/i);
  return match ? match[1].toLowerCase() : '';
}

export function getMimeTypeForFormat(format?: string | null): string | undefined {
  if (!format || format === 'auto') {
    return undefined;
  }
  return REMOTE_FILE_MIME_TYPES[format as Exclude<RemoteFileFormat, 'auto'>];
}

export function isRemoteDatasetUrl(url: string): boolean {
  try {
    const {protocol} = new URL(url);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Build a filename loaders.gl can use to pick a parser.
 * Prefers an explicit format, then the URL path extension, then Content-Type.
 */
export function getFileNameForRemoteUrl(
  url: string,
  format?: string | null,
  mimeType?: string | null
): string {
  let base = getPathFileName(url) || 'dataset';

  const formatExt =
    format && format !== 'auto'
      ? REMOTE_FILE_EXTENSIONS[format as Exclude<RemoteFileFormat, 'auto'>]
      : undefined;
  const urlExt = getExtensionFromUrl(url);
  const mimeExt = mimeType
    ? MIME_TO_REMOTE_FILE_EXTENSION[mimeType.split(';')[0].trim().toLowerCase()]
    : undefined;
  const ext = formatExt || urlExt || mimeExt;

  if (!ext) {
    return base;
  }

  if (/\.[a-z0-9]+$/i.test(base)) {
    if (formatExt && !base.toLowerCase().endsWith(`.${formatExt}`)) {
      return `${base.replace(/\.[^.]+$/, '')}.${formatExt}`;
    }
    return base;
  }

  return `${base}.${ext}`;
}

/**
 * Fetch a remote dataset URL and wrap it as a File the existing loadFiles pipeline can parse.
 * Sets File.type from an explicit format or the response Content-Type so extensionless
 * URLs (SAS keys) still select the right loader.
 */
export async function fetchRemoteFileAsKeplerFile(
  url: string,
  format?: string | null,
  onProgress?: (progress: {loaded: number; total?: number; percent: number}) => void
): Promise<KeplerRemoteFile> {
  if (!isRemoteDatasetUrl(url)) {
    throw new Error('Remote dataset URL must use http or https');
  }
  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text().catch(() => response.statusText);
    throw new Error(text || `Failed to fetch ${url}`);
  }

  const blob = await readResponseBlob(response, onProgress);
  const headerType = response.headers.get('content-type') || blob.type || '';
  const mimeType = getMimeTypeForFormat(format) || headerType.split(';')[0].trim();
  const fileName = getFileNameForRemoteUrl(url, format, mimeType);
  const file = new File([blob], fileName, mimeType ? {type: mimeType} : undefined) as KeplerRemoteFile;
  file.keplerSourceUrl = url;
  if (format && format !== 'auto') {
    file.keplerFormat = format;
  }
  return file;
}

async function readResponseBlob(
  response: Response,
  onProgress?: (progress: {loaded: number; total?: number; percent: number}) => void
): Promise<Blob> {
  const contentLength = Number(response.headers.get('content-length'));
  const total = Number.isFinite(contentLength) && contentLength > 0 ? contentLength : undefined;

  const emit = (loaded: number, complete = false) => {
    onProgress?.({
      loaded,
      total,
      percent: complete ? 1 : total ? Math.min(1, loaded / total) : 0
    });
  };

  if (!response.body) {
    const blob = await response.blob();
    emit(blob.size, true);
    return blob;
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let loaded = 0;
  emit(0);

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
    loaded += value.byteLength;
    emit(loaded);
  }

  emit(loaded, true);
  return new Blob(chunks);
}

function isTabularProcessorResult(
  data: unknown
): data is NonNullable<ProcessorResult> {
  return Boolean(
    data &&
      typeof data === 'object' &&
      Array.isArray((data as ProcessorResult)?.fields) &&
      Array.isArray((data as ProcessorResult)?.rows)
  );
}

/**
 * Fetch, parse, and process a remote file into Kepler dataset data.
 * Used when reloading an `externally-hosted` dataset from a saved map config.
 */
export async function loadExternallyHostedDataset(metadata: {
  source: string;
  format?: string;
  size?: number;
}): Promise<NonNullable<ProcessorResult>> {
  const {source, format} = metadata;
  const file = await fetchRemoteFileAsKeplerFile(source, format);
  const batches = await readFileInBatches({
    file,
    fileCache: [],
    loaders: [],
    loadOptions: {}
  });

  let content: ProcessFileDataContent | undefined;
  for await (const batch of batches) {
    content = batch as ProcessFileDataContent;
  }
  if (!content) {
    throw new Error(`No data loaded from ${source}`);
  }

  const processed = await processFileData({
    content: {
      ...content,
      fileName: content.fileName,
      sourceUrl: source
    },
    fileCache: []
  });
  const data = processed[processed.length - 1]?.data;
  if (!isTabularProcessorResult(data)) {
    throw new Error(`Remote file is not a dataset: ${source}`);
  }
  return data;
}

export function isExternallyHostedFile(file: File): file is KeplerRemoteFile {
  return Boolean((file as KeplerRemoteFile).keplerSourceUrl);
}
