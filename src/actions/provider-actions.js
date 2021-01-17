// Copyright (c) 2021 Uber Technologies, Inc.
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
import {ACTION_PREFIX} from 'constants/action-types';

/** @type {import('./provider-actions').ProviderActionTypes} */
export const ActionTypes = {
  EXPORT_FILE_TO_CLOUD: `${ACTION_PREFIX}EXPORT_FILE_TO_CLOUD`,
  EXPORT_FILE_SUCCESS: `${ACTION_PREFIX}EXPORT_FILE_SUCCESS`,
  EXPORT_FILE_ERROR: `${ACTION_PREFIX}EXPORT_FILE_ERROR`,
  RESET_PROVIDER_STATUS: `${ACTION_PREFIX}RESET_PROVIDER_STATUS`,
  SET_CLOUD_PROVIDER: `${ACTION_PREFIX}SET_CLOUD_PROVIDER`,
  POST_SAVE_LOAD_SUCCESS: `${ACTION_PREFIX}POST_SAVE_LOAD_SUCCESS`,
  LOAD_CLOUD_MAP: `${ACTION_PREFIX}LOAD_CLOUD_MAP`,
  LOAD_CLOUD_MAP_SUCCESS: `${ACTION_PREFIX}LOAD_CLOUD_MAP_SUCCESS`,
  LOAD_CLOUD_MAP_ERROR: `${ACTION_PREFIX}LOAD_CLOUD_MAP_ERROR`,
  GET_SAVED_MAPS: `${ACTION_PREFIX}GET_SAVED_MAPS`,
  GET_SAVED_MAPS_SUCCESS: `${ACTION_PREFIX}GET_SAVED_MAPS_SUCCESS`,
  GET_SAVED_MAPS_ERROR: `${ACTION_PREFIX}GET_SAVED_MAPS_ERROR`
};

/**
 * Call provider to upload file to cloud
 * @param mapData
 * @param provider
 * @param options
 * @param onSuccess
 * @param onError
 * @param closeModal
 * @type {typeof import('./provider-actions').exportFileToCloud}
 */
export const exportFileToCloud = createAction(ActionTypes.EXPORT_FILE_TO_CLOUD, payload => payload);

/**
 * @type {typeof import('./provider-actions').exportFileSuccess}
 */
export const exportFileSuccess = createAction(ActionTypes.EXPORT_FILE_SUCCESS, payload => payload);

/** @type {typeof import('./provider-actions').exportFileError} */
export const exportFileError = createAction(ActionTypes.EXPORT_FILE_ERROR, payload => payload);

/** @type {typeof import('./provider-actions').postSaveLoadSuccess} */
export const postSaveLoadSuccess = createAction(
  ActionTypes.POST_SAVE_LOAD_SUCCESS,
  message => message
);

/** @type {typeof import('./provider-actions').resetProviderStatus} */
export const resetProviderStatus = createAction(ActionTypes.RESET_PROVIDER_STATUS);

/** @type {typeof import('./provider-actions').setCloudProvider} */
export const setCloudProvider = createAction(ActionTypes.SET_CLOUD_PROVIDER, provider => provider);

/** @type {typeof import('./provider-actions').loadCloudMap} */
export const loadCloudMap = createAction(ActionTypes.LOAD_CLOUD_MAP, payload => payload);

/** @type {typeof import('./provider-actions').loadCloudMapSuccess} */
export const loadCloudMapSuccess = createAction(
  ActionTypes.LOAD_CLOUD_MAP_SUCCESS,
  payload => payload
);

/** @type {typeof import('./provider-actions').loadCloudMapError} */
export const loadCloudMapError = createAction(ActionTypes.LOAD_CLOUD_MAP_ERROR, payload => payload);

/** @type {typeof import('./provider-actions').getSavedMaps} */
export const getSavedMaps = createAction(ActionTypes.GET_SAVED_MAPS, provider => provider);

/** @type {typeof import('./provider-actions').getSavedMapsSuccess} */
export const getSavedMapsSuccess = createAction(
  ActionTypes.GET_SAVED_MAPS_SUCCESS,
  payload => payload
);

/** @type {typeof import('./provider-actions').getSavedMapsError} */
export const getSavedMapsError = createAction(ActionTypes.GET_SAVED_MAPS_ERROR, payload => payload);
