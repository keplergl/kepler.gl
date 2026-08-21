import React from 'react';
import {Chat, AiSettingsPanel, useGenerateSessionTitle} from '@sqlrooms/ai';
import {useRoomStore} from '../store';
import {getEchartsHoistedRenderers} from '../tools/echarts-renderers';
import {useDisclosure} from '@sqlrooms/ui';
import {Settings2} from 'lucide-react';

// Hoist every registered ECharts renderer. Deriving the list from the
// renderer registry (rather than hardcoding tool names) makes a registered-
// but-unhoisted renderer — which silently draws nothing — impossible.
const HOISTED_RENDERERS: string[] = getEchartsHoistedRenderers();

let _internalComponentsLoaded = false;
let SessionChatRuntimeProvider: React.FC<{children: React.ReactNode}>;
let ToolRenderBehaviorProvider: React.FC<{value: any; children: React.ReactNode}>;
let SessionChatManager: React.FC;

function loadInternalComponents() {
  if (_internalComponentsLoaded) return;
  _internalComponentsLoaded = true;
  const runtimeCtx = require('@sqlrooms/ai-core/components/ChatRuntimeContext');
  const flatAgent = require('@sqlrooms/ai-core/components/FlatAgentRenderer');
  const sessionMgr = require('@sqlrooms/ai-core/components/SessionChatManager');
  SessionChatRuntimeProvider = runtimeCtx.SessionChatRuntimeProvider;
  ToolRenderBehaviorProvider = flatAgent.ToolRenderBehaviorProvider;
  SessionChatManager = sessionMgr.SessionChatManager;
}

const EMPTY_BEHAVIOR = {};

/**
 * Auto-generates a descriptive title for each chat session after the first user
 * message. The sqlrooms library exports `useGenerateSessionTitle` but leaves it
 * to the consuming app to mount it — without this hook, every session stays
 * named "Untitled" forever. Gated on the current provider having an API key so
 * a key-less chat never tries to call the LLM (and thereby renames a session to
 * an error string).
 */
function AutoSessionTitle() {
  const hasApiKey = useRoomStore(s => {
    const session = s.ai.getCurrentSession();
    if (!session) return false;
    if (session.modelProvider === 'custom') {
      const customModel = s.aiSettings.config.customModels?.find(
        m => m.modelName === session.model
      );
      return Boolean(customModel?.apiKey);
    }
    return Boolean(s.aiSettings.config.providers?.[session.modelProvider]?.apiKey);
  });
  useGenerateSessionTitle({enabled: hasApiKey});
  return null;
}

function ChatRoot({children}: {children: React.ReactNode}) {
  loadInternalComponents();
  return (
    <ToolRenderBehaviorProvider value={EMPTY_BEHAVIOR}>
      <SessionChatRuntimeProvider>
        <SessionChatManager />
        <AutoSessionTitle />
        {children}
      </SessionChatRuntimeProvider>
    </ToolRenderBehaviorProvider>
  );
}

class ChatErrorBoundary extends React.Component<
  {children: React.ReactNode},
  {hasError: boolean; errorMsg: string}
> {
  state = {hasError: false, errorMsg: ''};

  static getDerivedStateFromError(error: Error) {
    return {hasError: true, errorMsg: error.message};
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
          <p className="text-destructive text-xs">Chat crashed: {this.state.errorMsg}</p>
          <button
            className="rounded bg-primary px-3 py-1 text-xs text-primary-foreground"
            onClick={() => this.setState({hasError: false, errorMsg: ''})}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function MainView() {
  const isDataAvailable = useRoomStore(s => s.room.initialized);
  const currentSessionId = useRoomStore(s => s.ai.config.currentSessionId);
  const updateProvider = useRoomStore(s => s.aiSettings.updateProvider);
  const settings = useDisclosure();

  return (
    <div className="flex h-full flex-col bg-background text-foreground p-3 text-xs">
      <ChatRoot>
        <div className="mb-3 flex items-center justify-between gap-2">
          <Chat.Sessions className="flex-1" />
          <button
            onClick={settings.onToggle}
            className="rounded-md p-1.5 hover:bg-white/10"
            title="AI Settings"
          >
            <Settings2 size={16} />
          </button>
        </div>

        {settings.isOpen && (
          <div className="mb-3 max-h-[100vh] overflow-y-auto rounded-md border border-white/10 p-3">
            <AiSettingsPanel.ProvidersSettings />
            <AiSettingsPanel.ModelsSettings />
            <AiSettingsPanel.ModelParametersSettings />
          </div>
        )}

        <div className="grow overflow-auto">
          <ChatErrorBoundary>
            {isDataAvailable ? (
              <Chat.Messages key={currentSessionId} hoistedRenderers={HOISTED_RENDERERS} />
            ) : (
              <div className="flex h-full items-center justify-center text-sm opacity-50">
                Initializing...
              </div>
            )}
          </ChatErrorBoundary>
        </div>

        <Chat.PromptSuggestions>
          <Chat.PromptSuggestions.Item text="What questions can I ask about this data?" />
          <Chat.PromptSuggestions.Item text="Show me a summary of the data" />
          <Chat.PromptSuggestions.Item text="Is this data spatially clustered?" />
          <Chat.PromptSuggestions.Item text="Create a choropleth map" />
        </Chat.PromptSuggestions>

        <Chat.Composer placeholder="Ask about your spatial data...">
          <Chat.InlineApiKeyInput
            onSaveApiKey={(provider, apiKey) => {
              updateProvider(provider, {apiKey});
            }}
          />
          <div className="flex items-center justify-end gap-2">
            <Chat.PromptSuggestions.VisibilityToggle />
            <Chat.ModelSelector />
          </div>
        </Chat.Composer>
      </ChatRoot>
    </div>
  );
}
