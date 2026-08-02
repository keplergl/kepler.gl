import type {RoomCommand} from '@sqlrooms/room-store';
import {KeplerContext} from '../../types';
import {getBasemapTool} from './basemap-tool';
import {getMapBoundaryTool} from './boundary-tool';
import {getAddLayerTool} from './layer-creation-tool';
import {getUpdateLayerColorTool} from './layer-style-tool';
import {getLoadDataTool} from './load-data-tool';
import {getSaveDataTool} from './save-data-tool';
import {getTableTool} from './table-tool';
import {getAddTimeFilterTool} from './time-filter-tool';
import {getToggleTimeFilterTool} from './toggle-time-filter-tool';
import {getSplitViewTool} from './split-view-tool';
import {getDatasetContextTool} from './dataset-context-tool';

/**
 * Owner string under which all kepler-ai commands are registered in the
 * room-store command registry. Used by `registerCommandsForOwner` /
 * `unregisterCommandsForOwner` in store.ts.
 */
export const KEPLER_COMMAND_OWNER = 'kepler-ai';

/**
 * Build the kepler-gl map-mutation commands for a given `KeplerContext`.
 * Returns a map keyed by command id (e.g. `map.set-basemap`) so the registry
 * registration is a flat merge.
 */
export function getKeplerTools(ctx: KeplerContext): Record<string, RoomCommand> {
  const commands = [
    getBasemapTool(ctx),
    getMapBoundaryTool(ctx),
    getAddLayerTool(ctx),
    getUpdateLayerColorTool(ctx),
    getLoadDataTool(ctx),
    getSaveDataTool(ctx),
    getTableTool(ctx),
    getAddTimeFilterTool(ctx),
    getToggleTimeFilterTool(ctx),
    getSplitViewTool(ctx),
    getDatasetContextTool(ctx)
  ];
  return Object.fromEntries(commands.map(c => [c.id, c]));
}

export {getBasemapTool} from './basemap-tool';
export {getMapBoundaryTool} from './boundary-tool';
export {getAddLayerTool, guessDefaultLayer} from './layer-creation-tool';
export {getUpdateLayerColorTool} from './layer-style-tool';
export {getLoadDataTool} from './load-data-tool';
export {getSaveDataTool} from './save-data-tool';
export {getTableTool} from './table-tool';
export {getAddTimeFilterTool} from './time-filter-tool';
export {getToggleTimeFilterTool} from './toggle-time-filter-tool';
export {getSplitViewTool} from './split-view-tool';
export {getDatasetContextTool} from './dataset-context-tool';
