// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {skillStorage} from '@openassistant/kepler-assistant/integration';
import {
  createDiscoverSkillTool,
  createRunSkillTool,
  getModel
} from '@openassistant/kepler-assistant/chat';
import {toChatToolSurface} from '@openassistant/kepler-assistant/tool-surface';
import type {StoreApi} from '@sqlrooms/room-store';
import type {DemoRoomState} from './sqlrooms-demo-layout';
import {getOpenAiModel} from './assistant-model';

export function createAssistantSkillTools(store: StoreApi<DemoRoomState>) {
  return {
    discoverSkill: createDiscoverSkillTool({store, storage: skillStorage}),
    // The published convenience factory hardcodes a Chat Completions model.
    // Use its underlying factory to share the host's Responses resolver.
    runSkill: createRunSkillTool({
      store,
      storage: skillStorage,
      getChatToolSurface: () =>
        toChatToolSurface({
          listTools: () => Object.keys(store.getState().commands.registry),
          invoke: (commandId, input) =>
            store.getState().commands.invokeCommand(commandId, input ?? {})
        }),
      getModel: () => getOpenAiModel(store) ?? getModel(store)
    })
  };
}
