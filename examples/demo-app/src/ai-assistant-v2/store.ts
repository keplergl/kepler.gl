import {
  AiSettingsSliceConfig,
  AiSettingsSliceState,
  AiSliceConfig,
  AiSliceState,
  createAiSettingsSlice,
  createAiSlice,
  createDefaultAiTools,
  createDefaultAiToolRenderers,
  createDefaultAiSettingsConfig,
  createDefaultAiConfig
} from '@sqlrooms/ai';
import {
  createRoomStore,
  persistSliceConfigs,
  BaseRoomStoreState,
  createBaseRoomSlice,
  createCommandSlice,
  CommandSliceState,
  registerCommandsForOwner
} from '@sqlrooms/room-store';
import {createDuckDbSlice, DuckDbSliceState} from '@sqlrooms/duckdb';
import type {ToolRendererRegistry} from '@sqlrooms/ai';
import {AI_SETTINGS} from './config';
import {createKeplerAiInstructions} from './instructions';
import {getEchartsToolRenderers, setHistogramSelectionHandler} from './tools/echarts-renderers';
import {highlightRows, setStoreConnectorProvider} from './tools/utils';
import {createWrappedQueryTool} from './tools/query-tool-wrapper';
import {getAllCommands, KEPLER_COMMAND_OWNER} from './commands';
import {layerSetIsValid} from '@kepler.gl/actions';
import type {KeplerContext} from './types';
import type {SkillListing} from '@sqlrooms/ai';
import {KeplerSkillStorage} from './skills/KeplerSkillStorage';
import {createRunSkillTool} from './skills/runSkillTool';
import {createDiscoverSkillTool} from './skills/discoverSkillTool';
import {buildSkillsPromptFromListings} from './skills/skillPrompt';
import {getModel} from './skills/getModel';

export type RoomState = BaseRoomStoreState &
  DuckDbSliceState &
  AiSliceState &
  AiSettingsSliceState &
  CommandSliceState;

let reduxStore: any = null;

export function setReduxStore(store: any) {
  reduxStore = store;
  // Wire the histogram brush-selection callback now that redux is available, so
  // the standalone chart renderer can highlight the brushed rows on the map.
  // The histogram renderer surfaces tool output produced by skill sub-agents.
  setHistogramSelectionHandler((datasetName, selectedIndices) => {
    const visState = reduxStore?.getState()?.demo?.keplerGl?.map?.visState;
    if (!visState) return;
    highlightRows(
      visState.datasets,
      visState.layers,
      datasetName,
      selectedIndices,
      (layer: any, isValid: boolean) => reduxStore?.dispatch(layerSetIsValid(layer, isValid))
    );
  });
}

export function getReduxStore() {
  return reduxStore;
}

export function getReduxDispatch() {
  return reduxStore?.dispatch;
}

export function getKeplerVisState() {
  return reduxStore?.getState()?.demo?.keplerGl?.map?.visState;
}

function getKeplerContext(): KeplerContext {
  return {
    getVisState: () => reduxStore?.getState()?.demo?.keplerGl?.map?.visState,
    getMapBoundary: () => reduxStore?.getState()?.demo?.aiAssistant?.keplerGl?.mapBoundary,
    getMapboxToken: () => {
      const apiKey = typeof window !== 'undefined' ? localStorage.getItem('mapbox-token') : null;
      return apiKey || undefined;
    },
    dispatch: (action: any) => reduxStore?.dispatch(action)
  };
}

/**
 * Singleton skill storage for the assistant. Lives for the page's lifetime.
 * Exported so future skill-authoring UI can reach it directly.
 */
export const skillStorage = new KeplerSkillStorage();

/**
 * Cached skill listings used when building the orchestrator's system prompt.
 * Kept outside the store so the prompt read path stays synchronous; the cache
 * is refreshed whenever storage mutates.
 */
let cachedListings: SkillListing[] = [];

let refreshSeq = 0;
async function refreshSkillListings() {
  const seq = ++refreshSeq;
  try {
    const next = await skillStorage.listSkills();
    if (seq === refreshSeq) cachedListings = next;
  } catch (err) {
    console.error('[store] Failed to refresh skill listings:', err);
  }
}

// Initial seed — fire-and-forget is safe, the storage constructor already
// populated the built-in root synchronously.
void refreshSkillListings();
skillStorage.subscribe?.(() => {
  void refreshSkillListings();
});

