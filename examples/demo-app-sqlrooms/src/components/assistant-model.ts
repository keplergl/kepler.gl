// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {createOpenAI} from '@ai-sdk/openai';
import {getChatModel as getProviderModel} from '@openassistant/kepler-assistant/integration';
import {defaultSettingsMiddleware, wrapLanguageModel} from 'ai';
import type {AiSliceState} from '@sqlrooms/ai';
import type {StoreApi} from '@sqlrooms/room-store';

/** Resolve at request time so model, key, and endpoint changes take effect together. */
export function getOpenAiModel(store: StoreApi<AiSliceState>) {
  const {ai} = store.getState();
  const {modelProvider, model} = ai.getSelectedModel();
  if (modelProvider !== 'openai') return undefined;

  const apiKey = ai.getApiKeyFromSettings(modelProvider, model);
  // Let SQLRooms show its normal API-key input until credentials are configured.
  if (!apiKey) return undefined;

  return wrapLanguageModel({
    model: createOpenAI({
      apiKey,
      baseURL: ai.getBaseUrlFromSettings(modelProvider, model) || 'https://api.openai.com/v1'
    }).responses(model),
    // The room owns conversation history. The SDK carries encrypted reasoning
    // between tool steps without relying on server-stored response IDs.
    middleware: defaultSettingsMiddleware({settings: {providerOptions: {openai: {store: false}}}})
  });
}

/**
 * The chat transport's model factory (`AiSliceOptions.getCustomModel`).
 *
 * openai keeps its own Responses-API client above, which the other providers do
 * not speak. Everything else is built by kepler-assistant, so it carries the
 * per-provider request headers the browser needs: anthropic refuses a
 * browser-origin call without `anthropic-dangerous-direct-browser-access`, and
 * because that makes the CORS preflight fail before the request is sent, the
 * chat would otherwise only report `Failed to fetch`.
 *
 * Returns undefined until the selected provider has an API key — same contract
 * as `getOpenAiModel`, so SQLRooms keeps showing its API-key input instead of
 * treating the model as ready.
 */
export function getChatModel(store: StoreApi<AiSliceState>) {
  return store.getState().ai.getSelectedModel().modelProvider === 'openai'
    ? getOpenAiModel(store)
    : getProviderModel(store);
}
