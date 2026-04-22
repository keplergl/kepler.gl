// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {tool} from 'ai';
import {z} from 'zod';
import {KeplerContext} from '../../types';

export function getMapBoundaryTool(ctx: KeplerContext) {
  return tool({
    description:
      'Get the boundary of the map. Northwest and Southeast coordinates in [longitude, latitude] format.',
    inputSchema: z.object({}),
    execute: async () => {
      try {
        const boundary = ctx.getMapBoundary();
        if (!boundary) {
          return {
            success: false,
            error: 'Map boundary not available.',
            instruction: 'Please ensure the kepler.gl map is properly loaded and try again.'
          };
        }
        return {
          success: true,
          details: `Map boundary retrieved. NW: [${boundary.nw[0]}, ${boundary.nw[1]}], SE: [${boundary.se[0]}, ${boundary.se[1]}]`,
          boundary
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          instruction: 'Please ensure the kepler.gl map is properly loaded and try again.'
        };
      }
    }
  });
}
