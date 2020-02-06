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

import {withTask} from 'react-palm/tasks';
import {default as Console} from 'global/console';
import {generateHashId, getError} from 'utils/utils';
import {EXPORT_FILE_TO_CLOUD_TASK, ACTION_TASK, DELAY_TASK} from 'tasks/tasks';
import {exportFileSuccess, exportFileError, saveToCloudSuccess} from 'actions/provider-actions';
import {
  removeNotification,
  toggleModal,
  addNotification
} from 'actions/ui-state-actions';
import {
  DEFAULT_NOTIFICATION_TYPES,
  DEFAULT_NOTIFICATION_TOPICS
} from 'constants/default-settings';

export const INITIAL_PROVIDER_STATE = {
  isLoading: false,
  error: null,
  currentProvider: null,
  successInfo: {}
};

function createFileJson(mapData) {
  const {map, info} = mapData;
  const data = JSON.stringify(map);
  const newBlob = new Blob([data], {type: 'application/json'});

  // TODO: Allow user import file name
  const name =
    info.title && info.title.length
      ? info.title
      : `keplergl_${generateHashId(6)}`;
  const fileName = `${name}.json`;

  return {file: new File([newBlob], fileName), fileName};
}

function createActionTask(action, payload) {
  if (typeof action === 'function') {
    return ACTION_TASK().map(_ => action(payload));
  }

  return null;
}

/**
 * This method will export the current kepler config file to the chosen cloud proder
 * add returns a share URL
 *
 * @param {*} state
 * @param {*} action
 */
export const exportFileToCloudUpdater = (state, action) => {
  const {mapData, provider, isPublic, onSuccess, onError, closeModal} = action.payload;
  console.log(mapData);

  if (!provider) {
    Console.error(`provider is not defined`);
    return state;
  }

  if (typeof provider.uploadFile !== 'function') {
    Console.error(
      `uploadFile is not a function of Cloud provider: ${provider.name}`
    );
    return state;
  }

  // TODO: do we need to always create a fileBlob?
  // if this is provider specific, we should just send over the json
  // and let provider decide what format to use
  const {file, fileName} = createFileJson(mapData);

  const newState = {
    ...state,
    isLoading: true,
    currentProvider: provider.name
  };

  // payload called by provider.uploadFile
  const payload = {
    mapData,
    blob: file,
    fileName,
    isPublic
  };

  const uploadFileTask = EXPORT_FILE_TO_CLOUD_TASK({provider, payload}).bimap(
    // success
    response => exportFileSuccess({response, provider, onSuccess, closeModal}),
    // error
    error => exportFileError({error, provider, onError})
  );

  return withTask(newState, uploadFileTask);
};

/**
 *
 * @param {*} state
 * @param {*} action
 */
export const exportFileSuccessUpdater = (state, action) => {
  const {response, provider, onSuccess, closeModal} = action.payload;

  const newState = {
    ...state,
    isLoading: false,
    // TODO: do we always have to store this?
    successInfo: {
      metaUrl: response.url,
      folderLink: response.folder_link
    }
  };

  const tasks = [
    createActionTask(onSuccess, {response, provider}),
    closeModal && ACTION_TASK().map(_ => saveToCloudSuccess())
  ].filter(d => d);

  return tasks.length ? withTask(newState, tasks) : newState;
};

/**
 * Close modal on success and display notification
 * @param {*} state
 * @param {*} action
 */
export const saveToCloudSuccessUpdater = (state, action) => {
  const id = generateHashId();
  const successNote = {
    id,
    type: DEFAULT_NOTIFICATION_TYPES.success,
    topic: DEFAULT_NOTIFICATION_TOPICS.global,
    message: `Saved to ${state.currentProvider} successfully`
  };

  const tasks = [
    ACTION_TASK().map(_ => toggleModal(null)),
    ACTION_TASK().map(_ => addNotification(successNote)),
    DELAY_TASK(3000).map(_ => removeNotification(id))
  ];

  return withTask(state, tasks);
};

/**
 *
 * @param {*} state
 * @param {*} action
 */
export const exportFileErrorUpdater = (state, action) => {
  const {error, provider, onError} = action.payload;
  const newState = {
    ...state,
    isLoading: false,
    error: getError(error)
  };

  const task = createActionTask(onError, {error, provider});

  return task ? withTask(newState, task) : newState;
};

/**
 *
 * @param {*} state
 * @param {*} action
 */
export const resetProviderStatusUpdater = (state, action) => ({
  ...state,
  isLoading: false,
  error: null,
  successInfo: {}
});

export const setCloudProviderUpdater = (state, action) => ({
  ...state,
  currentProvider: action.payload
});
