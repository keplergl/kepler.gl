// Copyright (c) 2019 Uber Technologies, Inc.
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

import {createAction} from 'redux-actions';
import ActionTypes from 'constants/action-types';

/**
 *
 * Add a new instance in the root reducer
 * @param {Object} payload
 * @param {string} payload.id - The id of the instance
 * @param {boolean} payload.mint - Whether to use a fresh empty state, when `mint: true` it will load a fresh state. When `mint: false` will register with existing instance state under the same `id`.
 * @param {string} payload.mapboxApiAccessToken - mapboxApiAccessToken to be saved in map style reducer
 * @public
 */
export const registerEntry = createAction(
  ActionTypes.REGISTER_ENTRY,
  ({id, mint, mapboxApiAccessToken}) => ({id, mint, mapboxApiAccessToken})
);

/**
 *
 * Delete an instance from the root reducer
 * @param {string} id - the id of the instance to be deleted
 * @public
 */
export const deleteEntry = createAction(
  ActionTypes.DELETE_ENTRY,
  id => id
);

/**
 *
 * Rename an instance in the root reducer, keep its entire state
 * @param {string} oldId - old id
 * @param {string} newId - new id
 * @public
 */
export const renameEntry = createAction(
  ActionTypes.RENAME_ENTRY,
  (oldId, newId) => ({oldId, newId})
);
