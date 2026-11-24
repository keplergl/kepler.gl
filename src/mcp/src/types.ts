// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

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
 * The v1 map tool surface. These are the command ids the kepler.gl demo-app's
 * assistant actually registers, reconciled with the kepler-mcp proposal. Most
 * commands are pure map actuation (set-basemap, add-layer, ...); the table ops
 * (map.create-table, map.add-column, map.save-data) are DuckDB-backed and are
 * included because they mutate the map's datasets in place.
 */
export const MAP_TOOL_IDS = [
  'map.set-basemap',
  'map.set-view-mode',
  'map.export-video',
  'map.get-boundary',
  'map.add-layer',
  'map.get-layer-order',
  'map.create-layer-group',
  'map.move-layer-to-group',
  'map.ungroup-layers',
  'map.reorder-layers',
  'map.remove-layer',
  'map.remove-dataset',
  'map.update-layer-color',
  'map.load-data',
  'map.open-project',
  'map.save-project',
  'map.get-project-status',
  'map.load-zarr',
  'map.load-tileset',
  'map.set-layer-options',
  'map.get-layer-options',
  'map.get-layer-labels',
  'map.set-layer-labels',
  'map.get-tooltip-fields',
  'map.set-tooltip-fields',
  'map.camera-bookmarks',
  'map.camera-tour',
  'map.render-preview',
  'map.property-transitions',
  'map.get-effects',
  'map.set-effect',
  'map.add-annotation',
  'map.get-annotations',
  'map.update-annotation',
  'map.remove-annotation',
  'map.set-zoom-fade',
  'map.save-data',
  'map.create-table',
  'map.add-column',
  'map.add-time-filter',
  'map.time-filter',
  'map.data-playback',
  'map.toggle-time-filter',
  'map.split-view',
  'map.get-dataset-context'
] as const;

export type MapToolId = (typeof MAP_TOOL_IDS)[number];
