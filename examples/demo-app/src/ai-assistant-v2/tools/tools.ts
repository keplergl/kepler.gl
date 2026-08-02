import type {RoomCommand} from '@sqlrooms/room-store';
import {KeplerContext} from '../types';
import {getGeoTools} from './geo-tools';
import {getKeplerTools} from './kepler-tools';
import {getSpatialAnalysisTools} from './spatial-analysis-tools';
import {getQueryTools} from './query-tool';

/**
 * Build the full kepler-ai command catalog for a given `KeplerContext`. Merges
 * the kepler / query / geo / spatial-analysis command sets into one map keyed
 * by command id. Intended for registry registration via
 * `registerCommandsForOwner(store, KEPLER_COMMAND_OWNER, Object.values(...))`.
 *
 * ECharts tools are NOT included here — they remain direct AI SDK tools because
 * a chart's deliverable is the React component and its tool name must survive to
 * the UI for the right renderer to be selected. See `runSkillTool.ts`.
 */
export function getAllCommands(ctx: KeplerContext): Record<string, RoomCommand> {
  return {
    ...getKeplerTools(ctx),
    ...getQueryTools(ctx),
    ...getGeoTools(ctx),
    ...getSpatialAnalysisTools(ctx)
  };
}

export {getKeplerTools, KEPLER_COMMAND_OWNER} from './kepler-tools';
export {getGeoTools} from './geo-tools';
export {getSpatialAnalysisTools} from './spatial-analysis-tools';
export {getQueryTools} from './query-tool';
