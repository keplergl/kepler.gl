// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Action, handleActions} from 'redux-actions';
import {
  UPDATE_AI_ASSISTANT_CONFIG,
  UPDATE_AI_ASSISTANT_MESSAGES,
  SET_START_SCREEN_CAPTURE,
  SET_SCREEN_CAPTURED
} from '../actions';
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

// Initial state for the reducer
const initialConfig: AiAssistantConfig = {
  isReady: false,
  provider: 'openai',
  model: 'gpt-4o',
  apiKey: '',
  baseUrl: 'http://localhost:11434',
  temperature: 1.0,
  topP: 0.8
};

export type AiAssistantState = {
  config: AiAssistantConfig;
  messages: MessageModel[];
  screenshotToAsk: {
    startScreenCapture: boolean;
    screenCaptured: string;
  };
};

const initialState: AiAssistantState = {
  config: initialConfig,
  messages: [],
  screenshotToAsk: {
    startScreenCapture: false,
    screenCaptured: ''
  }
};

export const aiAssistantReducer = handleActions<AiAssistantState, any>(
  {
    [UPDATE_AI_ASSISTANT_CONFIG]: updateAiAssistantConfigHandler,
    [UPDATE_AI_ASSISTANT_MESSAGES]: updateAiAssistantMessagesHandler,
    [SET_START_SCREEN_CAPTURE]: setStartScreenCaptureHandler,
    [SET_SCREEN_CAPTURED]: setScreenCapturedHandler
  },
  initialState
);

function updateAiAssistantConfigHandler(
  state: AiAssistantState,
  action: Action<AiAssistantConfig>
) {
  return {
    ...state,
    config: {...state.config, ...action.payload}
  };
}

function updateAiAssistantMessagesHandler(state: AiAssistantState, action: Action<MessageModel[]>) {
  return {
    ...state,
    messages: action.payload
  };
}

function setStartScreenCaptureHandler(state: AiAssistantState, action: Action<boolean>) {
  return {
    ...state,
    screenshotToAsk: {startScreenCapture: action.payload, screenCaptured: ''}
  };
}

function setScreenCapturedHandler(state: AiAssistantState, action: Action<string>) {
  return {
    ...state,
    screenshotToAsk: {...state.screenshotToAsk, screenCaptured: action.payload}
  };
}
