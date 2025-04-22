// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {tool} from '@openassistant/core';
import {z} from 'zod';
import {addDataToMap} from '@kepler.gl/actions';
import {ActionHandler} from '@kepler.gl/actions';
import {Loader} from '@loaders.gl/loader-utils';
import {ProtoDataset} from '@kepler.gl/types';
import {readFileInBatches, processFileData, ProcessFileDataContent} from '@kepler.gl/processors';

export const loadData = tool<
  // parameters of the tool
  z.ZodObject<{
    url: z.ZodString;
  }>,
  // return type of the tool
  ExecuteLoadDataResult['llmResult']
>({
  description: 'load data from a URL or file',
  parameters: z.object({
    url: z.string().describe('The URL or file path to load data from')
  }),
  execute: executeLoadData
});

type ExecuteLoadDataResult = {
  llmResult: {
    success: boolean;
    url: string;
    details?: string;
    dataInfo?: object;
    columnNameAndType?: string;
    instruction?: string;
  };
};

type LoadDataFunctionContext = {
  addDataToMap: ActionHandler<typeof addDataToMap>;
  loaders?: Loader[];
  loadOptions?: object;
};

function isLoadDataContext(context: any): context is LoadDataFunctionContext {
  return context && typeof context.addDataToMap === 'function';
}

async function executeLoadData({url}, options): Promise<ExecuteLoadDataResult> {
  try {
    if (!isLoadDataContext(options.context)) {
      throw new Error('Invalid load data context. Please provide a valid context.');
    }

    const {addDataToMap, loaders, loadOptions} = options.context;

    // Validate URL
    try {
      new URL(url);
    } catch (e) {
      throw new Error(`Invalid URL: ${url}`);
    }

    // Fetch data
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url}: ${response.statusText}`);
    }

    const blob = await response.blob();
    const fileName = url.split('/').pop() || 'data';

    // Create file object
    const file = new File([blob], fileName);

    // Process file data
    const batches = await readFileInBatches({
      file,
      fileCache: [],
      loaders: loaders ?? [],
      loadOptions: loadOptions ?? {}
    });

    let result = await batches.next();
    let content: ProcessFileDataContent = {data: [], fileName: ''};
    let parsedData: ProtoDataset[] = [];

    while (!result.done) {
      content = result.value as ProcessFileDataContent;
      result = await batches.next();
      if (result.done) {
        parsedData = await processFileData({
          content,
          fileCache: []
        });
        break;
      }
    }

    const data = parsedData[0].data;
    const columnNameAndType = data.fields.map(field => ({name: field.name, type: field.type}));
    const dataInfo = parsedData[0].info;

    // Add data to map
    await addDataToMap({
      datasets: parsedData,
      options: {
        autoCreateLayers: true,
        centerMap: true
      }
    });

    return {
      llmResult: {
        success: true,
        url,
        details: `Successfully loaded data from ${url}`,
        dataInfo,
        columnNameAndType: JSON.stringify(columnNameAndType)
      }
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      llmResult: {
        success: false,
        url,
        details: `Error loading data: ${errorMessage}`,
        instruction:
          'Try to fix the error. If the error persists, pause the execution and ask the user to try with different URL or format.'
      }
    };
  }
}
