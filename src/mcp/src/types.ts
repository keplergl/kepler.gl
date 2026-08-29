/**
 * Shared contract types for the kepler.gl map surface.
 *
 * This module is the home of the reusable *map surface* contract — the map.*
 * tool namespace that any AI client can drive. It defines the map.* tool ids
 * and the `ToolResult` shape so any host (the demo-app browser page, the
 * kepler-assistant library, or a future MCP server) can implement or consume
 * the same contract.
 */

/** A command/tool execution result. */
export interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

/**
 * The v1 map-only tool surface (pure map actuation — no compute). These are the
 * command ids the kepler.gl demo-app's assistant actually registers, reconciled
 * with the kepler-mcp proposal.
 */
export const MAP_TOOL_IDS = [
  'map.set-basemap',
  'map.get-boundary',
  'map.add-layer',
  'map.update-layer-color',
  'map.load-data',
  'map.save-data',
  'map.create-table',
  'map.add-column',
  'map.add-time-filter',
  'map.toggle-time-filter',
  'map.split-view',
  'map.get-dataset-context'
] as const;

export type MapToolId = (typeof MAP_TOOL_IDS)[number];
