// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {extendedTool} from '@openassistant/utils';
import {z} from 'zod';

type MapBoundaryContext = {
  getMapBoundary: () => {
    nw: [number, number];
    se: [number, number];
  };
};

function isMapBoundaryContext(context: unknown): context is MapBoundaryContext {
  return typeof context === 'object' && context !== null && 'getMapBoundary' in context;
}

export const mapBoundary = extendedTool({
  description:
    'Get the boundary of the map. Northwest and Southeast coordinates in [longitude, latitude] format.',
  parameters: z.object({}),
  execute: async (args, options) => {
    try {
      if (!options?.context || !isMapBoundaryContext(options.context)) {
        throw new Error('context getMapBoundary() not implemented.');
      }
      const {getMapBoundary} = options.context;
      const boundary = getMapBoundary();
      return {
        llmResult: {
          success: true,
          boundary
        }
      };
    } catch (error) {
      return {
        llmResult: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          instruction:
            'Please ask the user to make sure the kepler.gl app has been intialized successfully to get the map boundary.'
        }
      };
    }
  },
  context: {
    getMapBoundary: () => {
      throw new Error('getMapBoundary() not implemented.');
    }
  }
});
