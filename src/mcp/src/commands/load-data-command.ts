import type {RoomCommand} from './types';
import {z} from 'zod';
import {addDataToMap} from '@kepler.gl/actions';
import {readFileInBatches, processFileData} from '@kepler.gl/processors';
import type {ProcessFileDataContent} from '@kepler.gl/processors';
import type {KeplerContext} from './types';

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
      'name it here with `datasetName` instead, or use the URL-filename dataset as-is.',
    metadata: {readOnly: false, riskLevel: 'medium', requiresConfirmation: true},
    inputSchema: z.object({
      url: z.string().describe('The URL to load data from'),
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
        try {
          new URL(url);
        } catch {
          throw new Error(`Invalid URL: ${url}`);
        }

        const visState = ctx.getVisState();
        // Thread the caller's AbortSignal into the fetch so WebMCP/bridge
        // cancellations stop long-running loads instead of letting them hang.
        const response = await fetch(url, {signal: execCtx?.signal});
        if (!response.ok) {
          throw new Error(`Failed to fetch data from ${url}: ${response.statusText}`);
        }

        const blob = await response.blob();
        // Derive the filename from the URL pathname so query strings (e.g.
        // `data.csv?x=1`) don't end up in the dataset name.
        const fileName = new URL(url).pathname.split('/').pop() || 'data';
        const file = new File([blob], fileName);
        // Preserve the source URL so processors hash by URL (avoiding dataset-id
        // collisions between same-named files) and can attach externally-hosted
        // metadata — mirrors loadExternallyHostedDataset.
        (file as File & {keplerSourceUrl?: string}).keplerSourceUrl = url;

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
