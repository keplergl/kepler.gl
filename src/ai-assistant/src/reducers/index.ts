import {handleActions} from 'redux-actions';
import {AiAssistantConfig, UPDATE_AI_ASSISTANT_CONFIG} from '../actions';

// Initial state for the reducer
const initialState: AiAssistantConfig = {
  isReady: false,
  provider: 'openai',
  model: 'gpt-4o-mini',
  apiKey: '',
  baseUrl: 'http://localhost:11434',
  temperature: 1.0,
  topP: 0.8
};

export const aiAssistantReducer = handleActions<AiAssistantConfig, AiAssistantConfig>(
  {
    [UPDATE_AI_ASSISTANT_CONFIG]: updateAiAssistantConfig
  },
  initialState
);

function updateAiAssistantConfig(state: AiAssistantConfig, action: {payload: AiAssistantConfig}) {
  return {
    ...state,
    ...action.payload
  };
}
