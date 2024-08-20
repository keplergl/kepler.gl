// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {createAction} from '@reduxjs/toolkit';
import {ACTION_PREFIX} from './action-types';
import {
  ExportFileOptions,
  ExportFileToCloudPayload,
  OnErrorCallBack,
  OnSuccessCallBack
} from '@kepler.gl/types';
import {Provider} from '@kepler.gl/cloud-providers';

// eslint-disable-next-line prettier/prettier
const assignType = <T>(obj: T): { [K in keyof T]: `${typeof ACTION_PREFIX}${string & K}`; } => obj as any
export const ActionTypes = assignType({
  EXPORT_FILE_TO_CLOUD: `${ACTION_PREFIX}EXPORT_FILE_TO_CLOUD`,
  EXPORT_FILE_SUCCESS: `${ACTION_PREFIX}EXPORT_FILE_SUCCESS`,
  EXPORT_FILE_ERROR: `${ACTION_PREFIX}EXPORT_FILE_ERROR`,
  RESET_PROVIDER_STATUS: `${ACTION_PREFIX}RESET_PROVIDER_STATUS`,
  POST_SAVE_LOAD_SUCCESS: `${ACTION_PREFIX}POST_SAVE_LOAD_SUCCESS`,
  LOAD_CLOUD_MAP: `${ACTION_PREFIX}LOAD_CLOUD_MAP`,
  LOAD_CLOUD_MAP_SUCCESS: `${ACTION_PREFIX}LOAD_CLOUD_MAP_SUCCESS`,
  LOAD_CLOUD_MAP_ERROR: `${ACTION_PREFIX}LOAD_CLOUD_MAP_ERROR`
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
export const exportFileToCloud: (p: ExportFileToCloudPayload) => {
  type: typeof ActionTypes.EXPORT_FILE_TO_CLOUD;
  payload: ExportFileToCloudPayload;
} = createAction(ActionTypes.EXPORT_FILE_TO_CLOUD, (payload: ExportFileToCloudPayload) => ({
  payload
}));

/** EXPORT_FILE_SUCCESS */
export type ExportFileSuccessPayload = {
  response: any;
  provider: Provider;
  options?: ExportFileOptions;
  onSuccess?: OnSuccessCallBack;
  closeModal?: boolean;
};

export const exportFileSuccess: (p: ExportFileSuccessPayload) => {
  type: typeof ActionTypes.EXPORT_FILE_SUCCESS;
  payload: ExportFileSuccessPayload;
} = createAction(ActionTypes.EXPORT_FILE_SUCCESS, (payload: ExportFileSuccessPayload) => ({
  payload
}));

/** EXPORT_FILE_ERROR */
export type ExportFileErrorPayload = {
  error: any;
  provider: Provider;
  options?: ExportFileOptions;
  onError?: OnErrorCallBack;
};

export const exportFileError: (p: ExportFileErrorPayload) => {
  type: typeof ActionTypes.EXPORT_FILE_ERROR;
  payload: ExportFileErrorPayload;
} = createAction(ActionTypes.EXPORT_FILE_ERROR, (payload: ExportFileErrorPayload) => ({payload}));

/** POST_SAVE_LOAD_SUCCESS */
export type PostSaveLoadSuccessPayload = string;
export const postSaveLoadSuccess: (p: PostSaveLoadSuccessPayload) => {
  type: typeof ActionTypes.POST_SAVE_LOAD_SUCCESS;
  payload: PostSaveLoadSuccessPayload;
} = createAction(ActionTypes.POST_SAVE_LOAD_SUCCESS, (message: PostSaveLoadSuccessPayload) => ({
  payload: message
}));

export const resetProviderStatus: () => {
  type: typeof ActionTypes.RESET_PROVIDER_STATUS;
} = createAction(ActionTypes.RESET_PROVIDER_STATUS);

/** LOAD_CLOUD_MAP */
export type LoadCloudMapPayload = {
  loadParams: any;
  provider: string;
  onSuccess?: any;
  onError?: OnErrorCallBack;
};
export const loadCloudMap: (p: LoadCloudMapPayload) => {
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
export const loadCloudMapSuccess: (p: LoadCloudMapSuccessPayload) => {
  type: typeof ActionTypes.LOAD_CLOUD_MAP_SUCCESS;
  payload: LoadCloudMapSuccessPayload;
} = createAction(ActionTypes.LOAD_CLOUD_MAP_SUCCESS, (payload: LoadCloudMapSuccessPayload) => ({
  payload
}));

/** LOAD_CLOUD_MAP_ERROR */
export type LoadCloudMapErrorPayload = {
  error: any;
  provider: Provider;
  onError?: OnErrorCallBack;
};
export const loadCloudMapError: (p: LoadCloudMapErrorPayload) => {
  type: typeof ActionTypes.LOAD_CLOUD_MAP_ERROR;
  payload: LoadCloudMapErrorPayload;
} = createAction(ActionTypes.LOAD_CLOUD_MAP_ERROR, (payload: LoadCloudMapErrorPayload) => ({
  payload
}));
