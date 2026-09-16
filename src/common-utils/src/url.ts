// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Allows to break down a url into multiple params
 * from http://blog.stevenlevithan.com/archives/parseuri
 */
export function parseUri(str: string): {[key: string]: any} {
  const o = parseUri.options;
  const m = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str);
  const uri = {};
  let i = 14;

  while (i--) uri[o.key[i]] = m?.[i] || '';

  uri[o.q.name] = {};
  uri[o.key[12]].replace(o.q.parser, ($0, $1, $2) => {
    if ($1) uri[o.q.name][$1] = $2;
  });

  return uri;
}

parseUri.options = {
  strictMode: false,
  key: [
    'source',
    'protocol',
    'authority',
    'userInfo',
    'user',
    'password',
    'host',
    'port',
    'relative',
    'path',
    'directory',
    'file',
    'query',
    'anchor'
  ],
  q: {
    name: 'queryKey',
    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
  },
  parser: {
    strict:
      // eslint-disable-next-line no-useless-escape
      /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
    loose:
      // eslint-disable-next-line no-useless-escape
      /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
};

/**
 * Validates an url
 * @param str
 */
export function validateUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks whether a given URL points to a PMTiles file.
 * @param url The URL to check.
 * @returns True if the URL includes '.pmtiles', otherwise false.
 */
export const isPMTilesUrl = (url?: string | null) => url?.includes('.pmtiles');

const COG_EXTENSIONS = ['.tif', '.tiff', '.geotiff', '.geotif', '.gtiff', '.cog'];

function getUrlPathname(url: string): string {
  try {
    return new URL(url).pathname.toLowerCase().replace(/\/+$/, '');
  } catch {
    return url.trim().toLowerCase().split(/[?#]/)[0].replace(/\/+$/, '');
  }
}

function isAbortError(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'name' in error &&
      (error as {name?: string}).name === 'AbortError'
  );
}

/**
 * TIFF / BigTIFF magic numbers.
 * Classic: little-endian II*\0 or big-endian MM\0*
 * BigTIFF: little-endian II+\0 or big-endian MM\0+
 */
export function isTiffMagicBytes(bytes?: ArrayBuffer | Uint8Array | null): boolean {
  if (!bytes) return false;
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  if (view.length < 4) return false;
  const littleEndianClassic =
    view[0] === 0x49 && view[1] === 0x49 && view[2] === 0x2a && view[3] === 0x00;
  const bigEndianClassic =
    view[0] === 0x4d && view[1] === 0x4d && view[2] === 0x00 && view[3] === 0x2a;
  const littleEndianBigTiff =
    view[0] === 0x49 && view[1] === 0x49 && view[2] === 0x2b && view[3] === 0x00;
  const bigEndianBigTiff =
    view[0] === 0x4d && view[1] === 0x4d && view[2] === 0x00 && view[3] === 0x2b;
  return littleEndianClassic || bigEndianClassic || littleEndianBigTiff || bigEndianBigTiff;
}

/**
 * True when a Content-Type header describes GeoTIFF / Cloud Optimized GeoTIFF.
 * Matches values such as `image/tiff; application=geotiff; profile=cloud-optimized`.
 */
export function isGeoTiffContentType(contentType?: string | null): boolean {
  if (!contentType) return false;
  const ct = contentType.toLowerCase();
  return (
    ct.includes('image/tiff') || ct.includes('image/geotiff') || ct.includes('application=geotiff')
  );
}

function isJsonContentType(contentType?: string | null): boolean {
  if (!contentType) return false;
  const ct = contentType.toLowerCase();
  return ct.includes('json');
}

/**
 * Synchronous COG URL detection from the path alone.
 * Matches GeoTIFF extensions and APIs that expose the file as a `/cog` suffix
 * (for example NextGIS Web: `/api/resource/{id}/cog`).
 */
export function isCOGUrl(url?: string | null): boolean {
  if (!url) return false;
  const pathname = getUrlPathname(url);
  // Already a TiTiler STAC wrapper, not a raw COG.
  if (pathname.includes('/cog/stac')) return false;
  if (COG_EXTENSIONS.some(ext => pathname.endsWith(ext))) return true;
  const lastSegment = pathname.split('/').pop() || '';
  return lastSegment === 'cog';
}

/**
 * True when the URL is not obviously STAC/PMTiles/COG and a HEAD/range probe
 * should be used to read Content-Type (or TIFF magic bytes).
 */
export function shouldProbeForCOG(url?: string | null): boolean {
  if (!url || !validateUrl(url) || isPMTilesUrl(url) || isCOGUrl(url)) {
    return false;
  }
  const pathname = getUrlPathname(url);
  if (pathname.endsWith('.json') || pathname.endsWith('.geojson') || pathname.endsWith('.jsonl')) {
    return false;
  }
  // Documented STAC collection examples; skip extra CORS-sensitive probes.
  if (pathname.includes('/collections/') || pathname.includes('/cog/stac')) {
    return false;
  }
  return true;
}

async function readResponsePrefix(response: Response, maxBytes = 16): Promise<Uint8Array | null> {
  const reader = response.body?.getReader?.();
  if (!reader) {
    const buf = await response.arrayBuffer();
    return new Uint8Array(buf.slice(0, maxBytes));
  }

  const chunks: Uint8Array[] = [];
  let received = 0;
  while (received < maxBytes) {
    const {done, value} = await reader.read();
    if (done || !value) break;
    chunks.push(value);
    received += value.byteLength;
  }
  try {
    await reader.cancel();
  } catch {
    // ignore cancel errors
  }
  if (!chunks.length) return null;

  const out = new Uint8Array(Math.min(received, maxBytes));
  let offset = 0;
  for (const chunk of chunks) {
    const n = Math.min(chunk.byteLength, maxBytes - offset);
    out.set(chunk.subarray(0, n), offset);
    offset += n;
    if (offset >= maxBytes) break;
  }
  return out;
}

function contentTypeFrom(response: Response): string | null {
  return response.headers.get('content-type');
}

/** Default bound so a hanging HEAD/GET cannot leave Add Data probing forever. */
export const COG_PROBE_TIMEOUT_MS = 4000;

/**
 * Probe a remote URL to decide whether it is a Cloud Optimized GeoTIFF.
 * Tries HEAD (Content-Type) first, then a small ranged GET for magic bytes.
 * HEAD often fails due to storage CORS settings; that is treated as a miss,
 * not an error, and the GET fallback is attempted.
 * The whole probe is aborted after `timeoutMs` and treated as a miss.
 */
export async function probeUrlIsCOG(
  url: string,
  signal?: AbortSignal,
  timeoutMs: number = COG_PROBE_TIMEOUT_MS
): Promise<boolean> {
  if (signal?.aborted) return false;

  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);
  const onExternalAbort = () => timeoutController.abort();
  signal?.addEventListener('abort', onExternalAbort);

  const probeSignal = timeoutController.signal;

  try {
    try {
      const head = await fetch(url, {method: 'HEAD', signal: probeSignal});
      if (head.ok) {
        const contentType = contentTypeFrom(head);
        if (isGeoTiffContentType(contentType)) return true;
        if (isJsonContentType(contentType)) return false;
      }
    } catch (error) {
      if (isAbortError(error)) return false;
      // Continue to ranged GET. Vector-tile form notes HEAD often fails on storage CORS.
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {Range: 'bytes=0-15'},
        signal: probeSignal
      });
      if (!response.ok) return false;

      const contentType = contentTypeFrom(response);
      if (isGeoTiffContentType(contentType)) {
        response.body?.cancel?.().catch(() => undefined);
        return true;
      }
      if (isJsonContentType(contentType)) {
        response.body?.cancel?.().catch(() => undefined);
        return false;
      }

      const prefix = await readResponsePrefix(response);
      return isTiffMagicBytes(prefix);
    } catch (error) {
      if (isAbortError(error)) return false;
      return false;
    }
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', onExternalAbort);
  }
}
