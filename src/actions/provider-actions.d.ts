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
import {SavedMap} from 'schemas';
import {MapListItem, Provider} from 'cloud-providers';

type ProviderActionTypes = {
  EXPORT_FILE_TO_CLOUD: string;
  EXPORT_FILE_SUCCESS: string;
  EXPORT_FILE_ERROR: string;
  RESET_PROVIDER_STATUS: string;
  SET_CLOUD_PROVIDER: string;
  POST_SAVE_LOAD_SUCCESS: string;
  LOAD_CLOUD_MAP: string;
  LOAD_CLOUD_MAP_SUCCESS: string;
  LOAD_CLOUD_MAP_ERROR: string;
  GET_SAVED_MAPS: string;
  GET_SAVED_MAPS_SUCCESS: string;
  GET_SAVED_MAPS_ERROR: string;
};

/** EXPORT_FILE_TO_CLOUD */
export type MapData = {
  map: SavedMap;
  thumbnail: Blob | null;
};
export type ExportFileOptions = {
  isPublic?: boolean;
  overwrite?: boolean;
};
export type ExportFileToCloudPayload = {
  mapData: MapData;
  provider: Provider;
  options: ExportFileOptions;
  onSuccess?: any;
  onError?: any;
  closeModal?: boolean;
};
export function exportFileToCloud(
  p: ExportFileToCloudPayload
): {
  type: ProviderActionTypes.EXPORT_FILE_TO_CLOUD;
  payload: ExportFileToCloudPayload;
};

/** EXPORT_FILE_SUCCESS */
export type ExportFileSuccessPayload = {
  response: any;
  provider: Provider;
  options?: ExportFileOptions;
  onSuccess?: any;
  closeModal?: booleam;
};
export function exportFileSuccess(
  p: ExportFileSuccessPayload
): {
  type: ProviderActionTypes.EXPORT_FILE_SUCCESS;
  payload: ExportFileSuccessPayload;
};

/** EXPORT_FILE_ERROR */
export type ExportFileErrorPayload = {
  error: any;
  provider: Provider;
  options?: Options;
  onError?: any;
};

export function exportFileError(
  p: ExportFileErrorPayload
): {
  type: ProviderActionTypes.EXPORT_FILE_ERROR;
  payload: ExportFileErrorPayload;
};

/** RESET_PROVIDER_STATUS */
export function resetProviderStatus(): {
  type: ProviderActionTypes.RESET_PROVIDER_STATUS;
};

/** SET_CLOUD_PROVIDER */
export type SetCloudProviderPayload = string;
export function setCloudProvider(
  p: SetCloudProviderPayload
): {
  type: ProviderActionTypes.SET_CLOUD_PROVIDER;
  payload: SetCloudProviderPayload;
};

/** POST_SAVE_LOAD_SUCCESS */
export type PostSaveLoadSuccessPayload = string;
export function postSaveLoadSuccess(
  p: PostSaveLoadSuccessPayload
): {
  type: ProviderActionTypes.POST_SAVE_LOAD_SUCCESS;
  payload: PostSaveLoadSuccessPayload;
};

/** LOAD_CLOUD_MAP */
export type LoadCloudMapPayload = {
  loadParams: any;
  provider: string;
  onSuccess?: any;
  onError?: any;
};
export function loadCloudMap(
  p: LoadCloudMapPayload
): {
  type: ProviderActionTypes.LOAD_CLOUD_MAP;
  payload: LoadCloudMapPayload;
};

/** LOAD_CLOUD_MAP_SUCCESS */
export type LoadCloudMapSuccessPayload = {
  response: any;
  loadParams: any;
  provider: string;
  onSuccess?: any;
  onError?: any;
};
export function loadCloudMapSuccess(
  p: LoadCloudMapSuccessPayload
): {
  type: ProviderActionTypes.LOAD_CLOUD_MAP_SUCCESS;
  payload: LoadCloudMapSuccessPayload;
};

/** LOAD_CLOUD_MAP_ERROR */
export type LoadCloudMapErrorPayload = {
  error: any;
  provider: stirng;
  onError?: any;
};
export function loadCloudMapError(
  p: LoadCloudMapErrorPayload
): {
  type: ProviderActionTypes.LOAD_CLOUD_MAP_ERROR;
  payload: LoadCloudMapErrorPayload;
};

/** GET_SAVED_MAPS */
export type GetSavedMapsPayload = string;
export function getSavedMaps(
  p: GetSavedMapsPayload
): {
  type: ProviderActionTypes.GET_SAVED_MAPS;
  payload: GetSavedMapsPayload;
};

/** GET_SAVED_MAPS_SUCCESS */
export type GetSavedMapsSuccessPayload = {
  visualizations: MapListItem[];
  provider: string;
};
export function getSavedMapsSuccess(
  p: GetSavedMapsSuccessPayload
): {
  type: ProviderActionTypes.GET_SAVED_MAPS_SUCCESS;
  payload: GetSavedMapsSuccessPayload;
};

/** GET_SAVED_MAPS_ERROR */
export type GetSavedMapsErrorPayload = {
  error: any;
  provider: string;
};
export function getSavedMapsError(
  p: GetSavedMapsErrorPayload
): {
  type: ProviderActionTypes.GET_SAVED_MAPS_ERROR;
  payload: GetSavedMapsErrorPayload;
};

export const ActionTypes: ProviderActionTypes;
