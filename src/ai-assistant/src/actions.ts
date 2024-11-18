import {MessageModel} from 'react-ai-assist';

export type AiAssistantConfig = {
  isReady: boolean;
  provider: string;
  model: string;
  apiKey: string;
  baseUrl: string;
  temperature: number;
  topP: number;
};
const ACTION_PREFIX = '@@react-ai-assistant/';

export const UPDATE_AI_ASSISTANT_CONFIG = `${ACTION_PREFIX}UPDATE_AI_ASSISTANT_CONFIG`;
export const UPDATE_AI_ASSISTANT_MESSAGES = `${ACTION_PREFIX}UPDATE_AI_ASSISTANT_MESSAGES`;

// Action creators
export function updateAiAssistantConfig(config: AiAssistantConfig) {
  return {
    type: UPDATE_AI_ASSISTANT_CONFIG,
    payload: config
  };
}

export function updateAiAssistantMessages(messages: MessageModel[]) {
  return {
    type: UPDATE_AI_ASSISTANT_MESSAGES,
    payload: messages
  };
}
