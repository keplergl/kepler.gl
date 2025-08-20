// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export const PROVIDER_DEFAULT_BASE_URLS = {
  "openai": "https://api.openai.com/v1",
  "anthropic": "https://api.anthropic.com/v1",
  "google": "https://generativelanguage.googleapis.com/v1beta",
  "deepseek": "https://api.deepseek.com/v1",
  "xai": "https://api.x.ai/v1",
  "ollama": "http://localhost:11434/api"
};

export const PROVIDER_MODELS = {
  openai: [
    'gpt-4.1',
    'gpt-4o',
    'gpt-4o-mini',
    'gpt-4',
    'gpt-3.5-turbo',
    'o1',
    'o1-preview',
    'o1-mini'
  ],
  google: [
    'gemini-2.5-flash',
    'gemini-2.5-pro',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro'
  ],
  deepseek: ['deepseek-chat'],
  anthropic: [
    'claude-opus-4-1',
    'claude-opus-4-0',
    'claude-sonnet-4-0',
    'claude-3.7-sonnet',
    'claude-3.5-sonnet',
    'claude-3.5-haiku',
    'claude-3-opus',
    'claude-3-sonnet',
    'claude-3-haiku'
  ],
  xai: ['grok-3', 'grok-3-fast', 'grok-3-mini', 'grok-3-mini-fast'],
  ollama: ['qwen3:32b', 'gpt-oss']
};
