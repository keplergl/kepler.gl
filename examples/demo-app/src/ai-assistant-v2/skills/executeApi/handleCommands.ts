/**
 * The routing core for the `executeApi` command dispatcher.
 *
 * Adapts `spatial-agent/src/skills/executeApi/handleCommands.ts` to the
 * demo-app's tool surface. Unlike spatial-agent (which has host-injected
 * command tools + built-in virtual commands), every command here is built-in:
 * the handler forwards `input` to an existing demo-app tool's `execute`,
 * then applies that tool's `toModelOutput` (if any) so token-trimming behavior
 * is preserved. No tool logic is duplicated.
 */

import {z} from 'zod';
import type {KeplerContext} from '../../types';
import {getQueryTools} from '../../tools/query-tool';
import {getKeplerTools} from '../../tools/kepler-tools';
import {getGeoTools} from '../../tools/geo-tools';
import {getSpatialAnalysisTools} from '../../tools/spatial-analysis-tools';
import {
  defineHandler,
  type ApiHandler,
  type ExecuteApiContext,
  type ExecuteApiOutput
} from './types';

/** A built AI SDK tool, treated loosely for dynamic dispatch. */
type AnyTool = {
  execute?: (args: any, options: any) => Promise<any>;
  toModelOutput?: (params: {output: any; toolCallId?: string}) => any;
  description?: string;
  inputSchema?: z.ZodType;
};

/**
 * Build a forwarder handler for one existing tool. The handler validates
 * `input` against the tool's own `inputSchema`, calls `execute`, then applies
 * `toModelOutput` if present (preserving the token-trimming the old
 * `skillTools.ts` dispatcher applied).
 */
function forwardToTool(tool: AnyTool): ApiHandler {
  return {
    argsSchema: (tool.inputSchema ?? z.record(z.unknown())) as z.ZodType,
    run: async (ctx: ExecuteApiContext): Promise<ExecuteApiOutput> => {
      if (!tool.execute || typeof tool.execute !== 'function') {
        return {
          success: false,
          error: 'Tool has no execute function.'
        };
      }
      try {
        const rawOutput = await tool.execute(ctx.args, {
          abortSignal: ctx.abortSignal,
          toolCallId: 'executeApi'
        });
        const trimmed =
          typeof tool.toModelOutput === 'function'
            ? tool.toModelOutput({output: rawOutput, toolCallId: 'executeApi'})
            : rawOutput;
        // `toModelOutput` already collapses to the model-facing subset; return
        // it directly so `index.ts`'s `toModelOutput` can surface the same
        // fields. Preserve `success` from the raw output (trimmed output may
        // omit it on success paths).
        return {
          ...(typeof trimmed === 'object' && trimmed !== null ? trimmed : {details: trimmed}),
          success: rawOutput?.success ?? true
        } as ExecuteApiOutput;
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : String(error),
          instruction:
            'Please explain the error and give a plan to fix it. Then try again with different arguments.'
        };
      }
    }
  };
}

/**
 * The full command catalog. Each entry maps a `commandId` to a forwarder
 * handler for one existing demo-app tool. Built once per `createExecuteApiTool`
 * call (the tool sets are parameterized by `KeplerContext`).
 *
 * Command id conventions:
 *  - `map.*`   — kepler.gl map-mutation tools (basemap, layers, data, boundary)
 *  - `data.*`  — DuckDB SQL tools (query, filter, table, merge, load-to-map)
 *  - `geoda.*` — GeoDa spatial-analysis tools (lisa, moran, weights, regression, standardize, rate)
 *  - `geo.*`   — geo tools (routing, isochrone, geocode, spatial-query, grid, boundaries, roads)
 */
function buildCommandHandlerMap(ctx: KeplerContext): Record<string, ApiHandler> {
  const queryTools = getQueryTools(ctx) as Record<string, AnyTool>;
  const keplerTools = getKeplerTools(ctx) as Record<string, AnyTool>;
  const geoTools = getGeoTools(ctx) as Record<string, AnyTool>;
  const spatialTools = getSpatialAnalysisTools(ctx) as Record<string, AnyTool>;

  // map.* — kepler.gl map-mutation tools
  const map: Record<string, ApiHandler> = {
    'map.set-basemap': forwardToTool(keplerTools.basemap),
    'map.add-layer': forwardToTool(keplerTools.addLayer),
    'map.update-layer-color': forwardToTool(keplerTools.updateLayerColor),
    'map.load-data': forwardToTool(keplerTools.loadData),
    'map.get-boundary': forwardToTool(keplerTools.mapBoundary),
    'map.save-data': forwardToTool(keplerTools.saveDataToMap),
    'map.create-table': forwardToTool(keplerTools.tableTool),
    'map.add-time-filter': forwardToTool(keplerTools.addTimeFilter),
    'map.toggle-time-filter': forwardToTool(keplerTools.toggleTimeFilter),
    'map.split-view': forwardToTool(keplerTools.splitView)
  };

  // data.* — DuckDB SQL tools
  const data: Record<string, ApiHandler> = {
    'data.query': forwardToTool(queryTools.genericQuery),
    'data.filter': forwardToTool(queryTools.filterDataset),
    'data.create-table': forwardToTool(queryTools.tableTool),
    'data.merge-tables': forwardToTool(queryTools.mergeTablesTool),
    'data.load-to-map': forwardToTool(queryTools.createKeplerDatasetFromTable)
  };

  // geoda.* — spatial-analysis tools
  const geoda: Record<string, ApiHandler> = {
    'geoda.lisa': forwardToTool(spatialTools.lisaTool),
    'geoda.global-moran': forwardToTool(spatialTools.globalMoranTool),
    'geoda.spatial-weights': forwardToTool(spatialTools.weightsTool),
    'geoda.regression': forwardToTool(spatialTools.regressionTool),
    'data.classify': forwardToTool(spatialTools.classifyTool),
    'geoda.standardize': forwardToTool(geoTools.standardizeVariable),
    'geoda.rate': forwardToTool(geoTools.rate)
  };

  // geo.* — geo tools
  const geo: Record<string, ApiHandler> = {
    'geo.routing': forwardToTool(geoTools.routing),
    'geo.isochrone': forwardToTool(geoTools.isochrone),
    'geo.geocode': forwardToTool(geoTools.geocoding),
    'geo.spatial-query': forwardToTool(geoTools.spatialQuery),
    'geo.grid': forwardToTool(geoTools.gridTool),
    'geo.thiessen-polygons': forwardToTool(geoTools.thiessenPolygons),
    'geo.mst': forwardToTool(geoTools.minimumSpanningTree),
    'geo.cartogram': forwardToTool(geoTools.cartogram),
    'geo.us-state': forwardToTool(geoTools.getUsStateTool),
    'geo.us-county': forwardToTool(geoTools.getUsCountyTool),
    'geo.us-zipcode': forwardToTool(geoTools.getUsZipcodeTool),
    'geo.roads': forwardToTool(geoTools.roads)
  };

  return {...map, ...data, ...geoda, ...geo};
}

