export type AiAssistantConfig = {
  isReady: boolean;
  provider: string;
  model: string;
  apiKey: string;
  baseUrl: string;
  temperature: number;
  topP: number;
};
const ACTION_PREFIX = 'REACT_AI_ASSISTANT';

export const UPDATE_AI_ASSISTANT_CONFIG = `${ACTION_PREFIX}_UPDATE_AI_ASSISTANT_CONFIG`;

// Action creators
export function updateAiAssistantConfig(config: AiAssistantConfig) {
  return {
    type: UPDATE_AI_ASSISTANT_CONFIG,
    payload: config
  };
}