export const {roomStore, useRoomStore} = createRoomStore<RoomState>(
  persistSliceConfigs<RoomState>(
    {
      name: 'kepler-ai-assistant-state',
      version: 1,
      migrate: (persistedState: unknown, version: number): RoomState => {
        if (version >= 1) return persistedState as RoomState;
        if (
          typeof persistedState !== 'object' ||
          persistedState === null ||
          !('aiSettings' in persistedState)
        ) {
          return persistedState as RoomState;
        }
        const defaults = createDefaultAiSettingsConfig(AI_SETTINGS);
        const state = persistedState as Record<string, unknown>;
        return {
          ...state,
          aiSettings: AiSettingsSliceConfig.parse({
            defaults,
            persisted: state.aiSettings
          })
        } as unknown as RoomState;
      },
      sliceConfigSchemas: {
        ai: AiSliceConfig,
        aiSettings: AiSettingsSliceConfig
      }
    },
    (set, get, store) => ({
      ...createBaseRoomSlice()(set, get, store),

      ...createDuckDbSlice()(set, get, store),

      ...createCommandSlice()(set, get, store),

      ...createAiSettingsSlice({config: AI_SETTINGS})(set, get, store),

      ...createAiSlice({
        config: createDefaultAiConfig(),

        getInstructions: () => {
          const base = createKeplerAiInstructions(store);
          const skillsBlock = buildSkillsPromptFromListings(cachedListings);
          return skillsBlock ? `${base}\n\n${skillsBlock}` : base;
        },

        toolRenderers: {
          ...createDefaultAiToolRenderers(),
          ...getEchartsToolRenderers()
        } as ToolRendererRegistry,

        tools: {
          ...createDefaultAiTools(store, {query: {}, commands: {}, tables: false}),
          // Override the stock `query` tool (which hides all rows from the LLM
          // because numberOfRowsToShareWithLLM defaults to 0) with a wrapper
          // that runs against the kepler tools' DuckDB connector and surfaces
          // the first N rows as a ~1000-char preview. See query-tool-wrapper.ts.
          query: createWrappedQueryTool(),
          discoverSkill: createDiscoverSkillTool({store, storage: skillStorage}),
          runSkill: createRunSkillTool({
            store,
            storage: skillStorage,
            getKeplerContext,
            getModel: () => getModel(store)
          })
        } as any
      })(set, get, store)
    })
  )
);

// Wire the room store's DuckDB connector into the kepler tools layer so that
// skills (which materialize kepler datasets into DuckDB via tools/utils.ts
// `getConnector`) and the main-agent wrapped `query` tool share ONE DuckDB
// instance. Without this, the two connectors diverge: skills write tables the
// query tool can't see, and the query tool reads an empty DB. This is the root
// cause of the "DESCRIBE county_unemployment does not exist" error — the
// dataset lived in kepler's in-memory visState and was never materialized into
// the query tool's DuckDB. `getConnector()` in tools/utils.ts now resolves to
// this connector. Must run after `roomStore` exists.
setStoreConnectorProvider(async () => roomStore.getState().db.getConnector());

// Register the kepler-ai command catalog (kepler / query / geo / spatial-analysis)
// into the room-store command registry. The same `RoomCommand` definitions then
// serve every surface that reads the registry — the AI skill `executeApi` tool
// (which delegates to `store.commands.invokeCommand`), the stock
// `search_commands` / `get_command` / `list_commands` / `execute_command` AI
// tools, the command palette UI, the CLI adapter, and the MCP adapter.
//
// `KeplerContext` is a singleton built from `reduxStore`, so a one-time
// registration is sufficient. If `KeplerContext` ever becomes per-session,
// re-register on swap with `unregisterCommandsForOwner` + `registerCommandsForOwner`.
registerCommandsForOwner(
  roomStore,
  KEPLER_COMMAND_OWNER,
  Object.values(getAllCommands(getKeplerContext()))
);

// Register the kepler-ai command catalog in the room-store command registry.
// This makes the same command definitions (map.*, data.*, geoda.*, geo.*)
// available to every surface that reads the registry: the AI skill layer
// (`executeApi` delegates to `store.commands.invokeCommand`), the command
// palette UI, the CLI adapter, and the MCP adapter. `KeplerContext` is a
// singleton built from `reduxStore`, so a one-time registration is correct;
// if it ever becomes per-session, re-register on swap.
registerCommandsForOwner(
  roomStore,
  KEPLER_COMMAND_OWNER,
  Object.values(getAllCommands(getKeplerContext()))
);

// Register the kepler-ai commands (map / data / geoda / geo) in the room-store
// command registry so every surface — AI skill `executeApi`, command palette,
// CLI, MCP — reads from one source of truth. `KeplerContext` is a singleton
// built from `reduxStore`, so a one-time registration is correct; if it ever
// becomes per-session, re-register on swap via `unregisterCommandsForOwner` +
// `registerCommandsForOwner`.
registerCommandsForOwner(
  roomStore,
  KEPLER_COMMAND_OWNER,
  Object.values(getAllCommands(getKeplerContext()))
);
