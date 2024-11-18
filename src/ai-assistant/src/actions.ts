import {MessageModel} from 'react-ai-assist';
import {AiAssistantConfig} from './reducers';

const ACTION_PREFIX = '@@react-ai-assistant/';

export const UPDATE_AI_ASSISTANT_CONFIG = `${ACTION_PREFIX}UPDATE_AI_ASSISTANT_CONFIG`;
export const UPDATE_AI_ASSISTANT_MESSAGES = `${ACTION_PREFIX}UPDATE_AI_ASSISTANT_MESSAGES`;
export const SET_START_SCREEN_CAPTURE = `${ACTION_PREFIX}SET_START_SCREEN_CAPTURE`;
export const SET_SCREEN_CAPTURED = `${ACTION_PREFIX}SET_SCREEN_CAPTURED`;

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

export function setStartScreenCapture(flag: boolean) {
  return {
    type: SET_START_SCREEN_CAPTURE,
    payload: flag
  };
}

export function setScreenCaptured(screenshot: string) {
  return {
    type: SET_SCREEN_CAPTURED,
    payload: screenshot
  };
}
