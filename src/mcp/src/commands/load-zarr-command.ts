// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';
import {addDataToMap} from '@kepler.gl/actions';
import {ALL_FIELD_TYPES, DatasetType} from '@kepler.gl/constants';
import {getZarrMetadata} from '@kepler.gl/table';
import type {KeplerContext, RoomCommand} from './types';

const inputSchema = z.object({
  url: z.string().min(1).describe('HTTP(S) root URL of a Zarr store, accessible from the browser.'),
  datasetName: z.string().trim().min(1),
  variable: z.string().optional().describe('Optional variable path within the store.')
});

export function getLoadZarrCommand(ctx: KeplerContext): RoomCommand {
  const id = 'map.load-zarr';
  return {
    id,
    name: 'Load Zarr store',
    group: 'Map',
    description:
      'Read Zarr metadata and import a raster dataset without downloading all its chunks. ' +
      'Call map.add-layer with layerType "zarr" and the returned datasetId to visualize it. ' +
      'The store must allow browser access (CORS). Returns variable paths and non-spatial dimensions.',
    metadata: {readOnly: false, riskLevel: 'medium'},
    inputSchema,
    execute: async (execution, input) => {
      try {
        const args = inputSchema.parse(input);
        const url = new URL(args.url);
        if (!['http:', 'https:'].includes(url.protocol)) {
          throw new Error('Zarr store URL must use HTTP(S).');
        }
        if (execution.signal?.aborted) throw new Error('Zarr import cancelled.');
        const metadata = await getZarrMetadata(url.href, {
          variable: args.variable,
          signal: execution.signal
        });
        if (execution.signal?.aborted) throw new Error('Zarr import cancelled.');
        const datasetId = `zarr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        ctx.dispatch(
          addDataToMap({
            datasets: [
              {
                info: {
                  id: datasetId,
                  label: args.datasetName,
                  type: DatasetType.ZARR,
                  format: 'rows'
                },
                data: {fields: [], rows: []},
                metadata,
                supportedFilterTypes: [
                  ALL_FIELD_TYPES.real,
                  ALL_FIELD_TYPES.integer,
                  ALL_FIELD_TYPES.boolean
                ],
                disableDataOperation: true
              }
            ],
            options: {autoCreateLayers: false, centerMap: false}
          })
        );
        return {
          success: true,
          commandId: id,
          data: {
            datasetId,
            datasetName: args.datasetName,
            variables: metadata.variables.map(v => ({
              path: v.path,
              name: v.displayName,
              dimensions: v.nonSpatialDims.map(d => ({name: d.name, size: d.size, kind: d.kind})),
              dataRange: v.dataRange
            }))
          }
        };
      } catch (error) {
        return {
          success: false,
          commandId: id,
          error: error instanceof Error ? error.message : String(error)
        };
      }
    }
  };
}
