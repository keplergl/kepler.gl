// Copyright (c) 2023 Uber Technologies, Inc.
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

import {ActionTypes} from '@kepler.gl/actions';
import * as combinedUpdaters from './combined-updaters';

/**
 * Important: Do not rename `actionHandler` or the assignment pattern of property value.
 * It is used to generate documentation
 */
const actionHandler = {
  [ActionTypes.ADD_DATA_TO_MAP]: combinedUpdaters.addDataToMapUpdater,
  [ActionTypes.MAP_STYLE_CHANGE]: combinedUpdaters.combinedMapStyleChangeUpdater,
  [ActionTypes.LAYER_TYPE_CHANGE]: combinedUpdaters.combinedLayerTypeChangeUpdater,
  [ActionTypes.LOAD_FILES_SUCCESS]: combinedUpdaters.loadFilesSuccessUpdater,
  [ActionTypes.TOGGLE_SPLIT_MAP]: combinedUpdaters.toggleSplitMapUpdater,
  [ActionTypes.REPLACE_DATA_IN_MAP]: combinedUpdaters.replaceDataInMapUpdater
};

export default actionHandler;
