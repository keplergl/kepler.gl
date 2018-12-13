import {handleActions} from 'redux-actions';
import { AUTH_HANDLERS } from '../utils/sharing/authentication';
import { CLOUD_LOGIC_SUCCESS, LOAD_REMOTE_RESOURCE_ERROR, PUSHING_FILE } from '../actions';

const readAuthTokens = () => Object.keys(AUTH_HANDLERS)
  .reduce((tokens, name) => ({
    ...tokens,
    [name]: AUTH_HANDLERS[name].getAccessToken()
  }), {});

const sharingInitialState = {
  isLoading: false,
  status: null,
  info: null,
  tokens: readAuthTokens()
};

// file upload reducer
export const sharingReducer = handleActions({
  [LOAD_REMOTE_RESOURCE_ERROR]: (state, action) => ({
    ...state,
    error: action.error,
    currentOption: {dataUrl: action.url},
    isMapLoading: false
  }),
  [PUSHING_FILE]: (state, action) => ({
    ...state,
    isLoading: action.isLoading,
    info: action.metadata
  }),
  [CLOUD_LOGIC_SUCCESS]: state => ({
    ...state,
    tokens: readAuthTokens()
  })
}, sharingInitialState);

export default sharingReducer;
