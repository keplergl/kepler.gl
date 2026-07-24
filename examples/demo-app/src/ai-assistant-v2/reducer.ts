import {handleActions} from 'redux-actions';
import {
  SET_START_SCREEN_CAPTURE,
  SET_SCREEN_CAPTURED,
  SET_MAP_BOUNDARY
} from './screenshot-actions';

export type AiAssistantState = {
  screenshotToAsk: {
    startScreenCapture: boolean;
    screenCaptured: string;
  };
  keplerGl?: {
    mapBoundary?: {
      nw: [number, number];
      se: [number, number];
    };
  };
};

const initialState: AiAssistantState = {
  screenshotToAsk: {
    startScreenCapture: false,
    screenCaptured: ''
  }
};

export const aiAssistantReducer = handleActions<AiAssistantState, any>(
  {
    [SET_START_SCREEN_CAPTURE]: (state, action) => ({
      ...state,
      screenshotToAsk: {startScreenCapture: action.payload, screenCaptured: ''}
    }),
    [SET_SCREEN_CAPTURED]: (state, action) => ({
      ...state,
      screenshotToAsk: {...state.screenshotToAsk, screenCaptured: action.payload}
    }),
    [SET_MAP_BOUNDARY]: (state, action) => ({
      ...state,
      keplerGl: {
        ...state.keplerGl,
        mapBoundary: action.payload
      }
    })
  },
  initialState
);
