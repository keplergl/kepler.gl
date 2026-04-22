// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {LanguageModel} from 'ai';
import {createOpenAICompatible} from '@ai-sdk/openai-compatible';
import {AiSliceState} from '@sqlrooms/ai-core';
import {StoreApi} from '@sqlrooms/room-store';

export function getModel(store: StoreApi<AiSliceState>): LanguageModel {
  const state = store.getState();
  const currentSession = state.ai.getCurrentSession();
  const provider = currentSession?.modelProvider || 'openai';
  const modelId = currentSession?.model || 'gpt-4.1';

  return createOpenAICompatible({
    apiKey: state.ai.getApiKeyFromSettings(),
    name: provider || '',
    baseURL: state.ai.getBaseUrlFromSettings() || 'https://api.openai.com/v1'
  }).chatModel(modelId);
}
