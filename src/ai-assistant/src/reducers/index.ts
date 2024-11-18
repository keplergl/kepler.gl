import {Action, handleActions} from 'redux-actions';
import {
  AiAssistantConfig,
  UPDATE_AI_ASSISTANT_CONFIG,
  UPDATE_AI_ASSISTANT_MESSAGES
} from '../actions';
import {MessageModel} from 'react-ai-assist';

// Initial state for the reducer
const initialConfig: AiAssistantConfig = {
  isReady: false,
  provider: 'openai',
  model: 'gpt-4o-mini',
  apiKey: '',
  baseUrl: 'http://localhost:11434',
  temperature: 1.0,
  topP: 0.8
};

export type AiAssistantState = {
  config: AiAssistantConfig;
  messages: MessageModel[];
};

const initialState: AiAssistantState = {
  config: initialConfig,
  messages: []
};

export const aiAssistantReducer = handleActions<AiAssistantState, any>(
  {
    [UPDATE_AI_ASSISTANT_CONFIG]: updateAiAssistantConfig,
    [UPDATE_AI_ASSISTANT_MESSAGES]: updateAiAssistantMessages
  },
  initialState
);

function updateAiAssistantConfig(state: AiAssistantState, action: Action<AiAssistantConfig>) {
  return {
    ...state,
    config: {...state.config, ...action.payload}
  };
}

function updateAiAssistantMessages(state: AiAssistantState, action: Action<MessageModel[]>) {
  return {
    ...state,
    messages: action.payload
  };
}
