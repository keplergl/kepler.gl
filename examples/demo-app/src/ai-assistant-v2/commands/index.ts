import type {RoomCommand} from '@sqlrooms/room-store';
import {KeplerContext} from '../types';
import {getGeoCommands} from './geo-commands';
import {getKeplerCommands} from './kepler-commands';
import {getGeodaAnalysisCommand} from './geoda-analysis-command';
import {getQueryCommands} from './query-commands';
import {getChartCommands} from './chart-commands';
import {getRunSqlCommand} from './run-sql-command';

/**
 * Build the full kepler-ai command catalog for a given `KeplerContext`. Merges
 * the kepler / query / geo / spatial-analysis / chart command sets into one map
 * keyed by command id. Intended for registry registration via
 * `registerCommandsForOwner(store, KEPLER_COMMAND_OWNER, Object.values(...))`.
 *
 * Chart commands (`chart.*`) are routed through `executeApi` like every other
 * command. The histogram renderer dispatches on `commandId` rather than tool
 * name (see `tools/echarts-renderers.tsx`), so no direct AI SDK tools need to
 * be injected into skill sub-agents — `runSkillTool.ts` seeds them with just
 * `executeApi`.
 */
export function getAllCommands(ctx: KeplerContext): Record<string, RoomCommand> {
  return {
    ...getKeplerCommands(ctx),
    ...getQueryCommands(ctx),
    ...getGeoCommands(ctx),
    'geoda.analysis': getGeodaAnalysisCommand(ctx),
    ...getChartCommands(ctx),
    'data.run-sql': getRunSqlCommand()
  };
}

export {getKeplerCommands, KEPLER_COMMAND_OWNER} from './kepler-commands';
export {getGeoCommands} from './geo-commands';
export {getGeodaAnalysisCommand} from './geoda-analysis-command';
export {getQueryCommands} from './query-commands';
export {getChartCommands} from './chart-commands';