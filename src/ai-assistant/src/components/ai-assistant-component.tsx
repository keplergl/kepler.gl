// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {Chat, useStoreWithAi} from '@sqlrooms/ai-core';
import {AiSettingsPanel, useStoreWithAiSettings} from '@sqlrooms/ai-settings';
import {Button, useDisclosure} from '@sqlrooms/ui';
import {Settings} from 'lucide-react';

const HOISTED_RENDERERS = [
  'histogramTool',
  'boxplotTool',
  'scatterplotTool',
  'bubbleChartTool',
  'pcpTool'
];

/**
 * The main AI Assistant chat component using sqlrooms Chat compound component.
 * Replaces the old AiAssistant from @openassistant/ui.
 */
export function AiAssistantComponent() {
  const settingsOpen = useDisclosure();
  const updateProvider = useStoreWithAiSettings(s => s.aiSettings.updateProvider);
  const currentSessionId = useStoreWithAi(s => s.ai.config.currentSessionId || null);

  return (
    <div
      className="dark bg-background flex h-full w-full flex-col gap-0 overflow-hidden p-2"
      style={{zoom: 0.85}}
    >
      <Chat>
        <div className="mb-2 flex items-center gap-1">
          <Chat.Sessions className="min-w-0 flex-1" />
          <Button
            variant="ghost"
            className="flex h-8 w-8 shrink-0 items-center justify-center"
            onClick={settingsOpen.onToggle}
            title="Configuration"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {settingsOpen.isOpen ? (
          <div className="grow overflow-auto">
            {currentSessionId && (
              <AiSettingsPanel disclosure={settingsOpen}>
                <AiSettingsPanel.ProvidersSettings />
                <AiSettingsPanel.ModelsSettings />
                <AiSettingsPanel.ModelParametersSettings />
              </AiSettingsPanel>
            )}
          </div>
        ) : (
          <>
            <div className="grow overflow-auto">
              <Chat.Messages key={currentSessionId} hoistedRenderers={HOISTED_RENDERERS} />
            </div>
            <Chat.Composer>
              <Chat.InlineApiKeyInput
                onSaveApiKey={(provider: string, apiKey: string) => {
                  updateProvider(provider, {apiKey});
                }}
              />
              <Chat.ModelSelector />
            </Chat.Composer>
          </>
        )}
      </Chat>
    </div>
  );
}
