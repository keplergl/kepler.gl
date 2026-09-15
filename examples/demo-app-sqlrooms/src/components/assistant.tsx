// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {
  AI_SETTINGS,
  createKeplerAssistantInstructions,
  getEchartsToolRenderers,
  setKeplerStateAccessors,
  setReduxStore,
  tableToLLMResult
} from '@openassistant/kepler-assistant/integration';
import {
  AiSettingsPanel,
  AiSettingsSliceConfig,
  AiSliceConfig,
  Chat,
  createAiSettingsSlice,
  createAiSlice,
  createDefaultAiInstructions,
  createDefaultAiSettingsConfig,
  createDefaultAiTools,
  createDefaultAiToolRenderers,
  useStoreWithAi,
  useStoreWithAiSettings,
  type AiSettingsSliceState,
  type AiSliceState,
  type ExecuteCommandToolLlmResult,
  type QueryToolOutput,
  type ToolRenderer
} from '@sqlrooms/ai';
import {useBaseRoomStore, type StateCreator, type StoreApi} from '@sqlrooms/room-store';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  useDisclosure
} from '@sqlrooms/ui';
import {Settings} from 'lucide-react';
import type {Store} from 'redux';
import type {DemoRoomState} from './sqlrooms-demo-layout';
import {getOpenAiModel} from './assistant-model';
import {createAssistantSkillTools} from './assistant-tools';

// Keep existing sessions, provider keys, and the pre-v1 settings migration.
export const assistantPersistence = {
  name: 'kepler-ai-assistant-state',
  version: 1,
  sliceConfigSchemas: {ai: AiSliceConfig, aiSettings: AiSettingsSliceConfig},
  migrate: (state: unknown, version: number): Record<string, unknown> => {
    if (!state || typeof state !== 'object') return {};
    if (version >= 1 || !('aiSettings' in state)) {
      return state as Record<string, unknown>;
    }
    return {
      ...state,
      aiSettings: AiSettingsSliceConfig.parse({
        defaults: createDefaultAiSettingsConfig(AI_SETTINGS),
        persisted: state.aiSettings
      })
    };
  }
};

const chartRenderers = getEchartsToolRenderers();
const ChartResult = chartRenderers.executeApi;

// Skills use executeApi; ordinary chat uses SQLRooms' execute_command envelope.
const CommandChartResult: ToolRenderer<ExecuteCommandToolLlmResult> = props => {
  const output = props.output;
  const data = output?.result?.data;
  return (
    <ChartResult
      {...props}
      output={
        output && {
          ...(typeof data === 'object' && data !== null ? data : {}),
          commandId: output.commandId,
          success: output.success,
          error: output.errorMessage
        }
      }
    />
  );
};

export const createAssistantSlice: StateCreator<
  DemoRoomState,
  [],
  [],
  AiSliceState & AiSettingsSliceState
> = (set, get, store) => {
  const tools = createDefaultAiTools(store, {query: {numberOfRowsToShareWithLLM: 5}});
  return {
    ...createAiSettingsSlice({config: AI_SETTINGS})(set, get, store),
    ...createAiSlice({
      getCustomModel: () => getOpenAiModel(store),
      getInstructions: () =>
        `${createDefaultAiInstructions(store)}\n\n${createKeplerAssistantInstructions()}\n\n` +
        'Use the registered Kepler commands for map edits, spatial analysis, and charts. ' +
        'Map edits and derived analysis results requested by the user are supported. ' +
        'Use list_tables/read_table_schema for actual SQL table identities; map commands use dataset labels.',
      tools: {
        ...tools,
        // Keep large geometry/object values out of the model context. Execution,
        // validation, cancellation, and the result UI remain SQLRooms' query tool.
        query: {
          ...tools.query,
          toModelOutput: ({output}: {output: QueryToolOutput}) => ({
            type: 'text' as const,
            value: JSON.stringify({
              success: output.success,
              ...(output.data
                ? {data: {preview: tableToLLMResult(output.data.firstRows ?? [])}}
                : {}),
              ...(output.error ? {error: output.error} : {})
            })
          })
        },
        ...createAssistantSkillTools(store)
      },
      toolRenderers: {
        ...createDefaultAiToolRenderers(),
        ...chartRenderers,
        execute_command: CommandChartResult
      }
    })(set, get, store)
  };
};

export type AssistantHost = {
  reduxStore: Store;
  stateAccessors: Parameters<typeof setKeplerStateAccessors>[0];
};

/** Keep map commands and the table catalog available even while chat is closed. */
export function connectAssistantToMap(
  roomStore: StoreApi<DemoRoomState>,
  {reduxStore, stateAccessors}: AssistantHost
) {
  setReduxStore(reduxStore);
  setKeplerStateAccessors(stateAccessors);
  let datasets = stateAccessors.getVisState()?.datasets;
  const refresh = () => {
    const {db, room} = roomStore.getState();
    void db.refreshTableSchemas().catch(room.captureException);
  };
  refresh();
  return reduxStore.subscribe(() => {
    const next = stateAccessors.getVisState()?.datasets;
    if (next !== datasets) {
      datasets = next;
      refresh();
    }
  });
}

export function AiAssistantPanel() {
  const initialized = useBaseRoomStore(s => s.room.initialized);
  const sessionId = useStoreWithAi(s => s.ai.config.currentSessionId);
  const updateProvider = useStoreWithAiSettings(s => s.aiSettings.updateProvider);
  const settings = useDisclosure();

  return (
    <div className="flex h-full min-h-0 flex-col bg-background p-3 text-foreground">
      <Chat>
        <div className="mb-3 flex items-center gap-2">
          <Chat.Sessions className="min-w-0 flex-1" />
          <Button variant="ghost" size="icon" aria-label="AI Settings" onClick={settings.onOpen}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        <Dialog
          open={settings.isOpen}
          onOpenChange={open => (open ? settings.onOpen() : settings.onClose())}
        >
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>AI Assistant Settings</DialogTitle>
            </DialogHeader>
            <AiSettingsPanel.ProvidersSettings />
            <AiSettingsPanel.ModelsSettings />
            <AiSettingsPanel.ModelParametersSettings />
          </DialogContent>
        </Dialog>
        <div className="min-h-0 grow overflow-auto">
          {initialized ? (
            <Chat.Messages key={sessionId} hoistedRenderers={['executeApi', 'execute_command']} />
          ) : (
            <p className="p-4 text-sm text-muted-foreground">Initializing database…</p>
          )}
        </div>
        <Chat.PromptSuggestions>
          <Chat.PromptSuggestions.Item text="Show me a summary of the data" />
          <Chat.PromptSuggestions.Item text="Is this data spatially clustered?" />
          <Chat.PromptSuggestions.Item text="Create a choropleth map" />
        </Chat.PromptSuggestions>
        <Chat.Composer placeholder="Ask about your spatial data…">
          <Chat.InlineApiKeyInput
            onSaveApiKey={(provider, apiKey) => updateProvider(provider, {apiKey})}
          />
          <div className="flex items-center justify-end gap-2">
            <Chat.PromptSuggestions.VisibilityToggle />
            <Chat.ModelSelector />
          </div>
        </Chat.Composer>
      </Chat>
    </div>
  );
}
