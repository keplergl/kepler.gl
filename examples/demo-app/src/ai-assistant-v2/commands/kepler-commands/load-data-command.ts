import type {RoomCommand} from '@sqlrooms/room-store';
import {z} from 'zod';
import {addDataToMap} from '@kepler.gl/actions';
import {readFileInBatches, processFileData, ProcessFileDataContent} from '@kepler.gl/processors';
import {KeplerContext} from '../../types';

export const loadDataCommandId = 'map.load-data' as const;

export function getLoadDataCommand(ctx: KeplerContext): RoomCommand {
  return {
    id: loadDataCommandId,
    name: 'Load data from URL',
    group: 'Map',
    description: 'Load dataset from a URL into kepler.gl.',
    metadata: {readOnly: false, riskLevel: 'medium', requiresConfirmation: true},
    inputSchema: z.object({
      url: z.string().describe('The URL to load data from')
    }) as any,
    execute: async (_execCtx, input) => {
      const {url} = (input ?? {}) as {url: string};
      try {
        try {
          new URL(url);
        } catch {
          throw new Error(`Invalid URL: ${url}`);
        }

        const visState = ctx.getVisState();
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch data from ${url}: ${response.statusText}`);
        }

        const blob = await response.blob();
        const fileName = url.split('/').pop() || 'data';
        const file = new File([blob], fileName);

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