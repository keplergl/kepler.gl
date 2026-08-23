import type {RoomCommand} from '@sqlrooms/room-store';
import {z} from 'zod';
import {KeplerContext} from '../../types';
import {loadTableToKepler} from '../../tools/duckdb-cache';

export const saveDataCommandId = 'map.save-data' as const;

export function getSaveDataCommand(ctx: KeplerContext): RoomCommand {
  return {
    id: saveDataCommandId,
    name: 'Save DuckDB table to map',
    group: 'Map',
    description:
      'Save a DuckDB table to kepler.gl as a map dataset. Works with any table including those from buffer, zipcode, county, state, isochrone, routing, query results, etc.',
    metadata: {readOnly: false, riskLevel: 'medium', requiresConfirmation: true},
    inputSchema: z.object({
      datasetNames: z
        .array(z.string())
        .describe('The names of the DuckDB tables to load into kepler.gl.')
    }) as any,
    execute: async (_execCtx, input) => {
      const {datasetNames} = (input ?? {}) as {datasetNames: string[]};
      try {
        const loadedDatasetNames: string[] = [];

        for (const datasetName of datasetNames) {
          const result = await loadTableToKepler(ctx, datasetName);
          if (!result.success) {
            throw new Error(`Cannot save table "${datasetName}" to kepler.gl: ${result.error}`);
          }
          loadedDatasetNames.push(datasetName);
        }

        if (loadedDatasetNames.length === 0) {
          throw new Error(`No datasets found from ${datasetNames.join(', ')}`);
        }

        return {
          success: true,
          commandId: saveDataCommandId,
          data: {
            savedDatasetNames: loadedDatasetNames,
            details: `Successfully saved dataset(s): ${loadedDatasetNames.join(', ')} in kepler.gl`
          }
        };
      } catch (error) {
        return {
          success: false,
          commandId: saveDataCommandId,
          error: `Cannot save data to kepler.gl: ${error}`
        };
      }
    }
  };
}