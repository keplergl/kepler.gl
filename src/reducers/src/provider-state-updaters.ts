// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {withTask} from 'react-palm/tasks';
import Console from 'global/console';
import {generateHashId, getError, isPlainObject, toArray} from '@kepler.gl/utils';
import {
  EXPORT_FILE_TO_CLOUD_TASK,
  ACTION_TASK,
  DELAY_TASK,
  LOAD_CLOUD_MAP_TASK
} from '@kepler.gl/tasks';
import {
  exportFileSuccess,
  exportFileError,
  postSaveLoadSuccess,
  loadCloudMapSuccess,
  loadCloudMapError,
  resetProviderStatus,
  removeNotification,
  toggleModal,
  addNotification,
  addDataToMap,
  ProviderActions
} from '@kepler.gl/actions';
import {
  DEFAULT_NOTIFICATION_TYPES,
  DEFAULT_NOTIFICATION_TOPICS,
  DATASET_FORMATS,
  OVERWRITE_MAP_ID
} from '@kepler.gl/constants';
import {ExportFileToCloudPayload} from '@kepler.gl/types';

import {FILE_CONFLICT_MSG, MapListItem} from '@kepler.gl/cloud-providers';
import {DATASET_HANDLERS} from '@kepler.gl/processors';

type ActionPayload<P> = {
  type?: string;
  payload: P;
};

export type ProviderState = {
  isProviderLoading: boolean;
  isCloudMapLoading: boolean;
  providerError: any;
  currentProvider: string | null;
  successInfo: any;
  mapSaved: null | string;
  initialState?: any;
  visualizations: MapListItem[];
};

export const INITIAL_PROVIDER_STATE: ProviderState = {
  isProviderLoading: false,
  isCloudMapLoading: false,
  providerError: null,
  currentProvider: null,
  successInfo: {},
  mapSaved: null,
  visualizations: []
};

function createActionTask(action, payload) {
  if (typeof action === 'function') {
    return ACTION_TASK().map(() => action(payload));
  }

  return null;
}

function _validateProvider(provider, method) {
  if (!provider) {
    Console.error(`provider is not defined`);
    return false;
  }

  if (typeof provider[method] !== 'function') {
    Console.error(`${method} is not a function of Cloud provider: ${provider.name}`);
    return false;
  }

  return true;
}

function createGlobalNotificationTasks({
  type,
  message,
  delayClose = true
}: {
  type?: string;
  message: string;
  delayClose?: boolean;
}) {
  const id = generateHashId();
  const successNote = {
    id,
    type: DEFAULT_NOTIFICATION_TYPES[type || ''] || DEFAULT_NOTIFICATION_TYPES.success,
    topic: DEFAULT_NOTIFICATION_TOPICS.global,
    message
  };
  const task = ACTION_TASK().map(() => addNotification(successNote));
  return delayClose ? [task, DELAY_TASK(3000).map(() => removeNotification(id))] : [task];
}

/**
 * This method will export the current kepler config file to the chosen cloud proder
 * add returns a share URL
 *
 */
export const exportFileToCloudUpdater = (
  state: ProviderState,
  action: ActionPayload<ExportFileToCloudPayload>
): ProviderState => {
  const {mapData, provider, options = {}, onSuccess, onError, closeModal} = action.payload;

  if (!_validateProvider(provider, 'uploadMap')) {
    return state;
  }

  const newState = {
    ...state,
    isProviderLoading: true,
    currentProvider: provider.name
  };

  // payload called by provider.uploadMap
  const payload = {
    mapData,
    options
  };
  const uploadFileTask = EXPORT_FILE_TO_CLOUD_TASK({provider, payload}).bimap(
    // success
    response => exportFileSuccess({response, provider, options, onSuccess, closeModal}),
    // error
    error => exportFileError({error, provider, options, onError})
  );

  return withTask(newState, uploadFileTask);
};

export const exportFileSuccessUpdater = (
  state: ProviderState,
  action: ActionPayload<ProviderActions.ExportFileSuccessPayload>
): ProviderState => {
  const {response, provider, options = {}, onSuccess, closeModal} = action.payload;

  const newState = {
    ...state,
    isProviderLoading: false,
    // TODO: do we always have to store this?
    successInfo: response,
    ...(!options.isPublic
      ? {
          mapSaved: provider.name
        }
      : {})
  };

  const tasks = [
    createActionTask(onSuccess, {response, provider, options}),
    closeModal &&
      ACTION_TASK().map(() => postSaveLoadSuccess(`Map saved to ${state.currentProvider}!`))
  ].filter(d => d);

  return tasks.length ? withTask(newState, tasks) : newState;
};

/**
 * Close modal on success and display notification
 */
export const postSaveLoadSuccessUpdater = (
  state: ProviderState,
  action: ActionPayload<ProviderActions.PostSaveLoadSuccessPayload>
): ProviderState => {
  const message = action.payload || `Saved / Load to ${state.currentProvider} Success`;

  const tasks = [
    ACTION_TASK().map(() => toggleModal(null)),
    ACTION_TASK().map(() => resetProviderStatus()),
    ...createGlobalNotificationTasks({message})
  ];

  return withTask(state, tasks);
};

