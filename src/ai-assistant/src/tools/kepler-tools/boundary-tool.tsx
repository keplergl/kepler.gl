import {tool} from '@openassistant/core';
import {z} from 'zod';

export const mapBoundary = tool({
  description:
    'Get the boundary of the map. Northwest and Southeast coordinates in [longitude, latitude] format.',
  parameters: z.object({}),
  execute: async (args, options) => {
    try {
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
