// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {RoomCommand} from './types';
import {z} from 'zod';
import {MapViewMode} from '@kepler.gl/constants';
import {setMapViewMode} from '@kepler.gl/actions';
import type {KeplerContext} from './types';

export const viewModeCommandId = 'map.set-view-mode' as const;

/** Agent-facing names for the three camera modes. */
const VIEW_MODE_BY_INPUT: Record<string, MapViewMode> = {
  '2d': MapViewMode.MODE_2D,
  '3d': MapViewMode.MODE_3D,
  globe: MapViewMode.MODE_GLOBE
};

/**
 * Accept the short names (`2d`, `3d`, `globe`) as well as the enum values
 * (`MODE_2D`, …) — the bridge and WebMCP callers reach execute without zod
 * parsing, so the runtime guard must understand both.
 */
function resolveViewMode(input: unknown): MapViewMode | null {
  if (typeof input !== 'string') return null;
  const short = input.toLowerCase();
  if (VIEW_MODE_BY_INPUT[short]) return VIEW_MODE_BY_INPUT[short];
  return (Object.values(MapViewMode) as string[]).includes(input) ? (input as MapViewMode) : null;
}

export function getViewModeCommand(ctx: KeplerContext): RoomCommand {
  return {
    id: viewModeCommandId,
    name: 'Set map view mode',
    group: 'Map',
    description: `Switch the map between the flat 2D map, the tilted 3D map and the 3D globe.
- '2d': flat map, no tilt.
- '3d': flat map tilted (pitch 50), for extruded/3D layers.
- 'globe': the 3D globe — use it when the data spans the world and the user is looking at global patterns.
Globe support: point, arc, line, trip, cluster, hexagon, grid, geojson and vector-tile layers render on the globe. The 'flow' and 'flowField' layers are NOT supported there yet (flow arrows collapse edge-on; flow field clipping is mercator-only), so keep those on the 2d/3d map.`,
    metadata: {readOnly: false, riskLevel: 'low', idempotent: true},
    inputSchema: z.object({
      mode: z.enum(['2d', '3d', 'globe'])
    }) as any,
    execute: async (_execCtx, input) => {
      const {mode} = (input ?? {}) as {mode: unknown};
      const viewMode = resolveViewMode(mode);
      if (!viewMode) {
        return {
          success: false,
          commandId: viewModeCommandId,
          error: `Invalid view mode: ${String(mode)}. Use "2d", "3d" or "globe".`,
          data: {
            instruction: 'Call map.set-view-mode with mode "2d", "3d" or "globe".'
          }
        };
      }

      ctx.dispatch(setMapViewMode(viewMode));
      const label =
        viewMode === MapViewMode.MODE_GLOBE
          ? '3D globe'
          : viewMode === MapViewMode.MODE_3D
          ? '3D tilted map'
          : '2D flat map';
      return {
        success: true,
        commandId: viewModeCommandId,
        data: {details: `Map view switched to ${label}.`}
      };
    }
  };
}
