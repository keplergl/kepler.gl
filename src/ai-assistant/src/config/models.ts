// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {AiSettingsSliceConfig} from '@sqlrooms/ai-config';

export const PROVIDER_DEFAULT_BASE_URLS = {
  openai: 'https://api.openai.com/v1',
  anthropic: 'https://api.anthropic.com/v1',
  google: 'https://generativelanguage.googleapis.com/v1beta',
  deepseek: 'https://api.deepseek.com/v1',
  xai: 'https://api.x.ai/v1',
  ollama: 'http://localhost:11434/api'
} as const;

export const LLM_MODELS = [
  {
    name: 'openai',
    models: ['gpt-4.6', 'gpt-4.5', 'gpt-4.1']
  },
  {
    name: 'google',
    models: ['gemini-3.0-flash', 'gemini-3.0-pro', 'gemini-2.5-flash', 'gemini-2.5-pro']
  },
  {name: 'deepseek', models: ['deepseek-chat']},
  {
    name: 'anthropic',
    models: ['claude-opus-4-6', 'claude-opus-4-5', 'claude-sonnet-4-6', 'claude-sonnet-4-5']
  },
  {name: 'xai', models: ['grok-3', 'grok-3-fast', 'grok-3-mini', 'grok-3-mini-fast']},
  {name: 'ollama', models: ['qwen3:32b', 'gpt-oss']}
];

export const AI_SETTINGS: Pick<AiSettingsSliceConfig, 'providers'> = {
  providers: LLM_MODELS.reduce((acc, provider) => {
    acc[provider.name] = {
      baseUrl: PROVIDER_DEFAULT_BASE_URLS[provider.name as keyof typeof PROVIDER_DEFAULT_BASE_URLS],
      apiKey: '',
      models: provider.models.map(model => ({id: model, modelName: model}))
    };
    return acc;
  }, {} as Record<string, any>)
};
