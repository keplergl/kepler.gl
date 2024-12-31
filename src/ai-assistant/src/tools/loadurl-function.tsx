// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {addDataToMap, loadFiles} from '@kepler.gl/actions';
import {ActionHandler} from '@kepler.gl/actions';
import {
  FileCacheItem,
  processFileData,
  ProcessFileDataContent,
  readFileInBatches
} from '@kepler.gl/processors';
import {Loader} from '@loaders.gl/loader-utils';
import React, {ReactNode, useEffect} from 'react';
import {
  CallbackFunctionProps,
  CustomFunctionCall,
  CustomFunctionContext,
  CustomFunctionOutputProps,
  ErrorCallbackResult,
  RegisterFunctionCallingProps
} from '@openassistant/core';

export function loadUrlFunctionDefinition(
  context: CustomFunctionContext<ActionHandler<typeof loadFiles> | Loader[] | object>
): RegisterFunctionCallingProps {
  return {
    name: 'loadUrl',
    description: 'load data from a remote URL',
    properties: {
      url: {
        type: 'string',
        description: 'The URL to load data from'
      }
    },
    required: ['url'],
    callbackFunction: loadUrlCallback,
    callbackFunctionContext: context,
    callbackMessage: customLoadUrlMessageCallback
  };
}

type LoadUrlCallbackResult = {
  success: boolean;
  details: string;
  datasetName: string;
  columnNameAndType: string;
};

type LoadUrlCallbackContext = {
  addDataToMap: ActionHandler<typeof addDataToMap>;
  blob: Blob;
  fileName: string;
  loaders?: Loader[];
  loadOptions?: object;
};

type OutputResultProps = LoadUrlCallbackResult | ErrorCallbackResult;
type OutputDataProps = LoadUrlCallbackContext & {
  parsedData: FileCacheItem[];
};

type LoadUrlCallbackOutput = CustomFunctionOutputProps<OutputResultProps, OutputDataProps>;

type LoadUrlCallbackArgs = {
  url: string;
};

async function loadUrlCallback({
  functionName,
  functionArgs,
  functionContext
}: CallbackFunctionProps): Promise<LoadUrlCallbackOutput> {
  const {url} = functionArgs as LoadUrlCallbackArgs;
  const {addDataToMap, loaders, loadOptions} = functionContext as LoadUrlCallbackContext;

  // check url is valid
  try {
    new URL(url);
  } catch (e) {
    return {
      type: 'loadUrl',
      name: functionName,
      result: {success: false, details: 'Invalid URL'}
    };
  }

  // fetch data from url
  const response = await fetch(url);
  const blob = await response.blob();

  // get file name from url
  const fileName = url.split('/').pop();

  if (!fileName) {
    return {
      type: 'loadUrl',
      name: functionName,
      result: {success: false, details: 'Failed to get file name from url'}
    };
  }

  // Note: we don't use loadFiles([new File([outputData.blob], outputData.fileName)])
  // because we need the metadata e.g. column names of the data to send to the LLM as context
  const fileObj = new File([blob], fileName);
  const batches = await readFileInBatches({
    file: fileObj,
    fileCache: [],
    loaders: loaders ?? [],
    loadOptions: loadOptions ?? {}
  });

  let result = await batches.next();
  let content: ProcessFileDataContent = {data: [], fileName: ''};
  let parsedData: FileCacheItem[] = [];

  while (!result.done) {
    // get progress
    // totalRowCount += result.value.progress.rowCountInBatch;
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

  return {
    type: 'loadUrl',
    name: functionName,
    result: {
      success: true,
      details: `Data loaded successfully from ${url}`,
      datasetName: fileName,
      columnNameAndType: JSON.stringify(columnNameAndType)
    },
    data: {blob, fileName, addDataToMap, parsedData}
  };
}

function LoadUrlMessage({output}: CustomFunctionCall) {
  const outputData = output.data as OutputDataProps;

  useEffect(() => {
    outputData.addDataToMap({
      datasets: outputData.parsedData,
      options: {
        autoCreateLayers: true,
        centerMap: true
      }
    });
  }, [outputData]);

  return <></>;
}

function customLoadUrlMessageCallback(props: CustomFunctionCall): ReactNode | null {
  return <LoadUrlMessage {...props} />;
}
