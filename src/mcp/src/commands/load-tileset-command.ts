// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';
import {PMTilesSource} from '@loaders.gl/pmtiles';
import {addDataToMap} from '@kepler.gl/actions';
import {
  ALL_FIELD_TYPES,
  DatasetType,
  PMTilesType,
  REMOTE_TILE,
  RemoteTileFormat
} from '@kepler.gl/constants';
import {getApplicationConfig} from '@kepler.gl/utils';
import {
  getMetaUrl,
  getMVTMetadata,
  getFieldsFromTile,
  parseVectorMetadata,
  parseRasterMetadata,
  getWMSCapabilities,
  wmsCapabilitiesToDatasetMetadata,
  buildWmsGetCapabilitiesUrl
} from '@kepler.gl/table';
import type {KeplerContext, RoomCommand} from './types';

function isGoogleTileset(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.origin === 'https://tile.googleapis.com' && parsed.pathname.startsWith('/v1/3dtiles/')
    );
  } catch {
    return false;
  }
}

const httpUrl = z
  .string()
  .url()
  .refine(value => ['http:', 'https:'].includes(new URL(value).protocol), 'URL must use HTTP(S).');
const inputSchema = z.object({
  datasetName: z.string().trim().min(1),
  type: z.enum(['vectorTile', 'rasterTile', 'wms', 'tile3d', 'bitmap']),
  url: httpUrl.describe(
    'MVT template or PMTiles archive, raster STAC/PMTiles URL, WMS service, 3D tileset JSON, or image URL.'
  ),
  credentialDatasetId: z
    .string()
    .trim()
    .min(1)
    .optional()
    .describe(
      'Google 3D Tiles only: reuse the access token of an existing Google 3D Tiles dataset by ID. Configure it in the native importer; never put the key in the URL or tool arguments.'
    ),
  metadataUrl: httpUrl
    .optional()
    .describe('Vector TileJSON metadata URL; inferred from url when omitted.'),
  rasterTileServerUrls: z
    .array(httpUrl)
    .min(1)
    .optional()
    .describe(
      'TiTiler servers for STAC rasters; required unless the host configures them. PMTiles does not need a server.'
    ),
  bounds: z
    .tuple([
      z.number().finite(),
      z.number().min(-90).max(90),
      z.number().finite(),
      z.number().min(-90).max(90)
    ])
    .optional()
    .describe('Required for bitmap: [west, south, east, north].')
});

