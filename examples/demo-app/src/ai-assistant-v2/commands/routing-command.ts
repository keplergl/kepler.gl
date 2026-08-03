import type {RoomCommand} from '@sqlrooms/room-store';
import {z} from 'zod';
import {KeplerContext} from '../types';
import {FETCH_TIMEOUT_MS, combineSignals, mapboxRateLimiter} from '../tools/utils';

export const routingCommandId = 'geo.routing' as const;

export function getRoutingCommand(
  ctx: KeplerContext,
  onToolCompleted: (toolName: string, result: any) => Promise<void>
): RoomCommand {
  return {
    id: routingCommandId,
    name: 'Routing directions',
    group: 'Geo',
    description: 'Get routing directions between two coordinates using Mapbox Directions API.',
    inputSchema: z.object({
      origin: z.object({longitude: z.number(), latitude: z.number()}),
      destination: z.object({longitude: z.number(), latitude: z.number()}),
      mode: z.enum(['driving', 'walking', 'cycling']).optional(),
      datasetName: z.string().describe('Name for the output dataset')
    }) as any,
    execute: async (_execCtx, input) => {
      const {origin, destination, mode = 'driving', datasetName} = (input ?? {}) as {
        origin: {longitude: number; latitude: number};
        destination: {longitude: number; latitude: number};
        mode?: 'driving' | 'walking' | 'cycling';
        datasetName: string;
      };
      // RoomCommandExecutionContext has no abortSignal; use a timeout-only signal.
      const {signal, cleanup} = combineSignals(FETCH_TIMEOUT_MS, undefined);
      try {
        const mapboxToken = ctx.getMapboxToken();
        if (!mapboxToken) throw new Error('Mapbox token is not configured');
        await mapboxRateLimiter.waitForNextCall();
        const url = `https://api.mapbox.com/directions/v5/mapbox/${mode}/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?geometries=geojson&access_token=${mapboxToken}`;
        const response = await fetch(url, {signal});
        if (!response.ok) throw new Error(`Mapbox API error: ${response.status}`);
        const data = await response.json();
        if (!data.routes || data.routes.length === 0) {
          return {success: false, commandId: routingCommandId, error: 'No routes found'};
        }
        const route = data.routes[0];
        const geojson = {
          type: 'FeatureCollection' as const,
          features: [
            {
              type: 'Feature' as const,
              geometry: {type: 'LineString' as const, coordinates: route.geometry.coordinates},
              properties: {}
            }
          ]
        };
        await onToolCompleted(datasetName, {type: 'geojson', content: geojson});
        return {
          success: true,
          commandId: routingCommandId,
          data: {
            datasetName,
            distance: route.distance,
            duration: route.duration,
            details: `Routing directions saved as ${datasetName}.`
          }
        };
      } catch (error) {
        return {
          success: false,
          commandId: routingCommandId,
          error: `Failed to get routing: ${error}`
        };
      } finally {
        cleanup();
      }
    }
  };
}