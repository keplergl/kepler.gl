import type {RoomCommand} from '@sqlrooms/room-store';
import {z} from 'zod';
import {KeplerContext} from '../../types';

export const mapBoundaryCommandId = 'map.get-boundary' as const;

export function getMapBoundaryCommand(ctx: KeplerContext): RoomCommand {
  return {
    id: mapBoundaryCommandId,
    name: 'Get map boundary',
    group: 'Map',
    description:
      'Get the boundary of the map. Northwest and Southeast coordinates in [longitude, latitude] format.',
    metadata: {readOnly: true, riskLevel: 'low', idempotent: true},
    inputSchema: z.object({}) as any,
    execute: async () => {
      try {
        const boundary = ctx.getMapBoundary();
        if (!boundary) {
          return {
            success: false,
            commandId: mapBoundaryCommandId,
            error: 'Map boundary not available.',
            data: {
              instruction:
                'Please ensure the kepler.gl map is properly loaded and try again.'
            }
          };
        }
        return {
          success: true,
          commandId: mapBoundaryCommandId,
          data: {
            details: `Map boundary retrieved. NW: [${boundary.nw[0]}, ${boundary.nw[1]}], SE: [${boundary.se[0]}, ${boundary.se[1]}]`,
            boundary
          }
        };
      } catch (error) {
        return {
          success: false,
          commandId: mapBoundaryCommandId,
          error: error instanceof Error ? error.message : 'Unknown error',
          data: {
            instruction: 'Please ensure the kepler.gl map is properly loaded and try again.'
          }
        };
      }
    }
  };
}