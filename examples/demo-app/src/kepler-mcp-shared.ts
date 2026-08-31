/**
 * Shared plumbing for the demo-app's two agent surfaces over the
 * `@kepler.gl/mcp` map.* commands:
 *
 *  - `kepler-mcp-bridge.tsx` — WebSocket reverse-connect to a local MCP server
 *    (Claude Code / Codex driving the map without a browser extension)
 *  - `kepler-webmcp.tsx` — native WebMCP registration (`document.modelContext`)
 *    for harnesses with a built-in browser (Chrome's agent, Claude Desktop's
 *    browser, ...)
 *
 * Both surfaces execute commands against the demo's own redux store through
 * the same `buildKeplerContext` and serve the same DuckDB-free catalog.
 */
import {getKeplerCommands, getValuesFromDataset} from '@kepler.gl/mcp';
import type {
  KeplerContext,
  RoomCommandExecuteOutput,
  RoomCommandResult,
  ToolDescriptor
} from '@kepler.gl/mcp';
import {WebMercatorViewport} from '@deck.gl/core';
import {z} from 'zod';
// The skill markdown ships with the @kepler.gl/mcp package (subpath export), so
// the demo-app folder stays self-contained — no relative path reaching outside
// it into the monorepo layout.
import mapSkillMarkdown from '@kepler.gl/mcp/skill/kepler/SKILL.md';

// map.* commands that need a DuckDB connector / the kepler-app glue
// (`loadTableToKepler`, `loadTableIntoDuckDB`, `getConnector`). The demo
// surfaces (mapping-only bridge / webMCP) do not serve them.
export const DUCKDB_REQUIRED = new Set(['map.create-table', 'map.add-column', 'map.save-data']);

// Mutating map.* commands every agent will reach for without reading the
// skill. Each gets a pointer to kepler.get-map-skill prepended to its
// description so the reader tool is impossible to miss.
const SKILL_REQUIRED = new Set([
  'map.add-layer',
  'map.update-layer-color',
  'map.add-time-filter',
  'map.toggle-time-filter',
  'map.split-view',
  'map.load-data',
  'map.set-basemap'
]);

const SKILL_HINT = `\nREAD THE MAP SKILL FIRST: call kepler.get-map-skill before using this command — it explains layer-type selection, color rules, and the workflow.`;

/** Live accessors into the demo's own redux store — no kepler-assistant needed. */
export function buildKeplerContext(reduxStore: any): KeplerContext {
  const readMap = () => reduxStore?.getState()?.demo?.keplerGl?.map;
  return {
    getVisState: () => {
      const visState = readMap()?.visState;
      if (!visState) {
        throw new Error('kepler.gl map is not initialized yet.');
      }
      return visState;
    },
    getMapBoundary: () => {
      // Recompute the current viewport corners from the live mapState (same
      // WebMercatorViewport math the app's onViewStateChange uses). Fall back
      // to the assistant slice's stored boundary if mapState lacks a size.
      const mapState = readMap()?.mapState;
      if (mapState?.width && mapState?.height) {
        try {
          const viewport = new WebMercatorViewport(mapState);
          const nw = viewport.unproject([0, 0]);
          const se = viewport.unproject([viewport.width, viewport.height]);
          return {nw: [nw[0], nw[1]], se: [se[0], se[1]]};
        } catch {
          /* fall through to stored boundary */
        }
      }
      return reduxStore?.getState()?.demo?.aiAssistant?.keplerGl?.mapBoundary;
    },
    getMapboxToken: () => {
      if (typeof window === 'undefined') return undefined;
      try {
        return localStorage.getItem('mapbox-token') ?? undefined;
      } catch {
        // private mode / blocked storage — no token
        return undefined;
      }
    },
    dispatch: (action: any) => reduxStore?.dispatch(action),
    getValuesFromDataset: (datasetName, variableName) => {
      const visState = readMap()?.visState;
      if (!visState) return [];
      return getValuesFromDataset(visState.datasets, visState.layers, datasetName, variableName);
    },
    getDatasetContext: () => {
      // Shape required by map.get-dataset-context: a human line, then a JSON
      // array of {datasetName, datasetId, fields, layers} descriptors.
      const visState = readMap()?.visState;
      const datasets = visState?.datasets;
      const layers = visState?.layers ?? [];
      if (!datasets) return '';
      const context =
        'Please remember the following datasets and layers for answering the user question:';
      const dataMeta = Object.values(datasets).map((ds: any) => ({
        datasetName: ds?.label ?? ds?.id,
        datasetId: ds?.id,
        // Field name→type mappings as a single object ({colA: typeA, ...}),
        // matching the "field name→type mappings" shape map.get-dataset-context
        // describes — not an array of single-key objects.
        fields: Object.fromEntries((ds?.fields ?? []).map((f: any) => [f.name, f.type])),
        layers: layers
          .filter((layer: any) => layer?.config?.dataId === ds?.id)
          .map((layer: any) => ({
            id: layer.id,
            label: layer.config.label,
            type: layer.type,
            geometryMode: layer.config.columnMode,
            geometryColumns: Object.fromEntries(
              Object.entries(layer.config.columns)
                .filter(([, value]) => value !== null)
                .map(([key, value]) => [
                  key,
                  typeof value === 'object' && value !== null
                    ? Object.fromEntries(Object.entries(value).filter(([, v]) => v !== null))
                    : value
                ])
            )
          }))
      }));
      return `${context}\n${JSON.stringify(dataMeta)}`;
    },
    loadTableToKepler: async () => ({
      success: false,
      error: 'map.save-data / loadTableToKepler is not available in the mapping-only bridge.'
    }),
    loadTableIntoDuckDB: async () => {
      throw new Error('DuckDB operations are not available in the mapping-only bridge.');
    },
    getConnector: async () => {
      throw new Error('DuckDB operations are not available in the mapping-only bridge.');
    }
  };
}

