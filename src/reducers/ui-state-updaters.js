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

import {LAYER_CONFIG_ID, DELETE_DATA_ID} from 'constants/default-settings';

/* Updaters */
export const toggleSidePanelUpdater = (state, {payload: id}) => {
  if (id === state.activeSidePanel) {
    return state;
  }

  if (id === LAYER_CONFIG_ID) {
    return {
      ...state,
      isNavCollapsed: true,
      currentModal: id
    };
  }

  return {
    ...state,
    isNavCollapsed: true,
    activeSidePanel: id
  };
};

export const toggleModalUpdater = (state, {payload: id}) => ({
  ...state,
  currentModal: id
});

export const openDeleteModalUpdater = (
  state,
  {payload: datasetKeyToRemove}
) => ({
  ...state,
  currentModal: DELETE_DATA_ID,
  datasetKeyToRemove
});
