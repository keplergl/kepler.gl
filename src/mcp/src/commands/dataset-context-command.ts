import type {RoomCommand} from './types';
import {z} from 'zod';
import type {KeplerContext} from './types';

export const datasetContextCommandId = 'map.get-dataset-context' as const;

export function getDatasetContextCommand(ctx: KeplerContext): RoomCommand {
  return {
    id: datasetContextCommandId,
    name: 'Get dataset context',
    group: 'Map',
    description:
      'Get all loaded kepler.gl datasets with their fields and layer configurations. ' +
      'Returns each dataset name, id, field name→type mappings, and the layers ' +
      '(id, label, type, geometryMode, geometryColumns) bound to it.',
    metadata: {readOnly: true, riskLevel: 'low', idempotent: true},
    inputSchema: z.object({}) as any,
    execute: async () => {
      try {
        const context = ctx.getDatasetContext();
        if (!context) {
          return {
            success: false,
            commandId: datasetContextCommandId,
            error: 'No datasets or layers available.',
            data: {
              instruction: 'Please ensure the kepler.gl map has loaded datasets and try again.'
            }
          };
        }
        const datasets = JSON.parse(context.split('\n').slice(1).join('\n'));
        return {
          success: true,
          commandId: datasetContextCommandId,
          data: {
            details: `${datasets.length} dataset(s) loaded.`,
            datasets
          }
        };
      } catch (error) {
        return {
          success: false,
          commandId: datasetContextCommandId,
          error: error instanceof Error ? error.message : 'Unknown error',
          data: {
            instruction: 'Please ensure the kepler.gl map is properly loaded and try again.'
          }
        };
      }
    }
  };
}
