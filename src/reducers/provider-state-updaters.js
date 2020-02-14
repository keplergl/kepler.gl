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
import window from 'global/window';
import {generateHashId, getError, isPlainObject} from 'utils/utils';
import {
  EXPORT_FILE_TO_CLOUD_TASK,
  ACTION_TASK,
  DELAY_TASK,
  LOAD_CLOUD_MAP_TASK,
  GET_SAVED_MAPS_TASK
} from 'tasks/tasks';
import {
  exportFileSuccess,
  exportFileError,
  saveToCloudSuccess,
  loadCloudMapSuccess,
  getSavedMapsSuccess,
  getSavedMapsError
} from 'actions/provider-actions';
import {
  removeNotification,
  toggleModal,
  addNotification
} from 'actions/ui-state-actions';
import {addDataToMap} from 'actions/actions';
import {
  DEFAULT_NOTIFICATION_TYPES,
  DEFAULT_NOTIFICATION_TOPICS,
  DATASET_FORMATS
} from 'constants/default-settings';
import {toArray} from 'utils/utils';
import KeplerGlSchema from 'schemas';

export const INITIAL_PROVIDER_STATE = {
  isProviderLoading: false,
  providerError: null,
  currentProvider: null,
  successInfo: {}
};
import {DATASET_HANDLERS} from 'processors/data-processor';

function createFileJson(mapData = {}) {
  if (!window.Blob || !window.File) {
    return {file: null, fileName: null};
  }
  const {map = {}, info = {}} = mapData;
  const data = JSON.stringify(map);
  const newBlob = new window.Blob([data], {type: 'application/json'});

  // TODO: Allow user import file name
  const name =
    info.title && info.title.length
      ? info.title
      : `keplergl_${generateHashId(6)}`;
  const fileName = `${name}.json`;

  return {file: new window.File([newBlob], fileName), fileName};
}

function createActionTask(action, payload) {
  if (typeof action === 'function') {
    return ACTION_TASK().map(_ => action(payload));
  }

  return null;
}

function _validateProvider(provider, method) {
  if (!provider) {
    Console.error(`provider is not defined`);
    return false;
  }

  if (typeof provider[method] !== 'function') {
    Console.error(
      `${method} is not a function of Cloud provider: ${provider.name}`
    );
    return false;
  }

  return true;
}

function createGlobalNotificationTasks({type, message, delayClose = true}) {
  const id = generateHashId();
  const successNote = {
    id,
    type:
      DEFAULT_NOTIFICATION_TYPES[type] || DEFAULT_NOTIFICATION_TYPES.success,
    topic: DEFAULT_NOTIFICATION_TOPICS.global,
    message
  };
  const task = ACTION_TASK().map(_ => addNotification(successNote));
  return delayClose
    ? [task, DELAY_TASK(3000).map(_ => removeNotification(id))]
    : [task];
}

/**
 * This method will export the current kepler config file to the chosen cloud proder
 * add returns a share URL
 *
 * @param {*} state
 * @param {*} action
 */
