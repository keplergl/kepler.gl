// Copyright (c) 2020 Uber Technologies, Inc.
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

import {createAction} from 'redux-actions';
import keyMirror from 'keymirror';
import {addPrefix} from 'constants/action-types';

export const ActionTypes = addPrefix(
  keyMirror({
    EXPORT_FILE_TO_CLOUD: null,
    EXPORT_FILE_SUCCESS: null,
    EXPORT_FILE_ERROR: null,
    RESET_PROVIDER_STATUS: null,
    SET_CLOUD_PROVIDER: null,
    POST_SAVE_LOAD_SUCCESS: null,
    LOAD_CLOUD_MAP: null,
    LOAD_CLOUD_MAP_SUCCESS: null,
    LOAD_CLOUD_MAP_ERROR: null,
    GET_SAVED_MAPS: null,
    GET_SAVED_MAPS_SUCCESS: null,
    GET_SAVED_MAPS_ERROR: null
  })
);

export const exportFileToCloud = createAction(
  ActionTypes.EXPORT_FILE_TO_CLOUD,
  payload => payload
);

export const exportFileSuccess = createAction(
  ActionTypes.EXPORT_FILE_SUCCESS,
  payload => payload
);

export const exportFileError = createAction(
  ActionTypes.EXPORT_FILE_ERROR,
  payload => payload
);

export const postSaveLoadSuccess = createAction(
  ActionTypes.POST_SAVE_LOAD_SUCCESS,
  message => message
);

export const resetProviderStatus = createAction(
  ActionTypes.RESET_PROVIDER_STATUS
);

export const setCloudProvider = createAction(
  ActionTypes.SET_CLOUD_PROVIDER,
  provider => provider
);

export const loadCloudMap = createAction(
  ActionTypes.LOAD_CLOUD_MAP,
  payload => payload
);

export const loadCloudMapSuccess = createAction(
  ActionTypes.LOAD_CLOUD_MAP_SUCCESS,
  payload => payload
);

export const getSavedMaps = createAction(
  ActionTypes.GET_SAVED_MAPS,
  provider => provider
);

export const getSavedMapsSuccess = createAction(
  ActionTypes.GET_SAVED_MAPS_SUCCESS,
  payload => payload
);

export const getSavedMapsError = createAction(
  ActionTypes.GET_SAVED_MAPS_ERROR,
  payload => payload
);
