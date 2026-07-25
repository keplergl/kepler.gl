import {createOpenAICompatible} from '@ai-sdk/openai-compatible';
import type {AiSliceState} from '@sqlrooms/ai-core';
import type {StoreApi} from '@sqlrooms/room-store';
import type {LanguageModel} from 'ai';

/**
 * Resolve the current session's language model for a skill sub-agent. Mirrors
 * the model-construction logic in `@sqlrooms/ai-core`'s chat transport: it
 * reads the session's provider/model + the API key/base URL from the AI
 * settings slice and builds an OpenAI-compatible client. All configured
 * providers (openai, anthropic, google, deepseek, xai, ollama) are
 * OpenAI-compatible in this app, so a single client covers them.
 *
 * `@ai-sdk/openai-compatible` (v1.0.x) emits `specificationVersion = "v2"`,
 * which `ai` v7's `ToolLoopAgent` accepts directly. (Older 0.2.x emits "v1" and
 * throws `UnsupportedModelVersionError` under `ai` v7 — that was the skill
 * sub-agent crash seen when changing the basemap to "dark".)
 */
export function getModel(store: StoreApi<AiSliceState>): LanguageModel {
  const state = store.getState();
  const currentSession = state.ai.getCurrentSession();
  const provider = currentSession?.modelProvider || 'openai';
  const modelId = currentSession?.model || 'gpt-5';

  return createOpenAICompatible({
    apiKey: state.ai.getApiKeyFromSettings(),
    name: provider || '',
    baseURL: state.ai.getBaseUrlFromSettings() || 'https://api.openai.com/v1'
  }).chatModel(modelId) as unknown as LanguageModel;
}
