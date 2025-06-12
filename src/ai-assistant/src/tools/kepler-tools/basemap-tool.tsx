// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {DEFAULT_MAP_STYLES} from '@kepler.gl/constants';
import {mapStyleChange} from '@kepler.gl/actions';
import {extendedTool} from '@openassistant/utils';
import {z} from 'zod';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';

export const basemap = extendedTool({
  description: 'change basemap',
  parameters: z.object({
    styleType: z.enum([
      'no_map',
      'dark-matter',
      'positron',
      'voyager',
      'satellite',
      'dark',
      'light',
      'muted',
      'muted_night'
    ])
  }),
  execute: executeBasemap,
  component: BasemapToolComponent
});

export type BasemapTool = typeof basemap;

type ExecuteBasemapResult = {
  llmResult: {
    success: boolean;
    styleType: string;
    details?: string;
    instruction?: string;
  };
  additionalData?: {
    styleType: string;
  };
};

async function executeBasemap({styleType}): Promise<ExecuteBasemapResult> {
  try {
    // check if styleType is valid
    if (!DEFAULT_MAP_STYLES.find(style => style.id === styleType)) {
      throw new Error(`Invalid basemap style: ${styleType}.`);
    }

    return {
      llmResult: {
        success: true,
        styleType,
        details: `basemap style changed to ${styleType}.`
      },
      additionalData: {
        styleType
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

export function BasemapToolComponent({styleType}) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(mapStyleChange(styleType));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
