// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {tool} from 'ai';
import {z} from 'zod';
import {addDataToMap} from '@kepler.gl/actions';
import {readFileInBatches, processFileData, ProcessFileDataContent} from '@kepler.gl/processors';
import {KeplerContext} from '../../types';

export function getLoadDataTool(ctx: KeplerContext) {
  return tool({
    description: 'Load dataset from a URL into kepler.gl.',
    inputSchema: z.object({
      url: z.string().describe('The URL to load data from')
    }),
    execute: async ({url}) => {
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
            options: {autoCreateLayers: true, centerMap: true}
          })
        );

        const dataInfo = parsedData[0]?.info;
        return {
          success: true,
          details: `Successfully loaded data from ${url}`,
          dataInfo
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          instruction:
            'Try to fix the error. If the error persists, ask the user to try with a different URL or format.'
        };
      }
    }
  });
}