export function getLoadTilesetCommand(ctx: KeplerContext): RoomCommand {
  const id = 'map.load-tileset';
  return {
    id,
    name: 'Load remote tileset or image',
    group: 'Map',
    description:
      'Import remote layer metadata without downloading the whole dataset. Then call map.add-layer using the returned datasetId and layerType. URLs must be accessible from the browser (CORS). Raster supports STAC items/collections and PMTiles; 3D tiles accepts a tileset JSON URL. Google 3D Tiles uses credentialDatasetId to reuse a configured credential.',
    metadata: {readOnly: false, riskLevel: 'medium'},
    inputSchema,
    execute: async (execution, input) => {
      let accessToken: string | undefined;
      try {
        const args = inputSchema.parse(input);
        const checkCancelled = () => {
          if (execution.signal?.aborted) throw new Error('Tileset import cancelled.');
        };
        checkCancelled();
        const google = args.type === 'tile3d' && isGoogleTileset(args.url);
        if (args.credentialDatasetId && !google) {
          throw new Error('credentialDatasetId is only supported for Google 3D Tiles URLs.');
        }
        if (google) {
          const url = new URL(args.url);
          if (url.username || url.password || url.searchParams.has('key')) {
            throw new Error(
              'Keep Google 3D Tiles credentials out of the URL; use credentialDatasetId.'
            );
          }
          const source = args.credentialDatasetId
            ? ctx.getVisState().datasets[args.credentialDatasetId]
            : undefined;
          const metadata = source?.metadata;
          if (
            source?.type !== DatasetType.TILE_3D ||
            !isGoogleTileset(metadata?.tile3dUrl) ||
            typeof metadata?.tile3dAccessToken !== 'string' ||
            !metadata.tile3dAccessToken.trim()
          ) {
            throw new Error(
              'Google 3D Tiles requires credentialDatasetId referencing a Google 3D Tiles dataset with an access token configured in the native importer.'
            );
          }
          accessToken = metadata.tile3dAccessToken;
        }
        const pmtiles = new URL(args.url).pathname.toLowerCase().endsWith('.pmtiles');
        const app = getApplicationConfig();
        const rasterTileServerUrls = args.rasterTileServerUrls ?? app.rasterServerUrls;
        if (args.type === 'rasterTile' && !pmtiles && !rasterTileServerUrls?.length) {
          throw new Error(
            'STAC imports require rasterTileServerUrls or host rasterServerUrls (TiTiler).'
          );
        }
        let metadata: any;
        if (args.type === 'bitmap') {
          if (
            !args.bounds ||
            args.bounds[0] >= args.bounds[2] ||
            args.bounds[1] >= args.bounds[3]
          ) {
            throw new Error('Bitmap bounds require west < east and south < north.');
          }
          metadata = {imageUrl: args.url, bounds: args.bounds};
        } else if (args.type === 'wms') {
          const capabilities = await getWMSCapabilities(args.url);
          metadata = {
            ...wmsCapabilitiesToDatasetMetadata(capabilities, args.url),
            type: REMOTE_TILE,
            remoteTileFormat: RemoteTileFormat.WMS,
            tilesetDataUrl: args.url,
            tilesetMetadataUrl: buildWmsGetCapabilitiesUrl(args.url)
          };
          if (!metadata.layers?.length) throw new Error('WMS service has no named layers.');
        } else if (args.type === 'tile3d') {
          const response = await fetch(args.url, {
            signal: execution.signal,
            ...(accessToken
              ? {headers: {'X-GOOG-API-KEY': accessToken}, redirect: 'error' as const}
              : {})
          }).catch(error => {
            checkCancelled();
            // Fetch errors can contain request credentials. Do not relay them.
            if (google)
              throw new Error('Google 3D Tiles request failed (network, CORS, or redirect).');
            throw error;
          });
          if (!response.ok) {
            const reason = [401, 403].includes(response.status)
              ? 'access denied'
              : 'request failed';
            throw new Error(
              google
                ? `Google 3D Tiles ${reason} (HTTP ${response.status}).`
                : `Tileset request failed (${response.status}).`
            );
          }
          const tileset = await response.json().catch(error => {
            checkCancelled();
            if (google) throw new Error('Google 3D Tiles returned invalid tileset JSON.');
            throw error;
          });
          if (!tileset.asset || !tileset.root)
            throw new Error('URL must return a 3D Tiles tileset JSON with asset and root.');
          metadata = {
            tile3dUrl: google ? new URL(args.url).href : args.url,
            ...(accessToken ? {tile3dProvider: 'google', tile3dAccessToken: accessToken} : {})
          };
        } else if (args.type === 'vectorTile') {
          const metadataUrl = args.metadataUrl ?? (pmtiles ? args.url : getMetaUrl(args.url));
          if (!metadataUrl) throw new Error('Provide a vector metadataUrl.');
          const raw = pmtiles
            ? await PMTilesSource.createDataSource(args.url, {}).metadata
            : await getMVTMetadata(metadataUrl);
          if (!raw) throw new Error('Failed to read vector metadata.');
          const parsed = parseVectorMetadata(raw, {tileUrl: metadataUrl});
          if (!parsed || parsed.pmtilesType === PMTilesType.RASTER)
            throw new Error('Expected vector tile metadata.');
          const remoteTileFormat = pmtiles ? RemoteTileFormat.PMTILES : RemoteTileFormat.MVT;
          await getFieldsFromTile({
            remoteTileFormat,
            tilesetUrl: args.url,
            metadataUrl,
            metadata: parsed
          });
          metadata = {
            ...parsed,
            type: REMOTE_TILE,
            remoteTileFormat,
            tilesetDataUrl: args.url,
            tilesetMetadataUrl: metadataUrl
          };
        } else {
          let parsed;
          if (pmtiles) {
            parsed = parseVectorMetadata(
              await PMTilesSource.createDataSource(args.url, {}).metadata,
              {tileUrl: args.url}
            );
            if (parsed?.pmtilesType !== PMTilesType.RASTER)
              throw new Error('Expected raster PMTiles metadata.');
          } else {
            const response = await fetch(args.url, {signal: execution.signal});
            if (!response.ok)
              throw new Error(`Raster metadata request failed (${response.status}).`);
            parsed = parseRasterMetadata(await response.json(), {allowCollections: true});
            if (parsed instanceof Error) throw parsed;
          }
          if (!parsed) throw new Error('Failed to read raster metadata.');
          metadata = {
            ...parsed,
            metadataUrl: args.url,
            rasterTileServerUrls,
            rasterServerUseLatestTitiler: app.rasterServerUseLatestTitiler,
            rasterServerSupportsElevation: app.rasterServerSupportsElevation,
            rasterServerMaxRetries: app.rasterServerMaxRetries,
            rasterServerRetryDelay: app.rasterServerRetryDelay,
            rasterServerServerErrorsToRetry: app.rasterServerServerErrorsToRetry,
            rasterServerMaxPerServerRequests: app.rasterServerMaxPerServerRequests
          };
        }
        checkCancelled();
        const types = {
          vectorTile: DatasetType.VECTOR_TILE,
          rasterTile: DatasetType.RASTER_TILE,
          wms: DatasetType.WMS_TILE,
          tile3d: DatasetType.TILE_3D,
          bitmap: DatasetType.BITMAP
        };
        const datasetId = `tileset_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        await new Promise<void>((resolve, reject) => {
          const onAbort = () =>
            reject(
              new Error('Tileset import cancelled; pending table creation may still complete.')
            );
          const finish = () => {
            try {
              checkCancelled();
              if (!ctx.getVisState().datasets[datasetId]) {
                throw new Error(
                  'Dataset registration failed. The host must return the task middleware completion promise from dispatch.'
                );
              }
              resolve();
            } catch (error) {
              reject(error);
            }
          };
          execution.signal?.addEventListener('abort', onAbort, {once: true});
          // The task middleware resolves only after its reducer continuations commit.
          // Check the dataset too: table-creation failures become error notifications.
          Promise.resolve()
            .then(() => {
              checkCancelled();
              return ctx.dispatch(
                addDataToMap({
                  datasets: [
                    {
                      info: {
                        id: datasetId,
                        label: args.datasetName,
                        type: types[args.type],
                        format: 'rows'
                      },
                      data: {fields: metadata.fields ?? [], rows: []},
                      metadata,
                      supportedFilterTypes: [
                        ALL_FIELD_TYPES.real,
                        ALL_FIELD_TYPES.integer,
                        ALL_FIELD_TYPES.boolean,
                        ...(args.type === 'vectorTile' ? [ALL_FIELD_TYPES.string] : [])
                      ],
                      disableDataOperation: true
                    }
                  ],
                  options: {autoCreateLayers: false, centerMap: false}
                })
              );
            })
            .then(finish, reject)
            .finally(() => execution.signal?.removeEventListener('abort', onAbort));
        });
        return {
          success: true,
          commandId: id,
          data: {
            datasetId,
            layerType: args.type,
            fields: metadata.fields ?? [],
            ...(args.type === 'wms'
              ? {layers: metadata.layers.map(layer => ({name: layer.name, title: layer.title}))}
              : {})
          }
        };
      } catch (error) {
        let message = String(error instanceof Error ? error.message : error);
        if (accessToken) {
          for (const secret of [accessToken, encodeURIComponent(accessToken)]) {
            message = message.split(secret).join('[redacted]');
          }
        }
        return {
          success: false,
          commandId: id,
          error: message
        };
      }
    }
  };
}
