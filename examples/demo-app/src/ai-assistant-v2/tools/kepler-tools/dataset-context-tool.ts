import {tool} from '../ai-tool-shim';
import {z} from 'zod';
import {KeplerContext} from '../../types';
import {getDatasetContext} from '../utils';

export function getDatasetContextTool(ctx: KeplerContext) {
  return tool({
    description:
      'Get all loaded kepler.gl datasets with their fields and layer configurations. ' +
      'Returns each dataset name, id, field name→type mappings, and the layers ' +
      '(id, label, type, geometryMode, geometryColumns) bound to it.',
    inputSchema: z.object({}),
    execute: async (_args, {abortSignal}) => {
      try {
        abortSignal?.throwIfAborted();
        const visState = ctx.getVisState();
        const context = getDatasetContext(visState?.datasets, visState?.layers);
        if (!context) {
          return {
            success: false,
            error: 'No datasets or layers available.',
            instruction: 'Please ensure the kepler.gl map has loaded datasets and try again.'
          };
        }
        const datasets = JSON.parse(context.split('\n').slice(1).join('\n'));
        return {
          success: true,
          details: `${datasets.length} dataset(s) loaded.`,
          datasets
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
