// Copyright (c) 2022 Uber Technologies, Inc.
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

import {createAction} from '@reduxjs/toolkit';
import {ACTION_PREFIX} from './action-types';
import {SavedMap} from 'schemas';
import {MapListItem, Provider} from 'cloud-providers';

// eslint-disable-next-line prettier/prettier
const assignType = <T>(obj: T): { [K in keyof T]: `${typeof ACTION_PREFIX}${string & K}`; } => obj as any
export const ActionTypes = assignType({
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
});

/**
 * Call provider to upload file to cloud
 * @param mapData
 * @param provider
 * @param options
 * @param onSuccess
 * @param onError
 * @param closeModal
 */
export const exportFileToCloud: (
  p: ExportFileToCloudPayload
) => {
  type: typeof ActionTypes.EXPORT_FILE_TO_CLOUD;
  payload: ExportFileToCloudPayload;
} = createAction(ActionTypes.EXPORT_FILE_TO_CLOUD, (payload: ExportFileToCloudPayload) => ({payload}));

/** EXPORT_FILE_SUCCESS */
export type ExportFileSuccessPayload = {
  response: any;
  provider: Provider;
  options?: ExportFileOptions;
  onSuccess?: OnSuccessCallBack;
  closeModal?: boolean;
};

export const exportFileSuccess: (
  p: ExportFileSuccessPayload
) => {
  type: typeof ActionTypes.EXPORT_FILE_SUCCESS;
  payload: ExportFileSuccessPayload;
} = createAction(ActionTypes.EXPORT_FILE_SUCCESS, (payload: ExportFileSuccessPayload) => ({payload}));

/** EXPORT_FILE_ERROR */
export type ExportFileErrorPayload = {
  error: any;
  provider: Provider;
  options?: ExportFileOptions;
  onError?: OnErrorCallBack;
};

export const exportFileError: (
  p: ExportFileErrorPayload
) => {
  type: typeof ActionTypes.EXPORT_FILE_ERROR;
  payload: ExportFileErrorPayload;
} = createAction(ActionTypes.EXPORT_FILE_ERROR, (payload: ExportFileErrorPayload) => ({payload}));

/** POST_SAVE_LOAD_SUCCESS */
export type PostSaveLoadSuccessPayload = string;
export const postSaveLoadSuccess: (
  p: PostSaveLoadSuccessPayload
) => {
  type: typeof ActionTypes.POST_SAVE_LOAD_SUCCESS;
  payload: PostSaveLoadSuccessPayload;
} = createAction(
  ActionTypes.POST_SAVE_LOAD_SUCCESS,
  (message: PostSaveLoadSuccessPayload) => ({payload : message})
);

export const resetProviderStatus: () => {
  type: typeof ActionTypes.RESET_PROVIDER_STATUS;
} = createAction(ActionTypes.RESET_PROVIDER_STATUS);

/** SET_CLOUD_PROVIDER */
export type SetCloudProviderPayload = string;
export const setCloudProvider: (
  p: SetCloudProviderPayload
) => {
  type: typeof ActionTypes.SET_CLOUD_PROVIDER;
  payload: SetCloudProviderPayload;
} = createAction(ActionTypes.SET_CLOUD_PROVIDER, (provider: SetCloudProviderPayload) => ({payload : provider}));

/** LOAD_CLOUD_MAP */
export type LoadCloudMapPayload = {
  loadParams: any;
  provider: string;
  onSuccess?: any;
  onError?: OnErrorCallBack;
};
export const loadCloudMap: (
  p: LoadCloudMapPayload
) => {
  type: typeof ActionTypes.LOAD_CLOUD_MAP;
  payload: LoadCloudMapPayload;
} = createAction(ActionTypes.LOAD_CLOUD_MAP, payload => ({payload}));

/** LOAD_CLOUD_MAP_SUCCESS */
type LoadCloudMapSuccessCallback = (p: {response: any; loadParams: any; provider: Provider}) => any;
export type LoadCloudMapSuccessPayload = {
  response: any;
  loadParams: any;
  provider: Provider;
  onSuccess?: LoadCloudMapSuccessCallback;
  onError?: OnErrorCallBack;
};
export const loadCloudMapSuccess: (
  p: LoadCloudMapSuccessPayload
) => {
  type: typeof ActionTypes.LOAD_CLOUD_MAP_SUCCESS;
  payload: LoadCloudMapSuccessPayload;
} = createAction(
  ActionTypes.LOAD_CLOUD_MAP_SUCCESS,
  (payload: LoadCloudMapSuccessPayload) => ({payload})
);

/** LOAD_CLOUD_MAP_ERROR */
export type LoadCloudMapErrorPayload = {
  error: any;
  provider: Provider;
  onError?: OnErrorCallBack;
};
export const loadCloudMapError: (
  p: LoadCloudMapErrorPayload
) => {
  type: typeof ActionTypes.LOAD_CLOUD_MAP_ERROR;
  payload: LoadCloudMapErrorPayload;
} = createAction(ActionTypes.LOAD_CLOUD_MAP_ERROR, (payload: LoadCloudMapErrorPayload) => ({payload}));

/** GET_SAVED_MAPS */
export type GetSavedMapsPayload = string;
export const getSavedMaps: (
  p: GetSavedMapsPayload
) => {
  type: typeof ActionTypes.GET_SAVED_MAPS;
  payload: GetSavedMapsPayload;
} = createAction(ActionTypes.GET_SAVED_MAPS, (provider: GetSavedMapsPayload) => ({payload : provider}));

/** GET_SAVED_MAPS_SUCCESS */
export type GetSavedMapsSuccessPayload = {
  visualizations: MapListItem[];
  provider: string;
};
export const getSavedMapsSuccess: (
  p: GetSavedMapsSuccessPayload
) => {
  type: typeof ActionTypes.GET_SAVED_MAPS_SUCCESS;
  payload: GetSavedMapsSuccessPayload;
} = createAction(
  ActionTypes.GET_SAVED_MAPS_SUCCESS,
  (payload: GetSavedMapsSuccessPayload) => ({payload})
);

/** GET_SAVED_MAPS_ERROR */
export type GetSavedMapsErrorPayload = {
  error: any;
  provider: string;
};
export const getSavedMapsError: (
  p: GetSavedMapsErrorPayload
) => {
  type: typeof ActionTypes.GET_SAVED_MAPS_ERROR;
  payload: GetSavedMapsErrorPayload;
} = createAction(ActionTypes.GET_SAVED_MAPS_ERROR, payload => ({payload}));
