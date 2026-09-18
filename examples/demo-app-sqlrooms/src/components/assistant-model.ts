// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {createOpenAI} from '@ai-sdk/openai';
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
