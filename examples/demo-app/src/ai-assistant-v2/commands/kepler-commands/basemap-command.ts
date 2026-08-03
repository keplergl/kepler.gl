import type {RoomCommand} from '@sqlrooms/room-store';
import {z} from 'zod';
import {DEFAULT_MAP_STYLES} from '@kepler.gl/constants';
import {mapStyleChange} from '@kepler.gl/actions';
import {KeplerContext} from '../../types';

export const basemapCommandId = 'map.set-basemap' as const;

export function getBasemapCommand(ctx: KeplerContext): RoomCommand {
  return {
    id: basemapCommandId,
    name: 'Set basemap',
    group: 'Map',
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
    }) as any,
    execute: async (_execCtx, input) => {
      const {styleType} = (input ?? {}) as {styleType: string};
      try {
        if (!DEFAULT_MAP_STYLES.find(style => style.id === styleType)) {
          throw new Error(`Invalid basemap style: ${styleType}.`);
        }
        ctx.dispatch(mapStyleChange(styleType));
        return {
          success: true,
          commandId: basemapCommandId,
          data: {details: `Basemap style changed to ${styleType}.`}
        };
      } catch (error) {
        return {
          success: false,
          commandId: basemapCommandId,
          error: error instanceof Error ? error.message : 'Unknown error',
          data: {
            instruction:
              'Try to fix the error. If the error persists, ask the user to try with a different basemap style.'
          }
        };
      }
    }
  };
}
