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

import ActionTypes from 'constants/action-types';
import {UiState} from 'reducers/ui-state-updaters';

export type RegisterEntryUpdaterAction = {
  payload: {
    id: string;
    mint?: boolean;
    mapboxApiAccessToken?: string;
    mapboxApiUrl?: string;
    mapStylesReplaceDefault?: boolean;
    initialUiState?:Partial<UiState>;
  };
};

export function registerEntry(
  entry: RegisterEntryUpdaterAction['payload']
): {
  type: ActionTypes.REGISTER_ENTRY;
  payload: RegisterEntryUpdaterAction['payload'];
};

export function deleteEntry(id: string): {type: ActionTypes.DELETE_ENTRY; payload: string};

export function renameEntry(
  oldId: string,
  newId: string
): {
  type: ActionTypes.RENAME_ENTRY;
  payload: {
    oldId: string;
    newId: string;
  };
};
