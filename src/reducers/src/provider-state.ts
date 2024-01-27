// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {handleActions} from 'redux-actions';
import * as providerStateUpdaters from './provider-state-updaters';
import {ProviderActionTypes as ActionTypes} from '@kepler.gl/actions';

/**
 * Important: Do not rename `actionHandler` or the assignment pattern of property value.
 * It is used to generate documentation
 */
const actionHandler = {
  [ActionTypes.EXPORT_FILE_TO_CLOUD]: providerStateUpdaters.exportFileToCloudUpdater,
  [ActionTypes.EXPORT_FILE_SUCCESS]: providerStateUpdaters.exportFileSuccessUpdater,
  [ActionTypes.EXPORT_FILE_ERROR]: providerStateUpdaters.exportFileErrorUpdater,
  [ActionTypes.RESET_PROVIDER_STATUS]: providerStateUpdaters.resetProviderStatusUpdater,
  [ActionTypes.POST_SAVE_LOAD_SUCCESS]: providerStateUpdaters.postSaveLoadSuccessUpdater,
  [ActionTypes.LOAD_CLOUD_MAP]: providerStateUpdaters.loadCloudMapUpdater,
  [ActionTypes.LOAD_CLOUD_MAP_SUCCESS]: providerStateUpdaters.loadCloudMapSuccessUpdater,
  [ActionTypes.LOAD_CLOUD_MAP_ERROR]: providerStateUpdaters.loadCloudMapErrorUpdater
};

// construct provider-state reducer
export const providerStateReducerFactory = (initialState = {}) =>
  // @ts-expect-error
  handleActions(actionHandler, {
    ...providerStateUpdaters.INITIAL_PROVIDER_STATE,
    ...initialState,
    initialState
  });

export default providerStateReducerFactory();
