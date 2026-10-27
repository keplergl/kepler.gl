import type {RoomCommand} from './types';
import {z} from 'zod';
import type {KeplerContext} from './types';

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
        .min(1)
        .describe('The names of the DuckDB tables to load into kepler.gl.')
    }) as any,
    execute: async (_execCtx, input) => {
      const {datasetNames} = (input ?? {}) as {datasetNames: string[]};
      try {
        // Runtime guard: the bridge/webMCP call execute without zod parsing,
        // so a missing/empty/wrong-typed datasetNames must not fall through to
        // a confusing TypeError or an unhelpful "No datasets found…" message.
        if (
          !Array.isArray(datasetNames) ||
          datasetNames.length === 0 ||
          datasetNames.some(name => typeof name !== 'string' || name.length === 0)
        ) {
          throw new Error(
            'datasetNames must be a non-empty array of DuckDB table names, e.g. ["my_table"].'
          );
        }

        const loadedDatasetNames: string[] = [];

        for (const datasetName of datasetNames) {
          const result = await ctx.loadTableToKepler(datasetName);
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
          error: `Cannot save data to kepler.gl: ${
            error instanceof Error ? error.message : String(error)
          }`
        };
      }
    }
  };
}
