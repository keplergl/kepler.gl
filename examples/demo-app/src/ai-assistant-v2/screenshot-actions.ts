const ACTION_PREFIX = '@@openassistant/';

export const SET_START_SCREEN_CAPTURE = `${ACTION_PREFIX}SET_START_SCREEN_CAPTURE`;
export const SET_SCREEN_CAPTURED = `${ACTION_PREFIX}SET_SCREEN_CAPTURED`;
export const SET_MAP_BOUNDARY = `${ACTION_PREFIX}SET_MAP_BOUNDARY`;

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

export function setMapBoundary(nw: [number, number], se: [number, number]) {
  return {
    type: SET_MAP_BOUNDARY,
    payload: {nw, se}
  };
}
