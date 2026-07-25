/**
 * Handler types for the `executeApi` command dispatcher.
 *
 * Adapted from `spatial-agent/src/skills/executeApi/types.ts`, but the context
 * carries a `KeplerContext` (the demo-app's redux bridge) instead of a
 * `SpatialAgentStore`, because the demo-app's tools already take
 * `KeplerContext` and read/write the map through it.
 */

import type {ZodType} from 'zod';
import type {KeplerContext} from '../../types';

/** Everything a handler may read while servicing one `executeApi` call. */
export type ExecuteApiContext<TArgs = unknown> = {
  /** Shared kepler.gl redux bridge; tools read/write the map through it. */
  keplerContext: KeplerContext;
  args: TArgs;
  abortSignal?: AbortSignal;
};

/**
 * Uniform shape for an `executeApi` handler. `argsSchema` validates the raw
 * args; `run` receives a context whose `args` is already typed. Dispatch
 * treats every handler as `ApiHandler` and feeds it an untyped context.
 */
export type ApiHandler = {
  argsSchema: ZodType;
  run: (ctx: ExecuteApiContext) => Promise<ExecuteApiOutput>;
};

/**
 * Builds an `ApiHandler` from a typed `run`. The returned `run` validates the
 * context's `args` with `argsSchema`, so the typed `run` only ever sees args
 * matching its schema while dispatch stays uniform.
 */
export function defineHandler<TArgs>(handler: {
  argsSchema: ZodType<TArgs>;
  run: (ctx: ExecuteApiContext<TArgs>) => Promise<ExecuteApiOutput>;
}): ApiHandler {
  return {
    argsSchema: handler.argsSchema,
    run: (ctx) => handler.run({...ctx, args: handler.argsSchema.parse(ctx.args)}),
  };
}

/**
 * Union of all fields the existing demo-app tools may return. Kept permissive
 * (every field optional except `success`) so handlers that forward to a tool
 * can pass its raw output through without enumerating every tool's shape.
 *
 * Domain-specific fields are surfaced to the model via `toModelOutput` in
 * `index.ts` so multi-step flows (e.g. `data.classify` breaks → `map.add-layer`
 * colorMap) can chain.
 */
export type ExecuteApiOutput = {
  success: boolean;
  /**
   * Identifies which handler produced this output. Stamped centrally by the
   * dispatcher so a renderer can pick the right view without sniffing payload
   * shape.
   */
  apiName?: string;
  details?: string;
  /** Optional explicit guidance for the calling agent on what to do next. */
  nextStep?: string;
  instruction?: string;
  error?: string;

  // query-tool.ts
  datasetName?: string;
  resultDatasetName?: string;
  truncatedQueryResult?: string;
  totalRows?: number;
  firstFiveRows?: string | unknown[];
  firstTwoRows?: unknown[];
  sql?: string;
  dbTableName?: string;

  // kepler-tools (basemap, load-data, save-data, table)
  dataInfo?: unknown;
  savedDatasetNames?: string[];

  // boundary-tool
  boundary?: {nw: [number, number]; se: [number, number]};

  // spatial-analysis-tools (classify, lisa, moran, weights, regression)
  variableName?: string;
  method?: string;
  k?: number;
  hinge?: number;
  breaks?: number[];
  uniqueValues?: unknown[];
  weightsId?: string;
  weightsMeta?: unknown;
  globalMoranI?: number;
  clusterColorAndLabels?: unknown[];
  totalObservations?: number;
  significanceThreshold?: number;
  modelType?: string;
  dependentVariable?: string;
  independentVariables?: string[];
  result?: unknown;

  // geo-tools (routing, isochrone, geocoding, spatial-query, grid, etc.)
  outputDatasetName?: string;
  outputVariableName?: string;
  count?: number;
  distance?: number;
  duration?: number;

  // kepler-tools (add-layer) temporal follow-up hints
  dateTimeColumns?: string[];
  dateTimeHint?: string;
  integerTemporalColumns?: string[];
  integerTemporalHint?: string;
};