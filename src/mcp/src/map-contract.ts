/**
 * The kepler.gl map tool contract — the "map surface".
 *
 * kepler.gl's contract is "accept data, actuate the map, introspect, render."
 * The surface is map-focused: no spatial analysis and no charts — those belong
 * to the analysis service (kepler-assistant). A few table ops (map.create-table,
 * map.add-column, map.save-data) are DuckDB-backed and mutate the map's datasets
 * in place; they are part of the surface because they change what the map shows.
 *
 * This module is intentionally dependency-light. It defines the map.* tool ids
 * and a `MapContract` interface so any host (the demo-app browser page, the
 * kepler-assistant library, or a future MCP server) can implement or consume
 * the same contract.
 */

import type {MapToolId, ToolResult} from './types';
import {MAP_TOOL_IDS} from './types';

/**
 * The map tool surface. Mostly pure map actuation (set-basemap, add-layer, ...);
 * a few table ops (map.create-table, map.add-column, map.save-data) are included
 * because they mutate the map's datasets in place.
 */
export interface MapContract {
  readonly toolIds: readonly MapToolId[];
  /** List the tools this surface exposes (id + input JSON Schema, if known). */
  listTools(): Array<{id: MapToolId; inputSchema?: unknown; description?: string}>;
  /** Execute a map tool. Returns a trimmed, model-facing result. */
  callTool(id: MapToolId, input: Record<string, unknown>): Promise<ToolResult>;
}

export {MAP_TOOL_IDS};
export type {MapToolId};
