// Copyright (c) 2018 Uber Technologies, Inc.
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
import request from 'd3-request';
import {getQueryURL} from 'utils/mapzen-utils';

/*
 * request vector building tile from Mapzen
 */
export const LOAD_BUILDING_TILE_TASK = taskCreator(
  ({x, y, z, features}, success, error) =>
    new Promise((resolve, reject) => {
      if (features) {
        resolve(features);
      } else {
        request.json(getQueryURL(x, y, z), (err, result) => {
          if (err) {
            error(err);
          } else if (!result.features) {
            resolve(null);
          } else {
            const cleaned = result.features.filter(
              f =>
                (f.geometry.type === 'Polygon' ||
                  f.geometry.type === 'MultiPolygon') &&
                f.properties.height
            );

            resolve(cleaned);
          }
        });
      }
    }).then(loaded => success(loaded)),

  'LOAD_BUILDING_TILE_TASK'
);

export const LOAD_FILE_TASK = taskCreator(
  ({fileBlob, info, handler, processor}, success, error) =>
    handler(fileBlob, processor)
      .then(result => {
        if (!result) {
          // TODO: capture in the UI and show message
          throw new Error('fail to load data');
        } else {
          success({data: result, info});
        }
      })
      .catch(err => error(err)),

  'LOAD_FILE_TASK'
);
