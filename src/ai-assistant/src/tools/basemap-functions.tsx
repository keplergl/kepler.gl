// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {DEFAULT_MAP_STYLES} from '@kepler.gl/constants';
import {tool} from '@openassistant/core';
import {z} from 'zod';

export const basemap = tool<
  // parameters of the tool
  z.ZodObject<{
    styleType: z.ZodEnum<
      [
        'dark-matter',
        'dark-matter-nolabels',
        'no_map',
        'positron',
        'positron-nolabels',
        'voyager',
        'voyager-nolabels'
      ]
    >;
  }>,
  // return type of the tool
  ExecuteBasemapResult['llmResult']
>({
  description: 'change basemap',
  parameters: z.object({
    styleType: z.enum([
      'dark-matter',
      'dark-matter-nolabels',
      'no_map',
      'positron',
      'positron-nolabels',
      'voyager',
      'voyager-nolabels'
    ])
  }),
  execute: executeBasemap
});

type ExecuteBasemapResult = {
  llmResult: {
    success: boolean;
    styleType: string;
    details?: string;
    instruction?: string;
  };
};

type BasemapFunctionContext = {
  mapStyleChange: (styleType: string) => void;
};

function isBasemapContext(context: any): context is BasemapFunctionContext {
  return typeof context.mapStyleChange === 'function';
}

async function executeBasemap({styleType}, options): Promise<ExecuteBasemapResult> {
  try {
    if (!isBasemapContext(options.context)) {
      throw new Error('Invalid basemap context. Please provide a valid context.');
    }

    const {mapStyleChange} = options.context;

    // check if styleType is valid
    if (!DEFAULT_MAP_STYLES.find(style => style.id === styleType)) {
      throw new Error(`Invalid basemap style: ${styleType}.`);
    }

    // change the basemap style
    mapStyleChange(styleType);

    return {
      llmResult: {
        success: true,
        styleType,
        details: `Yes, I can help to change the basemap style to ${styleType}.`
      }
    };
  } catch (error) {
    return {
      llmResult: {
        success: false,
        styleType,
        details: `Error changing basemap style: ${error}`,
        instruction:
          'Try to fix the error. If the error persists, pause the execution and ask the user to try with different prompt and context.'
      }
    };
  }
}
