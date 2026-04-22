// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {tool} from 'ai';
import {z} from 'zod';
import {DEFAULT_MAP_STYLES} from '@kepler.gl/constants';
import {mapStyleChange} from '@kepler.gl/actions';
import {KeplerContext} from '../../types';

export function getBasemapTool(ctx: KeplerContext) {
  return tool({
    description: 'Change the basemap style of the kepler.gl map.',
    inputSchema: z.object({
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
    execute: async ({styleType}) => {
      try {
        if (!DEFAULT_MAP_STYLES.find(style => style.id === styleType)) {
          throw new Error(`Invalid basemap style: ${styleType}.`);
        }
        ctx.dispatch(mapStyleChange(styleType));
        return {
          success: true,
          details: `Basemap style changed to ${styleType}.`
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          instruction:
            'Try to fix the error. If the error persists, ask the user to try with a different basemap style.'
        };
      }
    }
  });
}
