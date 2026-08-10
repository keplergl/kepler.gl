import type {AiSettingsSliceConfig} from '@sqlrooms/ai';

export const PROVIDER_DEFAULT_BASE_URLS: Record<string, string> = {
  openai: 'https://api.openai.com/v1',
  anthropic: 'https://api.anthropic.com/v1',
  google: 'https://generativelanguage.googleapis.com/v1beta',
  deepseek: 'https://api.deepseek.com/v1',
  xai: 'https://api.x.ai/v1',
  ollama: 'http://localhost:11434/v1'
};

export const LLM_MODELS = [
  {name: 'openai', models: ['gpt-5.2', 'gpt-5']},
  {name: 'anthropic', models: ['claude-3-5-sonnet', 'claude-3-5-haiku']},
  {
    name: 'google',
    models: [
      'gemini-2.0-pro-exp-02-05',
      'gemini-2.0-flash',
      'gemini-2.0-flash-lite',
      'gemini-1.5-pro',
      'gemini-1.5-flash'
    ]
  },
  {name: 'deepseek', models: ['deepseek-chat']},
  {name: 'xai', models: ['grok-3-mini']},
  {name: 'ollama', models: ['deepseek-v4-flash:cloud', 'qwen3:32b', 'gpt-oss']}
];

export const AI_SETTINGS = {
  providers: LLM_MODELS.reduce((acc, provider) => {
    acc[provider.name] = {
      baseUrl: PROVIDER_DEFAULT_BASE_URLS[provider.name] || '',
      apiKey: '',
      models: provider.models.map(model => ({id: model, modelName: model}))
    };
    return acc;
  }, {} as Record<string, {baseUrl: string; apiKey: string; models: {id: string; modelName: string}[]}>)
} satisfies Pick<AiSettingsSliceConfig, 'providers'>;
