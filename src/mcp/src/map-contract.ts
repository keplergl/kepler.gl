/**
 * The kepler.gl map-only tool contract — the "map surface".
 *
 * kepler.gl's contract is "accept data, actuate the map, introspect, render."
 * Nothing here computes: no SQL, no spatial analysis, no charts. Those belong
 * to the analysis service (kepler-assistant).
 *
 * This module is intentionally dependency-light. It defines the map.* tool ids
 * and a `MapContract` interface so any host (the demo-app browser page, the
 * kepler-assistant library, or a future MCP server) can implement or consume
 * the same contract.
 */

import type {MapToolId, MAP_TOOL_IDS} from './types';

/** The map-only tool surface. Exposes only pure map actuation. */
export interface MapContract {
  readonly toolIds: readonly MapToolId[];
  /** List the tools this surface exposes (id + input JSON Schema, if known). */
  listTools(): Array<{id: MapToolId; inputSchema?: unknown; description?: string}>;
  /** Execute a map tool. Returns a trimmed, model-facing result. */
  callTool(
    id: MapToolId,
    input: Record<string, unknown>
  ): Promise<{
    success: boolean;
    data?: unknown;
    error?: string;
  }>;
}

export {MAP_TOOL_IDS};
export type {MapToolId};
