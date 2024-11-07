// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import Task, {taskCreator} from 'react-palm/tasks';
import {readFileInBatches, processFileData} from '@kepler.gl/processors';

export const LOAD_FILE_TASK = Task.fromPromise(
  ({file, fileCache, loaders, loadOptions}) =>
    readFileInBatches({file, fileCache, loaders, loadOptions}),
  'LOAD_FILE_TASK'
);

export const PROCESS_FILE_DATA = Task.fromPromise(processFileData, 'PROCESS_FILE_CONTENT');

export const LOAD_MAP_STYLE_TASK = taskCreator(
  ({url, id}, success, error) =>
    fetch(url)
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            error(text);
          });
        }
        return response.json();
      })
      .then(result => {
        if (!result) {
          error(new Error('Map style response is empty'));
        }
        success({id, style: result});
      }),

  'LOAD_MAP_STYLE_TASK'
);

/**
 * task to upload file to cloud provider
 */
export const EXPORT_FILE_TO_CLOUD_TASK = Task.fromPromise(
  ({provider, payload}) => provider.uploadMap(payload),

  'EXPORT_FILE_TO_CLOUD_TASK'
);

export const LOAD_CLOUD_MAP_TASK = Task.fromPromise(
  ({provider, payload}) => provider.downloadMap(payload),

  'LOAD_CLOUD_MAP_TASK'
);

/**
 *  task to dispatch a function as a task
 */
export const ACTION_TASK = Task.fromCallback(
  (_, cb) => cb(),

  'ACTION_TASK'
);

export const DELAY_TASK = Task.fromCallback(
  (delay, cb) => window.setTimeout(() => cb(), delay),

  'DELAY_TASK'
);

export const UNWRAP_TASK = Task.fromPromise(
  promise => promise,

  'UNWRAP'
);
