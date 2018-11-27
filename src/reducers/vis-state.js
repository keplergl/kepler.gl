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

import ActionTypes from 'constants/action-types';
import {handleActions} from 'redux-actions';

// updater functions
import {
  INITIAL_VIS_STATE,
  addFilterUpdater,
  addLayerUpdater,
  enlargeFilterUpdater,
  layerClickUpdater,
  layerHoverUpdater,
  mapClickUpdater,
  toggleFilterAnimationUpdater,
  updateAnimationSpeedUpdater,
  receiveMapConfigUpdater,
  resetMapConfigVisStateUpdater,
  loadFilesUpdater,
  loadFilesErrUpdater,
  updateVisDataUpdater,
  removeDatasetUpdater,
  removeFilterUpdater,
  removeLayerUpdater,
  reorderLayerUpdater,
  showDatasetTableUpdater,
  setFilterUpdater,
  setFilterPlotUpdater,
  interactionConfigChangeUpdater,
  updateLayerBlendingUpdater,
  layerConfigChangeUpdater,
  layerTypeChangeUpdater,
  toggleSplitMapUpdater,
  setVisibleLayersForMapUpdater,
  toggleLayerForMapUpdater,
  layerVisConfigChangeUpdater,
  layerVisualChannelChangeUpdater
} from './vis-state-updaters';

const actionHandler = {
  [ActionTypes.ADD_FILTER]: addFilterUpdater,

  [ActionTypes.ADD_LAYER]: addLayerUpdater,

  [ActionTypes.ENLARGE_FILTER]: enlargeFilterUpdater,

  [ActionTypes.INTERACTION_CONFIG_CHANGE]: interactionConfigChangeUpdater,

  [ActionTypes.LAYER_CLICK]: layerClickUpdater,

  [ActionTypes.LAYER_CONFIG_CHANGE]: layerConfigChangeUpdater,

  [ActionTypes.LAYER_HOVER]: layerHoverUpdater,

  [ActionTypes.LAYER_TYPE_CHANGE]: layerTypeChangeUpdater,

  [ActionTypes.LAYER_VIS_CONFIG_CHANGE]: layerVisConfigChangeUpdater,

  [ActionTypes.LAYER_VISUAL_CHANNEL_CHANGE]: layerVisualChannelChangeUpdater,

  [ActionTypes.LOAD_FILES]: loadFilesUpdater,

  [ActionTypes.LOAD_FILES_ERR]: loadFilesErrUpdater,

  [ActionTypes.MAP_CLICK]: mapClickUpdater,

  [ActionTypes.RECEIVE_MAP_CONFIG]: receiveMapConfigUpdater,

  [ActionTypes.REMOVE_DATASET]: removeDatasetUpdater,

  [ActionTypes.REMOVE_FILTER]: removeFilterUpdater,

  [ActionTypes.REMOVE_LAYER]: removeLayerUpdater,

  [ActionTypes.REORDER_LAYER]: reorderLayerUpdater,

  [ActionTypes.RESET_MAP_CONFIG]: resetMapConfigVisStateUpdater,

  [ActionTypes.SET_FILTER]: setFilterUpdater,

  [ActionTypes.SET_FILTER_PLOT]: setFilterPlotUpdater,

  [ActionTypes.SET_VISIBLE_LAYERS_FOR_MAP]: setVisibleLayersForMapUpdater,

  [ActionTypes.SHOW_DATASET_TABLE]: showDatasetTableUpdater,

  [ActionTypes.TOGGLE_FILTER_ANIMATION]: toggleFilterAnimationUpdater,

  [ActionTypes.UPDATE_FILTER_ANIMATION_SPEED]: updateAnimationSpeedUpdater,

  [ActionTypes.TOGGLE_LAYER_FOR_MAP]: toggleLayerForMapUpdater,

  [ActionTypes.TOGGLE_SPLIT_MAP]: toggleSplitMapUpdater,

  [ActionTypes.UPDATE_LAYER_BLENDING]: updateLayerBlendingUpdater,

  // currently not used
  // but may be useful if users import vist state reducer
  [ActionTypes.UPDATE_VIS_DATA]: updateVisDataUpdater
};

// construct vis-state reducer
export const visStateReducerFactory = (initialState = {}) =>
  handleActions(actionHandler, {
    ...INITIAL_VIS_STATE,
    ...initialState,
    initialState
  });

export default visStateReducerFactory();
