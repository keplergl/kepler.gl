
import {tool} from 'ai';
import {z} from 'zod';
import {KeplerContext} from '../../types';
import {loadTableToKepler} from '../duckdb-cache';

export function getSaveDataTool(ctx: KeplerContext) {
  return tool({
    description:
      'Save a DuckDB table to kepler.gl as a map dataset. Works with any table including those from buffer, zipcode, county, state, isochrone, routing, query results, etc.',
    inputSchema: z.object({
      datasetNames: z.array(z.string()).describe('The names of the DuckDB tables to load into kepler.gl.')
    }),
    execute: async ({datasetNames}, {abortSignal}) => {
      try {
        abortSignal?.throwIfAborted();
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
          savedDatasetNames: loadedDatasetNames,
          details: `Successfully saved dataset(s): ${loadedDatasetNames.join(', ')} in kepler.gl`
        };
      } catch (error) {
        return {
          success: false,
          error: `Cannot save data to kepler.gl: ${error}`
        };
      }
    }
  });
}
