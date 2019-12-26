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

import {taskCreator} from 'react-palm/tasks';
import {json as requestJson} from 'd3-request';
import console from 'global/console';

export const LOAD_FILE_TASK = taskCreator(
  ({fileBlob, info, handler, processor}, success, error) => {
    console.time('loadFileTask');
    return handler(fileBlob, processor)
      .then(result => {
        if (!result) {
          // TODO: capture in the UI and show message
          error(new Error('File to load data, result is empty'));
        } else {
          // we are trying to standardize the shape of our return
          // since we start using the kepler.json format
          // result has both datasets and info
          // TODO: I think we should pass info to the handler and return
          // the same format back from the file handler
          console.timeEnd('loadFileTask');

          if (result.datasets) { // this is coming from parsing keplergl.json file
            success(result); // info is already part of datasets
          }
          success({datasets: {data: result, info}});
        }
      })
      .catch(err => {
        console.log(err);
        error(err)
      })

    },

  'LOAD_FILE_TASK'
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
        success({id, style: result})
      }
    }),

  'LOAD_MAP_STYLE_TASK'
);