export const exportFileErrorUpdater = (
  state: ProviderState,
  action: ActionPayload<ProviderActions.ExportFileErrorPayload>
): ProviderState => {
  const {error, provider, onError} = action.payload;

  const newState = {
    ...state,
    isProviderLoading: false
  };

  if (isFileConflict(error)) {
    newState.mapSaved = provider.name;
    return withTask(newState, [ACTION_TASK().map(() => toggleModal(OVERWRITE_MAP_ID))]);
  }

  newState.providerError = getError(error);
  const task = createActionTask(onError, {error, provider});

  return task ? withTask(newState, task) : newState;
};

export const loadCloudMapUpdater = (
  state: ProviderState,
  action: ActionPayload<ProviderActions.LoadCloudMapPayload>
): ProviderState => {
  const {loadParams, provider, onSuccess, onError} = action.payload;
  if (!loadParams) {
    Console.warn('load map error: loadParams is undefined');
    return state;
  }
  if (!_validateProvider(provider, 'downloadMap')) {
    return state;
  }

  const newState = {
    ...state,
    isProviderLoading: true,
    isCloudMapLoading: true
  };

  // payload called by provider.downloadMap
  const uploadFileTask = LOAD_CLOUD_MAP_TASK({provider, payload: loadParams}).bimap(
    // success
    // @ts-expect-error
    response => loadCloudMapSuccess({response, loadParams, provider, onSuccess, onError}),
    // error
    // @ts-expect-error
    error => loadCloudMapError({error, provider, onError})
  );

  return withTask(newState, uploadFileTask);
};

function isFileConflict(error) {
  return error && error.message === FILE_CONFLICT_MSG;
}

function checkLoadMapResponseError(response) {
  if (!response || !isPlainObject(response)) {
    return new Error('Load map response is empty');
  }
  if (!isPlainObject(response.map)) {
    return new Error(`Load map response should be an object property "map"`);
  }
  if (!response.map.datasets || !response.map.config) {
    return new Error(`Load map response.map should be an object with property datasets or config`);
  }

  return null;
}

function getDatasetHandler(format) {
  const defaultHandler = DATASET_HANDLERS[DATASET_FORMATS.csv];
  if (!format) {
    Console.warn('format is not provided in load map response, will use csv by default');
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

function parseLoadMapResponse(response, loadParams, provider) {
  const {map, format} = response;
  const processorMethod = getDatasetHandler(format);

  const parsedDatasets = toArray(map.datasets).map(ds => {
    if (format === DATASET_FORMATS.keplergl) {
      // no need to obtain id, directly pass them in
      return processorMethod(ds);
    }
    const info = (ds && ds.info) || {id: generateHashId(6)};
    const data = processorMethod(ds.data || ds);
    return {info, data};
  });

  const info = {
    ...map.info,
    provider: provider.name,
    loadParams
  };
  return {
    datasets: parsedDatasets,
    info,
    ...(map.config ? {config: map.config} : {})
  };
}

export const loadCloudMapSuccessUpdater = (
  state: ProviderState,
  action: ActionPayload<ProviderActions.LoadCloudMapSuccessPayload>
): ProviderState => {
  const {response, loadParams, provider, onSuccess, onError} = action.payload;

  const formatError = checkLoadMapResponseError(response);
  if (formatError) {
    // if response format is not correct
    return exportFileErrorUpdater(state, {
      payload: {error: formatError, provider, onError}
    });
  }

  const newState = {
    ...state,
    mapSaved: provider.name,
    currentProvider: provider.name,
    isCloudMapLoading: false,
    isProviderLoading: false
  };

  const payload = parseLoadMapResponse(response, loadParams, provider);

  const tasks = [
    ACTION_TASK().map(() => addDataToMap(payload)),
    createActionTask(onSuccess, {response, loadParams, provider}),
    ACTION_TASK().map(() => postSaveLoadSuccess(`Map from ${provider.name} loaded`))
  ].filter(d => d);

  return tasks.length ? withTask(newState, tasks) : newState;
};

export const loadCloudMapErrorUpdater = (
  state: ProviderState,
  action: ActionPayload<ProviderActions.LoadCloudMapErrorPayload>
): ProviderState => {
  const message = getError(action.payload.error) || `Error loading saved map`;

  Console.warn(message);

  const newState = {
    ...state,
    isProviderLoading: false,
    isCloudMapLoading: false,
    providerError: null
  };

  return withTask(
    newState,
    createGlobalNotificationTasks({type: 'error', message, delayClose: false})
  );
};

export const resetProviderStatusUpdater = (state: ProviderState): ProviderState => ({
  ...state,
  isProviderLoading: false,
  providerError: null,
  isCloudMapLoading: false,
  successInfo: {}
});