/** The DuckDB-free map.* commands this page serves to agents, plus the map skill reader. */
export function buildCatalog(ctx: KeplerContext) {
  const commands = Object.values(getKeplerCommands(ctx)).filter(c => !DUCKDB_REQUIRED.has(c.id));
  return [getMapSkillCommand(), ...commands.map(c => withSkillHint(c))];
}

/**
 * Read-only tool that serves the kepler.gl map-management skill verbatim. First
 * in the catalog so it is the first tool any surface advertises; every mutating
 * command's description also points at it (see `withSkillHint`).
 */
function getMapSkillCommand() {
  return {
    id: 'kepler.get-map-skill',
    name: 'Read map skill',
    group: 'Map',
    description: `READ THE MAP SKILL FIRST — the kepler.gl map-management skill, served verbatim from src/mcp/skill/kepler/SKILL.md.

Call this command BEFORE any other map command. It explains how to choose a layer type (point, arc, line, grid, hexagon, cluster, heatmap, geojson, h3, trip, s2, flow), how to color layers (case-sensitive colorBy, breaks vs unique colorMaps), time animation, split view, and the complete add-layer workflow with JSON examples.

When the user asks for a flow map, "OD flows", "a map of movements" → this skill maps that to layerType "flow" (use "arc" only for straight great-circle lines between un-clustered points).`,
    keywords: ['skill', 'map', 'workflow', 'guide', 'read-me-first'],
    metadata: {readOnly: true, idempotent: true, riskLevel: 'low'},
    execute: async () => ({
      success: true,
      commandId: 'kepler.get-map-skill',
      data: {details: mapSkillMarkdown}
    })
  };
}

function withSkillHint(cmd: ReturnType<typeof getKeplerCommands>[string]) {
  if (SKILL_REQUIRED.has(cmd.id) && cmd.description) {
    return {...cmd, description: `${cmd.description}${SKILL_HINT}`};
  }
  return cmd;
}

export function toDescriptor(cmd: {id: string; name: string; description?: string; group?: string; keywords?: string[]; metadata?: {readOnly?: boolean; idempotent?: boolean; riskLevel?: string; requiresConfirmation?: boolean}; inputSchema?: any}): ToolDescriptor {
  let inputSchema: Record<string, unknown> = {type: 'object'};
  if (cmd.inputSchema) {
    try {
      // zod v4 -> JSON Schema. Static import (not require): the demo-app
      // bundles for platform 'browser' / format 'iife', where `require` is
      // undefined — a runtime require would throw and silently fall back to
      // {type: 'object'}, losing tool discoverability and validation.
      inputSchema = (z.toJSONSchema(cmd.inputSchema) ?? {type: 'object'}) as Record<string, unknown>;
    } catch {
      inputSchema = {type: 'object'};
    }
  }
  return {
    id: cmd.id,
    name: cmd.name,
    description: cmd.description,
    group: cmd.group,
    keywords: cmd.keywords,
    inputSchema,
    metadata: cmd.metadata as ToolDescriptor['metadata']
  };
}

export function formatResult(result: RoomCommandExecuteOutput): string {
  // A command may return a bare payload (TData) or void, not just a
  // RoomCommandResult — handle those instead of assuming the result shape.
  if (result && typeof result === 'object' && 'success' in result) {
    const r = result as RoomCommandResult;
    if (r.error) return `✗ ${r.commandId}: ${r.error}`;
    const data = r.data as {details?: string} | undefined;
    return data?.details ? `✓ ${data.details}` : `✓ ${r.commandId} ok`;
  }
  return result == null
    ? '✓ ok'
    : `✓ ${typeof result === 'string' ? result : JSON.stringify(result)}`;
}