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

import {handleActions} from 'redux-actions';
import * as providerStateUpdaters from './provider-state-updaters';
import {ActionTypes} from 'actions/provider-actions';

/**
 * Important: Do not rename `actionHandler` or the assignment pattern of property value.
 * It is used to generate documentation
 */
const actionHandler = {
  [ActionTypes.EXPORT_FILE_TO_CLOUD]: providerStateUpdaters.exportFileToCloudUpdater,
  [ActionTypes.EXPORT_FILE_SUCCESS]: providerStateUpdaters.exportFileSuccessUpdater,
  [ActionTypes.EXPORT_FILE_ERROR]: providerStateUpdaters.exportFileErrorUpdater,
  [ActionTypes.RESET_PROVIDER_STATUS]: providerStateUpdaters.resetProviderStatusUpdater,
  [ActionTypes.SET_CLOUD_PROVIDER]: providerStateUpdaters.setCloudProviderUpdater,
  [ActionTypes.POST_SAVE_LOAD_SUCCESS]: providerStateUpdaters.postSaveLoadSuccessUpdater,
  [ActionTypes.LOAD_CLOUD_MAP]: providerStateUpdaters.loadCloudMapUpdater,
  [ActionTypes.LOAD_CLOUD_MAP_SUCCESS]: providerStateUpdaters.loadCloudMapSuccessUpdater,
  [ActionTypes.LOAD_CLOUD_MAP_ERROR]: providerStateUpdaters.loadCloudMapErrorUpdater,
  [ActionTypes.GET_SAVED_MAPS]: providerStateUpdaters.getSavedMapsUpdater,
  [ActionTypes.GET_SAVED_MAPS_SUCCESS]: providerStateUpdaters.getSavedMapsSuccessUpdater,
  [ActionTypes.GET_SAVED_MAPS_ERROR]: providerStateUpdaters.getSavedMapsErrorUpdater
};

// construct provider-state reducer
export const providerStateReducerFactory = (initialState = {}) =>
  // @ts-ignore
  handleActions(actionHandler, {
    ...providerStateUpdaters.INITIAL_PROVIDER_STATE,
    ...initialState,
    initialState
  });

export default providerStateReducerFactory();
