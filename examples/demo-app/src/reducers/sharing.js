// Copyright (c) 2019 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import {handleActions} from 'redux-actions';
import {CLOUD_PROVIDERS} from '../utils/cloud-providers';
import {CLOUD_LOGIN_SUCCESS, LOAD_REMOTE_RESOURCE_ERROR, PUSHING_FILE} from '../actions';

const readAuthTokens = () => Object.keys(CLOUD_PROVIDERS)
  .reduce((tokens, name) => ({
    ...tokens,
    [name]: CLOUD_PROVIDERS[name].getAccessToken()
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
  [CLOUD_LOGIN_SUCCESS]: state => ({
    ...state,
    tokens: readAuthTokens()
  })
}, sharingInitialState);

export default sharingReducer;