export const ListCommandsArgs = z
  .object({
    includeInvisible: z
      .boolean()
      .optional()
      .describe('Include commands hidden from user-facing UIs. Defaults to false.'),
    includeDisabled: z
      .boolean()
      .optional()
      .describe('Include currently disabled commands. Defaults to true.'),
    includeInputSchema: z
      .boolean()
      .optional()
      .describe('Include each command’s input schema in the listing. Defaults to true.')
  })
  .strict();
export type ListCommandsArgs = z.infer<typeof ListCommandsArgs>;

/**
 * Build the `listCommands` handler. Unlike spatial-agent (which delegates to a
 * host-injected tool), every command here is built-in, so we enumerate the
 * handler map directly. The handler is constructed inside a factory because
 * the map is parameterized by `KeplerContext`.
 */
function buildListCommandsHandler(handlers: Record<string, ApiHandler>): ApiHandler {
  return defineHandler({
    argsSchema: ListCommandsArgs,
    run: async (_ctx: ExecuteApiContext<ListCommandsArgs>): Promise<ExecuteApiOutput> => {
      const commands = Object.keys(handlers).map(commandId => ({
        commandId,
        // `argsSchema` is a Zod type; `.description` is not uniformly present,
        // so we surface a one-line flag instead of a full description here.
        // The full per-command guidance lives in `EXECUTE_API_GUIDANCE`.
        inputRequired: true
      }));
      return {
        success: true,
        details: `${commands.length} commands available.`,
        // Surfaced via `toModelOutput` so the model can see the full id list.
        // Reuse `uniqueValues` as the generic "list" carrier field.
        uniqueValues: commands
      };
    }
  });
}

export const ExecuteCommandArgs = z
  .object({
    commandId: z
      .string()
      .describe('The exact command ID (e.g. "map.get-boundary", "data.query", "geoda.lisa").'),
    input: z
      .unknown()
      .optional()
      .describe('Optional command input. Must satisfy the command’s input schema.')
  })
  .strict();
export type ExecuteCommandArgs = z.infer<typeof ExecuteCommandArgs>;

/**
 * Build the `executeCommand` handler. Looks up `commandId` in the built-in
 * handler map and forwards `input` to it. Throws if the command id is unknown.
 */
function buildExecuteCommandHandler(handlers: Record<string, ApiHandler>): ApiHandler {
  return defineHandler({
    argsSchema: ExecuteCommandArgs,
    run: async (ctx: ExecuteApiContext<ExecuteCommandArgs>): Promise<ExecuteApiOutput> => {
      const handler = handlers[ctx.args.commandId];
      if (!handler) {
        return {
          success: false,
          error: `Unknown command ID "${ctx.args.commandId}". Available: ${Object.keys(
            handlers
          ).join(', ')}.`,
          instruction: `Call executeApi with apiName "listCommands" to see all available command IDs, or use one of: ${Object.keys(
            handlers
          ).join(', ')}.`
        };
      }
      return handler.run({...ctx, args: ctx.args.input ?? {}});
    }
  });
}

/**
 * Build the pair of command handlers (`listCommands`, `executeCommand`)
 * parameterized by `KeplerContext`. Returned to `index.ts` which registers
 * them in the `ExecuteApiCall` discriminated union.
 */
export function buildCommandHandlers(ctx: KeplerContext): {
  handlers: Record<string, ApiHandler>;
  listCommandsHandler: ApiHandler;
  executeCommandHandler: ApiHandler;
} {
  const handlers = buildCommandHandlerMap(ctx);
  return {
    handlers,
    listCommandsHandler: buildListCommandsHandler(handlers),
    executeCommandHandler: buildExecuteCommandHandler(handlers)
  };
}