export const exportFileToCloudUpdater = (state, action) => {
  const {
    mapData,
    provider,
    isPublic,
    onSuccess,
    onError,
    closeModal
  } = action.payload;

  if (!_validateProvider(provider, 'uploadMap')) {
    return state;
  }
  // TODO: do we need to always create a fileBlob?
  // if this is provider specific, we should just send over the json
  // and let provider decide what format to use
  const {file, fileName} = createFileJson(mapData);

  const newState = {
    ...state,
    isProviderLoading: true,
    currentProvider: provider.name
  };

  // payload called by provider.uploadMap
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
    isProviderLoading: false,
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
  const message =
    action.payload || `Saved to ${state.currentProvider} successfully`;

  const tasks = [
    ACTION_TASK().map(_ => toggleModal(null)),
    ...createGlobalNotificationTasks({message})
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
  console.log(error);
  const newState = {
    ...state,
    isProviderLoading: false,
    providerError: getError(error)
  };

  const task = createActionTask(onError, {error, provider});

  return task ? withTask(newState, task) : newState;
};

export const loadCloudMapUpdater = (state, action) => {
  const {map, provider, onSuccess, onError} = action.payload;

  if (!_validateProvider(provider, 'downloadMap')) {
    return state;
  }

  const newState = {
    ...state,
    isProviderLoading: true
  };

  // payload called by provider.downloadMap
  const uploadFileTask = LOAD_CLOUD_MAP_TASK({provider, payload: map}).bimap(
    // success
    response => loadCloudMapSuccess({response, provider, onSuccess, onError}),
    // error
    error => exportFileErrorUpdater({error, provider, onError})
  );

  return withTask(newState, uploadFileTask);
};

function checkLoadMapResponseError(response) {
  if (!response || !isPlainObject(response)) {
    return new Error('Load map response is empty');
  }
  if (!isPlainObject(response.map)) {
    return new Error(`Load map response should be an object property "map"`);
  }
  if (!response.map.datasets || !response.map.config) {
    return new Error(
      `Load map response.map should be an object with property datasets or config`
    );
  }

  return null;
}

function getDatasetHandler(format) {
  const defaultHandler = DATASET_HANDLERS[DATASET_FORMATS.csv];
  if (!format) {
    Console.warn(
      'format is not provided in load map response, will use csv by default'
    );
    return defaultHandler;
  }

  if (!DATASET_HANDLERS[format]) {
    const supportedFormat = Object.keys(DATASET_FORMATS)
      .map(k => `'${k}'`)
      .join(', ');
    Console.warn(
      `unknown format ${format}. Please use one of ${supportedFormat}, will use csv by default`
    );
    return defaultHandler;
  }

  return DATASET_HANDLERS[format];
}

function parseLoadMapResponse(response) {
  const {map, format, mapInfo} = response;
  const processorMethod = getDatasetHandler(format);

  const parsedDatasets = toArray(map.datasets).map((ds, i) => {
    if (format === DATASET_FORMATS.keplergl) {
      // no need to obtain id, directly pass them in
      return processorMethod(ds);
    }
    const info = (ds && ds.info) || {id: generateHashId(6)};
    const data = processorMethod(ds.data || ds);
    return {info, data};
  });

  const parsedConfig = map.config
    ? KeplerGlSchema.parseSavedConfig(map.config)
    : null;

  return {datasets: parsedDatasets, config: parsedConfig, mapInfo};
}

export const loadCloudMapSuccessUpdater = (state, action) => {
  const {response, provider, onSuccess, onError} = action.payload;

  const formatError = checkLoadMapResponseError(response);
  if (formatError) {
    // if response format is not correct
    return exportFileErrorUpdater(state, {
      payload: {error: formatError, provider, onError}
    });
  }

  const newState = {
    ...state,
    isProviderLoading: false
  };

  const payload = parseLoadMapResponse(response);

  const tasks = [
    ACTION_TASK().map(_ => addDataToMap(payload)),
    createActionTask(onSuccess, {response, provider}),
    ACTION_TASK().map(_ =>
      saveToCloudSuccess(`Map from ${provider.name} loaded`)
    )
  ].filter(d => d);

  return tasks.length ? withTask(newState, tasks) : newState;
};
/**
 *
 * @param {*} state
 * @param {*} action
 */
export const resetProviderStatusUpdater = (state, action) => ({
  ...state,
  isProviderLoading: false,
  error: null,
  successInfo: {}
});

/**
 * Set current cloudProvider
 * @param {*} state
 * @param {*} action
 */
export const setCloudProviderUpdater = (state, action) => ({
  ...state,
  currentProvider: action.payload
});

export const getSavedMapsUpdater = (state, action) => {
  const provider = action.payload;
  if (!_validateProvider(provider, 'listMaps')) {
    return state;
  }

  const getSavedMapsTask = GET_SAVED_MAPS_TASK(provider).bimap(
    // success
    visualizations => getSavedMapsSuccess({visualizations, provider}),
    // error
    error => getSavedMapsError({error, provider})
  );

  return withTask(
    {
      ...state,
      isProviderLoading: true
    },
    getSavedMapsTask
  );
};

export const getSavedMapsSuccessUpdater = (state, action) => ({
  ...state,
  isProviderLoading: false,
  visualizations: action.payload.visualizations
});

export const getSavedMapsErrorUpdater = (state, action) => {
  const message =
    getError(action.payload.error) ||
    `Error getting saved maps from ${state.currentProvider}`;

  const newState = {
    ...state,
    currentProvider: null,
    isProviderLoading: false
  };

  return withTask(
    newState,
    createGlobalNotificationTasks({type: 'error', message})
  );
};
