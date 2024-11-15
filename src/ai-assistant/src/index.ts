// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export * from './localization';

export {default as AiAssistantManagerFactory} from './components/ai-assistant-manager';
export {default as AiAssistantConfigFactory} from './components/ai-assistant-config';
export {default as AiAssistantComponentFactory} from './components/ai-assistant-component';

export {default as AiAssistantControlFactory} from './map/ai-assistant-control';

export type AiAssistantConfig = {
  isReady: boolean;
  provider: string;
  model: string;
  apiKey: string;
  baseUrl: string;
  temperature: number;
  topP: number;
};
