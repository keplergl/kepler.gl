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

import Task, {taskCreator} from 'react-palm/tasks';
import {json as requestJson} from 'd3-request';
import {readFileInBatches, processFileData} from '../processors/file-handler';

export const LOAD_FILE_TASK = Task.fromPromise(
  ({file, fileCache, loaders, loadOptions}) =>
    readFileInBatches({file, fileCache, loaders, loadOptions}),
  'LOAD_FILE_TASK'
);

export const PROCESS_FILE_DATA = Task.fromPromise(
  processFileData,

  'PROCESS_FILE_CONTENT'
);

export const LOAD_MAP_STYLE_TASK = taskCreator(
  ({url, id}, success, error) =>
    requestJson(url, (err, result) => {
      if (err) {
        error(err);
      } else {
        if (!result) {
          error(new Error('Map style response is empty'));
        }
        success({id, style: result});
      }
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

export const GET_SAVED_MAPS_TASK = Task.fromPromise(
  provider => provider.listMaps(),

  'GET_SAVED_MAPS_TASK'
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
