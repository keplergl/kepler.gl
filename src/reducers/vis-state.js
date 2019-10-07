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

import ActionTypes from 'constants/action-types';
import {handleActions} from 'redux-actions';
import * as visStateUpdaters from './vis-state-updaters';

/**
 * Important: Do not rename `actionHandler` or the assignment pattern of property value.
 * It is used to generate documentation
 */
const actionHandler = {
  [ActionTypes.ADD_FILTER]: visStateUpdaters.addFilterUpdater,

  [ActionTypes.ADD_LAYER]: visStateUpdaters.addLayerUpdater,

  [ActionTypes.ENLARGE_FILTER]: visStateUpdaters.enlargeFilterUpdater,

  [ActionTypes.INTERACTION_CONFIG_CHANGE]: visStateUpdaters.interactionConfigChangeUpdater,

  [ActionTypes.LAYER_CLICK]: visStateUpdaters.layerClickUpdater,

  [ActionTypes.LAYER_CONFIG_CHANGE]: visStateUpdaters.layerConfigChangeUpdater,

  [ActionTypes.LAYER_HOVER]: visStateUpdaters.layerHoverUpdater,

  [ActionTypes.LAYER_TYPE_CHANGE]: visStateUpdaters.layerTypeChangeUpdater,

  [ActionTypes.LAYER_VIS_CONFIG_CHANGE]: visStateUpdaters.layerVisConfigChangeUpdater,

  [ActionTypes.LAYER_TEXT_LABEL_CHANGE]: visStateUpdaters.layerTextLabelChangeUpdater,

  [ActionTypes.LAYER_VISUAL_CHANNEL_CHANGE]: visStateUpdaters.layerVisualChannelChangeUpdater,

  [ActionTypes.LAYER_COLOR_UI_CHANGE]: visStateUpdaters.layerColorUIChangeUpdater,

  [ActionTypes.LOAD_FILES]: visStateUpdaters.loadFilesUpdater,

  [ActionTypes.LOAD_FILES_ERR]: visStateUpdaters.loadFilesErrUpdater,

  [ActionTypes.MAP_CLICK]: visStateUpdaters.mapClickUpdater,

  [ActionTypes.MOUSE_MOVE]: visStateUpdaters.mouseMoveUpdater,

  [ActionTypes.RECEIVE_MAP_CONFIG]: visStateUpdaters.receiveMapConfigUpdater,

  [ActionTypes.REMOVE_DATASET]: visStateUpdaters.removeDatasetUpdater,

  [ActionTypes.REMOVE_FILTER]: visStateUpdaters.removeFilterUpdater,

  [ActionTypes.REMOVE_LAYER]: visStateUpdaters.removeLayerUpdater,

  [ActionTypes.REORDER_LAYER]: visStateUpdaters.reorderLayerUpdater,

  [ActionTypes.RESET_MAP_CONFIG]: visStateUpdaters.resetMapConfigUpdater,

  [ActionTypes.SET_FILTER]: visStateUpdaters.setFilterUpdater,

  [ActionTypes.SET_FILTER_PLOT]: visStateUpdaters.setFilterPlotUpdater,

  [ActionTypes.SET_VISIBLE_LAYERS_FOR_MAP]: visStateUpdaters.setVisibleLayersForMapUpdater,

  [ActionTypes.SHOW_DATASET_TABLE]: visStateUpdaters.showDatasetTableUpdater,

  [ActionTypes.TOGGLE_FILTER_ANIMATION]: visStateUpdaters.toggleFilterAnimationUpdater,

  [ActionTypes.UPDATE_FILTER_ANIMATION_SPEED]: visStateUpdaters.updateFilterAnimationSpeedUpdater,

  [ActionTypes.UPDATE_ANIMATION_TIME]: visStateUpdaters.updateAnimationTimeUpdater,

  [ActionTypes.UPDATE_LAYER_ANIMATION_SPEED]: visStateUpdaters.updateLayerAnimationSpeedUpdater,

  [ActionTypes.TOGGLE_LAYER_FOR_MAP]: visStateUpdaters.toggleLayerForMapUpdater,

  [ActionTypes.TOGGLE_SPLIT_MAP]: visStateUpdaters.toggleSplitMapUpdater,

  [ActionTypes.UPDATE_LAYER_BLENDING]: visStateUpdaters.updateLayerBlendingUpdater,

  [ActionTypes.UPDATE_VIS_DATA]: visStateUpdaters.updateVisDataUpdater
};

// construct vis-state reducer
export const visStateReducerFactory = (initialState = {}) =>
  handleActions(actionHandler, {
    ...visStateUpdaters.INITIAL_VIS_STATE,
    ...initialState,
    initialState
  });

export default visStateReducerFactory();
