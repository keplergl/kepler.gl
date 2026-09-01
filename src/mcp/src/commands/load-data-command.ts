import type {RoomCommand} from './types';
import {z} from 'zod';
import {addDataToMap} from '@kepler.gl/actions';
import {readFileInBatches, processFileData} from '@kepler.gl/processors';
import type {ProcessFileDataContent} from '@kepler.gl/processors';
import type {KeplerContext} from './types';

// MIME type → file extension for data URLs, so a `data:text/csv;base64,...`
// payload gets a sensible default dataset name (`data.csv`) instead of `data`.
const DATA_URL_EXTENSIONS: Record<string, string> = {
  'text/csv': '.csv',
  'application/csv': '.csv',
  'application/json': '.json',
  'application/geo+json': '.geojson',
  'application/vnd.apache.arrow.file': '.arrow',
  'application/vnd.apache.parquet': '.parquet',
  'text/plain': '.txt'
};

function fileNameFromDataUrl(parsedUrl: URL): string {
  // data:text/csv;base64,... → pathname is "text/csv;base64,"
  const mime = parsedUrl.pathname.split(';')[0].toLowerCase();
  return `data${DATA_URL_EXTENSIONS[mime] ?? ''}`;
}

// Same 32-bit string hash the processors use for dataset ids — applied to a
// data URL's content so the dataset id is content-derived (unique per payload)
// without storing the whole (potentially large) data URL in the metadata.
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    // eslint-disable-next-line no-bitwise
    hash = (hash << 5) - hash + str.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    hash |= 0;
  }
  return hash.toString(36);
}

export const loadDataCommandId = 'map.load-data' as const;

