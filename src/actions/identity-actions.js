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
 * Add a new entry in the root reducer
 * @param {Object} payload
 * @param {string} payload.id
 * @param {Boolean} payload.mint
 * @param {string} payload.mapboxApiAccessToken
 * @public
 */
export const registerEntry = createAction(
  ActionTypes.REGISTER_ENTRY,
  ({id, mint, mapboxApiAccessToken}) => ({id, mint, mapboxApiAccessToken})
);

/**
 *
 * Toggle between 3d and 2d map.
 * @param {string} id
 * @public
 */
export const deleteEntry = createAction(
  ActionTypes.DELETE_ENTRY,
  id => id
);

/**
 *
 * Toggle between 3d and 2d map.
 * @param {void}
 * @public
 */
export const renameEntry = createAction(
  ActionTypes.RENAME_ENTRY,
  (oldId, newId) => ({oldId, newId})
);
