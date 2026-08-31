import type {Table as ArrowTable} from 'apache-arrow';
import type {ZodType} from 'zod';
import type {Datasets} from '@kepler.gl/table';
import type {KeplerDispatch} from './utils';

/**
 * Structural subset of `@sqlrooms/room-store`'s `RoomCommand` — enough for the
 * map.* command factories and for a host to register the built objects. Defined
 * locally (with `zod`, already a dependency) so this package stays free of
 * `@sqlrooms/room-store`; the objects the factories build are structurally
 * compatible with sqlrooms' own `RoomCommand`.
 */
export type RoomCommandResult<TData = unknown> = {
  success: boolean;
  commandId: string;
  message?: string;
  code?: string;
  data?: TData;
  error?: string;
};

export type RoomCommandExecuteOutput<TData = unknown> = RoomCommandResult<TData> | TData | void;

export type RoomCommandExecutionContext = {
  store: unknown;
  getState: () => unknown;
  invocation: unknown;
  signal?: AbortSignal;
};

export type RoomCommandPolicyMetadata = {
  readOnly?: boolean;
  idempotent?: boolean;
  riskLevel?: 'low' | 'medium' | 'high';
  requiresConfirmation?: boolean;
};

export type RoomCommand = {
  id: string;
  name: string;
  description?: string;
  group?: string;
  keywords?: string[];
  inputSchema?: ZodType<unknown>;
  metadata?: RoomCommandPolicyMetadata;
  execute: (
    context: RoomCommandExecutionContext,
    input?: unknown
  ) => RoomCommandExecuteOutput | Promise<RoomCommandExecuteOutput>;
};

/**
 * A command's model-facing descriptor: the id/name/description/group/keywords
 * plus a JSON-Schema-converted `inputSchema` and the policy metadata. This is
 * the shape hosts advertise over the wire (e.g. the demo-app bridge's
 * `toDescriptor`), so it lives in the map surface package to keep the contract
 * self-contained.
 */
export type ToolDescriptor = {
  id: string;
  name: string;
  description?: string;
  group?: string;
  keywords?: string[];
  inputSchema: Record<string, unknown>;
  metadata?: RoomCommandPolicyMetadata;
};

/**
 * Structural slice of `@sqlrooms/duckdb`'s `DuckDbConnector` — only the methods
 * the map.* commands call, typed against apache-arrow so the query result flows
 * into `arrowTableToObjects` / `arrowSchemaToFields` unchanged. Kept local so
 * this package needs no `@sqlrooms/duckdb` dependency; a host's real sqlrooms
 * connector satisfies this shape.
 */
export type DuckDbConnector = {
  execute(sql: string, options?: {signal?: AbortSignal}): PromiseLike<unknown>;
  query(sql: string, options?: {signal?: AbortSignal}): PromiseLike<ArrowTable>;
  loadArrow(
    table: ArrowTable | Uint8Array,
    tableName: string,
    opts?: {schema?: string}
  ): Promise<void>;
};

export type VisState = {
  datasets: Datasets;
  layers: any[];
  layerData: any[];
  loaders: any[];
  loadOptions: Record<string, any>;
  [key: string]: any;
};

/**
 * Accessors to the kepler.gl application state the assistant needs. The host
 * app supplies these (via `setKeplerStateAccessors`) so this module never
 * hard-codes a redux state shape (e.g. `demo.keplerGl.map.visState`). Any
 * app can provide accessors matching its own store.
 */
export type KeplerStateAccessors = {
  getVisState: () => VisState;
  getMapBoundary: () =>
    | {
        nw: [number, number];
        se: [number, number];
      }
    | undefined;
};

/**
 * KeplerContext provides access to kepler.gl state and dispatch.
 * This is passed into tool factories instead of using Redux directly.
 *
 * The four glue methods (`getValuesFromDataset`, `getDatasetContext`,
 * `loadTableToKepler`, `loadTableIntoDuckDB`, `getConnector`) are the
 * kepler-app-bound seam the map.* commands call. They are implemented by the
 * host's glue (kepler-assistant) so this package stays free of the DuckDB /
 * kepler-app wiring.
 */
export type KeplerContext = {
  getVisState: () => VisState;
  getMapBoundary: () =>
    | {
        nw: [number, number];
        se: [number, number];
      }
    | undefined;
  getMapboxToken: () => string | undefined;
  dispatch: KeplerDispatch;
  /** Read a column's values from a kepler dataset (by label). */
  getValuesFromDataset: (datasetName: string, variableName: string) => unknown[];
  /** Build the dataset+layer context string for the LLM. */
  getDatasetContext: () => string;
  /** Load a DuckDB table into kepler.gl as a dataset. */
  loadTableToKepler: (
    tableName: string,
    options?: {autoCreateLayers?: boolean; centerMap?: boolean}
  ) => Promise<{success: boolean; error?: string}>;
  /** Materialize a kepler dataset's columns into a DuckDB table and return the connector. */
  loadTableIntoDuckDB: (
    datasetName: string,
    variableNames: string[],
    dbTableName: string
  ) => Promise<DuckDbConnector>;
  /** The shared DuckDB connector (the store's, when wired). */
  getConnector: () => Promise<DuckDbConnector>;
};
