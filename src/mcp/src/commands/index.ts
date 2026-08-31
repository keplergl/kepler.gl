import type {RoomCommand} from './types';
import type {KeplerContext} from './types';
import {getBasemapCommand} from './basemap-command';
import {getMapBoundaryCommand} from './boundary-command';
import {getAddLayerCommand} from './layer-creation-command';
import {getUpdateLayerColorCommand} from './layer-style-command';
import {getLoadDataCommand} from './load-data-command';
import {getSaveDataCommand} from './save-data-command';
import {getTableCommand} from './table-command';
import {getAddColumnCommand} from './add-column-command';
import {getAddTimeFilterCommand} from './time-filter-command';
import {getToggleTimeFilterCommand} from './toggle-time-filter-command';
import {getSplitViewCommand} from './split-view-command';
import {getDatasetContextCommand} from './dataset-context-command';

/**
 * Owner string under which all kepler-ai commands are registered in the
 * room-store command registry. Used by `registerCommandsForOwner` /
 * `unregisterCommandsForOwner` in the host's store wiring.
 */
export const KEPLER_COMMAND_OWNER = 'kepler-ai';

/**
 * Build the kepler-gl map-mutation commands for a given `KeplerContext`.
 * Returns a map keyed by command id (e.g. `map.set-basemap`) so the registry
 * registration is a flat merge.
 */
export function getKeplerCommands(ctx: KeplerContext): Record<string, RoomCommand> {
  const commands = [
    getBasemapCommand(ctx),
    getMapBoundaryCommand(ctx),
    getAddLayerCommand(ctx),
    getUpdateLayerColorCommand(ctx),
    getLoadDataCommand(ctx),
    getSaveDataCommand(ctx),
    getTableCommand(ctx),
    getAddColumnCommand(ctx),
    getAddTimeFilterCommand(ctx),
    getToggleTimeFilterCommand(ctx),
    getSplitViewCommand(ctx),
    getDatasetContextCommand(ctx)
  ];
  return Object.fromEntries(commands.map(c => [c.id, c]));
}

export {getBasemapCommand} from './basemap-command';
export {getMapBoundaryCommand} from './boundary-command';
export {getAddLayerCommand, guessDefaultLayer} from './layer-creation-command';
export {getUpdateLayerColorCommand} from './layer-style-command';
export {getLoadDataCommand} from './load-data-command';
export {getSaveDataCommand} from './save-data-command';
export {getTableCommand} from './table-command';
export {getAddColumnCommand} from './add-column-command';
export {getAddTimeFilterCommand} from './time-filter-command';
export {getToggleTimeFilterCommand} from './toggle-time-filter-command';
export {getSplitViewCommand} from './split-view-command';
export {getDatasetContextCommand} from './dataset-context-command';
export {toolToCommand, asInputSchema} from './command-wrappers';
export type {AnyTool, CommandMeta} from './command-wrappers';
export type {KeplerContext, KeplerStateAccessors, VisState} from './types';
export {
  datasetNameToTableName,
  convertArrowRowToObject,
  arrowTableToObjects,
  tableToLLMResult,
  formatResultsForLLM,
  NUMBER_OF_ROWS_RETURN_TO_LLM,
  LLM_PREVIEW_MAX_TOTAL_LENGTH,
  LLM_PREVIEW_MAX_VALUE_LENGTH,
  getValuesFromDataset,
  getValuesFromVectorTileLayer,
  isObjectColumn,
  isVectorTileLayer,
  stringifyObjectColumn,
  restoreObjectColumns,
  buildAddColumnPayload
} from './utils';