export function getLoadDataCommand(ctx: KeplerContext): RoomCommand {
  return {
    id: loadDataCommandId,
    name: 'Load data from URL',
    group: 'Map',
    description:
      'Load a dataset from a URL into kepler.gl. The dataset is named after the URL filename, ' +
      'or after `datasetName` when provided. Does NOT create a layer — call map.add-layer to visualize. ' +
      'Do NOT create a duplicate dataset (e.g. via map.create-table) just to rename it; ' +
      'name it here with `datasetName` instead, or use the URL-filename dataset as-is. ' +
      'LOCAL FILES: a local file must be served over http(s) — the browser cannot fetch ' +
      '`file://` paths. To load a file you have on disk: (1) copy it into the demo app\'s ' +
      'served directory (e.g. `examples/demo-app/dist/`) and pass `/filename.csv`, or ' +
      '(2) serve it with a CORS-enabled local server (`npx serve --cors -l 8000` in the ' +
      'file\'s folder) and pass `http://localhost:8000/filename.csv`. ' +
      'EMBEDDED CONTENT: if you have the file content but cannot serve it (e.g. a remote ' +
      'browser context), pass it as a data URL — `data:text/csv;base64,<base64 content>` ' +
      '(encode with `base64 -i file.csv`). Works for small files (up to ~2MB). ' +
      'LARGE DATASETS: for files over a few MB, prefer Parquet (.parquet) over GeoJSON/CSV — ' +
      'it loads much faster and is less likely to time out. Convert GeoJSON to GeoParquet ' +
      'with geopandas (`gdf.to_parquet("data.parquet")`); kepler reads GeoParquet geometry (WKB) natively.',
    metadata: {readOnly: false, riskLevel: 'medium', requiresConfirmation: true},
    inputSchema: z.object({
      url: z
        .string()
        .describe(
          'The URL to load data from. May be a full http(s) URL, a path served by the demo app ' +
            '(e.g. /data.geojson), or a data URL embedding small file content (data:text/csv;base64,...).'
        ),
      datasetName: z
        .string()
        .optional()
        .describe(
          'Optional name for the loaded dataset. If omitted, the URL filename is used. ' +
            'Use this instead of creating a duplicate dataset to rename it.'
        )
    }) as any,
    execute: async (execCtx, input) => {
      const {url, datasetName} = (input ?? {}) as {url: string; datasetName?: string};
      try {
        if (typeof url !== 'string' || url.trim() === '') {
          throw new Error(`Invalid URL: ${url}`);
        }

        // Resolve the URL before validating the scheme. A scheme-less string is
        // a relative reference — resolve it against the page origin so files
        // served by the demo app itself (same-origin) can be loaded with a bare
        // path (e.g. `/sf_streets.geojson`). Browsers cannot fetch `file://`
        // URLs, so a local file must be served over http(s) by the page's own
        // server (or a CORS-enabled local server). `data:` URLs are allowed for
        // small files — they embed the content directly, which is the one way
        // an agent in a remote browser context can load a local file it cannot
        // serve. `javascript:` and other schemes are rejected.
        const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(url);
        const pageOrigin = typeof window !== 'undefined' ? window.location.origin : undefined;
        let parsedUrl: URL;
        try {
          parsedUrl = hasScheme ? new URL(url) : new URL(url, pageOrigin);
        } catch {
          throw new Error(`Invalid URL: ${url}`);
        }
        if (parsedUrl.protocol === 'data:') {
          // Cap the size so a huge embedded payload can't stall the load or
          // bloat the tool input. For larger files the agent should serve the
          // file over http(s) or convert to Parquet instead.
          const MAX_DATA_URL_LENGTH = 2 * 1024 * 1024; // ~2MB of base64
          if (parsedUrl.href.length > MAX_DATA_URL_LENGTH) {
            throw new Error(
              `Data URL is too large (${parsedUrl.href.length} chars). ` +
                'For files over a few MB, serve the file over http(s) or convert to Parquet.'
            );
          }
        } else if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
          throw new Error(
            `Unsupported URL scheme "${parsedUrl.protocol}". Only http(s) URLs are supported.`
          );
        }

        const visState = ctx.getVisState();
        // Thread the caller's AbortSignal into the fetch so WebMCP/bridge
        // cancellations stop long-running loads instead of letting them hang.
        const response = await fetch(parsedUrl.href, {signal: execCtx?.signal});
        if (!response.ok) {
          // Include the numeric status — statusText is often empty (e.g. some
          // CDNs / error pages), and the code alone makes failures diagnosable.
          const reason = response.statusText
            ? `HTTP ${response.status} ${response.statusText}`
            : `HTTP ${response.status}`;
          throw new Error(`Failed to fetch data from ${parsedUrl.href}: ${reason}`);
        }

        const blob = await response.blob();
        // Derive the filename from the URL pathname so query strings (e.g.
        // `data.csv?x=1`) don't end up in the dataset name. A data URL has no
        // pathname — fall back to a name derived from its MIME type so the
        // dataset gets a sensible default label (e.g. `data.csv`).
        const fileName =
          parsedUrl.protocol === 'data:'
            ? fileNameFromDataUrl(parsedUrl)
            : parsedUrl.pathname.split('/').pop() || 'data';
        // Carry the Blob's MIME type into the File so loader selection in
        // readFileInBatches can use it — a URL with no extension (or a
        // misleading one) would otherwise leave file.type empty and fail to
        // pick the right loader.
        const file = new File([blob], fileName, {type: blob.type || undefined});
        // Preserve the source URL so processors hash by URL (avoiding dataset-id
        // collisions between same-named files) and can attach externally-hosted
        // metadata — mirrors loadExternallyHostedDataset. Use the RESOLVED href
        // so a relative path and its absolute form hash to the same dataset id.
        // For a data URL the href IS the content (potentially large) — hash it
        // down so the id stays content-derived (unique per payload) without
        // storing the whole payload in the dataset metadata.
        const sourceUrl =
          parsedUrl.protocol === 'data:'
            ? `data:${hashString(parsedUrl.href)}`
            : parsedUrl.href;
        (file as File & {keplerSourceUrl?: string}).keplerSourceUrl = sourceUrl;

        const batches = await readFileInBatches({
          file,
          fileCache: [],
          loaders: visState.loaders ?? [],
          loadOptions: visState.loadOptions ?? {}
        });

        let result = await batches.next();
        let content: ProcessFileDataContent = {data: [], fileName: ''};
        let parsedData: any[] = [];

        while (!result.done) {
          content = result.value as ProcessFileDataContent;
          result = await batches.next();
          if (result.done) {
            parsedData = await processFileData({content, fileCache: []});
            break;
          }
        }

        if (parsedData.length === 0) {
          throw new Error(`No data could be parsed from ${url}.`);
        }

        // Apply a caller-chosen dataset name (default: the URL filename) so the
        // agent never has to create a duplicate dataset just to rename it.
        for (const d of parsedData) {
          if (d?.info) {
            d.info.label = datasetName ?? d.info.label ?? fileName;
          }
        }

        ctx.dispatch(
          addDataToMap({
            datasets: parsedData,
            // Do NOT auto-create a layer — the assistant creates the layer
            // explicitly via `map.add-layer` (with full styling control), so
            // loading data never produces a duplicate default layer.
            options: {autoCreateLayers: false, centerMap: true}
          })
        );

        const dataInfo = parsedData[0]?.info;
        return {
          success: true,
          commandId: loadDataCommandId,
          data: {details: `Successfully loaded data from ${url}`, dataInfo}
        };
      } catch (error) {
        return {
          success: false,
          commandId: loadDataCommandId,
          error: error instanceof Error ? error.message : 'Unknown error',
          data: {
            instruction:
              'Try to fix the error. If the error persists, ask the user to try with a different URL or format.'
          }
        };
      }
    }
  };
}
